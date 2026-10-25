/**
 * Kiểm thử KPI quản lý (25/10): khoản "Không nhắc CN nhập" chỉ tính lượt CN có vi phạm NHAPTRE cùng ngày
 * (phạt nhập trễ trước 15/09 không ghi vi phạm -> TP/PP không bị trừ). Mục vá: tests/khong-nhac/va-khong-nhac.py.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/khong-nhac.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };

const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const hTK = du.TaiKhoan[0], iDoi = hTK.indexOf('DoiMatKhauLanDau');
du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const tao = () => G.tao(MOI, du, '2026-10-25T10:00:00+07:00');
let c = tao();
const owner = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'OWNER' && String(x.TrangThai).trim() === 'Đang dùng')[0];
const ngVN = v => c.ngayVN_(v);

// Số lượt "không nhắc" mong đợi của 1 xưởng trong 1 tháng: phạt trễ có vi phạm NHAPTRE cùng ngày, chưa được miễn
function mongDoi(cx, mx, ky) {
  const vp = {}, mien = {};
  cx.doc_('ViPham').forEach(v => { if (String(v.MaVP).trim() === 'NHAPTRE') vp[v.MaNV + '|' + cx.ngayVN_(v.Ngay)] = 1; });
  cx.doc_('MienTruKPIQuanLy').forEach(m => { mien[String(m.IdKhoan)] = 1; });
  const da = {};
  cx.doc_('PhatNhapTre').forEach(p => {
    const ng = cx.ngayVN_(p.Ngay);
    if (String(p.MaXuong) !== mx || ng.slice(0, 7) !== ky || !vp[p.MaNV + '|' + ng]) return;
    const id = 'khongNhac|' + mx + '|' + ng + '|' + p.MaNV;
    if (!mien[id]) da[id] = 1;
  });
  return Object.keys(da).length;
}
const ql = (cx, ky) => cx.__goi('layKPIQuanLy', cx.__phienDai(owner), ky);

console.log('\n1. Dữ liệu thật: số lượt "không nhắc" = số lượt CN thật sự bị trừ (có vi phạm NHAPTRE)');
['2026-08', '2026-09', '2026-10'].forEach(ky => {
  const r = ql(c, ky);
  const sai = (r.ds || []).filter(o => (o.chiTiet || {}).khongNhac !== mongDoi(c, String(o.maXuong), ky));
  ok(r.ok && r.ds.length > 0 && !sai.length, ky + ': ' + r.ds.length + ' TP/PP, mọi xưởng khớp', sai.map(o => [o.maXuong, o.chiTiet.khongNhac, mongDoi(c, String(o.maXuong), ky)]));
});
const t8 = ql(c, '2026-08');
ok(t8.ds.every(o => o.chiTiet.khongNhac === 0), 'tháng 8 (toàn phạt trước 15/09, không có vi phạm): không ai bị trừ "không nhắc"');

console.log('\n2. Thêm 1 lượt phạt trễ tháng 10: có vi phạm NHAPTRE thì trừ, không có thì không');
const cnTK = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'CN' && x.MaXuong && x.MaNV && String(x.TrangThai).trim() === 'Đang dùng')[0];
const mx = String(cnTK.MaXuong), NG = '2026-10-20';
const truoc = ql(c, '2026-10').ds.filter(o => String(o.maXuong) === mx).map(o => o.chiTiet.khongNhac);
const hP = du.PhatNhapTre[0], dongP = hP.map(h => ({ MaNV: cnTK.MaNV, HoTen: 'x', MaXuong: mx, Ngay: { $d: NG + 'T00:00:00' }, ThoiDiemPhat: { $d: '2026-10-23T17:05:00' }, GhiChu: 'thử' })[h]);
du.PhatNhapTre.push(dongP);
c = tao();
const khongVP = ql(c, '2026-10').ds.filter(o => String(o.maXuong) === mx).map(o => o.chiTiet.khongNhac);
ok(truoc.length && khongVP.join() === truoc.join(), 'phạt trễ KHÔNG có vi phạm NHAPTRE: TP/PP xưởng ' + mx + ' không bị trừ thêm', [truoc, khongVP]);
const hV = du.ViPham[0];
du.ViPham.push(hV.map(h => ({ MaGhi: 'VPTHU0001', Ngay: { $d: NG + 'T00:00:00' }, MaNV: cnTK.MaNV, MaVP: 'NHAPTRE', GhiChu: 'Tự động: quá hạn nhập SL', NguoiGhi: 'Hệ thống (tự động)', ThoiDiemGhi: '' })[h]));
c = tao();
const coVP = ql(c, '2026-10').ds.filter(o => String(o.maXuong) === mx).map(o => o.chiTiet.khongNhac);
ok(coVP.join() === truoc.map(x => x + 1).join(), 'có vi phạm NHAPTRE cùng ngày: mỗi TP/PP xưởng ' + mx + ' bị trừ thêm 1 lượt', [truoc, coVP]);

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
process.exit(loi ? 1 : 0);
