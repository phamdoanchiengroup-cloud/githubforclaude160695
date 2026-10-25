import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {OSW, VIE} from './Fifa';
import {CY, MONO, cl, Scanlines, Goc, Telemetry, Go, Glitch, BauTroi} from './Future';
import theData from './giai_the.json';
import vo from './giai_vo.json';

// Video giới thiệu giải đấu – phong cách tương lai (HUD, hologram), lời đọc giọng nữ
const V = vo as Record<string, number>;
const THE = theData as {img: string; team: string}[];
const GOLD = '#ffd36a';
const DOI = [
  {key: 'rhino', name: 'RHINO FC', color: '#f0c86e'},
  {key: 'cuebots', name: 'CUEBOTS FC', color: '#d7dcf0'},
  {key: 'evo', name: 'EVO FC', color: '#ff6e5f'},
  {key: 'timetip', name: 'TIME-TIP FC', color: '#5acdff'},
];
const TEN: Record<string, string> = {rhino: 'RHINO FC', cuebots: 'CUEBOTS FC', evo: 'EVO FC', timetip: 'TIME-TIP FC'};
const LICH: [string, string, [string, string][]][] = [
  ['LƯỢT 1', 'THỨ SÁU · 23/10', [['cuebots', 'timetip'], ['rhino', 'evo']]],
  ['LƯỢT 2', 'THỨ NĂM · 29/10', [['evo', 'cuebots'], ['rhino', 'timetip']]],
  ['LƯỢT 3', 'THỨ BA · 03/11', [['evo', 'timetip'], ['rhino', 'cuebots']]],
];
const nen = (o = 1) => <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #0a2238, #01040b 72%)', opacity: o}} />;
const Luoi: React.FC<{o?: number}> = ({o = 1}) => <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, ${CY}10 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, ${CY}10 0 1px, transparent 1px 60px)`, opacity: o}} />;
const dem = (v: number) => (Math.round(v / 1000) * 1000).toLocaleString('de-DE');   // 10.000.000
// ảnh cúp/huy chương cắt từ ảnh cơ cấu giải: làm mờ viền cho hoà vào nền
const CupImg: React.FC<{src: string; h: number; glow?: string; style?: React.CSSProperties}> = ({src, h, glow = GOLD, style}) =>
  <Img src={staticFile(`giai/${src}.png`)} style={{height: h, maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)', filter: `drop-shadow(0 0 30px ${glow}88) saturate(1.15) contrast(1.05)`, ...style}} />;

// ---------- 1. Mở màn ----------
const S1 = 260;
const MoMan: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const ring = interpolate(f, [5, 70], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const t1 = spring({frame: f - 60, fps, config: {damping: 16}});
  const quet = interpolate(f, [60, 105], [0, 1], cl);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    {nen()}<Luoi o={ring} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(960 520) rotate(${f * 0.7})`} fill="none" stroke={CY} opacity={0.55}>
        <circle r={480 * ring} strokeWidth={2} strokeDasharray="6 14" /><circle r={400 * ring} strokeWidth={1} />
        <path d={`M ${360 * ring} 0 A ${360 * ring} ${360 * ring} 0 0 1 0 ${360 * ring}`} strokeWidth={6} />
      </g>
    </svg>
    <div style={{position: 'absolute', left: 130, top: 120, fontFamily: MONO, fontSize: 22, color: CY, lineHeight: 1.7}}>
      <div><Go text="> KHỞI ĐỘNG RB-26 TOURNAMENT SYSTEM" at={2} /></div>
      <div><Go text="> NẠP DỮ LIỆU: 4 ĐỘI · 64 CẦU THỦ ... OK" at={22} /></div>
    </div>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <Img src={staticFile('rh/logo.png')} style={{width: 420, opacity: interpolate(f, [30, 55], [0, 1], cl), filter: `drop-shadow(0 0 24px ${CY})`, marginBottom: 30}} />
      <div style={{fontFamily: MONO, fontSize: 28, color: CY, letterSpacing: '0.5em', opacity: t1}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
      <div style={{position: 'relative', marginTop: 16}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 150, lineHeight: 1, color: '#e9fdff', letterSpacing: '0.04em', textShadow: `0 0 26px ${CY}, 0 0 70px ${CY}77`, clipPath: `inset(0 ${100 - quet * 100}% 0 0)`}}>RHINO BILLIARDS 2026</div>
        {quet > 0 && quet < 1 && <div style={{position: 'absolute', top: -20, bottom: -20, left: `${quet * 100}%`, width: 4, background: CY, boxShadow: `0 0 26px 6px ${CY}`}} />}
      </div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, color: GOLD, letterSpacing: '0.18em', marginTop: 34, opacity: interpolate(f, [130, 155], [0, 1], cl)}}>NHÀ TÀI TRỢ · CÔNG TY CARBON BILLIARDS</div>
    </AbsoluteFill>
    <Goc /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 2. Bốn đội bóng ----------
