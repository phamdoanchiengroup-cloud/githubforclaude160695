
/* ================== CƠM TRƯA (11/10) ==================
   Bếp (vai trò BEP) hoặc ban điều hành báo THỰC ĐƠN cho một ngày (thường 14–15h hôm trước).
   Mọi tài khoản tự đăng ký "Ăn" / "Không ăn" tới HẠN CHÓT 16:00 hôm trước (Script Property COM_GIO_CHOT để đổi giờ).
   Ban điều hành, nhân sự, bếp xem tổng hợp số suất theo xưởng (kèm tên); trưởng / phó phòng xem số của mọi xưởng
   và danh sách tên của xưởng mình.
   Sang tháng mới (cùng lúc chốt KPI tháng): số suất theo xưởng ghi vào sheet SuatAnThang (đưa vào báo cáo tháng),
   danh sách chi tiết lưu thành 1 file bảng tính trên Google Drive (thư mục báo cáo tháng) rồi mới xóa khỏi sheet.
   Sheet tự tạo khi dùng lần đầu: ThucDon, DangKyCom, SuatAnThang. */
var COM_SHEET = {
  ThucDon: ['Ngay', 'MonAn', 'GhiChu', 'NguoiNhap', 'CapNhat'],
  DangKyCom: ['Ngay', 'TenDangNhap', 'HoTen', 'MaNV', 'MaXuong', 'An', 'ThoiDiem'],
  SuatAnThang: ['Ky', 'MaXuong', 'TenXuong', 'SoNgay', 'SuatAn', 'KhongAn', 'ChuaDangKy', 'TepLuu']
};
var COM_VP = 'VP';                       // nhóm cho tài khoản không gắn xưởng (ban điều hành, nhân sự, bếp…)
var COM_TEN_VP = 'Văn phòng / khác';

