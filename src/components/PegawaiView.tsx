import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight, UserPlus
} from "lucide-react";
import { Pegawai, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface PegawaiViewProps {
  pegawai: Pegawai[];
  setPegawai: React.Dispatch<React.SetStateAction<Pegawai[]>>;
  settings: Setting;
}

export default function PegawaiView({ pegawai, setPegawai, settings }: PegawaiViewProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  const [sortBy, setSortBy] = useState<keyof Pegawai>("nama");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<Pegawai, "id"> = {
    nip: "",
    nama: "",
    jabatan: "",
    pangkat: "",
    golongan: "",
    alamat: "",
    nomorHp: "",
    email: "",
    status: "PNS",
    foto: ""
  };
  const [form, setForm] = useState<Omit<Pegawai, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  const handleSort = (field: keyof Pegawai) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = pegawai.filter(item => {
    const matchSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nip.includes(search) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
        setForm({ ...form, foto: reader.result as string });
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

  const handleOpenEdit = (item: Pegawai) => {
    setForm({
      nip: item.nip,
      nama: item.nama,
      jabatan: item.jabatan,
      pangkat: item.pangkat,
      golongan: item.golongan,
      alamat: item.alamat,
      nomorHp: item.nomorHp,
      email: item.email,
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
    if (!form.nama || !form.jabatan) {
      setFormError("Nama Lengkap dan Jabatan wajib diisi!");
      return;
    }

    if (isEditing) {
      setPegawai(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newPegawai: Pegawai = {
        ...form,
        id: `p-${Date.now()}`
      };
      setPegawai(prev => [newPegawai, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai "${name}"?`)) {
      setPegawai(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "NIP": item.nip,
      "Nama Pegawai": item.nama,
      "Jabatan": item.jabatan,
      "Pangkat": item.pangkat,
      "Golongan": item.golongan,
      "Alamat": item.alamat,
      "No HP": item.nomorHp,
      "Email": item.email,
      "Status": item.status
    }));
    exportToExcel(exportData, `Data_Pegawai_TU_${settings.namaSekolah.replace(/\s+/g, "_")}`, "PEGAWAI");
  };

  const handleExportPDF = () => {
    const cols = ["No", "NIP", "Nama Pegawai", "Jabatan", "Gol/Pangkat", "No HP", "Status"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.nip || "-",
      item.nama,
      item.jabatan,
      item.golongan ? `${item.golongan} - ${item.pangkat}` : "-",
      item.nomorHp || "-",
      item.status
    ]);
    exportToPDF("Data Pegawai Tata Usaha (TU)", cols, rows, settings);
  };

  const handlePrint = () => {
    const cols = ["No", "NIP", "Nama Pegawai", "Jabatan", "Gol/Pangkat", "No HP", "Status"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.nip || "-",
      item.nama,
      item.jabatan,
      item.golongan ? `${item.golongan} - ${item.pangkat}` : "-",
      item.nomorHp || "-",
      item.status
    ]);
    printData("Laporan Data Pegawai Tata Usaha (TU)", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="pegawai-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Data Master Pegawai TU</h2>
          <p className="text-xs text-slate-500">Kelola staf tata usaha sekolah, operator data, bendahara, dan pembagian tugas.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="pegawai-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="pegawai-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="pegawai-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="pegawai-add"
          >
            <UserPlus className="w-3.5 h-3.5" /> Tambah Staf TU
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama, NIP atau Jabatan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="pegawai-search-input"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
            id="pegawai-filter-status"
          >
            <option value="">-- Semua Kepegawaian --</option>
            <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
            <option value="PPPK">PPPK (P3K)</option>
            <option value="Honorer">Honorer</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">Foto</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nama")}>
                Nama Pegawai <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nip")}>
                NIP <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("jabatan")}>
                Jabatan <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3">Gol / Pangkat</th>
              <th className="px-4 py-3">Kontak</th>
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
                  <td className="px-4 py-3 font-mono font-medium text-slate-700">{item.nip || "-"}</td>
                  <td className="px-4 py-3 font-medium text-slate-700"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">{item.jabatan}</span></td>
                  <td className="px-4 py-3">
                    {item.golongan ? (
                      <>
                        <span className="block font-medium text-slate-700">{item.golongan}</span>
                        <span className="block text-[10px] text-slate-400">{item.pangkat}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="block">{item.nomorHp || "-"}</span>
                    <span className="block text-[10px] truncate max-w-[120px]">{item.email || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "PNS" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      item.status === "PPPK" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
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
                        id={`edit-pegawai-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus data"
                        id={`delete-pegawai-${item.id}`}
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
                  Tidak ada data pegawai ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} pegawai
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Data Staf TU" : "Tambah Staf TU Baru"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">NIP (Tulis '-' jika non-PNS)</label>
                  <input
                    type="text"
                    value={form.nip}
                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Staf *</label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jabatan Kerja *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bendahara / Operator Dapodik"
                    value={form.jabatan}
                    onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status Kepegawaian</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer">Honorer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Golongan (Opsional)</label>
                  <input
                    type="text"
                    value={form.golongan}
                    onChange={(e) => setForm({ ...form, golongan: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Pangkat (Opsional)</label>
                  <input
                    type="text"
                    value={form.pangkat}
                    onChange={(e) => setForm({ ...form, pangkat: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nomor HP / WhatsApp</label>
                  <input
                    type="text"
                    value={form.nomorHp}
                    onChange={(e) => setForm({ ...form, nomorHp: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email Aktif</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Foto Pegawai (Unggah Gambar)</label>
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
                  id="pegawai-submit"
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
