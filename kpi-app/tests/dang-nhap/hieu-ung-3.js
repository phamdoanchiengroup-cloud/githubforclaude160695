/* ===== Hiệu ứng đợt 3 cho màn Khắc laser (demo 11/10) =====
   window.LK_HU3 = {bui, quet, nghieng, chu, go, vao}; thiếu thì tắt hết. Chạy sau khi màn đăng nhập đã khởi động.
   Tự dừng khi #gate bị ẩn (đã vào web) và tôn trọng "giảm chuyển động". */
(function () {
  var H = window.LK_HU3 || {}, G = document.getElementById('gate');
  if (!G) return;
  var giam = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var conHien = function () { return G.offsetParent !== null || getComputedStyle(G).display !== 'none'; };
  var nen = document.getElementById('lkNen');

  /* 0. Video nền dựng bằng Remotion (window.LK_VIDEO = đường dẫn / data URI, hoặc danh sách nguồn): đặt đúng khung ảnh nền, ảnh tĩnh ẩn đi khi video chạy được */
  var vid = null;
  if (H.video && window.LK_VIDEO && nen) {
    vid = document.createElement('video'); vid.className = 'lk3-video';
    vid.muted = true; vid.loop = true; vid.autoplay = true; vid.playsInline = true; vid.setAttribute('playsinline', ''); vid.setAttribute('aria-hidden', 'true');
    vid.poster = (nen.querySelector('image.anh') || {}).getAttribute ? nen.querySelector('image.anh').getAttribute('href') : '';
    // LK_VIDEO: 1 đường dẫn, hoặc danh sách [[src, kiểu], …] (WebM trước – nhẹ hơn; MP4 sau cho Safari đời cũ)
    [].concat(typeof window.LK_VIDEO === 'string' ? [[window.LK_VIDEO, '']] : window.LK_VIDEO).forEach(function (v) {
      var so = document.createElement('source'); so.src = v[0]; if (v[1]) so.type = v[1]; vid.appendChild(so); });
    nen.parentNode.insertBefore(vid, nen);
    var khop = function () {   // cùng khung + cùng kiểu cắt ảnh với SVG nền (máy tính: giữa; điện thoại: bám trái)
      vid.style.top = nen.offsetTop + 'px'; vid.style.left = nen.offsetLeft + 'px'; vid.style.width = nen.clientWidth + 'px'; vid.style.height = nen.clientHeight + 'px';
      vid.style.objectPosition = /^xMin/.test(nen.getAttribute('preserveAspectRatio') || '') ? 'left center' : 'center';
    };
    khop(); window.addEventListener('resize', function () { setTimeout(khop, 0); });
    vid.addEventListener('playing', function () { G.classList.add('lk3-co-video'); });
    if (giam) { vid.autoplay = false; vid.removeAttribute('autoplay'); }   // giảm chuyển động: chỉ hiện khung đầu
    else { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) vid.pause(); else if (!giam && conHien()) vid.play().catch(function () {}); });
    setInterval(function () { if (!conHien() && !vid.paused) vid.pause(); }, 1000);   // đã vào web: dừng video cho nhẹ máy
  }

  /* 1. Bụi carbon lấp lánh: hạt bụi bay lên chậm trong luồng sáng + đốm lóe trên lớp hạt carbon phía dưới */
  if (H.bui && !giam && nen) {
    var cv = document.createElement('canvas'); cv.className = 'lk3-bui'; nen.parentNode.insertBefore(cv, nen.nextSibling);
    var cx = cv.getContext('2d'), W = 0, Hh = 0, dpr = Math.min(1.5, window.devicePixelRatio || 1), hat = [], loe = [], dt = 0;
    var dt0 = performance.now();
    var dung = function () {
      W = cv.clientWidth; Hh = cv.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = W < 700 ? 22 : 46; hat = [];
      for (var i = 0; i < n; i++) hat.push({ x: Math.random() * W, y: Math.random() * Hh, r: .6 + Math.random() * 1.6, v: 6 + Math.random() * 14, p: Math.random() * 6.28, a: .25 + Math.random() * .45 });
      loe = [];
      for (var j = 0; j < (W < 700 ? 10 : 22); j++) loe.push({ x: Math.random() * W, y: Hh * (.55 + Math.random() * .42), t: Math.random() * 4, k: 2.5 + Math.random() * 3 });
    };
    dung(); window.addEventListener('resize', dung);
    (function ve(t) {
      requestAnimationFrame(ve);
      if (document.hidden || !conHien()) return;
      var d = Math.min(.05, (t - dt0) / 1000); dt0 = t; dt += d;
      cx.clearRect(0, 0, W, Hh);
      hat.forEach(function (h) {
        h.y -= h.v * d; h.x += Math.sin(dt * .6 + h.p) * 6 * d;
        if (h.y < -4) { h.y = Hh + 4; h.x = Math.random() * W; }
        var g = cx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r * 4);
        g.addColorStop(0, 'rgba(255,236,205,' + h.a + ')'); g.addColorStop(1, 'rgba(255,236,205,0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(h.x, h.y, h.r * 4, 0, 6.29); cx.fill();
      });
      loe.forEach(function (l) {
        var f = ((dt + l.t) % l.k) / l.k, s = f < .12 ? f / .12 : f < .3 ? 1 - (f - .12) / .18 : 0;
        if (s <= 0) { if (f > .95) { l.x = Math.random() * W; l.y = Hh * (.55 + Math.random() * .42); } return; }
        cx.strokeStyle = 'rgba(255,250,235,' + (.85 * s) + ')'; cx.lineWidth = 1;
        var r = 2 + 5 * s; cx.beginPath(); cx.moveTo(l.x - r, l.y); cx.lineTo(l.x + r, l.y); cx.moveTo(l.x, l.y - r); cx.lineTo(l.x, l.y + r); cx.stroke();
        cx.fillStyle = 'rgba(255,255,255,' + s + ')'; cx.beginPath(); cx.arc(l.x, l.y, 1.2, 0, 6.29); cx.fill();
      });
    })(dt0);
  }

  /* 2. Vệt sáng quét qua các ngọn cơ (7,5 giây / lần) */
  if (H.quet && !giam && nen) { var q = document.createElement('div'); q.className = 'lk3-quet'; nen.parentNode.insertBefore(q, nen.nextSibling); }

  /* 3. Nghiêng theo chuột (máy tính) / theo độ nghiêng điện thoại */
  if (H.nghieng && !giam && nen) {
    G.classList.add('lk3-ng');
    var goc = G.querySelector('.lk-goc'), dat = function (x, y) {   // x, y trong khoảng -1…1
      nen.style.transform = 'scale(1.035) translate(' + (-x * 14).toFixed(1) + 'px,' + (-y * 9).toFixed(1) + 'px)';
      if (vid) vid.style.transform = nen.style.transform;
      if (goc) goc.style.transform = 'translate(' + (x * 6).toFixed(1) + 'px,' + (y * 4).toFixed(1) + 'px)';
    };
    dat(0, 0);
    G.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') dat(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1); });
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return; dat(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 40) / 25)));
    });
  }

  /* chia chữ trong một phần tử thành từng <span> (giữ nguyên <br>, <em>, <b>) */
  function chia(el, lop) {
    var ds = [];
    (function di(n) {
      [].slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split('').forEach(function (ch) { var s = document.createElement('span'); s.className = lop; s.textContent = ch; if (ch === ' ') s.style.whiteSpace = 'pre'; f.appendChild(s); ds.push(s); });
          n.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') di(c);
      });
    })(el);
    return ds;
  }

  /* 4. Tiêu đề "Mỗi người một dấu ấn" hiện dần từng chữ, có đốm laser chạy theo */
  if (H.chu && !giam) {
    var cau = G.querySelector('.lk-goc .lk-cau'), gocC = G.querySelector('.lk-goc');
    if (cau) {
      var chuK = chia(cau, 'lk3-k'), tia = document.createElement('i'); tia.className = 'lk3-tia'; gocC.appendChild(tia); gocC.classList.add('lk3-cho');
      var k = 0, chay = function () {
        if (k >= chuK.length) { tia.style.opacity = 0; gocC.classList.remove('lk3-cho'); setTimeout(function () { chuK.forEach(function (s) { s.classList.add('nguoi'); }); }, 300); return; }
        var s = chuK[k++], r = s.getBoundingClientRect(), rg = gocC.getBoundingClientRect();
        tia.style.left = (r.left - rg.left + r.width / 2) + 'px'; tia.style.top = (r.top - rg.top + r.height * .55) + 'px';
        s.classList.add('ra'); setTimeout(chay, s.textContent === ' ' ? 30 : 75);
      };
      // chờ cửa cuốn (nếu có) mở xong mới bắt đầu khắc
      (function cho() { if (G.classList.contains('lk-chuabat')) { setTimeout(cho, 200); return; } setTimeout(chay, 500); })();
    }
  }

  /* 5. Lời Rhino hiện từng chữ như đang gõ */
  if (H.go && !giam && typeof bbMai === 'function') {
    var bbMaiCu = bbMai, hen = 0;
    bbMai = function (lop, noi, lo) {
      bbMaiCu.apply(this, arguments);
      var n = document.getElementById('rhMaiNoi'); if (!n || noi == null) return;
      clearTimeout(hen); var ds = chia(n, 'lk3-c'), i = 0;
      (function go() { if (i < ds.length) { ds[i++].classList.add('ra'); hen = setTimeout(go, 18); } })();
    };
  }

  /* 6. Đăng nhập đúng: tia laser quét màn hình từ trên xuống, phía sau tối dần, logo hiện giữa rồi mới vào trang */
  if (H.vao && !giam && typeof bbTrung === 'function') {
    var bbTrungCu = bbTrung;
    bbTrung = function (tiep) {
      bbTrungCu.call(this, function () {
        var m = document.createElement('div'), logo = G.querySelector('.lk-dau img');
        m.className = 'lk3-man'; m.innerHTML = '<div class="toi"></div><div class="tia"></div>' + (logo ? '<img class="logo" alt="" src="' + logo.src + '">' : '');
        document.body.appendChild(m);
        setTimeout(function () { tiep(); m.style.transition = 'opacity .5s'; m.style.opacity = 0; setTimeout(function () { m.remove(); }, 550); }, 1500);
      });
    };
  }
})();
