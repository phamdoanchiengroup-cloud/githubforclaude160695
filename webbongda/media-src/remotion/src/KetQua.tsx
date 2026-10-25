import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {OSW, VIE} from './Fifa';
import {CY, cl, MONO, Scanlines, Goc, Go, Glitch} from './Future';
import doiHinh from './fifa_giaohuu.json';
import kq from './kq_giaohuu.json';

// Kết quả trận giao hữu – phong cách tương lai (HUD neon, hologram), nhịp theo nhạc 143,6 BPM
type P = {img: string; name: string; so: string};
type T = {key: string; name: string; color: string; sodo: string; xi: P[]; bench: P[]};
type Ban = {phut: number; ma: string; doi: string};
type KQ = {demo: boolean; vong: string; ngay: string; phut: number; A: string; B: string; tyso?: [number, number]; ban: Ban[]; mvp?: {ma: string; doi: string}; loi_ket: string};
const D = kq as KQ;
const TEAMS = doiHinh.teams as T[];
const doi = (k: string) => TEAMS.find((t) => t.key === k)!;
const TA = doi(D.A), TB = doi(D.B);
const cauThu = (ma: string, k: string) => [...doi(k).xi, ...doi(k).bench].find((p) => p.img === `c_${ma}.png`)!;
const GA = D.tyso ? D.tyso[0] : D.ban.filter((b) => b.doi === D.A).length, GB = D.tyso ? D.tyso[1] : D.ban.filter((b) => b.doi === D.B).length;
export const MG = '#ff3d9a';
const BEAT = 30 * 60 / 143.6;

// nhịp sáng theo phách nhạc
export const useNhip = () => {const f = useCurrentFrame(); return Math.exp(-((f % BEAT) / BEAT) * 6);};

