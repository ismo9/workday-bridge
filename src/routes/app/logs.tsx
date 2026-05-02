import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Download, AlertCircle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/app/logs")({ component: Logs });

const log = [
  { ts: "2026-05-02 10:22:14", level: "INFO", msg: "Job #imp1004 started — dataset new_hires_eu.csv (312 rows)" },
  { ts: "2026-05-02 10:22:14", level: "INFO", msg: "Mapping 'Workers Standard EU v3' loaded with 18 fields, 4 rules" },
  { ts: "2026-05-02 10:22:15", level: "INFO", msg: "Batch 1/4 — transforming 100 rows" },
  { ts: "2026-05-02 10:22:18", level: "SUCCESS", msg: "Batch 1 SOAP request 200 OK — 100 rows accepted" },
  { ts: "2026-05-02 10:22:21", level: "WARN", msg: "Row 142 — field 'ManagerID' resolved to null reference" },
  { ts: "2026-05-02 10:22:24", level: "ERROR", msg: "Row 187 — Workday rejected: Validation_Error 'Country code IN-XX invalid'" },
  { ts: "2026-05-02 10:22:25", level: "ERROR", msg: "Row 188 — duplicate Worker_ID E1234" },
  { ts: "2026-05-02 10:22:30", level: "INFO", msg: "Batch 2/4 — transforming 100 rows" },
  { ts: "2026-05-02 10:22:36", level: "SUCCESS", msg: "Batch 2 SOAP request 200 OK — 99 rows accepted, 1 warning" },
];

const colors: Record<string, string> = {
  INFO: "text-info border-info/30 bg-info/10",
  SUCCESS: "text-success border-success/30 bg-success/10",
  WARN: "text-warning-foreground border-warning/40 bg-warning/15",
  ERROR: "text-destructive border-destructive/30 bg-destructive/10",
};

function Logs() {
  return (
    <div>
      <PageHeader
        eyebrow="Audit"
        title="Logs & History"
        description="Full traceability of imports, transformations, and SOAP exchanges."
        actions={<Button variant="outline"><Download className="size-4" />Export logs</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { l: "Total events (24h)", v: "8,412", icon: Info, c: "text-info" },
          { l: "Successful rows", v: "8,021", icon: CheckCircle2, c: "text-success" },
          { l: "Warnings", v: "284", icon: AlertCircle, c: "text-warning-foreground" },
          { l: "Errors", v: "107", icon: AlertCircle, c: "text-destructive" },
        ].map((k) => (
          <Card key={k.l} className="shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`size-10 rounded-lg bg-muted flex items-center justify-center ${k.c}`}><k.icon className="size-5" /></div>
              <div><div className="text-xl font-semibold">{k.v}</div><div className="text-xs text-muted-foreground">{k.l}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Live log stream</CardTitle>
              <CardDescription>Auto-refreshes every 5 seconds</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search logs" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-sidebar rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-[500px] overflow-auto scrollbar-thin">
            {log.map((l, i) => (
              <div key={i} className="flex gap-3 items-start text-sidebar-foreground/90">
                <span className="text-sidebar-foreground/50 shrink-0">{l.ts}</span>
                <Badge variant="outline" className={`shrink-0 text-[10px] ${colors[l.level]}`}>{l.level}</Badge>
                <span className="flex-1">{l.msg}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
