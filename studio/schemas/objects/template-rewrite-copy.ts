import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateRewriteCopy",
  title: "Template Rewrite Copy",
  type: "object",
  fields: [
    // ----- Headline & Above-Fold -----
    defineField({
      name: "heroBadge",
      title: "Hero Badge / Eyebrow Stat",
      type: "string",
      description: "Teks di atas headline. Contoh: ✓ 500+ Klien Puas · 10 Tahun Pengalaman",
    }),
    defineField({
      name: "primaryKeyword",
      title: "Headline Utama",
      type: "string",
      description: "Headline H1 halaman. Gunakan {lokasi} untuk halaman kota.",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline / Hero Support",
      type: "string",
      description: "Kalimat pendek di bawah headline. Spesifik dan benefit-driven.",
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { sortable: true },
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Dipakai sebagai meta description halaman (max 160 karakter).",
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraf",
      type: "text",
      rows: 3,
      description: "Paragraf pembuka di bawah hero. Konteks + manfaat utama.",
    }),
    // ----- Value & Differentiation -----
    defineField({
      name: "valueProposition",
      title: "Value Proposition / USP",
      type: "string",
      description: "Apa yang membedakan Kotacom dari kompetitor. Spesifik dan dapat dibuktikan.",
    }),
    defineField({
      name: "problemStatement",
      title: "Problem Statement",
      type: "text",
      rows: 3,
      description: "Pain point utama target audiens. Dimulai dari masalah, bukan solusi.",
    }),
    defineField({
      name: "guarantee",
      title: "Garansi / Risk Reversal",
      type: "string",
      description: "Contoh: Garansi revisi tak terbatas · Uang kembali jika tidak puas",
    }),
    // ----- Social Proof Signals -----
    defineField({
      name: "stats",
      title: "Statistik Bisnis",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Angka", type: "string", description: "Contoh: 500+, 10 Tahun, 98%" },
            { name: "label", title: "Label", type: "string", description: "Contoh: Klien Puas, Pengalaman, Kepuasan" },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      description: "Angka-angka proof di hero atau utility strip. Max 4 disarankan.",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "eeatPoints",
      title: "E-E-A-T Points",
      type: "array",
      of: [{ type: "templateEeatPoint" }],
    }),
    defineField({
      name: "process",
      title: "Process Steps",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "templateFaq" }],
    }),
    defineField({
      name: "ctaLabel",
      title: "Primary CTA Label",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "Primary CTA Link",
      type: "link",
    }),
    defineField({
      name: "ctaLinks",
      title: "Quick CTA Links",
      type: "array",
      of: [{ type: "templateCtaLink" }],
      validation: (Rule) =>
        Rule.max(2).warning("Gunakan maksimal 2 quick CTA agar hierarchy tetap fokus."),
    }),
    defineField({
      name: "serviceTypes",
      title: "Service Types",
      type: "array",
      of: [{ type: "templateServiceType" }],
    }),
    defineField({
      name: "pricingPlans",
      title: "Pricing Plans",
      type: "array",
      of: [{ type: "templatePricingPlan" }],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "templateFeature" }],
    }),
    defineField({
      name: "proofItems",
      title: "Proof Items",
      type: "array",
      of: [{ type: "templateProofItem" }],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "templateTestimonial" }],
    }),
    defineField({
      name: "longGuide",
      title: "Long Guide",
      type: "array",
      of: [{ type: "templateLongGuide" }],
    }),
    defineField({
      name: "finalCtaTitle",
      title: "Final CTA Title",
      type: "string",
    }),
    defineField({
      name: "finalCtaDescription",
      title: "Final CTA Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contentVariants",
      title: "Rule-based Content Variants",
      type: "array",
      description:
        "Reusable spinner copy untuk slot penting. Gunakan hanya untuk support copy, bukan bukti inti atau pricing.",
      of: [{ type: "templateContentVariant" }],
    }),
  ],
});
