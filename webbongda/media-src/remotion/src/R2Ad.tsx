import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

// Video RETRÔ II dựng từ cảnh quay gốc trên rhino-billiards.com; 2 phiên bản: Black Friday và Halloween
const CIN = 'CinzelR', OSW = 'OswaldR2';
const _h = delayRender('fonts-r2');
Promise.all([
  new FontFace(CIN, `url(${staticFile('r2/Cinzel600.woff2')})`, {weight: '600'}).load(),
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

type Bien = 'bf' | 'hl';
const MAU: Record<Bien, {nhan: string; chinh: string; ngay: string; cau: string; to: string}> = {
  bf: {nhan: 'BLACK FRIDAY', chinh: '#d9b46a', ngay: 'NOV 27 – NOV 30', cau: 'The deal of the season', to: 'transparent'},
  hl: {nhan: 'HALLOWEEN', chinh: '#f08a2c', ngay: 'OCTOBER 2026', cau: 'A treat for your game', to: 'rgba(255,110,20,.16)'},
};
type Clip = {src: string; t: number; d: number; chu?: string; chu2?: string};
const CLIPS: Clip[] = [
  {src: 'a', t: 2.0, d: 2.4},
  {src: 'a', t: 4.0, d: 3.0, chu: 'RETRÔ II', chu2: 'Timeless soul. Precision redefined.'},
  {src: 'a', t: 8.0, d: 2.4, chu2: 'Lizard-embossed cowhide leather wrap'},
  {src: 'p', t: 2.0, d: 2.8, chu2: 'Cocobolo  ·  Bocote  ·  Ebony'},
  {src: 'a', t: 11.0, d: 2.2},
  {src: 'a', t: 19.0, d: 1.2, chu2: 'Premium Japanese carbon fiber'},
  {src: 'a', t: 20.0, d: 2.4},
  {src: 'a', t: 22.2, d: 1.6},
  {src: 'a', t: 25.0, d: 2.0},
  {src: 'c', t: 9.0, d: 2.6, chu2: 'Ultra-low deflection. True aim.'},
  {src: 'a', t: 27.5, d: 2.2},
];
const FPS = 30, TR = 8, OFFER = 110, END = 95;
export const R2_TOTAL = CLIPS.reduce((s, c) => s + Math.round(c.d * FPS), 0) + OFFER + END - TR * (CLIPS.length + 1);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const hien = (f: number, d: number, len: number, a = 10) => interpolate(f, [d, d + a, len - 8, len], [0, 1, 1, 0], cl);

const ChuDuoi: React.FC<{len: number; chu?: string; chu2?: string; mau: string}> = ({len, chu, chu2, mau}) => {
  const f = useCurrentFrame(); const o = hien(f, 6, len, 12);
  return <div style={{position: 'absolute', left: 140, bottom: 150, opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
    {chu && <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 92, color: mau, letterSpacing: '0.06em', lineHeight: 1, textShadow: '0 4px 30px rgba(0,0,0,.8)'}}>{chu}</div>}
    {chu2 && <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: chu ? 18 : 0}}>
      <div style={{width: 46 * o, height: 2, background: mau}} />
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 34, color: '#f3ece0', letterSpacing: '0.08em', textShadow: '0 2px 20px rgba(0,0,0,.9)'}}>{chu2}</div>
    </div>}
  </div>;
};
const Canh: React.FC<{c: Clip; len: number; i: number; v: Bien}> = ({c, len, i, v}) => {
  const f = useCurrentFrame(); const m = MAU[v];
  const z = interpolate(f, [0, len], [1.0, 1.05]);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(`r2/r2_${c.src}.mp4`)} startFrom={Math.round(c.t * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    {i === 0 && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${0.45 * hien(f, 0, len, 6)})`}}>
      <div style={{opacity: hien(f, 8, len, 16), textAlign: 'center'}}>
        <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 130, letterSpacing: '0.16em', color: m.chinh, textShadow: '0 6px 40px rgba(0,0,0,.8)'}}>{m.nhan}</div>
        <div style={{width: 420, height: 2, background: m.chinh, margin: '22px auto 0', opacity: 0.8}} />
      </div>
    </AbsoluteFill>}
    <ChuDuoi len={len} chu={c.chu} chu2={c.chu2} mau={m.chinh} />
  </AbsoluteFill>;
};
const UuDai: React.FC<{v: Bien}> = ({v}) => {
  const f = useCurrentFrame(); const m = MAU[v];
  const a = hien(f, 4, OFFER, 14), b = hien(f, 16, OFFER, 14), c = hien(f, 30, OFFER, 14);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile('r2/r2_a.mp4')} startFrom={0} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(6px) brightness(.35)', transform: 'scale(1.08)'}} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center'}}>
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 40, letterSpacing: '0.4em', color: m.chinh, opacity: a}}>{m.nhan}</div>
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 120, color: '#f3ece0', letterSpacing: '0.05em', marginTop: 16, opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>RETRÔ II</div>
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 36, color: '#cfc6b6', letterSpacing: '0.12em', marginTop: 10, opacity: b}}>{m.cau}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 44, opacity: c}}>
        <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 30, letterSpacing: '0.24em', color: '#cfc6b6'}}>FROM</div>
        <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 112, color: m.chinh, lineHeight: 1}}>$529</div>
      </div>
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 32, letterSpacing: '0.3em', color: '#f3ece0', marginTop: 30, opacity: c, borderTop: `2px solid ${m.chinh}`, paddingTop: 18}}>{m.ngay}</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const Ket: React.FC<{v: Bien}> = ({v}) => {
  const f = useCurrentFrame(); const m = MAU[v]; const o = hien(f, 10, END + 30, 14);
  return <AbsoluteFill style={{background: '#000'}}>
    <OffthreadVideo src={staticFile('r2/r2_a.mp4')} startFrom={Math.round(35.8 * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: CIN, fontWeight: 600, fontSize: 30, letterSpacing: '0.34em', color: m.chinh}}>{m.nhan} · {m.ngay}</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 64, color: '#fff', marginTop: 10, letterSpacing: '0.03em'}}>rhino-billiards.com</div>
    </div>
  </AbsoluteFill>;
};
export const R2Ad: React.FC<{v: Bien}> = ({v}) => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig(); const m = MAU[v];
  const tr = linearTiming({durationInFrames: TR});
  const seq: React.ReactNode[] = [];
  CLIPS.forEach((c, i) => {
    const len = Math.round(c.d * FPS);
    if (i) seq.push(<TransitionSeries.Transition key={'t' + i} presentation={fade()} timing={tr} />);
    seq.push(<TransitionSeries.Sequence key={'c' + i} durationInFrames={len}><Canh c={c} len={len} i={i} v={v} /></TransitionSeries.Sequence>);
  });
  seq.push(<TransitionSeries.Transition key="to" presentation={fade()} timing={tr} />);
  seq.push(<TransitionSeries.Sequence key="o" durationInFrames={OFFER}><UuDai v={v} /></TransitionSeries.Sequence>);
  seq.push(<TransitionSeries.Transition key="te" presentation={fade()} timing={tr} />);
  seq.push(<TransitionSeries.Sequence key="e" durationInFrames={END}><Ket v={v} /></TransitionSeries.Sequence>);
  const logo = interpolate(f, [20, 40, D - 130, D - 110], [0, 0.9, 0.9, 0], cl);
  return <AbsoluteFill style={{background: '#000'}}>
    <TransitionSeries>{seq}</TransitionSeries>
    <AbsoluteFill style={{background: m.to, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: '#000'}} />
    <Img src={staticFile('rh/logo.png')} style={{position: 'absolute', right: 70, top: 92, width: 230, opacity: logo}} />
    <Audio src={staticFile('r2/r2_a.mp4')} volume={(fr) => interpolate(fr, [0, 10, D - 40, D], [0, 1, 1, 0], cl)} />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 8, D - 12, D], [1, 0, 0, 1], cl)}} />
  </AbsoluteFill>;
};
export const R2BF: React.FC = () => <R2Ad v="bf" />;
export const R2HL: React.FC = () => <R2Ad v="hl" />;
