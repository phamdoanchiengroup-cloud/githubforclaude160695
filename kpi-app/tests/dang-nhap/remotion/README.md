# Video nền màn đăng nhập (Remotion)

`nen.jsx` dựng video lặp 10 giây cho màn đăng nhập "Khắc laser": ảnh nền `anh/rhino/khac-laser.jpg` đứng yên
(để chữ khắc laser vẫn khớp ngọn cơ số 3), chỉ thêm luồng sáng, vệt sáng quét qua ngọn cơ, bụi bay và đốm lóe trên hạt carbon.

```bash
mkdir rm && cd rm && echo '{"private":true}' > package.json
npm i remotion@4.0.534 @remotion/cli@4.0.534 react@18.3.1 react-dom@18.3.1
mkdir -p src public && cp ../kpi-app/tests/dang-nhap/remotion/nen.jsx src/ && cp ../kpi-app/anh/rhino/khac-laser.jpg public/
npx remotion render src/nen.jsx Nen nen.mp4 --codec=h264 --crf=30 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```
Kết quả: `kpi-app/anh/rhino/nen-khac-laser.mp4` (1600×900, 24 hình/giây, ~400 KB).
