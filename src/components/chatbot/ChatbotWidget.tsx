import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "bot"; content: string; ts: number };

const suggestions = [
  "How do I create a value mapping?",
  "Why did my last import fail?",
  "Show me Workers field reference",
  "Run a dry-run on my dataset",
];

const replies = [
  "Sure — head to Mappings → New Mapping, pick the Workers business object, then add a Value Mapping rule on the column you want to translate.",
  "Looks like a SOAP authentication issue. Re-check tenant credentials in Admin → Settings, then retry the import.",
  "I can preview the standard Workers fields for you. Open the Business Objects page and click Workers to inspect the schema.",
  "Dry-run is available on the Imports page — toggle “Simulation mode” before clicking Execute.",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", content: "Hi Sarah 👋 I'm Migrate AI — your assistant for mappings, imports and Workday questions. Ask me anything!", ts: Date.now() },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", content: t, ts: Date.now() }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", content: replies[Math.floor(Math.random() * replies.length)], ts: Date.now() }]);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chatbot"
        className={cn(
          "fixed bottom-5 right-5 z-50 size-14 rounded-full bg-gradient-primary shadow-elegant flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform animate-pulse-ring",
          open && "scale-95"
        )}
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </button>

      <div
        className={cn(
          "fixed z-50 bg-card border shadow-elegant rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          "bottom-24 right-5",
          "w-[calc(100vw-2.5rem)] sm:w-[400px] h-[min(600px,calc(100vh-8rem))]",
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-4 py-3 bg-gradient-primary text-primary-foreground flex items-center gap-3">
          <div className="size-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
            <Sparkles className="size-4" />
          </div>
          <div className="leading-tight flex-1">
            <div className="font-semibold text-sm">Migrate AI</div>
            <div className="text-[11px] opacity-80 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success animate-pulse" /> Online · responds instantly
            </div>
          </div>
          <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-white/20 size-8" onClick={() => setOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef as any}>
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2 items-start", m.role === "user" && "flex-row-reverse")}>
                <div className={cn(
                  "size-7 rounded-full flex items-center justify-center shrink-0",
                  m.role === "bot" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"
                )}>
                  {m.role === "bot" ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm max-w-[80%] leading-relaxed",
                  m.role === "bot" ? "bg-muted text-foreground rounded-tl-sm" : "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-xs px-2.5 py-1.5 rounded-full border bg-background hover:bg-accent transition">
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t bg-background flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about mappings, imports…" className="text-sm" />
          <Button type="submit" size="icon" className="bg-gradient-primary shrink-0"><Send className="size-4" /></Button>
        </form>
      </div>
    </>
  );
}
