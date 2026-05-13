import { useClient } from "sanity";
import type { DocumentActionComponent, SanityDocumentLike } from "sanity";

const HYBRID_PAGE_SLUGS = new Set([
  "index",
  "layanan",
  "pembuatan-website",
  "percetakan",
  "software",
]);

type HybridPresetName = "main-landing" | "homepage";
type HybridPresetMode = "seed-missing" | "upsert";

type HybridActionProps = {
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
  topBlockCount?: number;
  blocks?: Array<Record<string, unknown>>;
};

function createPortableTextBlock(text: string, keyPrefix: string) {
  return [
    {
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
    },
  ];
}

function createLink({
  key,
  title,
  href,
  isExternal = true,
  buttonVariant = "link",
}: {
  key: string;
  title: string;
  href: string;
  isExternal?: boolean;
  buttonVariant?: string;
}) {
  return {
    _key: key,
    _type: "link",
    title,
    isExternal,
    href,
    buttonVariant,
  };
}

function createSectionHeader({
  key,
  tagLine,
  title,
  description,
}: {
  key: string;
  tagLine: string;
  title: string;
  description: string;
}) {
  return {
    _key: key,
    _type: "section-header",
    colorVariant: "background",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine,
    title,
    description,
  };
}

function createGridRow({
  key,
  columns,
  gridColumns = "grid-cols-3",
}: {
  key: string;
  columns: Array<{
    title: string;
    excerpt: string;
    href: string;
    linkTitle?: string;
  }>;
  gridColumns?: string;
}) {
  return {
    _key: key,
    _type: "grid-row",
    colorVariant: "background",
    gridColumns,
    columns: columns.map((column, index) => ({
      _key: `${key}-column-${index}`,
      _type: "grid-card",
      title: column.title,
      excerpt: column.excerpt,
      link: createLink({
        key: `${key}-column-link-${index}`,
        title: column.linkTitle || "Lihat detail",
        href: column.href,
        isExternal: true,
        buttonVariant: "link",
      }),
    })),
  };
}

function createCta({
  key,
  tagLine,
  title,
  body,
  primaryHref,
  primaryTitle,
  secondaryHref,
  secondaryTitle,
}: {
  key: string;
  tagLine: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryTitle: string;
  secondaryHref: string;
  secondaryTitle: string;
}) {
  return {
    _key: key,
    _type: "cta-1",
    colorVariant: "primary",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine,
    title,
    body: createPortableTextBlock(body, `${key}-body`),
    links: [
      createLink({
        key: `${key}-link-primary`,
        title: primaryTitle,
        href: primaryHref,
        isExternal: true,
        buttonVariant: "default",
      }),
      createLink({
        key: `${key}-link-secondary`,
        title: secondaryTitle,
        href: secondaryHref,
        isExternal: true,
        buttonVariant: "outline",
      }),
    ],
  };
}

