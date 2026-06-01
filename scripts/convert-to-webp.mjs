import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR = './public/images';
const QUALITY = 82;
// og-image.jpg se queda en JPG (compatibilidad con crawlers de redes sociales)
const SKIP = ['og-image.jpg', 'og-image.svg'];

const files = readdirSync(INPUT_DIR);
let converted = 0;
let skipped = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) { skipped++; continue; }
  if (SKIP.includes(file)) { console.log(`  SKIP  ${file}`); skipped++; continue; }

  const inputPath = join(INPUT_DIR, file);
  const outputName = basename(file, ext) + '.webp';
  const outputPath = join(INPUT_DIR, outputName);

  const sizeBefore = statSync(inputPath).size;
  await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
  const sizeAfter = statSync(outputPath).size;

  totalBefore += sizeBefore;
  totalAfter += sizeAfter;
  const saving = Math.round((1 - sizeAfter / sizeBefore) * 100);
  console.log(`  OK    ${file} → ${outputName}  (${(sizeBefore/1024/1024).toFixed(1)}MB → ${(sizeAfter/1024).toFixed(0)}KB, -${saving}%)`);
  converted++;
}

console.log(`\nTotal: ${converted} convertidas, ${skipped} saltadas`);
console.log(`Peso antes:  ${(totalBefore/1024/1024).toFixed(1)} MB`);
console.log(`Peso después: ${(totalAfter/1024/1024).toFixed(1)} MB`);
console.log(`Ahorro: ${(100 - totalAfter/totalBefore*100).toFixed(0)}%`);
