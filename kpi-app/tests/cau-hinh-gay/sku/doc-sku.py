# -*- coding: utf-8 -*-
"""Đọc file SKU.xlsx (chủ dự án gửi 09/11) → sku.json cho tab Cấu hình gậy (mục 42).
   Chỉ sheet "Gậy …" (không vẽ Nối). Mỗi mã: [sheet, nhóm, SKU, mô tả, ghi chú, nút bịt ren, chuôi, ngọn, tip, cỡ file in] + số đọc từ mô tả.
   Chạy: python3 tests/cau-hinh-gay/sku/doc-sku.py <SKU.xlsx>"""
import sys, io, os, re, json, math, openpyxl
D = os.path.dirname(os.path.abspath(__file__))
wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
def s(x): return re.sub(r'\s+', ' ', str(x)).strip() if x is not None else ''
def so(x): return float(x.replace(',', '.'))
out = []
for ws in wb.worksheets:
    if not ws.title.strip().lower().startswith('gậy'): continue
    hdr = None; nhom = ''
    for r in ws.iter_rows(values_only=True):
        if not r: continue
        if r[0] == 'STT' or (len(r) > 2 and r[2] == 'SKU'): hdr = [s(x).upper() for x in r]; continue
        if hdr is None: continue
        if r[0] is not None and not isinstance(r[0], (int, float)) and all(v is None or s(v) == '' for v in r[1:]): nhom = s(r[0]); continue
        if not (isinstance(r[0], (int, float)) and r[1]): continue
        g = lambda k: s(r[hdr.index(k)]) if k in hdr and hdr.index(k) < len(r) else ''
        mt = g('MÔ TẢ'); gc = g('GHI CHÚ/LƯU Ý') or g('GHI CHÚ LƯU Ý') or g('GHI CHÚ  LƯU Ý')
        txt = (mt + ' ' + gc + ' ' + nhom)
        def tim_ren(t):   # ren ghi ở mô tả từng mã trước, tiêu đề nhóm sau
            low = t.lower()
            if 'uniloc' in low: return 'Uniloc'
            if 'radial' in low: return 'Radial'
            m = re.search(r'(3/8\s*-\s*8|3/8\s*-\s*10|3/8\s*-\s*11|3/8\s*-\s*14|5/16\s*-\s*18|5/16\s*-\s*14)', t)
            return m.group(1).replace(' ', '') if m else ''
        ren = tim_ren(mt + ' ' + gc) or tim_ren(nhom)
        kh = re.search(r'\((\d{3})\s*-\s*(\d{2,3})\)', mt + ' ' + gc)   # "(280-150)" = khúc trên - đuôi rời
        k1 = re.search(r'1 khúc[^()]*\((\d{3})\s*mm\)', mt + ' ' + gc)   # "(390mm)" = chuôi 1 khúc
        mm = [so(x) for x in re.findall(r'(\d{1,3}(?:[.,]\d+)?)\s*mm', txt)]
        tipD = next((v for v in mm if 10.5 <= v <= 14.5), None)
        chuoiDai = next((v for v in mm if 690 <= v <= 760), None)
        co = next((v for v in mm if 20.5 <= v <= 23), None)
        vach = re.search(r'vách\s*(\d(?:[.,]\d+)?)', txt, re.I); vach = so(vach.group(1)) if vach else None
        dChuoi = re.search(r'chuôi\s*(\d{2}(?:[.,]\d+)?)\s*(?:mm)?\s*vách', txt, re.I); dChuoi = so(dChuoi.group(1)) if dChuoi else None
        f = g('KÍCH THƯỚC FILE'); fm = re.match(r'\s*(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)', f.replace('X', 'x'))
        fw, fl = (so(fm.group(1)), so(fm.group(2))) if fm else (None, None)
        out.append({'sh': ws.title.strip(), 'nhom': nhom, 'sku': s(r[1]), 'mt': mt, 'gc': gc, 'nut': g('NÚT BỊT REN'), 'chuoi': g('CHUÔI'), 'ngon': g('NGỌN'),
                    'tip': g('TIP'), 'file': f, 'ren': ren, 'tipD': tipD, 'chuoiDai': chuoiDai, 'co': co, 'vach': vach, 'dChuoi': dChuoi,
                    'dFile': round(fw / math.pi, 2) if fw else None, 'dFileL': fl,
                    'khuc': [int(kh.group(1)), int(kh.group(2))] if kh else ([int(k1.group(1))] if k1 else None)})
io.open(os.path.join(D, 'sku.json'), 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
print(len(out), 'mã gậy →', os.path.join(D, 'sku.json'))
