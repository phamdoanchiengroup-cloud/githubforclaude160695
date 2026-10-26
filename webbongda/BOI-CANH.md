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

## Giao diện 2026 – hologram vàng kim (25/10, đã đẩy lên nhánh)
- Chủ dự án chốt phong cách **hologram + futuristic** phối theo poster Match Day: nền đen ấm, **vàng kim là màu chính**, xanh dương chỉ làm viền phụ, đỏ cho EVO/thua. Bảng màu do chuyên gia `ui-designer` (agency agents) đề xuất. Phông: Barlow Condensed (tiêu đề), Chakra Petch (nhãn HUD), Be Vietnam Pro (chữ thường).
- Mã: khối CSS "GIAO DIỆN 2026" cuối `<style>` trong Index.html (ghi đè biến màu cũ, tấm kính `.card`, tab, nút, `.match`); khung Match Day trang chủ `veMatchDay_` (+ `MATCH_DAY_POSTER`, `mdMauDoi_`, `moAnhLon_`), gọi trong `render()` khi ở tab home, không có trận sắp tới thì về banner động `veBannerDong`.
- Nền (26/10): **đầu trang** = băng ảnh `nen-dau-trang.webp` (`.nen-dau`, chèn trong `render()` trước banner, tràn hết bề ngang, mờ dần); **phía dưới** = `nen-duoi.webp` cố định ở `body::before`, phủ tối nhẹ; tấm kính `.card` trong hơn (nền .42 + làm mờ) để thấy ảnh nền. Commit ảnh `13fa9d8…`.
- 26/10: mọi tab đều dùng khung Match Day lớn `veMatchDay_` (chủ dự án chọn; thanh gọn `veThanhMatchDay_` vẫn giữ trong mã) (dữ liệu chung `mdDuLieu_`, đồng hồ `mdChayDem_`); icon tab khối đặc SVG `ICON_TAB`/`iconTab_`; Ghi bàn có thẻ FIFA người dẫn đầu (`.gbd`, `renderTheFifa`); BXH mới `.bxh-moi` có logo + phong độ `phongDoHtml_`; poster trang chủ to ~55%.
- 26/10: poster lượt 2 bản mới `match-day-luot2-v2.webp` + lượt 3 `match-day-luot3.webp` (commit `7f04199…`) trong `MATCH_DAY_POSTER`. Tự chuyển ngày: một ngày thi đấu kết thúc khi mọi trận "Đã đá" hoặc quá giờ bóng lăn `MD_HET_SAU_MS` (3 giờ) → hiện ngày/poster kế tiếp.
- 26/10 hiệu ứng phương án B (chủ dự án chọn, demo https://claude.ai/artifact/ARVxNV7G8X81NCGKUA4UBX): khối CSS "HIỆU ỨNG 2026" + JS `fxHat_` (hạt vàng canvas), `fxMatchDay_` (đèn sân quét, poster nghiêng theo chuột), viền năng lượng `.md-tran::after`, sóng vàng khi bấm nút, `fxGhiBan_` (lật thẻ người dẫn đầu lần đầu), đội hình 2 đội `.thv-fx` (logo lao vào, VS đập + sóng, thẻ ra sân theo tuyến `--i`). Xuất PNG tắt hết hiệu ứng.
- **26/10 ĐÃ BỎ TÁCH FILE:** thử tách CSS/JS lên jsDelivr (commit c67edff…eeccfa0) nhưng chủ dự án mở web gặp nhiều lỗi → trả `Index.html` về bản một file có hiệu ứng (commit 06e8725), xóa `web/` và `tools/dong-goi.py`. Sửa giao diện tiếp tục trực tiếp trong `Index.html`.
- Ảnh tải qua **jsDelivr** từ `webbongda/anh/` (link gắn mã commit, vì tên nhánh có "/"): poster Match Day lượt 2 (`ab52d91…`), nền sân vận động (`82e47cd…`), sân đội hình + cơ cấu giải thưởng (`7b77aca…`). Thêm poster ngày khác: đẩy ảnh lên `anh/`, thêm dòng vào `MATCH_DAY_POSTER` với khóa "dd/mm/yyyy".
- Đội hình 2 đội: nền `san-doi-hinh-cat.webp` (ảnh sân nhìn từ trên, đã cắt bỏ khán đài, commit `c2a8b56…`), `.thv-pitch` tỉ lệ 1221/693; `slotPos` trong `xemDoiHinhTran` map theo vạch vôi (biên dọc 3.6–96.4%, khung thành 3.7%/96.3%), chiều sâu 4 tuyến theo bảng `TUYEN` (thủ môn 7% · hậu vệ 19–20% · tiền vệ 32% · tiền đạo 44%); thẻ trên sân `--S:92px`.
- Giờ thi đấu lấy từ sheet (TranDau.GioThiDau); chủ dự án đã đổi lượt 2–3 sang 15:30, lượt 1 giữ 15:00.
- Chạy thử không cần Apps Script: `webbongda/tools/thu-web/` (README trong đó).
- **Lưu ý bảo mật:** sheet đang để "ai có link cũng xem" nên tab CauHinh (có mật khẩu) đọc công khai được – đã nhắc chủ dự án.

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

## Video giao diện 2026 (26/10)
- `media-src/remotion/src/VideoMoi.tsx` (điểm vào riêng `src/moi.ts`, root `RootMoi.tsx`): `KetQuaLuot1Moi` (43 s) và `GioiThieuLuot2Moi` (44 s), dọc 1080×1920, phong cách vàng kim hologram như web (đèn sân quét, hạt vàng, viền năng lượng, VS đối đầu, mở thẻ FIFA, đội hình trên sân dọc 3D). Dữ liệu `src/vdmoi_data.json` dựng từ sheet.
- Tài nguyên `public/vm/` (không commit): ảnh cầu thủ `ct/<MaCT>.jpg` (thumbnail Drive w700), `logo_<doi>.png`, `nen-dau.jpg`, `nen-duoi.jpg`, `nen-san.jpg`, `san.jpg`, `poster-l2.jpg`, `qr.png`, phông TTF trong `font/` (máy dựng không tải được Google Fonts), nhạc `nhac/Mega_Hyper_Ultrastorm.mp3`, `nhac/Heroic_Age.mp3`.
- Dựng: `npx remotion bundle src/moi.ts --out-dir=out/bundle` rồi `npx remotion render out/bundle <id> out/<id>.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --concurrency=4 --crf=20`. Mã cũ `src/index.ts` thiếu file `om/` nên không bundle được.

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

## Tài nguyên & liên kết (để phiên sau không phải đi tìm)
### Google Drive / Sheet (đọc bằng connector **Google Drive** – `search_files`, `read_file_content`, `download_file_content`)
- Sheet dữ liệu giải "Web đá bóng 2026": https://docs.google.com/spreadsheets/d/1k8zaZhkRM88Oye0zcKvD6q7PHv9KetTvNmY9xCYR6bE/edit
  - Tab: Doi (logo `LogoUrl`, khung thẻ `KhungThe`, đội trưởng `DoiTruongMaCT`), CauThu (ảnh `AnhUrl`, ảnh theo đội `AnhTheoDoi` JSON, chỉ số thẻ), DoiHinh, TranDau, SuKien, Media (link YouTube từng trận), CauHinh (TEN_GIAI, BANNER_URL, GIAI_THUONG… – **bỏ qua các dòng mật khẩu**).
- Logo đội (Drive, cột LogoUrl tab Doi):
  - EVO FC https://drive.google.com/file/d/1EYq-r_pJc3decdsj31VMrp35_20s81Wk/view
  - RHINO FC https://drive.google.com/file/d/1SLpOl3msDE7MvZ1skVjY66chAi8AHQPT/view
  - CUEBOTS FC https://drive.google.com/file/d/1JQ2FRA9U-86arCjDk8A0q7OfSq-SngPx/view
  - TIME-TIP FC https://drive.google.com/file/d/1vouOUZSzQVg0hnlHWv1wFvozhmx09Q_i/view
  - (FC RETRO, JUNIORS FC: xem tab Doi)
- Banner web (BANNER_URL): https://drive.google.com/file/d/18jGkWFsQR5Od4nNA2LP4WGanzVqURFxJ/view · ảnh trong mã Index.html: `BANNER_HEP_ID` 1RbTWbhEL38WiZYu36A-ewZ3_1ELyiyFC, `GIAI_THUONG_IMG` 1YjHCGAWx7pRRPO8TXJDIvyR61u4nZmhz
- Video giới thiệu giải https://youtu.be/lhtLebUcmPQ — ĐÃ BỎ khỏi web (25/10, chủ giải yêu cầu). Mỗi thẻ trận ở Match Day giờ có 2 nút: `▶ Video giới thiệu trận` (lấy từ tab Media theo MaTran, hàm `videoCuaTran_`; trận chưa có video thì ẩn nút) và `⚔️ Sơ đồ đội hình` (`xemDoiHinhTran`). Video từng trận nằm ở tab Media (RHINO VS EVO https://youtu.be/KWTYpemQC0w, CUEBOTS VS TIME-TIP https://youtu.be/P0Yn7JW_C8o, RHINO VS TIME-TIP https://youtu.be/RZ_rEyMYZDc, EVO VS CUEBOTS https://youtu.be/c3ZVNEOhCTA, RHINO VS CUEBOTS https://youtu.be/SBW57rj11KA, EVO VS TIME-TIP https://youtu.be/hrDLSi7hrP8, RETRO VS JUNIORS https://youtu.be/4KlPUyciylw)
- Chuyển link Drive thành ảnh tải được: `https://drive.google.com/thumbnail?id=<ID>&sz=w2000` (hoặc connector `download_file_content`).

### Link web
- Web giải: https://script.google.com/macros/s/AKfycbyU0HwrkHWv_cBug5SJYhN_Vo2SZd9R5j_RXlGBeAozoTIZmapdraymm7VWCUJz73PCJA/exec
- Link ngắn (Bitly, tạo 25/10): **https://bit.ly/rhinofootball** → trỏ về link trên.
- Tải nhanh (25/10): `driveImg(u, w)` mặc định w600 (trước w1600), chỉ banner/ảnh thư viện mở lớn dùng w1600; ảnh jsDelivr nén lại (commit `c833aa2…`). Trang chủ 11,7 MB → 6,4 MB. Chậm khi mở bit.ly trong Zalo/Messenger chủ yếu do trình duyệt trong app + bước kiểm tra link.
- QR code: `anh/qr-rhinofootball.png` (QR mức H, logo RHINO giữa) và thẻ in `anh/the-qr-rhinofootball.png`; cả hai mã hóa https://bit.ly/rhinofootball (đã quét thử bằng zxing). Đổi đích bằng tool Bitly `bitly_update_short_link`.

### Connector / plugin đã dùng
- **Google Drive** (bắt buộc – đọc sheet, tải ảnh cầu thủ/logo).
- **Canva** – chủ dự án cho phép dùng tự động không cần hỏi (generate-image, export-design, upload). Hạn mức Canva có giới hạn.
- **ProJect (Everygen) generate_image** – có tốn credit: hỏi trước khi dùng.
- Gemini / Hugging Face tạo ảnh: chưa dùng được (thiếu HF_TOKEN; không xin key trong chat).
- GitHub: repo `phamdoanchiengroup-cloud/githubforclaude160695` (nhánh `claude/happy-brown-lttkz3`, thư mục `webbongda/`). Không có `gh` CLI – dùng git + tool GitHub MCP nếu cần.

### Repo / công cụ ngoài
- **pdoom-video** (engine video three.js, beat-sync): https://github.com/mexicat/pdoom-video – cần **bun** (`curl -fsSL https://bun.sh/install | bash`, PATH `/root/.bun/bin`). Sửa `scripts/render.ts` cho Chromium có sẵn: `executablePath: '/opt/pw-browsers/chromium'`, args `--use-angle=swiftshader --enable-unsafe-swiftshader`; đổi đường dẫn nhạc `audio/pdoom.mp3` → nhạc của mình; dữ liệu nhịp `data/audio.json` tạo bằng `media-src/scripts/phan_tich_nhac.py`; `data/lyrics.json` = `{"lines":[]}`. Render CPU ~0,7 khung/giây (41 s ≈ 28 phút).
- **Remotion 4** (`media-src/remotion/package.json`: remotion/@remotion/cli 4.0.300+, react 18, three 0.171) – `npm install` trong thư mục remotion, `public/` tự dựng lại (xem trên).
- **rembg 2.0.86** (venv Python: `pip install rembg onnxruntime opencv-python-headless scipy pillow`), mô hình `birefnet-portrait` (tách người – tốt nhất), `birefnet-general` (logo, 2 người); chạy từng ảnh một (chạy song song dễ bị kill). Ví dụ: `media-src/scripts/tach_nen_rembg.py`.
- **ffmpeg** có sẵn; **Playwright + Chromium** có sẵn (`/opt/pw-browsers/...`, không chạy `playwright install`).
- Phông: Oswald 700 (`OSW`), Be Vietnam Pro 800 (`VIE`) – file .ttf trong `public/`, tải từ Google Fonts.
- Nhạc: incompetech.com (Kevin MacLeod, CC BY 4.0 – luôn ghi công cuối video).

### Skill
- Không dùng skill riêng cho dự án này. Video làm bằng Remotion/pdoom tự viết (không dùng HyperFrames).

## Việc có thể làm tiếp
- Video kết quả lượt 2 sau ngày 29/10: lấy tỷ số và sự kiện từ sheet, dùng phong cách poster (HypeLuot2PS).
- Poster lượt 3 (03/11).
- Có thể tách web bóng đá ra nhánh riêng: CLAUDE.md của repo nói mỗi dự án một nhánh. Muốn tách thì sửa `$Nhanh` trong `cai-dat-clasp/chung.ps1`.

### BXH kiểu truyền hình + hiệu ứng đợt 2 (25/10, chủ giải duyệt, đã đưa vào Index.html)
- BXH (`bxhCardHtml_`, CSS `.tv-*`; Trang chủ: BXH nằm TRÊN "Kết quả trận đấu" từ 25/10): mỗi đội một thanh kính, logo tròn, cột Trận/BT/BB/HS/Điểm (bảng gọn: Trận/HS/Điểm), khối điểm bên phải; bấm thanh → `modalDoiCauThu`. KHÔNG có vạch "vào chung kết" (chủ giải bỏ). Xếp theo Điểm → Hiệu số → Đối đầu → Bàn thắng; bằng hết thì đồng hạng: `hangHT` tính trong `tinhBXH_` (Code.gs), nhóm đồng hạng phải hòa đối đầu với mọi đội trong nhóm. Hạng 1 (kể cả đồng hạng 1) có viền vàng, vương miện, khối điểm vàng.
- Hiệu ứng đợt 2 (sau `fxGhiBan_`): `FX_TOC = 0.35` ("rất chậm") đặt playbackRate cho hiệu ứng trang trí tên `fx-`/`md-`/`tv-` (trừ `FX_TOC_TRU`: sóng bấm nút `fx-gon` và màn mở đội hình `fx-laoTrai/laoPhai/dap/song/raSan` vì đã căn giờ với hạt vàng và nút tải PNG); gọi `fx2Toc_` ngay sau mỗi render để áp cả hiệu ứng còn đang trễ, hạt vàng `fxHat_` cũng nhân FX_TOC; `fx2Bxh_` (thanh BXH trượt vào, số điểm/bàn chạy từ 0, vệt sáng quét, thanh vàng tỉ lệ bàn ở Ghi bàn); `fx2Tab_` (thanh vàng trượt giữa tab, vệt quét ngang, khối nổi lên lần lượt; khối dưới màn hình >200px chờ cuộn tới mới hiện + kẻ viền). Gắn bằng cách bọc `renderView`. Lớp `fx2-bxh fx2-tab` trên <html>.
- Trang demo (Artifact, có bảng điều khiển bật/tắt): https://claude.ai/artifact/683GwZnizMd8z9B6TPHzCN
