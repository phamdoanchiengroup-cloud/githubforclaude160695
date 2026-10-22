# Thu sẵn giọng đọc tiếng Việt (giọng neural của Microsoft Edge, qua gói edge-tts), ghép từng mảnh bằng Web Audio.
#   python3 tests/am-thanh/tao-giong.py       -> tests/am-thanh/giong.json      {nu|nam: {mã: base64 mp3}} cho demo-am-thanh.html
#   python3 tests/am-thanh/tao-giong.py web   -> tests/am-thanh/giong-web.json  {mã: base64 mp3}, chỉ giọng nữ (chủ dự án chọn 18/10),
#                                                các câu web thật dùng (am-thanh.js); va-am-thanh.py ghi ra AmThanh.html
# Cần: pip install edge-tts imageio-ffmpeg
import asyncio, base64, json, pathlib, subprocess, sys, tempfile
try:
    import certifi; certifi.where = lambda: '/root/.ccr/ca-bundle.crt'  # proxy của sandbox
except ImportError:
    pass
import edge_tts, imageio_ffmpeg

GIONG = {'nu': 'vi-VN-HoaiMyNeural', 'nam': 'vi-VN-NamMinhNeural'}
MANH = {
    # câu trọn
    'c0': 'Chào buổi sáng! Hôm nay cố lên nhé.',
    'c1': 'Bạn đã gửi đều 7 ngày liền. Giỏi lắm!',
    'c2': 'Còn ngày 15 tháng 10 chưa nhập. Hạn là 5 giờ chiều thứ Sáu.',
    'c3': 'Hôm qua bạn làm 42 trên 50. Còn 8 cái nữa là đạt định mức.',
    'c4': 'Chúc mừng! Tháng này bạn đã lên loại A.',
    'c5': 'Đã đến giờ nghỉ giữa ca. Uống chút nước nhé.',
    'sai': 'Bạn chưa nhập số lượng.',
    'chao': 'Chào Nguyễn Văn An. Chúc một ngày làm việc tốt.',
    # mảnh ghép câu đọc lại
    'ban_gui': 'Bạn gửi công đoạn', 'cai': 'cái,', 'loi': 'lỗi.', 'khong_loi': 'không có lỗi.', 'dung_chua': 'Đúng chưa?',
    'cd0': 'Tiện ngọn,', 'cd1': 'Ráp nước,', 'cd2': 'Bọc da,', 'cd3': 'Sơn lót,', 'cd4': 'Đóng gói,',
    'd0': 'không', 'd1': 'một', 'd2': 'hai', 'd3': 'ba', 'd4': 'bốn', 'd5': 'năm', 'd6': 'sáu', 'd7': 'bảy', 'd8': 'tám', 'd9': 'chín',
    'muoi': 'mười', 'muoi2': 'mươi', 'mot2': 'mốt', 'lam': 'lăm', 'tram': 'trăm', 'linh': 'linh', 'nghin': 'nghìn',
}
SO = {'d0': 'không', 'd1': 'một', 'd2': 'hai', 'd3': 'ba', 'd4': 'bốn', 'd5': 'năm', 'd6': 'sáu', 'd7': 'bảy', 'd8': 'tám', 'd9': 'chín',
      'muoi': 'mười', 'muoi2': 'mươi', 'mot2': 'mốt', 'lam': 'lăm', 'tram': 'trăm', 'linh': 'linh', 'nghin': 'nghìn'}
WEB = dict(SO, **{
    'ngay': 'Ngày', 'thang': 'tháng', 'cham': '.',
    'ban_gui': 'Bạn gửi', 'cong_doan': 'công đoạn,', 'tong': 'tổng cộng', 'cai': 'cái,', 'loi': 'lỗi.', 'khong_loi': 'không có lỗi.', 'dung_chua': 'Đúng chưa?',
    'da_gui': 'Đã gửi xong. Cảm ơn bạn!', 'chuoi1': 'Bạn đã gửi đều', 'chuoi2': 'ngày liền. Giỏi lắm!',
    'sai': 'Có ô nhập chưa đúng. Bạn xem lại nhé.',
    'con_ngay': 'Còn ngày', 'chua_nhap': 'chưa nhập sản lượng. Nhớ nhập trước hạn nhé.',
    'chuc_mung': 'Chúc mừng! Tháng này bạn đã lên', 'lD': 'loại D.', 'lC': 'loại C.', 'lB': 'loại B.', 'lA': 'loại A.', 'lAp': 'loại A cộng.', 'lS': 'loại S.',
    'nghi': 'Đã đến giờ nghỉ giữa ca. Uống chút nước nhé.',
    'chao_sang': 'Chào buổi sáng! Chúc một ngày làm việc tốt.', 'chao_chieu': 'Chào buổi chiều! Chúc ca làm việc suôn sẻ.', 'chao_dem': 'Chào bạn! Chúc ca đêm thuận lợi.',
    'bat': 'Đã bật giọng nói của Rhino.',
})
del WEB['cham']
FF = imageio_ffmpeg.get_ffmpeg_exe()
CAT = '-45dB'
LOC = f'silenceremove=start_periods=1:start_threshold={CAT},areverse,silenceremove=start_periods=1:start_threshold={CAT},areverse'

async def thu(giong, chu, ra):
    await edge_tts.Communicate(chu, giong, rate='+0%').save(ra)

def main():
    goc = pathlib.Path(__file__).resolve().parent
    web = sys.argv[1:] == ['web']
    giong, manh = ({'nu': GIONG['nu']}, WEB) if web else (GIONG, MANH)
    kq = {}
    with tempfile.TemporaryDirectory() as tmp:
        for k, g in giong.items():
            kq[k] = {}
            for ma, chu in manh.items():
                a, b = f'{tmp}/{k}_{ma}.mp3', f'{tmp}/{k}_{ma}_c.mp3'
                asyncio.run(thu(g, chu, a))
                subprocess.run([FF, '-v', 'error', '-y', '-i', a, '-af', LOC, '-ac', '1', '-ar', '24000', '-b:a', '40k', b], check=True)
                kq[k][ma] = base64.b64encode(pathlib.Path(b).read_bytes()).decode()
                print(k, ma, len(kq[k][ma]), file=sys.stderr)
    (goc / ('giong-web.json' if web else 'giong.json')).write_text(json.dumps(kq['nu'] if web else kq, sort_keys=True), encoding='utf-8')
    print('ok', sum(len(v) for g in kq.values() for v in g.values()))

main()
