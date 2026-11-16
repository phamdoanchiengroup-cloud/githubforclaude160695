# 06 – Miễn phí, trả phí và lời mời mua (rà soát 16/11/2026)

Người rà: chuyên gia Product Manager (Agency Agents). Chỉ đọc mã, **không sửa mã**. Phiên này không chạy được lệnh nên **không có ảnh chụp**. Bằng chứng ghi theo `file:dòng` (đọc trực tiếp ngày 16/11).

## Tóm tắt 5 dòng
1. **Quà đăng ký 50 xu lớn hơn giá Trọn đời 49 xu** (`ThanhToan.gs:30,52`). Kết quả là mọi tài khoản mới mở được toàn bộ phần bản mệnh mà không trả đồng nào. Phần thật sự bán được chỉ còn vận năm/tháng, cặp đôi, gói gia đình và email. Thêm nữa, tạo tài khoản mới cho mỗi lá số là được quà lại, không có gì chặn.
2. **Lời mời đầu tiên vẫn nói về xu**, trái quyết định của chủ dự án: poster trang chủ "Tạo tài khoản – nhận ngay 50 xu" kèm 3 cách tiêu xu và chữ "còn dư"; thanh mời "Nhận 50 xu & mở Tổng hợp"; câu "chỉ 19.000đ"; lá cuối của hành trình có nút "Mở Tổng hợp 6 hệ · 19 xu".
3. **Khoảnh khắc "trúng" đã có sẵn nhưng nằm rải rác, chưa được dùng làm cửa mời**: hành trình 7 lá, kiểm tra độ khớp 8 đoạn, đại vận đã qua để kiểm chứng. Riêng dò giờ sinh, công cụ gây tin nhất, lại thu 9 xu.
4. **Nút mời mua xuất hiện ở khoảng 14 chỗ**, nhiều chỗ ghi giá ngay trên nút (từng chip năm, mục lục, thanh trên, thanh dưới, thẻ khóa). Hộp xác nhận mua là `window.confirm` của trình duyệt. Có một lỗi số tiền trong hộp nạp. Có chữ "Được chọn nhiều nhất" mà không dựa trên số liệu nào.
5. **Khuyên dùng Phương án A, "Tài khoản là chìa khóa"**: tài khoản miễn phí mở sẵn Tổng hợp 6 hệ, dò giờ sinh và 1 đại vận đã qua. Lời mời không nhắc tiền. Trả phí tập trung vào "khi nào" (đại vận, năm 2027, tháng), Trọn đời nâng giá lên, thêm gói Hội viên năm. Kèm đó là bộ đo phễu, vì hiện **chưa đếm được khách chưa đăng nhập**.

---

## 1. Bảng hiện trạng (đọc từ mã ngày 16/11)

### 1a. Ai được xem gì
| Phần | Khách chưa đăng nhập | Thành viên chưa mua | Ghi chú / chỗ trong mã |
|---|---|---|---|
| Lá số Tử Vi + bảng Hologram 6 hệ | Mở | Mở | `TaiKhoan.gs:154–172` lập đầy đủ rồi mới cắt phần chưa mở |
| Luận giải 6 hệ (26 bước Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số, HD) | **Mở** | Mở | Chú thích `TaiKhoan.gs:162` |
| Hành trình 7 lá + kiểm tra độ khớp 8 đoạn | Mở | Mở | `Script.html:4427–4469`, `hookKhachHtml` 787 |
| Tổng hợp 6 hệ (`co_ban`) | Khóa: hiện bảng điểm 9 lĩnh vực, lộ trọn 1 lĩnh vực mạnh nhất, các khối "Hé lộ / Khi mở khóa" | Khóa (19 xu) | `ttCatTongHop_` `TaiKhoan.gs:174`, `th6KhachHtml` `Script.html:3730`, `tongKhoaHtml` 576 |
| Đại vận (lời luận từng 10 năm) | Khóa, chỉ hiện điểm | 9 xu/vận (vận đã qua 9 xu) | `ttCatPhan_` `ThanhToan.gs:214` |
| Vận năm / Hồ sơ biến cố năm | Khóa, giữ 1 sự kiện làm mồi | 19 xu/năm | `ThanhToan.gs:231–251` |
| Nhật vận 1 tháng | Khóa | 9 xu/tháng | `ThanhToan.gs:260` |
| Đồng hành cả năm (năm + 12 tháng) | Khóa | 39 xu (trừ phần đã mua) | `ThanhToan.gs:309` |
| Biến cố hội tụ 30 năm | Khóa | 19 xu | `ThanhToan.gs:208` |
| Phối ngẫu & tuổi hợp | Khóa | 9 xu, **phải mở `co_ban` trước** | `ThanhToan.gs:306` |
| Dò giờ sinh | Khóa | 9 xu | `Script.html:602` |
| PDF đầy đủ / bản gọn | Khóa | 19 xu (bản tóm tắt ~50 trang mở cho mọi người) | Quyết định 25/10 |
| Cặp đôi | Khóa (hiện 2/6 tiêu chí) | 19 xu/cặp | `cdHtml` `Script.html:917` |
| 6 tiện ích (xem tuổi, phong thủy, chọn ngày, gieo quẻ, hợp tác, đặt tên) | Mở (gieo quẻ cần đăng nhập) | Mở | `TT_MIEN_PHI` `ThanhToan.gs:47` |
| Bản tin tháng / luận hằng ngày qua email | — | 39 xu/năm · 29 xu/30 ngày | `ThanhToan.gs:39–40` |

