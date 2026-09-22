# Add PHYLUM mega menu to Palo Alto `group-header`

`theme.liquid` only loads CSS/JS. The mega menu **section** must live in the **header group** (not via `{% section %}` in `theme.liquid` — Theme Check often flags that until the section is registered everywhere).

## Step 1 — Required files (checklist)

| Theme path | File |
|------------|------|
| **Sections** | `phylum-mega-nav.liquid` |
| **Snippets** | `phylum-mega-nav-column.liquid` |
| **Assets** | `phylum-mega-nav.css` |
| **Assets** | `phylum-mega-nav.js` |
| **Assets** | `phylum-mega-nav-editor.css` ← easy to forget |

If any asset line in `theme.liquid` is red, that file is missing from **Assets**.

## Step 2 — Add section in the customizer (easiest)

1. **Online Store → Themes → Customize** (backup theme).
2. At the top of the preview, click the **header** area.
3. **Add section** → choose **PHYLUM mega menu**.
4. Drag it **above** the default Header section (below announcement if you keep one).
5. **Save**.

If **PHYLUM mega menu** does not appear in the list, `sections/phylum-mega-nav.liquid` is missing or has a schema error — fix the section file first.

## Step 3 — Optional JSON edit (`sections/group-header.json`)

If you prefer code, open **`sections/group-header.json`** and merge (use your theme’s real section keys in `order`):

```json
"phylum_mega_nav": {
  "type": "phylum-mega-nav",
  "settings": {
    "nav_version": "promo"
  }
}
```

Add `"phylum_mega_nav"` to the `"order"` array where the nav should sit, e.g. after announcement:

```json
"order": ["announcement", "phylum_mega_nav", "header"]
```

## Step 4 — Hide duplicate Palo Alto nav

Re-upload **`phylum-mega-nav-editor.css`** (includes hide rules). Adjust selectors in that file if the old menu still shows.

## About other red lines in `theme.liquid`

Lines like `{% sections 'group-header' %}`, `{% render 'zoom-pswp' %}`, `{% render 'icon-select' %}` are **standard Palo Alto** — they were in your original layout. Theme Check sometimes marks them until the index rebuilds; if the live store worked before, they are not caused by PHYLUM.

Only these PHYLUM-related lines should need files on disk:

```liquid
{{- 'phylum-mega-nav.css' | asset_url | stylesheet_tag -}}
{{- 'phylum-mega-nav-editor.css' | asset_url | stylesheet_tag -}}
...
<script src="{{ 'phylum-mega-nav.js' | asset_url }}" defer="defer"></script>
```
