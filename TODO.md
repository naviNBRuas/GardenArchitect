# Remaining work and handoff notes

Everything below is NOT done yet. Pick items in any order. Labels follow the docs: ✓ sourced, ◐ general practice, ? assumption.

## 0. First, test what exists (nothing was run in a browser)

The visual overhaul, docs page and 3D view were written and syntax-checked (`node --check`) but never opened in a browser. Do this before building more:

- [ ] Open `index.html`, load the Homestead template. Check the console for errors.
- [ ] Palette thumbnails, plan tiles, hero preview and the "Site and sun" popover render. Drag, rotate (R), delete still work.
- [ ] 🧊 3D view opens: orbit, zoom, Top, clock slider, ▶ Day, shadows move, night darkens.
- [ ] 🚶 Walk: W A S D and arrows move, drag looks, you cannot walk through modules, nothing flickers near surfaces.
- [ ] Set a slope in the Plot card: ground tilts, modules and shadows follow, no gaps at the edges.
- [ ] Add-ons and a Rooftop Topiary show in 3D. A custom module shows the building shape.
- [ ] `docs.html` opens, search and nav work, every module card shows the model, exploded view and blueprint.
- [ ] Dark and light themes, a narrow phone width, and reduced-motion.
- [ ] Known risks to look at first: `vecA` sign in 3D shadows (shadows should fall away from the sun), `ctr` and `dim` globals used by `ui.js`, the keydown handler fighting walk keys.

## 1. Research results found but NOT yet applied to the app

### Compost Bays (module `compost`, 1×2 blocks = 4×8 ft)
- Hot pile minimum 3×3×3 ft (1 yd³), maximum about 5×5×5 ft ✓
- Carbon to nitrogen about 30:1 (25:1 to 30:1) ✓
- Working temperature 120 to 130 °F, hot phase 130 to 160 °F, above 160 °F the microbes die ✓
- Turn when the temperature drops or after about 3 days, then keep turning; ready in about 18 days to 2 months ✓
- Hot composting kills weed seeds and many pathogens, but do not add diseased plants ✓
- Sources: UC Master Gardeners https://ucanr.edu/node/125029 · Cornell CCE Herkimer slides https://blogs.cornell.edu/cceherkimer/files/2020/10/Week-4-Trainee-Composting-Single-Slides.pdf · Ledge View Nature Center https://ledgeviewnaturecenter.org/633/Hot-Composting
- Weaker (vendor blog, do not rely on it): reencle.co
- To do: add this to `CONTENT.guides.compost` in `content.js` (same shape as the wick and worm guides), add a compost thermometer to the parts list, and note a 4×8 ft footprint fits two 4×4 ft bays (one active, one turning) ◐.

