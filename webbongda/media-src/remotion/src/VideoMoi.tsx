import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, random, Easing, delayRender, continueRender} from 'remotion';
import D from './vdmoi_data.json';

// Video dọc 9:16 theo giao diện web 2026 (hologram vàng kim): kết quả lượt 1 + giới thiệu lượt 2.
// Dữ liệu lấy từ sheet (vdmoi_data.json). Ảnh trong public/vm/. Không chớp sáng, không rung.
// Phông đặt sẵn trong public/vm/font (máy dựng không tải được Google Fonts)
const PHONG: [string, string, string, string][] = [
  ['VM Barlow', 'BarlowCondensed-ExtraBold.ttf', '800', 'normal'], ['VM Barlow', 'BarlowCondensed-ExtraBoldItalic.ttf', '800', 'italic'],
  ['VM Chakra', 'ChakraPetch-SemiBold.ttf', '600', 'normal'], ['VM Chakra', 'ChakraPetch-Bold.ttf', '700', 'normal'],
  ['VM Vie', 'BeVietnamPro-Medium.ttf', '500', 'normal'], ['VM Vie', 'BeVietnamPro-Bold.ttf', '700', 'normal'],
];
if (typeof document !== 'undefined' && !document.getElementById('vm-phong')) {
  const st = document.createElement('style'); st.id = 'vm-phong';
  st.textContent = PHONG.map(([ho, tep, w, s]) => `@font-face{font-family:'${ho}';src:url('${staticFile('vm/font/' + tep)}') format('truetype');font-weight:${w};font-style:${s};font-display:block}`).join('');
  document.head.appendChild(st);
  const h = delayRender('Tải phông');
  Promise.all(PHONG.map(([ho, , w, s]) => document.fonts.load(`${s} ${w} 40px '${ho}'`, 'ƯỢT Đ'))).then(() => continueRender(h), () => continueRender(h));
}
const TD = "'VM Barlow','Arial Narrow',sans-serif", HUD = "'VM Chakra',sans-serif", VIE = "'VM Vie',sans-serif";
const KIM = 'linear-gradient(180deg,#fff3c4 0%,#ffd666 38%,#e8a531 58%,#a87422 82%,#ffe08a 100%)';
const BAC = 'linear-gradient(180deg,#fff 0%,#e6eaf0 40%,#9aa3b1 58%,#f2f4f7 78%,#c9cfd8 100%)';
const VANG = '#f6c453', CHU = '#f5efe4', MO = '#a89f90';
const MAU: Record<string, string> = {rhino: '#f6c453', evo: '#e0313f', cuebots: '#b9c6d8', timetip: '#3d8bff'};
type CT = {ma: string; ten: string; so: string; rt: string; loai: string; cs: Record<string, string>; vt: string};
const ten = (k: string) => (D.tenDoi as Record<string, string>)[k];
const logo = (k: string) => staticFile(`vm/logo_${k}.png`);
const anh = (ma: string) => staticFile(`vm/ct/${ma}.jpg`);
const ra = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

// ---------- chữ kim loại ----------
const Kim: React.FC<{c?: string; s?: React.CSSProperties; children: React.ReactNode}> = ({c = KIM, s, children}) =>
  <span style={{background: c, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingTop: '.08em', ...s}}>{children}</span>;

