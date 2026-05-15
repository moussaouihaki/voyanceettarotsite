// Rider-Waite-Smith Tarot images (public domain 1909).
// Source: Wikimedia Commons — Smith-Waite Tarot.
// Cards are matched against the id scheme from lib/tarot-cards.ts:
//   - major-0 ... major-21
//   - minor-bâtons-{1..14}, minor-coupes-{1..14}, minor-épées-{1..14}, minor-pentacles-{1..14}

const W = "https://upload.wikimedia.org/wikipedia/commons";

const MAJOR: Record<string, string> = {
  "major-0":  `${W}/9/90/RWS_Tarot_00_Fool.jpg`,
  "major-1":  `${W}/d/de/RWS_Tarot_01_Magician.jpg`,
  "major-2":  `${W}/8/88/RWS_Tarot_02_High_Priestess.jpg`,
  "major-3":  `${W}/d/d2/RWS_Tarot_03_Empress.jpg`,
  "major-4":  `${W}/c/c3/RWS_Tarot_04_Emperor.jpg`,
  "major-5":  `${W}/8/8d/RWS_Tarot_05_Hierophant.jpg`,
  "major-6":  `${W}/3/3a/TheLovers.jpg`,
  "major-7":  `${W}/9/9b/RWS_Tarot_07_Chariot.jpg`,
  "major-8":  `${W}/f/f5/RWS_Tarot_08_Strength.jpg`,
  "major-9":  `${W}/4/4d/RWS_Tarot_09_Hermit.jpg`,
  "major-10": `${W}/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg`,
  "major-11": `${W}/e/e0/RWS_Tarot_11_Justice.jpg`,
  "major-12": `${W}/2/2b/RWS_Tarot_12_Hanged_Man.jpg`,
  "major-13": `${W}/d/d7/RWS_Tarot_13_Death.jpg`,
  "major-14": `${W}/f/f8/RWS_Tarot_14_Temperance.jpg`,
  "major-15": `${W}/5/55/RWS_Tarot_15_Devil.jpg`,
  "major-16": `${W}/5/53/RWS_Tarot_16_Tower.jpg`,
  "major-17": `${W}/d/db/RWS_Tarot_17_Star.jpg`,
  "major-18": `${W}/7/7f/RWS_Tarot_18_Moon.jpg`,
  "major-19": `${W}/1/17/RWS_Tarot_19_Sun.jpg`,
  "major-20": `${W}/d/dd/RWS_Tarot_20_Judgement.jpg`,
  "major-21": `${W}/f/ff/RWS_Tarot_21_World.jpg`,
};

const WANDS = [
  `${W}/1/11/Wands01.jpg`, `${W}/0/0f/Wands02.jpg`, `${W}/f/ff/Wands03.jpg`,
  `${W}/a/a4/Wands04.jpg`, `${W}/9/9d/Wands05.jpg`, `${W}/3/3b/Wands06.jpg`,
  `${W}/e/e4/Wands07.jpg`, `${W}/6/6b/Wands08.jpg`, `${W}/4/4d/Tarot_Nine_of_Wands.jpg`,
  `${W}/0/0b/Wands10.jpg`, `${W}/6/6a/Wands11.jpg`, `${W}/1/16/Wands12.jpg`,
  `${W}/0/0d/Wands13.jpg`, `${W}/c/ce/Wands14.jpg`,
];

const CUPS = [
  `${W}/3/36/Cups01.jpg`, `${W}/f/f8/Cups02.jpg`, `${W}/7/7a/Cups03.jpg`,
  `${W}/3/35/Cups04.jpg`, `${W}/d/d7/Cups05.jpg`, `${W}/1/17/Cups06.jpg`,
  `${W}/a/ae/Cups07.jpg`, `${W}/6/60/Cups08.jpg`, `${W}/2/24/Cups09.jpg`,
  `${W}/8/84/Cups10.jpg`, `${W}/a/ad/Cups11.jpg`, `${W}/f/fa/Cups12.jpg`,
  `${W}/6/62/Cups13.jpg`, `${W}/0/04/Cups14.jpg`,
];

const SWORDS = [
  `${W}/1/1a/Swords01.jpg`, `${W}/9/9e/Swords02.jpg`, `${W}/0/02/Swords03.jpg`,
  `${W}/b/bf/Swords04.jpg`, `${W}/2/23/Swords05.jpg`, `${W}/2/29/Swords06.jpg`,
  `${W}/3/34/Swords07.jpg`, `${W}/a/a7/Swords08.jpg`, `${W}/2/2f/Swords09.jpg`,
  `${W}/d/d4/Swords10.jpg`, `${W}/4/4b/Swords11.jpg`, `${W}/b/b0/Swords12.jpg`,
  `${W}/d/d4/Swords13.jpg`, `${W}/3/33/Swords14.jpg`,
];

const PENTS = [
  `${W}/f/fd/Pents01.jpg`, `${W}/9/9f/Pents02.jpg`, `${W}/4/42/Pents03.jpg`,
  `${W}/3/35/Pents04.jpg`, `${W}/9/96/Pents05.jpg`, `${W}/a/a6/Pents06.jpg`,
  `${W}/6/6a/Pents07.jpg`, `${W}/4/49/Pents08.jpg`, `${W}/f/f0/Pents09.jpg`,
  `${W}/4/42/Pents10.jpg`, `${W}/e/ec/Pents11.jpg`, `${W}/d/d5/Pents12.jpg`,
  `${W}/8/88/Pents13.jpg`, `${W}/1/1c/Pents14.jpg`,
];

export const TAROT_IMAGES: Record<string, string> = (() => {
  const map: Record<string, string> = { ...MAJOR };
  WANDS.forEach((url, i) => { map[`minor-bâtons-${i + 1}`] = url; });
  CUPS.forEach((url, i) => { map[`minor-coupes-${i + 1}`] = url; });
  SWORDS.forEach((url, i) => { map[`minor-épées-${i + 1}`] = url; });
  PENTS.forEach((url, i) => { map[`minor-pentacles-${i + 1}`] = url; });
  return map;
})();

export function getTarotImage(cardId: string): string | null {
  return TAROT_IMAGES[cardId] || null;
}
