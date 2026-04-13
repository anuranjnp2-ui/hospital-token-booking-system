import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally redirect if already authenticated
    // Ensure the slash is at the end: "auth/me/"
    apiClient.get("auth/me/").then(() => navigate("/admin")).catch(() => { });
  }, [navigate]);

  const handleLogin = async () => {

    // ... validation code ...
    try {
      await apiClient.post("auth/login/", { username, password });
      toast.success("Welcome, Admin!");
      
      // Try navigating to the specific dashboard route
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
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
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
