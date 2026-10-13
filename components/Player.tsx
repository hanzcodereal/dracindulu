'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

interface Props {
  src: string
  subtitle: string | null
  poster?: string
}

export default function Player({ src, subtitle, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [ratio, setRatio] = useState(9 / 16)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    setError('')
    let dead = false
    let hls: { destroy: () => void } | null = null

    if (/\.m3u8/i.test(src) && !v.canPlayType('application/vnd.apple.mpegurl')) {
      import('hls.js').then(({ default: Hls }) => {
        if (dead) return
        if (!Hls.isSupported()) {
          setError('Browser kamu tidak mendukung video ini.')
          return
        }
        const h = new Hls()
        h.loadSource(src)
        h.attachMedia(v)
        h.on(Hls.Events.ERROR, (_e, d) => {
          if (d.fatal) setError('Video gagal dimuat. Coba muat ulang halaman.')
        })
        hls = h
      })
    } else {
      v.src = src
    }

    return () => {
      dead = true
      if (hls) hls.destroy()
    }
  }, [src])

  const subOk = subtitle && !/\.ass(\?|$)/i.test(subtitle)

  return (
    <div className="screen" style={{ '--ar': ratio } as CSSProperties}>
      <video
        ref={ref}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        onLoadedMetadata={(e) => {
          const { videoWidth: w, videoHeight: h } = e.currentTarget
          if (w && h) setRatio(w / h)
        }}
        onError={() => setError('Video gagal dimuat. Coba muat ulang halaman.')}
      >
        {subOk ? (
          <track
            kind="subtitles"
            src={`/api/sub?u=${encodeURIComponent(subtitle as string)}`}
            srcLang="id"
            label="Indonesia"
            default
          />
        ) : null}
      </video>
      {error ? <div className="screenmsg">{error}</div> : null}
    </div>
  )
}
