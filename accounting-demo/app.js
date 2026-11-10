// Demo Accounting Portal: a front-end sample with fictional data.
// The sign-in and code step below are for demonstration only. They are not real
// authentication, and nothing on these pages is sent to a server.
(function () {
  'use strict';

  var AUTH_KEY = 'accounting-demo-auth';
  var THEME_KEY = 'accounting-demo-theme';
  var DEMO_USER = 'demo';
  var DEMO_PASSWORD = 'demo1234';
  var DEMO_CODE = '123456';

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function store(area, key, value) {
    try {
      if (value === undefined) return window[area].getItem(key);
      if (value === null) window[area].removeItem(key);
      else window[area].setItem(key, value);
    } catch (e) {}
    return null;
  }

  // Builds an element; strings become text nodes, so text is never parsed as HTML
  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) {
      if (attrs[name] === false || attrs[name] == null) return;
      if (name === 'class') node.className = attrs[name];
      else if (name === 'html') node.innerHTML = attrs[name];
      else node.setAttribute(name, attrs[name] === true ? '' : attrs[name]);
    });
    Array.prototype.slice.call(arguments, 2).forEach(function (child) {
      if (child != null) node.append(child);
    });
    return node;
  }

  if (document.body.dataset.page === 'login') initLogin();
  else initDashboard();

  /* ---------- Login ---------- */
  function initLogin() {
    if (store('sessionStorage', AUTH_KEY) === '1') {
      location.replace('dashboard.html');
      return;
    }

    var username = $('#username');
    var password = $('#password');
    var code = $('#code');
    var passwordStep = $('#step-password');
    var codeStep = $('#step-code');
    var passwordError = $('#password-error');
    var codeError = $('#code-error');
    var toggle = $('#toggle-password');

    $('#fill-password').addEventListener('click', function () {
      username.value = DEMO_USER;
      password.value = DEMO_PASSWORD;
      passwordError.hidden = true;
      $('#password-form [type=submit]').focus();
    });

    toggle.addEventListener('click', function () {
      var show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', String(show));
    });

    $('#password-form').addEventListener('submit', function (event) {
      event.preventDefault();
      if (username.value.trim() === DEMO_USER && password.value === DEMO_PASSWORD) {
        passwordError.hidden = true;
        passwordStep.hidden = true;
        codeStep.hidden = false;
        code.focus();
        return;
      }
      passwordError.textContent = 'That username or password is incorrect. Use the demo account shown above.';
      passwordError.hidden = false;
      password.value = '';
      password.focus();
    });

    $('#fill-code').addEventListener('click', function () {
      code.value = DEMO_CODE;
      codeError.hidden = true;
      $('#code-form [type=submit]').focus();
    });

    code.addEventListener('input', function () {
      code.value = code.value.replace(/\D/g, '');
    });

    $('#code-form').addEventListener('submit', function (event) {
      event.preventDefault();
      if (code.value === DEMO_CODE) {
        store('sessionStorage', AUTH_KEY, '1');
        location.href = 'dashboard.html';
        return;
      }
      codeError.textContent = 'That code is incorrect. Use the demo code shown above.';
      codeError.hidden = false;
      code.value = '';
      code.focus();
    });

    $('#back-to-password').addEventListener('click', function () {
      codeStep.hidden = true;
      passwordStep.hidden = false;
      code.value = '';
      codeError.hidden = true;
      password.focus();
    });
  }

  /* ---------- Dashboard ---------- */
  function initDashboard() {
    var ICONS = {
      home: 'M3 11l9-8 9 8M5 9.5V20h14V9.5',
      coins: 'M12 3C7.6 3 4 4.3 4 6s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
      leaf: 'M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
      users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
      house: 'M3 12l9-9 9 9M9 21v-7h6v7',
      transfer: 'M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3',
      clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
      calendar: 'M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01',
      history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
      sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
      moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
      menu: 'M4 6h16M4 12h16M4 18h16',
      x: 'M6 6l12 12M18 6 6 18',
      chevron: 'M9 6l6 6-6 6',
      up: 'M4 17l6-6 4 4 6-8M15 7h5v5',
      down: 'M4 7l6 6 4-4 6 8M15 17h5v-5',
      flat: 'M5 12h14'
    };

    function icon(name, className) {
      return '<svg class="icon ' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg>';
    }

    var MENU = [
      { label: 'Dashboard', icon: 'home', current: true },
      { label: 'Payroll', icon: 'coins', items: ['Create Payroll', 'Manage Payroll', 'Salary & Benefits', 'Benefits History', 'Addons & Deductions'] },
      { label: 'Leaves & Benefits', icon: 'leaf', items: ['Leave Application', 'Time Adjustment', 'Overtime', 'EEO Application'] },
      { label: 'Employee Details', icon: 'users', items: ['HR Roster', 'Leave Credits', 'Monthly Leave Credits', 'Movement Tracker', 'Work Setup Tracker', 'Resigned Employees', 'Employee Infractions'] },
      { label: 'HSO Application', icon: 'house' },
      { label: 'Site Transfer', icon: 'transfer' },
      { label: 'Attendance', icon: 'clock' },
      { label: 'Calendar', icon: 'calendar' },
      { label: 'History', icon: 'history' }
    ];

    // Employees per bank are invented; average is the invented net pay per employee per period
    var COMPANIES = [
      { key: 'a', name: 'Company A', average: 14500, banks: [['Bank One', 52], ['Bank Two', 28], ['No bank info', 4]] },
      { key: 'b', name: 'Company B', average: 12800, banks: [['Bank One', 33], ['Bank Three', 24]] },
      { key: 'c', name: 'Company C', average: 16200, banks: [['Bank Two', 20], ['Bank Three', 11]] }
    ];

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var now = new Date();

    function peso(centavos) {
      return '₱' + (centavos / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function shortPeso(centavos) {
      var value = centavos / 100;
      if (value >= 1e6) return '₱' + (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
      if (value >= 1e3) return '₱' + Math.round(value / 1e3) + 'K';
      return '₱' + value;
    }

    function pad(number) { return String(number).padStart(2, '0'); }
    function day(date) { return MONTHS[date.getMonth()] + ' ' + pad(date.getDate()); }

    // The same inputs always produce the same made-up number
    function random(text) {
      var hash = 2166136261;
      for (var i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      hash = Math.imul(hash ^ (hash >>> 15), 2246822519);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489917);
      return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
    }

    // Semi-monthly periods, newest first, from the start of last year through the current one
    function buildPeriods() {
      var list = [];
      var year = now.getFullYear() - 1;
      for (var y = year; y <= now.getFullYear(); y++) {
        for (var m = 0; m < 12; m++) {
          [[1, 15], [16, new Date(y, m + 1, 0).getDate()]].forEach(function (half) {
            var from = new Date(y, m, half[0]);
            if (from <= now) list.push({ id: y + '-' + pad(m + 1) + '-' + pad(half[0]), from: from, to: new Date(y, m, half[1]) });
          });
        }
      }
      return list.reverse();
    }

    // All amounts are whole centavos, so bank rows always add up exactly to company totals
    function bankPay(period, company, bank) {
      var factor = 0.94 + random(period.id + company.key + bank[0]) * 0.12;
      return Math.round(bank[1] * company.average * factor * 100);
    }

    function companyTotal(period, company) {
      return company.banks.reduce(function (sum, bank) { return sum + bankPay(period, company, bank); }, 0);
    }

    function grandTotal(period) {
      return COMPANIES.reduce(function (sum, company) { return sum + companyTotal(period, company); }, 0);
    }

    function monthlyTotals(year, company) {
      var months = new Array(12).fill(0);
      periods.forEach(function (period) {
        if (period.to.getFullYear() === year) months[period.to.getMonth()] += companyTotal(period, company);
      });
      return months;
    }

    var periods = buildPeriods();
    var currentId = periods[0].id;
    var selectedPeriod = periods[0];
    var selectedYear = selectedPeriod.to.getFullYear();

    function previousOf(period) {
      return periods[periods.indexOf(period) + 1] || null;
    }

    function periodLabel(period) {
      return day(period.from) + ' – ' + day(period.to) + ', ' + period.to.getFullYear();
    }

    /* Shell */
    function demoMessage(label) {
      var drawer = $('#drawer');
      if (drawer.open) drawer.close();
      toast(label + ' is not part of this demo. Only the Dashboard opens.');
    }

    function renderNav(root) {
      MENU.forEach(function (entry) {
        if (entry.current) {
          root.append(el('a', { class: 'nav-link', href: 'dashboard.html', 'aria-current': 'page', html: icon(entry.icon) }, entry.label));
        } else if (entry.items) {
          var sub = el('div', { class: 'nav-sub' });
          entry.items.forEach(function (label) {
            var link = el('button', { type: 'button', class: 'nav-link' }, label);
            link.addEventListener('click', function () { demoMessage(label); });
            sub.append(link);
          });
          var summary = el('summary', { html: icon(entry.icon) }, entry.label);
          summary.insertAdjacentHTML('beforeend', icon('chevron', 'chev'));
          root.append(el('details', { class: 'nav-group' }, summary, sub));
        } else {
          var button = el('button', { type: 'button', class: 'nav-link', html: icon(entry.icon) }, entry.label);
          button.addEventListener('click', function () { demoMessage(entry.label); });
          root.append(button);
        }
      });
    }

    function renderThemeButton() {
      var dark = document.documentElement.dataset.theme === 'dark';
      var button = $('#theme-toggle');
      button.innerHTML = icon(dark ? 'sun' : 'moon');
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    function initShell() {
      renderNav($('#side-menu'));
      renderNav($('#drawer-menu'));
      renderThemeButton();

      $('#theme-toggle').addEventListener('click', function () {
        var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        store('localStorage', THEME_KEY, next);
        renderThemeButton();
      });

      $('#open-drawer').innerHTML = icon('menu');
      $('#close-drawer').innerHTML = icon('x');
      $('#open-drawer').addEventListener('click', function () { $('#drawer').showModal(); });
      $('#close-drawer').addEventListener('click', function () { $('#drawer').close(); });

      $$('[data-sign-out]').forEach(function (button) {
        button.addEventListener('click', function () {
          store('sessionStorage', AUTH_KEY, null);
          location.replace('index.html');
        });
      });

      document.addEventListener('mousemove', function (event) {
        var target = event.target.closest && event.target.closest('[data-tip]');
        if (target) showTip(target.dataset.tip, event.clientX, event.clientY);
        else hideTip();
      });
      document.addEventListener('focusin', function (event) {
        var target = event.target.closest('[data-tip]');
        if (target && target.matches(':focus-visible')) {
          var box = target.getBoundingClientRect();
          showTip(target.dataset.tip, box.left + box.width / 2, box.top);
        }
      });
      document.addEventListener('focusout', hideTip);
    }

    var toastTimer;
    function toast(message) {
      var node = $('#toast');
      node.textContent = message;
      node.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { node.hidden = true; }, 3200);
    }

    function hideTip() { $('#tip').hidden = true; }
    function showTip(text, x, y) {
      var tip = $('#tip');
      tip.textContent = text;
      tip.hidden = false;
      tip.style.left = Math.min(Math.max(8, x + 12), window.innerWidth - tip.offsetWidth - 8) + 'px';
      tip.style.top = Math.max(8, y - tip.offsetHeight - 12) + 'px';
    }

    /* Change from the previous period */
    function renderDelta(node, current, before, emptyText) {
      node.replaceChildren();
      if (before === null || before === 0) {
        node.textContent = emptyText;
        return;
      }
      var diff = current - before;
      var direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
      var sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
      var percent = Math.abs(diff) / Math.abs(before) * 100;
      node.insertAdjacentHTML('beforeend', icon(direction));
      node.append(sign + peso(Math.abs(diff)) + ' (' + sign + percent.toFixed(1) + '%)');
    }

    function renderPeriod() {
      var previous = previousOf(selectedPeriod);
      var total = grandTotal(selectedPeriod);
      var employees = 0;
      var groups = 0;

      $('#net-pay').textContent = peso(total);
      renderDelta($('#net-delta'), total, previous ? grandTotal(previous) : null, 'No previous payroll to compare');
      $('#period-label').textContent = periodLabel(selectedPeriod);
      $('#current-badge').hidden = selectedPeriod.id !== currentId;

      var root = $('#companies');
      root.replaceChildren();

      COMPANIES.forEach(function (company) {
        var sum = companyTotal(selectedPeriod, company);
        var count = 0;
        var body = el('tbody');

        company.banks.forEach(function (bank) {
          count += bank[1];
          groups++;
          var open = function () { toast('The employee list for ' + bank[0] + ' is not part of this demo.'); };
          var name = el('button', { type: 'button' }, bank[0]);
          var row = el('tr', {}, el('td', {}, name), el('td', {}, String(bank[1])), el('td', { class: 'amount' }, peso(bankPay(selectedPeriod, company, bank))));
          row.addEventListener('click', open);
          body.append(row);
        });
        employees += count;

        var delta = el('p', { class: 'delta' });
        renderDelta(delta, sum, previous ? companyTotal(previous, company) : null, 'No previous payroll');

        root.append(el('section', { class: 'company', 'aria-label': company.name },
          el('div', { class: 'company-head' },
            el('div', {},
              el('h3', {}, el('span', { class: 'swatch s-' + company.key }), company.name),
              el('p', { class: 'muted small' }, count + ' employees')
            ),
            el('div', { class: 'company-total' }, el('strong', { 'data-company-total': sum }, peso(sum)), delta)
          ),
          el('table', { class: 'bank-table' },
            el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'Bank'), el('th', { scope: 'col' }, 'Employees'), el('th', { scope: 'col' }, 'Net pay'))),
            body
          )
        ));
      });

      $('#employees').textContent = employees.toLocaleString('en-PH');
      $('#bank-groups').textContent = String(groups);
    }

    function niceStep(max) {
      var rough = max / 3;
      var power = Math.pow(10, Math.floor(Math.log10(rough)));
      var unit = rough / power;
      return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * power;
    }

    function renderYear() {
      var series = COMPANIES.map(function (company) { return monthlyTotals(selectedYear, company); });
      var highest = Math.max.apply(null, series.map(function (months) { return Math.max.apply(null, months); }));
      var step = highest ? niceStep(highest) : 1;
      var top = Math.ceil(highest / step) * step || 1;
      var overall = 0;

      var root = $('#graphs');
      root.replaceChildren();

      COMPANIES.forEach(function (company, index) {
        var months = series[index];
        var total = months.reduce(function (a, b) { return a + b; }, 0);
        overall += total;

        var plot = el('div', { class: 'plot', role: 'group', 'aria-label': 'Monthly net pay for ' + company.name + ' in ' + selectedYear });
        for (var value = 0; value <= top; value += step) {
          plot.append(el('div', { class: 'gridline', style: 'bottom:' + (value / top * 100) + '%' }, el('span', {}, value ? shortPeso(value) : '₱0')));
        }
        var labels = el('div', { class: 'months', 'aria-hidden': 'true' });
        months.forEach(function (amount, month) {
          var detail = MONTHS[month] + ': ' + (amount ? peso(amount) : 'no payroll yet');
          var col = el('div', { class: 'col', tabindex: '0', role: 'img', 'aria-label': company.name + ', ' + detail, 'data-tip': detail });
          if (amount) col.append(el('span', { class: 'bar s-' + company.key, style: 'height:' + (amount / top * 100).toFixed(2) + '%' }));
          plot.append(col);
          var isNow = selectedYear === now.getFullYear() && month === now.getMonth();
          labels.append(el('span', { class: isNow ? 'current' : '' }, MONTHS[month]));
        });

        root.append(el('section', { class: 'graph', 'aria-label': company.name },
          el('div', { class: 'graph-head' },
            el('h3', {}, el('span', { class: 'swatch s-' + company.key }), company.name),
            el('strong', {}, peso(total))
          ),
          plot,
          labels
        ));
      });

      $('#year-label').textContent = 'Net pay in ' + selectedYear;
      $('#year-total').textContent = peso(overall);
      $('#year-sub').textContent = 'Monthly net pay by company in ' + selectedYear + ', on the same scale';

      var table = $('#year-table');
      table.replaceChildren();
      var head = el('tr', {}, el('th', { scope: 'col' }, 'Month'));
      COMPANIES.forEach(function (company) { head.append(el('th', { scope: 'col' }, company.name)); });
      var body = el('tbody');
      MONTHS.forEach(function (name, month) {
        if (!series.some(function (months) { return months[month]; })) return;
        var row = el('tr', {}, el('td', {}, name));
        series.forEach(function (months) { row.append(el('td', {}, peso(months[month]))); });
        body.append(row);
      });
      table.append(el('thead', {}, head), body);
    }

    function initPickers() {
      var yearSelect = $('#year');
      var periodSelect = $('#period');

      periods.map(function (p) { return p.to.getFullYear(); })
        .filter(function (year, index, list) { return list.indexOf(year) === index; })
        .forEach(function (year) { yearSelect.append(el('option', { value: year }, String(year))); });

      periods.forEach(function (period) {
        var label = day(period.from) + ', ' + period.from.getFullYear() + ' – ' + day(period.to) + ', ' + period.to.getFullYear();
        periodSelect.append(el('option', { value: period.id }, label + (period.id === currentId ? ' (Current)' : '')));
      });

      yearSelect.value = String(selectedYear);
      periodSelect.value = selectedPeriod.id;

      yearSelect.addEventListener('change', function () {
        selectedYear = Number(yearSelect.value);
        renderYear();
      });

      // Picking a period also shows that period's year
      periodSelect.addEventListener('change', function () {
        selectedPeriod = periods.filter(function (p) { return p.id === periodSelect.value; })[0];
        selectedYear = selectedPeriod.to.getFullYear();
        yearSelect.value = String(selectedYear);
        renderPeriod();
        renderYear();
      });
    }

    initShell();
    initPickers();
    renderPeriod();
    renderYear();
  }
})();
