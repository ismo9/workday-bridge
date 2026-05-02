import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/app/StatusBadge";
import { users } from "@/lib/mockData";
import { Plus, Edit3, Trash2, Shield } from "lucide-react";

export const Route = createFileRoute("/app/admin/users")({ component: U });

const roleColors: Record<string, string> = {
  Administrator: "bg-primary/15 text-primary border-primary/30",
  Consultant: "bg-info/15 text-info border-info/30",
  Client: "bg-muted text-muted-foreground",
};

function U() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Users & Permissions"
        description="Manage platform users, their roles, and tenant access."
        actions={<Button className="bg-gradient-primary"><Plus className="size-4" />Invite user</Button>}
      />
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">{u.name.split(" ").map(n => n[0]).join("")}</div>
                      <div><div className="font-medium text-sm">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={roleColors[u.role]}><Shield className="size-3 mr-1" />{u.role}</Badge></TableCell>
                  <TableCell className="text-sm">{u.tenant}</TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost"><Edit3 className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="size-4" /></Button>
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
