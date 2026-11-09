/* ================== CẤU HÌNH GẬY – BẢN VẼ KỸ THUẬT (08/11) ==================
   Tab riêng "Cấu hình gậy": mỗi dòng gậy (dùng chung danh sách với Đơn hàng › Cấu hình sản phẩm) có một bộ thông số
   kích thước / vật liệu đầy đủ; trình duyệt tự vẽ bản vẽ (hình ngoài, mặt cắt, chi tiết joint + đuôi) và xuất PDF.
   TÀI LIỆU MẬT – chỉ 4 mã nhân viên (chủ dự án chốt 08/11):
     C019 + C056 (sửa + DUYỆT, được tự duyệt), C077 + C067 (sửa) – chủ dự án đổi 09/11.
   Luồng: C077 lưu -> bản "Chờ duyệt" (mỗi dòng gậy giữ tối đa 1 bản chờ, lưu lại là thay) -> C019 duyệt -> thành bản hiệu lực
   (số phiên bản tăng, bản hiệu lực cũ chuyển "Bản cũ" – vẫn xem / tải lại được) hoặc từ chối kèm lý do.
   Sheet CauHinhGay (ẩn): Id, MaDong, PhienBan, TrangThai, DuLieu(JSON), NguoiLuu, ThoiDiemLuu, GhiChu, NguoiDuyet, ThoiDiemDuyet, LyDo.
   Mỗi lần tải PDF ghi Nhật ký thao tác (PDF có dấu chìm tên người tải + giờ). */
var CG_SHEET = 'CauHinhGay';
var CG_COT = ['Id', 'MaDong', 'PhienBan', 'TrangThai', 'DuLieu', 'NguoiLuu', 'ThoiDiemLuu', 'GhiChu', 'NguoiDuyet', 'ThoiDiemDuyet', 'LyDo'];
var CG_QUYEN = { C056: 'duyet', C019: 'duyet', C077: 'sua', C067: 'sua' };   // 09/11 (chủ dự án): cả 4 sửa được; C019 + C056 duyệt (được tự duyệt bản mình lưu)
var CG_MAX_JSON = 40000;
/* Trường được lưu (đường dẫn -> 'n' số | 's' chữ) – khớp CG_TRUONG ở CauHinhGay.html (va-cau-hinh-gay-web.py kiểm khớp khi dựng) */
var CG_KHOA = {"ngon.tip.d": "n", "ngon.tip.h": "n", "ngon.tip.vl": "s", "ngon.pad.h": "n", "ngon.pad.vl": "s", "ngon.ferrule.h": "n", "ngon.ferrule.vl": "s", "ngon.ferrule.tenonD": "n", "ngon.ferrule.tenonL": "n", "ngon.ong.vl": "s", "ngon.ong.loi": "s", "ngon.ong.day": "n", "ngon.ong.dai": "n", "ngon.ong.dDau": "n", "ngon.ong.proDai": "n", "ngon.ong.dPro": "n", "ngon.ong.dJoint": "n", "ngon.ong.nutTruoc": "n", "ngon.ong.nutSau": "n", "ngon.ong.nutVl": "s", "ngon.collar.d": "n", "ngon.collar.h": "n", "ngon.collar.vl": "s", "ngon.insert.d": "n", "ngon.insert.l": "n", "ngon.insert.vl": "s", "ngon.insert.ren": "s", "chuoi.collar.d": "n", "chuoi.collar.h": "n", "chuoi.collar.vl": "s", "chuoi.pin.ren": "s", "chuoi.pin.d": "n", "chuoi.pin.tho": "n", "chuoi.pin.chon": "n", "chuoi.pin.buoc": "n", "chuoi.pin.kieu": "s", "chuoi.pin.vl": "s", "chuoi.kieu": "s", "chuoi.soKhuc": "n", "chuoi.forearm.dai": "n", "chuoi.forearm.dDau": "n", "chuoi.forearm.dCuoi": "n", "chuoi.forearm.vl": "s", "chuoi.vo.day": "n", "chuoi.wrap.dai": "n", "chuoi.wrap.dDau": "n", "chuoi.wrap.dCuoi": "n", "chuoi.wrap.vl": "s", "chuoi.sleeve.dai": "n", "chuoi.sleeve.dDau": "n", "chuoi.sleeve.dCuoi": "n", "chuoi.sleeve.vl": "s", "chuoi.veneer.h": "n", "chuoi.veneer.vl": "s", "chuoi.khoiPin.d": "n", "chuoi.khoiPin.l": "n", "chuoi.khoiPin.vl": "s", "chuoi.loi.tren": "s", "chuoi.loi.duoi": "s", "chuoi.thanhNoi.d": "n", "chuoi.thanhNoi.l": "n", "chuoi.thanhNoi.vl": "s", "chuoi.vien.h": "n", "chuoi.vien.vl": "s", "chuoi.khoiCan.dai": "n", "chuoi.khoiCan.vt": "n", "chuoi.khoiCan.vl": "s", "chuoi.noi.dai": "n", "chuoi.noi.ren": "s", "chuoi.noi.pinD": "n", "chuoi.noi.tho": "n", "chuoi.noi.chon": "n", "chuoi.noi.insD": "n", "chuoi.noi.vl": "s", "chuoi.cap.h": "n", "chuoi.cap.d": "n", "chuoi.cap.vl": "s", "chuoi.bumper.h": "n", "chuoi.bumper.d": "n", "chuoi.bumper.vl": "s", "chuoi.ongCan.d": "n", "chuoi.ongCan.dai": "n", "chuoi.ongCan.vl": "s", "chuoi.ongCan.ren": "s", "chuoi.qua.so": "n", "chuoi.qua.d": "n", "chuoi.qua.dai": "n", "chuoi.qua.vl": "s", "chuoi.bumper.renL": "n", "chuoi.forearm.tenonD": "n", "chuoi.forearm.tenonL": "n", "chuoi.khoang.d": "n", "chuoi.khoang.sau": "n", "chuoi.bolt.ren": "s", "chuoi.bolt.dai": "n", "chuoi.bolt.dauD": "n", "chung.khoiMin": "n", "chung.khoiMax": "n", "chung.khoiNgon": "n", "chung.canBang": "n", "chung.ghiChu": "s"};

