import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "price", title: "Price (₹)", type: "number" }),
    defineField({ name: "originalPrice", title: "Original Price (₹)", type: "number" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "benefit", title: "Benefit Badge", type: "string" }),
    defineField({ name: "badge", title: "Category Badge", type: "string" }),
    defineField({ name: "weight", title: "Weight", type: "string", initialValue: "200g" }),
    defineField({ name: "inStock", title: "In Stock", type: "boolean", initialValue: true }),
  ],
  orderings: [
    { title: "Name A-Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
});
