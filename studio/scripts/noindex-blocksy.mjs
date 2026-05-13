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

// Check "website" type projects - likely Blocksy imports
const websiteDocs = await client.fetch(
  `*[_type == "project" && projectType == "website"]{_id, title, previewUrl}[0...5]`
);
const websiteCount = await client.fetch(
  `count(*[_type == "project" && projectType == "website"])`
);

console.log(`Total "website" type: ${websiteCount}`);
console.log('Sample titles:');
websiteDocs.forEach(d => console.log(`  - ${d.title} | preview: ${d.previewUrl || 'none'}`));

// Now set noindex on ALL "website" type projects (Blocksy templates)
if (websiteCount > 0) {
  console.log(`\nSetting noindex on ${websiteCount} "website" type docs...`);
  const allWebsite = await client.fetch(
    `*[_type == "project" && projectType == "website"]{_id, title}`
  );
  for (const doc of allWebsite) {
    await client.patch(doc._id).set({ 'meta.noindex': true }).commit();
    console.log(`  ✅ ${doc.title}`);
  }
  console.log(`\nDone! ${allWebsite.length} Blocksy-type docs set to noindex.`);
}
