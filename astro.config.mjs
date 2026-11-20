// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vive-ia.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  // Astro 7 comprime el HTML quitando espacios entre elementos en línea (ej. alrededor de <br> o al
  // cerrar un <span>) y eso pegaba palabras ("minutos.Sin"). Sin comprimir el texto queda igual que en
  // Astro 6; el peso extra lo absorbe la compresión gzip/brotli del servidor.
  compressHTML: false,
});
