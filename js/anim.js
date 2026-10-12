/* 动作动画：GIF 直播 + SVG 三帧轮播 */
'use strict';

var AnimHelper = (function () {
  var timers = [];

  /* 本地缺失时的在线兜底 */
  var REMOTE_GIF_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/';
  var REMOTE_SVG_BASE = 'https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/assets/';
  var SVG_REMOTE_MAP = {
    'assets/anim/svg/bird-dog/': 'bird-dog/',
    'assets/anim/svg/hip-flexor-stretch/': 'kneeling-hip-flexor-stretch/',
    'assets/anim/svg/chest-row/': 'chest-supported-row/',
    'assets/anim/svg/hip-thrust/': 'hip-thrust/'
  };
  function svgFallback(frames) {
    // frames[0] 如 assets/anim/svg/bird-dog/frame-1.svg -> 取目录映射到远端
    var dir = frames[0].substring(0, frames[0].lastIndexOf('/') + 1);
    var remoteDir = SVG_REMOTE_MAP[dir];
    if (!remoteDir) return '';
    var urls = frames.map(function (p) {
      return REMOTE_SVG_BASE + remoteDir + p.substring(p.lastIndexOf('/') + 1);
    });
    return ' data-remote-frames="' + esc(urls.join('|')) + '" onerror="AnimHelper.svgRemoteFallback(this)"';
  }
  var GIF_REMOTE_MAP = {
    'assets/anim/gifs/pelvic-tilt.gif': '3147-NKJ8o6x.gif',
    'assets/anim/gifs/glute-bridge.gif': '3013-u0cNiij.gif',
    'assets/anim/gifs/dead-bug.gif': '0276-iny3m5y.gif',
    'assets/anim/gifs/side-plank.gif': '0705-RKjH6Lt.gif',
    'assets/anim/gifs/sit-stand.gif': '0291-mnzcrIB.gif',
    'assets/anim/gifs/step-up.gif': '0431-aXtJhlg.gif',
    'assets/anim/gifs/gym-step-up.gif': '0431-aXtJhlg.gif',
    'assets/anim/gifs/hamstring-stretch.gif': '1511-99rWm7w.gif',
    'assets/anim/gifs/pallof-press.gif': '0979-9pa4H5m.gif',
    'assets/anim/gifs/lat-pulldown.gif': '0007-4IKbhHV.gif',
    'assets/anim/gifs/goblet-squat.gif': '1760-yn8yg1r.gif',
    'assets/anim/gifs/split-squat.gif': '0099-gGNQmVt.gif',
    'assets/anim/gifs/farmer-carry.gif': '2133-qPEzJjA.gif',
    'assets/anim/gifs/db-rdl.gif': '1459-rR0LJzx.gif',
    'assets/anim/gifs/back-ext.gif': '0489-zhMwOwE.gif'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ex.anim: 字符串 = GIF 路径；数组 = SVG 分帧路径 */
  function html(ex, cls) {
    if (!ex || !ex.anim) return '';
    var c = cls || 'ex-anim';
    if (typeof ex.anim === 'string') {
      var remote = GIF_REMOTE_MAP[ex.anim];
      var fallback = remote ? ' onerror="this.onerror=null;this.src=\'' + REMOTE_GIF_BASE + remote + '\'"' : '';
      return '<img class="' + c + '" src="' + esc(ex.anim) + '" alt="' + esc(ex.name) + '动作演示" loading="lazy"' + fallback + '>';
    }
    if (Array.isArray(ex.anim) && ex.anim.length) {
      return '<img class="' + c + ' anim-frames" src="' + esc(ex.anim[0]) + '"' +
        ' data-frames="' + esc(ex.anim.join('|')) + '" data-frame="0"' +
        svgFallback(ex.anim) +
        ' alt="' + esc(ex.name) + '动作演示" loading="lazy">';
    }
    return '';
  }

  /* SVG 本地缺失时切换到远端分帧 */
  function svgRemoteFallback(img) {
    img.onerror = null;
    var urls = (img.getAttribute('data-remote-frames') || '').split('|').filter(Boolean);
    if (urls.length) {
      img.setAttribute('data-frames', urls.join('|'));
      img.src = urls[0];
    }
  }

  function stopAll() {
    timers.forEach(function (t) { clearInterval(t); });
    timers = [];
  }

  /* 在容器内启动分帧轮播；调用方每次重新渲染后调用一次 */
  function bind(root) {
    stopAll();
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('img.anim-frames').forEach(function (img) {
      var frames = (img.getAttribute('data-frames') || '').split('|').filter(Boolean);
      if (frames.length < 2) return;
      var i = 0;
      var timer = setInterval(function () {
        if (!document.contains(img)) { clearInterval(timer); return; }
        i = (i + 1) % frames.length;
        img.src = frames[i];
      }, 700);
      timers.push(timer);
    });
  }

  return { html: html, bind: bind, stopAll: stopAll, svgRemoteFallback: svgRemoteFallback };
})();
