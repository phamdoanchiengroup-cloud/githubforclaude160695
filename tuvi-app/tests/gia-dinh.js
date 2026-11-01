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
console.log('Gia đình: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
