# Thu sẵn giọng đọc tiếng Việt (giọng neural của Microsoft Edge, qua gói edge-tts)
# -> tests/am-thanh/giong.json  {giọng: {mã: base64 mp3}}; demo ghép từng mảnh bằng Web Audio.
# Chạy: pip install edge-tts imageio-ffmpeg; python3 tests/am-thanh/tao-giong.py
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
FF = imageio_ffmpeg.get_ffmpeg_exe()
CAT = '-45dB'
LOC = f'silenceremove=start_periods=1:start_threshold={CAT},areverse,silenceremove=start_periods=1:start_threshold={CAT},areverse'

async def thu(giong, chu, ra):
    await edge_tts.Communicate(chu, giong, rate='+0%').save(ra)

def main():
    goc = pathlib.Path(__file__).resolve().parent
    kq = {}
    with tempfile.TemporaryDirectory() as tmp:
        for k, g in GIONG.items():
            kq[k] = {}
            for ma, chu in MANH.items():
                a, b = f'{tmp}/{k}_{ma}.mp3', f'{tmp}/{k}_{ma}_c.mp3'
                asyncio.run(thu(g, chu, a))
                subprocess.run([FF, '-v', 'error', '-y', '-i', a, '-af', LOC, '-ac', '1', '-ar', '24000', '-b:a', '40k', b], check=True)
                kq[k][ma] = base64.b64encode(pathlib.Path(b).read_bytes()).decode()
                print(k, ma, len(kq[k][ma]), file=sys.stderr)
    (goc / 'giong.json').write_text(json.dumps(kq), encoding='utf-8')
    print('ok', sum(len(v) for g in kq.values() for v in g.values()))

main()
