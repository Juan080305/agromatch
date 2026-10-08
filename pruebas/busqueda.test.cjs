const {test}=require('node:test');
const assert=require('node:assert/strict');
const search=require('../diccionario-busqueda.js');
test('equivalencias bidireccionales, plurales y tildes',()=>{
 for(const [left,right] of [['aguacate','palta'],['chayote','güisquil'],['vainica','ejote'],['yuca','mandioca'],['papa','patata'],['camote','boniato']]){
  assert(search.matches({name:left},right));assert(search.matches({name:right},left));
 }
 assert(search.matches({name:'Aguacate Hass'},' PÁLTAS hass '));
 assert(search.matches({name:'Güisquiles frescos'},'chayotes'));
 assert(search.matches({name:'Vainica fina'},'porotos verdes'));
});
test('conserva variedad y evita equivalencias agrícolas ambiguas',()=>{
 assert(!search.matches({name:'Aguacate criollo'},'palta hass'));
 assert(!search.matches({name:'Banano maduro'},'plátano'));
 assert(!search.matches({name:'Camote'},'papa'));
 assert(!search.matches({name:'Vainica'},'frijol'));
 assert(!search.matches({name:'Palta'},'palto'));
});
test('consultas parciales y varios términos',()=>{
 assert(search.matches({name:'Tomate de temporada',province:'Cartago'},'tom cartago'));
 assert(!search.matches({name:'Tomate',province:'Cartago'},'tom alajuela'));
});
test('plurales comunes fuera de las equivalencias',()=>{
 assert(search.matches({name:'Tomate de temporada'},'tomates'));
 assert(search.matches({name:'Limón mandarina'},'limones'));
 assert(search.matches({name:'Zanahoria fresca'},'zanahorias frescas'));
 assert(!search.matches({name:'Tomatillo'},'tomates'));
});
