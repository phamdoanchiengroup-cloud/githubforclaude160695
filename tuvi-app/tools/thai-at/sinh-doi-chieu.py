# -*- coding: utf-8 -*-
"""
Sinh ca đối chiếu Thái Ất từ thư viện kintaiyi 0.2.3 (MIT – kentang2017, https://github.com/kentang2017/kintaiyi).
CHỈ chạy trên máy kiểm thử, trong virtualenv riêng (không đưa kintaiyi vào Apps Script, không commit thư viện):
    python3 -m venv /tmp/claude-0/ta-venv
    /tmp/claude-0/ta-venv/bin/pip install kintaiyi==0.2.3 ephem numpy cn2an sxtwl
    cd /tmp && /tmp/claude-0/ta-venv/bin/python -I <repo>/tuvi-app/tools/thai-at/sinh-doi-chieu.py
Ra: tuvi-app/tests/du-lieu/thai-at-doi-chieu.json (chỉ dữ liệu kết quả).
Mã vị trí: 0–15 = vòng 16 ô Tý, Sửu, Cấn, Dần, Mão, Thìn, Tốn, Tỵ, Ngọ, Mùi, Khôn, Thân, Dậu, Tuất, Càn, Hợi; 16 = Trung (giữa).
Số cung (Thái Ất, tướng, Đại Du, Tiểu Du): 1 Càn, 2 Ly, 3 Cấn, 4 Chấn, 5 Trung, 6 Đoài, 7 Khôn, 8 Khảm, 9 Tốn.
"""
import os, sys, json, random, importlib.util

spec = importlib.util.find_spec('kintaiyi')
if spec is None:
    sys.exit('Chưa cài kintaiyi trong môi trường này (xem đầu file).')
sys.path.insert(0, list(spec.submodule_search_locations)[0])   # kintaiyi 0.2.3 dùng "import config" kiểu tuyệt đối
import config, kintaiyi as K                                    # noqa: E402
import sxtwl                                                    # noqa: E402

G = "子丑艮寅卯辰巽巳午未坤申酉戌乾亥"
QUAI = {"乾": 14, "離": 8, "艮": 2, "震": 4, "兌": 12, "坤": 10, "坎": 0, "巽": 6, "中": 16}
Z = "子丑寅卯辰巳午未申酉戌亥"


def o(x):
    """Ký hiệu kintaiyi → mã vị trí 0–16"""
    if x is None:
        return None
    if isinstance(x, (int,)) or hasattr(x, 'item'):
        return {1: 14, 2: 8, 3: 2, 4: 4, 5: 16, 6: 12, 7: 10, 8: 0, 9: 6}[int(x)]   # wufu trả số 5 khi rơi giữa
    if x in QUAI:
        return QUAI[x]
    return G.index(x)


def n(x):
    return None if x is None else int(x)


KE = {'nam': 0, 'thang': 1, 'gio': 3}


def ca(ke, y, m, d, h, nhom=''):
    t = K.Taiyi(y, m, d, h, 0)
    j = KE[ke]
    kook = t.kook(j, 0)
    am = config.lunar_date_d(y, m, d)
    r = {
        'ke': ke, 't': [y, m, d, h], 'nhom': nhom,
        'am': [am['年'], am['月']],
        'T': n(t.accnum(j, 0)), 'cuc': n(kook['數']), 'don': 'd' if kook['文'][0] == '陽' else 'a',
        'ty': n(t.ty(j, 0)), 'vx': o(t.skyeyes(j, 0)), 'tk': o(t.sf(j, 0)),
        'ke_': o(t.jigod(j)), 'hop': o(t.hegod(j)), 'tue': o(t.taishui(j)), 'dm': o(t.se(j, 0)),
        'cc': n(t.home_cal(j, 0)), 'kc': n(t.away_cal(j, 0)), 'dc': n(t.set_cal(j, 0)),
        'cd': n(t.home_general(j, 0)), 'ct': n(t.home_vgen(j, 0)),
        'kd': n(t.away_general(j, 0)), 'kt': n(t.away_vgen(j, 0)),
        'dd': n(t.set_general(j, 0)), 'dt': n(t.set_vgen(j, 0)),
        'quan': o(t.kingbase(j, 0)), 'than': o(t.officerbase(j, 0)), 'dan': o(t.pplbase(j, 0)),
        'tu': o(t.fgd(j, 0)), 'tat': o(t.skyyi(j, 0)), 'dat': o(t.earthyi(j, 0)), 'tp': o(t.zhifu(j, 0)),
        'np': o(config.wufu(t.accnum(j, 0))), 'ddu': n(config.bigyo(t.accnum(j, 0))), 'tdu': n(config.smyo(t.accnum(j, 0))),
    }
    return r


