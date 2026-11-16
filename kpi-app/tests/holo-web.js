const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 34 (tests/holo/): giao diện kính chỉ cho tài khoản chủ sở hữu (16/11 thay hologram – hologram đã bỏ hẳn).
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
  await p.evaluate(() => { try { localStorage.removeItem('kpi_kinh'); localStorage.removeItem('kpi_kinh_tong'); } catch (e) {} holoApDung(); });
  await p.waitForTimeout(2500);   // 16/11: nền là ảnh thật qua jsDelivr; tải lỗi (máy thử không có mạng ảnh) thì tự vẽ nền thay
  let s = await p.evaluate(() => { const h = document.documentElement; return { rs: h.classList.contains('rs'), xanh: h.classList.contains('rs-xanh'), holo: h.classList.contains('holo'), cv: !!document.getElementById('holoSao'),
    nen: /url\("?(data:image|https:\/\/cdn\.jsdelivr\.net)/.test(h.style.getPropertyValue('--rs-nen')) && !!(window.KINH_ANH && KINH_ANH.xanh.may), nut: (document.getElementById('btnHolo') || {}).textContent, tong: (document.getElementById('btnTong') || {}).textContent }; });
  ok(s.rs && s.xanh && !s.holo && !s.cv && s.nen && /Giao diện kính.*Đầy đủ/.test(s.nut || '') && /Xanh rừng/.test(s.tong || ''), 'mặc định: kính đầy đủ tông xanh, không còn hologram / nền sao, 2 nút cuối menu', s);
  await moDash(p); await p.waitForTimeout(1600);   // 08/11: số chạy từ 0 lên ~1,1 giây
  s = await p.evaluate(() => {
    // tự tính lại để so: trung bình KPI tháng của người đang làm (không tính TP/PP) theo xưởng, chỉ người đã có KPI
    const xs = {}; let tong = 0, n = 0;
    D.nhansu.filter(x => String(x.TrangThai).trim() === 'Đang làm' && String(x.laTP).toUpperCase() !== 'TRUE').forEach(x => {
      const k = kpi(x.MaNV); if (!k || !(k.tong > 0)) return; (xs[x.MaXuong] = xs[x.MaXuong] || []).push(k.tong); tong += k.tong; n++; });
    const dai = document.getElementById('hlDai');
    return { co: !!dai, sao: dai ? dai.querySelectorAll('.hl-sao').length : 0, soX: Object.keys(xs).length, tb: n ? tong / n : 0,
      giua: dai ? dai.querySelector('svg text[font-size="17"]').textContent : '', an: getComputedStyle(document.querySelector('#main .kpis') || document.body).display, coKpis: !!document.querySelector('#main .kpis'), duoi80: /dưới 80%|chưa khai báo/i.test(document.getElementById('main').innerText), tqKhoi: !!document.getElementById('tqKhoi'),
      dong: [...(dai ? dai.querySelectorAll('.hl-dg') : [])].map(d => [d.getAttribute('data-x'), d.querySelector('b').textContent]),
      dung: Object.keys(xs).map(m => [m, (xs[m].reduce((a, b) => a + b, 0) / xs[m].length).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })]) };
  });
  ok(s.co && s.sao === s.soX && s.soX > 3, 'Tổng quan có "Đài quan sát KPI": ' + s.sao + ' ngôi sao = ' + s.soX + ' xưởng có KPI tháng này', s);
  ok(s.giua === s.tb.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 'tâm vòng = KPI trung bình nhà máy (' + s.giua + ')', [s.giua, s.tb]);
  ok(s.dung.every(d => s.dong.some(x => x[0] === d[0] && x[1] === d[1])), 'KPI từng xưởng khớp với cách tính lại (trung bình người có KPI tháng này)', { dong: s.dong, dung: s.dung });
  ok(s.an === 'none' || !s.coKpis, 'ô Hiệu suất / Tỷ lệ đạt cũ không còn (Tổng quan chủ sở hữu mới 08/11)');
  ok(!s.duoi80 && s.tqKhoi, 'Tổng quan chủ sở hữu: có khối số hằng ngày, không còn "dưới 80%" / "chưa khai báo"', s.duoi80);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'không tràn ngang (1360px)');
  await chup(p, 'holo-may-tinh');
  const ma = await p.evaluate(() => document.querySelector('#hlDai .hl-sao').getAttribute('data-x'));
  await p.click('#hlDai .hl-sao circle.vong'); await p.waitForTimeout(600);
  s = await p.evaluate(() => ({ tab: tabHienTai, x: kpiXuong }));
  ok(s.tab === 'kpi' && s.x === ma, 'bấm 1 ngôi sao: mở Bảng KPI lọc đúng xưởng ' + ma, s);
  await p.evaluate(() => { xuongLoc = ''; kpiXuong = ''; });
  console.log('\n2. Nút đổi chế độ');
  await moDash(p);
  await p.evaluate(() => document.getElementById('btnTong').click()); await p.waitForTimeout(400);
  s = await p.evaluate(() => ({ do: document.documentElement.classList.contains('rs-tien'), luu: localStorage.getItem('kpi_kinh_tong'), t: document.getElementById('btnTong').textContent }));
  ok(s.do && s.luu === 'tien' && /Tiên cảnh/.test(s.t), 'nút Tông màu: xanh → tiên cảnh, máy nhớ', s);
  await p.evaluate(() => document.getElementById('btnTong').click()); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.documentElement.classList.contains('rs-xanh')), 'bấm tiếp: tiên cảnh → về xanh');
  await p.evaluate(() => document.getElementById('btnHolo').click()); await p.waitForTimeout(500);
  s = await p.evaluate(() => ({ rs: document.documentElement.classList.contains('rs'), nhe: document.documentElement.classList.contains('rs-nhe'), nut: document.getElementById('btnHolo').textContent, dai: !!document.getElementById('hlDai'),
    blur: getComputedStyle(document.querySelector('.card') || document.body).backdropFilter }));
  ok(s.rs && s.nhe && /Nhẹ/.test(s.nut) && s.dai && (s.blur === 'none' || !s.blur), 'Giao diện kính lần 1: Nhẹ – bỏ làm mờ, Đài quan sát vẫn còn', s);
  await p.evaluate(() => document.getElementById('btnHolo').click()); await p.waitForTimeout(500);
  s = await p.evaluate(() => ({ rs: document.documentElement.classList.contains('rs'), tong: document.getElementById('btnTong').style.display, dai: !!document.getElementById('hlDai'), luu: localStorage.getItem('kpi_kinh') }));
  ok(!s.rs && s.tong === 'none' && s.dai && s.luu === 'tat', 'lần 2: Tắt – về giao diện thường (Đài quan sát vẫn giữ), ẩn nút Tông màu, máy nhớ', s);
  await p.evaluate(() => document.getElementById('btnHolo').click()); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.documentElement.classList.contains('rs') && !document.documentElement.classList.contains('rs-nhe')), 'lần 3: bật lại đầy đủ');
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
    await p.evaluate(() => { try { localStorage.removeItem('kpi_kinh'); } catch (e) {} });
    if (await p.evaluate(() => ME.vaiTro === 'ADMIN' || ME.vaiTro === 'TP')) await moDash(p);
    s = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('holo') || document.documentElement.classList.contains('rs'), nut: !!document.getElementById('btnHolo') || !!document.getElementById('btnTong'), dai: !!document.getElementById('hlDai'), cv: !!document.getElementById('holoSao'), owner: ME.laOwner }));
    if (tk === 'giamdoc') ok(s.cls && s.nut && !s.dai && !s.owner, tk + ' (C019): có giao diện kính + nút (16/11 tối), không có Đài quan sát của chủ sở hữu', s);
    else ok(!s.cls && !s.nut && !s.dai && !s.cv && !s.owner, tk + ': không có giao diện kính / hologram, không có nút', s);
    ok(!p.jsLoi.length, tk + ': không lỗi JS', p.jsLoi);
    await p.context().close();
  }
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
