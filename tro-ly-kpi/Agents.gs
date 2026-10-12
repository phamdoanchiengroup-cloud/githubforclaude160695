/**
 * CÔNG TY AGENT – nhiều "phòng ban" AI trong cùng bot Zalo.
 *
 * Mọi cấu hình nằm trong Google Sheet "Trợ lý – Công ty Agent" (tạo tự động bởi caiDatAgent):
 *   CacAgent – mỗi dòng 1 phòng: Ma | Ten | Goi | MoTa | VaiTro | CongCu | Model | Effort | Bat
 *   SoTay    – trí nhớ chung: ID | ThoiDiem | Loai | NoiDung | Han | TrangThai | DaNhac | Nguon
 *              Loai "Bối cảnh" luôn được đưa cho mọi phòng; "Việc" có Han sẽ được nhắc qua Zalo.
 *   NhatKy   – lịch sử hỏi đáp (để xem lại, không gửi cho AI).
 * Chủ dự án sửa sheet là đổi được cách làm việc, không cần đụng mã.
 *
 * Nguyên tắc an toàn: chỉ đọc dữ liệu sản xuất; email chỉ tạo NHÁP; lịch chỉ ghi vào lịch của chính chủ, không mời ai.
 */

var AG_TEN_FILE = 'Trợ lý – Công ty Agent';
var AG_COT = ['Ma', 'Ten', 'Goi', 'MoTa', 'VaiTro', 'CongCu', 'Model', 'Effort', 'Bat'];
var ST_COT = ['ID', 'ThoiDiem', 'Loai', 'NoiDung', 'Han', 'TrangThai', 'DaNhac', 'Nguon'];
var NK_COT = ['ThoiDiem', 'Phong', 'CauHoi', 'TraLoi'];

