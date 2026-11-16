> Historical first direction. Superseded by `docs/liva-redesign-research.md` and the Daily Edit implementation.

# LIVA storefront design

Build a client-ready, local, buildless HTML/CSS/JavaScript/jQuery storefront. The user's detailed brief authorizes creative implementation; the attached backend requirements inform the journey but backend work is excluded.

## Direction
Warm ivory (#faf8f4), soft gold (#a48551), olive-charcoal (#333a30), elegant high-contrast serif headings with restrained sans-serif UI. Original editorial product photography, generous spacing, fine rules, subtle motion, accessible controls. Cream and gold logo with a flowing underline respects the supplied identity.

## Reference review
1995skin.com: large campaign photography, transparent header, localized navigation, account and bag access, product variants and quick shopping. weyoungcambodia.com/en: campaign carousel, grouped product grids, image galleries, search, mobile bottom navigation and account orders. Use their clear discovery-to-cart journey, with LIVA's own quieter visual language.

## Approach
Use a buildless, hash-routed frontend in the provided empty workspace; alternative multi-page duplication makes shared cart updates harder, and a framework would conflict with the requested stack. Persist cart, wishlist, sample profile and demo orders in localStorage. No APIs, real authentication, SMS or payments. Assume English and USD for the Cambodian market; show local delivery choices.

## Screens
Home with hero, categories, bestsellers, brand story, ritual feature, customer feedback and newsletter. Shop filtering/sorting/search, product details with size and quantity, wishlist, cart drawer, checkout with address and demo ABA/COD selection, confirmation, account OTP demonstration and profile/history, order tracking, contact, story and journal.

## Shared interface
window.Liva: products array; money(number); escape(string); icon(name); getProduct(id); state {cart:[{id,size,qty}], wishlist:[id], profile:null|object, orders:[]}; save(); addToCart(id,size,qty); toggleWishlist(id); cartTotals() -> {subtotal,discount,shipping,total,count}; toast(message); navigate(hash); openCart(); closeCart(); render(). DOM: #app, #cart-drawer, #overlay, #toast. Scripts load jquery, core, catalog, commerce, app. Modules initialize delegated handlers themselves and expose render functions. Product fields: id,name,category,subtitle,price,oldPrice,size,image,tag,rating,reviews,description,ingredients,benefits.

## Quality
Responsive 360px to 1600px, keyboard focus/escape behavior, reduced-motion support, readable contrast, form validation, empty/error states, meaningful sample content. Verify shopping journey in browser and arithmetic/persistence with focused tests. Mock prices, product claims, imagery, reviews and delivery terms require client confirmation before production.
