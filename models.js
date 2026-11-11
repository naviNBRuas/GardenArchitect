/* Garden Architect model kit. ONE definition per module, used by the palette thumbnails, the plan tiles,
   the 3D garden view and (later) Three.js through ModelKit.toThree().
   Part = [type, x, y, z, w, h, d, color, alpha?]   type: b box, c cylinder, k cone, p pyramid (4 sides)
   Units: 1 = one block (1.2 m), y is up, x/z run inside the module footprint. Edit a model here and every view updates. */
(()=>{
const RAD=Math.PI/180,W='#b98a56',D='#7b5230',G='#58b368',L='#2f8f5b',S='#6a4a2e',B='#4ba3d8',M='#c3ccd4',K='#2f3540',Y='#f2c14e',R='#c9553d',F='#f4f1e8';
const row=(n,f)=>Array.from({length:n},(_,i)=>f(i));
const MODELS={
bio:[['b',0,0,0,2,.22,2,D],['b',.1,.22,.1,1.8,.04,1.8,B],...row(4,i=>['b',.25+(i%2)*1.35,.26,.25+(i>>1)*1.35,.12,.66,.12,W]),['b',.2,.92,.2,1.6,.1,1.6,W],['b',.2,1.02,.2,1.6,.6,1.6,'#e7d3a8'],['b',.8,1.02,1.79,.4,.4,.02,D],['p',.1,1.62,.1,1.8,.5,1.8,R]],
hub:[['b',.1,0,.1,.8,.35,.8,'#9aa3ab'],['b',.12,.35,.12,.76,.75,.76,'#cfe8f3',.9],['b',.12,.35,.12,.76,.04,.76,M],['b',.3,1.1,.3,.4,.05,.4,K],['c',.8,.4,.45,.12,.3,.12,K]],
biogas:[['c',.1,0,.1,.8,.55,.8,'#7b8f6a'],['k',.1,.55,.1,.8,.28,.8,'#9fb48c'],['c',.45,.83,.45,.1,.2,.1,K],['b',.1,0,1.1,.8,.45,.8,Y],['k',.1,.45,1.1,.8,.2,.8,'#f6d98a']],
wick:[['b',.05,0,.05,.9,.42,.9,W],['b',.12,.42,.12,.76,.05,.76,S],...row(6,i=>['k',.17+(i%3)*.26,.47,.22+(i/3|0)*.4,.2,.3,.2,i%2?G:L])],
salad:[['b',0,0,0,1,.08,1,M],...row(4,i=>['c',.14+(i%2)*.5,.08,.14+(i>>1)*.5,.24,1.4,.24,F]),...row(4,i=>['k',.08+(i%2)*.5,1.2,.08+(i>>1)*.5,.36,.4,.36,i%3?G:L])],
vine:[['b',0,0,0,1,.08,1,D],['b',.02,.08,0,.96,1.4,.05,W],...row(3,i=>['c',.07+i*.3,.08,.3,.26,.32,.26,B]),...row(3,i=>['k',.05+i*.3,.4,.28,.3,.95,.3,L]),...row(3,i=>['b',.12+i*.3,.5+(i%2)*.3,.55,.1,.1,.1,R])],
bsf:[['b',.1,0,.15,.8,.45,1.2,K],['b',.08,.45,.13,.84,.05,1.24,'#4b5563'],['b',.35,.1,1.35,.3,.12,.55,'#6b7280'],['c',.3,0,1.55,.4,.3,.4,Y]],
algae:[['b',.05,0,.05,.9,.06,.9,M],...row(5,i=>['c',.12+i*.17,.06,.45,.1,1.35,.1,'#5ad1a5',.85]),['b',.05,1.41,.4,.9,.06,.1,M],['b',.75,0,.8,.2,.2,.15,K]],
tree:[['b',.05,0,.05,1.9,.05,1.9,'#7cb85c'],['c',.85,0,.85,.3,1.2,.3,D],['k',.3,.9,.3,1.4,1.1,1.4,L],['k',.45,1.5,.45,1.1,.9,1.1,G],...row(4,i=>['k',.1+(i%2)*1.35,.05,.1+(i>>1)*1.35,.45,.4,.45,i%2?'#a23b72':'#3c6fb6'])],
worm:[['b',.15,0,.15,.7,.22,.7,'#92400e'],['b',.18,.22,.18,.64,.22,.64,'#a8561a'],['b',.2,.44,.2,.6,.22,.6,'#b66a2a'],['b',.15,.66,.15,.7,.05,.7,K]],
compost:[['b',0,0,0,1,.7,.08,W],['b',0,0,0,.08,.7,2,W],['b',.92,0,0,.08,.7,2,W],['b',0,0,.98,1,.6,.05,W],['k',.12,0,.2,.76,.6,.7,'#5b3a1e'],['k',.12,0,1.2,.76,.5,.7,'#7a5230']],
nursery:[['b',.08,0,.15,.06,.5,.7,W],['b',.86,0,.15,.06,.5,.7,W],['b',.05,.5,.1,.9,.06,.8,W],...row(4,i=>['b',.12+(i%2)*.42,.56,.16+(i>>1)*.38,.36,.07,.32,'#374151']),...row(4,i=>['k',.2+(i%2)*.42,.63,.22+(i>>1)*.38,.2,.25,.2,G])],
greenhouse:[['b',0,0,0,2,.12,1,M],['b',.2,.12,.2,.7,.2,.6,S],['b',1.1,.12,.2,.7,.2,.6,S],...row(4,i=>['k',.3+i*.4,.32,.4,.22,.3,.22,G]),['b',.05,.12,.05,1.9,.7,.9,'#bfe6ef',.4],['p',.05,.82,.05,1.9,.5,.9,'#d6f0f5',.5]],
solar:[['b',.45,0,.45,.1,.55,.1,M],...row(3,i=>['b',.05,.5+i*.12,.65-i*.25,.9,.06,.25,['#1e3a8a','#23459c','#2a52b0'][i]]),['b',.7,0,.75,.25,.3,.2,K]],
shed:[['b',.08,0,.08,.84,.7,.84,'#a9754a'],['p',0,.7,0,1,.4,1,R],['b',.35,0,.92,.3,.5,.02,D]],
bees:[...row(2,i=>['b',.2+i*.6,0,.3,.1,.3,.1,W]),['b',.15,.3,.15,.7,.22,.7,'#f2d06b'],['b',.15,.52,.15,.7,.22,.7,'#f6e08f'],['b',.15,.74,.15,.7,.22,.7,'#f2d06b'],['b',.1,.96,.1,.8,.07,.8,M],['b',.4,.3,.85,.2,.04,.04,K]],
herb:[['c',.05,0,.05,.9,.16,.9,'#9a8f84'],['c',.17,.16,.17,.66,.16,.66,'#a79b8f'],['c',.28,.32,.28,.44,.16,.44,'#b4a89a'],['k',.12,.16,.15,.22,.3,.22,G],['k',.62,.16,.25,.22,.3,.22,L],['k',.25,.32,.55,.2,.28,.2,'#9ccc65'],['k',.62,.32,.6,.2,.25,.2,G],['k',.4,.48,.4,.18,.32,.18,'#e879a0']],
topiary:[['b',.15,0,.15,.7,.25,.7,W],['b',.2,.25,.2,.6,.04,.6,S],['k',.25,.29,.25,.5,.7,.5,L],['k',.32,.7,.32,.36,.45,.36,G]],
duckweed:[['b',.08,0,.08,.84,.28,.84,'#4b6e8f'],['b',.14,.28,.14,.72,.02,.72,'#7bc043'],...row(5,i=>['k',.2+(i%3)*.22,.3,.2+(i/3|0)*.4,.12,.08,.12,'#9be15d'])]
};
const ADD={fungi:(w,d)=>row(3,i=>['b',.15+i*.3,.9,w-.1,.12,.3,.1,'#e7d3a8']),arch:(w,d)=>[...row(2,i=>['b',i*(w-.08),0,d/2-.04,.08,1.5,.08,W]),['b',0,1.5,d/2-.04,w,.08,.08,W],...row(4,i=>['k',.1+i*(w-.4)/3,1.2,d/2-.12,.25,.35,.25,G])],solar:(w,d)=>[['b',w/2-.05,0,d/2-.05,.1,1.4,.1,M],['b',w/2-.45,1.4,d/2-.3,.9,.06,.6,'#1e3a8a']],pest:(w,d)=>[['b',w-.12,0,.05,.08,1.8,.08,W],['b',w-.25,1.5,0,.3,.3,.3,D],['p',w-.28,1.8,-.03,.36,.2,.36,R]],mass:(w,d)=>row(3,i=>['c',.1+i*.3,0,-.3,.28,.6,.28,K]),trel:(w,d)=>[['b',0,0,0,w,1.5,.05,W],...row(3,i=>['k',.1+i*.3,.2,0,.3,1.2,.3,L])],hang:(w,d)=>row(3,i=>['b',0,.8+i*.35,-.1,w,.1,.14,M]),tier:(w,d)=>row(3,i=>['b',0,.3+i*.35,0,w,.05,.35,W]),under:(w,d)=>[['b',.1,0,.1,w-.2,.12,d-.2,S],...row(3,i=>['k',.2+i*.25,.12,.3,.2,.25,.2,G])],ring:(w,d)=>row(6,i=>['k',.1+(i%3)*(w-.5)/2,0,i<3?-.35:d+.05,.4,.4,.4,i%2?L:G])};
const dk=(c,f)=>'#'+[1,3,5].map(i=>(parseInt(c.slice(i,i+2),16)*f|0).toString(16).padStart(2,'0')).join('');
const part=(k,m)=>MODELS[k]||(()=>{const w=m.w||1,d=m.h||1,c=/^#[0-9a-f]{6}$/i.test(m.c||'')?m.c:'#94a3b8';return[['b',.08,0,.08,w-.16,.6,d-.16,c],['p',.03,.6,.03,w-.06,.38,d-.06,dk(c,.6)],['b',w/2-.15,0,d-.1,.3,.45,.03,dk(c,.4)]]})();
const addon=(k,w,d)=>ADD[k]?ADD[k](w,d):[],height=(k,m)=>Math.max(...part(k,m||{}).map(p=>p[2]+p[5]));
const ex=(ps,g)=>{if(!g)return ps;const ys=[...new Set(ps.map(p=>p[2]))].sort((a,b)=>a-b);return ps.map(p=>{const q=[...p];q[2]=p[2]+ys.indexOf(p[2])*g;return q})};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),col=(c,s)=>{const[r,g,b]=hex(c);return`rgb(${r*s|0},${g*s|0},${b*s|0})`};
const LT=[-.45,.8,.4],shade=(n,L=LT)=>.55+.45*Math.max(0,n[0]*L[0]+n[1]*L[1]+n[2]*L[2]);
function faces(ps,tf){const out=[],o=tf([0,0,0]),nm=n=>{const a=tf(n);return[a[0]-o[0],a[1]-o[1],a[2]-o[2]]},add=(v,n,c,a)=>out.push({v:v.map(tf),n:nm(n),c,a:a??1});
 for(const[t,x,y,z,w,h,d,c,a]of ps){
  if(t==='b'){const X=x+w,Y=y+h,Z=z+d;add([[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]],[0,1,0],c,a);add([[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]],[0,0,1],c,a);add([[x,y,z],[x,y,Z],[x,Y,Z],[x,Y,z]],[-1,0,0],c,a);add([[X,y,z],[X,Y,z],[X,Y,Z],[X,y,Z]],[1,0,0],c,a);add([[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[0,0,-1],c,a)}
  else{const n=t==='p'?4:10,q=n===4?1.4142:1,rx=w/2*q,rz=d/2*q,cx=x+w/2,cz=z+d/2,a0=n===4?Math.PI/4:0,ring=(yy,k)=>Array.from({length:n},(_,i)=>{const e=a0+i*2*Math.PI/n;return[cx+Math.cos(e)*rx*k,yy,cz+Math.sin(e)*rz*k]}),lo=ring(y,1),hi=ring(y+h,t==='c'?1:0);
   for(let i=0;i<n;i++){const j=(i+1)%n,e=a0+(i+.5)*2*Math.PI/n;add([lo[i],lo[j],hi[j],hi[i]],[Math.cos(e),t==='c'?0:.5,Math.sin(e)],c,a)}
   if(t==='c')add(hi,[0,1,0],c,a)}}
 return out}
function view(fs,cam){const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch),rz=(x,z)=>-x*sy+z*cy,rx=(x,z)=>x*cy+z*sy,
 P=v=>{const x=v[0]-cam.cx,z=v[2]-cam.cz,zr=rz(x,z);return[rx(x,z)*cam.s+cam.ox,(zr*sp-v[1]*cp)*cam.s+cam.oy,zr*cp+v[1]*sp]},out=[];
 for(const f of fs){if(rz(f.n[0],f.n[2])*cp+f.n[1]*sp<=.001)continue;const p=f.v.map(P);out.push({p,z:p.reduce((s,q)=>s+q[2],0)/p.length,c:f.c,a:f.a,s:shade(f.n,cam.light)})}
 return out.sort((a,b)=>a.z-b.z)}
function viewP(fs,c){const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch),out=[],N=.15,
 cl=P=>{const o=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],ia=a[2]>=N,ib=b[2]>=N;if(ia)o.push(a);if(ia!==ib){const t=(N-a[2])/(b[2]-a[2]);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,N])}}return o};
 for(const f of fs){const n=f.v.length,m=f.v.reduce((s,v)=>[s[0]+v[0]/n,s[1]+v[1]/n,s[2]+v[2]/n],[0,0,0]);if(f.n[0]*(c.x-m[0])+f.n[1]*(c.y-m[1])+f.n[2]*(c.z-m[2])<=0)continue;
  const q=cl(f.v.map(v=>{const x=v[0]-c.x,y=v[1]-c.y,z=v[2]-c.z,zr=x*sy+z*cy;return[x*cy-z*sy,y*cp+zr*sp,zr*cp-y*sp]}));if(q.length<3)continue;
  out.push({p:q.map(r=>[r[0]/r[2]*c.f+c.ox,c.oy-r[1]/r[2]*c.f,r[2]]),z:-Math.hypot(m[0]-c.x,m[1]-c.y,m[2]-c.z),c:f.c,a:f.a,s:shade(f.n,c.light)})}
 return out.sort((a,b)=>a.z-b.z)}
