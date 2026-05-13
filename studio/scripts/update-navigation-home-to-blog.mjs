#!/usr/bin/env node

/**
 * Script to replace "Home" link with "Blog" link in navigation
 * Task 8: Replace "Home" link in navigation with valuable content link
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token: process.env.SANITY_DEV || process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2025-08-15',
  useCdn: false,
});

async function updateNavigation() {
  console.log('🔍 Fetching current navigation...');
  
  const navigation = await client.fetch('*[_type == "navigation"][0]');
  
  if (!navigation) {
    console.error('❌ No navigation document found');
    process.exit(1);
  }

  console.log('📋 Current navigation links:', navigation.links.length);
  
  // Find the Home link and Blog link
  const homeLink = navigation.links.find(link => link.title === 'Home');
  const blogLink = navigation.links.find(link => link.title === 'Blog');
  
  if (!homeLink) {
    console.log('⚠️  No "Home" link found in navigation');
  } else {
    console.log('✓ Found "Home" link:', homeLink._key);
  }
  
  if (!blogLink) {
    console.log('⚠️  No "Blog" link found in navigation');
  } else {
    console.log('✓ Found "Blog" link:', blogLink._key, '(showInHeader:', blogLink.showInHeader + ')');
  }

  // Update the navigation
  const updatedLinks = navigation.links.map(link => {
    // Hide the Home link
    if (link.title === 'Home') {
      console.log('🔄 Hiding "Home" link');
      return {
        ...link,
        showInHeader: false,
      };
    }
    // Show the Blog link
    if (link.title === 'Blog') {
      console.log('🔄 Showing "Blog" link');
      return {
        ...link,
        showInHeader: true,
      };
    }
    return link;
  });

  console.log('\n📝 Updating navigation document...');
  
  await client
    .patch(navigation._id)
    .set({ links: updatedLinks })
    .commit();

  console.log('✅ Navigation updated successfully!');
  console.log('\nChanges:');
  console.log('  - "Home" link: showInHeader = false (hidden)');
  console.log('  - "Blog" link: showInHeader = true (visible)');
}

updateNavigation().catch((error) => {
  console.error('❌ Error updating navigation:', error);
  process.exit(1);
});
