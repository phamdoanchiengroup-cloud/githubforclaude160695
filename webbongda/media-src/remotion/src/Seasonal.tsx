import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random, Sequence, continueRender, delayRender} from 'remotion';

// Video mùa vụ cho rhino-billiards.com: Halloween & Black Friday (khổ ngang và dọc dùng chung bố cục co giãn)
const OSW = 'OswaldS', VIE = 'VietS';
const _h = delayRender('fonts-sk');
Promise.all([
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
  new FontFace(VIE, `url(${staticFile('BeVietnamPro-800.ttf')})`, {weight: '800'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const vao = (f: number, d: number, dur = 16) => interpolate(f - d, [0, dur], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
const useL = () => { const {width, height} = useVideoConfig(); const doc = height > width; return {W: width, H: height, doc, u: Math.min(width, height) / 1080}; };

/* ======================= HALLOWEEN ======================= */
const CAM = '#ff7a1a', TIM = '#8b5cf6', DEM = '#07040f';
type SPH = {img: string; ten: string; mau: string; gia: string; cau: string};
const HSP: SPH[] = [
  {img: 'ame', ten: 'NEBULA 2 · AMETHYST PURPLE', mau: '#9b6bff', gia: '$389', cau: 'Witchy purple. Carbon precision.'},
  {img: 'jet', ten: 'LUMINAX · JET BLACK', mau: '#cfd6e6', gia: '$309', cau: 'Dark as midnight. Low deflection.'},
  {img: 'nebr', ten: 'NEBULA 2 · CRIMSON RED', mau: '#ff3048', gia: '$389', cau: 'Blood-red bold. 100% carbon.'},
];
export const HL = {intro: 120, hoi: 90, sp: 96, uudai: 120, cta: 120};
export const HL_TOTAL = HL.intro + HL.hoi + HL.sp * HSP.length + HL.uudai + HL.cta;

const Doi: React.FC<{seed: string; n: number}> = ({seed, n}) => {   // đàn dơi bay
  const f = useCurrentFrame(); const {W, H, u} = useL();
  return <>{Array.from({length: n}, (_, i) => {
    const sp = 2 + random(seed + 's' + i) * 4, y0 = random(seed + 'y' + i) * H * 0.6, s = (40 + random(seed + 'z' + i) * 60) * u;
    const x = ((random(seed + 'x' + i) * (W + 400) + f * sp * 3) % (W + 400)) - 200;
    const y = y0 + Math.sin(f / 9 + i) * 30 * u, vo = Math.abs(Math.sin(f / 3 + i * 2));
    return <svg key={i} viewBox="-50 -25 100 50" style={{position: 'absolute', left: x, top: y, width: s, height: s / 2, opacity: 0.85}}>
      <path d={`M0 -4 C -8 -12, -20 ${-18 * vo}, -48 ${-10 * vo} C -38 ${2 * vo}, -34 6, -26 4 C -22 10, -14 6, -8 10 C -4 6, -2 4, 0 6 C 2 4, 4 6, 8 10 C 14 6, 22 10, 26 4 C 34 6, 38 ${2 * vo}, 48 ${-10 * vo} C 20 ${-18 * vo}, 8 -12, 0 -4 Z`} fill="#0b0612" />
    </svg>; })}</>;
};
const BiNgo: React.FC<{size: number; glow: number}> = ({size, glow}) => (   // bí ngô đèn lồng
  <svg viewBox="-60 -60 120 120" width={size} height={size} style={{filter: `drop-shadow(0 0 ${30 * glow}px ${CAM})`}}>
    <path d="M-4 -46 C -2 -56, 6 -58, 10 -54 L 6 -44 Z" fill="#3d6b2a" />
    {[-34, -14, 14, 34].map((x, i) => <ellipse key={i} cx={x * 0.8} cy={4} rx={26} ry={44} fill={i % 3 ? '#ff7a1a' : '#e8650f'} />)}
    <ellipse cx={0} cy={4} rx={26} ry={46} fill="#ff8c2a" />
    <g fill={`rgba(255,${200 + 40 * glow},90,${0.6 + 0.4 * glow})`}>
      <path d="M-30 -10 L-12 -10 L-21 -26 Z" /><path d="M12 -10 L30 -10 L21 -26 Z" />
      <path d="M-34 14 Q 0 44 34 14 L 24 18 L 18 10 L 10 20 L 2 12 L -6 20 L -14 10 L -20 18 Z" />
    </g>
  </svg>);
const DemTrang: React.FC = () => {   // nền đêm: trăng, sương, sao
  const f = useCurrentFrame(); const {W, H, u, doc} = useL();
  const R = (doc ? 190 : 170) * u;
  return <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 0%, #2a1240 0%, ${DEM} 60%)`, overflow: 'hidden'}}>
    {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: random('sx' + i) * W, top: random('sy' + i) * H * 0.7, width: 3 * u, height: 3 * u, borderRadius: '50%', background: '#fff',
      opacity: 0.3 + 0.5 * Math.abs(Math.sin(f / 20 + i))}} />)}
    <div style={{position: 'absolute', left: (doc ? W * 0.78 : W * 0.88) - R, top: (doc ? H * 0.085 : H * 0.14) - R, width: R * 2, height: R * 2, borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, #fff7d6, #f5d98a 55%, #d9a94a 100%)', boxShadow: `0 0 ${160 * u}px rgba(255,214,120,.45)`, opacity: 0.92}} />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: -W * 0.3 + ((f * (1 + i) * 1.4 + i * 400) % (W * 0.6)), bottom: -120 * u + i * 60 * u, width: W * 1.2, height: 300 * u, borderRadius: '50%',
      background: 'rgba(170,140,220,.13)', filter: `blur(${40 * u}px)`}} />)}
  </AbsoluteFill>;
};
const HIntro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const lg = spring({frame: f - 8, fps, config: {damping: 14}}), t = vao(f, 34, 20);
  const nhay = f > 40 && f < 70 && random('fl' + Math.floor(f / 3)) > 0.65 ? 0.35 : 1;   // chữ chớp như đèn hỏng
  return <AbsoluteFill>
    <DemTrang /><Doi seed="a" n={9} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 * u, paddingTop: doc ? 300 * u : 80 * u}}>
      <Img src={staticFile('sk/logo.png')} style={{width: (doc ? 760 : 640) * u, opacity: lg, transform: `scale(${0.85 + 0.15 * lg})`}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: (doc ? 200 : 190) * u, lineHeight: 1, color: CAM, letterSpacing: '0.04em', opacity: t * nhay,
        transform: `translateY(${(1 - t) * 60 * u}px)`, textShadow: `0 0 ${40 * u}px ${CAM}, 0 0 ${90 * u}px rgba(255,90,0,.6)`}}>HALLOWEEN</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34 * u, letterSpacing: '0.4em', color: '#d9c9ff', opacity: vao(f, 60)}}>SPOOKY SEASON 2026</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const HHoi: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const a = vao(f, 4, 14), b = spring({frame: f - 42, fps, config: {damping: 10, stiffness: 160}});
  return <AbsoluteFill>
    <DemTrang /><Doi seed="b" n={6} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: doc ? 'column' : 'row', gap: 60 * u}}>
      <BiNgo size={(doc ? 420 : 360) * u} glow={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} />
      <div style={{textAlign: doc ? 'center' : 'left'}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 120 * u, lineHeight: 1, color: '#fff', opacity: a * (1 - b * 0.6)}}>TRICK<br />OR TREAT?</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 96 * u, color: CAM, marginTop: 20 * u, opacity: b, transform: `scale(${0.6 + 0.4 * b})`, transformOrigin: doc ? 'center' : 'left',
          textShadow: `0 0 ${30 * u}px ${CAM}`}}>TREAT YOUR GAME.</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const HSanPham: React.FC<{sp: SPH}> = ({sp}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc, W, H} = useL();
  const c = spring({frame: f, fps, config: {damping: 13}}), t = vao(f, 14), g = spring({frame: f - 30, fps, config: {damping: 11, stiffness: 180}});
  const S = (doc ? 860 : 700) * u;
  return <AbsoluteFill>
    <DemTrang /><Doi seed={sp.img} n={5} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: doc ? 'column' : 'row', gap: (doc ? 50 : 90) * u}}>
      <div style={{width: S, height: S, borderRadius: 26 * u, overflow: 'hidden', background: '#e9eaee', transform: `rotate(${(1 - c) * 10}deg) scale(${0.7 + 0.3 * c})`, opacity: c,
        boxShadow: `0 0 0 ${4 * u}px ${sp.mau}, 0 0 ${90 * u}px ${sp.mau}88, 0 ${40 * u}px ${80 * u}px rgba(0,0,0,.7)`}}>
        <Img src={staticFile(`sk/${sp.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, 96], [1.0, 1.07])})`}} />
      </div>
      <div style={{width: doc ? W * 0.86 : W * 0.36, textAlign: doc ? 'center' : 'left'}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 70 * u, lineHeight: 1.05, color: '#fff', opacity: t, transform: `translateY(${(1 - t) * 30 * u}px)`}}>{sp.ten}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34 * u, color: '#d9c9ff', marginTop: 16 * u, opacity: vao(f, 22)}}>{sp.cau}</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 110 * u, color: CAM, marginTop: 18 * u, opacity: g, transform: `scale(${0.6 + 0.4 * g})`, transformOrigin: doc ? 'center' : 'left',
          textShadow: `0 0 ${30 * u}px rgba(255,122,26,.7)`}}>{sp.gia}</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const HUuDai: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const a = spring({frame: f, fps, config: {damping: 10, stiffness: 140}}), b = vao(f, 30), c = vao(f, 48);
  return <AbsoluteFill>
    <DemTrang /><Doi seed="u" n={7} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 * u, textAlign: 'center', padding: 60 * u}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 36 * u, letterSpacing: '0.3em', color: '#d9c9ff', opacity: a}}>YOUR CUE · YOUR WAY</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: (doc ? 170 : 190) * u, lineHeight: 0.95, color: CAM, transform: `scale(${0.5 + 0.5 * a})`, opacity: a,
        textShadow: `0 0 ${50 * u}px ${CAM}`}}>UP TO 70% OFF</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 64 * u, color: '#fff', opacity: b, transform: `translateY(${(1 - b) * 30 * u}px)`}}>CUSTOMIZATION FEES</div>
      <div style={{display: 'flex', gap: 20 * u, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 * u, opacity: c}}>
        {['FREE SHIPPING OVER $99', 'LIMITED LIFETIME WARRANTY'].map((x) => <div key={x} style={{fontFamily: VIE, fontWeight: 800, fontSize: 30 * u, color: '#fff', padding: `${14 * u}px ${28 * u}px`,
          borderRadius: 999, border: `${3 * u}px solid ${TIM}`, background: 'rgba(139,92,246,.18)'}}>{x}</div>)}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const HCta: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const a = spring({frame: f, fps, config: {damping: 13}}), b = vao(f, 20), c = vao(f, 36);
  return <AbsoluteFill>
    <DemTrang /><Doi seed="c" n={10} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 * u, paddingTop: doc ? 260 * u : 60 * u}}>
      <BiNgo size={180 * u} glow={0.7 + 0.3 * Math.sin(f / 4)} />
      <Img src={staticFile('sk/logo.png')} style={{width: 700 * u, opacity: a, transform: `scale(${0.85 + 0.15 * a})`}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 80 * u, color: '#fff', opacity: b}}>rhino-billiards.com</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 36 * u, color: '#140a00', background: `linear-gradient(135deg, ${CAM}, #ffb347)`, padding: `${18 * u}px ${54 * u}px`, borderRadius: 999,
        opacity: c, transform: `scale(${0.9 + 0.1 * c + 0.03 * Math.sin(f / 5)})`, boxShadow: `0 0 ${40 * u}px rgba(255,122,26,.6)`}}>SHOP NOW</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export const Halloween: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  let t = 0; const seq: React.ReactNode[] = [];
  const add = (len: number, node: React.ReactNode, k: string) => { seq.push(<Sequence key={k} from={t} durationInFrames={len}>{node}</Sequence>); t += len; };
  add(HL.intro, <HIntro />, 'i'); add(HL.hoi, <HHoi />, 'h');
  HSP.forEach((sp, i) => add(HL.sp, <HSanPham sp={sp} />, 's' + i));
  add(HL.uudai, <HUuDai />, 'u'); add(HL.cta, <HCta />, 'c');
  const ranh = [HL.intro, HL.intro + HL.hoi, ...HSP.map((_, i) => HL.intro + HL.hoi + HL.sp * (i + 1))];
  const flash = Math.max(0, ...ranh.map((r) => interpolate(f - r, [0, 8], [0.5, 0], cl) * (f >= r ? 1 : 0)));
  return <AbsoluteFill style={{background: DEM}}>
    {seq}
    <AbsoluteFill style={{background: CAM, opacity: flash * 0.35, mixBlendMode: 'screen'}} />
    <Audio src={staticFile('sk/halloween.mp3')} startFrom={27 * 30} volume={(fr) => interpolate(fr, [0, 20, D - 45, D], [0, 1, 1, 0], cl)} />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 12, D - 15, D], [1, 0, 0, 1], cl)}} />
  </AbsoluteFill>;
};

