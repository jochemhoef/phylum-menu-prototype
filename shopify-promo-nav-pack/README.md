# PHYLUM Promo Nav → Shopify backup theme

Use this pack on **Palo Alto Theme Backup Sep 15, 2026**.

## Merchant-editable install (recommended)

**Follow `INSTALL-EDITABLE.md`** — section + blocks + Navigation menus (client-friendly).

| File | Theme destination |
|------|-------------------|
| `sections/phylum-mega-nav.liquid` | **Sections** |
| `snippets/phylum-mega-nav-column.liquid` | **Snippets** (helper) |
| `assets/phylum-mega-nav.css` | **Assets** |
| `assets/phylum-mega-nav.js` | **Assets** |
| `assets/phylum-mega-nav-editor.css` | **Assets** |

**Remove** the old static `snippets/phylum-mega-nav.liquid` if you added it during the first pass.

## Legacy static snippet (deprecated)

The monolithic `snippets/phylum-mega-nav.liquid` is **developer-only**. Do not use for client editing.

## Responsive behavior (fixed in this pack)

- Desktop bar uses a **3-column grid** (logo | nav | icons) so links don’t collide with search.
- Nav links use **`white-space: nowrap`** and tighter gaps below **1440px** and **1320px**.
- **Hamburger + mobile drawer at ≤1200px** (was 1080px), so you don’t get wrapped “Kitchen & Dining” + cramped icons in the awkward middle zone.

## Promo Nav default

- On the storefront, **menswear uses the green promo mega panel + “Coming Soon” pill** when there is **no** demo switcher in the DOM.
- The prototype’s bottom **Current Nav / Promo Nav** toggle is **not** included in the snippet (production = promo only).

## Wire into Palo Alto

1. **Theme settings → Customize** on the backup theme: note how the current header is built (usually `sections/header.liquid` + `snippets/`).
2. In **`layout/theme.liquid`**, on the `<html>` tag, you can add `data-nav-version="promo"` (optional; JS sets promo if the switcher is absent).
3. Before `</head>`, add:

```liquid
{{ 'phylum-mega-nav.css' | asset_url | stylesheet_tag }}
```

4. Before `</body>`, add:

```liquid
<script src="{{ 'phylum-mega-nav.js' | asset_url }}" defer></script>
```

5. In **`sections/header.liquid`** (or a new section on the backup only):
   - Hide or remove the theme’s default desktop nav **only on the backup theme** if you’re A/B testing, **or**
   - Replace the nav block with:

```liquid
{% render 'phylum-mega-nav' %}
```

6. Keep Palo Alto’s **cart drawer / search modal** hooks if you still need them: swap the placeholder icon buttons in the snippet for the theme’s existing `{% render 'icon-search' %}` patterns and `routes.cart_url` as you integrate.

## Announcement bar

The snippet does **not** include the yellow shipping strip. Either keep Palo Alto’s announcement bar section or add your copy there in the theme editor.

## Waitlist form

The promo panel form is **prototype-only** (shows success UI on submit). Connect it to Shopify Customer API, Klaviyo, or a form app before production.

## Local reference

Full HTML prototype: repo root `index.html` (matches this pack’s CSS/JS after responsive updates).
