import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";

export default defineType({
  name: "split-card",
  type: "object",
  icon: TextQuote,
  title: "Split Card",
  description:
    "Column with tag line, title and content body. Part of a split cards.",
  initialValue: {
    tagLine: "Expertise",
    title: "Implementasi cepat, hasil terukur",
    body: [
      {
        _key: "body-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "body-1-span-1",
            _type: "span",
            marks: [],
            text: "Mulai dari audit kebutuhan hingga delivery, setiap langkah dirancang agar efisien dan mudah dipahami oleh tim non-teknis.",
          },
        ],
      },
    ],
  },
  fields: [
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "uiIcon",
      title: "UI Icon",
      type: "ui-icon",
      description: "Optional icon shown beside the card tagline.",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
