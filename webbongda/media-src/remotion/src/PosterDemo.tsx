import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OSW, VIE} from './Fifa';

// Các mẫu poster giải đấu từ ảnh thật cầu thủ (đã tách nền)
const VANG = '#f5c542', XANH = '#2f6bff', NEN = '#070b18';
const Chu: React.FC<{children: React.ReactNode; size: number; mau?: string; style?: React.CSSProperties}> = ({children, size, mau = '#fff', style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, color: mau, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.0, ...style}}>{children}</div>;
const LOGO4 = ['rhino', 'cuebots', 'evo', 'timetip'];

// ---------- Mẫu 2: chuỗi chuyển động (ngang 1920×1080) — dẫn bóng → lấy đà → sút ----------
export const PosterChuoi: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'brightness(.35) saturate(1.2) blur(4px)'}} />
  <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 55% at 62% 60%, ${XANH}77, transparent 70%), linear-gradient(90deg, ${NEN} 0%, rgba(7,11,24,.6) 35%, rgba(7,11,24,.2) 100%)`}} />
  {/* vệt sáng nền theo hướng chạy */}
  {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: 560 + i * 40, top: 560 + i * 50, width: 1000, height: 6, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${i % 2 ? VANG : '#7fb2ff'}aa, transparent)`}} />)}
  {/* ba nhịp chuyển động: mờ dần về phía sau */}
  <Img src={staticFile('p_dan_nb_slim.png')} style={{position: 'absolute', left: 560, top: 250, width: 660, height: 743, objectFit: 'contain', opacity: 0.28, filter: 'saturate(.3) brightness(1.3) drop-shadow(0 0 20px #7fb2ff)'}} />
  <Img src={staticFile('p_goc_nb_slim.png')} style={{position: 'absolute', left: 830, top: 225, width: 560, height: 767, objectFit: 'contain', opacity: 0.5, filter: 'saturate(.5) brightness(1.15) drop-shadow(0 0 20px #7fb2ff)'}} />
  <div style={{position: 'absolute', left: 1080, top: 960, width: 820, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.6)', filter: 'blur(16px)'}} />
  <Img src={staticFile('p_sut_slim.png')} style={{position: 'absolute', left: 1050, top: 160, width: 830, height: 853, objectFit: 'contain', filter: `drop-shadow(0 0 26px ${XANH}aa) drop-shadow(0 24px 30px rgba(0,0,0,.6))`}} />
  {/* chữ bên trái */}
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 110, top: 110, width: 360, height: 82, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 110, top: 260, fontFamily: VIE, fontWeight: 800, fontSize: 34, color: VANG, letterSpacing: '0.28em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
  <Chu size={150} style={{position: 'absolute', left: 104, top: 315, width: 720, lineHeight: 0.95, textShadow: '0 10px 30px rgba(0,0,0,.6)'}}>RHINO<br />BILLIARDS</Chu>
  <Chu size={190} style={{position: 'absolute', left: 100, top: 600, color: 'transparent', WebkitTextStroke: `4px ${VANG}`}}>2026</Chu>
  <div style={{position: 'absolute', left: 110, top: 850, display: 'flex', gap: 14}}>
    {['23/10', '29/10', '03/11'].map((d) => <div key={d} style={{padding: '10px 26px', border: `2px solid ${VANG}`, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 40, color: '#fff'}}>{d}</div>)}
    <div style={{padding: '10px 26px', background: VANG, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 40, color: NEN}}>15:00</div>
  </div>
  <div style={{position: 'absolute', left: 110, top: 960, display: 'flex', gap: 22, alignItems: 'center'}}>
    {LOGO4.map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 72, height: 72, objectFit: 'contain'}} />)}
  </div>
</AbsoluteFill>;

