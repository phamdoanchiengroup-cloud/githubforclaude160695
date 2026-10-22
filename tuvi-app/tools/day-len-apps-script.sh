#!/usr/bin/env bash
# Đẩy mã Thiên Cơ Các (tuvi-app/*.gs, *.html) lên dự án Apps Script bằng clasp, rồi (tùy chọn) cập nhật bản triển khai web.
# Dùng trong GitHub Actions (.github/workflows/day-len-apps-script.yml) hoặc chạy tay trên máy đã "clasp login".
# Biến môi trường:
#   SCRIPT_ID      (bắt buộc) Mã tập lệnh – Apps Script › ⚙ Cài đặt dự án › Mã tập lệnh
#   DEPLOYMENT_ID  (tùy chọn) Mã triển khai web app – có thì tự làm bước "Phiên bản mới → Triển khai", link web giữ nguyên
#   CLASP          (tùy chọn) lệnh clasp, mặc định "npx -y @google/clasp@2.4.2"
#   GHI_CHU        (tùy chọn) mô tả phiên bản
# An toàn: file đang có trên Apps Script mà repo không có (vd. ảnh riêng, file tự thêm) được GIỮ NGUYÊN, không bị xóa.
#          Manifest appsscript.json lấy theo bản đang chạy trên Apps Script (giữ quyền truy cập, múi giờ đã cài).
set -euo pipefail
: "${SCRIPT_ID:?Thiếu SCRIPT_ID}"
CLASP=${CLASP:-"npx -y @google/clasp@2.4.2"}
NGUON="$(cd "$(dirname "$0")/.." && pwd)"
TAM="$(mktemp -d)"; trap 'rm -rf "$TAM"' EXIT
mkdir -p "$TAM/keo" "$TAM/day"
CAU_HINH="{\"scriptId\":\"$SCRIPT_ID\",\"rootDir\":\".\",\"fileExtension\":\"gs\"}"

echo "▶ 1/4 Kéo bản đang chạy trên Apps Script về để đối chiếu"
( cd "$TAM/keo" && echo "$CAU_HINH" > .clasp.json && $CLASP pull >/dev/null )

echo "▶ 2/4 Gom file từ repo"
cp "$NGUON"/*.gs "$NGUON"/*.html "$TAM/day/"
if [ -f "$TAM/keo/appsscript.json" ]; then cp "$TAM/keo/appsscript.json" "$TAM/day/"; else cp "$NGUON/appsscript.json" "$TAM/day/"; fi
GIU=""
for f in "$TAM/keo"/*.gs "$TAM/keo"/*.html; do
  [ -e "$f" ] || continue
  b="$(basename "$f")"
  if [ ! -e "$TAM/day/$b" ]; then cp "$f" "$TAM/day/"; GIU="$GIU $b"; fi
done
if [ -n "$GIU" ]; then echo "  Giữ nguyên file chỉ có trên Apps Script:$GIU"; fi
echo "  Số file sẽ đẩy: $(ls "$TAM/day" | wc -l)"

echo "▶ 3/4 Đẩy mã lên Apps Script"
( cd "$TAM/day" && echo "$CAU_HINH" > .clasp.json && $CLASP push -f )

if [ -n "${DEPLOYMENT_ID:-}" ]; then
  echo "▶ 4/4 Tạo phiên bản mới và cập nhật bản triển khai web (link giữ nguyên)"
  ( cd "$TAM/day" && $CLASP deploy -i "$DEPLOYMENT_ID" -d "${GHI_CHU:-Tự đẩy từ GitHub}" )
else
  echo "▶ 4/4 Bỏ qua cập nhật triển khai (chưa có DEPLOYMENT_ID) – vào Apps Script bấm Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai"
fi
echo "✔ Xong"
