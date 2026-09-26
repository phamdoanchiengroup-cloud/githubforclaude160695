/**
 * Mở tools/preview.html bằng Playwright, nối google.script.run → bản mô phỏng, chụp các tab.
 * Chạy: python3 tools/xem-truoc.py && PW=/opt/node22/lib/node_modules/playwright node tools/chup.js
 * Biến: W=390 (điện thoại), TOKEN=<token> (đăng nhập sẵn).
 */
const { chromium } = require(process.env.PW || 'playwright');
const { ctx } = require('./gia-lap.js');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: +(process.env.W || 1366), height: 900 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  await p.exposeFunction('srv', (n, a) => { try { return JSON.stringify({ kq: ctx[n].apply(null, JSON.parse(a)) }); } catch (e) { return JSON.stringify({ loi: e.message }); } });
  if (process.env.TOKEN) await p.addInitScript(t => localStorage.setItem('tcc_token', t), process.env.TOKEN);
  await p.goto('file://' + __dirname + '/preview.html'); await p.waitForTimeout(7000);
  for (const t of ['chart', 'tong', 'vh', 'battu', 'astro', 'so', 'hd', 'halac']) {
    const el = await p.$('.tab[data-tab=' + t + ']'); if (!el) continue;
    await el.click(); await p.waitForTimeout(500);
    await p.screenshot({ path: __dirname + '/chup-' + t + '.png', fullPage: true });
  }
  console.log('lỗi trang:', errs); await b.close();
})();
