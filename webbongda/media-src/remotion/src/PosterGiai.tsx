import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OSW, VIE} from './Fifa';

// Poster giải đấu (dọc 1080×1920) từ ảnh thật cầu thủ đã tách nền
const VANG = '#f5c542', XANH = '#2f6bff', NEN = '#070b18';
const Chu: React.FC<{children: React.ReactNode; size: number; mau?: string; style?: React.CSSProperties}> = ({children, size, mau = '#fff', style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, color: mau, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.0, ...style}}>{children}</div>;

const LICH = [['23/10', 'Lượt 1'], ['29/10', 'Lượt 2'], ['03/11', 'Lượt 3']];
const GIAI = [['GIẢI NHẤT', '10.000.000đ', 'Cúp vàng + huy chương'], ['GIẢI NHÌ', '7.000.000đ', 'Huy chương'], ['ĐỒNG GIẢI BA', '4.000.000đ', 'Huy chương']];

export const PosterGiai: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  {/* nền sân vận động + ánh đèn */}
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', left: -400, top: 0, width: 1880, height: 1150, objectFit: 'cover', filter: 'brightness(.5) saturate(1.2) blur(3px)'}} />
  <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(7,11,24,.55) 0%, rgba(7,11,24,.2) 30%, ${NEN} 62%)`}} />
  <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 30% at 50% 47%, ${XANH}aa, transparent 70%)`}} />
  {[-18, -8, 6, 16].map((r, i) => <div key={i} style={{position: 'absolute', left: 140 + i * 230, top: -200, width: 70, height: 1500, background: 'linear-gradient(180deg, rgba(255,255,255,.28), transparent 80%)', transform: `rotate(${r}deg)`, filter: 'blur(14px)', mixBlendMode: 'screen'}} />)}

  {/* chữ lớn phía sau cầu thủ */}
  <div style={{position: 'absolute', left: -20, right: -20, top: 300, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontStyle: 'italic', fontSize: 470, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${VANG}88`, letterSpacing: '-0.02em'}}>2026</div>

  {/* đầu trang */}
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 340, top: 60, width: 400, height: 92, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 34, color: VANG, letterSpacing: '0.32em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
  <Chu size={120} style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', textShadow: '0 8px 30px rgba(0,0,0,.6)'}}>RHINO BILLIARDS</Chu>

  {/* vệt chuyển động phía sau cầu thủ */}
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 40 - i * 30, top: 760 + i * 70, width: 420 - i * 40, height: 10 - i, borderRadius: 6, background: `linear-gradient(90deg, transparent, ${i % 2 ? VANG : '#7fb2ff'})`, opacity: 0.75}} />)}
  <div style={{position: 'absolute', left: 850, top: 1370, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${VANG}66, transparent 70%)`}} />

  {/* cầu thủ (ảnh thật, đã tách nền) */}
  <Img src={staticFile('p_sut.png')} style={{position: 'absolute', left: 30, top: 470, width: 1020, height: 1061, objectFit: 'contain', filter: `drop-shadow(0 0 30px ${XANH}88) drop-shadow(0 30px 40px rgba(0,0,0,.6))`}} />
  {/* bóng đổ dưới chân */}
  <div style={{position: 'absolute', left: 120, top: 1500, width: 860, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.55)', filter: 'blur(18px)'}} />

  {/* khung thông tin dưới */}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1545, height: 375, background: `linear-gradient(180deg, ${NEN}00, ${NEN} 18%)`}} />
  <div style={{position: 'absolute', left: 60, right: 60, top: 1560, display: 'flex', alignItems: 'center', gap: 18}}>
    <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: VANG, letterSpacing: '0.2em', width: 210}}>VÒNG TRÒN<br /><span style={{color: '#fff'}}>15:00</span></div>
    {LICH.map(([d, l]) => <div key={d} style={{flex: 1, height: 96, border: `2px solid ${VANG}`, transform: 'skewX(-10deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,197,66,.08)'}}>
      <div style={{transform: 'skewX(10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 46, color: '#fff', lineHeight: 1}}>{d}</div>
      <div style={{transform: 'skewX(10deg)', fontFamily: VIE, fontWeight: 600, fontSize: 20, color: '#c8d2ea', letterSpacing: '0.1em'}}>{l.toUpperCase()}</div>
    </div>)}
  </div>
  <div style={{position: 'absolute', left: 60, right: 60, top: 1690, display: 'flex', gap: 16}}>
    {GIAI.map(([t, tien, kem], i) => <div key={t} style={{flex: 1, padding: '14px 0', background: i === 0 ? VANG : 'rgba(255,255,255,.07)', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,.18)', borderRadius: 10, textAlign: 'center'}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 22, letterSpacing: '0.14em', color: i === 0 ? NEN : VANG}}>{t}</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 44, color: i === 0 ? NEN : '#fff', lineHeight: 1.15}}>{tien}</div>
      <div style={{fontFamily: VIE, fontWeight: 600, fontSize: 18, color: i === 0 ? '#3a2a00' : '#aab6d0'}}>{kem}</div>
    </div>)}
  </div>
  <div style={{position: 'absolute', left: 60, right: 60, top: 1838, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    {['rhino', 'cuebots', 'evo', 'timetip'].map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 66, height: 66, objectFit: 'contain'}} />)}
    <div style={{fontFamily: VIE, fontWeight: 600, fontSize: 22, color: '#aab6d0', letterSpacing: '0.08em'}}>Công ty TNHH Carbon Billiards</div>
  </div>
</AbsoluteFill>;
