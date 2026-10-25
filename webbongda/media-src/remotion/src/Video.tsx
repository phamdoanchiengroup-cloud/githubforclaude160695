import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {slide} from '@remotion/transitions/slide';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {flip} from '@remotion/transitions/flip';
import {continueRender, delayRender} from 'remotion';
import data from './data.json';

const OSW = 'OswaldLocal';
const VIE = 'VietLocal';
const _h = delayRender('fonts');
Promise.all([
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
  new FontFace(VIE, `url(${staticFile('BeVietnamPro-800.ttf')})`, {weight: '800'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

const NAVY = '#070c22';
const YEL = '#ffde46';
const [TA, TB] = data.teams;

export const SCENES = {intro: 110, team: 190, pitch: 270, outro: 160, tr: 20};
export const TOTAL = SCENES.intro + SCENES.team * 2 + SCENES.pitch + SCENES.outro - SCENES.tr * 4;

const Bg: React.FC<{color: string}> = ({color}) => {
  const f = useCurrentFrame();
  const beat = (f % 14) / 14;
  const pulse = 0.55 + 0.45 * Math.exp(-beat * 5);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${color}55 0%, ${NAVY} 60%)`}}>
      <AbsoluteFill style={{opacity: pulse * 0.6, background: `repeating-conic-gradient(from ${f * 0.4}deg at 50% 52%, ${color}22 0deg 5deg, transparent 5deg 15deg)`}} />
      {new Array(60).fill(0).map((_, i) => {
        const x = random('x' + i) * 1920;
        const sp = 20 + random('s' + i) * 70;
        const y = (random('y' + i) * 1080 - f * sp / 30 + 2160) % 1080;
        const s = 2 + random('r' + i) * 4;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: '#cfe0ff', opacity: 0.25 + 0.6 * Math.abs(Math.sin(f / 10 + i))}} />;
      })}
    </AbsoluteFill>
  );
};

// Chữ hiện từng ký tự (kiểu "Typewriter / Rise" của Canva)
const RiseText: React.FC<{text: string; delay?: number; size: number; color?: string; font?: string; spacing?: number; glow?: string}> = ({text, delay = 0, size, color = '#fff', font = VIE, spacing = 0.06, glow}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', justifyContent: 'center', fontFamily: font, fontWeight: 800, fontSize: size, color, letterSpacing: `${spacing}em`, textShadow: glow ? `0 0 ${size * 0.35}px ${glow}` : undefined, whiteSpace: 'pre'}}>
      {[...text].map((ch, i) => {
        const s = spring({frame: f - delay - i * 1.2, fps, config: {damping: 12, stiffness: 160}});
        return <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`}}>{ch}</span>;
      })}
    </div>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l = spring({frame: f, fps, config: {damping: 11, mass: 0.8}});
  const r = spring({frame: f - 5, fps, config: {damping: 11, mass: 0.8}});
  const vs = spring({frame: f - 32, fps, config: {damping: 7, stiffness: 220}});
  const shake = f > 32 && f < 44 ? Math.sin(f * 2.3) * (44 - f) * 1.4 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <AbsoluteFill style={{clipPath: 'polygon(0 0, 56% 0, 44% 100%, 0 100%)', background: `linear-gradient(135deg, ${TA.color}66, ${NAVY})`, transform: `translateX(${(l - 1) * 1920}px)`}} />
      <AbsoluteFill style={{clipPath: 'polygon(56% 0, 100% 0, 100% 100%, 44% 100%)', background: `linear-gradient(315deg, ${TB.color}66, ${NAVY})`, transform: `translateX(${(1 - r) * 1920}px)`}} />
      <Img src={staticFile(`logo_${TA.key}.png`)} style={{position: 'absolute', height: 470, left: 460 - 235, top: 290, transform: `translateX(${(l - 1) * 900}px) rotate(${(1 - l) * -30}deg)`, filter: 'drop-shadow(0 20px 40px #0009)'}} />
      <Img src={staticFile(`logo_${TB.key}.png`)} style={{position: 'absolute', height: 470, right: 460 - 235, top: 290, transform: `translateX(${(1 - r) * 900}px) rotate(${(1 - r) * 30}deg)`, filter: 'drop-shadow(0 20px 40px #0009)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${3 - 2 * vs})`, opacity: Math.min(1, vs * 2)}}>
        <span style={{fontFamily: OSW, fontWeight: 700, fontSize: 240, color: '#fff', textShadow: '0 0 60px #46dcff'}}>VS</span>
      </div>
      <div style={{position: 'absolute', top: 60, left: 0, right: 0}}><RiseText text={`VÒNG TRÒN · LƯỢT ${data.luot}`} delay={10} size={48} color="#e6ecff" spacing={0.18} /></div>
      <div style={{position: 'absolute', bottom: 70, left: 0, right: 0}}><RiseText text={data.date} delay={45} size={60} color={YEL} glow="#a06e00" /></div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{src: string; back: string; delay: number; x: number; y: number}> = ({src, back, delay, x, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: f - delay, fps, config: {damping: 13}});
  const flipS = spring({frame: f - delay - 22, fps, config: {damping: 14, stiffness: 110}});
  const rot = interpolate(flipS, [0, 1], [180, 0]);
  const shine = interpolate(f - delay - 40, [0, 25], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lift = Math.sin(Math.min(1, Math.max(0, flipS)) * Math.PI) * 30;
  const face = (s: string, isBack: boolean): React.CSSProperties => ({position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: isBack ? 'rotateY(180deg)' : undefined});
  return (
    <div style={{position: 'absolute', left: x - 140, top: y - 194 + (1 - enter) * 900 - lift, width: 280, height: 388, perspective: 1200, opacity: enter}}>
      <div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${rot}deg) scale(${1 + lift / 200})`}}>
        <div style={face(src, false)}>
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 18px 24px #000a)'}} />
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden', WebkitMaskImage: `url(${staticFile(src)})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'}}>
            <div style={{position: 'absolute', top: '-20%', bottom: '-20%', width: '35%', left: `${shine}%`, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, transparent, #ffffff88, transparent)'}} />
          </div>
        </div>
        <div style={face(back, true)}><Img src={staticFile(back)} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>
      </div>
    </div>
  );
};

const Team: React.FC<{t: typeof TA}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = spring({frame: f, fps, config: {damping: 14}});
  const slots = [0, 1, 2, 3, 4, 5, 6].map((i) => (i < 4 ? {x: 960 + (i - 1.5) * 310, y: 430} : {x: 960 + (i - 5) * 310, y: 840}));
  return (
    <AbsoluteFill>
      <Bg color={t.color} />
      <div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, opacity: h, transform: `translateY(${(1 - h) * -60}px)`}}>
        <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 96}} />
        <span style={{fontFamily: OSW, fontWeight: 700, fontSize: 76, color: '#fff', letterSpacing: '0.05em'}}>{t.name}</span>
      </div>
      <div style={{position: 'absolute', top: 160, left: 0, right: 0}}><RiseText text={`ĐỘI HÌNH XUẤT PHÁT · ${t.sodo}`} delay={8} size={38} color="#e6ecff" spacing={0.16} /></div>
      {t.players.map((p, i) => <Card key={i} src={p.img} back={`back_${t.key}.png`} delay={12 + i * 9} x={slots[i].x} y={slots[i].y} />)}
    </AbsoluteFill>
  );
};

