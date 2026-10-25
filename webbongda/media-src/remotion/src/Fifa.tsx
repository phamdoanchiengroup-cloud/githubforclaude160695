import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random, continueRender, delayRender} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {slide} from '@remotion/transitions/slide';
import {flip} from '@remotion/transitions/flip';
import {fade} from '@remotion/transitions/fade';
import data from './fifa.json';
import vo from './vo.json';

export const OSW = 'OswaldF';
export const VIE = 'VietF';
const _h = delayRender('fonts-fifa');
Promise.all([
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
  new FontFace(VIE, `url(${staticFile('BeVietnamPro-800.ttf')})`, {weight: '800'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

type P = {img: string; name: string; rating: number; so: string; pos?: string};
type T = {key: string; name: string; color: string; sodo: string; xi: P[]; bench: P[]};
const [TA, TB] = data.teams as T[];
export const NAVY = '#05081a';
export const YEL = '#ffde46';


export const Stars: React.FC<{color?: string}> = ({color = '#9fc2ff'}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill>{new Array(70).fill(0).map((_, i) => {
    const x = random('sx' + i) * 1920, sp = 15 + random('sv' + i) * 60;
    const y = (random('sy' + i) * 1080 - f * sp / 30 + 3240) % 1080, s = 1.5 + random('ss' + i) * 3;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, opacity: 0.2 + 0.6 * Math.abs(Math.sin(f / 9 + i))}} />;
  })}</AbsoluteFill>;
};

export const Rise: React.FC<{text: string; delay?: number; size: number; color?: string; font?: string; spacing?: number; glow?: string}> = ({text, delay = 0, size, color = '#fff', font = VIE, spacing = 0.06, glow}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div style={{display: 'flex', justifyContent: 'center', fontFamily: font, fontWeight: 800, fontSize: size, color, letterSpacing: `${spacing}em`, textShadow: glow ? `0 0 ${size * 0.35}px ${glow}` : undefined, whiteSpace: 'pre'}}>
    {[...text].map((ch, i) => { const s = spring({frame: f - delay - i * 1.1, fps, config: {damping: 12, stiffness: 170}}); return <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>{ch}</span>; })}
  </div>;
};

const VT: Record<string, string> = {GK: 'THỦ MÔN', LB: 'HẬU VỆ TRÁI', RB: 'HẬU VỆ PHẢI', CB: 'TRUNG VỆ', CDM: 'TIỀN VỆ PHÒNG NGỰ', CM: 'TIỀN VỆ', LM: 'TIỀN VỆ TRÁI', RM: 'TIỀN VỆ PHẢI', ST: 'TIỀN ĐẠO', LS: 'TIỀN ĐẠO', RS: 'TIỀN ĐẠO'};
const MOVE = 14, HOLD = 40, STEP = MOVE + HOLD, HEAD = 30, IN = 20, OUT = 20;
export const TEAM_LEN = HEAD + IN + 6 * STEP + HOLD + OUT;

// nền sân vận động: chuyển động chậm, tối dần về đáy, phủ màu đội
const Stadium: React.FC<{color: string}> = ({color}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{overflow: 'hidden', background: NAVY}}>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', width: 1920, height: 1072, top: 4, objectFit: 'cover', transform: `scale(${1.08 + f * 0.00025}) translateX(${-f * 0.06}px)`, filter: 'brightness(0.5) saturate(0.9)'}} />
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${NAVY}cc 0%, transparent 28%, transparent 55%, ${NAVY}f2 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 60% at 50% 50%, ${color}33, transparent 70%)`}} />
  </AbsoluteFill>;
};

// vị trí băng chuyền: số thẻ đang ở giữa (có thể lẻ khi đang trượt)
const carousel = (f: number) => {
  if (f < HEAD) return -3;
  if (f < HEAD + IN) return interpolate(f, [HEAD, HEAD + IN], [-3, 0], {easing: Easing.out(Easing.cubic)});
  const g = f - HEAD - IN;
  const k = Math.floor(g / STEP), r = g - k * STEP;
  if (k >= 6) return interpolate(g - 6 * STEP, [HOLD, HOLD + OUT], [6, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  return r < HOLD ? k : k + Easing.inOut(Easing.cubic)((r - HOLD) / MOVE);
};

export const TeamCarousel: React.FC<{t: T}> = ({t}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const h = spring({frame: f, fps, config: {damping: 16}});
  const p = carousel(f);
  const k = Math.round(p), settled = Math.abs(p - k) < 0.02 && k >= 0 && k <= 6;
  const g = f - HEAD - IN - k * STEP;   // khung hình kể từ khi thẻ k dừng ở giữa
  const info = settled ? interpolate(g, [0, 8, HOLD - 6, HOLD], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const cur = t.xi[Math.max(0, Math.min(6, k))];
  return <AbsoluteFill>
    <Stadium color={t.color} />
    <div style={{position: 'absolute', top: 34, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: h, transform: `translateY(${(1 - h) * -40}px)`}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 92}} />
      <div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 58, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 22, color: t.color, letterSpacing: '0.2em', marginTop: 6}}>ĐỘI HÌNH XUẤT PHÁT · {t.sodo}</div>
      </div>
    </div>
    {t.xi.map((pl, i) => {
      const o = i - p, ao = Math.abs(o);
      if (ao > 3.2) return null;
      const sc = 1 - 0.36 * Math.min(1, ao);
      const x = 960 + o * 430 + Math.sign(o) * Math.max(0, ao - 1) * -60;
      return <div key={i} style={{position: 'absolute', left: x - 225, top: 520 - 312, width: 450, height: 624, transform: `scale(${sc})`, zIndex: 100 - Math.round(ao * 10), opacity: interpolate(ao, [0, 1, 2.6, 3.2], [1, 0.75, 0.5, 0])}}>
        <Img src={staticFile(pl.img)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 24px 30px #000c) brightness(${1 - 0.35 * Math.min(1, ao)})`}} />
      </div>;
    })}
    {/* thông tin cầu thủ đang ở giữa */}
    <div style={{position: 'absolute', top: 852, left: 0, right: 0, textAlign: 'center', opacity: info, transform: `translateY(${(1 - info) * 20}px)`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: '0.04em'}}>{cur.name.toUpperCase()}</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: t.color, letterSpacing: '0.22em', marginTop: 4}}>SỐ {cur.so} · {VT[cur.pos || ''] || cur.pos}</div>
    </div>
    {/* chấm tiến độ */}
    <div style={{position: 'absolute', bottom: 38, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12}}>
      {t.xi.map((_, i) => <div key={i} style={{width: i === k && settled ? 36 : 12, height: 12, borderRadius: 6, background: i <= p + 0.01 ? t.color : '#ffffff40'}} />)}
    </div>
  </AbsoluteFill>;
};

