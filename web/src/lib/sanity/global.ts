import { sanityClient } from "@/lib/sanity/client";
import {
  NAVIGATION_QUERY,
  SEO_SETTINGS_QUERY,
  SETTINGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";

export interface SanityGlobalData {
  navigation: any | null;
  siteSettings: any | null;
  settings: any | null;
  seoSettings: any | null;
}

let globalDataPromise: Promise<SanityGlobalData> | null = null;

export async function getSanityGlobalData(): Promise<SanityGlobalData> {
  if (!globalDataPromise) {
    globalDataPromise = Promise.all([
      sanityClient.fetch(NAVIGATION_QUERY).catch(() => null),
      sanityClient.fetch(SITE_SETTINGS_QUERY).catch(() => null),
      sanityClient.fetch(SETTINGS_QUERY).catch(() => null),
      sanityClient.fetch(SEO_SETTINGS_QUERY).catch(() => null),
    ]).then(([navigation, siteSettings, settings, seoSettings]) => ({
      navigation,
      siteSettings,
      settings,
      seoSettings,
    }));
  }
  return globalDataPromise;
}

export function toWhatsAppHref(raw?: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

type SiteSettingsDoc = {
  whatsapp?: string | null;
} | null;

type SettingsDoc = {
  whatsApp?: {
    enabled?: boolean;
    phoneNumber?: string | null;
    predefinedText?: string | null;
    ctaText?: string | null;
    sourceUrl?: string | null;
  } | null;
} | null;

export type WhatsAppCta = {
  href: string;
  label: string;
};

function buildWhatsAppHrefWithMessage({
  phoneNumber,
  predefinedText,
  sourceUrl,
}: {
  phoneNumber?: string | null;
  predefinedText?: string | null;
  sourceUrl?: string | null;
}): string | null {
  const baseHref = toWhatsAppHref(phoneNumber || undefined);
  if (!baseHref) return null;

  const messageParts = [predefinedText?.trim() || "", sourceUrl?.trim() ? `Source: ${sourceUrl.trim()}` : ""]
    .filter(Boolean);
  if (messageParts.length === 0) return baseHref;

  const text = encodeURIComponent(messageParts.join("\n"));
  return `${baseHref}?text=${text}`;
}

export function resolveWhatsAppCta(
  siteSettings?: SiteSettingsDoc,
  settings?: SettingsDoc,
): WhatsAppCta | null {
  const floatingConfig = settings?.whatsApp;

  // Honor explicit off switch from `settings.whatsApp.enabled`.
  if (floatingConfig && floatingConfig.enabled === false) {
    return null;
  }

  const phoneNumber = floatingConfig?.phoneNumber || siteSettings?.whatsapp || null;
  const href = buildWhatsAppHrefWithMessage({
    phoneNumber,
    predefinedText: floatingConfig?.predefinedText,
    sourceUrl: floatingConfig?.sourceUrl,
  });
  if (!href) return null;

  return {
    href,
    label: floatingConfig?.ctaText?.trim() || "WhatsApp",
  };
}
