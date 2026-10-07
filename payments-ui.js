'use strict';
let receiptOrderId = null;
window.updatePaymentPanels = function () {
  const method = $('#checkout-form').elements.payment.value;
  for (const type of ['sinpe','card','pickup']) $('#'+type+'-panel').hidden=method!==type;
  $('#checkout-error').textContent='';
};
$$('input[name=payment]').forEach(input=>input.addEventListener('change',updatePaymentPanels));
$('#checkout-receipt').addEventListener('change',async e=>{
  const file=e.target.files[0];$('#receipt-selection').textContent='';
  if(!file)return;
  try{await AgroReceipts.validate(file);$('#receipt-selection').textContent='Archivo seleccionado: '+file.name+'. Se guardará al confirmar el pedido.';}
  catch(error){e.target.value='';$('#receipt-selection').textContent=error.message;}
});
const sales=document.createElement('section');sales.className='sales-panel surface';sales.innerHTML='<h2>Mis ventas de prueba</h2><p>Pedidos de este navegador. Probá cómo una finca revisaría un pago; ninguna acción confirma dinero real.</p><div id="sales-list"></div>';
$('#sell-view').append(sales);
window.renderSales=function(){
 const live=state.orders.filter(o=>!o.cancelled);
 $('#sales-list').innerHTML=live.length?live.map(o=>`<article class="sale-row"><h3>${esc(o.code)} · ${money(o.total)}</h3><p>${o.items.map(i=>esc(i.name)+' · '+i.qty+' kg').join(', ')}</p><p><strong>${paymentLabel(o)}</strong></p>${o.payment?.method==='sinpe'&&o.payment.receipt?`<div class="order-actions"><button class="button outline" data-download="${esc(o.id)}">Ver archivo</button><button class="button" data-verify="${esc(o.id)}">Simular abono verificado</button><button class="button outline" data-reject="${esc(o.id)}">Simular rechazo</button></div><p class="fine">En una venta real, revisá el abono en tu cuenta bancaria. Una imagen por sí sola no comprueba el pago.</p>`:o.payment?.method==='pickup'&&o.payment.status!=='verified'?`<button class="button" data-verify="${esc(o.id)}">Simular pago recibido al retirar</button>`:''}</article>`).join(''):'<p>Todavía no hay pedidos. Hacé una compra de prueba para ver el recorrido de venta aquí.</p>';
};
const cancelDialog=document.createElement('dialog');cancelDialog.id='cancel-order-dialog';cancelDialog.setAttribute('aria-labelledby','cancel-order-title');cancelDialog.innerHTML='<h2 id="cancel-order-title">¿Cancelar este pedido de prueba?</h2><p>Los kilos reservados volverán al catálogo. El comprobante local se eliminará. No hay dinero que reembolsar.</p><div class="actions"><button class="button outline close-dialog">Conservar pedido</button><button class="button" id="cancel-order-confirm">Cancelar pedido</button></div><p class="form-error" role="alert" id="cancel-error"></p>';document.body.append(cancelDialog);
let cancelOrderId=null;
$('#cancel-order-confirm').addEventListener('click',async()=>{
 const order=state.orders.find(o=>o.id===cancelOrderId);if(!order||order.cancelled||order.step>=3)return;
 try{await AgroReceipts.remove(order.id);order.cancelled=true;if(order.payment)delete order.payment.receipt;save();renderAll();cancelDialog.close();toast('Pedido cancelado. Los kilos vuelven al catálogo.');}catch(error){$('#cancel-error').textContent=error.message;}
});
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.upload){const order=state.orders.find(o=>o.id===b.dataset.upload);if(!order||order.cancelled||order.payment?.method!=='sinpe')return;receiptOrderId=order.id;$('#receipt-form').reset();$('#order-receipt-error').textContent='';$('#receipt-dialog').showModal();}
 if(b.dataset.download){try{const file=await AgroReceipts.get(b.dataset.download);if(!file)throw new Error('No encontramos el archivo en este navegador. Podés adjuntarlo otra vez.');const link=document.createElement('a');const url=URL.createObjectURL(file);link.href=url;link.download=file.name||'comprobante';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(error){toast(error.message);}}
 if(b.dataset.cancel){cancelOrderId=b.dataset.cancel;$('#cancel-error').textContent='';cancelDialog.showModal();}
 const id=b.dataset.verify||b.dataset.reject;
 if(id){const o=state.orders.find(o=>o.id===id);if(!o||o.cancelled||!o.payment)return;if(o.payment.method==='sinpe'&&!o.payment.receipt)return;o.payment.status=b.dataset.verify?'verified':'rejected';save();renderOrders();renderSales();toast('Estado de pago actualizado solo en la simulación.');}
});
$('#receipt-form').addEventListener('submit',async e=>{
 e.preventDefault();const order=state.orders.find(o=>o.id===receiptOrderId);if(!order||order.cancelled)return;
 const button=e.target.querySelector('button[type=submit]');button.disabled=true;
 try{const file=$('#order-receipt').files[0];await AgroReceipts.put(order.id,file);order.payment.receipt={name:file.name,type:file.type,size:file.size};order.payment.status='pending';save();renderOrders();renderSales();$('#receipt-dialog').close();toast('Comprobante guardado en este dispositivo. Pago pendiente de revisión.');}
 catch(error){$('#order-receipt-error').textContent=error.message;}finally{button.disabled=false;}
});
updatePaymentPanels();renderSales();
