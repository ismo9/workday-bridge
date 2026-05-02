import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin/settings")({ component: S });

function S() {
  return (
    <div>
      <PageHeader eyebrow="Administration" title="Settings" description="Global platform, security, and Workday connectivity configuration." />
      <Tabs defaultValue="workday">
        <TabsList>
          <TabsTrigger value="workday">Workday connection</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API & Webhooks</TabsTrigger>
        </TabsList>
        <TabsContent value="workday">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">SOAP credentials</CardTitle><CardDescription>Used by the import engine</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div><Label>Tenant URL</Label><Input defaultValue="https://wd5-impl-services1.workday.com/ccx/service/acme" className="mt-1.5 font-mono text-xs" /></div>
              <div><Label>Tenant alias</Label><Input defaultValue="acme" className="mt-1.5" /></div>
              <div><Label>Integration user</Label><Input defaultValue="ISU_MIGRATION@acme" className="mt-1.5" /></div>
              <div><Label>API key / password</Label><Input type="password" defaultValue="••••••••••••" className="mt-1.5" /></div>
              <div className="md:col-span-2 flex gap-2">
                <Button className="bg-gradient-primary" onClick={() => toast.success("Connection test successful")}>Test connection</Button>
                <Button variant="outline" onClick={() => toast.success("Saved")}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card className="shadow-soft">
            <CardContent className="p-6 space-y-4">
              {[
                { l: "Require MFA for all users", d: "Enforce two-factor authentication" },
                { l: "JWT session refresh", d: "Auto-refresh tokens before expiry" },
                { l: "Audit log retention (90 days)", d: "Keep detailed import logs" },
                { l: "IP allowlist", d: "Restrict access to known IPs" },
              ].map((s) => (
                <div key={s.l} className="flex items-center justify-between p-3 rounded-lg border">
                  <div><div className="font-medium text-sm">{s.l}</div><div className="text-xs text-muted-foreground">{s.d}</div></div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="shadow-soft"><CardContent className="p-6 space-y-4">
            {["Import completed", "Import failed", "New mapping created", "Dataset uploaded"].map(n => (
              <div key={n} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="text-sm font-medium">{n}</div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="api">
          <Card className="shadow-soft">
            <CardContent className="p-6 space-y-4">
              <div><Label>API Base URL</Label><Input defaultValue="https://api.workday-migrate.local/v1" className="mt-1.5 font-mono text-xs" /></div>
              <div><Label>Webhook endpoint</Label><Input placeholder="https://your-system/webhook" className="mt-1.5 font-mono text-xs" /></div>
              <div><Label>API token</Label><Input type="password" defaultValue="••••••••••••" className="mt-1.5" /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
