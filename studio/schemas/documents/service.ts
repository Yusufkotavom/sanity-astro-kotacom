import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { BriefcaseBusiness } from "lucide-react";
import meta from "../blocks/shared/meta";
import pageBlocks from "../blocks/shared/page-blocks";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: BriefcaseBusiness,
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    pageBlocks,
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      group: "settings",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "duration",
      title: "Estimated Duration",
      type: "string",
      group: "settings",
      description: "Example: 2 weeks, 1 month, 3 days.",
    }),
    defineField({
      name: "startingPrice",
      title: "Starting Price",
      type: "number",
      group: "settings",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "IDR", value: "IDR" },
          { title: "USD", value: "USD" },
          { title: "EUR", value: "EUR" },
        ],
        layout: "dropdown",
      },
      initialValue: "IDR",
    }),
    defineField({
      name: "featured",
      title: "Featured Service",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "settings",
      of: [{ type: "reference", to: { type: "category" } }],
      description:
        "Choose existing categories or create a new one directly from this selector.",
    }),
    defineField({
      name: "cta",
      title: "Primary CTA",
      type: "link",
      group: "settings",
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      group: "seo",
      of: [{ type: "reviewItem" }],
      description: "Customer reviews for this service (used in JSON-LD structured data).",
    }),
    defineField({
      name: "aggregateRating",
      title: "Aggregate Rating",
      type: "aggregateRating",
      group: "seo",
      description: "Override rating. If empty, auto-calculated from reviews. If no reviews, falls back to SEO Settings default.",
    }),
    meta,
    orderRankField({ type: "service" }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      startingPrice: "startingPrice",
      currency: "currency",
      duration: "duration",
    },
    prepare({ title, media, startingPrice, currency, duration }) {
      const priceText =
        typeof startingPrice === "number"
          ? `From ${currency || "IDR"} ${startingPrice}`
          : "No price";
      const durationText = duration || "No duration";
      return {
        title: title || "Untitled service",
        media,
        subtitle: `${priceText} • ${durationText}`,
      };
    },
  },
});
