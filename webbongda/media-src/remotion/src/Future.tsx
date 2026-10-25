import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {OSW, VIE} from './Fifa';
import data from './fifa_giaohuu.json';
import blv from './blv.json';
import blv2 from './blv2.json';

// Giới thiệu trận giao hữu – phong cách thực tế + tương lai (HUD, hologram, sân 3D ban đêm)
type P = {img: string; name: string; rating: number; so: string; pos?: string};
type T = {key: string; name: string; color: string; sodo: string; xi: P[]; bench: P[]};
const [TA, TB] = data.teams as T[];
export const CY = '#5ff2ff';
export const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const VT: Record<string, string> = {GK: 'THỦ MÔN', LB: 'HẬU VỆ TRÁI', RB: 'HẬU VỆ PHẢI', CB: 'TRUNG VỆ', CDM: 'TIỀN VỆ PHÒNG NGỰ', CM: 'TIỀN VỆ TRUNG TÂM', LM: 'TIỀN VỆ TRÁI', RM: 'TIỀN VỆ PHẢI', ST: 'TIỀN ĐẠO', LS: 'TIỀN ĐẠO TRÁI', RS: 'TIỀN ĐẠO PHẢI'};
const VITRI: Record<string, Record<string, [number, number]>> = {
  '2-1-2-1': {GK: [0.05, 0.5], LB: [0.17, 0.22], RB: [0.17, 0.78], CDM: [0.25, 0.5], LM: [0.35, 0.16], RM: [0.35, 0.84], ST: [0.43, 0.5]},
  '3-1-2': {GK: [0.05, 0.5], LB: [0.16, 0.2], CB: [0.17, 0.5], RB: [0.16, 0.8], CM: [0.28, 0.5], LS: [0.4, 0.28], RS: [0.4, 0.72]},
};
export const MONO = 'DejaVu Sans Mono, monospace';

// ---------- lớp HUD dùng chung ----------
export const Scanlines: React.FC<{o?: number}> = ({o = 0.12}) => <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0 2px, transparent 2px 4px)', opacity: o, pointerEvents: 'none'}} />;
export const Goc: React.FC<{mau?: string}> = ({mau = CY}) => {
  const s = {position: 'absolute' as const, width: 70, height: 70, borderColor: mau, borderStyle: 'solid', opacity: 0.8};
  return <>
    <div style={{...s, left: 40, top: 40, borderWidth: '3px 0 0 3px'}} /><div style={{...s, right: 40, top: 40, borderWidth: '3px 3px 0 0'}} />
    <div style={{...s, left: 40, bottom: 40, borderWidth: '0 0 3px 3px'}} /><div style={{...s, right: 40, bottom: 40, borderWidth: '0 3px 3px 0'}} />
  </>;
};
export const Telemetry: React.FC<{mau?: string}> = ({mau = CY}) => {
  const f = useCurrentFrame();
  const t = (f / 30).toFixed(2).padStart(6, '0');
  return <>
    <div style={{position: 'absolute', left: 130, top: 52, fontFamily: MONO, fontSize: 18, color: mau, opacity: 0.75, letterSpacing: '0.12em'}}>RB-26 // MATCH-SYS · T+{t}</div>
    <div style={{position: 'absolute', right: 130, bottom: 52, fontFamily: MONO, fontSize: 18, color: mau, opacity: 0.75, letterSpacing: '0.12em'}}>21.0278°N 105.8342°E · REC ●</div>
  </>;
};
// chữ gõ dần
export const Go: React.FC<{text: string; at: number; tocDo?: number; style?: React.CSSProperties}> = ({text, at, tocDo = 1.4, style}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - at) * tocDo));
  if (f < at) return null;
  return <span style={style}>{text.slice(0, n)}{n < text.length && f % 8 < 4 ? '▌' : ''}</span>;
};
// chớp nhiễu khi cắt cảnh
export const Glitch: React.FC<{at: number; dur?: number}> = ({at, dur = 8}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const k = f - at;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    {Array.from({length: 7}, (_, i) => {
      const y = random(`gy${i}${k}`) * 1080, h = 6 + random(`gh${i}${k}`) * 60;
      return <div key={i} style={{position: 'absolute', left: (random(`gx${i}${k}`) - 0.5) * 120, top: y, width: 1920, height: h, background: i % 2 ? `${CY}55` : 'rgba(255,60,120,.35)', mixBlendMode: 'screen'}} />;
    })}
    <AbsoluteFill style={{background: '#fff', opacity: interpolate(k, [0, 2, dur], [0.5, 0.2, 0], cl)}} />
  </AbsoluteFill>;
};

