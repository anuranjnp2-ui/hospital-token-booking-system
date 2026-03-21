import { useState } from "react";
import { UserNavbar } from "@/components/UserNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { bookToken } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Ticket, User, Phone, CheckCircle } from "lucide-react";

interface BookingResult {
  token_number: number;
  patient_name: string;
  phone: string;
  date: string;
  status: string;
}

export default function BookToken() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  const handleBook = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const result = await bookToken(name.trim(), phone.trim());
      setBooking(result);
      toast.success(`Token #${result.token_number} booked successfully!`);
      setName("");
      setPhone("");
    } catch (err: any) {
      toast.error(err.message || "Failed to book token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container py-12 max-w-lg">
        <h1 className="text-3xl font-bold font-display text-gradient mb-8 text-center">Book Your Token</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                  maxLength={100}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                  maxLength={15}
                />
              </div>
            </div>
            <Button onClick={handleBook} disabled={loading} className="w-full gradient-primary text-primary-foreground">
              {loading ? "Booking..." : "Book Token"}
            </Button>
          </CardContent>
        </Card>

        {booking && (
          <Card className="mt-6 border-primary/30 bg-accent/50">
            <CardContent className="p-6 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <h3 className="text-lg font-bold">Booking Confirmed!</h3>
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-6 py-3">
                <span className="text-4xl font-extrabold text-primary">#{booking.token_number}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {booking.patient_name}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
