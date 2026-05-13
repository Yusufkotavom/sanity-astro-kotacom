import { defineField } from "sanity";

export default defineField({
  name: "reviewItem",
  title: "Review",
  type: "object",
  fields: [
    defineField({
      name: "reviewerName",
      title: "Reviewer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reviewerRole",
      title: "Reviewer Role / Title",
      type: "string",
      description: "E.g. CEO PT ABC, Mahasiswa, Freelancer",
    }),
    defineField({
      name: "reviewerImage",
      title: "Reviewer Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "reviewBody",
      title: "Review Text",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "datePublished",
      title: "Date Published",
      type: "date",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "E.g. Google Maps, Tokopedia, Internal",
      options: {
        list: [
          { title: "Google Maps", value: "google-maps" },
          { title: "Tokopedia", value: "tokopedia" },
          { title: "Shopee", value: "shopee" },
          { title: "Internal", value: "internal" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link to original review for verifiability",
    }),
    defineField({
      name: "verified",
      title: "Verified Review",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "reviewerName",
      subtitle: "rating",
      media: "reviewerImage",
    },
    prepare({ title, subtitle, media }) {
      const stars = subtitle ? "★".repeat(Math.round(subtitle)) : "";
      return {
        title: title || "Unnamed Reviewer",
        subtitle: stars,
        media,
      };
    },
  },
});
