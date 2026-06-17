# Clementine Motorsports — clementinemotorsports.com
## Deployment Guide

---

### File Structure
```
clementine-motorsports/
├── index.html              ← Homepage
├── fleet.html              ← Full fleet index
├── contact.html            ← Contact / booking form
├── vehicles/
│   ├── lamborghini-urus.html
│   ├── bentley-bentayga.html
│   ├── corvette-c8.html
│   ├── mercedes-amg-gtc.html
│   ├── mercedes-g63.html
│   ├── bmw-m240i.html
│   ├── tesla-model-y.html
│   └── bmw-x3.html
├── assets/
│   ├── style.css
│   ├── main.js
│   ├── bmw-m240i-1.jpeg   ← Replace with your photos
│   ├── bmw-m240i-2.jpeg
│   └── bmw-m240i-3.jpeg
├── vercel.json             ← Vercel routing config
├── robots.txt              ← Crawler permissions
└── sitemap.xml             ← Google sitemap
```

---

### Deploy to Vercel (Recommended — Free)

1. **Create a Vercel account** at vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. From the `clementine-motorsports/` folder:
   ```
   vercel login
   vercel --prod
   ```
4. Follow prompts — choose "No framework" when asked
5. Set custom domain:
   - Go to vercel.com → your project → Settings → Domains
   - Add `clementinemotorsports.com` and `www.clementinemotorsports.com`
   - Vercel will give you DNS records to add at your registrar

---

### DNS Setup (Porkbun / Namecheap / wherever your domain lives)

Add these records:
| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 76.76.21.21            |
| CNAME | www  | cname.vercel-dns.com   |

SSL is automatic and free via Vercel.

---

### Adding Vehicle Photos

For each vehicle, drop photos in `assets/` and update the `<img src>` tags in the relevant vehicle page.

Naming convention:
- `assets/lamborghini-urus-1.jpeg`
- `assets/lamborghini-urus-2.jpeg`
- etc.

Then in each `vehicles/lamborghini-urus.html`, replace the `<div class="placeholder">` blocks with:
```html
<img src="../assets/lamborghini-urus-1.jpeg" alt="2019 Lamborghini Urus rental Chicago — Clementine Motorsports" />
```

**Always include descriptive alt text for SEO.**

---

### Adding Turo Links

In each vehicle page that has a Turo listing, find the booking button:
```html
<a class="btn-main" href="../contact.html">Inquire to Book</a>
```
Replace with:
```html
<a class="btn-main" href="https://turo.com/us/en/car-rental/united-states/chicago-il/YOUR-LISTING-URL" target="_blank">Book on Turo</a>
```

Also update the `contact.html` sidebar Turo link section.

---

### After Deploy: SEO Checklist

- [ ] Submit sitemap to Google Search Console: search.google.com/search-console
  - Add property → URL prefix → `https://clementinemotorsports.com`
  - Submit `https://clementinemotorsports.com/sitemap.xml`
- [ ] Create Google Business Profile: business.google.com
  - Category: "Car Rental Agency"
  - Add all vehicle photos
  - Collect reviews (mention "manual transmission", "exotic", "Chicago")
- [ ] Update contact form email in `assets/main.js` (line: `hello@clementinemotorsports.com`)
- [ ] Replace placeholder photos for all vehicles
- [ ] Add Turo listing URLs to each vehicle page and contact.html

---

### Email Setup

Update the email address in `assets/main.js`:
```js
window.location.href = `mailto:hello@clementinemotorsports.com?...`
```

For production, consider replacing the mailto handler with a real form backend:
- **Formspree** (formspree.io) — free, just change the form action
- **Netlify Forms** — if you ever switch to Netlify
- **EmailJS** — client-side email sending without a backend
