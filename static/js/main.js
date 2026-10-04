// Le site reste entièrement utilisable sans JavaScript (chaque fleur est un vrai lien).
// Avec JavaScript :
// 1. un clic sur une fleur affiche la page en bas, sans recharger la scène des lianes ;
// 2. les photos de la galerie s'agrandissent.

(function () {
  var panel = document.getElementById("contenu");
  var flowers = document.querySelectorAll(".flower");

  function setCurrent(url) {
    flowers.forEach(function (f) {
      if (new URL(f.href).pathname === url.pathname) f.setAttribute("aria-current", "page");
      else f.removeAttribute("aria-current");
    });
  }

  function show(url, push) {
    return fetch(url.href)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var fresh = doc.getElementById("contenu");
        if (!fresh) throw new Error("page sans contenu");
        panel.innerHTML = fresh.innerHTML;
        document.title = doc.title;
        setCurrent(url);
        if (push) history.pushState(null, "", url.href);
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        panel.focus({ preventScroll: true });
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
