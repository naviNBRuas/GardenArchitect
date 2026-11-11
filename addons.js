/* Garden Architect add-ons: sun simulation, plot (slope + obstacles), scored optimizer, resource balance, custom modules. Loads after index.html's script. */
(()=>{
const C=window.CONTENT||{},CELL=1.2,RAD=Math.PI/180,rnd=n=>Math.floor(Math.random()*n);
C.res=C.res||{};C.heights=C.heights||{};C.sunMin=C.sunMin||{};C.weights=C.weights||{sun:30,pipe:20,gravity:20,waste:15,access:15};
Object.assign(G,C.guides||{});
const OB={tree:{i:'🌲',h:6,c:'#14532d',n:'Tree'},bld:{i:'🏠',h:3,c:'#78716c',n:'Building'},fence:{i:'▦',h:1.8,c:'#a8a29e',n:'Fence'}};
const RK=[['water','💧','Water','L/d'],['energy','⚡','Energy','Wh/d'],['feed','🌾','Animal feed','g/d'],['fert','♻️','Fertility','g/d'],['kcal','🍽','Calories','kcal/d']];
let OBT=null,playT=null,openRv=false;
const doy=()=>{const d=new Date();return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)};
const hm=t=>{let h=Math.floor(t),m=Math.round((t-h)*60);if(m===60){h++;m=0}return h+':'+String(m).padStart(2,'0')};
const HT=k=>(S.ht&&S.ht[k]!==undefined)?S.ht[k]:(C.heights[k]??1);

/* ---------- sun maths ---------- */
function decl(){return 23.44*Math.sin(2*Math.PI*(284+S.day)/365)*RAD}
function sunPos(t){const d=decl(),p=S.lat*RAD,h=(t-12)*15*RAD,al=Math.asin(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h)),az=Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(p)-Math.tan(d)*Math.cos(p))+Math.PI;return{al,az:(az/RAD+360)%360}}
function dayInfo(){const d=decl(),p=S.lat*RAD,c=-Math.tan(p)*Math.tan(d);if(c>=1)return{len:0,rise:12,set:12,az:0,polar:'Polar night'};if(c<=-1)return{len:24,rise:0,set:24,az:0,polar:'Midnight sun'};const H=Math.acos(c)/RAD/15,az=Math.acos(Math.max(-1,Math.min(1,Math.sin(d)/Math.cos(p))))/RAD;return{len:2*H,rise:12-H,set:12+H,az}}
const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
function cv(P){P=[...P].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const lo=[],up=[];for(const p of P){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(const p of[...P].reverse()){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}return lo.slice(0,-1).concat(up.slice(0,-1))}
function inP(q,P){let s=0;for(let k=0;k<P.length;k++){const a=P[k],b=P[(k+1)%P.length],c=cr(a,b,q);if(c>1e-9){if(s<0)return false;s=1}else if(c<-1e-9){if(s>0)return false;s=-1}}return true}
function casters(){return[...S.items.map(i=>{const[w,h]=dim(i);return{id:i.id,on:i.on,x:i.x,y:i.y,w,h,ht:vHT(i)}}),...S.obs.map(o=>({id:'o',x:o.x,y:o.y,w:1,h:1,ht:OB[o.k].h}))]}
function hull(c,sp){const L=Math.min(40,c.ht/CELL/Math.tan(sp.al)),v=vecA(sp.az),dx=-v[0]*L,dy=-v[1]*L,p=[[c.x,c.y],[c.x+c.w,c.y],[c.x+c.w,c.y+c.h],[c.x,c.y+c.h]];return cv([...p,...p.map(q=>[q[0]+dx,q[1]+dy])])}
function sunHours(){const di=dayInfo(),cs=casters(),out={};S.items.forEach(i=>out[i.id]=0);for(let t=Math.max(0,di.rise);t<Math.min(24,di.set);t+=.25){const sp=sunPos(t+.125);if(sp.al<.03)continue;const hs=cs.map(c=>({id:c.id,on:c.on,p:hull(c,sp)}));S.items.forEach(i=>{const q=ctr(i);if(!hs.some(h=>h.id!==i.id&&h.id!==i.on&&h.on!==i.id&&inP(q,h.p)))out[i.id]+=.25})}return out}

/* ---------- plot: elevation, gravity ---------- */
const el=i=>{const v=vecA(S.slope.b),c=ctr(i);return-(S.slope.p/100)*(c[0]*v[0]+c[1]*v[1])*CELL};
function gravChecks(){const r=[],by=t=>S.items.filter(i=>i.t===t);by('hub').forEach(h=>{const bs=by('bio');if(!bs.length)return;const b=bs.reduce((a,c)=>dist(h,c)<dist(h,a)?c:a);r.push([el(h)+.5>el(b)+.05,nm(h)+' (raised 0.5 m) is not above '+nm(b)+', so the gravity feed will not run'])});
 by('bio').forEach(b=>['vine','salad'].forEach(t=>by(t).forEach(s=>r.push([el(b)<=el(s)+.05,nm(b)+' is higher than '+nm(s)+', so its drain will not return by gravity']))));return r}

/* ---------- optimizer ---------- */
function access(){const occ=new Set();S.items.forEach(i=>{const[w,h]=dim(i);for(let x=i.x;x<i.x+w;x++)for(let y=i.y;y<i.y+h;y++)occ.add(x+','+y)});S.obs.forEach(o=>occ.add(o.x+','+o.y));
 const seen={};let best=[];for(let x=0;x<gc();x++)for(let y=0;y<gr();y++){const k=x+','+y;if(occ.has(k)||seen[k])continue;const q=[[x,y]],cl=[];seen[k]=1;while(q.length){const[a,b]=q.pop();cl.push(a+','+b);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=a+dx,ny=b+dy,kk=nx+','+ny;if(nx<0||ny<0||nx>=gc()||ny>=gr()||occ.has(kk)||seen[kk])return;seen[kk]=1;q.push([nx,ny])})}if(cl.length>best.length)best=cl}
 const B=new Set(best);let ok=0;S.items.forEach(i=>{const[w,h]=dim(i);let r=false;for(let x=i.x-1;x<=i.x+w&&!r;x++)for(let y=i.y-1;y<=i.y+h&&!r;y++){const ix=x>=i.x&&x<i.x+w,iy=y>=i.y&&y<i.y+h;if((ix&&iy)||(!ix&&!iy))continue;if(B.has(x+','+y)||x<0||y<0||x>=gc()||y>=gr())r=true}if(r)ok++});return S.items.length?ok/S.items.length:1}
