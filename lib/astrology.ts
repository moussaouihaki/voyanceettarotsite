export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  emoji: string;
  element: "Feu" | "Terre" | "Air" | "Eau";
  modality: "Cardinal" | "Fixe" | "Mutable";
  ruler: string;
  dates: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  keywords: string[];
  description: string;
  strengths: string[];
  challenges: string[];
  compatibilities: string[];
  house: number;
  color: string;
  stone: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "belier", name: "Bélier", symbol: "♈", emoji: "🐏", element: "Feu", modality: "Cardinal",
    ruler: "Mars", dates: "21 mars — 19 avril", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
    house: 1, color: "#ef4444", stone: "Diamant / Rubis",
    keywords: ["courage", "énergie", "impulsivité", "leadership", "fougue"],
    description: "Premier signe du zodiaque, le Bélier incarne l'énergie du commencement. Pionnier-né, vous foncez tête baissée avec une vitalité contagieuse.",
    strengths: ["Courageux", "Déterminé", "Confiant", "Enthousiaste", "Passionné"],
    challenges: ["Impulsivité", "Impatience", "Ego", "Agressivité potentielle"],
    compatibilities: ["Lion", "Sagittaire", "Gémeaux", "Verseau"],
  },
  {
    id: "taureau", name: "Taureau", symbol: "♉", emoji: "🐂", element: "Terre", modality: "Fixe",
    ruler: "Vénus", dates: "20 avril — 20 mai", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
    house: 2, color: "#10b981", stone: "Émeraude / Saphir",
    keywords: ["stabilité", "sensualité", "persévérance", "matérialité", "ancrage"],
    description: "Le Taureau est le signe de la patience et de la solidité. Ancré dans la Terre, vous construisez avec méthode et appréciez les plaisirs des sens.",
    strengths: ["Fiable", "Patient", "Pratique", "Loyal", "Sensuel"],
    challenges: ["Obstination", "Matérialisme", "Résistance au changement", "Jalousie"],
    compatibilities: ["Vierge", "Capricorne", "Cancer", "Poissons"],
  },
  {
    id: "gemeaux", name: "Gémeaux", symbol: "♊", emoji: "👯", element: "Air", modality: "Mutable",
    ruler: "Mercure", dates: "21 mai — 20 juin", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
    house: 3, color: "#f59e0b", stone: "Agate / Citrine",
    keywords: ["curiosité", "communication", "adaptabilité", "dualité", "intelligence"],
    description: "Les Gémeaux incarnent la dualité et la communication. Curieux insatiable, vous êtes à l'aise dans tous les milieux et adorez les échanges intellectuels.",
    strengths: ["Adaptable", "Communicatif", "Curieux", "Vif", "Sociable"],
    challenges: ["Versatilité excessive", "Superficialité", "Indécision", "Nervosité"],
    compatibilities: ["Balance", "Verseau", "Bélier", "Lion"],
  },
  {
    id: "cancer", name: "Cancer", symbol: "♋", emoji: "🦀", element: "Eau", modality: "Cardinal",
    ruler: "Lune", dates: "21 juin — 22 juillet", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22,
    house: 4, color: "#7c3aed", stone: "Pierre de Lune / Perle",
    keywords: ["émotions", "intuition", "famille", "protection", "sensibilité"],
    description: "Le Cancer est le signe de la sensibilité et des racines. Profondément intuitif, vous êtes le gardien du foyer et des émotions de ceux que vous aimez.",
    strengths: ["Intuitif", "Sensible", "Loyal", "Protecteur", "Empathique"],
    challenges: ["Humeur changeante", "Rancunier", "Repli sur soi", "Manipulation émotionnelle"],
    compatibilities: ["Scorpion", "Poissons", "Taureau", "Vierge"],
  },
  {
    id: "lion", name: "Lion", symbol: "♌", emoji: "🦁", element: "Feu", modality: "Fixe",
    ruler: "Soleil", dates: "23 juillet — 22 août", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
    house: 5, color: "#d97706", stone: "Or / Péridot",
    keywords: ["générosité", "créativité", "royauté", "orgueil", "leadership"],
    description: "Le Lion est le signe du rayonnement et de la créativité. Naturellement charismatique, vous avez besoin d'être reconnu et d'exprimer votre grandeur.",
    strengths: ["Charismatique", "Généreux", "Créatif", "Loyal", "Courageux"],
    challenges: ["Orgueil", "Autoritarisme", "Besoin d'admiration", "Dramatisme"],
    compatibilities: ["Sagittaire", "Bélier", "Gémeaux", "Balance"],
  },
  {
    id: "vierge", name: "Vierge", symbol: "♍", emoji: "🌾", element: "Terre", modality: "Mutable",
    ruler: "Mercure", dates: "23 août — 22 septembre", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
    house: 6, color: "#065f46", stone: "Sardonyx / Jade",
    keywords: ["analyse", "perfectionnisme", "service", "méthode", "santé"],
    description: "La Vierge est le signe de la précision et du service. Analytique et méthodique, vous avez un sens aigu du détail et un désir sincère d'être utile.",
    strengths: ["Analytique", "Fiable", "Organisé", "Discret", "Dévoué"],
    challenges: ["Perfectionnisme", "Anxiété", "Critique excessive", "Rigidité"],
    compatibilities: ["Taureau", "Capricorne", "Cancer", "Scorpion"],
  },
  {
    id: "balance", name: "Balance", symbol: "♎", emoji: "⚖️", element: "Air", modality: "Cardinal",
    ruler: "Vénus", dates: "23 septembre — 22 octobre", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
    house: 7, color: "#ec4899", stone: "Saphir / Opale",
    keywords: ["harmonie", "justice", "beauté", "diplomatie", "indécision"],
    description: "La Balance est le signe de l'harmonie et de la justice. Diplomate-né(e), vous avez un sens esthétique raffiné et cherchez constamment l'équilibre.",
    strengths: ["Diplomate", "Équitable", "Charmant", "Sociable", "Artistique"],
    challenges: ["Indécision", "Évitement des conflits", "Superficialité", "Dépendance affective"],
    compatibilities: ["Gémeaux", "Verseau", "Lion", "Sagittaire"],
  },
  {
    id: "scorpion", name: "Scorpion", symbol: "♏", emoji: "🦂", element: "Eau", modality: "Fixe",
    ruler: "Pluton/Mars", dates: "23 octobre — 21 novembre", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
    house: 8, color: "#991b1b", stone: "Topaze / Rubis",
    keywords: ["transformation", "intensité", "mystère", "passion", "pouvoir"],
    description: "Le Scorpion est le signe de la transformation et de l'intensité. Vous plongez au cœur des mystères et des profondeurs avec une passion dévorante.",
    strengths: ["Intense", "Perspicace", "Loyal", "Passionné", "Déterminé"],
    challenges: ["Jalousie", "Vengeance", "Obsession", "Manipulation"],
    compatibilities: ["Cancer", "Poissons", "Vierge", "Capricorne"],
  },
  {
    id: "sagittaire", name: "Sagittaire", symbol: "♐", emoji: "🏹", element: "Feu", modality: "Mutable",
    ruler: "Jupiter", dates: "22 novembre — 21 décembre", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21,
    house: 9, color: "#7c2d12", stone: "Turquoise / Zircon",
    keywords: ["liberté", "philosophie", "aventure", "optimisme", "vérité"],
    description: "Le Sagittaire est le signe de la liberté et de la philosophie. Grand voyageur de l'âme et du monde, vous cherchez sans cesse la vérité et l'expansion.",
    strengths: ["Optimiste", "Généreux", "Philosophique", "Honnête", "Aventurier"],
    challenges: ["Irresponsabilité", "Maladresse verbale", "Superficialité", "Nomadisme excessif"],
    compatibilities: ["Bélier", "Lion", "Balance", "Verseau"],
  },
  {
    id: "capricorne", name: "Capricorne", symbol: "♑", emoji: "🐐", element: "Terre", modality: "Cardinal",
    ruler: "Saturne", dates: "22 décembre — 19 janvier", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
    house: 10, color: "#374151", stone: "Grenat / Onyx",
    keywords: ["ambition", "discipline", "persévérance", "responsabilité", "sérieux"],
    description: "Le Capricorne est le signe de l'ambition et de la discipline. Vous gravissez les sommets avec méthode, patience et une détermination sans faille.",
    strengths: ["Ambitieux", "Discipliné", "Responsable", "Patient", "Pratique"],
    challenges: ["Rigidité", "Pessimisme", "Matérialisme", "Froideur émotionnelle"],
    compatibilities: ["Taureau", "Vierge", "Scorpion", "Poissons"],
  },
  {
    id: "verseau", name: "Verseau", symbol: "♒", emoji: "🏺", element: "Air", modality: "Fixe",
    ruler: "Uranus/Saturne", dates: "20 janvier — 18 février", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
    house: 11, color: "#1d4ed8", stone: "Améthyste / Aquamarine",
    keywords: ["originalité", "humanisme", "innovation", "liberté", "détachement"],
    description: "Le Verseau est le signe de l'originalité et de l'humanisme. Visionnaire en avance sur son temps, vous cherchez à révolutionner le monde par vos idées.",
    strengths: ["Original", "Humaniste", "Indépendant", "Inventif", "Altruiste"],
    challenges: ["Détachement émotionnel", "Entêtement", "Rébellion gratuite", "Imprévisibilité"],
    compatibilities: ["Gémeaux", "Balance", "Sagittaire", "Bélier"],
  },
  {
    id: "poissons", name: "Poissons", symbol: "♓", emoji: "🐟", element: "Eau", modality: "Mutable",
    ruler: "Neptune/Jupiter", dates: "19 février — 20 mars", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
    house: 12, color: "#0891b2", stone: "Aigue-marine / Améthyste",
    keywords: ["spiritualité", "empathie", "intuition", "rêverie", "compassion"],
    description: "Les Poissons sont le signe de la spiritualité et de l'empathie. Profondément intuitif, vous navigez entre les mondes visible et invisible avec grâce.",
    strengths: ["Empathique", "Intuitif", "Créatif", "Altruiste", "Spirituel"],
    challenges: ["Fuite de la réalité", "Hypersensibilité", "Dépendance", "Manque de limites"],
    compatibilities: ["Cancer", "Scorpion", "Taureau", "Capricorne"],
  },
];