// Dự bị: thẻ được chia ra như chia bài, xòe hình quạt, rồi lần lượt nhấc lên giới thiệu từng người
const DEAL = 6, LIFT = 14;
export const benchLen = (n: number) => 100 + n * LIFT + 15;
const BenchFan: React.FC<{t: T}> = ({t}) => {
  const f = useCurrentFrame(); const {fps, durationInFrames: D} = useVideoConfig();
  const n = t.bench.length, span = Math.min(48, (n - 1) * 6.5);
  const h = spring({frame: f, fps, config: {damping: 16}});
  const w0 = 100;   // bắt đầu nhấc từng thẻ
  const liftOf = (i: number) => spring({frame: f - w0 - i * LIFT, fps, config: {damping: 12, stiffness: 200}}) - spring({frame: f - w0 - (i + 1) * LIFT, fps, config: {damping: 14}});
  const lifts = t.bench.map((_, i) => liftOf(i));
  const mx = Math.max(...lifts), cur = mx > 0.35 ? lifts.indexOf(mx) : -1;
  const out = interpolate(f, [D - 14, D], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const PX = 960, PY = 2200, R = 1640;
  return <AbsoluteFill style={{opacity: out}}>
    <Stadium color={t.color} />
    <div style={{position: 'absolute', top: 34, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: h, transform: `translateY(${(1 - h) * -40}px)`}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 92}} />
      <div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 58, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 22, color: t.color, letterSpacing: '0.2em', marginTop: 6}}>CẦU THỦ DỰ BỊ · {n} NGƯỜI</div>
      </div>
    </div>
    {t.bench.map((pl, i) => {
      const s = spring({frame: f - 14 - i * DEAL, fps, config: {damping: 15, stiffness: 110, mass: 0.9}});
      const a = n > 1 ? -span / 2 + (i * span) / (n - 1) : 0;
      const rad = (a * Math.PI) / 180;
      const tx = PX + R * Math.sin(rad), ty = PY - R * Math.cos(rad);
      const sx = 960, sy = 1400;   // cỗ bài ở dưới màn hình
      const x = sx + (tx - sx) * s, y = sy + (ty - sy) * s, rot = -25 + (a + 25) * s;
      const lift = lifts[i];
      const W = 250, H = 347;
      return <div key={i} style={{position: 'absolute', left: x - W / 2, top: y - H / 2, width: W, height: H, transform: `rotate(${rot}deg) translateY(${-70 * lift}px) scale(${1 + 0.16 * lift})`, zIndex: lift > 0.3 ? 50 : i}}>
        <Img src={staticFile(pl.img)} style={{width: W, height: H, objectFit: 'contain', filter: `drop-shadow(0 18px 22px #000c) brightness(${0.8 + 0.25 * lift})`}} />
      </div>;
    })}
    {cur >= 0 && cur < n && (() => {
      const pl = t.bench[cur], o = interpolate(mx, [0.35, 0.7], [0, 1], {extrapolateRight: 'clamp'});
      return <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', opacity: o}}>
        <span style={{display: 'inline-block', padding: '10px 34px', borderRadius: 12, background: '#05081add', borderBottom: `5px solid ${t.color}`, fontFamily: OSW, fontWeight: 700, fontSize: 52, color: '#fff'}}>
          <span style={{color: t.color, marginRight: 18}}>{pl.so}</span>{pl.name.toUpperCase()}
        </span>
      </div>;
    })()}
  </AbsoluteFill>;
};
export const Bench: React.FC = () => {
  const la = benchLen(TA.bench.length);
  return <AbsoluteFill>
    <Sequence durationInFrames={la}><BenchFan t={TA} /></Sequence>
    <Sequence from={la}><BenchFan t={TB} /></Sequence>
  </AbsoluteFill>;
};

