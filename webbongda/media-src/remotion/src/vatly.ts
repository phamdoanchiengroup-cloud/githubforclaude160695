// Mô phỏng cú phá bi 2D (mặt bàn), tất định: chạy một lần khi nạp module.
export const BAN = {L: 2.24, W: 1.12, R: 0.042};   // kích thước lòng bàn (m), bán kính bi (phóng to cho dễ nhìn)
export const LO: [number, number][] = [[-1.12, -0.56], [0, -0.56], [1.12, -0.56], [-1.12, 0.56], [0, 0.56], [1.12, 0.56]];
export const MAU_TRONG = 240;
export const THAMSO = {v0: 13, lech: 0.01};   // chọn sẵn: bi số 3 rơi lỗ giữa phía gần máy quay ở ~0,68 s   // số mẫu mỗi giây mô phỏng
export const THOI_GIAN = 4.0;   // giây mô phỏng
export type Mau = {x: number; z: number; q: [number, number, number, number]; vao: boolean; ham: number};
export type KetQua = {bi: Mau[][]; batDau: [number, number][]};

const nhanQ = (a: number[], b: number[]): [number, number, number, number] => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];

export function moPhong(v0 = 9, lech = 0.004): KetQua {
  const {L, W, R} = BAN, d = 2 * R + 0.0005;
  // bi 0 = bi cái; giá bi tam giác 15 bi, đỉnh ở điểm chân bàn (x = +0.56); viên đỉnh (chỉ số 1) là "bi giảm giá", đi theo quỹ đạo riêng
  const ps: [number, number][] = [[-0.56, 0]];
  for (let hang = 0; hang < 5; hang++) for (let k = 0; k <= hang; k++) ps.push([0.56 + hang * d * Math.sqrt(3) / 2, (k - hang / 2) * d]);
  const n = ps.length;
  const x = ps.map((p) => p[0]), z = ps.map((p) => p[1]);
  const vx = new Array(n).fill(0), vz = new Array(n).fill(0);
  const vao = new Array(n).fill(false), ham = new Array(n).fill(0);
  const q: number[][] = ps.map(() => [0, 0, 0, 1]);
  vx[0] = v0; vz[0] = 0; z[0] = lech;
  const conSong = (i: number) => !vao[i];
  const out: Mau[][] = ps.map(() => []);
  const sub = 8, dt = 1 / (MAU_TRONG * sub);
  for (let s = 0; s <= THOI_GIAN * MAU_TRONG; s++) {
    for (let i = 0; i < n; i++) out[i].push({x: x[i], z: z[i], q: [...q[i]] as any, vao: vao[i], ham: ham[i]});
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < n; i++) {
        if (!conSong(i)) { if (vao[i]) ham[i] = Math.min(1, ham[i] + dt * 4); continue; }
        x[i] += vx[i] * dt; z[i] += vz[i] * dt;
        const sp = Math.hypot(vx[i], vz[i]);
        if (sp > 0) {   // ma sát lăn + xoay bi theo quãng đường
          const g = Math.max(0, sp - 0.55 * dt) / sp; vx[i] *= g; vz[i] *= g;
          const goc = sp * dt / R, ax = vz[i] / sp, az = -vx[i] / sp, h = Math.sin(goc / 2);
          q[i] = nhanQ([ax * h, 0, az * h, Math.cos(goc / 2)], q[i]);
        }
        for (const [px, pz] of LO) if (Math.hypot(x[i] - px, z[i] - pz) < 0.075) { vao[i] = true; x[i] = px; z[i] = pz; vx[i] = vz[i] = 0; }
        if (vao[i]) continue;
        if (x[i] > L / 2 - R) { x[i] = L / 2 - R; vx[i] = -Math.abs(vx[i]) * 0.78; }
        if (x[i] < -L / 2 + R) { x[i] = -L / 2 + R; vx[i] = Math.abs(vx[i]) * 0.78; }
        if (z[i] > W / 2 - R) { z[i] = W / 2 - R; vz[i] = -Math.abs(vz[i]) * 0.78; }
        if (z[i] < -W / 2 + R) { z[i] = -W / 2 + R; vz[i] = Math.abs(vz[i]) * 0.78; }
      }
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        if (!conSong(i) || !conSong(j)) continue;
        const dx = x[j] - x[i], dz = z[j] - z[i], kc = Math.hypot(dx, dz);
        if (kc >= 2 * R || kc === 0) continue;
        const nx = dx / kc, nz = dz / kc, chong = 2 * R - kc;
        x[i] -= nx * chong / 2; z[i] -= nz * chong / 2; x[j] += nx * chong / 2; z[j] += nz * chong / 2;
        const vr = (vx[i] - vx[j]) * nx + (vz[i] - vz[j]) * nz;
        if (vr <= 0) continue;
        const xung = vr * (1 + 0.94) / 2;
        vx[i] -= xung * nx; vz[i] -= xung * nz; vx[j] += xung * nx; vz[j] += xung * nz;
      }
    }
  }
  return {bi: out, batDau: ps};
}
export const VL = moPhong(THAMSO.v0, THAMSO.lech);
export const HERO = VL.bi.map((b, i) => [i, b.findIndex((m) => m.vao)]).filter(([i, k]) => i > 0 && k >= 0).sort((a, b) => a[1] - b[1])[0]?.[0] ?? 1;   // chọn sẵn: viên đỉnh (chỉ số 1) rơi vào lỗ giữa phía gần máy quay ở ~1,22 s
