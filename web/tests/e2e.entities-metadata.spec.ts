import { expect, test } from "@playwright/test";

test("service page metadata is rendered", async ({ page }) => {
  await page.goto("/services/service-e2e-sanity");

  await expect(page.getByRole("heading", { level: 1, name: "Service E2E Sanity" }).first()).toBeVisible();
  await expect(page.locator("text=Service seed untuk test e2e metadata.")).toBeVisible();
  await expect(page).toHaveTitle(/Service E2E Sanity/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Metadata SEO service untuk validasi e2e\./i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Service E2E Sanity/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/services\/service-e2e-sanity$/);
});

test("project page metadata is rendered", async ({ page }) => {
  await page.goto("/projects/sanity/project-e2e-sanity");

  await expect(page.getByRole("heading", { level: 1, name: "Project E2E Sanity" }).first()).toBeVisible();
  await expect(page.locator("text=Project seed untuk test e2e metadata.")).toBeVisible();
  await expect(page).toHaveTitle(/Project E2E Sanity/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Metadata SEO project untuk validasi e2e\./i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Project E2E Sanity/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/sanity\/project-e2e-sanity$/);
});

test("blog post page metadata is rendered", async ({ page }) => {
  await page.goto("/blog/post-e2e-sanity");

  await expect(page.getByRole("heading", { level: 1, name: "Post E2E Sanity" }).first()).toBeVisible();
  await expect(page.locator("text=Post seed untuk test e2e metadata.")).toBeVisible();
  await expect(page).toHaveTitle(/Post E2E Sanity/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Metadata SEO post untuk validasi e2e\./i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Post E2E Sanity/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/blog\/post-e2e-sanity$/);
});

test("sanity redirect routes old path to destination", async ({ page }) => {
  await page.goto("/redirect-e2e-old");
  await expect(page).toHaveURL(/\/products\/produk-e2e-sanity$/);
  await expect(page.locator("text=Produk E2E Sanity").first()).toBeVisible();
});
