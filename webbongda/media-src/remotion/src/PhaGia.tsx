import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random, continueRender, delayRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {VL, BAN, LO, MAU_TRONG, HERO} from './vatly';

// "PHÁ BI – PHÁ GIÁ": quảng cáo KOMET II cho Halloween & Black Friday
const OSW = 'OswaldK', VIE = 'VietK';
const _h = delayRender('fonts-kb');
Promise.all([
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
  new FontFace(VIE, `url(${staticFile('BeVietnamPro-800.ttf')})`, {weight: '800'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

export type Dot = 'bf' | 'hl';
// Số giảm giá MẪU — đổi ở đây khi có số thật
const CFG = {
  bf: {ten: 'BLACK FRIDAY', ngay: 'NOV 27 – NOV 30', giam: 30, cu: 349, chu: '#f5c84b', nen: '#05070c', vai: '#0d2a4f', bi: '#141414', so: '#f5c84b', hero: '#f5c84b', heroChu: '#120d00', nhac: 'kb/bf.mp3', nhacTu: 0},
  hl: {ten: 'HALLOWEEN', ngay: 'OCT 24 – OCT 31', giam: 20, cu: 349, chu: '#ff7a1a', nen: '#08040f', vai: '#2a1145', bi: '#ff7a1a', so: '#1a0a00', hero: '#a26bff', heroChu: '#ffffff', nhac: 'kb/hl.mp3', nhacTu: 27},
};
const moi = (d: Dot) => Math.round(CFG[d].cu * (100 - CFG[d].giam) / 100);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const vao = (f: number, a: number, len = 14) => interpolate(f - a, [0, len], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});

// ---------- vân bi (canvas) ----------
function vanBi(nen: string, chu: string, mauChu: string, vien: string, bi: 'bi' | 'bingo' | 'cai'): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d')!;
  g.fillStyle = nen; g.fillRect(0, 0, 1024, 512);
  if (bi === 'bingo') { g.strokeStyle = 'rgba(120,40,0,.55)'; g.lineWidth = 14; for (let i = 0; i < 16; i++) { g.beginPath(); g.moveTo(i * 64 + 32, 0); g.lineTo(i * 64 + 32, 512); g.stroke(); } }
  if (bi === 'cai') { g.fillStyle = '#d6263a'; for (const u of [0.25, 0.75]) { g.beginPath(); g.arc(u * 1024, 256, 22, 0, Math.PI * 2); g.fill(); } }
  else for (const u of [0.25, 0.75]) {
    g.fillStyle = vien; g.beginPath(); g.ellipse(u * 1024, 256, 150, 118, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = mauChu; g.font = `700 ${chu.length > 4 ? 92 : 108}px OswaldK, Oswald, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(chu, u * 1024, 262);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function vaiBan(mau: string): THREE.CanvasTexture {   // nỉ bàn có hạt
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d')!;
  g.fillStyle = mau; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(255,255,255,${random('n' + i) * 0.05})`; g.fillRect(random('x' + i) * 512, random('y' + i) * 512, 1.5, 1.5); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 3); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------- thời gian cảnh bàn bi ----------
export const BB = {gioiThieu: 75, rut: 20, dam: 8, mp: 165, giu: 40};
export const BB_LEN = BB.gioiThieu + BB.rut + BB.dam + BB.mp + BB.giu;
const CHAM = BB.gioiThieu + BB.rut + BB.dam;   // khung hình gậy chạm bi
// thời gian mô phỏng theo khung hình: chạy chậm quanh lúc va chạm (slow-motion) rồi nhanh dần
function tSim(f: number): number {
  const g = f - CHAM; if (g <= 0) return 0;
  const moc = [0, 10, 62, 135, BB.mp], ts = [0, 0.085, 0.2, 0.68, 0.92];
  return interpolate(g, moc, ts, {...cl, easing: Easing.inOut(Easing.quad)});
}
const mau = (i: number, t: number) => { const b = VL.bi[i]; const k = Math.min(b.length - 1, t * MAU_TRONG); const a = b[Math.floor(k)], c = b[Math.ceil(k)], r = k - Math.floor(k);
  return {x: a.x + (c.x - a.x) * r, z: a.z + (c.z - a.z) * r, q: c.q, vao: a.vao, ham: a.ham}; };
const LO_HERO = (() => { const b = VL.bi[HERO]; const m = b.find((x) => x.vao)!; return [m.x, m.z]; })();

const BanBi: React.FC<{d: Dot}> = ({d}) => {
  const f = useCurrentFrame(); const {width, height} = useVideoConfig(); const C = CFG[d];
  const tex = useMemo(() => ({
    bi: vanBi(C.bi, '$' + C.cu, C.so, d === 'bf' ? '#2a2a2a' : '#ffd9a8', d === 'hl' ? 'bingo' : 'bi'),
    hero: vanBi(C.hero, `-${C.giam}%`, C.heroChu, d === 'bf' ? '#fff3c4' : '#3b1a7a', 'bi'),
    cai: vanBi('#f4f1ea', '', '', '', 'cai'),
    vai: vaiBan(C.vai),
  }), [d]);
  const t = tSim(f);
  const baseQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.75, 0.35, 0));
  // máy quay: đẩy chậm vào bàn, rung khi chạm, cuối cùng theo bi giảm giá về lỗ
  const theo = interpolate(f, [CHAM + 64, CHAM + 128], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const rung = f >= CHAM && f < CHAM + 10 ? (random('r' + f) - 0.5) * 0.04 * (CHAM + 10 - f) / 10 : 0;
  const mo = interpolate(f, [0, 70], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});   // 0 = cận tam giác bi, 1 = toàn cảnh
  const P0 = [0.92, 0.2, 0.42], L0 = [0.68, 0.02, 0.0], P1 = [-0.05, 1.05, 1.25], L1 = [0.25, 0, 0];
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const day = interpolate(f, [70, CHAM + 60], [0, 1], cl);   // đẩy nhẹ trong lúc phá
  const camX = lerp(lerp(P0[0], P1[0], mo) + 0.1 * day, LO_HERO[0] + 0.05, theo) + rung;
  const camY = lerp(lerp(P0[1], P1[1], mo) - 0.1 * day, 0.72, theo);
  const camZ = lerp(lerp(P0[2], P1[2], mo) - 0.1 * day, LO_HERO[1] + 0.62, theo);
  const nhinX = lerp(lerp(L0[0], L1[0], mo), LO_HERO[0], theo), nhinZ = lerp(lerp(L0[2], L1[2], mo), LO_HERO[1] - 0.12, theo);
  // gậy KOMET (xanh) rút về rồi đâm vào bi cái
  const xCai = VL.batDau[0][0], rutLui = interpolate(f, [BB.gioiThieu, BB.gioiThieu + BB.rut, CHAM], [0.35, 0.55, 0.0], {...cl, easing: Easing.in(Easing.quad)});
  const gayHien = interpolate(f, [BB.gioiThieu - 10, BB.gioiThieu, CHAM + 20, CHAM + 40], [0, 1, 1, 0], cl);
  const gayX = xCai - BAN.R - 0.01 - rutLui - (f > CHAM ? (f - CHAM) * 0.004 : 0);
  const sangLo = interpolate(f, [CHAM + 130, CHAM + 150, BB_LEN], [0, 1, 1.6], cl);
  return <ThreeCanvas width={width} height={height} camera={{fov: 38, position: [camX, camY, camZ]}} shadows gl={{antialias: true}}
>
    <Cam x={camX} y={camY} z={camZ} lx={nhinX} lz={nhinZ} />
    <color attach="background" args={[C.nen]} />
    <ambientLight intensity={0.25} />
    <spotLight position={[0.2, 2.6, 0.4]} angle={0.75} penumbra={0.6} intensity={38} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} color={'#fff4e0'} />
    <pointLight position={[LO_HERO[0], 0.05, LO_HERO[1] + 0.02]} intensity={sangLo * 3} distance={1.2} color={C.chu} />
    {/* mặt bàn + băng + lỗ */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BAN.L, BAN.W]} /><meshStandardMaterial map={tex.vai} roughness={0.95} /></mesh>
    {[[0, -BAN.W / 2 - 0.05, BAN.L + 0.2, 0.1], [0, BAN.W / 2 + 0.05, BAN.L + 0.2, 0.1], [-BAN.L / 2 - 0.05, 0, 0.1, BAN.W], [BAN.L / 2 + 0.05, 0, 0.1, BAN.W]].map(([x, z, w, dd], i) =>
      <mesh key={i} position={[x, 0.025, z]} castShadow receiveShadow><boxGeometry args={[w, 0.05, dd]} /><meshStandardMaterial color={'#141016'} roughness={0.5} metalness={0.2} /></mesh>)}
    {LO.map(([x, z], i) => <mesh key={i} position={[x, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.058, 40]} /><meshBasicMaterial color={'#000'} /></mesh>)}
    {/* bi */}
    {VL.bi.map((_, i) => { const m = mau(i, t); if (m.ham >= 1) return null;
      const q = new THREE.Quaternion(...m.q).multiply(baseQ);
      const y = BAN.R - m.ham * 0.08, s = 1 - m.ham * 0.3;
      return <mesh key={i} position={[m.x, y, m.z]} quaternion={q} scale={s} castShadow>
        <sphereGeometry args={[BAN.R, 48, 32]} />
        <meshPhysicalMaterial map={i === 0 ? tex.cai : i === HERO ? tex.hero : tex.bi} roughness={d === 'bf' && i > 0 && i !== HERO ? 0.35 : 0.18} clearcoat={1} clearcoatRoughness={0.08}
          metalness={i === HERO && d === 'bf' ? 0.45 : 0} emissive={i === HERO ? new THREE.Color(C.hero) : new THREE.Color('#000')} emissiveIntensity={i === HERO ? 0.25 + 0.25 * Math.sin(f / 5) : 0} />
      </mesh>; })}
    {/* gậy */}
    {gayHien > 0.01 && <group position={[gayX - 0.7, BAN.R + 0.02, VL.batDau[0][1]]} rotation={[0, 0, Math.PI / 2 + 0.06]}>
      <mesh position={[0, -0.0, 0]}><cylinderGeometry args={[0.007, 0.0065, 0.75, 24]} /><meshStandardMaterial color={'#1d1f24'} metalness={0.3} roughness={0.35} transparent opacity={gayHien} /></mesh>
      <mesh position={[0, 0.376, 0]}><cylinderGeometry args={[0.0066, 0.0066, 0.012, 24]} /><meshStandardMaterial color={'#e8e8e8'} transparent opacity={gayHien} /></mesh>
      <mesh position={[0, -0.75, 0]}><cylinderGeometry args={[0.0075, 0.0105, 0.75, 24]} /><meshStandardMaterial color={'#1f6fff'} metalness={0.5} roughness={0.25} transparent opacity={gayHien} /></mesh>
    </group>}
  </ThreeCanvas>;
};
const Cam: React.FC<{x: number; y: number; z: number; lx: number; lz: number}> = ({x, y, z, lx, lz}) => {
  // đặt máy quay theo từng khung hình
  const camera = useThree((st) => st.camera);
  camera.position.set(x, y, z); camera.lookAt(lx, 0, lz); camera.updateProjectionMatrix();
  return null;
};

