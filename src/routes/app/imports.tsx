import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/StatusBadge";
import { imports, datasets, mappings } from "@/lib/mockData";
import { PlayCircle, Pause, RotateCw, ScrollText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/imports")({ component: Imp });

function Imp() {
  return (
    <div>
      <PageHeader
        eyebrow="Execution"
        title="Imports"
        description="Run, monitor and retry data migration jobs to Workday."
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 mb-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Configure new import</CardTitle>
            <CardDescription>Pick a dataset and an active mapping to launch a SOAP migration job.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Dataset</Label>
                <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose dataset" /></SelectTrigger>
                  <SelectContent>{datasets.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Mapping</Label>
                <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose mapping" /></SelectTrigger>
                  <SelectContent>{mappings.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Batch size</Label>
                <Select defaultValue="100"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 rows</SelectItem>
                    <SelectItem value="100">100 rows</SelectItem>
                    <SelectItem value="500">500 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Retry strategy</Label>
                <Select defaultValue="3"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No retry</SelectItem>
                    <SelectItem value="3">Retry 3x (exponential)</SelectItem>
                    <SelectItem value="5">Retry 5x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div>
                <Label className="cursor-pointer">Dry-run (simulation)</Label>
                <p className="text-xs text-muted-foreground">Validate transformations without sending to Workday</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-2">
              <Button className="bg-gradient-primary" onClick={() => toast.success("Import started — job #imp1006")}><PlayCircle className="size-4" />Execute import</Button>
              <Button variant="outline">Save as template</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Currently running</CardTitle>
            <CardDescription>Job #imp1004</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span>new_hires_eu.csv</span><span className="font-medium">191/312</span></div>
              <Progress value={61} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div><div className="text-success font-semibold">187</div><div className="text-xs text-muted-foreground">Success</div></div>
              <div><div className="text-destructive font-semibold">4</div><div className="text-xs text-muted-foreground">Failed</div></div>
              <div><div className="font-semibold">121</div><div className="text-xs text-muted-foreground">Pending</div></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1"><Pause className="size-4" />Pause</Button>
              <Button variant="outline" className="flex-1"><RotateCw className="size-4" />Retry failed</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="text-base">Recent imports</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Mapping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((i) => (
                <TableRow key={i.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="text-sm">{i.dataset}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.mapping}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <Progress value={(i.success / i.total) * 100} className="h-1.5 flex-1" />
                      <span className="text-xs font-mono text-muted-foreground">{i.success}/{i.total}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.startedAt}</TableCell>
                  <TableCell className="text-sm">{i.duration}</TableCell>
                  <TableCell><Button size="icon" variant="ghost"><ScrollText className="size-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
