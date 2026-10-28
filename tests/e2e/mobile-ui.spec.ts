import { test, expect } from "@playwright/test";

test("mobile sticky cart, success toast, and stacked partner dashboard", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "Mobile Safari", "Mobile Safari only");

  const catalogResponse = await request.get("/search-products.json");
  expect(catalogResponse.ok()).toBeTruthy();
  const catalog: { name: string; slug: string }[] = await catalogResponse.json();
  expect(catalog.length).toBeGreaterThan(0);
  const product = catalog[0];

  await page.goto(`/products/${encodeURIComponent(product.slug)}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: product.name, exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const stickyCart = page.getByRole("complementary", { name: "Quick add to cart" });
  await expect(stickyCart).toBeVisible();
  await expect(stickyCart).toBeInViewport({ ratio: 1 });
  await expect.poll(() => stickyCart.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return Math.abs(rect.bottom - window.innerHeight) <= 1
      && rect.left >= 0 && rect.right <= window.innerWidth;
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);

  await stickyCart.getByRole("button", { name: `Add to Cart: 1 ${product.name}`, exact: true }).click();
  await expect(page.getByRole("region", { name: /^Notifications/ })
    .getByText(`Added to Cart: ${product.name}`, { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);

  // The partner dashboard is part of the homepage, below its product collection.
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const partner = page.getByRole("complementary", { name: "Featured from Rithvik Foods" });
  await partner.scrollIntoViewIfNeeded();
  await expect(partner.getByRole("heading", { name: "Rithvik Foods", exact: true })).toBeVisible();
  await expect(partner).toBeInViewport();

  const collectionHeading = page.getByRole("main")
    .getByRole("heading", { name: "Our Dehydrated Collection", exact: true });
  await expect.poll(async () => {
    const collectionBottom = await collectionHeading.evaluate((heading) =>
      heading.closest("section")!.getBoundingClientRect().bottom);
    const partnerBounds = await partner.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right, viewportWidth: window.innerWidth };
    });
    return partnerBounds.top >= collectionBottom
      && partnerBounds.left >= 0 && partnerBounds.right <= partnerBounds.viewportWidth;
  }).toBe(true);
  await expect.poll(() => page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
});
