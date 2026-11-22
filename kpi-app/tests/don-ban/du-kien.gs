/* ===== 17/11 (chủ dự án): NGÀY DỰ KIẾN XONG cho Bán hàng + BẢNG ĐƠN NHÀ MÁY (4 cột) + "NGƯỜI KHÁC ĐANG XEM ĐƠN NÀY" =====
   - Ngày dự kiến xong = ĐÚNG mô phỏng công suất của bảng đơn (dhMoPhong trong quy-trinh-web.html, chép sang máy chủ vì Bán hàng không tải
     mảnh Đơn hàng): 300 sp/ngày (⚙ Công suất), làn lẻ cố định 10%, xếp theo bậc → deadline → gần xong trước; dòng trễ > 30 ngày chưa
     có hạn mới không xếp lịch. Bán hàng thấy ngày đó CỘNG THÊM 2 NGÀY LÀM VIỆC cho chắc (chủ dự án chốt 17/11).
     Sửa thuật toán ở quy-trinh-web.html thì sửa cả ở đây – tests/du-kien.js so 2 bản trên cùng dữ liệu.
   - Bảng đơn nhà máy: mọi đơn đang làm (còn thiếu > 0, đã bỏ mã hủy / áp SL bớt), CHỈ 4 cột Mã đơn · Mã sản phẩm · Số đặt · Deadline + kênh để lọc.
   - Đang xem: người duyệt mở thẻ chờ duyệt → web báo máy chủ mỗi 30 giây; người duyệt khác thấy "… đang xem đơn này". Kiểm thử: tests/du-kien.js */
