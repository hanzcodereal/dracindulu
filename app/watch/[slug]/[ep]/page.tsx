import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Player from '@/components/Player'
import { getDetail, getEpisode } from '@/lib/asiabox'

export const maxDuration = 30

interface Props {
  params: { slug: string; ep: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDetail(params.slug).catch(() => null)
  return { title: d ? `${d.film.title} episode ${params.ep}` : 'Nonton' }
}

export default async function WatchPage({ params }: Props) {
  const num = Number(params.ep)
  if (!Number.isInteger(num) || num < 1) notFound()

  const d = await getDetail(params.slug).catch(() => null)
  if (!d) notFound()

  const ep = await getEpisode(params.slug, num, d.film.id)

  const nums = d.episodes.map((e) => e.number)
  const idx = nums.indexOf(num)
  const prev = idx > 0 ? nums[idx - 1] : null
  const next = idx !== -1 && idx < nums.length - 1 ? nums[idx + 1] : null

  return (
    <>
      <div className="crumb">
        <Link href={`/drama/${d.film.slug}`} prefetch={false}>
          {d.film.title}
        </Link>
      </div>
      <h1 className="title">Episode {num}</h1>

      <div className="tv">
        {ep.video ? (
          <Player key={ep.video} src={ep.video} subtitle={ep.subtitle} poster={d.film.image} />
        ) : (
          <div className="screen">
            <div className="screenmsg">Video untuk episode ini belum tersedia.</div>
          </div>
        )}
        <div className="tvbar">
          <span className="channel">EP {String(num).padStart(2, '0')}</span>
          <span className="led" aria-hidden="true" />
        </div>
      </div>

      <div className="pager">
        {prev !== null ? (
          <Link className="btn" href={`/watch/${d.film.slug}/${prev}`} prefetch={false}>
            Episode {prev}
          </Link>
        ) : (
          <span />
        )}
        {next !== null ? (
          <Link className="btn primary" href={`/watch/${d.film.slug}/${next}`} prefetch={false}>
            Episode {next}
          </Link>
        ) : (
          <span />
        )}
      </div>

      <h2 className="subtitle">Semua episode</h2>
      <div className="eps">
        {d.episodes.map((e) => (
          <Link
            key={e.number}
            href={`/watch/${d.film.slug}/${e.number}`}
            className={e.number === num ? 'ep on' : 'ep'}
            prefetch={false}
          >
            {e.number}
          </Link>
        ))}
      </div>
    </>
  )
}