var AG_MAC_DINH = [
  ['san_xuat', 'Sản xuất', 'sx, sản xuất, kpi',
    'Số liệu sản xuất hằng ngày: sản lượng, hiệu suất, dừng máy, KCS, chờ duyệt, bảo trì máy, bản tin ngày/tuần.',
    'Bạn là Trưởng phòng Sản xuất ảo, báo cáo cho Phó giám đốc sản xuất. Trả lời nhanh, chính xác bằng số liệu thật từ CSDL KPI. ' +
    'Khi thấy bất thường (hiệu suất tụt, dừng máy nhiều, lỗi KCS tăng, chưa duyệt/chưa khai) thì nêu rõ xưởng, mức độ và gợi ý việc cần hỏi tổ trưởng.',
    'tra_cuu, hieu_suat, ban_tin, so_tay_tim', '', '', 'Có'],
  ['phan_tich', 'Phân tích dữ liệu', 'pt, phân tích, báo cáo',
    'Phân tích sâu nhiều ngày/tháng, so sánh giai đoạn, tìm nguyên nhân, xu hướng, xếp hạng, lập báo cáo kèm biểu đồ ra Google Sheet.',
    'Bạn là chuyên viên Phân tích dữ liệu sản xuất. Quy trình: (1) xác định câu hỏi và khoảng thời gian; (2) lấy số liệu bằng hieu_suat/tra_cuu, ' +
    'so sánh với giai đoạn trước; (3) tìm nguyên nhân theo xưởng, công đoạn, người, lý do dừng, lỗi KCS, nghỉ; (4) kết luận 3–5 ý chính kèm số, ' +
    'nêu điều chưa chắc chắn; (5) đề xuất hành động cụ thể. Khi được yêu cầu báo cáo/bảng/biểu đồ thì dùng bao_cao_sheet và gửi đường link.',
    'tra_cuu, hieu_suat, ban_tin, bao_cao_sheet, so_tay_tim', '', 'medium', 'Có'],
  ['nhan_su', 'Nhân sự', 'ns, nhân sự',
    'Điểm danh, nghỉ phép/ốm, đi muộn, nghỉ dài hạn, vi phạm, nhập trễ, KPI cá nhân tháng, danh sách người theo xưởng, ngày vào làm, hợp đồng.',
    'Bạn là cán bộ Nhân sự ảo. Trả lời về chuyên cần, vi phạm, KPI cá nhân, cơ cấu nhân sự từng xưởng. Gọi người lao động bằng họ tên. ' +
    'Không có (và không được hỏi) CCCD, điện thoại, địa chỉ, lương. Khi nêu người có vấn đề, giữ giọng khách quan, gợi ý cách trao đổi.',
    'tra_cuu, hieu_suat, so_tay_tim', '', '', 'Có'],
  ['truyen_thong', 'Truyền thông', 'viết, tt, truyền thông, bài',
    'Viết bài Facebook/Zalo, thông báo nội bộ, tin tuyển dụng, thư cảm ơn/chúc mừng, nội dung quảng cáo, kịch bản video ngắn, sửa văn.',
    'Bạn là biên tập viên Truyền thông. Dùng thông tin công ty và giọng văn trong phần BỐI CẢNH (tìm thêm bằng so_tay_tim nếu cần). ' +
    'Viết tiếng Việt tự nhiên, đúng chính tả, câu ngắn, có tiêu đề hấp dẫn và lời kêu gọi hành động; bài mạng xã hội kèm 3–5 hashtag. ' +
    'Không bịa số liệu, giá, cam kết hay thông tin công ty chưa có – để [ô trống] cho người duyệt điền. ' +
    'Mặc định đưa 1 bản hoàn chỉnh; nếu được yêu cầu thì đưa 2–3 phương án. Bạn chỉ soạn, người dùng tự đăng.',
    'so_tay_tim', '', '', 'Có'],
  ['thu_ky', 'Thư ký', 'tk, thư ký, việc, lịch, email, nhắc',
    'Ghi việc cần làm và nhắc đúng hạn, ghi chú/ghi nhớ, xem và thêm lịch Google, tìm email, soạn email nháp, tổng hợp việc tồn.',
    'Bạn là Thư ký riêng chu đáo. Khi được nhờ nhắc/ghi việc: dùng so_tay_ghi với Loai "Việc" và Han dạng yyyy-mm-dd HH:mm ' +
    '(tự đổi "thứ 6", "mai", "chiều nay" ra ngày giờ cụ thể; không nói giờ thì để 08:00). Thông tin cần nhớ lâu dài: Loai "Ghi chú"; ' +
    'thông tin về công ty/con người dùng cho mọi phòng: Loai "Bối cảnh". Xác nhận lại ngắn gọn đã ghi gì, hạn khi nào, số ID. ' +
    'Email chỉ tạo NHÁP (email_nhap), không bao giờ gửi. Lịch: xem bằng lich_xem, thêm bằng lich_tao (không mời người khác).',
    'so_tay_tim, so_tay_ghi, so_tay_xong, lich_xem, lich_tao, email_tim, email_nhap', '', '', 'Có'],
  ['don_hang', 'Kế hoạch – Đơn hàng', 'đh, đơn hàng, kế hoạch',
    'Tiến độ đơn hàng, đơn sắp đến hạn, đơn trễ, kế hoạch sản xuất theo đơn.',
    '(Đang chờ cấu trúc sheet "Trạng thái đơn hàng" – Claude sẽ bổ sung công cụ đọc đơn hàng.)',
    'so_tay_tim', '', '', 'Không']
];

var ST_MAC_DINH = [
  ['Bối cảnh', 'Người dùng: Phó giám đốc sản xuất của nhà máy sản xuất gậy (cần câu): các xưởng Phôi Carbon, Phôi Thô, CNC, Sơn, In UV, Ngọn, Hoàn thiện, Đóng gói. ' +
    'Theo dõi sản lượng trên web app KPI hằng ngày.'],
  ['Bối cảnh', 'Thông tin công ty (SỬA DÒNG NÀY): tên công ty …, địa chỉ …, sản phẩm chính …, khách hàng/thị trường …, điểm mạnh …, website/fanpage …'],
  ['Bối cảnh', 'Giọng văn (SỬA DÒNG NÀY): thân thiện, chuyên nghiệp, ngắn gọn; xưng "chúng tôi" khi viết thay công ty.']
];

/* ============================ CÀI ĐẶT (chạy 1 lần) ============================ */

/**
 * Tạo sheet "Trợ lý – Công ty Agent" (nếu chưa có), trigger nhắc việc 15 phút/lần,
 * và xin quyền Gmail/Lịch (Google sẽ hiện hộp cấp quyền khi chạy lần đầu).
 */
