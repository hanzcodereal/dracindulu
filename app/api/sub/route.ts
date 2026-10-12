import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[)/i

function toVtt(text: string): string {
  const t = text.replace(/^\uFEFF/, '').replace(/\r/g, '')
  if (t.startsWith('WEBVTT')) return t
  return 'WEBVTT\n\n' + t.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('u')
  if (!raw) return new Response('Parameter u wajib diisi', { status: 400 })
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return new Response('URL tidak valid', { status: 400 })
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return new Response('URL tidak valid', { status: 400 })
  }
  if (PRIVATE_HOST.test(url.hostname)) {
    return new Response('Host tidak diizinkan', { status: 400 })
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) return new Response('Subtitle tidak ditemukan', { status: 404 })
    return new Response(toVtt(await res.text()), {
      headers: {
        'content-type': 'text/vtt; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    })
  } catch {
    return new Response('Gagal mengambil subtitle', { status: 502 })
  }
  }
