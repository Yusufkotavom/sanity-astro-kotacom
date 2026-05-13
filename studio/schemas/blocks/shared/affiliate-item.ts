import { defineField } from "sanity";

export default defineField({
  name: "affiliateItem",
  title: "Affiliate / Review Item",
  type: "object",
  description:
    "A product, service, software, or app being reviewed or listed in a blog post.",
  fields: [
    defineField({
      name: "itemType",
      title: "Item Type",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Product (physical)", value: "product" },
          { title: "Software", value: "software" },
          { title: "Service", value: "service" },
          { title: "Web Application", value: "webapp" },
          { title: "Mobile Application", value: "mobileapp" },
        ],
        layout: "dropdown",
      },
      initialValue: "product",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand / Developer",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pros",
      title: "Pros / Kelebihan",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cons",
      title: "Cons / Kekurangan",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
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
      name: "affiliateUrl",
      title: "Affiliate / Buy URL",
      type: "url",
      description: "Link to purchase page. Will be marked rel='sponsored nofollow' automatically.",
    }),
    defineField({
      name: "affiliateLabel",
      title: "Button Label",
      type: "string",
      description: "E.g. 'Beli di Tokopedia', 'Try Free', 'Hubungi'",
      initialValue: "Lihat Detail",
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "In Stock / Available", value: "in-stock" },
          { title: "Out of Stock", value: "out-of-stock" },
          { title: "Pre-Order", value: "pre-order" },
          { title: "Free", value: "free" },
          { title: "Freemium", value: "freemium" },
        ],
      },
    }),
    defineField({
      name: "sku",
      title: "SKU / Identifier",
      type: "string",
      description: "Product code, app ID, or unique identifier",
    }),
    defineField({
      name: "position",
      title: "Rank Position",
      type: "number",
      description: "Position in listicle (1 = best, 2 = second, etc.)",
    }),
    defineField({
      name: "verdict",
      title: "Verdict / Kesimpulan",
      type: "text",
      rows: 2,
      description: "Short conclusion about this specific item",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "itemType",
      media: "image",
      rating: "rating",
      position: "position",
    },
    prepare({ title, subtitle, media, rating, position }) {
      const typeLabels: Record<string, string> = {
        product: "🛒 Product",
        software: "💻 Software",
        service: "🔧 Service",
        webapp: "🌐 WebApp",
        mobileapp: "📱 App",
      };
      const typeLabel = typeLabels[subtitle || "product"] || subtitle;
      const stars = rating ? ` ★${rating}` : "";
      const pos = position ? `#${position} ` : "";
      return {
        title: `${pos}${title || "Untitled"}`,
        subtitle: `${typeLabel}${stars}`,
        media,
      };
    },
  },
});
