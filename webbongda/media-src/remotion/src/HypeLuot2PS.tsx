import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, random} from 'remotion';
import {OSW, VIE} from './Fifa';
import {cl} from './Future';
import lich from './lich_2910.json';

// Giới thiệu lượt 2 – cùng nội dung HypeLuot2, đổi sang phong cách poster "Match Day":
// nền sân vận động tối + ánh vàng, tấm đỏ (đội trái/trên) – xanh (đội phải/dưới) viền vàng kim, chữ vàng kim / bạc, hạt sáng lấp lánh.
type Doi = {name: string; color: string; dt: {img: string; name: string; so: string}; ds: string[]; xi: string[]; sodo: string};
const L = lich as unknown as {ngay: string; vong: string; tran: [string, string, string][]; doi: Record<string, Doi>};
const BEAT = 30 * 60 / 143.6;
const NEN = '#05060c';
const DO = ['#ff3b2f', '#c4121a', '#5a0508'], XANH = ['#3d8bff', '#1442c8', '#06154a'];
const KIM = 'linear-gradient(180deg, #fffbe0 0%, #ffe27a 28%, #f5b72a 52%, #b8730f 70%, #ffd968 86%, #fff1b0 100%)';
const BAC = 'linear-gradient(180deg, #ffffff 0%, #eef2fa 40%, #a9b4c8 62%, #f4f7ff 82%, #c8d0de 100%)';
const VIEN_KIM = 'linear-gradient(135deg, #fff3b0, #d79a1e 30%, #fff0a8 50%, #a96a0c 75%, #ffe58a)';
const ngayNgan = L.ngay.split(' ').slice(-1)[0];
const ps = (img: string) => img.replace(/^c_/, 'ps_');   // ảnh thật đã tách nền của đội trưởng

// ---------- họa tiết chung ----------
// Nền: sân vận động tối, quầng vàng giữa, đỏ bên trái – xanh bên phải, tia sáng chéo
const NenPS: React.FC<{tone?: 'giua' | 'do' | 'xanh'}> = ({tone = 'giua'}) => {
  const f = useCurrentFrame();
  const quang = tone === 'do' ? 'rgba(255,60,40,.35)' : tone === 'xanh' ? 'rgba(60,130,255,.35)' : 'rgba(255,190,70,.30)';
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', left: -300, top: -60, width: 1680, height: 2040, objectFit: 'cover', filter: 'brightness(.33) saturate(1.25) blur(3px)', transform: `scale(${1.06 + f * 0.0004})`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 32% at 50% 30%, ${quang}, transparent 70%), radial-gradient(ellipse 45% 60% at 0% 55%, rgba(220,30,30,.32), transparent 70%), radial-gradient(ellipse 45% 60% at 100% 55%, rgba(40,110,255,.32), transparent 70%)`}} />
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 80 + i * 230 + Math.sin((f + i * 40) / 50) * 30, top: -300, width: 60, height: 2600, background: 'linear-gradient(180deg, rgba(255,215,120,.22), transparent 70%)', transform: `rotate(${-14 + i * 7}deg)`, filter: 'blur(16px)', mixBlendMode: 'screen'}} />)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65) 100%)'}} />
  </AbsoluteFill>;
};
// Hạt sáng vàng lấp lánh (thay lớp chấm cũ)
const Hat: React.FC = () => {
  const f = useCurrentFrame(); const {width: W, height: H} = useVideoConfig();
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
    {Array.from({length: 46}, (_, i) => {
      const x = random(`hx${i}`) * W, y0 = random(`hy${i}`) * H, sp = 0.4 + random(`hs${i}`) * 1.2;
      const y = (y0 - f * sp + H * 2) % H, nh = 0.35 + 0.65 * Math.abs(Math.sin(f / (8 + random(`ht${i}`) * 14) + i));
      const r = 2 + random(`hr${i}`) * 5;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: '#ffe9a8', opacity: nh, boxShadow: `0 0 ${r * 4}px ${r}px rgba(255,200,90,.7)`}} />;
    })}
  </AbsoluteFill>;
};
// Chữ kim loại: vàng kim (mặc định) hoặc bạc, viền nâu sẫm, bóng đổ + quầng sáng
const Chu: React.FC<{children: React.ReactNode; size: number; kim?: 'vang' | 'bac'; style?: React.CSSProperties}> = ({children, size, kim = 'vang', style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '0.01em',
    backgroundImage: kim === 'vang' ? KIM : BAC, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    WebkitTextStroke: `${Math.max(2, size / 45)}px ${kim === 'vang' ? '#4a2a03' : '#1d2433'}`,
    filter: `drop-shadow(0 ${size / 22}px 0 rgba(0,0,0,.75)) drop-shadow(0 0 ${size / 6}px ${kim === 'vang' ? 'rgba(255,190,60,.55)' : 'rgba(170,200,255,.35)'})`, ...style}}>{children}</div>;
