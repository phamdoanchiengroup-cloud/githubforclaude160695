const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
/** Kiểm tra tab "Sơ đồ nhà máy" đã gắn vào web (va-index.py mục 15) trên bản xem thử 1 file:
 *    DATA=csdl.json OUT=$S/xem-thu.html TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xem-thu.html THREE=<gói npm three@0.160.0> OUT=<thư mục ảnh> node tests/so-do-web.js
 *  (không có THREE thì bỏ qua phần 3D) */
const F = 'file://' + process.env.F, THREE = process.env.THREE || '', OUT = process.env.OUT || '';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: o.h || 900 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}));
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  if (THREE) await ctx.route(/cdn\.jsdelivr\.net\/npm\//, r => { const u = r.request().url(), g = 'three@0.160.0/';
    if (!u.includes(g)) return r.abort(); r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(THREE, u.split(g)[1])) }); });
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click(`#xtGoiY button:has-text("${tk}")`);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1200);
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });
  p.ctx = ctx; return p;
}
const mauPhong = (p, ten) => p.evaluate(t => { const g = [...document.querySelectorAll('#sdMb .phong')].find(x => x.getAttribute('aria-label').startsWith(t)); return g ? g.querySelector('rect').getAttribute('fill') : null; }, ten);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });

  console.log('ADMIN · máy tính');
  let p = await vao(b, 'chienpham');
  let s = await p.evaluate(() => [...document.querySelectorAll('#nav button')].map(x => x.dataset.k));
  ok(s.indexOf('sodo') === s.indexOf('dash') + 1, 'menu có "Sơ đồ nhà máy" ngay sau Tổng quan', s);
  await p.evaluate(() => go('sodo')); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [document.querySelectorAll('#sdMb .phong').length, document.querySelectorAll('#sdXs button').length, D.phongban.length, document.querySelector('.ptitle').textContent]);
  ok(s[0] === 20 && s[1] === s[2] && s[3] === 'Sơ đồ nhà máy', 'Tầng 1 vẽ 20 khu; danh sách đủ mọi xưởng', s);
  // KPI xưởng tính lại độc lập từ dữ liệu (đã chốt, từ đầu tháng)
  const kt = await p.evaluate(() => {
    const dau = today().slice(0, 8) + '01', ra = {};
    D.phongban.forEach(pb => {
      const cds = D.congdoan.filter(c => c.MaXuong === pb.MaXuong).map(c => c.MaCD);
      const pn = {}; D.nhatky.filter(r => cds.includes(r.MaCD) && ngay(r.Ngay) >= dau).forEach(r => { const k = r.MaNV + '|' + ngay(r.Ngay); (pn[k] = pn[k] || []).push(r); });
      let a = 0, ms = 0; Object.keys(pn).forEach(k => { const [nv, nd] = k.split('|'), g = gioCoMatNgay(nv, nd); if (g <= 0) return; ms += g; pn[k].forEach(r => { const d = dm(r.MaCD); if (d > 0) a += (Number(r.SoLuongLamRa) - ngLoi(r)) / d; }); });
      ra[pb.MaXuong] = ms > 0 ? Math.round(a / ms * 100) : null;
    });
    return [ra, Object.fromEntries(Object.keys(SS.SO).map(k => [k, SS.SO[k].kpi]))];
  });
  ok(JSON.stringify(kt[0]) === JSON.stringify(kt[1]), 'KPI tháng này của từng xưởng khớp cách tính "So sánh hiệu suất giữa các xưởng"', kt);
  s = await p.evaluate(() => { const R = SD_DATA[0].rooms.find(r => SS.xuong(0, r) && SS.SO[SS.xuong(0, r)] && SS.SO[SS.xuong(0, r)].kpi !== null); if (!R) return null;
    const ma = SS.xuong(0, R); return [R.n, SS.mauKPI(SS.SO[ma].kpi), SS.SO[ma].kpi]; });
  if (s) ok(await mauPhong(p, s[0]) === s[1], 'khu "' + s[0] + '" tô đúng màu theo KPI ' + s[2] + '%', [await mauPhong(p, s[0]), s]);
  if (s) { await p.click(`#sdMb .phong[aria-label^="${s[0]}"]`); await p.waitForTimeout(200);
    const ct = await p.textContent('#sdCt'); ok(ct.includes(s[0]) && ct.includes(s[2] + '% · hạng') && /Mở Bảng KPI/.test(ct), 'chạm khu: thẻ chi tiết có KPI + hạng + nút mở Bảng KPI', ct.slice(0, 200)); }
  s = await p.evaluate(() => { const cho = {}; D.choDuyet.forEach(r => { const m = cd(r.MaCD).MaXuong; cho[m] = (cho[m] || 0) + 1; }); return Object.keys(SS.SO).every(k => SS.SO[k].cho === (cho[k] || 0)); });
  ok(s, 'số dòng chờ duyệt theo xưởng khớp D.choDuyet');
  // sĩ số: lấy từ siSoTatCaXuong, không giữ lý do nghỉ
  s = await p.evaluate(() => [SD.sisoNgay === today() || laChuNhat(today()), JSON.stringify(SD.siso || []).includes('dsNghi')]);
  ok(s[0] && !s[1], 'đã tải sĩ số hôm nay; chỉ giữ số đếm, không giữ danh sách / lý do nghỉ', s);
  await p.click('#sdMau button[data-c="siso"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => [SS.cheDo, document.querySelector('#sdXs .so').textContent, document.getElementById('sdCgiai').textContent]);
  ok(s[0] === 'siso' && /^(\d+\/\d+|–)$/.test(s[1]) && /Đủ người/.test(s[2]), 'đổi "Sĩ số hôm nay": số dạng có mặt/định biên, chú giải đổi theo', s);
  await p.click('#sdMau button[data-c="kpi"]');
  // máy bảo trì thật
  s = await p.evaluate(() => { const m = D.maymoc.find(x => String(x.TinhTrang).trim() === 'Hoạt động' && SS.SO[x.MaXuong]); if (!m) return null; m.TinhTrang = 'Bảo trì'; go('sodo'); return [m.MaMay, m.MaXuong]; });
  await p.waitForTimeout(400);
  if (s) { const t = await p.evaluate(x => { const b = document.querySelector('#sdXs button[data-x="' + x[1] + '"]'); return [b.textContent, SS.them(x[1])]; }, s);
    ok(/máy BT/.test(t[0]) && t[1].includes(s[0]), 'máy báo bảo trì: xưởng có dấu ⚠ trong danh sách, thẻ chi tiết liệt kê mã máy', t); }
  // xưởng ở danh sách → nổi khu trên sơ đồ
  s = await p.evaluate(() => { const x = SS.XUONG.map(x => x[0]).find(m => SD_DATA[1].rooms.some(r => SS.xuong(1, r) === m) && !SD_DATA[0].rooms.some(r => SS.xuong(0, r) === m)); return x; });
  if (s) { await p.click(`#sdXs button[data-x="${s}"]`); await p.waitForTimeout(200);
    const t = await p.evaluate(() => [SD.tang, document.querySelectorAll('#sdMb .phong.sang').length, document.getElementById('sdMb').classList.contains('loc')]);
    ok(t[0] === 1 && t[1] > 0 && t[2], 'bấm xưởng ' + s + ' ở danh sách: tự sang Tầng 2, làm nổi khu của xưởng', t); }
  // bảng ghép (ADMIN), lưu trên trình duyệt
  await p.click('details.sd-ghep summary');
  await p.selectOption('#sdBg select[data-fi="0"]:not([data-x])', '');
  s = await p.evaluate(() => { const e = document.querySelector('#sdBg select[data-fi="0"]'); return [JSON.parse(localStorage.getItem('kpi_sodo_ghep') || '{}'), SS.xuong(0, SD_DATA[0].rooms[+e.dataset.ri])]; });
  ok(Object.values(s[0]).includes('') && s[1] === '', 'bảng ghép: đổi khu → lưu localStorage, sơ đồ đổi ngay', s);
  await p.evaluate(() => localStorage.removeItem('kpi_sodo_ghep'));
  ok(await p.evaluate(() => !document.getElementById('sdNut3d').classList.contains('hide')), 'máy tính: có nút "Xem 3D"');
  // phóng to 2D
  await p.evaluate(() => { SD.chon = null; sdDatTang(0); });
  const bx = await p.locator('#sdMb').boundingBox(), vb = () => p.evaluate(() => document.getElementById('sdMb').getAttribute('viewBox').split(' ').map(Number));
  const y0 = await p.evaluate(() => scrollY);
  await p.mouse.move(bx.x + bx.width * .8, bx.y + bx.height * .3); await p.mouse.wheel(0, 300); await p.waitForTimeout(150);
  ok((await vb())[2] === 45.75 && (await p.evaluate(() => scrollY)) >= y0, 'đang toàn cảnh mà cuộn ra: sơ đồ giữ nguyên, trang cuộn bình thường');
  await p.evaluate(() => scrollTo(0, 0)); const bx2 = await p.locator('#sdMb').boundingBox();
  const px = bx2.x + bx2.width * .8, py = bx2.y + bx2.height * .3;
  const truoc = await p.evaluate(([x, y]) => sdDiem(document.getElementById('sdMb'), x, y), [px, py]);
  await p.mouse.move(px, py); for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(60); }
  let v = await vb(); const sau = await p.evaluate(([x, y]) => sdDiem(document.getElementById('sdMb'), x, y), [px, py]);
  ok(v[2] < 30 && Math.hypot(truoc[0] - sau[0], truoc[1] - sau[1]) < .05 && !(await p.evaluate(() => SD.chon)), 'cuộn chuột vào: phóng to, điểm dưới con trỏ đứng yên', [v, truoc, sau]);
  await p.mouse.move(px, py); await p.mouse.down(); await p.mouse.move(px - 120, py + 40, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(100);
  const v2 = await vb();
  ok(v2[0] > v[0] && v2[2] === v[2] && !(await p.evaluate(() => SD.chon)), 'kéo để dời sơ đồ, thả tay không chọn nhầm khu', [v, v2]);
  await p.click('.sd-zoom button[data-z="in"]'); await p.waitForTimeout(80);
  ok((await vb())[2] < v2[2] - 1, 'nút + phóng to thêm');
  await p.click('.sd-zoom button[data-z="fit"]'); await p.waitForTimeout(80);
  ok(JSON.stringify(await vb()) === JSON.stringify([-0.5, -0.5, 45.75, 35.25]), 'nút ⌂ về toàn cảnh');
  await p.mouse.dblclick(px, py); await p.waitForTimeout(80);
  ok((await vb())[2] < 25, 'nhấp đúp: phóng nhanh vào chỗ đó');
  await p.click('.sd-zoom button[data-z="fit"]');
  if (OUT) await p.screenshot({ path: OUT + '/so-do-web.png', fullPage: true });
  if (THREE) {
    await p.click('#sdNut3d');
    const f3 = await (await p.waitForSelector('#sd3d iframe')).contentFrame();
    await f3.waitForSelector('#c3d canvas', { timeout: 60000 }); await p.waitForTimeout(4000);
    s = await f3.evaluate(() => [!!window.SS, document.querySelector('#segMau button[data-c="kpi"]').textContent, document.getElementById('legend').textContent]);
    ok(s[0] && s[1] === 'KPI tháng này' && /A \/ A\+/.test(s[2]), 'bản 3D dùng chung số liệu thật: nút "KPI tháng này", chú giải KPI', s);
    if (OUT) await p.screenshot({ path: OUT + '/so-do-web-3d.png' });
    const kc = () => f3.evaluate(() => __v3.cam.position.distanceTo(__v3.ctl.target));
    s = [await f3.evaluate(() => __v3.ctl.zoomToCursor), await kc()];
    // máy ảo vẽ 3D chậm: chờ camera bay xong rồi mới đo
    const doi = async () => { let a = await kc(), b; for (let i = 0; i < 40; i++) { await p.waitForTimeout(300); b = await kc(); if (Math.abs(a - b) < 1e-3 && !(await f3.evaluate(() => __v3.dangBay && __v3.dangBay()))) break; a = b; } return b; };
    await f3.evaluate(() => document.getElementById('zIn').click()); await p.waitForTimeout(400); s.push(await doi());
    await f3.evaluate(() => document.getElementById('zOut').click()); await p.waitForTimeout(400); s.push(await doi());
    ok(s[0] && s[2] < s[1] * .7 && Math.abs(s[3] - s[1]) < 1, '3D: cuộn chuột phóng theo con trỏ; nút + / − phóng to, thu nhỏ', s);
    const c3 = await f3.locator('#c3d canvas').boundingBox(); const t0 = await f3.evaluate(() => __v3.ctl.target.toArray());
    await p.mouse.move(c3.x + c3.width * .3, c3.y + c3.height * .7); await p.mouse.wheel(0, -400); await p.waitForTimeout(800);
    const t1 = await f3.evaluate(() => __v3.ctl.target.toArray());
    ok(Math.hypot(t1[0] - t0[0], t1[2] - t0[2]) > .5, '3D: cuộn chuột ở góc màn hình thì tâm nhìn dời về phía con trỏ', [t0, t1]);
    await f3.evaluate(() => document.getElementById('zFit').click()); await p.waitForTimeout(900);
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => !document.getElementById('sd3d') && SS.nghe.length === 1), 'Esc đóng 3D, gỡ phần nghe của bản 3D');
  }
  ok(!p.loi.length, 'không lỗi JS', p.loi);
  await p.ctx.close();

  console.log('TP · chỉ xưởng mình');
  p = await vao(b, 'tpdg');
  await p.evaluate(() => go('sodo')); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [Object.keys(SS.SO), ME.xuong, !!document.getElementById('sdBg'), (SD.siso || []).map(x => x.MaXuong)]);
  ok(s[0].length === 1 && s[0][0] === s[1] && !s[2] && s[3].every(x => x === s[1]), 'TP chỉ thấy số liệu xưởng mình, không có bảng ghép, sĩ số chỉ xưởng mình', s);
  ok(!p.loi.length, 'không lỗi JS', p.loi);
  await p.ctx.close();

  console.log('CN · không có tab');
  p = await vao(b, 'c068');
  ok(await p.evaluate(() => !document.querySelector('#nav button[data-k="sodo"]')), 'công nhân không thấy tab Sơ đồ nhà máy');
  await p.ctx.close();

  console.log('ADMIN · điện thoại');
  p = await vao(b, 'chienpham', { w: 390, h: 844, cham: true });
  await p.evaluate(() => go('sodo')); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'không tràn ngang');
  ok((await p.locator('#sdMb').boundingBox()).width >= 320, 'sơ đồ rộng gần hết màn hình');
  ok(await p.evaluate(() => document.getElementById('sdNut3d').classList.contains('hide')), 'điện thoại: ẩn nút "Xem 3D"');
  await p.tap('#sdTang button[data-f="2"]'); await p.waitForTimeout(200);
  await p.tap('#sdMb .phong[aria-label^="Khu vực CNC"]'); await p.waitForTimeout(500);
  ok(/Khu vực CNC/.test(await p.textContent('#sdCt')), 'Tầng 3: chạm khu CNC ra thẻ chi tiết');
  if (OUT) await p.screenshot({ path: OUT + '/so-do-web-dt.png', fullPage: true });
  ok(!p.loi.length, 'không lỗi JS', p.loi);
  await p.ctx.close(); await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
