# Mở danh sách chờ rà soát

Áp dụng migrations/202611240001_waitlist.sql trên Supabase của dự án. Server dùng SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, BETA_FROM_EMAIL (địa chỉ gửi đã xác minh) và APP_ORIGIN (origin HTTPS chính thức). REVIEW_WAITLIST_ENABLED=true bật form. Chỉ bật cho bản preview nội bộ trước, dùng origin riêng của preview. Các biến này đều ở phía server.

Dùng hộp thư do dự án kiểm soát để đăng ký trên preview. Kiểm tra cả thư đến và thư rác. Mở liên kết xác nhận, bấm xác nhận, thử bấm lại và đăng ký trùng. Kiểm tra hủy bằng liên kết trong thư. SMTP và email thương mại thực tế cần được kiểm tra bằng chính địa chỉ gửi sẽ dùng khi mở. Sau thử nghiệm mới mở form công khai. Có thể tắt riêng form bằng REVIEW_WAITLIST_ENABLED=false; liên kết hủy vẫn xử lý được.

Trong SQL Editor, chạy:

    select coalesce(sum(qualified),0) as qualified_of_100 from public.review_waitlist_progress;
    select * from public.review_waitlist_progress order by source,stage,focus;

Các số chỉ gồm email xác nhận còn hiệu lực. qualified loại giai đoạn đang tìm hiểu. Mốc 100 không giới hạn số người có thể đăng ký.

# Phiếu thử với người mua nhà lần đầu

Mời 5 người tự làm trên điện thoại với cùng dữ liệu giả định. Dùng căn nhà 2,5 tỷ, trả trước 500 triệu, tiết kiệm 700 triệu, thu nhập 55 triệu/tháng, chi 30 triệu/tháng, không có nợ khác. Vay 20 năm, gốc đều, không ân hạn, ưu đãi 7% trong 12 tháng, sau đó dùng mức minh họa 12%. Người quan sát không thao tác hộ. Ghi mỗi người bằng mã ẩn danh.

1. Nhập số và nhận biết mức lãi suất cần hỏi lại ngân hàng.
2. Nói lại khoản trả ở tháng đầu và sau ưu đãi.
3. Nói tháng 13 gia đình còn dư hay thiếu, khoảng bao nhiêu.
4. Thử giảm thu nhập trong 3 tháng rồi quay về số ban đầu.
5. Mở bản in và chỉ ra giả định lãi suất dùng trong bản in.

Ghi bước bị kẹt, lỗi đọc ngược dư/thiếu, nhầm tiết kiệm với trả trước và nhầm lãi minh họa với báo giá. Mục tiêu ít nhất 4/5 hoàn thành không cần trợ giúp. Sửa và thử lại khi có hiểu nhầm thuộc ba nhóm trên.