export function getSunSign(dateNaissance: string): ZodiacSign {
  const [, monthStr, dayStr] = dateNaissance.split("-");
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);

  for (const sign of ZODIAC_SIGNS) {
    const { startMonth, startDay, endMonth, endDay } = sign;
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign;
    }
  }
  return ZODIAC_SIGNS[11]; // Poissons par défaut
}

export const PLANETS = [
  { name: "Soleil ☀️", rules: "Leo / Lion", meaning: "Identité, ego, vitalité, expression du moi" },
  { name: "Lune 🌙", rules: "Cancer", meaning: "Émotions, instincts, inconscient, besoins profonds" },
  { name: "Mercure ☿", rules: "Gémeaux / Vierge", meaning: "Communication, pensée, adaptabilité" },
  { name: "Vénus ♀", rules: "Taureau / Balance", meaning: "Amour, beauté, valeurs, plaisir" },
  { name: "Mars ♂", rules: "Bélier / Scorpion", meaning: "Action, désir, énergie, conflit" },
  { name: "Jupiter ♃", rules: "Sagittaire / Poissons", meaning: "Expansion, chance, sagesse, abondance" },
  { name: "Saturne ♄", rules: "Capricorne / Verseau", meaning: "Discipline, karma, limitation, maturité" },
  { name: "Uranus ♅", rules: "Verseau", meaning: "Révolution, originalité, ruptures soudaines" },
  { name: "Neptune ♆", rules: "Poissons", meaning: "Spiritualité, illusion, rêves, dissolution" },
  { name: "Pluton ♇", rules: "Scorpion", meaning: "Transformation radicale, pouvoir, mort-renaissance" },
];

