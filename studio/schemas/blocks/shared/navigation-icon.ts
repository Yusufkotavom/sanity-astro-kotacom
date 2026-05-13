import { defineType } from "sanity";
import NavigationIconInput from "../../inputs/navigation-icon-input";
import { NAVIGATION_ICON_OPTIONS } from "./navigation-icon-options";

export const navigationIcon = defineType({
  name: "navigation-icon",
  title: "Navigation Icon",
  type: "string",
  options: {
    list: NAVIGATION_ICON_OPTIONS.map(({ title, value }) => ({ title, value })),
    layout: "dropdown",
  },
  components: {
    input: NavigationIconInput,
  },
});
