/* 主入口：Tab 路由与全局状态 */
'use strict';

const App = {
  tab: 'plan',
  // 计划页选择
  planState: { week: 1, freq: 2, path: 'disc' }
};

function switchTab(name) {
  if (App.tab === 'player' && name !== 'player' && typeof Player !== 'undefined') { Player.pause(); }
  App.tab = name;
  document.querySelectorAll('.tab-page').forEach(function (el) { el.classList.remove('active'); });
  document.querySelectorAll('.tabbar button').forEach(function (el) { el.classList.remove('active'); });
  var page = document.getElementById('tab-' + name);
  var btn = document.getElementById('nav-' + name);
  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'plan') PlanPage.render();
  if (name === 'library') LibraryPage.render();
  if (name === 'log') LogPage.render();
  if (name === 'player') {
    if (Player.hasActive()) { Player.resume(); }
    else { Player.showIdle(); }
  }
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tabbar button').forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
  });
  switchTab('plan');
});
