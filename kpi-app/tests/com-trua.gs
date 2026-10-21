
/* ================== CƠM TRƯA (11/10) ==================
   Bếp (vai trò BEP) hoặc ban điều hành báo THỰC ĐƠN cho một ngày (thường 14–15h hôm trước).
   Mọi tài khoản tự đăng ký "Ăn" / "Không ăn". Hai mốc, đều tính theo NGÀY HÔM TRƯỚC ngày ăn (bữa thứ Hai -> Chủ nhật), chủ dự án 12/10:
   - 16:00 (Script Property COM_GIO_CHOT): HẠN ĐĂNG KÝ – bếp chốt số suất, đặt đồ ăn; tổng hợp ghi rõ ai đăng ký / đổi sau giờ này.
   - 22:00 (Script Property COM_GIO_KHOA): HẠN THAY ĐỔI (trường hợp cá biệt) – quá giờ thì KHÔNG đăng ký / đổi / báo suất / đăng ký hộ được nữa.
   Ban điều hành (+ trợ lý BĐH) xem tổng hợp số suất theo xưởng kèm họ tên, mã NV; bếp, nhân sự chỉ xem SỐ suất; trưởng / phó phòng xem số của mọi xưởng
   và danh sách tên của xưởng mình.
   Sang tháng mới (cùng lúc chốt KPI tháng): số suất theo xưởng ghi vào sheet SuatAnThang (đưa vào báo cáo tháng),
   danh sách chi tiết lưu thành 1 file bảng tính trên Google Drive (thư mục báo cáo tháng) rồi mới xóa khỏi sheet.
   Sheet tự tạo khi dùng lần đầu: ThucDon, DangKyCom, SuatAnThang. */
var COM_SHEET = {
  ThucDon: ['Ngay', 'MonAn', 'GhiChu', 'NguoiNhap', 'CapNhat', 'MonDoi'],   // MonDoi: JSON [{m: món có thể bớt / đổi, t: món thay (trống = chỉ bớt)}]
  DangKyCom: ['Ngay', 'TenDangNhap', 'HoTen', 'MaNV', 'MaXuong', 'An', 'ThoiDiem', 'DangKyHo', 'SoSuat', 'SoSuatNoiKhac', 'BoMon'],   // BoMon: JSON {món: 'b' bớt | 'd' đổi} (nhóm: {món: [bớt, đổi]}); DangKyHo: tên người đăng ký hộ (trống = tự đăng ký); SoSuat: số suất tài khoản NHÓM báo
  SuatAnThang: ['Ky', 'MaXuong', 'TenXuong', 'SoNgay', 'SuatAn', 'KhongAn', 'ChuaDangKy', 'TepLuu']
};
var COM_VP = 'VP';                       // nhóm Ban điều hành + trưởng phòng + tài khoản không gắn xưởng
var COM_TEN_VP = 'Ban điều hành và trưởng bộ phận';
/* Chủ dự án 11/10: chỉ trưởng phòng ăn cùng ban điều hành -> suất tính vào nhóm VP, không tính theo xưởng. Phó phòng, trưởng 4 bộ phận ngoài sản xuất (TBP) vẫn tính theo xưởng / bộ phận. */
function comMx_(vaiTro, maXuong) { var v = String(vaiTro || '').trim(); return v === 'TP' ? COM_VP : (String(maXuong || '').trim() || COM_VP); }
/* Nhóm ngoài xưởng sản xuất (chủ dự án 11/10, thay 4 bộ phận cũ): mỗi nhóm 1 tài khoản vai trò NHOM, mỗi ngày có thực đơn
   nhóm báo TỔNG SỐ SUẤT (chưa có danh sách nhân sự). KHÔNG nằm trong sheet PhongBan nên không vào KPI. Giữ đúng mã như va-com.js. */
var COM_BO_PHAN = {
  HNAM_BEP: 'Bếp + lái xe + bảo vệ (Hà Nam)',
  HNAM_KTK: 'Kế toán kho + tạp vụ (Hà Nam)',
  HNOI_MAY: 'May + kế toán kho + lái xe (Hà Nội)',
  HNOI_MKT: 'Marketing (Hà Nội)',
  HNOI_STORE: 'Store 47 Nguyễn Tuân (Hà Nội)',
  HNOI_HCKT: 'Hành chính – kế toán (Hà Nội)'
};
var COM_MAX_SUAT = 300;
function comHaNoi_(mx) { return /^HNOI_/.test(String(mx || '')); }   // nhóm ăn ở Hà Nội
function comNoiTen_(haNoi) { return haNoi ? 'Hà Nội' : 'Hà Nam'; }
/* Nhóm báo cơm (chủ dự án 12/10): SoSuat = TỔNG suất của nhóm; SoSuatNoiKhac = số suất trong đó ăn ở nơi kia (người Hà Nội xuống Hà Nam có việc, hoặc ngược lại) */
function comKhac_(r) { return Math.max(0, Math.min(Number(r.SoSuat) || 0, Number(r.SoSuatNoiKhac) || 0)); }
/* ===== Bớt / đổi món (chủ dự án 13/10): bếp đánh dấu tối đa 3 món "có thể bớt / đổi" (+ món thay, không bắt buộc);
   người đã đăng ký ĂN chọn từng món: ăn bình thường / không ăn (bớt) / đổi sang món thay. Trưởng phòng sửa hộ được.
   Nhóm báo tổng: số suất bớt + số suất đổi của từng món. Tổng hợp cộng theo xưởng để bếp biết nấu bao nhiêu suất mỗi món. */
