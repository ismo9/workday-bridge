import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/app/StatusBadge";
import { tenants } from "@/lib/mockData";
import { Plus, Building, Users, Database, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/app/admin/tenants")({ component: T });

function T() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Tenants"
        description="Manage isolated client workspaces. Each tenant has its own data, users, and Workday credentials."
        actions={<Button className="bg-gradient-primary"><Plus className="size-4" />New tenant</Button>}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((t) => (
          <Card key={t.id} className="shadow-soft hover:shadow-elegant transition">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Building className="size-5 text-primary-foreground" />
                </div>
                <StatusBadge status={t.status} />
              </div>
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <Badge variant="outline" className="mt-1">{t.plan}</Badge>
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t text-center">
                <div><div className="text-lg font-semibold flex items-center justify-center gap-1"><Users className="size-3.5 text-muted-foreground" />{t.users}</div><div className="text-[10px] uppercase text-muted-foreground">Users</div></div>
                <div><div className="text-lg font-semibold flex items-center justify-center gap-1"><Database className="size-3.5 text-muted-foreground" />{t.datasets}</div><div className="text-[10px] uppercase text-muted-foreground">Datasets</div></div>
                <div><div className="text-lg font-semibold flex items-center justify-center gap-1"><PlayCircle className="size-3.5 text-muted-foreground" />{t.imports}</div><div className="text-[10px] uppercase text-muted-foreground">Imports</div></div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">Manage tenant</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
