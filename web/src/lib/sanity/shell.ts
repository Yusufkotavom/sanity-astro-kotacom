import { toWhatsAppHref } from "@/lib/sanity/global";

type LinkItem = {
  _key?: string;
  title?: string;
  href?: string;
  description?: string;
  badge?: string;
  group?: string;
  navLocation?: "primary" | "more" | "utility" | null;
  showInHeader?: boolean;
  showInFooter?: boolean;
  target?: boolean;
  isExternal?: boolean;
  buttonVariant?: "primary" | "outline" | "ghost" | "link" | "secondary" | "destructive" | "default";
  children?: LinkItem[] | null;
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
  headerNav: Array<{
    key?: string;
    label: string;
    href: string;
    target?: string;
    navLocation?: "primary" | "more" | "utility";
    buttonVariant?: string;
    children?: Array<{
      key?: string;
      label: string;
      href: string;
      target?: string;
      badge?: string;
      description?: string;
      group?: string;
    }>;
  }>;
  footerNav: { label: string; href: string }[];
  waHref: string | null;
  headerCta?: {
    label: string;
    href: string;
    target?: string;
    buttonVariant?: "primary" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  };
  footerSocial: { platform: string; href: string; label: string }[];
};

export function buildShellData(
  navigation: NavigationDoc,
  siteSettings: SiteSettingsDoc,
): HeaderFooterShell {
  const normalizeButtonVariant = (value?: LinkItem["buttonVariant"]) => {
    if (!value) return undefined;
    return value === "default" ? "primary" : value;
  };

  const links = Array.isArray(navigation?.links) ? navigation!.links! : [];

  const headerNav = links
    .filter((link) => link?.title && link?.href && link.showInHeader !== false && link.navLocation !== "utility")
    .map((link) => ({
      key: link._key,
      label: link.title as string,
      href: link.href as string,
      target: link.target ? "_blank" : undefined,
      navLocation: (link.navLocation || "primary") as "primary" | "more" | "utility",
      buttonVariant: normalizeButtonVariant(link.buttonVariant),
      children: Array.isArray(link.children)
        ? link.children
            .filter((child) => child?.title && child?.href)
            .map((child) => ({
              key: child._key,
              label: child.title as string,
              href: child.href as string,
              target: child.target ? "_blank" : undefined,
              badge: child.badge,
              description: child.description,
              group: child.group,
            }))
        : [],
    }));

  const footerNav = links
    .filter((link) => link?.title && link?.href && link.showInFooter !== false)
    .map((link) => ({ label: link.title as string, href: link.href as string }));

  const rawHeaderCta = navigation?.headerCta;
  const headerCta =
    rawHeaderCta?.title && rawHeaderCta?.href
      ? {
          label: rawHeaderCta.title,
          href: rawHeaderCta.href,
          target: rawHeaderCta.target ? "_blank" : undefined,
          buttonVariant: normalizeButtonVariant(rawHeaderCta.buttonVariant),
        }
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
