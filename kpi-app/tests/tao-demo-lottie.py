# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-lottie.html (4 mẫu) và demo-lottie-2.html (6 mẫu đợt 2): nhúng lottie-web (bản light, MIT) + file kpi-app/lottie/*.json vào tests/demo-lottie*.src.html.
   LOTTIE=/đường/dẫn/lottie_light.min.js python3 kpi-app/tests/tao-demo-lottie.py
   (lấy lottie_light.min.js bằng: npm install lottie-web@5.12.2 → node_modules/lottie-web/build/player/)"""
import io, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
lib = os.environ.get('LOTTIE')
if not lib: sys.exit('Cần LOTTIE=<đường dẫn lottie_light.min.js>')
code = io.open(lib, encoding='utf-8').read().replace('</script', '<\\/script')
for nguon, ra, ds in [('demo-lottie.src.html', 'demo-lottie.html', ['dang-tong-hop-bao-cao', 'duyet-xong', 'da-duyet-het', 'mat-ket-noi']),
                      ('demo-lottie-2.src.html', 'demo-lottie-2.html', ['chot-thang', 'diem-danh-xong', 'gui-cho-duyet', 'xuat-excel', 'chua-co-du-lieu', 'het-phien'])]:
    src = io.open(os.path.join(D, nguon), encoding='utf-8').read()
    data = {}
    for ten in ds:
        data[ten] = json.load(io.open(os.path.join(D, '..', 'lottie', ten + '.json'), encoding='utf-8'))
    src = src.replace('/*LOTTIE_LIB*/', '/* lottie-web 5.12.2 (bản light) – MIT License, (c) 2015 Bodymovin – https://github.com/airbnb/lottie-web */\n' + code)
    src = src.replace('/*LOTTIE_DATA*/', json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
    io.open(os.path.join(D, '..', ra), 'w', encoding='utf-8').write(src)
    print('OK', ra, len(src.encode('utf-8')) // 1024, 'KB')