// nền: lưới phối cảnh chạy về phía trước + vầng sáng
export const Nen: React.FC<{mau?: string}> = ({mau = CY}) => {
  const f = useCurrentFrame(); const n = useNhip(); const {width: VW, height: VH} = useVideoConfig();
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #0a1f3a 0%, #030814 55%, #000 100%)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -960, right: -960, top: VH * 0.52, height: 900, perspective: 600}}>
      <div style={{position: 'absolute', inset: 0, transform: 'rotateX(72deg)', transformOrigin: '50% 0',
        backgroundImage: `linear-gradient(${mau}66 2px, transparent 2px), linear-gradient(90deg, ${mau}66 2px, transparent 2px)`,
        backgroundSize: '120px 120px', backgroundPosition: `0 ${(f * 6) % 120}px`, opacity: 0.55 + 0.3 * n}} />
    </div>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 35% at 50% 52%, ${mau}${Math.round(18 + 30 * n).toString(16).padStart(2, '0')}, transparent 70%)`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.7), transparent 30%, transparent 70%, rgba(0,0,0,.8))'}} />
    {Array.from({length: 40}, (_, i) => {
      const x = random(`px${i}`) * VW, sp = 1 + random(`ps${i}`) * 4, y = (random(`py${i}`) * (VH + 120) - f * sp) % (VH + 120);
      return <div key={i} style={{position: 'absolute', left: x, top: y < 0 ? y + VH + 120 : y, width: 3, height: 3 + sp * 4, background: i % 3 ? CY : MG, opacity: 0.5, boxShadow: `0 0 8px ${CY}`}} />;
    })}
  </AbsoluteFill>;
};

export const Neon: React.FC<{children: React.ReactNode; size: number; mau?: string; style?: React.CSSProperties; font?: string}> = ({children, size, mau = CY, style, font = OSW}) =>
  <div style={{fontFamily: font, fontWeight: 700, fontSize: size, color: '#fff', textShadow: `0 0 12px ${mau}, 0 0 40px ${mau}, 0 0 80px ${mau}88`, letterSpacing: '0.06em', ...style}}>{children}</div>;

export const HUD: React.FC<{nhan?: string}> = ({nhan = 'MATCH-RESULT'}) => {
  const f = useCurrentFrame(); const {width: VW} = useVideoConfig(); const m = VW < 1200 ? 80 : 130;
  return <>
    <div style={{position: 'absolute', left: m, top: 52, fontFamily: MONO, fontSize: 18, color: CY, opacity: 0.8, letterSpacing: '0.14em'}}>RB-26 // {nhan} · T+{(f / 30).toFixed(2).padStart(6, '0')}</div>
    <div style={{position: 'absolute', right: m, top: 52, fontFamily: MONO, fontSize: 18, color: CY, opacity: 0.8, letterSpacing: '0.14em'}}>RHINO BILLIARDS 2026</div>
    {D.demo && <div style={{position: 'absolute', right: 130, bottom: 52, fontFamily: MONO, fontSize: 22, color: '#ff5a5a', letterSpacing: '0.2em'}}>■ DỮ LIỆU MẪU</div>}
    <Goc /><Scanlines o={0.1} />
  </>;
};

// logo hologram: quét từ dưới lên
export const Logo: React.FC<{t: {key: string; color: string}; x: number; y: number; s: number; at: number}> = ({t, x, y, s, at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 22], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const n = useNhip();
  return <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s}}>
    <svg width={s * 1.5} height={s * 1.5} style={{position: 'absolute', left: -s / 4, top: -s / 4}}>
      <g transform={`translate(${s * 0.75} ${s * 0.75}) rotate(${f * 2})`} fill="none" stroke={t.color} opacity={0.7 * p}>
        <circle r={s * 0.66} strokeWidth={2} strokeDasharray="10 16" /><path d={`M ${s * 0.72} 0 A ${s * 0.72} ${s * 0.72} 0 0 1 0 ${s * 0.72}`} strokeWidth={6} />
      </g>
    </svg>
    <Img src={staticFile(`logo_${t.key}.png`)} style={{position: 'absolute', inset: 0, width: s, height: s, objectFit: 'contain', clipPath: `inset(${100 - p * 100}% 0 0 0)`, filter: `drop-shadow(0 0 ${14 + 16 * n}px ${t.color})`}} />
    {p > 0 && p < 1 && <div style={{position: 'absolute', left: -20, right: -20, top: `${(1 - p) * 100}%`, height: 3, background: CY, boxShadow: `0 0 20px 5px ${CY}`}} />}
  </div>;
};

// ---------- 1. Khởi động ----------
const MO = 120;
const MoDau: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = spring({frame: f - 38, fps, config: {damping: 14}});
  const ft = spring({frame: f - 62, fps, config: {damping: 12}});
  return <AbsoluteFill>
    <Nen />
    <div style={{position: 'absolute', left: 130, top: 130, fontFamily: MONO, fontSize: 24, color: CY, lineHeight: 1.7}}>
      <div><Go text="> KẾT NỐI TRỌNG TÀI SỐ ............ OK" at={2} tocDo={2.4} /></div>
      <div><Go text="> TẢI KẾT QUẢ TRẬN ĐẤU ............ OK" at={16} tocDo={2.4} /></div>
    </div>
    <Neon size={150} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: t, transform: `scale(${1.4 - 0.4 * t})`, letterSpacing: `${0.4 - 0.32 * t}em`}}>KẾT QUẢ TRẬN ĐẤU</Neon>
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 40, color: '#ffd36a', letterSpacing: '0.2em', opacity: interpolate(f, [50, 62], [0, 1], cl)}}>{D.vong} · {D.ngay}</div>
    <div style={{position: 'absolute', left: 960 - 170, top: 650, width: 340, height: 76, border: `3px solid ${MG}`, boxShadow: `0 0 30px ${MG}, inset 0 0 20px ${MG}`, transform: `scaleX(${ft})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 34, color: '#fff', letterSpacing: '0.3em'}}>FULL TIME</div>
    <HUD />
  </AbsoluteFill>;
};

