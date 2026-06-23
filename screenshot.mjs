import puppeteer from "puppeteer";
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
const widthArg = parseInt(process.argv[4]) || 1440;
const OUT = "temporary screenshots";

await mkdir(OUT, { recursive: true });
const existing = (await readdir(OUT)).filter(f => f.startsWith("screenshot-"));
const next = existing.reduce((m, f) => Math.max(m, parseInt(f.split("-")[1]) || 0), 0) + 1;
const name = `screenshot-${next}${label ? "-" + label : ""}.png`;

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: widthArg, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: join(OUT, name), fullPage: true });
await browser.close();
console.log("Saved", join(OUT, name));