function caiDatAgent() {
  var P = PropertiesService.getScriptProperties(), ss = null, id = P.getProperty('AGENT_SHEET_ID');
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create(AG_TEN_FILE); P.setProperty('AGENT_SHEET_ID', ss.getId()); }
  taoTab_(ss, 'CacAgent', AG_COT, AG_MAC_DINH);
  var st = taoTab_(ss, 'SoTay', ST_COT, ST_MAC_DINH.map(function (r, i) {
    return [i + 1, Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'), r[0], r[1], '', 'Mở', '', 'Cài đặt'];
  }));
  st.getRange('E:E').setNumberFormat('@');
  st.getRange('B:B').setNumberFormat('@');
  taoTab_(ss, 'NhatKy', NK_COT, []);
  var mac = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (mac && ss.getSheets().length > 1) ss.deleteSheet(mac);

  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'nhacViec') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('nhacViec').timeBased().everyMinutes(15).create();

  var quyen = [];
  try { CalendarApp.getDefaultCalendar().getName(); quyen.push('Lịch: OK'); } catch (e) { quyen.push('Lịch: chưa được cấp quyền (' + e.message + ')'); }
  try { GmailApp.getAliases(); quyen.push('Gmail: OK'); } catch (e) { quyen.push('Gmail: chưa được cấp quyền (' + e.message + ')'); }
  CacheService.getScriptCache().remove('agents');
  var kq = 'ĐÃ CÀI CÔNG TY AGENT.\n- Sheet cấu hình: ' + ss.getUrl() + '\n- Nhắc việc: 15 phút kiểm tra 1 lần.\n- ' + quyen.join('\n- ') +
    '\n\n👉 Mở sheet, sửa 2 dòng "SỬA DÒNG NÀY" trong tab SoTay (thông tin công ty, giọng văn).';
  Logger.log(kq);
  return kq;
}

/** Tạo tab nếu chưa có (giữ nguyên tab đã có để không mất chỉnh sửa của chủ dự án). */
function taoTab_(ss, ten, cot, dong) {
  var sh = ss.getSheetByName(ten);
  if (sh && sh.getLastRow() >= 1) return sh;
  sh = sh || ss.insertSheet(ten);
  sh.getRange(1, 1, 1, cot.length).setValues([cot]).setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  if (dong.length) sh.getRange(2, 1, dong.length, cot.length).setValues(dong);
  return sh;
}