### 1b. Giá và gói (`ThanhToan.gs:18–54`)
| Loại | Mã | Giá (xu = nghìn đồng) | Giá gạch ngang |
|---|---|---|---|
| Lẻ – bản mệnh | `co_ban` 19 · `phoi_ngau` 9 · `bien_co` 19 · `pdf` 19 · `do_gio` 9 | | 49 / 19 / 29 / 29 / 19 |
| Lẻ – theo giai đoạn | `dai_van` 9 · `nam` 19 · `thang` 9 | | 19 / 29 / – |
| Gói giai đoạn | `tron_dai_van` 39 · `dong_hanh` 39 | | 99 / 79 |
| Trọn đời | `tron_goi` **49**: co_ban, 12 đại vận, biến cố, phối ngẫu, PDF, dò giờ, xem tuổi, phong thủy. **Không gồm năm/tháng** | | 149 |
| Gia đình | `gia_dinh_3` 39 · `gia_dinh_5` 49 (mỗi lượt = co_ban + vận năm cho 1 lá số) | | 129 / 199 |
| Gói nạp | 20.000đ→20 · 50.000đ→55 · 100.000đ→120 · 200.000đ→260 | | |
| Thưởng | Đăng ký **50 xu** · mời bạn cả hai +9 (trần 30 lượt) · nạp lần đầu **+100%** · người giới thiệu +20% lần nạp đầu của bạn | | |

### 1c. Các điểm mời mua hiện có
| # | Chỗ | Lời hiện tại (rút gọn) | Nhắc tiền/xu? |
|---|---|---|---|
| 1 | Poster trang chủ `vePosterQua` `Script.html:4193` | "Tạo tài khoản – nhận ngay 50 xu", 3 thẻ giá, "còn dư 1 xu" | **Có, rất đậm** |
| 2 | Dòng quà trang chủ `veQuaTrangChu` 4186 | "Đăng ký miễn phí nhận 50 xu – đủ mở cả gói Trọn đời" | Có |
| 3 | Thanh trên `veQc` 1096 · thanh dưới `veCta` 1072 · mục lục `dungMucLuc` 1068, cả ba lấy từ `tinhTrangMua` 1006 | Khách: "🎁 Đăng ký miễn phí – tặng 50 xu / Nhận 50 xu & mở Tổng hợp" | Có |
| 4 | Tab Tổng quan khi khóa `tongKhoaHtml` 576 | "Nhận quà & mở · ~~49~~ 19 xu" + "Trọn đời · ~~149~~ 49 xu" | Có |
| 5 | `th6KhachHtml` 3742 | "🎁 Đăng ký nhận 50 xu – mở miễn phí" | Có |
| 6 | Lá cuối hành trình `htCuoiHtml` 4462 | "Mở Tổng hợp 6 hệ · 19 xu" | Có |
| 7 | Hộp đăng ký `moDangNhap` 349–352 | "…xu quà để mở Tổng hợp 6 hệ" + "🎁 Tạo tài khoản nhận ngay 50 xu" | Có |
| 8 | Khi bấm mua mà chưa đăng nhập `muaGo` 483 | "Tạo tài khoản miễn phí – tặng ngay 50 xu, đủ mở…" | Có |
| 9 | Từng chip năm trong Tổng hợp `th6NutNam` 3727 | "🔒 Mở năm 2027 · 19 xu" (lặp ở mỗi lĩnh vực) | Có (sau đăng nhập) |
| 10 | Tab Vận hạn `uuDaiVanHtml` 3957, `dvTimelineHtml` 3944, `theKhoa` 4749/4755, dòng thời gian 4581/4593 | 4 thẻ ưu đãi + nút giá từng vận, từng năm | Có (hợp lý vì đây là chỗ quyết định) |
| 11 | Thẻ khóa biến cố, phối ngẫu `khoaMuaHtml` 565 | "Mở khóa · 19 xu" + "Trọn đời · 49 xu" | Có |
| 12 | Cặp đôi `tinhTrangMua` 1011 | "Năm cưới & năm sinh con **kèm %**… – chỉ 19.000đ" | **Có tiền đồng + có %** |
| 13 | Lời chia sẻ `chiaSe` 449 | "…đăng ký còn được tặng 50 xu" | Có |
| 14 | Khung "Rủ bạn bè" `moiBanHtml` 455 | "bạn nhận 9 xu, bạn ấy nhận 59 xu" | Có |

---

## 2. Vấn đề và đề xuất theo mức

### MỨC CAO

**C1. Quà đăng ký phủ hết sản phẩm "Trọn đời", nên bản mệnh không còn bán được**
- Chỗ: `ThanhToan.gs:30` (`tron_goi` 49), `:52` (`dangKy: 50`), `:54` `TT_KM_PHIEN`; poster `Script.html:4199` chủ động gợi ý "Trọn đời – Đáng giá nhất".
- Vấn đề: người đăng ký nào cũng lấy Trọn đời miễn phí (dư 1 xu). Trọn đời lại mở **theo từng lá số** (`ttKhoaLaSo_`), nên người dùng chỉ cần tạo thêm tài khoản cho mẹ, cho người yêu… là mỗi lần lại có 50 xu. Liên hệ khi đăng ký không được xác minh (`TaiKhoan.gs:117` chỉ kiểm dạng). Mời bạn bằng tài khoản phụ cho thêm +9 xu mỗi lượt, tối đa 30 lượt. Gói gia đình (39 xu = 3 × Tổng hợp + vận năm) cũng mất ý nghĩa khi tài khoản mới nào cũng tự có 50 xu.
- Bằng chứng: bảng 1b; `ttQuaDangKy_` `ThanhToan.gs:129` không kiểm trùng liên hệ hay thiết bị.
- Đề xuất: xem Phương án A/B ở mục 3. Việc tối thiểu: (1) không để quà ≥ giá Trọn đời; (2) mỗi số điện thoại/email (chuẩn hóa) chỉ nhận quà một lần; (3) ghi cờ đã nhận quà trên máy (`localStorage`) để hạn chế tạo tài khoản phụ hàng loạt.
- Công sức: M.

