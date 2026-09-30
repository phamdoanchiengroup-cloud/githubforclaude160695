/** Tiện ích bán lẻ: xem tuổi, phong thủy, chọn ngày, gieo quẻ, hợp tác, đặt tên, bản tin – công thức & mở khóa. Chạy: node tests/tien-ich.js */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
// Công thức cổ: đối chiếu vài giá trị tra tay
kt(ctx.tiXetNam_(1990, 6, false, 2026).kimLau === 'Kim Lâu Thân', 'Kim Lâu: 37 tuổi mụ chia 9 dư 1');
kt(ctx.tiHoangOc_(37)[0] === 'Tứ Tấn Tài' && ctx.tiHoangOc_(34)[0] === 'Nhất Cát' && ctx.tiHoangOc_(60)[0] === 'Lục Hoang Ốc' && ctx.tiHoangOc_(70)[0] === 'Nhất Cát', 'Hoang Ốc: đếm theo hàng chục + số lẻ');
kt(JSON.stringify(ctx.tiTamTai_(6)) === '[8,9,10]' && JSON.stringify(ctx.tiTamTai_(0)) === '[2,3,4]' && JSON.stringify(ctx.tiTamTai_(1)) === '[11,0,1]' && JSON.stringify(ctx.tiTamTai_(3)) === '[5,6,7]', 'Tam Tai theo nhóm tam hợp');
const CP = [[1990, 1, 'Khảm'], [1990, 0, 'Cấn'], [2000, 1, 'Ly'], [2000, 0, 'Càn'], [1985, 1, 'Càn'], [1985, 0, 'Ly'], [1995, 1, 'Khôn'], [1995, 0, 'Khảm'], [1986, 1, 'Khôn'], [1986, 0, 'Khảm']];
CP.forEach(c => kt(ctx.tiCungPhi_(c[0], !!c[1]) === c[2], 'Cung phi ' + c[0] + (c[1] ? ' nam' : ' nữ') + ' = ' + c[2] + ' (được ' + ctx.tiCungPhi_(c[0], !!c[1]) + ')'));
Object.keys(ctx.TI_BT).forEach(q => { const h = ctx.TI_BT[q]; kt(new Set(h).size === 8, 'Bát trạch ' + q + ': đủ 8 hướng khác nhau');
  const dong = ['Khảm', 'Ly', 'Chấn', 'Tốn'].indexOf(q) >= 0, nhom = dong ? ['Đông', 'Đông Nam', 'Nam', 'Bắc'] : ['Tây', 'Tây Bắc', 'Tây Nam', 'Đông Bắc'];
  kt(h.slice(0, 4).every(x => nhom.indexOf(x) >= 0), 'Bát trạch ' + q + ': 4 hướng tốt thuộc ' + (dong ? 'Đông' : 'Tây') + ' tứ trạch'); });
