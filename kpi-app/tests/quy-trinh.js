/**
 * Kiểm thử Quy trình sản xuất (tests/quy-trinh/): quyền chỉ OWNER, quy trình nháp, suy công đoạn trước, lưu / chặn lỗi, thống kê.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/quy-trinh.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-24T17:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN')), Ttp = c.__phienDai(vt('TP')), Tcn = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'CN' && t.MaNV));
let r;

console.log('\n1. Quyền: chỉ chủ sở hữu');
['layQuyTrinh', 'luuQuyTrinh'].forEach(f => {
  [[Tadm, 'ban điều hành'], [Ttp, 'trưởng phòng'], [Tcn, 'công nhân']].forEach(([t, ten]) => { r = c.__goi(f, t, f === 'luuQuyTrinh' ? { cd: [], xuong: [] } : 30); ok(!r.ok && /chủ sở hữu/.test(r.msg), f + ': ' + ten + ' bị chặn', r); });
  r = c.__goi(f, 'sai', {}); ok(!r.ok && r.hetHan, f + ': phiên sai bị chặn', r);
});
r = c.__goi('layManhGiaoDien', Tadm, 'QuyTrinh'); ok(!r.ok, 'mảnh QuyTrinh: ban điều hành không tải được', r);
r = c.__goi('layManhGiaoDien', Tcn, 'QuyTrinh'); ok(!r.ok, 'mảnh QuyTrinh: công nhân không tải được', r);
ok(c.MANH_GD.QuyTrinh.join() === 'OWNER', 'MANH_GD.QuyTrinh = [OWNER]');

console.log('\n2. Quy trình nháp + thống kê');
r = c.__goi('layQuyTrinh', Town, 30);
ok(r.ok && r.nhap, 'chưa lưu → trả quy trình nháp', { ok: r.ok, msg: r.msg, nhap: r.nhap });
const dang = c.doc_('CongDoan').filter(x => String(x.TrangThai).trim() !== 'Ngừng');
ok(r.quyTrinh.length === dang.length && r.congDoan.length === dang.length, 'mọi công đoạn đang dùng đều có trong quy trình (' + dang.length + ')');
const chuaXep = r.quyTrinh.filter(q => q.Nhanh === 'CHUAXEP').map(q => q.Ma);
ok(chuaXep.length <= 3, 'nháp xếp được gần hết công đoạn (chưa xếp: ' + chuaXep.length + ')', chuaXep);
ok(r.xuongLuong.length === 9 && r.xuongLuong.some(x => x.Tu === 'HT' && x.Den === 'DG'), 'luồng giữa xưởng nháp 9 mũi tên, có HT → DG');
ok(r.soNgay === 30 && r.tu === '2026-09-25' && r.den === '2026-10-24' && r.soNgaySX > 15, 'kỳ 30 ngày tính đúng', [r.tu, r.den, r.soNgaySX]);
const nk = c.doc_('NhatKySanXuat').filter(x => String(x.TrangThai).trim() !== 'Từ chối' && c.ngayVN_(x.Ngay) >= r.tu && c.ngayVN_(x.Ngay) <= r.den && Number(x.SoLuongLamRa) > 0);
const tong = nk.reduce((a, x) => a + Number(x.SoLuongLamRa), 0), tong2 = Object.values(r.thongKe).reduce((a, t) => a + t.sl, 0);
ok(Math.abs(tong - tong2) < 1e-6, 'tổng sản lượng thống kê khớp nhật ký (' + tong + ')', [tong, tong2]);
const m0 = Object.keys(r.thongKe)[0];
ok(Object.values(r.thongKe[m0].nguoi).reduce((a, b) => a + b, 0) === r.thongKe[m0].sl, 'sản lượng theo người cộng lại bằng tổng công đoạn');
ok(r.nhanSu.length === c.doc_('NhanSu').filter(n => n.TrangThai === 'Đang làm').length && r.nhanSu.every(n => !('SoCCCD' in n) && !('DienThoai' in n)), 'nhân sự: chỉ người đang làm, không gửi CCCD / điện thoại');
ok(r.may.INUV && Object.values(r.may.INUV).reduce((a, b) => a + b, 0) >= 10, 'máy móc theo xưởng (bỏ máy thanh lý)', r.may.INUV);
ok(r.caiDat.mucTieu === 137, 'mục tiêu mặc định 137% (theo nhu cầu đơn hàng)');
const ncong = r.ngayCong, ng1 = Object.keys(ncong)[0];
ok(ng1 && Object.values(ncong).every(d => d >= 1 && d <= r.soNgaySX) && new Set(nk.filter(x => x.MaNV === ng1).map(x => c.ngayVN_(x.Ngay))).size <= ncong[ng1], 'ngày công từng người ≤ số ngày có sản xuất', [ng1, ncong[ng1]]);
ok(c.__goi('layQuyTrinh', Town, 999).soNgay === 30 && c.__goi('layQuyTrinh', Town, 60).soNgay === 60, 'số ngày lạ → mặc định 30; 60 dùng được');

console.log('\n3. Suy công đoạn trước (nhánh + bước)');
const C = (Ma, Nhanh, Buoc, Truoc) => ({ Ma, MaXuong: 'X', Nhanh, Buoc, Truoc: Truoc || [] });
let k = c.qtCanh_([C('a', 'CHUNG', 1), C('n1', 'NGON', 2), C('n2', 'NGON', 3), C('c1', 'CHUOI', 2), C('g', 'CHUNG', 4), C('n3', 'NGON', 5), C('h', 'HOTRO', 1), C('p', 'NOI', 1), C('p2', 'NOI', 2), C('x', 'CHUNG', 6)]);
ok(k.n1.join() === 'a' && k.c1.join() === 'a', 'rẽ nhánh: Ngọn / Chuôi đầu tiên nhận từ Chung', k);
ok(k.n2.join() === 'n1', 'tuần tự trong nhánh', k.n2);
ok(k.g.sort().join() === 'c1,n2', 'quy tụ: Chung nhận từ cuối mỗi nhánh đang chạy', k.g);
ok(c.qtCanh_([C('a', 'CHUNG', 1), C('b', 'CHUNG', 2)]).b.join() === 'a', 'Chung liền Chung: nối thẳng');
ok(k.n3.join() === 'g', 'sau quy tụ, nhánh lại nhận từ Chung', k.n3);
ok(k.x.join() === 'n3', 'Chung sau: chỉ nhánh còn chạy sau Chung gần nhất', k.x);
ok(k.h.length === 0 && k.p.length === 0 && k.p2.join() === 'p', 'Hỗ trợ không nối; nhánh riêng (Nối) chạy riêng, không gộp vào Chung');
k = c.qtCanh_([C('a', 'NGON', 1), C('b', 'NGON', 2, ['a']), C('d', 'NGON', 3, ['a'])]);
ok(k.d.join() === 'a', 'công đoạn trước ghi tay được ưu tiên', k);
ok(c.qtCoVong_({ a: ['b'], b: ['a'] }) && !c.qtCoVong_({ a: [], b: ['a'] }), 'phát hiện vòng lặp');

console.log('\n4. Lưu');
const R0 = r, ds = r.quyTrinh.map(q => ({ Ma: q.Ma, Nhanh: q.Nhanh, Buoc: q.Buoc, Truoc: q.Truoc, GhiChu: q.GhiChu }));
const X0 = r.quyTrinh.find(q => q.MaXuong === 'SON' && q.Nhanh === 'CHUOI' && q.Buoc === 1), X1 = r.quyTrinh.find(q => q.MaXuong === 'SON' && q.Nhanh === 'CHUOI' && q.Buoc === 2);
const thu = (sua, xuong) => c.__goi('luuQuyTrinh', Town, { cd: ds.map(q => Object.assign({}, q, sua(q) || {})), xuong: xuong || R0.xuongLuong, caiDat: R0.caiDat });
ok(!thu(q => q.Ma === X0.Ma ? { Nhanh: 'ABC' } : 0).ok, 'nhánh lạ: chặn');
ok(!thu(q => q.Ma === X0.Ma ? { Buoc: 0 } : 0).ok && !thu(q => q.Ma === X0.Ma ? { Buoc: 2.5 } : 0).ok, 'bước 0 / lẻ: chặn');
ok(!thu(q => q.Ma === X0.Ma ? { Truoc: [X0.Ma] } : 0).ok, 'công đoạn trước là chính nó: chặn');
const khacX = r.quyTrinh.find(q => q.MaXuong !== 'SON').Ma;
r = thu(q => q.Ma === X0.Ma ? { Truoc: [khacX] } : 0); ok(!r.ok && /cùng xưởng/.test(r.msg), 'công đoạn trước khác xưởng: chặn', r);
r = thu(q => q.Ma === X0.Ma ? { Truoc: [X1.Ma] } : 0); ok(!r.ok && /vòng lặp/.test(r.msg), 'vòng lặp (bước 1 ← bước 2 ← bước 1): chặn', r);
r = c.__goi('luuQuyTrinh', Town, { cd: ds.concat([{ Ma: 'KHONG-CO', Nhanh: 'NGON', Buoc: 1 }]), xuong: R0.xuongLuong }); ok(!r.ok, 'mã công đoạn lạ: chặn', r);
r = thu(() => 0, [{ Tu: 'SON', Den: 'INUV' }, { Tu: 'INUV', Den: 'SON' }]); ok(!r.ok && /vòng/.test(r.msg), 'luồng xưởng vòng lặp: chặn', r);
r = c.__goi('luuQuyTrinh', Town, { cd: ds, xuong: [], caiDat: { gioCoMat: 30 } }); ok(!r.ok, 'cài đặt ngoài khoảng: chặn', r);
r = thu(() => 0, [{ Tu: '__proto__', Den: 'DG' }]); ok(!r.ok, 'xưởng tên đặc biệt (__proto__): chặn', r);
r = thu(q => q.Ma === X0.Ma ? { Truoc: Array(5000).fill('x') } : 0); ok(!r.ok && /quá dài|quá nhiều/.test(r.msg), 'danh sách công đoạn trước quá dài: chặn trước khi xử lý', r);
r = thu(q => q.Ma === X0.Ma ? { GhiChu: 'x'.repeat(500) } : 0); ok(!r.ok, 'ghi chú quá dài: chặn', r);
r = thu(q => q.Ma === X0.Ma ? { GhiChu: '=HYPERLINK("x")' } : 0);
ok(r.ok && r.doi === ds.length, 'lưu lần đầu: mọi công đoạn ghi', r);
const sh = c.doc_('QuyTrinh');
ok(sh.filter(x => x.Loai === 'CD').length === ds.length && sh.filter(x => x.Loai === 'XUONG').length === 9 && sh.filter(x => x.Loai === 'CAIDAT').length === 4, 'sheet QuyTrinh: đủ dòng CD / XUONG / CAIDAT');
ok(String(sh.find(x => x.Ma === X0.Ma).GhiChu).startsWith("'="), 'ghi chú bắt đầu bằng "=" được chặn thành chữ (không thành công thức)');
let r2 = c.__goi('layQuyTrinh', Town, 30); ok(r2.ok && !r2.nhap, 'đọc lại: không còn là nháp');
r2 = c.__goi('luuQuyTrinh', Town, { cd: r2.quyTrinh.map(q => q.Ma === X1.Ma ? Object.assign({}, q, { Buoc: 9 }) : q), xuong: r2.xuongLuong, caiDat: Object.assign({}, r2.caiDat, { mucTieu: 130 }) });
ok(r2.ok && r2.doi === 1, 'lưu lại: chỉ đếm dòng thay đổi', r2);
r2 = c.__goi('layQuyTrinh', Town, 30);
ok(r2.quyTrinh.find(q => q.Ma === X1.Ma).Buoc === 9 && r2.caiDat.mucTieu === 130 && r2.caiDat.gioCoMat === 8, 'đọc lại đúng bước + cài đặt');
ok(c.doc_('NhatKyThaoTac').some(x => x.HanhDong === 'Sửa quy trình sản xuất'), 'ghi nhật ký thao tác');

console.log((loi ? '\n✗ ' : '\n✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
