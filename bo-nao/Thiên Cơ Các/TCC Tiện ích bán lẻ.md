# TCC Tiện ích bán lẻ

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Bán hàng]] · [[TCC Báo cáo ngày]] · [[00 Mục lục]]

- **Tiện ích bán lẻ (TienIch.gs + Script.html › `veTienIch`, `tiChay`, `tiKqHtml`; tab `ti` "✦ Tiện Ích"):** 7 công cụ, mỗi công cụ có phần hé lộ miễn phí + phần trả phí, luôn kèm mục "Cơ sở" và câu "chỉ để tham khảo" (`TI_THAM_KHAO`). API `tienIch(input, loai, thamSo, token)`:
  - `xem_tuoi` (9 xu): Kim Lâu, Hoang Ốc, Tam Tai theo tuổi mụ; miễn phí năm nay, trả phí bảng 10 năm + hóa giải.
  - `phong_thuy` (19 xu): cung phi Bát trạch (`tiCungPhi_`), miễn phí hướng Sinh Khí, trả phí 8 hướng + bố trí.
  - `chon_ngay` (9 xu/việc/tháng, mã `ngay:<việc>:<yyyy-mm>`): chấm điểm ngày (hoàng đạo, trực, tú, Tam Nương, Nguyệt Kỵ, xung tuổi, Bành Tổ); "Nên tránh" khi xung tuổi hoặc điểm ≤ −4.
  - `hop_tac` (19 xu, khóa theo cặp như `cap_doi`), `dat_ten` (29 xu, từ điển `TI_TEN` theo ngũ hành dụng thần).
  - `gieoQue` (Mai Hoa theo thời gian; câu đầu miễn phí, sau đó 9 xu/câu; sheet `GieoQue`).
  - `dangKyBanTin` (39 xu, 12 tháng; email hằng tháng qua `guiBanTinThang`, chủ dự án chạy `caiDatBanTin` một lần để tạo trigger).
  - `xem_tuoi`, `phong_thuy` nằm trong `TT_TRON_GOI`.