// ---------- Mẫu 3: thương hiệu "Made by Vietnam" (4:5, 1080×1350) — ảnh dẫn bóng thấy rõ logo trên áo ----------
export const PosterThuongHieu: React.FC = () => <AbsoluteFill style={{background: '#0d1a3a', overflow: 'hidden'}}>
  <AbsoluteFill style={{background: `radial-gradient(circle at 60% 55%, #2a56d8 0%, #0d1a3a 55%, #050a18 100%)`}} />
  {/* chữ RHINO khổng lồ làm nền */}
  <Chu size={420} style={{position: 'absolute', left: -30, top: 330, color: 'rgba(255,255,255,.06)', letterSpacing: '-0.02em', fontStyle: 'normal'}}>RHINO</Chu>
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1350, background: 'repeating-linear-gradient(60deg, rgba(255,255,255,.025) 0 2px, transparent 2px 26px)'}} />
  <div style={{position: 'absolute', left: 90, top: 1090, width: 920, height: 50, borderRadius: '50%', background: 'rgba(0,0,0,.55)', filter: 'blur(16px)'}} />
  <Img src={staticFile('p_dan.png')} style={{position: 'absolute', left: 40, top: 300, width: 1000, height: 954, objectFit: 'contain', filter: 'drop-shadow(0 26px 30px rgba(0,0,0,.55))'}} />
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 70, top: 70, width: 380, height: 87, objectFit: 'contain'}} />
  <div style={{position: 'absolute', right: 70, top: 80, textAlign: 'right', fontFamily: VIE, fontWeight: 800, fontSize: 26, color: VANG, letterSpacing: '0.24em', lineHeight: 1.5}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ<br /><span style={{color: '#fff'}}>RHINO BILLIARDS 2026</span></div>
  <Chu size={112} style={{position: 'absolute', left: 70, top: 190, fontStyle: 'normal', letterSpacing: '0.02em'}}>MADE BY <span style={{color: VANG}}>VIETNAM</span></Chu>
  {/* chân poster */}
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg, rgba(5,10,24,0), rgba(5,10,24,.95) 45%)'}} />
  <div style={{position: 'absolute', left: 70, right: 70, bottom: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: '0.1em'}}>VÒNG TRÒN · <span style={{color: VANG}}>23/10 · 29/10 · 03/11</span></div>
    <div style={{display: 'flex', gap: 14}}>{LOGO4.map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 58, height: 58, objectFit: 'contain'}} />)}</div>
  </div>
</AbsoluteFill>;

// ---------- Mẫu 5: đối đầu (ngang 1920×1080) — hai cầu thủ tranh bóng, cùng phong cách mẫu 2 ----------
export const PosterDoiDau: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'brightness(.35) saturate(1.2) blur(4px)'}} />
  <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 50% at 58% 55%, ${XANH}88, transparent 70%), radial-gradient(ellipse 28% 45% at 82% 55%, rgba(235,240,255,.28), transparent 70%), linear-gradient(90deg, ${NEN} 0%, rgba(7,11,24,.65) 36%, rgba(7,11,24,.15) 100%)`}} />
  {/* tia sáng chéo giữa hai cầu thủ */}
  <div style={{position: 'absolute', left: 1330, top: -100, width: 14, height: 1300, background: `linear-gradient(180deg, transparent, ${VANG}, transparent)`, transform: 'rotate(12deg)', filter: 'blur(2px)', opacity: 0.8}} />
  <div style={{position: 'absolute', left: 1300, top: -100, width: 90, height: 1300, background: `linear-gradient(180deg, transparent, ${VANG}55, transparent)`, transform: 'rotate(12deg)', filter: 'blur(24px)'}} />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 820 - i * 30, top: 520 + i * 60, width: 520, height: 6, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${i % 2 ? VANG : '#7fb2ff'}aa)`}} />)}
  <div style={{position: 'absolute', left: 920, top: 925, width: 900, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,.6)', filter: 'blur(18px)'}} />
  <Img src={staticFile('p_doi.png')} style={{position: 'absolute', left: 880, top: 90, width: 960, height: 880, objectFit: 'contain', filter: `drop-shadow(0 0 24px ${XANH}88) drop-shadow(0 24px 30px rgba(0,0,0,.6))`}} />
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 110, top: 110, width: 360, height: 82, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 110, top: 260, fontFamily: VIE, fontWeight: 800, fontSize: 34, color: VANG, letterSpacing: '0.28em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
  <Chu size={150} style={{position: 'absolute', left: 104, top: 315, width: 720, lineHeight: 0.95, textShadow: '0 10px 30px rgba(0,0,0,.6)'}}>RHINO<br />BILLIARDS</Chu>
  <Chu size={190} style={{position: 'absolute', left: 100, top: 600, color: 'transparent', WebkitTextStroke: `4px ${VANG}`}}>2026</Chu>
  <div style={{position: 'absolute', left: 110, top: 850, display: 'flex', gap: 14}}>
    {['23/10', '29/10', '03/11'].map((d) => <div key={d} style={{padding: '10px 26px', border: `2px solid ${VANG}`, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 40, color: '#fff'}}>{d}</div>)}
    <div style={{padding: '10px 26px', background: VANG, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 40, color: NEN}}>15:00</div>
  </div>
  <div style={{position: 'absolute', left: 110, top: 960, display: 'flex', gap: 22, alignItems: 'center'}}>
    {LOGO4.map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 72, height: 72, objectFit: 'contain'}} />)}
  </div>