// Sân 3D: cỏ thật, khung thành, bảng LED quanh sân, đèn sân; camera nghiêng xuống rồi xoay trọn 360°
const PW = 1800, PH = 1050, GM = 90;
const VITRI: Record<string, Record<string, [number, number]>> = {
  '2-1-2-1': {GK: [0.05, 0.5], LB: [0.17, 0.22], RB: [0.17, 0.78], CDM: [0.25, 0.5], LM: [0.35, 0.16], RM: [0.35, 0.84], ST: [0.43, 0.5]},
  '3-1-2': {GK: [0.05, 0.5], LB: [0.16, 0.2], CB: [0.17, 0.5], RB: [0.16, 0.8], CM: [0.28, 0.5], LS: [0.4, 0.28], RS: [0.4, 0.72]},
  '3-2-1': {GK: [0.05, 0.5], LB: [0.16, 0.2], CB: [0.17, 0.5], RB: [0.16, 0.8], LM: [0.3, 0.3], RM: [0.3, 0.7], ST: [0.42, 0.5]},
  '1-3-2': {GK: [0.05, 0.5], CB: [0.15, 0.5], LM: [0.28, 0.16], CM: [0.27, 0.5], RM: [0.28, 0.84], LS: [0.4, 0.3], RS: [0.4, 0.7]},
};
// mặt phẳng đứng (vuông góc mặt sân) bắt đầu tại (x, y), dài len theo hướng góc ang
const Wall: React.FC<{x: number; y: number; len: number; ang: number; h: number; front: React.ReactNode; back?: React.ReactNode}> = ({x, y, len, ang, h, front, back}) =>
  <div style={{position: 'absolute', left: x, top: y, width: len, height: 0, transformOrigin: '0 0', transform: `rotateZ(${ang}deg)`, transformStyle: 'preserve-3d'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: len, height: h, transformOrigin: '0 0', transform: 'rotateX(90deg)', transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotate(180deg)'}}>{front}</div>
      <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg) rotate(180deg)'}}>{back ?? front}</div>
    </div>
  </div>;
const LED: React.FC<{len: number; shift: number}> = ({len, shift}) =>
  <div style={{width: len, height: '100%', overflow: 'hidden', background: 'linear-gradient(#0b1440, #050a24)', borderTop: '3px solid #333a5a', boxShadow: 'inset 0 0 18px #46dcff55'}}>
    <div style={{whiteSpace: 'nowrap', fontFamily: OSW, fontWeight: 700, fontSize: 30, lineHeight: '50px', color: '#ffde46', transform: `translateX(${-shift % 760}px)`, textShadow: '0 0 10px #ffb400'}}>
      {Array.from({length: Math.ceil(len / 760) + 2}, (_, k) => <span key={k} style={{display: 'inline-block', width: 760}}>RHINO BILLIARDS 2026 <span style={{color: '#46dcff'}}>◆</span> CARBON BILLIARDS <span style={{color: '#46dcff'}}>◆</span></span>)}
    </div>
  </div>;
const NET = {width: '100%', height: '100%', boxSizing: 'border-box' as const, background: 'repeating-linear-gradient(0deg, #ffffff55 0 2px, transparent 2px 12px), repeating-linear-gradient(90deg, #ffffff55 0 2px, transparent 2px 12px)'};
const Goal: React.FC<{phai: boolean}> = ({phai}) => {
  const gx = phai ? PW : 0, d = phai ? 40 : -40, y0 = PH / 2 - 80, GH = 64;
  return <>
    <Wall x={gx} y={y0} len={160} ang={90} h={GH} front={<div style={{...NET, borderLeft: '6px solid #fff', borderRight: '6px solid #fff', borderBottom: '6px solid #fff', background: 'none'}} />} />
    <Wall x={gx + d} y={y0} len={160} ang={90} h={GH * 0.8} front={<div style={NET} />} />
    <Wall x={gx} y={y0} len={40} ang={phai ? 0 : 180} h={GH} front={<div style={NET} />} />
    <Wall x={gx} y={y0 + 160} len={40} ang={phai ? 0 : 180} h={GH} front={<div style={NET} />} />
  </>;
};
const viTri = (t: T, ti: number, pl: P, i: number) => {
  const [vx, vy] = VITRI[t.sodo]?.[pl.pos || ''] || [0.1 + i * 0.05, 0.5];
  return [(ti === 0 ? vx : 1 - vx) * PW, (ti === 0 ? vy : 1 - vy) * PH] as [number, number];
};
// lượt bay qua các thẻ: từ thủ môn đội trái, quét sang tới thủ môn đội phải
const TOUR = [TA, TB].flatMap((t, ti) => t.xi.map((pl, i) => {const [x, y] = viTri(t, ti, pl, i); return {x, y, t, pl};}))
  .sort((a, b) => a.x - b.x || a.y - b.y);
const R0 = 150, R1 = 360, F0 = R1 + 20, ZIN = 40, STEPF = 18, HOLDF = 7, ZOUT = 45;
const FLY_END = F0 + ZIN + (TOUR.length - 1) * STEPF + 20;
export const PITCH_LEN = FLY_END + ZOUT + 35;
export const Pitch3D: React.FC = () => {
  const f = useCurrentFrame(); const {fps, durationInFrames: D} = useVideoConfig();
  const vao = Easing.inOut(Easing.cubic);
  // zoom vào sân: w = mức zoom (0 toàn cảnh → 1 cận cảnh), (cx, cy) = điểm camera nhìn vào
  const w = interpolate(f, [F0, F0 + ZIN, FLY_END, FLY_END + ZOUT], [0, 1, 1, 0], {easing: vao, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const g = f - F0 - ZIN, k = Math.max(0, Math.min(TOUR.length - 1, Math.floor(g / STEPF)));
  const r = g - k * STEPF, mv = k < TOUR.length - 1 && g >= 0 ? Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, (r - HOLDF) / (STEPF - HOLDF)))) : 0;
  const a = TOUR[g < 0 ? 0 : k], b = TOUR[Math.min(TOUR.length - 1, k + 1)];
  const cx = PW / 2 + (a.x + (b.x - a.x) * mv - PW / 2) * w, cy = PH / 2 + (a.y + (b.y - a.y) * mv - PH / 2) * w;
  const tilt = interpolate(f, [0, 60, R0, (R0 + R1) / 2, R1], [6, 56, 56, 62, 56], {easing: vao, extrapolateRight: 'clamp'}) + 8 * w;
  const rz = interpolate(f, [0, 60, R0, R1], [-10, 0, 0, 360], {easing: vao, extrapolateRight: 'clamp'});
  const z = interpolate(f, [0, 60, R0, (R0 + R1) / 2, R1, D], [0.6, 0.84, 0.84, 0.66, 0.84, 0.88], {easing: vao, extrapolateRight: 'clamp'}) * (1 + 1.25 * w);
  const tag = g >= 0 && f < FLY_END ? (mv < 0.5 ? a : b) : null;
  const tagO = tag ? interpolate(Math.abs(mv - 0.5), [0.3, 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const intro = interpolate(f, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const nguoi = (t: T, ti: number) => t.xi.map((pl, i) => {
    const [x, y] = viTri(t, ti, pl, i);
    const s = spring({frame: f - 45 - ti * 42 - i * 6, fps, config: {damping: 13, stiffness: 120}});
    const lab = interpolate(f - 50 - ti * 42 - i * 6, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const W = 150, H = 208;
    return <React.Fragment key={t.key + i}>
      <div style={{position: 'absolute', left: x - 75, top: y - 24, width: 150, height: 48, borderRadius: '50%', background: 'radial-gradient(#000b, transparent 70%)', opacity: s, transform: 'translateZ(1px)'}} />
      <div style={{position: 'absolute', left: x - W / 2, top: y - H - 46, width: W, height: H + 46, transformOrigin: '50% 100%', transform: `translateZ(2px) rotateZ(${-rz}deg) rotateX(${-tilt * s}deg)`, opacity: Math.min(1, s * 3)}}>
        <Img src={staticFile(pl.img)} style={{width: W, height: H, objectFit: 'contain', filter: 'drop-shadow(0 10px 12px #000b)'}} />
        <div style={{marginTop: 4, marginLeft: -45, width: W + 90, height: 38, borderRadius: 8, background: '#05081ae6', borderBottom: `4px solid ${t.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: lab, fontFamily: VIE, fontWeight: 800, fontSize: 17, color: '#fff', whiteSpace: 'nowrap', padding: '0 8px', boxSizing: 'border-box'}}>
          <span style={{color: t.color, fontFamily: OSW, fontSize: 20}}>{pl.so}</span>{pl.name}
        </div>
      </div>
    </React.Fragment>;
  });
  const dau = (t: T, phai: boolean, d: number) => {
    const h = spring({frame: f - d, fps, config: {damping: 16}});
    return <div style={{position: 'absolute', top: 30, [phai ? 'right' : 'left']: 40, display: 'flex', flexDirection: phai ? 'row-reverse' : 'row', alignItems: 'center', gap: 16, opacity: h, transform: `translateX(${(1 - h) * (phai ? 60 : -60)}px)`}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 84}} />
      <div style={{textAlign: phai ? 'right' : 'left'}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 46, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 20, color: t.color, letterSpacing: '0.18em', marginTop: 6}}>SƠ ĐỒ {t.sodo}</div>
      </div>
    </div>;
  };
  const PANO = 4300, off = (((rz / 360) * PANO) % PANO + PANO) % PANO;
  const B = 80, led = f * 3;
  return <AbsoluteFill style={{background: NAVY, overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: -60, left: -off - 200, width: PANO * 2, height: 1200, display: 'flex', filter: 'blur(5px) brightness(0.4)'}}>
      <Img src={staticFile('pano.jpg')} style={{width: PANO, height: 1200}} /><Img src={staticFile('pano.jpg')} style={{width: PANO, height: 1200}} />
    </div>
    <AbsoluteFill style={{background: 'linear-gradient(#05081acc, transparent 30%, transparent 70%, #05081aee)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1900, perspectiveOrigin: '960px 280px'}}>
      <div style={{position: 'absolute', left: 960 - PW / 2, top: 640 - PH / 2, width: PW, height: PH, transformStyle: 'preserve-3d', opacity: intro, transform: `translateY(${150 * w}px) scale(${z}) rotateX(${tilt}deg) rotateZ(${rz}deg) translate(${PW / 2 - cx}px, ${PH / 2 - cy}px)`}}>
        <div style={{position: 'absolute', left: -B - 60, top: -B - 60, width: PW + 2 * B + 120, height: PH + 2 * B + 120, background: '#0e3a1c'}} />
        <Img src={staticFile('grass.jpg')} style={{position: 'absolute', left: -GM, top: -GM, width: PW + 2 * GM, height: PH + 2 * GM}} />
        <Goal phai={false} /><Goal phai />
        <Wall x={-B} y={-B} len={PW + 2 * B} ang={0} h={50} front={<LED len={PW + 2 * B} shift={led} />} />
        <Wall x={PW + B} y={-B} len={PH + 2 * B} ang={90} h={50} front={<LED len={PH + 2 * B} shift={led} />} />
        <Wall x={PW + B} y={PH + B} len={PW + 2 * B} ang={180} h={50} front={<LED len={PW + 2 * B} shift={led} />} />
        <Wall x={-B} y={PH + B} len={PH + 2 * B} ang={270} h={50} front={<LED len={PH + 2 * B} shift={led} />} />
        {nguoi(TA, 0)}
        {nguoi(TB, 1)}
      </div>
    </div>
    {/* đèn sân */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 12% -5%, #fff6d855, transparent 35%), radial-gradient(ellipse at 88% -5%, #fff6d855, transparent 35%), radial-gradient(ellipse at 50% 120%, #00000088, transparent 60%)', mixBlendMode: 'screen'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, #000a 100%)'}} />
    {tag && <div style={{position: 'absolute', bottom: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: tagO, transform: `translateY(${(1 - tagO) * 20}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '12px 36px 12px 18px', borderRadius: 14, background: '#05081ae8', borderBottom: `5px solid ${tag.t.color}`, boxShadow: '0 10px 30px #000a'}}>
        <Img src={staticFile(`logo_${tag.t.key}.png`)} style={{height: 70}} />
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 62, color: tag.t.color, lineHeight: 1}}>{tag.pl.so}</div>
        <div>
          <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 46, color: '#fff', lineHeight: 1.05}}>{tag.pl.name.toUpperCase()}</div>
          <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 19, color: '#cfd8ff', letterSpacing: '0.2em', marginTop: 4}}>{VT[tag.pl.pos || ''] || tag.pl.pos} · {tag.t.name}</div>
        </div>
      </div>
    </div>}
    <div style={{opacity: 1 - w}}>{dau(TA, false, 40)}{dau(TB, true, 82)}</div>
    <div style={{position: 'absolute', top: 44, left: 0, right: 0, opacity: 1 - w}}><Rise text="ĐỘI HÌNH RA SÂN" delay={10} size={52} spacing={0.12} glow="#46dcff" /></div>
  </AbsoluteFill>;
};

