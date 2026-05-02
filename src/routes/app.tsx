import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Topbar } from "@/components/app/Topbar";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <ChatbotWidget />
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
}
