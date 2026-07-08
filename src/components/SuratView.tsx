import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, X, ArrowUpDown, ChevronLeft, ChevronRight, MailOpen, Send, FileText
} from "lucide-react";
import { SuratMasuk, SuratKeluar, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface SuratViewProps {
  suratMasuk: SuratMasuk[];
  setSuratMasuk: React.Dispatch<React.SetStateAction<SuratMasuk[]>>;
  suratKeluar: SuratKeluar[];
  setSuratKeluar: React.Dispatch<React.SetStateAction<SuratKeluar[]>>;
  settings: Setting;
}

export default function SuratView({
  suratMasuk,
  setSuratMasuk,
  suratKeluar,
  setSuratKeluar,
  settings
}: SuratViewProps) {
  // Toggle sub-tab: "masuk" or "keluar"
  const [subTab, setSubTab] = useState<"masuk" | "keluar">("masuk");
  
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  // Forms states
  const initialFormMasuk: Omit<SuratMasuk, "id"> = {
    nomorSurat: "",
    tanggalSurat: "",
    pengirim: "",
    perihal: "",
    lampiran: "",
    keterangan: "",
    fileScanSurat: ""
  };

  const initialFormKeluar: Omit<SuratKeluar, "id"> = {
    nomorSurat: "",
    tujuan: "",
    tanggal: "",
    perihal: "",
    lampiran: "",
    fileSurat: ""
  };

  const [formMasuk, setFormMasuk] = useState<Omit<SuratMasuk, "id">>(initialFormMasuk);
  const [formKeluar, setFormKeluar] = useState<Omit<SuratKeluar, "id">>(initialFormKeluar);
  const [formError, setFormError] = useState("");

  // Search filtering
  const filteredMasuk = suratMasuk.filter(item => 
    item.nomorSurat.toLowerCase().includes(search.toLowerCase()) ||
    item.pengirim.toLowerCase().includes(search.toLowerCase()) ||
    item.perihal.toLowerCase().includes(search.toLowerCase())
  );

  const filteredKeluar = suratKeluar.filter(item => 
    item.nomorSurat.toLowerCase().includes(search.toLowerCase()) ||
    item.tujuan.toLowerCase().includes(search.toLowerCase()) ||
    item.perihal.toLowerCase().includes(search.toLowerCase())
  );

  const activeList = subTab === "masuk" ? filteredMasuk : filteredKeluar;
  const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
  const paginatedData = activeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Base64 file conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (subTab === "masuk") {
          setFormMasuk({ ...formMasuk, fileScanSurat: reader.result as string });
        } else {
          setFormKeluar({ ...formKeluar, fileSurat: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    if (subTab === "masuk") {
      setFormMasuk(initialFormMasuk);
    } else {
      setFormKeluar(initialFormKeluar);
    }
    setIsEditing(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    if (subTab === "masuk") {
      setFormMasuk({
        nomorSurat: item.nomorSurat,
        tanggalSurat: item.tanggalSurat,
        pengirim: item.pengirim,
        perihal: item.perihal,
        lampiran: item.lampiran,
        keterangan: item.keterangan,
        fileScanSurat: item.fileScanSurat
      });
    } else {
      setFormKeluar({
        nomorSurat: item.nomorSurat,
        tujuan: item.tujuan,
        tanggal: item.tanggal,
        perihal: item.perihal,
        lampiran: item.lampiran,
        fileSurat: item.fileSurat
      });
    }
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (subTab === "masuk") {
      if (!formMasuk.nomorSurat || !formMasuk.tanggalSurat || !formMasuk.pengirim || !formMasuk.perihal) {
        setFormError("Nomor, Tanggal, Pengirim, dan Perihal wajib diisi!");
        return;
      }
      if (isEditing) {
        setSuratMasuk(prev => prev.map(item => item.id === editId ? { ...formMasuk, id: editId } : item));
      } else {
        const newSurat: SuratMasuk = { ...formMasuk, id: `sm-${Date.now()}` };
        setSuratMasuk(prev => [newSurat, ...prev]);
      }
    } else {
      if (!formKeluar.nomorSurat || !formKeluar.tanggal || !formKeluar.tujuan || !formKeluar.perihal) {
        setFormError("Nomor, Tanggal, Tujuan, dan Perihal wajib diisi!");
        return;
      }
      if (isEditing) {
        setSuratKeluar(prev => prev.map(item => item.id === editId ? { ...formKeluar, id: editId } : item));
      } else {
        const newSurat: SuratKeluar = { ...formKeluar, id: `sk-${Date.now()}` };
        setSuratKeluar(prev => [newSurat, ...prev]);
      }
    }

    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, nomor: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus surat nomor "${nomor}"?`)) {
      if (subTab === "masuk") {
        setSuratMasuk(prev => prev.filter(item => item.id !== id));
      } else {
        setSuratKeluar(prev => prev.filter(item => item.id !== id));
      }
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // EXPORT FUNCTIONS
  const handleExportExcel = () => {
    if (subTab === "masuk") {
      const exportData = filteredMasuk.map((item, idx) => ({
        "No": idx + 1,
        "Nomor Surat": item.nomorSurat,
        "Tanggal Surat": item.tanggalSurat,
        "Pengirim": item.pengirim,
        "Perihal": item.perihal,
        "Lampiran": item.lampiran,
        "Keterangan": item.keterangan
      }));
      exportToExcel(exportData, `Data_Surat_Masuk_${settings.namaSekolah.replace(/\s+/g, "_")}`, "SURAT_MASUK");
    } else {
      const exportData = filteredKeluar.map((item, idx) => ({
        "No": idx + 1,
        "Nomor Surat": item.nomorSurat,
        "Tanggal": item.tanggal,
        "Tujuan": item.tujuan,
        "Perihal": item.perihal,
        "Lampiran": item.lampiran
      }));
      exportToExcel(exportData, `Data_Surat_Keluar_${settings.namaSekolah.replace(/\s+/g, "_")}`, "SURAT_KELUAR");
    }
  };

  const handleExportPDF = () => {
    if (subTab === "masuk") {
      const cols = ["No", "Nomor Surat", "Tanggal Surat", "Pengirim", "Perihal", "Lampiran", "Keterangan"];
      const rows = filteredMasuk.map((item, idx) => [
        idx + 1,
        item.nomorSurat,
        item.tanggalSurat,
        item.pengirim,
        item.perihal,
        item.lampiran || "-",
        item.keterangan || "-"
      ]);
      exportToPDF("Agenda Registrasi Surat Masuk", cols, rows, settings);
    } else {
      const cols = ["No", "Nomor Surat", "Tanggal", "Tujuan", "Perihal", "Lampiran"];
      const rows = filteredKeluar.map((item, idx) => [
        idx + 1,
        item.nomorSurat,
        item.tanggal,
        item.tujuan,
        item.perihal,
        item.lampiran || "-"
      ]);
      exportToPDF("Agenda Registrasi Surat Keluar", cols, rows, settings);
    }
  };

  const handlePrint = () => {
    if (subTab === "masuk") {
      const cols = ["No", "Nomor Surat", "Tanggal Surat", "Pengirim", "Perihal", "Lampiran", "Keterangan"];
      const rows = filteredMasuk.map((item, idx) => [
        idx + 1,
        item.nomorSurat,
        item.tanggalSurat,
        item.pengirim,
        item.perihal,
        item.lampiran || "-",
        item.keterangan || "-"
      ]);
      printData("Laporan Data Surat Masuk Sekolah", cols, rows, settings);
    } else {
      const cols = ["No", "Nomor Surat", "Tanggal", "Tujuan", "Perihal", "Lampiran"];
      const rows = filteredKeluar.map((item, idx) => [
        idx + 1,
        item.nomorSurat,
        item.tanggal,
        item.tujuan,
        item.perihal,
        item.lampiran || "-"
      ]);
      printData("Laporan Data Surat Keluar Sekolah", cols, rows, settings);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="surat-view">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100 mb-6 gap-2">
        <button
          onClick={() => { setSubTab("masuk"); setSearch(""); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            subTab === "masuk"
              ? "border-blue-600 text-blue-600 font-display"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="surat-masuk-tab-btn"
        >
          <MailOpen className="w-4 h-4" /> Surat Masuk
        </button>
        <button
          onClick={() => { setSubTab("keluar"); setSearch(""); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            subTab === "keluar"
              ? "border-blue-600 text-blue-600 font-display"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="surat-keluar-tab-btn"
        >
          <Send className="w-4 h-4" /> Surat Keluar
        </button>
      </div>

      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-md font-bold text-slate-800 font-display">
            Administrasi {subTab === "masuk" ? "Surat Masuk" : "Surat Keluar"}
          </h2>
          <p className="text-xs text-slate-500">
            {subTab === "masuk"
              ? "Registrasi dan arsipkan scan surat masuk dari dinas, instansi, atau instansi luar."
              : "Catat surat keluar resmi sekolah beserta tujuan pengiriman dan lampirannya."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="surat-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="surat-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="surat-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="surat-add"
          >
            <Plus className="w-3.5 h-3.5" /> Registrasi Surat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={subTab === "masuk" ? "Cari Nomor Surat, Pengirim, atau Perihal..." : "Cari Nomor Surat, Tujuan, atau Perihal..."}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="surat-search-input"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">No</th>
              <th className="px-4 py-3">Nomor Surat</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">{subTab === "masuk" ? "Pengirim" : "Tujuan"}</th>
              <th className="px-4 py-3 w-[250px]">Perihal</th>
              <th className="px-4 py-3">Lampiran</th>
              {subTab === "masuk" && <th className="px-4 py-3">Keterangan</th>}
              <th className="px-4 py-3 text-center">Scan</th>
              <th className="px-4 py-3 text-center w-[100px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-400">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 font-mono text-xs">{item.nomorSurat}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 font-mono">
                    {subTab === "masuk" ? (item as SuratMasuk).tanggalSurat : (item as SuratKeluar).tanggal}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {subTab === "masuk" ? (item as SuratMasuk).pengirim : (item as SuratKeluar).tujuan}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 leading-normal">{item.perihal}</td>
                  <td className="px-4 py-3"><span className="text-slate-500">{item.lampiran || "-"}</span></td>
                  {subTab === "masuk" && (
                    <td className="px-4 py-3 text-slate-500 leading-normal">
                      {(item as SuratMasuk).keterangan || "-"}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    {(subTab === "masuk" ? (item as SuratMasuk).fileScanSurat : (item as SuratKeluar).fileSurat) ? (
                      <a
                        href={subTab === "masuk" ? (item as SuratMasuk).fileScanSurat : (item as SuratKeluar).fileSurat}
                        download={`Surat_${item.nomorSurat.replace(/[^a-zA-Z0-9]/g, "_")}`}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-1 justify-center max-w-[80px] mx-auto transition"
                      >
                        <FileText className="w-3 h-3" /> Unduh
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit surat"
                        id={`edit-surat-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nomorSurat)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus surat"
                        id={`delete-surat-${item.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={subTab === "masuk" ? 9 : 8} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada arsip registrasi surat ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, activeList.length)} dari {activeList.length} surat
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-2.5 py-1 text-xs rounded border ${
                  currentPage === p
                    ? "bg-blue-600 border-blue-600 text-white font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-200 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Arsip Surat" : "Registrasi Surat Baru"} - {subTab === "masuk" ? "Masuk" : "Keluar"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              {subTab === "masuk" ? (
                <>
                  {/* SURAT MASUK FIELDS */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Surat Masuk *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 421.3/089/Disdikpora/2026"
                      value={formMasuk.nomorSurat}
                      onChange={(e) => setFormMasuk({ ...formMasuk, nomorSurat: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Surat *</label>
                      <input
                        type="date"
                        required
                        value={formMasuk.tanggalSurat}
                        onChange={(e) => setFormMasuk({ ...formMasuk, tanggalSurat: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Lampiran</label>
                      <input
                        type="text"
                        placeholder="Contoh: 1 Lembar"
                        value={formMasuk.lampiran}
                        onChange={(e) => setFormMasuk({ ...formMasuk, lampiran: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Pengirim Surat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dinas Pendidikan Kabupaten Fakfak"
                      value={formMasuk.pengirim}
                      onChange={(e) => setFormMasuk({ ...formMasuk, pengirim: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Perihal *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Undangan Rapat Koordinasi Dapodik"
                      value={formMasuk.perihal}
                      onChange={(e) => setFormMasuk({ ...formMasuk, perihal: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Unggah Scan Surat Masuk (PDF/Gambar)</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Keterangan / Catatan Disposisi</label>
                    <textarea
                      placeholder="Contoh: Diserahkan kepada Wakasek Kesiswaan..."
                      value={formMasuk.keterangan}
                      onChange={(e) => setFormMasuk({ ...formMasuk, keterangan: e.target.value })}
                      rows={2.5}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* SURAT KELUAR FIELDS */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Surat Keluar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 421.3/072/SMPN4/VII/2026"
                      value={formKeluar.nomorSurat}
                      onChange={(e) => setFormKeluar({ ...formKeluar, nomorSurat: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Keluar *</label>
                      <input
                        type="date"
                        required
                        value={formKeluar.tanggal}
                        onChange={(e) => setFormKeluar({ ...formKeluar, tanggal: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Lampiran</label>
                      <input
                        type="text"
                        placeholder="Contoh: 1 Berkas"
                        value={formKeluar.lampiran}
                        onChange={(e) => setFormKeluar({ ...formKeluar, lampiran: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tujuan Pengiriman Surat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Orang Tua / Wali Siswa"
                      value={formKeluar.tujuan}
                      onChange={(e) => setFormKeluar({ ...formKeluar, tujuan: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Perihal *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Surat Pemberitahuan Pengambilan Rapor"
                      value={formKeluar.perihal}
                      onChange={(e) => setFormKeluar({ ...formKeluar, perihal: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Unggah Softcopy / Surat Keluar Resmi (PDF/Gambar)</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </>
              )}

              {/* Show file indication */}
              {((subTab === "masuk" && formMasuk.fileScanSurat) || (subTab === "keluar" && formKeluar.fileSurat)) && (
                <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-lg border border-blue-100 flex items-center justify-between">
                  <span>File Scan Surat berhasil ditautkan.</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (subTab === "masuk") setFormMasuk({ ...formMasuk, fileScanSurat: "" });
                      else setFormKeluar({ ...formKeluar, fileSurat: "" });
                    }}
                    className="text-rose-600 hover:underline font-bold"
                  >
                    Hapus File
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                  id="surat-submit"
                >
                  {isEditing ? "Simpan Perubahan" : "Simpan Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
