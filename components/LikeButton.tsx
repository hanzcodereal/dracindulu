'use client'

import { useLikes, type LikedDrama } from '@/lib/likes'

const HEART = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000']

function Heart() {
  return (
    <svg
      viewBox="0 0 7 6"
      width="21"
      height="18"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {HEART.flatMap((row, y) =>
        row
          .split('')
          .map((c, x) => (c === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null))
      )}
    </svg>
  )
}

interface Props {
  drama: LikedDrama
  variant?: 'card' | 'full'
}

export default function LikeButton({ drama, variant = 'card' }: Props) {
  const { isLiked, toggle } = useLikes()
  const liked = isLiked(drama.slug)

  return (
    <button
      type="button"
      className={`like like-${variant}${liked ? ' on' : ''}`}
      aria-pressed={liked}
      aria-label={liked ? `Batal suka ${drama.title}` : `Suka ${drama.title}`}
      onClick={() => toggle(drama)}
    >
      <Heart />
      {variant === 'full' ? <span>{liked ? 'Disukai' : 'Suka'}</span> : null}
    </button>
  )
}
