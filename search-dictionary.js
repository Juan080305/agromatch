(function (root) {
  const groups = [
    ['aguacate', 'aguacates', 'palta', 'paltas'],
    ['chayote', 'chayotes', 'güisquil', 'güisquiles', 'huisquil', 'huisquiles', 'pataste', 'patastes'],
    ['vainica', 'vainicas', 'ejote', 'ejotes', 'poroto verde', 'porotos verdes'],
    ['yuca', 'yucas', 'mandioca', 'mandiocas'],
    ['papa', 'papas', 'patata', 'patatas'],
    ['camote', 'camotes', 'batata', 'batatas', 'boniato', 'boniatos']
  ];
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const aliases = groups.flatMap(g => g.map(a => [normalize(a), normalize(g[0])])).sort((a,b)=>b[0].length-a[0].length);
  function canonical(value) {
    let result = ' ' + normalize(value) + ' ';
    for (const [alias, target] of aliases) result = result.replace(new RegExp('(^| )'+alias+'(?= |$)', 'g'), '$1'+target);
    return result.trim();
  }
  function matches(product, query) {
    const q = canonical(query); if (!q) return true;
    const text = canonical([product.name, product.farm, product.province, product.description].join(' '));
    const words = text.split(' ');
    return q.split(' ').every(token => words.some(word => word === token || (token.length >= 3 && word.startsWith(token))));
  }
  const api = {groups, normalize, canonical, matches};
  root.AgroSearch = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