function parts(){const its=S.items;if(!its.length)return null;const W=C.weights,P={},need=its.filter(i=>C.sunMin[i.t]);let n=0,ok=0;
 if(need.length){const cs=casters();[9,12,15].forEach(t=>{const sp=sunPos(t);if(sp.al<.05)return;const hs=cs.map(c=>({id:c.id,on:c.on,p:hull(c,sp)}));need.forEach(i=>{n++;if(!hs.some(h=>h.id!==i.id&&h.id!==i.on&&h.on!==i.id&&inP(ctr(i),h.p)))ok++})})}
 P.sun=n?ok/n:1;const ds=[];R.forEach(([a,b])=>its.filter(i=>i.t===a).forEach(A=>{const Bs=its.filter(i=>i.t===b);if(Bs.length)ds.push(Math.min(...Bs.map(B=>dist(A,B))))}));
 const avg=ds.length?ds.reduce((x,y)=>x+y,0)/ds.length:2;P.pipe=Math.max(0,Math.min(1,1-(avg-2)/10));
 const g=gravChecks();P.gravity=g.length?g.filter(x=>x[0]).length/g.length:1;
 const ws=its.filter(i=>['bio','biogas','bsf','compost','worm'].includes(i.t));let pr=0,pk=0;for(let a=0;a<ws.length;a++)for(let b=a+1;b<ws.length;b++){pr++;if(Math.max(...gap(ws[a],ws[b]))<=1)pk++}P.waste=pr?pk/pr:1;
 P.access=access();const ks=Object.keys(W),tw=ks.reduce((s,k)=>s+W[k],0)||1;P.total=ks.reduce((s,k)=>s+W[k]*P[k],0)/tw*100;return P}
function optimize(){const base0=S.items.map(i=>({...i})),tops=base0.filter(i=>T[i.t].top),base=base0.filter(i=>!T[i.t].top),lk=base.filter(i=>i.lk),fr=base.filter(i=>!i.lk);if(!fr.length){say('Everything is locked. Unlock a module to optimise.');return}
 const place=(i,tries)=>{for(let t=0;t<tries;t++){const r=Math.random()<.5,x=rnd(gc()),y=rnd(gr());if(fits(i.t,x,y,r,i.id)){S.items.push({...i,x,y,r});return true}}for(let y=0;y<gr();y++)for(let x=0;x<gc();x++)for(const r of[false,true])if(fits(i.t,x,y,r,i.id)){S.items.push({...i,x,y,r});return true}return false};
 let best=null,bs=-1;
 for(let n=0;n<400;n++){S.items=lk.map(i=>({...i}));let ok=true;for(const i of fr.slice().sort(()=>Math.random()-.5))if(!place(i,30)){ok=false;break}if(!ok)continue;const s=parts().total;if(s>bs){bs=s;best=S.items.map(i=>({...i}))}}
 if(!best){S.items=base0;say('Could not fit every module around the locked ones. Enlarge the yard or unlock something.');render();return}
 S.items=best.map(i=>({...i}));
 for(let n=0;n<1500;n++){const k=rnd(S.items.length),i=S.items[k];if(i.lk)continue;const o=S.items.splice(k,1)[0];if(place(o,15)){const s=parts().total;if(s>=bs){bs=s;best=S.items.map(i=>({...i}));continue}}S.items=best.map(i=>({...i}))}
 S.items=best.concat(tops);say('Optimised: score '+Math.round(bs)+'/100. Lock the modules you like and run it again to optimise around them.');render()}

