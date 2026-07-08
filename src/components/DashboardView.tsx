import React, { useState, useEffect } from "react";
import { 
  Users, GraduationCap, UserCheck, MailOpen, Send, Archive, Package, BookOpen, Clock, Calendar as CalendarIcon, Info
} from "lucide-react";
import { Siswa, Guru, Pegawai, Kelas, SuratMasuk, SuratKeluar, Arsip, Inventaris, Setting, User } from "../types";

interface DashboardProps {
  siswa: Siswa[];
  guru: Guru[];
  pegawai: Pegawai[];
  kelas: Kelas[];
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  arsip: Arsip[];
  inventaris: Inventaris[];
  settings: Setting;
  currentUser: User | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function DashboardView({
  siswa,
  guru,
  pegawai,
  kelas,
  suratMasuk,
  suratKeluar,
  arsip,
  inventaris,
  settings,
  currentUser,
  setActiveTab,
}: DashboardProps) {
  // Real-time Digital Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calendar Logic
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)

  const calendarDays = [];
  // Fill empty spaces for preceding month
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    calendarDays.push(null);
  }
  // Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const isToday = (dayNum: number | null) => {
    if (!dayNum) return false;
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Stats Card data with Geometric Balance theme colors and border alignments
  const stats = [
    { label: "Data Siswa", count: siswa.length, icon: Users, borderClass: "border-blue-500", iconBgClass: "bg-blue-50 text-blue-600" },
    { label: "Data Guru", count: guru.length, icon: GraduationCap, borderClass: "border-emerald-500", iconBgClass: "bg-emerald-50 text-emerald-600" },
    { label: "Pegawai TU", count: pegawai.length, icon: UserCheck, borderClass: "border-purple-500", iconBgClass: "bg-purple-50 text-purple-600" },
    { label: "Data Kelas", count: kelas.length, icon: BookOpen, borderClass: "border-amber-500", iconBgClass: "bg-amber-50 text-amber-600" },
    { label: "Surat Masuk", count: suratMasuk.length, icon: MailOpen, borderClass: "border-sky-500", iconBgClass: "bg-sky-50 text-sky-600" },
    { label: "Surat Keluar", count: suratKeluar.length, icon: Send, borderClass: "border-cyan-500", iconBgClass: "bg-cyan-50 text-cyan-600" },
    { label: "Arsip Surat", count: arsip.length, icon: Archive, borderClass: "border-slate-400", iconBgClass: "bg-slate-100 text-slate-600" },
    { label: "Inventaris", count: inventaris.length, icon: Package, borderClass: "border-indigo-500", iconBgClass: "bg-indigo-50 text-indigo-600" },
  ];

  // SVG Chart Logic
  const chartData = [
    { name: "Siswa", val: siswa.length },
    { name: "Guru", val: guru.length },
    { name: "Pegawai", val: pegawai.length },
    { name: "Kelas", val: kelas.length },
    { name: "S. Masuk", val: suratMasuk.length },
    { name: "S. Keluar", val: suratKeluar.length },
    { name: "Arsip", val: arsip.length },
    { name: "Barang", val: inventaris.length },
  ];

  const maxVal = Math.max(...chartData.map(d => d.val), 5); // Minimum 5 to look good

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Welcome banner & clock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight font-display">Selamat Datang di Portal TU</h2>
            <p className="text-blue-100 mt-1 max-w-md text-sm">
              Sistem Informasi Administrasi Tata Usaha Terpadu {settings.namaSekolah}. Kelola seluruh data dengan cepat, responsif, dan akurat.
            </p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-3 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg w-max border border-white/10">
            <Info className="w-4 h-4 text-blue-200" />
            <span>Kepala Sekolah saat ini: <strong className="text-white">{settings.namaKepsek}</strong></span>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[15%] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        </div>

        {/* Digital Clock Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
          <div className="bg-blue-50 p-2.5 rounded-full text-blue-600 mb-2">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-mono tracking-wider text-slate-800">
            {formatTime(time)}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider font-display">
            {formatDate(time)}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200/50">
            Fakfak, WIT (UTC+9)
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${stat.borderClass} flex items-center justify-between hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]`}
              id={`stat-card-${idx}`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <h3 className="text-2xl font-bold text-slate-800">{stat.count}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBgClass} shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART AREA */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 text-sm font-display">Statistik Data 2023/2024</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">BULANAN</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-full font-bold">REALTIME</span>
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 sm:gap-4 px-4 mb-4">
            {chartData.map((data, idx) => {
              const heightPercent = (data.val / maxVal) * 100;
              const blueShades = [
                "bg-blue-100",
                "bg-blue-200",
                "bg-blue-300",
                "bg-blue-400",
                "bg-blue-500",
                "bg-blue-600",
                "bg-blue-700",
                "bg-blue-800"
              ];
              const barColor = blueShades[idx % blueShades.length];
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded absolute -top-8 transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap z-10">
                    {data.val} item
                  </div>
                  {/* Bar */}
                  <div 
                    style={{ height: `${heightPercent || 5}%` }}
                    className={`w-full rounded-t-lg ${barColor} group-hover:bg-blue-600 transition-all duration-500 relative min-h-[4px] shadow-2xs`}
                  />
                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 mt-2 text-center truncate w-full" title={data.name}>
                    {data.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CALENDAR & INFO COLUMN */}
        <div className="space-y-6">
          {/* Calendar Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                Kalender Kerja
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 transition text-xs font-bold"
                  id="calendar-prev-btn"
                >
                  &larr;
                </button>
                <span className="text-[10px] font-bold text-slate-700 min-w-[70px] text-center select-none uppercase">
                  {monthNames[month].slice(0, 3)} {year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 transition text-xs font-bold"
                  id="calendar-next-btn"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
              <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`h-7 flex items-center justify-center text-xs rounded-full transition-all ${
                    !day
                      ? "bg-transparent text-transparent"
                      : isToday(day)
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 cursor-pointer"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Solid Blue Profil Sekolah card matching Geometric Balance */}
          <div className="bg-blue-600 rounded-xl p-4 text-white shadow-sm border border-blue-700/50">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Profil Sekolah</p>
              <GraduationCap className="w-5 h-5 text-white/90" />
            </div>
            <h4 className="mt-2 font-bold font-display text-sm tracking-tight">{settings.namaSekolah}</h4>
            <p className="text-[11px] opacity-90 mt-1.5 leading-relaxed font-mono">
              NPSN: 60403010<br />
              Akreditasi: A (Sangat Baik)<br />
              Jl. Patipi Pasir, Fakfak, Papua Barat
            </p>
            <div className="mt-4 pt-3 border-t border-white/20">
              <button 
                onClick={() => setActiveTab("settings")}
                className="w-full py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-2xs"
              >
                Pengaturan Kop & Identitas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* School vision & mission section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start shadow-sm">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl self-start shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm font-display">Visi & Misi {settings.namaSekolah} Fakfak</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Visi:</strong> Terwujudnya sekolah yang unggul dalam prestasi, cerdas, terampil, berbudaya luhur, berkarakter Pancasila, dan mandiri berlandaskan iman dan takwa.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Misi:</strong> Menyelenggarakan tata kelola sekolah yang transparan, profesional, cepat, dan terdigitalisasi dalam rangka mendukung program merdeka belajar di Kabupaten Fakfak, Papua Barat.
          </p>
        </div>
      </div>
    </div>
  );
}
