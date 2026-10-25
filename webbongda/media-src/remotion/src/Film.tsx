import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {ParticleOverlay} from './om/ParticleOverlay';
import {TeamCarousel, Bench, Pitch3D, FS, OSW, VIE, YEL} from './Fifa';
import data from './fifa.json';

// Phim giới thiệu trận: thẻ tiêu đề Canva (mở + kết) + hiệu ứng OpenMontage + đội hình sân 3D
type T = {key: string; name: string; color: string};
const [TA, TB] = data.teams as T[];
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const CARD = staticFile('canva_matchday.png');
// tâm hai khiên trống trên thẻ Canva (toạ độ 1920×1080)
const KHIEN = [{x: 609, y: 452}, {x: 1309, y: 452}];

// lớp phim: hạt nhiễu, viền tối, chỉnh màu nhẹ
const LopPhim: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,60,90,.10), rgba(255,150,60,.08))', mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,.5) 100%)'}} />
    <svg width="1920" height="1080" style={{position: 'absolute', opacity: 0.09, mixBlendMode: 'overlay'}}>
      <filter id="hat"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} /></filter>
      <rect width="1920" height="1080" filter="url(#hat)" />
    </svg>
  </AbsoluteFill>;
};

// vạch phim trên/dưới
const KhungPhim: React.FC<{mo: number}> = ({mo}) => <>
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120 * mo, background: '#000'}} />
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 * mo, background: '#000'}} />
</>;

// logo đáp xuống khiên: phóng từ to về, loé sáng + vòng sóng
const LogoDap: React.FC<{t: T; at: number; x: number; y: number}> = ({t, at, x, y}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 160}});
  const sc = interpolate(s, [0, 1], [3.2, 1]);
  const flash = interpolate(f - at, [3, 6, 22], [0, 1, 0], cl);
  const ring = interpolate(f - at, [4, 30], [0, 1], cl);
  return <>
    <div style={{position: 'absolute', left: x - 380 * ring, top: y - 380 * ring, width: 760 * ring, height: 760 * ring, borderRadius: '50%', border: `${10 * (1 - ring) + 1}px solid ${t.color}`, opacity: 1 - ring, boxShadow: `0 0 40px ${t.color}`}} />
    <div style={{position: 'absolute', left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, #fff ${0}%, ${t.color}88 30%, transparent 65%)`, opacity: flash, mixBlendMode: 'screen'}} />
    <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', left: x - 150, top: y - 150, width: 300, height: 300, objectFit: 'contain', opacity: Math.min(1, s * 2), transform: `scale(${sc})`, filter: `drop-shadow(0 0 ${18 * flash + 6}px ${t.color}) drop-shadow(0 12px 18px #000c)`}} />
  </>;
};

// vệt sáng vàng quét chéo qua thẻ
const QuetSang: React.FC<{at: number; dur?: number}> = ({at, dur = 26}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [-0.3, 1.3], {...cl, easing: Easing.inOut(Easing.quad)});
  if (f < at || f > at + dur) return null;
  return <AbsoluteFill style={{background: `linear-gradient(105deg, transparent ${p * 100 - 12}%, rgba(255,230,160,.55) ${p * 100}%, transparent ${p * 100 + 12}%)`, mixBlendMode: 'screen'}} />;
};

