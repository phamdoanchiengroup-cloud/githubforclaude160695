
/* ============================================================
   ===== CÁC HÀM CHẠY TAY (bản cập nhật 28/09/2026) =====
   Cách chạy: trong trình soạn thảo Apps Script, chọn tên hàm ở thanh trên cùng → bấm ▶ Chạy
   → xem kết quả ở "Nhật ký thực thi" phía dưới.
   ============================================================ */

/* 1) KIỂM TRA SAU CẬP NHẬT — chỉ đọc, không sửa gì.
   In ra: múi giờ dự án, các trigger đang cài, số tài khoản còn mật khẩu mặc định, tài khoản của người
   đã nghỉ việc, vi phạm thiếu mã ghi, dòng nhật ký ngày sai, sheet NgayLe. */
function KIEM_TRA_SAU_CAP_NHAT() {
  var L = [];
  L.push('Múi giờ dự án: ' + Session.getScriptTimeZone() + (Session.getScriptTimeZone() === TZ_VN ? ' (đúng)' : '  <-- NÊN ĐỔI sang Asia/Ho_Chi_Minh trong Cài đặt dự án'));
  var tg = ScriptApp.getProjectTriggers().map(function(t){ return t.getHandlerFunction(); });
  L.push('Trigger đang cài: ' + (tg.length ? tg.join(', ') : '(chưa có)'));
  ['chayPhatNhapTre','chotThangTuDong','snapshotKPIHangNgay','donTokenHetHan','saoLuuHangNgay'].forEach(function(h){
    if (tg.indexOf(h) < 0) L.push('   THIẾU trigger ' + h + ' -> chạy CAI_LAI_TAT_CA_TRIGGER');
  });

  var mkMacDinh = bam_('123456');
  var tk = doc_('TaiKhoan');
  var conMacDinh = tk.filter(function(t){ return chuan_(t.MatKhauMaHoa) === mkMacDinh && String(t.TrangThai).trim() === 'Đang dùng'; });
  var theoVT = {};
  conMacDinh.forEach(function(t){ theoVT[t.VaiTro] = (theoVT[t.VaiTro] || 0) + 1; });
  L.push('Tài khoản còn mật khẩu mặc định 123456: ' + conMacDinh.length + ' ' + JSON.stringify(theoVT));
  var quanTri = conMacDinh.filter(function(t){ return ['OWNER','ADMIN','HR','QC'].indexOf(String(t.VaiTro).trim()) >= 0; });
  if (quanTri.length) L.push('   !!! Tài khoản QUẢN TRỊ còn mật khẩu mặc định: ' + quanTri.map(function(t){ return t.TenDangNhap; }).join(', '));
  var chuaBat = conMacDinh.filter(function(t){ return String(t.DoiMatKhauLanDau).trim() !== 'Có'; });
  if (chuaBat.length) L.push('   ' + chuaBat.length + ' tài khoản dùng 123456 nhưng chưa bật "phải đổi mật khẩu" -> chạy BAT_BUOC_DOI_MAT_KHAU_MAC_DINH');

  var nghi = tk.filter(function(t){ return t.MaNV && String(t.TrangThai).trim() === 'Đang dùng' && nvDaNghi_(t.MaNV); });
  L.push('Tài khoản của người đã nghỉ việc vẫn "Đang dùng": ' + nghi.length + (nghi.length ? ' (' + nghi.map(function(t){ return t.TenDangNhap; }).join(', ') + ') -> chạy NGUNG_TK_NGHI_VIEC' : ''));

  var vp = docAnToan_('ViPham').filter(function(v){ return !String(v.MaGhi || '').trim(); });
  L.push('Vi phạm thiếu mã ghi: ' + vp.length + (vp.length ? ' -> chạy BO_SUNG_MA_GHI_VIPHAM' : ''));

  var sai = dsNgaySaiNhatKy_();
  L.push('Dòng nhật ký ngày sai: ' + sai.length + (sai.length ? ' -> chạy SUA_NGAY_NHAT_KY' : ''));
  L.push('Sheet NgayLe: ' + (ss_().getSheetByName('NgayLe') ? docAnToan_('NgayLe').length + ' ngày' : 'CHƯA CÓ -> chạy TAO_SHEET_NGAY_LE'));
  Logger.log(L.join('\n'));
  return L.join('\n');
}

/* 2) Cài lại TẤT CẢ trigger theo giờ Việt Nam (xóa trigger cũ cùng tên trước khi cài). */
function CAI_LAI_TAT_CA_TRIGGER() {
  CAI_TRIGGER_PHAT_TRE();
  CAI_TRIGGER_CHOT_THANG();
  CAI_TRIGGER_SNAPSHOT_9H();
  CAI_TRIGGER_DON_TOKEN();
  CAI_TRIGGER_SAO_LUU();
  Logger.log('Xong: đã cài 5 trigger theo giờ Việt Nam.');
}