// ---------- sân 3D ban đêm ----------
const PW = 1800, PH = 1050;
const MatSan: React.FC = () => <>
  <Img src={staticFile('grass.jpg')} style={{position: 'absolute', inset: 0, width: PW, height: PH, objectFit: 'cover', filter: 'brightness(.62) saturate(.95) contrast(1.08)'}} />
  <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
    <g fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={5}>
      <rect x={6} y={6} width={PW - 12} height={PH - 12} /><line x1={PW / 2} y1={0} x2={PW / 2} y2={PH} /><circle cx={PW / 2} cy={PH / 2} r={130} />
      <rect x={6} y={PH / 2 - 230} width={210} height={460} /><rect x={PW - 216} y={PH / 2 - 230} width={210} height={460} />
    </g>
  </svg>
  {/* quầng đèn sân rọi xuống */}
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 50% at 25% 30%, rgba(255,255,240,.18), transparent 70%), radial-gradient(ellipse 40% 50% at 75% 70%, rgba(255,255,240,.18), transparent 70%)'}} />
  {/* lưới hologram phủ mặt sân */}
  <div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, ${CY}22 0 2px, transparent 2px 75px), repeating-linear-gradient(90deg, ${CY}22 0 2px, transparent 2px 75px)`}} />
</>;
const San3D: React.FC<{tilt: number; rz: number; z: number; ty?: number; children?: React.ReactNode}> = ({tilt, rz, z, ty = 0, children}) =>
  <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 30%'}}>
    <div style={{position: 'absolute', left: 960 - PW / 2, top: 600 - PH / 2, width: PW, height: PH, transformStyle: 'preserve-3d', transform: `translateY(${ty}px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${z}, ${z}, ${z})`}}>
      <MatSan />
      {children}
    </div>
  </AbsoluteFill>;
export const BauTroi: React.FC = () => {
  const f = useCurrentFrame();
  return <>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', left: -60, top: -40, width: 2040, height: 760, objectFit: 'cover', filter: 'brightness(.42) saturate(1.1) blur(1.5px)', transform: `translateX(${-f * 0.15}px)`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,6,18,.55), rgba(2,6,18,.1) 40%, rgba(2,6,18,.9) 75%)'}} />
    {/* cột sáng đèn pha */}
    {[260, 1660].map((x, i) => <div key={i} style={{position: 'absolute', left: x - 260, top: -80, width: 520, height: 900, background: 'linear-gradient(180deg, rgba(220,240,255,.35), transparent 75%)', clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)', opacity: 0.55 + 0.1 * Math.sin(f / 9 + i), mixBlendMode: 'screen'}} />)}
  </>;
};

// ---------- 1. Khởi động hệ thống ----------
const KD = 2.4;   // hệ số làm chậm màn khởi động
const BOOT = 330;
const KhoiDong: React.FC = () => {
  const f = useCurrentFrame() / KD; const {fps} = useVideoConfig();
  const ring = interpolate(f, [10, 60], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const quet = interpolate(f, [55, 95], [0, 1], cl);
  const logo = (t: T, x: number, at: number) => {
    const p = interpolate(f, [at, at + 30], [0, 1], cl);
    return <div style={{position: 'absolute', left: x - 170, top: 360, width: 340, height: 360}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', inset: 0, width: 340, height: 360, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.1) drop-shadow(0 0 18px ${CY})`, opacity: 0.55 * Math.min(1, p * 3)}} />
      <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', inset: 0, width: 340, height: 360, objectFit: 'contain', clipPath: `inset(${100 - p * 100}% 0 0 0)`}} />
      {p > 0 && p < 1 && <div style={{position: 'absolute', left: -30, right: -30, top: `${(1 - p) * 100}%`, height: 3, background: CY, boxShadow: `0 0 20px 4px ${CY}`}} />}
      <div style={{position: 'absolute', top: 375, left: -60, right: -60, textAlign: 'center', fontFamily: MONO, fontSize: 20, color: CY, letterSpacing: '0.2em', opacity: p}}>ID ✓ {t.name}</div>
    </div>;
  };
  return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #071a2c, #01040b 70%)', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${CY}10 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, ${CY}10 0 1px, transparent 1px 60px)`, opacity: ring}} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(960 540) rotate(${f * 1.2})`} fill="none" stroke={CY} opacity={0.6}>
        <circle r={420 * ring} strokeWidth={2} strokeDasharray="6 14" />
        <circle r={340 * ring} strokeWidth={1} />
        <path d={`M ${300 * ring} 0 A ${300 * ring} ${300 * ring} 0 0 1 0 ${300 * ring}`} strokeWidth={6} />
      </g>
    </svg>
    {logo(TA, 640, 50)}
    {logo(TB, 1280, 64)}
    <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 120, color: '#fff', opacity: interpolate(f, [86, 96], [0, 1], cl), textShadow: `0 0 40px ${CY}`}}>VS</div>
    <div style={{position: 'absolute', left: 130, top: 130, fontFamily: MONO, fontSize: 24, color: CY, lineHeight: 1.7}}>
      <div><Go text="> KHỞI ĐỘNG RB-26 MATCH SYSTEM ..." at={2 * KD} tocDo={1.4 / KD} /></div>
      <div><Go text="> TẢI DỮ LIỆU GIẢI ĐẤU ......... OK" at={22 * KD} tocDo={1.4 / KD} /></div>
      <div><Go text="> NHẬN DIỆN ĐỘI BÓNG ........... 2/2" at={44 * KD} tocDo={1.4 / KD} /></div>
      <div style={{color: '#ffd36a'}}><Go text="> TRẬN GIAO HỮU KHAI MẠC" at={70 * KD} tocDo={1.4 / KD} /></div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: MONO, fontSize: 20, color: CY, opacity: quet}}>ĐANG TẢI DỮ LIỆU ĐỘI HÌNH {'▮'.repeat(Math.floor(quet * 20))}</div>
    <Goc /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 2. Bay vào sân ----------
const FLY = 190;
const BayVaoSan: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const e = Easing.inOut(Easing.cubic);
  const tilt = interpolate(f, [0, FLY], [80, 60], {easing: e});
  const z = interpolate(f, [0, FLY], [0.7, 1.15], {easing: e});
  const rz = interpolate(f, [0, FLY], [-14, 4], {easing: e});
  const ty = interpolate(f, [0, FLY], [260, 40], {easing: e});
  const tt = spring({frame: f - 45, fps, config: {damping: 18}});
  const nhay = f > 45 && f < 70 ? (random(`fl${f}`) > 0.35 ? 1 : 0.3) : 1;
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <BauTroi />
    <San3D tilt={tilt} rz={rz} z={z} ty={ty} />
    {/* tiêu đề hologram lơ lửng giữa sân */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: tt * nhay, transform: `translateY(${(1 - tt) * 40}px) perspective(800px) rotateX(${(1 - tt) * 30}deg)`}}>
      <div style={{fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.5em'}}>RHINO BILLIARDS · 2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 92, color: '#e9fdff', letterSpacing: '0.04em', marginTop: 12, textShadow: `0 0 18px ${CY}, 0 0 50px ${CY}88`}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
      <div style={{width: 760 * tt, height: 2, background: `linear-gradient(90deg, transparent, ${CY}, transparent)`, margin: '18px auto'}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 54, color: '#ffd36a', letterSpacing: '0.18em', textShadow: '0 0 20px #ffb40088'}}>TRẬN GIAO HỮU KHAI MẠC</div>
    </div>
    <Goc /><Telemetry /><Scanlines o={0.08} />
  </AbsoluteFill>;
};

