"use client";
import React from "react";

function Sym({ children, color = "currentColor", size = 48 }: {
  children: React.ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60"
      fill="none" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

type SP = { color?: string; size?: number };

const SYMBOLS: Record<number, (p: SP) => React.ReactElement> = {
  // 1. Le Cavalier
  1: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="34" cy="40" rx="14" ry="9" />
      <line x1="23" y1="34" x2="17" y2="21" strokeWidth="3" />
      <ellipse cx="14" cy="17" rx="5" ry="6" transform="rotate(-15 14 17)" />
      <path d="M11,13 L9,8 L15,11" />
      <path d="M24,48 L21,56 M32,49 L31,56 M40,48 L43,56 M46,44 L49,53" />
      <path d="M48,36 C54,29 53,21 47,17" />
      <circle cx="22" cy="29" r="4" />
      <path d="M22,33 L19,41" />
    </Sym>
  ),
  // 2. Le Trèfle
  2: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="22" cy="33" r="10" />
      <circle cx="38" cy="33" r="10" />
      <circle cx="30" cy="21" r="10" />
      <line x1="30" y1="40" x2="30" y2="55" strokeWidth="2" />
      <path d="M22,53 L38,53" />
    </Sym>
  ),
  // 3. Le Navire
  3: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M5,40 Q30,52 55,40 L50,32 Q30,36 10,32 Z" />
      <line x1="30" y1="10" x2="30" y2="34" />
      <path d="M30,12 L47,28 L30,28 Z" />
      <path d="M30,16 L13,30 L30,30 Z" />
      <path d="M30,10 L40,13 L30,16" />
      <path d="M5,44 Q11,41 17,44 Q23,47 29,44 Q35,41 41,44 Q47,47 55,44" strokeWidth="1.2" />
    </Sym>
  ),
  // 4. La Maison
  4: ({ color, size }) => (
    <Sym color={color} size={size}>
      <rect x="10" y="28" width="40" height="26" />
      <path d="M6,28 L30,6 L54,28" />
      <path d="M23,54 L23,40 Q30,36 37,40 L37,54" />
      <rect x="13" y="32" width="10" height="8" rx="1" />
      <rect x="37" y="32" width="10" height="8" rx="1" />
      <rect x="38" y="11" width="6" height="10" />
    </Sym>
  ),
  // 5. L'Arbre
  5: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M26,54 L26,38 M34,54 L34,38" />
      <circle cx="30" cy="26" r="16" />
      <circle cx="30" cy="24" r="9" strokeWidth="0.9" strokeOpacity="0.45" />
      <path d="M26,54 L20,57 M34,54 L40,57" />
    </Sym>
  ),
  // 6. Les Nuages
  6: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M8,30 Q8,20 18,20 Q20,12 30,12 Q42,12 44,22 Q52,22 52,30 Q52,38 44,38 L16,38 Q8,38 8,30 Z" />
      <path d="M6,48 Q6,40 14,40 Q16,34 24,34 Q32,34 32,42 Q36,42 36,48 Q36,54 26,54 L14,54 Q6,54 6,48 Z" />
    </Sym>
  ),
  // 7. Le Serpent
  7: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M14,56 C14,42 46,42 46,28 C46,14 14,14 14,6" />
      <ellipse cx="16" cy="5" rx="5" ry="4" transform="rotate(15 16 5)" />
      <path d="M13,3 L10,1 M13,3 L10,5" strokeWidth="1" />
      <path d="M14,28 C14,38 46,38 46,28" strokeWidth="0.7" strokeOpacity="0.4" />
    </Sym>
  ),
  // 8. Le Cercueil
  8: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M20,4 L40,4 L52,16 L52,50 L40,56 L20,56 L8,50 L8,16 Z" />
      <line x1="8" y1="20" x2="52" y2="20" />
      <line x1="30" y1="8" x2="30" y2="18" />
      <line x1="24" y1="13" x2="36" y2="13" />
      <path d="M22,42 Q30,38 38,42" strokeWidth="1.5" />
    </Sym>
  ),
  // 9. Le Bouquet
  9: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="20" cy="18" r="8" />
      <circle cx="30" cy="14" r="8" />
      <circle cx="40" cy="18" r="8" />
      <circle cx="20" cy="18" r="3" fill="currentColor" fillOpacity="0.25" strokeWidth="1" />
      <circle cx="30" cy="14" r="3" fill="currentColor" fillOpacity="0.25" strokeWidth="1" />
      <circle cx="40" cy="18" r="3" fill="currentColor" fillOpacity="0.25" strokeWidth="1" />
      <path d="M20,26 L28,42 M30,22 L30,42 M40,26 L32,42" />
      <path d="M22,34 C18,30 15,33 18,36" />
      <path d="M38,34 C42,30 45,33 42,36" />
      <path d="M25,44 Q30,48 35,44" />
      <path d="M25,44 L22,52 M35,44 L38,52" />
    </Sym>
  ),
  // 10. La Faux
  10: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M14,56 L44,10" strokeWidth="2.5" />
      <circle cx="14" cy="56" r="3" />
      <line x1="26" y1="40" x2="30" y2="36" />
      <path d="M44,10 C56,12 60,24 48,34 C44,38 36,38 34,32" />
      <path d="M44,10 C52,14 56,26 44,30" strokeWidth="0.9" />
    </Sym>
  ),
  // 11. Le Fouet
  11: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M10,12 L24,30" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M13,15 L11,18 M16,19 L14,22 M19,23 L17,26" strokeWidth="1" />
      <path d="M24,30 C30,34 34,28 40,32 C46,36 48,42 46,50 C45,54 44,56 42,58" strokeWidth="2" />
      <path d="M42,58 C44,56 46,55 48,56" strokeWidth="1" />
    </Sym>
  ),
  // 12. Les Oiseaux
  12: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M6,20 Q12,13 18,20 Q24,27 30,20" strokeWidth="2" />
      <ellipse cx="18" cy="21" rx="4" ry="2.5" transform="rotate(10 18 21)" />
      <path d="M18,21 L14,25" strokeWidth="1.2" />
      <path d="M30,34 Q36,27 42,34 Q48,41 54,34" strokeWidth="2" />
      <ellipse cx="42" cy="35" rx="4" ry="2.5" transform="rotate(10 42 35)" />
      <path d="M42,35 L38,40" strokeWidth="1.2" />
    </Sym>
  ),
  // 13. L'Enfant
  13: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="14" r="9" />
      <path d="M22,12 Q20,5 27,4 Q30,3 33,4 Q40,5 38,12" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      <path d="M24,24 L24,38 Q30,40 36,38 L36,24 Q33,22 27,22 Z" />
      <path d="M24,26 L14,32 M36,26 L46,32" />
      <path d="M26,38 L24,52 M34,38 L36,52" />
      <path d="M21,52 L27,52 M33,52 L39,52" />
    </Sym>
  ),
  // 14. Le Renard
  14: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="26" cy="42" rx="16" ry="11" />
      <path d="M22,32 C18,28 10,30 8,36 C6,42 12,48 20,46 C24,45 26,42 26,32 Z" />
      <path d="M10,32 L6,20 L18,28" />
      <path d="M22,30 L20,18 L28,26" />
      <circle cx="14" cy="34" r="2" fill="currentColor" fillOpacity="0.6" />
      <ellipse cx="7" cy="38" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.4" />
      <path d="M42,40 C54,32 58,22 52,14 C48,8 42,12 40,18 C38,24 44,32 42,38 Z" />
    </Sym>
  ),
  // 15. L'Ours
  15: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="30" cy="42" rx="20" ry="14" />
      <circle cx="30" cy="22" r="13" />
      <circle cx="20" cy="11" r="5" />
      <circle cx="40" cy="11" r="5" />
      <ellipse cx="30" cy="27" rx="7" ry="5" />
      <ellipse cx="30" cy="24" rx="3" ry="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="22" cy="20" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="38" cy="20" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <path d="M12,50 L8,56 M48,50 L52,56" />
    </Sym>
  ),
  // 16. Les Étoiles
  16: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M30,5 L35,22 L53,22 L39,33 L44,50 L30,39 L16,50 L21,33 L7,22 L25,22 Z" />
      <circle cx="30" cy="30" r="5" fill="currentColor" fillOpacity="0.2" stroke="none" />
      <path d="M50,8 L51.5,13 L56,13 L52.5,16 L54,21 L50,18 L46,21 L47.5,16 L44,13 L48.5,13 Z" strokeWidth="1" />
      <path d="M10,46 L11,50 L15,50 L12,52.5 L13,56 L10,54 L7,56 L8,52.5 L5,50 L9,50 Z" strokeWidth="1" />
    </Sym>
  ),
  // 17. La Cigogne
  17: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M26,56 L26,38 M34,56 L34,38" strokeWidth="2" />
      <path d="M22,56 L26,56 L30,56 M30,56 L34,56 L38,56" />
      <ellipse cx="30" cy="30" rx="12" ry="9" />
      <path d="M18,26 C14,20 16,14 22,16 C26,18 28,22 30,24" />
      <path d="M30,22 C28,14 24,8 26,4" strokeWidth="2.5" />
      <circle cx="26" cy="4" r="4" />
      <path d="M22,3 L8,2" strokeWidth="2" />
      <circle cx="25" cy="3" r="1.2" fill="currentColor" />
    </Sym>
  ),
  // 18. Le Chien
  18: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="30" cy="38" rx="16" ry="14" />
      <circle cx="30" cy="20" r="12" />
      <path d="M19,14 C14,12 12,18 14,24 C16,28 22,26 22,20" />
      <path d="M41,14 C46,12 48,18 46,24 C44,28 38,26 38,20" />
      <ellipse cx="30" cy="24" rx="6" ry="4" />
      <ellipse cx="30" cy="22" rx="2.5" ry="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="23" cy="18" r="2" fill="currentColor" fillOpacity="0.7" />
      <circle cx="37" cy="18" r="2" fill="currentColor" fillOpacity="0.7" />
      <path d="M46,34 C52,28 54,22 50,18" />
      <path d="M22,50 L20,56 M38,50 L40,56" />
    </Sym>
  ),
  // 19. La Tour
  19: ({ color, size }) => (
    <Sym color={color} size={size}>
      <rect x="16" y="14" width="28" height="40" />
      <path d="M16,14 L16,8 L21,8 L21,14 M25,14 L25,8 L30,8 L30,14 M34,14 L34,8 L39,8 L39,14 M43,14 L43,8 L44,8" strokeWidth="1.5" />
      <path d="M26,22 L30,18 L34,22 L34,30 L26,30 Z" strokeWidth="1.2" />
      <path d="M26,38 L30,34 L34,38 L34,46 L26,46 Z" strokeWidth="1.2" />
      <line x1="10" y1="54" x2="50" y2="54" />
      <path d="M24,54 L24,48 Q30,44 36,48 L36,54" />
    </Sym>
  ),
  // 20. Le Jardin
  20: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="14" cy="20" r="10" />
      <line x1="14" y1="30" x2="14" y2="44" strokeWidth="2" />
      <circle cx="46" cy="20" r="10" />
      <line x1="46" y1="30" x2="46" y2="44" strokeWidth="2" />
      <path d="M20,54 L20,34 Q30,26 40,34 L40,54" strokeWidth="1.8" />
      <line x1="20" y1="42" x2="40" y2="42" />
      <line x1="30" y1="34" x2="30" y2="54" />
      <line x1="10" y1="54" x2="50" y2="54" />
    </Sym>
  ),
  // 21. La Montagne
  21: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M8,52 L28,8 L48,52 Z" />
      <path d="M2,52 L18,22 L34,52 Z" />
      <path d="M26,52 L44,18 L58,52 Z" fill="currentColor" fillOpacity="0.05" />
      <path d="M28,8 L24,16 L32,16 Z" fill="currentColor" fillOpacity="0.3" strokeWidth="0.8" />
      <path d="M44,18 L41,25 L47,25 Z" fill="currentColor" fillOpacity="0.3" strokeWidth="0.8" />
      <line x1="2" y1="52" x2="58" y2="52" />
    </Sym>
  ),
  // 22. Le Chemin
  22: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M30,56 L30,36" strokeWidth="2.5" />
      <path d="M30,36 Q22,24 14,10" strokeWidth="2" />
      <path d="M30,36 Q38,24 46,10" strokeWidth="2" />
      <path d="M26,56 Q18,40 10,8" strokeWidth="0.8" strokeOpacity="0.5" />
      <path d="M34,56 Q42,40 50,8" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="30" cy="36" r="3" fill="currentColor" fillOpacity="0.3" stroke="none" />
    </Sym>
  ),
  // 23. Les Souris
  23: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="32" cy="38" rx="16" ry="12" />
      <circle cx="16" cy="34" r="10" />
      <circle cx="10" cy="24" r="5" />
      <circle cx="22" cy="22" r="5" />
      <circle cx="12" cy="32" r="2" fill="currentColor" fillOpacity="0.8" />
      <circle cx="7" cy="36" r="1.5" fill="currentColor" fillOpacity="0.6" />
      <path d="M8,34 L2,32 M8,35 L2,35 M8,36 L2,38" strokeWidth="0.8" />
      <path d="M48,38 C56,34 58,26 52,22 C48,20 44,24 44,28" />
    </Sym>
  ),
  // 24. Le Cœur
  24: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M30,52 C20,42 6,36 6,22 C6,12 14,6 22,8 C26,9 28,12 30,16 C32,12 34,9 38,8 C46,6 54,12 54,22 C54,36 40,42 30,52 Z" />
      <path d="M30,44 C24,37 16,33 16,26 C16,20 20,16 24,17" strokeWidth="0.8" strokeOpacity="0.5" />
    </Sym>
  ),
  // 25. L'Anneau
  25: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="34" r="18" strokeWidth="5" />
      <path d="M22,16 L30,8 L38,16 L34,24 L26,24 Z" strokeWidth="1.8" />
      <line x1="30" y1="8" x2="30" y2="24" strokeWidth="0.8" />
      <line x1="22" y1="16" x2="38" y2="16" strokeWidth="0.8" />
      <line x1="26" y1="24" x2="22" y2="16" strokeWidth="0.8" />
      <line x1="34" y1="24" x2="38" y2="16" strokeWidth="0.8" />
    </Sym>
  ),
  // 26. Le Livre
  26: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M4,12 L28,12 L28,52 Q18,54 4,52 Z" />
      <path d="M32,12 L56,12 Q56,52 32,52 Z" />
      <path d="M28,12 Q30,9 32,12 L32,52 Q30,55 28,52 Z" />
      <path d="M8,20 L24,20 M8,26 L24,26 M8,32 L24,32 M8,38 L20,38" strokeWidth="0.9" />
      <path d="M36,20 L52,20 M36,26 L52,26 M36,32 L52,32 M36,38 L48,38" strokeWidth="0.9" />
    </Sym>
  ),
  // 27. La Lettre
  27: ({ color, size }) => (
    <Sym color={color} size={size}>
      <rect x="6" y="14" width="48" height="36" rx="2" />
      <path d="M6,14 L30,36 L54,14" />
      <path d="M6,50 L22,34 M54,50 L38,34" />
      <circle cx="30" cy="37" r="6" fill="currentColor" fillOpacity="0.2" />
      <path d="M28,35 L30,37 L32,35 M28,39 L30,37 L32,39" strokeWidth="1" />
    </Sym>
  ),
  // 28. L'Homme
  28: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="10" r="8" />
      <path d="M16,20 Q30,16 44,20 L42,40 L18,40 Z" />
      <path d="M27,20 L30,26 L33,20" strokeWidth="1" />
      <path d="M18,22 L8,34 M42,22 L52,34" />
      <circle cx="8" cy="36" r="2.5" />
      <circle cx="52" cy="36" r="2.5" />
      <path d="M22,40 L20,54 M38,40 L40,54" />
      <path d="M17,54 L24,54 M37,54 L43,54" strokeWidth="2" />
    </Sym>
  ),
  // 29. La Femme
  29: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="9" r="8" />
      <path d="M22,6 Q20,0 30,0 Q40,0 38,6" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />
      <path d="M22,18 Q30,14 38,18 L36,30 L24,30 Z" />
      <path d="M24,30 L16,56 Q30,60 44,56 L36,30 Z" />
      <path d="M22,20 L12,32 M38,20 L48,32" />
      <circle cx="11" cy="34" r="2.5" />
      <circle cx="49" cy="34" r="2.5" />
      <path d="M24,42 Q30,46 36,42" strokeWidth="1" strokeOpacity="0.6" />
    </Sym>
  ),
  // 30. Le Lys
  30: ({ color, size }) => (
    <Sym color={color} size={size}>
      <line x1="30" y1="54" x2="30" y2="30" strokeWidth="2" />
      <path d="M30,46 C24,42 20,36 22,30" />
      <path d="M30,46 C36,42 40,36 38,30" />
      <path d="M30,30 C26,22 20,18 22,10 C24,4 30,6 30,14" />
      <path d="M30,30 C36,22 42,20 42,12 C42,4 36,6 30,14" />
      <path d="M30,22 C28,14 28,6 30,4 C32,2 32,12 30,22" />
      <path d="M30,30 C24,34 20,42 22,48" />
      <path d="M30,30 C36,34 40,42 38,48" />
      <line x1="30" y1="20" x2="28" y2="14" strokeWidth="0.8" />
      <line x1="30" y1="20" x2="32" y2="14" strokeWidth="0.8" />
    </Sym>
  ),
  // 31. Le Soleil
  31: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="30" r="12" />
      <circle cx="30" cy="30" r="7" fill="currentColor" fillOpacity="0.2" stroke="none" />
      <line x1="30" y1="4" x2="30" y2="14" strokeWidth="2.5" />
      <line x1="30" y1="46" x2="30" y2="56" strokeWidth="2.5" />
      <line x1="4" y1="30" x2="14" y2="30" strokeWidth="2.5" />
      <line x1="46" y1="30" x2="56" y2="30" strokeWidth="2.5" />
      <line x1="10" y1="10" x2="17" y2="17" strokeWidth="2" />
      <line x1="43" y1="43" x2="50" y2="50" strokeWidth="2" />
      <line x1="50" y1="10" x2="43" y2="17" strokeWidth="2" />
      <line x1="17" y1="43" x2="10" y2="50" strokeWidth="2" />
    </Sym>
  ),
  // 32. La Lune
  32: ({ color, size }) => (
    <Sym color={color} size={size}>
      <path d="M44,10 C54,20 54,40 44,50 C36,58 22,56 14,48 C22,52 36,50 42,40 C48,28 44,14 38,8 C40,8 42,9 44,10 Z"
        fill="currentColor" fillOpacity="0.15" />
      <path d="M44,10 C54,20 54,40 44,50 C36,58 22,56 14,48 C22,52 36,50 42,40 C48,28 44,14 38,8 C40,8 42,9 44,10 Z" />
      <path d="M14,18 L15.2,22 L19,22 L16,24.5 L17.2,28 L14,25.5 L10.8,28 L12,24.5 L9,22 L12.8,22 Z" strokeWidth="0.9" />
      <circle cx="8" cy="36" r="2" />
      <circle cx="18" cy="10" r="1.5" />
    </Sym>
  ),
  // 33. La Clé
  33: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="22" cy="18" r="12" />
      <circle cx="18" cy="18" r="3.5" />
      <circle cx="26" cy="18" r="3.5" />
      <line x1="22" y1="30" x2="22" y2="54" strokeWidth="3" />
      <path d="M22,42 L30,42 L30,46 L22,46" />
      <path d="M22,50 L28,50 L28,54 L22,54" />
      <circle cx="22" cy="32" r="2.5" />
    </Sym>
  ),
  // 34. Le Poisson
  34: ({ color, size }) => (
    <Sym color={color} size={size}>
      <ellipse cx="28" cy="30" rx="18" ry="12" />
      <path d="M46,30 L58,20 L58,40 Z" />
      <path d="M22,18 Q28,10 36,18" />
      <path d="M24,42 Q28,50 34,42" />
      <circle cx="16" cy="27" r="3.5" />
      <circle cx="15" cy="26" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <path d="M10,30 Q12,33 10,36" />
      <path d="M20,24 Q24,20 28,24 Q32,20 36,24" strokeWidth="0.9" strokeOpacity="0.5" />
      <path d="M20,30 Q24,26 28,30 Q32,26 36,30" strokeWidth="0.9" strokeOpacity="0.5" />
    </Sym>
  ),
  // 35. L'Ancre
  35: ({ color, size }) => (
    <Sym color={color} size={size}>
      <circle cx="30" cy="6" r="5" />
      <line x1="30" y1="11" x2="30" y2="48" strokeWidth="3" />
      <line x1="14" y1="18" x2="46" y2="18" strokeWidth="2.5" />
      <circle cx="14" cy="18" r="2.5" />
      <circle cx="46" cy="18" r="2.5" />
      <path d="M30,48 C30,48 18,44 14,54" />
      <path d="M30,48 C30,48 42,44 46,54" />
      <circle cx="30" cy="50" r="4" />
    </Sym>
  ),
  // 36. La Croix
  36: ({ color, size }) => (
    <Sym color={color} size={size}>
      <line x1="30" y1="4" x2="30" y2="56" strokeWidth="4" />
      <line x1="10" y1="18" x2="50" y2="18" strokeWidth="4" />
      <path d="M30,4 C26,4 24,6 26,8 C28,10 30,8 30,4 C30,4 32,10 34,8 C36,6 34,4 30,4" strokeWidth="0.9" />
      <path d="M30,56 C26,56 24,54 26,52 C28,50 30,52 30,56 C30,56 32,50 34,52 C36,54 34,56 30,56" strokeWidth="0.9" />
      <path d="M10,18 C10,14 12,12 14,14 C16,16 14,18 10,18 C10,18 16,20 14,22 C12,24 10,22 10,18" strokeWidth="0.9" />
      <path d="M50,18 C50,14 48,12 46,14 C44,16 46,18 50,18 C50,18 44,20 46,22 C48,24 50,22 50,18" strokeWidth="0.9" />
    </Sym>
  ),
};

export function LenormandSymbol({ number, color = "currentColor", size = 48 }: {
  number: number;
  color?: string;
  size?: number;
}) {
  const Component = SYMBOLS[number];
  if (!Component) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60"
        fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="30" cy="30" r="20" />
      </svg>
    );
  }
  return <Component color={color} size={size} />;
}
