import { expect, test } from "@playwright/test";

test("product page renders and metadata is present", async ({ page }) => {
  await page.goto("/products/produk-e2e-sanity");

  await expect(page.getByRole("heading", { level: 1, name: "Produk E2E Sanity" }).first()).toBeVisible();
  await expect(page.locator("text=Produk seed untuk test e2e dan metadata SEO.")).toBeVisible();

  await expect(page).toHaveTitle(/Produk E2E Sanity/i);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute("content", /Metadata SEO produk untuk validasi e2e\./i);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", /Produk E2E Sanity/i);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /\/products\/produk-e2e-sanity$/);

  const whatsappLinks = page.locator('a[href*="wa.me/6285799520350"]');
  await expect(whatsappLinks.first()).toBeVisible();
});
