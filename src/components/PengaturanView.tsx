import React, { useState, useEffect } from "react";
import { 
  Settings, Image, Save, Trash2, ShieldAlert, CheckCircle, RefreshCw, Link, Database, AlertCircle
} from "lucide-react";
import { Setting } from "../types";
import { getSheetsUrl, saveSheetsUrl, getData } from "../lib/sheets";

interface PengaturanViewProps {
  settings: Setting;
  setSettings: React.Dispatch<React.SetStateAction<Setting>>;
  onWipeData: (targets: {
    siswa: boolean;
    guru: boolean;
    pegawai: boolean;
    kelas: boolean;
    surat: boolean;
    arsip: boolean;
    inventaris: boolean;
  }) => void;
}

export default function PengaturanView({ settings, setSettings, onWipeData }: PengaturanViewProps) {
  const [form, setForm] = useState<Setting>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const getUrlWarning = (url: string) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.includes("docs.google.com/spreadsheets")) {
      return "Peringatan: Ini adalah URL Google Spreadsheet biasa. Anda harus melakukan Deploy Apps Script terlebih dahulu dan menggunakan URL Web App (berakhiran /exec) dari sana.";
    }
    if (trimmed.includes("script.google.com") && trimmed.includes("/edit")) {
      return "Peringatan: Ini adalah URL editor Apps Script. Harap lakukan Deploy -> New Deployment (Penerapan Baru) di kanan atas, lalu salin URL Web App yang berakhiran /exec.";
    }
    if (!trimmed.startsWith("https://script.google.com/macros/s/")) {
      return "Format URL tidak cocok. URL Web App Google Apps Script yang benar harus diawali dengan 'https://script.google.com/macros/s/'";
    }
    if (!trimmed.endsWith("/exec") && !trimmed.includes("/exec?")) {
      return "Saran: URL Web App biasanya diakhiri dengan '/exec'. Harap periksa kembali hasil salinan URL Web App Anda.";
    }
    return null;
  };

  // Load current Google Apps Script URL on mount
  useEffect(() => {
    async function loadUrl() {
      try {
        const url = await getSheetsUrl();
        setSheetsUrl(url);
      } catch (err) {
        console.error("Failed to load Google Sheets URL", err);
      }
    }
    loadUrl();
  }, []);

  // Update form if settings prop changes
  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  // Wipe selections state
  const [wipeTargets, setWipeTargets] = useState({
    siswa: false,
    guru: false,
    pegawai: false,
    kelas: false,
    surat: false,
    arsip: false,
    inventaris: false
  });

  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [wipeSuccess, setWipeSuccess] = useState(false);

  // Base64 logo conversion with compression
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (compressedDataUrl) => {
        setForm(prev => ({ ...prev, kopSekolah: compressedDataUrl }));
      });
    }
  };

  // Base64 logo sekolah conversion for Login & Sidebar with compression
  const handleLogoSekolahUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (compressedDataUrl) => {
        setForm(prev => ({ ...prev, logoSekolah: compressedDataUrl }));
      });
    }
  };

  const compressImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    
    // Save the Google Sheets URL
    try {
      await saveSheetsUrl(sheetsUrl);
    } catch (err) {
      console.error("Failed to save Google Sheets URL", err);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTestingUrl(true);
    setTestStatus(null);
    try {
      // First save the current URL in input
      await saveSheetsUrl(sheetsUrl);
      
      const data = await getData("settings");
      
      if (data && !data.error) {
        setTestStatus({
          success: true,
          message: "Koneksi berhasil! Google Sheets terhubung secara real-time dan sinkron."
        });
      } else {
        setTestStatus({
          success: false,
          message: data?.error || "Gagal menghubungkan. Pastikan URL Web App Anda benar dan dideploy sebagai 'Anyone' (Siapa saja)."
        });
      }
    } catch (err: any) {
      setTestStatus({
        success: false,
        message: err.message || "Gagal menghubungi server lokal untuk proxy."
      });
    } finally {
      setIsTestingUrl(false);
    }
  };

  const handleWipeClick = () => {
    // Check if at least one checkbox is ticked
    const anyChecked = Object.values(wipeTargets).some(v => v === true);
    if (!anyChecked) {
      alert("Silakan pilih minimal satu kategori data yang ingin dihapus!");
      return;
    }
    setConfirmText("");
    setIsWipeModalOpen(true);
  };

  const handleExecuteWipe = () => {
    if (confirmText.toUpperCase() !== "HAPUS") {
      alert("Teks konfirmasi salah! Silakan ketik 'HAPUS' dengan benar.");
      return;
    }
    // Perform wipe
    onWipeData(wipeTargets);
    setIsWipeModalOpen(false);
    
    // Clear selection
    setWipeTargets({
      siswa: false,
      guru: false,
      pegawai: false,
      kelas: false,
      surat: false,
      arsip: false,
      inventaris: false
    });

    setWipeSuccess(true);
    setTimeout(() => setWipeSuccess(false), 4000);
  };

  return (
    <div className="space-y-6" id="settings-view">
      {/* Save configuration success message */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold border border-emerald-100 flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
          Pengaturan sekolah berhasil disimpan dan diperbarui di seluruh ekspor laporan PDF/Excel!
        </div>
      )}

      {/* Wipe success message */}
      {wipeSuccess && (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl font-bold border border-rose-100 flex items-center gap-2 shadow-sm animate-fade-in">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
          Data terpilih berhasil dikosongkan secara permanen dari penyimpanan lokal aplikasi!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form settings & Sync cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 font-display">Konfigurasi Profil & Kop Surat</h3>
              <p className="text-xs text-slate-400">Sesuaikan informasi instansi resmi untuk header Kop Surat laporan PDF ekspor.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lembaga Pendidikan *</label>
                <input
                  type="text"
                  required
                  value={form.namaSekolah}
                  onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">NPSN (Nomor Pokok Sekolah Nasional) *</label>
                <input
                  type="text"
                  required
                  value={form.npsn}
                  onChange={(e) => setForm({ ...form, npsn: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Alamat Resmi Sekolah *</label>
              <input
                type="text"
                required
                value={form.alamatSekolah}
                onChange={(e) => setForm({ ...form, alamatSekolah: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Kepala Sekolah *</label>
                <input
                  type="text"
                  required
                  value={form.namaKepsek}
                  onChange={(e) => setForm({ ...form, namaKepsek: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">NIP Kepala Sekolah *</label>
                <input
                  type="text"
                  required
                  value={form.nipKepsek}
                  onChange={(e) => setForm({ ...form, nipKepsek: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Bendahara / Kaur TU *</label>
                <input
                  type="text"
                  required
                  value={form.namaBendahara}
                  onChange={(e) => setForm({ ...form, namaBendahara: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">NIP Bendahara / Kaur TU *</label>
                <input
                  type="text"
                  required
                  value={form.nipBendahara}
                  onChange={(e) => setForm({ ...form, nipBendahara: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                id="save-settings-btn"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Pengaturan
              </button>
            </div>
          </form>
        </div>

        {/* INTEGRASI GOOGLE SHEETS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 font-display">Sinkronisasi Database (Google Sheets)</h3>
              <p className="text-xs text-slate-400">Hubungkan aplikasi Anda secara real-time dengan Google Spreadsheet menggunakan Google Apps Script.</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100 text-amber-800 space-y-2">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Cara Menghubungkan Google Spreadsheet Anda secara Real-time:
            </h4>
            <ol className="list-decimal list-inside text-[11px] space-y-1 pl-1 leading-relaxed text-slate-600">
              <li>Buat Spreadsheet baru di Google Sheets.</li>
              <li>Klik menu <strong className="text-slate-800">Ekstensi &gt; Apps Script</strong>.</li>
              <li>Hapus kode bawaan lalu salin dan tempelkan seluruh kode dari file <strong className="text-slate-800">code.gs</strong> ke editor Apps Script Anda.</li>
              <li>Klik tombol <strong className="text-slate-800">Terapkan &gt; Penerapan Baru</strong> (Deploy &gt; New Deployment) di kanan atas.</li>
              <li>Pilih jenis <strong className="text-slate-800">Aplikasi Web</strong> (Web App).</li>
              <li>Pastikan bagian <strong className="text-slate-800">Yang memiliki akses</strong> disetel menjadi <strong className="text-slate-800">Siapa saja</strong> (Anyone).</li>
              <li>Klik <strong className="text-slate-800">Terapkan</strong>, berikan izin akses Google, lalu salin <strong className="text-slate-800">URL Web App</strong> yang dihasilkan.</li>
              <li>Tempelkan URL tersebut ke kolom input di bawah ini, lalu klik <strong className="text-slate-800">Simpan Pengaturan</strong> atau klik <strong className="text-slate-800">Test Koneksi</strong>.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500">URL Web App Google Apps Script *</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className={`flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono text-slate-600 ${
                  getUrlWarning(sheetsUrl) ? "border-amber-300 bg-amber-50/20" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingUrl || !sheetsUrl}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
              >
                {isTestingUrl ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menghubungkan...
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5" /> Test Koneksi
                  </>
                )}
              </button>
            </div>
            
            {getUrlWarning(sheetsUrl) && (
              <div className="text-[11px] text-amber-800 flex items-start gap-2 bg-amber-50 border border-amber-200/60 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{getUrlWarning(sheetsUrl)}</p>
              </div>
            )}
          </div>

          {testStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-fade-in ${
              testStatus.success 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
              {testStatus.success ? (
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-normal">
                <p className="font-bold">{testStatus.success ? "Koneksi Berhasil!" : "Koneksi Gagal!"}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{testStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* LOGO & CLUSTER WIPE */}
        <div className="space-y-6">
          {/* Logo card 1 - Kop Surat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs font-display uppercase tracking-wider mb-3">Logo Resmi Kop Surat (Laporan PDF)</h4>
            
            <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-center border border-dashed border-slate-200 mb-4">
              {form.kopSekolah ? (
                <div className="relative group">
                  <img
                    src={form.kopSekolah}
                    alt="Kop logo"
                    className="h-20 object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setForm(prev => ({ ...prev, kopSekolah: "" }))}
                    className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs transition"
                    title="Hapus Logo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-slate-400 py-3">
                  <Image className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span className="text-[10px] block font-medium">Belum ada logo diunggah</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Menggunakan logo default Tut Wuri</span>
                </div>
              )}
            </div>

            <label className="w-full block py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold text-center cursor-pointer transition">
              Unggah Logo Kop Kustom
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Logo card 2 - Logo Sekolah Utama (Login & Sidebar) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs font-display uppercase tracking-wider mb-3">Logo Utama Sekolah (Login & Sidebar)</h4>
            
            <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-center border border-dashed border-slate-200 mb-4">
              {form.logoSekolah ? (
                <div className="relative group">
                  <img
                    src={form.logoSekolah}
                    alt="Logo sekolah"
                    className="h-20 object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setForm(prev => ({ ...prev, logoSekolah: "" }))}
                    className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs transition"
                    title="Hapus Logo Sekolah"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-slate-400 py-3">
                  <Image className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span className="text-[10px] block font-medium">Belum ada logo diunggah</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Menggunakan logo default Aplikasi (4F)</span>
                </div>
              )}
            </div>

            <label className="w-full block py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold text-center cursor-pointer transition">
              Unggah Logo Sekolah Utama
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSekolahUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Granular Wipe Panel */}
          <div className="bg-white rounded-2xl p-6 border border-rose-100/60 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-xs font-display uppercase tracking-wider">Pemeliharaan Data</h4>
            </div>
            
            <p className="text-[11px] text-slate-500 mb-4">
              Gunakan fitur ini untuk membersihkan / mengosongkan tabel data tertentu dari database lokal aplikasi.
            </p>

            <div className="space-y-2 mb-4">
              {Object.keys(wipeTargets).map((key) => (
                <label key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer text-xs font-semibold text-slate-700 select-none capitalize">
                  <input
                    type="checkbox"
                    checked={(wipeTargets as any)[key]}
                    onChange={(e) => setWipeTargets({ ...wipeTargets, [key]: e.target.checked })}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Hapus Semua Data {key === "surat" ? "Surat Masuk/Keluar" : key}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleWipeClick}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-100"
              id="wipe-selected-data-btn"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Data Terpilih
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION WIPE MODAL */}
      {isWipeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-xl">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-slate-800 font-display">Tindakan Sangat Berbahaya!</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Anda memilih untuk menghapus data kategori terpilih secara permanen. Tindakan ini **tidak dapat dibatalkan** dan akan menghapus seluruh catatan di kategori tersebut.
              </p>

              <div className="text-left bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Akan Dihapus:</span>
                <ul className="list-disc list-inside text-[11px] font-bold text-rose-700 font-mono capitalize">
                  {Object.entries(wipeTargets)
                    .filter(([_, v]) => v === true)
                    .map(([k]) => (
                      <li key={k}>{k === "surat" ? "Registrasi Surat" : k}</li>
                    ))}
                </ul>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Ketik kata <span className="text-rose-600 font-extrabold font-mono text-sm">HAPUS</span> untuk melanjutkan *</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Ketik HAPUS di sini..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:border-rose-500 font-mono font-bold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWipeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteWipe}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                  id="execute-wipe-btn"
                >
                  Ya, Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
