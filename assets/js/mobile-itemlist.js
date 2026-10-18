/* mobile-itemlist.html: list/grid, sort, filter sheet, Load more */
(function () {
  'use strict';
  var esc = Utils.esc, STEP = 8;
  var state = Listing.stateFromUrl();
  var shown = STEP, view = 'list';

  $('#m-sort').innerHTML = Listing.SORTS.map(function (s) { return '<option value="' + s.id + '">' + s.label + '</option>'; }).join('');
  $('#s-cat').innerHTML = '<option value="">All categories</option>' + CATALOG.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('');
  $('#s-brands').innerHTML = CATALOG.brands.map(function (b) { return '<label class="flex items-center gap-2"><input type="checkbox" class="h-4 w-4 accent-primary" value="' + esc(b) + '"> ' + esc(b) + '</label>'; }).join('');

  function render() {
    var list = Listing.filter(state), slice = list.slice(0, shown);
    var catName = state.category ? CATALOG.categoryName(state.category) : 'all categories';
    $('#m-count').innerHTML = '<strong>' + list.length + '</strong> ' + (list.length === 1 ? 'item' : 'items') + ' in <strong>' + esc(catName) + '</strong>' + (state.q ? ' for “' + esc(state.q) + '”' : '');
    var box = $('#m-results');
    if (!list.length) box.innerHTML = '<div class="grid">' + UI.empty('No products found', 'Try removing a filter or searching for something else.', '<button type="button" class="btn-primary" data-clear>Clear all filters</button>') + '</div>';
    else box.innerHTML = view === 'list' ? slice.map(UI.mobileRow).join('') : '<div class="mt-3 grid grid-cols-2 gap-2">' + slice.map(UI.card).join('') + '</div>';
    $('#m-more').classList.toggle('hidden', slice.length >= list.length);
    $('#m-more').textContent = 'Load more (' + (list.length - slice.length) + ' left)';
    var chips = Listing.chips(state);
    $('#m-chips').innerHTML = chips.map(function (c, i) { return '<button type="button" class="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs text-primary" data-chip="' + i + '">' + esc(c.label) + ' <i class="fa-solid fa-xmark" aria-hidden="true"></i><span class="sr-only">Remove filter</span></button>'; }).join('');
    $('#m-chips')._chips = chips;
    $('#m-sort').value = state.sort;
    var v = $('#m-view'); v.innerHTML = '<i class="fa-solid ' + (view === 'list' ? 'fa-table-cells-large' : 'fa-list') + '"></i>'; v.setAttribute('aria-label', view === 'list' ? 'Switch to grid view' : 'Switch to list view');
    Listing.stateToUrl(state);
  }
  function update() { shown = STEP; render(); }

  $('#m-sort').addEventListener('change', function (e) { state.sort = e.target.value; update(); });
  $('#m-view').addEventListener('click', function () { view = view === 'list' ? 'grid' : 'list'; render(); });
  $('#m-more').addEventListener('click', function () { shown += STEP; render(); });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-chip]'); if (c) { $('#m-chips')._chips[+c.getAttribute('data-chip')].clear(state); update(); }
    if (e.target.closest('[data-clear]')) { Listing.reset(state); update(); }
  });

  /* filter sheet */
  function openSheet() {
    $('#s-cat').value = state.category; $('#s-min').value = state.min || ''; $('#s-max').value = state.max || ''; $('#s-rate').value = String(state.rating); $('#s-deals').checked = state.deals;
    $$('#s-brands input').forEach(function (i) { i.checked = state.brands.indexOf(i.value) > -1; });
    $('#sheet').classList.remove('hidden'); document.body.classList.add('overflow-hidden');
  }
  function closeSheet() { $('#sheet').classList.add('hidden'); document.body.classList.remove('overflow-hidden'); }
  $('#m-filter-open').addEventListener('click', openSheet);
  $$('[data-sheet-close]').forEach(function (b) { b.addEventListener('click', closeSheet); });
  $('#s-clear').addEventListener('click', function () { Listing.reset(state); closeSheet(); update(); });
  $('#s-apply').addEventListener('click', function () {
    var min = parseFloat($('#s-min').value) || 0, max = parseFloat($('#s-max').value) || 0;
    if (min < 0 || max < 0 || (max && min > max)) { $('#s-err').textContent = 'Min price cannot be higher than max price.'; $('#s-err').classList.remove('hidden'); return; }
    $('#s-err').classList.add('hidden');
    state.category = $('#s-cat').value; state.min = min; state.max = max; state.rating = parseInt($('#s-rate').value, 10) || 0; state.deals = $('#s-deals').checked;
    state.brands = $$('#s-brands input').filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
    closeSheet(); update();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  render();
})();