/* Quyền của 1 phiên: '' | 'xem' | 'sua' | 'duyet'. Chủ sở hữu luôn xem được (kể cả khi mã NV trên tài khoản để trống). */
function cgQuyenCua_(me) {
  if (!me) return '';
  var ma = String(me.maNV || '').trim().toUpperCase(), q = CG_QUYEN[ma] || '';
  if (!q) return '';
  /* mã NV phải gắn với đúng 1 tài khoản đang dùng (chặn tạo tài khoản khác trùng mã để chiếm quyền) */
  var n = doc_('TaiKhoan').filter(function(t) { return String(t.MaNV || '').trim().toUpperCase() === ma && String(t.TrangThai).trim() === 'Đang dùng'; }).length;
  return n === 1 ? q : '';
}
function cgQuyen_(token, can) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  var q = cgQuyenCua_(me);
  var duoc = !can || q === can || (can === 'sua' && q === 'duyet');   // người duyệt cũng sửa được
  if (!q || !duoc) return { loi: sach_({ ok: false, msg: can === 'sua' ? 'Tài khoản không được lưu thông số.' : can === 'duyet' ? 'Chỉ C019 hoặc C056 được duyệt.' : 'Tài khoản không xem được Cấu hình gậy.' }) };
  return { me: me, q: q };
}
function cgSheet_() {
  var sh = ss_().getSheetByName(CG_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(CG_SHEET);
    sh.getRange(1, 1, 1, CG_COT.length).setValues([CG_COT]).setFontWeight('bold'); sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, CG_COT.length).setNumberFormat('@');
    try { sh.hideSheet(); } catch (e) {}
  }
  return sh;
}
function cgDoc_() { return ss_().getSheetByName(CG_SHEET) ? doc_(CG_SHEET) : []; }
function cgLuc_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function cgTimDong_(ma) {
  plNapThem_();
  for (var i = 0; i < PL_DONG.length; i++) if (PL_DONG[i][0] === ma) return PL_DONG[i];
  return null;
}

