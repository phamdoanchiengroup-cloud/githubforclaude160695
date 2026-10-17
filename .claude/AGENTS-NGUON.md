# Vai chuyên gia cho Claude Code (lấy từ Agency Agents)

Nguồn: https://github.com/msitarzewski/agency-agents (giấy phép MIT – xem `.claude/LICENSE-agency-agents`); các vai nằm trong `.claude/agents/`, bản commit 652b269, chép 17/10.
Chỉ đổi dòng `name:` sang tên tiếng Việt không dấu; nội dung giữ nguyên. Các file này chỉ là hướng dẫn cho Claude,
KHÔNG liên quan tới web KPI đang chạy trên Apps Script (không cần dán lên Apps Script).

| Nhóm | Vai | File gốc |
|---|---|---|
| 1. Bảo mật | `bao-mat-ma-ai`, `bao-mat-ung-dung` | security-ai-generated-code-auditor, security-appsec-engineer |
| 2. Vận hành / KPI | `quan-ly-van-hanh` | specialized/operations-manager |
| 3. Dễ dùng cho công nhân | `kiem-tra-de-dung`, `dong-vai-nguoi-dung`, `soat-giao-dien-cuoi` | testing-accessibility-auditor, design-persona-walkthrough, design-ui-finish-gate-reviewer |
| 4. Nhắc nhở – động viên | `nhac-nho-dong-vien` | product-behavioral-nudge-engine |
| 5. Đào tạo – hội nhập | `thiet-ke-dao-tao`, `hoi-nhap-nhan-su` | corporate-training-designer, hr-onboarding |
