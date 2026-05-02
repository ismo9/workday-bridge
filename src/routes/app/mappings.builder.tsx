import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { sampleCsvColumns, workdayFields } from "@/lib/mockData";
import { ArrowLeft, ArrowRight, Save, Play, Plus, Wand2, Trash2, GitMerge } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/mappings/builder")({ component: Builder });

type Row = { source: string; target: string; type: "simple" | "value" | "composite"; transform?: string };

function Builder() {
  const [rows, setRows] = useState<Row[]>([
    { source: "employee_id", target: "WorkerID", type: "simple" },
    { source: "first_name + last_name", target: "FullName", type: "composite", transform: "concat( , )" },
    { source: "country", target: "Country", type: "value" },
    { source: "hire_date", target: "HireDate", type: "simple", transform: "format YYYY-MM-DD" },
    { source: "email", target: "Email", type: "simple" },
  ]);

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <PageHeader
        eyebrow="Mapping builder"
        title="New mapping — Workers"
        description="Map source CSV columns to Workday fields with transformation rules."
        actions={
          <>
            <Link to="/app/mappings"><Button variant="outline"><ArrowLeft className="size-4" />Back</Button></Link>
            <Button variant="outline" onClick={() => toast.info("Validation passed — 0 errors, 1 warning")}><Wand2 className="size-4" />Validate</Button>
            <Button className="bg-gradient-primary" onClick={() => toast.success("Mapping saved")}><Save className="size-4" />Save mapping</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription>Mapping metadata</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div><Label>Mapping name</Label><Input defaultValue="Workers Standard EU v3" className="mt-1.5" /></div>
              <div><Label>Business Object</Label>
                <Select defaultValue="workers"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="workers">Workers</SelectItem><SelectItem value="customers">Customers</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between md:col-span-2 p-3 rounded-lg border bg-card">
                <div><div className="font-medium text-sm">Active</div><div className="text-xs text-muted-foreground">Available for imports</div></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Field mappings</CardTitle>
                <CardDescription>Source CSV → Workday field</CardDescription>
              </div>
              <Button size="sm" onClick={() => setRows([...rows, { source: "", target: "", type: "simple" }])}>
                <Plus className="size-4" />Add row
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-[1fr_auto_1fr_140px_40px] gap-2 px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                <div>Source column</div><div></div><div>Workday field</div><div>Type</div><div></div>
              </div>
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr_140px_40px] gap-2 items-center p-2 rounded-lg border bg-card hover:shadow-soft transition">
                  <Select value={r.source} onValueChange={(v) => update(i, { source: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose column" /></SelectTrigger>
                    <SelectContent>
                      {sampleCsvColumns.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      <SelectItem value="first_name + last_name">first_name + last_name (composite)</SelectItem>
                    </SelectContent>
                  </Select>
                  <ArrowRight className="size-4 text-muted-foreground" />
                  <Select value={r.target} onValueChange={(v) => update(i, { target: v })}>
                    <SelectTrigger><SelectValue placeholder="Workday field" /></SelectTrigger>
                    <SelectContent>{workdayFields.map((f) => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={r.type} onValueChange={(v: any) => update(i, { type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="composite">Composite</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" onClick={() => remove(i)} className="text-destructive hover:text-destructive"><Trash2 className="size-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Value mappings — Country</CardTitle>
              <CardDescription>Translate source values to Workday enumerations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="values">
                <TabsList>
                  <TabsTrigger value="values">Value table</TabsTrigger>
                  <TabsTrigger value="rules">Rule engine</TabsTrigger>
                  <TabsTrigger value="preview">Preview output</TabsTrigger>
                </TabsList>
                <TabsContent value="values">
                  <div className="space-y-2 mt-3">
                    {[["FR", "France"], ["JP", "Japan"], ["ES", "Spain"], ["IN", "India"], ["DE", "Germany"]].map(([s, t]) => (
                      <div key={s} className="grid grid-cols-[1fr_auto_1fr_40px] gap-2 items-center p-2 rounded-lg border bg-card">
                        <Input defaultValue={s} className="font-mono" />
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <Input defaultValue={t} />
                        <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="size-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm"><Plus className="size-4" />Add value</Button>
                  </div>
                </TabsContent>
                <TabsContent value="rules" className="mt-3 space-y-3">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm font-medium mb-2">Rule: Concatenate full name</div>
                    <code className="block text-xs font-mono bg-muted/60 rounded p-3">concat(first_name, " ", last_name)</code>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm font-medium mb-2">Rule: Default Country</div>
                    <code className="block text-xs font-mono bg-muted/60 rounded p-3">if (country == null) → "Unknown"</code>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm font-medium mb-2">Rule: Format hire_date</div>
                    <code className="block text-xs font-mono bg-muted/60 rounded p-3">date_format(hire_date, "YYYY-MM-DD")</code>
                  </div>
                  <Button variant="outline" size="sm"><Plus className="size-4" />Add rule</Button>
                </TabsContent>
                <TabsContent value="preview" className="mt-3">
                  <pre className="bg-sidebar text-sidebar-foreground p-4 rounded-lg text-xs overflow-auto scrollbar-thin"><code>{`<wd:Worker_Data>
  <wd:Worker_ID>E1001</wd:Worker_ID>
  <wd:Personal_Data>
    <wd:Name_Data>
      <wd:Legal_Name_Data>
        <wd:Name_Detail_Data>
          <wd:First_Name>John</wd:First_Name>
          <wd:Last_Name>Doe</wd:Last_Name>
        </wd:Name_Detail_Data>
      </wd:Legal_Name_Data>
    </wd:Name_Data>
  </wd:Personal_Data>
  <wd:Country_Reference>France</wd:Country_Reference>
  <wd:Hire_Date>2024-03-12</wd:Hire_Date>
</wd:Worker_Data>`}</code></pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="shadow-soft sticky top-20">
            <CardHeader><CardTitle className="text-base">Mapping summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total fields</span><span className="font-medium">{rows.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Required covered</span><span className="font-medium text-success">7 / 8</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rules</span><span className="font-medium">3</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Value mappings</span><span className="font-medium">5</span></div>
              <div className="pt-3 border-t">
                <Badge variant="outline" className="bg-warning/15 text-warning-foreground border-warning/40">1 warning</Badge>
                <p className="text-xs text-muted-foreground mt-2">Field “ManagerID” is unmapped. Workday accepts null but reference will be empty.</p>
              </div>
              <Button className="w-full bg-gradient-primary mt-2"><Play className="size-4" />Run dry-run</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
