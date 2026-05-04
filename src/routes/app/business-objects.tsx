import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { businessObjects, workdayFields } from "@/lib/mockData";
import { Boxes, Plus, Search, Settings2, Database, GitMerge } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/business-objects")({ component: BO });

function BO() {
  const [q, setQ] = useState("");
  const filtered = businessObjects.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Business Objects"
        description="Workday entities you can migrate. Each object exposes its fields, rules, and reusable mappings."
        actions={
          <Link to="/app/business-objects/new">
            <Button className="bg-gradient-primary"><Plus className="size-4" />New object</Button>
          </Link>
        }
      />

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business objects" className="pl-9 bg-card" />
        </div>
        <Badge variant="outline">{filtered.length} objects</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <Card key={b.id} className="shadow-soft hover:shadow-elegant transition group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="size-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Boxes className="size-5 text-primary-foreground" />
                </div>
                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition">
                  <Settings2 className="size-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg">{b.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{b.description}</p>
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t text-center">
                <div>
                  <div className="text-lg font-semibold">{b.fieldCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fields</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{b.mappingsCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mappings</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{b.datasetsCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Datasets</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Workers — Field schema</h3>
              <p className="text-sm text-muted-foreground">Standard Workday fields exposed for this object</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Database className="size-4" />Add custom field</Button>
              <Button variant="outline" size="sm"><GitMerge className="size-4" />View mappings</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {workdayFields.map((f) => (
              <div key={f.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border bg-card text-sm">
                <div>
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.id}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {f.required && <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">required</Badge>}
                  <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
