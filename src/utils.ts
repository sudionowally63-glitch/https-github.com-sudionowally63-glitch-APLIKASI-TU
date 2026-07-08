import { utils as xlsxUtils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Setting } from "./types";

// Map religion 10-digit codes to human labels
export const religionMap: { [key: string]: string } = {
  "1000000001": "Islam",
  "2000000002": "Kristen",
  "3000000003": "Katolik",
  "4000000004": "Hindu",
  "5000000005": "Buddha",
  "6000000006": "Konghucu"
};

export const religionList = [
  { code: "1000000001", name: "Islam" },
  { code: "2000000002", name: "Kristen" },
  { code: "3000000003", name: "Katolik" },
  { code: "4000000004", name: "Hindu" },
  { code: "5000000005", name: "Buddha" },
  { code: "6000000006", name: "Konghucu" }
];

// Excel Export Helper
export function exportToExcel(data: any[], filename: string, sheetName: string) {
  const ws = xlsxUtils.json_to_sheet(data);
  const wb = xlsxUtils.book_new();
  xlsxUtils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, `${filename}.xlsx`);
}

// Draw official Kop Sekolah on jsPDF
export function drawKopSekolah(doc: jsPDF, settings: Setting, isLandscape = false) {
  const pageWidth = doc.internal.pageSize.width;
  
  if (settings.kopSekolah) {
    try {
      // Draw uploaded custom Kop Sekolah image
      // Assuming 10mm margins, image spans full usable width (pageWidth - 20)
      doc.addImage(settings.kopSekolah, "PNG", 10, 10, pageWidth - 20, 30);
      return 45; // return ending Y coordinate
    } catch (e) {
      console.error("Error drawing custom Kop Sekolah image, falling back to official typography:", e);
    }
  }

  // Fallback to beautiful, vector-drawn official Indonesian school Kop Sekolah
  const startY = 12;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Charcoal Slate
  doc.text("PEMERINTAH KABUPATEN FAKFAK", pageWidth / 2, startY, { align: "center" });

  doc.setFontSize(11);
  doc.text("DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA", pageWidth / 2, startY + 5, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42); // Deep Navy/Dark Slate
  doc.text(settings.namaSekolah.toUpperCase(), pageWidth / 2, startY + 11, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Muted Slate
  doc.text(
    "Alamat: Jl. Ki Hajar Dewantara, Fakfak, Papua Barat. Kode Pos: 98611",
    pageWidth / 2,
    startY + 16,
    { align: "center" }
  );
  doc.text(
    "Email: smpn4fakfak@gmail.com | Website: www.smpn4fakfak.sch.id",
    pageWidth / 2,
    startY + 20,
    { align: "center" }
  );

  // Draw official horizontal double lines
  const lineY = startY + 23;
  doc.setDrawColor(15, 23, 42); // Navy
  doc.setLineWidth(0.8);
  doc.line(10, lineY, pageWidth - 10, lineY);
  
  doc.setLineWidth(0.25);
  doc.line(10, lineY + 1, pageWidth - 10, lineY + 1);

  // Simple clean emblem decoration drawn on the left side
  // Let's draw a nice academic shield emblem
  const cx = 22;
  const cy = startY + 9;
  doc.setDrawColor(37, 99, 235); // Blue
  doc.setLineWidth(0.8);
  doc.setFillColor(239, 246, 255);
  
  // Shield shape path drawn with fully typed standard jsPDF primitives
  doc.rect(cx - 7, cy - 8, 14, 16, "FD");
  doc.circle(cx, cy, 3, "S");

  // Draw inner details of emblem
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235);
  doc.text("SMPN 4", cx, cy - 1, { align: "center" });
  doc.setFontSize(5);
  doc.text("FAKFAK", cx, cy + 4, { align: "center" });

  return lineY + 5; // End Y coordinate for next contents
}

