export interface BlogArticle {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  author: string;
  image?: string;
  content: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "art-tirage-tarot-debutant",
    title: "L'Art du Tirage de Tarot pour le Néophyte",
    subtitle: "Initiation aux mystères des 78 cartes",
    excerpt: "Le Tarot n'est pas un simple jeu de cartes — c'est un miroir de l'âme. Découvrez les fondations d'une pratique millénaire qui peut transformer votre existence.",
    category: "Tarot",
    readTime: 8,
    date: "2026-05-01",
    author: "Madame Céleste",
    content: `Le Tarot, dans sa forme la plus ancienne, remonte au XV<sup>e</sup> siècle. Bien plus qu'un divertissement, il représente un système symbolique d'une richesse inégalée, capable de révéler les mouvements subtils de notre psyché.

## Les Deux Arcanes

Le jeu de Tarot se divise en deux ensembles distincts :

**Les Arcanes Majeurs** — 22 cartes représentant les grandes étapes du parcours initiatique humain. Du Fou (innocence absolue) au Monde (réalisation totale), chaque carte incarne un archétype universel.

**Les Arcanes Mineurs** — 56 cartes réparties en quatre familles : Bâtons (feu, action), Coupes (eau, émotions), Épées (air, pensée) et Deniers (terre, matière). Ils éclairent les aspects plus quotidiens de l'existence.

## La Préparation Sacrée

Avant tout tirage, créez un espace sacré. Allumez une bougie, brûlez de l'encens si vous en avez. Respirez profondément trois fois. Tenez votre jeu entre vos mains et formulez votre question avec clarté.

## Les Tirages Fondamentaux

- **La carte unique** — Pour une guidance quotidienne ou une réponse directe.
- **Passé / Présent / Futur** — La lecture temporelle par excellence, idéale pour comprendre une situation dans sa continuité.
- **La Croix Celtique** — Le tirage en 10 cartes, le plus complet et le plus universellement utilisé.

## L'Écoute Intérieure

La véritable magie du Tarot ne réside pas dans les cartes elles-mêmes, mais dans la capacité de l'interprète à écouter ce qui résonne en lui. Les significations traditionnelles sont des points de départ — votre intuition est le guide ultime.

Lorsque vous tirez une carte, observez vos premières impressions avant de consulter les livres. Quelle émotion vous traverse ? Quelle image se présente à votre esprit ? Cette voix intérieure est sacrée.

## Pour aller plus loin

Avec le temps, votre relation au jeu se personnalise. Chaque carte développe pour vous une signification unique, façonnée par votre expérience. Le Tarot n'est pas une science figée — c'est un dialogue vivant entre vous, les cartes, et l'Univers.

Que vos premiers tirages soient pleins de révélations.`,
  },
  {
    slug: "comprendre-thème-astral",
    title: "Comprendre son Thème Astral en Profondeur",
    subtitle: "Le ciel à l'instant de votre naissance",
    excerpt: "Votre carte du ciel natale est une cartographie unique de l'univers au moment exact où vous avez pris votre premier souffle. Apprenez à la lire.",
    category: "Astrologie",
    readTime: 12,
    date: "2026-04-22",
    author: "Madame Céleste",
    content: `Votre thème astral est une photographie du ciel à l'instant précis de votre naissance, vu depuis votre lieu de naissance. C'est la carte la plus personnelle qui existe — aucune autre n'est strictement identique à la vôtre.

## Les Trois Piliers Fondamentaux

**Le Signe Solaire** — Déterminé par la position du Soleil, il représente votre identité consciente, votre ego, ce que vous exprimez au monde.

**Le Signe Lunaire** — Position de la Lune au moment de votre naissance. Il révèle votre paysage émotionnel intérieur, vos instincts, ce qui vous nourrit profondément.

**L'Ascendant** — Le signe qui se levait à l'horizon est au moment exact de votre naissance. Il agit comme un masque social, la première impression que vous donnez aux autres.

## Les Douze Maisons

Chaque maison représente un domaine de vie :

1. **Maison I** — L'identité, l'apparence physique
2. **Maison II** — Les ressources, l'argent, les valeurs
3. **Maison III** — La communication, la fratrie, les voyages courts
4. **Maison IV** — Le foyer, les racines familiales
5. **Maison V** — La créativité, les enfants, les plaisirs
6. **Maison VI** — Le travail quotidien, la santé
7. **Maison VII** — Les partenariats, le mariage
8. **Maison VIII** — La transformation, les héritages, la sexualité
9. **Maison IX** — La philosophie, les voyages lointains
10. **Maison X** — La carrière, la réputation
11. **Maison XI** — Les amis, les projets collectifs
12. **Maison XII** — L'inconscient, le karma

## Les Planètes en Action

Chaque planète gouverne un aspect de votre psyché. Vénus parle d'amour et de beauté, Mars d'action et de désir, Mercure de pensée et de communication. Saturne enseigne les leçons karmiques, Jupiter ouvre les portes de l'expansion.

## Les Aspects Planétaires

Les angles entre les planètes (conjonctions, trigones, carrés, oppositions) révèlent les tensions et harmonies internes. Un trigone Soleil-Lune indique une grande harmonie entre votre ego et vos émotions. Un carré Mars-Saturne suggère une lutte entre l'action et la limitation.

## L'Interprétation Holistique

Lire un thème astral, c'est tisser une histoire à partir de tous ces éléments. Aucun facteur isolé n'a de sens — c'est l'ensemble qui dessine votre carte unique.

Sur notre site, votre profil astral complet est calculé automatiquement dès que vous renseignez votre date, heure et lieu de naissance. Une fenêtre s'ouvre alors sur votre essence profonde.`,
  },
  {
    slug: "runes-vikings-divination",
    title: "Les Runes Nordiques : Sagesse des Vikings",
    subtitle: "Quand Odin sacrifia un œil pour la connaissance",
    excerpt: "L'Elder Futhark, l'alphabet runique des peuples nordiques, est l'un des plus anciens systèmes divinatoires d'Europe. Plongez dans cette tradition millénaire.",
    category: "Traditions",
    readTime: 10,
    date: "2026-04-10",
    author: "Madame Céleste",
    content: `La légende raconte qu'Odin, père des dieux nordiques, se pendit lui-même à Yggdrasil — l'arbre du monde — pendant neuf jours et neuf nuits, transpercé par sa propre lance, afin de recevoir la sagesse des runes. Ce sacrifice ultime fonda l'art runique tel que nous le connaissons.

## L'Elder Futhark

L'alphabet runique le plus ancien comporte 24 signes, regroupés en trois familles de huit runes appelées *Ætts* :

- **Freyr's Aett** : Fehu, Uruz, Thurisaz, Ansuz, Raidho, Kenaz, Gebo, Wunjo
- **Hagal's Aett** : Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Perthro, Algiz, Sowilo
- **Tyr's Aett** : Tiwaz, Berkano, Ehwaz, Mannaz, Laguz, Ingwaz, Dagaz, Othala

Chaque rune porte un nom, un son, et un univers symbolique d'une richesse extraordinaire.

## Plus qu'un alphabet

Les runes étaient gravées sur les armes pour la victoire, sur les pierres funéraires pour honorer les défunts, sur les portes pour la protection. Elles servaient à la fois pour la communication, la magie et la divination.

## Le Tirage Runique

Traditionnellement, les runes sont gravées sur des morceaux de bois, de pierre ou d'os. On les conserve dans une poche en cuir et on les tire à l'aveugle, en concentrant sa question.

Le tirage le plus simple — **La Rune d'Odin** — consiste à tirer une seule rune pour une guidance immédiate.

**Les Nornes** est un tirage à trois runes représentant les trois Nornes du destin : Urd (le passé), Verdandi (le présent) et Skuld (le futur). C'est l'équivalent runique du Passé/Présent/Futur du Tarot.

## La Notion de Rune Inversée

Certaines runes ont une signification différente lorsqu'elles apparaissent à l'envers. Par exemple, Fehu droite parle de richesse et d'abondance, tandis que Fehu inversée évoque la perte ou la cupidité.

Notez cependant que neuf runes ne possèdent pas de forme inversée (Gebo, Hagalaz, Isa, Jera, Sowilo, Ingwaz, Dagaz, Eiwaz, et Wunjo dans certaines traditions).

## La Mystique Runique aujourd'hui

Les runes restent un outil puissant pour quiconque cherche à dialoguer avec les forces archétypales. Plus directes que le Tarot, plus brutes, plus ancrées dans la terre — elles parlent un langage de pierre et de sang.

Sur notre site, vous pouvez consulter les 24 runes Elder Futhark à travers six tirages traditionnels, chacun offrant une perspective unique sur votre question.`,
  },
  {
    slug: "yi-king-i-ching-livre-changements",
    title: "Le Yi-King : Le Livre des Transformations",
    subtitle: "5000 ans de sagesse chinoise condensés en 64 hexagrammes",
    excerpt: "Considéré comme l'un des plus anciens livres de l'humanité, le Yi-King offre une vision profonde du changement perpétuel qui régit toute existence.",
    category: "Traditions",
    readTime: 11,
    date: "2026-03-28",
    author: "Madame Céleste",
    content: `Le Yi-King (ou I-Ching, 易經) signifie littéralement &laquo; Classique des Mutations &raquo;. Compilé il y a environ 3000 ans, ses racines remontent peut-être à 5000 ans dans la Chine ancienne. C'est le plus vieil oracle encore en usage actif aujourd'hui.

## Le Principe Fondamental

Tout dans l'univers est en mouvement perpétuel. Rien n'est figé. Chaque situation contient déjà la graine de sa transformation. Le Yi-King ne prédit pas le futur — il révèle la **dynamique** présente dans une situation donnée.

## Yin et Yang

Le Yi-King repose sur la dualité fondamentale du Yin (féminin, réceptif, sombre, lunaire) et du Yang (masculin, créateur, lumineux, solaire). Ces deux forces opposées et complémentaires donnent naissance à toutes choses.

## Les Trigrammes

Trois lignes superposées — Yin (— —) ou Yang (—) — forment un trigramme. Il existe huit trigrammes fondamentaux, chacun associé à un élément naturel et une qualité énergétique :

- **Ciel** (☰) — Force créatrice
- **Terre** (☷) — Réceptivité absolue
- **Tonnerre** (☳) — Choc créateur
- **Eau** (☵) — Profondeur, danger
- **Montagne** (☶) — Immobilité, méditation
- **Vent** (☴) — Pénétration douce
- **Feu** (☲) — Clarté, adhérence
- **Lac** (☱) — Joie, sérénité

## Les Hexagrammes

L'empilement de deux trigrammes forme un hexagramme — six lignes Yin ou Yang. Il existe 64 hexagrammes possibles, chacun représentant une situation archétypale, une dynamique de transformation.

## La Consultation Traditionnelle

Traditionnellement, on consulte le Yi-King avec des tiges d'achillée ou trois pièces de monnaie. On lance les pièces six fois, chaque lancer générant une ligne (Yin ou Yang) de bas en haut. L'hexagramme ainsi formé répond à votre question.

## Lire la Réponse

Chaque hexagramme s'accompagne d'un **jugement** (un texte ancien interprétant la situation globale) et d'un **conseil** (l'action recommandée). Les lignes peuvent être &laquo; mouvantes &raquo;, indiquant une transformation imminente vers un autre hexagramme.

## La Philosophie en Pratique

Plus qu'un oracle, le Yi-King est une école de sagesse. Sa lecture régulière développe une compréhension subtile du Tao — la voie naturelle des choses. Il enseigne à agir au bon moment, à se retirer quand il le faut, à patienter avec discernement.

Sur notre site, le système de tirage simule fidèlement les pièces traditionnelles, ligne par ligne, et vous offre une interprétation IA approfondie de votre hexagramme.`,
  },
  {
    slug: "chakras-equilibre-energetique",
    title: "Les 7 Chakras : Architecture de l'Énergie Subtile",
    subtitle: "Comprendre les centres d'énergie qui gouvernent votre être",
    excerpt: "De Mūlādhāra à Sahasrāra, les chakras sont les portails de votre énergie vitale. Apprenez à diagnostiquer leurs blocages et à restaurer leur harmonie.",
    category: "Énergie",
    readTime: 9,
    date: "2026-03-15",
    author: "Madame Céleste",
    content: `Le terme &laquo; chakra &raquo; vient du sanskrit *cakra*, signifiant &laquo; roue &raquo; ou &laquo; cercle &raquo;. Dans la tradition hindoue et yogique, les chakras sont des centres tourbillonnants d'énergie subtile situés le long de la colonne vertébrale, connectant le corps physique aux corps énergétiques.

## Les 7 Centres Principaux

**1. Mūlādhāra — Chakra Racine** (rouge, base de la colonne)
Le siège de la sécurité, de l'ancrage, de l'instinct de survie. Élément Terre. Mantra LAM.

**2. Svādhiṣṭhāna — Chakra Sacré** (orange, bas-ventre)
Le centre de la créativité, de la sexualité, des émotions. Élément Eau. Mantra VAM.

**3. Maṇipūra — Chakra du Plexus Solaire** (jaune, au-dessus du nombril)
Le pouvoir personnel, la volonté, la confiance en soi. Élément Feu. Mantra RAM.

**4. Anāhata — Chakra du Cœur** (vert, centre de la poitrine)
L'amour inconditionnel, la compassion, la connexion. Élément Air. Mantra YAM.

**5. Viśuddha — Chakra de la Gorge** (bleu, gorge)
L'expression authentique, la communication, la vérité. Élément Éther. Mantra HAM.

**6. Ājñā — Chakra du Troisième Œil** (indigo, entre les sourcils)
L'intuition, la clairvoyance, la sagesse. Élément Lumière. Mantra OM.

**7. Sahasrāra — Chakra Couronne** (violet/blanc, sommet du crâne)
La connexion divine, l'illumination, l'unité. Élément Conscience. Mantra AH.

## Reconnaître les Déséquilibres

Chaque chakra peut être bloqué, hyperactif ou équilibré. Les signes d'un blocage varient :

- **Racine bloqué** : anxiété, problèmes financiers, douleurs lombaires
- **Sacré bloqué** : blocages créatifs, difficultés émotionnelles
- **Plexus bloqué** : manque de confiance, problèmes digestifs
- **Cœur bloqué** : rancœur, peur d'aimer, isolement
- **Gorge bloqué** : difficulté à s'exprimer, problèmes thyroïdiens
- **Troisième Œil bloqué** : confusion mentale, manque d'intuition
- **Couronne bloqué** : sentiment d'isolement spirituel, perte de sens

## Pratiques de Rééquilibrage

**Cristaux** : Chaque chakra correspond à des cristaux spécifiques (Améthyste pour le troisième œil, Quartz rose pour le cœur, etc.)

**Mantras** : La récitation des bīja-mantras (sons-graines) active chaque centre.

**Yoga** : Certaines postures stimulent des chakras précis. La posture du pigeon ouvre le cœur, la chandelle active la gorge.

**Méditation** : Visualiser la couleur et le symbole du chakra, en y portant l'attention.

**Huiles essentielles** : Le santal pour la racine, le ylang-ylang pour le sacré, la lavande pour la couronne.

## Le Diagnostic Énergétique

Notre bilan des chakras (35 questions) permet d'identifier précisément vos centres bloqués et de recevoir un programme personnalisé de rééquilibrage par IA. Une lecture profonde de votre paysage énergétique actuel.`,
  },
  {
    slug: "numerologie-chemin-de-vie",
    title: "La Numérologie : Décoder votre Chemin de Vie",
    subtitle: "Les nombres comme miroirs de votre destinée",
    excerpt: "Pythagore disait que les nombres gouvernent l'univers. Découvrez comment votre date de naissance et votre nom révèlent votre mission incarnée.",
    category: "Énergie",
    readTime: 10,
    date: "2026-02-28",
    author: "Madame Céleste",
    content: `La numérologie, dans sa forme pythagoricienne, attribue à chaque lettre de l'alphabet une valeur numérique de 1 à 9. En réduisant votre nom complet et votre date de naissance à des nombres simples, on accède à un portrait psycho-spirituel d'une précision remarquable.

## Le Chemin de Vie

C'est le nombre maître de votre profil numérologique. Calculé à partir de votre date de naissance complète (jour + mois + année), réduite à un seul chiffre, il révèle la mission principale de votre incarnation actuelle.

**Exemple** : Pour une personne née le 15 mars 1985 :
1+5+0+3+1+9+8+5 = 32 → 3+2 = 5

Chemin de vie 5 : la liberté, le changement, l'aventure.

## Les Neuf Vibrations

**1 — Le Pionnier** : Leadership, indépendance, initiative.
**2 — Le Diplomate** : Coopération, sensibilité, harmonie.
**3 — Le Créateur** : Expression artistique, joie communicative.
**4 — Le Bâtisseur** : Stabilité, travail méthodique, discipline.
**5 — L'Aventurier** : Liberté, changement, polyvalence.
**6 — Le Guérisseur** : Responsabilité, amour, service aux autres.
**7 — Le Sage** : Spiritualité, analyse, quête de vérité.
**8 — Le Manifesteur** : Pouvoir, abondance, ambition.
**9 — L'Humaniste** : Compassion universelle, sagesse, don de soi.

## Les Nombres Maîtres

Trois nombres ne se réduisent pas : 11, 22 et 33. Ce sont les **Nombres Maîtres**, indiquant une mission spirituelle particulièrement élevée.

- **11** — L'Illuminé : canal entre les mondes, intuition aigüe.
- **22** — Le Grand Bâtisseur : capacité à matérialiser des visions grandioses.
- **33** — Le Maître Enseignant : amour inconditionnel, guérison universelle.

## Les Autres Nombres Clés

**Nombre d'Expression** (votre nom complet) — Comment vous vous exprimez dans le monde.
**Nombre de l'Âme** (les voyelles de votre nom) — Vos désirs profonds.
**Nombre de Personnalité** (les consonnes) — Ce que les autres perçoivent de vous.
**Année Personnelle** (date naissance + année courante) — La vibration de votre année en cours.

## Les Nombres Karmiques

Certains nombres dans votre calcul intermédiaire peuvent signaler une dette karmique :
- **13** : transformation difficile, paresse à dépasser
- **14** : excès, manque de modération
- **16** : effondrement de l'ego, leçon d'humilité
- **19** : abus de pouvoir dans une vie antérieure

## L'Interprétation Holistique

Comme pour l'astrologie, c'est l'ensemble des nombres qui dessine votre portrait complet, pas un seul facteur. Une analyse complète de votre nom et de votre date de naissance offre une cartographie psycho-spirituelle aussi précise qu'un thème astral.

Notre profil numérologique calcule automatiquement tous ces nombres et fournit une interprétation IA personnalisée. Un éclairage complémentaire à l'astrologie pour comprendre qui vous êtes vraiment.`,
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getRecentArticles(n: number = 3): BlogArticle[] {
  return [...BLOG_ARTICLES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}
