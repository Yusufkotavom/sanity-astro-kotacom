import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

async function setNoIndex() {
  const token = process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN;
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    useCdn: false,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2026-03-23',
    token: token,
  });

  // Find all projects with projectType == "Kadence" (imported templates)
  const kadenceDocs = await client.fetch(
    `*[_type == "project" && projectType == "Kadence"]{_id, title}`
  );

  console.log(`Found ${kadenceDocs.length} Kadence template documents.`);

  for (const doc of kadenceDocs) {
    await client.patch(doc._id)
      .set({ 'meta.noindex': true })
      .commit();
    console.log(`  ✅ noindex set: ${doc.title} (${doc._id})`);
  }

  console.log(`\nDone! ${kadenceDocs.length} documents set to noindex=true.`);
  console.log('These will be excluded from sitemap automatically via GROQ filter.');
}

setNoIndex().catch(console.error);
