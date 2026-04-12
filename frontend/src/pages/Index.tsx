import { useQuery } from "@tanstack/react-query";
import { fetchHospitalInfo, fetchDoctors, fetchServices } from "@/lib/api-helpers";
import { UserNavbar } from "@/components/UserNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, User, HeartPulse, TestTubes, Scan, Monitor, Pill, Activity } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "heart-pulse": HeartPulse,
  "test-tubes": TestTubes,
  scan: Scan,
  monitor: Monitor,
  pill: Pill,
  activity: Activity,
};

export default function Index() {
  const { data: hospital } = useQuery({ queryKey: ["hospital_info"], queryFn: fetchHospitalInfo });
  //const { data: doctors } = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });
  const { data: doctors, isLoading } = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-gradient mb-4">
            {typeof hospital?.name === 'object' ? String(hospital.name.name) : String(hospital?.name || "City General Hospital")}
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            {hospital?.description || "Quality healthcare services for you and your family."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {hospital?.address && (
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{hospital.address}</span>
            )}
            {hospital?.phone && (
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" />{hospital.phone}</span>
            )}
            {hospital?.email && (
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" />{hospital.email}</span>
            )}
            {hospital?.operating_hours && (
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{hospital.operating_hours}</span>
            )}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold font-display mb-6">Our Doctors</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors?.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent">
                  <User className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  {/* Use String() to prevent crashing if name is an object */}
                  <p className="font-semibold">{String(doc.name)}</p>
                  
                  {/* Check if department exists and is an object, then show the name */}
                  <p className="text-sm text-primary font-medium">
                    {typeof doc.department === 'object' && doc.department !== null 
                      ? doc.department.name 
                      : (doc.specialty || "General Physician")}
                  </p>
                  
                  {doc.qualification && <p className="text-xs text-muted-foreground">{String(doc.qualification)}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container pb-16">
        <h2 className="text-2xl font-bold font-display mb-6">Our Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services?.map((svc) => {
            const Icon = iconMap[svc.icon || "activity"] || Activity;
            return (
              <Card key={svc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 p-5">
                  {/* ... icon code ... */}
                  <div>
                    <p className="font-semibold">{typeof svc.name === 'object' ? String(svc.name.name) : String(svc.name)}</p>
                    {svc.description && <p className="text-sm text-muted-foreground">{String(svc.description)}</p>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
