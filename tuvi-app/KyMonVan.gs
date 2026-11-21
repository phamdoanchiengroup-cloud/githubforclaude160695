/**
 * ============================================================
 *  KyMonVan.gs — KỲ MÔN ĐỘN GIÁP: VĂN LUẬN "HỎI MỘT VIỆC"
 *  Chỉ có bảng văn + một hàm ghép kmVanLuan_(ban, loai, muc, danhGia).
 *  Phần chấm (chọn mức, dụng thần, lý do) do KyMon.gs lo; file này chỉ đọc kết quả.
 *  Khung 3 tầng (nghien-cuu/ky-mon/00-de-xuat.md §5):
 *    - ketLuan: lời đời thường, KHÔNG tên sao / cửa / thần, không chữ Hán;
 *    - canCu:   được nêu thuật ngữ, mỗi thuật ngữ kèm nghĩa trong ngoặc;
 *    - viec:    3 việc nên làm, mỗi việc có giờ và hướng;
 *    - luuY:    lời lưu ý cố định (+ bác sĩ / luật sư / chuyên môn tài chính).
 *  Không dùng số phần trăm, không phán đoán số phận, không khẳng định tuyệt đối.
 *  Văn được ghép từ tín hiệu của bàn nên mỗi bàn ra một bài khác nhau.
 * ============================================================
 */

