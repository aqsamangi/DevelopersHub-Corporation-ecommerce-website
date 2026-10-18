/* Home page: renders the data-driven sections of index.html */
(function () {
  'use strict';
  var esc = Utils.esc, price = Utils.price;

  /* sidebar categories */
  $('#side-cats').innerHTML = CATALOG.categories.map(function (c) {
    return '<li><a class="block rounded px-3 py-2.5 hover:bg-primary-light hover:text-primary" href="products.html?category=' + c.id + '">' + esc(c.name) + '</a></li>';
  }).join('') + '<li><a class="block rounded px-3 py-2.5 text-primary hover:bg-primary-light" href="products.html">More category</a></li>';

  /* deals strip */
  $('#deals').innerHTML = CATALOG.deals.map(function (d) {
    var p = CATALOG.byId(d.id);
    return '<li class="border-b border-r border-gray-200 last:border-r-0 lg:border-b-0"><a href="' + UI.link(p) + '" class="flex h-full flex-col items-center px-3 py-4 text-center hover:bg-gray-50">' +
      '<img src="' + p.image + '" alt="' + esc(p.name) + '" width="140" height="140" loading="lazy" class="h-[140px] w-[140px] object-contain">' +
      '<span class="mt-2 text-[15px]">' + esc(d.label) + '</span><span class="tag-off mt-3">-' + d.off + '%</span></a></li>';
  }).join('');

  /* two category blocks: [label, product id] (labels match the photographs) */
  function block(target, rows) {
    $(target).innerHTML = rows.map(function (r) {
      var p = CATALOG.byId(r[1]);
      return '<li class="border-b border-r border-gray-200 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+4)]:border-b-0">' +
        '<a href="' + UI.link(p) + '" class="flex h-full min-h-[100px] items-center justify-between gap-2 p-3 hover:bg-gray-50">' +
        '<div class="min-w-0 text-sm"><div class="font-medium">' + esc(r[0]) + '</div><div class="mt-1 text-xs text-gray-500">From<br>USD ' + Math.round(p.price) + '</div></div>' +
        '<img src="' + p.image + '" alt="' + esc(p.name) + '" width="72" height="72" loading="lazy" class="h-[72px] w-[72px] shrink-0 object-contain"></a></li>';
    }).join('');
  }
  block('#block-home', [['Soft chairs', 19], ['Lamps', 20], ['Air mattress', 23], ['Clay pots', 21], ['Kitchen mixer', 18], ['Coffee maker', 17], ['Magazine racks', 24], ['Indoor plants', 22]]);
  block('#block-elec', [['Smart watches', 11], ['Cameras', 9], ['Headphones', 15], ['Electric kettles', 16], ['Gaming set', 8], ['Laptop & PC', 10], ['Tablets', 14], ['Smartphones', 13]]);

  /* recommended: 10 items, no repeats */
  var rec = [1, 2, 3, 4, 5, 7, 15, 20, 21, 16].map(function (id) { return CATALOG.byId(id); });
  $('#recommended').innerHTML = rec.map(function (p) { return UI.card(p, { noRating: true }); }).join('');

  /* regions */
  var regions = [['ae', 'Arabic Emirates'], ['au', 'Australia'], ['us', 'USA'], ['ru', 'Russia'], ['it', 'Italy'], ['dk', 'Denmark'], ['fr', 'France'], ['de', 'Germany'], ['cn', 'China'], ['gb', 'Great Britain']];
  $('#regions').innerHTML = regions.map(function (r) {
    return '<li class="flex items-center gap-3"><img src="assets/img/flags/' + r[0] + '.png" alt="" width="28" height="20" loading="lazy" class="h-5 w-7">' +
      '<div><div class="text-[15px]">' + r[1] + '</div><div class="text-sm text-gray-400">shopname.' + (r[0] === 'ae' ? 'ae' : r[0]) + '</div></div></li>';
  }).join('');

  /* countdown: the deadline is stored so the timer keeps running between visits */
  var KEY = 'brand_deal_deadline_v1';
  var deadline = Number(Store.Storage.get(KEY, 0));
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + 10 * 24 * 3600 * 1000;
    Store.Storage.set(KEY, deadline);
  }
  function tick() {
    var left = Math.max(0, deadline - Date.now());
    var parts = { days: Math.floor(left / 864e5), hours: Math.floor(left % 864e5 / 36e5), minutes: Math.floor(left % 36e5 / 6e4), seconds: Math.floor(left % 6e4 / 1e3) };
    Object.keys(parts).forEach(function (k) { $('#' + k).textContent = parts[k]; });
    if (!left) clearInterval(timer);
  }
  var timer = setInterval(tick, 1000); tick();

  /* quote form (demo: validates, then shows a confirmation; nothing is sent) */
  $('#quote-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var item = $('#q-item'), qty = $('#q-qty'), msg = $('#quote-msg'), ok = true;
    function flag(input, bad, text) {
      var err = input.parentNode.querySelector('[data-err]');
      input.classList.toggle('is-invalid', bad);
      err.textContent = bad ? text : ''; err.classList.toggle('hidden', !bad);
      if (bad) ok = false;
    }
    flag(item, item.value.trim().length < 2, 'Tell us which item you need.');
    flag(qty, !(Number(qty.value) >= 1), 'Enter a quantity of 1 or more.');
    msg.classList.toggle('hidden', !ok);
    if (ok) {
      msg.textContent = 'Inquiry received (demo). No supplier was actually contacted.';
      e.target.reset();
    }
  });
})();
