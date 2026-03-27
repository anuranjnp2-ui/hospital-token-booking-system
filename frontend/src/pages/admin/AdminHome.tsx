import { useQuery } from "@tanstack/react-query";
import { fetchHospitalInfo, fetchDoctors, fetchServices } from "@/lib/api-helpers";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, User, Activity, HeartPulse, TestTubes, Scan, Monitor, Pill } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "heart-pulse": HeartPulse, "test-tubes": TestTubes, scan: Scan, monitor: Monitor, pill: Pill, activity: Activity,
};

export default function AdminHome() {
  const { data: hospital } = useQuery({ queryKey: ["hospital_info"], queryFn: fetchHospitalInfo });
  const { data: doctors } = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <section className="gradient-hero py-12">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold font-display text-gradient mb-2">{hospital?.name || "Hospital"}</h1>
          <p className="text-muted-foreground">{hospital?.description}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {hospital?.address && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />{hospital.address}</span>}
            {hospital?.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary" />{hospital.phone}</span>}
            {hospital?.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />{hospital.email}</span>}
            {hospital?.operating_hours && <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" />{hospital.operating_hours}</span>}
          </div>
        </div>
      </section>

      <div className="container py-10 space-y-8">
        <div>
          <h2 className="text-xl font-bold font-display mb-4">Doctors ({doctors?.length || 0})</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doctors?.map((doc) => (
              <Card key={doc.id}><CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent"><User className="h-5 w-5 text-accent-foreground" /></div>
                <div><p className="font-semibold text-sm">{doc.name}</p><p className="text-xs text-primary">{doc.specialty}</p></div>
              </CardContent></Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold font-display mb-4">Services ({services?.length || 0})</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services?.map((svc) => {
              const Icon = iconMap[svc.icon || "activity"] || Activity;
              return (
                <Card key={svc.id}><CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent"><Icon className="h-5 w-5 text-accent-foreground" /></div>
                  <div><p className="font-semibold text-sm">{svc.name}</p><p className="text-xs text-muted-foreground">{svc.description}</p></div>
                </CardContent></Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
