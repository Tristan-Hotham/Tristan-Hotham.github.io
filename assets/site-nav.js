/* Shared navigation for Tristan Hotham's data studies on GitHub Pages.
   Adds a slim top bar (all studies, website, blog, research) and a "keep exploring" block of related studies
   at the foot of the page. One file, loaded by every study page:
   <script src="https://tristan-hotham.github.io/assets/site-nav.js" defer></script>
   Drawn inside a shadow root so it never clashes with a page's own styles. */
(function () {
  "use strict";
  if (window.__thNav) return; window.__thNav = true;
  var HUB = "https://tristan-hotham.github.io/";
  var CAT = HUB + "assets/studies.json";
  var here = (location.pathname.split("/")[1] || "").toLowerCase();
  var isHub = location.hostname === "tristan-hotham.github.io" && !here;
  if (isHub) return;

  var CSS = [
    ":host{all:initial;display:block}",
    "*{box-sizing:border-box}",
    ".bar{--bg:#141313;--fg:#FAF8F4;--mut:#B9B3A8;--red:#B3261E;--blue:#3B6BB5;font:500 13px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--fg);border-bottom:3px solid var(--red)}",
    ".in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:8px max(14px,env(safe-area-inset-left));min-height:44px;flex-wrap:wrap}",
    ".brand{display:flex;align-items:center;gap:8px;color:var(--fg);text-decoration:none;font-weight:700;letter-spacing:.02em;white-space:nowrap}",
    ".brand img{width:26px;height:26px;display:block}",
    ".crumb{color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}",
    "nav{margin-left:auto;display:flex;gap:4px;flex-wrap:wrap}",
    "nav a{color:var(--fg);text-decoration:none;padding:7px 9px;border-radius:2px;white-space:nowrap}",
    "nav a:hover,nav a:focus-visible{background:#2A2827;outline:none}",
    "nav a.hi{background:var(--red)}",
    "nav a.hi:hover{background:#8C1D16}",
    "@media(max-width:700px){.crumb{display:none}.in{gap:8px}nav{width:100%;margin-left:0;justify-content:flex-start}nav a{padding:6px 7px;font-size:12.5px}}",
    /* footer block */
    ".more{--bg:#F4EFE6;--card:#FAF8F4;--fg:#141313;--mut:#5E5A54;--line:#141313;--red:#B3261E;font:400 16px/1.5 Georgia,'Times New Roman',serif;background:var(--bg);color:var(--fg);border-top:3px solid var(--red);margin-top:48px}",
    "@media(prefers-color-scheme:dark){.more{--bg:#1B1A19;--card:#242322;--fg:#F1EEE8;--mut:#B3ADA4;--line:#F1EEE8}}",
    ".mi{max-width:1180px;margin:0 auto;padding:34px max(16px,env(safe-area-inset-left)) 40px}",
    ".k{font:600 12px/1 system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--red);margin:0 0 8px}",
    "h2{font:800 28px/1.15 Georgia,'Times New Roman',serif;margin:0 0 6px}",
    ".sub{color:var(--mut);margin:0 0 20px;font-size:15px}",
    ".grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}",
    "@media(max-width:980px){.grid{grid-template-columns:repeat(2,1fr)}}",
    "@media(max-width:520px){.grid{grid-template-columns:1fr}}",
    ".c{display:flex;flex-direction:column;background:var(--card);color:var(--fg);text-decoration:none;border:2px solid var(--line);box-shadow:6px 6px 0 var(--red);transition:transform .15s,box-shadow .15s}",
    ".c:nth-child(2n){box-shadow:6px 6px 0 #24477F}",
    ".c:hover,.c:focus-visible{transform:translate(3px,3px);box-shadow:3px 3px 0 var(--red);outline:none}",
    ".im{aspect-ratio:1200/630;background:#141313;overflow:hidden;border-bottom:2px solid var(--line)}",
    ".im img{width:100%;height:100%;object-fit:cover;display:block}",
    ".tx{padding:12px 14px 14px}",
    ".th{font:600 11px/1 system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:6px}",
    ".tt{font:700 17px/1.2 Georgia,'Times New Roman',serif;margin:0 0 6px}",
    ".dd{font-size:14px;line-height:1.4;color:var(--mut);margin:0}",
    ".links{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}",
    ".links a{font:600 13px/1 system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--fg);text-decoration:none;border:2px solid var(--line);padding:10px 14px}",
    ".links a.p{background:#141313;color:#FAF8F4;border-color:#141313}",
    ".links a:hover{background:var(--red);border-color:var(--red);color:#FAF8F4}",
    ".fine{margin-top:18px;font:400 12.5px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--mut)}",
    ".fine a{color:inherit}"
  ].join("\n");

  var LOGO = '<img src="' + HUB + 'assets/logo.svg" alt="" width="26" height="26">';

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function mount(where, html) {
    var host = document.createElement("div");
    host.className = "th-site-nav";
    var bs = getComputedStyle(document.body), px = function (v) { return parseFloat(v) || 0; };
    var l = px(bs.paddingLeft) + px(bs.marginLeft), r = px(bs.paddingRight) + px(bs.marginRight);
    host.style.cssText = "display:block;position:relative;z-index:5;margin-left:-" + l + "px;margin-right:-" + r + "px;" +
      (where === "top" ? "margin-top:-" + (px(bs.paddingTop) + px(bs.marginTop)) + "px;" : "margin-bottom:-" + (px(bs.paddingBottom) + px(bs.marginBottom)) + "px;");
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML = "<style>" + CSS + "</style>" + html;
    if (where === "top") document.body.insertBefore(host, document.body.firstChild);
    else document.body.appendChild(host);
    return host;
  }

  function topBar(me, n) {
    var title = me ? me.t : document.title;
    mount("top",
      '<div class="bar" role="navigation" aria-label="Tristan Hotham: site"><div class="in">' +
      '<a class="brand" href="https://tristanhotham.com/">' + LOGO + "Tristan Hotham</a>" +
      '<span class="crumb">/ <a style="color:inherit" href="' + HUB + '#studies">Data studies</a> / ' + esc(title) + "</span>" +
      "<nav>" +
      '<a class="hi" href="' + HUB + '#studies">All ' + (n || "") + " data studies</a>" +
      '<a href="https://tristanhotham.com/">Website</a>' +
      '<a href="https://blog.tristanhotham.com/">Blog</a>' +
      '<a href="https://tristanhotham.com/research/">Research</a>' +
      "</nav></div></div>");
  }

  // Related studies: three from the same theme, one from elsewhere; shuffled so repeat visits show different ones.
  function pick(cat, me) {
    var others = cat.filter(function (s) { return s.r !== here; });
    var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var same = shuffle(others.filter(function (s) { return me && s.theme === me.theme; }));
    var diff = shuffle(others.filter(function (s) { return !me || s.theme !== me.theme; }));
    return same.slice(0, 3).concat(diff).slice(0, 4);
  }

  function footer(cat, me) {
    var list = pick(cat, me);
    var cards = list.map(function (s) {
      var img = s.img ? (/^https?:/.test(s.img) ? s.img : HUB + s.img) : "";
      return '<a class="c" href="' + HUB + esc(s.r) + '/">' +
        '<div class="im">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" width="1200" height="630">' : "") + "</div>" +
        '<div class="tx"><div class="th">' + esc(s.theme) + '</div><p class="tt">' + esc(s.t) + '</p><p class="dd">' + esc(s.d) + "</p></div></a>";
    }).join("");
    var mine = me ? [
      me.blog ? '<a href="' + esc(me.blog) + '">Read the write-up</a>' : "",
      me.data ? '<a href="' + esc(me.data) + '">Data and paper</a>' : "",
      '<a href="https://github.com/Tristan-Hotham/' + esc(here) + '">Code on GitHub</a>'
    ].join("") : "";
    mount("bottom",
      '<section class="more" aria-label="More data studies"><div class="mi">' +
      '<p class="k">Keep exploring</p><h2>You might also like</h2>' +
      '<p class="sub">More questions about the past, the landscape and the weather, answered with open data.</p>' +
      '<div class="grid">' + cards + "</div>" +
      '<div class="links"><a class="p" href="' + HUB + '#studies">See all ' + cat.length + " data studies</a>" + mine +
      '<a href="https://blog.tristanhotham.com/">Blog</a><a href="https://tristanhotham.com/">tristanhotham.com</a></div>' +
      '<p class="fine">Dr Tristan Hotham, independent researcher. Researcher of campaigns and platforms. Maker of other things.</p>' +
      "</div></section>");
  }

  function start() {
    var done = false;
    var fallback = setTimeout(function () { if (!done) { done = true; topBar(null, ""); } }, 4000);
    fetch(CAT, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (cat) {
      if (done) { footer(cat, cat.filter(function (s) { return s.r === here; })[0]); return; }
      done = true; clearTimeout(fallback);
      var me = cat.filter(function (s) { return s.r === here; })[0];
      topBar(me, cat.length);
      footer(cat, me);
    }).catch(function () { if (!done) { done = true; clearTimeout(fallback); topBar(null, ""); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
