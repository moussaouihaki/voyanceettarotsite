export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  suit: string;
  number: string;
  element: string;
  keywords: string[];
  upright: string;
  meaningReversed: string;
  emoji: string;
  affirmation?: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: "major-0", name: "Le Fou", nameEn: "The Fool", suit: "Arcanes Majeurs", number: "0", element: "Air", keywords: ["liberté", "innocence", "nouveau départ", "spontanéité"], upright: "Un nouveau départ plein de potentiel, l'innocence et la liberté vous portent vers l'aventure.", meaningReversed: "Imprudence, manque de direction, prise de risques inconsidérés.", emoji: "🃏", affirmation: "Aujourd'hui, j'embrasse l'inconnu avec confiance et légèreté." },
  { id: "major-1", name: "Le Magicien", nameEn: "The Magician", suit: "Arcanes Majeurs", number: "I", element: "Mercure", keywords: ["volonté", "compétence", "manifestation", "pouvoir"], upright: "Vous avez tous les outils pour réussir. Votre volonté peut transformer les idées en réalité.", meaningReversed: "Manipulation, manque de confiance, talents inexploités.", emoji: "🎩", affirmation: "Je concentre ma volonté et transforme mes idées en réalité." },
  { id: "major-2", name: "La Papesse", nameEn: "The High Priestess", suit: "Arcanes Majeurs", number: "II", element: "Lune", keywords: ["intuition", "mystère", "sagesse intérieure", "introspection"], upright: "Fiez-vous à votre intuition. Les mystères se révèlent à qui sait écouter le silence.", meaningReversed: "Secrets cachés, intuition bloquée, connaissance superficielle.", emoji: "📿", affirmation: "J'écoute ma voix intérieure et fais confiance à mon intuition." },
  { id: "major-3", name: "L'Impératrice", nameEn: "The Empress", suit: "Arcanes Majeurs", number: "III", element: "Vénus", keywords: ["fertilité", "abondance", "nature", "créativité"], upright: "Abondance, créativité et fertilité vous entourent. C'est le temps de la croissance et de la prospérité.", meaningReversed: "Dépendance, stagnation créative, excès ou manque de soins.", emoji: "👑", affirmation: "Je m'épanouis dans l'abondance et célèbre la beauté de la vie." },
  { id: "major-4", name: "L'Empereur", nameEn: "The Emperor", suit: "Arcanes Majeurs", number: "IV", element: "Bélier", keywords: ["autorité", "structure", "stabilité", "leadership"], upright: "Autorité et structure portent vos projets. Votre leadership naturel vous guide vers le succès.", meaningReversed: "Tyrannie, rigidité, abus de pouvoir, immaturité.", emoji: "⚔️", affirmation: "J'agis avec détermination et bâtis ce qui dure." },
  { id: "major-5", name: "Le Pape", nameEn: "The Hierophant", suit: "Arcanes Majeurs", number: "V", element: "Taureau", keywords: ["tradition", "spiritualité", "enseignement", "conformité"], upright: "La sagesse traditionnelle et les enseignements spirituels éclairent votre chemin.", meaningReversed: "Dogmatisme, rebellion contre les conventions, hypocrisie.", emoji: "⛪", affirmation: "Je m'ouvre à la sagesse des traditions et des guides." },
  { id: "major-6", name: "Les Amoureux", nameEn: "The Lovers", suit: "Arcanes Majeurs", number: "VI", element: "Gémeaux", keywords: ["amour", "choix", "harmonie", "union"], upright: "Un choix important s'offre à vous. L'harmonie et l'amour guidés par vos valeurs profondes.", meaningReversed: "Désaccord, mauvais choix, déséquilibre dans les relations.", emoji: "💕", affirmation: "Je choisis avec le cœur et assume mes décisions." },
  { id: "major-7", name: "Le Chariot", nameEn: "The Chariot", suit: "Arcanes Majeurs", number: "VII", element: "Cancer", keywords: ["victoire", "volonté", "contrôle", "voyage"], upright: "La victoire est à portée de main. Maîtrisez vos forces opposées et avancez avec détermination.", meaningReversed: "Manque de contrôle, agressivité, défaites.", emoji: "🏆", affirmation: "Je maîtrise mes forces contraires et avance vers ma victoire." },
  { id: "major-8", name: "La Force", nameEn: "Strength", suit: "Arcanes Majeurs", number: "VIII", element: "Lion", keywords: ["courage", "patience", "compassion", "force intérieure"], upright: "La vraie force vient du cœur. Votre douceur et votre courage surmonteront tous les obstacles.", meaningReversed: "Doute de soi, faiblesse, manque de foi en ses capacités.", emoji: "🦁", affirmation: "Je dompte mes peurs avec douceur et puise dans ma force profonde." },
  { id: "major-9", name: "L'Ermite", nameEn: "The Hermit", suit: "Arcanes Majeurs", number: "IX", element: "Vierge", keywords: ["solitude", "sagesse", "guidance", "introspection"], upright: "La retraite et la contemplation révèlent les vérités profondes. La sagesse est en vous.", meaningReversed: "Isolement excessif, refus des conseils, aveuglement intérieur.", emoji: "🕯️", affirmation: "Je prends le temps de regarder en moi et trouve ma lumière intérieure." },
  { id: "major-10", name: "La Roue de la Fortune", nameEn: "Wheel of Fortune", suit: "Arcanes Majeurs", number: "X", element: "Jupiter", keywords: ["destin", "cycles", "chance", "changement"], upright: "La roue tourne en votre faveur. Un cycle se termine, un nouveau commence avec de nouvelles opportunités.", meaningReversed: "Malchance, résistance au changement, répétition des erreurs.", emoji: "🎡", affirmation: "J'accueille les cycles de la vie et surfe sur le changement." },
  { id: "major-11", name: "La Justice", nameEn: "Justice", suit: "Arcanes Majeurs", number: "XI", element: "Balance", keywords: ["équilibre", "vérité", "justice", "karma"], upright: "L'équilibre et la vérité prévalent. Les actes passés portent leurs fruits, la justice s'accomplit.", meaningReversed: "Injustice, manque d'honnêteté, jugement biaisé.", emoji: "⚖️", affirmation: "J'agis avec intégrité et fais confiance à l'équilibre naturel." },
  { id: "major-12", name: "Le Pendu", nameEn: "The Hanged Man", suit: "Arcanes Majeurs", number: "XII", element: "Neptune", keywords: ["sacrifice", "perspective", "suspension", "lâcher-prise"], upright: "Un sacrifice consenti ouvre une nouvelle perspective. Lâchez prise pour mieux avancer.", meaningReversed: "Résistance au sacrifice, stagnation, martyr inutile.", emoji: "🌀", affirmation: "Je lâche prise et découvre la sagesse dans l'attente." },
  { id: "major-13", name: "La Mort", nameEn: "Death", suit: "Arcanes Majeurs", number: "XIII", element: "Scorpion", keywords: ["transformation", "fin", "renaissance", "transition"], upright: "Une transformation profonde s'opère. Ce qui finit laisse place à quelque chose de nouveau et puissant.", meaningReversed: "Résistance au changement, stagnation, peur de la transformation.", emoji: "🦋", affirmation: "Je laisse partir ce qui est accompli et m'ouvre à ma renaissance." },
  { id: "major-14", name: "La Tempérance", nameEn: "Temperance", suit: "Arcanes Majeurs", number: "XIV", element: "Sagittaire", keywords: ["équilibre", "modération", "patience", "harmonie"], upright: "L'harmonie et la modération vous guident. La patience et l'équilibre mènent à votre but.", meaningReversed: "Excès, déséquilibre, impatience, conflits intérieurs.", emoji: "🌈", affirmation: "Je trouve l'équilibre et mélange avec sagesse tous les aspects de ma vie." },
  { id: "major-15", name: "Le Diable", nameEn: "The Devil", suit: "Arcanes Majeurs", number: "XV", element: "Capricorne", keywords: ["attachement", "matérialisme", "addiction", "contrainte"], upright: "Des liens vous retiennent — matériels ou émotionnels. Prenez conscience de ce qui vous enchaîne.", meaningReversed: "Libération des liens, prise de conscience, reprise du contrôle.", emoji: "🔗", affirmation: "Je prends conscience de mes chaînes et choisis ma liberté." },
  { id: "major-16", name: "La Tour", nameEn: "The Tower", suit: "Arcanes Majeurs", number: "XVI", element: "Mars", keywords: ["bouleversement", "révélation", "chaos", "transformation soudaine"], upright: "Un bouleversement soudain détruit l'ancien pour révéler la vérité. La reconstruction sera plus solide.", meaningReversed: "Évitement de l'inévitable, catastrophe intérieure, résistance.", emoji: "⚡", affirmation: "Je laisse s'effondrer ce qui était faux pour bâtir sur du solide." },
  { id: "major-17", name: "L'Étoile", nameEn: "The Star", suit: "Arcanes Majeurs", number: "XVII", element: "Verseau", keywords: ["espoir", "inspiration", "renouveau", "sérénité"], upright: "L'espoir et l'inspiration illuminent votre chemin. Après la tempête vient la sérénité.", meaningReversed: "Découragement, manque de foi, opportunités manquées.", emoji: "⭐", affirmation: "Je me laisse guider par l'espoir et confie mes rêves à l'univers." },
  { id: "major-18", name: "La Lune", nameEn: "The Moon", suit: "Arcanes Majeurs", number: "XVIII", element: "Poissons", keywords: ["illusion", "peur", "inconscient", "intuition"], upright: "Les illusions et l'inconscient se manifestent. Fiez-vous à votre instinct pour traverser l'obscurité.", meaningReversed: "Confusion dissipée, peurs surmontées, clarté retrouvée.", emoji: "🌕", affirmation: "Je traverse l'incertitude avec courage et fais confiance au processus." },
  { id: "major-19", name: "Le Soleil", nameEn: "The Sun", suit: "Arcanes Majeurs", number: "XIX", element: "Soleil", keywords: ["joie", "succès", "vitalité", "clarté"], upright: "Le soleil brille sur vous ! Joie, succès et vitalité illuminent tous vos projets.", meaningReversed: "Optimisme excessif, succès retardé, dépression temporaire.", emoji: "☀️", affirmation: "Je rayonne de joie et partage ma lumière avec ceux qui m'entourent." },
  { id: "major-20", name: "Le Jugement", nameEn: "Judgement", suit: "Arcanes Majeurs", number: "XX", element: "Pluton", keywords: ["réveil", "absolution", "renaissance", "appel"], upright: "Un réveil spirituel vous appelle à vous élever. Faites le bilan et embrassez votre renaissance.", meaningReversed: "Doute de soi, refus de s'éveiller, culpabilité non résolue.", emoji: "📯", affirmation: "Je réponds à l'appel de mon âme et m'élève vers ma vraie nature." },
  { id: "major-21", name: "Le Monde", nameEn: "The World", suit: "Arcanes Majeurs", number: "XXI", element: "Saturne", keywords: ["accomplissement", "complétude", "intégration", "voyage achevé"], upright: "L'accomplissement total est atteint. Un cycle complet, la sagesse acquise, le monde s'ouvre à vous.", meaningReversed: "Voyage inachevé, manque de clôture, succès retardé.", emoji: "🌍", affirmation: "Je célèbre mon accomplissement et m'ouvre au prochain cycle." },
];