function titleFromSlug(slug: string) {
  if (slug === "index") return "Homepage";

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildMainLandingPreset(slug: string, title?: string) {
  const pageTitle = title || titleFromSlug(slug);

  return {
    title: pageTitle,
    topBlockCount: 2,
    blocks: [
      createSectionHeader({
        key: "hybrid-header",
        tagLine: "Hybrid Support Layer",
        title: `${pageTitle} tetap punya shell stabil, tetapi konten support bisa bergerak lebih cepat.`,
        description:
          "Preset ini memberi susunan awal yang aman untuk page utama: proof ringan di atas, shell code-owned di tengah, dan CTA follow-up di bawah.",
      }),
      createGridRow({
        key: "hybrid-grid",
        columns: [
          {
            title: "Support Layer",
            excerpt:
              "Gunakan bagian atas untuk proof ringan, framing layanan, atau context yang membantu pengunjung memahami posisi halaman ini.",
            href: `/${slug}`,
            linkTitle: "Lihat halaman",
          },
          {
            title: "Code-Owned Shell",
            excerpt:
              "Bagian inti funnel tetap hidup di code agar struktur, internal linking, dan ritme konversi tidak mudah drift saat editor bereksperimen.",
            href: "/test-page-hybrid",
            linkTitle: "Lihat blueprint",
          },
          {
            title: "Conversion Layer",
            excerpt:
              "Gunakan bagian bawah untuk CTA, FAQ, atau proof lanjutan tanpa harus memindahkan seluruh page utama menjadi full CMS.",
            href: "/contact",
            linkTitle: "Diskusikan kebutuhan",
          },
        ],
      }),
      createCta({
        key: "hybrid-cta",
        tagLine: "Conversion Layer",
        title: `Sempurnakan ${pageTitle} tanpa kehilangan kontrol struktur halaman.`,
        body:
          "Edit block Sanity untuk support copy dan proof, lalu biarkan shell utama tetap mengurus positioning, internal links, dan ritme konversi.",
        primaryHref: "https://wa.me/6281335275219",
        primaryTitle: "Konsultasi via WhatsApp",
        secondaryHref: `/${slug}`,
        secondaryTitle: "Review halaman",
      }),
    ],
  };
}

function buildHomepagePreset() {
  return {
    title: "Homepage",
    topBlockCount: 2,
    blocks: [
      createSectionHeader({
        key: "home-header",
        tagLine: "Homepage Hybrid",
        title: "Atur blok pembuka dan penutup homepage dari Sanity tanpa melepas positioning inti di tengah.",
        description:
          "Preset homepage menjaga section tengah tetap code-owned sambil memberi ruang untuk eksperimen hero/support/CTA melalui satu array blocks.",
      }),
      createGridRow({
        key: "home-grid",
        columns: [
          {
            title: "Website",
            excerpt:
              "Jelaskan lane website, company profile, landing page, dan support marketing digital dari blok atas homepage.",
            href: "/pembuatan-website",
            linkTitle: "Buka lane",
          },
          {
            title: "Software",
            excerpt:
              "Tambahkan bukti kemampuan otomasi, dashboard, dan sistem operasional tanpa mengubah shell homepage.",
            href: "/software",
            linkTitle: "Buka lane",
          },
          {
            title: "Percetakan",
            excerpt:
              "Jaga narasi end-to-end delivery dengan tetap memberi ruang untuk proof produk cetak dan CTA lintas layanan.",
            href: "/percetakan",
            linkTitle: "Buka lane",
          },
        ],
      }),
      createCta({
        key: "home-cta",
        tagLine: "Bottom Zone",
        title: "Gunakan penutup homepage untuk mendorong langkah berikutnya tanpa mengacaukan struktur utama.",
        body:
          "CTA bawah cocok untuk eksperimen message dan follow-up offer, sedangkan shell inti homepage tetap menjaga positioning Kotacom di level produk dan layanan.",
        primaryHref: "https://wa.me/6281335275219",
        primaryTitle: "Hubungi tim",
        secondaryHref: "/layanan",
        secondaryTitle: "Jelajahi layanan",
      }),
    ],
  };
}

function buildPreset(slug: string, title: string | undefined, preset: HybridPresetName) {
  return preset === "homepage"
    ? buildHomepagePreset()
    : buildMainLandingPreset(slug, title);
}

function toDraftId(id: string) {
  return id.startsWith("drafts.") ? id : `drafts.${id}`;
}

function resolveHybridDocument(
  draft?: SanityDocumentLike | null,
  published?: SanityDocumentLike | null,
) {
  const document = (draft || published) as PageDocument | undefined;
  const slug = document?.slug?.current || "";

  if (!document || !slug || !HYBRID_PAGE_SLUGS.has(slug)) {
    return null;
  }

  return {
    document,
    slug,
  };
}

function mergeHybridDocument({
  existing,
  slug,
  mode,
  preset,
}: {
  existing: PageDocument;
  slug: string;
  mode: HybridPresetMode;
  preset: ReturnType<typeof buildHomepagePreset>;
}) {
  if (mode === "seed-missing") {
    return {
      ...existing,
      _type: "page" as const,
      title: existing.title || preset.title,
      slug: existing.slug || { _type: "slug" as const, current: slug },
      topBlockCount:
        typeof existing.topBlockCount === "number"
          ? existing.topBlockCount
          : preset.topBlockCount,
      blocks:
        Array.isArray(existing.blocks) && existing.blocks.length > 0
          ? existing.blocks
          : preset.blocks,
    };
  }

  return {
    ...existing,
    _type: "page" as const,
    title: preset.title,
    slug: { _type: "slug" as const, current: slug },
    topBlockCount: preset.topBlockCount,
    blocks: preset.blocks,
  };
}

export const applyHybridPresetAction: DocumentActionComponent = (props) => {
  const typed = props as unknown as HybridActionProps;
  const { type, draft, published, onComplete } = typed;
  const client = useClient({ apiVersion: "2026-03-23" });

  if (type !== "page") {
    return null;
  }

  const resolved = resolveHybridDocument(draft, published);

  if (!resolved) {
    return null;
  }

  return {
    label: "Apply Hybrid Preset",
    tone: "primary",
    onHandle: async () => {
      const defaultPreset: HybridPresetName =
        resolved.slug === "index" ? "homepage" : "main-landing";

      const presetInput = (
        window.prompt(
          'Preset ("main-landing" or "homepage"):',
          defaultPreset,
        ) || defaultPreset
      ).trim() as HybridPresetName;

      if (!["main-landing", "homepage"].includes(presetInput)) {
        window.alert('Preset tidak valid. Gunakan "main-landing" atau "homepage".');
        onComplete();
        return;
      }

      const modeInput = (
        window.prompt(
          'Mode ("seed-missing" or "upsert"):',
          "seed-missing",
        ) || "seed-missing"
      ).trim() as HybridPresetMode;

      if (!["seed-missing", "upsert"].includes(modeInput)) {
        window.alert('Mode tidak valid. Gunakan "seed-missing" atau "upsert".');
        onComplete();
        return;
      }

      const confirmMessage =
        modeInput === "upsert"
          ? "Mode upsert akan mengganti topBlockCount dan blocks hybrid pada draft ini. Lanjutkan?"
          : "Mode seed-missing hanya akan mengisi field hybrid yang masih kosong. Lanjutkan?";

      if (!window.confirm(confirmMessage)) {
        onComplete();
        return;
      }

      try {
        const preset = buildPreset(
          resolved.slug,
          resolved.document.title,
          presetInput,
        );
        const nextDraft = mergeHybridDocument({
          existing: {
            ...resolved.document,
            _id: toDraftId(resolved.document._id),
          },
          slug: resolved.slug,
          mode: modeInput,
          preset,
        });

        await client.createOrReplace({
          ...nextDraft,
          _id: toDraftId(resolved.document._id),
        });

        window.alert(
          `Hybrid preset diterapkan ke draft (${presetInput}, ${modeInput}). Review hasilnya lalu publish bila sudah sesuai.`,
        );
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "Gagal menerapkan hybrid preset.",
        );
      } finally {
        onComplete();
      }
    },
  };
};
