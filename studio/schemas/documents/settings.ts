import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "logo",
      type: "object",
      fields: [
        defineField({
          name: "dark",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "light",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width",
          description:
            "The width of the logo. Default is dimensions of the image.",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height",
          description:
            "The height of the logo. Default is dimensions of the image.",
        }),
        defineField({
          name: "showBrandName",
          title: "Show Brand Name Next to Logo",
          type: "boolean",
          description:
            "If enabled, displays the brand name text beside the logo in the header.",
          initialValue: false,
        }),
        defineField({
          name: "brandNameSize",
          title: "Brand Name Text Size",
          type: "string",
          description: "Font size of the brand name shown next to the logo.",
          options: {
            list: [
              { title: "Small (sm)", value: "sm" },
              { title: "Medium (md)", value: "md" },
              { title: "Large (lg)", value: "lg" },
              { title: "Extra Large (xl)", value: "xl" },
            ],
            layout: "radio",
          },
          initialValue: "md",
          hidden: ({ parent }) => !parent?.showBrandName,
        }),
      ],
    }),
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      description:
        "Primary brand/site name used across UI and as SEO fallback when global SEO site name is empty.",
      initialValue: "Schema UI",
      validation: (Rule) => Rule.required().error("Site name is required"),
    }),
    defineField({
      name: "copyright",
      type: "block-content",
      description: "The copyright text to display in the footer",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description: "Links shown in the navigation bar.",
      type: "array",
      of: [
        defineField({
          name: "item",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "X (Twitter)", value: "x" },
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "GitHub", value: "github" },
                  { title: "Website", value: "website" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["http", "https"],
                }),
            }),
            defineField({
              name: "target",
              title: "Open in new tab",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "whatsApp",
      title: "Floating WhatsApp",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable floating button",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "phoneNumber",
          title: "Phone number (international format)",
          type: "string",
          description: "Example: 6281234567890 (numbers only, no + or spaces)",
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const enabled = (context.parent as { enabled?: boolean } | undefined)
                ?.enabled;
              if (!enabled) return true;
              if (!value) return "Phone number is required when enabled";
              return /^\d{8,15}$/.test(value)
                ? true
                : "Use 8-15 digits in international format";
            }),
        }),
        defineField({
          name: "predefinedText",
          title: "Predefined message text",
          type: "text",
          rows: 3,
          initialValue: "Hi, I want to ask about your services.",
        }),
        defineField({
          name: "ctaText",
          title: "CTA text",
          type: "string",
          description: "Text shown next to the WhatsApp icon.",
          initialValue: "Chat via WhatsApp",
        }),
        defineField({
          name: "enableAnimation",
          title: "Enable attention animation",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "sourceUrl",
          title: "Source URL",
          type: "url",
          description: "Optional URL appended as context in the WhatsApp message.",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https"],
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "brandName",
      legacyTitle: "siteName",
      media: "logo",
    },
    prepare({ title, legacyTitle, media }) {
      return {
        title: title || legacyTitle || "Site Settings",
        media,
      };
    },
  },
});
