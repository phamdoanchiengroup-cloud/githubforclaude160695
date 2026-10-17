/**
 * TRỢ LÝ KPI – hỏi tự do bằng AI (Claude) qua Zalo.
 * Cần thêm Thuộc tính tập lệnh: ANTHROPIC_API_KEY (chủ dự án tự nhập, không ghi vào mã).
 * Tùy chọn: AI_MODEL (mặc định claude-opus-5-5), AI_EFFORT (low/medium/high, mặc định low),
 *           AI_GIOI_HAN_NGAY (số câu hỏi tối đa/ngày, mặc định 60).
 *
 * AI chỉ thấy dữ liệu qua 3 công cụ đọc dưới đây. Các sheet/cột cá nhân bị chặn ngay khi đọc.
 */

var AI_MODEL_MAC_DINH = 'claude-opus-5-5';
var AI_VONG_TOI_DA = 8;
/** Sheet AI được đọc → cột ngày dùng để lọc theo khoảng thời gian. */
var AI_BANG = {
  NhatKySanXuat: 'Ngay', PhieuKCS: 'Ngay', DiemDanhNghi: 'Ngay', XacNhanDiemDanh: 'Ngay', NghiDaiHan: 'TuNgay',
  ViPham: 'Ngay', PhatNhapTre: 'Ngay', KPIThang: 'Ky', MayMoc: 'BaoTriKeTiep', NhanSu: 'NgayVaoLam',
  CongDoan: '', DinhMuc: 'HieuLucTu', DeXuatDinhMuc: 'NgayDeXuat', PhongBan: '', SanPham: '', DanhMucLoi: '',
  DanhMucViPham: '', LyDoDung: '', DangKyCom: 'Ngay', ThucDon: 'Ngay', NgayLe: 'Ngay', MienTruDiemDanh: 'Ngay',
  TrongSoKPI: 'KyApDung', ThongBao: 'ThoiDiem'
};
/** Cột không bao giờ đưa cho AI. */
var AI_COT_CAM = ['SoCCCD', 'DienThoai', 'DiaChi', 'SdtKhanCap', 'LuongCoBan', 'NamSinh', 'MatKhauMaHoa', 'TenDangNhap'];

/* ============================ VÒNG HỎI – ĐÁP ============================ */

/** Trả lời một câu hỏi tự do. Trả về chuỗi để gửi Zalo. */
function hoiAI_(chatId, cauHoi, maPhong) {
  var P = PropertiesService.getScriptProperties();
  var key = P.getProperty('ANTHROPIC_API_KEY');
  if (!key) return 'Chưa bật tính năng hỏi tự do (thiếu ANTHROPIC_API_KEY).\n\n' + HUONG_DAN;

  var hn = homNay_(), demKey = 'AI_DEM_' + hn, dem = Number(P.getProperty(demKey) || 0);
  var gioiHan = Number(P.getProperty('AI_GIOI_HAN_NGAY') || 60);
  if (dem >= gioiHan) return 'Hôm nay đã hỏi ' + dem + ' câu (giới hạn ' + gioiHan + '). Mai hỏi tiếp nhé, hoặc tăng AI_GIOI_HAN_NGAY.';
  P.setProperty(demKey, String(dem + 1));
  if (dem === 0) xoaDemCu_(P, demKey);

  var C = CacheService.getScriptCache(), hsKey = 'hs' + chatId;
  var lichSu = [];
  try { lichSu = JSON.parse(C.get(hsKey) || '[]'); } catch (e) { lichSu = []; }

  // Công ty Agent (Agents.gs): chọn phòng ban phù hợp; thiếu file thì dùng trợ lý KPI một mình như trước.
  var ag = typeof chonAgent_ === 'function' ? chonAgent_(key, chatId, cauHoi, lichSu, maPhong) : null;
  if (ag && ag.loi) return ag.loi;
  if (ag) cauHoi = ag.cauHoi;

  var messages = [];
  lichSu.forEach(function (h) {
    messages.push({ role: 'user', content: h.q });
    messages.push({ role: 'assistant', content: h.a });
  });
  messages.push({ role: 'user', content: cauHoi });

  var ctx = { D: {}, ag: ag, chatId: chatId }, traLoi = '', batDau = Date.now();
  var he = ag ? heThongAgent_(ctx, ag) : heThongAI_(ctx);
  if (chatId === 'giong' && typeof GIONG_CACH === 'string') he += '\n\n' + GIONG_CACH;   // tab Giọng nói (GiongNoi.gs): trả lời để đọc to
  var tools = ag ? congCuCua_(ag) : AI_CONG_CU;
  for (var vong = 0; vong < AI_VONG_TOI_DA; vong++) {
    if (Date.now() - batDau > 270000) break;   // Apps Script dừng sau 6 phút – chừa thời gian gửi trả lời
    var res = goiClaude_(key, he, messages, tools, ag && ag.model, ag && ag.effort);
    if (res.loi) return '⚠ ' + res.loi;
    if (res.stop_reason === 'refusal') return 'Trợ lý không trả lời được câu này. Bạn thử hỏi cách khác nhé.';
    var content = res.content || [];
    var chu = content.filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('\n').trim();
    if (res.stop_reason === 'pause_turn') { messages.push({ role: 'assistant', content: content }); continue; }   // tra web dài: máy chủ tạm dừng, gửi lại để làm tiếp
    if (res.stop_reason !== 'tool_use') { traLoi = chu; break; }
    messages.push({ role: 'assistant', content: content });
    var ketQua = content.filter(function (b) { return b.type === 'tool_use'; }).map(function (b) {
      try {
        return { type: 'tool_result', tool_use_id: b.id, content: chayCongCu_(ctx, b.name, b.input || {}) };
      } catch (e) {
        return { type: 'tool_result', tool_use_id: b.id, content: 'Lỗi: ' + (e && e.message || e), is_error: true };
      }
    });
    messages.push({ role: 'user', content: ketQua });
  }
  if (!traLoi) traLoi = 'Câu này cần tra cứu nhiều quá, bạn hỏi gọn lại giúp mình nhé.';

  lichSu.push({ q: cauHoi, a: traLoi, ag: ag ? ag.ma : '' });
  C.put(hsKey, JSON.stringify(lichSu.slice(-4)), 1800);
  if (typeof ghiNhatKyAgent_ === 'function') ghiNhatKyAgent_(ag, cauHoi, traLoi);
  return ag && ag.nhieuPhong ? '[' + ag.ten + ']\n' + traLoi : traLoi;
}

