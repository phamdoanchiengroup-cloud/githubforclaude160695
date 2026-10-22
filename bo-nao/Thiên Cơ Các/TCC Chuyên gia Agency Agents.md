# TCC Chuyên gia Agency Agents

Liên quan: [[TCC Kiểm thử]] · [[TCC Giao diện]] · [[TCC Bán hàng]] · [[00 Mục lục]]

Nhóm: Thiên Cơ Các · Tạo 22/10/2026

## Nguồn
- Repo GitHub `msitarzewski/agency-agents` (giấy phép MIT, bản commit `4e3ac3c` ngày 19/10/2026) – khoảng 300 "chuyên gia" (subagent) cho Claude Code.
- Chủ dự án (22/10) yêu cầu tải về và đưa vào dự án. Chỉ chọn **25 chuyên gia hợp với Thiên Cơ Các** (chép cả bộ sẽ làm danh sách trợ lý rối và tốn ngữ cảnh); đã đọc lướt từng file, không có lệnh tải ngầm hay chỉ dẫn lạ.
- Đặt ở `.claude/agents/` (Claude Code tự nạp khi mở repo). Đổi `name:` sang dạng chữ thường nối gạch; cuối mỗi file thêm mục "Bối cảnh Thiên Cơ Các" (tiếng Việt, đọc CLAUDE.md, bảo mật, chạy kiểm thử). Giấy phép gốc: `.claude/agents/LICENSE-agency-agents.txt`.

## Danh sách (tên để gọi → việc nên giao)
- **Thiết kế:** `ui-designer` (hệ thống giao diện, Bạch Kim) · `ux-architect` (bố cục, luồng người dùng) · `brand-guardian` (giọng thương hiệu Thiên Cơ Các) · `visual-storyteller` (kể chuyện bằng hình, trang bìa, PDF).
- **Kỹ thuật:** `frontend-developer` (Script/Styles/Index) · `code-reviewer` (rà lỗi trước khi đẩy) · `minimal-change-engineer` (sửa đúng chỗ, không lan) · `payments-billing-engineer` (payOS, xu, đơn hàng) · `pdf-engine-architect` (báo cáo PDF) · `technical-writer` (hướng dẫn cài đặt) · `prompt-engineer` (nếu làm trợ lý AI luận giải).
- **Tiếp thị – bán hàng:** `content-creator` · `growth-hacker` (phễu, mời bạn, quà đăng ký) · `seo-specialist` · `tiktok-strategist` · `social-media-strategist` · `offer-lead-gen-strategist` (gói giá, ưu đãi, bản xem thử).
- **Sản phẩm:** `product-manager` · `feedback-synthesizer` (tổng hợp góp ý khách) · `behavioral-nudge-engine` (nhắc nhở, email hằng ngày).
- **Kiểm thử:** `reality-checker` (mặc định "chưa đạt" cho tới khi có bằng chứng) · `evidence-collector` (chụp màn hình làm bằng chứng) · `accessibility-auditor` (dễ dùng cho người lớn tuổi, điện thoại).
- **Khác:** `legal-compliance-checker` (điều khoản, dữ liệu cá nhân, thanh toán) · `personal-growth-mentor` (giọng văn lời khuyên tầng 2).

## Đã dùng
- 23/10: ui-designer, ux-architect, accessibility-auditor, growth-hacker (+ offer-lead-gen-strategist) tư vấn thiết kế lại web – xem [[TCC Giao diện]] mục 23/10.

## Cách dùng
- Trong phiên Claude Code: nói "dùng chuyên gia `ui-designer` xem lại tab Tổng quan" hoặc "nhờ `reality-checker` kiểm tra bản PDF". Claude sẽ giao việc cho chuyên gia đó (chạy như trợ lý con).
- Phiên mới đọc lại danh sách ở ghi chú này; muốn thêm chuyên gia khác từ repo gốc thì tải file `.md` tương ứng, đổi `name:`, thêm mục bối cảnh, ghi vào đây.
