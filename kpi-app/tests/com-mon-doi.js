/**
 * Cơm trưa – bớt / đổi món (13/10): bếp đánh dấu món có thể bớt / đổi, người ăn chọn từng món, trưởng phòng sửa hộ, nhóm báo số,
 * tổng hợp cho bếp (nấu bao nhiêu suất mỗi món). Máy chủ trên giả lập + giao diện trên bản xem thử.
 *   DATA=csdl.json [F=<bản xem thử GIO=2026-10-12T14:30:00+07:00>] node kpi-app/tests/com-mon-doi.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA, F = process.env.F;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const hTK = du.TaiKhoan[0];
du.TaiKhoan.push(hTK.map(h => ({ TenDangNhap: 'nhom_mkt', HoTen: 'Marketing', VaiTro: 'NHOM', MaXuong: 'HNOI_MKT', TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Không' }[h] || '')));
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-12T14:30:00+07:00');
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const tk = f => c.doc_('TaiKhoan').filter(f);
const owner = tk(vt('OWNER'))[0], tp = tk(x => vt('TP')(x) && x.MaXuong === 'PHOITHO')[0] || tk(x => vt('TP')(x) && x.MaXuong)[0];
const cnX = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong), cnK = tk(x => vt('CN')(x) && x.MaXuong !== tp.MaXuong);
const nhom = tk(x => x.TenDangNhap === 'nhom_mkt')[0];
const P = t => c.__phienDai(t), NG = '2026-10-13';
const goi = (fn, t, ...a) => c.__goi(fn, P(t), ...a);

console.log('1. Bếp báo thực đơn có món bớt / đổi');
let r = goi('luuThucDon', owner, NG, 'Cơm trắng\nCá kho\nRau muống\nCanh cua', '', [{ m: 'Cá kho', t: 'Trứng rán' }, { m: 'Canh cua', t: '' }]);
ok(r.ok, 'lưu thực đơn kèm 2 món bớt / đổi', r);
r = goi('luuThucDon', owner, NG, 'Cơm', '', [{ m: 'A' }, { m: 'B' }, { m: 'C' }, { m: 'D' }]);
ok(!r.ok && /Tối đa 3/.test(r.msg), 'quá 3 món: từ chối', r);
r = goi('luuThucDon', owner, NG, 'Cơm', '', [{ m: 'Cá kho' }, { m: 'cá kho' }]);
ok(!r.ok && /trùng/.test(r.msg), 'trùng tên món: từ chối', r);
r = goi('napComTrua', cnX[0]);
const td = r.thucDon.find(x => x.ngay === NG);
ok(td && td.monDoi.length === 2 && td.monDoi[0].t === 'Trứng rán' && td.monDoi[1].t === '', 'napComTrua trả monDoi (món thay trống = chỉ bớt)', td && td.monDoi);

console.log('2. Người ăn chọn bớt / đổi');
r = goi('dangKyCom', cnX[0], NG, true, { 'Cá kho': 'b' });
ok(r.ok && r.bo['Cá kho'] === 'b' && /không ăn Cá kho/.test(r.msg), 'người 1: ăn, không ăn cá (bớt)', r);
r = goi('dangKyCom', cnX[1], NG, true, { 'Cá kho': 'd', 'Canh cua': 'd', 'Món lạ': 'b' });
ok(r.ok && r.bo['Cá kho'] === 'd' && r.bo['Canh cua'] === 'b' && !r.bo['Món lạ'], 'người 2: đổi cá → trứng; canh cua không có món thay nên thành bớt; món ngoài danh sách bỏ qua', r.bo);
goi('dangKyCom', cnX[2], NG, true);
r = goi('dangKyCom', cnX[1], NG, true);
ok(r.ok && r.bo['Cá kho'] === 'd', 'bấm lại "Ăn" (không gửi lựa chọn): giữ lựa chọn bớt / đổi cũ', r.bo);
goi('dangKyCom', cnK[0], NG, true, { 'Cá kho': 'd' });
goi('dangKyCom', cnK[1], NG, false, { 'Cá kho': 'b' });
r = goi('napComTrua', cnK[1]);
ok(r.cuaToi[NG] === 0 && !Object.keys(r.cuaToiBo[NG] || {}).length, 'báo "Không ăn": không giữ lựa chọn bớt / đổi', r.cuaToiBo[NG]);
r = goi('napComTrua', cnX[1]);
ok(r.cuaToiBo[NG]['Cá kho'] === 'd', 'napComTrua trả lựa chọn của tôi (cuaToiBo)', r.cuaToiBo);

console.log('3. Trưởng phòng sửa hộ');
r = goi('dangKyComHo', tp, NG, [cnX[2].TenDangNhap], true, { 'Canh cua': 'b' });
ok(r.ok && r.bo['Canh cua'] === 'b', 'trưởng phòng chọn hộ: không ăn canh cua', r);
r = goi('dangKyComHo', tp, NG, [cnX[0].TenDangNhap, cnX[1].TenDangNhap], true, { 'Cá kho': 'd' });
r = goi('napComTrua', cnX[0]);
ok(r.cuaToiBo[NG]['Cá kho'] === 'b', 'đăng ký hộ nhiều người cùng lúc: không đè lựa chọn bớt / đổi của từng người', r.cuaToiBo[NG]);
r = goi('napComTrua', tp);
ok(r.hoDK[NG][cnX[2].TenDangNhap][3]['Canh cua'] === 'b', 'danh sách đăng ký hộ có lựa chọn bớt / đổi (hoDK[…][3])', r.hoDK[NG][cnX[2].TenDangNhap]);

console.log('4. Nhóm báo số suất bớt / đổi');
r = goi('baoSuatNhom', nhom, NG, 10, 0, { 'Cá kho': [6, 6] });
ok(!r.ok, 'bớt + đổi lớn hơn tổng suất: từ chối', r);
r = goi('baoSuatNhom', nhom, NG, 10, 0, { 'Cá kho': [2, 3], 'Canh cua': [1, 5] });
ok(r.ok && r.bo['Cá kho'][0] === 2 && r.bo['Cá kho'][1] === 3 && r.bo['Canh cua'][1] === 0, 'nhóm 10 suất: cá 2 không ăn + 3 đổi; canh cua không có món thay nên số đổi = 0', r.bo);

console.log('5. Tổng hợp cho bếp');
const th = c.comTongHop_(NG, { vaiTro: 'ADMIN' });
const ca = th.monDoi.find(m => m.m === 'Cá kho'), canh = th.monDoi.find(m => m.m === 'Canh cua');
// cá: bớt = người 1 + nhóm 2 = 3; đổi = người 2 + cnK[0] + nhóm 3 = 5
ok(ca.b === 3 && ca.d === 5 && ca.nau === th.an - 8 && ca.t === 'Trứng rán', 'Cá kho: 3 không ăn, 5 đổi trứng, nấu = tổng suất − 8', ca);
ok(canh.b === 3 && canh.d === 0, 'Canh cua: 3 không ăn (người 2, người 3 hộ, nhóm 1)', canh);
const xX = th.xuong.find(x => x.mx === tp.MaXuong);
ok(xX.mon['Cá kho'].b === 1 && xX.mon['Cá kho'].d === 1 && xX.dsMon.length === 4, 'theo xưởng: đếm + danh sách tên (ban điều hành thấy)', xX.mon);
const thBep = c.comTongHop_(NG, { vaiTro: 'BEP' });
ok(thBep.xuong.every(x => !x.dsMon) && thBep.monDoi.find(m => m.m === 'Cá kho').d === 5, 'bếp: thấy số, không thấy tên', thBep.monDoi);
const ct = c.comTinhThang_('2026-10').chiTiet.filter(r => r[0] === NG && /\(/.test(r[4]));
ok(ct.some(r => /không ăn Cá kho/.test(r[4])) && ct.some(r => /đổi Cá kho → Trứng rán/.test(r[4])), 'file lưu tháng ghi rõ "Ăn (không ăn Cá kho)" / "Ăn (đổi Cá kho → Trứng rán)"', ct.slice(0, 3));

console.log('5b. Nhóm có suất ăn ở nơi kia: bớt / đổi tách theo nơi (13/10)');
r = goi('baoSuatNhom', nhom, NG, 10, 3, { 'Cá kho': [2, 3, 2, 2] });
ok(!r.ok, '3 suất ở Hà Nam mà bớt + đổi ở Hà Nam = 4: từ chối', r);
r = goi('baoSuatNhom', nhom, NG, 10, 3, { 'Cá kho': [6, 2, 0, 0] });
ok(!r.ok, '7 suất ở Hà Nội mà bớt + đổi ở Hà Nội = 8: từ chối', r);
r = goi('baoSuatNhom', nhom, NG, 10, 3, { 'Cá kho': [2, 3, 1, 1], 'Canh cua': [1, 0, 0, 0] });
ok(r.ok && r.bo['Cá kho'].join() === '2,3,1,1' && r.bo['Canh cua'].join() === '1,0', 'nhóm 7 suất Hà Nội + 3 Hà Nam: cá kho Hà Nội 2 không ăn 3 đổi, Hà Nam 1 không ăn 1 đổi', r.bo);
const th2 = c.comTongHop_(NG, { vaiTro: 'ADMIN' }), ca2 = th2.monDoi.find(m => m.m === 'Cá kho');
ok(ca2.noi.haNoi.b === 2 && ca2.noi.haNoi.d === 3 && ca2.noi.haNoi.nau === th2.haNoi - 5, 'bếp Hà Nội: cá kho 2 không ăn, 3 đổi, nấu = suất Hà Nội − 5', [ca2.noi.haNoi, th2.haNoi]);
ok(ca2.noi.haNam.b === ca.b - 2 + 1 && ca2.noi.haNam.d === ca.d - 3 + 1 && ca2.noi.haNam.nau === th2.haNam - ca2.noi.haNam.b - ca2.noi.haNam.d, 'bếp Hà Nam: cộng thêm 1 không ăn + 1 đổi của nhóm ăn ở Hà Nam', [ca2.noi.haNam, th2.haNam]);
ok(ca2.b === ca2.noi.haNam.b + ca2.noi.haNoi.b && ca2.d === ca2.noi.haNam.d + ca2.noi.haNoi.d && ca2.nau === ca2.noi.haNam.nau + ca2.noi.haNoi.nau, 'tổng = Hà Nam + Hà Nội', ca2);
r = goi('baoSuatNhom', nhom, NG, 10, 0, { 'Cá kho': [2, 3, 1, 1] });
ok(r.ok && r.bo['Cá kho'].join() === '2,3' , 'báo lại không còn suất ở nơi kia: bỏ phần bớt / đổi ở nơi kia', r.bo);
r = goi('baoSuatNhom', nhom, NG, 10, 0, { 'Cá kho': [2, 3], 'Canh cua': [1, 5] });   // trả lại như mục 4 cho các bước sau

console.log('6. Khóa sau 22:00');
c.__datGio && c.__datGio('2026-10-12T22:05:00+07:00');
if (c.__datGio) { r = goi('dangKyCom', cnX[0], NG, true, { 'Cá kho': 'd' }); ok(!r.ok && r.khoa, 'quá 22:00: không đổi được', r); }

(async () => {
  if (F) {
    console.log('7. Giao diện');
    const { chromium } = require('/opt/node22/lib/node_modules/playwright');
    const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.route(/cdnjs|fonts\.g/, x => x.abort());
    const p = await ctx.newPage(); const loiJS = []; p.on('pageerror', e => loiJS.push(e.message)); p.on('dialog', d => d.accept());
    await p.goto('file://' + F); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("chienpham")');
    await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
    await p.evaluate(() => { try { maiGocDong(); } catch (e) {} go('com'); }); await p.waitForTimeout(800);
    await p.fill('#cmMon', 'Cơm trắng\nCá kho\nRau muống\nCanh cua');
    await p.fill('#cmMd .cm-md-dong:nth-child(1) .cm-md-m', 'Cá kho'); await p.fill('#cmMd .cm-md-dong:nth-child(1) .cm-md-t', 'Trứng rán');
    await p.fill('#cmMd .cm-md-dong:nth-child(2) .cm-md-m', 'Canh cua');
    await p.click('button:has-text("Lưu thực đơn")'); await p.waitForTimeout(1500);
    let s = await p.evaluate(() => [...document.querySelectorAll('.cm-the li')].map(x => x.textContent));
    ok(s.some(x => /Cá kho.*đổi được → Trứng rán/.test(x)) && s.some(x => /Canh cua.*bớt được/.test(x)), 'thẻ thực đơn đánh dấu món bớt / đổi được', s);
    ok(await p.evaluate(() => /Bấm Ăn trước/.test(document.querySelector('.cm-the .cm-bo-ds').textContent)), 'chưa đăng ký: nhắc bấm Ăn trước');
    await p.click('.cm-the .cm-nut.an'); await p.waitForTimeout(1500);
    s = await p.evaluate(() => [...document.querySelectorAll('.cm-the .cm-bo select')].map(e => [e.getAttribute('data-m'), [...e.options].map(o => o.textContent).join('|')]));
    ok(s.length === 2 && /Đổi sang Trứng rán/.test(s[0][1]) && !/Đổi sang/.test(s[1][1]), 'đã ăn: ô chọn từng món; món không có món thay chỉ có "Không ăn"', s);
    await p.selectOption('.cm-the .cm-bo select[data-m="Cá kho"]', 'd'); await p.waitForTimeout(1600);
    s = await p.evaluate(() => [COM.d.cuaToiBo['2026-10-13'], document.querySelector('.cm-the').textContent]);
    ok(s[0]['Cá kho'] === 'd' && /đổi Cá kho → Trứng rán/.test(s[1]), 'chọn đổi: lưu ngay, thẻ ghi "(đổi Cá kho → Trứng rán)"', s[0]);
    s = await p.evaluate(() => [document.querySelector('.cm-mon-doi') && document.querySelector('.cm-mon-doi').textContent, [...document.querySelector('.cm-bang thead tr').cells].map(x => x.textContent)]);
    ok(/Cá kho: nấu \d+ suất · Trứng rán: 1 suất/.test(s[0]) && s[1].includes('Bớt / đổi món'), 'tổng hợp: "Cá kho: nấu N suất · Trứng rán: 1 suất" + cột Bớt / đổi món', s);
    let chep = ''; await p.evaluate(() => { window.__chep = ''; comChepCu = t => { window.__chep = t; }; try { navigator.clipboard.writeText = t => { window.__chep = t; return Promise.resolve(); }; } catch (e) {} });
    await p.click('button:has-text("Chép số suất gửi bếp")'); await p.waitForTimeout(300); chep = await p.evaluate(() => window.__chep);
    ok(/Cá kho: \d+ suất · Trứng rán: 1 suất/.test(chep), 'chép gửi bếp có dòng món đổi', chep);
    await p.setViewportSize({ width: 390, height: 800 }); await p.waitForTimeout(300);
    s = await p.evaluate(() => { const W = document.documentElement.clientWidth, o = []; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width && !e.closest('.cm-cuon') && getComputedStyle(e).position !== 'fixed') o.push(e.tagName + '.' + e.className + '#' + e.id + ' ' + Math.round(r.right)); }); return [document.documentElement.scrollWidth, o.slice(0, 6)]; });
    ok(s[0] <= 392, 'điện thoại: không tràn ngang', s);
    ok(!loiJS.length, 'không lỗi JS', loiJS);
    await b.close();
  }
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
