'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

type Appointment = {
  id: string
  memberId: string
  memberName: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  clinic: string
}

type Props = {
  appointments?: Appointment[]
}

export default function ClinicalSchedulingDashboard({ appointments }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [newDate, setNewDate] = useState('')
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments || [])

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setOpen(true)
    setNewDate(appointment.date)
  }

  const handleConfirmReschedule = () => {
    setOpen(false)
    toast({
      title: 'Appointment Scheduled',
      description: `Appointment for ${selectedAppointment?.memberName} is scheduled on ${newDate}.`,
      variant: 'default',
    })
    setSelectedAppointment(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLocalAppointments(prev => prev.filter(a => a.id !== id))
        toast({ title: 'Appointment cancelled', description: 'The appointment was cancelled.', variant: 'default' })
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err?.error || 'Failed to cancel', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Network error', description: 'Could not reach server', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Screening & Appointments</h2>
        <p className="text-gray-600">Schedule health screenings and medical appointments</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            Reschedule Appointment
          </DialogHeader>
          <div className="space-y-4">
            <p>Choose a new date for <strong>{selectedAppointment?.memberName}</strong> ({selectedAppointment?.condition}):</p>
            <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            <Button className="bg-blue-600" onClick={handleConfirmReschedule}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      {(localAppointments.length === 0) ? (
        <Card className="text-center p-12">
          <Calendar className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Scheduled</h3>
          <p className="text-gray-600 mb-4">Generate a risk assessment to receive personalized screening recommendations</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Start Risk Assessment
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {localAppointments.map(a => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="text-sm">{a.memberName} — {a.condition}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">Date: <strong>{a.date}</strong></p>
                    <p className="text-sm text-gray-700">Clinic: {a.clinic}</p>
                    <p className="text-sm text-gray-700">Severity: {a.severity}</p>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleRescheduleClick(a)}>
                        View / Reschedule
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(a.id)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}