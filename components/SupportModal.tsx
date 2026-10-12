'use client'

import { useEffect, useRef, useState } from 'react'

const SAWERIA = 'https://saweria.co/hanzreally'
const KEY = 'dramadulu-support-seen'

export default function SupportModal() {
  const [open, setOpen] = useState(false)
  const skip = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return
    } catch {}
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    skip.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function close() {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {}
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="support-title">
      <div className="modalbox">
        <h2 id="support-title">Dukung Kami</h2>
        <p>
          Dukung pengembangan Hanzz melalui Saweria. Kontribusi Anda membantu kami memelihara dan
          meningkatkan website ini.
        </p>
        <div className="modalactions">
          <a
            className="btn primary"
            href={SAWERIA}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            Dukungan di Saweria
          </a>
          <button ref={skip} type="button" className="btn" onClick={close}>
            Lanjutkan ke Website
          </button>
        </div>
      </div>
    </div>
  )
}
