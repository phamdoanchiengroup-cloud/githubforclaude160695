const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 30 (tests/kpi-may/): KPI phía trình duyệt (KPI cá nhân, Nhân sự, Tổng quan) khớp Bảng KPI máy chủ.
 *    DATA=csdl.json OUT=$S/xt.html GIO=2026-10-22T16:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/kpi-may-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk) {
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click('#xtGoiY button:has-text("' + tk + '")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });
  return p;
}
const mayChu = p => p.evaluate(() => new Promise(res => google.script.run.withSuccessHandler(res).layKPIKy(TOKEN, 'thang', today().slice(0, 7), '')));

(async () => {
  const b = await chromium.launch();
  console.log('1. Chủ sở hữu: Nhân sự / Tổng quan');
  let p = await vao(b, 'chienpham');
  const tam = await p.evaluate(() => { const ds = D.nhansu.slice(0, 40); return ds.map(x => { const k = kpi(x.MaNV); return k && !k.may; }).filter(Boolean).length; });
  ok(tam > 0, 'chưa tải số máy chủ: kpi() tính tạm theo tháng này (' + tam + ' người)');
  await p.evaluate(() => go('ns'));
  await p.waitForFunction(() => KPI_MAY.m, null, { timeout: 60000 });
  const r = await mayChu(p);
  const s = await p.evaluate(ds => { const sai = []; ds.forEach(o => { const k = kpi(o.MaNV); if (!k || !k.may || Math.abs(k.tong - o.tong) > 0.01) sai.push([o.HoTen, o.tong, k && k.tong]); }); return { n: ds.length, sai }; }, r.ds);
  ok(s.n > 100 && !s.sai.length, 'kpi() trả đúng số Bảng KPI cho cả ' + s.n + ' người', s.sai.slice(0, 3));
  const o = r.ds.find(x => x.tong > 0);
  await p.waitForTimeout(300);
  const o2 = await p.evaluate(m => { const tr = [...document.querySelectorAll('#main tr.ns-row')].find(t => t.textContent.includes(m)); return tr ? tr.textContent : ''; }, o.MaNV);
  ok(o2.includes(Number(o.tong).toFixed(2) + '%'), 'cột KPI ở Nhân sự đã vẽ lại theo số máy chủ (' + o.HoTen + ' ' + o.tong + '%)', o2.slice(0, 120));
  await p.evaluate(() => go('dash')); await p.waitForTimeout(800);
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);

  console.log('\n2. Công nhân: KPI cá nhân');
  await p.context().close();
  p = await vao(b, 'c068');
  await p.evaluate(() => go('kpica'));
  await p.waitForFunction(() => KPI_MAY.m, null, { timeout: 60000 }); await p.waitForTimeout(500);
  const ma = await p.evaluate(() => ME.maNV), rc = await mayChu(p), toi = (rc.ds || []).find(x => x.MaNV === ma);
  const hien = await p.evaluate(() => document.querySelector('#main').textContent);
  console.log('    ', ma, await p.evaluate(() => ME.vaiTro), rc.ok, (rc.ds||[]).length, rc.msg || '');
  ok(toi && hien.includes(Number(toi.tong).toFixed(2) + '%'), 'KPI cá nhân của công nhân = Bảng KPI (' + (toi && toi.tong) + '%)', toi);
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
