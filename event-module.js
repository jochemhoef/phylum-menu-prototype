/* WEB-551 — paints #event-takeover from assets/homepage-event.json.
   Edit that file to swap the homepage event. Set "active" to false to hide it. */
(function () {
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(spec, className) {
    if (!spec || !spec.href) return null;
    var link = el("a", className, spec.label || "Learn more");
    link.href = spec.href;
    return link;
  }

  function render(event, mount) {
    mount.replaceChildren();
    mount.classList.remove("event-takeover--ink", "event-takeover--deep", "event-takeover--flip");
    if (!event || event.active === false) {
      mount.hidden = true;
      mount.removeAttribute("aria-labelledby");
      return;
    }

    mount.hidden = false;
    if (event.tone === "ink") mount.classList.add("event-takeover--ink");
    if (event.tone === "deep") mount.classList.add("event-takeover--deep");
    if (event.imageSide === "left") mount.classList.add("event-takeover--flip");

    var title = el("h2", "event-title", event.title || "In the shop");
    title.id = "event-takeover-title";

    var kicker = el("p", "event-kicker");
    var sun = el("span", "event-sun");
    sun.setAttribute("aria-hidden", "true");
    kicker.append(sun, document.createTextNode(event.kicker || "In the shop"));

    var copy = el("div", "event-copy");
    copy.append(kicker, title);
    if (event.blurb) copy.append(el("p", "event-blurb", event.blurb));
    if (event.meta) copy.append(el("p", "event-meta", event.meta));

    var ctas = el("div", "event-ctas");
    var primary = button(event.cta, "event-btn event-btn--solid");
    var secondary = button(event.secondary, "event-btn event-btn--ghost");
    if (primary) ctas.append(primary);
    if (secondary) ctas.append(secondary);
    if (ctas.childNodes.length) copy.append(ctas);

    var figure = el("figure", "event-media");
    var img = document.createElement("img");
    img.src = event.image || "";
    img.alt = event.imageAlt || "";
    img.decoding = "async";
    figure.append(img);

    var grid = el("div", "event-grid");
    grid.append(copy, figure);
    mount.append(grid);
    mount.setAttribute("aria-labelledby", title.id);
  }

  function init() {
    var mount = document.getElementById("event-takeover");
    if (!mount) return;
    var src = mount.getAttribute("data-event-src");
    if (!src) return;
    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error("Event config " + res.status);
        return res.json();
      })
      .then(function (data) { render(data, mount); })
      .catch(function () { mount.hidden = true; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
