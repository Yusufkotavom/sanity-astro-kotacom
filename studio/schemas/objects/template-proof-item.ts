import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateProofItem",
  title: "Template Proof Item",
  type: "object",
  fields: [
    defineField({
      name: "stat",
      title: "Angka / Statistik (opsional)",
      type: "string",
      description: "Contoh: 200+, 98%, 10 Tahun. Tampil besar di atas judul.",
    }),
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
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
    select: { title: "title", subtitle: "stat" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Proof Item",
        subtitle: subtitle ? `→ ${subtitle}` : "",
      };
    },
  },
});
