const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra màn đăng nhập Khắc laser TRÊN BẢN WEB (Index.html) với các hiệu ứng đã bật (10/10):
 *  cửa cuốn, nút chạy trốn, mắt Mai, két sắt, theo giờ.
 *    DATA=csdl.json OUT=$S/xem-thu.html node tests/tao-ban-xem-thu.js
 *    F=$S/xem-thu.html node tests/dang-nhap-web.js        (tài khoản trong bản xem thử, mật khẩu "demo") */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function mo(b, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true } : {}));
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', x => p.loi.push(x.message));
  await p.goto(F); await p.waitForTimeout(1800);
  await p.evaluate(() => { const g = document.getElementById('xtGoiY'); if (g) g.remove(); });   // khung gợi ý tài khoản chỉ có ở bản xem thử
  return { p, ctx };
}
const daVao = p => p.evaluate(() => !!window.ME && getComputedStyle(document.getElementById('gate')).display === 'none');
(async () => {
  const b = await chromium.launch();
  console.log('— máy tính');
  let { p, ctx } = await mo(b);
  let s = await p.evaluate(() => [!!document.getElementById('lkCua'), document.getElementById('gate').classList.contains('lk-chuabat'), !document.getElementById('lkDay')]);
  ok(s[0] && s[1] && s[2], 'mở web: cửa cuốn đóng, chưa thấy ô đăng nhập', s);
  const c = await p.locator('#lkCua').boundingBox();
  await p.mouse.move(c.x + c.width / 2, c.y + c.height * .75); await p.mouse.down(); await p.mouse.move(c.x + c.width / 2, c.y + c.height * .2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(1300);
  ok(await p.evaluate(() => !document.getElementById('lkCua') && document.activeElement.id === 'l_tk'), 'kéo cửa lên: cửa mở, con trỏ ở ô mã nhân viên');
  const r = await p.locator('#btnLogin').boundingBox();
  await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 3 }); await p.waitForTimeout(400);
  const r2 = await p.locator('#btnLogin').boundingBox();
  ok(Math.hypot(r2.x - r.x, r2.y - r.y) > 60, 'chưa điền mà rê chuột vào Đăng nhập: nút né đi', [r, r2]);
  await p.type('#l_tk', 'c068', { delay: 30 }); await p.waitForTimeout(200);
  ok(await p.evaluate(() => { const i = document.querySelector('#rhMaiAnh svg .rh-anh'); return !!i && /^data:image\/webp/.test(i.getAttribute('href')) && !document.querySelector('#rhMaiAnh .mat-g'); }), 'màn đăng nhập: chân dung tê giác Rhino (thay Mai)');
  ok(await p.evaluate(() => !!document.getElementById('bbChao') && document.getElementById('bbChao').textContent.length > 3), 'có lời chào theo giờ');
  await p.type('#l_mk', 'demo'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.getElementById('btnLogin').style.transform === ''), 'điền đủ: nút về chỗ cũ');
  await p.press('#l_mk', 'Enter'); await p.waitForTimeout(4500);
  ok(await daVao(p), 'đăng nhập "demo": vào được hệ thống');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— két sắt (sai 3 lần)');
  ({ p, ctx } = await mo(b));
  await p.evaluate(() => { const t = document.querySelector('#lkCua .tay'); if (t) t.click(); }); await p.waitForTimeout(1300);
  await p.fill('#l_tk', 'c068');
  for (let i = 0; i < 3; i++) { await p.fill('#l_mk', 'sai' + i); await p.press('#l_mk', 'Enter'); await p.waitForTimeout(2600); }
  await p.waitForTimeout(600);
  s = await p.evaluate(() => [!!document.getElementById('lkKet'), document.getElementById('l_mk').disabled]);
  ok(s[0] && s[1], 'sai 3 lần: khóa két sắt 30 giây', s);
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— điện thoại');
  ({ p, ctx } = await mo(b, { w: 390, cham: true }));
  await p.tap('#lkCua .tay', { force: true }); await p.waitForTimeout(1300);
  ok(await p.evaluate(() => !document.getElementById('lkCua')), 'chạm tay nắm: cửa cuốn mở');
  await p.tap('#btnLogin'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => /translate\(\d+px/.test(document.getElementById('btnLogin').style.transform)), 'chạm Đăng nhập khi trống: nút nhảy sang bên');
  await p.fill('#l_tk', 'c068'); await p.fill('#l_mk', 'demo'); await p.dispatchEvent('#l_mk', 'input'); await p.waitForTimeout(500);
  await p.tap('#btnLogin'); await p.waitForTimeout(4500);
  ok(await daVao(p), 'điền đủ rồi chạm Đăng nhập: vào được');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'không tràn ngang');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
