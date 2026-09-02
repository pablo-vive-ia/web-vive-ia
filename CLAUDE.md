# CLAUDE.md — VIVE-IA Website

Este archivo guía a Claude Code en el desarrollo del sitio web de VIVE-IA.
Leé este archivo completo antes de tocar cualquier archivo del proyecto.

> Última revisión a fondo: 2026-09-02, contra el estado real del código y del
> deploy (no contra lo que decía una versión vieja de este mismo archivo).

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

**Dominio en producción:** `https://vive-ia.com`
**Infraestructura:** VPS DigitalOcean + Easypanel + Docker + nginx (ver sección Deploy). **No es Hostinger ni FTP** — si ves esa idea en algún lugar, está desactualizada.

---

## Stack tecnológico

```
Framework:    Astro 6.x          (generación estática, output: 'static')
Estilos:      Tailwind CSS 4.x   (config CSS-first vía @theme en src/styles/global.css,
                                   NO hay tailwind.config.mjs — no lo recrees)
Animaciones:  AOS.js (CDN)       (scroll reveals) + Three.js (fondos animados en
                                   index/contacto/desarrollos, ver más abajo)
Íconos:       SVG inline         (a mano en los componentes; lucide-astro está
                                   instalado pero no se usa activamente)
Formulario:   fetch() → n8n      (contacto.astro, webhook ya configurado)
Serving:      nginx:alpine       (Dockerfile en la raíz + nginx.conf propio)
Deploy:       Easypanel          (build automático desde GitHub vía Dockerfile)
```

**No usar:**
- ❌ React / Vue / Svelte (no se necesita JS reactivo)
- ❌ CSS Modules ni styled-components
- ❌ Librerías de UI externas (shadcn, DaisyUI, etc.)
- ❌ Frameworks CSS alternativos a Tailwind
- ❌ `localStorage` o `sessionStorage`

**Sobre las animaciones 3D:** `index.astro`, `contacto.astro` y `desarrollos.astro` corren cada uno su propio canvas Three.js/WebGL2 en un `<script>` de página. Todos pausan el loop de `requestAnimationFrame` cuando el canvas sale del viewport (`IntersectionObserver`) y respetan `prefers-reduced-motion`. Si agregás un canvas animado nuevo, replicá ese patrón — no arranques un `requestAnimationFrame` que corra para siempre sin importar si es visible.

---

## Estructura del proyecto

```
web_vive_ia/
├── Dockerfile                   ← FROM nginx:alpine, copia dist/ + nginx.conf
├── nginx.conf                   ← config real de producción (headers, CSP,
│                                   Link header, negociación de Markdown)
├── astro.config.mjs
├── tsconfig.json
├── package.json                 ← "build" corre astro build + generate-markdown.mjs
│
├── scripts/
│   ├── convert-to-webp.mjs      ← conversión manual de imágenes a WebP (no corre en build)
│   └── generate-markdown.mjs    ← genera dist/**/*.md para "Markdown for Agents"
│
├── public/
│   ├── favicon.ico, favicon.svg, apple-touch-icon
│   ├── robots.txt                ← incluye Content-Signal por user-agent
│   ├── llms.txt                  ← resumen de VIVE-IA para LLMs/agentes
│   ├── .htaccess                 ← INERTE en producción (nginx no lo lee).
│   │                                Se deja solo por si algún día se sirve
│   │                                el mismo dist/ desde Apache. La config
│   │                                real de headers vive en nginx.conf.
│   ├── scripts/aos-init.js       ← AOS.init() externo, no inline (ver nota
│   │                                de CSP más abajo — igual quedó con
│   │                                'unsafe-inline', pero este sigue siendo
│   │                                el patrón correcto para scripts nuevos)
│   ├── video/
│   └── images/                   ← todo en .webp
│
├── src/
│   ├── lib/
│   │   └── contactForm.ts       ← sanitización/validación/POST del form de
│   │                                contacto — un solo punto de verdad
│   │                                compartido entre contacto.astro (DOM +
│   │                                honeypot) y BaseLayout.astro (tool WebMCP)
│   ├── styles/
│   │   └── global.css           ← @theme de Tailwind 4 (colores, fuente) — es
│   │                                el reemplazo de tailwind.config.mjs
│   ├── layouts/
│   │   └── BaseLayout.astro     ← head, JSON-LD, Header/Footer/WhatsAppFAB,
│   │                                AOS init, tool WebMCP submit_contact_form
│   │                                (registrada acá, no en contacto.astro,
│   │                                para que esté disponible en todo el sitio)
│   ├── components/
│   │   ├── Header.astro         ← nav + dropdown "Soluciones" (hover + teclado)
│   │   ├── Footer.astro
│   │   ├── WhatsAppFAB.astro    ← botón flotante sticky WhatsApp
│   │   ├── HeroPhrase.astro     ← typewriter del subtítulo del hero (texto
│   │   │                           fijo hoy; el comentario menciona Gemini
│   │   │                           pero esa integración nunca se conectó)
│   │   ├── SectionBadge.astro   ← pill/badge encima de H2
│   │   ├── StepCard.astro       ← card de proceso numerado (01, 02...)
│   │   └── MetricCounter.astro  ← contador animado al entrar en viewport
│   │
│   └── pages/
│       ├── index.astro                              ← Home
│       ├── quienes-somos.astro                       ← About
│       ├── contacto.astro                            ← Contacto (form + WebMCP tool)
│       ├── desarrollos.astro                         ← Desarrollos personalizados
│       └── soluciones/
│           ├── index.astro                          ← redirect 301 a /soluciones/ecommerce
│           ├── ecommerce.astro                       ← Agentes E-commerce
│           └── mentores-marcas-personales.astro      ← Agentes Mentores
```

