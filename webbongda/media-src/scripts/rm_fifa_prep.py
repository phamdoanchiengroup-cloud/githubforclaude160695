# Chuẩn bị dữ liệu cho composition "Fifa" (thẻ lướt, dự bị xòe bài, sân 3D) cho trận vòng tròn số idx
import sys, json
sys.path.insert(0, '/tmp/claude-0/-home-user/f0d6a37d-9c1e-53d3-8cf4-9490d12819cc/scratchpad')
import match_rr as M
from PIL import Image
NAME = {'rhino': 'RHINO FC', 'evo': 'EVO FC', 'cuebots': 'CUEBOTS FC', 'timetip': 'TIME-TIP FC'}
COL = {'rhino': '#f0c86e', 'evo': '#ff6e5f', 'cuebots': '#d7dcf0', 'timetip': '#5acdff'}
SLOT = {'2-1-2-1': ['GK', 'LB', 'RB', 'CDM', 'LM', 'RM', 'ST'], '3-1-2': ['GK', 'LB', 'CB', 'RB', 'CM', 'LS', 'RS'],
        '3-2-1': ['GK', 'LB', 'CB', 'RB', 'LM', 'RM', 'ST'], '1-3-2': ['GK', 'CB', 'LM', 'CM', 'RM', 'LS', 'RS']}
P = 'rm/public/'
idx = int(sys.argv[1])
(d, gio, a, b), luot = M.matches()[idx]
data = {'title': f'VÒNG TRÒN · LƯỢT {luot}', 'date': f"{gio} · {M.THU[d.weekday()]} · {d.strftime('%d/%m/%Y')}", 'teams': []}
def the(mid, t):
    c = Image.open(f'cards/{mid}_{t}.png').convert('RGBA'); c.thumbnail((504, 700)); c.save(P + f'c_{mid}_{t}.png')
    p = next(m for m in M.META if m['MaCT'] == mid and m['team'] == t)
    return {'img': f'c_{mid}_{t}.png', 'name': p['HoTen'].strip(), 'rating': int(p['Rating'] or 0), 'so': str(p['SoAo']).strip()}
for t in (a, b):
    sodo, ids = M.LINEUP[t]
    lg = Image.open(f'drive/clean/logo_{t}.png').convert('RGBA'); lg = lg.crop(lg.getbbox()); lg.thumbnail((700, 700)); lg.save(P + f'logo_{t}.png')
    xi = [dict(the(mid, t), pos=SLOT[sodo][i]) for i, mid in enumerate(ids)]
    bench = sorted([the(m['MaCT'], t) for m in M.META if m['team'] == t and m['MaCT'] not in ids], key=lambda x: -x['rating'])
    data['teams'].append({'key': t, 'name': NAME[t], 'color': COL[t], 'sodo': sodo, 'xi': xi, 'bench': bench})
json.dump(data, open('rm/src/fifa.json', 'w'), ensure_ascii=False, indent=1)
N = {'rhino': 'RHINO', 'evo': 'EVO', 'cuebots': 'CUEBOTS', 'timetip': 'TIMETIP'}
print(f"Luot{luot}_{d.strftime('%d-%m')}_{N[a]}_vs_{N[b]}")
