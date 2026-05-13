import { defineType } from "sanity";
import { preview } from "sanity-plugin-icon-picker-v2";

const UI_ICON_OPTIONS = {
  providers: ["lu", "si"],
  outputFormat: "react",
  storeSvg: true,
} as const;

export const uiIcon = defineType({
  name: "ui-icon",
  title: "UI Icon",
  type: "iconPicker",
  options: UI_ICON_OPTIONS as any,
  preview: {
    select: {
      provider: "provider",
      name: "name",
    },
    prepare(icon: { provider?: string; name?: string }) {
      const provider = typeof icon.provider === "string" ? icon.provider : "";
      const name = typeof icon.name === "string" ? icon.name : "";

      return {
        title: name || "No icon selected",
        subtitle: provider ? `Provider: ${provider}` : "Pick a Lucide or Simple Icon",
        media:
          provider && name
            ? preview({
                provider,
                name,
                options: UI_ICON_OPTIONS as any,
              })
            : undefined,
      };
    },
  },
} as any);
