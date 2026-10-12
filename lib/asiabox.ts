const BASE = 'https://asiaboxdrama.com'
const LANG = 'id'
const UA =
  'Mozilla/5.0 (Linux; Android 13; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'

export type Raw = any

export interface Item {
  id?: number | string
  title: string
  slug: string
  image?: string
  episodes?: number
  views?: number
  genres: string[]
  description?: string
  url: string
  created_at?: string
  updated_at?: string
}

export interface Episode {
  number: number
  title?: string
  watch_url: string
  [key: string]: Raw
}

export interface Listing {
  page: number
  total_item: number
  data: Item[]
}

export interface Detail {
  film: Item
  total_episode: number
  episodes: Episode[]
}

export interface EpisodeData {
  number: number
  watch_url: string
  video: string | null
  subtitle: string | null
}

interface GetOptions {
  cookie?: string
  revalidate?: number
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function get(url: string, opts: GetOptions = {}): Promise<string> {
  let err: unknown
  for (let i = 0; i < 3; i++) {
    try {
      const headers: Record<string, string> = {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'id-ID,id;q=0.9'
      }
      if (opts.cookie) headers.cookie = opts.cookie
      const init: RequestInit & { next?: { revalidate: number } } = {
        headers,
        signal: AbortSignal.timeout(12000)
      }
      if (opts.revalidate === 0) init.cache = 'no-store'
      else init.next = { revalidate: opts.revalidate ?? 300 }
      const res = await fetch(url, init)
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url)
      return await res.text()
    } catch (e) {
      err = e
      await sleep(600 * (i + 1))
    }
  }
  throw err
}

function flight(html: string): string {
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g
  let out = ''
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    try {
      out += JSON.parse('"' + m[1] + '"')
    } catch {}
  }
  return out
}

function grab(text: string, key: string): Raw[] {
  const res: Raw[] = []
  const needle = '"' + key + '":'
  let i = text.indexOf(needle)
  while (i !== -1) {
    const s = i + needle.length
    const open = text[s]
    if (open === '[' || open === '{') {
      const close = open === '[' ? ']' : '}'
      let depth = 0
      let inStr = false
      let esc = false
      let j = s
      for (; j < text.length; j++) {
        const c = text[j]
        if (inStr) {
          if (esc) esc = false
          else if (c === '\\') esc = true
          else if (c === '"') inStr = false
          continue
        }
        if (c === '"') inStr = true
        else if (c === open) depth++
        else if (c === close && --depth === 0) break
      }
      try {
        res.push(JSON.parse(text.slice(s, j + 1)))
      } catch {}
    }
    i = text.indexOf(needle, i + needle.length)
  }
  return res
}

function uniq(arr: Raw[]): Raw[] {
  const map = new Map<string, Raw>()
  for (const x of arr) {
    const k = x && (x.id || x.slug)
    if (k && !map.has(k)) map.set(k, x)
  }
  return [...map.values()]
}

const item = (e: Raw): Item => ({
  id: e.id,
  title: e.title,
  slug: e.slug,
  image: e.image,
  episodes: e.episodes_count,
  views: e.views,
  genres: (e.tags || []).map((t: Raw) => t.name),
  description: e.description,
  url: `${BASE}/${LANG}/movie/${e.slug}`,
  created_at: e.created_at,
  updated_at: e.updated_at
})

const watchUrl = (slug: string, n: number | string) =>
  `${BASE}/${LANG}/watch/${slug}/episode/${n}`

function fromHtml(html: string): Item[] {
  const seen = new Set<string>()
  const out: Item[] = []
  for (const m of html.matchAll(/href="\/id\/(?:movie|episode-list)\/([a-z0-9-]+)"/g)) {
    if (seen.has(m[1])) continue
    seen.add(m[1])
    out.push({ slug: m[1], title: m[1], genres: [], url: `${BASE}/${LANG}/movie/${m[1]}` })
  }
  return out
}

