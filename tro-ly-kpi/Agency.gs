/**
 * AGENCY AGENTS – nhập "nhân vật chuyên gia" từ repo mã nguồn mở msitarzewski/agency-agents (giấy phép MIT)
 * vào Công ty Agent (sheet "Trợ lý – Công ty Agent", tab CacAgent) – không cần cài gì lên máy.
 *
 * An toàn chuỗi cung ứng:
 *  - Chỉ tải từ ĐÚNG một phiên bản đã được Claude đọc và rà soát (khóa theo mã commit AGENCY_COMMIT).
 *  - Mỗi tệp có dấu vân tay SHA-256; tải về không khớp → TỪ CHỐI nhập (phòng ai đó sửa repo/tệp).
 *  - Bỏ phần đầu (frontmatter) và các khối mã ví dụ; giới hạn độ dài để tiết kiệm chi phí.
 *  - Nhân vật chỉ là lời mô tả vai trò; quyền thật do cột CongCu quyết định. Phòng nào có tim_web
 *    thì không được cầm công cụ đọc dữ liệu nội bộ (xem docAgents_ trong Agents.gs).
 */

var AGENCY_REPO = 'msitarzewski/agency-agents';
var AGENCY_COMMIT = '652b2692f8d8ec2b1f1a38e559073e287dfdc469';
var AGENCY_TOI_DA = 12000;

