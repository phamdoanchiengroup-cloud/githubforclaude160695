/* =====================================================================
   QUY TRÌNH SẢN XUẤT (31/10, chủ dự án chọn phương án C + mảnh tải sau)
   - Giai đoạn 1: CHỈ tài khoản chủ sở hữu (OWNER) xem / sửa. Mọi hàm ở đây tự kiểm phiên + quyền ngay đầu.
   - Quy trình: mỗi công đoạn có Nhánh (Ngọn / Chuôi / Chung / Nối…) + Bước (1, 2, 3…). Công đoạn trước tự suy
     từ nhánh + bước (qtCanh_), hoặc ghi tay ở cột Truoc. Luồng bán thành phẩm giữa các xưởng: dòng Loai = XUONG.
   - Chưa lưu gì thì dùng quy trình nháp QT_NHAP (Claude soạn từ tên 195 công đoạn + 3 file chủ dự án gửi).
   - Phân tích (tính ở trình duyệt): giờ chuẩn = sản lượng ÷ định mức; CN cần = giờ chuẩn/ngày × mục tiêu ÷ (giờ × hiệu suất).
   ===================================================================== */
var QT_SHEET = 'QuyTrinh';
var QT_COT = ['Loai', 'Ma', 'MaXuong', 'Nhanh', 'Buoc', 'Truoc', 'GhiChu', 'NguoiSua', 'ThoiDiem'];
var QT_NHANH = { CHUNG: 'Chung', NGON: 'Ngọn', CHUOI: 'Chuôi', GAY1K: 'Gậy 1 khúc', NOI: 'Nối', TIP: 'Típ', PHIP: 'Phíp', POM: 'POM',
  PK: 'Phụ kiện', DONLE: 'Đơn lẻ', LAMLAI: 'Làm lại / sửa', HOTRO: 'Hỗ trợ', CHUAXEP: 'Chưa xếp' };
var QT_NHANH_DONG = { NGON: 1, CHUOI: 1, GAY1K: 1 };          // nhánh chảy qua / gộp vào "Chung"
var QT_NHANH_NGOAI = { LAMLAI: 1, HOTRO: 1, CHUAXEP: 1 };      // không nằm trên dòng chảy (vẫn tính tải)
var QT_CAI_DAT = { gioCoMat: 8, hieuSuat: 0.85, mucTieu: 137, soNgay: 30 };   // mục tiêu 137% = nhu cầu theo đơn tháng 10 (đóng gói ~250/ngày + hàng thiếu tăng ~92/ngày) – chuyên gia vận hành 31/10
var qtCo_ = function(o, k) { return Object.prototype.hasOwnProperty.call(o, k); };   // không nhận tên đặc biệt (__proto__, constructor…)
var QT_XUONG_NHAP = [
  ['PHOICB', 'PHOITHO', 'Phôi 60 (ngọn + chuôi)'], ['PHOITHO', 'NGONTARO', 'Phôi ngọn'], ['PHOITHO', 'SON', 'Phôi chuôi, nối, gậy 1 khúc (60…)'],
  ['NGONTARO', 'NGONTIP', 'Ngọn đã taro ren (Ngọn…)'], ['CNC', 'NGONTIP', 'Típ, phíp (CNCTip, CNCPhip)'], ['SON', 'INUV', 'Chuôi / nối đã sơn (S…)'],
  ['INUV', 'HT', 'Chuôi / nối đã in UV (UV…)'], ['NGONTIP', 'HT', 'Ngọn đã làm đầu'], ['HT', 'DG', 'Gậy, ngọn, nối hoàn thiện (HT…)']];
