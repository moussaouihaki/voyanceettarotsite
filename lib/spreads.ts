export interface Spread {
  id: string;
  name: string;
  subtitle: string;
  cardCount: number;
  category: SpreadCategory;
  difficulty: "facile" | "intermédiaire" | "avancé";
  positions: string[];
  description: string;
  emoji: string;
  popular?: boolean;
}

export type SpreadCategory =
  | "quotidien"
  | "temporel"
  | "amour"
  | "professionnel"
  | "spirituel"
  | "classique"
  | "special";

export const SPREAD_CATEGORIES: Record<SpreadCategory, { label: string; emoji: string; color: string }> = {
  quotidien:     { label: "Quotidien",     emoji: "☀️",  color: "amber" },
  temporel:      { label: "Temporel",      emoji: "⏳",  color: "blue" },
  amour:         { label: "Amour",         emoji: "💕",  color: "pink" },
  professionnel: { label: "Professionnel", emoji: "💼",  color: "green" },
  spirituel:     { label: "Spirituel",     emoji: "✨",  color: "violet" },
  classique:     { label: "Classique",     emoji: "🃏",  color: "purple" },
  special:       { label: "Spécial",       emoji: "🌟",  color: "gold" },
};

export const ALL_SPREADS: Spread[] = [
  // ─── QUOTIDIEN ───────────────────────────────────────────────────────────────
  {
    id: "carte-du-jour", name: "Carte du Jour", subtitle: "Guidance quotidienne",
    cardCount: 1, category: "quotidien", difficulty: "facile", emoji: "☀️", popular: true,
    positions: ["Message du jour"],
    description: "Une seule carte pour vous guider tout au long de cette journée.",
  },
  {
    id: "oui-non", name: "Tirage Oui / Non", subtitle: "Réponse directe",
    cardCount: 1, category: "quotidien", difficulty: "facile", emoji: "🎯",
    positions: ["La réponse"],
    description: "Une carte pour obtenir une réponse claire et directe à votre question.",
  },
  {
    id: "carte-semaine", name: "Carte de la Semaine", subtitle: "Thème de la semaine",
    cardCount: 1, category: "quotidien", difficulty: "facile", emoji: "📅",
    positions: ["Énergie de la semaine"],
    description: "L'énergie dominante et le thème principal de votre semaine à venir.",
  },
  {
    id: "carte-mois", name: "Carte du Mois", subtitle: "Intention mensuelle",
    cardCount: 1, category: "quotidien", difficulty: "facile", emoji: "🌙",
    positions: ["Énergie du mois"],
    description: "La carte maîtresse qui guide votre mois entier.",
  },
  {
    id: "matin-midi-soir", name: "Matin / Midi / Soir", subtitle: "Guide pour la journée",
    cardCount: 3, category: "quotidien", difficulty: "facile", emoji: "🌅",
    positions: ["Énergie du matin", "Énergie de l'après-midi", "Énergie du soir"],
    description: "Trois cartes pour traverser votre journée en conscience.",
  },
  {
    id: "meditation-jour", name: "Méditation du Jour", subtitle: "Introspection quotidienne",
    cardCount: 1, category: "quotidien", difficulty: "facile", emoji: "🧘",
    positions: ["Sujet de méditation"],
    description: "Une carte comme point de départ pour votre pratique méditative.",
  },

  // ─── TEMPOREL ────────────────────────────────────────────────────────────────
  {
    id: "passe-present-futur", name: "Passé / Présent / Futur", subtitle: "Lecture temporelle classique",
    cardCount: 3, category: "temporel", difficulty: "facile", emoji: "⏳", popular: true,
    positions: ["Passé", "Présent", "Futur"],
    description: "Le tirage classique par excellence. Comprenez votre trajectoire temporelle.",
  },
  {
    id: "passe-present-potentiel", name: "Passé / Présent / Potentiel", subtitle: "Évolution personnelle",
    cardCount: 3, category: "temporel", difficulty: "facile", emoji: "🌱",
    positions: ["Ce qui a été", "Ce qui est", "Ce qui pourrait être"],
    description: "Différent du futur figé : le potentiel représente ce que vous pouvez manifester.",
  },
  {
    id: "annuel-13", name: "Tirage de l'An Prochain", subtitle: "Prévisions 12 mois + carte maîtresse",
    cardCount: 13, category: "temporel", difficulty: "avancé", emoji: "📆", popular: true,
    positions: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", "Carte Maîtresse de l'année"],
    description: "Un aperçu complet de l'année à venir, mois par mois, avec une synthèse annuelle.",
  },
  {
    id: "annuel-10", name: "Tirage des 10 Prochains Mois", subtitle: "Vision à moyen terme",
    cardCount: 10, category: "temporel", difficulty: "intermédiaire", emoji: "🗓️",
    positions: ["Mois 1", "Mois 2", "Mois 3", "Mois 4", "Mois 5", "Mois 6", "Mois 7", "Mois 8", "Mois 9", "Mois 10"],
    description: "Planifiez votre avenir sur les 10 prochains mois avec clarté.",
  },
  {
    id: "semaine-5", name: "Tirage de la Semaine", subtitle: "Lundi au vendredi",
    cardCount: 5, category: "temporel", difficulty: "facile", emoji: "📋",
    positions: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    description: "Une carte pour chaque jour ouvrable — anticipez les énergies de la semaine.",
  },
  {
    id: "avant-hier-demain", name: "Avant-hier / Hier / Aujourd'hui / Demain", subtitle: "Flux temporel",
    cardCount: 4, category: "temporel", difficulty: "facile", emoji: "🔄",
    positions: ["Avant-hier", "Hier", "Aujourd'hui", "Demain"],
    description: "Observez le flux d'énergie sur 4 jours consécutifs.",
  },
  {
    id: "saisons", name: "Tirage des 4 Saisons", subtitle: "Rythmes annuels",
    cardCount: 4, category: "temporel", difficulty: "intermédiaire", emoji: "🍂",
    positions: ["Printemps", "Été", "Automne", "Hiver"],
    description: "L'énergie de chaque saison pour vous aligner sur les cycles naturels.",
  },

  // ─── AMOUR ───────────────────────────────────────────────────────────────────
  {
    id: "toi-moi-relation", name: "Toi / Moi / La Relation", subtitle: "Dynamique du couple",
    cardCount: 3, category: "amour", difficulty: "facile", emoji: "💑", popular: true,
    positions: ["Vous", "L'autre personne", "La relation entre vous"],
    description: "Comprenez la dynamique de votre relation sous trois angles.",
  },
  {
    id: "amour-6", name: "Tirage Amour Complet", subtitle: "Relation approfondie",
    cardCount: 6, category: "amour", difficulty: "intermédiaire", emoji: "❤️", popular: true,
    positions: ["Vous dans la relation", "L'autre personne", "Le passé de la relation", "Le présent", "Les obstacles", "L'avenir"],
    description: "Un regard complet sur votre histoire amoureuse et son potentiel.",
  },
  {
    id: "flamme-jumelle", name: "Flamme Jumelle", subtitle: "Connexion spirituelle profonde",
    cardCount: 7, category: "amour", difficulty: "avancé", emoji: "🔥",
    positions: ["Votre énergie", "Son énergie", "La connexion entre vous", "Les obstacles", "La leçon karmique", "L'étape suivante", "Le potentiel final"],
    description: "Explorez la profondeur d'une connexion d'âme unique.",
  },
  {
    id: "retour-affection", name: "Retour d'Affection", subtitle: "Réconciliation possible ?",
    cardCount: 6, category: "amour", difficulty: "intermédiaire", emoji: "🕊️",
    positions: ["L'état actuel de la relation", "Ses sentiments pour vous", "Vos sentiments pour lui/elle", "Ce qui bloque le retour", "Ce qui favorise le retour", "Issue probable"],
    description: "Éclairez les chances d'un retour ou d'une réconciliation.",
  },
  {
    id: "rencontrer-amour", name: "Quand vais-je rencontrer l'amour ?", subtitle: "L'amour à venir",
    cardCount: 5, category: "amour", difficulty: "intermédiaire", emoji: "💘",
    positions: ["Votre énergie actuelle", "Ce qui vous bloque", "Ce que l'univers prépare", "Quand / Dans quel contexte", "Le conseil"],
    description: "Découvrez ce que les astres préparent pour votre vie amoureuse.",
  },
  {
    id: "compatibilite", name: "Compatibilité", subtitle: "Êtes-vous faits l'un pour l'autre ?",
    cardCount: 7, category: "amour", difficulty: "intermédiaire", emoji: "⚡",
    positions: ["Vos forces", "Vos faiblesses", "Ses forces", "Ses faiblesses", "Vos atouts en couple", "Vos défis en couple", "La synthèse"],
    description: "Analysez la compatibilité réelle entre deux personnes.",
  },
  {
    id: "guerison-coeur", name: "Guérison du Cœur", subtitle: "Traverser une rupture",
    cardCount: 6, category: "amour", difficulty: "intermédiaire", emoji: "💔",
    positions: ["Ce que vous ressentez", "Ce que vous devez lâcher", "Ce que vous devez garder", "La leçon de cette relation", "Comment guérir", "Ce qui vous attend"],
    description: "Trouvez la paix et le chemin vers la guérison après une séparation.",
  },

  // ─── PROFESSIONNEL ───────────────────────────────────────────────────────────
  {
    id: "carriere-5", name: "Tirage Professionnel", subtitle: "Carrière & travail",
    cardCount: 5, category: "professionnel", difficulty: "intermédiaire", emoji: "💼", popular: true,
    positions: ["Situation actuelle au travail", "Vos talents et atouts", "Les obstacles", "Ce que vous devez faire", "L'évolution probable"],
    description: "Un regard lucide sur votre situation professionnelle et vos options.",
  },
  {
    id: "decision-carriere", name: "Décision de Carrière", subtitle: "Changer de voie ?",
    cardCount: 5, category: "professionnel", difficulty: "intermédiaire", emoji: "🔀",
    positions: ["Votre situation actuelle", "Ce que vous quittez", "Ce qui vous attend", "Les risques", "Le conseil des cartes"],
    description: "Prenez votre décision de carrière avec clarté et confiance.",
  },
  {
    id: "entreprise", name: "Création d'Entreprise", subtitle: "Mon projet va-t-il réussir ?",
    cardCount: 7, category: "professionnel", difficulty: "avancé", emoji: "🚀",
    positions: ["Le fondement de votre projet", "Vos forces", "Les obstacles à anticiper", "Les ressources disponibles", "L'énergie du marché", "Les partenariats potentiels", "Le potentiel de succès"],
    description: "Évaluez votre projet entrepreneurial sous tous les angles.",
  },
  {
    id: "finances", name: "Tirage Financier", subtitle: "Argent & abondance",
    cardCount: 5, category: "professionnel", difficulty: "intermédiaire", emoji: "💰",
    positions: ["Votre rapport à l'argent", "Ce qui bloque votre abondance", "Les opportunités financières", "Les risques", "Le conseil pour prospérer"],
    description: "Comprenez votre rapport à l'argent et les clés de votre prospérité.",
  },
  {
    id: "conflit-travail", name: "Conflit au Travail", subtitle: "Résoudre une tension",
    cardCount: 5, category: "professionnel", difficulty: "intermédiaire", emoji: "⚖️",
    positions: ["La racine du conflit", "Votre rôle", "Le rôle de l'autre", "Ce qui peut résoudre", "Le résultat si vous agissez"],
    description: "Naviguez avec sagesse un conflit professionnel difficile.",
  },

  // ─── SPIRITUEL ───────────────────────────────────────────────────────────────

  {
    id: "mission-ame", name: "Mission de l'Âme", subtitle: "Votre chemin de vie",
    cardCount: 5, category: "spirituel", difficulty: "avancé", emoji: "⭐",
    positions: ["Votre essence spirituelle", "Vos dons innés", "Votre mission sur Terre", "Les obstacles karmiques", "Le premier pas à faire"],
    description: "Découvrez pourquoi votre âme a choisi cette vie.",
  },
  {
    id: "chakras-7", name: "Tirage des 7 Chakras", subtitle: "Bilan énergétique complet",
    cardCount: 7, category: "spirituel", difficulty: "intermédiaire", emoji: "🌈",
    positions: ["Chakra Racine — Sécurité", "Chakra Sacré — Créativité", "Chakra Plexus — Pouvoir", "Chakra Cœur — Amour", "Chakra Gorge — Expression", "Chakra 3e Œil — Intuition", "Chakra Couronne — Connexion divine"],
    description: "Évaluez l'état de chacun de vos 7 chakras.",
  },

  {
    id: "karma", name: "Tirage Karmique", subtitle: "Dette & leçons de vie",
    cardCount: 5, category: "spirituel", difficulty: "avancé", emoji: "♾️",
    positions: ["La dette karmique à solder", "Pourquoi cette leçon revient", "Ce que vous avez appris", "Ce qu'il reste à apprendre", "La libération karmique"],
    description: "Explorez les patterns karmiques qui influencent votre vie actuelle.",
  },
  {
    id: "guerison-interieure", name: "Guérison Intérieure", subtitle: "Libérer les blessures",
    cardCount: 6, category: "spirituel", difficulty: "avancé", emoji: "💜",
    positions: ["La blessure principale", "Son origine", "Comment elle se protège", "Ce dont elle a besoin", "Le chemin de guérison", "Votre être guéri"],
    description: "Un voyage vers la guérison de vos blessures profondes.",
  },
  {
    id: "manifestation", name: "Tirage de Manifestation", subtitle: "Loi d'attraction",
    cardCount: 5, category: "spirituel", difficulty: "intermédiaire", emoji: "✨",
    positions: ["Ce que vous désirez manifester", "Votre alignement actuel", "Ce qui bloque la manifestation", "L'action co-créatrice", "Ce que l'Univers prépare"],
    description: "Alignez-vous avec la loi d'attraction pour manifester vos désirs.",
  },
  {
    id: "naissance", name: "Tirage de Naissance", subtitle: "Talents & mission innés",
    cardCount: 3, category: "spirituel", difficulty: "intermédiaire", emoji: "🌟",
    positions: ["Vos dons naturels", "Vos défis de vie", "Votre mission principale"],
    description: "Découvrez ce que votre âme a apporté en naissant.",
  },

  // ─── CLASSIQUE ───────────────────────────────────────────────────────────────
  {
    id: "croix-celtique", name: "Croix Celtique", subtitle: "Le grand classique universel",
    cardCount: 10, category: "classique", difficulty: "avancé", emoji: "✝️", popular: true,
    positions: ["Situation actuelle", "Ce qui vous traverse / l'obstacle", "Racine / Fondation", "Passé récent", "Couronnement / Idéal visé", "Futur proche", "Vous-même", "Votre environnement", "Espoirs & Craintes", "Résultat final"],
    description: "Le tirage le plus complet et le plus utilisé dans le monde entier.",
  },
  {
    id: "fer-a-cheval", name: "Fer à Cheval", subtitle: "Lecture à 7 cartes",
    cardCount: 7, category: "classique", difficulty: "intermédiaire", emoji: "🧲",
    positions: ["Passé lointain", "Passé récent", "Présent", "Avenir proche", "Influences extérieures", "Espoirs & obstacles", "Résultat probable"],
    description: "Un tirage traditionnel en forme de fer à cheval, porteur de chance.",
  },
  {
    id: "arbre-vie", name: "Arbre de Vie", subtitle: "Les 10 sephiroth kabbalistiques",
    cardCount: 10, category: "classique", difficulty: "avancé", emoji: "🌳",
    positions: ["Kether — La Couronne / Divine", "Chokhmah — Sagesse", "Binah — Compréhension", "Chesed — Miséricorde", "Geburah — Rigueur", "Tiphareth — Beauté", "Netzach — Victoire", "Hod — Splendeur", "Yesod — Fondement", "Malkuth — Le Royaume / Manifestation"],
    description: "Basé sur la Kabbale, ce tirage relie les 10 sphères de l'arbre de vie.",
  },
  {
    id: "pyramide", name: "Tirage de la Pyramide", subtitle: "Des fondations au sommet",
    cardCount: 10, category: "classique", difficulty: "avancé", emoji: "🔺",
    positions: ["Fondation 1", "Fondation 2", "Fondation 3", "Fondation 4", "Niveau 2-A", "Niveau 2-B", "Niveau 2-C", "Niveau 3-A", "Niveau 3-B", "Le sommet"],
    description: "De la base au sommet, explorez votre ascension personnelle.",
  },
  {
    id: "croix-simple", name: "Croix Simple", subtitle: "5 cartes en croix",
    cardCount: 5, category: "classique", difficulty: "intermédiaire", emoji: "✚",
    positions: ["Centre — La situation", "Nord — Passé / Ce qui aide", "Est — Futur / Vers où vous allez", "Sud — Fondation / Racines", "Ouest — Conseil / Sage"],
    description: "La croix à cinq branches, lecture équilibrée de votre situation.",
  },
  {
    id: "romany", name: "Tirage Romany", subtitle: "Tradition gitane",
    cardCount: 21, category: "classique", difficulty: "avancé", emoji: "🎪",
    positions: [
      "Vous (passé 1)", "Vous (passé 2)", "Vous (passé 3)",
      "Foyer (présent 1)", "Foyer (présent 2)", "Foyer (présent 3)",
      "Attentes (présent 4)", "Attentes (présent 5)", "Attentes (présent 6)",
      "Surprise (inattendu 1)", "Surprise (inattendu 2)", "Surprise (inattendu 3)",
      "Avenir proche 1", "Avenir proche 2", "Avenir proche 3",
      "Avenir lointain 1", "Avenir lointain 2", "Avenir lointain 3",
      "Résultat 1", "Résultat 2", "Synthèse"
    ],
    description: "L'immense tirage de la tradition gitane — 21 cartes pour une lecture globale.",
  },

  // ─── SPÉCIAL ─────────────────────────────────────────────────────────────────
  {
    id: "astrologique-12", name: "Tirage Astrologique", subtitle: "Les 12 maisons",
    cardCount: 12, category: "special", difficulty: "avancé", emoji: "♈", popular: true,
    positions: [
      "Maison 1 — Identité & Soi", "Maison 2 — Argent & Valeurs",
      "Maison 3 — Communication", "Maison 4 — Foyer & Famille",
      "Maison 5 — Créativité & Amour", "Maison 6 — Santé & Travail",
      "Maison 7 — Partenariats", "Maison 8 — Transformation",
      "Maison 9 — Voyages & Philosophie", "Maison 10 — Carrière",
      "Maison 11 — Amis & Idéaux", "Maison 12 — Karma & Inconscient",
    ],
    description: "Une carte par maison astrologique pour un portrait de vie complet.",
  },
  {
    id: "elements-4", name: "Tirage des 4 Éléments", subtitle: "Feu, Terre, Air, Eau",
    cardCount: 4, category: "special", difficulty: "facile", emoji: "🌊",
    positions: ["Feu — Passion & énergie", "Terre — Matériel & ancrage", "Air — Intellect & communication", "Eau — Émotions & intuition"],
    description: "Évaluez l'équilibre des 4 éléments dans votre vie.",
  },
  {
    id: "mandala-9", name: "Tirage Mandala", subtitle: "Cercle de vie & équilibre",
    cardCount: 9, category: "special", difficulty: "avancé", emoji: "🔯",
    positions: ["Centre — Votre essence", "Est — Ce qui commence", "Sud-Est — Ce qui grandit", "Sud — Ce qui fleurit", "Sud-Ouest — Ce qui décline", "Ouest — Ce qui se termine", "Nord-Ouest — Ce qui se transforme", "Nord — Ce qui se renouvelle", "Nord-Est — Ce qui émerge"],
    description: "Un mandala vivant de votre situation sous forme de roue circulaire.",
  },
  {
    id: "decision-v", name: "Tirage en V — Décision", subtitle: "Entre deux options",
    cardCount: 5, category: "special", difficulty: "intermédiaire", emoji: "🔀",
    positions: ["Option A — Ce qu'elle vous apporte", "Option A — Ses risques", "Option B — Ce qu'elle vous apporte", "Option B — Ses risques", "Conseil de la sagesse"],
    description: "Face à un choix difficile, les cartes éclairent les deux voies possibles.",
  },
  {
    id: "sante", name: "Tirage de la Santé", subtitle: "Bien-être holistique",
    cardCount: 5, category: "special", difficulty: "intermédiaire", emoji: "🌿",
    positions: ["Corps physique", "Corps émotionnel", "Corps mental", "Corps spirituel", "Conseil global"],
    description: "Un bilan complet de votre bien-être sur les 4 dimensions.",
  },
  {
    id: "corps-ame-esprit", name: "Corps / Âme / Esprit", subtitle: "Triptyque holistique",
    cardCount: 3, category: "special", difficulty: "facile", emoji: "🧠",
    positions: ["Le Corps — Vitalité & santé", "L'Âme — Émotions & relations", "L'Esprit — Mental & connexion"],
    description: "Équilibrez les trois dimensions de votre être.",
  },
  {
    id: "hexagramme", name: "Hexagramme", subtitle: "6 domaines de vie",
    cardCount: 6, category: "special", difficulty: "intermédiaire", emoji: "✡️",
    positions: ["Amour", "Travail", "Argent", "Santé", "Famille", "Développement personnel"],
    description: "Un regard simultané sur les 6 grands domaines de votre existence.",
  },
  {
    id: "numérologique", name: "Tirage Numérologique", subtitle: "Tarot + numérologie combinés",
    cardCount: 9, category: "special", difficulty: "avancé", emoji: "🔢",
    positions: ["1 — Volonté", "2 — Dualité", "3 — Créativité", "4 — Stabilité", "5 — Changement", "6 — Harmonie", "7 — Spiritualité", "8 — Pouvoir", "9 — Accomplissement"],
    description: "Chaque position correspond à un vibration numérique de 1 à 9.",
  },
  {
    id: "anniversaire", name: "Tirage d'Anniversaire", subtitle: "L'année à venir",
    cardCount: 7, category: "special", difficulty: "intermédiaire", emoji: "🎂",
    positions: ["Le thème de votre nouvelle année", "Ce que vous avez accompli", "Ce que vous laissez derrière", "Le défi principal", "Le cadeau de cette année", "L'action prioritaire", "La promesse de l'univers"],
    description: "Consultez les cartes pour votre anniversaire et la nouvelle année de vie.",
  },
  {
    id: "signes-zodiaque", name: "Tirage des Signes du Zodiaque", subtitle: "12 énergies astrologiques",
    cardCount: 12, category: "special", difficulty: "avancé", emoji: "♋",
    positions: ["Bélier — Initiative", "Taureau — Ressources", "Gémeaux — Curiosité", "Cancer — Émotions", "Lion — Expression", "Vierge — Service", "Balance — Équilibre", "Scorpion — Transformation", "Sagittaire — Vision", "Capricorne — Ambition", "Verseau — Innovation", "Poissons — Spiritualité"],
    description: "Explorez votre relation avec chacune des 12 énergies zodiacales.",
  },
  {
    id: "intention-manifestation", name: "Manifestation & Intention", subtitle: "Co-créer avec l'Univers",
    cardCount: 5, category: "special", difficulty: "intermédiaire", emoji: "🌠",
    positions: ["L'intention claire", "Votre alignement", "Ce que l'Univers répond", "L'action à prendre", "Ce qui sera manifesté"],
    description: "Activez la loi de l'attraction et co-créez votre réalité.",
  },
  {
    id: "etoile-6", name: "Tirage de l'Étoile", subtitle: "Étoile à 6 branches",
    cardCount: 7, category: "special", difficulty: "intermédiaire", emoji: "⭐",
    positions: ["Centre — Vous aujourd'hui", "Nord — Le passé", "Nord-Est — L'avenir", "Sud-Est — Vos espoirs", "Sud — Ce qui est caché", "Sud-Ouest — Ce qui vous aide", "Nord-Ouest — Le résultat"],
    description: "Un tirage en forme d'étoile à 6 branches + centre — beauté et harmonie.",
  },
  {
    id: "yes-no-advanced", name: "Oui / Non Avancé", subtitle: "Avec nuances et contexte",
    cardCount: 3, category: "special", difficulty: "facile", emoji: "🎯",
    positions: ["La réponse principale (Oui/Non)", "Ce qui influence cette réponse", "Le conseil si la réponse ne vous convient pas"],
    description: "Une réponse directe accompagnée de contexte et de conseil.",
  },

  // ─── NOUVEAUX TIRAGES ────────────────────────────────────────────────────────
  {
    id: "shadow-work",
    name: "Shadow Work — Travail de l'Ombre",
    subtitle: "Introspection psychologique profonde",
    cardCount: 7,
    category: "spirituel",
    difficulty: "avancé",
    emoji: "🌑",
    positions: [
      "Ce que je me cache à moi-même",
      "La blessure originelle",
      "Comment l'ombre se manifeste dans ma vie",
      "Ce que l'ombre cherche à me dire",
      "La peur derrière la résistance",
      "Le don caché dans l'ombre",
      "L'intégration — comment avancer",
    ],
    description: "Plongez dans les profondeurs de votre psyché pour révéler, accueillir et intégrer vos parts cachées.",
  },
  {
    id: "no-contact",
    name: "Tirage No Contact",
    subtitle: "Ce qui se passe de son côté",
    cardCount: 5,
    category: "amour",
    difficulty: "intermédiaire",
    emoji: "📵",
    popular: true,
    positions: [
      "Ce qu'il/elle ressent en ce moment",
      "Ce à quoi il/elle pense",
      "Ses regrets ou ce qui le/la retient",
      "L'énergie entre vous deux maintenant",
      "La probabilité d'un retour ou d'un contact",
    ],
    description: "Quand le silence parle. Découvrez l'état émotionnel et les pensées de cette personne.",
  },
  {
    id: "karma-amour",
    name: "Connexion Karmique",
    subtitle: "Liens d'âme et vies antérieures",
    cardCount: 6,
    category: "amour",
    difficulty: "avancé",
    emoji: "♾️",
    positions: [
      "Le lien karmique — nature de la connexion",
      "La leçon de vie partagée",
      "Ce que vous devez lui apprendre",
      "Ce qu'il/elle doit vous apprendre",
      "La dette ou le don karmique",
      "Le destin de cette relation dans cette vie",
    ],
    description: "Explorez les fils invisibles qui vous lient à une âme à travers les vies.",
  },
  {
    id: "lundi-intention",
    name: "Intention de la Semaine",
    subtitle: "Poser l'intention le lundi",
    cardCount: 3,
    category: "quotidien",
    difficulty: "facile",
    emoji: "🌅",
    positions: [
      "L'énergie qui vous porte cette semaine",
      "Le défi à surmonter",
      "L'intention à ancrer",
    ],
    description: "Commencez chaque semaine avec clarté — posez votre intention et recevez un message d'encouragement.",
  },
  {
    id: "pleine-lune",
    name: "Tirage Pleine Lune",
    subtitle: "Libérer et manifester",
    cardCount: 5,
    category: "spirituel",
    difficulty: "intermédiaire",
    emoji: "🌕",
    popular: true,
    positions: [
      "Ce qui arrive à maturité — la révélation",
      "Ce qu'il est temps de lâcher",
      "L'émotion à honorer",
      "Ce que la Lune illumine dans votre vie",
      "La grâce à recevoir",
    ],
    description: "La pleine lune révèle les vérités cachées. Un tirage pour honorer les accomplissements et libérer ce qui ne sert plus.",
  },
  {
    id: "nouvelle-lune",
    name: "Tirage Nouvelle Lune",
    subtitle: "Planter les graines du futur",
    cardCount: 4,
    category: "spirituel",
    difficulty: "facile",
    emoji: "🌑",
    positions: [
      "Le nouveau cycle qui s'ouvre",
      "L'intention à planter",
      "Ce qui doit mourir pour que cela naisse",
      "La promesse de l'Univers",
    ],
    description: "La nouvelle lune est le moment idéal pour planter de nouvelles intentions et initier des cycles.",
  },
];

export function getSpreadById(id: string): Spread | undefined {
  return ALL_SPREADS.find((s) => s.id === id);
}

export function getSpreadsByCategory(cat: SpreadCategory): Spread[] {
  return ALL_SPREADS.filter((s) => s.category === cat);
}

export function getPopularSpreads(): Spread[] {
  return ALL_SPREADS.filter((s) => s.popular);
}
