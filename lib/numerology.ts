// Pythagorean letter-to-number mapping
const PYTHAGOREAN: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const VOWELS = new Set(["A","E","I","O","U","Y"]);

function reduceNumber(n: number, keepMaster = true): number {
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) break;
    n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}

function sumDigits(n: number): number {
  return String(Math.abs(n)).split("").reduce((s, d) => s + parseInt(d), 0);
}

function letterValue(ch: string): number {
  return PYTHAGOREAN[ch.toUpperCase()] || 0;
}

export interface NumerologyProfile {
  cheminDeVie: number;
  expression: number;
  ame: number;
  personnalite: number;
  actif: number;
  hereditaire: number;
  anneePersonnelle: number;
  moisPersonnel: number;
  jourPersonnel: number;
  nombreNaissance: number;
  nombreKarmique: number | null;
  nombreMaitre: boolean;
}

export function calculerCheminDeVie(dateNaissance: string): number {
  // dateNaissance: "YYYY-MM-DD"
  const digits = dateNaissance.replace(/-/g, "").split("").map(Number);
  return reduceNumber(digits.reduce((s, d) => s + d, 0));
}

export function calculerExpression(nomComplet: string): number {
  const letters = nomComplet.toUpperCase().replace(/[^A-Z]/g, "").split("");
  return reduceNumber(letters.reduce((s, l) => s + letterValue(l), 0));
}

export function calculerAme(nomComplet: string): number {
  const vowels = nomComplet.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => VOWELS.has(l));
  return reduceNumber(vowels.reduce((s, l) => s + letterValue(l), 0));
}

export function calculerPersonnalite(nomComplet: string): number {
  const consonants = nomComplet.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => !VOWELS.has(l));
  return reduceNumber(consonants.reduce((s, l) => s + letterValue(l), 0));
}

export function calculerActif(prenom: string): number {
  return reduceNumber(prenom.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((s, l) => s + letterValue(l), 0));
}

export function calculerHereditaire(nom: string): number {
  return reduceNumber(nom.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((s, l) => s + letterValue(l), 0));
}

export function calculerAnneePersonnelle(dateNaissance: string, annee?: number): number {
  const [year, month, day] = dateNaissance.split("-").map(Number);
  const targetYear = annee || new Date().getFullYear();
  const sum = sumDigits(day) + sumDigits(month) + sumDigits(targetYear);
  return reduceNumber(sum);
}

export function calculerMoisPersonnel(dateNaissance: string, annee?: number, mois?: number): number {
  const ap = calculerAnneePersonnelle(dateNaissance, annee);
  const currentMois = mois || (new Date().getMonth() + 1);
  return reduceNumber(ap + sumDigits(currentMois));
}

export function calculerJourPersonnel(dateNaissance: string): number {
  const today = new Date();
  const mp = calculerMoisPersonnel(dateNaissance);
  return reduceNumber(mp + today.getDate());
}

export function calculerNombreNaissance(dateNaissance: string): number {
  const day = parseInt(dateNaissance.split("-")[2]);
  return reduceNumber(day);
}

export function detecterNombreKarmique(dateNaissance: string): number | null {
  const raw = dateNaissance.replace(/-/g, "").split("").map(Number).reduce((s, d) => s + d, 0);
  // Nombres karmiques : 13, 14, 16, 19
  const karmic = [13, 14, 16, 19];
  // Check intermediate sum
  let n = raw;
  while (n > 99) n = sumDigits(n);
  return karmic.includes(n) ? n : null;
}

export function calculerProfil(prenom: string, nom: string, dateNaissance: string): NumerologyProfile {
  const nomComplet = `${prenom} ${nom}`;
  const cdv = calculerCheminDeVie(dateNaissance);
  return {
    cheminDeVie: cdv,
    expression: calculerExpression(nomComplet),
    ame: calculerAme(nomComplet),
    personnalite: calculerPersonnalite(nomComplet),
    actif: calculerActif(prenom),
    hereditaire: calculerHereditaire(nom),
    anneePersonnelle: calculerAnneePersonnelle(dateNaissance),
    moisPersonnel: calculerMoisPersonnel(dateNaissance),
    jourPersonnel: calculerJourPersonnel(dateNaissance),
    nombreNaissance: calculerNombreNaissance(dateNaissance),
    nombreKarmique: detecterNombreKarmique(dateNaissance),
    nombreMaitre: [11, 22, 33].includes(cdv),
  };
}

