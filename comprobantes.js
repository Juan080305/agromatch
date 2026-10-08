window.AgroReceipts = (() => {
  function db() { return new Promise((resolve,reject) => {
    const req = indexedDB.open('agromatch-receipts',1);
    req.onupgradeneeded = () => req.result.createObjectStore('receipts');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(new Error('No pudimos abrir el almacenamiento del comprobante.'));
  }); }
  async function action(mode, key, value) {
    const database = await db();
    return new Promise((resolve,reject) => {
      const tx=database.transaction('receipts',mode==='get'?'readonly':'readwrite');
      const store=tx.objectStore('receipts');
      const req=mode==='put'?store.put(value,key):mode==='clear'?store.clear():mode==='delete'?store.delete(key):store.get(key);
      tx.oncomplete=()=>{database.close();resolve(req.result);};
      tx.onerror=()=>{database.close();reject(new Error('No se pudo guardar el comprobante. Puede que falte espacio.'));};
    });
  }
  async function validate(file) {
    if (!file || !file.size || file.size>5*1024*1024) throw new Error('Elegí una imagen JPG, PNG o PDF de hasta 5 MB.');
    const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
    const png=[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
    const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
    const pdf=String.fromCharCode(...bytes.slice(0,5))==='%PDF-';
    if (!(png&&file.type==='image/png'&&/\.png$/i.test(file.name)||jpg&&file.type==='image/jpeg'&&/\.jpe?g$/i.test(file.name)||pdf&&file.type==='application/pdf'&&/\.pdf$/i.test(file.name))) throw new Error('El archivo debe ser una imagen JPG, PNG o un PDF válido.');
    return file;
  }
  return {validate, put:async(id,file)=>{await validate(file);return action('put',id,file);},get:id=>action('get',id),remove:id=>action('delete',id),clear:()=>action('clear')};
})();
