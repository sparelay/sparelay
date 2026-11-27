"use client";

import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/shared/auth/actions/logout";
import { Badge } from "@/shared/components/ui/badge";
import { Button, buttonVariants } from "@/shared/components/ui/button";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/providers", label: "Providers" },
  { href: "/playground", label: "Playground" },
  { href: "/usage", label: "Usage" },
  { href: "/logs", label: "Logs" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/assets/images/logo.svg" alt="Sparelay" className="h-6 w-6 shrink-0" />
          <span>Sparelay</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={buttonVariants({
                variant: pathname === n.href ? "secondary" : "ghost",
                size: "sm",
              })}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Badge variant="outline" className="text-muted-foreground">
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </Badge>
          <a
            href="https://github.com/sparelay/sparelay"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Logout"
            className="hidden text-destructive md:inline-flex"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <nav className="absolute top-0 right-0 flex h-full w-64 flex-col gap-1 bg-background p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={
                  buttonVariants({
                    variant: pathname === n.href ? "secondary" : "ghost",
                    size: "sm",
                  }) + " justify-start"
                }
              >
                {n.label}
              </Link>
            ))}
            <div className="my-2 border-t" />
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-destructive"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
