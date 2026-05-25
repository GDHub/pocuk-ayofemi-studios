# Ayofemi Studios — POC

A static, in-browser prototype of the Ayofemi Studios booking platform.
React + Babel in-browser (no build step). Everything is a static asset.

## Scope

- Static homepage with 3 hero layout variants
- Portfolio page (3 sample categories, keyboard-navigable lightbox)
- Booking form (date / time picker, service selector, add-ons) — stepper or single-page
- Basic admin panel (overview, bookings, services CRUD, availability calendar, clients)
- Payment gateway sandbox UI (Paystack / Flutterwave selector, card → 3-D Secure OTP)
- Email notification stub (rendered email mockup, SendGrid-style)
- Client account creation, login, and dashboard

## Deploy to Vercel

This is a pure static site — no build step, no framework, no Node runtime needed.

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel deploy --prod
```

### Option 2: Drag & drop
1. Go to https://vercel.com/new
2. Drag this folder onto the upload area
3. Vercel auto-detects it as a static site. Click Deploy.

### Option 3: Git
1. Push this folder to a GitHub repo
2. Import the repo at https://vercel.com/new
3. Framework preset: **Other** (no build command, no output directory)
4. Deploy

## Local preview

Any static server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Then open http://localhost:8000

> **Note**: opening `index.html` directly via `file://` will fail because the
> browser blocks loading `.jsx` files cross-origin. Always serve via HTTP.

## Test the booking happy path

1. Click **Book a session**
2. Pick a service (avoid days where the date number is divisible by 7 — those are stubbed as "booked")
3. Pick a time slot
4. Fill in your details
5. Continue to checkout
6. Use the prefilled sandbox card: `4084 0840 8408 4081` · `09/27` · `408`
7. Enter OTP `123456`
8. See the confirmation email mock

## Demo accounts

The auth screen has two demo shortcuts:
- **Demo as Client** — drops you in the client dashboard with sample bookings
- **Demo as Admin** — drops you in the admin panel

## Tweaks

Toggle the **Tweaks** button (top-right of the toolbar) for live controls:
- Palette · Oxblood / Midnight / Ochre
- Font pairing · Editorial / Modernist / Classical
- Light / Dark mode
- Hero layout variant
- Booking flow style (Stepper / Single-page)
- Jump to any screen instantly

## File layout

```
index.html            entry point
styles.css            design tokens + base
app.jsx               app shell, routing, state, tweaks wiring
components.jsx        nav, footer, logo, shared bits
tweaks-panel.jsx      tweaks panel host protocol + controls
screens/
  home.jsx
  portfolio.jsx
  booking.jsx
  auth.jsx
  dashboard.jsx
  admin.jsx
  checkout.jsx
  confirmation.jsx
vercel.json           static site config
```

## What's stubbed (POC scope)

- **Payment gateway** — UI only, no real API calls. The OTP flow is a timed mock.
- **SendGrid email** — confirmation screen renders a rendered email mockup; no actual send.
- **Persistence** — all state is in-memory React. Refresh resets seed data.
- **Auth** — any email + password is accepted. No password validation, no token, no backend.

## Next steps for production

1. Move state to a backend (Supabase / Firebase / custom Node API)
2. Wire real Paystack/Flutterwave server-side init + webhook for confirmation
3. Wire SendGrid (or Resend) with a proper template
4. Move React + JSX off in-browser Babel — use Vite or Next.js
5. Add real auth (Clerk, Auth0, or NextAuth)
6. Replace striped placeholders with real photography + a CDN (Cloudinary, Imgix)
