/* orders.html: shows orders saved by the demo checkout */
(function () {
  'use strict';
  var esc = Utils.esc, price = Utils.price;
  var root = $('#orders-root'), orders = Store.Orders.all();
  if (!orders.length) {
    root.innerHTML = '<div class="box px-6 py-16 text-center"><i class="fa-solid fa-box-open text-5xl text-gray-300" aria-hidden="true"></i><h2 class="mt-4 text-xl font-semibold">No orders yet</h2><p class="mt-1 text-sm text-gray-500">Orders you place at checkout will appear here.</p><a href="products.html" class="btn-primary mt-6">Start shopping</a></div>';
    return;
  }
  root.innerHTML = orders.map(function (o, idx) {
    var d = new Date(o.date);
    return '<article class="box p-4" aria-label="Order ' + esc(o.id) + '"><header class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3"><div><h2 class="font-semibold">Order ' + esc(o.id) + '</h2><p class="text-sm text-gray-400">' + d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + esc(o.payment) + '</p></div>' +
      '<div class="text-right"><div class="font-semibold">' + price(o.totals.total) + '</div><span class="tag-off !bg-green-100 !text-green-700">Confirmed (demo)</span></div></header>' +
      '<ul class="mt-3 space-y-2">' + o.items.map(function (i) { return '<li class="flex items-center gap-3 text-sm"><img src="' + esc(i.image) + '" alt="" width="48" height="48" class="h-12 w-12 rounded-md border border-gray-200 object-contain"><span class="min-w-0 flex-1 truncate">' + esc(i.name) + '</span><span class="text-gray-500">× ' + i.qty + '</span></li>'; }).join('') + '</ul>' +
      '<div class="mt-3 text-right"><button type="button" class="btn-outline !py-1.5 text-xs" data-reorder="' + idx + '"><i class="fa-solid fa-rotate-right"></i> Buy again</button></div></article>';
  }).join('');
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-reorder]'); if (!b) return;
    orders[+b.getAttribute('data-reorder')].items.forEach(function (i) { Store.Cart.add(i.id, i.qty, { color: i.color, size: i.size }); });
    window.location.href = 'cart.html';
  });
})();