// Dải nhãn đỏ viền vàng (như "TRẬN 3" trên poster)
const Nhan: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 40, style}) =>
  <div style={{display: 'inline-block', padding: 3, background: VIEN_KIM, clipPath: 'polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)', ...style}}>
    <div style={{padding: `${size * 0.18}px ${size * 1.1}px`, background: `linear-gradient(180deg, ${DO[0]}, ${DO[1]} 55%, ${DO[2]})`, clipPath: 'polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)', fontFamily: OSW, fontWeight: 700, fontSize: size, color: '#fff', letterSpacing: '0.06em', textShadow: '0 2px 0 rgba(0,0,0,.5)'}}>{children}</div>
  </div>;
// Tấm kính đỏ / xanh viền vàng kim, cắt vát
const Tam: React.FC<{mau: string[]; style: React.CSSProperties; vat?: string; children?: React.ReactNode}> = ({mau, style, vat = 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)', children}) =>
  <div style={{position: 'absolute', ...style}}>
    <div style={{position: 'absolute', inset: 0, background: VIEN_KIM, clipPath: vat, filter: 'drop-shadow(0 0 18px rgba(255,190,60,.5))'}} />
    <div style={{position: 'absolute', inset: 4, background: `linear-gradient(115deg, ${mau[0]} 0%, ${mau[1]} 45%, ${mau[2]} 100%)`, clipPath: vat}} />
    <div style={{position: 'absolute', inset: 4, background: 'linear-gradient(115deg, rgba(255,255,255,.28) 0%, transparent 35%), repeating-linear-gradient(115deg, rgba(255,255,255,.05) 0 3px, transparent 3px 26px)', clipPath: vat}} />
    {children}
  </div>;
const Logo: React.FC<{k: string; s: number; style?: React.CSSProperties}> = ({k, s, style}) =>
  <Img src={staticFile(`logo_${k}.png`)} style={{width: s, height: s, objectFit: 'contain', filter: 'drop-shadow(0 10px 0 rgba(0,0,0,.45)) drop-shadow(0 0 24px rgba(255,200,90,.55))', ...style}} />;

// ---------- 1. Mở màn: mỗi cụm chữ 3 phách ----------
const CHU_MO: [string, 'vang' | 'bac'][] = [['MATCH DAY', 'vang'], ['LƯỢT 2', 'vang'], ['THỨ NĂM · ' + ngayNgan.slice(0, 5), 'bac'], [`${L.tran.length} TRẬN · 15:00`, 'vang']];
const NHIP_CHU = 3;
const MO = Math.round(BEAT * NHIP_CHU * CHU_MO.length);
const MoMan: React.FC = () => {
  const f = useCurrentFrame(); const i = Math.min(CHU_MO.length - 1, Math.floor(f / (BEAT * NHIP_CHU))); const p = (f - i * BEAT * NHIP_CHU) / (BEAT * NHIP_CHU);
  const [t, m] = CHU_MO[i];
  return <AbsoluteFill>
    <NenPS />
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: interpolate(f, [0, 10], [0, 1], cl)}}>
      <Img src={staticFile('rhino_logo_trang.png')} style={{width: 380, height: 110, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,200,90,.6))'}} />
      <Chu size={44} style={{marginTop: 26, letterSpacing: '0.08em', fontStyle: 'normal'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</Chu>
      <Chu size={44} kim="bac" style={{letterSpacing: '0.08em', fontStyle: 'normal'}}>RHINO BILLIARDS 2026</Chu>
    </div>
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 140}}>
      <Chu size={t.length > 10 ? 150 : 230} kim={m} style={{transform: `scale(${1.15 - 0.15 * Math.min(1, p * 5)}) rotate(-6deg)`, opacity: Math.min(1, p * 8), textAlign: 'center', width: 1000}}>{t}</Chu>
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 32, color: '#ffe7a0', letterSpacing: '0.24em'}}>VÒNG TRÒN · {L.ngay}</div>
    <Hat />
  </AbsoluteFill>;
};

