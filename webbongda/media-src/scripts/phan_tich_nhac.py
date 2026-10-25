# Phân tích nhạc → data/audio.json theo định dạng engine pdoom (beats, downbeats, envelopes 100 fps, onsets)
import sys, json, numpy as np, subprocess
src, dst = sys.argv[1], sys.argv[2]
SR = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
dur = len(x) / SR
hop = SR // 100; n = 2048
fr = np.lib.stride_tricks.sliding_window_view(np.pad(x, (n // 2, n)), n)[::hop][: int(dur * 100)]
spec = np.abs(np.fft.rfft(fr * np.hanning(n), axis=1)); f = np.fft.rfftfreq(n, 1 / SR)
band = lambda a, b: np.sqrt((spec[:, (f >= a) & (f < b)] ** 2).mean(1))
low, mid, high = band(30, 160), band(160, 2500), band(2500, 10000)
rms = np.sqrt((fr ** 2).mean(1))
nrm = lambda v: np.clip(v / (np.percentile(v, 99) + 1e-9), 0, 1)
# onset strength & tempo grid
def flux(v):
    d = np.diff(np.log1p(v * 100), prepend=0); return np.maximum(d, 0)
o = flux(low) * 1.5 + flux(mid) + flux(high) * 0.5
best = None
for bpm in np.arange(138, 150, 0.01):
    per = 6000 / bpm
    for ph in np.arange(0, per, 1):
        idx = (ph + per * np.arange(int((len(o) - ph) / per))).astype(int)
        sc = o[idx].sum()
        if best is None or sc > best[0]: best = (sc, bpm, ph)
_, bpm, ph = best; per = 60 / bpm
beats = [round(ph / 100 + i * per, 3) for i in range(int((dur - ph / 100) / per) + 1)]
# downbeat phase: the beat offset (0..3) with the most low-band energy
lw = [sum(low[min(len(low) - 1, int(b * 100))] for b in beats[k::4]) for k in range(4)]
k0 = int(np.argmax(lw)); downbeats = beats[k0::4]
def peaks(v, thr):
    fl = flux(v); fl = np.clip(fl / (np.percentile(fl, 97) + 1e-9), 0, 1.5); out = []
    for i in range(1, len(fl) - 1):
        if fl[i] > thr and fl[i] >= fl[i - 1] and fl[i] >= fl[i + 1] and (not out or i / 100 - out[-1][0] > 0.09):
            out.append([round(i / 100, 3), round(float(fl[i]), 3)])
    return out
L, M, Hh = nrm(low), nrm(mid), nrm(high)
r3 = lambda v: [round(float(a), 3) for a in v]
J = dict(duration=round(dur, 3), bpm=round(float(bpm), 3), beat_period=round(per, 5), time_signature=4, beats=beats, downbeats=downbeats,
         sections=[dict(name='all', start=0.0, end=round(dur, 3))], fps=100,
         rms=r3(nrm(rms)), low=r3(L), mid=r3(M), high=r3(Hh), vocal=r3(M * 0.6), drums=r3(np.maximum(L, Hh)), bass=r3(L), other=r3(M),
         onsets=dict(kick=peaks(low, 0.25), snare=peaks(mid, 0.3), hat=peaks(high, 0.35), vocal=[]),
         notes='Phân tích tự động từ "Mega Hyper Ultrastorm" (Kevin MacLeod, CC BY 4.0) cho video kết quả vòng 1.')
json.dump(J, open(dst, 'w'))
print('bpm', round(bpm, 3), 'pha', ph / 100, 'downbeat đầu', downbeats[:3], 'số phách', len(beats), 'dài', round(dur, 2))
