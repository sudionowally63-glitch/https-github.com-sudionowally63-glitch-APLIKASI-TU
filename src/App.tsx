import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, Users, GraduationCap, Briefcase, BookOpen, Mail, Archive, Package, UserCheck, Settings, LogOut, Clock, Calendar, Menu, X, Landmark, Lock, ShieldAlert, FileText
} from "lucide-react";


import { getData, saveData } from "./lib/sheets";

// Views Imports
import DashboardView from "./components/DashboardView";
import SiswaView from "./components/SiswaView";
import GuruView from "./components/GuruView";
import PegawaiView from "./components/PegawaiView";
import KelasView from "./components/KelasView";
import SuratView from "./components/SuratView";
import BuatSuratView from "./components/BuatSuratView";
import ArsipView from "./components/ArsipView";
import InventarisView from "./components/InventarisView";
import UserView from "./components/UserView";
import PengaturanView from "./components/PengaturanView";

// Initial Seed Data
import { 
  initialSiswa, initialGuru, initialPegawai, initialKelas, 
  initialSuratMasuk, initialSuratKeluar, initialArsip, initialInventaris, 
  initialUsers, defaultSettings 
} from "./data";
import { User, Siswa, Guru, Pegawai, Kelas, SuratMasuk, SuratKeluar, Arsip, Inventaris, Setting } from "./types";

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("tu_logged_in") === "true";
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("tu_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isCloudConnected, setIsCloudConnected] = useState<boolean | null>(null);

  // DB States
  const [siswa, setSiswa] = useState<Siswa[]>(initialSiswa);
  const siswaLoaded = useRef(false);
  const [guru, setGuru] = useState<Guru[]>(initialGuru);
  const guruLoaded = useRef(false);
  const [pegawai, setPegawai] = useState<Pegawai[]>(initialPegawai);
  const pegawaiLoaded = useRef(false);
  const [kelas, setKelas] = useState<Kelas[]>(initialKelas);
  const kelasLoaded = useRef(false);
  const [suratMasuk, setSuratMasuk] = useState<SuratMasuk[]>(initialSuratMasuk);
  const suratMasukLoaded = useRef(false);
  const [suratKeluar, setSuratKeluar] = useState<SuratKeluar[]>(initialSuratKeluar);
  const suratKeluarLoaded = useRef(false);
  const [arsip, setArsip] = useState<Arsip[]>(initialArsip);
  const arsipLoaded = useRef(false);
  const [inventaris, setInventaris] = useState<Inventaris[]>(initialInventaris);
  const inventarisLoaded = useRef(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const usersLoaded = useRef(false);
  const [settings, setSettings] = useState<Setting>(defaultSettings);
  const settingsLoaded = useRef(false);

  // UI Control States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [fakfakTime, setFakfakTime] = useState("");

  // Clock WIT (Fakfak Papua Barat, UTC+9)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Add timezone offset for WIT (UTC+9)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const witTime = new Date(utc + 3600000 * 9);
      
      const timeStr = witTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setFakfakTime(timeStr + " WIT");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load data with robust local storage failover
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getData();
        if (data && !data.error) {
          if (data.siswa) {
            setSiswa(data.siswa);
            localStorage.setItem("tu_siswa", JSON.stringify(data.siswa));
          }
          if (data.guru) {
            setGuru(data.guru);
            localStorage.setItem("tu_guru", JSON.stringify(data.guru));
          }
          if (data.pegawai) {
            setPegawai(data.pegawai);
            localStorage.setItem("tu_pegawai", JSON.stringify(data.pegawai));
          }
          if (data.kelas) {
            setKelas(data.kelas);
            localStorage.setItem("tu_kelas", JSON.stringify(data.kelas));
          }
          if (data.suratMasuk) {
            setSuratMasuk(data.suratMasuk);
            localStorage.setItem("tu_suratMasuk", JSON.stringify(data.suratMasuk));
          }
          if (data.suratKeluar) {
            setSuratKeluar(data.suratKeluar);
            localStorage.setItem("tu_suratKeluar", JSON.stringify(data.suratKeluar));
          }
          if (data.arsip) {
            setArsip(data.arsip);
            localStorage.setItem("tu_arsip", JSON.stringify(data.arsip));
          }
          if (data.inventaris) {
            setInventaris(data.inventaris);
            localStorage.setItem("tu_inventaris", JSON.stringify(data.inventaris));
          }
          if (data.users) {
            setUsers(data.users);
            localStorage.setItem("tu_users", JSON.stringify(data.users));
          }
          if (data.settings) {
            setSettings(data.settings);
            localStorage.setItem("tu_settings", JSON.stringify(data.settings));
          }
          setIsCloudConnected(true);
        } else {
          // Sheets URL is not configured or returned error, load local copy
          console.warn("Using offline localStorage mode due to missing config:", data?.error);
          setIsCloudConnected(false);
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error("Error loading data from Google Sheets:", err);
        setIsCloudConnected(false);
        loadFromLocalStorage();
      } finally {
        siswaLoaded.current = true;
        guruLoaded.current = true;
        pegawaiLoaded.current = true;
        kelasLoaded.current = true;
        suratMasukLoaded.current = true;
        suratKeluarLoaded.current = true;
        arsipLoaded.current = true;
        inventarisLoaded.current = true;
        usersLoaded.current = true;
        settingsLoaded.current = true;
      }
    }

    function loadFromLocalStorage() {
      const sSiswa = localStorage.getItem("tu_siswa");
      if (sSiswa) setSiswa(JSON.parse(sSiswa));
      const sGuru = localStorage.getItem("tu_guru");
      if (sGuru) setGuru(JSON.parse(sGuru));
      const sPegawai = localStorage.getItem("tu_pegawai");
      if (sPegawai) setPegawai(JSON.parse(sPegawai));
      const sKelas = localStorage.getItem("tu_kelas");
      if (sKelas) setKelas(JSON.parse(sKelas));
      const sSuratMasuk = localStorage.getItem("tu_suratMasuk");
      if (sSuratMasuk) setSuratMasuk(JSON.parse(sSuratMasuk));
      const sSuratKeluar = localStorage.getItem("tu_suratKeluar");
      if (sSuratKeluar) setSuratKeluar(JSON.parse(sSuratKeluar));
      const sArsip = localStorage.getItem("tu_arsip");
      if (sArsip) setArsip(JSON.parse(sArsip));
      const sInventaris = localStorage.getItem("tu_inventaris");
      if (sInventaris) setInventaris(JSON.parse(sInventaris));
      const sUsers = localStorage.getItem("tu_users");
      if (sUsers) setUsers(JSON.parse(sUsers));
      const sSettings = localStorage.getItem("tu_settings");
      if (sSettings) setSettings(JSON.parse(sSettings));
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!siswaLoaded.current) return;
    saveData("siswa", siswa);
    localStorage.setItem("tu_siswa", JSON.stringify(siswa));
  }, [siswa]);

  useEffect(() => {
    if (!guruLoaded.current) return;
    saveData("guru", guru);
    localStorage.setItem("tu_guru", JSON.stringify(guru));
  }, [guru]);

  useEffect(() => {
    if (!pegawaiLoaded.current) return;
    saveData("pegawai", pegawai);
    localStorage.setItem("tu_pegawai", JSON.stringify(pegawai));
  }, [pegawai]);

  useEffect(() => {
    if (!kelasLoaded.current) return;
    saveData("kelas", kelas);
    localStorage.setItem("tu_kelas", JSON.stringify(kelas));
  }, [kelas]);

  useEffect(() => {
    if (!suratMasukLoaded.current) return;
    saveData("suratMasuk", suratMasuk);
    localStorage.setItem("tu_suratMasuk", JSON.stringify(suratMasuk));
  }, [suratMasuk]);

  useEffect(() => {
    if (!suratKeluarLoaded.current) return;
    saveData("suratKeluar", suratKeluar);
    localStorage.setItem("tu_suratKeluar", JSON.stringify(suratKeluar));
  }, [suratKeluar]);

  useEffect(() => {
    if (!arsipLoaded.current) return;
    saveData("arsip", arsip);
    localStorage.setItem("tu_arsip", JSON.stringify(arsip));
  }, [arsip]);

  useEffect(() => {
    if (!inventarisLoaded.current) return;
    saveData("inventaris", inventaris);
    localStorage.setItem("tu_inventaris", JSON.stringify(inventaris));
  }, [inventaris]);

  useEffect(() => {
    if (!usersLoaded.current) return;
    saveData("users", users);
    localStorage.setItem("tu_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!settingsLoaded.current) return;
    saveData("settings", settings);
    localStorage.setItem("tu_settings", JSON.stringify(settings));
  }, [settings]);

  // LOGIN EXECUTION
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!usernameInput || !passwordInput) {
      setLoginError("Silakan masukkan username dan password!");
      return;
    }

    // Authenticate from our users database
    const match = users.find(
      u => u.username === usernameInput && u.password === passwordInput
    );

    if (match) {
      if (match.status !== "Aktif") {
        setLoginError("Akun Anda telah dinonaktifkan oleh administrator utama!");
        return;
      }
      setIsLoggedIn(true);
      setCurrentUser(match);
      localStorage.setItem("tu_logged_in", "true");
      localStorage.setItem("tu_current_user", JSON.stringify(match));
      setActiveTab("dashboard");
    } else {
      setLoginError("Kredensial salah! Periksa kembali username atau password Anda.");
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("tu_logged_in");
    localStorage.removeItem("tu_current_user");
  };

  // Granular DB Wipe Execution from Settings
  const handleWipeData = (targets: {
    siswa: boolean;
    guru: boolean;
    pegawai: boolean;
    kelas: boolean;
    surat: boolean;
    arsip: boolean;
    inventaris: boolean;
  }) => {
    if (targets.siswa) setSiswa([]);
    if (targets.guru) setGuru([]);
    if (targets.pegawai) setPegawai([]);
    if (targets.kelas) setKelas([]);
    if (targets.surat) {
      setSuratMasuk([]);
      setSuratKeluar([]);
    }
    if (targets.arsip) setArsip([]);
    if (targets.inventaris) setInventaris([]);
  };

  // Switcher core container views
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            siswa={siswa}
            guru={guru}
            pegawai={pegawai}
            kelas={kelas}
            suratMasuk={suratMasuk}
            suratKeluar={suratKeluar}
            arsip={arsip}
            inventaris={inventaris}
            settings={settings}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
          />
        );
      case "siswa":
        return <SiswaView siswa={siswa} setSiswa={setSiswa} kelas={kelas} settings={settings} />;
      case "guru":
        return <GuruView guru={guru} setGuru={setGuru} settings={settings} />;
      case "pegawai":
        return <PegawaiView pegawai={pegawai} setPegawai={setPegawai} settings={settings} />;
      case "kelas":
        return <KelasView kelas={kelas} setKelas={setKelas} guru={guru} settings={settings} />;
      case "surat":
        return (
          <SuratView 
            suratMasuk={suratMasuk} 
            setSuratMasuk={setSuratMasuk} 
            suratKeluar={suratKeluar} 
            setSuratKeluar={setSuratKeluar} 
            settings={settings} 
          />
        );
      case "buat_surat":
        return (
          <BuatSuratView
            siswa={siswa}
            guru={guru}
            pegawai={pegawai}
            suratKeluar={suratKeluar}
            setSuratKeluar={setSuratKeluar}
            settings={settings}
          />
        );
      case "arsip":
        return <ArsipView arsip={arsip} setArsip={setArsip} settings={settings} />;
      case "inventaris":
        return <InventarisView inventaris={inventaris} setInventaris={setInventaris} settings={settings} />;
      case "user":
        return <UserView users={users} setUsers={setUsers} settings={settings} />;
      case "settings":
        return <PengaturanView settings={settings} setSettings={setSettings} onWipeData={handleWipeData} />;
      default:
        return <div className="p-8 text-slate-500">View Not Found.</div>;
    }
  };

  // Navigations Links Definitions with Dynamic counts
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "siswa", label: "Data Siswa", icon: GraduationCap, count: siswa.length },
    { id: "guru", label: "Data Guru", icon: Users, count: guru.length },
    { id: "pegawai", label: "Pegawai TU", icon: Briefcase, count: pegawai.length },
    { id: "kelas", label: "Rombel Kelas", icon: BookOpen, count: kelas.length },
    { id: "surat", label: "Surat Masuk/Keluar", icon: Mail, count: suratMasuk.length + suratKeluar.length },
    { id: "buat_surat", label: "Buat Surat Resmi", icon: FileText, count: null },
    { id: "arsip", label: "Arsip Dokumen", icon: Archive, count: arsip.length },
    { id: "inventaris", label: "Inventaris Sarpras", icon: Package, count: inventaris.length },
    { id: "user", label: "Operator Sistem", icon: UserCheck, count: users.length },
    { id: "settings", label: "Pengaturan & Kop", icon: Settings, count: null }
  ];

  // -------------------------------------------------------------
  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden" id="login-screen">
        {/* Abstract background graphics */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="flex justify-center mb-4">
            {settings.logoSekolah ? (
              <div className="p-2 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center w-24 h-24 overflow-hidden">
                <img src={settings.logoSekolah} alt="Logo Sekolah" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg border border-blue-500 flex items-center justify-center">
                <Landmark className="w-10 h-10" />
              </div>
            )}
          </div>
          <h2 className="text-center text-2xl font-extrabold text-slate-800 font-display tracking-tight">
            Sistem Administrasi Tata Usaha
          </h2>
          <p className="mt-1 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">
            {settings.namaSekolah || "SMP Negeri 4 Fakfak"} • Papua Barat
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 animate-fade-in">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-2xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-bold border border-rose-100 flex items-center gap-1.5 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition"
                    id="login-username-input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold select-none">admintu</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password Anda..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition"
                    id="login-password-input"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  id="login-submit-btn"
                >
                  Masuk ke Dashboard
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block">
                Default Credentials:
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded mt-1.5 inline-block">
                admin / admintu
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }  // -------------------------------------------------------------
  // MAIN FULL SYSTEM LAYOUT (AUTHENTICATED OPERATOR)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans" id="app-shell">
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-[260px] md:flex-col bg-blue-900 text-white border-r border-blue-800 shrink-0">
        {/* School Header Title with Geometric Circle Emblem */}
        <div className="p-6 border-b border-blue-800 flex flex-col items-center gap-3 bg-blue-950/10">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-extrabold text-lg font-display shadow-xs overflow-hidden shrink-0">
            {settings.logoSekolah ? (
              <img src={settings.logoSekolah} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              "4F"
            )}
          </div>
          <div className="text-center">
            <h1 className="text-sm font-bold uppercase tracking-wider text-white">
              {settings.namaSekolah}
            </h1>
            <p className="text-xs text-blue-300">Kabupaten Fakfak</p>
          </div>
        </div>

        {/* Navigation Categories and Items */}
        <div className="pt-4 pb-1 px-4 text-[9px] uppercase font-bold text-blue-400 tracking-widest select-none">Menu Utama</div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navigationItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            // Render section dividers like "Data Master" or "Administrasi" based on nav layout
            const showDivider = idx === 1 || idx === 5 || idx === 8;
            const dividerLabel = idx === 1 ? "Data Master" : idx === 5 ? "Administrasi" : "Sistem";

            return (
              <React.Fragment key={item.id}>
                {showDivider && (
                  <div className="pt-4 pb-1 px-3 text-[9px] uppercase font-bold text-blue-400 tracking-widest select-none">
                    {dividerLabel}
                  </div>
                )}
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-800 text-white font-bold shadow-xs"
                      : "text-blue-100 hover:text-white hover:bg-blue-800/60"
                  }`}
                  id={`nav-${item.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-200"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-blue-950 text-blue-200"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Logged-In User Footer Block */}
        <div className="p-4 border-t border-blue-800 flex items-center gap-3 bg-blue-950">
          <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400/30 flex items-center justify-center text-white text-xs font-bold font-mono uppercase">
            {currentUser?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-none mb-1">
              {currentUser?.nama || "Operator"}
            </p>
            <p className="text-[10px] text-blue-400 leading-none">
              {currentUser?.level || "Staf TU"}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-blue-200 hover:text-rose-400 p-1.5 hover:bg-blue-900 rounded-lg transition"
            title="Keluar Sistem"
            id="desktop-signout-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)} />
          
          <aside className="relative flex-1 flex flex-col max-w-[280px] w-full bg-blue-900 text-white">
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 hover:bg-blue-800 rounded-lg text-blue-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 border-b border-blue-800 flex items-center gap-3 bg-blue-950/10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-base font-display overflow-hidden shrink-0">
                {settings.logoSekolah ? (
                  <img src={settings.logoSekolah} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  "4F"
                )}
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-white font-display leading-tight">{settings.namaSekolah}</h1>
                <span className="text-[9px] text-blue-300 uppercase tracking-wider font-bold">Papua Barat</span>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                const showDivider = idx === 1 || idx === 5 || idx === 8;
                const dividerLabel = idx === 1 ? "Data Master" : idx === 5 ? "Administrasi" : "Sistem";

                return (
                  <React.Fragment key={item.id}>
                    {showDivider && (
                      <div className="pt-4 pb-1 px-3 text-[9px] uppercase font-bold text-blue-300 tracking-widest select-none">
                        {dividerLabel}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-800 text-white font-bold"
                          : "text-blue-100 hover:text-white hover:bg-blue-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full font-mono bg-blue-950 text-blue-200">
                          {item.count}
                        </span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>

            <div className="p-4 border-t border-blue-800 bg-blue-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {currentUser?.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-none">{currentUser?.nama}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleSignOut();
                }}
                className="p-1.5 hover:bg-blue-900 text-rose-300 hover:text-rose-400 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTAINER & VIEW SWITCHER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar matching the Geometric Balance design */}
        <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shadow-xs z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1 hover:bg-slate-50 rounded-lg border border-slate-100 text-slate-600"
              id="mobile-hamburger-btn"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title & Real-time clock layout aligned on the left */}
            <div className="flex items-center gap-3">
              <h2 className="text-sm md:text-base font-bold text-slate-800 capitalize tracking-tight font-display">
                {activeTab === "dashboard" ? "Dashboard Utama" : `Kelola ${navigationItems.find(n => n.id === activeTab)?.label || activeTab}`}
              </h2>
              <div className="hidden sm:block h-4 w-[1px] bg-slate-300" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                  {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="text-xs font-mono text-slate-600 leading-tight">
                  {fakfakTime}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Sync Badge */}
            {isCloudConnected === true ? (
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full" id="sync-status-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700">TERHUBUNG SHEETS</span>
              </div>
            ) : isCloudConnected === false ? (
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full" id="sync-status-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-700">DEMO OFFLINE</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full" id="sync-status-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-slate-600">MENGECEK...</span>
              </div>
            )}

            {/* Principal Signature Information Tag */}
            <div className="text-right text-xs">
              <span className="block font-bold text-slate-700 leading-none mb-0.5">
                {settings.namaKepsek}
              </span>
              <span className="block text-[9px] text-slate-400 font-mono">
                NIP. {settings.nipKepsek}
              </span>
            </div>
          </div>
        </header>

        {/* Active main view panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderActiveView()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-100 border-t border-slate-200 py-3 px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-medium">
          <div>&copy; {new Date().getFullYear()} {settings.namaSekolah} - Sistem Informasi Tata Usaha</div>
          <div className="flex gap-4 uppercase mt-1 sm:mt-0 font-bold">
            <span className="text-blue-600">Versi 2.0.0</span>
            <span>Server Latency: <span className="text-green-600">0.00ms</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