var DBK_TAB_BAC1 = { 'WEB LẺ CUSTOM': 1, 'WEB LẺ ĐƠN THƯỜNG': 1 }, DBK_HAN_LE = { 'WEB LẺ ĐƠN THƯỜNG': [5, 7], 'WEB LẺ CUSTOM': [12, 15] }, DBK_HAN_POD = [7, 10];
/* 17/11 khuya: tỷ lệ 5 làn + thứ tự phần dư + kênh -> làn đọc từ cs.lan (dhLanCfg_, chủ sở hữu chỉnh ở ⚙) – không còn hằng số DBK_LAN5 / DBK_LAN_DU */
var DBK_TRE_MAX = 30, DBK_LAN = 0.10, DBK_DU_PHONG = 2, DBK_DU_KIN = 6, DBK_CHO_MAX = 10, DBK_BANG_MAX = 5000, DBK_CACHE = 'DB_ETA_v1';
var DBK_SIM_C = ['PHOI_C', 'SON', 'UV', 'HT'], DBK_SIM_N = ['PHOI_N', 'TARO', 'HT1', 'TIP', 'HT'], DBK_SIM_1K = ['PHOI_C', 'SON', 'UV', 'HT', 'TIP'];
function dbkTC_(s) { return String(s == null ? '' : s).toUpperCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim(); }
function dbkCach_(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5); }
/* dữ liệu đơn như layDonHangXuong gửi web (phân loại, luồng bán thành phẩm, ★ web) – mô phỏng dùng đúng các trường này */
function dbkGiau_(d) {
  try { plNapThem_(); } catch (e) {}
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var btpSua = dhBTPDoc_(), uw = {}; try { uw = dhUuWebDoc_(); } catch (e) {}
  var don = (d.don || []).filter(function(o) { return !o.phu; }).map(function(o) {
    var x = {}; for (var k in o) x[k] = o[k];
    x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + plChuan_(o.ten)]); dhP2Loai_(x); x.btp = dhBTP_(x.ten, x.pl, btpSua).ds;
    var w = uw[String(x.maDon || '') + '|' + x.tab]; if (w) x.uuWeb = w;
    return x;
  });
  try { dhGanHanRieng_(don); } catch (eHR) {}   // 21/11: hạn riêng từng mã
  return { don: don, uu: d.uu || [], tre: d.tre || [] };
}
function dbkMoPhong_(G, them, cs, ut) {   // G = dbkGiau_(); them = đơn thử {ma, tab, thieu, dl, bac} | null; ut = {'mã|tab': 1} đơn "thử đẩy" lên đầu làn (như dhMoPhong) -> [{ma, tab, eta, g}]
  var laLam = dhNgayLamFn_(cs), cong = function(d, n) { var t = Date.parse(d + 'T00:00:00Z') + n * 864e5, x = new Date(t); return x.toISOString().slice(0, 10); };
  var thu = function(tu, n) { var d = tu, i = 0; while (!laLam(d) && i++ < 400) d = cong(d, 1); for (var k = 1; k < n; k++) { d = cong(d, 1); i = 0; while (!laLam(d) && i++ < 400) d = cong(d, 1); } return d; };
  var hn = homNayVN_(), mu = {}, mtr = {};
  G.uu.forEach(function(o) { var t = dbkTC_(o.ten); if (t) mu[dbkTC_(o.maDon || '') + '|' + t] = 1; });
  G.tre.forEach(function(o) { var t = dbkTC_(o.ten); if (t) mtr[t] = 1; });
  var hanLe = function(o) { var t = String((o && o.tab) || '').toUpperCase().trim(); return DBK_HAN_LE[t] || (/^POD/.test(t) ? DBK_HAN_POD : null); };
  var dlNgam = function(o) { var n = hanLe(o); return (o && !o.dl && o.ngayDat && n) ? thu(cong(o.ngayDat, 1), n[1]) : ''; };
  var CF = (cs && cs.lan) || dhLanCfg_(), LAN5 = CF.pt.map(function(p, j) { return [j + 1, p / 100]; }), LANDU = CF.du;
  var lanSo = function(tab) { var t = String(tab || '').toUpperCase().trim(); if (CF.kenh && CF.kenh[t]) return CF.kenh[t]; if (DBK_TAB_BAC1[t] || /^POD/.test(t)) return 1; if (t === 'DEALER') return 2; if (t === 'OEM') return 4; if (t === 'A ĐÔNG') return 5; return 3; };
  var lyDo = function(o) {   // 18/11: lý do dòng ở bậc 1 (cho "Vì sao đơn này xong ngày này")
    var t = dbkTC_(o.ten); if (o.hanRieng) return '⏱ hạn riêng ' + o.hanRieng.han.split('-').reverse().slice(0, 2).join('/'); if (o.uuWeb) return '★ ưu tiên'; if (o.dl && o.dl < hn) return 'trễ hạn'; if (mtr[t]) return 'tên trong tab TRỄ HẠN';
    if (o.tab === 'KHO' && (mu[dbkTC_(o.maDon || '') + '|' + t] || mu['|' + t])) return 'hàng ưu tiên'; return ''; };
  var bac = function(o) {
    var tab = String(o.tab || '').toUpperCase().trim(), t = dbkTC_(o.ten);
    if (o.hanRieng) return 1;   // 21/11: hạn riêng từng mã = ưu tiên trong làn
    if (o.uuWeb) return 1;   // 17/11 tối: ưu tiên TRONG LÀN – trễ / ★ / tên trong tab TRỄ HẠN / hàng ưu tiên = 1, còn lại = 2
    if (o.dl && o.dl < hn) return 1;
    if (mtr[t]) return 1;
    if (o.tab === 'KHO' && (mu[dbkTC_(o.maDon || '') + '|' + t] || mu['|' + t])) return 1;
    return 2;
  };
  var k2 = function(k) { var s = String(k || '').toUpperCase(), c = s.match(/CHU[OÔ]I\s*:\s*([A-Z_]*)/), n = s.match(/NG[OỌ]N\s*:\s*([A-Z_]*)/); return (c || n) ? { c: c ? c[1] : '', n: n ? n[1] : '' } : null; };
  var ks = function(k) { var z = k2(k); return z ? [z.c, z.n].filter(Boolean) : (k ? [String(k)] : []); };
  var sim = function(o, g, uu, dau, i) {
    var route = o ? (o.btp || []) : ['PHOI', 'SON', 'TARO', 'UV', 'HT', 'TIP', 'DG'], co = function(k) { return route.indexOf(k) >= 0; };
    var need = o ? o.thieu : (g.thieu || 0), sl = o ? (Number(o.sl) || need) : need, base = Math.max(0, sl - need), qua = (o && o.qua) || {}, P2 = (o && o.p2) || null;
    var mot = !!o && (((o.pl || {}).loai === 'GAY1K') || (route.indexOf('TARO') < 0 && route.indexOf('SON') >= 0 && route.indexOf('TIP') >= 0));
    var laN = !mot && (co('TARO') || co('TIP')), laC = !mot && (co('SON') || co('UV') || !laN), ch = [];
    var oD = o && o.dn && o.dn.o ? ks(o.dn.o)[0] : '';
    var qv = function(k) { if (!o) return 0; if (k === 'PHOI_C') return P2 && P2.c != null ? P2.c : (Number(qua.PHOI) || 0); if (k === 'PHOI_N') return P2 && P2.n != null ? P2.n : (Number(qua.PHOI) || 0); if (k === 'HT1') return Number(qua.TIP) || 0; return Number(qua[k]) || 0; };
    var bpc = function(k) { return k.indexOf('PHOI') === 0 ? 'PHOI' : (k === 'HT1' ? 'HT' : k); };
    [[mot, DBK_SIM_1K], [laC, DBK_SIM_C], [laN, DBK_SIM_N]].forEach(function(x) { if (!x[0]) return;
      var st = x[1].filter(function(k) { return co(bpc(k)); }); if (!st.length) return;
      var vi = oD ? st.map(bpc).indexOf(oD) : -1;
      var dd = st.map(function(k, j) { return j < vi ? sl : qv(k); });
      for (var j = dd.length - 2; j >= 0; j--) if (dd[j] < dd[j + 1]) dd[j] = dd[j + 1];
      ch.push(st.map(function(k, j) { return Math.min(need, Math.max(0, dd[j] - base)); }));
    });
    var tien = 0, nb = 0; ch.forEach(function(x) { x.forEach(function(y) { tien += need ? y / need : 0; nb++; }); });
    return { o: o, ly: o ? lyDo(o) : '', g: g, lan: lanSo(o ? o.tab : g.tab), uu: dau ? 0 : (+uu || 2), han: (o && ((o.hanRieng && o.hanRieng.han) || o.dl || dlNgam(o))) || g.dl || '9999', i: i, need: need, dg: 0, eta: '', tien: nb ? tien / nb : 0 };
  };
  /* nhóm đơn như dhCSDon: dòng còn thiếu, không phải phụ kiện / hàng nối, gom theo mã đơn + tab */
  var m = {}, ds = [];
  G.don.forEach(function(o) { var l = (o.pl || {}).loai; if (!(o.thieu > 0) || l === 'PK' || l === 'NOI' || o.dung) return;   // 17/11: TẠM DỪNG không tính (như dhLaSX trên web)
    var ma = o.maDon || '(không mã)', k = ma + '|' + (o.tab || ''), g = m[k];
    if (!g) { g = m[k] = { ma: ma, tab: o.tab, thieu: 0, dong: [], dl: '' }; ds.push(g); }
    g.thieu += o.thieu; g.dong.push(o); if (o.dl && (!g.dl || o.dl < g.dl)) g.dl = o.dl; });
  if (them) ds.push({ ma: them.ma, tab: them.tab, thieu: them.thieu, dong: [], dl: them.dl || '', bac0: them.bac || 2, thu: 1 });
  var L = [], i = 0;
  ds.forEach(function(g) { var co = false, cho = 0, dau = !!(ut && ut[g.ma + '|' + g.tab]);   // 17/11 khuya: thử đẩy = lên đầu làn, kể cả dòng trễ > 30 ngày
    g.dong.forEach(function(o) { if (o.dl && dbkCach_(o.dl, hn) > DBK_TRE_MAX && !dau) { cho += o.thieu; return; } co = true; L.push(sim(o, g, bac(o), dau, i++)); });
    if (!co && !cho) L.push(sim(null, g, g.bac0 || 2, dau, i++)); });
  L.sort(function(a, b) { return (a.uu - b.uu) || String(a.han).localeCompare(String(b.han)) || ((b.tien || 0) - (a.tien || 0)) || (a.i - b.i); });
  var SP = cs.sp || DH_CS_MAC, lan = {}, con = L.length, ngay = thu(hn, 1), E = 1e-6;
  LAN5.forEach(function(x) { lan[x[0]] = L.filter(function(l) { return l.lan === x[0]; }); });
  var lam = function(a, lim) { for (var j = 0; j < a.length && lim > E; j++) { var l = a[j]; if (l.eta) continue; var q = Math.min(l.need - l.dg, lim); if (q > E) { l.dg += q; lim -= q; } } return lim; };
  var conViec = function(k) { return lan[k].some(function(l) { return !l.eta && l.dg < l.need - E; }); };
  for (var t = 0; t < 800 && con > 0; t++) {
    var du = 0; LAN5.forEach(function(x) { du += lam(lan[x[0]], SP * x[1]); });
    LANDU.forEach(function(k) { if (du > E) du = lam(lan[k], du); });   // 17/11 tối: phần dư dồn Dealer → Kho → OEM → A Đông → Lẻ + POD
    L.forEach(function(l) { if (!l.eta && l.dg >= l.need - E) { l.eta = ngay; con--; } });
    ngay = thu(cong(ngay, 1), 1);
  }
  var out = {}; ds.forEach(function(g) { out[g.ma + '|' + g.tab] = { ma: g.ma, tab: g.tab, eta: '', thu: g.thu ? 1 : 0 }; });
  L.forEach(function(l) { var x = out[l.g.ma + '|' + l.g.tab]; var e = l.eta || '9999-12-31'; if (e > x.eta) x.eta = e; });
  return { m: out, L: L, lan5: LAN5, sp: SP, hn: hn, cong2: function(d) { return thu(cong(d, 1), DBK_DU_PHONG); }, congN: function(d, n) { return thu(cong(d, 1), n); } };
}
/* ngày dự kiến cho Bán hàng (đã cộng 2 ngày làm): { eta: 'yyyy-mm-dd' | '', cho: 1 nếu dòng trễ > 30 ngày chưa có hạn mới (không xếp lịch) }. Đơn đã xong hết: không có trong mô phỏng -> null */
function dbkHien_(x, R) { if (!x) return null; if (!x.eta || x.eta >= '9999') return { eta: '', cho: 1 }; return { eta: R.cong2(x.eta), goc: x.eta }; }   // eta rỗng = mọi dòng trễ > 30 ngày (không xếp lịch)
/* gắn ngày dự kiến vào danh sách đơn của layDonBan (out = dbWeb_ đã có .td). d = dhDocDon_() đã đọc sẵn */
function dbkGanDuKien_(out, d) {
  if (!d) return;
  var cs = dhCongSuat_(), G = null, R = null, cache = CacheService.getScriptCache(), ky = [d.luc || '', cs.sp, (d.phuDs || []).length], tl = 0, ts = 0;
  (d.don || []).forEach(function(o) { tl += o.thieu || 0; ts += o.sl || 0; }); ky.push((d.don || []).length, tl, ts);
  try { ky.push(JSON.stringify([cs.lan.pt, cs.lan.du, cs.lan.kenh])); } catch (eL) {}   // 17/11 khuya: đổi chia làn -> tính lại
  try { var uwK = Object.keys(dhUuWebDoc_()).sort().join(','); ky.push(uwK.length, uwK.slice(-40)); } catch (eU) {}   // 17/11 khuya: gắn / bỏ ★ (vd duyệt đề nghị ưu tiên) -> tính lại   // dữ liệu đổi (duyệt / hủy / nhập số) -> khóa nhớ tạm đổi
  try { var hrK = JSON.stringify(dhHanRiengDoc_()); ky.push(hrK.length, hrK.slice(-60)); } catch (eHR) {}   // 21/11: đặt / bỏ hạn riêng -> tính lại
  var key = DBK_CACHE + '|' + ky.join('|');
  var lay = function() { if (!G) G = dbkGiau_(d); return G; };
  try { var s = cache.get(key); if (s) { var m0 = JSON.parse(s); var R0 = dbkMoPhong_({ don: [], uu: [], tre: [] }, null, cs); R = { m: m0, cong2: R0.cong2, congN: R0.congN }; } } catch (e) { R = null; }
  if (R && out.some(function(x) { return x.tt === 'DA_DUYET' && x.td && x.td.thieu > 0 && !R.m[x.maDon + '|' + x.tab]; })) R = null;   // đơn vừa duyệt chưa có trong bản nhớ tạm
  if (!R) { R = dbkMoPhong_(lay(), null, cs); try { var z = JSON.stringify(R.m); if (z.length < 95000) cache.put(key, z, 300); } catch (e) {} }
  out.R = R;
  var nCho = 0;
  out.forEach(function(x) {
    if (x.tt === 'DA_DUYET' && x.td) { var h = dbkHien_(R.m[x.maDon + '|' + x.tab], R); if (h) { x.td.eta = h.eta; if (h.cho) x.td.etaCho = 1; } return; }
    if (x.tt !== 'CHO_DUYET' || nCho >= DBK_CHO_MAX) return;
    nCho++;   /* đơn chờ duyệt: thử xếp đơn này vào cuối hàng đợi đúng bậc của kênh, deadline = deadline mong muốn */
    var tab = String(x.tab || '').toUpperCase().trim(), bac = (DBK_TAB_BAC1[tab] || /^POD/.test(tab)) ? 1 : tab === 'DEALER' ? 2 : 4;
    var R2 = dbkMoPhong_(lay(), { ma: '(thử) ' + x.maDon, tab: x.tab, thieu: x.tongSL, dl: x.dlMuon || '', bac: 2 }, cs);   // 17/11 tối: xếp cuối làn của kênh
    var h2 = dbkHien_(R2.m['(thử) ' + x.maDon + '|' + x.tab], R2); if (h2 && h2.eta) x.duKien = h2.eta;
  });
}
/* Bảng đơn nhà máy cho Bán hàng / người duyệt: mọi đơn đang làm, 4 cột */
function layBangDonNhaMay(token) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  var d; try { d = dhDocDon_(false); } catch (e) { return sach_({ ok: false, msg: 'Chưa đọc được bảng đơn – thử lại sau ít phút.' }); }
  try { dhGanHanRieng_(d.don); } catch (eHR) {}   // 21/11
  var thu = {}; DH_TABS.forEach(function(t, i) { thu[t] = i; });
  var ds = (d.don || []).filter(function(o) { return !o.phu && o.thieu > 0 && o.ten; });
  ds.sort(function(a, b) { var ta = thu[a.tab] != null ? thu[a.tab] : 99, tb = thu[b.tab] != null ? thu[b.tab] : 99;
    return (ta - tb) || String(a.tab).localeCompare(String(b.tab)) || String(a.maDon || '').localeCompare(String(b.maDon || '')) || String(a.ten).localeCompare(String(b.ten)); });
  var het = ds.length > DBK_BANG_MAX;
  /* 17/11 (chủ dự án): thống kê theo kênh – số đơn, SL đặt, còn phải làm, ngày xong hết; dòng tổng = nhà máy kín lịch đến ngày nào.
     Ngày = mô phỏng công suất (như bảng đơn) + dư khoảng 1 tuần (6 ngày làm việc) cho Bán hàng hứa khách */
  var tk = [];
  try {
    var R = { m: {} }, gia = [{ tt: 'DA_DUYET', td: null }]; dbkGanDuKien_(gia, d); R = gia.R || R;
    var theo = {}, tong = { tab: '', don: {}, sl: 0, thieu: 0, eta: '', cho: 0, dung: 0, donDung: {} };
    ds.forEach(function(o) { var x = theo[o.tab] || (theo[o.tab] = { tab: o.tab, don: {}, sl: 0, thieu: 0, eta: '', cho: 0, dung: 0, donDung: {} }); [x, tong].forEach(function(z) { var kd = (o.maDon || '(không mã)') + '|' + o.tab; if (o.dung) { z.dung += o.thieu || 0; z.donDung[kd] = 1; return; } z.don[kd] = 1; z.sl += o.sl || 0; z.thieu += o.thieu || 0; }); });   // 17/11: TẠM DỪNG tách riêng, không tính
    Object.keys(R.m || {}).forEach(function(k) { var g = R.m[k], x = theo[g.tab]; if (!x) return; [x, tong].forEach(function(z) { if (!g.eta || g.eta >= '9999') z.cho++; else if (g.eta > z.eta) z.eta = g.eta; }); });
    var ra = function(z) { return { tab: z.tab, don: Object.keys(z.don).length, sl: z.sl, thieu: z.thieu, dung: z.dung, donDung: Object.keys(z.donDung).length, xong: z.eta && R.congN ? R.congN(z.eta, DBK_DU_KIN) : '', cho: z.cho }; };
    tk = Object.keys(theo).sort(function(a, b) { var ta = thu[a] != null ? thu[a] : 99, tb = thu[b] != null ? thu[b] : 99; return (ta - tb) || a.localeCompare(b); }).map(function(t) { return ra(theo[t]); });
    tk.push(ra(tong));
  } catch (eTK) { tk = []; }
  return sach_({ ok: true, luc: d.luc || '', het: het ? 1 : 0, n: ds.length, kenh: dbKenh_(), tk: tk, duKin: DBK_DU_KIN, cs: dhCongSuat_().sp,
    pct: dbxPctDon_(d.don || []),   // 21/11 (chủ dự án): thanh % hoàn thành theo từng đơn
    ds: dbxTheDs_(d.don || [], thu).slice(0, DBK_BANG_MAX).map(function(o) { return [o.tab, String(o.maDon || ''), o.ten, o.sl || 0, o.dl || '', o.dung ? 1 : 0, o.hanRieng ? o.hanRieng.han : '', Math.max(0, o.thieu || 0)]; }) });   // [5] tạm dừng · [6] hạn riêng (21/11) · [7] còn thiếu (22/11: chủ dự án cho Bán hàng xem Đặt / Thiếu / Giao như ORDER·FLOW)
}
/* 22/11 (chủ dự án): bảng đơn nhà máy hiện THẺ THEO ĐƠN kiểu ORDER·FLOW – mọi mã của đơn đang làm (cả mã đã xong), bỏ hàng phụ / mã hủy */
function dbxTheDs_(don, thu) {
  var dang = {}; don.forEach(function(o) { if (!o.phu && o.ten && o.thieu > 0) dang[o.tab + '|' + String(o.maDon || '')] = 1; });
  var a = don.filter(function(o) { return !o.phu && o.ten && dang[o.tab + '|' + String(o.maDon || '')]; });
  a.sort(function(x, y) { var tx = thu[x.tab] != null ? thu[x.tab] : 99, ty = thu[y.tab] != null ? thu[y.tab] : 99; return (tx - ty) || String(x.maDon || '').localeCompare(String(y.maDon || '')); });
  return a;
}
/* ===== 21/11 (chủ dự án): % hoàn thành từng đơn = (số đặt − còn thiếu) ÷ số đặt, cộng MỌI mã của đơn (cả mã đã xong) – bỏ hàng phụ / mã hủy ===== */
function dbxPctDon_(don) {
  var m = {};
  don.forEach(function(o) { if (o.phu || !o.ten || !o.maDon) return; var k = o.tab + '|' + o.maDon, x = m[k] || (m[k] = [0, 0]); x[0] += Number(o.sl) || 0; x[1] += Math.max(0, Number(o.thieu) || 0); });
  var out = {}; Object.keys(m).forEach(function(k) { var x = m[k]; if (x[0] > 0) out[k] = Math.max(0, Math.min(100, Math.round((x[0] - Math.min(x[1], x[0])) * 100 / x[0]))); });
  return out;
}
/* ===== 21/11 (chủ dự án): đơn LẺ / POD đã xong trong 3 ngày làm việc gần nhất (kể cả hôm nay) – từ sự kiện hoàn thiện (bản chụp 9h phát hiện đơn rời tab kênh
   sang tab HT; ngày xong = ngày web phát hiện, chậm tối đa 1 ngày). Sự kiện trùng (cùng mã + tên + lần cuối thấy) chỉ lấy 1. ===== */
