import { Siswa, Guru, Pegawai, Kelas, SuratMasuk, SuratKeluar, Arsip, Inventaris, User, Setting } from "./types";

// Default settings for SMP Negeri 4 Fakfak
export const defaultSettings: Setting = {
  namaSekolah: "SMP Negeri 4 Fakfak",
  namaKepsek: "Drs. Yusuf Hindom, M.Pd.",
  nipKepsek: "197508122003121002",
  tempatTtd: "Fakfak",
  tanggalTtd: "2026-07-08",
  kopSekolah: "", // Empty by default to trigger the elegant vector-drawn official header
  logoSekolah: "" // Empty by default to use default emblem / Tut Wuri / Landmark
};

// Initial Users
export const initialUsers: User[] = [
  {
    id: "u-1",
    username: "admin",
    password: "admintu",
    nama: "Admin TU Utama",
    level: "Administrator",
    status: "Aktif"
  },
  {
    id: "u-2",
    username: "kepsek",
    password: "kepsek4fakfak",
    nama: "Drs. Yusuf Hindom, M.Pd.",
    level: "Kepala Sekolah",
    status: "Aktif"
  },
  {
    id: "u-3",
    username: "staff",
    password: "stafftu",
    nama: "Siti Rahma, A.Md.",
    level: "Staff TU",
    status: "Aktif"
  }
];

// Initial Classes
export const initialKelas: Kelas[] = [
  { id: "k-1", namaKelas: "VII-A", waliKelas: "Sartika, S.Pd.", tahunPelajaran: "2026/2027", jumlahSiswa: 32 },
  { id: "k-2", namaKelas: "VII-B", waliKelas: "Andi Saputra, S.Si.", tahunPelajaran: "2026/2027", jumlahSiswa: 30 },
  { id: "k-3", namaKelas: "VIII-A", waliKelas: "Rina Widya, S.Pd.", tahunPelajaran: "2026/2027", jumlahSiswa: 28 },
  { id: "k-4", namaKelas: "VIII-B", waliKelas: "M. Faisal, S.Pd.", tahunPelajaran: "2026/2027", jumlahSiswa: 29 },
  { id: "k-5", namaKelas: "IX-A", waliKelas: "Lina Marlina, S.Pd.", tahunPelajaran: "2026/2027", jumlahSiswa: 31 },
  { id: "k-6", namaKelas: "IX-B", waliKelas: "Herman, S.Ag.", tahunPelajaran: "2026/2027", jumlahSiswa: 30 }
];

// Initial Teachers
export const initialGuru: Guru[] = [
  {
    id: "g-1",
    nip: "198205142010012005",
    nama: "Sartika, S.Pd.",
    golongan: "III/c",
    pangkat: "Penata",
    mataPelajaran: "Bahasa Indonesia",
    pendidikan: "S1 Pendidikan Bahasa",
    jabatan: "Guru Madya / Wali Kelas VII-A",
    status: "PNS",
    alamat: "Jl. MT Haryono, Fakfak",
    nomorHp: "081234567801",
    email: "sartika.spd@gmail.com",
    foto: ""
  },
  {
    id: "g-2",
    nip: "198809202015031002",
    nama: "Andi Saputra, S.Si.",
    golongan: "III/b",
    pangkat: "Penata Muda Tingkat I",
    mataPelajaran: "IPA Terpadu",
    pendidikan: "S1 Fisika",
    jabatan: "Guru Muda / Wali Kelas VII-B",
    status: "PNS",
    alamat: "Jl. Kadamber, Fakfak",
    nomorHp: "081234567802",
    email: "andisaputra@gmail.com",
    foto: ""
  },
  {
    id: "g-3",
    nip: "198511082009042001",
    nama: "Rina Widya, S.Pd.",
    golongan: "III/d",
    pangkat: "Penata Tingkat I",
    mataPelajaran: "Matematika",
    pendidikan: "S1 Pendidikan Matematika",
    jabatan: "Guru Madya / Wali Kelas VIII-A",
    status: "PNS",
    alamat: "Jl. Kokas, Fakfak",
    nomorHp: "081234567803",
    email: "rinawidya@gmail.com",
    foto: ""
  },
  {
    id: "g-4",
    nip: "199203152020121005",
    nama: "M. Faisal, S.Pd.",
    golongan: "III/a",
    pangkat: "Penata Muda",
    mataPelajaran: "Bahasa Inggris",
    pendidikan: "S1 Pendidikan Bahasa Inggris",
    jabatan: "Guru Pratama / Wali Kelas VIII-B",
    status: "PPPK",
    alamat: "Jl. Wagom, Fakfak",
    nomorHp: "081234567804",
    email: "mfaisal.spd@gmail.com",
    foto: ""
  },
  {
    id: "g-5",
    nip: "197902102005022003",
    nama: "Lina Marlina, S.Pd.",
    golongan: "IV/a",
    pangkat: "Pembina",
    mataPelajaran: "IPS",
    pendidikan: "S1 Pendidikan Geografi",
    jabatan: "Guru Dewasa / Wali Kelas IX-A",
    status: "PNS",
    alamat: "Jl. Merdeka, Fakfak",
    nomorHp: "081234567805",
    email: "linamarlina@gmail.com",
    foto: ""
  },
  {
    id: "g-6",
    nip: "197412052002121001",
    nama: "Herman, S.Ag.",
    golongan: "IV/b",
    pangkat: "Pembina Tingkat I",
    mataPelajaran: "Pendidikan Agama",
    pendidikan: "S1 Agama Islam",
    jabatan: "Guru Utama / Wali Kelas IX-B",
    status: "PNS",
    alamat: "Jl. Thumburuni, Fakfak",
    nomorHp: "081234567806",
    email: "herman.sag@gmail.com",
    foto: ""
  }
];

