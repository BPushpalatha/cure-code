 'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type Specialty = { name: string; icon: string; desc: string }

const SPECIALTIES: Specialty[] = [
  {name:'General Medicine', icon:'https://cdn-icons-png.flaticon.com/512/3774/3774299.png', desc:'Routine check-ups, infections, general health.'},
  {name:'Cardiology', icon:'https://cdn-icons-png.flaticon.com/512/709/709496.png', desc:'Heart related issues, chest pain.'},
  {name:'Dermatology', icon:'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', desc:'Skin issues, acne, rashes.'},
  {name:'Pediatrics', icon:'https://cdn-icons-png.flaticon.com/512/4320/4320337.png', desc:'Child health, vaccinations.'},
  {name:'Neurology', icon:'https://cdn-icons-png.flaticon.com/512/4082/4082819.png', desc:'Brain, nerves, seizures, neuropathy.'},
  {name:'Orthopedics', icon:'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', desc:'Bones, joints, injuries.'}
]

type Props = {
  initialSpecialty?: string | null
}

export default function Specializations({ initialSpecialty }: Props) {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Specialty[]>(SPECIALTIES)
  const [role, setRole] = useState('patient')
  const [doctorsFor, setDoctorsFor] = useState<any | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState<string>('09:00')

  useEffect(() => {
    setItems(SPECIALTIES.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase())))
  }, [query])

  // open specialty if provided (from query param or navigation)
  useEffect(() => {
    if (initialSpecialty) {
      openSpecialty(initialSpecialty)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSpecialty])

  const openSpecialty = async (name: string) => {
    // fetch doctors for specialty from API
    try {
      const res = await fetch(`/api/doctors?specialty=${encodeURIComponent(name)}`)
      const data = await res.json()
      if (res.ok) {
        // API returns specialization object with `doctors` array
        const doctors = Array.isArray(data.doctors) ? data.doctors : (data.doctors || [])
        setDoctorsFor({ specialty: name, doctors })
      } else {
        // fallback: show empty
        setDoctorsFor({ specialty: name, doctors: [] })
      }
    } catch (err) {
      setDoctorsFor({ specialty: name, doctors: [] })
    }
  }

  const bookAppointment = async (doctorId: string) => {
    if (!user || !user.id) {
      alert('Please log in before booking an appointment')
      return
    }
    // basic validation
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time')
      return
    }

    const payload = {
      userId: user.id,
      doctorId,
      specialty: doctorsFor?.specialty,
      date: selectedDate,
      time: selectedTime,
      notes: ''
    }
    try {
      const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        const data = await res.json()
        alert('Appointment requested')
        // optionally close the panel
        setDoctorsFor(null)
      } else {
        const err = await res.json()
        alert('Request failed: ' + (err.error || res.statusText))
      }
    } catch (error) {
      alert('Network error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="wrap">
        <header className="app-header flex items-center justify-between">
          <h1 className="text-xl font-semibold">Specializations</h1>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="role font-bold">Role: {role}</div>
            <div className="search flex items-center bg-white/10 rounded px-2" style={{width:320}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2"/></svg>
              <input placeholder="Search specialty..." value={query} onChange={e=>setQuery(e.target.value)} className="bg-transparent outline-none border-0 text-white px-2" />
            </div>
          </div>
        </header>

        <main>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {items.map((s, i) => (
              <div key={i} className="card bg-white p-4 rounded shadow cursor-pointer" onClick={() => openSpecialty(s.name)}>
                <div className="flex items-center gap-3">
                  <div className="media w-16 h-16 rounded bg-white flex items-center justify-center"><img src={s.icon} alt="" style={{width:56,height:56}}/></div>
                  <div className="info">
                    <h3 className="text-blue-600 font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>

        <div className="footer text-center mt-6">Click any specialty → opens detailed page. (Doctor & Patient share same specialties list.)</div>
      </div>

      {doctorsFor && (
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold">Doctors for {doctorsFor.specialty}</h3>
          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm">Date: <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></label>
            <label className="text-sm">Time: <input type="time" value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></label>
          </div>
          {doctorsFor.doctors && doctorsFor.doctors.length > 0 ? (
            doctorsFor.doctors.map((d:any) => (
              <div key={d.id} className="p-3 bg-white rounded mt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-600">{d.location}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => bookAppointment(d.id)}>Book</button>
                    <a className="px-3 py-1 bg-gray-200 rounded" href={`tel:${d.phone || ''}`}>Call</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-3">No doctors found for this specialty.</div>
          )}
          <div className="mt-4"><button className="px-3 py-1 bg-gray-300 rounded" onClick={()=>setDoctorsFor(null)}>Close</button></div>
        </div>
      )}
    </div>
  )
}
