const sv=document.getElementById('sv'),nodesEl=document.getElementById('nodes'),pn=document.getElementById('pn'),sc=document.getElementById('sc');
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=["#7e8ee0","#e07a8a","#f2b84b","#6fae8d","#c98bd6","#e8955a","#d9a21b","#5aa3c7","#d97aa8"],Y=[945,620,430,250,90],W=[0,10,6,3.5,2.5];
let T,ALL=[],open=new Set(),sel=null,drawn=new Set();
const rnd=k=>{const t=Math.sin(k*127.1+311.7)*43758.5453;return t-Math.floor(t)};

// Turn database rows into a tree. Leaves get end boxes (Jobs, Skills, Entrance exams, Higher studies, Budget).
function build(rows){
 const by={};rows.forEach(r=>{by[r.id]={n:r.name,d:r.short_note,j:r.jobs,s:r.skills,e:r.entrance_exams,b:r.budget_options,m:r.higher_studies,h:r.is_hidden,so:r.sort_order,pid:r.parent_id,c:[]}});
 let root;Object.values(by).forEach(x=>{if(x.pid==null)root=x;else if(by[x.pid])by[x.pid].c.push(x)});
 Object.values(by).forEach(x=>x.c.sort((a,b)=>a.so-b.so));
 (function lf(x){if(x.c.length){x.c.forEach(lf);return}
  const E=[];
  if(x.j)E.push({n:'Jobs',end:1,t:x.j,c:[]});
  if(x.s)E.push({n:'Skills',end:1,t:x.s,c:[]});
  if(x.e)E.push({n:'Entrance exams',end:1,t:x.e,c:[]});
  if(x.m)E.push({n:'Higher studies',end:1,t:x.m,c:[]});
  if(x.b)E.push({n:'If your budget is low',end:1,bud:1,bt:x.b,t:'Tap to see cheaper routes and scholarships \u2193',c:[]});
  x.c=E})(root);
 return root}

function init(rows){
 T=build(rows);let uid=0;
 (function ix(x,par,lv){x.id=uid++;x.lv=lv;x.par=par;x.path=(par?par.path:[]).concat(x.n);ALL.push(x);x.c.forEach(c=>ix(c,x,lv+1))})(T,null,0);
 T.c.forEach((g,i)=>{(function p(x){x.col=COL[i%COL.length];x.c.forEach(p)})(g)});
 pn.innerHTML='<h2>Start with any branch</h2><p>Tap a box on the tree. Its path and details will appear here.</p>';
 render();sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2}

function vis(){const o=[];T.c.forEach((g,i)=>{g.x=60+i*(880/Math.max(T.c.length-1,1));g.y=Y[1];o.push(g)});
 function rec(x){if(!open.has(x.id)||!x.c.length)return;const n=x.c.length,sp=x.c[0].end?(n>3?175:200):150,t=(n-1)*sp,s=Math.max(110,Math.min(x.x-t/2,890-t));
  x.c.forEach((c,i)=>{c.x=s+i*sp;c.y=Y[Math.min(c.lv,4)];o.push(c);rec(c)})}
 T.c.forEach(rec);return o}

function render(){const v=vis();let s='',h='';
 v.forEach(n=>{for(let i=0;i<6;i++){const a=rnd(n.id*9+i)*6.28,d=50+rnd(n.id*13+i)*45,cx=n.x+Math.cos(a)*d,cy=n.y+Math.sin(a)*d*.7;
  s+='<ellipse class="lf" cx="'+cx+'" cy="'+cy+'" rx="'+(9+rnd(i+n.id)*7)+'" ry="'+(5+rnd(i*3+n.id)*4)+'" transform="rotate('+rnd(i+n.id*5)*180+' '+cx+' '+cy+')"/>'}});
 s+='<path class="trunk" d="M500 925 C504 860 496 800 500 745"/>';
 v.forEach(n=>{const px=n.lv===1?500:n.par.x,py=n.lv===1?760:n.par.y-26,g=drawn.has(n.id)?'':' grow';
  s+='<path class="branch'+g+'" pathLength="1" stroke-width="'+W[Math.min(n.lv,4)]+'" d="M'+px+' '+py+' C'+px+' '+(py-80)+' '+n.x+' '+(n.y+90)+' '+n.x+' '+(n.y+26)+'"/>';
  h+='<button class="nd lv'+n.lv+(n.end?' end':'')+(n.bud?' bud':'')+(n.h?' h':'')+(open.has(n.id)?' on':'')+(sel===n.id?' sel':'')+(drawn.has(n.id)?'':' pop')+'" id="n-'+n.id+'" data-id="'+n.id+'" style="left:'+n.x/10+'%;top:'+n.y/9.8+'%;--c:'+n.col+'"><b>'+(n.h?'\u2605 ':'')+esc(n.n)+'</b>'+(n.d||n.t?'<small>'+esc(n.d||n.t)+'</small>':'')+'</button>'});
 sv.innerHTML=s;nodesEl.innerHTML=h;drawn=new Set(v.map(n=>n.id))}

