# Giải Bóng Đá Rhino Billiards 2026 – bối cảnh cho phiên Claude mới

Tóm tắt phiên làm việc 10–25/10/2026. Đọc hết trước khi làm. **Trả lời chủ dự án bằng tiếng Việt**: chủ dự án không phải dân IT, nên hướng dẫn theo từng bước.

## Dự án
- Giải nội bộ Công ty TNHH Carbon Billiards, thương hiệu **RHINO – Made by Vietnam**.
- **Web giải:**
  - Google Apps Script, mã ở `webbongda/Code.gs` và `webbongda/Index.html` (nhánh `claude/happy-brown-lttkz3`, dùng chung với Thiên Cơ Các).
  - Dữ liệu nằm ở Google Sheet **"Web đá bóng 2026"** (Drive fileId `1k8zaZhkRM88Oye0zcKvD6q7PHv9KetTvNmY9xCYR6bE`).
  - Đọc dữ liệu bằng connector Google Drive (`read_file_content`). Các trang tính: Doi, CauThu, DoiHinh, TranDau, SuKien, Media, CauHinh…
- **Không bao giờ hiển thị hoặc dùng mật khẩu trong sheet CauHinh** (MAT_KHAU_ADMIN, MAT_KHAU_LIVE).

## Dữ liệu giải (đến 25/10/2026)
- **Đội giải chung:**
  - RHINO FC `DB7109803`, đội trưởng Linhtaro Martínez `CTCF3038CB` #6.
  - EVO FC `D9D1D7B35`, đội trưởng Marcus Thànhram `CT7CE12C78` #24.
  - CUEBOTS FC `D0436739E`, đội trưởng Class-Jan HữuAnhlaar `CT6FADD0C5` #31.
  - TIME-TIP FC `DAE2D9ADE`, đội trưởng Memphis Điệppay `CTBE7CF0D3` #06.
- **Đội giao hữu (GH):** FC RETRO `DA292F9C2`, JUNIORS FC `D08ED667F`. Khai mạc 20/10 đá 3–3, nhưng sheet vẫn ghi "Chưa đá" → nhắc chủ dự án nhập tỷ số.
- **Lịch vòng tròn (15:00):**
  - 23/10: RHINO 2–3 EVO; CUEBOTS 2–2 TIME-TIP.
  - 29/10 (Thứ Năm): RHINO–TIME-TIP (trận 3), EVO–CUEBOTS (trận 4).
  - 03/11: RHINO–CUEBOTS, EVO–TIME-TIP.