/* 3) Ngừng tài khoản của những người đã chuyển "Nghỉ việc" trong NhanSu. */
function NGUNG_TK_NGHI_VIEC() {
  khoa_();
  var ds = [];
  doc_('TaiKhoan').forEach(function(t){
    if (t.MaNV && String(t.TrangThai).trim() === 'Đang dùng' && nvDaNghi_(t.MaNV)) {
      suaO_('TaiKhoan', t._row, 'TrangThai', 'Ngừng');
      ds.push(t.TenDangNhap + ' (' + t.HoTen + ')');
    }
  });
  ghiLog_({ tk: 'HE_THONG', ten: 'Chạy tay' }, 'Ngừng TK người nghỉ việc', ds.length + ' tài khoản', '', ds.join(', '));
  Logger.log('Đã ngừng ' + ds.length + ' tài khoản: ' + ds.join(', '));
}

/* 4) Bật cờ "phải đổi mật khẩu" cho mọi tài khoản đang dùng mật khẩu mặc định 123456.
   Lần đăng nhập tới họ sẽ bị buộc đặt mật khẩu mới. KHÔNG đổi mật khẩu của ai. */
function BAT_BUOC_DOI_MAT_KHAU_MAC_DINH() {
  khoa_();
  var mk = bam_('123456'), n = 0;
  doc_('TaiKhoan').forEach(function(t){
    if (chuan_(t.MatKhauMaHoa) === mk && String(t.DoiMatKhauLanDau).trim() !== 'Có') {
      suaO_('TaiKhoan', t._row, 'DoiMatKhauLanDau', 'Có');
      n++;
    }
  });
  Logger.log('Đã bật "phải đổi mật khẩu" cho ' + n + ' tài khoản đang dùng 123456.');
}

/* 5) Bổ sung mã ghi cho các vi phạm cũ bị thiếu (vi phạm nhập trễ tự động trước đây không có mã,
   nên không xóa lẻ được trên giao diện). */
function BO_SUNG_MA_GHI_VIPHAM() {
  khoa_();
  var sh = ss_().getSheetByName('ViPham');
  if (!sh || sh.getLastRow() < 2) { Logger.log('Sheet ViPham trống.'); return; }
  var head = dauCot_('ViPham');
  var cMa = head.indexOf('MaGhi'), cNg = head.indexOf('NguoiGhi');
  var rng = sh.getRange(2, 1, sh.getLastRow() - 1, head.length);
  var v = rng.getValues(), n = 0;
  v.forEach(function(r){
    if (r.join('') === '' || String(r[cMa]).trim()) return;
    r[cMa] = ma_('VP');
    if (cNg >= 0 && !String(r[cNg]).trim()) r[cNg] = 'Hệ thống (tự động)';
    n++;
  });
  if (n) { rng.setValues(v); xoaCache_('ViPham'); }
  Logger.log('Đã bổ sung mã ghi cho ' + n + ' vi phạm.');
}

/* 6) Tạo sheet NgayLe (ngày nghỉ lễ của cả nhà máy hoặc từng xưởng).
   Sau khi tạo: mở sheet NgayLe, thêm các ngày Tết Âm lịch, Giỗ Tổ… theo thông báo nghỉ của công ty.
   Cột MaXuong để trống = cả nhà máy nghỉ; ghi mã xưởng (VD CNC) nếu chỉ xưởng đó nghỉ. */
function TAO_SHEET_NGAY_LE() {
  var ss = ss_();
  if (ss.getSheetByName('NgayLe')) { Logger.log('Sheet NgayLe đã có — giữ nguyên.'); return; }
  var sh = ss.insertSheet('NgayLe');
  sh.getRange(1, 1, 1, 3).setValues([['Ngay', 'TenLe', 'MaXuong']])
    .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange(2, 1, 400, 1).setNumberFormat('@');   // giữ ngày ở dạng chữ yyyy-MM-dd
  var mau = [
    ['2026-09-01', 'Quốc khánh (nghỉ kèm)', ''],
    ['2026-09-02', 'Quốc khánh', ''],
    ['2027-01-01', 'Tết Dương lịch', '']
  ];
  sh.getRange(2, 1, mau.length, 3).setValues(mau);
  sh.setColumnWidth(1, 110); sh.setColumnWidth(2, 220);
  Logger.log('Đã tạo sheet NgayLe với ' + mau.length + ' ngày mẫu. Hãy thêm Tết Âm lịch, Giỗ Tổ, 30/4–1/5… theo lịch nghỉ của công ty.');
}

