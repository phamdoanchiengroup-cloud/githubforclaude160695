const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-dang-nhap-hieu-ung-2.html (màn Khắc laser: nút nhảy khi chạm, cửa cuốn, mắt Mai, két sắt, theo giờ):
 *    node tests/demo-dang-nhap-hieu-ung-2.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-dang-nhap-hieu-ung-2.html');
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function mo(b, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: 1000 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true } : {}));
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', x => p.loi.push(x.message));
  await p.goto(F); await p.waitForTimeout(500);
  if (o.gio) await p.selectOption('#gio', o.gio);
  for (const k of ['cham', 'cua', 'mat', 'ket', 'gio']) if (o.tat && o.tat.includes(k)) await p.uncheck('[data-k=' + k + ']');
  await p.waitForTimeout(1300);
  return { p, f: () => p.frames()[1], ctx };
}
const moCua = async (p, f) => { const c = await f.locator('#lkCua').boundingBox(); await p.mouse.move(c.x + c.width / 2, c.y + c.height * .75); await p.mouse.down(); await p.mouse.move(c.x + c.width / 2, c.y + c.height * .2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(1200); };
(async () => {
  const b = await chromium.launch();
  console.log('— cửa cuốn + theo giờ (23:00)');
  let { p, f, ctx } = await mo(b, { gio: '23' });
  ok(await f().evaluate(() => !!document.getElementById('lkCua') && document.getElementById('gate').classList.contains('lk-chuabat') && !document.getElementById('lkDay')), 'mở trang: cửa cuốn đóng kín, chưa thấy ô đăng nhập (không còn dây kéo)');
  const c = await f().locator('#lkCua').boundingBox();
  await p.mouse.move(c.x + c.width / 2, c.y + c.height * .75); await p.mouse.down(); await p.mouse.move(c.x + c.width / 2, c.y + c.height * .62, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(700);
  ok(await f().evaluate(() => !!document.getElementById('lkCua') && !document.getElementById('lkCua').classList.contains('mo')), 'kéo cửa lên một chút rồi thả: cửa rơi xuống lại');
  await moCua(p, f());
  ok(await f().evaluate(() => !document.getElementById('lkCua') && !document.getElementById('gate').classList.contains('lk-chuabat') && document.activeElement.id === 'l_tk'), 'kéo cửa lên quá 1/3: cửa cuộn lên hết, ô đăng nhập hiện, con trỏ ở ô mã nhân viên');
  let s = await f().evaluate(() => [document.getElementById('gate').classList.contains('lk-dem'), document.getElementById('rhMaiNoi').textContent, document.getElementById('bbChao').textContent]);
  ok(s[0] && /Ca đêm/.test(s[1]) && /ca đêm/i.test(s[2]), '23:00: nền tông vàng ấm, Mai chúc "Ca đêm vất vả rồi"', s);

  console.log('— mắt Mai + Caps Lock');
  await f().type('#l_tk', 'c068', { delay: 40 }); await p.waitForTimeout(250);
  s = await f().evaluate(() => [...document.querySelectorAll('#rhMaiAnh .mat-g')].map(g => g.children[2].style.transform));
  ok(s.length === 2 && s.every(t => /translate\(-?[\d.]+px, 3px\)/.test(t)), 'gõ mã nhân viên: hai con ngươi của Mai đưa theo chữ', s);
  await f().evaluate(() => lkCaps(true)); await p.waitForTimeout(150);
  s = await f().evaluate(() => [document.querySelector('#rhMaiAnh svg').getAttribute('class'), document.getElementById('rhMaiNoi').textContent, getComputedStyle(document.querySelector('#rhMaiAnh .bit-tai')).display]);
  ok(/bit/.test(s[0]) && /Chữ to quá/.test(s[1]) && s[2] !== 'none', 'bật Caps Lock: Mai bịt tai, nói "Chữ to quá!"', s);
  await f().evaluate(() => lkCaps(false));
  ok(await f().evaluate(() => !/bit/.test(document.querySelector('#rhMaiAnh svg').getAttribute('class'))), 'tắt Caps Lock: Mai bỏ tay xuống');

  console.log('— két sắt');
  for (let i = 0; i < 3; i++) { await f().fill('#l_mk', 'sai' + i); await f().press('#l_mk', 'Enter'); await p.waitForTimeout(1400); }
  await p.waitForTimeout(700);
  s = await f().evaluate(() => [!!document.getElementById('lkKet'), document.getElementById('l_mk').disabled, document.getElementById('btnLogin').disabled, +localStorage.getItem('lk_khoa_den') > Date.now(), document.getElementById('lkDem').textContent]);
  ok(s[0] && s[1] && s[2] && s[3] && +s[4] > 20, 'sai 3 lần liền: khóa kiểu két sắt, ô nhập + nút bị khóa, đếm ngược', s);
  await f().evaluate(() => { localStorage.setItem('lk_khoa_den', Date.now() + 500); clearInterval(LKK.hen); lkKhoaVe(Date.now() + 500); });
  await p.waitForTimeout(1600);
  s = await f().evaluate(() => [!!document.getElementById('lkKet'), document.getElementById('l_mk').disabled, localStorage.getItem('lk_khoa_den')]);
  ok(!s[0] && !s[1] && !s[2], 'hết giờ: cửa két mở, ô nhập dùng lại được', s);
  await f().fill('#l_mk', 'demo'); await f().press('#l_mk', 'Enter'); await p.waitForTimeout(2800);
  ok(await f().evaluate(() => document.getElementById('demoXong').classList.contains('hien')), 'mở khóa rồi gõ đúng "demo": vào được');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— nút nhảy khi chạm (máy tính giả chạm, 12:00)');
  ({ p, f, ctx } = await mo(b, { gio: '12', tat: ['cua'] }));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1900);
  s = await f().evaluate(() => [document.getElementById('rhMaiNoi').textContent, !document.getElementById('gate').classList.contains('lk-chuabat')]);
  ok(s[1] && /Ăn trưa/.test(s[0]), 'bỏ tích cửa cuốn thì lại là dây kéo (Enter để bật); 12:00 Mai hỏi "Ăn trưa chưa?"', s);
  await f().click('#btnLogin'); await p.waitForTimeout(500);
  s = await f().evaluate(() => [document.getElementById('btnLogin').style.transform, document.activeElement.id, document.getElementById('rhMaiNoi').textContent, document.getElementById('lerr').classList.contains('hide')]);
  ok(/translate\(\d+px/.test(s[0]) && s[1] === 'l_tk' && /chưa điền đủ/.test(s[2]) && s[3], 'chạm Đăng nhập khi trống: nút nhảy sang bên, ô trống được chọn, chưa báo lỗi', s);
  await f().click('#btnLogin'); await p.waitForTimeout(400); await f().click('#btnLogin'); await p.waitForTimeout(400);
  const truoc = await f().evaluate(() => document.getElementById('btnLogin').style.transform);
  await f().click('#btnLogin'); await p.waitForTimeout(400);
  s = await f().evaluate(() => [document.getElementById('btnLogin').style.transform, document.getElementById('lerr').classList.contains('hide')]);
  ok(s[0] === truoc && !s[1], 'nhảy 3 lần rồi thì đứng yên, chạm tiếp là báo lỗi như thường', s);
  await f().fill('#l_tk', 'c068'); await f().fill('#l_mk', 'demo'); await f().dispatchEvent('#l_mk', 'input'); await p.waitForTimeout(600);
  ok(await f().evaluate(() => document.getElementById('btnLogin').style.transform === ''), 'điền đủ: nút về chỗ cũ');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();

  console.log('— điện thoại thật (cảm ứng)');
  ({ p, f, ctx } = await mo(b, { w: 390, cham: true, tat: ['cham'] }));
  await p.click('[data-v=dt]'); await p.waitForTimeout(1300);
  await f().tap('#lkCua .tay', { force: true }); await p.waitForTimeout(1200);
  ok(await f().evaluate(() => !document.getElementById('lkCua')), 'chạm tay nắm cửa cuốn: cửa mở');
  await f().tap('#btnLogin'); await p.waitForTimeout(500);
  ok(await f().evaluate(() => /translate\(\d+px/.test(document.getElementById('btnLogin').style.transform)), 'trên điện thoại (không cần tích ô 1): chạm nút khi trống thì nút nhảy');
  ok(await f().evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'không tràn ngang');
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  await ctx.close();
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
