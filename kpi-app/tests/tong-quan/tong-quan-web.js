/* =====================================================================
   41. TỔNG QUAN CHỦ SỞ HỮU (08/11, chủ dự án: bỏ "chưa khai báo sản lượng" + "cá nhân dưới 80%", thêm thông tin cần xem hằng ngày)
   Chuyên gia quan-ly-van-hanh: một màn hình trả lời 5 câu mỗi sáng – phương án "Vừa", chủ dự án bỏ tỷ lệ lỗi (chưa có số liệu).
   1) 4 ô số: thành phẩm Đóng gói ngày làm gần nhất / mục tiêu (+ đường 14 ngày), giao đúng hạn 4 tuần, có mặt hôm nay, đơn trễ hạn
   2) Sản lượng từng xưởng ngày làm gần nhất so mục tiêu (theo dòng chảy)
   3) Đơn hàng: trễ hạn, đến hạn 7 ngày (ưu tiên), đơn vào / làm xong 7 ngày
   4) Nhân lực hôm nay theo xưởng + suất cơm
   5) Cần chú ý: nút cổ chai + độ tin cậy số liệu (% nhật ký đã duyệt) + chờ duyệt quá 2 ngày
   Chỉ tài khoản chủ sở hữu; ban điều hành / trưởng phòng giữ Tổng quan cũ. Đài quan sát (hologram) vẫn ở đầu trang.
   ===================================================================== */
