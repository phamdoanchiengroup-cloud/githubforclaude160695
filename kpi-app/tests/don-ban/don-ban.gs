/* ===== 16/11 khuya (chủ dự án chốt) – GIAI ĐOẠN 1: BÁN HÀNG NHẬP ĐƠN → BAN ĐIỀU HÀNH DUYỆT → WEB CHÉP VÀO SHEET ĐƠN =====
   - Vai trò mới BH (Bán hàng): chủ sở hữu tạo hàng loạt từ danh sách nhân sự Kinh doanh / Marketing (taoTaiKhoanBH), toàn quyền
     khóa / cấp lại mật khẩu ở tab Tài khoản như mọi tài khoản. BH chỉ thấy tab "Đơn hàng của tôi" (mảnh DonBan.html).
   - Đơn lưu ở tab DonBan của Sheet "CSDL Đơn hàng (web)" (huy-don.gs, dhhSS_). Dòng sản phẩm = JSON trong 1 ô.
     Trạng thái: CHO_DUYET → DA_DUYET | TRA_VE (BH sửa, gửi lại) | TU_CHOI; BH xóa đơn chưa duyệt = DA_XOA.
   - Người duyệt = dhCoHuy_ (C019 / C056 / C067 + chủ sở hữu): chốt deadline + tùy chọn ★ ưu tiên cả đơn, hoặc trả về / từ chối (lý do).
     Duyệt -> ghi các dòng vào CUỐI tab kênh của Sheet "Trạng thái đơn hàng" (mã đơn, tên SP, SL, deadline, note), chép công thức
     của dòng mẫu (dòng cuối) sang các cột còn lại; không ghi nếu mã đơn đã có trong tab.
   - BH chỉ thấy đơn của chính mình (+ tiến độ: % xong, mã bị hủy / bớt). Kiểm thử: tests/don-ban.js */
var DB_COT = ['Id', 'MaDon', 'Tab', 'DeadlineMuon', 'GhiChu', 'Dong', 'NguoiTao', 'Tk', 'MaNV', 'LucTao', 'LucGui', 'TrangThai', 'PhienBan',
  'NguoiDuyet', 'TkDuyet', 'LucDuyet', 'DeadlineChot', 'UuTien', 'LyDo', 'DongSheet', 'Lenh'];
