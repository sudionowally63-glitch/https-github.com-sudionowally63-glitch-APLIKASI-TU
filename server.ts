import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to get Google Apps Script URL
  const getAppUrl = () => {
    try {
      let content = fs.readFileSync("app.txt", "utf8").trim();
      if (content.startsWith("DEPLOY_URL=")) {
        content = content.replace("DEPLOY_URL=", "").trim();
      }
      return content;
    } catch (e) {
      return "";
    }
  };

  // Helper to safely fetch and parse JSON from Google Apps Script Web App with 15s timeout
  const fetchGoogleAppsScript = async (url: string, options: RequestInit = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();

      if (!response.ok) {
        if (text.includes("accounts.google.com") || text.includes("Google Accounts")) {
          return {
            success: false,
            message: "Akses ditolak oleh Google. Google Apps Script Web App Anda mendeteksi perlunya login Google. Harap deploy ulang dengan menyetel 'Who has access' (Siapa yang memiliki akses) menjadi 'Anyone' (Siapa saja).",
            error: "Google Authentication Required"
          };
        }
        return {
          success: false,
          message: `Server Google Apps Script mengembalikan status error: ${response.status} ${response.statusText}`,
          error: `HTTP Error ${response.status}`
        };
      }

      // Check if response has Google Login redirect pages (often returned as HTML even on success HTTP)
      if (text.includes("accounts.google.com") || text.includes("Google Accounts") || text.includes("signin/v2") || text.includes("Service Login")) {
        console.error("DEBUG CRITICAL: Google Login Redirect Detected. HTML Response:\n", text);
        return {
          success: false,
          message: "Akses ditolak oleh Google (Memerlukan Login). Web App Google Apps Script belum disetel sebagai publik. Harap lakukan 'Deploy ulang' -> Pilih 'Anyone' (Siapa saja) pada opsi 'Who has access'.",
          error: "CORS_OR_AUTH_REQUIRED_HTML"
        };
      }

      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (parseError) {
        console.error("DEBUG ERROR: Invalid JSON response. HTML/Text returned was:\n", text);
        
        if (text.trim().startsWith("<") || text.includes("<html") || text.includes("<HTML") || text.includes("The page")) {
          return {
            success: false,
            message: "Google Apps Script mengembalikan halaman HTML, bukan data JSON. Hal ini biasanya terjadi karena Anda salah menyalin URL spreadsheet atau URL editor, atau status deployment Apps Script Anda belum aktif (belum dideploy sebagai Web App publik).",
            error: "Received HTML instead of JSON"
          };
        }
        return {
          success: false,
          message: `Respon dari Google Apps Script bukan JSON yang valid: ${text.substring(0, 150)}...`,
          error: "Invalid JSON response"
        };
      }
    } catch (networkError: any) {
      clearTimeout(id);
      if (networkError.name === 'AbortError') {
        return {
          success: false,
          message: "Koneksi terputus karena batas waktu (Timeout) terlampaui. Google Apps Script memakan waktu terlalu lama untuk merespon.",
          error: "Request Timeout"
        };
      }
      return {
        success: false,
        message: `Gagal menghubungi Google Apps Script: ${networkError.message || "Koneksi terputus atau offline"}`,
        error: networkError.toString()
      };
    }
  };

  // API route to proxy requests to Google Apps Script
  app.post("/api/sheets", async (req, res) => {
    try {
      const appUrl = getAppUrl();
      if (!appUrl) {
        return res.json({
          success: false,
          message: "URL Google Apps Script belum dikonfigurasi di Pengaturan.",
          error: "Google Apps Script URL not configured in app.txt"
        });
      }
      
      const data = await fetchGoogleAppsScript(appUrl, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" }
      });
      
      res.json(data);
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message || "Terjadi kesalahan saat memproses data.",
        error: error.toString()
      });
    }
  });

  // Get current Google Apps Script URL configuration
  app.get("/api/sheets/url", (req, res) => {
    try {
      const appUrl = getAppUrl();
      res.json({
        success: true,
        message: "URL Google Apps Script berhasil diambil.",
        data: { url: appUrl }
      });
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message || "Gagal mengambil konfigurasi URL.",
        error: error.toString()
      });
    }
  });

  // Save new Google Apps Script URL configuration
  app.post("/api/sheets/url", (req, res) => {
    try {
      const { url } = req.body;
      if (url === undefined) {
        return res.json({
          success: false,
          message: "Parameter 'url' wajib disertakan.",
          error: "Missing 'url' parameter"
        });
      }
      fs.writeFileSync("app.txt", `DEPLOY_URL=${url.trim()}`, "utf8");
      res.json({
        success: true,
        message: "URL Google Apps Script berhasil disimpan.",
        data: { url: url.trim() }
      });
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message || "Gagal menyimpan konfigurasi URL.",
        error: error.toString()
      });
    }
  });

  app.get("/api/sheets", async (req, res) => {
    try {
      const appUrl = getAppUrl();
      if (!appUrl) {
        return res.json({
          success: false,
          message: "URL Google Apps Script belum dikonfigurasi di Pengaturan.",
          error: "Google Apps Script URL not configured in app.txt"
        });
      }
      
      const key = req.query.key;
      const url = key ? `${appUrl}?key=${encodeURIComponent(key as string)}` : appUrl;
      
      const data = await fetchGoogleAppsScript(url);
      res.json(data);
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message || "Terjadi kesalahan saat mengambil data.",
        error: error.toString()
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
