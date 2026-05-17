import { ImageResponse } from 'next/og'

export function generateOgImage(title: string, desc: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07040d',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal band top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '400px',
            background: 'linear-gradient(135deg, #1e1540 0%, transparent 70%)',
            transform: 'rotate(-15deg)',
          }}
        />

        {/* Inner golden border */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            bottom: '16px',
            border: '2px solid #d4af6f',
          }}
        />

        {/* Decorative stars – top-left corner */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
          }}
        />
        {/* Top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
          }}
        />
        {/* Bottom-left corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '32px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
          }}
        />
        {/* Bottom-right corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '32px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
          }}
        />
        {/* Middle left */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '32px',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
            marginTop: '-2px',
          }}
        />
        {/* Middle right */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '32px',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#d4af6f',
            marginTop: '-2px',
          }}
        />

        {/* Top-left branding */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '48px',
            color: '#d4af6f',
            fontSize: '14px',
            fontFamily: 'serif',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          CÉLESTE VOYANCE
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {/* Main title */}
          <div
            style={{
              color: '#f5ecd9',
              fontSize: '72px',
              fontWeight: 'bold',
              fontFamily: 'serif',
              lineHeight: '1.15',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              color: '#c9b88a',
              fontSize: '24px',
              fontFamily: 'serif',
              fontStyle: 'italic',
              marginTop: '24px',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {desc}
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '0',
            textAlign: 'center',
            color: '#d4af6f',
            fontSize: '16px',
            fontFamily: 'serif',
            letterSpacing: '2px',
          }}
        >
          ✦ Guidée par l&apos;Intelligence Artificielle ✦
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