function xoaDemCu_(P, giu) {
  try {
    Object.keys(P.getProperties()).forEach(function (k) { if (/^AI_DEM_/.test(k) && k !== giu) P.deleteProperty(k); });
  } catch (e) { /* không quan trọng */ }
}

function goiClaude_(key, he, messages, tools, model, effort, maxTok) {
  var P = PropertiesService.getScriptProperties();
  model = model || P.getProperty('AI_MODEL') || AI_MODEL_MAC_DINH;
  var body = {
    model: model,
    max_tokens: maxTok || 8000,
    system: [{ type: 'text', text: he, cache_control: { type: 'ephemeral' } }],
    messages: messages,
    output_config: { effort: effort || P.getProperty('AI_EFFORT') || 'low' }
  };
  tools = tools === undefined ? AI_CONG_CU : tools;
  if (tools && tools.length) body.tools = tools;
  var headers = { 'x-api-key': key, 'anthropic-version': '2023-06-01' };
  // Haiku không có chuyển dự phòng phía máy chủ; các dòng khác bật "fallbacks: default".
  if (!/haiku/.test(model)) { body.fallbacks = 'default'; headers['anthropic-beta'] = 'server-side-fallback-2026-07-01'; }
  var r;
  try {
    r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post', contentType: 'application/json', headers: headers, payload: JSON.stringify(body), muteHttpExceptions: true
    });
  } catch (e) {
    return { loi: 'Không gọi được AI (' + (e && e.message || e) + '). Thử lại sau ít phút.' };
  }
  var j;
  try { j = JSON.parse(r.getContentText()); } catch (e) { return { loi: 'AI trả về dữ liệu lạ (HTTP ' + r.getResponseCode() + ').' }; }
  if (r.getResponseCode() !== 200) {
    var m = j && j.error && j.error.message || r.getContentText();
    if (r.getResponseCode() === 401) return { loi: 'ANTHROPIC_API_KEY không đúng.' };
    if (r.getResponseCode() === 429 || r.getResponseCode() >= 500) return { loi: 'AI đang bận, thử lại sau ít phút.' };
    return { loi: 'AI báo lỗi: ' + m };
  }
  return j;
}

/* ============================ NGỮ CẢNH CHO AI ============================ */