const S2 = 384, LOGO_AT = [168, 220, 272, 330];
const BonDoi: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const so = interpolate(f, [10, 60], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const chu = interpolate(f, [8, 24, 140, 160], [0, 1, 1, 0], cl);
  const cot = 16, wTh = 150, hTh = 208;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    {nen()}
    {/* tường 64 thẻ cầu thủ trôi chậm, nhuộm hologram */}
    <AbsoluteFill style={{perspective: 1200}}>
      <div style={{position: 'absolute', left: -200, top: -60, width: cot * (wTh + 14), transform: `rotateY(-14deg) rotateX(8deg) translateX(${-f * 1.2}px)`, display: 'flex', flexWrap: 'wrap', gap: 14, opacity: 0.55}}>
        {[...THE, ...THE].slice(0, 96).map((t, i) => {
          const sang = random(`s${i}`) < 0.18 && Math.floor(f / 20 + i) % 7 === 0;
          return <Img key={i} src={staticFile(t.img)} style={{width: wTh, height: hTh, objectFit: 'contain', filter: sang ? 'none' : `sepia(1) hue-rotate(150deg) saturate(3) brightness(.8)`, opacity: sang ? 1 : 0.7}} />;
        })}
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(1,4,11,.75), rgba(1,4,11,.35) 40%, rgba(1,4,11,.85))'}} />
    {/* con số lớn */}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: chu}}>
      <div style={{display: 'flex', gap: 120, alignItems: 'flex-end'}}>
        {[[4, 'ĐỘI BÓNG'], [64, 'CẦU THỦ'], [1, 'CÚP VÔ ĐỊCH']].map(([n, t], i) => <div key={i} style={{textAlign: 'center', opacity: interpolate(f, [10 + i * 40, 30 + i * 40], [0, 1], cl)}}>
          <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 200, lineHeight: 1, color: i === 2 ? GOLD : '#fff', textShadow: `0 0 40px ${i === 2 ? GOLD : CY}`}}>{String(Math.round((n as number) * interpolate(f, [10 + i * 40, 50 + i * 40], [0, 1], cl))).padStart(2, '0')}</div>
          <div style={{fontFamily: MONO, fontSize: 28, color: CY, letterSpacing: '0.35em', marginTop: 10}}>{t}</div>
        </div>)}
      </div>
    </AbsoluteFill>
    {/* bốn logo lần lượt quét hiện */}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', gap: 60}}>
        {DOI.map((d, i) => {
          const at = LOGO_AT[i], p = interpolate(f, [at, at + 22], [0, 1], cl), s = spring({frame: f - at, fps, config: {damping: 12}});
          if (f < at) return <div key={i} style={{width: 380}} />;
          return <div key={i} style={{width: 380, textAlign: 'center', transform: `scale(${0.8 + 0.2 * s})`}}>
            <div style={{position: 'relative', width: 340, height: 360, margin: '0 auto'}}>
              <Img src={staticFile(`logo_${d.key}.png`)} style={{position: 'absolute', inset: 0, width: 340, height: 360, objectFit: 'contain', filter: `sepia(1) hue-rotate(150deg) saturate(4) drop-shadow(0 0 18px ${CY})`, opacity: 0.6 * (1 - p)}} />
              <Img src={staticFile(`logo_${d.key}.png`)} style={{position: 'absolute', inset: 0, width: 340, height: 360, objectFit: 'contain', clipPath: `inset(${100 - p * 100}% 0 0 0)`, filter: `drop-shadow(0 0 ${22 + 8 * Math.sin(f / 7 + i)}px ${d.color})`}} />
              {p > 0 && p < 1 && <div style={{position: 'absolute', left: -20, right: -20, top: `${(1 - p) * 100}%`, height: 4, background: CY, boxShadow: `0 0 20px 5px ${CY}`}} />}
            </div>
            <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 52, color: '#fff', marginTop: 18, opacity: p, textShadow: `0 0 20px ${d.color}`}}>{d.name}</div>
            <div style={{width: 200 * p, height: 3, background: d.color, margin: '10px auto 0', boxShadow: `0 0 12px ${d.color}`}} />
          </div>;
        })}
      </div>
    </AbsoluteFill>
    <Goc /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 3. Trận khai mạc ----------
