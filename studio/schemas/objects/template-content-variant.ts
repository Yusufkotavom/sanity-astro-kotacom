import { defineField, defineType } from "sanity";

const SLOT_OPTIONS = [
  { title: "Hero Eyebrow", value: "heroEyebrow" },
  { title: "Hero Headline", value: "primaryKeyword" },
  { title: "Hero Subheadline", value: "intro" },
  { title: "Description", value: "description" },
  { title: "Primary CTA Label", value: "ctaLabel" },
  { title: "Final CTA Title", value: "finalCtaTitle" },
  { title: "Final CTA Description", value: "finalCtaDescription" },
];

const LANE_OPTIONS = [
  { title: "Website", value: "website" },
  { title: "Software", value: "software" },
  { title: "Printing", value: "printing" },
  { title: "Generic", value: "generic" },
];

const ROUTE_KIND_OPTIONS = [
  { title: "Base", value: "base" },
  { title: "City", value: "city" },
  { title: "Service", value: "service" },
  { title: "Service + City", value: "service-city" },
];

export default defineType({
  name: "templateContentVariant",
  title: "Template Content Variant",
  type: "object",
  fields: [
    defineField({
      name: "slot",
      title: "Slot",
      type: "string",
      options: { list: SLOT_OPTIONS, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
        type: "text",
        rows: 4,
        validation: (Rule) =>
          Rule.required().custom((value, context) => {
            const parent = context.parent as {
              requiresLocation?: boolean;
              requiresService?: boolean;
            } | null;
            if (
              typeof value === "string" &&
              /\{(lokasi|location|city)\}/i.test(value) &&
              !parent?.requiresLocation
            ) {
              return "Aktifkan 'Requires Location Context' jika teks memakai token lokasi.";
            }
            if (
              typeof value === "string" &&
              /\{(layanan|service|serviceName)\}/i.test(value) &&
              !parent?.requiresService
            ) {
              return "Aktifkan 'Requires Service Context' jika teks memakai token layanan.";
            }
            return true;
          }),
    }),
    defineField({
      name: "lane",
      title: "Lane",
      type: "string",
      options: { list: LANE_OPTIONS, layout: "radio" },
    }),
    defineField({
      name: "intent",
      title: "Funnel Intent",
      type: "string",
      options: {
        list: [
          { title: "Awareness", value: "awareness" },
          { title: "Commercial", value: "commercial" },
          { title: "Decision", value: "decision" },
        ],
        layout: "radio",
      },
      initialValue: "commercial",
    }),
    defineField({
      name: "strength",
      title: "Claim Strength",
      type: "string",
      options: {
        list: [
          { title: "Safe", value: "safe" },
          { title: "Aggressive", value: "aggressive" },
        ],
        layout: "radio",
      },
      initialValue: "safe",
    }),
    defineField({
      name: "requiresLocation",
      title: "Requires Location Context",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "requiresService",
      title: "Requires Service Context",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "routeKinds",
      title: "Allowed Route Kinds",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ROUTE_KIND_OPTIONS, layout: "grid" },
    }),
    defineField({
      name: "disallowedContexts",
      title: "Disallowed Context Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Tag sederhana untuk menolak varian ini di konteks tertentu, mis. no-location, pricing-heavy, faq-heavy.",
      options: { sortable: true },
    }),
  ],
  preview: {
    select: {
      title: "slot",
      subtitle: "text",
      lane: "lane",
      strength: "strength",
    },
    prepare({ title, subtitle, lane, strength }) {
      return {
        title: `${title || "slot"}${lane ? ` · ${lane}` : ""}`,
        subtitle: `${strength || "safe"} · ${(subtitle || "").slice(0, 80)}`,
      };
    },
  },
});
