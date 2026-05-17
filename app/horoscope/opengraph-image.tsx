import { generateOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Horoscope du Jour — Céleste Voyance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return generateOgImage(
    'Horoscope du Jour',
    'Prédictions personnalisées pour les 12 signes du zodiaque'
  )
}