/* Danh sách dòng gậy + trạng thái bản vẽ (không kèm thông số – nhẹ) */
function layDsCauHinhGay(token) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  plNapThem_();
  var rows = cgDoc_(), tt = {};
  rows.forEach(function(r) {
    var m = String(r.MaDong), o = tt[m] = tt[m] || { pb: 0, cho: false, luc: '' };
    if (r.TrangThai === 'Hiệu lực') { o.pb = Number(r.PhienBan) || 0; o.luc = String(r.ThoiDiemDuyet || ''); }
    if (r.TrangThai === 'Chờ duyệt' && Q.q !== 'xem') o.cho = true;
  });
  var ds = PL_DONG.filter(function(d) { return !(PL_AN.DONG && PL_AN.DONG[d[0]]); }).map(function(d) {
    var o = plKieu_({ loai: d[2], chuoi: d[4], ngon: d[5] }), t = tt[d[0]] || { pb: 0, cho: false, luc: '' };
    return { ma: d[0], ten: d[1], loai: d[2], kieu: o.kieu, vlC: o.vlC, vlN: o.vlN, chuoi: d[4], ngon: d[5], tip: d[6], ren: d[7],
      tenChuoi: PL_CHUOI[d[4]] || d[4] || '', tenNgon: PL_NGON[d[5]] || d[5] || '', tenTip: PL_TIP[d[6]] || d[6] || '', tenRen: PL_REN[d[7]] || d[7] || '',
      pb: t.pb, cho: t.cho, luc: t.luc };
  });
  return sach_({ ok: true, quyen: Q.q, ds: ds, ten: (Q.me.hoTen || Q.me.ten || Q.me.tk), tk: Q.me.tk, maNV: Q.me.maNV || '' });
}

/* Bản vẽ của 1 dòng gậy: bản hiệu lực + bản chờ duyệt + lịch sử (không kèm dữ liệu các bản cũ) */
function layCauHinhGay(token, ma, phienBan) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  var d = cgTimDong_(ma); if (!d) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var rows = cgDoc_().filter(function(r) { return String(r.MaDong) === ma; });
  var gon = function(r) { return r ? { id: r.Id, pb: Number(r.PhienBan) || 0, tt: r.TrangThai, nguoi: r.NguoiLuu, luc: r.ThoiDiemLuu, ghiChu: r.GhiChu, duyet: r.NguoiDuyet, lucDuyet: r.ThoiDiemDuyet, lyDo: r.LyDo } : null; };
  var json = function(r) { try { return r && r.DuLieu ? JSON.parse(r.DuLieu) : null; } catch (e) { return null; } };
  var hl = rows.filter(function(r) { return r.TrangThai === 'Hiệu lực'; })[0];
  var cho = Q.q === 'xem' ? null : rows.filter(function(r) { return r.TrangThai === 'Chờ duyệt'; })[0];   // người chỉ xem: chỉ thấy bản đã duyệt
  if (Q.q === 'xem') rows = rows.filter(function(r) { return r.TrangThai !== 'Chờ duyệt'; });
  try { var ck = 'CGX_' + Q.me.tk + '_' + ma, cc = CacheService.getScriptCache(); if (!cc.get(ck)) { cc.put(ck, '1', 21600); ghiLog_(Q.me, 'Xem cấu hình gậy', ma, '', phienBan ? 'bản ' + String(phienBan).slice(0, 12) : ''); } } catch (e) {}
  var xem = phienBan ? rows.filter(function(r) { return Number(r.PhienBan) === Number(phienBan) && r.TrangThai !== 'Chờ duyệt' && r.TrangThai !== 'Từ chối'; })[0] : null;
  var o = plKieu_({ loai: d[2], chuoi: d[4], ngon: d[5] });
  return sach_({ ok: true, quyen: Q.q,
    dong: { ma: d[0], ten: d[1], loai: d[2], kieu: o.kieu, vlC: o.vlC, vlN: o.vlN, chuoi: d[4], ngon: d[5], tip: d[6], ren: d[7],
      tenChuoi: PL_CHUOI[d[4]] || d[4] || '', tenNgon: PL_NGON[d[5]] || d[5] || '', tenTip: PL_TIP[d[6]] || d[6] || '', tenRen: PL_REN[d[7]] || d[7] || '' },
    hieuLuc: hl ? { tt: gon(hl), dl: json(hl) } : null,
    choDuyet: cho ? { tt: gon(cho), dl: json(cho) } : null,
    xem: xem ? { tt: gon(xem), dl: json(xem) } : null,
    lichSu: rows.map(gon).sort(function(a, b) { return String(b.luc).localeCompare(String(a.luc)); }).slice(0, 40) });
}

