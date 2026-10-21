/* ===== MÀN ĐĂNG NHẬP "TRẠM KHẮC" (demo 11/10) – chạy sau mã gốc dang-nhap-khac.html, trước bbKhoiDong() =====
   Thêm: bảng đọc số của máy (góc phải trên) + vòng ngắm đầu khắc có đường ghi chú. Bọc lkVe / lkLua / bbTrung / bbTruot / bbXep, không đổi API. */
(function () {
  var NS = 'http://www.w3.org/2000/svg', G = document.getElementById('gate'), nen = document.getElementById('lkNen');
  if (!G || !nen) return;
  var MAX = 14;

  /* 1. bảng đọc số */
  var doc = document.createElement('div'); doc.className = 'tk-doc'; doc.setAttribute('aria-hidden', 'true');
  doc.innerHTML = '<div class="h"><i></i>Trạm khắc laser · ngọn 03</div><dl><dt>Mã đang khắc</dt><dd><b id="tkMa">—</b></dd>' +
    '<dt>Ký tự</dt><dd id="tkSo">0 / ' + MAX + '</dd><dt>Trạng thái</dt><dd id="tkTt">Chờ mã nhân viên</dd></dl><div class="vach"><i id="tkVach"></i></div>';
  G.insertBefore(doc, G.querySelector('.lk-kinh'));

  /* 2. vòng ngắm + đường ghi chú kiểu bản vẽ */
  var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'tk-ngam'); g.id = 'tkNgam';
  g.innerHTML = '<circle r="30"/><circle class="trong xoay" r="44"/><path d="M-58 0h16M42 0h16M0 -58v16M0 42v16"/>' +
    '<path id="tkDan" d="M30 -30L96 -96h170"/><text id="tkNhan" x="108" y="-108">Đầu khắc</text><text class="so" id="tkNhanSo" x="108" y="-74">—</text>';
  nen.appendChild(g);
  var trai = function () { return window.matchMedia('(max-width:760px)').matches; };
  function datNgam() {
    var p = lkDauBut(), t = trai();
    g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
    // điện thoại: ảnh bám trái nên ghi chú quay sang trái cho khỏi bị cắt
    document.getElementById('tkDan').setAttribute('d', t ? 'M-30 -30L-96 -96h-190' : 'M30 -30L96 -96h170');
    ['tkNhan', 'tkNhanSo'].forEach(function (id) { var e = document.getElementById(id); e.setAttribute('x', t ? -108 : 108); e.setAttribute('text-anchor', t ? 'end' : 'start'); });
  }
  function trangThai(t) { document.getElementById('tkTt').textContent = t; }

  var veCu = lkVe;
  lkVe = function () {
    veCu.apply(this, arguments);
    var v = lkMa();
    document.getElementById('tkMa').textContent = v || '—';
    document.getElementById('tkNhanSo').textContent = v || '—';
    document.getElementById('tkSo').textContent = v.length + ' / ' + MAX;
    document.getElementById('tkVach').style.width = (v.length / MAX * 100) + '%';
    if (!BB.dang) trangThai(v ? 'Đang khắc' : 'Chờ mã nhân viên');
    datNgam();
  };
  var luaCu = lkLua;
  lkLua = function (loi) {
    luaCu.apply(this, arguments);
    doc.classList.add('bat'); clearTimeout(doc.__h); doc.__h = setTimeout(function () { doc.classList.remove('bat'); }, 450);
  };
  var trungCu = bbTrung;
  bbTrung = function () { trangThai('Đã xác thực'); return trungCu.apply(this, arguments); };
  var truotCu = bbTruot;
  bbTruot = function () { trangThai('Sai mật khẩu'); return truotCu.apply(this, arguments); };
  var xepCu = bbXep;
  bbXep = function () { xepCu.apply(this, arguments); trangThai(lkMa() ? 'Đang khắc' : 'Chờ mã nhân viên'); };

  window.addEventListener('resize', function () { setTimeout(datNgam, 0); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(datNgam, 0); });
  /* mật khẩu: chỉ báo trạng thái, không bao giờ hiện số ký tự */
  document.getElementById('l_mk').addEventListener('input', function () { if (!BB.dang) trangThai(this.value && lkMa() ? 'Sẵn sàng đăng nhập' : (lkMa() ? 'Đang khắc' : 'Chờ mã nhân viên')); });
})();
