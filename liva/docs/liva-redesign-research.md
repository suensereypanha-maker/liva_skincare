# LIVA — The Daily Edit

Research and design direction, 13 November 2026. This supersedes the first prototype’s visual direction. The attached requirements are project reference material; the current user request controls the frontend-only scope.

## What the research actually establishes

These are observed interface patterns, not measured conversion results. Live storefronts were inspected alongside editorial portfolios. No competitor content, imagery, customer reviews, claims, or policies is reused. Mobile behavior was directly examined for OUAI; other mobile recommendations are design judgments to validate in LIVA’s own prototype.

| Reference | Observation | LIVA decision |
|---|---|---|
| [1995 Skin](https://1995skin.com/) | Campaign-led homepage, prominent brand imagery, simple product strip and direct purchase actions. | Give the first screen a memorable visual idea, then move directly into merchandise. |
| [weYOUNG Cambodia](https://weyoungcambodia.com/en) | Local campaign imagery, simple category navigation, persistent access to search/cart/account. [Product detail](https://weyoungcambodia.com/en/products/69cc82470fc4bd4d2cf4a4a2) has a gallery, quantity, price, Add to Cart and Buy Now. | Make familiar shopping controls easy to find. Retain Cambodian address choices and an explicitly simulated ABA option; do not imply actual service availability. |
| [Aesop](https://www.aesop.com/), [product detail](https://www.aesop.com/hand-body/hand-washes-balms/resurrection-aromatique-hand-wash/BT13.html) | Granular discovery and separately labeled product attributes, use, ingredients and complementary products. | Plain product names and meaningful comparison. Unknown ingredients and directions remain explicitly unconfirmed. |
| [Nécessaire](https://necessaire.com/), [Body Wash](https://necessaire.com/products/the-body-wash-pump-eucalyptus) | Simple Body/Hair navigation; scent, size, price and add actions are readily visible. Strong photographic campaigns coexist with precise product information. | Clear size/price/action hierarchy and always-visible Add buttons. No unnecessary subscription mechanisms for an unconfirmed offer. |
| [OUAI](https://theouai.com/), [Detox Shampoo](https://theouai.com/products/detox-shampoo) | Format choices, explicit purchase options, useful product accordions. At 390×844, compact header and sticky product purchase controls retain access to buying after scrolling. | Mobile product purchase bar, predictable accordions and visible quantities. Do not default customers into subscriptions. |
| [Crown Affair](https://www.crownaffair.com/), [routine builder](https://www.crownaffair.com/pages/build-your-ritual) | Category-led navigation, prominent guided discovery, routine slots and running selection totals. | A small user-led shelf builder with an explicit total. No diagnostic quiz or unsupported personalized claims. |
| [F. Miller](https://fmillerskincare.com/) | Numbered categories, tactile photography and ruled product grids with aligned commercial information. | An indexed category system and restrained, consistent catalog grid. |
| [OMR Beauty, Awwwards](https://www.awwwards.com/sites/omr-beauty), [live site](https://omrbeauty.com/) | Honorable Mention dated 3 February 2026. Cinematic product photography and assertive sans typography transition into a crisp shopping interface. | Preserve LIVA’s gold identity while moving away from an all-beige, serif-heavy template. Recognition is not evidence of sales performance. |
| [Velura, Behance](https://www.behance.net/gallery/236640563/Skincare-Ecommerce-Design-Shopify-Website) | Strong orange/pink palette, expressive type and irregular imagery. Portfolio concept, published 15 October 2025. | One deliberate visual voice; avoid decorative stickers and effects with no shopping purpose. |
| [Vibe, Dribbble](https://dribbble.com/shots/26210289-Vibe-Clean-Modern-Natural-Skincare-eCommerce-Landing-Page) | Large graphic typography, portrait imagery and restrained orange accents. | Original portrait art direction and an intentional asymmetrical composition; keep navigation and buying actions legible. |

## Direction and purpose

**The Daily Edit** presents personal care as an individual selection, not an abstract luxury ritual. Preserve the gold LIVA mark and wave; use paper ivory, espresso, butter yellow and terracotta. Confident sans typography and original editorial photography distinguish the campaign. Product information remains compact, factual and consistent.

The homepage has four jobs: establish identity, expose categories, present a small shoppable edit, and introduce a useful shelf-building tool. A concise brand section provides atmosphere without inventing a company history or manufacturing story. No testimonials, pseudo-certification strip, arbitrary bestseller labels or repetitive product sections.

Customer tasks: find a known item quickly; browse by Hair/Body/Sets; search and sort; compare up to three products; save products; inspect details; assemble a shelf; adjust the bag; complete a demo checkout; find local order history; add previous items again. Business purposes: recognizable brand presentation, transparent product choices, fewer discovery dead ends, more useful multi-item selection and straightforward replenishment. These are design intentions, not performance claims.

## Content boundaries

Product types are illustrative. Prices, sizes, packaging and campaign imagery are sample/concept content. No reviews, ratings, benefit claims, ingredient claims, certifications, verified sales rankings, offers or delivery promises. Ingredients and instructions await approved product information. Delivery fees, coverage and timing are not configured. ABA and cash-on-delivery are clearly labeled preview options. Contact fields demonstrate an interaction without sending messages. Local demo accounts do not authenticate against a service.

## Implementation and acceptance

Keep HTML, CSS, vanilla JavaScript and local jQuery. Static hash routing with no build process, backend or API. Preserve local bag, saved items and demo orders. Add comparison as session state and shelf selection as session state. Keep keyboard access, visible focus, reduced-motion support, accessible form labels, drawer focus trapping and 44px primary touch controls. Validate desktop, 320/390px mobile and short-height drawer layouts, and test core arithmetic/replenishment behavior. No public deployment requested.
