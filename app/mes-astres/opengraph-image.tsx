import { generateOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Thème Astral Complet — Céleste Voyance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return generateOgImage(
    'Thème Astral Complet',
    'Votre ciel natal, vos planètes, votre ascendant'
  )
}
