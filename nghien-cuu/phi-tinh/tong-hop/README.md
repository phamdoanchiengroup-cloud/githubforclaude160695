# Kho luận giải Tứ Hóa Phi Tinh (Bắc phái) – catalog.json

Tổng hợp từ 4 bài luận mẫu của tuvi.cohoc.net (A, B, D là lá số thật; C chỉ dùng như quy tắc chung). Toàn bộ văn viết lại bằng lời mới, bỏ ý trùng, giữ các ý khác trường phái thành mục riêng có `nguon`. Không chứa ngày giờ sinh hay tên người.

## Cấu trúc file

```
{
  "gioiThieu": "...",
  "mucLuc": [ {"phan": "Tổng quan" | "Cung Mệnh" | "Cung Thân" | ... | "Đại vận" | "Vận năm" | "Vận tháng" | "Phụ lục",
               "muc": [ {"ten": "...", "noiDung": "gồm những khóa nào"} ] } ],
  "dinhNghia": { "<khái niệm>": "cách xác định + mức chắc chắn" },
  "luan": { "<khóa>": [ {"nguon": "...", "ky": "...", "de": "...", "muc": "cat|hung|trung"} ] }
}
```

- `ky`: tầng chuyên môn, được dùng thuật ngữ và % theo cách cohoc chấm.
- `de`: tầng dễ hiểu, câu 1 "Bạn có xu hướng…/Bạn thuộc mẫu người…", câu 2 nhẹ nhàng có hướng khắc phục; không tên sao, tên cung, Hóa/Lộc/Quyền/Khoa/Kỵ, không %, không đoán chết/bệnh/tai nạn/ly hôn/số con.
- Một khóa có thể có nhiều ý (mỗi trường phái một ý). App lấy tất cả ý của khóa khớp lá số rồi chọn/ghép.

## Quy ước khóa

Tên cung chuẩn: Mệnh, Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách, Thiên Di, Nô Bộc, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu. Hóa: Lộc, Quyền, Khoa, Kỵ. Dấu `*` = áp dụng cho mọi cung (app tự ghép chủ đề cung).

