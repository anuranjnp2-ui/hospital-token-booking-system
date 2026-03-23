import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHospitalInfo, fetchDoctors, fetchServices } from "@/lib/supabase-helpers";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2, Hospital, User, Activity, Lock } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

const getTokenHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  };
};

export default function AdminEdit() {
  const qc = useQueryClient();
  const { data: hospital } = useQuery({ queryKey: ["hospital_info"], queryFn: fetchHospitalInfo });
  const { data: doctors } = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  // Hospital edit state
  const [hName, setHName] = useState("");
  const [hAddress, setHAddress] = useState("");
  const [hPhone, setHPhone] = useState("");
  const [hEmail, setHEmail] = useState("");
  const [hDesc, setHDesc] = useState("");
  const [hHours, setHHours] = useState("");
  
  useEffect(() => {
    if (hospital) {
      setHName(hospital.name || "");
      setHAddress(hospital.address || "");
      setHPhone(hospital.phone || "");
      setHEmail(hospital.email || "");
      setHDesc(hospital.description || "");
      setHHours(hospital.operating_hours || "");
    }
  }, [hospital]);

  const updateHospital = useMutation({
    mutationFn: async () => {
      const payload = { 
        name: hName, address: hAddress, phone: hPhone, email: hEmail, 
        description: hDesc, operating_hours: hHours 
      };
      let res;
      if (hospital && hospital.id) {
        res = await fetch(`${API_BASE}/hospital/${hospital.id}/`, {
          method: "PATCH",
          headers: getTokenHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/hospital/`, {
          method: "POST",
          headers: getTokenHeaders(),
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error("Failed to save hospital details");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hospital_info"] }); toast.success("Hospital info updated successfully!"); },
    onError: (e: any) => toast.error(e.message),
  });

  // Add doctor
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpec, setNewDocSpec] = useState("");
  const [newDocQual, setNewDocQual] = useState("");
  const addDoctor = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/doctors/`, {
         method: "POST",
         headers: getTokenHeaders(),
         body: JSON.stringify({ name: newDocName, specialty: newDocSpec, qualification: newDocQual })
      });
      if (!res.ok) throw new Error("Failed to create Doctor Profile");
    },
    onSuccess: () => { 
        qc.invalidateQueries({ queryKey: ["doctors"] }); 
        setNewDocName(""); setNewDocSpec(""); setNewDocQual(""); 
        toast.success("Doctor dynamically added to API!"); 
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteDoctor = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`${API_BASE}/doctors/${id}/`, {
         method: "DELETE",
         headers: getTokenHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete doctor");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["doctors"] }); toast.success("Doctor deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  // Add service
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcDesc, setNewSvcDesc] = useState("");
  const addService = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/services/`, {
         method: "POST",
         headers: getTokenHeaders(),
         body: JSON.stringify({ name: newSvcName, description: newSvcDesc })
      });
      if (!res.ok) throw new Error("Failed to add Service");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); setNewSvcName(""); setNewSvcDesc(""); toast.success("Service added!"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteService = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`${API_BASE}/services/${id}/`, {
         method: "DELETE",
         headers: getTokenHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete service");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); toast.success("Service removed"); },
    onError: (e: any) => toast.error(e.message),
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/auth/change-password/`, {
        method: "POST",
        headers: getTokenHeaders(),
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="container py-10 max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold font-display text-gradient">Edit Hospital Information</h1>

        {/* Hospital Info */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" />Hospital Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Name</Label><Input value={hName} onChange={e => setHName(e.target.value)} /></div>
            <div><Label>Address</Label><Input value={hAddress} onChange={e => setHAddress(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={hPhone} onChange={e => setHPhone(e.target.value)} /></div>
              <div><Label>Email</Label><Input value={hEmail} onChange={e => setHEmail(e.target.value)} /></div>
            </div>
            <div><Label>Operating Hours</Label><Input value={hHours} onChange={e => setHHours(e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={hDesc} onChange={e => setHDesc(e.target.value)} rows={3} /></div>
            <Button onClick={() => updateHospital.mutate()} disabled={updateHospital.isPending} className="gradient-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-1" />{updateHospital.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Doctors */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Manage Doctors</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {doctors?.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                <div><p className="font-medium text-sm">{doc.name || doc.full_name}</p><p className="text-xs text-muted-foreground">{doc.specialty} • {doc.qualification}</p></div>
                <Button variant="ghost" size="icon" onClick={() => deleteDoctor.mutate(doc.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-medium">Add New Doctor</p>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Name" value={newDocName} onChange={e => setNewDocName(e.target.value)} />
                <Input placeholder="Specialty" value={newDocSpec} onChange={e => setNewDocSpec(e.target.value)} />
                <Input placeholder="Qualification" value={newDocQual} onChange={e => setNewDocQual(e.target.value)} />
              </div>
              <Button onClick={() => addDoctor.mutate()} disabled={!newDocName || !newDocSpec || addDoctor.isPending} size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-1" />Add Doctor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Manage Services</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {services?.map((svc: any) => (
              <div key={svc.id} className="flex items-center justify-between rounded-lg border p-3">
                <div><p className="font-medium text-sm">{svc.name}</p><p className="text-xs text-muted-foreground">{svc.description}</p></div>
                <Button variant="ghost" size="icon" onClick={() => deleteService.mutate(svc.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-medium">Add New Service</p>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Service Name" value={newSvcName} onChange={e => setNewSvcName(e.target.value)} />
                <Input placeholder="Description" value={newSvcDesc} onChange={e => setNewSvcDesc(e.target.value)} />
              </div>
              <Button onClick={() => addService.mutate()} disabled={!newSvcName || addService.isPending} size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-1" />Add Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Change Password</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter your current password" /></div>
            <div><Label>New Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter your new password" /></div>
            <div><Label>Confirm Password</Label><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your new password" onKeyDown={(e) => e.key === "Enter" && changePassword.mutate()} /></div>
            <Button onClick={() => changePassword.mutate()} disabled={!currentPassword || !newPassword || !confirmPassword || changePassword.isPending} className="gradient-primary text-primary-foreground">
              <Lock className="h-4 w-4 mr-1" />{changePassword.isPending ? "Changing..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
