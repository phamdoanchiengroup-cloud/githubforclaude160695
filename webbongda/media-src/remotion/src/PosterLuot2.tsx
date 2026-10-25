import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OSW, VIE} from './Fifa';
import lich from './lich_2310.json';

// Poster lượt 2 (29/10/2026): ngang 1920×1080 và dọc 1080×1920, kèm kết quả lượt 1 + BXH
type Doi = {name: string; color: string};
const D = (lich as unknown as {doi: Record<string, Doi>}).doi;
const VANG = '#ffcf3a', HONG = '#ff2e7e', NEN = '#0b0b14';
const NGAY = 'THỨ NĂM 29/10/2026';
const TRAN: [string, string, string][] = [['rhino', 'timetip', '15:00'], ['evo', 'cuebots', '15:00']];
const KQ: [string, number, number, string][] = [['rhino', 2, 3, 'evo'], ['cuebots', 2, 2, 'timetip']];
const BXH: [string, number, string][] = [['evo', 3, '+1'], ['cuebots', 1, '0'], ['timetip', 1, '0'], ['rhino', 0, '−1']];

const Chu: React.FC<{children: React.ReactNode; size: number; mau?: string; vien?: string; style?: React.CSSProperties}> = ({children, size, mau = '#fff', vien = NEN, style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, color: mau, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.1, WebkitTextStroke: `${Math.max(3, size / 30)}px ${vien}`, paintOrder: 'stroke fill', textShadow: `0 ${size / 20}px 0 ${vien}`, ...style}}>{children}</div>;

const TheTran: React.FC<{i: number; x: number; y: number; k?: number}> = ({i, x, y, k = 1}) => {
  const [ka, kb, gio] = TRAN[i]; const A = D[ka], B = D[kb];
  const W = 820, H = 540;
  return <div style={{position: 'absolute', left: x, top: y, width: W, height: H, transform: `scale(${k})`, transformOrigin: '0 0'}}>
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)', background: `linear-gradient(105deg, ${A.color} 0 49.6%, ${B.color} 50.4% 100%)`, boxShadow: '0 30px 60px rgba(0,0,0,.5)'}} />
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)', background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.45) 100%)'}} />
    <div style={{position: 'absolute', left: W / 2 - 4, top: -10, width: 8, height: H + 20, background: '#fff', transform: 'rotate(10deg)', opacity: 0.9}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: -64, textAlign: 'center'}}><Chu size={46} mau={VANG}>TRẬN {i + 3}</Chu></div>
    <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 70, top: 40, width: 290, height: 290, objectFit: 'contain', filter: 'drop-shadow(0 14px 0 rgba(0,0,0,.4))'}} />
    <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 70, top: 40, width: 290, height: 290, objectFit: 'contain', filter: 'drop-shadow(0 14px 0 rgba(0,0,0,.4))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}><Chu size={120} mau={HONG} vien="#fff">VS</Chu></div>
    <div style={{position: 'absolute', left: 40, width: 360, top: 338, textAlign: 'center'}}><Chu size={52}>{A.name}</Chu></div>
    <div style={{position: 'absolute', right: 40, width: 360, top: 338, textAlign: 'center'}}><Chu size={52}>{B.name}</Chu></div>
    <div style={{position: 'absolute', left: W / 2 - 130, top: 436, width: 260, height: 78, background: NEN, transform: 'skewX(-10deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 4px ${VANG}`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 56, color: VANG, transform: 'skewX(10deg)', letterSpacing: '0.04em'}}>{gio}</div>
    </div>
  </div>;
};

const Nhan: React.FC<{children: React.ReactNode}> = ({children}) =>
  <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 24, color: VANG, letterSpacing: '0.2em', marginBottom: 12}}>{children}</div>;
const Logo: React.FC<{k: string; s?: number}> = ({k, s = 46}) => <Img src={staticFile(`logo_${k}.png`)} style={{width: s, height: s, objectFit: 'contain'}} />;
const Hop: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) =>
  <div style={{background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 14, padding: '18px 26px', ...style}}>{children}</div>;

