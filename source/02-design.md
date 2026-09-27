# Design Specification: 
Use this alongside `bakery-website-prd.md` — this file governs *how it should look and feel*, the PRD governs *what it must do*.

---

## 1. Overall Design Language

- **Mood:** Warm, elegant, artisanal, boutique-patisserie — not a generic/corporate e-commerce look.
- **Style family:** Soft luxury/organic bakery aesthetic — cream backgrounds, deep green accents, serif display headings, generous whitespace, rounded/organic shapes (scalloped edges, soft-radius cards).
- **Reference tone of copy:** Emotive, sensory headline copy ("Where Every Bite Feels Special", "Where Every Slice Matters") paired with short, practical supporting sentences.

---

## 2. Color Palette

> Colors below are close visual approximations read from the reference screenshots. Before final implementation, sample exact hex values from the source images with a color picker — treat these as a faithful starting palette, not pixel-perfect values.

| Role | Approx. Hex | Usage |
|---|---|---|
| **Background — Primary (Butter Cream)** | `#F1E4A6` | Page background across nearly every section (header, hero, about, product grid, catering) |
| **Primary Accent (Deep Forest Green)** | `#1F3A18` | Headings, buttons, icons, stat cards, nav underline, price text |
| **Secondary Accent (Olive/Dark Green variant)** | `#264A1E` | Used interchangeably with primary green for depth/gradient on ribbon banners and overlays |
| **Body Text (Charcoal)** | `#333333` | Paragraph copy, nav links, product descriptions |
| **White** | `#FFFFFF` | Card backgrounds, button text, testimonial text on dark/photo overlays |
| **Overlay tint (on hero photo)** | Green at ~70–80% opacity over photo | Used for the "Explore Our World" caption box on the hero image |

**Palette philosophy:** Two-tone core (cream + deep green) with white and photography providing the rest of the visual interest. No bright/saturated colors — the only "color" beyond the two-tone base comes from the food photography itself, which is deliberately the most vivid thing on every page.

---

## 3. Typography

| Role | Font Style | Example Elements |
|---|---|---|
| **Display / Heading font** | Elegant high-contrast serif (visually similar to **Playfair Display**, **Fraunces**, or **Cormorant Garamond**) | "Where Every Bite Feels Special", "Discover About Our Cake", "Best Selling Delights", all section titles |
| **Body / UI font** | Clean geometric sans-serif (visually similar to **Poppins**, **Work Sans**, or **Inter**) | Navigation links, paragraph copy, button labels, product names/descriptions, prices |

**Guidelines:**
- Headings are always in the deep green accent color, set in the serif face, sentence case (not all-caps), medium-large size (roughly 36–48px for hero, 28–34px for section titles).
- Body copy is small-to-medium (14–16px), charcoal gray, generous line-height (~1.6) for readability against the cream background.
- Buttons and nav use the sans-serif font at medium weight, sentence case.
- Avoid mixing more than these two font families anywhere in the app.

---

## 4. Layout Patterns (Section by Section)

### 4.1 Header / Navigation
- Full-width bar on the same cream background as the hero (no separate contrasting header bar).
- Left: circular badge-style logo (dark circle containing a simple line-art bakery icon, e.g. a whisk/cake silhouette).
- Center: horizontal nav links — *Home, About, Cakes, Catering, Contact* (sans-serif, charcoal text).
- Right: an underlined text link (*Online Order*) styled distinctly from the plain nav links, then *Cart* with a live item count, then a hamburger icon for secondary/mobile navigation.
- No search bar in the reference — search should be added inside the Cakes/catalog page rather than the global header, to preserve this clean look.

### 4.2 Hero Section
- Two-column split: left = text content, right = large hero food photograph.
- Left column: eyebrow-free large serif headline (2 lines), a 2-sentence sans-serif subheading, and a single primary CTA button ("Order Now").
- Below the text block: two small square product thumbnails side by side (a "teaser" of the catalog), bottom-cropped with a **scalloped/wave edge mask** (like a pastry crust or pie-tin edge) — this scalloped cut is a recurring signature motif and should reappear at every major section boundary.
- Right column: one large hero photo (a hero product shot), also bottom-cropped with the scalloped wave mask, with a small semi-transparent dark-green caption card floating in its bottom-right corner (e.g. "Explore Our World / High Quality Cakes And Catering Services").

