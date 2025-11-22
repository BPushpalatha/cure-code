import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, doctorId, specialty, date, time, notes } = body
    if (!userId || !doctorId || !date || !time) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const appt = await db.appointment.create({
      data: {
        userId,
        doctorId,
        specialty,
        date,
        time,
        notes: notes || null
      }
    })
    return NextResponse.json(appt)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const appts = await db.appointment.findMany({ include: { doctor: true, user: true } })
    return NextResponse.json(appts)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
