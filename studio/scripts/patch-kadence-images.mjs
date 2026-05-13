import fs from 'fs';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

async function patchImages() {
  const token = process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN;
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    useCdn: false,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2026-03-23',
    token: token,
  });

  const templates = JSON.parse(fs.readFileSync('/tmp/kadence_data_with_images.json', 'utf-8'));
  console.log(`Loaded ${templates.length} templates with images.`);

  for (const data of templates) {
    if (!data.title || !data.imageUrl) continue;
    
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Find existing document by slug
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug });
    
    if (!existing) {
      console.log(`⚠️  No document found for slug: ${slug}`);
      continue;
    }

    // Download + upload new image
    try {
      console.log(`Updating image for: ${data.title}`);
      const imageRes = await fetch(data.imageUrl);
      const imageBuffer = await imageRes.arrayBuffer();
      
      const asset = await client.assets.upload('image', Buffer.from(imageBuffer), {
        filename: data.imageUrl.split('/').pop() || 'template-image.jpg'
      });
      
      await client.patch(existing._id).set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        }
      }).commit();
      
      console.log(`  ✅ Updated: ${existing._id}`);
    } catch(e) {
      console.log(`  ❌ Error for ${data.title}: ${e.message}`);
    }
  }
  
  console.log('\nDone patching images!');
}

patchImages().catch(console.error);
