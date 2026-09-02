// Genera una versión .md de cada página para "Markdown for Agents": cuando
// un agente pide Accept: text/markdown, nginx sirve este archivo en vez del
// HTML (ver nginx.conf). Corre después de `astro build`, sobre dist/.
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://vive-ia.com';

// route: ruta pública. htmlPath: dónde está el index.html generado por Astro.
// mdPath: dónde escribir el .md (debe coincidir con el mapeo de nginx.conf).
const PAGES = [
  { route: '/', htmlPath: 'index.html', mdPath: 'index.md' },
  { route: '/contacto', htmlPath: 'contacto/index.html', mdPath: 'contacto.md' },
  { route: '/desarrollos', htmlPath: 'desarrollos/index.html', mdPath: 'desarrollos.md' },
  { route: '/quienes-somos', htmlPath: 'quienes-somos/index.html', mdPath: 'quienes-somos.md' },
  { route: '/soluciones/ecommerce', htmlPath: 'soluciones/ecommerce/index.html', mdPath: 'soluciones/ecommerce.md' },
  {
    route: '/soluciones/mentores-marcas-personales',
    htmlPath: 'soluciones/mentores-marcas-personales/index.html',
    mdPath: 'soluciones/mentores-marcas-personales.md',
  },
];

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

let converted = 0;

for (const page of PAGES) {
  const htmlFile = join(DIST, page.htmlPath);
  if (!existsSync(htmlFile)) {
    console.warn(`  SKIP  ${page.route} (no existe ${page.htmlPath})`);
    continue;
  }

  const html = readFileSync(htmlFile, 'utf-8');
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';

  // Solo nos importa el contenido de <main> (Header/Footer/WhatsApp FAB
  // quedan afuera). Sacamos ruido: scripts, canvases, SVGs decorativos y
  // el campo honeypot del formulario (aria-hidden).
  const $main = $('main').clone();
  $main.find('script, style, canvas, svg, noscript, [aria-hidden="true"], .hidden').remove();

  const bodyMd = turndown.turndown($main.html() ?? '').trim();

  const md = [
    `# ${title}`,
    '',
    description ? `> ${description}` : null,
    description ? '' : null,
    bodyMd,
    '',
    '---',
    `Fuente: ${SITE}${page.route}`,
  ]
    .filter((line) => line !== null)
    .join('\n')
    .trim() + '\n';

  const outFile = join(DIST, page.mdPath);
  writeFileSync(outFile, md, 'utf-8');
  converted++;
  console.log(`  OK    ${page.route} → dist/${page.mdPath} (${(md.length / 1024).toFixed(1)} KB)`);
}

console.log(`\nMarkdown for Agents: ${converted}/${PAGES.length} páginas convertidas.`);
