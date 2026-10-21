const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử chia đôi màn hình (mục 27, tests/chia-doi/): Bảng KPI → Chi tiết, Nhân sự → Xem hồ sơ, KPI quản lý → bấm dòng.
 *    DATA=csdl.json OUT=$S/xt-cd.html GIO=2026-10-21T10:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt-cd.html node tests/chia-doi-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };

async function moTrang(b, w) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click('#xtGoiY button:has-text("chienpham")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { try { maiGocDong(); localStorage.removeItem('kpi_chia_doi'); } catch (e) {} });
  return p;
}
const moKPI = async p => {
  await p.evaluate(() => { kpiKy = { kieu: 'thang', giaTri: '2026-10' }; kpiXuong = 'PHOICB'; go('kpi'); });
  await p.waitForFunction(() => document.querySelectorAll('#kpi_bang button[onclick^="xemChiTietKPI"]').length > 3, null, { timeout: 60000 });
};
const ten = p => p.evaluate(() => { const e = document.querySelector('#cdThan .cd-ten'); return e ? e.textContent : ''; });
const chon = p => p.evaluate(() => { const tr = document.querySelector('#main tr.cd-chon'); return tr ? tr.getAttribute('data-cd') : ''; });

(async () => {
  const b = await chromium.launch();
  const p = await moTrang(b, 1360);

  console.log('1. Bảng KPI → Chi tiết: mở khung bên phải, danh sách vẫn còn');
  await moKPI(p);
  const ma = await p.evaluate(() => { const bt = document.querySelectorAll('#kpi_bang button[onclick^="xemChiTietKPI"]')[1]; bt.click(); return bt.getAttribute('onclick').match(/'(.*)'/)[1]; });
  let s = await p.evaluate(() => ({ mo: document.body.classList.contains('cd-mo'), bang: !!document.querySelector('#kpi_bang table'), modal: !!document.getElementById('lsbox'),
    tong: !!document.querySelector('#cdThan .cd-so'), tai: !!document.querySelector('#ls_noidung .cd-tai') }));
  ok(s.mo && s.bang && !s.modal, 'khung chi tiết mở, bảng KPI vẫn hiện, không bật cửa sổ che', s);
  ok(s.tong && s.tai, 'điểm KPI hiện ngay từ dòng đã có, lịch sử đang tải');
  ok(await chon(p) === 'kpi|' + ma, 'dòng được chọn tô sáng');
  await p.waitForFunction(() => document.querySelectorAll('#ls_noidung tbody tr').length > 0, null, { timeout: 20000 });
  ok(true, 'lịch sử KPI tải xong vào khung');
  const t1 = await ten(p);
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200);
  const t2 = await ten(p);
  ok(t2 && t2 !== t1 && (await chon(p)) !== 'kpi|' + ma, 'phím ↓ chuyển sang người kế tiếp', [t1, t2]);
  await p.keyboard.press('ArrowUp'); await p.waitForTimeout(200);
  ok(await ten(p) === t1, 'phím ↑ quay lại người trước');
  await p.evaluate(() => { const tr = document.querySelectorAll('#kpi_bang tr[data-cd]')[4]; tr.querySelector('td:nth-child(2)').click(); });
  await p.waitForTimeout(200);
  ok((await chon(p)) === (await p.evaluate(() => document.querySelectorAll('#kpi_bang tr[data-cd]')[4].getAttribute('data-cd'))), 'bấm vào dòng cũng mở chi tiết');
  s = await p.evaluate(() => ({ an: [...document.querySelectorAll('#kpi_bang th.cd-an')].map(t => t.textContent.trim()), hien: getComputedStyle(document.querySelector('#kpi_bang th.cd-an')).display }));
  ok(s.an.includes('Tuân thủ') && s.an.includes('An toàn') && s.hien === 'none', 'cột phụ của danh sách ẩn khi chia đôi', s);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ mo: document.body.classList.contains('cd-mo'), chon: !!document.querySelector('#main tr.cd-chon'), cot: getComputedStyle(document.querySelector('#kpi_bang th.cd-an')).display }));
  ok(!s.mo && !s.chon && s.cot !== 'none', 'Esc đóng khung, bỏ tô sáng, hiện lại cột', s);

  console.log('\n2. Nhân sự → Xem hồ sơ: hiện ngay từ dữ liệu đã có, tải đủ sau');
  await p.evaluate(() => go('ns')); await p.waitForTimeout(800);
  s = await p.evaluate(() => { const bt = document.querySelectorAll('button[onclick^="xemHS"]')[3]; const t0 = performance.now(); bt.click();
    return { ms: Math.round(performance.now() - t0), ten: (document.querySelector('#cdThan .ptitle') || {}).textContent, tai: !!document.querySelector('#cdThan .cd-tai'),
      ds: document.querySelectorAll('#main .ns-row').length, ve: !!document.querySelector('#cdThan button[onclick="vNS()"]') }; });
  ok(s.ten && s.tai && s.ms < 400, 'hồ sơ hiện ngay (' + s.ms + ' ms), có dòng "đang tải lịch sử cũ"', s);
  ok(s.ds > 5 && !s.ve, 'danh sách nhân sự vẫn ở bên trái; khung không có nút "Về danh sách"', s);
  await p.waitForFunction(() => !document.querySelector('#cdThan .cd-tai'), null, { timeout: 20000 });
  s = await p.evaluate(() => ({ ten: (document.querySelector('#cdThan .ptitle') || {}).textContent, nk: [...document.querySelectorAll('#cdThan .card h3')].map(h => h.textContent) }));
  ok(s.ten && s.nk.some(t => /Nhật ký gần đây/.test(t)), 'bản đầy đủ từ máy chủ thay vào', s);
  await p.evaluate(() => { const b = document.querySelector('#cdThan button[onclick^="edHS"]'); if (b) b.click(); }); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !document.body.classList.contains('cd-mo')), 'bấm "Sửa" hồ sơ: đóng khung để mở form sửa như cũ');

  console.log('\n3. KPI quản lý → bấm dòng');
  await p.evaluate(() => go('kpiql'));
  await p.waitForFunction(() => document.querySelectorAll('#qlBody tr[data-cd^="ql|"]').length > 0, null, { timeout: 60000 });
  await p.evaluate(() => document.querySelector('#qlBody tr[data-cd^="ql|"] td:nth-child(2)').click()); await p.waitForTimeout(200);
  s = await p.evaluate(() => ({ mo: document.body.classList.contains('cd-mo'), h3: (document.querySelector('#cdThan .card h3') || {}).textContent || '', so: document.querySelectorAll('#cdThan .cd-o').length }));
  ok(s.mo && /Điểm vận hành bị trừ/.test(s.h3) && s.so === 6, 'khung hiện 6 chỉ số + điểm trừ vận hành', s);
  await p.evaluate(() => go('kpi')); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.body.classList.contains('cd-mo')), 'sang tab khác: khung tự đóng');

  console.log('\n4. Nút "Kiểu cũ" và bật lại');
  await moKPI(p);
  await p.evaluate(() => document.querySelectorAll('#kpi_bang button[onclick^="xemChiTietKPI"]')[0].click());
  await p.click('#cdCu');
  await p.waitForSelector('#lsbox', { timeout: 20000 });
  s = await p.evaluate(() => ({ luu: localStorage.getItem('kpi_chia_doi'), mo: document.body.classList.contains('cd-mo'), nut: !!document.querySelector('#lsbox .cd-kieu') }));
  ok(s.luu === 'tat' && !s.mo && s.nut, 'về cửa sổ cũ, nhớ lựa chọn, có nút "⧉ Chia đôi" để bật lại', s);
  await p.click('#lsbox .cd-kieu'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ luu: localStorage.getItem('kpi_chia_doi'), mo: document.body.classList.contains('cd-mo'), modal: !!document.getElementById('lsbox') }));
  ok(s.luu === 'bat' && s.mo && !s.modal, 'bấm "⧉ Chia đôi": quay lại kiểu chia đôi', s);
  ok(!p.jsLoi.length, 'không có lỗi JavaScript', p.jsLoi);

  console.log('\n5. Điện thoại (390px): giữ cách cũ');
  const q = await moTrang(b, 390);
  await moKPI(q);
  await q.evaluate(() => document.querySelectorAll('#kpi_bang button[onclick^="xemChiTietKPI"]')[0].click());
  await q.waitForSelector('#lsbox', { timeout: 20000 });
  ok(await q.evaluate(() => !document.body.classList.contains('cd-mo')), 'màn hẹp: mở cửa sổ lịch sử như trước, không chia đôi');
  await q.evaluate(() => go('ns')); await q.waitForTimeout(600);
  await q.evaluate(() => document.querySelectorAll('button[onclick^="xemHS"]')[0].click());
  await q.waitForFunction(() => /Về danh sách/.test(document.getElementById('main').textContent), null, { timeout: 20000 });
  ok(true, 'màn hẹp: hồ sơ mở thành trang riêng như trước');
  ok(!q.jsLoi.length, 'không có lỗi JavaScript trên điện thoại', q.jsLoi);

  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
  process.exit(loi ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
