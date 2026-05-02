import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { ArrowRight, Database, GitMerge, ShieldCheck, Sparkles, Workflow, Zap, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workday Data Migration Platform" },
      { name: "description", content: "Automate CSV to Workday SOAP migrations with dynamic mappings, transformation rules, and full traceability." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="container mx-auto flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Workday Migrate</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Data Platform</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#workflow" className="hover:text-foreground">Workflow</a>
          <a href="#security" className="hover:text-foreground">Security</a>
        </nav>
        <Link to="/app">
          <Button className="bg-gradient-primary shadow-soft">
            Open app <ArrowRight className="size-4" />
          </Button>
        </Link>
      </header>

      <section className="container mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs text-muted-foreground mb-6">
          <span className="size-1.5 rounded-full bg-success animate-pulse" /> Built for enterprise data teams
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          The intelligent ETL bridge for <span className="text-gradient">Workday migrations</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Replace manual Excel mappings with a metadata-driven platform that transforms CSV into Workday-ready SOAP — with rules, validation, dry-runs and full audit logs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/app">
            <Button size="lg" className="bg-gradient-primary shadow-elegant">Launch platform <ArrowRight className="size-4" /></Button>
          </Link>
          <Button size="lg" variant="outline">Watch demo</Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { v: "98%", l: "Less manual mapping" },
            { v: "10x", l: "Faster migrations" },
            { v: "0", l: "Lines of XSLT" },
            { v: "100%", l: "Audit-traceable" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-semibold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-primary font-medium mb-2">Capabilities</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Everything you need, nothing you don't</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: GitMerge, title: "Visual mapping builder", desc: "Drag-and-drop CSV columns to Workday fields. Value, composite, and rule-based mappings included." },
            { icon: Workflow, title: "Java transformation engine", desc: "Object-oriented pipeline — no XSLT. Concatenate, format, default, and conditionally transform." },
            { icon: Zap, title: "SOAP execution & retries", desc: "Batch import with automatic retries, partial-failure handling, and per-row error capture." },
            { icon: Database, title: "Reusable mappings", desc: "Save and version mappings across tenants. Activate, deactivate or roll back instantly." },
            { icon: ShieldCheck, title: "Multi-tenant & RBAC", desc: "Strict tenant isolation with Client, Consultant and Admin roles secured by JWT." },
            { icon: CheckCircle2, title: "Dry-runs & previews", desc: "Simulate imports before sending to Workday. Catch issues at the row level." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card shadow-soft hover:shadow-elegant transition">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-2xl bg-gradient-primary p-10 md:p-16 text-center text-primary-foreground shadow-elegant">
          <h2 className="text-3xl md:text-4xl font-semibold mb-3">Ready to migrate without spreadsheets?</h2>
          <p className="opacity-90 max-w-xl mx-auto mb-6">Start mapping your first dataset in under five minutes.</p>
          <Link to="/app">
            <Button size="lg" variant="secondary" className="shadow-soft">Open the platform <ArrowRight className="size-4" /></Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 Workday Migrate · Built for data teams
      </footer>

      <ChatbotWidget />
    </div>
  );
}