### Greenhouse (module `greenhouse`, 2×1 blocks = 8×4 ft = 32 ft²)
- Vent area 15 to 25% of floor area (ASABE, via Alabama Extension) ✓ https://www.aces.edu/?p=103433
- Roof vents 15 to 20% of floor area, sidewall plus ridge vents each at least 20% for free-standing houses ✓ (NC State, Bartok) https://hortscans.ces.ncsu.edu/uploads/u/s/using_na_51e41aed283b5.pdf
- RHS: about 20% ridge ventilation for larger houses, small houses need more, a door helps, shade from spring to autumn ✓ https://www.rhs.org.uk/garden-features/ventilation-and-shading-greenhouses
- Shade cloth 30 to 50% is common advice ◐ (grower training PDF, https://academy.thegrownetwork.com/wp-content/uploads/2020/07/Greenhouses-Cooling.pdf); exterior shade works better than interior ✓ (NC State)
- For this size: about 5 to 8 ft² of vent opening ◐ (32 ft² × 15 to 25%). Hot climates (Brasília) should go to the high end ?
- To do: add `CONTENT.guides.greenhouse` with vents, shade cloth and a max-min thermometer; add a "vent area" line to the Layout checks.

## 2. Research still missing (search first, then write)

- [ ] Herbs: spiral dimensions and plant zones per level
- [ ] Solar derating: panel output vs heat, dust, tilt, battery depth of discharge (feeds the Power Hub and Resource balance)
- [ ] Human needs per person: calories, protein, cooking gas (feeds People fed)
- [ ] Setback and safety distances: digester, gas burner, generator, coop, compost from house, wells and property lines. Use local rules for Brazil/DF ?
- [ ] Nutrient target for the mixed water, daily digestate output per kg of feed
- [ ] Prices: need a country and real quotes. Leave the budget empty until then
- [ ] Add-on gain values (extra growing m²), currently estimates ?
- [ ] Exact URLs for earlier research that the docs cannot link yet: honey per hive, dwarf and semi-dwarf apple yield, digestate nutrients, rooftop load 80 to 100 kg/m², the 25 ft bee setback (UF/IFAS), Brasília monthly rainfall. Put each URL in `docs.html` under References and in the ✓ facts in `content.js`
- [ ] Brazilian rules for backyard chickens, bees, biogas and rainwater (none checked)
- [ ] Fish: stocking density for the pond size, feed rates, oxygen needs (only water quality ranges are sourced)
- [ ] Black soldier fly bin, duckweed tank, spirulina culture: temperatures, harvest rates, contamination risks

## 3. Build guides still to research (do not invent steps for these)

Each needs real sources before any steps are written. Biogas, electrical and bees need extra care. Keep the "review before building" warning until a qualified person has checked them.

- [ ] Coop + Pond (structure, predator proofing, liner, pump, aerator)
- [ ] Hydration Hub (first-flush diverter, IBC tote, UV, overflow)
- [ ] Biogas Digester and gas line (pressure, safety valve, flame arrestor, burner)
- [ ] Salad Tower, Vine Wall (flow rates, drains, media)
- [ ] BSF bin, Algae PBR, Duckweed tank
- [ ] Fruit Tree Guild, Herb Spiral, Nursery
- [ ] Power Hub (wiring, fuses, battery, grounding) and Tool Shed
- [ ] Bees (hive type, placement, local registration)
- [ ] Per-module DIY drawings and links: `CONTENT.diy` in `content.js` is still empty and not shown in the app

## 4. Features still open

From the original roadmap and the visual work:

- [ ] Onboarding wizard (location, plot size, household goals) that picks a template
- [ ] Multi-select, copy and paste, alignment tools, pinch-zoom on touch
- [ ] Freeform plot boundary (non-rectangular)
- [ ] Paths and access checks (walkways between modules)
- [ ] Seasonal planting calendar by crop, climate presets beyond Brasília (rainfall, frost dates, zone) feeding the care calendar
- [ ] More checks: distance from house for digester, bees and coop, safety clearances (needs the sourced numbers above)
- [ ] Move `M`, `X`, `NM`, `R`, `CAT`, `TP` out of `index.html` into `content.js`
- [ ] Rooftop Topiary on custom modules
- [ ] Persist layouts beyond one tab (`sessionStorage` today), optional `localStorage` or file save
- [ ] Per-variant build guides and a variant picker for new placements
- [ ] Hub storage vs dry-day autonomy in the planner (the monthly check exists)

3D view:

- [ ] Move to real Three.js using `ModelKit.toThree(THREE, key, w, h)` (models already exported as part lists in `models.js`). Add real lighting, shadows, textures, soft grass, water animation
- [ ] Edit in 3D: place, move and rotate modules in the 3D view
- [ ] Sun-hours heat map on the ground, and a shade preview per module
- [ ] Walls and fences that block walking, touch controls for walk mode, jump between viewpoints
- [ ] Export a 3D screenshot, an image of the plan, or a glTF model
- [ ] Level of detail and performance for large yards (canvas repaints the whole scene every frame)
- [ ] Better models: more detail per module, animated parts (chickens, fish, water flow, fans)
- [ ] Slope: terraces and a visible foundation under each module

Known limitations that still stand (from the roadmap):

- Optimizer scores sun at 9:00, 12:00 and 15:00 only
- Shadows use each module's centre point and a single height; the 3D shadows use the footprint plus the model height
- Near the equator (under 10°) the shade logic is rough
- Biogas, electrical and beekeeping guides are starting points, not instructions
- File downloads do not work inside a hosted preview, use Copy or the zip

## 5. File map

- `index.html`: app shell and core logic (modules `M`, `X`, `NM`, rules `R`, guides `G`)
- `addons.js` to `addons4.js`: sun, plot, optimizer, resources, variants, lines, budget, climate, compare
- `content.js`: editable specifics, guides overrides (`wick`, `worm` researched), heights, sun minimums, resource numbers
- `models.js`: low-poly model for every module, add-ons, topiary, SVG renderer, 3D projection, Three.js bridge
- `ui.js`: loads last, wraps `render()` and `say()`, 3D view, walk, sun, slope, theme toggle, header grouping
- `theme.css`: all styling, dark mode, motion
- `docs.html` and `docs-data.js`: documentation. `docs-data.js` is generated from `index.html` data; regenerate it (see the node snippet idea: evaluate the `M`, `NM`, `A`, `R`, `G` constants) after changing modules or guides, or switch the docs to read `content.js` directly
- `README.md`, `ROADMAP.md`, `TODO.md`: notes

## 6. Rules to keep

- Never present an unsourced number as fact. Use the ✓ / ◐ / ? labels.
- Prefer extension services, universities, standards bodies and government sources. Mark vendor and blog sources as weak.
- Do not write build steps for gas, electrical or bee work without sources and a safety review.
- When you correct a number (like the wicking bed depth), say so in the docs.
