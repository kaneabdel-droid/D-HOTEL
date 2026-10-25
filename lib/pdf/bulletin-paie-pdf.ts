// d-hotel/lib/pdf/bulletin-paie-pdf.ts
// Générateur officiel de Bulletins de Paie A4 Haute Définition pour D-HOTEL (OHADA / Sénégal)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMontantPdf } from "@/lib/currency";
import type { BulletinPaieCalcule } from "@/lib/rh";

export interface BulletinHotelInfo {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  ninea: string;
  rccm: string;
  ipresNumero?: string;
  cssNumero?: string;
}

export function genererBulletinPaiePdf(
  bulletin: BulletinPaieCalcule,
  hotel: BulletinHotelInfo = {
    nom: "HÔTEL TERANGA PALACE 5★ DAKAR",
    adresse: "Route des Almadies, BP 12000 Dakar • Sénégal",
    telephone: "+221 33 800 00 00",
    email: "rh@terangapalace.sn",
    ninea: "009845213 2V9",
    rccm: "SN.DKR.2024.B.1245",
    ipresNumero: "IPRES-SN-445892",
    cssNumero: "CSS-DKR-881290",
  }
) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. En-tête Hôtel (Haut gauche)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 27, 43); // Bleu Nuit
  doc.text(hotel.nom, 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(hotel.adresse, 14, 21);
  doc.text(`Tél : ${hotel.telephone} • Email : ${hotel.email}`, 14, 25);
  doc.text(
    `NINEA : ${hotel.ninea} • RCCM : ${hotel.rccm} • N° IPRES : ${hotel.ipresNumero || "—"} • N° CSS : ${hotel.cssNumero || "—"}`,
    14,
    29
  );

  // Titre & Période (Haut droite)
  doc.setDrawColor(212, 175, 55); // Doré
  doc.setLineWidth(0.6);
  doc.line(14, 33, pageWidth - 14, 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(212, 175, 55);
  doc.text("BULLETIN DE PAIE", pageWidth - 14, 16, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Période : ${bulletin.periodeTexte.toUpperCase()}`, pageWidth - 14, 22, { align: "right" });
  doc.text(`Édition : ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - 14, 27, { align: "right" });

  // 2. Fiche Salarié / Collaborateur (Cartouche encadré)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 36, pageWidth - 28, 24, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 36, pageWidth - 28, 24, 2, 2, "D");

  // Colonne 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 27, 43);
  doc.text("SALARIÉ / COLLABORATEUR :", 18, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(bulletin.nomComplet, 18, 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Matricule : ${bulletin.matricule}`, 18, 52);
  doc.text(`Statut : ${bulletin.statut}`, 18, 56);

  // Colonne 2
  doc.text(`Département : ${bulletin.departement}`, 85, 42);
  doc.text(`Poste : ${bulletin.poste}`, 85, 47);
  doc.text(`Convention : Hôtellerie (${bulletin.categorie})`, 85, 52);
  doc.text(`Jours travaillés : ${bulletin.joursTravailles} / ${bulletin.joursOuvresMois} j`, 85, 56);

  // Colonne 3
  doc.text(`Heures normales : ${bulletin.heuresNormales} h`, 150, 42);
  doc.text(`Heures supp. : ${bulletin.heuresSupp} h`, 150, 47);
  doc.text(`Taux horaire : ${formatMontantPdf(bulletin.tauxHoraire)} F`, 150, 52);
  doc.text(`Devise : FCFA (XOF)`, 150, 56);

  // 3. Corps du Bulletin (Tableau des rubriques avec autotable)
  const bodyRows: (string | { content: string; colSpan?: number; styles?: object })[][] = [];

  const typesOrdre: { key: "gain" | "retenue_absence" | "retenue_salariale" | "charge_patronale"; titre: string; bg: [number, number, number] }[] = [
    { key: "gain", titre: "1. GAINS & INDEMNITÉS IMPOSABLES ET EXONÉRÉES", bg: [241, 245, 249] },
    { key: "retenue_absence", titre: "2. DÉDUCTIONS TEMPS DE TRAVAIL & ABSENCES", bg: [254, 242, 242] },
    { key: "retenue_salariale", titre: "3. RETENUES SALARIALES & COTISATIONS (IPRES, IPM, IMPÔTS)", bg: [243, 244, 246] },
    { key: "charge_patronale", titre: "4. COTISATIONS PATRONALES (IPRES, CSS, CFCE, IPM - POUR INFORMATION)", bg: [238, 242, 255] },
  ];

  for (const group of typesOrdre) {
    const lignesGroup = bulletin.lignes.filter((l) => l.type === group.key);
    if (lignesGroup.length === 0) continue;

    bodyRows.push([
      {
        content: group.titre,
        colSpan: 5,
        styles: { fillColor: group.bg, fontStyle: "bold", textColor: [30, 41, 59], fontSize: 7.5 },
      },
    ]);

    for (const ligne of lignesGroup) {
      bodyRows.push([
        ligne.libelle,
        ligne.base > 0 ? formatMontantPdf(ligne.base) : "—",
        ligne.taux != null ? `${ligne.taux} %` : "—",
        ligne.montantSalarial !== 0 ? formatMontantPdf(ligne.montantSalarial) : "—",
        ligne.montantPatronal != null && ligne.montantPatronal > 0 ? formatMontantPdf(ligne.montantPatronal) : "—",
      ]);
    }
  }

  autoTable(doc, {
    startY: 63,
    head: [["Rubrique / Désignation", "Base (FCFA)", "Taux", "Part Salariale", "Part Patronale"]],
    body: bodyRows,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 26, halign: "right" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 30, halign: "right", fontStyle: "bold" },
      4: { cellWidth: 30, halign: "right" },
    },
    headStyles: {
      fillColor: [15, 27, 43], // Bleu Nuit Teranga
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;

  // 4. Totaux & Net à Payer
  autoTable(doc, {
    startY: finalY,
    head: [["Salaire Brut Total", "Total Retenues Salariales", "NET À PAYER SALARIÉ", "Coût Total Employeur"]],
    body: [
      [
        `${formatMontantPdf(bulletin.salaireBrutTotal)} FCFA`,
        `${formatMontantPdf(bulletin.totalRetenuesSalariales)} FCFA`,
        {
          content: `${formatMontantPdf(bulletin.netAPayer)} FCFA`,
          styles: { fontStyle: "bold", fontSize: 11, textColor: [15, 27, 43], fillColor: [254, 243, 199] },
        },
        `${formatMontantPdf(bulletin.coutTotalEmployeur)} FCFA`,
      ],
    ],
    styles: { fontSize: 8.5, halign: "center", cellPadding: 2.5 },
    headStyles: { fillColor: [51, 65, 85], fontSize: 8 },
    theme: "grid",
    margin: { left: 14, right: 14 },
  });

  const totauxFinalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // Mentions légales & Conservation
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Pour faire valoir ce que de droit. Bulletin de paie à conserver sans limitation de durée (Art. L.116 du Code du Travail du Sénégal).",
    14,
    totauxFinalY
  );

  // 5. Cadres de Signature (Salarié et Employeur)
  let ySign = totauxFinalY + 8;
  if (ySign > pageHeight - 35) {
    doc.addPage();
    ySign = 20;
  }

  // Boîte Salarié
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, ySign, 85, 24, 1.5, 1.5, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("ÉMARGEMENT / SIGNATURE DU SALARIÉ", 17, ySign + 5);

  // Boîte Employeur
  doc.roundedRect(pageWidth - 99, ySign, 85, 24, 1.5, 1.5, "D");
  doc.text("SIGNATURE & CACHET DE LA DIRECTION", pageWidth - 96, ySign + 5);

  // Téléchargement du fichier PDF
  const nomFichier = `Bulletin_${bulletin.matricule}_${bulletin.periodeMois}_${bulletin.periodeAnnee}.pdf`;
  doc.save(nomFichier);
}
