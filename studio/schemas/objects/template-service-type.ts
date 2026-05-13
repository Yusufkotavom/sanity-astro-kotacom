import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateServiceType",
  title: "Template Service Type",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul Layanan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "targetAudience",
      title: "Target Audiens",
      type: "string",
      description: "Contoh: UMKM, Startup, Perusahaan Menengah. Untuk copy 'Cocok untuk...'.",
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "features",
      title: "Fitur Utama",
      type: "array",
      of: [{ type: "string" }],
      description: "3–5 poin singkat yang membedakan tipe layanan ini.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }],
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "targetAudience",
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || "Service Type",
        subtitle: subtitle ? `untuk ${subtitle}` : "",
        media,
      };
    },
  },
});
