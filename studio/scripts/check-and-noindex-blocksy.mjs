import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: 'b017f7tl',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-03-23',
  token: process.env.SANITY_DEV
});

// First check what projectTypes exist
const types = await client.fetch(`array::unique(*[_type=="project"].projectType)`);
console.log('Project types found:', types);

// Set noindex on all templates that are NOT "Kadence" (already done) — target Blocksy + any others
// We'll match Blocksy by looking for projectType == "Blocksy" or null/empty with those slugs
const blocksyDocs = await client.fetch(
  `*[_type == "project" && (projectType == "Blocksy" || projectType == "blocksy")]{_id, title, projectType}`
);
console.log(`\nFound ${blocksyDocs.length} Blocksy docs.`);

for (const doc of blocksyDocs) {
  await client.patch(doc._id).set({ 'meta.noindex': true }).commit();
  console.log(`  ✅ noindex: ${doc.title}`);
}

// Also catch any that imported with no type or generic type (from earlier blocksy import)
const unknownDocs = await client.fetch(
  `*[_type == "project" && !(projectType in ["Kadence","Blocksy","blocksy","portfolio","website","software","repository"]) && meta.noindex != true]{_id, title, projectType}`
);
console.log(`\nFound ${unknownDocs.length} untyped/other template docs without noindex.`);
for (const doc of unknownDocs) {
  console.log(`  - ${doc.title} (type: ${doc.projectType})`);
}