var DBX_SO_NGAY = 3, DBX_LE = { 'WEB LẺ ĐƠN THƯỜNG': 'le', 'WEB LẺ CUSTOM': 'le', 'POD-A.BÁCH': 'pod', 'POD-ECOMSTONE': 'pod' };
function layDonXongLePOD(token) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  var laLam = dhNgayLamFn_(dhCongSuat_()), hn = homNayVN_(), ng = [], d = hn, i = 0;
  while (ng.length < DBX_SO_NGAY && i++ < 40) { if (laLam(d)) ng.push(d); d = new Date(Date.parse(d + 'T00:00:00Z') - 864e5).toISOString().slice(0, 10); }
  var tu = ng[ng.length - 1] || hn, tabNhan = {}; Object.keys(DH_NHAN_TAB).forEach(function(t) { tabNhan[DH_NHAN_TAB[t]] = t; });
  var thay = {}, don = {};
  dhDocHoanThien_().forEach(function(r) {
    var tab = tabNhan[r[4]] || r[4], nhom = DBX_LE[tab]; if (!nhom || String(r[0]) < tu) return;
    var k = r[2] + '|' + r[3] + '|' + r[1]; if (thay[k] && thay[k] <= r[0]) return; thay[k] = r[0];
    var kd = tab + '|' + r[2], x = don[kd] || (don[kd] = { nhom: nhom, tab: tab, kenh: DH_NHAN_TAB[tab] || tab, maDon: r[2], xong: r[0], dong: {} });
    x.dong[r[3]] = { ten: r[3], sl: r[6] || r[7] || 0, thieu: r[8] || 0, xong: r[0] };
  });
  var ds = Object.keys(don).map(function(k) { var x = don[k], dong = Object.keys(x.dong).map(function(t) { return x.dong[t]; });
    x.xong = dong.reduce(function(a, z) { return z.xong > a ? z.xong : a; }, '');   // đơn xong khi mã cuối cùng rời tab kênh
    return { nhom: x.nhom, tab: x.tab, kenh: x.kenh, maDon: x.maDon, xong: x.xong, dong: dong.map(function(z) { return [z.ten, z.sl, z.thieu]; }) }; });
  ds.sort(function(a, b) { return (b.xong > a.xong ? 1 : b.xong < a.xong ? -1 : 0) || String(a.maDon).localeCompare(String(b.maDon)); });
  return sach_({ ok: true, ngay: ng, tu: tu, ds: ds });
}
/* "Người khác đang xem đơn này": chỉ người duyệt. ids = đơn chờ duyệt đang hiện trên màn (≤ 10). Nhớ 120 giây, coi là đang xem nếu báo trong 75 giây */
function dbDangXem(token, ids) {
  var me = docPhien_(token); if (!me) return sach_({ ok: false, hetHan: true });
  var duyet = false; try { duyet = dhCoHuy_(me); } catch (e) {}
  if (!duyet) return sach_({ ok: false, msg: 'Chỉ người duyệt đơn.' });
  var a = (Array.isArray(ids) ? ids : []).map(String).filter(function(x) { return /^B[0-9a-f]{12}$/.test(x); }).slice(0, 10);
  var c = CacheService.getScriptCache(), now = Date.now(), tk = String(me.tk || ''), ten = String(me.ten || tk).slice(0, 40), kq = {};
  a.forEach(function(id) {
    var m = {}; try { m = JSON.parse(c.get('DBX_' + id) || '{}') || {}; } catch (e) { m = {}; }
    var khac = []; Object.keys(m).forEach(function(k) { if (k !== tk && m[k] && now - Number(m[k].t) < 75000) khac.push(String(m[k].ten || k)); });
    m[tk] = { ten: ten, t: now };
    Object.keys(m).forEach(function(k) { if (now - Number(m[k].t) > 120000) delete m[k]; });
    try { c.put('DBX_' + id, JSON.stringify(m), 120); } catch (e) {}
    if (khac.length) kq[id] = khac;
  });
  return sach_({ ok: true, xem: kq });
}
