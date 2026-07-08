import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight, UserPlus
} from "lucide-react";
import { Siswa, Kelas, Setting } from "../types";
import { religionMap, religionList, exportToExcel, exportToPDF, printData } from "../utils";

interface SiswaViewProps {
  siswa: Siswa[];
  setSiswa: React.Dispatch<React.SetStateAction<Siswa[]>>;
  kelas: Kelas[];
  settings: Setting;
}

export default function SiswaView({ siswa, setSiswa, kelas, settings }: SiswaViewProps) {
  // Filters & Search State
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Table Sorting
  const [sortBy, setSortBy] = useState<keyof Siswa>("nama");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<Siswa, "id"> = {
    nis: "",
    nisn: "",
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki",
    agama: "1000000001", // Default Islam 10-digit
    alamat: "",
    kelas: kelas[0]?.namaKelas || "VII-A",
    namaAyah: "",
    namaIbu: "",
    nomorHpOrangTua: "",
    status: "Aktif",
    foto: ""
  };
  const [form, setForm] = useState<Omit<Siswa, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  // Handling Sorting
  const handleSort = (field: keyof Siswa) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Process data with search, filter, and sort
  const filteredData = siswa.filter(item => {
    const matchSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nis.includes(search) ||
      item.nisn.includes(search);
    const matchKelas = filterKelas === "" || item.kelas === filterKelas;
    const matchStatus = filterStatus === "" || item.status === filterStatus;
    return matchSearch && matchKelas && matchStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortBy] || "";
    let valB = b[sortBy] || "";
    
    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Image Upload helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Actions
  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEditing(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Siswa) => {
    setForm({
      nis: item.nis,
      nisn: item.nisn,
      nama: item.nama,
      tempatLahir: item.tempatLahir,
      tanggalLahir: item.tanggalLahir,
      jenisKelamin: item.jenisKelamin,
      agama: item.agama,
      alamat: item.alamat,
      kelas: item.kelas,
      namaAyah: item.namaAyah,
      namaIbu: item.namaIbu,
      nomorHpOrangTua: item.nomorHpOrangTua,
      status: item.status,
      foto: item.foto
    });
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.nis || !form.nisn || !form.nama || !form.kelas) {
      setFormError("NIS, NISN, Nama Lengkap, dan Kelas wajib diisi!");
      return;
    }

    // STRICT AGAMA 10 DIGIT CHECK
    if (!/^\d{10}$/.test(form.agama)) {
      setFormError("Kolom Agama wajib bernilai tepat 10 digit angka!");
      return;
    }

    if (isEditing) {
      setSiswa(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newSiswa: Siswa = {
        ...form,
        id: `s-${Date.now()}`
      };
      setSiswa(prev => [newSiswa, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${name}"?`)) {
      setSiswa(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // EXPORT UTILITIES
  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "NIS": item.nis,
      "NISN": item.nisn,
      "Nama Siswa": item.nama,
      "Tempat Lahir": item.tempatLahir,
      "Tanggal Lahir": item.tanggalLahir,
      "Jenis Kelamin": item.jenisKelamin,
      "Agama Code": item.agama,
      "Agama": religionMap[item.agama] || "Lainnya",
      "Kelas": item.kelas,
      "Nama Ayah": item.namaAyah,
      "Nama Ibu": item.namaIbu,
      "No HP Orang Tua": item.nomorHpOrangTua,
      "Status": item.status
    }));
    exportToExcel(exportData, `Data_Siswa_${settings.namaSekolah.replace(/\s+/g, "_")}`, "SISWA");
  };

  const handleExportPDF = () => {
    const cols = ["No", "NIS/NISN", "Nama Siswa", "L/P", "Agama", "Kelas", "No HP Orang Tua", "Status"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      `${item.nis}\n${item.nisn}`,
      item.nama,
      item.jenisKelamin === "Laki-laki" ? "L" : "P",
      `${religionMap[item.agama] || "Lainnya"}\n(${item.agama})`,
      item.kelas,
      item.nomorHpOrangTua || "-",
      item.status
    ]);
    exportToPDF("Data Siswa SMP Negeri 4 Fakfak", cols, rows, settings);
  };

  const handlePrint = () => {
    const cols = ["No", "NIS", "NISN", "Nama Siswa", "L/P", "Agama", "Kelas", "Status"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.nis,
      item.nisn,
      item.nama,
      item.jenisKelamin === "Laki-laki" ? "L" : "P",
      `${religionMap[item.agama] || "Lainnya"} (${item.agama})`,
      item.kelas,
      item.status
    ]);
    printData("Laporan Data Siswa SMP Negeri 4 Fakfak", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="siswa-view">
      {/* Tab Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Data Master Siswa</h2>
          <p className="text-xs text-slate-500">Kelola informasi murid, kelas, kontak orang tua, dan dokumen kesiswaan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="siswa-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="siswa-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="siswa-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="siswa-add"
          >
            <UserPlus className="w-3.5 h-3.5" /> Tambah Siswa
          </button>
        </div>
      </div>

      {/* Search and Filters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama, NIS atau NISN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="siswa-search-input"
          />
        </div>
        {/* Class Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterKelas}
            onChange={(e) => { setFilterKelas(e.target.value); setCurrentPage(1); }}
            className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
            id="siswa-filter-kelas"
          >
            <option value="">-- Semua Kelas --</option>
            {kelas.map(k => (
              <option key={k.id} value={k.namaKelas}>{k.namaKelas}</option>
            ))}
          </select>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
            id="siswa-filter-status"
          >
            <option value="">-- Semua Status --</option>
            <option value="Aktif">Aktif</option>
            <option value="Alumni">Alumni</option>
            <option value="Mutasi">Mutasi</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">Foto</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nama")}>
                Nama Siswa <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nis")}>
                NIS / NISN <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("kelas")}>
                Kelas <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3">Agama</th>
              <th className="px-4 py-3">Nama Orang Tua</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center w-[100px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-center">
                    {item.foto ? (
                      <img src={item.foto} alt={item.nama} className="w-8 h-8 rounded-full object-cover mx-auto border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center mx-auto text-[10px]">
                        {item.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.nama}</td>
                  <td className="px-4 py-3">
                    <span className="block font-medium font-mono">{item.nis}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{item.nisn}</span>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">{item.kelas}</span></td>
                  <td className="px-4 py-3">
                    <span className="block">{religionMap[item.agama] || "Lainnya"}</span>
                    <span className="block text-[10px] text-slate-400 font-mono font-bold">{item.agama}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-[11px] font-medium text-slate-700">Ayah: {item.namaAyah || "-"}</span>
                    <span className="block text-[11px] font-medium text-slate-700">Ibu: {item.namaIbu || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      item.status === "Alumni" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit data"
                        id={`edit-siswa-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus data"
                        id={`delete-siswa-${item.id}`}
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
                  Tidak ada data siswa ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} siswa
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

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                  <span>{formError}</span>
                </div>
              )}

              {/* Grid 1: Basic Ident */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    value={form.nis}
                    onChange={(e) => setForm({ ...form, nis: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    value={form.nisn}
                    onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Grid 2: Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={form.tempatLahir}
                    onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={form.tanggalLahir}
                    onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Grid 3: Gender & Agama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Kelamin</label>
                  <div className="flex gap-4 mt-1.5 text-xs">
                    <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        checked={form.jenisKelamin === "Laki-laki"}
                        onChange={() => setForm({ ...form, jenisKelamin: "Laki-laki" })}
                      />
                      Laki-laki
                    </label>
                    <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        checked={form.jenisKelamin === "Perempuan"}
                        onChange={() => setForm({ ...form, jenisKelamin: "Perempuan" })}
                      />
                      Perempuan
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Agama (Wajib Pilihan 10-Digit) *</label>
                  <select
                    value={form.agama}
                    onChange={(e) => setForm({ ...form, agama: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {religionList.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                  <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                    Catatan: dropdown ini otomatis menyandikan kode unik 10-digit angka sesuai regulasi sistem Dapodik.
                  </span>
                </div>
              </div>

              {/* Grid 4: Kelas & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kelas *</label>
                  <select
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {kelas.map((k) => (
                      <option key={k.id} value={k.namaKelas}>{k.namaKelas}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status Keaktifan</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Mutasi">Mutasi</option>
                  </select>
                </div>
              </div>

              {/* Parents info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={form.namaAyah}
                    onChange={(e) => setForm({ ...form, namaAyah: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={form.namaIbu}
                    onChange={(e) => setForm({ ...form, namaIbu: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nomor HP Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={form.nomorHpOrangTua}
                    onChange={(e) => setForm({ ...form, nomorHpOrangTua: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Foto Siswa (Unggah Gambar)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Alamat Lengkap</label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Photo Preview in Form */}
              {form.foto && (
                <div className="p-3 border border-slate-100 rounded-lg flex items-center gap-3">
                  <img src={form.foto} alt="Preview" className="w-12 h-12 rounded object-cover" />
                  <span className="text-[11px] text-slate-500">Gambar berhasil ditautkan ke basis data lokal.</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, foto: "" })}
                    className="ml-auto text-rose-500 hover:bg-rose-50 p-1 rounded text-[10px] font-bold"
                  >
                    Hapus Foto
                  </button>
                </div>
              )}

              {/* Modal Actions */}
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
                  id="siswa-submit"
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
