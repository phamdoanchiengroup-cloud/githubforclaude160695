/** Kiểm thử bán theo giai đoạn: đại vận / vận năm / tháng / Đồng hành / Trọn đời / gói gia đình và phần cắt ở máy chủ. Chạy: node tests/giai-doan.js */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
const dk = ctx.dangKy('khachgd', 'matkhau123', 'Khách GĐ', '0912345678', '');
const tok = dk.token; kt(tok, 'đăng ký có token');
ctx.ttKhoa_(() => ctx.ttCong_('khachgd', 1000, 'test', ''));
const vy = new Date().getFullYear();
const inp = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 5, month: 6, year: 1990, hour: 8, minute: 0, viewYear: vy, place: '21.03|105.85|Hà Nội', tz: '7' };
let r = ctx.lapLaSo(inp, tok);
kt(r.khach && r.canMo && r.moi && r.moi.daiVan.length === 12, 'chưa mở: bản rút gọn có mồi 12 đại vận');
kt(!JSON.stringify(r).includes('"secs"'), 'bản rút gọn không lộ lời luận');
try { ctx.muaPhan(tok, inp, 'nam', vy); kt(false, 'mua năm khi chưa có Bản mở phải lỗi'); } catch (e) { kt(/Bản mở/.test(e.message), 'yêu cầu Bản mở trước'); }
let m = ctx.muaPhan(tok, inp, 'co_ban'); kt(m.ok && m.gia === 49, 'mua Bản mở 49');
r = ctx.lapLaSo(inp, tok);
const nowDv = r.chiTiet.daiVan.filter(d => d.isNow)[0];
kt(!r.khach && r.chiTiet.daiVan.every(d => d.khoa && d.secs.length === 0), 'Bản mở: 12 đại vận đều khóa, không có lời luận');
kt(r.vanTom && r.vanTom.coNam === false && r.chiTiet.nguyetVan.length === 0 && r.chiTiet.tieuVan.khoa, 'Bản mở: vận năm khóa');
kt(r.chiTiet.nhatVan.length === 0 && r.vanTom.coThang === false, 'Bản mở: nhật vận khóa');
kt(r.moRong.tongHop.thang.every(t => t.khoa && t.tv === undefined), '12 tháng chỉ còn điểm');
kt(r.battuChiTiet.luuNien.length === 0, 'lưu niên Bát Tự khóa');
const bdNow = +String(nowDv.nam).slice(0, 4);
m = ctx.muaPhan(tok, inp, 'dai_van', bdNow); kt(m.ok && m.gia === 19, 'mua đại vận hiện tại 19');
const past = r.chiTiet.daiVan.filter(d => +String(d.nam).slice(0, 4) + 9 < vy)[0];
m = ctx.muaPhan(tok, inp, 'dai_van', +String(past.nam).slice(0, 4)); kt(m.ok && m.gia === 9, 'đại vận đã qua giá kiểm chứng 9');
m = ctx.muaPhan(tok, inp, 'dai_van', bdNow); kt(m.daCo, 'mua lại → đã có, không trừ');
r = ctx.lapLaSo(inp, tok);
kt(r.chiTiet.daiVan.filter(d => !d.khoa).length === 2, 'đúng 2 đại vận mở');
kt(r.chiTiet.daiVan.filter(d => !d.khoa).every(d => d.secs.length > 0), 'vận đã mở có lời luận');
m = ctx.muaPhan(tok, inp, 'nam', vy); kt(m.ok && m.gia === 29, 'mua vận năm 29');
r = ctx.lapLaSo(inp, tok);
kt(r.vanTom.coNam && r.chiTiet.nguyetVan.length === 12 && !r.chiTiet.tieuVan.khoa, 'vận năm mở: 12 nguyệt vận + tiểu vận');
kt(r.battuChiTiet.luuNien.length === 1 && r.battuChiTiet.luuNien[0].nam === vy, 'lưu niên Bát Tự chỉ năm đã mua');
kt(r.vanTom.coThang === false, 'nhật vận vẫn khóa sau khi mua năm');
m = ctx.muaPhan(tok, inp, 'dong_hanh', vy); kt(m.ok && m.gia === 79 - 29, 'Đồng hành trừ phần năm đã mua (50)');
r = ctx.lapLaSo(inp, tok);
kt(r.vanTom.coThang && r.chiTiet.nhatVan.length === 7, 'đồng hành: nhật vận mở');
const iNext = { ...inp, viewYear: vy + 1 }; r = ctx.lapLaSo(iNext, tok);
kt(r.vanTom.coNam === false, 'năm sau vẫn phải mua riêng (thu định kỳ)');
m = ctx.muaPhan(tok, inp, 'thang', (vy + 1) + '-3'); kt(m.ok && m.gia === 9, 'mua tháng lẻ 9');
try { ctx.muaPhan(tok, inp, 'thang', 'abc'); kt(false, 'tháng sai phải lỗi'); } catch (e) { kt(/Tháng/.test(e.message), 'kiểm tra định dạng tháng'); }
m = ctx.muaPhan(tok, inp, 'tron_goi'); kt(m.ok && m.gia === 149 - 49, 'Trọn đời trừ Bản mở đã mua (100)');
r = ctx.lapLaSo(inp, tok);
kt(r.chiTiet.daiVan.every(d => !d.khoa), 'Trọn đời: mở cả 12 đại vận');
kt(r.quyen.bien_co && r.quyen.phoi_ngau && r.quyen.do_gio, 'Trọn đời gồm biến cố, phối ngẫu, dò giờ');
// Gói gia đình
m = ctx.muaPhan(tok, null, 'gia_dinh_3'); kt(m.ok && m.gia === 129 && m.soVe === 3, 'mua gói gia đình 3 → 3 lượt');
const me = { name: 'Trần Thị Mẹ', gender: 'nu', calendar: 'duong', day: 2, month: 3, year: 1965, hour: 6, minute: 0, viewYear: vy, place: '21.03|105.85|Hà Nội', tz: '7' };
r = ctx.lapLaSo(me, tok); kt(r.khach && r.canMo && r.soVe === 3, 'lá số người nhà: chưa mở, thấy 3 lượt');
m = ctx.dungLuotGiaDinh(tok, me); kt(m.ok && m.soVe === 2, 'dùng 1 lượt → còn 2');
r = ctx.lapLaSo(me, tok); kt(!r.khach && r.vanTom.coNam && r.chiTiet.daiVan.every(d => d.khoa), 'lượt gia đình: Bản mở + vận năm, đại vận vẫn bán riêng');
m = ctx.dungLuotGiaDinh(tok, me); kt(m.daCo && m.soVe === 2, 'dùng lại cho cùng lá số không mất lượt');
const soDu = ctx.ttSoDu_('khachgd'); kt(soDu === 1000 - 49 - 19 - 9 - 29 - 50 - 9 - 100 - 129, 'số dư khớp sổ cái (' + soDu + ')');
// Khách chưa đăng nhập
r = ctx.lapLaSo(inp, ''); kt(r.khach && !r.canMo && r.moi && r.moi.thang.length === 12, 'khách: có mồi vận hạn');
console.log('Đạt', ok, '/', ok + sai);