/** [Ma, Ten, Goi, MoTa, CongCu, Bat mặc định, đường dẫn trong repo, SHA-256] */
var AGENCY_DANH_MUC = [
  ["ag_van_hanh", "Vận hành – Lean", "vh, lean, vận hành", "Cải tiến vận hành theo Lean/Six Sigma: tìm nút thắt, lãng phí, cân bằng năng lực, chuẩn hóa quy trình sản xuất, dùng số liệu KPI thật.", "tra_cuu, hieu_suat, so_tay_tim, bao_cao_sheet", "Có", "specialized/operations-manager.md", "3c133a31ae1542922444d77d7c8f9964127704ba94638dde12e37a9ad0fd35bd"],
  ["ag_cung_ung", "Cung ứng – Mua hàng", "cu, mua hàng, cung ứng", "Chiến lược mua hàng và nhà cung cấp: ống carbon, nhựa, keo, sơn, phụ kiện; đánh giá, đàm phán, đa dạng nguồn, rủi ro chuỗi cung ứng, tồn kho.", "so_tay_tim, tim_web", "Có", "specialized/supply-chain-strategist.md", "7f3b40f03828748e47923d35c6c0efc69c84b6652053952d0c6d2eb601ce6ec3"],
  ["ag_dinh_gia", "Định giá – Báo giá", "giá, định giá, báo giá", "Lập giá bán/báo giá OEM, phân tích chi phí – biên lợi nhuận, so sánh giá đối thủ, chiến lược giá theo thị trường.", "so_tay_tim, tim_web", "Có", "specialized/specialized-pricing-analyst.md", "fb8a63681615666bb2efe45b7fd2d9ad8a072ab9066efae6b61d454a58039f85"],
  ["ag_chien_luoc", "Chiến lược kinh doanh", "cl, chiến lược", "Chiến lược công ty: phân tích đối thủ, thị trường mới, mô hình kinh doanh, kế hoạch tăng trưởng, SWOT.", "so_tay_tim, tim_web", "Có", "specialized/business-strategist.md", "9314906805d8dee81c3e2d10cb93513a391731d9fceb2e4c936257005a144b92"],
  ["ag_tuyen_dung", "Tuyển dụng", "td, tuyển dụng", "Quy trình tuyển dụng: mô tả công việc, kênh tuyển, câu hỏi phỏng vấn, đánh giá ứng viên, giữ chân công nhân.", "so_tay_tim", "Có", "specialized/recruitment-specialist.md", "dfd01aa152324f2120b7c7b8d3c76e991065c0a38f03c0fb43d3d1db0f7bd529"],
  ["ag_dao_tao", "Đào tạo nội bộ", "đt, đào tạo", "Thiết kế chương trình đào tạo: tay nghề công nhân, an toàn lao động, tổ trưởng; giáo trình, bài kiểm tra, lộ trình.", "so_tay_tim", "Có", "specialized/corporate-training-designer.md", "e70733229e87dde01bd404f502d2f5b491821f681d7230b314b18d98111b898c"],
  ["ag_bien_ban", "Biên bản họp", "bb, biên bản, họp", "Biến ghi chép họp thành biên bản: quyết định, việc cần làm (ai – hạn), câu hỏi còn mở; ghi việc vào Sổ tay.", "so_tay_tim, so_tay_ghi", "Có", "project-management/project-management-meeting-notes-specialist.md", "53a6efaa379b70cbc3276b44544ecf569789fffe892ba82eb68e8672407de91f"],
  ["ag_tom_tat", "Tóm tắt điều hành", "tóm tắt, tt điều hành", "Tóm tắt kiểu tư vấn chiến lược cho ban giám đốc: tình hình – vấn đề – khuyến nghị, dựa trên số liệu sản xuất.", "tra_cuu, hieu_suat, so_tay_tim", "Có", "support/support-executive-summary-generator.md", "298891fcf297de5d9b343e9ab9b63864317de63256b15c0c72e6cec172f8f0ff"],
  ["ag_xu_huong", "Nghiên cứu xu hướng", "xu hướng, thị trường", "Nghiên cứu xu hướng thị trường bi-a và đồ thể thao: sản phẩm mới, vật liệu, nhu cầu khách, cơ hội.", "so_tay_tim, tim_web", "Không", "product/product-trend-researcher.md", "69c8e54a9413ba411195e8d5274ee3cd88fa8cda18486db70c0f19ce374550a2"],
  ["ag_bien_dich", "Biên dịch", "dịch, biên dịch", "Dịch thư, hợp đồng, tài liệu kỹ thuật Anh/Trung/Tây Ban Nha ↔ Việt, giữ đúng thuật ngữ và văn phong thương mại.", "so_tay_tim", "Không", "specialized/language-translator.md", "afd1e4b5fb1bb8fa9b8b5770774e0d7b003722681f664147ce7b9dddbcd52a4c"],
  ["ag_cskh", "Chăm sóc khách hàng", "cskh, khách hàng", "Soạn trả lời khách: hỏi hàng, khiếu nại chất lượng, đổi trả, theo dõi đơn; giọng lịch sự, chuyên nghiệp.", "so_tay_tim", "Không", "specialized/customer-service.md", "71d5b8ccd6fb6c5861230169a708ec5d8c0af628de44fc293ae256181573424f"],
  ["ag_chao_hang", "Hồ sơ chào hàng OEM", "chào hàng, proposal, hồ sơ năng lực", "Soạn hồ sơ năng lực, thư chào hàng, đề xuất OEM cho thương hiệu nước ngoài; trả lời RFQ/RFP.", "so_tay_tim", "Không", "sales/sales-proposal-strategist.md", "84c42e0ae7e11e6b239b7f921bdb0c33398102f94998c2eaa41114a3a46dc4c9"],
  ["ag_khach_lon", "Quản lý khách hàng lớn", "klớn, khách lớn", "Chăm sóc và mở rộng khách hàng OEM lớn: kế hoạch tài khoản, họp đánh giá định kỳ, rủi ro mất khách.", "so_tay_tim", "Không", "sales/sales-account-strategist.md", "dd9b2c37c41827286ef91d64057a5b0ff4795c2e57bd44695436feeb5a3f0423"],
  ["ag_hoi_nhap", "Hội nhập nhân viên mới", "hội nhập, nhân viên mới", "Quy trình đón nhân viên mới: hồ sơ, hướng dẫn tuần đầu, kèm cặp, kiểm tra sau 30–60–90 ngày.", "so_tay_tim", "Không", "specialized/hr-onboarding.md", "28a52c26f27ab24d7fe11f5e48cfe712f6d27da142ec97911683b4a3ad92332c"],
  ["ag_cai_tien", "Cải tiến quy trình", "ct, cải tiến", "Phân tích và tự động hóa quy trình làm việc (giấy tờ, phê duyệt, báo cáo), tìm bước thừa, đề xuất công cụ.", "so_tay_tim", "Không", "testing/testing-workflow-optimizer.md", "f0e4558147a6114fdcd1b523153b02212b4e2cc6900b6197d19db78e9be3d375"],
  ["ag_thuong_hieu", "Thương hiệu", "th, thương hiệu", "Xây dựng và giữ nhất quán thương hiệu: định vị, thông điệp, nhận diện, kiểm tra nội dung trước khi đăng.", "so_tay_tim", "Không", "design/design-brand-guardian.md", "d1d5c78af85d4d35be94b93d5c011d17e3cf5dcb69b2037a3ebf3059803b893e"],
  ["ag_tmdt", "Bán hàng xuyên biên giới", "tmđt, amazon, xuất khẩu online", "Bán lẻ cơ bi-a ra nước ngoài qua Amazon, Shopee, Lazada, TikTok Shop: sàn, giá, vận chuyển, quảng cáo.", "so_tay_tim, tim_web", "Không", "marketing/marketing-cross-border-ecommerce.md", "073dba84e8159c763c073fcf16f14d57685611c50555a7cde346df85a25c6293"],
  ["ag_esg", "ESG – Bền vững", "esg, bền vững", "Báo cáo môi trường – xã hội – quản trị (ESG) mà khách châu Âu/Mỹ hay yêu cầu: chính sách, số liệu, lộ trình.", "so_tay_tim, tim_web", "Không", "specialized/esg-sustainability-officer.md", "a8feee4c7b9687ee89ec5ea0879ff98b4cc4451431052369bf00f90d9382b7dd"],
  ["ag_phap_che", "Pháp chế – Tuân thủ", "pháp chế, tuân thủ", "Rà soát tuân thủ: hợp đồng, quy định xuất khẩu, lao động, dữ liệu cá nhân (Nghị định 13/2023); chỉ để tham khảo, không thay luật sư.", "so_tay_tim, tim_web", "Không", "support/support-legal-compliance-checker.md", "08d938c5666e41b3cf197c2f7b37070d7f39aca62b7147d157200eb6dbeeced6"],
  ["ag_tai_chinh", "Phân tích tài chính", "tc, tài chính", "Mô hình chi phí – lợi nhuận, dự báo, phân tích phương án đầu tư máy móc, điểm hòa vốn.", "so_tay_tim", "Không", "finance/finance-financial-analyst.md", "3547907cd52e6108a4c666fd576d5e42715ac337586a3958a722deee4c1f77bb"],
  ["ag_bao_mat_dl", "Bảo vệ dữ liệu cá nhân", "dữ liệu cá nhân, ndl", "Chương trình bảo vệ dữ liệu cá nhân của công nhân và khách hàng theo Nghị định 13/2023 và GDPR.", "so_tay_tim", "Không", "specialized/data-privacy-officer.md", "77e495853a6ef839c8a2f87dae1c8de7b41e11d5e187828fa42c1d9a1e1ae00f"],
  ["ag_chanh_vp", "Chánh văn phòng", "cvp, chánh văn phòng", "Điều phối công việc của lãnh đạo: lọc việc, theo dõi cam kết, chuẩn bị họp, nhắc người liên quan.", "so_tay_tim, so_tay_ghi, lich_xem", "Không", "specialized/specialized-chief-of-staff.md", "c0d053f19f32d369b6e9a4ded3a3b93efd792648b88b28f0ecd37a899b91b7b3"]
];

