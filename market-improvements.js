'use strict';
let selectedFarm=new URLSearchParams(location.search).get('farm')||'';
const farmFilter=document.createElement('div');farmFilter.className='farm-filter';farmFilter.innerHTML='<p id="selected-farm" role="status"></p><button type="button" class="button outline" id="clear-farm">Ver todas las fincas</button>';
$('.search-row').before(farmFilter);
const originalFiltered=filtered;
filtered=function(){return originalFiltered().filter(p=>!selectedFarm||p.farm===selectedFarm);};
function updateFarmFilter(){farmFilter.hidden=!selectedFarm;$('#selected-farm').textContent='Cosechas de '+selectedFarm;renderProducts();}
$('#clear-farm').addEventListener('click',()=>{selectedFarm='';const url=new URL(location.href);url.searchParams.delete('farm');history.replaceState(null,'',url);updateFarmFilter();});
if(selectedFarm)$('#search').value='';
updateFarmFilter();

const profileChoice=document.createElement('label');profileChoice.textContent='Usar uno de mis perfiles';const profileSelect=document.createElement('select');profileSelect.id='seller-profile';profileChoice.append(profileSelect);$('#sell-form h2').after(profileChoice);
function refreshProfileChoice(){const previous=profileSelect.value;const profiles=state.profiles||[];profileSelect.innerHTML='<option value="">Ingresar los datos de la finca</option>'+profiles.map(p=>`<option value="${esc(p.id)}">${esc(p.name)} · ${esc(p.role)}</option>`).join('');profileSelect.value=previous;profileChoice.hidden=!profiles.length;}
profileSelect.addEventListener('change',()=>{const p=(state.profiles||[]).find(p=>p.id===profileSelect.value);if(!p)return;$('#sell-form').elements.farm.value=p.name;$('#sell-form').elements.province.value=p.province;});
const originalRenderAll=renderAll;renderAll=function(){originalRenderAll();refreshProfileChoice();};refreshProfileChoice();

const originalRenderOrders=renderOrders;renderOrders=function(){originalRenderOrders();$$('#orders-list .order-card').forEach((card,index)=>{const order=state.orders[index];const button=document.createElement('button');button.type='button';button.className='button outline';button.dataset.repeatOrder=order.id;button.textContent='Volver a comprar';card.querySelector('.order-actions').append(button);});};
const repeatDialog=document.createElement('dialog');repeatDialog.id='repeat-dialog';repeatDialog.setAttribute('aria-labelledby','repeat-title');repeatDialog.innerHTML='<button class="close-dialog" aria-label="Cerrar resumen">×</button><h2 id="repeat-title">Revisá tu nueva compra</h2><p>Se usan los precios y la disponibilidad actuales. Tu carrito anterior se conserva.</p><div id="repeat-summary"></div><button class="button" id="repeat-confirm">Agregar al carrito</button>';document.body.append(repeatDialog);
let repeatId=null;
function repeatPlan(id){const order=state.orders.find(o=>o.id===id);return (order?.items||[]).map(i=>{const p=product(i.id);const room=p?Math.max(0,p.available-(state.cart[i.id]||0)):0;const qty=Math.min(i.qty,room);return {p,name:i.name,qty:p&&qty>=p.min?qty:0};});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-repeat-order]');if(!b)return;repeatId=b.dataset.repeatOrder;const plan=repeatPlan(repeatId);$('#repeat-summary').innerHTML='<ul>'+plan.map(x=>`<li>${esc(x.name)}: ${x.qty?x.qty+' kg · '+money(x.qty*x.p.price):'sin cantidad suficiente para el mínimo de compra'}</li>`).join('')+'</ul>';$('#repeat-confirm').disabled=!plan.some(x=>x.qty);repeatDialog.showModal();});
$('#repeat-confirm').addEventListener('click',()=>{const plan=repeatPlan(repeatId);const next={...state,cart:{...state.cart}};for(const x of plan)if(x.qty)next.cart[x.p.id]=(next.cart[x.p.id]||0)+x.qty;try{localStorage.setItem(KEY,JSON.stringify(next));}catch{toast('No pudimos guardar el carrito. Intentá liberar espacio.');return;}state=next;repeatDialog.close();renderCart();$('#cart-dialog').showModal();});
renderOrders();
