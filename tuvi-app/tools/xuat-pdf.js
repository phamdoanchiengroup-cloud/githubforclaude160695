/**
 * Xuất thử PDF bằng Playwright trên bản mô phỏng (tài khoản VIP giả, lá số mẫu của tools/preview.html).
 * Cần thư viện PDF cục bộ: cd tests && npm install --no-save html2canvas@1.4.1 jspdf@2.5.1
 * Chạy: python3 tools/xem-truoc.py && PW=/opt/node22/lib/node_modules/playwright node tools/xuat-pdf.js <file.pdf>
 * Biến: TYPE=full|demo, THEME=light|dark. Mất khoảng 2–3 phút cho bản đầy đủ.
 */
const { chromium } = require(process.env.PW || 'playwright');
const { ctx } = require('./gia-lap.js');
const OUT = process.argv[2] || __dirname + '/thu.pdf';
(async () => {
  const dk = ctx.dangKy('vipthu', 'matkhau123', 'VIP thử', '0912000333', '');
  const u = ctx.tkDoc_('vipthu'); u.vaiTro = 'vip'; ctx.tkGhi_('vipthu', u);
  const b = await chromium.launch(), errs = [];
  const p = await b.newPage({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  await p.exposeFunction('srv', (n, a) => { try { return JSON.stringify({ kq: ctx[n].apply(null, JSON.parse(a)) }); } catch (e) { return JSON.stringify({ loi: e.message }); } });
  await p.addInitScript(t => localStorage.setItem('tcc_token', t), dk.token);
  await p.goto('file://' + __dirname + '/preview.html'); await p.waitForTimeout(9000);
  await p.click('#btnPdfTop'); await p.waitForTimeout(500);
  await p.selectOption('#pdfType', process.env.TYPE || 'full'); await p.selectOption('#pdfTheme', process.env.THEME || 'light');
  const iv = setInterval(async () => { try { console.log('…', await p.evaluate(() => ((document.getElementById('pdfTienTrinh') || {}).textContent || '') + ' | tab: ' + document.body.getAttribute('data-tab') + ' | che màn hình: ' + document.getElementById('loading').classList.contains('show'))); } catch (e) {} }, 20000);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 600000 }), p.click('#pdfGo')]);
  clearInterval(iv); await dl.saveAs(OUT);
  console.log('Đã lưu', OUT, '· lỗi trang:', errs); await b.close();
})();
