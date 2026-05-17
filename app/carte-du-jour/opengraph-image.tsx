import { generateOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Votre Carte du Jour — Céleste Voyance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return generateOgImage(
    'Votre Carte du Jour',
    'Un message quotidien tiré dans les arcanes du Tarot'
  )
}
