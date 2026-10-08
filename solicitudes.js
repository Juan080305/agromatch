'use strict';
const demoRequests=[
 {id:'demo-req-0',buyer:'Soda El Cruce',business:'Restaurante',product:'tomate',kg:40,province:'San José',day:3,maxPrice:800},
 {id:'demo-req-1',buyer:'Hotel Mirador del Valle',business:'Hotel',product:'aguacate',kg:25,province:'Alajuela',day:4,maxPrice:2000},
 {id:'demo-req-2',buyer:'Salsas del Valle',business:'Procesadora',product:'tomate',kg:250,province:'Heredia',day:2,maxPrice:600},
 {id:'demo-req-3',buyer:'Verdulería La Esquina',business:'Comercio',product:'zanahoria',kg:60,province:'Cartago',day:1,maxPrice:null},
 {id:'demo-req-4',buyer:'Cocina Caribeña',business:'Restaurante',product:'chayote',kg:30,province:'Limón',day:5,maxPrice:null},
 {id:'demo-req-5',buyer:'Batidos del Puerto',business:'Comercio',product:'banano',kg:80,province:'Puntarenas',day:3,maxPrice:450}
].map(r=>({...r,date:plusDay(r.day),demo:true}));
const requests=()=>Array.isArray(state.requests)?state.requests:[];
const productFits=(p,query)=>AgroSearch.matches({name:p.name,description:p.category+' '+p.description},query);
const lower=s=>String(s).toLocaleLowerCase('es');
const capital=s=>{const t=String(s).trim();return t.charAt(0).toLocaleUpperCase('es')+t.slice(1);};
const plural=(n,one,many)=>n===1?one:many;
const whenReady=p=>p.date<=dateBase()?'Listo hoy':'Listo el '+displayDate(p.date);

function evaluate(r,p){
 const room=Math.max(0,p.available-(state.cart[p.id]||0));
 if(room<p.min)return null;
 const checks=[];
 checks.push(room>=r.kg?{ok:true,text:room+' kg disponibles'}:{ok:false,text:'Cubre '+room+' de '+r.kg+' kg'});
 if(r.kg<p.min)checks.push({ok:false,text:'Compra mínima de '+p.min+' kg'});
 checks.push(p.date<=r.date?{ok:true,text:whenReady(p)}:{ok:false,text:'Listo el '+displayDate(p.date)+', después de tu fecha'});
 if(r.province)checks.push(p.province===r.province?{ok:true,text:'En '+p.province}:{ok:false,text:'En '+p.province+', fuera de '+r.province});
 if(r.maxPrice)checks.push(p.price<=r.maxPrice?{ok:true,text:money(p.price)+'/kg, dentro de tu máximo'}:{ok:false,text:money(p.price)+'/kg, sobre tu máximo'});
 const qty=Math.min(room,Math.max(p.min,r.kg));
 return {p,room,qty,checks,misses:checks.filter(c=>!c.ok).length};
}
function matchesFor(r){
 return products().filter(p=>productFits(p,r.product)).map(p=>evaluate(r,p)).filter(Boolean).sort((a,b)=>a.misses-b.misses||a.p.price-b.p.price);
}
function checkList(checks){
 return '<ul class="match-checks">'+checks.map(c=>`<li class="${c.ok?'ok':'warn'}"><span class="sr-only">${c.ok?'Cumple:':'Revisá:'}</span>${esc(c.text)}</li>`).join('')+'</ul>';
}
function requestSummary(r,list){
 const full=list.filter(m=>!m.misses);
 const label=`${r.kg} kg de ${esc(lower(r.product))}`;
 if(full.length)return {state:'full',badge:'Tenés match',text:`${full.length} ${plural(full.length,'lote calza','lotes calzan')} con todo lo que pediste.`,label};
 if(list.length){
  const total=list.reduce((s,m)=>s+m.room,0);
  const extra=list.length>1&&list.every(m=>m.room<r.kg)&&total>=r.kg?` Juntando ${list.length} lotes llegás a ${total} kg.`:'';
  return {state:'partial',badge:'Match parcial',text:`Hay ${list.length} ${plural(list.length,'lote parecido','lotes parecidos')}, pero no ${plural(list.length,'cumple','cumplen')} todo. Revisá lo que falta.${extra}`,label};
 }
 return {state:'none',badge:'Sin lotes todavía',text:`Nadie ha publicado ${esc(lower(r.product))} por ahora. Tu solicitud queda guardada y los lotes aparecen aquí apenas alguien los publique en este navegador.`,label};
}
window.renderMatch=function(){
 const list=requests();
 $('#request-list').innerHTML=list.length?'<h2 class="request-list-title">Tus solicitudes</h2>'+list.map(r=>{
  const found=matchesFor(r);const s=requestSummary(r,found);
  const meta=['Para el '+displayDate(r.date),r.province||'Cualquier provincia',r.maxPrice?'Hasta '+money(r.maxPrice)+'/kg':'',r.business].filter(Boolean).map(esc).join(' · ');
  const rows=found.map(m=>`<li class="match-row${m.misses?'':' full'}"><img src="imagenes/${esc(m.p.image)}" alt="" loading="lazy"><div class="match-info"><h4>${esc(m.p.name)}</h4><p class="match-farm"><a href="comunidad.html?finca=${encodeURIComponent(m.p.farm)}">${esc(m.p.farm)}</a> · ${esc(m.p.province)}</p>${checkList(m.checks)}</div><div class="match-actions"><strong>${money(m.qty*m.p.price)}</strong><button class="button small" data-match-add="${esc(m.p.id)}" data-qty="${m.qty}" aria-label="Agregar ${m.qty} kg de ${esc(m.p.name)} al carrito">Agregar ${m.qty} kg</button><button class="text-button" data-detail="${esc(m.p.id)}">Ver lote</button></div></li>`).join('');
  return `<article class="request-card" id="${esc(r.id)}"><div class="request-head"><div><span class="match-state ${s.state}">${s.badge}</span><h3>${s.label}</h3><p>${meta}</p></div><button class="text-button" data-delete-request="${esc(r.id)}">Quitar solicitud</button></div><p class="match-summary">${s.text}</p>${rows?'<ol class="match-list">'+rows+'</ol>':'<button class="button outline" data-view="explore">Ver lo que hay disponible</button>'}</article>`;
 }).join(''):'<div class="empty"><strong>Tu primera solicitud.</strong><p>Llená el formulario y te mostramos qué lotes calzan con lo que necesita tu negocio.</p></div>';
};