// ---------- 1b. Nhìn lại lượt 1 + bảng xếp hạng ----------
const KQ1: [string, number, number, string][] = [['rhino', 2, 3, 'evo'], ['cuebots', 2, 2, 'timetip']];
const BXH: [string, number, number, string][] = [['evo', 1, 3, '+1'], ['cuebots', 1, 1, '0'], ['timetip', 1, 1, '0'], ['rhino', 1, 0, '−1']];
const LAI = 135, BANG = 150;
const NhinLai: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <AbsoluteFill>
    <NenPS />
    <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', opacity: interpolate(f, [0, 8], [0, 1], cl)}}><Chu size={84}>NHÌN LẠI LƯỢT 1</Chu></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 285, textAlign: 'center', opacity: interpolate(f, [6, 14], [0, 1], cl)}}><Nhan size={34}>KẾT QUẢ 23/10</Nhan></div>
    {KQ1.map(([ka, ga, gb, kb], i) => {
      const s = spring({frame: f - 10 - i * 14, fps, config: {damping: 12}});
      const sc = spring({frame: f - 26 - i * 14, fps, config: {damping: 9}});
      const y = 430 + i * 560, A = L.doi[ka], B = L.doi[kb];
      const tag = ga > gb ? `${A.name} THẮNG` : gb > ga ? `${B.name} THẮNG` : 'HÒA';
      return <div key={i} style={{position: 'absolute', left: 50 + (1 - s) * (i ? 1100 : -1100), top: y, width: 980, height: 470}}>
        <Tam mau={DO} style={{left: 0, top: 0, width: 520, height: 400}} vat="polygon(5% 0, 100% 0, 92% 100%, 0 100%)" />
        <Tam mau={XANH} style={{left: 460, top: 0, width: 520, height: 400}} vat="polygon(8% 0, 100% 0, 95% 100%, 0 100%)" />
        <Logo k={ka} s={250} style={{position: 'absolute', left: 40, top: 30, opacity: gb > ga ? 0.8 : 1}} />
        <Logo k={kb} s={250} style={{position: 'absolute', right: 40, top: 30, opacity: ga > gb ? 0.8 : 1}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', transform: `scale(${2.2 - 1.2 * sc}) rotate(-6deg)`, opacity: Math.min(1, sc * 3)}}><Chu size={190}>{ga}-{gb}</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}><Chu size={46} kim="bac" style={{fontStyle: 'normal'}}>{A.name} – {B.name}</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 398, textAlign: 'center', opacity: interpolate(f, [34 + i * 14, 42 + i * 14], [0, 1], cl)}}><Nhan size={30}>{tag}</Nhan></div>
      </div>;
    })}
    <Hat />
  </AbsoluteFill>;
};
const Bang: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <AbsoluteFill>
    <NenPS />
    <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', transform: `scale(${1.3 - 0.3 * Math.min(1, f / 8)}) rotate(-4deg)`, opacity: Math.min(1, f / 6)}}><Chu size={124}>BẢNG XẾP HẠNG</Chu></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center', opacity: interpolate(f, [8, 16], [0, 1], cl)}}><Nhan size={32}>SAU LƯỢT 1</Nhan></div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 470, display: 'flex', justifyContent: 'flex-end', fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#ffe7a0', letterSpacing: '0.1em', opacity: interpolate(f, [12, 20], [0, 1], cl)}}>
      <div style={{width: 150, textAlign: 'center'}}>HS</div><div style={{width: 170, textAlign: 'center'}}>ĐIỂM</div>
    </div>
    {BXH.map(([k, , d, hs], i) => {
      const s = spring({frame: f - 14 - i * 9, fps, config: {damping: 13}});
      const y = 520 + i * 250, dau = i === 0;
      return <div key={k} style={{position: 'absolute', left: 80 + (1 - s) * (i % 2 ? 1100 : -1100), top: y, width: 920, height: 210}}>
        <Tam mau={dau ? ['#fff0a0', '#e0a321', '#7a4b05'] : (i % 2 ? XANH : DO).map((c, j) => j === 2 ? '#0a0b14' : c + (j ? '88' : 'aa'))} style={{inset: 0}} vat="polygon(3% 0, 100% 0, 97% 100%, 0 100%)" />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
          <Chu size={110} kim={dau ? 'bac' : 'vang'} style={{width: 120, textAlign: 'center', marginLeft: 30}}>{i + 1}</Chu>
          <Logo k={k} s={160} style={{marginLeft: 10}} />
          <Chu size={54} kim="bac" style={{flex: 1, marginLeft: 26, whiteSpace: 'nowrap'}}>{L.doi[k].name}</Chu>
          <div style={{width: 150, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 56, color: dau ? '#3a2400' : '#dfe6f5'}}>{hs}</div>
          <Chu size={120} kim={dau ? 'bac' : 'vang'} style={{width: 170, textAlign: 'center'}}>{d}</Chu>
        </div>
      </div>;
    })}
    <Hat />
  </AbsoluteFill>;
};

