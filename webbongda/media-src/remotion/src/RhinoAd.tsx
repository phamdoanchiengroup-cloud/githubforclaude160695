import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

// Video quảng cáo gậy Rhino: ảnh & thông số lấy từ rhino-billiards.com
const OSW = 'OswaldR', VIE = 'VietR';
const _h = delayRender('fonts-rhino');
Promise.all([
  new FontFace(OSW, `url(${staticFile('Oswald-700.ttf')})`, {weight: '700'}).load(),
  new FontFace(VIE, `url(${staticFile('BeVietnamPro-800.ttf')})`, {weight: '800'}).load(),
]).then((fs) => { fs.forEach((x) => (document as any).fonts.add(x)); continueRender(_h); });

const NEN = '#07090f';
type SP = {key: string; ten: string; phu: string; loai: string; mo: string; chips: string[]; gia: string; mau: string; mau2: string};
const SPS: SP[] = [
  {key: 'voy', ten: 'VOYAGER USA 2025', phu: 'POOL CUE', loai: 'Gậy đánh', mo: 'Cảm hứng lá cờ Mỹ – đẳng cấp thi đấu quốc tế', chips: ['100% Carbon Fiber', 'Đầu Time Crystal 12.5mm', 'Pro Taper'], gia: '$419', mau: '#e63946', mau2: '#3a6cff'},
  {key: 'neb', ten: 'NEBULA 2', phu: 'POOL CUE', loai: 'Gậy đánh', mo: 'Thể thao, cá tính – 10 màu cho bạn chọn', chips: ['100% Carbon Fiber', 'Tay cầm 3D-Friction', 'Đầu 12.4 / 12.8mm'], gia: '$389', mau: '#ff2d55', mau2: '#ff8a5c'},
  {key: 'lum', ten: 'LUMINAX', phu: 'POOL CUE', loai: 'Gậy đánh', mo: 'Sợi thủy tinh – công nghệ giảm lệch bi', chips: ['Glass Fiber Composite', 'Hybrid Taper', 'Đầu composite 8 lớp'], gia: '$309', mau: '#dfe8f5', mau2: '#7fd6ff'},
  {key: 'ret', ten: 'RETRÔ', phu: 'POOL CUE', loai: 'Gậy đánh', mo: 'Vân gỗ cổ điển trên nền carbon hiện đại', chips: ['5 mẫu vân gỗ quý', 'Bọc da vân thằn lằn', 'Đầu Time Crystal'], gia: '$399', mau: '#d9894a', mau2: '#f2c48d'},
  {key: 'kom', ten: 'KOMET II', phu: 'BREAK CUE', loai: 'Gậy phá', mo: 'Cú phá uy lực, chính xác đến từng centimet', chips: ['Thân 100% Carbon', 'Đầu Bakelite 13mm', 'Hybrid Pro Taper'], gia: '$349', mau: '#2f8bff', mau2: '#9ad0ff'},
];
const T = {intro: 135, sp: 165, tech: 150, outro: 150, tr: 15};
export const RHINO_TOTAL = T.intro + T.sp * SPS.length + T.tech + T.outro - T.tr * (SPS.length + 2);

const vao = (f: number, d: number, dur = 18) => interpolate(f - d, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

// Nền tối có vệt sáng chéo màu theo sản phẩm
const Nen: React.FC<{mau: string}> = ({mau}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: NEN}}>
    <AbsoluteFill style={{background: `radial-gradient(70% 90% at 30% 50%, ${mau}38, transparent 70%)`}} />
    <AbsoluteFill style={{background: `linear-gradient(115deg, transparent 40%, ${mau}22 48%, transparent 56%)`, transform: `translateX(${interpolate(f, [0, 165], [-300, 300])}px)`}} />
    <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 4px)'}} />
  </AbsoluteFill>;
};