const Pitch: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // ảnh đội hình (3580x2492) – máy quay kiểu "Pan & Zoom": toàn cảnh → nửa trái → nửa phải → toàn cảnh
  const IW = 1552, IH = 1080;
  const k = [0, 35, 65, 125, 150, 210, 238, 270];
  const z = interpolate(f, k, [0.94, 1, 1.3, 1.34, 1.3, 1.34, 1, 1.02], {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  const cx = interpolate(f, k, [0.5, 0.5, 0.33, 0.33, 0.67, 0.67, 0.5, 0.5], {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  const cy = interpolate(f, k, [0.5, 0.5, 0.55, 0.55, 0.55, 0.55, 0.5, 0.5], {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  const tx = 960 - cx * IW * z, ty = 540 - cy * IH * z;
  const intro = spring({frame: f, fps, config: {damping: 16}});
  const chip = (t: typeof TA, a: number, b: number) => {
    const s = spring({frame: f - a, fps, config: {damping: 14}}) * interpolate(f, [b - 10, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return <div style={{position: 'absolute', bottom: 50, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
      <span style={{fontFamily: OSW, fontWeight: 700, fontSize: 56, color: '#fff', padding: '10px 36px', borderRadius: 14, background: '#070c22dd', border: `3px solid ${t.color}`}}>{t.name} · {t.sodo}</span>
    </div>;
  };
  const shine = interpolate(f, [8, 40], [-30, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: NAVY, overflow: 'hidden'}}>
      <Img src={staticFile('lineup.jpg')} style={{position: 'absolute', inset: -60, width: 2040, height: 1200, objectFit: 'cover', filter: 'blur(28px) brightness(0.45)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: IW, height: IH, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})`, opacity: intro}}>
        <Img src={staticFile('lineup.jpg')} style={{width: IW, height: IH, boxShadow: '0 0 80px #000'}} />
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: '-20%', bottom: '-20%', width: '18%', left: `${shine}%`, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, transparent, #ffffff40, transparent)'}} />
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, #000a 100%)'}} />
      {chip(TA, 55, 132)}
      {chip(TB, 140, 215)}
      {f > 226 && <div style={{position: 'absolute', bottom: 40, left: 0, right: 0}}><RiseText text="ĐỘI HÌNH RA SÂN" delay={226} size={60} spacing={0.12} glow="#46dcff" /></div>}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = 12;
  const pre = interpolate(f, [0, hit], [0, 1], {extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const back = spring({frame: f - hit, fps, config: {damping: 9}});
  const lx = f < hit ? -400 + (960 - 180 + 400) * pre : (960 - 180) + (460 - 780) * back;
  const rx = f < hit ? 1920 + 400 - (1920 + 400 - 960 - 180) * pre : (960 + 180) + (1460 - 1140) * back;
  const ring = interpolate(f - hit, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const breathe = 1 + 0.04 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Bg color="#7a5ad0" />
      {f > hit && <div style={{position: 'absolute', left: 960 - ring * 1300, top: 520 - ring * 1300, width: ring * 2600, height: ring * 2600, borderRadius: '50%', border: '14px solid #fff0c8', opacity: 1 - ring}} />}
      {f > hit && new Array(120).fill(0).map((_, i) => {
        const a = random('a' + i) * Math.PI * 2, sp = 400 + random('v' + i) * 900, v = Math.min(1, (f - hit) / 45);
        const x = 960 + Math.cos(a) * sp * Easing.out(Easing.cubic)(v), y = 520 + Math.sin(a) * sp * Easing.out(Easing.cubic)(v) + 300 * v * v;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: 5, background: i % 2 ? TA.color : TB.color, opacity: 1 - v}} />;
      })}
      <Img src={staticFile(`logo_${TA.key}.png`)} style={{position: 'absolute', height: 470, left: lx - 235, top: 285}} />
      <Img src={staticFile(`logo_${TB.key}.png`)} style={{position: 'absolute', height: 470, left: rx - 235, top: 285}} />
      {f > hit + 4 && <div style={{position: 'absolute', top: 390, left: 0, right: 0, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 210, color: '#fff', textShadow: '0 0 60px #46dcff', transform: `scale(${breathe})`}}>VS</div>}
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, transform: `scale(${breathe})`}}><RiseText text="ĐỪNG BỎ LỠ!" delay={hit + 16} size={88} glow="#ff7828" spacing={0.08} /></div>
      <div style={{position: 'absolute', bottom: 80, left: 0, right: 0}}><RiseText text={data.date} delay={hit + 26} size={60} color={YEL} glow="#a06e00" /></div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], {extrapolateLeft: 'clamp'});
  const tr = linearTiming({durationInFrames: SCENES.tr});
  return (
    <AbsoluteFill style={{background: NAVY}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.intro}><Bg color="#5a6ad0" /><Intro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={SCENES.team}><Team t={TA} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={springTiming({config: {damping: 200}, durationInFrames: SCENES.tr})} />
        <TransitionSeries.Sequence durationInFrames={SCENES.team}><Team t={TB} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={clockWipe({width: 1920, height: 1080})} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={SCENES.pitch}><Pitch /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({direction: 'from-bottom'})} timing={tr} />
        <TransitionSeries.Sequence durationInFrames={SCENES.outro}><Outro /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio src={staticFile('nhac.wav')} />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