/* ======================= BLACK FRIDAY ======================= */
const VANG = '#f5c84b';
type SPB = {img: string; ten: string; nhan: string; gia: string};
const BSP: SPB[] = [
  {img: 'mu5', ten: 'MUST SERIES', nhan: 'PREMIUM', gia: '$529'},
  {img: 'r2', ten: 'RETRO II', nhan: 'NEW', gia: '$529'},
  {img: 'voy', ten: 'VOYAGER USA 2025', nhan: 'BEST SELLER', gia: '$419'},
  {img: 'neb', ten: 'NEBULA 2', nhan: '10 COLORS', gia: '$369'},
  {img: 'kom', ten: 'KOMET II', nhan: 'BREAK CUE', gia: '$349'},
  {img: 'lum', ten: 'LUMINAX', nhan: 'BEST VALUE', gia: '$289'},
];
export const BF = {intro: 105, ngay: 90, sp: 66, tin: 135, cta: 120};
export const BF_TOTAL = BF.intro + BF.ngay + BF.sp * BSP.length + BF.tin + BF.cta;
const NenDen: React.FC<{nhap?: boolean}> = ({nhap}) => {
  const f = useCurrentFrame(); const {u} = useL();
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(70% 60% at 50% 50%, rgba(245,200,75,${nhap ? 0.16 : 0.08}), transparent 70%)`}} />
    <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 ${2 * u}px, transparent ${2 * u}px ${26 * u}px)`, transform: `translateX(${(f * 2) % (26 * u * 1.414)}px)`}} />
  </AbsoluteFill>;
};
const BIntro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const a = spring({frame: f - 4, fps, config: {damping: 9, stiffness: 220}}), b = spring({frame: f - 16, fps, config: {damping: 9, stiffness: 220}});
  const rung = f > 4 && f < 30 ? Math.sin(f * 2.7) * (30 - f) * 0.6 * u : 0;
  return <AbsoluteFill>
    <NenDen nhap />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `translate(${rung}px, ${rung * 0.5}px)`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: (doc ? 300 : 280) * u, lineHeight: 0.9, color: '#fff', transform: `scale(${3 - 2 * a})`, opacity: Math.min(1, a * 2)}}>BLACK</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: (doc ? 300 : 280) * u, lineHeight: 0.9, color: VANG, transform: `scale(${3 - 2 * b})`, opacity: Math.min(1, b * 2),
        textShadow: `0 0 ${50 * u}px rgba(245,200,75,.5)`}}>FRIDAY</div>
      <Img src={staticFile('sk/logo.png')} style={{width: 560 * u, marginTop: 40 * u, opacity: vao(f, 40)}} />
    </AbsoluteFill>
  </AbsoluteFill>;
};
const BNgay: React.FC = () => {
  const f = useCurrentFrame(); const {u, doc} = useL();
  const a = vao(f, 0, 12), b = vao(f, 14, 12), c = vao(f, 30, 12);
  return <AbsoluteFill>
    <NenDen />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 * u, textAlign: 'center', padding: 60 * u}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: (doc ? 110 : 120) * u, lineHeight: 1, color: '#fff', opacity: a, transform: `translateY(${(1 - a) * 40 * u}px)`}}>THE BIGGEST<br />DROP OF THE YEAR</div>
      <div style={{width: 520 * u * b, height: 6 * u, background: VANG}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 92 * u, color: VANG, letterSpacing: '0.06em', opacity: c}}>NOV 27 – NOV 30</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 32 * u, letterSpacing: '0.3em', color: '#aaa', opacity: c}}>BLACK FRIDAY → CYBER MONDAY</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const BSanPham: React.FC<{sp: SPB; i: number}> = ({sp, i}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc, W} = useL();
  const c = spring({frame: f, fps, config: {damping: 14, stiffness: 180}}), t = vao(f, 6, 12), g = spring({frame: f - 14, fps, config: {damping: 10, stiffness: 220}});
  const S = (doc ? 880 : 760) * u, tu = i % 2 ? 1 : -1;
  return <AbsoluteFill>
    <NenDen />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: doc ? 'column' : (i % 2 ? 'row-reverse' : 'row'), gap: (doc ? 46 : 90) * u}}>
      <div style={{width: S, height: S, borderRadius: 18 * u, overflow: 'hidden', background: '#e9eaee', transform: `translateX(${(1 - c) * tu * 600 * u}px)`,
        boxShadow: `0 0 0 ${3 * u}px ${VANG}, 0 ${30 * u}px ${80 * u}px rgba(0,0,0,.8)`}}>
        <Img src={staticFile(`sk/${sp.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, 66], [1.06, 1])})`}} />
      </div>
      <div style={{width: doc ? W * 0.86 : W * 0.34, textAlign: doc ? 'center' : 'left'}}>
        <div style={{display: 'inline-block', fontFamily: VIE, fontWeight: 800, fontSize: 28 * u, letterSpacing: '0.24em', color: '#000', background: VANG, padding: `${8 * u}px ${20 * u}px`, opacity: t}}>{sp.nhan}</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 96 * u, lineHeight: 1, color: '#fff', marginTop: 20 * u, opacity: t, transform: `translateY(${(1 - t) * 30 * u}px)`}}>{sp.ten}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30 * u, color: '#aaa', marginTop: 18 * u, opacity: g}}>FROM</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 130 * u, lineHeight: 1, color: VANG, opacity: g, transform: `scale(${0.6 + 0.4 * g})`, transformOrigin: doc ? 'center' : 'left'}}>{sp.gia}</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const BTin: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u, doc} = useL();
  const items: [string, string][] = [['LIMITED LIFETIME', 'WARRANTY'], ['30-DAY', 'RETURNS'], ['FREE SHIPPING', 'OVER $99'], ['4.5★ TRUSTPILOT', '445 REVIEWS']];
  return <AbsoluteFill>
    <NenDen />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 * u, padding: 60 * u}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 84 * u, color: '#fff', textAlign: 'center', opacity: vao(f, 0)}}>BUILT TO LAST. <span style={{color: VANG}}>BACKED FOR LIFE.</span></div>
      <div style={{display: 'grid', gridTemplateColumns: doc ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 28 * u, width: '100%', maxWidth: 1700 * u}}>
        {items.map(([a, b], i) => { const k = spring({frame: f - 12 - i * 8, fps, config: {damping: 13}});
          return <div key={i} style={{border: `${3 * u}px solid ${VANG}`, padding: `${36 * u}px ${20 * u}px`, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 80 * u}px)`}}>
            <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 52 * u, color: '#fff', lineHeight: 1.05}}>{a}</div>
            <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 28 * u, color: VANG, letterSpacing: '0.16em', marginTop: 10 * u}}>{b}</div>
          </div>; })}
      </div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30 * u, letterSpacing: '0.3em', color: '#aaa', opacity: vao(f, 60)}}>100% CARBON · MADE BY VIETNAM</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const BCta: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const {u} = useL();
  const a = spring({frame: f, fps, config: {damping: 12}}), b = vao(f, 18), c = vao(f, 32);
  return <AbsoluteFill>
    <NenDen nhap />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 * u}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 150 * u, lineHeight: 0.95, color: '#fff', textAlign: 'center', opacity: a, transform: `scale(${1.3 - 0.3 * a})`}}>BLACK FRIDAY<br /><span style={{color: VANG}}>DEALS</span></div>
      <Img src={staticFile('sk/logo.png')} style={{width: 600 * u, opacity: b}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 74 * u, color: '#fff', opacity: b}}>rhino-billiards.com</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 36 * u, color: '#000', background: VANG, padding: `${18 * u}px ${54 * u}px`, opacity: c, transform: `scale(${0.9 + 0.1 * c + 0.03 * Math.sin(f / 5)})`}}>SHOP THE DROP · NOV 27</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export const BlackFriday: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  let t = 0; const seq: React.ReactNode[] = []; const ranh: number[] = [];
  const add = (len: number, node: React.ReactNode, k: string) => { ranh.push(t); seq.push(<Sequence key={k} from={t} durationInFrames={len}>{node}</Sequence>); t += len; };
  add(BF.intro, <BIntro />, 'i'); add(BF.ngay, <BNgay />, 'n');
  BSP.forEach((sp, i) => add(BF.sp, <BSanPham sp={sp} i={i} />, 's' + i));
  add(BF.tin, <BTin />, 't'); add(BF.cta, <BCta />, 'c');
  const flash = Math.max(0, ...ranh.slice(1).map((r) => (f >= r ? interpolate(f - r, [0, 6], [0.8, 0], cl) : 0)));
  return <AbsoluteFill style={{background: '#000'}}>
    {seq}
    <AbsoluteFill style={{background: '#fff', opacity: flash * 0.5}} />
    <Audio src={staticFile('sk/bf.mp3')} volume={(fr) => interpolate(fr, [0, 6, D - 45, D], [0, 1, 1, 0], cl)} loop />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [D - 15, D], [0, 1], cl)}} />
  </AbsoluteFill>;
};