function agSS_() {
  var id = PropertiesService.getScriptProperties().getProperty('AGENT_SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : null;
}

/* ============================ DANH SÁCH PHÒNG & ĐIỀU PHỐI ============================ */

/** Đọc tab CacAgent (nhớ 10 phút). Chưa cài → null (bot chạy như trợ lý KPI một mình). */
function docAgents_() {
  var C = CacheService.getScriptCache(), c = C.get('agents');
  if (c) { try { return JSON.parse(c); } catch (e) { /* đọc lại */ } }
  var ss = agSS_();
  if (!ss) return null;
  var b = bang_('CacAgent', ss), ds = [];
  b.rows.forEach(function (r) {
    var g = function (k) { return b.c[k] === undefined ? '' : String(r[b.c[k]] || '').trim(); };
    if (!g('Ma') || /^(không|khong|no|0)$/i.test(g('Bat'))) return;
    ds.push({
      ma: g('Ma'), ten: g('Ten') || g('Ma'), moTa: g('MoTa'), vaiTro: g('VaiTro'), model: g('Model'), effort: g('Effort').toLowerCase(),
      goi: g('Goi').toLowerCase().split(/[,;]/).map(function (x) { return x.trim(); }).filter(String).concat([g('Ma').toLowerCase()]),
      congCu: g('CongCu').split(/[,;\s]+/).filter(function (x) { return x && congCuTheoTen_(x); })
    });
  });
  C.put('agents', JSON.stringify(ds), 600);
  return ds;
}

/**
 * Chọn phòng cho câu hỏi: "@tên ..." gọi thẳng; không thì nhờ AI điều phối (cân nhắc phòng vừa trao đổi).
 * Trả về agent kèm cauHoi (đã bỏ phần @tên) hoặc null nếu chưa cài công ty Agent.
 */
function chonAgent_(key, chatId, cauHoi, lichSu) {
  var ds = docAgents_();
  if (!ds || !ds.length) return null;
  var chon = null, q = cauHoi, dai = 0;
  if (/^@/.test(cauHoi)) {
    var sau = cauHoi.slice(1).replace(/^\s+/, ''), thap = sau.toLowerCase();
    ds.forEach(function (a) {
      a.goi.concat([a.ten.toLowerCase()]).forEach(function (g) {
        if (g.length > dai && thap.indexOf(g) === 0 && /^($|[\s:,.\-])/.test(thap.slice(g.length))) { chon = a; dai = g.length; }
      });
    });
    if (chon) {
      q = sau.slice(dai).replace(/^[\s:,.\-]+/, '');
      if (!q.trim()) return { loi: 'Bạn muốn nhờ phòng ' + chon.ten + ' việc gì? Nhắn "@' + chon.goi[0] + ' <việc cần làm>".' };
    }
  }
  var truoc = lichSu.length ? lichSu[lichSu.length - 1].ag : '';
  if (!chon) chon = ds.length === 1 ? ds[0] : dieuPhoi_(key, ds, cauHoi, truoc, lichSu);
  return {
    ma: chon.ma, ten: chon.ten, vaiTro: chon.vaiTro, congCu: chon.congCu, model: chon.model, effort: chon.effort,
    cauHoi: q.trim() || cauHoi, nhieuPhong: ds.length > 1
  };
}

/** Hỏi AI xem phòng nào nên nhận việc. Lỗi/không rõ → phòng vừa trao đổi, rồi phòng đầu tiên. */
function dieuPhoi_(key, ds, cauHoi, truoc, lichSu) {
  var tim = function (ma) { return ds.filter(function (a) { return a.ma === ma; })[0]; };
  var he = 'Bạn là thư ký điều phối của một công ty có các phòng sau (mã: việc phụ trách):\n' +
    ds.map(function (a) { return a.ma + ': ' + a.ten + ' – ' + a.moTa; }).join('\n') +
    '\n\nĐọc yêu cầu của sếp và trả lời ĐÚNG MỘT mã phòng phù hợp nhất, không viết gì khác. ' +
    'Nếu yêu cầu là câu nối tiếp cuộc trao đổi trước (vd "còn xưởng CNC?", "viết ngắn hơn", "ok thêm hashtag") thì giữ phòng trước.';
  var tin = (truoc ? 'Phòng vừa trao đổi: ' + truoc + '\nCâu trước của sếp: ' + (lichSu[lichSu.length - 1].q || '').slice(0, 300) + '\n\n' : '') +
    'Yêu cầu mới: ' + cauHoi.slice(0, 1500);
  var res = goiClaude_(key, he, [{ role: 'user', content: tin }], [], null, 'low', 1500);
  var chu = res && !res.loi && res.content ? res.content.filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join(' ') : '';
  var hit = null;
  ds.forEach(function (a) { if (!hit && new RegExp('(^|[^a-z_])' + a.ma + '([^a-z_]|$)').test(chu)) hit = a; });
  return hit || tim(truoc) || ds[0];
}

/** System prompt cho một phòng: vai trò + ngày giờ + bối cảnh chung + (dữ liệu KPI nếu phòng đọc KPI). */
function heThongAgent_(ctx, ag) {
  var phan = [
    'Bạn là "' + ag.ten + '" trong bộ trợ lý AI (một "công ty Agent") của Phó giám đốc sản xuất. Bạn trả lời qua Zalo.',
    'VAI TRÒ: ' + ag.vaiTro,
    nenChung_()
  ];
  var bc = boiCanh_();
  if (bc) phan.push('BỐI CẢNH (từ Sổ tay, do người dùng ghi):\n' + bc);
  if (ag.congCu.indexOf('tra_cuu') >= 0 || ag.congCu.indexOf('hieu_suat') >= 0) phan.push(kpiNguCanh_(ctx));
  phan.push(cachTraLoi_(false));
  phan.push('Nếu yêu cầu thuộc việc của phòng khác, cứ làm phần mình làm được và gợi ý: nhắn "@<phòng> …" để giao cho phòng đó. ' +
    'Các phòng: ' + (docAgents_() || []).map(function (a) { return a.ten + ' (@' + a.goi[0] + ')'; }).join(', ') + '.');
  return phan.join('\n\n');
}

/** Các dòng Sổ tay loại "Bối cảnh" (đang Mở), tối đa ~3000 ký tự. */
function boiCanh_() {
  var ss = agSS_();
  if (!ss) return '';
  var b = bang_('SoTay', ss), out = [], n = 0;
  b.rows.forEach(function (r) {
    if (String(r[b.c.Loai]).trim().toLowerCase() !== 'bối cảnh' || /xong|hủy/i.test(String(r[b.c.TrangThai]))) return;
    var t = '• ' + String(r[b.c.NoiDung]).trim();
    if (n + t.length > 3000) return;
    out.push(t); n += t.length;
  });
  return out.join('\n');
}

/** Ghi nhật ký hỏi đáp vào tab NhatKy (bỏ qua lỗi để không ảnh hưởng câu trả lời). */
function ghiNhatKyAgent_(ag, cauHoi, traLoi) {
  try {
    var ss = agSS_();
    if (!ss) return;
    var sh = ss.getSheetByName('NhatKy');
    if (sh) sh.appendRow([Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'), ag ? ag.ten : 'KPI', String(cauHoi).slice(0, 2000), String(traLoi).slice(0, 5000)]);
  } catch (e) { console.error(e); }
}

/** "phòng ban" – danh sách phòng đang bật. */
function danhSachPhong_() {
  var ds = docAgents_();
  if (!ds) return 'Chưa cài Công ty Agent (chạy hàm caiDatAgent trong Apps Script).';
  return '🏢 CÁC PHÒNG ĐANG LÀM VIỆC\n' + ds.map(function (a) { return '• ' + a.ten + ' (@' + a.goi[0] + '): ' + a.moTa; }).join('\n') +
    '\n\nCứ nhắn tự nhiên, thư ký sẽ chuyển đúng phòng. Muốn gọi thẳng: "@' + ds[0].goi[0] + ' …".' +
    '\nNhắn "việc" để xem việc đang mở, "xong <số>" khi làm xong.';
}

/* ============================ CÔNG CỤ MỚI ============================ */

var AG_CONG_CU = [
  {
    name: 'so_tay_tim',
    description: 'Tìm trong Sổ tay chung (việc, ghi chú, bối cảnh công ty, ý tưởng…). Bỏ trống tu_khoa để lấy các dòng mới nhất.',
    input_schema: {
      type: 'object',
      properties: {
        tu_khoa: { type: 'string', description: 'Từ khóa tìm trong nội dung (không phân biệt hoa thường).' },
        loai: { type: 'string', description: 'Lọc loại: Việc, Ghi chú, Bối cảnh, Ý tưởng…' },
        chi_viec_mo: { type: 'boolean', description: 'true = chỉ lấy việc chưa xong.' },
        gioi_han: { type: 'integer', description: 'Mặc định 20.' }
      }
    }
  },
  {
    name: 'so_tay_ghi',
    description: 'Ghi một dòng mới vào Sổ tay chung. Loai "Việc" kèm Han sẽ được nhắc qua Zalo đúng giờ.',
    input_schema: {
      type: 'object',
      properties: {
        loai: { type: 'string', description: 'Việc | Ghi chú | Bối cảnh | Ý tưởng' },
        noi_dung: { type: 'string' },
        han: { type: 'string', description: 'Hạn/giờ nhắc dạng yyyy-mm-dd HH:mm (chỉ cho Việc; bỏ trống nếu không có hạn).' }
      },
      required: ['loai', 'noi_dung']
    }
  },
  {
    name: 'so_tay_xong',
    description: 'Đánh dấu một dòng Sổ tay là đã xong (theo ID), hoặc đổi hạn nếu truyền han_moi.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'integer' }, han_moi: { type: 'string', description: 'yyyy-mm-dd HH:mm – dời hạn thay vì đánh dấu xong.' } },
      required: ['id']
    }
  },
  {
    name: 'lich_xem',
    description: 'Xem sự kiện trong Lịch Google chính của người dùng trong khoảng ngày.',
    input_schema: {
      type: 'object',
      properties: { tu_ngay: { type: 'string', description: 'yyyy-mm-dd' }, den_ngay: { type: 'string', description: 'yyyy-mm-dd' } },
      required: ['tu_ngay', 'den_ngay']
    }
  },
  {
    name: 'lich_tao',
    description: 'Thêm một sự kiện vào Lịch Google chính của người dùng (không mời ai).',
    input_schema: {
      type: 'object',
      properties: {
        tieu_de: { type: 'string' }, bat_dau: { type: 'string', description: 'yyyy-mm-dd HH:mm' },
        ket_thuc: { type: 'string', description: 'yyyy-mm-dd HH:mm (bỏ trống = 1 giờ sau)' },
        dia_diem: { type: 'string' }, mo_ta: { type: 'string' }
      },
      required: ['tieu_de', 'bat_dau']
    }
  },
  {
    name: 'email_tim',
    description: 'Tìm email trong Gmail của người dùng (cú pháp tìm của Gmail, vd "from:abc is:unread newer_than:7d"). Trả về tối đa 10 thư: người gửi, tiêu đề, ngày, trích đoạn.',
    input_schema: {
      type: 'object',
      properties: { truy_van: { type: 'string' }, so_luong: { type: 'integer', description: 'Tối đa 10.' } },
      required: ['truy_van']
    }
  },
  {
    name: 'email_nhap',
    description: 'Tạo email NHÁP trong Gmail để người dùng tự xem và bấm gửi. Không bao giờ gửi đi.',
    input_schema: {
      type: 'object',
      properties: { den: { type: 'string', description: 'Địa chỉ người nhận (có thể để trống).' }, tieu_de: { type: 'string' }, noi_dung: { type: 'string' } },
      required: ['tieu_de', 'noi_dung']
    }
  },
  {
    name: 'bao_cao_sheet',
    description: 'Tạo một Google Sheet báo cáo mới trong Drive của người dùng từ bảng số liệu, có thể kèm biểu đồ. Trả về đường link.',
    input_schema: {
      type: 'object',
      properties: {
        tieu_de: { type: 'string' },
        cot: { type: 'array', items: { type: 'string' }, description: 'Tên cột.' },
        dong: { type: 'array', items: { type: 'array', items: {} }, description: 'Các dòng dữ liệu (số để dạng số).' },
        bieu_do: { type: 'string', enum: ['', 'cot', 'duong', 'tron'], description: 'Loại biểu đồ: cột, đường, tròn; trống = không vẽ. Cột đầu là nhãn.' },
        ghi_chu: { type: 'string', description: 'Nhận xét/kết luận ghi dưới bảng.' }
      },
      required: ['tieu_de', 'cot', 'dong']
    }
  }
];

var AGENT_XU_LY = {
  so_tay_tim: function (ctx, inp) {
    var ss = agSS_(), b = bang_('SoTay', ss), kw = String(inp.tu_khoa || '').toLowerCase().trim(), loai = String(inp.loai || '').toLowerCase().trim();
    var ds = b.rows.filter(function (r) {
      if (loai && String(r[b.c.Loai]).toLowerCase().trim() !== loai) return false;
      if (inp.chi_viec_mo && (String(r[b.c.Loai]).trim() !== 'Việc' || /xong|hủy/i.test(String(r[b.c.TrangThai])))) return false;
      return !kw || String(r[b.c.NoiDung]).toLowerCase().indexOf(kw) >= 0;
    }).reverse().slice(0, Math.min(Number(inp.gioi_han) || 20, 100));
    if (!ds.length) return 'Không tìm thấy dòng nào trong Sổ tay.';
    return 'ID | Thời điểm | Loại | Nội dung | Hạn | Trạng thái\n' + ds.map(function (r) {
      return [r[b.c.ID], giaTri_(r[b.c.ThoiDiem]), r[b.c.Loai], String(r[b.c.NoiDung]).replace(/\s+/g, ' '), hanTxt_(r[b.c.Han]), r[b.c.TrangThai]].join(' | ');
    }).join('\n');
  },
  so_tay_ghi: function (ctx, inp) {
    var han = inp.han ? chuanHan_(inp.han) : '';
    if (inp.han && !han) throw new Error('Hạn không đúng dạng yyyy-mm-dd HH:mm: ' + inp.han);
    var id = themSoTay_(String(inp.loai || 'Ghi chú').trim(), String(inp.noi_dung).trim(), han, ctx.ag ? ctx.ag.ten : '');
    return 'Đã ghi #' + id + (han ? ', hạn ' + han : '') + '.';
  },
  so_tay_xong: function (ctx, inp) {
    return capNhatSoTay_(Number(inp.id), inp.han_moi ? chuanHan_(inp.han_moi) : null);
  },
  lich_xem: function (ctx, inp) {
    var tu = gioVN_(ngay_(inp.tu_ngay) + ' 00:00'), den = gioVN_(ngay_(inp.den_ngay) + ' 23:59');
    if (!tu || !den) throw new Error('Ngày không hợp lệ');
    var ev = CalendarApp.getDefaultCalendar().getEvents(tu, den);
    if (!ev.length) return 'Không có sự kiện nào từ ' + inp.tu_ngay + ' đến ' + inp.den_ngay + '.';
    return ev.slice(0, 50).map(function (e) {
      return Utilities.formatDate(e.getStartTime(), TZ, 'EEE dd/MM HH:mm') + '–' + Utilities.formatDate(e.getEndTime(), TZ, 'HH:mm') + ' | ' + e.getTitle() +
        (e.getLocation() ? ' | ' + e.getLocation() : '');
    }).join('\n');
  },
  lich_tao: function (ctx, inp) {
    var bd = gioVN_(inp.bat_dau), kt = inp.ket_thuc ? gioVN_(inp.ket_thuc) : (bd ? new Date(bd.getTime() + 3600000) : null);
    if (!bd || !kt) throw new Error('Thời gian không hợp lệ (cần yyyy-mm-dd HH:mm)');
    var e = CalendarApp.getDefaultCalendar().createEvent(String(inp.tieu_de), bd, kt, { location: inp.dia_diem || '', description: inp.mo_ta || '' });
    return 'Đã thêm vào lịch: ' + e.getTitle() + ', ' + Utilities.formatDate(bd, TZ, 'HH:mm dd/MM/yyyy') + '.';
  },
  email_tim: function (ctx, inp) {
    var th = GmailApp.search(String(inp.truy_van), 0, Math.min(Number(inp.so_luong) || 10, 10));
    if (!th.length) return 'Không tìm thấy email nào.';
    return th.map(function (t) {
      var m = t.getMessages()[0];
      return Utilities.formatDate(t.getLastMessageDate(), TZ, 'dd/MM HH:mm') + ' | ' + m.getFrom() + ' | ' + t.getFirstMessageSubject() +
        ' | ' + String(m.getPlainBody() || '').replace(/\s+/g, ' ').slice(0, 300);
    }).join('\n');
  },
  email_nhap: function (ctx, inp) {
    GmailApp.createDraft(String(inp.den || ''), String(inp.tieu_de), String(inp.noi_dung));
    return 'Đã tạo email nháp "' + inp.tieu_de + '" trong Gmail (mục Thư nháp). Người dùng tự kiểm tra và bấm gửi.';
  },
  bao_cao_sheet: function (ctx, inp) {
    var cot = inp.cot || [], dong = (inp.dong || []).slice(0, 1000);
    if (!cot.length) throw new Error('Thiếu tên cột');
    var bang = [cot].concat(dong.map(function (r) { var x = (r || []).slice(0, cot.length); while (x.length < cot.length) x.push(''); return x; }));
    var ss = SpreadsheetApp.create(String(inp.tieu_de || 'Báo cáo') + ' – ' + Utilities.formatDate(new Date(), TZ, 'dd/MM/yyyy'));
    var sh = ss.getSheets()[0];
    sh.getRange(1, 1, bang.length, cot.length).setValues(bang);
    sh.getRange(1, 1, 1, cot.length).setFontWeight('bold').setBackground('#e8f0fe');
    sh.setFrozenRows(1);
    if (inp.ghi_chu) sh.getRange(bang.length + 2, 1).setValue(String(inp.ghi_chu));
    var loai = { cot: Charts.ChartType.COLUMN, duong: Charts.ChartType.LINE, tron: Charts.ChartType.PIE }[inp.bieu_do || ''];
    if (loai && dong.length) {
      sh.insertChart(sh.newChart().setChartType(loai).addRange(sh.getRange(1, 1, bang.length, cot.length))
        .setPosition(2, cot.length + 2, 0, 0).setOption('title', String(inp.tieu_de || '')).build());
    }
    return 'Đã tạo báo cáo: ' + ss.getUrl();
  }
};

function congCuTheoTen_(ten) {
  var all = AI_CONG_CU.concat(AG_CONG_CU);
  for (var i = 0; i < all.length; i++) if (all[i].name === ten) return all[i];
  return null;
}
function congCuCua_(ag) { return ag.congCu.map(congCuTheoTen_).filter(Boolean); }

/* ============================ SỔ TAY & NHẮC VIỆC ============================ */

/** 'yyyy-mm-dd HH:mm' hoặc 'yyyy-mm-dd' → chuỗi chuẩn; sai dạng → ''. */
function chuanHan_(s) {
  var m = String(s || '').trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (!m) return '';
  return m[1] + '-' + pad_(m[2]) + '-' + pad_(m[3]) + ' ' + pad_(m[4] || 8) + ':' + (m[5] || '00');
}
function hanTxt_(v) { return Object.prototype.toString.call(v) === '[object Date]' ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd HH:mm') : String(v || ''); }

/** Giờ Việt Nam 'yyyy-mm-dd HH:mm' → Date (không phụ thuộc múi giờ của dự án). */
function gioVN_(s) {
  var c = chuanHan_(s);
  if (!c) return null;
  var p = c.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/).slice(1).map(Number);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2], p[3] - 7, p[4]));
}