/* ---------- resources ---------- */
let LASTB;const vd=(t,k)=>{const m=T[t],v=k&&(C.variants[t]||[]).find(x=>x.k===k);return v?{...m,...['w','h','ht','store'].reduce((o,f)=>v[f]!==undefined?{...o,[f]:v[f]}:o,{})}:m};window.vd=vd;
const vHT=i=>{const o=(S.ht&&S.ht[i.t]!==undefined)?S.ht[i.t]:(vd(i.t,i.v).ht??C.heights[i.t]??1),h=i.on&&get(i.on);return h?o+vHT(h):o};
const rvi=(i,r)=>{const o=S.rv[i.t+'.'+r];if(o!==undefined)return o;const v=(C.variants[i.t]||[]).find(x=>x.k===i.v);return v&&v.res&&v.res[r]!==undefined?v.res[r]:((C.res[i.t]||{})[r]||0)};
const fmt=v=>v<10?+v.toFixed(2):Math.round(v);const rv=(k,r)=>{const o=S.rv[k+'.'+r];return o!==undefined?o:((C.res[k]||{})[r]||0)};
function balance(sh){const t={};RK.forEach(([r])=>t[r]={s:0,d:0});S.items.forEach(i=>RK.forEach(([r])=>{let v=rvi(i,r);if(i.t==='hub'&&r==='water')v+=S.clim.roof*S.clim.rain/365*.8;if(i.t==='solar'&&r==='energy')v+=S.clim.panel*.75*(sh[i.id]||0);if(v>=0)t[r].s+=v;else t[r].d-=v}));return t}

/* ---------- custom modules ---------- */
function regCustom(list){(list||S.custom||[]).forEach(d=>{if(!T[d.k]){const m={sub:'Custom module',d:'Custom module',about:'Your own module.',rule:'Add your own placement rules.',crop:'',bom:[],cat:'',...d};M.push(m);T[d.k]=m}})}

/* ---------- UI ---------- */
const side=document.querySelector('.side');
side.insertAdjacentHTML('afterbegin',`<div class="card" id="xs"><h2>☀️ Sun simulation</h2>
<label class="ctl" style="display:flex">Date <input id="sdt" type="range" min="1" max="365" style="flex:1"> <span id="sdl" style="min-width:48px"></span></label>
<label class="ctl" style="display:flex">Time <input id="stm" type="range" min="0" max="24" step=".25" style="flex:1"> <span id="stl" style="min-width:48px"></span></label>
<div class="row"><button id="play">▶ Play day</button><label class="ctl"><input type="checkbox" id="sau"> Auto sunrise/sunset</label></div>
<p class="mu" id="sinf" style="margin:4px 0;font-size:12px"></p><div id="xt"></div></div>
<div class="card" id="xo"></div><div class="card" id="xp"></div><div class="card" id="xr"></div>
<div class="card" id="xc"><h2>➕ Custom module</h2><div class="row"><input id="cn" placeholder="Name" style="width:100px"><input id="ci" placeholder="🧺" style="width:40px" maxlength="4"><input id="cc" type="color" value="#7c3aed" style="width:38px;padding:1px"></div><div class="row"><label class="ctl">W <input id="cw" type="number" min="1" max="6" value="1"></label><label class="ctl">D <input id="ch" type="number" min="1" max="6" value="1"></label><label class="ctl">Height m <input id="cz" type="number" min="0" step=".1" value="1" style="width:50px"></label></div><label class="ctl"><input type="checkbox" id="cs_"> Needs sun</label><div class="row"><button data-x="addmod">Add to palette</button></div></div>`);
function drawShadow(){const g=$('#grid');let s=$('#shd');if(!s){g.insertAdjacentHTML('beforeend','<svg id="shd" class="ln" style="z-index:1;overflow:visible"></svg>');s=$('#shd')}const sp=sunPos(S.tm);s.setAttribute('width',gc()*cs);s.setAttribute('height',gr()*cs);
 s.innerHTML=sp.al>.02?casters().map(c=>`<polygon points="${hull(c,sp).map(q=>(q[0]*cs).toFixed(1)+','+(q[1]*cs).toFixed(1)).join(' ')}" fill="#000" fill-opacity=".22"/>`).join(''):'<rect width="100%" height="100%" fill="#0b1b3a" fill-opacity=".35"/>'}
function labels(){const d=dayInfo(),sp=sunPos(S.tm);$('#sdt').value=S.day;$('#stm').value=S.tm;$('#sau').checked=S.auto;$('#sdl').textContent=new Date(2026,0,S.day).toLocaleDateString(undefined,{month:'short',day:'numeric'});$('#stl').textContent=hm(S.tm);
 $('#sinf').textContent=(d.polar||'Sunrise '+hm(d.rise)+' · sunset '+hm(d.set)+' · '+d.len.toFixed(1)+' h of daylight')+' (solar time). Sun now: '+(sp.al>0?'bearing '+Math.round(sp.az)+'°, '+Math.round(sp.al/RAD)+'° high':'below the horizon')+'.'}
