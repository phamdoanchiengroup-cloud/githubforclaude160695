const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 34 (tests/holo/): hologram chỉ cho tài khoản chủ sở hữu.
 *    DATA=csdl.json OUT=$S/xt.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/holo-web.js        (ANH=thư-mục để lưu ảnh chụp) */
const F = 'file://' + process.env.F, ANH = process.env.ANH;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk, w, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(tk => { document.getElementById('l_tk').value = tk; document.getElementById('l_mk').value = 'demo'; login(); }, tk);
  await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 30000 });
  await p.waitForTimeout(600);
  return p;
}
const moDash = async p => { await p.evaluate(() => go('dash')); await p.waitForFunction(() => window.__soDangChay === 0, null, { timeout: 20000 }); await p.waitForTimeout(500); };
const chup = async (p, ten) => { if (ANH) await p.screenshot({ path: ANH + '/' + ten + '.png' }); };
(async () => {
  const b = await chromium.launch();
  console.log('1. Chủ sở hữu (chienpham) – máy tính');
  let p = await vao(b, 'chienpham', 1360, 900);
  await p.evaluate(() => { try { localStorage.removeItem('kpi_holo'); } catch (e) {} holoApDung(); });
  let s = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('holo'), cv: !!document.getElementById('holoSao'), nut: (document.getElementById('btnHolo') || {}).textContent, raf: HOLO_SAO.raf > 0 }));
  ok(s.cls && s.cv && /có chuyển động/.test(s.nut || '') && s.raf, 'mặc định: bật hologram, nền sao có chuyển động, nút ở cuối menu', s);
  await moDash(p);
  s = await p.evaluate(() => {
    // tự tính lại để so: trung bình KPI tháng của người đang làm (không tính TP/PP) theo xưởng, chỉ người đã có KPI
    const xs = {}; let tong = 0, n = 0;
    D.nhansu.filter(x => String(x.TrangThai).trim() === 'Đang làm' && String(x.laTP).toUpperCase() !== 'TRUE').forEach(x => {
      const k = kpi(x.MaNV); if (!k || !(k.tong > 0)) return; (xs[x.MaXuong] = xs[x.MaXuong] || []).push(k.tong); tong += k.tong; n++; });
    const dai = document.getElementById('hlDai');
    return { co: !!dai, sao: dai ? dai.querySelectorAll('.hl-sao').length : 0, soX: Object.keys(xs).length, tb: n ? tong / n : 0,
      giua: dai ? dai.querySelector('svg text[font-size="17"]').textContent : '', an: getComputedStyle(document.querySelector('#main .kpis') || document.body).display,
      dong: [...(dai ? dai.querySelectorAll('.hl-dg') : [])].map(d => [d.getAttribute('data-x'), d.querySelector('b').textContent]),
      dung: Object.keys(xs).map(m => [m, (xs[m].reduce((a, b) => a + b, 0) / xs[m].length).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })]) };
  });
  ok(s.co && s.sao === s.soX && s.soX > 3, 'Tổng quan có "Đài quan sát KPI": ' + s.sao + ' ngôi sao = ' + s.soX + ' xưởng có KPI tháng này', s);
  ok(s.giua === s.tb.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 'tâm vòng = KPI trung bình nhà máy (' + s.giua + ')', [s.giua, s.tb]);
  ok(s.dung.every(d => s.dong.some(x => x[0] === d[0] && x[1] === d[1])), 'KPI từng xưởng khớp với cách tính lại (trung bình người có KPI tháng này)', { dong: s.dong, dung: s.dung });
  ok(s.an === 'none', 'ô Hiệu suất / Tỷ lệ đạt cũ ẩn đi (đã gộp vào Đài quan sát)');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'không tràn ngang (1360px)');
  await chup(p, 'holo-may-tinh');
  const ma = await p.evaluate(() => document.querySelector('#hlDai .hl-sao').getAttribute('data-x'));
  await p.click('#hlDai .hl-sao circle.vong'); await p.waitForTimeout(600);
  s = await p.evaluate(() => ({ tab: tabHienTai, x: kpiXuong }));
  ok(s.tab === 'kpi' && s.x === ma, 'bấm 1 ngôi sao: mở Bảng KPI lọc đúng xưởng ' + ma, s);
  await p.evaluate(() => { xuongLoc = ''; kpiXuong = ''; });
  console.log('\n2. Nút đổi chế độ');
  await moDash(p);
  await p.click('#btnHolo'); await p.waitForTimeout(500);
  s = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('holo'), raf: HOLO_SAO.raf, nut: document.getElementById('btnHolo').textContent, dai: !!document.getElementById('hlDai') }));
  ok(s.cls && s.raf === 0 && /nền tĩnh/.test(s.nut) && s.dai, 'bấm lần 1: vẫn hologram, nền sao đứng yên (nhẹ máy)', s);
  await p.click('#btnHolo'); await p.waitForTimeout(500);
  s = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('holo'), cv: !!document.getElementById('holoSao'), dai: !!document.getElementById('hlDai'), luu: localStorage.getItem('kpi_holo') }));
  ok(!s.cls && !s.cv && !s.dai && s.luu === 'tat', 'bấm lần 2: tắt hẳn – về giao diện thường, máy nhớ lựa chọn', s);
  await p.click('#btnHolo'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.documentElement.classList.contains('holo') && HOLO_SAO.raf > 0 && !!document.getElementById('hlDai')), 'bấm lần 3: bật lại có chuyển động');
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await p.context().close();

  console.log('\n3. Chủ sở hữu trên điện thoại');
  p = await vao(b, 'chienpham', 390, 844);
  await moDash(p);
  s = await p.evaluate(() => ({ dai: !!document.getElementById('hlDai'), tran: document.documentElement.scrollWidth - innerWidth, rong: document.getElementById('hlDai').getBoundingClientRect().width }));
  ok(s.dai && s.tran <= 1 && s.rong <= 390, 'Đài quan sát co về 1 cột, không tràn ngang (390px)', s);
  await p.evaluate(() => document.getElementById('hlDai').scrollIntoView());
  await chup(p, 'holo-dien-thoai');
  // 25/10: lỗi chủ dự án báo – mở menu trên điện thoại thì lớp nền tối che mất menu, không bấm được tab
  await p.evaluate(() => scrollTo(0, 0)); await p.click('header .hnut'); await p.waitForTimeout(400);
  s = await p.evaluate(() => { const b = [...document.querySelectorAll('#nav button')].find(x => /Bảng KPI/.test(x.textContent)); const q = b.getBoundingClientRect(); return b.contains(document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2)); });
  await p.click('#nav button[data-k="kpi"]'); await p.waitForTimeout(500);
  const s2 = await p.evaluate(() => [tabHienTai, document.body.classList.contains('mo-nav')]);
  await p.click('header .hnut'); await p.waitForTimeout(400); await p.mouse.click(370, 600); await p.waitForTimeout(400);
  ok(s && s2[0] === 'kpi' && !s2[1] && !(await p.evaluate(() => document.body.classList.contains('mo-nav'))), 'mở menu: bấm được tab (Bảng KPI), menu tự đóng; bấm ra ngoài thì đóng menu', [s, s2]);
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await p.context().close();

  console.log('\n4. Tài khoản khác: giao diện giữ nguyên');
  for (const tk of ['giamdoc', 'tpphoicb', 'c360']) {
    p = await vao(b, tk, 1360, 900);
    await p.evaluate(() => { try { localStorage.removeItem('kpi_holo'); } catch (e) {} });
    if (await p.evaluate(() => ME.vaiTro === 'ADMIN' || ME.vaiTro === 'TP')) await moDash(p);
    s = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('holo'), nut: !!document.getElementById('btnHolo'), dai: !!document.getElementById('hlDai'), cv: !!document.getElementById('holoSao'), owner: ME.laOwner }));
    ok(!s.cls && !s.nut && !s.dai && !s.cv && !s.owner, tk + ': không có hologram, không có nút', s);
    ok(!p.jsLoi.length, tk + ': không lỗi JS', p.jsLoi);
    await p.context().close();
  }
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
