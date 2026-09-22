# Install editable PHYLUM mega menu (backup theme)

## What to remove from your first attempt

| Remove or stop using | Replace with |
|----------------------|--------------|
| `snippets/phylum-mega-nav.liquid` (static HTML) | **Delete** after section works |
| `{% render 'phylum-mega-nav' %}` in header | **`{% section 'phylum-mega-nav' %}`** (see below) |
| `assets/phylum-wordmark.png` only in snippet | Logo via **section setting** (optional: keep file and pick in customizer) |

**Keep:** `phylum-mega-nav.css`, update **`phylum-mega-nav.js`** to the new version in this pack.

**Add:**

- `sections/phylum-mega-nav.liquid`
- `snippets/phylum-mega-nav-column.liquid` (small helper — not the old mega snippet)
- `assets/phylum-mega-nav-editor.css` (logo + mobile promo typography)

---

## 1. Upload files (Edit code)

Copy from `shopify-promo-nav-pack/` into the backup theme:

- **Sections** → add `phylum-mega-nav.liquid`
- **Snippets** → add `phylum-mega-nav-column.liquid`
- **Assets** → replace/update `phylum-mega-nav.js`, add `phylum-mega-nav-editor.css`
- **Assets** → keep `phylum-mega-nav.css` (already uploaded)

---

## 2. Load styles and script (`layout/theme.liquid`)

In `<head>`:

```liquid
{{ 'phylum-mega-nav.css' | asset_url | stylesheet_tag }}
{{ 'phylum-mega-nav-editor.css' | asset_url | stylesheet_tag }}
```

Before `</body>`:

```liquid
<script src="{{ 'phylum-mega-nav.js' | asset_url }}" defer></script>
```

Remove duplicate tags if you added these twice during the first install.

---

## 3. Show the section in the header

**Option A — Static section in header (simplest for backup test)**

In `sections/header.liquid`, near the top of the visible header (after opening wrappers), add:

```liquid
{% section 'phylum-mega-nav' %}
```

Hide Palo Alto’s built-in menu (comment out its `<nav>` / drawer trigger block, or use CSS on the backup only). Do **not** render the old `phylum-mega-nav` snippet.

**Option B — Header group (if theme uses `header-group.json`)**

In `sections/header-group.json`, add a section entry:

```json
{
  "type": "phylum-mega-nav",
  "settings": {
    "nav_version": "promo"
  }
}
```

Place it where the main navigation should appear. Remove duplicate nav sections if needed.

---

## 4. Theme customizer (client workflow)

1. **Online Store → Themes → Customize** (backup theme).
2. Select **PHYLUM mega menu** in the sidebar (or click the header area if using header group).
3. **Logo** — upload wordmark.
4. **Menswear dropdown mode** — Promo vs catalog.
5. Each **Menu item** block:
   - Top-level label
   - Column headings + **Column menu** → pick a menu from **Navigation**
   - Brand spotlight image, text, link
   - Menswear block: promo copy, image, waitlist (or app embed HTML)

6. **Online Store → Navigation** — create menus for each column, e.g.:
   - `Mega - Accessories - Wear`
   - `Mega - Accessories - Adorn`
   - `Mega - Accessories - Create`  
   Assign each to the matching **Column menu** dropdown in the block.

Reorder top-level items by dragging blocks in the customizer.

---

## 5. First-time preset

Adding the section with preset **“PHYLUM mega menu”** creates 9 blocks with column **headings** pre-filled (same structure as the prototype). You still assign **Navigation** menus and spotlight **images** in the customizer.

---

## 6. Client guide

Share **`CLIENT-GUIDE.md`** with the merchant.

---

## Notes

- Global CSS reset at the top of `phylum-mega-nav.css` still affects the whole store. For production, scope those rules under `.phylum-mega-nav-root` or strip them after backup testing.
- Waitlist: use **Waitlist app embed HTML** in the Menswear block, or set a real **form action URL**; `#` shows demo success only.
