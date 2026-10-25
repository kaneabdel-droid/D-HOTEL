import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface FichePolicePdfData {
  ficheNumero: string;
  nom: string;
  prenom: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  profession: string;
  domicileHabituel: string;
  typePiece: "Passeport" | "CNI";
  numeroPiece: string;
  dateDelivrance: string;
  lieuDelivrance: string;
  provenance: string;
  destination: string;
  motifSejour: string;
  chambre: string;
  dateArrivee: string;
  dateDepartPrevue: string;
  hotelNom?: string;
  hotelAdresse?: string;
  hotelNinea?: string;
}

export function genererFichePolicePdf(data: FichePolicePdfData) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // En-tête officiel
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("RÉPUBLIQUE DU SÉNÉGAL", pageWidth / 2, 16, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("MINISTÈRE DE L'INTÉRIEUR • DIRECTION DE LA POLICE DE L'AIR ET DES FRONTIÈRES", pageWidth / 2, 21, { align: "center" });
  doc.text("DÉCRET N° 2005-1175 RELATIF AU CONTRÔLE DES VOYAGEURS DANS LES ÉTABLISSEMENTS HÔTELIERS", pageWidth / 2, 25, { align: "center" });

  doc.setLineWidth(0.5);
  doc.setDrawColor(212, 175, 55); // Or Teranga
  doc.line(20, 29, pageWidth - 20, 29);

  // Titre du document
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 27, 43); // Bleu Saphir
  doc.text("FICHE INDIVIDUELLE DE POLICE", pageWidth / 2, 38, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 140, 30);
  doc.text(`N° D'ENREGISTREMENT : ${data.ficheNumero}`, pageWidth / 2, 44, { align: "center" });

  // Coordonnées de l'hôtel
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(`Établissement : ${data.hotelNom || "HÔTEL TERANGA PALACE 5★"}`, 20, 52);
  doc.text(`Adresse : ${data.hotelAdresse || "Route des Almadies, Dakar"}`, 20, 56);
  doc.text(`NINEA : ${data.hotelNinea || "009845213 2V9"}`, 20, 60);

  doc.text(`Chambre attribuée : ${data.chambre}`, pageWidth - 20, 52, { align: "right" });
  doc.text(`Date d'arrivée : ${data.dateArrivee}`, pageWidth - 20, 56, { align: "right" });
  doc.text(`Départ prévu : ${data.dateDepartPrevue}`, pageWidth - 20, 60, { align: "right" });

  // Tableau récapitulatif des renseignements
  autoTable(doc, {
    startY: 66,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
      textColor: [20, 20, 20],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [15, 27, 43],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    head: [["RUBRIQUE REGLEMENTAIRE", "RENSEIGNEMENTS DU VOYAGEUR"]],
    body: [
      ["Nom de famille", data.nom.toUpperCase()],
      ["Prénom(s)", data.prenom],
      ["Sexe", data.sexe === "M" ? "Masculin (M)" : "Féminin (F)"],
      ["Date et lieu de naissance", `${data.dateNaissance} à ${data.lieuNaissance}`],
      ["Nationalité", data.nationalite],
      ["Profession", data.profession],
      ["Domicile habituel", data.domicileHabituel],
      ["Nature de la pièce d'identité", `${data.typePiece} N° ${data.numeroPiece}`],
      ["Délivrance de la pièce", `Délivré(e) le ${data.dateDelivrance} par ${data.lieuDelivrance}`],
      ["Lieu de provenance", data.provenance],
      ["Destination finale", data.destination],
      ["Motif du séjour", data.motifSejour],
    ],
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 180;

  // Signatures et cachet
  const boxTop = finalY + 12;

  // Cadre Signature Voyageur
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, boxTop, 80, 40);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Signature du Voyageur :", 24, boxTop + 6);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(16, 185, 129); // Vert émeraude
  doc.text("✓ Signé numériquement sur tablette", 24, boxTop + 18);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`Certifié le ${data.dateArrivee}`, 24, boxTop + 24);

  // Cadre Cachet Hôtel
  doc.rect(pageWidth - 100, boxTop, 80, 40);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Visa & Cachet Réception :", pageWidth - 96, boxTop + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Service de Réception & Conciergerie", pageWidth - 96, boxTop + 15);
  doc.text("Hôtel Teranga Palace 5★", pageWidth - 96, boxTop + 20);
  doc.text("Transmis au commissariat de secteur", pageWidth - 96, boxTop + 28);

  // Pied de page légal
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "Document officiel établi conformément à la réglementation sénégalaise en vigueur. À conserver au registre spécial de police.",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  // Téléchargement du PDF
  doc.save(`Fiche_Police_${data.ficheNumero}_${data.nom}.pdf`);
}