function post(){const sh=sunHours();drawShadow();labels();const g=$('#grid');
 S.obs.forEach(o=>g.insertAdjacentHTML('beforeend',`<div style="position:absolute;left:${o.x*cs}px;top:${o.y*cs}px;width:${cs}px;height:${cs}px;background:${OB[o.k].c};opacity:.85;display:flex;align-items:center;justify-content:center;font-size:${cs/2.5}px;pointer-events:none;z-index:1">${OB[o.k].i}</div>`));
 g.querySelectorAll('.it').forEach(e=>{const i=get(+e.dataset.id);if(i&&i.lk)e.insertAdjacentHTML('beforeend','<span style="position:absolute;top:1px;right:3px">🔒</span>')});
 $('#xt').innerHTML=S.items.length?'<table style="width:100%;font-size:12px;border-collapse:collapse"><tr class="mu"><td>Module</td><td>Sun h</td><td>Elev m</td></tr>'+S.items.map(i=>{const mn=C.sunMin[i.t]||0,h=sh[i.id],bad=mn&&h<mn;return`<tr class="${bad?'w':''}"><td>${nm(i)}</td><td>${h.toFixed(1)}${mn?' / '+mn:''}</td><td>${el(i).toFixed(2)}</td></tr>`}).join('')+'</table>':'<span class="mu">Place modules to see sun hours.</span>';
 const P=parts(),W=C.weights;$('#xo').innerHTML='<h2>Optimizer</h2>'+(P?`<p style="margin:0 0 4px"><b style="font-size:20px">${Math.round(P.total)}</b>/100</p>`+Object.keys(W).map(k=>`<div style="font-size:12px;display:flex;justify-content:space-between"><span>${{sun:'Sun',pipe:'Pipe length',gravity:'Gravity',waste:'Waste cluster',access:'Access'}[k]||k} <span class="mu">(w${W[k]})</span></span><span>${Math.round(P[k]*100)}%</span></div><div class="bar"><i style="width:${P[k]*100}%"></i></div>`).join(''):'<span class="mu">Place modules to score the layout.</span>')+'<div class="row"><button class="p" data-x="opt">Optimise</button><button data-x="lk">Lock / unlock selected</button><button data-x="lka">Lock all</button><button data-x="unl">Unlock all</button></div><p class="mu" style="font-size:11px;margin:0">Locked modules (🔒) stay put. Sun is scored at 9:00, 12:00 and 15:00 on the chosen date.</p>';
 $('#xp').innerHTML=`<h2>Plot</h2><div class="row"><label class="ctl">Slope <input id="slp" type="number" min="0" max="45" value="${S.slope.p}"> % falling toward <input id="slb" type="number" min="0" max="359" value="${S.slope.b}" style="width:56px">°</label></div><div class="row">${Object.keys(OB).map(k=>`<button data-x="ob" data-v="${k}" class="${OBT===k?'on':''}">${OB[k].i} ${OB[k].n}</button>`).join('')}${OBT?'<button data-x="ob" data-v="">Done</button>':''}</div><p class="mu" style="font-size:11px;margin:0">${OBT?'Click plan cells to add or remove. Obstacles block placement and cast shadows.':'Add existing trees, buildings and fences. The slope feeds the gravity check.'}</p>`;
 const b=LASTB=balance(sh);$('#xr').innerHTML='<h2>Resource balance (per day)</h2>'+RK.map(([r,ic,n,un])=>{const x=b[r],ok=x.s>=x.d,p=x.d?Math.min(100,x.s/x.d*100):100;return`<div style="font-size:12px" class="${ok?'ok':'w'}">${ic} ${n}: ${fmt(x.s)} in / ${fmt(x.d)} needed ${un} ${ok?'✓':'⚠'}</div><div class="bar"><i style="width:${p}%"></i></div>`}).join('')
 +`<div class="row" style="font-size:12px"><label class="ctl">Roof m² <input data-cl="roof" type="number" min="0" value="${S.clim.roof}"></label><label class="ctl">Rain mm/yr <input data-cl="rain" type="number" min="0" value="${S.clim.rain}" style="width:60px"></label><label class="ctl">Panel W <input data-cl="panel" type="number" min="0" value="${S.clim.panel}"></label></div>`
 +`<details ${openRv?'open':''} id="rvd"><summary>Edit numbers per module</summary><p class="mu" style="font-size:11px">Defaults are PLACEHOLDERS from content.js. Positive supplies, negative needs.</p><table style="font-size:11px;border-collapse:collapse"><tr class="mu"><td></td>${RK.map(r=>`<td>${r[1]}</td>`).join('')}</tr>${[...new Set(S.items.map(i=>i.t))].map(k=>`<tr><td>${T[k].i}</td>${RK.map(([r])=>`<td><input data-rv="${k}.${r}" type="number" value="${rv(k,r)}" style="width:46px;padding:2px"></td>`).join('')}</tr>`).join('')}</table></details>`;
 const x=gravChecks().filter(c=>!c[0]).map(c=>c[1]);S.items.forEach(i=>{const mn=C.sunMin[i.t];if(mn&&sh[i.id]<mn)x.push(nm(i)+' gets '+sh[i.id].toFixed(1)+' h of sun on this date, it wants '+mn)});
 if(x.length)$('#ck').innerHTML=$('#ck').innerHTML.replace(/<span class="ok">.*?<\/span>/,'').replace('</ul>','')+(/<ul>/.test($('#ck').innerHTML)?'':'<ul>')+x.map(t=>'<li class="w">⚠ '+t+'</li>').join('')+'</ul>'}