/** Trợ lý KPI một mình (khi chưa cài Agents.gs). */
function heThongAI_(ctx) {
  return ['Bạn là trợ lý của Phó giám đốc sản xuất một nhà máy sản xuất cơ (gậy) bi-a. Bạn trả lời qua Zalo.', nenChung_(), kpiNguCanh_(ctx), cachTraLoi_(true)].join('\n\n');
}

function nenChung_() {
  var hn = homNay_();
  return 'Hôm nay là ' + tenNgay_(hn) + ' (' + hn + '), giờ Việt Nam ' + Utilities.formatDate(new Date(), TZ, 'HH:mm') + '. "Hôm qua" = ' + congNgay_(hn, -1) + '.';
}

/** Mô tả dữ liệu CSDL KPI + quy tắc tính – chỉ đưa cho Agent có công cụ đọc KPI. */
function kpiNguCanh_(ctx) {
  var T = traCuu_(ctxDuLieu_(ctx, ['CongDoan', 'DinhMuc', 'PhongBan', 'DanhMucLoi']));
  var xuong = Object.keys(T.tenXuong).map(function (k) { return k + ' = ' + T.tenXuong[k]; }).join('; ');
  var moTa = Object.keys(AI_BANG).map(function (t) {
    var cot = moTaBang_(ctx, t);
    return cot ? '- ' + t + (AI_BANG[t] ? ' (lọc ngày theo ' + AI_BANG[t] + ')' : '') + ': ' + cot.join(', ') : '';
  }).filter(String).join('\n');
  return [
    'Các xưởng: ' + xuong + '.',
    '',
    'DỮ LIỆU (Google Sheet "CSDL KPI" của web app KPI) – các bảng và cột bạn đọc được:',
    moTa,
    '',
    'Cột có dấu * là cột tính thêm: MaXuong/TenXuong suy từ công đoạn hoặc nhân sự; HoTen từ NhanSu; ',
    'NhatKySanXuat.DinhMucGio = định mức/giờ của công đoạn, GioChuan = SoLuongLamRa ÷ DinhMucGio (chưa trừ lỗi KCS); TenLoi, TenViPham từ danh mục.',
    '',
    'QUY TẮC TÍNH (giống web app KPI):',
    '- Sản lượng chính thức chỉ tính dòng NhatKySanXuat có TrangThai "Đã chốt" (trưởng phòng đã duyệt). "Chờ duyệt" chưa tính, "Từ chối" bỏ.',
    '- Hiệu suất sản lượng = Σ (SoLuongLamRa − hàng lỗi KCS) ÷ định mức, chia cho tổng GIỜ CÓ MẶT theo chấm công',
    '  (đi làm = 8h, nửa ngày 4h, đi muộn x-n trừ n giờ; nghỉ = 0). Ngày công = xưởng đã xác nhận điểm danh hoặc người đó có dòng đã chốt.',
    '  Không tính trưởng/phó phòng, người nghỉ việc, ngày nghỉ dài hạn. Luôn dùng công cụ hieu_suat để tính, đừng tự nhẩm.',
    '- Đạt chất lượng = (sản lượng − lỗi) ÷ sản lượng. KPI tháng đã chốt nằm ở bảng KPIThang (HieuSuatSL, ChatLuong, TuanThu, AnToan, TongKPI, Loai, Hang).',
    '- Đơn vị sản lượng khác nhau giữa công đoạn (cái, phôi…), đừng cộng sản lượng khác công đoạn rồi so sánh.',
    '- Số người nghỉ trong ngày: đếm MaNV khác nhau trong DiemDanhNghi ngày đó (có thể kèm NghiDaiHan đang hiệu lực).',
    '- Số liệu ngày gần đây có thể chưa nhập/duyệt xong (hạn nhập là 17h ngày làm việc thứ 3) – nói rõ khi số liệu có vẻ thiếu.',
    '- Luôn tra dữ liệu bằng công cụ trước khi trả lời câu hỏi về số liệu; không bịa. Không tìm được thì nói không có dữ liệu.',
    '- Bạn chỉ đọc dữ liệu, không sửa được gì. Không có thông tin CCCD, điện thoại, địa chỉ, lương.'
  ].join('\n');
}

