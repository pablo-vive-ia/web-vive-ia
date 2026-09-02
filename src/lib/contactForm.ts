// Lógica compartida del formulario de contacto: sanitización, validación y
// envío al webhook de n8n. La usan tanto el submit "humano" en
// contacto.astro (DOM real, con honeypot) como la tool de WebMCP registrada
// en BaseLayout.astro (disponible en todas las páginas, no solo /contacto)
// — un único punto de verdad para no duplicar reglas de validación.

export type ContactPayload = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  presupuesto: string;
  red_social: string;
  mensaje: string;
};

const WEBHOOK_URL = 'https://n8n.vive-ia.com/webhook/contacto-vive-ia';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\+\d\s\-\(\)]{7,20}$/;
const PRESUPUESTO_ALLOWED = new Set(['hasta-500', '500-1000', '1000-3000', 'mas-3000']);

/** Elimina tags HTML/SVG y recorta espacios */
function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

/** Trunca a maxLen caracteres después de stripTags */
function sanitize(value: string, maxLen: number): string {
  return stripTags(value).slice(0, maxLen);
}

export function sanitizePayload(raw: Record<string, string>): ContactPayload {
  return {
    nombre:      sanitize(raw.nombre      ?? '', 100),
    empresa:     sanitize(raw.empresa     ?? '', 120),
    email:       sanitize(raw.email       ?? '', 254).toLowerCase(),
    telefono:    sanitize(raw.telefono    ?? '', 20),
    presupuesto: sanitize(raw.presupuesto ?? '', 20),
    red_social:  sanitize(raw.red_social  ?? '', 80),
    mensaje:     sanitize(raw.mensaje     ?? '', 2000),
  };
}

export function validateContactForm(d: ContactPayload): string | null {
  if (!d.nombre)     return 'El campo Nombre es obligatorio.';
  if (!d.empresa)    return 'El campo Empresa es obligatorio.';
  if (!d.email)      return 'El campo Email es obligatorio.';
  if (!EMAIL_RE.test(d.email))  return 'El formato del email no es válido.';
  if (!d.telefono)   return 'El campo Teléfono es obligatorio.';
  if (!PHONE_RE.test(d.telefono)) return 'El teléfono solo puede contener dígitos, +, espacios, guiones o paréntesis.';
  if (!d.presupuesto || !PRESUPUESTO_ALLOWED.has(d.presupuesto))
                     return 'Seleccioná un rango de presupuesto válido.';
  if (!d.mensaje)    return 'Contanos brevemente qué querés automatizar.';
  return null;
}

/** POSTea el payload ya sanitizado y validado al webhook de n8n. No toca el DOM. */
export async function postContactPayload(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return { ok: true, message: 'Mensaje enviado. Te contactaremos en menos de 24 horas.' };
  } catch {
    return { ok: false, message: 'Ocurrió un error. Escribinos por WhatsApp y lo resolvemos.' };
  }
}

// ── WebMCP: definición de la tool, compartida entre páginas ─────────────
// Se registra desde BaseLayout.astro (disponible en todo el sitio, no solo
// en /contacto) para que un agente no necesite "saber" que tiene que
// navegar a una página específica para dejar un lead.
export const CONTACT_TOOL_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    nombre: { type: 'string', maxLength: 100, description: 'Nombre y apellido de la persona de contacto.' },
    empresa: { type: 'string', maxLength: 120, description: 'Nombre de la empresa o proyecto.' },
    email: { type: 'string', format: 'email', maxLength: 254, description: 'Email de contacto.' },
    telefono: { type: 'string', maxLength: 20, description: 'Teléfono de contacto, idealmente con código de país.' },
    presupuesto: {
      type: 'string',
      enum: ['hasta-500', '500-1000', '1000-3000', 'mas-3000'],
      description:
        'Rango de presupuesto mensual en USD: hasta-500 (Hasta USD 500), 500-1000 (USD 500 a 1.000), 1000-3000 (USD 1.000 a 3.000), mas-3000 (Más de USD 3.000).',
    },
    red_social: { type: 'string', maxLength: 80, description: 'Usuario de red social, opcional. Ej: @vive_ia.' },
    mensaje: { type: 'string', maxLength: 2000, description: 'Breve descripción de qué proceso quiere automatizar.' },
  },
  required: ['nombre', 'empresa', 'email', 'telefono', 'presupuesto', 'mensaje'],
} as const;
