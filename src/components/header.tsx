"use client";

import { MobileMenu } from "@/components/mobile-menu";
import { DesktopMenu } from "@/components/desktop-menu";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FT</span>
              </div>
              <h1 className="text-xl font-bold hidden sm:block">FisioTrack</h1>
            </div>
          </div>

          {/* Menu desktop */}
          <DesktopMenu />

          {/* Menu móvel */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Botão de ação para mobile */}
          <div className="hidden md:block">
            <Button variant="outline" size="sm">
              Novo Paciente
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}