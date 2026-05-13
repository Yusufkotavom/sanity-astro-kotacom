import { defineArrayMember, defineField, defineType } from "sanity";
import { Menu } from "lucide-react";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: Menu,
  initialValue: {
    links: [],
    headerCta: {
      title: "Start Building",
      isExternal: false,
      target: false,
      buttonVariant: "default",
    },
  },
  fields: [
    defineField({
      name: "links",
      title: "Links",
      description:
        "Navigation links for header and footer. Keep primary desktop nav at 8 items max, then move overflow into More Menu or Utility/CTA.",
      type: "array",
      of: [
        defineArrayMember({
          type: "link",
          initialValue: {
            isExternal: false,
            target: false,
            buttonVariant: "ghost",
          },
        }),
      ],
      validation: (Rule) => [
        Rule.max(16),
        Rule.custom((value) => {
          const links = Array.isArray(value) ? value : [];
          const primaryCount = links.filter((link) => {
            const nextLink = link as
              | {
                  showInHeader?: boolean;
                  navLocation?: "primary" | "more" | "utility";
                }
              | undefined;
            if (!nextLink) return false;
            if (nextLink.showInHeader === false) return false;
            return !nextLink.navLocation || nextLink.navLocation === "primary";
          }).length;

          if (primaryCount > 8) {
            return "Desktop primary navigation should stay at 8 items max. Move overflow into More Menu or Utility/CTA.";
          }

          return true;
        }).warning(),
      ],
    }),
    defineField({
      name: "headerCta",
      title: "Header CTA Button",
      description:
        "Primary call-to-action shown in the header alongside the global WhatsApp CTA from Settings when WhatsApp is enabled.",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Navigation" };
    },
  },
});
