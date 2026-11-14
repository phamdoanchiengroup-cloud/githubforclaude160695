
/* ===== 08/11 ĐIỀU PHỐI SẢN XUẤT (chủ dự án chọn việc 1, 2, 3 do quan-ly-van-hanh đề xuất) =====
   1) Cách đếm sản lượng xưởng (Claude đề xuất, chủ sở hữu bấm áp dụng) + Sức khỏe dữ liệu nhật ký.
   3) Dòng chảy giữa các xưởng (hàng đang dồn / đang hụt) + nút cổ chai hôm qua & 7 ngày.
      -> 1 và 3: chủ sở hữu + Ban điều hành (vai trò ADMIN), hiện ở Việc hôm nay; chủ sở hữu có thêm ở email 8h.
   2) "Hôm nay xưởng tôi làm gì trước": trưởng / phó phòng xem xưởng mình, chủ sở hữu xem mọi xưởng (layViecXuongToi).
   Sản lượng xưởng dùng đúng cách A (bước xuất ở tab Quy trình, chia "số lần ghi mỗi khúc") như biểu đồ sản lượng xưởng. */
var DP_CACHE = 'DP_v1';
/* Đề xuất cách đếm (số thật tháng 10, máy giả lập 08/11):
   - Phôi Carbon chỉ đếm Kiểm đếm xuất chuôi + Đóng gói ngọn (~231/ngày, đạt ~50%) – nhánh Ngọn không có bước xuất. Bước cuối nhánh Ngọn là "Cắt Phôi Ngọn" (~214/ngày).
   - Sơn: chủ dự án báo 02/11 "Sơn ghi mỗi lớp sơn thành 1 lần riêng"; mỗi chuôi qua Sơn máy + Sơn súng tay -> ~767/ngày, gấp đôi Phôi Thô xuất chuôi (~345) và Đóng gói (~352). Chia 2 -> ~383.
   - In UV: In và phủ bóng + Phủ bóng bề mặt -> ~753/ngày, cùng kiểu 2 lớp. Chia 2 -> ~377. */
var DP_DE_XUAT = [
  { x: 'PHOICB', them: ['CB-CHECK-CAT'], ly: 'Nhánh Ngọn chưa có bước xuất nên Phôi Carbon chỉ đếm chuôi + ngọn đóng gói. Thêm "Cắt Phôi Ngọn" – bước cuối của mỗi ngọn trước khi giao Phôi Thô.',
    doi: [['XPT-CPN-KTN', 'Phôi Thô: Check phôi ngọn CB trước khi SX'], ['XPT-VSR-VSP', 'Phôi Thô: Vệ sinh ren và phôi (chuôi ra)']] },
  { x: 'SON', luot: 2, ly: 'Sơn ghi mỗi lớp sơn thành 1 lần riêng (Sơn máy + Sơn súng tay cho cùng 1 chuôi) nên đang đếm gấp đôi. Chia 2 để ra số chuôi.',
    doi: [['XPT-VSR-VSP', 'Phôi Thô xuất chuôi'], ['DG-DONGGOITP', 'Đóng gói thành phẩm']] },
  { x: 'INUV', luot: 2, ly: '"In và phủ bóng" + "Phủ bóng bề mặt" ghi 2 lần cho cùng 1 chuôi (cùng kiểu Sơn). Chia 2 để ra số chuôi.',
    doi: [['XPT-VSR-VSP', 'Phôi Thô xuất chuôi'], ['DG-DONGGOITP', 'Đóng gói thành phẩm']] }
];
/* Dòng chảy: [xưởng trước, phần, xưởng sau, phần, nhãn] – phần 'c' chuôi, 'n' ngọn, '' cả xưởng */
var DP_CAP = [['PHOICB', 'c', 'PHOITHO', 'c', 'Phôi chuôi'], ['PHOICB', 'n', 'PHOITHO', 'n', 'Phôi ngọn'], ['PHOITHO', 'c', 'SON', '', 'Chuôi chờ sơn'],
  ['SON', '', 'INUV', '', 'Chuôi chờ in UV'], ['PHOITHO', 'n', 'NGONTARO', 'n', 'Ngọn chờ taro'], ['NGONTARO', 'n', 'HT', 'n', 'Ngọn chờ hoàn thiện (trước làm đầu)']];   // 14/11: ngọn Taro → Hoàn thiện → Ngọn Tip → trả HT   // Hoàn thiện (đếm khúc) → Đóng gói (đếm sản phẩm) khác đơn vị: không so
