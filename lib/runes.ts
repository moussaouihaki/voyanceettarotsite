export interface Rune {
  id: string;
  symbol: string;
  name: string;
  phonetic: string;
  element: string;
  deity: string;
  keywords: string[];
  upright: string;
  meaningReversed: string;
  meaning: string;
  number: number;
  canBeReversed: boolean;
  aett: "freyr" | "hagal" | "tyr";
}

export const ELDER_FUTHARK: Rune[] = [
  { id: "fehu", symbol: "ᚠ", name: "Fehu", phonetic: "F", number: 1, element: "Feu", deity: "Freyr", keywords: ["richesse", "abondance", "fertilité", "énergie primordiale"], upright: "Richesse, abondance, réussite matérielle. Vos efforts portent leurs fruits.", meaningReversed: "Perte financière, cupidité, échec matériel. Réévaluez vos priorités.", meaning: "La rune de la richesse et du bétail. Symbole de l'énergie vitale et de la prospérité.", canBeReversed: true, aett: "freyr" },
  { id: "uruz", symbol: "ᚢ", name: "Uruz", phonetic: "U", number: 2, element: "Terre", deity: "Thor", keywords: ["force", "santé", "vitalité", "endurance"], upright: "Force physique et morale. Puissance, santé robuste, nouvelles opportunités.", meaningReversed: "Faiblesse, opportunités manquées, violence mal canalisée.", meaning: "La rune de l'auroch sauvage. Symbolise la force brute et la puissance transformatrice.", canBeReversed: true, aett: "freyr" },
  { id: "thurisaz", symbol: "ᚦ", name: "Thurisaz", phonetic: "Th", number: 3, element: "Feu", deity: "Thor", keywords: ["protection", "défi", "force réactive", "destruction nécessaire"], upright: "Protection contre les ennemis. Un obstacle peut être surmonté.", meaningReversed: "Dangers, trahison, manque de protection. Méfiez-vous des pièges.", meaning: "La rune des géants et du marteau de Thor. Protection active et force réactive.", canBeReversed: true, aett: "freyr" },
  { id: "ansuz", symbol: "ᚨ", name: "Ansuz", phonetic: "A", number: 4, element: "Air", deity: "Odin", keywords: ["communication", "sagesse", "inspiration", "signal divin"], upright: "Message important, inspiration, sagesse reçue. Écoutez les signes de l'univers.", meaningReversed: "Mensonge, manipulation, mauvaise communication. Méfiez-vous des fausses vérités.", meaning: "La rune d'Odin. Symbolise la communication divine, la sagesse et les messages importants.", canBeReversed: true, aett: "freyr" },
  { id: "raidho", symbol: "ᚱ", name: "Raidho", phonetic: "R", number: 5, element: "Air", deity: "Thor", keywords: ["voyage", "mouvement", "justice", "rythme"], upright: "Voyage, déplacement, progression. Vous êtes sur la bonne voie.", meaningReversed: "Retards, obstacles dans les voyages, injustice, déséquilibre.", meaning: "La rune du voyage et du mouvement. Représente la roue qui tourne et le flux de la vie.", canBeReversed: true, aett: "freyr" },
  { id: "kenaz", symbol: "ᚲ", name: "Kenaz", phonetic: "K", number: 6, element: "Feu", deity: "Freya", keywords: ["illumination", "connaissance", "créativité", "clarté"], upright: "Lumière dans l'obscurité, créativité, nouvelles connaissances, transformation.", meaningReversed: "Ignorance, secrets, fin d'une relation ou d'une situation.", meaning: "La rune de la torche. Symbolise la lumière de la connaissance et la flamme créatrice.", canBeReversed: true, aett: "freyr" },
  { id: "gebo", symbol: "ᚷ", name: "Gebo", phonetic: "G", number: 7, element: "Air", deity: "Odin/Frigg", keywords: ["cadeau", "échange", "partenariat", "générosité"], upright: "Don, échange équilibré, partenariat harmonieux, générosité.", meaningReversed: "Gebo n'a pas de forme inversée — tout don a un sens positif.", meaning: "La rune du cadeau. Symbolise l'échange équitable et les dons entre les êtres.", canBeReversed: false, aett: "freyr" },
  { id: "wunjo", symbol: "ᚹ", name: "Wunjo", phonetic: "W/V", number: 8, element: "Terre", deity: "Odin", keywords: ["joie", "bonheur", "harmonie", "succès"], upright: "Joie, bonheur, harmonie, succès mérité. Une période de félicité approche.", meaningReversed: "Tristesse, dépression, conflits, disharmonie. Une période difficile à traverser.", meaning: "La rune de la joie. Symbole du bonheur profond et de l'harmonie entre les êtres.", canBeReversed: true, aett: "freyr" },
  { id: "hagalaz", symbol: "ᚺ", name: "Hagalaz", phonetic: "H", number: 9, element: "Grêle", deity: "Heimdall", keywords: ["disruption", "transformation", "chaos", "nécessité"], upright: "Perturbation soudaine qui amène une nécessaire transformation. Lâchez prise.", meaningReversed: "Hagalaz n'a pas de forme inversée — la transformation est inévitable.", meaning: "La rune de la grêle. Symbolise les forces naturelles et les transformations inévitables.", canBeReversed: false, aett: "hagal" },
  { id: "nauthiz", symbol: "ᚾ", name: "Nauthiz", phonetic: "N", number: 10, element: "Feu", deity: "Nornes", keywords: ["besoin", "restriction", "endurance", "patience"], upright: "Période de restriction, mais aussi de croissance par l'adversité. Patience.", meaningReversed: "Contrainte excessive, mauvaises décisions prises dans le besoin.", meaning: "La rune du besoin. Représente les contraintes et la croissance qui en découle.", canBeReversed: true, aett: "hagal" },
  { id: "isa", symbol: "ᛁ", name: "Isa", phonetic: "I", number: 11, element: "Glace", deity: "Verdandi", keywords: ["immobilité", "attente", "stase", "introspection"], upright: "Période de pause et de réflexion. Attendez avant d'agir.", meaningReversed: "Isa n'a pas de forme inversée — c'est un arrêt temporaire nécessaire.", meaning: "La rune de la glace. Symbolise le gel du temps, l'attente et l'introspection.", canBeReversed: false, aett: "hagal" },
  { id: "jera", symbol: "ᛃ", name: "Jera", phonetic: "J/Y", number: 12, element: "Terre", deity: "Freyr/Freya", keywords: ["récolte", "cycles", "récompense", "patience"], upright: "Récolte des efforts passés. Ce que vous avez semé porte ses fruits.", meaningReversed: "Jera n'a pas de forme inversée — les cycles ne peuvent être inversés.", meaning: "La rune de l'année et de la récolte. Symbolise les cycles naturels et les récompenses méritées.", canBeReversed: false, aett: "hagal" },
  { id: "eihwaz", symbol: "ᛇ", name: "Eihwaz", phonetic: "Ei", number: 13, element: "Terre", deity: "Odin", keywords: ["transformation", "endurance", "connexion", "mort-renaissance"], upright: "Transformation profonde, endurance face aux épreuves, connexion entre les mondes.", meaningReversed: "Eihwaz n'a pas de forme inversée — sa forme symétrique l'en empêche.", meaning: "La rune de l'if. L'arbre sacré qui lie les mondes — symbole de mort et de renaissance.", canBeReversed: false, aett: "hagal" },
  { id: "perthro", symbol: "ᛈ", name: "Perthro", phonetic: "P", number: 14, element: "Eau", deity: "Nornes", keywords: ["mystère", "destin", "chance", "secrets révélés"], upright: "Secrets révélés, chance, destin mystérieux. Ce qui était caché se dévoile.", meaningReversed: "Secrets néfastes, manipulation cachée, mauvaise chance.", meaning: "La rune du destin. Symbolise les mystères de la vie et les forces qui façonnent notre sort.", canBeReversed: true, aett: "hagal" },
  { id: "algiz", symbol: "ᛉ", name: "Algiz", phonetic: "Z/R", number: 15, element: "Air", deity: "Heimdall", keywords: ["protection", "connexion divine", "bouclier", "éveil"], upright: "Protection divine, bouclier énergétique, éveil spirituel.", meaningReversed: "Vulnérabilité, protection affaiblie. Soyez vigilant.", meaning: "La rune de l'élan et de la protection. Symbole de connexion entre l'humain et le divin.", canBeReversed: true, aett: "hagal" },
  { id: "sowilo", symbol: "ᛊ", name: "Sowilo", phonetic: "S", number: 16, element: "Feu", deity: "Sol (Soleil)", keywords: ["succès", "vitalité", "énergie solaire", "victoire"], upright: "Succès, vitalité, énergie solaire, victoire sur l'obscurité.", meaningReversed: "Sowilo n'a pas de forme inversée — la lumière du soleil ne peut être stoppée.", meaning: "La rune du soleil. Symbolise la victoire, la vitalité et l'énergie lumineuse.", canBeReversed: false, aett: "hagal" },
  { id: "tiwaz", symbol: "ᛏ", name: "Tiwaz", phonetic: "T", number: 17, element: "Air", deity: "Tyr", keywords: ["justice", "sacrifice", "honneur", "victoire"], upright: "Justice, honneur, victoire par le sacrifice consenti.", meaningReversed: "Injustice, déshonneur, perte due à un mauvais sacrifice.", meaning: "La rune du dieu Tyr. Symbolise la justice, l'honneur guerrier et le sacrifice noble.", canBeReversed: true, aett: "tyr" },
  { id: "berkano", symbol: "ᛒ", name: "Berkano", phonetic: "B", number: 18, element: "Terre", deity: "Frigg/Freya", keywords: ["croissance", "naissance", "renaissance", "fertilité"], upright: "Nouvelle naissance, croissance, renaissance, fertilité, commencements.", meaningReversed: "Stagnation, refus de grandir, complications familiales.", meaning: "La rune du bouleau. Symbole de naissance, de croissance et du principe maternel.", canBeReversed: true, aett: "tyr" },
  { id: "ehwaz", symbol: "ᛖ", name: "Ehwaz", phonetic: "E", number: 19, element: "Terre", deity: "Freyr/Freya", keywords: ["partenariat", "loyauté", "progrès", "harmonie"], upright: "Partenariat fidèle, progrès harmonieux, confiance mutuelle.", meaningReversed: "Trahison, mouvement dans la mauvaise direction, désharmonie.", meaning: "La rune du cheval. Symbolise le partenariat loyal et le voyage en confiance.", canBeReversed: true, aett: "tyr" },
  { id: "mannaz", symbol: "ᛗ", name: "Mannaz", phonetic: "M", number: 20, element: "Air", deity: "Odin/Heimdall", keywords: ["humanité", "soi", "coopération", "intelligence"], upright: "Conscience de soi, coopération, intelligence, humanité dans son ensemble.", meaningReversed: "Égoïsme, isolation, manque de perspicacité.", meaning: "La rune de l'humanité. Symbolise l'être humain dans sa globalité et sa conscience.", canBeReversed: true, aett: "tyr" },
  { id: "laguz", symbol: "ᛚ", name: "Laguz", phonetic: "L", number: 21, element: "Eau", deity: "Njord", keywords: ["intuition", "inconscient", "flux", "émotions"], upright: "Flux, intuition, émotions profondes. Faites confiance à votre ressenti.", meaningReversed: "Confusion émotionnelle, peurs aquatiques, déni de l'intuition.", meaning: "La rune de l'eau. Symbolise le flux émotionnel, l'intuition et l'inconscient.", canBeReversed: true, aett: "tyr" },
  { id: "ingwaz", symbol: "ᛜ", name: "Ingwaz", phonetic: "Ng", number: 22, element: "Terre", deity: "Ing/Freyr", keywords: ["gestation", "potentiel", "fertilité", "nouveau cycle"], upright: "Un nouveau cycle commence. Gestation d'une idée ou d'un projet important.", meaningReversed: "Ingwaz n'a pas de forme inversée — la gestation ne peut être stoppée.", meaning: "La rune du dieu Ing. Symbolise la gestation, le potentiel en développement.", canBeReversed: false, aett: "tyr" },
  { id: "dagaz", symbol: "ᛞ", name: "Dagaz", phonetic: "D", number: 23, element: "Feu", deity: "Odin", keywords: ["éveil", "percée", "transformation", "aube"], upright: "Percée, éveil, transformation radicale, l'aube d'une nouvelle ère.", meaningReversed: "Dagaz n'a pas de forme inversée — l'aube est inévitable.", meaning: "La rune du jour. Symbolise l'éveil, la percée et la transformation totale.", canBeReversed: false, aett: "tyr" },
  { id: "othala", symbol: "ᛟ", name: "Othala", phonetic: "O", number: 24, element: "Terre", deity: "Odin", keywords: ["héritage", "demeure", "ancêtres", "appartenance"], upright: "Héritage ancestral, demeure, racines profondes, appartenance et tradition.", meaningReversed: "Déracinement, conflits familiaux, refus de l'héritage.", meaning: "La rune de l'héritage. Symbolise les racines, les ancêtres et le patrimoine sacré.", canBeReversed: true, aett: "tyr" },
  {
    id: "wyrd", symbol: "⊡", name: "Wyrd", phonetic: "", number: 25,
    element: "Esprit", deity: "Les Nornes",
    keywords: ["destin", "mystère", "inconnu", "le voile"],
    upright: "Ce qui est caché ne peut être révélé. Le destin est en œuvre. Acceptez l'inconnu avec confiance.",
    meaningReversed: "Wyrd ne se renverse pas — son mystère reste entier.",
    meaning: "La rune vierge symbolise ce qui dépasse la compréhension humaine. Elle invite à faire confiance au flux de la vie et à lâcher le contrôle.",
    canBeReversed: false, aett: "tyr"
  },
];