No hay `Button.astro`, `Card.astro`, `ValueCard.astro`, `ProfileCard.astro`, `PricingCard.astro`, `PainPoint.astro`, `Benefit.astro` ni `ContactForm.astro` como componentes separados — esos patrones están resueltos inline dentro de cada página con clases de Tailwind repetidas. Si vas a extraer alguno a componente, es una decisión de refactor válida, pero no asumas que ya existen.

---

## Sistema de diseño

### Paleta de colores (Tailwind 4, `src/styles/global.css`)

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --color-brand-bg: #0A0A0F;       /* fondo principal */
  --color-brand-card: #111118;     /* fondo cards */
  --color-brand-surface: #1A1A28;  /* superficies elevadas */

  --color-accent: #7C3AED;         /* violet-600 */
  --color-accent-light: #A855F7;   /* violet-500 */
  --color-cyan-brand: #06B6D4;     /* cyan-500 */

  --color-text-primary: #F8FAFC;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #475569;
}
```

`--color-text-muted` (#475569, ~slate-600) da muy poco contraste sobre el fondo casi negro (~2.6:1, bajo el mínimo WCAG AA). Para texto que se tiene que leer, usar `text-slate-400` (#94A3B8, ~7:1) en vez de `text-slate-500`/`text-slate-600`, salvo texto puramente decorativo.

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

### Accesibilidad — patrones ya resueltos, replicalos
- Todo `<img>` con `alt` descriptivo.
- `target="_blank"` siempre con `rel="noopener noreferrer"`.
- `<label>` con `for` apuntando al `id` real del campo (no confiar en que envolver alcanza).
- Dropdowns con `group-hover` deben tener también su variante `group-focus-within` para ser navegables por teclado (ver el dropdown "Soluciones" en `Header.astro`).
- Animaciones continuas (Three.js, typewriter, etc.) deben respetar `prefers-reduced-motion` y pausarse fuera de viewport.

---

## Páginas y orden de secciones

Los números de sección de cada página están en comentarios `<!-- N. NOMBRE -->` dentro del archivo — son la fuente de verdad, esto es solo un resumen para orientarte rápido.

### Home (`/` — `index.astro`)
1. Hero (video/typewriter + CTAs) 2. Problema 3. Proceso (4 pasos) 4. Servicios (grid de cards) 5. Resultados + métricas animadas 6. Diferencial (antes/después) 7. Filosofía 8. Quiénes somos (resumido) 9. CTA final

### Quiénes Somos (`/quienes-somos`)
1. Hero 2. Somos VIVE-IA 3. Manifiesto 4. Propósito/Misión/Visión 5. Valores 6. Proceso diferencial 7. Equipo (bios completas) 8. CTA final

### Desarrollos (`/desarrollos`)
Hero (shader WebGL2 propio, no Three.js) → Servicios → Portfolio → CTA final. Página más nueva, no tiene numeración en comentarios como las demás.

### Soluciones E-commerce (`/soluciones/ecommerce`)
1. Hero 2. Métricas 3. Problemas 4. Qué es un agente conversacional 5. Casos de uso 6. Beneficios 7. Planes (Bronce/Plata/Oro) 8. CTA final

### Soluciones Mentores (`/soluciones/mentores-marcas-personales`)
1. Hero 2. Problemas 3. Qué hace el agente 4. Factor diferencial 5. Casos de uso 6. Beneficios 7. Métricas de impacto 8. Planes 9. CTA final

### Contacto (`/contacto`)
1. Hero 2. WhatsApp directo 3. Formulario + bloque de valor 4. Confianza (24hs / sin compromiso / confidencial) 5. Cierre emocional. **No hay integración con Cal.com** — si hace falta agendar, hoy es solo por WhatsApp/formulario.

`/soluciones` (sin sufijo) no es una página con contenido: es un redirect 301 a `/soluciones/ecommerce`.

---

## Integraciones y URLs clave

```
WhatsApp:            https://wa.me/5492665258874   (único número usado en todo el sitio)
Email:               contacto@vive-ia.com
Instagram:           https://www.instagram.com/vive_ia
YouTube:              https://www.youtube.com/@ViveIA-AgenciadeAutomatizaci%C3%B3n
Formulario webhook:  https://n8n.vive-ia.com/webhook/contacto-vive-ia
```

### Formulario de contacto

La lógica de sanitización/validación/POST vive en `src/lib/contactForm.ts` (`sanitizePayload`, `validateContactForm`, `postContactPayload`) — **un solo punto de verdad**, no la dupliques. La usan dos lugares distintos:
- `src/pages/contacto.astro` — el DOM real del form, con el submit humano y el **honeypot** (`name="website"`, oculto; si llega completo se descarta el submit sin avisarle al bot).
- `src/layouts/BaseLayout.astro` — la tool de WebMCP `submit_contact_form` (ver abajo), registrada ahí (no en `contacto.astro`) para que esté disponible en **todas** las páginas, no solo en `/contacto`.

**Campos reales:**
- `nombre` — text, required, maxLength 100
- `empresa` — text, required, maxLength 120
- `email` — email, required, maxLength 254
- `telefono` — tel, required, maxLength 20, valida formato con regex
- `presupuesto` — select, required: `hasta-500` | `500-1000` | `1000-3000` | `mas-3000`
- `red_social` — text, opcional, maxLength 80
- `mensaje` — textarea, required, maxLength 2000

### Agent readiness (implementado — no re-hacer sin releer esto)

El sitio pasó por varias rondas de "agent-ready" auditando contra checks tipo isitagentready.com. De los ~14 puntos posibles, **solo 3 aplican** a un sitio de marketing sin API/auth/pagos, y ya están implementados:

- **`llms.txt`** (`public/llms.txt`) — resumen de VIVE-IA para LLMs.
- **`Link` header en el home** (`nginx.conf`) — `</llms.txt>; rel="service-doc"`, solo en `/`.
- **Content Signals en `robots.txt`** — `Content-Signal: search=yes, ai-input=yes, ai-train=no` en cada bloque de user-agent (repetido en cada uno: un bot que matchea su propio bloque no hereda del `*`).
- **Markdown for Agents** — `scripts/generate-markdown.mjs` genera un `.md` por página en `dist/` durante el build; `nginx.conf` lo sirve con `Content-Type: text/markdown` cuando el request trae `Accept: text/markdown`. Si agregás una página nueva, sumala también a `PAGES` en ese script y a los `rewrite` de `nginx.conf`.
- **WebMCP** — `BaseLayout.astro` registra la tool `submit_contact_form` vía `document.modelContext.registerTool()` (con feature-detection; hoy ningún browser la soporta en producción, es a futuro), disponible en las 7 páginas del sitio. Usa `src/lib/contactForm.ts`; si el DOM del form existe en la página actual (`/contacto`) refleja los valores ahí antes de enviar, si no, envía igual sin tocar el DOM.

**Deliberadamente NO implementado, y ya se preguntó/confirmó varias veces — no lo reabras sin un motivo de negocio real nuevo:** API catalog, OAuth/OIDC discovery, OAuth Protected Resource Metadata, `auth.md`, MCP Server Card, Agent Skills index, ARD manifest, x402, MPP, UCP, ACP. Son specs para sitios con API pública, auth de terceros, servidor MCP o checkout/pagos — VIVE-IA no tiene nada de eso. Publicar esos archivos igual sería metadata falsa (endpoints de auth/pago que no existen), no "estar más agent-ready". Si el scanner los sigue marcando en rojo, es esperado — no implementarlos fue una decisión, no un olvido. Solo reabrir esto si VIVE-OS (u otro proyecto) termina exponiendo una API pública real, auth de terceros o cobro por uso.

### ⚠️ CSP y JSON-LD — no saques `'unsafe-inline'` de `script-src` sin este contexto

`nginx.conf` tiene `script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com`. En algún momento se sacó `'unsafe-inline'` asumiendo que los `<script type="application/ld+json">` de `BaseLayout.astro` quedaban exentos de la CSP por no ser un tipo ejecutable — **error**: Chrome evalúa esos bloques contra `script-src` al parsear el HTML, antes de fijarse que el `type` no es ejecutable, y los bloquea. Eso rompió el render de **todas** las páginas en Chrome (Firefox es más laxo en ese orden, por eso "andaba" ahí y tardó en detectarse). Si en algún momento se quiere volver a sacar `'unsafe-inline'`, hay que resolver el JSON-LD con hashes `sha256-` por bloque (serían distintos por página, ya que el schema varía) o externalizarlo — no alcanza con sacar la keyword y asumir que el `type` alcanza. Probar siempre en Chrome antes de dar un cambio de CSP por bueno, no solo en Firefox.

---

## Comandos de desarrollo

```bash
npm install          # instalar dependencias
npm run dev           # servidor de desarrollo (http://localhost:4321)
npm run build          # astro build + genera dist/**/*.md para Markdown for Agents
npm run preview        # preview del build (Vite — NO refleja headers/CSP/nginx)
npm run check           # astro check (type-check, usa @astrojs/check + typescript)
```

`npm run preview` sirve el `dist/` con el server de Vite, no con nginx: no vas a ver los headers de seguridad, la CSP, el `Link` header ni la negociación de Markdown ahí. Para validar eso hace falta levantar el `Dockerfile` real (con Docker local) o probarlo después de deployar.

### `astro.config.mjs` (config real, no la recrees distinto)

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vive-ia.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
```

