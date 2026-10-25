// KẾT QUẢ VÒNG 1 — Giải Bóng Đá Rhino Billiards 2026.
// One module, four kinds (params.kind): open | match | table | outro. Everything is drawn in a
// Canvas2D layer and composited over an ink field with a faint pitch grid; the signal colour glows.
import type * as THREE from 'three';
import { Scene, type Frame, type PostOverrides } from '../engine/scene';
import { FSPass, Layer2D, W, H } from '../engine/gl';
import { HEX, LIN, rgba } from '../engine/palette';
import { F, font, measure } from '../engine/type';
import { clamp, ease, lerp, prog, pulse } from '../engine/util';

type Goal = { m: number; ten: string; so: string; the: string };
type Doi = { key: string; ten: string; ban: number; goals: Goal[]; vang?: { m: number; ten: string }[] };

const imgCache = new Map<string, Promise<HTMLImageElement>>();
function img(src: string) {
  let p = imgCache.get(src);
  if (!p) {
    p = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src)); i.src = src; });
    imgCache.set(src, p);
  }
  return p;
}

const LOGO = (k: string) => `/kq/logo_${k}.png`;
const CARD = (ma: string, k: string) => `/kq/c_${ma}_${k}.png`;

export default class Kq extends Scene {
  L = new Layer2D();
  comp!: FSPass;
  kind = 'open';
  im = new Map<string, HTMLImageElement>();
  db: number[] = [];
  f = {
    huge: F.archivo(125, 900), wide: F.archivo(112, 900), cond: F.archivo(75, 900), condB: F.archivo(75, 700),
    head: F.archivo(100, 800), body: F.archivo(100, 500), thin: F.archivo(100, 300), mono: F.mono(500), monoL: F.mono(400),
    it: F.archivoItalic(100, 800),
  };

  override async init() {
    const p = this.ctx.params;
    this.kind = p.kind ?? 'open';
    const srcs = new Set<string>(['/kq/rhino_logo_trang.png']);
    for (const k of ['rhino', 'evo', 'cuebots', 'timetip']) srcs.add(LOGO(k));
    if (this.kind === 'match') for (const d of [p.a, p.b] as Doi[]) for (const g of d.goals) srcs.add(CARD(g.the, d.key));
    await Promise.all([...srcs].map(async (s) => this.im.set(s, await img(s))));
    // the bar grid inside this entry
    const { start, end, audio } = this.ctx;
    this.db = audio.downbeats.filter((d) => d >= start - 0.01 && d <= end + 0.01);
    this.comp = new FSPass(COMP, {
      tex: { value: this.L.texture }, bg: { value: LIN.ink }, line: { value: LIN.graphite }, sig: { value: LIN.signal },
      t: { value: 0 }, beat: { value: 0 }, hot: { value: 1.2 }, grid: { value: 1 },
    });
  }

  /** Time of beat n (quarter notes) from this entry's start. */
  private bt(n: number) { return this.ctx.audio.timeOfBeat(Math.round(this.ctx.audio.beatAt(this.ctx.start)) + n); }

  render(f: Frame, out: THREE.WebGLRenderTarget): PostOverrides {
    const L = this.L; L.clear();
    const c = L.ctx;
    c.textBaseline = 'alphabetic';
    let o: PostOverrides = {};
    if (this.kind === 'open') o = this.open(c, f);
    else if (this.kind === 'match') o = this.match(c, f);
    else if (this.kind === 'table') o = this.table(c, f);
    else o = this.outro(c, f);
    this.chrome(c, f);
    L.upload();
    this.comp.u.t!.value = f.t;
    this.comp.u.beat!.value = f.beatPhase;
    this.comp.render(this.ctx.renderer, out);
    return { bloom: 0.55, bloomThreshold: 0.9, halation: 0.22, ca: 0.8, grain: 0.05, vignette: 0.42, hud: 0, ...o };
  }