/* ---------- Tên theo thứ tự chỉ số (trùng thứ tự KM_SAO, KM_MON, KM_THAN trong KyMon.gs) ---------- */
var KMV_SAO_TEN_ = ['Thiên Bồng', 'Thiên Nhuế', 'Thiên Xung', 'Thiên Phụ', 'Thiên Cầm', 'Thiên Tâm', 'Thiên Trụ', 'Thiên Nhậm', 'Thiên Anh'];
var KMV_MON_TEN_ = ['Hưu', 'Sinh', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai'];
var KMV_THAN_TEN_ = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên'];
var KMV_HUONG_ = { 1: 'Bắc', 2: 'Tây Nam', 3: 'Đông', 4: 'Đông Nam', 5: 'Tây Nam', 6: 'Tây Bắc', 7: 'Tây', 8: 'Đông Bắc', 9: 'Nam' };
var KMV_GIO_ = ['Tý (23–1h)', 'Sửu (1–3h)', 'Dần (3–5h)', 'Mão (5–7h)', 'Thìn (7–9h)', 'Tỵ (9–11h)', 'Ngọ (11–13h)',
  'Mùi (13–15h)', 'Thân (15–17h)', 'Dậu (17–19h)', 'Tuất (19–21h)', 'Hợi (21–23h)'];
var KMV_THU_ = ['Chủ nhật', 'thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy'];

/* ---------- Lời lưu ý cố định ---------- */
var KMV_LUU_Y_ = 'Đây là góc nhìn theo cổ học về thời điểm và hướng đi, để bạn tham khảo và tự cân nhắc. Quyết định cuối cùng là của bạn.';
var KMV_LUU_Y_THEM_ = {
  tien_bac: 'Với việc này, hãy hỏi thêm người có chuyên môn tài chính.',
  suc_khoe: 'Với việc này, hãy hỏi thêm bác sĩ; lời này không thay lời khuyên y tế.',
  kien_tung: 'Với việc này, hãy hỏi thêm luật sư.'
};
var KMV_LUU_Y_GIAO_TIET_ = 'Thời điểm hỏi nằm sát lúc giao tiết khí (lúc trời chuyển sang một chặng mùa mới), nên xem thêm bàn của giờ sau.';
var KMV_LUU_Y_HOI_LAI_ = 'Bàn của giờ này đã trả lời việc của bạn; nếu tình hình thay đổi, bạn hỏi lại sau ít nhất một ngày.';

/* ---------- Nhãn đoạn theo mức ---------- */
var KMV_NHAN_ = {
  thuan:    { manh: 'Điểm mạnh của bạn: ', vuong: 'Chỗ nhỏ cần để ý: ', khongVuong: 'Không thấy điểm vướng lớn; bạn chỉ cần giữ nhịp đều như đang làm.' },
  thuan_dk: { manh: 'Điểm mạnh của bạn: ', vuong: 'Điều kiện cần lo trước: ' },
  nen_cho:  { manh: 'Điểm tựa bạn vẫn có: ', vuong: 'Điểm vướng lúc này: ' }
};
var KMV_NHAN_HO_TRO_ = 'Người hoặc điều hỗ trợ: ';

/* ---------- 7 loại việc × 3 mức ----------
 * Ô trống trong câu: {g1} {g2} {g3} = khung giờ; {h1} {h2} {h3} = hướng (chỉ tên hướng);
 * {cho} = mốc nên chờ đến; {huong} = hướng của ô sự việc.
 * mo: 2 câu mở (chọn theo bàn); dien: diễn biến dễ gặp; viec: 3 việc nên làm.
 */
var KMV_LOAI_ = {
  cong_viec: {
    canCu: 'Việc làm, xin việc, thăng tiến xét ở cửa Khai (cửa của khởi đầu, mở việc) và ô của người hỏi.',
    manh: 'Bạn có nền nghề vững; người làm cùng biết bạn làm được việc.',
    vuong: 'Điều kiện của việc chưa được nói rõ, dễ hiểu mỗi bên một kiểu.',
    hoTro: 'Người đi trước trong nghề hoặc người giới thiệu bạn vào việc là chỗ dựa tốt.',
    thuan: {
      mo: ['Việc công việc bạn đang hỏi có xu hướng thuận. Bạn đang ở thế được nhìn nhận, nên đây là lúc hợp để chủ động đề xuất, nộp đơn hay nhận thêm phần việc.',
        'Đường công việc lúc này đang mở theo hướng có lợi cho bạn. Bạn thuộc mẫu người làm tốt khi được giao rõ việc, và cơ hội đang đến gần đúng kiểu đó.'],
      dien: 'Diễn biến dễ gặp: phản hồi đến khá nhanh, có thể kèm một yêu cầu bổ sung nhỏ.',
      viec: ['Gửi hồ sơ hoặc đề xuất vào {g1}, ngồi quay mặt về hướng {h1} khi viết hay gọi điện.',
        'Chuẩn bị sẵn ba kết quả cụ thể bạn đã làm được để nói ngắn gọn khi được hỏi; buổi trao đổi hợp vào {g2}, hướng {h2}.',
        'Sau khi gửi, chủ động hỏi lại một lần vào {g3}, hướng {h3}; giữ giọng nhẹ nhàng, không thúc ép.']
    },
    thuan_dk: {
      mo: ['Việc công việc bạn hỏi có xu hướng thuận nếu bạn chuẩn bị kỹ hơn một bước. Cơ hội có thật, nhưng người quyết định còn cần thêm bằng chứng về năng lực của bạn.',
        'Bạn đang ở thế có thể tiến, nhưng chưa phải lúc tiến một mình. Việc sẽ dễ hơn khi có người giới thiệu hoặc khi điều kiện được nói rõ từ đầu.'],
      dien: 'Diễn biến dễ gặp: có một vòng hỏi thêm hoặc chờ duyệt, thời gian kéo dài hơn bạn tính.',
      viec: ['Trước khi gửi, nhờ một người trong nghề đọc lại hồ sơ; gửi vào {g1}, hướng {h1}.',
        'Hỏi rõ phạm vi việc, đãi ngộ và thời gian thử việc bằng tin nhắn hoặc email để có văn bản; trao đổi vào {g2}, hướng {h2}.',
        'Giữ một phương án dự phòng song song để không phải nhận điều kiện kém vì sốt ruột; xem lại tình hình vào {g3}, hướng {h3}.']
    },
    nen_cho: {
      mo: ['Việc công việc bạn hỏi lúc này có xu hướng nên chờ. Không phải vì bạn kém, mà vì thời điểm chưa mở: người quyết định đang bận việc khác, hoặc vị trí chưa thật sự trống.',
        'Bạn đang ở thế nên giữ sức hơn là đổi chỗ hay đề nghị thêm ngay. Một quyết định vội lúc này dễ khiến bạn phải làm lại từ đầu.'],
      dien: 'Diễn biến dễ gặp: tin tức đến chậm hoặc thay đổi vào phút cuối; sau {cho} thế mới rõ hơn.',
      viec: ['Chờ đến {cho} rồi mới gửi đơn hoặc đề nghị; trong lúc chờ, cập nhật hồ sơ và danh sách việc đã làm được.',
        'Học thêm một kỹ năng nhỏ còn thiếu, hoặc hỏi ý kiến một người đi trước vào {g2}, hướng {h2}.',
        'Khi hết thời gian chờ, chọn {g3}, hướng {h3} để liên lạc lại; nói ngắn, rõ điều mình muốn.']
    }
  },
  tien_bac: {
    canCu: 'Việc tiền bạc, mua bán, hợp tác xét ở cửa Sinh (cửa của sinh sôi, tiền vào) và can Mậu (đại diện cho vốn).',
    manh: 'Bạn biết tính toán trước khi bỏ tiền ra, đó là điểm giữ cho bạn an toàn.',
    vuong: 'Cách chia phần và thời hạn thu hồi chưa được ghi rõ.',
    hoTro: 'Người có chuyên môn tài chính, hoặc người từng làm đúng loại việc này, nên được hỏi trước khi chốt.',
    thuan: {
      mo: ['Việc tiền bạc bạn hỏi có xu hướng mang lại lợi. Bạn đang ở thế có thể chủ động đặt điều kiện, và dòng tiền đang đi về phía bạn hơn là đi ra.',
        'Bạn thuộc mẫu người kiếm lợi tốt khi tính kỹ rồi mới làm, và lúc này thế đang thuận cho cách làm đó. Việc mua bán hay khoản thu bạn hỏi có nền để thành.'],
      dien: 'Diễn biến dễ gặp: thỏa thuận chốt được khá nhanh, phần lợi về theo từng đợt chứ không một lần.',
      viec: ['Chốt các điểm chính bằng văn bản: số lượng, giá, thời hạn thanh toán. Hẹn gặp chốt vào {g1}, ngồi quay mặt về hướng {h1}.',
        'Giữ lại một khoản dự phòng, không dồn hết vốn vào một chỗ dù thế đang thuận; khoản tiếp theo có thể bàn vào {g2}, hướng {h2}.',
        'Ghi các khoản thu chi của việc này vào một bảng riêng; xem lại vào {g3}, hướng {h3} để biết phần lợi thật.']
    },
    thuan_dk: {
      mo: ['Việc tiền bạc bạn hỏi có xu hướng mang lại lợi, nhưng lợi đến chậm hơn bạn mong. Chỗ cần lo nằm ở giấy tờ và cách chia phần, chưa nằm ở con người.',
        'Bạn đang ở thế có thể tiến, với điều kiện đi từng bước. Cơ hội sinh lời có, nhưng nếu dồn sức một lần thì phần rủi ro lớn hơn phần lợi.'],
      dien: 'Diễn biến dễ gặp: có một vòng mặc cả lại hoặc đổi điều khoản trước khi chốt.',
      viec: ['Trước khi ký, đề nghị ghi rõ tỷ lệ chia, thời hạn và cách rút vốn bằng văn bản. Hẹn gặp chốt vào {g1}, ngồi quay mặt về hướng {h1}.',
        'Chưa nên dồn hết vốn một lần; chia làm hai đợt, đợt hai xem lại vào {g2}, hướng {h2}.',
        'Nhờ một người ngoài cuộc đọc lại các con số vào {g3}, hướng {h3}; không vay thêm để dồn vào việc này.']
    },
    nen_cho: {
      mo: ['Việc tiền bạc bạn hỏi lúc này có xu hướng nên chờ. Thế đang nghiêng về giữ của hơn là bỏ vốn ra; quyết định vội dễ khiến tiền nằm im lâu hơn bạn muốn.',
        'Bạn đang ở thế nên giữ tiền trong tay thêm một thời gian. Cơ hội chưa mất đi, chỉ là điều kiện hiện tại chưa có lợi cho bạn.'],
      dien: 'Diễn biến dễ gặp: giá hoặc điều kiện còn thay đổi; sau {cho} bức tranh rõ hơn.',
      viec: ['Chờ đến {cho} rồi mới xuống tiền; trong lúc chờ, ghi ra ba điều bạn cần biết thêm trước khi quyết.',
        'Hỏi ý kiến người có chuyên môn tài chính vào {g2}; buổi trao đổi hợp hướng {h2}.',
        'Khi xem lại vào {g3}, hướng {h3}, chỉ bắt đầu với khoản nhỏ mà bạn chờ được nếu tiền về chậm.']
    }
  },
  tinh_cam: {
    canCu: 'Việc tình cảm xét ở can Ất và can Canh (đại diện cho hai người) cùng thần Lục Hợp (thần của sự kết nối).',
    manh: 'Bạn chân thành, và người kia cảm nhận được điều đó.',
    vuong: 'Còn một điều hai người chưa nói ra với nhau.',
    hoTro: 'Một người bạn chung, biết lắng nghe và không đứng về phía nào, có thể giúp hai bạn hiểu nhau hơn.',
    thuan: {
      mo: ['Chuyện tình cảm bạn hỏi có xu hướng thuận. Hai bên đang có thiện cảm, và đây là lúc hợp để nói ra điều bạn muốn một cách nhẹ nhàng.',
        'Bạn thuộc mẫu người tạo được sự ấm áp khi chủ động trước, và lúc này thế đang ủng hộ bạn bước tới gần hơn.'],
      dien: 'Diễn biến dễ gặp: một cuộc trò chuyện tự nhiên mở ra nhiều hơn bạn nghĩ; đừng vội đòi câu trả lời ngay.',
      viec: ['Hẹn gặp vào {g1}, chọn nơi ở hướng {h1} so với chỗ bạn ở, không gian yên tĩnh.',
        'Nói về cảm nhận của bạn thay vì hỏi dồn người kia; lần nhắn tiếp theo hợp vào {g2}, hướng {h2}.',
        'Giữ nhịp vừa phải: một lời hỏi thăm vào {g3}, hướng {h3}, đủ giữ hơi ấm mà không tạo áp lực.']
    },
    thuan_dk: {
      mo: ['Chuyện tình cảm bạn hỏi có xu hướng thuận nếu cả hai cùng nói rõ mong muốn. Thiện cảm có, nhưng còn một điều chưa được nói ra giữa hai người.',
        'Bạn đang ở thế có thể tiến gần hơn, với điều kiện đi chậm và lắng nghe nhiều hơn. Vội vàng lúc này dễ làm người kia lùi lại.'],
      dien: 'Diễn biến dễ gặp: có lúc ấm lúc lạnh; khoảng lặng không có nghĩa là hết quan tâm.',
      viec: ['Hẹn một cuộc gặp ngắn vào {g1}, hướng {h1}; mục tiêu là hiểu nhau thêm, chưa phải chốt chuyện.',
        'Hỏi một câu mở về điều người kia đang bận lòng, rồi lắng nghe; hợp vào {g2}, hướng {h2}.',
        'Nếu có hiểu lầm cũ, nhận phần của mình trước; một tin nhắn vào {g3}, hướng {h3} là đủ.']
    },
    nen_cho: {
      mo: ['Chuyện tình cảm bạn hỏi lúc này có xu hướng nên chờ. Người kia có thể đang bận lòng chuyện riêng, nên lời bày tỏ bây giờ khó được đón nhận trọn vẹn.',
        'Bạn đang ở thế nên chăm sóc bản thân trước khi chăm cho mối quan hệ. Cho nhau một khoảng thở sẽ giúp lần gặp sau nhẹ nhàng hơn.'],
      dien: 'Diễn biến dễ gặp: liên lạc thưa đi một thời gian; sau {cho} không khí dễ dịu lại.',
      viec: ['Chờ đến {cho} rồi mới hỏi chuyện quan trọng; trong lúc chờ, giữ liên lạc nhẹ, không trách móc.',
        'Dành thời gian cho việc riêng và bạn bè vào {g2}, hướng {h2}; tâm thế thoải mái sẽ giúp bạn nhiều hơn.',
        'Khi hết thời gian chờ, chọn {g3}, hướng {h3} để gặp và nói chuyện ngắn, nhẹ.']
    }
  },
  di_xa: {
    canCu: 'Việc đi xa, chuyển chỗ xét ở ô của hướng định đi và ngựa (dịch mã: dấu hiệu di chuyển, thay đổi).',
    manh: 'Bạn thích nghi nhanh với nơi mới.',
    vuong: 'Khâu sắp xếp giờ giấc, giấy tờ dễ có trục trặc nhỏ.',
    hoTro: 'Người quen ở nơi đến, hoặc người đi cùng biết đường, giúp chuyến đi nhẹ hơn nhiều.',
    thuan: {
      mo: ['Chuyến đi hay việc chuyển chỗ bạn hỏi có xu hướng thuận. Đường đi thông, và việc ở nơi đến dễ suôn sẻ hơn bạn lo.',
        'Bạn đang ở thế thuận để dịch chuyển. Thay đổi chỗ ở hay nơi làm lúc này dễ mở ra mối quen mới.'],
      dien: 'Diễn biến dễ gặp: lịch trình suôn sẻ, có thể đổi nhỏ về giờ giấc.',
      viec: ['Khởi hành vào {g1}, đi theo hướng {h1} ở đoạn đầu rồi mới rẽ vào đường chính.',
        'Kiểm lại giấy tờ, vé, chỗ ở trước khi đi một ngày; gọi xác nhận vào {g2}, hướng {h2}.',
        'Đến nơi, làm việc quan trọng nhất trước; buổi gặp đầu hợp vào {g3}, hướng {h3}.']
    },
    thuan_dk: {
      mo: ['Chuyến đi hay việc chuyển chỗ có xu hướng thuận nếu bạn chuẩn bị kỹ phần giấy tờ và giờ giấc. Đường đi có, nhưng dễ trục trặc nhỏ ở khâu sắp xếp.',
        'Bạn đang ở thế có thể đi, với điều kiện có kế hoạch dự phòng. Đi theo nhóm hoặc có người đón sẽ giúp bạn yên tâm hơn.'],
      dien: 'Diễn biến dễ gặp: trễ giờ hoặc đổi lịch nhỏ; chừa thời gian dư sẽ đỡ vội.',
      viec: ['Nếu được, khởi hành vào {g1}, đi theo hướng {h1} ở đoạn đầu.',
        'Chuẩn bị một phương án khác (chuyến sau, chỗ ở thay thế) và báo lịch cho người thân vào {g2}, hướng {h2}.',
        'Đi chậm, giữ an toàn khi di chuyển; việc quan trọng ở nơi đến hợp vào {g3}, hướng {h3}.']
    },
    nen_cho: {
      mo: ['Chuyến đi hay việc chuyển chỗ lúc này có xu hướng nên chờ. Không phải đường đóng hẳn, mà nhiều việc ở nơi đến chưa sẵn sàng đón bạn.',
        'Bạn đang ở thế nên ở yên thêm ít ngày. Đi lúc này dễ tốn sức và thời gian hơn kết quả mang về.'],
      dien: 'Diễn biến dễ gặp: lịch thay đổi, chờ đợi giữa chừng; sau {cho} việc sắp xếp dễ hơn.',
      viec: ['Dời ngày đi sang sau {cho} nếu việc cho phép; trong lúc chờ, chốt lại chỗ ở và người liên hệ.',
        'Nếu buộc phải đi, chọn {g2}, hướng {h2}, đi cùng người quen và giữ an toàn.',
        'Khi hết thời gian chờ, khởi hành vào {g3}, hướng {h3}.']
    }
  },
  thi_cu: {
    canCu: 'Việc thi cử, giấy tờ xét ở cửa Cảnh (cửa của giấy tờ, văn bản), sao Thiên Phụ (sao của học vấn) và can Đinh (đại diện cho văn thư, kết quả).',
    manh: 'Bạn đã có nền kiến thức; điều cần là trình bày cho gọn.',
    vuong: 'Một chi tiết nhỏ trong giấy tờ hoặc bài làm dễ bị sót.',
    hoTro: 'Thầy cô, người hướng dẫn, hoặc người đã làm qua đúng thủ tục này là người nên hỏi.',
    thuan: {
      mo: ['Việc thi cử hay hồ sơ bạn hỏi có xu hướng thuận. Bạn đã có nền, và lúc này cách bạn trình bày dễ được đánh giá đúng.',
        'Bạn thuộc mẫu người làm bài tốt khi bình tĩnh, và thế đang ủng hộ sự bình tĩnh đó. Hồ sơ có xu hướng qua các khâu suôn sẻ.'],
      dien: 'Diễn biến dễ gặp: kết quả hoặc phản hồi về đúng hẹn, có khi sớm hơn.',
      viec: ['Nộp hồ sơ hoặc ôn phần khó nhất vào {g1}, ngồi quay mặt về hướng {h1}.',
        'Đọc lại đề hoặc giấy tờ hai lần, đánh dấu chỗ hay nhầm; làm việc này vào {g2}, hướng {h2}.',
        'Ngủ đủ đêm trước ngày quan trọng; buổi ôn cuối nhẹ nhàng vào {g3}, hướng {h3}.']
    },
    thuan_dk: {
      mo: ['Việc thi cử hay hồ sơ có xu hướng thuận nếu bạn rà kỹ những chi tiết nhỏ. Nền tảng có, nhưng một sai sót nhỏ trong giấy tờ có thể làm chậm cả việc.',
        'Bạn đang ở thế có thể đạt, với điều kiện ôn đúng phần trọng tâm thay vì ôn tràn lan.'],
      dien: 'Diễn biến dễ gặp: được yêu cầu bổ sung giấy tờ hoặc làm thêm một bước.',
      viec: ['Lập danh sách giấy tờ cần nộp và kiểm từng mục; nộp vào {g1}, hướng {h1}.',
        'Nhờ một người đã làm qua việc này xem giúp; hẹn vào {g2}, hướng {h2}.',
        'Ôn ba phần trọng tâm, bớt phần phụ; buổi ôn chính vào {g3}, hướng {h3}.']
    },
    nen_cho: {
      mo: ['Việc thi cử hay hồ sơ lúc này có xu hướng nên chờ thêm. Không phải bạn thiếu khả năng, mà phần chuẩn bị hoặc thủ tục chưa đủ chín.',
        'Bạn đang ở thế nên tích lũy thêm trước khi nộp hay đăng ký. Thêm ít ngày chuẩn bị sẽ giúp bạn tự tin hơn nhiều.'],
      dien: 'Diễn biến dễ gặp: thủ tục chậm hoặc cần sửa lại; sau {cho} việc thông hơn.',
      viec: ['Nếu hạn còn cho phép, nộp sau {cho}; trong lúc chờ, bổ sung giấy tờ còn thiếu. Nếu ngày thi đã cố định, cứ đi thi và giữ tâm thế bình tĩnh.',
        'Mỗi ngày ôn một phần nhỏ vào {g2}, ngồi hướng {h2}, thay vì dồn sức một lần.',
        'Khi hết thời gian chờ, nộp hoặc đăng ký vào {g3}, hướng {h3}.']
    }
  },
  suc_khoe: {
    canCu: 'Việc sức khỏe và nhịp sống xét ở sao Thiên Nhuế (sao chỉ chỗ cần chăm sóc) và cửa Tử (cửa của sự dừng lại). Đây là tín hiệu về nhịp sinh hoạt, không phải kết luận về bệnh.',
    manh: 'Bạn biết lắng nghe cơ thể khi chịu chậm lại.',
    vuong: 'Nhịp làm việc đang nhiều hơn nhịp nghỉ.',
    hoTro: 'Bác sĩ hoặc người có chuyên môn y tế là người nên hỏi ý kiến trước tiên; người thân giúp bạn giữ nhịp ăn ngủ.',
    thuan: {
      mo: ['Nhịp sống của bạn lúc này có xu hướng thuận. Cơ thể đang có sức hồi lại tốt, nên đây là lúc hợp để bắt đầu một thói quen lành mạnh vừa sức.',
        'Bạn đang ở thế có thể chủ động chăm sóc bản thân. Những thay đổi nhỏ trong ăn ngủ lúc này dễ thấy tác dụng.'],
      dien: 'Diễn biến dễ gặp: tinh thần nhẹ hơn sau vài ngày giữ nhịp đều.',
      viec: ['Bắt đầu một buổi vận động nhẹ vào {g1}, đi về phía {h1}.',
        'Nếu có điều muốn hỏi, đặt lịch khám hoặc hỏi bác sĩ vào {g2}; đây là khung giờ thuận để trao đổi kỹ.',
        'Giữ giờ ngủ đều trong ba ngày tới và uống đủ nước; xem lại cảm nhận của mình vào {g3}.']
    },
    thuan_dk: {
      mo: ['Nhịp sống của bạn có xu hướng ổn nếu bạn chịu chậm lại một chút. Sức có, nhưng đang bị tiêu hao vì làm nhiều hơn nghỉ.',
        'Bạn đang ở thế giữ được sức, với điều kiện cân lại giờ làm và giờ nghỉ. Cố thêm lúc này dễ khiến bạn mệt lâu hơn.'],
      dien: 'Diễn biến dễ gặp: có ngày thấy khỏe, có ngày uể oải; đó là lúc cơ thể nhắc bạn nghỉ.',
      viec: ['Bớt một việc không gấp trong tuần; dành {g1} cho một khoảng nghỉ thật sự, hướng {h1}.',
        'Nếu có điều lo lắng, hẹn bác sĩ vào {g2}; ghi sẵn những gì bạn cảm thấy để trao đổi.',
        'Đi bộ nhẹ về phía {h3} vào {g3}, kết hợp hít thở chậm.']
    },
    nen_cho: {
      mo: ['Giai đoạn này cơ thể bạn có xu hướng cần được nghỉ nhiều hơn là cố gắng thêm. Kế hoạch tập nặng hay thức khuya để kịp việc nên tạm lùi lại vài ngày.',
        'Bạn đang ở thế nên giữ sức và lắng nghe cơ thể. Đây là lúc dưỡng sức hơn là thử thách bản thân.'],
      dien: 'Diễn biến dễ gặp: dễ thấy mệt nếu ép mình; sau {cho} nhịp sống dễ cân lại.',
      viec: ['Từ nay đến {cho}, đi ngủ trước 23 giờ và giảm cà phê buổi chiều.',
        'Nếu có điều lo lắng, đặt lịch khám vào {g2}; đây là khung giờ thuận để trao đổi kỹ với bác sĩ. Đừng chờ nếu thấy khó chịu nhiều.',
        'Một buổi đi bộ nhẹ về phía {h3} vào {g3} sẽ giúp bạn lấy lại nhịp.']
    }
  },
  kien_tung: {
    canCu: 'Việc tranh chấp, hợp đồng xét ở cửa Khai (cửa của khởi đầu, phía mình), cửa Kinh (cửa của tranh luận, phía bên kia) và sao Thiên Tâm (sao của lẽ phải, mưu tính).',
    manh: 'Bạn có lý lẽ và giữ được bình tĩnh.',
    vuong: 'Bằng chứng còn rời rạc, chưa xếp thành một mạch rõ ràng.',
    hoTro: 'Luật sư hoặc người am hiểu pháp lý là người nên hỏi trước mọi bước quan trọng.',
    thuan: {
      mo: ['Việc tranh chấp hay hợp đồng bạn hỏi có xu hướng nghiêng về phía có lý lẽ rõ ràng, và lúc này lý lẽ của bạn đang dễ được lắng nghe.',
        'Bạn đang ở thế giữ được phần chủ động. Đây là lúc hợp để đưa ra giấy tờ, bằng chứng và đề nghị một cách bình tĩnh.'],
      dien: 'Diễn biến dễ gặp: bên kia chịu ngồi lại nói chuyện sớm hơn bạn nghĩ.',
      viec: ['Xếp giấy tờ, tin nhắn, hóa đơn theo thứ tự thời gian; gặp luật sư vào {g1}, hướng {h1}.',
        'Đưa ra đề nghị bằng văn bản, lời lẽ ôn hòa, vào {g2}, hướng {h2}.',
        'Giữ mọi trao đổi tiếp theo bằng văn bản; buổi gặp chốt hợp vào {g3}, hướng {h3}.']
    },
    thuan_dk: {
      mo: ['Việc tranh chấp hay hợp đồng có xu hướng thuận nếu bạn đủ bằng chứng và chịu nhường ở chỗ không quan trọng. Lý có, nhưng còn một điểm bên kia có thể bắt bẻ.',
        'Bạn đang ở thế có thể đi tiếp, với điều kiện ưu tiên dàn xếp trước khi đưa ra cơ quan giải quyết.'],
      dien: 'Diễn biến dễ gặp: việc kéo thêm một vòng, có lúc tưởng bế tắc rồi lại mở.',
      viec: ['Hỏi luật sư về điểm yếu nhất trong hồ sơ của bạn; hẹn vào {g1}, hướng {h1}.',
        'Chuẩn bị một phương án dàn xếp, ghi rõ mức bạn chấp nhận được; trao đổi vào {g2}, hướng {h2}.',
        'Không ký thêm giấy tờ nào khi chưa đọc kỹ; buổi gặp tiếp theo hợp vào {g3}, hướng {h3}.']
    },
    nen_cho: {
      mo: ['Việc tranh chấp hay hợp đồng lúc này có xu hướng nên chờ. Đẩy mạnh bây giờ dễ làm việc căng thêm, còn giữ bình tĩnh giúp bạn có thời gian củng cố.',
        'Bạn đang ở thế nên củng cố trước khi hành động. Chưa nên ký, chưa nên khởi kiện hay đáp trả gay gắt trong lúc này.'],
      dien: 'Diễn biến dễ gặp: bên kia có thể đổi ý hoặc đưa thêm yêu cầu; sau {cho} tình hình rõ hơn.',
      viec: ['Trước {cho}, hỏi luật sư về các hạn thời gian pháp lý bạn cần giữ; đừng để lỡ hạn vì chờ.',
        'Gom đủ bằng chứng, ghi lại sự việc theo ngày vào {g2}, hướng {h2}.',
        'Khi hết thời gian chờ, mở lời trao đổi vào {g3}, hướng {h3}, bằng văn bản và lời lẽ ôn hòa.']
    }
  }
};
var KMV_LOAI_BI_DANH_ = { cong: 'cong_viec', xin_viec: 'cong_viec', tien: 'tien_bac', tai_loc: 'tien_bac', mua_ban: 'tien_bac', hop_tac: 'tien_bac',
  tinh: 'tinh_cam', di: 'di_xa', xuat_hanh: 'di_xa', chuyen_nha: 'di_xa', thi: 'thi_cu', giay_to: 'thi_cu', suc: 'suc_khoe', kien: 'kien_tung', hop_dong: 'kien_tung' };

/* ---------- 8 cửa × (đắc lực / bị khắc) ----------
 * nghia: lời giải nghĩa trong ngoặc (tầng Căn cứ); cc: nửa câu Căn cứ; de: câu đời thường (tầng Kết luận, không nêu tên).
 * dac → vào đoạn điểm mạnh; khac → vào đoạn điểm vướng.
 */
var KMV_MON_ = {
  'Hưu': { cat: true, nghia: 'cửa của nghỉ ngơi, gặp người giúp',
    dac: { cc: 'đang đắc lực: thuận cho gặp gỡ, nhờ người, nghỉ để lấy sức.', de: 'Bạn dễ gặp người sẵn lòng giúp, và nhịp làm từ tốn đang có lợi cho bạn.' },
    khac: { cc: 'bị khắc nên sức giúp yếu, người hứa giúp dễ chậm trễ.', de: 'Sự giúp đỡ từ người khác có thể đến chậm hơn lời hứa, nên đừng dựa hẳn vào một người.' } },
  'Sinh': { cat: true, nghia: 'cửa của sinh sôi, tiền vào',
    dac: { cc: 'đang đắc lực: thế sinh lời, vun đắp đang lên.', de: 'Những gì bạn vun đắp lúc này dễ ra kết quả; thế đi lên đang ở phía bạn.' },
    khac: { cc: 'bị khắc nên lợi có nhưng mỏng, dễ hao ở khâu trung gian.', de: 'Phần lợi có thể mỏng hơn dự tính, dễ hao ở những khoản phát sinh nhỏ.' } },
  'Thương': { cat: false, nghia: 'cửa của va chạm, cạnh tranh, đòi hỏi',
    dac: { cc: 'đang mạnh: hợp việc cần quyết liệt như đòi nợ, cạnh tranh, sửa chữa.', de: 'Bạn có sức bật để đối mặt cạnh tranh; việc cần dứt khoát thì đây là lúc làm được.' },
    khac: { cc: 'bị khắc nên dễ va chạm, nói nặng lời làm hỏng việc.', de: 'Dễ có va chạm vì nóng vội; một câu nói nặng lúc này có thể làm việc chậm lại.' } },
  'Đỗ': { cat: false, nghia: 'cửa của sự che chắn, giữ kín, bế tắc',
    dac: { cc: 'đang mạnh: hợp giữ bí mật, phòng thủ, chuẩn bị âm thầm.', de: 'Bạn làm tốt việc giữ kín và chuẩn bị âm thầm; chưa công bố lại là lợi thế.' },
    khac: { cc: 'bị khắc nên dễ tắc, khó thông.', de: 'Mọi thứ đang hơi nghẽn, khó thông; ép thêm lúc này chỉ thêm mệt.' } },
  'Cảnh': { cat: null, nghia: 'cửa của giấy tờ, văn bản, sự thể hiện',
    dac: { cc: 'đang đắc lực: thuận cho hồ sơ, trình bày, quảng bá.', de: 'Bạn có lợi khi trình bày, viết, nộp hồ sơ; cách bạn thể hiện đang được chú ý.' },
    khac: { cc: 'bị khắc nên giấy tờ dễ sai sót, lời nói dễ bị hiểu lầm.', de: 'Giấy tờ và lời nói dễ bị hiểu sai; một lỗi nhỏ trong văn bản có thể làm mất thời gian.' } },
  'Tử': { cat: false, nghia: 'cửa của sự dừng lại, khép lại',
    dac: { cc: 'đang mạnh: hợp kết thúc, thanh lý, khép lại chuyện cũ, chưa hợp khởi sự.', de: 'Đây là lúc thuận để khép lại những việc còn dang dở hơn là mở việc mới.' },
    khac: { cc: 'bị khắc nên việc dễ chững lại, khó xoay chuyển.', de: 'Việc đang ở điểm chững; càng thúc ép lúc này càng tốn sức mà ít tiến triển.' } },
  'Kinh': { cat: false, nghia: 'cửa của lo lắng, tin bất ngờ, tranh luận',
    dac: { cc: 'đang mạnh: hợp việc cần lên tiếng, tranh luận, đòi lại quyền lợi.', de: 'Bạn có tiếng nói; việc cần lên tiếng hay đàm phán thì đây là lúc được nghe.' },
    khac: { cc: 'bị khắc nên dễ lo lắng, tin đồn, nhiễu thông tin.', de: 'Dễ có tin bất ngờ làm bạn lo; nên kiểm chứng trước khi phản ứng.' } },
  'Khai': { cat: true, nghia: 'cửa của khởi đầu, mở việc, công danh',
    dac: { cc: 'đang đắc lực: thuận cho mở đầu, nhận việc, ký kết.', de: 'Thế mở đầu đang thuận: việc bắt đầu bây giờ dễ có đà và được ghi nhận.' },
    khac: { cc: 'bị khắc nên mở được nhưng chậm, cần thêm người đỡ.', de: 'Việc mở ra được nhưng chậm có đà; bạn cần thêm người đỡ ở bước đầu.' } }
};

/* ---------- 9 sao × (mạnh / yếu) ----------
 * tot: trạng thái này vào đoạn điểm mạnh (true) hay điểm vướng (false).
 * Sao mang tính cản (Bồng một phần, Nhuế, Trụ): mạnh lên thì phần cản rõ hơn.
 */
var KMV_SAO_ = {
  'Thiên Bồng': { nghia: 'sao của sự táo bạo, mạo hiểm, cũng chỉ hao hụt ngầm',
    manh: { tot: true, cc: 'đang vượng: gan dạ, dám làm, cần giữ dự phòng.', de: 'Bạn có gan làm việc lớn, dám đi bước mà người khác ngại; chỉ cần giữ một khoản dự phòng.' },
    yeu: { tot: false, cc: 'đang suy: dễ liều mà hao.', de: 'Dễ bị cuốn vào quyết định liều; có hao hụt ngầm nếu không ghi chép rõ.' } },
  'Thiên Nhuế': { nghia: 'sao chỉ sự mệt mỏi, chỗ cần chăm sóc, cũng là sao của học hỏi',
    manh: { tot: false, cc: 'đang mạnh: chỗ chưa ổn hiện rõ, cần chăm sóc và sửa từ gốc.', de: 'Có dấu hiệu cần chăm sóc, sửa chỗ chưa ổn trước khi đi tiếp; nhịp nghỉ quan trọng hơn tốc độ.' },
    yeu: { tot: true, cc: 'đang yếu: chỗ chưa ổn nhẹ dần, dễ sửa.', de: 'Những chỗ chưa ổn đang nhẹ dần; bạn có cơ hội sửa sớm mà ít tốn sức.' } },
  'Thiên Xung': { nghia: 'sao của hành động nhanh, quyết đoán',
    manh: { tot: true, cc: 'đang vượng: thuận cho ra tay nhanh, nắm thời cơ.', de: 'Bạn hành động nhanh và nắm thời cơ tốt.' },
    yeu: { tot: false, cc: 'đang suy: dễ vội mà phải làm lại.', de: 'Dễ vội rồi phải làm lại; chậm một nhịp sẽ đỡ hơn.' } },
  'Thiên Phụ': { nghia: 'sao của học vấn, người thầy, sự giúp đỡ bằng hiểu biết',
    manh: { tot: true, cc: 'đang vượng: có người hiểu biết nâng đỡ.', de: 'Kiến thức và người có hiểu biết đang đứng về phía bạn.' },
    yeu: { tot: false, cc: 'đang suy: hiểu biết trong tay chưa đủ.', de: 'Thông tin trong tay chưa đủ; nên hỏi thêm người hiểu việc.' } },
  'Thiên Cầm': { nghia: 'sao ở giữa, chủ sự cân bằng, giữ nhịp',
    manh: { tot: true, cc: 'đang vượng: giữ được thế cân bằng.', de: 'Bạn giữ được thế cân bằng, không bị cuốn theo người khác.' },
    yeu: { tot: false, cc: 'đang suy: dễ phân vân, thiếu điểm tựa.', de: 'Dễ phân vân, thiếu điểm tựa; nên chốt một hướng chính.' } },
  'Thiên Tâm': { nghia: 'sao của mưu tính, quản lý, chữa trị và lẽ phải',
    manh: { tot: true, cc: 'đang vượng: tính toán sáng suốt, lý lẽ vững.', de: 'Bạn tính toán sáng suốt; kế hoạch có lý lẽ rõ ràng sẽ thuyết phục được người khác.' },
    yeu: { tot: false, cc: 'đang suy: kế hoạch còn hở.', de: 'Kế hoạch còn thiếu vài phép tính; nên rà lại số liệu.' } },
  'Thiên Trụ': { nghia: 'sao của lời nói sắc bén, phá cái cũ',
    manh: { tot: false, cc: 'đang mạnh: lời nói dễ thành va chạm.', de: 'Lời nói dễ thành mũi nhọn; nói ít, nói đúng lúc sẽ có lợi hơn.' },
    yeu: { tot: true, cc: 'đang yếu: va chạm lời qua tiếng lại dịu đi.', de: 'Những va chạm lời qua tiếng lại đang dịu đi, dễ nói chuyện hơn.' } },
  'Thiên Nhậm': { nghia: 'sao của sự bền bỉ, đất đai, gánh vác',
    manh: { tot: true, cc: 'đang vượng: bền bỉ, gánh được việc dài hơi.', de: 'Bạn bền bỉ, gánh được việc dài hơi; người khác tin vào sự vững vàng của bạn.' },
    yeu: { tot: false, cc: 'đang suy: sức bền mỏng.', de: 'Sức bền đang mỏng; chia việc thành bước nhỏ sẽ dễ đi hơn.' } },
  'Thiên Anh': { nghia: 'sao của danh tiếng, sự sáng rõ, nhiệt huyết',
    manh: { tot: true, cc: 'đang vượng: dễ được nhìn thấy, uy tín lên.', de: 'Bạn dễ được nhìn thấy; uy tín và hình ảnh đang có lợi.' },
    yeu: { tot: false, cc: 'đang suy: dễ nóng vội, chuộng hình thức.', de: 'Dễ nóng vội hoặc chuộng hình thức; hãy để kết quả nói thay lời.' } }
};

/* ---------- 8 thần ----------
 * cat: thần giúp hay thần cản. de: câu cho đoạn "hỗ trợ"; vuong: câu cho đoạn điểm vướng (chỉ thần cản).
 */
var KMV_THAN_ = {
  'Trực Phù': { cat: true, nghia: 'thần dẫn đầu, chủ người có vị thế che chở', cc: 'là thần giúp.',
    de: 'Người có vị thế, như cấp trên hoặc người đi trước, dễ đứng ra che chở cho bạn.' },
  'Đằng Xà': { cat: false, nghia: 'thần của sự rối rắm, lo nghĩ, chuyện vòng vo', cc: 'là thần cản, cần tỉnh táo lọc tin.',
    de: 'Người giúp được bạn lúc này là người tỉnh táo, biết lọc tin.', vuong: 'Chuyện dễ vòng vo, nhiều lời đồn đoán làm bạn nghĩ ngợi.' },
  'Thái Âm': { cat: true, nghia: 'thần của sự kín đáo, giúp ngầm', cc: 'là thần giúp.',
    de: 'Có người giúp bạn một cách lặng lẽ; bàn riêng, kín đáo sẽ hiệu quả hơn nói to.' },
  'Lục Hợp': { cat: true, nghia: 'thần của sự kết nối, mai mối, hợp tác', cc: 'là thần giúp.',
    de: 'Người làm cầu nối, như bạn bè giới thiệu hay người môi giới, là điểm tựa tốt.' },
  'Bạch Hổ': { cat: false, nghia: 'thần của sự cứng rắn, áp lực, va chạm', cc: 'là thần cản, cần giữ an toàn và bình tĩnh.',
    de: 'Bạn cần người rạch ròi, cứng rắn ở bên.', vuong: 'Áp lực có thể đến dồn dập; giữ bình tĩnh, tránh đối đầu trực diện và cẩn thận khi đi lại.' },
  'Huyền Vũ': { cat: false, nghia: 'thần của sự mập mờ, dễ thiếu rõ ràng', cc: 'là thần cản, cần xem kỹ điều khoản.',
    de: 'Người cẩn thận với giấy tờ, số liệu sẽ giúp bạn nhiều nhất.', vuong: 'Có phần thông tin chưa rõ ràng; điều khoản và lời hứa miệng cần được ghi lại.' },
  'Cửu Địa': { cat: true, nghia: 'thần của sự vững chãi, giữ gìn, bền lâu', cc: 'là thần giúp, hợp giữ hơn tiến gấp.',
    de: 'Người thân trong nhà hoặc người điềm tĩnh, bền bỉ là chỗ dựa vững cho bạn.' },
  'Cửu Thiên': { cat: true, nghia: 'thần của sự vươn xa, chủ động, dám làm', cc: 'là thần giúp, hợp chủ động.',
    de: 'Người năng động, dám nói dám làm sẽ kéo bạn tiến nhanh hơn.' }
};

/* ---------- Mã lý do (danhGia.ly) có văn riêng ----------
 * Mã chỉnh trạng thái (không có văn): mon_dac, mon_bi_khac, mon_buc, sao_vuong, sao_suy, giao_tiet.
 */
var KMV_LY_ = {
  can_sinh: { tot: true, cc: 'Can lớp Trời và can lớp Đất ở ô này sinh nhau (trên dưới hòa thuận).', de: 'Hai phía của việc đang nâng đỡ nhau, nên phối hợp dễ hơn bạn nghĩ.' },
  can_khac: { tot: false, cc: 'Can lớp Trời khắc can lớp Đất ở ô này (trên dưới chưa thuận).', de: 'Trong việc có chỗ hai bên chưa thuận nhau; cần dàn xếp trước khi đi tiếp.' },
  cung_sinh_nguoi: { tot: true, cc: 'Ô của sự việc sinh ô của người hỏi (việc tìm đến người).', de: 'Sự việc đang có xu hướng tìm đến bạn, không cần chạy theo quá nhiều.' },
  cung_khac_nguoi: { tot: false, cc: 'Ô của sự việc khắc ô của người hỏi (việc tạo sức ép lên người).', de: 'Sự việc đang tạo sức ép lên bạn; hãy giữ nhịp riêng, đừng để bị cuốn.' },
  nguoi_khac_cung: { tot: true, cc: 'Ô của người hỏi khắc ô của sự việc (người nắm thế chủ động).', de: 'Bạn đang ở thế nắm phần chủ động.' },
  nguoi_sinh_cung: { tot: false, cc: 'Ô của người hỏi sinh ô của sự việc (người phải bỏ sức nuôi việc).', de: 'Bạn đang phải bỏ nhiều công sức vào việc này; nên cân xem sức mình tới đâu.' },
  cung_hoa: { tot: true, cc: 'Ô của người hỏi và ô của sự việc cùng hành (ngang hòa, cùng nhịp).', de: 'Bạn và việc đang cùng một nhịp, dễ phối hợp.' },
  khong_vong: { tot: false, cc: 'Ô của sự việc rơi vào không vong (khoảng trống của tuần giờ: việc dễ có tiếng mà chưa có miếng).', de: 'Một phần của việc còn "rỗng": có thể là lời hứa chưa thành, hoặc thông tin chưa đủ.' },
  nhap_mo: { tot: false, cc: 'Điểm đại diện cho việc nhập mộ (rơi vào chỗ "cất giữ", sức chưa phát ra được).', de: 'Việc như đang được cất trong ngăn kéo: chưa đến lúc mở ra.' },
  ma_tinh: { tot: true, cc: 'Ô có ngựa (dịch mã: dấu hiệu di chuyển, thay đổi nhanh).', de: 'Việc có yếu tố di chuyển, thay đổi nhanh; tin tức có thể đến bất ngờ.' }
};

/* ---------- Cách cục hay gặp (22 cách) ----------
 * Chỉ lấy cách có ít nhất 2 nguồn ghi cùng định nghĩa (bảng "40 cách" của nhiều trang; bài ca Cửu độn;
 * các thư viện đối chiếu trong tests/). Bên chấm gửi mã trong danhGia.cachCuc hoặc danhGia.ly dạng 'cc_<mã>'.
 * tren/duoi: cặp can lớp Trời / lớp Đất (chỉ số CAN) để tự nhận khi bên chấm chưa gửi cách cục.
 */
var KMV_CC_ = {
  thanh_long_phan_thu: { ten: 'Thanh Long Phản Thủ', tot: true, tren: 4, duoi: 2,
    nghia: 'can Mậu trên gặp can Bính dưới: rồng quay đầu, việc lớn dễ thành', de: 'Việc tưởng đã chững có thể quay đầu thuận; cơ hội dễ đến từ chỗ quen.' },
  phi_dieu_diet_huyet: { ten: 'Phi Điểu Điệt Huyệt', tot: true, tren: 2, duoi: 4,
    nghia: 'can Bính trên gặp can Mậu dưới: chim sa đúng tổ, được việc không tốn sức', de: 'Có cơ hội "đúng chỗ, đúng lúc": việc đến tay mà không tốn nhiều sức.' },
  thanh_long_dao_tau: { ten: 'Thanh Long Đào Tẩu', tot: false, tren: 1, duoi: 7,
    nghia: 'can Ất trên gặp can Tân dưới: rồng bỏ đi, dễ mất phần nếu lơi tay', de: 'Người hoặc của dễ "đi mất" nếu lơi tay; nên giữ chặt những gì đã có.' },
  bach_ho_xuong_cuong: { ten: 'Bạch Hổ Xương Cuồng', tot: false, tren: 7, duoi: 1,
    nghia: 'can Tân trên gặp can Ất dưới: sức ép mạnh, dễ thiệt khi đi xa', de: 'Đây là lúc nên thận trọng khi đi lại và tránh đối đầu gắt.' },
  chu_tuoc_dau_giang: { ten: 'Chu Tước Đầu Giang', tot: false, tren: 3, duoi: 9,
    nghia: 'can Đinh trên gặp can Quý dưới: lời nói, văn thư dễ chìm hoặc gây phiền', de: 'Giấy tờ và lời nói dễ gây phiền; nên kiểm kỹ trước khi gửi đi.' },
  dang_xa_yeu_kieu: { ten: 'Đằng Xà Yêu Kiều', tot: false, tren: 9, duoi: 3,
    nghia: 'can Quý trên gặp can Đinh dưới: chuyện rối như rắn quấn, dễ lo nghĩ', de: 'Chuyện có thể rối và kéo dài; giữ mọi trao đổi bằng văn bản sẽ giúp bạn yên tâm.' },
  thai_bach_nhap_huynh: { ten: 'Thái Bạch Nhập Huỳnh', tot: false, tren: 6, duoi: 2,
    nghia: 'can Canh trên gặp can Bính dưới: sức ép từ bên ngoài đi vào', de: 'Có sức ép từ bên ngoài tìm đến; nên phòng thủ trước khi tiến.' },
  huynh_nhap_thai_bach: { ten: 'Huỳnh Nhập Thái Bạch', tot: true, tren: 2, duoi: 6,
    nghia: 'can Bính trên gặp can Canh dưới: sức ép tự lui', de: 'Áp lực đang tự lui dần; kiên nhẫn giữ vị trí sẽ có lợi.' },
  dai_cach: { ten: 'Đại cách', tot: false, tren: 6, duoi: 9,
    nghia: 'can Canh trên gặp can Quý dưới: đường đi bị cản', de: 'Đường đi có vật cản; việc đi xa, gửi hàng nên dời lại nếu được.' },
  hinh_cach: { ten: 'Hình cách', tot: false, tren: 6, duoi: 5,
    nghia: 'can Canh trên gặp can Kỷ dưới: dễ vướng chuyện giấy tờ ràng buộc', de: 'Nên cẩn trọng với giấy tờ và cam kết có tính ràng buộc.' },
  phuc_cung: { ten: 'Phục cung', tot: false, tren: 6, duoi: 4,
    nghia: 'can Canh trên gặp can Mậu dưới: sức ép đè lên người đứng đầu', de: 'Người đứng đầu hoặc chính bạn đang chịu sức ép; chưa nên tranh giành.' },
  phi_cung: { ten: 'Trực phù phi cung', tot: false, tren: 4, duoi: 6,
    nghia: 'can Mậu trên gặp can Canh dưới: vị thế dễ chao', de: 'Vị thế dễ chao đảo; hãy giữ chắc phần việc chính.' },
  thien_don: { ten: 'Thiên Độn', tot: true,
    nghia: 'can Bính, cửa Sinh và can Đinh dưới cùng ô: thế "trời che chở", thuận cho cầu lợi, khởi sự', de: 'Thế thuận ít gặp: việc khởi sự, cầu lợi trong khung giờ này dễ được nâng đỡ.' },
  dia_don: { ten: 'Địa Độn', tot: true,
    nghia: 'can Ất, cửa Khai và can Kỷ dưới cùng ô: thế "đất che chở", hợp xây nền, giữ của', de: 'Thuận cho việc xây nền móng, giữ của và làm âm thầm.' },
  nhan_don: { ten: 'Nhân Độn', tot: true,
    nghia: 'can Đinh, cửa Hưu và thần Thái Âm cùng ô: thế "người che chở", hợp nhờ người, hòa giải', de: 'Thuận cho việc nhờ người, hòa giải, gặp gỡ riêng.' },
  ngoc_nu_thu_mon: { ten: 'Ngọc Nữ Thủ Môn', tot: true,
    nghia: 'can Đinh gặp cửa Trực sử: thuận cho gặp gỡ, việc vui, việc riêng tư', de: 'Thuận cho gặp gỡ, việc vui và chuyện riêng tư.' },
  phuc_ngam: { ten: 'Phục ngâm', tot: false,
    nghia: 'sao và cửa nằm yên ở ô gốc: mọi thứ đứng im, hợp giữ hơn tiến', de: 'Mọi thứ đang đứng yên; giữ hiện trạng lợi hơn thay đổi lớn.' },
  phan_ngam: { ten: 'Phản ngâm', tot: false,
    nghia: 'sao và cửa nằm ở ô đối diện ô gốc: dễ đảo chiều, lặp lại', de: 'Việc dễ đảo chiều hoặc phải làm lại; nên chừa đường lui.' },
  luc_nghi_kich_hinh: { ten: 'Lục nghi kích hình', tot: false,
    nghia: 'can nghi rơi vào ô "hình" với chi của nó: dễ va chạm, tổn hao', de: 'Dễ có va chạm nhỏ và hao sức vì chuyện không đáng; nhường một bước sẽ nhẹ hơn.' },
  tam_ky_nhap_mo: { ten: 'Tam kỳ nhập mộ', tot: false,
    nghia: 'can Ất, Bính hoặc Đinh rơi vào ô "mộ" của nó: cái tốt bị cất đi', de: 'Điểm mạnh của bạn lúc này chưa phát huy hết, như đang bị cất đi; cần thêm thời gian.' },
  mon_buc: { ten: 'Môn bức', tot: false,
    nghia: 'cửa khắc ô nó đứng: việc bị ép, khó thông', de: 'Việc đang bị ép về tiến độ; ép thêm sẽ khó thông.' },
  ngu_bat_ngo_thoi: { ten: 'Ngũ bất ngộ thời', tot: false,
    nghia: 'can giờ khắc can ngày cùng tính âm dương: giờ không hợp với người', de: 'Khung giờ này chưa hợp với bạn; việc quan trọng nên chọn giờ khác.' }
};

/* ---------- Tiện ích nhỏ ---------- */
function kmvKhoa_(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/^\s*(cửa|môn|sao|thần)\s+/, '').replace(/\s+môn\s*$/, '').replace(/\s+/g, ' ').trim();
}
/** Tìm tên chuẩn trong bảng (nhận tên, tên có tiền tố "cửa/sao/thần", hoặc chỉ số theo dsTen) */
function kmvTen_(x, bang, dsTen) {
  if (x == null || x === '') return null;
  if (typeof x === 'number') return dsTen[x] || null;
  if (typeof x === 'object') x = x.ten || x.name || (x.length ? x[0] : null);
  if (typeof x === 'number') return dsTen[x] || null;
  var k = kmvKhoa_(x);
  for (var t in bang) if (bang.hasOwnProperty(t) && kmvKhoa_(t) === k) return t;
  return null;
}
function kmvCo_(ds, ma) { return !!ds && ds.indexOf(ma) >= 0; }
function kmvThay_(s, o) {
  for (var k in o) if (o.hasOwnProperty(k)) s = s.split('{' + k + '}').join(o[k]);
  return s;
}
/** Cộng ngày cho {nam, thang, ngay} */
function kmvCongNgay_(d, n) {
  var t = new Date(Date.UTC(d.nam, d.thang - 1, d.ngay) + n * 86400000);
  return { nam: t.getUTCFullYear(), thang: t.getUTCMonth() + 1, ngay: t.getUTCDate() };
}
function kmvNgayTen_(d) {
  if (!d || !d.nam || !d.thang || !d.ngay) return '';
  var w = new Date(Date.UTC(d.nam, d.thang - 1, d.ngay)).getUTCDay();
  return KMV_THU_[w] + ' ' + d.ngay + '/' + d.thang;
}
function kmvSoNgay_(d) { return Date.UTC(d.nam, d.thang - 1, d.ngay) / 86400000; }
function kmvGioTen_(chi, d) {
  var s = 'giờ ' + KMV_GIO_[((chi % 12) + 12) % 12];
  var n = kmvNgayTen_(d);
  return n ? s + ' ' + n : s;
}
/** Chi giờ từ một khung giờ bên chấm gửi: {chi} hoặc {gio: 0..23} */
function kmvChiCuaKhung_(k) {
  if (typeof k.chi === 'number') return k.chi;
  if (typeof k.gioChi === 'number') return k.gioChi;
  if (typeof k.gio === 'number') return Math.floor((k.gio + 1) / 2) % 12;
  if (k.gio && typeof k.gio.chi === 'number') return k.gio.chi;
  return null;
}
function kmvHuongTen_(h) {
  if (h == null || h === '') return '';
  if (typeof h === 'number') return KMV_HUONG_[h] || '';
  return String(h).replace(/^\s*hướng\s+/i, '');
}

