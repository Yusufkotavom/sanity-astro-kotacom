import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  apiVersion: '2026-03-23',
  token: process.env.SANITY_DEV
});

async function run() {
  const docs = await client.fetch('*[_type=="project"]{_id, projectType}');
  console.log(`Checking ${docs.length} docs`);
  for (const doc of docs) {
    if (doc.projectType && doc.projectType !== doc.projectType.toLowerCase()) {
      await client.patch(doc._id).set({ projectType: doc.projectType.toLowerCase() }).commit();
      console.log(`Patched ${doc._id} projectType to lowercase.`);
    }
  }
}
run();