function cachTraLoi_(ngan) {
  return [
    'CÁCH TRẢ LỜI:',
    '- Tiếng Việt. Văn bản thường cho Zalo: KHÔNG dùng markdown, bảng hay dấu ** và #; dùng "•" để liệt kê.',
    ngan ? '- Ngắn gọn, đi thẳng vào số liệu, tối đa khoảng 1200 ký tự. Số có dấu chấm ngăn hàng nghìn (1.234). Ghi rõ ngày/khoảng ngày của số liệu.'
      : '- Câu trả lời thường ngắn gọn (dưới 1200 ký tự); bài viết/văn bản được yêu cầu thì dài vừa đủ, tối đa khoảng 3000 ký tự.',
    '- Nếu thấy điểm bất thường đáng chú ý, nêu thêm một câu gợi ý ngắn.'
  ].join('\n');
}

var AI_CONG_CU = [
  {
    name: 'tra_cuu',
    description: 'Đọc một bảng trong CSDL KPI: lọc theo khoảng ngày và giá trị cột, rồi trả về các dòng hoặc nhóm và tính tổng/đếm. ' +
      'Dùng cho mọi câu hỏi đếm, liệt kê, tổng hợp (người nghỉ, lỗi KCS, vi phạm, giờ dừng theo lý do, KPI tháng, máy móc…).',
    input_schema: {
      type: 'object',
      properties: {
        bang: { type: 'string', enum: Object.keys(AI_BANG), description: 'Tên bảng.' },
        tu_ngay: { type: 'string', description: 'yyyy-mm-dd, lọc từ ngày (gồm). Bỏ trống nếu không lọc ngày.' },
        den_ngay: { type: 'string', description: 'yyyy-mm-dd, lọc đến ngày (gồm).' },
        loc: {
          type: 'object', additionalProperties: { type: 'string' },
          description: 'Lọc theo cột: {"TenCot": "giá trị"}. Khớp đúng, không phân biệt hoa thường. Nhiều giá trị ngăn bằng "|". ' +
            'Thêm "~" ở đầu để tìm chứa chuỗi (vd {"LyDoDung": "~máy"}), "!" ở đầu để loại trừ.'
        },
        nhom_theo: { type: 'array', items: { type: 'string' }, description: 'Các cột để gom nhóm, vd ["TenXuong"] hoặc ["Ngay","LyDo"].' },
        tinh: {
          type: 'array', items: { type: 'string' },
          description: 'Phép tính khi gom nhóm: "dem" (số dòng), "dem_khac:Cot" (số giá trị khác nhau), "tong:Cot", "tb:Cot", "max:Cot", "min:Cot". Mặc định ["dem"].'
        },
        cot: { type: 'array', items: { type: 'string' }, description: 'Khi không gom nhóm: chỉ lấy các cột này.' },
        sap_xep: { type: 'string', description: 'Tên cột/phép tính để sắp xếp giảm dần, thêm "+" ở đầu để tăng dần.' },
        gioi_han: { type: 'integer', description: 'Số dòng trả về tối đa (mặc định 40, tối đa 200).' }
      },
      required: ['bang']
    }
  },
  {
    name: 'hieu_suat',
    description: 'Tính hiệu suất sản lượng đúng cách web app KPI (dòng Đã chốt, trừ lỗi KCS, chia giờ có mặt theo chấm công), ' +
      'giờ có mặt, giờ dừng, sản lượng, lỗi, số người chưa khai – cho một khoảng ngày, gom theo xưởng, người, công đoạn hoặc ngày.',
    input_schema: {
      type: 'object',
      properties: {
        tu_ngay: { type: 'string', description: 'yyyy-mm-dd' },
        den_ngay: { type: 'string', description: 'yyyy-mm-dd' },
        theo: { type: 'string', enum: ['xuong', 'nguoi', 'cong_doan', 'ngay'], description: 'Gom theo xưởng, người, công đoạn (tính trên giờ khai) hoặc ngày.' },
        ma_xuong: { type: 'string', description: 'Chỉ tính một xưởng (mã, vd CNC). Bỏ trống = cả nhà máy.' },
        ma_nv: { type: 'string', description: 'Chỉ tính một người (mã NV).' },
        gioi_han: { type: 'integer', description: 'Số dòng tối đa (mặc định 30).' }
      },
      required: ['tu_ngay', 'den_ngay', 'theo']
    }
  },
  {
    name: 'ban_tin',
    description: 'Lấy bản tin dựng sẵn: "ngay" (một ngày, mặc định ngày gần nhất có số liệu) hoặc "tuan" (7 ngày qua).',
    input_schema: {
      type: 'object',
      properties: { loai: { type: 'string', enum: ['ngay', 'tuan'] }, ngay: { type: 'string', description: 'yyyy-mm-dd (chỉ với loai=ngay)' } },
      required: ['loai']
    }
  }
];

