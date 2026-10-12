import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="empty">
      <p>Drama atau episode tidak ditemukan.</p>
      <Link href="/" className="btn primary">
        Kembali ke beranda
      </Link>
    </div>
  )
}