var DP_CHUOI = [['Chuỗi chuôi', [['PHOICB', 'c'], ['PHOITHO', 'c'], ['SON', ''], ['INUV', '']]], ['Chuỗi ngọn', [['PHOICB', 'n'], ['PHOITHO', 'n'], ['NGONTARO', 'n'], ['HT', 'n'], ['NGONTIP', '']]]];   // 14/11: ngọn qua Hoàn thiện trước Ngọn Tip

/* Đối chiếu ghi thiếu (08/11 chủ dự án: số Ngọn Taro đúng, ngọn GF qua Phôi Thô nhưng Phôi Thô ghi thiếu):
   [nhãn, mã xưởng trước giao, mã xưởng sau nhận, xưởng cần nhắc, chặng dòng chảy liên quan] – xưởng sau làm > 1,3 lần xưởng trước giao (và hơn 20/ngày) trong 14 ngày -> báo */
var DP_GHI_THIEU = [
  ['Ngọn Glassfiber', ['XPT-TR-TRNGF'], ['NGON-TARORENDONG-GF', 'NGON-TARORENTHUONG-GF'], 'PHOITHO', 'Ngọn chờ taro'],
  ['Ngọn Carbon', ['XPT-EPXN-NCBCD', 'XPT-EPXNCB-NCBT'], ['NGON-TAROREN-CB', 'NGON-TARORENDONG-CARBON'], 'PHOITHO', 'Ngọn chờ taro']
];
function dpQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (!me.laOwner && me.vaiTro !== 'ADMIN') return { loi: sach_({ ok: false, msg: 'Chỉ chủ sở hữu và Ban điều hành xem phần này.' }) };
  return { me: me };
}
function dpCongNgay_(d, n) { var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return Utilities.formatDate(x, 'GMT', 'yyyy-MM-dd'); }
/* Ngày làm trong [tu, den]: thứ 2 – thứ 7, trừ lễ toàn công ty (sheet NgayLe không ghi xưởng + 24/11) */
function dpNgayLam_(tu, den) {
  var le = {}; docAnToan_('NgayLe').forEach(function(r) { if (!String(r.MaXuong || '').trim()) le[ngayVN_(r.Ngay)] = 1; });
  [tu.slice(0, 4), den.slice(0, 4)].forEach(function(y) { (typeof LE_CO_DINH_ !== 'undefined' ? LE_CO_DINH_ : []).forEach(function(x) { le[y + '-' + x[0]] = 1; }); });
  var ds = [];
  for (var d = tu, i = 0; d <= den && i < 400; d = dpCongNgay_(d, 1), i++) if (new Date(d + 'T12:00:00Z').getUTCDay() !== 0 && !le[d]) ds.push(d);
  return ds;
}
function dpTv_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase(); }
function dpTinh_() {
  var hn = homNayVN_(), homQua = dpCongNgay_(hn, -1);
  var ngay30 = dpNgayLam_(dpCongNgay_(hn, -42), homQua).slice(-30), ngay14 = ngay30.slice(-14), ngay7 = ngay30.slice(-7), ngay6 = ngay30.slice(-6);
  var tu30 = ngay30[0] || homQua, la30 = {}, la14 = {}, la7 = {};
  ngay30.forEach(function(d) { la30[d] = 1; }); ngay14.forEach(function(d) { la14[d] = 1; }); ngay7.forEach(function(d) { la7[d] = 1; });
  var cds = doc_('CongDoan'), dung = cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }), qt = qtDocQT_(dung);
  var xOf = {}, tenCD = {}; cds.forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); tenCD[String(c.MaCD)] = String(c.TenCD || c.MaCD); });
  var tenX = {}; docAnToan_('PhongBan').forEach(function(r) { tenX[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  var ten = function(m) { return tenCD[m] || m; };
  /* bước xuất đang dùng của từng xưởng (giống dhSanLuongXuong_) */
  var xuat = {}, luot = {};
  DH_XUONG_TT.forEach(function(X) {
    var ma = X === 'DG' ? dhMaDongGoi_() : ((qt.xuat[X] && qt.xuat[X].length) ? qt.xuat[X].slice() : (DH_XUAT_MAC_DINH[X] || []).filter(function(m) { return xOf[m] === X; }));
    xuat[X] = ma; luot[X] = qt.luot[X] || 1;
  });
  var phan = function(X, m) {   // chuôi / ngọn của 1 bước xuất (nhánh trong tab Quy trình, không có thì theo tên); POM ở Ngọn Taro là vật liệu cấp Phôi Thô – bỏ
    var c = qt.cd[m], nh = c ? c.Nhanh : '', t = dpTv_(m + ' ' + ten(m));
    if (X === 'NGONTARO' && (nh === 'POM' || /pom/.test(t))) return '';
    if (nh === 'PK' || /tester/.test(t)) return '';   // 08/11 chủ dự án: Tester = joint tester thử ren chuôi cho khách (phụ kiện), không phải ngọn
    if (nh === 'NGON' || (/ngon/.test(t) && nh !== 'CHUOI')) return 'n';
    return 'c';
  };
  var cuaXuat = {}; DH_XUONG_TT.forEach(function(X) { xuat[X].forEach(function(m) { (cuaXuat[m] = cuaXuat[m] || []).push(X); }); });
  var deXuatMa = {}; DP_GHI_THIEU.forEach(function(g) { g[1].concat(g[2]).forEach(function(m) { deXuatMa[m] = 1; }); }); DP_DE_XUAT.forEach(function(p) { (p.them || []).forEach(function(m) { deXuatMa[m] = 1; }); (p.doi || []).forEach(function(a) { deXuatMa[a[0]] = 1; }); });
  /* 1 lượt đọc nhật ký */
  var sl = {}, coNK = {}, cho = {}, tuongLai = [], hang = {}, gan = [];
  doc_('NhatKySanXuat').forEach(function(r) {
    var tt = String(r.TrangThai).trim(); if (tt === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay), m = String(r.MaCD), X = xOf[m] || '', v = Number(r.SoLuongLamRa) || 0;
    if (ng > hn) { tuongLai.push({ ng: ng, x: X, cd: ten(m), nv: String(r.MaNV), sl: v, nguoi: String(r.NguoiNhap || '') }); return; }
    if (tt === 'Chờ duyệt' && ng < dpCongNgay_(hn, -2)) { var c = cho[X] || (cho[X] = { n: 0, cu: ng }); c.n++; if (ng < c.cu) c.cu = ng; }
    if (!la30[ng]) return;
    if (la7[ng]) (coNK[X] = coNK[X] || {})[ng] = 1;
    if (v <= 0) return;
    if (cuaXuat[m] || deXuatMa[m]) { var a = sl[m] || (sl[m] = {}); a[ng] = (a[ng] || 0) + v; }
    (hang[m] = hang[m] || []).push(v);
    if (la7[ng]) gan.push([m, ng, v, String(r.MaNV), String(r.NguoiNhap || '').split(' →')[0].trim()]);
  });
  var tong = function(ma, ngs, chia) { var t = 0; ma.forEach(function(m) { var a = sl[m] || {}; ngs.forEach(function(d) { t += a[d] || 0; }); }); return t / (chia || 1); };
  var tb = function(ma, ngs, chia) { return ngs.length ? tong(ma, ngs, chia) / ngs.length : 0; };
  /* ---- 1a. Cách đếm: đang dùng vs đề xuất (TB 30 ngày làm) ---- */
  var dem = DP_DE_XUAT.map(function(p) {
    var X = p.x, cu = xuat[X].slice(), lu = luot[X], moi = cu.slice(), luMoi = p.luot || lu;
    (p.them || []).forEach(function(m) { if (xOf[m] === X && moi.indexOf(m) < 0) moi.push(m); });
    var trung = moi.join(',') === cu.join(',') && luMoi === lu;
    return { x: X, ten: tenX[X] || X, ly: p.ly, daAp: trung,
      cu: { ma: cu, ten: cu.map(ten), luot: lu, tb: Math.round(tb(cu, ngay30, lu)) },
      moi: { ma: moi, ten: moi.map(ten), luot: luMoi, tb: Math.round(tb(moi, ngay30, luMoi)), them: moi.filter(function(m) { return cu.indexOf(m) < 0; }).map(ten) },
      doi: (p.doi || []).filter(function(a) { return xOf[a[0]]; }).map(function(a) { return [a[1], Math.round(tb([a[0]], ngay30, 1))]; }) };
  });
  /* Dòng chảy / nút cổ chai tính theo cách đếm đề xuất khi chủ sở hữu chưa áp (số đang dùng lệch gấp đôi thì so sánh vô nghĩa) */
  var theoDeXuat = false;
  dem.forEach(function(p) { if (p.daAp) return; theoDeXuat = true; xuat[p.x] = p.moi.ma.slice(); luot[p.x] = p.moi.luot; });
  /* ---- 1b. Sức khỏe dữ liệu ---- */
  var thieuNK = [];
  DH_XUONG_TT.forEach(function(X) { var co = coNK[X] || {}, k = ngay6.filter(function(d) { return !co[d]; }); if (k.length) thieuNK.push({ x: X, ten: tenX[X] || X, ngay: k }); });
  var choDs = Object.keys(cho).map(function(X) { return { x: X, ten: tenX[X] || X || '(công đoạn lạ)', n: cho[X].n, cu: cho[X].cu }; }).sort(function(a, b) { return b.n - a.n; });
  var trungVi = {}; Object.keys(hang).forEach(function(m) { var a = hang[m]; if (a.length < 10) return; a.sort(function(x, y) { return x - y; }); trungVi[m] = a[Math.floor(a.length / 2)]; });
  var la = gan.filter(function(g) { var t = trungVi[g[0]]; return t && g[2] > Math.max(3 * t, t + 100); })
    .map(function(g) { return { cd: ten(g[0]), x: tenX[xOf[g[0]]] || xOf[g[0]] || '', ng: g[1], sl: g[2], thuong: trungVi[g[0]], nv: g[3], nguoi: g[4], lan: Math.round(g[2] / trungVi[g[0]] * 10) / 10 }; })
    .sort(function(a, b) { return b.lan - a.lan; });
  var ghiThieu = [];
  DP_GHI_THIEU.forEach(function(g) {
    var a1 = g[1].filter(function(m) { return xOf[m]; }), b1 = g[2].filter(function(m) { return xOf[m]; }); if (!a1.length || !b1.length) return;
    var a = tb(a1, ngay14, 1), b = tb(b1, ngay14, 1);
    if (b > 20 && b > 1.3 * a && b - a > 20) ghiThieu.push({ nhan: g[0], x: g[3], ten: tenX[g[3]] || g[3], sau: tenX[xOf[b1[0]]] || '', a: Math.round(a), b: Math.round(b), cdA: a1.map(ten), cap: g[4] });
  });
  var sk = { ghiThieu: ghiThieu, thieuNK: thieuNK, cho: choDs, choTong: choDs.reduce(function(s, x) { return s + x.n; }, 0), la: la.slice(0, 12), laTong: la.length,
    tuongLai: tuongLai.length, tuongLaiDs: tuongLai.slice(0, 6).map(function(t) { t.x = tenX[t.x] || t.x; return t; }), ngay6: ngay6 };
  /* ---- 3. Dòng chảy + nút cổ chai ---- */
  var ra = function(X, ph, ngs) { var ma = xuat[X].filter(function(m) { return !ph || phan(X, m) === ph; }); if (X === 'NGONTARO' && !ph) ma = ma.filter(function(m) { return phan(X, m) !== ''; }); return tb(ma, ngs, luot[X]); };
  var tenP = function(X, ph) { return (tenX[X] || X) + (ph === 'c' && (X === 'PHOICB' || X === 'PHOITHO') ? ' (chuôi)' : ph === 'n' && (X === 'PHOICB' || X === 'PHOITHO' || X === 'HT') ? ' (ngọn)' : ''); };
  var cap = DP_CAP.map(function(c) {
    var a = ra(c[0], c[1], ngay14), b = ra(c[2], c[3], ngay14), ch = a - b, tich = ch * ngay14.length;
    var tt = !(a > 0) || !(b > 0) ? 'thieu' : Math.abs(ch) > 0.4 * Math.max(a, b) ? 'lech' : Math.abs(ch) <= 0.1 * b ? 'can' : ch > 0 ? 'don' : 'hut';   // lệch > 40%: nhiều khả năng do cách đếm, không kết luận dồn / hụt
    var gt = ghiThieu.filter(function(g) { return g.cap === c[4]; }).map(function(g) { return g.nhan; });
    return { ghiThieu: gt, nhan: c[4], tu: tenP(c[0], c[1]), den: tenP(c[2], c[3]), a: Math.round(a), b: Math.round(b), ch: Math.round(ch), tich: Math.round(tich), ngayB: b > 0 ? Math.round(tich / b * 10) / 10 : null, tt: tt };
  });
  var chuoi = DP_CHUOI.map(function(ch) {
    var ds = ch[1].map(function(a) { return { ten: tenP(a[0], a[1]), x: a[0], tb7: Math.round(ra(a[0], a[1], ngay7)), hq: Math.round(ra(a[0], a[1], [homQua])) }; }).filter(function(o) { return o.tb7 > 0; });
    var nho = ds.reduce(function(m, o) { return !m || o.tb7 < m.tb7 ? o : m; }, null), nhoHQ = ds.filter(function(o) { return o.hq > 0; }).reduce(function(m, o) { return !m || o.hq < m.hq ? o : m; }, null);
    return { ten: ch[0], ds: ds, nut: nho, nutHQ: nhoHQ };
  });
  var dg7 = Math.round(tb(xuat.DG, ngay7, 1));
  return { ok: true, luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), homQua: homQua, coHQ: ngay30.indexOf(homQua) >= 0,
    soNgay: { d30: ngay30.length, d14: ngay14.length, d7: ngay7.length }, tu30: tu30, theoDeXuat: theoDeXuat, dem: dem, sk: sk, cap: cap, chuoi: chuoi, dg7: dg7 };
}
function layDieuPhoi(token, lamMoi) {
  var q = dpQuyen_(token); if (q.loi) return q.loi;
  var c = CacheService.getScriptCache(), kq = null;
  if (!lamMoi) { try { var s0 = c.get(DP_CACHE); if (s0) kq = JSON.parse(s0); } catch (e) {} }
  if (!kq) { kq = dpTinh_(); try { var s1 = JSON.stringify(kq); if (s1.length < 90000) c.put(DP_CACHE, s1, 600); } catch (e2) {} }
  kq.coTheAp = !!q.me.laOwner;
  return sach_(kq);
}
/* Chủ sở hữu bấm "Áp dụng đề xuất" ở thẻ Cách đếm -> ghi bước xuất / số lần ghi mỗi khúc của các xưởng chưa áp */
function apDeXuatDem(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var d = dpTinh_(), o = { xuat: {}, luot: {} };
  d.dem.forEach(function(p) { if (p.daAp) return; if (p.moi.ma.join(',') !== p.cu.ma.join(',')) o.xuat[p.x] = p.moi.ma; if (p.moi.luot !== p.cu.luot) o.luot[p.x] = p.moi.luot; });
  if (!Object.keys(o.xuat).length && !Object.keys(o.luot).length) return sach_({ ok: true, msg: 'Cách đếm đã đúng như đề xuất.' });
  return apCachDem(token, o);
}

/* ---- 2) Việc của xưởng: dòng đơn còn thiếu có liên quan tới xưởng (máy khách tính phần còn lại ở xưởng bằng đúng hàm của Việc theo xưởng) ---- */
var DP_LOAI_XUONG = { PHOICB: { GAY: 1, NGON: 1, CHUOI: 1 }, PHOITHO: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 }, SON: { GAY: 1, CHUOI: 1, NOI: 1 }, INUV: { GAY: 1, CHUOI: 1, NOI: 1 },
  NGONTARO: { GAY: 1, NGON: 1 }, NGONTIP: { GAY: 1, NGON: 1 }, CNC: { GAY: 1, NGON: 1 }, HT: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 }, DG: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 } };
