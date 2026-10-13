'use client'

import Link from 'next/link'
import Card from '@/components/Card'
import { useLikes } from '@/lib/likes'

export default function FavoritList() {
  const { likes, ready } = useLikes()

  if (!ready) {
    return (
      <div className="empty" role="status">
        Memuat favorit<span className="blink">...</span>
      </div>
    )
  }

  if (!likes.length) {
    return (
      <div className="empty">
        <p>Belum ada drama favorit. Tekan ikon hati di drama yang kamu suka.</p>
        <Link href="/" className="btn primary">
          Cari drama
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="stat">{likes.length} drama tersimpan</p>
      <div className="grid">
        {likes.map((d) => (
          <Card key={d.slug} item={d} />
        ))}
      </div>
    </>
  )
}
