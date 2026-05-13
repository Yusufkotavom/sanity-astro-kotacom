#!/usr/bin/env node
/**
 * Add SEO blocks to money pages
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from studio
dotenv.config({ path: join(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b017f7tl',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-04-06',
  token: process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

// Page configurations
const PAGE_CONFIGS = {
  'pembuatan-website': {
    slug: 'pembuatan-website',
    blocks: [
      {
        _key: 'pricing-website',
        _type: 'pricing-block',
        title: 'Paket Harga Website',
        description: 'Pilih paket pembuatan website yang sesuai dengan kebutuhan bisnis Anda',
        category: 'website',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
      {
        _key: 'faq-website',
        _type: 'faq-block',
        title: 'Pertanyaan Seputar Pembuatan Website',
        description: 'Temukan jawaban untuk pertanyaan umum tentang layanan pembuatan website kami',
        category: 'website',
        padding: { top: true, bottom: true },
        colorVariant: 'muted',
      },
      {
        _key: 'testimonials-website',
        _type: 'testimonials-block',
        title: 'Testimoni Klien Website',
        description: 'Lihat hasil kerja kami dari klien yang telah menggunakan layanan pembuatan website',
        category: '',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
    ],
  },
  'software': {
    slug: 'software',
    blocks: [
      {
        _key: 'pricing-software',
        _type: 'pricing-block',
        title: 'Paket Harga Software',
        description: 'Pilih paket pengembangan software yang sesuai dengan kebutuhan bisnis Anda',
        category: 'software',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
      {
        _key: 'faq-software',
        _type: 'faq-block',
        title: 'Pertanyaan Seputar Software Development',
        description: 'Temukan jawaban untuk pertanyaan umum tentang layanan pengembangan software kami',
        category: 'software',
        padding: { top: true, bottom: true },
        colorVariant: 'muted',
      },
      {
        _key: 'testimonials-software',
        _type: 'testimonials-block',
        title: 'Testimoni Klien Software',
        description: 'Lihat hasil kerja kami dari klien yang telah menggunakan layanan software development',
        category: '',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
    ],
  },
  'percetakan': {
    slug: 'percetakan',
    blocks: [
      {
        _key: 'pricing-printing',
        _type: 'pricing-block',
        title: 'Paket Harga Percetakan',
        description: 'Pilih paket percetakan yang sesuai dengan kebutuhan promosi dan operasional Anda',
        category: 'printing',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
      {
        _key: 'faq-printing',
        _type: 'faq-block',
        title: 'Pertanyaan Seputar Percetakan',
        description: 'Temukan jawaban untuk pertanyaan umum tentang layanan percetakan kami',
        category: 'printing',
        padding: { top: true, bottom: true },
        colorVariant: 'muted',
      },
      {
        _key: 'testimonials-printing',
        _type: 'testimonials-block',
        title: 'Testimoni Klien Percetakan',
        description: 'Lihat hasil kerja kami dari klien yang telah menggunakan layanan percetakan',
        category: '',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
    ],
  },
  'services': {
    slug: 'services',
    blocks: [
      {
        _key: 'company-info-services',
        _type: 'company-info',
        title: 'Tentang Kotacom',
        description: 'Partner terpercaya untuk solusi IT dan percetakan di Surabaya sejak 2015',
        padding: { top: true, bottom: true },
        colorVariant: 'muted',
      },
      {
        _key: 'testimonials-services',
        _type: 'testimonials-block',
        title: 'Apa Kata Klien Kami',
        description: 'Testimoni nyata dari berbagai klien yang telah merasakan hasil kerja sama dengan Kotacom',
        category: '',
        padding: { top: true, bottom: true },
        colorVariant: 'background',
      },
    ],
  },
};

async function addBlocksToPage(slug, blocks) {
  console.log(`\n📄 Processing page: /${slug}`);
  
  // Check if page exists
  const existingPage = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug }
  );

  if (!existingPage) {
    console.log(`   ⚠️  Page not found, creating new page...`);
    
    // Create new page
    const newPage = await client.create({
      _type: 'page',
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: { _type: 'slug', current: slug },
      blocks: blocks,
      topBlockCount: 0,
    });
    
    console.log(`   ✅ Created new page with ${blocks.length} SEO blocks`);
    return newPage;
  }

  // Page exists, append blocks
  const existingBlocks = existingPage.blocks || [];
  const existingBlockKeys = new Set(existingBlocks.map(b => b._key));
  
  // Filter out blocks that already exist
  const newBlocks = blocks.filter(b => !existingBlockKeys.has(b._key));
  
  if (newBlocks.length === 0) {
    console.log(`   ℹ️  All SEO blocks already exist, skipping...`);
    return existingPage;
  }

  // Append new blocks
  const updatedBlocks = [...existingBlocks, ...newBlocks];
  
  const result = await client
    .patch(existingPage._id)
    .set({ blocks: updatedBlocks })
    .commit();

  console.log(`   ✅ Added ${newBlocks.length} new SEO blocks (total: ${updatedBlocks.length})`);
  newBlocks.forEach(block => {
    console.log(`      - ${block._type} (${block._key})`);
  });
  
  return result;
}

async function main() {
  console.log('🚀 Adding SEO blocks to money pages...\n');

  try {
    // Test connection
    console.log('🔌 Testing Sanity connection...');
    await client.fetch('*[_type == "page"][0...1]{_id}');
    console.log('✅ Connected to Sanity\n');

    // Process each page
    const results = [];
    for (const [pageName, config] of Object.entries(PAGE_CONFIGS)) {
      const result = await addBlocksToPage(config.slug, config.blocks);
      results.push({ page: pageName, result });
    }

    console.log('\n✨ SEO blocks added successfully!\n');
    console.log('📊 Summary:');
    results.forEach(({ page, result }) => {
      console.log(`   - /${page}: ✅`);
    });

    console.log('\n🎯 Next steps:');
    console.log('   1. Open Sanity Studio and verify the blocks');
    console.log('   2. Adjust block order if needed');
    console.log('   3. Customize titles/descriptions per page');
    console.log('   4. Update WhatsApp settings (phone: 6285799520350)');
    console.log('   5. Test on staging environment');
    console.log('   6. Deploy to production');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
