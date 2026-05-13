import { defineField, defineType } from "sanity";
import { Mails } from "lucide-react";
import { STACK_ALIGN } from "../shared/layout-variants";

export default defineType({
  name: "form-newsletter",
  type: "object",
  title: "Form: Newsletter",
  description:
    "A subscription form ideal for collecting email addresses for newsletters and waitlists.",
  icon: Mails,
  initialValue: {
    stackAlign: "left",
    consentText:
      "Dengan berlangganan, Anda setuju menerima update insight digital dan promo layanan. Bisa berhenti kapan saja.",
    buttonText: "Dapatkan Update",
    successMessage: "Terima kasih, email Anda sudah terdaftar.",
  },
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "stackAlign",
      type: "string",
      title: "Stack Layout Alignment",
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "consentText",
      type: "text",
    }),
    defineField({
      name: "buttonText",
      type: "string",
    }),
    defineField({
      name: "successMessage",
      type: "text",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Newsletter Form",
      };
    },
  },
});
