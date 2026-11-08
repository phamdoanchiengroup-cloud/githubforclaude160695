/* =====================================================================
   NHÂN SỰ THEO BẢNG CHẤM CÔNG (03/11, chủ dự án)
   1) SUA_NHAN_SU_THEO_CHAM_CONG – hàm chạy MỘT LẦN trong trình soạn thảo Apps Script:
      đọc file "KPI - Sửa nhân sự theo chấm công T10" (Drive của chủ dự án, Claude soạn từ ảnh chấm công)
      rồi sửa: DOI_MA (mã tạm -> mã chấm công, đổi ở mọi sheet có cột MaNV / TenDangNhap, giữ mật khẩu),
      TEN (họ tên đúng chấm công), NGAY_VAO (ngày vào làm), THEM (người thiếu + tài khoản công nhân).
      Sau đó chép file "KPI - Bộ phận ngoài sản xuất" vào sheet NhanSuNgoaiSX.
      Chạy lại nhiều lần không sao (dòng đã đúng thì bỏ qua). Không đụng trạng thái, xưởng, chức danh.
   2) NhanSuNgoaiSX: Kho, Bếp + tạp vụ, Ban điều hành, Xưởng May – CHỈ danh sách, sheet riêng nên
      không vào KPI, điểm danh, cơm trưa, lưu đồ 9 xưởng. Chỉ tài khoản chủ sở hữu xem (tab Nhân sự).
   Dữ liệu cá nhân nằm ở 2 file Drive, KHÔNG nằm trong mã nguồn (chỉ có mã file).
   ===================================================================== */
var NS_CC_FILE_SUA = '1MwEdEj5XELPcjEhLd3BZz-3Tcs4rbQR01KD9hFnor3g';    // KPI - Sửa nhân sự theo chấm công T10
var NS_CC_FILE_NGOAI = '1yGdL5PRbd6XvpydtiEL17BI0-UHqeECc5q3vd-QQEOU';  // 08/11: KPI - Nhân sự ngoài sản xuất (hồ sơ) – thay file 03/11 (1KAbgfq0QMZNmFeyF7VWFcEwjWM-ADK4sRR8FghUAcgk); thêm Marketing + Kinh doanh
var NS_NGOAI_SHEET = 'NhanSuNgoaiSX', NS_NGOAI_COT = ['BoPhan', 'Nhom', 'MaNV', 'HoTen', 'ChucDanh', 'NgayVaoLam', 'NgayChinhThuc', 'PhepConLai', 'TrangThai', 'GhiChu'];
var NS_DOI_MA_BO = { NhatKyThaoTac: 1 };   // nhật ký thao tác giữ nguyên lịch sử (ghi đúng tên đăng nhập lúc đó)

