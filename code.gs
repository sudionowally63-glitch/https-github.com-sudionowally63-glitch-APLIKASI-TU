/**
 * Google Apps Script untuk menyimpan data ke Google Sheet.
 * 
 * 1. Buat Google Sheet baru.
 * 2. Klik Extensions > Apps Script.
 * 3. Copy kode ini ke editor Apps Script.
 * 4. Deploy sebagai Web App (Execute as: Me, Who has access: Anyone).
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Asumsi: data berupa objek dengan key dan value
    // Contoh: { "siswa": [...data...] }
    
    var timestamp = new Date();
    sheet.appendRow([timestamp, data.key, JSON.stringify(data.value)]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
