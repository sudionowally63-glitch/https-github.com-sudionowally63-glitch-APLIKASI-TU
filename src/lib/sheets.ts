function dispatchConnectionEvent(status: "connecting" | "online" | "offline" | "reloading", message?: string) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("connection-status-change", {
      detail: { status, message }
    });
    window.dispatchEvent(event);
  }
}

async function safeFetchJson(url: string, options?: RequestInit, retriesLeft = 3, retryDelay = 1500): Promise<any> {
  // If we are at the first try, signal that we are connecting
  if (retriesLeft === 3) {
    // Skip signaling connecting for the background health checks to avoid UI flickers,
    // but signal for main read/writes
    if (!url.includes("key=health")) {
      dispatchConnectionEvent("connecting", "Menghubungkan ke server...");
    }
  }

  try {
    const response = await fetch(url, options);
    
    // Check if response is HTML or JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      const isHtml = text.trim().startsWith("<") || text.includes("<html") || text.includes("<HTML") || text.includes("The page");
      
      if (isHtml) {
        if (retriesLeft > 0) {
          dispatchConnectionEvent("reloading", `Server sedang memuat ulang. Mencoba kembali dalam ${retryDelay/1000}s... (Sisa percobaan: ${retriesLeft})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return safeFetchJson(url, options, retriesLeft - 1, retryDelay * 2);
        }
        dispatchConnectionEvent("offline", "Server mengembalikan halaman HTML. Kemungkinan Web App salah dideploy atau dinonaktifkan.");
        return { 
          error: "Server mengembalikan halaman HTML, bukan JSON. Hal ini biasanya terjadi karena URL Web App salah, belum dideploy, atau Anda perlu mengizinkan akses (deploy dengan Who has access: Anyone)." 
        };
      }
      dispatchConnectionEvent("offline", "Respon server tidak valid.");
      return { error: `Respon server bukan JSON yang valid: ${text.substring(0, 100)}` };
    }

    if (!response.ok || (data && data.success === false)) {
      const errMsg = data?.message || data?.error || `Server error (${response.status})`;
      // Retry for transient server errors (502, 503, 504) or timeouts
      if (retriesLeft > 0 && (response.status >= 500 || errMsg.toLowerCase().includes("timeout") || errMsg.toLowerCase().includes("limit"))) {
        dispatchConnectionEvent("reloading", `Terjadi kesalahan sementara. Mencoba kembali dalam ${retryDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return safeFetchJson(url, options, retriesLeft - 1, retryDelay * 2);
      }
      dispatchConnectionEvent("offline", errMsg);
      return { error: errMsg };
    }

    // Standard unpacking of standard success/data response structure
    if (data && typeof data === "object") {
      if (data.success === false) {
        dispatchConnectionEvent("offline", data.message || data.error);
        return { error: data.message || data.error || "Gagal memproses data di server." };
      }
      if (data.success === true && data.hasOwnProperty("data")) {
        dispatchConnectionEvent("online", "Tersambung ke Google Sheets.");
        return data.data;
      }
    }

    dispatchConnectionEvent("online", "Tersambung.");
    return data;
  } catch (err: any) {
    if (retriesLeft > 0) {
      dispatchConnectionEvent("reloading", `Koneksi gagal. Mencoba kembali dalam ${retryDelay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return safeFetchJson(url, options, retriesLeft - 1, retryDelay * 2);
    }
    dispatchConnectionEvent("offline", err.message || "Gagal menghubungi server.");
    return { error: err.message || "Gagal menghubungi server proxy lokal." };
  }
}

export async function getData(key?: string) {
  const url = key ? `/api/sheets?key=${encodeURIComponent(key)}` : "/api/sheets";
  return await safeFetchJson(url);
}

export async function saveData(key: string, value: any) {
  return await safeFetchJson("/api/sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value })
  });
}

export async function getSheetsUrl() {
  const data = await safeFetchJson("/api/sheets/url");
  return data?.url || "";
}

export async function saveSheetsUrl(url: string) {
  return await safeFetchJson("/api/sheets/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
}
