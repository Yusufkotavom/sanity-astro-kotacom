import { defineField, defineType } from "sanity";

export default defineType({
  name: "templateEeatPoint",
  title: "E-E-A-T Point",
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
      rows: 3,
    }),
  ],
});