var COM_MAX_MON_DOI = 3;
function comJson_(v, macDinh) { try { var x = JSON.parse(String(v || '')); return x && typeof x === 'object' ? x : macDinh; } catch (e) { return macDinh; } }
function comMonDoi_(r) {   // danh sách món bớt / đổi của 1 dòng ThucDon
  return (comJson_(r && r.MonDoi, []) || []).filter(function(x) { return x && String(x.m || '').trim(); })
    .map(function(x) { return { m: String(x.m).trim().slice(0, 60), t: String(x.t || '').trim().slice(0, 60) }; }).slice(0, COM_MAX_MON_DOI);
}
/* Chuẩn hóa lựa chọn của 1 người theo thực đơn ngày đó: chỉ giữ món còn trong danh sách; chọn "đổi" mà món không có món thay -> bớt */
function comBoNguoi_(bo, ds) {
  var o = {}; bo = bo && typeof bo === 'object' ? bo : {};
  ds.forEach(function(x) { var v = bo[x.m]; if (v === 'b' || v === 'd') o[x.m] = (v === 'd' && !x.t) ? 'b' : v; });
  return o;
}
/* Nhóm: {món: [bớt, đổi, bớt ở nơi kia, đổi ở nơi kia]} – số nguyên >= 0; 2 số đầu là suất ăn ở nơi làm việc của nhóm (<= so − khac),
   2 số sau là suất ăn ở nơi kia (<= khac; chủ dự án 13/10: bếp phải biết suất đổi món ở Hà Nội hay Hà Nam). Không có nơi kia thì chỉ ghi [bớt, đổi]. null nếu sai */
function comBoNhom_(bo, ds, so, khac) {
  var o = {}, sai = false, k = Math.max(0, Math.min(so, Number(khac) || 0)), nha = so - k; bo = bo && typeof bo === 'object' ? bo : {};
  var so_ = function(v) { var n = Number(v) || 0; if (n < 0 || n !== Math.floor(n)) sai = true; return n; };
  ds.forEach(function(x) {
    var v = bo[x.m]; if (!v) return;
    var b = so_(v[0]), d = x.t ? so_(v[1]) : 0, bk = k ? so_(v[2]) : 0, dk = k && x.t ? so_(v[3]) : 0;   // không có suất ở nơi kia: bỏ qua 2 số sau
    if (b + d > nha || bk + dk > k) { sai = true; return; }
    if (bk || dk) o[x.m] = [b, d, bk, dk]; else if (b || d) o[x.m] = [b, d];
  });
  return sai ? null : o;
}
function comLaNhom_(t) { return String(t.VaiTro || t.vaiTro || '').trim() === 'NHOM'; }
function comLaTruong_(me) { return !!me && (me.vaiTro === 'TP' || me.vaiTro === 'TBP') && !!me.xuong; }   // trưởng xưởng / trưởng bộ phận

