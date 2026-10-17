/**
 * Kiểm thử GiongNoi.gs (tab 🎙 Giọng nói): khóa truy cập, bản tin đọc to không tốn AI,
 * cách trả lời bằng giọng gửi kèm cho AI, tách phần chi tiết, giọng FPT.AI.
 * Chạy: node tests/giong-noi.js
 */
const assert = require('assert');
const { taoMoiTruong, kpiMau } = require('./gia-lap.js');

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const txt = t => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }] });

const M = taoMoiTruong();
kpiMau(M.kpi);
Object.assign(M.store, { ZALO_TOKEN: 'TOK', WEBHOOK_KEY: 'k123456789', CHU_CHAT_ID: 'u1', ANTHROPIC_API_KEY: 'sk-test', WEBAPP_URL: 'https://script.google.com/macros/s/ABC/exec' });
M.ctx.caiDatAgent();
M.ctx.caiDatWebApp();
const K = M.store.UI_KEY;

// ---------- khóa truy cập ----------
['uiNoi', 'uiBanTinNoi', 'uiGiongCauHinh', 'uiDocFPT'].forEach(f => { assert.throws(() => M.ctx[f]('sai', 'x'), /Không có quyền/); n++; });

// ---------- bản tin đọc to: không gọi AI ----------
const soAI = M.ai.yeuCau.length;
const bt = M.ctx.uiBanTinNoi(K);
ok(/^Chào (buổi sáng |buổi tối )?sếp\./.test(bt), 'mở đầu chào: ' + bt.slice(0, 40));
ok(/bản tin sản xuất .*ngày \d+ tháng \d+/.test(bt) && /Hiệu suất toàn nhà máy (đạt \d+ phần trăm|chưa tính được)/.test(bt), 'có ngày và hiệu suất đọc được: ' + bt);
ok(!/[%#•*]|\d\/\d|https?:/.test(bt) && !/[\u{1F300}-\u{1FAFF}]/u.test(bt), 'không ký hiệu khó đọc');
ok(/Cần chú ý|Không có gì bất thường/.test(bt), 'có phần cần chú ý');
ok(M.ctx.uiNoi(K, 'Trợ lý ơi, báo cáo.').noi === M.ctx.uiBanTinNoi(K), '"Trợ lý ơi, báo cáo" → bản tin, bỏ từ gọi');
ok(/việc/.test(M.ctx.uiNoi(K, 'việc hôm nay').noi), 'việc hôm nay');
ok(M.ctx.uiNoi(K, 'bc').noi === bt && M.ctx.uiNoi(K, 'Bc.').noi === bt, 'gõ "bc" trong tab giọng nói → bản tin');
const tuan = M.ctx.uiNoi(K, 'tuần');
ok(/màn hình/.test(tuan.noi) && /TỔNG KẾT/.test(tuan.chu), 'tuần → tổng kết tuần trên màn hình');
ok(/BẢN TIN SẢN XUẤT/.test(M.ctx.uiHoi(K, '', 'Bc.')) && /BẢN TIN SẢN XUẤT/.test(M.ctx.traLoiLenh_('Bc.', 'u1')), '"Bc." có dấu chấm vẫn là lệnh');
ok(M.ai.yeuCau.length === soAI, 'bản tin, việc, tuần không tốn AI');
ok(/đang nghe/.test(M.ctx.uiNoi(K, 'Jarvis').noi), 'chỉ gọi tên → trả lời đang nghe');

// ---------- câu hỏi tự do: kèm cách trả lời bằng giọng, lịch sử riêng ----------
M.ai.kich.push(body => {
  ok(/TRẢ LỜI BẰNG GIỌNG NÓI/.test(body.system[0].text) && /"sếp"/.test(body.system[0].text), 'gửi kèm cách trả lời bằng giọng');
  return txt('Hôm qua xưởng Ngọn thấp nhất, 82 phần trăm, do chờ vật tư.\n---\nChi tiết:\n• Ngọn 82%\n• Cán 97%');
});
const r1 = M.ctx.uiNoi(K, 'vì sao hôm qua xưởng Ngọn thấp nhất', 'san_xuat');
ok(r1.noi === '[Sản xuất]\nHôm qua xưởng Ngọn thấp nhất, 82 phần trăm, do chờ vật tư.' && /Cán 97%/.test(r1.chu), 'tách phần đọc và phần chi tiết');
ok(JSON.parse(M.cache.hsgiong || '[]').length === 1 && !M.cache.hsweb, 'lịch sử giọng nói riêng');
M.ai.kich.push(body => { ok(!/TRẢ LỜI BẰNG GIỌNG NÓI/.test(body.system[0].text), 'web chữ: không có cách trả lời giọng'); return txt('ok'); });
M.ctx.uiHoi(K, 'san_xuat', 'phân tích xưởng nào cao nhất');

// ---------- FPT.AI ----------
ok(M.ctx.uiGiongCauHinh(K).fpt === false && M.ctx.uiDocFPT(K, 'Xin chào sếp') === '', 'chưa có khóa FPT → dùng giọng máy');
M.store.FPT_TTS_KEY = 'fpt-key'; M.store.FPT_GIONG = 'leminh';
const cf = M.ctx.uiGiongCauHinh(K);
ok(cf.fpt === true && cf.fptGiong === 'leminh', 'cấu hình FPT');
const uri = M.ctx.uiDocFPT(K, 'Hiệu suất đạt 95 phần trăm');
const g0 = M.fpt.goi[0];
ok(/^data:audio\/mpeg;base64,/.test(uri) && uri.length > 1000, 'trả âm thanh dạng data URI');
ok(g0.o.headers['api-key'] === 'fpt-key' && g0.o.headers.voice === 'leminh' && Buffer.from(g0.o.payload).toString('utf8') === 'Hiệu suất đạt 95 phần trăm', 'gửi đúng khóa, giọng, chữ UTF-8');
ok(M.fpt.goi.filter(g => g.url.startsWith('https://file01')).length === 3, 'chờ tệp sẵn sàng rồi mới tải');
M.fpt.choLan = 999; M.fpt.goi.length = 0;
ok(M.ctx.uiDocFPT(K, 'Thử lại') === '', 'FPT chậm quá → trả rỗng để dùng giọng máy');

M.ai.kich.push({ __ma: 400, type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low to access the Anthropic API.' } });
ok(/hết tiền.*Buy credits.*bc, tuần/.test(M.ctx.uiHoi(K, 'san_xuat', 'vì sao xưởng Ngọn thấp hôm qua')), 'hết tiền API → báo bằng tiếng Việt, chỉ cách nạp');
ok(M.ai.kich.length === 0 && M.ai.loiKich.length === 0, 'giả lập AI: dùng hết, không có lỗi bị nuốt: ' + M.ai.loiKich.map(e => e.message).join(' | '));
console.log('✓ giong-noi: ' + n + ' kiểm tra đạt');