/** Ô của bàn theo số (5 → gửi ô 2 để có sao, cửa, thần) */
function kmvO_(ban, so) {
  if (!ban || !ban.cung || !so) return null;
  if (so === 5) so = 2;
  for (var i = 0; i < ban.cung.length; i++) if (ban.cung[i] && ban.cung[i].so === so) return ban.cung[i];
  return null;
}

/** Gom dữ liệu dụng thần: từ danhGia.dungThan, bổ sung bằng ô trên bàn */
function kmvDungThan_(ban, dg) {
  var dt = (dg && dg.dungThan) || {};
  var so = dt.cung;
  if (so && typeof so === 'object') so = so.so;
  so = Number(so) || 0;
  var o = kmvO_(ban, so) || {};
  var sao = kmvTen_(dt.sao != null ? dt.sao : dt.saoTen, KMV_SAO_, KMV_SAO_TEN_) || kmvTen_(o.saoTen, KMV_SAO_, KMV_SAO_TEN_);
  var mon = kmvTen_(dt.cua != null ? dt.cua : (dt.mon != null ? dt.mon : dt.monTen), KMV_MON_, KMV_MON_TEN_) || kmvTen_(o.monTen, KMV_MON_, KMV_MON_TEN_);
  var than = kmvTen_(dt.than != null ? dt.than : dt.thanTen, KMV_THAN_, KMV_THAN_TEN_) || kmvTen_(o.thanTen, KMV_THAN_, KMV_THAN_TEN_);
  var huong = kmvHuongTen_(dt.huong) || (so ? KMV_HUONG_[so] : '') || o.huong || '';
  return { so: so, o: o, sao: sao, mon: mon, than: than, huong: huong, raw: dt };
}

