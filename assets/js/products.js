/* products.html: sidebar filters, sort, grid/list view, pagination */
(function () {
  'use strict';
  var esc = Utils.esc;
  var PER_PAGE = 9;
  var state = Listing.stateFromUrl();
  var view = Store.Storage.get('brand_view_v1', 'grid');
  var showAllCats = false, showAllBrands = false;

  /* ----- static controls ----- */
  $('#sort').innerHTML = Listing.SORTS.map(function (s) { return '<option value="' + s.id + '">' + s.label + '</option>'; }).join('');
  var range = $('#f-range');
  range.max = Listing.PRICE_CAP;

  function counts(key) {
    var c = {};
    CATALOG.products.forEach(function (p) { c[p[key]] = (c[p[key]] || 0) + 1; });
    return c;
  }

  /* ----- sidebar lists ----- */
  function renderSidebar() {
    var cc = counts('category');
    var cats = CATALOG.categories.slice();
    var shown = showAllCats ? cats : cats.slice(0, 5);
    // make sure an active category is always visible
    if (!showAllCats && state.category && !shown.some(function (c) { return c.id === state.category; })) shown.push(CATALOG.categories.filter(function (c) { return c.id === state.category; })[0]);
    $('#f-cat-list').innerHTML = '<li><button type="button" class="w-full py-1 text-left hover:text-primary ' + (!state.category ? 'font-semibold text-primary' : '') + '" data-cat="">All categories</button></li>' +
      shown.filter(Boolean).map(function (c) {
        var on = state.category === c.id;
        return '<li><button type="button" class="flex w-full justify-between py-1 text-left hover:text-primary ' + (on ? 'font-semibold text-primary' : '') + '" data-cat="' + c.id + '"' + (on ? ' aria-current="true"' : '') + '><span>' + esc(c.name) + '</span><span class="text-xs text-gray-400">' + (cc[c.id] || 0) + '</span></button></li>';
      }).join('');
    $('#f-cat-more').textContent = showAllCats ? 'Show less' : 'See all';

    var bc = counts('brand');
    var brands = CATALOG.brands;
    var bshown = showAllBrands ? brands : brands.slice(0, 5);
    state.brands.forEach(function (b) { if (bshown.indexOf(b) === -1) bshown = bshown.concat(b); });
    $('#f-brand-list').innerHTML = bshown.map(function (b, i) {
      var id = 'brand-' + b.replace(/[^a-z0-9]/gi, '');
      return '<li><label class="flex cursor-pointer items-center gap-2" for="' + id + '"><input id="' + id + '" type="checkbox" class="h-4 w-4 accent-primary" data-brand="' + esc(b) + '"' + (state.brands.indexOf(b) > -1 ? ' checked' : '') + '><span class="flex-1">' + esc(b) + '</span><span class="text-xs text-gray-400">' + bc[b] + '</span></label></li>';
    }).join('');
    $('#f-brand-more').textContent = showAllBrands ? 'Show less' : 'See all';
    $('#f-brand-more').classList.toggle('hidden', brands.length <= 5);

    $('#f-rate-list').innerHTML = [0, 4, 3].map(function (r) {
      var id = 'rate-' + r;
      return '<li><label class="flex cursor-pointer items-center gap-2" for="' + id + '"><input id="' + id + '" type="radio" name="rating" class="h-4 w-4 accent-primary" value="' + r + '"' + (state.rating === r ? ' checked' : '') + '>' +
        (r ? Utils.stars(r) + '<span class="text-sm text-gray-500">& up</span>' : '<span>Any rating</span>') + '</label></li>';
    }).join('');

    range.value = state.max || Listing.PRICE_CAP;
    $('#f-min').value = state.min || '';
    $('#f-max').value = state.max || '';
    $('#f-deals').checked = state.deals;
    $('#sort').value = state.sort;
  }

  /* ----- results ----- */
  function render() {
    var list = Listing.filter(state);
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (state.page > pages) state.page = pages;
    var from = (state.page - 1) * PER_PAGE, slice = list.slice(from, from + PER_PAGE);

    var catName = state.category ? CATALOG.categoryName(state.category) : '';
    $('#results-title').innerHTML = '<strong>' + list.length + '</strong> ' + (list.length === 1 ? 'item' : 'items') + ' in <strong>' + esc(catName || 'all categories') + '</strong>' + (state.q ? ' for “' + esc(state.q) + '”' : '');
    document.title = (catName || 'Products') + ' | Brand';
    var crumb = $('#crumb-cat');
    crumb.classList.toggle('hidden', !catName); crumb.classList.toggle('flex', !!catName);
    crumb.querySelector('span').textContent = catName;

    var grid = $('#results');
    grid.className = 'mt-4 grid gap-4 ' + (view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1');
    if (!list.length) {
      grid.innerHTML = UI.empty('No products found', state.category && !CATALOG.products.some(function (p) { return p.category === state.category; })
        ? 'There are no products in this category yet. Try another category.'
        : 'Try removing a filter or searching for something else.', '<button type="button" class="btn-primary" data-clear-all>Clear all filters</button>');
    } else {
      grid.innerHTML = slice.map(view === 'grid' ? UI.card : UI.listCard).join('');
    }

    /* active filter chips */
    var chips = Listing.chips(state);
    $('#chips').innerHTML = chips.map(function (c, i) {
      return '<button type="button" class="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-1 text-sm text-primary hover:bg-primary-light" data-chip="' + i + '">' + esc(c.label) + ' <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i><span class="sr-only">Remove filter</span></button>';
    }).join('') + (chips.length > 1 ? '<button type="button" class="text-sm text-primary hover:underline" data-clear-all>Clear all</button>' : '');
    $('#chips')._chips = chips;

    /* pagination */
    var pager = $('#pager');
    if (pages <= 1) { pager.innerHTML = ''; }
    else {
      var html = '<button type="button" class="btn-ghost border border-gray-300 !px-3" data-goto="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Previous page"><i class="fa-solid fa-angle-left"></i></button>';
      for (var i = 1; i <= pages; i++) {
        html += '<button type="button" class="h-9 w-9 rounded-md border text-sm ' + (i === state.page ? 'border-primary bg-primary-light font-semibold text-primary' : 'border-gray-300 bg-white hover:bg-gray-100') + '" data-goto="' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + ' aria-label="Page ' + i + '">' + i + '</button>';
      }
      html += '<button type="button" class="btn-ghost border border-gray-300 !px-3" data-goto="' + (state.page + 1) + '"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Next page"><i class="fa-solid fa-angle-right"></i></button>';
      pager.innerHTML = html;
    }

    $('#view-grid').setAttribute('aria-pressed', String(view === 'grid'));
    $('#view-list').setAttribute('aria-pressed', String(view === 'list'));
    $('#view-grid').className = 'px-3 py-1.5 ' + (view === 'grid' ? 'bg-primary-light text-primary' : 'text-gray-500');
    $('#view-list').className = 'border-l border-gray-300 px-3 py-1.5 ' + (view === 'list' ? 'bg-primary-light text-primary' : 'text-gray-500');

    Listing.stateToUrl(state);
  }

  function update(resetPage) {
    if (resetPage !== false) state.page = 1;
    renderSidebar(); render();
  }

  /* ----- events ----- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-cat]'))) { state.category = t.getAttribute('data-cat'); update(); closeFilters(); return; }
    if ((t = e.target.closest('[data-goto]')) && !t.disabled) { state.page = parseInt(t.getAttribute('data-goto'), 10); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if ((t = e.target.closest('[data-chip]'))) { $('#chips')._chips[+t.getAttribute('data-chip')].clear(state); update(); return; }
    if (e.target.closest('[data-clear-all]') || e.target.closest('#f-clear')) { Listing.reset(state); update(); return; }
  });
  $('#f-cat-more').addEventListener('click', function () { showAllCats = !showAllCats; renderSidebar(); });
  $('#f-brand-more').addEventListener('click', function () { showAllBrands = !showAllBrands; renderSidebar(); });
  $('#f-brand-list').addEventListener('change', function (e) {
    var b = e.target.getAttribute('data-brand'); if (!b) return;
    state.brands = e.target.checked ? state.brands.concat(b) : state.brands.filter(function (v) { return v !== b; });
    update();
  });
  $('#f-rate-list').addEventListener('change', function (e) { state.rating = parseInt(e.target.value, 10) || 0; update(); });
  $('#f-deals').addEventListener('change', function (e) { state.deals = e.target.checked; update(); });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; update(); });
  $('#view-grid').addEventListener('click', function () { view = 'grid'; Store.Storage.set('brand_view_v1', view); render(); });
  $('#view-list').addEventListener('click', function () { view = 'list'; Store.Storage.set('brand_view_v1', view); render(); });

  range.addEventListener('input', function () { $('#f-max').value = range.value >= Listing.PRICE_CAP ? '' : range.value; });
  $('#f-apply').addEventListener('click', function () {
    var min = parseFloat($('#f-min').value) || 0, max = parseFloat($('#f-max').value) || 0, err = $('#f-price-err');
    if (min < 0 || max < 0 || (max && min > max)) { err.textContent = 'Min price cannot be higher than max price.'; err.classList.remove('hidden'); return; }
    err.classList.add('hidden');
    state.min = min; state.max = max; update(); closeFilters();
  });
  range.addEventListener('change', function () { $('#f-apply').click(); });

  /* mobile filter panel */
  function openFilters() { $('#filters').classList.remove('hidden'); document.body.classList.add('overflow-hidden'); }
  function closeFilters() { if (window.matchMedia('(min-width: 992px)').matches) return; $('#filters').classList.add('hidden'); document.body.classList.remove('overflow-hidden'); }
  $('#filters-open').addEventListener('click', openFilters);
  $('#filters-close').addEventListener('click', closeFilters);
  $('#filters-show').addEventListener('click', closeFilters);
  window.addEventListener('resize', function () { if (window.matchMedia('(min-width: 992px)').matches) document.body.classList.remove('overflow-hidden'); });

  update(false);
})();
