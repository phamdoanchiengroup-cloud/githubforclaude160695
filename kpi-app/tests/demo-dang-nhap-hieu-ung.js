const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-dang-nhap-hieu-ung.html (màn Khắc laser + dây kéo bật đèn + nút chạy trốn):  node tests/demo-dang-nhap-hieu-ung.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-dang-nhap-hieu-ung.html');
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function mo(b, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: 960 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true } : {}, o.giam ? { reducedMotion: 'reduce' } : {}));
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', x => p.loi.push(x.message));
  await p.goto(F); await p.waitForTimeout(1500);
  const fr = p.frames().filter(x => x !== p.mainFrame());
  return { p, moi: fr[0], cu: fr[1], ctx };
}
const toi = f => f.evaluate(() => [document.getElementById('gate').classList.contains('lk-chuabat'), !!document.getElementById('lkToi'), getComputedStyle(document.querySelector('.lk-kinh')).opacity]);
(async () => {
  const b = await chromium.launch();
  console.log('— máy tính: dây kéo');
  let { p, moi, cu, ctx } = await mo(b);
  let t = await toi(moi);
  ok(t[0] && t[1] && +t[2] < .05, 'mở trang: tối đen, chỉ có dây, ô đăng nhập ẩn', t);
  ok(await moi.evaluate(() => document.activeElement && document.activeElement.classList.contains('num')), 'nút kéo dây được chọn sẵn (bấm Enter là bật đèn)');
  const h = await moi.locator('.lk-day .num').boundingBox();
  await p.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await p.mouse.down(); await p.mouse.move(h.x + h.width / 2, h.y + 30, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(500);
  ok((await toi(moi))[0], 'kéo ngắn (dưới 50px) rồi thả: dây bật về, đèn chưa sáng');
  await p.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await p.mouse.down(); await p.mouse.move(h.x + h.width / 2, h.y + 110, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(1900);
  t = await toi(moi);
  ok(!t[0] && !t[1] && +t[2] > .95, 'kéo dây đủ xa: đèn sáng, màn tối và dây biến mất, ô đăng nhập hiện ra', t);
  ok(await moi.evaluate(() => document.activeElement && document.activeElement.id === 'l_tk'), 'đèn sáng xong con trỏ nằm sẵn ở ô Mã nhân viên');

  console.log('— máy tính: nút chạy trốn');
  const g = await moi.locator('#gate').boundingBox();
  let ngoai = 0;
  for (let i = 0; i < 7; i++) {
    const r = await moi.locator('#btnLogin').boundingBox();
    await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 3 }); await p.waitForTimeout(380);
    const r2 = await moi.locator('#btnLogin').boundingBox();
    if (r2.x < g.x - 1 || r2.y < g.y - 1 || r2.x + r2.width > g.x + g.width + 1 || r2.y + r2.height > g.y + g.height + 1) ngoai++;
    if (i === 0) ok(Math.hypot(r2.x - r.x, r2.y - r.y) > 80, 'chưa điền gì mà rê chuột vào nút: nút né đi chỗ khác', [r, r2]);
  }
  ok(ngoai === 0, 'nút luôn nằm trong màn hình, không chạy ra ngoài', ngoai);
  let s = await moi.evaluate(() => [document.getElementById('rhMaiNoi').textContent, document.getElementById('bbOTk').classList.contains('thieu'), document.getElementById('btnLogin').className]);
  ok(/chưa điền đủ|Thôi được rồi/.test(s[0]) && s[1], 'Mai nhắc điền đủ, ô còn trống nhấp nháy vàng', s);
  ok(/met/.test(s[2]), 'né 6 lần thì nút "mệt", đứng yên lắc đầu', s[2]);
  await moi.click('#l_tk'); await moi.press('#l_tk', 'Enter'); await moi.press('#l_mk', 'Enter'); await p.waitForTimeout(300);
  ok(await moi.evaluate(() => !document.getElementById('lerr').classList.contains('hide')), 'chưa điền mà nhấn Enter: vẫn báo lỗi bình thường (không bị nút chạy chặn)');
  await moi.type('#l_tk', 'c068'); await moi.type('#l_mk', 'demo'); await p.waitForTimeout(700);
  s = await moi.evaluate(() => [document.getElementById('btnLogin').style.transform, document.getElementById('btnLogin').className, document.getElementById('rhMaiNoi').textContent]);
  ok(s[0] === '' && !/chay/.test(s[1]), 'điền đủ: nút bay về chỗ cũ', s);
  const r = await moi.locator('#btnLogin').boundingBox();
  await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 3 }); await p.waitForTimeout(300);
  const r3 = await moi.locator('#btnLogin').boundingBox();
  ok(Math.abs(r3.x - r.x) < 2 && Math.abs(r3.y - r.y) < 2, 'điền đủ rồi thì rê chuột vào nút không chạy nữa');
  await p.mouse.click(r3.x + r3.width / 2, r3.y + r3.height / 2); await p.waitForTimeout(1100 + 1400);
  ok(await moi.evaluate(() => document.getElementById('demoXong').classList.contains('hien')), 'bấm Đăng nhập với "demo": vào được');
  await p.click('[data-b=cu]'); await p.waitForTimeout(300);
  ok(await cu.evaluate(() => !document.getElementById('lkToi') && !document.getElementById('gate').classList.contains('lk-chuabat')), 'tab "Hiện tại" (không bật hiệu ứng): không có màn tối');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— bàn phím');
  ({ p, moi, ctx } = await mo(b));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1900);
  ok(!(await toi(moi))[0], 'nhấn Enter ở dây: đèn sáng (dùng được không cần chuột)');
  await ctx.close();

  console.log('— điện thoại (cảm ứng)');
  ({ p, moi, ctx } = await mo(b, { w: 390, cham: true }));
  t = await toi(moi);
  ok(t[0] && t[1], 'điện thoại cũng có màn tối + dây', t);
  await moi.tap('.lk-day .num', { force: true }); await p.waitForTimeout(1900);
  ok(!(await toi(moi))[0], 'chạm vào dây: đèn sáng');
  const r4 = await moi.locator('#btnLogin').boundingBox(); await moi.tap('#btnLogin'); await p.waitForTimeout(300);
  const r5 = await moi.locator('#btnLogin').boundingBox();
  ok(Math.abs(r5.x - r4.x) < 2 && await moi.evaluate(() => !document.getElementById('lerr').classList.contains('hide')), 'cảm ứng: nút không chạy, bấm khi trống thì báo lỗi như thường');
  ok(await moi.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'không tràn ngang');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— giảm chuyển động');
  ({ p, moi, ctx } = await mo(b, { giam: true }));
  t = await toi(moi);
  ok(!t[0] && !t[1], 'máy bật "giảm chuyển động": bỏ qua màn tối, vào thẳng ô đăng nhập', t);
  await ctx.close();
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
