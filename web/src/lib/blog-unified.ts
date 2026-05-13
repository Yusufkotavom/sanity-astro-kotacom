import { getCollection } from 'astro:content';
import { sanityClient } from '@/lib/sanity/client';

export type UnifiedBlogPost = {
  source: 'mdx' | 'sanity';
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  author?: string;
  tags: string[];
  featured: boolean;
  href: string;
  svgSlug?: string;
  imageUrl?: string;
};

const SANITY_POSTS_LIST_QUERY = `*[_type == "post"]|order(_createdAt desc){
  _id,
  _createdAt,
  _updatedAt,
  title,
  excerpt,
  "slug": slug.current,
  "authorName": author->name,
  "categorySlugs": categories[]->slug.current,
  "imageUrl": image.asset->url,
  meta
}`;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const unique = (arr: string[]): string[] => [...new Set(arr.filter(Boolean))];

export async function getUnifiedBlogPosts(locale = 'en'): Promise<UnifiedBlogPost[]> {
  const [mdxPosts, sanityPosts] = await Promise.all([
    getCollection('blog', ({ data }) => data.locale === locale && (import.meta.env.PROD ? data.draft !== true : true)),
    sanityClient.fetch(SANITY_POSTS_LIST_QUERY).catch(() => []),
  ]);

  const mdxMapped: UnifiedBlogPost[] = mdxPosts.map((post) => ({
    source: 'mdx',
    id: `mdx:${post.id}`,
    slug: post.id.replace(`${locale}/`, ''),
    title: post.data.title,
    description: post.data.description,
    publishedAt: post.data.publishedAt,
    updatedAt: post.data.updatedAt,
    author: post.data.author,
    tags: unique(post.data.tags || []),
    featured: Boolean(post.data.featured),
    href: `/blog/${post.id.replace(`${locale}/`, '')}`,
    svgSlug: post.data.svgSlug,
  }));

  const sanityMapped: UnifiedBlogPost[] = (Array.isArray(sanityPosts) ? sanityPosts : [])
    .filter((post: any) => Boolean(post?.slug) && Boolean(post?.title))
    .map((post: any) => {
      const keywordTags = [post?.meta?.focusKeyword, ...(Array.isArray(post?.meta?.secondaryKeywords) ? post.meta.secondaryKeywords : [])]
        .filter(Boolean)
        .map((v: string) => slugify(v));
      const categoryTags = Array.isArray(post?.categorySlugs) ? post.categorySlugs.filter(Boolean) : [];
      const tags = unique([...categoryTags, ...keywordTags]);

      return {
        source: 'sanity',
        id: `sanity:${post._id}`,
        slug: post.slug,
        title: post.title,
        description: post?.meta?.description || post?.excerpt || '',
        publishedAt: post?._createdAt ? new Date(post._createdAt) : new Date(),
        updatedAt: post?._updatedAt ? new Date(post._updatedAt) : undefined,
        author: post?.authorName || 'Team',
        tags,
        featured: false,
        href: `/blog/${post.slug}`,
        imageUrl: post?.meta?.image?.asset?.url || post?.imageUrl || undefined,
      } as UnifiedBlogPost;
    });

  const dedup = new Map<string, UnifiedBlogPost>();
  // Prefer sanity entry when slug collides to keep CMS as source of truth.
  for (const post of [...mdxMapped, ...sanityMapped]) {
    dedup.set(post.slug, post);
  }

  return Array.from(dedup.values()).sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf());
}

export function getUnifiedTags(posts: UnifiedBlogPost[]): string[] {
  return unique(posts.flatMap((post) => post.tags)).sort((a, b) => a.localeCompare(b));
}

export function findRelatedUnifiedPosts(posts: UnifiedBlogPost[], currentSlug: string, tags: string[], maxPosts = 3): UnifiedBlogPost[] {
  return posts
    .filter((post) => post.slug !== currentSlug && post.href !== currentSlug)
    .filter((post) => tags.length > 0 && post.tags.some((tag) => tags.includes(tag)))
    .sort((a, b) => {
      const aMatches = a.tags.filter((tag) => tags.includes(tag)).length;
      const bMatches = b.tags.filter((tag) => tags.includes(tag)).length;
      if (bMatches !== aMatches) return bMatches - aMatches;
      return b.publishedAt.valueOf() - a.publishedAt.valueOf();
    })
    .slice(0, maxPosts);
}

export function slugifyTag(value: string): string {
  return slugify(value);
}
