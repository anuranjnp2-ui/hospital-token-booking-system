import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { checkIsAdmin } from "@/lib/supabase-helpers";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) navigate("/admin");
      }
    };
    check();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("Access denied. You are not an admin.");
        return;
      }
      toast.success("Welcome, Admin!");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full gradient-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hospital.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          <Button onClick={handleLogin} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
