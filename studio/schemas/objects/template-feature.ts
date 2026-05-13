import { defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  { title: "Kecepatan", value: "speed" },
  { title: "Keamanan", value: "security" },
  { title: "Konversi", value: "conversion" },
  { title: "Desain", value: "design" },
  { title: "Dukungan", value: "support" },
  { title: "E-Commerce", value: "ecommerce" },
  { title: "Paket", value: "boxes" },
  { title: "Analitik", value: "analytics" },
  { title: "Integrasi", value: "integration" },
  { title: "Harga", value: "pricing" },
  { title: "Mobile", value: "mobile" },
  { title: "Custom", value: "custom" },
];

export default defineType({
  name: "templateFeature",
  title: "Template Feature",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul Fitur",
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
      name: "icon",
      title: "Icon Key",
      type: "string",
      options: { list: ICON_OPTIONS, layout: "dropdown" },
      description: "Pilih icon untuk fitur ini.",
    }),
    defineField({
      name: "badge",
      title: "Badge (opsional)",
      type: "string",
      description: "Contoh: BARU, POPULER, UNGGULAN",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "badge" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Fitur",
        subtitle: subtitle || "",
      };
    },
  },
});