// ---------- nền: ảnh + phủ tối + 2 chùm đèn quét + hạt vàng bay ----------
const Nen: React.FC<{src: string; toi?: number; dich?: number}> = ({src, toi = .55, dich = 0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#07060a', overflow: 'hidden'}}>
    <Img src={staticFile(src)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${50 + dich}% 30%`, transform: `scale(${1.08 + f * .0005})`}} />
    <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(7,6,10,${toi * .6}),rgba(7,6,10,${toi}) 55%,rgba(7,6,10,${Math.min(.95, toi + .25)}))`}} />
  </AbsoluteFill>;
};
const Den: React.FC = () => {
  const f = useCurrentFrame();
  const chum = (trai: boolean) => {
    const g = (trai ? -24 : 24) + Math.sin(f / 48 + (trai ? 0 : 2.2)) * 14;
    return <div style={{position: 'absolute', top: -60, [trai ? 'left' : 'right']: -160, width: 700, height: 2300, transformOrigin: '50% 0', transform: `rotate(${g}deg)`, mixBlendMode: 'screen', filter: 'blur(14px)',
      background: 'conic-gradient(from 0deg at 50% 0%,transparent 0deg,transparent 162deg,rgba(255,236,190,.28) 172deg,rgba(255,240,200,.5) 180deg,rgba(255,236,190,.28) 188deg,transparent 198deg,transparent 360deg)'}} />;
  };
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{chum(true)}{chum(false)}</AbsoluteFill>;
};
const Hat: React.FC<{n?: number; seed?: string}> = ({n = 70, seed = 'h'}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{Array.from({length: n}).map((_, i) => {
    const song = 160 + random(seed + 's' + i) * 160, t0 = random(seed + 't' + i) * song;
    const t = ((f + t0) % song) / song;
    const x = random(seed + 'x' + i) * 1080 + Math.sin((f + i * 20) / 30) * 18;
    const y = 1980 - t * 2100;
    const r = 2 + random(seed + 'r' + i) * 4;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', opacity: Math.sin(t * Math.PI) * .9,
      background: random(seed + 'm' + i) < .7 ? '#ffd666' : '#ff9f2e', boxShadow: '0 0 10px rgba(255,180,60,.9)'}} />;
  })}</AbsoluteFill>;
};
// hạt bung ra từ một điểm, bắt đầu tại frame bd
const Bung: React.FC<{x: number; y: number; bd: number; n?: number; luc?: number; seed?: string}> = ({x, y, bd, n = 60, luc = 14, seed = 'b'}) => {
  const f = useCurrentFrame() - bd;
  if (f < 0 || f > 70) return null;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{Array.from({length: n}).map((_, i) => {
    const g = random(seed + i) * Math.PI * 2, v = (.5 + random(seed + 'v' + i)) * luc;
    const px = x + Math.cos(g) * v * f * .9, py = y + Math.sin(g) * v * f * .9 + .25 * f * f * .4;
    const r = 2 + random(seed + 'r' + i) * 4;
    return <div key={i} style={{position: 'absolute', left: px, top: py, width: r * 2, height: r * 2, borderRadius: '50%', opacity: 1 - f / 70, background: '#ffd666', boxShadow: '0 0 12px rgba(255,170,50,1)'}} />;
  })}</AbsoluteFill>;
};
// sóng vàng lan ra
const Song: React.FC<{x: number; y: number; bd: number; r?: number}> = ({x, y, bd, r = 260}) => {
  const f = useCurrentFrame() - bd;
  if (f < 0 || f > 40) return null;
  const k = f / 40;
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '5px solid rgba(255,214,102,.85)',
    boxShadow: '0 0 40px rgba(255,159,46,.6),inset 0 0 40px rgba(255,159,46,.4)', transform: `scale(${.3 + k * 1.9})`, opacity: 1 - k}} />;
};
// nhãn HUD nhỏ
const Hud: React.FC<{children: React.ReactNode; s?: React.CSSProperties}> = ({children, s}) =>
  <div style={{fontFamily: HUD, fontWeight: 600, fontSize: 30, letterSpacing: '.18em', textTransform: 'uppercase', color: VANG, ...s}}>{children}</div>;
// tấm kính góc vát + viền năng lượng chạy vòng
const Kinh: React.FC<{children: React.ReactNode; s?: React.CSSProperties; nangLuong?: boolean}> = ({children, s, nangLuong = true}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'relative', padding: 4, ...s}}>
    {nangLuong && <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: `conic-gradient(from ${f * 4}deg,transparent 0deg,transparent 240deg,#ffd666 320deg,#fff3c4 340deg,#ffd666 350deg,transparent 360deg)`, filter: 'drop-shadow(0 0 10px rgba(255,159,46,.8))'}} />}
    <div style={{position: 'relative', borderRadius: 15, background: 'linear-gradient(160deg,rgba(255,214,140,.10),rgba(7,6,10,.5)),rgba(9,8,13,.86)', boxShadow: 'inset 0 0 0 1.5px rgba(246,196,83,.3)', height: '100%'}}>{children}</div>
  </div>;
};

