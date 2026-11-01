/**
 * Kiểm thử Đơn hàng → xưởng (tests/quy-trinh/don-hang.gs): phân loại SKU 4 thông số, đọc Sheet đơn (chỉ đọc), sửa tay, quyền chỉ OWNER.
 *   DATA=<csdl.json> [DH=<dh.json: các tab Sheet "Trạng thái đơn hàng">] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/don-hang.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-31T17:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN'));
const PL = (ten, gc) => c.plPhanLoai_(ten, gc || '', null);
const la = (p, o) => Object.keys(o).every(k => p[k] === o[k]);
let r;

console.log('\n1. Phân loại – các ca app thử (Qoder) gán sai');
[
  ['Evo Luna Maxbing Edition - Malachite Eclipse', '', { loai: 'GAY', dong: 'EVO4', ren: 'R3810' }],
  ['Evo Luna Maxbing Edition - Malachite Eclipse', 'CHỈ ĐẶT NỐI', { loai: 'NOI' }],
  ['Combo MAXBING Evo Meg - ABYSS BLADE', '', { dong: 'EVO5', chuoi: 'GF740', ren: 'R51618' }],
  ['Combo MAXBING Evo Crown - ANCIENT OAK', '', { dong: 'EVO2', chuoi: 'GF736HK', ngon: 'MIX' }],
  ['NGỌN NHẢY HORNET', '', { loai: 'NGON', chuoi: 'KHONG', ngon: 'NHAY139' }],
  ['RHI2-C30PT21.5/11.8/18', '', { loai: 'NGON', ngon: 'FC', ren: 'R51618', dau: '11.8' }],
  ['RHI2-C30PT21.5/12.4/QLOC', '', { loai: 'NGON', ren: 'QLOC', dau: '12.4' }],
  ['GẬY NHẢY TK ALL NEW MÀU ĐỎ-13.9 REN 3/8-8', '', { dong: 'TKNHAY', chuoi: 'NHAY390' }],
  ['GẬY PHÁ TK sport MÀU XANH', '', { dong: 'EVOX', tip: 'BAK' }],
  ['Rhino - 30" / 3/8-10 Carbon Pool Cue Single Shaft - 11.8', '', { loai: 'NGON', ren: 'R3810', dau: '11.8', tin: 'xanh' }],
  ['Gậy Đánh Rhino - Bia Hơi', '', { dong: 'BEER', chuoi: 'MIXCB' }]
].forEach(([t, g, mong]) => { const p = PL(t, g); ok(la(p, mong), t + (g ? ' [' + g + ']' : '') + ' → ' + JSON.stringify(mong), p); });

console.log('\n2. Phân loại – 4 thông số, tên gọi, ghi chú đơn');
let p = PL('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5');
ok(la(p, { loai: 'GAY', dong: 'EVO4', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810', dau: '12.5', tay: 'DA', tin: 'xanh' }), 'mã SKU EVO4 đọc đủ 4 thông số + đầu + tay', p);
p = PL('Nebula 2 Pool Cue - Charcoal Gray - Sport Wrap - 12.4 mm', '_Joint: 5/16-14 _Tip: TIME CRYSTAL 1');
ok(p.dong === 'NEBULA' && p.chuoi === 'MIXCB25' && p.ren === 'R51614' && p.tip === 'TIME3', 'tay da sport → chuôi vách 2.5; ren / tip theo ghi chú đơn ("_Joint:")', p);
p = PL('CUEBOTS CUE - CGP2'); ok(p.dong === 'CBCGP' && p.ren === 'UNI', 'CGP → Uniloc (không nhầm sang CGW ren 3/8-10)', p);
p = PL('CB-ZW/ZW1/29C/NW/388/12.5'); ok(p.dong === 'CBZW' && p.tin === 'xanh', 'mã CB-ZW/ZW1 nhận đúng (tên gọi kết thúc bằng "/")', p);
p = PL('RHI2-KOMET2/BRE/BLUE/13.0/388'); ok(p.dong === 'KOMET' && p.ngon === 'FCPHA', 'RHI2-KOMET2 (số liền sau tên gọi)', p);
p = PL('PHÁ NHẢY EVO VAL1'); ok(p.dong === 'EVOVAL', '"VAL1" vẫn nhận ra dòng VAL', p);
p = PL('Gậy Đánh Evo Lửa Việt - Ngọn Carbon'); ok(p.dong === 'VIETNAM' && p.tin === 'vang', 'tên gọi dài nhất thắng ("Lửa Việt" hơn "EVO"); dòng chưa chắc → vàng', p);
p = PL('KOMET BREAK SHAFT - 13.0 3/8-8'); ok(p.loai === 'NGON' && p.dong === 'NG-KOMET' && p.ngon === 'FCPHA' && p.dau === '13.0', 'ngọn phá KOMET lẻ → dòng NG-KOMET, đầu 13.0', p);
p = PL('Rhino Retro Pool Cue Butt - Black'); ok(p.loai === 'CHUOI' && p.dong === 'CH-RETRO' && p.chuoi === 'MIXCB', 'chuôi Retro lẻ → CH-RETRO (không lẫn chuôi Must)', p);
p = PL('CB-ZW/ZW1/29C/NW/388'); ok(p.dau === '12.5', 'thiếu cỡ đầu → lấy cỡ mặc định của dòng (ZW 12.5)', p);
p = PL('Gậy ABC hoàn toàn lạ'); ok(p.tin === 'do' && !p.dong,'tên lạ → đỏ, không đoán', p);
p = PL('Rhino Soft Cue Case 1X2 - Black'); ok(p.loai === 'PK', 'bao cơ → phụ kiện (không sản xuất)', p);
p = PL('RHINO RETRÔ BOCOTE Extension - 8-Inch'); ok(p.loai === 'NOI', 'tay nối', p);
p = PL('LUMINAX Cue Butt - JET BLACK (wrapless)', '_Joint Type: 3/8-10 chỉ gửi chuôi'); ok(p.loai === 'CHUOI' && p.ren === 'R3810' && p.ngon === 'KHONG', 'chuôi bán lẻ: không có ngọn, ren theo ghi chú', p);
p = c.plPhanLoai_('Gậy ABC hoàn toàn lạ', '', { LoaiHang: 'GAY', Dong: 'EVO1', Chuoi: 'GF736HK', Ngon: 'MIX', Tip: 'TIMEK', Ren: 'R388' });
ok(p.nguon === 'duyet' && p.dong === 'EVO1' && p.tin === 'xanh', 'có bản sửa tay → dùng bản sửa', p);

p = PL('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5'); ok(p.kieu === 'DANH' && p.vl === 'GF', 'EVO 4: gậy đánh, ngọn glassfiber', p);
p = PL('PHÁ NHẢY EVO VAL1'); ok(p.kieu === 'PHANHAY' && p.vl === 'MIX', 'Valkyrie: phá nhảy (nhóm riêng), ngọn mix', p);
p = PL('RHI2-KOMET2/BRE/BLUE/13.0/388'); ok(p.kieu === 'PHA' && p.vl === 'FC', 'KOMET: phá, full carbon', p);
p = PL('Rhino Retro Pool Cue Butt - Black'); ok(p.kieu === 'DANH' && p.vl === 'MIX', 'chuôi lẻ: chất liệu theo chuôi', p);

console.log('\n3. Đọc Sheet đơn (chỉ đọc) + quyền');
const tab = [['', 'NOTE…'], ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Ngày hẹn trả', 'Sơn của Khoa', 'Hỏng cần làm bù', 'UV của Doanh', 'Hoàn thiện của Thịnh', 'Tổng cộng hàng ĐG nhận từ HT'],
  ['#A-01/10', 'EVO4/LUN2/COMBOMAX', '', 100, 60, '20/11', '', '', '', 50, 3, '', '', 40],
  ['', 'Rhino - 30" / 3/8-8 Carbon Pool Cue Single Shaft - 12.5', '_Joint: Q-loc', 10, 10, new Date('2026-12-10T00:00:00+07:00'), '', 'chờ phôi', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['#B-02/10', 'Rhino Soft Cue Case 1X2 - Black', '', 5, 0, '', '', '', '', '', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'Trạng thái đơn hàng', sheets: { KHO: tab } } };
r = c.__goi('layDonHangXuong', Tadm, true); ok(!r.ok && /chủ sở hữu/.test(r.msg), 'ban điều hành bị chặn', r);
r = c.__goi('layDonHangXuong', 'sai', true); ok(!r.ok && r.hetHan, 'phiên sai bị chặn', r);
r = c.__goi('layDonHangXuong', Town, true);
ok(r.ok && r.don.length === 3, 'đọc 3 dòng đơn (bỏ dòng trống)', r.don && r.don.map(o => o.ten));
const d0 = r.don[0], d1 = r.don[1];
ok(d0.maDon === '#A-01/10' && d0.sl === 100 && d0.thieu === 60 && d0.dl === '2026-11-20' && d0.qua.SON === 50 && d0.hong.SON === 3 && d0.qua.DG === 40 && !('PHOI' in d0.qua), 'cột theo tiêu đề: SL, thiếu, deadline dd/mm, đã qua Sơn / ĐG, hỏng làm bù; ô trống = chưa ghi', d0);
ok(d1.maDon === '#A-01/10' && !('PHOI' in d1.qua) && d1.dl === '2026-10-12' && d1.pl.ren === 'QLOC', 'dòng con lấy mã đơn dòng trên; "chờ phôi" không thành số; ngày bị Sheet đảo (10/12) đọc lại 12/10; ren theo "Loại phôi"', d1);
ok(r.nhan && r.nhan.chuoi.GF736HK && r.nhan.dong.length > 40, 'trả kèm từ điển nhãn 4 thông số + dòng gậy');
c.__ngoai = {};
r = c.__goi('layDonHangXuong', Town, false); ok(r.ok && r.don.length === 3, 'lần sau lấy từ bộ nhớ tạm (không mở lại Sheet)');
r = c.__goi('layDonHangXuong', Town, true); ok(!r.ok && /Trạng thái đơn hàng/.test(r.msg), 'mất quyền vào Sheet đơn → báo lỗi dễ hiểu', r);
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tab } } };

console.log('\n4. Sửa tay phân loại');
r = c.__goi('luuPhanLoaiSKU', Tadm, { ten: 'X', loai: 'GAY' }); ok(!r.ok, 'ban điều hành không sửa được');
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'XYZ', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' }); ok(!r.ok, 'giá trị lạ bị chặn', r);
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: '__proto__', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' }); ok(!r.ok, 'dòng tên đặc biệt bị chặn', r);
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'GF740', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810', ghiChu: '=1+1' });
ok(r.ok, 'lưu sửa tay', r);
r = c.__goi('layDonHangXuong', Town, false);
ok(r.don[0].pl.nguon === 'duyet' && r.don[0].pl.chuoi === 'GF740', 'áp ngay cho đơn cùng tên (không cần đọc lại Sheet đơn)', r.don[0].pl);
ok(String(c.doc_('PhanLoaiSKU')[0].GhiChu).startsWith("'"), 'ghi chú "=" không thành công thức');
c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' });
ok(c.doc_('PhanLoaiSKU').length === 1, 'sửa lại cùng tên: thay dòng cũ, không nhân đôi');
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', bo: true });
ok(r.ok && c.doc_('PhanLoaiSKU').length === 0 && c.__goi('layDonHangXuong', Town, false).don[0].pl.nguon === 'tu-dong', '"Về tự động" xóa bản sửa');
ok(c.doc_('NhatKyThaoTac').some(x => x.HanhDong === 'Phân loại SKU'), 'ghi nhật ký thao tác');

if (process.env.DH) {
  console.log('\n5. Toàn bộ đơn thật (DH=)');
  const dh = JSON.parse(fs.readFileSync(process.env.DH, 'utf8')), sh = {};
  for (const k in dh) sh[k] = dh[k].map(rw => (rw || []).map(v => (v && typeof v === 'object' && v.$d) ? new Date(v.$d + '+07:00') : v));
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'Trạng thái đơn hàng', sheets: sh } };
  r = c.__goi('layDonHangXuong', Town, true);
  const ten = {}; r.don.forEach(o => { ten[o.ten.toUpperCase()] = o.pl.tin; });
  const n = Object.values(ten), xanh = n.filter(x => x === 'xanh').length, doo = n.filter(x => x === 'do').length;
  ok(r.ok && r.don.length > 500, 'đọc ' + r.don.length + ' dòng đơn');
  ok(xanh / n.length >= 0.85 && doo === 0, 'tên hàng chắc chắn ' + xanh + '/' + n.length + ' (≥ 85%), không tên nào đỏ', { xanh, doo, tong: n.length });
  const kv = {}; r.don.forEach(o => { if (o.pl.loai === 'PK' || o.pl.loai === 'NOI') return; const k = o.pl.loai + '|' + o.pl.kieu + '|' + o.pl.vl; kv[k] = (kv[k] || 0) + o.thieu; });
  if (process.env.IN_KIEU) console.log(kv);
  ok(r.don.every(o => o.pl.kieu && o.pl.vl) && Object.keys(kv).some(k => /NHAY\|/.test(k)) && Object.keys(kv).some(k => /\|PHA\|/.test(k)) && Object.keys(kv).some(k => /PHANHAY/.test(k)), 'mọi dòng có kiểu (đánh / nhảy / phá / phá nhảy) + chất liệu', kv);
  ok(!Object.keys(kv).some(k => /^GAY\|DANH\|KHAC/.test(k) && kv[k] > 0.05 * r.don.reduce((a, o) => a + o.thieu, 0)), 'gậy đánh "chưa rõ chất liệu" < 5% phần còn thiếu', kv);
  ok(r.don.every(o => o.pl.loai && (o.pl.loai === 'PK' || o.pl.loai === 'NOI' || o.pl.tin === 'do' || (o.pl.chuoi && o.pl.ngon && o.pl.tip && o.pl.ren))), 'mọi dòng sản xuất đều đủ 4 thông số');
}

console.log((loi ? '\n✗ ' : '\n✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
