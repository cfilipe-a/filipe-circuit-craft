import fs from "node:fs";
import path from "node:path";

function resolveModuleFile(baseDir: string, importPath: string): string | undefined {
  const base = path.resolve(baseDir, importPath);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

export function discoverProjectSlugs(
  projectsDir = path.resolve(process.cwd(), "src/data/projects"),
): string[] {
  const indexPath = path.join(projectsDir, "index.ts");
  if (!fs.existsSync(indexPath)) return [];

  const indexSource = fs.readFileSync(indexPath, "utf8");
  const symbolToFile = new Map<string, string>();
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["'](\.[^"']+)["']/g;

  for (const match of indexSource.matchAll(importRegex)) {
    const names = match[1];
    const relPath = match[2];
    if (!names || !relPath) continue;
    const resolvedFile = resolveModuleFile(projectsDir, relPath);
    if (!resolvedFile) continue;

    for (const part of names.split(",")) {
      const cleaned = part.trim().replace(/^type\s+/, "");
      const [importedName, aliasName] = cleaned.split(/\s+as\s+/);
      const localName = (aliasName ?? importedName ?? "").trim();
      if (localName) symbolToFile.set(localName, resolvedFile);
    }
  }

  const projectsArrayMatch = indexSource.match(/export\s+const\s+PROJECTS[^=]*=\s*\[([\s\S]*?)\]/);
  const slugs = new Set<string>();

  if (projectsArrayMatch?.[1]) {
    const entries = projectsArrayMatch[1]
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    for (const entry of entries) {
      const filePath = symbolToFile.get(entry);
      if (filePath) {
        const source = fs.readFileSync(filePath, "utf8");
        const slugMatch = source.match(/\bslug\s*:\s*["']([^"']+)["']/);
        if (slugMatch?.[1]) slugs.add(slugMatch[1]);
      } else {
        const inlineMatch = entry.match(/\bslug\s*:\s*["']([^"']+)["']/);
        if (inlineMatch?.[1]) slugs.add(inlineMatch[1]);
      }
    }
  }

  return Array.from(slugs);
}
