import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const APP_DIR = path.join(process.cwd(), "app");

function isDynamicSegment(name: string) {
  return name.startsWith("[") && name.endsWith("]");
}

async function collectPages(dir: string, base = ""): Promise<Array<{ loc: string; lastmod: string }>> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const pages: Array<{ loc: string; lastmod: string }> = [];

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      // skip api or _app-like folders if present
      if (ent.name === "api" || ent.name.startsWith("_")) continue;

      // if folder name is dynamic, skip because we can't expand it
      if (isDynamicSegment(ent.name)) continue;

      const nested = await collectPages(full, path.join(base, ent.name));
      pages.push(...nested);
    } else if (ent.isFile()) {
      // We're interested in page.tsx files
      if (ent.name === "page.tsx" || ent.name === "page.jsx" || ent.name === "page.ts" || ent.name === "page.js") {
        // path mapping: base may be '', which maps to '/'
        const loc = base === "" ? "/" : `/${base.replace(/\\\\/g, "/")}`;
        const stat = await fs.promises.stat(full);
        pages.push({ loc, lastmod: stat.mtime.toISOString() });
      }
    }
  }

  return pages;
}

function getSiteUrl() {
  return (
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function GET() {
  const pages = await collectPages(APP_DIR);

  const siteUrl = getSiteUrl();

  const urls = pages
    // dedupe by loc
    .filter((v, i, a) => a.findIndex((x) => x.loc === v.loc) === i)
    .map(
      (p) => `  <url>\n    <loc>${siteUrl}${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
