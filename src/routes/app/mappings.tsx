import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mappings } from "@/lib/mockData";
import { Plus, Search, GitMerge, Edit3, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/mappings")({ component: M });

function M() {
  const [q, setQ] = useState("");
  const filtered = mappings.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        eyebrow="Transformation"
        title="Mappings"
        description="Reusable rules that transform CSV columns into Workday-ready SOAP payloads."
        actions={
          <div className="flex gap-2">
            <Link to="/app/mappings/builder"><Button variant="outline"><Plus className="size-4" />Quick builder</Button></Link>
            <Link to="/app/mappings/wizard"><Button className="bg-gradient-primary"><Plus className="size-4" />New mapping (wizard)</Button></Link>
          </div>
        }
      />
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mappings" className="pl-9 bg-card" />
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mapping</TableHead>
                <TableHead>Business Object</TableHead>
                <TableHead className="text-right">Fields</TableHead>
                <TableHead className="text-right">Rules</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><GitMerge className="size-4" /></div>
                      <div>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-xs text-muted-foreground">by {m.createdBy}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{m.businessObject}</TableCell>
                  <TableCell className="text-right text-sm font-mono">{m.fields}</TableCell>
                  <TableCell className="text-right text-sm font-mono">{m.rules}</TableCell>
                  <TableCell><Badge variant="outline">{m.version}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.lastUsed}</TableCell>
                  <TableCell><Switch defaultChecked={m.active} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link to="/app/mappings/builder"><Button size="icon" variant="ghost"><Edit3 className="size-4" /></Button></Link>
                      <Button size="icon" variant="ghost"><Copy className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