const S3 = 230;
const KhaiMac: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hit = 20, p = interpolate(f, [0, hit], [0, 1], {...cl, easing: Easing.in(Easing.quad)}), back = spring({frame: f - hit, fps, config: {damping: 10}});
  const lx = f < hit ? -300 + 1060 * p : 760 - 220 * back, rx = f < hit ? 2220 - 1060 * p : 1160 + 220 * back;
  const sock = interpolate(f, [hit, hit + 30], [0, 1], cl);
  const chu = spring({frame: f - 40, fps, config: {damping: 15}});
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <BauTroi />
    <AbsoluteFill style={{background: 'rgba(1,4,11,.45)'}} />
    {f >= hit && <div style={{position: 'absolute', left: 960 - sock * 1100, top: 470 - sock * 1100, width: sock * 2200, height: sock * 2200, borderRadius: '50%', border: `10px solid ${CY}`, opacity: 1 - sock}} />}
    {f >= hit && f < hit + 6 && <AbsoluteFill style={{background: '#e9fdff', opacity: interpolate(f, [hit, hit + 6], [0.7, 0], cl)}} />}
    <Img src={staticFile('logo_retro.png')} style={{position: 'absolute', width: 380, height: 400, objectFit: 'contain', left: lx - 190, top: 270, filter: 'drop-shadow(0 0 30px #f0c46c)'}} />
    <Img src={staticFile('logo_juni.png')} style={{position: 'absolute', width: 380, height: 400, objectFit: 'contain', left: rx - 190, top: 270, filter: 'drop-shadow(0 0 30px #46dcff)'}} />
    {f >= hit + 4 && <div style={{position: 'absolute', left: 0, right: 0, top: 390, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 140, color: '#fff', textShadow: `0 0 40px ${CY}`}}>VS</div>}
    <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: chu}}>
      <div style={{fontFamily: MONO, fontSize: 26, color: CY, letterSpacing: '0.45em'}}>◢ KHAI MÀN GIẢI ĐẤU ◣</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 68, color: GOLD, marginTop: 12, letterSpacing: '0.08em'}}>TRẬN GIAO HỮU KHAI MẠC</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', opacity: chu}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 56, color: '#fff'}}>FC RETRO <span style={{color: GOLD}}>·</span> JUNIORS FC</div>
      <div style={{display: 'inline-block', marginTop: 22, padding: '12px 40px', border: `2px solid ${CY}`, background: 'rgba(4,20,32,.7)', fontFamily: OSW, fontWeight: 700, fontSize: 54, color: CY, letterSpacing: '0.08em', boxShadow: `0 0 30px ${CY}55`}}>15:00 · THỨ BA · 20/10/2026</div>
    </div>
    <Goc /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 4. Lịch thi đấu vòng tròn ----------