/* Lọc dữ liệu thông số theo CG_KHOA: chỉ giữ trường đã biết, đúng kiểu, số trong khoảng hợp lý.
   Trả { loi } hoặc { dl } (object mới – không mang khóa lạ như __proto__ / constructor). */
function cgLoc_(dl) {
  if (!dl || typeof dl !== 'object' || Array.isArray(dl)) return { loi: 'Dữ liệu không hợp lệ.' };
  if (JSON.stringify(dl).length > CG_MAX_JSON) return { loi: 'Dữ liệu quá lớn.' };
  var ra = { daDo: {} }, loi = '';
  var dat = function(p, v) { var k = p.split('.'), o = ra; for (var i = 0; i < k.length - 1; i++) { if (!Object.prototype.hasOwnProperty.call(o, k[i])) o[k[i]] = {}; o = o[k[i]]; } o[k[k.length - 1]] = v; };
  var lay = function(p) { return p.split('.').reduce(function(o, k) { return (o && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k)) ? o[k] : undefined; }, dl); };
  Object.keys(CG_KHOA).forEach(function(p) {
    if (loi) return; var v = lay(p);
    if (v === undefined || v === null || v === '') return;
    if (CG_KHOA[p] === 'n') { if (typeof v !== 'number' || !isFinite(v) || v < 0 || v > 5000) { loi = 'Số không hợp lệ ở ' + p; return; } dat(p, v); }
    else { if (typeof v !== 'string' || v.length > 120) { loi = 'Chữ không hợp lệ ở ' + p; return; } dat(p, v.replace(/[\u0000-\u001f]/g, ' ')); }
  });
  if (loi) return { loi: loi };
  var dd = dl.daDo;
  if (dd && typeof dd === 'object' && !Array.isArray(dd)) Object.keys(dd).forEach(function(k) { var p = k.replace(/__/g, '.'); if (Object.prototype.hasOwnProperty.call(CG_KHOA, p) && dd[k]) ra.daDo[k] = 1; });
  return { dl: ra };
}
/* C077 lưu -> bản chờ duyệt (thay bản đang chờ của dòng đó nếu có) */
function luuCauHinhGay(token, ma, dl, ghiChu) {
  var Q = cgQuyen_(token, 'sua'); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  if (!cgTimDong_(ma)) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var L = cgLoc_(dl); if (L.loi) return sach_({ ok: false, msg: L.loi });
  dl = L.dl;
  khoa_(); cgSheet_(); xoaCache_(CG_SHEET);
  var rows = cgDoc_().filter(function(r) { return String(r.MaDong) === ma; });
  var sh = ss_().getSheetByName(CG_SHEET);
  rows.filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).map(function(r) { return r._row; }).sort(function(a, b) { return b - a; })
    .forEach(function(r) { sh.deleteRow(r); });
  xoaCache_(CG_SHEET);
  var pbMax = rows.filter(function(r) { return r.TrangThai !== 'Chờ duyệt'; }).reduce(function(m, r) { return Math.max(m, Number(r.PhienBan) || 0); }, 0);   // lưu lại khi đang chờ: giữ số bản
  var gc = String(ghiChu || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  them_(CG_SHEET, { Id: 'CG' + new Date().getTime() + '-' + Utilities.getUuid().slice(0, 6), MaDong: ma, PhienBan: String(pbMax + 1), TrangThai: 'Chờ duyệt',
    DuLieu: JSON.stringify(dl), NguoiLuu: Q.me.tk, ThoiDiemLuu: cgLuc_(), GhiChu: chuAnToan_(gc), NguoiDuyet: '', ThoiDiemDuyet: '', LyDo: '' });
  ghiLog_(Q.me, 'Lưu cấu hình gậy (chờ duyệt)', ma, '', 'bản ' + (pbMax + 1) + (gc ? ' – ' + gc.slice(0, 100) : ''));
  return sach_({ ok: true, msg: 'Đã lưu bản ' + (pbMax + 1) + ' – chờ Giám đốc sản xuất duyệt.' });
}

