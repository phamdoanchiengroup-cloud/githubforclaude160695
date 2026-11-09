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
      tong: (document.querySelector('#cgCt').textContent.match(/1\.?492,7 mm/) || [''])[0], bang: document.querySelectorAll('#cgCt .cg-bang tbody tr').length, nut: [...document.querySelectorAll('#cgCt .cg-nut button')].map(b => b.textContent) }));
    ok(s.svg === 5 && s.mau && s.tong && s.bang >= 14, 'Retro chưa đo: hiện mẫu theo bản vẽ nhà máy (ngọn 735 + chuôi 747 theo file SKU = 1.492,7 mm), 5 hình dựng đứng (ngọn, chuôi, chi tiết A / C / D), bảng chi tiết', s);
    ok(s.nut.some(t => /Sửa thông số/.test(t)) && s.nut.some(t => /Tải PDF/.test(t)), 'C077 có nút Sửa thông số + Tải PDF', s.nut);
    // kiểm tra ghép mặc định: mẫu có bậc cap 31,75 / sleeve 31,2 → cảnh báo vàng
    const cb = await p.evaluate(() => { const x = document.querySelector('#cgCt').textContent; return { kt: [...document.querySelectorAll('#cgCt .cg-bao li')].map(l => l.textContent), co: ['Khối giữ pin', 'Ống quả cân', 'quả cân Đồng thau', 'Lõi Foam xanh nhạt', 'Lõi Foam xanh đậm', 'Thanh nối', 'Inlay', 'Veneer', 'Ren cắm bumper', 'ỐNG QUẢ CÂN'].filter(t => !x.includes(t)) }; });
    ok(!cb.co.length, 'chuôi carbon theo bản vẽ Rhino (09/11): khối POM giữ pin, lõi foam 2 màu, thanh nối, inlay, veneer, ống quả cân + quả đồng, bumper ren', cb);
    // 09/11: gậy 3 khúc (bản vẽ nhà máy Nhảy 350-150 / Phá nhảy lùn 380-250): tên "(390-100)" → khúc trên 390 + đuôi rời 100
    for (const [ma, tren, duoi] of [['TKNHAY', 390, 100], ['EVOVAL', 350, 385]]) {
      await p.evaluate(m => cgMo(m), ma); await p.waitForFunction(m => CG.bv && CG.bv.dong.ma === m && document.querySelector('#cgCt svg.cg-dung'), ma, { timeout: 20000 });
      const k3 = await p.evaluate(() => { const x = document.querySelector('#cgCt').textContent; return { h5: [...document.querySelectorAll('#cgCt h5')].map(h => h.textContent), co: ['KHỚP GIỮA', 'KHÚC TRÊN', 'ĐUÔI RỜI', 'Pin nối', 'Ống ren khúc trên'].filter(t => !x.includes(t)), kt: [...document.querySelectorAll('#cgCt .cg-bao li')].map(l => l.textContent), tren: (x.match(/KHÚC TRÊN ([\d,]+)/) || [])[1], duoi: (x.match(/ĐUÔI RỜI ([\d,]+)/) || [])[1] }; });
      ok(k3.h5.includes('K · KHỚP GIỮA') && !k3.co.length && !k3.kt.length && k3.tren === tren + ',0' && k3.duoi === duoi + ',0', ma + ': gậy 3 khúc – khúc trên ' + tren + ' + đuôi rời ' + duoi + ', chi tiết K khớp giữa, không cảnh báo', k3);
    }
    // 09/11: file SKU – ghép mã vào dòng, điền sẵn mẫu, kiểm tra chéo
    await p.evaluate(() => cgMo('CBZ')); await p.waitForFunction(() => CG.bv && CG.bv.dong.ma === 'CBZ' && document.querySelector('#cgCt svg.cg-dung'), null, { timeout: 20000 });
    let sk = await p.evaluate(() => { const t = cgBanHien().dl, g = cgSkuGhep(), x = document.querySelector('#cgCt').textContent;
      const t2 = JSON.parse(JSON.stringify(t)); t2.ngon.tip.d = 13.2; t2.chuoi.vo.day = 1.5; const kt = cgKiemTra(t2, CG.bv.dong).map(k => k.t);
      return { n: (g.CBZ || []).length, tong: Object.values(g).reduce((a, v) => a + v.length, 0), tip: t.ngon.tip.d, vach: t.chuoi.vo.day, duoi: t.chuoi.sleeve.dCuoi, hop: /Mã SKU của dòng này \(5\)/.test(x), ds: !!document.querySelector('.cg-skuds'), kt }; });
    ok(sk.n === 5 && sk.tong >= 130 && sk.tip === 12.5 && sk.vach === 2 && sk.duoi === 31.3 && sk.hop && sk.ds, 'file SKU: ghép mã vào dòng (CBZ 5 mã), mẫu lấy Ø tip 12,5 · vách 2 · Ø đuôi 31,3, có khung "Mã SKU của dòng này"', sk);
    ok(sk.kt.some(t => /Lệch file SKU – Ø tip/.test(t)) && sk.kt.some(t => /Lệch file SKU – vách chuôi/.test(t)), 'số đo lệch file SKU → cảnh báo vàng', sk.kt);
    await p.evaluate(() => cgMo('RETRO')); await p.waitForFunction(() => CG.bv && CG.bv.dong.ma === 'RETRO' && document.querySelector('#cgCt svg.cg-dung'), null, { timeout: 20000 });
    ok(await p.evaluate(() => !/KHỚP GIỮA/.test(document.querySelector('#cgCt').textContent)), 'gậy đánh 2 khúc: không có khớp giữa');
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
    ok(s.doi.some(t => /Pin thò/.test(t) && /35\.85/.test(t) && /19/.test(t)) && s.sua, 'C019 thấy bảng thay đổi (pin thò 35,85 theo bản vẽ Radial → 19), có cả nút Sửa (09/11)', s);
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
    ok(await p.evaluate(() => ME.cg === 'duyet'), 'C056 (chủ sở hữu): sửa + duyệt (09/11)');
    await p.evaluate(() => go('cgay')); await p.waitForSelector('#cgDs .cg-it', { timeout: 30000 }); await p.evaluate(() => cgMo('RETRO')); await p.waitForSelector('#cgCt svg', { timeout: 20000 });
    s = await p.evaluate(() => [...document.querySelectorAll('#cgCt .cg-nut button')].map(b => b.textContent));
    ok(s.some(t => /Tải PDF/.test(t)) && s.some(t => /Sửa thông số/.test(t)), 'C056: có Tải PDF + Sửa thông số', s);
    ok(!e.length, 'không lỗi trang', e);
    await ctx.close();
  }
  await b.close();
  console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
  process.exit(loi ? 1 : 0);
})();
