/**
 * Kiểm thử báo cáo ngày cho chủ sở hữu (ThanhToan.gs › bcSoLieu_, guiBaoCaoNgay, caiDatBaoCaoNgay).
 * Chạy: node tests/bao-cao.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
const thu = [], trig = [];
ctx.Logger = { log: () => {} };
ctx.MailApp = { sendEmail: o => thu.push(o) };
ctx.Session = { getEffectiveUser: () => ({ getEmail: () => 'chu@vidu.vn' }) };
ctx.ScriptApp = Object.assign({}, ctx.ScriptApp, { getProjectTriggers: () => trig.slice(), deleteTrigger: t => trig.splice(trig.indexOf(t), 1),
  newTrigger: h => ({ timeBased: () => ({ everyDays: n => ({ atHour: g => ({ create() { trig.push({ getHandlerFunction: () => h, n, g }); } }) }) }) }) });
const now = Date.now(), gio = h => new Date(now - h * 3600e3);
// Dữ liệu mẫu: 2 tài khoản mới hôm nay, 1 cũ; 2 đơn trả hôm nay, 1 đơn trả 5 ngày trước, 1 đơn chờ
ctx.tkTaoMoi_('khach1', 'matkhau123', 'Khách Một', 'thanhVien', { lienHe: '0901234567', tuDangKy: true });
ctx.tkTaoMoi_('khach2', 'matkhau123', 'Khách Hai', 'thanhVien', { lienHe: 'k2@vidu.vn', gioiThieu: 'khach1' });
const cu = JSON.parse(ctx.PropertiesService.getScriptProperties().getProperty('TK_khach2')); 
ctx.tkTaoMoi_('khachcu', 'matkhau123', 'Khách Cũ', 'thanhVien', {});
const pcu = JSON.parse(ctx.PropertiesService.getScriptProperties().getProperty('TK_khachcu')); pcu.taoLuc = gio(24 * 10).toISOString(); ctx.tkGhi_('khachcu', pcu);
const D = ctx.ttSheet_('DonHang');
D.appendRow(['TCC1', 'khach1', 50000, 50, 'DA_TRA', gio(3), gio(2.9), 'payos', '', '']);
D.appendRow(['TCC2', 'khach2', 100000, 110, 'DA_TRA', gio(5), gio(4.9), 'thucong', '', '']);
D.appendRow(['TCC3', 'khach1', 20000, 20, 'DA_TRA', gio(24 * 5), gio(24 * 5), 'payos', '', '']);
D.appendRow(['TCC4', 'khach2', 20000, 20, 'CHO', gio(1), '', 'payos', '', '']);
const M = ctx.ttSheet_('MoKhoa');
M.appendRow([gio(2), 'khach1', 'k1', 'nam:2026', 19, 'Khách Một']);
M.appendRow([gio(2), 'khach1', 'k1', 'dv:2024', 9, 'Khách Một']);
M.appendRow([gio(1), 'khach2', 'k2', 'nam:2027', 19, 'Khách Hai']);
M.appendRow([gio(30), 'khach2', 'k2', 'co_ban', 19, 'Khách Hai']);
const SC = ctx.ttSheet_('SoCai');
SC.appendRow([gio(2), 'khach1', -19, 31, 'Mở vận năm', '']); SC.appendRow([gio(6), 'khach2', 19, 19, 'Quà đăng ký', '']);
const S = ctx.bcSoLieu_(new Date(Date.now() + 1000));
kt(S.tkMoi.length === 2 && S.tkMoi.some(u => u.gioiThieu === 'khach1'), 'đếm 2 tài khoản mới, có người giới thiệu: ' + S.tkMoi.length);
kt(S.don.n === 2 && S.don.tien === 150000, 'doanh thu 24h = 150.000đ từ 2 đơn: ' + S.don.tien);
kt(S.don7.n === 3 && S.don7.tien === 170000, 'doanh thu 7 ngày gồm cả đơn 5 ngày trước');
kt(S.donCho === 1, 'đếm đơn đang chờ');
const nam = S.moKhoa.filter(g => g.k === 'nam')[0];
kt(nam && nam.n === 2 && nam.xu === 38 && !S.moKhoa.some(g => g.k === 'co_ban'), 'gom phần mở theo loại, bỏ lượt ngoài 24h');
kt(S.xuTieu === 19 && S.xuTang === 19, 'xu đã dùng / xu tặng');
const r = ctx.guiBaoCaoNgay();
kt(thu.length === 1 && thu[0].to === 'chu@vidu.vn', 'gửi về tài khoản Google đang chạy dự án khi chưa đặt BAO_CAO_EMAIL');
kt(/150\.000 đ/.test(thu[0].subject) && /2 tài khoản mới/.test(thu[0].subject), 'tiêu đề tóm tắt doanh thu và tài khoản mới: ' + thu[0].subject);
kt(/Báo cáo ngày/.test(thu[0].htmlBody) && /Khách Hai/.test(thu[0].htmlBody) && /Vận năm/.test(thu[0].htmlBody), 'nội dung có tài khoản mới và phần đã mở');
kt(!/undefined|NaN/.test(thu[0].htmlBody), 'nội dung không có undefined/NaN');
ctx.PropertiesService.getScriptProperties().setProperty('BAO_CAO_EMAIL', 'nhan@vidu.vn');
ctx.caiDatBaoCaoNgay(); ctx.caiDatBaoCaoNgay();
kt(trig.filter(t => t.getHandlerFunction() === 'guiBaoCaoNgay').length === 1 && trig[0].g === 7, 'cài trigger 7 giờ sáng, chạy lại không nhân đôi');
kt(thu[thu.length - 1].to === 'nhan@vidu.vn', 'ưu tiên email trong BAO_CAO_EMAIL');
ctx.tatBaoCaoNgay(); kt(!trig.length, 'tắt được báo cáo');
console.log('Báo cáo ngày: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
