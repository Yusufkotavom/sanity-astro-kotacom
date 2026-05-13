# Sanity -> Astro Rocket Mapping Plan

Tanggal: 2026-05-13
Repo: `/home/ubuntu/sanity-astro-kotacom`

## Tujuan
Memetakan block schema Sanity (`studio/schemas/blocks/*`) ke komponen Astro Rocket (`web/src/components/*`) secara bertahap dan terverifikasi.

## Status Saat Ini

### Sudah aktif (implemented)
- `hero-1` -> `Hero`
- `hero-2` -> `Hero`
- `cta-1` -> section CTA + `Button`
- `form-newsletter` -> `NewsletterForm`
- `all-posts` -> list post + `BlogCard`

Lokasi implementasi aktif:
- `web/src/components/sanity/SanityBlockRenderer.astro`
- `web/src/pages/s/[slug].astro`

### Belum aktif (masih fallback)
- `stats-hero-block`
- `section-header`
- `split-row`
- `grid-row`
- `carousel-1`
- `carousel-2`
- `timeline-row`
- `whatsapp-cta`
- `logo-cloud-1`
- `faqs`
- `legacy-rich-content`
- `company-info`
- `testimonials-block`
- `pricing-block`
- `faq-block`
- `benefits-block`
- `features-package-block`
- `service-types-block`
- `problem-solution-block`
- `value-props-block`

## Strategy Mapping

### Phase 1 (quick wins - adapter ringan)
Target: meminimalkan fallback dengan adapter berbasis komponen Rocket yang sudah ada.
- `section-header`
- `faqs`
- `logo-cloud-1`
- `grid-row`
- `split-row`
- `timeline-row`
- `whatsapp-cta`
- `stats-hero-block`

### Phase 2 (SEO section adapters)
Target: semua SEO blocks minimal bisa render semantik dengan style Rocket.
- `company-info`
- `testimonials-block`
- `pricing-block`
- `faq-block`
- `benefits-block`
- `features-package-block`
- `service-types-block`
- `problem-solution-block`
- `value-props-block`

### Phase 3 (custom components required)
Target: block yang butuh UI baru (belum ada padanan di Rocket).
- `carousel-1`
- `carousel-2`
- `legacy-rich-content` (jika ingin rich renderer penuh)

## Acceptance Criteria per Phase
- Build `web` sukses (`pnpm build:web`)
- Route `/s/[slug]` merender block tanpa crash
- Block yang belum final tetap punya fallback aman (tidak blank)

## Catatan Teknis
- Route Sanity page saat ini di `/s/[slug]` dengan `prerender = false`.
- Query Sanity dasar ada di `web/src/lib/sanity/queries.ts`.
- Health check ada di `/api/sanity-check.json`.
