const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra hiệu ứng giao diện trên bản xem thử 1 file (không cần máy chủ):
 *   DATA=csdl.json OUT=$S/hu/xem-thu-hieu-ung.html node tests/tao-ban-xem-thu.js
 *   S=<thư mục chứa hu/> node tests/hieu-ung.js
 */
const F = 'file://' + process.env.S + '/hu/xem-thu-hieu-ung.html', OUT = process.env.S + '/hu/';
let dem = 0, loiDem = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loiDem++; console.log('  ✗ ' + ten + (ct !== undefined ? ' → ' + JSON.stringify(ct).slice(0, 200) : '')); } };
async function vao(b, tk, opt = {}) {
  const ctx = await b.newContext({ viewport: opt.dt ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: opt.giam ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); p.loi = [];
  p.on('pageerror', e => p.loi.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click(`#xtGoiY button:has-text("${tk}")`);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  return p;
}
(async () => {
  const b = await chromium.launch();
  console.log('\n1. Chủ sở hữu (máy tính)');
  let p = await vao(b, 'chienpham');
  const chi = await p.evaluate(() => { const c = $('navChi'), bt = document.querySelector('#nav button.on'); return { op: c.style.opacity, tr: c.style.transform, top: bt.offsetTop, h: c.style.height, bh: bt.offsetHeight }; });
  ok(chi.op === '1' && chi.tr === 'translateY(' + chi.top + 'px)' && chi.h === chi.bh + 'px', 'thanh chỉ báo menu nằm đúng mục đang chọn', chi);
  const bi = await p.evaluate(() => { const s = getComputedStyle($('busy'), '::after'); return [s.animationName, s.width, s.borderRadius]; });
  ok(bi[0] === 'gdBiLan' && bi[1] === '11px', 'thanh tải là viên bi lăn', bi);
  // chuyển sang Tổng quan: trượt vào + số chạy + vòng KPI tô dần
  await p.evaluate(() => go('dash'));
  await p.waitForTimeout(90);
  const giua = await p.evaluate(() => ({ vao: $('main').classList.contains('gd-vao'), so: document.querySelector('.gauge .gval').textContent, off: getComputedStyle(document.querySelector('.gauge svg circle:nth-of-type(2)')).strokeDashoffset }));
  await p.waitForTimeout(1200);
  // lỗi 07/10: hai hiệu ứng "mọc từ 0" chạy chồng làm thanh So sánh hiệu suất kẹt ở 0
  const thanh = await p.evaluate(() => [...document.querySelectorAll('#main .hbar .hfill, #main .bar i, #main .cbfill')].map(x => [x.style.width, x.getBoundingClientRect().width]));
  ok(thanh.length > 0 && thanh.every(([sw, w]) => sw && sw !== '0' && sw !== '0px' && (parseFloat(sw) === 0 || w > 0)), 'mọi thanh (So sánh hiệu suất giữa các xưởng…) mọc đủ, không kẹt ở 0', thanh.filter(([sw, w]) => !(sw && sw !== '0' && sw !== '0px' && w > 0)).slice(0, 5));
  for (const tab of ['kpi', 'homnay', 'dash']) { await p.evaluate(t => go(t), tab); await p.waitForTimeout(1500); }
  const thanh2 = await p.evaluate(() => [...document.querySelectorAll('#main .hbar .hfill')].map(x => x.getBoundingClientRect().width));
  ok(thanh2.length > 0 && thanh2.every(w => w > 0), 'chuyển tab qua lại rồi về Tổng quan: thanh vẫn hiện', thanh2);
  const cuoi = await p.evaluate(() => { const c = document.querySelector('.gauge svg circle:nth-of-type(2)'); return { so: document.querySelector('.gauge .gval').textContent, off: getComputedStyle(c).strokeDashoffset, dich: c.getAttribute('stroke-dashoffset') }; });
  ok(giua.vao, 'chuyển tab: nội dung trượt vào');
  ok(giua.so !== cuoi.so && /%$/.test(giua.so), 'số KPI đang chạy dần (' + giua.so + ' → ' + cuoi.so + ')');
  ok(Math.abs(parseFloat(cuoi.off) - parseFloat(cuoi.dich)) < 0.2 && parseFloat(giua.off) > parseFloat(cuoi.dich), 'vòng KPI tô dần tới đúng %', { giua: giua.off, cuoi });
  await p.screenshot({ path: OUT + 'dash.png' });
  // khung chờ tải
  await p.evaluate(() => go('kpi'));
  await p.waitForTimeout(40);
  const skel = await p.evaluate(() => document.querySelectorAll('.gd-skel i').length);
  await p.screenshot({ path: OUT + 'skel.png' });
  ok(skel >= 5, 'bảng KPI: hiện khung chờ tải trong lúc tải', skel);
  await p.waitForTimeout(2000);
  // nút lún, thông báo có vạch thời gian, ô nhập sai rung
  const btn = await p.evaluate(() => { const r = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch (e) { return [] } }).filter(r => r.selectorText === '.btn:active').map(r => r.style.transform); return r; });
  ok(btn.some(t => /scale\(0?\.97\)/.test(t)), 'nút lún xuống khi nhấn', btn);
  await p.evaluate(() => go('nk'));
  await p.waitForTimeout(600);
  await p.focus('#main input[type=date]');
  await p.evaluate(() => toast('Ngày không hợp lệ'));
  await p.waitForTimeout(80);
  const t = await p.evaluate(() => ({ rung: document.querySelector('#main input[type=date]').classList.contains('gd-rung'), vach: getComputedStyle($('toast'), '::after').animationName, on: $('toast').className }));
  ok(t.rung, 'thông báo lỗi: ô vừa nhập rung + viền đỏ');
  ok(t.vach === 'gdToast' && /on/.test(t.on), 'thông báo có vạch thời gian co dần', t);
  await p.screenshot({ path: OUT + 'rung.png' });
  // đổi nền kiểu loang
  const vt = await p.evaluate(() => typeof document.startViewTransition);
  await p.click('#btnGD'); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + 'loang.png' });
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => document.documentElement.getAttribute('data-gd')) === 'sang', 'nút ☀: đổi nền (trình duyệt ' + (vt === 'function' ? 'có' : 'không có') + ' hiệu ứng loang)');
  await p.click('#btnGD'); await p.waitForTimeout(700);
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);

  console.log('\n2. Trưởng phòng: duyệt sản lượng');
  p = await vao(b, 'tpdg');
  await p.evaluate(() => go('kpi'));
  await p.waitForTimeout(2500);
  const top = await p.evaluate(() => ({ bi: [...document.querySelectorAll('.bi-so')].slice(0, 3).map(x => x.textContent), top: document.querySelectorAll('tr.gd-top').length, anim: getComputedStyle(document.querySelector('tr.gd-top td:nth-child(2)')).animationName }));
  ok(top.bi.join() === '1,2,3' && top.top >= 3 && top.anim === 'gdQuet', 'top 3 có bi số 1-2-3 và dải sáng lướt', top);
  await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'kpi.png' });
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(800);
  const hn0 = await p.evaluate(() => ({ vong: document.querySelectorAll('.hn-vong').length, han: [...document.querySelectorAll('.hn-han')].map(x => x.textContent), off: [...document.querySelectorAll('.hn-vong .chay')].map(x => x.style.strokeDashoffset) }));
  ok(hn0.vong >= 1 && hn0.han.every(x => /còn|quá hạn/.test(x)) && hn0.off.every(x => x !== ''), 'Việc hôm nay: vòng đếm ngược tới hạn', hn0);
  await p.screenshot({ path: OUT + 'homnay-tp.png' });
  const dem0 = await p.evaluate(() => document.querySelector('#nav button[data-k="homnay"] .dem').getAttribute('data-v'));
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(800);
  await p.evaluate(() => { const g = hieuUngDuyet; window.hieuUngDuyet = function (fn, a, n) { const r = g(fn, a, n); window.__di = document.querySelectorAll('.gd-di').length; window.__tick = !!document.querySelector('.gd-tick'); return r; }; });
  { const n = p.locator('#main button.giu').first(); const q = await n.boundingBox(); await p.mouse.move(q.x + q.width / 2, q.y + q.height / 2); await p.mouse.down(); await p.waitForTimeout(950); await p.mouse.up(); }
  await p.waitForSelector('.gd-tick', { timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(60);
  await p.waitForFunction(() => window.__di !== undefined, null, { timeout: 5000 });
  const d1 = await p.evaluate(() => ({ tick: window.__tick, di: window.__di }));
  await p.screenshot({ path: OUT + 'duyet.png' });
  ok(d1.tick, 'duyệt: dấu ✓ tự vẽ tại nút');
  ok(d1.di >= 2, 'duyệt: các dòng của người đó trượt ra (' + d1.di + ' dòng)');
  await p.waitForTimeout(1800);
  const d2 = await p.evaluate(() => { const d = document.querySelector('#nav button[data-k="homnay"] .dem'); return { v: d.getAttribute('data-v'), odo: !!d.querySelector('.odo'), cho: (D.choDuyet || []).length, toast: $('toast').textContent }; });
  ok(d2.cho === 0 && /duyệt/i.test(d2.toast), 'đã duyệt thật (máy chủ), còn ' + d2.cho + ' dòng chờ', d2.toast);
  ok(d2.v !== dem0 && d2.odo, 'số đếm "Việc hôm nay" trên menu lật số ' + dem0 + ' → ' + d2.v, d2);
  // Việc hôm nay: số lật khi số việc đổi
  await p.evaluate(() => { __hnTruoc['Chưa nhập sản lượng'] = 99; go('homnay'); });
  await p.waitForTimeout(150);
  ok(await p.evaluate(() => !!document.querySelector('.hn-so .odo')), 'Việc hôm nay: con số lật khi thay đổi');
  // Mọi việc đã xong: bi vào lỗ + tiếng
  await p.evaluate(() => { window.__am = 0; const g = tiengVaoLo; window.tiengVaoLo = function () { window.__am++; g(); }; const v0 = viecHomNay; window.viecHomNay = function () { return []; }; vHomNay(); window.viecHomNay = v0; });
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + 'xong-giua.png' });
  await p.waitForTimeout(1600);
  const x = await p.evaluate(() => ({ lt: (document.querySelector('.hn-xong .lt-o[data-lt="da-duyet-het"]') || {}).innerHTML || '', am: window.__am }));
  await p.screenshot({ path: OUT + 'xong.png' });
  ok(/<svg/.test(x.lt), 'mọi việc xong: hoạt ảnh Lottie bảng kẹp (thay viên bi cũ)');
  ok(x.am === 1, 'phát tiếng "cạch" đúng 1 lần khi vừa xong việc', x.am);
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);

  console.log('\n3. Giảm chuyển động + điện thoại');
  p = await vao(b, 'chienpham', { giam: true });
  await p.evaluate(() => go('dash')); await p.waitForTimeout(60);
  const g = await p.evaluate(() => ({ so: document.querySelector('.gauge .gval').textContent, vao: $('main').classList.contains('gd-vao') }));
  ok(!g.vao && /^\d+\.\d+%$/.test(g.so), 'máy bật "giảm chuyển động": số hiện ngay, không trượt', g);
  ok(p.loi.length === 0, 'không lỗi JS', p.loi);
  for (const [tk, dt] of [['c068', true], ['tpdg', true], ['kcs', false], ['nhansu', false]]) {
    p = await vao(b, tk, { dt });
    const tabs = await p.$$eval('#nav button[data-k]', x => x.map(y => y.getAttribute('data-k')));
    for (const k of tabs) { await p.evaluate(k => go(k), k); await p.waitForTimeout(500); }
    if (tk === 'tpdg') { await p.evaluate(() => go('homnay')); await p.waitForTimeout(700); await p.screenshot({ path: OUT + 'dt-tp.png' }); }
    ok(p.loi.length === 0, tk + (dt ? ' (điện thoại)' : '') + ': mở ' + tabs.length + ' tab không lỗi', p.loi);
  }
  await b.close();
  console.log('\n' + (loiDem ? '✗ ' + loiDem + '/' + dem + ' LỖI' : '✓ Tất cả ' + dem + ' kiểm tra đạt'));
})();
