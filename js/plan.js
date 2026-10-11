/* 计划页：周次/频率/路径选择 + 7天排期 */
'use strict';

var PlanPage = (function () {

  function getPhase(week) {
    for (var i = 0; i < PROGRAM.phases.length; i++) {
      var p = PROGRAM.phases[i];
      var end = p.weeks[p.weeks.length - 1];
      if (week >= p.weeks[0] && week <= end) return p;
    }
    return PROGRAM.phases[0];
  }

  /* dayKey -> {title, sessionIds[], extraNote} */
  function expandDay(dayKey) {
    var map = {
      'A+HG': { title: 'A课 + 健身房日激活', sessionIds: ['HG', 'A'] },
      'B+HG': { title: 'B课 + 健身房日激活', sessionIds: ['HG', 'B'] },
      'C+HG': { title: 'C课 + 健身房日激活', sessionIds: ['HG', 'C'] },
      'H0': { title: 'H0 恢复课', sessionIds: ['H0'] },
      'H1': { title: 'H1 核心控制', sessionIds: ['H1'] },
      'H2': { title: 'H2 功能课', sessionIds: ['H2'] },
      'H0+步行': { title: 'H0 恢复课 + 步行', sessionIds: ['H0'], extraNote: '课后再步行 10-15 分钟' },
      'H1短版': { title: 'H1 核心控制（短版）', sessionIds: ['H1'], extraNote: '短版：每动作只做 1 组' }
    };
    return map[dayKey] || { title: dayKey, sessionIds: [] };
  }

  function getSchedule(week, freq) {
    var days = (freq === 3 ? PROGRAM.weekly3x : PROGRAM.weekly2x).slice();
    if (week <= 2) {
      days = days.map(function (d) { return d === 'H2' ? 'H0' : d; });
    }
    return days;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    var st = App.planState;
    var phase = getPhase(st.week);
    var days = getSchedule(st.week, st.freq);
    var el = document.getElementById('tab-plan');

    var html = '';
    html += '<div class="card">';
    html += '<div class="plan-controls">';
    html += '<label>周次 <select id="sel-week">';
    for (var w = 1; w <= 12; w++) {
      html += '<option value="' + w + '"' + (w === st.week ? ' selected' : '') + '>第' + w + '周</option>';
    }
    html += '</select></label>';
    html += '<label>健身房 <select id="sel-freq">';
    html += '<option value="2"' + (st.freq === 2 ? ' selected' : '') + '>每周2次</option>';
    html += '<option value="3"' + (st.freq === 3 ? ' selected' : '') + '>每周3次</option>';
    html += '</select></label>';
    html += '<label>路径 <select id="sel-path">';
    html += '<option value="disc"' + (st.path === 'disc' ? ' selected' : '') + '>腰突伴腿症状</option>';
    html += '<option value="local"' + (st.path === 'local' ? ' selected' : '') + '>局部腰痛</option>';
    html += '</select></label>';
    html += '</div></div>';

    html += '<div class="card phase-card">';
    html += '<div class="phase-name">第' + st.week + '周 · ' + esc(phase.name) + '</div>';
    html += '<div class="phase-row"><span class="phase-label">居家</span><span>' + esc(phase.home) + '</span></div>';
    html += '<div class="phase-row"><span class="phase-label">健身房</span><span>' + esc(phase.gym) + '</span></div>';
    html += '<div class="phase-row"><span class="phase-label">进阶门槛</span><span>' + esc(phase.gate) + '</span></div>';
    html += '<div class="path-tip">' + esc(PATH_TIPS[st.path]) + '</div>';
    html += '</div>';

    html += '<div class="week-grid">';
    for (var i = 0; i < 7; i++) {
      var day = expandDay(days[i]);
      html += '<button class="day-cell" data-day="' + esc(days[i]) + '">';
      html += '<span class="day-name">' + PROGRAM.dayNames[i] + '</span>';
      html += '<span class="day-session">' + esc(day.title) + '</span>';
      html += '<span class="day-go">进入跟练 ›</span>';
      html += '</button>';
    }
    html += '</div>';

    html += '<div class="card note-card">健身房训练日可灵活调整；A/B 课之间至少间隔 48 小时，力量训练后保留恢复日。</div>';

    el.innerHTML = html;

    document.getElementById('sel-week').addEventListener('change', function (e) {
      App.planState.week = parseInt(e.target.value, 10); render();
    });
    document.getElementById('sel-freq').addEventListener('change', function (e) {
      App.planState.freq = parseInt(e.target.value, 10); render();
    });
    document.getElementById('sel-path').addEventListener('change', function (e) {
      App.planState.path = e.target.value; render();
    });
    el.querySelectorAll('.day-cell').forEach(function (cell) {
      cell.addEventListener('click', function () {
        var dayKey = cell.dataset.day;
        var day = expandDay(dayKey);
        Player.start(day.title, day.sessionIds, day.extraNote);
        switchTab('player');
      });
    });
  }

  return { render: render, expandDay: expandDay, getSchedule: getSchedule, getPhase: getPhase };
})();
