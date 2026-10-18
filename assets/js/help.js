/* help.html: demo contact form validation */
(function () {
  'use strict';
  var form = $('#contact-form');
  function check(input, bad, text) {
    var err = input.parentNode.querySelector('[data-err]');
    input.classList.toggle('is-invalid', bad); err.textContent = bad ? text : ''; err.classList.toggle('hidden', !bad);
    return !bad;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = [
      check($('#c-name'), $('#c-name').value.trim().length < 2, 'Enter your name.'),
      check($('#c-email'), !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#c-email').value.trim()), 'Enter a valid email address.'),
      check($('#c-msg'), $('#c-msg').value.trim().length < 10, 'Write at least 10 characters.')
    ].every(Boolean);
    $('#c-ok').classList.toggle('hidden', !ok);
    if (ok) form.reset();
  });
})();
