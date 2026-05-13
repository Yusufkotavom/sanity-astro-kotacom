import { useClient } from "sanity";
import type { DocumentActionComponent, SanityDocumentLike } from "sanity";

const NON_CONVERTIBLE_PAGE_SLUGS = new Set([
  "index",
  "layanan",
  "pembuatan-website",
  "percetakan",
  "software",
]);

type ConvertActionProps = {
  id: string;
  type: string;
  draft?: SanityDocumentLike | null;
  published?: SanityDocumentLike | null;
  onComplete: () => void;
};

type PageDocument = {
  _id: string;
  _type: "page";
  title?: string;
  slug?: {
    _type?: "slug";
    current?: string;
  };
  meta?: Record<string, unknown>;
  blocks?: Array<Record<string, any>>;
};

type PostDocument = {
  _id: string;
  _type: "post";
  title?: string;
  slug?: {
    _type?: "slug";
    current?: string;
  };
  excerpt?: string;
  image?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  body?: Array<Record<string, unknown>>;
  author?: Record<string, unknown>;
  categories?: Array<Record<string, unknown>>;
};

function buildSafePostId(slug: string) {
  return `post-${slug}`.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");
}

function toDraftId(id: string) {
  return id.startsWith("drafts.") ? id : `drafts.${id}`;
}

