import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  useCdn: false,
});

async function deleteOldPosts() {
  console.log('Deleting old posts...');
  
  const query = '*[_type == "post"]';
  const posts = await client.fetch(query);
  
  for (const post of posts) {
    await client.delete(post._id);
    console.log(`✓ Deleted: ${post.title}`);
  }
  
  console.log(`Deleted ${posts.length} old posts.\n`);
}

async function createFullPosts() {
  console.log('Creating 10 full posts with legacy-rich-content...\n');

  const articlesDir = path.join(__dirname, 'articles');
  const articles = [
    {
      file: 'article-1.md',
      title: 'Panduan Lengkap Memilih Jasa Kontraktor Terpercaya',
      excerpt: 'Tips dan trik memilih kontraktor yang tepat untuk proyek konstruksi Anda.',
    },
    {
      file: 'article-2.md',
      title: '10 Tren Desain Interior Modern 2026',
      excerpt: 'Desain interior terkini yang akan mendominasi tahun ini.',
    },
    {
      file: 'article-3.md',
      title: 'Cara Menghitung RAB Bangunan dengan Akurat',
      excerpt: 'Panduan praktis menghitung Rencana Anggaran Biaya untuk proyek konstruksi.',
    },
    {
      file: 'article-4.md',
      title: 'Material Bangunan Ramah Lingkungan untuk Rumah Modern',
      excerpt: 'Pilihan material eco-friendly yang berkualitas tinggi.',
    },
    {
      file: 'article-5.md',
      title: 'Renovasi Rumah: Dari Perencanaan hingga Eksekusi',
      excerpt: 'Langkah-langkah penting dalam merenovasi rumah Anda.',
    },
    {
      file: 'article-6.md',
      title: 'Desain Rumah Minimalis: Konsep dan Implementasi',
      excerpt: 'Cara menciptakan rumah minimalis yang fungsional dan estetis.',
    },
    {
      file: 'article-7.md',
      title: 'Tips Memaksimalkan Ruang Kecil di Rumah',
      excerpt: 'Solusi cerdas untuk mengoptimalkan ruang terbatas.',
    },
    {
      file: 'article-8.md',
      title: 'Perbandingan Harga Material Bangunan 2026',
      excerpt: 'Update harga material konstruksi terkini di pasaran.',
    },
    {
      file: 'article-9.md',
      title: 'Cara Merawat Bangunan agar Awet dan Tahan Lama',
      excerpt: 'Maintenance rutin yang perlu dilakukan untuk menjaga kualitas bangunan.',
    },
    {
      file: 'article-10.md',
      title: 'Inspirasi Desain Taman Rumah yang Asri',
      excerpt: 'Ide-ide kreatif untuk menciptakan taman impian di rumah Anda.',
    },
  ];

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const filePath = path.join(articlesDir, article.file);
    
    try {
      // Read markdown content
      const markdownContent = fs.readFileSync(filePath, 'utf-8');
      
      const doc = await client.create({
        _type: 'post',
        title: article.title,
        slug: {
          _type: 'slug',
          current: article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        },
        excerpt: article.excerpt,
        pageBlocks: [
          {
            _type: 'legacy-rich-content',
            _key: `legacy-${Date.now()}-${i}`,
            title: article.title,
            excerpt: article.excerpt,
            contentFormat: 'markdown',
            contentRaw: markdownContent,
          },
        ],
      });

      results.push(doc);
      console.log(`✓ Created: ${article.title}`);
      console.log(`  ID: ${doc._id}`);
      console.log(`  Content length: ${markdownContent.length} chars\n`);
    } catch (error) {
      console.error(`✗ Failed to create: ${article.title}`);
      console.error(`  Error: ${error.message}\n`);
    }
  }

  console.log(`\nDone! Created ${results.length} posts with full markdown content.`);
  return results;
}

async function main() {
  try {
    await deleteOldPosts();
    await createFullPosts();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
