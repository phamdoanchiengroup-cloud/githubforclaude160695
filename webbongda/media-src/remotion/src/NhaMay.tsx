import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {OSW, VIE} from './Fifa';
import vo from './nm_vo.json';
import shotData from './nm/shots.json';

// Video giới thiệu nhà máy Carbon Billiards cho khách tham quan (màn hình lớn)
// Hình: ảnh tĩnh chụp từ mô hình 3D của chủ dự án; chuyển động máy quay + khung sáng các khu vực dựng ở đây.
const V = vo as Record<string, number>;
type Room = {fi: number; ri: number; n: string; c: string; rects: number[][][]};
type ShotInfo = {rooms: Room[]; floors: {fi: number; c: number[]}[]};
const SHOT = shotData as Record<string, ShotInfo>;
const GOLD = '#e8b65a', INK = '#0d1216', TEAL = '#5fd3e0';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const TR = 18;   // khung hình chồng mờ giữa hai cảnh

// tên hiển thị gọn cho từng khu
const TEN: Record<string, string> = {
  'Khu sơn tĩnh điện (vách tấm panel)': 'Khu sơn tĩnh điện', 'Nướng + rút khuôn': 'Nướng định hình & rút khuôn', 'ISO phôi CB': 'Kiểm tra ISO phôi',
  'Khu rà tròn phôi': 'Rà tròn phôi', 'Khu chuốt ráp nước': 'Chuốt ráp nước', 'Đánh ráp, đánh bóng': 'Đánh ráp & đánh bóng', 'P. cắt mặt': 'Cắt mặt',
  'Khu vực in UV': 'In UV', 'P. máy CNC 1': 'Phòng máy CNC 1', 'P. máy CNC 2': 'Phòng máy CNC 2', 'Khu vực taro': 'Khu taro', 'Khu vực tip': 'Khu tip',
  'Bộ phận đóng gói': 'Đóng gói', 'P. khuôn': 'Phòng khuôn', 'Khu vực phôi thô': 'Khu phôi thô', 'Ráp nước': 'Ráp nước',
};
const ten = (n: string) => TEN[n] || n;

// ---------- chuyển động máy quay trên ảnh tĩnh ----------
type Cam = {z0: number; z1: number; x0?: number; x1?: number; y0?: number; y1?: number; ox?: number; oy?: number};
const camT = (f: number, d: number, c: Cam) => {
  const p = Easing.inOut(Easing.sin)(Math.min(1, Math.max(0, f / d)));
  const z = c.z0 + (c.z1 - c.z0) * p, x = (c.x0 || 0) + ((c.x1 || 0) - (c.x0 || 0)) * p, y = (c.y0 || 0) + ((c.y1 || 0) - (c.y0 || 0)) * p;
  return `translate(${x}px, ${y}px) scale(${z})`;
};
const origin = (c: Cam) => `${c.ox ?? 960}px ${c.oy ?? 540}px`;

