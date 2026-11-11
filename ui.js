/* Garden Architect UI layer. Loads LAST: wraps render() and say() so the logic files stay untouched. */
(()=>{
const MK=window.ModelKit,$$=s=>[...document.querySelectorAll(s)],seen=new Set(),root=document.documentElement;
/* toasts */
const tw=document.body.appendChild(Object.assign(document.createElement('div'),{id:'toasts'}));
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;tw.append(e);setTimeout(()=>e.classList.add('out'),3200);setTimeout(()=>e.remove(),3700)}
const say0=say;say=function(t){say0(t);if(t)toast(t)};
/* header: logo, 3D button, theme toggle */
const h=document.querySelector('header'),h1=h.querySelector('h1');h1.innerHTML='<span class="logo">🌱</span>Garden Architect';
const b3=Object.assign(document.createElement('button'),{className:'p',textContent:'🧊 3D view',title:'Walk around your garden in 3D'}),th=Object.assign(document.createElement('button'),{title:'Light or dark'});
const dark=()=>root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches,ic=()=>th.textContent=dark()?'☀️':'🌙';
/* group the site and sun controls into one tidy popover, add docs link */
const lo=h.querySelector('[data-a=loc]'),grp=document.createElement('details');grp.className='site';grp.innerHTML='<summary>📐 Site and sun</summary><div></div>';const box=grp.lastChild;let nx=h1.nextElementSibling;while(nx){const n2=nx.nextElementSibling;box.append(nx);if(nx===lo)break;nx=n2}h1.after(grp);
const dc=Object.assign(document.createElement('a'),{href:'docs.html',target:'_blank',textContent:'📖 Docs',className:'docl'});h.append(dc);
th.onclick=()=>{root.dataset.theme=dark()?'light':'dark';ic()};ic();h.append(b3,th);
/* enhance after every render */
function enhance(){let n=0;
 $$('#grid .it').forEach(e=>{const i=get(+e.dataset.id);if(!i)return;const m=T[i.t];e.style.setProperty('--c',m.c);e.style.background=`color-mix(in srgb,${m.c} 26%,var(--tile))`;
  e.insertAdjacentHTML('afterbegin',`<div class="mdl">${MK.svg(i.t,{plan:1,pitch:58,yaw:0,rot:!!i.r})}</div>`);
  if(!seen.has(i.id)){seen.add(i.id);e.classList.add('pop');e.style.animationDelay=(n++*45)+'ms'}});
 $$('.pb[data-k]').forEach(b=>{const s=b.firstElementChild;s.className='thumb';s.removeAttribute('style');s.innerHTML=MK.svg(b.dataset.k,{yaw:35,pitch:30})});
 const lt=document.getElementById('lt');if(lt)lt.insertAdjacentHTML('beforeend','<div class="legend"><span><i style="background:#38bdf8"></i>💧 Water</span><span><i style="background:#d97706"></i>🌾 Feed</span><span><i style="background:#f97316"></i>🔥 Gas</span><span><i style="background:#a855f7"></i>⚡ Power</span></div>');
 const k=(get(sel)||{}).t||pal,sp=document.getElementById('sp');if(k&&T[k]&&sp)sp.insertAdjacentHTML('afterbegin',`<div class="hero" style="--c:${T[k].c}">${MK.svg(k,{yaw:35,pitch:30})}</div>`)}
const r0=render;render=function(){r0.apply(this,arguments);enhance()};render();
/* 3D garden view: orbit or walk, live sun and shadows, add-ons and rooftop topiary */
const v3=document.body.appendChild(Object.assign(document.createElement('div'),{id:'v3',innerHTML:'<canvas></canvas><div class="bar3"><b>🧊 Your garden in 3D</b><label class="sunl">🕒 <input type="range" data-s min="0" max="24" step=".25"> <span data-sv></span></label><button data-p>▶ Day</button><button data-o>⏸ Orbit</button><button data-t>⬇ Top</button><button data-w>🚶 Walk</button><button data-x class="p">Close</button></div><div class="hint"></div>'})),cv=v3.querySelector('canvas'),cx=cv.getContext('2d'),hint=v3.querySelector('.hint'),sl=v3.querySelector('[data-s]'),sv=v3.querySelector('[data-sv]');
const RAD=Math.PI/180,KEYS={},ORB='Drag to orbit · scroll to zoom · Esc to close',WLK='W A S D or arrows to move (Shift runs) · drag to look · Esc to close';
let yaw=.55,pitch=.62,zoom=1,orbit=true,run=false,drag=null,walk=false,play=false,eye={x:0,z:0},wy=Math.PI,wp=.05;hint.textContent=ORB;
const KCOL={w:'#38bdf8',f:'#d97706',g:'#f97316',p:'#a855f7'},tfi=i=>{const m=T[i.t];return i.r?p=>[i.x+m.h-p[2],p[1],i.y+p[0]]:p=>[i.x+p[0],p[1],i.y+p[2]]};
const hl=P=>{P=[...P].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];for(const p of P){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(const p of[...P].reverse()){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}return lo.slice(0,-1).concat(up.slice(0,-1))};
function sunV(){const day=S.day??1,t=S.tm??12,dc=23.44*Math.sin(2*Math.PI*(284+day)/365)*RAD,p=S.lat*RAD,h=(t-12)*15*RAD,al=Math.asin(Math.sin(p)*Math.sin(dc)+Math.cos(p)*Math.cos(dc)*Math.cos(h)),az=((Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(p)-Math.tan(dc)*Math.cos(p))+Math.PI)/RAD+360)%360;return{al,v:vecA(az)}}
const gz=(x,z)=>{const s=S.slope;if(!s||!s.p)return 0;const v=vecA(s.b);return-(s.p/100)*((x-gc()/2)*v[0]+(z-gr()/2)*v[1])};
function scene(su){const C=gc(),Rw=gr(),ground=[],objs=[],day=su.al>.03,sp=S.slope&&S.slope.p?S.slope.p/100:0,sv0=sp?vecA(S.slope.b):[0,0],gn=(()=>{const n=[sp*sv0[0],1,sp*sv0[1]],l=Math.hypot(...n);return n.map(x=>x/l)})(),lift=(tf,g)=>p=>{const q=tf(p);return[q[0],q[1]+g,q[2]]};
 for(let x=0;x<C;x++)for(let z=0;z<Rw;z++)ground.push({v:[[x,gz(x,z),z],[x+1,gz(x+1,z),z],[x+1,gz(x+1,z+1),z+1],[x,gz(x,z+1),z+1]],n:gn,c:(x+z)%2?'#b9dc98':'#c4e4a6',a:1});
 const sk=(a,b,n)=>ground.push({v:[[a[0],gz(...a),a[1]],[b[0],gz(...b),b[1]],[b[0],-4,b[1]],[a[0],-4,a[1]]],n,c:'#8a6a45',a:1});
 for(let x=0;x<C;x++){sk([x,0],[x+1,0],[0,0,-1]);sk([x,Rw],[x+1,Rw],[0,0,1])}for(let z=0;z<Rw;z++){sk([0,z],[0,z+1],[-1,0,0]);sk([C,z],[C,z+1],[1,0,0])}
 S.items.forEach(i=>{const m=T[i.t],host=i.on&&get(i.on),dy=host?MK.height(host.t,T[host.t]):0,h0=host||i,[hw,hd]=dim(h0),g=gz(h0.x+hw/2,h0.y+hd/2),tf=lift(tfi(h0),g+dy);
  objs.push(...MK.faces(MK.part(i.t,m),tf));(i.ad||[]).forEach(a=>objs.push(...MK.faces(MK.addon(a,m.w,m.h),tf)));
  if(host)return;const[w,d]=dim(i);ground.push(...MK.faces([['b',i.x-.04,0,i.y-.04,w+.12,.01,d+.12,'#000',.12]],lift(p=>p,g)));
  if(day){const ht=MK.height(i.t,m)+(S.items.some(z=>z.on===i.id)?.9:0),L=Math.min(8,ht/Math.tan(su.al)),o=[-su.v[0]*L,-su.v[1]*L],c=[[i.x,i.y],[i.x+w,i.y],[i.x+w,i.y+d],[i.x,i.y+d]];
   ground.push({v:hl([...c,...c.map(q=>[q[0]+o[0],q[1]+o[1]])]).map(q=>[q[0],gz(q[0],q[1])+.03,q[1]]),n:gn,c:'#000',a:.26})}});
 (S.obs||[]).forEach(o=>objs.push(...MK.faces(o.k==='tree'?[['c',o.x+.4,0,o.y+.4,.2,.8,.2,'#7b5230'],['k',o.x,.6,o.y,1,1.4,1,'#2f8f5b']]:o.k==='bld'?[['b',o.x,0,o.y,1,.9,1,'#a8a29e'],['p',o.x,.9,o.y,1,.5,1,'#c9553d']]:[['b',o.x,0,o.y+.45,1,.6,.1,'#b98a56']],lift(p=>p,gz(o.x+.5,o.y+.5)))));
 if(!sp)objs.push(...MK.faces([['b',-.12,0,-.12,C+.24,.14,.12,'#b98a56'],['b',-.12,0,Rw,C+.24,.14,.12,'#b98a56'],['b',-.12,0,0,.12,.14,Rw,'#b98a56'],['b',C,0,0,.12,.14,Rw,'#b98a56']],p=>p));return{ground,objs,C,Rw}}