function themSoTay_(loai, noiDung, han, nguon) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = agSS_().getSheetByName('SoTay'), n = sh.getLastRow(), id = 1;
    if (n > 1) sh.getRange(2, 1, n - 1, 1).getValues().forEach(function (r) { id = Math.max(id, Number(r[0]) + 1 || id); });
    sh.appendRow([id, Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'), loai, noiDung, han || '', 'Mở', '', nguon || '']);
    return id;
  } finally { lock.releaseLock(); }
}

function capNhatSoTay_(id, hanMoi) {
  var sh = agSS_().getSheetByName('SoTay'), b = bang_('SoTay', agSS_());
  for (var i = 0; i < b.rows.length; i++) {
    if (Number(b.rows[i][b.c.ID]) !== id) continue;
    var dong = i + 2;
    if (hanMoi) {
      sh.getRange(dong, b.c.Han + 1).setValue(hanMoi);
      sh.getRange(dong, b.c.DaNhac + 1).setValue('');
      sh.getRange(dong, b.c.TrangThai + 1).setValue('Mở');
      return 'Đã dời #' + id + ' sang ' + hanMoi + '.';
    }
    sh.getRange(dong, b.c.TrangThai + 1).setValue('Xong');
    return 'Đã đánh dấu xong #' + id + ': ' + String(b.rows[i][b.c.NoiDung]).slice(0, 100);
  }
  return 'Không có dòng #' + id + ' trong Sổ tay.';
}

