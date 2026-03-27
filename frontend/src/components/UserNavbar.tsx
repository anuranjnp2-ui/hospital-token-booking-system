import { Link, useLocation } from "react-router-dom";
import { Hospital, Ticket, Radio, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHospitalInfo } from "@/lib/api-helpers";

const navItems = [
  { label: "Home", path: "/", icon: Hospital },
  { label: "Book Token", path: "/book-token", icon: Ticket },
  { label: "Live Token", path: "/live-token", icon: Radio },
];

export function UserNavbar() {
  const location = useLocation();
  const { data: hospital } = useQuery({ queryKey: ["hospital_info"], queryFn: fetchHospitalInfo });

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Hospital className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display text-gradient">{hospital?.name || "Hospital"}</span>
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
          <Link
            to="/admin/login"
            className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
