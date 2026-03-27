import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodayTokens, fetchActiveBreaks } from "@/lib/api-helpers";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Radio, Coffee, UtensilsCrossed, CheckCircle, XCircle, Play, Clock, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/axios";

export default function AdminLiveToken() {
  const qc = useQueryClient();
  const { data: tokens } = useQuery({ queryKey: ["today_tokens"], queryFn: fetchTodayTokens, refetchInterval: 5000 });
  const { data: breaks } = useQuery({ queryKey: ["active_breaks"], queryFn: fetchActiveBreaks, refetchInterval: 5000 });

  const consulting = tokens?.find((t: any) => t.status === "IN_PROGRESS" || t.status === "consulting");
  const waiting = tokens?.filter((t: any) => t.status === "PENDING" || t.status === "waiting") || [];
  const completed = tokens?.filter((t: any) => t.status === "COMPLETED" || t.status === "CANCELLED" || t.status === "completed" || t.status === "cancelled") || [];

  const updateToken = useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: string }) => {
      const mappedStatus = status.toUpperCase();
      const { data } = await apiClient.patch(`tokens/${id}/`, { status: mappedStatus });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["today_tokens"] }),
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const deleteToken = useMutation({
    mutationFn: async (id: string | number) => {
      await apiClient.delete(`tokens/${id}/`);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["today_tokens"] }); toast.success("Token removed"); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const addBreak = useMutation({
    mutationFn: async (breakType: string) => {
      await apiClient.post(`breaks/`, { break_type: breakType, active: true });
    },
    onSuccess: (_, breakType) => { qc.invalidateQueries({ queryKey: ["active_breaks"] }); toast.success(`${breakType} started`); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const endBreak = useMutation({
    mutationFn: async (id: string | number) => {
      await apiClient.patch(`breaks/${id}/`, { active: false });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["active_breaks"] }); toast.success("Break ended"); },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const callNext = () => {
    // Mark current as completed, then set next waiting as in_progress
    const actions: Promise<void>[] = [];
    if (consulting) {
      actions.push(updateToken.mutateAsync({ id: consulting.id, status: "COMPLETED" }));
    }
    if (waiting.length > 0) {
      actions.push(updateToken.mutateAsync({ id: waiting[0].id, status: "IN_PROGRESS" }));
    }
    Promise.all(actions).then(() => toast.success("Next patient called"));
  };

  const hasActiveBreak = breaks && breaks.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="container py-10 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold font-display text-gradient flex items-center gap-2">
          <Radio className="h-7 w-7 text-primary animate-pulse-slow" /> Live Token Management
        </h1>

        {/* Break Controls */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Doctor Break Controls</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {hasActiveBreak ? (
              breaks!.map((b: any) => (
                <Button key={b.id} variant="outline" onClick={() => endBreak.mutate(b.id)} className="border-warning text-warning hover:bg-warning/10">
                  End {b.break_type}
                </Button>
              ))
            ) : (
              <>
                <Button variant="outline" onClick={() => addBreak.mutate("Tea Break")}><Coffee className="h-4 w-4 mr-1" />Tea Break</Button>
                <Button variant="outline" onClick={() => addBreak.mutate("Lunch Break")}><UtensilsCrossed className="h-4 w-4 mr-1" />Lunch Break</Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Currently Consulting */}
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Now Consulting</CardTitle>
          </CardHeader>
          <CardContent>
            {consulting ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary">
                    <span className="text-xl font-extrabold text-primary-foreground">#{consulting.token_number}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{consulting.patient_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{consulting.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { updateToken.mutate({ id: consulting.id, status: "COMPLETED" }); toast.success("Marked complete"); }} className="bg-success hover:bg-success/90 text-success-foreground">
                    <CheckCircle className="h-4 w-4 mr-1" />Complete
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { updateToken.mutate({ id: consulting.id, status: "CANCELLED" }); toast.success("Marked cancelled"); }}>
                    <XCircle className="h-4 w-4 mr-1" />Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-2">No one consulting</p>
            )}
          </CardContent>
        </Card>

        {/* Call Next */}
        <Button onClick={callNext} disabled={waiting.length === 0} className="w-full gradient-primary text-primary-foreground h-12 text-lg">
          <Play className="h-5 w-5 mr-2" />Call Next Patient
        </Button>

        {/* Waiting Queue */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Waiting Queue ({waiting.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {waiting.length === 0 ? (
              <p className="text-muted-foreground text-center py-3">No patients waiting</p>
            ) : (
              waiting.map((token: any, i: number) => (
                <div key={token.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">#{token.token_number}</span>
                    <div>
                      <p className="font-medium text-sm">{token.patient_name}</p>
                      <p className="text-xs text-muted-foreground">{token.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">~{(i + 1) * 5} min</Badge>
                    <Button size="icon" variant="ghost" onClick={() => { updateToken.mutate({ id: token.id, status: "CANCELLED" }); toast.success("Cancelled"); }} className="text-destructive hover:text-destructive h-8 w-8">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed/Cancelled */}
        {completed.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Completed / Cancelled Today ({completed.length})</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {completed.map((token: any) => (
                <div key={token.id} className="flex items-center justify-between rounded border p-2 opacity-60">
                  <span className="text-sm">#{token.token_number} - {token.patient_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={token.status.toUpperCase() === "COMPLETED" ? "default" : "destructive"} className="text-xs">
                      {token.status}
                    </Badge>
                    <Button size="icon" variant="ghost" onClick={() => deleteToken.mutate(token.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
