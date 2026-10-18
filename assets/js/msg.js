/* msg.html: small demo chat. Messages live in localStorage, replies are canned. */
(function () {
  'use strict';
  var esc = Utils.esc, KEY = 'brand_msgs_v1';
  var threads = [
    { id: 'nordwear', name: 'Nordwear Trading Co.', seed: 'Hello! Thanks for your interest in our clothing range. How many pieces do you need?' },
    { id: 'voltix', name: 'Voltix Trading Co.', seed: 'Hi, our laptops and tablets are in stock. Would you like a quote?' },
    { id: 'casaverde', name: 'Casa Verde Trading Co.', seed: 'Welcome! Our home décor items ship worldwide.' }
  ];
  var store = Store.Storage.get(KEY, {});
  var current = Store.Query.get('t', threads[0].id);
  if (!threads.some(function (t) { return t.id === current; })) current = threads[0].id;
  var replies = ['Thanks for your message! A sales representative will review it soon (demo reply).', 'Great, we can offer free shipping on orders over $100 (demo reply).', 'Noted. Do you need a custom quote for larger quantities? (demo reply)'];

  function msgs(id) { return store[id] || [{ from: 'them', text: threads.filter(function (t) { return t.id === id; })[0].seed }]; }
  function draw() {
    $('#threads').innerHTML = threads.map(function (t) {
      var on = t.id === current, last = msgs(t.id).slice(-1)[0];
      return '<li><button type="button" data-t="' + t.id + '" class="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50 ' + (on ? 'bg-primary-light/60' : '') + '"' + (on ? ' aria-current="true"' : '') + '>' +
        '<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint font-bold text-primary-dark">' + esc(t.name.charAt(0)) + '</span><span class="min-w-0"><span class="block truncate text-sm font-medium">' + esc(t.name) + '</span><span class="block truncate text-xs text-gray-400">' + esc(last.text) + '</span></span></button></li>';
    }).join('');
    $('#thread-head').textContent = threads.filter(function (t) { return t.id === current; })[0].name;
    var body = $('#thread-body');
    body.innerHTML = msgs(current).map(function (m) {
      return '<div class="flex ' + (m.from === 'me' ? 'justify-end' : '') + '"><p class="max-w-[80%] rounded-lg px-3 py-2 text-sm ' + (m.from === 'me' ? 'bg-primary text-white' : 'bg-white shadow-card') + '">' + esc(m.text) + '</p></div>';
    }).join('');
    body.scrollTop = body.scrollHeight;
  }
  $('#threads').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { current = b.getAttribute('data-t'); draw(); } });
  $('#msg-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#msg-input'), text = input.value.trim();
    if (!text) { input.focus(); return; }
    var list = msgs(current).slice(); list.push({ from: 'me', text: text }); store[current] = list; input.value = '';
    Store.Storage.set(KEY, store); draw();
    setTimeout(function () {
      var l2 = msgs(current).slice(); l2.push({ from: 'them', text: replies[l2.length % replies.length] }); store[current] = l2;
      Store.Storage.set(KEY, store); draw();
    }, 900);
  });
  draw();
})();