const demand=document.createElement('section');demand.className='demand-panel surface';demand.setAttribute('aria-labelledby','demand-title');
demand.innerHTML='<h2 id="demand-title">Quién busca cosechas</h2><p>Solicitudes de compradores. Si tenés el producto, publicá un lote con los datos de la solicitud ya llenos.</p><div id="demand-list"></div>';
$('#sell-view .sales-panel')?$('#sell-view .sales-panel').before(demand):$('#sell-view').append(demand);
window.renderDemand=function(){
 const own=requests().map(r=>({...r,own:true}));
 const list=[...own,...[...demoRequests].sort((a,b)=>a.date.localeCompare(b.date))];
 const mine=products().filter(p=>p.own);
 $('#demand-list').innerHTML=list.map(r=>{
  const hits=mine.filter(p=>productFits(p,r.product));
  const who=r.own?'Tu solicitud · '+r.business:r.buyer+' · '+r.business;
  const meta=['Para el '+displayDate(r.date),r.province||'Cualquier provincia',r.maxPrice?'Hasta '+money(r.maxPrice)+'/kg':''].filter(Boolean).join(' · ');
  const action=hits.length?`<p class="demand-hit">Calza con tu lote «${esc(hits[0].name)}»${hits.length>1?' y '+(hits.length-1)+' más':''}.</p>`:r.own?'':`<button class="button outline small" data-fill-request="${esc(r.id)}">Publicar un lote para esta solicitud</button>`;
  return `<article class="demand-row${r.own?' own':''}"><div><h3>${r.kg} kg de ${esc(lower(r.product))}</h3><p class="demand-who"><span>${esc(who)}</span>${r.demo?'<span class="demand-tag">Ejemplo ficticio</span>':''}</p><p class="demand-meta">${esc(meta)}</p></div>${action}</article>`;
 }).join('');
};

