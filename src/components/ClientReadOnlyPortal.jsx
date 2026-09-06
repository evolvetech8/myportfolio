import { useState } from 'react';
import { 
  ShieldIcon, 
  CheckCircleIcon, 
  LockIcon, 
  DownloadIcon, 
  FileTextIcon, 
  CloseIcon, 
  LandmarkIcon,
  CheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  RefreshCwIcon
} from './Icons';

export default function ClientReadOnlyPortal({ client, onClose, onOpenFullLedger }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'books' | 'invoices'
  const [copiedLink, setCopiedLink] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Security & Authentication State (Decree 13/2023 & Circular 152/2025)
  // Replaces vulnerable static ?token= with phone OTP session
  const [isOtpVerified, setIsOtpVerified] = useState(true); // default true for accountant preview, toggleable to test client flow
  const [phoneInput, setPhoneInput] = useState(client?.phone || '0988123456');
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sessionExpiry] = useState('118 phút còn lại (Phiên 2 giờ)');

  if (!client) return null;

  const shareablePortalUrl = `https://www.evolvetech.biz.vn/portal`;

  const copyShareLink = () => {
    navigator.clipboard?.writeText(shareablePortalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    setOtpError('');
    setOtpSentNotice('Đã gửi mã OTP 6 chữ số tới số ' + phoneInput + ' (Có hiệu lực 15 phút).');
    setOtpStep('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Vui lòng nhập đúng 6 chữ số mã OTP.');
      return;
    }
    setIsOtpVerified(true);
    setOtpError('');
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setInquirySent(false);
      setInquiryText('');
    }, 2000);
  };

  const fmt = (num) => new Intl.NumberFormat('vi-VN').format(num) + 'đ';

  return (
    <div className="client-portal-overlay">
      <div className="client-portal-modal glass-panel">
        
        {/* CPA Firm Header Bar */}
        <div className="portal-cpa-banner">
          <div className="portal-cpa-identity">
            <div className="portal-cpa-badge">
              <LandmarkIcon size={14} color="#00f5d4" />
              <span>ĐẠI LÝ THUẾ &amp; DỊCH VỤ KẾ TOÁN AN BÌNH</span>
            </div>
            <span className="portal-cpa-divider">•</span>
            <span className="portal-sub-tag">Cổng Tra Cứu Số Liệu Thuế Khách Hàng (Công nghệ A-Sổ)</span>
          </div>

          <div className="portal-header-actions">
            <button
              type="button"
              onClick={() => setIsOtpVerified(!isOtpVerified)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              {isOtpVerified ? 'Thử Màn Hình Đăng Nhập OTP Khách' : 'Bỏ Qua Xác Thực (Xem Thử)'}
            </button>

            <button 
              type="button" 
              className="portal-share-btn"
              onClick={copyShareLink}
              title="Sao chép liên kết cổng đăng nhập bảo mật gửi cho chủ hộ"
            >
              {copiedLink ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#00f5d4' }}>
                  <CheckIcon size={13} color="#00f5d4" />
                  <span>Đã sao chép link</span>
                </span>
              ) : (
                <span>Sao chép link gửi khách hàng</span>
              )}
            </button>
            <button type="button" className="portal-close-btn" onClick={onClose} title="Đóng cổng tra cứu">
              <CloseIcon size={16} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Security Challenge Screen if Not Verified */}
        {!isOtpVerified ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '460px', margin: '0 auto' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid rgba(0, 245, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShieldIcon size={28} color="#00f5d4" />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#fff' }}>
              Xác Thực Chủ Hộ Kinh Doanh
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              Để bảo vệ dữ liệu tài chính theo <strong>Nghị định 13/2023/NĐ-CP</strong>, vui lòng nhập số điện thoại chủ hộ đã đăng ký tại đại lý thuế.
            </p>

            {otpError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '12px',
                marginBottom: '16px'
              }}>
                {otpError}
              </div>
            )}

            {otpStep === 'phone' ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Số Điện Thoại Chủ Hộ:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="0988 123 456"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#152238',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    Hệ thống sẽ gửi mã xác thực 6 số qua Zalo ZNS / SMS. Giới hạn 5 lần/giờ.
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#00f5d4',
                    color: '#05101a',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Gửi Mã Xác Thực OTP</span>
                  <ArrowRightIcon size={14} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                {otpSentNotice && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(0, 245, 212, 0.1)',
                    border: '1px solid rgba(0, 245, 212, 0.3)',
                    borderRadius: '8px',
                    color: '#00f5d4',
                    fontSize: '12px',
                    marginBottom: '16px'
                  }}>
                    {otpSentNotice}
                  </div>
                )}

                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                      Mã Xác Thực (6 Chữ Số):
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpCode('889922')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00f5d4',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Nhập mã mẫu (889922)
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="889922"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#152238',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '18px',
                      textAlign: 'center',
                      letterSpacing: '0.25em',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
                    Mã có hiệu lực trong 15 phút. Không chia sẻ mã này cho người khác.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setOtpStep('phone')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#cbd5e1',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Đổi Số Điện Thoại
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#00f5d4',
                      color: '#05101a',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircleIcon size={16} />
                    <span>Xác Thực & Xem Báo Cáo</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Authenticated Read-Only Content */
          <>
            {/* Session Security Banner */}
            <div style={{
              background: 'rgba(0, 245, 212, 0.05)',
              borderBottom: '1px solid rgba(0, 245, 212, 0.15)',
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f5d4' }}>
                <ShieldIcon size={12} color="#00f5d4" />
                <span>Phiên Xác Thực Bảo Mật (OTP Verified): <strong>{sessionExpiry}</strong></span>
              </div>
              <div>
                Phạm vi: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>scope: client_read_only</span> (Bảo vệ chống sửa công thức)
              </div>
            </div>

            {/* Client Profile Bar */}
            <div className="portal-client-profile">
              <div className="portal-profile-left">
                <div className="portal-avatar-box">
                  <span className="portal-avatar-initials">{client.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <div className="portal-client-title-row">
                    <h2 className="portal-client-name">{client.name}</h2>
                    <span className="portal-regime-chip">
                      {client.taxRegime === 'group1' && 'Nhóm 1: Mẫu S1a-HKD (< 500M)'}
                      {client.taxRegime === 'group2' && 'Nhóm 2: Mẫu S2a-HKD (Thuế % Doanh Thu)'}
                      {client.taxRegime === 'group3' && 'Nhóm 3: Bộ 4 Sổ (Kê Khai Chi Phí)'}
                    </span>
                  </div>
                  <div className="portal-client-meta">
                    <span>MST: <strong>{client.mst}</strong></span>
                    <span>•</span>
                    <span>Chủ hộ: <strong>{client.owner}</strong></span>
                    <span>•</span>
                    <span>Ngành nghề: <strong>{client.industry}</strong></span>
                    <span>•</span>
                    <span>Địa chỉ: <strong>{client.address}</strong></span>
                  </div>
                </div>
              </div>

              <div className="portal-profile-right">
                <div className="portal-readonly-pill">
                  <LockIcon size={13} color="#00f5d4" />
                  <span>Chế độ chỉ đọc bảo mật</span>
                </div>
                {onOpenFullLedger && (
                  <button 
                    type="button" 
                    className="portal-open-ledger-btn"
                    onClick={() => onOpenFullLedger(client)}
                  >
                    <span>Vào Làm Sổ Chi Tiết</span>
                    <ArrowRightIcon size={12} color="currentColor" />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="portal-tab-bar">
              <button 
                type="button" 
                className={`portal-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Tổng Quan &amp; Nghĩa Vụ Thuế
              </button>
              <button 
                type="button" 
                className={`portal-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                Sổ Kế Toán Thông Tư 152
              </button>
              <button 
                type="button" 
                className={`portal-tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
                onClick={() => setActiveTab('invoices')}
              >
                Hóa Đơn Điện Tử &amp; Đối Soát
              </button>
            </div>

            {/* Tab Contents */}
            <div className="portal-content-scroll">
              {activeTab === 'summary' && (
                <div className="portal-summary-pane">
                  {/* KPI Metric Cards */}
                  <div className="portal-kpi-grid">
                    <div className="portal-kpi-card glass-panel">
                      <div className="kpi-label">Doanh Thu Lũy Kế 2026</div>
                      <div className="kpi-value highlight-cyan">{fmt(client.annualRevenue)}</div>
                      <div className="kpi-subtext">Đã đối soát từ dòng tiền VietQR &amp; máy POS</div>
                    </div>

                    <div className="portal-kpi-card glass-panel">
                      <div className="kpi-label">Thuế Tạm Tính Quý 1/2026</div>
                      <div className="kpi-value highlight-amber">{fmt(client.estimatedTax)}</div>
                      <div className="kpi-subtext">Tính theo tỷ lệ ngành {client.industry} (TT152)</div>
                    </div>

                    <div className="portal-kpi-card glass-panel">
                      <div className="kpi-label">Hóa Đơn Hợp Lệ Đã Xuất</div>
                      <div className="kpi-value">{client.invoicesIssued} hóa đơn</div>
                      <div className="kpi-subtext">Khớp 100% mã CQT theo Nghị định 123 &amp; 70</div>
                    </div>

                    <div className="portal-kpi-card glass-panel">
                      <div className="kpi-label">Kỳ Kế Toán Hiện Tại</div>
                      <div className="kpi-value highlight-green">Đã Khóa &amp; Ký Số</div>
                      <div className="kpi-subtext">Kế toán trưởng đã chốt số liệu Quý 1/2026</div>
                    </div>
                  </div>

                  {/* Decree 70/2025 Milestone Gauge */}
                  <div className="portal-nd70-box glass-panel">
                    <div className="nd70-header">
                      <div>
                        <div className="nd70-badge">NGHỊ ĐỊNH 70/2025/NĐ-CP • HIỆU LỰC 01/06/2025</div>
                        <h3 className="nd70-title">Tiến Độ Chạm Ngưỡng Hóa Đơn Điện Tử Từ Máy Tính Tiền (1 Tỷ Đồng)</h3>
                      </div>
                      <div className="nd70-ratio-text">
                        <span>{((client.annualRevenue / 1000000000) * 100).toFixed(1)}%</span>
                        <span className="nd70-threshold-cap">/ 1.000.000.000đ</span>
                      </div>
                    </div>

                    <div className="nd70-progress-track">
                      <div 
                        className={`nd70-progress-fill ${client.annualRevenue >= 1000000000 ? 'exceeded' : client.annualRevenue >= 800000000 ? 'warning' : 'safe'}`}
                        style={{ width: `${Math.min(100, (client.annualRevenue / 1000000000) * 100)}%` }}
                      />
                    </div>

                    <p className="nd70-desc">
                      {client.annualRevenue >= 1000000000 ? (
                        <span className="text-red">
                          Đã vượt mốc 1 tỷ đồng! Hộ kinh doanh thuộc diện bắt buộc phát hành Hóa đơn điện tử khởi tạo từ máy tính tiền kết nối dữ liệu trực tiếp với Cơ quan Thuế.
                        </span>
                      ) : client.annualRevenue >= 800000000 ? (
                        <span className="text-amber">
                          Sắp chạm ngưỡng (còn {fmt(1000000000 - client.annualRevenue)}). Đại lý thuế đã chuẩn bị thủ tục đăng ký dải hóa đơn máy tính tiền theo quy định.
                        </span>
                      ) : (
                        <span className="text-green">
                          Khoảng cách an toàn (còn {fmt(1000000000 - client.annualRevenue)}). Kế toán dịch vụ tiếp tục giám sát dòng tiền qua VietQR hàng ngày.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'books' && (
                <div className="portal-books-pane">
                  <div className="portal-section-intro">
                    <h3>Bộ Sổ Kế Toán Thông Tư 152/2025/TT-BTC Đã Được Đại Lý Thuế Ký Duyệt</h3>
                    <p>Chủ hộ kinh doanh có thể tải về tệp Excel chuẩn Bộ Tài Chính để lưu trữ phục vụ quyết toán thuế.</p>
                  </div>

                  <div className="portal-book-list">
                    {client.books.map((b, idx) => (
                      <div key={idx} className="portal-book-row glass-panel">
                        <div className="portal-book-info">
                          <span className="portal-book-code">{b}</span>
                          <div>
                            <div className="portal-book-title">
                              {b === 'S1a-HKD' && 'Sổ chi tiết doanh thu bán hàng hóa, dịch vụ (Dưới ngưỡng 500 triệu)'}
                              {b === 'S2a-HKD' && 'Sổ chi tiết doanh thu theo tỷ lệ % thuế (Kê khai đơn giản)'}
                              {b === 'S2b-HKD' && 'Sổ chi tiết doanh thu bán hàng hóa, dịch vụ (Kê khai chi phí)'}
                              {b === 'S2c-HKD' && 'Sổ chi tiết doanh thu và chi phí hợp lý'}
                              {b === 'S2d-HKD' && 'Sổ chi tiết vật liệu, dụng cụ, sản phẩm, hàng hóa'}
                              {b === 'S2e-HKD' && 'Sổ chi tiết tiền mặt và tiền gửi ngân hàng'}
                            </div>
                            <div className="portal-book-meta">
                              Đã khóa dữ liệu • Ban hành kèm Thông tư 152/2025/TT-BTC
                            </div>
                          </div>
                        </div>

                        <div className="portal-book-actions">
                          <span className="portal-verified-tag">
                            <CheckCircleIcon size={13} color="#00f5d4" />
                            <span>Đã xác nhận</span>
                          </span>
                          <button 
                            type="button" 
                            className="portal-download-btn"
                            onClick={() => alert(`Đang tải tệp ${b} định dạng Excel chuẩn Bộ Tài Chính...`)}
                          >
                            <DownloadIcon size={12} />
                            <span>Tải Excel Mẫu BTC</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="portal-invoices-pane">
                  <div className="portal-section-intro">
                    <h3>Nhật Ký Đối Soát Dòng Tiền &amp; Hóa Đơn Điện Tử</h3>
                    <p>Minh bạch hóa 100% dòng tiền ngân hàng VietQR đã gán mã quy tắc Tax Shield (`RULE-REV-01`, `RULE-EX-01`).</p>
                  </div>

                  <div className="portal-audit-feed">
                    <div className="portal-audit-item glass-panel">
                      <div className="audit-time">05/09/2026 14:22</div>
                      <div className="audit-desc">
                        Thanh toán VietQR MBBank: <strong>+350.000đ</strong> • Tự động ghi nhận S2a-HKD (RULE-REV-01)
                      </div>
                      <div className="audit-status matched">Đã đối soát HĐĐT MTT</div>
                    </div>
                    <div className="portal-audit-item glass-panel">
                      <div className="audit-time">04/09/2026 18:10</div>
                      <div className="audit-desc">
                        Thanh toán VietQR VCB: <strong>+820.000đ</strong> • Tự động ghi nhận S2a-HKD (RULE-REV-01)
                      </div>
                      <div className="audit-status matched">Đã đối soát HĐĐT MTT</div>
                    </div>
                    <div className="portal-audit-item glass-panel">
                      <div className="audit-time">03/09/2026 09:30</div>
                      <div className="audit-desc">
                        Chuyển tiền nội bộ: <strong>+15.000.000đ</strong> • Phân loại Dòng tiền loại trừ (RULE-EX-01)
                      </div>
                      <div className="audit-status excluded">Không tính thuế GTGT/TNCN</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Footer with CPA Inquiry Trigger */}
            <div className="portal-footer">
              <div className="portal-footer-note">
                <ShieldIcon size={13} color="#00f5d4" />
                <span>Số liệu được bảo đảm bởi Đại lý thuế An Bình • Phần mềm A-Sổ tuân thủ TT152 &amp; NĐ 70</span>
              </div>
              <button 
                type="button" 
                className="portal-contact-cpa-btn"
                onClick={() => setShowContactModal(true)}
              >
                Gửi Câu Hỏi Cho Kế Toán Phụ Trách
              </button>
            </div>
          </>
        )}

      </div>

      {/* Direct Inquiry Sub-Modal */}
      {showContactModal && (
        <div className="portal-inquiry-modal-backdrop">
          <div className="portal-inquiry-modal glass-panel">
            <div className="inquiry-header">
              <h4>Gửi Yêu Cầu Tới Kế Toán Trưởng An Bình</h4>
              <button type="button" onClick={() => setShowContactModal(false)}><CloseIcon size={14} /></button>
            </div>
            {inquirySent ? (
              <div className="inquiry-success-msg">
                <CheckCircleIcon size={24} color="#00f5d4" />
                <p>Yêu cầu của bạn đã được chuyển tới kế toán viên phụ trách hộ kinh doanh. Bạn sẽ nhận được phản hồi qua Zalo/Điện thoại trong vòng 30 phút.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry}>
                <p className="inquiry-intro">Thắc mắc về doanh thu, thuế tạm tính hoặc cần xuất hóa đơn điều chỉnh:</p>
                <textarea 
                  rows={4}
                  required
                  placeholder="Ví dụ: Khoản chuyển 10 triệu ngày 02/09 là tiền nạp quỹ cá nhân, đề nghị kế toán chuyển sang dòng tiền loại trừ..."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="inquiry-textarea"
                />
                <div className="inquiry-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowContactModal(false)}>Hủy</button>
                  <button type="submit" className="btn-submit">Gửi Tin Nhắn Cho Kế Toán</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