const S4 = 210;
const LichDau: React.FC = () => {
  const f = useCurrentFrame();
  const tieu = interpolate(f, [4, 22], [0, 1], cl);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    {nen()}<Luoi />
    <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: tieu}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: CY, letterSpacing: '0.45em'}}>LỊCH THI ĐẤU · 15:00</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 70, color: '#fff', marginTop: 10, letterSpacing: '0.06em', textShadow: `0 0 24px ${CY}88`}}>VÒNG TRÒN MỘT LƯỢT</div>
    </div>
    <div style={{position: 'absolute', left: 110, right: 110, top: 300, display: 'flex', gap: 40}}>
      {LICH.map(([luot, ngay, tran], c) => {
        const at = 26 + c * 42, o = interpolate(f, [at, at + 18], [0, 1], cl);
        return <div key={c} style={{flex: 1, opacity: o, transform: `translateY(${(1 - o) * 40}px)`, border: `1px solid ${CY}66`, background: 'linear-gradient(180deg, rgba(4,26,40,.85), rgba(4,20,32,.55))', borderTop: `5px solid ${c === 0 ? GOLD : CY}`, padding: '24px 30px 30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 48, color: c === 0 ? GOLD : '#fff'}}>{luot}</div>
            <div style={{fontFamily: MONO, fontSize: 24, color: CY}}>{ngay}</div>
          </div>
          {tran.map(([a, b], j) => {
            const q = interpolate(f, [at + 14 + j * 12, at + 30 + j * 12], [0, 1], cl);
            return <div key={j} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, padding: '18px 10px', borderTop: `1px solid ${CY}33`, opacity: q}}>
              <div style={{textAlign: 'center', width: 170}}><Img src={staticFile(`logo_${a}.png`)} style={{height: 120, objectFit: 'contain'}} /><div style={{fontFamily: OSW, fontWeight: 700, fontSize: 24, color: '#fff', marginTop: 6}}>{TEN[a]}</div></div>
              <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 44, color: GOLD}}>VS</div>
              <div style={{textAlign: 'center', width: 170}}><Img src={staticFile(`logo_${b}.png`)} style={{height: 120, objectFit: 'contain'}} /><div style={{fontFamily: OSW, fontWeight: 700, fontSize: 24, color: '#fff', marginTop: 6}}>{TEN[b]}</div></div>
            </div>;
          })}
        </div>;
      })}
    </div>
    {/* vạch quét ngang bảng */}
    <div style={{position: 'absolute', left: 0, right: 0, top: interpolate(f, [20, 150], [260, 1040], cl), height: 3, background: CY, boxShadow: `0 0 24px 6px ${CY}`, opacity: interpolate(f, [20, 30, 140, 150], [0, 0.8, 0.8, 0], cl)}} />
    <Goc /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 5. Giải thưởng ----------
