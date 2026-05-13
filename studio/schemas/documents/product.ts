import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { Package } from "lucide-react";
import meta from "../blocks/shared/meta";
import pageBlocks from "../blocks/shared/page-blocks";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
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
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "settings",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alternative Text" }],
        },
      ],
    }),
    defineField({
      name: "price",
      title: "Price",
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
      name: "availability",
      title: "Availability",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "In Stock", value: "in-stock" },
          { title: "Pre-Order", value: "pre-order" },
          { title: "Out of Stock", value: "out-of-stock" },
        ],
        layout: "radio",
      },
      initialValue: "in-stock",
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
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
      description: "Customer reviews for this product (used in JSON-LD structured data).",
    }),
    defineField({
      name: "aggregateRating",
      title: "Aggregate Rating",
      type: "aggregateRating",
      group: "seo",
      description: "Override rating. If empty, auto-calculated from reviews. If no reviews, falls back to SEO Settings default.",
    }),
    meta,
    orderRankField({ type: "product" }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      price: "price",
      currency: "currency",
      availability: "availability",
    },
    prepare({ title, media, price, currency, availability }) {
      const priceText =
        typeof price === "number" ? `${currency || "IDR"} ${price}` : "No price";
      const availabilityText = availability || "No availability";
      return {
        title: title || "Untitled product",
        media,
        subtitle: `${priceText} • ${availabilityText}`,
      };
    },
  },
});
