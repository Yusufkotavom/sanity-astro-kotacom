import fs from 'fs';
import { createClient } from '@sanity/client';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function importTemplate() {
  const token = process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN;
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    useCdn: false,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2026-03-23',
    token: token,
  });

  const inputFile = process.argv[2] || '/tmp/all_templates.json';
  const templates = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  
  console.log(`Loaded ${templates.length} templates from ${inputFile}. Starting import...`);
  
  for (const data of templates) {
    if(!data.title) continue;
    console.log(`\\n--- Importing: ${data.title} ---`);
    
    // 1. Check Categories
    const categoryRefs = [];
    for (const catName of data.categories) {
      const slug = catName.toLowerCase().replace(/\\s+/g, '-');
      let cat = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
      
      if (!cat) {
        console.log(`Creating category: ${catName}`);
      cat = await client.create({
        _type: 'category',
        title: catName,
        slug: { current: slug }
      });
    }
    
    categoryRefs.push({
      _type: 'reference',
      _ref: cat._id,
      _key: cat._id
    });
  }
  
  // 2. Upload Image
  let asset = null;
  if (data.imageUrl) {
    console.log(`Downloading image: ${data.imageUrl}`);
    try {
      const imageRes = await fetch(data.imageUrl);
      const imageBuffer = await imageRes.arrayBuffer();
      
      console.log('Uploading image to Sanity...');
      asset = await client.assets.upload('image', Buffer.from(imageBuffer), {
        filename: data.imageUrl.split('/').pop() || 'template-image.jpg'
      });
    } catch(e) {
      console.log('Failed fetching image, skipping image upload:', e.message);
    }
  }
  
  // Function to recursively add _key to array items
  const addKeys = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === 'object' && item !== null) {
          const newItem = { ...item, _key: crypto.randomUUID() };
          // Traverse children too
          for (const key in newItem) {
            newItem[key] = addKeys(newItem[key]);
          }
          return newItem;
        }
        return item;
      });
    } else if (typeof data === 'object' && data !== null) {
      const newObj = {};
      for (const key in data) {
        newObj[key] = addKeys(data[key]);
      }
      return newObj;
    }
    return data;
  };

  const projectSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const doc = {
    _type: 'project',
    title: data.title,
    slug: { current: projectSlug },
    excerpt: data.excerpt,
    projectType: data.projectType,
    previewUrl: data.previewUrl,
    body: addKeys(data.body),
    categories: categoryRefs,
    featured: false
  };

  if (asset) {
    doc.image = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    };
  }
  
    console.log(`Creating project document...`);
    const result = await client.create(doc);
    
    console.log(`✅ Success! Created project: ${result._id}`);
  } // end loop
}

importTemplate().catch(console.error);