// khung sáng một khu: các hình chữ nhật đã chiếu ra màn hình
const VungSang: React.FC<{r: Room; o: number; nhat?: boolean}> = ({r, o, nhat}) => {
  const f = useCurrentFrame();
  const mau = r.c === 'kho' ? TEAL : GOLD;
  return <g opacity={o}>
    {r.rects.map((q, i) => <polygon key={i} points={q.map((p) => `${p[0]},${p[1]}`).join(' ')} fill={nhat ? 'none' : `${mau}33`} stroke={mau} strokeWidth={nhat ? 2 : 4 + Math.sin(f / 6)} strokeLinejoin="round" style={{filter: nhat ? undefined : `drop-shadow(0 0 10px ${mau})`}} />)}
  </g>;
};
const nhan = (r: Room) => {   // điểm đặt nhãn: giữa cạnh trên của khu
  const ps = r.rects.flat();
  const minY = Math.min(...ps.map((p) => p[1]));
  const xs = ps.filter((p) => p[1] < minY + 60).map((p) => p[0]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, minY];
};
const NhanKhu: React.FC<{r: Room; o: number}> = ({r, o}) => {
  const [x, y] = nhan(r);
  return <div style={{position: 'absolute', left: x, top: y - 18, transform: `translate(-50%, -100%) translateY(${(1 - o) * 14}px)`, opacity: o, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
    <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: INK, background: r.c === 'kho' ? TEAL : GOLD, padding: '8px 20px', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,.45)'}}>{ten(r.n)}</div>
    <div style={{width: 3, height: 22, background: r.c === 'kho' ? TEAL : GOLD, margin: '0 auto'}} />
  </div>;
};

// tiêu đề góc dưới
const ChuDuoi: React.FC<{tren?: string; chinh: string; d: number; at?: number}> = ({tren, chinh, d, at = 10}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 16, d - 14, d], [0, 1, 1, 0], cl);
  const w = interpolate(f, [at, at + 24], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: 110, bottom: 110, opacity: o}}>
    {tren && <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 28, color: GOLD, letterSpacing: '0.3em'}}>{tren}</div>}
    <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 6}}>
      <div style={{width: 8, height: 64, background: GOLD, transform: `scaleY(${w})`}} />
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 56, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,.6)', clipPath: `inset(0 ${100 - w * 100}% 0 0)`}}>{chinh}</div>
    </div>
  </div>;
};

// một cảnh: ảnh + chuyển động + khung sáng các khu theo thời điểm
type Hl = {n: string; at: number; den: number};   // tên khu, khung bắt đầu sáng, khung kết thúc sáng
type CanhP = {id: string; d: number; cam: Cam; hl?: Hl[]; chu?: {tren?: string; chinh: string; at?: number}; tang?: boolean};
const Canh: React.FC<CanhP> = ({id, d, cam, hl = [], chu, tang}) => {
  const f = useCurrentFrame();
  const info = SHOT[id];
  const tf = camT(f, d, cam);
  const rooms = info?.rooms || [];
  const ds = hl.map((h) => ({h, r: rooms.find((r) => r.n === h.n)})).filter((x) => x.r);
  return <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: tf, transformOrigin: origin(cam)}}>
      <Img src={staticFile(`nm/${id}.png`)} style={{width: 1920, height: 1080}} />
      {/* làm tối nhẹ phần chưa nhắc tới khi đang chỉ khu */}
      {ds.length > 0 && <AbsoluteFill style={{background: 'rgba(8,12,16,.28)', opacity: interpolate(f, [ds[0].h.at - 10, ds[0].h.at + 10], [0, 1], cl)}} />}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {ds.map(({h, r}, i) => {
          const on = interpolate(f, [h.at, h.at + 10, h.den, h.den + 10], [0, 1, 1, 0], cl);
          const da = f > h.den ? 0.55 : 0;
          return <React.Fragment key={i}>{da > 0 && <VungSang r={r!} o={da} nhat />}{on > 0 && <VungSang r={r!} o={on} />}</React.Fragment>;
        })}
      </svg>
      {ds.map(({h, r}, i) => {
        const on = interpolate(f, [h.at, h.at + 12, h.den, h.den + 8], [0, 1, 1, 0], cl);
        return on > 0 ? <NhanKhu key={i} r={r!} o={on} /> : null;
      })}
      {tang && info && <TangNhan info={info} />}
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,8,11,.65), transparent 32%)'}} />
    {chu && <ChuDuoi {...chu} d={d} />}
  </AbsoluteFill>;
};