const NUMBERS = ["As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Valet", "Cavalier", "Reine", "Roi"];
const SUIT_DATA = {
  Bâtons: { element: "Feu", emoji: "🔥", keywords: ["énergie", "créativité", "passion", "action"] },
  Coupes: { element: "Eau", emoji: "💧", keywords: ["émotions", "amour", "intuition", "relations"] },
  Épées: { element: "Air", emoji: "💨", keywords: ["intellect", "conflit", "vérité", "communication"] },
  Pentacles: { element: "Terre", emoji: "🌱", keywords: ["matériel", "travail", "santé", "finance"] },
};

import { MINOR_MEANINGS } from "./tarot-minor-meanings";

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  Object.entries(SUIT_DATA).forEach(([suit, data]) => {
    NUMBERS.forEach((num, i) => {
      const id = `minor-${suit.toLowerCase()}-${i + 1}`;
      const meaning = MINOR_MEANINGS[id];
      cards.push({
        id,
        name: `${num} de ${suit}`,
        nameEn: `${num} of ${suit}`,
        suit,
        number: num,
        element: data.element,
        keywords: meaning?.keywords ?? data.keywords,
        upright: meaning?.upright ?? `Le ${num} de ${suit} évoque ${data.keywords.slice(0, 2).join(" et ")}.`,
        meaningReversed: meaning?.reversed ?? `En position inversée, examinez votre rapport au ${data.keywords[3] || "quotidien"}.`,
        emoji: data.emoji,
      });
    });
  });
  return cards;
}

export const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...generateMinorArcana()];

// Fisher-Yates shuffle — distribution uniforme garantie
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawCards(count: number): Array<TarotCard & { reversed: boolean; positionIndex: number }> {
  return shuffle(ALL_CARDS).slice(0, count).map((card, i) => ({
    ...card,
    reversed: Math.random() < 0.5,
    positionIndex: i,
  }));
}

export const SPREAD_POSITIONS = {
  trois: ["Passé", "Présent", "Futur"],
  celtique: [
    "Situation actuelle",
    "Ce qui vous traverse",
    "Racine / Fondation",
    "Passé récent",
    "Couronnement / Idéal",
    "Futur proche",
    "Vous-même",
    "Environnement",
    "Espoirs & Craintes",
    "Résultat final",
  ],
};
