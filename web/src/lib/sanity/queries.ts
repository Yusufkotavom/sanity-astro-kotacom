export const NAVIGATION_QUERY = `*[_type == "navigation"][0]{
  links[] {
    _key,
    title,
    href,
    isExternal,
    target,
    buttonVariant,
    badge,
    description,
    icon,
    uiIcon,
    showInHeader,
    showInFooter,
    navLocation,
    children[] {
      _key,
      title,
      href,
      isExternal,
      target,
      badge,
      description,
      group,
      icon,
      uiIcon
    }
  },
  headerCta {
    title,
    href,
    isExternal,
    target,
    buttonVariant
  }
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  description,
  keywords,
  companyName,
  companyTagline,
  companyDescription,
  foundedYear,
  projectsCompleted,
  location,
  coverage,
  phone,
  whatsapp,
  email,
  address,
  socialMedia
}`;

export const SETTINGS_QUERY = `*[_type == "settings"][0]{
  whatsApp {
    enabled,
    phoneNumber,
    predefinedText,
    ctaText,
    sourceUrl
  }
}`;

export const SEO_SETTINGS_QUERY = `*[_type == "seoSettings"][0]{
  titleSuffix,
  defaultTitle,
  defaultDescription,
  defaultNoIndex,
  siteUrl,
  twitterHandle,
  "defaultImageUrl": defaultImage.asset->url,
  "defaultImageAlt": defaultImage.alt,
  companyInfo,
  testimonials,
  pricingPackages,
  faq
}`;

export const REDIRECTS_QUERY = `*[_type == "redirect" && isEnabled == true]{
  source,
  destination,
  permanent
}`;

export const REDIRECT_BY_SOURCE_QUERY = `*[_type == "redirect" && isEnabled == true && source == $source][0]{
  source,
  destination,
  permanent
}`;

export const POSTS_QUERY = `*[_type == "post"]|order(coalesce(meta.publishedAt, _createdAt) desc){
  _id,
  title,
  "slug": slug.current,
  "publishedAt": coalesce(meta.publishedAt, _createdAt),
  excerpt,
  "authorName": author->name,
  "imageUrl": coalesce(meta.image.asset->url, image.asset->url),
  "tags": array::unique(array::compact(
    coalesce(categories[]->slug.current, []) + [meta.focusKeyword] + coalesce(meta.secondaryKeywords, [])
  )),
  meta
}`;

export const PAGES_QUERY = `*[_type == "page"]|order(_updatedAt desc){
  _id,
  title,
  "slug": slug.current,
  topBlockCount,
  meta
}`;
