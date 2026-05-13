import { sanityClient } from "@/lib/sanity/client";

export type UnifiedService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  priceLabel?: string;
  duration?: string;
  tags: string[];
};

const SERVICES_QUERY = `*[_type == "service"]|order(_updatedAt desc){
  _id,
  title,
  excerpt,
  duration,
  startingPrice,
  currency,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  meta
}`;

const unique = (arr: string[]) => [...new Set(arr.filter(Boolean))];

export async function getUnifiedServices(): Promise<UnifiedService[]> {
  const services = await sanityClient.fetch(SERVICES_QUERY).catch(() => []);
  return (Array.isArray(services) ? services : [])
    .filter((service: any) => service?.slug && service?.title)
    .map((service: any) => ({
      id: service._id,
      slug: service.slug,
      title: service.title,
      description: service?.meta?.description || service?.excerpt || "",
      href: `/services/${service.slug}`,
      imageUrl: service?.imageUrl || undefined,
      imageAlt: service?.imageAlt || undefined,
      priceLabel: service?.startingPrice ? `${service?.currency || "IDR"} ${service.startingPrice}` : undefined,
      duration: service?.duration || undefined,
      tags: unique([service?.duration, ...(Array.isArray(service?.meta?.secondaryKeywords) ? service.meta.secondaryKeywords : [])]),
    }));
}
