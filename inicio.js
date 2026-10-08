document.documentElement.classList.add('js');
const siteNav=document.querySelector('.site-nav');
const navLinks=siteNav.querySelector('nav');navLinks.id='main-navigation';
const menu=document.createElement('button');menu.type='button';menu.className='mobile-menu-toggle';menu.textContent='Menú';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-controls','main-navigation');siteNav.insertBefore(menu,navLinks);
function closeMenu(){siteNav.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=siteNav.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));});navLinks.addEventListener('click',closeMenu);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const publishedURL=location.origin+location.pathname.replace(/[^/]*$/,'');
const share=document.createElement('div');share.className='share-actions';
const wa=document.createElement('a');wa.className='button';wa.href='https://wa.me/?text='+encodeURIComponent('Conocé AgroMatch: conectamos el campo con nuevas oportunidades. '+publishedURL);wa.target='_blank';wa.rel='noopener noreferrer';wa.textContent='Compartir por WhatsApp';share.append(wa);
const copy=document.createElement('button');copy.type='button';copy.className='button outline';copy.textContent='Copiar enlace';share.append(copy);
if(navigator.share){const native=document.createElement('button');native.type='button';native.className='button outline';native.textContent='Compartir';native.addEventListener('click',()=>navigator.share({title:document.title,text:'Conocé AgroMatch: conectamos el campo con nuevas oportunidades.',url:publishedURL}).catch(()=>{}));share.insertBefore(native,copy);}
const shareStatus=document.createElement('span');shareStatus.className='share-status';shareStatus.setAttribute('role','status');share.append(shareStatus);
copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(publishedURL);shareStatus.textContent='Enlace copiado';}catch{shareStatus.textContent=publishedURL;}});
document.querySelector('footer').prepend(share);
const chapters=[...document.querySelectorAll('[data-chapter]')];
const stops=[...document.querySelectorAll('[data-story]')];
chapters.forEach((chapter,i)=>{chapter.id='cosecha-'+i;chapter.classList.add('in-view');});
let scrollFrame=0;
function updateHarvest(){
 scrollFrame=0;
 const focus=innerHeight*.65;
 let current=0;
 chapters.forEach((chapter,i)=>{
  const rect=chapter.getBoundingClientRect();
  const fill=Math.max(0,Math.min(1,(focus-rect.top)/Math.max(1,rect.height*.65)));
  stops[i].style.setProperty('--harvest-fill',(fill*100)+'%');
  if(rect.top<focus)current=i;
 });
 stops.forEach((stop,i)=>{stop.classList.toggle('current',i===current);if(i===current)stop.setAttribute('aria-current','step');else stop.removeAttribute('aria-current');});
 document.querySelector('#chapter-label').textContent=chapters[current].dataset.chapter;
}
stops.forEach((stop,i)=>stop.addEventListener('click',()=>chapters[i].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'})));
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateHarvest);},{passive:true});addEventListener('resize',updateHarvest);updateHarvest();
document.querySelectorAll('[data-device]').forEach(btn=>btn.addEventListener('click',()=>{const d=btn.dataset.device;document.querySelectorAll('[data-device]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});document.querySelector('#phone').className='phone '+d;const frame=document.querySelector('#app-preview');frame.src='mercado.html?dispositivo='+d+'&incrustado=1';frame.title='Prototipo interactivo de AgroMatch para '+(d==='ios'?'iPhone':'Android');document.querySelector('#open-mobile').href='mercado.html?dispositivo='+d;}));
