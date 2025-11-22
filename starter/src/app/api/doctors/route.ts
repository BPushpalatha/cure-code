import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams
    const specialty = q.get('specialty')
    if (specialty) {
      const spec = await db.specialization.findUnique({ where: { name: specialty }, include: { doctors: true } })
      if (!spec) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(spec)
    }

    const specs = await db.specialization.findMany({ include: { doctors: true } })
    return NextResponse.json(specs)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