// ---------- các cảnh 2D ----------
const Mo: React.FC<{d: Dot}> = ({d}) => {   // cảnh quay thật mở đầu
  const f = useCurrentFrame(); const C = CFG[d];
  const a = vao(f, 6), b = vao(f, 22);
  return <AbsoluteFill style={{background: '#000'}}>
    <OffthreadVideo src={staticFile('kb/kom_p.mp4')} startFrom={2 * 30} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.75), transparent 60%)'}} />
    <div style={{position: 'absolute', left: 130, top: 360}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, letterSpacing: '0.36em', color: C.chu, opacity: a}}>{C.ten}</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 150, lineHeight: 0.95, color: '#fff', marginTop: 12, opacity: b, transform: `translateX(${(1 - b) * -40}px)`}}>ONE BREAK.</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 150, lineHeight: 0.95, color: C.chu, opacity: vao(f, 36), transform: `translateX(${(1 - vao(f, 36)) * -40}px)`}}>BIG SAVINGS.</div>
    </div>
  </AbsoluteFill>;
};
const LopBan: React.FC<{d: Dot}> = ({d}) => {   // chữ đè lên cảnh bàn bi
  const f = useCurrentFrame(); const C = CFG[d];
  const o = interpolate(f, [8, 22, BB.gioiThieu - 6, BB.gioiThieu + 4], [0, 1, 1, 0], cl);
  const slow = interpolate(f, [CHAM + 4, CHAM + 12, CHAM + 66, CHAM + 74], [0, 1, 1, 0], cl);
  const flash = interpolate(f, [CHAM, CHAM + 6], [0.85, 0], cl) * (f >= CHAM ? 1 : 0);
  const trang = interpolate(f, [BB_LEN - 14, BB_LEN], [0, 1], cl);
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.7) 100%)'}} />
    <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 28, letterSpacing: '0.4em', color: '#c9d2e6'}}>EVERY BALL IS A FULL PRICE</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 120, color: '#fff', lineHeight: 1.05}}>BREAK THE <span style={{color: C.chu}}>PRICE</span></div>
    </div>
    <div style={{position: 'absolute', bottom: 90, right: 110, opacity: slow, fontFamily: VIE, fontWeight: 800, fontSize: 26, letterSpacing: '0.3em', color: '#fff'}}>KOMET II · CARBON BREAK SHAFT</div>
    <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    <AbsoluteFill style={{background: C.chu, opacity: trang}} />
  </AbsoluteFill>;
};
const LoGia: React.FC<{d: Dot}> = ({d}) => {   // lộ giá: giá cũ vỡ, giá mới đập xuống
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const C = CFG[d];
  const slam = spring({frame: f - 4, fps, config: {damping: 9, stiffness: 200}});
  const vo = interpolate(f, [34, 52], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const moiS = spring({frame: f - 52, fps, config: {damping: 10, stiffness: 180}});
  const rung = f > 4 && f < 18 ? Math.sin(f * 3) * (18 - f) * 1.2 : 0;
  return <AbsoluteFill style={{background: C.chu, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,.5), transparent 55%)`}} />
    {d === 'hl' && Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: `${random('bx' + i) * 100}%`, top: `${(random('by' + i) * 100 + f * (0.3 + random('bs' + i))) % 110 - 5}%`,
      width: 70 + random('bz' + i) * 70, opacity: 0.22, transform: `rotate(${random('br' + i) * 40 - 20}deg)`}}>
      <svg viewBox="-50 -25 100 50" style={{width: '100%'}}><path d="M0 -4 C -8 -12, -20 -18, -48 -10 C -38 2, -34 6, -26 4 C -22 10, -14 6, -8 10 C -4 6, -2 4, 0 6 C 2 4, 4 6, 8 10 C 14 6, 22 10, 26 4 C 34 6, 38 2, 48 -10 C 20 -18, 8 -12, 0 -4 Z" fill="#000" /></svg></div>)}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `translate(${rung}px, ${rung * 0.6}px)`}}>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 380, lineHeight: 0.85, color: '#0b0b0b', transform: `scale(${2.6 - 1.6 * slam})`, opacity: Math.min(1, slam * 2), letterSpacing: '-0.02em'}}>-{C.giam}%</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 60, marginTop: 30, height: 170}}>
        <div style={{position: 'relative', fontFamily: OSW, fontWeight: 700, fontSize: 120, color: 'rgba(0,0,0,.55)', opacity: vao(f, 18)}}>
          <span style={{display: 'inline-block', transform: `translate(${-vo * 60}px, ${vo * 260}px) rotate(${-vo * 25}deg)`, opacity: 1 - vo * 0.8}}>${C.cu}</span>
          <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 10, background: '#b0001e', transform: `scaleX(${vao(f, 26, 8)}) rotate(-8deg)`, transformOrigin: 'left'}} />
        </div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 170, color: '#000', transform: `scale(${0.3 + 0.7 * moiS})`, opacity: Math.min(1, moiS * 2)}}>${moi(d)}</div>
      </div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, letterSpacing: '0.34em', color: '#000', marginTop: 34, opacity: vao(f, 64)}}>KOMET II BREAK CUE · {C.ten}</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const Nhanh: React.FC<{d: Dot}> = ({d}) => {   // cắt nhanh cảnh quay thật + chữ động
  const f = useCurrentFrame(); const C = CFG[d];
  const doan: [number, number, string][] = [[9.0, 24, 'BUILT TO BREAK'], [12.0, 24, '13MM BAKELITE TIP'], [14.5, 24, '100% CARBON SHAFT']];
  let t = 0; const out: React.ReactNode[] = [];
  doan.forEach(([s, len, chu], i) => {
    out.push(<Sequence key={i} from={t} durationInFrames={len}>
      <AbsoluteFill style={{background: '#000'}}>
        <OffthreadVideo src={staticFile('kb/kom_p.mp4')} startFrom={Math.round(s * 30)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)'}} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120}}>
          <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 110, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '6px 40px', borderLeft: `14px solid ${C.chu}`}}>{chu}</div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>); t += len; });
  return <AbsoluteFill>{out}</AbsoluteFill>;
};
const Ket: React.FC<{d: Dot}> = ({d}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const C = CFG[d];
  const a = spring({frame: f - 4, fps, config: {damping: 13}}), b = vao(f, 18), c = vao(f, 30);
  return <AbsoluteFill style={{background: C.nen}}>
    <OffthreadVideo src={staticFile('kb/kom_p.mp4')} startFrom={5 * 30} muted style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transform: 'translateX(22%)'}} />
    <AbsoluteFill style={{background: `linear-gradient(90deg, ${C.nen} 30%, transparent 75%)`}} />
    <div style={{position: 'absolute', left: 130, top: 210}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 32, letterSpacing: '0.36em', color: C.chu, opacity: a}}>{C.ten} · {C.ngay}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 10, opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 240, lineHeight: 1, color: C.chu}}>-{C.giam}%</div>
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 26, opacity: b}}>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 70, color: '#8a93a6', textDecoration: 'line-through'}}>${C.cu}</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 120, color: '#fff'}}>${moi(d)}</div>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: '#c9d2e6', letterSpacing: '0.2em'}}>KOMET II</div>
      </div>
      <div style={{display: 'flex', gap: 24, alignItems: 'center', marginTop: 40, opacity: c}}>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, color: '#000', background: C.chu, padding: '18px 46px', transform: `scale(${1 + 0.03 * Math.sin(f / 5)})`}}>SHOP NOW</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 60, color: '#fff'}}>rhino-billiards.com</div>
      </div>
    </div>
    <Img src={staticFile('rh/logo.png')} style={{position: 'absolute', left: 130, bottom: 110, width: 330, opacity: c}} />
  </AbsoluteFill>;
};

export const PG = {mo: 90, ban: BB_LEN, lo: 100, nhanh: 72, ket: 135};
export const PG_TOTAL = PG.mo + PG.ban + PG.lo + PG.nhanh + PG.ket;
export const PhaGia: React.FC<{d: Dot}> = ({d}) => {
  const f = useCurrentFrame(); const {durationInFrames: D} = useVideoConfig(); const C = CFG[d];
  const t1 = PG.mo, t2 = t1 + PG.ban, t3 = t2 + PG.lo, t4 = t3 + PG.nhanh;
  return <AbsoluteFill style={{background: '#000'}}>
    <Sequence durationInFrames={PG.mo}><Mo d={d} /></Sequence>
    <Sequence from={t1} durationInFrames={PG.ban}><AbsoluteFill><BanBi d={d} /></AbsoluteFill><LopBan d={d} /></Sequence>
    <Sequence from={t2} durationInFrames={PG.lo}><LoGia d={d} /></Sequence>
    <Sequence from={t3} durationInFrames={PG.nhanh}><Nhanh d={d} /></Sequence>
    <Sequence from={t4} durationInFrames={PG.ket}><Ket d={d} /></Sequence>
    <Audio src={staticFile(C.nhac)} startFrom={C.nhacTu * 30} volume={(fr) => interpolate(fr, [0, 15, D - 40, D], [0, 0.75, 0.75, 0], cl)} />
    <Sequence from={t1 + CHAM}><Audio src={staticFile('kb/sfx_pha.wav')} volume={1} /></Sequence>
    <Sequence from={t1 + CHAM + 132}><Audio src={staticFile('kb/sfx_lo.wav')} volume={0.9} /></Sequence>
    <Sequence from={t2 - 8}><Audio src={staticFile('kb/sfx_vut.wav')} volume={0.6} /></Sequence>
    <Sequence from={t2 + 4}><Audio src={staticFile('kb/sfx_boom.wav')} volume={1} /></Sequence>
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 8, D - 12, D], [1, 0, 0, 1], cl), pointerEvents: 'none'}} />
  </AbsoluteFill>;
};
export const PhaGiaBF: React.FC = () => <PhaGia d="bf" />;
export const PhaGiaHL: React.FC = () => <PhaGia d="hl" />;