**C2. Lời mời đầu tiên nhắc xu/tiền, trái quyết định "tạo tài khoản miễn phí, đọc luận giải miễn phí"**
- Chỗ: các mục 1, 2, 3, 5, 6, 7, 8, 13 của bảng 1c; `tinhTrangMua` `Script.html:1021, 1026–1027` ("chỉ 19.000đ", "Nhận 50 xu & mở…").
- Vấn đề: khách vừa lập lá số đã gặp ngay con số xu, giá gạch ngang và "còn dư 1 xu". Chủ dự án đã nói rõ "nghe mất tiền là không thích". Người 22–40 tuổi xem trên điện thoại sẽ hiểu đây là trang bán hàng chứ chưa thấy giá trị.
- Đề xuất: **quy tắc "hai cửa"**:
  - Cửa 1 dành cho khách chưa có tài khoản: chỉ nói giá trị và chữ "miễn phí", không có con số xu, không có giá.
  - Cửa 2 dành cho thành viên, đúng lúc họ định mở một phần cụ thể: lúc này mới ghi giá trên nút, cho minh bạch.
  - Quà xu (nếu giữ) chỉ báo **sau khi** đăng ký xong, như một món quà bất ngờ ("Quà chào mừng đã vào ví của bạn").
  - Lời mời cụ thể ở mục 4.
- Công sức: S (chỉ đổi lời) đến M (nếu đổi cả poster).

**C3. Nội dung mồi dùng nỗi sợ, trái quy tắc văn luận**
- Chỗ: `demoTeaser_` `TaiKhoan.gs:228` "3 điều cần canh chừng – **có 1 điều liên quan sức khỏe**"; `:230` "Cung yếu nhất – nơi bạn **dễ 'mất' nhất**: ███"; `:232` "…vì sao và cách hóa giải". Hiện ở tab Tổng quan khi khóa (`khoaHtml` qua `tongKhoaHtml` `Script.html:578`).
- Vấn đề: dọa sức khỏe và mất mát để ép mua là trái với "không chẩn đoán sức khỏe, giọng nhẹ nhàng, không phán xét". Về lâu dài nó cũng làm khách mất tin.
- Đề xuất: viết lại theo hướng tò mò tích cực, ví dụ:
  - "2 điểm sáng khác được nhiều hệ cùng thấy"
  - "Điều bạn nên chăm chút nhất trong 10 năm tới và cách làm"
  - "Lĩnh vực đang ở mức 'cần chăm chút' và cách bù đắp"
  - Bỏ hẳn chữ "sức khỏe" và "mất" khỏi lời mồi.
- Công sức: S. Nên giao chuyên gia content-creator soạn.

**C4. Lỗi số tiền trong hộp nạp xu**
- Chỗ: `Script.html:524`: `'… – nạp 50.000đ nhận ' + fmtXu(Math.round(v.bangGia.goi[0].xu * (1 + th / 100)))`.
- Vấn đề: gói đầu tiên là 20.000đ → 20 xu, nên màn hình hiện "nạp 50.000đ nhận 40 xu". Con số sai đúng lúc khách sắp trả tiền làm mất tin ngay.
- Đề xuất: lấy cả tiền lẫn xu từ cùng một gói (`goi[0].tien` và `goi[0].xu`), hoặc chọn gói 50.000đ theo chỉ số tìm được.
- Công sức: S.

**C5. Dò giờ sinh thu phí, mâu thuẫn với cam kết minh bạch**
- Chỗ: `camKetHtml` `Script.html:794` ("Nếu lá số khớp dưới 50% **và dò giờ sinh vẫn không ra** giờ phù hợp… đừng mua"); `do_gio` 9 xu `ThanhToan.gs:29`; `chenKhoa` 602.
- Vấn đề: muốn biết có nên mua hay không thì khách phải trả tiền trước cho công cụ dò giờ. Đây lại là công cụ gây tin mạnh nhất, vì giờ sinh sai thì mọi phần sau đều lệch.
- Đề xuất: dò giờ sinh **miễn phí cho tài khoản**, giới hạn 1–2 lần mỗi lá số mỗi ngày để giữ tải máy chủ (thử 12 giờ khá nặng). Dò giờ trở thành lý do mạnh thứ hai để tạo tài khoản.
- Công sức: S (đổi quyền) + S (giới hạn lượt).

