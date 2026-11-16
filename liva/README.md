# LIVA — The Daily Edit

A responsive personal care storefront built with HTML, CSS, JavaScript and locally bundled jQuery 3.7.1. No build step, backend, database or application API is required.

## Preview

```sh
npm run dev
```

Open [the local storefront](http://127.0.0.1:4173/#home). Python 3 serves the static files on localhost only. Any static host can serve the same files.

## The redesign

The Daily Edit replaces the first prototype’s repeated lifestyle sections, fabricated reviews and vague product claims with a more useful shopping experience. LIVA’s gold mark and wave remain recognizable. The visual system uses warm pearl, espresso and sage, restrained serif headlines, light sans product typography and selectively curved image surfaces. Open product cards, separate prices and clear capsule actions replace the ruled grid.

The homepage now opens with an original three-chapter mixed-media campaign: **Everyday** introduces the brand through an ambient MP4; **The hair pair** spotlights shampoo and conditioner; **Your moment** connects lifestyle imagery to the shelf builder. Shared warm light, olive walls and stone give the sequence one visual identity. Desktop uses generous overlay typography; mobile uses focused subject crops with a clear copy area below.

The [latest visual research and rationale](docs/liva-visual-refinement.md) explains component decisions and reference limitations. The [earlier shopping research](docs/liva-redesign-research.md) documents the client references, leading beauty stores, Awwwards, Behance and Dribbble examples, observed patterns and their limits. The research informed design decisions; it does not establish conversion results.

The [mixed-media hero research and design](docs/superpowers/specs/2026-11-13-liva-mixed-media-hero-design.md) records the new 1995skin, Dribbble, Behance and Awwwards observations and the limits of Pinterest access.

## Campaign media and controls

- Original generated LIVA concept artwork; no reference-brand media is reused.
- A local 10-second muted MP4 motion study, authored from the generated still with subtle camera and water movement. This is not live-action or neural-generated video. See [media provenance and rendering instructions](assets/campaign/everyday-README.md) and [generation prompts](assets/campaign/prompts.md).
- Desktop film: about 785 KB at 1280 × 720. Mobile film: about 236 KB at 768 × 432. Matching poster and optimized WebP stills work without video playback.
- Named chapters, previous/next controls, keyboard arrows/Home/End, touch swiping and an explicit Play/Pause control.
- Focus, hover and manual navigation pause rotation until Play is selected. Reduced motion and data saving start with a still image. Hidden tabs, offscreen media and open shopping overlays suspend playback.
- Route changes stop media and release the old slider's listeners and observers.

## Shopping flows

- Editorial homepage, photographic Hair / Body / Sets navigation and a shoppable category edit.
- Eight illustrative products with plain names, format, size, price and visible Add actions.
- Search, category filtering, price/name sorting and empty-result recovery.
- Product details, quantities up to 99, saved products and mobile purchase controls.
- Side-by-side comparison of up to three products. Two fit together on mobile; three use a labeled, keyboard-accessible horizontal table.
- Build your shelf: select individual products or start with a hair/body pair, review the subtotal and add the selection to the bag.
- Cart drawer with quantity controls, removal, focus trapping, Escape close and focus restoration.
- Demo checkout, Cambodian address choices and clearly simulated ABA / cash-on-delivery selections.
- Demo account creation/sign-in, profile editing, order history and receipt-specific tracking.
- Add again from a receipt or history, preserving existing bag items and using current sample prices.
- About LIVA, contact form preview, FAQ and truthful explanations of unconfigured policies.

Account preview code: **123456**. No SMS is sent. Sample tracking number: **LIVA-1024**.

Bag, saved products, demo profile and demo orders are stored in this browser (`liva-store-v1`). Comparison and shelf selections last for the current page session. Contact submissions are not sent or stored. No passwords or payment credentials are collected. Clear this site’s browser data to remove local demo records.

## Content boundaries

Product imagery, names, sizes and prices are illustrative. Packaging and campaign photography are generated concept assets. No customer reviews, ratings, certifications, sales rankings, verified benefits, ingredients, directions or promotions are invented. Product detail accordions explicitly await approved brand information.

Delivery fees, coverage, timing, returns terms and live contact channels are not configured. Demo orders do not charge, reserve stock, send messages or arrange delivery. ABA and cash-on-delivery are interface previews, not available payment services.

## Source structure

| File | Responsibility |
|---|---|
| `index.html` | Accessible shell, navigation, search, footer and drawer host |
| `js/core.js` | Local state, persistence, totals, repeat-order logic and shared helpers |
| `js/catalog.js` | Sample catalog, filters, product details, saved items and comparison |
| `js/routine.js` | Shelf selection, presets, running subtotal and add-selection action |
| `js/hero.js` | Campaign markup, timed rotation, media playback and accessible controls |
| `js/commerce.js` | Bag, checkout, account, local orders, tracking and contact preview |
| `js/app.js` | Hash routing, homepage composition, about/policy pages and shell interaction |
| `css/styles.css` | Brand system, responsive shell, homepage and shelf builder |
| `css/hero.css` | Responsive campaign composition, chapter controls and reduced-motion styling |
| `css/catalog.css` | Collection, product and comparison layouts |
| `css/commerce.css` | Checkout/account structures and accessible drawer layout |
| `tests/mobile-preview.html` | Responsive QA viewport, overflow and broken-image reporting |

Fonts (DM Sans, Manrope and Cormorant Garamond), jQuery and images are served locally. Dependency licenses are in `assets/licenses/`. Original PNG assets are preserved beside optimized WebP files. Image prompts are recorded in `assets/image-prompts.md`.

## Verification

```sh
npm test
npm run check
```

22 automated tests (14 hero and 8 core) cover cart merging/persistence, product-only arithmetic, invalid input, saved-item recovery, repeat-order current prices/merging/missing products/quantity caps, and receipt-specific tracking across reloads. Hero tests cover timing, navigation, persistent pauses, composed suspension, accessibility preferences, cleanup, blocked autoplay and stale video play promises. Syntax checks cover all six JavaScript modules.

Browser verification covers desktop and narrow mobile layouts, category/search/sort, comparison, shelf selection/subtotals, quantity changes, demo checkout/receipt/tracking, repeat ordering, incorrect/correct demo codes, order history and saved-item persistence. Responsive checks use real iframe viewports, including 320px containers and a 360px-high drawer. The mixed-media hero was also checked for actual video playback, pause, chapter/keyboard navigation, CTA routing, bag suspension and mobile-menu breakpoint recovery. No device-specific Safari or physical-device test has been performed; touch swipe and native pinch zoom still need device QA.

## Before a live store

Replace the prototype logo rendition with the approved vector artwork and supply approved product information and photography, pricing, policies and customer care channels. Real authentication, inventory, server-side order/pricing validation, payments, customer messages and delivery integrations belong to the next development phase. Earlier design documents under `docs/superpowers/` are retained for history; the latest mixed-media hero specification governs the current campaign.
