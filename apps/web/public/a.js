(function () {
  "use strict";

  var BASE = "https://halalads.com";

  function init() {
    var units = document.querySelectorAll('[id="ha-ad-unit"]');
    if (!units.length) return;
    units.forEach(function (el) {
      var pub = el.getAttribute("data-pub");
      var size = el.getAttribute("data-size") || "300x250";
      if (!pub) return;
      loadAd(el, pub, size);
    });
  }

  function loadAd(el, pub, size) {
    var dims = size.split("x");
    var w = dims[0] || "300";
    var h = dims[1] || "250";

    var url =
      BASE + "/api/serve/" + pub + "?pub=" + pub + "&size=" + size;

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ad) return;
        render(el, data.ad, w, h);
      })
      .catch(function () {});
  }

  function render(el, ad, w, h) {
    var creative = ad.creative;
    var tracking = ad.tracking;

    // Fire impression pixel
    var img = new Image();
    img.src = tracking.impressionUrl;

    // Build ad container
    var wrap = document.createElement("div");
    wrap.style.cssText =
      "width:" + w + "px;height:" + h + "px;overflow:hidden;display:block;";

    var link = document.createElement("a");
    link.href = BASE + "/api/track/click?aid=" + ad.id + "&url=" +
      encodeURIComponent(creative.destinationUrl);
    link.target = "_blank";
    link.rel = "noopener sponsored";
    link.style.cssText = "display:block;width:100%;height:100%;text-decoration:none;";

    if (creative.imageUrl) {
      var banner = document.createElement("img");
      banner.src = creative.imageUrl;
      banner.alt = creative.headline || "Advertisement";
      banner.style.cssText = "width:100%;height:100%;object-fit:cover;border:0;";
      link.appendChild(banner);
    } else {
      // Fallback text ad
      var fallback = document.createElement("div");
      fallback.style.cssText =
        "width:100%;height:100%;background:#0A5C36;display:flex;flex-direction:column;" +
        "align-items:center;justify-content:center;padding:12px;box-sizing:border-box;";
      fallback.innerHTML =
        '<p style="color:#C9A84C;font-size:12px;margin:0 0 4px;font-family:serif;font-weight:bold;">' +
        escHtml(creative.headline) + "</p>" +
        '<p style="color:rgba(255,255,255,0.8);font-size:10px;margin:0 0 8px;font-family:sans-serif;text-align:center;">' +
        escHtml(creative.description || "") + "</p>" +
        '<span style="background:#C9A84C;color:#1A1A2E;font-size:10px;font-weight:bold;padding:4px 12px;border-radius:20px;font-family:sans-serif;">' +
        escHtml(creative.ctaText || "Learn More") + "</span>";
      link.appendChild(fallback);
    }

    wrap.appendChild(link);
    el.innerHTML = "";
    el.appendChild(wrap);
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
