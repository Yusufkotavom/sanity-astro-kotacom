# Astro Rocket x Sanity Schema Audit

Tanggal: 2026-05-13
Scope: cek kecocokan block schema Sanity `page.blocks[]` terhadap komponen di `web` (Astro Rocket).

## Ringkasan
- Baseline `web` sudah diganti ke Astro Rocket.
- Layer Sanity dasar sudah ditambahkan (`src/lib/sanity/client.ts`, `src/lib/sanity/queries.ts`, `src/pages/api/sanity-check.json.ts`).
- Hasil audit: sebagian block bisa direct-map, sebagian perlu adapter komposisi, sebagian perlu komponen baru.

## Matrix Kecocokan Block

| Block Sanity | Status | Catatan Mapping ke Astro Rocket |
|---|---|---|
| `hero-1` | direct | bisa map ke `components/hero/Hero.astro` (layout centered/split) |
| `hero-2` | direct | sama seperti `hero-1`, beda preset style |
| `stats-hero-block` | adapter | compose `Hero` + `landing/Credibility.astro` atau `patterns/StatCard.astro` |
| `section-header` | adapter | compose dari heading section + token utility Rocket |
| `split-row` | adapter | compose grid 2 kolom + sub-item split |
| `grid-row` | adapter | compose dengan `ui/data-display/Card` |
| `carousel-1` | new | belum ada carousel siap pakai di Rocket, perlu komponen baru |
| `carousel-2` | new | idem |
| `timeline-row` | adapter | compose dari list + card (opsional vertical line CSS) |
| `cta-1` | direct | map ke `landing/CTA.astro` / `ui/marketing/CTA/CTA.astro` |
| `whatsapp-cta` | adapter | CTA variant khusus WA |
| `logo-cloud-1` | adapter | bisa leverage `ui/marketing/SocialProof` |
| `faqs` | adapter | map ke `ui/overlay/Accordion/Accordion.astro` |
| `form-newsletter` | direct | map ke `patterns/NewsletterForm.astro` |
| `all-posts` | direct | map list dari post query + `blog/BlogCard.astro` |
| `legacy-rich-content` | adapter | render PortableText/HTML fallback |
| `company-info` | adapter | section info perusahaan + card |
| `testimonials-block` | adapter | map ke cards/quotes |
| `pricing-block` | adapter | map ke cards/table |
| `faq-block` | adapter | map ke accordion (mirip `faqs`) |
| `benefits-block` | adapter | map ke list cards dengan icon |
| `features-package-block` | adapter | map ke grouped feature cards |
| `service-types-block` | adapter | map ke cards + label |
| `problem-solution-block` | adapter | 2 kolom problem/solution cards |
| `value-props-block` | adapter | map ke value cards |

## Kesimpulan Teknis
- **Direct-ready (cepat):** `hero-1`, `hero-2`, `cta-1`, `form-newsletter`, `all-posts`.
- **Perlu adapter ringan:** mayoritas block berbasis card/list/content sections.
- **Perlu komponen baru:** `carousel-1`, `carousel-2`.

## Rekomendasi Urutan Implementasi
1. Implement renderer untuk block direct-ready dulu.
2. Lanjut adapter ringan (FAQ, logo cloud, grid/split, SEO sections).
3. Terakhir buat komponen carousel custom.
