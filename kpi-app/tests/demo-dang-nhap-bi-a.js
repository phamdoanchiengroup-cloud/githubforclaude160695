const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-dang-nhap-bi-a.html (màn đăng nhập bi-a bản mới có Mai, cạnh bản hiện tại):  node tests/demo-dang-nhap-bi-a.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-dang-nhap-bi-a.html');
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
    const mai = () => moi.evaluate(() => [document.querySelector('#bbMaiHinh svg') ? document.querySelector('#bbMaiHinh svg').getAttribute('class') : '', document.getElementById('bbMaiBong').className, document.getElementById('bbMaiBong').textContent]);
    let m = await mai();
    ok(/mai/.test(m[0]) && /Chào buổi|Chúc ca đêm/.test(m[2]) && /Khẩu hiệu hôm nay/.test(m[2]), 'Mai chào theo buổi + khẩu hiệu ngày', m);
    ok(await moi.evaluate(() => !document.querySelector('#gate [id="gToc"]') && !!document.querySelector('#gate [id="gbbToc"]')), 'hình Mai ở màn đăng nhập đổi id gradient (không trùng Mai trong web)');
    await moi.fill('#l_tk', 'c068'); await moi.click('#l_mk'); await p.waitForTimeout(150);
    m = await mai(); ok(/\bche\b/.test(m[0]) && /không nhìn/.test(m[2]), 'gõ mật khẩu: Mai che mắt', m);
    await moi.type('#l_mk', 'abcdef');
    const luc = await moi.evaluate(() => [document.querySelectorAll('#bbLuc i.on').length, document.getElementById('bbLucSo').textContent, getComputedStyle(document.getElementById('bbCo')).transform]);
    ok(luc[0] === 6 && luc[1] === '60%' && (giam || /matrix/.test(luc[2])), 'đồng hồ LỰC ĐÁNH 6/10 vạch, cơ kéo lùi theo mật khẩu', luc);
    await moi.press('#l_mk', 'Enter'); await p.waitForTimeout(1400);
    const sai = await moi.evaluate(() => [document.getElementById('bbOMk').classList.contains('bb-sai'), !document.getElementById('lerr').classList.contains('hide'), document.getElementById('bbMaiBong').classList.contains('lo'), document.getElementById('gate').classList.contains('bb-vao')]);
    m = await mai();
    ok(sai[0] && sai[1] && sai[2] && !sai[3] && /trượt cơ/.test(m[2]) && /\blo\b/.test(m[0]), 'sai mật khẩu: ô đỏ + báo lỗi, Mai lo lắng "trượt cơ", không vào', { sai, m });
    await moi.fill('#l_mk', 'demo'); await moi.press('#l_mk', 'Enter'); await p.waitForTimeout(1100 + 1700);
    const dung = await moi.evaluate(() => [document.getElementById('bbBiMuc').getAttribute('class'), document.getElementById('bbLoSang').getAttribute('class'), document.getElementById('gate').classList.contains('bb-vao'), document.getElementById('demoXong').classList.contains('hien'), document.getElementById('bbVaoTen').textContent]);
    m = await mai();
    ok((giam || (dung[0] === 'vao' && dung[1] === 'hien')) && dung[2] && dung[3] && /Lan/.test(dung[4]) && /Vào lỗ đẹp/.test(m[2]) && /covu/.test(m[0]), 'đúng "demo": bi KPI vào lỗ, lỗ sáng, Mai cổ vũ, vào hệ thống', { dung, m });
    await moi.click('#demoXong button'); await p.waitForTimeout(300);
    ok(await moi.evaluate(() => !document.getElementById('gate').classList.contains('bb-vao') && !document.getElementById('bbBiMuc').getAttribute('class') && document.getElementById('bbMaiBong').textContent.indexOf('Mình là Mai') >= 0), 'Thử lại: bàn và Mai về như đầu');
    await moi.click('#bbMaiNut'); await p.waitForTimeout(100);
    const tat = await moi.evaluate(() => [localStorage.getItem('kpi_mai'), getComputedStyle(document.getElementById('bbMaiHinh')).display, document.getElementById('bbMaiNut').textContent, document.getElementById('bbChao').textContent]);
    ok(tat[0] === 'tat' && tat[1] === 'none' && tat[2] === 'Hiện Mai' && tat[3].length > 3, 'nút Ẩn Mai: tắt (chung khóa kpi_mai với web), vẫn còn lời chào', tat);
    await moi.click('#bbMaiNut'); await p.waitForTimeout(100);
    ok(await moi.evaluate(() => !localStorage.getItem('kpi_mai') && getComputedStyle(document.getElementById('bbMaiHinh')).display !== 'none'), 'bấm lại: Mai hiện lại');
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
