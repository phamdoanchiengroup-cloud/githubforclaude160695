const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra tab "Cấu hình gậy" (08/11) trên bản xem thử: quyền 4 mã NV, bản vẽ tự vẽ, C077 sửa + lưu, C019 duyệt, PDF có dấu chìm.
 *   F=<bản xem thử .html> [LIB=<thư mục node_modules có jspdf + html2canvas>] [CHUP=<thư mục ảnh>] node tests/cau-hinh-gay-web.js
 */
const fs = require('fs'), path = require('path');
const F = 'file://' + process.env.F, CHUP = process.env.CHUP, LIB = process.env.LIB;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const vao = async (p, tk) => { await p.evaluate(t => { l_tk.value = t; l_mk.value = 'demo'; login(); }, tk);
  await p.waitForFunction(t => document.getElementById('app').style.display === 'block' && window.D && D.me && D.me.tk === t && window.ME === D.me, tk, { timeout: 60000 }); await p.waitForTimeout(1200); };
const ra = async p => { await p.waitForTimeout(300); };   // không gọi logout(): trang xem thử tải lại sẽ mất dữ liệu đã lưu – đăng nhập đè tài khoản khác
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1360, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh', acceptDownloads: true });
    const p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    if (LIB) await p.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/(jspdf|html2canvas)\//, r => { const u = r.request().url(); r.fulfill({ contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(/jspdf/.test(u) ? path.join(LIB, 'jspdf/dist/jspdf.umd.min.js') : path.join(LIB, 'html2canvas/dist/html2canvas.min.js'), 'utf8') }); });
    else await p.route(/cdnjs\.cloudflare\.com/, r => r.abort());
    await p.route(/fonts\.g|jsdelivr/, r => r.abort());
    await p.goto(F); await p.waitForSelector('#xtGoiY');
    // trưởng phòng: không thấy tab
    await vao(p, 'tpdg');
    ok(await p.evaluate(() => !ME.cg && !dsTabHienCo().some(t => t[0] === 'cgay') && !document.querySelector('#nav button[data-k="cgay"]')), 'trưởng phòng: không có tab Cấu hình gậy');
    await ra(p);
    // C077 (phogd2): sửa
    await vao(p, 'phogd2');
    ok(await p.evaluate(() => ME.cg === 'sua' && !!document.querySelector('#nav button[data-k="cgay"]')), 'C077: có tab, quyền sửa');
    ok(await p.evaluate(() => typeof cgVeTrang === 'undefined'), 'chưa mở tab: chưa tải bộ vẽ (Index nhẹ)');
    await p.evaluate(() => go('cgay')); await p.waitForSelector('#cgDs .cg-it', { timeout: 30000 });
    let s = await p.evaluate(() => ({ n: document.querySelectorAll('#cgDs .cg-it').length, nh: [...document.querySelectorAll('#cgDs .cg-nh span:first-child')].map(x => x.textContent), kieu: [...document.querySelectorAll('#cgDs .cg-nh2 b')].map(x => x.textContent), mat: !!document.querySelector('.cg-mat') }));
    ok(s.n > 40 && s.nh[0] === 'Gậy (đủ bộ)' && s.kieu[0] === 'Gậy đánh' && s.mat, 'danh sách nhóm theo loại → kiểu (đánh / nhảy / phá) → chất liệu, nhãn TÀI LIỆU MẬT', s);
    await p.evaluate(() => cgMo('RETRO')); await p.waitForSelector('#cgCt svg', { timeout: 20000 });
    s = await p.evaluate(() => ({ svg: document.querySelectorAll('#cgCt svg.cg-dung').length, mau: /chưa có thông số đo/.test(document.querySelector('#cgCt').textContent), kt: document.querySelector('#cgCt .cg-bao.vang, #cgCt .cg-bao.xanh, #cgCt .cg-bao.do') ? 1 : 0,
      tong: (document.querySelector('#cgCt').textContent.match(/1\.?473,2 mm/) || [''])[0], bang: document.querySelectorAll('#cgCt .cg-bang tbody tr').length, nut: [...document.querySelectorAll('#cgCt .cg-nut button')].map(b => b.textContent) }));
    ok(s.svg === 5 && s.mau && s.tong && s.bang >= 14, 'Retro chưa đo: hiện mẫu 58 in (1.473,2 mm), 5 hình dựng đứng (ngọn, chuôi, chi tiết A / C / D), bảng chi tiết', s);
    ok(s.nut.some(t => /Sửa thông số/.test(t)) && s.nut.some(t => /Tải PDF/.test(t)), 'C077 có nút Sửa thông số + Tải PDF', s.nut);
    // kiểm tra ghép mặc định: mẫu có bậc cap 31,75 / sleeve 31,2 → cảnh báo vàng
    ok(await p.evaluate(() => /Butt cap Ø31,75 khác sleeve/.test(document.querySelector('#cgCt').textContent)), 'tự phát hiện bậc đuôi (cap 31,75 > sleeve 31,2) như bản tham chiếu');
    // sửa
    await p.evaluate(() => cgBatSua()); await p.waitForSelector('.cg-form');
    s = await p.evaluate(() => ({ o: document.querySelectorAll('.cg-o').length, vang: document.querySelectorAll('.cg-o.chua').length }));
    ok(s.o >= 60 && s.vang === s.o, 'form ' + s.o + ' ô, tất cả vàng "chưa đo"', s);
    const svg0 = await p.evaluate(() => document.querySelector('#cgCt .cg-giay svg').outerHTML.length);
    await p.evaluate(() => { const i = document.querySelector('.cg-o input[data-p="chuoi.collar.d"]'); i.value = '21.3'; cgDoiO(i); });
    s = await p.evaluate(() => ({ da: document.querySelector('.cg-o input[data-p="chuoi.collar.d"]').closest('.cg-o').className, loi: /Collar ngọn Ø21,6 khác collar chuôi Ø21,3/.test(document.querySelector('#cgCt').textContent), sai: document.querySelectorAll('.cg-o.sai').length }));
    ok(/da/.test(s.da) && s.loi && s.sai >= 2, 'nhập collar chuôi 21,3: ô xanh "đã đo", báo ⛔ lệch joint, tô đỏ 2 ô liên quan', s);
    await p.evaluate(() => { const i = document.querySelector('.cg-o input[data-p="chuoi.collar.d"]'); i.value = '21.6'; cgDoiO(i); const j = document.querySelector('.cg-o input[data-p="chuoi.pin.tho"]'); j.value = '19'; cgDoiO(j); cgXacNhan('ngon.tip.d'); });
    s = await p.evaluate(() => ({ loi: /Collar ngọn Ø21,6 khác/.test(document.querySelector('#cgCt').textContent), tip: document.querySelector('.cg-o input[data-p="ngon.tip.d"]').closest('.cg-o').className, pin: /thò 19/.test(document.querySelector('#cgCt').innerHTML) }));
    ok(!s.loi && /da/.test(s.tip) && s.pin, 'sửa lại 21,6 hết lỗi; ✓ xác nhận số mẫu; bản vẽ cập nhật (pin thò 19)', s);
    p.on('dialog', d => d.accept());
    await p.evaluate(() => { document.getElementById('cgGhiChu').value = 'đo 3 cây mẫu'; cgLuu(); });
    await p.waitForFunction(() => CG.bv && CG.bv.choDuyet, null, { timeout: 20000 });
    s = await p.evaluate(() => ({ cho: CG.bv.choDuyet.tt.pb, chip: (document.querySelector('#cgDs .cg-it.on .cg-chip') || {}).textContent, xem: /Bản chờ duyệt v1/.test(document.querySelector('#cgCt').textContent), daDo: Object.keys(CG.bv.choDuyet.dl.daDo || {}).length }));
    ok(s.cho === 1 && s.chip === 'Chờ duyệt' && s.xem && s.daDo === 3, 'lưu → bản chờ duyệt v1, danh sách hiện "Chờ duyệt", ghi 3 ô đã đo', s);
    await ra(p);
    // C019 (giamdoc): duyệt
    await vao(p, 'giamdoc');
    ok(await p.evaluate(() => ME.cg === 'duyet'), 'C019: quyền duyệt');
    await p.evaluate(() => go('homnay')); await p.waitForTimeout(2500);
    ok(await p.evaluate(() => /Cấu hình gậy chờ bạn duyệt/.test(document.getElementById('main').textContent)), 'Việc hôm nay: "Cấu hình gậy chờ bạn duyệt"');
    await p.evaluate(() => go('cgay')); await p.waitForSelector('#cgDs .cg-it', { timeout: 30000 });
    await p.evaluate(() => cgMo('RETRO')); await p.waitForSelector('.cg-doi', { timeout: 20000 });
    s = await p.evaluate(() => ({ doi: [...document.querySelectorAll('.cg-doi tr')].map(t => t.textContent), sua: [...document.querySelectorAll('#cgCt .cg-nut button')].some(b => /Sửa thông số/.test(b.textContent)) }));
    ok(s.doi.some(t => /Pin thò/.test(t) && /12\.7/.test(t) && /19/.test(t)) && !s.sua, 'C019 thấy bảng thay đổi (pin thò 12,7 → 19), không có nút Sửa', s);
    if (CHUP) await p.screenshot({ path: path.join(CHUP, 'cg-duyet-' + w + '.png'), fullPage: false });
    await p.evaluate(() => cgDuyet(1)); await p.waitForFunction(() => CG.bv && CG.bv.hieuLuc, null, { timeout: 20000 });
    s = await p.evaluate(() => ({ pb: CG.bv.hieuLuc.tt.pb, chip: (document.querySelector('#cgDs .cg-it.on .cg-chip') || {}).textContent, mau: /chưa có thông số đo/.test(document.querySelector('#cgCt').textContent) }));
    ok(s.pb === 1 && s.chip === 'v1' && !s.mau, 'duyệt → v1 hiệu lực, danh sách "v1"', s);
    // PDF
    if (LIB) {
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), p.evaluate(() => cgTaiPdf())]);
      const f = await dl.path(), buf = fs.readFileSync(f), txt = buf.toString('latin1');
      ok(/^%PDF/.test(txt) && (txt.match(/\/Type\s*\/Page[^s]/g) || []).length === 2 && dl.suggestedFilename() === 'Cau-hinh-gay-RETRO-v1.pdf', 'tải PDF: 2 trang A4 dọc, tên Cau-hinh-gay-RETRO-v1.pdf (' + Math.round(buf.length / 1024) + ' KB)', dl.suggestedFilename());
      if (CHUP) fs.copyFileSync(f, path.join(CHUP, 'Cau-hinh-gay-RETRO-v1-' + w + '.pdf'));
    }
    if (CHUP) { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: path.join(CHUP, 'cg-' + w + '.png'), fullPage: true }); }
    ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'không tràn ngang');
    await ra(p);
    // C067: chỉ xem
    await vao(p, 'chienpham');   // C056 chủ sở hữu: chỉ xem (C067 kiểm ở cau-hinh-gay.js – bản xem thử đổi tên đăng nhập kimloan)
    ok(await p.evaluate(() => ME.cg === 'xem'), 'C056 (chủ sở hữu): quyền xem');
    await p.evaluate(() => go('cgay')); await p.waitForSelector('#cgDs .cg-it', { timeout: 30000 }); await p.evaluate(() => cgMo('RETRO')); await p.waitForSelector('#cgCt svg', { timeout: 20000 });
    s = await p.evaluate(() => [...document.querySelectorAll('#cgCt .cg-nut button')].map(b => b.textContent));
    ok(s.some(t => /Tải PDF/.test(t)) && !s.some(t => /Sửa|Duyệt/.test(t)), 'C056: chỉ có Tải PDF', s);
    ok(!e.length, 'không lỗi trang', e);
    await ctx.close();
  }
  await b.close();
  console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
  process.exit(loi ? 1 : 0);
})();
