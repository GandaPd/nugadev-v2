const fs = require("fs");
const path = require("path");
const SITE_URL = "https://nugadev.com";

const pagesDir = path.join(__dirname, "../src/pages");
const partialsDir = path.join(__dirname, "../src/partials");
const publicDir = path.join(__dirname, "../public");
const schemaDir = path.join(__dirname, "../src/schema");
const analytics = readPartial("analytics");

/* =========================
   HELPER FUNCTIONS
========================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readPartial(name) {
  return fs.readFileSync(path.join(partialsDir, `${name}.html`), "utf8");
}

function readSchema(name) {
  return fs.readFileSync(path.join(schemaDir, `${name}.json`), "utf8");
}

const navbar = readPartial("navbar");
const footer = readPartial("footer");
const ctaBanner = readPartial("cta-banner");
const floatingWa = readPartial("floating-wa");
const backToTop = readPartial("back-to-top");
const serviceCta = readPartial("service-cta");

const pages = fs.readdirSync(pagesDir);

const sitemapUrls = [];

const rootPages = ["terima-kasih.html"];

pages.forEach((page) => {
  if (!page.endsWith(".html") && page !== "blog") return;

  /*
  |--------------------------------------------------------------------------
  | Blog Pages (Dynamic Subfolders)
  |--------------------------------------------------------------------------
  */
  // 1. Tangani folder blog di sini terlebih dahulu sebelum membaca file text biasa
  if (page === "blog") {
    const blogSourceDir = path.join(pagesDir, "blog");

    if (fs.existsSync(blogSourceDir)) {
      const articleFolders = fs.readdirSync(blogSourceDir);

      articleFolders.forEach((folderName) => {
        const articleFolderSubDir = path.join(blogSourceDir, folderName);

        if (fs.statSync(articleFolderSubDir).isDirectory()) {
          const articleHtmlFile = path.join(
            articleFolderSubDir,
            `${folderName}.html`,
          );

          if (fs.existsSync(articleHtmlFile)) {
            let blogHtml = fs.readFileSync(articleHtmlFile, "utf8");

            const blogSchemaFile = path.join(
              schemaDir,
              "blog",
              `${folderName}.json`,
            );
            let blogSchemaScript = "";

            if (fs.existsSync(blogSchemaFile)) {
              const blogSchemaContent = fs.readFileSync(blogSchemaFile, "utf8");
              blogSchemaScript = `\n<script type="application/ld+json">\n${blogSchemaContent}\n</script>\n`;
            }

            blogHtml = blogHtml
              .replaceAll("{{navbar}}", navbar)
              .replaceAll("{{footer}}", footer)
              .replaceAll("{{cta-banner}}", ctaBanner)
              .replaceAll("{{floating-wa}}", floatingWa)
              .replaceAll("{{back-to-top}}", backToTop)
              .replaceAll("{{service-cta}}", serviceCta)
              .replaceAll("{{schema}}", blogSchemaScript)
              .replaceAll("{{analytics}}", analytics);

            const blogOutputDir = path.join(publicDir, "blog", folderName);
            ensureDir(blogOutputDir);

            fs.writeFileSync(path.join(blogOutputDir, "index.html"), blogHtml);

            sitemapUrls.push(`${SITE_URL}/blog/${folderName}/`);

            console.log(`✓ Built Blog: /blog/${folderName}/`);
          }
        }
      });
    }
    return; // 2. CRITICAL: Stop di sini agar folder blog tidak lanjut dibaca oleh fs.readFileSync di bawah!
  }

  // --- SISA KODE LAMA ANDA YANG DI BAWAH TETAP SEPERTI INI ---
  const pagePath = path.join(pagesDir, page);

  let html = fs.readFileSync(pagePath, "utf8");

  const schemaFile = path.join(schemaDir, page.replace(".html", ".json"));

  let schemaScript = "";

  if (fs.existsSync(schemaFile)) {
    const schemaContent = fs.readFileSync(schemaFile, "utf8");

    schemaScript = `
<script type="application/ld+json">
${schemaContent}
</script>
`;
  }

  html = html
    .replaceAll("{{navbar}}", navbar)
    .replaceAll("{{footer}}", footer)
    .replaceAll("{{cta-banner}}", ctaBanner)
    .replaceAll("{{floating-wa}}", floatingWa)
    .replaceAll("{{back-to-top}}", backToTop)
    .replaceAll("{{service-cta}}", serviceCta)
    .replaceAll("{{schema}}", schemaScript)
    .replaceAll("{{analytics}}", analytics);

  /*
  |--------------------------------------------------------------------------
  | Homepage
  |--------------------------------------------------------------------------
  */

  if (page === "index.html") {
    ensureDir(publicDir);

    fs.writeFileSync(path.join(publicDir, "index.html"), html);

    sitemapUrls.push(`${SITE_URL}/`);

    console.log("✓ Built: /");
    return;
  }

  /*
|--------------------------------------------------------------------------
| Blog Index
|--------------------------------------------------------------------------
*/

  if (page === "blog.html") {
    const outputDir = path.join(publicDir, "blog");

    ensureDir(outputDir);

    fs.writeFileSync(path.join(outputDir, "index.html"), html);

    sitemapUrls.push(`${SITE_URL}/blog/`);

    console.log("✓ Built: /blog/");

    return;
  }

  /*
|--------------------------------------------------------------------------
| Root Pages
|--------------------------------------------------------------------------
*/

  if (rootPages.includes(page)) {
    const pageName = page.replace(".html", "");

    const outputDir = path.join(publicDir, pageName);

    ensureDir(outputDir);

    fs.writeFileSync(path.join(outputDir, "index.html"), html);

    sitemapUrls.push(`${SITE_URL}/${pageName}/`);

    console.log(`✓ Built: /${pageName}/`);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Service Pages
  |--------------------------------------------------------------------------
  */

  const pageName = page.replace(".html", "");

  const outputDir = path.join(publicDir, "layanan", pageName);

  ensureDir(outputDir);

  fs.writeFileSync(path.join(outputDir, "index.html"), html);

  sitemapUrls.push(`${SITE_URL}/layanan/${pageName}/`);

  console.log(`✓ Built: /layanan/${pageName}/`);
});

/*
|--------------------------------------------------------------------------
| Generate Sitemap
|--------------------------------------------------------------------------
*/

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapUrls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
  </url>`,
  )
  .join("")}

</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

console.log("✓ Sitemap generated");

/*
|--------------------------------------------------------------------------
| Generate Robots
|--------------------------------------------------------------------------
*/

const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log("✓ Robots generated");

function copyFolderRecursive(source, destination) {
  ensureDir(destination);

  const items = fs.readdirSync(source, {
    withFileTypes: true,
  });

  items.forEach((item) => {
    const sourcePath = path.join(source, item.name);
    const destPath = path.join(destination, item.name);

    if (item.isDirectory()) {
      copyFolderRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

/*
|--------------------------------------------------------------------------
| Copy JS Assets
|--------------------------------------------------------------------------
*/

copyFolderRecursive(
  path.join(__dirname, "../src/js"),
  path.join(publicDir, "js"),
);

console.log("✓ JS copied");

/*
|--------------------------------------------------------------------------
| Copy Font Assets
|--------------------------------------------------------------------------
*/

copyFolderRecursive(
  path.join(__dirname, "../src/fonts"),
  path.join(publicDir, "fonts"),
);

console.log("✓ Fonts copied");
