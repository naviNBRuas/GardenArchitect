/* EDIT THIS FILE. The app reads it on load. Numbers marked PLACEHOLDER are rough guesses: replace them with your researched values. */
window.CONTENT={
 /* Your specifics per module key, shown under "Specifics" in the module details. */
 spec:{ /* bio:'Breeds, fish species, stocking numbers', tree:'Which tree, which berries' */ },
 /* Extra or replacement guides, same shape as G in index.html: b = build steps, c = care tasks, separated by | (care starts with D: W: M: S:) */
 guides:{
  wick:{b:'Build a 4×4 ft box 40 to 60 cm (16 to 24 in) deep, with a watertight liner|Make a reservoir 20 to 30 cm deep in the bottom: slotted pipe laid in gravel or scoria, with a vertical fill pipe and an overflow outlet at the reservoir top|Cover the gravel with geotextile so soil cannot wash into it|Fill with 20 to 40 cm of free-draining potting mix, not heavy topsoil|Fill until water leaves the overflow, then link a float valve to the Hub|Mulch the surface',c:'W:Check the reservoir level, every few days in summer|M:Top up mulch and add compost|S:Rotate crops and flush salts|S:Let the reservoir run nearly empty now and then so the soil can aerate'},
  worm:{b:'Use a shallow, opaque bin with air holes and a drain, raised on blocks over a tray|Fill it half to three-quarters with damp shredded cardboard or paper, wrung out like a sponge|Add red wigglers (Eisenia fetida), about 1 lb per sq ft of bin surface|Bury small amounts of scraps under the bedding and feed about once a week|Never add meat, dairy or greasy food, and go easy on citrus|Keep it in shade at about 15 to 25 °C, worms begin to die above about 29 °C',c:'W:Feed only what has disappeared and check the bedding is damp, not soggy|W:Drain leachate from the bottom tray|M:Add fresh bedding and harvest castings|S:In hot weather shade or insulate the bin, it must stay under about 29 °C'}
 },
 /* Module heights in metres. They drive shadow length and the shade checks. */
 heights:{bio:2.4,hub:1.5,biogas:1.2,wick:.5,salad:1.8,vine:2.2,bsf:.8,algae:2.2,tree:4,worm:.5,compost:1.2,nursery:1,greenhouse:2.5,solar:2.5,shed:2.2,bees:1,herb:.8,duckweed:.4},
 /* Minimum direct-sun hours per day a module wants. Modules not listed are not sun-checked. */
 sunMin:{wick:5,salad:5,vine:6,algae:6,tree:6,solar:5,greenhouse:5,herb:5},
 /* Optimizer weights (any scale). */
 weights:{sun:30,pipe:20,gravity:20,waste:15,access:15},
 /* PLACEHOLDER daily numbers per module. Positive = supplies, negative = needs.
    water L/day, energy Wh/day, feed g/day (animal feed), fert g/day (fertility), kcal kcal/day (human food).
    Rain catchment (Hydration Hub) and solar output (Power Hub) are calculated from the roof, rainfall and panel inputs in the app. */
 res:{
  bio:{water:-15,energy:-120,feed:-450,fert:300,kcal:300}, biogas:{fert:200}, wick:{water:-20,fert:-50,kcal:500},
  salad:{water:-8,fert:-20,kcal:60}, vine:{water:-10,fert:-30,kcal:120}, bsf:{feed:150,fert:50}, algae:{water:-3,energy:-20,feed:40,kcal:80},
  tree:{water:-10,fert:-20,kcal:150}, worm:{fert:80}, compost:{fert:150}, greenhouse:{water:-12,kcal:150}, herb:{water:-2,kcal:10},
  duckweed:{feed:100}, bees:{kcal:40}
 }
};

