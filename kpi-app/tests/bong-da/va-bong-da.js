/* ===== Dải thông báo GIẢI BÓNG ĐÁ (13/10) – máy chủ: layBongDa (tests/bong-da.gs) =====
   Chỉ hiện khi có trận trong 2 ngày tới hoặc vừa có kết quả (hôm nay / hôm qua). Bấm × thì ẩn tới trận sau. */
var BD = { d: null, gio: function () { return new Date(); } };   // gio: giờ hiện tại (bài kiểm tra thay được)
var BD_THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function bdNgay_(d) { var p = function (x) { return ('0' + x).slice(-2); }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function bdTai() {
  if (typeof TOKEN === 'undefined' || !TOKEN) return;
  try {
    google.script.run.withSuccessHandler(function (r) { if (r && r.ok) { BD.d = r; bdVe(); } })
      .withFailureHandler(function () {}).layBongDa(TOKEN);
  } catch (e) {}
}
/* Chọn nội dung: kết quả trận vừa đá (hôm nay / hôm qua) hoặc trận sắp tới trong 2 ngày */
function bdChon(d, bayGio) {
  var hn = bdNgay_(bayGio), hq = bdNgay_(new Date(bayGio.getTime() - 864e5)), toi = bdNgay_(new Date(bayGio.getTime() + 2 * 864e5));
  var ds = d.tran || [], kq = ds.filter(function (t) { return t.xong && t.gio.slice(0, 10) >= hq && t.gio.slice(0, 10) <= hn; });
  var sap = ds.filter(function (t) { return !t.xong && t.gio.slice(0, 10) >= hn && t.gio.slice(0, 10) <= toi; });
  return { kq: kq, sap: sap, khoa: (sap[0] || kq[kq.length - 1] || {}).gio || '' };
}
function bdTatKhoa() { try { return localStorage.getItem('kpi_bd_tat') || ''; } catch (e) { return ''; } }
function bdVe() {
  var el = $('bdbar'), d = BD.d; if (!el) return;
  if (!d) { el.className = 'hide'; return; }
  var bay = BD.gio(), c = bdChon(d, bay);
  if (!c.khoa || bdTatKhoa() === c.khoa) { el.className = 'hide'; el.innerHTML = ''; return; }
  var hn = bdNgay_(bay), mai = bdNgay_(new Date(bay.getTime() + 864e5));
  var khi = function (g) { var ng = g.slice(0, 10), gio = g.slice(11); if (ng === hn) return 'Hôm nay ' + gio; if (ng === mai) return 'Ngày mai ' + gio;
    var x = new Date(ng + 'T00:00:00'); return BD_THU[x.getDay()] + ' ' + ng.slice(8) + '/' + ng.slice(5, 7) + ', ' + gio; };
  var vong = function (t) { return /khai mạc/i.test(t.vong) ? ' <span class="bd-giai" style="display:inline">(khai mạc)</span>' : ''; };
  var dong = [];
  c.kq.forEach(function (t) { dong.push('Kết quả: <b>' + esc(t.a) + '</b> <span class="bd-ts">' + t.tsA + ' – ' + t.tsB + '</span> <b>' + esc(t.b) + '</b>'); });
  c.sap.slice(0, 2).forEach(function (t) { dong.push(esc(khi(t.gio)) + ': <b>' + esc(t.a) + '</b> gặp <b>' + esc(t.b) + '</b>' + vong(t)); });
  var coHomNay = c.sap.some(function (t) { return t.gio.slice(0, 10) === hn; });
  el.innerHTML = '<span class="bd-ico" aria-hidden="true">⚽</span><div class="bd-nd"><span class="bd-giai">' + esc(d.ten) + '</span>' + dong.join(' · ') +
    (coHomNay ? ' – cùng ra sân cổ vũ nhé!' : '') + '</div>' +
    (d.link ? '<a href="' + esc(d.link) + '" target="_blank" rel="noopener">Xem lịch &amp; video ›</a>' : '') +
    '<button type="button" class="bd-x" aria-label="Ẩn thông báo bóng đá tới trận sau" title="Ẩn tới trận sau" onclick="bdTat()">×</button>';
  el.className = '';
}
function bdTat() { var c = BD.d && bdChon(BD.d, BD.gio()); try { localStorage.setItem('kpi_bd_tat', c ? c.khoa : ''); } catch (e) {} bdVe(); }
