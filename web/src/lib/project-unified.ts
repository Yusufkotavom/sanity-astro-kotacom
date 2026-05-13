import { getCollection } from "astro:content";
import { sanityClient } from "@/lib/sanity/client";
import type { ImageMetadata } from "astro";

export type UnifiedProject = {
  source: "mdx" | "sanity";
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  featured: boolean;
  order: number;
  year?: number;
  client?: string;
  role?: string;
  services?: string[];
  image?: ImageMetadata;
  imageAlt?: string;
  imageUrl?: string;
};

const SANITY_PROJECTS_LIST_QUERY = `*[_type == "project"]|order(_updatedAt desc){
  _id,
  title,
  excerpt,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  completionYear,
  projectType,
  industry,
  featured,
  clientName,
  "categorySlugs": categories[]->slug.current,
  "categoryTitles": categories[]->title,
  meta
}`;

const unique = (arr: string[]): string[] => [...new Set(arr.filter(Boolean))];

export async function getUnifiedProjects(): Promise<UnifiedProject[]> {
  const [mdxProjects, sanityProjects] = await Promise.all([
    getCollection("projects", ({ data }) => (import.meta.env.PROD ? data.draft !== true : true)),
    sanityClient.fetch(SANITY_PROJECTS_LIST_QUERY).catch(() => []),
  ]);

  const mdxMapped: UnifiedProject[] = mdxProjects.map((project) => ({
    source: "mdx",
    id: `mdx:${project.id}`,
    slug: project.id.replace(/\.mdx?$/, ""),
    title: project.data.title,
    description: project.data.description,
    href: `/projects/${project.id.replace(/\.mdx?$/, "")}`,
    tags: unique(project.data.tags || []),
    featured: Boolean(project.data.featured),
    order: Number(project.data.order ?? 99),
    year: project.data.year,
    client: project.data.client,
    role: project.data.role,
    services: project.data.services || [],
    image: project.data.image,
    imageAlt: project.data.imageAlt,
  }));

  const sanityMapped: UnifiedProject[] = (Array.isArray(sanityProjects) ? sanityProjects : [])
    .filter((project: any) => Boolean(project?.slug) && Boolean(project?.title))
    .map((project: any) => {
      const tags = unique(
        [
          project?.projectType,
          project?.industry,
          project?.clientName,
          ...(Array.isArray(project?.categoryTitles) ? project.categoryTitles : []),
          ...(Array.isArray(project?.categorySlugs) ? project.categorySlugs : []),
          ...(Array.isArray(project?.meta?.secondaryKeywords) ? project.meta.secondaryKeywords : []),
        ].filter(Boolean),
      );

      return {
        source: "sanity",
        id: `sanity:${project._id}`,
        slug: project.slug,
        title: project.title,
        description: project?.meta?.description || project?.excerpt || "",
        href: `/projects/sanity/${project.slug}`,
        tags,
        featured: Boolean(project?.featured),
        order: 999,
        year: Number(project?.completionYear) || undefined,
        client: project?.clientName || undefined,
        imageUrl: project?.imageUrl || undefined,
        imageAlt: project?.imageAlt || undefined,
      } as UnifiedProject;
    });

  const dedup = new Map<string, UnifiedProject>();
  for (const project of [...mdxMapped, ...sanityMapped]) {
    dedup.set(project.slug, project);
  }

  return Array.from(dedup.values()).sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    const aYear = a.year || 0;
    const bYear = b.year || 0;
    return bYear - aYear;
  });
}
