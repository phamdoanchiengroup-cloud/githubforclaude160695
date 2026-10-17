/**
 * WEB APP – bảng điều khiển cho Trợ lý (mở trên điện thoại / máy tính).
 * Trang: WebApp.html. Cùng URL /exec với webhook Zalo; doGet gọi webUi_.
 *
 * Bảo mật (ứng dụng web đang để "Bất kỳ ai" cho Zalo):
 *  - Chỉ vào được khi có khóa riêng ?k=UI_KEY (caiDatWebApp in ra đường link) hoặc khi chính chủ đăng nhập Google.
 *  - Người lạ chỉ nhận một dòng chữ thuần (ContentService) → không có trang HTML nào để gọi google.script.run.
 *  - MỌI hàm ui* đều kiểm tra lại khóa.
 *  - Đổi khóa (khi lỡ lộ đường link): chạy doiKhoaWebApp.
 */

var UI_TEN = 'Trợ lý KPI';

function webUi_(e) {
  var k = (e && e.parameter && e.parameter.k) || '';
  if (!uiDuocVao_(k)) {
    return ContentService.createTextOutput('Trợ lý KPI đang chạy. Bảng điều khiển cần đường link riêng (chạy hàm caiDatWebApp để lấy).');
  }
  var t = HtmlService.createTemplateFromFile('WebApp');
  t.k = k || PropertiesService.getScriptProperties().getProperty('UI_KEY') || '';
  return t.evaluate().setTitle(UI_TEN).addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function uiDuocVao_(k) {
  var key = PropertiesService.getScriptProperties().getProperty('UI_KEY');
  if (key && k && String(k) === key) return true;
  try {
    var a = Session.getActiveUser().getEmail(), o = Session.getEffectiveUser().getEmail();
    if (a && o && a === o) return true;
  } catch (e) { /* không xác định được người dùng */ }
  return false;
}

function uiCan_(k) { if (!uiDuocVao_(k)) throw new Error('Không có quyền – mở lại bằng đường link riêng.'); }

/** Chạy 1 lần: tạo khóa riêng và in đường link bảng điều khiển. */
function caiDatWebApp() {
  var P = PropertiesService.getScriptProperties();
  if (!P.getProperty('UI_KEY')) P.setProperty('UI_KEY', Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8));
  var url = P.getProperty('WEBAPP_URL') || ScriptApp.getService().getUrl();
  var link = url + '?k=' + P.getProperty('UI_KEY');
  Logger.log('BẢNG ĐIỀU KHIỂN – lưu đường link này (đừng chia sẻ):\n' + link);
  return link;
}

/** Đổi khóa khi lỡ lộ đường link – link cũ hết tác dụng ngay. */
function doiKhoaWebApp() {
  PropertiesService.getScriptProperties().deleteProperty('UI_KEY');
  return caiDatWebApp();
}

/* ============================ API CHO TRANG ============================ */

/** Số liệu tổng quan: KPI ngày gần nhất, xu hướng 14 ngày, việc, việc nền, kết quả gần đây. */
function uiTongQuan(k) {
  uiCan_(k);
  var D = napDuLieu_(), T = traCuu_(D), hn = homNay_(), ngay = ngayGanNhat_(D, hn);
  var out = { ngay: ngay, tenNgay: ngay ? tenNgay_(ngay) : '', capNhat: Utilities.formatDate(new Date(), TZ, 'HH:mm dd/MM') };
  if (ngay) {
    var H = tongHop_(D, T, ngay, ngay), tg = tong_(H.X);
    out.tong = {
      pt: pt_(tg), nguoi: Object.keys(tg.nguoi).length, mau: tg.mau, dung: tg.dung, cho: tg.cho,
      cl: tg.sl > 0 ? (tg.sl - tg.loi) / tg.sl * 100 : null, chuaKhai: Object.keys(tg.chuaKhai).length
    };
    out.xuong = Object.keys(H.X).filter(function (x) { return H.X[x].mau; }).map(function (x) {
      var o = H.X[x];
      return { ma: x, ten: T.tenXuong[x] || x, pt: pt_(o), nguoi: Object.keys(o.nguoi).length, dung: o.dung, cho: o.cho };
    }).sort(function (a, b) { return (b.pt || 0) - (a.pt || 0); });
    out.dungLyDo = Object.keys(H.dungLyDo).map(function (l) { return { ly: l, gio: H.dungLyDo[l].gio }; })
      .sort(function (a, b) { return b.gio - a.gio; }).slice(0, 5);
    out.chuaDiemDanh = chuaDiemDanh_(D, T, ngay);
    out.xuHuong = [];
    for (var i = 13; i >= 0; i--) {
      var d = congNgay_(ngay, -i), t = tong_(tongHop_(D, T, d, d).X);
      if (t.mau) out.xuHuong.push({ ngay: d, pt: pt_(t) });
    }
  }
  out.viec = uiDsViec_();
  out.viecNen = typeof docViec_ === 'function' ? docViec_().map(function (v) {
    return { loai: TC_TEN[v.loai], tieuDe: v.tieuDe, phut: Math.round((Date.now() - v.bd) / 60000) };
  }) : null;
  out.ketQua = uiKetQua_();
  out.coAI = !!PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  out.coTayChan = typeof giaoViec_ === 'function' && !!PropertiesService.getScriptProperties().getProperty('TC_AG_slide');
  return out;
}

