import React, { useState } from "react";
import { 
  Settings, Image, Save, Trash2, ShieldAlert, CheckCircle, RefreshCw
} from "lucide-react";
import { Setting } from "../types";

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

  // Base64 logo conversion
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, kopSekolah: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Base64 logo sekolah conversion for Login & Sidebar
  const handleLogoSekolahUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logoSekolah: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
        {/* Form settings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
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
