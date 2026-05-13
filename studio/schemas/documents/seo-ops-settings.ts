import { defineField, defineType } from "sanity";
import { Bot } from "lucide-react";

export default defineType({
  name: "seoOpsSettings",
  title: "SEO Ops Settings",
  type: "document",
  icon: Bot,
  fields: [
    defineField({
      name: "googleEnabled",
      title: "Google Indexing Enabled",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "googleAggressiveMode",
      title: "Google Aggressive Mode",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "googleServiceAccountEncrypted",
      title: "Google Service Account (Encrypted)",
      type: "text",
      rows: 6,
      description:
        "Managed by SEO dashboard API. Do not edit manually unless you know the encryption format.",
    }),
    defineField({
      name: "indexNowEnabled",
      title: "IndexNow Enabled",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "indexNowHost",
      title: "IndexNow Host",
      type: "string",
    }),
    defineField({
      name: "indexNowEndpoint",
      title: "IndexNow Endpoint",
      type: "string",
      initialValue: "https://api.indexnow.org/indexnow",
    }),
    defineField({
      name: "indexNowKeyEncrypted",
      title: "IndexNow Key (Encrypted)",
      type: "string",
      description:
        "Managed by SEO dashboard API. Do not edit manually unless you know the encryption format.",
    }),
    defineField({
      name: "indexNowKeyLocation",
      title: "IndexNow Key Location",
      type: "string",
      description: "Optional custom key location URL.",
    }),
    defineField({
      name: "autoSubmitOnRevalidate",
      title: "Auto Submit On Revalidate",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "maxBatchSize",
      title: "Max Batch Size",
      type: "number",
      initialValue: 100,
      validation: (Rule) => Rule.min(1).max(1000),
    }),
    defineField({
      name: "retryAttempts",
      title: "Retry Attempts",
      type: "number",
      initialValue: 2,
      validation: (Rule) => Rule.min(0).max(10),
    }),
    defineField({
      name: "dashboardPasswordHash",
      title: "Dashboard Password SHA256",
      type: "string",
      description:
        "Managed by SEO dashboard API. Keep as 64-char SHA256 hex value.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return /^[a-f0-9]{64}$/i.test(value)
            ? true
            : "Password hash must be 64 hex characters";
        }),
    }),
    defineField({
      name: "notes",
      title: "Ops Notes",
      type: "text",
      rows: 4,
      description:
        "Internal documentation for SEO operations. Do not store API keys here.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "SEO Ops Settings",
        subtitle: "Dashboard runtime config and encrypted secret payloads",
      };
    },
  },
});
