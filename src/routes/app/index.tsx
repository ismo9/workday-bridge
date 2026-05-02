import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/app/StatusBadge";
import { businessObjects, importTrend, imports } from "@/lib/mockData";
import { ArrowUpRight, Database, GitMerge, PlayCircle, Plus, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const kpis = [
  { label: "Total imports (30d)", value: "12,482", delta: "+18%", icon: Activity, trend: "up" },
  { label: "Active mappings", value: "24", delta: "+3", icon: GitMerge, trend: "up" },
  { label: "Datasets uploaded", value: "168", delta: "+12", icon: Database, trend: "up" },
  { label: "Failed rows", value: "342", delta: "-26%", icon: AlertTriangle, trend: "down" },
];

function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Welcome back, Sarah"
        description="Monitor your migrations, mappings and Workday import health at a glance."
        actions={
          <>
            <Link to="/app/datasets"><Button variant="outline"><Plus className="size-4" />Upload CSV</Button></Link>
            <Link to="/app/imports"><Button className="bg-gradient-primary"><PlayCircle className="size-4" />New import</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <k.icon className="size-4" />
                </div>
                <span className={`text-xs font-medium ${k.trend === "up" ? "text-success" : "text-success"}`}>{k.delta}</span>
              </div>
              <div className="text-2xl font-semibold">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Import volume — last 7 days</CardTitle>
                <CardDescription>Successful vs failed rows pushed to Workday</CardDescription>
              </div>
              <TrendingUp className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={importTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.19 255)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.52 0.19 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.012 250)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.02 255)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 255)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.012 250)" }} />
                <Area type="monotone" dataKey="success" stroke="oklch(0.52 0.19 255)" fill="url(#g1)" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke="oklch(0.6 0.22 25)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">System health</CardTitle>
            <CardDescription>Runtime indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { l: "SOAP success rate", v: 97, color: "bg-success" },
              { l: "Mapping validation", v: 92, color: "bg-info" },
              { l: "Tenant uptime", v: 99, color: "bg-primary" },
              { l: "Queue capacity", v: 64, color: "bg-warning" },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{s.l}</span>
                  <span className="font-medium">{s.v}%</span>
                </div>
                <Progress value={s.v} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Business Objects</CardTitle>
              <CardDescription>Configured Workday entities</CardDescription>
            </div>
            <Link to="/app/business-objects" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowUpRight className="size-3.5" /></Link>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {businessObjects.slice(0, 4).map((b) => (
              <Link key={b.id} to="/app/business-objects" className="rounded-lg border p-4 hover:border-primary/40 hover:shadow-soft transition">
                <div className="text-sm font-medium">{b.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{b.fieldCount} fields · {b.mappingsCount} mappings</div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent imports</CardTitle>
              <CardDescription>Latest execution activity</CardDescription>
            </div>
            <Link to="/app/imports" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowUpRight className="size-3.5" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {imports.slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{i.dataset}</div>
                  <div className="text-xs text-muted-foreground truncate">{i.mapping} · {i.startedAt}</div>
                </div>
                <StatusBadge status={i.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
