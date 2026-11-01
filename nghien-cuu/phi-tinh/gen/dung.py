import json, re, sys, os
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
Q = json.load(open(D + '/quy-tac.json'))
CUNG = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu']
CHUAN = {c.lower(): c for c in CUNG}
def cc(s): return CHUAN.get(s.strip().lower())
CJK = re.compile(r'[　-鿿＀-￯（）：、，]+')
def boHan(s): return re.sub(r'\s{2,}', ' ', re.sub(r'\(\s*\)', '', CJK.sub('', s))).strip(' –-:')
# Tứ Hóa Phi Tinh
CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
B = Q['tuHoa']['bangDung']; TH = [B[c] for c in CAN]
# Luận mẫu phi hóa của từng cung (một phi hóa đơn: "X phi Lộc/Kỵ nhập Y")
LUAN, bo = {}, []
for k, ds in Q['luanCung']['cung'].items():
    X = cc(k)
    for m in ds:
        g = re.match(r'^(.+?) phi (Lộc|Quyền|Khoa|Kỵ) nhập (.+?)(?: \(.*\))?$', m['mau'])
        if not g or ',' in m['mau'] or cc(g.group(1)) != X or not cc(g.group(3)): bo.append(m['mau']); continue
        LUAN.setdefault(X, {})[g.group(2) + '|' + cc(g.group(3))] = {'luan': m['luan'], 'de': m['deHieu']}
print('mẫu dùng:', sum(len(v) for v in LUAN.values()), 'bỏ (mẫu ghép, đã có ở mục mẫu Kỵ):', len(bo), file=sys.stderr)
NG = []
for k, v in Q['nguon'].items():
    t = boHan(v['ten'])
    if 'huyenco' in t.lower(): continue
    NG.append({'ten': t, 'url': v.get('url', '')})
VAN = json.load(open(D + '/van.json')) if os.path.exists(D + '/van.json') else {}
vo = open(D + '/gen/vo.js').read()
j = lambda x: json.dumps(x, ensure_ascii=False, indent=1)
open(OUT, 'w').write('''/**
 * TuViPhiTinh.gs – Tử Vi theo Tứ Hóa Phi Tinh (Bắc phái / Khâm Thiên môn) – tab riêng "Phi Tinh" (31/10/2026).
 * Can 12 cung theo Ngũ Hổ Độn (sẵn trong lá số), mỗi cung phi Lộc – Quyền – Khoa – Kỵ theo bảng Tứ Hóa của trường Phi Tinh
 * (khác phái Việt ở can Nhâm: Khoa là Tả Phù). Luận: Tứ Hóa năm sinh, Lai Nhân cung, tự hóa ly tâm / hướng tâm, phi hóa 12 cung
 * kèm tên chuyển cung, chuỗi Kỵ chuyển Kỵ, các mẫu Kỵ có tên, đại vận và lưu niên đọc chồng lên nguyên cục.
 * Quy tắc do chuyên gia nghiên cứu tra từ Lương Nhược Du, Trương Thế Hiền, Hứa Thuyên Nhân, các trang Phi Tinh Việt – Trung – Đài
 * (mỗi kỹ thuật ≥2 nguồn); đã đối chiếu can cung, Lai Nhân, 48 phi hóa, đại vận, lưu niên với một bài luận Bắc phái mẫu: khớp toàn bộ.
 * Văn hai tầng do chuyên gia content-creator viết. "Tuyệt mệnh Kỵ" không hiển thị (quy tắc không đoán chết, bệnh).
 */
var PT_TU_HOA = %s;

/** Luận riêng cho từng phi hóa đơn "cung X phi Lộc/Kỵ nhập cung Y" (khóa "Lộc|Tài Bạch") */
var PT_LUAN = %s;

/** Văn hai tầng: snToa, laiNhan, tuHoa, phi (khuôn chung), mau (mẫu có tên), dvLoc, dvKy, dvKyXung, gioiThieu */
var PT_VAN = %s;

var PT_NGUON = %s;
%s''' % (j(TH), j(LUAN), j(VAN), j(NG), vo))