const Intro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const l = spring({frame: f, fps, config: {damping: 11, mass: 0.8}}), r = spring({frame: f - 5, fps, config: {damping: 11, mass: 0.8}});
  const vs = spring({frame: f - 30, fps, config: {damping: 7, stiffness: 220}});
  const shake = f > 30 && f < 42 ? Math.sin(f * 2.3) * (42 - f) * 1.4 : 0;
  return <AbsoluteFill style={{background: NAVY, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
    <AbsoluteFill style={{clipPath: 'polygon(0 0, 56% 0, 44% 100%, 0 100%)', background: `linear-gradient(135deg, ${TA.color}66, ${NAVY})`, transform: `translateX(${(l - 1) * 1920}px)`}} />
    <AbsoluteFill style={{clipPath: 'polygon(56% 0, 100% 0, 100% 100%, 44% 100%)', background: `linear-gradient(315deg, ${TB.color}66, ${NAVY})`, transform: `translateX(${(1 - r) * 1920}px)`}} />
    <Img src={staticFile(`logo_${TA.key}.png`)} style={{position: 'absolute', height: 470, left: 225, top: 290, transform: `translateX(${(l - 1) * 900}px)`}} />
    <Img src={staticFile(`logo_${TB.key}.png`)} style={{position: 'absolute', height: 470, right: 225, top: 290, transform: `translateX(${(1 - r) * 900}px)`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', transform: `scale(${3 - 2 * vs})`, opacity: Math.min(1, vs * 2), fontFamily: OSW, fontWeight: 700, fontSize: 240, color: '#fff', textShadow: '0 0 60px #46dcff'}}>VS</div>
    <div style={{position: 'absolute', top: 60, left: 0, right: 0}}><Rise text={(data as any).title || "TRẬN GIAO HỮU KHAI MẠC"} delay={8} size={48} color="#e6ecff" spacing={0.16} /></div>
    <div style={{position: 'absolute', bottom: 70, left: 0, right: 0}}><Rise text={data.date} delay={42} size={60} color={YEL} glow="#a06e00" /></div>
  </AbsoluteFill>;
};

const Outro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hit = 12, pre = interpolate(f, [0, hit], [0, 1], {extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)}), back = spring({frame: f - hit, fps, config: {damping: 9}});
  const lx = f < hit ? -400 + 1180 * pre : 780 - 320 * back, rx = f < hit ? 2320 - 1180 * pre : 1140 + 320 * back;
  const ring = interpolate(f - hit, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: `radial-gradient(circle, #3a2a80, ${NAVY} 65%)`}}>
    <Stars />
    {f > hit && <div style={{position: 'absolute', left: 960 - ring * 1300, top: 520 - ring * 1300, width: ring * 2600, height: ring * 2600, borderRadius: '50%', border: '14px solid #fff0c8', opacity: 1 - ring}} />}
    <Img src={staticFile(`logo_${TA.key}.png`)} style={{position: 'absolute', height: 470, left: lx - 235, top: 285}} />
    <Img src={staticFile(`logo_${TB.key}.png`)} style={{position: 'absolute', height: 470, left: rx - 235, top: 285}} />
    {f > hit + 4 && <div style={{position: 'absolute', top: 390, left: 0, right: 0, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 210, color: '#fff', textShadow: '0 0 60px #46dcff', transform: `scale(${1 + 0.04 * Math.sin(f / 5)})`}}>VS</div>}
    <div style={{position: 'absolute', top: 70, left: 0, right: 0}}><Rise text="ĐỪNG BỎ LỠ!" delay={hit + 16} size={88} glow="#ff7828" spacing={0.08} /></div>
    <div style={{position: 'absolute', bottom: 80, left: 0, right: 0}}><Rise text={data.date} delay={hit + 26} size={60} color={YEL} glow="#a06e00" /></div>
  </AbsoluteFill>;
};