**C6. Chưa đếm được phễu: lá số của khách không được lưu, không có sự kiện**
- Chỗ: `TaiKhoan.gs:157` (`if (!u) input.save = false`); các sheet hiện có: Vi, SoCai, MoKhoa, DonHang, DoiChieu.
- Vấn đề: không biết bao nhiêu khách lập lá số, bao nhiêu người mở hộp đăng ký, bao nhiêu người bỏ ở form. Vì vậy không đo được tỷ lệ đăng ký, cũng không chứng minh được phương án nào tốt hơn.
- Đề xuất: thêm sheet `SuKien` (thời gian, mã phiên ẩn danh ngẫu nhiên, sự kiện, tab/phần), **không lưu ngày giờ sinh hay tên**. Danh sách sự kiện ở mục 5. Thêm một thẻ "Phễu 7 ngày" vào Quản trị.
- Công sức: M.

### MỨC VỪA

**V1. Quá nhiều điểm mời, giá lặp khắp nơi**
- Chỗ: bảng 1c. Riêng `th6NutNam` (3727) gắn nút "🔒 Mở năm 2027 · 19 xu" vào từng năm của từng lĩnh vực, nên một trang Tổng hợp có thể có hàng chục nút giá.
- Đề xuất: **luật mật độ**:
  - Mỗi màn hình điện thoại có nhiều nhất 1 nút mời chính.
  - Mỗi phần bị khóa có 1 thẻ khóa ngay tại chỗ.
  - Chỉ 1 thanh dính (thanh dưới), và thanh này hiện sau khi khách đã cuộn đọc khoảng 1,5 màn hình.
  - Bỏ khối mua trong mục lục (`toc-mua`) với khách.
  - Chip năm chỉ ghi "🔒 Xem năm 2027"; giá hiện ở bước xác nhận.
- Công sức: S–M.

**V2. Hộp xác nhận mua dùng `window.confirm`**
- Chỗ: `muaGo` `Script.html:488`, `dungLuot` 506, `tiBanTin` 4147, `tiVanNgay` 4160.
- Vấn đề: hộp thoại xám của trình duyệt trên điện thoại trông như cảnh báo lỗi, không có ảnh, không nói phần đó gồm những gì, không có lời cam kết.
- Đề xuất: **tấm xác nhận trượt từ dưới lên**, gồm:
  - Tên phần và 3 gạch đầu dòng nội dung.
  - "Mở vĩnh viễn cho lá số của …".
  - Giá, số dư, số dư còn lại sau khi mở.
  - Nút "Mở ngay". Nếu thiếu xu thì hiện chọn gói nạp ngay trong tấm này, không đổi màn hình. Đã có sẵn `state.sauNap` để tự mở phần đó sau khi nạp xong.
  - Một dòng tin cậy (xem V5).
- Công sức: M.

**V3. Hộp đăng ký có 6 ô**
- Chỗ: `dangKyGo` `Script.html:377`: tên đăng nhập, mật khẩu, nhập lại mật khẩu, tên hiển thị, liên hệ, mã mời. Tên đăng nhập bắt buộc theo dạng `[a-z0-9._-]{3,32}` (`TaiKhoan.gs:99`).
- Vấn đề: người không rành công nghệ dễ vấp ở bước "tên đăng nhập không dấu". Ô "nhập lại mật khẩu" và ô "mã mời" làm form dài thêm.
- Đề xuất:
  - Chỉ còn 2 ô: **số điện thoại hoặc email** (dùng luôn làm tên đăng nhập) và **mật khẩu** (có nút hiện/ẩn).
  - Tên hiển thị lấy từ họ tên trên lá số.
  - Mã mời tự điền từ link; muốn nhập tay thì mở mục gập "Có mã mời?".
  - Ghi chú dưới nút: "Lá số đang xem được giữ nguyên."
- Công sức: M (máy chủ phải chấp nhận SĐT/email làm tên đăng nhập; tài khoản cũ vẫn đăng nhập như trước).

**V4. Thẻ "Hé lộ / Khi mở khóa" khô, chưa cho xem trước nội dung thật**
- Chỗ: `khoaHtml` 757, `khoaMuaHtml` 565, `th6KhachHtml` 3739 ("🔒 Kết luận… có trong phần Tổng hợp 6 hệ").
- Đề xuất: **xem trước kiểu "đoạn mở đầu + làm mờ giả"**:
  - Máy chủ gửi **1–2 câu đầu** của phần bị khóa và số ý còn lại (ví dụ "còn 6 ý · 3 lời khuyên · 2 năm nổi bật").
  - Trình duyệt vẽ thêm 3–4 dòng **giả** làm mờ bên dưới, tức là thanh xám bo góc có chuyển màu, không phải chữ thật bị mờ. Cách này không lộ nội dung khi khách xem mã nguồn, vẫn giữ nguyên tắc `ttCatPhan_` cắt ở máy chủ.
  - Nút nằm ngay giữa vùng mờ.
  - Lời mồi nêu điều cụ thể ("Năm 2027 có 2 tháng thuận cho việc đổi chỗ làm"), không dọa.
- Công sức: M (máy chủ: thêm trường `moDau` vào các khối bị cắt; trình duyệt: một hàm `xemTruocHtml`).

**V5. Thiếu tín hiệu tin cậy ở luồng chính, có một tín hiệu không thật**
- Chỗ:
  - `camKetHtml` chỉ được gọi ở `renderKhach` (802) và ở lá cuối hành trình (4460).
  - `bangGiaHtml` 4812 ghi "Được chọn nhiều nhất" mà không có số liệu.
  - Giá gạch ngang (`goc`) là giá chưa từng bán.
