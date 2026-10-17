/**
 * GIỌNG NÓI ("Jarvis") – tab 🎙 Giọng nói trong web app.
 *  - Nghe: bộ nhận giọng có sẵn của trình duyệt (Chrome / Safari, tiếng Việt, miễn phí) → chữ, gửi lên uiNoi.
 *  - Nghĩ: hoiAI_('giong', …) – cùng bộ não, cùng các phòng; lịch sử riêng; cách trả lời hợp để đọc to (GIONG_CACH).
 *    "Báo cáo" / "Việc hôm nay" trả lời ngay từ số liệu, không tốn tiền AI.
 *  - Nói: giọng tiếng Việt của máy (miễn phí); hoặc giọng FPT.AI nếu có Thuộc tính tập lệnh FPT_TTS_KEY
 *    (giọng: FPT_GIONG = banmai | lannhi | myan | thuminh | linhsan | leminh | giahuy; mặc định banmai).
 */

var GIONG_CACH = [
  'LẦN NÀY BẠN TRẢ LỜI BẰNG GIỌNG NÓI (câu trả lời sẽ được máy đọc to, người nghe không nhìn màn hình). Bỏ qua quy tắc định dạng Zalo ở trên:',
  '- Như trợ lý Jarvis: xưng "tôi", gọi người dùng là "sếp"; đi thẳng vào câu trả lời, không chào lại.',
  '- 2 đến 5 câu ngắn, tối đa khoảng 600 ký tự. Chỉ nêu các con số quan trọng nhất (làm tròn), rồi một câu gợi ý nếu có điều đáng chú ý.',
  '- Không gạch đầu dòng, không bảng, không ký hiệu, không biểu tượng cảm xúc, không đường link. Viết "phần trăm" thay cho %, "giờ" thay cho h, ngày viết "ngày 16 tháng 10".',
  '- Nếu kết quả dài (bài viết, danh sách nhiều dòng), đọc tóm tắt 1–2 câu và nói "chi tiết tôi để trên màn hình", rồi ghi phần chi tiết ở cuối sau một dòng chỉ có "---".'
].join('\n');

/** Từ gọi trợ lý (rảnh tay): bỏ đi trước khi xử lý câu lệnh. */
var GIONG_GOI = /^\s*(trợ lý ơi|trợ lý|jarvis|gia vít|giác vít|da vít)[\s,.!]*/i;

/** Hỏi bằng giọng. Trả về { noi: câu để đọc, chu: phần chi tiết hiện trên màn hình (có thể rỗng) }. */
function uiNoi(k, cauHoi, ma) {
  uiCan_(k);
  var q = String(cauHoi || '').replace(GIONG_GOI, '').trim();
  if (!q) return { noi: 'Tôi đang nghe đây sếp.', chu: '' };
  var t = q.toLowerCase().replace(/[.!?,]+$/g, '').trim();
  if (/^(đọc |cho tôi |xem )?(bản tin|báo cáo|bao cao|ban tin)( (hôm nay|sáng nay|hôm qua|sản xuất|ngày))?$/.test(t)) return { noi: banTinNoi_(), chu: '' };
  if (/^(đọc |xem )?(việc|công việc|danh sách việc)( (hôm nay|của tôi|đang mở))?$|^hôm nay (có )?(việc gì|làm gì)$/.test(t)) return { noi: viecNoi_(), chu: '' };
  var tl = hoiAI_('giong', q, ma || '');
  var cat = tl.split(/\n-{3,}\n/);
  return { noi: cat[0].trim(), chu: cat.slice(1).join('\n').trim() };
}

/** Bản tin sáng dạng lời nói – tính từ số liệu, không gọi AI. */
function uiBanTinNoi(k) { uiCan_(k); return banTinNoi_(); }

