/**
 * =========================================================================================
 * PETUNJUK DEPLOY GOOGLE APPS SCRIPT (MANDATORY INSTRUCTIONS)
 * =========================================================================================
 * 1. Di editor Google Apps Script ini, klik tombol "Deploy" di kanan atas -> Pilih "New deployment".
 * 2. Klik ikon gir (pilih jenis deployment), lalu pilih "Web app" (Aplikasi Web).
 * 3. Isi deskripsi bebas (contoh: "Versi Prod 1.0").
 * 4. Bagian "Execute as" (Jalankan sebagai) WAJIB pilih: "Me" (Email Google Anda).
 * 5. Bagian "Who has access" (Siapa yang memiliki akses) WAJIB pilih: "Anyone" (Siapa saja).
 * 6. Klik "Deploy".
 * 7. Jika pertama kali, klik "Authorize access" (Berikan akses) -> Pilih akun Google Anda.
 *    Jika muncul peringatan "Google hasn't verified this app", klik "Advanced" (Lanjutan) -> 
 *    Klik "Go to Administrasi Tata Usaha (unsafe)" -> Klik "Allow" (Izinkan).
 * 8. Salin "Web app URL" yang diberikan (harus berakhiran dengan "/exec").
 * 9. Tempelkan URL tersebut ke halaman Pengaturan Aplikasi ini, lalu klik "Simpan & Uji Koneksi".
 * =========================================================================================
 */

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
    { "id": "k-2", "namaKelas": "VII-B", "waliKelas": "Andi Saputra, S.Si.", "tahunPelajaran": "2026/2027", "jumlahSiswa": 30 }
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

/**
 * Robust helper to obtain the spreadsheet instance.
 * Supports Container-Bound scripts AND Standalone scripts with Drive automatic search/creation fallback.
 */
function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    Logger.log("getActiveSpreadsheet error: " + e.toString());
  }
  
  if (ss) {
    return ss;
  }
  
  // Standalone script fallback - retrieve from saved properties or auto-create in Drive
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty("SPREADSHEET_ID");
  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      Logger.log("openById error for SPREADSHEET_ID (" + ssId + "): " + e.toString());
    }
  }
  
  // Search or create "Database Administrasi Tata Usaha" in Drive
  try {
    var files = DriveApp.getFilesByName("Database Administrasi Tata Usaha");
    if (files.hasNext()) {
      var file = files.next();
      var foundSs = SpreadsheetApp.open(file);
      props.setProperty("SPREADSHEET_ID", foundSs.getId());
      return foundSs;
    } else {
      var newSs = SpreadsheetApp.create("Database Administrasi Tata Usaha");
      props.setProperty("SPREADSHEET_ID", newSs.getId());
      return newSs;
    }
  } catch (driveErr) {
    Logger.log("DriveApp fallback search/create error: " + driveErr.toString());
    return null;
  }
}

function setupDatabase() {
  var ss = getSpreadsheet();
  if (!ss) {
    throw new Error("Gagal menginisialisasi spreadsheet. Pastikan akun Google Anda memiliki akses ke Google Drive.");
  }
  
  var sheet = ss.getSheetByName("Database");
  if (!sheet) {
    sheet = ss.insertSheet("Database");
  } else {
    sheet.clear(); // Safe clear to prevent 'cannot delete only sheet' exceptions
  }
  
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

/**
 * Saves a base64 image string to Google Drive as a permanent public file
 * and returns its direct, lightweight public download link.
 */
function saveBase64ImageToDrive(base64Str, fileName) {
  try {
    var split = base64Str.split(",");
    var mimeType = "image/jpeg";
    var base64Data = base64Str;
    if (split.length > 1) {
      mimeType = split[0].match(/:(.*?);/)[1];
      base64Data = split[1];
    }
    
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    
    // Get or create dedicated asset folder
    var folderName = "Administrasi TU Assets";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // Delete old files with the exact same name to prevent accumulation
    var files = folder.getFilesByName(fileName);
    while (files.hasNext()) {
      try {
        files.next().setTrashed(true);
      } catch (err) {
        Logger.log("Error trashing file: " + err.toString());
      }
    }
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Direct displayable link for elements like <img>
    var url = "https://drive.google.com/uc?export=download&id=" + file.getId();
    Logger.log("Successfully saved " + fileName + " to Drive: " + url);
    return url;
  } catch (e) {
    Logger.log("Failed to save image to Drive (" + fileName + "): " + e.toString());
    return base64Str; // Fallback to original Base64 if any error occurs
  }
}

/**
 * Recursively search for any base64 image strings inside an object or array,
 * save them to Google Drive, and replace them with the Google Drive link.
 */
function processBase64Fields(obj, prefix) {
  if (!obj) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(function(item, idx) {
      return processBase64Fields(item, prefix + "_" + idx);
    });
  }
  
  if (typeof obj === 'object') {
    var newObj = {};
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        var val = obj[k];
        // Support any base64 Data URL (images, PDFs, documents, etc.)
        if (typeof val === 'string' && val.indexOf("data:") === 0 && val.indexOf(";base64,") !== -1) {
          // Identify mime type and file extension
          var mimeMatch = val.match(/data:(.*?);/);
          var mimeType = mimeMatch ? mimeMatch[1] : "";
          var fileExt = "bin";
          
          if (mimeType) {
            if (mimeType.indexOf("image/jpeg") !== -1 || mimeType.indexOf("image/jpg") !== -1) fileExt = "jpg";
            else if (mimeType.indexOf("image/png") !== -1) fileExt = "png";
            else if (mimeType.indexOf("image/gif") !== -1) fileExt = "gif";
            else if (mimeType.indexOf("application/pdf") !== -1) fileExt = "pdf";
            else if (mimeType.indexOf("application/msword") !== -1) fileExt = "doc";
            else if (mimeType.indexOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document") !== -1) fileExt = "docx";
            else if (mimeType.indexOf("application/vnd.ms-excel") !== -1) fileExt = "xls";
            else if (mimeType.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") !== -1) fileExt = "xlsx";
            else {
              var parts = mimeType.split("/");
              if (parts.length > 1) fileExt = parts[1];
            }
          }
          
          var fileName = prefix + "_" + k + "_" + Math.floor(Math.random() * 1000) + "." + fileExt;
          newObj[k] = saveBase64ImageToDrive(val, fileName);
        } else if (typeof val === 'object' && val !== null) {
          newObj[k] = processBase64Fields(val, prefix + "_" + k);
        } else {
          newObj[k] = val;
        }
      }
    }
    return newObj;
  }
  
  return obj;
}

