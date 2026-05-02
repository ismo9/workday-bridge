import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Success: "bg-success/15 text-success border-success/30",
  Imported: "bg-success/15 text-success border-success/30",
  Active: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Running: "bg-info/15 text-info border-info/30",
  Mapped: "bg-info/15 text-info border-info/30",
  Trial: "bg-warning/15 text-warning-foreground border-warning/40",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] || "bg-muted")}>
      {status === "Running" && <span className="mr-1 size-1.5 rounded-full bg-info animate-pulse" />}
      {status}
    </Badge>
  );
}
