export interface AuraColor {
  id: string;
  name: string;
  colorHex: string;
  colorSecondary: string;
  chakra: string;
  element: string;
  archetype: string;
  keywords: string[];
  strengths: string;
  challenges: string;
  message: string;
  compatible: string[];
}

export const AURA_COLORS: AuraColor[] = [
  {
    id: "rouge",
    name: "Rouge Sang-de-Vie",
    colorHex: "#E74C3C",
    colorSecondary: "#C0392B",
    chakra: "Racine",
    element: "Feu",
    archetype: "Le Guerrier",
    keywords: ["passion", "force", "courage", "vitalité", "action"],
    strengths: "Énergie vitale exceptionnelle, détermination sans faille et capacité à s'engager pleinement dans chaque défi de la vie.",
    challenges: "Tendance à l'impatience, à la colère et à l'épuisement par surengagement. Apprendre à canaliser la force.",
    message: "Votre feu intérieur est une force créatrice immense. Dirigez cette flamme vers ce qui vous élève et transformez le monde autour de vous.",
    compatible: ["Orange Soleil-Créateur", "Or Lumière-Solaire"],
  },
  {
    id: "orange",
    name: "Orange Soleil-Créateur",
    colorHex: "#E67E22",
    colorSecondary: "#D35400",
    chakra: "Sacré",
    element: "Feu",
    archetype: "L'Artiste",
    keywords: ["créativité", "joie", "spontanéité", "sensualité", "enthousiasme"],
    strengths: "Créativité débordante, joie contagieuse et capacité à trouver la beauté dans chaque instant. Source d'inspiration pour les autres.",
    challenges: "Éparpillement de l'énergie créatrice, difficulté à terminer les projets et hypersensibilité aux jugements extérieurs.",
    message: "Votre créativité est un don sacré. Exprimez-vous sans retenue — chaque création que vous apportez au monde enrichit l'humanité.",
    compatible: ["Jaune Flamme-d'Or", "Rouge Sang-de-Vie"],
  },
  {
    id: "jaune",
    name: "Jaune Flamme-d'Or",
    colorHex: "#F1C40F",
    colorSecondary: "#D4AC0D",
    chakra: "Plexus Solaire",
    element: "Feu",
    archetype: "Le Sage",
    keywords: ["intellect", "clarté", "optimisme", "confiance", "rayonnement"],
    strengths: "Intelligence vive, optimisme naturel et capacité à apporter de la clarté dans les situations complexes. Rayonnement solaire communicatif.",
    challenges: "Perfectionnisme paralysant, besoin de reconnaissance et tendance à l'intellectualisation des émotions.",
    message: "Votre lumière intellectuelle illumine les chemins obscurs. Partagez votre sagesse avec générosité — elle est précieuse pour ceux qui vous entourent.",
    compatible: ["Vert Émeraude-Cœur", "Orange Soleil-Créateur"],
  },
  {
    id: "vert",
    name: "Vert Émeraude-Cœur",
    colorHex: "#27AE60",
    colorSecondary: "#1E8449",
    chakra: "Cœur",
    element: "Terre",
    archetype: "Le Guérisseur",
    keywords: ["amour", "guérison", "compassion", "croissance", "harmonie"],
    strengths: "Capacité de guérison naturelle, empathie profonde et don pour créer des espaces de sécurité et de croissance pour les autres.",
    challenges: "Tendance à s'oublier au profit des autres, absorption des émotions environnantes et difficulté à poser des limites saines.",
    message: "Votre cœur est un sanctuaire de guérison. Prenez soin de vous avec la même tendresse que vous offrez aux autres.",
    compatible: ["Rose Lumière-d'Amour", "Bleu Ciel-Vérité"],
  },
  {
    id: "bleu-ciel",
    name: "Bleu Ciel-Vérité",
    colorHex: "#3498DB",
    colorSecondary: "#2980B9",
    chakra: "Gorge",
    element: "Air",
    archetype: "Le Messager",
    keywords: ["communication", "vérité", "expression", "calme", "fidélité"],
    strengths: "Communication claire et inspirante, intégrité naturelle et talent pour exprimer des vérités complexes avec douceur et précision.",
    challenges: "Difficulté à s'affirmer dans les conflits, tendance à la retenue émotionnelle et peur de ne pas être compris.",
    message: "Votre voix porte une vérité précieuse. Parlez avec clarté et confiance — les mots justes que vous portez en vous peuvent changer des vies.",
    compatible: ["Vert Émeraude-Cœur", "Bleu Indigo-Vision"],
  },
  {
    id: "indigo",
    name: "Bleu Indigo-Vision",
    colorHex: "#2C3E9E",
    colorSecondary: "#1A252F",
    chakra: "Troisième Œil",
    element: "Éther",
    archetype: "Le Visionnaire",
    keywords: ["intuition", "vision", "sagesse profonde", "perception", "mystère"],
    strengths: "Intuition extraordinaire, perception au-delà du voile apparent et capacité à voir les patterns subtils que les autres ignorent.",
    challenges: "Tendance à l'isolement, incompréhension des autres et difficulté à ancrer les visions dans la réalité concrète.",
    message: "Votre troisième œil perçoit ce que peu voient. Faites confiance à vos visions — elles sont des cartes vers votre destinée.",
    compatible: ["Violet Sagesse-Éternelle", "Bleu Ciel-Vérité"],
  },
  {
    id: "violet",
    name: "Violet Sagesse-Éternelle",
    colorHex: "#8E44AD",
    colorSecondary: "#6C3483",
    chakra: "Couronne",
    element: "Éther",
    archetype: "Le Mystique",
    keywords: ["spiritualité", "sagesse", "transformation", "mystère", "transcendance"],
    strengths: "Connexion spirituelle profonde, sagesse transcendante et capacité à guider les autres vers une compréhension plus élevée de leur existence.",
    challenges: "Difficulté à rester ancré dans le monde matériel, tendance à l'isolement spirituel et perfectionnisme idéaliste.",
    message: "Votre âme ancienne porte une sagesse des étoiles. Ancrez-la dans le quotidien et elle deviendra un phare pour les chercheurs de lumière.",
    compatible: ["Bleu Indigo-Vision", "Blanc Lumière-Divine"],
  },
  {
    id: "rose",
    name: "Rose Lumière-d'Amour",
    colorHex: "#FF69B4",
    colorSecondary: "#E84393",
    chakra: "Cœur",
    element: "Eau",
    archetype: "L'Amoureux",
    keywords: ["amour inconditionnel", "douceur", "guérison par l'amour", "tendresse", "compassion"],
    strengths: "Capacité à aimer sans condition, douceur transformatrice et don pour créer de la connexion authentique et guérir par la présence bienveillante.",
    challenges: "Vulnérabilité émotionnelle, besoin d'approbation et tendance à idéaliser les êtres aimés menant à des désillusions.",
    message: "Votre amour est une force cosmique. Aimez-vous d'abord avec cette même infinie tendresse — c'est la source de tout le reste.",
    compatible: ["Vert Émeraude-Cœur", "Violet Sagesse-Éternelle"],
  },
  {
    id: "blanc",
    name: "Blanc Lumière-Divine",
    colorHex: "#ECF0F1",
    colorSecondary: "#BDC3C7",
    chakra: "Couronne",
    element: "Éther",
    archetype: "Le Prophète",
    keywords: ["pureté", "clarté divine", "vérité absolue", "protection", "intégrité"],
    strengths: "Clarté spirituelle exceptionnelle, intégrité sans compromis et capacité à inspirer la pureté d'intention chez les autres.",
    challenges: "Sensibilité extrême aux énergies lourdes, besoin intense de solitude pour se ressourcer et difficulté dans les environnements chaotiques.",
    message: "Votre pureté d'âme est un sanctuaire de paix. Protégez cette clarté précieuse et offrez-la au monde avec discernement et sagesse.",
    compatible: ["Violet Sagesse-Éternelle", "Argent Lune-Réceptive"],
  },
  {
    id: "or",
    name: "Or Lumière-Solaire",
    colorHex: "#F39C12",
    colorSecondary: "#D68910",
    chakra: "Plexus Solaire",
    element: "Feu",
    archetype: "Le Maître",
    keywords: ["maîtrise", "abondance", "leadership", "rayonnement", "accomplissement"],
    strengths: "Leadership naturel rayonnant, capacité à manifester l'abondance et don pour inspirer les autres à atteindre leur plein potentiel.",
    challenges: "Tendance à l'orgueil subtil, difficulté à déléguer et perfectionnisme exigeant autant envers soi qu'envers les autres.",
    message: "Vous êtes né pour briller et guider. Votre lumière est un don — partagez-la humblement et elle multipliera sa puissance tenfold.",
    compatible: ["Rouge Sang-de-Vie", "Jaune Flamme-d'Or"],
  },
  {
    id: "argent",
    name: "Argent Lune-Réceptive",
    colorHex: "#BDC3C7",
    colorSecondary: "#95A5A6",
    chakra: "Couronne",
    element: "Eau",
    archetype: "La Prêtresse",
    keywords: ["réceptivité", "intuition lunaire", "cycles", "réflexion", "mystère féminin"],
    strengths: "Réceptivité intuitive extraordinaire, capacité à refléter la vérité des autres et sagesse des cycles naturels et émotionnels.",
    challenges: "Difficulté à s'affirmer, tendance à l'indécision et absorption excessive des énergies et émotions environnantes.",
    message: "Comme la lune, votre sagesse réside dans la réceptivité. Ce que vous recevez et transformez silencieusement est votre plus grand pouvoir.",
    compatible: ["Blanc Lumière-Divine", "Bleu Indigo-Vision"],
  },
  {
    id: "noir",
    name: "Noir Abîme-Transformateur",
    colorHex: "#2C3E50",
    colorSecondary: "#1A252F",
    chakra: "Racine",
    element: "Terre",
    archetype: "L'Alchimiste",
    keywords: ["protection", "transformation", "mystère", "profondeur", "renaissance"],
    strengths: "Pouvoir de transformation profonde, capacité à traverser les abysses de l'âme et force de protection naturelle pour soi et les autres.",
    challenges: "Tendance à l'isolement, difficulté à s'ouvrir et résistance au changement malgré une nature profondément transformatrice.",
    message: "Dans vos profondeurs réside une puissance de renaissance extraordinaire. Traversez l'obscurité avec confiance — elle porte la lumière de demain.",
    compatible: ["Violet Sagesse-Éternelle", "Rouge Sang-de-Vie"],
  },
];

export function drawAuraColors(count: number): AuraColor[] {
  const shuffled = [...AURA_COLORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface AuraReading {
  dominant: AuraColor;
  secondary: AuraColor;
  message: string;
}

export function getAuraByBirthdate(dateStr: string): AuraColor {
  // Parse date and sum month + day, modulo 12 to pick a natal aura
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate(); // 1-31
  const index = (month + day) % 12;
  return AURA_COLORS[index];
}
