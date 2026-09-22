# Menswear waitlist — Klaviyo form `T43KxT`

## Embed in mega menu

Default embed (Menswear block → **Waitlist embed HTML**):

```html
<div class="klaviyo-form-T43KxT"></div>
```

Subscribers go to the **list configured on that form** in Klaviyo (Audiences → Sign-up forms → open form → linked list).

## Shopify backup / production theme

1. **Klaviyo app** (recommended): **Online Store → Themes → Customize → App embeds** → enable **Klaviyo onsite tracking**.  
   Do **not** add a second Klaviyo script if the app already loads `klaviyo.js` (PHYLUM uses company id `WhDwC2`).

2. **PHYLUM mega menu** → Menswear block:
   - **Show waitlist area** = on  
   - **Waitlist embed HTML** = `<div class="klaviyo-form-T43KxT"></div>`

3. Re-upload **`phylum-mega-nav.js`** (re-inits embed when the menswear panel opens).

## Render prototype

Loads Klaviyo onsite JS for `WhDwC2` automatically (same as shopphylum.com).

## Thank-you / after submit

Configure in **Klaviyo**, not in theme code:

1. **Sign-up forms** → form **T43KxT** → **Behavior** / **Submit success**
2. Choose one:
   - **Show success message** (recommended for mega menu — user stays in the dropdown)
   - **Redirect to URL** — e.g. `https://shopphylum.com/pages/menswear-waitlist-thank-you`  
     Create that page in **Online Store → Pages** first.

Redirect sends users **off the current page** (menu closes). Inline success keeps them in context.

## Remove white form background

1. **Theme:** `phylum-mega-nav-editor.css` includes overrides for `.klaviyo-form-T43KxT` on the green panel.
2. **Klaviyo form editor:** **Styles** → set form / column **Background** to **transparent** (or match `#535538`).

If a white box remains, Klaviyo may be using an inner wrapper—inspect in DevTools and add a selector, or set background in the Klaviyo **Email Opt-In** step styles.

## QA

- Open **Menswear** mega panel → email field appears (Klaviyo-styled).  
- Submit test email → profile appears in Klaviyo list tied to form **T43KxT**.  
- Test mobile drawer menswear accordion the same way.
