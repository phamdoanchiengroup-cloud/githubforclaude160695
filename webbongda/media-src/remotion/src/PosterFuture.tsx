import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {OSW, VIE} from './Fifa';
import {MONO} from './Future';

// Poster futuristic (ngang 1920×1080): HUD neon, hologram, ảnh thật cầu thủ đã tách nền
const CY = '#3ff4ff', MG = '#ff2ea6', VANG = '#ffd84a', NEN = '#02040c';

const Khung: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode; mau?: string}> = ({x, y, w, h, children, mau = CY}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: 'rgba(8,30,48,.55)', border: `1.5px solid ${mau}66`, boxShadow: `0 0 24px ${mau}33, inset 0 0 30px ${mau}14`, clipPath: 'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 60, height: 3, background: mau}} />
    <div style={{position: 'absolute', right: 0, bottom: 0, width: 60, height: 3, background: mau}} />
    {children}
  </div>;
const Nhan: React.FC<{children: React.ReactNode; mau?: string}> = ({children, mau = CY}) =>
  <div style={{fontFamily: MONO, fontSize: 18, color: mau, letterSpacing: '0.24em', opacity: 0.9}}>{children}</div>;

export const PosterFuture: React.FC = () => <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
  {/* nền: sân vận động tối + sương neon */}
  <Img src={staticFile('stadium.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'brightness(.22) saturate(1.4) hue-rotate(10deg) blur(5px)'}} />
  <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 55% at 66% 52%, ${CY}30, transparent 70%), radial-gradient(ellipse 30% 35% at 88% 80%, ${MG}2e, transparent 70%), linear-gradient(90deg, ${NEN} 0%, rgba(2,4,12,.75) 38%, rgba(2,4,12,.15) 100%)`}} />
  {/* sàn lưới hologram phối cảnh */}
  <div style={{position: 'absolute', left: -600, right: -600, top: 760, height: 700, perspective: 520}}>
    <div style={{position: 'absolute', inset: 0, transform: 'rotateX(74deg)', transformOrigin: '50% 0', backgroundImage: `linear-gradient(${CY}55 2px, transparent 2px), linear-gradient(90deg, ${CY}55 2px, transparent 2px)`, backgroundSize: '110px 110px', maskImage: 'linear-gradient(180deg, #000 0%, transparent 85%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 85%)'}} />
  </div>
  {/* vòng HUD quanh cầu thủ */}
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
    <g transform="translate(1330 560)" fill="none">
      <circle r={430} stroke={CY} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 14" />
      <circle r={380} stroke={CY} strokeOpacity={0.5} strokeWidth={1.5} />
      <path d="M 400 0 A 400 400 0 0 1 -120 381" stroke={CY} strokeWidth={6} strokeLinecap="round" />
      <path d="M -400 0 A 400 400 0 0 1 120 -381" stroke={MG} strokeWidth={4} strokeLinecap="round" />
      {Array.from({length: 72}, (_, i) => {const a = i * 5 * Math.PI / 180, r1 = i % 6 ? 452 : 440; return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * 462} y2={Math.sin(a) * 462} stroke={CY} strokeOpacity={0.55} strokeWidth={i % 6 ? 1 : 3} />;})}
    </g>
    {/* chữ thập ngắm ở chân trụ */}
    <g stroke={MG} strokeWidth={2} fill="none" opacity={0.8}><circle cx={1710} cy={940} r={70} /><line x1={1620} y1={940} x2={1800} y2={940} /><line x1={1710} y1={850} x2={1710} y2={1030} /></g>
  </svg>
  {/* hai nhịp trước: bóng hologram */}
  {[['p_dan_nb_slim.png', 760, 300, 600, 676, 0.22], ['p_goc_nb_slim.png', 940, 270, 520, 712, 0.38]].map(([f, x, y, w, h, o]) =>
    <Img key={f as string} src={staticFile(f as string)} style={{position: 'absolute', left: x as number, top: y as number, width: w as number, height: h as number, objectFit: 'contain', opacity: o as number, filter: `grayscale(1) brightness(1.6) sepia(1) hue-rotate(140deg) saturate(5) drop-shadow(0 0 16px ${CY})`}} />)}
  {/* cầu thủ chính: tách màu RGB nhẹ + viền neon */}
  <Img src={staticFile('p_sut_slim.png')} style={{position: 'absolute', left: 952, top: 170, width: 800, height: 822, objectFit: 'contain', opacity: 0.55, filter: 'brightness(0) invert(1) sepia(1) hue-rotate(290deg) saturate(8) blur(1px)', mixBlendMode: 'screen'}} />
  <Img src={staticFile('p_sut_slim.png')} style={{position: 'absolute', left: 968, top: 170, width: 800, height: 822, objectFit: 'contain', opacity: 0.55, filter: 'brightness(0) invert(1) sepia(1) hue-rotate(140deg) saturate(8) blur(1px)', mixBlendMode: 'screen'}} />
  <Img src={staticFile('p_sut_slim.png')} style={{position: 'absolute', left: 960, top: 170, width: 800, height: 822, objectFit: 'contain', filter: `drop-shadow(0 0 3px ${CY}) drop-shadow(0 0 22px ${CY}88) contrast(1.05) saturate(1.1)`}} />
  {/* vạch quét */}
  <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 5px)', mixBlendMode: 'multiply'}} />

  {/* tiêu đề */}
  <div style={{position: 'absolute', left: 110, top: 70, display: 'flex', alignItems: 'center', gap: 24}}>
    <Img src={staticFile('rhino_logo_trang.png')} style={{width: 300, height: 68, objectFit: 'contain'}} />
    <div style={{width: 2, height: 54, background: `${CY}88`}} />
    <Nhan>RB-26 // TOURNAMENT PROTOCOL</Nhan>
  </div>
  <div style={{position: 'absolute', left: 110, top: 200, fontFamily: VIE, fontWeight: 800, fontSize: 32, color: CY, letterSpacing: '0.32em', textShadow: `0 0 14px ${CY}`}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
  {[[MG, -4, 0.75], [CY, 4, 0.75], ['#fff', 0, 1]].map(([m, dx, o], i) =>
    <div key={i} style={{position: 'absolute', left: 104 + (dx as number), top: 245, fontFamily: OSW, fontWeight: 700, fontSize: 148, lineHeight: 0.95, color: m as string, opacity: o as number, mixBlendMode: i < 2 ? 'screen' : 'normal', textShadow: i === 2 ? `0 0 30px ${CY}88` : undefined}}>RHINO<br />BILLIARDS</div>)}
  <div style={{position: 'absolute', left: 108, top: 545, fontFamily: OSW, fontWeight: 700, fontSize: 150, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${VANG}`, textShadow: `0 0 26px ${VANG}66`, letterSpacing: '0.04em'}}>2026</div>

  {/* khung dữ liệu: lịch vòng tròn */}
  <Khung x={110} y={740} w={700} h={150}>
    <div style={{position: 'absolute', left: 26, top: 18}}><Nhan>// LỊCH VÒNG TRÒN · 15:00</Nhan></div>
    <div style={{position: 'absolute', left: 26, right: 26, top: 56, display: 'flex', justifyContent: 'space-between'}}>
      {[['23/10', 'LƯỢT 01'], ['29/10', 'LƯỢT 02'], ['03/11', 'LƯỢT 03']].map(([d, l]) => <div key={d}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 52, color: '#fff', lineHeight: 1, textShadow: `0 0 16px ${CY}88`}}>{d}</div>
        <div style={{fontFamily: MONO, fontSize: 16, color: CY, letterSpacing: '0.2em', marginTop: 6}}>{l}</div>
      </div>)}
    </div>
  </Khung>
  {/* khung dữ liệu: 4 đội */}
  <Khung x={110} y={912} w={700} h={110} mau={MG}>
    <div style={{position: 'absolute', left: 26, top: 14}}><Nhan mau={MG}>// 04 ĐỘI THAM DỰ</Nhan></div>
    <div style={{position: 'absolute', left: 26, right: 26, top: 40, display: 'flex', justifyContent: 'space-between'}}>
      {['rhino', 'cuebots', 'evo', 'timetip'].map((k) => <Img key={k} src={staticFile(`logo_${k}.png`)} style={{width: 62, height: 62, objectFit: 'contain', filter: `drop-shadow(0 0 8px ${MG}88)`}} />)}
    </div>
  </Khung>
  {/* nhãn giải thưởng góc phải trên */}
  <Khung x={1440} y={70} w={390} h={120} mau={VANG}>
    <div style={{position: 'absolute', left: 22, top: 16}}><Nhan mau={VANG}>// GIẢI NHẤT</Nhan></div>
    <div style={{position: 'absolute', left: 22, top: 44, fontFamily: OSW, fontWeight: 700, fontSize: 56, color: '#fff', textShadow: `0 0 18px ${VANG}88`}}>10.000.000đ</div>
  </Khung>
  <div style={{position: 'absolute', right: 90, bottom: 40, fontFamily: MONO, fontSize: 16, color: CY, letterSpacing: '0.2em', opacity: 0.75}}>CÔNG TY TNHH CARBON BILLIARDS · SYS.READY ●</div>
</AbsoluteFill>;
