export interface PlanetaryEvent {
  id: string;
  date: string; // ISO date "YYYY-MM-DD"
  endDate?: string; // Pour les rétrogrades
  type: "retrograde" | "direct" | "eclipse" | "fullmoon" | "newmoon" | "ingress" | "special";
  planet?: string;
  title: string;
  description: string;
  rituel?: string; // conseil rituel lié
  impact: "majeur" | "moyen" | "mineur";
  emoji: string;
}

export const PLANETARY_EVENTS_2026: PlanetaryEvent[] = [
  // Rétrogrades Mercure 2026
  { id: "merc-retro-jan26", date: "2026-01-25", endDate: "2026-02-14", type: "retrograde", planet: "Mercure", title: "Mercure Rétrograde", description: "Mercure rétrograde en Verseau. Évitez de signer des contrats et de prendre des décisions importantes. Période idéale pour réviser, relire et reprendre des projets en pause.", rituel: "Méditez sur ce qui mérite d'être révisé dans votre vie. Brûlez une bougie bleue.", impact: "majeur", emoji: "☿" },
  { id: "merc-direct-feb26", date: "2026-02-14", type: "direct", planet: "Mercure", title: "Mercure redevient Direct", description: "Mercure reprend sa course directe. Les communications et transports reprennent normalement.", impact: "moyen", emoji: "☿" },
  { id: "merc-retro-may26", date: "2026-05-18", endDate: "2026-06-11", type: "retrograde", planet: "Mercure", title: "Mercure Rétrograde", description: "Mercure rétrograde en Gémeaux, son signe de domicile — effets amplifiés sur la communication et les voyages courts.", impact: "majeur", emoji: "☿" },
  { id: "merc-direct-jun26", date: "2026-06-11", type: "direct", planet: "Mercure", title: "Mercure redevient Direct", description: "Mercure redevient direct en Gémeaux. Reprenez vos projets de communication.", impact: "moyen", emoji: "☿" },
  { id: "merc-retro-sep26", date: "2026-09-12", endDate: "2026-10-04", type: "retrograde", planet: "Mercure", title: "Mercure Rétrograde", description: "Mercure rétrograde en Balance. Attention aux malentendus dans les relations.", impact: "majeur", emoji: "☿" },
  { id: "merc-direct-oct26", date: "2026-10-04", type: "direct", planet: "Mercure", title: "Mercure redevient Direct", description: "Mercure reprend sa marche directe.", impact: "moyen", emoji: "☿" },
  // Rétrograde Vénus 2026
  { id: "venus-retro-mar26", date: "2026-03-01", endDate: "2026-04-12", type: "retrograde", planet: "Vénus", title: "Vénus Rétrograde", description: "Vénus rétrograde en Bélier. Période de réévaluation amoureuse et financière. Des ex peuvent réapparaître. Évitez les grosses dépenses ou décisions sentimentales impulsives.", rituel: "Méditez sur la valeur que vous vous accordez. Portez du quartz rose.", impact: "majeur", emoji: "♀" },
  { id: "venus-direct-apr26", date: "2026-04-12", type: "direct", planet: "Vénus", title: "Vénus redevient Directe", description: "Vénus reprend son cours direct. Le cœur et les finances retrouvent leur clarté.", impact: "moyen", emoji: "♀" },
  // Éclipses 2026
  { id: "eclipse-sol-feb26", date: "2026-02-17", type: "eclipse", title: "Éclipse Annulaire de Soleil", description: "Éclipse annulaire de Soleil en Poissons. Puissante porte de manifestation. Rédigez vos intentions les plus profondes — elles ont un écho cosmique amplifié.", rituel: "Écrivez 3 intentions sur du papier doré. Méditez face au ciel.", impact: "majeur", emoji: "🌑" },
  { id: "eclipse-lune-mar26", date: "2026-03-03", type: "eclipse", title: "Éclipse Totale de Lune", description: "Éclipse totale de Lune en Vierge. Grande période de lâcher-prise et de clôture de cycles. Libérez ce qui ne vous sert plus.", rituel: "Nettoyez votre espace, brûlez ce qui symbolise vos vieux schémas.", impact: "majeur", emoji: "🌕" },
  { id: "eclipse-sol-aug26", date: "2026-08-12", type: "eclipse", title: "Éclipse Totale de Soleil", description: "Éclipse totale de Soleil en Lion — la plus puissante de l'année. Nouveau départ radical dans les domaines de la créativité, de l'amour et de l'identité.", rituel: "Plantez une graine d'intention nouvelle. Portez de l'or.", impact: "majeur", emoji: "🌑" },
  { id: "eclipse-lune-aug26", date: "2026-08-28", type: "eclipse", title: "Éclipse de Lune", description: "Éclipse pénombrale de Lune en Poissons. Révélations émotionnelles et spirituelles.", impact: "moyen", emoji: "🌕" },
  // Pleines Lunes 2026
  { id: "fl-jan26", date: "2026-01-03", type: "fullmoon", title: "Pleine Lune en Cancer", description: "Pleine Lune en Cancer. Émotions intenses, besoin de foyer et de sécurité. Moment idéal pour honorer votre famille et vos racines.", rituel: "Posez vos cristaux sous la lune. Cuisinez un repas pour vos proches.", impact: "moyen", emoji: "🌕" },
  { id: "fl-feb26", date: "2026-02-01", type: "fullmoon", title: "Pleine Lune en Lion", description: "Pleine Lune en Lion. Créativité, amour propre et expression personnelle au maximum.", rituel: "Exprimez-vous artistiquement. Dansez ou chantez.", impact: "moyen", emoji: "🌕" },
  { id: "fl-mar26", date: "2026-03-03", type: "fullmoon", title: "Pleine Lune en Vierge (Éclipse)", description: "Pleine Lune en Vierge doublée d'une éclipse totale. Exceptionnelle énergie de lâcher-prise et de purification.", impact: "majeur", emoji: "🌕" },
  { id: "fl-apr26", date: "2026-04-02", type: "fullmoon", title: "Pleine Lune en Balance", description: "Pleine Lune en Balance. Équilibre dans les relations, justice et harmonie.", rituel: "Écrivez ce que vous souhaitez équilibrer dans vos relations.", impact: "moyen", emoji: "🌕" },
  { id: "fl-may26-1", date: "2026-05-01", type: "fullmoon", title: "Pleine Lune en Scorpion", description: "Pleine Lune en Scorpion. Transformations profondes, révélations cachées.", impact: "moyen", emoji: "🌕" },
  { id: "fl-may26-2", date: "2026-05-31", type: "fullmoon", title: "Pleine Lune Bleue en Sagittaire", description: "Deuxième pleine lune du mois (Lune Bleue) en Sagittaire. Expansion, sagesse et aventure. Rare et puissante.", rituel: "Faites un vœu de voyage ou d'expansion.", impact: "majeur", emoji: "🌕" },
  { id: "fl-jun26", date: "2026-06-30", type: "fullmoon", title: "Pleine Lune en Capricorne", description: "Pleine Lune en Capricorne. Bilan professionnel et ambitions.", impact: "moyen", emoji: "🌕" },
  { id: "fl-jul26", date: "2026-07-29", type: "fullmoon", title: "Pleine Lune en Verseau", description: "Pleine Lune en Verseau. Libération des schémas anciens, innovation.", impact: "moyen", emoji: "🌕" },
  { id: "fl-aug26", date: "2026-08-28", type: "fullmoon", title: "Pleine Lune en Poissons (Éclipse)", description: "Pleine Lune en Poissons avec éclipse pénombrale. Intuition, rêves et dissolution des frontières.", impact: "majeur", emoji: "🌕" },
  { id: "fl-sep26", date: "2026-09-26", type: "fullmoon", title: "Pleine Lune en Bélier", description: "Pleine Lune en Bélier. Courage, initiative et nouveau départ.", impact: "moyen", emoji: "🌕" },
  { id: "fl-oct26", date: "2026-10-26", type: "fullmoon", title: "Pleine Lune en Taureau", description: "Pleine Lune en Taureau. Abondance, sécurité matérielle et plaisirs sensoriels.", impact: "moyen", emoji: "🌕" },
  { id: "fl-nov26", date: "2026-11-24", type: "fullmoon", title: "Pleine Lune en Gémeaux", description: "Pleine Lune en Gémeaux. Communication, échanges et curiosité intellectuelle.", impact: "moyen", emoji: "🌕" },
  { id: "fl-dec26", date: "2026-12-24", type: "fullmoon", title: "Pleine Lune de Noël en Cancer", description: "Pleine Lune en Cancer la nuit de Noël. Émotions familiales intenses. Moment magique pour les intentions de foyer.", impact: "majeur", emoji: "🌕" },
  // Nouvelles Lunes 2026
  { id: "nl-jan26", date: "2026-01-18", type: "newmoon", title: "Nouvelle Lune en Verseau", description: "Nouvelle Lune en Verseau. Intentions pour l'innovation, la liberté et les amitiés.", rituel: "Écrivez 10 intentions pour les 6 prochains mois.", impact: "moyen", emoji: "🌑" },
  { id: "nl-feb26", date: "2026-02-17", type: "newmoon", title: "Nouvelle Lune en Poissons (Éclipse)", description: "Nouvelle Lune solaire en Poissons avec éclipse annulaire. Intentions spirituelles puissantes.", impact: "majeur", emoji: "🌑" },
  { id: "nl-mar26", date: "2026-03-18", type: "newmoon", title: "Nouvelle Lune en Poissons", description: "Nouvelle Lune en Poissons. Rêves, intuition et compassion.", impact: "moyen", emoji: "🌑" },
  { id: "nl-apr26", date: "2026-04-17", type: "newmoon", title: "Nouvelle Lune en Bélier", description: "Nouvelle Lune en Bélier. Nouveau départ énergique, initiatives et projets.", impact: "moyen", emoji: "🌑" },
  { id: "nl-may26", date: "2026-05-16", type: "newmoon", title: "Nouvelle Lune en Taureau", description: "Nouvelle Lune en Taureau. Intentions d'abondance et de stabilité matérielle.", impact: "moyen", emoji: "🌑" },
  { id: "nl-jun26", date: "2026-06-15", type: "newmoon", title: "Nouvelle Lune en Gémeaux", description: "Nouvelle Lune en Gémeaux. Intentions de communication et d'apprentissage.", impact: "moyen", emoji: "🌑" },
  { id: "nl-jul26", date: "2026-07-14", type: "newmoon", title: "Nouvelle Lune en Cancer", description: "Nouvelle Lune en Cancer. Intentions pour la famille, le foyer et les racines.", impact: "moyen", emoji: "🌑" },
  { id: "nl-aug26", date: "2026-08-12", type: "newmoon", title: "Nouvelle Lune en Lion (Éclipse Totale)", description: "Nouvelle Lune en Lion avec éclipse totale de Soleil. La plus puissante porte de manifestation de l'année.", impact: "majeur", emoji: "🌑" },
  { id: "nl-sep26", date: "2026-09-11", type: "newmoon", title: "Nouvelle Lune en Vierge", description: "Nouvelle Lune en Vierge. Intentions de santé, organisation et service.", impact: "moyen", emoji: "🌑" },
  { id: "nl-oct26", date: "2026-10-10", type: "newmoon", title: "Nouvelle Lune en Balance", description: "Nouvelle Lune en Balance. Intentions de paix, d'harmonie et de justice.", impact: "moyen", emoji: "🌑" },
  { id: "nl-nov26", date: "2026-11-09", type: "newmoon", title: "Nouvelle Lune en Scorpion", description: "Nouvelle Lune en Scorpion. Intentions de transformation et de régénération.", impact: "moyen", emoji: "🌑" },
  { id: "nl-dec26", date: "2026-12-08", type: "newmoon", title: "Nouvelle Lune en Sagittaire", description: "Nouvelle Lune en Sagittaire. Intentions de voyage, sagesse et expansion.", impact: "moyen", emoji: "🌑" },
  // Entrées planétaires majeures
  { id: "uranus-gem26", date: "2026-07-07", type: "ingress", planet: "Uranus", title: "Uranus entre en Gémeaux", description: "Uranus entre définitivement en Gémeaux pour 7 ans. Révolution dans la communication, les transports, l'intelligence artificielle et les échanges d'information.", impact: "majeur", emoji: "⛢" },
  { id: "jupiter-sco26", date: "2026-10-22", type: "ingress", planet: "Jupiter", title: "Jupiter entre en Scorpion", description: "Jupiter entre en Scorpion. Expansion dans les domaines de la transformation, de l'héritage et des ressources partagées.", impact: "majeur", emoji: "♃" },
];