| Khóa | Ý nghĩa |
|---|---|
| `xiHoa|duong` / `xiHoa|am` | Điểm xí hoa tổng dương/âm |
| `laiNhan|<Cung>` | Lai nhân cung |
| `mau|<tên mẫu>` | Mẫu Lộc/Kỵ: Thuận thủy Kỵ, Nghịch thủy Kỵ, Tiết xuất Kỵ, Lưu xuất Kỵ, Tứ mã Kỵ, Nhập khố Kỵ, Tứ chính Kỵ, Củ triền Kỵ, Thị phi Kỵ, Điệp xuất Lộc, Tiết xuất Lộc, Đối trì Lộc, Lộc Lộc trao đổi, Song Lộc, Hư lộc, Dương phi nhập Âm, Lộc gặp Kỵ, Song Kỵ, Tuyệt mệnh Kỵ, Phá thể, Tự hóa li tâm |
| `than|<Cung>` | Cung Thân đồng cung với |
| `cungKhi|*|<daiCat/danXen/daiHung>` | Cung khí chung |
| `cungKhiLuan|<Cung>` | Cách Sở Hoàng dùng cung khí cho từng cung |
| `canTDN|<thuong/trung/ha>` | Đẳng của can cung (Thiên–Địa–Nhân, Ông Phúc Dụ) |
| `canCung|<Cung>|<Can>` | Ý nghĩa can cung (chỉ các can có trong nguồn) |
| `snToa|<Hóa>|<Cung>` | Tứ Hóa năm sinh tọa cung |
| `tuHoa|<Cung>|<Hóa>` | Cung tự hóa |
| `phi|<CungA>|<Hóa>|<CungB>` | Can cung A phi Hóa nhập cung B |
| `mchat|<Cung>|chat` / `mchat|<Cung>|<Cung đích>` | M chất / M <cung> (Trịnh Mục Đức) |
| `sao|<Sao>|<Cung>`, `cach|<tên cách>` | Sao, cách cục |
| `dv|nhap|<Hóa>|<Cung nguyên cục>` | Hóa của ĐV Mệnh nhập cung nguyên cục (Quyền, Khoa dùng `*`) |
| `dv|chieu|<Hóa>|<Cung hoặc *>` | Lộc/Quyền/Khoa chiếu giữa ĐV và nguyên cục |
| `dv|kyXungNc|<Cung hoặc *>` | Kỵ Dụng xung Thể (80%) |
| `dv|ncXungDv|*`, `dv|ncNhapDv|<Lộc/Kỵ>|*` | Thể xung/nhập Dụng |
| `dv|quyVi|<Hóa>|*` | Quy vị |
| `dv|kyNhapMenh|*`, `dv|kyXungMenh|*`, `dv|catNhapMenh|*` | ĐV.X phi Kỵ nhập (50%)/xung (70%) Mệnh gốc; Hóa cát nhập Mệnh gốc |
| `dv|hoiQuy|<Mệnh/Tài Bạch/Quan Lộc>`, `dv|phanCung|<Lộc/Kỵ>` | Hồi quy, Phản cung |
| `dv|thaNga|<mẫu>` | Cặp Lộc–Kỵ vào tha/ngã cung |
| `dv|cap|<Lộc_cung>|<Kỵ_cung>` | Cặp Lộc–Kỵ đặc biệt (Tử vi mệnh vận) |
| `dv|trung|<Hóa năm sinh>|<Hóa ĐV>` | Trùng điệp năm sinh – đại vận |
| `dv|mchat|<Hóa>`, `dv|mchatTrung|<2tang/3tang>` | M chất đại vận; M chất 2–3 tầng (70%/90%) |
| `dv|phiPhuc|<Lộc/Kỵ>` | Kinh nghiệm Bắc phái: phi phục tam điểm |
| `tuyen|<HuynhNo/PhuTat>|<cat/ky>` | Khai quán nhân: thành tựu / quang minh |
| `dv|tongLuan|<Cung>|<cat/binh/hung>` | Tổng luận chủ đề 10 năm |
| `nam|nhap|<Lộc/Kỵ>|*` | Lộc/Kỵ năm vào cung của đại vận |
| `ln|<Dụng→Thể/Thể→Dụng>|<nhap/chieu/xung>|<Hóa>|<Cung hoặc *>` | Dòng Thể–Dụng ở năm (LN↔ĐV) và tháng (NV↔LN); dấu * ** *** **** xem dinhNghia |
| `thang|xuat|<Hóa>`, `thang|tangTac|<mẫu>` | Tứ hóa nhập xuất, tương tác các tầng ở tháng |
| `ungKy|tamDiem`, `ungKy|taiThienDiaNhan` | Ứng kỳ |
| `thang|ketLuan|<Cung>|<cat/binh/hung>` | Kết luận chủ đề tháng (vận năm dùng chung, đổi chữ "tháng" thành "năm") |

Ghi chú: trong `mucLuc` một số dòng viết dạng tổng quát (`cungKhi|<Cung>|…`); bản hiện tại chỉ có `cungKhi|*|…` – app nên tra khóa cụ thể trước rồi lùi về `*`.

## Ánh xạ mức tổng luận cohoc → khóa

- `cat`: rất tốt, khá tốt, tốt nhiều – xấu không đáng lo.
- `binh`: tốt bình thường, đan xen mức không lớn, biên độ khá/rất lớn.
- `hung`: xấu bình thường, khá xấu, mặt xấu đáng lo / rất đáng lo.

## Khái niệm chưa xác định chắc (xem dinhNghia)

Công thức điểm xí hoa; can Quý trong Thiên–Địa–Nhân; cách chọn "cung khí số vị"; Tài thiên/địa/nhân; vì sao chỉ một số cung bản mệnh được nêu "có M chất" trong từng đại vận; tập cung đích của phi phục; định nghĩa gốc Thuận/Nghịch thủy Kỵ; điều kiện chính xác Tuyệt mệnh Kỵ, Phá thể, Dương phi nhập Âm.
