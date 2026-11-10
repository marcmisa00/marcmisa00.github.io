// Demo Employee Portal: a front-end sample with fictional data.
// The sign-in below is for demonstration only. It is not real authentication,
// and nothing on these pages is sent to a server.
(function () {
  'use strict';

  var AUTH_KEY = 'portal-demo-auth';
  var THEME_KEY = 'portal-demo-theme';
  var CLOCK_KEY = 'portal-demo-clock';
  var DEMO_ID = 'demo';
  var DEMO_PASSWORD = 'demo1234';

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
      if (child == null) return;
      node.append(child);
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

    var form = $('#login-form');
    var idno = $('#idno');
    var password = $('#password');
    var error = $('#login-error');
    var toggle = $('#toggle-password');

    $('#fill-demo').addEventListener('click', function () {
      idno.value = DEMO_ID;
      password.value = DEMO_PASSWORD;
      error.hidden = true;
      form.querySelector('[type=submit]').focus();
    });

    toggle.addEventListener('click', function () {
      var show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', String(show));
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (idno.value.trim() === DEMO_ID && password.value === DEMO_PASSWORD) {
        store('sessionStorage', AUTH_KEY, '1');
        location.href = 'dashboard.html';
        return;
      }
      error.textContent = 'That employee ID or password is incorrect. Use the demo account shown above.';
      error.hidden = false;
      password.value = '';
      password.focus();
    });
  }

  /* ---------- Dashboard ---------- */
  function initDashboard() {
    var ICONS = {
      home: 'M3 11l9-8 9 8M5 9.5V20h14V9.5',
      send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
      folder: 'M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
      sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
      moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
      menu: 'M4 6h16M4 12h16M4 18h16',
      x: 'M6 6l12 12M18 6 6 18',
      chevron: 'M9 6l6 6-6 6',
      eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
      enter: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
      exit: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
      coffee: 'M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v3M10 2v3M14 2v3',
      back: 'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3'
    };

    function icon(name, className) {
      return '<svg class="icon ' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg>';
    }

    var MENU = [
      { label: 'Dashboard', icon: 'home', current: true },
      { label: 'Apply', icon: 'send', items: ['Leave', 'Time adjustment', 'Overtime', 'Emergency early out', 'Home-site office'] },
      { label: 'My records', icon: 'folder', items: ['Payslips', 'Log details', 'Infractions', 'Emergency contacts'] },
      { label: 'Company files', icon: 'book', items: ['Company handbook', 'Admin memos', 'HR memos', 'IT memos', 'Operations memos'] }
    ];

    var STEPS = [
      { key: 'in', label: 'Time in', icon: 'enter' },
      { key: 'lunchOut', label: 'Lunch out', icon: 'coffee' },
      { key: 'lunchIn', label: 'Lunch in', icon: 'back' },
      { key: 'out', label: 'Time out', icon: 'exit' }
    ];

    var SERIES = [
      { key: 'present', label: 'Present' },
      { key: 'absent', label: 'Absent' },
      { key: 'leave', label: 'Leave' }
    ];

    var now = new Date();
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function shortDate(date) { return MONTHS[date.getMonth()] + ' ' + date.getDate(); }
    function longDate(date) { return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
    function dateKey(date) { return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); }
    function plural(count, word) { return count + ' ' + word + (count === 1 ? '' : 's'); }

    // The same date always gets the same made-up status, so every card agrees
    function random(date) {
      var seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      seed = Math.imul(seed ^ (seed >>> 15), 2246822519);
      seed = Math.imul(seed ^ (seed >>> 13), 3266489917);
      return ((seed ^ (seed >>> 16)) >>> 0) / 4294967296;
    }

    function statusFor(date) {
      var r = random(date);
      if (r < 0.03) return { status: 'absent', late: false };
      if (r < 0.065) return { status: 'leave', late: false };
      return { status: 'present', late: r < 0.115 };
    }

    function isWorkday(date) { return date.getDay() !== 0 && date.getDay() !== 6; }
    function isPast(date) { return date < new Date(now.getFullYear(), now.getMonth(), now.getDate()); }

    function workdays(from, to) {
      var days = [];
      for (var d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (isWorkday(d)) days.push(new Date(d));
      }
      return days;
    }

    function tally(days) {
      var counts = { present: 0, absent: 0, leave: 0, late: 0 };
      days.filter(isPast).forEach(function (day) {
        var result = statusFor(day);
        counts[result.status]++;
        if (result.late) counts.late++;
      });
      return counts;
    }

    /* Shell */
    function closeFlyouts(except) {
      $$('.flyout').forEach(function (flyout) { if (flyout !== except) flyout.hidden = true; });
      $$('[data-flyout-toggle]').forEach(function (button) {
        if (!except || button.dataset.flyoutToggle !== except.id) button.setAttribute('aria-expanded', 'false');
      });
    }

    function demoLink(label) {
      var button = el('button', { type: 'button', class: 'menu-link' }, label);
      button.addEventListener('click', function () {
        closeFlyouts();
        var drawer = $('#drawer');
        if (drawer.open) drawer.close();
        toast(label + ' is not part of this demo. Only the Dashboard opens.');
      });
      return button;
    }

    function renderMenu() {
      var rail = $('#rail-menu');
      var drawer = $('#drawer-menu');

      MENU.forEach(function (group, index) {
        var item = el('li', { class: 'rail-item' });
        if (group.items) {
          var id = 'flyout-' + index;
          item.append(el('button', { type: 'button', class: 'rail-btn', 'data-flyout-toggle': id, 'aria-expanded': 'false', 'aria-label': group.label, 'data-tip': group.label, html: icon(group.icon) }));
          var flyout = el('div', { class: 'flyout', id: id, hidden: true }, el('p', { class: 'menu-title' }, group.label));
          group.items.forEach(function (label) { flyout.append(demoLink(label)); });
          item.append(flyout);

          var section = el('div', {}, el('p', { class: 'menu-title' }, group.label));
          group.items.forEach(function (label) { section.append(demoLink(label)); });
          drawer.append(section);
        } else {
          item.append(el('a', { class: 'rail-btn', href: 'dashboard.html', 'aria-current': 'page', 'aria-label': group.label, 'data-tip': group.label, html: icon(group.icon) }));
          drawer.append(el('a', { class: 'menu-link', href: 'dashboard.html', 'aria-current': 'page' }, group.label));
        }
        rail.append(item);
      });

      document.addEventListener('click', function (event) {
        var toggle = event.target.closest('[data-flyout-toggle]');
        if (toggle) {
          var target = document.getElementById(toggle.dataset.flyoutToggle);
          var open = target.hidden;
          closeFlyouts(open ? target : null);
          target.hidden = !open;
          toggle.setAttribute('aria-expanded', String(open));
          hideTip();
        } else if (!event.target.closest('.flyout')) {
          closeFlyouts();
        }
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeFlyouts();
      });

      $('#open-drawer').innerHTML = icon('menu');
      $('#open-drawer').addEventListener('click', function () { $('#drawer').showModal(); });
      $('.drawer [data-close-dialog]').innerHTML = icon('x');
      $$('[data-close-dialog]').forEach(function (button) {
        button.addEventListener('click', function () { button.closest('dialog').close(); });
      });
      $$('[data-sign-out]').forEach(function (button) {
        button.addEventListener('click', function () {
          store('sessionStorage', AUTH_KEY, null);
          store('sessionStorage', CLOCK_KEY, null);
          location.replace('index.html');
        });
      });
    }

    function renderThemeButtons() {
      var dark = document.documentElement.dataset.theme === 'dark';
      $$('[data-theme-toggle]').forEach(function (button) {
        button.innerHTML = icon(dark ? 'sun' : 'moon');
        button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        if (button.dataset.tip) button.dataset.tip = dark ? 'Light theme' : 'Dark theme';
      });
    }

    function initTheme() {
      renderThemeButtons();
      $$('[data-theme-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
          var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.dataset.theme = next;
          store('localStorage', THEME_KEY, next);
          renderThemeButtons();
          hideTip();
        });
      });
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
      var left = Math.min(Math.max(8, x + 12), window.innerWidth - tip.offsetWidth - 8);
      var top = Math.max(8, y - tip.offsetHeight - 12);
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }

    function initTips() {
      document.addEventListener('mousemove', function (event) {
        var target = event.target.closest && event.target.closest('[data-tip]');
        if (target && !(target.getAttribute('aria-expanded') === 'true')) showTip(target.dataset.tip, event.clientX, event.clientY);
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

    /* Clock */
    function readStamps() {
      try {
        var saved = JSON.parse(store('sessionStorage', CLOCK_KEY) || 'null');
        if (saved && saved.date === dateKey(now)) return saved.stamps;
      } catch (e) {}
      return {};
    }

    var stamps = readStamps();
    var pending = null;

    function nextStep() {
      return STEPS.filter(function (step) { return !stamps[step.key]; })[0] || null;
    }

    function timeText(date) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    function tick() {
      var date = new Date();
      var parts = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ');
      var clock = $('#clock-time');
      clock.textContent = parts[0];
      clock.append(el('span', {}, parts[1]));
      $('#clock-date').textContent = longDate(date);
    }

    function askConfirm(step) {
      pending = step;
      $('#confirm-title').textContent = step.label;
      $('#confirm').showModal();
    }

    function renderSteps() {
      var next = nextStep();
      var list = $('#steps');
      var buttons = $('#step-buttons');
      var main = $('#clock-next');
      list.replaceChildren();
      buttons.replaceChildren();
      main.replaceChildren();

      STEPS.forEach(function (step) {
        var done = stamps[step.key];
        var isNext = next && next.key === step.key;
        var state = done ? 'done' : isNext ? 'next' : '';
        list.append(el('li', {},
          el('span', { class: 'step-dot ' + state, html: icon(step.icon) }),
          el('span', {}, step.label),
          el('span', { class: 'step-state ' + state }, done || (isNext ? 'Next' : 'Pending'))
        ));

        var button = el('button', { type: 'button', class: 'step-btn ' + (isNext ? 'next' : ''), disabled: !!done }, done ? step.label + ' · done' : step.label);
        button.addEventListener('click', function () { askConfirm(step); });
        buttons.append(button);
      });

      if (next) {
        var big = el('button', { type: 'button', class: 'clock-main', html: icon(next.icon) });
        big.append(next.label);
        big.addEventListener('click', function () { askConfirm(next); });
        main.append(big);
      } else {
        main.append(el('p', { class: 'clock-done' }, "All four logs are in. You're done for today."));
      }
    }

    function initClock() {
      tick();
      setInterval(tick, 1000);
      renderSteps();
      $('#confirm-submit').addEventListener('click', function () {
        if (!pending) return;
        stamps[pending.key] = timeText(new Date());
        store('sessionStorage', CLOCK_KEY, JSON.stringify({ date: dateKey(now), stamps: stamps }));
        toast(pending.label + ' recorded for this demo.');
        pending = null;
        $('#confirm').close();
        renderSteps();
      });
    }

    /* Profile */
    var HIRED = new Date(2023, 2, 15);

    function renderProfile() {
      var months = (now.getFullYear() - HIRED.getFullYear()) * 12 + now.getMonth() - HIRED.getMonth();
      if (now.getDate() < HIRED.getDate()) months--;
      var years = Math.floor(months / 12);

      $('#identity').append(
        el('div', { class: 'identity-top' },
          el('span', { class: 'identity-avatar', 'aria-hidden': 'true' }, 'AR'),
          el('div', {},
            el('p', { class: 'identity-name' }, 'Alex Rivera'),
            el('p', { class: 'muted small' }, 'DEMO-0001'),
            el('span', { class: 'pill' }, 'Regular')
          )
        ),
        el('div', { class: 'service' },
          el('p', { class: 'muted small' }, 'Length of service'),
          el('strong', {}, plural(years, 'year') + ', ' + plural(months % 12, 'month'))
        ),
        el('ol', { class: 'milestones' },
          el('li', {}, el('span', {}, 'Date hired'), el('span', {}, 'Mar 15, 2023')),
          el('li', {}, el('span', {}, 'Regularized'), el('span', {}, 'Sep 15, 2023'))
        )
      );

      var fields = {
        personal: [['Full name', 'Alex Rivera'], ['Birthday', 'Jan 1, 1995'], ['Mobile', '0900 000 0000'], ['Email', 'alex.rivera@example.com'], ['Address', '123 Sample Street, Demo City'], ['Emergency contact', 'Sam Rivera']],
        employment: [['Company', 'Sample Company'], ['Department', 'Operations'], ['Position', 'Operations Associate'], ['Employment type', 'Full-time'], ['Schedule', '8:00 AM – 5:00 PM'], ['Immediate head', 'Jordan Lee']]
      };
      var ids = [['Tax ID', '000-000-001234'], ['Social security', '00-0000000-5678'], ['Health insurance', '00-000000000-9'], ['Housing fund', '0000-0000-4321']];
      var deductions = [['Social security', 450], ['Health insurance', 300], ['Housing fund', 100], ['Uniform', 150]];

      var tabs = [['personal', 'Personal'], ['employment', 'Employment'], ['ids', 'Government IDs'], ['deductions', 'Deductions']];
      var tablist = $('#tabs');
      var panels = $('#panels');

      function tiles(rows) {
        var list = el('dl', { class: 'tiles' });
        rows.forEach(function (row) { list.append(el('div', { class: 'tile' }, el('dt', {}, row[0]), el('dd', {}, row[1]))); });
        return list;
      }

      function mask(value) { return value.replace(/\d(?=.*\d{4})/g, '•'); }

      function idsPanel() {
        var wrap = el('div', {});
        var list = el('dl', { class: 'tiles' });
        var values = ids.map(function (row) {
          var value = el('dd', { class: 'mono' }, mask(row[1]));
          list.append(el('div', { class: 'tile' }, el('dt', {}, row[0]), value));
          return value;
        });
        var shown = false;
        var label = el('span', {}, 'Show numbers');
        var reveal = el('button', { type: 'button', class: 'reveal', html: icon('eye') }, label);
        reveal.addEventListener('click', function () {
          shown = !shown;
          values.forEach(function (node, index) { node.textContent = shown ? ids[index][1] : mask(ids[index][1]); });
          label.textContent = shown ? 'Hide numbers' : 'Show numbers';
        });
        wrap.append(list, reveal);
        return wrap;
      }

      function deductionsPanel() {
        var list = el('ul', { class: 'tiles' });
        var total = 0;
        deductions.forEach(function (row) {
          total += row[1];
          list.append(el('li', { class: 'tile row' }, el('span', {}, row[0]), el('span', { class: 'tile-value' }, row[1].toFixed(2))));
        });
        list.append(el('li', { class: 'tile row total' }, el('span', {}, 'Total'), el('span', {}, total.toFixed(2))));
        return list;
      }

      var contents = { personal: tiles(fields.personal), employment: tiles(fields.employment), ids: idsPanel(), deductions: deductionsPanel() };

      function select(key, focus) {
        $$('.tab', tablist).forEach(function (tab) {
          var active = tab.dataset.tab === key;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          if (active && focus) tab.focus();
        });
        $$('[role=tabpanel]', panels).forEach(function (panel) { panel.hidden = panel.dataset.panel !== key; });
      }

      tabs.forEach(function (entry, index) {
        var tab = el('button', { type: 'button', class: 'tab', role: 'tab', id: 'tab-' + entry[0], 'data-tab': entry[0], 'aria-controls': 'panel-' + entry[0] }, entry[1]);
        tab.addEventListener('click', function () { select(entry[0]); });
        tab.addEventListener('keydown', function (event) {
          var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          if (step) select(tabs[(index + step + tabs.length) % tabs.length][0], true);
        });
        tablist.append(tab);
        panels.append(el('div', { role: 'tabpanel', id: 'panel-' + entry[0], 'data-panel': entry[0], 'aria-labelledby': 'tab-' + entry[0] }, contents[entry[0]]));
      });
      select('personal');
    }

    /* Cut-off ring */
    function renderCutOff() {
      var firstHalf = now.getDate() <= 15;
      var start = new Date(now.getFullYear(), now.getMonth(), firstHalf ? 1 : 16);
      var end = firstHalf ? new Date(now.getFullYear(), now.getMonth(), 15) : new Date(now.getFullYear(), now.getMonth() + 1, 0);
      var days = workdays(start, end);
      var counts = tally(days);
      var recorded = counts.present + counts.absent + counts.leave;

      $('#cutoff-range').textContent = shortDate(start) + ' – ' + shortDate(end) + ', ' + end.getFullYear();

      var ns = 'http://www.w3.org/2000/svg';
      var ring = $('#ring');
      var radius = 54;
      var circumference = 2 * Math.PI * radius;
      var group = document.createElementNS(ns, 'g');
      group.setAttribute('transform', 'rotate(-90 70 70)');

      function circle(className, style) {
        var node = document.createElementNS(ns, 'circle');
        node.setAttribute('cx', 70);
        node.setAttribute('cy', 70);
        node.setAttribute('r', radius);
        node.setAttribute('class', className);
        if (style) node.setAttribute('style', style);
        group.append(node);
        return node;
      }

      circle('track');
      var offset = 0;
      SERIES.forEach(function (series) {
        if (!counts[series.key]) return;
        var length = circumference * counts[series.key] / Math.max(1, days.length);
        var mark = circle('', 'stroke: var(--series-' + series.key + ')');
        mark.setAttribute('stroke-dasharray', Math.max(1, length - 2).toFixed(2) + ' ' + circumference.toFixed(2));
        mark.setAttribute('stroke-dashoffset', (-offset).toFixed(2));
        mark.setAttribute('data-tip', series.label + ': ' + plural(counts[series.key], 'day'));
        offset += length;
      });
      ring.append(group);

      [[70, 70, 'ring-value', String(recorded)], [70, 90, 'ring-label', 'of ' + days.length + ' days']].forEach(function (row) {
        var text = document.createElementNS(ns, 'text');
        text.setAttribute('x', row[0]);
        text.setAttribute('y', row[1]);
        text.setAttribute('class', row[2]);
        text.textContent = row[3];
        ring.append(text);
      });
      ring.setAttribute('aria-label', SERIES.map(function (s) { return counts[s.key] + ' ' + s.label.toLowerCase(); }).join(', ') + ', out of ' + days.length + ' days');

      var legend = $('#cutoff-legend');
      SERIES.forEach(function (series) {
        legend.append(el('li', {}, el('span', { class: 'swatch s-' + series.key }), el('span', {}, series.label), el('strong', {}, String(counts[series.key]))));
      });
      legend.append(el('li', {}, el('span', { class: 'swatch hollow' }), el('span', {}, 'Late'), el('strong', {}, String(counts.late))));

      $('#paid-hours').textContent = ((counts.present + counts.leave) * 8).toFixed(2) + ' hrs';
    }

    /* Year chart, leave credits and points all come from the same generated days */
    function renderYear() {
      var year = now.getFullYear();
      var scaleMax = 25;
      var chartHeight = 154;
      var months = MONTHS.map(function (name, index) {
        var first = new Date(year, index, 1);
        var days = workdays(first, new Date(year, index + 1, 0));
        var counts = tally(days);
        return { name: name, index: index, future: first > now, counts: counts, total: counts.present + counts.absent + counts.leave };
      });
      var totals = months.reduce(function (sum, month) {
        SERIES.forEach(function (s) { sum[s.key] += month.counts[s.key]; });
        sum.late += month.counts.late;
        return sum;
      }, { present: 0, absent: 0, leave: 0, late: 0 });
      var working = totals.present + totals.absent + totals.leave;

      $('#year-heading').textContent = year + ' attendance';
      $('#year-days').textContent = plural(working, 'working day');
      $('#present-rate').textContent = working ? Math.round(totals.present / working * 100) + '%' : '—';

      var legend = $('#year-legend');
      SERIES.forEach(function (series) {
        legend.append(el('li', {}, el('span', { class: 'swatch s-' + series.key }), el('span', {}, el('strong', {}, String(totals[series.key])), ' ' + series.label.toLowerCase())));
      });

      var bars = $('#bars');
      var grid = el('div', { class: 'bars-grid' });
      [0, 10, 20].forEach(function (value) {
        var line = el('div', { style: 'bottom:' + (value / scaleMax * chartHeight) + 'px' }, el('span', {}, String(value)));
        grid.append(line);
      });
      bars.append(grid);

      var table = $('#year-table');
      table.append(el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'Month'), el('th', { scope: 'col' }, 'Present'), el('th', { scope: 'col' }, 'Absent'), el('th', { scope: 'col' }, 'Leave'), el('th', { scope: 'col' }, 'Late'))));
      var body = el('tbody');

      months.forEach(function (month) {
        var detail = month.total
          ? month.name + ': ' + month.counts.present + ' present, ' + month.counts.absent + ' absent, ' + month.counts.leave + ' leave, ' + month.counts.late + ' late'
          : month.name + ': no data yet';
        var col = el('div', { class: 'bar-col' + (month.index === now.getMonth() ? ' current' : ''), tabindex: '0', role: 'img', 'aria-label': detail, 'data-tip': detail });
        // Top of the stack first; the column is bottom-aligned
        SERIES.slice().reverse().forEach(function (series) {
          var count = month.counts[series.key];
          if (count) col.append(el('span', { class: 'bar-seg s-' + series.key, style: 'height:' + Math.max(3, count / scaleMax * chartHeight - 2).toFixed(1) + 'px' }));
        });
        col.append(el('span', { class: 'bar-label' }, month.name));
        bars.append(col);

        if (!month.future) {
          body.append(el('tr', {}, el('td', {}, month.name), el('td', {}, String(month.counts.present)), el('td', {}, String(month.counts.absent)), el('td', {}, String(month.counts.leave)), el('td', {}, String(month.counts.late))));
        }
      });
      table.append(body);
    }

    function pastDaysThisYear() {
      return workdays(new Date(now.getFullYear(), 0, 1), now).filter(isPast);
    }

    function renderLeave() {
      var types = [
        { label: 'Vacation leave', credit: 10, dates: [] },
        { label: 'Sick leave', credit: 8, dates: [] },
        { label: 'Emergency leave', credit: 3, dates: [] },
        { label: 'Bereavement leave', credit: 3, dates: [] }
      ];
      var pattern = [0, 1, 0, 1, 2];
      var count = 0;
      pastDaysThisYear().forEach(function (day) {
        if (statusFor(day).status === 'leave') {
          types[pattern[count % pattern.length]].dates.push(shortDate(day));
          count++;
        }
      });

      $('#leave-period').textContent = 'Period Jan – Dec ' + now.getFullYear();
      var root = $('#leave');
      root.append(el('div', { class: 'leave-head' }, el('span', {}, 'Type'), el('span', {}, 'Credit'), el('span', {}, 'Used'), el('span', {}, 'Left')));
      types.forEach(function (type) {
        var used = type.dates.length;
        var name = el('span', { html: icon('chevron', 'chev') });
        name.append(type.label);
        var details = el('details', {},
          el('summary', { class: 'leave-row' }, name, el('span', {}, String(type.credit)), el('span', {}, String(used)), el('span', {}, String(Math.max(0, type.credit - used))))
        );
        var dates = el('div', { class: 'leave-dates' });
        if (used) type.dates.forEach(function (date) { dates.append(el('span', {}, date)); });
        else dates.append('No dates recorded.');
        details.append(dates);
        root.append(details);
      });
    }

    function renderAnnouncements() {
      var items = [
        { days: 1, title: 'Year-end party: save the date', body: 'Join everyone at the Demo City Hall for dinner and awards. Details will follow from the events team.', read: false },
        { days: 4, title: 'New time adjustment deadline', body: 'Time adjustments must now be filed within three working days of the affected log.', read: false },
        { days: 12, title: 'Annual health check schedule', body: 'Health checks run for two weeks at the clinic on the second floor. Book a slot with your team lead.', read: true },
        { days: 20, title: 'Office closed for maintenance', body: 'The office will be closed for electrical maintenance on Saturday. Plan remote work accordingly.', read: true }
      ];
      var root = $('#announcements');
      var badge = $('#unread');

      function updateBadge() {
        var unread = items.filter(function (item) { return !item.read; }).length;
        badge.textContent = unread ? unread + ' unread' : items.length + ' total';
      }

      items.forEach(function (item) {
        var posted = new Date(now);
        posted.setDate(posted.getDate() - item.days);
        var dot = item.read ? null : el('span', { class: 'unread-dot', title: 'Not yet read' });
        var details = el('details', { class: 'announcement', name: 'announcements' },
          el('summary', {},
            el('span', {},
              el('span', { class: 'announcement-meta' }, dot, shortDate(posted)),
              el('span', { class: 'announcement-title' }, item.title)
            ),
            el('span', { html: icon('chevron', 'chev') })
          ),
          el('p', {}, item.body)
        );
        details.addEventListener('toggle', function () {
          if (details.open && !item.read) {
            item.read = true;
            if (dot) dot.remove();
            updateBadge();
          }
        });
        root.append(details);
      });
      updateBadge();
    }

    function renderPoints() {
      var byMonth = {};
      var total = 0;
      pastDaysThisYear().forEach(function (day) {
        if (statusFor(day).late) {
          var month = day.toLocaleDateString('en-US', { month: 'long' });
          (byMonth[month] = byMonth[month] || []).unshift(shortDate(day));
          total += 0.5;
        }
      });

      $('#points-total').textContent = now.getFullYear() + ' · ' + total.toFixed(1) + ' total';
      var root = $('#points');
      var names = Object.keys(byMonth).reverse();
      if (!names.length) {
        root.append(el('p', { class: 'empty' }, 'Clean record. No points so far this year.'));
        return;
      }
      names.forEach(function (name) {
        var list = el('ul', { class: 'points' });
        byMonth[name].forEach(function (date) {
          list.append(el('li', {}, el('span', {}, 'Late arrival · ' + date), el('strong', {}, '0.5')));
        });
        root.append(el('div', {}, el('p', { class: 'points-month' }, name), list));
      });
    }

    var hour = now.getHours();
    $('#today-date').textContent = longDate(now);
    $('#greeting').textContent = (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening') + ', Alex';

    renderMenu();
    initTheme();
    initTips();
    initClock();
    renderProfile();
    renderCutOff();
    renderYear();
    renderLeave();
    renderAnnouncements();
    renderPoints();
  }
})();
