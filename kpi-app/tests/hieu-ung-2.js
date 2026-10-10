const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra đợt hiệu ứng 2 (giữ để duyệt, vuốt để duyệt, quầng sáng, tia lửa, bảng lật hạng, ly nước KPI)
 * trên bản xem thử 1 file:  S=<thư mục chứa hu/> node tests/hieu-ung-2.js
 */
const F = 'file://' + process.env.S + '/hu/xem-thu-hieu-ung.html', OUT = process.env.S + '/hu/';
let dem = 0, loiDem = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loiDem++; console.log('  ✗ ' + ten + (ct !== undefined ? ' → ' + JSON.stringify(ct).slice(0, 220) : '')); } };
async function vao(b, tk, dt) {
  const ctx = await b.newContext(dt ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click(`#xtGoiY button:has-text("${tk}")`);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500); return p;
}
(async () => {
  const b = await chromium.launch();
  console.log('\n1. Giữ để duyệt (máy tính)');
  let p = await vao(b, 'tpdg');
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(900);
  const nut = p.locator('#main button.giu').first();
  ok(await nut.count() === 1 && (await nut.textContent()).includes('Giữ để duyệt'), 'nút Duyệt đổi thành "Giữ để duyệt"');
  const cho0 = await p.evaluate(() => D.choDuyet.length);
  const bx = await nut.boundingBox();
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2);
  await p.mouse.down(); await p.waitForTimeout(300); await p.mouse.up(); await p.waitForTimeout(900);
  ok(await p.evaluate(() => D.choDuyet.length) === cho0 && /Giữ nút/.test(await p.textContent('#toast')), 'thả tay sớm (0,3 giây): KHÔNG duyệt, nhắc giữ lâu hơn');
  await p.mouse.down(); await p.waitForTimeout(450);
  await p.screenshot({ path: OUT + 'giu.png', clip: { x: bx.x - 300, y: bx.y - 120, width: 520, height: 180 } });
  await p.waitForTimeout(500); await p.mouse.up();
  await p.waitForTimeout(2200);
  ok(await p.evaluate(() => D.choDuyet.length) < cho0, 'giữ đủ 0,8 giây: đã duyệt (' + cho0 + ' → ' + await p.evaluate(() => D.choDuyet.length) + ' dòng chờ)');
  // quầng sáng
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(900);
  const the = await p.locator('.hn-viec').first().boundingBox();
  await p.mouse.move(the.x + 120, the.y + 30); await p.waitForTimeout(150);
  const mx = await p.evaluate(() => document.querySelector('.hn-viec').style.getPropertyValue('--mx'));
  await p.screenshot({ path: OUT + 'quang.png', clip: { x: the.x - 10, y: the.y - 10, width: 900, height: 120 } });
  ok(mx === '120px', 'quầng sáng đi theo con trỏ trên thẻ', mx);
  // tia lửa khi lưu thành công
  await p.evaluate(() => go('nenep')); await p.waitForTimeout(800);
  await p.evaluate(() => { const bt = document.createElement('button'); bt.className = 'btn pri'; bt.id = 'thuTia'; bt.textContent = 'Lưu'; $('main').prepend(bt); bt.focus();
    const m = D.nhansu.filter(x => x.MaXuong === ME.xuong)[2].MaNV; call('ghiViPham', [{ MaNV: m, MaVP: D.dmvp[0].MaVP }], function () {}); });
  await p.waitForSelector('.tia', { state: 'attached', timeout: 3000 }).catch(() => {});
  ok(await p.evaluate(() => document.querySelectorAll('.tia i').length) === 10, 'lưu thành công: tia lửa tại nút');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);

  console.log('\n2. Vuốt để duyệt (điện thoại)');
  p = await vao(b, 'tpdg', true);
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(900);
  const v = p.locator('#main .vuot').first();
  ok(await v.count() === 1, 'có thanh "Vuốt để duyệt"');
  await v.evaluate(e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
  const c0 = await p.evaluate(() => D.choDuyet.length);
  const k = await p.locator('#main .vuot .vuot-nut').first().boundingBox(), tr = await v.boundingBox();
  // kéo nửa đường rồi thả: bật về, không duyệt
  await p.mouse.move(k.x + 20, k.y + 20); await p.mouse.down(); await p.mouse.move(k.x + 20 + tr.width * 0.4, k.y + 20, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(800);
  ok(await p.evaluate(() => D.choDuyet.length) === c0, 'vuốt nửa đường rồi thả: nút bật về, KHÔNG duyệt');
  await p.mouse.move(k.x + 20, k.y + 20); await p.mouse.down(); await p.mouse.move(k.x + 20 + tr.width * 0.7, k.y + 20, { steps: 6 });
  await p.screenshot({ path: OUT + 'vuot.png' });
  await p.mouse.move(k.x + tr.width, k.y + 20, { steps: 4 }); await p.mouse.up();
  await p.waitForTimeout(2200);
  ok(await p.evaluate(() => D.choDuyet.length) < c0, 'vuốt hết thanh: đã duyệt');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);

  console.log('\n3. Công nhân: bảng lật hạng, ly nước KPI');
  p = await vao(b, 'c068', true);
  await p.evaluate(() => go('kpicn')); await p.waitForTimeout(400);
  await p.waitForSelector('.kpi .v[data-lat]', { timeout: 6000 }).catch(() => {});
  await p.waitForTimeout(150);
  await p.screenshot({ path: OUT + 'lat-giua.png' });
  await p.waitForTimeout(2000);
  const h = await p.evaluate(() => { const e = document.querySelector('.kpi .v[data-lat]'); return e ? { t: e.textContent, o: e.querySelectorAll('.lat-o').length } : null; });
  await p.evaluate(() => document.querySelector('.kpi .v[data-lat]').scrollIntoView({block:'center'})); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'lat.png' });
  ok(h && /^#\d+ \/ \d+$/.test(h.t) && h.o >= 2, '"Hạng của bạn" lật từng số rồi dừng đúng: ' + (h && h.t), h);
  await p.evaluate(() => go('kpica')); await p.waitForTimeout(2200);
  const ly = await p.evaluate(() => { const l = document.querySelector('.gauge .ly'); return l ? { muc: l.style.getPropertyValue('--muc'), so: l.parentNode.querySelector('.gval').textContent } : null; });
  await p.screenshot({ path: OUT + 'ly.png' });
  ok(ly && Math.abs(100 - parseFloat(ly.muc) - Math.min(100, parseFloat(ly.so))) < 0.6, 'ly nước KPI dâng đúng mức ' + (ly && ly.so), ly);
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await b.close();
  console.log('\n' + (loiDem ? '✗ ' + loiDem + '/' + dem + ' LỖI' : '✓ Tất cả ' + dem + ' kiểm tra đạt'));
})();