// ---------- 1b. Đội hình ra sân (đúng đội hình trong video giới thiệu trận) ----------
const DH = 220;
const DoiHinhRaSan: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hang = (t: T, y: number, at: number) => <>
    <Logo t={t} x={190} y={y + 20} s={170} at={at} />
    <div style={{position: 'absolute', left: 90, width: 200, top: y + 120, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 28, color: '#fff', letterSpacing: '0.08em', opacity: interpolate(f, [at + 10, at + 20], [0, 1], cl)}}>{t.name}</div>
    <div style={{position: 'absolute', left: 90, width: 200, top: y + 158, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 20, color: CY, opacity: interpolate(f, [at + 16, at + 26], [0, 1], cl)}}>SƠ ĐỒ {t.sodo}</div>
    {t.xi.map((p, i) => {
      const sp = spring({frame: f - at - 12 - i * 5, fps, config: {damping: 14}});
      const x = 340 + i * 220;
      return <div key={i} style={{position: 'absolute', left: x, top: y - 110 + (1 - sp) * 60, width: 190, opacity: Math.min(1, sp * 1.5)}}>
        <Img src={staticFile(p.img)} style={{width: 190, height: 266, objectFit: 'contain', filter: `drop-shadow(0 0 12px ${t.color})`}} />
      </div>;
    })}
  </>;
  return <AbsoluteFill>
    <Nen />
    <Neon size={62} style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: interpolate(f, [0, 12], [0, 1], cl)}}>ĐỘI HÌNH RA SÂN</Neon>
    {hang(TA, 300, 6)}
    {hang(TB, 700, 40)}
    <HUD />
  </AbsoluteFill>;
};

