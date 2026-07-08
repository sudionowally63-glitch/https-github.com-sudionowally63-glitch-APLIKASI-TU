import React, { useState, useEffect } from "react";
import { 
  FileText, User, Printer, Download, Save, RefreshCw, CheckCircle, Search, HelpCircle, Briefcase, GraduationCap, Calendar, ArrowRightLeft, Award, FileSpreadsheet, UserCheck, ShieldCheck
} from "lucide-react";
import { Siswa, Guru, Pegawai, SuratKeluar, Setting } from "../types";

interface BuatSuratViewProps {
  siswa: Siswa[];
  guru: Guru[];
  pegawai: Pegawai[];
  suratKeluar: SuratKeluar[];
  setSuratKeluar: React.Dispatch<React.SetStateAction<SuratKeluar[]>>;
  settings: Setting;
}

type TemplateType = "undangan" | "pemberitahuan" | "tugas" | "keterangan" | "permohonan" | "pindah_siswa" | "rekomendasi_menerima" | "kelakuan_baik" | "rekomendasi_pegawai" | "edaran" | "keputusan";

export default function BuatSuratView({
  siswa,
  guru,
  pegawai,
  suratKeluar,
  setSuratKeluar,
  settings
}: BuatSuratViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("undangan");
  
  // Form fields
  const [nomorSurat, setNomorSurat] = useState("");
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split("T")[0]);
  const [lampiranSurat, setLampiranSurat] = useState("-");
  const [perihalSurat, setPerihalSurat] = useState("Surat Undangan Rapat Orang Tua / Wali");
  const [tujuanSurat, setTujuanSurat] = useState("Kepada Yth.\nBapak/Ibu Orang Tua / Wali Siswa\ndi-\n  Tempat");
  
  // Subtype states for nested features
  const [keteranganSubtype, setKeteranganSubtype] = useState<"aktif" | "kelakuan_baik" | "lulus">("aktif");
  const [rekomendasiSubtype, setRekomendasiSubtype] = useState<"pindah" | "menerima">("pindah");

  // References
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [selectedGuruId, setSelectedGuruId] = useState("");
  const [selectedPegawaiId, setSelectedPegawaiId] = useState("");
  
  // Template specific states
  const [keperluanSiswa, setKeperluanSiswa] = useState("Pengajuan Beasiswa / PIP");
  const [tugasDeskripsi, setTugasDeskripsi] = useState("Mengikuti kegiatan Bimbingan Teknis Implementasi Kurikulum Merdeka");
  const [tugasTanggalMulai, setTugasTanggalMulai] = useState(new Date().toISOString().split("T")[0]);
  const [tugasTanggalSelesai, setTugasTanggalSelesai] = useState(new Date().toISOString().split("T")[0]);
  const [tugasTempat, setTugasTempat] = useState("Aula Dinas Pendidikan Kepemudaan dan Olahraga Kabupaten Fakfak");
  const [tugasDasar, setTugasDasar] = useState("Surat Kepala Dinas Pendidikan Kepemudaan dan Olahraga Kab. Fakfak Nomor 421.3/230/Disdikpora/2026");
  
  // Invitation fields
  const [undanganTanggal, setUndanganTanggal] = useState("Kamis, 16 Juli 2026");
  const [undanganWaktu, setUndanganWaktu] = useState("09.00 WIT s.d. Selesai");
  const [undanganTempat, setUndanganTempat] = useState("Aula SMP Negeri 4 Fakfak");
  const [undanganAgenda, setUndanganAgenda] = useState("Rapat Koordinasi Komite dan Pembahasan Evaluasi Pembelajaran Semester Ganjil");
  
  // Pindah Sekolah (Transfer Out) fields
  const [pindahSekolahTujuan, setPindahSekolahTujuan] = useState("SMP Negeri 1 Sorong");
  const [pindahAlasan, setPindahAlasan] = useState("Mengikuti Orang Tua Pindah Tugas / Domisili");

  // Rekomendasi Mutasi (Transfer In Recommendation) fields
  const [mutasiAsalSekolah, setMutasiAsalSekolah] = useState("SMP Swasta Kristen Fakfak");
  const [mutasiSiswaNama, setMutasiSiswaNama] = useState("Budi Santoso");
  const [mutasiSiswaNisn, setMutasiSiswaNisn] = useState("0115432908");
  const [mutasiSiswaKelas, setMutasiSiswaKelas] = useState("Kelas VIII-A");

  // Graduation (SKL) fields
  const [lulusTahunPelajaran, setLulusTahunPelajaran] = useState("2025/2026");
  const [lulusRataRata, setLulusRataRata] = useState("84.50");

  // Custom text bodies for new types
  const [pemberitahuanIsi, setPemberitahuanIsi] = useState(
    "Sehubungan dengan akan berakhirnya Kegiatan Belajar Mengajar (KBM) Semester Ganjil Tahun Pelajaran 2026/2027, dengan ini kami sampaikan kepada Bapak/Ibu Orang Tua/Wali Siswa bahwa Penilaian Akhir Semester (PAS) akan dilaksanakan mulai tanggal 7 hingga 14 Desember 2026. Untuk itu, kami mohon kerja sama Bapak/Ibu sekalian agar memantau belajar putra-putri Anda di rumah."
  );
  
  const [permohonanIsi, setPermohonanIsi] = useState(
    "Dalam rangka meningkatkan minat baca siswa dan menyukseskan program gerakan literasi sekolah, kami mengajukan permohonan bantuan penambahan buku-buku koleksi perpustakaan, baik fiksi maupun non-fiksi, sebanyak 200 eksemplar. Kami sangat mengharapkan bantuan ini guna memperkaya bahan pustaka yang tersedia di perpustakaan sekolah kami."
  );

  const [edaranIsi, setEdaranIsi] = useState(
    "Diberitahukan kepada seluruh siswa, guru, dan staf SMP Negeri 4 Fakfak bahwa terhitung sejak tanggal diterbitkannya surat edaran ini, seluruh siswa dilarang keras membawa dan mengoperasikan handphone (smartphone) selama jam kegiatan belajar mengajar (KBM) berlangsung, kecuali atas instruksi guru pengampu mata pelajaran untuk kepentingan pembelajaran digital. Pelanggaran terhadap edaran ini akan dikenakan sanksi penyitaan sementara."
  );

  const [skTentang, setSkTentang] = useState("PEMBENTUKAN PANITIA UJIAN SEKOLAH TAHUN PELAJARAN 2025/2026");
  const [skMenimbang, setSkMenimbang] = useState(
    "a. Bahwa demi ketertiban dan kelancaran pelaksanaan ujian sekolah, perlu dibentuk panitia penyelenggara;\nb. Bahwa personel yang tercantum namanya dalam keputusan ini dianggap mampu mengemban tugas tersebut."
  );
  const [skMengingat, setSkMengingat] = useState(
    "1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;\n2. Peraturan Pemerintah Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan."
  );
  const [skMenetapkan, setSkMenetapkan] = useState(
    "PERTAMA: Menetapkan Susunan Panitia Ujian Sekolah sebagaimana terlampir.\nKEDUA: Biaya penyelenggaraan dibebankan pada anggaran dana BOS.\nKETIGA: Keputusan ini berlaku sejak tanggal ditetapkan."
  );
  
  // Rekomendasi Pegawai fields
  const [rekomPegawaiType, setRekomPegawaiType] = useState<"guru" | "pegawai" | "manual">("manual");
  const [selectedRekomGuruId, setSelectedRekomGuruId] = useState("");
  const [selectedRekomPegawaiId, setSelectedRekomPegawaiId] = useState("");
  const [rekomPegawaiNama, setRekomPegawaiNama] = useState("Rina Lestari, S.Pd.");
  const [rekomPegawaiNip, setRekomPegawaiNip] = useState("199208152020122001");
  const [rekomPegawaiJabatan, setRekomPegawaiJabatan] = useState("Guru Pertama - Guru Matematika");
  const [rekomPegawaiPangkat, setRekomPegawaiPangkat] = useState("Penata Muda, III/a");
  const [rekomPegawaiAsal, setRekomPegawaiAsal] = useState("SMP Negeri 2 Fakfak");
  const [rekomPegawaiPendidikan, setRekomPegawaiPendidikan] = useState("S-1 Pendidikan Matematika");
  const [rekomPegawaiTugas, setRekomPegawaiTugas] = useState("Mengajar Mata Pelajaran Matematika Tingkat Kelas VII dan VIII");
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto generate nomor surat draft based on template selection
  useEffect(() => {
    const year = new Date().getFullYear();
    const monthsRomawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const monthRomawi = monthsRomawi[new Date().getMonth()];
    
    let code = "421.3"; // Code for general education/school administration
    if (selectedTemplate === "tugas") {
      code = "094"; // Code for official assignment / SPPD
    } else if (selectedTemplate === "undangan") {
      code = "005"; // Code for invitation
    } else if (selectedTemplate === "keputusan") {
      code = "800"; // Code for decree / SK
    } else if (selectedTemplate === "edaran") {
      code = "421"; // Code for circular
    } else if (selectedTemplate === "permohonan") {
      code = "024"; // Code for application / request
    } else if (selectedTemplate === "pindah_siswa") {
      code = "422"; // Code for student transfer/recommendation
    } else if (selectedTemplate === "rekomendasi_menerima") {
      code = "422"; // Code for student transfer/recommendation
    } else if (selectedTemplate === "kelakuan_baik") {
      code = "421.2"; // Code for student certificate / SKBB
    } else if (selectedTemplate === "rekomendasi_pegawai") {
      code = "800"; // Code for official recommendation
    } else if (selectedTemplate === "pemberitahuan") {
      code = "421.1"; // Code for notification
    }
    
    // Draft format
    const count = suratKeluar.length + 1;
    const paddedCount = String(count).padStart(3, "0");
    setNomorSurat(`${code}/${paddedCount}/${settings.namaSekolah.replace(/\s+/g, "")}/${monthRomawi}/${year}`);
  }, [selectedTemplate, suratKeluar, settings.namaSekolah]);

  // Handle dynamic defaults for Subject, Lampiran and Destination on Template changes
  useEffect(() => {
    if (selectedTemplate === "undangan") {
      setPerihalSurat("Surat Undangan Rapat Orang Tua / Wali Siswa");
      setTujuanSurat("Kepada Yth.\nBapak / Ibu Orang Tua / Wali Murid\nKelas VII, VIII, dan IX\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "pemberitahuan") {
      setPerihalSurat("Pemberitahuan Pelaksanaan Ujian Semester");
      setTujuanSurat("Kepada Yth.\nBapak / Ibu Orang Tua / Wali Siswa\nSeluruh Tingkat Kelas\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "tugas") {
      setPerihalSurat("Surat Tugas Kegiatan Workshop / Bimtek");
      setTujuanSurat("Kepada Yth.\nBapak / Ibu Guru / Staf\nyang namanya tercantum di bawah\ndi-\n  Tempat");
      setLampiranSurat("1 (Satu) Lembar");
    } else if (selectedTemplate === "keterangan") {
      setPerihalSurat("Surat Keterangan Resmi Sekolah");
      setTujuanSurat("Kepada Yth.\nInstansi Terkait / Orang Tua Siswa\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "permohonan") {
      setPerihalSurat("Permohonan Bantuan Buku Koleksi Perpustakaan");
      setTujuanSurat("Kepada Yth.\nKepala Dinas Kearsipan dan Perpustakaan\nKabupaten Fakfak\ndi-\n  Tempat");
      setLampiranSurat("1 (Satu) Berkas");
    } else if (selectedTemplate === "pindah_siswa") {
      setPerihalSurat("Surat Keterangan Pindah Sekolah (Mutasi Keluar)");
      setTujuanSurat("Kepada Yth.\nKepala SMP Negeri 1 Sorong\nProvinsi Papua Barat\ndi-\n  Tempat");
      setLampiranSurat("1 (Satu) Berkas");
    } else if (selectedTemplate === "rekomendasi_menerima") {
      setPerihalSurat("Keterangan Rekomendasi Bersedia Menerima Siswa (Mutasi Masuk)");
      setTujuanSurat("Kepada Yth.\nKepala SMP Swasta Kristen Fakfak\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "kelakuan_baik") {
      setPerihalSurat("Surat Keterangan Berkelakuan Baik (SKBB)");
      setTujuanSurat("Kepada Yth.\nKepala Kepolisian Sektor Fakfak\nAtau Instansi yang Berkepentingan\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "rekomendasi_pegawai") {
      setPerihalSurat("Surat Rekomendasi Bersedia Menerima Pendidik / Tenaga Kependidikan");
      setTujuanSurat("Kepada Yth.\nKepala Dinas Pendidikan Kepemudaan dan Olahraga\nKabupaten Fakfak\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "edaran") {
      setPerihalSurat("Surat Edaran Ketertiban Penggunaan HP");
      setTujuanSurat("Kepada Yth.\nSeluruh Siswa, Guru, dan Staf\nSMP Negeri 4 Fakfak\ndi-\n  Tempat");
      setLampiranSurat("-");
    } else if (selectedTemplate === "keputusan") {
      setPerihalSurat("Surat Keputusan (SK) Kepala Sekolah");
      setTujuanSurat("Kepada Yth.\nSeluruh Dewan Guru dan Tenaga Kependidikan\ndi-\n  Tempat");
      setLampiranSurat("1 (Satu) Bundel");
    }
  }, [selectedTemplate]);

  // Set defaults for selected records
  useEffect(() => {
    if (siswa.length > 0 && !selectedSiswaId) {
      setSelectedSiswaId(siswa[0].id);
    }
    if (guru.length > 0 && !selectedGuruId) {
      setSelectedGuruId(guru[0].id);
    }
    if (pegawai.length > 0 && !selectedPegawaiId) {
      setSelectedPegawaiId(pegawai[0].id);
    }
  }, [siswa, guru, pegawai]);

  // Retrieve current active data entities
  const activeSiswa = siswa.find(s => s.id === selectedSiswaId) || siswa[0];
  const activeGuru = guru.find(g => g.id === selectedGuruId) || guru[0];
  const activePegawai = pegawai.find(p => p.id === selectedPegawaiId) || pegawai[0];
  const isLetterFormat = ["undangan", "pemberitahuan", "permohonan", "edaran"].includes(selectedTemplate);
  
  const dewanGuruActive = guru.find(g => g.id === selectedRekomGuruId) || guru[0];
  const stafActive = pegawai.find(p => p.id === selectedRekomPegawaiId) || pegawai[0];

  // Set default selection IDs
  useEffect(() => {
    if (guru.length > 0 && !selectedRekomGuruId) {
      setSelectedRekomGuruId(guru[0].id);
    }
    if (pegawai.length > 0 && !selectedRekomPegawaiId) {
      setSelectedRekomPegawaiId(pegawai[0].id);
    }
  }, [guru, pegawai]);

  // Synchronize state when selected teacher/staff changes in recommendation
  useEffect(() => {
    if (rekomPegawaiType === "guru" && dewanGuruActive) {
      setRekomPegawaiNama(dewanGuruActive.nama);
      setRekomPegawaiNip(dewanGuruActive.nip);
      setRekomPegawaiJabatan(dewanGuruActive.jabatan);
      setRekomPegawaiPangkat(dewanGuruActive.pangkat || "Penata Muda, III/a");
      setRekomPegawaiAsal("SMP Negeri 4 Fakfak");
      setRekomPegawaiPendidikan(dewanGuruActive.pendidikan || "S-1");
    } else if (rekomPegawaiType === "pegawai" && stafActive) {
      setRekomPegawaiNama(stafActive.nama);
      setRekomPegawaiNip(stafActive.nip);
      setRekomPegawaiJabatan(stafActive.jabatan);
      setRekomPegawaiPangkat(stafActive.pangkat || "Pengatur, II/c");
      setRekomPegawaiAsal("SMP Negeri 4 Fakfak");
      setRekomPegawaiPendidikan("Diploma / S-1");
    }
  }, [rekomPegawaiType, selectedRekomGuruId, selectedRekomPegawaiId, dewanGuruActive, stafActive]);

  // Map religion code to human name
  const getReligionName = (religionCode: string) => {
    const religionMap: { [key: string]: string } = {
      "1000000001": "Islam",
      "2000000002": "Kristen",
      "3000000003": "Katolik",
      "4000000004": "Hindu",
      "5000000005": "Buddha",
      "6000000006": "Konghucu"
    };
    return religionMap[religionCode] || religionCode || "Kristen";
  };

  // Register to Outgoing Database
  const handleRegisterToOutgoing = () => {
    let perihal = perihalSurat || "Surat Dinas Resmi";
    let lines = tujuanSurat.split("\n").map(l => l.trim()).filter(l => l !== "");
    let tujuan = "Instansi / Orang Tua Siswa";
    
    // Attempt to extract a clean recipient from the multi-line text
    if (lines.length > 0) {
      if (lines[0].toLowerCase().startsWith("kepada yth")) {
        tujuan = lines[1] || lines[0];
      } else {
        tujuan = lines[0];
      }
    }
    
    const newOutgoing: SuratKeluar = {
      id: `sk-sys-${Date.now()}`,
      nomorSurat,
      tanggal: tanggalSurat,
      tujuan,
      perihal,
      lampiran: lampiranSurat,
      fileSurat: "" // Will render live dynamically
    };

    setSuratKeluar(prev => [newOutgoing, ...prev]);
    setSuccessMessage("Surat resmi berhasil didaftarkan ke Log Registrasi Surat Keluar!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Trigger browser print for just the paper preview
  const handlePrintLetter = () => {
    const printContent = document.getElementById("letter-paper-preview")?.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow || !printContent) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${nomorSurat ? nomorSurat.replace(/[/]/g, "_") : "Surat_Resmi"}</title>
    `);

    // 1. Copy all parent document stylesheets (Tailwind + custom styles) so all layout classes render perfectly
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    styles.forEach(style => {
      printWindow.document.write(style.outerHTML);
    });

    printWindow.document.write(`
          <style>
            /* 2. Overriding print layout styles to ensure A4 size and clear margins without double margin overlap */
            @media print {
              @page {
                size: A4 portrait;
                margin: 15mm 20mm 15mm 20mm !important; /* Elegant official margins */
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                width: 100% !important;
                font-family: 'Times New Roman', Times, serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #letter-paper-preview {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                min-height: auto !important;
                background: transparent !important;
              }
            }

            /* Styles for offline viewing in the browser window before printing */
            body { 
              font-family: 'Times New Roman', Times, serif !important; 
              color: #000000 !important;
              line-height: 1.6 !important;
              background: #ffffff !important;
              padding: 0;
              margin: 15mm 20mm;
            }
            h1, h2, h3, h4, h5 {
              color: #000000 !important;
              font-family: 'Times New Roman', Times, serif !important;
            }
            
            /* Kop Surat Styles */
            .kop-container {
              display: flex !important;
              align-items: center !important;
              border-bottom: 4px double #000000 !important;
              padding-bottom: 12px !important;
              margin-bottom: 24px !important;
              position: relative !important;
              text-align: center !important;
              justify-content: center !important;
            }
            .kop-logo-wrapper {
              position: absolute !important;
              left: 0px !important;
              top: 45% !important;
              transform: translateY(-50%) !important;
            }
            .kop-text-wrapper {
              width: 100% !important;
              padding-left: 80px !important;
              padding-right: 20px !important;
            }
            .kop-gov {
              font-size: 13.5px !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              margin: 0 !important;
              line-height: 1.2 !important;
              letter-spacing: 0.5px !important;
            }
            .kop-dept {
              font-size: 12.5px !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              margin: 0 !important;
              line-height: 1.2 !important;
              letter-spacing: 0.5px !important;
            }
            .kop-school {
              font-size: 17px !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              margin: 3px 0 !important;
              line-height: 1.2 !important;
              letter-spacing: 0.75px !important;
            }
            .kop-info {
              font-size: 9px !important;
              font-style: italic !important;
              margin: 1px 0 !important;
              line-height: 1.3 !important;
              font-weight: normal !important;
            }
            
            /* Letter Title */
            .letter-heading {
              text-align: center !important;
              margin-bottom: 25px !important;
              text-transform: uppercase !important;
            }
            .letter-title-main {
              font-size: 14px !important;
              font-weight: bold !important;
              text-decoration: underline !important;
              margin: 0 !important;
              letter-spacing: 0.5px !important;
              line-height: 1.3 !important;
            }
            .letter-num {
              font-size: 11.5px !important;
              margin: 3px 0 0 0 !important;
              font-family: 'Times New Roman', Times, serif !important;
              font-weight: normal !important;
              text-transform: none !important;
            }
            
            /* Text paragraphs */
            .body-text {
              font-size: 12px !important;
              text-align: justify !important;
              text-indent: 40px !important;
              margin-bottom: 12px !important;
              line-height: 1.6 !important;
              color: #000000 !important;
            }
            .lead-text {
              font-size: 12px !important;
              text-align: left !important;
              margin-bottom: 12px !important;
              line-height: 1.6 !important;
              color: #000000 !important;
            }
            
            /* Metadata Tables with explicit page break prevention */
            .meta-table {
              width: 100% !important;
              margin: 15px 0 !important;
              border-collapse: collapse !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .meta-table td {
              padding: 4px 0px !important;
              font-size: 12px !important;
              vertical-align: top !important;
              color: #000000 !important;
              line-height: 1.5 !important;
            }
            .meta-table td.label-col {
              width: 28% !important;
            }
            .meta-table td.colon-col {
              width: 4% !important;
              text-align: center !important;
            }
            .meta-table td.value-col {
              width: 68% !important;
            }
            
            /* Signatures with explicit page break prevention */
            .signature-container {
              width: 100% !important;
              margin-top: 40px !important;
              display: flex !important;
              justify-content: flex-end !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .signature-block {
              width: 250px !important;
              text-align: left !important;
              font-size: 12px !important;
              position: relative !important;
              color: #000000 !important;
            }
            .signature-date {
              margin: 0 0 4px 0 !important;
              line-height: 1.4 !important;
            }
            .signature-role {
              margin: 0 0 70px 0 !important;
              line-height: 1.4 !important;
            }
            .signature-name {
              font-weight: bold !important;
              text-decoration: underline !important;
              text-transform: uppercase !important;
              margin: 0 !important;
              line-height: 1.4 !important;
            }
            .signature-nip {
              font-size: 11.5px !important;
              margin: 2px 0 0 0 !important;
              line-height: 1.4 !important;
            }
            
            /* Clean preview shell wrappers for print */
            #letter-paper-preview {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: auto !important;
            }
          </style>
        </head>
        <body>
          <div id="letter-paper-preview" style="font-family: 'Times New Roman', Times, serif;">
            ${printContent}
          </div>
          
          <script>
            // 3. Robust image loader synchronization to prevent missing logos or seals in printouts
            window.onload = function() {
              const images = Array.from(document.getElementsByTagName('img'));
              if (images.length === 0) {
                // If there are no images, trigger printing immediately
                window.print();
                setTimeout(() => { window.close(); }, 1200);
                return;
              }
              
              let loadedCount = 0;
              const onImageLoadOrError = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                  // Small grace delay for browser to finish decoding the images and compiling the layout
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => { window.close(); }, 1200);
                  }, 600);
                }
              };
              
              images.forEach(img => {
                if (img.complete) {
                  onImageLoadOrError();
                } else {
                  img.onload = onImageLoadOrError;
                  img.onerror = onImageLoadOrError; // Continue even if an image fails to load
                }
              });
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Convert Date String into Indonesian Date format
  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  // Filter students based on search query
  const filteredSiswa = siswa.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nisn.includes(searchQuery) ||
    s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="buat-surat-view">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-md font-bold text-slate-800 font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Generator Surat Resmi Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Buat dan cetak surat administrasi dinas secara dinamis. Tarik data dari database internal Siswa, Guru, dan Pegawai secara instan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrintLetter}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak & Download
          </button>
          <button 
            onClick={handleRegisterToOutgoing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition"
          >
            <Save className="w-3.5 h-3.5" /> Daftarkan Surat Keluar
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold shadow-xs animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: CONFIGURATOR (5 Columns) */}
        <div className="xl:col-span-5 space-y-6">
          {/* 1. Template Selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-display">1. Pilih Jenis Surat</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedTemplate("undangan")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "undangan"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Undangan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Undangan rapat orang tua, guru, komite</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("pemberitahuan")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "pemberitahuan"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-sky-100 rounded-lg text-sky-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Pemberitahuan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Informasi libur, ujian, kegiatan sekolah</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("tugas")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "tugas"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Tugas</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tugas dinas guru atau pegawai kependidikan</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("keterangan")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "keterangan"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Keterangan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Keterangan aktif siswa, kelakuan baik, lulus</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("permohonan")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "permohonan"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Permohonan</p>
                  <p className="text-[10px] text-slate-400 font-medium">Permohonan bantuan, peminjaman alat, dinas</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("pindah_siswa")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "pindah_siswa"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Pindah Siswa</p>
                  <p className="text-[10px] text-slate-400 font-medium">Mutasi Keluar, rujukan sekolah tujuan siswa</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("rekomendasi_menerima")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "rekomendasi_menerima"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-teal-100 rounded-lg text-teal-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Rekomendasi Menerima Siswa</p>
                  <p className="text-[10px] text-slate-400 font-medium">Keterangan bersedia menerima siswa mutasi masuk</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("kelakuan_baik")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "kelakuan_baik"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Keterangan Berkelakuan Baik</p>
                  <p className="text-[10px] text-slate-400 font-medium">Pernyataan kesiswaan bahwa siswa berkelakuan baik (SKBB)</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("rekomendasi_pegawai")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "rekomendasi_pegawai"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Rekomendasi Menerima Pegawai/Guru</p>
                  <p className="text-[10px] text-slate-400 font-medium">Rekomendasi bersedia menerima mutasi guru atau staf baru</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("edaran")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "edaran"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Edaran</p>
                  <p className="text-[10px] text-slate-400 font-medium">Himbauan resmi, aturan tertib sekolah, SOP</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("keputusan")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border text-xs font-semibold transition ${
                  selectedTemplate === "keputusan"
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Surat Keputusan (SK)</p>
                  <p className="text-[10px] text-slate-400 font-medium">SK pembagian tugas mengajar, komite, panitia</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Metadata & Parameter Fields */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">2. Isi Atribut Surat</h3>
            
            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Surat Resmi</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Surat</label>
                <input
                  type="date"
                  value={tanggalSurat}
                  onChange={(e) => setTanggalSurat(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lampiran</label>
                <input
                  type="text"
                  value={lampiranSurat}
                  onChange={(e) => setLampiranSurat(e.target.value)}
                  placeholder="Contoh: 1 (Satu) berkas"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perihal Surat</label>
                <input
                  type="text"
                  value={perihalSurat}
                  onChange={(e) => setPerihalSurat(e.target.value)}
                  placeholder="Contoh: Undangan Rapat Sekolah"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tujuan / Alamat Penerima</label>
              <textarea
                rows={3}
                value={tujuanSurat}
                onChange={(e) => setTujuanSurat(e.target.value)}
                placeholder="Contoh: Kepada Yth. Bapak/Ibu..."
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Template Specific Fields */}
            {selectedTemplate === "undangan" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-[10px] text-blue-800">
                  <strong>Atribut Undangan Resmi:</strong> Sesuaikan jadwal rapat dan rincian agenda acara di bawah ini.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Siswa Terkait (Sebagai Acuan Orang Tua)</label>
                  <select
                    value={selectedSiswaId}
                    onChange={(e) => setSelectedSiswaId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    {siswa.map(s => (
                      <option key={s.id} value={s.id}>{s.nama} (Kelas {s.kelas}) - Ortu: {s.namaAyah || s.namaIbu || "Wali"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hari & Tanggal Pertemuan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kamis, 16 Juli 2026"
                    value={undanganTanggal}
                    onChange={(e) => setUndanganTanggal(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Waktu Pertemuan</label>
                    <input
                      type="text"
                      value={undanganWaktu}
                      onChange={(e) => setUndanganWaktu(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tempat Acara</label>
                    <input
                      type="text"
                      value={undanganTempat}
                      onChange={(e) => setUndanganTempat(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agenda / Maksud Undangan</label>
                  <textarea
                    rows={2.5}
                    value={undanganAgenda}
                    onChange={(e) => setUndanganAgenda(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "pemberitahuan" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-100 text-[10px] text-sky-800">
                  <strong>Isi Surat Pemberitahuan:</strong> Tulis rincian pengumuman/pemberitahuan resmi yang akan dibagikan kepada penerima surat.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rincian Narasi Pemberitahuan</label>
                  <textarea
                    rows={5}
                    value={pemberitahuanIsi}
                    onChange={(e) => setPemberitahuanIsi(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-justify"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "tugas" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Guru Penerima Tugas</label>
                    <select
                      value={selectedGuruId}
                      onChange={(e) => setSelectedGuruId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    >
                      {guru.map(g => (
                        <option key={g.id} value={g.id}>{g.nama} - {g.jabatan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Atau Pilih Staff TU</label>
                    <select
                      value={selectedPegawaiId}
                      onChange={(e) => setSelectedPegawaiId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Lewati Staff TU --</option>
                      {pegawai.map(p => (
                        <option key={p.id} value={p.id}>{p.nama} - {p.jabatan}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Uraian Tugas / Perintah Dinas</label>
                  <textarea
                    rows={2.5}
                    value={tugasDeskripsi}
                    onChange={(e) => setTugasDeskripsi(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dasar Pelaksanaan Tugas</label>
                  <input
                    type="text"
                    value={tugasDasar}
                    onChange={(e) => setTugasDasar(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mulai Tanggal</label>
                    <input
                      type="date"
                      value={tugasTanggalMulai}
                      onChange={(e) => setTugasTanggalMulai(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selesai Tanggal</label>
                    <input
                      type="date"
                      value={tugasTanggalSelesai}
                      onChange={(e) => setTugasTanggalSelesai(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tempat Pelaksanaan</label>
                  <input
                    type="text"
                    value={tugasTempat}
                    onChange={(e) => setTugasTempat(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "keterangan" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jenis Surat Keterangan</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setKeteranganSubtype("aktif");
                        setPerihalSurat("Surat Keterangan Aktif Belajar");
                      }}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        keteranganSubtype === "aktif"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Aktif Siswa
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setKeteranganSubtype("kelakuan_baik");
                        setPerihalSurat("Surat Keterangan Kelakuan Baik");
                      }}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        keteranganSubtype === "kelakuan_baik"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Kelakuan Baik
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setKeteranganSubtype("lulus");
                        setPerihalSurat("Surat Keterangan Lulus (SKL)");
                      }}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        keteranganSubtype === "lulus"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Keterangan Lulus
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cari & Pilih Siswa</label>
                    <span className="text-[9px] text-blue-600 font-bold uppercase">Database Terintegrasi</span>
                  </div>
                  
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Ketik Nama Siswa atau NISN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={selectedSiswaId}
                    onChange={(e) => {
                      setSelectedSiswaId(e.target.value);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    {filteredSiswa.length > 0 ? (
                      filteredSiswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas}) - NISN: {s.nisn}
                        </option>
                      ))
                    ) : (
                      siswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {keteranganSubtype === "aktif" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tujuan / Keperluan Surat</label>
                    <input
                      type="text"
                      value={keperluanSiswa}
                      onChange={(e) => setKeperluanSiswa(e.target.value)}
                      placeholder="Contoh: Pengajuan Beasiswa / PIP"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {keteranganSubtype === "lulus" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tahun Pelajaran</label>
                      <input
                        type="text"
                        value={lulusTahunPelajaran}
                        onChange={(e) => setLulusTahunPelajaran(e.target.value)}
                        placeholder="Contoh: 2025/2026"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rata-Rata Nilai Ujian</label>
                      <input
                        type="text"
                        value={lulusRataRata}
                        onChange={(e) => setLulusRataRata(e.target.value)}
                        placeholder="Contoh: 84.50"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTemplate === "permohonan" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 text-[10px] text-amber-800">
                  <strong>Rincian Permohonan:</strong> Tuliskan isi paragraf utama permohonan bantuan/fasilitas yang diajukan ke dinas atau instansi luar.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Narasi Permohonan</label>
                  <textarea
                    rows={5}
                    value={permohonanIsi}
                    onChange={(e) => setPermohonanIsi(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-justify"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "pindah_siswa" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-[10px] text-rose-800">
                  <strong>Pindah Sekolah (Mutasi Keluar):</strong> Rekomendasi mutasi bagi siswa aktif ke sekolah tujuan.
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Pilih Siswa Mutasi Keluar</label>
                    <span className="text-[9px] text-blue-600 font-bold uppercase">Database Terintegrasi</span>
                  </div>
                  
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Ketik Nama Siswa atau NISN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={selectedSiswaId}
                    onChange={(e) => {
                      setSelectedSiswaId(e.target.value);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    {filteredSiswa.length > 0 ? (
                      filteredSiswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas}) - NISN: {s.nisn}
                        </option>
                      ))
                    ) : (
                      siswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sekolah Tujuan Mutasi</label>
                  <input
                    type="text"
                    value={pindahSekolahTujuan}
                    onChange={(e) => setPindahSekolahTujuan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alasan Kepindahan</label>
                  <input
                    type="text"
                    value={pindahAlasan}
                    onChange={(e) => setPindahAlasan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "rekomendasi_menerima" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-teal-50 p-2.5 rounded-lg border border-teal-100 text-[10px] text-teal-800">
                  <strong>Bersedia Menerima (Mutasi Masuk):</strong> Surat rekomendasi persetujuan menerima calon siswa dari luar sekolah.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Calon Siswa</label>
                    <input
                      type="text"
                      value={mutasiSiswaNama}
                      onChange={(e) => setMutasiSiswaNama(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NISN Calon Siswa</label>
                    <input
                      type="text"
                      value={mutasiSiswaNisn}
                      onChange={(e) => setMutasiSiswaNisn(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sekolah Asal</label>
                    <input
                      type="text"
                      value={mutasiAsalSekolah}
                      onChange={(e) => setMutasiAsalSekolah(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diterima di Kelas</label>
                    <input
                      type="text"
                      value={mutasiSiswaKelas}
                      onChange={(e) => setMutasiSiswaKelas(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedTemplate === "kelakuan_baik" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-[10px] text-emerald-800">
                  <strong>Surat Keterangan Berkelakuan Baik (SKBB):</strong> Mengeluarkan keterangan berkelakuan baik bagi siswa aktif dari database sekolah.
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Pilih Siswa Aktif</label>
                    <span className="text-[9px] text-blue-600 font-bold uppercase">Database Terintegrasi</span>
                  </div>
                  
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Ketik Nama Siswa atau NISN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={selectedSiswaId}
                    onChange={(e) => {
                      setSelectedSiswaId(e.target.value);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    {filteredSiswa.length > 0 ? (
                      filteredSiswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas}) - NISN: {s.nisn}
                        </option>
                      ))
                    ) : (
                      siswa.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.kelas})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keperluan / Kegunaan Surat</label>
                  <input
                    type="text"
                    value={keperluanSiswa}
                    onChange={(e) => setKeperluanSiswa(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Melanjutkan pendidikan ke SMA Negeri 1 Fakfak"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "rekomendasi_pegawai" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-[10px] text-indigo-800">
                  <strong>Rekomendasi Bersedia Menerima Pegawai/Guru:</strong> Keterangan bersedia menerima pemindahan mutasi guru atau staf administrasi baru.
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Metode Input Data</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRekomPegawaiType("manual")}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        rekomPegawaiType === "manual"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Isi Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setRekomPegawaiType("guru")}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        rekomPegawaiType === "guru"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Dari Database Guru
                    </button>
                    <button
                      type="button"
                      onClick={() => setRekomPegawaiType("pegawai")}
                      className={`py-1 px-2 border rounded text-[10px] font-bold text-center ${
                        rekomPegawaiType === "pegawai"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Dari Database Staf
                    </button>
                  </div>
                </div>

                {rekomPegawaiType === "guru" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Guru Dari Database</label>
                    <select
                      value={selectedRekomGuruId}
                      onChange={(e) => setSelectedRekomGuruId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    >
                      {guru.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.nama} - NIP: {g.nip || "-"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {rekomPegawaiType === "pegawai" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Staf Dari Database</label>
                    <select
                      value={selectedRekomPegawaiId}
                      onChange={(e) => setSelectedRekomPegawaiId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    >
                      {pegawai.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nama} - {p.jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap Guru/Pegawai</label>
                    <input
                      type="text"
                      value={rekomPegawaiNama}
                      onChange={(e) => setRekomPegawaiNama(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NIP / NUPTK</label>
                    <input
                      type="text"
                      value={rekomPegawaiNip}
                      onChange={(e) => setRekomPegawaiNip(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jabatan Saat Ini</label>
                    <input
                      type="text"
                      value={rekomPegawaiJabatan}
                      onChange={(e) => setRekomPegawaiJabatan(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pangkat / Golongan</label>
                    <input
                      type="text"
                      value={rekomPegawaiPangkat}
                      onChange={(e) => setRekomPegawaiPangkat(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      value={rekomPegawaiPendidikan}
                      onChange={(e) => setRekomPegawaiPendidikan(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sekolah / Instansi Asal</label>
                    <input
                      type="text"
                      value={rekomPegawaiAsal}
                      onChange={(e) => setRekomPegawaiAsal(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rencana Tugas / Penugasan Di Sini</label>
                  <input
                    type="text"
                    value={rekomPegawaiTugas}
                    onChange={(e) => setRekomPegawaiTugas(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Mengajar Mata Pelajaran Matematika Kelas VII & VIII"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "edaran" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-[10px] text-rose-800">
                  <strong>Narasi Surat Edaran:</strong> Tuliskan isi peraturan, ketertiban, atau SOP himbauan resmi sekolah.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Poin-Poin / Isi Edaran Sekolah</label>
                  <textarea
                    rows={5}
                    value={edaranIsi}
                    onChange={(e) => setEdaranIsi(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-justify"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === "keputusan" && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-[10px] text-indigo-800">
                  <strong>Struktur Konsideran SK:</strong> Sesuaikan isi konsideran Menimbang, Mengingat, dan Diktum Keputusan Kepala Sekolah di bawah ini.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tentang / Judul SK</label>
                  <input
                    type="text"
                    value={skTentang}
                    onChange={(e) => setSkTentang(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Menimbang (Gunakan '\n' untuk baris baru)</label>
                  <textarea
                    rows={3}
                    value={skMenimbang}
                    onChange={(e) => setSkMenimbang(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mengingat (Gunakan '\n' untuk baris baru)</label>
                  <textarea
                    rows={3}
                    value={skMengingat}
                    onChange={(e) => setSkMengingat(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Memutuskan / Menetapkan (Gunakan '\n' untuk baris baru)</label>
                  <textarea
                    rows={3}
                    value={skMenetapkan}
                    onChange={(e) => setSkMenetapkan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: LIVE A4 DOCUMENT PREVIEW (7 Columns) */}
        <div className="xl:col-span-7 bg-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200 flex flex-col items-center overflow-x-auto">
          <div className="w-full max-w-xs sm:max-w-none flex justify-between items-center mb-3 select-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Live Preview Kertas Surat (Times New Roman)
            </span>
            <span className="text-[10px] text-slate-400 font-bold font-mono">Ukuran: A4 Portrait</span>
          </div>

          {/* Document container styled as real paper */}
          <div 
            className="w-[210mm] min-h-[297mm] bg-white p-[25mm] shadow-lg border border-slate-300 relative text-black text-xs text-justify leading-relaxed select-text"
            id="letter-paper-preview"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* Embedded styles for perfect screen/print rendering */}
            <style dangerouslySetInnerHTML={{__html: `
              #letter-paper-preview {
                font-family: 'Times New Roman', Times, serif !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                box-sizing: border-box !important;
                position: relative !important;
              }
              #letter-paper-preview h1,
              #letter-paper-preview h2,
              #letter-paper-preview h3,
              #letter-paper-preview h4,
              #letter-paper-preview h5 {
                color: #000000 !important;
                font-family: 'Times New Roman', Times, serif !important;
              }
              /* Kop Surat Styles */
              #letter-paper-preview .kop-container {
                display: flex;
                align-items: center;
                border-bottom: 4px double #000000;
                padding-bottom: 12px;
                margin-bottom: 24px;
                position: relative;
                text-align: center;
                justify-content: center;
              }
              #letter-paper-preview .kop-logo-wrapper {
                position: absolute;
                left: 0px;
                top: 45%;
                transform: translateY(-50%);
              }
              #letter-paper-preview .kop-text-wrapper {
                width: 100%;
                padding-left: 80px;
                padding-right: 20px;
              }
              #letter-paper-preview .kop-gov {
                font-size: 13.5px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 0;
                line-height: 1.2;
                letter-spacing: 0.5px;
              }
              #letter-paper-preview .kop-dept {
                font-size: 12.5px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 0;
                line-height: 1.2;
                letter-spacing: 0.5px;
              }
              #letter-paper-preview .kop-school {
                font-size: 17px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 3px 0;
                line-height: 1.2;
                letter-spacing: 0.75px;
              }
              #letter-paper-preview .kop-info {
                font-size: 9px;
                font-style: italic;
                margin: 1px 0;
                line-height: 1.3;
                font-weight: normal;
              }
              
              /* Letter Title */
              #letter-paper-preview .letter-heading {
                text-align: center;
                margin-bottom: 25px;
                text-transform: uppercase;
              }
              #letter-paper-preview .letter-title-main {
                font-size: 14px;
                font-weight: bold;
                text-decoration: underline;
                margin: 0;
                letter-spacing: 0.5px;
                line-height: 1.3;
              }
              #letter-paper-preview .letter-num {
                font-size: 11.5px;
                margin: 3px 0 0 0;
                font-family: 'Times New Roman', Times, serif;
                font-weight: normal;
                text-transform: none;
              }
              
              /* Text paragraphs */
              #letter-paper-preview .body-text {
                font-size: 12px !important;
                text-align: justify !important;
                text-indent: 40px !important;
                margin-bottom: 12px !important;
                line-height: 1.6 !important;
                color: #000000 !important;
              }
              #letter-paper-preview .lead-text {
                font-size: 12px !important;
                text-align: left !important;
                margin-bottom: 12px !important;
                line-height: 1.6 !important;
                color: #000000 !important;
              }
              
              /* Metadata Tables for aligned labels and colons */
              #letter-paper-preview .meta-table {
                width: 100% !important;
                margin: 15px 0 !important;
                border-collapse: collapse !important;
              }
              #letter-paper-preview .meta-table td {
                padding: 4px 0px !important;
                font-size: 12px !important;
                vertical-align: top !important;
                color: #000000 !important;
                line-height: 1.5 !important;
              }
              #letter-paper-preview .meta-table td.label-col {
                width: 28% !important;
              }
              #letter-paper-preview .meta-table td.colon-col {
                width: 4% !important;
                text-align: center !important;
              }
              #letter-paper-preview .meta-table td.value-col {
                width: 68% !important;
              }
              
              /* Signatures */
              #letter-paper-preview .signature-container {
                width: 100% !important;
                margin-top: 40px !important;
                display: flex !important;
                justify-content: flex-end !important;
              }
              #letter-paper-preview .signature-block {
                width: 250px !important;
                text-align: left !important;
                font-size: 12px !important;
                position: relative !important;
                color: #000000 !important;
              }
              #letter-paper-preview .signature-date {
                margin: 0 0 4px 0 !important;
                line-height: 1.4 !important;
              }
              #letter-paper-preview .signature-role {
                margin: 0 0 70px 0 !important;
                line-height: 1.4 !important;
              }
              #letter-paper-preview .signature-name {
                font-weight: bold !important;
                text-decoration: underline !important;
                text-transform: uppercase !important;
                margin: 0 !important;
                line-height: 1.4 !important;
              }
              #letter-paper-preview .signature-nip {
                font-size: 11.5px !important;
                margin: 2px 0 0 0 !important;
                line-height: 1.4 !important;
              }
            `}} />

            {/* Kop Surat Header block */}
            {settings.kopSekolah ? (
              <div className="text-center mb-6 select-none">
                <img src={settings.kopSekolah} className="w-full max-h-[110px] object-contain" alt="Kop Surat Sekolah" />
              </div>
            ) : (
              <div className="kop-container select-none">
                {/* Embedded Tut Wuri Handayani vector logo */}
                <div className="kop-logo-wrapper">
                  <svg viewBox="0 0 100 100" className="w-[70px] h-[70px] text-black fill-none">
                    <path d="M 50,2 L 62,35 L 97,35 L 68,57 L 79,90 L 50,70 L 21,90 L 32,57 L 3,35 L 38,35 Z" fill="#000000" fillOpacity="0.04" stroke="#000000" strokeWidth="1.5" />
                    <path d="M 50,22 C 43,30 43,45 47,55 C 49,59 51,59 53,55 C 57,45 57,30 50,22 Z" fill="#000000" />
                    <path d="M 45,40 C 32,32 25,45 28,55 C 33,55 38,48 44,44 Z" fill="#000000" />
                    <path d="M 55,40 C 68,32 75,45 72,55 C 67,55 62,48 56,44 Z" fill="#000000" />
                    <path d="M 50,70 C 45,67 33,65 18,68 L 18,52 C 33,49 45,51 50,54 C 55,51 67,49 82,52 L 82,68 C 67,65 55,67 50,70 Z" stroke="#000000" strokeWidth="1.5" fill="none" />
                    <path id="tutwuri-logo-text-path" d="M 12,65 A 40,40 0 0,0 88,65" fill="none" />
                    <text className="font-sans font-bold text-[5px] fill-black uppercase tracking-widest">
                      <textPath href="#tutwuri-logo-text-path" startOffset="50%" textAnchor="middle">
                        TUT WURI HANDAYANI
                      </textPath>
                    </text>
                  </svg>
                </div>
                {/* Government hierarchical text layout */}
                <div className="kop-text-wrapper">
                  <h1 className="kop-gov">Pemerintah Kabupaten Fakfak</h1>
                  <h2 className="kop-dept">Dinas Pendidikan Kepemudaan dan Olahraga</h2>
                  <h3 className="kop-school">{settings.namaSekolah}</h3>
                  <p className="kop-info">Alamat: Jl. Patipi Pasir, Distrik Fakfak, Kabupaten Fakfak, Papua Barat. Kode Pos: 98611</p>
                  <p className="kop-info">Email: smpn4fakfak@gmail.com | Website: www.smpn4fakfak.sch.id</p>
                </div>
              </div>
            )}

            {/* Metadata bar (Nomor, Lampiran, Perihal on the left, Date on the right) */}
            {isLetterFormat && (
              <div className="flex justify-between items-start mb-6 text-xs">
                <div className="space-y-1" style={{ fontSize: "12px", width: "60%" }}>
                  <div className="flex">
                    <span className="inline-block w-20">Nomor</span>
                    <span className="mr-2">:</span>
                    <span className="font-mono">{nomorSurat || "421.3/.../SMPN4/2026"}</span>
                  </div>
                  <div className="flex">
                    <span className="inline-block w-20">Lampiran</span>
                    <span className="mr-2">:</span>
                    <span>{lampiranSurat || "-"}</span>
                  </div>
                  <div className="flex">
                    <span className="inline-block w-20">Perihal</span>
                    <span className="mr-2">:</span>
                    <span className="font-bold underline">{perihalSurat || "Pemberitahuan Resmi"}</span>
                  </div>
                </div>
                <div className="text-right" style={{ fontSize: "12px", width: "40%" }}>
                  <p className="m-0">{settings.tempatTtd || "Fakfak"}, {formatIndonesianDate(tanggalSurat)}</p>
                </div>
              </div>
            )}

            {/* Destination / Recipient block */}
            {isLetterFormat && (
              <div className="mb-6" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                {tujuanSurat ? (
                  <div className="whitespace-pre-line">{tujuanSurat}</div>
                ) : (
                  <div>
                    <p className="m-0">Kepada Yth.</p>
                    <p className="font-bold uppercase m-0">Bapak / Ibu Orang Tua / Wali Murid</p>
                    <p className="m-0">di - Tempat</p>
                  </div>
                )}
              </div>
            )}

            {/* 1. SURAT UNDANGAN */}
            {selectedTemplate === "undangan" && (
              <div className="mt-4">
                <p className="lead-text">Dengan hormat,</p>
                <p className="body-text">
                  Sehubungan dengan pelaksanaan program kegiatan belajar mengajar serta evaluasi berkala perkembangan siswa di lingkungan {settings.namaSekolah}, kami dengan ini mengundang Bapak/Ibu Orang Tua/Wali Murid dari siswa yang terpilih untuk dapat hadir dalam rapat koordinasi sekolah yang akan diselenggarakan pada:
                </p>

                {/* Meeting schedule parameters */}
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Hari / Tanggal</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">{undanganTanggal || "Kamis, 16 Juli 2026"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Waktu</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{undanganWaktu || "09.00 WIT s.d. Selesai"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tempat Acara</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{undanganTempat || "Aula Sekolah"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Agenda Rapat</td>
                      <td className="colon-col">:</td>
                      <td className="value-col"><strong className="underline">{undanganAgenda || "Rapat Koordinasi Komite Sekolah"}</strong></td>
                    </tr>
                  </tbody>
                </table>

                {activeSiswa && (
                  <p className="body-text">
                    Rapat ini sangat penting khususnya bagi orang tua/wali dari <strong className="uppercase">{activeSiswa.nama}</strong> (Kelas {activeSiswa.kelas}) guna membahas keberlangsungan program pendidikan siswa.
                  </p>
                )}

                <p className="body-text">
                  Mengingat pentingnya acara ini demi menyelaraskan visi pembinaan kesiswaan antara sekolah dan lingkungan keluarga, kehadiran Bapak/Ibu tepat pada waktunya sangat kami harapkan.
                </p>

                <p className="body-text">
                  Demikian surat undangan ini kami sampaikan. Atas perhatian, kerja sama yang baik, dan kehadiran Bapak/Ibu tepat waktu, kami haturkan terima kasih.
                </p>
              </div>
            )}

            {/* 2. SURAT PEMBERITAHUAN */}
            {selectedTemplate === "pemberitahuan" && (
              <div className="mt-4">
                <p className="lead-text">Dengan hormat,</p>
                <p className="body-text" style={{ whiteSpace: "pre-wrap" }}>
                  {pemberitahuanIsi || `Sehubungan dengan agenda kegiatan akademik tahun pelajaran berjalan di ${settings.namaSekolah}, kami memberitahukan kepada seluruh Bapak/Ibu Orang Tua/Wali Murid bahwa kegiatan belajar mengajar (KBM) akan diliburkan sementara mulai tanggal 20 s.d. 25 Juli 2026 karena adanya kegiatan rapat kerja guru.\n\nKBM akan aktif kembali pada hari Senin, 27 Juli 2026. Diharapkan orang tua dapat memantau belajar siswa di rumah.`}
                </p>
                <p className="body-text">
                  Demikian pemberitahuan ini kami sampaikan agar menjadi perhatian seluruh pihak terkait. Atas kerja sama dan pengertian Bapak/Ibu sekalian, kami haturkan terima kasih.
                </p>
              </div>
            )}

            {/* 3. SURAT TUGAS */}
            {selectedTemplate === "tugas" && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">SURAT TUGAS</h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "800/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, dengan ini menugaskan kepada guru/pegawai yang namanya tersebut di bawah ini:
                </p>

                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Lengkap</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">
                        {selectedPegawaiId && activePegawai ? activePegawai.nama : (activeGuru?.nama || "Guru Terpilih")}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">NIP / NUPTK</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">
                        {selectedPegawaiId && activePegawai ? activePegawai.nip : (activeGuru?.nip || "-")}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">Jabatan / Pangkat</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">
                        {selectedPegawaiId && activePegawai 
                          ? `${activePegawai.jabatan} (${activePegawai.pangkat || "Staf"})` 
                          : `${activeGuru?.jabatan || "Guru"} (${activeGuru?.pangkat || "Guru"})`}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">Uraian Tugas</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">
                        {tugasDeskripsi || "Menghadiri Rapat Koordinasi dan Pelatihan Teknis Kurikulum Merdeka"}
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">Waktu & Tanggal</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{formatIndonesianDate(tugasTanggalMulai)} s.d. {formatIndonesianDate(tugasTanggalSelesai)}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tempat</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{tugasTempat || "Aula Dinas Pendidikan"}</td>
                    </tr>
                  </tbody>
                </table>

                {tugasDasar && (
                  <p className="body-text">
                    <strong>Dasar Penugasan:</strong> {tugasDasar}
                  </p>
                )}

                <p className="body-text">
                  Demikian surat tugas ini diberikan kepada yang bersangkutan untuk dapat dilaksanakan dengan penuh rasa tanggung jawab dan melaporkan hasil pelaksanaannya setelah selesai mengikuti kegiatan dinas tersebut.
                </p>
              </div>
            )}

            {/* 4. SURAT KETERANGAN */}
            {selectedTemplate === "keterangan" && activeSiswa && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">
                    {keteranganSubtype === "aktif" && "SURAT KETERANGAN AKTIF BELAJAR"}
                    {keteranganSubtype === "kelakuan_baik" && "SURAT KETERANGAN BERKELAKUAN BAIK"}
                    {keteranganSubtype === "lulus" && "SURAT KETERANGAN LULUS"}
                  </h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "421.2/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, menerangkan dengan sesungguhnya bahwa siswa berikut ini:
                </p>

                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Lengkap</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">{activeSiswa.nama}</td>
                    </tr>
                    <tr>
                      <td className="label-col">NIS / NISN</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{activeSiswa.nis} / {activeSiswa.nisn}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tempat, Tanggal Lahir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.tempatLahir}, {formatIndonesianDate(activeSiswa.tanggalLahir)}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Kelas / Rombel</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">Kelas {activeSiswa.kelas}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Nama Orang Tua / Wali</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.namaAyah || activeSiswa.namaIbu || "-"}</td>
                    </tr>
                  </tbody>
                </table>

                {keteranganSubtype === "aktif" && (
                  <>
                    <p className="body-text">
                      Adalah benar-benar siswa yang terdaftar aktif sedang menempuh pendidikan pada {settings.namaSekolah} Kabupaten Fakfak pada tahun pelajaran berjalan 2026/2027.
                    </p>
                    <p className="body-text">
                      Demikian surat keterangan aktif belajar ini diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya, terutama untuk keperluan: <strong className="underline">{keperluanSiswa || "Administrasi Kesiswaan"}</strong>.
                    </p>
                  </>
                )}

                {keteranganSubtype === "kelakuan_baik" && (
                  <>
                    <p className="body-text">
                      Berdasarkan catatan dari pihak kesiswaan dan bimbingan konseling pada {settings.namaSekolah} Kabupaten Fakfak, siswa tersebut di atas memiliki kelakuan yang baik di lingkungan sekolah, selalu mematuhi seluruh peraturan tata tertib sekolah, rajin mengikuti kegiatan belajar, dan tidak pernah melakukan tindakan yang melanggar hukum.
                    </p>
                    <p className="body-text">
                      Demikian surat keterangan kelakuan baik ini diterbitkan secara sah dan objektif agar dapat digunakan untuk kelengkapan administrasi melanjutkan pendidikan atau keperluan fungsional lainnya.
                    </p>
                  </>
                )}

                {keteranganSubtype === "lulus" && (
                  <>
                    <p className="body-text">
                      Berdasarkan kriteria kelulusan yang berlaku serta hasil rapat pleno kelulusan oleh dewan guru {settings.namaSekolah} mengenai hasil evaluasi belajar siswa pada Tahun Pelajaran {lulusTahunPelajaran || "2025/2026"}, dengan ini siswa tersebut di atas dinyatakan:
                    </p>
                    <div className="my-4 text-center select-none">
                      <div className="inline-block border-2 border-black px-8 py-1.5 bg-slate-50 font-sans font-black text-sm uppercase tracking-widest">
                        --- LULUS ---
                      </div>
                    </div>
                    <p className="body-text">
                      Dengan perolehan Nilai Rata-rata Ujian Sekolah kelulusan sebesar: <strong>{lulusRataRata || "84.50"}</strong>.
                    </p>
                    <p className="body-text">
                      Surat keterangan lulus ini bersifat sementara dan berlaku sebagai dokumen pengganti ijazah yang sah sampai dengan diterbitkannya Blangko Ijazah asli dari Kementerian Pendidikan dasar dan menengah Republik Indonesia.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* 5. SURAT PERMOHONAN */}
            {selectedTemplate === "permohonan" && (
              <div className="mt-4">
                <p className="lead-text">Dengan hormat,</p>
                <p className="body-text" style={{ whiteSpace: "pre-wrap" }}>
                  {permohonanIsi || `Sehubungan dengan upaya peningkatan mutu sarana prasarana penunjang kegiatan belajar mengajar di ${settings.namaSekolah}, kami dengan ini mengajukan permohonan bantuan pengadaan perangkat komputer laboratorium sekolah sebanyak 10 unit.\n\nPengadaan komputer ini sangat krusial guna menunjang kelancaran pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) serta peningkatan literasi digital siswa kami. Proposal lengkap rincian spesifikasi teknis telah kami lampirkan bersama surat ini.`}
                </p>
                <p className="body-text">
                  Demikian surat permohonan ini kami sampaikan. Besar harapan kami kiranya Bapak/Ibu berkenan mengabulkan permohonan ini. Atas perhatian, dukungan, dan kerja samanya, kami haturkan terima kasih.
                </p>
              </div>
            )}

            {/* 6. SURAT PINDAH SISWA (MUTASI KELUAR) */}
            {selectedTemplate === "pindah_siswa" && activeSiswa && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">SURAT KETERANGAN PINDAH SEKOLAH</h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "421.2/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, menerangkan dengan sesungguhnya bahwa siswa berikut ini:
                </p>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Lengkap</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">{activeSiswa.nama}</td>
                    </tr>
                    <tr>
                      <td className="label-col">NIS / NISN</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{activeSiswa.nis} / {activeSiswa.nisn}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tempat, Tanggal Lahir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.tempatLahir}, {formatIndonesianDate(activeSiswa.tanggalLahir)}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Kelas Terakhir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">Kelas {activeSiswa.kelas}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="body-text">
                  Sesuai dengan surat permohonan kepindahan sekolah oleh orang tua/wali siswa yang bersangkutan, maka sejak tanggal dikeluarkannya surat keterangan ini, kami memberikan rekomendasi pindah sekolah ke:
                </p>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Sekolah Tujuan</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">{pindahSekolahTujuan || "SMP Negeri 1 Sorong"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Alasan Kepindahan</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{pindahAlasan || "Mengikuti Orang Tua Pindah Tugas / Domisili"}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="body-text">
                  Segala berkas laporan kemajuan belajar siswa (Buku Rapor) yang bersangkutan telah diserahterimakan seutuhnya, dan sejak surat ini diterbitkan, kewajiban pembinaan serta hak kesiswaan siswa tersebut telah beralih sepenuhnya pada sekolah tujuan di atas.
                </p>
                <p className="body-text">
                  Demikian surat keterangan pindah sekolah ini dibuat secara sah dan obyektif agar dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>
            )}

            {/* 7. SURAT REKOMENDASI MENERIMA SISWA (MUTASI MASUK) */}
            {selectedTemplate === "rekomendasi_menerima" && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">SURAT REKOMENDASI BERSEDIA MENERIMA</h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "421.2/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, setelah memperhatikan daya tampung rombongan belajar serta fasilitas penunjang yang tersedia, dengan ini menerangkan bahwa:
                </p>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Calon Siswa</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">{mutasiSiswaNama || "Budi Santoso"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">NISN Siswa</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{mutasiSiswaNisn || "0115432908"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Sekolah Asal</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">{mutasiAsalSekolah || "SMP Swasta Kristen Fakfak"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tingkat Kelas</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">Diterima di Kelas: <strong>{mutasiSiswaKelas || "Kelas VIII-A"}</strong></td>
                    </tr>
                  </tbody>
                </table>
                <p className="body-text">
                  Pada prinsipnya kami menyatakan <strong>BERSEDIA MENERIMA</strong> siswa yang bersangkutan untuk melanjutkan pendidikan di {settings.namaSekolah} Kabupaten Fakfak, dengan ketentuan yang bersangkutan berkelakuan baik, mematuhi tata tertib sekolah, serta melengkapi seluruh berkas administratif perpindahan resmi dari dinas pendidikan setempat dan menyerahkan Buku Rapor asli.
                </p>
                <p className="body-text">
                  Demikian surat rekomendasi bersedia menerima siswa pindahan ini dibuat secara sah dan obyektif agar dapat dipergunakan sebagaimana mestinya oleh pihak-pihak berkepentingan.
                </p>
              </div>
            )}

            {/* SURAT KETERANGAN BERKELAKUAN BAIK (SKBB) */}
            {selectedTemplate === "kelakuan_baik" && activeSiswa && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">SURAT KETERANGAN BERKELAKUAN BAIK</h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "421.2/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, menerangkan dengan sesungguhnya bahwa siswa berikut ini:
                </p>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Lengkap</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">{activeSiswa.nama}</td>
                    </tr>
                    <tr>
                      <td className="label-col">NIS / NISN</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{activeSiswa.nis} / {activeSiswa.nisn}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tempat, Tanggal Lahir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.tempatLahir}, {formatIndonesianDate(activeSiswa.tanggalLahir)}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Jenis Kelamin</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.jenisKelamin}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Agama</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{getReligionName(activeSiswa.agama)}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Tingkat Kelas</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">Kelas {activeSiswa.kelas}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Alamat Siswa</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{activeSiswa.alamat}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="body-text mt-4">
                  Berdasarkan catatan dari pihak kesiswaan dan bimbingan konseling pada {settings.namaSekolah} Kabupaten Fakfak, siswa tersebut di atas dikenal memiliki <strong>kelakuan yang sangat baik</strong> di lingkungan sekolah, selalu mematuhi seluruh peraturan tata tertib sekolah, rajin mengikuti kegiatan belajar, dan tidak pernah melakukan tindakan yang melanggar hukum ataupun asusila.
                </p>
                <p className="body-text">
                  Surat keterangan berkelakuan baik ini diberikan kepada yang bersangkutan sebagai dokumen kelengkapan administrasi untuk: <strong>{keperluanSiswa || "Syarat melanjutkan pendidikan ke jenjang menengah atas atau keperluan lainnya"}</strong>.
                </p>
                <p className="body-text">
                  Demikian surat keterangan ini dibuat dengan sesungguhnya dan penuh tanggung jawab untuk dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>
            )}

            {/* SURAT REKOMENDASI MENERIMA PEGAWAI GURU & STAF */}
            {selectedTemplate === "rekomendasi_pegawai" && (
              <div className="mt-4">
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider underline">SURAT KETERANGAN REKOMENDASI BERSEDIA MENERIMA</h4>
                  <p className="font-mono text-xs">Nomor: {nomorSurat || "800/.../SMPN4/2026"}</p>
                </div>

                <p className="body-text">
                  Yang bertanda tangan di bawah ini, Kepala Sekolah {settings.namaSekolah} Kabupaten Fakfak, Provinsi Papua Barat, menerangkan dengan sesungguhnya bahwa pendidik / tenaga kependidikan di bawah ini:
                </p>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Lengkap</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold uppercase">{rekomPegawaiNama || "Rina Lestari, S.Pd."}</td>
                    </tr>
                    <tr>
                      <td className="label-col">NIP / NUPTK</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-mono">{rekomPegawaiNip || "-"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Jabatan Terakhir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{rekomPegawaiJabatan || "Guru Pertama - Guru Matematika"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Pangkat / Golongan</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{rekomPegawaiPangkat || "Penata Muda, III/a"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Pendidikan Terakhir</td>
                      <td className="colon-col">:</td>
                      <td className="value-col">{rekomPegawaiPendidikan || "S-1 Pendidikan Matematika"}</td>
                    </tr>
                    <tr>
                      <td className="label-col">Sekolah / Instansi Asal</td>
                      <td className="colon-col">:</td>
                      <td className="value-col font-bold">{rekomPegawaiAsal || "SMP Negeri 2 Fakfak"}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="body-text mt-4">
                  Dengan memperhatikan ketersediaan formasi jabatan, rasio beban mengajar guru, serta kebutuhan tenaga kependidikan di lingkungan sekolah kami, dengan ini menyatakan bahwa pada prinsipnya {settings.namaSekolah} <strong>SANGAT BERSEDIA DAN MENYETUJUI UNTUK MENERIMA</strong> kepindahan pendidik / tenaga kependidikan yang bersangkutan untuk ditugaskan sebagai: <strong>{rekomPegawaiTugas || "Tenaga Pendidik / Staf Tata Usaha"}</strong> di {settings.namaSekolah}.
                </p>
                <p className="body-text">
                  Demikian surat rekomendasi bersedia menerima ini dibuat dengan sesungguhnya untuk dapat digunakan sebagai dokumen pendukung dalam pengurusan kepindahan/mutasi resmi pendidik yang bersangkutan.
                </p>
              </div>
            )}

            {/* 7. SURAT EDARAN */}
            {selectedTemplate === "edaran" && (
              <div className="mt-4">
                <p className="lead-text">Dengan hormat,</p>
                <p className="body-text" style={{ whiteSpace: "pre-wrap" }}>
                  {edaranIsi || `Diberitahukan kepada seluruh siswa-siswi beserta Guru/Pegawai di lingkungan ${settings.namaSekolah} bahwa dalam rangka memperingati Hari Kemerdekaan Republik Indonesia, sekolah akan mengadakan serangkaian perlombaan seni, olahraga, dan kreativitas antarkelas.\n\nSeluruh siswa diwajibkan untuk berpartisipasi aktif dalam menyukseskan kegiatan ini. Tata tertib dan jadwal perlombaan rincinya akan dikoordinasikan oleh Pembina OSIS.`}
                </p>
                <p className="body-text">
                  Demikian surat edaran ini disampaikan untuk diketahui, dipahami, dan dilaksanakan sebagaimana mestinya oleh seluruh warga sekolah. Atas kerja samanya kami ucapkan terima kasih.
                </p>
              </div>
            )}

            {/* 8. SURAT KEPUTUSAN (SK) */}
            {selectedTemplate === "keputusan" && (
              <div className="mt-4 font-sans text-xs" style={{ fontSize: "11.5px", lineHeight: "1.5" }}>
                {/* Header Keputusan Centered */}
                <div className="text-center mb-6 space-y-1">
                  <h4 className="font-bold text-[13px] uppercase tracking-wider">KEPUTUSAN KEPALA {settings.namaSekolah.toUpperCase()}</h4>
                  <p className="font-medium">Nomor: {nomorSurat || "800/.../SMPN4/2026"}</p>
                  <p className="font-semibold uppercase text-[12px] pt-2">TENTANG</p>
                  <p className="font-bold uppercase text-[12.5px] max-w-lg mx-auto leading-normal">
                    {skTentang || "PEMBAGIAN TUGAS GURU DALAM KEGIATAN PROSES BELAJAR MENGAJAR TAHUN PELAJARAN 2026/2027"}
                  </p>
                  <p className="font-semibold uppercase text-[12px] pt-2">KEPALA {settings.namaSekolah.toUpperCase()}</p>
                </div>

                {/* Konsideran Menimbang */}
                <div className="flex items-start mb-3">
                  <span className="inline-block w-24 font-bold">Menimbang</span>
                  <span className="mr-3 font-bold">:</span>
                  <div className="flex-1 space-y-1 text-justify">
                    {(skMenimbang || "a. Bahwa untuk memperlancar jalannya kegiatan belajar mengajar di sekolah perlu menetapkan pembagian tugas mengajar guru;\nb. Bahwa yang namanya tercantum dalam keputusan ini dinilai cakap dan memenuhi syarat melaksanakan tugas tersebut.")
                      .split("\n")
                      .map((line, idx) => (
                        <p key={idx} className="m-0 text-[11px]">{line}</p>
                      ))}
                  </div>
                </div>

                {/* Konsideran Mengingat */}
                <div className="flex items-start mb-4">
                  <span className="inline-block w-24 font-bold">Mengingat</span>
                  <span className="mr-3 font-bold">:</span>
                  <div className="flex-1 space-y-1 text-justify">
                    {(skMengingat || "1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;\n2. Peraturan Pemerintah Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan;\n3. Kalender Akademik Dinas Pendidikan Kabupaten Fakfak.")
                      .split("\n")
                      .map((line, idx) => (
                        <p key={idx} className="m-0 text-[11px]">{line}</p>
                      ))}
                  </div>
                </div>

                {/* Memutuskan Centered */}
                <div className="text-center my-4">
                  <h5 className="font-black text-[12px] uppercase tracking-widest">MEMUTUSKAN:</h5>
                </div>

                {/* Menetapkan */}
                <div className="flex items-start">
                  <span className="inline-block w-24 font-bold">Menetapkan</span>
                  <span className="mr-3 font-bold">:</span>
                  <div className="flex-1 space-y-2 text-justify">
                    {(skMenetapkan || "KESATU: Menugaskan guru untuk melaksanakan tugas mengajar sebagaimana lampiran keputusan ini;\nKEDUA: Biaya akibat keputusan ini dibebankan pada anggaran BOS sekolah;\nKETIGA: Keputusan ini berlaku sejak tanggal ditetapkan.")
                      .split("\n")
                      .map((line, idx) => (
                        <p key={idx} className="m-0 text-[11.5px] font-medium">{line}</p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Signature Section at the bottom-right corner with seal overlay */}
            <div className="signature-container select-none">
              <div className="signature-block">
                {!isLetterFormat && (
                  <p className="signature-date">{settings.tempatTtd || "Fakfak"}, {formatIndonesianDate(tanggalSurat)}</p>
                )}
                <p className="signature-role">Kepala Sekolah,</p>
                
                <div className="relative h-20 my-2 flex items-center">
                  {/* 1. Stempel Basah (Wet Seal Stamp) */}
                  <div className="absolute left-[-25px] top-[-10px] w-24 h-24 select-none pointer-events-none opacity-85 rotate-[-8deg] z-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-700/80 fill-none">
                      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
                      <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 1" />
                      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.2" />
                      
                      <path id="stamp-text-path-top" d="M 16,50 A 34,34 0 0,1 84,50" className="fill-none" />
                      <path id="stamp-text-path-bottom" d="M 84,50 A 34,34 0 0,1 16,50" className="fill-none" />
                      
                      <text className="font-sans font-extrabold text-[5.2px] uppercase fill-indigo-700/80 tracking-wider">
                        <textPath href="#stamp-text-path-top" startOffset="50%" textAnchor="middle">
                          PEMERINTAH KAB. FAKFAK
                        </textPath>
                      </text>
                      
                      <text className="font-sans font-extrabold text-[5.2px] uppercase fill-indigo-700/80 tracking-wider">
                        <textPath href="#stamp-text-path-bottom" startOffset="50%" textAnchor="middle">
                          DINAS PENDIDIKAN
                        </textPath>
                      </text>
                      
                      <text x="50" y="47" className="font-sans font-black text-[6.5px] uppercase fill-indigo-700/80 tracking-wide text-center" textAnchor="middle">
                        {settings.namaSekolah.length > 25 ? "SMP NEGERI 4" : settings.namaSekolah}
                      </text>
                      <text x="50" y="55" className="font-sans font-black text-[6.5px] uppercase fill-indigo-700/80 tracking-wide text-center" textAnchor="middle">
                        FAKFAK
                      </text>
                      
                      <text x="14" y="52" className="font-sans text-[6px] fill-indigo-700/80" textAnchor="middle">★</text>
                      <text x="86" y="52" className="font-sans text-[6px] fill-indigo-700/80" textAnchor="middle">★</text>
                    </svg>
                  </div>

                  {/* 2. Realistic Hand-drawn blue signature SVG */}
                  <div className="absolute left-[30px] top-[5px] w-28 h-14 select-none pointer-events-none opacity-90 z-0">
                    <svg viewBox="0 0 120 60" className="w-full h-full text-blue-800 fill-none">
                      <path d="M 10,35 Q 25,10 40,30 T 70,25 T 95,20 Q 110,40 100,45 T 75,35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 22,28 Q 45,45 65,30 T 115,25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                
                <p className="signature-name">{settings.namaKepsek || "Kepala Sekolah"}</p>
                <p className="signature-nip">NIP. {settings.nipKepsek || "1980000000000"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