/* C019 duyệt / từ chối bản chờ */
function duyetCauHinhGay(token, id, dongY, lyDo) {
  var Q = cgQuyen_(token, 'duyet'); if (Q.loi) return Q.loi;
  id = String(id || '').slice(0, 40); lyDo = String(lyDo || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  if (!dongY && !lyDo) return sach_({ ok: false, msg: 'Ghi lý do từ chối để người đo biết cần sửa gì.' });
  khoa_(); xoaCache_(CG_SHEET);
  var rows = cgDoc_(), r = rows.filter(function(x) { return x.Id === id; })[0];
  if (!r || r.TrangThai !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Bản này không còn chờ duyệt (có thể đã được lưu lại bản mới).' });
  var sh = ss_().getSheetByName(CG_SHEET), cTT = CG_COT.indexOf('TrangThai') + 1, cND = CG_COT.indexOf('NguoiDuyet') + 1, luc = cgLuc_();
  if (dongY) rows.filter(function(x) { return x.MaDong === r.MaDong && x.TrangThai === 'Hiệu lực'; }).forEach(function(x) { sh.getRange(x._row, cTT).setValue('Bản cũ'); });
  sh.getRange(r._row, cTT).setValue(dongY ? 'Hiệu lực' : 'Từ chối');
  sh.getRange(r._row, cND, 1, 3).setValues([[Q.me.tk, luc, chuAnToan_(lyDo)]]);
  xoaCache_(CG_SHEET);
  ghiLog_(Q.me, dongY ? 'Duyệt cấu hình gậy' : 'Từ chối cấu hình gậy', r.MaDong, '', 'bản ' + r.PhienBan + ' của ' + r.NguoiLuu + (lyDo ? ' – ' + lyDo.slice(0, 100) : ''));
  return sach_({ ok: true, msg: dongY ? 'Đã duyệt – bản ' + r.PhienBan + ' có hiệu lực.' : 'Đã từ chối, người đo sẽ thấy lý do.' });
}

/* Ghi nhật ký mỗi lần tải PDF (gọi trước khi trình duyệt tạo file); trả tên + giờ để in dấu chìm */
function ghiTaiPdfCauHinhGay(token, ma, phienBan) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  if (!cgTimDong_(ma)) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var luc = cgLuc_();
  ghiLog_(Q.me, 'Tải PDF cấu hình gậy', ma, '', 'bản ' + String(phienBan || 'mẫu').slice(0, 12));
  return sach_({ ok: true, nguoi: String(Q.me.hoTen || Q.me.ten || Q.me.tk), tk: Q.me.tk, maNV: Q.me.maNV || '', luc: luc });
}

/* Việc hôm nay của Giám đốc SX: số bản chờ duyệt */
function demCauHinhGayCho(token) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  var ds = cgDoc_().filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).map(function(r) { return { ma: r.MaDong, pb: r.PhienBan, nguoi: r.NguoiLuu, luc: r.ThoiDiemLuu }; });
  return sach_({ ok: true, quyen: Q.q, n: ds.length, ds: ds.slice(0, 10) });
}