- Đề xuất:
  - (1) Đưa **cam kết minh bạch** vào tab Tổng quan (khi còn khóa) và vào tấm xác nhận mua.
  - (2) Thêm **hoàn xu trong 7 ngày nếu thấy không đúng** cho phần mua đầu tiên. Xu là đơn vị nội bộ nên làm rẻ, mà tạo tin cao. Cần chủ dự án quyết.
  - (3) Chỉ dùng **số thật**, lấy từ sheet `DoiChieu`, ví dụ "X người đã kiểm chứng, Y% chấm Đúng/Đúng một phần". Ẩn câu này khi mẫu còn dưới khoảng 100 lượt.
  - (4) Thêm dòng: "Thanh toán VietQR qua ngân hàng – không lưu thẻ, xu cộng tự động", "Lá số của bạn không chia sẻ cho ai, xóa được trong Lịch sử", "Cần hỗ trợ: Zalo …".
  - (5) Bỏ "Được chọn nhiều nhất" cho đến khi có số liệu bán thật.
  - (6) Giá gạch ngang: về mặt pháp lý, quy định khuyến mại so mức giảm với giá bán **ngay trước** đợt khuyến mại (Nghị định 81/2018, đã sửa bởi Nghị định 128/2024 – cần đối chiếu văn bản gốc). Giá 149 chưa từng bán nên có rủi ro bị coi là gây hiểu lầm. Nên bỏ gạch ngang, hoặc ghi rõ "giá khai trương đến hết 31/1/2027", rồi thật sự lên giá sau ngày đó.
- Công sức: S–M.

**V6. Lời mời ở Cặp đôi còn ghi "%" và tiền đồng**
- Chỗ: `tinhTrangMua` `Script.html:1011` "Năm cưới & năm sinh con **kèm %**… – chỉ 19.000đ".
- Vấn đề: trái quyết định 24/10 (bỏ %, xác suất).
- Đề xuất: "Năm thuận cho cưới hỏi và tin vui, tài chính – công danh – gia đạo của hai bạn."
- Liên quan: còn chỗ hiện "%" ở `hsnHtml` 4665 (`x.p + '%'`), `dvsHtml` 4721, và trang ~6002. Báo cho người rà phần văn luận.
- Công sức: S.

**V7. Bỏ lỡ mùa cao điểm: Tết Đinh Mùi 2027**
- Chỗ: `chonNamHtml` 3966 đã cho chọn năm sau. Nhưng toàn bộ lời mời mặc định là năm đang xem 2026, mà năm 2026 chỉ còn khoảng 6 tuần.
- Đề xuất:
  - Từ giữa tháng 12, đặt sản phẩm chủ lực là **"Năm 2027 của bạn"** (vận năm 2027 + nhật vận tháng Giêng, hoặc Đồng hành 2027).
  - Thẻ mồi miễn phí "Năm 2027 trong một câu" cho mọi tài khoản.
  - Nhắc qua email/Zalo trước Tết cho người đã mua năm 2026, đây là nguồn thu định kỳ chủ dự án muốn giữ.
  - (Ngày Tết 2027 cần đối chiếu lịch, khoảng đầu tháng 2/2027.)
- Công sức: S–M.

### MỨC THẤP

- **T1. Mã cũ cho chế độ khách còn lời lỗi thời.**
  - Chỗ: `renderKhach` 796, `ctaHtml` 764, `moiVanKhachHtml` 773, `bangGiaHtml` 4807.
  - Lời lỗi thời: "Bản mở 19 xu: luận giải đầy đủ 6 hệ", "nạp xu để mở khóa", "Trọn gói" thay vì "Trọn đời".
  - Theo `lapLaSo` (`TaiKhoan.gs:154–172`), máy chủ không còn trả `khach: true`, nên các hàm này có vẻ không chạy nữa. Cần tìm trong mã (grep `khach`, `khachRutGon_`) để xác nhận, rồi xóa hoặc sửa lời cho khớp. Công sức: S.
- **T2. Gieo quẻ.** `gieo_que` đã miễn phí (`TT_MIEN_PHI`), nhưng thẻ vẫn ghi "Câu đầu tiên miễn phí", và `tiGieo` 4129 vẫn có nhánh "cần thêm xu". Nên thống nhất lời. Công sức: S.
- **T3. Lời chia sẻ.** `chiaSe` 449 nên đổi thành "…đọc miễn phí, thấy khá đúng. Bạn thử xem của bạn nhé:", bỏ phần "tặng 50 xu" để giữ quy tắc không nhắc tiền ở lời mời đầu. Công sức: S.
- **T4. Phối ngẫu phải mở Tổng hợp trước** (`ThanhToan.gs:306`). Nếu Tổng hợp miễn phí cho tài khoản (Phương án A) thì điều kiện này tự hết vướng. Công sức: S.

---

## 3. Hai phương án

### Phương án A – "Tài khoản là chìa khóa" (KHUYÊN DÙNG)
Ý chính: **bản mệnh miễn phí cho người có tài khoản; trả phí cho câu hỏi "khi nào"**. Quà xu không còn là lời mời.

