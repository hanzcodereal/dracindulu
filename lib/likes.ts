import { useCallback, useEffect, useState } from 'react'

export interface LikedDrama {
  slug: string
  title: string
  image?: string
  episodes?: number
}

const KEY = 'dramadulu-likes'
const EVENT = 'dramadulu-likes-change'

function read(): LikedDrama[] {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : []
    if (!Array.isArray(data)) return []
    return data.filter((d) => d && typeof d.slug === 'string' && typeof d.title === 'string')
  } catch {
    return []
  }
}

function write(list: LikedDrama[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

export function useLikes() {
  const [likes, setLikes] = useState<LikedDrama[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setLikes(read())
      setReady(true)
    }
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isLiked = useCallback((slug: string) => likes.some((d) => d.slug === slug), [likes])

  const toggle = useCallback((d: LikedDrama) => {
    const cur = read()
    const exists = cur.some((x) => x.slug === d.slug)
    const entry: LikedDrama = { slug: d.slug, title: d.title, image: d.image, episodes: d.episodes }
    write(exists ? cur.filter((x) => x.slug !== d.slug) : [entry, ...cur])
  }, [])

  return { likes, ready, isLiked, toggle }
}
