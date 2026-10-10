const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra nhân vật Mai đã gắn vào web thật (va-index.py mục 12) trên bản xem thử 1 file.
 *   F=<bản xem thử .html> [OUT=<thư mục ảnh>] node tests/mai-web.js
 */
const F = 'file://' + process.env.F, OUT = process.env.OUT || '/tmp';
let dem = 0, loiDem = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loiDem++; console.log('  ✗ ' + ten + (ct !== undefined ? ' → ' + JSON.stringify(ct).slice(0, 260) : '')); } };
async function vao(b, tk, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: o.dt ? { width: 390, height: 844 } : { width: 1440, height: 900 } }, o.dt ? { isMobile: true, hasTouch: true } : {}, o.giam ? { reducedMotion: 'reduce' } : {}, { timezoneId: 'Asia/Ho_Chi_Minh', locale: 'vi-VN' }));
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message));
  if (o.gio) await p.clock.install({ time: new Date(o.gio) });
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click(`#xtGoiY button:has-text("${tk}")`);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(o.gio ? 0 : 1800); return p;
}
const goc = p => p.evaluate(() => { const g = document.getElementById('maiGoc'); return g ? { hien: g.classList.contains('hien'), chu: g.textContent } : { hien: false, chu: '' }; });
(async () => {
  const b = await chromium.launch();

  console.log('\n1. Công nhân đăng nhập lần đầu');
  let p = await vao(b, 'c068');
  await p.waitForTimeout(900);
  let g = await goc(p);
  ok(!g.hien, 'đang hướng dẫn: lời chào lùi lại, không chồng lên khung hướng dẫn', g.chu.slice(0, 80));
  ok(await p.evaluate(() => /Khẩu hiệu hôm nay/.test(document.querySelector('#main .mai-bang') ? document.querySelector('#main .mai-bang').textContent : '')), 'trang Nhập sản lượng có dải khẩu hiệu của ngày');
  await p.waitForSelector('#maiTour.mo', { timeout: 5000 }).catch(() => {});
  ok(await p.evaluate(() => document.getElementById('maiTour') && document.getElementById('maiTour').classList.contains('mo')), 'lần đầu vào trang: Mai tự mở hướng dẫn');
  const tong = await p.evaluate(() => __maiT.ds.length);
  ok(tong >= 9 && tong <= 11, 'hướng dẫn có ' + tong + ' bước (bỏ bước không có phần tử)', tong);
  await p.click('#maiTiep'); await p.waitForTimeout(500);
  const ro = await p.evaluate(() => { const r = document.querySelector('#maiTour .ro').getBoundingClientRect(), e = document.getElementById('cf_ngay').getBoundingClientRect(); return [Math.round(r.left), Math.round(e.left), Math.round(r.top), Math.round(e.top)]; });
  ok(Math.abs(ro[0] - (ro[1] - 6)) <= 2 && Math.abs(ro[2] - (ro[3] - 6)) <= 2, 'bước 2: rọi sáng đúng ô Ngày', ro);
  await p.screenshot({ path: OUT + '/mai-tour.png' });
  for (let i = 0; i < 15 && await p.evaluate(() => document.getElementById('maiTour').classList.contains('mo')); i++) { await p.click('#maiTiep'); await p.waitForTimeout(250); }
  ok(!(await p.evaluate(() => document.getElementById('maiTour').classList.contains('mo'))), 'bấm Tiếp tới cuối thì đóng');
  ok(await p.evaluate(() => localStorage.getItem('kpi_mai_hd_cn_' + ME.tk) === '1'), 'nhớ đã xem (lần sau không tự mở)');
  await p.evaluate(() => go('kpica')); await p.waitForTimeout(400); await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(1200);
  ok(!(await p.evaluate(() => document.getElementById('maiTour').classList.contains('mo'))), 'quay lại trang: không tự mở nữa');
  await p.click('button:has-text("? Hướng dẫn nhập")'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('maiTour').classList.contains('mo')), 'nút "? Hướng dẫn nhập" mở lại');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(!(await p.evaluate(() => document.getElementById('maiTour').classList.contains('mo'))), 'Esc đóng hướng dẫn');

  console.log('\n2. Gửi sản lượng: đọc lại trước khi gửi, khen sau khi gửi');
  const cdCN = await p.evaluate(() => { const c = (D.congdoan || []).filter(c => c.MaXuong === ME.xuong); if (c.length < 2) return null; cnRows = [{ MaCD: c[0].MaCD, SoLuongLamRa: 412, SoLoi: 3 }, { MaCD: c[1].MaCD, SoLuongLamRa: 38000, SoLoi: 0 }]; cnGui(); return c[0].MaCD; });
  await p.waitForTimeout(300);
  const hop = await p.evaluate(() => { const h = document.getElementById('maiHop'); return h ? { mo: h.classList.contains('mo'), t: h.textContent } : {}; });
  ok(cdCN && hop.mo && /412 cái · lỗi 3/.test(hop.t) && /38\.000 cái/.test(hop.t) && /Tổng38\.412 cái · lỗi 3/.test(hop.t), 'Mai đọc lại từng dòng + tổng', hop.t && hop.t.slice(0, 200));
  ok(/gõ thừa số 0/.test(hop.t), 'dòng trên 5.000 cái: Mai hỏi có gõ thừa số 0 không');
  await p.screenshot({ path: OUT + '/mai-doc-lai.png' });
  const cho0 = await p.evaluate(() => D.choDuyet.length);
  await p.click('#maiSua'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => D.choDuyet.length) === cho0 && await p.evaluate(() => cnGui._dangGui === false && cnRows.length === 2), '"Sửa lại": không gửi, giữ nguyên số đang nhập');
  await p.evaluate(() => { cnRows[1].SoLuongLamRa = 380; cnGui(); }); await p.waitForTimeout(300);
  await p.click('#maiGui');
  await p.waitForFunction(() => /chờ trưởng phòng duyệt/.test(($('ltPhu') || {}).textContent || ''), null, { timeout: 8000 }).catch(() => {});
  ok(/chờ trưởng phòng duyệt/.test(await p.evaluate(() => ($('ltPhu') || {}).textContent || '')), '"Đúng rồi, gửi": gửi thật, hiện hoạt ảnh chờ duyệt');
  await p.waitForTimeout(4200);
  g = await goc(p);
  ok(g.hien && /Đã gửi/.test(g.chu), 'sau đó Mai khen ở góc màn hình', g.chu.slice(0, 120));
  await p.screenshot({ path: OUT + '/mai-khen.png' });

  console.log('\n3. KPI cá nhân + tắt Mai');
  await p.evaluate(() => go('kpica')); await p.waitForTimeout(800);
  const kp = await p.evaluate(() => { const x = [...document.querySelectorAll('#main .mai-bang')].find(e => /KPI của bạn/.test(e.textContent)); return x ? x.textContent : null; });
  ok(kp === null || /hạng (A\+|A|B|C|D)/.test(kp), 'KPI cá nhân: Mai động viên theo hạng thật' + (kp ? '' : ' (tài khoản chưa có KPI – không hiện)'), kp && kp.slice(0, 120));
  await p.click('#btnMai'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => maiTat() && !document.querySelector('#main .mai-bang') && /tắt/.test(document.getElementById('btnMai').textContent)), 'nút "Mai" tắt: hết dải khẩu hiệu, nút đổi chữ');
  await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(600);
  ok(await p.evaluate(() => !document.querySelector('#main .mai-bang')), 'đã tắt: trang Nhập sản lượng không còn Mai');
  await p.click('#btnMai'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !maiTat() && !!document.querySelector('#main .mai-bang')), 'bật lại được');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  console.log('\n4. Trưởng phòng: khẩu hiệu ở Việc hôm nay, không có hướng dẫn công nhân');
  p = await vao(b, 'tpdg');
  g = await goc(p);
  ok(g.hien && /Chào (buổi|ca)/.test(g.chu) && /Khẩu hiệu|An toàn|Chất lượng|Năng suất|5S|Đồng đội|Sức khỏe/.test(g.chu), 'đăng nhập: Mai chào theo buổi + tên + khẩu hiệu', g.chu.slice(0, 100));
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !!document.querySelector('#main .mai-bang')), 'Việc hôm nay có khẩu hiệu của ngày');
  const kh1 = await p.evaluate(() => maiKhNgay('2026-10-07').cau), kh2 = await p.evaluate(() => maiKhNgay('2026-10-07').cau), kh3 = await p.evaluate(() => maiKhNgay('2026-10-08').cau);
  ok(kh1 === kh2 && kh1 !== kh3, 'cùng ngày cùng câu, ngày sau câu khác');
  ok(await p.evaluate(() => !document.getElementById('maiTour')), 'không tự mở hướng dẫn công nhân');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  console.log('\n5. Nhắc nghỉ giữa ca, chào mỗi ngày một lần');
  p = await vao(b, 'tpdg', { gio: '2026-10-07T10:05:00+07:00' });
  await p.clock.runFor(2500); await p.waitForTimeout(100);
  await p.clock.runFor(6000);
  g = await goc(p);
  ok(g.hien && /giữa ca · 10:00/.test(g.chu), 'lúc 10:05: Mai nhắc uống nước, nghỉ mắt', g.chu.slice(0, 100));
  await p.clock.runFor(11000); g = await goc(p);
  ok(!g.hien, 'tự ẩn sau 10 giây');
  await p.clock.runFor(61000); g = await goc(p);
  ok(!g.hien, 'không nhắc lại lần nữa trong cùng mốc');
  ok(await p.evaluate(() => localStorage.getItem('kpi_mai_chao_' + ME.tk) === today()), 'đã ghi nhớ lời chào hôm nay (không chào lại)');
  await p.context().close();

  console.log('\n6. Điện thoại + giảm chuyển động');
  p = await vao(b, 'c068', { dt: true });
  await p.waitForSelector('#maiTour.mo', { timeout: 5000 }).catch(() => {});
  const vn = await p.evaluate(() => { const v = document.querySelector('#maiTour .vn').getBoundingClientRect(), bb = document.getElementById('botbar').getBoundingClientRect(); return { duoi: Math.round(v.bottom), botbar: Math.round(bb.top), rong: Math.round(v.width), tran: document.documentElement.scrollWidth }; });
  ok(vn.duoi <= vn.botbar && vn.rong <= 390 && vn.tran <= 391, 'điện thoại: khung thoại nằm trên thanh dưới, không tràn ngang', vn);
  await p.screenshot({ path: OUT + '/mai-dt.png' });
  ok(await p.evaluate(() => getComputedStyle(document.getElementById('btnMai')).display !== 'none'), 'điện thoại: nút Mai vẫn hiện ở đầu trang');
  await p.context().close();
  p = await vao(b, 'c068', { giam: true });
  ok(await p.evaluate(() => { const e = document.querySelector('.mai .rh-anh'); return e && getComputedStyle(e).animationName === 'none'; }), 'giảm chuyển động: nhân vật Rhino đứng yên');
  await p.context().close();

  await b.close();
  console.log(`\n${dem - loiDem}/${dem} đạt`); process.exit(loiDem ? 1 : 0);
})();
