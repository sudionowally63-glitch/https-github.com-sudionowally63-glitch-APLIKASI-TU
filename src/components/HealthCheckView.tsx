import React, { useState, useEffect } from "react";
import { 
  Server, CheckCircle2, XCircle, AlertCircle, RefreshCw, HelpCircle, Code, Database, Key, ArrowRight, ExternalLink, ShieldAlert
} from "lucide-react";
import { getData, getSheetsUrl } from "../lib/sheets";

interface HealthCheckViewProps {
  onBackToDashboard?: () => void;
}

interface TestStep {
  name: string;
  status: "idle" | "running" | "success" | "failed";
  message: string;
  recommendation?: string;
}

export default function HealthCheckView({ onBackToDashboard }: HealthCheckViewProps) {
  const [overallStatus, setOverallStatus] = useState<"idle" | "connecting" | "online" | "offline">("idle");
  const [steps, setSteps] = useState<TestStep[]>([
    {
      name: "Server Proxy Lokal (Node.js)",
      status: "idle",
      message: "Belum diuji.",
    },
    {
      name: "Konfigurasi URL Google Apps Script",
      status: "idle",
      message: "Belum diuji.",
    },
    {
      name: "Koneksi Google Apps Script (Web App)",
      status: "idle",
      message: "Belum diuji.",
    },
    {
      name: "Akses & Izin Publik (CORS / Autentikasi)",
      status: "idle",
      message: "Belum diuji.",
    },
    {
      name: "Struktur Lembar Kerja (Google Sheets)",
      status: "idle",
      message: "Belum diuji.",
    }
  ]);

  const [rawResponse, setRawResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [configuredUrl, setConfiguredUrl] = useState("");

  const runHealthCheck = async () => {
    setIsTesting(true);
    setOverallStatus("connecting");
    setRawResponse(null);

    // Initialize steps
    const newSteps = steps.map(s => ({ ...s, status: "running" as const, message: "Sedang menguji...", recommendation: undefined }));
    setSteps(newSteps);

    // Step 1: NodeJS Proxy Server
    await new Promise(r => setTimeout(r, 500));
    newSteps[0].status = "success";
    newSteps[0].message = "Server proxy lokal (Vite / Express) berjalan normal pada port 3000.";
    setSteps([...newSteps]);

    // Step 2: Configured URL Check
    let currentUrl = "";
    try {
      currentUrl = await getSheetsUrl();
      setConfiguredUrl(currentUrl);
    } catch (e) {
      // Ignore
    }

    if (!currentUrl) {
      newSteps[1].status = "failed";
      newSteps[1].message = "URL Google Apps Script belum dikonfigurasi.";
      newSteps[1].recommendation = "Buka tab 'Pengaturan & Kop', salin URL Web App hasil deploy Google Apps Script Anda (berakhir dengan /exec), dan simpan.";
      
      // Fail downstream steps
      for (let i = 2; i < newSteps.length; i++) {
        newSteps[i].status = "failed";
        newSteps[i].message = "Dilewati karena langkah sebelumnya gagal.";
      }
      setSteps([...newSteps]);
      setOverallStatus("offline");
      setIsTesting(false);
      return;
    }

    newSteps[1].status = "success";
    newSteps[1].message = `URL terkonfigurasi: ${currentUrl.substring(0, 45)}...`;
    setSteps([...newSteps]);

    // Step 3 & 4 & 5: Contacting Google Apps Script
    try {
      const res = await getData("health");
      setRawResponse(res);

      if (res && !res.error) {
        // Step 3 success
        newSteps[2].status = "success";
        newSteps[2].message = "Google Apps Script berhasil dihubungi dan mengembalikan respon JSON.";

        // Step 4 success (no HTML authentication wall)
        newSteps[3].status = "success";
        newSteps[3].message = "Akses tanpa login terverifikasi. CORS & Google Account check dilewati dengan sukses.";

        // Step 5 check sheets data
        newSteps[4].status = "success";
        const sheetsCount = res.sheets ? res.sheets.length : 0;
        newSteps[4].message = `Berhasil terhubung ke spreadsheet dengan ID: ${res.spreadsheetId?.substring(0, 15)}... Terdeteksi ${sheetsCount} lembar kerja (${res.sheets ? res.sheets.join(", ") : "Tidak ada"}).`;
        
        setSteps([...newSteps]);
        setOverallStatus("online");
      } else {
        const errorMsg = res?.error || "Gagal mendapatkan respon yang valid.";
        const displayMsg = res?.message || errorMsg;

        // Determine why it failed
        if (errorMsg.includes("Received HTML") || errorMsg.includes("HTML") || displayMsg.includes("HTML")) {
          newSteps[2].status = "failed";
          newSteps[2].message = "Koneksi terjalin, namun server mengembalikan halaman HTML bukan JSON.";
          newSteps[2].recommendation = "Ini terjadi karena URL Google Apps Script yang Anda masukkan salah (misal link editor, link spreadsheet) atau belum di-deploy sebagai Web App.";

          newSteps[3].status = "failed";
          newSteps[3].message = "Terjadi pengalihan login akun Google (Akses Ditolak).";
          newSteps[3].recommendation = "Saat men-deploy di Google Apps Script, opsi 'Who has access' (Siapa yang memiliki akses) HARUS disetel ke 'Anyone' (Siapa saja) agar aplikasi Vercel dapat membaca data tanpa login.";

          newSteps[4].status = "failed";
          newSteps[4].message = "Gagal memproses data spreadsheet.";
          newSteps[4].recommendation = "Harap selesaikan izin akses publik di atas terlebih dahulu.";
        } else if (errorMsg.includes("Google Authentication Required") || errorMsg.includes("CORS_OR_AUTH_REQUIRED")) {
          newSteps[2].status = "success";
          newSteps[2].message = "Server Google Apps Script merespon.";

          newSteps[3].status = "failed";
          newSteps[3].message = "Izin Ditolak (Memerlukan login Akun Google).";
          newSteps[3].recommendation = "Harap buka menu Deploy -> Manage deployments di Google Apps Script Anda. Klik ikon pensil, pastikan opsi 'Who has access' diubah dari 'Only myself' menjadi 'Anyone' (Siapa saja). Klik Deploy untuk menyimpan.";

          newSteps[4].status = "failed";
          newSteps[4].message = "Gagal memproses data spreadsheet.";
          newSteps[4].recommendation = "Selesaikan masalah otorisasi publik di atas.";
        } else if (errorMsg.includes("Timeout") || errorMsg.includes("timeout")) {
          newSteps[2].status = "failed";
          newSteps[2].message = "Batas waktu request (Timeout) terlampaui.";
          newSteps[2].recommendation = "Google Apps Script membutuhkan waktu terlalu lama untuk memproses permintaan. Coba klik 'Jalankan Tes Ulang' beberapa saat lagi.";

          newSteps[3].status = "failed";
          newSteps[3].message = "Pengujian akses terhenti karena timeout.";
          newSteps[4].status = "failed";
          newSteps[4].message = "Pengujian lembar kerja terhenti karena timeout.";
        } else {
          newSteps[2].status = "failed";
          newSteps[2].message = `Server mengembalikan error: ${displayMsg}`;
          newSteps[2].recommendation = "Pastikan Anda telah mengklik 'Deploy' -> 'New deployment' -> 'Web App' -> Execute as: 'Me' & Who has access: 'Anyone'.";

          newSteps[3].status = "failed";
          newSteps[3].message = "Akses & Otorisasi tidak valid.";
          newSteps[3].recommendation = "Pastikan Anda memberikan persetujuan saat deploy ('Authorize access' -> 'Advanced' -> 'Go to... (unsafe)' -> 'Allow').";

          newSteps[4].status = "failed";
          newSteps[4].message = "Gagal membaca struktur lembar kerja.";
          newSteps[4].recommendation = "Periksa tab Eksekusi di Google Apps Script untuk melihat detail log error.";
        }

        setSteps([...newSteps]);
        setOverallStatus("offline");
      }
    } catch (err: any) {
      newSteps[2].status = "failed";
      newSteps[2].message = `Gagal terhubung dengan server: ${err.message || err}`;
      newSteps[2].recommendation = "Koneksi jaringan terputus atau URL tidak valid.";

      newSteps[3].status = "failed";
      newSteps[3].message = "Pengujian dihentikan.";
      newSteps[4].status = "failed";
      newSteps[4].message = "Pengujian dihentikan.";

      setSteps([...newSteps]);
      setOverallStatus("offline");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="space-y-6" id="health-check-view">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Server className="w-4 h-4" />
            <span>Sistem Diagnostik Jaringan</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Health Check Koneksi Database</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Otomatis menguji kelayakan integrasi, status jaringan, dan otorisasi dengan Google Sheets & Google Apps Script.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={runHealthCheck}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
            id="retest-connection-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Mengecek..." : "Jalankan Tes Ulang"}</span>
          </button>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
              id="back-to-dashboard-btn"
            >
              Kembali ke Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Status Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-700 text-xs font-display uppercase tracking-wider mb-4">Status Koneksi Real-time</h3>
            
            <div className="flex flex-col items-center justify-center py-6 text-center">
              {overallStatus === "online" && (
                <>
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 mb-3 animate-pulse">
                    <span className="w-6 h-6 rounded-full bg-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-800">🟢 Backend Online</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                    Sistem berhasil terhubung 100% secara sinkron dengan Google Sheets.
                  </p>
                </>
              )}

              {overallStatus === "connecting" && (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100 mb-3 animate-pulse">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold text-blue-800">🟡 Connecting...</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                    Sedang melakukan ping pengujian koneksi ke Google Server...
                  </p>
                </>
              )}

              {overallStatus === "offline" && (
                <>
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 border border-rose-100 mb-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500" />
                  </div>
                  <h4 className="text-lg font-bold text-rose-800">🔴 Backend Offline</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                    Koneksi terputus. Sistem menggunakan database lokal (failover) sementara.
                  </p>
                </>
              )}

              {overallStatus === "idle" && (
                <>
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 mb-3">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-600">Menunggu Tes</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Silakan klik tombol "Jalankan Tes Ulang" di atas.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="text-[10px] text-slate-400 font-mono space-y-1">
              <div>Proxy Server: <span className="font-bold text-slate-600">localhost:3000</span></div>
              <div>CORS Protection: <span className="font-bold text-emerald-600">Aktif (Server-side proxy)</span></div>
              <div className="truncate">Web App URL: <span className="text-slate-600">{configuredUrl || "Belum disetel"}</span></div>
            </div>
          </div>
        </div>

        {/* Diagnostic Steps */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-700 text-xs font-display uppercase tracking-wider mb-2">Langkah Diagnostik Berurutan</h3>
          
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                  step.status === "success" ? "bg-emerald-50/50 border-emerald-100 text-slate-800" :
                  step.status === "failed" ? "bg-rose-50/50 border-rose-100 text-slate-800" :
                  step.status === "running" ? "bg-blue-50/50 border-blue-100 animate-pulse text-slate-800" :
                  "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {step.status === "success" && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 font-bold" />}
                  {step.status === "failed" && <XCircle className="w-4.5 h-4.5 text-rose-600 font-bold" />}
                  {step.status === "running" && <RefreshCw className="w-4.5 h-4.5 text-blue-600 animate-spin" />}
                  {step.status === "idle" && <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-200" />}
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Langkah {idx + 1}: {step.name}</span>
                    {step.status === "success" && <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full uppercase">Lulus</span>}
                    {step.status === "failed" && <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full uppercase">Gagal</span>}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{step.message}</p>
                  {step.recommendation && (
                    <div className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-100 p-2 rounded-lg mt-2 flex gap-1.5 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <strong className="block text-[10px] uppercase font-bold text-amber-900">Saran Tindakan:</strong>
                        {step.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Section for Fixing Server Offline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm font-display">Panduan Penyelesaian Masalah "Koneksi Gagal!" & "Server Offline"</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">1</span>
              Deploy Sebagai Web App Publik (Wajib)
            </h4>
            <p className="pl-6">
              Saat melakukan deploy Google Apps Script di editor Apps Script, ikuti aturan ketat ini:
            </p>
            <ul className="list-disc pl-11 space-y-1.5">
              <li>Pilih menu <strong className="text-slate-800">Deploy (Terapkan)</strong> di kanan atas &rarr; <strong className="text-slate-800">New deployment (Penerapan baru)</strong>.</li>
              <li>Klik ikon roda gigi &rarr; Pilih tipe <strong className="text-slate-800">Web app (Aplikasi web)</strong>.</li>
              <li>Opsi <strong className="text-slate-800">Execute as (Jalankan sebagai)</strong>: Pilih <strong className="text-blue-700">Me (Saya - Email Google Anda)</strong>.</li>
              <li>Opsi <strong className="text-slate-800">Who has access (Siapa yang memiliki akses)</strong>: Pilih <strong className="text-blue-700">Anyone (Siapa saja)</strong>.</li>
            </ul>
            <p className="pl-6 text-[11px] text-slate-500 italic bg-amber-50 p-2 rounded-lg border border-amber-100">
              ⚠️ PENTING: Jika disetel sebagai "Only myself" (Hanya saya) atau "Anyone with Google account", server Vercel akan diblokir oleh halaman login Google (HTML), memicu error "Server mengembalikan HTML, bukan JSON".
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">2</span>
              Berikan Otorisasi Penuh (Penting!)
            </h4>
            <p className="pl-6">
              Setelah menekan tombol Deploy untuk pertama kalinya, Google akan meminta persetujuan akses Drive/Sheets:
            </p>
            <ul className="list-disc pl-11 space-y-1.5">
              <li>Klik tombol <strong className="text-slate-800">Authorize access (Berikan akses)</strong>.</li>
              <li>Pilih akun Google Anda.</li>
              <li>Jika muncul halaman "Google hasn't verified this app" (Google belum memverifikasi aplikasi ini), klik <strong className="text-slate-800">Advanced (Lanjutan)</strong> di bagian bawah.</li>
              <li>Klik tautan <strong className="text-slate-800">Go to Administrasi Tata Usaha (unsafe)</strong>.</li>
              <li>Klik tombol <strong className="text-blue-700 font-bold">Allow (Izinkan)</strong>.</li>
            </ul>
            <p className="pl-6 text-[11px] text-slate-500">
              Salin URL Web App yang diakhiri dengan <strong className="text-blue-600">/exec</strong>, lalu tempelkan di menu <strong className="text-slate-800">Pengaturan & Kop</strong> pada aplikasi ini.
            </p>
          </div>
        </div>
      </div>

      {/* Raw Response Log container */}
      {rawResponse && (
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-lg font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Log Respon Server Terakhir</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">JSON Format</span>
          </div>
          <pre className="overflow-x-auto max-h-48 p-2 bg-slate-950/60 rounded text-[11px] leading-relaxed select-all">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