/**
 * Nhập các nhân vật vào tab CacAgent. dsMa: mảng mã muốn nhập (bỏ trống = cả danh mục).
 * Phòng đã có (trùng Ma) thì giữ nguyên – không ghi đè chỉnh sửa của chủ dự án.
 * Trả về báo cáo ngắn. Chạy được từ trình soạn thảo (hàm nhapAgency) hoặc từ web app.
 */
function nhapAgency(dsMa) {
  var ss = typeof agSS_ === 'function' ? agSS_() : null;
  if (!ss) throw new Error('Chưa cài Công ty Agent (chạy caiDatAgent trước).');
  var sh = ss.getSheetByName('CacAgent'), b = bang_('CacAgent', ss), co = {};
  b.rows.forEach(function (r) { co[String(r[b.c.Ma]).trim()] = 1; });
  var chon = AGENCY_DANH_MUC.filter(function (d) { return !dsMa || !dsMa.length || dsMa.indexOf(d[0]) >= 0; });
  var them = [], bo = [], loi = [];
  chon.forEach(function (d) {
    if (co[d[0]]) { bo.push(d[1]); return; }
    try {
      var vaiTro = taiNhanVat_(d);
      sh.appendRow([d[0], d[1], d[2], d[3], vaiTro, d[4], '', '', d[5]]);
      them.push(d[1] + (d[5] === 'Có' ? '' : ' (đang tắt)'));
    } catch (e) { loi.push(d[1] + ': ' + (e && e.message || e)); }
  });
  CacheService.getScriptCache().remove('agents');
  var kq = 'NHẬP AGENCY AGENTS (phiên bản ' + AGENCY_COMMIT.slice(0, 7) + ')' +
    (them.length ? '\n- Đã thêm ' + them.length + ': ' + them.join(', ') : '') +
    (bo.length ? '\n- Đã có sẵn, giữ nguyên: ' + bo.join(', ') : '') +
    (loi.length ? '\n- LỖI (không nhập): ' + loi.join(' | ') : '') +
    '\n\nBật/tắt phòng: cột Bat trong tab CacAgent hoặc trong web app.';
  Logger.log(kq);
  return kq;
}

