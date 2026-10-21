import { registerRoot, Composition, AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, random } from 'remotion';
/* Video nền màn đăng nhập "Khắc laser": ảnh đứng yên (để chữ khắc khớp ngọn cơ), chỉ ánh sáng + bụi chuyển động; lặp liền mạch */
const W = 1600, H = 900;
const chu = (u) => u - Math.floor(u);
const Nen = () => {
  const f = useCurrentFrame(), { durationInFrames: T } = useVideoConfig(), p = f / T;
  // hạt bụi bay lên trong luồng sáng: mỗi hạt sống trọn 1 vòng lặp, mờ ở 2 đầu nên lặp không giật
  const bui = Array.from({ length: 70 }, (_, i) => {
    const u = chu(p + random('p' + i)), x0 = random('x' + i) * W, y0 = H * (.15 + random('y' + i) * .85);
    const r = 1 + random('r' + i) * 2.6, a = Math.sin(Math.PI * u) * (.25 + random('a' + i) * .5);
    const x = x0 + Math.sin((u + random('s' + i)) * 6.283) * 14, y = y0 - u * (60 + random('v' + i) * 90);
    return <div key={i} style={{ position: 'absolute', left: x, top: y, width: r * 8, height: r * 8, marginLeft: -r * 4, marginTop: -r * 4, borderRadius: '50%', opacity: a,
      background: 'radial-gradient(circle, rgba(255,238,210,.95) 0, rgba(255,238,210,.35) 22%, rgba(255,238,210,0) 60%)', filter: r > 2.6 ? 'blur(1.2px)' : 'none' }} />;
  });
  // đốm lóe trên lớp hạt carbon phía dưới (mỗi đốm lóe 2 lần / vòng)
  const loe = Array.from({ length: 34 }, (_, i) => {
    const u = chu(p * 2 + random('lp' + i)), s = u < .1 ? u / .1 : u < .25 ? 1 - (u - .1) / .15 : 0;
    const x = random('lx' + i) * W, y = H * (.56 + random('ly' + i) * .42), k = 6 + 10 * s;
    return s <= 0 ? null : <div key={'l' + i} style={{ position: 'absolute', left: x - k, top: y - k, width: k * 2, height: k * 2, opacity: s,
      background: 'linear-gradient(90deg,transparent 46%,#fffaf0 50%,transparent 54%),linear-gradient(0deg,transparent 46%,#fffaf0 50%,transparent 54%),radial-gradient(circle,#fff 0,rgba(255,255,255,0) 22%)' }} />;
  });
  // vệt sáng quét qua các ngọn cơ: chạy trong 45% đầu vòng, rồi nghỉ
  const q = Math.min(1, p / .45), qx = -40 + q * 180;
  // luồng sáng chéo từ góc trên phải, thở nhẹ
  const tho = .55 + .2 * Math.sin(p * 6.283) + .05 * Math.sin(p * 6.283 * 7);
  return <AbsoluteFill style={{ background: '#000' }}>
    <Img src={staticFile('khac-laser.jpg')} style={{ width: W, height: H }} />
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: tho, background: 'linear-gradient(225deg, rgba(255,226,170,.30) 0%, rgba(255,226,170,.10) 30%, rgba(255,226,170,0) 55%)' }} />
    {p < .45 && <AbsoluteFill style={{ mixBlendMode: 'screen', WebkitMaskImage: 'linear-gradient(180deg,#000 0,#000 60%,transparent 78%)',
      background: `linear-gradient(104deg, transparent ${qx - 8}%, rgba(255,236,200,.18) ${qx - 1}%, rgba(255,250,235,.30) ${qx}%, rgba(255,236,200,.18) ${qx + 1}%, transparent ${qx + 8}%)` }} />}
    <AbsoluteFill>{loe}</AbsoluteFill>
    <AbsoluteFill>{bui}</AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.35) 100%)' }} />
  </AbsoluteFill>;
};
registerRoot(() => <Composition id="Nen" component={Nen} durationInFrames={240} fps={24} width={W} height={H} />);