/* ============================ CÔNG CỤ ============================ */

function chayCongCu_(ctx, ten, inp) {
  if (ctx.ag && ctx.ag.congCu.indexOf(ten) < 0) throw new Error('Phòng ' + ctx.ag.ten + ' không được dùng công cụ ' + ten);
  if (typeof AGENT_XU_LY !== 'undefined' && AGENT_XU_LY[ten]) return AGENT_XU_LY[ten](ctx, inp);
  if (typeof TC_XU_LY !== 'undefined' && TC_XU_LY[ten]) return TC_XU_LY[ten](ctx, inp);
  if (ten === 'tra_cuu') return ccTraCuu_(ctx, inp);
  if (ten === 'hieu_suat') return ccHieuSuat_(ctx, inp);
  if (ten === 'ban_tin') {
    var D = ctxDuLieu_(ctx, null);
    return inp.loai === 'tuan' ? banTinTuan_(D) : banTinNgay_(inp.ngay ? ngay_(inp.ngay) : null, D);
  }
  throw new Error('Không có công cụ ' + ten);
}

/** Nạp sheet theo nhu cầu, nhớ trong 1 lượt hỏi. ds=null → mọi sheet bản tin cần. */
function ctxDuLieu_(ctx, ds) {
  ctx.ss = ctx.ss || ss_();
  (ds || SHEET_CAN).forEach(function (t) { if (!ctx.D[t]) ctx.D[t] = bang_(t, ctx.ss); });
  if (!ctx.D.nvXuong) { napNhanSu_(ctx.D, ctx.ss); ctx.nvTen = ctx.D.nvTen; }
  return ctx.D;
}

/** Một bảng đã bỏ cột cấm và thêm cột tính sẵn → {cot: [...], rows: [ {Cot: giá trị} ]}. */
function bangAI_(ctx, ten) {
  ctx.bangAI = ctx.bangAI || {};
  if (ctx.bangAI[ten]) return ctx.bangAI[ten];
  if (!(ten in AI_BANG)) throw new Error('Bảng không được phép: ' + ten);
  var D = ctxDuLieu_(ctx, ['CongDoan', 'DinhMuc', 'PhongBan', 'DanhMucLoi', ten]);
  var T = ctx.T || (ctx.T = traCuu_(D));
  if (ten === 'ViPham' && !ctx.tenVP) {
    var dv = bang_('DanhMucViPham', ctx.ss); ctx.tenVP = {};
    dv.rows.forEach(function (r) { ctx.tenVP[String(r[dv.c.MaVP]).trim()] = String(r[dv.c.TenViPham]).trim(); });
  }
  var b = D[ten], goc = cotGoc_(b.c), them = cotThem_(ten, b.c);
  var coNV = 'MaNV' in b.c, coCD = 'MaCD' in b.c, coX = 'MaXuong' in b.c;
  var rows = b.rows.map(function (r) {
    var o = {};
    goc.forEach(function (k) { o[k] = r[b.c[k]]; });
    var nv = coNV ? String(r[b.c.MaNV]).trim() : '', cd = coCD ? String(r[b.c.MaCD]).trim() : '';
    if (them.indexOf('HoTen') >= 0) o.HoTen = ctx.nvTen[nv] || '';
    var mx = coX ? String(r[b.c.MaXuong]).trim() : (T.cdXuong[cd] || D.nvXuong[nv] || '');
    if (them.indexOf('MaXuong') >= 0) o.MaXuong = mx;
    if (them.indexOf('TenXuong') >= 0) o.TenXuong = T.tenXuong[mx] || mx;
    if (ten === 'NhatKySanXuat') {
      var dm = dinhMuc_(T, cd);
      o.DinhMucGio = dm || '';
      o.GioChuan = dm ? Math.round(so_(r[b.c.SoLuongLamRa]) / dm * 100) / 100 : '';
    }
    if (them.indexOf('TenLoi') >= 0) o.TenLoi = T.tenLoi[String(r[b.c.MaLoi]).trim()] || '';
    if (ten === 'ViPham') o.TenViPham = ctx.tenVP[String(r[b.c.MaVP]).trim()] || '';
    return o;
  });
  return (ctx.bangAI[ten] = { ten: goc.concat(them), rows: rows });
}

function cotGoc_(c) { return Object.keys(c).filter(function (k) { return k && AI_COT_CAM.indexOf(k) < 0; }); }

