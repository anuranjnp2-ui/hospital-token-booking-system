import { supabase } from "@/integrations/supabase/client";

export async function fetchHospitalInfo() {
  const { data, error } = await supabase.from("hospital_info").select("*").limit(1).single();
  if (error) throw error;
  return data;
}

export async function fetchDoctors() {
  const { data, error } = await supabase.from("doctors").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function fetchServices() {
  const { data, error } = await supabase.from("services").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function fetchTodayTokens() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("date", today)
    .order("token_number");
  if (error) throw error;
  return data;
}

export async function fetchActiveBreaks() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("doctor_breaks")
    .select("*")
    .eq("date", today)
    .eq("active", true);
  if (error) throw error;
  return data;
}

export async function bookToken(patientName: string, phone: string) {
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userResult.user;

  const { data, error } = await supabase
    .rpc("book_token", {
      _patient_name: patientName,
      _phone: phone,
      _created_by: user ? user.id : null,
    })
    .single();

  if (error) throw error;
  return data;
}

export async function checkIsAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  return !!data;
}
