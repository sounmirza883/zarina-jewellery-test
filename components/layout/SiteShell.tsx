"use client";

import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The admin panel has its own layout, so skip the storefront header, footer and WhatsApp button
  if (pathname.startsWith("/admin")) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-sm focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <Toaster />
    </>
  );
}
