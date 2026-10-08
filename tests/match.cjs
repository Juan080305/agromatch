const {chromium,devices}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.AGRO_TEST_URL||'http://127.0.0.1:8766/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.AGRO_BROWSER_CHANNEL||'msedge'});
 try{
  const context=await browser.newContext({...devices['iPhone 13']});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'market.html?view=match');
  assert.equal(await page.locator('#match-view').isVisible(),true);
  assert.match(await page.locator('#request-list').textContent(),/primera solicitud/);

  await page.locator('#request-form [name=product]').fill('tomates');
  await page.locator('#request-form [name=kg]').fill('200');
  await page.locator('#request-form [name=maxPrice]').fill('600');
  await page.locator('#request-form button[type=submit]').click();
  const card=page.locator('.request-card').first();
  assert.match(await card.locator('h3').textContent(),/200 kg de tomates/);
  assert.equal(await card.locator('.match-row').count(),2);
  assert.match(await card.locator('.match-row').first().textContent(),/Tomate para procesamiento/);
  assert.equal(await card.locator('.match-state').textContent(),'Tenés match');
  assert.match(await card.locator('.match-row').nth(1).textContent(),/sobre tu máximo/);

  await card.locator('[data-match-add]').first().click();
  assert.equal(await page.locator('#cart-count').textContent(),'1');
  assert.match(await card.locator('.match-row').first().textContent(),/Cubre 60 de 200 kg/);

  await page.locator('#request-form [name=product]').fill('palta');
  await page.locator('#request-form [name=kg]').fill('20');
  await page.locator('#request-form [name=province]').selectOption('Alajuela');
  await page.locator('#request-form button[type=submit]').click();
  const palta=page.locator('.request-card').first();
  assert.match(await palta.textContent(),/Aguacate Hass/);
  assert.equal(await palta.locator('.match-state').textContent(),'Match parcial');
  assert.match(await palta.textContent(),/fuera de Alajuela/);

  await page.locator('#request-form [name=product]').fill('güisquil');
  await page.locator('#request-form button[type=submit]').click();
  assert.equal(await page.locator('.request-card').first().locator('.match-state').textContent(),'Sin lotes todavía');
  assert.equal(await page.locator('.request-card').first().locator('.match-row').count(),0);

  await page.reload();await page.locator('.bottom-nav [data-view=match]').click();
  assert.equal(await page.locator('.request-card').count(),3);

  await page.locator('.bottom-nav [data-view=sell]').click();
  assert.ok(await page.locator('.demand-row').count()>=9);
  const chayote=page.locator('.demand-row',{hasText:'chayote'}).first();
  await chayote.locator('[data-fill-request]').click();
  assert.equal(await page.locator('#sell-form [name=name]').inputValue(),'Chayote');
  assert.equal(await page.locator('#sell-form [name=province]').inputValue(),'Limón');
  assert.equal(await page.locator('#sell-form [name=stock]').inputValue(),'30');
  await page.locator('#sell-form [name=farm]').fill('Finca de prueba');
  await page.locator('#sell-form [name=description]').fill('Chayote tierno de prueba.');
  await page.locator('#sell-form button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('calza con'));
  assert.match(await page.locator('.demand-row',{hasText:'Cocina Caribeña'}).textContent(),/Calza con tu lote «Chayote»/);

  await page.locator('.bottom-nav [data-view=match]').click();
  const guisquil=page.locator('.request-card',{hasText:'güisquil'});
  assert.match(await guisquil.textContent(),/Chayote/);

  await page.goto(base+'market.html');
  await page.locator('#search').fill('culantro');
  await page.locator('[data-request-from-search]').click();
  assert.equal(await page.locator('#match-view').isVisible(),true);
  assert.equal(await page.locator('#request-form [name=product]').inputValue(),'culantro');

  for(const width of [320,360,390,768,1280]){
   await page.setViewportSize({width,height:860});
   for(const view of ['match','sell']){await page.evaluate(v=>setView(v),view);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${view} ${width}`);}
  }
  await page.evaluate(()=>document.querySelector('.reading-toggle').click());
  await page.setViewportSize({width:320,height:700});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow large text 320');
  assert.equal(await page.evaluate(()=>{const n=document.querySelector('.bottom-nav');return n.scrollWidth>n.clientWidth;}),false,'bottom nav fits');

  await page.locator('#reset-demo').evaluate(b=>b.click());await page.locator('#confirm-reset').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('eliminados'));
  await page.evaluate(()=>setView('match'));
  assert.equal(await page.locator('.request-card').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: match requests, partial and empty matches, add from match, persistence, seller demand prefill, search to request, widths, large text, reset.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