export const ASTRO_HOUSES = [
  { number: 1, name: "Maison de l'Identité", keywords: "Apparence, personnalité, comment le monde vous voit" },
  { number: 2, name: "Maison des Ressources", keywords: "Argent, possessions, valeurs personnelles" },
  { number: 3, name: "Maison de la Communication", keywords: "Pensée, parole, fratrie, voyages courts" },
  { number: 4, name: "Maison du Foyer", keywords: "Famille, racines, maison, mère" },
  { number: 5, name: "Maison de la Créativité", keywords: "Amour, enfants, créativité, plaisirs" },
  { number: 6, name: "Maison de la Santé", keywords: "Travail quotidien, santé, service, habitudes" },
  { number: 7, name: "Maison des Partenariats", keywords: "Mariage, associés, ennemis déclarés" },
  { number: 8, name: "Maison de la Transformation", keywords: "Mort, héritage, sexualité, mystères" },
  { number: 9, name: "Maison de la Philosophie", keywords: "Voyages longs, spiritualité, idéaux" },
  { number: 10, name: "Maison de la Carrière", keywords: "Réputation, statut social, ambitions" },
  { number: 11, name: "Maison des Idéaux", keywords: "Amis, groupes, projets collectifs, humanisme" },
  { number: 12, name: "Maison du Karma", keywords: "Inconscient, karma, retraite, secrets cachés" },
];