// ---------- 2. Từng trận ----------
const N_THE = 7;
const MOI_DOI = 120;
const VAO = 56, VS_DAU = 24, THE = MOI_DOI * 2, CHOT = 90;
// sân bóng 3D đặt dọc (giữ như bản cũ), thẻ cầu thủ phát quang theo màu tấm (đỏ / xanh)
const PW = 760, PH = 1300;
const SanDoc: React.FC<{d: Doi; g: number; quang: string}> = ({d, g, quang}) => {
  const {fps} = useVideoConfig();
  const tilt = interpolate(g, [0, MOI_DOI], [60, 48], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const z = interpolate(g, [0, MOI_DOI], [0.92, 1.0], cl);
  const hang = [1, ...d.sodo.split('-').map(Number)];
  const vt: [number, number][] = [];
  hang.forEach((n, r) => {
    const y = r === 0 ? 0.92 : 0.72 - (r - 1) * (0.46 / Math.max(1, hang.length - 2));
    for (let c = 0; c < n; c++) vt.push([(c + 1) / (n + 1), y]);
  });
  const CW = 195, CH = 273;
  return <AbsoluteFill style={{perspective: 2600, perspectiveOrigin: '50% 10%'}}>
    <div style={{position: 'absolute', left: 540 - PW / 2, top: 400, width: PW, height: PH, transformOrigin: '50% 0%', transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg) scale3d(${z}, ${z}, ${z})`}}>
      <div style={{position: 'absolute', inset: -10, background: VIEN_KIM, filter: 'drop-shadow(0 0 30px rgba(255,190,60,.6))'}} />
      <Img src={staticFile('grass.jpg')} style={{position: 'absolute', inset: 0, width: PW, height: PH, objectFit: 'cover', filter: 'brightness(.62) saturate(1.05)'}} />
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        <g fill="none" stroke="rgba(255,230,160,.85)" strokeWidth={6}>
          <rect x={8} y={8} width={PW - 16} height={PH - 16} /><line x1={0} y1={PH / 2} x2={PW} y2={PH / 2} /><circle cx={PW / 2} cy={PH / 2} r={105} />
          <rect x={PW / 2 - 200} y={8} width={400} height={180} /><rect x={PW / 2 - 200} y={PH - 188} width={400} height={180} />
          <rect x={PW / 2 - 110} y={PH - 88} width={220} height={80} /><rect x={PW / 2 - 110} y={8} width={220} height={80} />
        </g>
      </svg>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 40% at 50% 70%, ${quang}44, transparent 70%)`}} />
      {d.xi.slice(0, N_THE).map((img, j) => {
        const [px, py] = vt[j] || [0.5, 0.5];
        const sp = spring({frame: g - 10 - j * 6, fps, config: {damping: 14}});
        const x = px * PW, y = py * PH;
        return <React.Fragment key={j}>
          <div style={{position: 'absolute', left: x - 70, top: y - 22, width: 140, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.5)', filter: 'blur(6px)', opacity: sp}} />
          <div style={{position: 'absolute', left: x - CW / 2, top: y - CH, width: CW, height: CH, transformOrigin: '50% 100%', transform: `rotateX(${-tilt}deg) translateY(${(1 - sp) * -260}px)`, opacity: Math.min(1, sp * 2)}}>
            <Img src={staticFile(img)} style={{width: CW, height: CH, objectFit: 'contain', filter: `drop-shadow(0 0 14px ${quang})`}} />
          </div>
        </React.Fragment>;
      })}
    </div>
  </AbsoluteFill>;
};
const TRAN = VAO + VS_DAU + THE + CHOT;
const Tran: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const [ka, kb, gio] = L.tran[i]; const A = L.doi[ka], B = L.doi[kb];
  const sa = spring({frame: f - 2, fps, config: {damping: 11, mass: 0.7}}), sb = spring({frame: f - 10, fps, config: {damping: 11, mass: 0.7}});
  const vs = spring({frame: f - VAO + 6, fps, config: {damping: 9}});
  const t0 = VAO + VS_DAU, t1 = t0 + THE;
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <NenPS />
    {/* nửa trên: tấm đỏ – đội A ; nửa dưới: tấm xanh – đội B ; đường chéo vàng kim */}
    <Tam mau={DO} style={{left: -40 + (1 - sa) * -1100, top: 230, width: 1160, height: 700}} vat="polygon(0 0, 100% 0, 100% 72%, 0 100%)" />
    <Tam mau={XANH} style={{left: -40 + (1 - sb) * 1100, top: 990, width: 1160, height: 700}} vat="polygon(0 28%, 100% 0, 100% 100%, 0 100%)" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: interpolate(f, [0, 8], [0, 1], cl)}}><Nhan size={48}>TRẬN {i + 3}</Nhan></div>
    {/* ảnh thật đội trưởng nằm trong tấm (cắt theo đường chéo của tấm, như poster) */}
    <div style={{position: 'absolute', left: -36 + (1 - sa) * -1100, top: 234, width: 1152, height: 692, clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 100%)', overflow: 'hidden'}}>
      <Img src={staticFile(ps(A.dt.img))} style={{position: 'absolute', right: 0, top: 20, width: 560, height: 735, objectFit: 'contain', objectPosition: 'top', filter: 'drop-shadow(0 0 26px rgba(255,90,60,.6))', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 14%)'}} />
    </div>
    <Logo k={ka} s={400} style={{position: 'absolute', left: 50 + (1 - sa) * -700, top: 300, transform: `rotate(${(1 - sa) * -40}deg)`}} />
    <Chu size={100} kim="bac" style={{position: 'absolute', left: 60 + (1 - sa) * 900, top: 720, width: 640}}>{A.name}</Chu>
    <div style={{position: 'absolute', left: -36 + (1 - sb) * 1100, top: 994, width: 1152, height: 692, clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)', overflow: 'hidden'}}>
      <Img src={staticFile(ps(B.dt.img))} style={{position: 'absolute', left: 0, top: 160, width: 560, height: 735, objectFit: 'contain', objectPosition: 'top', filter: 'drop-shadow(0 0 26px rgba(80,140,255,.6))', WebkitMaskImage: 'linear-gradient(270deg, transparent 0%, #000 14%)'}} />
    </div>
    <Logo k={kb} s={400} style={{position: 'absolute', right: 50 + (1 - sb) * -700, top: 1150, transform: `rotate(${(1 - sb) * 40}deg)`}} />
    <Chu size={100} kim="bac" style={{position: 'absolute', right: 60 + (1 - sb) * 900, top: 1560, width: 640, textAlign: 'right'}}>{B.name}</Chu>
    {f >= VAO - 6 && <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Chu size={300} style={{transform: `scale(${3 - 2 * vs}) rotate(-8deg)`, opacity: Math.min(1, vs * 3)}}>VS</Chu>
    </AbsoluteFill>}
    {/* giới thiệu lần lượt từng đội: đội hình chính trên sân 3D */}
    {f >= t0 && f < t1 && (() => {
      const k = f < t0 + MOI_DOI ? 0 : 1, d = k ? B : A, key = k ? kb : ka, g = f - t0 - k * MOI_DOI;
      const vao = interpolate(g, [0, 10], [0, 1], cl), ra = interpolate(g, [MOI_DOI - 8, MOI_DOI], [1, 0], cl);
      const mau = k ? XANH : DO;
      // nền giữ nguyên suốt 2 đội (không lộ cảnh VS khi đổi đội), chỉ nội dung mờ vào/ra
      return <AbsoluteFill style={{opacity: interpolate(f, [t0, t0 + 10], [0, 1], cl)}}>
        <NenPS tone={k ? 'xanh' : 'do'} />
        <AbsoluteFill style={{opacity: k ? Math.min(vao, ra) : ra}}>
        <Tam mau={mau} style={{left: 40, top: 120, width: 1000, height: 230}} />
        <Logo k={key} s={200} style={{position: 'absolute', left: 70, top: 135}} />
        <Chu size={96} kim="bac" style={{position: 'absolute', left: 300, top: 150, width: 720}}>{d.name}</Chu>
        <Chu size={36} style={{position: 'absolute', left: 304, top: 270, fontStyle: 'normal', letterSpacing: '0.12em'}}>ĐỘI HÌNH CHÍNH · {d.sodo}</Chu>
        <SanDoc d={d} g={g} quang={mau[0]} />
        </AbsoluteFill>
      </AbsoluteFill>;
    })()}
    {/* chốt: hai đội trưởng (ảnh thật) + giờ đá */}
    {f >= t1 && <AbsoluteFill>
      <NenPS />
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center'}}><Chu size={80}>ĐỘI TRƯỞNG</Chu></div>
      {[[A, 30, DO, ka], [B, 550, XANH, kb]].map(([d, x, mau, key], k) => {
        const s = spring({frame: f - t1 - k * 6, fps, config: {damping: 12}});
        const dd = d as Doi;
        return <React.Fragment key={k}>
          <Tam mau={mau as string[]} style={{left: x as number, top: 300 + (1 - s) * 500, width: 500, height: 700, opacity: Math.min(1, s * 1.5)}} vat={k ? 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'} />
          <Img src={staticFile(ps(dd.dt.img))} style={{position: 'absolute', left: (x as number) + 10, top: 330 + (1 - s) * 500, width: 480, height: 666, objectFit: 'contain', objectPosition: 'bottom', opacity: Math.min(1, s * 1.5)}} />
          <Logo k={key as string} s={130} style={{position: 'absolute', left: (x as number) + (k ? 360 : 10), top: 300 + (1 - s) * 500}} />
          <div style={{position: 'absolute', left: x as number, width: 500, top: 1010 + (1 - s) * 500, textAlign: 'center'}}><Chu size={44} kim="bac" style={{fontStyle: 'normal'}}>{dd.dt.name}</Chu></div>
        </React.Fragment>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1100, textAlign: 'center'}}><Chu size={80}>VS</Chu></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1190, textAlign: 'center', opacity: interpolate(f, [t1 + 20, t1 + 30], [0, 1], cl)}}><Chu size={270}>{gio}</Chu></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 44, color: '#ffe7a0', letterSpacing: '0.12em', opacity: interpolate(f, [t1 + 30, t1 + 40], [0, 1], cl)}}>{L.ngay}</div>
    </AbsoluteFill>}
    <Hat />
  </AbsoluteFill>;
};