### 4.3 Intro / Stats Strip
- Centered heading + one-line subtext ("Discover About Our Cake").
- Below that, an alternating two-column block: text + bullet list on one side (feature bullets use a small **left-chevron (‹) icon**, not a dot or checkmark), CTA button ("View Collection"), and a product photo on the other side.
- Two floating **stat cards** overlap the top edge of the photo — dark green rounded-rectangle cards, large bold white number ("80+", "90+"), smaller white label underneath ("Customer Support", "On-Time Delivery"). These sit half-on/half-off the image, not fully inside it.

### 4.4 Diagonal Tag Ribbon (signature decorative element)
- A full-width **diagonal two-tone banner** (cream above the diagonal cut, deep green below it, or vice versa) slicing across the section boundary.
- Inside it, a horizontal row of short marketing tag-words in a marquee/ticker style (e.g. "HandCrafted", "FreshlyBaked", "PerfectTexture", "DeliciousMoments", "BirthdayCakes", "RichFlavours", "SoftAndMoist", "SweetIndulgence", "ArtisanCakes"). Implement as a continuously auto-scrolling ticker for a "living" feel.
- Purely decorative/branding — not clickable.

### 4.5 Product Grid ("Best Selling Delights")
- Centered section heading + subtext.
- 4-column card grid (responsive down to 2 columns on tablet, 1 on mobile).
- Each card: product photo (rounded top corners, no border), product name (bold charcoal/dark serif-adjacent sans), 1-line description in muted gray, price in bold green.
- Single centered CTA button below the grid ("View More") rather than pagination — implies a "load more" or link to full catalog page.

### 4.6 Feature / Service Section (Catering)
- Mirrors the intro/stats layout but reversed: text block (heading, paragraph, chevron-bullet list, CTA) on one side, large photo on the other, alternating left/right each time this pattern repeats down the page for visual rhythm.

### 4.7 Mission / Brand Story Section
- Small multi-image collage (2–3 stacked/side-by-side photos) paired with a heading + paragraph + CTA, similar rhythm to 4.6.

### 4.8 Testimonial / Gallery Section
- Full-bleed, full-width dark section breaking from the cream background — a mosaic/collage of food photography fills the background.
- A single testimonial quote is centered on top in white italicized-feel serif/sans text, with the customer's name below it.
- A slide progress indicator (e.g. "04/07" with a thin progress line) in the bottom corner indicates this is a rotating testimonial carousel, not a static block.

### 4.9 Recurring Motifs to Preserve Everywhere
- **Scalloped/wave section dividers** wherever a photo or colored block meets the cream background.
- **Chevron (‹) bullet icons** for any short feature/benefit list.
- **Rounded-corner imagery** (12–20px radius) — never sharp-cornered photos.
- **Dark green pill-ish buttons** (not fully round, ~8–10px corner radius) used consistently for every primary CTA site-wide.
- Alternating left/right two-column rhythm for every content section after the hero.

---

## 5. Component Specification

### Buttons (Primary CTA)
- Background: Deep Forest Green (`#1F3A18`)
- Text: White, sans-serif, medium weight, sentence case
- Corner radius: ~8–10px (soft rectangle, not pill, not sharp)
- Padding: generous horizontal (~28–32px), moderate vertical (~12–14px)
- Hover state: slightly lighter/darker green or subtle scale, no harsh color change
- Used for: "Order Now", "View Collection", "View Catering Service", "View More", "Add to Cart", "Checkout", "Login" etc.

### Cards (Product Card)
- White or transparent background sitting directly on the cream page background (no card border/shadow in the reference — very flat/minimal)
- Image on top with rounded top corners
- Name (bold), short description (muted gray), price (bold green) stacked below with small vertical spacing
- No visible border; separation comes from whitespace alone

### Stat Cards (floating badges)
- Deep green rounded-rectangle
- Large bold number in white, smaller label text in white beneath
- Positioned overlapping a photo edge, not embedded flush inside a grid

### Navigation
- Text-only links, no icons except the cart and hamburger menu
- "Online Order" link is visually distinguished via underline to draw attention as the primary action-adjacent link

### Feature Bullet List
- Icon: left-chevron (‹), same deep green as headings
- Text: sans-serif, charcoal, single line per item

---

## 6. Imagery Guidelines

- Photography style: natural light, close-up, shallow depth of field, warm tones — real food photography, not illustration or 3D render.
- Every hero/feature image should feel "editorial" (styled with props like flowers, linen, wood surfaces) rather than plain product-on-white-background shots.
- Product grid thumbnails can be simpler/cleaner shots than the hero/feature imagery, but should stay warm-toned and consistent in lighting across the whole catalog for visual consistency.

