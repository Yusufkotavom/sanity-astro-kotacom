import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";
import meta from "../blocks/shared/meta";

const SECTION_ORDER_OPTIONS = [
  { title: "Landing Sections", value: "landing" },
  { title: "Highlights", value: "highlights" },
  { title: "Custom Blocks", value: "custom-blocks" },
  { title: "Process & FAQ", value: "process-faq" },
  { title: "Related Links", value: "related-links" },
  { title: "Micro Badges", value: "micro-badges" },
  { title: "Percetakan Metrics", value: "percetakan-metrics" },
  { title: "Percetakan Stage", value: "percetakan-stage" },
  { title: "Percetakan Quote", value: "percetakan-quote" },
  { title: "Percetakan Logo Wall", value: "percetakan-logo-wall" },
];

export default defineType({
  name: "legacyPage",
  type: "document",
  title: "Legacy Page Override",
  icon: FileText,
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "route",
      title: "Route",
      type: "string",
      group: "settings",
      description: "Absolute path, contoh: /about atau /pembuatan-website",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "templateVariant",
      title: "Template Variant",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Narrative", value: "narrative" },
          { title: "Case Study", value: "case-study" },
          { title: "FAQ Heavy", value: "faq-heavy" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "heroOverride",
      title: "Hero Override",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "text" }),
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
        defineField({ name: "ctaHref", title: "CTA Href", type: "string" }),
        defineField({
          name: "secondaryKeywords",
          title: "Secondary Keywords",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "image",
          fields: [
            { name: "alt", type: "string", title: "Alternative Text" },
          ],
        }),
      ],
    }),
    defineField({
      name: "highlightsOverride",
      title: "Highlights Override",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "faqOverride",
      title: "FAQ Override",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "answer", type: "text" }),
          ],
        },
      ],
      group: "content",
    }),
    defineField({
      name: "sectionOrder",
      title: "Section Order",
      type: "array",
      of: [{ type: "string" }],
      options: { list: SECTION_ORDER_OPTIONS },
      group: "settings",
      description:
        "Urutan modul template. Jika kosong, pakai urutan default atau variant.",
    }),
    defineField({
      name: "customBlocks",
      title: "Custom Blocks",
      type: "array",
      group: "content",
      description: "Tambahan blok Sanity untuk disisipkan di template.",
      of: [
        { type: "hero-1" },
        { type: "hero-2" },
        { type: "section-header" },
        { type: "split-row" },
        { type: "grid-row" },
        { type: "carousel-1" },
        { type: "carousel-2" },
        { type: "timeline-row" },
        { type: "cta-1" },
        { type: "whatsapp-cta" },
        { type: "logo-cloud-1" },
        { type: "faqs" },
        { type: "form-newsletter" },
        { type: "all-posts" },
        { type: "legacy-rich-content" },
      ],
    }),
    meta,
  ],
  preview: {
    select: {
      title: "route",
      variant: "templateVariant",
    },
    prepare({ title, variant }) {
      return {
        title: title || "Legacy Page Override",
        subtitle: variant ? `Variant: ${variant}` : "Override",
      };
    },
  },
});
