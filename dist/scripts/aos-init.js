// Inicialización de AOS (Animate On Scroll).
// Vive en un archivo externo (en vez de <script is:inline>) para poder sacar
// 'unsafe-inline' del script-src de la CSP en public/.htaccess.
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});
