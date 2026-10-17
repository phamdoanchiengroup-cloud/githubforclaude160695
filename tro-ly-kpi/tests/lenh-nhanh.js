/**
 * Kiểm thử LenhNhanh.gs: câu hỏi tự nhiên trả lời từ số liệu, KHÔNG gọi AI; câu cần suy luận vẫn sang AI;
 * câu tự thêm trong tab LenhNhanh; nối vào Zalo, web app và tab Giọng nói.
 * Chạy: node tests/lenh-nhanh.js
 */
const assert = require('assert');
const { taoMoiTruong } = require('./gia-lap.js');

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const txt = t => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }] });

const M = taoMoiTruong();
const them = (ten, rows) => { M.kpi.insertSheet(ten).rows = rows; };
// Hôm nay (giả lập) = CN 11/10/2026 → hôm qua 10/10, hôm kia 9/10
them('PhongBan', [['MaXuong', 'TenXuong', 'TrangThai'], ['CNC', 'Xưởng CNC', 'Đang dùng'], ['NG', 'Xưởng Ngọn', 'Đang dùng'], ['CAN', 'Xưởng Cán', 'Đang dùng']]);
them('CongDoan', [['MaCD', 'TenCD', 'MaXuong'], ['CNC-TIP', 'Tip', 'CNC'], ['NG-NH', 'Chà nhám', 'NG'], ['CAN-SON', 'Sơn', 'CAN']]);
them('DinhMuc', [['MaCD', 'DinhMucGio'], ['CNC-TIP', 20], ['NG-NH', 10], ['CAN-SON', 10]]);
them('DanhMucLoi', [['MaLoi', 'TenLoi'], ['L1', 'Nứt đầu'], ['L2', 'Sơn chảy']]);
them('NhanSu', [['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'SoCCCD', 'TrangThai'],
  ['C1', 'Nguyễn Văn An', 'CNC', 'Công nhân', '0010', 'Đang làm'], ['N1', 'Trần Thị Bình', 'NG', 'Công nhân', '0011', 'Đang làm'],
  ['K1', 'Lê Văn Cần', 'CAN', 'Công nhân', '0012', 'Đang làm'], ['K2', 'Phạm Minh Đức', 'CAN', 'Công nhân', '0013', 'Đang làm']]);
const nk = [['MaDong', 'Ngay', 'MaNV', 'MaCD', 'GioLam', 'SoLuongLamRa', 'GioDung', 'LyDoDung', 'TrangThai']];
['2026-10-09', '2026-10-10'].forEach((d, i) => {
  nk.push(['a' + i, d, 'C1', 'CNC-TIP', 8, 160, 0, '', 'Đã chốt']);
  nk.push(['b' + i, d, 'N1', 'NG-NH', 8, 60, 2, 'Chờ vật tư', 'Đã chốt']);
  nk.push(['c' + i, d, 'K1', 'CAN-SON', 8, 85, 0.5, 'Hỏng máy', 'Đã chốt']);
  nk.push(['d' + i, d, 'K2', 'CAN-SON', 8, 80, 0, '', 'Đã chốt']);
});
nk.push(['e', '2026-10-10', 'N1', 'NG-NH', 1, 5, 0, '', 'Chờ duyệt'], ['f', '2026-10-08', 'K2', 'CAN-SON', 1, 5, 0, '', 'Chờ duyệt']);
them('NhatKySanXuat', nk);
them('XacNhanDiemDanh', [['Ngay', 'MaXuong'], ['2026-10-09', 'CNC'], ['2026-10-09', 'NG'], ['2026-10-09', 'CAN'], ['2026-10-10', 'CNC'], ['2026-10-10', 'CAN']]);
them('PhieuKCS', [['MaPhieu', 'Ngay', 'MaNV', 'MaCD', 'SoLuongKhongDat', 'MaLoi'], ['q1', '2026-10-10', 'N1', 'NG-NH', 6, 'L1'], ['q2', '2026-10-10', 'K1', 'CAN-SON', 2, 'L2']]);
them('DiemDanhNghi', [['MaDD', 'Ngay', 'MaNV', 'MaXuong', 'LyDo', 'KyHieu'], ['n1', '2026-10-11', 'K2', 'CAN', 'Phép', 'P'], ['n2', '2026-10-11', 'N1', 'NG', '', '0.5x']]);
them('MayMoc', [['MaMay', 'TenMay', 'MaXuong', 'TinhTrang', 'BaoTriKeTiep'], ['M1', 'Máy tiện 1', 'CNC', 'Đang chạy', '2026-10-09'], ['M2', 'Máy sơn', 'CAN', 'Đang chạy', '2026-12-01']]);
Object.assign(M.store, { ZALO_TOKEN: 'TOK', WEBHOOK_KEY: 'k123456789', CHU_CHAT_ID: 'u1', ANTHROPIC_API_KEY: 'sk-test', WEBAPP_URL: 'https://script.google.com/macros/s/ABC/exec' });
M.ctx.caiDatAgent();
M.ctx.caiDatWebApp();
const K = M.store.UI_KEY, L = q => M.ctx.lenhNhanh_(q), soAI = () => M.ai.yeuCau.length;
const ai0 = soAI();

// ---------- hiệu suất / xếp hạng ----------
let r = L('hôm qua xưởng nào thấp nhất?');
ok(/^Sản xuất hôm qua \(Thứ Bảy 10\/10\): cao nhất là Xưởng Cán 102%, thấp nhất là Xưởng Ngọn 68%\. Toàn nhà máy 93%\.$/m.test(r), 'xếp hạng hôm qua: ' + r.split('\n')[0]);
ok(/1\. Xưởng Cán: 102% · 2 người · dừng 0,5h\n2\. Xưởng CNC: 100%[\s\S]*3\. Xưởng Ngọn: 68%[\s\S]*Còn 1 dòng chờ duyệt/.test(r) && /miễn phí/.test(r), 'danh sách xưởng + ghi chú miễn phí');
r = L('Hiệu suất toàn nhà máy tuần này thế nào');
ok(/^Hiệu suất toàn nhà máy 7 ngày qua \(4\/10 → 10\/10\) là 94%, 4 người làm, máy dừng 5h\./.test(r), 'cả nhà máy 7 ngày: ' + r.split('\n')[0]);
r = L('trợ lý ơi, hiệu suất xưởng Ngọn hôm kia');
ok(/^Xưởng Ngọn hôm kia \(Thứ Sáu 09\/10\): hiệu suất 75%, 1 người, máy dừng 2h\./.test(r), 'một xưởng, bỏ từ gọi: ' + r.split('\n')[0]);
ok(/Xưởng Cán hôm qua/.test(L('xưởng Cán hôm qua')), 'chỉ nêu xưởng + thời gian → hiệu suất xưởng');
ok(/Xưởng Cán/.test(L('hiệu suất tổ cán 7 ngày qua')) && /Xưởng Ngọn/.test(L('hieu suat xuong ngon hom qua')), 'gõ "tổ", gõ không dấu');
ok(/^Hiệu suất toàn nhà máy hôm qua/.test(L('tôi cần biết hiệu suất hôm qua')), '"cần" không bị hiểu nhầm là mã xưởng CAN');
r = L('hiệu suất Trần Thị Bình hôm qua');
ok(/^Trần Thị Bình \(Xưởng Ngọn\) hôm qua .*: hiệu suất 68%, 1 ngày công, 60 sản phẩm, 6 lỗi KCS, dừng 2h\.\n/.test(r), 'theo người: ' + r.split('\n')[0]);
ok(/^Nguyễn Văn An/.test(L('năng suất văn an tháng này')), 'gọi 2 chữ cuối tên');
ok(/^Xưởng CNC Thứ Bảy 10\/10: hiệu suất 100%, 1 người\. Ngang/.test(L('hiệu suất CNC 10/10')), 'mã xưởng + ngày dd/mm, không nêu dừng 0h');
ok(/Xưởng Cán .*tháng 10 \(1\/10 → 11\/10\)/.test(L('hiệu suất xưởng cán tháng này')) && /tháng 9 \(1\/9 → 30\/9\)/.test(L('hiệu suất tháng trước')), 'tháng này / tháng trước');

// ---------- các chủ đề khác ----------
r = L('dừng máy tuần này');
ok(/^Máy dừng tổng cộng 5h 7 ngày qua .*nhiều nhất do Chờ vật tư \(4h\), tiếp theo là Hỏng máy \(1h\)/.test(r), 'dừng máy: ' + r.split('\n')[0]);
ok(/^Xưởng Cán dừng tổng cộng 0,5h hôm qua/.test(L('xưởng Cán dừng máy hôm qua')), 'dừng máy một xưởng');
r = L('hôm nay ai nghỉ');
ok(/^Có 1 người nghỉ hôm nay .*gồm Phép 1\. 1 người đi muộn hoặc làm nửa ngày\./.test(r), 'nghỉ hôm nay: ' + r);
ok(/^Chưa có ai báo nghỉ hôm qua .* – có thể các xưởng chưa điểm danh\.\n/.test(L('hôm qua có ai vắng không')), 'không ai nghỉ');
r = L('lỗi KCS hôm qua');
ok(/^KCS ghi nhận 8 sản phẩm không đạt hôm qua .*lỗi nhiều nhất là Nứt đầu \(6\)/.test(r) && /Ngọn 6, Cán 2/.test(r), 'KCS: ' + r);
ok(/^Còn 2 dòng sản lượng chờ duyệt 10 ngày qua .*cũ nhất từ ngày 8 tháng 10/.test(L('còn bao nhiêu dòng chờ duyệt?')), 'chờ duyệt');
ok(/còn 1 xưởng chưa xác nhận điểm danh: Xưởng Ngọn/.test(L('xưởng nào chưa điểm danh hôm qua')), 'điểm danh');
ok(/^Có 1 máy cần bảo trì .*1 máy đã quá hạn[\s\S]*M1 Máy tiện 1/.test(L('máy nào sắp bảo trì')), 'bảo trì');
M.ctx.CalendarApp.getDefaultCalendar().createEvent('Họp giao ban', new Date('2026-10-11T08:30:00+07:00'), new Date('2026-10-11T09:00:00+07:00'), { location: 'Phòng họp 2' });
ok(L('lịch hôm nay') === 'Lịch hôm nay có 1 việc: 8 giờ 30 Họp giao ban tại Phòng họp 2.', 'lịch hôm nay: ' + L('lịch hôm nay'));
ok(/trống/.test(L('lịch ngày mai')), 'lịch ngày mai trống');
ok(/^Bây giờ là 7 giờ đúng, chủ nhật, ngày 11 tháng 10 năm 2026\.$/.test(L('mấy giờ rồi')), 'mấy giờ: ' + L('mấy giờ rồi'));
ok(/không tốn tiền AI/.test(L('lệnh')), 'danh sách lệnh');
ok(soAI() === ai0, 'tất cả ở trên không gọi AI');

// ---------- câu cần suy luận / không phải lệnh → AI ----------
['vì sao xưởng Ngọn thấp hôm qua', 'phân tích dừng máy tuần này', 'viết bài tuyển dụng CNC', 'làm slide báo cáo sản xuất tháng 9',
  'đặt lịch họp với anh Công', 'tìm nhà cung cấp ống carbon', '@sx hiệu suất hôm qua', 'bạn nghĩ sao về kế hoạch này', 'chào bạn'
].forEach(q => ok(L(q) === '', 'chuyển AI: ' + q));

// ---------- câu tự thêm (tab LenhNhanh) ----------
const url = M.ctx.caiDatLenhNhanh();
ok(/docs|agent/.test(url) || url, 'tạo tab LenhNhanh');
const ag = M.files[M.store.AGENT_SHEET_ID].getSheetByName('LenhNhanh');
ok(ag.rows[0].join('|') === 'CachGoi|TraLoi|GhiChu' && ag.rows.length === 5, 'tab có tiêu đề + 4 dòng mẫu');
ag.rows.push(['wifi xưởng; mật khẩu wifi', 'Tên: XUONG-CNC (hỏi bảo vệ)', ''], ['Ngọn hôm qua', '=hiệu suất xưởng Ngọn hôm qua', ''], ['vòng', '=vòng', '']);
M.ctx.CacheService.getScriptCache().remove('lenhNhanh');
ok(L('Mật khẩu wifi?') === 'Tên: XUONG-CNC (hỏi bảo vệ)', 'câu trả lời cố định');
ok(/^Xưởng Ngọn hôm qua/.test(L('ngọn hôm qua')), '"=" chạy câu lệnh khác');
ok(/BẢN TIN SẢN XUẤT/.test(L('chào buổi sáng')) && /TỔNG KẾT 7 NGÀY/.test(L('tổng kết tuần')), '"=bc", "=tuần"');
ok(L('vòng') === '', 'không gọi vòng');
M.ctx.caiDatLenhNhanh();
ok(ag.rows.length === 8, 'chạy lại không ghi đè');

// ---------- nối vào Zalo / web / giọng nói ----------
const post = (text, id) => M.ctx.doPost({ parameter: { k: 'k123456789' }, postData: { contents: JSON.stringify({ result: { message: { chat: { id: 'u1' }, text, message_id: id } } }) } });
post('Hôm qua xưởng nào thấp nhất?', 'z1');
ok(/thấp nhất là Xưởng Ngọn/.test(M.gui[M.gui.length - 1].text), 'Zalo: trả lời bằng lệnh sẵn');
ok(/thấp nhất là Xưởng Ngọn/.test(M.ctx.uiHoi(K, '', 'hôm qua xưởng nào thấp nhất')), 'web: ô Trò chuyện');
const v = M.ctx.uiNoi(K, 'Trợ lý ơi, dừng máy tuần này');
ok(/^Máy dừng tổng cộng 5h/.test(v.noi) && !/\n/.test(v.noi) && /Chờ vật tư: 4h/.test(v.chu), 'giọng nói: đọc câu đầu, chi tiết trên màn hình');
ok(soAI() === ai0, 'Zalo/web/giọng nói không gọi AI');
M.ai.kich.push(txt('Do chờ vật tư.'));
ok(M.ctx.uiHoi(K, 'san_xuat', 'vì sao xưởng Ngọn thấp hôm qua').endsWith('Do chờ vật tư.') && soAI() === ai0 + 1, 'câu "vì sao" vẫn hỏi AI');
ok(/lệnh – các câu hỏi miễn phí/.test(M.ctx.HUONG_DAN), 'hướng dẫn Zalo có lệnh');

ok(M.ai.kich.length === 0 && M.ai.loiKich.length === 0, 'giả lập AI: dùng hết, không lỗi bị nuốt');
console.log('✓ lenh-nhanh: ' + n + ' kiểm tra đạt');