const blocked=(x,z)=>S.items.some(i=>{if(i.on)return false;const[w,d]=dim(i);return x>i.x-.2&&x<i.x+w+.2&&z>i.y-.2&&z<i.y+d+.2});
function step(){const sp=KEYS.shift?.07:.03,f=(KEYS.w||KEYS.arrowup?1:0)-(KEYS.s||KEYS.arrowdown?1:0),r=(KEYS.d||KEYS.arrowright?1:0)-(KEYS.a||KEYS.arrowleft?1:0),sy=Math.sin(wy),cy=Math.cos(wy),dx=(sy*f+cy*r)*sp,dz=(cy*f-sy*r)*sp,C=gc(),Rw=gr();
 let nx=eye.x+dx,nz=eye.z+dz;if(!blocked(nx,eye.z)&&nx>-2&&nx<C+2)eye.x=nx;if(!blocked(eye.x,nz)&&nz>-2&&nz<Rw+3)eye.z=nz}
function frame(t){if(!run)return;requestAnimationFrame(frame);if(play)S.tm=(S.tm+.04)%24;if(walk)step();else if(orbit&&!drag)yaw+=.004;
 const d=devicePixelRatio||1,w=cv.clientWidth,hh=cv.clientHeight;if(cv.width!==w*d){cv.width=w*d;cv.height=hh*d}cx.setTransform(d,0,0,d,0,0);cx.clearRect(0,0,w,hh);
 const su=sunV(),dayT=su.al>.02,lt=dayT?[su.v[0]*Math.cos(su.al),Math.sin(su.al),su.v[1]*Math.cos(su.al)]:[0,.25,0];sl.value=S.tm;sv.textContent=hm(S.tm);
 const sc=scene(su),cam={yaw,pitch,cx:sc.C/2,cz:sc.Rw/2,s:zoom*Math.min(w,hh*1.4)/(sc.C+sc.Rw)*1.15,ox:w/2,oy:hh/2+20,light:lt},pc={x:eye.x,y:1.45+gz(eye.x,eye.z),z:eye.z,yaw:wy,pitch:wp,f:hh*.9,ox:w/2,oy:hh/2,light:lt},VW=fs=>walk?MK.viewP(fs,pc):MK.view(fs,cam);
 if(walk){const yh=Math.max(0,Math.min(hh,hh/2-Math.tan(wp)*pc.f));cx.fillStyle='#a9d18a';cx.fillRect(0,yh,w,hh-yh)}
 const poly=(f,fill,stroke)=>{cx.beginPath();f.p.forEach((q,k)=>k?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));cx.closePath();cx.globalAlpha=f.a;cx.fillStyle=fill;cx.fill();if(stroke){cx.strokeStyle='rgba(0,0,0,.18)';cx.lineWidth=1;cx.lineJoin='round';cx.stroke()}cx.globalAlpha=1};
 if(!walk&&dayT){const L=lt,xr=L[0]*Math.cos(yaw)+L[2]*Math.sin(yaw),X=w/2+xr*w*.38,Y=hh*.14+(1-Math.sin(su.al))*hh*.12,g=cx.createRadialGradient(X,Y,2,X,Y,46);g.addColorStop(0,'#fff7c2');g.addColorStop(.35,'rgba(255,214,90,.8)');g.addColorStop(1,'rgba(255,214,90,0)');cx.fillStyle=g;cx.fillRect(X-50,Y-50,100,100)}
 VW(sc.ground).forEach(f=>poly(f,f.c==='#000'?'#000':MK.col(f.c,f.s)));
 const P=(a,y)=>{const c=ctr(a),v=VW([{v:[[c[0],y+gz(c[0],c[1]),c[1]],[c[0],y+gz(c[0],c[1]),c[1]],[c[0],y+gz(c[0],c[1]),c[1]]],n:[0,1,0],c:'#000',a:1}]);return v[0]&&v[0].p[0]};
 cx.lineWidth=3;cx.lineCap='round';cx.setLineDash([9,7]);cx.lineDashOffset=-(t/60)%16;S.links.forEach(l=>{const a=get(l.a),b=get(l.b);if(!a||!b)return;const p=P(a,.06),q=P(b,.06);if(!p||!q)return;cx.strokeStyle=KCOL[l.k]||'#38bdf8';cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(q[0],q[1]);cx.stroke()});cx.setLineDash([]);
 VW(sc.objs).forEach(f=>poly(f,MK.col(f.c,f.s),true));
 const nt=Math.max(0,Math.min(.5,.5-su.al*8));if(nt>0){cx.fillStyle=`rgba(8,14,40,${nt})`;cx.fillRect(0,0,w,hh)}}
