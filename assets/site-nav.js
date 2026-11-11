/* Shared frame for Tristan Hotham's data studies on GitHub Pages.
   One file, loaded by every study page and by /catalogue/ and /corrections/:
   <script src="https://maps.tristanhotham.com/assets/site-nav.js" defer></script>
   It adds the shared site header (the same black bar as tristanhotham.com and the blog), a breadcrumb strip,
   a "keep exploring" block of related studies and the shared footer. It also fills in page metadata (canonical,
   title, Dataset JSON-LD, share image, favicon), a "Cite this" line when the study has a DOI, a "Jump to the map"
   button on long pages, a small loading note over each map, a foldable map key on phones, larger tap targets
   and fade edges on rows that scroll sideways.
   The header, strip and footer are drawn inside shadow roots so they never clash with a page's own styles;
   the study pages keep their own typefaces inside this shared frame.
   A script-free list of every study lives at /catalogue/, with /studies.csv, /assets/studies.json and /llms.txt. */
(function () {
  "use strict";
  if (window.__thNav) return; window.__thNav = true;
  var HUB = "https://maps.tristanhotham.com/"; var MAIN = "https://tristanhotham.com/"; var DATA = MAIN + "data/";
  var BLOG = "https://blog.tristanhotham.com/";
  var CAT = HUB + "assets/studies.json";
  var ORCID = "https://orcid.org/0000-0003-4931-9349";
  var LIC = { "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/", "CC-BY-SA-4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC-BY-NC-4.0": "https://creativecommons.org/licenses/by-nc/4.0/", "CC-BY-NC-SA-4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "CC-BY-NC-ND-4.0": "https://creativecommons.org/licenses/by-nc-nd/4.0/", "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "ODbL-1.0": "https://opendatacommons.org/licenses/odbl/1-0/" };
  var here = (location.pathname.split("/")[1] || "").toLowerCase();
  var isHub = (location.hostname === "tristan-hotham.github.io" || location.hostname === "maps.tristanhotham.com") && !here;
  if (isHub) return;
  // Hub pages that share the frame but are not studies.
  var HUBPAGES = { catalogue: "Catalogue", corrections: "Corrections" };
  var hubPage = HUBPAGES[here] || "";

  var SANS = "'Oswald','Arial Narrow',Arial,sans-serif";
  var SERIF = "'Source Serif 4','Source Serif Pro',Georgia,'Times New Roman',serif";
  var DISPLAY = "'Fraunces',Georgia,'Times New Roman',serif";
  var MONO = "'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace";

  var CSS = [
    ":host{all:initial;display:block}",
    "*{box-sizing:border-box}",
    /* shared header: black bar, thin red rule, logo and name, menu (burger on narrow screens) */
    ".bar{position:relative;max-width:100%;background:#141313;color:#FAF8F4;border-bottom:3px solid #B3261E;font:500 14px/1 " + SANS + ";color-scheme:dark}",
    ".in{max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:0 max(16px,env(safe-area-inset-left));min-height:56px}",
    ".brand{display:flex;align-items:center;gap:10px;color:#FAF8F4;text-decoration:none;font:500 20px/1 " + SANS + ";letter-spacing:.05em;white-space:nowrap;min-height:44px;flex:none}",
    ".brand img{width:32px;height:32px;display:block;flex:none}",
    ".brand:focus-visible,.mn a:focus-visible,.bg:focus-visible,.st:focus-visible{outline:2px solid #FF5A4E;outline-offset:2px}",
    ".mn{list-style:none;margin:0 0 0 auto;padding:0;display:flex;align-items:center;gap:2px}",
    ".mn li{position:relative}",
    ".mn a{display:flex;align-items:center;min-height:44px;color:#FAF8F4;text-decoration:none;text-transform:uppercase;letter-spacing:.1em;font:500 14px/1 " + SANS + ";padding:0 9px;white-space:nowrap}",
    ".mn a:hover,.mn a.on{background:#B3261E;color:#FFFFFF}",
    ".mn .has>a::after{content:'';display:inline-block;margin-left:7px;border:4px solid transparent;border-top:5px solid currentColor;border-bottom:0;transform:translateY(1px)}",
    ".mn .sub{list-style:none;margin:0;padding:6px 0;position:absolute;left:0;top:100%;min-width:180px;background:#141313;border-top:3px solid #B3261E;box-shadow:0 8px 20px rgba(0,0,0,.35);display:none}",
    ".mn .has:hover .sub,.mn .has:focus-within .sub{display:block}",
    ".mn .sub a{padding:0 16px;letter-spacing:.08em}",
    ".bg{display:none;margin-left:auto;width:44px;height:44px;background:none;border:0;padding:10px 8px;cursor:pointer;flex:none}",
    ".bg span{display:block;height:3px;background:#FAF8F4;margin:5px 0;transition:transform .15s,opacity .15s}",
    ".bg[aria-expanded=true] span:nth-child(1){transform:translateY(8px) rotate(45deg)}",
    ".bg[aria-expanded=true] span:nth-child(2){opacity:0}",
    ".bg[aria-expanded=true] span:nth-child(3){transform:translateY(-8px) rotate(-45deg)}",
    "@media(max-width:1099.98px){.bg{display:block}.in{min-height:52px;gap:10px}.brand{font-size:19px}.brand img{width:30px;height:30px}",
    "  .mn{display:none;position:absolute;left:0;right:0;top:100%;margin:0;flex-direction:column;align-items:stretch;gap:0;background:#141313;border-bottom:3px solid #B3261E;padding:8px 0 14px;max-height:calc(100vh - 56px);overflow:auto;box-shadow:0 10px 24px rgba(0,0,0,.35)}",
    "  .mn.open{display:flex}",
    "  .mn a{padding:0 max(20px,env(safe-area-inset-left));font-size:17px;justify-content:flex-start;text-align:left}",
    "  .mn .has>a::after{display:none}",
    "  .mn .sub{display:block;position:static;box-shadow:none;border:0;padding:0;min-width:0;background:none}",
    "  .mn .sub a{padding-left:calc(max(20px,env(safe-area-inset-left)) + 22px);font-size:15px;color:#D9D4CB}",
    "  .mn .sub a::before{content:'';width:10px;height:2px;background:#FF5A4E;margin-right:10px;flex:none}}",
    "@media(max-width:360px){.brand{font-size:17px;gap:8px;letter-spacing:.03em}.in{padding:0 12px}}",
    /* breadcrumb and this-study links strip under the bar */
    ".ln{--bg:#F4EFE6;--fg:#141313;--mut:#5E5A54;--red:#B3261E;background:var(--bg);color:var(--fg);border-bottom:1px solid rgba(20,19,19,.25);font:500 12.5px/1.2 " + MONO + ";max-width:100%;overflow:hidden}",
    ":host([data-dk]) .ln{--bg:#1B1A19;--fg:#F1EEE8;--mut:#B3ADA4;--red:#FF5A4E;border-bottom-color:rgba(241,238,232,.25)}",
    ".ln .li{max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:6px 14px;padding:0 max(16px,env(safe-area-inset-left));min-height:38px}",
    ".cr{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--mut)}",
    ".cr a{color:var(--fg);text-decoration:underline;text-underline-offset:2px}",
    ".cr b{font-weight:500;color:var(--fg)}",
    ".st{flex:none;display:inline-flex;align-items:center;min-height:30px;color:var(--fg);text-decoration:none;border:1.5px solid var(--fg);padding:0 10px;font:500 12px/1 " + SANS + ";letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}",
    ".st:hover{background:#B3261E;border-color:#B3261E;color:#FFFFFF}",
    "@media(max-width:599.98px){.ln .li{gap:0 10px;min-height:44px;padding:0 12px}.cr{font-size:11.5px}.st{min-height:44px;border:0;padding:0 2px;text-decoration:underline;text-underline-offset:3px;font-size:12px}.st+.st{margin-left:4px}}",
    /* keep exploring block */
    ".more{--bg:#F4EFE6;--card:#FAF8F4;--fg:#141313;--mut:#5E5A54;--line:#141313;--red:#B3261E;--acc:#B3261E;font:400 16px/1.5 " + SERIF + ";background:var(--bg);color:var(--fg);border-top:3px solid #B3261E;margin-top:48px}",
    ":host([data-dk]) .more{--bg:#1B1A19;--card:#242322;--fg:#F1EEE8;--mut:#B3ADA4;--line:#F1EEE8;--acc:#FF5A4E}",
    ".mi{max-width:1180px;margin:0 auto;padding:34px max(16px,env(safe-area-inset-left)) 40px}",
    ".k{font:500 12px/1 " + MONO + ";letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin:0 0 8px}",
    "h2{font:800 28px/1.15 " + DISPLAY + ";margin:0 0 6px}",
    ".sub2{color:var(--mut);margin:0 0 20px;font-size:15px}",
    ".grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}",
    "@media(max-width:980px){.grid{grid-template-columns:repeat(2,1fr)}}",
    "@media(max-width:520px){.grid{grid-template-columns:1fr}}",
    ".c{display:flex;flex-direction:column;background:var(--card);color:var(--fg);text-decoration:none;border:2px solid var(--line);box-shadow:6px 6px 0 #B3261E;transition:transform .15s,box-shadow .15s}",
    ".c:nth-child(2n){box-shadow:6px 6px 0 #24477F}",
    ":host([data-dk]) .c:nth-child(2n){box-shadow:6px 6px 0 #3B6BB5}",
    ".c:hover,.c:focus-visible{transform:translate(3px,3px);box-shadow:3px 3px 0 #B3261E;outline:none}",
    ".im{aspect-ratio:1200/630;background:#141313;overflow:hidden;border-bottom:2px solid var(--line)}",
    ".im img{width:100%;height:100%;object-fit:cover;display:block}",
    ".tx{padding:12px 14px 14px}",
    ".th{font:500 11px/1.2 " + MONO + ";letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:6px}",
    ".tt{font:700 18px/1.2 " + DISPLAY + ";margin:0 0 6px}",
    ".dd{font-size:14px;line-height:1.4;color:var(--mut);margin:0}",
    ".links{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}",
    ".links a{display:inline-flex;align-items:center;min-height:44px;font:500 13px/1 " + SANS + ";letter-spacing:.08em;text-transform:uppercase;color:var(--fg);text-decoration:none;border:2px solid var(--line);padding:0 14px}",
    ".links a.p{background:#141313;color:#FAF8F4;border-color:#141313}",
    ":host([data-dk]) .links a.p{border-color:var(--line)}",
    ".links a:hover{background:#B3261E;border-color:#B3261E;color:#FFFFFF}",
    ".fine{margin-top:18px;font:400 12.5px/1.6 " + MONO + ";color:var(--mut)}",
    ".fine a{color:inherit}",
    ".sg{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;margin-top:30px;padding:20px 22px;background:var(--card);border:2px solid var(--line);box-shadow:6px 6px 0 #24477F}",
    ":host([data-dk]) .sg{box-shadow:6px 6px 0 #3B6BB5}",
    ".sg h3{font:800 21px/1.2 " + DISPLAY + ";margin:0 0 4px}",
    ".sg p{margin:0;color:var(--mut);font-size:15px;max-width:640px}",
    ".sg a{display:inline-flex;align-items:center;min-height:44px;font:500 14px/1 " + SANS + ";letter-spacing:.08em;text-transform:uppercase;background:#B3261E;color:#FFFFFF;text-decoration:none;border:2px solid #B3261E;padding:0 18px;white-space:nowrap}",
    ".sg a:hover,.sg a:focus-visible{background:#141313;border-color:#141313;outline:none}",
    /* cite this */
    ".ct{margin:0 0 28px;padding:14px 16px;background:var(--card);border:2px solid var(--line);border-left:8px solid #B3261E;max-width:100%;overflow:hidden}",
    ".ct .ck{font:500 11px/1 " + MONO + ";letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin:0 0 8px}",
    ".ct .cx{margin:0 0 10px;font-size:15px;line-height:1.5;overflow-wrap:anywhere;word-break:break-word}",
    ".ct .cx a{color:inherit}",
    ".ct .cb{display:flex;flex-wrap:wrap;gap:8px}",
    ".ct button,.ct .cb a{display:inline-flex;align-items:center;min-height:44px;font:500 13px/1 " + SANS + ";letter-spacing:.08em;text-transform:uppercase;color:var(--fg);background:transparent;text-decoration:none;border:2px solid var(--line);padding:0 12px;cursor:pointer;white-space:nowrap}",
    ".ct button:hover,.ct button:focus-visible,.ct .cb a:hover,.ct .cb a:focus-visible{background:#B3261E;border-color:#B3261E;color:#FFFFFF;outline:none}",
    /* shared footer */
    ".ft{background:#141313;color:#E9E5DE;border-top:3px solid #B3261E;font:400 14px/1.5 " + SERIF + ";color-scheme:dark}",
    ".fi{max-width:1240px;margin:0 auto;padding:22px max(16px,env(safe-area-inset-left)) calc(24px + env(safe-area-inset-bottom));display:flex;flex-wrap:wrap;align-items:center;gap:6px 28px}",
    ".fi p{margin:0}",
    ".fi .cp{font:400 13px/1.5 " + MONO + ";color:#B9B3A8}",
    ".fl{display:flex;flex-wrap:wrap;gap:0 4px;margin-left:auto}",
    ".fl a{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;color:#FAF8F4;text-decoration:none;text-transform:uppercase;letter-spacing:.1em;font:500 13px/1 " + SANS + "}",
    ".fl a:hover,.fl a:focus-visible{color:#FF5A4E;outline:none;text-decoration:underline;text-underline-offset:4px}",
    "@media(max-width:700px){.fi{flex-direction:column;align-items:flex-start}.fl{margin-left:-8px}}"
  ].join("\n");

  // Styles placed in the page itself (prefixed th-), for the map helpers that have to sit inside the page's own map boxes.
  var PAGE_CSS = [
    ".th-load{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1000;pointer-events:none;display:flex;align-items:center;gap:9px;" +
      "background:rgba(250,248,244,.94);color:#141313;border:1px solid rgba(20,19,19,.35);border-radius:999px;padding:8px 14px 8px 11px;" +
      "font:500 13px/1 " + MONO + ";letter-spacing:.02em;box-shadow:0 2px 10px rgba(0,0,0,.18);transition:opacity .3s;white-space:nowrap}",
    ".th-load i{width:13px;height:13px;border-radius:50%;border:2px solid rgba(179,38,30,.25);border-top-color:#B3261E;animation:th-spin .8s linear infinite;flex:none}",
    ".th-load.th-out{opacity:0}",
    "html[data-th-dk] .th-load{background:rgba(27,26,25,.94);color:#F1EEE8;border-color:rgba(241,238,232,.35)}",
    "html[data-th-dk] .th-load i{border-color:rgba(255,90,78,.3);border-top-color:#FF5A4E}",
    "@keyframes th-spin{to{transform:rotate(360deg)}}",
    "@media(prefers-reduced-motion:reduce){.th-load i{animation:none;border-color:#B3261E}}",
    /* map keys fold on phones */
    ".th-kt{display:none}",
    "@media(max-width:599.98px){",
    "  .th-kt{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:44px;margin:0;padding:0 4px;background:none;border:0;color:inherit;font:inherit;font-weight:600;cursor:pointer;text-align:left}",
    "  .th-kt span{font-size:.9em}",
    "  .th-kf{padding:0 8px!important;max-height:none!important;overflow:visible!important;min-width:0!important;width:auto!important;right:auto!important}",
    "  .th-kf>:not(.th-kt){display:none!important}",
    "  .th-kf{font-size:0!important}.th-kf>.th-kt{font-size:13px!important}",
    "  .th-ko>.th-kt{min-height:36px;margin-top:-4px}",
    /* bigger tap areas for chips and layer buttons without moving anything */
    "  .th-hit{position:relative}",
    "  .th-hit::after{content:'';position:absolute;left:0;right:0;top:50%;height:44px;min-height:100%;transform:translateY(-50%)}",
    "  .scrollrow>button,.scrollrow>.btn{min-height:44px}",
    "}",
    /* fade edges on rows that scroll sideways */
    ".th-fr{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 34px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 34px),transparent)}",
    ".th-fl{-webkit-mask-image:linear-gradient(to right,transparent,#000 34px);mask-image:linear-gradient(to right,transparent,#000 34px)}",
    ".th-fl.th-fr{-webkit-mask-image:linear-gradient(to right,transparent,#000 34px,#000 calc(100% - 34px),transparent);mask-image:linear-gradient(to right,transparent,#000 34px,#000 calc(100% - 34px),transparent)}"
  ].join("\n");

  var LOGO = '<img src="' + HUB + 'assets/logo.svg" alt="" width="32" height="32">';
  var MENU = [
    ["About", MAIN + "about/"], ["Research", MAIN + "research/"], ["Data stories", DATA, "on"], ["Publications", MAIN + "publications/"],
    ["Blog", BLOG], ["Media", MAIN + "media/"],
    ["More", MAIN + "#more", "", [["Games", MAIN + "games/"], ["Photos", MAIN + "photos/"], ["Music", MAIN + "music/"], ["Art", MAIN + "art/"]]],
    ["Contact", MAIN + "contact/"], ["Search", MAIN + "search/"]
  ];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var hosts = [];
  function mount(where, html) {
    var host = document.createElement("div");
    host.className = "th-site-nav";
    var bs = getComputedStyle(document.body), px = function (v) { return parseFloat(v) || 0; };
    var l = px(bs.paddingLeft) + px(bs.marginLeft), r = px(bs.paddingRight) + px(bs.marginRight);
    host.style.cssText = "display:block;position:relative;z-index:" + (where === "top" ? 1000 : 5) + ";margin-left:-" + l + "px;margin-right:-" + r + "px;" +
      (where === "top" ? "margin-top:-" + (px(bs.paddingTop) + px(bs.marginTop)) + "px;" : "margin-bottom:-" + (px(bs.paddingBottom) + px(bs.marginBottom)) + "px;");
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML = "<style>" + CSS + "</style>" + html;
    if (where === "top") document.body.insertBefore(host, document.body.firstChild);
    else document.body.appendChild(host);
    hosts.push(host); paintTheme();
    return host;
  }

  // Is the page itself showing its dark design? Read the page background, so the injected parts follow the page's own
  // theme switch as well as the system setting, and never sit light on a dark page or the other way round.
  function lum(c) {
    var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(c || ""); if (!m || (m[4] !== undefined && +m[4] < 0.1)) return -1;
    return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
  }
  function pageDark() {
    var v = lum(getComputedStyle(document.body).backgroundColor);
    if (v < 0) v = lum(getComputedStyle(document.documentElement).backgroundColor);
    if (v < 0) return false;
    return v < 0.4;
  }
  function paintTheme() {
    var dk = false; try { dk = pageDark(); } catch (e) {}
    hosts.forEach(function (h) { if (dk) h.setAttribute("data-dk", ""); else h.removeAttribute("data-dk"); });
    if (dk) document.documentElement.setAttribute("data-th-dk", ""); else document.documentElement.removeAttribute("data-th-dk");
  }
  function watchTheme() {
    var t; var again = function () { paintTheme(); clearTimeout(t); t = setTimeout(paintTheme, 450); };
    try {
      var mo = new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) if (list[i].attributeName !== "data-th-dk") { again(); return; }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] });
      mo.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] });
    } catch (e) {}
    try { var mq = matchMedia("(prefers-color-scheme: dark)"); (mq.addEventListener ? mq.addEventListener("change", again) : mq.addListener(again)); } catch (e) {}
  }

  // Does the page itself (not our injected blocks) already link somewhere matching test(href)?
  function pageLinks(test) {
    var a = document.querySelectorAll("a[href]");
    for (var i = 0; i < a.length; i++) {
      if (a[i].closest && a[i].closest(".th-site-nav")) continue;
      if (test(a[i].href || a[i].getAttribute("href") || "")) return true;
    }
    return false;
  }
  function norm(u) { return String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/[?#].*$/, "").replace(/\/+$/, ""); }
  function storyLinks(me) {
    if (!me) return "";
    var out = [];
    if (me.blog) { var b = norm(me.blog); if (!pageLinks(function (h) { return norm(h) === b; })) out.push('<a class="st" href="' + esc(me.blog) + '">Read the story</a>'); }
    if (me.data && !pageLinks(function (h) { return /doi\.org|zenodo/i.test(h); })) out.push('<a class="st" href="' + esc(me.data) + '">Data and paper</a>');
    return out.join("");
  }
  // The study's own name: the catalogue title, or the page title without any " | ..." suffix.
  function cleanTitle(t) {
    t = String(t || "").replace(/\s*[|–—]\s*(Dr\.?\s*)?Tristan Hotham.*$/i, "");
    t = t.split(/\s+\|\s+/)[0];
    return t.replace(/\s+/g, " ").trim();
  }

  function menuHtml() {
    return MENU.map(function (m) {
      var a = '<a href="' + m[1] + '"' + (m[2] ? ' class="' + m[2] + '" aria-current="true"' : "") + ">" + m[0] + "</a>";
      if (!m[3]) return "<li>" + a + "</li>";
      return '<li class="has">' + a + '<ul class="sub">' + m[3].map(function (s) { return '<li><a href="' + s[1] + '">' + s[0] + "</a></li>"; }).join("") + "</ul></li>";
    }).join("");
  }
  var barDone = false;
  function topBar(me) {
    if (barDone) return; barDone = true;
    var title = hubPage || cleanTitle(me ? me.t : document.title);
    var crumbs = '<a href="' + DATA + '">Data stories</a>' + (title ? " / <b>" + esc(title) + "</b>" : "");
    var host = mount("top",
      '<header class="bar"><div class="in">' +
      '<a class="brand" href="' + MAIN + '">' + LOGO + "<span>Tristan Hotham</span></a>" +
      '<button class="bg" type="button" aria-expanded="false" aria-controls="th-mn" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<ul class="mn" id="th-mn">' + menuHtml() + "</ul></div></header>" +
      '<nav class="ln" aria-label="Breadcrumb"><div class="li"><span class="cr">' + crumbs + "</span>" + (hubPage ? "" : storyLinks(me)) + "</div></nav>");
    var root = host.shadowRoot || host, bg = root.querySelector(".bg"), mn = root.querySelector(".mn");
    var setOpen = function (o) { bg.setAttribute("aria-expanded", o ? "true" : "false"); bg.setAttribute("aria-label", o ? "Close menu" : "Menu"); mn.classList.toggle("open", o); lift(o); };
    // While the menu is open the header must sit above everything on the page, map buttons included.
    var lift = function (o) { host.style.zIndex = o ? "2147483600" : "1000"; };
    var has = root.querySelector(".has");
    if (has) {
      has.addEventListener("mouseenter", function () { lift(true); });
      has.addEventListener("mouseleave", function () { if (!mn.classList.contains("open")) lift(false); });
      has.addEventListener("focusin", function () { lift(true); });
      has.addEventListener("focusout", function () { if (!mn.classList.contains("open")) lift(false); });
    }
    bg.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!mn.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (mn.classList.contains("open") && e.target !== host) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mn.classList.contains("open")) { setOpen(false); bg.focus(); } });
  }

  // Related studies: three from the same theme, one from elsewhere; shuffled so repeat visits show different ones.
  function pick(cat, me) {
    var others = cat.filter(function (s) { return s.r !== here; });
    var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var same = shuffle(others.filter(function (s) { return me && s.theme === me.theme; }));
    var diff = shuffle(others.filter(function (s) { return !me || s.theme !== me.theme; }));
    return same.slice(0, 3).concat(diff).slice(0, 4);
  }

  function doiOf(me) { var m = me && /10\.\d{4,9}\/[^\s?#]+/.exec(me.data || ""); return m ? m[0] : ""; }
  function zenodoUrl(me) { var m = /zenodo\.(\d+)$/i.exec(doiOf(me)); return m ? "https://zenodo.org/records/" + m[1] : (me && me.data) || ""; }
  function citeTitle(me) { var t = String(me.ct || me.t || "").replace(/[.\s]+$/, ""); return /[?!]$/.test(t) ? t : t + "."; }
  function citeText(me) {
    return "Hotham, T. (" + (me.year || "2026") + "). " + citeTitle(me) + " Zenodo. https://doi.org/" + doiOf(me);
  }
  // Does the page already carry a citation of its own?
  function pageCites() {
    var txt = ""; try { txt = document.body.innerText || ""; } catch (e) {}
    return /Hotham,\s*T\.?\s*\(\d{4}\)/.test(txt) || /\b(how to cite|cite this|suggested citation)\b/i.test(txt);
  }
  function citeBlock(me) {
    if (!doiOf(me) || pageCites()) return "";
    var doi = "https://doi.org/" + doiOf(me), t = citeTitle(me), p = t.slice(-1); t = t.slice(0, -1);
    return '<div class="ct" role="note" aria-label="Cite this study"><p class="ck">Cite this</p>' +
      '<p class="cx">Hotham, T. (' + esc(me.year || "2026") + "). <i>" + esc(t) + (p === "." ? "</i>." : esc(p) + "</i>") + ' Zenodo. <a href="' + esc(doi) + '">' + esc(doi) + "</a></p>" +
      '<div class="cb"><button type="button" data-cite>Copy citation</button><a href="' + esc(zenodoUrl(me)) + '">Get the data</a></div></div>';
  }
  function wireCopy(host, me) {
    var root = host.shadowRoot || host, b = root.querySelector("[data-cite]"); if (!b) return;
    b.addEventListener("click", function () {
      var txt = citeText(me), ok = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy citation"; }, 2000); };
      var fall = function () {
        var ta = document.createElement("textarea"); ta.value = txt; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fall); else fall();
    });
  }

  function siteFooter() {
    return '<footer class="ft"><div class="fi"><p>Views on this site are my own.</p><p class="cp">&copy; Tristan Hotham 2026</p>' +
      '<nav class="fl" aria-label="Footer"><a href="' + DATA + '">Data stories</a><a href="' + HUB + 'catalogue/">Catalogue</a>' +
      '<a href="' + HUB + 'corrections/">Corrections</a><a href="' + BLOG + '">Blog</a><a href="' + MAIN + 'contact/">Contact</a></nav></div></footer>';
  }
  var footDone = false;
  function footer(cat, me) {
    if (footDone) return; footDone = true;
    if (hubPage || !cat) { mount("bottom", siteFooter()); return; }
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
    var host = mount("bottom",
      '<section class="more" aria-label="More data studies"><div class="mi">' + (me ? citeBlock(me) : "") +
      '<p class="k">Keep exploring</p><h2>You might also like</h2>' +
      '<p class="sub2">More questions about the past, the landscape and the weather, answered with open data.</p>' +
      '<div class="grid">' + cards + "</div>" +
      '<div class="links"><a class="p" href="' + DATA + '">See all data stories</a>' + mine + "</div>" +
      '<div class="sg"><div><h3>Get new data stories by email</h3><p>New maps and write-ups on politics, the past, platforms and places, sent when they\'re published. No spam, unsubscribe any time.</p></div>' +
      '<a href="' + BLOG + 'subscribe/">Subscribe</a></div>' +
      '<p class="fine">Dr Tristan Hotham, independent researcher. Data-led researcher of politics, the past, platforms and places. Maker of maps, games and other things. ' +
      'Every study in plain form: <a href="' + HUB + 'catalogue/">catalogue</a>, <a href="' + HUB + 'studies.csv">CSV</a>, <a href="' + CAT + '">JSON</a>.</p>' +
      "</div></section>" + siteFooter());
    if (me) wireCopy(host, me);
  }

  // Head bits every page should have: the bar's typeface, a favicon, and the page-level helper styles.
  function headBits() {
    var head = document.head; if (!head) return;
    if (!document.querySelector('link[href*="family=Oswald"]')) {
      var f = document.createElement("link"); f.rel = "stylesheet";
      f.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&display=swap"; head.appendChild(f);
    }
    if (!head.querySelector('link[rel~="icon"]')) {
      var i = document.createElement("link"); i.rel = "icon"; i.href = HUB + "favicon.ico"; i.setAttribute("sizes", "any"); head.appendChild(i);
    }
    if (!document.getElementById("th-page-css")) {
      var st = document.createElement("style"); st.id = "th-page-css"; st.textContent = PAGE_CSS; head.appendChild(st);
    }
  }

  // Page metadata: canonical, title, share image and schema.org Dataset, from the catalogue entry.
  function meta(me) {
    var head = document.head; if (!head || !here || hubPage) return;
    var url = HUB + here + "/";
    var add = function (tag, attrs) { var el = document.createElement(tag); for (var k in attrs) el.setAttribute(k, attrs[k]); head.appendChild(el); return el; };
    var can = head.querySelector('link[rel="canonical"]');
    if (!can) add("link", { rel: "canonical", href: url });
    else if (/github\.io/i.test(can.getAttribute("href") || "")) can.setAttribute("href", url);
    var ogu = head.querySelector('meta[property="og:url"]');
    if (ogu && /github\.io/i.test(ogu.getAttribute("content") || "")) ogu.setAttribute("content", url);
    if (!/Hotham/i.test(document.title)) document.title = (document.title || (me && me.t) || "Data story") + " | Dr Tristan Hotham";
    if (!me) return;
    var img = me.img ? (/^https?:/.test(me.img) ? me.img : HUB + me.img) : "";
    if (img && !head.querySelector('meta[property="og:image"]')) add("meta", { property: "og:image", content: img });
    if (!head.querySelector('meta[name="twitter:card"]')) add("meta", { name: "twitter:card", content: img ? "summary_large_image" : "summary" });
    if (!head.querySelector('script[type="application/ld+json"][data-th]')) {
      var ds = { "@context": "https://schema.org", "@type": "Dataset", name: me.t, description: me.d, url: url,
        creator: { "@type": "Person", "@id": ORCID, name: "Tristan Hotham", url: MAIN, sameAs: [ORCID] }, isAccessibleForFree: true,
        includedInDataCatalog: { "@type": "DataCatalog", name: "Data studies by Dr Tristan Hotham", url: HUB + "catalogue/" } };
      if (me.ct) ds.alternateName = me.ct;
      if (img) ds.image = img;
      if (me.kw && me.kw.length) ds.keywords = me.kw;
      if (me.year) ds.datePublished = String(me.year);
      if (me.theme) ds.about = me.theme;
      var dist = [], d0 = doiOf(me);
      if (d0) {
        ds.identifier = "https://doi.org/" + d0; ds.sameAs = ds.identifier; ds.citation = citeText(me);
        dist.push({ "@type": "DataDownload", name: "Data and paper on Zenodo", contentUrl: zenodoUrl(me), encodingFormat: "text/html" });
      } else if (me.data) ds.sameAs = me.data;
      dist.push({ "@type": "DataDownload", name: "Code and data on GitHub", contentUrl: "https://github.com/Tristan-Hotham/" + here, encodingFormat: "text/html" });
      ds.distribution = dist;
      if (me.blog) ds.subjectOf = { "@type": "BlogPosting", url: me.blog };
      if (me.lic) ds.license = LIC[me.lic] || me.lic;
      var sc = add("script", { type: "application/ld+json", "data-th": "1" }); sc.textContent = JSON.stringify(ds);
    }
  }

  // Article-first pages: if the map starts more than a screen down, offer a small fixed jump button.
  function jump() {
    var map = document.querySelector(".maplibregl-map,.leaflet-container"); if (!map) return;
    var top = function () { return map.getBoundingClientRect().top + window.scrollY; };
    if (top() < window.innerHeight) return;
    var b = document.createElement("button"); b.type = "button"; b.textContent = "Jump to the map";
    b.setAttribute("aria-label", "Jump to the map");
    b.style.cssText = "position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:9999;min-height:44px;font:500 14px/1 " + SANS + ";letter-spacing:.08em;text-transform:uppercase;background:#B3261E;color:#FFFFFF;border:2px solid #141313;box-shadow:4px 4px 0 #141313;padding:0 16px;cursor:pointer";
    b.onclick = function () { map.scrollIntoView({ behavior: "smooth", block: "start" }); };
    document.body.appendChild(b);
    var vis = function () { var r = map.getBoundingClientRect(), end = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 260; b.style.display = (end || (r.top < window.innerHeight && r.bottom > 0)) ? "none" : "block"; };
    window.addEventListener("scroll", vis, { passive: true }); vis();
  }

  /* ---------- map helpers ---------- */
  function visible(el) {
    if (!el || !el.isConnected) return false;
    var cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
    var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  }
  function webgl() {
    try { var c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; }
  }
  // The "Loading the map. It needs JavaScript and WebGL." lines are for readers without JavaScript; with it running,
  // keep only the loading part (or say plainly that WebGL is off).
  function tidyNoJs() {
    var els = document.querySelectorAll(".nojs,#nojs,.noscript,#noscript");
    var gl = webgl();
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el.closest(".th-site-nav") || el.children.length > 2) continue;
      var t = el.textContent || ""; if (!/needs? JavaScript/i.test(t)) continue;
      if (!gl) { el.textContent = "This map needs WebGL, which is turned off or not available in this browser."; continue; }
      var keep = (t.match(/[^.!?]+[.!?]*/g) || []).map(function (s) { return s.trim(); }).filter(function (s) { return s && !/JavaScript|WebGL/i.test(s); }).join(" ").trim();
      el.textContent = keep || "Loading the map…";
    }
  }
  // Find the MapLibre map object that owns a container, if the page left it reachable.
  var mlMaps = [];
  function hookMapLibre() {
    var ml = window.maplibregl; if (!ml || !ml.Map || ml.Map.prototype.__thHooked) return;
    var P = ml.Map.prototype, orig = P.fire; P.__thHooked = true;
    P.fire = function () { if (mlMaps.indexOf(this) < 0) mlMaps.push(this); return orig.apply(this, arguments); };
    setTimeout(function () { try { if (P.fire !== orig) P.fire = orig; } catch (e) {} }, 20000);
  }
  function findMl(el) {
    var ml = window.maplibregl;
    for (var i = 0; i < mlMaps.length; i++) try { if (mlMaps[i].getContainer() === el) return mlMaps[i]; } catch (e) {}
    if (!ml || !ml.Map) return null;
    var names = ["map", "M", "m", "mp", "map1", "map2", "mapA", "mapB", "chart", "gmap", "theMap", "mainMap", "worldMap"];
    for (var j = 0; j < names.length; j++) {
      try { var v = (0, eval)("typeof " + names[j] + "!=='undefined'?" + names[j] + ":null"); if (v instanceof ml.Map && v.getContainer() === el) return v; } catch (e) {}
    }
    return null;
  }
  function mlHasData(m) {
    try {
      var st = m.getStyle(), src = st.sources || {};
      for (var k in src) if (/geojson|image|video|canvas/.test(src[k].type)) return true;
      var ly = st.layers || [];
      for (var i = 0; i < ly.length; i++) if (/circle|heatmap|fill-extrusion|custom/.test(ly[i].type)) return true;
    } catch (e) {}
    return false;
  }
  function ownLoader(el) {
    var box = el.closest("[data-fullscreen-map],.pane,.mapband,.mapWrap,.mapbox,.map-wrap,figure") || el.parentElement || el;
    var cands = box.querySelectorAll("#loading,#loadMsg,.loading,.th-load");
    for (var i = 0; i < cands.length; i++) if (visible(cands[i]) && !cands[i].closest(".maplibregl-popup,.leaflet-popup")) return true;
    return false;
  }
  function loader(el) {
    if (el.__thLoad) return; el.__thLoad = true;
    if (ownLoader(el)) return;
    if (getComputedStyle(el).position === "static") return;
    var tag = document.createElement("div"); tag.className = "th-load"; tag.setAttribute("role", "status");
    tag.innerHTML = "<i></i>Loading the data…"; el.appendChild(tag);
    // The page's own "Loading the map" line sits behind the map; hide it while this note shows, so the two never overlap.
    var box = el.closest("[data-fullscreen-map],.pane,.mapband,.mapWrap,.mapbox,.map-wrap,figure") || el.parentElement || el;
    var nj = [].slice.call(box.querySelectorAll(".nojs,#nojs")).filter(function (n) { return !n.contains(el) && n.style.visibility !== "hidden"; });
    nj.forEach(function (n) { n.style.visibility = "hidden"; });
    var t0 = Date.now(), firstIdle = 0, done = false;
    var finish = function () {
      if (done) return; done = true; clearInterval(iv);
      tag.classList.add("th-out"); setTimeout(function () { if (tag.parentNode) tag.parentNode.removeChild(tag); }, 350);
      nj.forEach(function (n) { n.style.visibility = ""; });
    };
    var isLeaf = el.classList.contains("leaflet-container");
    var check = function () {
      var age = Date.now() - t0;
      if (age > 15000 || !el.isConnected) return finish();
      if (isLeaf) {
        var drawn = el.querySelector(".leaflet-overlay-pane svg path,.leaflet-overlay-pane canvas,.leaflet-marker-pane>*,.leaflet-overlay-pane img");
        var tiles = el.querySelectorAll(".leaflet-tile"), waiting = el.querySelectorAll(".leaflet-tile:not(.leaflet-tile-loaded)").length;
        if (drawn && (!tiles.length || waiting === 0 || age > 6000)) finish();
        else if (!drawn && tiles.length && waiting === 0 && age > 5000) finish();
        return;
      }
      var m = findMl(el);
      if (!m) { if (age > 4000 && el.querySelector("canvas")) finish(); return; }
      var idle = false; try { idle = m.loaded() && m.areTilesLoaded() && !m.isMoving(); } catch (e) { idle = true; }
      if (!idle) return;
      if (!firstIdle) firstIdle = Date.now();
      if (mlHasData(m) || Date.now() - firstIdle > 2500) finish();
    };
    var iv = setInterval(check, 250);
  }
  // Map keys that float over the map fold away on phones, with a clear button to bring them back.
  var KEYSEL = ".keys:not(.mini),#keys:not(.mini),.key.card,#key.key,#legend.legend,.mkeys";
  function foldKeys() {
    var small = window.innerWidth < 600;
    var ks = document.querySelectorAll(KEYSEL);
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i]; if (k.__thKey || k.closest(".th-site-nav")) continue;
      var cs = getComputedStyle(k); if (cs.position !== "absolute" && cs.position !== "fixed") continue;
      if (!k.closest(".maplibregl-map,.leaflet-container,[data-fullscreen-map],.pane,.mapband,.mapWrap") && !k.parentElement.querySelector(".maplibregl-map,.leaflet-container,canvas")) continue;
      k.__thKey = true; setupKey(k, small);
    }
  }
  function setupKey(k, startFolded) {
    var btn;
    var label = function () { var f = k.classList.contains("th-kf"); btn.innerHTML = f ? "Key <span aria-hidden=\"true\">▾</span>" : "Hide key <span aria-hidden=\"true\">▴</span>"; btn.setAttribute("aria-expanded", f ? "false" : "true"); };
    var make = function () {
      btn = document.createElement("button"); btn.type = "button"; btn.className = "th-kt";
      btn.addEventListener("click", function (e) { e.stopPropagation(); k.classList.toggle("th-kf"); k.classList.toggle("th-ko", !k.classList.contains("th-kf")); label(); });
      k.insertBefore(btn, k.firstChild); label();
    };
    if (startFolded) k.classList.add("th-kf"); else k.classList.add("th-ko");
    make();
    // Some pages rewrite their key; put the button back when that happens.
    try { new MutationObserver(function () { if (!btn.isConnected || btn.parentNode !== k) make(); }).observe(k, { childList: true }); } catch (e) {}
  }
  // Tap areas of at least 44px for map chips and layer buttons on phones, without moving anything on the page.
  function hitAreas() {
    var bs = document.querySelectorAll(".chip,.lyrBtn,#lyrBtn,.ct-toggle");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i]; if (b.__thHit) continue; b.__thHit = true;
      var cs = getComputedStyle(b); if (cs.position === "static" || cs.position === "relative") b.classList.add("th-hit");
      var p = b.parentElement, pc = p && getComputedStyle(p);
      // A sideways-scrolling row clips anything outside it, so give it room above and below without changing its size on the page.
      if (p && !p.__thPad && /auto|scroll/.test(pc.overflowX) && window.innerWidth < 600) {
        p.__thPad = true;
        var pt = parseFloat(pc.paddingTop) || 0, pb = parseFloat(pc.paddingBottom) || 0, mt = parseFloat(pc.marginTop) || 0, mb = parseFloat(pc.marginBottom) || 0;
        p.style.paddingTop = (pt + 5) + "px"; p.style.paddingBottom = (pb + 5) + "px"; p.style.marginTop = (mt - 5) + "px"; p.style.marginBottom = (mb - 5) + "px";
        p.style.overflowY = "hidden";
      }
    }
  }
  // Rows of chips, buttons or cards that scroll sideways get a fade at the edge that has more to see.
  function fades() {
    var els = document.querySelectorAll(".chips,.scrollrow,.cards,.thumbs,.tabs,.seg,.cities,.tablewrap,.tablebox,[class*=row],[class*=strip],[class*=scroll],[class*=timeline]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el.closest(".maplibregl-map,.leaflet-container,.th-site-nav")) continue;
      var cs = getComputedStyle(el); if (!/auto|scroll/.test(cs.overflowX)) continue;
      if (!el.__thFade) {
        el.__thFade = true;
        (function (e) { var f = function () { edge(e); }; e.addEventListener("scroll", f, { passive: true }); })(el);
      }
      edge(el);
    }
  }
  function edge(el) {
    var max = el.scrollWidth - el.clientWidth;
    el.classList.toggle("th-fl", max > 2 && el.scrollLeft > 2);
    el.classList.toggle("th-fr", max > 2 && el.scrollLeft < max - 2);
  }
  function mapHelpers() {
    try { tidyNoJs(); } catch (e) {}
    try { hookMapLibre(); } catch (e) {}
    var scan = function () {
      var ms = document.querySelectorAll(".maplibregl-map,.leaflet-container");
      for (var i = 0; i < ms.length; i++) try { loader(ms[i]); } catch (e) {}
      try { foldKeys(); } catch (e) {}
      try { hitAreas(); } catch (e) {}
      try { fades(); } catch (e) {}
    };
    scan(); [600, 1500, 3000, 6000].forEach(function (t) { setTimeout(scan, t); });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { try { fades(); } catch (e) {} }, 200); });
  }

  function start() {
    try { headBits(); } catch (e) {}
    try { watchTheme(); } catch (e) {}
    var done = false;
    var fallback = setTimeout(function () { if (!done) { done = true; topBar(null); } }, 4000);
    if (hubPage) { clearTimeout(fallback); done = true; topBar(null); footer(null, null); }
    else fetch(CAT, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (cat) {
      var me = cat.filter(function (s) { return s.r === here; })[0];
      try { meta(me); } catch (e) {}
      if (!done) { done = true; clearTimeout(fallback); topBar(me); }
      footer(cat, me);
    }).catch(function () { if (!done) { done = true; clearTimeout(fallback); topBar(null); } footer(null, null); try { meta(null); } catch (e) {} });
    try { meta(null); } catch (e) {}
    if (!hubPage) { try { mapHelpers(); } catch (e) {} }
    setTimeout(function () { try { jump(); } catch (e) {} }, 1500);
    setTimeout(paintTheme, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
