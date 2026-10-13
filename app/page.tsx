import Link from 'next/link'
import Card from '@/components/Card'
import { getHome, getList, search } from '@/lib/asiabox'

export const maxDuration = 30

interface Props {
  searchParams: { q?: string; page?: string }
}

export default async function Home({ searchParams }: Props) {
  const q = (searchParams.q || '').trim()
  const page = Math.max(1, Number(searchParams.page) || 1)

  let list = q ? await search(q, page) : await getList(page)
  if (!q && page === 1 && !list.data.length) list = await getHome()

  const href = (p: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    params.set('page', String(p))
    return `/?${params}`
  }

  return (
    <>
      <h1 className="title">{q ? `Hasil untuk "${q}"` : 'Drama terbaru'}</h1>

      {list.data.length ? (
        <div className="grid">
          {list.data.map((d) => (
            <Card key={d.slug} item={d} />
          ))}
        </div>
      ) : (
        <div className="empty">
          {q ? 'Tidak ada drama yang cocok. Coba kata kunci lain.' : 'Belum ada drama untuk ditampilkan.'}
        </div>
      )}

      <nav className="pager" aria-label="Halaman">
        {page > 1 ? (
          <Link className="btn" href={href(page - 1)} prefetch={false}>
            Sebelumnya
          </Link>
        ) : (
          <span />
        )}
        <span className="pageno">Hal. {page}</span>
        {list.data.length ? (
          <Link className="btn" href={href(page + 1)} prefetch={false}>
            Berikutnya
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