function closeAll(x){open.delete(x.id);x.c.forEach(closeAll)}
function showBud(x){
 pn.innerHTML='<h2>Low on budget? Your options</h2><p class="bc">'+esc(x.par.path.join(' \u203a '))+'</p><p><b>Cheaper routes:</b> '+esc(x.bt)+'</p><p><b>Scholarships:</b> select your state in the Scholarships section just below to see the official portal.</p><p><button class="bk">Back to the tree</button></p>';
 pn.querySelector('.bk').onclick=()=>sc.scrollIntoView({block:'start',behavior:rm});
 pn.scrollIntoView({block:'start',behavior:rm})}
nodesEl.addEventListener('click',e=>{const b=e.target.closest('.nd');if(!b)return;const x=ALL[+b.dataset.id];
 if(x.end){if(x.bud)showBud(x);return}
 const was=open.has(x.id);x.par.c.forEach(c=>{if(c!==x)closeAll(c)});closeAll(x);if(!was)open.add(x.id);sel=null;
 pn.innerHTML='<h2>'+esc(x.n)+'</h2><p class="bc">'+esc(x.path.join(' \u203a '))+'</p><p>'+esc(x.d||'')+'</p><p>'+(was?'':'Tap the branches that appear to keep exploring.')+'</p>';
 render();const nb=document.getElementById('n-'+x.id);nb.focus({preventScroll:true});
 if(!was)sc.scrollTo({left:nb.offsetLeft-sc.clientWidth/2,behavior:rm})});

function initSch(rows){
 const ok=u=>/^https:\/\//.test(u||'');
 const card=r=>'<strong>'+esc(r.name)+'</strong><span>'+esc(r.description||'')+'</span>'+(ok(r.official_link)?'<a href="'+esc(r.official_link)+'" target="_blank" rel="noopener">Open official site \u2197</a>':'');
 const nat=rows.find(r=>r.state==='All India'),st=rows.filter(r=>r.state!=='All India');
 document.getElementById('nsp').innerHTML=nat?card(nat):'';
 const ss=document.getElementById('stt'),sl=document.getElementById('stl');
 st.forEach(r=>ss.add(new Option(r.state,r.state)));ss.add(new Option('Other state','Other state'));
 ss.onchange=()=>{const r=st.find(x=>x.state===ss.value);sl.innerHTML=r?card(r):'<strong>Your state scholarship portal</strong><span>Check your state education department website. The National Scholarship Portal above works for central schemes.</span>'};ss.onchange()}

async function sb(table){
 const r=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?select=*&order=id',{headers:SUPABASE_ANON_KEY.startsWith('eyJ')?{apikey:SUPABASE_ANON_KEY,Authorization:'Bearer '+SUPABASE_ANON_KEY}:{apikey:SUPABASE_ANON_KEY}});
 if(!r.ok)throw new Error('load');return r.json()}
(async()=>{try{
 if(!SUPABASE_URL||SUPABASE_URL.includes('YOUR-')||!SUPABASE_ANON_KEY||SUPABASE_ANON_KEY.includes('YOUR-'))throw new Error('config');
 const [n,s]=await Promise.all([sb('nodes'),sb('scholarships')]);init(n);initSch(s)}
 catch(e){pn.innerHTML='<h2>Could not load the data</h2><p>'+(e.message==='config'?'Add your Supabase URL and anon key in config.js.':'Please check your internet connection and your Supabase settings, then refresh.')+'</p>'}})();
