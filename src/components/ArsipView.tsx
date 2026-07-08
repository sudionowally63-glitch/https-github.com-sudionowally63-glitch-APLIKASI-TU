import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, X, ArrowUpDown, ChevronLeft, ChevronRight, Archive, Folder
} from "lucide-react";
import { Arsip, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface ArsipViewProps {
  arsip: Arsip[];
  setArsip: React.Dispatch<React.SetStateAction<Arsip[]>>;
  settings: Setting;
}

export default function ArsipView({ arsip, setArsip, settings }: ArsipViewProps) {
  const [search, setSearch] = useState("");
  
  const [sortBy, setSortBy] = useState<keyof Arsip>("namaArsip");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<Arsip, "id"> = {
    nomorArsip: "",
    namaArsip: "",
    kategori: "Kepegawaian",
    lokasiPenyimpanan: "",
    tanggal: "",
    fileArsip: ""
  };
  const [form, setForm] = useState<Omit<Arsip, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  const handleSort = (field: keyof Arsip) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = arsip.filter(item => 
    item.namaArsip.toLowerCase().includes(search.toLowerCase()) ||
    item.nomorArsip.toLowerCase().includes(search.toLowerCase()) ||
    item.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortBy] || "";
    let valB = b[sortBy] || "";
    
    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, fileArsip: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEditing(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Arsip) => {
    setForm({
      nomorArsip: item.nomorArsip,
      namaArsip: item.namaArsip,
      kategori: item.kategori,
      lokasiPenyimpanan: item.lokasiPenyimpanan,
      tanggal: item.tanggal,
      fileArsip: item.fileArsip
    });
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomorArsip || !form.namaArsip || !form.lokasiPenyimpanan) {
      setFormError("Semua bidang bertanda bintang wajib diisi!");
      return;
    }

    if (isEditing) {
      setArsip(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newArsip: Arsip = {
        ...form,
        id: `ar-${Date.now()}`
      };
      setArsip(prev => [newArsip, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus arsip "${name}"?`)) {
      setArsip(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "Nomor Arsip": item.nomorArsip,
      "Nama Dokumen Arsip": item.namaArsip,
      "Kategori": item.kategori,
      "Lokasi Penyimpanan": item.lokasiPenyimpanan,
      "Tanggal": item.tanggal
    }));
    exportToExcel(exportData, `Data_Arsip_${settings.namaSekolah.replace(/\s+/g, "_")}`, "ARSIP");
  };

  const handleExportPDF = () => {
    const cols = ["No", "Nomor Arsip", "Nama Dokumen Arsip", "Kategori", "Lokasi Penyimpanan", "Tanggal"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.nomorArsip,
      item.namaArsip,
      item.kategori,
      item.lokasiPenyimpanan,
      item.tanggal
    ]);
    exportToPDF("Arsip & Dokumentasi Sekolah", cols, rows, settings);
  };

  const handlePrint = () => {
    const cols = ["No", "Nomor Arsip", "Nama Dokumen Arsip", "Kategori", "Lokasi Penyimpanan", "Tanggal"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.nomorArsip,
      item.namaArsip,
      item.kategori,
      item.lokasiPenyimpanan,
      item.tanggal
    ]);
    printData("Laporan Data Arsip & Dokumentasi", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="arsip-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Sistem Arsip & Dokumentasi</h2>
          <p className="text-xs text-slate-500">Manajemen pelacakan folder, dokumen akreditasi, berkas kepegawaian, dan aset fisik TU.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="arsip-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="arsip-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="arsip-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="arsip-add"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Arsip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nomor Arsip, Nama Arsip, Kategori..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="arsip-search-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">No</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nomorArsip")}>
                Nomor Arsip <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("namaArsip")}>
                Nama Dokumen Arsip <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("kategori")}>
                Kategori <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3">Lokasi Penyimpanan</th>
              <th className="px-4 py-3 text-center">Tanggal</th>
              <th className="px-4 py-3 text-center">File</th>
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
                  <td className="px-4 py-3 font-semibold text-slate-800 font-mono text-xs">{item.nomorArsip}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{item.namaArsip}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{item.lokasiPenyimpanan}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-500">{item.tanggal || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    {item.fileArsip ? (
                      <a
                        href={item.fileArsip}
                        download={`Arsip_${item.nomorArsip.replace(/[^a-zA-Z0-9]/g, "_")}`}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100 inline-flex items-center gap-1 transition"
                      >
                        <Folder className="w-3 h-3" /> Unduh
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
                        title="Edit arsip"
                        id={`edit-arsip-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaArsip)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus arsip"
                        id={`delete-arsip-${item.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada dokumen arsip ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} arsip
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Dokumen Arsip" : "Tambah Arsip Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nomor Kode Arsip *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ARS-001/2026"
                  value={form.nomorArsip}
                  onChange={(e) => setForm({ ...form, nomorArsip: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Dokumen Arsip *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dokumen Akreditasi Sekolah Tahun 2026"
                  value={form.namaArsip}
                  onChange={(e) => setForm({ ...form, namaArsip: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kategori Arsip *</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Kurikulum & Kelembagaan">Kurikulum & Kelembagaan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Keuangan & Sarpras">Keuangan & Sarpras</option>
                    <option value="Umum & Hubungan Masyarakat">Umum & Hubungan Masyarakat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Pengarsipan</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi Penyimpanan Rak / Lemari *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lemari Arsip Utama Seksi A"
                  value={form.lokasiPenyimpanan}
                  onChange={(e) => setForm({ ...form, lokasiPenyimpanan: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Unggah Softcopy Dokumen Arsip</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {form.fileArsip && (
                <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-lg border border-blue-100 flex items-center justify-between">
                  <span>File Lampiran berhasil ditautkan.</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, fileArsip: "" })}
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
                  id="arsip-submit"
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
