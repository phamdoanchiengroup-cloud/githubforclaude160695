const { chromium, devices } = require('/opt/node22/lib/node_modules/playwright');
/** 28/11 – đánh giá bố cục + bỏ mục Kỹ năng + ẩn cột các xưởng ở bảng trạng thái đơn (thay ky-nang-web.js: tab Kỹ năng đã bỏ khỏi web).
 *    DATA=csdl.json DH=dh.json OUT=$S/xt.html GIO=2026-11-28T15:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/bo-cuc-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => { const b = await chromium.launch();
  const vao = async (tk, opt) => { const p = await b.newPage(opt || { viewport: { width: 1440, height: 900 } }); p.__L = []; p.on('pageerror', e => p.__L.push(e.message)); p.on('dialog', d => d.accept()); await p.route(/fonts\.g|cdnjs/, r => r.abort());
    await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.evaluate(tk => { localStorage.clear(); l_tk.value = tk; l_mk.value = 'demo'; login(); }, tk);
    await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 90000 }).catch(() => {}); await p.waitForTimeout(800); return p; };
  console.log('1. Bỏ mục Kỹ năng');
  for (const tk of ['chienpham', 'tpson', 'c068']) { const p = await vao(tk);
    const r = await p.evaluate(() => [dsTabHienCo().some(t => t[0] === 'kyn'), !!document.querySelector('#nav [data-k="kyn"],#botbar [data-k="kyn"]'), (go('kyn'), tabHienTai)]);
    ok(!r[0] && !r[1] && r[2] !== 'kyn', tk + ': không còn tab / nút Kỹ năng; lối vào cũ chuyển về trang chính', r); ok(!p.__L.length, tk + ': không lỗi JS', p.__L); await p.close(); }
  console.log('2. Bảng trạng thái đơn: ẩn cột các xưởng');
  { const p = await vao('tpson'); await p.evaluate(() => go('dh')); await p.waitForTimeout(4500);
    const th = () => p.evaluate(() => [...document.querySelectorAll('.dh-sh thead tr:first-child th')].map(x => x.textContent.trim()));
    let a = await th(); ok(a.includes('Sơn') && !a.includes('Phôi') && !a.some(x => /Đang ở/.test(x)), 'TP Sơn: chỉ thấy cột bộ phận mình, ẩn các xưởng khác + Đang ở / Xác nhận', a);
    ok(await p.evaluate(() => { const t = document.querySelector('.dh-sh'), w = document.querySelector('.dh-shw'); return t && w && t.getBoundingClientRect().width <= w.getBoundingClientRect().width + 2; }), 'bảng vừa khung, không cuộn ngang');
    await p.evaluate(() => [...document.querySelectorAll('button')].find(x => /Hiện cột các xưởng/.test(x.textContent)).click()); await p.waitForTimeout(800);
    a = await th(); ok(a.includes('Phôi') && a.some(x => /Đang ở/.test(x)), 'bấm "Hiện cột các xưởng" → đủ cột', a);
    ok(!p.__L.length, 'không lỗi JS', p.__L); await p.close(); }
  console.log('3. Bố cục');
  { const p = await vao('chienpham'); await p.evaluate(() => go('ns')); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.querySelectorAll('#main .card.gon-the').length >= 2), 'Nhân sự: form Thêm / Cho nghỉ việc thu gọn');
    await p.evaluate(() => go('nenep')); await p.waitForTimeout(1200);
    ok(await p.evaluate(() => document.documentElement.scrollHeight < 4000 && getComputedStyle(document.getElementById('festbar')).display === 'none'), 'Nề nếp: 1 xưởng (trang ngắn), không hiện băng Tết');
    await p.close(); }
  { const p = await vao('tpcnc'); await p.evaluate(() => go('bh')); await p.waitForTimeout(4500);
    ok(await p.evaluate(() => document.querySelectorAll('.of-the').length <= 12 && document.documentElement.scrollHeight < 9000), 'Order-Flow: tối đa 12 thẻ, trang ngắn', await p.evaluate(() => [document.querySelectorAll('.of-the').length, document.documentElement.scrollHeight])); await p.close(); }
  console.log('4. 28/11 tối: đơn ưu tiên gộp kênh Kho + cột Mã sản phẩm chỉ hiện SKU (▾ xem tên)');
  { const p = await vao('chienpham'); await p.evaluate(() => go('dh')); await p.waitForTimeout(4500);
    const r = await p.evaluate(() => { const ch = [...document.querySelectorAll('.dh-tabb')].map(x => x.textContent.trim());
      const nU = DH.don.filter(o => o.tab === 'ĐƠN ƯU TIÊN').length, nK = DH.don.filter(o => o.tab === 'KHO' || o.tab === 'ĐƠN ƯU TIÊN').length;
      return { ch, nU, nK, dem: theoCount(DH.don, 'KHO'), kenhU: DH.don.filter(o => o.tab === 'ĐƠN ƯU TIÊN').every(o => o.kenh === 'Kho') }; });
    ok(r.nU > 0 && r.dem === r.nK && r.kenhU && !r.ch.some(x => /^ĐƠN ƯU TIÊN/.test(x)) && r.ch.some(x => /Đơn ưu tiên/.test(x)), 'kênh Kho đếm cả tab ĐƠN ƯU TIÊN, không có nút kênh riêng, vẫn có nút ★ Đơn ưu tiên', r);
    await p.evaluate(() => dhBTab('KHO')); await p.waitForTimeout(800);
    const s1 = await p.evaluate(() => { const td = [...document.querySelectorAll('.dh-sh td.c2')].filter(t => t.querySelector('.dh-sku'))[0]; if (!td) return null; const ten = td.querySelector('.dh-sku-ten'), bt = td.querySelector('.dh-tenbt');
      const an = getComputedStyle(ten).display === 'none'; bt.click(); const hien = getComputedStyle(ten).display !== 'none'; bt.click(); return [an, hien, getComputedStyle(ten).display === 'none', document.querySelectorAll('.dh-sh td.c2 .dh-sku').length]; });
    ok(s1 && s1[0] && s1[1] && s1[2], 'bảng trạng thái: chỉ hiện SKU, bấm ▾ hiện tên, bấm lại ẩn', s1);
    const s2 = await p.evaluate(() => { const td = [...document.querySelectorAll('.dh-sh td.c2')].find(t => !t.querySelector('.dh-sku')); return td ? td.textContent.trim().length > 3 : 'không có dòng thiếu SKU'; });
    ok(s2 === true || s2 === 'không có dòng thiếu SKU', 'dòng chưa có SKU hiện thẳng tên', s2);
    if (process.env.ANH) await p.screenshot({ path: process.env.ANH + '/sku-dh.png', clip: await p.evaluate(() => { const r = document.querySelector('.dh-sh').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.y + scrollY - 140), width: 1440, height: 760 }; }) });
    ok(!p.__L.length, 'không lỗi JS', p.__L); await p.close(); }
  { const p = await vao('tpcnc'); await p.evaluate(() => go('bh')); await p.waitForTimeout(4500);
    const r = await p.evaluate(() => { const t = document.querySelector('.of-sku-ten'); if (!t) return null; const an = getComputedStyle(t).display === 'none'; t.previousSibling.querySelector('.of-tenbt').click(); return [an, getComputedStyle(t).display !== 'none', [...document.querySelectorAll('.db-kenh button')].map(x => x.textContent.trim())]; });
    ok(r && r[0] && r[1] && !r[2].some(x => /^ĐƠN ƯU TIÊN/.test(x)), 'Order-Flow: chỉ SKU, ▾ hiện tên; không có nút kênh ĐƠN ƯU TIÊN', r);
    if (process.env.ANH) await p.screenshot({ path: process.env.ANH + '/sku-of.png', clip: await p.evaluate(() => { const r = document.querySelector('.of-the').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.y + scrollY - 200), width: 1440, height: 760 }; }) });
    ok(!p.__L.length, 'Order-Flow không lỗi JS', p.__L); await p.close(); }
  console.log('\n' + (dem - loi) + '/' + dem + ' đạt'); await b.close(); process.exit(loi ? 1 : 0); })();
