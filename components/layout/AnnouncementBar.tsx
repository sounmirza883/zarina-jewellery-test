import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  const text: string = siteConfig.announcement;
  if (!text) return null;
  return (
    <div className="bg-navy-soft px-4 py-2 text-center text-[11px] tracking-[0.18em] text-gold-light uppercase sm:text-xs">
      {text}
    </div>
  );
}