function layViecXuongToi(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var X = '';
  if (!me.laOwner) {
    if (me.vaiTro !== 'TP' || !me.xuong) return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng xưởng và chủ sở hữu xem việc theo xưởng.' });
    X = String(me.xuong).trim();
    if (!DP_LOAI_XUONG[X]) return sach_({ ok: true, khongCo: true, xuong: X });
  }
  var d;
  try { d = dhDocDon_(false); }
  catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) }); }
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, gon = function(o) {
    var tc = plChuan_(o.ten), p = pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]));
    return { maDon: o.maDon, tab: o.tab, kenh: o.kenh, nguoiDat: o.nguoiDat || '', ten: o.ten, sl: o.sl, thieu: o.thieu, dl: o.dl || '', qua: o.qua || {}, hong: o.hong || {}, uuTien: o.uuTien || '', pl: p };
  };
  var hop = function(o) { if (!(o.thieu > 0)) return false; if (!X) return true; var l = (pc[plChuan_(o.ten)] || {}).loai; return !!DP_LOAI_XUONG[X][l]; };
  var don = d.don.map(gon).filter(hop), uu = {};
  (d.uu || []).forEach(function(o) { if (o.maDon) uu[o.maDon] = o.uuTien || 'Ưu tiên'; });
  var tenX = {}; docAnToan_('PhongBan').forEach(function(r) { tenX[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  return sach_({ ok: true, luc: d.luc, xuong: X, tenXuong: X ? (tenX[X] || X) : '', don: don, uuMa: uu, nhan: chNhan_() });
}

/* Đoạn thêm vào email 8h của chủ sở hữu */
function dpEmail_(e0, so) {
  var e = function(t) { return e0(String(t == null ? '' : t).replace(/^Xưởng /, '')); }, d; try { d = dpTinh_(); } catch (x) { return ''; }
  var h = '<div style="font-size:12px;font-weight:600;color:#0b4f4a;border-left:3px solid #0b7a73;padding-left:8px;margin:14px 0 6px">ĐIỀU PHỐI (' + d.soNgay.d7 + ' ngày làm gần nhất)</div><ul style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.55">';
  d.chuoi.forEach(function(c) { if (c.nut) h += '<li>' + e(c.ten) + ': chậm nhất là <b>' + e(c.nut.ten) + '</b> ~' + so(c.nut.tb7) + '/ngày' + (c.nutHQ && c.nutHQ.ten !== c.nut.ten ? ' (hôm qua: ' + e(c.nutHQ.ten) + ' ' + so(c.nutHQ.hq) + ')' : '') + '</li>'; });
  if (d.theoDeXuat) h += '<li><i>Tính theo cách đếm Claude đề xuất (chưa áp dụng).</i></li>';
  d.cap.filter(function(c) { return c.tt === 'don' || c.tt === 'hut'; }).forEach(function(c) { h += '<li>' + e(c.nhan) + ': ' + (c.tt === 'don' ? '<b style="color:#b42a25">đang dồn</b> +' + so(c.tich) : '<b style="color:#9a5b00">đang hụt</b> ' + so(c.tich)) + ' trong ' + d.soNgay.d14 + ' ngày (' + e(c.tu) + ' ' + so(c.a) + ' → ' + e(c.den) + ' ' + so(c.b) + '/ngày)</li>'; });
  var s = d.sk, sk = [];
  (s.ghiThieu || []).forEach(function(g) { sk.push('<b>' + e(g.ten) + ' có thể ghi thiếu ' + e(g.nhan.toLowerCase()) + '</b> (giao ' + so(g.a) + '/ngày, ' + e(g.sau) + ' làm ' + so(g.b) + '/ngày)'); });
  if (s.thieuNK.length) sk.push(s.thieuNK.length + ' xưởng có ngày làm không ghi nhật ký');
  if (s.choTong) sk.push(s.choTong + ' dòng chờ duyệt quá 2 ngày');
  if (s.laTong) sk.push(s.laTong + ' dòng số lượng bất thường (gấp ≥ 3 lần thường ngày)');
  if (s.tuongLai) sk.push(s.tuongLai + ' dòng ghi ngày tương lai');
  h += '<li>Sức khỏe dữ liệu: ' + (sk.length ? sk.join(' · ') : 'không có gì bất thường') + '</li>';
  if (d.dem.some(function(p) { return !p.daAp; })) h += '<li><b>Chưa áp cách đếm Claude đề xuất</b> (Phôi Carbon / Sơn / In UV) – xem Việc hôm nay.</li>';
  return h + '</ul>';
}