/** Ba khung giờ + hướng cho 3 việc; dùng danhGia.gioTot nếu có, không thì lấy tạm từ bàn */
function kmvKhung_(ban, dg, muc, dt, cho) {
  var ds = [], nguon = (dg && (dg.gioTot || dg.khungGio)) || [];
  for (var i = 0; i < nguon.length && ds.length < 3; i++) {
    var k = nguon[i] || {}, chi = kmvChiCuaKhung_(k);
    if (chi == null) continue;
    var ngay = (k.nam && k.thang && k.ngay) ? { nam: k.nam, thang: k.thang, ngay: k.ngay } : (k.ngay && k.ngay.nam ? k.ngay : null);
    ds.push({ gio: kmvGioTen_(chi, ngay), huong: kmvHuongTen_(k.huong != null ? k.huong : k.cung) });
  }
  // Hướng dự phòng: ô có cửa Khai / Hưu / Sinh, không rơi vào không vong
  var huongTot = [];
  if (muc !== 'nen_cho' && dt.huong && dt.mon && KMV_MON_[dt.mon].cat) huongTot.push(dt.huong);
  if (ban && ban.cung) ban.cung.forEach(function (o) {
    if (o && o.so !== 5 && !o.khongVong && (o.monTen === 'Khai' || o.monTen === 'Hưu' || o.monTen === 'Sinh') && huongTot.indexOf(o.huong) < 0) huongTot.push(o.huong);
  });
  if (!huongTot.length) huongTot.push(dt.huong || 'Đông Nam');
  // Giờ dự phòng
  var goc = (ban && ban.thoiDiem) || null, chiGoc = [4, 5, 8];
  for (var j = ds.length; j < 3; j++) {
    var g;
    if (!goc) g = 'giờ ' + KMV_GIO_[chiGoc[j]];
    else if (muc === 'nen_cho') g = kmvGioTen_(chiGoc[j], kmvCongNgay_(cho.ngay, j));
    else if (j === 0 && ban.gio) g = kmvGioTen_(ban.gio.chi, goc);
    else g = kmvGioTen_(chiGoc[j], kmvCongNgay_(goc, j));
    ds.push({ gio: g, huong: '' });
  }
  for (var m = 0; m < 3; m++) if (!ds[m].huong) ds[m].huong = huongTot[m % huongTot.length];
  return ds;
}

