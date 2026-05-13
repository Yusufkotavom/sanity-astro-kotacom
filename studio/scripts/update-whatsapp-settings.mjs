#!/usr/bin/env node
/**
 * Update WhatsApp settings in Sanity
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

async function main() {
  console.log('🚀 Updating WhatsApp settings...\n');

  try {
    // Test connection
    console.log('🔌 Testing Sanity connection...');
    await client.fetch('*[_type == "settings"][0...1]{_id}');
    console.log('✅ Connected to Sanity\n');

    // Get settings document
    console.log('📝 Fetching settings document...');
    const settings = await client.fetch(`*[_type == "settings"][0]`);

    if (!settings) {
      console.log('⚠️  Settings document not found, creating...');
      const newSettings = await client.create({
        _type: 'settings',
        _id: 'settings',
        brandName: 'Kotacom',
        whatsApp: {
          enabled: true,
          phoneNumber: '6285799520350',
          predefinedText: 'Halo, saya ingin konsultasi tentang layanan Kotacom',
          ctaText: 'Chat via WhatsApp',
          enableAnimation: true,
        },
      });
      console.log('✅ Created settings with WhatsApp configuration\n');
      return newSettings;
    }

    // Update WhatsApp settings
    console.log('📱 Updating WhatsApp configuration...');
    const result = await client
      .patch(settings._id)
      .set({
        whatsApp: {
          enabled: true,
          phoneNumber: '6285799520350',
          predefinedText: 'Halo, saya ingin konsultasi tentang layanan Kotacom',
          ctaText: 'Chat via WhatsApp',
          enableAnimation: true,
        },
      })
      .commit();

    console.log('✅ WhatsApp settings updated successfully!\n');
    console.log('📊 Configuration:');
    console.log('   - Enabled: ✅');
    console.log('   - Phone: +62 857-9952-0350');
    console.log('   - Format: 6285799520350 (international, no +)');
    console.log('   - Animation: Enabled');
    console.log('   - CTA Text: "Chat via WhatsApp"');

    console.log('\n🎯 WhatsApp float button will now appear on all pages!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
