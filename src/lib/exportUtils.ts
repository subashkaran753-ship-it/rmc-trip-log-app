import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { TripRecord, PlantSummary } from "../types";
import { VENDOR_CODE, PLANT_PO_NUMBERS } from "../constants";

// Extend jsPDF with autotable types
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const downloadSummaryExcel = (summary: PlantSummary) => {
  const data = summary.records.map((r) => ({
    Date: r.date,
    "Vehicle Number": r.vehicleNumber,
    "Site Name": r.siteName,
    Location: r.location,
    Purpose: r.purpose === "Custom" ? r.customPurpose : r.purpose,
    Trips: r.trips,
    "Amount Per Trip": r.amountPerTrip,
    "Total Amount": r.totalAmount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trip Summary");
  
  // Add total row
  XLSX.utils.sheet_add_aoa(worksheet, [
    ["", "", "", "", "", "", summary.totalTrips, "", summary.totalAmount]
  ], { origin: -1 });

  XLSX.writeFile(workbook, `${summary.plant}_Summary_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};

export const downloadSummaryPDF = (summary: PlantSummary) => {
  const doc = new jsPDF() as any;
  const dateStr = format(new Date(), "PPpp");

  doc.setFontSize(18);
  doc.text(`${summary.plant} Trip Summary`, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${dateStr}`, 14, 30);
  doc.text(`Vendor Code: ${VENDOR_CODE}`, 14, 35);
  doc.text(`PO Number: ${PLANT_PO_NUMBERS[summary.plant]}`, 14, 40);

  const tableData = summary.records.map((r) => [
    r.date,
    r.vehicleNumber,
    r.siteName,
    r.location,
    r.purpose === "Custom" ? r.customPurpose : r.purpose,
    r.trips,
    r.totalAmount.toFixed(2),
  ]);

  doc.autoTable({
    startY: 45,
    head: [["Date", "Vehicle", "Site", "Location", "Purpose", "Trips", "Amount"]],
    body: tableData,
    foot: [["", "", "", "", "TOTALS", summary.totalTrips, summary.totalAmount.toFixed(2)]],
  });

  doc.save(`${summary.plant}_Summary_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const downloadBillPDF = (record: TripRecord) => {
  const doc = new jsPDF() as any;
  const margin = 20;
  let y = 30;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0);
  doc.text("TRIP INVOICE / BILL", 105, y, { align: "center" });
  y += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Plant: ${record.plant}`, margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Bill Date: ${format(new Date(), "dd-MMM-yyyy")}`, 140, y);
  y += 10;

  doc.text(`Vendor Code: ${VENDOR_CODE}`, margin, y);
  doc.text(`Trip Date: ${record.date}`, 140, y);
  y += 10;

  doc.text(`PO Number: ${record.poNumber}`, margin, y);
  y += 15;

  // Separator line
  doc.line(margin, y, 190, y);
  y += 10;

  // Trip Details
  const details = [
    ["Vehicle Number", record.vehicleNumber],
    ["Site Name", record.siteName],
    ["Location", record.location],
    ["Purpose", record.purpose === "Custom" ? record.customPurpose : record.purpose],
    ["Number of Trips", record.trips.toString()],
    ["Amount per Trip", record.amountPerTrip.toFixed(2)],
  ];

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "", 70, y);
    y += 8;
  });

  y += 5;
  doc.line(margin, y, 190, y);
  y += 12;

  // Total
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL AMOUNT:", margin, y);
  doc.text(`INR ${record.totalAmount.toFixed(2)}`, 140, y);
  y += 25;

  // Signature Section
  const signatureY = 250;
  const colWidth = 60;
  
  // Lines
  doc.line(margin, signatureY, margin + colWidth - 5, signatureY);
  doc.line(margin + colWidth + 5, signatureY, margin + 2 * colWidth - 5, signatureY);
  doc.line(margin + 2 * colWidth + 5, signatureY, 190, signatureY);
  
  // Labels
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Supplier Signature", margin + (colWidth - 5) / 2, signatureY + 5, { align: "center" });
  doc.text("Plant Head Signature", margin + colWidth + (colWidth - 5) / 2, signatureY + 5, { align: "center" });
  doc.text("Verifier Signature", margin + 2 * colWidth + (colWidth - 5) / 2, signatureY + 5, { align: "center" });

  doc.save(`Bill_${record.plant}_${record.vehicleNumber}_${record.date}.pdf`);
};
