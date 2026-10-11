/* 训练记录：localStorage 存储 + 周统计 */
'use strict';

var LogStore = (function () {
  var KEY = 'rehab-log';

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) { /* 存储空间不足时忽略 */ }
  }

  function add(entry) {
    var arr = load();
    arr.unshift({ date: entry.date, session: entry.session, light: entry.light, note: entry.note || '' });
    save(arr);
  }

  function remove(index) {
    var arr = load();
    arr.splice(index, 1);
    save(arr);
  }

  /* ISO 周 key：YYYY-Www */
  function weekKey(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var day = (d.getDay() + 6) % 7; /* 周一=0 */
    var thursday = new Date(d);
    thursday.setDate(d.getDate() - day + 3);
    var firstThursday = new Date(thursday.getFullYear(), 0, 4);
    var fday = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - fday + 3);
    var week = 1 + Math.round((thursday - firstThursday) / (7 * 864e5));
    return thursday.getFullYear() + '-W' + String(week).padStart(2, '0');
  }

  return { load: load, add: add, remove: remove, weekKey: weekKey };
})();

var LogPage = (function () {
  var LIGHT_TEXT = { green: '🟢 轻松', yellow: '🟡 一般', red: '🔴 吃力/不适' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render() {
    var el = document.getElementById('tab-log');
    var arr = LogStore.load();

    var html = '<div class="card"><div class="page-title">训练记录</div>';

    if (!arr.length) {
      html += '<p class="empty-hint">还没有训练记录。完成一次跟练后，在总结页保存即可记录。</p></div>';
      el.innerHTML = html;
      return;
    }

    /* 按周统计 */
    var weeks = {};
    arr.forEach(function (e) {
      var k = LogStore.weekKey(e.date);
      if (!weeks[k]) weeks[k] = { green: 0, yellow: 0, red: 0, total: 0 };
      if (weeks[k][e.light] !== undefined) weeks[k][e.light]++;
      weeks[k].total++;
    });
    var keys = Object.keys(weeks).sort().reverse();
    html += '<div class="week-stats">';
    keys.slice(0, 4).forEach(function (k) {
      var w = weeks[k];
      html += '<div class="week-stat"><div class="week-name">' + esc(k) + '</div>' +
        '<div class="week-counts">🟢' + w.green + ' 🟡' + w.yellow + ' 🔴' + w.red +
        '（共' + w.total + '次）</div></div>';
    });
    html += '</div></div>';

    html += '<div class="log-list">';
    arr.forEach(function (e, i) {
      html += '<div class="card log-item">';
      html += '<div class="log-top"><span class="log-date">' + esc(e.date) + '</span>' +
        '<span class="log-light">' + (LIGHT_TEXT[e.light] || esc(e.light)) + '</span></div>';
      html += '<div class="log-session">' + esc(e.session) + '</div>';
      if (e.note) html += '<div class="log-note">' + esc(e.note) + '</div>';
      html += '<button class="btn btn-ghost btn-sm log-del" data-i="' + i + '">删除</button>';
      html += '</div>';
    });
    html += '</div>';

    el.innerHTML = html;
    el.querySelectorAll('.log-del').forEach(function (b) {
      b.addEventListener('click', function () {
        LogStore.remove(parseInt(b.dataset.i, 10));
        render();
      });
    });
  }

  return { render: render };
})();