const S5 = 625, P_TONG = 0, P_NHAT = 120, P_NB = 245, P_CN = 390;
const Khung: React.FC<{o: number; mau?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({o, mau = CY, style, children}) =>
  <div style={{position: 'absolute', opacity: o, transform: `translateY(${(1 - o) * 40}px) scale(${0.96 + 0.04 * o})`, border: `2px solid ${mau}aa`, background: 'linear-gradient(135deg, rgba(4,30,44,.88), rgba(2,14,24,.7))', boxShadow: `0 0 40px ${mau}33, inset 0 0 30px ${mau}22`, clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)', ...style}}>{children}</div>;
const GiaiThuong: React.FC = () => {
  const f = useCurrentFrame();
  const pha = (a: number, b: number) => interpolate(f, [a, a + 16, b - 12, b], [0, 1, 1, 0], cl);
  const tong = 22500000 * interpolate(f, [12, 80], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const oT = pha(P_TONG, P_NHAT), oN = pha(P_NHAT, P_NB), oNB = pha(P_NB, P_CN), oCN = interpolate(f, [P_CN, P_CN + 16], [0, 1], cl) * interpolate(f, [S5 - 14, S5], [1, 0], cl);
  const so = (v: number, a: number) => dem(v * interpolate(f, [a, a + 50], [0, 1], {...cl, easing: Easing.out(Easing.cubic)}));
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    {nen()}<Luoi o={0.6} />
    {/* tia đèn */}
    {[300, 1620].map((x, i) => <div key={i} style={{position: 'absolute', left: x - 300, top: -60, width: 600, height: 1100, background: 'linear-gradient(180deg, rgba(160,240,255,.25), transparent 75%)', clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)', mixBlendMode: 'screen', opacity: 0.7 + 0.2 * Math.sin(f / 10 + i)}} />)}
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center'}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 62, color: '#fff', letterSpacing: '0.08em', textShadow: `0 0 24px ${CY}`}}>CƠ CẤU GIẢI THƯỞNG</div>
    </div>
    {/* tổng giải */}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oT}}>
      <div style={{fontFamily: MONO, fontSize: 30, color: CY, letterSpacing: '0.4em'}}>TỔNG GIÁ TRỊ GIẢI THƯỞNG</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 200, color: GOLD, lineHeight: 1.1, textShadow: '0 0 50px #ffb40088'}}>{dem(tong)}<span style={{fontSize: 70}}> đ</span></div>
    </AbsoluteFill>
    {/* giải nhất */}
    <Khung o={oN} mau={GOLD} style={{left: 230, right: 230, top: 230, height: 640, display: 'flex', alignItems: 'center', gap: 50, padding: '0 70px'}}>
      <CupImg src="cup" h={520} style={{transform: `translateY(${Math.sin(f / 15) * 8}px)`}} />
      <div>
        <div style={{display: 'inline-block', fontFamily: VIE, fontWeight: 800, fontSize: 48, color: '#01040b', background: GOLD, padding: '6px 30px', letterSpacing: '0.1em'}}>GIẢI NHẤT</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 160, color: GOLD, lineHeight: 1.05, whiteSpace: 'nowrap', textShadow: '0 0 40px #ffb40088'}}>{so(10000000, P_NHAT + 10)}<span style={{fontSize: 56}}> đồng</span></div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, color: '#e9fdff', letterSpacing: '0.06em'}}>KÈM CÚP VÀNG VÀ HUY CHƯƠNG LƯU NIỆM</div>
      </div>
    </Khung>
    {/* nhì và ba */}
    {[['bac', 'GIẢI NHÌ', 7000000, '#dfe6f0', 140], ['dong', 'ĐỒNG GIẢI BA', 4000000, '#e0915a', 990]].map(([img, ten, tien, mau, x], i) => (
      <Khung key={i} o={oNB * interpolate(f, [P_NB + i * 20, P_NB + 16 + i * 20], [0, 1], cl)} mau={mau as string} style={{left: x as number, width: 790, top: 290, height: 560, padding: '40px 50px', textAlign: 'center'}}>
        <CupImg src={img as string} h={260} glow={mau as string} />
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 44, color: mau as string, letterSpacing: '0.1em', marginTop: 10}}>{ten}</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 120, color: '#fff', lineHeight: 1.1, textShadow: `0 0 30px ${mau}88`}}>{so(tien as number, P_NB + 10 + i * 20)}<span style={{fontSize: 44}}> đồng</span></div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#cfefff'}}>KÈM HUY CHƯƠNG LƯU NIỆM</div>
      </Khung>
    ))}
    {/* giải cá nhân */}
    {[['qbv', 'CẦU THỦ XUẤT SẮC NHẤT'], ['giay', 'VUA PHÁ LƯỚI'], ['gk', 'THỦ MÔN XUẤT SẮC NHẤT']].map(([img, ten], i) => {
      const at = P_CN + 40 + i * 50, o = oCN * interpolate(f, [at, at + 16], [0, 1], cl);
      return <Khung key={i} o={o} style={{left: 110 + i * 580, width: 540, top: 270, height: 600, padding: '40px 30px', textAlign: 'center'}}>
        <div style={{height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CupImg src={img} h={img === 'gk' ? 200 : 270} /></div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, color: CY, letterSpacing: '0.04em', marginTop: 16, minHeight: 90}}>{ten}</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 100, color: '#fff', lineHeight: 1.05, textShadow: `0 0 26px ${CY}88`}}>{so(500000, at + 6)}<span style={{fontSize: 36}}> đồng</span></div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 24, color: '#cfefff', marginTop: 6}}>KÈM CÚP LƯU NIỆM</div>
      </Khung>;
    })}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 30, color: GOLD, letterSpacing: '0.2em'}}>NHÀ TÀI TRỢ · CÔNG TY CARBON BILLIARDS</div>
    <Goc mau={GOLD} /><Telemetry /><Scanlines />
  </AbsoluteFill>;
};