- **Ghi bàn lượt 1:**
  - EVO: Kieran Trườngppier 5', 10' (thẻ vàng 16'); Đạtvid Silva 32'.
  - RHINO: Lamine YaHưng 20'; Aymeric Longporte 23'.
  - CUEBOTS: Zinedine ZiĐức 1'; Class-Jan HữuAnhlaar 30'.
  - TIME-TIP: Mario Mạnhdžukić 10'; Kai Hàvertz 18'.
  - SuKien ghi nhầm MaDoi cho 3 bàn (trỏ sang đội giao hữu). Web và video đã tự gán theo đội của cầu thủ.
- **BXH sau lượt 1:** EVO 3 (+1), CUEBOTS 1, TIME-TIP 1, RHINO 0 (−1).
- **Đội hình chính (DoiHinh):** RHINO cập nhật 23/10: CT9F785673, CT45E49CAB, CT2773BB6B, CTCF3038CB, CTEC25A607, CT14A76921, CTF4C60022, sơ đồ 3-2-1.

## Web – đã làm (commit 8e735a6, đã push)
- **Trang chủ:**
  - Bỏ thẻ cầu thủ.
  - Cột trái: số liệu nhanh, kết quả theo ngày (nhãn Lượt), BXH đầy đủ, các đội (lưới gọn), ảnh giải thưởng.
  - Cột phải: lịch sắp tới dạng gọn, ghi bàn, thẻ phạt.
  - Hàm trong Index.html: `viewHome`, `homeKetQuaHtml_`, `homeGhiBanHtml_`, `homeTheHtml_`, `homeSoLieuHtml_`, `lichGonHtml_`, `nhanLuot_`, `ngayTran_`, `doiSuKien_`, `suKienGiai_`. CSS: `.kq-ngay`, `.lg-*`, `.ds-*`, `.home-doi`, `.trang-chu`.
- **Banner động (`veBannerDong`):** cảnh kết quả và cảnh trận tiếp theo hiện đủ 2 trận cùng ngày (`.bdx-2`, `.bdx-the`).
- **Bộ cài clasp** `webbongda/cai-dat-clasp/`:
  - 1-CAI-DAT / 2-CAP-NHAT / 3-KHOI-PHUC.bat; thư mục máy `WebBongDa-AppsScript`.
  - Nhận diện dự án bằng `KHOI_TAO_GIAI`; chặn KPI (`CAI_TRIGGER_CHOT_THANG`) và Thiên Cơ Các (`lapLaSo`).
  - **Đổi Code.gs hoặc Index.html thì cập nhật `ds-file.txt`** (lệnh có trong HUONG-DAN.md).
- **Thử web không cần Apps Script:**
  - Chạy `napDuLieu` trong Node bằng Sheet giả (vm + SpreadsheetApp mock từ CSV/JSON).
  - Mở Index.html bằng Playwright, giả `google.script.run`, viewport 980 (web ép `width=980`).
  - Kiểm cú pháp: trích `<script>` → `node --check`.
- **Chờ chủ dự án:** dán bản mới lên Apps Script (2-CAP-NHAT.bat hoặc dán tay Index), rồi Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Ctrl+F5.

## Video / poster – đã giao (file nằm ở máy phiên cũ, chủ dự án đã nhận)
- **Video kết quả vòng 1 (ngang, 41 s):** engine pdoom-video (github.com/mexicat/pdoom-video, three.js + bun). Scene `media-src/pdoom-kq/kq.ts`.
- **Video giới thiệu lượt 2, dọc 9:16, 47 s:**
  - `HypeLuot2` (kiểu sọc tím), rồi `HypeLuot2PS` = **phong cách poster Match Day**: nền sân vận động tối + vàng kim, tấm đỏ/xanh viền vàng, chữ vàng kim/bạc, ảnh thật đội trưởng.
  - Nội dung: mở màn → nhìn lại lượt 1 → BXH → trận 3/4 (VS, đội hình 3D, đội trưởng + 15:00) → hẹn gặp.
- **Poster lượt 2:**
  - Remotion `PosterLuot2` / `PosterLuot2Doc`.
  - Poster AI "Match Day" của chủ dự án: đã thay mặt thật 4 đội trưởng + 4 logo thật bằng `scripts/poster_thay_mat_logo.py` (tách người/logo bằng rembg birefnet, inpaint, dán ảnh thật, dán lại băng tên).
- Mã nguồn Remotion: `webbongda/media-src/remotion/src`. Root.tsx đăng ký mọi composition.
- **Lệnh render:** `npx remotion render src/index.ts <id> out.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=4 --crf=20`.
- **Thư mục `public/` (≈300 MB) không có trong repo.** Phải dựng lại:
  - logo đội (`logo_<rhino|evo|cuebots|timetip|retro|juni>.png`);
  - thẻ cầu thủ `c_<MaCT>_<doi>.png` (`scripts/cardmake.py`, `rm_prep.py`);
  - ảnh tách nền `ps_<MaCT>_<doi>.png` từ ảnh trong sheet CauThu (AnhUrl/AnhTheoDoi) bằng rembg `birefnet-portrait`;
  - `stadium.jpg`, `grass.jpg`;
  - nhạc Kevin MacLeod (CC BY 4.0, luôn ghi công): "Mega Hyper Ultrastorm", "Heroic Age", "Volatile Reaction";
  - sfx `whoosh/boom/scan/tick`.

## Quy tắc của chủ dự án (đã chốt)
- Không dùng mặt cầu thủ do AI tạo; luôn dùng ảnh thật.
- Không chớp sáng hoặc rung mạnh (mỏi mắt).
- Giới thiệu cầu thủ theo từng đội, không xen kẽ đội nọ đội kia.
- Đội hình chính đặt trên sân 3D dọc.
- Logo 4 đội phải to, rõ.
- Poster ưa phong cách "mẫu 2" (ảnh thật, thể thao), không thích futuristic neon.
- **Phong cách mới ưng ý:** poster Match Day vàng kim – đỏ – xanh.
- Cái gì xong trước thì gửi trước. Không hỏi API key trong chat. Hỏi trước khi tiêu credit trả phí. Canva được dùng tự động.
- Không bịa số liệu: mọi tỷ số, phút, tên đều lấy từ sheet.

## Việc có thể làm tiếp
- Video kết quả lượt 2 sau ngày 29/10: lấy tỷ số và sự kiện từ sheet, dùng phong cách poster (HypeLuot2PS).
- Poster lượt 3 (03/11).
- Có thể tách web bóng đá ra nhánh riêng: CLAUDE.md của repo nói mỗi dự án một nhánh. Muốn tách thì sửa `$Nhanh` trong `cai-dat-clasp/chung.ps1`.