// Initial Staff/TU
export const initialPegawai: Pegawai[] = [
  {
    id: "p-1",
    nip: "198004122006042004",
    nama: "Siti Rahma, A.Md.",
    jabatan: "Kepala Tata Usaha",
    pangkat: "Penata",
    golongan: "III/c",
    alamat: "Jl. Thumburuni, Fakfak",
    nomorHp: "085244558801",
    email: "sitirahma.tu@gmail.com",
    status: "PNS",
    foto: ""
  },
  {
    id: "p-2",
    nip: "199407252021121002",
    nama: "Eko Prasetyo, S.Kom.",
    jabatan: "Staff Administrasi Data / Operator Dapodik",
    pangkat: "Penata Muda",
    golongan: "III/a",
    alamat: "Jl. Wagom Utara, Fakfak",
    nomorHp: "085244558802",
    email: "ekoprasetyo.tu@gmail.com",
    status: "PPPK",
    foto: ""
  },
  {
    id: "p-3",
    nip: "-",
    nama: "Nurhaliza Abidin, S.E.",
    jabatan: "Bendahara Sekolah",
    pangkat: "-",
    golongan: "-",
    alamat: "Jl. Salasa, Fakfak",
    nomorHp: "085244558803",
    email: "nurhaliza.bendahara@gmail.com",
    status: "Honorer",
    foto: ""
  }
];

// Initial Students
export const initialSiswa: Siswa[] = [
  {
    id: "s-1",
    nis: "242507001",
    nisn: "0112345678",
    nama: "Abdel Achmad",
    tempatLahir: "Fakfak",
    tanggalLahir: "2012-05-15",
    jenisKelamin: "Laki-laki",
    agama: "1000000001", // Islam
    alamat: "Jl. Ki Hajar Dewantara, Fakfak",
    kelas: "VII-A",
    namaAyah: "Achmad Yusuf",
    namaIbu: "Salma Yusuf",
    nomorHpOrangTua: "081344221199",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-2",
    nis: "242507002",
    nisn: "0114552211",
    nama: "Beatrix Ndiken",
    tempatLahir: "Merauke",
    tanggalLahir: "2012-08-22",
    jenisKelamin: "Perempuan",
    agama: "2000000002", // Kristen
    alamat: "Jl. Wagom Pantai, Fakfak",
    kelas: "VII-A",
    namaAyah: "Pius Ndiken",
    namaIbu: "Maria Ndiken",
    nomorHpOrangTua: "081344221100",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-3",
    nis: "242507003",
    nisn: "0119885544",
    nama: "Christian Kabes",
    tempatLahir: "Fakfak",
    tanggalLahir: "2012-11-03",
    jenisKelamin: "Laki-laki",
    agama: "2000000002", // Kristen
    alamat: "Jl. Thumburuni, Fakfak",
    kelas: "VII-B",
    namaAyah: "John Kabes",
    namaIbu: "Agnes Kabes",
    nomorHpOrangTua: "081344221111",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-4",
    nis: "232408001",
    nisn: "0102233445",
    nama: "Dian Safitri",
    tempatLahir: "Fakfak",
    tanggalLahir: "2011-02-14",
    jenisKelamin: "Perempuan",
    agama: "1000000001", // Islam
    alamat: "Jl. Kadamber, Fakfak",
    kelas: "VIII-A",
    namaAyah: "Sulaiman",
    namaIbu: "Hafsah",
    nomorHpOrangTua: "082199008877",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-5",
    nis: "232408002",
    nisn: "0106677889",
    nama: "Fajar Bahari",
    tempatLahir: "Sorong",
    tanggalLahir: "2011-06-30",
    jenisKelamin: "Laki-laki",
    agama: "1000000001", // Islam
    alamat: "Jl. Pelabuhan, Fakfak",
    kelas: "VIII-B",
    namaAyah: "Hasanudin",
    namaIbu: "Aisyah",
    nomorHpOrangTua: "082199008866",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-6",
    nis: "222309001",
    nisn: "0098877665",
    nama: "Grasela Mulyadi",
    tempatLahir: "Jayapura",
    tanggalLahir: "2010-01-25",
    jenisKelamin: "Perempuan",
    agama: "3000000003", // Katolik
    alamat: "Jl. Kokas, Fakfak",
    kelas: "IX-A",
    namaAyah: "Mulyadi",
    namaIbu: "Theresia Mulyadi",
    nomorHpOrangTua: "081299882233",
    status: "Aktif",
    foto: ""
  },
  {
    id: "s-7",
    nis: "222309002",
    nisn: "0095544332",
    nama: "Hariyanto",
    tempatLahir: "Fakfak",
    tanggalLahir: "2010-09-12",
    jenisKelamin: "Laki-laki",
    agama: "1000000001", // Islam
    alamat: "Jl. Merdeka, Fakfak",
    kelas: "IX-B",
    namaAyah: "Sutrisno",
    namaIbu: "Pujiati",
    nomorHpOrangTua: "081299882244",
    status: "Aktif",
    foto: ""
  }
];