// ---------- 2. Tỷ số ----------
const TY = 190;
const So: React.FC<{v: number; at: number; x: number; thang: boolean; top?: number}> = ({v, at, x, thang, top = 330}) => {
  const f = useCurrentFrame();
  const shown = f < at ? 0 : Math.min(v, Math.floor((f - at) / 12));
  const rolling = f >= at && shown < v && (f - at) % 12 < 6;
  const k = interpolate(f, [at - 10, at], [0, 1], cl);
  const mau = f > at + v * 12 + 10 && thang ? '#ffd36a' : CY;
  return <Neon size={300} mau={mau} style={{position: 'absolute', left: x - 200, width: 400, top, textAlign: 'center', opacity: k, fontFamily: MONO, transform: rolling ? `translateX(${(random(`r${f}`) - 0.5) * 18}px)` : undefined}}>{rolling ? Math.floor(random(`d${f}`) * 10) : shown}</Neon>;
};
const TySo: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const end = 30 + Math.max(GA, GB) * 12 + 14;
  const w = spring({frame: f - end, fps, config: {damping: 12}});
  const win = GA === GB ? null : GA > GB ? TA : TB;
  return <AbsoluteFill>
    <Nen mau={win ? win.color : CY} />
    <Logo t={TA} x={360} y={470} s={360} at={2} />
    <Logo t={TB} x={1560} y={470} s={360} at={8} />
    {[[TA, 360], [TB, 1560]].map(([t, x]) => <div key={(t as T).key} style={{position: 'absolute', left: (x as number) - 300, width: 600, top: 720, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 56, color: '#fff', letterSpacing: '0.1em', opacity: interpolate(f, [16, 28], [0, 1], cl)}}>{(t as T).name}</div>)}
    <So v={GA} at={30} x={780} thang={GA > GB} />
    <Neon size={200} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: interpolate(f, [20, 30], [0, 1], cl)}}>:</Neon>
    <So v={GB} at={30} x={1140} thang={GB > GA} />
    {win ? <div style={{position: 'absolute', left: (win === TA ? 360 : 1560) - 190, top: 810, width: 380, height: 64, background: '#ffd36a', boxShadow: '0 0 40px #ffd36a', transform: `scaleX(${w})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 32, color: '#081020', letterSpacing: '0.2em'}}>CHIẾN THẮNG</div>
      : <div style={{position: 'absolute', left: 960 - 190, top: 810, width: 380, height: 64, border: `3px solid ${CY}`, transform: `scaleX(${w})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.2em'}}>HÒA</div>}
    <div style={{position: 'absolute', left: 0, right: 0, top: 910, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 34, color: '#ffd36a', letterSpacing: '0.14em', textShadow: '0 0 18px #ffb640', opacity: interpolate(f, [end + 30, end + 45], [0, 1], cl)}}>{GA + GB} BÀN THẮNG{GA === GB ? ' · HAI ĐỘI BẤT PHÂN THẮNG BẠI' : ''}</div>
    {f >= end && f < end + 10 && <AbsoluteFill style={{background: '#fff', opacity: 0.35 * (1 - (f - end) / 10)}} />}
    <HUD />
  </AbsoluteFill>;
};

// ---------- 3. Diễn biến bàn thắng ----------
const BUOC = 34;
const BAN = Math.max(130, 50 + D.ban.length * BUOC + 40);
const DienBien: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const x0 = 200, x1 = 1720, y0 = 560;
  const k = interpolate(f, [8, 40], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const ds = [...D.ban].sort((a, b) => a.phut - b.phut);
  let sa = 0, sb = 0;
  return <AbsoluteFill>
    <Nen />
    <Neon size={70} style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: interpolate(f, [0, 12], [0, 1], cl)}}>DIỄN BIẾN BÀN THẮNG</Neon>
    <div style={{position: 'absolute', left: x0, top: y0 - 3, width: (x1 - x0) * k, height: 6, background: CY, boxShadow: `0 0 18px ${CY}`}} />
    {[0, Math.round(D.phut / 2), D.phut].map((m) => <div key={m} style={{position: 'absolute', left: x0 + (x1 - x0) * m / D.phut - 60, width: 120, top: y0 + 22, textAlign: 'center', fontFamily: MONO, fontSize: 26, color: CY, opacity: k > m / D.phut ? 1 : 0}}>{m}'</div>)}
    {ds.map((b, i) => {
      const at = 50 + i * BUOC;
      if (b.doi === D.A) sa += 1; else sb += 1;
      if (f < at) return null;
      const s = spring({frame: f - at, fps, config: {damping: 13}});
      const t = doi(b.doi), up = b.doi === D.A, x = x0 + (x1 - x0) * Math.min(b.phut, D.phut) / D.phut;
      const p = cauThu(b.ma, b.doi);
      const cy = up ? y0 - 230 : y0 + 250;
      return <React.Fragment key={i}>
        <div style={{position: 'absolute', left: x - 14, top: y0 - 14, width: 28, height: 28, borderRadius: 14, background: t.color, boxShadow: `0 0 20px ${t.color}`, border: '3px solid #fff'}} />
        <div style={{position: 'absolute', left: x - 1.5, top: up ? cy + 120 : y0 + 14, width: 3, height: up ? y0 - 14 - cy - 120 : cy - 120 - y0 - 14, background: t.color, opacity: s}} />
        <Img src={staticFile(p.img)} style={{position: 'absolute', left: x - 85, top: cy - 120 + (1 - s) * (up ? -80 : 80), width: 170, height: 240, objectFit: 'contain', opacity: Math.min(1, s * 2), filter: `drop-shadow(0 0 16px ${t.color})`}} />
        <div style={{position: 'absolute', left: x + 92, top: cy - 100, fontFamily: MONO, fontWeight: 700, fontSize: 44, color: '#ffd36a', textShadow: '0 0 14px #ffd36a', opacity: s}}>{b.phut}'</div>
        <div style={{position: 'absolute', left: x + 92, top: cy - 44, fontFamily: VIE, fontWeight: 800, fontSize: 24, color: '#fff', opacity: s, whiteSpace: 'nowrap'}}>{p.name}</div>
        {f - at < 8 && <AbsoluteFill style={{background: t.color, opacity: 0.25 * (1 - (f - at) / 8), mixBlendMode: 'screen'}} />}
      </React.Fragment>;
    })}
    <Neon size={52} mau="#ffd36a" style={{position: 'absolute', left: 0, right: 0, top: 235, textAlign: 'center', fontFamily: MONO}}>{(() => {let a = 0, c = 0; ds.forEach((b, i) => {if (f >= 50 + i * BUOC) {if (b.doi === D.A) a++; else c++;}}); return `${a} : ${c}`;})()}</Neon>
    <HUD />
  </AbsoluteFill>;
};

// ---------- 4. Cầu thủ hay nhất ----------
const MVP = 150;
const NhatTran: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const n = useNhip();
  const M = D.mvp!; const t = doi(M.doi), p = cauThu(M.ma, M.doi);
  const s = spring({frame: f - 4, fps, config: {damping: 12}});
  const nb = D.ban.filter((b) => b.ma === M.ma).length;
  return <AbsoluteFill>
    <Nen mau="#ffd36a" />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(560 560) rotate(${f * 1.5})`} fill="none" stroke="#ffd36a" opacity={0.6 * s}>
        <circle r={380} strokeWidth={2} strokeDasharray="8 18" /><circle r={330 + 10 * n} strokeWidth={1} />
        <path d="M 360 0 A 360 360 0 0 1 0 360" strokeWidth={6} /><path d="M -360 0 A 360 360 0 0 1 0 -360" strokeWidth={6} />
      </g>
    </svg>
    <Img src={staticFile(p.img)} style={{position: 'absolute', left: 560 - 230, top: 560 - 320 + (1 - s) * 300, width: 460, height: 640, objectFit: 'contain', filter: `drop-shadow(0 0 ${30 + 30 * n}px #ffb640)`, transform: `rotateY(${(1 - s) * 70}deg)`}} />
    <div style={{position: 'absolute', left: 1000, top: 330, fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.2em'}}><Go text="> PHÂN TÍCH HIỆU SUẤT ... HOÀN TẤT" at={10} tocDo={2.6} /></div>
    <Neon size={74} mau="#ffb640" style={{position: 'absolute', left: 1000, top: 390, whiteSpace: 'nowrap', opacity: interpolate(f, [26, 40], [0, 1], cl)}}>CẦU THỦ HAY NHẤT TRẬN</Neon>
    <div style={{position: 'absolute', left: 1000, top: 520, fontFamily: VIE, fontWeight: 800, fontSize: 76, color: '#ffd36a', textShadow: '0 0 30px #ffb640'}}><Go text={p.name} at={44} tocDo={1.2} /></div>
    <div style={{position: 'absolute', left: 1000, top: 640, fontFamily: VIE, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.12em', opacity: interpolate(f, [70, 84], [0, 1], cl)}}>{t.name} · SỐ ÁO {p.so}{nb ? ` · ${nb} BÀN THẮNG` : ''}</div>
    <HUD />
  </AbsoluteFill>;
};

// ---------- 5. Kết ----------
const KET = 180;
const Ket: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  return <AbsoluteFill>
    <Nen />
    <Logo t={TA} x={430} y={400} s={240} at={0} />
    <Logo t={TB} x={1490} y={400} s={240} at={4} />
    <Neon size={150} style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: MONO, opacity: interpolate(f, [8, 18], [0, 1], cl)}}>{GA} : {GB}</Neon>
    <Neon size={52} style={{position: 'absolute', left: 0, right: 0, top: 610, textAlign: 'center', fontFamily: VIE, opacity: interpolate(f, [24, 38], [0, 1], cl)}}>CẢM ƠN HAI ĐỘI ĐÃ CỐNG HIẾN TRẬN ĐẤU</Neon>
    <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 32, color: '#ffd36a', letterSpacing: '0.12em'}}><Go text={D.loi_ket} at={44} tocDo={2.2} /></div>
    <HUD />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], cl)}} />
  </AbsoluteFill>;
};