function pre(){regCustom();S.day=S.day??doy();S.tm=S.tm??12;S.auto=S.auto??true;S.obs=S.obs||[];S.slope=S.slope||{p:0,b:180};S.clim=S.clim||{roof:30,rain:1200,panel:200};S.rv=S.rv||{};S.ht=S.ht||{};S.custom=S.custom||[];if(S.auto){const d=dayInfo();if(!d.polar){S.ra=Math.round(d.az);S.sa=Math.round(360-d.az)}}}
const _r=render;render=function(){pre();_r();post()};

/* ---------- events ---------- */
document.querySelector('header').addEventListener('change',e=>{if(e.target.id==='ra'||e.target.id==='sa')S.auto=false},true);
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
 if(t.dataset.a==='arr'){e.stopPropagation();optimize();return}
 if(t.dataset.a==='load'){try{regCustom(JSON.parse($('#dx').value).custom)}catch(_){}return}
 if(t.id==='play'){if(playT){clearInterval(playT);playT=null;t.textContent='▶ Play day'}else{t.textContent='⏸ Pause';playT=setInterval(()=>{S.tm=(S.tm+.25)%24;$('#stm').value=S.tm;labels();drawShadow()},120)}return}
 const x=t.dataset.x;if(!x)return;
 if(x==='opt')optimize();else if(x==='ob'){OBT=t.dataset.v||null;pal=null;tool='sel';render()}
 else if(x==='lk'){const i=get(sel);if(i){i.lk=!i.lk;render()}else say('Select a module first.')}
 else if(x==='lka'){S.items.forEach(i=>i.lk=true);render()}else if(x==='unl'){S.items.forEach(i=>i.lk=false);render()}
 else if(x==='addmod'){const n=$('#cn').value.trim();if(!n){say('Give the module a name.');return}const k='c'+Date.now().toString(36),d={k,n,i:$('#ci').value||'📦',c:$('#cc').value,w:Math.max(1,Math.min(6,+$('#cw').value||1)),h:Math.max(1,Math.min(6,+$('#ch').value||1)),s:$('#cs_').checked?1:0};S.custom.push(d);S.ht[k]=+$('#cz').value||1;if(d.s)S.ht[k]=S.ht[k];regCustom();pal=k;$('#cn').value='';render()}},true);
document.addEventListener('input',e=>{if(e.target.id==='sdt'){S.day=+e.target.value;render()}else if(e.target.id==='stm'){S.tm=+e.target.value;labels();drawShadow();try{sessionStorage.setItem(KEY,JSON.stringify(S))}catch(_){}}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id==='sau'){S.auto=t.checked;render()}else if(t.id==='slp'||t.id==='slb'){S.slope[t.id==='slp'?'p':'b']=Math.max(0,+t.value||0);render()}
 else if(t.dataset.cl){S.clim[t.dataset.cl]=Math.max(0,+t.value||0);render()}else if(t.dataset.rv){S.rv[t.dataset.rv]=+t.value||0;openRv=true;render()}});
document.addEventListener('toggle',e=>{if(e.target.id==='rvd')openRv=e.target.open},true);
document.querySelector('.stage').addEventListener('pointerdown',e=>{
 if(OBT&&e.target.closest('#grid')){const[x,y]=cell(e);if(x<0||y<0||x>=gc()||y>=gr())return;const k=S.obs.findIndex(o=>o.x===x&&o.y===y);if(k>=0)S.obs.splice(k,1);else if(!S.items.some(i=>{const[w,h]=dim(i);return x>=i.x&&x<i.x+w&&y>=i.y&&y<i.y+h}))S.obs.push({x,y,k:OBT});e.stopPropagation();e.preventDefault();render();return}
 const el_=e.target.closest('.it'),i=el_&&get(+el_.dataset.id);if(i&&i.lk&&tool==='sel'){sel=i.id;pal=null;e.stopPropagation();render()}},true);
