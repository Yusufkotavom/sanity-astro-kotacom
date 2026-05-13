import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2026-03-23',
  token: process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN,
});

async function run() {
  const docs = await client.fetch(`*[_type=="project" && projectType in ["Website", "Software", "website", "software"]]{
    _id, title, previewUrl, repositoryUrl, projectType,
    "hasImage": defined(image),
    "excerptLen": length(excerpt),
    "descLen": length(pt::text(body))
  }`);
  
  const toFix = docs.filter(d => !d.hasImage || (!d.excerptLen && !d.descLen));
  console.log(`Found ${toFix.length} docs to fix using fast OG scraper...`);

  for (const doc of toFix) {
    const url = doc.previewUrl || doc.repositoryUrl;
    if (!url) continue;
    
    console.log(`\nFetching ${url} for ${doc.title}...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Bot' } });
      clearTimeout(timeoutId);
      
      const html = await res.text();
      
      let imageUrl = '';
      const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) 
                    || html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/i);
      if (imgMatch) imageUrl = imgMatch[1];
      if (imageUrl && !imageUrl.startsWith('http')) imageUrl = new URL(imageUrl, url).toString();

      let excerpt = '';
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)
                     || html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
      if (descMatch) excerpt = descMatch[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

      // Use basic defaults
      if (!excerpt) excerpt = `A high-quality open-source ${doc.projectType} resource exploring modern workflows.`;
      
      // Patch sanity
      let patch = client.patch(doc._id).set({ excerpt: excerpt.substring(0, 300) });
      
      if (imageUrl && !doc.hasImage) {
        try {
          console.log(`  Downloading image: ${imageUrl}`);
          const imgRes = await fetch(imageUrl);
          const buffer = await imgRes.arrayBuffer();
          const asset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: `og-image-${doc._id}.jpg`
          });
          patch = patch.set({
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: asset._id }
            }
          });
          console.log('  ✅ Attached image');
        } catch (e) {
          console.error(`  ❌ Failed image download for ${doc.title}`);
        }
      }
      
      await patch.commit();
      console.log(`  ✅ Patched metadata: ${doc.title}`);
      
    } catch (err) {
      console.error(`  ❌ Fetch error for ${doc.title}`, err.message);
      // Let's at least patch with a default excerpt so it isn't blank
      await client.patch(doc._id).set({ excerpt: `A highly-recommended ${doc.projectType} template to accelerate your next Kotacom project.` }).commit();
      console.log(`  ✅ Added fallback excerpt for ${doc.title}`);
    }
  }
}
run();
