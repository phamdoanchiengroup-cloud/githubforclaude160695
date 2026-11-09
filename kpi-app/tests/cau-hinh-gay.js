/**
 * Kiểm thử máy chủ Cấu hình gậy (08/11): quyền 4 mã NV, lưu chờ duyệt (C077), duyệt / từ chối (C019), phiên bản, nhật ký tải PDF, chặn dữ liệu xấu.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/cau-hinh-gay.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const h = du.TaiKhoan[0], iDoi = h.indexOf('DoiMatKhauLanDau'), iNV = h.indexOf('MaNV'), iVT = h.indexOf('VaiTro');
du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-09T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng');
const theoNV = m => TK.find(t => String(t.MaNV).toUpperCase() === m), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const owner = vt('OWNER'), gd = theoNV('C019'), do77 = theoNV('C077'), xem67 = theoNV('C067'), tp = vt('TP'), cn = vt('CN');
const T = tk => c.__phienDai(tk);
console.log('\n1. Quyền');
ok(owner && gd && do77 && xem67, 'có đủ tài khoản C019 / C077 / C067 / chủ sở hữu', [!!owner, !!gd, !!do77, !!xem67]);
const Towner = T(owner), Tgd = T(gd), T77 = T(do77), T67 = T(xem67), Ttp = T(tp), Tcn = T(cn);
ok(c.__goi('napDuLieu', T77).me.cg === 'sua', 'C077: quyền sửa (me.cg = sua)');
ok(c.__goi('napDuLieu', Tgd).me.cg === 'duyet', 'C019: quyền duyệt');
ok(c.__goi('napDuLieu', T67).me.cg === 'sua', 'C067: quyền sửa (09/11)');
ok(c.__goi('napDuLieu', Towner).me.cg === 'duyet', 'chủ sở hữu C056: sửa + duyệt (09/11)');
ok(!c.__goi('napDuLieu', Ttp).me.cg && !c.__goi('napDuLieu', Tcn).me.cg, 'trưởng phòng / công nhân: không có quyền');
ok(!c.__goi('layDsCauHinhGay', Ttp).ok && !c.__goi('layDsCauHinhGay', Tcn).ok, 'TP / CN gọi thẳng hàm: bị chặn');
ok(!c.__goi('layManhGiaoDien', Ttp, 'CauHinhGay').ok, 'TP không tải được mảnh giao diện CauHinhGay');
const mg = c.__goi('layManhGiaoDien', T67, 'CauHinhGay'); ok(mg.ok || /Không đọc được file/.test(mg.msg), 'C067 qua được kiểm quyền mảnh giao diện', mg.msg);
const ds = c.__goi('layDsCauHinhGay', T67);
ok(ds.ok && ds.ds.length > 40, 'danh sách dòng gậy dùng chung Cấu hình sản phẩm (' + (ds.ds || []).length + ' dòng)');
ok(ds.ds.every(d => d.pb === 0 && !d.cho), 'ban đầu chưa dòng nào có bản vẽ');
const MA = 'RETRO';
ok(ds.ds.some(d => d.ma === MA && d.kieu === 'DANH' && d.tenRen === '3/8-8'), 'Retro: gậy đánh, ren 3/8-8');

console.log('\n2. Lưu (C077) → chờ duyệt');
const dl = { ngon: { tip: { d: 12.5, h: 10, vl: 'Time 3' }, ong: { vl: 'Ống carbon', day: 1.2, dai: 708, dDau: 12.5, proDai: 380, dPro: 13.4, dJoint: 21.5 } }, chuoi: { pin: { ren: '3/8-8', tho: 19 } }, chung: { canBang: 465, ghiChu: 'đo 3 cây' }, daDo: { ngon__tip__d: 1 } };
ok(!c.__goi('luuCauHinhGay', Ttp, MA, dl, '').ok, 'trưởng phòng không lưu được');
let r = c.__goi('luuCauHinhGay', T77, MA, dl, 'lần đo 1'); ok(r.ok, 'C077 lưu: ' + r.msg);
const bv67 = c.__goi('layCauHinhGay', T67, MA); ok(bv67.ok && bv67.choDuyet && bv67.choDuyet.tt.pb === 1, 'C067 (người sửa) thấy bản chờ duyệt');
let bv = c.__goi('layCauHinhGay', Tgd, MA);
ok(bv.ok && !bv.hieuLuc && bv.choDuyet && bv.choDuyet.tt.pb === 1 && bv.choDuyet.dl.ngon.tip.d === 12.5, 'có bản chờ duyệt v1, chưa có hiệu lực');
r = c.__goi('luuCauHinhGay', T77, MA, Object.assign({}, dl, { chung: { canBang: 470 } }), 'lần đo 2');
bv = c.__goi('layCauHinhGay', Tgd, MA);
ok(bv.lichSu.filter(x => x.tt === 'Chờ duyệt').length === 1 && bv.choDuyet.tt.pb === 1 && bv.choDuyet.dl.chung.canBang === 470, 'lưu lại: thay bản chờ (vẫn 1 bản chờ v1)');
ok(c.__goi('demCauHinhGayCho', Tgd).n === 1, 'Việc hôm nay Giám đốc SX: 1 bản chờ');
ok(c.__goi('layDsCauHinhGay', T67).ds.find(d => d.ma === MA).cho, 'danh sách: Retro "Chờ duyệt"');

console.log('\n3. Duyệt / từ chối (C019)');
const id1 = bv.choDuyet.tt.id;
ok(!c.__goi('duyetCauHinhGay', T77, id1, true, '').ok, 'C077 không tự duyệt');
ok(!c.__goi('duyetCauHinhGay', Tgd, id1, false, '').ok, 'từ chối phải có lý do');
r = c.__goi('duyetCauHinhGay', Tgd, id1, true, ''); ok(r.ok, 'C019 duyệt: ' + r.msg);
bv = c.__goi('layCauHinhGay', Towner, MA);
ok(bv.hieuLuc && bv.hieuLuc.tt.pb === 1 && !bv.choDuyet && bv.hieuLuc.tt.duyet === gd.TenDangNhap, 'v1 hiệu lực, ghi người duyệt');
ok(!c.__goi('duyetCauHinhGay', Tgd, id1, true, '').ok, 'duyệt lại bản đã duyệt: báo không còn chờ');
c.__goi('luuCauHinhGay', T77, MA, Object.assign({}, dl, { chung: { canBang: 480 } }), 'v2');
bv = c.__goi('layCauHinhGay', Tgd, MA); ok(bv.choDuyet.tt.pb === 2 && bv.hieuLuc.tt.pb === 1, 'bản mới là v2, v1 vẫn hiệu lực trong lúc chờ');
r = c.__goi('duyetCauHinhGay', Tgd, bv.choDuyet.tt.id, false, 'Pin thò 19 chưa khớp hàng thật'); ok(r.ok, 'từ chối v2');
bv = c.__goi('layCauHinhGay', Tgd, MA); ok(bv.hieuLuc.tt.pb === 1 && bv.lichSu.some(x => x.tt === 'Từ chối' && x.lyDo === 'Pin thò 19 chưa khớp hàng thật'), 'v1 vẫn hiệu lực, v2 ghi lý do từ chối');
c.__goi('luuCauHinhGay', T77, MA, Object.assign({}, dl, { chung: { canBang: 475 } }), 'v3');
bv = c.__goi('layCauHinhGay', Tgd, MA); c.__goi('duyetCauHinhGay', Tgd, bv.choDuyet.tt.id, true, '');
bv = c.__goi('layCauHinhGay', T67, MA);
ok(bv.hieuLuc.tt.pb === 3 && bv.lichSu.some(x => x.pb === 1 && x.tt === 'Bản cũ'), 'v3 hiệu lực, v1 thành "Bản cũ"');
const cu = c.__goi('layCauHinhGay', T67, MA, 1); ok(cu.xem && cu.xem.dl.chung.canBang === 470, 'xem lại bản cũ v1');
ok(!c.__goi('layCauHinhGay', T67, MA, 2).xem, 'bản bị từ chối không mở như bản chính thức');

console.log('\n3b. Quyền 09/11: cả 4 sửa, C019 / C056 duyệt (được tự duyệt)');
r = c.__goi('luuCauHinhGay', T67, 'EVO1', dl, 'C067 đo'); ok(r.ok, 'C067 lưu được');
let b2 = c.__goi('layCauHinhGay', Towner, 'EVO1'); ok(!c.__goi('duyetCauHinhGay', T67, b2.choDuyet.tt.id, true, '').ok, 'C067 không duyệt được');
r = c.__goi('duyetCauHinhGay', Towner, b2.choDuyet.tt.id, true, ''); ok(r.ok, 'C056 (chủ sở hữu) duyệt bản của C067');
r = c.__goi('luuCauHinhGay', Tgd, 'EVO1', dl, 'C019 tự đo'); ok(r.ok, 'C019 lưu được');
b2 = c.__goi('layCauHinhGay', Tgd, 'EVO1'); r = c.__goi('duyetCauHinhGay', Tgd, b2.choDuyet.tt.id, true, ''); ok(r.ok && c.__goi('layCauHinhGay', Tgd, 'EVO1').hieuLuc.tt.pb === 2, 'C019 tự duyệt bản mình lưu → v2 hiệu lực');
r = c.__goi('luuCauHinhGay', Towner, 'EVO1', dl, 'C056 tự đo'); b2 = c.__goi('layCauHinhGay', Towner, 'EVO1');
ok(r.ok && c.__goi('duyetCauHinhGay', Towner, b2.choDuyet.tt.id, true, '').ok, 'C056 tự lưu + tự duyệt');
console.log('\n4. Tải PDF + nhật ký');
const nk0 = c.doc_('NhatKyThaoTac').length;
r = c.__goi('ghiTaiPdfCauHinhGay', T67, MA, 3); ok(r.ok && r.nguoi && r.luc, 'trả tên + giờ cho dấu chìm', r);
c.xoaCache_('NhatKyThaoTac'); const nk = c.doc_('NhatKyThaoTac');
ok(nk.length === nk0 + 1 && nk[nk.length - 1].HanhDong === 'Tải PDF cấu hình gậy' && nk[nk.length - 1].TenDangNhap === xem67.TenDangNhap, 'ghi nhật ký thao tác người tải');
ok(!c.__goi('ghiTaiPdfCauHinhGay', Ttp, MA, 3).ok, 'TP không tải được');
ok(nk.some(x => x.HanhDong === 'Duyệt cấu hình gậy') && nk.some(x => x.HanhDong === 'Từ chối cấu hình gậy') && nk.some(x => x.HanhDong === 'Lưu cấu hình gậy (chờ duyệt)'), 'nhật ký có lưu / duyệt / từ chối');

console.log('\n5. Chặn dữ liệu xấu');
ok(!c.__goi('luuCauHinhGay', T77, 'KHONGCO', dl, '').ok, 'dòng gậy không có thật');
ok(!c.__goi('luuCauHinhGay', T77, MA, { ngon: { tip: { d: [1, 2] } } }, '').ok, 'mảng ở trường số: không nhận');
ok(!c.__goi('luuCauHinhGay', T77, MA, { ngon: { tip: { d: 1e9 } } }, '').ok, 'số ngoài khoảng');
ok(!c.__goi('luuCauHinhGay', T77, MA, { ngon: { tip: { vl: 'a'.repeat(400) } } }, '').ok, 'chữ quá dài');
ok(!c.__goi('luuCauHinhGay', T77, MA, { ngon: { tip: { d: '12' } } }, '').ok, 'sai kiểu (chữ ở trường số)');
r = c.__goi('luuCauHinhGay', T77, 'NEBULA', JSON.parse('{"__proto__":{"x":1},"la":{"b":1},"ngon":{"tip":{"d":12.3,"zz":5}},"daDo":{"ngon__tip__d":1,"khong__co":1},"chung":{"ghiChu":"=HYPERLINK(\\"x\\")"}}'), '=1+1');
const row = c.doc_('CauHinhGay').find(x => x.MaDong === 'NEBULA'), J = row && JSON.parse(row.DuLieu);
ok(r.ok && J && J.ngon.tip.d === 12.3 && !('la' in J) && !('zz' in J.ngon.tip) && !Object.prototype.hasOwnProperty.call(J, '__proto__') && JSON.stringify(J.daDo) === '{"ngon__tip__d":1}', 'chỉ lưu trường đã biết (bỏ khóa lạ, __proto__, ô đã đo không có thật)', J);
ok(!/^=/.test(row.GhiChu) && String(row.DuLieu).charAt(0) === '{', 'ghi chú "=..." vô hiệu; thông số lưu nguyên JSON (ô bắt đầu bằng "{")', row && row.GhiChu);
console.log('\n6. Mã NV trùng');
const hT = c.__sheets.TaiKhoan.rows[0], dongGia = hT.map(k => k === 'TenDangNhap' ? 'giamao' : k === 'MaNV' ? 'C019' : k === 'TrangThai' ? 'Đang dùng' : k === 'VaiTro' ? 'CN' : k === 'DoiMatKhauLanDau' ? 'Không' : k === 'PhienBan' ? 0 : '');
c.__sheets.TaiKhoan.rows.push(dongGia); c.xoaCache_('TaiKhoan');
ok(!c.__goi('layDsCauHinhGay', Tgd).ok, 'có tài khoản khác gắn trùng mã C019: cả hai mất quyền (không ai chiếm được quyền duyệt)');
c.__sheets.TaiKhoan.rows.pop(); c.xoaCache_('TaiKhoan');
ok(c.__goi('layDsCauHinhGay', Tgd).ok, 'gỡ tài khoản trùng: C019 có lại quyền');
ok(!c.__goi('layDsCauHinhGay', 'token-gia').ok, 'phiên giả bị chặn');

console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
process.exit(loi ? 1 : 0);