// Initial Incoming Mail
export const initialSuratMasuk: SuratMasuk[] = [
  {
    id: "sm-1",
    nomorSurat: "421.3/089/Disdikpora/2026",
    tanggalSurat: "2026-06-15",
    pengirim: "Dinas Pendidikan Pemuda dan Olahraga Fakfak",
    perihal: "Undangan Rapat Koordinasi Kurikulum Merdeka",
    lampiran: "1 Lembar",
    keterangan: "Dihadiri oleh Kepala Sekolah & Wakasek Kurikulum pada 12 Juli 2026 di Aula Disdikpora",
    fileScanSurat: ""
  },
  {
    id: "sm-2",
    nomorSurat: "05/PAN-LOMBA/2026",
    tanggalSurat: "2026-06-28",
    pengirim: "Panitia Festival Olahraga & Seni Pelajar Fakfak",
    perihal: "Undangan Partisipasi Perlombaan Hari Kemerdekaan",
    lampiran: "3 Lembar",
    keterangan: "Lomba Futsal, Gerak Jalan, dan Paduan Suara Tingkat SMP/MTs",
    fileScanSurat: ""
  }
];

// Initial Outgoing Mail
export const initialSuratKeluar: SuratKeluar[] = [
  {
    id: "sk-1",
    nomorSurat: "421.3/072/SMPN4/VII/2026",
    tujuan: "Orang Tua / Wali Siswa Kelas VII, VIII, IX",
    tanggal: "2026-07-02",
    perihal: "Pemberitahuan Permulaan Tahun Pelajaran Baru 2026/2027",
    lampiran: "1 Lembar (Jadwal)",
    fileSurat: ""
  },
  {
    id: "sk-2",
    nomorSurat: "421.3/073/SMPN4/VII/2026",
    tujuan: "Dinas Pendidikan Pemuda dan Olahraga Fakfak",
    tanggal: "2026-07-05",
    perihal: "Laporan Bulanan Keadaan Siswa dan Personil Sekolah - Juni 2026",
    lampiran: "5 Lembar",
    fileSurat: ""
  }
];

// Initial Archives
export const initialArsip: Arsip[] = [
  {
    id: "ar-1",
    nomorArsip: "ARS-001/2025",
    namaArsip: "Dokumen Akreditasi Sekolah Tahun 2025",
    kategori: "Kurikulum & Kelembagaan",
    lokasiPenyimpanan: "Lemari Arsip Utama Seksi A",
    tanggal: "2025-10-15",
    fileArsip: ""
  },
  {
    id: "ar-2",
    nomorArsip: "ARS-002/2025",
    namaArsip: "SK Pembagian Tugas Mengajar Guru Semester Ganjil 2025/2026",
    kategori: "Kepegawaian",
    lokasiPenyimpanan: "Boks File Pegawai Rak 2",
    tanggal: "2025-07-10",
    fileArsip: ""
  }
];

// Initial Inventory
export const initialInventaris: Inventaris[] = [
  {
    id: "i-1",
    kodeBarang: "INV-SMPN4-001",
    namaBarang: "Laptop ASUS VivoBook 14",
    merk: "ASUS",
    jumlah: 15,
    kondisi: "Baik",
    ruangan: "Laboratorium Komputer",
    tahunPembelian: "2024",
    harga: 8500000,
    keterangan: "Digunakan untuk kegiatan ANBK dan operasional lab komputer"
  },
  {
    id: "i-2",
    kodeBarang: "INV-SMPN4-002",
    namaBarang: "Proyektor Epson EB-X500",
    merk: "Epson",
    jumlah: 6,
    kondisi: "Baik",
    ruangan: "Ruang Guru / Kelas",
    tahunPembelian: "2023",
    harga: 6800000,
    keterangan: "Fasilitas pembelajaran multimedia"
  },
  {
    id: "i-3",
    kodeBarang: "INV-SMPN4-003",
    namaBarang: "AC Sharp 1 PK",
    merk: "Sharp",
    jumlah: 4,
    kondisi: "Rusak Ringan",
    ruangan: "Lab Komputer & Ruang TU",
    tahunPembelian: "2022",
    harga: 3800000,
    keterangan: "1 unit di Lab Komputer perlu diservis berkala"
  }
];