/* ===== BATCH 2 CONTENT (all numbers are PLACEHOLDERS until you research them) ===== */
Object.assign(CONTENT,{
 minHead:0.3, hubStore:1000, nutrientTarget:{n:[50,150]}, /* metres of head a gravity line needs; litres per hub; mg/L nitrogen in the feed water */
 /* New modules defined here (name, size in blocks, colour, parts, rules). Guides go in CONTENT.guides. */
 modules:[{k:'ntank',n:'Nutrient Tank',sub:'Settle, dilute, mix',d:'Digestate + pond overflow + rain',w:1,h:1,c:'#15803d',i:'🧪',cat:'R',about:'Settles the liquid from the digester, mixes it with pond overflow and rainwater to a safe strength, then sends nutrient water to the beds. Keeps raw digestate out of the pond.',rule:'Downhill of the digester and the pond overflow, uphill of the beds it feeds. Shaded and covered.',crop:'Diluted nutrient water for beds and trees',bom:['200–500 L lidded tank with settling zone','Aeration pump + air stone','Inlet strainer and outlet tap','Float valve for rain top-up']}],
 rules:[['biogas','ntank','Digestate liquid (settled)','n'],['bio','ntank','Pond overflow','n'],['hub','ntank','Rain for dilution','w'],['ntank','wick','Nutrient water','n'],['ntank','vine','Nutrient water','n'],['ntank','salad','Nutrient water','n'],['ntank','tree','Nutrient water','n'],['biogas','compost','Digestate solids','f']],
 heights2:{ntank:1.2},
 /* Variants: w,h in blocks, ht in metres, store in litres, res overrides, bom = extra parts, note = shown in the app. */
 variants:{
  bio:[{k:'std',n:'Standard coop + pond'},{k:'two',n:'Two-story coop',ht:4.5,res:{feed:-700,kcal:480,fert:450,energy:-130},bom:['Second floor deck + ladder or ramp','Extra roost bars and nest boxes','Stronger posts and bracing'],note:'More roosting area on the same footprint. PLACEHOLDER numbers: set hens, feed and manure for your design.'}],
  hub:[{k:'std',n:'One IBC (1000 L)'},{k:'two',n:'Two IBCs (2000 L)',w:2,h:1,store:2000,bom:['Second 1000 L tote','Link pipe between totes']}],
  biogas:[{k:'std',n:'Standard digester'},{k:'bag',n:'Bag digester',w:1,h:2,ht:.8,bom:['Heavy-duty bag + fittings'],note:'Check bag life and the local frost.'}],
  tree:[{k:'std',n:'Dwarf guild'},{k:'semi',n:'Semi-dwarf guild',ht:5.5,res:{kcal:250,water:-15},note:'Casts a longer shadow, plan it at the back.'}]
 }
});
/* nutrients g/day: n nitrogen, p phosphorus, k potassium. PLACEHOLDERS */
Object.entries({bio:{n:8,p:3,k:4},biogas:{n:6,p:2,k:4},compost:{n:3,p:1,k:3},wick:{n:-4,p:-1,k:-5},salad:{n:-2,p:-.5,k:-2},vine:{n:-3,p:-1,k:-4},tree:{n:-2,p:-.5,k:-2}}).forEach(([k,v])=>CONTENT.res[k]=Object.assign(CONTENT.res[k]||{},v));

