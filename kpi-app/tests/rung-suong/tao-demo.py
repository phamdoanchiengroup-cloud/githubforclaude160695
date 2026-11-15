# Dựng bản demo Rừng Sương: chèn rung-suong.css + .js vào BẢN XEM THỬ (tạo bằng tests/tao-ban-xem-thu.js, số liệu đã ẩn danh).
# Dùng: python3 tao-demo.py <bản xem thử .html> <file ra .html>   (file ra KHÔNG commit – có số liệu sản xuất thật)
import io,os,sys
D=os.path.dirname(os.path.abspath(__file__))
s=io.open(sys.argv[1],encoding='utf-8').read()
css=io.open(os.path.join(D,'rung-suong.css'),encoding='utf-8').read()
js=io.open(os.path.join(D,'rung-suong.js'),encoding='utf-8').read()
font=''   # giữ font hiện tại của web (yêu cầu 16/11)
i=s.rfind('</body>'); assert i>0
s=s[:i]+font+'<style id="rsCss">'+css+'</style><script>window.RS_DEMO=1;'+js+'</script>'+s[i:]
s=s.replace('\x00','\\u0000')   # NUL thô trong chuỗi JS: trình duyệt đổi thành U+FFFD -> viết dạng thoát
io.open(sys.argv[2],'w',encoding='utf-8').write(s); print('OK',sys.argv[2],len(s)//1024,'KB')