export interface RuneSpread {
  id: string;
  name: string;
  count: number;
  positions: string[];
  description: string;
  emoji: string;
}

export const RUNE_SPREADS: RuneSpread[] = [
  {
    id: "rune-odin", name: "La Rune d'Odin", count: 1, emoji: "🔮",
    positions: ["Guidance du moment"],
    description: "Une seule rune tirée pour une guidance directe et profonde.",
  },
  {
    id: "nornes", name: "Les Nornes", count: 3, emoji: "🌀",
    positions: ["Urd — Le passé", "Verdandi — Le présent", "Skuld — Le futur"],
    description: "Les trois tisseuses du destin : ce qui a été, ce qui est, ce qui sera.",
  },
  {
    id: "croix-odin", name: "Croix d'Odin", count: 5, emoji: "✝️",
    positions: ["Centre — La situation", "Haut — Le passé", "Bas — Le futur", "Gauche — Ce qui aide", "Droite — Ce qui freine"],
    description: "La croix runique en 5 points — vision 360° d'une situation.",
  },
  {
    id: "viking-6", name: "Tirage Viking", count: 6, emoji: "⚔️",
    positions: ["Amour & Relations", "Travail & Projets", "Finances & Abondance", "Santé & Vitalité", "Le blocage principal", "Le conseil runique"],
    description: "Un tirage complet couvrant les 6 grands domaines de votre vie.",
  },
  {
    id: "asgard-9", name: "Tirage d'Asgard", count: 9, emoji: "🌍",
    positions: ["Asgard — Dieux", "Vanaheim — Nature", "Alfheim — Lumière", "Midgard — Vous", "Jotunheim — Défis", "Svartalfheim — Ombre", "Niflheim — Inconscient", "Muspelheim — Transformation", "Helheim — Fin & Renouveau"],
    description: "Les 9 mondes nordiques révèlent les 9 dimensions de votre situation.",
  },
  {
    id: "thor-7", name: "Oracle de Thor", count: 7, emoji: "⚡",
    positions: ["La situation centrale", "Les forces en jeu", "Ce qui vous aide", "Ce qui vous nuit", "Le conseil des dieux", "L'action à mener", "La résolution"],
    description: "7 runes sous l'égide de Thor pour une lecture approfondie.",
  },
];

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawRunes(count: number): Array<Rune & { isReversed: boolean }> {
  const shuffled = fisherYates(ELDER_FUTHARK);
  return shuffled.slice(0, count).map((r) => ({
    ...r,
    isReversed: r.canBeReversed ? Math.random() > 0.5 : false,
  }));
}
