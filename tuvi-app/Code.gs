/**
 * ============================================================
 *  THIÊN CƠ CÁC — WEB APP LẬP LÁ SỐ TỬ VI & BÁT TỰ
 *  Code.gs — điểm vào Web App, API cho giao diện, lưu lịch sử vào Google Sheet
 *
 *  Các file trong dự án Apps Script:
 *    Code.gs      – server, doGet, API
 *    Lunar.gs     – âm lịch, tiết khí
 *    TuVi.gs      – an sao Tử Vi 12 cung + luận giải
 *    BatTu.gs     – Bát Tự (Tứ Trụ), ngũ hành, đại vận
 *    LuanGiai.gs  – luận 12 cung chuyên sâu, đại vận, tiểu vận, nguyệt vận, nhật vận
 *    BatTuChiTiet.gs – luận Bát Tự chi tiết: cung vị tứ trụ, lục thân, cách cục, thần sát mở rộng
 *    TaiKhoan.gs  – đăng nhập, đăng ký, phân quyền, chế độ khách (bản rút gọn)
 *    ThanhToan.gs – ví xu, mở khóa từng phần, đơn nạp payOS/thủ công, quản trị
 *    DuDoan.gs    – suy luận các năm biến cố sức khỏe/tài chính/gia đạo, kết hôn, sinh con, tài lộc, quan lộc
 *    Index.html   – khung giao diện
 *    Styles.html  – CSS (phong cách tiên hiệp sáng)
 *    Script.html  – JavaScript phía trình duyệt (vẽ lá số)
 * ============================================================
 */

var APP_TITLE = 'Thiên Cơ Các · Lá Số Tử Vi & Bát Tự';
var SHEET_NAME = 'LaSo';
var SHEET_HEADERS = ['Thời gian lập', 'Họ tên', 'Giới tính', 'Loại lịch', 'Ngày', 'Tháng', 'Năm', 'Nhuận',
  'Giờ', 'Phút', 'Dương lịch', 'Âm lịch', 'Năm can chi', 'Mệnh', 'Cục', 'Bát tự', 'Nhật chủ', 'Dụng thần', 'Input JSON', 'Tài khoản'];
var COT_JSON = 18; // cột Input JSON (0-based) – giữ cố định cho sheet cũ

