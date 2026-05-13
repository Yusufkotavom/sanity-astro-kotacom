import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  useCdn: false,
});

async function createPosts() {
  console.log('Creating 10 posts...');

  const posts = [
    {
      title: 'Panduan Lengkap Memilih Jasa Kontraktor Terpercaya',
      excerpt: 'Tips dan trik memilih kontraktor yang tepat untuk proyek konstruksi Anda.',
    },
    {
      title: '10 Tren Desain Interior Modern 2026',
      excerpt: 'Desain interior terkini yang akan mendominasi tahun ini.',
    },
    {
      title: 'Cara Menghitung RAB Bangunan dengan Akurat',
      excerpt: 'Panduan praktis menghitung Rencana Anggaran Biaya untuk proyek konstruksi.',
    },
    {
      title: 'Material Bangunan Ramah Lingkungan untuk Rumah Modern',
      excerpt: 'Pilihan material eco-friendly yang berkualitas tinggi.',
    },
    {
      title: 'Renovasi Rumah: Dari Perencanaan hingga Eksekusi',
      excerpt: 'Langkah-langkah penting dalam merenovasi rumah Anda.',
    },
    {
      title: 'Desain Rumah Minimalis: Konsep dan Implementasi',
      excerpt: 'Cara menciptakan rumah minimalis yang fungsional dan estetis.',
    },
    {
      title: 'Tips Memaksimalkan Ruang Kecil di Rumah',
      excerpt: 'Solusi cerdas untuk mengoptimalkan ruang terbatas.',
    },
    {
      title: 'Perbandingan Harga Material Bangunan 2026',
      excerpt: 'Update harga material konstruksi terkini di pasaran.',
    },
    {
      title: 'Cara Merawat Bangunan agar Awet dan Tahan Lama',
      excerpt: 'Maintenance rutin yang perlu dilakukan untuk menjaga kualitas bangunan.',
    },
    {
      title: 'Inspirasi Desain Taman Rumah yang Asri',
      excerpt: 'Ide-ide kreatif untuk menciptakan taman impian di rumah Anda.',
    },
  ];

  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    try {
      const doc = await client.create({
        _type: 'post',
        title: post.title,
        slug: {
          _type: 'slug',
          current: post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        },
        excerpt: post.excerpt,
        body: [
          {
            _type: 'block',
            _key: `block-${Date.now()}-${i}`,
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: `span-${Date.now()}-${i}`,
                text: post.excerpt,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      });

      results.push(doc);
      console.log(`✓ Created: ${post.title} (${doc._id})`);
    } catch (error) {
      console.error(`✗ Failed to create: ${post.title}`, error.message);
    }
  }

  console.log(`\nDone! Created ${results.length} posts.`);
  return results;
}

createPosts().catch(console.error);
