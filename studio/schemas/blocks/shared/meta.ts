import { defineField } from "sanity";

export default defineField({
  name: "meta",
  title: "Meta",
  type: "object",
  group: "seo",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) =>
        Rule.max(70).warning("SEO title should ideally be under 70 characters."),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("SEO description should ideally be under 160 characters."),
    }),
    defineField({
      name: "canonicalUrl",
      type: "url",
      title: "Canonical URL Override",
      description: "Optional absolute URL to override generated canonical URL.",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "focusKeyword",
      type: "string",
      title: "Focus Keyword",
      description: "Primary keyword this page should rank for.",
    }),
    defineField({
      name: "secondaryKeywords",
      type: "array",
      title: "Secondary Keywords",
      of: [{ type: "string" }],
      options: {
        sortable: true,
      },
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
      ],
    }),
  ],
});