// chỉ dựng cảnh có dữ liệu: không có người ghi bàn / cầu thủ hay nhất thì bỏ cảnh đó
const DS: [React.FC, number][] = [[MoDau, MO], [DoiHinhRaSan, DH], [TySo, TY], ...(D.ban.length ? [[DienBien, BAN] as [React.FC, number]] : []), ...(D.mvp ? [[NhatTran, MVP] as [React.FC, number]] : []), [Ket, KET]];
const CANH = DS.map((c) => c[1]);
const BAT = CANH.map((_, i) => CANH.slice(0, i).reduce((a, b) => a + b, 0));
export const KQ_TOTAL = CANH.reduce((a, b) => a + b, 0);
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => {SFX.push(['whoosh', b - 14, 0.5]); SFX.push(['boom', b, 0.7]);});
if (D.ban.length) D.ban.forEach((_, i) => SFX.push(['scan', BAT[3] + 50 + i * BUOC, 0.6]));
SFX.push(['boom', BAT[2] + 30 + Math.max(GA, GB) * 12 + 14, 0.9]);
export const KetQua: React.FC = () => {
  const {durationInFrames: Dd} = useVideoConfig();
  return <AbsoluteFill style={{background: '#000'}}>
    {DS.map(([C, d], i) => <Sequence key={i} from={BAT[i]} durationInFrames={d}><C /></Sequence>)}
    {BAT.slice(1).map((b, i) => <Sequence key={'g' + i} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.5) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('nhac_kq_anthem.wav')} volume={(fr) => 0.95 * interpolate(fr, [0, 4, Dd - 30, Dd], [0, 1, 1, 0], cl)} />
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};

