"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

type Appointment = {
  id: string
  user: { id: string, name?: string, email?: string }
  doctor: { id: string, name?: string }
  specialty: string
  date: string
  time: string
  status: string
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (res.ok) setAppointments(data)
      else toast({ title: 'Error', description: data?.error || 'Failed to load', variant: 'destructive' })
    } catch (e) {
      toast({ title: 'Network error', description: 'Could not fetch appointments', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.id !== id))
        toast({ title: 'Deleted', description: 'Appointment deleted' })
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err?.error || 'Delete failed', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Network error', description: 'Could not delete', variant: 'destructive' })
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ status }) })
      if (res.ok) {
        const updated = await res.json()
        setAppointments(prev => prev.map(a => a.id === id ? updated : a))
        toast({ title: 'Updated', description: `Status set to ${status}` })
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err?.error || 'Update failed', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Network error', description: 'Could not update', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Admin — Appointments</h2>
        <p className="text-sm text-gray-600">Manage appointment requests</p>
      </div>

      <div>
        {loading && <div>Loading...</div>}
        {!loading && appointments.length === 0 && <div>No appointments found</div>}
        <div className="grid gap-3">
          {appointments.map(a => (
            <div key={a.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.user?.name || a.user?.email || a.user?.id}</div>
                <div className="text-sm text-gray-600">Doctor: {a.doctor?.name || a.doctor?.id} — {a.specialty}</div>
                <div className="text-sm text-gray-600">{a.date} {a.time}</div>
                <div className="text-sm text-gray-500">Status: <strong>{a.status}</strong></div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600" onClick={() => updateStatus(a.id, 'confirmed')}>Confirm</Button>
                <Button className="bg-yellow-500" onClick={() => updateStatus(a.id, 'declined')}>Decline</Button>
                <Button className="bg-red-600" onClick={() => handleDelete(a.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