function banTinNoi_() {
  var D = napDuLieu_(), T = traCuu_(D), ngay = ngayGanNhat_(D, homNay_());
  var gio = Number(Utilities.formatDate(new Date(), TZ, 'HH'));
  var cau = [(gio < 11 ? 'Chào buổi sáng sếp.' : gio < 18 ? 'Chào sếp.' : 'Chào buổi tối sếp.')];
  if (!ngay) {
    cau.push('Mười ngày qua chưa có số liệu sản xuất nào được chốt.');
  } else {
    var H = tongHop_(D, T, ngay, ngay), tg = tong_(H.X), p = ngay.split('-');
    var thu = tenNgay_(ngay).split(' ')[0];
    cau.push('Đây là bản tin sản xuất ' + thu.toLowerCase() + ', ngày ' + Number(p[2]) + ' tháng ' + Number(p[1]) + '.');
    var pt = pt_(tg);
    cau.push('Hiệu suất toàn nhà máy ' + (pt == null ? 'chưa tính được' : 'đạt ' + Math.round(pt) + ' phần trăm') + ', với ' + Object.keys(tg.nguoi).length + ' người làm.');
    var xs = Object.keys(H.X).filter(function (x) { return H.X[x].mau && pt_(H.X[x]) != null; })
      .map(function (x) { return { ten: T.tenXuong[x] || x, pt: pt_(H.X[x]) }; })
      .sort(function (a, b) { return b.pt - a.pt; });
    if (xs.length > 1) cau.push('Cao nhất là ' + xs[0].ten + ', ' + Math.round(xs[0].pt) + ' phần trăm; thấp nhất là ' + xs[xs.length - 1].ten + ', ' + Math.round(xs[xs.length - 1].pt) + ' phần trăm.');
    if (tg.sl > 0 && tg.loi > 0) cau.push('Tỷ lệ đạt chất lượng ' + soNoi_((tg.sl - tg.loi) / tg.sl * 100) + ' phần trăm.');
    var ly = Object.keys(H.dungLyDo).sort(function (a, b) { return H.dungLyDo[b].gio - H.dungLyDo[a].gio; });
    if (tg.dung > 0) cau.push('Máy dừng tổng cộng ' + soNoi_(tg.dung) + ' giờ' + (ly.length ? ', nhiều nhất do ' + ly[0] : '') + '.');
    var cy = [];
    if (tg.cho) cy.push(tg.cho + ' dòng sản lượng đang chờ duyệt');
    var ck = Object.keys(tg.chuaKhai).length;
    if (ck) cy.push(ck + ' người đi làm nhưng chưa có sản lượng đã chốt');
    var dd = chuaDiemDanh_(D, T, ngay);
    if (dd.length) cy.push(dd.join(', ') + ' chưa xác nhận điểm danh');
    cau.push(cy.length ? 'Cần chú ý: ' + cy.join('; ') + '.' : 'Không có gì bất thường cần chú ý.');
  }
  var v = viecNoi_(true);
  if (v) cau.push(v);
  return cau.join(' ');
}

/** Việc đang mở (tối đa 3 việc đọc to). ngan = chỉ trả câu khi có việc. */
function viecNoi_(ngan) {
  var ds = typeof uiDsViec_ === 'function' ? uiDsViec_() : null;
  if (ds == null) return ngan ? '' : 'Chưa cài sổ tay việc.';
  if (!ds.length) return ngan ? '' : 'Sếp không có việc nào đang mở.';
  var hn = homNay_(), homNay = ds.filter(function (v) { return v.han && v.han.slice(0, 10) <= hn; });
  var doc = (homNay.length ? homNay : ds).slice(0, 3).map(function (v) {
    return v.noiDung + (v.han && v.han.slice(0, 10) === hn ? ', lúc ' + Number(v.han.slice(11, 13)) + ' giờ ' + (v.han.slice(14, 16) === '00' ? '' : v.han.slice(14, 16)) : '');
  });
  return (homNay.length ? 'Hôm nay sếp có ' + homNay.length + ' việc' : 'Sếp có ' + ds.length + ' việc đang mở') + ': ' + doc.join('; ').replace(/\s+;/g, ';').trim() + '.';
}

function soNoi_(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }

/* ============================ GIỌNG FPT.AI (tùy chọn) ============================ */

function uiGiongCauHinh(k) {
  uiCan_(k);
  var P = PropertiesService.getScriptProperties();
  return { fpt: !!P.getProperty('FPT_TTS_KEY'), fptGiong: P.getProperty('FPT_GIONG') || 'banmai', coAI: !!P.getProperty('ANTHROPIC_API_KEY') };
}

/** Đọc bằng giọng FPT.AI → trả về âm thanh dạng data: URI (trang phát ngay, không phụ thuộc máy chủ ngoài). Lỗi → '' để trang dùng giọng máy. */
function uiDocFPT(k, chu) {
  uiCan_(k);
  var P = PropertiesService.getScriptProperties(), key = P.getProperty('FPT_TTS_KEY');
  chu = String(chu || '').slice(0, 2000);
  if (!key || chu.length < 3) return '';
  try {
    var r = UrlFetchApp.fetch('https://api.fpt.ai/hmi/tts/v5', {
      method: 'post', payload: Utilities.newBlob(chu, 'text/plain', 'tts').getBytes(), contentType: 'text/plain; charset=utf-8', muteHttpExceptions: true,
      headers: { 'api-key': key, 'api_key': key, voice: P.getProperty('FPT_GIONG') || 'banmai', speed: P.getProperty('FPT_TOC_DO') || '0', format: 'mp3' }
    });
    var j = JSON.parse(r.getContentText() || '{}');
    if (j.error !== 0 || !j.async) return '';
    for (var i = 0; i < 25; i++) {   // FPT tạo tệp sau vài giây
      Utilities.sleep(i < 4 ? 700 : 1200);
      var a = UrlFetchApp.fetch(j.async, { muteHttpExceptions: true });
      if (a.getResponseCode() === 200 && a.getContent().length > 1000) return 'data:audio/mpeg;base64,' + Utilities.base64Encode(a.getContent());
    }
  } catch (e) { /* dùng giọng máy */ }
  return '';
}
