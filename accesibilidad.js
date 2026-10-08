(() => {
  const control=document.createElement('button');control.className='reading-toggle';control.type='button';control.textContent='A+ Texto grande';control.setAttribute('aria-label','Activar texto grande');
  function apply(active){document.body.classList.toggle('large-text',active);control.setAttribute('aria-pressed',String(active));control.textContent=active?'A− Texto normal':'A+ Texto grande';control.setAttribute('aria-label',active?'Volver al tamaño de texto normal':'Activar texto grande');}
  try{apply(localStorage.getItem('agromatch-large-text')==='true');}catch{apply(false);}
  control.addEventListener('click',()=>{const active=!document.body.classList.contains('large-text');apply(active);try{localStorage.setItem('agromatch-large-text',String(active));}catch{}});
  (document.querySelector('.demo-bar')||document.querySelector('footer')).append(control);
})();
