/*
 * Shared search / filter / sort logic for products.html and mobile-itemlist.html.
 * A "state" object looks like:
 *   { q, category, brands: [], min, max, rating, deals, tag, sort, page }
 */
(function (global) {
  'use strict';

  var SORTS = [
    { id: 'featured', label: 'Best match' },
    { id: 'price-asc', label: 'Price: low to high' },
    { id: 'price-desc', label: 'Price: high to low' },
    { id: 'rating', label: 'Top rated' },
    { id: 'popular', label: 'Most popular' },
    { id: 'discount', label: 'Biggest discount' }
  ];
  var PRICE_CAP = Math.ceil(Math.max.apply(null, CATALOG.products.map(function (p) { return p.price; })) / 10) * 10; // 340 -> 340

  function discountPct(p) { return p.oldPrice > p.price ? (p.oldPrice - p.price) / p.oldPrice : 0; }

  function stateFromUrl() {
    var Q = Store.Query;
    var sort = Q.get('sort', 'featured');
    var min = parseFloat(Q.get('min', '')), max = parseFloat(Q.get('max', ''));
    return {
      q: Q.get('q', ''),
      category: Q.get('category', ''),
      brands: (Q.get('brands', '') || '').split(',').filter(Boolean),
      min: isFinite(min) && min > 0 ? min : 0,
      max: isFinite(max) && max > 0 ? max : 0,
      rating: parseInt(Q.get('rating', '0'), 10) || 0,
      deals: Q.get('deals', '') === '1',
      tag: Q.get('tag', ''),
      sort: SORTS.some(function (s) { return s.id === sort; }) ? sort : 'featured',
      page: Math.max(1, parseInt(Q.get('page', '1'), 10) || 1)
    };
  }

  function stateToUrl(s) {
    Store.Query.set({
      q: s.q, category: s.category, brands: s.brands.join(','), min: s.min || '', max: s.max || '',
      rating: s.rating || '', deals: s.deals ? '1' : '', tag: s.tag, sort: s.sort === 'featured' ? '' : s.sort, page: s.page > 1 ? s.page : ''
    });
  }

  function filter(s) {
    var terms = s.q.toLowerCase().split(/\s+/).filter(Boolean);
    var list = CATALOG.products.filter(function (p) {
      if (s.category && p.category !== s.category) return false;
      if (s.brands.length && s.brands.indexOf(p.brand) === -1) return false;
      if (s.min && p.price < s.min) return false;
      if (s.max && p.price > s.max) return false;
      if (s.rating && p.rating < s.rating) return false;
      if (s.deals && !(p.oldPrice > p.price)) return false;
      if (s.tag === 'gift' && !p.gift) return false;
      if (terms.length) {
        var hay = [p.name, p.brand, p.type, p.material, p.design, CATALOG.categoryName(p.category), p.desc].join(' ').toLowerCase();
        for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) === -1) return false;
      }
      return true;
    });
    var by = {
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      'rating': function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
      'popular': function (a, b) { return b.orders - a.orders; },
      'discount': function (a, b) { return discountPct(b) - discountPct(a); }
    }[s.sort];
    if (by) list = list.slice().sort(by);
    return list;
  }

  // human-readable list of active filters: [{label, clear: fn(state)}]
  function chips(s) {
    var out = [];
    if (s.q) out.push({ label: 'Search: “' + s.q + '”', clear: function (x) { x.q = ''; } });
    if (s.category) out.push({ label: CATALOG.categoryName(s.category), clear: function (x) { x.category = ''; } });
    s.brands.forEach(function (b) { out.push({ label: b, clear: function (x) { x.brands = x.brands.filter(function (v) { return v !== b; }); } }); });
    if (s.min || s.max) out.push({ label: 'Price: $' + (s.min || 0) + ' – ' + (s.max ? '$' + s.max : 'any'), clear: function (x) { x.min = 0; x.max = 0; } });
    if (s.rating) out.push({ label: s.rating + '★ & up', clear: function (x) { x.rating = 0; } });
    if (s.deals) out.push({ label: 'Hot offers', clear: function (x) { x.deals = false; } });
    if (s.tag === 'gift') out.push({ label: 'Gift ideas', clear: function (x) { x.tag = ''; } });
    return out;
  }

  function reset(s) { s.q = ''; s.category = ''; s.brands = []; s.min = 0; s.max = 0; s.rating = 0; s.deals = false; s.tag = ''; s.page = 1; }

  global.Listing = { SORTS: SORTS, PRICE_CAP: PRICE_CAP, stateFromUrl: stateFromUrl, stateToUrl: stateToUrl, filter: filter, chips: chips, reset: reset };
})(window);
