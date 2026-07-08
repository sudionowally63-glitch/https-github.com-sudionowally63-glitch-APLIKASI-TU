import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Download, Printer, X, ArrowUpDown, ChevronLeft, ChevronRight, Package, Calculator
} from "lucide-react";
import { Inventaris, Setting } from "../types";
import { exportToExcel, exportToPDF, printData } from "../utils";

interface InventarisViewProps {
  inventaris: Inventaris[];
  setInventaris: React.Dispatch<React.SetStateAction<Inventaris[]>>;
  settings: Setting;
}

export default function InventarisView({ inventaris, setInventaris, settings }: InventarisViewProps) {
  const [search, setSearch] = useState("");
  
  const [sortBy, setSortBy] = useState<keyof Inventaris>("namaBarang");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const initialForm: Omit<Inventaris, "id"> = {
    kodeBarang: "",
    namaBarang: "",
    merk: "",
    jumlah: 1,
    kondisi: "Baik",
    ruangan: "",
    tahunPembelian: "2026",
    harga: 0,
    keterangan: ""
  };
  const [form, setForm] = useState<Omit<Inventaris, "id">>(initialForm);
  const [formError, setFormError] = useState("");

  const handleSort = (field: keyof Inventaris) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = inventaris.filter(item => 
    item.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
    item.kodeBarang.toLowerCase().includes(search.toLowerCase()) ||
    item.merk.toLowerCase().includes(search.toLowerCase()) ||
    item.ruangan.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleOpenEdit = (item: Inventaris) => {
    setForm({
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      merk: item.merk,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
      ruangan: item.ruangan,
      tahunPembelian: item.tahunPembelian,
      harga: item.harga,
      keterangan: item.keterangan
    });
    setEditId(item.id);
    setIsEditing(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kodeBarang || !form.namaBarang || !form.ruangan) {
      setFormError("Kode, Nama, dan Ruangan wajib diisi!");
      return;
    }

    if (isEditing) {
      setInventaris(prev => prev.map(item => item.id === editId ? { ...form, id: editId } : item));
    } else {
      const newInventaris: Inventaris = {
        ...form,
        id: `i-${Date.now()}`
      };
      setInventaris(prev => [newInventaris, ...prev]);
    }
    
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aset inventaris "${name}"?`)) {
      setInventaris(prev => prev.filter(item => item.id !== id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Format IDR Currency helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Total Calculations
  const totalBarang = filteredData.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalValue = filteredData.reduce((acc, curr) => acc + (curr.harga * curr.jumlah), 0);

  const handleExportExcel = () => {
    const exportData = sortedData.map((item, idx) => ({
      "No": idx + 1,
      "Kode Barang": item.kodeBarang,
      "Nama Barang": item.namaBarang,
      "Merk": item.merk,
      "Jumlah": item.jumlah,
      "Kondisi": item.kondisi,
      "Ruangan": item.ruangan,
      "Tahun Pembelian": item.tahunPembelian,
      "Harga Satuan": item.harga,
      "Total Nilai": item.harga * item.jumlah,
      "Keterangan": item.keterangan
    }));
    exportToExcel(exportData, `Data_Inventaris_${settings.namaSekolah.replace(/\s+/g, "_")}`, "INVENTARIS");
  };

  const handleExportPDF = () => {
    const cols = ["No", "Kode / Nama", "Merk / Tahun", "Jumlah", "Kondisi", "Lokasi", "Harga Satuan", "Total Nilai"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      `${item.kodeBarang}\n${item.namaBarang}`,
      `${item.merk}\nTh. ${item.tahunPembelian}`,
      `${item.jumlah} Unit`,
      item.kondisi,
      item.ruangan,
      formatIDR(item.harga),
      formatIDR(item.harga * item.jumlah)
    ]);
    exportToPDF("Rekapitulasi Inventaris Sarana Prasarana", cols, rows, settings, true); // Landscape to fit columns
  };

  const handlePrint = () => {
    const cols = ["No", "Kode Barang", "Nama Barang", "Merk", "Jumlah", "Kondisi", "Ruangan", "Harga Satuan", "Total Nilai"];
    const rows = sortedData.map((item, idx) => [
      idx + 1,
      item.kodeBarang,
      item.namaBarang,
      item.merk || "-",
      item.jumlah,
      item.kondisi,
      item.ruangan,
      formatIDR(item.harga),
      formatIDR(item.harga * item.jumlah)
    ]);
    printData("Laporan Data Inventaris Sarana Prasarana", cols, rows, settings);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs" id="inventaris-view">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Data Master Inventaris</h2>
          <p className="text-xs text-slate-500">Rekap sarana & prasarana belajar, peralatan IT, AC, meja, kursi, dan nilai aset sekolah.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
            id="inventaris-export-excel"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
            id="inventaris-export-pdf"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            id="inventaris-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            id="inventaris-add"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Barang
          </button>
        </div>
      </div>

      {/* Summations Cards banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Unit Barang</span>
            <span className="text-lg font-bold text-slate-800">{totalBarang} Unit</span>
          </div>
        </div>
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Nilai Aset</span>
            <span className="text-lg font-bold text-slate-800">{formatIDR(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama Barang, Kode, Merk, atau Ruangan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition"
            id="inventaris-search-input"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-[60px]">No</th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("kodeBarang")}>
                Kode Barang <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("namaBarang")}>
                Nama Barang <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3">Merk / Brand</th>
              <th className="px-4 py-3 text-center cursor-pointer select-none" onClick={() => handleSort("jumlah")}>
                Jumlah <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 text-center">Kondisi</th>
              <th className="px-4 py-3">Lokasi / Ruangan</th>
              <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort("harga")}>
                Harga Satuan <ArrowUpDown className="inline-block w-3 h-3 ml-1" />
              </th>
              <th className="px-4 py-3 text-right">Total Nilai</th>
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
                  <td className="px-4 py-3 font-mono font-medium text-slate-700 text-[11px]">{item.kodeBarang}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.namaBarang}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    <span className="block">{item.merk || "-"}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">Pembelian: {item.tahunPembelian || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-700 font-mono">{item.jumlah} Unit</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.kondisi === "Baik" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      item.kondisi === "Rusak Ringan" ? "bg-amber-50 text-amber-700 border-amber-100" :
                      "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      {item.kondisi}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{item.ruangan}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">{formatIDR(item.harga)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">{formatIDR(item.harga * item.jumlah)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit barang"
                        id={`edit-inv-${item.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaBarang)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus barang"
                        id={`delete-inv-${item.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada barang inventaris ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} barang
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditing ? "Edit Barang Inventaris" : "Tambah Barang Inventaris Baru"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kode Barang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: INV-SMPN4-004"
                    value={form.kodeBarang}
                    onChange={(e) => setForm({ ...form, kodeBarang: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Barang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Meja Kursi Belajar Siswa"
                    value={form.namaBarang}
                    onChange={(e) => setForm({ ...form, namaBarang: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Merk / Brand</label>
                  <input
                    type="text"
                    placeholder="Contoh: Olympian / IKEA"
                    value={form.merk}
                    onChange={(e) => setForm({ ...form, merk: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tahun Pembelian</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2025"
                    value={form.tahunPembelian}
                    onChange={(e) => setForm({ ...form, tahunPembelian: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jumlah Unit *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.jumlah}
                    onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kondisi Barang</label>
                  <select
                    value={form.kondisi}
                    onChange={(e) => setForm({ ...form, kondisi: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi Ruangan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ruang Guru / Kelas VII-A"
                    value={form.ruangan}
                    onChange={(e) => setForm({ ...form, ruangan: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Harga Pembelian Satuan (Rupiah)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Keterangan / Deskripsi Aset</label>
                <textarea
                  placeholder="Deskripsi pendukung..."
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  rows={2}
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
                  id="inventaris-submit"
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
