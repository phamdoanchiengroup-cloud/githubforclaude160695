import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, random} from 'remotion';
import {OSW, VIE} from './Fifa';
import {cl} from './Future';
import lich from './lich_2910.json';

// Giới thiệu ngày thi đấu – kiểu "hype" thể thao, bản dọc 1080×1920, cắt theo nhịp nhạc 143,6 BPM
type Doi = {name: string; color: string; dt: {img: string; name: string; so: string}; ds: string[]; xi: string[]; sodo: string};
const L = lich as unknown as {ngay: string; vong: string; tran: [string, string, string][]; doi: Record<string, Doi>};
const BEAT = 30 * 60 / 143.6;
const VANG = '#ffcf3a', HONG = '#ff2e7e', NEN = '#0b0b14';
const ngayNgan = L.ngay.split(' ').slice(-1)[0];   // 23/10/2026

// rung + nháy theo phách
const useNhip = (manh = 1) => {
  const f = useCurrentFrame(); const k = Math.exp(-((f % BEAT) / BEAT) * 7) * manh;
  const b = Math.floor(f / BEAT);
  return {k, b, dx: (random(`x${b}`) - 0.5) * 26 * k, dy: (random(`y${b}`) - 0.5) * 26 * k};
};
const Rung: React.FC<{children: React.ReactNode; manh?: number}> = ({children, manh = 1}) => {
  return <AbsoluteFill>{children}</AbsoluteFill>;   // không rung khung hình (đỡ mỏi mắt)
};

// nền sọc chéo chạy
const Soc: React.FC<{a: string; b: string; tocDo?: number; goc?: number}> = ({a, b, tocDo = 9, goc = -30}) => {
  const f = useCurrentFrame() * Math.sign(tocDo) * 0.12;   // chạy rất chậm
  return <AbsoluteFill style={{background: `repeating-linear-gradient(${goc}deg, ${a} 0 70px, ${b} 70px 140px)`, backgroundPosition: `${f * tocDo}px 0`, backgroundSize: '200% 200%'}} />;
};
const Hat: React.FC = () => <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.10) 2px, transparent 2.5px)', backgroundSize: '18px 18px', mixBlendMode: 'overlay'}} />;
const Nhay: React.FC<{mau?: string}> = ({mau = '#fff'}) => {
  return null;   // bỏ nháy sáng theo phách (đỡ chói)
};

// chữ to nghiêng, viền đậm
const Chu: React.FC<{children: React.ReactNode; size: number; mau?: string; vien?: string; style?: React.CSSProperties}> = ({children, size, mau = '#fff', vien = NEN, style}) =>
  <div style={{fontFamily: OSW, fontWeight: 700, fontSize: size, color: mau, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '0.01em', WebkitTextStroke: `${Math.max(4, size / 28)}px ${vien}`, paintOrder: 'stroke fill', textShadow: `0 ${size / 18}px 0 ${vien}`, ...style}}>{children}</div>;

// ---------- 1. Mở màn: mỗi phách một chữ ----------
const CHU_MO: [string, string][] = [['MATCH DAY', VANG], ['LƯỢT 2', '#fff'], ['THỨ NĂM · ' + ngayNgan.slice(0, 5), '#fff'], [`${L.tran.length} TRẬN · 15:00`, HONG]];
const NHIP_CHU = 3;   // mỗi cụm chữ giữ 3 phách
const MO = Math.round(BEAT * NHIP_CHU * CHU_MO.length);
const MoMan: React.FC = () => {
  const f = useCurrentFrame(); const i = Math.min(CHU_MO.length - 1, Math.floor(f / (BEAT * NHIP_CHU))); const p = (f - i * BEAT * NHIP_CHU) / (BEAT * NHIP_CHU);
  const [t, m] = CHU_MO[i];
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Soc a={i % 2 ? '#161626' : '#1d1430'} b={NEN} tocDo={i % 2 ? 14 : -14} goc={i % 2 ? -30 : 30} />
    <Rung manh={1.3}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Chu size={t.length > 10 ? 150 : 210} mau={m} style={{transform: `scale(${1.15 - 0.15 * Math.min(1, p * 5)}) rotate(-6deg)`, opacity: Math.min(1, p * 8), textAlign: 'center', width: 980}}>{t}</Chu>
      </AbsoluteFill>
    </Rung>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: '0.3em', opacity: 0.85}}>RHINO BILLIARDS 2026</div>
    <Hat /><Nhay />
  </AbsoluteFill>;
};