// ---------- 3–4. Quét từng cầu thủ ----------
const STEPP = 105, HEADP = 140;
export const SQ = HEADP + 7 * STEPP + 16;
const ViTriMini: React.FC<{t: T; k: number}> = ({t, k}) => {
  const W = 300, H = 190;
  return <div style={{position: 'relative', width: W, height: H, border: `1px solid ${CY}66`, background: 'rgba(0,30,40,.35)'}}>
    <div style={{position: 'absolute', left: W / 2, top: 0, bottom: 0, width: 1, background: `${CY}44`}} />
    <div style={{position: 'absolute', left: W / 2 - 30, top: H / 2 - 30, width: 60, height: 60, borderRadius: '50%', border: `1px solid ${CY}44`}} />
    {t.xi.map((pl, i) => {
      const [vx, vy] = VITRI[t.sodo]?.[pl.pos || ''] || [0.1, 0.5];
      const on = i === k;
      return <div key={i} style={{position: 'absolute', left: vx * 2 * W - (on ? 9 : 5), top: vy * H - (on ? 9 : 5), width: on ? 18 : 10, height: on ? 18 : 10, borderRadius: '50%', background: on ? t.color : `${CY}88`, boxShadow: on ? `0 0 16px ${t.color}` : undefined}} />;
    })}
  </div>;
};
const QuetDoi: React.FC<{t: T}> = ({t}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const g = f - HEADP, k = Math.max(0, Math.min(6, Math.floor(g / STEPP))), r = g - k * STEPP;
  const pl = t.xi[k];
  const hien = g < 0 ? 0 : interpolate(r, [0, 16], [0, 1], cl);   // quét hiện
  const tan = g < 0 ? 0 : interpolate(r, [STEPP - 7, STEPP], [0, 1], cl);   // tan đi
  const h = spring({frame: f, fps, config: {damping: 16}});
  const diem = Math.round(pl.rating * interpolate(r, [6, 26], [0, 1], cl));
  const jit = tan > 0 ? (random(`j${f}`) - 0.5) * 40 * tan : 0;
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: 'brightness(.3) blur(6px) saturate(1.2)', transform: `scale(${1.05 + f * 0.0004})`}} />
    {/* sàn lưới phối cảnh */}
    <AbsoluteFill style={{perspective: 900}}>
      <div style={{position: 'absolute', left: -600, right: -600, top: 640, height: 900, transform: 'rotateX(72deg)', transformOrigin: 'top', background: `repeating-linear-gradient(0deg, ${CY}33 0 2px, transparent 2px 70px), repeating-linear-gradient(90deg, ${CY}33 0 2px, transparent 2px 70px)`, backgroundPositionY: `${f * 3}px`, maskImage: 'linear-gradient(180deg, #000, transparent 80%)'}} />
    </AbsoluteFill>
    {/* bệ quét */}
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g transform="translate(560 905) scale(1 .28)" fill="none">
        <circle r={300} stroke={t.color} strokeWidth={6} opacity={0.8} />
        <circle r={250} stroke={CY} strokeWidth={3} strokeDasharray="20 16" transform={`rotate(${f * 2})`} />
        <circle r={340} stroke={CY} strokeWidth={2} opacity={0.4} strokeDasharray="4 10" transform={`rotate(${-f})`} />
      </g>
    </svg>
    <div style={{position: 'absolute', left: 560 - 300, top: 120, width: 600, height: 790, background: `linear-gradient(0deg, ${t.color}40, transparent 80%)`, clipPath: 'polygon(0 100%, 100% 100%, 82% 0, 18% 0)', opacity: 0.6 * hien * (1 - tan)}} />
    {/* trước khi quét: logo đội dạng hologram trên bệ */}
    {g < 0 && <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', left: 560 - 230, top: 300, width: 460, height: 500, objectFit: 'contain', opacity: interpolate(f, [8, 30, HEADP - 10, HEADP], [0, 0.9, 0.9, 0], cl), filter: `drop-shadow(0 0 30px ${t.color})`, transform: `translateY(${Math.sin(f / 12) * 10}px) rotateY(${Math.sin(f / 30) * 12}deg)`}} />}
    {/* thẻ cầu thủ: lớp hologram + lớp thật lộ dần theo vạch quét */}
    <div style={{position: 'absolute', left: 560 - 230 + jit, top: 210, width: 460, height: 640, opacity: 1 - tan}}>
      <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: 460, height: 640, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.15) drop-shadow(0 0 22px ${CY})`, opacity: 0.6 * Math.min(1, hien * 4), clipPath: `inset(0 0 ${100 - Math.min(1, hien * 1.6) * 100}% 0)`}} />
      <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: 460, height: 640, objectFit: 'contain', clipPath: `inset(0 0 ${100 - hien * 100}% 0)`, filter: `drop-shadow(0 0 26px ${t.color}aa)`}} />
      {hien > 0 && hien < 1 && <div style={{position: 'absolute', left: -40, right: -40, top: `${hien * 100}%`, height: 4, background: CY, boxShadow: `0 0 26px 6px ${CY}`}} />}
    </div>
    {/* đầu cảnh */}
    <div style={{position: 'absolute', left: 130, top: 90, display: 'flex', alignItems: 'center', gap: 22, opacity: h}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 96}} />
      <div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 54, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: CY, letterSpacing: '0.2em', marginTop: 8}}>ĐỘI HÌNH XUẤT PHÁT · {t.sodo}</div>
      </div>
    </div>
    {/* bảng HUD bên phải */}
    {g >= 0 && <div style={{position: 'absolute', left: 1000, top: 250, width: 780, opacity: 1 - tan, transform: `translateX(${jit}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 22, color: CY, letterSpacing: '0.2em'}}>◢ QUÉT CẦU THỦ {String(k + 1).padStart(2, '0')}/07</div>
      <div style={{height: 2, background: `linear-gradient(90deg, ${CY}, transparent)`, margin: '14px 0 22px', width: `${hien * 100}%`}} />
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 70, color: '#fff', lineHeight: 1.05, textShadow: `0 0 24px ${t.color}88`}}><Go text={pl.name.toUpperCase()} at={HEADP + k * STEPP + 4} tocDo={2.2} /></div>
      <div style={{display: 'flex', gap: 40, marginTop: 34, alignItems: 'center'}}>
        <svg width={170} height={170}>
          <circle cx={85} cy={85} r={70} fill="none" stroke={`${CY}33`} strokeWidth={10} />
          <circle cx={85} cy={85} r={70} fill="none" stroke={t.color} strokeWidth={10} strokeDasharray={`${2 * Math.PI * 70 * diem / 100} 999`} transform="rotate(-90 85 85)" strokeLinecap="round" />
          <text x={85} y={98} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={50} fill="#fff">{diem}</text>
        </svg>
        <div style={{fontFamily: MONO, fontSize: 26, color: '#cfefff', lineHeight: 1.9, opacity: interpolate(r, [8, 18], [0, 1], cl)}}>
          <div>SỐ ÁO ··· <span style={{color: t.color, fontFamily: OSW, fontWeight: 700, fontSize: 40}}>{pl.so}</span></div>
          <div>VỊ TRÍ ·· <span style={{color: '#fff'}}>{VT[pl.pos || ''] || pl.pos}</span></div>
          <div>CHỈ SỐ ·· <span style={{color: '#fff'}}>{pl.rating}</span></div>
        </div>
      </div>
      <div style={{marginTop: 34, opacity: interpolate(r, [12, 22], [0, 1], cl)}}><ViTriMini t={t} k={k} /></div>
    </div>}
    <Goc mau={t.color} /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};


