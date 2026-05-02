import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { datasets, businessObjects, sampleCsvColumns, sampleCsvRows } from "@/lib/mockData";
import { Upload, Search, FileSpreadsheet, Download, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/datasets")({ component: DS });

function DS() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = datasets.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Source data"
        title="Datasets"
        description="Upload, preview and prepare CSV files for migration."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-primary"><Upload className="size-4" />Upload CSV</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload a new dataset</DialogTitle>
                <DialogDescription>CSV files up to 50MB. Files are parsed automatically and column types inferred.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Business Object</Label>
                  <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select an object" /></SelectTrigger>
                    <SelectContent>{businessObjects.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                  <FileSpreadsheet className="size-10 mx-auto text-muted-foreground mb-2" />
                  <div className="font-medium text-sm">{file ? file.name : "Drag & drop CSV or click to browse"}</div>
                  <div className="text-xs text-muted-foreground mt-1">UTF-8 encoded, comma or semicolon separated</div>
                  <input ref={inputRef} type="file" accept=".csv" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-primary" onClick={() => { toast.success("Dataset uploaded"); setOpen(false); }}>Upload & parse</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All datasets</TabsTrigger>
          <TabsTrigger value="preview">CSV preview</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search datasets" className="pl-9 bg-card" />
            </div>
          </div>
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Business Object</TableHead>
                    <TableHead className="text-right">Rows</TableHead>
                    <TableHead className="text-right">Columns</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((d) => (
                    <TableRow key={d.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-md bg-info/10 text-info flex items-center justify-center"><FileSpreadsheet className="size-4" /></div>
                          <div>
                            <div className="font-medium text-sm">{d.name}</div>
                            <div className="text-xs text-muted-foreground">by {d.uploadedBy}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.businessObject}</TableCell>
                      <TableCell className="text-right text-sm font-mono">{d.rows.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-mono">{d.columns}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.uploadedAt}</TableCell>
                      <TableCell><StatusBadge status={d.status} /></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost"><Eye className="size-4" /></Button>
                          <Button size="icon" variant="ghost"><Download className="size-4" /></Button>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="size-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="shadow-soft">
            <CardContent className="p-0 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    {sampleCsvColumns.map((c) => <TableHead key={c} className="whitespace-nowrap font-mono text-xs">{c}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleCsvRows.map((r, i) => (
                    <TableRow key={i}>
                      {r.map((c, j) => <TableCell key={j} className="text-sm whitespace-nowrap font-mono">{c}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