</AbsoluteFill>;

// ---------- Mẫu 5 bản dọc (1080×1920) ----------
export const PosterDoiDauDoc: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', left: -700, top: 0, width: 2480, height: 1400, objectFit: 'cover', filter: 'brightness(.35) saturate(1.2) blur(4px)'}} />
  <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 25% at 35% 55%, ${XANH}88, transparent 70%), radial-gradient(ellipse 40% 22% at 75% 55%, rgba(235,240,255,.25), transparent 70%), linear-gradient(180deg, rgba(7,11,24,.75) 0%, rgba(7,11,24,.25) 30%, rgba(7,11,24,.3) 62%, ${NEN} 82%)`}} />
  {/* chữ 2026 lớn phía sau cầu thủ */}
  <Chu size={380} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', color: 'transparent', WebkitTextStroke: `4px ${VANG}99`}}>2026</Chu>
  {/* tia sáng chéo giữa hai cầu thủ */}
  <div style={{position: 'absolute', left: 650, top: 300, width: 12, height: 1400, background: `linear-gradient(180deg, transparent, ${VANG}, transparent)`, transform: 'rotate(12deg)', filter: 'blur(2px)', opacity: 0.8}} />
  <div style={{position: 'absolute', left: 620, top: 300, width: 80, height: 1400, background: `linear-gradient(180deg, transparent, ${VANG}55, transparent)`, transform: 'rotate(12deg)', filter: 'blur(24px)'}} />
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: -40 - i * 20, top: 900 + i * 70, width: 420, height: 6, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${i % 2 ? VANG : '#7fb2ff'}aa)`}} />)}
  <div style={{position: 'absolute', left: 60, top: 1500, width: 960, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.6)', filter: 'blur(18px)'}} />
  <Img src={staticFile('p_doi.png')} style={{position: 'absolute', left: 20, top: 540, width: 1040, height: 1009, objectFit: 'contain', filter: `drop-shadow(0 0 24px ${XANH}88) drop-shadow(0 24px 30px rgba(0,0,0,.6))`}} />
  {/* đầu poster */}
  <Img src={staticFile('rhino_logo_trang.png')} style={{position: 'absolute', left: 340, top: 80, width: 400, height: 92, objectFit: 'contain'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: VANG, letterSpacing: '0.3em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
  <Chu size={132} style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', textShadow: '0 10px 30px rgba(0,0,0,.6)'}}>RHINO BILLIARDS</Chu>
  {/* chân poster */}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1620, display: 'flex', justifyContent: 'center', gap: 16}}>
    {['23/10', '29/10', '03/11'].map((d) => <div key={d} style={{padding: '12px 30px', border: `2px solid ${VANG}`, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 48, color: '#fff'}}>{d}</div>)}
    <div style={{padding: '12px 30px', background: VANG, transform: 'skewX(-10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 48, color: NEN}}>15:00</div>
  </div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 1730, display: 'flex', justifyContent: 'center', gap: 48}}>
    {LOGO4.map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 135, height: 135, objectFit: 'contain', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))'}} />)}
  </div>
</AbsoluteFill>;