/** "việc" – các việc đang mở, sắp theo hạn. */
function viecDangMo_() {
  var ss = agSS_();
  if (!ss) return 'Chưa cài Công ty Agent.';
  var b = bang_('SoTay', ss);
  var ds = b.rows.filter(function (r) { return String(r[b.c.Loai]).trim() === 'Việc' && !/xong|hủy/i.test(String(r[b.c.TrangThai])); })
    .sort(function (a, c) { return (hanTxt_(a[b.c.Han]) || '9') < (hanTxt_(c[b.c.Han]) || '9') ? -1 : 1; });
  if (!ds.length) return '✅ Không có việc nào đang mở.';
  return '📝 VIỆC ĐANG MỞ (' + ds.length + ')\n' + ds.slice(0, 30).map(function (r) {
    var h = hanTxt_(r[b.c.Han]);
    return '#' + r[b.c.ID] + ' ' + String(r[b.c.NoiDung]).slice(0, 150) + (h ? ' – hạn ' + h.slice(11) + ' ' + h.slice(8, 10) + '/' + h.slice(5, 7) : '');
  }).join('\n') + '\n\nNhắn "xong <số>" khi làm xong.';
}

/** Việc có hạn trong hôm nay hoặc đã quá hạn – chèn vào bản tin sáng. */
function viecHomNay_() {
  var ss = agSS_();
  if (!ss) return '';
  var b = bang_('SoTay', ss), cuoi = homNay_() + ' 23:59';
  var ds = b.rows.filter(function (r) {
    var h = hanTxt_(r[b.c.Han]);
    return String(r[b.c.Loai]).trim() === 'Việc' && !/xong|hủy/i.test(String(r[b.c.TrangThai])) && h && h <= cuoi;
  });
  if (!ds.length) return '';
  var bayGio = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
  return '📝 VIỆC HÔM NAY\n' + ds.map(function (r) {
    var h = hanTxt_(r[b.c.Han]);
    return '#' + r[b.c.ID] + ' ' + String(r[b.c.NoiDung]).slice(0, 150) + ' – ' + (h < bayGio.slice(0, 10) ? 'QUÁ HẠN ' + h.slice(8, 10) + '/' + h.slice(5, 7) : h.slice(11));
  }).join('\n');
}

