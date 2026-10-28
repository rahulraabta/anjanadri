import { test, expect } from "@playwright/test";

interface SearchProduct {
  name: string;
  slug: string;
  price: number;
}

test("search, add to cart, and generate a WhatsApp checkout", async ({ page, isMobile }) => {
  // Verify the generated link without opening an external WhatsApp chat.
  await page.addInitScript(() => { window.open = () => null; });

  const catalogLoaded = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/search-products.json",
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const catalogResponse = await catalogLoaded;
  expect(catalogResponse.ok()).toBeTruthy();
  const catalog: SearchProduct[] = await catalogResponse.json();
  expect(catalog.length).toBeGreaterThan(0);
  const product = catalog[0];

  await page.keyboard.press("Meta+k");
  const commandMenu = page.getByRole("dialog", { name: "Search Anjanadri products" });
  await expect(commandMenu).toBeVisible();
  await commandMenu.getByRole("combobox").fill(product.name);
  await commandMenu.getByRole("option").filter({
    has: page.getByText(product.name, { exact: true }),
  }).click();

  await expect(page).toHaveURL(`/products/${encodeURIComponent(product.slug)}`);
  await expect(page.getByRole("heading", { level: 1, name: product.name, exact: true })).toBeVisible();
  const addToCart = isMobile
    ? page.getByRole("complementary", { name: "Quick add to cart" })
      .getByRole("button", { name: `Add to Cart: 1 ${product.name}`, exact: true })
    : page.getByRole("button", { name: /^Add to Basket/ });
  await expect(addToCart).toBeEnabled();
  await addToCart.click();

  const cart = page.getByRole("dialog", { name: "Your Cart" });
  await expect(cart).toBeVisible();
  await expect(cart.getByText(product.name, { exact: true })).toBeVisible();
  await cart.getByRole("button", { name: "Checkout", exact: true }).click();
  await expect(page).toHaveURL("/checkout");
  await expect(page.getByRole("heading", { level: 1, name: "Complete Your Order" })).toBeVisible();

  const customer = {
    name: "Ananya Rao",
    phone: "9880011223",
    address: "12 Test Street & 2nd Cross, Mysore",
    city: "Mysore",
    pincode: "570001",
  };
  await page.getByLabel(/^Full Name/).fill(customer.name);
  await page.getByLabel(/^Mobile Number/).fill(customer.phone);
  await page.getByLabel(/^Street Address/).fill(customer.address);
  await page.getByLabel(/^City/).fill(customer.city);
  await page.getByLabel(/^Pincode/).fill(customer.pincode);
  await page.getByRole("button", { name: "Send Order via WhatsApp", exact: true }).click();

  await expect(page.getByText("Order Initiated via WhatsApp", { exact: true })).toBeVisible();
  const whatsappLink = page.getByRole("link", { name: "Reopen WhatsApp Chat" });
  await expect(whatsappLink).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  const whatsapp = new URL((await whatsappLink.getAttribute("href"))!);
  expect(whatsapp.pathname).toBe(`/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919880106885"}`);
  expect(whatsapp.pathname).toMatch(/^\/\d{8,15}$/);
  expect([...whatsapp.searchParams.keys()]).toEqual(["text"]);
  const message = whatsapp.searchParams.get("text")!;
  for (const value of Object.values(customer)) expect(message).toContain(value);
  expect(message).toContain(product.name);
  expect(message).toContain("x 1");
  expect(message).toContain(`*TOTAL: ₹${product.price.toFixed(0)}*`);
});