// ---------- Dự bị: băng chuyền thẻ đi qua cổng quét ----------
const BW = 250, BH = 347, GAP = 290, SPD = 14, GATE = 960;
const benchLen = (n: number) => Math.ceil((1920 + BW + 260 + (n - 1) * GAP) / SPD);
export const BENCH_A = benchLen(TA.bench.length), BENCH_B = benchLen(TB.bench.length);
const DuBi: React.FC<{t: T}> = ({t}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const h = spring({frame: f, fps, config: {damping: 16}});
  const daQua = t.bench.filter((_, i) => 1920 + BW / 2 + i * GAP - f * SPD < GATE).length;
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: 'brightness(.28) blur(7px) saturate(1.2)'}} />
    <AbsoluteFill style={{perspective: 900}}>
      <div style={{position: 'absolute', left: -600, right: -600, top: 760, height: 700, transform: 'rotateX(72deg)', transformOrigin: 'top', background: `repeating-linear-gradient(90deg, ${CY}40 0 2px, transparent 2px 90px)`, backgroundPositionX: `${-f * SPD}px`, maskImage: 'linear-gradient(180deg, #000, transparent 85%)'}} />
    </AbsoluteFill>
    {/* băng chuyền */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 772, height: 6, background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`, boxShadow: `0 0 20px ${t.color}`}} />
    {/* cổng quét */}
    <div style={{position: 'absolute', left: GATE - 3, top: 330, width: 6, height: 470, background: CY, boxShadow: `0 0 30px 8px ${CY}`}} />
    <div style={{position: 'absolute', left: GATE - 160, top: 330, width: 320, height: 470, background: `linear-gradient(90deg, transparent, ${CY}22, transparent)`}} />
    <div style={{position: 'absolute', left: GATE - 160, top: 290, width: 320, textAlign: 'center', fontFamily: MONO, fontSize: 18, color: CY, letterSpacing: '0.25em'}}>◢ CỔNG QUÉT ◣</div>
    {t.bench.map((pl, i) => {
      const cx = 1920 + BW / 2 + i * GAP - f * SPD;
      if (cx < -BW || cx > 1920 + BW) return null;
      const L = cx - BW / 2;
      const cat = Math.max(0, Math.min(BW, GATE - L));   // phần đã qua cổng (bên trái) là ảnh thật
      const gan = Math.max(0, 1 - Math.abs(cx - GATE) / 260);
      const qua = cx < GATE;
      return <div key={i} style={{position: 'absolute', left: L, top: 772 - BH - 12, width: BW, height: BH, transform: `scale(${1 + 0.12 * gan})`, transformOrigin: '50% 100%', zIndex: Math.round(100 * gan)}}>
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: BW, height: BH, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.1) drop-shadow(0 0 14px ${CY})`, opacity: 0.55, clipPath: `inset(0 0 0 ${cat}px)`}} />
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: BW, height: BH, objectFit: 'contain', clipPath: `inset(0 ${BW - cat}px 0 0)`, filter: `drop-shadow(0 0 ${8 + 18 * gan}px ${t.color})`}} />
        {qua && <div style={{position: 'absolute', top: BH + 30, left: -40, right: -40, textAlign: 'center', opacity: Math.min(1, (GATE - cx) / 80)}}>
          <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 24, color: '#fff', whiteSpace: 'nowrap'}}>{pl.name.toUpperCase()}</div>
          <div style={{fontFamily: MONO, fontSize: 18, color: t.color, marginTop: 4}}>#{pl.so} · {pl.rating}</div>
        </div>}
      </div>;
    })}
    <div style={{position: 'absolute', left: 130, top: 90, display: 'flex', alignItems: 'center', gap: 22, opacity: h}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 96}} />
      <div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 54, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: CY, letterSpacing: '0.2em', marginTop: 8}}>ĐỘI HÌNH DỰ BỊ</div>
      </div>
    </div>
    <div style={{position: 'absolute', right: 130, top: 110, fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.15em', textAlign: 'right'}}>
      ĐÃ QUÉT <span style={{fontFamily: OSW, fontWeight: 700, fontSize: 56, color: t.color}}>{String(daQua).padStart(2, '0')}</span>/{String(t.bench.length).padStart(2, '0')}
    </div>
    <Goc mau={t.color} /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 5. Đội hình trên sân 3D ----------
const FORM = 300;
const CW = 140, CH = 195;
const viTri = (t: T, ti: number, pl: P): [number, number] => {
  const [vx, vy] = VITRI[t.sodo]?.[pl.pos || ''] || [0.1, 0.5];
  return [(ti === 0 ? vx : 1 - vx) * PW, (ti === 0 ? vy : 1 - vy) * PH];
};
const DoiHinh: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const e = Easing.inOut(Easing.sin);
  const rz = interpolate(f, [0, FORM], [-18, 18], {easing: e});
  const tilt = interpolate(f, [0, FORM], [64, 58], {easing: e});
  const z = interpolate(f, [0, FORM], [0.82, 0.92], {easing: e});
  const sweep = interpolate(f, [30, 130], [-0.1, 1.1], cl);
  const the = (t: T, ti: number) => t.xi.map((pl, i) => {
    const [x, y] = viTri(t, ti, pl);
    const s = spring({frame: f - 10 - ti * 14 - i * 5, fps, config: {damping: 13}});
    return <div key={t.key + i} style={{position: 'absolute', left: x - CW / 2, top: y - CH, width: CW, height: CH, transformOrigin: '50% 100%', transform: `rotateZ(${-rz}deg) rotateX(-90deg) scale(${s})`, transformStyle: 'preserve-3d'}}>
      <Img src={staticFile(pl.img)} style={{width: CW, height: CH, objectFit: 'contain', filter: `drop-shadow(0 0 10px ${t.color})`}} />
    </div>;
  });
  const duong = (t: T, ti: number) => {
    const pts = t.xi.map((pl) => viTri(t, ti, pl));
    const out: React.ReactNode[] = [];
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 400) out.push(<line key={`${ti}${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={t.color} strokeWidth={4} opacity={0.7} strokeDasharray="14 10" strokeDashoffset={-f * 2} />); }));
    return out;
  };
  const vongs = [TA, TB].map((t, ti) => t.xi.map((pl, i) => { const [x, y] = viTri(t, ti, pl); return <circle key={`r${ti}${i}`} cx={x} cy={y} r={34 + 6 * Math.sin(f / 6 + i)} fill="none" stroke={t.color} strokeWidth={4} opacity={0.85} />; }));
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <BauTroi />
    <San3D tilt={tilt} rz={rz} z={z} ty={60}>
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        {duong(TA, 0)}{duong(TB, 1)}{vongs}
        <rect x={sweep * PW - 60} y={0} width={120} height={PH} fill={`url(#qs)`} />
        <defs><linearGradient id="qs"><stop offset="0" stopColor={CY} stopOpacity={0} /><stop offset=".5" stopColor={CY} stopOpacity={0.45} /><stop offset="1" stopColor={CY} stopOpacity={0} /></linearGradient></defs>
      </svg>
      {the(TA, 0)}{the(TB, 1)}
    </San3D>
    {[TA, TB].map((t, ti) => <div key={ti} style={{position: 'absolute', top: 70, [ti ? 'right' : 'left']: 130, display: 'flex', flexDirection: ti ? 'row-reverse' : 'row', alignItems: 'center', gap: 18, opacity: interpolate(f, [8, 24], [0, 1], cl)}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 80}} />
      <div style={{textAlign: ti ? 'right' : 'left'}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 42, color: '#fff'}}>{t.name}</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: t.color, letterSpacing: '0.2em'}}>SƠ ĐỒ {t.sodo}</div>
      </div>
    </div>)}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: CY, letterSpacing: '0.3em'}}>MÔ PHỎNG ĐỘI HÌNH · 14 CẦU THỦ ĐÁ CHÍNH</div>
    <Goc /><Telemetry /><Scanlines o={0.08} />
  </AbsoluteFill>;
};

