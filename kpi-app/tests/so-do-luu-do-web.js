const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
/** Kiểm thử 03/11: lưu đồ sản xuất trên tab Sơ đồ (khung nổi, quyền như tab Quy trình) + dòng hàng trong 3D.
 *    F=$S/xem-thu.html THREE=<gói npm three@0.160.0> OUT=<thư mục ảnh> node tests/so-do-luu-do-web.js   (không có THREE thì bỏ phần 3D) */
const F = 'file://' + process.env.F, THREE = process.env.THREE || '', OUT = process.env.OUT || '';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk) {
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  if (THREE) await ctx.route(/cdn\.jsdelivr\.net\/npm\//, r => { const u = r.request().url(), g = 'three@0.160.0/';
    if (!u.includes(g)) return r.abort(); r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(THREE, u.split(g)[1])) }); });
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(tk => { document.getElementById('l_tk').value = tk; document.getElementById('l_mk').value = 'demo'; login(); }, tk);
  await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 30000 });
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });
  await p.evaluate(() => go('sodo')); await p.waitForFunction(() => window.__sdDaNap && document.querySelectorAll('#sdMb .phong').length > 0, null, { timeout: 30000 });
  return p;
}
const chonKhu = (p, ma) => p.evaluate(ma => { for (let fi = 0; fi < 3; fi++) { const ri = SD_DATA[fi].rooms.findIndex(r => SS.xuong(fi, r) === ma); if (ri >= 0) { sdDatTang(fi); sdChonPhong(ri); return SD_DATA[fi].rooms[ri].n; } } return ''; }, ma);
const choKhung = p => p.waitForFunction(() => { const k = document.getElementById('sdLd'); return k && !k.hidden && !document.querySelector('#sdLdThan .pdesc'); }, null, { timeout: 30000 });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });

  console.log('1. Chủ sở hữu (chienpham)');
  let p = await vao(b, 'chienpham');
  let khu = await chonKhu(p, 'PHOICB');
  let s = await p.evaluate(() => !!document.querySelector('#sdCt button[onclick^="sdLuuDo"]'));
  ok(khu && s, 'chạm khu "' + khu + '" (Phôi Carbon): thẻ chi tiết có nút "Xem lưu đồ sản xuất của xưởng"', khu);
  await p.click('#sdCt button[onclick^="sdLuuDo"]'); await choKhung(p); await p.waitForTimeout(700);
  s = await p.evaluate(() => ({ ten: document.getElementById('sdLdTen').textContent, the: document.querySelectorAll('#sdLdThan .qt-xw .qt-o').length, duong: document.querySelectorAll('#sdLdThan svg.qt-duong path.nen').length,
    doc: !!document.querySelector('#sdLdThan .qt-xg.doc'), so: /người/.test(document.getElementById('sdLdThan').textContent), z: +getComputedStyle(document.getElementById('sdLd')).zIndex }));
  ok(/Phôi Carbon/.test(s.ten) && s.the > 3 && s.duong > 3 && s.doc && s.so && s.z > 8000, 'khung lưu đồ xưởng Phôi Carbon: lưu đồ dọc, có số người, có mũi tên, nổi trên lớp 3D', s);
  if (OUT) await p.screenshot({ path: OUT + '/sd-luu-do-xuong.png' });
  await p.click('#sdLdThan .qt-xw .qt-o >> nth=0'); await p.waitForTimeout(400);
  s = await p.evaluate(() => [tabHienTai, !document.getElementById('sdLd').hidden, !!document.querySelector('#sdLdThan .qt-con')]);
  ok(s[0] === 'sodo' && s[1] && s[2], 'bấm 1 thẻ nhóm: mở bảng công đoạn ngay trong khung, không nhảy sang tab Quy trình', s);
  await p.click('#sdLdTab button:has-text("Toàn nhà máy")'); await p.waitForTimeout(700);
  s = await p.evaluate(() => ({ o: document.querySelectorAll('#sdLdThan .qt-nmw .qt-o[data-x]').length, duong: document.querySelectorAll('#sdLdThan .qt-nmw path.nen').length, ten: document.getElementById('sdLdTen').textContent }));
  ok(s.o >= 9 && s.duong >= 8 && /toàn nhà máy/i.test(s.ten), 'tab "Toàn nhà máy": 9 ô xưởng + đường nối', s);
  if (OUT) await p.screenshot({ path: OUT + '/sd-luu-do-nha-may.png' });
  await p.click('#sdLdThan .qt-nmw .qt-o[data-x="SON"]'); await p.waitForTimeout(600);
  s = await p.evaluate(() => [document.getElementById('sdLdTen').textContent, tabHienTai]);
  ok(/Sơn/.test(s[0]) && s[1] === 'sodo', 'bấm ô Sơn trên lưu đồ nhà máy: khung chuyển sang lưu đồ xưởng Sơn', s);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  s = await p.evaluate(() => [document.getElementById('sdLd').hidden, tabHienTai, document.querySelector('#sdLdThan').innerHTML.length]);
  ok(s[0] && s[1] === 'sodo' && s[2] === 0, 'Esc: đóng khung, vẫn ở tab Sơ đồ', s);
  await chonKhu(p, 'HT'); await p.click('#sdCt button[onclick^="sdLuuDo"]'); await choKhung(p);
  await p.click('#sdLdTab button:has-text("Mở tab Quy trình")'); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [tabHienTai, window.QTX, window.QTV]);
  ok(s[0] === 'qt' && s[1] === 'HT' && s[2] === 'x', '"Mở tab Quy trình ↗": sang tab Quy trình đúng xưởng Hoàn thiện', s);
  ok(!p.loi.length, 'chủ sở hữu: không lỗi JS', p.loi);

  if (THREE) {
    console.log('\n2. 3D: không có phần quy trình (07/11 chủ dự án bỏ)');
    await p.evaluate(() => go('sodo')); await p.waitForTimeout(800);
    await p.evaluate(() => sdMo3D());
    const f3 = await (await p.waitForSelector('#sd3d iframe', { state: 'attached', timeout: 120000 })).contentFrame();
    await f3.waitForSelector('#c3d canvas', { state: 'attached', timeout: 180000 }); await p.waitForTimeout(2000);
    s = await f3.evaluate(() => [!!document.getElementById('btnDongHang'), typeof window.dh3MoLD, !!document.querySelector('.ss-ld')]);
    ok(!s[0] && s[1] === 'undefined' && !s[2], '3D: không còn nút "Dòng hàng", không có nút lưu đồ trong thẻ phòng', s);
    ok(!p.loi.length, '3D: không lỗi JS', p.loi);
  }
  await p.context().close();

  console.log('\n3. Trưởng phòng Đóng gói (tpdg)');
  p = await vao(b, 'tpdg');
  const xu = await p.evaluate(() => ME.xuong);
  await chonKhu(p, xu);
  ok(await p.evaluate(() => !!document.querySelector('#sdCt button[onclick^="sdLuuDo"]')), 'khu của xưởng mình (' + xu + '): có nút xem lưu đồ');
  await p.click('#sdCt button[onclick^="sdLuuDo"]'); await choKhung(p); await p.waitForTimeout(600);
  s = await p.evaluate(() => ({ the: document.querySelectorAll('#sdLdThan .qt-xw .qt-o').length }));
  ok(s.the > 0, 'TP: thấy lưu đồ xưởng mình', s);
  await p.click('#sdLdTab button:has-text("Toàn nhà máy")'); await p.waitForTimeout(600);
  s = await p.evaluate(() => ({ cua: document.querySelectorAll('#sdLdThan .qt-o.cua').length, so: [...document.querySelectorAll('#sdLdThan .qt-nmw .qt-o')].some(e => /người|%/.test(e.textContent)) }));
  ok(s.cua === 1 && !s.so, 'TP: lưu đồ nhà máy không số, xưởng mình tô sáng', s);
  await p.click('#sdLdDong');
  const khac = await p.evaluate(x => ['PHOICB', 'SON', 'HT'].find(m => m !== x), xu);
  await chonKhu(p, khac);
  ok(await p.evaluate(() => !document.querySelector('#sdCt button[onclick^="sdLuuDo"]')), 'khu của xưởng khác (' + khac + '): không có nút');
  ok(!p.loi.length, 'TP: không lỗi JS', p.loi);
  await p.context().close();

  console.log('\n4. Ban điều hành (giamdoc)');
  p = await vao(b, 'giamdoc');
  await chonKhu(p, 'PHOICB');
  s = await p.evaluate(() => [!!document.querySelector('#sdCt button[onclick^="sdLuuDo"]'), sdCoLuuDo('PHOICB')]);
  ok(!s[0] && !s[1], 'ban điều hành (không phải chủ sở hữu): không có nút lưu đồ', s);
  ok(!p.loi.length, 'BĐH: không lỗi JS', p.loi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