/** Cột tính thêm cho một bảng, suy từ tiêu đề. */
function cotThem_(ten, c) {
  var them = [], coNV = 'MaNV' in c, coCD = 'MaCD' in c, coX = 'MaXuong' in c;
  if (coNV && !('HoTen' in c)) them.push('HoTen');
  if ((coCD || coNV) && !coX) them.push('MaXuong');
  if (coCD || coNV || coX) them.push('TenXuong');
  if (ten === 'NhatKySanXuat') them.push('DinhMucGio', 'GioChuan');
  if ('MaLoi' in c && ten !== 'DanhMucLoi') them.push('TenLoi');
  if (ten === 'ViPham') them.push('TenViPham');
  return them;
}

/** Chỉ đọc dòng tiêu đề để mô tả bảng cho AI (nhanh). */
function moTaBang_(ctx, ten) {
  var sh = ctx.ss.getSheetByName(ten);
  if (!sh || sh.getLastColumn() < 1) return null;
  var c = {};
  sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].forEach(function (h, i) { c[String(h).trim()] = i; });
  return cotGoc_(c).concat(cotThem_(ten, c).map(function (k) { return k + '*'; }));
}

function giaTri_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    var s = Utilities.formatDate(v, TZ, 'yyyy-MM-dd HH:mm');
    return s.slice(11) === '00:00' ? s.slice(0, 10) : s;
  }
  return v === null || v === undefined ? '' : v;
}

function ngayLoc_(v) {
  var s = String(giaTri_(v)).trim();
  if (/^\d{4}-\d{2}$/.test(s)) return s + '-01';
  return ngay_(v);
}

function ccTraCuu_(ctx, inp) {
  var B = bangAI_(ctx, inp.bang), cotNgay = AI_BANG[inp.bang];
  var tu = inp.tu_ngay ? ngay_(inp.tu_ngay) : '', den = inp.den_ngay ? ngay_(inp.den_ngay) : '';
  if (inp.den_ngay && /^\d{4}-\d{2}$/.test(inp.den_ngay)) den = inp.den_ngay + '-31';
  var loc = inp.loc || {};
  Object.keys(loc).forEach(function (k) { if (B.ten.indexOf(k) < 0) throw new Error('Bảng ' + inp.bang + ' không có cột ' + k + '. Cột có: ' + B.ten.join(', ')); });
  var rows = B.rows.filter(function (o) {
    if ((tu || den) && cotNgay) {
      var d = ngayLoc_(o[cotNgay]);
      if (!d || (tu && d < tu) || (den && d > den)) return false;
    }
    return Object.keys(loc).every(function (k) {
      var dk = String(loc[k]).trim(), phu = false;
      if (dk[0] === '!') { phu = true; dk = dk.slice(1); }
      var v = String(giaTri_(o[k])).trim().toLowerCase(), ok;
      if (dk[0] === '~') ok = v.indexOf(dk.slice(1).toLowerCase()) >= 0;
      else ok = dk.toLowerCase().split('|').map(function (x) { return x.trim(); }).indexOf(v) >= 0;
      return phu ? !ok : ok;
    });
  });
  var gh = Math.min(Math.max(Number(inp.gioi_han) || 40, 1), 200);
  var sx = inp.sap_xep ? String(inp.sap_xep) : '', tang = sx[0] === '+';
  if (tang) sx = sx.slice(1);

  if (inp.nhom_theo && inp.nhom_theo.length) {
    inp.nhom_theo.forEach(function (k) { if (B.ten.indexOf(k) < 0) throw new Error('Không có cột ' + k); });
    var phep = (inp.tinh && inp.tinh.length ? inp.tinh : ['dem']).map(function (s) {
      var p = String(s).split(':'); return { ten: String(s), op: p[0], cot: p[1] };
    });
    var G = {}, thuTu = [];
    rows.forEach(function (o) {
      var k = inp.nhom_theo.map(function (c) { return String(giaTri_(o[c])); }).join(' ¦ ');
      if (!G[k]) { G[k] = { khoa: k, n: 0, s: {}, m: {}, kh: {} }; thuTu.push(k); }
      var g = G[k]; g.n++;
      phep.forEach(function (p) {
        if (!p.cot) return;
        var v = o[p.cot];
        if (p.op === 'dem_khac') { (g.kh[p.ten] = g.kh[p.ten] || {})[String(giaTri_(v))] = 1; return; }
        var x = so_(v);
        g.s[p.ten] = (g.s[p.ten] || 0) + x;
        if (p.op === 'max') g.m[p.ten] = g.m[p.ten] === undefined ? x : Math.max(g.m[p.ten], x);
        if (p.op === 'min') g.m[p.ten] = g.m[p.ten] === undefined ? x : Math.min(g.m[p.ten], x);
      });
    });
    var kq = thuTu.map(function (k) {
      var g = G[k], o = { khoa: k };
      phep.forEach(function (p) {
        o[p.ten] = p.op === 'dem' ? g.n : p.op === 'dem_khac' ? Object.keys(g.kh[p.ten] || {}).length
          : p.op === 'tb' ? Math.round((g.s[p.ten] || 0) / g.n * 100) / 100
          : p.op === 'max' || p.op === 'min' ? g.m[p.ten] : Math.round((g.s[p.ten] || 0) * 100) / 100;
      });
      return o;
    });
    var cs = sx || phep[0].ten;
    kq.sort(function (a, b) {
      var x = cs in a ? a[cs] : a.khoa, y = cs in b ? b[cs] : b.khoa;
      return (x < y ? -1 : x > y ? 1 : 0) * (tang ? 1 : -1);
    });
    return 'Bảng ' + inp.bang + loTxt_(tu, den) + ': ' + rows.length + ' dòng khớp, ' + kq.length + ' nhóm' +
      (kq.length > gh ? ' (hiện ' + gh + ')' : '') + '.\n' + inp.nhom_theo.join(' ¦ ') + ' | ' + phep.map(function (p) { return p.ten; }).join(' | ') + '\n' +
      kq.slice(0, gh).map(function (o) { return o.khoa + ' | ' + phep.map(function (p) { return o[p.ten]; }).join(' | '); }).join('\n');
  }

  var cot = inp.cot && inp.cot.length ? inp.cot.filter(function (k) { return B.ten.indexOf(k) >= 0; }) : B.ten;
  if (sx && B.ten.indexOf(sx) >= 0) {
    rows = rows.slice().sort(function (a, b) {
      var x = giaTri_(a[sx]), y = giaTri_(b[sx]);
      if (typeof x !== 'number' || typeof y !== 'number') { x = String(x); y = String(y); }
      return (x < y ? -1 : x > y ? 1 : 0) * (tang ? 1 : -1);
    });
  }
  return 'Bảng ' + inp.bang + loTxt_(tu, den) + ': ' + rows.length + ' dòng khớp' + (rows.length > gh ? ' (hiện ' + gh + ')' : '') + '.\n' +
    cot.join(' | ') + '\n' +
    rows.slice(0, gh).map(function (o) { return cot.map(function (k) { return String(giaTri_(o[k])).replace(/\s+/g, ' '); }).join(' | '); }).join('\n');
}

