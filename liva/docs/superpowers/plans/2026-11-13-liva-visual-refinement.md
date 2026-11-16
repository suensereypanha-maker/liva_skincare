# LIVA Visual Refinement Implementation Plan

> For agentic workers: use subagent-driven-development or executing-plans for the scoped tasks below.

**Goal:** Replace rigid framing with an elegant, coherent shopping interface while preserving the working prototype.
**Architecture:** Shared design tokens and shell styles in styles.css; catalog and commerce retain their own component styles. Remove the previous overriding refinements layer after folding required responsive fixes into the component files.
**Tech stack:** HTML, CSS, JavaScript, local jQuery. Frontend only.
**Spec:** The user's current visual-refinement brief and docs/liva-visual-refinement.md.

## Constraints
- Preserve logo, sample data, shopping functionality, keyboard access and mobile layouts.
- No invented verified benefits, policies, reviews, ratings or certifications.
- Reuse local imagery and fonts. No new runtime dependencies.
- Use selective curvature; avoid framed grids and repeated identical section compositions.

## Review focus
- Catalog actions and prices must remain readable at 320px.
- Sticky comparison and purchase controls must avoid the header and drawer.
- Cart, checkout, profile and tracking must share the new visual language.
- Category selection, sorting and search must preserve keyboard focus.
- Longer names, empty states and quantity controls must fit without horizontal page overflow.

## Tasks
- [x] Review live catalog and research premium-brand and portfolio references.
- [x] Root: implement shared tokens, lighter typography, homepage composition, category navigation and shelf builder in styles.css / app.js.
- [x] Catalog agent: remove card frames, refine product surfaces and controls, move price into metadata, refine listing/PDP/comparison/wishlist in catalog.css / catalog.js.
- [x] Commerce agent: align cart, forms, account, checkout, tracking and contact in commerce.css; fold existing responsive fixes.
- [x] Root: retire refinements.css, update cache versions, run syntax and existing commerce tests.
- [x] Root: inspect desktop and mobile screenshots, exercise category/search/cart/compare and shelf selection; document results and save preview images.