function comSheet_(ten) {
  var ss = ss_(), sh = ss.getSheetByName(ten);
  if (!sh) {
    sh = ss.insertSheet(ten);
    sh.getRange(1, 1, 1, COM_SHEET[ten].length).setValues([COM_SHEET[ten]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1000, 1).setNumberFormat('@');          // ngày / kỳ lưu dạng văn bản 'yyyy-MM-dd'
    delete __DOC_CACHE[ten]; delete __HEAD_CACHE[ten];
  }
  return sh;
}
function comDoc_(ten) { comSheet_(ten); return doc_(ten); }
function comNgay_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ_VN, 'yyyy-MM-dd') : String(v || '').replace(/^'/, '').slice(0, 10); }
function comGioChot_() {
  var v = PropertiesService.getScriptProperties().getProperty('COM_GIO_CHOT'), g = Number(v);
  return v !== null && String(v).trim() !== '' && g >= 0 && g < 24 && g === Math.floor(g) ? g : 16;
}
/* Hạn chót đăng ký cơm ngày `ngay`: giờ chốt của NGÀY HÔM TRƯỚC, dạng 'yyyy-MM-dd HH:mm' */
function comHan_(ngay) { return congNgay_(ngay, -1) + ' ' + ('0' + comGioChot_()).slice(-2) + ':00'; }
function comBayGio_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function comConHan_(ngay) { return comBayGio_() < comHan_(ngay); }
function comXem_(me) { return ['ADMIN', 'HR', 'BEP', 'TP'].indexOf(me.vaiTro) >= 0; }
function comSua_(me) { return me.vaiTro === 'ADMIN' || me.vaiTro === 'BEP'; }

/* Người cần đăng ký: tài khoản đang dùng (bỏ tài khoản có hồ sơ đã nghỉ việc) */
function comNguoi_() {
  var nghi = {};
  docAnToan_('NhanSu').forEach(function(n) { if (String(n.TrangThai).trim() === 'Nghỉ việc') nghi[String(n.MaNV).trim()] = 1; });
  return doc_('TaiKhoan').filter(function(t) {
    return String(t.TrangThai).trim() === 'Đang dùng' && !(t.MaNV && nghi[String(t.MaNV).trim()]);
  }).map(function(t) {
    return { tk: String(t.TenDangNhap).toLowerCase(), ten: t.HoTen, ma: String(t.MaNV || '').trim(), mx: String(t.MaXuong || '').trim() || COM_VP };
  });
}
function comTenX_() {
  var m = {}; docAnToan_('PhongBan').forEach(function(p) { m[p.MaXuong] = p.TenXuong; }); m[COM_VP] = COM_TEN_VP; return m;
}

/* Tổng hợp một ngày: { ngay, xuong:[{mx, ten, an, khong, chua, dsAn, dsKhong, dsChua}], an, khong, chua } */
function comTongHop_(ngay, me) {
  var nguoi = comNguoi_(), tenX = comTenX_(), dk = {};
  comDoc_('DangKyCom').forEach(function(r) { if (comNgay_(r.Ngay) === ngay) dk[String(r.TenDangNhap).toLowerCase()] = r; });
  var X = {}, ctKhong = [];
  nguoi.forEach(function(p) {
    var x = X[p.mx] || (X[p.mx] = { mx: p.mx, ten: tenX[p.mx] || p.mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    var r = dk[p.tk];
    if (!r) { x.chua++; x.dsChua.push(p.ten); }
    else if (Number(r.An) === 1) { x.an++; x.dsAn.push(p.ten); }
    else { x.khong++; x.dsKhong.push(p.ten); ctKhong.push({ ten: p.ten, ma: p.ma, mx: p.mx, xuong: x.ten }); }
  });
  // người đã đăng ký nhưng tài khoản nay không còn trong danh sách vẫn được tính suất
  Object.keys(dk).forEach(function(k) {
    if (nguoi.some(function(p) { return p.tk === k; })) return;
    var r = dk[k], mx = String(r.MaXuong || '') || COM_VP;
    var x = X[mx] || (X[mx] = { mx: mx, ten: tenX[mx] || mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    if (Number(r.An) === 1) { x.an++; x.dsAn.push(r.HoTen); } else { x.khong++; x.dsKhong.push(r.HoTen); ctKhong.push({ ten: r.HoTen, ma: String(r.MaNV || ''), mx: mx, xuong: x.ten }); }
  });
  var ds = Object.keys(X).map(function(k) { return X[k]; }).sort(function(a, b) {
    return (a.mx === COM_VP) - (b.mx === COM_VP) || String(a.ten).localeCompare(String(b.ten));
  });
  var tenOk = me && (me.vaiTro === 'ADMIN' || me.vaiTro === 'HR' || me.vaiTro === 'BEP');
  ds.forEach(function(x) {
    if (!(tenOk || (me && me.vaiTro === 'TP' && x.mx === me.xuong))) { delete x.dsAn; delete x.dsKhong; delete x.dsChua; }
  });
  var tong = function(k) { return ds.reduce(function(s, x) { return s + x[k]; }, 0); };
  // danh sách người KHÔNG ĂN đủ họ tên, mã NV, xưởng: ban điều hành / nhân sự / bếp thấy cả nhà máy, trưởng phòng thấy xưởng mình
  ctKhong = ctKhong.filter(function(c) { return tenOk || (me && me.vaiTro === 'TP' && c.mx === me.xuong); })
    .sort(function(a, b) { return String(a.xuong).localeCompare(String(b.xuong)) || String(a.ten).localeCompare(String(b.ten)); });
  return { ngay: ngay, xuong: ds, an: tong('an'), khong: tong('khong'), chua: tong('chua'), dsKhongCT: ctKhong };
}

/* Dữ liệu cho thanh thực đơn + trang Cơm trưa */
function napComTrua(token) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
    var homNay = homNayVN_(), den = congNgay_(homNay, 14);
    var td = comDoc_('ThucDon').map(function(r) {
      var ng = comNgay_(r.Ngay);
      return { ngay: ng, mon: String(r.MonAn || ''), ghiChu: String(r.GhiChu || ''), han: comHan_(ng), conHan: comConHan_(ng), nguoi: String(r.NguoiNhap || '') };
    }).filter(function(t) { return t.ngay >= congNgay_(homNay, -7) && t.ngay <= den; }).sort(function(a, b) { return a.ngay < b.ngay ? -1 : 1; });
    var cuaToi = {}, tk = String(me.tk).toLowerCase(), ky = homNay.slice(0, 7);
    var thang = { an: 0, khong: 0 };
    comDoc_('DangKyCom').forEach(function(r) {
      if (String(r.TenDangNhap).toLowerCase() !== tk) return;
      var ng = comNgay_(r.Ngay), an = Number(r.An) === 1 ? 1 : 0;
      cuaToi[ng] = an;
      if (ng.slice(0, 7) === ky) thang[an ? 'an' : 'khong']++;
    });
    var out = { ok: true, homNay: homNay, bayGio: comBayGio_(), gioChot: comGioChot_(), thucDon: td, cuaToi: cuaToi, thang: thang,
      quyen: { xem: comXem_(me), sua: comSua_(me) }, tongHop: [] };
    if (out.quyen.xem) {
      // tổng hợp các ngày có thực đơn từ hôm nay trở đi (ngày gần nhất trước)
      out.tongHop = td.filter(function(t) { return t.ngay >= homNay; }).slice(0, 4).map(function(t) { return comTongHop_(t.ngay, me); });
    }
    return sach_(out);
  } catch (e) { return sach_({ ok: false, msg: 'Lỗi tải cơm trưa: ' + e.message }); }
}

function dangKyCom(token, ngay, an) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  khoa_();
  var td = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!td) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (!comConHan_(ngay)) return sach_({ ok: false, msg: 'Đã quá hạn đăng ký (' + comGioChot_() + ':00 hôm trước). Liên hệ bếp nếu cần đổi.' });
  var tk = String(me.tk).toLowerCase(), v = an ? 1 : 0, thoi = comBayGio_();
  var cu = comDoc_('DangKyCom').filter(function(r) { return comNgay_(r.Ngay) === ngay && String(r.TenDangNhap).toLowerCase() === tk; });
  if (cu.length) {
    suaO_('DangKyCom', cu[0]._row, 'An', v); suaO_('DangKyCom', cu[0]._row, 'ThoiDiem', thoi);
    if (cu.length > 1) xoaNhieuDong_('DangKyCom', cu.slice(1).map(function(r) { return r._row; }));
  } else {
    them_('DangKyCom', { Ngay: "'" + ngay, TenDangNhap: tk, HoTen: me.ten, MaNV: me.maNV || '', MaXuong: me.xuong || COM_VP, An: v, ThoiDiem: thoi });
  }
  return sach_({ ok: true, ngay: ngay, an: v, msg: v ? 'Đã đăng ký ăn trưa ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + '.' : 'Đã báo không ăn trưa ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + '.' });
}

function luuThucDon(token, ngay, monAn, ghiChu) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được nhập thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Không nhập thực đơn cho ngày đã qua.' });
  monAn = String(monAn || '').trim().slice(0, 600); ghiChu = String(ghiChu || '').trim().slice(0, 300);
  if (!monAn) return sach_({ ok: false, msg: 'Nhập ít nhất một món.' });
  khoa_();
  var cu = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0], thoi = comBayGio_();
  if (cu) {
    suaO_('ThucDon', cu._row, 'MonAn', monAn); suaO_('ThucDon', cu._row, 'GhiChu', ghiChu);
    suaO_('ThucDon', cu._row, 'NguoiNhap', me.ten); suaO_('ThucDon', cu._row, 'CapNhat', thoi);
  } else them_('ThucDon', { Ngay: "'" + ngay, MonAn: monAn, GhiChu: ghiChu, NguoiNhap: me.ten, CapNhat: thoi });
  ghiLog_(me, 'Thực đơn cơm trưa', ngay, '', monAn);
  return sach_({ ok: true, msg: 'Đã lưu thực đơn ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + '. Hạn đăng ký: ' + comHan_(ngay).slice(11) + ' ngày ' + comHan_(ngay).slice(8, 10) + '/' + comHan_(ngay).slice(5, 7) + '.' });
}

function xoaThucDon(token, ngay) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được xóa thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Không xóa thực đơn ngày đã qua.' });
  khoa_();
  var td = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; });
  var dk = comDoc_('DangKyCom').filter(function(r) { return comNgay_(r.Ngay) === ngay; });
  xoaNhieuDong_('ThucDon', td.map(function(r) { return r._row; }));
  xoaNhieuDong_('DangKyCom', dk.map(function(r) { return r._row; }));
  ghiLog_(me, 'Xóa thực đơn cơm trưa', ngay, td.length ? td[0].MonAn : '', dk.length + ' lượt đăng ký bị xóa');
  return sach_({ ok: true, msg: 'Đã xóa thực đơn' + (dk.length ? ' và ' + dk.length + ' lượt đăng ký' : '') + ' ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + '.' });
}

/* Số suất của một tháng theo xưởng (dùng cho báo cáo tháng). Đã tổng kết thì đọc SuatAnThang, chưa thì tính từ DangKyCom. */
function comBaoCao_(ky) {
  var luu = docAnToan_('SuatAnThang').filter(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  if (luu.length) return luu.map(function(r) { return { mx: r.MaXuong, ten: r.TenXuong, soNgay: Number(r.SoNgay) || 0, an: Number(r.SuatAn) || 0, khong: Number(r.KhongAn) || 0, chua: Number(r.ChuaDangKy) || 0 }; });
  return comTinhThang_(ky).ds;
}
function comTinhThang_(ky) {
  var ngays = {};
  docAnToan_('ThucDon').forEach(function(r) { var n = comNgay_(r.Ngay); if (n.slice(0, 7) === ky) ngays[n] = 1; });
  var dsNgay = Object.keys(ngays).sort(), X = {}, tenX = comTenX_(), chiTiet = [];
  dsNgay.forEach(function(ng) {
    var th = comTongHop_(ng, { vaiTro: 'ADMIN' }), maTen = {};
    comNguoi_().forEach(function(p) { maTen[p.mx + '|' + p.ten] = p.ma; });
    th.dsKhongCT.forEach(function(c) { maTen[c.mx + '|' + c.ten] = c.ma; });
    th.xuong.forEach(function(x) {
      var ma = function(t) { return maTen[x.mx + '|' + t] || ''; };
      var o = X[x.mx] || (X[x.mx] = { mx: x.mx, ten: tenX[x.mx] || x.mx, soNgay: 0, an: 0, khong: 0, chua: 0 });
      o.soNgay++; o.an += x.an; o.khong += x.khong; o.chua += x.chua;
      x.dsAn.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Ăn']); });
      x.dsKhong.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Không ăn']); });
      x.dsChua.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Chưa đăng ký']); });
    });
  });
  return { ngay: dsNgay, ds: Object.keys(X).map(function(k) { return X[k]; }).sort(function(a, b) { return b.an - a.an; }), chiTiet: chiTiet };
}

/* Sang tháng mới: ghi số suất tháng `ky` vào SuatAnThang, lưu chi tiết thành file bảng tính trên Drive, rồi xóa dữ liệu tháng đó.
   Không lưu được file thì KHÔNG xóa. Chạy lại an toàn (đã tổng kết thì bỏ qua). */
function comTongKetThang_(ky) {
  var daCo = docAnToan_('SuatAnThang').some(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  var conDK = docAnToan_('DangKyCom').some(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; });
  var conTD = docAnToan_('ThucDon').some(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; });
  if (daCo && !conDK && !conTD) return { ky: ky, boQua: true };
  var t = comTinhThang_(ky);
  if (!t.ngay.length && !conDK) return { ky: ky, trong: true };
  // 1) lưu chi tiết lên Drive
  var tep = SpreadsheetApp.create('Đăng ký cơm trưa ' + ky);
  var sh1 = tep.getSheets()[0]; sh1.setName('Tổng hợp theo xưởng');
  var bang = [['Xưởng', 'Số ngày có cơm', 'Suất ăn', 'Không ăn', 'Chưa đăng ký', 'Trung bình suất / ngày']].concat(t.ds.map(function(x) {
    return [x.ten, x.soNgay, x.an, x.khong, x.chua, x.soNgay ? Math.round(x.an / x.soNgay * 10) / 10 : 0]; }));
  sh1.getRange(1, 1, bang.length, 6).setValues(bang); sh1.getRange(1, 1, 1, 6).setFontWeight('bold'); sh1.setFrozenRows(1);
  var sh2 = tep.insertSheet('Chi tiết từng người');
  var ct = [['Ngày', 'Xưởng', 'Họ tên', 'Mã NV', 'Đăng ký']].concat(t.chiTiet);
  sh2.getRange(1, 1, ct.length, 5).setNumberFormat('@').setValues(ct); sh2.getRange(1, 1, 1, 5).setFontWeight('bold'); sh2.setFrozenRows(1);
  var sh3 = tep.insertSheet('Thực đơn');
  var td = [['Ngày', 'Món ăn', 'Ghi chú', 'Người nhập']].concat(docAnToan_('ThucDon').filter(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; })
    .map(function(r) { return [comNgay_(r.Ngay), String(r.MonAn || ''), String(r.GhiChu || ''), String(r.NguoiNhap || '')]; }).sort());
  sh3.getRange(1, 1, td.length, 4).setNumberFormat('@').setValues(td); sh3.getRange(1, 1, 1, 4).setFontWeight('bold');
  var file = DriveApp.getFileById(tep.getId());
  try { file.moveTo(bcThuMuc_(ky)); } catch (e) { Logger.log('Không chuyển được file vào thư mục báo cáo: ' + e); }
  // 2) số suất vào SuatAnThang (đưa vào báo cáo tháng)
  comSheet_('SuatAnThang');
  var cuS = docAnToan_('SuatAnThang').filter(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  xoaNhieuDong_('SuatAnThang', cuS.map(function(r) { return r._row; }));
  themNhieu_('SuatAnThang', t.ds.map(function(x) {
    return { Ky: "'" + ky, MaXuong: x.mx, TenXuong: x.ten, SoNgay: x.soNgay, SuatAn: x.an, KhongAn: x.khong, ChuaDangKy: x.chua, TepLuu: file.getUrl() }; }));
  // 3) xóa dữ liệu tháng cũ (cả các tháng trước đó còn sót)
  var xoa = function(ten) {
    xoaNhieuDong_(ten, docAnToan_(ten).filter(function(r) { return comNgay_(r.Ngay).slice(0, 7) <= ky; }).map(function(r) { return r._row; }));
  };
  xoa('DangKyCom'); xoa('ThucDon');
  try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(), 'HE_THONG', 'Tổng kết cơm trưa', 'Kỳ ' + ky + ' — ' + t.ds.reduce(function(s, x) { return s + x.an; }, 0) + ' suất, lưu ' + file.getUrl(), '', '']); } catch (e) {}
  return { ky: ky, tep: file.getUrl(), xuong: t.ds.length };
}

/* Chạy tay: tổng kết cơm trưa THÁNG TRƯỚC ngay (lưu Drive + xóa dữ liệu). Bình thường tự chạy khi chốt tháng. */
function TONG_KET_COM_THANG_TRUOC() {
  var r = comTongKetThang_(kyTruoc_(kyVN_()));
  Logger.log(JSON.stringify(r));
}
/* Chạy tay: đổi giờ chốt đăng ký (mặc định 16). Sửa số trong hàm rồi bấm Chạy. */
function DAT_GIO_CHOT_COM() {
  PropertiesService.getScriptProperties().setProperty('COM_GIO_CHOT', '16');
  Logger.log('Giờ chốt đăng ký cơm: ' + comGioChot_() + ':00 hôm trước.');
}