| Tầng | Gồm | Giá đề xuất |
|---|---|---|
| **Khách** (chưa đăng nhập) | Lá số + luận giải 6 hệ; hành trình 7 lá có hỏi "đúng không?"; kiểm tra độ khớp 8 đoạn; bảng điểm 9 lĩnh vực + 1 lĩnh vực mạnh nhất; điểm 12 đại vận | 0 |
| **Tài khoản miễn phí** | Tất cả phần trên + **Tổng hợp 6 hệ đầy đủ** (mọi lá số mình lập) + **dò giờ sinh** (1–2 lần/ngày) + **1 đại vận đã qua tự chọn** để kiểm chứng + "Năm 2027 trong một câu" + lưu lá số + lời chào hằng ngày + PDF tóm tắt | 0 |
| **Lẻ** | Đại vận 9 · Vận năm 19 · Nhật vận tháng 9 · Biến cố 30 năm 19 · Phối ngẫu 9 · Cặp đôi 19/cặp · PDF đầy đủ 19 | giữ |
| **Gói "Năm của bạn"** | Đồng hành năm (vận năm + 12 tháng) | 39 (giữ) |
| **Trọn đời** | 12 đại vận + biến cố + phối ngẫu + PDF đầy đủ + vận năm đang xem | **79–99** (bỏ giá gạch ngang 149) |
| **Hội viên năm** (mới, định kỳ) | Đồng hành năm + bản tin tháng qua email + luận hằng ngày 12 tháng + ưu tiên hỗ trợ | **99/năm**, nhắc gia hạn trước Tết |
| **Gia đình** | Định nghĩa lại: mỗi lượt = **vận năm + Đồng hành** cho 1 người thân (vì Tổng hợp đã miễn phí) | 3 người 79 · 5 người 119 |
| **Quà xu** | Bỏ khỏi lời mời. Sau khi đăng ký, tặng nhỏ **9 xu** ("đủ mở 1 đại vận bạn chọn"), như quà bất ngờ; mỗi SĐT/email nhận một lần | 9 |

- Vì sao khuyên dùng:
  - (1) Đúng ý chủ dự án: lời mời chỉ còn "tạo tài khoản miễn phí, đọc miễn phí".
  - (2) Gần như không mất doanh thu, vì `co_ban` hiện đã được cho không qua quà 50 xu.
  - (3) Dồn giá trị trả phí vào "thời điểm", là thứ người dùng quay lại mua mỗi năm, mỗi tháng. Khớp nguyên tắc "bản mệnh bán 1 lần, vận hạn bán theo giai đoạn" đã ghi ở `Script.html:3929`.
  - (4) Tự đóng lỗ hổng tạo nhiều tài khoản lấy quà.
- Rủi ro: người đã mua `co_ban` hoặc `tron_goi` có thể thấy thiệt.
  - Bù: giữ nguyên quyền của họ; tặng họ 1 vận năm 2027 hoặc ghi tương đương thành xu vào ví (chủ dự án quyết).
  - Trọn đời tăng giá thì có thể có người phàn nàn. Thông báo trước 2 tuần "giá khai trương đến 31/1/2027".
- Công sức: M–L (máy chủ: `ttQuyen_` coi `co_ban`, `do_gio` và 1 `dv` đã qua là quyền của tài khoản; đổi `TT_PHAN_MAC_DINH`, `TT_TRON_GOI`, gói gia đình; tăng `TT_GIA_PHIEN`, `TT_KM_PHIEN`; trình duyệt: lời mời, tấm xác nhận, xem trước). Cần sửa `tests/thanh-toan.js`.
- Nhãn mức chắc chắn: khoảng 70%. Chưa có số liệu phễu, nên đây là phán đoán dựa trên cấu trúc giá và quyết định đã có. Mục 5 là cách kiểm chứng.

### Phương án B – "Giữ ví xu, sửa lời và vá lỗ"
Ý chính: không đổi mô hình, chỉ sửa chỗ hở và lời.

| Việc | Chi tiết |
|---|---|
| Quà | Giữ quà xu nhưng **không nhắc trong lời mời đầu**; báo sau khi đăng ký. Giảm về **29 xu** (đủ Tổng hợp 19 + 1 đại vận 9), không đủ Trọn đời |
| Trọn đời | Lên **69 xu**, bỏ gạch ngang 149 |
| Dò giờ | Miễn phí cho tài khoản (như C5) |
| Chặn lạm dụng | Mỗi SĐT/email nhận quà một lần |
| Mời / xác nhận | Đổi lời theo mục 4; luật mật độ (V1); tấm xác nhận (V2); xem trước (V4) |

- Ưu: ít đụng máy chủ (S–M), không ảnh hưởng người đã mua.
- Nhược:
  - Tổng hợp 6 hệ vẫn "phải tiêu xu", nên người dùng vẫn phải hiểu khái niệm xu ngay lần đầu, trái ý chủ dự án.
  - Gói gia đình và `co_ban` vẫn chồng chéo nhau.
  - Hệ thống quà vẫn còn dễ bị lợi dụng hơn Phương án A.

**Khuyên: Phương án A.** Có thể đi theo lối "B trước, A sau": đợt 1 sửa lời và lỗi (phần chung của cả hai), đợt 2 đổi mô hình quyền.

---

## 4. Luồng và lời mời đề xuất (áp cho cả hai phương án, theo Phương án A)

