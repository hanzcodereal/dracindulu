import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const pixel = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap'
})

const body = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
})

export const metadata: Metadata = {
  title: { default: 'dracindulu', template: '%s | dracindulu' },
  description: 'Nonton drama Asia sub Indonesia di dracindulu.'
}

export const viewport: Viewport = {
  themeColor: '#150f33'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${pixel.variable} ${body.variable}`}>
      <body>
        <header className="top">
          <Link href="/" className="logo" prefetch={false}>
            dracindulu
          </Link>
          <form action="/" className="search" role="search">
            <input name="q" type="search" placeholder="Cari judul drama" aria-label="Cari judul drama" />
            <button type="submit" className="btn">
              Cari
            </button>
          </form>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">dracindulu. Putar kaset, lupakan kerjaan.</footer>
      </body>
    </html>
  )
}