/** Tải 1 nhân vật từ phiên bản đã khóa, kiểm tra SHA-256, rút gọn, bọc lời dặn tiếng Việt. */
function taiNhanVat_(d) {
  var url = 'https://raw.githubusercontent.com/' + AGENCY_REPO + '/' + AGENCY_COMMIT + '/' + d[6];
  var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('không tải được (HTTP ' + r.getResponseCode() + ')');
  var hex = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, r.getContent())
    .map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
  if (hex !== d[7]) throw new Error('dấu vân tay không khớp – tệp đã bị thay đổi, từ chối nhập');
  return boiNhanVat_(d, r.getContentText());
}

function boiNhanVat_(d, md) {
  var than = String(md).replace(/^---[\s\S]*?\n---\s*\n/, '')          // bỏ frontmatter (tên công cụ của Claude Code…)
    .replace(/```[\s\S]*?```/g, '')                                   // bỏ khối mã ví dụ
    .replace(/\n{3,}/g, '\n\n').trim();
  if (than.length > AGENCY_TOI_DA) than = than.slice(0, AGENCY_TOI_DA) + '\n…(rút gọn)';
  return 'Bạn đóng vai chuyên gia "' + d[1] + '" theo bản mô tả gốc tiếng Anh bên dưới (nguồn: ' + AGENCY_REPO + ', MIT). ' +
    'Áp dụng vào bối cảnh một nhà máy sản xuất cơ (gậy) bi-a ở Việt Nam, quy mô khoảng 200 công nhân, làm OEM và xuất khẩu. ' +
    'Luôn trả lời bằng tiếng Việt, cụ thể, làm được ngay; bỏ qua phần nào của bản mô tả không hợp bối cảnh ' +
    '(ví dụ nền tảng chỉ có ở nước khác, công cụ lập trình bạn không có). Chỉ dùng công cụ bạn được cấp.\n\n' +
    '=== MÔ TẢ VAI TRÒ (gốc) ===\n' + than;
}

/** Danh mục cho web app: có/chưa nhập, đang bật/tắt. */
function danhMucAgency_() {
  var ss = typeof agSS_ === 'function' ? agSS_() : null, co = {};
  if (ss) {
    var b = bang_('CacAgent', ss);
    b.rows.forEach(function (r) { co[String(r[b.c.Ma]).trim()] = String(r[b.c.Bat]).trim() || 'Có'; });
  }
  return AGENCY_DANH_MUC.map(function (d) {
    return { ma: d[0], ten: d[1], moTa: d[3], congCu: d[4], nguon: d[6], daNhap: !!co[d[0]], bat: co[d[0]] || '' };
  });
}
