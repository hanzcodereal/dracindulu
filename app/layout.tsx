import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import Link from 'next/link'
import FavLink from '@/components/FavLink'
import SupportModal from '@/components/SupportModal'
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
  title: { default: 'Dramadulu', template: '%s | Dramadulu' },
  description: 'Nonton drama Asia sub Indonesia gratis dan tanpa iklan di Dramadulu.'
}

export const viewport: Viewport = {
  themeColor: '#150f33'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${pixel.variable} ${body.variable}`}>
      <body>
        <header className="top">
          <div className="brand">
            <Link href="/" className="logo" prefetch={false}>
              Dramadulu
            </Link>
            <FavLink />
          </div>
          <form action="/" className="search" role="search">
            <input name="q" type="search" placeholder="Cari judul drama" aria-label="Cari judul drama" />
            <button type="submit" className="btn">
              Cari
            </button>
          </form>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">© 2026 Dramadulu · nonton drama gratis dan tanpa iklan</footer>
        <SupportModal />
      </body>
    </html>
  )
}
