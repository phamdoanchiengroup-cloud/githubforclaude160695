/**
 * Kiểm thử Điều phối sản xuất (08/11): cách đếm (đề xuất + áp dụng + giữ khi lưu quy trình), sức khỏe dữ liệu, dòng chảy, việc của xưởng, quyền.
 *   DATA=<csdl.json số thật> [DH=<dh.json Sheet đơn>] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/dieu-phoi.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-08T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = (v, x) => TK.find(t => String(t.VaiTro).trim() === v && (!x || t.MaXuong === x));
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN')), Ttp = c.__phienDai(vt('TP', 'SON') || vt('TP')), Tcn = c.__phienDai(vt('CN'));
let r;

console.log('\n1. Quyền');
ok(c.__goi('layDieuPhoi', Tadm, true).ok, 'Ban điều hành xem được Điều phối');
ok(c.__goi('layDieuPhoi', Town, true).coTheAp === true && c.__goi('layDieuPhoi', Tadm, false).coTheAp === false, 'chỉ chủ sở hữu có nút Áp dụng');
r = c.__goi('layDieuPhoi', Ttp, true); ok(!r.ok, 'trưởng phòng không xem Điều phối', r);
r = c.__goi('layDieuPhoi', Tcn, true); ok(!r.ok, 'công nhân bị chặn', r);
r = c.__goi('apDeXuatDem', Tadm); ok(!r.ok, 'Ban điều hành không áp được cách đếm', r);
r = c.__goi('apCachDem', Town, { xuat: { SON: ['CB-XUATHANG'] } }); ok(!r.ok && /không thuộc/.test(r.msg), 'không cho đặt bước xuất của xưởng khác', r);
r = c.__goi('apCachDem', Town, { luot: { SON: 9 } }); ok(!r.ok, 'số lần ghi ngoài 1–5 bị chặn', r);

console.log('\n2. Đề xuất cách đếm (số thật T10)');
r = c.__goi('layDieuPhoi', Town, true);
const P = x => r.dem.find(p => p.x === x);
ok(P('PHOICB') && P('PHOICB').moi.them.indexOf('Cắt Phôi Ngọn') >= 0 && P('PHOICB').moi.tb > P('PHOICB').cu.tb, 'Phôi Carbon: thêm Cắt Phôi Ngọn, số ra tăng', P('PHOICB'));
ok(P('SON').moi.luot === 2 && Math.abs(P('SON').moi.tb * 2 - P('SON').cu.tb) <= 1, 'Sơn: chia 2', P('SON'));
const xuatChuoi = (P('SON').doi[0] || [])[1];
ok(xuatChuoi > 0 && Math.abs(P('SON').moi.tb - xuatChuoi) / xuatChuoi < 0.3, 'Sơn sau chia 2 gần Phôi Thô xuất chuôi (±30%)', [P('SON').moi.tb, xuatChuoi]);
ok(r.theoDeXuat === true, 'chưa áp: dòng chảy tính theo đề xuất (có cờ báo)');
ok(r.cap.length === 6 && r.cap.every(x => ['don', 'hut', 'can', 'lech', 'thieu'].indexOf(x.tt) >= 0), 'dòng chảy 6 chặng có trạng thái');
ok(r.chuoi.length === 2 && r.chuoi.every(x => x.nut && x.nut.tb7 === Math.min.apply(null, x.ds.map(o => o.tb7))), 'nút cổ chai = xưởng ra ít nhất mỗi chuỗi');
ok(Array.isArray(r.sk.thieuNK) && typeof r.sk.choTong === 'number' && r.sk.la.every(x => x.sl > 3 * x.thuong || x.sl > x.thuong + 100), 'sức khỏe dữ liệu: số bất thường ≥ 3 lần mức thường');

const gt = (r.sk.ghiThieu || []).find(g => g.nhan === 'Ngọn Glassfiber');
ok(gt && gt.b > 1.3 * gt.a && !(r.sk.ghiThieu || []).some(g => g.nhan === 'Ngọn Carbon'), 'ghi thiếu: báo ngọn GF Phôi Thô (giao < Ngọn Taro làm), ngọn carbon khớp không báo', r.sk.ghiThieu);
ok((r.cap.find(c => c.nhan === 'Ngọn chờ taro') || {}).ghiThieu.indexOf('Ngọn Glassfiber') >= 0, 'chặng Ngọn chờ taro gắn cờ có thể ghi thiếu');
console.log('\n3. Áp dụng + giữ khi lưu quy trình');
const sl0 = c.__goi('layDongGoiNgay', Town, 40).xuong;
r = c.__goi('apDeXuatDem', Town); ok(r.ok, 'chủ sở hữu áp dụng', r);
r = c.__goi('layDieuPhoi', Town, true); ok(r.dem.every(p => p.daAp) && r.theoDeXuat === false, 'sau áp: không còn đề xuất chờ');
const sl1 = c.__goi('layDongGoiNgay', Town, 40).xuong, tong = (x) => Object.values(x.ngay).reduce((a, b) => a + b, 0);
ok(sl1.SON.luot === 2 && Math.abs(tong(sl1.SON) * 2 - tong(sl0.SON)) < 1, 'sản lượng xưởng Sơn (biểu đồ, báo cáo) = tổng ÷ 2', [tong(sl0.SON), tong(sl1.SON)]);
ok(sl1.PHOICB.ma.indexOf('CB-CHECK-CAT') >= 0, 'Phôi Carbon có bước Cắt Phôi Ngọn');
const q = c.__goi('layQuyTrinh', Town, 30); ok(q.luot && q.luot.SON === 2 && q.luot.INUV === 2, 'tab Quy trình nhận số lần ghi mỗi khúc');
const o = { cd: q.quyTrinh.map(x => ({ Ma: x.Ma, Nhanh: x.Nhanh, Buoc: x.Buoc, Truoc: x.Truoc, GhiChu: x.GhiChu })), xuong: q.xuongLuong, caiDat: q.caiDat, xuat: q.xuat };
r = c.__goi('luuQuyTrinh', Town, o); ok(r.ok, 'lưu quy trình như web', r);
ok(c.__goi('layQuyTrinh', Town, 30).luot.SON === 2, 'lưu quy trình không làm mất "÷ 2"');
ok(c.__goi('layQuyTrinh', Ttp, 30).luot.SON === 2 || vt('TP', 'SON') == null, 'trưởng phòng Sơn thấy ÷ 2 của xưởng mình');

if (process.env.DH) {
  console.log('\n4. Việc của xưởng (Sheet đơn thật)');
  const dh = JSON.parse(fs.readFileSync(process.env.DH, 'utf8')), sh = {};
  for (const k in dh) sh[k] = dh[k].map(rw => (rw || []).map(v => (v && typeof v === 'object' && v.$d) ? new Date(v.$d + '+07:00') : v));
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'Trạng thái đơn hàng', sheets: sh } };
  const a = c.__goi('layViecXuongToi', Town), b = c.__goi('layViecXuongToi', Ttp);
  ok(a.ok && a.xuong === '' && a.don.length > 100, 'chủ sở hữu: mọi dòng đơn còn thiếu (' + (a.don || []).length + ')');
  ok(b.ok && b.xuong && b.don.length > 0 && b.don.length < a.don.length && b.don.every(x => x.thieu > 0 && x.pl.loai !== 'PK'), 'trưởng phòng: chỉ dòng liên quan xưởng mình (' + (b.don || []).length + ')');
  ok(!c.__goi('layViecXuongToi', Tcn).ok, 'công nhân bị chặn');
}
console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
