import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {OSW, VIE} from './Fifa';
import {CY, cl, MONO, Go, Glitch} from './Future';
import {Nen, Neon, HUD, Logo, MG, useNhip} from './KetQua';
import lich from './lich_2310.json';

// Giới thiệu 2 trận ngày thi đấu (theo lịch sheet TranDau) – phong cách tương lai, chạy được cả khổ ngang và dọc
type Doi = {name: string; color: string; dt: {img: string; name: string; so: string}; ds: string[]};
const L = lich as unknown as {ngay: string; vong: string; tran: [string, string, string][]; doi: Record<string, Doi>};
const useDoc = () => {const {width, height} = useVideoConfig(); return height > width;};
const vao = (f: number, a: number, b = a + 12) => interpolate(f, [a, b], [0, 1], cl);

// ---------- 1. Mở đầu ----------
const MO = 130;
const MoDau: React.FC = () => {
  const f = useCurrentFrame(); const {fps, width: W} = useVideoConfig(); const doc = useDoc();
  const t = spring({frame: f - 34, fps, config: {damping: 14}});
  const pill = spring({frame: f - 70, fps, config: {damping: 12}});
  return <AbsoluteFill>
    <Nen />
    <div style={{position: 'absolute', left: doc ? 80 : 130, top: doc ? 190 : 130, fontFamily: MONO, fontSize: 24, color: CY, lineHeight: 1.7}}>
      <div><Go text="> TẢI LỊCH THI ĐẤU ............ OK" at={2} tocDo={2.4} /></div>
      <div><Go text="> NHẬN DIỆN 4 ĐỘI BÓNG ........ 4/4" at={16} tocDo={2.4} /></div>
    </div>
    <Neon size={doc ? 170 : 160} style={{position: 'absolute', left: 0, right: 0, top: doc ? 540 : 300, textAlign: 'center', lineHeight: 1.1, opacity: t, transform: `scale(${1.4 - 0.4 * t})`}}>{doc ? <>NGÀY<br />THI ĐẤU</> : 'NGÀY THI ĐẤU'}</Neon>
    <div style={{position: 'absolute', left: 0, right: 0, top: doc ? 960 : 520, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: doc ? 46 : 44, lineHeight: 1.5, color: '#ffd36a', letterSpacing: '0.16em', opacity: vao(f, 50)}}>{L.vong}{doc ? <br /> : ' · '}{L.ngay}</div>
    <div style={{position: 'absolute', left: W / 2 - 230, top: doc ? 1180 : 650, width: 460, height: 84, border: `3px solid ${MG}`, boxShadow: `0 0 30px ${MG}, inset 0 0 20px ${MG}`, transform: `scaleX(${pill})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: '0.2em'}}>{L.tran.length} TRẬN ĐẤU</div>
    <HUD nhan="MATCH-DAY" />
  </AbsoluteFill>;
};

// dải thẻ toàn đội chạy ngang
const DaiThe: React.FC<{d: Doi; y: number; h: number; chieu: number; at: number}> = ({d, y, h, chieu, at}) => {
  const f = useCurrentFrame(); const {width: W} = useVideoConfig();
  const w = h * 0.714, gap = 18, dai = d.ds.length * (w + gap);
  const x0 = chieu > 0 ? -dai + W + (f - at) * 2.2 : -(f - at) * 2.2;
  return <div style={{position: 'absolute', left: 0, top: y, width: W, height: h, opacity: vao(f, at, at + 15)}}>
    {[0, 1].map((k) => d.ds.map((img, i) => <Img key={k + '-' + i} src={staticFile(img)} style={{position: 'absolute', left: x0 + k * dai * (chieu > 0 ? -1 : 1) + i * (w + gap), top: 0, width: w, height: h, objectFit: 'contain', filter: `drop-shadow(0 0 10px ${d.color})`}} />))}
  </div>;
};

// ---------- 2. Từng trận ----------
const TRAN = 300;
const Tran: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame(); const {fps, width: W} = useVideoConfig(); const doc = useDoc(); const n = useNhip();
  const [ka, kb, gio] = L.tran[i]; const A = L.doi[ka], B = L.doi[kb];
  const vs = spring({frame: f - 26, fps, config: {damping: 10}});
  const dt = (d: Doi, x: number, y: number, at: number) => {
    const s = spring({frame: f - at, fps, config: {damping: 13}});
    const cw = doc ? 300 : 250;
    return <>
      <Img src={staticFile(d.dt.img)} style={{position: 'absolute', left: x - cw / 2, top: y + (1 - s) * 80, width: cw, height: cw * 1.4, objectFit: 'contain', opacity: Math.min(1, s * 1.5), filter: `drop-shadow(0 0 ${18 + 14 * n}px ${d.color})`}} />
      <div style={{position: 'absolute', left: x - 260, width: 520, top: y + cw * 1.4 + 8, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: CY, letterSpacing: '0.2em', opacity: vao(f, at + 10)}}>ĐỘI TRƯỞNG</div>
    </>;
  };
  // khổ ngang: logo hai bên, VS giữa; thẻ đội trưởng ở giữa dưới logo; dải thẻ toàn đội chạy ở đáy
  // khổ dọc: logo trên, VS giữa, logo dưới; đội trưởng cạnh logo
  const xa = doc ? W / 2 : 420, xb = doc ? W / 2 : W - 420;
  const ya = doc ? 470 : 360, yb = doc ? 1270 : 360, s = doc ? 280 : 300;
  return <AbsoluteFill>
    <Nen mau={i % 2 ? '#ffb640' : CY} />
    <div style={{position: 'absolute', left: 0, right: 0, top: doc ? 150 : 88, textAlign: 'center', fontFamily: MONO, fontSize: doc ? 34 : 30, color: '#ffd36a', letterSpacing: '0.3em', opacity: vao(f, 0)}}>TRẬN {i + 1} · {gio} · {L.ngay}</div>
    <Logo t={{key: ka, color: A.color}} x={xa} y={ya} s={s} at={4} />
    <Logo t={{key: kb, color: B.color}} x={xb} y={yb} s={s} at={10} />
    <Neon size={doc ? 58 : 60} style={{position: 'absolute', left: xa - 300, width: 600, top: ya + s / 2 + 30, textAlign: 'center', opacity: vao(f, 18)}} mau={A.color}>{A.name}</Neon>
    <Neon size={doc ? 58 : 60} style={{position: 'absolute', left: xb - 300, width: 600, top: yb + s / 2 + 30, textAlign: 'center', opacity: vao(f, 22)}} mau={B.color}>{B.name}</Neon>
    <Neon size={doc ? 190 : 200} mau={MG} style={{position: 'absolute', left: 0, right: 0, top: doc ? 770 : 230, textAlign: 'center', fontStyle: 'italic', opacity: Math.min(1, vs * 2), transform: `scale(${2.2 - 1.2 * vs})`}}>VS</Neon>
    {doc ? <>{dt(A, 210, 560, 70)}{dt(B, W - 210, 1360, 84)}</> : <>{dt(A, 760, 560, 70)}{dt(B, W - 760, 560, 84)}</>}
    {f > 130 && <AbsoluteFill style={{opacity: vao(f, 130, 150)}}>
      <AbsoluteFill style={{background: 'rgba(2,6,16,.94)'}} />
      <Neon size={doc ? 56 : 52} style={{position: 'absolute', left: 0, right: 0, top: doc ? 230 : 120, textAlign: 'center'}}>LỰC LƯỢNG HAI ĐỘI</Neon>
      <DaiThe d={A} y={doc ? 400 : 220} h={doc ? 330 : 250} chieu={1} at={135} />
      <DaiThe d={B} y={doc ? 1170 : 610} h={doc ? 330 : 250} chieu={-1} at={140} />
      <div style={{position: 'absolute', left: 0, right: 0, top: doc ? 860 : 490, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: doc ? 44 : 38, color: '#ffd36a', letterSpacing: '0.12em'}}>{A.name} · {A.ds.length} CẦU THỦ{doc ? <br /> : '   |   '}{B.name} · {B.ds.length} CẦU THỦ</div>
    </AbsoluteFill>}
    <HUD nhan="MATCH-DAY" />
  </AbsoluteFill>;
};

// ---------- 3. Lịch tổng hợp + hẹn gặp ----------
const KET = 200;
const Ket: React.FC = () => {
  const f = useCurrentFrame(); const {fps, width: W, durationInFrames} = useVideoConfig(); const doc = useDoc();
  const hang = (i: number) => {
    const [ka, kb, gio] = L.tran[i]; const A = L.doi[ka], B = L.doi[kb];
    const s = spring({frame: f - 14 - i * 12, fps, config: {damping: 14}});
    const y = doc ? 520 + i * 360 : 330 + i * 230, w = doc ? 960 : 1400, x = W / 2 - w / 2;
    return <div key={i} style={{position: 'absolute', left: x + (1 - s) * (i ? 300 : -300), top: y, width: w, height: doc ? 300 : 190, opacity: Math.min(1, s * 1.5), border: `2px solid ${CY}88`, background: 'rgba(8,24,48,.55)', boxShadow: `0 0 30px ${CY}33`, borderRadius: 18}}>
      <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 30, top: doc ? 30 : 20, width: doc ? 150 : 150, height: doc ? 150 : 150, objectFit: 'contain'}} />
      <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 30, top: doc ? 30 : 20, width: 150, height: 150, objectFit: 'contain'}} />
      <div style={{position: 'absolute', left: 190, right: 190, top: doc ? 40 : 30, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: doc ? 44 : 50, color: '#fff', letterSpacing: '0.06em', lineHeight: 1.25}}>{A.name}{doc ? <br /> : ' '}<span style={{color: MG}}>vs</span>{doc ? <br /> : ' '}{B.name}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: doc ? 220 : 115, textAlign: 'center', fontFamily: MONO, fontSize: 34, color: '#ffd36a', letterSpacing: '0.2em'}}>TRẬN {i + 1} · {gio}</div>
    </div>;
  };
  return <AbsoluteFill>
    <Nen />
    <Neon size={doc ? 70 : 64} style={{position: 'absolute', left: 0, right: 0, top: doc ? 230 : 110, textAlign: 'center', opacity: vao(f, 0)}}>LỊCH THI ĐẤU</Neon>
    <div style={{position: 'absolute', left: 0, right: 0, top: doc ? 340 : 210, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 38, color: '#ffd36a', letterSpacing: '0.16em', opacity: vao(f, 6)}}>{L.ngay}</div>
    {L.tran.map((_, i) => hang(i))}
    <Neon size={doc ? 76 : 70} mau={MG} style={{position: 'absolute', left: 0, right: 0, top: doc ? 1330 : 850, textAlign: 'center', fontFamily: VIE, opacity: vao(f, 60, 78)}}>HẸN GẶP TRÊN SÂN!</Neon>
    <HUD nhan="MATCH-DAY" />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], cl)}} />
  </AbsoluteFill>;
};

const DS: [React.FC, number][] = [[MoDau, MO], ...L.tran.map((_, i) => [() => <Tran i={i} />, TRAN] as [React.FC, number]), [Ket, KET]];
const BAT = DS.map((_, i) => DS.slice(0, i).reduce((a, b) => a + b[1], 0));
export const GT_TOTAL = DS.reduce((a, b) => a + b[1], 0);
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => {SFX.push(['whoosh', b - 14, 0.5]); SFX.push(['boom', b, 0.7]);});
L.tran.forEach((_, i) => {SFX.push(['boom', BAT[1 + i] + 28, 0.9]); SFX.push(['scan', BAT[1 + i] + 130, 0.5]);});
export const GioiThieu: React.FC = () => {
  const {durationInFrames: Dd} = useVideoConfig();
  return <AbsoluteFill style={{background: '#000'}}>
    {DS.map(([C, d], i) => <Sequence key={i} from={BAT[i]} durationInFrames={d}><C /></Sequence>)}
    {BAT.slice(1).map((b, i) => <Sequence key={'g' + i} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.5) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('nhac_gt_anthem.wav')} volume={(fr) => 0.95 * interpolate(fr, [0, 4, Dd - 30, Dd], [0, 1, 1, 0], cl)} />
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
