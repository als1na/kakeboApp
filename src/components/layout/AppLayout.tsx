
// src/components/layout/AppLayout.tsx
"use client";

import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./SidebarNav";
import { Logo } from "@/components/icons/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Define public and protected routes
const publicPaths = ["/login", "/register", "/privacy", "/terms"];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  if (loading || (!user && !publicPaths.includes(pathname))) {
    if (publicPaths.includes(pathname)) {
        return <>{children}</>;
    }
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }
  
  if ((pathname === "/login" || pathname === "/register" || pathname === "/privacy" || pathname === "/terms")) {
    return <>{children}</>; 
  }


  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 items-center flex gap-2">
          <Logo className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            KakeboApp
          </h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || user?.email || 'Usuario'} />
                  <AvatarFallback>
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle2 size={20}/>}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 group-data-[collapsible=icon]:hidden">{user?.displayName || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Perfil (Próximamente)</DropdownMenuItem>
              <DropdownMenuItem>Ajustes (Próximamente)</DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen"> {/* Ensure full height */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 justify-between">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Placeholder para migas de pan o título de página */}
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
        <footer className="p-4 text-center text-xs text-muted-foreground border-t">
          <p>
            Desarrollado por <a href="https://www.eduardoalsina.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Eduardo J. Alsina E.</a> para <a href="https://www.cesurformacion.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">CESUR</a>.
          </p>
          <p>&copy; 2025 Todos los derechos reservados.</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
