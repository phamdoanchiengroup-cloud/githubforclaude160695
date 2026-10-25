import sys, json
sys.path.insert(0, '/tmp/claude-0/-home-user/f0d6a37d-9c1e-53d3-8cf4-9490d12819cc/scratchpad')
import match_rr as M, nhac3
from PIL import Image
U = '/root/.claude/uploads/f0d6a37d-9c1e-53d3-8cf4-9490d12819cc/'
IMG = {('rhino', 'evo'): '7190e419', ('cuebots', 'timetip'): 'af9e7fb6', ('rhino', 'timetip'): 'ccb3974f',
       ('evo', 'cuebots'): '660be7c1', ('rhino', 'cuebots'): '90aa95f3', ('evo', 'timetip'): '954b4cd0'}
NAME = {'rhino': 'RHINO FC', 'evo': 'EVO FC', 'cuebots': 'CUEBOTS FC', 'timetip': 'TIME-TIP FC'}
COL = {'rhino': '#f0c86e', 'evo': '#ff6e5f', 'cuebots': '#d7dcf0', 'timetip': '#5acdff'}
P = 'rm/public/'
idx = int(sys.argv[1])
(d, gio, a, b), luot = M.matches()[idx]
data = {'luot': luot, 'date': f"{gio} · {M.THU[d.weekday()]} · {d.strftime('%d/%m/%Y')}", 'teams': []}
for t in (a, b):
    sodo, ids = M.LINEUP[t]
    lg = Image.open(f'drive/clean/logo_{t}.png').convert('RGBA'); lg = lg.crop(lg.getbbox()); lg.thumbnail((700, 700)); lg.save(P + f'logo_{t}.png')
    fr = Image.open(f'drive/clean/frame_{t}.png').convert('RGBA').resize((1700, 2360)); l2 = lg.copy(); l2.thumbnail((1000, 1000))
    fr.alpha_composite(l2, ((1700 - l2.width) // 2, (2360 - l2.height) // 2)); fr.thumbnail((640, 640)); fr.save(P + f'back_{t}.png')
    pl = []
    for mid in ids:
        p = next(m for m in M.META if m['MaCT'] == mid and m['team'] == t)
        c = Image.open(f'cards/{mid}_{t}.png').convert('RGBA'); c.thumbnail((640, 640)); c.save(P + f'c_{mid}_{t}.png')
        pl.append({'img': f'c_{mid}_{t}.png', 'name': p['HoTen'].strip()})
    data['teams'].append({'key': t, 'name': NAME[t], 'color': COL[t], 'sodo': sodo, 'players': pl})
key = IMG.get((a, b)) or IMG[(b, a)]
Image.open(U + key + '-image.png').convert('RGB').save(P + 'lineup.jpg', quality=92)
json.dump(data, open('rm/src/data.json', 'w'), ensure_ascii=False, indent=1)
nhac3.tao('rm/public/nhac.wav', 31.0, 1.6, 26.6, [(0, 0.9), (1.6, 0.7), (3.0, 0.6), (9.0, 0.6), (15.0, 0.7), (23.6, 1.0)],
          [3.0 + 0.6 + i * 0.3 for i in range(7)] + [9.0 + 0.6 + i * 0.3 for i in range(7)] + [16.7, 19.5, 22.3], seed=300 + idx)
N = {'rhino': 'RHINO', 'evo': 'EVO', 'cuebots': 'CUEBOTS', 'timetip': 'TIMETIP'}
print(f"Luot{luot}_{d.strftime('%d-%m')}_{N[a]}_vs_{N[b]}")
