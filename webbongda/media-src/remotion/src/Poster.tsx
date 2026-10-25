import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OSW, VIE} from './Fifa';
import lich from './lich_2310.json';

// Ảnh thông báo ngày thi đấu, khổ ngang 1920×1080 (ảnh tĩnh)
type Doi = {name: string; color: string; dt: {img: string; name: string; so: string}};
const L = lich as unknown as {ngay: string; vong: string; tran: [string, string, string][]; doi: Record<string, Doi>};
const VANG = '#ffcf3a', HONG = '#ff2e7e', NEN = '#0b0b14';

const Chu: React.FC<{children: React.ReactNode; size: number; mau?: string; vien?: string; style?: React.CSSProperties}> = ({children, size, mau = '#fff', vien = NEN, style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, color: mau, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.1, WebkitTextStroke: `${Math.max(3, size / 30)}px ${vien}`, paintOrder: 'stroke fill', textShadow: `0 ${size / 20}px 0 ${vien}`, ...style}}>{children}</div>;

const TheTran: React.FC<{i: number; x: number}> = ({i, x}) => {
  const [ka, kb, gio] = L.tran[i]; const A = L.doi[ka], B = L.doi[kb];
  const W = 820, H = 560;
  return <div style={{position: 'absolute', left: x, top: 300, width: W, height: H}}>
    {/* nền thẻ: hai nửa màu đội, cắt chéo */}
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)', background: `linear-gradient(105deg, ${A.color} 0 49.6%, ${B.color} 50.4% 100%)`, boxShadow: '0 30px 60px rgba(0,0,0,.5)'}} />
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)', background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.45) 100%)'}} />
    <div style={{position: 'absolute', left: W / 2 - 4, top: -10, width: 8, height: H + 20, background: '#fff', transform: 'rotate(10deg)', opacity: 0.9}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: -64, textAlign: 'center'}}><Chu size={46} mau={VANG}>TRẬN {i + 1}</Chu></div>
    <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 70, top: 50, width: 290, height: 290, objectFit: 'contain', filter: 'drop-shadow(0 14px 0 rgba(0,0,0,.4))'}} />
    <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 70, top: 50, width: 290, height: 290, objectFit: 'contain', filter: 'drop-shadow(0 14px 0 rgba(0,0,0,.4))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center'}}><Chu size={120} mau={HONG} vien="#fff">VS</Chu></div>
    <div style={{position: 'absolute', left: 40, width: 360, top: 352, textAlign: 'center'}}><Chu size={52}>{A.name}</Chu></div>
    <div style={{position: 'absolute', right: 40, width: 360, top: 352, textAlign: 'center'}}><Chu size={52}>{B.name}</Chu></div>
    <div style={{position: 'absolute', left: W / 2 - 130, top: 452, width: 260, height: 78, background: NEN, transform: 'skewX(-10deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 4px ${VANG}`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 56, color: VANG, transform: 'skewX(10deg)', letterSpacing: '0.04em'}}>{gio}</div>
    </div>
  </div>;
};

export const Poster: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'brightness(.45) saturate(1.1) blur(2px)'}} />
  <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,11,20,.85) 0%, rgba(11,11,20,.35) 40%, rgba(11,11,20,.9) 100%)`}} />
  <AbsoluteFill style={{background: 'repeating-linear-gradient(-30deg, rgba(255,255,255,.035) 0 60px, transparent 60px 120px)'}} />
  {/* tiêu đề */}
  <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}><Chu size={120} mau="#fff">MATCH DAY</Chu></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 182, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 40, color: VANG, letterSpacing: '0.18em'}}>{L.vong} · {L.ngay}</div>
  <TheTran i={0} x={100} />
  <TheTran i={1} x={1000} />
  {/* chân trang */}
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg, rgba(11,11,20,0), rgba(11,11,20,.95) 40%)'}} />
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 120, bottom: 52, width: 330, height: 75, objectFit: 'contain'}} />
  <div style={{position: 'absolute', right: 120, bottom: 60, textAlign: 'right'}}><Chu size={64} mau={HONG} vien="#fff">HẸN GẶP TRÊN SÂN!</Chu></div>
</AbsoluteFill>;
