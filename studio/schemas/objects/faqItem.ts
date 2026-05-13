import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Question',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      title: 'Answer',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
  },
});
