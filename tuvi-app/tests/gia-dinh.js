/**
 * Kiểm thử tab Gia đình (GiaDinh.gs): mọi thành viên đăng nhập có danh sách riêng (trang tính GiaDinh),
 * chủ sở hữu có danh sách mặc định 4 người, chuẩn hóa dữ liệu, bảng vận năm (cột Phi Tinh chỉ chủ sở hữu).
 * Chạy: node tests/gia-dinh.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
const tokChu = 'gia-dinh-kiem-thu-token-chu-01';
ctx.CacheService.getScriptCache().put('SS_' + tokChu, JSON.stringify({ ten: 'chienpham' }));
const dk = ctx.dangKy('giadinhthu', 'matkhau123', 'Thử', '0912000999', ''), tokTV = dk.token;
let bi = false; try { ctx.giaDinhDs('khong-hop-le'); } catch (e) { bi = true; }
kt(bi, 'chưa đăng nhập bị chặn');
// Chủ sở hữu: danh sách mặc định
const M = ctx.giaDinhDs(tokChu).ds;
kt(M.length === 4 && M[0].quanHe === 'Bản thân' && M[2].quanHe === 'Con gái', 'chủ sở hữu có 4 người mặc định');
const con = M[2].input, tvCon = ctx.tuviLapLaSo(Object.assign({ viewYear: 2026 }, con));
kt(con.lateRat === true && tvCon.info.lunar.day === 8 && tvCon.info.lunar.month === 7 && ctx.CHI[tvCon.info.menh] === 'Thân', 'con gái: giờ Tý muộn 22/8/2023 → âm 8/7, Mệnh Thân');
[['Bản thân', 'Mão', 9], ['Vợ', 'Dậu', 7], ['Em gái', 'Mùi', 3]].forEach(([q, menh, ln]) => {
  const p = M.find(x => x.quanHe === q), tv = ctx.tuviLapLaSo(Object.assign({ viewYear: 2026 }, p.input));
  kt(ctx.CHI[tv.info.menh] === menh && ctx.ptNguyenCuc_(tv).ln === ln, q + ' khớp Mệnh/Lai Nhân cohoc');
});
// Thành viên thường: rỗng, lưu riêng
kt(ctx.giaDinhDs(tokTV).ds.length === 0, 'thành viên mới: danh sách rỗng');
const mau = [
  { ten: 'Mẫu A', quanHe: 'Bản thân', input: { gender: 'nam', calendar: 'am', day: 3, month: 4, year: 1990, hour: 9, minute: 0 } },
  { ten: '', quanHe: 'Con gái', input: { gender: 'nu', calendar: 'am', day: 1, month: 1, year: 2020, hour: 25, minute: 99 } },
  { ten: 'Lạ', quanHe: 'không có', input: { calendar: 'am', day: 5, month: 6, year: 2001 } }];
const r = ctx.giaDinhLuu(mau, tokTV).ds;
kt(r.length === 3 && r[1].ten === 'Con gái' && r[1].input.hour === 0 && r[2].quanHe === 'Khác' && r[0].input.lateRat === true, 'chuẩn hóa: tên trống lấy quan hệ, giờ sai về 0, quan hệ lạ → Khác, Tý muộn mặc định chuyển ngày');
kt(ctx.giaDinhDs(tokTV).ds.length === 3 && ctx.giaDinhDs(tokChu).ds.length === 4, 'danh sách hai tài khoản tách biệt');
ctx.giaDinhLuu(mau.slice(0, 2), tokTV);
kt(ctx.giaDinhDs(tokTV).ds.length === 2, 'lưu lại ghi đè đúng dòng');
bi = false; try { ctx.giaDinhLuu([{ ten: 'X', input: { day: 1, month: 1 } }], tokTV); } catch (e) { bi = true; }
kt(bi && ctx.giaDinhDs(tokTV).ds.length === 2, 'thiếu năm sinh bị từ chối, không mất danh sách cũ');
const Vc = ctx.giaDinhVanNam(2026, tokChu), Vt = ctx.giaDinhVanNam(2026, tokTV);
kt(Vc.canChi === 'Bính Ngọ' && Vc.phiTinh === true && Vc.ds.length === 4 && Vc.ds.every(x => !x.loi && x.phiTinh && x.batTu), 'chủ sở hữu: có cột Phi Tinh, 4 dòng đủ');
kt(Vt.phiTinh === false && Vt.ds.every(x => !x.loi && !x.phiTinh && x.batTu && x.tuoi > 0), 'thành viên: không có Phi Tinh, có Bát Tự');
kt(Vt.ds[0].tuoi === 2026 - 1990 + 1, 'tuổi mụ đúng');

// Quan hệ gia đình (1/11): luận đúng vai, không có mục kết hôn / sinh con cho cặp không phải vợ chồng
const L = (a, b) => ctx.gdLoaiCap_(a, b);
kt(L('Bản thân', 'Con gái').loai === 'cm' && L('Bản thân', 'Con gái').tren === 0 && L('Bản thân', 'Mẹ').loai === 'cm' && L('Bản thân', 'Mẹ').tren === 1 && L('Con trai', 'Mẹ').loai === 'ob', 'cha mẹ – con, đúng chiều bề trên');
kt(L('Vợ', 'Bản thân').loai === 'vc' && L('Cha', 'Mẹ').loai === 'vc' && L('Cha', 'Cha').loai !== 'vc', 'vợ chồng (cả cha – mẹ)');
kt(L('Con gái', 'Con trai').loai === 'ae' && L('Anh', 'Bản thân').loai === 'ae' && L('Cha', 'Con gái').loai === 'ob' && L('Mẹ', 'Vợ').loai === 'dau' && L('Em gái', 'Con gái').loai === 'tren' && L('Bạn bè', 'Bản thân').loai === 'chung', 'anh em, ông bà – cháu, dâu rể, cô – cháu, người ngoài');
const ids = M.map(x => x.id);
kt(ids.join() === 'gdmd1,gdmd2,gdmd3,gdmd4', 'danh sách mặc định có id cố định');
const Q2 = ctx.giaDinhQuanHe([ids[0], ids[2]], tokChu), c2 = Q2.cap[0];
kt(Q2.cap.length === 1 && !Q2.nhom && c2.loai === 'cm' && c2.capDoi === false && c2.diem >= 0 && c2.diem <= 10, 'cha – con gái: 1 cặp, loại cha mẹ – con, không có nút hợp hôn');
const chu2 = JSON.stringify(Q2);
kt(!/kết hôn|sinh con|cưới|hôn nhân|phu thê|vợ chồng|Kim Lâu/i.test(chu2.replace(/Cung Phu Thê/g, '')), 'cha – con gái: không còn mục kết hôn / sinh con / vợ chồng');
const Q4 = ctx.giaDinhQuanHe(ids, tokChu);
kt(Q4.cap.length === 6 && Q4.nhom && Q4.nhom.tamGiac.length === 1 && Q4.nhom.tamGiac[0].con === 'Con gái' && Q4.nhom.nam.length === 5, '4 người: 6 cặp, có phần cả nhà, tam giác cha – mẹ – con gái');
kt(Q4.cap.filter(c => c.capDoi).length === 1 && Q4.cap.find(c => c.capDoi).loai === 'vc', 'chỉ cặp vợ chồng có nút sang Cặp đôi');
kt(!Q4.nhom.vaiTro.some(v => /^Con gái có xu hướng là người giữ nhịp/.test(v.de)), 'trẻ nhỏ không bị xếp "giữ nhịp cả nhà"');
// Lời dễ hiểu: không tên sao / tên cung / thuật ngữ
const SAO_TEN = Object.keys(ctx.SAO || {}).filter(n => n.length > 3);
const deHieu = [].concat(...Q4.cap.map(c => c.tomTat.concat(c.tot.map(x => x.de), c.xau.map(x => x.de))), Q4.nhom.nguHanh.de, ...Q4.nhom.tamGiac.map(t => t.de), Q4.nhom.tuoi.map(x => x.de), Q4.nhom.vaiTro.map(x => x.de), Q4.nhom.nam.map(x => x.de));
kt(SAO_TEN.length > 50, 'có danh sách tên sao để dò');
deHieu.forEach(t => {
  SAO_TEN.forEach(n => kt(t.indexOf(n) < 0, 'lời dễ hiểu nêu tên sao "' + n + '": ' + t));
  kt(!/Tử Tức|Phụ Mẫu|Huynh Đệ|Phúc Đức|hỷ dụng|kỵ thần|nhật chủ|Quan Sát|Thực Thương|Tỷ Kiếp|nạp âm|Hóa Kỵ|Hóa Lộc/i.test(t), 'lời dễ hiểu có thuật ngữ: ' + t);
});
kt(Q4.cap.every(c => c.xau.every(x => /Cách làm|nên|đừng/i.test(x.de))), 'mỗi điều cần lưu ý đều kèm cách làm');
bi = false; try { ctx.giaDinhQuanHe([ids[0]], tokChu); } catch (e) { bi = true; }
let bi2 = false; try { ctx.giaDinhQuanHe(ids, tokTV); } catch (e) { bi2 = true; }
kt(bi && bi2, 'chọn 1 người hoặc id không thuộc danh sách mình bị từ chối');
for (let i = 0; i < 25; i++) {   // ngẫu nhiên: không lỗi, điểm trong 0–10
  const qh = ['Bản thân', 'Vợ', 'Con trai', 'Con gái', 'Cha', 'Mẹ', 'Anh', 'Em gái', 'Ông', 'Bà', 'Cháu', 'Họ hàng'];
  const dsN = [0, 1, 2, 3].map(k => ({ ten: 'N' + i + k, quanHe: qh[(i * 5 + k * 7) % qh.length], input: { gender: (i + k) % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + (i * 7 + k * 3) % 28, month: 1 + (i + k * 5) % 12, year: 1940 + (i * 13 + k * 17) % 80, hour: (i * 5 + k) % 24, minute: 0 } }));
  const sach = ctx.giaDinhLuu(dsN, tokTV).ds, R = ctx.giaDinhQuanHe(sach.map(x => x.id), tokTV);
  kt(R.cap.length === 6 && R.cap.every(c => c.diem >= 0 && c.diem <= 10 && c.tomTat.length) && R.nhom, '#' + i + ' 4 người ngẫu nhiên luận được');
}
console.log('Gia đình: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
