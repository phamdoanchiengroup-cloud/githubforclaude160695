/**
 * Kiểm thử tab Gia đình (GiaDinh.gs): chỉ chủ sở hữu, lưu/đọc danh sách, chuẩn hóa dữ liệu, bảng vận năm cả nhà.
 * Chạy: node tests/gia-dinh.js  (dữ liệu mẫu bịa, không phải người thật)
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
const tok = 'gia-dinh-kiem-thu-token-0001';
ctx.CacheService.getScriptCache().put('SS_' + tok, JSON.stringify({ ten: 'chienpham' }));
let bi = false; try { ctx.giaDinhDs('khong-hop-le'); } catch (e) { bi = true; }
kt(bi, 'người không phải chủ bị chặn');
kt(ctx.giaDinhDs(tok).ds.length === 0, 'ban đầu rỗng');
const mau = [
  { ten: 'Mẫu A', quanHe: 'Bản thân', input: { gender: 'nam', calendar: 'am', day: 3, month: 4, year: 1990, hour: 9, minute: 0 } },
  { ten: 'Mẫu B', quanHe: 'Vợ', input: { gender: 'nu', calendar: 'duong', day: 12, month: 11, year: 1992, hour: 14, minute: 30 } },
  { ten: '', quanHe: 'Con gái', input: { gender: 'nu', calendar: 'am', day: 1, month: 1, year: 2020, hour: 25, minute: 99 } },
  { ten: 'Lạ', quanHe: 'không có', input: { calendar: 'am', day: 5, month: 6, year: 2001 } }];
const r = ctx.giaDinhLuu(mau, tok).ds;
kt(r.length === 4 && r.every(x => x.id), 'lưu đủ 4, có id');
kt(r[2].ten === 'Con gái' && r[2].input.hour === 0 && r[2].input.minute === 0, 'thiếu tên lấy quan hệ; giờ/phút sai về 0');
kt(r[3].quanHe === 'Khác' && r[3].input.gender === 'nam', 'quan hệ lạ → Khác');
kt(ctx.giaDinhDs(tok).ds.length === 4, 'đọc lại đủ');
bi = false; try { ctx.giaDinhLuu([{ ten: 'X', input: { day: 1, month: 1 } }], tok); } catch (e) { bi = true; }
kt(bi, 'thiếu năm sinh bị từ chối');
kt(ctx.giaDinhDs(tok).ds.length === 4, 'lưu lỗi không xóa danh sách cũ');
const V = ctx.giaDinhVanNam(2026, tok);
kt(V.canChi === 'Bính Ngọ' && V.ds.length === 4, 'năm 2026 Bính Ngọ, 4 dòng');
V.ds.forEach(x => {
  kt(!x.loi, x.ten + ' không lỗi: ' + (x.loi || ''));
  kt(x.tuoi > 0 && x.phiTinh && x.phiTinh.muc && x.batTu && x.batTu.danhGia, x.ten + ' đủ tuổi, Phi Tinh, Bát Tự');
});
kt(V.ds[0].tuoi === 2026 - 1990 + 1, 'tuổi mụ đúng');
console.log('Gia đình: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