Tailwind entra como plugin de Vite (`@tailwindcss/vite`), no como integración de Astro (`@astrojs/tailwind` NO está instalado). No hay `tailwind.config.mjs` — el theme vive en `src/styles/global.css` vía `@theme`.

---

## Patrones de componentes reales

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

### MetricCounter (contador animado con IntersectionObserver)
```astro
---
interface Props { value: number; label: string; prefix?: string; suffix?: string; }
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
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.value ?? '0');
      const span = el.querySelector('.counter-value');
      if (!span) return;
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        span.textContent = current.toLocaleString('es-AR');
        if (current >= target) clearInterval(timer);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => observer.observe(c));
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
```

---

## 🗺 SEO — Metadatos por página

`BaseLayout.astro` recibe `title`, `description`, `ogImage`, `canonicalURL` y `schema` (un objeto o array de objetos JSON-LD) por props, e inyecta: meta description, canonical, Open Graph completo (con `og:image:width/height`), Twitter Card, favicon, fuentes con preconnect, AOS, y el/los `<script type="application/ld+json">` de `schema` sumados a los schemas globales de Organization + WebSite que ya trae el layout. Cada página define su propio `schema` array (FAQPage, ContactPage, VideoObject, etc. según corresponda) — mirá `contacto.astro` o `index.astro` como referencia antes de armar uno nuevo.

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
- Un componente por archivo, nombre en PascalCase.
- Props tipadas con TypeScript (`interface Props { ... }` + `Astro.props`, o inline).
- Estilos vía clases Tailwind; `<style>` solo en casos puntuales (ej. `@keyframes` de `HeroPhrase.astro`).
- Scripts del lado cliente dentro de `<script>` al final del componente/página (Astro los procesa como módulos ES y los bundlea aparte — no uses `is:inline` salvo que necesites que quede literal en el HTML, como el init de AOS).
- Animaciones AOS declaradas con `data-aos="fade-up"` y `data-aos-delay="100"`.