const MO = 200;
const MoDau: React.FC = () => {
  const f = useCurrentFrame();
  // 0–24: tối, vệt loé ngang; 24–60: đèn sân chập chờn bật sáng, khe mở rộng; 60→: đẩy máy chậm
  const khe = interpolate(f, [14, 52], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const chap = f < 24 ? 0 : f < 60 ? [0.15, 0.7, 0.25, 0.9, 0.5, 1][Math.floor((f - 24) / 6)] : 1;
  const sang = interpolate(f, [24, 62], [0.25, 1], cl) * chap;
  const zoom = interpolate(f, [0, MO], [1.16, 1.0], {easing: Easing.out(Easing.quad)});
  const mo = interpolate(f, [14, 48], [8, 0], cl);
  const rung = (at: number) => f >= at && f < at + 10 ? (random(`r${f}`) - 0.5) * 18 * (1 - (f - at) / 10) : 0;
  const dx = rung(78) + rung(96), dy = rung(79) + rung(97);
  const veLoe = interpolate(f, [2, 22], [-0.2, 1.2], cl);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <AbsoluteFill style={{clipPath: `inset(${50 - 50 * khe}% 0 ${50 - 50 * khe}% 0)`, transform: `translate(${dx}px, ${dy}px) scale(${zoom})`}}>
      <Img src={CARD} style={{width: 1920, height: 1080, filter: `brightness(${sang}) blur(${mo}px) contrast(1.06) saturate(1.1)`}} />
      <LogoDap t={TA} at={78} {...KHIEN[0]} />
      <LogoDap t={TB} at={96} {...KHIEN[1]} />
      <QuetSang at={128} />
      <ParticleOverlay type="sparkles" count={40} color="#ffd88a" intensity={0.8} />
    </AbsoluteFill>
    {f < 26 && <div style={{position: 'absolute', top: 538, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent ${veLoe * 100 - 30}%, #fff ${veLoe * 100}%, transparent ${veLoe * 100 + 30}%)`, boxShadow: '0 0 40px 10px #9fd0ff66'}} />}
    <ParticleOverlay type="mist" count={18} color="#9fc2ff" intensity={0.45} />
    <KhungPhim mo={interpolate(f, [40, 90], [1, 0], cl)} />
  </AbsoluteFill>;
};

const KET = 210;
const Ket: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, KET], [1.0, 1.06]);
  const den = interpolate(f, [KET - 70, KET - 40], [0, 1], cl);
  const logo = interpolate(f, [KET - 36, KET - 16], [0, 1], cl);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <Img src={CARD} style={{width: 1920, height: 1080, filter: 'contrast(1.06) saturate(1.1)'}} />
      {[TA, TB].map((t, i) => <Img key={i} src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', left: KHIEN[i].x - 150, top: KHIEN[i].y - 150, width: 300, height: 300, objectFit: 'contain', transform: `scale(${1 + 0.03 * Math.sin(f / 8 + i * 2)})`, filter: `drop-shadow(0 0 ${14 + 8 * Math.sin(f / 8 + i * 2)}px ${t.color}) drop-shadow(0 12px 18px #000c)`}} />)}
      <QuetSang at={10} dur={30} />
      <ParticleOverlay type="light-rays" count={6} color="#ffe6a8" intensity={0.5} />
      <ParticleOverlay type="sparkles" count={36} color="#ffd88a" intensity={0.8} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: '#000', opacity: den}} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: logo * (1 - interpolate(f, [KET - 8, KET], [0, 1], cl))}}>
      <Img src={staticFile('rh/logo.png')} style={{width: 420}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 30, letterSpacing: '0.3em', color: '#cfc6b6', marginTop: 26}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ RHINO BILLIARDS 2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, letterSpacing: '0.4em', color: YEL, marginTop: 18}}>HẸN GẶP TẠI SÂN · 15:00 · 20/10</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// thẻ chương giữa các phần, kiểu phim tài liệu
const Chuong: React.FC<{so: string; ten: string; mau: string}> = ({so, ten, mau}) => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  const o = interpolate(f, [4, 16, D - 10, D], [0, 1, 1, 0], cl);
  const w = interpolate(f, [4, 26], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
    <ParticleOverlay type="mist" count={14} color={mau} intensity={0.5} />
    <div style={{opacity: o, textAlign: 'center'}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 30, color: mau, letterSpacing: '0.5em'}}>{so}</div>
      <div style={{width: 520 * w, height: 2, background: mau, margin: '18px auto'}} />
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 76, color: '#fff', letterSpacing: '0.12em'}}>{ten}</div>
    </div>
  </AbsoluteFill>;
};

const CH = 54, TR = FS.tr;
export const FILM_TOTAL = MO + CH + FS.team * 2 + CH + FS.bench + FS.pitch + KET - TR * 6;
export const Film: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  const tr = linearTiming({durationInFrames: TR});
  return <AbsoluteFill style={{background: '#000'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={MO}><MoDau /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={CH}><Chuong so="PHẦN I" ten="ĐỘI HÌNH XUẤT PHÁT" mau={YEL} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.team}><TeamCarousel t={TA as any} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.team}><TeamCarousel t={TB as any} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={CH}><Chuong so="PHẦN II" ten="DỰ BỊ & SƠ ĐỒ" mau="#7fd1ff" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.bench}><Bench /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: 'from-top'})} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.pitch}><Pitch3D /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={KET}><Ket /></TransitionSeries.Sequence>
    </TransitionSeries>
    <LopPhim />
    <Audio src={staticFile('film_music.mp3')} volume={(fr) => interpolate(fr, [0, 20, D - 60, D], [0, 1, 1, 0], cl)} />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [D - 10, D], [0, 1], cl)}} />
  </AbsoluteFill>;
};

// bản ngắn: mở Canva → sân 3D (đội hình 2 đội) → kết
export const FILM_NGAN_TOTAL = MO + FS.pitch + KET - TR * 2;
export const FilmNgan: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  const tr = linearTiming({durationInFrames: TR});
  return <AbsoluteFill style={{background: '#000'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={MO}><MoDau /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={FS.pitch}><Pitch3D /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={tr} />
      <TransitionSeries.Sequence durationInFrames={KET}><Ket /></TransitionSeries.Sequence>
    </TransitionSeries>
    <LopPhim />
    <Audio src={staticFile('film_music.mp3')} volume={(fr) => interpolate(fr, [0, 20, D - 60, D], [0, 1, 1, 0], cl)} />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [D - 10, D], [0, 1], cl)}} />
  </AbsoluteFill>;
};
