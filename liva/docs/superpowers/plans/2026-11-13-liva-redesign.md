# LIVA Daily Edit Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans or subagent-driven-development to implement this plan task-by-task.

**Goal:** Replace the generic first direction with a distinctive, useful and honest shopping prototype.

**Architecture:** Preserve the static storefront and Liva global interface. Root owns the shell, campaign, shelf builder and integration; catalog and commerce changes have independent file ownership.

**Tech Stack:** HTML, CSS, JavaScript, local jQuery 3.7.1.

**Spec:** [Research and direction](../../liva-redesign-research.md).

## Global constraints

- Frontend only. No real accounts, messages, payments or delivery.
- Preserve the gold LIVA logo and recognizable wave.
- No invented verified claims, reviews, certifications or business policies.
- Sample prices/sizes/imagery are disclosed.

## Review focus

- Empty selections/search results must offer a recovery route.
- Comparison and mobile purchase controls must not overlap the cart or trap focus.
- Existing saved orders must remain reviewable after sample product names/prices change.
- Repeat-order quantities must respect the 99-item cap and skip missing/unsupported items.
- 320px layouts and short viewports must retain visible actions without horizontal page overflow.

## Tasks

- [x] Research live storefronts, client references and creative portfolios; document observations and their limits.
- [x] Commerce: remove invented rates/offers/time promises; test and implement Liva.repeatOrder(id), preserving bag contents and current prices.
- [x] Catalog: replace sample claims with factual formats; implement filtering, comparison up to 3, clear prices/add actions and mobile PDP purchase controls.
- [x] Shell: replace index.html, styles.css and app.js campaign/navigation/footer; add js/routine.js shelf builder with running total and explicit add selection.
- [x] Art: create original campaign portrait and detail images; document prompts, optimize local WebP assets.
- [x] Integrate: call Liva.initCatalogPage() after route render; add #compare and #routine routes; preserve commerce APIs.
- [x] Review and verify: syntax checks, core tests, desktop/mobile UI and end-to-end demo order, persisted save/bag, comparison, shelf, repeat order, accessibility and console errors.
- [x] Deliver: update README with run instructions, scope and checked behavior; capture revised preview.