// Événements 2025 déjà passés mais récents
export const PLANETARY_EVENTS_2025_LATE: PlanetaryEvent[] = [
  { id: "saturn-aries25", date: "2025-05-25", type: "ingress", planet: "Saturne", title: "Saturne en Bélier", description: "Saturne entre en Bélier pour 2.5 ans. Nouvelles responsabilités liées à l'identité et aux projets personnels.", impact: "majeur", emoji: "♄" },
  { id: "neptune-aries25", date: "2025-03-30", type: "ingress", planet: "Neptune", title: "Neptune en Bélier", description: "Neptune entre en Bélier pour 14 ans. Dissolution des vieilles illusions, renaissance spirituelle collective.", impact: "majeur", emoji: "♆" },
];

export function getAllEvents(): PlanetaryEvent[] {
  return [...PLANETARY_EVENTS_2025_LATE, ...PLANETARY_EVENTS_2026].sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingEvents(count = 5): PlanetaryEvent[] {
  const today = new Date().toISOString().split('T')[0];
  return getAllEvents().filter(e => e.date >= today).slice(0, count);
}

export function getCurrentMonthEvents(): PlanetaryEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${year}-${month}`;
  return getAllEvents().filter(e => e.date.startsWith(prefix));
}

export function getEventsByType(type: PlanetaryEvent['type']): PlanetaryEvent[] {
  return getAllEvents().filter(e => e.type === type);
}
