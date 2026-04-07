//import { apiClient } from "./axios";
//
/*export async function fetchHospitalInfo() {
  const { data } = await apiClient.get("hospital/");
  return data.length > 0 ? data[0] : null;
}

//export async function fetchDoctors() {
//  const { data } = await apiClient.get("doctors/");
//  return data;
//}

export async function fetchDoctors() {
  try {
    const { data } = await apiClient.get("doctors/");
    return data;
  } catch (err) {
    console.error("Doctors fetch error:", err);
    return [];
  }
}

export async function fetchServices() {
  const { data } = await apiClient.get("services/");
  return data;
}

//export async function fetchTodayTokens() {
//  const { data } = await apiClient.get("tokens/");
  // Map Django backend string choices to the React UI's expectations
//  return data.map((t: any) => ({
//    ...t,
//    status: t.status === 'PENDING' ? 'waiting' 
//          : t.status === 'IN_PROGRESS' ? 'consulting' 
//          : t.status.toLowerCase()
//  }));
//}
export async function fetchTodayTokens() {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await apiClient.get(`tokens/?date=${today}`);

  return data
    .sort((a: any, b: any) => a.token_number - b.token_number)
    .map((t: any) => ({
      ...t,
      status: t.status === "PENDING"
        ? "waiting"
        : t.status === "IN_PROGRESS"
        ? "consulting"
        : t.status.toLowerCase(),
    }));
}

//export async function fetchActiveBreaks() {
//  const { data } = await apiClient.get("breaks/");
//  return data;
//}
export async function fetchActiveBreaks() {
  const { data } = await apiClient.get("breaks/?active=true");
  return data;
}

export async function bookToken(patientName: string, phone: string) {
  try {
    const { data } = await apiClient.post("tokens/book/", {
      patient_name: patientName,
      phone: phone
    });
    return data;
  } catch (err: any) {
    const message = err.response?.data?.error || err.message || "Failed to book token";
    throw new Error(message);
  }
}

//export async function checkIsAdmin() {
//  return false;
//}
export async function checkIsAdmin() {
  const token = localStorage.getItem("admin_token");
  return !!token;
}*/
import { apiClient } from "./axios";

export async function fetchHospitalInfo() {
  const { data } = await apiClient.get("doctors/hospital/");
  return data.length > 0 ? data[0] : null;
}

export async function fetchDoctors() {
  try {
    const { data } = await apiClient.get("doctors/doctors/");
    return data;
  } catch (err) {
    console.error("Doctors fetch error:", err);
    return [];
  }
}

export async function fetchServices() {
  const { data } = await apiClient.get("doctors/services/");
  return data;
}

export async function fetchTodayTokens() {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await apiClient.get(`tokens/?date=${today}`);

  return data
    .sort((a: any, b: any) => a.token_number - b.token_number)
    .map((t: any) => ({
      ...t,
      status:
        t.status === "PENDING"
          ? "waiting"
          : t.status === "IN_PROGRESS"
          ? "consulting"
          : t.status.toLowerCase(),
    }));
}

export async function fetchActiveBreaks() {
  const { data } = await apiClient.get("doctors/breaks/?active=true");
  return data;
}

export async function bookToken(patientName: string, phone: string) {
  try {
    const { data } = await apiClient.post("tokens/book/", {
      patient_name: patientName,
      phone: phone,
    });
    return data;
  } catch (err: any) {
    const message =
      err.response?.data?.error || err.message || "Failed to book token";
    throw new Error(message);
  }
}

export async function checkIsAdmin() {
  const token = localStorage.getItem("admin_token");
  return !!token;
}