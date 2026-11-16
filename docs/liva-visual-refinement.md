# LIVA — selective softness

## Visual diagnosis
The second iteration used ruled product grids, prominent outlined actions, compressed bold headings and repeated half-and-half sections. These made functional controls and products compete and gave the collection an institutional tone. The supplied gold LIVA wordmark and tactile packaging suggest a quieter visual language.

## Design decisions
- Warm pearl canvas, espresso text, sage selection states and restrained gold brand details.
- Cormorant Garamond for editorial headlines, DM Sans for product titles and Manrope for UI. Moderate headline tracking; no heavy display weights.
- Borderless product cards: an 18px image well, separate name/price metadata and a clear capsule purchase action. Controls remain visible without hovering.
- A radius scale with roles: 10px inputs, 18px product imagery/panels, 28px campaign surfaces, capsule actions. One larger asymmetric campaign corner provides identity without rounding every container.
- Spacing instead of ruling for section structure. Fine separators remain where they clarify a list, form or accordion.
- Homepage editorial composition uses inset photography and a compact category row; shopping grids stay predictable for scanning.
- Existing transparent sample-product notices remain, with reduced visual emphasis. No unsupported selling claims are introduced.

## Research
These are visual observations, not measured conversion results.

- [MERIT storefront](https://www.meritbeauty.com/) and [collection](https://www.meritbeauty.com/collections/skincare): borderless photography, open metadata, restrained serif titles and understated sorting. Adopt the hierarchy, not its exact composition.
- [Porcelain Skin / Service Co on Behance](https://www.behance.net/gallery/226926611/Skincare-Cosmetic-E-Commerce-Website-Design): modest image curvature, separate metadata and an asymmetric introduction beside products. Keep LIVA controls larger and readable.
- [Skincare Ecommerce / Sohan Talukder on Dribbble](https://dribbble.com/shots/26588176-Skincare-Ecommerce-Website-Design): slender display serif, open product groups and capsule actions. Treat as concept inspiration, not evidence of commercial performance.
- [Pinterest discovery](https://www.pinterest.com/search/pins/?q=premium%20skincare%20ecommerce%20website): visible thumbnails suggested cream/olive palettes and open photographic compositions; a login modal blocked detailed pin inspection. No pin-specific conclusions.

- [Rhode collection](https://www.rhodeskin.com/collections/featured): restrained rounded surfaces, pill category controls and generous gutters. Adopt clear selection states, not the complete visual system.
- [OSEA shop](https://oseamalibu.com/collections/shop): pale image fields, borderless metadata, serif headings and visible priced purchase controls. Supports keeping product information outside framed panels.
- [Gisou collection](https://gisou.com/collections/shop-all): cream canvas, open surfaces and photography carrying much of the color and softness.
- [Beauty in Stem / Awwwards](https://www.awwwards.com/sites/beauty-in-stem) and [archived shop](https://www.awwwards.com/inspiration/shop-beauty-in-stem): asymmetric introduction and quiet, frameless product groups. Live store is password protected; observations concern the archive only.

The client reference review from the previous pass remains in [the shopping research](liva-redesign-research.md). This pass deliberately addresses component and composition weaknesses in the second iteration.

## Implementation and verification
- Shared color, type and radius foundations now live in styles.css. Decorative separators and functional control boundaries use separate contrast tokens.
- The obsolete refinements.css layer has been removed; responsive comparison and order-history fixes live with their components.
- Product prices sit outside Add buttons; the accessible button name still includes product, size and price. Search, comparison, saving, quantities and local commerce behavior are preserved.
- Browser inspection corrected narrow Conditioner-title overflow, improved mobile catalog spacing and strengthened low-contrast supporting labels and selected categories.
- Browser layout checks at 320, 360, 390, 768 and 1024px containers found no page overflow or broken images in the tested home, shop, shelf and checkout views. At 320px, PDPs including Conditioner, comparison, about, account, contact, tracking and wishlist were also checked. Scrollbars reduce actual inner widths by 15px.
- Actual browser interactions verified price sorting, search, two-product comparison, Add to bag, quantity/subtotal updates and the hair-pair shelf preset. A 320px two-product comparison remains readable side by side.
- Eight existing behavior tests and syntax checks pass. Screenshots cover the home and collection. These are browser checks, not a physical-device or full assistive-technology audit.

