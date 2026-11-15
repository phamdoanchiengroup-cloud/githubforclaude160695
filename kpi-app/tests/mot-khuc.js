/** Kiểm thử gậy 1 khúc (15/11): DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/mot-khuc.js [SHOT=<ảnh.png>] */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
console.log('1. Máy chủ');
const P = t => c.plPhanLoai_(t, '', null);
let p = P('GẬY 1 KHÚC GMK 1480 - ĐEN TIP 12.2');
ok(p.loai === 'GAY1K' && p.dong === 'GAY1K' && p.vlC === 'GF' && p.vlN === '' && p.ren === 'KHONG' && p.ngon === 'KHONG' && p.dau === '12.2' && p.tin === 'xanh', 'tên "1 KHÚC" → gậy 1 khúc, glassfiber, không ren, đầu 12.2', p);
ok(P('Rhino One Piece House Cue 57"').loai === 'GAY1K' && P('GMK-1450 RED').loai === 'GAY1K' && P('Gậy GMK 1450').dau === '12.5', '"ONE PIECE", "GMK" cũng nhận; đầu mặc định 12.5');
ok(P('EVO1/BEAST 11 KHÚC').loai !== 'GAY1K' && P('Combo MAXBING Evo Crown - ANCIENT OAK').loai === 'GAY' && P('RHI2-C30PT21.5/11.8/18').loai === 'NGON', 'không nhận nhầm gậy 2 khúc / ngọn lẻ / "11 khúc"');
const btp = c.dhBTP_('GẬY 1 KHÚC GMK', P('GẬY 1 KHÚC GMK'), {}).ds;
ok(btp.join() === 'PHOI,SON,UV,HT,TIP,DG', 'luồng bộ phận Phôi → Sơn → UV → HT → Làm đầu → Đóng gói', btp);
ok(c.dhBPSau_('GẬY 1 KHÚC GMK', 'HT', { qua: {}, sl: 5 }) === 'TIP' && c.dhBPSau_('GẬY 1 KHÚC GMK', 'TIP', { qua: { TIP: 5 }, sl: 5 }) === 'DG' && c.dhBPSau_('GẬY 1 KHÚC GMK', 'PHOI', {}) === 'SON', 'bộ phận kế tiếp: HT → Làm đầu → Đóng gói (không trả lại HT)');
const hc = c.dhHanChuan_({ thieu: 20, sl: 20, dl: '2026-12-10', btp: btp, pl: { loai: 'GAY1K' }, qua: {}, hen: {} }, { nghi: [], lam: [], bp: {} }, '2026-11-16');
ok(hc && hc.PHOI && hc.SON && hc.UV && hc.HT && hc.TIP && hc.DG && !hc.TARO && !hc.PHOI_N && hc.TIP.h > hc.HT.h && hc.HT.h > hc.UV.h && hc.SON.h > hc.PHOI.h, 'hạn chuẩn lùi đúng 1 luồng (Làm đầu sau HT, không Taro)', hc);
let r = c.__goi('luuCauHinhSP', c.__phienDai(c.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER')), { loai: 'DONG', ten: 'Gậy 1 khúc CLB', loaiHang: 'GAY1K', tenGoi: 'CLB 1 KHUC', chuoi: 'GF1K', tip: 'DEN7', dau: '12.2' });
ok(r.ok, 'thêm dòng gậy 1 khúc mới trên web (không cần chọn ngọn / ren)', r);
ok(c.CG_KHOA['mot.ong.dCuoi'] === 'n' && c.cgLoc_({ mot: { ong: { dCuoi: 29.4, vl: 'GF' } } }).dl.mot.ong.dCuoi === 29.4, 'máy chủ nhận số đo gậy 1 khúc (mot.*) khi lưu bản vẽ');
(async () => {
  console.log('2. Web');
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1200, height: 900 } }), er = []; pg.on('pageerror', e => er.push(e.message));
  const src = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '');
  await pg.setContent('<html><body><main id=main></main></body></html>');
  await pg.addScriptTag({ content: 'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.call=()=>{};window.$=id=>document.getElementById(id);' });
  await pg.addScriptTag({ content: src('QuyTrinh.html') });
  const w = await pg.evaluate(() => { const hn = dhHomNay(), R1 = ['PHOI','SON','UV','HT','TIP','DG'], out = {};
    const mk = (ma, sl, r, loai) => ({ maDon: ma, tab: 'OEM', kenh: 'OEM', ten: ma, sl: sl, thieu: sl, dl: dhNgayCong(hn, 30), btp: r, pl: { loai: loai }, qua: {}, hen: {} });
    const s = dhSimDong(mk('M', 10, R1, 'GAY1K'), {}, false, false, 0); out.ch = s.ch.map(x => x.map(y => y.r).join(','));
    window.DH = { cs: { sp: 310, nghi: [], lam: [], bp: {} }, don: [mk('M', 50, R1, 'GAY1K'), mk('G', 50, ['PHOI','SON','TARO','UV','HT','TIP','DG'], 'GAY')], q: {} };
    const d = dhMoPhong(dhCSDon()); out.eta = d.map(g => [g.ma, g.eta]);
    out.sau = [dhBSau(mk('M', 5, R1, 'GAY1K'), 'TIP'), dhBSau(mk('M', 5, R1, 'GAY1K'), 'HT'), dhBSau(mk('N', 5, ['PHOI','TARO','HT','TIP','DG'], 'NGON'), 'TIP')];
    out.khoi = [dhKhoiSKU({ loai: 'GAY1K' }), dhKhoiChuoi({ loai: 'GAY1K' }), dhChuoi('GAY1K', 'ngon').join()];
    out.mt = dhMucTieuXuong(); return JSON.parse(JSON.stringify(out)); });
  ok(er.length === 0, 'không lỗi script', er);
  ok(w.ch.length === 1 && w.ch[0] === 'PHOI_C,SON,UV,HT_C,TIP', 'mô phỏng: 1 luồng Phôi → Sơn → UV → HT → Làm đầu (không tách chuôi / ngọn)', w.ch);
  ok(w.eta.every(x => x[1] && x[1] < '9999'), 'ngày dự kiến xong tính được cho gậy 1 khúc và gậy 2 khúc', w.eta);
  ok(w.sau.join() === 'DG,TIP,HT', 'web: 1 khúc Làm đầu → Đóng gói; ngọn lẻ Làm đầu → trả HT', w.sau);
  ok(w.khoi.join('|') === 'Gậy 1 khúc|Gậy 1 khúc|PHOI,SON,UV,HT,TIP,DG', 'nhóm "Gậy 1 khúc" riêng trong thống kê / việc theo xưởng', w.khoi);
  ok(w.mt.SON >= 1 && w.mt.NGONTIP >= 1 && w.mt.NGONTARO >= 0 && w.mt._t.mot === 50, 'mục tiêu xưởng tính thêm gậy 1 khúc (Sơn, UV, Làm đầu…)', w.mt);
  /* bản vẽ */
  const q = await b.newPage({ viewport: { width: 1200, height: 900 } }); const er2 = []; q.on('pageerror', e => er2.push(e.message));
  const css = (fs.readFileSync(path.join(__dirname, '..', 'CauHinhGay.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  await q.setContent('<html><head><style>body{background:#fff;font:14px system-ui}' + css + '</style></head><body><div id=cgCt></div></body></html>');
  await q.addScriptTag({ content: 'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.toast=()=>{};window.call=()=>{};window.$=id=>document.getElementById(id);' });
  await q.addScriptTag({ content: src('CauHinhGay.html') });
  const v = await q.evaluate(() => { const d = { ma: 'GAY1K', ten: 'Gậy 1 khúc glassfiber 1450 / 1480 (không ren)', loai: 'GAY1K', goi: ['1 KHUC'], kieu: 'DANH', tenTip: '—', tenChuoi: 'GF 1450/1480 nguyên cây', tenNgon: '—', tenRen: '—' };
    const t = cgMau(d), L = cgDai(t).tong, kt = cgKiemTra(t, d), th = cgTruongHien(t).reduce((a, g) => a + g[1].length, 0);
    CG.bv = { dong: d, lichSu: [] }; CG.quyen = 'sua'; cgVeCt(); const h1 = document.getElementById('cgCt').innerHTML;
    cgBatSua(); const form = document.querySelectorAll('#cgCt input[data-p^="mot."]').length; CG.sua = null; cgVeCt();
    const t2 = cgMau(Object.assign({}, d, { ten: 'Gậy 1 khúc 1450', goi: ['GMK 1450 12.2'] })); return { L, kt, th, form, svg: (h1.match(/<svg/g) || []).length, co: /ĐẦU GẬY/.test(h1) && /BẢNG CHI TIẾT/.test(h1) && /1 khúc/.test(h1), L2: cgDai(t2).tong, d2: t2.mot.tip.d,
      sai: cgKiemTra1K(Object.assign(JSON.parse(JSON.stringify(t)), { mot: Object.assign(JSON.parse(JSON.stringify(t.mot)), { ong: Object.assign({}, t.mot.ong, { dGiua: 35 }) }) })).map(x => x.muc), rong: document.body.scrollWidth }; });
  ok(er2.length === 0, 'bản vẽ: không lỗi script', er2);
  ok(Math.abs(v.L - 1480) < 0.01 && v.kt.length === 0, 'mẫu 1480 mm, kiểm tra kích thước không báo lỗi', [v.L, v.kt]);
  ok(Math.abs(v.L2 - 1450) < 0.01 && v.d2 === 12.2, 'tên có "1450" / "12.2" → mẫu 1450 mm, tip 12.2', [v.L2, v.d2]);
  ok(v.svg >= 3 && v.co, 'vẽ cả cây + chi tiết đầu / đuôi + bảng', v.svg);
  ok(v.th === 26 && v.form === 22, 'form sửa có đủ ô số đo gậy 1 khúc', [v.th, v.form]);
  ok(v.sai.includes('do'), 'Ø giữa lớn hơn Ø đuôi → báo đỏ', v.sai);
  if (process.env.SHOT) { await q.evaluate(() => { CG.sua = null; cgVeCt(); }); await q.screenshot({ path: process.env.SHOT, fullPage: true }); }
  console.log(n + ' kiểm thử, ' + l + ' lỗi'); await b.close(); process.exit(l ? 1 : 0);
})();
