import { createClient } from "@sanity/client";
import { readFile } from "fs/promises";

const client = createClient({
  projectId: "na9vam30",
  dataset: "production",
  apiVersion: "2026-06-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const products = [
  { id: "sticky-banana", name: "Sticky Banana", price: 190, originalPrice: 220, description: "Our flagship dehydrated sticky banana. Naturally sweet Mysore bananas, slow-dried to a chewy golden bite with no preservatives or added sugar.", shortDescription: "Flagship dehydrated sticky banana. Chewy, naturally sweet.", benefit: "Slow-Dehydrated, No Sugar", badge: "Best Seller", image: "/images/sticky-banana.jpg", category: "Fruits", weight: "200g" },
  { id: "dried-mango", name: "Dried Mango", price: 160, description: "Sweet and tangy dehydrated mango slices made from ripe Indian mangoes. Naturally rich in Vitamin C and fiber. No added sugar, no preservatives.", shortDescription: "Sweet and tangy dehydrated mango slices.", benefit: "Vitamin C Rich", image: "/images/mango.jpg", category: "Fruits", weight: "200g" },
  { id: "dried-banana", name: "Dried Banana", price: 150, description: "Classic crispy banana chips, naturally sweet and dehydrated.", shortDescription: "Classic crispy banana chips, naturally sweet.", benefit: "Potassium Rich", image: "/images/banana.jpg", category: "Fruits", weight: "200g" },
  { id: "dried-apple", name: "Dried Apple", price: 170, description: "Crisp apple rings with a hint of cinnamon, gently dehydrated.", shortDescription: "Crisp apple rings with a hint of cinnamon.", benefit: "High in Fiber", image: "/images/apple.jpg", category: "Fruits", weight: "200g" },
  { id: "dried-carrot", name: "Dried Carrot", price: 155, description: "Earthy and sweet carrot coins, dehydrated for a satisfying crunch.", shortDescription: "Earthy and sweet carrot coins.", benefit: "Vitamin A Rich", image: "/images/carrot.jpg", category: "Vegetables", weight: "200g" },
  { id: "dried-beetroot", name: "Dried Beetroot", price: 165, description: "Rich in iron, vibrant beetroot crisps with an earthy sweetness.", shortDescription: "Rich in iron, vibrant and crisp.", benefit: "Iron & Folate Rich", image: "/images/beetroot.jpg", category: "Vegetables", weight: "200g" },
  { id: "dried-okra", name: "Dried Okra", price: 175, description: "Crunchy and savory okra chips, dehydrated to perfection.", shortDescription: "Crunchy and savory okra chips.", benefit: "Fiber & Antioxidants", image: "/images/okra.jpg", category: "Vegetables", weight: "200g" },
  { id: "dried-chillies", name: "Dried Chillies", price: 180, description: "Spicy and aromatic dehydrated chillies from Karnataka farms.", shortDescription: "Spicy and aromatic dehydrated chillies.", benefit: "Capsaicin Rich", image: "/images/red-chilli.jpg", category: "Spices", weight: "200g" },
];

async function uploadImage(localPath) {
  const fileBuffer = await readFile(`public${localPath}`);
  const filename = localPath.split("/").pop();
  const asset = await client.assets.upload("image", fileBuffer, { filename });
  return asset._id;
}

async function migrate() {
  console.log(`Migrating ${products.length} products to Sanity...\n`);
  for (const product of products) {
    console.log(`-> ${product.name}`);
    let imageRef = null;
    try {
      const assetId = await uploadImage(product.image);
      imageRef = { _type: "image", asset: { _type: "reference", _ref: assetId } };
      console.log("   OK Image uploaded");
    } catch (err) {
      console.warn(`   WARN Image failed: ${err.message}`);
    }
    await client.create({
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.id },
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      shortDescription: product.shortDescription,
      image: imageRef,
      category: product.category,
      benefit: product.benefit,
      badge: product.badge,
      weight: product.weight,
      inStock: true,
    });
    console.log("   OK Created\n");
  }
  console.log("Done!");
}

migrate().catch((err) => { console.error(err); process.exit(1); });
