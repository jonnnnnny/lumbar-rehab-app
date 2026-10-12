/* 跟练模式：全屏式训练引导 + 组间休息 + 红绿灯总结 */
'use strict';

var Player = (function () {
  var S = null;
  var REST_SEC = 30;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function parseDose(dose, type) {
    var sets = 1, target = null, seconds = null;
    var m = String(dose).match(/^(\d+)\s*[×xX]\s*(.+)$/);
    var rest = dose;
    if (m) { sets = parseInt(m[1], 10); rest = m[2]; }
    if (type === 'hold') {
      var sm = String(rest).match(/(\d+)\s*(?:[-–~]\s*\d+)?\s*秒/);
      if (sm) seconds = parseInt(sm[1], 10);
    } else if (type === 'reps') {
      var rm = String(rest).match(/(\d+)\s*(?:[-–~]\s*\d+)?/);
      if (rm) target = parseInt(rm[1], 10);
    }
    return { sets: sets, target: target, seconds: seconds };
  }

  function start(title, sessionIds, extraNote) {
    var items = [];
    var short = title.indexOf('短版') >= 0;
    sessionIds.forEach(function (sid) {
      var sess = SESSIONS[sid];
      if (!sess) return;
      sess.items.forEach(function (it) {
        if (it.kind === 'note') {
          items.push({ kind: 'note', text: it.text });
        } else {
          var ex = EXERCISE_MAP[it.exercise];
          if (!ex) return;
          var p = parseDose(it.dose, ex.type);
          if (short) p.sets = 1;
          items.push({
            kind: 'exercise', ex: ex, dose: it.dose, note: it.note || null,
            sets: p.sets, target: p.target, seconds: p.seconds
          });
        }
      });
    });
    if (extraNote) items.unshift({ kind: 'note', text: extraNote, banner: true });
    S = {
      title: title, items: items, idx: 0, set: 1,
      count: 0, timerId: null, timerLeft: 0, timerTotal: 0,
      mode: 'item', restLeft: REST_SEC, light: null, skipped: []
    };
    renderItem();
  }

  function hasActive() { return S !== null && S.mode !== 'done'; }

  function clearTimer() {
    if (S && S.timerId) { clearInterval(S.timerId); S.timerId = null; }
  }

  function pause() { clearTimer(); }

  function resume() { if (hasActive()) renderItem(); }

  function showIdle() {
    var el = document.getElementById('tab-player');
    el.innerHTML = '<div class="card player-idle">' +
      '<div class="idle-title">跟练模式</div>' +
      '<p>从「计划」页点击任意一天的课程，即可进入跟练。</p>' +
      '<button class="btn btn-primary" id="idle-go-plan">去计划页选择课程</button></div>';
    document.getElementById('idle-go-plan').addEventListener('click', function () { switchTab('plan'); });
  }

  function exit() {
    clearTimer();
    AnimHelper.stopAll();
    S = null;
    switchTab('plan');
  }

  function itemProgress() { return '第 ' + (S.idx + 1) + ' / ' + S.items.length + ' 项'; }

  function renderHeader() {
    return '<div class="player-head">' +
      '<div><div class="player-title">' + esc(S.title) + '</div>' +
      '<div class="player-progress">' + itemProgress() + '</div></div>' +
      '<button class="btn btn-ghost" id="player-exit">退出</button></div>';
  }

  function bindExit() {
    document.getElementById('player-exit').addEventListener('click', exit);
  }

  function exerciseInfoHtml(it) {
    var ex = it.ex;
    var h = '<div class="ex-card">';
    var animHtml = AnimHelper.html(ex, 'ex-anim player-anim');
    if (animHtml) h += '<div class="anim-wrap">' + animHtml + '</div>';
    h += '<div class="ex-name">' + esc(ex.name) +
      ' <span class="loc-badge ' + ex.location + '">' + (ex.location === 'home' ? '🏠 居家' : '🏋️ 健身房') + '</span></div>';
    h += '<div class="ex-en">' + esc(ex.en) + ' · ' + esc(ex.muscles) + '</div>';
    h += '<div class="ex-meta"><span>器械：' + esc(ex.equipment) + '</span></div>';
    h += '<div class="ex-dose">剂量：' + esc(it.dose) +
      (it.sets > 1 ? '　<span class="set-badge">第 ' + S.set + ' 组 / 共 ' + it.sets + ' 组</span>' : '') + '</div>';
    if (it.note) h += '<div class="ex-note">' + esc(it.note) + '</div>';
    if (ex.tip) h += '<div class="ex-tip">💡 ' + esc(ex.tip) + '</div>';
    if (ex.alt && ex.alt.length) {
      h += '<div class="ex-switch"><button class="btn btn-ghost" id="p-switch-btn">🔄 换动作</button>';
      h += '<div class="ex-switch-options" id="p-switch-options" style="display:none">';
      ex.alt.forEach(function (altId) {
        var altEx = EXERCISE_MAP[altId];
        if (altEx) h += '<button class="btn btn-ghost switch-opt" data-alt="' + altId + '">' + esc(altEx.name) + '</button>';
      });
      h += '</div></div>';
    }
    h += '<ol class="ex-steps">';
    ex.steps.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
    h += '</ol>';
    if (ex.mistakes && ex.mistakes.length) {
      h += '<div class="ex-mistakes"><div class="warn-title">常见错误</div><ul>';
      ex.mistakes.forEach(function (m) { h += '<li>' + esc(m) + '</li>'; });
      h += '</ul></div>';
    }
    if (ex.stop) {
      h += '<div class="ex-stop">⛔ ' + esc(ex.stop) + '</div>';
    }
    h += '<div class="ex-actions"><button class="btn btn-ghost" id="p-skip-btn">⏭ 跳过此动作</button></div>';
    h += '</div>';
    return h;
  }

  function renderItem() {
    clearTimer();
    S.mode = 'item';
    S.count = 0;
    var el = document.getElementById('tab-player');
    var it = S.items[S.idx];
    var h = renderHeader();

    if (it.kind === 'note') {
      h += '<div class="card note-item' + (it.banner ? ' banner' : '') + '"><p>' + esc(it.text) + '</p>';
      h += '<button class="btn btn-primary btn-big" id="p-done">完成</button></div>';
      el.innerHTML = h;
      bindExit();
      document.getElementById('p-done').addEventListener('click', nextItem);
      return;
    }

    h += exerciseInfoHtml(it);
    var ex = it.ex;
    if (ex.type === 'reps') {
      h += '<div class="card counter-card">';
      h += '<div class="counter-display"><span id="p-count">0</span>' +
        (it.target ? '<span class="counter-target"> / 目标 ' + it.target + ' 次</span>' : '') + '</div>';
      h += '<div class="counter-btns">';
      h += '<button class="btn btn-big btn-step" id="p-minus">−</button>';
      h += '<button class="btn btn-big btn-step" id="p-plus">＋</button>';
      h += '</div>';
      h += '<button class="btn btn-primary btn-big" id="p-set-done">完成本组</button></div>';
    } else if (ex.type === 'hold') {
      S.timerTotal = it.seconds || 20;
      S.timerLeft = S.timerTotal;
      h += '<div class="card timer-card">';
      h += '<div class="timer-display" id="p-timer">' + S.timerLeft + '</div><div class="timer-unit">秒</div>';
      h += '<div class="timer-btns">';
      h += '<button class="btn btn-primary btn-big" id="p-timer-toggle">开始</button>';
      h += '<button class="btn btn-ghost btn-big" id="p-timer-reset">重置</button>';
      h += '</div>';
      h += '<button class="btn btn-primary btn-big" id="p-set-done" style="margin-top:12px">完成本组</button></div>';
    } else { /* walk */
      h += '<div class="card"><p class="walk-hint">按剂量完成行走距离，保持呼吸与姿态。</p>';
      h += '<button class="btn btn-primary btn-big" id="p-set-done">完成本组</button></div>';
    }
    el.innerHTML = h;
    bindExit();
    AnimHelper.bind(el);

    /* 跳过此动作 */
    var skipBtn = document.getElementById('p-skip-btn');
    if (skipBtn) skipBtn.addEventListener('click', skipExercise);

    /* 换动作 */
    var swBtn = document.getElementById('p-switch-btn');    if (swBtn) {
      swBtn.addEventListener('click', function () {
        var opts = document.getElementById('p-switch-options');
        if (opts) opts.style.display = opts.style.display === 'none' ? 'block' : 'none';
      });
      el.querySelectorAll('.switch-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var altEx = EXERCISE_MAP[b.dataset.alt];
          if (!altEx) return;
          var it2 = S.items[S.idx];
          it2.ex = altEx;
          var p2 = parseDose(it2.dose, altEx.type);
          it2.sets = p2.sets; it2.target = p2.target; it2.seconds = p2.seconds;
          S.set = 1;
          renderItem();
        });
      });
    }

    if (ex.type === 'reps') {
      document.getElementById('p-minus').addEventListener('click', function () {
        if (S.count > 0) { S.count--; updateCount(); }
      });
      document.getElementById('p-plus').addEventListener('click', function () {
        S.count++; updateCount();
      });
      document.getElementById('p-set-done').addEventListener('click', setDone);
    } else if (ex.type === 'hold') {
      document.getElementById('p-timer-toggle').addEventListener('click', toggleTimer);
      document.getElementById('p-timer-reset').addEventListener('click', function () {
        clearTimer(); S.timerLeft = S.timerTotal;
        var d = document.getElementById('p-timer'); if (d) d.textContent = S.timerLeft;
        var b = document.getElementById('p-timer-toggle'); if (b) b.textContent = '开始';
      });
      document.getElementById('p-set-done').addEventListener('click', setDone);
    } else {
      document.getElementById('p-set-done').addEventListener('click', setDone);
    }
    window.scrollTo(0, 0);
  }

  function updateCount() {
    var d = document.getElementById('p-count');
    if (d) d.textContent = S.count;
    var it = S.items[S.idx];
    var btn = document.getElementById('p-set-done');
    if (btn && it.target && S.count >= it.target) {
      btn.classList.add('btn-done-hint');
      btn.textContent = '已达目标 ' + it.target + ' 次，完成本组 ✓';
    }
  }

  function toggleTimer() {
    var btn = document.getElementById('p-timer-toggle');
    if (S.timerId) {
      clearTimer();
      if (btn) btn.textContent = '继续';
      return;
    }
    if (btn) btn.textContent = '暂停';
    S.timerId = setInterval(function () {
      S.timerLeft--;
      var d = document.getElementById('p-timer');
      if (d) d.textContent = Math.max(S.timerLeft, 0);
      if (S.timerLeft <= 0) { clearTimer(); setDone(); }
    }, 1000);
  }

  function setDone() {
    clearTimer();
    var it = S.items[S.idx];
    if (it.kind === 'exercise' && S.set < it.sets) {
      S.set++;
      startRest();
    } else {
      nextItem();
    }
  }

  function skipExercise() {
    clearTimer();
    var it = S.items[S.idx];
    if (it && it.kind === 'exercise') S.skipped.push(it.ex.name);
    nextItem();
  }

  function startRest() {
    clearTimer();
    S.mode = 'rest';
    S.restLeft = REST_SEC;
    var el = document.getElementById('tab-player');
    el.innerHTML = renderHeader() +
      '<div class="card rest-card"><div class="rest-title">组间休息</div>' +
      '<div class="timer-display" id="p-rest">' + S.restLeft + '</div><div class="timer-unit">秒</div>' +
      '<button class="btn btn-primary btn-big" id="p-rest-skip">跳过休息</button></div>';
    bindExit();
    S.timerId = setInterval(function () {
      S.restLeft--;
      var d = document.getElementById('p-rest');
      if (d) d.textContent = Math.max(S.restLeft, 0);
      if (S.restLeft <= 0) { clearTimer(); renderItem(); }
    }, 1000);
    document.getElementById('p-rest-skip').addEventListener('click', function () {
      clearTimer(); renderItem();
    });
    window.scrollTo(0, 0);
  }

  function nextItem() {
    clearTimer();
    S.idx++;
    S.set = 1;
    if (S.idx >= S.items.length) { renderSummary(); }
    else { startRestBetween(); }
  }

  function startRestBetween() {
    /* 动作之间也给短休息 */
    startRest();
  }

  function renderSummary() {
    clearTimer();
    S.mode = 'summary';
    var el = document.getElementById('tab-player');
    var today = new Date();
    var ds = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var h = '<div class="card summary-card">';
    h += '<div class="summary-title">训练完成 🎉</div>';
    h += '<div class="summary-session">' + esc(S.title) + '</div>';
    if (S.skipped.length) {
      h += '<div class="summary-skipped">⏭ 本次跳过：' + esc(S.skipped.join('、')) + '</div>';
    }
    h += '<div class="light-label">本次训练感受（红绿灯）</div>';
    h += '<div class="light-btns">';
    h += '<button class="btn light-btn" data-light="green">🟢<span>轻松</span></button>';
    h += '<button class="btn light-btn" data-light="yellow">🟡<span>一般</span></button>';
    h += '<button class="btn light-btn" data-light="red">🔴<span>吃力/不适</span></button>';
    h += '</div>';
    h += '<textarea id="sum-note" placeholder="备注：疼痛变化、哪个动作不适、明日计划…"></textarea>';
    h += '<button class="btn btn-primary btn-big" id="sum-save">保存记录</button>';
    h += '<button class="btn btn-ghost" id="sum-back">返回计划</button></div>';
    el.innerHTML = h;
    S.light = null;
    el.querySelectorAll('.light-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        el.querySelectorAll('.light-btn').forEach(function (x) { x.classList.remove('selected'); });
        b.classList.add('selected');
        S.light = b.dataset.light;
      });
    });
    document.getElementById('sum-save').addEventListener('click', function () {
      var note = document.getElementById('sum-note').value.trim();
      LogStore.add({ date: ds, session: S.title, light: S.light || 'yellow', note: note });
      S.mode = 'done';
      switchTab('log');
    });
    document.getElementById('sum-back').addEventListener('click', function () {
      S.mode = 'done'; switchTab('plan');
    });
    window.scrollTo(0, 0);
  }

  return {
    start: start, hasActive: hasActive, resume: resume,
    showIdle: showIdle, pause: pause
  };
})();
