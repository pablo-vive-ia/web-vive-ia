# CLAUDE.md — VIVE-IA Website

Este archivo guía a Claude Code en el desarrollo del sitio web de VIVE-IA.
Leé este archivo completo antes de tocar cualquier archivo del proyecto.

---
# CLAUDE.md - Token Efficient Rules

1. Think before acting. Read existing files before writing code.
2. Be concise in output but thorough in reasoning.
3. Prefer editing over rewriting whole files.
4. Do not re-read files you have already read unless the file may have changed.
5. Test your code before declaring done.
6. No sycophantic openers or closing fluff.
7. Keep solutions simple and direct.
8. User instructions always override this file.

---

## Contexto del proyecto

**VIVE-IA** es una agencia argentina especializada en automatización de procesos con inteligencia artificial. El sitio es el principal canal de conversión de la marca. Toda decisión de desarrollo debe priorizar: velocidad de carga, experiencia de usuario, y conversión (leads y agendamientos).

**Fundadores:**
- **Pablo Frisardi** — Cofundador, especialista en IA y automatización (+20 años en tecnología)
- **Luciana Frisardi** — Cofundadora, asesora empresarial y estratégica (+18 años en negocios)

**Dominio en producción:** `https://vive-ia.com` (Hostinger)
**Repositorio:** GitHub → deploy a Hostinger vía FTP o GitHub Actions

---

## Stack tecnológico

```
Framework:    Astro 4.x          (generación estática, SSG)
Estilos:      Tailwind CSS 3.x   (utility-first, sin CSS custom salvo variables)
Animaciones:  AOS.js             (scroll reveals simples y livianos)
Íconos:       Lucide Icons       (SVG inline, tree-shakeable)
Formulario:   fetch() → n8n      (webhook ya configurado)
Deploy:       dist/ → Hostinger  (FTP manual o GitHub Actions)
```

**No usar:**
- ❌ React / Vue / Svelte (no se necesita JS reactivo)
- ❌ CSS Modules ni styled-components
- ❌ Librerías de UI externas (shadcn, DaisyUI, etc.)
- ❌ Frameworks CSS alternativos a Tailwind
- ❌ `localStorage` o `sessionStorage`

---

## Estructura del proyecto

```
vive-ia-web/
├── public/
│   ├── favicon.ico
│   ├── favicon-192.png
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   ├── sitemap.xml              ← generado por @astrojs/sitemap
│   └── images/
│       ├── logo-transparent.png ← logo principal con fondo transparente
│       ├── logo-bronce.png
│       ├── logo-plata.png
│       ├── logo-oro.png
│       ├── luciana-frisardi.jpg
│       ├── pablo-frisardi.jpg
│       └── og-image.jpg         ← 1200x630 para redes sociales
│
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro     ← layout principal con head, header, footer
│   │
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── WhatsAppFAB.astro    ← botón flotante sticky WhatsApp
│   │   ├── HeroVideo.astro      ← hero con YouTube embed
│   │   ├── SectionBadge.astro   ← pill/badge encima de H2
│   │   ├── Button.astro         ← variantes: primary | secondary | whatsapp
│   │   ├── Card.astro           ← card con glassmorphism y hover lift
│   │   ├── StepCard.astro       ← card de proceso numerado (01, 02...)
│   │   ├── ValueCard.astro      ← card de valores con ícono
│   │   ├── ProfileCard.astro    ← tarjeta de equipo con foto y bio
│   │   ├── PricingCard.astro    ← tarjeta de plan (bronce/plata/oro)
│   │   ├── MetricCounter.astro  ← contador animado al entrar en viewport
│   │   ├── PainPoint.astro      ← ítem de problema (con ícono ❌)
│   │   ├── Benefit.astro        ← ítem de beneficio (con check ✅)
│   │   └── ContactForm.astro    ← formulario completo con submit a webhook
│   │
│   └── pages/
│       ├── index.astro                              ← Home
│       ├── quienes-somos.astro                      ← About
│       ├── contacto.astro                           ← Contacto
│       └── soluciones/
│           ├── index.astro                          ← redirect a ecommerce o landing
│           ├── ecommerce.astro                      ← Agentes E-commerce
│           └── mentores-marcas-personales.astro     ← Agentes Mentores
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── CLAUDE.md                    ← este archivo
```