const KetQua: React.FC<{style?: React.CSSProperties}> = ({style}) => <Hop style={style}>
  <Nhan>KẾT QUẢ LƯỢT 1 · 23/10</Nhan>
  {KQ.map(([a, ga, gb, b]) => <div key={a} style={{display: 'flex', alignItems: 'center', gap: 14, height: 62}}>
    <Logo k={a} /><div style={{fontFamily: OSW, fontWeight: 700, fontSize: 30, color: '#fff', width: 190}}>{D[a].name}</div>
    <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 44, color: VANG, width: 110, textAlign: 'center'}}>{ga} – {gb}</div>
    <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 30, color: '#fff', width: 190, textAlign: 'right'}}>{D[b].name}</div><Logo k={b} />
  </div>)}
</Hop>;

const Bxh: React.FC<{style?: React.CSSProperties}> = ({style}) => <Hop style={style}>
  <div style={{display: 'flex', justifyContent: 'space-between'}}><Nhan>BẢNG XẾP HẠNG</Nhan><div style={{fontFamily: VIE, fontWeight: 700, fontSize: 18, color: '#aab6d0', letterSpacing: '0.15em'}}>HS · ĐIỂM</div></div>
  {BXH.map(([k, d, hs], i) => <div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, height: 35}}>
    <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 24, color: i === 0 ? VANG : '#fff', width: 22}}>{i + 1}</div>
    <Logo k={k} s={28} /><div style={{fontFamily: OSW, fontWeight: 700, fontSize: 24, color: '#fff', flex: 1}}>{D[k].name}</div>
    <div style={{fontFamily: OSW, fontSize: 22, color: '#aab6d0', width: 44, textAlign: 'right'}}>{hs}</div>
    <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 26, color: i === 0 ? VANG : '#fff', width: 34, textAlign: 'right'}}>{d}</div>
  </div>)}
</Hop>;

const Nen: React.FC<{w: number; h: number}> = ({w, h}) => <>
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover', filter: 'brightness(.45) saturate(1.1) blur(2px)'}} />
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,11,20,.85) 0%, rgba(11,11,20,.35) 40%, rgba(11,11,20,.92) 100%)'}} />
  <AbsoluteFill style={{background: 'repeating-linear-gradient(-30deg, rgba(255,255,255,.035) 0 60px, transparent 60px 120px)'}} />
</>;

export const PosterLuot2: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Nen w={1920} h={1080} />
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 80, top: 50, width: 260, height: 60, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center'}}><Chu size={110}>MATCH DAY · LƯỢT 2</Chu></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 158, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 38, color: VANG, letterSpacing: '0.18em'}}>VÒNG TRÒN · {NGAY}</div>
  <TheTran i={0} x={150} y={300} k={0.86} />
  <TheTran i={1} x={1065} y={300} k={0.86} />
  <KetQua style={{position: 'absolute', left: 150, top: 780, width: 760}} />
  <Bxh style={{position: 'absolute', left: 1010, top: 780, width: 760}} />
</AbsoluteFill>;

export const PosterLuot2Doc: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Nen w={1080} h={1920} />
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 340, top: 50, width: 400, height: 90, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center'}}><Chu size={120}>MATCH DAY</Chu></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}><Chu size={80} mau={HONG} vien="#fff">LƯỢT 2</Chu></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: VANG, letterSpacing: '0.16em'}}>{NGAY}</div>
  <TheTran i={0} x={171} y={540} k={0.9} />
  <TheTran i={1} x={171} y={1100} k={0.9} />
  <KetQua style={{position: 'absolute', left: 90, top: 1618, width: 900}} />
  <div style={{position: 'absolute', left: 90, right: 90, top: 1838, display: 'flex', alignItems: 'center', gap: 12}}>
    <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 22, color: VANG, letterSpacing: '0.14em', width: 92}}>BXH</div>
    {BXH.map(([k, d], i) => <div key={k} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 10, background: i === 0 ? 'rgba(255,207,58,.18)' : 'rgba(255,255,255,.06)', border: `1px solid ${i === 0 ? VANG : 'rgba(255,255,255,.16)'}`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 22, color: '#aab6d0'}}>{i + 1}</div><Logo k={k} s={34} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 28, color: i === 0 ? VANG : '#fff'}}>{d}đ</div>
    </div>)}
  </div>
</AbsoluteFill>;
