/* Sơ đồ nhà máy – phần dùng chung cho bản 2D và bản 3D (demo 10/10).
   - GHEP: phòng trên bản vẽ → xưởng trong web KPI (ghép tạm, chủ dự án sửa được trong bảng ghép của demo).
   - SO: số liệu MẪU của từng xưởng (khi gắn vào web sẽ lấy từ D.nhatky / điểm danh thật).
   - BAO_TRI: máy MẪU đang bảo trì, kèm mã máy trên web (cần bảng ghép mã máy ↔ ký hiệu bản vẽ). */
var SS = (function () {
  var XUONG = [['PHOICB', 'Phôi Carbon'], ['PHOITHO', 'Phôi Thô'], ['CNC', 'CNC'], ['SON', 'Sơn'], ['INUV', 'In UV'],
    ['HT', 'Hoàn thiện'], ['DG', 'Đóng gói'], ['NGONTARO', 'Ngọn Taro'], ['NGONTIP', 'Ngọn Tip']];
  var TEN = {}; XUONG.forEach(function (x) { TEN[x[0]] = x[1]; });
  var GHEP = {
    '0|Khu chuốt': 'PHOICB', '0|Nướng + rút khuôn': 'PHOICB', '0|ISO phôi CB': 'PHOICB', '0|Cuốn': 'PHOICB', '0|Cắt': 'PHOICB',
    '0|Khuôn': 'PHOITHO', '0|Khu đổ foam': 'PHOITHO', '0|Khu đúc keo': 'PHOITHO',
    '0|Xưởng gia công (khoan, ren, taro, cắt)': 'NGONTARO',
    '1|Ráp nước': 'HT', '1|Đánh ráp, đánh bóng': 'HT', '1|Bọc da': 'HT', '1|Bôi keo': 'HT', '1|ISO': 'HT', '1|P. cắt mặt': 'HT',
    '1|Khu vực hoàn thiện': 'HT', '1|Khu chờ khô bán thành phẩm': 'HT', '1|P. kiểm tra chuẩn bị': 'HT', '1|P. ráp tuốt lót': 'HT', '1|Buồng sấy': 'HT',
    '1|Khu vực in UV': 'INUV', '1|Khu hoàn thiện (buồng sơn kín 1–5)': 'SON', '1|Khu sơn tĩnh điện (vách tấm panel)': 'SON',
    '2|Khu làm đầu': 'NGONTIP', '2|Khu vực ngọn': 'NGONTARO', '2|Khu vực CNC': 'CNC', '2|P. máy CNC 2': 'CNC', '2|P. máy tiện': 'CNC',
    '2|P. máy CNC 1': 'CNC', '2|Máy CNC thùng chạy ren': 'CNC', '2|P. kỹ thuật làm phôi': 'CNC',
    '2|Đóng gói': 'DG', '2|Bộ phận đóng gói': 'DG', '2|Bộ phận may': 'DG'
  };
  // số liệu MẪU hôm nay: kpi = hiệu suất KPI %, coMat / dinhBien = sĩ số, cho = dòng chờ duyệt
  var SO = {
    PHOICB: { kpi: 96, coMat: 21, dinhBien: 22, cho: 3 }, PHOITHO: { kpi: 84, coMat: 9, dinhBien: 10, cho: 0 },
    CNC: { kpi: 103, coMat: 26, dinhBien: 26, cho: 5 }, SON: { kpi: 78, coMat: 7, dinhBien: 8, cho: 2 },
    INUV: { kpi: 92, coMat: 12, dinhBien: 14, cho: 1 }, HT: { kpi: 88, coMat: 38, dinhBien: 41, cho: 4 },
    DG: { kpi: 99, coMat: 18, dinhBien: 18, cho: 0 }, NGONTARO: { kpi: 72, coMat: 16, dinhBien: 21, cho: 6 },
    NGONTIP: { kpi: 64, coMat: 6, dinhBien: 9, cho: 2 }
  };
  // máy MẪU đang bảo trì: khóa = tầng|ký hiệu|x|y (toạ độ góc máy trên bản vẽ)
  var BAO_TRI = {
    '2|CNC|26|20.56': { ma: 'M-CNC-02', ly: 'Thay dao, chờ linh kiện' },
    '2|CNC|34.38|17.63': { ma: 'M 03', ly: 'Bảo trì định kỳ' },
    '1|UV1|33.74|23.75': { ma: 'M-IN-01', ly: 'Lỗi đầu phun' }
  };
  var o = { cheDo: 'kpi', XUONG: XUONG, TEN: TEN, GHEP: GHEP, SO: SO, nghe: [] };
  o.khoa = function (fi, R) { return fi + '|' + R.n; };
  o.xuong = function (fi, R) { return GHEP[o.khoa(fi, R)] || ''; };
  o.doi = function (fi, R, ma) { if (ma) GHEP[o.khoa(fi, R)] = ma; else delete GHEP[o.khoa(fi, R)]; o.bao(); };
  o.datCheDo = function (c) { o.cheDo = c; o.bao(); };
  o.bao = function () { o.nghe.forEach(function (f) { try { f(); } catch (e) {} }); };
  o.tyLe = function (s) { return s.dinhBien ? s.coMat / s.dinhBien * 100 : 0; };
  o.hang = function (v) { return v >= 100 ? 'A+' : v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D'; };
  // cùng màu với web (mauKPI ở nền tối)
  o.mauKPI = function (v) { return v >= 90 ? '#66d49a' : v >= 80 ? '#2fd3c6' : v >= 70 ? '#f0b04e' : '#f47272'; };
  o.mauSiSo = function (p) { return p >= 95 ? '#66d49a' : p >= 85 ? '#f0b04e' : '#f47272'; };
  o.mauXuong = function (ma) { var s = SO[ma]; if (!s) return null; return o.cheDo === 'siso' ? o.mauSiSo(o.tyLe(s)) : o.mauKPI(s.kpi); };
  o.mau = function (fi, R) { return o.mauXuong(o.xuong(fi, R)); };
  o.chuSo = function (ma) { var s = SO[ma]; if (!s) return ''; return o.cheDo === 'siso' ? s.coMat + '/' + s.dinhBien : s.kpi + '%'; };
  o.mayKhoa = function (fi, Mc) { return fi + '|' + Mc.l + '|' + (+Mc.r[0]) + '|' + (+Mc.r[1]); };
  o.baoTri = function (fi, Mc) { return BAO_TRI[o.mayKhoa(fi, Mc)] || null; };
  o.the = function (fi, R) {
    var ma = o.xuong(fi, R), s = SO[ma];
    if (!s) return '<div class="ss-the ss-trong">Phòng này chưa ghép với xưởng nào trong web.</div>';
    var p = o.tyLe(s);
    return '<div class="ss-the"><div class="ss-dong"><span>Thuộc</span><b>Xưởng ' + TEN[ma] + '</b></div>' +
      '<div class="ss-dong"><span>Hiệu suất KPI hôm nay</span><b style="color:' + o.mauKPI(s.kpi) + '">' + s.kpi + '% · hạng ' + o.hang(s.kpi) + '</b></div>' +
      '<div class="ss-dong"><span>Có mặt</span><b style="color:' + o.mauSiSo(p) + '">' + s.coMat + '/' + s.dinhBien + ' người</b></div>' +
      '<div class="ss-dong"><span>Chờ trưởng phòng duyệt</span><b>' + (s.cho ? s.cho + ' dòng' : 'không có') + '</b></div>' +
      '<small>Số liệu mẫu – web thật lấy từ sản lượng và điểm danh hôm nay.</small></div>';
  };
  o.theMay = function (fi, Mc) {
    var b = o.baoTri(fi, Mc);
    return b ? '<div class="ss-the ss-bt"><b>⚠ Đang bảo trì</b> – ' + b.ly + '<br><small>Mã trên web: ' + b.ma + ' (ghép mẫu)</small></div>' : '';
  };
  o.chuGiai = function () {
    var ds = o.cheDo === 'siso'
      ? [['#66d49a', 'Đủ người (≥ 95%)'], ['#f0b04e', 'Thiếu ít (85–95%)'], ['#f47272', 'Thiếu nhiều (< 85%)']]
      : [['#66d49a', 'A / A+ (≥ 90%)'], ['#2fd3c6', 'B (80–90%)'], ['#f0b04e', 'C (70–80%)'], ['#f47272', 'D (< 70%)']];
    return ds.concat([['#8b9196', 'Chưa ghép xưởng'], ['#e5484d', 'Máy đang bảo trì']]).map(function (x) {
      return '<span><i style="background:' + x[0] + '"></i>' + x[1] + '</span>'; }).join('');
  };
  return o;
})();