function clone<T>(value: T): T {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function makeTextBlock(text: string, keyPrefix: string) {
  return {
    _key: `${keyPrefix}-block-0`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${keyPrefix}-span-0`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

function extractPlainText(blocks: Array<Record<string, any>> = []) {
  return blocks
    .flatMap((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: Record<string, any>) => `${child?.text || ""}`)
        : [],
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveExcerpt(page: PageDocument) {
  const metaDescription =
    typeof page?.meta?.description === "string" ? page.meta.description : "";
  if (metaDescription) return metaDescription;

  const firstHero = Array.isArray(page?.blocks)
    ? page.blocks.find((block) => ["hero-1", "hero-2"].includes(`${block?._type || ""}`))
    : null;

  const heroText = extractPlainText(firstHero?.body || []);
  if (heroText) return heroText;

  const sectionHeader = Array.isArray(page?.blocks)
    ? page.blocks.find((block) => `${block?._type || ""}` === "section-header")
    : null;

  return typeof sectionHeader?.description === "string"
    ? sectionHeader.description.trim()
    : "";
}

function resolveImage(page: PageDocument) {
  const metaImage = page?.meta?.image as Record<string, unknown> | undefined;
  if (metaImage) {
    return clone(metaImage);
  }

  const firstHeroWithImage = Array.isArray(page?.blocks)
    ? page.blocks.find(
        (block) =>
          ["hero-1", "hero-2"].includes(`${block?._type || ""}`) &&
          Boolean(block?.image?.asset?._ref),
      )
    : null;

  return firstHeroWithImage?.image ? clone(firstHeroWithImage.image) : undefined;
}

function extractLegacyContentBlocks(blocks: Array<Record<string, any>> = []) {
  return blocks
    .filter((block) => `${block?._type || ""}` === "legacy-rich-content")
    .map((block, index) => ({
      ...clone(block),
      _key: block?._key || `legacy-rich-content-${index}`,
    }));
}

function extractPortableBody(blocks: Array<Record<string, any>> = []) {
  const richBlocks = extractLegacyContentBlocks(blocks);
  if (richBlocks.length > 0) {
    return {
      body: richBlocks,
      warnings: [] as string[],
      source: "legacy-rich-content",
    };
  }

  const portable: Array<Record<string, unknown>> = [];
  const warnings: string[] = [];

  const firstHero = blocks.find((block) =>
    ["hero-1", "hero-2"].includes(`${block?._type || ""}`),
  );
  if (Array.isArray(firstHero?.body) && firstHero.body.length > 0) {
    portable.push(...clone(firstHero.body));
  }

  const sectionHeaders = blocks.filter(
    (block) => `${block?._type || ""}` === "section-header",
  );
  for (const [index, block] of sectionHeaders.entries()) {
    if (typeof block?.title === "string" && block.title) {
      portable.push({
        _key: `section-title-${index}`,
        _type: "block",
        style: "h2",
        markDefs: [],
        children: [
          {
            _key: `section-title-${index}-span-0`,
            _type: "span",
            marks: [],
            text: block.title,
          },
        ],
      });
    }

    if (typeof block?.description === "string" && block.description) {
      portable.push(makeTextBlock(block.description, `section-description-${index}`));
    }
  }

  if (portable.length === 0) {
    warnings.push(
      "Tidak ada legacy-rich-content atau body text yang cukup jelas. Draft post dibuat tanpa body.",
    );
  } else {
    warnings.push(
      "Body post dibentuk dari hero/section-header karena page tidak memiliki legacy-rich-content.",
    );
  }

  return {
    body: portable,
    warnings,
    source: portable.length > 0 ? "fallback-portable-text" : "empty",
  };
}

function buildPostFromPage({
  page,
  targetSlug,
  existingPost,
}: {
  page: PageDocument;
  targetSlug: string;
  existingPost?: PostDocument | null;
}) {
  const { body, warnings, source } = extractPortableBody(
    Array.isArray(page?.blocks) ? page.blocks : [],
  );

  const nextPost: PostDocument = {
    _id: toDraftId(existingPost?._id || buildSafePostId(targetSlug)),
    _type: "post",
    title: page.title || targetSlug,
    slug: {
      _type: "slug",
      current: targetSlug,
    },
    excerpt: resolveExcerpt(page) || undefined,
    image: resolveImage(page),
    meta: clone(page.meta || {}),
    body,
    author: existingPost?.author ? clone(existingPost.author) : undefined,
    categories: Array.isArray(existingPost?.categories)
      ? clone(existingPost.categories)
      : undefined,
  };

  return {
    nextPost,
    warnings,
    bodySource: source,
  };
}

async function fetchExistingPost(client: ReturnType<typeof useClient>, slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug] | order(_updatedAt desc)[0]{
      _id,
      _type,
      title,
      slug,
      excerpt,
      image,
      meta,
      body,
      author,
      categories
    }`,
    { slug },
  ) as Promise<PostDocument | null>;
}

export const convertPageToPostAction: DocumentActionComponent = (props) => {
  const typed = props as unknown as ConvertActionProps;
  const { type, draft, published, onComplete } = typed;
  const client = useClient({ apiVersion: "2026-03-23" });

  if (type !== "page") {
    return null;
  }

  const page = ((draft || published) as PageDocument | undefined) || null;
  const slug = page?.slug?.current || "";

  if (!page || !slug || NON_CONVERTIBLE_PAGE_SLUGS.has(slug)) {
    return null;
  }

  return {
    label: "Convert Page to Post",
    tone: "primary",
    onHandle: async () => {
      const targetSlug = (
        window.prompt("Target post slug:", slug) || slug
      ).trim();

      if (!targetSlug) {
        onComplete();
        return;
      }

      const mode = (
        window.prompt('Mode ("create" or "upsert"):', "create") || "create"
      ).trim() as "create" | "upsert";

      if (!["create", "upsert"].includes(mode)) {
        window.alert('Mode tidak valid. Gunakan "create" atau "upsert".');
        onComplete();
        return;
      }

      try {
        const existingPost = await fetchExistingPost(client, targetSlug);

        if (existingPost && mode === "create") {
          throw new Error(
            `Post dengan slug "${targetSlug}" sudah ada sebagai ${existingPost._id}. Gunakan mode upsert jika ingin memperbarui draft post target.`,
          );
        }

        const { nextPost, warnings, bodySource } = buildPostFromPage({
          page,
          targetSlug,
          existingPost,
        });

        await client.createOrReplace(nextPost);

        const warningText =
          warnings.length > 0 ? `\n\nWarning:\n- ${warnings.join("\n- ")}` : "";

        window.alert(
          `Draft post berhasil dibuat dari page.\n\nSlug target: ${targetSlug}\nBody source: ${bodySource}${warningText}\n\nReview draft post di Studio lalu publish jika sudah sesuai.`,
        );
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "Gagal mengonversi page menjadi post.",
        );
      } finally {
        onComplete();
      }
    },
  };
};
