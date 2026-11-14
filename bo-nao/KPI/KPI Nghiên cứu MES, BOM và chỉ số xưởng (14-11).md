# KPI Nghiên cứu MES, BOM và chỉ số xưởng (14-11)

Liên quan: [[KPI Học hỏi ERPNext (16-11)]] · [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Phân tích định mức]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Việc 1 của phiên (chủ dự án muốn tìm hiểu thêm, chưa sửa code). Claude tải thưa (`git clone --depth 1 --filter=blob:none --sparse`) `qcadoo/mes` và `frappe/erpnext`, chỉ đọc file định nghĩa (model XML / doctype JSON) và báo cáo.

## 1. qcadoo MES – lệnh theo công đoạn, báo hỏng tại công đoạn
**Cấu trúc**: Lệnh sản xuất (`orders/order.xml`: SL kế hoạch, SL xong, **wastesQuantity**, deadline, ngày bắt đầu/kết thúc dự kiến – thực tế – đã chỉnh, lý do lệch ngày) → Công nghệ = cây công đoạn (`technologyOperationComponent`: cha/con, bộ phận `division`, máy) → **Báo cáo sản xuất** (`productionTracking`).
- Mỗi lệnh chọn 1 trong 3 kiểu ghi: **cơ bản** (gõ tay SL xong), **gộp** (1 báo cáo cả lệnh), **từng công đoạn** (mỗi công đoạn tự xác nhận).
- Mỗi báo cáo: công đoạn, ca, ngày ca, người (`staff`), máy, bộ phận, giờ từ–đến, giờ máy, giờ công, trạng thái (nháp → chấp nhận / từ chối / **đính chính** – sửa bằng báo cáo đính chính, không sửa đè).
- Mỗi sản phẩm ra: SL dùng được + **SL hỏng (Deficiency = "sản phẩm không dùng tiếp được")** + **nguyên nhân hỏng** + **thiếu (lack) kèm nhiều lý do**.
- **Bất thường (anomaly)**: phiếu riêng khi thiếu / hỏng → nhiều lý do (danh mục) → giải trình → hoàn tất (nháp → đã giải trình → xong).
- Báo hỏng theo **quy trình kỹ thuật** (`orderTechnologicalProcessWaste`): SL hỏng, ngày, người, mô tả – gắn đúng công đoạn của lệnh.
- **Danh mục loại lỗi** (`faultType`) gắn theo máy / loại máy; dừng máy (`stoppage`: lý do hỏng máy / khác, từ–đến, thời lượng).

**Đối chiếu web KPI**: đã có lệnh = dòng mã trong Sheet đơn, công đoạn = 7 bộ phận (Phôi → … → Đóng gói), báo tiến độ = số đã qua + hẹn từng bộ phận, hỏng = cột "Hỏng cần làm bù" (chỉ SL, không lý do, không ngày – từ 16/11 có ngày nhờ bản chụp 9h → `DonHangHong`).
- **Nên thêm (nhỏ)**: **nguyên nhân hỏng chọn từ danh mục ngắn** (5–7 lý do do TP chốt, vd. nứt/xước sơn/lệch tâm/keo/kích thước/khác) khi TP ghi hỏng → làm được Pareto lỗi theo nguyên nhân. Ai ghi + lúc nào: lấy từ tài khoản + giờ ghi.
- **Không hợp**: báo cáo từng ca / giờ máy / dừng máy (A3 đã chốt không làm); phiếu bất thường nhiều bước (nặng cho xưởng); đính chính kiểu kế toán.

## 2. ERPNext – định mức nguyên vật liệu (BOM)
- **BOM** (`bom.json`): theo 1 mã hàng, SL làm ra, dòng vật tư (`bom_item`: mã, SL, đơn vị, hệ số quy đổi, công đoạn dùng, **bom_no** = BOM con, cờ bán thành phẩm, không bung `do_not_explode`, **cho phép vật tư thay thế**), **hao hụt quy trình % (process_loss_percentage)**, phụ phẩm / phế liệu (`bom_secondary_item`, trước gọi scrap: SL, % hao hụt), giá vật tư (theo giá nhập / định giá), mặc định / đang dùng.
- **BOM nhiều cấp**: dòng vật tư trỏ tới BOM của bán thành phẩm; **bảng bung (exploded_items)** cộng dồn tới vật tư gốc. Gậy mình: gậy = chuôi (BOM con) + ngọn (BOM con) + phụ kiện.
- **Vật tư thay thế** (`item_alternative`: mã → mã thay, 2 chiều).
- **Cập nhật hàng loạt** (`bom_update_tool` + `bom_update_log`): thay 1 BOM con bằng BOM mới trong mọi BOM cha, cập nhật giá mới nhất; chạy theo lô, ghi nhật ký.
- **BOM Creator**: dựng cây BOM trên 1 màn (nút cha–con, SL, mã vật tư), bấm tạo ra tất cả BOM con. Có phiên bản (revision).
- **MRP** (`material_requirements_planning_report`): nhu cầu = đơn mở chưa giao × BOM bung; trừ tồn, hàng đang mua / đang làm, tồn an toàn, SL đặt tối thiểu, thời gian chờ → ngày đặt.
- **BOM variance** (`bom_variance_report`): theo lệnh sản xuất – SL đặt / SL làm, từng vật tư **SL cần theo định mức vs SL đã xuất dùng**, có trừ % hao hụt kế hoạch. Process Loss Report: hao hụt từng lệnh.

