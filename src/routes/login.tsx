import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Workday Migrate" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-subtle">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-gradient-primary flex items-center justify-center"><Sparkles className="size-5 text-primary-foreground" /></div>
          <div className="leading-tight"><div className="font-semibold">Workday Migrate</div><div className="text-[10px] uppercase tracking-wider opacity-60">Data Platform</div></div>
        </div>
        <div className="space-y-6 max-w-md">
          <h2 className="text-4xl font-semibold leading-tight">Replace spreadsheets with an intelligent migration engine.</h2>
          <p className="opacity-70">Map, transform, and push CSV data to Workday — with full audit trails and zero XSLT.</p>
          <div className="grid grid-cols-3 gap-4">
            {[["98%", "less manual"], ["10x", "faster"], ["100%", "audited"]].map(([v, l]) => (
              <div key={l}><div className="text-2xl font-semibold text-primary-glow">{v}</div><div className="text-xs opacity-60">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="text-xs opacity-50">© 2026 Workday Migrate</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Sign in to your migration workspace.</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => nav({ to: "/app" }), 600); }}>
              <div>
                <Label>Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input defaultValue="sarah.lin@acme.com" className="pl-9" />
                </div>
              </div>
              <div>
                <div className="flex justify-between"><Label>Password</Label><a className="text-xs text-primary hover:underline" href="#">Forgot?</a></div>
                <div className="relative mt-1.5">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" defaultValue="demopassword" className="pl-9" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-soft">
                {loading ? "Signing in…" : <>Sign in <ArrowRight className="size-4" /></>}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              New here? <Link to="/" className="text-primary hover:underline">Back to home</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
