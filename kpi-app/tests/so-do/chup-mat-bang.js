/* Chụp mặt bằng từng tầng từ mô hình 3D (nhìn thẳng từ trên xuống, 12:00, màu thật) làm nền cho sơ đồ 2D (24/10, chủ dự án:
   "sơ đồ nhà máy bản 2D thì dùng ảnh chụp của sơ đồ 3D cho đẹp"). Khung ảnh = khung SVG 2D: x −0,5…45,25 m, y −0,5…34,75 m (30 px/m).
   Chạy: DATA=… OUT=$S/xt.html … node tests/tao-ban-xem-thu.js
         F=$S/xt.html THREE=<gói npm three@0.160.0> node kpi-app/tests/so-do/chup-mat-bang.js   -> ghi kpi-app/so-do/anh-tang-{0,1,2}.jpg */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const THREE = process.env.THREE, RA = path.join(__dirname, '..', '..', 'so-do');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1360, height: 860 } });
  await ctx.route(/cdn\.jsdelivr\.net\/npm\//, r => { const u = r.request().url(), g = 'three@0.160.0/'; if (!u.includes(g)) return r.abort(); r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(THREE, u.split(g)[1])) }); });
  await ctx.route(/fonts\.|cdnjs/, r => r.abort());
  const p = await ctx.newPage(); p.on('dialog', d => d.accept());
  await p.goto('file://' + process.env.F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(() => { document.getElementById('l_tk').value = 'giamdoc'; document.getElementById('l_mk').value = 'demo'; login(); });
  await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 30000 });
  await p.evaluate(() => go('sodo')); await p.waitForTimeout(3000);
  await p.click('#sdNut3d');
  const f3 = await (await p.waitForSelector('#sd3d iframe', { state: 'attached', timeout: 120000 })).contentFrame();
  await f3.waitForSelector('#c3d canvas', { state: 'attached', timeout: 240000 }); await p.waitForTimeout(5000);
  await f3.evaluate(() => { const t = document.getElementById('tgDi'); if (t && t.checked) t.click();
    const m = document.querySelector('#segMau button[data-c=""]'); if (m) m.click();
    const h = document.getElementById('hour'); h.value = 12; h.dispatchEvent(new Event('input')); });
  await p.waitForTimeout(3000);
  for (const fi of [0, 1, 2]) {
    await f3.evaluate(fi => document.querySelector('button[data-f="' + fi + '"]').click(), fi);
    await p.waitForTimeout(8000);
    const url = await f3.evaluate(() => {
      const { THREE: T, scene } = __v3, W = 1372, H = 1057;
      const r = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(W, H);
      r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 0.62; r.shadowMap.enabled = false;   // không đổ bóng: mặt bằng sạch, dễ đọc r.outputColorSpace = T.SRGBColorSpace;
      const cam = new T.OrthographicCamera(-22.875, 22.875, 17.625, -17.625, 1, 2000); cam.position.set(0, 400, 0); cam.up.set(0, 0, -1); cam.lookAt(0, 0, 0);
      r.render(scene, cam); const u = r.domElement.toDataURL('image/jpeg', 0.8); r.dispose(); return u;
    });
    fs.writeFileSync(path.join(RA, 'anh-tang-' + fi + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
    console.log('tầng', fi + 1, Math.round(url.length * 3 / 4 / 1024) + ' KB');
  }
  await b.close();
})();
