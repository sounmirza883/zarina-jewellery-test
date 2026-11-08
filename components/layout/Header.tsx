"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart";
import { MobileMenu } from "./MobileMenu";
import { isActivePath, navLinks } from "./navLinks";

const subscribeNoop = () => () => {};

/** True only after hydration, so server and first client render match. */
function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setTerm("");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    closeSearch();
  }

  const iconBtn =
    "relative inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors duration-200 hover:text-gold";

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className={`${iconBtn} -ml-2`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="flex items-center gap-2 text-center lg:mr-6"
        >
          <span className="text-gold" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
            </svg>
          </span>
          <span className="font-heading text-xl font-semibold tracking-[0.1em] whitespace-nowrap text-charcoal uppercase sm:text-3xl sm:tracking-[0.12em]">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center border-b border-transparent text-[13px] font-medium tracking-wider uppercase transition-colors duration-200 hover:text-gold ${
                      active ? "border-gold text-gold" : "text-charcoal"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            className={iconBtn}
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="header-search"
          >
            {searchOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Search className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className={`${iconBtn} -mr-2 lg:mr-0`}
            onClick={openDrawer}
            aria-label={mounted && count > 0 ? `Open cart, ${count} items` : "Open cart"}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {mounted && count > 0 && (
              <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        id="header-search"
        className={`border-t border-line bg-ivory ${searchOpen ? "block" : "hidden"}`}
      >
        <form
          role="search"
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-3 sm:px-6"
        >
          <label htmlFor="header-search-input" className="sr-only">
            Search jewellery
          </label>
          <input
            id="header-search-input"
            ref={searchRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
            placeholder="Search earrings, necklaces, rings..."
            className="min-h-11 flex-1 rounded-sm border border-line bg-white px-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-navy px-5 text-sm font-medium tracking-wide text-ivory uppercase transition-colors duration-200 hover:bg-gold"
          >
            Search
          </button>
        </form>
      </div>
    </header>
    {/* Outside the header: backdrop-blur on the header would trap this fixed panel inside it */}
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
