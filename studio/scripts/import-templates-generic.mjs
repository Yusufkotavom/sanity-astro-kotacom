import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2026-03-23',
  token: process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN,
});

// Recursive _key injector
const addKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const newItem = { ...item, _key: crypto.randomUUID() };
        for (const key in newItem) newItem[key] = addKeys(newItem[key]);
        return newItem;
      }
      return item;
    });
  } else if (typeof data === 'object' && data !== null) {
    const newObj = {};
    for (const key in data) newObj[key] = addKeys(data[key]);
    return newObj;
  }
  return data;
};

async function importTemplates(inputFile) {
  const templates = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`Loaded ${templates.length} templates from ${inputFile}.`);

  for (const data of templates) {
    if (!data.title) continue;
    console.log(`\nImporting: ${data.title}`);

    // Categories
    const categoryRefs = [];
    for (const catName of (data.categories || [])) {
      const slug = catName.toLowerCase().replace(/\s+/g, '-');
      let cat = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
      if (!cat) {
        cat = await client.create({ _type: 'category', title: catName, slug: { current: slug } });
        console.log(`  Created category: ${catName}`);
      }
      categoryRefs.push({ _type: 'reference', _ref: cat._id, _key: cat._id });
    }

    // Image upload
    let asset = null;
    if (data.imageUrl) {
      try {
        const imageRes = await fetch(data.imageUrl);
        const imageBuffer = await imageRes.arrayBuffer();
        asset = await client.assets.upload('image', Buffer.from(imageBuffer), {
          filename: data.imageUrl.split('/').pop() || 'template.jpg'
        });
      } catch (e) {
        console.log(`  Image failed: ${e.message}`);
      }
    }

    const projectSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const doc = {
      _type: 'project',
      title: data.title,
      slug: { current: projectSlug },
      excerpt: data.excerpt || '',
      projectType: data.projectType || 'website',
      previewUrl: data.previewUrl || '',
      repositoryUrl: data.repositoryUrl || '',
      body: addKeys(data.body || []),
      categories: categoryRefs,
      featured: false,
      meta: { noindex: true }, // All imported templates are noindex by default
    };

    if (asset) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    }

    // Check for duplicate slug
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug: projectSlug });
    if (existing) {
      console.log(`  ⚠️  Skipped (already exists): ${projectSlug}`);
      continue;
    }

    const result = await client.create(doc);
    console.log(`  ✅ Created: ${result._id}`);
  }

  console.log('\nImport complete!');
}

const inputFile = process.argv[2] || '/tmp/templates.json';
importTemplates(inputFile).catch(console.error);
