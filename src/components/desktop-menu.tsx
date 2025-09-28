"use client";

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Users, FileText, Home, Plus } from "lucide-react";

export function DesktopMenu() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/patients", label: "Pacientes", icon: Users },
    { href: "/assessments", label: "Avaliações", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      
      {/* Botão de adicionar paciente */}
      {isAuthenticated && (
        <Link
          to="/patients"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Link>
      )}
    </nav>
  );
}