### Tailwind
- Clases directo en el HTML, sin `@apply` salvo reutilización muy alta.
- Responsive: `md:` tablet (768px+), `lg:` desktop (1024px+).
- Dark mode: el sitio es siempre dark, no usar `dark:` prefix.

### Accesibilidad
Ver la sección de accesibilidad dentro de "Sistema de diseño" más arriba — son patrones ya resueltos en el código, no reinventarlos ni regresar a una versión más simple.

### Performance
- Imágenes: `.webp` + `loading="lazy"`. Bastantes `<img>` de cards no tienen `width`/`height` explícitos (deuda pendiente, puede causar CLS) — si tocás una card, aprovechá y agregalos.
- Fuentes: `rel="preconnect"` y `display=swap`.
- Three.js/WebGL: seguir el patrón de pausa por `IntersectionObserver` + `prefers-reduced-motion` (ver arriba).

---

## 🚀 Deploy — DigitalOcean + Easypanel + Docker + nginx

**Esto reemplaza cualquier mención anterior de Hostinger/FTP/GitHub Actions en este archivo — esas nunca fueron el flujo real, o dejaron de serlo.**

Easypanel (`panel.vive-ia.com`) tiene el servicio `vive-ia-web` apuntando directo al repo de GitHub `pablo-vive-ia/web-vive-ia`, rama `master`, y lo compila usando el `Dockerfile` de la raíz del repo (ruta de compilación `/`). **No hay paso manual de `docker build` en el VPS**: Easypanel lo hace solo al apretar "Implementar".