  // ------------------------------------------------------------------ helpers
  private text(c: CanvasRenderingContext2D, s: string, fam: string, size: number, x: number, y: number, o: { col?: string; align?: CanvasTextAlign; track?: number; scale?: number; a?: number; maxW?: number } = {}) {
    let sz = size;
    if (o.maxW) { const w = measure(s, fam, sz, (o.track ?? 0) * sz); if (w > o.maxW) sz *= o.maxW / w; }
    c.save();
    c.globalAlpha = (o.a ?? 1) * c.globalAlpha;
    c.translate(x, y);
    if (o.scale && o.scale !== 1) c.scale(o.scale, o.scale);
    c.font = font(fam, sz);
    c.letterSpacing = `${(o.track ?? 0) * sz}px`;
    c.fillStyle = o.col ?? HEX.bone;
    c.textAlign = o.align ?? 'center';
    c.fillText(s, 0, 0);
    c.restore();
  }
  private image(c: CanvasRenderingContext2D, src: string, cx: number, cy: number, h: number, o: { a?: number; scale?: number; glow?: string } = {}) {
    const i = this.im.get(src); if (!i) return;
    const s = (o.scale ?? 1), hh = h * s, ww = (i.width / i.height) * hh;
    c.save();
    c.globalAlpha = (o.a ?? 1);
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = 40; }
    c.drawImage(i, cx - ww / 2, cy - hh / 2, ww, hh);
    c.restore();
  }
  /** Slam-in scale: overshoots from big to 1 on t0. */
  private slam(t: number, t0: number, from = 1.6, dur = 0.22) {
    if (t < t0) return 0;
    return lerp(from, 1, ease.outExpo(clamp((t - t0) / dur)));
  }
  private rule(c: CanvasRenderingContext2D, x0: number, x1: number, y: number, k: number, col: string = HEX.signal, w = 3) {
    if (k <= 0) return;
    c.fillStyle = col; c.fillRect(x0, y - w / 2, (x1 - x0) * k, w);
  }

  /** Crop marks + running label + bar counter (all scenes). */
  private chrome(c: CanvasRenderingContext2D, f: Frame) {
    const m = 54, l = 34;
    c.strokeStyle = rgba('bone', 0.55); c.lineWidth = 2;
    for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]] as const) {
      c.beginPath(); c.moveTo(x + sx * l, y); c.lineTo(x, y); c.lineTo(x, y + sy * l); c.stroke();
    }
    this.text(c, 'GIẢI BÓNG ĐÁ RHINO BILLIARDS 2026', this.f.mono, 17, m + 6, m + 52, { align: 'left', track: 0.2, col: rgba('bone', 0.6) });
    this.text(c, 'VÒNG TRÒN · LƯỢT 1 · 23.10.2026', this.f.mono, 17, W - m - 6, m + 52, { align: 'right', track: 0.2, col: rgba('bone', 0.6) });
    // beat ticks bottom centre
    const bi = ((Math.floor(f.beat) % 4) + 4) % 4;
    for (let i = 0; i < 4; i++) { c.fillStyle = i === bi ? HEX.signal : rgba('bone', 0.25); c.fillRect(W / 2 - 54 + i * 30, H - m - 10, 18, 6); }
  }

  // ------------------------------------------------------------------ OPEN
  private open(c: CanvasRenderingContext2D, f: Frame): PostOverrides {
    const t = f.t;
    const words: [string, string, number][] = [
      ['GIẢI BÓNG ĐÁ', 'bone', 150], ['RHINO BILLIARDS', 'bone', 170], ['2026', 'signal', 330],
      ['LƯỢT 1', 'bone', 300], ['23.10', 'bone', 300], ['KẾT QUẢ', 'signal', 280],
    ];
    const n = words.length;
    const ts = words.map((_, i) => this.bt(i * 2));
    let k = -1; for (let i = 0; i < n; i++) if (t >= ts[i]! - 0.005) k = i;
    if (k < 0) { this.image(c, '/kq/rhino_logo_trang.png', W / 2, H / 2, 120, { a: prog(t, this.ctx.start, this.ctx.start + 0.3) }); return {}; }
    const [w, col, sz] = words[k]!;
    const s = this.slam(t, ts[k]!, 1.35);
    const last = k === n - 1;
    // ghost of the previous word, small and dim
    if (k > 0 && !last) this.text(c, words[k - 1]![0], this.f.thin, 60, W / 2, 330, { col: rgba('bone', 0.35), track: 0.3 });
    this.text(c, w, last ? this.f.huge : this.f.wide, sz, W / 2, H / 2 + sz * 0.36, { col: HEX[col as 'bone'], scale: s, maxW: W - 260, track: 0.01 });
    if (last) {
      const lt = t - ts[k]!;
      this.rule(c, W / 2 - 520, W / 2 + 520, H / 2 + 170, prog(lt, 0.1, 0.6, ease.outCubic));
      this.text(c, 'VÒNG TRÒN · LƯỢT 1 · 2 TRẬN', this.f.mono, 30, W / 2, H / 2 + 230, { track: 0.25, a: prog(lt, 0.2, 0.5), col: HEX.bone });
    } else {
      this.image(c, '/kq/rhino_logo_trang.png', W / 2, 220, 70, { a: 0.85 });
    }
    return { zoom: 1 + 0.015 * pulse(t, ts[k]!, 0.1) };
  }

  // ------------------------------------------------------------------ MATCH
  private match(c: CanvasRenderingContext2D, f: Frame): PostOverrides {
    const t = f.t, p = this.ctx.params;
    const A = p.a as Doi, B = p.b as Doi;
    const tIn = this.bt(0), tVs = this.bt(2), tScore = this.bt(6), tUp = this.bt(10), tEnd = this.ctx.end;
    const win = A.ban > B.ban ? 'a' : B.ban > A.ban ? 'b' : '';
    // header
    this.text(c, `TRẬN ${p.n}`, this.f.cond, 64, W / 2, 210, { col: HEX.signal, track: 0.12, a: prog(t, tIn, tIn + 0.15) });
    // layout morphs up when the scorers come in
    const up = prog(t, tUp, tUp + 0.45, ease.inOutCubic);
    const ly = lerp(520, 360, up), ls = lerp(330, 210, up);
    const xA = lerp(360, 430, up), xB = W - xA;
    for (const [d, x, side] of [[A, xA, -1], [B, xB, 1]] as const) {
      const k = prog(t, tIn + (side > 0 ? 0.12 : 0), tIn + 0.5 + (side > 0 ? 0.12 : 0), ease.outCubic);
      const won = win === (side < 0 ? 'a' : 'b');
      const lost = win && !won && t > tScore;
      this.image(c, LOGO(d.key), x + side * 300 * (1 - k), ly, ls, { a: k * (lost ? 0.55 : 1), glow: won && t > tScore ? rgba('signal', 0.55) : undefined });
      this.text(c, d.ten, this.f.head, lerp(54, 44, up), x + side * 300 * (1 - k), ly + ls / 2 + 72, { a: k * (lost ? 0.6 : 1), track: 0.06, maxW: 520 });
    }
    // VS, then the score
    if (t < tScore) {
      const s = this.slam(t, tVs, 1.5);
      if (s > 0) this.text(c, 'VS', this.f.it, 150, W / 2, ly + 52, { col: rgba('bone', 0.9), scale: s });
      // build-up: tick counter on the 4 beats before the score
      for (let i = 0; i < 4; i++) {
        const ti = this.bt(2 + i);
        if (t >= ti) { c.fillStyle = i === 3 ? HEX.signal : rgba('bone', 0.6); c.fillRect(W / 2 - 66 + i * 36, ly + 120, 24, 8); }
      }
    } else {
      const s = this.slam(t, tScore, 1.8, 0.28);
      const sz = lerp(260, 230, up);
      const colA = win === 'a' ? HEX.signal : HEX.bone, colB = win === 'b' ? HEX.signal : HEX.bone;
      const y = ly + sz * 0.36;
      this.text(c, String(A.ban), this.f.huge, sz, W / 2 - sz * 0.55, y, { col: colA, scale: s });
      this.text(c, String(B.ban), this.f.huge, sz, W / 2 + sz * 0.55, y, { col: colB, scale: s });
      if (s > 0) { c.fillStyle = rgba('bone', 0.75); const dw = sz * 0.16 * s; c.fillRect(W / 2 - dw / 2, ly - sz * 0.04, dw, sz * 0.045); }
      const lt = t - tScore;
      const tag = win ? `${(win === 'a' ? A : B).ten} THẮNG` : 'HÒA';
      this.text(c, tag, this.f.mono, 26, W / 2, ly + sz * 0.36 + 70, { track: 0.3, a: prog(lt, 0.25, 0.5), col: win ? HEX.signal : HEX.bone });
    }
    // scorers: cards in a row under each team, minute + name under each card
    if (t >= tUp) {
      for (const [d, x, side] of [[A, xA, -1], [B, xB, 1]] as const) {
        const gs = [...d.goals].sort((a, b) => a.m - b.m);
        const cw = 180, gap = 22, n = gs.length;
        const x0 = x - ((n - 1) * (cw + gap)) / 2;
        gs.forEach((g, i) => {
          const bb = this.bt(1) - this.bt(0);
          const tt = tUp + 0.35 + i * bb + (side > 0 ? bb * 0.5 : 0);
          const k = prog(t, tt, tt + 0.35, ease.outCubic);
          if (k <= 0) return;
          const cx = x0 + i * (cw + gap), cy = 740 + 40 * (1 - k);
          this.image(c, CARD(g.the, d.key), cx, cy, 250, { a: k });
          this.text(c, `${g.m}'`, this.f.cond, 46, cx, cy + 170, { col: HEX.signal, a: k });
          this.text(c, g.ten, this.f.body, 22, cx, cy + 203, { a: k, maxW: cw + 16 });
        });
        if (d.vang?.length) {
          const tv = this.bt(14);
          const k = prog(t, tv, tv + 0.3);
          if (k > 0) {
            const v = d.vang[0]!;
            const yy = 985;
            c.globalAlpha = k; c.fillStyle = '#F5C542'; c.fillRect(x - 170, yy - 30, 22, 30); c.globalAlpha = 1;
            this.text(c, `THẺ VÀNG ${v.m}' · ${v.ten}`, this.f.monoL, 21, x - 136, yy - 6, { align: 'left', a: k, track: 0.06, col: rgba('bone', 0.85) });
          }
        }
      }
    }
    // exit: fade the layer to black over the last 8th
    const out = prog(t, tEnd - 0.12, tEnd);
    return { zoom: 1 + 0.025 * pulse(t, tScore, 0.12), flash: 0.12 * pulse(t, tScore, 0.08), fade: out * 0.8 };
  }

  // ------------------------------------------------------------------ TABLE
  private table(c: CanvasRenderingContext2D, f: Frame): PostOverrides {
    const t = f.t;
    const rows: [string, string, number, number, number, number, string, number][] = [
      // key, name, trận, T, H, B, HS, điểm
      ['evo', 'EVO FC', 1, 1, 0, 0, '+1', 3],
      ['cuebots', 'CUEBOTS FC', 1, 0, 1, 0, '0', 1],
      ['timetip', 'TIME-TIP FC', 1, 0, 1, 0, '0', 1],
      ['rhino', 'RHINO FC', 1, 0, 0, 1, '−1', 0],
    ];
    const t0 = this.bt(0);
    this.text(c, 'BẢNG XẾP HẠNG', this.f.wide, 96, W / 2, 230, { scale: this.slam(t, t0, 1.3) || 0, track: 0.02 });
    this.text(c, 'SAU LƯỢT 1', this.f.mono, 26, W / 2, 280, { col: HEX.signal, track: 0.3, a: prog(t, t0 + 0.2, t0 + 0.4) });
    const cols = [[1080, 'TR'], [1200, 'T'], [1300, 'H'], [1400, 'B'], [1530, 'HS'], [1690, 'Đ']] as const;
    const yh = 360;
    for (const [x, s] of cols) this.text(c, s, this.f.mono, 22, x, yh, { col: rgba('bone', 0.5), track: 0.2, a: prog(t, t0 + 0.3, t0 + 0.6) });
    this.rule(c, 200, W - 200, yh + 20, prog(t, t0 + 0.3, t0 + 0.9, ease.outCubic), rgba('bone', 0.3), 2);
    rows.forEach((r, i) => {
      const ti = this.bt(4 + i * 2);
      const k = prog(t, ti, ti + 0.3, ease.outCubic);
      if (k <= 0) return;
      const y = 470 + i * 140, dx = 80 * (1 - k);
      c.save(); c.globalAlpha = k;
      if (i === 0) { c.fillStyle = rgba('signal', 0.14); c.fillRect(200, y - 62, W - 400, 124); c.fillStyle = HEX.signal; c.fillRect(200, y - 62, 8, 124); }
      this.text(c, String(i + 1), this.f.cond, 80, 270 + dx, y + 28, { col: i === 0 ? HEX.signal : HEX.bone });
      this.image(c, LOGO(r[0]), 400 + dx, y, 104);
      this.text(c, r[1], this.f.head, 52, 480 + dx, y + 19, { align: 'left', track: 0.04 });
      const vals = [r[2], r[3], r[4], r[5], r[6], r[7]];
      vals.forEach((v, j) => this.text(c, String(v), j === 5 ? this.f.cond : this.f.condB, j === 5 ? 76 : 50, cols[j]![0] + dx, y + (j === 5 ? 27 : 18), { col: j === 5 && i === 0 ? HEX.signal : HEX.bone }));
      c.restore();
    });
    return { zoom: 1 + 0.012 * pulse(t, this.bt(4), 0.1) };
  }

  // ------------------------------------------------------------------ OUTRO
  private outro(c: CanvasRenderingContext2D, f: Frame): PostOverrides {
    const t = f.t, t0 = this.bt(0), tLogo = this.bt(12);
    if (t < tLogo) {
      this.text(c, 'LƯỢT TIẾP THEO', this.f.mono, 30, W / 2, 230, { col: HEX.signal, track: 0.35, a: prog(t, t0, t0 + 0.2) });
      this.text(c, '29.10.2026', this.f.wide, 130, W / 2, 360, { scale: this.slam(t, t0, 1.3) || 0 });
      const fx: [string, string, string, string][] = [['rhino', 'RHINO FC', 'timetip', 'TIME-TIP FC'], ['evo', 'EVO FC', 'cuebots', 'CUEBOTS FC']];
      fx.forEach(([ka, na, kb, nb], i) => {
        const ti = this.bt(4 + i * 4);
        const k = prog(t, ti, ti + 0.35, ease.outCubic);
        if (k <= 0) return;
        const y = 560 + i * 230;
        c.save(); c.globalAlpha = k;
        c.fillStyle = rgba('ink2', 0.9); c.fillRect(300, y - 95, W - 600, 190);
        c.strokeStyle = rgba('bone', 0.18); c.lineWidth = 2; c.strokeRect(300, y - 95, W - 600, 190);
        this.image(c, LOGO(ka), 420 - 60 * (1 - k), y, 140);
        this.image(c, LOGO(kb), W - 420 + 60 * (1 - k), y, 140);
        this.text(c, na, this.f.head, 52, 530, y + 18, { align: 'left', track: 0.04 });
        this.text(c, nb, this.f.head, 52, W - 530, y + 18, { align: 'right', track: 0.04 });
        this.text(c, 'VS', this.f.it, 64, W / 2, y + 22, { col: HEX.signal });
        c.restore();
      });
    } else {
      const lt = t - tLogo;
      this.image(c, '/kq/rhino_logo_trang.png', W / 2, 430, 150, { a: prog(lt, 0, 0.4), scale: lerp(1.08, 1, prog(lt, 0, 1.5, ease.outCubic)) });
      this.text(c, 'GIẢI BÓNG ĐÁ RHINO BILLIARDS 2026', this.f.head, 54, W / 2, 610, { track: 0.08, a: prog(lt, 0.3, 0.7) });
      this.rule(c, W / 2 - 300, W / 2 + 300, 650, prog(lt, 0.5, 1.1, ease.outCubic));
      this.text(c, 'CÔNG TY TNHH CARBON BILLIARDS', this.f.mono, 24, W / 2, 712, { col: rgba('bone', 0.7), track: 0.25, a: prog(lt, 0.7, 1.1) });
      this.text(c, 'Nhạc: “Mega Hyper Ultrastorm” – Kevin MacLeod (incompetech.com) · CC BY 4.0', this.f.monoL, 18, W / 2, 940, { col: rgba('bone', 0.5), a: prog(lt, 1.0, 1.5) });
    }
    return { fade: prog(t, this.ctx.end - 1.2, this.ctx.end - 0.05) };
  }
}

const COMP = /* glsl */ `
uniform sampler2D tex; uniform vec3 bg, line, sig; uniform float t, beat, hot, grid;
void main() {
  vec2 px = vUv * vec2(1920.0, 1080.0);
  // faint pitch grid drifting slowly, with a soft signal glow low in the frame
  vec2 g = abs(fract((px + vec2(t * 12.0, 0.0)) / 120.0) - 0.5) * 120.0;
  float gl = (1.0 - smoothstep(0.0, 1.2, min(g.x, g.y))) * 0.10 * grid;
  float r = length((vUv - vec2(0.5, 0.42)) * vec2(1.6, 1.0));
  vec3 col = bg + line * gl * (1.0 - smoothstep(0.2, 0.9, r));
  col += sig * 0.035 * (1.0 - smoothstep(0.0, 0.7, length((vUv - vec2(0.5, -0.1)) * vec2(1.0, 1.6))));
  vec4 s = texture(tex, vUv);
  float h = smoothstep(0.25, 0.7, s.r - s.g * 1.3);
  col = mix(col, s.rgb * (1.0 + hot * h), s.a);
  fragColor = vec4(col, 1.0);
}`;
