// ============================================================
//  app.js  -  gallery logic (search, paging, viewer, intro, team)
//  Loaded last. Needs config.js and posters-data.js first.
// ============================================================
document.querySelectorAll(".logo-img").forEach(i=>i.src=LOGO);
let posters=[],filter="All",query="",current=0,shown=[],page=1,pages=1,big=false;
const $=id=>document.getElementById(id);
function mixLast(a,k=15){ // moves the last k posters to fixed random spots, so every visitor sees the same order
  const pin=a.filter(p=>p.pin),b=a.filter(p=>!p.pin),head=b.slice(0,b.length-k),tail=b.slice(b.length-k);
  let s=20261015;const rnd=()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
  tail.forEach(p=>head.splice(Math.floor(rnd()*(head.length+1)),0,p));
  return [...pin,...head]}
function load(){let v=[];try{v=JSON.parse(localStorage.getItem(KEY)||"[]").filter(p=>/^u\d+$/.test(p.id))}catch(e){}const all=[...REAL,...REAL2,...REAL3,...REAL4,...REAL5,...REAL6,...REAL7,...REAL8,...REAL9,...REAL10,...REAL11,...REAL12,...REAL13,...REAL14,...REAL15,...MORE,...SAMPLES],byId=Object.fromEntries(all.map(p=>[p.id,p]));posters=[...v,...ORDER.map(id=>byId[id]).filter(Boolean),...all.filter(p=>!ORDER.includes(p.id))];
  posters=posters.filter(p=>!REMOVED.includes(p.id));
  posters.sort((a,b)=>(b.pin?1:0)-(a.pin?1:0));
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(posters.filter(p=>/^u\d+$/.test(p.id))));return true}catch(e){return false}}
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function renderChips(){}
function pager(){const el=$("pager");if(pages<2){el.innerHTML="";return}
  let h=`<button type="button" class="pg" data-p="${page-1}" ${page===1?"disabled":""}>← Prev</button>`;
  for(let i=1;i<=pages;i++)h+=`<button type="button" class="pg${i===page?" on":""}" data-p="${i}">${i}</button>`;
  h+=`<button type="button" class="pg" data-p="${page+1}" ${page===pages?"disabled":""}>Next →</button>`;el.innerHTML=h}
function render(){
  const q=query?posters.filter(p=>p.title.toLowerCase().includes(query)):null;
  const best=posters.filter(p=>p.best).slice(0,FIRST_PAGE);
  [...best,...posters.filter(p=>!best.includes(p))].forEach((p,i)=>p.n=i+1);
  const rest=q||posters.filter(p=>!best.includes(p));
  const hasBest=!q&&best.length>0,off=hasBest?2:1;
  pages=(hasBest?1:0)+Math.max(1,Math.ceil(rest.length/PER_PAGE));
  if(page>pages)page=1;
  big=hasBest&&page===1;
  shown=big?best:rest.slice((page-off)*PER_PAGE,(page-off+1)*PER_PAGE);
  $("count").textContent=(big?"★ Best posters · "+shown.length:(hasBest?"All posters · ":"Results · ")+rest.length)+" pieces"+(pages>1?" · page "+page+" of "+pages:"");
  $("grid").className="grid "+(big?"big":"small");
  pager();
  $("grid").innerHTML=shown.length?shown.map((p,i)=>`<button class="card" data-i="${i}" type="button"><div class="frame">${big?'<span class="badge">★ Best</span>':""}<span class="num"><small>№</small>${String(p.n).padStart(2,"0")}</span><img loading="lazy" src="${p.img}" alt="${esc(p.title)} poster"></div><div class="meta"><div></div></div></button>`).join(""):'<div class="empty">No posters found. Try another search.</div>';
}
function link(msg){const t=encodeURIComponent(msg);
  if(CONTACT.whatsapp)return"https://wa.me/"+CONTACT.whatsapp+"?text="+t;
  if(CONTACT.email)return"mailto:"+CONTACT.email+"?subject="+encodeURIComponent("Poster enquiry")+"&body="+t;
  return"#stall"}
