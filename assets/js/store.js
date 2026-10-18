/*
 * Core helpers: safe storage, formatting, URL helpers, toast and the shopping cart.
 * The cart is kept in localStorage so it survives page reloads and works across pages.
 */
(function (global) {
  'use strict';

  /* ---------- tiny DOM / string helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  function price(n) { return money.format(Number(n) || 0); }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 200);
    };
  }

  function stars(rating) {
    var full = Math.floor(rating), half = rating - full >= 0.5, html = '';
    for (var i = 1; i <= 5; i++) {
      if (i <= full) html += '<i class="fa-solid fa-star" aria-hidden="true"></i>';
      else if (i === full + 1 && half) html += '<i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>';
      else html += '<i class="fa-regular fa-star" aria-hidden="true"></i>';
    }
    return '<span class="stars" role="img" aria-label="Rated ' + rating + ' out of 5">' + html + '</span>';
  }

  /* ---------- safe localStorage (can throw in private mode / blocked storage) ---------- */
  var Storage = {
    get: function (key, fallback) {
      try {
        var raw = global.localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { global.localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    remove: function (key) { try { global.localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  };

  /* ---------- URL query helpers ---------- */
  var Query = {
    get: function (name, fallback) {
      var v = new URLSearchParams(global.location.search).get(name);
      return v == null || v === '' ? fallback : v;
    },
    // Update the address bar without reloading (keeps filters shareable)
    set: function (obj) {
      var params = new URLSearchParams(global.location.search);
      Object.keys(obj).forEach(function (k) {
        if (obj[k] == null || obj[k] === '' || obj[k] === false) params.delete(k); else params.set(k, obj[k]);
      });
      var qs = params.toString();
      try { global.history.replaceState(null, '', global.location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* file:// in some browsers */ }
    }
  };

  /* ---------- toast ---------- */
  var Toast = {
    show: function (html, ms) {
      var region = $('#toast-region');
      if (!region) {
        region = document.createElement('div');
        region.id = 'toast-region';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
      }
      var el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = html;
      region.appendChild(el);
      setTimeout(function () { el.remove(); }, ms || 3200);
    }
  };

  /* ---------- cart ---------- */
  var CART_KEY = 'brand_cart_v1';
  var COUPON_KEY = 'brand_coupon_v1';
  var ORDERS_KEY = 'brand_orders_v1';

  var FREE_SHIPPING_FROM = 100;   // USD
  var SHIPPING_FLAT = 7.99;       // USD
  var TAX_RATE = 0.05;            // demo estimate
  var COUPONS = { SAVE10: { rate: 0.10, label: '10% off' } }; // demo coupon

  function lineKey(id, color, size) { return [id, color || '', size || ''].join('|'); }

  function read() {
    var items = Storage.get(CART_KEY, []);
    if (!Array.isArray(items)) return [];
    // drop lines whose product no longer exists or have bad quantities
    return items.filter(function (l) {
      return l && global.CATALOG.byId(l.id) && l.qty > 0;
    }).map(function (l) { l.qty = Math.min(99, Math.max(1, parseInt(l.qty, 10) || 1)); return l; });
  }

  function write(items) {
    Storage.set(CART_KEY, items);
    global.dispatchEvent(new CustomEvent('cart:changed'));
  }

  var Cart = {
    FREE_SHIPPING_FROM: FREE_SHIPPING_FROM,
    lines: function () {
      return read().map(function (l) {
        var p = global.CATALOG.byId(l.id);
        return { key: l.key || lineKey(l.id, l.color, l.size), id: l.id, qty: l.qty, color: l.color || '', size: l.size || '', product: p, total: p.price * l.qty };
      });
    },
    count: function () { return read().reduce(function (n, l) { return n + l.qty; }, 0); },
    add: function (id, qty, opts) {
      opts = opts || {};
      var p = global.CATALOG.byId(id);
      if (!p) return false;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var items = read(), key = lineKey(p.id, opts.color, opts.size), found = false;
      items.forEach(function (l) {
        if ((l.key || lineKey(l.id, l.color, l.size)) === key) { l.qty = Math.min(99, l.qty + qty); found = true; }
      });
      if (!found) items.push({ key: key, id: p.id, qty: Math.min(99, qty), color: opts.color || '', size: opts.size || '' });
      write(items);
      return true;
    },
    setQty: function (key, qty) {
      qty = parseInt(qty, 10);
      if (!qty || qty < 1) return Cart.remove(key);
      var items = read();
      items.forEach(function (l) { if ((l.key || lineKey(l.id, l.color, l.size)) === key) l.qty = Math.min(99, qty); });
      write(items);
    },
    remove: function (key) {
      write(read().filter(function (l) { return (l.key || lineKey(l.id, l.color, l.size)) !== key; }));
    },
    clear: function () { write([]); },

    coupon: function () {
      var code = Storage.get(COUPON_KEY, '');
      return COUPONS[code] ? code : '';
    },
    applyCoupon: function (code) {
      code = String(code || '').trim().toUpperCase();
      if (!COUPONS[code]) return false;
      Storage.set(COUPON_KEY, code);
      global.dispatchEvent(new CustomEvent('cart:changed'));
      return true;
    },
    removeCoupon: function () { Storage.remove(COUPON_KEY); global.dispatchEvent(new CustomEvent('cart:changed')); },

    totals: function () {
      var lines = Cart.lines();
      var r = function (n) { return Math.round(n * 100 + 1e-9) / 100; };
      var subtotal = r(lines.reduce(function (s, l) { return s + l.total; }, 0));
      var code = Cart.coupon();
      var discount = code ? r(subtotal * COUPONS[code].rate) : 0;
      var discounted = r(subtotal - discount);
      var shipping = lines.length === 0 ? 0 : (discounted >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT);
      var tax = r(discounted * TAX_RATE);
      // total is built from the already-rounded parts so the numbers on screen always add up
      var total = r(discounted + shipping + tax);
      return { subtotal: subtotal, discount: discount, shipping: shipping, tax: tax, total: total, couponCode: code, couponLabel: code ? COUPONS[code].label : '', items: Cart.count() };
    }
  };

  /* ---------- orders (demo) ---------- */
  var Orders = {
    all: function () { var o = Storage.get(ORDERS_KEY, []); return Array.isArray(o) ? o : []; },
    save: function (order) {
      var list = Orders.all(); list.unshift(order);
      Storage.set(ORDERS_KEY, list.slice(0, 20));
    }
  };

  global.$ = $; global.$$ = $$;
  global.Utils = { esc: esc, price: price, debounce: debounce, stars: stars };
  global.Store = { Storage: Storage, Query: Query, Toast: Toast, Cart: Cart, Orders: Orders, TAX_RATE: TAX_RATE, SHIPPING_FLAT: SHIPPING_FLAT };
})(window);
