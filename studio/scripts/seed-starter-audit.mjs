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
  console.error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const navLinks = [
  { _key: "home", _type: "link", title: "Home", href: "/", showInHeader: true, showInFooter: true, navLocation: "primary" },
  {
    _key: "services",
    _type: "link",
    title: "Services",
    href: "/services/service-e2e-sanity",
    showInHeader: true,
    showInFooter: true,
    navLocation: "primary",
    children: [
      { _key: "service-web-dev", _type: "navigation-link-child", title: "Web Development", href: "/services/service-e2e-sanity", group: "Core Services", description: "Build fast marketing and business websites." },
      { _key: "service-seo", _type: "navigation-link-child", title: "SEO Services", href: "/services/service-e2e-sanity", group: "Growth", badge: "Popular", description: "Technical and content SEO for steady traffic." },
      { _key: "service-maintenance", _type: "navigation-link-child", title: "Maintenance", href: "/services/service-e2e-sanity", group: "Support", description: "Ongoing updates, fixes, and monitoring." },
    ],
  },
  {
    _key: "products",
    _type: "link",
    title: "Products",
    href: "/products/produk-e2e-sanity",
    showInHeader: true,
    showInFooter: true,
    navLocation: "primary",
    children: [
      { _key: "product-featured", _type: "navigation-link-child", title: "Featured Product", href: "/products/produk-e2e-sanity", group: "Featured", badge: "New", description: "Flagship product with full metadata." },
      { _key: "product-catalog", _type: "navigation-link-child", title: "All Products", href: "/products", group: "Catalog", description: "Browse complete products listing." },
    ],
  },
  {
    _key: "projects",
    _type: "link",
    title: "Projects",
    href: "/projects/sanity/project-e2e-sanity",
    showInHeader: true,
    showInFooter: true,
    navLocation: "primary",
    children: [
      { _key: "project-case-study", _type: "navigation-link-child", title: "Case Study", href: "/projects/sanity/project-e2e-sanity", group: "Portfolio", description: "Detailed implementation story." },
      { _key: "project-all", _type: "navigation-link-child", title: "All Projects", href: "/projects", group: "Portfolio", description: "Explore full project archive." },
    ],
  },
  {
    _key: "blog",
    _type: "link",
    title: "Blog",
    href: "/blog/post-e2e-sanity",
    showInHeader: true,
    showInFooter: true,
    navLocation: "more",
    children: [
      { _key: "blog-latest", _type: "navigation-link-child", title: "Latest Post", href: "/blog/post-e2e-sanity", group: "Blog", description: "Newest article from the studio." },
      { _key: "blog-all", _type: "navigation-link-child", title: "All Posts", href: "/blog", group: "Blog", description: "Full knowledge base and updates." },
    ],
  },
  { _key: "about", _type: "link", title: "About", href: "/about", showInHeader: true, showInFooter: true, navLocation: "more" },
  { _key: "contact", _type: "link", title: "Contact", href: "/contact", showInHeader: false, showInFooter: true, navLocation: "utility" },
  { _key: "privacy", _type: "link", title: "Privacy", href: "/privacy", showInHeader: false, showInFooter: true, navLocation: "utility" },
];

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Kotacom",
    description: "Starter audit seed for Sanity + Astro",
    companyName: "KOTACOM IT SERVICE & PERCETAKAN",
    companyTagline: "Build Fast, Rank Better, Convert More",
    companyDescription: "Implementation partner for websites, SEO and digital products.",
    phone: "+62 857-9952-0350",
    whatsapp: "6285799520350",
    email: "hello@kotacom.id",
    address: "Surabaya, East Java, Indonesia",
    location: "Surabaya",
    coverage: "Indonesia",
    socialMedia: {
      instagram: "https://instagram.com/kotacom",
      linkedin: "https://linkedin.com/company/kotacom",
      youtube: "https://youtube.com/@kotacom",
    },
  },
  {
    _id: "seoSettings",
    _type: "seoSettings",
    titleSuffix: " | KOTACOM",
    defaultTitle: "KOTACOM IT SERVICE & PERCETAKAN",
    defaultDescription: "Sanity + Astro starter with SEO-ready architecture.",
    defaultNoIndex: false,
    siteUrl: "https://www.kotacom.id",
    twitterHandle: "@kotacom",
  },
  {
    _id: "navigation",
    _type: "navigation",
    links: navLinks,
    headerCta: {
      _type: "link",
      title: "Start Project",
      href: "/contact",
      isExternal: false,
      buttonVariant: "default",
    },
  },
];

async function upsert(doc) {
  await client.createOrReplace(doc);
  console.log("seeded:", doc._id);
}

async function run() {
  for (const doc of docs) {
    await upsert(doc);
  }
  console.log(`Done. Project: ${projectId}, dataset: ${dataset}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
