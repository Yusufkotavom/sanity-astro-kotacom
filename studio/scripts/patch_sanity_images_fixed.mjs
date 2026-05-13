import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = createClient({
  projectId: 'b017f7tl',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-03-23',
  token: process.env.SANITY_DEV
});

async function run() {
  const data = JSON.parse(fs.readFileSync('/tmp/fixed_docs_data.json', 'utf8'));
  console.log(`Patching ${data.length} documents...`);
  
  for (const doc of data) {
    try {
      let patch = client.patch(doc._id).set({ excerpt: doc.excerpt });
      
      if (fs.existsSync(doc.screenshot)) {
        const imageBuffer = fs.readFileSync(doc.screenshot);
        const asset = await client.assets.upload('image', imageBuffer, {
          filename: `screenshot-${doc._id}.png`,
        });
        patch = patch.set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            }
          }
        });
      }
      
      await patch.commit();
      console.log(`✅ Patched: ${doc.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${doc.title}`, err.message);
    }
  }
}
run();
