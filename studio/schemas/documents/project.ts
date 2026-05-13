import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { FolderKanban } from "lucide-react";
import meta from "../blocks/shared/meta";
import pageBlocks from "../blocks/shared/page-blocks";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: FolderKanban,
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    pageBlocks,
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      group: "settings",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "completionYear",
      title: "Completion Year",
      type: "number",
      group: "settings",
      validation: (Rule) => Rule.integer().min(1990).max(2100),
    }),
    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Portfolio", value: "portfolio" },
          { title: "Website", value: "website" },
          { title: "Software", value: "software" },
          { title: "Repository", value: "repository" },
        ],
        layout: "dropdown",
      },
      initialValue: "portfolio",
    }),
    defineField({
      name: "repositoryUrl",
      title: "Repository URL",
      description: "Link to the source code (e.g., GitHub).",
      type: "url",
      group: "settings",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "previewUrl",
      title: "Live Preview URL",
      description: "Link to a live demo or preview environment if different from Project URL.",
      type: "url",
      group: "settings",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "projectUrl",
      title: "Project URL",
      type: "url",
      group: "settings",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "settings",
      of: [{ type: "reference", to: { type: "category" } }],
      description:
        "Choose existing categories or create a new one directly from this selector.",
    }),
    defineField({
      name: "cta",
      title: "Primary CTA",
      type: "link",
      group: "settings",
    }),
    meta,
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      clientName: "clientName",
      industry: "industry",
      completionYear: "completionYear",
    },
    prepare({ title, media, clientName, industry, completionYear }) {
      const parts = [clientName, industry, completionYear].filter(Boolean);
      return {
        title: title || "Untitled project",
        media,
        subtitle: parts.length > 0 ? parts.join(" • ") : "Project",
      };
    },
  },
});