---

## 7. Extending This Design System to Non-Landing-Page Screens

The reference shot only covers the **public marketing homepage**. The PRD requires several screens the reference doesn't show. Apply the same tokens (colors, type, buttons, card style, scalloped dividers, rounded imagery) to keep the whole product feeling like one system:

### 7.1 Full Catalog / Item Listing Page
- Reuse the Product Grid card style (Section 4.5) as the base unit.
- Add a left/side or top filter bar (category, tags, price range) styled in the same cream/green tokens — plain sans-serif labels, chevron-style expand/collapse icons, green accent for the active filter/tag pill.
- Out-of-stock items: same card, photo slightly desaturated/dimmed, a small muted badge ("Sold Out") in place of the price, "Add to Cart" replaced with a disabled state.

### 7.2 Item Detail Page
- Large rounded-corner image (or gallery) left/top, name/description/price/quantity-selector and "Add to Cart" button right/below — consistent with the hero's two-column, generous-whitespace rhythm.

### 7.3 Login / Signup
- Keep it simple and on-brand rather than a generic gray form: cream background, a centered white or very light card containing the form, deep green primary button ("Log In" / "Create Account"), serif heading at the top of the card (e.g. "Welcome Back").
- Form fields: soft rounded input borders (light gray/beige outline), no harsh corporate blue focus states — use a subtle green focus ring to stay on-brand.

### 7.4 Cart & Checkout
- Cart drawer/page: list items using a simplified horizontal version of the product card (thumbnail + name + price + quantity stepper + remove).
- Order summary panel: cream/white card, green bold total, green primary "Proceed to Checkout"/"Pay Now" button.
- Points redemption control at checkout should use the same chevron/pill visual language as the rest of the site (not a jarring generic slider).

### 7.5 User Account (Order History & Points)
- Points balance displayed as a **stat-card-style badge** (echoing Section 4.3's "80+"/"90+" cards) — big bold number, small label underneath, deep green background.
- Order history as a simple list/table, each row expandable to show items + a "Download Invoice" link/button in the same button style.

### 7.6 Admin Dashboard (Owner Side)
- The public site's ornate/organic style (scalloped edges, diagonal ribbons) should be **dialed back** here in favor of a cleaner, denser, data-first layout — but keep the same color tokens (cream/off-white background, deep green as the primary accent for charts, buttons, active nav state, headers) so it still visually belongs to the same brand.
- Sidebar or top nav in deep green (or deep green on a white/cream admin background) with white/cream text for active/inverted contrast.
- Cards for KPIs (Revenue, Orders Today, Low Stock Alerts, Active Points Liability) can directly reuse the **stat-card component** from Section 5.
- Tables (inventory, orders) should use plain rows on white/cream with green accent for action buttons/links and a soft muted red/amber only for low-stock or failed-payment status indicators (the only place a non-brand color should appear, reserved strictly for status/alerts).

---

## 8. Responsive Behavior

- **Desktop (≥1200px):** Full two-column layouts as described throughout; 4-column product grid.
- **Tablet (768–1199px):** Two-column sections stack to single column (image above or below text, alternating maintained where possible); product grid drops to 2 columns.
- **Mobile (<768px):** Everything single-column; hamburger menu becomes the primary nav; hero text/image order should place the headline before the image; diagonal ribbon banner simplifies to a straight horizontal scrolling ticker (diagonal cuts don't translate well to narrow viewports); scalloped dividers can simplify to a plain wave/curve if performance/complexity is a concern on mobile.

---

## 9. Do / Don't Summary

**Do:**
- Keep the cream + deep green two-tone base consistent across every page, including admin.
- Use the serif font strictly for headings, sans-serif for everything else.
- Keep imagery warm, editorial, and rounded-corner throughout.
- Reuse the scalloped divider and chevron bullet as recurring signature details on the public site.
- Keep buttons visually identical (color/radius/font) everywhere they appear.

**Don't:**
- Don't introduce new accent colors beyond deep green (except muted status colors in the admin dashboard for alerts).
- Don't use sharp-cornered cards or photos anywhere on the public-facing site.
- Don't carry the ornate diagonal-ribbon/scalloped-edge decoration into the admin dashboard — that side should feel efficient, not decorative.
- Don't use all-caps headings — the reference is consistently sentence case.
