import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Database, GitMerge, Upload, PlayCircle, ScrollText,
  Users, Building, Settings, Boxes, Sparkles
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar
} from "@/components/ui/sidebar";

const main = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Business Objects", url: "/app/business-objects", icon: Boxes },
  { title: "Datasets", url: "/app/datasets", icon: Database },
  { title: "Mappings", url: "/app/mappings", icon: GitMerge },
  { title: "Imports", url: "/app/imports", icon: PlayCircle },
  { title: "Logs & History", url: "/app/logs", icon: ScrollText },
];

const admin = [
  { title: "Users", url: "/app/admin/users", icon: Users },
  { title: "Tenants", url: "/app/admin/tenants", icon: Building },
  { title: "Settings", url: "/app/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => url === "/app" ? path === "/app" : path.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="bg-gradient-sidebar h-full flex flex-col">
        <SidebarHeader className="px-4 py-5">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="font-semibold text-sidebar-foreground">Workday Migrate</div>
                <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Data Platform</div>
              </div>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50">Workspace</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {main.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}
                      className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-foreground data-[active=true]:font-medium">
                      <Link to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50">Administration</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {admin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}
                      className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-foreground data-[active=true]:font-medium">
                      <Link to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 py-4 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">SL</div>
              <div className="leading-tight min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">Sarah Lin</div>
                <div className="text-[11px] text-sidebar-foreground/60 truncate">Administrator · Acme Corp</div>
              </div>
            </div>
          ) : (
            <div className="size-9 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">SL</div>
          )}
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
