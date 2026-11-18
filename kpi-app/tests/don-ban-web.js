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
  r = await p.evaluate(() => [BND.ds[0].duKien, document.getElementById('main').innerText]);
  ok(/^\d{4}-\d\d-\d\d$/.test(r[0] || '') && /Nếu được duyệt hôm nay: dự kiến xong khoảng \d\d\/\d\d\/\d{4}/.test(r[1]), '17/11: thẻ chờ duyệt có "Nếu được duyệt hôm nay: dự kiến xong khoảng …"', r[0]);
  if (CHUP) await p.screenshot({ path: CHUP + '/db-bh-390.png', fullPage: true });
  /* 17/11: Bảng đơn nhà máy – 4 cột, tìm, lọc kênh, không tràn */
  await p.click('.db-xem button:nth-child(2)');
  ok(await cho(() => document.querySelector('.db-bang tbody tr:not(.nh)')), 'mở "Bảng đơn nhà máy"', await p.evaluate(() => document.getElementById('main').innerText.slice(0, 300)));
  r = await p.evaluate(() => ({ th: [...document.querySelectorAll('.db-bang thead th')].map(x => x.textContent), nh: [...document.querySelectorAll('.db-bang tr.nh')].map(x => x.textContent), n: document.querySelectorAll('.db-bang tbody tr:not(.nh)').length, w: document.documentElement.scrollWidth }));
  ok(r.th.join('|') === 'Mã đơn|Mã sản phẩm|Số đặt|Deadline' && r.n === 2 && r.nh.length === 2 && r.w <= 392, 'chỉ 4 cột, nhóm theo kênh có tổng, 2 dòng đang làm, điện thoại không tràn', r);
  r = await p.evaluate(() => ({ t: (document.querySelector('.db-kin') || {}).innerText || '', hang: document.querySelectorAll('.db-tk2 tbody tr').length, w: Math.max(document.documentElement.scrollWidth, document.querySelector('.db-tk2').scrollWidth + 30) }));
  ok(/Nhà máy kín lịch đến khoảng\s*\d\d\/\d\d\/\d{4}/.test(r.t) && /Tổng/.test(r.t) && r.hang === 3 && r.w <= 392, '17/11: khung "Nhà máy kín lịch đến khoảng …" + thống kê 2 kênh + dòng Tổng, điện thoại không tràn', r);
  await p.fill('#bnTim', 'rhino'); r = await p.evaluate(() => [document.querySelectorAll('.db-bang tbody tr:not(.nh)').length, document.activeElement && document.activeElement.id]);
  ok(r[0] === 1 && r[1] === 'bnTim', 'gõ tìm "rhino" → 1 dòng, con trỏ vẫn ở ô tìm', r);
  if (CHUP) await p.screenshot({ path: CHUP + '/db-bang-390.png', fullPage: true });
  await p.fill('#bnTim', ''); await p.click('.db-xem button:nth-child(1)');
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
  r = await p.evaluate(() => [BND.ds[0].td, (document.querySelector('.db-the.dd .db-dk') || {}).innerText]);
  ok(r[0] && /^\d{4}-/.test(r[0].eta || '') && /Dự kiến xong khoảng/.test(r[1] || ''), '17/11: đơn đã duyệt hiện "Dự kiến xong khoảng …" (đã cộng 2 ngày dự phòng)', r);
  /* 17/11: mục Khóa cột Sheet đơn (chủ sở hữu) */
  await p.evaluate(() => { const d = [...document.querySelectorAll('details')].find(x => /Khóa cột trên Sheet đơn/.test(x.innerText)); d.open = true; });
  ok(await cho(() => window.BNK && BNK.ok && /Chưa khóa/.test(document.getElementById('main').innerText)), 'chủ sở hữu mở mục "Khóa cột trên Sheet đơn": trạng thái Chưa khóa + nút', await p.evaluate(() => window.BNK));
  await p.click('button[data-m="CANH_BAO"]');
  ok(await cho(() => window.BNK && BNK.ok && BNK.tt && BNK.tt.muc === 'CANH_BAO' && /Đang CẢNH BÁO/.test(document.getElementById('main').innerText), 20), 'bấm "Bật cảnh báo" → Đang CẢNH BÁO, có nút Khóa hẳn / Gỡ khóa', await p.evaluate(() => [window.BNK, window.__toast]));
  if (CHUP) await p.screenshot({ path: CHUP + '/db-khoa-1300.png', fullPage: true });
  await p.click('button[data-m=""]'); ok(await cho(() => window.BNK && BNK.ok && BNK.tt && BNK.tt.muc === '', 20), 'Gỡ khóa → Chưa khóa');
  r = await p.evaluate(() => new Promise(res => call('layDonHangXuong', [true], x => res((x.don || []).filter(o => o.maDon === '#WEB-16/11').map(o => [o.ten, o.sl, o.dl])))));
  ok(r.length === 3 && r.some(o => o[0] === 'NGON RHINO 12.4' && o[1] === 1000) && r.every(o => /^2026-12-20$/.test(o[2])), 'bảng đơn đọc 3 dòng mới ở tab OEM, deadline 20/12', r);

  console.log('\n4. 17/11 khuya: "Thử trước khi đặt" + gửi / xử lý đề nghị ưu tiên');
  const M = () => document.getElementById('main').innerText;
  await ra(); await p.setViewportSize({ width: 390, height: 844 });
  await vao('c163'); await cho(() => window.BND && BND.ds);
  await p.click('.db-xem button:nth-child(3)');
  ok(await cho(() => /Thử nhận đơn mới/.test(document.getElementById('main').innerText) && /Thử đẩy một đơn lên ưu tiên/.test(document.getElementById('main').innerText)), 'Bán hàng mở "Thử trước khi đặt": 2 ô thử', await p.evaluate(M));
  await p.click('.db-thu .db-kenh button[data-t="OEM"]'); await p.fill('#bnTSl', '300'); await p.click('#bnTN');
  ok(await cho(() => BNT.kqN && /Hẹn khách an toàn:\s*\d\d\/\d\d\/\d{4}/.test(document.getElementById('main').innerText), 30), 'thử đơn OEM 300 sp, để trống deadline → "Hẹn khách an toàn: dd/mm/yyyy" (xếp cuối làn OEM + 6 ngày làm)', await p.evaluate(() => [window.BNT && BNT.kqN, document.getElementById('main').innerText.slice(0, 600)]));
  await p.fill('#bnTDl', '2026-11-19'); await p.click('#bnTN');
  ok(await cho(() => BNT.kqN && BNT.kqN.dl === '2026-11-19' && document.querySelector('.db-kq.do') && /không kịp/.test(document.getElementById('main').innerText), 30), 'deadline 19/11 quá gần → khung đỏ "không kịp" + cảnh báo sớm hơn ngày xong cuối làn', await p.evaluate(() => BNT.kqN));
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= 392), 'điện thoại không tràn ngang (ô thử nhận đơn)', await p.evaluate(() => document.documentElement.scrollWidth));
  if (CHUP) await p.screenshot({ path: CHUP + '/db-thu-390.png', fullPage: true });
  const hen = await p.evaluate(() => BNT.kqN.hen);
  await p.click('button:has-text("Soạn đơn OEM")');
  r = await p.evaluate(() => [BNXem, BNF && BNF.tab, BNF && BNF.dl]);
  ok(r[0] === 'don' && r[1] === 'OEM' && r[2] === hen, 'bấm "Soạn đơn … với deadline" → mở đơn mới kênh OEM, deadline = ngày hẹn an toàn', [r, hen]);
  await p.evaluate(() => { BNF.dong[0] = { ten: 'NGON RHINO 12.4', sl: '120', gc: '' }; const b = [...document.querySelectorAll('.db-lk')].find(x => /Thử ngày xong/.test(x.textContent)); b.click(); });
  ok(await cho(() => BNXem === 'thu' && BNT.kqN && BNT.kqN.sl === 120 && BNT.tab === 'OEM' && /Quay lại đơn đang soạn/.test(document.getElementById('main').innerText), 30), 'trong form đơn: "Thử ngày xong trước" → sang ô thử, có nút quay lại đơn đang soạn', await p.evaluate(() => [BNXem, BNT]));
  await p.evaluate(() => { BNF = null; try { localStorage.removeItem(bnKhoaNhap()); } catch (e) {} bnVe(); });
  await cho(() => window.BNB && BNB.ds, 30);
  const maThu = await p.evaluate(() => (BNB.ds.find(d => d[1] && d[1] !== '#WEB-16/11') || [])[1]);
  await p.fill('#bnTGt', maThu); await p.click('#bnTD');
  ok(await cho(() => BNT.kqD && BNT.kqD.guiDuoc === 1 && /Gửi đề nghị ưu tiên đơn/.test(document.getElementById('main').innerText), 30), 'thử đẩy đơn ' + maThu + ' → kết quả + ô "Gửi đề nghị ưu tiên"', await p.evaluate(() => [BNT.kqD, document.getElementById('main').innerText.slice(-800)]));
  await p.click('.db-duyet .btn.pri');
  ok(await cho(() => __toast.some(t => /lý do/.test(t))), 'chưa ghi lý do → nhắc ghi lý do', await p.evaluate(() => __toast));
  await p.click('.db-duyet .db-goi button'); await p.click('.db-duyet .btn.pri');
  ok(await cho(() => __toast.some(t => /Tick/.test(t))), 'chọn lý do mẫu nhưng chưa tick "đã xem các đơn bị lùi" → nhắc tick', await p.evaluate(() => __toast));
  await p.check('#bnDnXem');
  if (CHUP) await p.screenshot({ path: CHUP + '/db-denghi-390.png', fullPage: true });
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= 392), 'điện thoại không tràn ngang (ô đề nghị)', await p.evaluate(() => document.documentElement.scrollWidth));
  await p.click('.db-duyet .btn.pri');
  ok(await cho(() => window.BND && BND.dn && BND.dn.length === 1 && BND.dn[0].tt === 'CHO' && /Đề nghị ưu tiên của tôi/.test(document.getElementById('main').innerText), 40), 'gửi đề nghị → "Đề nghị ưu tiên của tôi: Chờ ban điều hành"', await p.evaluate(() => [window.BND && BND.dn, __toast]));
  await ra(); await p.setViewportSize({ width: 1300, height: 900 });
  await vao('chienpham');
  ok(await cho(() => window.__dbCho && __dbCho.dn && __dbCho.dn.n === 1, 40), 'người duyệt: Việc hôm nay nạp "1 đề nghị ưu tiên chờ"', await p.evaluate(() => window.__dbCho));
  await p.evaluate(() => { BNXem = 'don'; go('bh'); });
  ok(await cho(() => window.BND && BND.dn && /Đề nghị ưu tiên chờ bạn xem/.test(document.getElementById('main').innerText), 40), 'trang Đơn bán hàng: mục "Đề nghị ưu tiên chờ bạn xem" + lý do + kết quả lúc gửi', await p.evaluate(() => document.getElementById('main').innerText.slice(0, 500)));
  if (CHUP) await p.screenshot({ path: CHUP + '/db-denghi-duyet-1300.png', fullPage: true });
  await p.evaluate(() => { const b = [...document.querySelectorAll('.db-dn button')].find(x => /Đồng ý/.test(x.textContent)); b.click(); });
  ok(await cho(() => window.BND && BND.dn && BND.dn[0] && BND.dn[0].tt === 'DONG_Y', 40), 'bấm "Đồng ý ★ ưu tiên" → đề nghị chuyển "Đã đồng ý ★"', await p.evaluate(() => window.BND && BND.dn));
  /* 18/11: Vì sao đơn này xong ngày này (thẻ đơn đã duyệt) */
  await p.evaluate(() => { const b = [...document.querySelectorAll('.db-the.dd .db-lk')].find(x => /Vì sao ngày này/.test(x.textContent)); b.click(); });
  ok(await cho(() => /Đơn xếp ở làn \S+/.test(document.getElementById('main').innerText) && /Dòng xong muộn nhất/.test(document.getElementById('main').innerText), 40), '18/11: thẻ đơn đã duyệt → "Vì sao ngày này?" → làn, hàng xếp trước, dòng xong muộn nhất', await p.evaluate(() => [window.BNVS, document.getElementById('main').innerText.slice(0, 300)]));
  ok(!jsLoi.length, 'không lỗi JS', jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + ' / ' + dem + ' lỗi' : '✓ Đạt ' + dem + ' / ' + dem));
  process.exit(loi ? 1 : 0);
})();
