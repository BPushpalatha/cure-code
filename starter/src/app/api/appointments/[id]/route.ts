import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    const appt = await db.appointment.update({ where: { id }, data: { status } })
    return NextResponse.json(appt)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await db.appointment.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
