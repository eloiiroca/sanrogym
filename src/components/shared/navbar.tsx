"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Dumbbell,
  },
  {
    name: "Roster",
    href: "/roster",
    icon: Users,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden border-b bg-background/80 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">
              SANROGYM
            </span>
          </div>
          <div className="flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 py-2 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn("h-6 w-6", isActive ? "text-primary" : "")}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
