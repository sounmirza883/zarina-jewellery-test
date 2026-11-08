import { siteConfig } from "@/config/site";

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
