import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, X, ArrowUpDown, ChevronLeft, ChevronRight, BookOpen
} from "lucide-react";
import { Kelas, Guru, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface KelasViewProps {
  kelas: Kelas[];
  setKelas: React.Dispatch<React.SetStateAction<Kelas[]>>;
  guru: Guru[];
  settings: Setting;
}

export default function KelasView({ kelas, setKelas, guru, settings }: KelasViewProps) {
  const [search, setSearch] = useState("");
  
  const [sortBy, setSortBy] = useState<keyof Kelas>("namaKelas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<Kelas, "id"> = {
    namaKelas: "",
    waliKelas: guru[0]?.nama || "",
    tahunPelajaran: "2026/2027",
    jumlahSiswa: 0
  };
  const [form, setForm] = useState<Omit<Kelas, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  const handleSort = (field: keyof Kelas) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = kelas.filter(item => {
    return (
      item.namaKelas.toLowerCase().includes(search.toLowerCase()) ||
      item.waliKelas.toLowerCase().includes(search.toLowerCase()) ||
      item.tahunPelajaran.includes(search)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    
    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
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

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEditing(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Kelas) => {
    setForm({
      namaKelas: item.namaKelas,
      waliKelas: item.waliKelas,
      tahunPelajaran: item.tahunPelajaran,
      jumlahSiswa: item.jumlahSiswa
    });
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaKelas || !form.waliKelas || !form.tahunPelajaran) {
      setFormError("Semua bidang wajib diisi!");
      return;
    }

    if (isEditing) {
      setKelas(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newKelas: Kelas = {
        ...form,
        id: `k-${Date.now()}`
      };
      setKelas(prev => [newKelas, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data kelas "${name}"?`)) {
      setKelas(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "Nama Kelas": item.namaKelas,
      "Wali Kelas": item.waliKelas,
      "Tahun Pelajaran": item.tahunPelajaran,
      "Jumlah Siswa": item.jumlahSiswa
    }));
    exportToExcel(exportData, `Data_Kelas_${settings.namaSekolah.replace(/\s+/g, "_")}`, "KELAS");
  };

  const handleExportPDF = () => {
    const cols = ["No", "Nama Kelas", "Wali Kelas", "Tahun Pelajaran", "Jumlah Siswa"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.namaKelas,
      item.waliKelas,
      item.tahunPelajaran,
      `${item.jumlahSiswa} Siswa`
    ]);
    exportToPDF("Data Rombongan Belajar / Kelas", cols, rows, settings);
  };

  const handlePrint = () => {
    const cols = ["No", "Nama Kelas", "Wali Kelas", "Tahun Pelajaran", "Jumlah Siswa"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.namaKelas,
      item.waliKelas,
      item.tahunPelajaran,
      `${item.jumlahSiswa} Siswa`
    ]);
    printData("Laporan Data Rombongan Belajar (Kelas)", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="kelas-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Data Master Kelas</h2>
          <p className="text-xs text-slate-500">Kelola rombongan belajar (rombel), wali kelas, tahun ajaran, dan rekap murid.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="kelas-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="kelas-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="kelas-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="kelas-add"
          >
            <BookOpen className="w-3.5 h-3.5" /> Tambah Kelas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama Kelas, Wali Kelas, atau Tahun Pelajaran..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="kelas-search-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">No</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("namaKelas")}>
                Nama Kelas / Rombel <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("waliKelas")}>
                Wali Kelas <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("tahunPelajaran")}>
                Tahun Pelajaran <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none text-center" onClick={() => handleSort("jumlahSiswa")}>
                Jumlah Siswa Terdaftar <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
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
                  <td className="px-4 py-3 font-semibold text-slate-800 text-sm">
                    <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg font-bold border border-blue-100">
                      Kelas {item.namaKelas}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{item.waliKelas}</td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-600">{item.tahunPelajaran}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-mono">
                      {item.jumlahSiswa} Siswa
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit data"
                        id={`edit-kelas-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaKelas)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus data"
                        id={`delete-kelas-${item.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada data kelas ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} kelas
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
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Rombongan Belajar" : "Tambah Kelas Baru"}
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
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Kelas / Rombel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: VII-C, VIII-A, IX-C"
                  value={form.namaKelas}
                  onChange={(e) => setForm({ ...form, namaKelas: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Wali Kelas *</label>
                <select
                  value={form.waliKelas}
                  onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {guru.map(g => (
                    <option key={g.id} value={g.nama}>{g.nama}</option>
                  ))}
                  <option value="Belum Ditentukan">Belum Ditentukan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tahun Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2026/2027"
                  value={form.tahunPelajaran}
                  onChange={(e) => setForm({ ...form, tahunPelajaran: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Jumlah Siswa Terdaftar</label>
                <input
                  type="number"
                  min={0}
                  value={form.jumlahSiswa}
                  onChange={(e) => setForm({ ...form, jumlahSiswa: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

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
                  id="kelas-submit"
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