function nsNgay_(v) {   // ô ngày (Date hoặc 'yyyy-mm-dd' / 'dd/mm/yyyy') -> Date 12:00 giờ VN, sai -> null
  if (Object.prototype.toString.call(v) === '[object Date]') return isNaN(v.getTime()) ? null : new Date(v.getFullYear(), v.getMonth(), v.getDate(), 12);
  var s = String(v == null ? '' : v).trim(), m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/), y, mo, d;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else { m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (!m) return null; d = +m[1]; mo = +m[2]; y = +m[3]; }
  if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31 && y > 2000)) return null;
  return new Date(y, mo - 1, d, 12);
}
function nsDocFile_(id) {   // -> [{Cột: giá trị}] từ trang đầu của file Drive
  var v = SpreadsheetApp.openById(id).getSheets()[0].getDataRange().getValues(), h = v[0].map(function(x) { return String(x).trim(); }), out = [];
  for (var i = 1; i < v.length; i++) { if (v[i].join('') === '') continue; var o = {}; h.forEach(function(k, j) { o[k] = v[i][j]; }); out.push(o); }
  return out;
}
/* Đổi mã ở mọi sheet: cột MaNV (giữ HOA) và TenDangNhap (chữ thường). -> số ô đã đổi */
var NS_MA_RE = /^[A-Z0-9]{2,20}$/;
function nsCoMaO_(ma) {   // mã đã xuất hiện ở bất kỳ sheet nào (cột MaNV / TenDangNhap)? -> tên sheet đầu tiên, không có -> ''
  var maL = String(ma).toLowerCase(), thay = '';
  ss_().getSheets().some(function(sh) {
    if (NS_DOI_MA_BO[sh.getName()]) return false;
    var nr = sh.getLastRow(), nc = sh.getLastColumn(); if (nr < 2 || nc < 1) return false;
    var h = sh.getRange(1, 1, 1, nc).getValues()[0];
    return h.some(function(ten, j) { ten = String(ten).trim(); if (ten !== 'MaNV' && ten !== 'TenDangNhap') return false;
      var v = sh.getRange(2, j + 1, nr - 1, 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === maL) { thay = sh.getName(); return true; } return false; });
  });
  return thay;
}
function nsDoiMaMoiSheet_(cu, moi) {
  if (!cu || !NS_MA_RE.test(cu) || !NS_MA_RE.test(moi)) return 0;   // mã trống / lạ: không đổi gì (tránh ghi vào mọi ô trống)
  var n = 0, ss = ss_(), cuL = cu.toLowerCase();
  ss.getSheets().forEach(function(sh) {
    if (NS_DOI_MA_BO[sh.getName()]) return;
    var nr = sh.getLastRow(), nc = sh.getLastColumn(); if (nr < 2 || nc < 1) return;
    var h = sh.getRange(1, 1, 1, nc).getValues()[0];
    h.forEach(function(ten, j) {
      ten = String(ten).trim(); if (ten !== 'MaNV' && ten !== 'TenDangNhap') return;
      var r = sh.getRange(2, j + 1, nr - 1, 1), v = r.getValues(), doi = false;
      for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === cuL) { v[i][0] = ten === 'MaNV' ? moi : moi.toLowerCase(); doi = true; n++; }
      if (doi) r.setValues(v);
    });
  });
  return n;
}
function SUA_NHAN_SU_THEO_CHAM_CONG() {
  if (!noiBo_(arguments[0])) return chanWeb_('SUA_NHAN_SU_THEO_CHAM_CONG');
  khoa_();   // khóa chung với web: không ai lưu chen vào lúc đang đổi mã
  var log = [], loi = [], ds = nsDocFile_(NS_CC_FILE_SUA), he = { tk: 'HE_THONG', ten: 'Sửa theo chấm công T10' };
  var dsDoi = ds.filter(function(x) { return String(x.Loai).trim() === 'DOI_MA'; }), cuSet = {};
  dsDoi.forEach(function(x) { cuSet[String(x.MaCu || '').trim().toUpperCase()] = 1; });
  var noiChuoi = dsDoi.filter(function(x) { return cuSet[String(x.MaMoi || '').trim().toUpperCase()]; });
  if (noiChuoi.length) { Logger.log('DỪNG: mã mới trùng mã cũ của dòng khác (đổi nối chuỗi): ' + noiChuoi.map(function(x) { return x.MaCu + '→' + x.MaMoi; }).join(', ')); return { ok: false, sua: [], loi: ['đổi nối chuỗi'] }; }
  var thu = { DOI_MA: 0, TEN: 1, NGAY_VAO: 2, THEM: 3 };   // đổi mã trước, rồi mới sửa tên / ngày theo mã mới
  var th = function(x) { var k = String(x.Loai).trim(); return thu.hasOwnProperty(k) ? thu[k] : 9; };
  ds = ds.map(function(x, i) { x._i = i; return x; }).sort(function(a, b) { return (th(a) - th(b)) || (a._i - b._i); });   // giữ thứ tự gốc trong cùng loại
  var shNS = ss_().getSheetByName('NhanSu'), hNS = shNS.getRange(1, 1, 1, shNS.getLastColumn()).getValues()[0];
  var cMa = hNS.indexOf('MaNV') + 1, cTen = hNS.indexOf('HoTen') + 1, cVao = hNS.indexOf('NgayVaoLam') + 1;
  var tim = function(ma) { var v = shNS.getRange(2, cMa, Math.max(1, shNS.getLastRow() - 1), 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === ma) return i + 2; return 0; };
  var shTK = ss_().getSheetByName('TaiKhoan'), hTK = shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0];
  var timTK = function(ten, giaTri) { var c = hTK.indexOf(ten) + 1; if (!c) return 0; var v = shTK.getRange(2, c, Math.max(1, shTK.getLastRow() - 1), 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === String(giaTri).toLowerCase()) return i + 2; return 0; };
  ds.forEach(function(r) {
    var loai = String(r.Loai || '').trim(), cu = String(r.MaCu || '').trim().toUpperCase(), ma = String(r.MaMoi || '').trim().toUpperCase(), ten = String(chuAnToan_(chuanHoaTen_(r.HoTen)));
    if (!ma) return;
    if (!NS_MA_RE.test(ma) || (loai === 'DOI_MA' && !NS_MA_RE.test(cu))) { loi.push(loai + ': mã không hợp lệ "' + (cu ? cu + '→' : '') + ma + '"'); return; }
    try {
      if (loai === 'DOI_MA') {
        if (tim(ma)) { log.push('Bỏ qua ' + cu + ' → ' + ma + ': mã mới đã có trong NhanSu (có thể đã đổi rồi).'); return; }
        if (!tim(cu)) { loi.push('Không thấy mã cũ ' + cu + ' trong NhanSu.'); return; }
        if (timTK('TenDangNhap', ma.toLowerCase())) { loi.push('Tên đăng nhập ' + ma.toLowerCase() + ' đã có người dùng – chưa đổi ' + cu + '.'); return; }
        var o2 = nsCoMaO_(ma); if (o2) { loi.push('Mã ' + ma + ' đã có ở sheet ' + o2 + ' – chưa đổi ' + cu + ' (tránh gộp lẫn số liệu).'); return; }
        var n = nsDoiMaMoiSheet_(cu, ma); log.push('Đổi mã ' + cu + ' → ' + ma + ' (' + n + ' ô, đăng nhập bằng ' + ma.toLowerCase() + ', mật khẩu giữ nguyên).');
        ghiLog_(he, 'Đổi mã nhân viên', cu + ' → ' + ma, cu, ma);
      } else if (loai === 'TEN') {
        var row = tim(ma); if (!row) { loi.push('TEN: không thấy ' + ma); return; }
        var cuTen = String(shNS.getRange(row, cTen).getValue());
        if (cuTen !== ten) { shNS.getRange(row, cTen).setValue(ten); log.push('Tên ' + ma + ': ' + cuTen + ' → ' + ten); }
        var rt = timTK('MaNV', ma); if (rt && hTK.indexOf('HoTen') >= 0) shTK.getRange(rt, hTK.indexOf('HoTen') + 1).setValue(ten);
      } else if (loai === 'NGAY_VAO') {
        var row2 = tim(ma), d = nsNgay_(r.NgayVaoLam); if (!row2 || !d) { loi.push('NGAY_VAO: ' + (row2 ? 'ngày sai' : 'không thấy') + ' ' + ma); return; }
        var cuD = shNS.getRange(row2, cVao).getValue(), cuS = cuD ? Utilities.formatDate(new Date(cuD), TZ_VN, 'yyyy-MM-dd') : '';
        if (cuS !== Utilities.formatDate(d, TZ_VN, 'yyyy-MM-dd')) { shNS.getRange(row2, cVao).setValue(d); log.push('Ngày vào ' + ma + ': ' + (cuS || 'trống') + ' → ' + Utilities.formatDate(d, TZ_VN, 'dd/MM/yyyy')); }
      } else if (loai === 'THEM') {
        var x = String(r.MaXuong || '').trim(), daCo = !!tim(ma);
        if (!daCo) them_('NhanSu', { MaNV: ma, HoTen: ten, MaXuong: x, ChucDanh: 'Công nhân', BacTayNghe: 1, NgayVaoLam: nsNgay_(r.NgayVaoLam) || '',
          LoaiHopDong: 'Chờ nhân sự bổ sung', TrangThai: 'Đang làm', NguoiTao: he.ten, NgayTao: new Date() });
        var tkMsg = '';   // tài khoản kiểm tra riêng: lần trước thêm nhân sự mà tạo tài khoản lỗi thì lần này tạo bù
        if (!timTK('TenDangNhap', ma.toLowerCase()) && !timTK('MaNV', ma)) {
          var mk = mkTam_();
          them_('TaiKhoan', { TenDangNhap: ma.toLowerCase(), MatKhauMaHoa: '', HoTen: ten, VaiTro: 'CN', MaXuong: x, TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: ma });
          var moiTao = doc_('TaiKhoan').filter(function(t) { return String(t.TenDangNhap).toLowerCase() === ma.toLowerCase(); })[0];
          if (moiTao) datMKTam_(moiTao._row, mk);
          tkMsg = ' Đã tạo tài khoản ' + ma.toLowerCase() + ' – vào web, tab Tài khoản, bấm "Cấp lại mật khẩu" để lấy mật khẩu tạm đưa cho người này (không ghi mật khẩu vào nhật ký).';
        }
        if (daCo && !tkMsg) { log.push('Bỏ qua thêm ' + ma + ': đã có.'); return; }
        log.push((daCo ? 'Tạo bù tài khoản ' : 'Thêm ') + ma + ' ' + ten + ' (' + x + ').' + tkMsg);
        if (!daCo) ghiLog_(he, 'Thêm nhân sự', ma + ' — ' + ten);
      }
    } catch (e) { loi.push(loai + ' ' + ma + ': ' + (e && e.message || e)); }
  });
  try { var nN = nhapNhanSuNgoaiSX_(); log.push('Bộ phận ngoài sản xuất: ' + nN + ' người vào sheet ' + NS_NGOAI_SHEET + '.'); }
  catch (e2) { loi.push('Bộ phận ngoài sản xuất: ' + (e2 && e2.message || e2)); }
  try { xaGhi_ && xaGhi_(); } catch (e3) {}
  xoaCache_(); tangPhienBan_();
  Logger.log('ĐÃ SỬA (' + log.length + '):\n' + log.join('\n') + (loi.length ? '\n\nCẦN XEM (' + loi.length + '):\n' + loi.join('\n') : '\n\nKhông có lỗi.'));
  return { ok: !loi.length, sua: log, loi: loi };
}
/* Chép danh sách bộ phận ngoài sản xuất từ file Drive vào sheet riêng (thay toàn bộ) */
function nhapNhanSuNgoaiSX_() {
  var ds = nsDocFile_(NS_CC_FILE_NGOAI).filter(function(r) { return String(r.MaNV || '').trim() && String(r.HoTen || '').trim(); });
  var sh = ss_().getSheetByName(NS_NGOAI_SHEET) || ss_().insertSheet(NS_NGOAI_SHEET);
  sh.clearContents();
  var rows = [NS_NGOAI_COT].concat(ds.map(function(r) { return NS_NGOAI_COT.map(function(k) {
    if (k === 'NgayVaoLam' || k === 'NgayChinhThuc') return nsNgay_(r[k]) || '';
    if (k === 'PhepConLai') { var ph = String(r[k] == null ? '' : r[k]).trim().replace(',', '.'); return ph !== '' && !isNaN(Number(ph)) ? Number(ph) : ''; }
    if (k === 'HoTen') return chuanHoaTen_(r[k]);
    return chuAnToan_(String(r[k] == null ? '' : r[k]).trim());
  }); }));
  sh.getRange(1, 1, rows.length, NS_NGOAI_COT.length).setValues(rows);
  sh.getRange(1, 1, 1, NS_NGOAI_COT.length).setFontWeight('bold');
  xoaCache_(NS_NGOAI_SHEET);
  return ds.length;
}
/* Web: danh sách bộ phận ngoài sản xuất – chỉ chủ sở hữu */
var NS_NGOAI_THU = ['Ban điều hành', 'Kinh doanh', 'Marketing', 'Kho', 'Bếp + tạp vụ', 'Xưởng May'];
function layNhanSuNgoaiSX(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ tài khoản chủ sở hữu xem được.' });
  /* 03/11 (chủ dự án): người đang làm ở 9 xưởng (có trong NhanSu "Đang làm", vd. C043 trưởng phòng Hoàn thiện) giữ ở xưởng, không liệt kê lại ở đây */
  var oXuong = {}; docAnToan_('NhanSu').forEach(function(n) { if (String(n.TrangThai).trim() === 'Đang làm') oXuong[String(n.MaNV).trim().toUpperCase()] = 1; });
  var ds = docAnToan_(NS_NGOAI_SHEET).filter(function(r) { return String(r.MaNV || '').trim() && String(r.TrangThai || 'Đang làm').trim() !== 'Nghỉ việc' && !oXuong[String(r.MaNV).trim().toUpperCase()]; }).map(function(r) {
    return { BoPhan: String(r.BoPhan || ''), Nhom: String(r.Nhom || ''), MaNV: String(r.MaNV), HoTen: String(r.HoTen || ''), ChucDanh: String(r.ChucDanh || ''),
      NgayVaoLam: r.NgayVaoLam ? Utilities.formatDate(new Date(r.NgayVaoLam), TZ_VN, 'dd/MM/yyyy') : '', GhiChu: String(r.GhiChu || ''),
      /* 08/11 (chủ dự án: "đầy đủ thông tin" = hồ sơ): ngày chính thức, tình trạng (08/11: bỏ phép năm còn lại – chủ dự án chưa cần; cột vẫn giữ trong file) + thâm niên tự tính */
      NgayChinhThuc: r.NgayChinhThuc ? Utilities.formatDate(new Date(r.NgayChinhThuc), TZ_VN, 'dd/MM/yyyy') : '',
      tinhTrang: nsTinhTrang_(r), thamNienThang: nsThamNien_(r.NgayVaoLam) };
  });
  ds.forEach(function(x, i) { x._i = i; });   // trong 1 bộ phận giữ đúng thứ tự bảng chấm công (nhóm, trưởng bộ phận đầu)
  ds.sort(function(a, b) {
    var x = NS_NGOAI_THU.indexOf(a.BoPhan), y = NS_NGOAI_THU.indexOf(b.BoPhan); x = x < 0 ? 99 : x; y = y < 0 ? 99 : y;
    return (x - y) || (a._i - b._i);
  });
  ds.forEach(function(x) { delete x._i; });
  return sach_({ ok: true, ds: ds, file: linkFileNgoaiSX_() });
}
function nsYmd_(v) { return v ? Utilities.formatDate(new Date(v), TZ_VN, 'yyyy-MM-dd') : ''; }
function nsTinhTrang_(r) {   // 'Chính thức' | 'Thử việc' | '' (chưa có ngày)
  var hn = homNayVN_(), ct = nsYmd_(r.NgayChinhThuc), vao = nsYmd_(r.NgayVaoLam);
  if (ct) return ct <= hn ? 'Chính thức' : 'Thử việc';
  return vao ? (/thử việc/i.test(String(r.GhiChu || '')) ? 'Thử việc' : '') : '';
}
function nsThamNien_(v) {   // số tháng tròn từ ngày vào làm tới hôm nay
  var a = nsYmd_(v); if (!a) return null; var h = homNayVN_();
  var m = (Number(h.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(h.slice(5, 7)) - Number(a.slice(5, 7)) - (Number(h.slice(8, 10)) < Number(a.slice(8, 10)) ? 1 : 0);
  return Math.max(0, m);
}
/* 08/11 (chủ dự án): nút "Cập nhật từ file" ở Nhân sự › Bộ phận ngoài sản xuất – chép lại toàn bộ danh sách từ file Drive
   "KPI - Nhân sự ngoài sản xuất (hồ sơ)" (file là bản gốc: thêm / sửa / ghi "Nghỉ việc" ở file rồi bấm). Chỉ chủ sở hữu.
   Không tạo tài khoản, không vào KPI / điểm danh / cơm trưa. */
function capNhatNgoaiSXTuFile(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ tài khoản chủ sở hữu được cập nhật.' });
  khoa_();
  var n = 0;
  try { n = nhapNhanSuNgoaiSX_(); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được file danh sách: ' + (e && e.message || e) }); }
  var dem = {}; doc_(NS_NGOAI_SHEET).forEach(function(r) { if (String(r.TrangThai || '').trim() === 'Nghỉ việc') return; var b = String(r.BoPhan || 'Khác'); dem[b] = (dem[b] || 0) + 1; });
  ghiLog_(me, 'Cập nhật nhân sự ngoài sản xuất', n + ' dòng từ file', '', '');
  return sach_({ ok: true, n: n, dem: dem, msg: 'Đã cập nhật ' + n + ' người: ' + Object.keys(dem).map(function(b) { return b + ' ' + dem[b]; }).join(', ') + '.' });
}
function linkFileNgoaiSX_() { return 'https://docs.google.com/spreadsheets/d/' + NS_CC_FILE_NGOAI + '/edit'; }