fits=(t,x,y,r,ig)=>{const it=ig?get(ig):null,m=vd(t,it&&it.v),w=r?m.h:m.w,h=r?m.w:m.h;if(x<0||y<0||x+w>gc()||y+h>gr())return false;if((S.obs||[]).some(o=>o.x>=x&&o.x<x+w&&o.y>=y&&o.y<y+h))return false;return!S.items.some(o=>{if(o.id===ig)return false;const[ow,oh]=dim(o);return x<o.x+ow&&o.x<x+w&&y<o.y+oh&&o.y<y+h})};
/* ===== batch 2: new modules, variants UI, routed lines, nutrient loop ===== */
KC.n='#16a34a';R.push(...(C.rules||[]));Object.assign(C.heights,C.heights2||{});Object.assign(C.sunMin,{});
(C.modules||[]).forEach(d=>{if(!T[d.k]){d.spec=(C.spec||{})[d.k]||'';M.push(d);T[d.k]=d}});
RK.push(['n','🧪','Nitrogen','g/d'],['p','🧪','Phosphorus','g/d'],['k','🧪','Potassium','g/d']);
const SZ=['1/4 in','1/2 in','3/4 in','1 in'];let ROUTE=null;
const polyOf=l=>{const a=get(l.a),b=get(l.b);return a&&b?[ctr(a),...(l.pts||[]),ctr(b)]:[]};
const lineLen=l=>{const P=polyOf(l);let d=0;for(let k=1;k<P.length;k++)d+=Math.abs(P[k][0]-P[k-1][0])+Math.abs(P[k][1]-P[k-1][1]);return d*4};
const hubRaise=i=>0.5;
const headOf=l=>{const a=get(l.a),b=get(l.b);return a&&b?el(a)+(a.t==='hub'?hubRaise(a):0)-el(b):0};
const lineChecks=()=>S.links.filter(l=>(l.k==='w'||l.k==='n')&&get(l.a)&&get(l.a).t==='hub'&&get(l.b)).map(l=>[headOf(l)>=C.minHead,nm(get(l.a))+' to '+nm(get(l.b))+' has only '+headOf(l).toFixed(2)+' m of head (needs '+C.minHead+' m), so gravity flow may fail']);
const _g=gravChecks;gravChecks=()=>[..._g(),...lineChecks()];
function autoRoute(l){const a=get(l.a),b=get(l.b),occ=new Set(),ring=i=>{const[w,h]=dim(i),o=[];for(let x=i.x-1;x<=i.x+w;x++)for(let y=i.y-1;y<=i.y+h;y++){const ix=x>=i.x&&x<i.x+w,iy=y>=i.y&&y<i.y+h;if(ix!==iy||(!ix&&!iy&&false))if(!(ix&&iy)&&(ix||iy))o.push([x,y])}return o};
 S.items.forEach(i=>{const[w,h]=dim(i);for(let x=i.x;x<i.x+w;x++)for(let y=i.y;y<i.y+h;y++)occ.add(x+','+y)});S.obs.forEach(o=>occ.add(o.x+','+o.y));
 const ok=([x,y])=>x>=0&&y>=0&&x<gc()&&y<gr()&&!occ.has(x+','+y),goal=new Set(ring(b).filter(ok).map(c=>c+'')),par={},q=ring(a).filter(ok);
 if(gap(a,b).every(g=>g===0)){l.pts=[];return true}
 q.forEach(c=>par[c]=null);let end=null;for(let n=0;n<q.length&&!end;n++){const c=q[n];if(goal.has(c+'')){end=c;break}[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const d=[c[0]+dx,c[1]+dy];if(ok(d)&&!(d+'' in par)){par[d]=c;q.push(d)}})}
 if(!end)return false;const path=[];for(let c=end;c;c=par[c])path.unshift(c);l.pts=path.filter((c,k)=>k===0||k===path.length-1||(c[0]-path[k-1][0])!==(path[k+1][0]-c[0])||(c[1]-path[k-1][1])!==(path[k+1][1]-c[1])).map(c=>[c[0]+.5,c[1]+.5]);return true}
function linkSvg(){const s=[...$('#grid').querySelectorAll('svg.ln')].find(x=>!x.id);if(!s)return;
 s.innerHTML=S.links.map((l,ix)=>{const P=polyOf(l);if(!P.length)return'';const c=KC[l.k]||'#38bdf8',q=P[P.length-1];return`<polyline points="${P.map(p=>(p[0]*cs).toFixed(1)+','+(p[1]*cs).toFixed(1)).join(' ')}" fill="none" stroke="${c}" stroke-width="${ix===ROUTE?5:3}" stroke-linecap="round" stroke-linejoin="round"${l.k==='n'?' stroke-dasharray="9 4"':l.k==='p'?' stroke-dasharray="2 6"':''}/><circle cx="${q[0]*cs}" cy="${q[1]*cs}" r="5" fill="${c}"/>`+(ix===ROUTE?(l.pts||[]).map(p=>`<circle cx="${p[0]*cs}" cy="${p[1]*cs}" r="6" fill="#fff" stroke="${c}" stroke-width="3"/>`).join(''):'')}).join('')}
