export interface Chakra {
  id: string;
  number: number;
  name: string;
  nameSanskrit: string;
  color: string;
  emoji: string;
  element: string;
  mantra: string;
  location: string;
  keywords: string[];
  balanced: string;
  imbalanced: string;
  crystals: string[];
  essentialOils: string[];
  affirmation: string;
  yogaPose: string;
  questions: string[];
}

export const CHAKRAS: Chakra[] = [
  {
    id: "racine", number: 1, name: "Chakra Racine", nameSanskrit: "Mūlādhāra",
    color: "#dc2626", emoji: "🔴", element: "Terre", mantra: "LAM",
    location: "Base de la colonne vertébrale, périnée",
    keywords: ["sécurité", "ancrage", "survie", "instinct", "stabilité", "matière"],
    balanced: "Sentiment de sécurité, ancrage dans le présent, stabilité financière et émotionnelle.",
    imbalanced: "Peurs existentielles, problèmes financiers, manque d'ancrage, douleurs lombaires.",
    crystals: ["Obsidienne", "Hématite", "Grenat", "Tourmaline noire", "Jaspe rouge"],
    essentialOils: ["Cèdre", "Vétiver", "Patchouli", "Santal"],
    affirmation: "Je suis ancré(e), en sécurité et pleinement présent(e) dans mon corps.",
    yogaPose: "Virabhadrasana I (Guerrier I) — Balasana (Enfant)",
    questions: [
      "Vous sentez-vous souvent anxieux ou instable sans raison apparente ?",
      "Avez-vous des difficultés financières récurrentes ?",
      "Avez-vous du mal à rester ancré dans le moment présent ?",
      "Ressentez-vous fréquemment des douleurs dans le bas du dos ?",
      "Avez-vous peur de manquer de ressources essentielles ?",
    ],
  },
  {
    id: "sacre", number: 2, name: "Chakra Sacré", nameSanskrit: "Svādhiṣṭhāna",
    color: "#ea580c", emoji: "🟠", element: "Eau", mantra: "VAM",
    location: "Bas-ventre, 5 cm sous le nombril",
    keywords: ["créativité", "sexualité", "émotions", "plaisir", "flux", "relations"],
    balanced: "Créativité épanouie, émotions fluides, plaisir sain, relations équilibrées.",
    imbalanced: "Blocages créatifs, frigidité ou hypersexualité, émotions réprimées, problèmes reproductifs.",
    crystals: ["Cornaline", "Pierre de lune", "Pierre de soleil", "Calcite orange"],
    essentialOils: ["Ylang-ylang", "Orange douce", "Jasmin", "Néroli"],
    affirmation: "Je célèbre ma créativité et mes émotions avec fluidité et joie.",
    yogaPose: "Baddha Konasana (Papillon) — Gomukhasana (Vache)",
    questions: [
      "Avez-vous du mal à vous autoriser le plaisir et la joie ?",
      "Ressentez-vous des blocages dans votre créativité ?",
      "Avez-vous du mal à exprimer vos émotions librement ?",
      "Vos relations sentimentales sont-elles souvent compliquées ?",
      "Vous sentez-vous coupable de prendre soin de vous ?",
    ],
  },
  {
    id: "plexus", number: 3, name: "Chakra Plexus Solaire", nameSanskrit: "Maṇipūra",
    color: "#ca8a04", emoji: "🟡", element: "Feu", mantra: "RAM",
    location: "Plexus solaire, entre nombril et sternum",
    keywords: ["pouvoir personnel", "volonté", "confiance", "identité", "transformation", "courage"],
    balanced: "Confiance en soi, fort sens de l'identité, volonté claire, prise de décision facile.",
    imbalanced: "Manque de confiance, besoin de contrôle excessif, problèmes digestifs, peur du jugement.",
    crystals: ["Citrine", "Oeil de tigre", "Ambre", "Pyrite", "Calcite jaune"],
    essentialOils: ["Romarin", "Genévrier", "Citron", "Bergamote"],
    affirmation: "Je suis confiant(e) dans mon pouvoir et j'agis avec courage et authenticité.",
    yogaPose: "Navasana (Bateau) — Ardha Matsyendrasana (Torsion)",
    questions: [
      "Avez-vous souvent du mal à prendre des décisions ?",
      "Manquez-vous de confiance en vous dans vos actions ?",
      "Avez-vous des problèmes digestifs récurrents ?",
      "Avez-vous peur d'être jugé(e) ou de décevoir les autres ?",
      "Vous sentez-vous souvent victime des circonstances ?",
    ],
  },
  {
    id: "coeur", number: 4, name: "Chakra Cœur", nameSanskrit: "Anāhata",
    color: "#16a34a", emoji: "💚", element: "Air", mantra: "YAM",
    location: "Centre de la poitrine, au niveau du cœur",
    keywords: ["amour", "compassion", "guérison", "connexion", "pardon", "équilibre"],
    balanced: "Amour inconditionnel, compassion naturelle, capacité à pardonner, relations épanouies.",
    imbalanced: "Rancœur, peur de l'amour, manque d'empathie, problèmes cardiaques et respiratoires.",
    crystals: ["Quartz rose", "Aventurine verte", "Rhodonite", "Malachite", "Amazonite"],
    essentialOils: ["Rose", "Géranium", "Bergamote", "Néroli", "Ylang-ylang"],
    affirmation: "Je m'ouvre à l'amour inconditionnel et je pardonne avec compassion.",
    yogaPose: "Ustrasana (Chameau) — Bhujangasana (Cobra)",
    questions: [
      "Avez-vous du mal à vous ouvrir aux autres de peur d'être blessé(e) ?",
      "Portez-vous encore des rancœurs ou des blessures anciennes ?",
      "Avez-vous du mal à vous aimer vous-même ?",
      "Ressentez-vous de la difficulté à pardonner ?",
      "Avez-vous des tensions dans la poitrine ou des problèmes respiratoires ?",
    ],
  },
  {
    id: "gorge", number: 5, name: "Chakra Gorge", nameSanskrit: "Viśuddha",
    color: "#0284c7", emoji: "🔵", element: "Éther/Son", mantra: "HAM",
    location: "Gorge, cou, mâchoire",
    keywords: ["communication", "expression", "vérité", "authenticité", "écoute", "créativité verbale"],
    balanced: "Expression authentique, communication claire, capacité d'écoute profonde, créativité verbale.",
    imbalanced: "Difficulté à s'exprimer, mensonges fréquents, problèmes de gorge et de thyroïde.",
    crystals: ["Turquoise", "Aigue-marine", "Lapis-lazuli", "Sodalite", "Célestite"],
    essentialOils: ["Menthe poivrée", "Eucalyptus", "Tea tree", "Camomille"],
    affirmation: "J'exprime ma vérité avec clarté, confiance et bienveillance.",
    yogaPose: "Matsyasana (Poisson) — Sarvangasana (Bougie)",
    questions: [
      "Avez-vous du mal à exprimer ce que vous ressentez vraiment ?",
      "Vous sentez-vous souvent incompris(e) ?",
      "Avez-vous tendance à mentir ou à éviter les confrontations ?",
      "Souffrez-vous souvent de problèmes de gorge ou de thyroïde ?",
      "Avez-vous peur de dire non ou d'affirmer votre opinion ?",
    ],
  },
  {
    id: "troisieme-oeil", number: 6, name: "Chakra Troisième Œil", nameSanskrit: "Ājñā",
    color: "#4f46e5", emoji: "🔮", element: "Lumière", mantra: "OM",
    location: "Entre les deux sourcils, front",
    keywords: ["intuition", "clairvoyance", "sagesse", "perception", "imagination", "conscience"],
    balanced: "Intuition aiguisée, clarté mentale, capacité de visualisation, discernement sage.",
    imbalanced: "Maux de tête, cauchemars, difficulté à faire confiance à son intuition, pensée rigide.",
    crystals: ["Améthyste", "Sodalite", "Labradorite", "Fluorite", "Azurite"],
    essentialOils: ["Lavande", "Clary sage", "Frankincense", "Romarin"],
    affirmation: "Je fais confiance à mon intuition et à ma sagesse intérieure.",
    yogaPose: "Balasana (Enfant) — Adho Mukha Svanasana (Chien tête en bas)",
    questions: [
      "Avez-vous du mal à faire confiance à votre instinct ?",
      "Souffrez-vous souvent de maux de tête ou de migraines ?",
      "Avez-vous du mal à imaginer ou visualiser vos objectifs ?",
      "Vous sentez-vous déconnecté(e) de votre sens intuitif ?",
      "Avez-vous des troubles du sommeil ou des cauchemars fréquents ?",
    ],
  },
  {
    id: "couronne", number: 7, name: "Chakra Couronne", nameSanskrit: "Sahasrāra",
    color: "#7c3aed", emoji: "👑", element: "Conscience", mantra: "AH",
    location: "Sommet du crâne, fontanelle",
    keywords: ["connexion divine", "illumination", "unité", "sagesse universelle", "transcendance", "éveil"],
    balanced: "Connexion profonde au divin, sentiment d'unité, sérénité, accès à la sagesse universelle.",
    imbalanced: "Sentiment d'isolement spirituel, dogmatisme, dépression existentielle, déconnexion.",
    crystals: ["Cristal de roche", "Améthyste blanche", "Séléite", "Charoïte", "Pierre de lune"],
    essentialOils: ["Frankincense", "Myrrhe", "Lotus", "Santal blanc"],
    affirmation: "Je suis connecté(e) à la sagesse divine et je fais confiance au plan de l'univers.",
    yogaPose: "Savasana (Cadavre) — Sirsasana (Poirier)",
    questions: [
      "Vous sentez-vous déconnecté(e) d'une puissance supérieure ou de votre spiritualité ?",
      "Avez-vous un sentiment de solitude existentielle profonde ?",
      "Avez-vous du mal à trouver un sens à votre vie ?",
      "Souffrez-vous de dépression existentielle ou de vide intérieur ?",
      "Avez-vous du mal à méditer ou à accéder à des états de paix profonde ?",
    ],
  },
];

export function evaluateChakras(answers: Record<string, number[]>): Record<string, number> {
  const scores: Record<string, number> = {};
  CHAKRAS.forEach((chakra) => {
    const chakraAnswers = answers[chakra.id] || [];
    const positiveCount = chakraAnswers.filter((a) => a === 1).length;
    const totalQuestions = chakra.questions.length;
    // Score from 0 (very blocked) to 100 (fully open)
    scores[chakra.id] = Math.round(((totalQuestions - positiveCount) / totalQuestions) * 100);
  });
  return scores;
}
