import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Anjanadri Dehydrates",
  projectId: "na9vam30",
  dataset: "production",
  basePath: "/",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
