/**
 * Kiểm thử giao diện Điều phối sản xuất ở Việc hôm nay (08/11) trên bản xem thử số thật (có Sheet đơn).
 *   F=<bản xem thử .html> [CHUP=<thư mục ảnh>] [TP=tpson] node kpi-app/tests/dieu-phoi-web.js
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const F = process.env.F, CHUP = process.env.CHUP, TP = process.env.TP || 'tpson';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const vao = async (tk, w) => {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.route(/fonts\.g|cdnjs|jsdelivr/, r => r.abort());
    const p = await ctx.newPage(); p.__loi = []; p.on('pageerror', e => p.__loi.push(e.message)); p.on('dialog', d => d.accept());
    await p.goto('file://' + F); await p.waitForSelector('#xtGoiY');
    await p.evaluate(t => { document.getElementById('l_tk').value = t; document.getElementById('l_mk').value = 'demo'; login(); }, tk);
    await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 60000 }).catch(() => {});
    await p.evaluate(() => { try { maiGocDong() } catch (e) {} go('homnay'); });
    await p.waitForTimeout(1200); await p.waitForFunction(() => window.__soDangChay === 0, null, { timeout: 90000 }).catch(() => {});
    return [ctx, p];
  };
  const txt = p => p.evaluate(() => { const e = document.getElementById('dpHN'); return e ? e.innerText : null; });
  const tran = p => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  let [ctx, p] = await vao('chienpham', 1300), t = await txt(p);
  console.log('\n1. Chủ sở hữu');
  ok(t && /Cách đếm sản lượng xưởng/.test(t) && /Nút cổ chai/.test(t) && /Dòng chảy giữa các xưởng/.test(t) && /Sức khỏe dữ liệu/.test(t), 'đủ 4 thẻ điều phối');
  ok(await p.$('button[onclick="dpApDem()"]'), 'có nút Áp dụng đề xuất');
  await p.evaluate(() => dpViecTai(false)); await p.waitForTimeout(1200); await p.waitForFunction(() => window.__soDangChay === 0, null, { timeout: 90000 }).catch(() => {});
  t = await txt(p); ok(/Đơn ưu tiên · \d+ đơn/i.test(t) && /Xem xưởng/i.test(t), 'việc theo xưởng: nhóm Ưu tiên + chọn xưởng');
  await p.selectOption('#dpX', 'SON'); await p.waitForTimeout(800);
  ok(/Chuôi/.test(await txt(p)) && !/Ngọn \d/.test((await txt(p)).split(/Xem xưởng/i)[1] || ''), 'đổi sang Sơn: chỉ chuôi / nối');
  if (CHUP) await (await p.$('#dpHN')).screenshot({ path: CHUP + '/dp-chu.png' });
  await p.click('button[onclick="dpApDem()"]'); await p.waitForTimeout(1500); await p.waitForFunction(() => window.__soDangChay === 0, null, { timeout: 90000 }).catch(() => {});
  t = await txt(p); ok(!/Cách đếm sản lượng xưởng – Claude đề xuất/.test(t) && !/chưa áp dụng/.test(t), 'bấm Áp dụng: thẻ đề xuất biến mất, hết cờ "chưa áp dụng"');
  ok(!p.__loi.length, 'không lỗi JS', p.__loi); await ctx.close();
  console.log('\n2. Ban điều hành');
  [ctx, p] = await vao('giamdoc', 1300); t = await txt(p);
  ok(t && /Nút cổ chai/.test(t) && !(await p.$('button[onclick="dpApDem()"]')) && !/Việc theo xưởng hôm nay/i.test(t), 'thấy điều phối, không có nút áp dụng, không có việc theo xưởng');
  ok(!p.__loi.length, 'không lỗi JS', p.__loi); await ctx.close();
  console.log('\n3. Trưởng phòng ' + TP + ' (điện thoại)');
  [ctx, p] = await vao(TP, 390); t = await txt(p);
  ok(t && /Hôm nay xưởng tôi làm gì trước/i.test(t) && !/Nút cổ chai/i.test(t) && !/Xem xưởng/i.test(t), 'chỉ thấy việc xưởng mình, không chọn xưởng khác, không thấy điều phối');
  ok(/Còn [\d.]+ /.test(t) && /(Đơn ưu tiên|Trễ hạn|Theo hạn đơn) · \d+ đơn/.test(t), 'có tổng + tiêu đề nhóm');
  ok(await tran(p) <= 0, 'điện thoại không tràn ngang', await tran(p));
  if (CHUP) await (await p.$('#dpHN')).screenshot({ path: CHUP + '/dp-tp-dt.png' });
  ok(!p.__loi.length, 'không lỗi JS', p.__loi); await ctx.close();
  console.log('\n4. Công nhân');
  [ctx, p] = await vao(process.env.CN || 'c040', 390); ok((await txt(p)) === null, 'công nhân không có khối điều phối'); await ctx.close();
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
