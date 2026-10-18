/*
 * checkout.html: shipping form validation, demo payment method, order confirmation.
 * NOTHING is sent to a server and card details are never stored.
 */
(function () {
  'use strict';
  var esc = Utils.esc, price = Utils.price, Cart = Store.Cart;
  var root = $('#checkout-root');
  var COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Denmark', 'United Arab Emirates', 'China', 'Pakistan'];
  var PAYMENTS = { card: 'Credit / debit card', cod: 'Cash on delivery', bank: 'Bank transfer' };

  function field(id, label, opts) {
    opts = opts || {};
    return '<div class="' + (opts.span || '') + '"><label class="label" for="' + id + '">' + label + (opts.optional ? ' <span class="font-normal text-gray-400">(optional)</span>' : '') + '</label>' +
      '<input id="' + id + '" name="' + id + '" type="' + (opts.type || 'text') + '" class="field" ' + (opts.attrs || '') + ' aria-describedby="' + id + '-err">' +
      '<p id="' + id + '-err" class="field-error hidden" role="alert"></p></div>';
  }

  function summary(t, lines) {
    return '<aside class="box h-fit p-4 lg:sticky lg:top-4" aria-label="Order summary"><h2 class="mb-3 text-lg font-semibold">Order summary</h2>' +
      '<ul class="max-h-72 space-y-3 overflow-y-auto pr-1">' + lines.map(function (l) {
        return '<li class="flex items-center gap-3"><div class="relative shrink-0"><img src="' + l.product.image + '" alt="" width="56" height="56" class="h-14 w-14 rounded-md border border-gray-200 object-contain"><span class="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-600 px-1 text-[11px] text-white">' + l.qty + '</span></div>' +
          '<div class="min-w-0 flex-1 text-sm"><div class="line-clamp-2">' + esc(l.product.name) + '</div><div class="text-xs text-gray-400">' + esc([l.color, l.size && 'Size ' + l.size].filter(Boolean).join(', ')) + '</div></div><div class="text-sm font-medium">' + price(l.total) + '</div></li>'; }).join('') + '</ul>' +
      '<dl class="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">' +
      '<div class="flex justify-between"><dt class="text-gray-500">Subtotal</dt><dd>' + price(t.subtotal) + '</dd></div>' +
      (t.discount ? '<div class="flex justify-between"><dt class="text-gray-500">Discount (' + esc(t.couponCode) + ')</dt><dd class="text-red-600">− ' + price(t.discount) + '</dd></div>' : '') +
      '<div class="flex justify-between"><dt class="text-gray-500">Shipping</dt><dd>' + (t.shipping ? price(t.shipping) : '<span class="text-green-600">Free</span>') + '</dd></div>' +
      '<div class="flex justify-between"><dt class="text-gray-500">Tax (' + Math.round(Store.TAX_RATE * 100) + '% est.)</dt><dd>' + price(t.tax) + '</dd></div></dl>' +
      '<div class="mt-3 flex justify-between border-t border-gray-200 pt-3 text-lg font-bold"><span>Total</span><span>' + price(t.total) + '</span></div>' +
      '<button type="submit" form="checkout-form" class="btn-primary mt-4 w-full py-3 text-base">Place order (demo)</button>' +
      '<p class="mt-2 text-center text-xs text-gray-400">By placing this demo order you agree that no real purchase is made.</p></aside>';
  }

  function render() {
    var lines = Cart.lines(), t = Cart.totals();
    if (!lines.length) {
      root.innerHTML = '<div class="box px-6 py-16 text-center"><i class="fa-solid fa-cart-shopping text-5xl text-gray-300" aria-hidden="true"></i><h1 class="mt-4 text-xl font-semibold">Your cart is empty</h1>' +
        '<p class="mt-1 text-sm text-gray-500">Add something to your cart before checking out.</p><a href="products.html" class="btn-primary mt-6">Browse products</a></div>';
      return;
    }
    root.innerHTML = '<h1 class="mb-4 text-2xl font-bold">Checkout</h1>' +
      '<div class="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="note"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Demo checkout.</strong> No payment is processed and nothing is sent anywhere. Please do not enter real card details.</div>' +
      '<div class="grid gap-5 lg:grid-cols-[1fr_340px]">' +
      '<form id="checkout-form" class="space-y-5" novalidate>' +
      '<fieldset class="box p-5"><legend class="sr-only">Contact</legend><h2 class="mb-3 text-lg font-semibold">1. Contact</h2><div class="grid gap-4 sm:grid-cols-2">' +
      field('email', 'Email', { type: 'email', attrs: 'autocomplete="email" placeholder="name@example.com"' }) + field('phone', 'Phone', { type: 'tel', attrs: 'autocomplete="tel" placeholder="+1 555 123 4567"' }) + '</div></fieldset>' +
      '<fieldset class="box p-5"><legend class="sr-only">Shipping address</legend><h2 class="mb-3 text-lg font-semibold">2. Shipping address</h2><div class="grid gap-4 sm:grid-cols-2">' +
      field('fullName', 'Full name', { span: 'sm:col-span-2', attrs: 'autocomplete="name"' }) +
      field('address', 'Street address', { span: 'sm:col-span-2', attrs: 'autocomplete="address-line1"' }) +
      field('address2', 'Apartment, suite, etc.', { span: 'sm:col-span-2', optional: true, attrs: 'autocomplete="address-line2"' }) +
      field('city', 'City', { attrs: 'autocomplete="address-level2"' }) + field('postal', 'Postal code', { attrs: 'autocomplete="postal-code" inputmode="text"' }) +
      '<div><label class="label" for="country">Country</label><select id="country" name="country" class="field" autocomplete="country-name">' + COUNTRIES.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
      '</div></fieldset>' +
      '<fieldset class="box p-5"><legend class="sr-only">Payment method</legend><h2 class="mb-3 text-lg font-semibold">3. Payment method (simulated)</h2><div class="space-y-3">' +
      Object.keys(PAYMENTS).map(function (k, i) {
        return '<label class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-300 p-3 has-[:checked]:border-primary has-[:checked]:bg-primary-light/40"><input type="radio" name="payment" value="' + k + '" class="h-4 w-4 accent-primary"' + (i === 0 ? ' checked' : '') + '>' +
          '<i class="fa-solid ' + (k === 'card' ? 'fa-credit-card' : k === 'cod' ? 'fa-money-bill-wave' : 'fa-building-columns') + ' w-5 text-gray-500" aria-hidden="true"></i><span class="text-sm font-medium">' + PAYMENTS[k] + '</span></label>'; }).join('') +
      '<div id="pay-card" class="grid gap-4 rounded-md bg-gray-50 p-4 sm:grid-cols-2">' +
      field('cardNumber', 'Card number', { span: 'sm:col-span-2', attrs: 'inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" maxlength="23"' }) +
      field('cardExp', 'Expiry (MM/YY)', { attrs: 'inputmode="numeric" autocomplete="off" placeholder="MM/YY" maxlength="5"' }) +
      field('cardCvc', 'CVC', { attrs: 'inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4"' }) +
      '<p class="text-xs text-gray-500 sm:col-span-2">Demo only: any number that passes the card checksum works, e.g. 4242 4242 4242 4242. Card data is never saved.</p></div>' +
      '<p id="pay-cod" class="hidden rounded-md bg-gray-50 p-4 text-sm text-gray-600">Pay the courier in cash when your order arrives (simulated).</p>' +
      '<p id="pay-bank" class="hidden rounded-md bg-gray-50 p-4 text-sm text-gray-600">Bank details would be shown after the order is placed (simulated, no real account exists).</p>' +
      '</div></fieldset>' +
      '<p id="form-error" class="hidden rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"></p>' +
      '<div class="flex flex-wrap gap-2 lg:hidden"><button type="submit" class="btn-primary w-full py-3 text-base">Place order (demo)</button></div>' +
      '<a href="cart.html" class="inline-block text-sm text-primary hover:underline"><i class="fa-solid fa-arrow-left"></i> Back to cart</a>' +
      '</form>' + summary(t, lines) + '</div>';
    bind();
  }

  /* ---------- validation ---------- */
  function setErr(id, msg) {
    var input = $('#' + id), err = $('#' + id + '-err');
    if (!input || !err) return;
    input.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg || ''; err.classList.toggle('hidden', !msg);
  }
  function luhn(num) {
    var sum = 0, alt = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = parseInt(num.charAt(i), 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  }
  var rules = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address.'; },
    phone: function (v) { var d = v.replace(/\D/g, ''); return /^[+\d\s().-]+$/.test(v) && d.length >= 7 && d.length <= 15 ? '' : 'Enter a valid phone number (7 to 15 digits).'; },
    fullName: function (v) { return v.trim().split(/\s+/).length >= 2 && v.trim().length >= 4 ? '' : 'Enter your first and last name.'; },
    address: function (v) { return v.trim().length >= 5 ? '' : 'Enter your street address.'; },
    city: function (v) { return v.trim().length >= 2 ? '' : 'Enter your city.'; },
    postal: function (v) { return /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v.trim()) ? '' : 'Enter a valid postal code.'; },
    cardNumber: function (v) { var d = v.replace(/\s/g, ''); return /^\d{13,19}$/.test(d) && luhn(d) ? '' : 'Enter a valid card number.'; },
    cardExp: function (v) {
      var m = /^(\d{2})\/(\d{2})$/.exec(v.trim()); if (!m) return 'Use the format MM/YY.';
      var mm = +m[1], yy = 2000 + +m[2], now = new Date();
      if (mm < 1 || mm > 12) return 'Month must be between 01 and 12.';
      return (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1)) ? '' : 'This card has expired.';
    },
    cardCvc: function (v) { return /^\d{3,4}$/.test(v.trim()) ? '' : 'Enter the 3 or 4 digit code.'; }
  };

  function bind() {
    var form = $('#checkout-form');
    function method() { return form.elements.payment.value; }
    function togglePay() {
      var m = method();
      $('#pay-card').classList.toggle('hidden', m !== 'card'); $('#pay-cod').classList.toggle('hidden', m !== 'cod'); $('#pay-bank').classList.toggle('hidden', m !== 'bank');
      ['cardNumber', 'cardExp', 'cardCvc'].forEach(function (id) { if (m !== 'card') setErr(id, ''); });
    }
    form.addEventListener('change', function (e) { if (e.target.name === 'payment') togglePay(); });
    togglePay();

    // light input formatting
    $('#cardNumber').addEventListener('input', function (e) { var d = e.target.value.replace(/\D/g, '').slice(0, 19); e.target.value = d.replace(/(.{4})/g, '$1 ').trim(); });
    $('#cardExp').addEventListener('input', function (e) { var d = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; });
    $('#cardCvc').addEventListener('input', function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

    // validate a field when the user leaves it
    Object.keys(rules).forEach(function (id) {
      var el = $('#' + id);
      if (el) el.addEventListener('blur', function () { if (id.indexOf('card') === 0 && method() !== 'card') return; setErr(id, rules[id](el.value)); });
      if (el) el.addEventListener('input', function () { if (el.classList.contains('is-invalid')) setErr(id, rules[id](el.value)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      Object.keys(rules).forEach(function (id) {
        if (id.indexOf('card') === 0 && method() !== 'card') return;
        var msg = rules[id]($('#' + id).value);
        setErr(id, msg);
        if (msg && !first) first = $('#' + id);
      });
      var formErr = $('#form-error');
      if (first) {
        formErr.textContent = 'Please fix the highlighted fields and try again.'; formErr.classList.remove('hidden');
        first.focus(); return;
      }
      formErr.classList.add('hidden');
      placeOrder(form);
    });
  }

  /* ---------- confirmation ---------- */
  function placeOrder(form) {
    var lines = Cart.lines(), t = Cart.totals();
    if (!lines.length) { render(); return; }
    var v = function (n) { return form.elements[n].value.trim(); };
    var order = {
      id: 'BR-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10),
      date: new Date().toISOString(),
      items: lines.map(function (l) { return { id: l.id, name: l.product.name, image: l.product.image, qty: l.qty, price: l.product.price, color: l.color, size: l.size }; }),
      totals: t,
      payment: PAYMENTS[form.elements.payment.value],   // only the method name, never card data
      ship: { name: v('fullName'), address: v('address') + (v('address2') ? ', ' + v('address2') : ''), city: v('city'), postal: v('postal'), country: form.elements.country.value, email: v('email') }
    };
    Store.Orders.save(order);
    Cart.clear();
    Cart.removeCoupon();
    showConfirmation(order);
  }

  function showConfirmation(o) {
    document.title = 'Order confirmed | Brand';
    root.innerHTML = '<section class="box mx-auto max-w-2xl p-6 text-center sm:p-10" aria-labelledby="done-title">' +
      '<span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600" aria-hidden="true"><i class="fa-solid fa-check"></i></span>' +
      '<h1 id="done-title" class="mt-4 text-2xl font-bold" tabindex="-1">Thank you, your demo order is confirmed!</h1>' +
      '<p class="mt-1 text-gray-500">Order number <strong class="text-ink">' + esc(o.id) + '</strong>. A confirmation would be emailed to ' + esc(o.ship.email) + ' (not sent in this demo).</p>' +
      '<div class="mt-6 grid gap-4 text-left text-sm sm:grid-cols-2"><div class="rounded-md bg-gray-50 p-4"><h2 class="mb-1 font-semibold">Shipping to</h2><p>' + esc(o.ship.name) + '<br>' + esc(o.ship.address) + '<br>' + esc(o.ship.city) + ' ' + esc(o.ship.postal) + '<br>' + esc(o.ship.country) + '</p></div>' +
      '<div class="rounded-md bg-gray-50 p-4"><h2 class="mb-1 font-semibold">Payment</h2><p>' + esc(o.payment) + ' (simulated)</p><p class="mt-2 font-semibold">Total paid: ' + price(o.totals.total) + '</p></div></div>' +
      '<ul class="mt-6 divide-y divide-gray-100 text-left text-sm">' + o.items.map(function (i) {
        return '<li class="flex items-center gap-3 py-2"><img src="' + i.image + '" alt="" width="48" height="48" class="h-12 w-12 rounded-md border border-gray-200 object-contain"><span class="min-w-0 flex-1 truncate">' + esc(i.name) + '</span><span class="text-gray-500">× ' + i.qty + '</span><span class="w-20 text-right">' + price(i.price * i.qty) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="mt-6 flex flex-wrap justify-center gap-3"><a href="products.html" class="btn-primary">Continue shopping</a><a href="orders.html" class="btn-outline">View my orders</a></div></section>';
    window.scrollTo({ top: 0 });
    var h = $('#done-title'); if (h) h.focus();
  }

  render();
})();
