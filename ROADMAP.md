# Roadmap and handoff notes

Paste this file into a fresh session along with `index.html` to continue.

## Current state

Single self-contained HTML file, vanilla JS, no dependencies except an optional Google Fonts stylesheet.

- Grid: 1 cell = 1 block = 4 ft (1.2 m). Coop + Pond is 2x2 cells. Protein Factory (BSF) is really 2x4 ft but rounds up to 1 cell (`real` field).
- 18 modules in `M` (9 original, 9 added in `NM`). Add-ons in `A` attach to compatible modules.
- State object `S`: `{cols, rows, unit, lat, rot, ra, sa, items[], links[], n}`. Items: `{id, t, x, y, r, ad[], note}`. Links: `{a, b, l, k}`.
- Persistence: `sessionStorage` key `gardenArchitect.v2` (per tab, ephemeral). Undo history `H` is in memory.
- Sun model: noon sun bearing from latitude sign (`nz()`), plan rotation `rot`, manual sunrise and sunset bearings `ra`, `sa`. `shade()` gives the shade direction in plan coordinates. Used by Auto-arrange (back-to-front scan), the shade check, the sun overlay and the yellow sun-facing strips.
- Checks: shading, hub beside pond, waste zone within 4 ft, missing connections, missing rule partners. Self-sufficiency panel counts F/W/E/D/R coverage via `CAT`.
- Exports: layout JSON, blueprint Markdown (modules, BOM, connections, notes, care plan, build guides, open issues), care plan, guide library. Download buttons are inert on the hosted preview, Copy works.

## Done in v3
Sun simulation (items 1), plot slope and obstacles (partial item 2), scored optimizer with locks (3), resource dashboard engine (4), content.js plus custom modules (5, partial: M/X/NM/R/CAT/TP still in index.html). Code is in `addons.js`, which wraps `render()` and `fits()`.

## Done in batch 2
Variants (two-story coop, two IBCs, bag digester, semi-dwarf tree), routed water lines with head check, Nutrient Tank and nutrient loop estimate, NPK in the dashboard. Not yet: hub storage vs dry-day autonomy, monthly rainfall balance, per-variant guides, variant picker for new placements.

## Still open from the original list
Freeform plot boundary (non-rectangular), moving M/X/NM/R/CAT/TP into content.js, then everything under Next tier.

## Original plan (kept for reference)

1. Real sun simulation: date and time-of-day sliders, moving shadows, module heights, sun hours per module, sunrise and sunset computed from latitude and date (replaces the manual bearings, keep manual override).
2. Real plot editor: draw a non-rectangular boundary, mark existing trees, buildings, fences, and slope or elevation. Then check the gravity cascade (pond lowest, hub raised).
3. Scored optimizer: weigh sun, pipe length, gravity, waste-zone cluster, access paths. Try many layouts, show a score breakdown, allow locking placed modules.
4. Resource balance dashboard: water, energy, animal feed, fertility, calories. Editable numbers per module (rain catchment vs pond and bed use, solar vs pump load, and so on).
5. Move content (modules, guides, rules, plant specifics) into its own data file, and let users create custom modules in the app.

## Next tier

Phases and budget (phase tags, prices, local currency, shopping list). Print-ready PDF plan with scale bar, legend and compass, plus PNG or SVG. Shareable URL that carries the layout (no server). Onboarding wizard (location, plot size, household goals). Scenario comparison (A vs B). Zoom, pan, multi-select, copy and paste, alignment, lock, pinch-zoom. Paths and access checks. Climate presets (rainfall, frost dates, growing zone) feeding a seasonal care calendar. Progress tracking for build steps and care tasks. More checks (distance from house for digester, bees and coop, safety clearances).

## Known limitations

- Optimizer scores sun at 9:00, 12:00 and 15:00 only; the table shows the full-day sun hours.
- Shadows use each module's centre point and a single height; the noon-sun bearing line (`nz()`) is still hemisphere-based.
- Near the equator (under 10 degrees) the shade logic is rough.
- Build and care guides are general starting points, not expert instructions. Review the biogas, electrical and beekeeping guides before anyone builds from them.
- File downloads do not work inside the hosted preview. Use Copy, or open the zip version.

## Done in batch 4
Add-ons with space gain, Rooftop Topiary (stacking, `top:1` modules with `on` host id), effective-space card, share link, roof-load research. Still unresearched: fruit tree guild yield, honey, worm castings, compost, greenhouse, herbs, digestate NPK, solar derating, human needs. Still open: add-on gain values, budget and phases, print PDF, onboarding, scenario compare, zoom and pan, progress tracking, distance and safety checks (need sourced numbers), topiary on custom modules.

## Done in batch 5
Honey, apple, digestate research; budget and phases; shopping list; progress tracker and permit checks; print plan. Still unresearched: worm castings, compost, greenhouse, herbs, solar derating, human needs, setback distances, nutrient target, daily digestate output, all prices. Still open: onboarding wizard, scenario compare, zoom and pan, climate presets and seasonal calendar, per-module DIY steps and drawings (CONTENT.diy is still empty), sourced setback checks, expand add-on gains with research.

## Done in batch 6
Zoom and pan, setup card, monthly rainfall and dry-season tank check, Brasília preset, A/B compare, bee setback check. Still NOT done: setbacks for digester, generator and coop (no sourced numbers yet), worm castings, compost, greenhouse, herbs, solar derating, human needs, real prices (need a country and quotes), CONTENT.diy drawings and steps, a seasonal planting calendar by crop, pinch-zoom, multi-select.
