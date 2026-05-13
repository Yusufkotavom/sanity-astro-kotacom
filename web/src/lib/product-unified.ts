import { sanityClient } from "@/lib/sanity/client";

export type UnifiedProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  priceLabel?: string;
  availability?: string;
  tags: string[];
};

const PRODUCTS_QUERY = `*[_type == "product"]|order(_updatedAt desc){
  _id,
  title,
  excerpt,
  price,
  currency,
  availability,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  meta
}`;

const unique = (arr: string[]) => [...new Set(arr.filter(Boolean))];

export async function getUnifiedProducts(): Promise<UnifiedProduct[]> {
  const products = await sanityClient.fetch(PRODUCTS_QUERY).catch(() => []);
  return (Array.isArray(products) ? products : [])
    .filter((product: any) => product?.slug && product?.title)
    .map((product: any) => ({
      id: product._id,
      slug: product.slug,
      title: product.title,
      description: product?.meta?.description || product?.excerpt || "",
      href: `/products/${product.slug}`,
      imageUrl: product?.imageUrl || undefined,
      imageAlt: product?.imageAlt || undefined,
      priceLabel: product?.price ? `${product?.currency || "IDR"} ${product.price}` : undefined,
      availability: product?.availability || undefined,
      tags: unique([product?.availability, ...(Array.isArray(product?.meta?.secondaryKeywords) ? product.meta.secondaryKeywords : [])]),
    }));
}