// nhãn ba tầng trên cảnh tách tầng
const TANG = [['TẦNG 1', 'Tạo phôi carbon'], ['TẦNG 2', 'Hoàn thiện · Sơn · In UV'], ['TẦNG 3', 'Gia công · Kiểm tra · Đóng gói']];
const TangNhan: React.FC<{info: ShotInfo}> = ({info}) => {
  const f = useCurrentFrame();
  const pts = info.floors.map((F) => F.c);
  return <>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1], o = interpolate(f, [70 + i * 70, 100 + i * 70], [0, 1], cl);
        const x = 1500, y0 = p[1], y1 = q[1];
        return <g key={i} opacity={o}>
          <line x1={x} y1={y0 - 10} x2={x} y2={y0 - 10 - (y0 - y1 - 20) * o} stroke={GOLD} strokeWidth={5} />
          <polygon points={`${x - 14},${y1 + 30} ${x + 14},${y1 + 30} ${x},${y1 + 8}`} fill={GOLD} />
        </g>;
      })}
    </svg>
    {pts.map((p, i) => {
      const o = interpolate(f, [30 + i * 70, 50 + i * 70], [0, 1], cl);
      return <div key={i} style={{position: 'absolute', left: 1540, top: p[1], transform: `translateY(-50%) translateX(${(1 - o) * 40}px)`, opacity: o}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 44, color: GOLD, lineHeight: 1}}>{TANG[i][0]}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 28, color: '#fff', marginTop: 4, textShadow: '0 2px 12px rgba(0,0,0,.8)'}}>{TANG[i][1]}</div>
      </div>;
    })}
  </>;
};

// thẻ chương mở đầu mỗi tầng (đè lên cảnh tổng quan tầng)
const TheChuong: React.FC<{so: string; ten: string; phu: string; d: number}> = ({so, ten, phu, d}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 18}});
  const o = interpolate(f, [0, 12, d - 16, d], [0, 1, 1, 0], cl);
  return <AbsoluteFill style={{opacity: o, background: 'linear-gradient(90deg, rgba(8,12,16,.85) 0%, rgba(8,12,16,.55) 38%, transparent 62%)'}}>
    <div style={{position: 'absolute', left: 120, top: 330, transform: `translateX(${(1 - s) * -60}px)`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 200, color: 'transparent', WebkitTextStroke: `3px ${GOLD}`, lineHeight: 0.9}}>{so}</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 92, color: '#fff', letterSpacing: '0.04em', marginTop: 10}}>{ten}</div>
      <div style={{width: 160 * s, height: 5, background: GOLD, margin: '18px 0'}} />
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 36, color: '#dfe6ea'}}>{phu}</div>
    </div>
  </AbsoluteFill>;
};

