const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-dang-nhap.html (5 kiểu màn đăng nhập):  node tests/demo-dang-nhap.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-dang-nhap.html');
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1280, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.goto(F); await p.waitForTimeout(300);
    ok(await p.evaluate(() => window.__dn && __dn.KIEU.length === 5), 'có đủ 5 kiểu');
    for (let i = 0; i < 5; i++) {
      const id = 'ABCDE'[i];
      await p.evaluate(i => __dn.mo(i), i); await p.waitForTimeout(250);
      const k = '#khung ';
      await p.fill(k + '[data-tk]', 'c068');
      await p.fill(k + '[data-mk]', 'sai');
      await p.click(k + '[data-mat]');
      const loai = await p.getAttribute(k + '[data-mk]', 'type');
      await p.click(k + '[data-mat]');
      await p.click(k + '[data-dn]'); await p.waitForTimeout(1300);
      const bao = (await p.textContent(k + '[data-loi]')).trim();
      const vao1 = await p.evaluate(() => !!document.querySelector('#khung .vao-ok'));
      await p.fill(k + '[data-mk]', 'demo'); await p.press(k + '[data-mk]', 'Enter'); await p.waitForTimeout(4000);
      const vao2 = await p.evaluate(() => { const v = document.querySelector('#khung .vao-ok'); return v && v.classList.contains('hien') ? v.textContent : ''; });
      const tran = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      ok(loai === 'text' && bao.length > 3 && !vao1 && /c068/.test(vao2) && tran <= 0, id + ': 👁 hiện mật khẩu, sai báo lỗi, "demo" + Enter vào được, không tràn ngang', { loai, bao, vao1, vao2, tran });
    }
    // Mai che mắt khi gõ mật khẩu (kiểu C)
    await p.evaluate(() => __dn.mo(2)); await p.waitForTimeout(200);
    await p.focus('#khung [data-mk]'); await p.waitForTimeout(150);
    ok(await p.evaluate(() => document.querySelector('#khung svg.mai').classList.contains('che')), 'C: Mai che mắt khi gõ mật khẩu');
    ok(e.length === 0, 'không lỗi JS', e);
  }
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