/* Danh sách dòng NhatKySanXuat có ngày sai (dùng chung cho kiểm tra & sửa) */
function dsNgaySaiNhatKy_() {
  var sh = ss_().getSheetByName('NhatKySanXuat');
  if (!sh || sh.getLastRow() < 2) return [];
  var head = dauCot_('NhatKySanXuat');
  var cNgay = head.indexOf('Ngay'), cTD = head.indexOf('ThoiDiemNhap'), cNV = head.indexOf('MaNV'),
      cCD = head.indexOf('MaCD'), cTT = head.indexOf('TrangThai');
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues();
  var hn = homNayVN_(), out = [];
  v.forEach(function(r, i){
    if (r.join('') === '') return;
    var raw = r[cNgay];
    var ng = (Object.prototype.toString.call(raw) === '[object Date]')
      ? (isNaN(raw.getTime()) ? '' : Utilities.formatDate(raw, TZ_VN, 'yyyy-MM-dd')) : String(raw || '').trim().slice(0, 10);
    var ngNhap = r[cTD] ? ngayVN_(r[cTD]) : hn;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngNhap)) ngNhap = hn;
    var hopLe = /^\d{4}-\d{2}-\d{2}$/.test(ng) && congNgay_(ng, 0) === ng && ng >= NGAY_MO_HE_THONG && ng <= ngNhap;
    if (hopLe) return;
    // Đề xuất: đảo ngày <-> tháng (lỗi hay gặp khi điện thoại hiểu 01/08 thành 8 tháng 1)
    var deXuat = '', chac = false;
    var m = ng.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      var dao = m[1] + '-' + m[3] + '-' + m[2];
      if (congNgay_(dao, 0) === dao && dao !== ng && dao >= NGAY_MO_HE_THONG && dao <= ngNhap && dao >= congNgay_(ngNhap, -45)) {
        deXuat = dao; chac = true;
      } else if (ng > ngNhap && Number(m[1]) === Number(ngNhap.slice(0, 4))) {
        // Ngày sau lúc nhập (VD nhập 03/09 cho "28/09") -> có thể nhầm tháng: gợi ý tháng trước
        var p0 = Number(m[2]) - 1, y0 = Number(m[1]);
        if (p0 < 1) { p0 = 12; y0--; }
        var thangTruoc = y0 + '-' + ('0' + p0).slice(-2) + '-' + m[3];
        if (congNgay_(thangTruoc, 0) === thangTruoc && thangTruoc <= ngNhap && thangTruoc >= congNgay_(ngNhap, -45)) deXuat = thangTruoc;
      } else if (Number(m[1]) !== Number(ngNhap.slice(0, 4))) {
        var cungNam = ngNhap.slice(0, 4) + '-' + m[2] + '-' + m[3];   // năm gõ nhầm (VD 1483)
        if (congNgay_(cungNam, 0) === cungNam && cungNam <= ngNhap && cungNam >= congNgay_(ngNhap, -45)) deXuat = cungNam;
      }
    }
    out.push({ dong: i + 2, cot: cNgay + 1, ngay: ng || String(raw), maNV: r[cNV], maCD: r[cCD],
               trangThai: r[cTT], ngayNhap: ngNhap, deXuat: deXuat, chac: chac });
  });
  return out;
}

/* 7) SỬA NGÀY SAI TRONG NHẬT KÝ SẢN XUẤT
   Bước 1: để CHE_DO = 'XEM', bấm Chạy, đọc danh sách + đề xuất trong Nhật ký thực thi.
   Bước 2: đổi CHE_DO = 'SUA', Chạy lại: CHỈ sửa các dòng chắc chắn (ngày và tháng bị đảo).
   Dòng không đoán chắc được (ô trống, #VALUE!, năm lạ) -> sửa tay trong Sheet theo gợi ý. */
function SUA_NGAY_NHAT_KY() {
  var CHE_DO = 'XEM';   // <-- đổi thành 'SUA' ở bước 2

  var ds = dsNgaySaiNhatKy_();
  var L = ['=== ' + ds.length + ' dòng nhật ký có ngày sai (chế độ ' + CHE_DO + ') ==='];
  ds.forEach(function(d){
    L.push('Dòng ' + d.dong + ' | ' + d.maNV + ' | ' + d.maCD + ' | ' + d.trangThai + ' | ngày đang ghi: ' + d.ngay +
      ' | nhập lúc: ' + d.ngayNhap + ' | ' + (d.chac ? 'TỰ SỬA thành ' + d.deXuat : (d.deXuat ? 'có thể là ' + d.deXuat + ' (sửa tay)' : 'không đoán được — hỏi trưởng phòng rồi sửa tay')));
  });
  if (CHE_DO === 'SUA') {
    khoa_();
    var sh = ss_().getSheetByName('NhatKySanXuat'), n = 0;
    ds.forEach(function(d){
      if (!d.chac) return;
      sh.getRange(d.dong, d.cot).setValue(d.deXuat);
      n++;
    });
    xoaCache_('NhatKySanXuat');
    ghiLog_({ tk: 'HE_THONG', ten: 'Chạy tay' }, 'Sửa ngày sai nhật ký', n + ' dòng (đảo ngày/tháng)');
    L.push('ĐÃ SỬA ' + n + ' dòng. Sau khi sửa, nếu tháng đó đã chốt thì chốt lại tháng đó để bảng KPI cập nhật.');
  }
  Logger.log(L.join('\n'));
}
