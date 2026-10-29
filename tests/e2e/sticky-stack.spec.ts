import { test, expect } from "@playwright/test";

test("desktop cards stack while keeping the full catalog reachable", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("[data-stack-card]");
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toHaveCSS("position", "sticky");
  const viewport = page.viewportSize()!.height;
  const productTop = await cards.nth(1).evaluate((card) => card.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((top) => window.scrollTo(0, top), productTop - viewport / 2);
  const intro = cards.first().locator(":scope > div");
  await expect.poll(() => intro.evaluate((card) => Number.parseFloat(getComputedStyle(card).opacity))).toBeLessThan(0.9);
  const scale = await intro.evaluate((card) => new DOMMatrixReadOnly(getComputedStyle(card).transform).a);
  expect(scale).toBeGreaterThanOrEqual(0.9);
  expect(scale).toBeLessThan(1);
  await expect.poll(() => cards.first().evaluate((card) => Math.round(card.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(card).top)))).toBe(0);

  const partnerTop = await cards.nth(2).evaluate((card) => card.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((top) => window.scrollTo(0, top), partnerTop - viewport + 1);
  const productHeight = await cards.nth(1).evaluate((card) => (card as HTMLElement).offsetHeight);
  expect(productHeight).toBeGreaterThan(viewport);
  await expect.poll(() => cards.nth(1).evaluate((card) => Math.round(card.getBoundingClientRect().bottom))).toBe(viewport);
  await expect(page.locator("#shop article h3").last()).toBeInViewport();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(cards.first()).toHaveCSS("position", "relative");
  await expect(intro).toHaveCSS("transform", "none");
  await expect(intro).toHaveCSS("opacity", "1");
});

test("mobile cards scroll normally and remain static after resizing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cards = page.locator("[data-stack-card]");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS("position", "relative");
    await expect(card.locator(":scope > div")).toHaveCSS("transform", "none");
    await expect(card.locator(":scope > div")).toHaveCSS("opacity", "1");
  }
  await cards.first().evaluate((card) => {
    const probe = document.createElement("button");
    probe.dataset.mobileCartProbe = "";
    probe.textContent = "Cart probe";
    probe.style.cssText = "position:fixed;left:0;bottom:0;z-index:50;width:100px;height:40px;background:white";
    card.append(probe);
  });
  const before = await cards.first().evaluate((card) => card.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect.poll(() => cards.first().evaluate((card) => Math.round(card.getBoundingClientRect().top))).toBe(Math.round(before - 300));
  await expect(page.locator("[data-mobile-cart-probe]")).toBeInViewport();
  await page.locator("[data-mobile-cart-probe]").click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(cards.first()).toHaveCSS("position", "sticky");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(cards.first()).toHaveCSS("position", "relative");
  await expect(cards.first().locator(":scope > div")).toHaveCSS("transform", "none");
});
