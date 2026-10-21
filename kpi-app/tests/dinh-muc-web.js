const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử tab Phân tích định mức (mục 28, tests/dinh-muc/): gợi ý mọi công đoạn về 85%, chọn sẵn, lời xác nhận áp cả tháng,
 *  áp hàng loạt rồi phân tích lại quanh 85%.
 *    DATA=csdl.json OUT=$S/xt-dm.html GIO=2026-10-21T10:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt-dm.html node tests/dinh-muc-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(), jsLoi = [], hop = [];
  p.on('pageerror', e => jsLoi.push(e.message));
  p.on('dialog', d => { hop.push(d.type() + ': ' + d.message()); d.accept(d.type() === 'prompt' ? 'Thử' : undefined); });
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click('#xtGoiY button:has-text("chienpham")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });

  console.log('1. Phân tích tháng 10');
  await p.evaluate(() => { go('ptdm'); ptdmKy = { kieu: 'thang', giaTri: '2026-10' }; ptdmChay(); });
  await p.waitForFunction(() => document.querySelectorAll('#ptdm_kq tbody tr').length > 5, null, { timeout: 60000 });
  let s = await p.evaluate(() => ({
    nen: document.querySelector('#main .alert.a-nu').textContent,
    tom: (document.querySelector('#ptdm_kq .alert.a-bd') || {}).textContent || '',
    ca: [...document.querySelectorAll('#ptdm_kq .alert')].map(x => x.textContent).join(' | '),
    hang: document.querySelectorAll('#ptdm_kq tbody tr').length,
    ck: document.querySelectorAll('.ptdm-ck').length, ckChon: document.querySelectorAll('.ptdm-ck:checked').length,
    goiY: ptdmKq.ds.filter(x => x.dmGoiY > 0).length, itNguoiGY: ptdmKq.ds.filter(x => x.dmGoiY > 0 && x.itNguoi).length,
    buoc: [...document.querySelectorAll('#ptdm_kq input[type=number]')].every(i => i.step === 'any'),
    giaTri: ptdmKq.ds.filter(x => x.dmGoiY > 0).every(x => { const i = document.getElementById('dm_' + x.maCD); return i && Number(i.value) === x.dmGoiY; }),
    pill: [...new Set([...document.querySelectorAll('#ptdm_kq .pill')].map(x => x.textContent))],
    phu: [...document.querySelectorAll('#ptdm_kq tbody td')].some(td => /công đoạn phụ/.test(td.textContent)),
    du: [...document.querySelectorAll('#ptdm_kq tbody td')].some(td => /dự kiến \d/.test(td.textContent))
  }));
  ok(/cả tháng đang làm/.test(s.nen) && /hạ/.test(s.nen), 'hướng dẫn: mốc 85%, nâng/hạ, đổi định mức áp cả tháng', s.nen);
  ok(/nên đổi định mức/.test(s.tom) && /nâng \d+/.test(s.tom) && /hạ \d+/.test(s.tom), 'tóm tắt số công đoạn nâng / hạ', s.tom);
  ok(/cả tháng 10\/2026/.test(s.ca), 'báo đổi định mức áp cả tháng 10/2026', s.ca);
  ok(s.ck === s.goiY && s.goiY > 50, 'mọi công đoạn có gợi ý đều có ô chọn (' + s.ck + ')', s);
  ok(s.ckChon === s.goiY, 'chọn sẵn tất cả gợi ý (kể cả ' + s.itNguoiGY + ' công đoạn ít người – bỏ ra sẽ lệch lời giải chung)', s);
  ok(s.giaTri && s.buoc, 'ô sửa điền sẵn đúng định mức gợi ý, nhập được số lẻ (step any)');
  ok(s.pill.some(x => /Chặt/.test(x)) && s.pill.some(x => /Lỏng/.test(x)), 'đánh giá có cả chặt và lỏng', s.pill);
  ok(s.phu && s.du, 'có ghi chú công đoạn phụ và hiệu suất dự kiến');
  s = await p.evaluate(() => { document.getElementById('ptdm_loc').value = 'tatca'; document.getElementById('ptdm_loc').onchange(); return document.querySelectorAll('#ptdm_kq tbody tr').length; });
  ok(s >= (await p.evaluate(() => ptdmKq.ds.length)), 'bộ lọc "Tất cả công đoạn" hiện đủ ' + s + ' dòng');

  console.log('\n2. Áp các dòng đã chọn → phân tích lại');
  hop.length = 0;
  const truoc = await p.evaluate(() => ptdmKq.ds.filter(x => x.dmGoiY > 0).map(x => x.maCD));
  await p.evaluate(() => ptdmSuaNhieu());
  await p.waitForTimeout(8000);
  const xn = hop.filter(x => /^confirm/.test(x)).join(' ');
  ok(/CẢ THÁNG 10\/2026/.test(xn) && !/CHƯA CHỐT/.test(xn), 'lời xác nhận: áp cho cả tháng 10/2026 (bỏ câu "các tháng chưa chốt")', xn);
  s = await p.evaluate(ma => { const ds = ptdmKq.ds.filter(x => ma.includes(x.maCD) && x.soCoData >= 3);
    return { n: ds.length, xa: ds.filter(x => Math.abs(x.trungVi - 85) > 6).map(x => [x.tenCD, x.trungVi]), tren: ptdmKq.ds.filter(x => x.trungVi > 100 && !x.itNguoi && !x.phuThuoc).length }; }, truoc);
  ok(s.n > 30 && !s.xa.length, 'phân tích lại: ' + s.n + ' công đoạn (≥3 người) đã sửa nằm trong 79–91%', s);
  ok(s.tren === 0, 'không còn công đoạn ≥3 người trên 100%', s);
  ok(!jsLoi.length, 'không lỗi JS', jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
