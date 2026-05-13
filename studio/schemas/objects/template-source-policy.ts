import { defineField, defineType } from "sanity";

const SOURCE_OPTIONS = [
  { title: "Page Override First", value: "page-first" },
  { title: "Template First", value: "template-first" },
  { title: "Template Only", value: "template-only" },
  { title: "Page Only", value: "page-only" },
  { title: "Legacy Base Only", value: "base-only" },
];

export default defineType({
  name: "templateSourcePolicy",
  title: "Template Source Policy",
  type: "object",
  fields: [
    defineField({
      name: "pricingSource",
      title: "Pricing Source",
      type: "string",
      options: { list: SOURCE_OPTIONS, layout: "dropdown" },
      initialValue: "page-first",
    }),
    defineField({
      name: "proofSource",
      title: "Proof Source",
      type: "string",
      options: { list: SOURCE_OPTIONS, layout: "dropdown" },
      initialValue: "page-first",
    }),
    defineField({
      name: "testimonialSource",
      title: "Testimonial Source",
      type: "string",
      options: { list: SOURCE_OPTIONS, layout: "dropdown" },
      initialValue: "page-first",
    }),
    defineField({
      name: "maxQuickLinks",
      title: "Max Quick Links",
      type: "number",
      initialValue: 2,
      validation: (Rule) => Rule.required().integer().min(0).max(2),
    }),
  ],
});
