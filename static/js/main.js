// Le site reste entièrement utilisable sans JavaScript (chaque fleur est un vrai lien).
// Avec JavaScript :
// 1. un clic sur une fleur fait glisser le dessin en miniature, à un endroit aléatoire,
//    et affiche la page en dessous, sans recharger ;
// 2. un clic sur la miniature ramène à l'accueil (le dessin reprend toute la place) ;
// 3. les photos de la galerie s'agrandissent.

(function () {
  var root = document.documentElement;
  var panel = document.getElementById("contenu");
  var garden = document.getElementById("scene");
  var flowers = document.querySelectorAll(".flower");
  var homePath = new URL(document.querySelector(".site-name a").href).pathname.replace(/\/$/, "");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isHome(url) { return url.pathname.replace(/\/$/, "") === homePath; }
  function rand(min, max) { return min + Math.random() * (max - min); }

  // Place la miniature au hasard : un des 4 coins (grands écrans) ou à gauche / au centre / à droite
  // du bandeau du haut (écrans plus étroits), avec une légère inclinaison.
  function randomizePlace() {
    var corners = ["tl", "tr", "bl", "br"], sides = ["flex-start", "center", "flex-end"];
    root.dataset.corner = corners[Math.floor(Math.random() * corners.length)];
    root.style.setProperty("--hpos", sides[Math.floor(Math.random() * sides.length)]);
    root.style.setProperty("--tilt", rand(-5, 5).toFixed(1) + "deg");
    root.style.setProperty("--jx", rand(0, 3).toFixed(1) + "rem");
    root.style.setProperty("--jy", rand(0, 5).toFixed(1) + "rem");
  }

  function setCurrent(url) {
    flowers.forEach(function (f) {
      if (new URL(f.href).pathname.replace(/\/$/, "") === url.pathname.replace(/\/$/, "")) f.setAttribute("aria-current", "page");
      else f.removeAttribute("aria-current");
    });
  }

  // Animation « FLIP » : le dessin glisse et change de taille de son ancienne place à la nouvelle.
  function animateFrom(first) {
    var last = garden.getBoundingClientRect();
    var dx = first.left - last.left, dy = first.top - last.top, s = first.width / last.width;
    if (reduceMotion || !isFinite(s) || (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(s - 1) < 0.01)) return;
    garden.style.transition = "none";
    garden.style.transformOrigin = "top left";
    garden.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
    garden.getBoundingClientRect(); // force le calcul avant de lancer la transition
    garden.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1)";
    garden.style.transform = "";
    setTimeout(function () { garden.style.transition = ""; garden.style.transformOrigin = ""; }, 800);
  }

  function show(url, push) {
    return fetch(url.href)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var fresh = doc.getElementById("contenu");
        if (!fresh) throw new Error("page sans contenu");
        var toHome = isHome(url), wasHome = root.classList.contains("home");
        var first = garden.getBoundingClientRect();
        if (wasHome && !toHome) randomizePlace();
        panel.innerHTML = fresh.innerHTML;
        document.title = doc.title;
        setCurrent(url);
        root.classList.toggle("home", toHome);
        root.classList.toggle("page", !toHome);
        if (push) history.pushState(null, "", url.href);
        window.scrollTo({ top: 0, behavior: "instant" });
        animateFrom(first);
        if (!toHome) panel.focus({ preventScroll: true });
      })
      .catch(function () { window.location.href = url.href; }); // en cas de souci : navigation normale
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.classList.contains("gallery-item")) return; // géré plus bas
    var url = new URL(a.href, location.href);
    // une page du site : même origine, pas de fichier (.jpg, .css…), pas d'ancre, pas de nouvel onglet
    var internal = url.origin === location.origin && !/\.[a-z0-9]+$/i.test(url.pathname) && !url.hash && !a.target;
    if (!internal) return;
    e.preventDefault();
    show(url, true);
  });

  window.addEventListener("popstate", function () { show(new URL(location.href), false); });

  // Galerie : la fenêtre d'agrandissement fait partie du contenu chargé, donc on délègue les événements.
  document.addEventListener("click", function (e) {
    var box = document.getElementById("lightbox");
    if (!box || typeof box.showModal !== "function") return;
    var link = e.target.closest(".gallery-item");
    if (link) {
      e.preventDefault();
      var big = box.querySelector("img");
      big.src = link.href;
      big.alt = link.querySelector("img").alt;
      box.showModal();
    } else if (e.target === box) {
      box.close(); // un clic en dehors de la photo ferme la fenêtre
    }
  });
})();