```bash
npm run build              # genera dist/ (incluye los .md de agent discovery)
git add -A && git commit    # commitear dist/ junto con el código fuente —
                             # el Dockerfile copia dist/ tal cual, tiene que
                             # estar actualizado en el commit
git push origin <rama>
# En panel.vive-ia.com → vive-ia-web → botón "Implementar"
```

`Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` reemplaza el `default.conf` stock de la imagen y agrega: headers de seguridad (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS), la CSP (ver nota de JSON-LD arriba), bloqueo de dotfiles (con excepción explícita para `/.well-known/`, que es un namespace público estándar — RFC 8615 — no un archivo oculto; sin esa excepción cualquier ruta ahí abajo daba 403 en vez del 404 normal), el `Link` header del home, y la negociación de Markdown for Agents (ver sección de arriba). TLS se termina en el reverse proxy de Easypanel (Traefik) — el contenedor solo habla HTTP puertas adentro, los headers viajan igual porque el proxy los reenvía.

**Reglas de esta sección (del `CLAUDE.md` global, aplicadas acá):**
- No cambiar este workflow de deploy sin confirmación explícita de Pablo.
- No commitear directo a `master`/rama principal si el cambio no está confirmado — branchear cuando corresponda.
- Validar sintaxis de `nginx.conf` antes de asumir que un cambio funciona: no hay Apache/nginx local en este entorno para correr `nginx -t`, así que un cambio ahí se prueba con Docker local si está disponible, o recién se confirma después del deploy.

---

## 🔍 Checklist antes de cada commit

- [ ] `npm run check` sin errores (type-check)
- [ ] `npm run build` sin errores — y revisar que generó los `.md` esperados en `dist/`
- [ ] Responsive verificado en 375px, 768px, 1280px
- [ ] Todas las imágenes con `alt`
- [ ] Links de WhatsApp funcionando, `target="_blank"` con `rel="noopener noreferrer"`
- [ ] Formulario conectado al webhook (probar en dev con consola/network tab)
- [ ] Si agregaste una página: sumarla a `scripts/generate-markdown.mjs` (array `PAGES`) y a los `rewrite` de `nginx.conf` si querés que tenga versión Markdown
- [ ] AOS inicializado (`public/scripts/aos-init.js`, referenciado desde `BaseLayout.astro`)
- [ ] Sin `console.log` residuales en producción
- [ ] `dist/` regenerado y commiteado junto con el código fuente antes de pushear (el deploy lo copia tal cual)

---

## 📋 Estado del proyecto

No existe `VIVE-IA_PRD.md` en este repo — si necesitás el detalle de contenido/copy, es este mismo código fuente (`src/pages/*.astro`) la referencia, no un PRD externo.

Los assets de imagen (fotos del equipo, logos, íconos de sección) están en `/public/images/`, todos en `.webp`. No hay video hosteado localmente — el video del hero se embebe desde YouTube.