// Draw Signature at the bottom of the PDF
export function drawSignature(doc: jsPDF, settings: Setting, currentY: number) {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Format Indonesian date
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dateObj = new Date(settings.tanggalTtd);
  const formattedDate = !isNaN(dateObj.getTime())
    ? `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
    : settings.tanggalTtd;

  const sigWidth = 70;
  const sigX = pageWidth - sigWidth - 15;
  let sigY = currentY + 15;

  // Make sure it doesn't overflow the page
  if (sigY + 35 > pageHeight) {
    doc.addPage();
    sigY = 25;
  }

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  
  doc.text(`${settings.tempatTtd}, ${formattedDate}`, sigX, sigY);
  doc.text("Kepala Sekolah,", sigX, sigY + 5);
  
  // Empty space for wet signature
  doc.text("( Tanda Tangan & Stempel )", sigX, sigY + 18, { align: "left" });
  
  doc.setFont("Helvetica", "bold");
  doc.text(settings.namaKepsek, sigX, sigY + 28);
  
  doc.setFont("Helvetica", "normal");
  doc.text(`NIP. ${settings.nipKepsek}`, sigX, sigY + 33);
}

// Full PDF Export with Header, Table and Footer/Signature
export function exportToPDF(
  title: string,
  columns: string[],
  rows: any[][],
  settings: Setting,
  isLandscape = false
) {
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4"
  });

  // 1. Draw Kop
  const contentStartY = drawKopSekolah(doc, settings, isLandscape);

  // 2. Report Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), doc.internal.pageSize.width / 2, contentStartY + 5, { align: "center" });

  // 3. Render Table
  autoTable(doc, {
    startY: contentStartY + 10,
    head: [columns],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59], // Dark charcoal header
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
      valign: "middle"
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    margin: { top: 10, left: 10, right: 10, bottom: 15 },
    didDrawPage: (data: any) => {
      // Draw footer on each page (e.g., page number)
      const pageCount = doc.getNumberOfPages();
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount} | Aplikasi Administrasi TU SMPN 4 Fakfak`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 8
      );
    }
  });

  // 4. Draw Signature after table
  const finalY = (doc as any).lastAutoTable.finalY;
  drawSignature(doc, settings, finalY);

  // 5. Download instantly
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`${cleanTitle}.pdf`);
}

// Print Data Helper
export function printData(title: string, columns: string[], rows: any[][], settings: Setting) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; color: #334155;">${cell ?? "-"}</td>`).join("")}</tr>`
    )
    .join("");

  const colsHtml = columns
    .map((col) => `<th style="border: 1px solid #94a3b8; background-color: #f1f5f9; padding: 10px; font-weight: bold; text-align: left; font-size: 13px; color: #1e293b;">${col}</th>`)
    .join("");

  // Format date
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dateObj = new Date(settings.tanggalTtd);
  const formattedDate = !isNaN(dateObj.getTime())
    ? `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
    : settings.tanggalTtd;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', sans-serif; margin: 40px; color: #1e293b; }
        .kop { text-align: center; margin-bottom: 20px; position: relative; }
        .kop h1 { font-size: 18px; margin: 0 0 4px 0; color: #0f172a; }
        .kop h2 { font-size: 15px; margin: 0 0 6px 0; color: #1e293b; }
        .kop h3 { font-size: 22px; margin: 0 0 8px 0; letter-spacing: 0.5px; color: #0f172a; font-weight: bold; }
        .kop p { font-size: 12px; margin: 2px 0; color: #64748b; }
        .double-line { border-top: 3px solid #0f172a; border-bottom: 1px solid #0f172a; height: 3px; margin: 15px 0 25px 0; }
        .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th, td { text-align: left; }
        .signature-container { display: flex; justify-content: flex-end; margin-top: 40px; page-break-inside: avoid; }
        .signature { text-align: left; width: 250px; font-size: 14px; }
        .signature .date { margin-bottom: 5px; }
        .signature .role { margin-bottom: 60px; }
        .signature .name { font-weight: bold; text-decoration: underline; }
        .signature .nip { font-size: 13px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="kop">
        ${
          settings.kopSekolah
            ? `<img src="${settings.kopSekolah}" style="width: 100%; max-height: 120px; object-fit: contain;" />`
            : `
            <h1>PEMERINTAH KABUPATEN FAKFAK</h1>
            <h2>DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA</h2>
            <h3>${settings.namaSekolah.toUpperCase()}</h3>
            <p>Alamat: Jl. Ki Hajar Dewantara, Fakfak, Papua Barat. Kode Pos: 98611</p>
            <p>Email: smpn4fakfak@gmail.com | Website: www.smpn4fakfak.sch.id</p>
            <div class="double-line"></div>
            `
        }
      </div>
      
      <div class="title">${title}</div>
      
      <table>
        <thead>
          <tr>${colsHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      
      <div class="signature-container">
        <div class="signature">
          <div class="date">${settings.tempatTtd}, ${formattedDate}</div>
          <div class="role">Kepala Sekolah,</div>
          <div class="name">${settings.namaKepsek}</div>
          <div class="nip">NIP. ${settings.nipKepsek}</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => { window.close(); }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