$('#xr').insertAdjacentHTML('afterend','<div class="card" id="xl"></div><div class="card" id="xn"></div>');
function post2(){linkSvg();const it=get(sel),vs=it&&C.variants[it.t];
 if(vs){const v=vs.find(x=>x.k===it.v)||vs[0];$('#sp').insertAdjacentHTML('afterbegin',`<div class="row" style="align-items:center"><b>Variant</b><select data-vr>${vs.map(x=>`<option value="${x.k}" ${x.k===v.k?'selected':''}>${x.n}</option>`).join('')}</select></div>`+(v.note?`<p class="mu" style="margin:0 0 6px;font-size:12px">${v.note}</p>`:'')+((v.bom||[]).length?`<p style="margin:0 0 6px;font-size:12px"><b>Extra parts:</b> ${v.bom.join(', ')}</p>`:''))}
 const ls=S.links;$('#xl').innerHTML='<h2>Water and nutrient lines</h2>'+(ls.length?'<ul>'+ls.map((l,ix)=>{const a=get(l.a),b=get(l.b);if(!a||!b)return'';const hd=headOf(l),fl=(l.k==='w'||l.k==='n')&&a.t==='hub'?(hd>=C.minHead?`<span class="ok">head ${hd.toFixed(2)} m ✓</span>`:`<span class="w">head ${hd.toFixed(2)} m ⚠</span>`):'';
  return`<li style="font-size:12px">${nm(a)} → ${nm(b)}<br><span class="mu">${l.l}</span> · ${u(Math.round(lineLen(l)))} ${fl}<br>${l.k==='w'||l.k==='n'?`<select data-sz="${ix}">${SZ.map(z=>`<option ${(l.sz||'1/2 in')===z?'selected':''}>${z}</option>`).join('')}</select> `:''}<button data-x="rt" data-v="${ix}" class="${ROUTE===ix?'on':''}">${ROUTE===ix?'Done':'Route'}</button><button data-x="ar" data-v="${ix}">Auto-route</button><button data-x="rr" data-v="${ix}">Straight</button></li>`}).join('')+'</ul><p class="mu" style="font-size:11px;margin:4px 0 0">Route: click plan cells to add bends. Auto-route finds a path around modules.</p>':'<span class="mu">Connect modules (Auto-connect) to see lines here.</span>');
 const has_=t=>S.items.some(i=>i.t===t),show=has_('ntank')||has_('biogas');$('#xn').style.display=show?'':'none';
 if(show&&LASTB){const nl=S.links.filter(l=>get(l.a)&&get(l.a).t==='ntank'&&get(l.b)),vol=nl.length?nl.reduce((s,l)=>s-rvi(get(l.b),'water'),0):LASTB.water.d,N=LASTB.n.s,conc=vol?N/vol*1000:0,[lo,hi]=(S.nt&&S.nt.n)||C.nutrientTarget.n,st=!vol?'':conc>hi?`<span class="w">⚠ Too strong: add about ${Math.round(N/(hi/1000)-vol)} L/day of rain or pond water.</span>`:conc<lo?'<span class="w">⚠ Too weak for the target: less dilution or more digestate.</span>':'<span class="ok">✓ Within target</span>';
  const raw=S.links.some(l=>get(l.a)&&get(l.b)&&get(l.a).t==='biogas'&&get(l.b).t==='bio');
  $('#xn').innerHTML=`<h2>🧪 Nutrient loop</h2><p style="margin:0;font-size:12px">${has_('ntank')?'Digestate + pond overflow + rain mix':'No Nutrient Tank yet'}: about <b>${Math.round(conc)} mg/L</b> nitrogen across ${Math.round(vol)} L/day. ${st}</p><div class="row" style="font-size:12px"><label class="ctl">Target N mg/L <input data-nt="0" type="number" value="${lo}"> to <input data-nt="1" type="number" value="${hi}"></label></div>`+(raw?'<p class="w" style="font-size:12px;margin:0">⚠ Raw digestate goes straight into the pond. Route it through a Nutrient Tank first.</p>':'')+(!has_('ntank')&&has_('biogas')?'<p class="w" style="font-size:12px;margin:0">⚠ Digestate has no Nutrient Tank to settle and dilute it.</p>':'')+'<p class="mu" style="font-size:11px;margin:4px 0 0">Targets and nutrient numbers are placeholders in content.js. Fill them from your research.</p>'}}
