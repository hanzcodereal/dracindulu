import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LikeButton from '@/components/LikeButton'
import { getDetail } from '@/lib/asiabox'

export const maxDuration = 30

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDetail(params.slug).catch(() => null)
  return { title: d ? d.film.title : 'Drama' }
}

export default async function DramaPage({ params }: Props) {
  const d = await getDetail(params.slug).catch(() => null)
  if (!d) notFound()

  const { film, episodes } = d
  const first = episodes[0]?.number ?? 1

  return (
    <>
      <section className="detail">
        <div className="poster big">
          {film.image ? <img src={film.image} alt={film.title} referrerPolicy="no-referrer" /> : null}
        </div>
        <div className="info">
          <h1 className="title">{film.title}</h1>
          {film.genres.length ? (
            <div className="chips">
              {film.genres.map((g) => (
                <span key={g} className="chip">
                  {g}
                </span>
              ))}
            </div>
          ) : null}
          <p className="desc">{film.description || 'Belum ada sinopsis.'}</p>
          <p className="stat">
            {d.total_episode} episode
            {film.views ? `, ${film.views.toLocaleString('id-ID')} kali ditonton` : ''}
          </p>
          <div className="actions">
            {episodes.length ? (
              <Link href={`/watch/${film.slug}/${first}`} className="btn primary" prefetch={false}>
                Tonton episode {first}
              </Link>
            ) : null}
            <LikeButton
              variant="full"
              drama={{ slug: film.slug, title: film.title, image: film.image, episodes: d.total_episode }}
            />
          </div>
        </div>
      </section>

      <h2 className="subtitle">Daftar episode</h2>
      {episodes.length ? (
        <div className="eps">
          {episodes.map((e) => (
            <Link key={e.number} href={`/watch/${film.slug}/${e.number}`} className="ep" prefetch={false}>
              {e.number}
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">Episode belum tersedia.</div>
      )}
    </>
  )
}
