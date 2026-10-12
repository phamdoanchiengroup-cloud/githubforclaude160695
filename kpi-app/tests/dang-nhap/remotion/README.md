# Video nền màn đăng nhập (Remotion)

`nen.jsx` dựng video lặp 10 giây cho màn đăng nhập "Khắc laser": ảnh nền `anh/rhino/khac-laser.jpg` đứng yên
(để chữ khắc laser vẫn khớp ngọn cơ số 3), chỉ thêm luồng sáng, vệt sáng quét qua ngọn cơ, bụi bay và đốm lóe trên hạt carbon.

```bash
mkdir rm && cd rm && echo '{"private":true}' > package.json
npm i remotion@4.0.534 @remotion/cli@4.0.534 react@18.3.1 react-dom@18.3.1
mkdir -p src public && cp ../kpi-app/tests/dang-nhap/remotion/nen.jsx src/
# ảnh nền CHẤT LƯỢNG CAO 1920×1080 (cùng cách xử lý như khac-laser.jpg nhưng không thu nhỏ, JPEG 95) -> public/khac-laser.jpg
npx remotion render src/nen.jsx Nen hq.mp4 --codec=h264 --crf=18 --scale=1.2 --jpeg-quality=100 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
$FF -i hq.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 1 -an nen-khac-laser.webm
$FF -i hq.mp4 -c:v libx264 -preset veryslow -tune film -crf 25 -pix_fmt yuv420p -movflags +faststart -an nen-khac-laser.mp4
```
Kết quả (12/10, làm lại vì bản đầu mờ trên máy tính): `kpi-app/anh/rhino/nen-khac-laser.webm` (1920×1080, 24 hình/giây, ~450 KB, SSIM 0,986 so với bản gốc)
và `.mp4` (~730 KB, cho Safari). Bản đầu 1600×900, CRF 30 + ảnh nguồn JPEG 72 nên vỡ khối ở vùng tối (SSIM 0,972).