const _p=post;post=()=>{_p();post2()};
document.addEventListener('click',e=>{const t=e.target.closest('button[data-x]');if(!t)return;const x=t.dataset.x,l=S.links[+t.dataset.v];
 if(x==='rt'){ROUTE=ROUTE===+t.dataset.v?null:+t.dataset.v;render()}else if(x==='ar'&&l){if(!autoRoute(l))say('No free path found between those modules.');ROUTE=null;render()}else if(x==='rr'&&l){l.pts=[];ROUTE=null;render()}},true);
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.sz!==undefined){S.links[+t.dataset.sz].sz=t.value;render()}
 else if(t.dataset.nt!==undefined){S.nt=S.nt||{n:[...C.nutrientTarget.n]};S.nt.n[+t.dataset.nt]=+t.value||0;render()}
 else if(t.dataset.vr!==undefined){const i=get(sel);if(!i)return;const o=i.v;i.v=t.value;if(!fits(i.t,i.x,i.y,i.r,i.id)){i.v=o;say('That variant does not fit here. Move the module or free some space.')}render()}});
document.querySelector('.stage').addEventListener('pointerdown',e=>{if(ROUTE===null||!e.target.closest('#grid'))return;const[x,y]=cell(e),l=S.links[ROUTE];if(!l||x<0||y<0||x>=gc()||y>=gr())return;(l.pts=l.pts||[]).push([x+.5,y+.5]);e.stopPropagation();e.preventDefault();render()},true);
const _bp=bp;bp=()=>{let s=_bp();const vi=S.items.filter(i=>i.v&&i.v!=='std').map(i=>{const v=(C.variants[i.t]||[]).find(x=>x.k===i.v);return v?`- ${nm(i)}: ${v.n}${v.bom?'. Extra parts: '+v.bom.join(', '):''}${v.note?'. '+v.note:''}`:''}).filter(Boolean),sz={};
 S.links.forEach(l=>{if(l.k==='w'||l.k==='n'){const z=l.sz||'1/2 in';sz[z]=(sz[z]||0)+lineLen(l)+2}});const tees=Object.values(S.links.reduce((o,l)=>(o[l.a]=(o[l.a]||0)+1,o),{})).reduce((n,c)=>n+Math.max(0,c-1),0),fv=S.links.filter(l=>(l.k==='w'||l.k==='n')&&get(l.b)&&['bio','wick','ntank'].includes(get(l.b).t)).length;
 return s+'\n\n## Variants\n\n'+(vi.length?vi.join('\n'):'- All standard')+'\n\n## Water and nutrient line parts\n\n'+(Object.keys(sz).length?Object.entries(sz).map(([z,f])=>`- ${z} tube: about ${u(Math.round(f))} (includes 2 ft slack per line)`).join('\n')+`\n- T-junctions: about ${tees}\n- Shut-off valves: ${S.links.filter(l=>l.k==='w'||l.k==='n').length}\n- Float valves: ${fv}`:'- No water lines')+'\n\nTreat the numbers as a starting point: check head, pipe size and digestate handling against your own research.'};

RK.push(['prot','🥩','Protein','g/d'],['gas','🔥','Biogas','m³/d']);C.person=C.person||{kcal:2200,prot:55,gasCook:.45};
$('#xn').insertAdjacentHTML('afterend','<div class="card" id="xy"></div>');
function post3(){const b=LASTB;if(!b||!S.items.length){$('#xy').innerHTML='<h2>👥 People fed</h2><span class="mu">Place modules to estimate.</span>';return}
 const P=C.person,kc=b.kcal.s/P.kcal,pr=b.prot.s/P.prot,gl=Math.max(0,b.gas.s-b.gas.d)/P.gasCook,f=x=>x<10?x.toFixed(2):Math.round(x),lim=Math.min(kc,pr),by={};
 S.items.forEach(i=>by[i.t]=(by[i.t]||0)+rvi(i,'kcal'));const top=Object.entries(by).filter(e=>e[1]>0).sort((x,y)=>y[1]-x[1]).slice(0,4).map(e=>T[e[0]].i+' '+Math.round(e[1])).join(' · ');
 $('#xy').innerHTML=`<h2>👥 People fed</h2><p style="margin:0;font-size:13px"><b>About ${f(lim)} ${lim===1?'person':'people'}</b> (limit: ${kc<=pr?'calories':'protein'}).</p><p class="mu" style="font-size:12px;margin:2px 0">Calories ${f(kc)} · protein ${f(pr)} · cooking gas ${f(gl)} (after the generator). Per person: ${P.kcal} kcal, ${P.prot} g protein, ${P.gasCook} m³ gas a day.</p>`+(lim>0?`<p style="font-size:12px;margin:2px 0">To feed 1 person you would need about <b>${f(1/lim)}×</b> this layout.</p>`:'')+`<p class="mu" style="font-size:11px;margin:2px 0">kcal/day by module: ${top||'none'}</p><details><summary>Sources and confidence</summary><ul style="font-size:11px">${(C.facts||[]).map(x=>`<li><b>${x.k}</b> ${x.ok?'✓':'?'}: ${x.v}<br><span class="mu">${x.s}</span></li>`).join('')}</ul><p class="mu" style="font-size:11px">✓ checked against a source, ? general or assumed. Edit numbers in the resource table or content.js.</p></details>`}
const _p3=post;post=()=>{_p3();post3()};window.PARTS=parts;window.BAL=()=>LASTB;
render();
})();