function comSheet_(ten) {
  var ss = ss_(), sh = ss.getSheetByName(ten);
  if (!sh || sh.getLastColumn() === 0) {          // chưa có, hoặc có nhưng trống trơn (chưa có dòng tiêu đề) -> ghi tiêu đề
    if (!sh) sh = ss.insertSheet(ten);
    sh.getRange(1, 1, 1, COM_SHEET[ten].length).setValues([COM_SHEET[ten]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1000, 1).setNumberFormat('@');          // ngày / kỳ lưu dạng văn bản 'yyyy-MM-dd'
    delete __DOC_CACHE[ten]; delete __HEAD_CACHE[ten];
  } else {
    // sheet tạo từ bản cũ: thêm cột mới còn thiếu vào cuối dòng tiêu đề
    var head = dauCot_(ten).map(String), thieu = COM_SHEET[ten].filter(function(h) { return head.indexOf(h) < 0; });
    if (thieu.length) {
      sh.getRange(1, head.length + 1, 1, thieu.length).setValues([thieu]).setFontWeight('bold');
      delete __DOC_CACHE[ten]; delete __HEAD_CACHE[ten];
    }
  }
  return sh;
}
function comDoc_(ten) { comSheet_(ten); return doc_(ten); }
function comNgay_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ_VN, 'yyyy-MM-dd') : String(v || '').replace(/^'/, '').slice(0, 10); }
function comGioProp_(ten, macDinh) {
  var v = PropertiesService.getScriptProperties().getProperty(ten), g = Number(v);
  return v !== null && String(v).trim() !== '' && g >= 1 && g < 24 && g === Math.floor(g) ? g : macDinh;
}
function comGioChot_() { return comGioProp_('COM_GIO_CHOT', 16); }                          // hạn đăng ký (bếp chốt số, đặt đồ)
function comGioKhoa_() { return Math.max(comGioChot_(), comGioProp_('COM_GIO_KHOA', 22)); }  // hạn thay đổi, quá giờ là khóa
/* Các mốc của ngày ăn `ngay` – giờ của NGÀY HÔM TRƯỚC, dạng 'yyyy-MM-dd HH:mm' (thứ Hai -> Chủ nhật) */
function comHan_(ngay) { return congNgay_(ngay, -1) + ' ' + ('0' + comGioChot_()).slice(-2) + ':00'; }
function comKhoa_(ngay) { return congNgay_(ngay, -1) + ' ' + ('0' + comGioKhoa_()).slice(-2) + ':00'; }
function comBayGio_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function comConHan_(ngay) { return comBayGio_() < comHan_(ngay); }   // còn trước hạn đăng ký 16:00
function comConMo_(ngay) { return comBayGio_() < comKhoa_(ngay); }   // còn trước giờ khóa 22:00
function comMoc_(h) { return h.slice(11) + ' ngày ' + h.slice(8, 10) + '/' + h.slice(5, 7); }
function comKhoaMsg_(ngay) {
  var h = comKhoa_(ngay);
  return 'Đã chốt đăng ký cơm trưa ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + ' lúc ' + h.slice(11) + ' ngày ' + h.slice(8, 10) + '/' + h.slice(5, 7) + ' – không đổi được nữa. Có việc gấp thì báo trực tiếp với bếp.';
}
function comThoi_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ_VN, 'yyyy-MM-dd HH:mm') : String(v || '').replace(/^'/, '').slice(0, 16); }
function comXem_(me) { return ['ADMIN', 'HR', 'BEP', 'TP', 'TL', 'TBP', 'NHOM'].indexOf(me.vaiTro) >= 0; }   // NHOM: xem số suất toàn công ty như bếp (chủ dự án 11/10)
function comSua_(me) { return me.vaiTro === 'ADMIN' || me.vaiTro === 'BEP' || me.vaiTro === 'TL' || me.vaiTro === 'HR'; }   // TL = trợ lý ban điều hành

/* Tài khoản bếp: chỉ phục vụ cơm nước – không đăng ký suất, không tính vào số người */
function comLaBep_(t) { return String(t.VaiTro || t.vaiTro || '').trim() === 'BEP'; }
/* Chủ dự án 11/10: tài khoản Nhân sự (HR) và Kiểm soát chất lượng (QC) KHÔNG tính suất cơm (không đăng ký, không vào tổng hợp) */
function comKhongTinh_(t) { var v = String(t.VaiTro || t.vaiTroGoc || t.vaiTro || '').trim(); return v === 'HR' || v === 'QC'; }
function comTkBep_() { var m = {}; doc_('TaiKhoan').forEach(function(t) { if (comLaBep_(t) || comKhongTinh_(t)) m[String(t.TenDangNhap).toLowerCase()] = 1; }); return m; }

/* Người cần đăng ký: tài khoản đang dùng (bỏ tài khoản có hồ sơ đã nghỉ việc và tài khoản bếp) */
function comNguoi_() {
  var nghi = {};
  docAnToan_('NhanSu').forEach(function(n) { if (String(n.TrangThai).trim() === 'Nghỉ việc') nghi[String(n.MaNV).trim()] = 1; });
  return doc_('TaiKhoan').filter(function(t) {
    return String(t.TrangThai).trim() === 'Đang dùng' && !comLaBep_(t) && !comLaNhom_(t) && !comKhongTinh_(t) && !(t.MaNV && nghi[String(t.MaNV).trim()]);
  }).map(function(t) {
    return { tk: String(t.TenDangNhap).toLowerCase(), ten: t.HoTen, ma: String(t.MaNV || '').trim(), mx: comMx_(t.VaiTro, t.MaXuong), xg: String(t.MaXuong || '').trim() };
  });
}
function comTenX_() {
  var m = {}; for (var k in COM_BO_PHAN) m[k] = COM_BO_PHAN[k]; docAnToan_('PhongBan').forEach(function(p) { m[p.MaXuong] = p.TenXuong; }); m[COM_VP] = COM_TEN_VP; return m;
}

/* Tổng hợp một ngày: { ngay, xuong:[{mx, ten, an, khong, chua, dsAn, dsKhong, dsChua}], an, khong, chua } */
/* Người đang nghỉ dài hạn (thai sản, ốm dài… – trưởng phòng ghi ở sheet NghiDaiHan) trong ngày `ngay`: MaNV -> loại nghỉ.
   Chủ dự án 12/10: chưa đăng ký thì tự tính KHÔNG ĂN; ai tự đăng ký (hoặc được đăng ký hộ) thì theo lượt đăng ký đó. */
function comNghiDai_(ngay) {
  var m = {};
  docAnToan_('NghiDaiHan').forEach(function(r) { if (ngayVN_(r.TuNgay) <= ngay && ngay <= ngayVN_(r.DenNgay)) m[String(r.MaNV).trim()] = String(r.Loai || 'Nghỉ dài hạn'); });
  return m;
}
function comTongHop_(ngay, me) {
  var nguoi = comNguoi_(), tenX = comTenX_(), dk = {}, bep = comTkBep_();
  comDoc_('DangKyCom').forEach(function(r) { if (comNgay_(r.Ngay) === ngay && !bep[String(r.TenDangNhap).toLowerCase()]) dk[String(r.TenDangNhap).toLowerCase()] = r; });
  var X = {}, ctKhong = [], muon = [], han = comHan_(ngay), nhomTk = {}, nhomChua = 0, nd = comNghiDai_(ngay);
  var mdDs = comMonDoi_(comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0]);
  // bớt / đổi món: x.mon[món] = {b, d}; x.dsMon = [{ten, m, k}] (tên chỉ giữ cho người được xem tên)
  var congMon = function(x, r, ten) {
    if (!mdDs.length || !r) return;
    var bo = comJson_(r.BoMon, {}), laNhom = String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '';
    var o = laNhom ? (comBoNhom_(bo, mdDs, Math.max(0, Number(r.SoSuat) || 0), comKhac_(r)) || {}) : comBoNguoi_(bo, mdDs);
    x.mon = x.mon || {}; x.dsMon = x.dsMon || [];
    mdDs.forEach(function(md) {
      var v = o[md.m]; if (!v) return;
      var c = x.mon[md.m] || (x.mon[md.m] = { b: 0, d: 0 });   // b, d: suất ở nơi của xưởng / nhóm; bk, dk: suất nhóm ăn ở nơi kia
      if (laNhom) { c.b += v[0]; c.d += v[1]; if (v[2] || v[3]) { c.bk = (c.bk || 0) + (v[2] || 0); c.dk = (c.dk || 0) + (v[3] || 0); } } else { c[v]++; x.dsMon.push({ ten: ten, m: md.m, k: v }); }
    });
  };
  var ghiMuon = function(r, ten, ma, mx, tenXg) {
    if (!r || comThoi_(r.ThoiDiem) < han) return;
    var nh = String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '';
    muon.push({ ten: ten, ma: ma, mx: mx, xuong: tenXg, an: nh ? Math.max(0, Number(r.SoSuat) || 0) : (Number(r.An) === 1 ? 1 : 0), nhom: nh, luc: comThoi_(r.ThoiDiem) });
  };
  nguoi.forEach(function(p) {
    var x = X[p.mx] || (X[p.mx] = { mx: p.mx, ten: tenX[p.mx] || p.mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    var r = dk[p.tk];
    ghiMuon(r, p.ten, p.ma, p.mx, x.ten);
    if (!r && p.ma && nd[p.ma]) { x.khong++; x.dsKhong.push(p.ten); ctKhong.push({ ten: p.ten, ma: p.ma, mx: p.mx, xuong: x.ten, nghi: nd[p.ma] }); }   // nghỉ dài hạn: tự không ăn
    else if (!r) { x.chua++; x.dsChua.push(p.ten); }
    else if (Number(r.An) === 1) { x.an++; x.dsAn.push(p.ten); congMon(x, r, p.ten); }
    else { x.khong++; x.dsKhong.push(p.ten); ctKhong.push({ ten: p.ten, ma: p.ma, mx: p.mx, xuong: x.ten }); }
  });
  // tài khoản NHÓM: 1 dòng / nhóm, số suất = số nhóm báo (chưa báo -> ghi nhận để nhắc)
  doc_('TaiKhoan').forEach(function(t) {
    if (!comLaNhom_(t) || String(t.TrangThai).trim() !== 'Đang dùng') return;
    var tk = String(t.TenDangNhap).toLowerCase(), mx = String(t.MaXuong || '').trim() || tk, r = dk[tk];
    nhomTk[tk] = 1;
    var x = X[mx] || (X[mx] = { mx: mx, ten: tenX[mx] || t.HoTen || mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [], nhom: true, baoChua: 0, noiKhac: 0 });
    x.nhom = true;
    if (r) { x.an += Math.max(0, Number(r.SoSuat) || 0); x.noiKhac = (x.noiKhac || 0) + comKhac_(r); ghiMuon(r, x.ten, '', mx, x.ten); congMon(x, r, x.ten); }
    else { x.baoChua++; nhomChua++; }
  });
  // người đã đăng ký nhưng tài khoản nay không còn trong danh sách vẫn được tính suất
  Object.keys(dk).forEach(function(k) {
    if (nhomTk[k] || nguoi.some(function(p) { return p.tk === k; })) return;
    var r = dk[k], mx = String(r.MaXuong || '') || COM_VP;
    var x = X[mx] || (X[mx] = { mx: mx, ten: tenX[mx] || mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    if (String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '') { x.an += Math.max(0, Number(r.SoSuat) || 0); x.nhom = true; return; }   // nhóm đã xóa tài khoản
    if (Number(r.An) === 1) { x.an++; x.dsAn.push(r.HoTen); congMon(x, r, r.HoTen); } else { x.khong++; x.dsKhong.push(r.HoTen); ctKhong.push({ ten: r.HoTen, ma: String(r.MaNV || ''), mx: mx, xuong: x.ten }); }
  });
  var ds = Object.keys(X).map(function(k) { return X[k]; }).sort(function(a, b) {
    return (a.mx === COM_VP) - (b.mx === COM_VP) || (!!a.nhom) - (!!b.nhom) || String(a.ten).localeCompare(String(b.ten));
  });
  // họ tên / mã NV: ban điều hành, trợ lý BĐH, nhân sự xem cả nhà máy; trưởng phòng xưởng mình; bếp chỉ thấy SỐ suất (chủ dự án 11/10)
  var tenOk = me && (me.vaiTro === 'ADMIN' || me.vaiTro === 'TL' || me.vaiTro === 'HR');
  ds.forEach(function(x) {
    if (!(tenOk || (comLaTruong_(me) && x.mx === me.xuong))) { delete x.dsAn; delete x.dsKhong; delete x.dsChua; delete x.dsMon; }
  });
  var tong = function(k) { return ds.reduce(function(s, x) { return s + x[k]; }, 0); };
  // danh sách người KHÔNG ĂN đủ họ tên, mã NV, xưởng: ban điều hành / nhân sự / bếp thấy cả nhà máy, trưởng phòng thấy xưởng mình
  var choXem = function(c) { return tenOk || (comLaTruong_(me) && c.mx === me.xuong); };
  ctKhong = ctKhong.filter(choXem).sort(function(a, b) { return String(a.xuong).localeCompare(String(b.xuong)) || String(a.ten).localeCompare(String(b.ten)); });
  var muonAn = muon.reduce(function(s, m) { return s + (m.nhom ? m.an : (m.an ? 1 : 0)); }, 0);
  // chủ dự án 11/10: tổng suất theo nơi ăn – Hà Nội = các nhóm mã HNOI_*, còn lại (xưởng sản xuất, ban điều hành, nhóm Hà Nam) = Hà Nam
  // nhóm báo cơm có thể có suất ăn ở nơi kia (SoSuatNoiKhac) -> cộng vào đúng nơi ăn, ghi lại để bếp biết vì sao số thay đổi
  var noi = { haNam: 0, haNoi: 0 }, sang = [];
  ds.forEach(function(x) {
    var hn = comHaNoi_(x.mx), k = x.noiKhac || 0;
    noi[hn ? 'haNoi' : 'haNam'] += x.an - k; noi[hn ? 'haNam' : 'haNoi'] += k;
    if (k) { x.noiKhacTen = comNoiTen_(!hn); sang.push({ ten: x.ten, so: k, tu: comNoiTen_(hn), den: comNoiTen_(!hn) }); }
  });
  // bếp: mỗi món bớt / đổi nấu bao nhiêu suất (= tổng suất ăn − bớt − đổi), món thay bao nhiêu suất
  // 13/10: tách theo nơi ăn (noi.haNam / noi.haNoi: b, d, nau) – cùng thực đơn nhưng mỗi nơi nấu riêng
  var tongAn = tong('an'), monDoi = mdDs.map(function(md) {
    var b = 0, d = 0, n = { haNam: { b: 0, d: 0 }, haNoi: { b: 0, d: 0 } };
    ds.forEach(function(x) {
      var c = x.mon && x.mon[md.m]; if (!c) return;
      var hn = comHaNoi_(x.mx), nha = n[hn ? 'haNoi' : 'haNam'], kia = n[hn ? 'haNam' : 'haNoi'];
      nha.b += c.b; nha.d += c.d; kia.b += c.bk || 0; kia.d += c.dk || 0;
      b += c.b + (c.bk || 0); d += c.d + (c.dk || 0);
    });
    n.haNam.nau = Math.max(0, noi.haNam - n.haNam.b - n.haNam.d); n.haNoi.nau = Math.max(0, noi.haNoi - n.haNoi.b - n.haNoi.d);
    return { m: md.m, t: md.t, b: b, d: d, nau: Math.max(0, tongAn - b - d), noi: n };
  });
  return { ngay: ngay, monDoi: monDoi, xuong: ds, an: tongAn, khong: tong('khong'), chua: tong('chua'), nhomChua: nhomChua, haNam: noi.haNam, haNoi: noi.haNoi, sangNoiKhac: sang, dsKhongCT: ctKhong,
    muon: muon.length, muonAn: muonAn, dsMuon: muon.filter(function(m) { return m.nhom || choXem(m); }).sort(function(a, b) { return a.luc < b.luc ? -1 : 1; }) };
}

/* Dữ liệu cho thanh thực đơn + trang Cơm trưa */
function napComTrua(token) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
    var homNay = homNayVN_(), den = congNgay_(homNay, 14);
    var td = comDoc_('ThucDon').map(function(r) {
      var ng = comNgay_(r.Ngay);
      return { ngay: ng, mon: String(r.MonAn || ''), monDoi: comMonDoi_(r), ghiChu: String(r.GhiChu || ''), han: comHan_(ng), conHan: comConHan_(ng), khoa: comKhoa_(ng), mo: comConMo_(ng), nguoi: String(r.NguoiNhap || '') };
    }).filter(function(t) { return t.ngay >= congNgay_(homNay, -7) && t.ngay <= den; }).sort(function(a, b) { return a.ngay < b.ngay ? -1 : 1; });
    var cuaToi = {}, cuaToiHo = {}, cuaToiKhac = {}, cuaToiBo = {}, tk = String(me.tk).toLowerCase(), ky = homNay.slice(0, 7), laNhom = comLaNhom_(me);
    var thang = { an: 0, khong: 0 };
    comDoc_('DangKyCom').forEach(function(r) {
      if (String(r.TenDangNhap).toLowerCase() !== tk) return;
      var ng = comNgay_(r.Ngay), an = Number(r.An) === 1 ? 1 : 0;
      cuaToiBo[ng] = an ? comJson_(r.BoMon, {}) : {};
      if (laNhom) { var so = Math.max(0, Number(r.SoSuat) || 0); cuaToi[ng] = so; cuaToiKhac[ng] = comKhac_(r); if (ng.slice(0, 7) === ky) thang.an += so; return; }   // nhóm: cuaToi = số suất đã báo
      cuaToi[ng] = an; if (r.DangKyHo) cuaToiHo[ng] = String(r.DangKyHo); else delete cuaToiHo[ng];
      if (ng.slice(0, 7) === ky) thang[an ? 'an' : 'khong']++;
    });
    var out = { ok: true, homNay: homNay, bayGio: comBayGio_(), gioChot: comGioChot_(), gioKhoa: comGioKhoa_(), thucDon: td, cuaToi: cuaToi, cuaToiHo: cuaToiHo, cuaToiKhac: cuaToiKhac, cuaToiBo: cuaToiBo, noiNha: comNoiTen_(comHaNoi_(me.xuong)), noiKia: comNoiTen_(!comHaNoi_(me.xuong)), thang: thang,
      quyen: { xem: comXem_(me), sua: comSua_(me), dangKy: !comLaBep_(me) && !laNhom && !comKhongTinh_(me), khongTinh: comKhongTinh_(me), nhom: laNhom, maxSuat: COM_MAX_SUAT, ho: ['ADMIN', 'TL', 'HR'].indexOf(me.vaiTro) >= 0 || comLaTruong_(me) }, tongHop: [] };
    if (out.quyen.ho) {
      // danh sách người được đăng ký hộ + trạng thái các ngày có thực đơn sắp tới: hoDK[ngay][tk] = [an, ai đăng ký hộ]
      var tenX = comTenX_(), ngays = {};
      td.forEach(function(t) { if (t.ngay >= homNay) ngays[t.ngay] = {}; });
      out.hoNguoi = comNguoi_().filter(function(p) { return comHoDuoc_(me, p) && p.tk !== tk; })
        .map(function(p) { return { tk: p.tk, ten: p.ten, ma: p.ma, xuong: tenX[p.mx] || p.mx }; })
        .sort(function(a, b) { return String(a.xuong).localeCompare(String(b.xuong)) || String(a.ten).localeCompare(String(b.ten)); });
      comDoc_('DangKyCom').forEach(function(r) { var o = ngays[comNgay_(r.Ngay)]; if (o) o[String(r.TenDangNhap).toLowerCase()] = [Number(r.An) === 1 ? 1 : 0, String(r.DangKyHo || ''), '', Number(r.An) === 1 ? comJson_(r.BoMon, {}) : {}]; });
      var dsNg = comNguoi_();   // người nghỉ dài hạn chưa đăng ký: coi như đã báo không ăn (nút "đăng ký ăn cho tất cả" bỏ qua họ)
      Object.keys(ngays).forEach(function(ng) { var nd = comNghiDai_(ng), o = ngays[ng];
        dsNg.forEach(function(p) { if (p.ma && nd[p.ma] && !o[p.tk]) o[p.tk] = [0, '', nd[p.ma]]; }); });
      out.hoDK = ngays;
    }
    if (out.quyen.xem) {
      // tổng hợp các ngày có thực đơn từ hôm nay trở đi (ngày gần nhất trước)
      out.tongHop = td.filter(function(t) { return t.ngay >= homNay; }).slice(0, 4).map(function(t) { return comTongHop_(t.ngay, me); });
    }
    return sach_(out);
  } catch (e) { return sach_({ ok: false, msg: 'Lỗi tải cơm trưa: ' + e.message }); }
}

/* Xem lại tổng hợp số suất một ngày ĐÃ QUA (chủ dự án 13/10: "phải xem lại được đăng ký cơm ngày thứ 2").
   Dữ liệu còn tới khi chốt tháng (sau đó chuyển vào file lưu tháng trên Drive). */
function xemTongHopCom(token, ngay) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
    if (!comXem_(me)) return sach_({ ok: false, msg: 'Tài khoản của bạn không xem được tổng hợp số suất.' });
    ngay = String(ngay || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
    if (ngay > homNayVN_()) return sach_({ ok: false, msg: 'Ngày này chưa tới – xem ở phần tổng hợp phía trên.' });
    var co = comDoc_('ThucDon').some(function(r) { return comNgay_(r.Ngay) === ngay; }) ||
      comDoc_('DangKyCom').some(function(r) { return comNgay_(r.Ngay) === ngay; });
    if (!co) return sach_({ ok: false, msg: 'Không có dữ liệu cơm trưa ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + ' (ngày không nấu, hoặc tháng đã chốt – xem file "Đăng ký cơm trưa" của tháng đó trên Drive).' });
    return sach_({ ok: true, tongHop: comTongHop_(ngay, me) });
  } catch (e) { return sach_({ ok: false, msg: 'Lỗi tải tổng hợp: ' + e.message }); }
}

function dangKyCom(token, ngay, an, bo) {   // bo: {món: 'b' | 'd'} – không truyền thì giữ lựa chọn bớt / đổi cũ
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (comLaBep_(me)) return sach_({ ok: false, msg: 'Tài khoản bếp chỉ báo thực đơn và xem số suất, không cần đăng ký ăn.' });
  if (comLaNhom_(me)) return sach_({ ok: false, msg: 'Tài khoản nhóm báo tổng số suất, không đăng ký Ăn / Không ăn.' });
  if (comKhongTinh_(me)) return sach_({ ok: false, msg: 'Tài khoản nhân sự / kiểm soát chất lượng không tính suất cơm.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  khoa_();
  var td = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!td) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var v = an ? 1 : 0, boN = bo === undefined || bo === null ? undefined : comBoNguoi_(bo, comMonDoi_(td));
  comGhi_({ tk: String(me.tk).toLowerCase(), ten: me.ten, ma: me.maNV || '', mx: comMx_(me.vaiTroGoc || me.vaiTro, me.xuong) }, ngay, v, '', undefined, undefined, boN);
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7);
  return sach_({ ok: true, ngay: ngay, an: v, bo: v ? (boN === undefined ? comBoCua_(me.tk, ngay) : boN) : {},
    msg: v ? (boN !== undefined ? 'Đã cập nhật món ăn trưa ' + ng + (comBoChu_(boN, comMonDoi_(td)) ? ': ' + comBoChu_(boN, comMonDoi_(td)) : ': ăn đủ các món') + '.' : 'Đã đăng ký ăn trưa ' + ng + '.') : 'Đã báo không ăn trưa ' + ng + '.' });
}

function comBoCua_(tk, ngay) {
  var r = comDoc_('DangKyCom').filter(function(x) { return comNgay_(x.Ngay) === ngay && String(x.TenDangNhap).toLowerCase() === String(tk).toLowerCase(); })[0];
  return r ? comJson_(r.BoMon, {}) : {};
}
function comBoChu_(bo, ds) {   // "không ăn Cá kho, đổi Thịt luộc -> Trứng rán"
  return ds.filter(function(x) { return bo[x.m]; }).map(function(x) { return bo[x.m] === 'd' ? 'đổi ' + x.m + ' → ' + x.t : 'không ăn ' + x.m; }).join(', ');
}
/* Ghi 1 lượt đăng ký (tự đăng ký: ho = ''; đăng ký hộ: ho = tên người đăng ký hộ) */
function comGhi_(p, ngay, v, ho, soSuat, khac, bo) {
  var ss = soSuat === undefined || soSuat === null ? '' : soSuat, kh = ss === '' ? '' : (khac || 0);
  var thoi = comBayGio_();
  var cu = comDoc_('DangKyCom').filter(function(r) { return comNgay_(r.Ngay) === ngay && String(r.TenDangNhap).toLowerCase() === p.tk; });
  var boS = !v ? '' : bo === undefined ? (cu.length ? String(cu[0].BoMon || '') : '') : (bo && Object.keys(bo).length ? JSON.stringify(bo) : '');
  if (cu.length) {
    suaO_('DangKyCom', cu[0]._row, 'BoMon', boS);
    suaO_('DangKyCom', cu[0]._row, 'An', v); suaO_('DangKyCom', cu[0]._row, 'ThoiDiem', thoi); suaO_('DangKyCom', cu[0]._row, 'DangKyHo', ho || ''); suaO_('DangKyCom', cu[0]._row, 'SoSuat', ss); suaO_('DangKyCom', cu[0]._row, 'SoSuatNoiKhac', kh);
    if (cu.length > 1) xoaNhieuDong_('DangKyCom', cu.slice(1).map(function(r) { return r._row; }));
  } else {
    them_('DangKyCom', { Ngay: "'" + ngay, TenDangNhap: p.tk, HoTen: p.ten, MaNV: p.ma || '', MaXuong: p.mx || COM_VP, An: v, ThoiDiem: thoi, DangKyHo: ho || '', SoSuat: ss, SoSuatNoiKhac: kh, BoMon: boS });
  }
}

/* Tài khoản NHÓM báo tổng số suất một ngày (sửa được tới giờ khóa 22:00 hôm trước, như mọi người) */
/* so = TỔNG số suất của nhóm; khac = số suất trong đó ăn ở nơi kia (Hà Nội <-> Hà Nam), không bắt buộc */
function baoSuatNhom(token, ngay, so, khac, bo) {   // bo: {món: [số suất bớt, số suất đổi]}
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comLaNhom_(me)) return sach_({ ok: false, msg: 'Chỉ tài khoản nhóm mới báo tổng số suất.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  var n = Number(String(so === undefined || so === null ? '' : so).trim());
  if (String(so).trim() === '' || !(n >= 0) || n !== Math.floor(n)) return sach_({ ok: false, msg: 'Nhập số suất là số nguyên từ 0 trở lên.' });
  if (n > COM_MAX_SUAT) return sach_({ ok: false, msg: 'Số suất quá lớn (tối đa ' + COM_MAX_SUAT + ').' });
  var k = Number(String(khac === undefined || khac === null || khac === '' ? 0 : khac).trim());
  if (!(k >= 0) || k !== Math.floor(k) || k > n) return sach_({ ok: false, msg: 'Số suất ăn ở nơi khác không hợp lệ.' });
  khoa_();
  var tdN = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!tdN) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var boN = bo === undefined || bo === null ? undefined : comBoNhom_(bo, comMonDoi_(tdN), n, k);
  if (boN === null) return sach_({ ok: false, msg: 'Số suất bớt / đổi món không hợp lệ (số nguyên; ở mỗi nơi, không ăn + đổi không quá số suất ăn ở nơi đó).' });
  comGhi_({ tk: String(me.tk).toLowerCase(), ten: me.ten, ma: '', mx: String(me.xuong || '') || COM_VP }, ngay, n > 0 ? 1 : 0, '', n, k, boN);
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7), hn = comHaNoi_(me.xuong);
  return sach_({ ok: true, ngay: ngay, so: n, khac: k, bo: n ? (boN === undefined ? comBoCua_(me.tk, ngay) : boN) : {}, msg: n ? 'Đã báo ' + n + ' suất cơm trưa ' + ng + (k ? ' (' + (n - k) + ' ở ' + comNoiTen_(hn) + ', ' + k + ' ở ' + comNoiTen_(!hn) + ')' : '') + '.' : 'Đã báo nhóm không ăn trưa ' + ng + ' (0 suất).' });
}

/* Đăng ký hộ (chủ dự án 11/10: người lớn tuổi không quen điện thoại / không có mạng):
   trưởng – phó phòng đăng ký hộ người trong xưởng mình, ban điều hành (+ trợ lý) đăng ký hộ người khối văn phòng. dsTk = 1 hoặc nhiều tên đăng nhập. */
function comHoDuoc_(me, p) {   // chủ dự án 11/10: xưởng nào đăng ký hộ xưởng đó; ban điều hành (+ trợ lý) chỉ đăng ký hộ người nhóm VP (ban điều hành, trưởng phòng, tài khoản không gắn xưởng)
  if (me.vaiTro === 'ADMIN' || me.vaiTro === 'TL' || me.vaiTro === 'HR') return p.mx === COM_VP;
  return comLaTruong_(me) && p.mx === String(me.xuong);
}
function dangKyComHo(token, ngay, dsTk, an, bo) {   // bo: lựa chọn bớt / đổi món (chỉ khi đăng ký hộ 1 người); không truyền thì giữ lựa chọn cũ
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && !comLaTruong_(me) && me.vaiTro !== 'TL' && me.vaiTro !== 'HR') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng và ban điều hành được đăng ký hộ.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  khoa_();
  var tdH = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!tdH) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var muon = {}; [].concat(dsTk || []).forEach(function(t) { muon[String(t).toLowerCase()] = 1; });
  var ds = comNguoi_().filter(function(p) { return muon[p.tk]; });
  if (!ds.length) return sach_({ ok: false, msg: 'Không tìm thấy người cần đăng ký.' });
  if (ds.some(function(p) { return !comHoDuoc_(me, p); })) return sach_({ ok: false, msg: (comLaTruong_(me) ? 'Chỉ đăng ký hộ được người trong xưởng / bộ phận của bạn.' : 'Ban điều hành chỉ đăng ký hộ được người thuộc khối văn phòng / ban điều hành.') });
  var v = an ? 1 : 0, boN = bo === undefined || bo === null || ds.length !== 1 ? undefined : comBoNguoi_(bo, comMonDoi_(tdH));
  ds.forEach(function(p) { comGhi_(p, ngay, v, me.ten, undefined, undefined, boN); });
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7);
  return sach_({ ok: true, ngay: ngay, an: v, so: ds.length, bo: ds.length === 1 && v ? comBoCua_(ds[0].tk, ngay) : {},
    msg: (ds.length === 1 ? 'Đã đăng ký hộ ' + ds[0].ten : 'Đã đăng ký hộ ' + ds.length + ' người') + (v ? ': ăn trưa ' : ': không ăn ') + ng + '.' });
}

