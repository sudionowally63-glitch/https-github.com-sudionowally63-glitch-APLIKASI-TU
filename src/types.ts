export interface Setting {
  namaSekolah: string;
  namaKepsek: string;
  nipKepsek: string;
  tempatTtd: string;
  tanggalTtd: string;
  kopSekolah: string; // Base64 data URL
  logoSekolah?: string; // Base64 data URL for school logo displayed on Login and Sidebar
  npsn?: string;
  alamatSekolah?: string;
  namaBendahara?: string;
  nipBendahara?: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  agama: string; // Wajib 10-digit angka, e.g. "2000000002"
  alamat: string;
  kelas: string;
  namaAyah: string;
  namaIbu: string;
  nomorHpOrangTua: string;
  status: "Aktif" | "Alumni" | "Mutasi";
  foto: string; // Base64 image
}

export interface Guru {
  id: string;
  nip: string;
  nama: string;
  golongan: string;
  pangkat: string;
  mataPelajaran: string;
  pendidikan: string;
  jabatan: string;
  status: string; // PNS, PPPK, Honorer
  alamat: string;
  nomorHp: string;
  email: string;
  foto: string; // Base64 image
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat: string;
  golongan: string;
  alamat: string;
  nomorHp: string;
  email: string;
  status: string; // PNS, PPPK, Honorer
  foto: string; // Base64 image
}

export interface Kelas {
  id: string;
  namaKelas: string;
  waliKelas: string;
  tahunPelajaran: string;
  jumlahSiswa: number;
}

export interface SuratMasuk {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  pengirim: string;
  perihal: string;
  lampiran: string;
  keterangan: string;
  fileScanSurat: string; // Base64 or filename
}

export interface SuratKeluar {
  id: string;
  nomorSurat: string;
  tujuan: string;
  tanggal: string;
  perihal: string;
  lampiran: string;
  fileSurat: string; // Base64 or filename
}

export interface Arsip {
  id: string;
  nomorArsip: string;
  namaArsip: string;
  kategori: string;
  lokasiPenyimpanan: string;
  tanggal: string;
  fileArsip: string; // Base64 or filename
}

export interface Inventaris {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  merk: string;
  jumlah: number;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";
  ruangan: string;
  tahunPembelian: string;
  harga: number;
  keterangan: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  nama: string;
  level: "Administrator" | "Staff TU" | "Kepala Sekolah";
  status: "Aktif" | "Nonaktif";
}

export type ActiveTab =
  | "dashboard"
  | "siswa"
  | "guru"
  | "pegawai"
  | "kelas"
  | "surat"
  | "buat_surat"
  | "arsip"
  | "inventaris"
  | "user"
  | "pengaturan";