/* Nháp: MaCD -> [nhánh, bước]. Công đoạn mới không có ở đây -> "Chưa xếp". */
var QT_NHAP = {
  // Phôi Carbon: chuẩn bị vải -> tỉa -> cuốn -> màng nilong -> rút khuôn -> kiểm / cắt / tiện / chuốt
  'CB-NHAPNVL': ['CHUNG', 1], 'CB-XAKHO-GF': ['CHUNG', 2], 'CB-XAKHO-CB': ['CHUNG', 2], 'CB-XAKHOC3': ['CHUNG', 2],
  'CB-XATAM-CAT': ['CHUNG', 3], 'CB-XATAM-CATGF': ['CHUNG', 3], 'CB-XATAM-DO': ['CHUNG', 3], 'CB-TIA-TIAVO': ['CHUNG', 4],
  'CB-TIA-NGONCB': ['NGON', 5], 'CB-TIA-NGONGF': ['NGON', 5], 'CB-CUON-NGONFULL': ['NGON', 6], 'CB-CUON-NGONMIX': ['NGON', 6], 'CB-CUON-NGONN': ['NGON', 6],
  'CB-NILONG-NGONMIX': ['NGON', 7], 'CB-NILONG-NGONFULL': ['NGON', 7], 'CB-NILONG-NGON': ['NGON', 7],
  'CB-TIA-DANHDAU': ['CHUOI', 5], 'CB-TIA-CHUOI': ['CHUOI', 6], 'CB-TIA-SOANBO': ['CHUOI', 7], 'CB-CUON-CHUOICB': ['CHUOI', 8], 'CB-NILONG-CHUOI': ['CHUOI', 9],
  'CB-RUTKHUON': ['CHUNG', 10],
  'CB-CHECK-LD': ['NGON', 11], 'CB-CHECK-KTC': ['NGON', 12], 'CB-CHECK-KTG': ['NGON', 12], 'CB-CHECK-BEMAT': ['NGON', 13], 'CB-CHECK-BEMATTR': ['NGON', 13],
  'CB-CHECK-DODD': ['NGON', 14], 'CB-CHECK-KTKT': ['NGON', 14], 'CB-CHECK-QBD': ['NGON', 15], 'CB-CHECK-CAT': ['NGON', 16],
  'CB-CNCRT-NCB': ['NGON', 17], 'CB-CNC-TIENNGON1MAY': ['NGON', 17], 'CB-CHUOT-NGONMOI': ['NGON', 18], 'CB-CHUOT-NGONCY': ['NGON', 18],
  'CB-CHUOT-DANHBONG': ['NGON', 19], 'CB-DANHBONGFULL': ['NGON', 19], 'CB-CHECK-KICHTHUOC': ['NGON', 20], 'CB-MAIDAU': ['NGON', 20], 'CB-DONGGOINGON': ['NGON', 21],
  'CB-CHUOT-CAT': ['CHUOI', 11], 'CB-CNCRT-CCB': ['CHUOI', 12], 'CB-CNC-TIENCHUOI1MAY': ['CHUOI', 12], 'CB-CHUOT-CHUOI': ['CHUOI', 13], 'CB-CHUOT-CHUOIRT': ['CHUOI', 13],
  'CB-CHECK-CHUOI': ['CHUOI', 14], 'CB-XUATHANG': ['CHUOI', 15],
  'CB-CHUOT-PHAQL': ['LAMLAI', 1], 'CB-CHUOT-PHACY': ['LAMLAI', 1], 'CB-CHUOT-CATNGONQL': ['LAMLAI', 2], 'CB-CUON-QUANLAI': ['LAMLAI', 3], 'CB-CUON-QUANLAICHUOI': ['LAMLAI', 3],
  'CN-NILONG-QL': ['LAMLAI', 4], 'CB-CHUOT-NGONQL': ['LAMLAI', 5], 'CB-CHUOT-SUANGON': ['LAMLAI', 6],
  'CB-VESINHKHUON': ['HOTRO', 1], 'CB-VSKNGON': ['HOTRO', 1],
  // Phôi Thô
  'XPT-CP-KTP': ['CHUNG', 1], 'XPT-CPN-KTN': ['CHUNG', 1], 'XPT-CB-PLP': ['CHUNG', 2], 'XPT-CP-CPCN': ['CHUNG', 3],
  'XPT-EPXN-NCBCD': ['NGON', 4], 'XPT-EPXNCB-NCBT': ['NGON', 4], 'XPT-DP-DPN': ['NGON', 5], 'XPT-CN-CNCB': ['NGON', 6],
  'XPT-TR-TRNGF': ['NGON', 7], 'XPT-TR-TRNCB': ['NGON', 7], 'XPT-MP-DTP': ['NGON', 8],
  'XPT-KCB-KCBGF': ['CHUOI', 4], 'XPT-KCB-KCBCB': ['CHUOI', 4], 'XPT-EPX-EPXC': ['CHUOI', 5], 'XPT-DF-DFC': ['CHUOI', 6], 'XPT-DS-DD': ['CHUOI', 6], 'XPT-CD-CDG': ['CHUOI', 6],
  'XPT-CNC-RC': ['CHUOI', 7], 'XPT-CNC-KRC': ['CHUOI', 7], 'XPT-TR-TRC': ['CHUOI', 8], 'XPT-CR-NRL1': ['CHUOI', 9], 'XPT-CR-NL2': ['CHUOI', 10],
  'XPT-QC-QDR': ['CHUOI', 11], 'XPT-DK-DKNK': ['CHUOI', 12], 'XPT-QB-QBW': ['CHUOI', 13], 'XPT-CM-CMKD': ['CHUOI', 14], 'XPT-C2L-C2LD': ['CHUOI', 14],
  'XPT-CR-CRSD': ['CHUOI', 15], 'XPT-MR-MNR': ['CHUOI', 16], 'XPT-CP-CPD': ['CHUOI', 17], 'XPT-VSR-VSP': ['CHUOI', 18],
  'XPT-TR-TRCRN': ['NOI', 4], 'XPT-LM-LMN': ['NOI', 5], 'XPT-CNC-CN': ['NOI', 6], 'XPT-SH-SHH': ['LAMLAI', 1],
  // CNC: típ, phíp, lết
  'CNC-PHOI-TIP': ['TIP', 1], 'CNC-DAP-LOGO': ['TIP', 2], 'CNC-DAP-LOGO-1T1D': ['TIP', 2], 'CNC-TIP-01': ['TIP', 3], 'CNC-TIP-02': ['TIP', 3],
  'CNC_TIP_DA_LON_7LOP': ['TIP', 3], 'CNC-DA-LON': ['TIP', 3],
  'CNC-PHIP': ['PHIP', 1], 'CNC-GIA-CONG-PHIP': ['PHIP', 1], 'CNC-PHIP-BAKELIT-01': ['PHIP', 1], 'CNC-PHIP-BAKELIT-02': ['PHIP', 1], 'LET-MIKA-DEN': ['PK', 1],
  // Ngọn Taro (kèm làm POM)
  'NGON-TARO-CHECKNGON': ['NGON', 1], 'NGON-TARORENTHUONG-GF': ['NGON', 2], 'NGON-TARORENDONG-GF': ['NGON', 2], 'NGON-TAROREN-CB': ['NGON', 2],
  'NGON-TARORENDONG-CARBON': ['NGON', 2], 'NGON-TAROREN-DONLE': ['NGON', 2], 'NGON-EPOXYREN': ['NGON', 3], 'NGON-EPOXYREN-COMAU': ['NGON', 3],
  'NGON-DANHGIAP-2': ['NGON', 4], 'NGON-DANHGIAP-3': ['NGON', 4], 'NGON-DANHGIAP': ['NGON', 5], 'NGON-DANHGIAP-DONLE': ['NGON', 5], 'NGON-TESTER': ['NGON', 6],
  'NGON-TARO-SXPOM': ['POM', 1], 'NGON-TARO-SXPOM1': ['POM', 1], 'NGON-TARO-SXPOM2': ['POM', 1], 'NGON-TARO-SXPOM3': ['POM', 1], 'NGON-TARO-SXPOM4': ['POM', 1],
  'NGON-TARO-RENPOM': ['POM', 2],
  // Ngọn Tip
  'NGON-LAMBANG': ['NGON', 1], 'NGONLAMBANGGLASS': ['NGON', 1], 'NGON-DANTIP': ['NGON', 2], 'NGON-TIP-LAMDAU': ['NGON', 3], 'NGON-LAMDAUGLASS': ['NGON', 3],
  'NGON-TIP-LAMDAUPHA': ['NGON', 3], 'NGON-CNCBODAU': ['NGON', 4],
  // Sơn
  'TUOT-LOT': ['CHUOI', 1], 'TUOT-LOT-1': ['GAY1K', 1], 'RAP-CHUOI': ['CHUOI', 2], 'RAP-2': ['CHUOI', 2], 'RAP-1': ['GAY1K', 2], 'CUON-WAP-BANG-DINH': ['CHUOI', 3],
  'SON': ['CHUOI', 4], 'SON-1': ['CHUOI', 4], 'SON-MAY-TU-DONG-1': ['GAY1K', 4], 'SON-MAY-TU-DONG-3': ['CHUOI', 5], 'CAT-MAT-CHUOI': ['CHUOI', 6], 'VS-LAP-POM': ['CHUOI', 7],
  'VE-SINH-1': ['HOTRO', 1],
  // In UV
  'IN': ['CHUOI', 1], 'IN-BONG': ['CHUOI', 2], 'BONG': ['CHUOI', 2],
  // Hoàn thiện: chuôi (cắt, hạ khấc, bọc da, đánh bóng) + ngọn GF + nối -> gộp, kiểm gậy
  'HT-CAT': ['CHUOI', 1], 'HT-CAT-C': ['CHUOI', 1], 'HT-HK-1': ['CHUOI', 2], 'HT-HK-2': ['CHUOI', 2], 'HT-CAT-MHK': ['CHUOI', 3],
  'HT-BOCDA-KEOCHUOI': ['CHUOI', 4], 'HT-BOCDA-KEODA': ['CHUOI', 4], 'HT-BOCDA-VAODA': ['CHUOI', 5], 'HT-BOCDA-CAT': ['CHUOI', 6], 'HT-BOCDA-MEP': ['CHUOI', 7],
  'HT-BOCDA-SUA': ['CHUOI', 8], 'HT-DANHBONG-BOC': ['CHUOI', 9], 'HT-DANHBONG-RAPNUOC': ['CHUOI', 10], 'HT-DANHBONG-RAPBUI': ['CHUOI', 10],
  'HT-DANHBONG-CN': ['CHUOI', 11], 'HT-DANHBONG-MAYTIENDAT': ['CHUOI', 12], 'HT-DANHBONG-RAP': ['NGON', 1],
  'HT-ISO-VP': ['GAY1K', 1], 'HT-DANHBONG-RAPPHOI': ['GAY1K', 2], 'HT-CAT-N': ['NOI', 1], 'HT-DANHBONG-NOI': ['NOI', 2], 'HT-ISO-N': ['NOI', 3],
  'HT-ISO-G': ['CHUNG', 13], 'HT-CHECK': ['CHUNG', 14], 'HT-ISO-TP': ['CHUNG', 15],
  // Đóng gói
  'DG-LASER-CHECKGAY': ['CHUNG', 1], 'DG-LASER-CHECKNGON': ['CHUNG', 1], 'DG-LASER': ['CHUNG', 2], 'DG-VESINH-GAY': ['CHUNG', 3], 'DG-VESINH-NGON': ['CHUNG', 3],
  'DG-VESINH-NOI': ['CHUNG', 3], 'DG-VESINH-CHECK': ['CHUNG', 4], 'DG-SEAL': ['CHUNG', 5], 'DG-DONGGOITP': ['CHUNG', 6], 'DG-DONGDAI': ['CHUNG', 7],
  'DG-LASER-PHUKIEN': ['PK', 1], 'DG-LASER-TAGGIABE': ['PK', 1], 'DG-LASER-TAGGIATO': ['PK', 1], 'DG-GAPHOP': ['PK', 1], 'DG-PHUKIEN': ['PK', 2], 'DG-HOPCOMBO': ['PK', 2],
  'DG-DONLE-CHECK': ['DONLE', 1], 'DG-DONLE-QUAY': ['DONLE', 2], 'DG-DONLE-GAY-NGON': ['DONLE', 3], 'DG-DONLE-CUSTOM': ['DONLE', 3], 'DG-DONLE-COMBO': ['DONLE', 3],
  'DG-DONLE-PHUKIEN': ['DONLE', 3], 'DG-DONLE-PHUKIEN-BAOCO': ['DONLE', 3], 'DG-HOTRO': ['HOTRO', 1]
};

function qtQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (!me.laOwner) return { loi: sach_({ ok: false, msg: 'Tab Quy trình sản xuất đang chỉ mở cho tài khoản chủ sở hữu.' }) };
  return { me: me };
}
function qtSheet_() {
  var sh = ss_().getSheetByName(QT_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(QT_SHEET);
    sh.getRange(1, 1, 1, QT_COT.length).setValues([QT_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, QT_COT.length).setNumberFormat('@');
  }
  return sh;
}

/* Công đoạn trước của từng công đoạn (cùng xưởng). ds: [{Ma, MaXuong, Nhanh, Buoc, Truoc[]}] -> { Ma: [Ma trước] }.
   Có ghi tay (Truoc) thì dùng; không thì suy: cùng nhánh bước liền trước, hoặc "Chung" nếu Chung gần hơn;
   "Chung" nhận từ cuối các nhánh dòng chảy (Ngọn / Chuôi / Gậy 1 khúc) chạy sau Chung gần nhất; không có nhánh nào thì từ Chung đó.
   (Bản giống hệt ở trình duyệt: qtCanh trong QuyTrinh.html – kiểm thử so khớp.) */
function qtCanh_(ds) {
  var theoX = {}, out = {};
  ds.forEach(function(c) { (theoX[c.MaXuong] = theoX[c.MaXuong] || []).push(c); });
  Object.keys(theoX).forEach(function(x) {
    var cs = theoX[x];
    var lonNhat = function(nh, s) {          // bước lớn nhất < s của nhánh nh
      var b = 0; cs.forEach(function(c) { if (c.Nhanh === nh && c.Buoc < s && c.Buoc > b) b = c.Buoc; }); return b;
    };
    var o = function(nh, b) { return cs.filter(function(c) { return c.Nhanh === nh && c.Buoc === b; }).map(function(c) { return c.Ma; }); };
    cs.forEach(function(c) {
      if (c.Truoc && c.Truoc.length) { out[c.Ma] = c.Truoc.slice(); return; }
      var r = [];
      if (QT_NHANH_NGOAI[c.Nhanh]) r = [];
      else if (c.Nhanh === 'CHUNG') {
        var sc = lonNhat('CHUNG', c.Buoc);
        Object.keys(QT_NHANH_DONG).forEach(function(nh) { var b = lonNhat(nh, c.Buoc); if (b && b > sc) r = r.concat(o(nh, b)); });
        if (!r.length && sc) r = o('CHUNG', sc);   // không nhánh nào chạy sau Chung gần nhất -> nối thẳng Chung đó
      } else {
        var sb = lonNhat(c.Nhanh, c.Buoc), sc2 = QT_NHANH_DONG[c.Nhanh] ? lonNhat('CHUNG', c.Buoc) : 0;
        if (sc2 > sb) r = o('CHUNG', sc2); else if (sb) r = o(c.Nhanh, sb);
      }
      out[c.Ma] = r;
    });
  });
  return out;
}
function qtCoVong_(canh) {
  var mau = {}, vong = '';
  var di = function(m) {
    if (vong) return; mau[m] = 1;
    (canh[m] || []).forEach(function(t) { if (vong) return; if (mau[t] === 1) vong = t + ' ↔ ' + m; else if (!mau[t] && canh[t]) di(t); });
    mau[m] = 2;
  };
  Object.keys(canh).forEach(function(m) { if (!mau[m]) di(m); });
  return vong;
}

/* Quy trình đang lưu (hoặc nháp) -> { cd: {Ma: {...}}, xuong: [...], caiDat, nhap } */
function qtDocQT_(cds) {
  var dong = docAnToan_(QT_SHEET), cd = {}, xuong = [], cai = {}, k;
  for (k in QT_CAI_DAT) cai[k] = QT_CAI_DAT[k];
  dong.forEach(function(r) {
    var l = String(r.Loai).trim(), ma = String(r.Ma).trim();
    if (l === 'CD' && ma) cd[ma] = { Ma: ma, MaXuong: String(r.MaXuong), Nhanh: qtCo_(QT_NHANH, String(r.Nhanh)) ? String(r.Nhanh) : 'CHUAXEP',
      Buoc: Number(r.Buoc) || 1, Truoc: String(r.Truoc || '').split(',').map(function(x) { return x.trim(); }).filter(Boolean),
      GhiChu: String(r.GhiChu || ''), NguoiSua: String(r.NguoiSua || ''), ThoiDiem: r.ThoiDiem ? String(r.ThoiDiem) : '' };
    else if (l === 'XUONG' && ma.indexOf('>') > 0) xuong.push({ Tu: ma.split('>')[0], Den: ma.split('>')[1], BTP: String(r.Nhanh || ''), GhiChu: String(r.GhiChu || '') });
    else if (l === 'CAIDAT' && QT_CAI_DAT.hasOwnProperty(ma) && isFinite(Number(r.GhiChu)) && String(r.GhiChu) !== '') cai[ma] = Number(r.GhiChu);
  });
  var nhap = !dong.some(function(r) { return String(r.Loai).trim() === 'CD'; });
  // Công đoạn đang dùng chưa có trong quy trình -> nháp (nếu có) / "Chưa xếp"
  cds.forEach(function(c) {
    var m = String(c.MaCD);
    if (cd[m]) { cd[m].MaXuong = String(c.MaXuong); return; }
    var n = QT_NHAP[m];
    cd[m] = { Ma: m, MaXuong: String(c.MaXuong), Nhanh: n ? n[0] : 'CHUAXEP', Buoc: n ? n[1] : 1, Truoc: [], GhiChu: '', NguoiSua: '', ThoiDiem: '', moi: !nhap };
  });
  if (!dong.some(function(r) { return String(r.Loai).trim() === 'XUONG'; }))
    xuong = QT_XUONG_NHAP.map(function(a) { return { Tu: a[0], Den: a[1], BTP: a[2], GhiChu: '' }; });
  return { cd: cd, xuong: xuong, caiDat: cai, nhap: nhap };
}

/* Dữ liệu cho tab: quy trình + thống kê sản lượng theo công đoạn trong kỳ + nhân sự + máy + kỹ năng */
function layQuyTrinh(token, soNgay) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var cds = doc_('CongDoan').filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; });
  var qt = qtDocQT_(cds);
  soNgay = [14, 30, 60, 90].indexOf(Number(soNgay)) >= 0 ? Number(soNgay) : qt.caiDat.soNgay;
  var den = homNayVN_(), d0 = new Date(den + 'T12:00:00Z'); d0.setUTCDate(d0.getUTCDate() - soNgay + 1);
  var tu = Utilities.formatDate(d0, 'GMT', 'yyyy-MM-dd');
  var dmRow = {}; doc_('DinhMuc').forEach(function(r) { dmRow[String(r.MaCD)] = r; });
  var tk = {}, ngaySX = {}, cong = {};
  doc_('NhatKySanXuat').forEach(function(r) {
    if (String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    (cong[String(r.MaNV)] = cong[String(r.MaNV)] || {})[ng] = 1;   // có dòng nhật ký = có mặt làm hàng ngày đó
    var sl = Number(r.SoLuongLamRa) || 0; if (sl <= 0) return;
    var m = String(r.MaCD), t = tk[m] || (tk[m] = { sl: 0, nguoi: {}, ngay: {} });
    t.sl += sl; t.nguoi[String(r.MaNV)] = (t.nguoi[String(r.MaNV)] || 0) + sl; t.ngay[ng] = 1; ngaySX[ng] = 1;
  });
  Object.keys(tk).forEach(function(m) { var t = tk[m]; t.soNgay = Object.keys(t.ngay).length; delete t.ngay; });
  var ngayCong = {}; Object.keys(cong).forEach(function(m) { ngayCong[m] = Object.keys(cong[m]).length; });
  var ns = doc_('NhanSu').filter(function(n) { return String(n.TrangThai).trim() === 'Đang làm'; })
    .map(function(n) { return { MaNV: String(n.MaNV), HoTen: String(n.HoTen), MaXuong: String(n.MaXuong), ChucDanh: String(n.ChucDanh || '') }; });
  var may = {};
  docAnToan_('MayMoc').forEach(function(m) {
    var tt = String(m.TinhTrang).trim(); if (tt === 'Thanh lý') return;
    var x = String(m.MaXuong), l = String(m.ChungLoai || 'Khác').trim().toUpperCase() || 'KHÁC';
    may[x] = may[x] || {}; may[x][l] = (may[x][l] || 0) + 1;
  });
  // Kỹ năng đã duyệt -> người đạt cấp ≥ 2 còn hạn cho từng công đoạn trong kỹ năng
  var kn = {}, hn = homNayVN_(), dsKN = {};
  docAnToan_('KyNang').forEach(function(k) { if (String(k.TrangThai).trim() === 'Đã duyệt') dsKN[String(k.MaKN)] = String(k.CongDoan || '').split(','); });
  docAnToan_('KyNangNhanVien').forEach(function(g) {
    if (String(g.TrangThai).trim() !== 'Đã xác nhận' || !dsKN[String(g.MaKN)]) return;
    var cap = Number(g.Cap) || 0, hh = ngayVN_(g.HetHan);
    if (cap < 2 || (hh && hh < hn)) return;
    dsKN[String(g.MaKN)].forEach(function(m) { m = m.trim(); if (!m) return; kn[m] = kn[m] || {}; kn[m][String(g.MaNV)] = Math.max(kn[m][String(g.MaNV)] || 0, cap); });
  });
  return sach_({ ok: true, nhap: qt.nhap, quyTrinh: Object.keys(qt.cd).map(function(m) { return qt.cd[m]; }), xuongLuong: qt.xuong, caiDat: qt.caiDat,
    nhanh: QT_NHANH, soNgay: soNgay, tu: tu, den: den, soNgaySX: Object.keys(ngaySX).length,
    congDoan: cds.map(function(c) { var d = dmRow[String(c.MaCD)] || {};
      return { MaCD: String(c.MaCD), TenCD: String(c.TenCD), MaXuong: String(c.MaXuong), DM: Number(d.DinhMucGio) || 0, DVT: String(d.DonViTinh || '') }; }),
    xuong: doc_('PhongBan').filter(function(p) { return String(p.TrangThai || 'Đang dùng').trim() !== 'Ngừng'; }).map(function(p) { return { MaXuong: String(p.MaXuong), TenXuong: String(p.TenXuong) }; }),
    thongKe: tk, ngayCong: ngayCong, nhanSu: ns, may: may, kyNang: kn });
}