def khop_thang(y, m, d):
    """Ngày mà tháng âm = tháng tiết và năm âm = năm Lập xuân (hai ranh trùng nhau)"""
    x = sxtwl.fromSolar(y, m, d)
    if x.isLunarLeap():
        return False
    lm, ly = x.getLunarMonth(), x.getLunarYear()
    return (lm + 1) % 12 == x.getMonthGZ().dz and (ly + 8) % 12 == x.getYearGZ().dz


def main():
    rnd = random.Random(20261121)
    out = []
    # 1. Tuế kế 1900–2100 (ngày 1/7: sau cả Tết và Lập xuân)
    for y in range(1900, 2101):
        out.append(ca('nam', y, 7, 1, 12, 'chinh'))
    # 1b. Tuế kế giữa Tết và Lập xuân (khác biệt ranh năm đã biết)
    for y in range(2000, 2041):
        for dd in range(1, 32):
            x = sxtwl.fromSolar(y, 1, dd) if dd <= 31 else None
            if x and x.getLunarMonth() == 1 and not x.isLunarLeap() and x.getLunarDay() <= 3:
                out.append(ca('nam', y, 1, dd, 12, 'ranh_nam'))
                break
    # 2. Nguyệt kế: 2000–2035, mỗi tháng dương một ngày mà hai ranh tháng trùng nhau
    for y in range(2000, 2036):
        for m in range(1, 13):
            for dd in (15, 20, 10, 25, 5, 28):
                if khop_thang(y, m, dd):
                    out.append(ca('thang', y, m, dd, 12, 'chinh'))
                    break
    # 2b. Nguyệt kế lệch ranh tháng âm / tháng tiết (khác biệt đã biết)
    dem = 0
    for y in range(2010, 2030):
        for m in range(1, 13):
            if dem >= 40:
                break
            dd = rnd.randint(1, 28)
            if not khop_thang(y, m, dd):
                out.append(ca('thang', y, m, dd, 12, 'ranh_thang'))
                dem += 1
    # 3. Thời kế: 300 giờ ngẫu nhiên 1950–2050 (giờ 0–22: kintaiyi cộng nhầm 23 ngày khi giờ 23)
    for _ in range(300):
        y, m, dd, h = rnd.randint(1950, 2050), rnd.randint(1, 12), rnd.randint(1, 28), rnd.randint(0, 22)
        out.append(ca('gio', y, m, dd, h, 'chinh'))
    # 3b. Thời kế 6 ngày liền (đủ 72 cục) quanh 2/1/2025 (dương) và 2/8/2025 (âm)
    for (y, m, d0) in ((2025, 1, 2), (2025, 8, 2)):
        for i in range(6):
            for h in range(0, 23, 2):
                out.append(ca('gio', y, m, d0 + i, h, 'chuoi'))
    # 3c. Thời kế sát Đông chí / Hạ chí
    for y in (2001, 2008, 2015, 2024, 2031):
        for (m, d) in ((6, 20), (6, 21), (6, 22), (12, 21), (12, 22)):
            for h in (1, 7, 13, 19):
                out.append(ca('gio', y, m, d, h, 'ranh_chi'))
    meta = {
        'nguon': 'kintaiyi 0.2.3 (MIT) – kentang2017, https://github.com/kentang2017/kintaiyi',
        'phep': 'Thái Ất Thống Tông (taiyi_acumyear = 0); giờ nhập là giờ đồng hồ, kintaiyi không xét múi giờ',
        'ma_vi_tri': 'o: 0–15 vòng 16 ô (Tý, Sửu, Cấn, Dần, Mão, Thìn, Tốn, Tỵ, Ngọ, Mùi, Khôn, Thân, Dậu, Tuất, Càn, Hợi), 16 = Trung',
        'so_ca': len(out)
    }
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tests', 'du-lieu', 'thai-at-doi-chieu.json')
    with open(p, 'w', encoding='utf-8') as f:
        f.write('{"meta":' + json.dumps(meta, ensure_ascii=False) + ',\n"ca":[\n')
        f.write(',\n'.join(json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in out))
        f.write('\n]}\n')
    print('Đã ghi', len(out), 'ca vào', os.path.normpath(p))


if __name__ == '__main__':
    main()