/** Trigger 15 phút: nhắc việc đến hạn (mỗi việc nhắc 1 lần; dời hạn thì nhắc lại). */
function nhacViec() {
  var P = PropertiesService.getScriptProperties(), chu = P.getProperty('CHU_CHAT_ID'), ss = agSS_();
  if (!chu || !ss) return;
  var sh = ss.getSheetByName('SoTay'), b = bang_('SoTay', ss), bayGio = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
  b.rows.forEach(function (r, i) {
    var h = hanTxt_(r[b.c.Han]);
    if (String(r[b.c.Loai]).trim() !== 'Việc' || !h || h > bayGio || String(r[b.c.DaNhac]).trim() || /xong|hủy/i.test(String(r[b.c.TrangThai]))) return;
    guiZalo_(chu, '⏰ NHẮC VIỆC #' + r[b.c.ID] + '\n' + r[b.c.NoiDung] + '\n(hạn ' + h.slice(11) + ' ' + h.slice(8, 10) + '/' + h.slice(5, 7) +
      ')\n\nNhắn "xong ' + r[b.c.ID] + '" khi làm xong, hoặc "dời ' + r[b.c.ID] + ' sang …" để đổi hạn.');
    sh.getRange(i + 2, b.c.DaNhac + 1).setValue(bayGio);
  });
}
