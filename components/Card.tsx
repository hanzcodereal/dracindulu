import Link from 'next/link'
import type { Item } from '@/lib/asiabox'

export default function Card({ item }: { item: Item }) {
  return (
    <Link href={`/drama/${item.slug}`} className="card" prefetch={false}>
      <div className="poster">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="noimg">No tape</span>
        )}
        {item.episodes ? <span className="badge">{item.episodes} eps</span> : null}
      </div>
      <div className="cardtitle">{item.title}</div>
    </Link>
  )
        }