/** Trang web */
function doGet(e) {
    // Patch 8f — nhánh nghiệm chứng lá số
  if (e && e.parameter && e.parameter.page === 'nghiemchung') {
    return HtmlService.createHtmlOutputFromFile('NghiemChungUI')
      .setTitle('Nghiệm Chứng Lá Số');   // không bật ALLOWALL: không cho web khác nhúng trang
  }
  var loi = kiemTraCaiDat_();
  if (loi.length) {
    return HtmlService.createHtmlOutput(trangLoiCaiDat_(loi)).setTitle('Thiên Cơ Các – lỗi cài đặt')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  var tpl = HtmlService.createTemplateFromFile('Index');
  tpl.initialParams = JSON.stringify((e && e.parameter) || {});
  return tpl.evaluate()
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Nhúng file HTML con (Styles, Script) */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
/** Nhúng file HTML tùy chọn (không có thì bỏ qua) – dùng cho ảnh quảng bá Anh.html */
function includeTuyChon(filename) {
  try { return HtmlService.createHtmlOutputFromFile(filename).getContent(); } catch (e) { return ''; }
}

/** Tranh nền giao diện Hologram (file HoloAnh*.html chứa sẵn data:image/webp;base64). Client tải chậm từng tranh khi mở tab. */
var HOLO_ANH_ = ['TuVi', 'BatTu', 'HaLac', 'ChiemTinh', 'ThanSo', 'HD', 'Nen',
  'TabTong', 'TabTuVi', 'TabBatTu', 'TabHaLac', 'TabChiemTinh', 'TabThanSo', 'TabHD', 'TabVanHan', 'TabCapDoi'];   // Tab*: nền card từng tab
function layAnhHolo(ten) {
  if (HOLO_ANH_.indexOf(ten) < 0) return '';
  try { return HtmlService.createHtmlOutputFromFile('HoloAnh' + ten).getContent(); } catch (e) { return ''; }
}

/* ---------------------- Tự kiểm tra cài đặt ---------------------- */
var FILE_HTML_CAN_CO = { 'Index': '<!DOCTYPE html>', 'Styles': '<style>', 'Script': '<script>' };
var HAM_CAN_CO = {
  'Lunar.gs': 'solarToLunar', 'TuVi.gs': 'tuviLapLaSo', 'BatTu.gs': 'batTuLap',
  'LuanGiai.gs': 'luanChiTiet', 'DuDoan.gs': 'duDoanCuocDoi', 'BatTuChiTiet.gs': 'batTuChiTiet',
  'Astro.gs': 'astToanBo', 'ChiemTinh.gs': 'chiemTinhLap', 'HumanDesign.gs': 'hdLap', 'ThanSoHoc.gs': 'thanSoHocLap', 'TongHop.gs': 'tongHopLuan', 'PhoiNgau.gs': 'phoiNgauLuan', 'HaLac.gs': 'haLacLap', 'HoiTu.gs': 'htHoiTu_', 'VanSau.gs': 'vsHoSoThang_', 'TuViTamPhap.gs': 'tpLap_', 'BatTuLuan.gs': 'btlLinhVuc_', 'TaiKhoan.gs': 'dangNhap', 'ThanhToan.gs': 'muaPhan', 'CapDoi.gs': 'lapCapDoi',
  'Facts.gs': 'taoFact_', 'TuViHeThong.gs': 'tuviSinhFactsCung_', 'NghiemChung.gs': 'nghiemChungLap', 'DeHieu.gs': 'deHieuLap_', 'BatTuPhanTich.gs': 'btPhanTich_', 'TienIch.gs': 'tienIch'
};

/** Trả về danh sách lỗi cài đặt (rỗng nếu mọi thứ đúng) */
/** Dấu hiệu bản mới: [hàm trong file, đoạn mã mà bản mới phải có] */
var BAN_MOI_CAN_CO = {
  'BatTu.gs': ['batTuLap', 'btPhanTich_'],
  'Code.gs': ['lapLaSoDayDu_', 'btpLuuNienDacBiet_'],
  'HaLac.gs': ['haLacLap', 'hlNguyenDuong_'],
  'BatTuPhanTich.gs': ['btPhanTich_', 'BTP_DIEU_HAU'],
  'ThanSoHoc.gs': ['tsPhanTich_', 'tsChuyenTiep_'],
  'ChiemTinh.gs': ['chiemTinhLap', 'lot: lot'],
  'HumanDesign.gs': ['hdPhanTich_', 'HD_CENTER_HOI'],
  'DeHieu.gs': ['deHieuLap_', 'th6Lap_'],
  'TaiKhoan.gs': ['dangKy', 'ttQuaDangKy_'],
  'ThanhToan.gs': ['ttBangGia_', 'TT_GIA_PHIEN'],
  'HoiTu.gs': ['htTinHieu_', 'htBtTin_'],
  'TongHop.gs': ['tongHopLuan', 'vsHieuChinh_'],
  'LuanGiai.gs': ['luanChiTiet', 'tpLap_'],
  'TienIch.gs': ['guiVanNgay', 'tiZaloCo_']
};
function kiemTraCaiDat_() {
  var loi = [];
  var g = typeof globalThis !== 'undefined' ? globalThis : this;
  Object.keys(HAM_CAN_CO).forEach(function (f) {
    if (typeof g[HAM_CAN_CO[f]] !== 'function') {
      loi.push('Thiếu hoặc sai file <b>' + f + '</b>: không tìm thấy hàm <code>' + HAM_CAN_CO[f] + '</code>. ' +
        'Hãy tạo file loại <b>Tập lệnh</b> tên <b>' + f.replace('.gs', '') + '</b> và dán đúng nội dung ' + f + '.');
    }
  });
  // File đã có nhưng còn là BẢN CŨ (dán thiếu đợt cập nhật): hàm chính không gọi tới phần mới
  Object.keys(BAN_MOI_CAN_CO).forEach(function (f) {
    var m = BAN_MOI_CAN_CO[f], h = g[m[0]];
    if (typeof h !== 'function') return;                                  // thiếu hẳn file → đã báo ở trên
    if (String(h).indexOf(m[1]) < 0) loi.push('File <b>' + f + '</b> là <b>bản cũ</b> (hàm <code>' + m[0] + '</code> chưa gọi <code>' + m[1] + '</code>). ' +
      'Hãy mở file <b>' + f.replace('.gs', '') + '</b>, xóa hết và dán lại bản mới nhất.');
  });
  Object.keys(FILE_HTML_CAN_CO).forEach(function (f) {
    var c;
    try { c = HtmlService.createHtmlOutputFromFile(f).getContent(); } catch (err) {
      loi.push('Thiếu file <b>' + f + '.html</b>: hãy tạo file loại <b>HTML</b> tên <b>' + f + '</b>.');
      return;
    }
    var dau = String(c).replace(/^\s+/, '');
    if (dau.toLowerCase().indexOf(FILE_HTML_CAN_CO[f].toLowerCase()) !== 0) {
      var mau = dau.slice(0, 90).replace(/[<>&]/g, function (x) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[x]; });
      loi.push('File <b>' + f + '.html</b> có nội dung sai: dòng đầu phải là <code>' +
        FILE_HTML_CAN_CO[f].replace('<', '&lt;').replace('>', '&gt;') + '</code> nhưng đang là: <code>' + mau + '…</code>' +
        ' → có thể đã dán nhầm nội dung file khác. Hãy xóa hết và dán lại đúng file <b>' + f + '.html</b>.');
    }
  });
  return loi;
}

function trangLoiCaiDat_(loi) {
  return '<meta charset="utf-8"><div style="font-family:system-ui,sans-serif;max-width:760px;margin:30px auto;padding:22px;border:2px solid #c8372d;border-radius:14px;background:#fff8f6;line-height:1.6">' +
    '<h2 style="color:#9e2b22;margin-top:0">⚠ Cài đặt chưa đúng</h2><p>Web app phát hiện ' + loi.length + ' lỗi trong các file của dự án Apps Script:</p><ol>' +
    loi.map(function (x) { return '<li style="margin:8px 0">' + x + '</li>'; }).join('') + '</ol>' +
    '<p>Sau khi sửa: lưu (Ctrl+S) → <b>Triển khai → Quản lý các lần triển khai → ✎ → Phiên bản mới → Triển khai</b>, rồi tải lại trang này.</p></div>';
}

/** Chạy hàm này trong trình soạn thảo (chọn kiemTraCaiDat → Chạy) để xem lỗi trong Nhật ký thực thi */
function kiemTraCaiDat() {
  var loi = kiemTraCaiDat_();
  if (!loi.length) { Logger.log('✔ Cài đặt đúng: đủ 27 file .gs và 3 file HTML.'); return; }
  loi.forEach(function (x) { Logger.log('✘ ' + x.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')); });
}

/**
 * API chính: lập lá số Tử Vi + Bát Tự + tổng luận
 * @param {Object} input dữ liệu từ form
 */
/**
 * Khung kiểm toán phương pháp luận Tử Vi.
 * Mục đích: ghi rõ lớp căn cứ hiện có và giới hạn; không chấm xác suất/độ đúng giả tạo.
 */
function tuviDanhGiaPhuongPhap_(tv, chiTiet, input) {
  tv = tv || {};
  chiTiet = chiTiet || {};
  var info = tv.info || {};
  var palaces = Array.isArray(tv.palaces) ? tv.palaces : [];
  var cung = Array.isArray(chiTiet.cung) ? chiTiet.cung : [];
  var coSoCung = chiTiet.coSo && chiTiet.coSo.cung;
  var daiVan = Array.isArray(chiTiet.daiVan) ? chiTiet.daiVan : [];
  var hasMenh = info.menh !== undefined && info.menh !== null;
  var hasThan = info.thanCu !== undefined && info.thanCu !== null;
  var layers = [
    { id: 'duLieu', ten: 'Dữ liệu và cấu trúc lá số', trangThai: info.solar && info.hour !== undefined ? 'co' : 'motPhan',
      chiTiet: 'Ngày giờ sinh, thông tin lịch và cấu trúc lá số là đầu vào của các bước luận giải. Sai lệch đầu vào có thể làm thay đổi kết quả an sao.' },
    { id: 'menhThan', ten: 'Mệnh, Thân và bố cục 12 cung', trangThai: palaces.length === 12 && hasMenh && hasThan ? 'co' : 'motPhan',
      chiTiet: 'Dùng vị trí Mệnh, Thân và các cung làm khung định vị chủ đề; không suy kết luận chỉ từ một sao đơn lẻ.' },
    { id: 'cung', ten: 'Luận cung và căn cứ liên quan', trangThai: cung.length ? 'co' : (coSoCung ? 'motPhan' : 'chuaCo'),
      chiTiet: coSoCung ? 'Có phần cơ sở luận cung được trả về từ bộ máy hiện tại. Cần đối chiếu từng luận điểm với sao, cung và quy tắc cụ thể.' :
        'Cần bổ sung căn cứ có cấu trúc cho từng luận điểm để người đọc có thể truy vết.' },
    { id: 'cachCuc', ten: 'Cách cục và tổ hợp sao', trangThai: tv.luanGiai && Array.isArray(tv.luanGiai.cachCuc) && tv.luanGiai.cachCuc.length ? 'co' : 'motPhan',
      chiTiet: 'Chỉ áp dụng cách cục khi đủ điều kiện của quy tắc đã chọn; ghi nhận phá cách và yếu tố trái chiều thay vì chỉ chọn dấu hiệu thuận.' },
    { id: 'vanHan', ten: 'Đại vận và thời điểm', trangThai: daiVan.length ? 'co' : 'motPhan',
      chiTiet: 'Vận hạn là lớp diễn giải theo thời gian. Mọi dự đoán cần xác định trước khoảng thời gian và tiêu chí kiểm chứng.' },
    { id: 'doiChieu', ten: 'Đối chiếu hệ khác', trangThai: 'tachRieng',
      chiTiet: 'Bát Tự hoặc các hệ khác có thể cung cấp góc nhìn bổ sung, nhưng sự đồng thuận không tự động chứng minh kết luận đúng và không được xem là các bằng chứng độc lập nếu phụ thuộc cùng giả định.' }
  ];
  return {
    phienBan: 'TCC-TUVI-METHOD-1.0',
    ten: 'Khung kiểm toán phương pháp luận',
    layers: layers,
    nguyenTac: [
      'Không kết luận từ một sao đơn lẻ khi quy tắc yêu cầu xét cả cung và quan hệ liên cung.',
      'Giữ lại cả dấu hiệu thuận lẫn dấu hiệu nghịch; ghi rõ mâu thuẫn và điều kiện áp dụng.',
      'Không cộng số quy tắc cùng chiều thành xác suất xảy ra sự kiện.',
      'Tách độ đúng của phép tính, độ đồng thuận giữa người luận và độ chính xác dự báo thực tế.'
    ],
    danhGiaKiemDinh: 'Chưa được xác lập bằng kiểm định thực nghiệm độc lập cho phương pháp Tử Vi Đẩu Số này.',
    gioiHan: 'Đây là bản đồ căn cứ và giới hạn của quy trình, không phải chứng nhận lá số đúng hoặc dự báo đã được khoa học xác nhận.',
    duLieuDauVao: { soCung: palaces.length, soCungCoLuan: cung.length, soDaiVan: daiVan.length },
    maTran12Cung: [
      { ten: 'Mệnh', trongTam: 'Khí chất và cách cá nhân thể hiện bản thân theo ngôn ngữ truyền thống.', doiChieu: 'Thân, tam phương tứ chính, chính tinh, phụ tinh và điều kiện cách cục.', tranh: 'Không suy ra toàn bộ tính cách hay số phận từ một sao hoặc một cung.' },
      { ten: 'Huynh Đệ', trongTam: 'Quan hệ anh chị em và nguồn lực ngang hàng trong cách luận truyền thống.', doiChieu: 'Cấu trúc cung, sao liên quan và các cung có quan hệ theo trường phái đã chọn.', tranh: 'Không mặc định gia đình nào cũng có anh chị em hoặc quan hệ theo cùng một khuôn.' },
      { ten: 'Phu Thê', trongTam: 'Quan hệ đôi lứa và cách nhìn về sự gắn kết.', doiChieu: 'Cung Phu Thê, Mệnh/Thân, tam phương tứ chính và dấu hiệu thuận nghịch.', tranh: 'Không kết luận chắc chắn về hôn nhân, ly hôn hay phẩm chất của một người khác.' },
      { ten: 'Tử Tức', trongTam: 'Chủ đề con cái và việc chăm sóc, tiếp nối trong quan niệm truyền thống.', doiChieu: 'Cung Tử Tức cùng các quan hệ cung và điều kiện cụ thể của quy tắc.', tranh: 'Không dùng để kết luận khả năng sinh sản, số con hoặc sức khỏe của trẻ.' },
      { ten: 'Tài Bạch', trongTam: 'Cách tạo lập, quản lý và sử dụng nguồn lực tài chính theo diễn giải truyền thống.', doiChieu: 'Tài Bạch với Quan Lộc, Điền Trạch, Mệnh và vận hạn liên quan.', tranh: 'Không dùng làm dự báo chắc chắn về thu nhập, đầu tư hay lợi nhuận.' },
      { ten: 'Tật Ách', trongTam: 'Chủ đề sức khỏe và điểm cần chăm sóc trong văn bản truyền thống.', doiChieu: 'Cung Tật Ách và cấu trúc lá số theo quy tắc đã chọn.', tranh: 'Không chẩn đoán bệnh, dự báo tử vong hoặc thay thế đánh giá y tế.' },
      { ten: 'Thiên Di', trongTam: 'Hoàn cảnh bên ngoài, thay đổi môi trường và cách tương tác ngoài gia đình.', doiChieu: 'Thiên Di với Mệnh, Quan Lộc, Nô Bộc và tầng vận đang xét.', tranh: 'Không khẳng định chắc chắn việc xuất ngoại, tai nạn hay một biến cố cụ thể.' },
      { ten: 'Nô Bộc', trongTam: 'Quan hệ bạn bè, cộng sự và mạng lưới hỗ trợ theo hệ quy chiếu truyền thống.', doiChieu: 'Nô Bộc, Quan Lộc, Thiên Di và các dấu hiệu thuận nghịch.', tranh: 'Không gán nhãn người khác là phản bội hoặc đáng tin chỉ từ lá số.' },
      { ten: 'Quan Lộc', trongTam: 'Công việc, vai trò và định hướng nghề nghiệp theo cách luận truyền thống.', doiChieu: 'Quan Lộc với Mệnh, Tài Bạch, Thiên Di và vận hạn.', tranh: 'Không khẳng định chắc chắn chức vụ, thăng chức, thất nghiệp hoặc thành công.' },
      { ten: 'Điền Trạch', trongTam: 'Nhà ở, không gian sống và tài sản cố định trong quan niệm truyền thống.', doiChieu: 'Điền Trạch với Tài Bạch, Phúc Đức, Mệnh và vận hạn.', tranh: 'Không dùng để bảo đảm mua bán bất động sản hoặc dự báo tranh chấp cụ thể.' },
      { ten: 'Phúc Đức', trongTam: 'Nền tảng gia tộc, đời sống tinh thần và cảm nhận về sự nâng đỡ.', doiChieu: 'Phúc Đức với Mệnh, Phu Thê, Điền Trạch và cấu trúc liên cung.', tranh: 'Không xem đây là bằng chứng về nghiệp, đạo đức hay giá trị của một gia đình.' },
      { ten: 'Phụ Mẫu', trongTam: 'Quan hệ với cha mẹ, người nuôi dưỡng và nguồn hỗ trợ thế hệ trước.', doiChieu: 'Phụ Mẫu với Mệnh, Phúc Đức và các dấu hiệu liên quan.', tranh: 'Không kết luận chắc chắn về tuổi thọ, bệnh tật hoặc biến cố của cha mẹ.' }
    ]
  };
}

/** Kiểm thử tự chứa cho khung kiểm toán phương pháp luận; có thể chạy thủ công trong Apps Script. */
function tuviKiemThuPhuongPhap_() {
  var mau = {
    info: { solar: { year: 1990 }, hour: 8, menh: 0, thanCu: 'Quan Lộc' },
    palaces: Array.from({ length: 12 }, function (_, i) { return { cung: i }; }),
    luanGiai: { cachCuc: [{ ten: 'Mẫu kiểm thử' }] }
  };
  var ct = { cung: Array.from({ length: 12 }, function (_, i) { return { cung: i }; }), coSo: { cung: ['mẫu'] }, daiVan: [{ nam: 2020 }] };
  var a = tuviDanhGiaPhuongPhap_(mau, ct, {});
  var checks = [
    { ten: 'Có đủ 12 chủ đề cung', ok: a.maTran12Cung.length === 12 },
    { ten: 'Giữ riêng lớp đối chiếu hệ khác', ok: a.layers.some(function (x) { return x.id === 'doiChieu' && x.trangThai === 'tachRieng'; }) },
    { ten: 'Không tự gán phần trăm chính xác', ok: !/%/.test(a.danhGiaKiemDinh) && !/\b\d+\s*%/.test(JSON.stringify(a)) },
    { ten: 'Ghi rõ trạng thái kiểm định', ok: /Chưa được xác lập/.test(a.danhGiaKiemDinh) },
    { ten: 'Có nguyên tắc xử lý mâu thuẫn', ok: a.nguyenTac.length >= 4 }
  ];
  return { ok: checks.every(function (x) { return x.ok; }), checks: checks, phienBan: a.phienBan };
}


/**
 * Hồ sơ truy vết Bát Tự/Hà Lạc.
 * LƯU Ý: sự hiện diện của dữ liệu/thuật toán không đồng nghĩa nguồn cổ thư đã được xác minh.
 * Trạng thái nguồn chỉ được nâng lên VERIFIED_SOURCE khi có bản văn, ấn bản/chương/trang
 * và ví dụ độc lập tái lập được. Các trọng số nội bộ vẫn là heuristic cho đến lúc đó.
 */
function btDanhGiaPhuongPhap_(bt, ct) {
  bt = bt || {}; ct = ct || {};
  var p = Array.isArray(bt.pillars) ? bt.pillars : [];
  var layers = [
    {id:'tuTru', ten:'Tứ trụ và tiết khí', duLieuCoMat:p.length===4,
      chiTiet:'Dữ liệu tứ trụ ' + (p.length===4?'đã có':'chưa đủ') + '. Quy tắc đổi năm Lập Xuân, ranh giới tiết khí, múi giờ và quy ước giờ Tý vẫn cần bộ ví dụ tham chiếu độc lập; chưa đánh dấu nguồn là đã xác minh.'},
    {id:'nhatChu', ten:'Nhật chủ và nguyệt lệnh', duLieuCoMat:!!(bt.nhatChu && p.length===4),
      chiTiet:'Có dữ liệu Nhật chủ/nguyệt lệnh: ' + (!!(bt.nhatChu && p.length===4) ? 'có' : 'chưa đủ') + '. Vượng suy, căn khí, sinh trợ và khắc tiết hao phải tách khỏi điểm số heuristic; cần đối chiếu từng quy tắc với bộ Tử Bình đã chọn.'},
    {id:'cachCuc', ten:'Cách cục và vượng suy', duLieuCoMat:!!(bt.cuong && bt.trangThai),
      chiTiet:'Có trường dữ liệu phân tích: ' + (!!(bt.cuong && bt.trangThai) ? 'có' : 'chưa đủ') + '. Điều kiện thành cách, phá cách, điều hậu và ngoại cách chưa được coi là đã xác minh nếu chưa có nguồn/chương và ví dụ giải mẫu.'},
    {id:'dungThan', ten:'Dụng thần, hỷ thần, kỵ thần', duLieuCoMat:!!(bt.goiY && bt.goiY.dung),
      chiTiet:'Có kết quả dụng thần: ' + (!!(bt.goiY && bt.goiY.dung) ? 'có' : 'chưa đủ') + '. Cần ghi riêng lý do theo cách cục, vượng suy và điều hậu; không mặc định một phương pháp duy nhất hoặc xem trọng số phần mềm là quy tắc cổ điển.'},
    {id:'thanSat', ten:'Thập thần, hợp xung hình hại và thần sát', duLieuCoMat:!!ct,
      chiTiet:'Lớp bổ trợ; cần truy nguồn riêng cho từng quy tắc và kiểm tra không đếm trùng một quan hệ qua nhiều lớp. Dữ liệu hiện có không tự chứng minh diễn giải đã được xác minh.'},
    {id:'daiVan', ten:'Đại vận và lưu niên', duLieuCoMat:Array.isArray(bt.daiVan)&&bt.daiVan.length>0,
      chiTiet:'Có dữ liệu đại vận: ' + (Array.isArray(bt.daiVan)&&bt.daiVan.length ? 'có' : 'chưa đủ') + '. Chiều vận, thời điểm khởi vận và xử lý tiết khí cần test ranh giới có kết quả tham chiếu.'}
  ];
  layers.forEach(function(x){ x.trangThai = 'motPhan'; });
  return {
    phienBan:'TCC-BAT-TU-METHOD-1.1',
    layers:layers,
    nguonCanDoiChieu:[
      {ten:'《子平真诠》 Tử Bình Chân Thuyên',phamVi:'Nguyệt lệnh, chính cách, thành cách/phá cách và cứu ứng',trangThai:'NEEDS_PRIMARY_TEXT_VERIFICATION'},
      {ten:'《滴天髓》 Tích Thiên Tủy',phamVi:'Khí thế toàn cục, sinh khắc và vượng suy',trangThai:'NEEDS_PRIMARY_TEXT_VERIFICATION'},
      {ten:'《穷通宝鉴》 Cùng Thông Bảo Giám',phamVi:'Điều hậu theo mùa sinh',trangThai:'NEEDS_PRIMARY_TEXT_VERIFICATION'},
      {ten:'《渊海子平》 Uyên Hải Tử Bình và 《三命通会》 Tam Mệnh Thông Hội',phamVi:'Quy tắc nền tảng và các dị bản cần so sánh',trangThai:'NEEDS_PRIMARY_TEXT_VERIFICATION'}
    ],
    nguyenTac:[
      'Luận Nhật chủ cùng nguyệt lệnh, căn khí và toàn cục trước khi kết luận dụng thần.',
      'Tách các quy tắc Tử Bình khác nhau thành phiên bản riêng, không âm thầm trộn quy tắc.',
      'Ghi nhận cả dấu hiệu thuận và nghịch; không đếm trùng một căn cứ qua nhiều tên gọi.',
      'Không suy ra xác suất thành công, bệnh tật hoặc sự kiện từ điểm số nội bộ.',
      'Tách độ đúng phép tính, mức đồng thuận và độ chính xác dự báo.',
      'Các nguồn liệt kê là đầu mối cần đối chiếu, chưa phải bằng chứng đã đọc/xác minh bản văn.'
    ],
    danhGiaKiemDinh:'Chưa được xác lập bằng kiểm định thực nghiệm độc lập cho Bát Tự.',
    gioiHan:'Trạng thái “Cần đối chiếu thêm” phản ánh tình trạng bằng chứng nguồn, không phủ nhận việc mã có tính toán; không phải chứng nhận dự đoán đã được khoa học xác nhận.'
  };
}

/** Chuẩn hóa căn cứ Hà Lạc, tách phép lập quẻ khỏi diễn giải. */
function hlDanhGiaPhuongPhap_(h) {
  h = h || {};
  var t = h.tien || {}, a = h.hau || {};
  var layers = [
    {id:'lapQue',ten:'Lập quẻ Tiên thiên và Hậu thiên',duLieuCoMat:!!(t.hao&&a.hao),
      chiTiet:'Có dữ liệu quẻ Tiên/Hậu thiên: ' + (!!(t.hao&&a.hao)?'có':'chưa đủ') + '. Bảng số can chi, phép quy số, số 5/ký cung và quy tắc chọn thượng/hạ quái chưa được xác minh với một bản văn/ấn bản cụ thể.'},
    {id:'nguyenDuong',ten:'Hào nguyên đường',duLieuCoMat:t.nguyenDuong!==undefined&&a.nguyenDuong!==undefined,
      chiTiet:'Có dữ liệu hào nguyên đường: ' + (t.nguyenDuong!==undefined&&a.nguyenDuong!==undefined?'có':'chưa đủ') + '. Cần đối chiếu độc lập quy tắc chọn hào và ví dụ nguồn; chú thích trong mã không tự thân là bằng chứng.'},
    {id:'quePhu',ten:'Quẻ hỗ, quẻ biến và các quẻ phụ',duLieuCoMat:!!(h.hoTien&&h.hoHau),
      chiTiet:'Có dữ liệu quẻ phụ: ' + (!!(h.hoTien&&h.hoHau)?'có':'chưa đủ') + '. Phép biến đổi cấu trúc có thể kiểm thử bằng tính chất toán học; cách diễn giải và quy tắc lập số vẫn cần nguồn riêng.'},
    {id:'luanGiai',ten:'Luận tượng và thời vị',duLieuCoMat:!!h.luan,
      chiTiet:'Có dữ liệu luận giải: ' + (!!h.luan?'có':'chưa đủ') + '. Mọi điểm số hào, chu kỳ 6/9 năm và kết luận cát-hung chưa có nguồn trực tiếp phải được coi là heuristic/thử nghiệm, không phải quy tắc cổ thư đã xác minh.'}
  ];
  layers.forEach(function(x){ x.trangThai = 'motPhan'; });
  return {
    phienBan:'TCC-HA-LAC-METHOD-1.1',
    layers:layers,
    nguonCanDoiChieu:[
      {ten:'Tài liệu chuyên biệt về 河洛理数 (Hà Lạc lý số)',phamVi:'Bảng số can chi, thiên/địa số, quy nguyên, ký cung và hào nguyên đường',trangThai:'NEEDS_PRIMARY_TEXT_VERIFICATION'},
      {ten:'《周易》 Chu Dịch / Kinh Dịch',phamVi:'Cấu trúc quẻ, thứ tự hào, tượng quái và hào từ',trangThai:'FOUNDATIONAL_TEXT_NOT_SUFFICIENT_TO_VERIFY_HA_LAC_NUMBERING'},
      {ten:'《皇极经世》 Hoàng Cực Kinh Thế',phamVi:'Đầu mối khảo sát tư tưởng tượng số; không mặc định là nguồn trực tiếp cho toàn bộ thuật toán',trangThai:'RELATED_SOURCE_REQUIRES_SCOPE_VERIFICATION'}
    ],
    nguyenTac:[
      'Tách kiểm tra phép lập quẻ khỏi diễn giải tượng số.',
      'Ghi lại phép tính trung gian để tái lập kết quả.',
      'Giữ đúng cấu trúc quẻ và hào; không đồng nhất Hà Lạc với bố cục Hà Đồ/Lạc Thư.',
      'Giữ các diễn giải mâu thuẫn để đối chiếu, không chỉ chọn phần khớp hậu nghiệm.',
      'Không tuyên bố xác suất hoặc độ chính xác khi chưa kiểm định độc lập.',
      'Các nguồn liệt kê là đầu mối nghiên cứu; chưa xác minh bản văn/ấn bản và ví dụ trực tiếp.'
    ],
    danhGiaKiemDinh:'Chưa được xác lập bằng kiểm định thực nghiệm độc lập cho Hà Lạc.',
    gioiHan:'Phép tính cấu trúc có thể vượt qua unit test mà vẫn chưa xác minh nguồn lập số; điểm số và kết luận không có nguồn trực tiếp phải được đánh dấu heuristic.'
  };
}

/**
 * Kiểm thử hồi quy cho hồ sơ truy vết phương pháp.
 * Chạy thủ công trong Apps Script: tccKiemThuTrangThaiPhuongPhap_()
 * Không kiểm chứng tính đúng của trường phái; chỉ bảo đảm UI/API không gắn nhãn
 * “đã xác minh nguồn” khi hồ sơ chưa có bằng chứng nguồn trực tiếp.
 */
function tccKiemThuTrangThaiPhuongPhap_() {
  var bt = btDanhGiaPhuongPhap_({pillars:[{},{},{},{}], nhatChu:'Giáp', goiY:{dung:'Mộc'}, daiVan:[{}]}, {});
  var hl = hlDanhGiaPhuongPhap_({tien:{hao:1,nguyenDuong:2},hau:{hao:3,nguyenDuong:4},hoTien:{},hoHau:{},luan:'mẫu'});
  var checks = [];
  function check(id, ok, detail) { checks.push({id:id, pass:!!ok, detail:detail||''}); }
  check('battu-version', bt.phienBan === 'TCC-BAT-TU-METHOD-1.1', bt.phienBan);
  check('halac-version', hl.phienBan === 'TCC-HA-LAC-METHOD-1.1', hl.phienBan);
  check('battu-layers-not-verified', bt.layers.length === 6 && bt.layers.every(function(x){return x.trangThai === 'motPhan';}), 'Mọi lớp cần đối chiếu nguồn');
  check('halac-layers-not-verified', hl.layers.length === 4 && hl.layers.every(function(x){return x.trangThai === 'motPhan';}), 'Mọi lớp cần đối chiếu nguồn');
  check('battu-source-ledger', Array.isArray(bt.nguonCanDoiChieu) && bt.nguonCanDoiChieu.length >= 3, 'Có danh mục nguồn cần xác minh');
  check('halac-source-ledger', Array.isArray(hl.nguonCanDoiChieu) && hl.nguonCanDoiChieu.length >= 2, 'Có danh mục nguồn cần xác minh');
  check('no-empirical-claim', /Chưa được xác lập/.test(bt.danhGiaKiemDinh) && /Chưa được xác lập/.test(hl.danhGiaKiemDinh), 'Không tuyên bố đã kiểm định độc lập');
  var failed = checks.filter(function(x){return !x.pass;});
  return {pass:failed.length===0, total:checks.length, passed:checks.length-failed.length, failed:failed, checks:checks};
}

function lapLaSoDayDu_(input) {
  input = input || {};
  var tv = tuviLapLaSo(input);
  var bt = batTuLap(input);
  var result = {
    tuvi: tv,
    battu: bt,
    ketHop: ketHopLuan(tv, bt),
    chiTiet: null,
    saoInfo: SAO,
    createdAt: new Date().toISOString()
  };
  result.chiTiet = luanChiTiet(tv, bt, input);
  result.tuvi.danhGiaPhuongPhap = tuviDanhGiaPhuongPhap_(tv, result.chiTiet, input);
  result.duDoan = duDoanCuocDoi(tv, bt, input, result.chiTiet.daiVan);
  result.battuChiTiet = batTuChiTiet(bt, input, tv);
  // Trường hợp đặc biệt từng lưu niên (BatTuPhanTich.gs): tuế vận tịnh lâm, thiên khắc địa xung, tam hình, Thiên La Địa Võng
  if (typeof btpLuuNienDacBiet_ === 'function' && result.battuChiTiet && result.battuChiTiet.luuNien) {
    result.battuChiTiet.luuNien.forEach(function (y) {
      var dv = (bt.daiVan || []).filter(function (d) { return y.nam >= d.nam && y.nam < d.nam + 10; })[0];
      try { y.dacBiet = btpLuuNienDacBiet_(bt, y.nam, dv); } catch (e) { y.dacBiet = []; }
    });
  }
  try {
    result.moRong = lapMoRong_(input, result);
  } catch (err) {
    result.moRongLoi = String(err && err.message || err);
  }
  result.battu.danhGiaPhuongPhap = btDanhGiaPhuongPhap_(result.battu, result.battuChiTiet);
  if (result.moRong && result.moRong.haLac) result.moRong.haLac.danhGiaPhuongPhap = hlDanhGiaPhuongPhap_(result.moRong.haLac);
  if (input.save) {
    try { luuLichSu_(input, result); result.saved = true; } catch (err) { result.saveError = String(err && err.message || err); }
  }
  return result;
}

/**
 * Dò giờ sinh: thử 12 giờ (Tý → Hợi) với cùng ngày sinh, đo mức khớp của các sự kiện đã biết.
 * @param {Object} input dữ liệu form, cần input.events = [{nam, loai}]
 */
function doGioSinh(input, token) {
  ttCanPhan_(token, input, 'do_gio');
  input = input || {};
  // Dò giờ dựa trên 7 chủ đề của Tử Vi (DuDoan.gs): loại sự kiện mới quy về chủ đề gần nhất, loại không có chủ đề tương ứng thì bỏ qua
  var QUY = { thangTien: 'quanLoc', doiViec: 'quanLoc', taiSan: 'taiLoc', batHoa: 'giaDao', nguoiThan: 'giaDao', nhaCua: 'giaDao', quenMoi: 'ketHon' };
  var ev = (input.events || []).filter(function (e) { return e && e.nam && e.loai; })
    .map(function (e) { return { nam: e.nam, loai: DD_CHU_DE[e.loai] ? e.loai : QUY[e.loai] }; }).filter(function (e) { return e.loai && DD_CHU_DE[e.loai]; });
  if (!ev.length) throw new Error('Hãy nhập ít nhất một sự kiện đã biết thuộc các loại: kết hôn, sinh con, ốm nặng, mất tiền, biến cố gia đình, phát tài, công việc (đi xa, thi cử, kiện tụng chưa dùng để dò giờ).');
  var gocChi = Math.floor(((parseInt(input.hour, 10) || 0) + 1) / 2) % 12;
  var out = [];
  for (var h = 0; h < 12; h++) {
    var inp = JSON.parse(JSON.stringify(input));
    inp.hour = h === 0 ? 0 : h * 2; inp.minute = h === 0 ? 30 : 0; inp.trueSolar = false; inp.events = ev;
    var tv = tuviLapLaSo(inp), bt = batTuLap(inp);
    var D = duDoanCuocDoi(tv, bt, inp, false);
    var dc = D.doiChieu;
    out.push({
      gio: h, gioTen: CHI[h] + ' (' + GIO_CHI[h] + ')', hienTai: h === gocChi,
      menh: CHI[tv.info.menh], cuc: tv.info.cuc,
      chinhTinh: tv.palaces[tv.info.menh].chinh.map(function (s) { return s.n; }).join(', ') || 'VCD',
      truGio: bt.pillars[3].canTen + ' ' + bt.pillars[3].chiTen,
      diem: dc.trungBinh, trungTop: dc.trungTop, pct: dc.suKien.map(function (x) { return x.pct; })
    });
  }
  var sorted = out.slice().sort(function (a, b) { return (b.trungTop - a.trungTop) || (b.diem - a.diem); });
  return { gio: out, tot: sorted[0], suKien: ev.map(function (e) { return e.nam + ' – ' + DD_CHU_DE[e.loai].ten; }),
    ghiChu: 'Giờ có điểm khớp cao nhất là ứng viên tốt nhất cho giờ sinh thật. Cần ≥ 3–4 sự kiện ở các chủ đề khác nhau thì kết quả mới đáng tin; đây là phương pháp "định giờ sinh bằng sự kiện" tham khảo.' };
}

/** Đổi lịch nhanh cho ô xem trước ở form */
function doiLich(input) {
  var d = parseInt(input.day, 10), m = parseInt(input.month, 10), y = parseInt(input.year, 10);
  if (input.calendar === 'am') {
    var s = lunarToSolar(d, m, y, input.leap ? 1 : 0, LUNAR_TZ);
    if (!s) return { ok: false, msg: 'Ngày âm lịch không hợp lệ' };
    return { ok: true, solar: s, leapMonth: getLeapMonthOfYear(y) };
  }
  var l = solarToLunar(d, m, y, LUNAR_TZ);
  return { ok: true, lunar: l };
}

/** Chiêm tinh + Thần số học + Human Design + Tổng hợp đa hệ */
function lapMoRong_(input, result) {
  // Mỗi hệ được tính độc lập: lỗi ở một hệ không làm mất dữ liệu của các hệ còn lại.
  var tv = result.tuvi, vy = tv.info.viewYear, loi = {};
  var ct = null, ctL = null, ts = null, hd = null, hl = null, hlL = null;
  var ctOut = null, hdOut = null, hlOut = null, tsL = null, th = null, dh = null;

  try { ct = chiemTinhLap(input); }
  catch (e) { loi.chiemTinh = String(e && e.message || e); }
  if (ct) {
    try { ctL = chiemTinhLuan(ct, vy); }
    catch (e) { loi.chiemTinhLuan = String(e && e.message || e); }
    try {
      ctOut = { thoiDiem: ct.thoiDiem, heNha: ct.heNha, cusp: ct.cusp, hanhTinh: ct.hanhTinh, asc: ct.asc, mc: ct.mc, goc: ct.goc,
        nguyenTo: ct.nguyenTo, tinhChat: ct.tinhChat, phaTrang: ct.phaTrang, chuTinh: ct.chuTinh };
    } catch (e) { loi.chiemTinhRutGon = String(e && e.message || e); }
  }

  try { ts = thanSoHocLap(input, tv.info.solar, vy); }
  catch (e) { loi.thanSo = String(e && e.message || e); }
  if (ts) {
    try { tsL = thanSoHocLuan(ts); }
    catch (e) { loi.thanSoLuan = String(e && e.message || e); }
  }

  if (ct && ct.thoiDiem) {
    try { hd = hdLap(ct.thoiDiem.jd); }
    catch (e) { loi.hd = String(e && e.message || e); }
  } else {
    loi.hd = 'Không thể lập Human Design vì dữ liệu thời điểm Chiêm Tinh không có.';
  }
  if (hd) {
    try {
      hdOut = { act: hd.act, gates: hd.gates, kenh: hd.kenh, dinh: hd.dinh, loai: hd.loai,
        loaiTen: HD_TYPES[hd.loai].ten, thamQuyen: HD_AUTH[hd.thamQuyen].ten,
        chienLuoc: HD_TYPES[hd.loai].chienLuoc, profile: hd.profile, dinhNghia: hd.dinhNghia,
        cross: hd.cross, goc: hd.goc, luan: hdLuan(hd) };
    } catch (e) { loi.hdRutGon = String(e && e.message || e); hdOut = null; }
    if (hdOut) {
      try { hdOut.phanTich = hdPhanTich_(hd, ct.thoiDiem, vy); }
      catch (e) { hdOut.phanTichLoi = String(e && e.message || e); }
    }
  }

  try { hl = haLacLap(result.battu, tv); }
  catch (e) { loi.haLac = String(e && e.message || e); }
  if (hl) {
    try { hlL = haLacLuan(hl, result.battu, vy); }
    catch (e) { loi.haLacLuan = String(e && e.message || e); }
    hlOut = { tien: hl.tien, hau: hl.hau, hoTien: hl.hoTien, hoHau: hl.hoHau, lucHao: hl.lucHao, male: hl.male, luan: hlL };
  }

  // Chỉ tạo luận giải tổng hợp khi đủ dữ liệu đầu vào; các hệ riêng lẻ vẫn hoạt động nếu thiếu một hệ.
  if (ct && ctL && ts && hd && hl && hlL) {
    try {
      th = tongHopLuan({ tv: tv, bt: result.battu, btct: result.battuChiTiet, ct: ct, ctL: ctL, ts: ts, hd: hd, hl: hl, hlL: hlL, chiTiet: result.chiTiet,
        duDoan: result.duDoan, daiVanTV: result.chiTiet.daiVan, input: input });
    } catch (e) { loi.tongHop = String(e && e.message || e); }
  } else {
    loi.tongHop = 'Chưa đủ dữ liệu từ tất cả các hệ để tạo luận giải tổng hợp.';
  }

  try {
    if (tv && result.chiTiet && result.battu && ctOut && ctL && th && ts && tsL && hdOut && hlOut) {
      dh = deHieuLap_({ tv: tv, chiTiet: result.chiTiet, bt: result.battu, btct: result.battuChiTiet, ct: ctOut, ctl: ctL, th: th, ts: ts, tsl: tsL, hdOut: hdOut, hl: hlOut });
    }
  } catch (e) { dh = { loi: String(e && e.message || e) }; }

  var out = { tongHop: th, deHieu: dh };
  if (hlOut) out.haLac = hlOut;
  if (ctOut) out.chiemTinh = ctOut;
  if (ctL) out.chiemTinhLuan = ctL;
  if (ts) out.thanSo = ts;
  if (tsL) out.thanSoLuan = tsL;
  if (hdOut) out.hd = hdOut;
  if (Object.keys(loi).length) out.loiTungHe = loi;
  return out;
}

/* ---------------------- Lưu trữ Google Sheet ---------------------- */

function getSheet_() {
  var ss = laySS_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(SHEET_HEADERS);
    sh.getRange(1, 1, 1, SHEET_HEADERS.length)
      .setFontWeight('bold').setBackground('#1f5f5b').setFontColor('#fdf6e3');
    sh.setFrozenRows(1);
    sh.setColumnWidth(SHEET_HEADERS.length, 80);
  }
  if (!sh.getRange(1, COT_JSON + 2).getValue()) sh.getRange(1, COT_JSON + 2).setValue('Tài khoản').setFontWeight('bold');
  return sh;
}

/** Khóa nhận diện "cùng một lá số": tài khoản + họ tên + giới tính + ngày dương + giờ + phút.
 *  (Lập lại cùng người để xem năm khác, nơi sinh khác… vẫn tính là trùng – chỉ giữ lần mới nhất.) */
function lsKhoa_(chu, ten, gioi, duong, gio, phut) {
  var d = String(duong || '').replace(/^'/, '').split(/[\/\-.]/).map(function (x) { return parseInt(x, 10) || 0; }).join('/');
  function so(x) { var n = parseInt(x, 10); return isNaN(n) ? '' : String(n); }
  return [String(chu || ''), String(ten || '').trim().replace(/\s+/g, ' ').toLowerCase(), String(gioi || '').trim().toLowerCase(), d, so(gio), so(phut)].join('|');
}
function lsKhoaDong_(d) { return lsKhoa_(d[COT_JSON + 1], d[1], d[2], d[10], d[8], d[9]); }

/** Xóa các dòng trong danh sách (xóa từ dưới lên để số dòng không lệch) */
function lsXoaDong_(sh, rows) {
  rows.sort(function (a, b) { return b - a; }).forEach(function (r) { sh.deleteRow(r); });
  return rows.length;
}

function luuLichSu_(input, r) {
  var sh = getSheet_();
  var I = r.tuvi.info, B = r.battu;
  var s = I.solar, l = I.lunar;
  var lock = null;
  try { lock = LockService.getScriptLock(); lock.waitLock(10000); } catch (e) { lock = null; }
  try {
  // Lá số trùng (cùng người, cùng giờ sinh, cùng tài khoản) trong 400 dòng gần nhất → xóa bản cũ, chỉ giữ lần lập mới nhất
  var khoa = lsKhoa_(input.taiKhoan || '', input.name || 'Vô Danh', I.gender, s.day + '/' + s.month + '/' + s.year, input.hour, input.minute);
  var last = sh.getLastRow();
  if (last >= 2) {
    var n = Math.min(400, last - 1), ncol = Math.max(sh.getLastColumn(), COT_JSON + 2);
    var hien = sh.getRange(last - n + 1, 1, n, ncol).getDisplayValues(), trung = [];
    hien.forEach(function (d, i) { if (lsKhoaDong_(d) === khoa) trung.push(last - n + 1 + i); });
    lsXoaDong_(sh, trung);
  }
  sh.appendRow([
    new Date(), input.name || 'Vô Danh', I.gender, input.calendar === 'am' ? 'Âm lịch' : 'Dương lịch',
    input.day, input.month, input.year, input.leap ? 'x' : '', input.hour, input.minute,
    "'" + s.day + '/' + s.month + '/' + s.year,                               // dấu ' giữ dạng chữ, tránh Sheet tự đổi thành ngày
    "'" + l.day + '/' + l.month + (l.leap ? ' (nhuận)' : '') + '/' + l.year,
    I.namCanChi, I.banMenh.ten, I.cuc,
    B.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' | '),
    B.nhatChu, B.goiY.dung,
    JSON.stringify(input), input.taiKhoan || ''
  ]);
  } finally { if (lock) try { lock.releaseLock(); } catch (e) {} }
}

/** Lấy 50 lá số gần nhất (chủ sở hữu xem tất cả, thành viên xem lá số của mình).
 *  Chỉ trả chữ: Sheet có thể tự đổi "15/8/1990" thành ô ngày, mà google.script.run không trả được Date
 *  (trình duyệt nhận null → tưởng lịch sử trống). */
function getLichSu(token) {
  var u = tkCan_(token), sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var n = Math.min(400, last - 1), ncol = Math.max(sh.getLastColumn(), COT_JSON + 1);
  var rg = sh.getRange(last - n + 1, 1, n, ncol), values = rg.getValues(), hien = rg.getDisplayValues();   // chữ đúng như hiển thị trên Sheet
  var out = [], daCo = {};
  for (var i = values.length - 1; i >= 0 && out.length < 50; i--) {
    var v = values[i], d = hien[i], chu = String(d[COT_JSON + 1] || '');
    if (u.vaiTro !== 'chu' && chu !== u.ten) continue;
    var k = lsKhoaDong_(d); if (daCo[k]) continue; daCo[k] = 1;         // lá số trùng: chỉ hiện lần lập mới nhất
    var inp = {};
    try { inp = JSON.parse(d[COT_JSON]); } catch (e) { inp = {}; }
    delete inp.taiKhoan;
    out.push({
      row: last - n + 1 + i,
      time: v[0] instanceof Date ? Utilities.formatDate(v[0], 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm') : d[0],
      name: d[1], gender: d[2], duong: d[10], am: d[11], canChi: d[12], cuc: d[14], input: inp, taiKhoan: chu
    });
  }
  return out;
}

/** Xóa một dòng lịch sử (thành viên chỉ xóa được lá số của mình) */
function xoaLichSu(row, token) {
  var u = tkCan_(token), sh = getSheet_();
  row = parseInt(row, 10);
  if (!(row >= 2 && row <= sh.getLastRow())) return false;
  if (u.vaiTro !== 'chu' && String(sh.getRange(row, COT_JSON + 2).getValue()) !== u.ten) throw new Error('Bạn chỉ xóa được lá số do mình lập.');
  sh.deleteRow(row);
  return true;
}

/** Dọn lá số trùng: mỗi người + giờ sinh chỉ giữ lần lập mới nhất (chủ sở hữu dọn toàn bộ, thành viên dọn lá số của mình).
 *  Trả về số dòng đã xóa. */
function donLichSu(token) {
  var u = tkCan_(token), sh = getSheet_(), last = sh.getLastRow();
  if (last < 3) return 0;
  var lock = null;
  try { lock = LockService.getScriptLock(); lock.waitLock(20000); } catch (e) { lock = null; }
  try {
    var ncol = Math.max(sh.getLastColumn(), COT_JSON + 2), hien = sh.getRange(2, 1, last - 1, ncol).getDisplayValues(), daCo = {}, xoa = [];
    for (var i = hien.length - 1; i >= 0; i--) {                         // đi từ mới → cũ
      var d = hien[i], chu = String(d[COT_JSON + 1] || '');
      if (u.vaiTro !== 'chu' && chu !== u.ten) continue;
      var k = lsKhoaDong_(d);
      if (daCo[k]) xoa.push(i + 2); else daCo[k] = 1;
    }
    return lsXoaDong_(sh, xoa);
  } finally { if (lock) try { lock.releaseLock(); } catch (e) {} }
}

/** Hàm chạy thử trong trình soạn thảo Apps Script */
function testLapLaSo() {
  var r = lapLaSoDayDu_({ name: 'Thử nghiệm', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026 });
  Logger.log(JSON.stringify(r.tuvi.info, null, 2));
  Logger.log(r.battu.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' | '));
}