/* 动作库：搜索 + 场景筛选 + 动作详情 */
'use strict';

var LibraryPage = (function () {
  var q = '', loc = 'all', level = 'all', openId = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function levelBadge(e) {
    if (!e.level) return '';
    var cls = e.level === '初级' ? 'tag-level-beginner' : e.level === '中级' ? 'tag-level-intermediate' : 'tag-level-advanced';
    return ' <span class="' + cls + '">' + esc(e.level) + '</span>';
  }

  function filtered() {
    return EXERCISES.filter(function (e) {
      if (loc !== 'all' && e.location !== loc) return false;
      if (level !== 'all' && e.level !== level) return false;
      if (q) {
        var hay = (e.name + ' ' + e.en + ' ' + e.muscles).toLowerCase();
        if (hay.indexOf(q.toLowerCase()) < 0) return false;
      }
      return true;
    });
  }

  function itemHtml(e) {
    var open = openId === e.id;
    var html = '<div class="card lib-item' + (open ? ' open' : '') + '" data-id="' + e.id + '">';
    html += '<div class="lib-head"><div><div class="lib-name">' + esc(e.name) + levelBadge(e) +
      (e.dosing.advanced ? ' <span class="tag-adv">进阶</span>' : '') + '</div>' +
      '<div class="lib-sub">' + esc(e.en) + ' · ' + esc(e.muscles) + '</div></div>' +
      '<span class="lib-loc">' + (e.location === 'home' ? '居家' : '健身房') + '</span></div>';
    if (open) {
      html += '<div class="lib-body">';
      var animHtml = AnimHelper.html(e, 'ex-anim lib-anim');
      if (animHtml) html += '<div class="anim-wrap">' + animHtml + '</div>';
      html += '<div class="lib-row"><span class="lib-label">器械</span>' + esc(e.equipment) + '</div>';
      html += '<div class="lib-row"><span class="lib-label">剂量</span>' +
        esc(e.dosing.sets) + '组 × ' + esc(e.dosing.reps) +
        (e.dosing.note ? '（' + esc(e.dosing.note) + '）' : '') + '</div>';
      if (e.tip) html += '<div class="ex-tip">💡 ' + esc(e.tip) + '</div>';
      html += '<div class="lib-label">动作要领</div><ol class="ex-steps">';
      e.steps.forEach(function (s) { html += '<li>' + esc(s) + '</li>'; });
      html += '</ol>';
      if (e.mistakes && e.mistakes.length) {
        html += '<div class="ex-mistakes"><div class="warn-title">常见错误</div><ul>';
        e.mistakes.forEach(function (m) { html += '<li>' + esc(m) + '</li>'; });
        html += '</ul></div>';
      }
      if (e.stop) html += '<div class="ex-stop">⛔ ' + esc(e.stop) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function render() {
    var el = document.getElementById('tab-library');
    var list = filtered();
    var html = '<div class="card"><div class="page-title">动作库</div>';
    html += '<input id="lib-q" class="search-input" type="search" placeholder="搜索动作 / 肌肉…" value="' + esc(q) + '">';
    html += '<div class="filter-row">';
    html += '<button class="btn filter-btn' + (loc === 'all' ? ' active' : '') + '" data-loc="all">全部</button>';
    html += '<button class="btn filter-btn' + (loc === 'home' ? ' active' : '') + '" data-loc="home">居家</button>';
    html += '<button class="btn filter-btn' + (loc === 'gym' ? ' active' : '') + '" data-loc="gym">健身房</button>';
    html += '</div>';
    html += '<div class="filter-row">';
    html += '<button class="btn filter-btn' + (level === 'all' ? ' active' : '') + '" data-level="all">全部难度</button>';
    html += '<button class="btn filter-btn' + (level === '初级' ? ' active' : '') + '" data-level="初级">初级</button>';
    html += '<button class="btn filter-btn' + (level === '中级' ? ' active' : '') + '" data-level="中级">中级</button>';
    html += '<button class="btn filter-btn' + (level === '高级' ? ' active' : '') + '" data-level="高级">高级</button>';
    html += '</div></div>';

    html += '<div class="lib-list">';
    if (loc === 'all') {
      /* 分开显示：居家 / 健身房两组 */
      var home = list.filter(function (e) { return e.location === 'home'; });
      var gym = list.filter(function (e) { return e.location === 'gym'; });
      if (home.length) {
        html += '<div class="lib-section-title">🏠 居家动作 <span class="lib-count">' + home.length + '</span></div>';
        home.forEach(function (e) { html += itemHtml(e); });
      }
      if (gym.length) {
        html += '<div class="lib-section-title">🏋️ 健身房动作 <span class="lib-count">' + gym.length + '</span></div>';
        gym.forEach(function (e) { html += itemHtml(e); });
      }
    } else {
      list.forEach(function (e) { html += itemHtml(e); });
    }
    html += '</div>';
    if (!list.length) html += '<div class="card"><p class="empty-hint">没有匹配的动作。</p></div>';

    el.innerHTML = html;

    var qi = document.getElementById('lib-q');
    var searchTimer = null;
    qi.addEventListener('input', function () {
      q = qi.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        render();
        var nq = document.getElementById('lib-q');
        nq.focus();
        nq.setSelectionRange(nq.value.length, nq.value.length);
      }, 400);
    });
    el.querySelectorAll('.filter-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.loc !== undefined) loc = b.dataset.loc;
        if (b.dataset.level !== undefined) level = b.dataset.level;
        render();
      });
    });
    el.querySelectorAll('.lib-item').forEach(function (card) {
      card.querySelector('.lib-head').addEventListener('click', function () {
        var id = card.dataset.id;
        openId = (openId === id) ? null : id;
        render();
        AnimHelper.bind(el);
        if (openId) {
          var sel = el.querySelector('[data-id="' + openId + '"]');
          if (sel) sel.scrollIntoView({ block: 'nearest' });
        }
      });
    });
    AnimHelper.bind(el);
  }

  return { render: render };
})();
