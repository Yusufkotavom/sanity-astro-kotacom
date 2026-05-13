import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateLongGuide",
  title: "Template Long Guide",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
  ],
});
