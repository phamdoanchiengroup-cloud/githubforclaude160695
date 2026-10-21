#!/usr/bin/env python3
"""Dựng bo-nao/ban-do.html từ các ghi chú .md trong bo-nao/ (và CLAUDE.md).

Chạy: python3 bo-nao/tao-ban-do.py
Mỗi ghi chú: tên file = tiêu đề, thư mục con = nhóm (file ở gốc bo-nao/ thuộc nhóm "Bắt đầu"),
liên kết = [[Tên ghi chú]]. Liên kết tới ghi chú không tồn tại được liệt kê để sửa.
"""
import json, os, re, sys, datetime

GOC = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(GOC)
NHOM_GOC = 'Bắt đầu'

ghi = []
for thu_muc, _, files in os.walk(GOC):
    rel = os.path.relpath(thu_muc, GOC)
    if any(p.startswith(('.', '_')) for p in rel.split(os.sep) if p != '.'):
        continue
    for f in sorted(files):
        if not f.endswith('.md'):
            continue
        ten = f[:-3]
        nhom = NHOM_GOC if rel == '.' else rel.split(os.sep)[0]
        txt = open(os.path.join(thu_muc, f), encoding='utf-8').read()
        ghi.append({'id': ten, 'nhom': nhom, 'txt': txt,
                    'duong': 'bo-nao/' + ('' if rel == '.' else rel.replace(os.sep, '/') + '/') + f})

claude = os.path.join(REPO, 'CLAUDE.md')
if os.path.exists(claude):
    ghi.append({'id': 'CLAUDE.md', 'nhom': NHOM_GOC, 'duong': 'CLAUDE.md',
                'txt': open(claude, encoding='utf-8').read()})

ids = {g['id'] for g in ghi}
gay = []
for g in ghi:
    lk = []
    # Bỏ khối mã và `mã` trước khi tìm liên kết (vd. `[[src, type]]` là mã, không phải liên kết)
    sach = re.sub(r'```.*?```', '', g['txt'], flags=re.S)
    sach = re.sub(r'`[^`\n]*`', '', sach)
    for m in re.findall(r'\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]', sach):
        m = m.strip()
        if m in ids and m != g['id'] and m not in lk:
            lk.append(m)
        elif m not in ids:
            gay.append((g['id'], m))
    g['lk'] = lk

if gay:
    print('Liên kết hỏng:', file=sys.stderr)
    for a, b in gay:
        print('  %s -> [[%s]]' % (a, b), file=sys.stderr)
    sys.exit(1)

du_lieu = {'ngay': datetime.date.today().strftime('%d/%m/%Y'), 'ghi': ghi}
js = json.dumps(du_lieu, ensure_ascii=False).replace('</', '<\\/')
mau = open(os.path.join(GOC, 'ban-do.mau.html'), encoding='utf-8').read()
assert '/*DU_LIEU*/null' in mau
ra = mau.replace('/*DU_LIEU*/null', js)
open(os.path.join(GOC, 'ban-do.html'), 'w', encoding='utf-8').write(ra)
n_lk = sum(len(g['lk']) for g in ghi)
print('ban-do.html: %d ghi chú, %d liên kết, %d KB' % (len(ghi), n_lk, len(ra.encode()) // 1024))
