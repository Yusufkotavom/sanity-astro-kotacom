import "dotenv/config";
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_STUDIO_TOKEN ||
  process.env.SANITY_TOKEN;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2026-05-13";

if (!projectId || !token) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID or write token in studio/.env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Kotacom",
    description: "Seeded site settings for E2E",
    companyName: "Kotacom",
    companyTagline: "IT Service & Digital Product",
    phone: "085799520350",
    whatsapp: "6285799520350",
    email: "hello@kotacom.test",
    location: "Surabaya",
  },
  {
    _id: "navigation",
    _type: "navigation",
    links: [
      {
        _key: "home",
        _type: "link",
        isExternal: true,
        title: "Home",
        href: "https://example.com",
        showInHeader: true,
        showInFooter: true,
        navLocation: "primary",
      },
      {
        _key: "products",
        _type: "link",
        isExternal: true,
        title: "Products",
        href: "https://example.com/products",
        showInHeader: true,
        showInFooter: true,
        navLocation: "primary",
      },
    ],
    headerCta: {
      _type: "link",
      isExternal: true,
      title: "Contact",
      href: "https://wa.me/6285799520350",
    },
  },
  {
    _id: "category-e2e-product",
    _type: "category",
    title: "E2E Product Category",
    slug: { _type: "slug", current: "e2e-product-category" },
    description: "Category for product e2e validation",
    meta: {
      _type: "meta",
      title: "E2E Product Category",
      description: "Category metadata",
      noindex: false,
    },
  },
  {
    _id: "category-e2e-content",
    _type: "category",
    title: "E2E Content Category",
    slug: { _type: "slug", current: "e2e-content-category" },
    description: "Category for post/service/project e2e",
    meta: {
      _type: "meta",
      title: "E2E Content Category",
      description: "Content category metadata",
      noindex: false,
    },
  },
  {
    _id: "product-e2e-seed",
    _type: "product",
    title: "Produk E2E Sanity",
    slug: { _type: "slug", current: "produk-e2e-sanity" },
    excerpt: "Produk seed untuk test e2e dan metadata SEO.",
    price: 1500000,
    currency: "IDR",
    availability: "in-stock",
    categories: [{ _type: "reference", _ref: "category-e2e-product" }],
    cta: {
      _type: "link",
      isExternal: true,
      title: "Order via WhatsApp",
      href: "https://wa.me/6285799520350",
    },
    blocks: [
      {
        _key: "hero-e2e-product",
        _type: "hero-1",
        title: "Produk E2E Sanity",
        tagLine: "Seed E2E",
        body: [
          {
            _type: "block",
            _key: "body-hero",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "s1", text: "Halaman produk seeded dari script." }],
          },
        ],
      },
      {
        _key: "wa-cta-product",
        _type: "whatsapp-cta",
        title: "Hubungi via WhatsApp",
        body: [
          {
            _type: "block",
            _key: "body-wa",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "s2", text: "Klik tombol untuk chat langsung." }],
          },
        ],
      },
    ],
    meta: {
      _type: "meta",
      title: "Produk E2E Sanity",
      description: "Metadata SEO produk untuk validasi e2e.",
      noindex: false,
      focusKeyword: "produk e2e sanity",
      secondaryKeywords: ["seed sanity", "produk test e2e"],
    },
  },
  {
    _id: "service-e2e-seed",
    _type: "service",
    title: "Service E2E Sanity",
    slug: { _type: "slug", current: "service-e2e-sanity" },
    excerpt: "Service seed untuk test e2e metadata.",
    duration: "2 minggu",
    startingPrice: 2500000,
    currency: "IDR",
    deliverables: ["Audit", "Implementasi", "Support"],
    categories: [{ _type: "reference", _ref: "category-e2e-content" }],
    cta: {
      _type: "link",
      isExternal: true,
      title: "Konsultasi Service",
      href: "https://wa.me/6285799520350",
    },
    blocks: [
      {
        _key: "hero-e2e-service",
        _type: "hero-1",
        title: "Service E2E Sanity",
        body: [
          {
            _type: "block",
            _key: "body-hero-service",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "s3", text: "Halaman service seeded dari script." }],
          },
        ],
      },
    ],
    meta: {
      _type: "meta",
      title: "Service E2E Sanity",
      description: "Metadata SEO service untuk validasi e2e.",
      noindex: false,
    },
  },
  {
    _id: "project-e2e-seed",
    _type: "project",
    title: "Project E2E Sanity",
    slug: { _type: "slug", current: "project-e2e-sanity" },
    excerpt: "Project seed untuk test e2e metadata.",
    clientName: "PT E2E",
    industry: "Technology",
    completionYear: 2026,
    projectType: "website",
    projectUrl: "https://example.com/project-e2e",
    categories: [{ _type: "reference", _ref: "category-e2e-content" }],
    cta: {
      _type: "link",
      isExternal: true,
      title: "Lihat Project",
      href: "https://example.com/project-e2e",
    },
    blocks: [
      {
        _key: "hero-e2e-project",
        _type: "hero-1",
        title: "Project E2E Sanity",
        body: [
          {
            _type: "block",
            _key: "body-hero-project",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "s4", text: "Halaman project seeded dari script." }],
          },
        ],
      },
    ],
    meta: {
      _type: "meta",
      title: "Project E2E Sanity",
      description: "Metadata SEO project untuk validasi e2e.",
      noindex: false,
    },
  },
  {
    _id: "post-e2e-seed",
    _type: "post",
    title: "Post E2E Sanity",
    slug: { _type: "slug", current: "post-e2e-sanity" },
    excerpt: "Post seed untuk test e2e metadata.",
    categories: [{ _type: "reference", _ref: "category-e2e-content" }],
    blocks: [
      {
        _key: "hero-e2e-post",
        _type: "hero-1",
        title: "Post E2E Sanity",
        body: [
          {
            _type: "block",
            _key: "body-hero-post",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "s5", text: "Halaman post seeded dari script." }],
          },
        ],
      },
    ],
    meta: {
      _type: "meta",
      title: "Post E2E Sanity",
      description: "Metadata SEO post untuk validasi e2e.",
      noindex: false,
      focusKeyword: "post e2e sanity",
      secondaryKeywords: ["blog seed sanity"],
    },
  },
  {
    _id: "redirect-e2e-seed",
    _type: "redirect",
    source: "/redirect-e2e-old",
    destination: "/products/produk-e2e-sanity",
    permanent: true,
    isEnabled: true,
  },
];

async function run() {
  for (const doc of docs) {
    await client.createOrReplace(doc);
  }
  console.log(`Seed complete: ${docs.length} documents upserted to ${projectId}/${dataset}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