// mở đầu và kết: logo
const Logo: React.FC<{d: number; ket?: boolean}> = ({d, ket}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - 8, fps, config: {damping: 20}});
  const w = interpolate(f, [24, 60], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const o = interpolate(f, [0, 14, d - 18, d], [0, 1, 1, ket ? 1 : 0], cl);
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1c252c, ${INK} 70%)`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: o}}>
    <Img src={staticFile('rh/logo.png')} style={{width: 520, transform: `scale(${0.9 + 0.1 * s})`, opacity: s}} />
    <div style={{width: 700 * w, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '40px 0 30px'}} />
    <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: '0.22em', opacity: w}}>{ket ? 'CẢM ƠN QUÝ KHÁCH' : 'NHÀ MÁY CARBON BILLIARDS'}</div>
    <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: GOLD, letterSpacing: '0.3em', marginTop: 16, opacity: interpolate(f, [50, 75], [0, 1], cl)}}>{ket ? 'ĐÃ GHÉ THĂM NHÀ MÁY' : 'SẢN XUẤT CƠ BI-A SỢI CARBON'}</div>
  </AbsoluteFill>;
};

// ---------- kịch bản ----------
type Muc = {k: 'logo' | 'canh'; d: number; p?: CanhP; ket?: boolean; vo?: [string, number][]; chuong?: {so: string; ten: string; phu: string; d: number}};
// rải đều các khu trong khoảng [a, b) khung hình
const rai = (ns: string[], a: number, b: number): Hl[] => { const s = (b - a) / ns.length; return ns.map((n, i) => ({n, at: Math.round(a + i * s), den: Math.round(a + (i + 1) * s) - 4})); };
const V5 = V.n5, V8 = V.n8, V10 = V.n10;
const D_F0 = 20 + V.n4 + 14 + V5 + 30, D_F1 = 20 + V.n7 + 12 + V8 + 30, D_F2 = 20 + V.n9 + 12 + V10 + 30;
const KICH: Muc[] = [
  {k: 'logo', d: 130},
  {k: 'canh', d: 250, vo: [['n1', 20]], p: {id: 'e_cao', d: 250, cam: {z0: 1.0, z1: 1.12, ox: 900, oy: 520}, chu: {tren: 'CARBON BILLIARDS', chinh: 'Nhà máy sản xuất cơ bi-a Rhino', at: 40}}},
  {k: 'canh', d: 112, vo: [['n2', 10]], p: {id: 'e_g34', d: 112, cam: {z0: 1.04, z1: 1.12, x0: 30, x1: -30}, chu: {tren: 'KHUÔN VIÊN', chinh: 'Tòa điều hành 4 tầng · Nhà xưởng 3 tầng', at: 8}}},
  {k: 'canh', d: 100, p: {id: 'e_cong', d: 100, cam: {z0: 1.0, z1: 1.08, x0: -20, x1: 20}, chu: {chinh: 'Cổng chính', at: 8}}},
  {k: 'canh', d: 100, p: {id: 'e_hien', d: 100, cam: {z0: 1.02, z1: 1.1, oy: 600}, chu: {tren: 'TÒA ĐIỀU HÀNH', chinh: 'Văn phòng · Nhà ăn', at: 8}}},
  {k: 'canh', d: 30 + V.n3 + 40, vo: [['n3', 24]], p: {id: 'tach', d: 30 + V.n3 + 40, cam: {z0: 1.0, z1: 1.06, ox: 760}, tang: true}},
  {k: 'canh', d: D_F0, vo: [['n4', 20], ['n5', 20 + V.n4 + 14]], chuong: {so: '01', ten: 'TẦNG 1', phu: 'Xưởng tạo phôi carbon', d: 20 + V.n4 + 10},
    p: {id: 'f0', d: D_F0, cam: {z0: 1.0, z1: 1.08}, hl: rai(['Kho lạnh', 'Cắt', 'Cuốn', 'Nướng + rút khuôn', 'Khu rà tròn phôi', 'Khu chuốt ráp nước', 'ISO phôi CB'], 20 + V.n4 + 14, 20 + V.n4 + 14 + V5 + 16)}},
  {k: 'canh', d: 110, p: {id: 'c0a', d: 110, cam: {z0: 1.0, z1: 1.1}, chu: {tren: 'TẦNG 1', chinh: 'Cuốn phôi carbon', at: 8}}},
  {k: 'canh', d: 110, p: {id: 'c0b', d: 110, cam: {z0: 1.1, z1: 1.0}, chu: {tren: 'TẦNG 1', chinh: 'Nướng định hình & rút khuôn', at: 8}}},
  {k: 'canh', d: 40 + V.n6 + 26, vo: [['n6', 20]], p: {id: 'c0c', d: 40 + V.n6 + 26, cam: {z0: 1.0, z1: 1.08}, hl: rai(['Khu vực phôi thô'], 30, 40 + V.n6 + 10), chu: {tren: 'TẦNG 1', chinh: 'Khu phôi thô: khuôn · đổ foam · đúc keo', at: 8}}},
  {k: 'canh', d: D_F1, vo: [['n7', 20], ['n8', 20 + V.n7 + 12]], chuong: {so: '02', ten: 'TẦNG 2', phu: 'Hoàn thiện · Sơn · In UV', d: 20 + V.n7 + 10},
    p: {id: 'f1', d: D_F1, cam: {z0: 1.0, z1: 1.08}, hl: rai(['Ráp nước', 'Đánh ráp, đánh bóng', 'Bọc da', 'Bôi keo', 'P. cắt mặt', 'Khu sơn tĩnh điện (vách tấm panel)', 'Buồng sấy', 'Khu vực in UV'], 20 + V.n7 + 12, 20 + V.n7 + 12 + V8 + 16)}},
  {k: 'canh', d: 110, p: {id: 'c1a', d: 110, cam: {z0: 1.0, z1: 1.1}, chu: {tren: 'TẦNG 2', chinh: 'Đánh ráp & đánh bóng', at: 8}}},
  {k: 'canh', d: 110, p: {id: 'c1b', d: 110, cam: {z0: 1.1, z1: 1.0}, chu: {tren: 'TẦNG 2', chinh: 'Khu sơn tĩnh điện', at: 8}}},
  {k: 'canh', d: 110, p: {id: 'c1c', d: 110, cam: {z0: 1.0, z1: 1.1}, chu: {tren: 'TẦNG 2', chinh: 'Khu in UV', at: 8}}},
  {k: 'canh', d: D_F2, vo: [['n9', 20], ['n10', 20 + V.n9 + 12]], chuong: {so: '03', ten: 'TẦNG 3', phu: 'Gia công · Kiểm tra · Đóng gói', d: 20 + V.n9 + 10},
    p: {id: 'f2', d: D_F2, cam: {z0: 1.0, z1: 1.08}, hl: rai(['P. máy CNC 1', 'P. máy CNC 2', 'Khu vực CNC', 'Phòng da', 'Khu vực taro', 'Khu vực tip', 'Phòng QC', 'Bộ phận đóng gói', 'Kho thành phẩm'], 20 + V.n9 + 12, 20 + V.n9 + 12 + V10 + 16)}},
  {k: 'canh', d: 110, p: {id: 'c2a', d: 110, cam: {z0: 1.0, z1: 1.1}, chu: {tren: 'TẦNG 3', chinh: 'Phòng máy CNC', at: 8}}},
  {k: 'canh', d: 110, p: {id: 'c2b', d: 110, cam: {z0: 1.1, z1: 1.0}, chu: {tren: 'TẦNG 3', chinh: 'Khu taro', at: 8}}},
  {k: 'canh', d: 110, p: {id: 'c2c', d: 110, cam: {z0: 1.0, z1: 1.1}, chu: {tren: 'TẦNG 3', chinh: 'Đóng gói', at: 8}}},
  {k: 'canh', d: 30 + V.n11 + 30, vo: [['n11', 24]], p: {id: 'e_end', d: 30 + V.n11 + 30, cam: {z0: 1.12, z1: 1.0, ox: 1000}}},
  {k: 'logo', d: 150, ket: true},
];
const BAT: number[] = [];
KICH.reduce((t, m, i) => { BAT.push(t); return t + m.d - (i < KICH.length - 1 ? TR : 0); }, 0);
export const NM_TOTAL = BAT[BAT.length - 1] + KICH[KICH.length - 1].d;
const LOI: [string, number][] = KICH.flatMap((m, i) => (m.vo || []).map(([k, at]) => [k, BAT[i] + at] as [string, number]));
const nhacVol = (fr: number) => {
  let m = 0;
  for (const [k, at] of LOI) m = Math.max(m, interpolate(fr, [at - 10, at, at + V[k], at + V[k] + 14], [0, 1, 1, 0], cl));
  return 0.55 - 0.3 * m;
};
const Mo: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, TR], [0, 1], cl) * interpolate(f, [d - TR, d], [1, 1], cl)}}>{children}</AbsoluteFill>;
};
export const NhaMay: React.FC = () => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig();
  return <AbsoluteFill style={{background: INK}}>
    {KICH.map((m, i) => <Sequence key={i} from={BAT[i]} durationInFrames={m.d}>
      <Mo d={m.d}>
        {m.k === 'logo' ? <Logo d={m.d} ket={m.ket} /> : <Canh {...m.p!} />}
        {m.chuong && <TheChuong {...m.chuong} />}
      </Mo>
    </Sequence>)}
    <Audio src={staticFile('nm_music.mp3')} volume={(fr) => nhacVol(fr) * interpolate(fr, [0, 30, D - 90, D], [0, 1, 1, 0], cl)} />
    {LOI.map(([k, at]) => <Sequence key={k} from={at} durationInFrames={V[k] + 6}><Audio src={staticFile(`nm_vo/${k}.mp3`)} /></Sequence>)}
    {BAT.slice(1).map((b, i) => <Sequence key={'w' + i} from={b - 8} durationInFrames={40}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.12} /></Sequence>)}
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [D - 20, D], [0, 1], cl), pointerEvents: 'none'}} />
  </AbsoluteFill>;
};
