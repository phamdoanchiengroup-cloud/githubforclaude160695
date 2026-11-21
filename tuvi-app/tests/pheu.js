/**
 * Kiểm thử phễu bán hàng (ThanhToan.gs › skGhi_, skLapLaSo_, skMua_, skXa_, qtPheu; điểm ghi trong TaiKhoan.gs, ThanhToan.gs, TienIch.gs).
 * Apps Script giả lập (tools/gia-lap.js). Chạy: node tests/pheu.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
function nem(fn) { try { fn(); return null; } catch (e) { return e.message; } }
const cache = ctx.CacheService.getScriptCache();
const thu = [];
ctx.MailApp = { getRemainingDailyQuota: () => 1000, sendEmail: o => thu.push(o) };
const SK = () => (ctx.laySS_().getSheetByName('SuKien') || { rows: [] }).rows.slice(1);
const dem = (su, ten) => SK().filter(r => r[1] === su && (ten == null || r[2] === ten)).reduce((s, r) => s + (+r[5] || 0), 0);
const homNay = ctx.skNgay_();
const tokChu = 'tok-chu-pheu-00000000000001';
cache.put('SS_' + tokChu, JSON.stringify({ ten: 'chienpham' }));
if (!ctx.tkDoc_('chienpham')) ctx.tkGhi_('chienpham', { salt: 'x', hash: 'y', vaiTro: 'chu', hienThi: 'Chủ' });

// 1. skNgay_: ngày theo giờ VN (17:30 UTC = 00:30 hôm sau ở VN)
kt(ctx.skNgay_(new Date(Date.UTC(2026, 10, 21, 17, 30))) === '2026-11-22' && ctx.skNgay_(new Date(Date.UTC(2026, 10, 21, 16, 59))) === '2026-11-21', 'skNgay_ theo giờ VN');

// 2. Đăng ký, xác thực email
const dk = ctx.dangKy('pheu1', 'matkhau123', 'P1', 'pheu1@vidu.vn', '');
kt(dem('dang_ky', 'pheu1') === 1, 'dang_ky: ghi 1 dòng với tên tài khoản');
const dkRow = SK().find(r => r[1] === 'dang_ky' && r[2] === 'pheu1');
kt(dkRow && dkRow[0] instanceof Date && dkRow[4] === homNay && dkRow[3] === '' && !/@/.test(JSON.stringify(dkRow)), 'dang_ky: có thời gian, ngày VN; không lưu email');
ctx.guiMaEmail(dk.token, 'pheu1@vidu.vn');
const ma = String(thu[thu.length - 1].body).match(/(\d{6})/)[1];
kt(ctx.xacThucEmail(dk.token, '000000' === ma ? '111111' : '000000').ok === false && dem('xac_thuc_email') === 0, 'xac_thuc_email: mã sai không ghi sự kiện');
const xt = ctx.xacThucEmail(dk.token, ma);
kt(xt.ok && xt.qua.xu === 39 && dem('xac_thuc_email', 'pheu1') === 1, 'xac_thuc_email: ghi khi xác thực đúng (quà 39 xu)');
kt(JSON.parse(SK().find(r => r[1] === 'xac_thuc_email')[3]).qua === 39, 'xac_thuc_email: ghi số xu quà');

// 3. Lập lá số: khách / tài khoản đếm gộp trong bộ nhớ đệm, dồn xuống Sheet
const inp = () => ({ name: 'An', gender: 'nam', calendar: 'duong', day: 5, month: 6, year: 1990, hour: 8, minute: 0, place: '21.03|105.85|Hà Nội', tz: '7' });
ctx.lapLaSo(inp(), ''); ctx.lapLaSo(inp(), ''); ctx.lapLaSo(inp(), dk.token);
const g = JSON.parse(cache.get('SK_GOP'));
kt(g && g.khach === 2 && g.tk === 1 && g.ngay === homNay && dem('lap_la_so') === 0, 'lap_la_so: đếm trong bộ nhớ đệm (2 khách, 1 tài khoản), chưa ghi Sheet');
ctx.skXa_();
kt(dem('lap_la_so', '(khách)') === 2 && dem('lap_la_so', '(tài khoản)') === 1 && cache.get('SK_GOP') == null, 'skXa_: dồn xuống Sheet 2 dòng gộp, xóa bộ đệm');
kt(!SK().some(r => r[1] === 'lap_la_so' && r[2] === 'pheu1'), 'lap_la_so: không ghi tên tài khoản (chỉ đếm)');
for (let i = 0; i < 19; i++) ctx.skLapLaSo_(false);
kt(dem('lap_la_so', '(khách)') === 2, '19 lượt: vẫn trong bộ đệm');
ctx.skLapLaSo_(true);
kt(dem('lap_la_so', '(khách)') === 21 && dem('lap_la_so', '(tài khoản)') === 2 && cache.get('SK_GOP') == null, 'đủ 20 lượt: tự dồn xuống Sheet');
cache.put('SK_GOP', JSON.stringify({ ngay: '2026-01-01', khach: 4, tk: 0, t: Date.now() }));
ctx.skLapLaSo_(false);
kt(SK().some(r => r[1] === 'lap_la_so' && r[4] === '2026-01-01' && r[5] === 4) && JSON.parse(cache.get('SK_GOP')).ngay === homNay, 'sang ngày mới: dồn phần ngày cũ đúng ngày cũ');
cache.put('SK_GOP', JSON.stringify({ ngay: homNay, khach: 1, tk: 0, t: Date.now() - 31 * 60e3 }));
ctx.skLapLaSo_(false);
kt(cache.get('SK_GOP') == null, 'quá 30 phút: tự dồn xuống Sheet');

// 4. Mua: mua_dau một lần, mua mỗi lần (dùng Kỳ Môn 9 xu và một phần lá số)
const vn = new Date(Date.now() + 7 * 3600e3), td = { day: vn.getUTCDate(), month: vn.getUTCMonth() + 1, year: vn.getUTCFullYear(), hour: vn.getUTCHours(), minute: vn.getUTCMinutes() };
const m1 = ctx.muaPhan(dk.token, td, 'km_hoi', 'cong_viec');
kt(m1.ok && m1.gia === 9 && dem('mua', 'pheu1') === 1 && dem('mua_dau', 'pheu1') === 1, 'mua lần đầu: mua + mua_dau');
kt(JSON.parse(SK().find(r => r[1] === 'mua_dau')[3]).phan === 'km_hoi' && JSON.parse(SK().find(r => r[1] === 'mua')[3]).xu === 9, 'mua: ghi phần và số xu');
ctx.muaPhan(dk.token, td, 'km_hoi', 'cong_viec');
kt(dem('mua', 'pheu1') === 1, 'mua lại (daCo): không ghi thêm');
const m2 = ctx.muaPhan(dk.token, inp(), 'phoi_ngau');
kt(m2.ok && dem('mua', 'pheu1') === 2 && dem('mua_dau', 'pheu1') === 1 && ctx.tkDoc_('pheu1').daMuaXu, 'mua lần 2: chỉ mua, không thêm mua_dau; tài khoản có cờ daMuaXu');
const thieu = ctx.muaPhan(dk.token, inp(), 'tron_goi');
kt(thieu.ok === false && dem('mua', 'pheu1') === 2, 'thiếu xu: không ghi mua');
// tài khoản cũ đã mua trước khi có phễu (không có cờ): không bị tính là mua_dau
ctx.dangKy('pheu2', 'matkhau123', 'P2', 'pheu2@vidu.vn', '');
ctx.ttKhoa_(() => { ctx.ttCong_('pheu2', 50, 'thử', 'THU'); ctx.ttCong_('pheu2', -9, 'Mở khóa cũ', 'LSxx'); });
ctx.ttKhoa_(() => { ctx.ttCong_('pheu2', -9, 'Mở khóa mới', 'LSyy'); ctx.skMua_('pheu2', 9, 'thang:2026-11'); });
kt(dem('mua', 'pheu2') === 1 && dem('mua_dau', 'pheu2') === 0, 'tài khoản đã mua từ trước phễu: không tính mua_dau');
ctx.ttKhoa_(() => { ctx.ttCong_('pheu2', -0, 'x', 'ADMIN'); });
ctx.skMua_('pheu2', 0, 'gieo_que');
kt(dem('mua', 'pheu2') === 1, 'mua 0 xu (miễn phí): không ghi');
// toàn quyền không ghi mua
ctx.muaPhan(tokChu, td, 'km_hoi', 'tai_loc');
kt(dem('mua', 'chienpham') === 0, 'chủ sở hữu (toàn quyền): không ghi mua');

// 5. Nạp: nap_dau một lần, nap mỗi lần
const shD = ctx.ttSheet_('DonHang');
shD.appendRow([90000001, 'pheu1', 20000, 20, 'CHO', new Date(), '', 'thucong', '', 'TCC000001']);
shD.appendRow([90000002, 'pheu1', 50000, 55, 'CHO', new Date(), '', 'thucong', '', 'TCC000002']);
ctx.ttGhiNhanDon_(90000001, 'thử', '');
kt(dem('nap', 'pheu1') === 1 && dem('nap_dau', 'pheu1') === 1 && JSON.parse(SK().find(r => r[1] === 'nap_dau')[3]).tien === 20000, 'nạp lần đầu: nap + nap_dau (ghi số tiền)');
ctx.ttGhiNhanDon_(90000001, 'thử', '');
kt(dem('nap', 'pheu1') === 1, 'ghi nhận lại đơn đã trả: không ghi thêm');
ctx.ttGhiNhanDon_(90000002, 'thử', '');
kt(dem('nap', 'pheu1') === 2 && dem('nap_dau', 'pheu1') === 1, 'nạp lần 2: chỉ nap');

// 6. Ghi sự kiện không bao giờ làm hỏng luồng người dùng
const gocSheet = ctx.ttSheet_, gocCache = ctx.CacheService.getScriptCache;
ctx.ttSheet_ = n => { if (n === 'SuKien' || n === 'SoCai') throw new Error('Sheet hỏng'); return gocSheet(n); };
kt(nem(() => ctx.skGhi_('mua', 'x', { xu: 1 })) === null && nem(() => ctx.skMua_('pheu1', 9, 'x')) === null, 'Sheet SuKien lỗi: skGhi_ / skMua_ không ném lỗi');
ctx.ttSheet_ = gocSheet;
ctx.CacheService.getScriptCache = () => { throw new Error('Cache hỏng'); };
kt(nem(() => ctx.skLapLaSo_(true)) === null && nem(() => ctx.skXa_()) === null, 'Cache lỗi: skLapLaSo_ / skXa_ không ném lỗi');
ctx.CacheService.getScriptCache = gocCache;

// 7. qtPheu: chỉ chủ sở hữu; số theo ngày, tổng, tỷ lệ, quà chưa nạp
kt(/đăng nhập/.test(nem(() => ctx.qtPheu('', 7)) || ''), 'qtPheu: khách bị chặn');
kt(/Chỉ chủ sở hữu/.test(nem(() => ctx.qtPheu(dk.token, 7)) || ''), 'qtPheu: thành viên bị chặn');
ctx.skLapLaSo_(false);   // 1 lượt còn trong bộ đệm → qtPheu tự dồn
const P = ctx.qtPheu(tokChu);
kt(P.soNgay === 7 && P.ngay.length === 7 && P.den === homNay && P.ngay[6].ngay === homNay, 'mặc định 7 ngày, ngày cuối là hôm nay');
kt(ctx.qtPheu(tokChu, 100).ngay.length === 60 && ctx.qtPheu(tokChu, 0).ngay.length === 7 && ctx.qtPheu(tokChu, 'abc').ngay.length === 7 && ctx.qtPheu(tokChu, 1).ngay.length === 1, 'soNgay: tối đa 60, sai/0 → 7');
const h = P.ngay[6], khach = dem('lap_la_so', '(khách)') - 4;   // trừ 4 lượt ghi cho ngày 2026-01-01
kt(h.lapLaSoKhach === khach && h.lapLaSoTK === 2, 'hôm nay: lập lá số khách ' + h.lapLaSoKhach + ' (cần ' + khach + '), tài khoản ' + h.lapLaSoTK);
kt(h.dangKy === 2 && h.xacThucEmail === 1 && h.muaDau === 1 && h.mua === 3 && h.xuMua === 9 + ctx.ttBangGia_().phan.phoi_ngau.xu + 9 && h.napDau === 1 && h.nap === 2 && h.tienNap === 70000,
  'hôm nay: đăng ký 2, xác thực 1, mua đầu 1, mua 3, nạp đầu 1, nạp 2 (' + JSON.stringify(h) + ')');
kt(P.tong.dangKy === h.dangKy && P.tong.nap === 2, 'tổng = cộng các ngày');
kt(!P.ngay.some(o => o.ngay === '2026-01-01') || P.ngay.find(o => o.ngay === '2026-01-01').lapLaSoKhach === 4, 'dòng ngoài khoảng ngày không bị tính');
kt(P.tyLe.xacThucTrenDangKy === 50 && P.tyLe.muaDauTrenXacThuc === 100 && P.tyLe.napDauTrenMuaDau === 100 && P.tyLe.napDauTrenDangKy === 50 &&
  P.tyLe.dangKyTrenKhach === Math.round(2 / khach * 1000) / 10, 'tỷ lệ chuyển đổi (%) ' + JSON.stringify(P.tyLe));
kt(ctx.skTyLe_(1, 0) === null, 'mẫu số 0 → null');
// quà 39 xu đã tiêu mà chưa nạp: pheu1 đã nạp → không tính; pheu4 nhận quà, tiêu, chưa nạp → tính
kt(P.quaChuaNap.soTK === 0, 'chưa ai tiêu quà mà chưa nạp (pheu1 đã nạp)');
const t4 = ctx.dangKy('pheu4', 'matkhau123', 'P4', 'pheu4@vidu.vn', '').token;
ctx.guiMaEmail(t4, 'pheu4@vidu.vn'); ctx.xacThucEmail(t4, String(thu[thu.length - 1].body).match(/(\d{6})/)[1]);
const t5 = ctx.dangKy('pheu5', 'matkhau123', 'P5', 'pheu5@vidu.vn', '').token;
ctx.guiMaEmail(t5, 'pheu5@vidu.vn'); ctx.xacThucEmail(t5, String(thu[thu.length - 1].body).match(/(\d{6})/)[1]);
kt(ctx.qtPheu(tokChu).quaChuaNap.soTK === 0, 'nhận quà nhưng chưa tiêu: không tính');
ctx.muaPhan(t4, td, 'km_hoi', 'cong_viec');
for (const l of ['tai_loc', 'tinh_cam', 'di_xa']) ctx.muaPhan(t5, td, 'km_hoi', l);
const Q = ctx.qtPheu(tokChu).quaChuaNap;
kt(Q.soTK === 2 && Q.hetQua === 0, 'đã tiêu quà, chưa nạp: 2 tài khoản, chưa ai hết quà (' + JSON.stringify(Q) + ')');
ctx.muaPhan(t5, td, 'km_hoi', 'suc_khoe');   // 39 - 36 = 3 xu < 9
kt(ctx.qtPheu(tokChu).quaChuaNap.hetQua === 1, 'tiêu gần hết quà (còn dưới 9 xu): hetQua = 1');
ctx.ttKhoa_(() => ctx.ttCong_('pheu4', -5, 'Trừ/hoàn: thử (bởi chienpham)', 'ADMIN'));
kt(ctx.qtPheu(tokChu).quaChuaNap.soTK === 2, 'điều chỉnh của Quản trị không tính là tiêu');

console.log('Phễu bán hàng: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