---

## Sistema de diseño

### Paleta de colores (Tailwind config)

```js
// tailwind.config.mjs — extend.colors
colors: {
  brand: {
    bg:           '#0A0A0F',   // fondo principal
    card:         '#111118',   // fondo cards
    surface:      '#1A1A28',   // superficies elevadas
    border:       'rgba(255,255,255,0.08)',
    'border-accent': 'rgba(124,58,237,0.4)',
  },
  accent: {
    DEFAULT:      '#7C3AED',   // violet-600
    light:        '#A855F7',   // violet-500
    glow:         'rgba(124,58,237,0.3)',
  },
  cyan: {
    brand:        '#06B6D4',   // cyan-500
  },
  text: {
    primary:      '#F8FAFC',
    secondary:    '#94A3B8',
    muted:        '#475569',
  },
}
```

### Tipografía

- **Fuente:** `Inter` (Google Fonts, weights: 400, 500, 600, 700, 800)
- **H1 hero:** `clamp(2.5rem, 6vw, 5rem)` — bold, gradiente de texto
- **H2 sección:** `clamp(2rem, 4vw, 3rem)` — semibold
- **H3:** `clamp(1.25rem, 2.5vw, 1.75rem)`
- **Body:** `1rem / 1.6`

### Gradiente de texto (H1)
```css
background: linear-gradient(135deg, #F8FAFC 0%, #A855F7 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Clases Tailwind frecuentes

```
Fondo principal:     bg-[#0A0A0F]
Fondo card:          bg-[#111118]
Borde sutil:         border border-white/[0.08]
Glassmorphism:       backdrop-blur-sm bg-white/[0.03]
Hover lift card:     hover:-translate-y-1 transition-transform duration-300
Botón primary:       bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-lg
Botón secondary:     border border-violet-600 text-violet-400 hover:bg-violet-600/10
Texto primario:      text-slate-50
Texto secundario:    text-slate-400
Glow accent:         shadow-[0_0_30px_rgba(124,58,237,0.3)]
```

---

## Páginas y orden de secciones

### Home (`/`)
1. Hero con video YouTube + CTAs
2. Sección Problema ("Si tu negocio crece… ¿también crece el caos?")
3. Solución / Proceso (4 pasos)
4. Qué hacemos (grid de servicios)
5. Resultados / Beneficios (checklist + métricas animadas)
6. Diferencial ("No automatizamos caos")
7. Filosofía ("Tecnología con propósito")
8. Quiénes somos resumido (fotos del equipo)
9. CTA final

### Quiénes Somos (`/quienes-somos`)
1. Hero
2. Somos VIVE-IA
3. Manifiesto
4. Propósito
5. Misión
6. Visión
7. Valores (5 cards)
8. Enfoque diferencial (4 pasos)
9. Perfiles: Luciana y Pablo

### Soluciones E-commerce (`/soluciones/ecommerce`)
1. Hero
2. Problemas actuales
3. Qué hace el agente
4. Qué es un agente conversacional
5. Casos de uso (Ventas / Soporte)
6. Beneficios (6 cards)
7. Métricas de impacto (3 contadores)
8. Planes Bronce / Plata / Oro
9. CTA final

### Soluciones Mentores (`/soluciones/mentores-marcas-personales`)
1. Hero
2. Problemas comunes
3. Qué hace el agente
4. Factor diferencial
5. Casos de uso (Ventas / Soporte)
6. Beneficios
7. ROI / Métricas (4 pasos)
8. Planes Bronce / Plata / Oro
9. CTA final

### Contacto (`/contacto`)
1. Hero
2. Opción rápida WhatsApp
3. Agendar llamada (Cal.com)
4. Formulario + bloque de valor (2 columnas)
5. Bloque confianza (respuesta en 24hs, sin compromiso)
6. Cierre emocional

---

## Integraciones y URLs clave

```
WhatsApp principal:  https://wa.me/5492665258874
WhatsApp alt:        https://wa.me/5491125938028
Agendar reunión:     https://cal.com/demo-vive-ia-fuz5y7/30min?user=demo-vive-ia-fuz5y7
Formulario webhook:  https://n8n.vive-ia.com/form/e563e490-0ed3-4500-be54-80343c3c4687
Email:               contacto@vive-ia.com
Instagram:           https://www.instagram.com/vive_ia
Video hero (YT):     https://www.youtube.com/embed/omr91fMMxk4
```

### Embed del video hero (YouTube)

```html
<div class="hero-video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/omr91fMMxk4?autoplay=1&mute=1&loop=1&playlist=omr91fMMxk4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
    allow="autoplay; encrypted-media"
    allowfullscreen
    title="VIVE-IA video presentación"
  ></iframe>
</div>
```

```css
/* Cubre el hero completo desde video vertical 9:16 */
.hero-video-wrapper {
  position: absolute; inset: 0; overflow: hidden; z-index: 0;
}
.hero-video-wrapper iframe {
  position: absolute;
  top: 50%; left: 50%;
  width: 100vw;
  height: 56.25vw;
  min-height: 100vh;
  min-width: 177.77vh;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border: none;
}
```

### Formulario de contacto (POST a n8n)

```js
// ContactForm.astro — script de submit
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  try {
    await fetch('https://n8n.vive-ia.com/form/e563e490-0ed3-4500-be54-80343c3c4687', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // Mostrar mensaje de éxito
    document.getElementById('form-success').classList.remove('hidden');
    form.reset();
  } catch (err) {
    // Mostrar mensaje de error
    document.getElementById('form-error').classList.remove('hidden');
  }
});
```

**Campos del formulario:**
- `nombre` — text, required
- `empresa` — text, optional
- `email` — email, required
- `whatsapp` — tel, required
- `etapa` — select: "empezando" | "ordenar" | "escalar"
- `area` — select: "atencion" | "ventas" | "administracion" | "no-claro"
- `necesidad` — textarea, optional

---

## Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4321)
npm run dev

# Build de producción → genera /dist
npm run build

# Preview del build
npm run preview
```

### Inicializar proyecto desde cero

```bash
npm create astro@latest vive-ia-web -- --template minimal --typescript strict --no-git
cd vive-ia-web
npx astro add tailwind
npm install lucide-astro aos
npm install @astrojs/sitemap
```

### Configuración mínima `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vive-ia.com',
  integrations: [tailwind(), sitemap()],
  output: 'static',
});
```

---

## Patrones de componentes

### SectionBadge (pill badge encima del título)
```astro
---
const { text } = Astro.props;
---
<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full
             bg-violet-600/10 border border-violet-600/30
             text-violet-400 text-sm font-medium mb-4">
  {text}