const requestForm=$('#request-form');
function resetRequestDates(){requestForm.elements.date.min=dateBase();requestForm.elements.date.value=plusDay(3);}
resetRequestDates();
requestForm.addEventListener('submit',e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const error=$('#request-error');
 const product=d.product.trim(),kg=Number(d.kg),maxPrice=d.maxPrice===''?null:Number(d.maxPrice);
 if(!AgroSearch.normalize(product)){error.textContent='Escribí el producto que necesitás.';return;}
 if(!Number.isInteger(kg)||kg<1){error.textContent='Indicá los kilos con un número entero mayor que cero.';return;}
 if(maxPrice!==null&&(!Number.isInteger(maxPrice)||maxPrice<1)){error.textContent='El precio máximo debe ser un número entero mayor que cero, o dejalo vacío.';return;}
 if(!d.date||d.date<dateBase()){error.textContent='Elegí una fecha de hoy en adelante.';return;}
 const r={id:'req-'+(crypto.randomUUID?.()||Date.now()),product,kg,province:d.province,date:d.date,maxPrice,business:d.business};
 const next={...state,requests:[r,...requests()]};
 try{localStorage.setItem(KEY,JSON.stringify(next));}catch{error.textContent='No se pudo guardar la solicitud. Liberá espacio en el navegador e intentá de nuevo.';return;}
 state=next;error.textContent='';e.target.reset();resetRequestDates();renderMatch();renderDemand();
 const found=matchesFor(r),full=found.filter(m=>!m.misses).length;
 toast(full?`Encontramos ${full} ${plural(full,'lote que calza','lotes que calzan')}.`:found.length?'Hay lotes parecidos. Revisá qué les falta.':'Solicitud guardada. Todavía no hay lotes de '+lower(product)+'.');
 document.getElementById(r.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
});

const seenLots=new Set(state.lots.map(l=>l.id));
$('#sell-form').addEventListener('submit',()=>{
 const lot=state.lots.find(l=>!seenLots.has(l.id));state.lots.forEach(l=>seenLots.add(l.id));if(!lot)return;
 const hits=[...requests(),...demoRequests].filter(r=>productFits(lot,r.product));
 if(hits.length)setTimeout(()=>toast(`Tu lote calza con ${hits.length} ${plural(hits.length,'solicitud','solicitudes')} de compra. Las ves en «Quién busca cosechas».`),60);
});

document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.matchAdd){const qty=Number(b.dataset.qty);try{addToCart(b.dataset.matchAdd,qty);toast(`${qty} kg agregados a tu pedido.`);renderMatch();}catch(err){toast(err.message);}}
 if(b.dataset.deleteRequest){const next={...state,requests:requests().filter(r=>r.id!==b.dataset.deleteRequest)};try{localStorage.setItem(KEY,JSON.stringify(next));}catch{toast('No se pudo quitar la solicitud. Intentá de nuevo.');return;}state=next;renderMatch();renderDemand();toast('Solicitud quitada.');}
 if(b.hasAttribute('data-request-from-search')){const query=$('#search').value.trim();setView('match');requestForm.reset();resetRequestDates();requestForm.elements.product.value=query;const province=$('#province').value;if(province)requestForm.elements.province.value=province;(query?requestForm.elements.kg:requestForm.elements.product).focus();}
 if(b.dataset.fillRequest){
  const r=[...requests(),...demoRequests].find(x=>x.id===b.dataset.fillRequest);if(!r)return;
  const f=$('#sell-form').elements,ref=products().find(p=>productFits(p,r.product));
  f.name.value=capital(r.product);f.category.value=ref?.category||'Hortalizas';if(r.province)f.province.value=r.province;
  f.stock.value=r.kg;f.min.value=Math.min(10,r.kg);if(r.maxPrice)f.price.value=r.maxPrice;f.date.value=dateBase();
  $('#sell-error').textContent='';$('#sell-form').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  f.farm.value?f.description.focus({preventScroll:true}):f.farm.focus({preventScroll:true});
  toast('Datos de la solicitud listos. Completá tu finca y la calidad del producto.');
 }
});

for(const id of ['#cart-dialog','#product-dialog'])$(id).addEventListener('close',()=>{if(!$('#match-view').hidden)renderMatch();});
const renderAllBeforeMatch=renderAll;renderAll=function(){renderAllBeforeMatch();renderMatch();renderDemand();};
renderMatch();renderDemand();
