# TCC Thái Ất Thần Kinh

Liên quan: [[TCC Kỳ Môn Độn Giáp]] · [[Quyết định của chủ dự án]] · [[TCC Kiểm thử]] · [[00 Mục lục]]

## Nghiên cứu (21/11)
- Đề xuất: `nghien-cuu/thai-at/00-de-xuat.md`. Nguồn: kintaiyi (kentang2017, MIT) – đọc thuật toán; Thái Ất Kim Kính Thức Kinh (Wikisource, công cộng); tianyugong.com/taiyi. Sách tiếng Việt còn bản quyền – chưa đọc.
- Phái Thống Tông: tích niên = 10.153.917 + năm dương lịch. Cục năm: 2024 dương 53, 2025 dương 54, 2026 dương 55, 2027 dương 56.
- Tự dựng lại bảng 72 cục của kintaiyi: Thủy Kích khớp 70/72, Chủ/Khách/Định toán 421/432 (chỗ lệch nghi lỗi gõ bảng kintaiyi) → lập trình theo quy tắc, không chép bảng.
- Không có trang nào công bố sẵn bàn 2024–2027 → đối chiếu chủ yếu với kintaiyi.

## Quyết định chủ dự án (21/11)
- 4 phạm vi; mục riêng cho mệnh pháp + hỏi việc theo giờ; vận năm cá nhân ghép vào trang Năm 2027; thời cuộc chung miễn phí.
- Combo hỏi việc 2 môn (Kỳ Môn + Thái Ất) 19 xu; mỗi môn lẻ 9 xu.
- Các điểm chưa chắc theo đề xuất (ranh năm Lập xuân, đại tướng theo Kim Kính, cung kề thật, mệnh pháp dùng bàn Thời kế giờ sinh). Dương cửu / Bách lục để đợt sau.

## Đang làm
- `ThaiAt.gs` (`taLap_`, `taMenh_`, `taNamCaNhan_`, `taDanhGia_`) + `tests/thai-at.js`, `tests/doi-chieu-thai-at.js` (ca sinh từ kintaiyi trong venv máy kiểm thử).
- Sau đó: văn luận `ThaiAtVan.gs` (content-creator), giao diện, phần bán, rà mã.
