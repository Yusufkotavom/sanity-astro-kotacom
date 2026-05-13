import { defineField, defineType } from "sanity";
import { Link2 } from "lucide-react";

function isValidInternalPath(value: string | undefined) {
  if (!value) return "Value is required";
  if (!value.startsWith("/")) return "Internal path must start with /";
  if (/\s/.test(value)) return "Path cannot contain spaces";
  return true;
}

function isValidUrl(value: string | undefined) {
  if (!value) return "Value is required";
  try {
    new URL(value);
    return true;
  } catch {
    return "Invalid URL";
  }
}

export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: Link2,
  description: "Managed redirects used by Next.js next.config redirects().",
  validation: (Rule) =>
    Rule.custom((doc: any) => {
      if (!doc) return true;
      if (doc.source && doc.destination && doc.source === doc.destination) {
        return "Source and destination cannot be the same.";
      }
      return true;
    }),
  fields: [
    defineField({
      name: "source",
      title: "Source Path",
      type: "string",
      description: "Incoming path. Must start with /. Example: /old-blog/my-post",
      validation: (Rule) => Rule.required().custom(isValidInternalPath),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "string",
      description: "Internal path (/new-path) or full URL (https://example.com).",
      validation: (Rule) =>
        Rule.required().custom((value: string | undefined) => {
          const pathValidation = isValidInternalPath(value);
          if (pathValidation === true) return true;

          const urlValidation = isValidUrl(value);
          if (urlValidation === true) return true;

          return typeof pathValidation === "string"
            ? pathValidation
            : "Destination must be a valid internal path or URL.";
        }),
    }),
    defineField({
      name: "permanent",
      title: "Permanent Redirect",
      type: "boolean",
      description: "true = permanent, false = temporary.",
      initialValue: true,
    }),
    defineField({
      name: "isEnabled",
      title: "Enabled",
      description: "Toggle this redirect on or off.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      source: "source",
      destination: "destination",
      isEnabled: "isEnabled",
    },
    prepare({ source, destination, isEnabled }) {
      return {
        title: source || "Untitled redirect",
        subtitle: `${destination || ""}${isEnabled === false ? " (disabled)" : ""}`,
      };
    },
  },
});
