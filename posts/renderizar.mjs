// Gera os PNGs (1080x1350) de cada <section class="slide"> de um slides.html.
// Uso: node posts/renderizar.mjs posts/tema-2-como-funciona
import { chromium } from 'playwright';
import path from 'node:path';

const pasta = path.resolve(process.argv[2]);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto('file://' + path.join(pasta, 'slides.html'));
await page.evaluate(() => document.fonts.ready);
const slides = await page.$$('section.slide');
for (const [i, s] of slides.entries()) {
  const arq = path.join(pasta, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await s.screenshot({ path: arq });
  console.log(arq);
}
await browser.close();
