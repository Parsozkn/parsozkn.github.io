/* Pars v2 — güvenli, bağımlılıksız JS.
   Uzak veri (GitHub) hep textContent ile çizilir, URL'ler doğrulanır. */
(function () {
  "use strict";
  var EPOSTA = "ankoralinux@proton.me";
  var GITHUB = "https://github.com/Parsozkn/";

  function guvenliGhUrl(u) {
    return typeof u === "string" && u.indexOf("https://github.com/Parsozkn") === 0 ? u : GITHUB;
  }

  /* Tema */
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

  /* Saat + selamlama + yıl */
  try {
    var saat = document.getElementById("saat");
    var selam = document.getElementById("selam");
    var guncelle = function () {
      var simdi = new Date();
      saat.textContent = simdi.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      var h = simdi.getHours();
      selam.textContent = h >= 6 && h < 12 ? "günaydın" : h >= 12 && h < 18 ? "iyi günler" : h >= 18 && h < 23 ? "iyi akşamlar" : "iyi geceler";
    };
    guncelle(); setInterval(guncelle, 30000);
    document.getElementById("yil").textContent = String(new Date().getFullYear());
  } catch (e) {}

  /* Özel imleç + manyetik butonlar (sadece ince işaretçi) */
  var dusukHareket = false;
  try { dusukHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try {
    if (window.matchMedia("(pointer:fine)").matches && !dusukHareket) {
      document.body.classList.add("imlec-acik");
      var imlec = document.getElementById("imlec");
      var halka = document.getElementById("imlecHalka");
      var x = 0, y = 0, hx = 0, hy = 0;
      document.addEventListener("mousemove", function (e) {
        x = e.clientX; y = e.clientY;
        imlec.style.transform = "translate(" + (x - 3.5) + "px," + (y - 3.5) + "px)";
      }, { passive: true });
      (function dongu() {
        hx += (x - hx) * 0.16; hy += (y - hy) * 0.16;
        halka.style.transform = "translate(" + (hx - 18) + "px," + (hy - 18) + "px)";
        requestAnimationFrame(dongu);
      })();
      document.querySelectorAll("a, button, .tik, input").forEach(function (el) {
        el.addEventListener("mouseenter", function () { document.body.classList.add("imlec-buyuk"); });
        el.addEventListener("mouseleave", function () { document.body.classList.remove("imlec-buyuk"); });
      });
      document.querySelectorAll(".manyetik").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - r.left - r.width / 2) * 0.18;
          var dy = (e.clientY - r.top - r.height / 2) * 0.28;
          el.style.transform = "translate(" + dx + "px," + dy + "px)";
        });
        el.addEventListener("mouseleave", function () { el.style.transform = ""; });
      });
    }
  } catch (e) {}
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    var acik = nav.classList.toggle("acik");
    burger.setAttribute("aria-expanded", acik ? "true" : "false");
  });
  document.getElementById("navLinks").addEventListener("click", function (e) {
    if (e.target && e.target.tagName === "A") nav.classList.remove("acik");
  });

  /* İlerleme + yukarı butonu + aktif menü */
  var ilerleme = document.getElementById("ilerleme");
  var yukari = document.getElementById("yukari");
  var baglar = Array.prototype.slice.call(document.querySelectorAll(".links a"));
  var bolumler = Array.prototype.slice.call(document.querySelectorAll(".bolum"));
  function kaydirma() {
    var h = document.documentElement;
    var oran = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    ilerleme.style.width = (oran * 100).toFixed(1) + "%";
    yukari.hidden = h.scrollTop < 600;
    var aktif = null;
    bolumler.forEach(function (b) { if (b.getBoundingClientRect().top < 140) aktif = b.id; });
    baglar.forEach(function (a) {
      a.classList.toggle("aktif", a.getAttribute("href") === "#" + aktif);
    });
  }
  document.addEventListener("scroll", kaydirma, { passive: true });
  kaydirma();
  yukari.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Hero ışıması (fare takibi) */
  try {
    var hero = document.querySelector(".hero");
    if (hero && window.matchMedia("(pointer:fine)").matches) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--hx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        hero.style.setProperty("--hy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      }, { passive: true });
    }
  } catch (e) {}

  /* Görünme */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (!g.isIntersecting) return;
        g.target.classList.add("gorunur");
        io.unobserve(g.target);
      });
    }, { threshold: 0.1 });
    bolumler.forEach(function (b) { io.observe(b); });
    document.querySelector(".hero").classList.add("gorunur");
  } else {
    bolumler.forEach(function (b) { b.classList.add("gorunur"); });
  }

  /* Kart ışıltısı (fare takibi, sadece ince işaretçi) */
  try {
    if (window.matchMedia("(pointer:fine)").matches) {
      document.querySelectorAll(".kart").forEach(function (kart) {
        kart.addEventListener("mousemove", function (e) {
          var r = kart.getBoundingClientRect();
          kart.style.setProperty("--mx", (e.clientX - r.left) + "px");
          kart.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
      });
    }
  } catch (e) {}

  /* Filtreler */
  var filtreBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filtre]"));
  var kartlar = Array.prototype.slice.call(document.querySelectorAll("#projeKartlari [data-kat], .amiral[data-kat]"));
  filtreBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filtreBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filtre");
      kartlar.forEach(function (k) {
        k.classList.toggle("gizli", f !== "all" && k.getAttribute("data-kat") !== f);
      });
    });
  });

  /* Mini terminal */
  var govde = document.getElementById("termGovde");
  var form = document.getElementById("termForm");
  var input = document.getElementById("termInput");
  var CEVAPLAR = {
    yardim: "Komutlar: linux, devsecops, arduino, esp32, web, ankora, github, eposta, temizle",
    linux: "Kurulum, özelleştirme ve dağıtım denemeleri.",
    devsecops: "Sertleştirme ve güvenli pipeline notları.",
    arduino: "Devreler, sensörler, küçük otomasyonlar.",
    esp32: "Kablosuz sensör düğümleri.",
    web: "Hızlı ve sade siteler. Bu site dahil.",
    ankora: "Debian tabanlı dağıtım çalışmam. Test aşamasında.",
    github: "github.com/Parsozkn",
    eposta: EPOSTA
  };
  function satir(komutMu, metin) {
    var div = document.createElement("div");
    var on = document.createElement("span");
    on.textContent = komutMu ? "pars@site:~$ " : "> ";
    on.style.color = komutMu ? "#22c55e" : "#8E8E93";
    var ic = document.createElement("span");
    ic.textContent = metin;
    div.appendChild(on); div.appendChild(ic);
    govde.appendChild(div);
    govde.scrollTop = govde.scrollHeight;
    while (govde.children.length > 60) govde.removeChild(govde.firstChild);
  }
  satir(false, "Hoş geldin. 'yardim' yaz.");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ham = input.value.slice(0, 60).trim().toLowerCase();
    if (!ham) return;
    satir(true, ham);
    if (ham === "temizle") { govde.textContent = ""; satir(false, "Temizlendi."); }
    else if (Object.prototype.hasOwnProperty.call(CEVAPLAR, ham)) satir(false, CEVAPLAR[ham]);
    else satir(false, "Bunu bilmiyorum. 'yardim' yaz.");
    input.value = "";
  });

  /* Canlı GitHub (güvenli çizim, sessiz geri dönüş) */
  var ghDurum = document.getElementById("ghDurum");
  function statikMod() {
    ghDurum.textContent = "Çevrimdışı önizleme — güncel sayılar için profili aç.";
  }
  try {
    fetch("https://api.github.com/users/Parsozkn").then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.json();
    }).then(function (u) {
      document.getElementById("ghRepo").textContent = String(u.public_repos || 0);
      document.getElementById("ghTakipci").textContent = String(u.followers || 0);
      ghDurum.textContent = "Canlı veri • github.com/Parsozkn";
      return fetch("https://api.github.com/users/Parsozkn/repos?sort=updated&per_page=100");
    }).then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.json();
    }).then(function (repos) {
      var liste = document.getElementById("ghDepolar");
      liste.textContent = "";
      var arr = Array.isArray(repos) ? repos : [];
      var yildiz = 0;
      arr.forEach(function (r) { yildiz += Number(r.stargazers_count) || 0; });
      document.getElementById("ghYildiz").textContent = String(yildiz);
      arr.slice(0, 6).forEach(function (repo) {
        var a = document.createElement("a");
        a.href = guvenliGhUrl(repo.html_url);
        a.target = "_blank"; a.rel = "noopener noreferrer";
        var baslik = document.createElement("strong");
        baslik.textContent = String(repo.name || "depo");
        var acik = document.createElement("span");
        acik.textContent = String(repo.description || "Açıklama yok.");
        var alt = document.createElement("small");
        alt.textContent = "★ " + String(repo.stargazers_count || 0) + " • " + String(repo.language || "—");
        a.appendChild(baslik); a.appendChild(acik); a.appendChild(alt);
        var li = document.createElement("li");
        li.appendChild(a);
        liste.appendChild(li);
      });
      if (!liste.children.length) statikMod();
    }).catch(statikMod);
  } catch (e) { statikMod(); }

  /* E-posta kopyala + bildirim */
  var kopyalaBtn = document.getElementById("epostaKopyala");
  var toast = document.getElementById("toast");
  var toastZaman = null;
  function bildirim(metin) {
    toast.textContent = metin;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("goster"); });
    clearTimeout(toastZaman);
    toastZaman = setTimeout(function () {
      toast.classList.remove("goster");
      setTimeout(function () { toast.hidden = true; }, 350);
    }, 2000);
  }
  kopyalaBtn.addEventListener("click", function () {
    function tamam() { bildirim("E-posta kopyalandı ✓"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EPOSTA).then(tamam, function () { window.location.href = "mailto:" + EPOSTA; });
    } else { window.location.href = "mailto:" + EPOSTA; }
  });

  /* Komut paleti */
  var palet = document.getElementById("palet");
  var paletInput = document.getElementById("paletInput");
  var paletListe = document.getElementById("paletListe");
  var SECENEKLER = [
    { ad: "Alanlara git", ipucu: "#alanlar", is: function () { location.hash = "#alanlar"; } },
    { ad: "İşlere git", ipucu: "#isler", is: function () { location.hash = "#isler"; } },
    { ad: "Yolculuğa git", ipucu: "#yolculuk", is: function () { location.hash = "#yolculuk"; } },
    { ad: "GitHub bölümüne git", ipucu: "#github", is: function () { location.hash = "#github"; } },
    { ad: "İletişime git", ipucu: "#iletisim", is: function () { location.hash = "#iletisim"; } },
    { ad: "GitHub profilini aç", ipucu: "dış bağlantı", is: function () { window.open(GITHUB, "_blank", "noopener"); } },
    { ad: "E-posta adresini kopyala", ipucu: EPOSTA, is: function () { kopyalaBtn.click(); } },
    { ad: "Temayı değiştir", ipucu: "açık/koyu", is: function () { themeBtn.click(); } }
  ];
  var secili = 0;
  function paletCiz(filtre) {
    paletListe.textContent = "";
    var f = (filtre || "").toLocaleLowerCase("tr");
    var eslesen = SECENEKLER.filter(function (s) { return s.ad.toLocaleLowerCase("tr").indexOf(f) !== -1; });
    if (!eslesen.length) {
      var bos = document.createElement("li");
      bos.textContent = "Sonuç yok.";
      paletListe.appendChild(bos);
      return [];
    }
    eslesen.forEach(function (s, i) {
      var li = document.createElement("li");
      if (i === secili) li.classList.add("secilmis");
      li.setAttribute("role", "option");
      var ad = document.createElement("span");
      ad.textContent = s.ad;
      var ip = document.createElement("small");
      ip.textContent = s.ipucu;
      li.appendChild(ad); li.appendChild(ip);
      li.addEventListener("click", function () { paletKapat(); s.is(); });
      paletListe.appendChild(li);
    });
    return eslesen;
  }
  var acikListe = [];
  function paletAc() { palet.hidden = false; paletInput.value = ""; secili = 0; acikListe = paletCiz(""); setTimeout(function () { paletInput.focus(); }, 30); }
  function paletKapat() { palet.hidden = true; }
  document.getElementById("komutAc").addEventListener("click", paletAc);
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase("tr") === "k") { e.preventDefault(); palet.hidden ? paletAc() : paletKapat(); }
    else if (e.key === "Escape" && !palet.hidden) paletKapat();
    else if (!palet.hidden && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      secili = e.key === "ArrowDown" ? secili + 1 : secili - 1;
      if (secili < 0) secili = acikListe.length - 1;
      if (secili >= acikListe.length) secili = 0;
      paletCiz(paletInput.value);
    } else if (!palet.hidden && e.key === "Enter" && acikListe[secili]) {
      paletKapat(); acikListe[secili].is();
    }
  });
  paletInput.addEventListener("input", function () { secili = 0; acikListe = paletCiz(paletInput.value); });
  palet.addEventListener("click", function (e) { if (e.target === palet) paletKapat(); });

  /* Proje penceresi */
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
