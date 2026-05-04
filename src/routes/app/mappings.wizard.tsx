import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Save, Play, Plus, Trash2, Wand2, Upload, GitMerge,
  CheckCircle2, AlertCircle, Sparkles, Database, FileText, Code2, ShieldAlert,
  RefreshCw, Eye, ListChecks
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { businessObjects, sampleCsvColumns, sampleCsvRows, workdayFields } from "@/lib/mockData";

export const Route = createFileRoute("/app/mappings/wizard")({ component: Wizard });

type RuleType = "simple" | "value" | "composite" | "constant" | "conditional" | "lookup";
type Row = {
  source: string;
  target: string;
  type: RuleType;
  transform?: string;
  required?: boolean;
  defaultValue?: string;
};
type ValueMap = { source: string; target: string };

const STEPS = [
  { id: 1, label: "Source", icon: Database, hint: "Pick CSV / dataset" },
  { id: 2, label: "Target", icon: GitMerge, hint: "Workday object" },
  { id: 3, label: "Mapping", icon: Wand2, hint: "Field rules" },
  { id: 4, label: "Transform", icon: Code2, hint: "Rules & values" },
  { id: 5, label: "Validate", icon: ListChecks, hint: "Check & fix" },
  { id: 6, label: "Preview", icon: Eye, hint: "SOAP payload" },
  { id: 7, label: "Save", icon: Save, hint: "Publish" },
];

function Wizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [sourceMode, setSourceMode] = useState<"upload" | "existing">("existing");
  const [datasetName, setDatasetName] = useState("workers_q4_2025.csv");
  const [delimiter, setDelimiter] = useState(",");
  const [encoding, setEncoding] = useState("UTF-8");
  const [hasHeader, setHasHeader] = useState(true);

  // Step 2
  const [businessObject, setBusinessObject] = useState("workers");
  const [mappingName, setMappingName] = useState("Workers Standard EU v4");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  // Step 3 — field mappings
  const [rows, setRows] = useState<Row[]>([
    { source: "employee_id", target: "WorkerID", type: "simple", required: true },
    { source: "first_name", target: "FirstName", type: "simple", required: true },
    { source: "last_name", target: "LastName", type: "simple", required: true },
    { source: "email", target: "Email", type: "simple", required: true },
    { source: "hire_date", target: "HireDate", type: "simple", transform: "format YYYY-MM-DD", required: true },
    { source: "country", target: "Country", type: "value", required: true },
    { source: "first_name + last_name", target: "FullName", type: "composite", transform: 'concat(first_name," ",last_name)' },
  ]);

  // Step 4 — value mappings
  const [valueMaps, setValueMaps] = useState<ValueMap[]>([
    { source: "FR", target: "France" },
    { source: "JP", target: "Japan" },
    { source: "ES", target: "Spain" },
    { source: "IN", target: "India" },
    { source: "DE", target: "Germany" },
  ]);
  const [rules, setRules] = useState<{ name: string; expr: string }[]>([
    { name: "Default Country", expr: 'if (country == null) → "Unknown"' },
    { name: "Format hire_date", expr: 'date_format(hire_date, "YYYY-MM-DD")' },
    { name: "Trim emails", expr: "trim(lower(email))" },
  ]);

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const addRow = () => setRows([...rows, { source: "", target: "", type: "simple" }]);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warns: string[] = [];
    const requiredWdFields = workdayFields.filter((f) => f.required).map((f) => f.id);
    const mappedTargets = rows.map((r) => r.target);
    const missingRequired = requiredWdFields.filter((id) => !mappedTargets.includes(id));
    missingRequired.forEach((id) => errors.push(`Required Workday field "${id}" is unmapped`));
    rows.forEach((r, i) => {
      if (!r.source) errors.push(`Row ${i + 1}: source column is empty`);
      if (!r.target) errors.push(`Row ${i + 1}: target field is empty`);
    });
    const dup = new Set<string>();
    rows.forEach((r) => {
      if (r.target && dup.has(r.target)) warns.push(`Target "${r.target}" mapped more than once`);
      else if (r.target) dup.add(r.target);
    });
    if (!mappedTargets.includes("ManagerID")) warns.push('"ManagerID" is unmapped — Workday accepts null but reference will be empty.');
    return { errors, warns };
  }, [rows]);

  const aiSuggest = () => {
    toast.success("AI suggested 3 mappings", { description: "department→Organization, job_title→JobTitle, salary→Compensation" });
    setRows([
      ...rows,
      { source: "department", target: "Department", type: "simple" },
      { source: "job_title", target: "JobTitle", type: "simple" },
      { source: "salary", target: "Compensation", type: "simple" },
    ]);
  };

  const onPublish = () => {
    if (validation.errors.length) {
      toast.error(`${validation.errors.length} error(s) — fix them first`);
      setStep(5);
      return;
    }
    toast.success(`Mapping "${mappingName}" published`);
    setTimeout(() => navigate({ to: "/app/mappings" }), 600);
  };

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const progress = (step / STEPS.length) * 100;

  return (
    <div>
      <PageHeader
        eyebrow="Mapping wizard"
        title="Build a new mapping"
        description="Step-by-step wizard to map source CSV → Workday SOAP payload with rules, value translations and validation."
        actions={
          <>
            <Link to="/app/mappings"><Button variant="outline"><ArrowLeft className="size-4" />Back</Button></Link>
            <Button variant="outline" onClick={aiSuggest}><Sparkles className="size-4" />AI suggest</Button>
            <Button className="bg-gradient-primary" onClick={onPublish}>
              <Save className="size-4" />Publish
            </Button>
          </>
        }
      />

      {/* Stepper */}
      <Card className="shadow-soft mb-5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2 mb-4 overflow-x-auto scrollbar-thin">
            {STEPS.map((s, idx) => {
              const done = step > s.id;
              const active = step === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 shrink-0 transition ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}`}
                >
                  <div className={`size-8 rounded-lg flex items-center justify-center border ${active ? "bg-primary text-primary-foreground border-primary shadow-glow" : done ? "bg-success/15 text-success border-success/40" : "bg-card border-border"}`}>
                    {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                  </div>
                  <div className="leading-tight text-left hidden md:block">
                    <div className="text-[11px] uppercase tracking-wider font-medium">Step {s.id}</div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </div>
                  {idx < STEPS.length - 1 && <div className="w-6 h-px bg-border mx-1 hidden lg:block" />}
                </button>
              );
            })}
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">1. Choose the source</CardTitle>
                <CardDescription>Upload a new CSV or pick an existing dataset</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSourceMode("upload")}
                    className={`p-4 rounded-xl border text-left transition ${sourceMode === "upload" ? "border-primary bg-primary/5 shadow-glow" : "bg-card hover:border-primary/40"}`}
                  >
                    <Upload className="size-5 text-primary mb-2" />
                    <div className="font-semibold text-sm">Upload new CSV</div>
                    <div className="text-xs text-muted-foreground mt-1">Drag & drop a file from your computer</div>
                  </button>
                  <button
                    onClick={() => setSourceMode("existing")}
                    className={`p-4 rounded-xl border text-left transition ${sourceMode === "existing" ? "border-primary bg-primary/5 shadow-glow" : "bg-card hover:border-primary/40"}`}
                  >
                    <Database className="size-5 text-primary mb-2" />
                    <div className="font-semibold text-sm">Pick existing dataset</div>
                    <div className="text-xs text-muted-foreground mt-1">Reuse one of your previously uploaded files</div>
                  </button>
                </div>
                {sourceMode === "upload" ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
                    <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drop CSV file here</p>
                    <p className="text-xs text-muted-foreground">Max 50 MB · UTF-8 recommended</p>
                    <Button variant="outline" size="sm" className="mt-3"><Upload className="size-4" />Browse files</Button>
                  </div>
                ) : (
                  <div>
                    <Label>Existing dataset</Label>
                    <Select value={datasetName} onValueChange={setDatasetName}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workers_q4_2025.csv">workers_q4_2025.csv (1,248 rows)</SelectItem>
                        <SelectItem value="new_hires_eu.csv">new_hires_eu.csv (312 rows)</SelectItem>
                        <SelectItem value="customers_emea.csv">customers_emea.csv (5,621 rows)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <Label>Delimiter</Label>
                    <Select value={delimiter} onValueChange={setDelimiter}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value=",">Comma (,)</SelectItem>
                        <SelectItem value=";">Semicolon (;)</SelectItem>
                        <SelectItem value="\t">Tab</SelectItem>
                        <SelectItem value="|">Pipe (|)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Encoding</Label>
                    <Select value={encoding} onValueChange={setEncoding}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTF-8">UTF-8</SelectItem>
                        <SelectItem value="UTF-16">UTF-16</SelectItem>
                        <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div>
                      <div className="font-medium text-sm">Has header</div>
                      <div className="text-xs text-muted-foreground">First row = column names</div>
                    </div>
                    <Switch checked={hasHeader} onCheckedChange={setHasHeader} />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Detected columns ({sampleCsvColumns.length})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleCsvColumns.map((c) => (
                      <Badge key={c} variant="outline" className="font-mono text-[11px]">{c}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Preview (first 3 rows)</Label>
                  <div className="overflow-auto rounded-lg border">
                    <table className="text-xs w-full">
                      <thead className="bg-muted/40">
                        <tr>{sampleCsvColumns.map((c) => <th key={c} className="px-2 py-1.5 text-left font-medium">{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {sampleCsvRows.slice(0, 3).map((r, i) => (
                          <tr key={i} className="border-t">
                            {r.map((cell, j) => <td key={j} className="px-2 py-1.5 font-mono">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">2. Target Workday object</CardTitle>
                <CardDescription>Pick the business object and name your mapping</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {businessObjects.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBusinessObject(b.id)}
                      className={`p-4 rounded-xl border text-left transition ${businessObject === b.id ? "border-primary bg-primary/5 shadow-glow" : "bg-card hover:border-primary/40"}`}
                    >
                      <div className="font-semibold text-sm">{b.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{b.description}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3">{b.fieldCount} fields · {b.mappingsCount} mappings</div>
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Mapping name *</Label>
                    <Input value={mappingName} onChange={(e) => setMappingName(e.target.value)} className="mt-1.5" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div>
                      <div className="font-medium text-sm">Active</div>
                      <div className="text-xs text-muted-foreground">Available in imports immediately</div>
                    </div>
                    <Switch checked={active} onCheckedChange={setActive} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes for other consultants" className="mt-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">3. Field mappings</CardTitle>
                  <CardDescription>Map each CSV column to a Workday field</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={aiSuggest}><Sparkles className="size-4" />Auto-match</Button>
                  <Button size="sm" onClick={addRow}><Plus className="size-4" />Add row</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-[1fr_auto_1fr_130px_40px] gap-2 px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  <div>Source column</div><div></div><div>Workday field</div><div>Rule type</div><div></div>
                </div>
                {rows.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr_130px_40px] gap-2 items-center p-2 rounded-lg border bg-card hover:shadow-soft transition">
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
                      <SelectContent>
                        {workdayFields.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.label}{f.required ? " *" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={r.type} onValueChange={(v: RuleType) => update(i, { type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="value">Value map</SelectItem>
                        <SelectItem value="composite">Composite</SelectItem>
                        <SelectItem value="constant">Constant</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                        <SelectItem value="lookup">DB Lookup</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" onClick={() => remove(i)} className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">4. Transformations</CardTitle>
                <CardDescription>Value translations and rule expressions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="values">
                  <TabsList>
                    <TabsTrigger value="values">Value mapping</TabsTrigger>
                    <TabsTrigger value="rules">Rule engine</TabsTrigger>
                    <TabsTrigger value="defaults">Defaults & nulls</TabsTrigger>
                  </TabsList>
                  <TabsContent value="values" className="space-y-2 mt-3">
                    <div className="text-xs text-muted-foreground mb-2">Country: source → Workday enum</div>
                    {valueMaps.map((vm, i) => (
                      <div key={i} className="grid grid-cols-[1fr_auto_1fr_40px] gap-2 items-center p-2 rounded-lg border bg-card">
                        <Input value={vm.source} onChange={(e) => setValueMaps(valueMaps.map((v, idx) => idx === i ? { ...v, source: e.target.value } : v))} className="font-mono" />
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <Input value={vm.target} onChange={(e) => setValueMaps(valueMaps.map((v, idx) => idx === i ? { ...v, target: e.target.value } : v))} />
                        <Button size="icon" variant="ghost" onClick={() => setValueMaps(valueMaps.filter((_, idx) => idx !== i))} className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setValueMaps([...valueMaps, { source: "", target: "" }])}>
                      <Plus className="size-4" />Add value
                    </Button>
                  </TabsContent>
                  <TabsContent value="rules" className="space-y-3 mt-3">
                    {rules.map((r, i) => (
                      <div key={i} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <Input value={r.name} onChange={(e) => setRules(rules.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} className="max-w-xs font-medium" />
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setRules(rules.filter((_, idx) => idx !== i))}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={r.expr}
                          onChange={(e) => setRules(rules.map((x, idx) => idx === i ? { ...x, expr: e.target.value } : x))}
                          className="font-mono text-xs bg-muted/40"
                          rows={2}
                        />
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setRules([...rules, { name: "New rule", expr: "" }])}>
                      <Plus className="size-4" />Add rule
                    </Button>
                  </TabsContent>
                  <TabsContent value="defaults" className="space-y-2 mt-3">
                    <div className="grid grid-cols-[1fr_1fr_120px] gap-2 px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      <div>Field</div><div>Default if null</div><div>On error</div>
                    </div>
                    {workdayFields.slice(0, 6).map((f) => (
                      <div key={f.id} className="grid grid-cols-[1fr_1fr_120px] gap-2 items-center p-2 rounded-lg border bg-card">
                        <div className="text-sm font-medium">{f.label}{f.required && <Badge variant="outline" className="ml-2 text-[10px] border-destructive/40 text-destructive">required</Badge>}</div>
                        <Input placeholder="(none)" />
                        <Select defaultValue="skip">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skip">Skip row</SelectItem>
                            <SelectItem value="fail">Fail import</SelectItem>
                            <SelectItem value="default">Use default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">5. Validation</CardTitle>
                <CardDescription>Schema, required fields, and rule integrity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg border bg-card text-center">
                    <div className="text-2xl font-semibold text-success">{rows.length}</div>
                    <div className="text-xs text-muted-foreground">Mapped fields</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card text-center">
                    <div className="text-2xl font-semibold text-destructive">{validation.errors.length}</div>
                    <div className="text-xs text-muted-foreground">Errors</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card text-center">
                    <div className="text-2xl font-semibold text-warning">{validation.warns.length}</div>
                    <div className="text-xs text-muted-foreground">Warnings</div>
                  </div>
                </div>
                {validation.errors.length === 0 && validation.warns.length === 0 ? (
                  <div className="p-4 rounded-lg border bg-success/10 text-success flex items-center gap-2">
                    <CheckCircle2 className="size-5" /> All checks passed — safe to publish.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {validation.errors.map((e, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-destructive/10 border-destructive/30 flex items-start gap-2 text-sm">
                        <ShieldAlert className="size-4 text-destructive shrink-0 mt-0.5" /> {e}
                      </div>
                    ))}
                    {validation.warns.map((w, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-warning/10 border-warning/30 flex items-start gap-2 text-sm">
                        <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" /> {w}
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" onClick={() => toast.info("Re-running validation…")}>
                  <RefreshCw className="size-4" /> Re-validate
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">6. SOAP preview & dry-run</CardTitle>
                <CardDescription>Generated payload for the first row of the dataset</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs defaultValue="xml">
                  <TabsList>
                    <TabsTrigger value="xml">SOAP XML</TabsTrigger>
                    <TabsTrigger value="json">Internal JSON</TabsTrigger>
                    <TabsTrigger value="diff">Row preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="xml" className="mt-3">
                    <pre className="bg-sidebar text-sidebar-foreground p-4 rounded-lg text-xs overflow-auto scrollbar-thin">
                      <code>{`<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
  <env:Body>
    <wd:Put_Worker_Request xmlns:wd="urn:com.workday/bsvc">
      <wd:Worker_Data>
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
        <wd:Email>john.doe@acme.com</wd:Email>
      </wd:Worker_Data>
    </wd:Put_Worker_Request>
  </env:Body>
</env:Envelope>`}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="json" className="mt-3">
                    <pre className="bg-sidebar text-sidebar-foreground p-4 rounded-lg text-xs overflow-auto scrollbar-thin">
                      <code>{JSON.stringify({ WorkerID: "E1001", FirstName: "John", LastName: "Doe", Email: "john.doe@acme.com", HireDate: "2024-03-12", Country: "France", FullName: "John Doe" }, null, 2)}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="diff" className="mt-3">
                    <div className="overflow-auto rounded-lg border">
                      <table className="text-xs w-full">
                        <thead className="bg-muted/40">
                          <tr><th className="px-2 py-1.5 text-left">Workday field</th><th className="px-2 py-1.5 text-left">Source value</th><th className="px-2 py-1.5 text-left">Output</th></tr>
                        </thead>
                        <tbody>
                          {rows.map((r, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-2 py-1.5 font-medium">{r.target || "—"}</td>
                              <td className="px-2 py-1.5 font-mono text-muted-foreground">{r.source || "—"}</td>
                              <td className="px-2 py-1.5 font-mono">{r.transform ? `[${r.type}]` : "→"} sample</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button variant="outline" onClick={() => toast.success("Dry-run completed: 5/5 rows valid")}>
                  <Play className="size-4" /> Run dry-run on first 5 rows
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">7. Save & publish</CardTitle>
                <CardDescription>Final review before making the mapping available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Mapping</div><div className="font-medium">{mappingName}</div></div>
                  <div className="p-3 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Object</div><div className="font-medium">{businessObjects.find((b) => b.id === businessObject)?.name}</div></div>
                  <div className="p-3 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Source</div><div className="font-medium">{datasetName}</div></div>
                  <div className="p-3 rounded-lg border bg-card"><div className="text-xs text-muted-foreground">Fields / Rules / Values</div><div className="font-medium">{rows.length} / {rules.length} / {valueMaps.length}</div></div>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <div className="font-medium">Activate immediately</div>
                    <div className="text-xs text-muted-foreground">Available for imports right after publish</div>
                  </div>
                  <Switch checked={active} onCheckedChange={setActive} />
                </div>
                <Button className="w-full bg-gradient-primary" onClick={onPublish}>
                  <Save className="size-4" /> Publish mapping
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prev} disabled={step === 1}><ArrowLeft className="size-4" />Previous</Button>
            {step < STEPS.length ? (
              <Button className="bg-gradient-primary" onClick={next}>Next<ArrowRight className="size-4" /></Button>
            ) : (
              <Button className="bg-gradient-primary" onClick={onPublish}><Save className="size-4" />Publish</Button>
            )}
          </div>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-5">
          <Card className="shadow-soft sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Live summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Step</span><span className="font-medium">{step} / {STEPS.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mapping</span><span className="font-medium truncate max-w-[160px] text-right">{mappingName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="font-medium truncate max-w-[160px] text-right">{datasetName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Object</span><span className="font-medium">{businessObjects.find((b) => b.id === businessObject)?.name}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Fields</span><span className="font-medium">{rows.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Value maps</span><span className="font-medium">{valueMaps.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rules</span><span className="font-medium">{rules.length}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Errors</span><span className={`font-medium ${validation.errors.length ? "text-destructive" : "text-success"}`}>{validation.errors.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Warnings</span><span className={`font-medium ${validation.warns.length ? "text-warning" : "text-success"}`}>{validation.warns.length}</span></div>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-primary"><Sparkles className="size-4" /><span className="font-medium text-sm">AI assistant</span></div>
              <p className="text-xs text-muted-foreground mb-3">Auto-detect column→field matches based on names and types from your dataset.</p>
              <Button size="sm" variant="outline" className="w-full" onClick={aiSuggest}><Wand2 className="size-4" />Suggest mappings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
