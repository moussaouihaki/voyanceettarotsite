// Tarot de Marseille — CBD edition (Camoin-Jodorowsky restoration of Nicolas Conver 1760)
// Images hosted by astrotarot-ca/itutarot (public domain artwork, pre-1900 deck)
// Naming: A1–A22 (majeurs), W/C/S/D 1–14 (mineurs Bâtons/Coupes/Épées/Deniers)
//
// Key difference vs Rider-Waite-Smith:
//   Marseille VIII = La Justice  (RWS major-11)
//   Marseille XI  = La Force     (RWS major-8)

const BASE = "https://raw.githubusercontent.com/astrotarot-ca/itutarot/master/tmcbdtut/w300px";

// Major arcana: tarot-cards.ts id → Marseille file
const MAJOR: Record<string, string> = {
  "major-0":  `${BASE}/A22.jpg`, // Le Mat (unnumbered → A22 in this deck)
  "major-1":  `${BASE}/A1.jpg`,  // Le Bateleur
  "major-2":  `${BASE}/A2.jpg`,  // La Papesse
  "major-3":  `${BASE}/A3.jpg`,  // L'Impératrice
  "major-4":  `${BASE}/A4.jpg`,  // L'Empereur
  "major-5":  `${BASE}/A5.jpg`,  // Le Pape
  "major-6":  `${BASE}/A6.jpg`,  // L'Amoureux
  "major-7":  `${BASE}/A7.jpg`,  // Le Chariot
  "major-8":  `${BASE}/A11.jpg`, // La Force (XI en Marseille — inversion avec RWS)
  "major-9":  `${BASE}/A9.jpg`,  // L'Hermite
  "major-10": `${BASE}/A10.jpg`, // La Roue de Fortune
  "major-11": `${BASE}/A8.jpg`,  // La Justice (VIII en Marseille — inversion avec RWS)
  "major-12": `${BASE}/A12.jpg`, // Le Pendu
  "major-13": `${BASE}/A13.jpg`, // L'Arcane Sans Nom
  "major-14": `${BASE}/A14.jpg`, // Tempérance
  "major-15": `${BASE}/A15.jpg`, // Le Diable
  "major-16": `${BASE}/A16.jpg`, // La Maison-Dieu
  "major-17": `${BASE}/A17.jpg`, // L'Étoile
  "major-18": `${BASE}/A18.jpg`, // La Lune
  "major-19": `${BASE}/A19.jpg`, // Le Soleil
  "major-20": `${BASE}/A20.jpg`, // Le Jugement
  "major-21": `${BASE}/A21.jpg`, // Le Monde
};

export const MARSEILLE_IMAGES: Record<string, string> = (() => {
  const map: Record<string, string> = { ...MAJOR };

  for (let i = 1; i <= 14; i++) {
    map[`minor-bâtons-${i}`]    = `${BASE}/W${i}.jpg`; // Bâtons = Wands
    map[`minor-coupes-${i}`]    = `${BASE}/C${i}.jpg`; // Coupes = Cups
    map[`minor-épées-${i}`]     = `${BASE}/S${i}.jpg`; // Épées  = Swords
    map[`minor-pentacles-${i}`] = `${BASE}/D${i}.jpg`; // Deniers = Pentacles
  }

  return map;
})();

export function getMarseilleImage(cardId: string): string | null {
  return MARSEILLE_IMAGES[cardId] ?? null;
}
