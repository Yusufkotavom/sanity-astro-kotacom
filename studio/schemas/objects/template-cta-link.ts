import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateCtaLink",
  title: "Template CTA Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "label",
      href: "link.href",
    },
    prepare({ title, href }) {
      return {
        title: title || "CTA Link",
        subtitle: href || "No link",
      };
    },
  },
});
