import { test, expect } from "@playwright/test";

test("scroll rotates the cylinder and keyboard focus brings products forward", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const carousel = page.locator("[data-product-carousel]");
  await expect(carousel).toHaveAttribute("data-product-carousel", "active");
  const cylinder = carousel.locator("[data-product-cylinder]");
  const faces = carousel.locator("[data-carousel-facing]");
  const count = await faces.count();
  expect(count).toBeGreaterThan(2);
  await expect(carousel.locator("article img").first()).toHaveCSS("content-visibility", "visible");
  await expect.poll(() => carousel.locator("article img").evaluateAll((images) => images.filter((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0).length)).toBe(count);
  await expect(faces.first()).toHaveCSS("opacity", "1");
  const initial = await cylinder.evaluate((element) => getComputedStyle(element).transform);
  const destination = await carousel.evaluate((element, total) => (
    element.getBoundingClientRect().top + window.scrollY + ((element as HTMLElement).offsetHeight - window.innerHeight) * (2 / (total - 1))
  ), count);
  await page.evaluate((top) => window.scrollTo(0, top), destination);
  await expect.poll(() => cylinder.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initial);
  await expect.poll(() => faces.nth(2).evaluate((element) => Math.round(Number.parseFloat(getComputedStyle(element).opacity) * 100))).toBe(100);
  await expect.poll(() => faces.first().evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeLessThan(0.9);

  await page.keyboard.press("Tab");
  await carousel.locator("article h3 a").last().focus();
  await expect.poll(() => faces.last().evaluate((element) => Math.round(Number.parseFloat(getComputedStyle(element).opacity) * 100))).toBe(100);
  await expect(carousel.locator("article h3").last()).toBeInViewport();
  const productLink = carousel.locator("article h3 a").last();
  const productURL = await productLink.getAttribute("href");
  await productLink.click();
  await expect(page).toHaveURL(productURL!);
  expect(errors).toEqual([]);
});

test("custom cursor follows the mouse, expands, and lets buttons work", async ({ page }) => {
  await page.goto("/");
  const cursor = page.locator("div[data-custom-cursor]");
  await expect(cursor).toBeAttached();
  await page.mouse.move(12, 12);
  await expect(cursor).toHaveCSS("opacity", "1");
  await expect(page.locator("html")).toHaveCSS("cursor", "none");
  await page.mouse.move(420, 240);
  await expect.poll(() => cursor.evaluate((element) => Math.round(new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))).toBe(420);
  const fruits = page.locator("#shop").getByRole("button", { name: "Fruits", exact: true });
  await fruits.hover();
  await expect.poll(() => cursor.locator(":scope > div").evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(2.4);
  await expect(cursor.locator(":scope > div")).toHaveCSS("background-color", "rgb(167, 243, 208)");
  await fruits.click();
  await expect(fruits).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(cursor).toHaveCSS("opacity", "0");
  await expect(page.locator("html")).not.toHaveCSS("cursor", "none");
});

test("mobile and reduced-motion modes keep the standard grid and native cursor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const carousel = page.locator("[data-product-carousel]");
  const cylinder = page.locator("[data-product-cylinder]");
  await expect(carousel).toHaveAttribute("data-product-carousel", "inactive");
  await expect(cylinder).toHaveCSS("display", "grid");
  await expect(cylinder).toHaveCSS("transform", "none");
  await expect(page.locator("div[data-custom-cursor]")).toHaveCount(0);
  await page.mouse.move(100, 100);
  await expect(page.locator("html")).not.toHaveCSS("cursor", "none");
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(carousel).toHaveAttribute("data-product-carousel", "active");
  await page.mouse.move(100, 150);
  await expect(page.locator("html")).toHaveCSS("cursor", "none");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(carousel).toHaveAttribute("data-product-carousel", "inactive");
  await expect(cylinder).toHaveCSS("transform", "none");
  await expect(cylinder.locator(":scope > div").first()).toHaveCSS("transform", "none");
  await expect(page.locator("div[data-custom-cursor]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveCSS("cursor", "none");
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(carousel).toHaveAttribute("data-product-carousel", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel).toHaveAttribute("data-product-carousel", "inactive");
  await expect(cylinder).toHaveCSS("display", "grid");
  await expect(cylinder).toHaveCSS("transform", "none");
  await expect(page.locator("div[data-custom-cursor]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveCSS("cursor", "none");
});