function loTxt_(tu, den) { return tu || den ? ' (' + (tu || '…') + ' → ' + (den || '…') + ')' : ''; }

function ccHieuSuat_(ctx, inp) {
  var D = ctxDuLieu_(ctx, null);
  var T = ctx.T || (ctx.T = traCuu_(D));
  var tu = ngay_(inp.tu_ngay), den = ngay_(inp.den_ngay);
  if (!tu || !den) throw new Error('Cần tu_ngay và den_ngay dạng yyyy-mm-dd');
  if (den < tu) throw new Error('den_ngay phải sau tu_ngay');
  var mx = inp.ma_xuong ? String(inp.ma_xuong).trim().toUpperCase() : '', mnv = inp.ma_nv ? String(inp.ma_nv).trim().toUpperCase() : '';
  var hop = function (x, nv) { return (!mx || String(x).toUpperCase() === mx) && (!mnv || String(nv).toUpperCase() === mnv); };
  var I = chiMuc_(D, T), gh = Math.min(Number(inp.gioi_han) || 30, 200);
  var cho = I.cho.filter(function (r) { return r.d >= tu && r.d <= den && hop(r.x, r.nv); }).length;
  var tenX = function (x) { return T.tenXuong[x] || x; };
  var r1 = function (n) { return Math.round(n * 10) / 10; };

  if (inp.theo === 'cong_doan') {
    var tenCD = {}, cdB = D.CongDoan, G = {};
    cdB.rows.forEach(function (r) { tenCD[String(r[cdB.c.MaCD]).trim()] = String(r[cdB.c.TenCD]).trim(); });
    Object.keys(I.nk).forEach(function (k) {
      I.nk[k].forEach(function (r) {
        if (r.d < tu || r.d > den || !hop(r.x, r.nv)) return;
        var g = G[r.cd] = G[r.cd] || { gio: 0, chuan: 0, sl: 0, loi: 0, dung: 0, nguoi: {} };
        var n = I.loi[r.nv + '|' + r.d + '|' + r.cd] || 0, dm = dinhMuc_(T, r.cd);
        g.gio += r.gio; g.sl += r.sl; g.loi += n; g.dung += r.dung; g.nguoi[r.nv] = 1;
        if (dm > 0) g.chuan += (r.sl - n) / dm;
      });
    });
    var dsCD = Object.keys(G).map(function (k) { var g = G[k]; g.k = k; g.pt = g.gio > 0 ? g.chuan / g.gio * 100 : null; return g; })
      .sort(function (a, b) { return (b.pt == null ? -1 : b.pt) - (a.pt == null ? -1 : a.pt); });
    return 'Theo công đoạn ' + tu + ' → ' + den + ' (dòng đã chốt; % tính trên GIỜ KHAI vì giờ có mặt không chia theo công đoạn). ' + cho + ' dòng chờ duyệt.\n' +
      'Công đoạn | % (giờ chuẩn/giờ khai) | giờ khai | giờ dừng | sản lượng | lỗi KCS | số người\n' +
      dsCD.slice(0, gh).map(function (g) {
        return g.k + ' ' + (tenCD[g.k] || '') + ' | ' + (g.pt == null ? 'không có định mức' : r1(g.pt) + '%') + ' | ' + r1(g.gio) + ' | ' + r1(g.dung) + ' | ' +
          Math.round(g.sl) + ' | ' + Math.round(g.loi) + ' | ' + Object.keys(g.nguoi).length;
      }).join('\n') + (dsCD.length > gh ? '\n… còn ' + (dsCD.length - gh) + ' dòng' : '');
  }

  var G2 = {}, ngayCo = {};
  ngayCong_(D, T, tu, den).forEach(function (o) {
    if (!hop(o.x, o.nv)) return;
    var k = inp.theo === 'nguoi' ? o.nv + ' ' + (D.nvTen[o.nv] || '') + ' (' + o.x + ')' : inp.theo === 'ngay' ? o.d : tenX(o.x);
    congVao_(G2[k] = G2[k] || nhomMoi_(), o);
    ngayCo[o.d] = 1;
  });
  var ds = Object.keys(G2).map(function (k) { var g = G2[k]; g.k = k; g.pt = pt_(g); return g; });
  ds.sort(inp.theo === 'ngay' ? function (a, b) { return a.k < b.k ? -1 : 1; } : function (a, b) { return (b.pt || 0) - (a.pt || 0); });
  var t = tong_(G2), cl = t.sl > 0 ? (t.sl - t.loi) / t.sl * 100 : null;
  var dau = 'Hiệu suất ' + tu + ' → ' + den + (mx ? ' xưởng ' + mx : '') + (mnv ? ' NV ' + mnv : '') + ' (cách tính web app): ' +
    Object.keys(ngayCo).length + ' ngày công, ' + t.dong + ' dòng đã chốt, ' + cho + ' dòng chờ duyệt. Chung: ' +
    (pt_(t) == null ? '—' : r1(pt_(t)) + '%') + (cl != null ? ', đạt chất lượng ' + r1(cl) + '%' : '') + ', ' + r1(t.mau) + ' giờ có mặt, ' +
    r1(t.dung) + ' giờ dừng, ' + Object.keys(t.nguoi).length + ' người, ' + Object.keys(t.chuaKhai).length + ' lượt người-ngày đi làm chưa có sản lượng đã chốt.';
  return dau + '\n' + (inp.theo === 'nguoi' ? 'Người' : inp.theo === 'ngay' ? 'Ngày' : 'Xưởng') +
    ' | hiệu suất | giờ có mặt | giờ khai | giờ dừng | sản lượng | lỗi KCS | số người | ngày chưa khai\n' +
    ds.slice(0, gh).map(function (g) {
      return g.k + ' | ' + (g.pt == null ? '—' : r1(g.pt) + '%') + ' | ' + r1(g.mau) + ' | ' + r1(g.gio) + ' | ' + r1(g.dung) + ' | ' +
        Math.round(g.sl) + ' | ' + Math.round(g.loi) + ' | ' + Object.keys(g.nguoi).length + ' | ' + Object.keys(g.chuaKhai).length;
    }).join('\n') + (ds.length > gh ? '\n… còn ' + (ds.length - gh) + ' dòng' : '');
}