DHH_COT.DonBan = DB_COT;
var DB_DONG_MAX = 50, DB_TEN_MAX = 120, DB_GC_MAX = 300, DB_SL_MAX = 100000, DB_GIO_MAX = 40, DB_WEB_MAX = 300;
var DB_NHOM_BH = /^(Kinh doanh|Marketing)$/i, DB_NHOM_GOI_Y = /Kinh doanh|Sàn TMĐT|CSKH|Website/i;   // gợi ý tick sẵn: Kinh doanh + Marketing (Sàn TMĐT, CSKH, Website)
function dbLaBH_(me) { return !!me && me.vaiTro === 'BH'; }
function dbQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  var duyet = false; try { duyet = dhCoHuy_(me); } catch (e) {}
  if (!dbLaBH_(me) && !duyet) return { loi: sach_({ ok: false, msg: 'Trang này dành cho Bán hàng và người duyệt đơn (C019 / C056 / C067).' }) };
  return { me: me, bh: dbLaBH_(me), duyet: duyet };
}
function dbChu_(v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n); }
function dbSo_(v) { var s = String(v == null ? '' : v).replace(/\s+/g, ''); if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, ''); var n = Number(s); return isFinite(n) ? n : NaN; }   // "1.000" / "1,000" = một nghìn
function dbKenh_() {
  var ds = DH_TABS.map(function(t) { return [t, DH_NHAN_TAB[t] || t]; });
  try { (dhDocDonGoc_(false).tabMoi || []).forEach(function(t) { ds.push([t, t]); }); } catch (e) {}
  return ds;
}
function dbDoc_(ss) { return dhhDoc_(ss, 'DonBan').map(function(r) { var d = []; try { d = JSON.parse(r.Dong || '[]'); } catch (e) {} r._d = Array.isArray(d) ? d : []; return r; }); }
function dbWeb_(r, tienDo) {
  var o = { id: r.Id, maDon: r.MaDon, tab: r.Tab, kenh: DH_NHAN_TAB[r.Tab] || r.Tab, dlMuon: r.DeadlineMuon, ghiChu: r.GhiChu, dong: r._d, ai: r.NguoiTao, luc: r.LucGui || r.LucTao,
    tt: r.TrangThai, pb: Number(r.PhienBan) || 1, duyetAi: r.NguoiDuyet, duyetLuc: r.LucDuyet, dlChot: r.DeadlineChot, uu: r.UuTien === '1' ? 1 : 0, ly: r.LyDo,
    tongSL: r._d.reduce(function(a, x) { return a + (Number(x.sl) || 0); }, 0) };
  if (tienDo) o.td = tienDo;
  return o;
}
/* Tiến độ đơn đã duyệt: cộng các dòng cùng tab + mã đơn trong dữ liệu đơn (đã áp hủy / bớt) */
function dbTienDo_(d, r) {
  var ds = (d.don || []).filter(function(o) { return !o.phu && o.tab === r.Tab && String(o.maDon || '') === String(r.MaDon); });
  var sl = 0, thieu = 0, dung = []; ds.forEach(function(o) { sl += o.sl || 0; thieu += o.thieu || 0; if (o.dung && o.thieu > 0) dung.push({ ten: o.ten, thieu: o.thieu, ly: o.dung.ly, luc: o.dung.luc, hen: o.dung.hen }); });   // 17/11: mã TẠM DỪNG
  var phu = (d.phuDs || []).filter(function(x) { return x.TrangThai === 'HIEU_LUC' && x.Tab === r.Tab && x.MaDon === r.MaDon; })
    .map(function(x) { return { ten: x.Ten, loai: x.Loai, slCu: dhhSo_(x.SLCu), slMoi: dhhSo_(x.SLMoi), ly: x.LyDo }; });
  return { n: ds.length, sl: sl, thieu: thieu, pct: sl ? Math.round((sl - thieu) / sl * 100) : (phu.length ? 0 : 100), huy: phu, dung: dung, khongThay: !ds.length && !phu.length ? 1 : 0 };
}
/* Trang "Đơn hàng của tôi": BH = đơn của mình; người duyệt = mọi đơn (chờ duyệt trên cùng) */
function layDonBan(token) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  var ss = dhhSS_(false), ds = ss ? dbDoc_(ss) : [], tk = String(q.me.tk || '');
  ds = ds.filter(function(r) { return r.TrangThai !== 'DA_XOA' && (q.duyet || r.Tk === tk); });
  var d = null; try { d = dhDocDon_(false); } catch (e) {}
  var sp = {}, tongThieu = 0;
  if (d) (d.don || []).forEach(function(o) { if (o.phu) return; if (o.ten) sp[o.ten] = 1; tongThieu += o.thieu || 0; });
  var thu = { CHO_DUYET: 0, TRA_VE: 1, DA_DUYET: 2, TU_CHOI: 3 };
  ds.sort(function(a, b) { return (thu[a.TrangThai] - thu[b.TrangThai]) || String(b.LucGui || b.LucTao).localeCompare(String(a.LucGui || a.LucTao)); });
  var out = ds.slice(0, DB_WEB_MAX).map(function(r) { return dbWeb_(r, r.TrangThai === 'DA_DUYET' && d ? dbTienDo_(d, r) : null); });
  try { dbkGanDuKien_(out, d); } catch (eK) {}
  var dn = []; try { dn = dbtDsDN_(q); } catch (eN) {}   // 17/11 khuya: đề nghị ưu tiên (thu-don.gs)   // 17/11: ngày dự kiến xong (mô phỏng công suất + 2 ngày làm dự phòng) – du-kien.gs
  return sach_({ ok: true, ds: out, bh: q.bh ? 1 : 0, duyet: q.duyet ? 1 : 0, owner: q.me.laOwner ? 1 : 0, ten: q.me.ten || '', kenh: dbKenh_(),
    sp: Object.keys(sp).sort().slice(0, 3000), csNgay: DH_CS_MAC, tongThieu: q.duyet ? tongThieu : null, hom: homNayVN_(), dn: dn, lanTxt: dhLanTxt_() });
}
function dbKiemDon_(p) {   // -> { loi } | { don }
  p = p || {};
  var maDon = dbChu_(p.maDon, 60), tab = dbChu_(p.tab, 60), dl = String(p.dl || '').trim(), gc = dbChu_(p.ghiChu, DB_GC_MAX);
  if (!maDon || !dhLaMa_(maDon) || /^[=+\-@]/.test(maDon)) return { loi: 'Mã đơn chưa đúng (vd #RHINO-17/11, tối đa 4 chữ).' };
  var kenh = dbKenh_().map(function(k) { return k[0]; });
  if (kenh.indexOf(tab) < 0 || DH_TAB_LOAI.test(tab)) return { loi: 'Chọn kênh của đơn.' };
  if (dl && !dhNgayThat_(dl)) return { loi: 'Deadline mong muốn không hợp lệ.' };
  if (dl && dl < homNayVN_()) return { loi: 'Deadline mong muốn đã qua.' };
  var dong = Array.isArray(p.dong) ? p.dong : [];
  if (!dong.length) return { loi: 'Đơn chưa có sản phẩm nào.' };
  if (dong.length > DB_DONG_MAX) return { loi: 'Một đơn tối đa ' + DB_DONG_MAX + ' mã sản phẩm – tách thành 2 đơn.' };
  var ra = [];
  for (var i = 0; i < dong.length; i++) {
    var x = dong[i] || {}, ten = dbChu_(x.ten, DB_TEN_MAX), sl = dbSo_(x.sl), g = dbChu_(x.gc, DB_GC_MAX);
    if (!ten) return { loi: 'Dòng ' + (i + 1) + ': thiếu tên sản phẩm.' };
    if (/^[=+\-@]/.test(ten)) return { loi: 'Dòng ' + (i + 1) + ': tên sản phẩm không được bắt đầu bằng = + - @.' };
    if (!(sl >= 1 && sl <= DB_SL_MAX && Math.floor(sl) === sl)) return { loi: 'Dòng ' + (i + 1) + ' (' + ten + '): SL phải là số nguyên từ 1.' };
    ra.push({ ten: ten, sl: sl, gc: g });
  }
  return { don: { MaDon: maDon, Tab: tab, DeadlineMuon: dl, GhiChu: gc, Dong: ra } };
}
function dbKhoa_() { var l = LockService.getScriptLock(); l.waitLock(20000); return l; }
function dbRate_(ss, tk) { var moc = Utilities.formatDate(new Date(new Date().getTime() - 3600000), TZ_VN, 'yyyy-MM-dd HH:mm:ss'); return dhhDoc_(ss, 'SuKien').filter(function(r) { return r.Tk === tk && r.Luc >= moc; }).length < DB_GIO_MAX; }
function dbSuKien_(ss, me, tt, id, ct, lenh) { dhhThem_(ss, 'SuKien', [{ Luc: dhhGio_(), Ai: String(me.ten || me.tk || '').slice(0, 60), Tk: String(me.tk || ''), MaNV: String(me.maNV || ''), ThaoTac: tt, Id: id, MaDong: '', ChiTiet: JSON.stringify(ct || {}).slice(0, 4000), Lenh: lenh || '' }]); }
/* Bán hàng (hoặc người duyệt) gửi đơn mới / sửa đơn bị trả về rồi gửi lại. p = { id?, pb?, maDon, tab, dl, ghiChu, dong:[{ten, sl, gc}], lenh } */
function luuDonBan(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  var k = dbKiemDon_(p); if (k.loi) return sach_({ ok: false, msg: k.loi });
  var lenh = dhhLenh_(p), cache = CacheService.getScriptCache(), l;
  if (lenh) { try { var c0 = cache.get('DB_L_' + lenh); if (c0) return sach_(JSON.parse(c0)); } catch (e) {} }
  try { l = dbKhoa_(); } catch (e) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    if (lenh) { try { var c1 = cache.get('DB_L_' + lenh); if (c1) return sach_(JSON.parse(c1)); } catch (e) {} }
    var ss = dhhSS_(true), tk = String(q.me.tk || ''), ds = dbDoc_(ss), gio = dhhGio_();
    if (!dbRate_(ss, tk)) return sach_({ ok: false, msg: 'Bạn đã thao tác ' + DB_GIO_MAX + ' lần trong 1 giờ – thử lại sau.' });
    var trung = ds.filter(function(r) { return r.MaDon === k.don.MaDon && r.Tab === k.don.Tab && r.Id !== String(p.id || '') && ['CHO_DUYET', 'DA_DUYET', 'TRA_VE'].indexOf(r.TrangThai) >= 0; })[0];
    if (trung) return sach_({ ok: false, msg: 'Mã đơn ' + k.don.MaDon + ' (' + (DH_NHAN_TAB[k.don.Tab] || k.don.Tab) + ') đã có trên web (' + trung.NguoiTao + ') – đặt mã khác.' });
    try { if (dhDocDonGoc_(false).don.some(function(o) { return !o.phu && o.tab === k.don.Tab && String(o.maDon || '') === k.don.MaDon; })) return sach_({ ok: false, msg: 'Mã đơn ' + k.don.MaDon + ' đã có trong Sheet tab ' + k.don.Tab + ' – đặt mã khác.' }); } catch (e) {}
    var row = { MaDon: k.don.MaDon, Tab: k.don.Tab, DeadlineMuon: k.don.DeadlineMuon, GhiChu: k.don.GhiChu, Dong: JSON.stringify(k.don.Dong), LucGui: gio, TrangThai: 'CHO_DUYET', LyDo: '' }, kq;
    if (p.id) {
      var cu = ds.filter(function(r) { return r.Id === String(p.id); })[0];
      if (!cu || (cu.Tk !== tk && !q.duyet)) return sach_({ ok: false, msg: 'Không tìm thấy đơn của bạn.' });
      if (['CHO_DUYET', 'TRA_VE'].indexOf(cu.TrangThai) < 0) return sach_({ ok: false, msg: 'Đơn đã ' + (cu.TrangThai === 'DA_DUYET' ? 'được duyệt' : 'đóng') + ' – không sửa được.' });
      if (p.pb != null && Number(p.pb) !== (Number(cu.PhienBan) || 1)) return sach_({ ok: false, cu: true, msg: 'Đơn vừa thay đổi ở chỗ khác – tải lại rồi sửa.' });
      row.PhienBan = (Number(cu.PhienBan) || 1) + 1; dhhSua_(ss, 'DonBan', cu._row, row);
      dbSuKien_(ss, q.me, 'DB_GUI_LAI', cu.Id, { ma: row.MaDon, n: k.don.Dong.length }, lenh);
      kq = { ok: true, id: cu.Id, msg: 'Đã gửi lại đơn ' + row.MaDon + ' – chờ duyệt.' };
    } else {
      row.Id = 'B' + Utilities.getUuid().replace(/-/g, '').slice(0, 12); row.NguoiTao = String(q.me.ten || tk).slice(0, 60); row.Tk = tk; row.MaNV = String(q.me.maNV || ''); row.LucTao = gio; row.PhienBan = 1; row.Lenh = lenh;
      dhhThem_(ss, 'DonBan', [row]);
      dbSuKien_(ss, q.me, 'DB_GUI', row.Id, { ma: row.MaDon, tab: row.Tab, n: k.don.Dong.length }, lenh);
      kq = { ok: true, id: row.Id, msg: 'Đã gửi đơn ' + row.MaDon + ' (' + k.don.Dong.length + ' mã) – chờ Giám đốc / Phó GĐ duyệt.' };
    }
    if (lenh) { try { cache.put('DB_L_' + lenh, JSON.stringify(kq), 600); } catch (e) {} }
    return sach_(kq);
  } finally { l.releaseLock(); }
}
/* Bán hàng xóa đơn CHƯA duyệt của mình */
function xoaDonBan(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  var l; try { l = dbKhoa_(); } catch (e) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    var ss = dhhSS_(false); if (!ss) return sach_({ ok: false, msg: 'Không tìm thấy đơn.' });
    var r = dbDoc_(ss).filter(function(x) { return x.Id === String(p && p.id || ''); })[0];
    if (!r || r.Tk !== String(q.me.tk || '')) return sach_({ ok: false, msg: 'Không tìm thấy đơn của bạn.' });
    if (['CHO_DUYET', 'TRA_VE', 'TU_CHOI'].indexOf(r.TrangThai) < 0) return sach_({ ok: false, msg: 'Đơn đã duyệt – muốn hủy thì báo Giám đốc / Phó GĐ hủy trên bảng đơn.' });
    dhhSua_(ss, 'DonBan', r._row, { TrangThai: 'DA_XOA' }); dbSuKien_(ss, q.me, 'DB_XOA', r.Id, { ma: r.MaDon });
    return sach_({ ok: true, msg: 'Đã xóa đơn ' + r.MaDon + '.' });
  } finally { l.releaseLock(); }
}
/* Ghi các dòng của đơn vào cuối tab kênh (Sheet "Trạng thái đơn hàng"). Trả về [số dòng đầu, số dòng] */
function dbGhiSheet_(r, dlChot) {
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), sh = dhTabGhi_(ss, r.Tab);
  if (!sh || DH_TAB_LOAI.test(String(sh.getName()).trim())) throw new Error('không thấy tab kênh "' + r.Tab + '"');
  var meta = dhMetaTab_(sh, r.Tab); if (!meta || !(meta.ten >= 0) || !(meta.sl >= 0)) throw new Error('tab "' + r.Tab + '" chưa có cột "Loại hàng" / "Số lượng đặt"');
  var last = sh.getLastRow();
  if (last > meta.hdr && sh.getRange(meta.hdr + 1, 1, last - meta.hdr, 1).getValues().some(function(x) { return String(x[0] == null ? '' : x[0]).trim() === r.MaDon; }))
    throw new Error('mã đơn ' + r.MaDon + ' đã có trong tab ' + r.Tab);
  var dong = r._d, ghiCot = [0, meta.ten, meta.sl], cDl = meta.dl >= 0 ? meta.dl : -1, cNote = meta.phoi >= 0 ? meta.phoi : -1, cThieu = meta.thieu >= 0 ? meta.thieu : -1;
  if (cDl >= 0) ghiCot.push(cDl); if (cNote >= 0) ghiCot.push(cNote);
  var ncMau = Math.min(Math.max(sh.getLastColumn(), 1), 60), mau = [];
  try { if (last > meta.hdr) mau = sh.getRange(last, 1, 1, ncMau).getFormulasR1C1()[0]; } catch (e) { mau = []; }
  if (cThieu >= 0 && !(mau[cThieu] && /^=/.test(String(mau[cThieu])))) ghiCot.push(cThieu);
  var nc = Math.max.apply(null, ghiCot) + 1, dlTxt = dlChot ? "'" + dlChot.slice(8, 10) + '/' + dlChot.slice(5, 7) + '/' + dlChot.slice(0, 4) : '';
  var vals = dong.map(function(x) {
    var v = []; for (var j = 0; j < nc; j++) v.push('');
    v[0] = r.MaDon; v[meta.ten] = chuAnToan_(x.ten); v[meta.sl] = x.sl;
    if (cDl >= 0) v[cDl] = dlTxt;
    if (cNote >= 0) v[cNote] = chuAnToan_([x.gc, r.GhiChu ? 'Đơn: ' + r.GhiChu : ''].filter(Boolean).join(' · ').slice(0, 500));
    if (ghiCot.indexOf(cThieu) >= 0 && cThieu >= 0) v[cThieu] = x.sl;
    return v;
  });
  var dau = last + 1;
  try {
    sh.getRange(dau, 1, vals.length, nc).setValues(vals);
    mau.forEach(function(f, j) {   // chép công thức của dòng mẫu (vd SX CÒN THIẾU, CÓ THỂ GIAO) sang cột web không ghi
      if (!f || !/^=/.test(String(f)) || ghiCot.indexOf(j) >= 0) return;
      sh.getRange(dau, j + 1, vals.length, 1).setFormulasR1C1(vals.map(function() { return [f]; }));
    });
  } catch (eW) { try { sh.getRange(dau, 1, vals.length, Math.max(nc, ncMau)).clearContent(); } catch (eX) {} throw eW; }   // lỗi giữa chừng: xóa phần vừa ghi để duyệt lại được
  return [dau, vals.length];
}
function dbGanUu_(me, maDon, tab) {   // ★ ưu tiên cả đơn – cùng chỗ lưu với nút ★ trên bảng đơn (luuUuTienDon)
  var sh = ss_().getSheetByName(DH_UU_SHEET), k = maDon + '|' + tab;
  if (!sh) { sh = ss_().insertSheet(DH_UU_SHEET); sh.getRange(1, 1, 1, DH_UU_COT.length).setValues([DH_UU_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.getRange(2, 1, sh.getMaxRows() - 1, DH_UU_COT.length).setNumberFormat('@'); } catch (e) {} try { sh.hideSheet(); } catch (eH) {} xoaCache_(DH_UU_SHEET); }
  if (docAnToan_(DH_UU_SHEET).some(function(r) { return String(r.Khoa || '').replace(/^'/, '') === k; })) return;
  them_(DH_UU_SHEET, { Khoa: k, NguoiGan: (me.ten || me.tk || '').slice(0, 60), MaNV: String(me.maNV || ''), ThoiDiem: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') });
}
/* Người duyệt: p = { id, pb, hanh: 'DUYET' | 'TRA_VE' | 'TU_CHOI', dl (deadline chốt), uu (1 = ★ ưu tiên cả đơn), lyDo, lenh } */
function duyetDonBan(token, p) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  if (!q.duyet) return sach_({ ok: false, msg: 'Chỉ Giám đốc (C019), Phó GĐ sản xuất (C056) và chị Kim Loan (C067) duyệt đơn.' });
  p = p || {};
  var hanh = String(p.hanh || ''); if (['DUYET', 'TRA_VE', 'TU_CHOI'].indexOf(hanh) < 0) return sach_({ ok: false, msg: 'Thao tác không hợp lệ.' });
  var ly = { s: '' }; if (hanh !== 'DUYET') { ly = dhhLy_(p.lyDo); if (ly.loi) return sach_({ ok: false, msg: ly.loi }); }
  var dl = String(p.dl || '').trim();
  if (hanh === 'DUYET' && (!dl || !dhNgayThat_(dl))) return sach_({ ok: false, msg: 'Chốt deadline trước khi duyệt.' });
  var lenh = dhhLenh_(p), cache = CacheService.getScriptCache(), l;
  if (lenh) { try { var c0 = cache.get('DB_L_' + lenh); if (c0) return sach_(JSON.parse(c0)); } catch (e) {} }
  try { l = dbKhoa_(); } catch (e) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    if (lenh) { try { var c1 = cache.get('DB_L_' + lenh); if (c1) return sach_(JSON.parse(c1)); } catch (e) {} }
    var ss = dhhSS_(false); if (!ss) return sach_({ ok: false, msg: 'Không tìm thấy đơn.' });
    var r = dbDoc_(ss).filter(function(x) { return x.Id === String(p.id || ''); })[0];
    if (!r) return sach_({ ok: false, msg: 'Không tìm thấy đơn.' });
    if (r.TrangThai !== 'CHO_DUYET') return sach_({ ok: false, cu: true, msg: 'Đơn này đã được xử lý (' + ({ DA_DUYET: 'đã duyệt', TRA_VE: 'đã trả về', TU_CHOI: 'đã từ chối', DA_XOA: 'người gửi đã xóa' }[r.TrangThai] || r.TrangThai) + (r.NguoiDuyet ? ' bởi ' + r.NguoiDuyet : '') + ').' });
    if (p.pb != null && Number(p.pb) !== (Number(r.PhienBan) || 1)) return sach_({ ok: false, cu: true, msg: 'Bán hàng vừa sửa đơn này – tải lại để xem bản mới rồi duyệt.' });
    var gio = dhhGio_(), ai = String(q.me.ten || q.me.tk || '').slice(0, 60), sua = { NguoiDuyet: ai, TkDuyet: String(q.me.tk || ''), LucDuyet: gio, LyDo: ly.s }, msg = '', canhBao = '';
    if (hanh === 'DUYET') {
      var ghi;
      try { ghi = dbGhiSheet_(r, dl); } catch (eG) { return sach_({ ok: false, msg: 'Chưa duyệt được: ' + String(eG && eG.message || eG).slice(0, 200) + '.' }); }
      sua.TrangThai = 'DA_DUYET'; sua.DeadlineChot = dl; sua.UuTien = p.uu ? '1' : ''; sua.DongSheet = JSON.stringify(ghi);
      if (p.uu) { try { dbGanUu_(q.me, r.MaDon, r.Tab); } catch (eU) { canhBao = ' (chưa gắn được ★ ưu tiên – gắn lại trên bảng đơn)'; } }
      dhXoaCacheDon_();
      try { PropertiesService.getScriptProperties().setProperty('DH10_CAN_TAO', '1'); } catch (e) {}
      msg = 'Đã duyệt đơn ' + r.MaDon + ': ghi ' + ghi[1] + ' dòng vào tab ' + r.Tab + ' (từ dòng ' + ghi[0] + ').' + canhBao;
    } else {
      sua.TrangThai = hanh; msg = (hanh === 'TRA_VE' ? 'Đã trả đơn ' : 'Đã từ chối đơn ') + r.MaDon + ' về cho ' + r.NguoiTao + '.';
    }
    dhhSua_(ss, 'DonBan', r._row, sua);
    dbSuKien_(ss, q.me, 'DB_' + hanh, r.Id, { ma: r.MaDon, dl: dl, uu: p.uu ? 1 : 0, ly: ly.s }, lenh);
    try { ghiLog_(q.me, hanh === 'DUYET' ? 'Duyệt đơn bán hàng' : hanh === 'TRA_VE' ? 'Trả về đơn bán hàng' : 'Từ chối đơn bán hàng', (r.Tab + ' · ' + r.MaDon + ' · ' + r.NguoiTao).slice(0, 200), '', (dl || ly.s).slice(0, 120)); } catch (e) {}
    var kq = { ok: true, msg: msg };
    if (lenh) { try { cache.put('DB_L_' + lenh, JSON.stringify(kq), 600); } catch (e) {} }
    return sach_(kq);
  } finally { l.releaseLock(); }
}
/* Việc hôm nay / Tổng quan của người duyệt: số đơn chờ duyệt */
function demDonBanCho(token) {
  var me = docPhien_(token); if (!me) return sach_({ ok: false, hetHan: true });
  var duyet = false; try { duyet = dhCoHuy_(me); } catch (e) {}
  if (!duyet) return sach_({ ok: true, n: 0, ds: [] });
  var ss = dhhSS_(false), ds = ss ? dbDoc_(ss).filter(function(r) { return r.TrangThai === 'CHO_DUYET'; }) : [];
  var kh = null; if (me.laOwner) { try { kh = dhkWeb_(); } catch (eK) {} }   // 17/11: nhắc chủ sở hữu khóa hẳn sau 14 ngày cảnh báo
  var dung = null; try { dung = dhhNhacDung_(); } catch (eD) {}   // 17/11: nhắc đơn tạm dừng đến ngày chạy lại / dừng quá 14 ngày
  var dn = null; try { var a = dhhDoc_(ss, 'DeNghiUu').filter(function(r) { return r.TrangThai === 'CHO'; }); dn = { n: a.length, ds: a.slice(0, 4).map(function(r) { return { ma: r.MaDon, ai: r.NguoiTao }; }) }; } catch (eN) {}   // 17/11 khuya: đề nghị ưu tiên chờ xử lý
  return sach_({ ok: true, n: ds.length, khoa: kh, dung: dung, dn: dn, ds: ds.slice(0, 5).map(function(r) { return { ma: r.MaDon, kenh: DH_NHAN_TAB[r.Tab] || r.Tab, ai: r.NguoiTao, n: r._d.length }; }) });
}
/* ===== Tài khoản Bán hàng – chỉ chủ sở hữu ===== */
function dsUngVienBH(token) {
  var me = docPhien_(token); if (!me) return sach_({ ok: false, hetHan: true });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu.' });
  var tkMa = {}; doc_('TaiKhoan').forEach(function(t) { var m = String(t.MaNV || '').trim().toUpperCase(); if (m) tkMa[m] = { tk: t.TenDangNhap, vt: String(t.VaiTro || '').trim(), tt: String(t.TrangThai || '').trim() }; });
  var ds = docAnToan_('NhanSuNgoaiSX').filter(function(r) { return DB_NHOM_BH.test(String(r.BoPhan || '').trim()) && String(r.MaNV || '').trim() && !/nghỉ/i.test(String(r.TrangThai || '')); })
    .map(function(r) { var m = String(r.MaNV).trim().toUpperCase(), t = tkMa[m]; return { maNV: m, hoTen: String(r.HoTen || ''), boPhan: String(r.BoPhan || ''), nhom: String(r.Nhom || ''), chuc: String(r.ChucDanh || ''), goiY: DB_NHOM_GOI_Y.test(String(r.BoPhan || '') + ' ' + String(r.Nhom || '')) && !/Thiết kế|Content|Quay/i.test(String(r.Nhom || '')) ? 1 : 0, tk: t ? t.tk : '', vt: t ? t.vt : '', tt: t ? t.tt : '' }; });
  ds.sort(function(a, b) { return a.boPhan.localeCompare(b.boPhan) || a.nhom.localeCompare(b.nhom) || a.maNV.localeCompare(b.maNV); });
  return sach_({ ok: true, ds: ds });
}
function taoTaiKhoanBH(token, p) {
  var me = docPhien_(token); if (!me) return sach_({ ok: false, hetHan: true });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được tạo tài khoản.' });
  var chon = (p && Array.isArray(p.ds) ? p.ds : []).map(function(x) { return String(x || '').trim().toUpperCase(); }).filter(function(x) { return /^[A-Z]{1,3}\d{1,6}$/.test(x); });
  if (!chon.length) return sach_({ ok: false, msg: 'Chưa chọn ai.' });
  if (chon.length > 60) return sach_({ ok: false, msg: 'Mỗi lần tối đa 60 người.' });
  khoa_();
  var ns = {}; docAnToan_('NhanSuNgoaiSX').forEach(function(r) { if (DB_NHOM_BH.test(String(r.BoPhan || '').trim())) ns[String(r.MaNV || '').trim().toUpperCase()] = r; });
  var tkAll = doc_('TaiKhoan'), ra = [], boQua = [];
  chon.forEach(function(m) {
    var r = ns[m]; if (!r) { boQua.push(m + ' (không thuộc Kinh doanh / Marketing)'); return; }
    if (tkAll.some(function(t) { return String(t.MaNV || '').trim().toUpperCase() === m; })) { boQua.push(m + ' (đã có tài khoản)'); return; }
    var tk = m.toLowerCase(); if (tkAll.some(function(t) { return String(t.TenDangNhap).toLowerCase() === tk; })) { boQua.push(m + ' (trùng tên đăng nhập)'); return; }
    var mk = mkTam_();
    them_('TaiKhoan', { TenDangNhap: tk, MatKhauMaHoa: '', HoTen: String(r.HoTen || m).slice(0, 80), VaiTro: 'BH', MaXuong: '', TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: m });
    tkAll = doc_('TaiKhoan');
    var moi = tkAll.filter(function(t) { return String(t.TenDangNhap).toLowerCase() === tk; })[0];
    if (moi) datMKTam_(moi._row, mk);
    ra.push({ maNV: m, hoTen: String(r.HoTen || ''), tk: tk, mk: mk });
  });
  if (ra.length) ghiLog_(me, 'Tạo tài khoản Bán hàng', ra.length + ' tài khoản: ' + ra.map(function(x) { return x.tk; }).join(', ').slice(0, 300));
  return sach_({ ok: true, ds: ra, boQua: boQua, hanGio: MK_HAN_TAM_GIO,
    msg: 'Đã tạo ' + ra.length + ' tài khoản Bán hàng' + (boQua.length ? ', bỏ qua ' + boQua.length : '') + '. Mật khẩu tạm dùng trong ' + MK_HAN_TAM_GIO + ' giờ, đổi ở lần đăng nhập đầu.' });
}