const cache=new Map();
function svg(key,o={}){const id=key+JSON.stringify(o);if(cache.has(id))return cache.get(id);
 const m=(window.T&&T[key])||{w:1,h:1},r=o.rot,Wd=r?m.h:m.w,Dd=r?m.w:m.h,tf=r?p=>[m.h-p[2],p[1],p[0]]:p=>p,pitch=(o.pitch??32)*RAD,
 v=view(faces(ex(part(key,m),o.explode),tf),{yaw:(o.yaw??35)*RAD,pitch,cx:Wd/2,cz:Dd/2,s:100,ox:0,oy:0});
 let vb;if(o.plan)vb=[-Wd*50,-Dd*50*Math.sin(pitch),Wd*100,Dd*100*Math.sin(pitch)];else{let a=1e9,b=1e9,c=-1e9,d=-1e9;v.forEach(f=>f.p.forEach(q=>{a=Math.min(a,q[0]);b=Math.min(b,q[1]);c=Math.max(c,q[0]);d=Math.max(d,q[1])}));vb=[a-8,b-8,c-a+16,d-b+22]}
 const sh=o.plan?'':`<ellipse cx="${vb[0]+vb[2]/2}" cy="${vb[1]+vb[3]-12}" rx="${vb[2]*.38}" ry="7" fill="rgba(0,0,0,.14)"/>`,
 s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid meet">${sh}${v.map(f=>`<polygon points="${f.p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="${col(f.c,f.s)}" fill-opacity="${f.a}" stroke="rgba(0,0,0,.2)" stroke-width="1" stroke-linejoin="round"/>`).join('')}</svg>`;
 cache.set(id,s);return s}
/* Three.js bridge for later: scene.add(ModelKit.toThree(THREE,'bio',2,2)) gives a flat-shaded low-poly Group. */
function toThree(THREE,key,w=1,h=1){const g=new THREE.Group();for(const[t,x,y,z,pw,ph,pd,c,a]of part(key,{w,h})){const geo=t==='b'?new THREE.BoxGeometry(pw,ph,pd):t==='c'?new THREE.CylinderGeometry(pw/2,pw/2,ph,10):new THREE.ConeGeometry(pw/2*(t==='p'?1.4142:1),ph,t==='p'?4:10),
 me=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c,flatShading:true,transparent:a<1,opacity:a??1}));me.position.set(x+pw/2,y+ph/2,z+pd/2);if(t!=='b')me.scale.z=pd/pw;if(t==='p')me.rotation.y=Math.PI/4;g.add(me)}return g}
window.ModelKit={MODELS,part,addon,height,faces,view,viewP,svg,col,toThree};
})();
