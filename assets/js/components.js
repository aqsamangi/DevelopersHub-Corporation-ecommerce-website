/*
 * Shared UI: site header/footer (desktop), mobile app bars, product cards,
 * dropdown menus and the global "add to cart" handler.
 * Pages contain <div id="site-header"></div> / <div id="site-footer"></div>
 * (or #m-header / #m-nav on the mobile pages) and this file fills them in.
 */
(function (global) {
  'use strict';
  var esc = Utils.esc, price = Utils.price, Cart = Store.Cart;

  var SHIP_KEY = 'brand_shipto_v1';
  var COUNTRIES = [
    { code: 'us', name: 'United States' }, { code: 'ae', name: 'Arabic Emirates' },
    { code: 'au', name: 'Australia' }, { code: 'ru', name: 'Russia' }, { code: 'it', name: 'Italy' },
    { code: 'dk', name: 'Denmark' }, { code: 'fr', name: 'France' }, { code: 'de', name: 'Germany' },
    { code: 'cn', name: 'China' }, { code: 'gb', name: 'Great Britain' }
  ];
  function shipTo() {
    var code = Store.Storage.get(SHIP_KEY, 'us');
    return COUNTRIES.filter(function (c) { return c.code === code; })[0] || COUNTRIES[0];
  }

  /* ---------- product cards ---------- */
  function link(p) { return 'product-details.html?id=' + p.id; }
  function priceHtml(p, cls) {
    return '<div class="flex items-baseline gap-2 ' + (cls || '') + '"><span class="font-semibold text-ink">' + price(p.price) + '</span>' +
      (p.oldPrice > p.price ? '<s class="text-xs text-gray-400">' + price(p.oldPrice) + '</s>' : '') + '</div>';
  }

  var UI = {
    link: link,
    /* grid card: used on home, products grid, related items */
    card: function (p, opts) {
      opts = opts || {};
      return '<article class="p-card" data-product="' + p.id + '">' +
        '<a href="' + link(p) + '" class="block" aria-label="' + esc(p.name) + '">' +
        '<img src="' + p.image + '" alt="' + esc(p.name) + '" width="200" height="200" loading="lazy" class="p-img"></a>' +
        '<div class="mt-3 flex-1">' + priceHtml(p) +
        (opts.noRating ? '' : '<div class="mt-1 flex items-center gap-1">' + Utils.stars(p.rating) + '<span class="text-xs text-gray-400">' + p.rating.toFixed(1) + '</span></div>') +
        '<a href="' + link(p) + '" class="mt-1 line-clamp-2 text-sm text-gray-500 hover:text-primary">' + esc(p.name) + '</a></div>' +
        '<button type="button" class="btn-outline mt-3 w-full !py-1.5 text-xs" data-add-to-cart data-id="' + p.id + '"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to cart</button>' +
        '</article>';
    },
    /* horizontal card: products list view (desktop) */
    listCard: function (p) {
      return '<article class="box-soft flex gap-4 p-4" data-product="' + p.id + '">' +
        '<a href="' + link(p) + '" class="block shrink-0" aria-label="' + esc(p.name) + '"><img src="' + p.image + '" alt="' + esc(p.name) + '" width="160" height="160" loading="lazy" class="h-28 w-28 object-contain sm:h-40 sm:w-40"></a>' +
        '<div class="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:gap-6">' +
        '<div class="min-w-0 flex-1">' +
        '<a href="' + link(p) + '" class="line-clamp-2 font-medium text-ink hover:text-primary">' + esc(p.name) + '</a>' +
        '<div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-400">' + Utils.stars(p.rating) + '<span>' + p.rating.toFixed(1) + '</span><span aria-hidden="true">•</span><span>' + p.orders + ' orders</span><span aria-hidden="true">•</span><span class="text-mint">Free shipping over $' + Cart.FREE_SHIPPING_FROM + '</span></div>' +
        '<p class="mt-2 line-clamp-2 hidden text-sm text-gray-500 sm:block">' + esc(p.desc) + '</p>' +
        '<a href="' + link(p) + '" class="mt-2 inline-block text-sm text-primary hover:underline">View details</a></div>' +
        '<div class="flex shrink-0 flex-row items-center justify-between gap-3 md:w-44 md:flex-col md:items-stretch md:justify-start">' +
        priceHtml(p, 'text-lg') +
        '<button type="button" class="btn-primary !py-1.5 text-xs" data-add-to-cart data-id="' + p.id + '"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to cart</button></div></div></article>';
    },
    /* compact row: mobile item list */
    mobileRow: function (p) {
      return '<article class="flex gap-3 border-b border-gray-100 py-3" data-product="' + p.id + '">' +
        '<a href="' + link(p) + '" class="shrink-0" aria-label="' + esc(p.name) + '"><img src="' + p.image + '" alt="' + esc(p.name) + '" width="96" height="96" loading="lazy" class="h-24 w-24 rounded-md border border-gray-200 object-contain"></a>' +
        '<div class="flex min-w-0 flex-1 flex-col">' +
        '<a href="' + link(p) + '" class="line-clamp-2 text-sm text-ink">' + esc(p.name) + '</a>' +
        '<div class="mt-1 flex items-baseline gap-2"><span class="text-base font-semibold">' + price(p.price) + '</span>' + (p.oldPrice > p.price ? '<s class="text-xs text-gray-400">' + price(p.oldPrice) + '</s>' : '') + '</div>' +
        '<div class="mt-0.5 flex items-center gap-1 text-xs text-gray-400">' + Utils.stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.orders + ' orders</span></div>' +
        '<div class="mt-auto pt-1 text-right"><button type="button" class="btn-outline !px-3 !py-1 text-xs" data-add-to-cart data-id="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to cart"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add</button></div>' +
        '</div></article>';
    },
    /* small square tile used by mobile home grids */
    mobileTile: function (p) {
      return '<a href="' + link(p) + '" class="block rounded-md border border-gray-200 bg-white p-2" data-product="' + p.id + '">' +
        '<img src="' + p.image + '" alt="' + esc(p.name) + '" width="160" height="160" loading="lazy" class="mx-auto aspect-square w-full object-contain">' +
        '<div class="mt-1 text-sm font-medium">' + price(p.price) + '</div>' +
        '<div class="line-clamp-1 text-xs text-gray-500">' + esc(p.name) + '</div></a>';
    },
    empty: function (title, text, actionHtml) {
      return '<div class="col-span-full rounded-md border border-dashed border-gray-300 bg-white px-6 py-14 text-center">' +
        '<i class="fa-regular fa-face-frown text-4xl text-gray-300" aria-hidden="true"></i>' +
        '<h2 class="mt-3 text-lg font-semibold">' + esc(title) + '</h2>' +
        '<p class="mt-1 text-sm text-gray-500">' + esc(text) + '</p>' + (actionHtml ? '<div class="mt-5">' + actionHtml + '</div>' : '') + '</div>';
    }
  };

  /* ---------- dropdown menus ([data-menu-toggle="#id"]) ---------- */
  function closeMenus(except) {
    $$('.menu.open').forEach(function (m) {
      if (m !== except) {
        m.classList.remove('open');
        var t = $('[data-menu-toggle="#' + m.id + '"]');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  }
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-menu-toggle]');
    if (toggle) {
      var menu = $(toggle.getAttribute('data-menu-toggle'));
      if (menu) {
        var willOpen = !menu.classList.contains('open');
        closeMenus(menu);
        menu.classList.toggle('open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      }
      return;
    }
    if (!e.target.closest('.menu')) closeMenus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenus(); closeDrawer(); } });

  /* ---------- mobile drawer ---------- */
  function openDrawer() {
    var d = $('#drawer'); if (!d) return;
    d.classList.remove('hidden'); document.body.classList.add('overflow-hidden');
    var close = $('#drawer-close'); if (close) close.focus();
  }
  function closeDrawer() {
    var d = $('#drawer'); if (!d || d.classList.contains('hidden')) return;
    d.classList.add('hidden'); document.body.classList.remove('overflow-hidden');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-drawer]')) openDrawer();
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });

  function drawerHtml(mobileSite) {
    var home = mobileSite ? 'mobile-main.html' : 'index.html';
    var list = mobileSite ? 'mobile-itemlist.html' : 'products.html';
    return '<div id="drawer" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="absolute inset-0 bg-black/50" data-close-drawer></div>' +
      '<nav class="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col overflow-y-auto bg-white shadow-pop" aria-label="Categories">' +
      '<div class="flex items-center justify-between bg-primary-light p-4"><div class="flex items-center gap-3"><img src="assets/img/icons/avatar.webp" alt="" width="44" height="44" class="rounded-full"><div class="text-sm">Hi, user,<br>let’s get started</div></div>' +
      '<button id="drawer-close" type="button" class="p-2 text-gray-500" data-close-drawer aria-label="Close menu"><i class="fa-solid fa-xmark text-xl"></i></button></div>' +
      '<div class="flex gap-2 p-4"><a class="btn-primary flex-1" href="login.html#register">Join now</a><a class="btn-outline flex-1" href="login.html">Log in</a></div>' +
      '<ul class="flex-1 border-t border-gray-100 py-2 text-sm">' +
      '<li><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="' + home + '"><i class="fa-solid fa-house w-5 text-gray-400"></i>Home</a></li>' +
      CATALOG.categories.map(function (c) { return '<li><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="' + list + '?category=' + c.id + '"><i class="fa-solid fa-angle-right w-5 text-gray-400"></i>' + esc(c.name) + '</a></li>'; }).join('') +
      '<li class="mt-2 border-t border-gray-100 pt-2"><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="cart.html"><i class="fa-solid fa-cart-shopping w-5 text-gray-400"></i>My cart</a></li>' +
      '<li><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="orders.html"><i class="fa-solid fa-box w-5 text-gray-400"></i>My orders</a></li>' +
      '<li><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="help.html"><i class="fa-regular fa-circle-question w-5 text-gray-400"></i>Help center</a></li>' +
      '<li><a class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" href="' + (mobileSite ? 'index.html' : 'mobile-main.html') + '"><i class="fa-solid ' + (mobileSite ? 'fa-desktop' : 'fa-mobile-screen') + ' w-5 text-gray-400"></i>' + (mobileSite ? 'Desktop site' : 'Mobile site') + '</a></li>' +
      '</ul></nav></div>';
  }

  /* ---------- desktop header ---------- */
  function desktopHeader() {
    var page = document.body.getAttribute('data-page') || '';
    var cur = shipTo();
    var catOptions = '<option value="">All category</option>' + CATALOG.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('');
    function nav(href, label, key) {
      var active = page === key ? ' text-primary font-medium' : '';
      return '<li><a href="' + href + '" class="block whitespace-nowrap py-3 hover:text-primary' + active + '">' + label + '</a></li>';
    }
    return '<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>' +
      '<header class="bg-white">' +
      '<div class="wrap flex flex-wrap items-center gap-x-6 gap-y-3 py-4 lg:flex-nowrap lg:justify-between">' +
      '<button type="button" class="p-2 text-xl text-gray-500 lg:hidden" data-open-drawer aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>' +
      '<a href="index.html" class="shrink-0" aria-label="Brand home"><img src="assets/img/logo.svg" alt="Brand" width="151" height="46" class="h-9 w-auto md:h-[46px]"></a>' +
      '<form action="products.html" method="get" role="search" class="order-last flex w-full overflow-hidden rounded-lg border-2 border-primary lg:order-none lg:max-w-[528px] lg:flex-1">' +
      '<label for="hdr-q" class="sr-only">Search products</label>' +
      '<input id="hdr-q" name="q" type="search" placeholder="Search" autocomplete="off" class="min-w-0 flex-1 border-0 px-4 py-2 text-sm focus:outline-none focus:ring-0">' +
      '<label for="hdr-cat" class="sr-only">Category</label>' +
      '<select id="hdr-cat" name="category" class="hidden border-0 border-l-2 border-primary bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-0 sm:block">' + catOptions + '</select>' +
      '<button type="submit" class="bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">Search</button></form>' +
      '<div class="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">' +
      iconLink('login.html', 'fa-user', 'Profile', page === 'login') +
      iconLink('msg.html', 'fa-message', 'Message', page === 'msg') +
      iconLink('orders.html', 'fa-heart', 'Orders', page === 'orders', true) +
      '<a href="cart.html" class="relative px-2 text-center text-gray-400 hover:text-primary' + (page === 'cart' ? ' text-primary' : '') + '" aria-label="My cart"><div class="text-2xl"><i class="fa-solid fa-cart-shopping"></i></div><div class="hidden text-xs leading-3 sm:block">My Cart</div>' +
      '<span data-cart-badge class="absolute -right-0.5 -top-2 hidden min-w-[20px] rounded-full bg-red-500 px-1.5 text-center text-[11px] font-bold leading-5 text-white" aria-live="polite">0</span></a>' +
      '</div></div>' +
      '<div class="hidden border-y border-gray-200 lg:block"><div class="wrap flex items-center justify-between text-sm">' +
      '<ul class="flex items-center gap-8">' +
      '<li class="relative"><button type="button" class="flex items-center gap-2 py-3 font-medium hover:text-primary" data-menu-toggle="#menu-cat" aria-expanded="false" aria-haspopup="true"><i class="fa-solid fa-bars"></i> All Category</button>' +
      '<div id="menu-cat" class="menu left-0 top-full">' + CATALOG.categories.map(function (c) { return '<a href="products.html?category=' + c.id + '">' + esc(c.name) + '</a>'; }).join('') + '</div></li>' +
      nav('products.html?deals=1', 'Hot Offers', 'hot') + nav('products.html?tag=gift', 'Gift Boxes', 'gift') + nav('index.html#quote', 'Projects', 'projects') + nav('products.html', 'Menu Items', 'products') +
      '<li class="relative"><button type="button" class="flex items-center gap-1 py-3 hover:text-primary" data-menu-toggle="#menu-help" aria-expanded="false" aria-haspopup="true">Help <i class="fa-solid fa-angle-down text-xs"></i></button>' +
      '<div id="menu-help" class="menu left-0 top-full"><a href="help.html#shipping">Shipping information</a><a href="help.html#refund">Money refund</a><a href="help.html#contact">Contact us</a><a href="msg.html">Messages</a></div></li></ul>' +
      '<ul class="flex items-center gap-6">' +
      '<li class="relative"><button type="button" class="flex items-center gap-1 py-3 hover:text-primary" data-menu-toggle="#menu-lang" aria-expanded="false" aria-haspopup="true">English, USD <i class="fa-solid fa-angle-down text-xs"></i></button>' +
      '<div id="menu-lang" class="menu right-0 top-full w-60"><p class="px-4 py-1 text-xs text-gray-500">Language: English</p><p class="px-4 py-1 text-xs text-gray-500">Currency: US dollar (USD). Other currencies are not part of this demo.</p></div></li>' +
      '<li class="relative"><button type="button" class="flex items-center gap-2 py-3 hover:text-primary" data-menu-toggle="#menu-ship" aria-expanded="false" aria-haspopup="true">Ship to <img data-ship-flag src="assets/img/flags/' + cur.code + '.png" alt="' + esc(cur.name) + '" width="24" height="17" class="h-[17px] w-6"> <i class="fa-solid fa-angle-down text-xs"></i></button>' +
      '<div id="menu-ship" class="menu right-0 top-full">' + COUNTRIES.map(function (c) { return '<button type="button" class="menu-item flex items-center gap-2" data-ship="' + c.code + '"><img src="assets/img/flags/' + c.code + '.png" alt="" width="24" height="17" class="h-[17px] w-6">' + esc(c.name) + '</button>'; }).join('') + '</div></li>' +
      '</ul></div></div></header>' + drawerHtml(false);
  }
  function iconLink(href, icon, label, active, hideSm) {
    return '<a href="' + href + '" class="hidden px-2 text-center text-gray-400 hover:text-primary md:block' + (active ? ' text-primary' : '') + '"><div class="text-2xl"><i class="fa-solid ' + icon + '"></i></div><div class="text-xs leading-3">' + label + '</div></a>';
  }

  /* ---------- desktop footer ---------- */
  function desktopFooter() {
    function col(title, links) {
      return '<div><h3 class="mb-3 font-semibold">' + title + '</h3><ul class="space-y-2 text-sm text-gray-400">' +
        links.map(function (l) { return '<li><a class="hover:text-primary" href="' + l[1] + '">' + l[0] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<section class="bg-gray-100 py-10 text-center" aria-labelledby="nl-title"><div class="wrap">' +
      '<h2 id="nl-title" class="text-lg font-semibold">Subscribe to our newsletter</h2>' +
      '<p class="mt-1 text-sm text-gray-400">Get daily news on upcoming offers from many suppliers all over the world</p>' +
      '<form id="newsletter" class="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row" novalidate>' +
      '<div class="relative flex-1"><label for="nl-email" class="sr-only">Email</label><img src="assets/img/icons/email.png" alt="" width="22" height="22" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">' +
      '<input id="nl-email" type="email" class="field !pl-10" placeholder="Email" autocomplete="email"></div>' +
      '<button class="btn-primary" type="submit">Subscribe</button></form>' +
      '<p id="nl-msg" class="mt-2 min-h-[1.25rem] text-sm" role="status"></p></div></section>' +
      '<footer class="bg-white"><div class="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">' +
      '<div><a href="index.html" aria-label="Brand home"><img src="assets/img/logo.svg" alt="Brand" width="151" height="46" class="h-10 w-auto"></a>' +
      '<p class="mt-3 max-w-[230px] text-sm text-gray-600">Best information about the company goes here but now lorem ipsum is.</p>' +
      '<div class="mt-4 flex gap-2 text-white">' + ['facebook-f', 'instagram', 'youtube', 'twitter', 'linkedin-in'].map(function (n) {
        return '<span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm" aria-hidden="true"><i class="fa-brands fa-' + n + '"></i></span>'; }).join('') + '</div></div>' +
      col('About', [['About Us', 'help.html#about'], ['Find Store', 'products.html'], ['Categories', 'products.html'], ['Blogs', 'help.html#about']]) +
      col('Partnership', [['About Us', 'help.html#about'], ['Find Store', 'products.html'], ['Categories', 'products.html'], ['Blogs', 'help.html#about']]) +
      col('Information', [['Help Center', 'help.html'], ['Money Refund', 'help.html#refund'], ['Shipping', 'help.html#shipping'], ['Contact Us', 'help.html#contact']]) +
      col('For Users', [['Login', 'login.html'], ['Register', 'login.html#register'], ['Settings', 'login.html'], ['My Orders', 'orders.html']]) +
      '<div><h3 class="mb-3 font-semibold">Get App</h3><div class="flex flex-col items-start gap-2">' +
      '<a href="#" aria-label="Download on the App Store (demo link)" data-demo-link><img src="assets/img/icons/app-store.png" alt="App Store" width="124" height="42"></a>' +
      '<a href="#" aria-label="Get it on Google Play (demo link)" data-demo-link><img src="assets/img/icons/google-play.png" alt="Google Play" width="124" height="42"></a></div></div>' +
      '</div><div class="bg-gray-100"><div class="wrap flex flex-wrap items-center justify-between gap-2 py-4 text-sm text-gray-500">' +
      '<span>© 2026 Brand · Demo storefront, no real orders or payments.</span>' +
      '<a class="hover:text-primary" href="mobile-main.html"><i class="fa-solid fa-mobile-screen"></i> Mobile version</a></div></div></footer>';
  }

  /* ---------- mobile (app-style) header and bottom navigation ---------- */
  function mobileHeader(opts) {
    opts = opts || {};
    var catOptions = '<option value="">All</option>' + CATALOG.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('');
    var left = opts.back
      ? '<a href="' + opts.back + '" class="p-2 text-xl text-gray-500" aria-label="Back"><i class="fa-solid fa-arrow-left"></i></a>'
      : '<button type="button" class="p-2 text-xl text-gray-500" data-open-drawer aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>';
    return '<header class="sticky top-0 z-30 bg-white shadow-sm">' +
      '<div class="flex items-center gap-1 px-2 py-2">' + left +
      (opts.title ? '<h1 class="flex-1 truncate text-base font-semibold">' + esc(opts.title) + '</h1>' : '<a href="mobile-main.html" class="flex-1" aria-label="Brand home"><img src="assets/img/logo.svg" alt="Brand" width="151" height="46" class="h-8 w-auto"></a>') +
      '<a href="login.html" class="p-2 text-xl text-gray-400" aria-label="Profile"><i class="fa-solid fa-user"></i></a>' +
      '<a href="cart.html" class="relative p-2 text-xl text-gray-400" aria-label="My cart"><i class="fa-solid fa-cart-shopping"></i><span data-cart-badge class="absolute right-0 top-0 hidden min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-[18px] text-white">0</span></a></div>' +
      '<form action="mobile-itemlist.html" method="get" role="search" class="flex gap-2 px-3 pb-3">' +
      '<label for="m-q" class="sr-only">Search products</label>' +
      '<div class="relative flex-1"><i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>' +
      '<input id="m-q" name="q" type="search" placeholder="Search" class="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 pl-9 pr-3 text-sm focus:border-primary focus:bg-white focus:outline-none"></div>' +
      '<button class="rounded-lg bg-primary px-4 text-sm font-medium text-white" type="submit">Search</button></form></header>' + drawerHtml(true);
  }
  function mobileNav() {
    var page = document.body.getAttribute('data-page') || '';
    function item(href, icon, label, key, badge) {
      var on = page === key;
      return '<a href="' + href + '" class="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ' + (on ? 'text-primary' : 'text-gray-400') + '"' + (on ? ' aria-current="page"' : '') + '><i class="fa-solid ' + icon + ' text-lg"></i>' + label +
        (badge ? '<span data-cart-badge class="absolute left-1/2 top-0.5 ml-1 hidden min-w-[16px] rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-4 text-white">0</span>' : '') + '</a>';
    }
    return '<nav class="safe-bottom fixed bottom-0 left-1/2 z-30 flex w-full max-w-[480px] -translate-x-1/2 border-t border-gray-200 bg-white" aria-label="Main">' +
      item('mobile-main.html', 'fa-house', 'Home', 'mhome') + item('mobile-itemlist.html', 'fa-list', 'Items', 'mlist') +
      item('cart.html', 'fa-cart-shopping', 'Cart', 'cart', true) + item('orders.html', 'fa-box', 'Orders', 'orders') + item('login.html', 'fa-user', 'Profile', 'login') + '</nav>';
  }

  /* ---------- cart badge ---------- */
  function updateBadges() {
    var n = Cart.count();
    $$('[data-cart-badge]').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : String(n);
      b.classList.toggle('hidden', n === 0);
      b.setAttribute('aria-label', n + ' items in cart');
    });
  }
  global.addEventListener('cart:changed', updateBadges);
  global.addEventListener('storage', function (e) { if (e.key === 'brand_cart_v1') updateBadges(); });

  /* ---------- global click handlers ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add-to-cart]');
    if (add) {
      e.preventDefault();
      var id = add.getAttribute('data-id');
      var p = CATALOG.byId(id);
      if (!p) return;
      if (Cart.add(id, 1)) {
        Store.Toast.show('Added “' + esc(p.name.length > 38 ? p.name.slice(0, 38) + '…' : p.name) + '” to your cart <a href="cart.html">View cart</a>');
      }
      return;
    }
    var ship = e.target.closest('[data-ship]');
    if (ship) {
      Store.Storage.set(SHIP_KEY, ship.getAttribute('data-ship'));
      var c = shipTo(), img = $('[data-ship-flag]');
      if (img) { img.src = 'assets/img/flags/' + c.code + '.png'; img.alt = c.name; }
      closeMenus();
      return;
    }
    if (e.target.closest('[data-demo-link]')) {
      e.preventDefault();
      Store.Toast.show('Demo link: the mobile apps do not exist.');
    }
  });

  /* newsletter (demo: nothing is sent anywhere) */
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'newsletter') return;
    e.preventDefault();
    var input = $('#nl-email'), msg = $('#nl-msg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.classList.toggle('is-invalid', !ok);
    msg.className = 'mt-2 min-h-[1.25rem] text-sm ' + (ok ? 'text-green-600' : 'text-red-600');
    msg.textContent = ok ? 'Thanks! This is a demo, so the address was not stored or sent anywhere.' : 'Please enter a valid email address.';
    if (ok) input.value = '';
  });

  /* ---------- mount ---------- */
  function mount() {
    var h = $('#site-header'), f = $('#site-footer'), mh = $('#m-header'), mn = $('#m-nav');
    if (h) h.outerHTML = desktopHeader();
    if (f) f.outerHTML = desktopFooter();
    if (mh) mh.outerHTML = mobileHeader({ back: mh.getAttribute('data-back'), title: mh.getAttribute('data-title') });
    if (mn) mn.outerHTML = mobileNav();
    // keep the search box in sync with the current query on listing pages
    var q = Store.Query.get('q', ''), cat = Store.Query.get('category', '');
    if ($('#hdr-q')) { $('#hdr-q').value = q; if ($('#hdr-cat')) $('#hdr-cat').value = cat; }
    if ($('#m-q')) $('#m-q').value = q;
    updateBadges();
  }
  global.Layout = { mount: mount, updateBadges: updateBadges, openDrawer: openDrawer, closeDrawer: closeDrawer };
  global.UI = UI;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(window);
