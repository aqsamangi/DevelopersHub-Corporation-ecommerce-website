/* cart.html: list, quantity, remove, coupon, totals */
(function () {
  'use strict';
  var esc = Utils.esc, price = Utils.price, Cart = Store.Cart;
  var root = $('#cart-root');
  var couponMsg = '';

  function summaryHtml(t) {
    var toFree = Math.max(0, Cart.FREE_SHIPPING_FROM - (t.subtotal - t.discount));
    var pct = Math.min(100, Math.round(((t.subtotal - t.discount) / Cart.FREE_SHIPPING_FROM) * 100));
    return '<aside class="space-y-4" aria-label="Order summary">' +
      '<form id="coupon-form" class="box p-4" novalidate><label for="coupon" class="label">Have a coupon?</label>' +
      (t.couponCode
        ? '<div class="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"><span><i class="fa-solid fa-tag"></i> ' + esc(t.couponCode) + ' applied (' + esc(t.couponLabel) + ')</span><button type="button" class="text-xs underline" id="coupon-remove">Remove</button></div>'
        : '<div class="flex gap-2"><input id="coupon" class="field" placeholder="Add coupon (try SAVE10)" autocomplete="off"><button type="submit" class="btn-outline">Apply</button></div>') +
      '<p id="coupon-msg" class="mt-1 min-h-[1rem] text-xs ' + (couponMsg.indexOf('not') > -1 ? 'text-red-600' : 'text-green-600') + '" role="status">' + esc(couponMsg) + '</p></form>' +
      '<div class="box p-4 text-sm"><dl class="space-y-2">' +
      row('Subtotal:', price(t.subtotal)) +
      (t.discount ? row('Discount (' + esc(t.couponCode) + '):', '<span class="text-red-600">− ' + price(t.discount) + '</span>') : '') +
      row('Shipping:', t.shipping ? price(t.shipping) : '<span class="text-green-600">Free</span>') +
      row('Tax (' + Math.round(Store.TAX_RATE * 100) + '% est.):', '+ ' + price(t.tax)) +
      '</dl><div class="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-bold"><span>Total:</span><span id="cart-total">' + price(t.total) + '</span></div>' +
      '<div class="mt-3 text-xs text-gray-500">' + (toFree > 0 ? 'Add <strong>' + price(toFree) + '</strong> more for free shipping.' : '<i class="fa-solid fa-circle-check text-green-600"></i> You get free shipping!') +
      '<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200"><div class="h-full bg-primary" style="width:' + pct + '%"></div></div></div>' +
      '<a href="checkout.html" class="btn mt-4 w-full bg-mint py-3 text-base text-white hover:opacity-90">Checkout</a>' +
      '<p class="mt-3 text-center text-xs text-gray-400"><i class="fa-solid fa-lock"></i> Demo checkout: no real payment is taken</p></div></aside>';
  }
  function row(a, b) { return '<div class="flex justify-between"><dt class="text-gray-500">' + a + '</dt><dd>' + b + '</dd></div>'; }

  function lineHtml(l) {
    var p = l.product, variant = [l.color, l.size && 'Size: ' + l.size].filter(Boolean).join(', ');
    return '<li class="flex gap-3 border-b border-gray-200 p-4 last:border-b-0 sm:gap-4" data-key="' + esc(l.key) + '">' +
      '<a href="' + UI.link(p) + '" class="shrink-0"><img src="' + p.image + '" alt="' + esc(p.name) + '" width="96" height="96" class="h-20 w-20 rounded-md border border-gray-200 object-contain sm:h-24 sm:w-24"></a>' +
      '<div class="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:justify-between">' +
      '<div class="min-w-0 sm:max-w-sm"><a href="' + UI.link(p) + '" class="line-clamp-2 font-medium hover:text-primary">' + esc(p.name) + '</a>' +
      '<p class="mt-1 text-sm text-gray-400">' + (variant ? esc(variant) + '<br>' : '') + 'Brand: ' + esc(p.brand) + '</p>' +
      '<button type="button" class="btn-danger-outline mt-2 !px-3 !py-1 text-xs" data-remove><i class="fa-regular fa-trash-can"></i> Remove</button></div>' +
      '<div class="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">' +
      '<div class="text-right"><div class="font-semibold">' + price(l.total) + '</div><div class="text-xs text-gray-400">' + price(p.price) + ' each</div></div>' +
      '<div class="flex" role="group" aria-label="Quantity for ' + esc(p.name) + '"><button type="button" class="h-8 w-8 rounded-l-md border border-gray-300 hover:bg-gray-100" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input type="number" min="1" max="99" value="' + l.qty + '" class="h-8 w-12 border-y border-gray-300 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary" data-qty aria-label="Quantity">' +
      '<button type="button" class="h-8 w-8 rounded-r-md border border-gray-300 hover:bg-gray-100" data-step="1" aria-label="Increase quantity">+</button></div></div></div></li>';
  }

  function render() {
    var lines = Cart.lines(), t = Cart.totals();
    $('#cart-count').textContent = lines.length ? '(' + t.items + ' ' + (t.items === 1 ? 'item' : 'items') + ')' : '';
    if (!lines.length) {
      root.innerHTML = '<div class="box px-6 py-16 text-center"><i class="fa-solid fa-cart-shopping text-5xl text-gray-300" aria-hidden="true"></i>' +
        '<h2 class="mt-4 text-xl font-semibold">Your cart is empty</h2><p class="mt-1 text-sm text-gray-500">Looks like you have not added anything yet.</p>' +
        '<a href="products.html" class="btn-primary mt-6">Start shopping</a></div>';
      return;
    }
    root.innerHTML = '<div class="grid gap-5 lg:grid-cols-[1fr_300px]"><section aria-label="Cart items"><div class="box"><ul>' + lines.map(lineHtml).join('') + '</ul>' +
      '<div class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 p-4"><a href="products.html" class="btn-primary"><i class="fa-solid fa-arrow-left"></i> Back to shop</a>' +
      '<button type="button" class="btn-danger-outline" id="clear-all">Remove all</button></div></div>' +
      '<ul class="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-3"><li class="flex items-center gap-3"><i class="fa-solid fa-lock text-gray-400"></i> Secure checkout (demo)</li><li class="flex items-center gap-3"><i class="fa-regular fa-comments text-gray-400"></i> Customer support</li><li class="flex items-center gap-3"><i class="fa-solid fa-truck text-gray-400"></i> Free delivery over ' + price(Cart.FREE_SHIPPING_FROM) + '</li></ul></section>' +
      summaryHtml(t) + '</div>';
  }

  root.addEventListener('click', function (e) {
    var li = e.target.closest('[data-key]');
    if (e.target.closest('[data-remove]') && li) { Cart.remove(li.getAttribute('data-key')); return; }
    var step = e.target.closest('[data-step]');
    if (step && li) {
      var cur = parseInt($('[data-qty]', li).value, 10) || 1;
      Cart.setQty(li.getAttribute('data-key'), Math.min(99, cur + parseInt(step.getAttribute('data-step'), 10)));
      return;
    }
    if (e.target.closest('#clear-all')) { Cart.clear(); couponMsg = ''; return; }
    if (e.target.closest('#coupon-remove')) { Cart.removeCoupon(); couponMsg = ''; }
  });
  root.addEventListener('change', function (e) {
    var input = e.target.closest('[data-qty]'), li = e.target.closest('[data-key]');
    if (input && li) { Cart.setQty(li.getAttribute('data-key'), Math.min(99, parseInt(input.value, 10) || 1)); }
  });
  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'coupon-form') return;
    e.preventDefault();
    var code = ($('#coupon').value || '').trim();
    couponMsg = !code ? 'Enter a coupon code.' : (Cart.applyCoupon(code) ? 'Coupon applied!' : 'That coupon code is not valid.');
    render(); // show the message (the cart:changed render ran before it was set)
  });

  window.addEventListener('cart:changed', render);
  window.addEventListener('storage', function (e) { if (e.key && e.key.indexOf('brand_') === 0) render(); });
  render();
})();