/* ===== BATCH 3: RESEARCHED YIELDS (ok:1 = checked against a source this session, ok:0 = general reference or assumption, still to verify) ===== */
CONTENT.person={kcal:2200,prot:55,gasCook:0.45}; /* per person per day. ok:0. Cooking gas: 150-300 L biogas per person per meal (SSWM), 2 hot meals assumed */
CONTENT.facts=[
 {k:'Hen feed',v:'143 g/hen/day (range 100-150)',s:'Rutgers, Heckman 2012; Alabama Extension ACES',ok:1},
 {k:'Egg production',v:'50% winter to 80% summer lay rate; up to 250 eggs in year 1, about 200 in year 2; egg 75 g',s:'Rutgers; Purina',ok:1},
 {k:'Hen manure',v:'144 g fresh/hen/day, 75-80% water, N 4.88%, P2O5 1.92%, K2O 1.71% of dry matter',s:'Choi et al. 2001, Korean RDA',ok:1},
 {k:'Nile tilapia in aquaponics',v:'6 kg/m3 standing stock recommended (NFT trial); FCR 2.2-2.7; 3.4-3.5 kg/m3 over 15 weeks from fry',s:'MDPI Sustainability 2023; aquaponic stocking trial 2010',ok:1},
 {k:'Potato / sweet potato',v:'Field averages about 29 t/ha (2.9 kg/m2) and 12 t/ha (1.25 kg/m2)',s:'FAO figures via PotatoPro. Home beds may beat field averages',ok:1},
 {k:'Aquaponic lettuce',v:'7.4 kg/m2/yr in a pilot flow-through system; vertical CEA 6.88 kg/m2 per crop',s:'HortiDaily pilot study; Plants 2023 meta-analysis',ok:1},
 {k:'Tomato',v:'3.9-6.2 kg per plant under shade net',s:'University of Pretoria trial',ok:1},
 {k:'Spirulina',v:'5.1-5.6 g/m2/day year-round (industrial, Portugal); 10.5 (Korea raceway); 30 with CO2 in optimised 80 m2 raceways; 58-65% protein',s:'Allmicroalgae case study; J. Microbiol. Biotechnol. 2007; PMC9368457',ok:1},
 {k:'Black soldier fly',v:'Bioconversion 12.8% chicken manure, 6.5% kitchen waste (wet); waste cut 80-92%; 44% crude protein (dry); 252 g/m2/day wet in the field',s:'Eawag/Diener 2011; AJOL; Meru Univ.',ok:1},
 {k:'Duckweed',v:'80-100 g fresh/m2/day (about 5% dry matter) at 10-30 mg/L N; 35-43% protein; strong chicken-manure water slows it',s:'FAO AC151E; Koreascience; J. Anim. Feed Sci.',ok:1},
 {k:'Biogas yield',v:'Poultry manure 30-100 m3/t; kitchen waste about 0.1 m3/kg; 55-75% methane; H2S 1-3% in chicken-manure gas',s:'anaerobic-digestion.com; EPFL 2020; Ukrainian livestock by-products study',ok:1},
 {k:'Biogas energy',v:'6-6.5 kWh/m3 heat; about 700 L biogas per kWh electricity in a dual-fuel engine (about 24% efficiency); cooking 150-300 L per person per meal',s:'SSWM / Akvopedia; Undip family-size generator study',ok:1},
 {k:'Egg, fish, food energy values',v:'Egg about 97 kcal and 8.5 g protein (edible part of 75 g); potato 770 kcal/kg; lettuce 150; tomato 180; spirulina 2900',s:'General nutrition tables (USDA style), not re-checked',ok:0},
 {k:'Not researched yet',v:'Fruit tree guild yield, honey, worm castings, compost, greenhouse, herbs, digestate NPK, solar derating, human needs (2200 kcal, 55 g protein)',s:'Pending',ok:0}
];
Object.entries({
 bio:{feed:-858,n:9,p:1.6,k:2.7,kcal:426,prot:43}, /* 6 hens (0.65 laying rate) + 1.5 m3 pond at 6 kg/m3 per 180 d (cycle length ok:0) */
 wick:{kcal:9,prot:.2}, salad:{kcal:4,prot:.4}, vine:{kcal:12,prot:.6}, algae:{kcal:31,prot:6.5,feed:0},
 bsf:{feed:31,n:0}, duckweed:{feed:4}, biogas:{gas:.106}, genset:{gas:-.05,energy:71}
}).forEach(([k,v])=>CONTENT.res[k]=Object.assign(CONTENT.res[k]||{},v));
Object.assign(CONTENT.spec,{
 bio:'Hens: layer hybrids or dual-purpose breeds (Leghorn hybrids, Barred Rock, Rhode Island Red); layer feed about 18% protein. Fish: Nile tilapia at about 6 kg/m3 standing stock. Defaults assume 6 hens and 1.5 m3 of pond.',
 wick:'Potato or sweet potato for calories. Field averages are 2.9 and 1.25 kg/m2 per crop; use these as the conservative baseline.',
 salad:'Lettuce and leafy greens; 8-10 lettuce per 1.5 m tower. Light falls to about 10% at the bottom of a tall tower, so put shade-tolerant crops low.',
 vine:'Tomato at 3.9-6.2 kg per plant; one plant per bucket, 6 buckets.',
 algae:'Spirulina, 58-65% protein. Outdoor 5-10 g dry/m2/day; up to 30 with CO2 control in large raceways. Needs its own alkaline medium.',
 bsf:'Feed the larvae chicken manure (12.8% conversion) and kitchen waste (6.5%). Prepupae are about 44% protein (dry).',
 duckweed:'Lemna on diluted nutrient water, 10-30 mg/L N. Undiluted chicken-manure water slowed growth in one trial.',
 biogas:'Poultry manure 30-100 m3 biogas per tonne, kitchen waste about 0.1 m3/kg. Chicken-manure gas can carry H2S, so filter it.',
 genset:'About 700 L biogas per kWh electricity in a dual-fuel engine (about 24% efficient).'
});
CONTENT.modules.push({k:'genset',n:'Biogas Generator',sub:'Gas to electricity',d:'Runs a small engine on biogas',w:1,h:1,c:'#9a3412',i:'🔌',cat:'E',about:'A small engine-generator running on biogas from the digester. It turns the gas that is not used for cooking into electricity for pumps, aerators and a battery.',rule:'Outdoors or in a well-ventilated shelter, close to the digester and the Power Hub. Exhaust has carbon monoxide. Check local rules and keep clear of the house and bee hive.',crop:'About 1.4 kWh electricity per m3 of biogas',bom:['Small generator (about 1 kW class) converted or sold for biogas','Gas filter and water trap (H2S and moisture)','Gas holder or bladder before the engine','Flame arrestor and shut-off valve','Battery charger link to the Power Hub']});
CONTENT.rules.push(['biogas','genset','Biogas fuel line','g'],['genset','solar','Battery charging','p'],['genset','bio','Pump and aerator power','p']);
CONTENT.heights.genset=1;
/* PLACES FOR DIY INSTRUCTIONS AND BLUEPRINTS (empty on purpose, not shown in the app yet) */
CONTENT.diy=Object.fromEntries(['bio','hub','biogas','genset','wick','salad','vine','bsf','algae','tree','worm','compost','nursery','greenhouse','solar','shed','bees','herb','duckweed','ntank'].map(k=>[k,{steps:[],blueprint:'',links:[],sources:[]}]));

