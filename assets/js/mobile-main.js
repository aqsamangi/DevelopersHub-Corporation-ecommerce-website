/* mobile-main.html */
(function () {
  'use strict';
  var esc = Utils.esc;
  $('#m-chips').innerHTML = '<li><a class="block whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-sm text-white" href="mobile-itemlist.html">All</a></li>' +
    CATALOG.categories.map(function (c) { return '<li><a class="block whitespace-nowrap rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-600" href="mobile-itemlist.html?category=' + c.id + '">' + esc(c.name) + '</a></li>'; }).join('');

  $('#m-deals-list').innerHTML = CATALOG.deals.map(function (d) {
    var p = CATALOG.byId(d.id);
    return '<li class="w-32 shrink-0"><a href="' + UI.link(p) + '" class="block rounded-md border border-gray-200 p-2 text-center"><img src="' + p.image + '" alt="' + esc(p.name) + '" width="112" height="112" loading="lazy" class="mx-auto h-24 w-24 object-contain"><span class="mt-1 block text-sm">' + esc(d.label) + '</span><span class="tag-off mt-1 !px-2 !py-0.5">-' + d.off + '%</span></a></li>';
  }).join('');

  function ids(list) { return list.map(function (id) { return UI.mobileTile(CATALOG.byId(id)); }).join(''); }
  $('#m-home-grid').innerHTML = ids([19, 20, 21, 18]);
  $('#m-elec-grid').innerHTML = ids([11, 13, 15, 8]);
  $('#m-rec-grid').innerHTML = ids([1, 2, 3, 4, 5, 7, 16, 22]);

  var deadline = Number(Store.Storage.get('brand_deal_deadline_v1', 0));
  if (!deadline || deadline < Date.now()) { deadline = Date.now() + 10 * 864e5; Store.Storage.set('brand_deal_deadline_v1', deadline); }
  function tick() {
    var l = Math.max(0, deadline - Date.now()), pad = function (n) { return String(n).padStart(2, '0'); };
    $('#m-timer').textContent = Math.floor(l / 864e5) + 'd ' + pad(Math.floor(l % 864e5 / 36e5)) + ':' + pad(Math.floor(l % 36e5 / 6e4)) + ':' + pad(Math.floor(l % 6e4 / 1e3));
  }
  tick(); setInterval(tick, 1000);
})();