function openV(i){current=i;const p=shown[i];
  $("vImg").src=p.img;$("vImg").alt=p.title;$("vNo").innerHTML="<small>Plate №</small><b>"+String(p.n).padStart(2,"0")+"</b>";
  $("vPts").innerHTML=POINTS.map(t=>`<li>${esc(t)}</li>`).join("");
  $("viewer").classList.add("open")}
const step=d=>openV((current+d+shown.length)%shown.length);
function shrink(f){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=no;r.onload=()=>{const im=new Image();im.onerror=no;
  im.onload=()=>{const k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.8))};im.src=r.result};r.readAsDataURL(f)})}


$("search").oninput=e=>{query=e.target.value.trim().toLowerCase();page=1;render()};
$("pager").onclick=e=>{const b=e.target.closest(".pg");if(!b||b.disabled)return;page=+b.dataset.p;render();$("gallery").scrollIntoView({behavior:"smooth"})};
$("grid").onclick=e=>{const b=e.target.closest(".card");if(b)openV(+b.dataset.i)};
$("closeV").onclick=()=>$("viewer").classList.remove("open");
$("prev").onclick=()=>step(-1);$("next").onclick=()=>step(1);
$("closeU").onclick=()=>$("uploader").classList.remove("open");
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")document.querySelectorAll(".modal").forEach(m=>m.classList.remove("open"));
  if($("viewer").classList.contains("open")&&shown.length){if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)}});
$("upForm").onsubmit=async e=>{e.preventDefault();
  try{const img=await shrink($("fFile").files[0]);
    posters.unshift({id:"u"+Date.now(),title:$("fTitle").value.trim()||"Poster",best:$("fBest").checked,n:Math.max(0,...posters.map(p=>p.n||0))+1,img});
    if(!save())alert("Poster added, but this browser has no more room to remember it after you close the page.");
    e.target.reset();$("uploader").classList.remove("open");page=1;query="";$("search").value="";renderChips();render();
    $("gallery").scrollIntoView({behavior:"smooth"});
  }catch(err){alert("Sorry, that image could not be read. Please try another file.")}};




$("team-list").innerHTML=TEAM.map((m,i)=>{const ini=m.name.split(" ").filter(w=>/^[A-Za-z]/.test(w)).map(w=>w[0]).slice(0,2).join("").toUpperCase();return `<div class="mem${m.lead?" lead":""}" style="--i:${i}"><em>${m.lead?"♛ ":""}0${i+1}</em><div class="disc">${[1,2].map(n=>`<div class="h h${n}">${m.photo?`<img src="${esc(m.photo)}" alt="">`:""}</div>`).join("")}${m.photo?"":`<b class="ini">${ini}</b>`}</div><h3>${esc(m.name)}</h3><span>${esc(m.role)}</span></div>`}).join("");
(function(){const L=$("team-list"),M=[...L.querySelectorAll(".mem")];
  M.forEach((c,i)=>c.dataset.n=String(i+1).padStart(2,"0"));
  const io="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.25}):null;
  M.forEach(c=>io?io.observe(c):c.classList.add("in"));
  L.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const c=e.target.closest(".mem");if(!c)return;
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty("--mx",x*100+"%");c.style.setProperty("--my",y*100+"%");
    c.style.setProperty("--ry",((x-.5)*16)+"deg");c.style.setProperty("--rx",((.5-y)*12)+"deg")});
  L.addEventListener("pointerout",e=>{const c=e.target.closest(".mem");if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty("--rx");c.style.removeProperty("--ry")}});
})();
$("yr").textContent=new Date().getFullYear();
load();renderChips();render();
(function(){const el=$("intro");if(!el)return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.remove();return}
  document.body.style.overflow="hidden";
  const end=()=>{el.classList.add("out");document.body.style.overflow="";setTimeout(()=>el.remove(),800)};
  const t=setTimeout(end,5900);
  $("skip").onclick=()=>{clearTimeout(t);end()};
})();
