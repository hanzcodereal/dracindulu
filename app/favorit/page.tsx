import type { Metadata } from 'next'
import FavoritList from '@/components/FavoritList'

export const metadata: Metadata = { title: 'Favorit' }

export default function FavoritPage() {
  return (
    <>
      <h1 className="title">Drama favorit</h1>
      <FavoritList />
    </>
  )
}
