"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AreaChart,
  Archive,
  BrainCircuit,
  FileText,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  UploadCloud,
  Users,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/types";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/search", label: "Search", icon: Search },
  { href: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit },
  { href: "/analytics", label: "Analytics", icon: AreaChart, badge: 3 },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/users", label: "Users", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="h-16 justify-center p-4 lg:justify-start">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-headline font-bold text-lg text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground"
        >
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span className={state === "collapsed" ? "hidden" : "inline"}>InfoSync</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: "bg-primary text-primary-foreground",
                  }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  );
}