### 4a. Luồng
```
Trang chủ ──► Hành trình 4 câu hỏi ──► "Khởi quẻ" ──► 7 lá hé lộ
                                                        │  mỗi lá có [Đúng] [Một phần] [Chưa đúng]
                                                        ▼
                                   Lá cuối: "Bạn chấm 5/7 lá là đúng"
                         ┌──────────────┴───────────────┐
                 ≥ 4 lá đúng                       ≤ 3 lá đúng
     "Tạo tài khoản miễn phí để đọc        "Có thể giờ sinh chưa chuẩn – tạo tài khoản
      trọn Tổng hợp 6 hệ"                   miễn phí để dò lại giờ sinh"  (+ cam kết)
                         └──────────────┬───────────────┘
                             Hộp đăng ký 2 ô (SĐT/email + mật khẩu)
                                        ▼
         Ghi lại lá số đang xem → mở Tổng hợp → "Quà chào mừng: 9 xu đã vào ví,
         đủ mở 1 đại vận bạn chọn" → gợi ý "Kiểm chứng 1 đại vận đã qua (miễn phí)"
                                        ▼
           Tab Vận hạn: "Năm 2027 của bạn" → tấm xác nhận → (thiếu xu) nạp ngay trong tấm
```
Hai khoảnh khắc "trúng": (1) 7 lá + chấm đúng/sai, trong 60 giây đầu; (2) đại vận đã qua mở miễn phí sau khi đăng ký ("10 năm trước của bạn có khớp không?"). Dữ liệu chấm ghi ẩn danh vào `DoiChieu` (đã có).

### 4b. Lời của từng điểm mời
| Điểm | Ai thấy | Tiêu đề | Câu phụ | Nút |
|---|---|---|---|---|
| Poster trang chủ (thay `vePosterQua`) | Khách | Lá số 6 hệ của bạn – đọc miễn phí | Tử Vi, Bát Tự, Chiêm tinh, Thần số học, Human Design, Hà Lạc cùng nói về bạn. 1 phút để bắt đầu. | ✦ Bắt đầu xem |
| Lá cuối hành trình, ≥ 4 đúng | Khách | Phần lớn đã đúng – giờ sinh của bạn khá chuẩn | Bạn đã đọc riêng từng hệ. Phần Tổng hợp ghép cả 6 hệ thành kết luận cho 9 lĩnh vực đời bạn. | Tạo tài khoản miễn phí · Đọc tiếp luận giải 6 hệ |
| Lá cuối, ≤ 3 đúng | Khách | Chưa khớp lắm? Có thể giờ sinh lệch một chút | Tạo tài khoản miễn phí để dò lại giờ sinh qua những việc đã xảy ra. Nếu vẫn không khớp, chúng tôi sẽ nói thật. | Dò giờ sinh miễn phí |
| Tab Tổng quan (khóa) | Khách | Tổng hợp 6 hệ – khi cả 6 hệ cùng lên tiếng | [Lĩnh vực mạnh nhất hiện đầy đủ] + 8 lĩnh vực: câu mở đầu + vùng mờ | Đọc trọn – tạo tài khoản miễn phí |
| Thanh dưới (sau ~1,5 màn hình đọc) | Khách | Lưu lá số và đọc trọn Tổng hợp 6 hệ | Miễn phí · 30 giây | Tạo tài khoản |
| Hộp đăng ký | Khách | Tạo tài khoản miễn phí | Lá số đang xem được giữ nguyên. | Tạo tài khoản |
| Sau đăng ký (thông báo nhỏ) | Mới | Chào mừng [Tên] ✦ | Tổng hợp 6 hệ đã mở. Quà chào mừng: 9 xu đã vào ví – đủ mở 1 đại vận bạn chọn. | Kiểm chứng 10 năm đã qua |
| Tab Vận hạn đầu trang | Thành viên | Năm 2027 của bạn | Tháng nào nên tiến, tháng nào nên giữ – 3 hệ cùng xem. | Xem năm 2027 · 19 xu · (phụ) Cả năm kèm lịch từng ngày · 39 xu |
| Chip năm trong Tổng hợp | Thành viên | — | — | 🔒 Xem năm 2027 (giá hiện ở tấm xác nhận) |
| Tấm xác nhận | Thành viên | Mở "Vận năm 2027" cho lá số của [Tên] | Gồm: 12 tháng · hồ sơ biến cố năm · kế hoạch hành động. Mở vĩnh viễn. Số dư 12 xu → cần thêm 7 xu. | Mở ngay / Nạp 20.000đ và mở |
| Cặp đôi (khóa) | Thành viên | Luận hợp đôi đầy đủ | Năm thuận cho cưới hỏi và tin vui; tài chính – công danh – gia đạo của hai bạn. | Mở cho cặp này · 19 xu |

Giọng: theo quy tắc văn luận, không tên sao, không dọa, không %. Trước khi đưa lên, giao content-creator soạn lại lần cuối.

### 4c. Tín hiệu tin cậy (đặt ở tab Tổng quan và tấm xác nhận)
1. Cam kết minh bạch: "Kiểm tra độ khớp trước. Không khớp thì đừng mua."
2. "Mua lần đầu thấy không đúng → báo trong 7 ngày, hoàn lại xu" (cần chủ dự án quyết).
3. Số kiểm chứng thật từ `DoiChieu` (chỉ hiện khi mẫu ≥ ~100).
4. "Thanh toán VietQR qua ngân hàng, không lưu thẻ · xu cộng tự động sau vài giây."
5. "Lá số của bạn không chia sẻ cho ai · xóa được trong Lịch sử."
6. Kênh hỗ trợ Zalo/email của chủ dự án.

---

## 5. Chỉ số đo

