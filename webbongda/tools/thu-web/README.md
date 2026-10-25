# Chạy thử web bóng đá không cần Apps Script

1. Tải dữ liệu sheet (sheet đang để "ai có link cũng xem được"):
   `for s in Doi CauThu TranDau SuKien DoiHinh Media PhongBan LuotBoc CauHinh NhanSu; do curl -sSL -o sheet/$s.csv "https://docs.google.com/spreadsheets/d/1k8zaZhkRM88Oye0zcKvD6q7PHv9KetTvNmY9xCYR6bE/gviz/tq?tqx=out:csv&sheet=$s"; done`
   (thư mục `sheet/` bị .gitignore vì CauHinh có mật khẩu — không commit.)
2. `node nap.js ../../Code.gs` → chạy `napDuLieu` với Sheet giả, ghi `data.json`.
3. `node chup.js ../../Index.html ra-anh [tab] [rộng] [maTran]` → chụp trang (tab: home, lich, hinh, the, media, dsdk; maTran để mở "Xem đội hình 2 đội").