// Gieo quẻ: 64 quẻ đủ, lập quẻ ổn định
kt(ctx.HL_QUE.length === 64, 'đủ 64 quẻ');
const Q = ctx.tiLapQue_({ y: 2026, m: 9, d: 30, h: 10, mi: 0 }); kt(Q.chu.ten && Q.bien.ten && Q.ho.ten && Q.dong >= 1 && Q.dong <= 6 && Q.the !== undefined, 'lập quẻ Mai hoa có quẻ chủ – hỗ – biến');
// Mở khóa
const inp = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30 };
let r = ctx.tienIch(inp, 'xem_tuoi', {}, ''); kt(!r.mo && !r.bang && r.nay && r.ketLuan, 'xem tuổi miễn phí: chỉ năm nay');
r = ctx.tienIch(inp, 'phong_thuy', {}, ''); kt(!r.mo && !r.huong && r.cungPhi === 'Khảm', 'phong thủy miễn phí: cung phi, chưa có 8 hướng');
r = ctx.tienIch(inp, 'chon_ngay', { viec: 'cuoi', thang: '2026-11' }, ''); kt(!r.mo && !r.ngay && r.dem && r.ma === 'ngay:cuoi:2026-11', 'chọn ngày miễn phí: chỉ số ngày tốt');
const dk = ctx.dangKy('khachti', 'matkhau123', 'Khách TI', '0912000111', ''); const tok = dk.token;
const G = k => ctx.TT_PHAN_MAC_DINH[k].xu, qua0 = ctx.ttSoDu_('khachti');
ctx.ttKhoa_(() => ctx.ttCong_('khachti', 300, 'test', ''));
let m = ctx.muaPhan(tok, inp, 'xem_tuoi'); kt(m.ok && m.gia === G('xem_tuoi'), 'mua xem tuổi ' + G('xem_tuoi') + ' xu');
r = ctx.tienIch(inp, 'xem_tuoi', { muon: 1965 }, tok); kt(r.mo && r.bang.length === 10 && r.muon, 'đã mua: 10 năm + tuổi mượn');
m = ctx.muaPhan(tok, inp, 'chon_ngay', 'cuoi|2026-11'); kt(m.ok && m.gia === G('chon_ngay'), 'mua chọn ngày 1 việc 1 tháng ' + G('chon_ngay') + ' xu');
r = ctx.tienIch(inp, 'chon_ngay', { viec: 'cuoi', thang: '2026-11' }, tok); kt(r.mo && r.ngay.length === 30, 'chọn ngày đã mua: đủ 30 ngày');
r = ctx.tienIch(inp, 'chon_ngay', { viec: 'cuoi', thang: '2026-12' }, tok); kt(!r.mo, 'tháng khác phải mua riêng');
m = ctx.muaPhan(tok, inp, 'chon_ngay', 'cuoi|2026-11'); kt(m.daCo, 'mua lại cùng việc – tháng: đã có');
const nu = { name: 'Trần Thị Mai', gender: 'nu', calendar: 'duong', day: 3, month: 11, year: 1996, hour: 7, minute: 0 };
r = ctx.tienIch({ a: inp, b: nu }, 'hop_tac', {}, tok); kt(!r.mo && r.diem > 0 && !r.dong, 'hợp tác miễn phí: chỉ điểm');
m = ctx.muaPhan(tok, { a: inp, b: nu }, 'hop_tac'); kt(m.ok && m.gia === G('hop_tac'), 'mua hợp tác theo cặp ' + G('hop_tac') + ' xu');
r = ctx.tienIch({ a: inp, b: nu }, 'hop_tac', {}, tok); kt(r.mo && r.dong.length && r.vaiTro.length === 2, 'hợp tác đã mua: chi tiết + vai trò');
const con = { name: '', gender: 'nu', calendar: 'duong', day: 10, month: 3, year: 2027, hour: 9, minute: 0 };
r = ctx.tienIch(con, 'dat_ten', { ho: 'Nguyễn Thị', ten: ['Hà', 'Ngọc'] }, tok); kt(!r.mo && r.cham.length === 1 && !r.goiY, 'đặt tên miễn phí: chấm 1 tên');
m = ctx.muaPhan(tok, con, 'dat_ten'); kt(m.ok && m.gia === G('dat_ten'), 'mua đặt tên ' + G('dat_ten') + ' xu');
r = ctx.tienIch(con, 'dat_ten', { ho: 'Nguyễn Thị', ten: ['Hà', 'Ngọc'] }, tok); kt(r.mo && r.cham.length === 2 && r.goiY.length > 5 && r.cham[0].ten === 'Hà', 'đặt tên đã mua: chấm nhiều tên + gợi ý, tên hợp dụng thần xếp trên');
// Gieo quẻ: câu đầu miễn phí, câu sau 9 xu
let g = ctx.gieoQue('Tôi có nên nhận công việc mới không?', 'cong_viec', tok); kt(g.ok && g.mienPhi && g.gia === 0 && g.luan.length >= 4, 'gieo quẻ câu đầu miễn phí');
const du0 = ctx.ttSoDu_('khachti');
g = ctx.gieoQue('Việc mua nhà năm nay có thuận không?', 'tai_loc', tok); kt(g.ok && g.gia === 9 && ctx.ttSoDu_('khachti') === du0 - 9, 'câu thứ hai trừ 9 xu');
kt(ctx.dsGieoQue(tok).length === 2, 'lưu lịch sử câu hỏi');
try { ctx.muaPhan(tok, inp, 'gieo_que'); kt(false, 'gieo_que không mua qua muaPhan'); } catch (e) { kt(true, 'gieo_que chỉ mua trong công cụ'); }
// Bản tin
let b = ctx.dangKyBanTin(inp, 'an@example.com', tok); kt(b.ok && b.gia === G('ban_tin') && /^\d{4}-\d{2}-\d{2}$/.test(b.hanDen), 'đăng ký bản tin ' + G('ban_tin') + ' xu / 12 tháng');
kt(ctx.dsBanTin(tok).length === 1, 'danh sách bản tin của tôi');
const html = ctx.tiBanTinHtml_(Object.assign({}, inp), 2026, 11); kt(/Vận tháng 11\/2026/.test(html) && /Ngày tốt/.test(html), 'nội dung email bản tin');
kt(ctx.ttSoDu_('khachti') === qua0 + 300 - G('xem_tuoi') - G('chon_ngay') - G('hop_tac') - G('dat_ten') - G('gieo_que') - G('ban_tin'), 'số dư khớp (' + ctx.ttSoDu_('khachti') + ')');
// Trọn đời gồm xem tuổi & phong thủy
kt(ctx.TT_TRON_GOI.indexOf('xem_tuoi') >= 0 && ctx.TT_TRON_GOI.indexOf('phong_thuy') >= 0, 'Trọn đời gồm xem tuổi, phong thủy');
console.log('Tiện ích: đạt ' + ok + '/' + (ok + sai));