function doGet(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire a script-wide lock to prevent concurrency issues and spreadsheet write conflicts
    lock.waitLock(30000); // Wait up to 30 seconds
    
    var key = e && e.parameter ? e.parameter.key : null;
    var ss = getSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Gagal memuat Spreadsheet. Jika Anda menggunakan Script Standalone, pastikan layanan Drive API diizinkan dan akun Google Anda valid.",
        error: "Spreadsheet open failure"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (key === "health") {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Koneksi berhasil! Google Apps Script terhubung dengan baik.",
        data: {
          spreadsheetId: ss.getId(),
          spreadsheetName: ss.getName(),
          sheets: ss.getSheets().map(function(s) { return s.getName(); })
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = ss.getSheetByName("Database");
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName("Database");
    }
    
    var data = sheet.getDataRange().getValues();
    
    var obj = {};
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        try {
          obj[data[i][0]] = JSON.parse(data[i][1]);
        } catch(err) {
          obj[data[i][0]] = data[i][1];
        }
      }
    }
    
    var modified = false;
    for (var k in DEFAULTS) {
      if (obj[k] === undefined || obj[k] === null || obj[k] === "" || (k === "settings" && typeof obj[k] !== "object")) {
        obj[k] = DEFAULTS[k];
        var foundRow = -1;
        for (var r = 1; r < data.length; r++) {
          if (data[r][0] === k) {
            foundRow = r + 1;
            break;
          }
        }
        if (foundRow !== -1) {
          sheet.getRange(foundRow, 2).setValue(JSON.stringify(DEFAULTS[k]));
        } else {
          sheet.appendRow([k, JSON.stringify(DEFAULTS[k])]);
        }
        modified = true;
      }
    }
    if (modified) {
      sheet.autoResizeColumns(1, 2);
    }

    if (key) {
      var result = obj[key] !== undefined ? obj[key] : null;
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Data " + key + " berhasil diambil.",
        data: result
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Seluruh data berhasil diambil.",
      data: obj
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Terjadi kesalahan pada doGet: " + err.toString(),
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      lock.releaseLock();
    } catch (lockError) {
      // Ignored
    }
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Lock writes for concurrency protection
    
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Payload kosong atau tidak valid (Missing postData contents)", 
        error: "Missing postData contents"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Gagal mengurai JSON input.",
        error: parseErr.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var key = data.key;
    var rawValue = data.value;
    
    if (!key) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Parameter 'key' wajib diisi.", 
        error: "Missing 'key' parameter"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // If the value is a stringified JSON representation, parse it to process base64
    var wasString = false;
    if (typeof rawValue === 'string') {
      try {
        rawValue = JSON.parse(rawValue);
        wasString = true;
      } catch(e) {
        // Not a JSON string, leave it as is
      }
    }
    
    // Intercept and recursively upload any base64 images found to Google Drive
    if (typeof rawValue === 'object' && rawValue !== null) {
      rawValue = processBase64Fields(rawValue, key);
    }
    
    // Encode value back to string if it was parsed or is an object
    var valueToSave = wasString || typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
    
    var ss = getSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Gagal memuat Spreadsheet saat melakukan penyimpanan.", 
        error: "Spreadsheet open failure"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = ss.getSheetByName("Database");
    if (!sheet) {
      setupDatabase();
      sheet = ss.getSheetByName("Database");
    }
    
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    var found = false;
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(valueToSave);
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow([key, valueToSave]);
    }
    
    // Return processed value so client states synchronize instantly (e.g. replaced Drive links)
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Data " + key + " berhasil disimpan.",
      data: rawValue
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Terjadi kesalahan saat menyimpan data: " + err.toString(),
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      lock.releaseLock();
    } catch (lockError) {
      // Ignored
    }
  }
}
