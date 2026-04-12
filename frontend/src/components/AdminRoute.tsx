import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiClient } from "@/lib/axios";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check with Django backend if session is valid
    apiClient.get("auth/me/")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading admin...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
