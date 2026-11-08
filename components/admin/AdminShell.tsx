"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Package, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminLogin, adminLogout, useAdminSession } from "@/lib/admin-auth";
import { siteConfig } from "@/config/site";
import { adminInputClass } from "./AdminUi";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
] as const;

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center bg-ivory px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(!adminLogin(password));
        }}
        className="w-full max-w-sm rounded-sm border border-line bg-white p-6"
      >
        <h1 className="text-center text-3xl">{siteConfig.name} Admin</h1>
        <span className="gold-line mx-auto mt-3 block w-24" aria-hidden="true" />
        <label htmlFor="admin-password" className="mt-6 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error}
          aria-describedby={error ? "admin-password-error" : undefined}
          className={`${adminInputClass} mt-1`}
        />
        {error && (
          <p id="admin-password-error" role="alert" className="mt-2 text-sm text-rose-700">
            Wrong password. Try again.
          </p>
        )}
        <Button type="submit" variant="dark" className="mt-5 w-full">
          Sign In
        </Button>
        <p className="mt-4 text-xs text-muted">
          Demo login only. This store has no backend, so the password is not real security.
        </p>
      </form>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const session = useAdminSession();
  const pathname = usePathname();

  if (session === "loading") return <div className="min-h-svh bg-ivory" aria-hidden="true" />;
  if (session === "out") return <LoginForm />;

  return (
    <div className="min-h-svh bg-ivory lg:flex">
      <aside className="border-b border-line bg-navy text-ivory lg:sticky lg:top-0 lg:h-svh lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-4 py-3 lg:flex-col lg:items-start lg:gap-1 lg:py-6">
          <p className="font-heading text-xl tracking-[0.1em] whitespace-nowrap uppercase">{siteConfig.name}</p>
          <p className="text-xs text-gold-light">Admin</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:px-3 lg:pb-0">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm whitespace-nowrap transition-colors ${
                  active ? "bg-gold text-white" : "text-ivory/80 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm whitespace-nowrap text-ivory/80 hover:bg-white/10 lg:mt-4"
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            View Store
          </Link>
          <button
            type="button"
            onClick={adminLogout}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm whitespace-nowrap text-ivory/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
    </div>
  );
}
