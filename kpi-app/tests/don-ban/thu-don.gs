/* ===== 17/11 khuya (chủ dự án): BÁN HÀNG "THỬ TRƯỚC KHI ĐẶT" + GỬI ĐỀ NGHỊ ƯU TIÊN =====
   - Thử nhận đơn mới: chọn kênh + số lượng (+ deadline mong muốn) -> đơn vào đúng làn của kênh (5 làn như bảng đơn):
       • Xong khoảng … nếu nhận với deadline đó (xếp theo deadline trong làn, ĐÃ CỘNG 2 ngày làm như mọi ngày dự kiến Bán hàng thấy);
       • Hẹn khách an toàn = xếp CUỐI làn xong khoảng … + 6 ngày làm (giống "Thử nhận đơn" của người duyệt, DH_HEN_DU);
       • màu: đỏ = deadline sớm hơn cả ngày xong khi xếp cuối làn; vàng = chỉ ăn vào 6 ngày dự phòng (dhSoHen trên web);
       • số đơn khác đang kịp mà thành trễ nếu nhận đơn này với deadline đó.
   - Thử đẩy một đơn lên ưu tiên (mã đơn hoặc tên hàng, như dhUTinh): đơn được đẩy lên ĐẦU LÀN của nó -> sớm bao nhiêu ngày,
     ĐỦ DANH SÁCH đơn khác bị lùi (mã đơn, kênh, deadline, số ngày lùi, thành trễ hạn) – chủ dự án chốt cho Bán hàng thấy đủ.
   - Gửi đề nghị ưu tiên (CHỈ Bán hàng, chỉ theo MÃ ĐƠN): lý do bắt buộc, máy chủ TỰ TÍNH LẠI kết quả thử lúc gửi (không tin số web gửi lên),
     mỗi mã đơn chỉ 1 đề nghị đang chờ, đơn đã ★ thì không cần gửi. Lưu ở tab DeNghiUu của Sheet "CSDL Đơn hàng (web)".
     Người duyệt (C019 / C056 / C067 + chủ sở hữu) thấy ở Việc hôm nay + trang Đơn bán hàng: Đồng ý (= gắn ★ ưu tiên cả đơn,
     cùng chỗ với nút ★ trên bảng đơn) / Không đồng ý (lý do bắt buộc). Bán hàng thấy trạng thái đề nghị của mình. Kiểm thử: tests/thu-don.js */