/** Mốc nên chờ đến: danhGia.choDen, hoặc lúc sang tiết mới nếu gần, hoặc 3 ngày sau */
function kmvCho_(ban, dg) {
  var c = dg && dg.choDen;
  if (c && typeof c === 'string') return { ten: c, ngay: (ban && ban.thoiDiem) ? kmvCongNgay_(ban.thoiDiem, 3) : null };
  if (c && c.nam && c.thang && c.ngay) return { ten: kmvNgayTen_(c), ngay: { nam: c.nam, thang: c.thang, ngay: c.ngay } };
  var goc = ban && ban.thoiDiem;
  if (!goc) return { ten: 'vài ngày nữa', ngay: null };
  var kt = ban.tietKhi && ban.tietKhi.ketThuc;
  if (kt && kt.nam) {
    var x = kmvSoNgay_(kt) - kmvSoNgay_(goc);
    if (x >= 2 && x <= 7) return { ten: kmvNgayTen_(kt) + ' (khi sang chặng mùa mới)', ngay: kt };
  }
  var d = kmvCongNgay_(goc, 3);
  return { ten: kmvNgayTen_(d), ngay: d };
}

/** Thời điểm hỏi có nằm trong ±2 giờ quanh lúc giao tiết không */
function kmvGiaoTiet_(ban) {
  if (!ban || !ban.thoiDiem || !ban.tietKhi) return false;
  function phut(x) { return x && x.nam ? Date.UTC(x.nam, x.thang - 1, x.ngay, x.gio || 0, x.phut || 0) / 60000 : null; }
  var t = phut(ban.thoiDiem), a = phut(ban.tietKhi.batDau), b = phut(ban.tietKhi.ketThuc);
  return (a != null && Math.abs(t - a) <= 120) || (b != null && Math.abs(b - t) <= 120);
}

