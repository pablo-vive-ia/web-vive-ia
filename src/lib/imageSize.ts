// width/height reales de una imagen de public/images (ver scripts/image-sizes.mjs).
// Si la imagen no está medida devuelve {} y el <img> queda como antes.
import sizes from '../data/image-sizes.json';

export function imgSize(src: string | undefined): { width?: number; height?: number } {
  return (src && (sizes as Record<string, { width: number; height: number }>)[src]) || {};
}
