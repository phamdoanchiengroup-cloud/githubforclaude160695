const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-dang-nhap-rhino.html (màn đăng nhập phong cách Rhino + Mai, cạnh bản hiện tại):  node tests/demo-dang-nhap-rhino.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-dang-nhap-rhino.html');
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten, giam] of [[1360, 'máy tính', false], [390, 'điện thoại', false], [1360, 'giảm chuyển động', true]]) {
    console.log('— ' + ten);
    const ctx = await b.newContext({ viewport: { width: w, height: 1000 }, timezoneId: 'Asia/Ho_Chi_Minh', reducedMotion: giam ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.goto(F); await p.waitForTimeout(1200);
    const fr = p.frames().filter(x => x !== p.mainFrame());
    const moi = fr[0], cu = fr[1];
    const mai = () => moi.evaluate(() => [document.querySelector('#rhMaiAnh svg') ? document.querySelector('#rhMaiAnh svg').getAttribute('class') : '', document.getElementById('rhMaiNoi').className, document.getElementById('bbChao').textContent + ' | ' + document.getElementById('rhMaiNoi').textContent]);
    let m = await mai();
    ok(/mai/.test(m[0]) && /Chào buổi|Chúc ca đêm/.test(m[2]) && /Mai chúc bạn/.test(m[2]), 'Mai: chân dung tròn + lời chào + khẩu hiệu ngày', m);
    ok(await moi.evaluate(() => !document.querySelector('#gate [id="gToc"]') && !!document.querySelector('#gate [id="gbbToc"]')), 'hình Mai ở màn đăng nhập đổi id gradient (không trùng Mai trong web)');
    const sh = await moi.evaluate(() => [...document.querySelectorAll('#bbHero .rh-anh img')].map(i => i.naturalWidth > 500 && i.src.startsWith('data:image/')).concat([document.querySelector('.rh-logo').naturalWidth > 100, document.querySelectorAll('#rhVach button').length]));
    ok(sh.slice(0, 4).every(Boolean) && sh[4] && sh[5] === 4, 'phòng trưng bày: 4 ảnh thật + logo Rhino nhúng sẵn, 4 vạch chọn', sh);
    await moi.click('#rhVach button:nth-child(3)'); await p.waitForTimeout(500);
    ok(await moi.evaluate(() => document.querySelectorAll('#bbHero .rh-anh')[2].classList.contains('hien') && document.getElementById('rhTen').textContent === 'Retro II'), 'bấm vạch thứ 3: sang ảnh Retro II');
    ok(await moi.evaluate(() => getComputedStyle(document.getElementById('btnLogin')).backgroundColor === 'rgb(247, 184, 41)'), 'nút Đăng nhập màu vàng Rhino #f7b829');
    await moi.fill('#l_tk', 'c068'); await moi.click('#l_mk'); await p.waitForTimeout(150);
    m = await mai(); ok(/\bche\b/.test(m[0]) && /không nhìn/.test(m[2]), 'bấm vào ô mật khẩu: Mai che mắt', m);
    await moi.type('#l_mk', 'abcdef'); await moi.press('#l_mk', 'Enter'); await p.waitForTimeout(1400);
    const sai = await moi.evaluate(() => [document.getElementById('bbOMk').classList.contains('bb-sai'), !document.getElementById('lerr').classList.contains('hide'), document.getElementById('gate').classList.contains('bb-vao')]);
    m = await mai();
    ok(sai[0] && sai[1] && !sai[2] && /\blo\b/.test(m[0]) && /lo/.test(m[1]) && /chữ hoa|Caps Lock/.test(m[2]), 'sai mật khẩu: báo lỗi như cũ, Mai lo lắng nhắc chữ hoa/thường', { sai, m });
    await moi.fill('#l_mk', 'demo'); await moi.press('#l_mk', 'Enter'); await p.waitForTimeout(1100 + 1500);
    const dung = await moi.evaluate(() => [document.getElementById('gate').classList.contains('bb-vao'), document.getElementById('demoXong').classList.contains('hien'), document.getElementById('bbVaoTen').textContent, getComputedStyle(document.getElementById('rhMai')).display]);
    m = await mai();
    ok(dung[0] && dung[1] && /Lan/.test(dung[2]) && dung[3] !== 'none' && /covu/.test(m[0]) && /Lan/.test(m[2]), 'đúng "demo": vào hệ thống, Mai giơ tay chúc ca làm', { dung, m });
    await moi.click('#demoXong button'); await p.waitForTimeout(300);
    ok(await moi.evaluate(() => !document.getElementById('gate').classList.contains('bb-vao') && /Mai chúc bạn/.test(document.getElementById('rhMaiNoi').textContent)), 'Thử lại: Mai về lời chào');
    await moi.click('#rhMaiNut'); await p.waitForTimeout(100);
    const tat = await moi.evaluate(() => [localStorage.getItem('kpi_mai'), getComputedStyle(document.getElementById('rhMaiAnh')).display, document.getElementById('rhMaiNut').textContent, document.getElementById('bbChao').textContent]);
    ok(tat[0] === 'tat' && tat[1] === 'none' && tat[2] === 'Hiện Mai' && tat[3].length > 3, 'nút Ẩn Mai: tắt (chung khóa kpi_mai với web), còn lời chào như bản cũ', tat);
    await moi.click('#rhMaiNut'); await p.waitForTimeout(100);
    ok(await moi.evaluate(() => !localStorage.getItem('kpi_mai') && getComputedStyle(document.getElementById('rhMaiAnh')).display !== 'none'), 'bấm lại: Mai hiện lại');
    ok(await moi.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'không tràn ngang');
    // bản hiện tại vẫn chạy để so sánh
    await p.click('[data-b=cu]'); await cu.fill('#l_tk', 'c068'); await cu.fill('#l_mk', 'demo'); await cu.press('#l_mk', 'Enter'); await p.waitForTimeout(2400);
    ok(await cu.evaluate(() => document.getElementById('demoXong').classList.contains('hien')), 'tab "Hiện tại": màn đang dùng vẫn đăng nhập thử được');
    ok(e.length === 0, 'không lỗi JS', e);
    await ctx.close();
  }
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