/* Lưu quy trình (ghi đè toàn bộ sheet QuyTrinh trong khóa). o = { cd: [{Ma, Nhanh, Buoc, Truoc[], GhiChu}], xuong: [{Tu, Den, BTP, GhiChu}], caiDat: {} } */
function luuQuyTrinh(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var me = q.me; o = o || {};
  if (!Array.isArray(o.cd) || o.cd.length > 2000 || !Array.isArray(o.xuong || []) || (o.xuong || []).length > 100) return sach_({ ok: false, msg: 'Dữ liệu quy trình không hợp lệ.' });
  var thoDai = function(v, n) { return v != null && (typeof v !== 'string' && typeof v !== 'number' || String(v).length > n); };   // kiểm độ dài TRƯỚC khi xử lý / giữ khóa
  if (o.cd.some(function(c) { return !c || typeof c !== 'object' || thoDai(c.Ma, 60) || thoDai(c.Nhanh, 20) || thoDai(c.GhiChu, 400) || (c.Truoc != null && (!Array.isArray(c.Truoc) || c.Truoc.length > 20 || c.Truoc.some(function(t) { return thoDai(t, 60); }))); }) ||
      (o.xuong || []).some(function(x) { return !x || typeof x !== 'object' || thoDai(x.Tu, 30) || thoDai(x.Den, 30) || thoDai(x.BTP, 240) || thoDai(x.GhiChu, 400); }))
    return sach_({ ok: false, msg: 'Dữ liệu quy trình không hợp lệ (ô quá dài hoặc quá nhiều công đoạn trước).' });
  khoa_();
  var cds = doc_('CongDoan'), xOf = {};
  cds.forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); });
  var xs = {}; doc_('PhongBan').forEach(function(p) { xs[String(p.MaXuong)] = 1; });
  var ds = [], da = {}, loi = '';
  o.cd.forEach(function(c) {
    if (loi) return;
    var ma = String(c && c.Ma || '').trim();
    if (!qtCo_(xOf, ma)) { loi = 'Công đoạn "' + ma.slice(0, 40) + '" không có trong danh mục.'; return; }
    if (qtCo_(da, ma)) { loi = 'Công đoạn ' + ma + ' bị lặp.'; return; }
    da[ma] = 1;
    var nh = String(c.Nhanh || ''), b = Number(c.Buoc);
    if (!QT_NHANH.hasOwnProperty(nh)) { loi = 'Nhánh của ' + ma + ' không hợp lệ.'; return; }
    if (!(b >= 1 && b <= 99 && Math.floor(b) === b)) { loi = 'Bước của ' + ma + ' phải là số nguyên 1–99.'; return; }
    var tr = (Array.isArray(c.Truoc) ? c.Truoc : []).map(function(x) { return String(x).trim(); }).filter(function(x, i, a) { return x && a.indexOf(x) === i; });
    if (tr.length > 20) { loi = 'Công đoạn ' + ma + ' có quá nhiều công đoạn trước.'; return; }
    for (var i = 0; i < tr.length; i++) {
      if (tr[i] === ma) { loi = 'Công đoạn ' + ma + ' không thể đứng trước chính nó.'; return; }
      if (!qtCo_(xOf, tr[i]) || xOf[tr[i]] !== xOf[ma]) { loi = 'Công đoạn trước của ' + ma + ' phải cùng xưởng (luồng giữa các xưởng sửa ở phần "Luồng giữa các xưởng").'; return; }
    }
    var gc = String(c.GhiChu || '').replace(/\s+/g, ' ').trim();
    if (gc.length > 200) { loi = 'Ghi chú của ' + ma + ' tối đa 200 ký tự.'; return; }
    ds.push({ Ma: ma, MaXuong: xOf[ma], Nhanh: nh, Buoc: b, Truoc: tr, GhiChu: gc });
  });
  if (loi) return sach_({ ok: false, msg: loi });
  var vong = qtCoVong_(qtCanh_(ds));
  if (vong) return sach_({ ok: false, msg: 'Quy trình bị vòng lặp: ' + vong + '. Sửa "công đoạn trước" để không quay vòng.' });
  var xl = [], daX = {};
  (o.xuong || []).forEach(function(x) {
    if (loi) return;
    var tu = String(x && x.Tu || ''), den = String(x && x.Den || ''), btp = String(x.BTP || '').replace(/\s+/g, ' ').trim();
    if (!qtCo_(xs, tu) || !qtCo_(xs, den) || tu === den) { loi = 'Luồng giữa các xưởng có xưởng không hợp lệ.'; return; }
    if (qtCo_(daX, tu + '>' + den)) { loi = 'Luồng ' + tu + ' → ' + den + ' bị lặp.'; return; }
    if (btp.length > 120) { loi = 'Tên bán thành phẩm tối đa 120 ký tự.'; return; }
    daX[tu + '>' + den] = 1; xl.push({ Tu: tu, Den: den, BTP: btp, GhiChu: String(x.GhiChu || '').replace(/\s+/g, ' ').trim().slice(0, 200) });
  });
  if (loi) return sach_({ ok: false, msg: loi });
  var cX = {}; xl.forEach(function(x) { (cX[x.Den] = cX[x.Den] || []).push(x.Tu); });
  if (qtCoVong_(cX)) return sach_({ ok: false, msg: 'Luồng giữa các xưởng bị vòng lặp: ' + qtCoVong_(cX) + '.' });
  var cai = {}, gh = { gioCoMat: [1, 24], hieuSuat: [0.3, 1.2], mucTieu: [10, 500], soNgay: [14, 90] };
  for (var k in QT_CAI_DAT) {
    var v = Number((o.caiDat || {})[k]);
    if ((o.caiDat || {})[k] === undefined) v = QT_CAI_DAT[k];
    if (!isFinite(v) || v < gh[k][0] || v > gh[k][1]) return sach_({ ok: false, msg: 'Cài đặt "' + k + '" ngoài khoảng cho phép.' });
    cai[k] = v;
  }
  // So với bản cũ: dòng không đổi giữ người sửa / thời điểm cũ
  var cu = qtDocQT_([]).cd, luc = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), doi = 0;
  var rows = ds.map(function(c) {
    var c0 = cu[c.Ma], same = c0 && c0.Nhanh === c.Nhanh && c0.Buoc === c.Buoc && c0.Truoc.join(',') === c.Truoc.join(',') && c0.GhiChu === c.GhiChu;
    if (!same) doi++;
    return ['CD', c.Ma, c.MaXuong, c.Nhanh, String(c.Buoc), c.Truoc.join(','), c.GhiChu, same ? c0.NguoiSua : me.tk, same ? c0.ThoiDiem : luc];
  });
  xl.forEach(function(x) { rows.push(['XUONG', x.Tu + '>' + x.Den, x.Tu, x.BTP, '', '', x.GhiChu, me.tk, luc]); });
  Object.keys(cai).forEach(function(k2) { rows.push(['CAIDAT', k2, '', '', '', '', String(cai[k2]), me.tk, luc]); });
  var sh = qtSheet_();
  if (sh.getMaxRows() < rows.length + 1) sh.insertRowsAfter(sh.getMaxRows(), rows.length + 1 - sh.getMaxRows());
  var cuoi = sh.getLastRow();
  if (rows.length) sh.getRange(2, 1, rows.length, QT_COT.length).setValues(rows.map(dongAnToan_));   // ghi trước, rồi mới xóa dòng thừa (lỗi giữa chừng không mất bản cũ)
  if (cuoi > rows.length + 1) sh.getRange(rows.length + 2, 1, cuoi - rows.length - 1, QT_COT.length).clearContent();
  xoaCache_(QT_SHEET);
  ghiLog_(me, 'Sửa quy trình sản xuất', ds.length + ' công đoạn (' + doi + ' dòng thay đổi), ' + xl.length + ' luồng giữa xưởng');
  return sach_({ ok: true, msg: 'Đã lưu quy trình (' + doi + ' công đoạn thay đổi).', doi: doi });
}
