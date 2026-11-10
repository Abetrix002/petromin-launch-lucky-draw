import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// The artifact host wraps each page in a document skeleton. Vercel doesn't, so the build adds it.
const HEAD = `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>`;

function page(src, out, from, to) {
  const html = readFileSync(src, "utf8");
  if (!from.test(html)) throw new Error(`${src}: link constant not found`);
  writeFileSync(out, HEAD + html.replace(from, to));
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
cpSync("assets", "dist/assets", { recursive: true });
cpSync("draw.js", "dist/draw.js");
page("landing.html", "dist/index.html", /const WHEEL_URL = ".*?";/, 'const WHEEL_URL = "/wheel";');
page("wheel.html", "dist/wheel.html", /const LANDING_URL = ".*?";/, 'const LANDING_URL = new URL("/", location.href).href;');