// ---------- 6. Kết ----------
const FIN = 240;
const Ket: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hit = 22;
  const p = interpolate(f, [0, hit], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const back = spring({frame: f - hit, fps, config: {damping: 10}});
  const lx = f < hit ? -300 + 1080 * p : 780 - 280 * back, rx = f < hit ? 2220 - 1080 * p : 1140 + 280 * back;
  const sock = interpolate(f, [hit, hit + 30], [0, 1], cl);
  const chu = spring({frame: f - hit - 14, fps, config: {damping: 15}});
  const den = interpolate(f, [FIN - 22, FIN], [0, 1], cl);
  return <AbsoluteFill style={{background: 'radial-gradient(circle, #0a2238, #01040b 70%)', overflow: 'hidden'}}>
    <BauTroi />
    {f >= hit && <div style={{position: 'absolute', left: 960 - sock * 1200, top: 470 - sock * 1200, width: sock * 2400, height: sock * 2400, borderRadius: '50%', border: `10px solid ${CY}`, opacity: 1 - sock, boxShadow: `0 0 60px ${CY}`}} />}
    {f >= hit && f < hit + 6 && <AbsoluteFill style={{background: '#e9fdff', opacity: interpolate(f, [hit, hit + 6], [0.8, 0], cl)}} />}
    {/* tia năng lượng giữa hai logo */}
    {f >= hit && <div style={{position: 'absolute', left: lx, width: Math.max(0, rx - lx), top: 466, height: 8, background: `linear-gradient(90deg, ${TA.color}, #fff, ${TB.color})`, boxShadow: `0 0 30px ${CY}`, opacity: 0.6 + 0.3 * Math.sin(f)}} />}
    <Img src={staticFile(`logo_${TA.key}.png`)} style={{position: 'absolute', height: 380, width: 380, objectFit: 'contain', left: lx - 190, top: 280, filter: `drop-shadow(0 0 30px ${TA.color})`}} />
    <Img src={staticFile(`logo_${TB.key}.png`)} style={{position: 'absolute', height: 380, width: 380, objectFit: 'contain', left: rx - 190, top: 280, filter: `drop-shadow(0 0 30px ${TB.color})`}} />
    {f >= hit + 4 && <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 150, color: '#fff', textShadow: `0 0 40px ${CY}`}}>VS</div>}
    <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', opacity: chu}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: CY, letterSpacing: '0.45em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ RHINO BILLIARDS 2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 64, color: '#ffd36a', marginTop: 14, letterSpacing: '0.1em'}}>TRẬN GIAO HỮU KHAI MẠC</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', opacity: chu, transform: `translateY(${(1 - chu) * 30}px)`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 84, color: '#fff', letterSpacing: '0.06em', textShadow: `0 0 26px ${CY}aa`}}>{data.date}</div>
    </div>
    <Goc /><Telemetry /><Scanlines />
    <AbsoluteFill style={{background: '#000', opacity: den}} />
  </AbsoluteFill>;
};

const CANH = [BOOT, SQ, SQ, BENCH_A, BENCH_B, FORM, FIN];
const BAT = CANH.map((_, i) => CANH.slice(0, i).reduce((a, b) => a + b, 0));
export const FUT_TOTAL = CANH.reduce((a, b) => a + b, 0);
// tiếng động: bùm khi cắt cảnh/va chạm, vút trước cắt, quét khi thẻ hiện, tích khi thẻ dự bị qua cổng
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => { SFX.push(['whoosh', b - 16, 0.7]); SFX.push(['boom', b, 0.9]); });
[2, 3].forEach((c) => { for (let k = 0; k < 7; k++) SFX.push(['scan', BAT[c] + HEADP + k * STEPP, 0.55]); });
[[3, TA], [4, TB]].forEach(([c, t]) => (t as T).bench.forEach((_, i) => SFX.push(['tick', BAT[c as number] + Math.round((1920 + BW / 2 + i * GAP - GATE) / SPD), 0.6])));
SFX.push(['boom', BAT[6] + 22, 1]);
SFX.push(['boom', BAT[0] + Math.round(86 * KD), 0.8]);
const B = blv as Record<string, number>;
const LOI: [string, number][] = [['mo', BAT[0] + 8], ['a0', BAT[1] + 6], ['b0', BAT[2] + 6], ['ba', BAT[3] + 10], ['bb', BAT[4] + 10], ['fm', BAT[5] + 14], ['kt', BAT[6] + 30]];
for (let k = 1; k <= 7; k++) { LOI.push(['a' + k, BAT[1] + HEADP + (k - 1) * STEPP + 4]); LOI.push(['b' + k, BAT[2] + HEADP + (k - 1) * STEPP + 4]); }
const nhac = (fr: number) => {
  let m = 0;
  for (const [k, at] of LOI) m = Math.max(m, interpolate(fr, [at - 8, at, at + B[k], at + B[k] + 12], [0, 1, 1, 0], cl));
  return 1 - 0.62 * m;
};
export const Future: React.FC = () => {
  const {durationInFrames: D} = useVideoConfig();
  return <AbsoluteFill style={{background: '#000'}}>
    <Sequence from={BAT[0]} durationInFrames={BOOT}><KhoiDong /></Sequence>
    <Sequence from={BAT[1]} durationInFrames={SQ}><QuetDoi t={TA} /></Sequence>
    <Sequence from={BAT[2]} durationInFrames={SQ}><QuetDoi t={TB} /></Sequence>
    <Sequence from={BAT[3]} durationInFrames={BENCH_A}><DuBi t={TA} /></Sequence>
    <Sequence from={BAT[4]} durationInFrames={BENCH_B}><DuBi t={TB} /></Sequence>
    <Sequence from={BAT[5]} durationInFrames={FORM}><DoiHinh /></Sequence>
    <Sequence from={BAT[6]} durationInFrames={FIN}><Ket /></Sequence>
    {BAT.slice(1).map((b, i) => <Sequence key={i} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('future_music3.mp3')} volume={(fr) => 0.9 * nhac(fr) * interpolate(fr, [0, 10, D - 60, D], [0, 1, 1, 0], cl)} />
    {LOI.map(([k, at]) => <Sequence key={'l' + k} from={at} durationInFrames={B[k] + 6}><Audio src={staticFile(`blv/${k}.mp3`)} volume={1} /></Sequence>)}
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};

// =====================================================================
// Bản demo: giới thiệu đội hình xuất phát ngay trên sân 3D
// =====================================================================
const B2 = blv2 as Record<string, number>;
const O3 = 350, H3 = 126, S3 = 96, TEAM3 = H3 + 7 * S3, W3 = 160, K3 = 240;
const TA0 = O3, TB0 = O3 + TEAM3, WF0 = O3 + 2 * TEAM3, BN0 = WF0 + W3;
const LBW = 400, LBH = 556, LGAP = 450, LSPD = 18;
const lenLon = (n: number) => Math.ceil((1920 + LBW + 300 + (n - 1) * LGAP) / LSPD);
const BA3 = lenLon(TA.bench.length), BB3 = lenLon(TB.bench.length);
const KF0 = BN0 + BA3 + BB3, MO3 = O3 - 60;
export const SAN3D_TOTAL = KF0 + K3;
type Cam = [number, number, number, number, number, number];   // frame, x, y, z, tilt, rz
const CAMS: Cam[] = (() => {
  const c: Cam[] = [[0, PW / 2, PH / 2, 0.5, 72, -24], [O3 - 20, PW / 2, PH / 2, 0.82, 60, 8]];
  [[TA, 0, TA0], [TB, 1, TB0]].forEach(([t, ti, t0]) => {
    const T0 = t0 as number;
    c.push([T0 + 36, ti ? PW * 0.75 : PW * 0.25, PH / 2, 1.05, 57, ti ? 8 : -8]);
    c.push([T0 + H3 - 4, ti ? PW * 0.75 : PW * 0.25, PH / 2, 1.1, 57, ti ? 4 : -4]);
    (t as T).xi.forEach((pl, k) => {
      const [x, y] = viTri(t as T, ti as number, pl);
      const s = T0 + H3 + k * S3, rz = (k % 2 ? 7 : -7) * (ti ? -1 : 1);
      c.push([s + 22, x, y, 1.8, 52, rz]);
      c.push([s + S3 - 4, x, y, 1.86, 52, rz * 1.2]);
    });
  });
  c.push([WF0 + 40, PW / 2, PH / 2, 0.86, 60, -6]);
  c.push([KF0 + 6, PW / 2, PH / 2, 0.92, 58, 8]);
  return c;
})();
const camAt = (f: number) => {
  let i = 0;
  while (i < CAMS.length - 1 && CAMS[i + 1][0] <= f) i++;
  if (i >= CAMS.length - 1) return CAMS[CAMS.length - 1];
  const a = CAMS[i], b = CAMS[i + 1];
  const p = Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, (f - a[0]) / (b[0] - a[0]))));
  return a.map((v, j) => v + (b[j] - v) * p) as Cam;
};
// cầu thủ đang được giới thiệu: [đội, chỉ số, khung bắt đầu]
const dangGT = (f: number): [number, number, number] | null => {
  for (const [ti, t0] of [[0, TA0], [1, TB0]]) {
    const g = f - t0 - H3;
    if (g >= 0 && g < 7 * S3) return [ti, Math.floor(g / S3), t0 + H3 + Math.floor(g / S3) * S3];
  }
  return null;
};
const xuatHien = (ti: number, i: number) => (ti ? TB0 : TA0) + H3 + i * S3 + 14;

