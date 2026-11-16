/**
 * Kiểm thử web đầu–cuối trang Bán hàng nhập đơn (16/11 khuya): Bán hàng đăng nhập (chỉ 1 tab, không bị đăng xuất), gửi đơn (nhập tay + dán Excel),
 * chủ sở hữu thấy việc chờ duyệt, trả về / duyệt, đơn vào bảng đơn; điện thoại 390px không tràn.
 *   F=<bản xem thử có tài khoản BH "c163" + Sheet đơn tab OEM/KHO> [CHUP=<thư mục>] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/don-ban-web.js
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const F = process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + String(JSON.stringify(c)).slice(0, 400) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); await p.route(/fonts\.g|cdnjs|jsdelivr/, r => r.abort());
  const jsLoi = []; p.on('pageerror', e => jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto('file://' + F); await p.waitForSelector('#xtGoiY');
  const vao = async tk => {
    await p.evaluate(t => { l_tk.value = t; l_mk.value = 'demo'; login(); }, tk);
    await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 90000 }).catch(() => {});
    await p.evaluate(() => { const t = window.toast; window.__toast = []; window.toast = function (m) { __toast.push(String(m)); return t.apply(this, arguments); }; });
    await p.waitForTimeout(800);
  };
  const cho = async (f, ms) => { for (let i = 0; i < (ms || 30); i++) { if (await p.evaluate(f)) return true; await p.waitForTimeout(500); } return false; };
  /* đổi người dùng KHÔNG tải lại trang (bản xem thử giữ dữ liệu trong bộ nhớ – tải lại là mất) */
  const moBH = async () => { for (let k = 0; k < 4; k++) { await cho(() => window.__soDangChay === 0 && !/Đang tải|Đang đọc/.test(document.getElementById('main').innerText), 40); await p.waitForTimeout(1500);
    await p.evaluate(() => go('bh')); if (await cho(() => tabHienTai === 'bh' && document.querySelector('.db-the.cd .db-duyet'), 20)) return true; } return false; };
  const ra = async () => { await p.evaluate(() => { window.BND = null; window.BNF = null; window.BNMo = {}; window.__dbCho = null; window.__dbChoTai = null; document.getElementById('app').style.display = 'none'; }); };

  console.log('\n1. Bán hàng đăng nhập (điện thoại 390px)');
  await vao('c163');
  let r = await p.evaluate(() => ({ app: document.getElementById('app').style.display, vt: ME && ME.vaiTro, tab: tabHienTai, nav: [...document.querySelectorAll('#nav button[data-k]')].map(x => x.dataset.k), tabs: dsTabHienCo().map(t => t[0]) }));
  ok(r.app === 'block' && r.vt === 'BH' && r.tab === 'bh' && r.tabs.join() === 'bh', 'vào thẳng "Đơn hàng của tôi", chỉ có 1 tab', r);
  ok(await cho(() => /Đơn hàng của tôi/.test(document.getElementById('main').innerText) && /\+ Đơn mới/.test(document.getElementById('main').innerText)), 'trang tải xong (mảnh DonBan)', await p.evaluate(() => document.getElementById('main').innerText.slice(0, 200)));
  await p.waitForTimeout(3000);
  ok(await p.evaluate(() => document.getElementById('app').style.display === 'block' && ME && ME.vaiTro === 'BH'), 'sau vài giây vẫn đăng nhập (không có lệnh nền nào làm văng ra)');

  console.log('\n2. Gửi đơn mới');
  await p.evaluate(() => bnMoForm());
  await p.click('.db-kenh button[data-t="OEM"]');
  await p.fill('#dbMa', '#WEB-16/11');
  await p.fill('#dbDl', '2026-12-20');
  await p.fill('.db-sp input[list="dbSpDs"]', 'GAY NOVA X1 MAU DO'); await p.fill('.db-sl input', '4'); await p.dispatchEvent('.db-sl input', 'change');
  await p.evaluate(() => { document.querySelector('details:has(#bnDan)').open = true; });
  await p.fill('#bnDan', 'GAY MOI MAU TIM\t2\tkhắc tên\nSAI DONG\tabc\nNGON RHINO 12.4\t1.000');
  await p.evaluate(() => bnDan());
  r = await p.evaluate(() => ({ kq: (document.querySelector('.db-f .db-msg') || {}).innerText, loi: document.querySelectorAll('.db-sp.loi').length, vang: document.querySelectorAll('.db-sp.vang').length, day: (document.querySelector('.db-day') || {}).innerText }));
  ok(/Đọc được 3 dòng: 1 đúng, 1 mã mới, 1 lỗi/.test(r.kq) && r.loi === 1 && r.vang === 1, 'dán Excel: báo 1 đúng / 1 mã mới / 1 lỗi, tô đỏ + vàng', r);
  if (CHUP) await p.screenshot({ path: CHUP + '/db-form-390.png', fullPage: true });
  await p.click('#bnGui'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !!BNF), 'còn dòng lỗi → chưa gửi');
  await p.evaluate(() => { const i = BNF.dong.findIndex(d => d.ten === 'SAI DONG'); BNF.dong.splice(i, 1); bnVe(); });
  await p.click('#bnGui');
  ok(await cho(() => !BNF && /Chờ duyệt/.test(document.getElementById('main').innerText) && /#WEB-16\/11/.test(document.getElementById('main').innerText)), 'gửi xong: đơn ở mục "Chờ duyệt"', await p.evaluate(() => window.__toast));
  r = await p.evaluate(() => BND.ds[0]); ok(r && r.tongSL === 1006 && r.dong.length === 3, 'đơn 3 mã, tổng 1006 (1.000 đọc thành 1000)', r && [r.tongSL, r.dong]);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= 392), 'điện thoại không tràn ngang', await p.evaluate(() => document.documentElement.scrollWidth));
  if (CHUP) await p.screenshot({ path: CHUP + '/db-bh-390.png', fullPage: true });
  await ra();

  console.log('\n3. Chủ sở hữu duyệt (1300px)');
  await p.setViewportSize({ width: 1300, height: 900 });
  await vao('chienpham');
  r = await p.evaluate(() => ({ tabs: dsTabHienCo().map(t => t[0]), duyet: ME.dbDuyet }));
  ok(r.duyet === 1 && r.tabs.indexOf('bh') >= 0, 'chủ sở hữu có tab "Đơn bán hàng"', r);
  ok(await cho(() => window.__dbCho && __dbCho.n === 1, 40), 'Tổng quan nạp "1 đơn chờ duyệt"', await p.evaluate(() => window.__dbCho));
  ok(await moBH(), 'mục Chờ duyệt có thẻ đơn + ô duyệt', await p.evaluate(() => [tabHienTai, document.getElementById('main').innerText.slice(0, 100)]));
  r = await p.evaluate(() => document.getElementById('main').innerText);
  ok(/mã mới/.test(r) && /Xưởng đang còn/.test(r) && /Deadline chốt/i.test(r), 'thẻ duyệt: nhãn "mã mới", tồn xưởng, deadline chốt', [/mã mới/.test(r), /Xưởng đang còn/.test(r), /Deadline chốt/i.test(r)]);
  const id = await p.evaluate(() => BND.ds[0].id);
  await p.evaluate(i => { BNMo['d_' + i] = 'TRA_VE'; bnVe(); }, id);
  await p.click('.db-goi button'); await p.click('.db-duyet .btn.pri');
  ok(await cho(() => BND && BND.ds && BND.ds[0] && BND.ds[0].tt === 'TRA_VE'), 'trả về bằng lý do mẫu', await p.evaluate(() => BND && BND.ds && BND.ds[0] && BND.ds[0].tt));
  await ra();
  await p.setViewportSize({ width: 390, height: 844 });
  await vao('c163'); await cho(() => window.BND && BND.ds);
  r = await p.evaluate(() => document.getElementById('main').innerText);
  ok(/Cần bạn sửa/.test(r) && /Cần sửa:/.test(r) && /Sửa & gửi lại/.test(r), 'Bán hàng thấy "Cần sửa: …" + nút Sửa & gửi lại', r.slice(0, 300));
  await p.evaluate(() => bnSua(BND.ds[0].id)); await p.evaluate(() => { BNF.dong[1].gc = 'màu tím than'; }); await p.click('#bnGui');
  ok(await cho(() => !BNF && BND && BND.ds && BND.ds[0] && BND.ds[0].tt === 'CHO_DUYET' && BND.ds[0].pb === 2), 'sửa & gửi lại → chờ duyệt (lần 2)');
  await ra();
  await p.setViewportSize({ width: 1300, height: 900 });
  await vao('chienpham'); await moBH();
  await p.evaluate(() => { const u = document.querySelector('[id^="dbUu_"]'); if (u) u.checked = true; });
  if (CHUP) await p.screenshot({ path: CHUP + '/db-duyet-1300.png', fullPage: true });
  await p.click('.db-duyet .btn.pri');
  ok(await cho(() => BND && BND.ds && BND.ds[0] && BND.ds[0].tt === 'DA_DUYET', 40), 'duyệt → "Đã duyệt"', await p.evaluate(() => BND && BND.ds && BND.ds.map(x => x.tt)));
  r = await p.evaluate(() => new Promise(res => call('layDonHangXuong', [true], x => res((x.don || []).filter(o => o.maDon === '#WEB-16/11').map(o => [o.ten, o.sl, o.dl])))));
  ok(r.length === 3 && r.some(o => o[0] === 'NGON RHINO 12.4' && o[1] === 1000) && r.every(o => /^2026-12-20$/.test(o[2])), 'bảng đơn đọc 3 dòng mới ở tab OEM, deadline 20/12', r);
  ok(!jsLoi.length, 'không lỗi JS', jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + ' / ' + dem + ' lỗi' : '✓ Đạt ' + dem + ' / ' + dem));
  process.exit(loi ? 1 : 0);
})();
