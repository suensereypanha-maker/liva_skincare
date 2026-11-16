# LIVA mixed-media hero implementation plan

> Use subagent-driven-development or executing-plans for the scoped work below.

**Goal:** Deliver a premium, original mixed-media homepage hero with clear product discovery.
**Architecture:** `js/hero.js` owns slide markup and lifecycle; `css/hero.css` owns stage/layout/motion. `js/app.js` calls render/init/destroy. Local generated stills and MP4 live under assets/campaign/.
**Tech stack:** HTML, CSS, JavaScript, jQuery, local media.
**Spec:** docs/superpowers/specs/2026-11-13-liva-mixed-media-hero-design.md

## Constraints and review focus
- Preserve logo, lower homepage, catalog and all shopping routes; no invented benefits or policies.
- Automatic motion must be interruptible and never steal keyboard focus.
- Inactive or detached videos must stop; rejected play promises must not restart old media.
- Poster fallback, reduced motion and slow loading must retain content and working CTAs.
- Mobile crops, large text and all navigation controls must fit at 320px.

## Tasks
- [x] Research reference and inspiration platforms; record concept and limitations.
- [x] Generate and inspect original campaign assets; retain prompts and provenance.
- [x] Render a muted ambient MP4 with optimized size and a matching poster.
- [x] Implement hero lifecycle with meaningful behavioral tests before code.
- [x] Implement responsive art direction and integrate the homepage.
- [x] Run behavior/syntax/asset checks and real-browser video/navigation/mobile checks.
- [x] Save final screenshots, update documentation and leave the local preview ready.

## Verification record
- 14 hero behavior tests and 8 existing commerce/core tests pass; all six application modules pass `node --check`.
- Browser verified the muted MP4 plays, current time advances, explicit pause stops it, and the mobile variant is selected at narrow widths.
- Verified named chapters, arrow-key navigation, product CTA destination, and removal of the hero/video when routing away.
- Verified the bag suspends video and closing it resumes an otherwise running campaign.
- Reproduced and fixed the mobile menu remaining logically open after a desktop breakpoint change. Browser verified suspension releases on widening and returns when the menu becomes visible again.
- Inspected film, product and portrait compositions on desktop and narrow layouts. Checked 320, 360, 390, 820 and 1024px iframe containers: no horizontal overflow or broken images. Tablet stage proportions were shortened to keep both product bottles in frame.
- Unit tests cover reduced motion, data saving, blocked autoplay, late play promises and cleanup. No physical-device Safari, native pinch-zoom or touch-swipe test was performed.
- Independent final code review found no significant remaining issues. No browser console errors were observed during the integrated desktop checks.
- Final previews: `docs/previews/liva-mixed-media-hero.png` and `docs/previews/liva-hair-pair-hero.png`.
