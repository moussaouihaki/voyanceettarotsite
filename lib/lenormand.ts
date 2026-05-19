export interface LenormandCard {
  id: string;
  number: number;
  name: string;
  symbol: string;
  keywords: string[];
  upright: string;
  combined: string;
}

// Traditional French Lenormand playing card correspondences
export const LENORMAND_PLAYING_CARDS: Record<number, { rank: string; suit: "♥" | "♦" | "♣" | "♠"; red: boolean }> = {
  1:  { rank: "9",  suit: "♥", red: true  },
  2:  { rank: "6",  suit: "♣", red: false },
  3:  { rank: "10", suit: "♠", red: false },
  4:  { rank: "R",  suit: "♥", red: true  },
  5:  { rank: "7",  suit: "♥", red: true  },
  6:  { rank: "R",  suit: "♣", red: false },
  7:  { rank: "D",  suit: "♣", red: false },
  8:  { rank: "9",  suit: "♣", red: false },
  9:  { rank: "D",  suit: "♠", red: false },
  10: { rank: "V",  suit: "♣", red: false },
  11: { rank: "V",  suit: "♦", red: true  },
  12: { rank: "7",  suit: "♠", red: false },
  13: { rank: "V",  suit: "♠", red: false },
  14: { rank: "9",  suit: "♠", red: false },
  15: { rank: "10", suit: "♣", red: false },
  16: { rank: "6",  suit: "♥", red: true  },
  17: { rank: "D",  suit: "♥", red: true  },
  18: { rank: "10", suit: "♥", red: true  },
  19: { rank: "6",  suit: "♠", red: false },
  20: { rank: "8",  suit: "♠", red: false },
  21: { rank: "8",  suit: "♣", red: false },
  22: { rank: "D",  suit: "♦", red: true  },
  23: { rank: "7",  suit: "♣", red: false },
  24: { rank: "V",  suit: "♥", red: true  },
  25: { rank: "A",  suit: "♣", red: false },
  26: { rank: "10", suit: "♦", red: true  },
  27: { rank: "7",  suit: "♦", red: true  },
  28: { rank: "A",  suit: "♥", red: true  },
  29: { rank: "A",  suit: "♠", red: false },
  30: { rank: "R",  suit: "♠", red: false },
  31: { rank: "A",  suit: "♦", red: true  },
  32: { rank: "8",  suit: "♥", red: true  },
  33: { rank: "8",  suit: "♦", red: true  },
  34: { rank: "R",  suit: "♦", red: true  },
  35: { rank: "9",  suit: "♦", red: true  },
  36: { rank: "6",  suit: "♦", red: true  },
};

