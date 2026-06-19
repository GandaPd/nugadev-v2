const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "../src/pages");
const partialsDir = path.join(__dirname, "../src/partials");
const publicDir = path.join(__dirname, "../public");

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

const navbar = readPartial("navbar");
const footer = readPartial("footer");
const ctaBanner = readPartial("cta-banner");
const floatingWa = readPartial("floating-wa");
const backToTop = readPartial("back-to-top");
const serviceCta = readPartial("service-cta");

const pages = fs.readdirSync(pagesDir);

pages.forEach((page) => {
  if (!page.endsWith(".html")) return;

  const pagePath = path.join(pagesDir, page);

  let html = fs.readFileSync(pagePath, "utf8");

  html = html
    .replaceAll("{{navbar}}", navbar)
    .replaceAll("{{footer}}", footer)
    .replaceAll("{{cta-banner}}", ctaBanner)
    .replaceAll("{{floating-wa}}", floatingWa)
    .replaceAll("{{back-to-top}}", backToTop)
    .replaceAll("{{service-cta}}", serviceCta);

  /*
  |--------------------------------------------------------------------------
  | Homepage
  |--------------------------------------------------------------------------
  */

  if (page === "index.html") {
    ensureDir(publicDir);

    fs.writeFileSync(path.join(publicDir, "index.html"), html);

    console.log("✓ Built: /");
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

  console.log(`✓ Built: /layanan/${pageName}/`);
});

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