// ---------- thẻ cầu thủ kiểu FIFA (ảnh thật) ----------
const The: React.FC<{c: CT; w: number; doi: string; dt?: boolean}> = ({c, w, doi, dt}) => {
  const h = w * 1.36, vang = c.loai === 'huyenthoai' || c.loai === 'vang';
  const nen = doi === 'evo' ? 'linear-gradient(165deg,#d42a37,#5a0911 75%)' : doi === 'timetip' ? 'linear-gradient(165deg,#2f73e0,#0a1d52 75%)'
    : doi === 'cuebots' ? 'linear-gradient(165deg,#dfe4ee,#6d7586 60%,#2b303a)' : 'linear-gradient(165deg,#fff3c4,#e2ad3c 35%,#7a4f12 90%)';
  const chuToi = doi === 'rhino' || doi === 'cuebots';
  return <div style={{position: 'relative', width: w, height: h, clipPath: 'polygon(50% 0,100% 7%,100% 88%,50% 100%,0 88%,0 7%)', background: nen}}>
    <Img src={anh(c.ma)} style={{position: 'absolute', left: '50%', top: '20%', width: '62%', transform: 'translateX(-50%)', borderRadius: 4, maskImage: 'linear-gradient(180deg,#000 75%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000 75%,transparent)'}} />
    <div style={{position: 'absolute', left: '9%', top: '8%', fontFamily: TD, fontWeight: 800, fontSize: w * .2, lineHeight: 1, color: chuToi ? '#1a1206' : '#ffe08a', textShadow: chuToi ? 'none' : '0 2px 4px rgba(0,0,0,.6)'}}>{c.rt}</div>
    <div style={{position: 'absolute', right: '9%', top: '8%', fontFamily: TD, fontWeight: 800, fontSize: w * .17, lineHeight: 1, color: chuToi ? '#1a1206' : '#fff'}}>{c.so}</div>
    {dt && <div style={{position: 'absolute', right: '8%', top: '22%', width: w * .17, height: w * .17, borderRadius: '50%', background: KIM, display: 'grid', placeItems: 'center', fontFamily: TD, fontWeight: 800, fontSize: w * .11, color: '#1a1206', boxShadow: '0 0 0 2px #1a1206'}}>C</div>}
    <div style={{position: 'absolute', left: 0, right: 0, top: '68%', textAlign: 'center', fontFamily: TD, fontWeight: 800, fontSize: w * .105, color: '#fff', padding: '3px 6px',
      background: 'linear-gradient(90deg,transparent,rgba(0,0,0,.7) 15%,rgba(0,0,0,.7) 85%,transparent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.ten}</div>
    <div style={{position: 'absolute', inset: 4, clipPath: 'inherit', boxShadow: `inset 0 0 0 ${Math.max(2, w * .015)}px ${vang ? '#ffe08a' : 'rgba(255,255,255,.7)'}`}} />
  </div>;
};

// ================= CẢNH CHUNG =================
// Mở đầu: ảnh giải (tê giác + 4 logo), tiêu đề vàng kim
const MoDau: React.FC<{nhan: string; dong1: string; dong2: string; phu: string}> = ({nhan, dong1, dong2, phu}) => {
  const f = useCurrentFrame();
  const a = ra(f, 0, 30), b = ra(f, 18, 48), c = ra(f, 36, 64);
  return <AbsoluteFill>
    <AbsoluteFill style={{background: '#07060a'}}>
      <Img src={staticFile('vm/nen-dau.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(.45)', transform: 'scale(1.15)', opacity: a}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, height: 760, overflow: 'hidden', opacity: a,
        maskImage: 'linear-gradient(180deg,transparent,#000 8%,#000 88%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,transparent,#000 8%,#000 88%,transparent)'}}>
        <Img src={staticFile('vm/nen-dau.jpg')} style={{position: 'absolute', left: '50%', top: '50%', height: 760, width: 'auto', transform: `translate(-50%,-50%) scale(${1.12 - a * .08 + f * .0006})`}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(7,6,10,.0) 0%,rgba(7,6,10,0) 55%,rgba(7,6,10,.8) 68%,rgba(7,6,10,.95) 100%)'}} />
    </AbsoluteFill>
    <Den /><Hat n={60} seed="md" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center'}}>
      <Hud s={{opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>◇ {nhan}</Hud>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 168, lineHeight: .95, marginTop: 14, clipPath: `inset(0 ${(1 - b) * 100}% 0 0)`, filter: 'drop-shadow(0 0 24px rgba(255,159,46,.45))'}}>
        <Kim c={BAC}>{dong1}</Kim></div>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 168, lineHeight: .95, clipPath: `inset(0 ${(1 - c) * 100}% 0 0)`, filter: 'drop-shadow(0 0 24px rgba(255,159,46,.45))'}}>
        <Kim>{dong2}</Kim></div>
      <div style={{fontFamily: HUD, fontWeight: 700, fontSize: 40, letterSpacing: '.14em', color: CHU, marginTop: 26, opacity: c}}>{phu}</div>
    </div>
  </AbsoluteFill>;
};