/** Cách cục: từ danhGia (cachCuc hoặc ly 'cc_…'); nếu bên chấm chưa gửi, tự nhận theo cặp can ở ô sự việc */
function kmvCachCuc_(dg, ly, o) {
  var ds = [], nguon = (dg && dg.cachCuc) || [], coGui = !!(dg && dg.cachCuc);
  nguon.forEach(function (x) { var m = typeof x === 'string' ? x : (x && (x.ma || x.ten)); if (m) ds.push(String(m).replace(/^cc_/, '')); });
  ly.forEach(function (x) { if (/^cc_/.test(x)) { ds.push(x.slice(3)); coGui = true; } else if (KMV_CC_[x]) { ds.push(x); coGui = true; } });
  if (!coGui && o && o.thienBan && o.thienBan.length && o.diaBan != null) {
    for (var m in KMV_CC_) if (KMV_CC_.hasOwnProperty(m) && KMV_CC_[m].tren === o.thienBan[0] && KMV_CC_[m].duoi === o.diaBan) ds.push(m);
  }
  var kq = [];
  ds.forEach(function (m) { if (KMV_CC_[m] && kq.indexOf(m) < 0) kq.push(m); });
  return kq;
}

/**
 * Ghép bài luận "Hỏi một việc".
 * ban: kết quả kmLap_; loai: cong_viec | tien_bac | tinh_cam | di_xa | thi_cu | suc_khoe | kien_tung;
 * muc: 'thuan' | 'thuan_dk' | 'nen_cho';
 * danhGia (đều có thể thiếu): { dungThan: { cung, sao, cua|mon, than, huong, monKhac, saoVuong },
 *   ly: [mã], cachCuc: [mã], gioTot: [{nam, thang, ngay, chi|gio, huong|cung}], choDen: {nam, thang, ngay} | chuỗi }
 * Trả về { ketLuan: chuỗi (5 đoạn, cách nhau bằng dòng trống), canCu: [chuỗi], viec: [3 chuỗi], luuY: chuỗi }.
 */
