/**
 * Kiểm thử Tổng quan chủ sở hữu (08/11): 4 ô số, sản lượng xưởng, đơn hàng, nhân lực, cần chú ý; bỏ "chưa khai báo" + "dưới 80%";
 * Đài quan sát có hiệu ứng; ban điều hành giữ Tổng quan cũ.
 *   F=<bản xem thử số thật có Sheet đơn, GIO ngày thường> [CHUP=<thư mục>] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tong-quan-web.js
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const F = process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const vao = async (tk, w) => {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.route(/fonts\.g|cdnjs|jsdelivr/, r => r.abort()); p.__loi = []; p.on('pageerror', e => p.__loi.push(e.message));
    await p.goto('file://' + F); await p.waitForSelector('#xtGoiY');
    await p.evaluate(t => { l_tk.value = t; l_mk.value = 'demo'; login(); }, tk);
    await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 60000 }).catch(() => {});
    await p.evaluate(() => { try { maiGocDong() } catch (e) {} if (tabHienTai !== 'dash' && tabHienTai !== 'homnay') go('dash'); });
    for (let i = 0; i < 60; i++) { await p.waitForTimeout(1000); if (await p.evaluate(() => window.__soDangChay === 0 && !/đang tải|Đang đọc/i.test((document.getElementById('tqKhoi') || {}).innerText || 'x'))) break; }
    await p.waitForTimeout(1500); return p;
  };
  for (const w of [1300, 390]) {
    console.log('\n1. Chủ sở hữu ' + w + 'px');
    const p = await vao('chienpham', w);
    const r = await p.evaluate(() => { const k = document.getElementById('main'), t = k.innerText, m = t;
      return { o: k ? k.querySelectorAll('.tq-o').length : 0, t, cu: /chưa khai báo sản lượng|dưới 80%/i.test(m), dai: !!document.getElementById('hlDai'), dong: !!document.querySelector('#hlDai.hl-dong'),
        xg: k.querySelectorAll('.tq-xs .tq-x').length, tab: tabHienTai, nav: [...document.querySelectorAll('#nav button[data-k]')].map(b => b.dataset.k), bot: [...document.querySelectorAll('#botbar button[data-k]')].map(b => b.dataset.k), tran: document.documentElement.scrollWidth - innerWidth, cm: (document.getElementById('hlCM') || {}).textContent || '' }; });
    ok(r.o === 4 && /THÀNH PHẨM ĐÓNG GÓI/i.test(r.t) && /GIAO ĐÚNG HẠN/i.test(r.t) && /CÓ MẶT HÔM NAY/i.test(r.t) && /ĐƠN TRỄ HẠN/i.test(r.t), '4 ô số: đóng gói, giao đúng hạn, có mặt, đơn trễ', r.t.slice(0, 300));
    ok(/SẢN LƯỢNG TỪNG XƯỞNG/i.test(r.t) && /đạt mục tiêu \d+ \/ \d+ xưởng/.test(r.t) && /Đóng gói/.test(r.t), 'sản lượng từng xưởng so mục tiêu (theo dòng chảy)');
    ok(/dòng trễ hạn/.test(r.t) && /đến hạn trong 7 ngày/.test(r.t), 'đơn hàng: trễ hạn + đến hạn 7 ngày');
    ok(/NHÂN LỰC HÔM NAY/i.test(r.t) && /người đi làm/.test(r.t), 'nhân lực hôm nay theo xưởng');
    ok(/Độ tin cậy số liệu/.test(r.t) && /Nút cổ chai/.test(r.t) && /Dòng chảy giữa các xưởng/.test(r.t), 'độ tin cậy số liệu + khối Điều phối (nút cổ chai, dòng chảy)');
    ok(/Việc cần xử lý/i.test(r.t) && !/Chưa nhập sản lượng/i.test(r.t) && /Đi nhanh/i.test(r.t), 'gộp Việc hôm nay: có Việc cần xử lý + Đi nhanh, không có "Chưa nhập sản lượng"');
    ok(r.tab === 'dash' && r.nav.indexOf('homnay') < 0 && r.bot[0] === 'dash' , 'menu chủ: chỉ còn Tổng quan (mở đầu tiên)', r);
    ok(!r.cu, 'không còn "chưa khai báo sản lượng" / "dưới 80%"');
    ok(r.dai && r.dong && /NGƯỜI/.test(r.cm), 'Đài quan sát có hiệu ứng + ô Có mặt hôm nay', r);
    ok(r.tran <= 0, 'không tràn ngang', r.tran);
    ok(await p.evaluate(() => { go('homnay'); return tabHienTai; }) === 'dash', 'lệnh mở Việc hôm nay chuyển về Tổng quan');
    if (CHUP) await p.screenshot({ path: CHUP + '/tq-' + w + '.png', fullPage: true });
    ok(!p.__loi.length, 'không lỗi JS', p.__loi); await p.close();
  }
  console.log('\n2. Ban điều hành');
  const p = await vao('giamdoc', 1300);
  await p.evaluate(() => go('dash')); await p.waitForTimeout(2000);
  ok(await p.evaluate(() => [...document.querySelectorAll('#nav button[data-k]')].some(b => b.dataset.k === 'homnay')), 'ban điều hành vẫn có tab Việc hôm nay riêng');
  ok(await p.evaluate(() => !document.getElementById('tqKhoi') && !!document.querySelector('#main .kpis')), 'giữ Tổng quan cũ'); await p.close();
  await b.close(); console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
