var DEFAULTS = {
  "siswa": [
    {
      "id": "s-1",
      "nis": "242507001",
      "nisn": "0112345678",
      "nama": "Abdel Achmad",
      "tempatLahir": "Fakfak",
      "tanggalLahir": "2012-05-15",
      "jenisKelamin": "Laki-laki",
      "agama": "Islam",
      "alamat": "Jl. Ki Hajar Dewantara, Fakfak",
      "kelas": "VII-A",
      "namaAyah": "Achmad",
      "namaIbu": "Fatimah",
      "nomorHpOrangTua": "081244556601",
      "status": "Aktif",
      "foto": ""
    }
  ],
  "guru": [
    {
      "id": "g-1",
      "nip": "198205142010012005",
      "nama": "Sartika, S.Pd.",
      "golongan": "III/c",
      "pangkat": "Penata",
      "mataPelajaran": "Bahasa Indonesia",
      "pendidikan": "S1 Pendidikan Bahasa",
      "jabatan": "Guru Madya / Wali Kelas VII-A",
      "status": "PNS",
      "alamat": "Jl. MT Haryono, Fakfak",
      "nomorHp": "081234567801",
      "email": "sartika.spd@gmail.com",
      "foto": ""
    },
    {
      "id": "g-2",
      "nip": "198809202015031002",
      "nama": "Andi Saputra, S.Si.",
      "golongan": "III/b",
      "pangkat": "Penata Muda Tingkat I",
      "mataPelajaran": "IPA Terpadu",
      "pendidikan": "S1 Fisika",
      "jabatan": "Guru Muda / Wali Kelas VII-B",
      "status": "PNS",
      "alamat": "Jl. Kadamber, Fakfak",
      "nomorHp": "081234567802",
      "email": "andisaputra@gmail.com",
      "foto": ""
    }
  ],
  "pegawai": [
    {
      "id": "p-1",
      "nip": "198004122006042004",
      "nama": "Siti Rahma, A.Md.",
      "jabatan": "Kepala Tata Usaha",
      "pangkat": "Penata",
      "golongan": "III/c",
      "alamat": "Jl. Thumburuni, Fakfak",
      "nomorHp": "085244558801",
      "email": "sitirahma.tu@gmail.com",
      "status": "PNS",
      "foto": ""
    },
    {
      "id": "p-2",
      "nip": "199407252021121002",
      "nama": "Eko Prasetyo, S.Kom.",
      "jabatan": "Staff Administrasi Data / Operator Dapodik",
      "pangkat": "Penata Muda",
      "golongan": "III/a",
      "alamat": "Jl. Wagom Utara, Fakfak",
      "nomorHp": "085244558802",
      "email": "ekoprasetyo.tu@gmail.com",
      "status": "PPPK",
      "foto": ""
    }
  ],
  "kelas": [
    { "id": "k-1", "namaKelas": "VII-A", "waliKelas": "Sartika, S.Pd.", "tahunPelajaran": "2026/2027", "jumlahSiswa": 32 },
    { "id": "k-2", "namaKelas: ": "VII-B", "waliKelas": "Andi Saputra, S.Si.", "tahunPelajaran": "2026/2027", "jumlahSiswa": 30 }
  ],
  "suratMasuk": [],
  "suratKeluar": [],
  "arsip": [],
  "inventaris": [],
  "users": [
    {
      "id": "u-1",
      "username": "admin",
      "password": "admintu",
      "nama": "Admin TU Utama",
      "level": "Administrator",
      "status": "Aktif"
    },
    {
      "id": "u-2",
      "username": "kepsek",
      "password": "kepsek4fakfak",
      "nama": "Drs. Yusuf Hindom, M.Pd.",
      "level": "Kepala Sekolah",
      "status": "Aktif"
    },
    {
      "id": "u-3",
      "username": "staff",
      "password": "stafftu",
      "nama": "Siti Rahma, A.Md.",
      "level": "Staff TU",
      "status": "Aktif"
    }
  ],
  "settings": {
    "namaSekolah": "SMP Negeri 4 Fakfak",
    "namaKepsek": "Drs. Yusuf Hindom, M.Pd.",
    "nipKepsek": "197508122003121002",
    "tempatTtd": "Fakfak",
    "tanggalTtd": "2026-07-08",
    "kopSekolah": "",
    "logoSekolah": "",
    "npsn": "60403020",
    "alamatSekolah": "Jl. Ki Hajar Dewantara No. 4, Fakfak, Papua Barat",
    "namaBendahara": "Nurhaliza Abidin, S.E.",
    "nipBendahara": "-"
  }
};

function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Administrasi Tata Usaha')
        .addItem('Inisialisasi / Reset Database', 'setupDatabase')
        .addToUi();
  } catch (e) {
    Logger.log("Running outside Spreadsheet UI context: " + e.toString());
  }
}

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Database");
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet("Database");
  
  // Set headers
  sheet.getRange(1, 1).setValue("Key");
  sheet.getRange(1, 2).setValue("Value");
  
  var rows = [];
  for (var k in DEFAULTS) {
    rows.push([k, JSON.stringify(DEFAULTS[k])]);
  }
  sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  
  // Make the columns bold and clean
  sheet.getRange("A1:B1").setFontWeight("bold").setBackground("#f1f5f9");
  sheet.autoResizeColumns(1, 2);
  
  try {
    SpreadsheetApp.getUi().alert('Database berhasil diinisialisasi dengan data awal!');
  } catch (e) {
    Logger.log('Inisialisasi sukses.');
  }
}

function doGet(e) {
  try {
    var key = e && e.parameter ? e.parameter.key : null;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Database");
    
    // If sheet doesn't exist, automatically run setup
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName("Database");
    }
    
    var data = sheet.getDataRange().getValues();
    
    var obj = {};
    // Skip headers (row 1 is at index 0)
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        try {
          obj[data[i][0]] = JSON.parse(data[i][1]);
        } catch(err) {
          obj[data[i][0]] = data[i][1];
        }
      }
    }
    
    // Verify all keys from DEFAULTS exist, populate any missing keys with defaults
    var modified = false;
    for (var k in DEFAULTS) {
      if (obj[k] === undefined) {
        obj[k] = DEFAULTS[k];
        // Append missing key to sheet
        sheet.appendRow([k, JSON.stringify(DEFAULTS[k])]);
        modified = true;
      }
    }
    if (modified) {
      sheet.autoResizeColumns(1, 2);
    }

    if (key) {
      var result = obj[key] !== undefined ? obj[key] : null;
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var key = data.key;
    var value = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Database");
    
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName("Database");
    }
    
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    var found = false;
    // Skip headers
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow([key, value]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString(), status: "error"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