const Intro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const z = interpolate(f, [0, 135], [1.12, 1.0]);
  const t1 = vao(f, 10), t2 = vao(f, 28);
  const lg = spring({frame: f - 70, fps, config: {damping: 14}});
  const toi = interpolate(f, [60, 85], [0, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile('rh/craft.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 55%, rgba(0,0,0,.1) 100%)'}} />
    <AbsoluteFill style={{background: '#000', opacity: toi}} />
    <div style={{position: 'absolute', left: 120, top: 330, opacity: interpolate(f, [52, 70], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, letterSpacing: '0.3em', color: '#4fc3ff', opacity: t1, transform: `translateY(${(1 - t1) * 20}px)`}}>CHẾ TÁC TỪNG CÂY GẬY</div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 120, lineHeight: 1.02, color: '#fff', marginTop: 14, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`}}>CÔNG NGHỆ<br />CARBON</div>
    </div>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: lg}}>
      <Img src={staticFile('rh/logo.png')} style={{width: 980, transform: `scale(${0.85 + 0.15 * lg})`, filter: 'drop-shadow(0 0 40px rgba(79,195,255,.35))'}} />
    </AbsoluteFill>
  </AbsoluteFill>;
};

const SanPham: React.FC<{sp: SP; idx: number}> = ({sp, idx}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const card = spring({frame: f, fps, config: {damping: 16}});
  const det = interpolate(f, [70, 88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const z1 = interpolate(f, [0, 165], [1.0, 1.08]), z2 = interpolate(f, [70, 165], [1.12, 1.0], {extrapolateLeft: 'clamp'});
  const ten = vao(f, 10), mo = vao(f, 22), gia = spring({frame: f - 58, fps, config: {damping: 12, stiffness: 160}});
  return <AbsoluteFill>
    <Nen mau={sp.mau} />
    {/* ảnh sản phẩm */}
    <div style={{position: 'absolute', left: 110, top: 120, width: 840, height: 840, borderRadius: 28, overflow: 'hidden', background: '#e9eaee',
      boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 2px ${sp.mau}55`, transform: `translateX(${(1 - card) * -140}px) rotate(${(1 - card) * -4}deg)`, opacity: card}}>
      <Img src={staticFile(`rh/${sp.key}_hero.jpg`)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z1})`}} />
      <Img src={staticFile(`rh/${sp.key}_det.jpg`)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: det, transform: `scale(${z2})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: `linear-gradient(90deg, ${sp.mau}, ${sp.mau2})`}} />
    </div>
    {/* chữ */}
    <div style={{position: 'absolute', left: 1030, top: 170, width: 800}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: ten}}>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 24, letterSpacing: '0.28em', color: sp.mau2}}>{String(idx + 1).padStart(2, '0')} / {SPS.length}</div>
        <div style={{height: 2, width: 80 * ten, background: sp.mau2}} />
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 24, letterSpacing: '0.24em', color: '#9aa3b8'}}>{sp.phu}</div>
      </div>
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: sp.ten.length > 12 ? 104 : 140, lineHeight: 1, color: '#fff', marginTop: 18,
        opacity: ten, transform: `translateY(${(1 - ten) * 40}px)`, textShadow: `0 0 40px ${sp.mau}66`}}>{sp.ten}</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 34, lineHeight: 1.35, color: '#d7dceb', marginTop: 22, opacity: mo, transform: `translateY(${(1 - mo) * 24}px)`}}>{sp.mo}</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36}}>
        {sp.chips.map((c, i) => { const k = vao(f, 34 + i * 7, 14);
          return <div key={i} style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#fff', padding: '12px 22px', borderRadius: 999, border: `2px solid ${sp.mau}`,
            background: 'rgba(255,255,255,.04)', opacity: k, transform: `translateX(${(1 - k) * 40}px)`}}>{c}</div>; })}
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 50, opacity: Math.min(1, gia * 1.5), transform: `scale(${0.7 + 0.3 * gia})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#9aa3b8', letterSpacing: '0.18em'}}>GIÁ CHỈ TỪ</div>
        <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 92, color: sp.mau2}}>{sp.gia}</div>
      </div>
    </div>
  </AbsoluteFill>;
};

const CongNghe: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const items = [['tip', 'ĐẦU TIME CRYSTAL', 'Bám bi tốt, bền bỉ'], ['joint', 'KHỚP NỐI 3/8-8', 'Thép không gỉ, siêu cứng'], ['bolt', 'HỆ THỐNG CHỈNH TẠ', 'Tùy chỉnh trọng lượng gậy']];
  const h = vao(f, 0);
  return <AbsoluteFill>
    <Nen mau="#4fc3ff" />
    <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', opacity: h, transform: `translateY(${(1 - h) * 30}px)`}}>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, letterSpacing: '0.3em', color: '#4fc3ff'}}>CÔNG NGHỆ TRÊN MỌI CÂY GẬY RHINO</div>
    </div>
    <div style={{position: 'absolute', top: 200, left: 110, right: 110, display: 'flex', gap: 50}}>
      {items.map(([img, t, s], i) => { const k = spring({frame: f - 10 - i * 8, fps, config: {damping: 15}});
        return <div key={i} style={{flex: 1, opacity: k, transform: `translateY(${(1 - k) * 120}px)`}}>
          <div style={{borderRadius: 24, overflow: 'hidden', aspectRatio: '1', boxShadow: '0 30px 70px rgba(0,0,0,.55)', background: '#e9eaee'}}>
            <Img src={staticFile(`rh/${img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, 150], [1.08, 1])})`}} />
          </div>
          <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 46, color: '#fff', marginTop: 26, textAlign: 'center'}}>{t}</div>
          <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 26, color: '#9aa3b8', textAlign: 'center', marginTop: 6}}>{s}</div>
        </div>; })}
    </div>
  </AbsoluteFill>;
};

const Outro: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const lg = spring({frame: f, fps, config: {damping: 13}}), w = vao(f, 25), c = vao(f, 40);
  return <AbsoluteFill>
    <Nen mau="#4fc3ff" />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44}}>
      <Img src={staticFile('rh/logo.png')} style={{width: 1000, opacity: lg, transform: `scale(${0.8 + 0.2 * lg})`, filter: 'drop-shadow(0 0 40px rgba(79,195,255,.35))'}} />
      <div style={{fontFamily: OSW, fontWeight: 700, fontSize: 74, color: '#fff', letterSpacing: '0.04em', opacity: w, transform: `translateY(${(1 - w) * 30}px)`}}>rhino-billiards.com</div>
      <div style={{fontFamily: VIE, fontWeight: 800, fontSize: 30, color: '#07090f', background: 'linear-gradient(135deg,#4fc3ff,#9ae6ff)', padding: '16px 44px', borderRadius: 999, opacity: c,
        transform: `scale(${0.9 + 0.1 * c + 0.02 * Math.sin(f / 6)})`}}>Chọn cây gậy của bạn ngay hôm nay</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export const RhinoAd: React.FC = () => {
  const {durationInFrames: D} = useVideoConfig(); const f = useCurrentFrame();
  const tr = linearTiming({durationInFrames: T.tr});
  const seq: React.ReactNode[] = [<TransitionSeries.Sequence key="i" durationInFrames={T.intro}><Intro /></TransitionSeries.Sequence>];
  SPS.forEach((sp, i) => {
    seq.push(<TransitionSeries.Transition key={'t' + i} presentation={i % 2 ? slide({direction: 'from-right'}) : wipe({direction: 'from-left'})} timing={tr} />);
    seq.push(<TransitionSeries.Sequence key={sp.key} durationInFrames={T.sp}><SanPham sp={sp} idx={i} /></TransitionSeries.Sequence>);
  });
  seq.push(<TransitionSeries.Transition key="tt" presentation={fade()} timing={tr} />);
  seq.push(<TransitionSeries.Sequence key="cn" durationInFrames={T.tech}><CongNghe /></TransitionSeries.Sequence>);
  seq.push(<TransitionSeries.Transition key="to" presentation={fade()} timing={tr} />);
  seq.push(<TransitionSeries.Sequence key="o" durationInFrames={T.outro}><Outro /></TransitionSeries.Sequence>);
  return <AbsoluteFill style={{background: NEN}}>
    <TransitionSeries>{seq}</TransitionSeries>
    <Audio src={staticFile('rh/music.mp3')} volume={(fr) => interpolate(fr, [0, 15, D - 50, D], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [D - 20, D], [0, 1], {extrapolateLeft: 'clamp'})}} />
  </AbsoluteFill>;
};
