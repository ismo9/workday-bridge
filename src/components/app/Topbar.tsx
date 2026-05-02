import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Sun, Moon, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-14 border-b bg-card/60 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-4">
      <SidebarTrigger />
      <div className="relative flex-1 max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search datasets, mappings, imports…" className="pl-9 bg-background/60" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help"><HelpCircle className="size-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  );
}