</span>
```

### Button
```astro
---
const { href, variant = 'primary', target } = Astro.props;
const classes = {
  primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]',
  secondary: 'border border-violet-600/60 text-violet-400 hover:bg-violet-600/10',
  whatsapp: 'bg-[#25D366] hover:bg-[#1ebe5a] text-white',
};
---
<a href={href} target={target}
   class={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
           transition-all duration-300 ${classes[variant]}`}>
  <slot />
</a>
```

### MetricCounter (contador animado con IntersectionObserver)
```astro
---
const { value, label, prefix = '', suffix = '' } = Astro.props;
---
<div class="text-center" data-counter data-value={value}>
  <div class="text-4xl md:text-5xl font-bold text-white mb-2">
    {prefix}<span class="counter-value">0</span>{suffix}
  </div>
  <p class="text-slate-400 text-sm">{label}</p>
</div>

<script>
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.value);
      const span = el.querySelector('.counter-value');
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        span.textContent = current.toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
</script>
```

### WhatsApp FAB (flotante sticky)
```astro
<a href="https://wa.me/5492665258874"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Contactar por WhatsApp"
   class="fixed bottom-6 right-6 z-50 flex items-center justify-center
          w-14 h-14 bg-[#25D366] rounded-full shadow-lg
          hover:scale-110 transition-transform duration-300">
  <!-- SVG ícono WhatsApp -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="white" class="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
```

---

## 🗺 SEO — Metadatos por página

El `BaseLayout.astro` recibe props y los inyecta en el `<head>`:

```astro
---
// BaseLayout.astro
const {
  title = 'VIVE-IA — Automatización con Inteligencia Artificial',
  description = 'Ordenamos, estructuramos y automatizamos tus procesos con IA.',
  ogImage = '/images/og-image.jpg',
  canonicalURL = Astro.url,
} = Astro.props;
---
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_AR" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <!-- Fuentes -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <!-- AOS (scroll animations) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
</head>
```

### Títulos y descripciones por página

| Página | Title | Description |
|--------|-------|-------------|
| Home | `VIVE-IA — Automatizá tu negocio con Inteligencia Artificial` | `Ordenamos, estructuramos y automatizamos tus procesos para que tu empresa crezca sin caos. Agencia IA en Argentina.` |
| Quiénes Somos | `Quiénes Somos — VIVE-IA` | `Conocé a Pablo y Luciana Frisardi, fundadores de VIVE-IA. Estrategia, tecnología y propósito para transformar tu negocio.` |
| E-commerce | `Agentes IA para E-commerce — VIVE-IA` | `Automatizá tu tienda online con agentes conversacionales. Recuperá carritos, mejorá la atención y vendé más las 24hs.` |
| Mentores | `Agentes IA para Mentores y Marcas Personales — VIVE-IA` | `Escalá tu negocio con inteligencia artificial. Automatizá la atención, recuperá leads y liberá tiempo valioso.` |
| Contacto | `Contacto — VIVE-IA` | `Agendá tu diagnóstico gratuito y descubrí cómo automatizar tu negocio con inteligencia artificial.` |

---

## ✅ Convenciones de código

### Astro components
- Un componente por archivo, nombre en PascalCase
- Props tipadas con TypeScript inline (`const { title }: { title: string } = Astro.props`)
- Estilos solo vía clases Tailwind (no `<style>` salvo casos excepcionales)
- Scripts del lado cliente dentro de `<script>` al final del componente
- Animaciones AOS declaradas con `data-aos="fade-up"` y `data-aos-delay="100"`

### Tailwind
- Usar clases de Tailwind directamente en el HTML, sin `@apply` salvo en casos de reutilización muy alta
- Responsive: `md:` para tablet (768px+), `lg:` para desktop (1024px+)
- Dark mode: el sitio es siempre dark, no usar `dark:` prefix

### Accesibilidad
- Todos los `<img>` con `alt` descriptivo
- Botones con `aria-label` cuando no tienen texto visible
- `lang="es"` en `<html>`
- Foco visible en elementos interactivos (`focus-visible:ring-2 focus-visible:ring-violet-500`)

### Performance
- Imágenes: formato `.webp` + `loading="lazy"` + `width` y `height` definidos
- Fuentes: `rel="preconnect"` y `display=swap`
- Video YouTube: cargar solo cuando el hero es visible (no bloquear LCP)
- AOS solo en elementos below the fold

---

## 🚀 Deploy en Hostinger

### Manual
```bash
npm run build
# Subir contenido de /dist a /public_html/ via FTP (FileZilla u otro)
```

### GitHub Actions (automatizado)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci && npm run build
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

**GitHub Secrets necesarios:**
- `FTP_SERVER` — ej: `ftp.vive-ia.com`
- `FTP_USERNAME` — usuario FTP de Hostinger
- `FTP_PASSWORD` — contraseña FTP de Hostinger

---

## 🔍 Checklist antes de cada commit

- [ ] `npm run build` sin errores
- [ ] Responsive verificado en 375px, 768px, 1280px
- [ ] Todas las imágenes con `alt`
- [ ] Links de WhatsApp y Calendly funcionando
- [ ] Formulario conectado al webhook (probar en dev con console)
- [ ] AOS inicializado en BaseLayout (`AOS.init()` al final del body)
- [ ] Sin `console.log` residuales en producción

---

## 📋 Estado del proyecto

Ver `VIVE-IA_PRD.md` para el detalle completo de contenido, copy, secciones y assets.
Los assets de imagen (fotos del equipo, logos) se encuentran en `/public/images/`.
El video hero se embebe desde YouTube (no se hostea localmente).
