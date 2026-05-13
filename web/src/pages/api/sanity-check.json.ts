import type { APIRoute } from "astro";
import { sanityClient } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, PAGES_QUERY, POSTS_QUERY, SEO_SETTINGS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

export const GET: APIRoute = async () => {
  try {
    const [siteSettings, seoSettings, navigation, pages, posts] = await Promise.all([
      sanityClient.fetch(SITE_SETTINGS_QUERY),
      sanityClient.fetch(SEO_SETTINGS_QUERY),
      sanityClient.fetch(NAVIGATION_QUERY),
      sanityClient.fetch(PAGES_QUERY),
      sanityClient.fetch(POSTS_QUERY),
    ]);

    return new Response(
      JSON.stringify(
        {
          ok: true,
          counts: {
            pages: Array.isArray(pages) ? pages.length : 0,
            posts: Array.isArray(posts) ? posts.length : 0,
          },
          has: {
            siteSettings: Boolean(siteSettings),
            seoSettings: Boolean(seoSettings),
            navigation: Boolean(navigation),
          },
        },
        null,
        2,
      ),
      { headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify(
        {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
};
