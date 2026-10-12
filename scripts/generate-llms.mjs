import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.join(root, "../src/content/docs");
const outputRoot = path.join(root, "../dist");
const siteRoot = "https://livtorgex.github.io/program-docs/";
const markdownRoot =
  "https://raw.githubusercontent.com/LivTorgEx/program-docs/main/src/content/docs/";

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(entryPath);
      if (entry.isFile() && /\.mdx?$/.test(entry.name)) return [entryPath];
      return [];
    }),
  );
  return nested.flat();
}

function pageMetadata(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const fields = frontmatter?.[1] ?? "";
  const value = (name) => {
    const match = fields.match(new RegExp(`^${name}:\\s*(.*?)\\s*$`, "m"));
    return match?.[1]?.replace(/^['"]|['"]$/g, "") ?? "";
  };

  return {
    title: value("title"),
    description: value("description"),
    body: frontmatter ? source.slice(frontmatter[0].length).trim() : source.trim(),
  };
}

const files = (await markdownFiles(docsRoot)).sort((left, right) => {
  const leftIsIndex = left.endsWith("/index.md");
  const rightIsIndex = right.endsWith("/index.md");
  if (leftIsIndex !== rightIsIndex) return leftIsIndex ? -1 : 1;
  return left.localeCompare(right);
});

if (files.length === 0) {
  throw new Error(`No Markdown documentation pages found in ${docsRoot}`);
}

const pages = await Promise.all(
  files.map(async (file) => {
    const relativePath = path.relative(docsRoot, file).split(path.sep).join("/");
    const source = await readFile(file, "utf8");
    const metadata = pageMetadata(source);
    if (!metadata.title) throw new Error(`Missing title in ${relativePath}`);
    return { relativePath, ...metadata };
  }),
);

const index = [
  "# LivTorgEx Program Docs",
  "",
  "> Reference for the QuantFlow language, workflow programs, signals, and Rust integration.",
  "",
  "These pages describe the restricted QuantFlow language used by LivTorgEx. The full Markdown corpus is available in `llms-full.txt`.",
  "",
  "## Documentation",
  ...pages.map(
    ({ relativePath, title, description }) =>
      `- [${title}](${markdownRoot}${relativePath}): ${description}`,
  ),
  "",
  "## Complete reference",
  `- [All documentation pages](${siteRoot}llms-full.txt)`,
  "",
].join("\n");

const fullText = [
  "# LivTorgEx Program Docs",
  "",
  "> Reference for the QuantFlow language, workflow programs, signals, and Rust integration.",
  ...pages.flatMap(({ relativePath, title, description, body }) => [
    "",
    `## ${title}`,
    "",
    description,
    "",
    `Source: ${markdownRoot}${relativePath}`,
    "",
    body,
  ]),
  "",
].join("\n");

await writeFile(path.join(outputRoot, "llms.txt"), index);
await writeFile(path.join(outputRoot, "llms-full.txt"), fullText);

console.log(`Generated llms.txt and llms-full.txt from ${pages.length} Markdown pages.`);
