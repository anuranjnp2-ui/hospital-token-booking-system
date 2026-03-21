import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/supabase-helpers";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus("unauthorized"); return; }
      const isAdmin = await checkIsAdmin();
      setStatus(isAdmin ? "authorized" : "unauthorized");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { check(); });
    check();
    return () => subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }
  if (status === "unauthorized") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