// hạ nhạc nền khi có lời bình (vào/ra mềm 8 khung)
const nhacNen = (fr: number) => {
  let m = 0;
  for (const v of vo as {from: number; dur: number}[]) m = Math.max(m, interpolate(fr, [v.from - 8, v.from, v.from + v.dur, v.from + v.dur + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return 1 - 0.68 * m;
};

export const Fifa: React.FC = () => {
  const {durationInFrames} = useVideoConfig(); const f = useCurrentFrame();
  const tr = linearTiming({durationInFrames: FS.tr});
  return <AbsoluteFill style={{background: NAVY}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={FS.intro}><Intro /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.team}><TeamCarousel t={TA} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.team}><TeamCarousel t={TB} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.bench}><Bench /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: 'from-top'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.pitch}><Pitch3D /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flip({direction: 'from-bottom'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.outro}><Outro /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile('music_fifa2.mp3')} volume={(fr) => interpolate(fr, [0, 10, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * nhacNen(fr)} />
    {(vo as {src: string; from: number; dur: number}[]).map((v, i) => <Sequence key={'vo' + i} from={v.from} durationInFrames={v.dur + 2}><Audio src={staticFile(v.src)} volume={1.6} /></Sequence>)}
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], {extrapolateLeft: 'clamp'})}} />
  </AbsoluteFill>;
};

export const FS = {intro: 105, team: 30 + 20 + 6 * 54 + 40 + 20, bench: 230 + 14 * (TA.bench.length + TB.bench.length), pitch: PITCH_LEN, outro: 135, tr: 16};
export const FIFA_TOTAL = FS.intro + FS.team * 2 + FS.bench + FS.pitch + FS.outro - FS.tr * 5;
