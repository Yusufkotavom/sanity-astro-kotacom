import { defineField, defineType } from "sanity";

export default defineType({
  name: "templatePricingPlan",
  title: "Template Pricing Plan",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Paket",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge (opsional)",
      type: "string",
      description: "Contoh: POPULER, TERLARIS, HEMAT, BEST VALUE",
    }),
    defineField({
      name: "price",
      title: "Harga",
      type: "string",
      description: "Contoh: Rp 3.000.000 atau Mulai dari Rp 500.000",
    }),
    defineField({
      name: "description",
      title: "Deskripsi Paket",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Yang Termasuk",
      type: "array",
      of: [{ type: "string" }],
      description: "Fitur/layanan yang tercakup dalam paket ini.",
    }),
    defineField({
      name: "excludes",
      title: "Yang Tidak Termasuk (opsional)",
      type: "array",
      of: [{ type: "string" }],
      description: "Transparansi harga meningkatkan kepercayaan klien.",
    }),
    defineField({
      name: "timeline",
      title: "Estimasi Waktu Pengerjaan",
      type: "string",
      description: "Contoh: 7–14 hari kerja, 1 bulan",
    }),
    defineField({
      name: "paymentTerms",
      title: "Syarat Pembayaran (opsional)",
      type: "string",
      description: "Contoh: DP 50%, pelunasan setelah selesai",
    }),
    defineField({
      name: "recommended",
      title: "Paket Unggulan",
      type: "boolean",
      initialValue: false,
      description: "Tandai satu paket sebagai rekomendasi utama.",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link per Paket (opsional)",
      type: "link",
      description: "Biarkan kosong untuk menggunakan CTA global template.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      recommended: "recommended",
    },
    prepare({ title, subtitle, recommended }) {
      return {
        title: `${title || "Paket"}${recommended ? " ★" : ""}`,
        subtitle: subtitle || "Harga belum diisi",
      };
    },
  },
});
