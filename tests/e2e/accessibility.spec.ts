import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Locator, type Page } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

async function tabTo(page: Page, target: Locator, key = "Tab") {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await target.evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press(key);
  }
  await expect(target).toBeFocused();
}

for (const route of ["homepage", "product detail"] as const) {
  test(`${route} has no serious or critical WCAG 2.1 AA violations`, async ({ page, request }, testInfo) => {
    const catalogResponse = await request.get("/search-products.json");
    expect(catalogResponse.ok()).toBeTruthy();
    const catalog: { name: string; slug: string }[] = await catalogResponse.json();
    expect(catalog.length).toBeGreaterThan(0);
    const product = catalog[0];

    const hydrated = page.waitForResponse((response) =>
      new URL(response.url()).pathname === "/search-products.json");
    await page.goto(route === "homepage" ? "/" : `/products/${encodeURIComponent(product.slug)}`);
    await hydrated;
    await expect(page.getByRole("main")).toBeVisible();
    if (route === "product detail") {
      await expect(page.getByRole("heading", { level: 1, name: product.name, exact: true })).toBeVisible();
    }
    await page.evaluate(() => document.fonts.ready.then(() => undefined));

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-results", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });
    // Contrast failures are serious in axe, so include them with critical failures.
    const violations = results.violations.filter(({ impact }) =>
      impact === "critical" || impact === "serious");
    const summary = violations.map(({ id, impact, nodes }) => ({
      id, impact, elements: nodes.map(({ html, failureSummary }) => ({ html, failureSummary })),
    }));
    expect(violations.length, JSON.stringify(summary, null, 2)).toBe(0);
  });
}

test("navbar and command menu work using only the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard navigation runs in Desktop Chrome; mobile uses touch navigation");
  const catalogLoaded = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/search-products.json");
  await page.goto("/");
  const catalogResponse = await catalogLoaded;
  expect(catalogResponse.ok()).toBeTruthy();
  const catalog: { name: string; slug: string }[] = await catalogResponse.json();
  expect(catalog.length).toBeGreaterThan(0);
  const product = catalog[0];

  const navbar = page.getByRole("navigation");
  const search = navbar.getByRole("button", { name: "Search products", exact: true });
  await tabTo(page, search);
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Search Anjanadri products" });
  const input = dialog.getByRole("combobox");
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close search", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(search).toBeFocused();

  const shop = page.getByRole("link", { name: "Shop All", exact: true });
  await tabTo(page, shop, "Shift+Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#shop$/);

  await page.keyboard.press("Meta+k");
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await page.keyboard.type(product.name);
  const result = dialog.getByRole("option").filter({
    has: page.getByText(product.name, { exact: true }),
  });
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(`/products/${encodeURIComponent(product.slug)}`);
  await expect(page.getByRole("heading", { level: 1, name: product.name, exact: true })).toBeVisible();
});
