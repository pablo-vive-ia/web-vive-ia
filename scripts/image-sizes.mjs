// Mide las imágenes de public/images y guarda sus medidas en src/data/image-sizes.json.
// Corre antes de cada build: así todo <img> lleva width/height y el navegador reserva el lugar (sin saltos de diseño).
import { readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const dir = 'public/images';
const sizes = {};
for (const f of readdirSync(dir).filter((f) => /\.(webp|jpe?g|png|avif|svg)$/i.test(f)).sort()) {
  const { width, height } = await sharp(`${dir}/${f}`).metadata();
  sizes[`/images/${f}`] = { width, height };
}
writeFileSync('src/data/image-sizes.json', JSON.stringify(sizes, null, 2) + '\n');
console.log(`image-sizes: ${Object.keys(sizes).length} imágenes medidas`);
