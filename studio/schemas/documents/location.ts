import { defineField, defineType } from "sanity";
import { MapPin } from "lucide-react";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: MapPin,
  fields: [
    defineField({
      name: "title",
      title: "Location Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "string",
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Optional region/area for grouping.",
    }),
    defineField({
      name: "lat",
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "lng",
      title: "Longitude",
      type: "number",
    }),
    defineField({
      name: "highlights",
      title: "Local Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "overview",
      title: "City Overview",
      type: "text",
      rows: 4,
      description: "Ringkasan unik tentang kota untuk diferensiasi konten.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      province: "province",
    },
    prepare({ title, province }) {
      return {
        title: title || "Location",
        subtitle: province || "",
      };
    },
  },
});
