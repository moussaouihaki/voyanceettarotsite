export interface CartomancieCard {
  id: string;
  suit: "coeur" | "carreau" | "trefle" | "pique";
  suitSymbol: "♥" | "♦" | "♣" | "♠";
  suitName: string;
  rank: string;
  name: string;
  keywords: string[];
  upright: string;
  love: string;
  work: string;
  red: boolean;
}

export const CARTOMANCIE_DECK: CartomancieCard[] = [
  // ══════════ CŒUR ♥ ══════════
  {
    id: "coeur-7", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "7",
    name: "7 de Cœur",
    keywords: ["pensées des autres", "quelqu'un pense à vous", "flatterie", "indécision"],
    upright: "Les pensées des autres sur le consultant : quelqu'un pense à vous en ce moment. Des flatteries ou des préoccupations légères circulent autour de votre personne.",
    love: "Quelqu'un pense à vous avec tendresse — mais méfiez-vous des paroles dorées sans actes.",
    work: "Un collègue ou supérieur a les yeux tournés vers vous ; une idée germe dans les esprits.",
    red: true,
  },
  {
    id: "coeur-8", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "8",
    name: "8 de Cœur",
    keywords: ["visite à domicile", "invitation de proches", "réunion chez soi", "joie du foyer"],
    upright: "Une visite à la maison du consultant ou une invitation de proches est à venir. Des amis ou de la famille se réunissent chez vous, apportant chaleur et joie au foyer.",
    love: "Des proches ou le/la partenaire viendront vous rendre visite — un moment de complicité à la maison.",
    work: "Une réunion ou une rencontre professionnelle se déroulant dans un cadre familier ou à domicile ouvre des portes.",
    red: true,
  },
  {
    id: "coeur-9", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "9",
    name: "9 de Cœur",
    keywords: ["désir accompli", "bonheur", "vœu exaucé", "satisfaction"],
    upright: "La carte des vœux exaucés. Ce que vous souhaitez le plus ardemment est en voie de réalisation.",
    love: "Grand bonheur amoureux, le cœur trouve ce qu'il cherchait.",
    work: "La réussite est au bout du chemin, persévérez encore un peu.",
    red: true,
  },
  {
    id: "coeur-10", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "10",
    name: "10 de Cœur",
    keywords: ["bonheur familial", "succès", "chance", "foyer"],
    upright: "Carte de chance et de bonheur profond. Le foyer et la famille rayonnent d'harmonie.",
    love: "Union heureuse, harmonie durable, vie de couple épanouie.",
    work: "Succès mérité, reconnaissance, une belle récompense de vos efforts.",
    red: true,
  },
  {
    id: "coeur-valet", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "V",
    name: "Valet de Cœur",
    keywords: ["jeune homme sincère", "confident", "ami fidèle", "message d'amour"],
    upright: "Jeune homme sincère et loyal, porteur d'un message du cœur. Un ami de confiance ou un soupirant dévoué.",
    love: "Un jeune homme épris vous déclare ses sentiments sincères.",
    work: "Un collègue ou assistant fiable vous soutient dans vos projets.",
    red: true,
  },
  {
    id: "coeur-dame", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "D",
    name: "Dame de Cœur",
    keywords: ["femme aimante", "blonde/rousse", "bienveillance", "générosité"],
    upright: "Femme blonde ou rousse, aimante et généreuse. Elle représente la douceur, la maternité et l'affection sincère.",
    love: "Une femme aimante entre dans votre vie ou vous entoure de sa tendresse.",
    work: "Une femme influente et bienveillante vous apporte son soutien.",
    red: true,
  },
  {
    id: "coeur-roi", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "R",
    name: "Roi de Cœur",
    keywords: ["homme bon", "brun clair", "généreux", "paternel"],
    upright: "Homme aux cheveux châtains ou brun clair, bon et généreux. Figure paternelle bienveillante, juste et protectrice.",
    love: "Un homme aimant et sincère joue un rôle important dans votre vie affective.",
    work: "Un supérieur ou mentor bienveillant vous guide vers le succès.",
    red: true,
  },
  {
    id: "coeur-as", suit: "coeur", suitSymbol: "♥", suitName: "Cœur", rank: "A",
    name: "As de Cœur",
    keywords: ["foyer", "amour profond", "maison", "début affectif"],
    upright: "Carte du foyer et de l'amour profond. Elle annonce un nouveau départ sentimental ou la consolidation d'un amour.",
    love: "Grand amour, déclaration sincère, le cœur s'ouvre pleinement.",
    work: "Un projet de cœur prend racine, travail dans un cadre chaleureux.",
    red: true,
  },

  // ══════════ CARREAU ♦ ══════════
  {
    id: "carreau-7", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "7",
    name: "7 de Carreau",
    keywords: ["petite somme", "dispute légère", "bavardage", "enfant"],
    upright: "Une petite dispute ou un bavardage insignifiant. Parfois l'enfant dans la maison ou une dépense mineure.",
    love: "Une petite querelle sans conséquence — ne lui donnez pas plus d'importance.",
    work: "Un détail agaçant ou une petite dépense imprévue à gérer.",
    red: true,
  },
  {
    id: "carreau-8", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "8",
    name: "8 de Carreau",
    keywords: ["voyage court", "démarche", "chemin", "déplacement"],
    upright: "Un voyage ou un déplacement proche est à venir. Des démarches à effectuer porteront leurs fruits.",
    love: "Un voyage ou une sortie renforce les liens affectifs.",
    work: "Un déplacement professionnel ou une démarche administrative s'impose.",
    red: true,
  },
  {
    id: "carreau-9", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "9",
    name: "9 de Carreau",
    keywords: ["retard", "surprise", "désaccord", "imprévu"],
    upright: "Une surprise ou un retard imprévu. Les plans peuvent être perturbés, mais cela ouvre parfois de nouvelles voies.",
    love: "Une surprise sentimentale, agréable ou déconcertante selon les cartes voisines.",
    work: "Un retard ou un imprévu professionnel demande de la patience.",
    red: true,
  },
  {
    id: "carreau-10", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "10",
    name: "10 de Carreau",
    keywords: ["argent", "voyage lointain", "changement de situation", "abondance"],
    upright: "Grande chance financière et changement de situation favorable. Un voyage lointain est possible.",
    love: "Un voyage ou un changement de résidence favorise la vie amoureuse.",
    work: "Gains financiers significatifs, promotion ou opportunité professionnelle majeure.",
    red: true,
  },
  {
    id: "carreau-valet", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "V",
    name: "Valet de Carreau",
    keywords: ["porteur de nouvelles", "messager", "commissionnaire", "courrier"],
    upright: "Porteur de nouvelles, messager ou commissionnaire. Une information importante est en route vers vous.",
    love: "Un message inattendu touche votre cœur ou votre vie amoureuse.",
    work: "Une proposition ou une information professionnelle arrive bientôt.",
    red: true,
  },
  {
    id: "carreau-dame", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "D",
    name: "Dame de Carreau",
    keywords: ["femme blonde", "coquette", "mondaine", "versatile"],
    upright: "Femme blonde, coquette et mondaine. Elle peut être brillante mais inconstante, attentive aux apparences.",
    love: "Une rivale ou une femme à surveiller dans votre entourage amoureux.",
    work: "Une femme influente mais versatile — gardez-vous de trop lui faire confiance.",
    red: true,
  },
  {
    id: "carreau-roi", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "R",
    name: "Roi de Carreau",
    keywords: ["homme blond", "voyageur", "commerçant", "diplomate"],
    upright: "Homme blond ou roux, voyageur ou commerçant. Figure dynamique, habile en affaires et en communication.",
    love: "Un homme séduisant mais souvent absent ou en mouvement dans votre vie.",
    work: "Un partenaire commercial ou un voyageur apporte une opportunité intéressante.",
    red: true,
  },
  {
    id: "carreau-as", suit: "carreau", suitSymbol: "♦", suitName: "Carreau", rank: "A",
    name: "As de Carreau",
    keywords: ["nouvelle importante", "lettre", "contrat", "décision"],
    upright: "Une nouvelle importante ou un document significatif arrive. Un contrat ou une décision majeure est en jeu.",
    love: "Une lettre ou un message bouleverse favorablement la vie sentimentale.",
    work: "Un contrat, une offre ou un document important change la donne professionnelle.",
    red: true,
  },

  // ══════════ TRÈFLE ♣ ══════════
  {
    id: "trefle-7", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "7",
    name: "7 de Trèfle",
    keywords: ["petite chance", "enfant", "espoir", "début prometteur"],
    upright: "Petite chance ou espoir naissant. Un début prometteur qui demande à être cultivé avec soin.",
    love: "Un espoir amoureux se lève, laissez-lui le temps de grandir.",
    work: "Un petit succès ou une opportunité modeste qui mérite attention.",
    red: false,
  },
  {
    id: "trefle-8", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "8",
    name: "8 de Trèfle",
    keywords: ["travail", "effort", "diligence", "résultat proche"],
    upright: "Le travail assidu porte ses fruits. Vos efforts sont récompensés, la réussite est proche.",
    love: "Investissez dans votre relation avec constance, les efforts sont vus et appréciés.",
    work: "Persévérance et diligence mènent au succès mérité dans vos projets.",
    red: false,
  },
  {
    id: "trefle-9", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "9",
    name: "9 de Trèfle",
    keywords: ["obstination", "succès tardif", "résistance", "ténacité"],
    upright: "Le succès viendra, mais après des obstacles. La ténacité est votre meilleure alliée en ce moment.",
    love: "Une relation qui demande de l'effort et de la persévérance mais en vaut la peine.",
    work: "Un projet difficile finit par aboutir grâce à votre obstination.",
    red: false,
  },
  {
    id: "trefle-10", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "10",
    name: "10 de Trèfle",
    keywords: ["grande chance", "succès professionnel", "argent", "réussite"],
    upright: "Grande réussite professionnelle et financière. La fortune sourit et les affaires prospèrent.",
    love: "La stabilité financière renforce et sécurise la vie de couple.",
    work: "Succès remarquable, récompense financière et reconnaissance professionnelle.",
    red: false,
  },
  {
    id: "trefle-valet", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "V",
    name: "Valet de Trèfle",
    keywords: ["jeune ami sincère", "bonne nouvelle", "étudiant", "allié loyal"],
    upright: "Jeune ami sincère et loyal, porteur de bonnes nouvelles. Un allié de confiance dans vos projets.",
    love: "Un ami sincère ou un jeune homme bienveillant entre dans votre cercle affectif.",
    work: "Un jeune collaborateur talentueux ou un ami vous aide efficacement.",
    red: false,
  },
  {
    id: "trefle-dame", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "D",
    name: "Dame de Trèfle",
    keywords: ["femme brune", "influente", "sérieuse", "ambitieuse"],
    upright: "Femme brune, sérieuse et influente. Elle est fiable, ambitieuse et exerce une influence positive sur votre vie.",
    love: "Une femme sage et loyale vous conseille bien en amour.",
    work: "Une femme compétente et influente peut vous ouvrir des portes importantes.",
    red: false,
  },
  {
    id: "trefle-roi", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "R",
    name: "Roi de Trèfle",
    keywords: ["homme brun", "fidèle", "honnête", "travailleur"],
    upright: "Homme brun, fidèle et honnête. Figure masculine solide, fiable en affaires comme en amitié.",
    love: "Un homme loyal et sincère, digne de confiance sur le long terme.",
    work: "Un associé ou supérieur honnête et travailleur facilite votre réussite.",
    red: false,
  },
  {
    id: "trefle-as", suit: "trefle", suitSymbol: "♣", suitName: "Trèfle", rank: "A",
    name: "As de Trèfle",
    keywords: ["fortune", "maison", "stabilité", "prospérité"],
    upright: "Grande fortune et stabilité durable. L'As de Trèfle annonce la prospérité et la réalisation de vos ambitions.",
    love: "Une relation solide et durable s'installe sur des bases saines.",
    work: "Succès exceptionnel, gains importants, réalisation de vos ambitions professionnelles.",
    red: false,
  },

  // ══════════ PIQUE ♠ ══════════
  {
    id: "pique-7", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "7",
    name: "7 de Pique",
    keywords: ["larmes", "chagrin léger", "déception", "inquiétude"],
    upright: "Petite déception ou chagrin passager. Une inquiétude sans gravité qui demande à être apaisée.",
    love: "Une brouille légère ou une tristesse passagère dans la vie sentimentale.",
    work: "Une légère contrariété professionnelle qui se résoudra d'elle-même.",
    red: false,
  },
  {
    id: "pique-8", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "8",
    name: "8 de Pique",
    keywords: ["obstacle", "annulation", "retard imposé", "frustration"],
    upright: "Un obstacle ou une annulation contrarie vos plans. La patience et l'adaptation sont nécessaires.",
    love: "Une séparation temporaire ou un obstacle dans la relation demande de la patience.",
    work: "Un projet est bloqué ou annulé — cherchez un autre chemin.",
    red: false,
  },
  {
    id: "pique-9", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "9",
    name: "9 de Pique",
    keywords: ["maladie", "tristesse profonde", "malchance", "épreuve"],
    upright: "Carte de difficulté et d'épreuve sérieuse. Une période difficile à traverser avec courage et soutien.",
    love: "Une période de vide ou de souffrance affective qui demande du soutien.",
    work: "Difficultés professionnelles importantes — cherchez des alliés et de l'aide.",
    red: false,
  },
  {
    id: "pique-10", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "10",
    name: "10 de Pique",
    keywords: ["chagrin grave", "prison", "malheur", "rupture brutale"],
    upright: "Épreuve sérieuse ou rupture douloureuse. Cette carte annonce une fin difficile mais aussi la possibilité d'un renouveau.",
    love: "Une séparation ou une rupture douloureuse — mais après la tempête vient l'accalmie.",
    work: "Perte d'emploi ou échec professionnel majeur, mais une renaissance est possible.",
    red: false,
  },
  {
    id: "pique-valet", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "V",
    name: "Valet de Pique",
    keywords: ["jeune homme à méfier", "espion", "trompeur", "ennemi caché"],
    upright: "Jeune homme dont il faut se méfier. Il peut être espion, trompeur ou porteur de mauvaises intentions.",
    love: "Un rival ou une personne mal intentionnée cherche à nuire à votre vie amoureuse.",
    work: "Un collègue ou concurrent déloyal cherche à vous desservir — restez vigilant.",
    red: false,
  },
  {
    id: "pique-dame", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "D",
    name: "Dame de Pique",
    keywords: ["femme veuve/célibataire", "difficile", "jalouse", "envieuse"],
    upright: "Femme veuve, célibataire ou d'humeur difficile. Elle peut représenter la jalousie, l'envie ou un obstacle féminin.",
    love: "Une rivale jalouse ou une femme malveillante dans votre entourage amoureux.",
    work: "Une femme difficile ou jalouse dans votre environnement professionnel à surveiller.",
    red: false,
  },
  {
    id: "pique-roi", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "R",
    name: "Roi de Pique",
    keywords: ["homme autoritaire", "cheveux foncés", "juge", "pouvoir sévère"],
    upright: "Homme aux cheveux foncés, autoritaire et rigide. Il peut représenter un juge, un ennemi puissant ou une figure de pouvoir sévère.",
    love: "Un homme dominant ou difficile complique la vie sentimentale.",
    work: "Un supérieur autoritaire ou un adversaire puissant dans le monde professionnel.",
    red: false,
  },
  {
    id: "pique-as", suit: "pique", suitSymbol: "♠", suitName: "Pique", rank: "A",
    name: "As de Pique",
    keywords: ["mort symbolique", "fin", "transformation", "rupture totale"],
    upright: "Fin d'un cycle, transformation profonde ou rupture totale. La mort symbolique précède toujours une renaissance.",
    love: "Une relation prend fin définitivement, ouvrant la voie à un avenir différent.",
    work: "La fin d'une carrière ou d'un projet majeur — le temps du renouveau approche.",
    red: false,
  },
];

export function drawCartomancie(count: number): CartomancieCard[] {
  const a = [...CARTOMANCIE_DECK];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(count, a.length));
}
