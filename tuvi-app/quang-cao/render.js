const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  for (const [f, w, h] of [['qc-feed', 1080, 1350], ['qc-story', 1080, 1920], ['qc-ngang', 1200, 628]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + __dirname + '/' + f + '.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.screenshot({ path: f + '.png' });
    console.log(f, await p.evaluate(() => [document.fonts.check('700 40px "Cormorant Garamond"', 'Năm'), document.fonts.check('400 20px "Be Vietnam Pro"', 'ứ')]));
  }
  await b.close();
})();
