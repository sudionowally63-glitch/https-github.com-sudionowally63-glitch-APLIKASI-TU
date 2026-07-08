import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, X, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck
} from "lucide-react";
import { User, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface UserViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  settings: Setting;
}

export default function UserView({ users, setUsers, settings }: UserViewProps) {
  const [search, setSearch] = useState("");
  
  const [sortBy, setSortBy] = useState<keyof User>("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<User, "id"> = {
    username: "",
    password: "",
    nama: "",
    level: "Staff TU",
    status: "Aktif"
  };
  const [form, setForm] = useState<Omit<User, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  const handleSort = (field: keyof User) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = users.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.username.toLowerCase().includes(search.toLowerCase()) ||
    item.level.toLowerCase().includes(search.toLowerCase())
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

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEditing(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setForm({
      username: item.username,
      password: item.password,
      nama: item.nama,
      level: item.level,
      status: item.status
    });
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.nama) {
      setFormError("Semua kolom wajib diisi!");
      return;
    }

    if (isEditing) {
      setUsers(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newUser: User = {
        ...form,
        id: `u-${Date.now()}`
      };
      setUsers(prev => [newUser, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === "u-1") {
      alert("Pengguna administrator utama tidak boleh dihapus demi keamanan sistem!");
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) {
      setUsers(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "Username": item.username,
      "Nama Lengkap": item.nama,
      "Level Hak Akses": item.level,
      "Status Akun": item.status
    }));
    exportToExcel(exportData, `Data_Pengguna_TU_${settings.namaSekolah.replace(/\s+/g, "_")}`, "USER");
  };

  const handleExportPDF = () => {
    const cols = ["No", "Username", "Nama Lengkap Pengguna", "Level Hak Akses", "Status Akun"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.username,
      item.nama,
      item.level,
      item.status
    ]);
    exportToPDF("Manajemen Pengguna Sistem Administrasi", cols, rows, settings);
  };

  const handlePrint = () => {
    const cols = ["No", "Username", "Nama Lengkap Pengguna", "Level Hak Akses", "Status Akun"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.username,
      item.nama,
      item.level,
      item.status
    ]);
    printData("Laporan Data Pengguna Sistem Tata Usaha", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="user-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Manajemen Pengguna</h2>
          <p className="text-xs text-slate-500">Kelola kredensial login, hak akses operator TU, Administrator, dan akun Kepala Sekolah.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="user-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="user-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="user-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="user-add"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Username, Nama Lengkap, atau Level..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="user-search-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">No</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("username")}>
                Username <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("nama")}>
                Nama Lengkap Pengguna <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3">Password (Ter-enkripsi)</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("level")}>
                Level Hak Akses <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 text-center">Status Akun</th>
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
                  <td className="px-4 py-3 font-semibold text-blue-600 font-mono text-sm">{item.username}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.nama}</td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-xs">••••••••</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.level === "Administrator" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      item.level === "Kepala Sekolah" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                      "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
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
                        title="Edit user"
                        id={`edit-user-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus user"
                        id={`delete-user-${item.id}`}
                        disabled={item.id === "u-1"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada data pengguna sistem ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} pengguna
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
                {isEditing ? "Edit Operator Sistem" : "Tambah Operator Baru"}
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
                <label className="block text-xs font-bold text-slate-500 mb-1">Username Operator *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: sitirahma_tu"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  disabled={isEditing && editId === "u-1"}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Operator *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahma, A.Md."
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Kata Sandi (Password) *</label>
                <input
                  type="password"
                  required
                  placeholder="Tulis password login"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Level Akses</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                    disabled={isEditing && editId === "u-1"}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Staff TU">Staff TU</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status Keaktifan</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                    disabled={isEditing && editId === "u-1"}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
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
                  id="user-submit"
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
