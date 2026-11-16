# LIVA mixed-media hero — The art of the everyday

## Intent
Replace the static homepage hero with an original, immersive, shoppable three-chapter mixed-media campaign. Preserve the approved-in-context soft-luxury system, gold logo, current shopping functionality and truthful sample content. The user delegates concept choice and implementation; the decisions below are the designer's calls, not a claim of explicit design approval.

## Research before design
- 1995skin.com live hero: full-width muted looping video, overlaid header, three compact pagination points. Adopt immersive media and simple movement, while making LIVA's messaging, pause control and shopping destination explicit. Do not reuse its media or layout verbatim.
- Dribbble Botanical Skincare Hero / Zonda: https://dribbble.com/shots/27427386-Botanical-Skincare-Hero-Website-Design — visually inspected tactile crop, low-detail copy area and distinct product destination.
- Behance Aveline: https://www.behance.net/gallery/248809689/Aveline-Beauty-Landing-Page-Skincare-Web-Design — visually inspected coherent directional light, packaging and environment; text and product occupy separate regions.
- Awwwards Beauty Queen Digital Flagship Store: https://www.awwwards.com/sites/beauty-queen-digital-flagship-store and live https://beautyqueenhk.com/ — visually inspected full-height editorial photo with named chapter navigation and compact CTA. Its current hero has no video; use it for composition and named controls, not as proof of mixed media.
- Awwwards Deep Beauty: https://www.awwwards.com/sites/deep-beauty — archive documents Home, Navigation and Artworks transitions in an immersive KIKO photography exhibition. Linked live site timed out; conclusions concern the archive only.
- Pinterest premium skincare discovery: visible thumbnails only; a login overlay blocked detailed pin review. No pin-specific claims.

## Approaches considered
A fullscreen promotional carousel risks hiding navigation and making copy illegible. Keeping the old split-card hero would limit the requested immersive treatment. Chosen: a broad editorial media stage below the recognizable header, a generous text-safe region, consistent chapter controls and restrained crossfades. It gives the media room without copying the reference's overlay header.

## Sequence
1. Brand introduction — a 10-second original ambient product motion study, rendered to a local MP4 from generated LIVA campaign artwork with subtle camera and water movement. Not presented as live-action footage or a neural-generated video. Copy: “The art of the everyday.” CTA: Shop the collection.
2. Product spotlight — original still life of LIVA Shampoo and Conditioner. Copy: “Good things come in pairs.” CTA: Discover the hair pair, with illustrative 2 × 250 mL / $38.00 metadata.
3. Lifestyle — original campaign portrait/scene in the same warm light. Copy: “A little time. Entirely yours.” CTA: Build your shelf.

## Visual system
Wide warm-neutral compositions, a clear left copy region and right-side focal subject. Cormorant serif headlines, occasional italic accent, Manrope interface, original gold logo. Soft gradient only where needed for text contrast. No boxed slide captions or oversized arrows. Named chapter buttons communicate destinations; 44px circular previous/next and motion control.

## Interaction and accessibility
- Video muted, inline, poster first, local MP4. Only active video plays; failed/blocked media retains a useful image and usable CTA.
- Initial timed rotation with visible pause/start control. Stop automatic motion on user navigation, keyboard focus, hover, reduced motion or data-saving preference. Focus/hover never restart rotation automatically; explicit Play resumes it.
- Pause when offscreen, tab hidden or bag/menu/search open. Route cleanup releases listeners/timers and pauses media.
- Keyboard arrows when focus is inside the carousel; named buttons and active chapter state; inactive content inert/aria-hidden. Touch swipe with vertical-scroll discrimination. No focus stealing on automatic changes.
- Crossfade around 650ms; reduced-motion uses immediate changes and a static poster until explicitly played.
- Mobile shows a purposeful subject crop with copy and controls in a solid editorial area below, avoiding tiny overlay text or hidden faces/products.

## Scope and verification
HTML/CSS/JavaScript/jQuery only, no runtime packages or backend. Add dedicated hero module/styles, integrate render lifecycle and preserve catalog. Test lifecycle, pause semantics, navigation bounds and stale-play races; browser-verify video time advances, pause, chapters, keyboard, swipe, links, reduced-motion policy, responsive overflow and route cleanup.
