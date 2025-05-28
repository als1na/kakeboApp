"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  PiggyBank,
  Lightbulb,
  PlusCircle,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Panel Principal", icon: LayoutDashboard },
  { href: "/transactions", label: "Añadir Transacción", icon: PlusCircle },
  { href: "/history", label: "Historial", icon: History },
  { href: "/savings", label: "Meta de Ahorro", icon: PiggyBank },
  { href: "/reflection", label: "Reflexión", icon: Lightbulb },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label, className: "bg-background text-foreground border-border"}}
              className={cn(
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "justify-start"
              )}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
