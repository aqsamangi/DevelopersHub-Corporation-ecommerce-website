/* product-details.html?id=N : gallery, options, add to cart / buy now, tabs, related items */
(function () {
  'use strict';
  var esc = Utils.esc, price = Utils.price, Cart = Store.Cart;
  var root = $('#pdp');
  var p = CATALOG.byId(Store.Query.get('id', ''));

  if (!p) {
    root.innerHTML = '<div class="box px-6 py-16 text-center"><i class="fa-regular fa-circle-question text-4xl text-gray-300" aria-hidden="true"></i>' +
      '<h1 class="mt-3 text-xl font-semibold">Product not found</h1><p class="mt-1 text-sm text-gray-500">This product does not exist or was removed.</p>' +
      '<a class="btn-primary mt-5" href="products.html">Browse all products</a></div>';
    document.title = 'Product not found | Brand';
    return;
  }
  document.title = p.name + ' | Brand';
  var meta = $('meta[name="description"]'); if (meta) meta.setAttribute('content', p.desc);

  var catName = CATALOG.categoryName(p.category);
  var save = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  var views = [
    { label: 'Full product view', scale: 1, origin: '50% 50%' },
    { label: 'Close-up, top left', scale: 2, origin: '0% 0%' },
    { label: 'Close-up, bottom right', scale: 2, origin: '100% 100%' }
  ];

  var attrs = [['Type', p.type], ['Material', p.material], ['Design', p.design], ['Brand', p.brand], ['Category', catName]];
  if (p.colors.length) attrs.push(['Colour', p.colors.join(', ')]);
  attrs.push(['Shipping', 'Free over ' + price(Cart.FREE_SHIPPING_FROM)]);

  function opt(arr) { return arr.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join(''); }

  var related = CATALOG.products.filter(function (x) { return x.id !== p.id && x.category === p.category; });
  CATALOG.products.forEach(function (x) { if (x.id !== p.id && related.indexOf(x) === -1 && related.length < 5) related.push(x); });
  related = related.slice(0, 5);
  var maybe = CATALOG.products.filter(function (x) { return x.id !== p.id && related.indexOf(x) === -1; }).slice(0, 5);

  root.innerHTML =
    '<nav aria-label="Breadcrumb" class="mb-4 text-sm text-gray-400"><ol class="flex flex-wrap items-center gap-2">' +
    '<li><a class="hover:text-primary" href="index.html">Home</a></li><li aria-hidden="true"><i class="fa-solid fa-angle-right text-xs"></i></li>' +
    '<li><a class="hover:text-primary" href="products.html?category=' + p.category + '">' + esc(catName) + '</a></li><li aria-hidden="true"><i class="fa-solid fa-angle-right text-xs"></i></li>' +
    '<li class="max-w-[60vw] truncate text-ink" aria-current="page">' + esc(p.name) + '</li></ol></nav>' +

    '<section class="box grid gap-6 p-4 md:p-5 lg:grid-cols-[380px_1fr_260px]" aria-label="Product">' +
    /* gallery */
    '<div><div id="zoom" class="zoom-box flex aspect-square items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">' +
    '<img id="main-img" src="' + p.image + '" alt="' + esc(p.name) + '" width="380" height="380" class="h-full w-full object-contain"></div>' +
    '<ul class="mt-3 flex gap-2" aria-label="Product images">' + views.map(function (v, i) {
      return '<li><button type="button" class="h-16 w-16 overflow-hidden rounded-md border bg-white ' + (i === 0 ? 'border-primary ring-1 ring-primary' : 'border-gray-300') + '" data-view="' + i + '" aria-label="' + v.label + '" aria-pressed="' + (i === 0) + '">' +
        '<img src="' + p.image + '" alt="" width="64" height="64" class="h-full w-full object-contain" style="transform:scale(' + v.scale + ');transform-origin:' + v.origin + '"></button></li>';
    }).join('') + '</ul></div>' +

    /* info */
    '<div class="min-w-0">' +
    '<p class="text-sm text-green-600"><i class="fa-solid fa-check"></i> In stock</p>' +
    '<h1 class="mt-1 text-xl font-semibold leading-snug md:text-[22px]">' + esc(p.name) + '</h1>' +
    '<div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">' + Utils.stars(p.rating) + '<span class="text-amber-500">' + p.rating.toFixed(1) + '</span>' +
    '<span><i class="fa-regular fa-comment-dots"></i> ' + p.reviews + ' reviews</span><span><i class="fa-solid fa-basket-shopping"></i> ' + p.orders + ' sold</span></div>' +
    '<div class="mt-4 flex flex-wrap items-baseline gap-3 rounded-md bg-orange-50 px-4 py-3"><span class="text-2xl font-bold" id="unit-price">' + price(p.price) + '</span>' +
    (save ? '<s class="text-gray-400">' + price(p.oldPrice) + '</s><span class="tag-off">Save ' + save + '%</span>' : '') + '</div>' +

    '<dl class="mt-4 divide-y divide-gray-100 border-y border-gray-100 text-sm">' + attrs.map(function (a) {
      return '<div class="grid grid-cols-[110px_1fr] gap-2 py-2"><dt class="text-gray-400">' + a[0] + ':</dt><dd>' + esc(a[1]) + '</dd></div>'; }).join('') + '</dl>' +

    '<form id="buy-form" class="mt-4 space-y-3" novalidate>' +
    '<div class="flex flex-wrap gap-3">' +
    (p.colors.length > 1 ? '<div><label class="label" for="opt-color">Colour</label><select id="opt-color" class="field !w-auto min-w-[140px]">' + opt(p.colors) + '</select></div>' : '') +
    (p.sizes.length ? '<div><label class="label" for="opt-size">Size</label><select id="opt-size" class="field !w-auto min-w-[100px]">' + opt(p.sizes) + '</select></div>' : '') +
    '<div><label class="label" for="qty">Quantity</label><div class="flex"><button type="button" class="h-[38px] w-9 rounded-l-md border border-gray-300 hover:bg-gray-100" data-step="-1" aria-label="Decrease quantity">−</button>' +
    '<input id="qty" type="number" min="1" max="99" value="1" inputmode="numeric" class="h-[38px] w-14 border-y border-gray-300 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
    '<button type="button" class="h-[38px] w-9 rounded-r-md border border-gray-300 hover:bg-gray-100" data-step="1" aria-label="Increase quantity">+</button></div></div></div>' +
    '<p class="text-sm text-gray-500">Total: <strong id="line-total" class="text-ink">' + price(p.price) + '</strong></p>' +
    '<div class="flex flex-wrap gap-2"><button type="submit" class="btn-primary px-6 py-2.5" id="btn-buy">Buy now</button>' +
    '<button type="button" class="btn-outline px-6 py-2.5" id="btn-add"><i class="fa-solid fa-cart-plus"></i> Add to cart</button></div></form></div>' +

    /* supplier */
    '<aside class="h-fit rounded-md border border-gray-200 p-4 text-sm" aria-label="Supplier">' +
    '<div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-lg font-bold text-primary-dark" aria-hidden="true">' + esc(p.brand.charAt(0)) + '</span><div><div class="text-gray-400">Supplier</div><div class="font-medium">' + esc(p.brand) + ' Trading Co.</div></div></div>' +
    '<ul class="mt-4 space-y-2 border-t border-gray-100 pt-4 text-gray-500"><li><i class="fa-solid fa-location-dot w-5 text-gray-400"></i> Germany, Berlin</li><li><i class="fa-solid fa-shield-halved w-5 text-gray-400"></i> Verified seller</li><li><i class="fa-solid fa-globe w-5 text-gray-400"></i> Worldwide shipping</li></ul>' +
    '<a href="msg.html" class="btn-primary mt-4 w-full">Send inquiry</a>' +
    '<a href="products.html?brands=' + encodeURIComponent(p.brand) + '" class="btn-outline mt-2 w-full">Seller’s products</a></aside></section>' +

    /* tabs + side list */
    '<div class="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">' +
    '<section class="box overflow-hidden"><div role="tablist" aria-label="Product information" class="flex overflow-x-auto border-b border-gray-200 no-scrollbar">' +
    ['Description', 'Reviews', 'Shipping', 'About seller'].map(function (t, i) {
      return '<button type="button" role="tab" id="tab-' + i + '" aria-controls="panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" class="whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium ' + (i === 0 ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-ink') + '">' + t + '</button>'; }).join('') + '</div>' +
    '<div class="p-5 text-sm leading-6 text-gray-600">' +
    '<div role="tabpanel" id="panel-0" aria-labelledby="tab-0"><p>' + esc(p.desc) + '</p>' +
    '<table class="mt-4 w-full border border-gray-200 text-left"><tbody>' + attrs.map(function (a) { return '<tr class="border-b border-gray-200 last:border-0"><th scope="row" class="w-40 bg-gray-50 px-3 py-2 font-medium">' + a[0] + '</th><td class="px-3 py-2">' + esc(a[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div role="tabpanel" id="panel-1" aria-labelledby="tab-1" hidden><p><strong class="text-2xl text-ink">' + p.rating.toFixed(1) + '</strong> / 5 from ' + p.reviews + ' customers.</p>' +
    '<p class="mt-3 rounded-md bg-gray-50 p-3 text-xs text-gray-500">Sample reviews written for this demo, not from real customers.</p>' +
    [['Alex M.', 5, 'Exactly as described and arrived quickly. Good value for the price.'], ['Priya S.', 4, 'Nice quality. Packaging could be better, but the item itself is great.'], ['Jordan K.', 4, 'Does the job well. I would buy from this supplier again.']].map(function (r) {
      return '<div class="mt-4 border-t border-gray-100 pt-3"><div class="flex items-center gap-2"><strong class="text-ink">' + r[0] + '</strong>' + Utils.stars(r[1]) + '</div><p class="mt-1">' + r[2] + '</p></div>'; }).join('') + '</div>' +
    '<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden><ul class="list-disc space-y-1 pl-5"><li>Free standard shipping on orders over ' + price(Cart.FREE_SHIPPING_FROM) + '; otherwise a flat ' + price(Store.SHIPPING_FLAT) + '.</li><li>Estimated delivery: 5 to 10 business days (demo information).</li><li>Returns accepted within 30 days in original condition (demo policy).</li></ul></div>' +
    '<div role="tabpanel" id="panel-3" aria-labelledby="tab-3" hidden><p>' + esc(p.brand) + ' Trading Co. is a fictional supplier used for this demo store. No real company or seller is represented.</p></div>' +
    '</div></section>' +
    '<aside class="box p-4" aria-label="You may like"><h2 class="mb-3 font-semibold">You may like</h2><ul class="space-y-3">' + maybe.map(function (m) {
      return '<li><a href="' + UI.link(m) + '" class="flex items-center gap-3 hover:text-primary"><img src="' + m.image + '" alt="" width="64" height="64" loading="lazy" class="h-16 w-16 shrink-0 rounded-md border border-gray-200 object-contain"><span class="min-w-0 text-sm"><span class="line-clamp-2">' + esc(m.name) + '</span><span class="text-gray-400">' + price(m.price) + '</span></span></a></li>'; }).join('') + '</ul></aside></div>' +

    '<section class="mt-6" aria-labelledby="rel-title"><h2 id="rel-title" class="mb-4 text-xl font-bold">Related products</h2><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">' + related.map(function (r) { return UI.card(r); }).join('') + '</div></section>' +

    '<section class="mt-6 flex flex-col items-start justify-between gap-3 overflow-hidden rounded-md bg-gradient-to-r from-primary-dark to-primary px-6 py-6 text-white sm:flex-row sm:items-center" aria-label="Offer"><div><h2 class="text-xl font-semibold">Free shipping on orders over ' + price(Cart.FREE_SHIPPING_FROM) + '</h2><p class="text-sm text-blue-100">Use code <strong>SAVE10</strong> in your cart for 10% off (demo code).</p></div><a href="products.html" class="btn bg-white px-5 text-primary-dark hover:bg-blue-50">Shop now</a></section>';

  /* ----- behaviour ----- */
  var img = $('#main-img'), zoom = $('#zoom'), qty = $('#qty'), view = 0;

  $$('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      view = +b.getAttribute('data-view');
      img.style.transformOrigin = views[view].origin; img.style.transform = 'scale(' + views[view].scale + ')';
      $$('[data-view]').forEach(function (o) {
        var on = o === b;
        o.setAttribute('aria-pressed', String(on));
        o.classList.toggle('border-primary', on); o.classList.toggle('ring-1', on); o.classList.toggle('ring-primary', on); o.classList.toggle('border-gray-300', !on);
      });
    });
  });
  // hover zoom on the full view only (follows the pointer)
  zoom.addEventListener('mousemove', function (e) {
    if (view !== 0) return;
    var r = zoom.getBoundingClientRect();
    img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
  });
  zoom.addEventListener('mouseleave', function () { if (view === 0) img.style.transformOrigin = '50% 50%'; });

  function currentQty() { var n = parseInt(qty.value, 10); return isFinite(n) ? Math.min(99, Math.max(1, n)) : 1; }
  function refresh() { $('#line-total').textContent = price(p.price * currentQty()); }
  $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { qty.value = Math.min(99, Math.max(1, currentQty() + +b.getAttribute('data-step'))); refresh(); }); });
  qty.addEventListener('input', refresh);
  qty.addEventListener('blur', function () { qty.value = currentQty(); refresh(); });

  function opts() { return { color: $('#opt-color') ? $('#opt-color').value : (p.colors[0] || ''), size: $('#opt-size') ? $('#opt-size').value : '' }; }
  $('#btn-add').addEventListener('click', function () {
    Cart.add(p.id, currentQty(), opts());
    Store.Toast.show('Added ' + currentQty() + ' × “' + esc(p.name.length > 30 ? p.name.slice(0, 30) + '…' : p.name) + '” <a href="cart.html">View cart</a>');
  });
  $('#buy-form').addEventListener('submit', function (e) {   // Buy now
    e.preventDefault();
    Cart.add(p.id, currentQty(), opts());
    window.location.href = 'checkout.html';
  });

  /* tabs with arrow-key support */
  var tabs = $$('[role="tab"]');
  function selectTab(i) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      t.classList.toggle('border-primary', on); t.classList.toggle('text-primary', on); t.classList.toggle('border-transparent', !on); t.classList.toggle('text-gray-500', !on);
      $('#panel-' + k).hidden = !on;
    });
    tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); selectTab((i + 1) % tabs.length); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab((i + tabs.length - 1) % tabs.length); }
    });
  });
})();
