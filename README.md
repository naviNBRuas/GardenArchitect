# Garden Architect

Open `index.html` in any browser. No install, no server. Each browser tab keeps its own layout in sessionStorage and forgets it when the tab closes.

## Sun and location (top bar)

- Latitude: positive north of the equator, negative south. The noon sun sits toward the equator, so shade falls the other way.
- Plan top points to: compass bearing (0-359, 0 = north) of the top edge of the plan.
- Sunrise and Sunset: compass bearings where the sun rises and sets on the plot.
- Use my location fills in latitude if the browser allows it.
- Auto-arrange and the shade checks use these settings.

## New in this version

- Sun simulation: date and time sliders, moving shadows from module heights, per-module sun hours, sunrise and sunset worked out from latitude and date (untick Auto to type your own bearings).
- Plot: slope (% and downhill bearing) plus trees, buildings and fences as obstacles. The gravity cascade is checked (hub above pond, pond below vine and salad drains).
- Optimizer: Auto-arrange now runs a scored search (sun, pipe length, gravity, waste cluster, access) and shows the breakdown. Lock modules with the Lock button and it optimises around them.
- Resource balance: water, energy, animal feed, fertility, calories per day. Rain catchment comes from roof area and rainfall, solar from panel watts and simulated sun hours. Numbers per module are editable.
- Custom modules: "Custom module" card. They are saved in the layout JSON.

## Batch 2: variants, water lines, nutrient loop

- Variants: select a module, pick a variant (Coop + Pond: standard or two-story; Hub: one or two IBCs; Digester: standard or bag; Tree Guild: dwarf or semi-dwarf). Size, height, resources, extra parts and notes change, and the fit check re-runs. Define more under `variants` in content.js.
- Water and nutrient lines: the Lines card lets you click bends onto the plan (Route), find a path around modules (Auto-route), pick a tube size, and see routed length and gravity head from each Hydration Hub. The blueprint adds tube lengths, T-junctions and valves.
- Nutrient loop: new Nutrient Tank module (defined in content.js) that takes settled digestate, pond overflow and rain. The Nutrient card estimates mg/L nitrogen in the mixed water against an editable target and warns when raw digestate goes into the pond. Digestate solids can link to the Compost Bays.
- Dashboard now also tracks nitrogen, phosphorus and potassium. All new numbers are PLACEHOLDERS.

## Batch 3: researched yields

- `content.js` now carries sourced yield numbers (`facts`, with a ✓ for figures checked against a source and ? for assumptions) and per-module daily numbers for calories, protein, feed, nutrients and biogas.
- New Biogas Generator module (about 1.4 kWh electricity per m³ gas) and a People fed card: calories, protein and cooking gas against per-person needs, plus how many times the layout must scale to feed one person.
- `CONTENT.diy` holds empty places for DIY steps, blueprints and links per module. They are not shown in the app yet.
- Not researched yet: fruit tree guild, honey, worms, compost, greenhouse, herbs, digestate NPK, solar derating and the per-person needs.

## Content file: content.js (edit this one)

`spec`, `guides`, `heights`, `sunMin`, `weights` and `res` live in `content.js`. The resource numbers in it are PLACEHOLDERS until you replace them with researched values. Module definitions (`M`, `X`, `NM`), `R`, `CAT`, `TP` are still in index.html.

## Old notes: content inside index.html

- `SPEC`: your specifics per module (which trees, plants, breeds, sizes), one line per module key.
- `G`: build steps (`b`) and care tasks (`c`) for every module. Steps are separated by `|`. Care tasks start with `D:` `W:` `M:` or `S:` (daily, weekly, monthly, seasonal).
- `M`, `X`, `NM`: module definitions (names, sizes in blocks, colors, parts, placement rules). Add a module with an entry in `NM`, a line in `CAT`, a guide in `G` and any rules in `R`.
- `R`: connection rules `[from, to, label, kind]`, kind is w (water), f (feed), g (gas) or p (power).
- `CAT`: self-sufficiency categories a module covers: F food, W water, E energy, D animal feed, R fertility.
- `TP`: starter templates.

Exports: Export layout (JSON), Export blueprint (Markdown with build and care guides), Care plan, Guides.

## Batch 4: space add-ons, Rooftop Topiary, share link

- New add-ons (Vertical Trellis, Hanging Gutters, Tiered Shelves, Under-stilt Shade Bed, Understory Ring) plus more hosts for the old ones. They use no ground; each has a `gain` (extra growing m2, ESTIMATES). The Space card shows "Effective use" (ground + stacked).
- Rooftop Topiary: pick it, then click a single-story module (Hub, Compost, Shed, Worm, BSF, Nursery, Nutrient Tank, standard Coop). It follows its host, casts shadow at host height + 1.2 m, and survives Optimise. Roof loads are sourced (80-100 kg/m2 saturated for 50-90 mm substrate).
- Share link button: the layout is stored in the URL hash, no server.
- New code: `addons2.js`. Small patches in `addons.js` (heights, shade, optimizer).

## Batch 5: researched honey, apples, digestate; budget, progress, print

- Researched (✓ in Sources): honey per hive, dwarf and semi-dwarf apple yield, digestate nutrients. Bees now count 183 kcal/day and a mature dwarf tree 43 kcal/day in People fed.
- Budget and phases card: enter your own prices per module and add-on, totals per phase, a tick-off shopping list built from the parts lists. Prices are empty on purpose.
- Build progress card: build steps per module grouped by phase, plus a "before you build" permits and checks list.
- Print plan button: prints the plan with a scale bar and legend. Blueprint export now includes budget, shopping list and checks.
- Code: `addons3.js`.

## Batch 6: zoom, setup, climate, compare, bee setback

- Zoom: − and + in the top bar; drag the empty margin to pan.
- Setup card: yard size in metres and an optional template.
- Climate card: 12 monthly rain values, a Brasília preset (sourced, ✓), and a dry-season water check: it simulates the Hydration Hub tank month by month and says when it runs dry and how much storage is missing.
- Compare layouts: save the current plan as A or B and compare modules, optimizer score, effective yard use and cost.
- Bee setback check: warns when a hive is under 25 ft from the yard edge (UF/IFAS guide; local rules differ, Brazilian rules not checked).
- Code: `addons4.js`.

## Visual overhaul: models, theme, 3D view

- `models.js`: one low-poly model per module (parts list: box, cylinder, cone, pyramid). It drives the palette thumbnails, the plan tiles, the 3D view and `ModelKit.toThree(THREE,key,w,h)` for a real Three.js scene later. Edit a model here and every view updates.
- `theme.css`: new look, dark mode, motion (respects reduced-motion).
- `ui.js`: loads last, wraps `render()`/`say()`. Adds the 3D view button (drag to orbit, scroll to zoom), theme toggle, toasts.

- 3D view now has a sun clock with moving shadows (uses the planner's date, time and latitude), walk mode (WASD), add-ons and rooftop topiary, and a building-style model for custom modules. Docs show an exploded view per module.

- 3D: sloped ground follows the plot slope (with soil skirt), shadows and models sit on it, and walk mode clips near surfaces properly. Wicking-bed and worm-bin guides were researched and corrected in content.js (the wicking bed is now 40 to 60 cm deep).
- See TODO.md for everything still open, plus research results not yet applied (compost, greenhouse).