// ---------- 1b. Nhìn lại lượt 1 + bảng xếp hạng ----------
const KQ1: [string, number, number, string][] = [['rhino', 2, 3, 'evo'], ['cuebots', 2, 2, 'timetip']];
const BXH: [string, number, number, string][] = [['evo', 1, 3, '+1'], ['cuebots', 1, 1, '0'], ['timetip', 1, 1, '0'], ['rhino', 1, 0, '−1']];
const LAI = 135, BANG = 150;
const NhinLai: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Soc a="#1d1430" b={NEN} tocDo={-10} goc={30} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: interpolate(f, [0, 8], [0, 1], cl)}}><Chu size={70} mau="#fff">NHÌN LẠI LƯỢT 1</Chu></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 40, color: VANG, letterSpacing: '0.14em', opacity: interpolate(f, [6, 14], [0, 1], cl)}}>KẾT QUẢ 23/10</div>
    {KQ1.map(([ka, ga, gb, kb], i) => {
      const s = spring({frame: f - 10 - i * 14, fps, config: {damping: 12}});
      const sc = spring({frame: f - 26 - i * 14, fps, config: {damping: 9}});
      const y = 420 + i * 560, A = L.doi[ka], B = L.doi[kb];
      const tag = ga > gb ? `${A.name} THẮNG` : gb > ga ? `${B.name} THẮNG` : 'HÒA';
      return <div key={i} style={{position: 'absolute', left: 60 + (1 - s) * (i ? 1100 : -1100), top: y, width: 960, height: 470}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, ${A.color} 0 49.5%, ${B.color} 50.5% 100%)`, clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)'}} />
        <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 50, top: 40, width: 260, height: 260, objectFit: 'contain', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,.4))', opacity: gb > ga ? 0.75 : 1}} />
        <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 50, top: 40, width: 260, height: 260, objectFit: 'contain', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,.4))', opacity: ga > gb ? 0.75 : 1}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', transform: `scale(${2.2 - 1.2 * sc}) rotate(-6deg)`, opacity: Math.min(1, sc * 3)}}><Chu size={170} mau="#fff">{ga}-{gb}</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 318, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 44, color: NEN, letterSpacing: '0.04em'}}>{A.name} – {B.name}</div>
        <div style={{position: 'absolute', left: 330, right: 330, top: 392, height: 58, background: NEN, transform: 'skewX(-10deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: interpolate(f, [34 + i * 14, 42 + i * 14], [0, 1], cl)}}>
          <div style={{transform: 'skewX(10deg)', fontFamily: OSW, fontWeight: 700, fontSize: 34, color: ga === gb ? '#fff' : VANG, letterSpacing: '0.06em'}}>{tag}</div>
        </div>
      </div>;
    })}
    <Hat />
  </AbsoluteFill>;
};
const Bang: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Soc a="#161626" b={NEN} tocDo={10} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', transform: `scale(${1.3 - 0.3 * Math.min(1, f / 8)}) rotate(-4deg)`, opacity: Math.min(1, f / 6)}}><Chu size={120} mau={VANG}>BẢNG XẾP HẠNG</Chu></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: '0.2em', opacity: interpolate(f, [8, 16], [0, 1], cl)}}>SAU LƯỢT 1</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 470, display: 'flex', justifyContent: 'flex-end', gap: 0, fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#aab0cc', letterSpacing: '0.1em', opacity: interpolate(f, [12, 20], [0, 1], cl)}}>
      <div style={{width: 150, textAlign: 'center'}}>HS</div><div style={{width: 170, textAlign: 'center'}}>ĐIỂM</div>
    </div>
    {BXH.map(([k, tr, d, hs], i) => {
      const s = spring({frame: f - 14 - i * 9, fps, config: {damping: 13}});
      const y = 520 + i * 250, dau = i === 0;
      return <div key={k} style={{position: 'absolute', left: 80 + (1 - s) * (i % 2 ? 1100 : -1100), top: y, width: 920, height: 210, background: dau ? `linear-gradient(100deg, ${VANG}, #ffb000)` : `linear-gradient(100deg, ${L.doi[k].color}44, rgba(255,255,255,.06))`, clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)', display: 'flex', alignItems: 'center'}}>
        <Chu size={110} mau={dau ? NEN : '#fff'} vien={dau ? VANG : NEN} style={{width: 120, textAlign: 'center', marginLeft: 30}}>{i + 1}</Chu>
        <Img src={staticFile(`logo_${k}.png`)} style={{width: 160, height: 160, objectFit: 'contain', marginLeft: 10, filter: 'drop-shadow(0 8px 0 rgba(0,0,0,.35))'}} />
        <div style={{flex: 1, marginLeft: 26, fontFamily: OSW, fontWeight: 700, fontStyle: 'italic', fontSize: 54, whiteSpace: 'nowrap', color: dau ? NEN : '#fff'}}>{L.doi[k].name}</div>
        <div style={{width: 150, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 56, color: dau ? NEN : '#c9cbe0'}}>{hs}</div>
        <Chu size={120} mau={dau ? NEN : '#fff'} vien={dau ? VANG : NEN} style={{width: 170, textAlign: 'center'}}>{d}</Chu>
      </div>;
    })}
    <Hat />
  </AbsoluteFill>;
};