export const LENORMAND_DECK: LenormandCard[] = [
  {
    id: "cavalier", number: 1, name: "Le Cavalier", symbol: "🐴",
    keywords: ["nouvelles", "vitesse", "jeunesse", "arrivée"],
    upright: "Un message ou visiteur arrive rapidement. De bonnes nouvelles sont en chemin, apportant énergie et dynamisme dans votre vie.",
    combined: "Amplifie la vitesse des cartes voisines ; annonce une arrivée ou un événement imminent.",
  },
  {
    id: "trefle", number: 2, name: "Le Trèfle", symbol: "🍀",
    keywords: ["chance", "espoir", "opportunité", "bonheur"],
    upright: "La chance vous sourit. Une petite mais agréable opportunité se présente, apportant joie et légèreté à votre quotidien.",
    combined: "Atténue les cartes négatives voisines ; renforce la chance et les petits bonheurs autour.",
  },
  {
    id: "navire", number: 3, name: "Le Navire", symbol: "🚢",
    keywords: ["voyage", "commerce", "départ", "lointain"],
    upright: "Un voyage ou déplacement important s'annonce. Le commerce et les affaires prospèrent, tournées vers l'horizon et l'étranger.",
    combined: "Introduit le mouvement et la distance avec les cartes adjacentes ; évoque transactions commerciales.",
  },
  {
    id: "maison", number: 4, name: "La Maison", symbol: "🏠",
    keywords: ["foyer", "famille", "sécurité", "propriété"],
    upright: "Le foyer et la famille sont au cœur du message. Stabilité, sécurité domestique et questions immobilières sont favorisées.",
    combined: "Ancre les cartes voisines dans la sphère domestique et familiale.",
  },
  {
    id: "arbre", number: 5, name: "L'Arbre", symbol: "🌲",
    keywords: ["santé", "croissance", "racines", "durée"],
    upright: "La santé et la vitalité sont mises en avant. Vos racines profondes vous soutiennent ; la croissance lente mais durable est promise.",
    combined: "Donne de la durée et de la profondeur aux thèmes des cartes voisines ; souvent lié à la santé.",
  },
  {
    id: "nuages", number: 6, name: "Les Nuages", symbol: "☁️",
    keywords: ["confusion", "doute", "incertitude", "obscurité"],
    upright: "Une période de confusion ou d'incertitude trouble votre vision. Des doutes assombrissent le tableau ; cherchez la clarté avant d'agir.",
    combined: "Obscurcit et complique les cartes voisines ; introduit flou et ambiguïté dans leur signification.",
  },
  {
    id: "serpent", number: 7, name: "Le Serpent", symbol: "🐍",
    keywords: ["ruse", "trahison", "désir", "complication"],
    upright: "Une rivale, une personne rusée ou une situation complexe apparaît. Le désir et la séduction jouent un rôle ; méfiance s'impose.",
    combined: "Apporte complication, rivalité ou désir aux cartes voisines ; souvent une tierce personne.",
  },
  {
    id: "cercueil", number: 8, name: "Le Cercueil", symbol: "⚰️",
    keywords: ["fin", "transformation", "perte", "renouveau"],
    upright: "Une fin ou transformation profonde est en cours. Ce qui se termine ouvre la voie à un renouveau ; acceptez le changement nécessaire.",
    combined: "Met fin aux énergies des cartes voisines ; peut signifier la transformation ou la conclusion de leur thème.",
  },
  {
    id: "bouquet", number: 9, name: "Le Bouquet", symbol: "💐",
    keywords: ["cadeau", "beauté", "générosité", "bonheur"],
    upright: "Un cadeau, une surprise agréable ou une invitation vous attend. Beauté, générosité et bonheur s'épanouissent autour de vous.",
    combined: "Embellit et positivise les cartes voisines ; annonce cadeaux, compliments ou moments de joie.",
  },
  {
    id: "faux", number: 10, name: "La Faux", symbol: "🌾",
    keywords: ["danger", "décision", "séparation", "récolte"],
    upright: "Une décision tranchante s'impose ou un danger soudain apparaît. La récolte arrive, mais une séparation peut en découler.",
    combined: "Coupe, termine ou sépare les énergies des cartes voisines ; décision irréversible proche.",
  },
  {
    id: "fouet", number: 11, name: "Le Fouet", symbol: "🔥",
    keywords: ["conflit", "répétition", "discussion", "discipline"],
    upright: "Des conflits récurrents ou discussions agitées perturbent l'harmonie. La passion s'enflamme ; la répétition des erreurs doit être évitée.",
    combined: "Active et intensifie les tensions des cartes voisines ; peut évoquer disputes ou activité physique.",
  },
  {
    id: "oiseaux", number: 12, name: "Les Oiseaux", symbol: "🐦",
    keywords: ["bavardage", "nervosité", "couple", "communication"],
    upright: "Des conversations animées, des nouvelles qui circulent et une légère nervosité caractérisent ce moment. Un couple ou duo est en jeu.",
    combined: "Amplifie la communication autour des cartes voisines ; souvent deux personnes ou une situation de couple.",
  },
  {
    id: "enfant", number: 13, name: "L'Enfant", symbol: "👶",
    keywords: ["nouveauté", "innocence", "commencement", "petitesse"],
    upright: "Un nouveau départ, une situation naissante ou un enfant est au cœur du message. L'innocence et la fraîcheur caractérisent ce nouveau début.",
    combined: "Réduit l'importance ou la maturité des cartes voisines ; indique un début ou quelque chose de petit.",
  },
  {
    id: "renard", number: 14, name: "Le Renard", symbol: "🦊",
    keywords: ["ruse", "méfiance", "travail", "tromperie"],
    upright: "La ruse et la vigilance sont nécessaires. Quelqu'un ou quelque chose n'est pas ce qu'il paraît ; dans le travail, faites confiance à votre instinct.",
    combined: "Introduit doute sur l'honnêteté des cartes voisines ; souvent lié au travail ou à la méfiance professionnelle.",
  },
  {
    id: "ours", number: 15, name: "L'Ours", symbol: "🐻",
    keywords: ["force", "autorité", "finances", "protection"],
    upright: "Une figure d'autorité, la force financière ou une protection puissante se manifeste. Votre pouvoir intérieur s'affirme avec bienveillance.",
    combined: "Renforce et amplifie les cartes voisines ; introduit une figure de pouvoir ou financière.",
  },
  {
    id: "etoiles", number: 16, name: "Les Étoiles", symbol: "⭐",
    keywords: ["espoir", "guidance", "rêve", "inspiration"],
    upright: "L'espoir brille et la guidance céleste vous oriente. Vos rêves peuvent se réaliser ; laissez-vous inspirer par votre étoile intérieure.",
    combined: "Illumine et positivise les cartes voisines ; guidance spirituelle et espoir augmentés.",
  },
  {
    id: "cigogne", number: 17, name: "La Cigogne", symbol: "🕊️",
    keywords: ["changement", "retour", "naissance", "migration"],
    upright: "Un changement positif ou un retour bienvenu s'annonce. Une naissance, un renouveau ou une migration transforme favorablement votre situation.",
    combined: "Apporte du mouvement et de la transformation aux cartes voisines ; souvent un changement positif.",
  },
  {
    id: "chien", number: 18, name: "Le Chien", symbol: "🐕",
    keywords: ["amitié", "loyauté", "confiance", "fidélité"],
    upright: "Un ami fidèle ou une relation de confiance est présente. La loyauté et l'amitié sincère soutiennent votre chemin avec dévouement.",
    combined: "Indique une personne de confiance liée aux cartes voisines ; fidélité et soutien amical.",
  },
  {
    id: "tour", number: 19, name: "La Tour", symbol: "🏰",
    keywords: ["solitude", "institution", "autorité", "isolation"],
    upright: "Une institution, une autorité ou une période de solitude est impliquée. L'isolement peut être une retraite nécessaire pour se retrouver.",
    combined: "Officialise ou institutionnalise les thèmes des cartes voisines ; peut introduire solitude ou formalisme.",
  },
  {
    id: "jardin", number: 20, name: "Le Jardin", symbol: "🌳",
    keywords: ["société", "public", "rencontre", "communauté"],
    upright: "Les relations sociales, les rencontres et les événements publics sont favorisés. La communauté et le réseau jouent un rôle essentiel.",
    combined: "Rend publiques les énergies des cartes voisines ; élargit la portée sociale de leur signification.",
  },
  {
    id: "montagne", number: 21, name: "La Montagne", symbol: "⛰️",
    keywords: ["obstacle", "blocage", "défi", "persévérance"],
    upright: "Un obstacle important ou un blocage ralentit votre progression. La persévérance est nécessaire pour surmonter ce défi qui teste votre détermination.",
    combined: "Bloque ou retarde les cartes voisines ; introduit un obstacle ou une difficulté à surmonter.",
  },
  {
    id: "chemin", number: 22, name: "Le Chemin", symbol: "🛤️",
    keywords: ["choix", "décision", "direction", "alternatives"],
    upright: "Un choix important se présente à la croisée des chemins. Plusieurs voies s'offrent à vous ; réfléchissez soigneusement avant de choisir votre direction.",
    combined: "Introduit des alternatives entre les cartes voisines ; souvent une décision entre deux options.",
  },
  {
    id: "souris", number: 23, name: "Les Souris", symbol: "🐭",
    keywords: ["perte", "grignotage", "anxiété", "diminution"],
    upright: "Une perte progressive ou une anxiété ronge votre énergie. Vérifiez ce qui s'échappe doucement de votre vie avant que les dommages s'accumulent.",
    combined: "Diminue et érode les qualités positives des cartes voisines ; perte ou dégradation graduelle.",
  },
  {
    id: "coeur", number: 24, name: "Le Cœur", symbol: "❤️",
    keywords: ["amour", "sentiments", "générosité", "passion"],
    upright: "L'amour et les sentiments profonds sont au premier plan. La générosité du cœur et la passion sincère guident vos relations avec chaleur.",
    combined: "Ajoute une dimension émotionnelle et amoureuse aux cartes voisines ; sentiment sincère partagé.",
  },
  {
    id: "anneau", number: 25, name: "L'Anneau", symbol: "💍",
    keywords: ["engagement", "contrat", "cycle", "union"],
    upright: "Un engagement, un contrat ou une union est en jeu. La fidélité aux promesses et les cycles qui se ferment marquent cette période importante.",
    combined: "Lie et unit les thèmes des cartes voisines ; engagement, contrat ou relation durable.",
  },
  {
    id: "livre", number: 26, name: "Le Livre", symbol: "📚",
    keywords: ["secret", "connaissance", "étude", "mystère"],
    upright: "Un secret ou des connaissances cachées attendent d'être révélés. L'étude et l'apprentissage ouvrent des portes insoupçonnées vers la compréhension.",
    combined: "Cache ou révèle des informations sur les cartes voisines ; secret ou connaissance non divulguée.",
  },
  {
    id: "lettre", number: 27, name: "La Lettre", symbol: "✉️",
    keywords: ["message", "document", "communication", "nouvelles"],
    upright: "Un document, message ou communication importante arrive bientôt. Des nouvelles par écrit ou un document officiel jouent un rôle décisif.",
    combined: "Apporte un message écrit ou officiel aux thèmes des cartes voisines ; communication formelle.",
  },
  {
    id: "homme", number: 28, name: "L'Homme", symbol: "👨",
    keywords: ["homme", "consultant-masculin", "figure-masculine", "individu"],
    upright: "Le consultant masculin ou une figure masculine importante est au centre. Cet homme représente un rôle clé dans la situation actuelle.",
    combined: "Représente le consultant ou un homme important lié aux cartes voisines.",
  },
  {
    id: "femme", number: 29, name: "La Femme", symbol: "👩",
    keywords: ["femme", "consultante-féminine", "figure-féminine", "individualité"],
    upright: "La consultante féminine ou une figure féminine importante est au cœur du message. Elle joue un rôle essentiel dans la situation décrite.",
    combined: "Représente la consultante ou une femme importante liée aux cartes voisines.",
  },
  {
    id: "lys", number: 30, name: "Les Lys", symbol: "⚜️",
    keywords: ["sagesse", "sérénité", "sensualité", "plaisir des sens", "maturité"],
    upright: "La sagesse, la sérénité et la sensualité guident votre chemin. Une période de maturité et de paix intérieure s'installe, avec le plaisir des sens pleinement assumé.",
    combined: "Apporte sérénité et maturité aux cartes voisines ; peut indiquer une relation durable et apaisée.",
  },
  {
    id: "soleil", number: 31, name: "Le Soleil", symbol: "☀️",
    keywords: ["succès", "bonheur", "clarté", "vitalité"],
    upright: "Le succès rayonnant et le bonheur illuminent votre chemin. La clarté revient, la vitalité se renouvelle ; les projets aboutissent brillamment.",
    combined: "Illumine et positivise fortement toutes les cartes voisines ; succès et clarté garantis.",
  },
  {
    id: "lune", number: 32, name: "La Lune", symbol: "🌙",
    keywords: ["intuition", "reconnaissance", "rêve", "gloire"],
    upright: "La reconnaissance publique et l'intuition profonde sont vos alliées. Les rêves et pressentiments révèlent des vérités cachées importantes.",
    combined: "Amplifie l'aspect émotionnel et intuitif des cartes voisines ; reconnaissance ou renommée.",
  },
  {
    id: "cle", number: 33, name: "La Clé", symbol: "🔑",
    keywords: ["solution", "ouverture", "succès", "révélation"],
    upright: "Une solution se révèle, une porte s'ouvre devant vous. Le succès est au rendez-vous ; vous avez entre les mains les moyens de résoudre la situation.",
    combined: "Ouvre et déverrouille les potentiels des cartes voisines ; solution ou confirmation positive.",
  },
  {
    id: "poisson", number: 34, name: "Le Poisson", symbol: "🐟",
    keywords: ["finances", "flux", "abondance", "commerce"],
    upright: "Les finances et les flux d'argent sont favorables. L'abondance circule librement ; le commerce et les transactions apportent prospérité et satisfaction.",
    combined: "Introduit une dimension financière aux cartes voisines ; flux d'argent, commerce ou abondance.",
  },
  {
    id: "ancre", number: 35, name: "L'Ancre", symbol: "⚓",
    keywords: ["stabilité", "persévérance", "travail", "ancrage"],
    upright: "La stabilité et la persévérance vous ancrent solidement. Le travail constant et la ténacité portent leurs fruits sur le long terme.",
    combined: "Stabilise et pérennise les thèmes des cartes voisines ; durabilité et ancrage dans le concret.",
  },
  {
    id: "croix", number: 36, name: "La Croix", symbol: "✝️",
    keywords: ["fardeau", "destin", "foi", "souffrance"],
    upright: "Un fardeau ou une épreuve du destin doit être porté avec foi. Cette croix à porter forge le caractère et conduit vers une compréhension plus profonde.",
    combined: "Alourdit les cartes voisines d'un sentiment de destin ou de fardeau ; épreuve nécessaire.",
  },
];

