const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-huong-dan-cn.html (Mai hướng dẫn công nhân nhập sản lượng):  S=<thư mục ảnh> node tests/demo-huong-dan-cn.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-huong-dan-cn.html'), S = (process.env.S || '/tmp') + '/hd/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const chu = p => p.evaluate(() => document.getElementById('loi').textContent);
const choChu = async (p, re, ms = 6000) => { for (let t = 0; t < ms; t += 150) { if (re.test(await chu(p))) return true; await p.waitForTimeout(150); } return false; };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 } });
  const p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
  await p.goto(F); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.getElementById('chao').classList.contains('an')), 'đăng nhập lần đầu: hiện màn chào của Mai');
  ok(await p.evaluate(() => document.querySelectorAll('#maiTo .mat-g').length === 2), 'nhân vật có đủ 2 mắt, đuôi tóc, tay');

  console.log('\nXem hướng dẫn');
  await p.click('#chaoXem');
  let buoc = 0;
  for (let k = 0; k < 20; k++) {
    const tt = await p.evaluate(() => ({ i: __hd.TH.i, n: __hd.BUOC.length, an: document.getElementById('nutTiep').style.display === 'none' }));
    buoc = Math.max(buoc, tt.i + 1);
    if (tt.an) break;
    await p.waitForFunction(() => !document.getElementById('nutTiep').disabled, null, { timeout: 15000 });
    if (tt.i === 7) await p.screenshot({ path: S + 'buoc-so-luong.png' });
    await p.click('#nutTiep'); await p.waitForTimeout(250);
  }
  ok(buoc === 14, 'đi hết 14 bước bằng nút Tiếp', buoc);
  const st = await p.evaluate(() => __hd.lay().dong);
  ok(st.length === 2 && st[0].ma === 'MB' && st[0].sl === 412 && st[0].loi === 3 && st[1].ma === 'LR' && st[1].sl === 380, 'Mai tự gõ thử: 2 dòng Mài bóng 412/3, Lắp ráp 380/0', st);
  ok(/Nhớ 4 điều/.test(await chu(p)) && await p.locator('.chon-hang .nut').count() === 2, 'bước cuối: tóm tắt 4 điều + nút Tự làm thử / Đóng');

  console.log('\nTự làm thử – Mai bắt lỗi theo đúng quy tắc của web');
  await p.locator('.chon-hang .nut', { hasText: 'Tự làm thử' }).click(); await p.waitForTimeout(600);
  await p.click('#nutTiep');
  ok(await choChu(p, /chưa có.*số lượng/i), 'chưa nhập số lượng → Mai nhắc, rọi đúng ô', await chu(p));
  await p.fill('#f_sl0', '5'); await p.fill('#f_loi0', '9'); await p.locator('#f_loi0').blur();
  ok(await choChu(p, /lớn hơn số lượng/), 'số lỗi lớn hơn số lượng → Mai nhắc ngay khi rời ô', await chu(p));
  ok(await p.evaluate(() => document.getElementById('maiNho').classList.contains('lo')), 'Mai đổi sang nét mặt lo lắng');
  await p.screenshot({ path: S + 'thu-loi.png' });
  await p.fill('#f_sl0', '412'); await p.fill('#f_loi0', '3');
  await p.fill('#f_socd', '2'); await p.click('#f_dat'); await p.waitForTimeout(300);
  ok(await choChu(p, /cùng là.*Mài bóng/), 'thêm dòng bị trùng công đoạn → Mai chỉ cách gộp', await chu(p));
  await p.selectOption('#f_cd1', 'LR'); await p.fill('#f_sl1', '38000'); await p.locator('#f_sl1').blur();
  ok(await choChu(p, /hơi nhiều/), 'số quá lớn (38.000) → Mai hỏi có gõ thừa số 0 không', await chu(p));
  await p.fill('#f_sl1', '380');
  await p.click('#nutTiep');
  await p.waitForSelector('#xnGui', { timeout: 6000 });
  const tom = await p.evaluate(() => document.querySelector('.tom').textContent);
  ok(/Mài bóng412 cái · lỗi 3/.test(tom) && /Lắp ráp380 cái · lỗi 0/.test(tom) && /Tổng792 cái · lỗi 3/.test(tom), 'trước khi gửi: Mai đọc lại từng dòng + tổng', tom);
  await p.screenshot({ path: S + 'thu-xac-nhan.png' });
  await p.click('#xnGui'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => __hd.lay().daGui[0].sl === 792 && __hd.lay().daGui[0].tt === 'cho') && await choChu(p, /Chờ duyệt/), 'gửi xong: dòng mới "Chờ duyệt", Mai khen');

  console.log('\nMàn chào, phím tắt, điện thoại');
  await p.click('#nutLui'); ok(!(await p.evaluate(() => document.getElementById('hd').classList.contains('mo'))), 'Xong / Thoát đóng hướng dẫn');
  await p.click('#nutDangNhap'); await p.check('#khongHien'); await p.click('#chaoBo');
  await p.reload(); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.getElementById('chao').classList.contains('an')), '"Không hiện lại khi đăng nhập": lần sau không tự hiện');
  await p.click('#nutTro'); await p.waitForTimeout(300); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __hd.TH.i === 1), 'nút "? Hướng dẫn" mở lại; phím → sang bước sau');
  await p.keyboard.press('Escape'); ok(!(await p.evaluate(() => document.getElementById('hd').classList.contains('mo'))), 'Esc đóng');
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); await m.goto(F); await m.waitForTimeout(400);
  await m.click('#chaoXem'); await m.waitForTimeout(1500);
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: S + 'dien-thoai.png' });
  const r = await (await b.newContext({ reducedMotion: 'reduce' })).newPage(); await r.goto(F); await r.waitForTimeout(300);
  ok(await r.evaluate(() => getComputedStyle(document.querySelector('#maiTo .duoi')).animationName === 'none'), 'giảm chuyển động: Mai đứng yên');
  await r.click('#chaoXem'); await r.waitForTimeout(200);
  ok(/Chào bạn/.test(await r.evaluate(() => document.getElementById('loi').textContent)), 'giảm chuyển động: lời thoại hiện ngay, không gõ từng chữ');
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
