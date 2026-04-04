# Design System Specification: VIVE-IA

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Intelligence"**

This design system is engineered to move beyond the rigid, "boxed-in" feel of standard SaaS templates. It celebrates the intersection of human-centric AI and high-end automation through an editorial lens. We evoke trust through precise typography and ambition through deep, atmospheric layering.

By leveraging **intentional asymmetry**, we break the predictable grid. Content should feel curated, not just slotted. We use overlapping elements and high-contrast typographic scales to create a visual rhythm that feels dynamic and "alive"—mimicking the very intelligence VIVE-IA provides.

---

## 2. Colors & Surface Philosophy

The color palette is rooted in a deep, obsidian core with vibrant, electric accents.

### The "No-Line" Rule
Sectioning must be achieved through **tonal transitions**, not 1px solid borders. High-end design relies on the proximity of values to define space. Use `surface-container-low` against `background` to create distinction.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent materials.
*   **Base:** `background` (#131318)
*   **Sub-Section:** `surface-container-low` (#1B1B20)
*   **Primary Card:** `surface-container` (#1F1F25)
*   **Floating/Elevated:** `surface-container-high` (#2A292F)

### The "Glass & Gradient" Rule
To achieve the premium "Linear-style" aesthetic, floating elements should utilize **Glassmorphism**:
*   **Fill:** `surface-variant` at 40-60% opacity.
*   **Backdrop Blur:** 12px to 20px.
*   **Signature Glow:** Use `primary-container` (#7C3AED) as a radial gradient background (15% opacity) behind hero sections to provide "soul" and depth.

---

## 3. Typography
We use **Inter** exclusively to maintain a clean, high-contrast, technical edge.

| Level | Size | Weight | Role |
| :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | 700 | Hero statements; high-impact editorial moments. |
| **headline-md** | 1.75rem | 600 | Key section headers; authoritative tone. |
| **title-md** | 1.125rem | 500 | Card titles and prominent UI labels. |
| **body-lg** | 1.0rem | 400 | Primary reading text; high readability. |
| **label-sm** | 0.6875rem | 600 | Micro-data; all-caps with 0.05em tracking. |

**Editorial Contrast:** Use `on-surface` for primary headings and `on-surface-variant` for secondary body text to create a clear, sophisticated hierarchy.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved via **Tonal Layering**. Instead of drop shadows, place a `surface-container-highest` element inside a `surface-container-low` parent to create natural focus.

### Ambient Shadows
When an element must float (Modals, Hover states):
*   **Shadow:** 0px 20px 40px rgba(0, 0, 0, 0.4).
*   **Tint:** Add a 4% tint of `primary` to the shadow color to simulate light refraction from the AI accents.

### The "Ghost Border"
For containment, use the **Ghost Border**:
*   **Token:** `outline-variant` (#4A4455).
*   **Opacity:** Max 20%. 
*   **Rule:** Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary-container` (#7C3AED); Text: `on-primary-container`. Corner radius: `md` (0.75rem). Use a subtle top-light gradient.
*   **Secondary:** Ghost style. `Ghost Border` with `secondary` (#4CD7F6) text.
*   **Tertiary:** No background. `on-surface-variant` text, shifting to `on-surface` on hover.

### Cards
*   **Structure:** No dividers. Use `spacing-8` (2rem) of internal padding.
*   **Separation:** Vertical white space is your primary separator. If content types differ significantly, shift the background color to `surface-container-low`.

### AI Activity Chips
*   **Style:** `surface-container-highest` background with a `primary` (violet) dot indicator.
*   **Interaction:** Subtle pulse animation on the dot to indicate "Human-centric AI" presence.

### Input Fields
*   **Base:** `surface-container-lowest` with a 10% `outline-variant` ghost border.
*   **Focus:** Border becomes `secondary` (cyan) at 50% opacity with a 2px inner glow.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts to draw the eye toward "Human-centric" imagery or key AI metrics.
*   **Do** apply `rounded-md` (0.75rem) to cards and `rounded-lg` (1rem) to larger containers.
*   **Do** allow the `primary` (violet) and `secondary` (cyan) accents to bleed into gradients to create atmosphere.

### Don't
*   **Don't** use solid 1px dividers or high-contrast borders. It breaks the "Ethereal Intelligence" aesthetic.
*   **Don't** use standard black (#000000). Always use the specified obsidian `background` (#131318).
*   **Don't** clutter the UI. If in doubt, increase spacing by one step on the `Spacing Scale`.
*   **Don't** use traditional "Drop Shadows" on flat cards; use tonal shifts instead.

---

## 7. Spacing Tokens
Maintain strict adherence to the spacing scale to ensure the "Editorial" feel:
*   **Section Padding:** `spacing-24` (6rem) or `spacing-20` (5rem).
*   **Card Internal:** `spacing-8` (2rem).
*   **Element Grouping:** `spacing-4` (1rem) or `spacing-3` (0.75rem).