// ---------- 3. Kết: lịch hai trận như poster ----------
const KET = 170;
const Ket: React.FC = () => {
  const f = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  return <AbsoluteFill>
    <NenPS />
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}><Chu size={116}>{ngayNgan.slice(0, 5)} · 15:00</Chu></div>
    {L.tran.map(([ka, kb], i) => {
      const s = spring({frame: f - 8 - i * 8, fps, config: {damping: 12}});
      const y = 400 + i * 480;
      return <div key={i} style={{position: 'absolute', left: 40 + (1 - s) * (i ? 1100 : -1100), top: y, width: 1000, height: 410}}>
        <Tam mau={DO} style={{left: 0, top: 0, width: 540, height: 340}} vat="polygon(5% 0, 100% 0, 92% 100%, 0 100%)" />
        <Tam mau={XANH} style={{left: 470, top: 0, width: 530, height: 340}} vat="polygon(8% 0, 100% 0, 95% 100%, 0 100%)" />
        <Logo k={ka} s={270} style={{position: 'absolute', left: 60, top: 30}} />
        <Logo k={kb} s={270} style={{position: 'absolute', right: 60, top: 30}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center'}}><Chu size={120}>VS</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center'}}><Nhan size={36}>TRẬN {i + 3} · {L.doi[ka].name} – {L.doi[kb].name}</Nhan></div>
      </div>;
    })}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1400, textAlign: 'center', transform: `scale(${1 + 0.05 * Math.exp(-((f % BEAT) / BEAT) * 6)})`, opacity: interpolate(f, [30, 40], [0, 1], cl)}}><Chu size={124} style={{lineHeight: 1.15}}>HẸN GẶP<br />TRÊN SÂN!</Chu></div>
    <div style={{position: 'absolute', left: 40, right: 40, bottom: 70, textAlign: 'center', fontFamily: VIE, fontWeight: 600, fontSize: 22, color: '#e6dcc0', opacity: 0.9}}>Nhạc: “Mega Hyper Ultrastorm” – Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
    <Hat />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], cl)}} />
  </AbsoluteFill>;
};

const DS: [React.FC, number][] = [[MoMan, MO], [NhinLai, LAI], [Bang, BANG], ...L.tran.map((_, i) => [() => <Tran i={i} />, TRAN] as [React.FC, number]), [Ket, KET]];
const BAT = DS.map((_, i) => DS.slice(0, i).reduce((a, b) => a + b[1], 0));
export const HYPE2PS_TOTAL = DS.reduce((a, b) => a + b[1], 0);
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => {SFX.push(['whoosh', b - 12, 0.6]); SFX.push(['boom', b, 0.8]);});
L.tran.forEach((_, i) => {SFX.push(['boom', BAT[3 + i] + VAO, 1]); SFX.push(['boom', BAT[3 + i] + VAO + VS_DAU + THE, 0.8]);});
export const HypeLuot2PS: React.FC = () => {
  const {durationInFrames: Dd} = useVideoConfig();
  return <AbsoluteFill style={{background: NEN}}>
    {DS.map(([C, d], i) => <Sequence key={i} from={BAT[i]} durationInFrames={d}><C /></Sequence>)}
    <Audio src={staticFile('future_music.mp3')} volume={(fr) => interpolate(fr, [0, 3, Dd - 30, Dd], [0, 1, 1, 0], cl)} />
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
