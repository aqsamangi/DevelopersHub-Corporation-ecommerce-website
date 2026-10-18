/* login.html: demo sign in / register with validation (nothing is sent anywhere) */
(function () {
  'use strict';
  var login = $('#form-login'), reg = $('#form-register'), msg = $('#auth-msg');
  var tabL = $('#tab-login'), tabR = $('#tab-register');
  function show(which) {
    var isReg = which === 'register';
    login.classList.toggle('hidden', isReg); reg.classList.toggle('hidden', !isReg);
    tabL.setAttribute('aria-selected', String(!isReg)); tabR.setAttribute('aria-selected', String(isReg));
    tabL.className = 'rounded py-2 ' + (!isReg ? 'bg-white text-primary shadow-card' : 'text-gray-500');
    tabR.className = 'rounded py-2 ' + (isReg ? 'bg-white text-primary shadow-card' : 'text-gray-500');
    $('#auth-title').textContent = isReg ? 'Create your account' : 'Welcome back';
    msg.classList.add('hidden');
  }
  tabL.addEventListener('click', function () { show('login'); history.replaceState(null, '', '#'); });
  tabR.addEventListener('click', function () { show('register'); history.replaceState(null, '', '#register'); });
  show(location.hash === '#register' ? 'register' : 'login');

  function check(input, bad, text) {
    var err = input.parentNode.querySelector('[data-err]');
    input.classList.toggle('is-invalid', bad); input.setAttribute('aria-invalid', String(bad));
    err.textContent = bad ? text : ''; err.classList.toggle('hidden', !bad);
    return !bad;
  }
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };
  login.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = check($('#l-email'), !emailOk($('#l-email').value), 'Enter a valid email address.');
    var b = check($('#l-pass'), $('#l-pass').value.length < 1, 'Enter your password.');
    if (a && b) { msg.textContent = 'Signed in (demo). No real account was used.'; msg.classList.remove('hidden'); }
    else msg.classList.add('hidden');
  });
  reg.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = [
      check($('#r-name'), $('#r-name').value.trim().length < 2, 'Enter your name.'),
      check($('#r-email'), !emailOk($('#r-email').value), 'Enter a valid email address.'),
      check($('#r-pass'), $('#r-pass').value.length < 8, 'Use at least 8 characters.'),
      check($('#r-pass2'), $('#r-pass2').value !== $('#r-pass').value || !$('#r-pass2').value, 'Passwords do not match.')
    ].every(Boolean);
    if (ok) { msg.textContent = 'Account created (demo). Nothing was saved or sent.'; msg.classList.remove('hidden'); reg.reset(); }
    else msg.classList.add('hidden');
  });
})();
