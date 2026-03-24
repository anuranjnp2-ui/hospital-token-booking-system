import { Link, useLocation, useNavigate } from "react-router-dom";
import { Hospital, Radio, Pencil, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { label: "Home", path: "/admin", icon: Hospital },
  { label: "Live Token", path: "/admin/live-token", icon: Radio },
  { label: "Edit", path: "/admin/edit", icon: Pencil },
];

export function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Hospital className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display text-gradient">Modern Clinic</span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Admin</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
