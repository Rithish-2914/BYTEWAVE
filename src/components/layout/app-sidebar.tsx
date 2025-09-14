
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AreaChart,
  Archive,
  BrainCircuit,
  FileText,
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
import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { Logo } from "./logo";


const allNavItems: Omit<NavItem, 'label'> & {i18nKey: string, roles?: string[]}[] = [
  { href: "/dashboard", i18nKey: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", i18nKey: "Documents", icon: FileText },
  { href: "/upload", i18nKey: "Upload", icon: UploadCloud, roles: ['Admin'] },
  { href: "/search", i18nKey: "Search", icon: Search },
  { href: "/ai-assistant", i18nKey: "AI Assistant", icon: BrainCircuit },
  { href: "/analytics", i18nKey: "Analytics", icon: AreaChart, roles: ['Admin', 'Manager', 'Director'] },
  { href: "/archive", i18nKey: "Archive", icon: Archive, roles: ['Admin'] },
  { href: "/users", i18nKey: "Users", icon: Users, roles: ['Admin'] },
  { href: "/notifications", i18nKey: "Notifications", icon: Bell, badge: 5 },
  { href: "/settings", i18nKey: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  
  const navItems = allNavItems.filter(item => 
    !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="h-16 justify-center p-4 lg:justify-start">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-headline font-bold text-lg text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground"
        >
          <Logo className="h-7 w-7 text-primary" />
          <span className={state === "collapsed" ? "hidden" : "inline"}>ByteWave</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{
                  children: t(item.i18nKey),
                  className: "bg-primary text-primary-foreground",
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(item.i18nKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  );
}
