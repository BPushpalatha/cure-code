"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  { title: "General Medicine", desc: "Routine check-ups, fever, infections, general health concerns.", img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" },
  { title: "Surgery", desc: "Operations, post-surgical care, injury treatments.", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { title: "Psychiatry", desc: "Depression, anxiety, stress, emotional wellbeing.", img: "https://cdn-icons-png.flaticon.com/512/4249/4249947.png" },
  { title: "Neurology", desc: "Brain, nerves, epilepsy, seizures, headaches.", img: "https://cdn-icons-png.flaticon.com/512/4082/4082819.png" },
  { title: "Cardiology", desc: "Heart check-ups, chest pain, hypertension.", img: "https://cdn-icons-png.flaticon.com/512/709/709496.png" },
  { title: "Dermatology", desc: "Skin problems, rashes, acne, cosmetic treatments.", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { title: "ENT", desc: "Ear, nose, throat infections, allergies, sinus.", img: "https://cdn-icons-png.flaticon.com/512/4359/4359963.png" },
  { title: "Orthopedics", desc: "Bone fractures, joint pain, arthritis, sports injuries.", img: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" },
  { title: "Gynecology", desc: "Pregnancy care, menstrual and hormonal concerns.", img: "https://cdn-icons-png.flaticon.com/512/1997/1997444.png" },
  { title: "Pediatrics", desc: "Child growth, vaccinations, common childhood diseases.", img: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png" },
  { title: "Ophthalmology", desc: "Eye check-ups, vision correction, cataracts.", img: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png" },
  { title: "Dental", desc: "Toothaches, cleaning, braces, cavities.", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { title: "Nephrology", desc: "Kidney check-ups, dialysis, urinary issues.", img: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" },
  { title: "Gastroenterology", desc: "Digestive health, acidity, liver care.", img: "https://cdn-icons-png.flaticon.com/512/4359/4359963.png" },
  { title: "Oncology", desc: "Cancer care, tumor treatment, screenings.", img: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png" },
  { title: "Pulmonology", desc: "Asthma, lung infections, breathing difficulties.", img: "https://cdn-icons-png.flaticon.com/512/1997/1997444.png" }
];

export default function FindSpecialtyPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPECIALTIES;
    return SPECIALTIES.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div>
      <style>{`
        :root{ --page-bg: #f6f9fb; --header-bg: linear-gradient(90deg,#07689f,#00a8e8); --max-width: 1200px; --card-radius: 14px; --shadow: 0 6px 18px rgba(10,30,60,0.08); --accent: #0066cc; }
        *{box-sizing: border-box}
        body{margin:0;font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;background:var(--page-bg);color:#123;-webkit-font-smoothing:antialiased}
        .wrap{max-width:var(--max-width);margin:26px auto;padding:0 20px}
        header.app-header{background:var(--header-bg);padding:20px;border-radius:12px;color:white;display:grid;grid-template-columns:1fr auto 320px;gap:16px;align-items:center;box-shadow:0 8px 28px rgba(2,60,100,0.12)}
        header h1{margin:0;text-align:center;font-weight:700;font-size:24px;letter-spacing:.2px}
        .header-right{justify-self:end;width:100%;max-width:320px}
        .search{display:flex;background:rgba(255,255,255,0.12);padding:6px;border-radius:12px;align-items:center;gap:8px}
        .search input{flex:1;border:0;outline:none;font-size:14px;padding:10px 8px;background:transparent;color:#fff}
        .grid{margin-top:22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
        .card{background:white;padding:18px;border-radius:var(--card-radius);box-shadow:var(--shadow);display:flex;gap:12px;align-items:flex-start;transition:transform .18s ease, box-shadow .18s ease;cursor:pointer;min-height:120px}
        .card:hover{transform:translateY(-6px);box-shadow:0 12px 30px rgba(10,30,60,0.12)}
        .card .media{flex:0 0 72px;height:72px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.02));overflow:hidden}
        .card img{width:56px;height:56px;object-fit:contain;display:block}
        .card .info{flex:1}
        .card h3{margin:0 0 6px 0;font-size:16px;color:var(--accent)}
        .card p{margin:0;font-size:13px;line-height:1.35;color:#385168}
        .no-results{text-align:center;padding:36px;color:#4a5568;grid-column:1/-1;font-weight:600}
        .back-btn{display:block;margin:40px auto;padding:12px 20px;background:#34d399;color:white;border:none;border-radius:10px;font-size:1rem;cursor:pointer;transition:0.3s}
        .back-btn:hover{background:#059669}
        @media (max-width:720px){header.app-header{grid-template-columns:1fr auto;padding:16px;border-radius:10px}.header-right{justify-self:end;max-width:220px}}
      `}</style>

      <div className="wrap">
        <header className="app-header">
          <div></div>
          <h1>Find Doctor Specialty</h1>
          <div className="header-right">
            <div className="search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2"/></svg>
              <input id="search" placeholder="Search specialty (e.g. skin, heart, child)..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            </div>
          </div>
        </header>

        <main>
          <section id="grid" className="grid">
            {filtered.map((s, idx) => (
              <div key={s.title} className="card" onClick={() => { router.push(`/?tab=doctor-appointments&specialty=${encodeURIComponent(s.title)}`) }}>
                <div className="media"><img src={s.img} alt={s.title} /></div>
                <div className="info"><h3>{s.title}</h3><p>{s.desc}</p></div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div id="noResults" className="no-results">No specialties match your search.</div>
            )}
          </section>
        </main>
      </div>

      <button className="back-btn" onClick={() => router.push('/patient')}>⬅ Back to Patient Dashboard</button>
    </div>
  );
}