function luuThucDon(token, ngay, monAn, ghiChu, monDoi) {   // monDoi: [{m, t}] món có thể bớt / đổi (tối đa 3)
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được nhập thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Không nhập thực đơn cho ngày đã qua.' });
  monAn = String(monAn || '').trim().slice(0, 600); ghiChu = String(ghiChu || '').trim().slice(0, 300);
  if (!monAn) return sach_({ ok: false, msg: 'Nhập ít nhất một món.' });
  var md = comMonDoi_({ MonDoi: JSON.stringify(monDoi || []) }), mdS = md.length ? JSON.stringify(md) : '';
  if ((monDoi || []).filter(function(x) { return x && String(x.m || '').trim(); }).length > COM_MAX_MON_DOI) return sach_({ ok: false, msg: 'Tối đa ' + COM_MAX_MON_DOI + ' món có thể bớt / đổi.' });
  if (md.some(function(x, i) { return md.slice(0, i).some(function(y) { return y.m.toLowerCase() === x.m.toLowerCase(); }); })) return sach_({ ok: false, msg: 'Món có thể bớt / đổi bị trùng tên.' });
  khoa_();
  var cu = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0], thoi = comBayGio_();
  if (cu) {
    suaO_('ThucDon', cu._row, 'MonAn', monAn); suaO_('ThucDon', cu._row, 'GhiChu', ghiChu);
    suaO_('ThucDon', cu._row, 'NguoiNhap', me.ten); suaO_('ThucDon', cu._row, 'CapNhat', thoi); suaO_('ThucDon', cu._row, 'MonDoi', mdS);
  } else them_('ThucDon', { Ngay: "'" + ngay, MonAn: monAn, GhiChu: ghiChu, NguoiNhap: me.ten, CapNhat: thoi, MonDoi: mdS });
  ghiLog_(me, 'Thực đơn cơm trưa', ngay, '', monAn);
  return sach_({ ok: true, msg: 'Đã lưu thực đơn ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + (comConMo_(ngay) ? '. Hạn đăng ký: ' + comMoc_(comHan_(ngay)) + ', được thay đổi tới ' + comMoc_(comKhoa_(ngay)) + '.' : '. Lưu ý: đã quá giờ chốt (' + comMoc_(comKhoa_(ngay)) + ') nên mọi người KHÔNG đăng ký được bữa này nữa.') });
}

function xoaThucDon(token, ngay) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được xóa thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
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
      x.dsAn.forEach(function(t) {
        var ghi = (x.dsMon || []).filter(function(c) { return c.ten === t; }).map(function(c) { var md = th.monDoi.filter(function(y) { return y.m === c.m; })[0]; return c.k === 'd' ? 'đổi ' + c.m + ' → ' + (md ? md.t : '') : 'không ăn ' + c.m; });
        chiTiet.push([ng, x.ten, t, ma(t), 'Ăn' + (ghi.length ? ' (' + ghi.join(', ') + ')' : '')]); });
      x.dsKhong.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Không ăn']); });
      x.dsChua.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Chưa đăng ký']); });
      if (x.nhom) chiTiet.push([ng, x.ten, '(nhóm báo tổng)', '', x.baoChua ? 'Chưa báo' : x.an + ' suất' + (x.noiKhac ? ' (' + x.noiKhac + ' ăn ở ' + x.noiKhacTen + ')' : '')]);
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
/* Chạy tay: đổi hạn đăng ký (mặc định 16) và giờ khóa thay đổi (mặc định 22) – đều tính theo hôm trước ngày ăn. Sửa số trong hàm rồi bấm Chạy. */
function DAT_GIO_CHOT_COM() {
  PropertiesService.getScriptProperties().setProperty('COM_GIO_CHOT', '16');
  PropertiesService.getScriptProperties().setProperty('COM_GIO_KHOA', '22');
  Logger.log('Hạn đăng ký cơm: ' + comGioChot_() + ':00, được thay đổi tới ' + comGioKhoa_() + ':00 hôm trước ngày ăn.');
}

/* Chạy tay khi trang Cơm trưa không tải được: thử từng bước bằng tài khoản chủ sở hữu, ghi lỗi chi tiết vào Nhật ký thực thi */
function KIEM_TRA_COM_TRUA() {
  var buoc = function(ten, fn) { try { var v = fn(); Logger.log('✓ ' + ten + (v !== undefined ? ': ' + v : '')); return true; } catch (e) { Logger.log('✗ ' + ten + ': ' + e.message + '\n' + (e.stack || '')); return false; } };
  buoc('Sheet ThucDon', function() { return comDoc_('ThucDon').length + ' dòng'; });
  buoc('Sheet DangKyCom', function() { return comDoc_('DangKyCom').length + ' dòng, cột: ' + dauCot_('DangKyCom').join(', '); });
  buoc('Người cần đăng ký', function() { return comNguoi_().length + ' người'; });
  var tk = doc_('TaiKhoan').filter(function(t) { return String(t.VaiTro).trim() === 'OWNER' || String(t.VaiTro).trim() === 'ADMIN'; })[0];
  if (!tk) { Logger.log('✗ Không thấy tài khoản ADMIN/OWNER để thử'); return; }
  buoc('Tổng hợp hôm nay', function() { var t = comTongHop_(homNayVN_(), { vaiTro: 'ADMIN', xuong: '' }); return t.an + ' ăn / ' + t.khong + ' không / ' + t.chua + ' chưa'; });
  buoc('napComTrua (giả lập phiên ' + tk.TenDangNhap + ')', function() {
    var r = napComTrua(taoPhien_(tk));
    return r && r.ok ? 'OK – ' + r.thucDon.length + ' thực đơn' : 'LỖI – ' + (r && r.msg);
  });
}
