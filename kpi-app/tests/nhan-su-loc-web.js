/**
 * Kiểm thử tab Nhân sự gọn lại (08/11): Thêm NV đầu, Tìm + 5 bộ lọc, bảng Thâm niên (bỏ Xưởng / KPI), không còn Đón người mới.
 *   F=<bản xem thử .html> [CHUP=<thư mục ảnh>] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/nhan-su-loc-web.js
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const F = process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const vao = async (tk, w) => {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.route(/fonts\.g|cdnjs|jsdelivr/, r => r.abort()); p.__loi = []; p.on('pageerror', e => p.__loi.push(e.message));
    await p.goto('file://' + F); await p.waitForSelector('#xtGoiY');
    await p.evaluate(t => { l_tk.value = t; l_mk.value = 'demo'; login(); }, tk);
    await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 60000 }).catch(() => {});
    await p.evaluate(() => { try { maiGocDong() } catch (e) {} go('ns'); }); await p.waitForTimeout(2500); return p;
  };
  console.log('\n1. Chủ sở hữu (máy tính)');
  let p = await vao('chienpham', 1300);
  let r = await p.evaluate(() => ({ h3: [...document.querySelectorAll('#main h3')].slice(0, 2).map(x => x.firstChild.textContent.trim()),
    th: [...document.querySelector('.ns-row').closest('table').querySelectorAll('thead th')].map(x => x.textContent),
    loc: ['x', 'tt', 'cd', 'tn', 'tuoi'].filter(k => document.getElementById('nsL_' + k)), hn: !!document.getElementById('vhHN'), n: document.querySelectorAll('.ns-row').length,
    tn: [...document.querySelectorAll('.ns-row')].map(t => t.children[3].textContent) }));
  ok(r.h3[0] === 'Thêm nhân viên' && r.h3[1] === 'Tìm nhân viên', 'thẻ Thêm nhân viên đầu, Tìm nhân viên thứ hai', r.h3);
  ok(r.th.join('|') === 'Mã|Họ tên|Chức danh|Thâm niên|Công đoạn làm được|', 'bảng: bỏ Xưởng + KPI, có Thâm niên', r.th);
  ok(r.loc.length === 5, 'đủ 5 bộ lọc: xưởng, trạng thái, chức danh, thâm niên, độ tuổi', r.loc);
  ok(!r.hn, 'không còn "Đón người mới"');
  ok(r.tn.filter(x => /năm|tháng/.test(x)).length > r.n * 0.8, 'thâm niên ghi "x năm y tháng"', r.tn.slice(0, 5));
  await p.selectOption('#nsL_x', 'SON'); await p.selectOption('#nsL_tn', '0');
  r = await p.evaluate(() => { const v = [...document.querySelectorAll('.ns-row')].filter(t => t.style.display !== 'none');
    return { n: v.length, dung: v.every(t => t.dataset.x === 'SON' && t.dataset.tn === '0'), kq: document.getElementById('nsTimKq').textContent,
      the: [...document.querySelectorAll('#main .card')].filter(c => c.querySelector('.ns-row') && c.style.display !== 'none').map(c => c.querySelector('h3').textContent) }; });
  ok(r.dung && new RegExp('Khớp ' + r.n + ' / ').test(r.kq), 'lọc Sơn + dưới 3 tháng: chỉ hiện người khớp, có số khớp', r);
  ok(r.the.length === 1 && /Sơn/.test(r.the[0]) && / \/ /.test(r.the[0]), 'chỉ còn thẻ xưởng Sơn, đầu thẻ ghi "k / n người"', r.the);
  await p.evaluate(() => vNS()); await p.waitForTimeout(600);
  ok(await p.evaluate(() => [...document.querySelectorAll('.ns-row')].filter(t => t.style.display !== 'none').every(t => t.dataset.x === 'SON')), 'vẽ lại tab vẫn giữ bộ lọc');
  await p.evaluate(() => nsXoaLoc()); ok(await p.evaluate(() => [...document.querySelectorAll('.ns-row')].every(t => t.style.display !== 'none')), 'Bỏ lọc: hiện lại tất cả');
  if (CHUP) await p.screenshot({ path: CHUP + '/ns-chu.png' });
  ok(!p.__loi.length, 'không lỗi JS', p.__loi); await p.close();
  console.log('\n2. Trưởng phòng (điện thoại)');
  p = await vao(process.env.TP || 'tpson', 390);
  r = await p.evaluate(() => ({ th: [...document.querySelector('.ns-row').closest('table').querySelectorAll('thead th')].map(x => x.textContent), tran: document.documentElement.scrollWidth - innerWidth, hn: !!document.getElementById('vhHN') }));
  ok(r.th.indexOf('KPI') < 0 && r.th.indexOf('Thâm niên') >= 0, 'bảng trưởng phòng cũng bỏ KPI, có Thâm niên', r.th);
  ok(!r.hn && r.tran <= 0, 'không Đón người mới, điện thoại không tràn ngang', r);
  ok(!p.__loi.length, 'không lỗi JS', p.__loi); await p.close();
  await b.close(); console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
