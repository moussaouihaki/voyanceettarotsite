import { generateOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const alt = 'Tirage Oui ou Non — Céleste Voyance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return generateOgImage(
    'Tirage Oui ou Non',
    'La réponse du Tarot à votre question en un instant'
  )
}
