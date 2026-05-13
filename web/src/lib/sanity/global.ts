import { sanityClient } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, SEO_SETTINGS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

export interface SanityGlobalData {
  navigation: any | null;
  siteSettings: any | null;
  seoSettings: any | null;
}

let globalDataPromise: Promise<SanityGlobalData> | null = null;

export async function getSanityGlobalData(): Promise<SanityGlobalData> {
  if (!globalDataPromise) {
    globalDataPromise = Promise.all([
      sanityClient.fetch(NAVIGATION_QUERY).catch(() => null),
      sanityClient.fetch(SITE_SETTINGS_QUERY).catch(() => null),
      sanityClient.fetch(SEO_SETTINGS_QUERY).catch(() => null),
    ]).then(([navigation, siteSettings, seoSettings]) => ({ navigation, siteSettings, seoSettings }));
  }
  return globalDataPromise;
}

export function toWhatsAppHref(raw?: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