/* Unsourced calorie placeholders removed so People fed only counts researched modules. Fill these in after research. */
['tree','greenhouse','bees','herb'].forEach(k=>{if(CONTENT.res[k])CONTENT.res[k].kcal=0});

/* ===== BATCH 5: researched honey, apples, digestate ===== */
CONTENT.facts.forEach(f=>{if(f.k==='Not researched yet'){f.v='Worm castings, compost, greenhouse, herbs, solar derating, human needs (2200 kcal, 55 g protein), setback distances, nutrient tank target, daily digestate output, all prices';f.s='Pending'}});
CONTENT.facts.splice(-1,0,
 {k:'Honey',v:'Average harvested yield 21.8 kg per producing colony (USDA, 2025); NZ 10-year average 28.6 kg/hive; strong hives can exceed 45 kg; plan on none in year one; leave 18-40 kg for the bees to overwinter, more in cool climates',s:'USDA via beekeepertips.com; NZ MPI apiculture reports; beekeepinginsider.com',ok:1},
 {k:'Dwarf and semi-dwarf apple',v:'Dwarf 1-4 bushels per tree (about 20-80 kg), semi-dwarf 5-10 bushels (about 100-200 kg); semi-dwarf starts bearing at 6-8 years; the app uses conservative 30 kg and 100 kg per year at maturity',s:'Stark Bro\'s yield guide; Raintree Nursery; 1 bushel taken as about 19-20 kg',ok:1},
 {k:'Digestate nutrients',v:'Farm-scale digestate: 2-4 kg plant-available N per tonne and 0.5-1.7 kg P per tonne; poultry-litter liquid digestate about 0.8 kg N, 0.9 kg P, 1.3 kg K per m3 (unit conversion from lb/1000 gal); 60-90% of the N is ammonium; under 2% solids; P and K stay in the solids; analyse before use',s:'SLU Sweden digestate guide; Brinson Farms poultry digester case; Gdansk Univ. of Tech.',ok:1},
 {k:'Honey and apple energy',v:'Honey about 3000 kcal/kg, apple about 520 kcal/kg',s:'General nutrition tables, not re-checked',ok:0});
CONTENT.res.bees=Object.assign(CONTENT.res.bees||{},{kcal:183,prot:0}); /* 22 kg honey/yr x 3000 kcal/kg / 365 */
CONTENT.res.tree=Object.assign(CONTENT.res.tree||{},{kcal:43}); /* 30 kg apples/yr x 520 / 365, mature dwarf tree only */
CONTENT.variants.tree[1].res={kcal:142,water:-15}; /* 100 kg/yr */
Object.assign(CONTENT.spec,{bees:'One hive: plan on about 22 kg of honey in a normal year (USDA average 21.8 kg, NZ 28.6 kg), none in year one. Leave enough stores for the bees. Pollination also lifts fruit set on the guild.',tree:'Dwarf apple gives 1-4 bushels (about 30 kg used here) once mature; semi-dwarf 5-10 bushels but bears at 6-8 years. Calories shown are for a mature tree and count only the apple, not the berries.',biogas:'Poultry manure 30-100 m3 biogas per tonne, kitchen waste about 0.1 m3/kg. Digestate is mostly ammonium N (2-4 kg per tonne); analyse it before use and settle or dilute it first. Filter H2S.'});

/* ===== BATCH 6: bee setback, Brasilia rainfall ===== */
CONTENT.facts.splice(-1,0,
 {k:'Beehive siting',v:'UF/IFAS good-neighbour guide: keep hives about 25 ft from a property line and use a flyway barrier at least 6 ft high; city ordinances range from 10 ft to 50 ft and some add a 6 ft barrier, water within 3-20 ft and limits on hive count. US sources: Brazilian and local rules may differ',s:'UF/IFAS EDIS ENY115; Harrisonburg VA, Peru IN, Leawood KS, NJ ordinances',ok:1},
 {k:'Brasilia rainfall',v:'Monthly mm Jan-Dec: 284, 211, 224, 136, 34, 7, 10, 14, 49, 163, 260, 276 (about 1670 mm); dry season May-September, wet season October-April; sources differ by 10-20%; driest year in a 43-year record 963 mm, wettest 1971 mm',s:'Travelstart climate table; Aventura do Brasil; avionero.com historical data',ok:1}
);