export interface LenormandSpread {
  id: string;
  name: string;
  count: number;
  positions: string[];
  description: string;
}

export const LENORMAND_SPREADS: LenormandSpread[] = [
  {
    id: "ligne-de-3",
    name: "Tirage en ligne de 3",
    count: 3,
    positions: ["Passé proche", "Présent", "Futur proche"],
    description: "Le tirage fondamental du Lenormand, lu comme une phrase.",
  },
  {
    id: "croix-lenormand",
    name: "La Croix Lenormand",
    count: 5,
    positions: ["Centre — La situation", "Passé — Ce qui précède", "Futur — Ce qui vient", "Dessus — Les influences", "Dessous — La fondation"],
    description: "La croix classique en 5 cartes — vision complète d'une situation avec ses influences et fondations.",
  },
  {
    id: "grand-jeu",
    name: "Tirage Rapide",
    count: 3,
    positions: ["Situation — Le présent", "Obstacle — Ce qui bloque", "Conseil — La voie à suivre"],
    description: "Un tirage en 3 cartes pour cerner rapidement une situation, identifier l'obstacle et recevoir un conseil.",
  },
  {
    id: "tirage-maison",
    name: "Tirage Maison",
    count: 9,
    positions: ["Amour & Relations", "Travail & Carrière", "Finances & Abondance", "Santé & Vitalité", "Famille & Foyer", "Amis & Entourage", "Projets & Créativité", "Blocage principal", "Conseil Lenormand"],
    description: "Les 9 maisons de vie révèlent les grandes sphères de votre existence avec les messages des cartes.",
  },
  {
    id: "grand-tableau",
    name: "Tirage des 9 Positions Clés",
    count: 9,
    positions: [
      "Position 1 (A) — Vous-même",
      "Position 8 (H) — Situation principale",
      "Position 9 (I) — Environnement immédiat",
      "Position 15 (O) — Ce qui vient vers vous",
      "Position 16 (P) — Passé récent",
      "Position 22 (V) — Votre maison & foyer",
      "Position 29 (AC) — Le futur",
      "Position 35 (AI) — Influences cachées",
      "Position 36 (AJ) — Résultat final",
    ],
    description: "Neuf cartes-clés extraites du Grand Tableau traditionnel — une vision panoramique de toutes les sphères de votre vie.",
  },
];

export function drawLenormand(count: number): LenormandCard[] {
  const a = [...LENORMAND_DECK];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}