Cần sheet `SuKien` (mục C6). Sự kiện tối thiểu: `lap_la_so` (khách/thành viên), `ht_xong` (xem hết 7 lá), `ht_cham` (số lá đúng), `nc_xong` (kiểm tra độ khớp), `mo_dang_ky` (kèm nguồn: poster/lá cuối/tab/thanh), `dang_ky_xong`, `mo_xac_nhan` (phần), `mua_xong` (phần, xu), `nap_xong` (tiền), `mo_lai_7n` (quay lại trong 7 ngày).

| Chỉ số | Công thức | Hiện tại | Mục tiêu 30 ngày sau đợt 2 (giả định, cần đo nền trước) |
|---|---|---|---|
| **Tỷ lệ đăng ký** (chính) | `dang_ky_xong` / khách `lap_la_so` (theo phiên) | Chưa đo được | Đo 2 tuần làm nền; mục tiêu tăng ≥ 1,5 lần so với nền |
| Hoàn tất form | `dang_ky_xong` / `mo_dang_ky` | Chưa đo | ≥ 60% |
| Khoảnh khắc trúng | % phiên `ht_xong` · % chấm ≥ 4/7 đúng | Chưa đo | ≥ 50% xem hết · theo dõi, không ép |
| **Tỷ lệ mua** (chính) | Tài khoản mới có ≥ 1 đơn `DA_TRA` trong 30 ngày / tài khoản mới | Có thể tính từ `DonHang` + `taoLuc` | Đo nền; mục tiêu tăng ≥ 1,5 lần |
| Mở xác nhận → mua | `mua_xong` / `mo_xac_nhan` | Chưa đo | ≥ 40% |
| Doanh thu trên mỗi người trả tiền | Tổng tiền `DA_TRA` / số người trả | Có trong Quản trị | Không giảm khi đổi mô hình |
| Định kỳ | % người mua năm 2026 mua tiếp năm 2027 trước 28/2/2027 | — | Theo dõi |
| Rào chắn | Số tài khoản trên mỗi SĐT/email · số yêu cầu hoàn xu · % chấm "Không đúng" | — | Không tăng |

- Cách so hai phương án: không nên chạy A/B ngẫu nhiên khi lượng khách còn nhỏ. Làm **trước/sau**: 2 tuần đo nền với bản hiện tại (đợt 0), rồi bật đợt 1, rồi bật đợt 2, mỗi giai đoạn tối thiểu 2 tuần. Ghi lại ngày bật vào `Lần dán lên Apps Script.md`.
- Mốc xem lại: 30 / 60 / 90 ngày sau khi bật đợt 2.
- Nếu tỷ lệ mua giảm quá 30% so với nền trong khi tỷ lệ đăng ký không tăng, thì quay về Phương án B.

---

## 6. Đề xuất chia đợt sửa

| Đợt | Việc | Công sức | Phụ thuộc |
|---|---|---|---|
| **0 – Đo** | Sheet `SuKien` + ghi sự kiện + thẻ "Phễu 7 ngày" trong Quản trị (C6) | M | Không |
| **1 – Sửa lời và lỗi** (chung A/B) | C2 đổi lời mời đầu, bỏ xu/tiền; C3 viết lại lời mồi; C4 lỗi "nạp 50.000đ"; V6 bỏ % ở Cặp đôi; V1 luật mật độ; T1 dọn mã khách cũ; T2, T3 | S–M | content-creator soạn lời; code-reviewer rà |
| **2 – Mô hình quyền** (Phương án A) | Tài khoản mở `co_ban` + `do_gio` + 1 đại vận đã qua; quà 9 xu một lần/liên hệ; Trọn đời 79–99; định nghĩa lại gia đình; Hội viên năm; tăng `TT_GIA_PHIEN`/`TT_KM_PHIEN`; sửa `tests/thanh-toan.js` | M–L | Chủ dự án duyệt giá và chính sách bù cho người đã mua |
| **3 – Trải nghiệm mua** | V2 tấm xác nhận + nạp trong tấm; V4 xem trước (đoạn mở đầu + vùng mờ giả); V3 form 2 ô; V5 tín hiệu tin cậy | M | ui-designer, frontend-developer |
| **4 – Mùa Tết** | V7 "Năm 2027 của bạn", nhắc gia hạn qua email/Zalo | S–M | Nên xong trước khoảng 20/12/2026 |

## 7. Câu hỏi cần chủ dự án quyết
1. Chọn Phương án A hay B, hay đi B trước rồi A sau?
2. Có cho **hoàn xu trong 7 ngày** với phần mua đầu tiên không?
3. Giá Trọn đời mới (79 hay 99) và cách bù cho người đã mua `co_ban`/`tron_goi`.
4. Có mở gói **Hội viên năm** (99 xu) không?
5. Có muốn giữ quà xu (9 xu sau đăng ký) hay bỏ hẳn?

Nguồn pháp lý tham khảo (cần đối chiếu văn bản gốc): [Giảm giá khuyến mại không vượt quá 50% – lsvn.vn](https://lsvn.vn/giam-gia-khuyen-mai-hang-hoa-dich-vu-khong-duoc-vuot-qua-50-gia-ban-a148560.html) · [Sửa hạn mức khuyến mại – lsvn.vn](https://lsvn.vn/sua-quy-dinh-han-muc-toi-da-ve-khuyen-mai-gia-tri-hang-hoa-dich-vu-1728689527-a148283.html) · [Nghị định 81/2018 – VCCI](https://vanban.vcci.com.vn/nghi-dinh-812018nd-cp-huong-dan-luat-thuong-mai-ve-hoat-dong-xuc-tien-thuong-mai)
