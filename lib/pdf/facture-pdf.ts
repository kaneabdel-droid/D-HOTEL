import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { formatMontantPdf } from "@/lib/currency";

export interface LigneFacturePdf {
  designation: string;
  categorie: string;
  quantite: number;
  pu: number;
  total: number;
}

export interface FactureFolioPdfData {
  numeroFacture: string;
  client: string;
  chambre: string;
  dates: string;
  nuits: number;
  totalHebergement: number;
  totalRestauration: number;
  totalExtras: number;
  taxeSejour: number;
  totalTTC: number;
  totalRegle: number;
  soldeDu: number;
  modeReglement: string;
  lignes: LigneFacturePdf[];
  hotelNom?: string;
  hotelAdresse?: string;
  hotelTelephone?: string;
  hotelEmail?: string;
  hotelNinea?: string;
  hotelRccm?: string;
}

export async function genererFactureFolioPdf(data: FactureFolioPdfData) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // En-tête Hôtel
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 27, 43); // Bleu Saphir
  doc.text(data.hotelNom || "HÔTEL TERANGA PALACE 5★", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(data.hotelAdresse || "Route des Almadies, BP 12000 Dakar • Sénégal", 20, 26);
  doc.text(`Tél : ${data.hotelTelephone || "+221 33 800 00 00"} • Email : ${data.hotelEmail || "facturation@terangapalace.sn"}`, 20, 30);
  doc.text(`NINEA : ${data.hotelNinea || "009845213 2V9"} • RCCM : ${data.hotelRccm || "SN.DKR.2024.B.1245"}`, 20, 34);

  // Cadre Facture / N°
  doc.setDrawColor(212, 175, 55); // Or
  doc.setLineWidth(0.6);
  doc.line(20, 38, pageWidth - 20, 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text("FACTURE DÉFINITIVE & FOLIO", pageWidth - 20, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Réf : ${data.numeroFacture}`, pageWidth - 20, 28, { align: "right" });
  doc.text(`Émise le : ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - 20, 33, { align: "right" });

  // Cadre Client & Séjour
  doc.setFillColor(248, 246, 242);
  doc.roundedRect(20, 44, pageWidth - 40, 26, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("CLIENT / DESTINATAIRE :", 25, 51);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.client, 25, 57);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Résident certifié (Fiche de police enregistrée)", 25, 63);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("DÉTAILS DU SÉJOUR :", pageWidth / 2 + 10, 51);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(`Hébergement : ${data.chambre}`, pageWidth / 2 + 10, 57);
  doc.text(`Période : ${data.dates} (${data.nuits} nuits)`, pageWidth / 2 + 10, 63);

  // Tableau détaillé des dépenses
  const bodyRows = data.lignes.map((l) => [
    l.categorie,
    l.designation,
    String(l.quantite),
    `${formatMontantPdf(l.pu)} FCFA`,
    `${formatMontantPdf(l.total)} FCFA`,
  ]);

  autoTable(doc, {
    startY: 76,
    theme: "striped",
    headStyles: {
      fillColor: [15, 27, 43],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [230, 230, 230],
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 28, halign: "right" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
    head: [["Catégorie", "Désignation de la prestation", "Qté", "Prix Unit.", "Montant Total"]],
    body: bodyRows,
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Récapitulatif financier
  const totauxY = finalY + 6;
  const colRightX = pageWidth - 20;

  // Bloc QR Code fiscal
  try {
    const qrText = `D-HOTEL|FACT:${data.numeroFacture}|CLIENT:${data.client}|TOTAL:${data.totalTTC}XOF|PAYE:${data.totalRegle}XOF|NINEA:009845213`;
    const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 80 });
    doc.addImage(qrDataUrl, "PNG", 20, totauxY + 2, 28, 28);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("Vérification fiscale sécurisée", 20, totauxY + 34);
    doc.text("DGID • Ministère des Finances", 20, totauxY + 38);
  } catch {}

  // Lignes de totaux à droite
  const startTotalsX = pageWidth - 90;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);

  doc.text("Total Hébergement :", startTotalsX, totauxY + 5);
  doc.text(`${formatMontantPdf(data.totalHebergement)} FCFA`, colRightX, totauxY + 5, { align: "right" });

  doc.text("Total Restauration & Bar :", startTotalsX, totauxY + 11);
  doc.text(`${formatMontantPdf(data.totalRestauration)} FCFA`, colRightX, totauxY + 11, { align: "right" });

  doc.text("Total Extras & Loisirs :", startTotalsX, totauxY + 17);
  doc.text(`${formatMontantPdf(data.totalExtras)} FCFA`, colRightX, totauxY + 17, { align: "right" });

  doc.text("Taxe de promotion touristique :", startTotalsX, totauxY + 23);
  doc.text(`${formatMontantPdf(data.taxeSejour)} FCFA`, colRightX, totauxY + 23, { align: "right" });

  // Total TTC
  doc.setFillColor(15, 27, 43);
  doc.rect(startTotalsX - 4, totauxY + 28, 74, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL FACTURÉ TTC :", startTotalsX, totauxY + 34);
  doc.text(`${formatMontantPdf(data.totalTTC)} FCFA`, colRightX - 2, totauxY + 34, { align: "right" });

  // Règlements & Solde
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(16, 185, 129); // Vert
  doc.text(`Règlement (${data.modeReglement}) :`, startTotalsX, totauxY + 44);
  doc.text(`- ${formatMontantPdf(data.totalRegle)} FCFA`, colRightX, totauxY + 44, { align: "right" });

  doc.setFont("helvetica", "bold");
  if (data.soldeDu > 0) {
    doc.setTextColor(239, 68, 68); // Rouge
    doc.text("RESTE À PAYER (SOLDE DÛ) :", startTotalsX, totauxY + 51);
    doc.text(`${formatMontantPdf(data.soldeDu)} FCFA`, colRightX, totauxY + 51, { align: "right" });
  } else {
    doc.setTextColor(16, 185, 129); // Vert
    doc.text("STATUT DU COMPTE :", startTotalsX, totauxY + 51);
    doc.text("SOLDE INTÉGRALEMENT RÉGLÉ", colRightX, totauxY + 51, { align: "right" });
  }

  // Coordonnées bancaires & Mobile Money au pied de page
  doc.setLineWidth(0.3);
  doc.setDrawColor(220, 220, 220);
  doc.line(20, 268, pageWidth - 20, 268);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  doc.text("COORDONNÉES DE RÈGLEMENT :", 20, 273);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text("Wave Mobile Money : +221 77 000 00 00 • Orange Money : +221 78 000 00 00", 20, 277);
  doc.text("Compte Bancaire CBAO Sénégal : SN012 01001 02000045124 89 (Code SWIFT : CBAOSNDA)", 20, 281);

  doc.save(`Facture_${data.numeroFacture}_${data.client.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}