export const NUMBER_MEANINGS: Record<number, { title: string; keywords: string[]; description: string; color: string }> = {
  1: { title: "Le Pionnier", color: "#ef4444", keywords: ["indépendance", "leadership", "initiative", "originalité"], description: "Le 1 est le nombre du commencement, de la volonté et du leadership. Vous êtes né(e) pour tracer votre propre chemin et inspirer les autres par votre unicité." },
  2: { title: "Le Diplomate", color: "#8b5cf6", keywords: ["coopération", "sensibilité", "harmonie", "intuition"], description: "Le 2 est le nombre du partenariat et de la sensibilité. Vous excellez dans la médiation et la création d'harmonie entre les êtres." },
  3: { title: "Le Créateur", color: "#f59e0b", keywords: ["créativité", "expression", "joie", "communication"], description: "Le 3 est le nombre de la créativité et de l'expression. Vous avez un don naturel pour les arts, la communication et l'inspiration des autres." },
  4: { title: "Le Bâtisseur", color: "#10b981", keywords: ["stabilité", "travail", "ordre", "discipline"], description: "Le 4 est le nombre de la fondation et de la construction. Votre force réside dans votre capacité à créer des structures solides et durables." },
  5: { title: "L'Aventurier", color: "#3b82f6", keywords: ["liberté", "changement", "aventure", "polyvalence"], description: "Le 5 est le nombre de la liberté et du changement. Vous avez besoin de variété, d'expériences et de mouvement pour vous épanouir pleinement." },
  6: { title: "Le Guérisseur", color: "#ec4899", keywords: ["responsabilité", "amour", "famille", "service"], description: "Le 6 est le nombre de l'amour et de la responsabilité. Vous êtes naturellement orienté(e) vers le soin des autres et la création d'harmonie familiale." },
  7: { title: "Le Sage", color: "#6366f1", keywords: ["sagesse", "spiritualité", "analyse", "mystère"], description: "Le 7 est le nombre de la sagesse et de la spiritualité. Vous êtes attiré(e) par les mystères de l'existence et la recherche de vérités profondes." },
  8: { title: "Le Manifesteur", color: "#d97706", keywords: ["pouvoir", "ambition", "manifestation", "karma"], description: "Le 8 est le nombre du pouvoir et de l'abondance. Vous avez la capacité de manifester le succès matériel et d'exercer un leadership naturel." },
  9: { title: "L'Humaniste", color: "#7c3aed", keywords: ["compassion", "humanisme", "sagesse universelle", "don de soi"], description: "Le 9 est le nombre de la sagesse universelle et de l'humanisme. Vous portez en vous le désir profond de contribuer au bien de l'humanité." },
  11: { title: "L'Illuminé (Maître 11)", color: "#a78bfa", keywords: ["intuition maître", "illumination", "canal spirituel", "inspirateur"], description: "Le 11 est un Nombre Maître — vibration de l'illumination et de l'intuition spirituelle. Vous êtes un canal entre les mondes." },
  22: { title: "Le Grand Bâtisseur (Maître 22)", color: "#ffd700", keywords: ["vision grandiose", "construction universelle", "maître bâtisseur", "réalisation"], description: "Le 22 est le Nombre Maître du grand bâtisseur. Vous avez la capacité de transformer des rêves grandioses en réalités concrètes." },
  33: { title: "Le Maître Enseignant (Maître 33)", color: "#f0abfc", keywords: ["enseignement universel", "compassion maître", "guérison", "amour inconditionnel"], description: "Le 33 est le Nombre Maître de l'enseignement universel. Vous êtes appelé(e) à guérir et enseigner par l'amour inconditionnel." },
};

export const CALCULATION_LABELS: Record<keyof NumerologyProfile, string> = {
  cheminDeVie: "Chemin de Vie",
  expression: "Nombre d'Expression",
  ame: "Nombre de l'Âme",
  personnalite: "Nombre de Personnalité",
  actif: "Nombre Actif",
  hereditaire: "Nombre Héréditaire",
  anneePersonnelle: "Année Personnelle",
  moisPersonnel: "Mois Personnel",
  jourPersonnel: "Jour Personnel",
  nombreNaissance: "Nombre de Naissance",
  nombreKarmique: "Nombre Karmique",
  nombreMaitre: "Nombre Maître",
};