// Khung VS: 2 logo lao vào, chữ giữa đập xuống (tỷ số hoặc giờ)
const DoiDau: React.FC<{a: string; b: string; giua: React.ReactNode; nhan: string; phu?: string}> = ({a, b, giua, nhan, phu}) => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const sa = spring({frame: f, fps, config: {damping: 13, mass: .9}}), sb = spring({frame: f - 4, fps, config: {damping: 13, mass: .9}});
  const sg = spring({frame: f - 20, fps, config: {damping: 9, mass: .7}});
  const noi = (k: number) => Math.sin((f + k) / 24) * 10;
  const Doi = (k: string, trai: boolean, s: number) => <div style={{position: 'absolute', top: 520, [trai ? 'left' : 'right']: 50, width: 420, textAlign: 'center',
    transform: `translateX(${(1 - s) * (trai ? -700 : 700)}px) rotate(${(1 - s) * (trai ? -18 : 18)}deg)`}}>
    <Img src={logo(k)} style={{width: 380, height: 380, objectFit: 'contain', transform: `translateY(${noi(trai ? 0 : 40)}px)`, filter: `drop-shadow(0 0 40px ${MAU[k]}aa) drop-shadow(0 20px 30px rgba(0,0,0,.7))`}} />
    <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 70, lineHeight: 1, marginTop: 10}}><Kim c={trai ? KIM : BAC}>{ten(k)}</Kim></div>
  </div>;
  return <AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(90deg,${MAU[a]}55,transparent 45%,transparent 55%,${MAU[b]}55)`}} />
    <Hud s={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontSize: 36, opacity: ra(f, 0, 15)}}>{nhan}</Hud>
    {Doi(a, true, sa)}{Doi(b, false, sb)}
    <div style={{position: 'absolute', top: 990, left: 0, right: 0, display: 'grid', placeItems: 'center', transform: `scale(${interpolate(sg, [0, 1], [3, 1])})`, opacity: Math.min(1, sg * 1.6)}}>{giua}</div>
    <Song x={540} y={1080} bd={22} r={240} /><Song x={540} y={1080} bd={30} r={300} />
    <Bung x={540} y={1080} bd={24} n={70} seed={a + b} />
    {phu && <div style={{position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: HUD, fontWeight: 700, fontSize: 38, letterSpacing: '.16em', color: '#ffe7a3', opacity: ra(f, 40, 55)}}>{phu}</div>}
  </AbsoluteFill>;
};

// Kết thúc: link web + QR + ghi công nhạc
const KetThuc: React.FC<{dong1: string; dong2: string; nhac: string}> = ({dong1, dong2, nhac}) => {
  const f = useCurrentFrame();
  const a = ra(f, 0, 25), b = ra(f, 20, 45);
  return <AbsoluteFill>
    <Nen src="vm/nen-duoi.jpg" toi={.62} /><Den /><Hat n={70} seed="kt" />
    <div style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 130, lineHeight: .95, filter: 'drop-shadow(0 0 24px rgba(255,159,46,.45))'}}><Kim c={BAC}>{dong1}</Kim></div>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 130, lineHeight: .95, filter: 'drop-shadow(0 0 24px rgba(255,159,46,.45))'}}><Kim>{dong2}</Kim></div>
    </div>
    <div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'grid', justifyItems: 'center', gap: 26, opacity: b}}>
      <Kinh s={{width: 520, height: 520}}><Img src={staticFile('vm/qr.png')} style={{position: 'absolute', inset: 34, width: 444, height: 444, borderRadius: 8}} /></Kinh>
      <Hud s={{fontSize: 30}}>Quét để xem lịch · kết quả · đội hình</Hud>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 84}}><Kim>bit.ly/rhinofootball</Kim></div>
    </div>
    <div style={{position: 'absolute', bottom: 70, left: 40, right: 40, textAlign: 'center', fontFamily: VIE, fontSize: 22, color: MO, opacity: b}}>
      Nhạc: "{nhac}" – Kevin MacLeod (incompetech.com) · CC BY 4.0<br />Giải Bóng Đá Rhino Billiards 2026 · Công ty TNHH Carbon Billiards
    </div>
  </AbsoluteFill>;
};

// Bảng xếp hạng
const BangXH: React.FC<{tieu: string}> = ({tieu}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <AbsoluteFill>
    <Nen src="vm/nen-duoi.jpg" toi={.7} /><Den /><Hat n={45} seed="bx" />
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: ra(f, 0, 15)}}>
      <Hud>◇ {tieu}</Hud>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 130, lineHeight: 1}}><Kim c={BAC}>BẢNG </Kim><Kim>XẾP HẠNG</Kim></div>
    </div>
    <div style={{position: 'absolute', top: 640, left: 50, right: 50, display: 'grid', gap: 26}}>
      {D.bxh.map((r, i) => {
        const s = spring({frame: f - 12 - i * 7, fps, config: {damping: 15}});
        const qua = i < 2;
        return <div key={r.doi} style={{transform: `translateX(${(1 - s) * (i % 2 ? 900 : -900)}px)`, opacity: s}}>
          <Kinh nangLuong={qua} s={{height: 190}}>
            <div style={{display: 'grid', gridTemplateColumns: '90px 150px 1fr 130px', alignItems: 'center', height: '100%', padding: '0 30px', gap: 16}}>
              <div style={{fontFamily: TD, fontWeight: 800, fontSize: 96}}>{qua ? <Kim>{i + 1}</Kim> : <span style={{color: MO}}>{i + 1}</span>}</div>
              <Img src={logo(r.doi)} style={{width: 140, height: 140, objectFit: 'contain'}} />
              <div><div style={{fontFamily: TD, fontWeight: 800, fontSize: 62, color: CHU, lineHeight: 1}}>{ten(r.doi)}</div>
                <div style={{fontFamily: HUD, fontWeight: 600, fontSize: 28, color: MO, marginTop: 8, letterSpacing: '.06em'}}>{r.tr} TRẬN · {r.t}T {r.h}H {r.b}B · HS {r.bt - r.bb > 0 ? '+' : ''}{r.bt - r.bb}</div></div>
              <div style={{fontFamily: TD, fontWeight: 800, fontSize: 110, textAlign: 'right'}}><Kim>{r.d}</Kim></div>
            </div>
          </Kinh>
        </div>;
      })}
      <Hud s={{textAlign: 'center', fontSize: 26, color: MO, opacity: ra(f, 50, 65)}}>Top 2 vào chung kết · Thắng 3đ · Hòa 1đ</Hud>
    </div>
  </AbsoluteFill>;
};

// ================= VIDEO 1: KẾT QUẢ LƯỢT 1 =================
type SK = {loai: string; phut: number; ct: CT; doi: string};
const TranKQ: React.FC<{i: number}> = ({i}) => {
  const m = D.kq[i] as {a: string; b: string; ga: number; gb: number; ngay: string; su: SK[]};
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dem = (g: number) => Math.round(ra(f, 30, 60, 0, g));
  const giua = <div style={{display: 'flex', alignItems: 'center', gap: 30, fontFamily: TD, fontWeight: 800, fontSize: 230, lineHeight: 1, filter: 'drop-shadow(0 0 30px rgba(255,159,46,.6))'}}>
    <Kim c={m.ga >= m.gb ? KIM : BAC}>{dem(m.ga)}</Kim><span style={{color: MO, fontSize: 140}}>–</span><Kim c={m.gb >= m.ga ? KIM : BAC}>{dem(m.gb)}</Kim></div>;
  const ket = m.ga === m.gb ? 'HÒA' : `${ten(m.ga > m.gb ? m.a : m.b)} THẮNG`;
  // danh sách sự kiện: hiện từ frame 150, mỗi dòng cách 10 frame
  const XEP = 150;
  const lenSan = ra(f, XEP - 20, XEP, 0, 1);
  return <AbsoluteFill>
    <Nen src="vm/nen-san.jpg" toi={.6} /><Den /><Hat n={50} seed={'kq' + i} />
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${-lenSan * 330}px)`}}>
      <DoiDau a={m.a} b={m.b} giua={giua} nhan={`Kết quả lượt 1 · Trận ${i + 1} · ${m.ngay}`} phu={ket} />
    </div>
    <div style={{position: 'absolute', top: 1060, left: 50, right: 50, display: 'grid', gap: 16}}>
      {m.su.map((s, k) => {
        const sp = spring({frame: f - XEP - k * 10, fps, config: {damping: 14}});
        const trai = s.doi === m.a;
        return <div key={k} style={{opacity: sp, transform: `translateX(${(1 - sp) * (trai ? -600 : 600)}px)`}}>
          <Kinh nangLuong={false} s={{height: 128}}>
            <div style={{display: 'flex', flexDirection: trai ? 'row' : 'row-reverse', alignItems: 'center', gap: 22, height: '100%', padding: '0 22px'}}>
              <Img src={anh(s.ct.ma)} style={{width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', boxShadow: `0 0 0 4px ${MAU[s.doi]}`}} />
              <div style={{flex: 1, textAlign: trai ? 'left' : 'right'}}>
                <div style={{fontFamily: TD, fontWeight: 800, fontSize: 50, color: CHU, lineHeight: 1}}>{s.ct.ten}</div>
                <div style={{fontFamily: HUD, fontWeight: 600, fontSize: 26, color: MO, letterSpacing: '.08em', marginTop: 4}}>{ten(s.doi)}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                {s.loai === 'BAN' ? <span style={{fontSize: 46}}>⚽</span> : <span style={{display: 'inline-block', width: 34, height: 46, background: '#ffd60a', borderRadius: 4}} />}
                <span style={{fontFamily: TD, fontWeight: 800, fontSize: 64}}><Kim>{s.phut}'</Kim></span>
              </div>
            </div>
          </Kinh>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

// Mở thẻ FIFA người dẫn đầu ghi bàn
const VuaPhaLuoi: React.FC = () => {
  const f = useCurrentFrame();
  const dem: Record<string, {ct: CT; doi: string; ban: number[]}> = {};
  (D.kq as {su: SK[]}[]).forEach((m) => m.su.filter((s) => s.loai === 'BAN').forEach((s) => {
    dem[s.ct.ma] = dem[s.ct.ma] || {ct: s.ct, doi: s.doi, ban: []}; dem[s.ct.ma].ban.push(s.phut);
  }));
  const ds = Object.values(dem).sort((a, b) => b.ban.length - a.ban.length);
  const v = ds[0];
  const cot = ra(f, 5, 35, 0, 1);
  const xoay = interpolate(f, [20, 80], [180, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.3, .05, .2, 1)});
  const sc = interpolate(f, [20, 60, 80], [.6, 1.08, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kim = ra(f, 85, 125, 120, -120, Easing.inOut(Easing.cubic));
  const chu = ra(f, 90, 115);
  const cs = Object.entries(v.ct.cs);
  return <AbsoluteFill>
    <Nen src="vm/nen-duoi.jpg" toi={.78} /><Den /><Hat n={50} seed="vua" />
    <Hud s={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', fontSize: 36, opacity: ra(f, 0, 15)}}>◇ Dẫn đầu danh sách ghi bàn</Hud>
    <div style={{position: 'absolute', left: '50%', top: 470, width: 470, height: 1100, transform: 'translateX(-50%)', mixBlendMode: 'screen', filter: 'blur(8px)', opacity: cot * (.7 + Math.sin(f / 20) * .15),
      background: 'linear-gradient(0deg,rgba(255,214,102,.75),rgba(255,236,190,.3) 60%,transparent)', clipPath: `inset(${(1 - cot) * 100}% 0 0 0)`}} />
    <div style={{position: 'absolute', left: '50%', top: 1430, width: 700, height: 120, transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%,rgba(255,214,102,.6),transparent 72%)'}} />
    <div style={{position: 'absolute', left: '50%', top: 420, transform: `translateX(-50%) translateY(${Math.sin(f / 25) * 10}px)`, perspective: 1600}}>
      <div style={{transform: `rotateY(${xoay}deg) scale(${sc})`, transformStyle: 'preserve-3d', position: 'relative', width: 560, height: 762}}>
        <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', clipPath: 'polygon(50% 0,100% 7%,100% 88%,50% 100%,0 88%,0 7%)', background: 'radial-gradient(60% 50% at 50% 45%,#3a2a10,#120d06 75%)', transform: 'rotateY(180deg)', display: 'grid', placeItems: 'center'}}>
          <Img src={logo('rhino')} style={{width: 300}} />
        </div>
        <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden'}}>
          <The c={v.ct} w={560} doi={v.doi} />
          <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(110deg,transparent ${35 + kim}%,rgba(255,255,255,.6) ${48 + kim}%,transparent ${60 + kim}%)`}} />
        </div>
      </div>
    </div>
    <Bung x={540} y={800} bd={78} n={110} luc={18} seed="vpl" />
    <div style={{position: 'absolute', top: 1270, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 36, opacity: chu}}>
      {cs.map(([k, n], i) => <div key={k} style={{textAlign: 'center', opacity: ra(f, 95 + i * 4, 105 + i * 4)}}>
        <div style={{fontFamily: TD, fontWeight: 800, fontSize: 64, lineHeight: 1}}><Kim>{n}</Kim></div>
        <div style={{fontFamily: HUD, fontWeight: 600, fontSize: 24, color: MO}}>{k}</div></div>)}
    </div>
    <div style={{position: 'absolute', top: 1420, left: 0, right: 0, textAlign: 'center', opacity: chu, transform: `translateY(${(1 - chu) * 30}px)`}}>
      <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 210, lineHeight: .9, filter: 'drop-shadow(0 0 30px rgba(255,159,46,.6))'}}><Kim>{v.ban.length}</Kim><span style={{fontSize: 80, color: VANG}}> BÀN</span></div>
      <div style={{fontFamily: TD, fontWeight: 800, fontSize: 70, color: CHU}}>{v.ct.ten}</div>
      <Hud s={{fontSize: 30, color: MO}}>{ten(v.doi)} · phút {v.ban.map((p) => p + "'").join(' · ')}</Hud>
    </div>
  </AbsoluteFill>;
};

export const KQ1_TOTAL = 1290;
export const KetQuaLuot1Moi: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 30, KQ1_TOTAL - 60, KQ1_TOTAL], [0, .85, .85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#07060a', fontFamily: VIE}}>
    <Audio src={staticFile('vm/nhac/Mega_Hyper_Ultrastorm.mp3')} volume={vol} />
    <Sequence durationInFrames={120}><MoDau nhan="Giải Bóng Đá Rhino Billiards 2026" dong1="KẾT QUẢ" dong2="LƯỢT 1" phu={`VÒNG TRÒN · ${D.kq[0].ngay}`} /></Sequence>
    <Sequence from={120} durationInFrames={330}><TranKQ i={0} /></Sequence>
    <Sequence from={450} durationInFrames={300}><TranKQ i={1} /></Sequence>
    <Sequence from={750} durationInFrames={210}><VuaPhaLuoi /></Sequence>
    <Sequence from={960} durationInFrames={180}><BangXH tieu="Sau lượt 1" /></Sequence>
    <Sequence from={1140} durationInFrames={150}><KetThuc dong1="HẸN GẶP" dong2="LƯỢT 2 · 29/10" nhac="Mega Hyper Ultrastorm" /></Sequence>
  </AbsoluteFill>;
};

// ================= VIDEO 2: GIỚI THIỆU LƯỢT 2 =================
type Doi2 = {key: string; ten: string; sodo: string; dt: CT; xi: CT[]};
const SODO: Record<string, [number, number][]> = {
  '3-1-2': [[50, 102], [22, 65], [50, 70], [78, 65], [50, 42], [32, 15], [68, 15]],
  '1-3-2': [[50, 102], [50, 70], [18, 46], [50, 44], [82, 46], [32, 15], [68, 15]],
  '3-2-1': [[50, 102], [22, 73], [50, 75], [78, 73], [34, 46], [66, 46], [50, 15]],
  '2-3-1': [[50, 102], [26, 70], [74, 70], [18, 42], [50, 46], [82, 42], [50, 15]],
  '2-2-2': [[50, 102], [30, 75], [70, 75], [26, 46], [74, 46], [35, 15], [65, 15]],
  '2-1-2-1': [[50, 102], [28, 70], [72, 70], [50, 50], [22, 34], [78, 34], [50, 15]],
};
// Đội hình 1 đội trên sân dọc 3D (đội tấn công lên phía trên), thẻ ra sân theo tuyến
const DoiHinh: React.FC<{d: Doi2; nhan: string}> = ({d, nhan}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sd = SODO[d.sodo] || SODO['3-1-2'];
  const tuyen = (y: number) => (y >= 90 ? 0 : y >= 60 ? 1 : y >= 30 ? 2 : 3);
  const dem: Record<number, number> = {};
  const nghieng = ra(f, 0, 30, 0, 1);
  return <AbsoluteFill>
    <Nen src="vm/nen-duoi.jpg" toi={.75} /><Den /><Hat n={40} seed={'dh' + d.key} />
    <AbsoluteFill style={{background: `radial-gradient(60% 40% at 50% 60%,${MAU[d.key]}44,transparent 70%)`}} />
    <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: ra(f, 0, 15)}}>
      <Img src={logo(d.key)} style={{width: 170, height: 170, objectFit: 'contain', filter: `drop-shadow(0 0 30px ${MAU[d.key]}aa)`}} />
      <div><Hud s={{fontSize: 28}}>◇ {nhan}</Hud>
        <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 96, lineHeight: 1}}><Kim>{d.ten}</Kim></div>
        <Hud s={{fontSize: 30, color: CHU}}>Đội hình chính · {d.sodo}</Hud></div>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 400, height: 1420, perspective: 2200}}>
      <div style={{position: 'absolute', inset: 0, transform: `rotateX(${nghieng * 24}deg)`, transformOrigin: '50% 100%', transformStyle: 'preserve-3d'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 3px rgba(246,196,83,.6),0 30px 80px rgba(0,0,0,.7)'}}>
          <Img src={staticFile('vm/san.jpg')} style={{position: 'absolute', left: '50%', top: '50%', width: 1420, height: 960, transform: 'translate(-50%,-50%) rotate(90deg)', objectFit: 'fill'}} />
        </div>
        {d.xi.map((c, i) => {
          const p = sd[i]; if (!p) return null;
          const ln = tuyen(p[1]); dem[ln] = (dem[ln] || 0) + 1;
          const idx = ln * 3 + dem[ln] - 1;
          const s = spring({frame: f - 28 - idx * 6, fps, config: {damping: 11, mass: .8}});
          const x = 6 + p[0] * .88, y = 92 - (102 - p[1]) * .82;
          return <div key={c.ma} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-62%) translateY(${(1 - s) * 140}px) scale(${.6 + s * .4})`, opacity: Math.min(1, s * 1.5)}}>
            <The c={c} w={210} doi={d.key} dt={c.ma === d.dt.ma} />
          </div>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};
// Poster lượt 2 lộ ra trong đèn sân
const PosterCanh: React.FC = () => {
  const f = useCurrentFrame();
  const a = ra(f, 0, 35);
  const kim = ra(f, 30, 80, 120, -120, Easing.inOut(Easing.cubic));
  return <AbsoluteFill>
    <Nen src="vm/nen-duoi.jpg" toi={.8} /><Den /><Hat n={60} seed="po" />
    <div style={{position: 'absolute', left: '50%', top: 150, width: 860, transform: `translateX(-50%) perspective(1600px) rotateY(${(1 - a) * -25}deg) scale(${.9 + a * .1 + f * .0003})`, opacity: a,
      boxShadow: '0 0 0 3px rgba(255,231,163,.6),0 0 60px rgba(255,159,46,.35),0 50px 100px rgba(0,0,0,.8)'}}>
      <Img src={staticFile('vm/poster-l2.jpg')} style={{display: 'block', width: '100%'}} />
      <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(110deg,transparent ${35 + kim}%,rgba(255,236,190,.45) ${48 + kim}%,transparent ${60 + kim}%)`}} />
    </div>
  </AbsoluteFill>;
};
export const GT2_TOTAL = 1320;
export const GioiThieuLuot2Moi: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 30, GT2_TOTAL - 60, GT2_TOTAL], [0, .85, .85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const L2 = D.l2 as {gio: string; ngay: string; doi: Doi2[]}[];
  const gio = (g: string) => <div style={{textAlign: 'center', filter: 'drop-shadow(0 0 30px rgba(255,159,46,.6))'}}>
    <div style={{fontFamily: TD, fontStyle: 'italic', fontWeight: 800, fontSize: 200, lineHeight: .9}}><Kim>VS</Kim></div>
    <div style={{fontFamily: TD, fontWeight: 800, fontSize: 110, lineHeight: 1}}><Kim c={BAC}>{g}</Kim></div></div>;
  return <AbsoluteFill style={{background: '#07060a', fontFamily: VIE}}>
    <Audio src={staticFile('vm/nhac/Heroic_Age.mp3')} volume={vol} />
    <Sequence durationInFrames={120}><MoDau nhan="Thứ Năm · 29/10/2026" dong1="MATCH DAY" dong2="LƯỢT 02" phu="VÒNG TRÒN · 2 TRẬN · 15:30" /></Sequence>
    <Sequence from={120} durationInFrames={150}><BangXH tieu="Trước lượt 2" /></Sequence>
    {L2.map((t, i) => {
      const bd = 270 + i * 390;
      return <React.Fragment key={i}>
        <Sequence from={bd} durationInFrames={110}><AbsoluteFill><Nen src="vm/nen-san.jpg" toi={.6} /><Den /><Hat n={50} seed={'vs' + i} />
          <DoiDau a={t.doi[0].key} b={t.doi[1].key} giua={gio(t.gio)} nhan={`Trận ${i + 3} · ${t.ngay}`} phu={`${t.doi[0].ten} – ${t.doi[1].ten}`} /></AbsoluteFill></Sequence>
        <Sequence from={bd + 110} durationInFrames={140}><DoiHinh d={t.doi[0]} nhan={`Trận ${i + 3}`} /></Sequence>
        <Sequence from={bd + 250} durationInFrames={140}><DoiHinh d={t.doi[1]} nhan={`Trận ${i + 3}`} /></Sequence>
      </React.Fragment>;
    })}
    <Sequence from={1050} durationInFrames={120}><PosterCanh /></Sequence>
    <Sequence from={1170} durationInFrames={150}><KetThuc dong1="15:30 · THỨ NĂM" dong2="29/10/2026" nhac="Heroic Age" /></Sequence>
  </AbsoluteFill>;
};
