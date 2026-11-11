/* Batch 4: more add-ons with space gain, Rooftop Topiary (stacks on single-story modules), effective-space card, share link. Loads after addons.js. */
(()=>{
const C=window.CONTENT,SQ=1.44,HOSTS=['hub','compost','shed','worm','bsf','nursery','ntank','bio'];
/* ---- add-ons: zero footprint, gain = extra growing m2 (ESTIMATES, not researched) ---- */
const GAIN={fungi:.6,arch:1.5,solar:0,pest:0,mass:0};
const NA=[
{k:'trel',n:'Vertical Trellis',i:'🪜',on:['wick','herb','compost','worm','shed','hub'],sub:'Climbers up the side wall',bom:'Cattle panel or net on posts, plus climbers (beans, passionfruit). Keep it off sun-hungry neighbours.',gain:1.5},
{k:'hang',n:'Hanging Gutters',i:'🪴',on:['shed','hub','nursery','greenhouse','bsf','ntank'],sub:'Rain-gutter planters on the walls',bom:'3 m plastic gutter with end caps, brackets, light potting mix',gain:1.2},
{k:'tier',n:'Tiered Shelves',i:'🗄️',on:['nursery','greenhouse','worm','duckweed'],sub:'Trays on three levels',bom:'Shelf frame with 3 tray levels and drip trays',gain:1.5},
{k:'under',n:'Under-stilt Shade Bed',i:'🌱',on:['bio'],sub:'Shade crops below the coop floor',bom:'Shallow trays or grow bags of shade-tolerant crops; keep clear of droppings and the pond edge',gain:1},
{k:'ring',n:'Understory Ring',i:'🍓',on:['tree'],sub:'Strawberries and herbs at the drip-line',bom:'Edging, strawberries, chives, thyme',gain:1}];
A.forEach(a=>{if(GAIN[a.k]!==undefined)a.gain=GAIN[a.k]});NA.forEach(a=>{if(!A.some(x=>x.k===a.k))A.push(a)});
A.find(a=>a.k==='fungi').on.push('worm','compost');A.find(a=>a.k==='arch').on.push('herb','nursery');
/* ---- topiary module ---- */
const TOP={k:'topiary',n:'Rooftop Topiary',sub:'Planter on a roof',d:'Sits on top of a single-story module',w:1,h:1,c:'#4d7c0f',i:'🌳',top:1,cat:'',about:'A clipped shrub or herb planter on the roof of a single-story module (Hub, Compost Bays, Shed, Worm Farm, BSF bin, Nursery, Nutrient Tank or the standard Coop). It adds growing space without using any ground. Click a host module to place it; it follows the host when you move it.',rule:'Only on a roof that can take about 100-150 kg per block saturated (checked: extensive green roofs weigh 80-100 kg/m2 at 50-90 mm substrate; 1.44 m2 per block). Not on the biogas dome, generator, hive, greenhouse glass or two-story coop. Keep the Hub inlet and gutter clear.',crop:'Clipped herbs, sedum, thyme, oregano; boxwood or rosemary in a deeper pot',spec:'Shallow roof (70-90 mm substrate): sedum, thyme, oregano. Deeper planter (200 mm, about 200 kg/m2 saturated): rosemary, lavender, clipped box. Weights are saturated figures.',bom:['Waterproofed, edged tray or planter box with drainage board','50-90 mm free-draining substrate (or 200 mm for shrubs)','Plants: sedum, thyme, oregano, or a clipped shrub','Check the roof frame for the saturated load']};
M.push(TOP);T.topiary=TOP;C.heights.topiary=1.2;C.res.topiary={water:-3};G.topiary={b:'Check the host roof frame can carry the saturated planter load|Fit a waterproof tray with drainage and an overflow away from the host inlets|Add drainage board, then 70-90 mm of free-draining substrate|Plant sedum or herbs, or a clipped shrub in a 200 mm planter|Keep the roof edge clear for access',c:'W:Check drainage and the plants for water stress|M:Clip, weed and feed lightly|S:Check the roof frame and tray for leaks and wear'};
C.facts.splice(-1,0,{k:'Roof planter loads',v:'Extensive sedum roof about 80-100 kg/m2 saturated (40 kg/m2 lightweight, 50-90 mm substrate); herb or wildflower 125 kg/m2 at 90 mm; 150-200 kg/m2 at 200 mm; dry weight about 50-60% of saturated; calculate with saturated weight',s:'Sempergreen; Optigruen; Camden planning specs (Icopal, Wallbarn)',ok:1});
const hh=o=>(S.ht&&S.ht[o.t]!==undefined)?S.ht[o.t]:(vd(o.t,o.v).ht??C.heights[o.t]??1);
const inH=(o,x,y)=>{const[w,h]=dim(o);return x>=o.x&&x<o.x+w&&y>=o.y&&y<o.y+h};
const hostAt=(x,y)=>S.items.find(o=>!T[o.t].top&&HOSTS.includes(o.t)&&hh(o)<=3&&inH(o,x,y));
const _f=fits;fits=(t,x,y,r,ig)=>{if(T[t].top)return x>=0&&y>=0&&!!hostAt(x,y)&&!S.items.some(o=>T[o.t].top&&o.id!==ig&&o.x===x&&o.y===y);
 const all=S.items;S.items=all.filter(o=>!T[o.t].top);try{return _f(t,x,y,r,ig)}finally{S.items=all}};
function sync(){S.items.filter(i=>T[i.t]&&T[i.t].top).forEach(i=>{let h=get(i.on);
 if(h&&i.hx!==undefined&&(h.x!==i.hx||h.y!==i.hy||!!h.r!==i.hr)){if(!!h.r!==i.hr){i.x=h.x;i.y=h.y}else{i.x+=h.x-i.hx;i.y+=h.y-i.hy}}
 if(!h||!inH(h,i.x,i.y))h=hostAt(i.x,i.y);
 if(!h){S.items=S.items.filter(o=>o!==i);return}
 const[w,d]=dim(h);i.x=Math.max(h.x,Math.min(h.x+w-1,i.x));i.y=Math.max(h.y,Math.min(h.y+d-1,i.y));i.on=h.id;i.hx=h.x;i.hy=h.y;i.hr=!!h.r;i.r=false})}
const _s=say;say=t=>_s(pal&&T[pal]&&T[pal].top&&/overlaps/.test(t)?'Topiary goes on top of a single-story module: click one (Hub, Compost, Shed, Worm, BSF, Nursery, Nutrient Tank, standard Coop).':t);
document.querySelector('.stage').addEventListener('pointerdown',e=>{if(!(pal&&T[pal]&&T[pal].top)||!e.target.closest('#grid'))return;const[x,y]=cell(e);
 if(fits(pal,x,y,false)){S.items.push({id:S.n++,t:pal,x,y,r:false,ad:[]});render()}else say('That spot overlaps another module or leaves the yard.');e.stopImmediatePropagation();e.stopPropagation();e.preventDefault()},true);
const _r=render;render=function(){sync();_r();
 document.querySelectorAll('#grid .it').forEach(e=>{const i=get(+e.dataset.id);if(i&&T[i.t].top){Object.assign(e.style,{borderRadius:'50%',zIndex:2,transform:'scale(.78)',background:'radial-gradient(circle at 35% 30%,#a3e635,#4d7c0f)'})}});
 const gr_=S.items.filter(i=>!T[i.t].top),tp=S.items.filter(i=>T[i.t].top),gA=gr_.reduce((s,i)=>{const[w,h]=dim(i);return s+w*h},0)*SQ,ad=S.items.reduce((s,i)=>s+i.ad.reduce((q,k)=>q+((A.find(a=>a.k===k)||{}).gain||0),0),0),bonus=ad+tp.length*SQ,Y=S.cols*S.rows*SQ,f=v=>S.unit==='ft'?Math.round(v*10.764)+' ft²':v.toFixed(1)+' m²';
 $('#st').insertAdjacentHTML('beforeend',`<p style="margin:6px 0 0;font-size:12px"><b>Effective use ${Math.round((gA+bonus)/Y*100)}%</b> of the yard: ${f(gA)} on the ground + ${f(bonus)} stacked (${tp.length} rooftop topiary, add-ons ${f(ad)}).</p><p class="mu" style="font-size:11px;margin:2px 0 0">Add-on gains are estimates. Topiary counts one block (1.44 m²) each.</p>`);
 const it=get(sel);if(it&&T[it.t].top){const h=get(it.on);$('#sp').insertAdjacentHTML('afterbegin',`<p style="margin:0 0 6px;font-size:12px">🌳 On ${h?nm(h):'?'}. Load about ${Math.round(SQ*100)}-${Math.round(SQ*200)} kg saturated per block, more with deep soil. Drag it to another roof to move it.</p>`)}};
document.querySelector('header').insertAdjacentHTML('beforeend','<button data-x2="share">Share link</button>');
document.addEventListener('click',e=>{const t=e.target.closest('[data-x2]');if(!t)return;openD('exp');$('#dt').textContent='Shareable link. Copy and open it in any browser.';const x=$('#dx');x.value=location.href.split('#')[0]+'#'+btoa(unescape(encodeURIComponent(JSON.stringify(S))));x.select()},true);
try{if(location.hash.length>20){const o=JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1)))));if(Array.isArray(o.items)&&Array.isArray(o.links)&&o.items.every(i=>T[i.t]||(o.custom||[]).some(c=>c.k===i.t))){S={...D,...o};history.replaceState(null,'',location.pathname)}}}catch(_){}
render();
})();