/** Bản tin dạng chữ (giống Zalo) của một ngày hoặc tuần. */
function uiBanTin(k, loai, ngay) {
  uiCan_(k);
  return loai === 'tuan' ? banTinTuan_() : banTinNgay_(ngay ? ngay_(ngay) : null);
}

/** Hỏi một phòng (ma rỗng = để thư ký điều phối). Lịch sử trò chuyện web tách riêng với Zalo. */
function uiHoi(k, ma, cauHoi) {
  uiCan_(k);
  cauHoi = String(cauHoi || '').trim();
  if (!cauHoi) return '';
  var lenh = traLoiNhanh_(cauHoi);
  if (lenh) return lenh;
  return hoiAI_('web', cauHoi, ma || '');
}

/** Lệnh nhanh không tốn AI (bc, tuần, việc, xong N…) – dùng chung logic với Zalo. */
function traLoiNhanh_(text) {
  var t = text.toLowerCase().replace(/\s+/g, ' ').trim();
  if (/^(bc|báo cáo|bao cao|bản tin|ban tin)( |$)/.test(t) || /^(tuần|tuan)$/.test(t) || /^(việc|viec|phòng ban|phong ban)$/.test(t) ||
    /^(xong|done)\s*#?\d+$/.test(t)) return traLoiLenh_(text, 'web');
  return '';
}

function uiDsViec_() {
  var ss = typeof agSS_ === 'function' ? agSS_() : null;
  if (!ss) return null;
  var b = bang_('SoTay', ss);
  return b.rows.filter(function (r) { return String(r[b.c.Loai]).trim() === 'Việc' && !/xong|hủy/i.test(String(r[b.c.TrangThai])); })
    .map(function (r) { return { id: r[b.c.ID], noiDung: String(r[b.c.NoiDung]), han: hanTxt_(r[b.c.Han]) }; })
    .sort(function (a, c) { return (a.han || '9') < (c.han || '9') ? -1 : 1; });
}

function uiViec(k) { uiCan_(k); return uiDsViec_(); }

function uiXong(k, id) { uiCan_(k); return capNhatSoTay_(Number(id), null); }

function uiThemViec(k, noiDung, han) {
  uiCan_(k);
  noiDung = String(noiDung || '').trim();
  if (!noiDung) throw new Error('Chưa nhập nội dung việc.');
  var h = han ? chuanHan_(String(han).replace('T', ' ')) : '';
  var id = themSoTay_('Việc', noiDung, h, 'Web app');
  return 'Đã ghi việc #' + id + (h ? ', nhắc lúc ' + h : '') + '.';
}

/** Danh sách mọi phòng (cả phòng đang tắt) + thư viện Agency. */
function uiPhong(k) {
  uiCan_(k);
  var ss = typeof agSS_ === 'function' ? agSS_() : null;
  if (!ss) return { chuaCai: true };
  var b = bang_('CacAgent', ss), bat = {};
  (docAgents_() || []).forEach(function (a) { bat[a.ma] = a; });
  var ds = b.rows.filter(function (r) { return String(r[b.c.Ma]).trim(); }).map(function (r) {
    var ma = String(r[b.c.Ma]).trim(), a = bat[ma];
    return {
      ma: ma, ten: String(r[b.c.Ten] || ma), goi: String(r[b.c.Goi] || '').split(/[,;]/)[0].trim() || ma,
      moTa: String(r[b.c.MoTa] || ''), congCu: a ? a.congCu.join(', ') : String(r[b.c.CongCu] || ''),
      bat: !!a, canhBao: a && a.canhBao || '', agency: /^ag_/.test(ma)
    };
  });
  return { phong: ds, agency: typeof danhMucAgency_ === 'function' ? danhMucAgency_() : [] };
}

function uiBatPhong(k, ma, bat) {
  uiCan_(k);
  var ss = agSS_(), sh = ss.getSheetByName('CacAgent'), b = bang_('CacAgent', ss);
  for (var i = 0; i < b.rows.length; i++) {
    if (String(b.rows[i][b.c.Ma]).trim() !== ma) continue;
    sh.getRange(i + 2, b.c.Bat + 1).setValue(bat ? 'Có' : 'Không');
    CacheService.getScriptCache().remove('agents');
    return (bat ? 'Đã bật ' : 'Đã tắt ') + b.rows[i][b.c.Ten];
  }
  throw new Error('Không có phòng ' + ma);
}

function uiNhapAgency(k, dsMa) { uiCan_(k); return nhapAgency(dsMa || []); }

function uiGiaoTin(k, chuDe) { uiCan_(k); return giaoTinTuc_(chuChat_(), chuDe || ''); }

function uiGiaoSlide(k, tu, den, chuDe, yeuCau) {
  uiCan_(k);
  return giaoSlide_({ D: {}, chatId: chuChat_() }, { tu_ngay: tu, den_ngay: den, chu_de: chuDe, yeu_cau: yeuCau });
}

function uiDocEmail(k, truyVan, yeuCau) {
  uiCan_(k);
  return docTepEmail_({ D: {}, chatId: chuChat_() }, { truy_van: truyVan, yeu_cau: yeuCau });
}

function chuChat_() { return PropertiesService.getScriptProperties().getProperty('CHU_CHAT_ID') || 'web'; }

function uiKetQua_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('TC_KQ') || '[]'); } catch (e) { return []; }
}
