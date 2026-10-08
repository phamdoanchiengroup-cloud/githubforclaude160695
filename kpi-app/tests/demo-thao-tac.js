const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-thao-tac.html (10 hiệu ứng thao tác bên trong, mục 7–16):  node tests/demo-thao-tac.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-thao-tac.html');
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function keo(p, sel, dx, dy, buoc = 10) {
  await p.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await p.waitForTimeout(80);
  const r = await p.locator(sel).boundingBox(); const x = r.x + r.width / 2, y = r.y + r.height / 2;
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + dx, y + dy, { steps: buoc }); await p.mouse.up();
}
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1300, height: 1000 } });
  const p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
  await p.goto(F); await p.waitForTimeout(600);
  const lam = async n => { await p.click('#muc' + n + ' h2 button'); await p.waitForTimeout(200); };

  console.log('7. Vuốt để gửi');
  await keo(p, '#muc7 .num', 120, 0); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.querySelector('#muc7 .mh').classList.contains('gui')), 'vuốt nửa chừng rồi thả: chưa gửi, nút trượt về');
  await keo(p, '#muc7 .num', 400, 0); await p.waitForTimeout(2000);
  ok(await p.evaluate(() => { const m = document.querySelector('#muc7 .mh'); return m.classList.contains('gui') && m.classList.contains('da') && document.querySelector('#muc7 .thung').classList.contains('dong'); }), 'vuốt hết: gửi, số bay vào thùng, thùng đóng nắp, báo đã gửi');
  await lam(7); await p.focus('#muc7 .num'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('#muc7 .mh').classList.contains('gui')), 'bàn phím: chọn nút trượt rồi Enter cũng gửi được');
  await lam(7); await p.click('#muc7 .bam button'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.querySelector('#muc7 .mh').classList.contains('gui')), 'link "Bấm vào đây để gửi" cho người không vuốt được');

  console.log('8. Số đếm cơ khí + đồng hồ kim');
  await p.click('#muc8 [data-d="1"]'); await p.waitForTimeout(500);
  let s = await p.evaluate(() => [document.querySelector('#muc8 input').value, [...document.querySelectorAll('#muc8 .cot')].map(c => c.style.transform), document.querySelector('#muc8 .kim').style.transform]);
  ok(s[0] === '97' && /-336px/.test(s[1][2]) && /rotate/.test(s[2]), 'bấm + : 96 → 97, cột chữ số hàng đơn vị lăn tới 7, kim xoay', s);
  await p.fill('#muc8 input', '170'); await p.dispatchEvent('#muc8 input', 'input'); await p.waitForTimeout(300);
  s = await p.evaluate(() => [document.querySelector('#muc8 .bao').className, document.querySelector('#muc8 .bao').textContent]);
  ok(/do/.test(s[0]) && /142%/.test(s[1]), 'nhập 170 (định mức 120): báo đỏ "vượt 142%", nhắc kiểm tra', s);

  console.log('9. Vuốt thẻ duyệt');
  await keo(p, '#muc9 .the:last-child', 50, 0); await p.waitForTimeout(450);
  ok(await p.evaluate(() => document.querySelectorAll('#muc9 .the').length === 5), 'vuốt ngắn: thẻ quay về, chưa duyệt');
  await keo(p, '#muc9 .the:last-child', 200, 0); await p.waitForTimeout(450);
  await keo(p, '#muc9 .the:last-child', -200, 0); await p.waitForTimeout(450);
  s = await p.evaluate(() => [document.querySelectorAll('#muc9 .the').length, document.querySelector('#muc9 .dem').textContent]);
  ok(s[0] === 3 && /duyệt 1 · Trả lại 1/.test(s[1]), 'vuốt phải = duyệt, vuốt trái = trả lại, đếm đúng', s);
  await p.click('#muc9 .thanh-bao button'); await p.waitForTimeout(300);
  s = await p.evaluate(() => [document.querySelectorAll('#muc9 .the').length, document.querySelector('#muc9 .dem').textContent]);
  ok(s[0] === 4 && /Trả lại 0/.test(s[1]), '"Hoàn tác": thẻ vừa trả lại quay về', s);
  for (let i = 0; i < 4; i++) { await p.click('#muc9 .nuts .ok'); await p.waitForTimeout(350); }
  ok(await p.evaluate(() => document.querySelector('#muc9 .het').classList.contains('hien')), 'nút ✓ duyệt nốt: hiện "Đã duyệt hết"');

  console.log('10. Cần gạt chốt ca');
  await keo(p, '#muc10 .can', 0, 60); await p.waitForTimeout(600);
  ok(await p.evaluate(() => !document.querySelector('#muc10 .den').classList.contains('xanh')), 'kéo nửa chừng: cần bật về, chưa chốt');
  await keo(p, '#muc10 .can', 0, 260); await p.waitForTimeout(700);
  ok(await p.evaluate(() => document.querySelector('#muc10 .den').classList.contains('xanh') && /Đã chốt/.test(document.querySelector('#muc10 .kq').textContent)), 'kéo tận đáy: "cạch", đèn xanh, báo đã chốt ca');
  await lam(10); await p.focus('#muc10 .can'); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.querySelector('#muc10 .den').classList.contains('xanh')), 'bàn phím: Enter ở cần gạt cũng chốt được');

  console.log('11. Điểm danh đóng dấu');
  await p.click('#muc11 .hang[data-i="0"]'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.querySelector('#muc11 .hang[data-i="0"]').classList.contains('co') && /1\/8/.test(document.querySelector('#muc11 .sl').textContent)), 'chạm 1 người: đóng dấu CÓ MẶT, đếm 1/8');
  await p.locator('#muc11 .mh').scrollIntoViewIfNeeded();
  const a = await p.locator('#muc11 .hang[data-i="1"] .o-dau').boundingBox(), z = await p.locator('#muc11 .hang[data-i="4"] .o-dau').boundingBox();
  await p.mouse.move(a.x + 20, a.y + 10); await p.mouse.down(); await p.mouse.move(z.x + 20, z.y + 10, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(200);
  s = await p.evaluate(() => [...document.querySelectorAll('#muc11 .hang')].map(h => h.classList.contains('co') ? 1 : 0).join(''));
  ok(s.startsWith('11111'), 'vuốt dọc cột dấu từ người 2 tới người 5: đóng dấu cả loạt', s);
  await p.click('#muc11 .hang[data-i="0"]'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => !document.querySelector('#muc11 .hang[data-i="0"]').classList.contains('co')), 'chạm lại: bỏ dấu');

  console.log('12. Vuốt trái để xóa + Hoàn tác');
  await keo(p, '#muc12 .dong:nth-child(2) .hang', -70, 0); await p.waitForTimeout(400);
  ok(await p.evaluate(() => /-96px/.test(document.querySelector('#muc12 .dong:nth-child(2) .hang').style.transform)), 'vuốt ngắn: lộ nút Xóa, chưa xóa');
  await keo(p, '#muc12 .dong:nth-child(1) .hang', -260, 0); await p.waitForTimeout(450);
  s = await p.evaluate(() => [document.querySelectorAll('#muc12 .dong').length, document.querySelector('#muc12 .thanh-bao').textContent]);
  ok(s[0] === 5 && /Hoàn tác/.test(s[1]), 'vuốt dài: xóa dòng, hiện thanh "Hoàn tác"', s);
  await p.click('#muc12 .thanh-bao button'); await p.waitForTimeout(300);
  s = await p.evaluate(() => [document.querySelectorAll('#muc12 .dong').length, document.querySelector('#muc12 .dong b').textContent]);
  ok(s[0] === 6 && s[1] === 'Nguyễn Thị Lan', 'Hoàn tác: dòng quay về đúng chỗ cũ', s);
  await p.hover('#muc12 .dong:nth-child(3) .hang'); await p.click('#muc12 .dong:nth-child(3) .x'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelectorAll('#muc12 .dong').length === 5), 'máy tính: rê chuột hiện nút Xóa, bấm là xóa');

  console.log('13. Kéo xuống để làm mới');
  await keo(p, '#muc13 .vung', 0, 60, 6); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !document.querySelector('#muc13 .hang.moi')), 'kéo ngắn: không làm mới');
  await keo(p, '#muc13 .vung', 0, 200, 12); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => !!document.querySelector('#muc13 .hang.moi') && /Đã cập nhật/.test(document.querySelector('#muc13 .thanh-bao').textContent)), 'kéo đủ xa rồi thả: cơ đánh bi, tải lại, có dòng mới');
  await p.click('#muc13 .lam'); await p.waitForTimeout(1400);
  ok(await p.evaluate(() => !!document.querySelector('#muc13 .hang.moi')), 'nút ↻ cũng làm mới được');

  console.log('14. Ô nhập sai');
  await p.click('#muc14 .form .nut'); await p.waitForTimeout(450);
  s = await p.evaluate(() => [document.querySelector('#muc14 .sai') && document.querySelector('#muc14 .sai').dataset.k, document.querySelector('#muc14 .mai-chi').classList.contains('hien'), document.querySelector('#muc14 .sai .loi').textContent]);
  ok(s[0] === 'cd' && s[1] && /Chọn công đoạn/.test(s[2]), 'chưa chọn công đoạn: ô đó viền đỏ, Mai chỉ vào, nói lý do', s);
  await p.selectOption('#muc14 select', { index: 2 }); await p.click('#muc14 .form .nut'); await p.waitForTimeout(450);
  s = await p.evaluate(() => [document.querySelector('#muc14 .sai').dataset.k, document.querySelector('#muc14 .sai .loi').textContent]);
  ok(s[0] === 'sl' && /650/.test(s[1]), '650 > 500: Mai chuyển sang chỉ ô số lượng, hỏi "có nhầm thêm số 0 không?"', s);
  await p.fill('#muc14 [data-k=sl] input', '65'); await p.dispatchEvent('#muc14 [data-k=sl] input', 'input'); await p.click('#muc14 .form .nut'); await p.waitForTimeout(450);
  ok(await p.evaluate(() => !document.querySelector('#muc14 .sai') && !document.querySelector('#muc14 .mai-chi').classList.contains('hien')), 'sửa đúng: Mai đi, thêm được');

  console.log('15. Pháo giấy');
  await p.evaluate(() => localStorage.removeItem('demo_phao_ngay'));
  await p.click('#muc15 .ban'); await p.waitForTimeout(600);
  ok(await p.evaluate(() => { const c = document.querySelector('#muc15 canvas'); return c.width > 0 && c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0); }), 'bấm "Mở KPI": pháo giấy bắn');
  await p.waitForTimeout(2300); await p.click('#muc15 .ban'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => /đã bắn rồi/.test(document.querySelector('#muc15 .ghi-lan').textContent)), 'lần 2 trong ngày: không bắn nữa');

  console.log('16. Hết phiên: kéo dây');
  await p.click('#muc16 .gia'); await p.waitForTimeout(1300);
  ok(await p.evaluate(() => document.querySelector('#muc16 .toi').classList.contains('hien') && document.querySelector('#muc16 .day').classList.contains('xuong')), 'hết phiên: màn tối, dây thả xuống');
  await keo(p, '#muc16 .day button', 0, 90, 8); await p.waitForTimeout(700);
  ok(await p.evaluate(() => document.querySelector('#muc16 .hop').classList.contains('hien')), 'kéo dây: đèn sáng, hiện hộp đăng nhập lại');
  await p.fill('#muc16 .hop input', 'sai'); await p.press('#muc16 .hop input', 'Enter'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => /Sai mật khẩu/.test(document.querySelector('#muc16 .hop .loi').textContent)), 'sai mật khẩu: hộp rung, báo sai');
  await p.fill('#muc16 .hop input', 'demo'); await p.press('#muc16 .hop input', 'Enter'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.querySelector('#muc16 .hop').classList.contains('hien') && !document.querySelector('#muc16 .toi').classList.contains('hien')), 'đúng: về lại màn đang xem');
  ok(e.length === 0, 'không lỗi JS (máy tính)', e);
  await ctx.close();

  console.log('— điện thoại (cảm ứng)');
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const q = await c2.newPage(); const e2 = []; q.on('pageerror', x => e2.push(x.message));
  await q.goto(F); await q.waitForTimeout(600);
  ok(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'không tràn ngang trên điện thoại');
  await q.tap('#muc11 .hang[data-i="2"]'); await q.waitForTimeout(150);
  ok(await q.evaluate(() => document.querySelector('#muc11 .hang[data-i="2"]').classList.contains('co')), 'chạm để đóng dấu điểm danh');
  await q.tap('#muc9 .nuts .ok'); await q.waitForTimeout(400);
  ok(await q.evaluate(() => document.querySelectorAll('#muc9 .the').length === 4), 'chạm ✓ duyệt thẻ');
  await q.tap('#muc16 .gia'); await q.waitForTimeout(1300); await q.tap('#muc16 .day button', { force: true }); await q.waitForTimeout(700);
  ok(await q.evaluate(() => document.querySelector('#muc16 .hop').classList.contains('hien')), 'chạm vào dây: bật đèn, hiện hộp đăng nhập lại');
  // vuốt bằng ngón tay thật (lệnh cảm ứng của trình duyệt)
  const cdp = await c2.newCDPSession(q);
  const vuot = async (sel, dx, dy) => { await q.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await q.waitForTimeout(150);
    const r = await q.locator(sel).boundingBox(), x = r.x + r.width / 2, y = r.y + r.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await q.waitForTimeout(700); };
  await vuot('#muc7 .num', 330, 0); await q.waitForTimeout(1500);
  ok(await q.evaluate(() => document.querySelector('#muc7 .mh').classList.contains('da')), 'ngón tay: vuốt để gửi');
  await vuot('#muc9 .the:last-child', 220, 10);
  ok(await q.evaluate(() => document.querySelectorAll('#muc9 .the').length === 3), 'ngón tay: vuốt thẻ duyệt');
  await vuot('#muc10 .can', 0, 240);
  ok(await q.evaluate(() => document.querySelector('#muc10 .den').classList.contains('xanh')), 'ngón tay: kéo cần gạt chốt ca');
  await vuot('#muc12 .dong:nth-child(1) .hang', -280, 0);
  ok(await q.evaluate(() => document.querySelectorAll('#muc12 .dong').length === 5), 'ngón tay: vuốt trái xóa dòng');
  await vuot('#muc13 .vung', 0, 220); await q.waitForTimeout(1300);
  ok(await q.evaluate(() => !!document.querySelector('#muc13 .hang.moi')), 'ngón tay: kéo xuống làm mới');
  ok(e2.length === 0, 'không lỗi JS (điện thoại)', e2);
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
