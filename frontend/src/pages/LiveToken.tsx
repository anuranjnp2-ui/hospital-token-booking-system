import { useQuery } from "@tanstack/react-query";
import { fetchTodayTokens, fetchActiveBreaks } from "@/lib/api-helpers";
import { UserNavbar } from "@/components/UserNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Coffee, UtensilsCrossed, Clock, AlertTriangle } from "lucide-react";

export default function LiveToken() {
  const { data: tokens } = useQuery({
    queryKey: ["today_tokens"],
    queryFn: fetchTodayTokens,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
  const { data: breaks } = useQuery({
    queryKey: ["active_breaks"],
    queryFn: fetchActiveBreaks,
    refetchInterval: 5000,
  });

  //const consulting = tokens?.find((t) => t.status === "consulting");
//  const waiting = tokens?.filter((t) => t.status === "waiting").slice(0, 10) || [];
  const sortedTokens = [...(tokens || [])].sort(
    (a, b) => a.token_number - b.token_number
  );

  const consulting = sortedTokens.find((t) => t.status === "consulting");

  const waiting = sortedTokens
    .filter((t) => t.status === "waiting")
    .slice(0, 10);



  const hasActiveBreak = breaks && breaks.length > 0;

  const estimateTime = (position: number) => {
    const minutesPerToken = 5;
    const totalMinutes = position * minutesPerToken;
    return `~${totalMinutes} min`;
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container py-12 max-w-2xl">
        <h1 className="text-3xl font-bold font-display text-gradient mb-8 text-center flex items-center justify-center gap-2">
          <Radio className="h-7 w-7 text-primary animate-pulse-slow" />
          Live Token Status
        </h1>

        {/* Active Break Alert */}
        {hasActiveBreak && (
          <Card className="mb-6 border-warning/40 bg-warning/10">
            <CardContent className="p-4 flex items-center gap-3">
              {breaks![0].break_type === "Tea Break" ? (
                <Coffee className="h-6 w-6 text-warning" />
              ) : breaks![0].break_type === "Lunch Break" ? (
                <UtensilsCrossed className="h-6 w-6 text-warning" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-warning" />
              )}
              <div>
                <p className="font-semibold text-warning">Doctor is on {breaks![0].break_type}</p>
                <p className="text-sm text-muted-foreground">Consultation will resume shortly. Please wait.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Currently Consulting */}
        <Card className="mb-6 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Now Consulting</CardTitle>
          </CardHeader>
          <CardContent>
            {consulting ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary">
                  <span className="text-3xl font-extrabold text-primary-foreground">#{consulting.token_number}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{consulting.patient_name}</p>
                  <Badge className="bg-primary/20 text-primary">In Progress</Badge>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No patient currently consulting</p>
            )}
          </CardContent>
        </Card>

        {/* Waiting Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waiting.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tokens in queue</p>
            ) : (
              <div className="space-y-2">
                {waiting.map((token, i) => (
                  <div
                    key={token.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                        #{token.token_number}
                      </span>
                      <span className="font-medium">{token.patient_name}</span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      {estimateTime(i + 1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
