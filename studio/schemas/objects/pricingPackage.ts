import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricingPackage',
  title: 'Pricing Package',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Package Name' }),
    defineField({ name: 'price', type: 'number', title: 'Price' }),
    defineField({ name: 'currency', type: 'string', title: 'Currency', initialValue: 'IDR' }),
    defineField({ name: 'priceUnit', type: 'string', title: 'Price Unit', description: 'e.g., per unit, per month' }),
    defineField({ name: 'duration', type: 'string', title: 'Duration', description: 'e.g., 14-21 hari kerja' }),
    defineField({
      name: 'features',
      type: 'array',
      title: 'Features Included',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'excluded',
      type: 'array',
      title: 'Features Excluded',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'paymentTerms', type: 'text', title: 'Payment Terms' }),
    defineField({ name: 'bestFor', type: 'string', title: 'Best For' }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      currency: 'currency',
    },
    prepare({ title, price, currency }) {
      return {
        title,
        subtitle: `${currency} ${price?.toLocaleString('id-ID')}`,
      };
    },
  },
});
