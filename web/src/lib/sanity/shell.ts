import { toWhatsAppHref } from "@/lib/sanity/global";

type LinkItem = {
  title?: string;
  href?: string;
  navLocation?: "primary" | "more" | "utility" | null;
  showInHeader?: boolean;
  showInFooter?: boolean;
  target?: boolean;
  isExternal?: boolean;
  buttonVariant?: string;
};

type NavigationDoc = {
  links?: LinkItem[] | null;
  headerCta?: LinkItem | null;
} | null;

type SiteSettingsDoc = {
  whatsapp?: string | null;
  socialMedia?: Record<string, string | null | undefined> | null;
} | null;

export type HeaderFooterShell = {
  headerNav: { label: string; href: string }[];
  footerNav: { label: string; href: string }[];
  waHref: string | null;
  headerCta?: { label: string; href: string };
  footerSocial: { platform: string; href: string; label: string }[];
};

export function buildShellData(
  navigation: NavigationDoc,
  siteSettings: SiteSettingsDoc,
): HeaderFooterShell {
  const links = Array.isArray(navigation?.links) ? navigation!.links! : [];

  const headerNav = links
    .filter((link) => link?.title && link?.href && link.showInHeader !== false && link.navLocation !== "utility")
    .map((link) => ({ label: link.title as string, href: link.href as string }));

  const footerNav = links
    .filter((link) => link?.title && link?.href && link.showInFooter !== false)
    .map((link) => ({ label: link.title as string, href: link.href as string }));

  const rawHeaderCta = navigation?.headerCta;
  const headerCta =
    rawHeaderCta?.title && rawHeaderCta?.href
      ? { label: rawHeaderCta.title, href: rawHeaderCta.href }
      : undefined;

  const waHref = toWhatsAppHref(siteSettings?.whatsapp || undefined);

  const footerSocial = Object.entries(siteSettings?.socialMedia || {})
    .filter(([, value]) => Boolean(value))
    .map(([platform, href]) => ({
      platform,
      href: href as string,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));

  return { headerNav, footerNav, waHref, headerCta, footerSocial };
}