var TQ_MAU = { xanh: 'var(--green)', vang: 'var(--amber)', do: 'var(--red)', xam: 'var(--ink3)' };
function tqSo(v, d) { return Number(v || 0).toLocaleString('vi-VN', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
function tqMuc(p, a, b) { return p == null ? 'xam' : p >= a ? 'xanh' : p >= b ? 'vang' : 'do'; }
function tqDuong(v, mt) {   // đường nhỏ 14 ngày (sparkline) + vạch mục tiêu
  if (!v || v.length < 2) return '';
  var w = 132, h = 30, mx = Math.max.apply(null, v.concat([mt || 0, 1])), x = function (i) { return (i / (v.length - 1) * (w - 4) + 2).toFixed(1); }, y = function (a) { return (h - 3 - a / mx * (h - 6)).toFixed(1); };
  return '<svg class="tq-duong" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + (mt ? '<line x1="0" x2="' + w + '" y1="' + y(mt) + '" y2="' + y(mt) + '" stroke="currentColor" stroke-dasharray="3 3" opacity=".45"/>' : '') +
    '<polyline fill="none" stroke="var(--accent,#38bdf8)" stroke-width="1.8" stroke-linejoin="round" points="' + v.map(function (a, i) { return x(i) + ',' + y(a); }).join(' ') + '"/>' +
    '<circle cx="' + x(v.length - 1) + '" cy="' + y(v[v.length - 1]) + '" r="2.6" fill="var(--accent,#38bdf8)"/></svg>';
}
function tqO(nhan, so, phu, muc, them, di) {
  return '<button type="button" class="tq-o ' + (muc || '') + '"' + (di ? ' onclick="' + di + '"' : '') + '><span class="l">' + nhan + '</span><span class="v">' + so + '</span><span class="s">' + (phu || '') + '</span>' + (them || '') + '</button>';
}
function tqThe(tieu, phu, than, di) {
  return '<section class="card tq-the"><div class="tq-dau"><h3>' + tieu + (phu ? '<span>' + phu + '</span>' : '') + '</h3>' + (di ? '<button class="btn sm" type="button" onclick="' + di[1] + '">' + di[0] + ' →</button>' : '') + '</div>' + than + '</section>';
}
function tqCo() { return typeof dhXG === 'function' && typeof DHDG !== 'undefined'; }
function tqNgayLam() { return (typeof holoNgayLamTruoc === 'function') ? holoNgayLamTruoc() : today(); }

function tqVe() {
  var hn = today(), d = new Date(hn + 'T00:00:00'), thu = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][d.getDay()];
  /* 08/11 (chủ dự án): gộp "Việc hôm nay" vào Tổng quan – số trước, việc sau */
  $('main').innerHTML = '<div class="ptitle">Tổng quan</div><div class="pdesc">' + thu + ' · ' + dmy(hn) + ' · nhìn nhanh mỗi sáng: làm ra bao nhiêu, đơn có kịp, đủ người không, việc gì cần xử lý. Bấm vào từng ô để xem chi tiết.</div>' +
    '<div id="tqKhoi"></div><div id="tqViec"></div><div id="tqKhoi2"></div><div id="tqTin"></div><div id="dpHN"></div><div id="tqDi"></div>';
  try { holoGanDai(); } catch (e) {}
  tqVeKhoi(); tqVeViec(); tqVeDi(); tqNap();
  try { dpNap(); } catch (e) {}
}
function tqNap() {
  if (!window.__qtDXTai) { window.__qtDXTai = 1; call('demDeXuatQuyTrinh', [], function (r) { window.__qtDX = r; tqVeViec(); }); }
  if (!window.__spMoiTai) { window.__spMoiTai = 1; call('demSanPhamMoi', [], function (r) { window.__spMoi = r; tqVeViec(); }); }
  var moi = function (k, ms) { var c = window[k]; return !c || Date.now() - (c.__t || 0) > ms; };
  if (!laChuNhat(today()) && moi('__tqSiSo', 300000)) call('siSoTatCaXuong', [today()], function (r) { if (r) r.__t = Date.now(); window.__tqSiSo = r; var e = document.getElementById('hlCM'); if (e) { e.innerHTML = holoCoMat(r); try { holoDemSo(e); } catch (x) {} } tqVeKhoi(); });
  if (moi('__tqCom', 600000)) call('xemTongHopCom', [today()], function (r) { r = r || { ok: false }; r.__t = Date.now(); window.__tqCom = r; tqVeKhoi(); });
  var dp = window.__dp; if (!dp || Date.now() - dp.t > 300000) call('layDieuPhoi', [false], function (r) { window.__dp = { t: Date.now(), r: r }; tqVeKhoi(); });
  if (typeof taiManh === 'function') taiManh('QuyTrinh', function (ok) {
    if (!ok || typeof dhVeLai !== 'function') { tqVeKhoi(); return; }
    if (!dhVeLai.__tq) { var g = dhVeLai; dhVeLai = function () { if (typeof tabHienTai !== 'undefined' && tabHienTai === 'dash') { tqVeKhoi(); return; } return g.apply(this, arguments); }; dhVeLai.__tq = 1; }
    if (!DH && !DHTai) dhTai(false);
    if (!DHDG) dhTaiDG();
    if (!DHTD) dhTaiTD();
    tqVeKhoi();
  });
}

function tqVeKhoi() {
  var el = document.getElementById('tqKhoi'); if (!el || tabHienTai !== 'dash') return;
  var hn = today(), cn = laChuNhat(hn), nl = tqNgayLam(), co = tqCo(), G = co ? dhXG() : null, coDH = co && DH && !DH.loi && DH.don, MT = coDH ? dhMucTieuXuong() : {};
  var cho = '<span class="tq-cho">đang tải…</span>', h = '';
  if (!document.getElementById('tqKhoi2')) return;
  /* ---- 1. bốn ô số ---- */
  var oDG, oOTD, oCM, oTre;
  if (G && G.xuong && G.xuong.DG) {
    var t1 = dhXuongTom('DG', [nl]), ng14 = dhNgayLamGanNhat(14, nl), v14 = dhXuongTom('DG', ng14).v, p1 = t1.mt ? t1.sl / t1.mt * 100 : null;
    oDG = tqO('Thành phẩm đóng gói ' + dmy(nl).slice(0, 5), tqSo(t1.sl) + ' <small>sp</small>', t1.mt ? 'mục tiêu ' + tqSo(t1.mt) + ' · <b>' + tqSo(p1) + '%</b>' : 'chưa có mục tiêu (đang đọc đơn)', tqMuc(p1, 95, 80), tqDuong(v14, t1.mt), "go('tk')");
  } else oDG = tqO('Thành phẩm đóng gói', '…', cho, '', '', '');
  if (co && DHTD && !DHTD.loi) {
    var C = dhChayLoc(DHTD.chay || null), kn = C && C.kenh ? Object.keys(C.kenh).reduce(function (a, k) { a[0] += C.kenh[k][0]; a[1] += C.kenh[k][1]; return a; }, [0, 0]) : [0, 0], p2 = kn[0] ? kn[1] / kn[0] * 100 : null;
    oOTD = tqO('Giao đúng hạn · 4 tuần', p2 == null ? '–' : tqSo(p2) + '%', kn[0] ? kn[1] + ' / ' + kn[0] + ' dòng đơn làm xong đúng hạn' : 'cần thêm vài ngày bản chụp đơn', tqMuc(p2, 95, 80), '', "go('dh')");
  } else oOTD = tqO('Giao đúng hạn · 4 tuần', '…', co && DHTD && DHTD.loi ? esc(DHTD.loi) : cho, '', '', '');
  var ss = window.__tqSiSo;
  if (cn) oCM = tqO('Có mặt hôm nay', '–', 'Chủ nhật – nghỉ', 'xam', '', '');
  else if (ss && ss.ok) {
    var T = 0, Dl = 0, chua = 0; (ss.xuong || []).forEach(function (x) { T += x.tong; Dl += x.diLam; if (!x.daDiemDanh) chua++; });
    var p3 = T ? Dl / T * 100 : null;
    oCM = tqO('Có mặt hôm nay', tqSo(Dl) + ' <small>/ ' + tqSo(T) + '</small>', (p3 == null ? '' : '<b>' + tqSo(p3) + '%</b> · ') + (T - Dl) + ' người nghỉ' + (chua ? ' · ' + chua + ' xưởng chưa điểm danh' : ''), chua ? 'vang' : tqMuc(p3, 90, 85), '', "go('dd')");
  } else oCM = tqO('Có mặt hôm nay', '…', cho, '', '', '');
  var hnD = co ? dhHomNay() : hn, sx = coDH ? DH.don.filter(function (o) { var l = (o.pl || {}).loai; return o.thieu > 0 && l !== 'PK' && l !== 'NOI'; }) : [];
  if (coDH) {
    var tre = sx.filter(function (o) { return o.dl && o.dl < hnD; }), spTre = tre.reduce(function (a, o) { return a + o.thieu; }, 0), tong = sx.reduce(function (a, o) { return a + o.thieu; }, 0), cs = dhCS().sp;
    oTre = tqO('Đơn trễ hạn', tqSo(tre.length) + ' <small>dòng</small>', tqSo(spTre) + ' sp trễ · tồn ~' + tqSo(cs ? tong / cs : 0, 1) + ' ngày làm (' + tqSo(tong) + ' sp còn thiếu)', tre.length ? 'do' : 'xanh', '', "go('dh')");
  } else oTre = tqO('Đơn trễ hạn', '…', co && DH && DH.loi ? esc(DH.loi) : cho, '', '', '');
  el.innerHTML = '<div class="tq-4">' + oDG + oOTD + oCM + oTre + '</div>';

  /* ---- 2. sản lượng từng xưởng ---- */
  if (G && G.thuTu) {
    var dat = 0, coMT = 0, rows = G.thuTu.map(function (X) {
      var x = G.xuong[X], t = dhXuongTom(X, [nl]), p = t.mt ? t.sl / t.mt * 100 : null, m = tqMuc(p, 95, 80); if (t.mt) { coMT++; if (p >= 95) dat++; }
      var w = p == null ? 0 : Math.min(100, p / 1.2);   // thang 0–120%
      return '<div class="tq-x"><span class="t">' + esc(String(x.ten || X).replace(/^Xưởng /, '')) + '</span><span class="b"><i class="' + m + '" style="width:' + w.toFixed(1) + '%"></i>' + (t.mt ? '<em style="left:' + (100 / 1.2).toFixed(1) + '%"></em>' : '') + '</span>' +
        '<span class="s"><b>' + tqSo(t.sl) + '</b> ' + (DH_XUONG_DV[X] || 'sp') + (t.mt ? ' <small>/ ' + tqSo(t.mt) + '</small>' : '') + '</span><span class="p ' + m + '">' + (p == null ? '–' : tqSo(p) + '%') + '</span></div>';
    }).join('');
    h += tqThe('Sản lượng từng xưởng · ' + dmy(nl), coMT ? 'đạt mục tiêu ' + dat + ' / ' + coMT + ' xưởng' : 'đang đọc mục tiêu…', '<div class="tq-xs">' + rows + '</div><div class="tq-ghi">Theo dòng chảy sản xuất. Số = sản lượng ở bước ra hàng (⭐) của xưởng; mục tiêu ngày theo nhu cầu đơn hàng. Vạch đứng = 100%. Xanh ≥ 95%, vàng 80–95%, đỏ &lt; 80%.</div>', ['Thống kê', "go('tk')"]);
  } else h += tqThe('Sản lượng từng xưởng', '', '<div class="tq-cho">Đang đọc nhật ký sản xuất…</div>');

  /* ---- 3. đơn hàng ---- */
  if (coDH) {
    var den7 = dhNgayCong(hnD, 7), tre2 = sx.filter(function (o) { return o.dl && o.dl < hnD; }), sap = sx.filter(function (o) { return o.dl && o.dl >= hnD && o.dl <= den7; }), ut = sap.filter(function (o) { return o.uuTien; });
    var sp = function (a) { return a.reduce(function (s, o) { return s + o.thieu; }, 0); };
    var o3 = '<div class="tq-don"><div class="' + (tre2.length ? 'do' : 'xanh') + '"><b>' + tre2.length + '</b> dòng trễ hạn<small>' + tqSo(sp(tre2)) + ' sp còn thiếu</small></div>' +
      '<div class="' + (sap.length ? 'vang' : 'xanh') + '"><b>' + sap.length + '</b> dòng đến hạn trong 7 ngày<small>' + tqSo(sp(sap)) + ' sp còn thiếu' + (ut.length ? ' · <b>' + ut.length + ' đơn ưu tiên</b>' : '') + '</small></div>';
    var C2 = DHTD && !DHTD.loi ? dhChayLoc(DHTD.chay || null) : null, n7 = C2 && C2.ngay ? C2.ngay.slice(-7) : [];
    if (n7.length) {
      var mx = Math.max.apply(null, n7.map(function (x) { return Math.max(x[1], x[2]); }).concat([1])), lien = 0, maxLien = 0;
      n7.forEach(function (x) { lien = x[1] > x[2] ? lien + 1 : 0; maxLien = Math.max(maxLien, lien); });
      var vao = n7.reduce(function (a, x) { return a + x[1]; }, 0), xong = n7.reduce(function (a, x) { return a + x[2]; }, 0);
      o3 += '<div class="' + (maxLien >= 3 ? 'vang' : '') + '"><b>' + tqSo(vao) + '</b> sp đơn mới · <b>' + tqSo(xong) + '</b> sp làm xong<small>7 ngày gần nhất' + (maxLien >= 3 ? ' · đơn vào nhiều hơn làm xong ' + maxLien + ' ngày liền – tồn đơn đang tăng' : '') + '</small>' +
        '<span class="tq-cot" aria-label="Đơn mới vào và làm xong 7 ngày">' + n7.map(function (x) { return '<span title="' + dmy(x[0]) + ': vào ' + tqSo(x[1]) + ', xong ' + tqSo(x[2]) + '"><i class="v" style="height:' + (x[1] / mx * 100).toFixed(0) + '%"></i><i class="x" style="height:' + (x[2] / mx * 100).toFixed(0) + '%"></i><em>' + x[0].slice(8) + '</em></span>'; }).join('') + '</span>' +
        '<span class="tq-lg"><i class="v"></i>vào <i class="x"></i>xong</span></div>';
    }
    o3 += '</div>';
    h += tqThe('Đơn hàng', 'đọc lúc ' + esc(DH.luc || ''), o3, ['Đơn hàng', "go('dh')"]);
  } else h += tqThe('Đơn hàng', '', '<div class="tq-cho">' + (co && DH && DH.loi ? esc(DH.loi) : 'Đang đọc Sheet đơn hàng…') + '</div>');

  /* ---- 4. nhân lực hôm nay ---- */
  var com = window.__tqCom, comS = com && com.ok && com.tongHop ? '<b>' + tqSo(com.tongHop.an) + '</b> suất cơm hôm nay' : (com && !com.ok ? 'chưa có số cơm hôm nay' : '');
  if (cn) h += tqThe('Nhân lực hôm nay', '', '<div class="tq-cho">Chủ nhật – không điểm danh.</div>');
  else if (ss && ss.ok) {
    var TT = 0, DD = 0, xs = (ss.xuong || []).slice();
    var r4 = xs.map(function (x) { TT += x.tong; DD += x.diLam; var p = x.tong ? x.diLam / x.tong * 100 : 0, m = !x.daDiemDanh ? 'xam' : tqMuc(p, 90, 85);
      return '<div class="tq-x"><span class="t">' + esc(String(x.TenXuong).replace(/^Xưởng /, '')) + '</span><span class="b"><i class="' + m + '" style="width:' + p.toFixed(1) + '%"></i></span><span class="s"><b>' + x.diLam + '</b> <small>/ ' + x.tong + '</small></span><span class="p ' + m + '">' + (x.daDiemDanh ? (x.nghi ? x.nghi + ' nghỉ' : 'đủ') : 'chưa điểm danh') + '</span></div>'; }).join('');
    h += tqThe('Nhân lực hôm nay', DD + ' / ' + TT + ' người đi làm' + (comS ? ' · ' + comS : ''), '<div class="tq-xs">' + r4 + '<div class="tq-x tong"><span class="t">Tổng</span><span class="b"><i class="' + tqMuc(TT ? DD / TT * 100 : 0, 90, 85) + '" style="width:' + (TT ? DD / TT * 100 : 0).toFixed(1) + '%"></i></span><span class="s"><b>' + DD + '</b> <small>/ ' + TT + '</small></span><span class="p">' + (TT - DD) + ' nghỉ</span></div></div>' +
      '<div class="tq-ghi">Theo điểm danh nghỉ của trưởng phòng: nghỉ cả ngày = vắng, nửa ngày / đi muộn vẫn tính đi làm. Xanh ≥ 90%, vàng 85–90%, đỏ &lt; 85%, xám = xưởng chưa điểm danh.</div>', ['Điểm danh', "go('dd')"]);
  } else h += tqThe('Nhân lực hôm nay', comS, '<div class="tq-cho">' + (ss && !ss.ok ? 'Chưa có dữ liệu điểm danh.' : 'Đang đọc điểm danh…') + '</div>');

  /* ---- 5. độ tin cậy số liệu (nút cổ chai, dòng chảy, sức khỏe dữ liệu: ở khối Điều phối ngay dưới) ---- */
  var daD = 0, choD = 0; (D.nhatky || []).forEach(function (r) { if (ngay(r.Ngay) !== nl) return; if (/chờ/i.test(String(r.TrangThai || ''))) choD++; else daD++; });
  (D.choDuyet || []).forEach(function (r) { if (ngay(r.Ngay) === nl && (D.nhatky || []).indexOf(r) < 0) choD++; });
  var tc = daD + choD, pt = tc ? daD / tc * 100 : null, eT = document.getElementById('tqTin');
  if (eT) eT.innerHTML = '<div class="tq-tin"><span class="tq-chip ' + (pt == null ? 'xam' : tqMuc(pt, 90, 75)) + '">Độ tin cậy số liệu</span> nhật ký ' + dmy(nl).slice(0, 5) + ': ' + (tc ? '<b>' + tqSo(pt) + '%</b> đã duyệt (' + daD + ' / ' + tc + ' dòng)' + (choD ? ' – ' + choD + ' dòng chờ duyệt có thể còn đổi số' : '') : 'chưa có dòng nào') + '</div>';
  var e2 = document.getElementById('tqKhoi2'); if (e2) e2.innerHTML = h;
}

function tqViecDs() {   // việc của Việc hôm nay, bỏ "chưa nhập sản lượng" (chủ dự án 08/11: bỏ thông báo chưa khai báo sản lượng)
  var v = []; try { v = viecHomNay(); } catch (e) {}
  return v.filter(function (x) { return !/chưa nhập sản lượng|chưa khai báo sản lượng/i.test(String(x.t || '')); });
}
function tqVeViec() {
  var el = document.getElementById('tqViec'); if (!el || tabHienTai !== 'dash') return;
  var v = tqViecDs();
  var gap = v.filter(function (x) { return x.muc === 'do' || x.muc === 'vang'; }).length, h = '<div class="hn-h">Việc cần xử lý' + (gap ? ' · <b style="color:var(--red)">' + gap + ' việc gấp</b>' : '') + '</div>';
  if (!v.length) h += '<div class="hn-xong"><div class="lt-o" data-lt="da-duyet-het" aria-hidden="true"></div><div><b>Mọi việc đã xong</b><span style="color:var(--ink2);font-size:13px">Không có sản lượng chờ duyệt, điểm danh đã xác nhận.</span></div></div>';
  else h += '<div class="hn-ds">' + v.map(function (x) {
    var nut = x.fn ? ('<button class="btn' + (x.muc === 'do' || x.muc === 'vang' ? ' pri' : '') + '" onclick="' + x.fn + '">' + esc(x.nut) + '</button>')
      : ('<button class="btn' + (x.muc === 'do' || x.muc === 'vang' ? ' pri' : '') + '" onclick="go(\'' + x.k + '\')">' + esc(x.nut) + ' →</button>');
    var soH = esc(x.so);
    if (x.han) soH = '<span class="hn-soc"><svg class="hn-vong" viewBox="0 0 62 62" data-bd="' + x.han[0] + '" data-kt="' + x.han[1] + '"><circle class="nen" cx="31" cy="31" r="28"/><circle class="chay" cx="31" cy="31" r="28" stroke-dasharray="175.9" stroke-dashoffset="175.9"/></svg>' + soH + '</span>';
    return '<div class="hn-viec ' + (x.muc || '') + '"><div class="hn-so">' + soH + '<small>' + esc(x.nho || '') + '</small>' + (x.han ? '<span class="hn-han" data-han="' + x.han[1] + '"></span>' : '') + '</div>' +
      '<div><div class="hn-t">' + esc(x.t) + '</div><div class="hn-m">' + x.m + '</div></div>' + nut + '</div>';
  }).join('') + '</div>';
  try { h += maiBang(); } catch (e) {}
  el.innerHTML = h;
  try { capNhatVongHan(); } catch (e) {}
}
function tqVeDi() {
  var el = document.getElementById('tqDi'); if (!el) return;
  var co = {}; dsTabHienCo().forEach(function (t) { co[t[0]] = t[1]; });
  var lt = ['dh', 'tk', 'qt', 'kpi', 'nk', 'dx', 'ns', 'cd'].filter(function (k) { return co[k]; });
  el.innerHTML = '<div class="hn-h">Đi nhanh</div><div class="hn-luoi">' + lt.map(function (k) { return '<button class="hn-lt" onclick="go(\'' + k + '\')">' + svgIcon(k) + esc(co[k]) + '</button>'; }).join('') + '</div>';
}
setInterval(function () { if (typeof tabHienTai !== 'undefined' && tabHienTai === 'dash' && document.getElementById('tqViec')) try { capNhatVongHan(); } catch (e) {} }, 60000);
/* chủ sở hữu: 1 tab "Tổng quan" thay cho "Việc hôm nay" + "Tổng quan" (menu, thanh dưới điện thoại, số việc gấp, mọi lệnh go('homnay')) */
(function () {
  var laChu = function () { return typeof ME !== 'undefined' && ME && ME.laOwner; };
  var gDs = window.dsTabHienCo; window.dsTabHienCo = function () { var a = gDs.apply(this, arguments); return laChu() ? a.filter(function (t) { return t[0] !== 'homnay'; }) : a; };
  var gGo = window.go; window.go = function (k) { if (k === 'homnay' && laChu()) { arguments[0] = 'dash'; } return gGo.apply(this, arguments); };
  var gBn = window.buildNav; window.buildNav = function () { BOTBAR.ADMIN = laChu() ? ['dash', 'nk', 'kpi', 'dx'] : ['homnay', 'nk', 'kpi', 'dx']; return gBn.apply(this, arguments); };
  var gDv = window.demViec; window.demViec = function () { var o = gDv.apply(this, arguments); if (laChu()) { var n = 0; try { n = tqViecDs().filter(function (v) { return v.muc === 'do' || v.muc === 'vang'; }).length; } catch (e) {} o.dash = n; delete o.homnay; } return o; };
  var gCd = window.capNhatDem; window.capNhatDem = function () { var r = gCd.apply(this, arguments); if (laChu()) Array.prototype.forEach.call(document.querySelectorAll('#nav button[data-k="dash"] .dem,#botbar button[data-k="dash"] .dem'), function (d) { d.classList.add('do'); }); return r; };
  var gVh = window.vHomNay; window.vHomNay = function () { if (laChu()) { if (tabHienTai === 'dash') tqVeViec(); return; } return gVh.apply(this, arguments); };
})();
(function () {
  var g = window.vDash;
  window.vDash = function () { if (typeof ME !== 'undefined' && ME && ME.laOwner) return tqVe(); return g.apply(this, arguments); };
  var st = document.createElement('style'); st.id = 'tqCss';
  st.textContent =
    '.tq-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:0 0 16px}' +
    '.tq-o{display:flex;flex-direction:column;gap:4px;text-align:left;border:1px solid var(--line);border-left:4px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--panel);color:var(--ink);font-family:inherit;cursor:pointer;min-width:0}' +
    '.tq-o:hover{border-color:var(--accent,#38bdf8)}.tq-o:focus-visible{outline:2px solid var(--accent,#38bdf8);outline-offset:2px}' +
    '.tq-o .l{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3)}.tq-o .v{font:700 26px/1.15 var(--mono,monospace)}.tq-o .v small{font-size:13px;color:var(--ink3);font-weight:500}' +
    '.tq-o .s{font-size:12.5px;color:var(--ink2)}.tq-o.xanh{border-left-color:var(--green)}.tq-o.vang{border-left-color:var(--amber)}.tq-o.do{border-left-color:var(--red)}.tq-o.do .v{color:var(--red)}' +
    '.tq-duong{width:100%;max-width:160px;height:30px;color:var(--ink3);margin-top:2px}' +
    '.tq-the .tq-dau{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}.tq-the .tq-dau h3{margin:0}' +
    '.tq-xs{display:grid;gap:6px}.tq-x{display:grid;grid-template-columns:minmax(90px,150px) minmax(60px,1fr) minmax(90px,auto) minmax(74px,auto);gap:10px;align-items:center;font-size:13px}' +
    '.tq-x .b{position:relative;height:10px;border-radius:6px;background:var(--panel2);overflow:visible}.tq-x .b i{display:block;height:100%;border-radius:6px;background:var(--ink3)}' +
    '.tq-x .b em{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink2);opacity:.6}' +
    '.tq-x i.xanh{background:var(--green)}.tq-x i.vang{background:var(--amber)}.tq-x i.do{background:var(--red)}.tq-x i.xam{background:var(--ink3)}' +
    '.tq-x .s{text-align:right;white-space:nowrap}.tq-x .s small{color:var(--ink3)}.tq-x .p{text-align:right;font-weight:600;font-size:12.5px;white-space:nowrap}' +
    '.tq-x .p.xanh{color:var(--green)}.tq-x .p.vang{color:var(--amber)}.tq-x .p.do{color:var(--red)}.tq-x .p.xam{color:var(--ink3)}.tq-x.tong{border-top:1px solid var(--line);padding-top:6px;font-weight:600}' +
    '.tq-ghi{font-size:12px;color:var(--ink3);margin-top:8px}.tq-cho{font-size:13px;color:var(--ink3);padding:6px 0}' +
    '.tq-don{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;align-items:start}.tq-don>div{border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:13px;display:flex;flex-direction:column;gap:3px;min-width:0}' +
    '.tq-don>div>b{font:700 22px var(--mono,monospace)}.tq-don small{color:var(--ink3);font-size:12px}.tq-don .do{border-color:var(--red)}.tq-don .do>b{color:var(--red)}.tq-don .vang{border-color:var(--amber)}' +
    '.tq-cot{display:flex;align-items:flex-end;gap:6px;height:70px;margin-top:6px}.tq-cot>span{flex:1;display:flex;align-items:flex-end;gap:2px;height:56px;position:relative}' +
    '.tq-cot i{flex:1;border-radius:3px 3px 0 0;min-height:2px}.tq-cot i.v,.tq-lg i.v{background:#2f7fb0}.tq-cot i.x,.tq-lg i.x{background:var(--green)}' +
    '.tq-cot em{position:absolute;bottom:-15px;left:0;right:0;text-align:center;font:500 10px var(--mono,monospace);color:var(--ink3);font-style:normal}' +
    '.tq-lg{font-size:11.5px;color:var(--ink3);margin-top:16px}.tq-lg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin:0 4px 0 8px;vertical-align:-1px}' +
    '.tq-tin{font-size:13.5px;margin:14px 0 4px}#tqKhoi2 .tq-the:first-child{margin-top:16px}' +
    '.tq-chip{display:inline-block;font-size:11.5px;font-weight:600;padding:1px 8px;border-radius:20px;margin-right:4px;border:1px solid currentColor}' +
    '.tq-chip.xanh{color:var(--green)}.tq-chip.vang{color:var(--amber)}.tq-chip.do{color:var(--red)}.tq-chip.xam{color:var(--ink3)}' +
    '@media (max-width:560px){.tq-x{grid-template-columns:minmax(0,1fr) auto auto;gap:4px 8px}.tq-x .b{grid-column:1/-1;grid-row:2}.tq-4{grid-template-columns:1fr 1fr}.tq-o .v{font-size:21px}.tq-duong{max-width:100%}}' +
    '@media (max-width:380px){.tq-4{grid-template-columns:1fr}}';
  document.head.appendChild(st);
})();
