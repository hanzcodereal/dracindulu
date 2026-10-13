'use client'

import Link from 'next/link'
import { useLikes } from '@/lib/likes'

export default function FavLink() {
  const { likes } = useLikes()

  return (
    <Link href="/favorit" className="navlink" prefetch={false}>
      Favorit
      {likes.length ? <span className="count">{likes.length}</span> : null}
    </Link>
  )
}
