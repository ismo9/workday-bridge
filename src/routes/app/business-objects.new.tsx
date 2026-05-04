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
import { ArrowLeft, Save, Plus, Trash2, Boxes, ShieldCheck, Network, Code2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/business-objects/new")({ component: NewBO });

type Field = {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "email" | "enum" | "reference" | "boolean" | "composite";
  required: boolean;
  description?: string;
  workdayPath?: string;
};

const seed: Field[] = [
  { id: "WorkerID", label: "Worker ID", type: "text", required: true, workdayPath: "wd:Worker_Reference/wd:ID" },
  { id: "FirstName", label: "First Name", type: "text", required: true, workdayPath: "wd:Personal_Data/wd:Name_Data/wd:Legal_Name_Data/wd:Name_Detail_Data/wd:First_Name" },
  { id: "LastName", label: "Last Name", type: "text", required: true, workdayPath: "wd:Personal_Data/wd:Name_Data/wd:Legal_Name_Data/wd:Name_Detail_Data/wd:Last_Name" },
  { id: "Email", label: "Primary Email", type: "email", required: true, workdayPath: "wd:Contact_Data/wd:Email_Address_Data/wd:Email_Address" },
  { id: "HireDate", label: "Hire Date", type: "date", required: true, workdayPath: "wd:Hire_Date" },
];

function NewBO() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Boxes");
  const [module, setModule] = useState("Human_Resources");
  const [version, setVersion] = useState("v40.0");
  const [endpoint, setEndpoint] = useState("");
  const [operation, setOperation] = useState("Put_Worker");
  const [tenantScope, setTenantScope] = useState<"global" | "tenant">("tenant");
  const [active, setActive] = useState(true);
  const [auditEnabled, setAuditEnabled] = useState(true);
  const [allowDelete, setAllowDelete] = useState(false);
  const [fields, setFields] = useState<Field[]>(seed);

  const addField = () =>
    setFields([...fields, { id: "", label: "", type: "text", required: false }]);
  const updateField = (i: number, patch: Partial<Field>) =>
    setFields(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));

  const requiredCount = fields.filter((f) => f.required).length;
  const valid = name.trim().length > 1 && fields.length > 0 && fields.every((f) => f.id && f.label);

  const onSave = () => {
    if (!valid) {
      toast.error("Please fill required metadata and ensure every field has an ID and label.");
      return;
    }
    toast.success(`Business object "${name}" created`);
    setTimeout(() => navigate({ to: "/app/business-objects" }), 600);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog · Create"
        title="New Business Object"
        description="Define a Workday entity, its SOAP endpoint, schema fields and governance rules. Reusable across all mappings and imports."
        actions={
          <>
            <Link to="/app/business-objects">
              <Button variant="outline">
                <ArrowLeft className="size-4" />
                Cancel
              </Button>
            </Link>
            <Button className="bg-gradient-primary" onClick={onSave} disabled={!valid}>
              <Save className="size-4" />
              Create object
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Boxes className="size-4 text-primary" /> General
              </CardTitle>
              <CardDescription>Identity and presentation of the object</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Positions, Workers, Cost Centers"
                  className="mt-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this object represents and the typical migration use case"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Boxes", "Users", "Building2", "Wallet", "Truck", "Briefcase", "MapPin", "Database"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scope</Label>
                <Select value={tenantScope} onValueChange={(v: "global" | "tenant") => setTenantScope(v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (all tenants)</SelectItem>
                    <SelectItem value="tenant">Tenant only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="size-4 text-primary" /> Workday SOAP integration
              </CardTitle>
              <CardDescription>Endpoint, web service module and operation used to push records</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Module</Label>
                <Select value={module} onValueChange={setModule}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Human_Resources">Human_Resources</SelectItem>
                    <SelectItem value="Staffing">Staffing</SelectItem>
                    <SelectItem value="Financial_Management">Financial_Management</SelectItem>
                    <SelectItem value="Resource_Management">Resource_Management</SelectItem>
                    <SelectItem value="Integrations">Integrations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>API version</Label>
                <Select value={version} onValueChange={setVersion}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["v40.0", "v41.0", "v42.0", "v43.0"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Endpoint URL</Label>
                <Input
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://wd2-impl-services1.workday.com/ccx/service/{tenant}/Human_Resources/v40.0"
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <Label>SOAP operation</Label>
                <Input
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  placeholder="Put_Worker"
                  className="mt-1.5 font-mono"
                />
              </div>
              <div>
                <Label>WSDL (optional)</Label>
                <Input placeholder="Upload or paste WSDL URL" className="mt-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="size-4 text-primary" /> Field schema
                </CardTitle>
                <CardDescription>Workday fields exposed for mapping. Each field can be marked required and bound to an XPath.</CardDescription>
              </div>
              <Button size="sm" onClick={addField}>
                <Plus className="size-4" /> Add field
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="fields">
                <TabsList>
                  <TabsTrigger value="fields">Fields ({fields.length})</TabsTrigger>
                  <TabsTrigger value="xml">XML skeleton</TabsTrigger>
                  <TabsTrigger value="json">JSON schema</TabsTrigger>
                </TabsList>

                <TabsContent value="fields" className="space-y-2 mt-3">
                  <div className="grid grid-cols-[1fr_1fr_120px_90px_40px] gap-2 px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    <div>Field ID</div>
                    <div>Label</div>
                    <div>Type</div>
                    <div>Required</div>
                    <div></div>
                  </div>
                  {fields.map((f, i) => (
                    <div key={i} className="rounded-lg border bg-card hover:shadow-soft transition">
                      <div className="grid grid-cols-[1fr_1fr_120px_90px_40px] gap-2 items-center p-2">
                        <Input value={f.id} onChange={(e) => updateField(i, { id: e.target.value })} placeholder="WorkerID" className="font-mono text-xs" />
                        <Input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} placeholder="Worker ID" />
                        <Select value={f.type} onValueChange={(v: Field["type"]) => updateField(i, { type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["text", "number", "date", "email", "enum", "reference", "boolean", "composite"].map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center justify-center">
                          <Switch checked={f.required} onCheckedChange={(v) => updateField(i, { required: v })} />
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeField(i)} className="text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <div className="px-2 pb-2">
                        <Input
                          value={f.workdayPath ?? ""}
                          onChange={(e) => updateField(i, { workdayPath: e.target.value })}
                          placeholder="Workday XPath e.g. wd:Personal_Data/wd:Name_Data/.../wd:First_Name"
                          className="font-mono text-[11px] h-8 bg-muted/40"
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="xml" className="mt-3">
                  <pre className="bg-sidebar text-sidebar-foreground p-4 rounded-lg text-xs overflow-auto scrollbar-thin">
                    <code>{`<wd:${operation}_Request xmlns:wd="urn:com.workday/bsvc">
  <wd:Business_Process_Parameters>
    <wd:Auto_Complete>true</wd:Auto_Complete>
    <wd:Run_Now>true</wd:Run_Now>
  </wd:Business_Process_Parameters>
  <wd:Worker_Data>
${fields.map((f) => `    <!-- ${f.label}${f.required ? " (required)" : ""} -->\n    <${f.workdayPath ? f.workdayPath.split("/").pop() : "wd:" + f.id}>{${f.id}}</${f.workdayPath ? f.workdayPath.split("/").pop() : "wd:" + f.id}>`).join("\n")}
  </wd:Worker_Data>
</wd:${operation}_Request>`}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="json" className="mt-3">
                  <pre className="bg-sidebar text-sidebar-foreground p-4 rounded-lg text-xs overflow-auto scrollbar-thin">
                    <code>{JSON.stringify(
                      {
                        name,
                        module,
                        version,
                        operation,
                        scope: tenantScope,
                        fields: fields.map((f) => ({
                          id: f.id,
                          label: f.label,
                          type: f.type,
                          required: f.required,
                          workdayPath: f.workdayPath,
                        })),
                      },
                      null,
                      2,
                    )}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Governance
              </CardTitle>
              <CardDescription>Audit, lifecycle and safety rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <div className="font-medium text-sm">Active</div>
                  <div className="text-xs text-muted-foreground">Available in mapping builder and imports</div>
                </div>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <div className="font-medium text-sm">Audit log enabled</div>
                  <div className="text-xs text-muted-foreground">Record every create/update/delete on this object</div>
                </div>
                <Switch checked={auditEnabled} onCheckedChange={setAuditEnabled} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <div className="font-medium text-sm">Allow delete operation</div>
                  <div className="text-xs text-muted-foreground">Permits Workday delete/inactivate calls. Off by default for safety.</div>
                </div>
                <Switch checked={allowDelete} onCheckedChange={setAllowDelete} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="shadow-soft sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>Live preview of what will be saved</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium truncate max-w-[180px] text-right">{name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Module</span><span className="font-medium">{module}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-medium">{version}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Operation</span><span className="font-mono text-xs">{operation}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Scope</span><Badge variant="outline">{tenantScope}</Badge></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Total fields</span><span className="font-medium">{fields.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Required</span><span className="font-medium text-success">{requiredCount}</span></div>
              <Separator />
              <div className="space-y-2">
                {valid ? (
                  <div className="flex items-start gap-2 text-success">
                    <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                    <span className="text-xs">Ready to create</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-warning">
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <span className="text-xs">Fill name and ensure every field has ID + label</span>
                  </div>
                )}
              </div>
              <Button className="w-full bg-gradient-primary" onClick={onSave} disabled={!valid}>
                <Save className="size-4" /> Create object
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