// ---------- 2. Từng trận ----------
const N_THE = 7;          // 7 cầu thủ đội hình chính (sheet DoiHinh)
const MOI_DOI = 120;      // thời lượng giới thiệu mỗi đội
const VAO = 56, VS_DAU = 24, THE = MOI_DOI * 2, CHOT = 90;

// sân bóng 3D đặt dọc: thủ môn gần camera, tiền đạo phía xa; thẻ cầu thủ đứng trên mặt sân theo sơ đồ
const PW = 760, PH = 1300;
const SanDoc: React.FC<{d: Doi; g: number}> = ({d, g}) => {
  const {fps} = useVideoConfig();
  const tilt = interpolate(g, [0, MOI_DOI], [60, 48], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const z = interpolate(g, [0, MOI_DOI], [0.92, 1.0], cl);
  const hang = [1, ...d.sodo.split('-').map(Number)];   // thủ môn + các tuyến
  const vt: [number, number][] = [];
  hang.forEach((n, r) => {
    const y = r === 0 ? 0.92 : 0.72 - (r - 1) * (0.46 / Math.max(1, hang.length - 2));
    for (let c = 0; c < n; c++) vt.push([(c + 1) / (n + 1), y]);
  });
  const CW = 195, CH = 273;
  return <AbsoluteFill style={{perspective: 2600, perspectiveOrigin: '50% 10%'}}>
    <div style={{position: 'absolute', left: 540 - PW / 2, top: 400, width: PW, height: PH, transformOrigin: '50% 0%', transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg) scale3d(${z}, ${z}, ${z})`}}>
      <Img src={staticFile('grass.jpg')} style={{position: 'absolute', inset: 0, width: PW, height: PH, objectFit: 'cover', filter: 'brightness(.7) saturate(1.05)'}} />
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        <g fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={6}>
          <rect x={8} y={8} width={PW - 16} height={PH - 16} /><line x1={0} y1={PH / 2} x2={PW} y2={PH / 2} /><circle cx={PW / 2} cy={PH / 2} r={105} />
          <rect x={PW / 2 - 200} y={8} width={400} height={180} /><rect x={PW / 2 - 200} y={PH - 188} width={400} height={180} />
          <rect x={PW / 2 - 110} y={PH - 88} width={220} height={80} /><rect x={PW / 2 - 110} y={8} width={220} height={80} />
        </g>
      </svg>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 40% at 50% 70%, ${d.color}33, transparent 70%)`}} />
      {d.xi.slice(0, N_THE).map((img, j) => {
        const [px, py] = vt[j] || [0.5, 0.5];
        const sp = spring({frame: g - 10 - j * 6, fps, config: {damping: 14}});
        const x = px * PW, y = py * PH;
        return <React.Fragment key={j}>
          <div style={{position: 'absolute', left: x - 70, top: y - 22, width: 140, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.45)', filter: 'blur(6px)', opacity: sp}} />
          <div style={{position: 'absolute', left: x - CW / 2, top: y - CH, width: CW, height: CH, transformOrigin: '50% 100%', transform: `rotateX(${-tilt}deg) translateY(${(1 - sp) * -260}px)`, opacity: Math.min(1, sp * 2)}}>
            <Img src={staticFile(img)} style={{width: CW, height: CH, objectFit: 'contain', filter: `drop-shadow(0 0 14px ${d.color})`}} />
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
  // chia đôi màn hình theo đường chéo: nửa trên màu đội A, nửa dưới màu đội B
  const nuaTren = <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${A.color} 0%, ${A.color}cc 30%, #12121e 70%)`, clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 58%)', transform: `translateX(${(1 - sa) * -1100}px)`}} />;
  const nuaDuoi = <div style={{position: 'absolute', inset: 0, background: `linear-gradient(340deg, ${B.color} 0%, ${B.color}cc 30%, #12121e 70%)`, clipPath: 'polygon(0 58%, 100% 42%, 100% 100%, 0 100%)', transform: `translateX(${(1 - sb) * 1100}px)`}} />;
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Rung>
      {nuaTren}{nuaDuoi}
      <div style={{position: 'absolute', left: -100, right: -100, top: 900, height: 18, background: '#fff', transform: 'rotate(-8.5deg)', boxShadow: `0 0 40px ${VANG}`, opacity: Math.min(sa, sb)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: interpolate(f, [0, 8], [0, 1], cl)}}><Chu size={64} mau={VANG}>TRẬN {i + 3}</Chu></div>
      <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 90 + (1 - sa) * -700, top: 250, width: 430, height: 430, objectFit: 'contain', filter: 'drop-shadow(0 18px 0 rgba(0,0,0,.45))', transform: `rotate(${(1 - sa) * -40}deg)`}} />
      <Chu size={96} style={{position: 'absolute', left: 520 + (1 - sa) * 900, top: 380, width: 520}}>{A.name}</Chu>
      <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 90 + (1 - sb) * -700, top: 1150, width: 430, height: 430, objectFit: 'contain', filter: 'drop-shadow(0 18px 0 rgba(0,0,0,.45))', transform: `rotate(${(1 - sb) * 40}deg)`}} />
      <Chu size={96} style={{position: 'absolute', right: 520 + (1 - sb) * 900, top: 1290, width: 520, textAlign: 'right'}}>{B.name}</Chu>
      {f >= VAO - 6 && <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Chu size={300} mau={HONG} vien="#fff" style={{transform: `scale(${3 - 2 * vs}) rotate(-8deg)`, opacity: Math.min(1, vs * 3)}}>VS</Chu>
      </AbsoluteFill>}
    </Rung>
    {/* giới thiệu lần lượt từng đội: logo + tên đội, 6 cầu thủ hiện dần thành lưới 3×2 */}
    {f >= t0 && f < t1 && (() => {
      const k = f < t0 + MOI_DOI ? 0 : 1, d = k ? B : A, key = k ? kb : ka, g = f - t0 - k * MOI_DOI;
      const vao = interpolate(g, [0, 10], [0, 1], cl), ra = interpolate(g, [MOI_DOI - 8, MOI_DOI], [1, 0], cl);
      return <AbsoluteFill style={{background: NEN, opacity: Math.min(vao, ra)}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${d.color}55 0%, ${NEN} 55%)`}} />
        <Img src={staticFile(`logo_${key}.png`)} style={{position: 'absolute', left: 80, top: 140, width: 210, height: 210, objectFit: 'contain'}} />
        <Chu size={96} mau="#fff" style={{position: 'absolute', left: 320, top: 170, width: 700}}>{d.name}</Chu>
        <div style={{position: 'absolute', left: 324, top: 285, fontFamily: VIE, fontWeight: 800, fontSize: 32, color: VANG, letterSpacing: '0.14em'}}>ĐỘI HÌNH CHÍNH · {d.sodo}</div>
        <SanDoc d={d} g={g} />
      </AbsoluteFill>;
    })()}
    {/* chốt: hai đội trưởng + giờ đá */}
    {f >= t1 && <AbsoluteFill style={{background: NEN}}>
      <Soc a="#1a1428" b={NEN} tocDo={10} />
      <Rung>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}><Chu size={76} mau={VANG}>ĐỘI TRƯỞNG</Chu></div>
        {[[A, 40, -6], [B, 560, 6]].map(([d, x, r], k) => {
          const s = spring({frame: f - t1 - k * 6, fps, config: {damping: 12}});
          return <React.Fragment key={k}>
            <Img src={staticFile((d as Doi).dt.img)} style={{position: 'absolute', left: x as number, top: 330 + (1 - s) * 500, width: 480, height: 672, objectFit: 'contain', transform: `rotate(${r}deg)`, filter: `drop-shadow(0 0 30px ${(d as Doi).color})`}} />
          </React.Fragment>;
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center'}}><Chu size={68} mau={HONG} vien="#fff">VS</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', opacity: interpolate(f, [t1 + 20, t1 + 30], [0, 1], cl)}}><Chu size={260} mau="#fff" vien={HONG}>{gio}</Chu></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', fontFamily: VIE, fontWeight: 800, fontSize: 44, color: VANG, letterSpacing: '0.12em', opacity: interpolate(f, [t1 + 30, t1 + 40], [0, 1], cl)}}>{L.ngay}</div>
      </Rung>
    </AbsoluteFill>}
    <Hat /><Nhay />
  </AbsoluteFill>;
};

// ---------- 3. Kết ----------
const KET = 170;
const Ket: React.FC = () => {
  const f = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  return <AbsoluteFill style={{background: NEN, overflow: 'hidden'}}>
    <Soc a="#15152a" b={NEN} tocDo={8} />
    <Rung manh={0.8}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}><Chu size={110} mau={VANG}>{ngayNgan.slice(0, 5)} · 15:00</Chu></div>
      {L.tran.map(([ka, kb], i) => {
        const s = spring({frame: f - 8 - i * 8, fps, config: {damping: 12}});
        const y = 420 + i * 470;
        return <div key={i} style={{position: 'absolute', left: 60 + (1 - s) * (i ? 1100 : -1100), top: y, width: 960, height: 400, background: `linear-gradient(100deg, ${L.doi[ka].color} 0 49.5%, ${L.doi[kb].color} 50.5% 100%)`, clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)'}}>
          <Img src={staticFile(`logo_${ka}.png`)} style={{position: 'absolute', left: 70, top: 40, width: 280, height: 280, objectFit: 'contain', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,.4))'}} />
          <Img src={staticFile(`logo_${kb}.png`)} style={{position: 'absolute', right: 70, top: 40, width: 280, height: 280, objectFit: 'contain', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,.4))'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}><Chu size={110} mau="#fff">VS</Chu></div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 325, textAlign: 'center', fontFamily: OSW, fontWeight: 700, fontSize: 44, color: NEN, letterSpacing: '0.04em'}}>{L.doi[ka].name} – {L.doi[kb].name}</div>
        </div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', transform: `scale(${1 + 0.06 * Math.exp(-((f % BEAT) / BEAT) * 6)})`, opacity: interpolate(f, [30, 40], [0, 1], cl)}}><Chu size={120} mau={HONG} vien="#fff" style={{lineHeight: 1.2}}>HẸN GẶP<br />TRÊN SÂN!</Chu></div>
    </Rung>
    <div style={{position: 'absolute', left: 40, right: 40, bottom: 70, textAlign: 'center', fontFamily: VIE, fontWeight: 600, fontSize: 22, color: '#c9cbe0', opacity: 0.9}}>Nhạc: “Mega Hyper Ultrastorm” – Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
    <Hat /><Nhay />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [durationInFrames - 20, durationInFrames], [0, 1], cl)}} />
  </AbsoluteFill>;
};

const DS: [React.FC, number][] = [[MoMan, MO], [NhinLai, LAI], [Bang, BANG], ...L.tran.map((_, i) => [() => <Tran i={i} />, TRAN] as [React.FC, number]), [Ket, KET]];
const BAT = DS.map((_, i) => DS.slice(0, i).reduce((a, b) => a + b[1], 0));
export const HYPE2_TOTAL = DS.reduce((a, b) => a + b[1], 0);
const SFX: [string, number, number][] = [];
BAT.slice(1).forEach((b) => {SFX.push(['whoosh', b - 12, 0.6]); SFX.push(['boom', b, 0.8]);});
L.tran.forEach((_, i) => {SFX.push(['boom', BAT[3 + i] + VAO, 1]); SFX.push(['boom', BAT[3 + i] + VAO + VS_DAU + THE, 0.8]);});
export const HypeLuot2: React.FC = () => {
  const {durationInFrames: Dd} = useVideoConfig();
  return <AbsoluteFill style={{background: NEN}}>
    {DS.map(([C, d], i) => <Sequence key={i} from={BAT[i]} durationInFrames={d}><C /></Sequence>)}
    <Audio src={staticFile('future_music.mp3')} volume={(fr) => interpolate(fr, [0, 3, Dd - 30, Dd], [0, 1, 1, 0], cl)} />
    {SFX.map(([n, at, v], i) => <Sequence key={'s' + i} from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>;
};
