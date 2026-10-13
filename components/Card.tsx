import Link from 'next/link'
import LikeButton from '@/components/LikeButton'

interface CardItem {
  slug: string
  title: string
  image?: string
  episodes?: number
}

export default function Card({ item }: { item: CardItem }) {
  return (
    <div className="card">
      <Link href={`/drama/${item.slug}`} className="cardlink" prefetch={false}>
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
      <LikeButton drama={{ slug: item.slug, title: item.title, image: item.image, episodes: item.episodes }} />
    </div>
  )
}
