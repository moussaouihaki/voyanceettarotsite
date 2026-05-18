// Significations Rider-Waite authentiques pour les 56 arcanes mineurs.
// Source : tradition RWS (Rider-Waite-Smith), résumée en français.
// Format : key = id de carte (minor-{suit-fr}-{num}), valeur = { upright, reversed, keywords }

export interface MinorMeaning {
  upright: string;
  reversed: string;
  keywords: string[];
}

export const MINOR_MEANINGS: Record<string, MinorMeaning> = {
  // ───────── BÂTONS / WANDS (Feu - énergie, passion, action) ─────────
  "minor-bâtons-1":  { keywords: ["inspiration", "nouveau départ", "potentiel", "création"], upright: "Une étincelle créatrice s'allume. Nouveau projet, passion naissante, élan vital — saisissez cette inspiration.", reversed: "Inspiration bloquée, retards, projets avortés, manque d'énergie pour initier." },
  "minor-bâtons-2":  { keywords: ["planification", "choix", "vision", "audace"], upright: "Le monde s'ouvre à vous. Un choix se présente : rester ou explorer ? L'audace est récompensée.", reversed: "Peur de l'inconnu, hésitation, manque de planification, choix repoussé." },
  "minor-bâtons-3":  { keywords: ["expansion", "exploration", "résultats", "anticipation"], upright: "Vos efforts portent leurs fruits. Vous voyez loin — l'expansion est en marche.", reversed: "Délais, plans qui s'effondrent, vision étriquée, obstacles imprévus." },
  "minor-bâtons-4":  { keywords: ["célébration", "harmonie", "foyer", "stabilité"], upright: "Une étape franchie, célébrez. Joie collective, mariage, foyer harmonieux.", reversed: "Conflit familial, transition instable, célébration retardée." },
  "minor-bâtons-5":  { keywords: ["conflit", "compétition", "désaccord", "tension"], upright: "Tensions et rivalités. Plusieurs forces s'opposent — l'épreuve forge le caractère.", reversed: "Résolution de conflit, retour à la paix, fin de la compétition." },
  "minor-bâtons-6":  { keywords: ["victoire", "reconnaissance", "succès public", "fierté"], upright: "La victoire est à vous. Reconnaissance publique, triomphe mérité — savourez-le.", reversed: "Égo blessé, succès retardé, manque de reconnaissance, trahison." },
  "minor-bâtons-7":  { keywords: ["défense", "persévérance", "courage", "tenir bon"], upright: "Défendez votre position. Vous êtes sur la hauteur — gardez votre terrain malgré l'opposition.", reversed: "Épuisement, abandon, défense impossible, capitulation." },
  "minor-bâtons-8":  { keywords: ["rapidité", "mouvement", "messages", "action"], upright: "Tout s'accélère. Voyages, nouvelles, projets qui décollent — soyez prêt.", reversed: "Retards frustrants, ralentissement, messages perdus, précipitation néfaste." },
  "minor-bâtons-9":  { keywords: ["résilience", "vigilance", "épreuves", "force"], upright: "Vous êtes proche du but. Restez vigilant — une dernière épreuve, et vous triompherez.", reversed: "Paranoïa, méfiance excessive, défaite par épuisement." },
  "minor-bâtons-10": { keywords: ["charge", "responsabilité", "fardeau", "obligation"], upright: "Vous portez beaucoup. Le succès est là, mais à quel prix ? Apprenez à déléguer.", reversed: "Libération du fardeau, délégation réussie, allègement bienvenu." },
  "minor-bâtons-11": { keywords: ["enthousiasme", "messager", "potentiel jeune"], upright: "Valet de Bâtons — un message porteur d'enthousiasme arrive. Énergie juvénile, projet en germe.", reversed: "Annonces décevantes, immaturité, projets sans suite." },
  "minor-bâtons-12": { keywords: ["aventure", "passion", "action audacieuse"], upright: "Cavalier de Bâtons — partez à l'aventure ! Énergie débordante, voyage, déménagement.", reversed: "Précipitation, impulsivité, décisions hâtives, fuite." },
  "minor-bâtons-13": { keywords: ["passion", "charisme", "indépendance féminine"], upright: "Reine de Bâtons — femme passionnée, confiante, créatrice. Influence chaleureuse.", reversed: "Jalousie, autoritarisme, demande d'attention excessive." },
  "minor-bâtons-14": { keywords: ["leadership", "vision", "charisme", "autorité"], upright: "Roi de Bâtons — leadership inspiré, charismatique, visionnaire. Mentor solaire.", reversed: "Tyran, impulsif, leader colérique, abus de pouvoir." },

  // ───────── COUPES / CUPS (Eau - émotions, amour, intuition) ─────────
  "minor-coupes-1":  { keywords: ["amour", "intuition", "spiritualité", "nouveau cœur"], upright: "Un cœur s'ouvre. Nouvelle relation, intuition profonde, source spirituelle qui jaillit.", reversed: "Émotions refoulées, amour bloqué, cœur vidé, déception sentimentale." },
  "minor-coupes-2":  { keywords: ["union", "partenariat", "âmes sœurs", "réciprocité"], upright: "L'union sacrée. Connexion d'âmes, réconciliation, partenariat équilibré.", reversed: "Rupture, déséquilibre, communication brisée, incompatibilité." },
  "minor-coupes-3":  { keywords: ["amitié", "célébration", "communauté", "joie partagée"], upright: "Joie partagée. Amitiés profondes, célébration, fête mémorable.", reversed: "Trahison d'amis, isolement, excès de fête, malentendus." },
  "minor-coupes-4":  { keywords: ["apathie", "introspection", "ennui", "réévaluation"], upright: "Repli et apathie. Vous refusez une offre — êtes-vous certain de bien voir ?", reversed: "Réveil, nouvelle motivation, sortie de l'ennui, acceptation." },
  "minor-coupes-5":  { keywords: ["deuil", "regret", "perte", "tristesse"], upright: "Le chagrin envahit. Mais regardez : il reste encore deux coupes pleines. Tout n'est pas perdu.", reversed: "Acceptation du deuil, retour à la joie, lâcher prise." },
  "minor-coupes-6":  { keywords: ["nostalgie", "enfance", "innocence", "souvenirs"], upright: "Retour aux racines. Souvenirs d'enfance, retrouvailles, innocence retrouvée.", reversed: "Vivre dans le passé, immaturité, incapacité à grandir." },
  "minor-coupes-7":  { keywords: ["illusions", "choix multiples", "fantasmes", "tentations"], upright: "Sept rêves, lequel est réel ? Méfiez-vous des illusions et choisissez avec discernement.", reversed: "Clarté retrouvée, décision prise, illusions dissipées." },
  "minor-coupes-8":  { keywords: ["départ", "abandon", "quête spirituelle", "lâcher"], upright: "Vous tournez le dos à ce qui ne vous nourrit plus. Quête de sens profonde.", reversed: "Peur de partir, attachement toxique, retour en arrière." },
  "minor-coupes-9":  { keywords: ["accomplissement", "satisfaction", "vœu", "bien-être"], upright: "La carte du vœu exaucé. Satisfaction profonde, abondance émotionnelle.", reversed: "Insatisfaction malgré l'abondance, vanité, vœu retardé." },
  "minor-coupes-10": { keywords: ["bonheur familial", "harmonie", "épanouissement", "amour total"], upright: "Bonheur familial complet. Harmonie absolue, amour rayonnant, foyer béni.", reversed: "Disharmonie familiale, valeurs en conflit, foyer brisé." },
  "minor-coupes-11": { keywords: ["sensibilité", "intuition", "rêveur", "créativité émotionnelle"], upright: "Valet de Coupes — message d'amour, intuition juvénile, créativité émotionnelle.", reversed: "Hypersensibilité, immaturité émotionnelle, manipulation." },
  "minor-coupes-12": { keywords: ["romance", "charme", "offrande", "idéalisation"], upright: "Cavalier de Coupes — proposition romantique, prince charmant, offre du cœur.", reversed: "Promesse non tenue, fausse romance, idéalisation déçue." },
  "minor-coupes-13": { keywords: ["intuition profonde", "compassion", "mystère féminin"], upright: "Reine de Coupes — femme intuitive, compatissante, mystérieuse. Sagesse émotionnelle.", reversed: "Manipulation émotionnelle, dépendance affective, hypersensibilité." },
  "minor-coupes-14": { keywords: ["sagesse émotionnelle", "compassion sage", "maîtrise"], upright: "Roi de Coupes — sage compatissant, diplomate, maître de ses émotions.", reversed: "Manipulation, instabilité émotionnelle, sage corrompu." },

  // ───────── ÉPÉES / SWORDS (Air - intellect, conflit, vérité) ─────────
  "minor-épées-1":  { keywords: ["clarté", "vérité", "percée mentale", "victoire"], upright: "Une vérité tranchante émerge. Idée géniale, percée intellectuelle, clarté absolue.", reversed: "Confusion, pensée embrouillée, erreur de jugement, mauvaise communication." },
  "minor-épées-2":  { keywords: ["impasse", "décision difficile", "déni", "équilibre fragile"], upright: "Impasse mentale, yeux bandés. Décision repoussée, déni d'une vérité dérangeante.", reversed: "Décision enfin prise, vérité acceptée, sortie de l'impasse." },
  "minor-épées-3":  { keywords: ["chagrin", "rupture", "trahison", "douleur"], upright: "Le cœur transpercé. Rupture douloureuse, trahison, vérité qui fait mal.", reversed: "Guérison du chagrin, pardon, lâcher prise du passé." },
  "minor-épées-4":  { keywords: ["repos", "convalescence", "méditation", "récupération"], upright: "Pause nécessaire. Retraite, méditation, convalescence après l'épreuve.", reversed: "Reprise d'activité, sortie de retraite, agitation retrouvée." },
  "minor-épées-5":  { keywords: ["défaite", "humiliation", "discorde", "ego"], upright: "Victoire à la Pyrrhus. Conflit toxique, humiliation, défaite morale même en gagnant.", reversed: "Réconciliation, fin du conflit, dépassement de l'ego." },
  "minor-épées-6":  { keywords: ["transition", "passage", "voyage difficile", "guérison"], upright: "Traversée vers des eaux plus calmes. Transition nécessaire, voyage de guérison.", reversed: "Résistance au changement, retour à la tempête, transition bloquée." },
  "minor-épées-7":  { keywords: ["ruse", "tromperie", "stratégie", "fuite"], upright: "Méfiez-vous : ruse, tromperie, vol. Stratégie en cachette — sois honnête.", reversed: "Tromperie dévoilée, retour à l'honnêteté, conscience qui parle." },
  "minor-épées-8":  { keywords: ["restriction", "auto-limitation", "victime", "prison mentale"], upright: "Vous êtes prisonnier de vos propres pensées. Les liens sont là, mais pas indéfectibles.", reversed: "Libération mentale, retrouvailles de la liberté, prison mentale dissoute." },
  "minor-épées-9":  { keywords: ["angoisse", "cauchemar", "anxiété", "nuit noire"], upright: "Insomnie et tourments. Angoisse nocturne, peurs qui dévorent. La nuit est sombre.", reversed: "Sortie de l'angoisse, espoir retrouvé, fin des cauchemars." },
  "minor-épées-10": { keywords: ["fin douloureuse", "trahison ultime", "effondrement total"], upright: "Le fond du puits. Trahison totale, fin brutale — mais l'aube se lève à l'horizon.", reversed: "Renaissance, fin du calvaire, premier souffle nouveau." },
  "minor-épées-11": { keywords: ["vigilance", "curiosité", "esprit vif", "espion"], upright: "Valet d'Épées — esprit vif, curiosité, observateur perspicace.", reversed: "Espionnage, médisance, langue acérée, esprit corrosif." },
  "minor-épées-12": { keywords: ["action décidée", "ambition", "impulsion"], upright: "Cavalier d'Épées — fonce ! Action rapide, ambition débordante, décision tranchée.", reversed: "Impulsivité destructrice, agression, décision hâtive et regrettée." },
  "minor-épées-13": { keywords: ["indépendance", "lucidité", "veuve", "vérité froide"], upright: "Reine d'Épées — femme lucide, indépendante, esprit aiguisé. Vérité sans complaisance.", reversed: "Froideur, amertume, langue tranchante, jugement cruel." },
  "minor-épées-14": { keywords: ["autorité intellectuelle", "justice", "discipline mentale"], upright: "Roi d'Épées — juge sage, autorité intellectuelle, discipline mentale exemplaire.", reversed: "Tyrannie intellectuelle, abus de pouvoir, jugement injuste." },

  // ───────── PENTACLES / DENIERS (Terre - matériel, travail, santé) ─────────
  "minor-pentacles-1":  { keywords: ["opportunité", "manifestation", "nouveau projet", "prospérité"], upright: "Une graine d'abondance se sème. Nouvelle opportunité financière, prospérité naissante.", reversed: "Opportunité manquée, blocage matériel, investissement avorté." },
  "minor-pentacles-2":  { keywords: ["équilibre", "jonglage", "adaptabilité", "priorités"], upright: "Vous jonglez avec talent. Équilibre entre deux mondes — adaptabilité essentielle.", reversed: "Surcharge, déséquilibre, priorités confuses, chute imminente." },
  "minor-pentacles-3":  { keywords: ["collaboration", "compétence", "métier", "reconnaissance"], upright: "Travail d'équipe efficace. Vos compétences sont reconnues — collaboration fructueuse.", reversed: "Conflits d'équipe, travail bâclé, compétences non reconnues." },
  "minor-pentacles-4":  { keywords: ["sécurité", "avarice", "contrôle", "possession"], upright: "Vous tenez fermement à vos biens. Sécurité matérielle, mais attention à l'avarice.", reversed: "Lâcher prise matériel, générosité retrouvée, pertes financières." },
  "minor-pentacles-5":  { keywords: ["pauvreté", "exclusion", "épreuve matérielle", "froid"], upright: "Période de manque. Difficultés financières, sentiment d'exclusion — l'aide est proche.", reversed: "Sortie de la précarité, retour à l'abondance, soutien retrouvé." },
  "minor-pentacles-6":  { keywords: ["générosité", "partage", "équité", "charité"], upright: "Donnez et recevez équitablement. Aide reçue ou donnée, charité juste.", reversed: "Dettes, mauvaise gestion, charité conditionnelle, déséquilibre des dons." },
  "minor-pentacles-7":  { keywords: ["patience", "récolte", "évaluation", "long terme"], upright: "Vos efforts mûrissent. Patience requise — la récolte approche, évaluez votre progression.", reversed: "Impatience, manque de récolte, efforts vains, perte de motivation." },
  "minor-pentacles-8":  { keywords: ["apprentissage", "maîtrise", "artisanat", "diligence"], upright: "L'apprentissage rigoureux paye. Maîtrise d'un art, dévouement à un métier.", reversed: "Travail bâclé, manque de motivation, perfectionnisme stérile." },
  "minor-pentacles-9":  { keywords: ["abondance", "indépendance", "luxe", "auto-suffisance"], upright: "Abondance acquise par soi-même. Indépendance financière, luxe mérité.", reversed: "Dépendance financière, illusion de richesse, perte d'autonomie." },
  "minor-pentacles-10": { keywords: ["héritage", "famille", "richesse durable", "tradition"], upright: "Patrimoine familial, transmission, sécurité multi-générationnelle.", reversed: "Conflits d'héritage, perte de patrimoine, instabilité financière familiale." },
  "minor-pentacles-11": { keywords: ["étude", "ambition naissante", "nouveau projet matériel"], upright: "Valet de Deniers — étudiant assidu, nouveau projet concret, ambition débutante.", reversed: "Manque de focus, opportunités gâchées, rêveur sans action." },
  "minor-pentacles-12": { keywords: ["méthode", "fiabilité", "routine efficace"], upright: "Cavalier de Deniers — travailleur méthodique, fiable, routine constructive.", reversed: "Stagnation, routine étouffante, manque d'initiative, ennui." },
  "minor-pentacles-13": { keywords: ["abondance maternelle", "pragmatisme", "nourrir les autres"], upright: "Reine de Deniers — femme nourricière, généreuse, ancrée. Sécurité matérielle.", reversed: "Matérialisme excessif, négligence de soi, dépendance, étouffement affectif."},
  "minor-pentacles-14": { keywords: ["succès matériel", "abondance maîtrisée", "patriarche"], upright: "Roi de Deniers — homme d'affaires accompli, prospère, généreux. Empire bâti.", reversed: "Avarice, corruption, obsession du pouvoir matériel, tyrannie financière." },
};

export function getMinorMeaning(cardId: string): MinorMeaning | null {
  return MINOR_MEANINGS[cardId] || null;
}