function collect(text: string): Raw[] {
  const keys = ['movies', 'films', 'dramas', 'items', 'list', 'results', 'data']
  const out: Raw[] = []
  for (const k of keys) {
    for (const v of grab(text, k)) {
      if (Array.isArray(v)) out.push(...v)
      else if (v && Array.isArray(v.data)) out.push(...v.data)
      else if (v && v.id && v.slug) out.push(v)
    }
  }
  return uniq(out.filter((o) => o && o.slug))
}

async function listing(url: string, page: number): Promise<Listing> {
  const html = await get(url)
  const text = flight(html)
  let data = collect(text).map(item)
  if (!data.length) data = fromHtml(html)
  return { page, total_item: data.length, data }
}

function findFilm(text: string, slug: string): Raw | null {
  for (const key of ['film', 'datafilm', 'data', 'entries']) {
    for (const v of grab(text, key)) {
      const hit = (Array.isArray(v) ? v : [v]).find((o: Raw) => o && o.slug === slug && o.title)
      if (hit) return hit
    }
  }
  return null
}

function findEpisodes(text: string): Raw[] {
  const all = grab(text, 'episodes').filter(Array.isArray)
  return all.sort((a, b) => b.length - a.length)[0] || []
}

export function getHome(): Promise<Listing> {
  return listing(`${BASE}/${LANG}`, 1)
}

export function getList(page = 1, genre?: string): Promise<Listing> {
  const q = new URLSearchParams({ page: String(page) })
  if (genre) q.set('genre', genre)
  return listing(`${BASE}/${LANG}/serialdrama?${q}`, page)
}

export function search(keyword: string, page = 1): Promise<Listing> {
  const q = new URLSearchParams({ drama: keyword, page: String(page) })
  return listing(`${BASE}/${LANG}/search?${q}`, page)
}

export async function getDetail(slug: string): Promise<Detail> {
  const text = flight(await get(`${BASE}/${LANG}/movie/${slug}`))
  const film = findFilm(text, slug)
  if (!film) throw new Error('Film tidak ketemu: ' + slug)
  let eps = findEpisodes(text)
  if (!eps.length) {
    const t2 = flight(await get(`${BASE}/${LANG}/episode-list/${slug}`))
    eps = findEpisodes(t2)
  }
  const episodes: Episode[] = eps
    .map((e: Raw) => ({ ...e, number: Number(e.number), watch_url: watchUrl(slug, e.number) }))
    .sort((a: Episode, b: Episode) => a.number - b.number)
  return { film: item(film), total_episode: episodes.length, episodes }
}

export async function getEpisode(
  slug: string,
  num: number,
  id?: number | string
): Promise<EpisodeData> {
  const cookie = id ? 'movie=' + encodeURIComponent(JSON.stringify({ id, slug })) : undefined
  const text = flight(await get(watchUrl(slug, num), { cookie, revalidate: 0 }))
  const cur: Raw =
    grab(text, 'currentEpisode')[0] ||
    findEpisodes(text).find((e: Raw) => String(e.number) === String(num)) ||
    null
  const files: string[] = cur
    ? []
    : [
        ...new Set(
          text.match(/https?:\/\/[^"\\\s]+?\.(?:mp4|m3u8|vtt|srt|ass)[^"\\\s]*/gi) || []
        )
      ]
  const direct: string | undefined = cur ? undefined : (text.match(/"video":"([^"]+)"/) || [])[1]
  const video: string | null =
    (cur && cur.video) || direct || files.find((u) => /\.(mp4|m3u8)/i.test(u)) || null
  const subtitle: string | null =
    (cur && (cur.subtitle || cur.subtitle_url || cur.sub)) ||
    files.find((u) => /\.(vtt|srt|ass)/i.test(u)) ||
    null
  return { number: Number(num), watch_url: watchUrl(slug, num), video, subtitle }
  }
