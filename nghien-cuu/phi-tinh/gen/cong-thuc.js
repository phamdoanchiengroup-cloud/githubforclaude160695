
/* ------------------------------------------------------------------------------------------------------------------------------------
 * Công thức bổ sung (1/11/2026) – chỉ những mục chuyên gia nghiên cứu xác nhận mức cao (xem nghien-cuu/phi-tinh/cong-thuc-bo-sung.md).
 * Chưa đưa vào (nguồn thấp/không có): điểm xí hoa, cung khí theo hỉ kỵ thần, Thiên–Địa–Nhân của can, Tài thiên/địa/nhân,
 * Phá thể, "Dương phi nhập Âm". Tuyệt mệnh Kỵ không hiển thị (quy tắc không đoán chết, bệnh).
 * ---------------------------------------------------------------------------------------------------------------------------------- */
/** Mệnh tháng (lưu nguyệt) theo Đẩu quân: Đẩu quân năm y = chi năm − (tháng sinh − 1) + chi giờ sinh = tháng Giêng; tháng n đi thuận.
 *  Can dùng cho Tứ Hóa tháng = can cung nguyên cục nơi Mệnh tháng đóng (cách của phái Tứ Hóa). Tháng sinh nhuận tính theo số tháng. */
function ptMenhThang_(tv, y, n) {
  var I = tv.info, chiNam = ((y + 8) % 12 + 12) % 12;
  var dq = ((chiNam - (I.thangAn - 1) + I.hourChi) % 12 + 12) % 12, o = (dq + n - 1) % 12;
  return { o: o, can: tv.palaces[o].can, dauQuan: dq };
}
/** Nghịch thủy Kỵ (≥4 nguồn): Mệnh, Tài Bạch hoặc Quan Lộc phi Kỵ sang cung đối, cung đối có Kỵ năm sinh và không tự hóa.
 *  Thuận thủy Kỵ (mức trung bình – có lẽ là tên khác của Lưu thủy Kỵ): phi Kỵ sang cung khác, không phải cung đối. */
var PT_THUY_ = {
  nghich: function (N, i) {
    var k = N.phi[i][3].toi;
    return ['Mệnh', 'Tài Bạch', 'Quan Lộc'].indexOf(N.ten[i]) >= 0 && k === ptD_(i) && N.sn[3].toi === k && !N.tuHoa.some(function (t) { return t.o === k; });
  },
  thuan: function (N, i) { var k = N.phi[i][3].toi; return k != null && k !== i && k !== ptD_(i); }
};