// mở màn: hai logo lớn quét hologram, VS đập xuống
const MoLogo: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const ring = interpolate(f, [5, 60], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const vs = 150, vsS = spring({frame: f - vs, fps, config: {damping: 9}});
  const rung = f >= vs && f < vs + 10 ? (random(`r${f}`) - 0.5) * 22 * (1 - (f - vs) / 10) : 0;
  const logo = (t: T, x: number, at: number) => {
    const p = interpolate(f, [at, at + 45], [0, 1], cl);
    const sc = interpolate(f, [at, at + 45, MO3], [0.9, 1, 1.06], cl);
    return <div style={{position: 'absolute', left: x - 290, top: 230, width: 580, height: 620, transform: `scale(${sc})`}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', inset: 0, width: 580, height: 620, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.1) drop-shadow(0 0 22px ${CY})`, opacity: 0.55 * Math.min(1, p * 3) * (1 - p)}} />
      <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', inset: 0, width: 580, height: 620, objectFit: 'contain', clipPath: `inset(${100 - p * 100}% 0 0 0)`, filter: `drop-shadow(0 0 ${30 + 10 * Math.sin(f / 8)}px ${t.color})`}} />
      {p > 0 && p < 1 && <div style={{position: 'absolute', left: -40, right: -40, top: `${(1 - p) * 100}%`, height: 4, background: CY, boxShadow: `0 0 24px 6px ${CY}`}} />}
      <div style={{position: 'absolute', top: 640, left: -100, right: -100, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: '0.06em', opacity: interpolate(f, [at + 40, at + 55], [0, 1], cl), textShadow: `0 0 24px ${t.color}`}}>{t.name}</div>
    </div>;
  };
  return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0a2238, #01040b 72%)', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${CY}10 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, ${CY}10 0 1px, transparent 1px 60px)`, opacity: ring}} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(960 540) rotate(${f * 0.6})`} fill="none" stroke={CY} opacity={0.5}>
        <circle r={500 * ring} strokeWidth={2} strokeDasharray="6 14" />
        <circle r={420 * ring} strokeWidth={1} />
      </g>
    </svg>
    <AbsoluteFill style={{transform: `translate(${rung}px, ${rung * 0.6}px)`}}>
      {logo(TA, 500, 30)}
      {logo(TB, 1420, 80)}
      {f >= vs && <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 220, color: '#fff', lineHeight: 1, transform: `scale(${interpolate(vsS, [0, 1], [3, 1])})`, opacity: Math.min(1, vsS * 2), textShadow: `0 0 50px ${CY}, 0 0 100px ${CY}88`}}>VS</div>}
    </AbsoluteFill>
    {f >= vs && f < vs + 8 && <AbsoluteFill style={{background: '#e9fdff', opacity: interpolate(f, [vs, vs + 8], [0.7, 0], cl)}} />}
    <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', opacity: interpolate(f, [190, 215], [0, 1], cl)}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: CY, letterSpacing: '0.45em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ RHINO BILLIARDS 2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 60, color: '#ffd36a', marginTop: 12, letterSpacing: '0.1em', textShadow: '0 0 24px #ffb40066'}}>TRẬN GIAO HỮU KHAI MẠC</div>
    </div>
    <Goc /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// dự bị: thẻ lớn rõ mặt chạy qua cổng quét
