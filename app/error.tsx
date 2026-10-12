'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="empty">
      <p>Kaset macet. Server sumber tidak merespons.</p>
      <button type="button" className="btn primary" onClick={() => reset()}>
        Coba lagi
      </button>
    </div>
  )
}
