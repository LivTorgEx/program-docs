import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://livtorgex.github.io",
  base: "/program-docs",
  integrations: [
    starlight({
      title: "LivTorgEx Program Docs",
      description:
        "Language reference and guides for programs running in LivTorgEx.",
      expressiveCode: {
        shiki: {
          langAlias: { quantflow: "text" },
        },
      },
      editLink: {
        baseUrl:
          "https://github.com/LivTorgEx/program-docs/edit/main/src/content/docs/",
      },
      sidebar: [
        { slug: "index" },
        { slug: "getting-started" },
        {
          label: "Language",
          items: [{ autogenerate: { directory: "language" } }],
        },
        {
          label: "Workflow programs",
          items: [{ autogenerate: { directory: "workflows" } }],
        },
        {
          label: "Signals",
          items: [{ autogenerate: { directory: "signals" } }],
        },
        {
          label: "Rust integration",
          items: [{ autogenerate: { directory: "rust" } }],
        },
        {
          label: "Maintaining the docs",
          items: [{ autogenerate: { directory: "contributing" } }],
        },
      ],
    }),
  ],
});