**Đối chiếu web KPI**: chưa có BOM vật tư (chỉ có "bán thành phẩm từng mã" `BTPTheoSKU` = BOM cấp công đoạn, và định mức **giờ công**). **Chờ dữ liệu vật tư** của chủ dự án.
- **Nên làm khi có dữ liệu (lộ trình chuyên gia 16/11)**: BOM **theo nhóm SKU** (loại × chất liệu chuôi/ngọn), 5–8 vật tư chính, 2 cấp (chuôi, ngọn → gậy), % hao hụt mỗi vật tư; nhu cầu vật tư = đơn mở × BOM (MRP rút gọn, không tồn kho nhiều vị trí); so định mức vs số xuất kho tháng (variance theo tháng, không theo lệnh).
- **Không hợp**: giá / kế toán, kho nhiều vị trí, lô / serial, BOM Creator dạng thiết kế (quá nặng), cập nhật hàng loạt (ít BOM nhóm thì sửa thẳng trên bảng).

## 3. Chỉ số xưởng thường dùng – web đã có / nên thêm / không hợp
| Chỉ số | Là gì – cách tính | Web KPI |
|---|---|---|
| OEE | Sẵn sàng × Hiệu suất × Chất lượng (máy) | **Không hợp** – cần giờ dừng máy (A3 không làm); xưởng chủ yếu thủ công |
| FPY (đạt lần đầu) | SL qua công đoạn không hỏng ÷ SL vào; RTY = tích FPY các công đoạn | **Nên thêm** – có từ 16/11: 1 − hỏng phát sinh ÷ SL giao từng bộ phận; RTY cả luồng chuôi / ngọn |
| Tỷ lệ hỏng + Pareto lỗi | Hỏng ÷ SL; cột giảm dần + đường cộng dồn 80% | Có Pareto **trễ**; **nên thêm** Pareto **hỏng** theo bộ phận × dòng × chất liệu (phần 1 ERPNext), theo nguyên nhân khi có danh mục |
| OTD giao đúng hạn | Dòng / đơn giao ≤ deadline ÷ tổng giao | **Đã có** (OTD theo tuần, `dhSvgOTD`) |
| WIP | SL đang làm dở giữa các bộ phận | **Đã có** (Chi tiết công đoạn "sp đang chờ", Vào – Ra – Tồn) |
| Lead time | Ngày đặt → ngày xong; Little: lead ≈ WIP ÷ nhịp ra | **Đã có** (Số ngày hàng tồn, aging); có thể thêm phân bố lead time đơn xong (tab HT) |
| Takt time | Thời gian có ÷ nhu cầu (sp/ngày cần) | **Đã có** dạng "nhịp cần" (Nút cổ chai, Quy trình) |
| Năng suất / công | SP ÷ giờ công (hoặc ÷ người) | **Đã có** ở KPI công nhân / tổng quan xưởng |
| Tải công suất | Công cần ÷ công có; > 85% vàng, > 100% đỏ | Có Công suất & deadline, năng lực; **nên thêm** theo tuần tới (gắn dự báo – phần 3 ERPNext) |
| CFD | Cộng dồn vào / ra theo ngày; khoảng giữa = WIP | **Đã có** (`dhSvgCFD`) |
| Aging | Tuổi hàng đang làm theo nhóm ngày | **Đã có** (`dhSvgAging`) |
| I-MR / SPC | Biểu đồ kiểm soát biến động hằng ngày | **Đã có** (`dhSvgIMR` Đóng gói) |
| Schedule adherence | Bộ phận giao đúng hạn chuẩn ÷ tổng | **Nên thêm** cùng phần 2 (hạn chuẩn) |
| COPQ | Chi phí hàng hỏng: giờ công làm lại × đơn giá | Phần 1 ERPNext (quy ra giờ công) |

## Đề xuất (chờ chủ dự án chọn)
1. **(Khuyến nghị) Làm phần 2 hạn chuẩn ngay**, kèm chỉ số "bộ phận giao đúng hạn chuẩn %" – dữ liệu đã có.
2. Khi `DonHangHong` đủ ~1 tháng: phần 1 báo cáo hỏng + **FPY / RTY** + Pareto hỏng; thêm **ô chọn nguyên nhân hỏng** (5–7 lý do) – cần TP chốt danh mục.
3. BOM theo nhóm SKU + nhu cầu vật tư – chờ dữ liệu vật tư.
