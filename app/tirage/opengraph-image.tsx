import { generateOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = '55+ Tirages de Tarot — Céleste Voyance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return generateOgImage(
    '55+ Tirages de Tarot',
    'Croix Celtique, tirage amour, oracle — interprétés par l\'IA'
  )
}