// ================= BẢN DỌC 9:16 (1080×1920) =================
const MoDauDoc: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = spring({frame: f - 38, fps, config: {damping: 14}});
  const ft = spring({frame: f - 62, fps, config: {damping: 12}});
  return <AbsoluteFill>
    <Nen />
    <div style={{position: 'absolute', left: 80, top: 190, fontFamily: MONO, fontSize: 24, color: CY, lineHeight: 1.7}}>
      <div><Go text="> KẾT NỐI TRỌNG TÀI SỐ ...... OK" at={2} tocDo={2.4} /></div>
      <div><Go text="> TẢI KẾT QUẢ TRẬN ĐẤU ...... OK" at={16} tocDo={2.4} /></div>
    </div>
    <Neon size={160} style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', lineHeight: 1.1, opacity: t, transform: `scale(${1.4 - 0.4 * t})`}}>KẾT QUẢ<br />TRẬN ĐẤU</Neon>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 44, lineHeight: 1.5, color: '#ffd36a', letterSpacing: '0.16em', opacity: interpolate(f, [50, 62], [0, 1], cl)}}>{D.vong}<br />{D.ngay}</div>
    <div style={{position: 'absolute', left: 540 - 190, top: 1260, width: 380, height: 84, border: `3px solid ${MG}`, boxShadow: `0 0 30px ${MG}, inset 0 0 20px ${MG}`, transform: `scaleX(${ft})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 38, color: '#fff', letterSpacing: '0.3em'}}>FULL TIME</div>
    <HUD />
  </AbsoluteFill>;
};

const DoiHinhDoc: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const khoi = (t: T, y: number, at: number) => <>
    <Logo t={t} x={150} y={y} s={130} at={at} />
    <div style={{position: 'absolute', left: 250, top: y - 52, fontFamily: OSW, fontWeight: 700, fontSize: 52, color: '#fff', letterSpacing: '0.08em', opacity: interpolate(f, [at + 10, at + 20], [0, 1], cl)}}>{t.name}</div>
    <div style={{position: 'absolute', left: 252, top: y + 14, fontFamily: VIE, fontWeight: 800, fontSize: 26, color: CY, opacity: interpolate(f, [at + 16, at + 26], [0, 1], cl)}}>SƠ ĐỒ {t.sodo}</div>
    {t.xi.map((p, i) => {
      const sp = spring({frame: f - at - 12 - i * 5, fps, config: {damping: 14}});
      const hang = i < 4 ? 0 : 1, cot = i < 4 ? i : i - 4, n = hang ? t.xi.length - 4 : 4;
      const x = 540 + (cot - (n - 1) / 2) * 240 - 105;
      return <Img key={i} src={staticFile(p.img)} style={{position: 'absolute', left: x, top: y + 110 + hang * 300 + (1 - sp) * 60, width: 210, height: 294, objectFit: 'contain', opacity: Math.min(1, sp * 1.5), filter: `drop-shadow(0 0 12px ${t.color})`}} />;
    })}
  </>;
  return <AbsoluteFill>
    <Nen />
    <Neon size={72} style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: interpolate(f, [0, 12], [0, 1], cl)}}>ĐỘI HÌNH RA SÂN</Neon>
    {khoi(TA, 310, 6)}
    {khoi(TB, 1115, 40)}
    <HUD />
  </AbsoluteFill>;
};

const TySoDoc: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const end = 30 + Math.max(GA, GB) * 12 + 14;
  const w = spring({frame: f - end, fps, config: {damping: 12}});
  const win = GA === GB ? null : GA > GB ? TA : TB;
  return <AbsoluteFill>
    <Nen mau={win ? win.color : CY} />
    <Logo t={TA} x={290} y={500} s={330} at={2} />
    <Logo t={TB} x={790} y={500} s={330} at={8} />
    {[[TA, 290], [TB, 790]].map(([t, x]) => <div key={(t as T).key} style={{position: 'absolute', left: (x as number) - 250, width: 500, top: 720, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 52, color: '#fff', letterSpacing: '0.08em', opacity: interpolate(f, [16, 28], [0, 1], cl)}}>{(t as T).name}</div>)}
    <So v={GA} at={30} x={330} thang={GA > GB} top={860} />
    <Neon size={220} style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', opacity: interpolate(f, [20, 30], [0, 1], cl)}}>:</Neon>
    <So v={GB} at={30} x={750} thang={GB > GA} top={860} />
    {win ? <div style={{position: 'absolute', left: (win === TA ? 290 : 790) - 190, top: 1300, width: 380, height: 76, background: '#ffd36a', boxShadow: '0 0 40px #ffd36a', transform: `scaleX(${w})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#081020', letterSpacing: '0.2em'}}>CHIẾN THẮNG</div>
      : <div style={{position: 'absolute', left: 540 - 190, top: 1300, width: 380, height: 76, border: `3px solid ${CY}`, transform: `scaleX(${w})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: '0.2em'}}>HÒA</div>}
    <div style={{position: 'absolute', left: 60, right: 60, top: 1440, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 42, lineHeight: 1.5, color: '#ffd36a', letterSpacing: '0.12em', textShadow: '0 0 18px #ffb640', opacity: interpolate(f, [end + 30, end + 45], [0, 1], cl)}}>{GA + GB} BÀN THẮNG{GA === GB ? <><br />HAI ĐỘI BẤT PHÂN THẮNG BẠI</> : null}</div>
    {f >= end && f < end + 10 && <AbsoluteFill style={{background: '#fff', opacity: 0.35 * (1 - (f - end) / 10)}} />}
    <HUD />
  </AbsoluteFill>;
};

const KetDoc: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  return <AbsoluteFill>
    <Nen />
    <Logo t={TA} x={260} y={700} s={230} at={0} />
    <Logo t={TB} x={820} y={700} s={230} at={4} />
    <Neon size={110} style={{position: 'absolute', left: 0, right: 0, top: 630, textAlign: 'center', fontFamily: MONO, opacity: interpolate(f, [8, 18], [0, 1], cl)}}>{GA}:{GB}</Neon>
    <Neon size={64} style={{position: 'absolute', left: 60, right: 60, top: 1000, textAlign: 'center', lineHeight: 1.3, fontFamily: VIE, opacity: interpolate(f, [24, 38], [0, 1], cl)}}>CẢM ƠN HAI ĐỘI<br />ĐÃ CỐNG HIẾN<br />TRẬN ĐẤU</Neon>
    {D.loi_ket ? <div style={{position: 'absolute', left: 60, right: 60, top: 1330, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#ffd36a', letterSpacing: '0.1em'}}><Go text={D.loi_ket} at={44} tocDo={2.2} /></div> : null}
    <HUD />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], cl)}} />
  </AbsoluteFill>;
};

// bản dọc dùng cùng thời lượng từng cảnh, cùng nhạc và tiếng động với bản ngang (chỉ dựng khi không có cảnh bàn thắng / cầu thủ hay nhất)
const DS_DOC: [React.FC, number][] = [[MoDauDoc, MO], [DoiHinhDoc, DH], [TySoDoc, TY], [KetDoc, KET]];
const BAT_DOC = DS_DOC.map((_, i) => DS_DOC.slice(0, i).reduce((a, b) => a + b[1], 0));
export const KQ_DOC_TOTAL = DS_DOC.reduce((a, b) => a + b[1], 0);
export const KetQuaDoc: React.FC = () => {
  const {durationInFrames: Dd} = useVideoConfig();
  return <AbsoluteFill style={{background: '#000'}}>
    {DS_DOC.map(([C, d], i) => <Sequence key={i} from={BAT_DOC[i]} durationInFrames={d}><C /></Sequence>)}
    {BAT_DOC.slice(1).map((b, i) => <Sequence key={'g' + i} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.5) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('nhac_kq_anthem.wav')} volume={(fr) => 0.95 * interpolate(fr, [0, 4, Dd - 30, Dd], [0, 1, 1, 0], cl)} />
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
