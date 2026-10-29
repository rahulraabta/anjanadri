import { test, expect } from "@playwright/test";

interface CatalogProduct {
  name: string;
  category?: string;
}

test("category links and rapid filter changes update the product grid", async ({ page, isMobile }) => {
  test.setTimeout(isMobile ? 180_000 : 60_000);
  const response = await page.request.get("/search-products.json");
  expect(response.ok()).toBeTruthy();
  const catalog: CatalogProduct[] = await response.json();
  expect(catalog.length).toBeGreaterThan(0);
  const filterLog = page.waitForEvent("console", {
    predicate: (message) => message.text().startsWith("ProductGrid filtering"),
  });
  await page.goto("/");
  console.log("Raw product filter data:", await (await filterLog).args()[1].jsonValue());
  const shop = page.locator("#shop");
  const cards = shop.locator("article h3");
  const expectedNames = (category: string) => catalog
    .filter((product) => category === "All" || product.category?.trim().toLowerCase() === category.toLowerCase())
    .map((product) => product.name);

  await expect(cards).toHaveText(expectedNames("All"));
  for (const category of ["Fruits", "Vegetables", "Shop All"]) {
    if (isMobile) await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await page.getByRole("link", { name: category, exact: true }).click();
    const label = category === "Shop All" ? "All" : category;
    await expect(shop.getByRole("button", { name: label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveText(expectedNames(label));
  }

  for (const category of ["Fruits", "Vegetables", "Fruits", "All", "Vegetables"]) {
    await shop.getByRole("button", { name: category, exact: true }).click();
  }
  await expect(cards).toHaveText(expectedNames("Vegetables"));
  await expect(shop.locator("article").first()).toHaveCSS("opacity", "1");

  await shop.getByRole("combobox", { name: "Search snacks" }).fill("no-matching-snack-12345");
  await expect(cards).toHaveCount(0);
  await expect(shop.getByText(/No snacks match that search/)).toBeVisible();
  await shop.getByRole("button", { name: "Clear search" }).click();
  await expect(cards).toHaveText(expectedNames("Vegetables"));
});