// ---------- 6. Kết ----------
const S6 = 260;
const KetGiai: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const c = spring({frame: f - 10, fps, config: {damping: 14}});
  const den = interpolate(f, [S6 - 24, S6], [0, 1], cl);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <BauTroi />
    <AbsoluteFill style={{background: 'rgba(1,4,11,.5)'}} />
    {/* bốn logo xoay quanh tiêu đề */}
    {DOI.map((d, i) => {
      const g = f / 40 + i * Math.PI / 2, x = 960 + Math.cos(g) * 780, y = 540 + Math.sin(g) * 390, s = 0.75 + 0.25 * (Math.sin(g) + 1) / 2;
      return <Img key={i} src={staticFile(`logo_${d.key}.png`)} style={{position: 'absolute', width: 200, height: 210, objectFit: 'contain', left: x - 100, top: y - 105, transform: `scale(${s * c})`, zIndex: Math.round(s * 10), filter: `drop-shadow(0 0 20px ${d.color})`, opacity: 0.95}} />;
    })}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 9, opacity: c}}>
      <div style={{fontFamily: MONO, fontSize: 28, color: CY, letterSpacing: '0.5em'}}>GIẢI VÔ ĐỊCH BÓNG ĐÁ</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 130, color: '#e9fdff', lineHeight: 1.05, textShadow: `0 0 26px ${CY}, 0 0 70px ${CY}77`}}>RHINO BILLIARDS 2026</div>
      <div style={{marginTop: 26, padding: '14px 50px', border: `2px solid ${GOLD}`, background: 'rgba(30,20,0,.55)', fontFamily: VIE, fontWeight: 800, fontSize: 50, color: GOLD, letterSpacing: '0.1em', boxShadow: '0 0 30px #ffb40055'}}>KHỞI TRANH 20/10/2026</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: '0.3em', marginTop: 30, opacity: interpolate(f, [90, 115], [0, 1], cl)}}>HẸN GẶP BẠN TẠI SÂN</div>
    </AbsoluteFill>
    <Img src={staticFile('rh/logo.png')} style={{position: 'absolute', left: 960 - 130, bottom: 60, width: 260, opacity: interpolate(f, [120, 145], [0, 1], cl), zIndex: 9}} />
    <Goc /><Telemetry /><Scanlines />
    <AbsoluteFill style={{background: '#000', opacity: den, zIndex: 20}} />
  </AbsoluteFill>;
};

const CANH = [S1, S2, S3, S4, S5, S6];
const BAT = CANH.map((_, i) => CANH.slice(0, i).reduce((a, b) => a + b, 0));
export const GIAI_TOTAL = CANH.reduce((a, b) => a + b, 0);
const LOI: [string, number][] = [['g1', BAT[0] + 20], ['g2', BAT[1] + 6], ['g3', BAT[1] + 160], ['g4', BAT[2] + 14], ['g5', BAT[3] + 14], ['g6', BAT[4] + 10], ['g7', BAT[4] + P_NHAT + 6], ['g8', BAT[4] + P_NB + 6], ['g9', BAT[4] + P_CN + 6], ['g10', BAT[5] + 12]];
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => { SFX.push(['whoosh', b - 16, 0.6]); SFX.push(['boom', b, 0.8]); });
LOGO_AT.forEach((a) => SFX.push(['scan', BAT[1] + a - 4, 0.5]));
SFX.push(['boom', BAT[2] + 20, 1]);
[P_NHAT, P_NB, P_NB + 20, P_CN + 40, P_CN + 90, P_CN + 140].forEach((a) => SFX.push(['whoosh', BAT[4] + a - 6, 0.45]));
const nhac = (fr: number) => {
  let m = 0;
  for (const [k, at] of LOI) m = Math.max(m, interpolate(fr, [at - 8, at, at + V[k], at + V[k] + 12], [0, 1, 1, 0], cl));
  return 1 - 0.6 * m;
};
export const GiaiFuture: React.FC = () => {
  const {durationInFrames: D} = useVideoConfig();
  const C = [MoMan, BonDoi, KhaiMac, LichDau, GiaiThuong, KetGiai];
  return <AbsoluteFill style={{background: '#000'}}>
    {C.map((K, i) => <Sequence key={i} from={BAT[i]} durationInFrames={CANH[i]}><K /></Sequence>)}
    {BAT.slice(1).map((b, i) => <Sequence key={'g' + i} from={b - 3} durationInFrames={12}><Glitch at={0} dur={10} /></Sequence>)}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
    <Audio src={staticFile('future_music3.mp3')} volume={(fr) => 0.9 * nhac(fr) * interpolate(fr, [0, 10, D - 60, D], [0, 1, 1, 0], cl)} />
    {LOI.map(([k, at]) => <Sequence key={'l' + k} from={at} durationInFrames={V[k] + 6}><Audio src={staticFile(`giai_vo/${k}.mp3`)} /></Sequence>)}
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