function open3(){v3.classList.add('open');run=true;if(!eye.x){eye={x:gc()/2,z:gr()+1.4}}requestAnimationFrame(frame)}function close3(){v3.classList.remove('open');run=false}
const B=s=>v3.querySelector(s);
b3.onclick=open3;B('[data-x]').onclick=close3;B('[data-o]').onclick=e=>{orbit=!orbit;e.target.textContent=orbit?'⏸ Orbit':'▶ Orbit'};B('[data-t]').onclick=()=>{walk=false;B('[data-w]').classList.remove('on');hint.textContent=ORB;pitch=1.5;orbit=false};
B('[data-w]').onclick=e=>{walk=!walk;e.target.classList.toggle('on',walk);hint.textContent=walk?WLK:ORB;if(walk){eye={x:gc()/2,z:gr()+1.4};wy=Math.PI;wp=.05}};
B('[data-p]').onclick=e=>{play=!play;e.target.textContent=play?'⏸ Day':'▶ Day'};sl.oninput=()=>{S.tm=+sl.value;play=false;B('[data-p]').textContent='▶ Day'};
cv.onpointerdown=e=>{drag=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId)};cv.onpointerup=()=>drag=null;
cv.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];if(walk){wy+=dx*.005;wp=Math.max(-.8,Math.min(.8,wp+dy*.004))}else{yaw+=dx*.008;pitch=Math.max(.2,Math.min(1.5,pitch+dy*.006))}drag=[e.clientX,e.clientY]};
cv.onwheel=e=>{e.preventDefault();if(!walk)zoom=Math.max(.5,Math.min(3,zoom*(e.deltaY<0?1.1:.91)))};
addEventListener('keydown',e=>{if(!run)return;if(e.key==='Escape')close3();const k=e.key.toLowerCase();if(/^(w|a|s|d|arrowup|arrowdown|arrowleft|arrowright)$/.test(k)&&walk){KEYS[k]=1;e.preventDefault();e.stopPropagation()}KEYS.shift=e.shiftKey},true);
addEventListener('keyup',e=>{delete KEYS[e.key.toLowerCase()];KEYS.shift=e.shiftKey});
})();
