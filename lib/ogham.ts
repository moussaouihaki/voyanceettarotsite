export interface OghamStave {
  id: string;
  number: number;
  letter: string;
  name: string;
  tree: string;
  element: string;
  keywords: string[];
  meaning: string;
  upright: string;
}

export const OGHAM_STAVES: OghamStave[] = [
  {
    id: "beith", number: 1, letter: "ᚁ", name: "Beith", tree: "Bouleau", element: "Air",
    keywords: ["nouveau départ", "purification", "renouveau", "potentiel"],
    meaning: "Le Bouleau, premier arbre de l'Ogham, symbolise les commencements et la purification. Il efface l'ancien pour accueillir le nouveau avec grâce et légèreté.",
    upright: "Un nouveau départ s'offre à vous ; purifiez votre espace intérieur pour accueillir ce renouveau.",
  },
  {
    id: "luis", number: 2, letter: "ᚂ", name: "Luis", tree: "Sorbier", element: "Feu",
    keywords: ["protection", "vision", "clarté", "intuition"],
    meaning: "Le Sorbier protège contre les forces obscures et ouvre la vision intérieure. Ses baies rouges comme le feu éclairent les chemins secrets de l'âme et du monde.",
    upright: "Faites confiance à votre intuition et à votre vision ; vous êtes protégé(e) sur ce chemin.",
  },
  {
    id: "fearn", number: 3, letter: "ᚃ", name: "Fearn", tree: "Aulne", element: "Eau",
    keywords: ["courage", "guidance", "passage", "protection guerrière"],
    meaning: "L'Aulne pousse aux bords des eaux et forme des ponts entre les mondes. Il incarne le courage du guerrier qui traverse les eaux troubles pour atteindre sa destinée.",
    upright: "Avancez avec courage dans cette traversée ; la guidance est présente pour vous mener à bon port.",
  },
  {
    id: "sail", number: 4, letter: "ᚄ", name: "Sail", tree: "Saule", element: "Eau",
    keywords: ["intuition", "lune", "émotions", "flexibilité"],
    meaning: "Le Saule, gardien des eaux lunaires, écoute les murmures de l'inconscient et des rêves. Sa flexibilité face aux vents enseigne l'art de plier sans se rompre.",
    upright: "Écoutez vos rêves et vos émotions profondes ; la flexibilité est votre force en ce moment.",
  },
  {
    id: "nion", number: 5, letter: "ᚅ", name: "Nion", tree: "Frêne", element: "Air",
    keywords: ["connexion", "monde-des-esprits", "destin", "expansion"],
    meaning: "Le Frêne, Yggdrasil des Celtes, relie les trois mondes — ciel, terre et sous-terre. Il ouvre les portes de la perception au-delà du voile de l'ordinaire.",
    upright: "Ouvrez-vous aux connexions entre les plans ; votre destin se tisse à travers plusieurs dimensions.",
  },
  {
    id: "huath", number: 6, letter: "ᚆ", name: "Huath", tree: "Aubépine", element: "Feu",
    keywords: ["purification", "attente", "protection", "alerte"],
    meaning: "L'Aubépine, gardienne des lisières enchantées, marque les frontières entre le monde visible et l'invisible. Elle invite à la purification et à la patience avant le passage.",
    upright: "Une période d'attente et de purification s'impose ; protégez-vous avant de franchir le prochain seuil.",
  },
  {
    id: "duir", number: 7, letter: "ᚇ", name: "Duir", tree: "Chêne", element: "Terre",
    keywords: ["force", "endurance", "sagesse", "royauté"],
    meaning: "Le Chêne sacré des druides incarne la force et la sagesse millénaire. Ses racines profondes et ses branches vers le ciel symbolisent l'union de la terre et du cosmos.",
    upright: "Puisez dans votre force intérieure ; vous possédez la sagesse et l'endurance pour traverser cette épreuve.",
  },
  {
    id: "tinne", number: 8, letter: "ᚈ", name: "Tinne", tree: "Houx", element: "Feu",
    keywords: ["défi", "combat", "équilibre", "solstice"],
    meaning: "Le Houx, roi de l'hiver, affronte les saisons sombres avec ardeur et vigueur. Il enseigne l'art de maintenir l'équilibre et la beauté même dans les temps difficiles.",
    upright: "Relevez le défi avec ardeur ; l'équilibre entre lumière et ombre est la clé de votre victoire.",
  },
  {
    id: "coll", number: 9, letter: "ᚉ", name: "Coll", tree: "Noisetier", element: "Air",
    keywords: ["sagesse", "créativité", "inspiration", "connaissance"],
    meaning: "Le Noisetier, arbre de la sagesse celtique, abrite les noisettes d'inspiration divine. Ses rameaux de coudrier guident les sourciers vers les eaux cachées de la vérité.",
    upright: "Faites confiance à votre créativité et à la sagesse qui monte en vous ; l'inspiration divine est présente.",
  },
  {
    id: "quert", number: 10, letter: "ᚊ", name: "Quert", tree: "Pommier", element: "Terre",
    keywords: ["beauté", "choix", "abondance", "paradis"],
    meaning: "Le Pommier des Îles Bienheureuses offre ses fruits d'immortalité et de sagesse. Il symbolise l'abondance de la vie et les choix qui mènent vers la beauté véritable.",
    upright: "L'abondance et la beauté vous entourent ; faites confiance à votre chemin vers l'épanouissement.",
  },
  {
    id: "muin", number: 11, letter: "ᚋ", name: "Muin", tree: "Vigne", element: "Eau",
    keywords: ["vérité", "prophétie", "libération", "joie"],
    meaning: "La Vigne et la Ronce entrelacées libèrent la vérité cachée dans les mots et dans le vin des prophètes. Elles délient la langue et ouvrent les portes de la parole sacrée.",
    upright: "La vérité voulant se libérer ; exprimez ce qui est caché avec courage et authenticité.",
  },
  {
    id: "gort", number: 12, letter: "ᚌ", name: "Gort", tree: "Lierre", element: "Eau",
    keywords: ["persévérance", "détermination", "liens", "spirale"],
    meaning: "Le Lierre spiral s'accroche avec détermination et trace le chemin de l'âme à travers les labyrinthes de la vie. Sa croissance tenace symbolise la force des liens profonds.",
    upright: "Persévérez dans votre détermination ; vos liens et vos engagements vous soutiennent solidement.",
  },
  {
    id: "ngeadal", number: 13, letter: "ᚍ", name: "Ngéadal", tree: "Roseau", element: "Eau",
    keywords: ["harmonie", "guérison", "santé", "équilibre"],
    meaning: "Le Roseau harmonieux chante avec le vent et guide vers la guérison intérieure. Sa musique naturelle rappelle l'importance de trouver le rythme juste dans chaque action.",
    upright: "Recherchez l'harmonie et la guérison ; écoutez le rythme naturel de votre corps et de votre âme.",
  },
  {
    id: "straif", number: 14, letter: "ᚎ", name: "Straif", tree: "Épine noire", element: "Terre",
    keywords: ["contrainte du destin", "force irrésistible", "carrefour", "inévitabilité"],
    meaning: "L'Épine noire, arbre du destin inexorable, marque les carrefours où les chemins se croisent sans retour. Sa puissance révèle les forces qui dépassent la volonté humaine et imposent une direction.",
    upright: "Acceptez ce qui est inévitable ; certaines forces du destin doivent être traversées avec humilité.",
  },
  {
    id: "ruis", number: 15, letter: "ᚏ", name: "Ruis", tree: "Sureau", element: "Eau",
    keywords: ["transformation", "passage", "mort-renaissance", "ancêtres"],
    meaning: "Le Sureau, gardien des portes entre les mondes, accompagne les âmes dans leurs passages et transformations. Il relie les vivants aux ancêtres et porte la mémoire ancestrale.",
    upright: "Une transformation profonde est en cours ; honorez vos ancêtres et faites confiance au processus.",
  },
  {
    id: "ailm", number: 16, letter: "ᚐ", name: "Ailm", tree: "Pin", element: "Air",
    keywords: ["clarté", "longévité", "vision", "hauteur"],
    meaning: "Le Pin majestueux s'élève vers le ciel pour offrir une vision panoramique et pure. Du haut de sa stature, il révèle la clarté de l'esprit libéré des brumes du quotidien.",
    upright: "Élevez votre perspective pour voir clairement ; la vision panoramique vous révèle la vérité.",
  },
  {
    id: "onn", number: 17, letter: "ᚑ", name: "Onn", tree: "Genêt", element: "Feu",
    keywords: ["vitalité", "jeunesse", "optimisme", "soleil"],
    meaning: "Le Genêt doré explose de vitalité au printemps et embrasse le soleil avec joie et exubérance. Il célèbre la vie dans toute sa puissance dorée et son élan irrépressible.",
    upright: "Embrassez votre vitalité et votre joie de vivre ; l'optimisme est votre plus grande force.",
  },
  {
    id: "ur", number: 18, letter: "ᚒ", name: "Úr", tree: "Bruyère", element: "Terre",
    keywords: ["guérison", "chance", "amour", "solitude spirituelle"],
    meaning: "La Bruyère des landes solitaires soigne les blessures cachées et attire la chance et l'amour. Dans sa solitude apparente, elle cultive une force intérieure profonde et durable.",
    upright: "La guérison intérieure est possible ; accordez-vous la solitude nécessaire pour retrouver votre équilibre.",
  },
  {
    id: "edad", number: 19, letter: "ᚓ", name: "Edad", tree: "Tremble", element: "Air",
    keywords: ["courage", "résistance", "bouclier", "endurance"],
    meaning: "Le Tremble frémissant dans le moindre souffle incarne le courage paradoxal de la sensibilité. Ses feuilles tremblantes cachent une résistance profonde aux tempêtes de l'existence.",
    upright: "Votre sensibilité est une force ; le courage de ressentir pleinement vous protège.",
  },
  {
    id: "idad", number: 20, letter: "ᚔ", name: "Idad", tree: "If", element: "Terre",
    keywords: ["immortalité", "ancestral", "sagesse-ancienne", "renaissance"],
    meaning: "L'If millénaire, arbre de l'immortalité et des cimetières sacrés, détient la sagesse accumulée des âges. Il guide les âmes à travers les cycles de mort et de renaissance éternels.",
    upright: "La sagesse ancestrale vous guide ; faites confiance aux cycles profonds de transformation et renaissance.",
  },
  {
    id: "eabhadh", number: 21, letter: "ᚕ", name: "Éabhadh", tree: "Peuplier blanc", element: "Air",
    keywords: ["communication", "parole-sacrée", "éloquence", "passage"],
    meaning: "Le Peuplier blanc murmure les secrets du vent et de l'entre-deux-mondes. Ses feuilles argentées scintillent comme des mots entre le visible et l'invisible.",
    upright: "Exprimez-vous avec éloquence et authenticité ; vos paroles ont le pouvoir de traverser les voiles.",
  },
  {
    id: "oir", number: 22, letter: "ᚖ", name: "Óir", tree: "Fusain", element: "Feu",
    keywords: ["harmonie", "or", "douceur", "complétude"],
    meaning: "Le Fusain doré synthétise les harmonies de la création et représente la plénitude accomplie. Son essence précieuse comme l'or révèle la beauté dans l'achèvement et la complétude.",
    upright: "Vous approchez d'un moment de complétude et d'harmonie ; savourez cette belle synthèse.",
  },
  {
    id: "uillenn", number: 23, letter: "ᚗ", name: "Uillenn", tree: "Chèvrefeuille", element: "Eau",
    keywords: ["liens", "séduction", "douceur", "enchevêtrement"],
    meaning: "Le Chèvrefeuille enlaçant exhale son parfum envoûtant et tresse des liens indéfectibles entre les êtres. Sa douce séduction rappelle que les connexions profondes transcendent le temps.",
    upright: "Vos liens affectifs sont précieux ; laissez la douceur et la tendresse guider vos relations.",
  },
  {
    id: "iphin", number: 24, letter: "ᚘ", name: "Iphin", tree: "Groseillier", element: "Terre",
    keywords: ["douceur", "abondance-cachée", "surprise", "récompense"],
    meaning: "Le Groseillier épineux cache ses fruits savoureux derrière ses épines protectrices. Il enseigne que les récompenses les plus douces se méritent et se cachent souvent derrière les défis.",
    upright: "Une récompense inattendue vous attend derrière un obstacle apparent ; persévérez.",
  },
  {
    id: "emhancholl", number: 25, letter: "ᚙ", name: "Emhancholl", tree: "Tremble", element: "Feu",
    keywords: ["synthèse", "totalité", "accomplissement", "clôture-du-cycle"],
    meaning: "Le Tremble frémissant, dernier fid et gardien de la totalité, clôture le cercle de la sagesse oghamique. Il incarne l'accomplissement du grand cycle et l'union des contraires dans la plénitude.",
    upright: "Un cycle important s'achève ; célébrez ce que vous avez accompli et préparez-vous au prochain cercle.",
  },
];

export interface OghamSpread {
  id: string;
  name: string;
  count: number;
  positions: string[];
  description: string;
}

export const OGHAM_SPREADS: OghamSpread[] = [
  {
    id: "fid-unique",
    name: "Le Fid du Druide",
    count: 1,
    positions: ["Guidance du moment"],
    description: "Un seul fid oghamique pour une guidance directe de la sagesse druidique.",
  },
  {
    id: "triades-celtiques",
    name: "Les Triades Celtiques",
    count: 3,
    positions: ["Passé — Ce qui a formé", "Présent — Ce qui est", "Futur — Ce qui vient"],
    description: "Les trois temps sacrés des druides — la triade fondamentale de l'Ogham.",
  },
  {
    id: "croix-celtique",
    name: "La Croix Celtique",
    count: 5,
    positions: ["Centre — La situation", "Croix — L'obstacle ou aide", "Dessus — Le ciel (idéal)", "Dessous — La terre (fondation)", "Futur — Le chemin"],
    description: "La croix celtique en 5 feadha — vision complète selon la tradition druidique.",
  },
];

export function drawOgham(count: number): OghamStave[] {
  const shuffled = [...OGHAM_STAVES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
