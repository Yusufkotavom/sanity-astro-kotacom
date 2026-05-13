import { defineField, defineType } from 'sanity';
import { Sparkles } from 'lucide-react';

export default defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'document',
  icon: Sparkles,
  fields: [
    defineField({
      name: 'companyInfo',
      title: 'Company Information',
      type: 'object',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Company Name' }),
        defineField({ name: 'foundedYear', type: 'number', title: 'Founded Year' }),
        defineField({ name: 'address', type: 'text', title: 'Address' }),
        defineField({ name: 'phone', type: 'string', title: 'Phone' }),
        defineField({ name: 'whatsapp', type: 'string', title: 'WhatsApp' }),
        defineField({ name: 'email', type: 'string', title: 'Email' }),
        defineField({ name: 'operatingHours', type: 'string', title: 'Operating Hours' }),
        defineField({ name: 'totalClients', type: 'number', title: 'Total Clients' }),
        defineField({ name: 'totalProjects', type: 'number', title: 'Total Projects' }),
        defineField({
          name: 'serviceAreas',
          type: 'array',
          title: 'Service Areas',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'certifications',
          type: 'array',
          title: 'Certifications',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'awards',
          type: 'array',
          title: 'Awards',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name' }),
            defineField({ name: 'position', type: 'string', title: 'Position' }),
            defineField({ name: 'company', type: 'string', title: 'Company' }),
            defineField({ name: 'industry', type: 'string', title: 'Industry' }),
            defineField({ name: 'rating', type: 'number', title: 'Rating', validation: (rule) => rule.min(1).max(5) }),
            defineField({ name: 'quote', type: 'text', title: 'Quote' }),
            defineField({
              name: 'results',
              type: 'object',
              title: 'Results',
              fields: [
                defineField({ name: 'metric', type: 'string', title: 'Metric' }),
                defineField({ name: 'value', type: 'string', title: 'Value' }),
                defineField({ name: 'timeframe', type: 'string', title: 'Timeframe' }),
              ],
            }),
            defineField({ name: 'date', type: 'date', title: 'Date' }),
            defineField({ name: 'verified', type: 'boolean', title: 'Verified' }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'company',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'pricingPackages',
      title: 'Pricing Packages',
      type: 'object',
      fields: [
        defineField({
          name: 'website',
          type: 'array',
          title: 'Website Packages',
          of: [{ type: 'pricingPackage' }],
        }),
        defineField({
          name: 'software',
          type: 'array',
          title: 'Software Packages',
          of: [{ type: 'pricingPackage' }],
        }),
        defineField({
          name: 'printing',
          type: 'array',
          title: 'Printing Packages',
          of: [{ type: 'pricingPackage' }],
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      fields: [
        defineField({
          name: 'website',
          type: 'array',
          title: 'Website FAQ',
          of: [{ type: 'faqItem' }],
        }),
        defineField({
          name: 'software',
          type: 'array',
          title: 'Software FAQ',
          of: [{ type: 'faqItem' }],
        }),
        defineField({
          name: 'printing',
          type: 'array',
          title: 'Printing FAQ',
          of: [{ type: 'faqItem' }],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'SEO Settings',
      };
    },
  },
});
