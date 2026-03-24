// API helpers overriding Supabase for the Gentle Queue project
const API_BASE = "https://hospital-token-booking-system-p03y.onrender.com/api";

export async function fetchHospitalInfo() {
  const res = await fetch(`${API_BASE}/hospital/`);
  if (!res.ok) throw new Error("Failed to fetch hospital info");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function fetchDoctors() {
  const res = await fetch(`${API_BASE}/doctors/`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services/`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function fetchTodayTokens() {
  const res = await fetch(`${API_BASE}/tokens/`);
  if (!res.ok) throw new Error("Failed to fetch queue");
  const data = await res.json();
  
  // Map Django backend string choices to the React UI's expectations
  return data.map((t: any) => ({
    ...t,
    status: t.status === 'PENDING' ? 'waiting' 
          : t.status === 'IN_PROGRESS' ? 'consulting' 
          : t.status.toLowerCase()
  }));
}

export async function fetchActiveBreaks() {
  const res = await fetch(`${API_BASE}/breaks/`);
  if (!res.ok) throw new Error("Failed to fetch breaks");
  return res.json();
}

export async function bookToken(patientName: string, phone: string) {
  const res = await fetch(`${API_BASE}/tokens/book/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      patient_name: patientName,
      phone: phone
    })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to book token");
  }
  return res.json();
}

export async function checkIsAdmin() {
  return false;
}