function kmVanLuan_(ban, loai, muc, danhGia) {
  var dg = danhGia || {};
  loai = KMV_LOAI_[loai] ? loai : (KMV_LOAI_BI_DANH_[loai] || 'cong_viec');
  muc = (muc === 'thuan' || muc === 'nen_cho') ? muc : 'thuan_dk';
  var L = KMV_LOAI_[loai], M = L[muc], nhan = KMV_NHAN_[muc];
  var ly = [];
  (dg.ly || []).forEach(function (x) { if (x != null) ly.push(String(x)); });
  var dt = kmvDungThan_(ban, dg), o = dt.o, raw = dt.raw;
  if (o.khongVong && ly.indexOf('khong_vong') < 0) ly.push('khong_vong');
  if (o.maTinh && ly.indexOf('ma_tinh') < 0) ly.push('ma_tinh');

  // Trạng thái cửa: bên chấm gửi thì theo bên chấm; không thì suy theo mức để hai tầng không lệch nhau
  var monTT = null;
  if (raw.monKhac === true || kmvCo_(ly, 'mon_bi_khac') || kmvCo_(ly, 'mon_buc')) monTT = 'khac';
  else if (raw.monKhac === false || kmvCo_(ly, 'mon_dac')) monTT = 'dac';
  if (!monTT && dt.mon) {
    var cat = KMV_MON_[dt.mon].cat;
    monTT = cat === true ? (muc === 'nen_cho' ? 'khac' : 'dac') : cat === false ? (muc === 'thuan' ? 'dac' : 'khac') : (muc === 'nen_cho' ? 'khac' : 'dac');
  }
  var saoTT = null;
  if (raw.saoVuong === true || kmvCo_(ly, 'sao_vuong')) saoTT = 'manh';
  else if (raw.saoVuong === false || kmvCo_(ly, 'sao_suy')) saoTT = 'yeu';
  if (!saoTT && dt.sao) saoTT = KMV_SAO_[dt.sao].manh.tot === (muc !== 'nen_cho') ? 'manh' : 'yeu';

  var cc = kmvCachCuc_(dg, ly, o);
  var manh = [], vuong = [], canCu = [L.canCu];

  // Căn cứ + gom câu đời thường theo tín hiệu (cách cục trước, rồi cửa, sao, thần, lý do)
  var tenO = dt.huong ? 'ô ' + dt.huong : 'ô của sự việc';
  if (dt.mon) {
    var mn = KMV_MON_[dt.mon], st = mn[monTT];
    canCu.push('Cửa ' + dt.mon + ' (' + mn.nghia + ') ở ' + tenO + ', ' + st.cc);
    (monTT === 'dac' ? manh : vuong).push(st.de);
  }
  if (dt.sao) {
    var sa = KMV_SAO_[dt.sao], ss = sa[saoTT];
    canCu.push('Sao ' + dt.sao + ' (' + sa.nghia + ') ' + ss.cc);
    (ss.tot ? manh : vuong).push(ss.de);
  }
  var thanDe = '';
  if (dt.than) {
    var th = KMV_THAN_[dt.than];
    canCu.push('Ô này gặp thần ' + dt.than + ' (' + th.nghia + '), ' + th.cc);
    thanDe = th.de;
    if (!th.cat && th.vuong) vuong.push(th.vuong);
  }
  var ccCanCu = [];
  cc.forEach(function (m) {
    var c = KMV_CC_[m];
    ccCanCu.push('Cách ' + c.ten + ' (' + c.nghia + ').');
    (c.tot ? manh : vuong).unshift(c.de);
  });
  var lyCanCu = [];
  ly.forEach(function (m) {
    var x = KMV_LY_[m];
    if (!x || m === 'ma_tinh') return;
    lyCanCu.push(x.cc);
    (x.tot ? manh : vuong).push(x.de);
  });
  // Căn cứ tối đa 6 dòng: dụng thần, cửa, sao, thần, rồi cách cục / lý do
  canCu = canCu.concat(ccCanCu, lyCanCu, kmvCo_(ly, 'ma_tinh') ? [KMV_LY_.ma_tinh.cc] : []).slice(0, 6);

  // Mốc chờ, khung giờ, hướng
  var cho = kmvCho_(ban, dg);
  var k = kmvKhung_(ban, dg, muc, dt, cho);
  var thay = { g1: k[0].gio, g2: k[1].gio, g3: k[2].gio, h1: k[0].huong, h2: k[1].huong, h3: k[2].huong,
    cho: cho.ten, huong: dt.huong || k[0].huong };

  // Tầng 1: 5 đoạn
  var hat = ((ban && ban.gio ? ban.gio.chi : 0) + (ban && ban.ngay ? ban.ngay.can : 0) + dt.so) % 2;
  var p = [M.mo[hat]];
  p.push(nhan.manh + (manh.length ? manh.slice(0, 2).join(' ') : L.manh));
  if (vuong.length) p.push(nhan.vuong + vuong.slice(0, 2).join(' '));
  else p.push(muc === 'thuan' ? nhan.vuong + nhan.khongVuong : nhan.vuong + L.vuong);
  p.push(kmvThay_(M.dien, thay) + (kmvCo_(ly, 'ma_tinh') ? ' ' + KMV_LY_.ma_tinh.de : ''));
  p.push(KMV_NHAN_HO_TRO_ + (thanDe ? thanDe + ' ' : '') + L.hoTro);

  // Tầng 3: 3 việc
  var viec = M.viec.map(function (v) { return kmvThay_(v, thay); });

  // Lưu ý
  var luu = [KMV_LUU_Y_];
  if (KMV_LUU_Y_THEM_[loai]) luu.push(KMV_LUU_Y_THEM_[loai]);
  if (kmvCo_(ly, 'giao_tiet') || kmvGiaoTiet_(ban)) luu.push(KMV_LUU_Y_GIAO_TIET_);
  luu.push(KMV_LUU_Y_HOI_LAI_);

  return { ketLuan: p.join('\n\n'), canCu: canCu, viec: viec, luuY: luu.join(' ') };
}
