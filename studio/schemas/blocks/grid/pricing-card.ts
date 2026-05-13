import { defineField, defineType } from "sanity";
import { WalletCards } from "lucide-react";

export default defineType({
  name: "pricing-card",
  type: "object",
  icon: WalletCards,
  initialValue: {
    title: "Website Starter",
    tagLine: "Paling cocok untuk UMKM",
    price: {
      value: 850000,
      period: "/project",
    },
    list: [
      "Desain responsif",
      "Setup domain & hosting",
      "Optimasi SEO dasar",
      "Training penggunaan",
    ],
    excerpt:
      "Paket praktis untuk memulai kehadiran digital bisnis Anda dengan timeline yang cepat.",
    link: {
      _type: "link",
      isExternal: false,
      title: "Diskusikan Paket",
      target: false,
      buttonVariant: "default",
    },
  },
  fields: [
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown in the pricing card heading.",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "price",
      type: "object",
      fields: [
        defineField({
          name: "value",
          type: "number",
        }),
        defineField({
          name: "period",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "list",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "excerpt",
      type: "text",
    }),
    defineField({
      name: "link",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price.value",
      period: "price.period",
    },
    prepare({ title, price, period }) {
      return {
        title: "Pricing Card",
        subtitle: `${title}: ${price}${period}`,
      };
    },
  },
});