DHH_COT.DeNghiUu = ['Id', 'Luc', 'MaDon', 'Tabs', 'LyDo', 'NguoiTao', 'Tk', 'MaNV', 'TrangThai', 'KetQua', 'NguoiXuLy', 'TkXuLy', 'LucXuLy', 'LyDoXuLy', 'Lenh', 'NgayCan'];   // NgayCan = khách cần trước ngày (không bắt buộc)
var DBT_LAN_TEN = ['', 'Lẻ + POD', 'Dealer', 'Kho', 'OEM', 'A Đông'], DBT_GIO_MAX = 60, DBT_LUI_MAX = 400, DBT_DN_WEB = 40;
function dbtLan_(tab) { var t = String(tab || '').toUpperCase().trim(); if (DBK_TAB_BAC1[t] || /^POD/.test(t)) return 1; if (t === 'DEALER') return 2; if (t === 'OEM') return 4; if (t === 'A ĐÔNG') return 5; return 3; }
/* nhóm đơn đang làm như dbkMoPhong_ (còn thiếu, không phụ kiện / hàng nối, không tạm dừng): 'mã|tab' -> { ma, tab, dl, ten:{} } */
function dbtNhom_(G) {
  var m = {};
  G.don.forEach(function(o) { var l = (o.pl || {}).loai; if (!(o.thieu > 0) || l === 'PK' || l === 'NOI' || o.dung) return;
    var ma = o.maDon || '(không mã)', k = ma + '|' + (o.tab || ''), g = m[k] || (m[k] = { ma: ma, tab: o.tab, dl: '', ten: {}, uu: !!o.uuWeb });
    if (o.dl && (!g.dl || o.dl < g.dl)) g.dl = o.dl; var t = dbkTC_(o.ten); if (t && !g.ten[t]) g.ten[t] = o.ten; if (!o.uuWeb) g.uu = false; });
  return m;
}
/* mã đơn (khớp đủ) hoặc tên hàng (khớp đủ, hoặc khớp 1 phần nhưng chỉ 1 tên) – như dhUTinh trên web */
function dbtKhop_(N, gt) {
  var k = dbkTC_(gt); if (!k) return { loi: 'Nhập mã đơn hoặc tên hàng cần thử ưu tiên.' };
  var ut = {}, keys = Object.keys(N);
  keys.forEach(function(x) { if (dbkTC_(N[x].ma) === k && N[x].ma !== '(không mã)') ut[x] = 1; });
  if (Object.keys(ut).length) return { loai: 'ma', nhan: N[Object.keys(ut)[0]].ma, ut: ut };
  var goc = {}; keys.forEach(function(x) { Object.keys(N[x].ten).forEach(function(t) { if (!goc[t]) goc[t] = N[x].ten[t]; }); });
  var ten = goc[k] ? k : '';
  if (!ten) { var khop = Object.keys(goc).filter(function(t) { return t.indexOf(k) >= 0; });
    if (khop.length === 1) ten = khop[0];
    else if (khop.length > 1) return { loi: 'Có ' + khop.length + ' tên hàng cùng khớp: ' + khop.slice(0, 3).map(function(t) { return goc[t]; }).join(' · ') + '… Gõ cụ thể hơn.' }; }
  if (!ten) return { loi: 'Không tìm thấy đơn / tên hàng "' + String(gt).slice(0, 60) + '" trong các đơn đang làm.' };
  keys.forEach(function(x) { if (N[x].ten[ten]) ut[x] = 1; });
  return { loai: 'ten', nhan: goc[ten], ut: ut };
}
function dbtGioOk_(tk) {   // thử là việc nặng (2 lần mô phỏng): tối đa 60 lần / giờ / người
  var c = CacheService.getScriptCache(), k = 'DBT_' + tk, n = Number(c.get(k) || 0);
  if (n >= DBT_GIO_MAX) return false; c.put(k, String(n + 1), 3600); return true;
}
function dbtNen_() { var d = dhDocDon_(false), cs = dhCongSuat_(), G = dbkGiau_(d); return { d: d, cs: cs, G: G, N: dbtNhom_(G), R0: dbkMoPhong_(G, null, cs) }; }
/* thử đẩy: so ngày xong cũ / mới của từng đơn (như dhUTinh + bảng kết quả trên web) */
function dbtDay_(B, khop) {
  var R1 = dbkMoPhong_(B.G, null, B.cs, khop.ut), duoc = [], lui = [], theo = {}, tong = { n: 0, tong: 0, max: 0, moiTre: 0 }, kenh = {};
  dbKenh_().forEach(function(z) { kenh[z[0]] = z[1]; });
  Object.keys(R1.m).forEach(function(k) {
    var a = B.R0.m[k], g = R1.m[k], n = B.N[k] || {}; if (!a) return;
    var coA = a.eta && a.eta < '9999', coG = g.eta && g.eta < '9999';
    if (khop.ut[k]) { if (coG) duoc.push({ ma: g.ma, tab: g.tab, kenh: kenh[g.tab] || g.tab, cu: coA ? R1.cong2(a.eta) : '', moi: R1.cong2(g.eta), som: coA ? dbkCach_(g.eta, a.eta) : 0, dl: n.dl || '', kip: !n.dl || g.eta <= n.dl ? 1 : 0 }); return; }
    if (!coA || !coG) return;
    var d = dbkCach_(a.eta, g.eta); if (d <= 0) return;
    var tre = n.dl && a.eta <= n.dl && g.eta > n.dl ? 1 : 0;
    lui.push({ ma: g.ma, tab: g.tab, kenh: kenh[g.tab] || g.tab, dl: n.dl || '', d: d, tre: tre });
    var t = theo[g.tab] || (theo[g.tab] = { tab: g.tab, kenh: kenh[g.tab] || g.tab, n: 0, tong: 0, max: 0, moiTre: 0 });
    [t, tong].forEach(function(z) { z.n++; z.tong += d; if (d > z.max) z.max = d; z.moiTre += tre; });
  });
  lui.sort(function(a, b) { return (b.tre - a.tre) || (b.d - a.d) || String(a.ma).localeCompare(String(b.ma)); });
  var het = function(R) { var e = ''; Object.keys(R.m).forEach(function(k) { var x = R.m[k].eta; if (x && x < '9999' && x > e) e = x; }); return e; };
  var e0 = het(B.R0), e1 = het(R1);
  return { duoc: duoc, lui: lui.slice(0, DBT_LUI_MAX), nLui: lui.length, theo: Object.keys(theo).map(function(t) { return theo[t]; }).sort(function(a, b) { return b.tong - a.tong; }), tong: tong,
    hetCu: e0 ? R1.cong2(e0) : '', hetMoi: e1 ? R1.cong2(e1) : '' };
}
function dbtTomTat_(kq) { var s = kq.duoc.map(function(x) { return x.som; }); return { som: s.length ? Math.max.apply(null, s) : 0, moi: (kq.duoc[0] || {}).moi || '', nLui: kq.tong.n, tongLui: kq.tong.tong, maxLui: kq.tong.max, moiTre: kq.tong.moiTre }; }
/* Bán hàng / người duyệt: p = { loai: 'NHAN', tab, sl, dl } | { loai: 'DAY', gt } */
function thuDonBH(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  p = p || {}; var loai = String(p.loai || '');
  if (loai !== 'NHAN' && loai !== 'DAY') return sach_({ ok: false, msg: 'Thao tác không hợp lệ.' });
  if (!dbtGioOk_(String(q.me.tk || ''))) return sach_({ ok: false, msg: 'Bạn đã thử nhiều lần trong 1 giờ – nghỉ ít phút rồi thử lại.' });
  var B; try { B = dbtNen_(); } catch (e) { return sach_({ ok: false, msg: 'Chưa đọc được bảng đơn – thử lại sau ít phút.' }); }
  if (loai === 'NHAN') {
    var tab = String(p.tab || '').trim(), kenh = dbKenh_().filter(function(z) { return z[0] === tab; })[0];
    if (!kenh) return sach_({ ok: false, msg: 'Chọn kênh.' });
    var sl = dbSo_(p.sl); if (!(sl >= 1 && sl <= DB_SL_MAX && Math.floor(sl) === sl)) return sach_({ ok: false, msg: 'Số lượng phải là số nguyên từ 1 đến ' + DB_SL_MAX + '.' });
    var dl = String(p.dl || '').trim(), hn = homNayVN_();
    if (dl && (!dhNgayThat_(dl) || dl < hn)) return sach_({ ok: false, msg: 'Deadline không hợp lệ (phải từ hôm nay trở đi).' });
    var ma = '(thử) đơn mới', k = ma + '|' + tab;
    var R1 = dbkMoPhong_(B.G, { ma: ma, tab: tab, thieu: sl, dl: '', bac: 2 }, B.cs), cuoi = (R1.m[k] || {}).eta || '';
    if (!cuoi || cuoi >= '9999') return sach_({ ok: false, msg: 'Chưa tính được – thử lại sau.' });
    var out = { ok: true, loai: 'NHAN', tab: tab, kenh: kenh[1], lan: DBT_LAN_TEN[dbtLan_(tab)], sl: sl, dl: dl, cuoi: cuoi, hen: R1.congN(cuoi, DBK_DU_KIN), du: DBK_DU_KIN, cs: B.cs.sp };
    if (dl) {
      var R2 = dbkMoPhong_(B.G, { ma: ma, tab: tab, thieu: sl, dl: dl, bac: 2 }, B.cs), e2 = (R2.m[k] || {}).eta || '', biTre = 0;
      Object.keys(R2.m).forEach(function(x) { if (x === k) return; var a = B.R0.m[x], g = R2.m[x], n = B.N[x] || {}; if (a && n.dl && a.eta && a.eta <= n.dl && g.eta > n.dl) biTre++; });
      out.xong = e2 && e2 < '9999' ? R2.cong2(e2) : ''; out.kip = out.xong && out.xong <= dl ? 1 : 0; out.biTre = biTre;
      out.mau = dl >= out.hen ? '' : (dl < cuoi ? 'do' : 'vang');   // như dhSoHen trên trang Đơn hàng
    }
    return sach_(out);
  }
  var khop = dbtKhop_(B.N, p.gt); if (khop.loi) return sach_({ ok: false, msg: khop.loi });
  var kq = dbtDay_(B, khop);
  if (!kq.duoc.length) return sach_({ ok: false, msg: 'Đơn này chưa xếp lịch được (trễ quá 30 ngày chưa có hạn mới) – báo ban điều hành đặt hạn mới.' });
  var keys = Object.keys(khop.ut), daUu = keys.every(function(x) { return B.N[x] && B.N[x].uu; }), cho = null;
  if (khop.loai === 'ma') { try { var ss = dhhSS_(false); if (ss) cho = dhhDoc_(ss, 'DeNghiUu').filter(function(r) { return r.TrangThai === 'CHO' && r.MaDon === khop.nhan; }).map(function(r) { return { ai: r.NguoiTao, luc: r.Luc }; })[0] || null; } catch (e) {} }
  kq.ok = true; kq.loai = 'DAY'; kq.kieu = khop.loai; kq.nhan = khop.nhan; kq.daUu = daUu ? 1 : 0; kq.cho = cho;
  kq.guiDuoc = q.bh && khop.loai === 'ma' && !daUu && !cho ? 1 : 0;
  return sach_(kq);
}
/* Bán hàng gửi đề nghị ưu tiên: p = { gt: mã đơn, lyDo, can (khách cần trước ngày, không bắt buộc), daXem: 1 (đã xem các đơn bị lùi – góp ý quan-ly-van-hanh), lenh } */
function guiDeNghiUu(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  if (!q.bh) return sach_({ ok: false, msg: 'Người duyệt gắn ★ ưu tiên ngay trên bảng đơn, không cần gửi đề nghị.' });
  p = p || {}; var ly = dhhLy_(p.lyDo); if (ly.loi) return sach_({ ok: false, msg: ly.loi });
  if (!p.daXem) return sach_({ ok: false, msg: 'Xem danh sách đơn bị lùi rồi tick "Tôi đã xem các đơn bị lùi" trước khi gửi.' });
  var can = String(p.can || '').trim(); if (can && (!dhNgayThat_(can) || can < homNayVN_())) return sach_({ ok: false, msg: 'Ngày khách cần không hợp lệ.' });
  var lenh = dhhLenh_(p), cache = CacheService.getScriptCache();
  if (lenh) { try { var c0 = cache.get('DBT_L_' + lenh); if (c0) return sach_(JSON.parse(c0)); } catch (e) {} }
  var B; try { B = dbtNen_(); } catch (e) { return sach_({ ok: false, msg: 'Chưa đọc được bảng đơn – thử lại sau ít phút.' }); }
  var khop = dbtKhop_(B.N, p.gt); if (khop.loi) return sach_({ ok: false, msg: khop.loi });
  if (khop.loai !== 'ma') return sach_({ ok: false, msg: 'Đề nghị ưu tiên gửi theo MÃ ĐƠN – gõ đúng mã đơn rồi bấm Tính lại.' });
  var keys = Object.keys(khop.ut);
  if (keys.every(function(x) { return B.N[x].uu; })) return sach_({ ok: false, msg: 'Đơn ' + khop.nhan + ' đã được ★ ưu tiên rồi.' });
  var kq = dbtDay_(B, khop), tt = dbtTomTat_(kq), l;
  try { l = dbKhoa_(); } catch (e) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    if (lenh) { try { var c1 = cache.get('DBT_L_' + lenh); if (c1) return sach_(JSON.parse(c1)); } catch (e) {} }
    var ss = dhhSS_(true), tk = String(q.me.tk || '');
    if (!dbRate_(ss, tk)) return sach_({ ok: false, msg: 'Bạn thao tác quá nhiều trong 1 giờ – thử lại sau.' });
    var cu = dhhDoc_(ss, 'DeNghiUu').filter(function(r) { return r.TrangThai === 'CHO' && r.MaDon === khop.nhan; })[0];
    if (cu) return sach_({ ok: false, msg: 'Đơn ' + khop.nhan + ' đã có đề nghị ưu tiên đang chờ (' + cu.NguoiTao + ', ' + cu.Luc.slice(0, 16) + ').' });
    var id = 'U' + Utilities.getUuid().replace(/-/g, '').slice(0, 12).toLowerCase();
    var tabs = keys.map(function(x) { return B.N[x].tab; });
    dhhThem_(ss, 'DeNghiUu', [{ Id: id, Luc: dhhGio_(), MaDon: khop.nhan, Tabs: tabs.join(','), LyDo: ly.s, NguoiTao: String(q.me.ten || tk).slice(0, 60), Tk: tk, MaNV: String(q.me.maNV || ''), TrangThai: 'CHO', KetQua: JSON.stringify(tt), Lenh: lenh, NgayCan: can }]);
    dbSuKien_(ss, q.me, 'DB_DE_NGHI_UU', id, { ma: khop.nhan, tabs: tabs, ly: ly.s, kq: tt }, lenh);
    try { ghiLog_(q.me, 'Đề nghị ưu tiên đơn', (tabs.join(',') + ' · ' + khop.nhan).slice(0, 200), '', ly.s.slice(0, 120)); } catch (e) {}
    var out = { ok: true, msg: 'Đã gửi đề nghị ưu tiên đơn ' + khop.nhan + ' – ban điều hành sẽ xem và trả lời trên web.' };
    if (lenh) { try { cache.put('DBT_L_' + lenh, JSON.stringify(out), 600); } catch (e) {} }
    return sach_(out);
  } finally { l.releaseLock(); }
}
/* Người duyệt: p = { id, hanh: 'DONG_Y' | 'KHONG', lyDo, lenh }. Đồng ý = gắn ★ ưu tiên cả đơn (mọi tab của mã đơn đó) */
function xuLyDeNghiUu(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  if (!q.duyet) return sach_({ ok: false, msg: 'Chỉ Giám đốc (C019), Phó GĐ sản xuất (C056) và chị Kim Loan (C067) xử lý đề nghị ưu tiên.' });
  p = p || {}; var hanh = String(p.hanh || ''); if (hanh !== 'DONG_Y' && hanh !== 'KHONG') return sach_({ ok: false, msg: 'Thao tác không hợp lệ.' });
  var ly = { s: dbChu_(p.lyDo, DHH_LY_MAX) }; if (hanh === 'KHONG') { ly = dhhLy_(p.lyDo); if (ly.loi) return sach_({ ok: false, msg: ly.loi }); }
  var l; try { l = dbKhoa_(); } catch (e) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    var ss = dhhSS_(false), r = ss ? dhhDoc_(ss, 'DeNghiUu').filter(function(x) { return x.Id === String(p.id || ''); })[0] : null;
    if (!r) return sach_({ ok: false, msg: 'Không tìm thấy đề nghị.' });
    if (r.TrangThai !== 'CHO') return sach_({ ok: false, cu: true, msg: 'Đề nghị này đã được ' + (r.NguoiXuLy || 'người khác') + ' xử lý.' });
    var loi = '';
    if (hanh === 'DONG_Y') { String(r.Tabs || '').split(',').filter(Boolean).forEach(function(t) { try { dbGanUu_(q.me, r.MaDon, t); } catch (eU) { loi = ' (chưa gắn được ★ ở tab ' + t + ' – gắn lại trên bảng đơn)'; } }); }
    dhhSua_(ss, 'DeNghiUu', r._row, { TrangThai: hanh, NguoiXuLy: String(q.me.ten || q.me.tk || '').slice(0, 60), TkXuLy: String(q.me.tk || ''), LucXuLy: dhhGio_(), LyDoXuLy: ly.s });
    dbSuKien_(ss, q.me, 'DB_UU_' + hanh, r.Id, { ma: r.MaDon, ly: ly.s }, dhhLenh_(p));
    try { ghiLog_(q.me, hanh === 'DONG_Y' ? 'Đồng ý ưu tiên đơn' : 'Không đồng ý ưu tiên đơn', (r.Tabs + ' · ' + r.MaDon + ' · ' + r.NguoiTao).slice(0, 200), '', ly.s.slice(0, 120)); } catch (e) {}
    return sach_({ ok: true, msg: hanh === 'DONG_Y' ? 'Đã ★ ưu tiên đơn ' + r.MaDon + ' – ngày dự kiến các đơn tính lại trong ít phút.' + loi : 'Đã trả lời không ưu tiên đơn ' + r.MaDon + '.' });
  } finally { l.releaseLock(); }
}
/* danh sách đề nghị cho layDonBan: người duyệt = mọi đề nghị (chờ trước), Bán hàng = của mình */
function dbtDsDN_(q) {
  var ss = dhhSS_(false); if (!ss) return [];
  var tk = String(q.me.tk || ''), ds = dhhDoc_(ss, 'DeNghiUu').filter(function(r) { return q.duyet || r.Tk === tk; });
  ds.sort(function(a, b) { return ((a.TrangThai === 'CHO' ? 0 : 1) - (b.TrangThai === 'CHO' ? 0 : 1)) || String(b.Luc).localeCompare(String(a.Luc)); });
  return ds.slice(0, DBT_DN_WEB).map(function(r) { var kq = {}; try { kq = JSON.parse(r.KetQua || '{}') || {}; } catch (e) {}
    return { id: r.Id, luc: r.Luc, ma: r.MaDon, kenh: String(r.Tabs || '').split(',').map(function(t) { return DH_NHAN_TAB[t] || t; }).join(', '), ly: r.LyDo, can: r.NgayCan || '', ai: r.NguoiTao, tt: r.TrangThai, kq: kq, xlAi: r.NguoiXuLy, xlLuc: r.LucXuLy, xlLy: r.LyDoXuLy }; });
}
