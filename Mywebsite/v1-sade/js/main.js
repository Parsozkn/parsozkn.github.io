/* Pars Ozkn — güvenli, bağımlılıksız JS. textContent dışında kullanıcı verisi işlenmez. */
(function () {
  "use strict";

  var themeBtn = document.getElementById("themeBtn");
  try {
    if (localStorage.getItem("tema") === "acik") {
      document.documentElement.setAttribute("data-tema", "acik");
      themeBtn.setAttribute("aria-pressed", "true");
    }
  } catch (e) {}
  themeBtn.addEventListener("click", function () {
    var acik = document.documentElement.getAttribute("data-tema") === "acik";
    if (acik) {
      document.documentElement.removeAttribute("data-tema");
      themeBtn.setAttribute("aria-pressed", "false");
      try { localStorage.removeItem("tema"); } catch (e) {}
    } else {
      document.documentElement.setAttribute("data-tema", "acik");
      themeBtn.setAttribute("aria-pressed", "true");
      try { localStorage.setItem("tema", "acik"); } catch (e) {}
    }
  });

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    var acik = nav.classList.toggle("acik");
    burger.setAttribute("aria-expanded", acik ? "true" : "false");
  });
  document.getElementById("navLinks").addEventListener("click", function (e) {
    if (e.target && e.target.tagName === "A") nav.classList.remove("acik");
  });

  var bolumler = document.querySelectorAll(".bolum");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.add("gorunur"); io.unobserve(g.target); }
      });
    }, { threshold: 0.08 });
    bolumler.forEach(function (b) { io.observe(b); });
  } else {
    bolumler.forEach(function (b) { b.classList.add("gorunur"); });
  }

  var VERI = {
    ankora: { etiket: "Öne çıkan", baslik: "Ankora Linux", metinler: ["Debian tabanlı dağıtım çalışması.", "Calamares kurulum, XFCE / GNOME denemesi.", "Gerçek donanımda test ediliyor."] },
    arduino: { etiket: "Alan", baslik: "Arduino", metinler: ["Devreler, sensörler, küçük otomasyonlar."] },
    esp32: { etiket: "Alan", baslik: "ESP32", metinler: ["Kablosuz sensör düğümleri."] },
    rom: { etiket: "Alan", baslik: "Custom ROM", metinler: ["Kurulum, recovery, yedekleme."] },
    web: { etiket: "Alan", baslik: "Web Siteleri", metinler: ["Hızlı ve sade arayüzler. Bu site dahil."] },
    donanim: { etiket: "Alan", baslik: "Eski Donanım", metinler: ["Hafif sistemlerle canlandırma."] },
    guvenlik: { etiket: "Alan", baslik: "DevSecOps", metinler: ["Sertleştirme, güvenli pipeline notları."] }
  };
  var pencere = document.getElementById("pencere");
  var pEtiket = document.getElementById("pencereEtiket");
  var pBaslik = document.getElementById("pencereBaslik");
  var pIcerik = document.getElementById("pencereIcerik");
  var kapatBtn = document.getElementById("pencereKapat");
  var sonOdak = null;
  function pencereAc(anahtar) {
    var v = VERI[anahtar];
    if (!v) return;
    sonOdak = document.activeElement;
    pEtiket.textContent = v.etiket;
    pBaslik.textContent = v.baslik;
    pIcerik.textContent = "";
    v.metinler.forEach(function (m) {
      var p = document.createElement("p");
      p.textContent = m;
      p.style.marginBottom = ".6rem";
      pIcerik.appendChild(p);
    });
    pencere.hidden = false;
    kapatBtn.focus();
  }
  function pencereKapat() {
    pencere.hidden = true;
    if (sonOdak && sonOdak.focus) sonOdak.focus();
  }
  document.querySelectorAll("[data-proje]").forEach(function (el) {
    el.addEventListener("click", function () { pencereAc(el.getAttribute("data-proje")); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pencereAc(el.getAttribute("data-proje")); }
    });
  });
  kapatBtn.addEventListener("click", pencereKapat);
  pencere.addEventListener("click", function (e) { if (e.target === pencere) pencereKapat(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pencere.hidden) pencereKapat(); });
})();
