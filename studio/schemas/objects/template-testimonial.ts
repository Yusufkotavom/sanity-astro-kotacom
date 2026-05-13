import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateTestimonial",
  title: "Template Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Klien",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Jabatan / Role",
      type: "string",
      description: "Contoh: Owner, Marketing Manager, Direktur",
    }),
    defineField({
      name: "company",
      title: "Nama Perusahaan",
      type: "string",
      description: "Meningkatkan E-E-A-T — lebih spesifik lebih baik.",
    }),
    defineField({
      name: "industry",
      title: "Industri",
      type: "string",
      description: "Contoh: F&B, Retail, Logistik, Pendidikan",
    }),
    defineField({
      name: "quote",
      title: "Kutipan Testimoni",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "result",
      title: "Hasil Spesifik (opsional)",
      type: "string",
      description: "Contoh: Omset naik 150%, 3x lebih banyak leads, hemat 10 jam/minggu",
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "verified",
      title: "Terverifikasi",
      type: "boolean",
      initialValue: false,
      description: "Centang jika testimoni ini dapat diverifikasi (Google, Tokopedia, dll).",
    }),
    defineField({
      name: "image",
      title: "Foto Klien (opsional)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Testimoni",
        subtitle: subtitle || "Tanpa perusahaan",
        media,
      };
    },
  },
});