const DuBiLon: React.FC<{t: T}> = ({t}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const h = spring({frame: f, fps, config: {damping: 16}});
  const G = 960, day = 900;
  const daQua = t.bench.filter((_, i) => 1920 + LBW / 2 + i * LGAP - f * LSPD < G).length;
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: 'brightness(.28) blur(7px) saturate(1.2)'}} />
    <AbsoluteFill style={{perspective: 900}}>
      <div style={{position: 'absolute', left: -600, right: -600, top: day, height: 600, transform: 'rotateX(72deg)', transformOrigin: 'top', background: `repeating-linear-gradient(90deg, ${CY}40 0 2px, transparent 2px 90px)`, backgroundPositionX: `${-f * LSPD}px`, maskImage: 'linear-gradient(180deg, #000, transparent 85%)'}} />
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 0, right: 0, top: day, height: 6, background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`, boxShadow: `0 0 20px ${t.color}`}} />
    <div style={{position: 'absolute', left: G - 3, top: 250, width: 6, height: day - 250, background: CY, boxShadow: `0 0 30px 8px ${CY}`, opacity: 0.85}} />
    {t.bench.map((pl, i) => {
      const cx = 1920 + LBW / 2 + i * LGAP - f * LSPD;
      if (cx < -LBW || cx > 1920 + LBW) return null;
      const L = cx - LBW / 2, cat = Math.max(0, Math.min(LBW, G - L));
      const gan = Math.max(0, 1 - Math.abs(cx - G) / 420);
      return <div key={i} style={{position: 'absolute', left: L, top: day - LBH - 30, width: LBW, height: LBH, transform: `scale(${1 + 0.18 * gan})`, transformOrigin: '50% 100%', zIndex: Math.round(100 * gan)}}>
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: LBW, height: LBH, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.1) drop-shadow(0 0 16px ${CY})`, opacity: 0.55, clipPath: `inset(0 0 0 ${cat}px)`}} />
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: LBW, height: LBH, objectFit: 'contain', clipPath: `inset(0 ${LBW - cat}px 0 0)`, filter: `drop-shadow(0 0 ${10 + 24 * gan}px ${t.color})`}} />
        {cx < G && <div style={{position: 'absolute', top: LBH + 40, left: -60, right: -60, textAlign: 'center', opacity: Math.min(1, (G - cx) / 100)}}>
          <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: '#fff', whiteSpace: 'nowrap'}}>{pl.name.toUpperCase()}</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: t.color, marginTop: 4}}>#{pl.so} · {VT[pl.pos || ''] || pl.pos || ''}</div>
        </div>}
      </div>;
    })}
    <div style={{position: 'absolute', left: 130, top: 80, display: 'flex', alignItems: 'center', gap: 22, opacity: h}}>
      <Img src={staticFile(`logo_${t.key}.png`)} style={{height: 100}} />
      <div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 58, color: '#fff', lineHeight: 1}}>{t.name}</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: CY, letterSpacing: '0.25em', marginTop: 8}}>ĐỘI HÌNH DỰ BỊ</div>
      </div>
    </div>
    <div style={{position: 'absolute', right: 130, top: 100, fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.15em'}}>
      ĐÃ QUÉT <span style={{fontFamily: OSW, fontWeight: 700, fontSize: 60, color: t.color}}>{String(daQua).padStart(2, '0')}</span>/{String(t.bench.length).padStart(2, '0')}
    </div>
    <Goc mau={t.color} /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

const SanDoiHinh: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const [, x, y, z, tilt, rz] = camAt(f);
  const gt = dangGT(f);
  const doi = [TA, TB];
  const cards = doi.flatMap((t, ti) => t.xi.map((pl, i) => {
    const [px, py] = viTri(t, ti, pl);
    const at = xuatHien(ti, i);
    const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 120}});
    const focus = gt && gt[0] === ti && gt[1] === i;
    const fo = focus ? interpolate(f - gt![2], [10, 30, S3 - 8, S3], [0, 1, 1, 0], cl) : 0;
    const sc = s * (1 + 0.45 * fo);
    const quet = interpolate(f - at, [0, 18], [0, 1], cl);
    return <React.Fragment key={t.key + i}>
      {/* cột sáng khi đang giới thiệu */}
      {fo > 0 && <div style={{position: 'absolute', left: px - 130, top: py - 700, width: 260, height: 700, transformOrigin: '50% 100%', transform: `rotateZ(${-rz}deg) rotateX(${-tilt}deg)`, background: `linear-gradient(0deg, ${t.color}aa, ${CY}33 40%, transparent 90%)`, opacity: 0.7 * fo, clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)'}} />}
      {s > 0.01 && <div style={{position: 'absolute', left: px - CW / 2, top: py - CH, width: CW, height: CH, transformOrigin: '50% 100%', transform: `rotateZ(${-rz}deg) rotateX(${-tilt}deg) scale(${sc})`, transformStyle: 'preserve-3d', opacity: gt && !focus && f < WF0 ? 0.75 : 1}}>
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: CW, height: CH, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) brightness(1.15) drop-shadow(0 0 14px ${CY})`, opacity: 0.7 * (1 - quet)}} />
        <Img src={staticFile(pl.img)} style={{position: 'absolute', inset: 0, width: CW, height: CH, objectFit: 'contain', clipPath: `inset(0 0 ${100 - quet * 100}% 0)`, filter: `drop-shadow(0 0 ${10 + 14 * fo}px ${t.color})`}} />
        {quet > 0 && quet < 1 && <div style={{position: 'absolute', left: -10, right: -10, top: `${quet * 100}%`, height: 3, background: CY, boxShadow: `0 0 16px 4px ${CY}`}} />}
      </div>}
    </React.Fragment>;
  }));
  const vong = doi.flatMap((t, ti) => t.xi.map((pl, i) => {
    const [px, py] = viTri(t, ti, pl);
    const hien = f >= xuatHien(ti, i) - 14;
    return <g key={`v${ti}${i}`} opacity={hien ? 0.95 : 0.3}>
      <circle cx={px} cy={py} r={42 + (hien ? 5 * Math.sin(f / 6 + i) : 0)} fill={hien ? `${t.color}22` : 'none'} stroke={hien ? t.color : CY} strokeWidth={4} strokeDasharray={hien ? undefined : '8 8'} />
    </g>;
  }));
  const duong = f >= WF0 - 10 ? doi.flatMap((t, ti) => {
    const pts = t.xi.map((pl) => viTri(t, ti, pl));
    const o: React.ReactNode[] = [];
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 400) o.push(<line key={`d${ti}${i}${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={t.color} strokeWidth={4} opacity={0.7 * interpolate(f, [WF0 - 10, WF0 + 20], [0, 1], cl)} strokeDasharray="14 10" strokeDashoffset={-f * 2} />); }));
    return o;
  }) : null;
  // bảng thông tin
  const pl = gt ? doi[gt[0]].xi[gt[1]] : null, tt = gt ? doi[gt[0]] : null;
  const r = gt ? f - gt[2] : 0;
  const bang = gt ? interpolate(r, [14, 26, S3 - 8, S3], [0, 1, 1, 0], cl) : 0;
  const diem = pl ? Math.round(pl.rating * interpolate(r, [18, 40], [0, 1], cl)) : 0;
  const dau = (ti: number, t0: number) => interpolate(f, [t0 + 6, t0 + 24, t0 + H3 - 10, t0 + H3], [0, 1, 1, 0], cl);
  const tieuDe = 0;   // tiêu đề đã có ở màn logo
  return <AbsoluteFill style={{background: '#01040b', overflow: 'hidden'}}>
    <BauTroi />
    <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 30%'}}>
      <div style={{position: 'absolute', left: 960 - PW / 2, top: 700 - PH / 2, width: PW, height: PH, transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${z}, ${z}, ${z}) translate(${PW / 2 - x}px, ${PH / 2 - y}px)`}}>
        {/* thảm cỏ quanh sân để không lộ mép khi máy quay đến gần */}
        <div style={{position: 'absolute', left: -1100, top: -900, width: PW + 2200, height: PH + 1800, background: `url(${staticFile('grass.jpg')}) center / 900px`, filter: 'brightness(.32) saturate(.8)'}} />
        <div style={{position: 'absolute', left: -1100, top: -900, width: PW + 2200, height: PH + 1800, background: `repeating-linear-gradient(0deg, ${CY}14 0 2px, transparent 2px 75px), repeating-linear-gradient(90deg, ${CY}14 0 2px, transparent 2px 75px)`}} />
        <MatSan />
        <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>{vong}{duong}</svg>
        {cards}
      </div>
    </AbsoluteFill>
    {/* tiêu đề mở màn */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', opacity: tieuDe}}>
      <div style={{fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.5em'}}>RHINO BILLIARDS · 2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 84, color: '#e9fdff', marginTop: 10, textShadow: `0 0 18px ${CY}, 0 0 50px ${CY}88`}}>TRẬN GIAO HỮU KHAI MẠC</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 18}}>
        <Img src={staticFile(`logo_${TA.key}.png`)} style={{height: 110}} />
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 64, color: '#ffd36a'}}>VS</div>
        <Img src={staticFile(`logo_${TB.key}.png`)} style={{height: 110}} />
      </div>
    </div>
    {/* đầu mục từng đội */}
    {[[TA, 0, TA0], [TB, 1, TB0]].map(([t, ti, t0]) => {
      const o = dau(ti as number, t0 as number), T_ = t as T;
      return o > 0 && <div key={ti as number} style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, opacity: o, transform: `translateY(${(1 - o) * -30}px)`}}>
        <Img src={staticFile(`logo_${T_.key}.png`)} style={{height: 150, filter: `drop-shadow(0 0 24px ${T_.color})`}} />
        <div>
          <div style={{fontFamily: MONO, fontSize: 22, color: CY, letterSpacing: '0.3em'}}>ĐỘI HÌNH XUẤT PHÁT</div>
          <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 92, color: '#fff', lineHeight: 1, textShadow: `0 0 30px ${T_.color}`}}>{T_.name}</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: T_.color, letterSpacing: '0.25em', marginTop: 6}}>SƠ ĐỒ {T_.sodo}</div>
        </div>
      </div>;
    })}
    {/* bảng HUD cầu thủ */}
    {pl && tt && bang > 0 && <div style={{position: 'absolute', right: 110, top: 300, width: 560, padding: '28px 34px', background: 'linear-gradient(135deg, rgba(4,20,32,.82), rgba(4,20,32,.55))', border: `1px solid ${CY}66`, borderLeft: `5px solid ${tt.color}`, opacity: bang, transform: `translateX(${(1 - bang) * 60}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Img src={staticFile(`logo_${tt.key}.png`)} style={{height: 44}} />
        <div style={{fontFamily: MONO, fontSize: 20, color: CY, letterSpacing: '0.2em'}}>{tt.name} · {String(gt![1] + 1).padStart(2, '0')}/07</div>
      </div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 52, color: '#fff', lineHeight: 1.1, marginTop: 14, textShadow: `0 0 20px ${tt.color}88`}}><Go text={pl.name.toUpperCase()} at={gt![2] + 16} tocDo={2.4} /></div>
      <div style={{display: 'flex', gap: 30, marginTop: 22, alignItems: 'center'}}>
        <svg width={130} height={130}>
          <circle cx={65} cy={65} r={54} fill="none" stroke={`${CY}33`} strokeWidth={9} />
          <circle cx={65} cy={65} r={54} fill="none" stroke={tt.color} strokeWidth={9} strokeDasharray={`${2 * Math.PI * 54 * diem / 100} 999`} transform="rotate(-90 65 65)" strokeLinecap="round" />
          <text x={65} y={78} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={40} fill="#fff">{diem}</text>
        </svg>
        <div style={{fontFamily: MONO, fontSize: 24, color: '#cfefff', lineHeight: 1.8}}>
          <div>SỐ ÁO · <span style={{color: tt.color, fontFamily: OSW, fontWeight: 700, fontSize: 36}}>{pl.so}</span></div>
          <div>{VT[pl.pos || ''] || pl.pos}</div>
        </div>
      </div>
    </div>}
    {f >= WF0 && <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', opacity: interpolate(f, [WF0, WF0 + 20], [0, 1], cl)}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 70, color: '#fff', textShadow: `0 0 30px ${CY}`}}>{TA.name} <span style={{color: '#ffd36a'}}>VS</span> {TB.name}</div>
      <div style={{fontFamily: MONO, fontSize: 24, color: CY, letterSpacing: '0.3em', marginTop: 8}}>{TA.sodo} · 14 CẦU THỦ ĐÁ CHÍNH · {TB.sodo}</div>
    </div>}
    <Goc /><Telemetry /><Scanlines o={0.08} />
  </AbsoluteFill>;
};
const LOI3: [string, number][] = [['mo', 10], ['a0', TA0 + 6], ['b0', TB0 + 6], ['fm', WF0 + 10], ['ba', BN0 + 12], ['bb', BN0 + BA3 + 12], ['kt', KF0 + 30]];
for (let k = 1; k <= 7; k++) { LOI3.push(['a' + k, TA0 + H3 + (k - 1) * S3 + 6]); LOI3.push(['b' + k, TB0 + H3 + (k - 1) * S3 + 6]); }
const SFX3: [string, number, number][] = [['boom', 150, 1], ['whoosh', MO3 - 16, 0.7], ['boom', MO3, 0.8], ['boom', TA0, 0.8], ['boom', TB0, 0.8], ['boom', WF0, 0.8], ['whoosh', BN0 - 16, 0.7], ['boom', BN0, 0.8], ['boom', BN0 + BA3, 0.8], ['whoosh', KF0 - 16, 0.7], ['boom', KF0 + 22, 1]];
[[TA, BN0], [TB, BN0 + BA3]].forEach(([t, b]) => (t as T).bench.forEach((_, i) => SFX3.push(['tick', (b as number) + Math.round((1920 + LBW / 2 + i * LGAP - 960) / LSPD), 0.6])));
for (let k = 0; k < 7; k++) { SFX3.push(['whoosh', TA0 + H3 + k * S3, 0.45]); SFX3.push(['scan', TA0 + H3 + k * S3 + 12, 0.5]); SFX3.push(['whoosh', TB0 + H3 + k * S3, 0.45]); SFX3.push(['scan', TB0 + H3 + k * S3 + 12, 0.5]); }
const nhac3 = (fr: number) => {
  let m = 0;
  for (const [k, at] of LOI3) m = Math.max(m, interpolate(fr, [at - 8, at, at + B2[k], at + B2[k] + 12], [0, 1, 1, 0], cl));
  return 1 - 0.62 * m;
};
export const San3DDemo: React.FC = () => {
  const {durationInFrames: D} = useVideoConfig();
  return <AbsoluteFill style={{background: '#000'}}>
    <Sequence from={0} durationInFrames={BN0}><SanDoiHinh /></Sequence>
    <Sequence from={0} durationInFrames={MO3}><MoLogo /></Sequence>
    <Sequence from={BN0} durationInFrames={BA3}><DuBiLon t={TA} /></Sequence>
    <Sequence from={BN0 + BA3} durationInFrames={BB3}><DuBiLon t={TB} /></Sequence>
    <Sequence from={KF0} durationInFrames={K3}><Ket /></Sequence>
    {[MO3, BN0, BN0 + BA3, KF0].map((b) => <Sequence key={b} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('future_music3.mp3')} volume={(fr) => 0.9 * nhac3(fr) * interpolate(fr, [0, 10, D - 60, D], [0, 1, 1, 0], cl)} />
    {LOI3.map(([k, at]) => <Sequence key={'l' + k} from={at} durationInFrames={B2[k] + 6}><Audio src={staticFile(`blv2/${k}.mp3`)} /></Sequence>)}
    {SFX3.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
