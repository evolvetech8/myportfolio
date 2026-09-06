import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  ArrowUpIcon, 
  PhoneIcon, 
  BookOpenIcon, 
  RefreshCwIcon, 
  QrCodeIcon 
} from './Icons';

export default function ClientReadOnlyPortal({ client, onClose, onOpenFullLedger }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'remittance' | 'books' | 'invoices'
  const [copiedLink, setCopiedLink] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const overlayRef = useRef(null);

  // Security & Authentication State (Decree 13/2023 & Circular 152/2025)
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [phoneInput, setPhoneInput] = useState(client?.phone || '0988123456');
  const [otpStep, setOtpStep] = useState('phone');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sessionExpiry] = useState('118 phút còn lại (Phiên 2 giờ)');

  // Prevent background body scrolling while modal is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Track scroll position to display Back to Top button
  const handleOverlayScroll = (e) => {
    if (e.currentTarget.scrollTop > 180) {
      if (!showScrollTop) setShowScrollTop(true);
    } else {
      if (showScrollTop) setShowScrollTop(false);
    }
  };

  const handleScrollToTop = () => {
    if (overlayRef.current) {
      overlayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!client) return null;

  const shareablePortalUrl = 'https://www.evolvetech.biz.vn/demo/lan';

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

  const portalContent = (
    <div 
      className="client-portal-overlay" 
      ref={overlayRef}
      onScroll={handleOverlayScroll}
    >
      <div className="client-portal-modal glass-panel">
        
        {/* TOP CALLOUT BANNER (Demo Persona Context) */}
        <div className="portal-top-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="portal-top-badge">
              DEMO 3: CÔ PHẠM THỊ LAN
            </span>
            <span className="portal-top-title">
              Chủ Quán Phở Lan (Doanh thu 1.5 tỷ) - Trải Nghiệm Zalo Mobile Dành Cho Khách Hàng
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#00f5d4', fontWeight: 600, background: 'rgba(0, 245, 212, 0.12)', padding: '3px 10px', borderRadius: '4px', border: '1px solid rgba(0, 245, 212, 0.25)' }}>
              Đã tách 250M tiền con gửi miễn thuế theo Điều 4 TT152
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              /demo/lan
            </span>
          </div>
        </div>

        {/* CPA FIRM HEADER BAR */}
        <div className="portal-cpa-bar">
          <div className="portal-cpa-brand">
            <div className="portal-cpa-logo-chip">
              <LandmarkIcon size={15} color="#FFA100" />
              <span>ĐẠI LÝ THUẾ &amp; DỊCH VỤ KẾ TOÁN AN BÌNH</span>
            </div>
            <span style={{ color: '#64748b' }}>•</span>
            <span className="portal-cpa-tag">Cổng Tra Cứu Khách Hàng (Công nghệ A-Sổ)</span>
          </div>

          <div className="portal-actions-group">
            <button
              type="button"
              className="portal-btn-ghost"
              onClick={() => setIsOtpVerified(!isOtpVerified)}
            >
              {isOtpVerified ? 'Thử Màn Hình OTP Khách' : 'Bỏ Qua Xác Thực (Xem Thử)'}
            </button>

            <button 
              type="button" 
              className="portal-btn-ghost"
              onClick={copyShareLink}
              title="Sao chép liên kết cổng đăng nhập bảo mật gửi cho Cô Lan"
            >
              {copiedLink ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#00f5d4' }}>
                  <CheckIcon size={13} color="#00f5d4" />
                  <span>Đã sao chép link</span>
                </span>
              ) : (
                <span>Sao chép link gửi Cô Lan</span>
              )}
            </button>

            <button 
              type="button" 
              className="portal-close-icon-btn" 
              onClick={onClose} 
              title="Đóng cổng tra cứu"
            >
              <CloseIcon size={18} color="currentColor" />
            </button>
          </div>
        </div>

        {/* SECURITY CHALLENGE SCREEN IF NOT VERIFIED */}
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
              Để bảo vệ dữ liệu tài chính theo <strong>Nghị định 13/2023/NĐ-CP</strong>, vui lòng nhập số điện thoại chủ hộ đã đăng ký tại đại lý thuế An Bình.
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
                    <span>Xác Thực &amp; Xem Báo Cáo</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* AUTHENTICATED PORTAL WORKSPACE */
          <>
            {/* SESSION SECURITY RIBBON */}
            <div className="portal-sec-ribbon">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f5d4' }}>
                <ShieldIcon size={13} color="#00f5d4" />
                <span>Phiên Xác Thực Bảo Mật (OTP Verified): <strong>{sessionExpiry}</strong></span>
              </div>
              <div>
                Phạm vi: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>scope: client_read_only</span> (Bảo vệ chống sửa công thức sổ kế toán)
              </div>
            </div>

            {/* 2-COLUMN BODY LAYOUT: LEFT CONTEXTUAL SIDEBAR + RIGHT MAIN CONTENT */}
            <div className="portal-layout-grid">
              
              {/* LEFT SIDEBAR: CLIENT IDENTITY & CONTEXTUAL NAVIGATION */}
              <aside className="portal-sidebar">
                
                {/* Client Profile Card */}
                <div className="portal-sidebar-profile">
                  <div className="portal-avatar-row">
                    <div className="portal-avatar-box-lg">
                      <span>QU</span>
                    </div>
                    <div>
                      <h2 className="portal-client-heading">{client.name}</h2>
                      <div className="portal-client-subheading">Chủ hộ: {client.owner} (52 tuổi)</div>
                    </div>
                  </div>

                  <div className="portal-meta-details">
                    <div>MST: <strong>{client.mst}</strong></div>
                    <div style={{ marginTop: '2px' }}>Địa chỉ: <strong>{client.address}</strong></div>
                    <div style={{ marginTop: '2px' }}>Ngành: <strong>{client.industry}</strong></div>
                    <span className="portal-regime-tag">
                      {client.taxRegime === 'group1' && 'Nhóm 1: Mẫu S1a-HKD (< 500M)'}
                      {client.taxRegime === 'group2' && 'Nhóm 2: Mẫu S2a-HKD (Thuế % Doanh Thu)'}
                      {client.taxRegime === 'group3' && 'Nhóm 3: Kê Khai Đầy Đủ Chi Phí'}
                    </span>
                  </div>
                </div>

                {/* Accountant in Charge Box */}
                <div className="portal-accountant-card">
                  <div className="accountant-card-title">
                    <ShieldIcon size={12} color="#00f5d4" />
                    <span>Kế toán phụ trách trọn gói</span>
                  </div>
                  <div className="accountant-card-name">Chị Nguyễn Thị Hương</div>
                  <div className="accountant-card-desc">
                    Cô Lan chỉ việc bán phở, toàn bộ sổ sách và thủ tục khai thuế với Cục Thuế đã có Chị Hương lo chu toàn.
                  </div>
                  <button 
                    type="button" 
                    className="portal-zalo-cta-btn"
                    onClick={() => setShowContactModal(true)}
                  >
                    <PhoneIcon size={13} color="currentColor" />
                    <span>Nhắn Zalo Báo Tiền Riêng Cho Chị Hương</span>
                  </button>
                </div>

                {/* Contextualized Navigation Menu */}
                <nav className="portal-sidebar-nav">
                  <div className="portal-nav-section-label">Mục Tra Cứu Dành Cho Chủ Hộ</div>

                  {/* Nav Item 1 */}
                  <button
                    type="button"
                    className={`portal-nav-item ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    <div className="portal-nav-icon">
                      <FileTextIcon size={18} color="currentColor" />
                    </div>
                    <div className="portal-nav-text-col">
                      <span className="portal-nav-title">3 Con Số Minh Bạch</span>
                      <span className="portal-nav-sub">Doanh thu 1.5 tỷ &amp; Thuế 67.5M</span>
                    </div>
                  </button>

                  {/* Nav Item 2 */}
                  <button
                    type="button"
                    className={`portal-nav-item ${activeTab === 'remittance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('remittance')}
                  >
                    <div className="portal-nav-icon">
                      <ShieldIcon size={18} color="currentColor" />
                    </div>
                    <div className="portal-nav-text-col">
                      <span className="portal-nav-title">Bóc Tách Tiền Riêng</span>
                      <span className="portal-nav-sub">250M con gửi miễn thuế TT152</span>
                    </div>
                  </button>

                  {/* Nav Item 3 */}
                  <button
                    type="button"
                    className={`portal-nav-item ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => setActiveTab('books')}
                  >
                    <div className="portal-nav-icon">
                      <BookOpenIcon size={18} color="currentColor" />
                    </div>
                    <div className="portal-nav-text-col">
                      <span className="portal-nav-title">Sổ Kế Toán Thông Tư 152</span>
                      <span className="portal-nav-sub">Kế toán đã ký duyệt (Tải Excel)</span>
                    </div>
                  </button>

                  {/* Nav Item 4 */}
                  <button
                    type="button"
                    className={`portal-nav-item ${activeTab === 'invoices' ? 'active' : ''}`}
                    onClick={() => setActiveTab('invoices')}
                  >
                    <div className="portal-nav-icon">
                      <CheckCircleIcon size={18} color="currentColor" />
                    </div>
                    <div className="portal-nav-text-col">
                      <span className="portal-nav-title">Hóa Đơn &amp; Dòng Tiền</span>
                      <span className="portal-nav-sub">156 HĐĐT MTT (Nghị định 70)</span>
                    </div>
                  </button>
                </nav>

                {/* Sidebar Security Footer */}
                <div className="portal-sidebar-footer">
                  <LockIcon size={14} color="#64748b" />
                  <span>Bảo mật theo NĐ 13/2023 • Không thể tự ý sửa số liệu</span>
                </div>

              </aside>

              {/* RIGHT MAIN PANEL: ACTIVE VIEW */}
              <main className="portal-main-panel">
                
                {/* TAB 1: 3 CON SỐ MINH BẠCH (DOANH THU & NGHĨA VỤ THUẾ) */}
                {activeTab === 'summary' && (
                  <>
                    {/* Reassurance Banner */}
                    <div className="portal-reassurance-box">
                      <div className="reassurance-left">
                        <ShieldIcon size={24} color="#fbbf24" style={{ flexShrink: 0 }} />
                        <div>
                          <div className="reassurance-title">
                            Báo Cáo Thuế Dành Cho {client.owner} ({client.name})
                          </div>
                          <div className="reassurance-sub">
                            Phụ trách kế toán: <strong style={{ color: '#00f5d4' }}>Chị Nguyễn Thị Hương</strong> • Số liệu được cập nhật tự động từ máy tính tiền POS và tài khoản VietQR.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowContactModal(true)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '7px 14px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <PhoneIcon size={12} />
                        <span>Báo Khoản Thu Chi Mới</span>
                      </button>
                    </div>

                    {/* 4 Core Metric Cards */}
                    <div className="portal-kpi-grid">
                      <div className="portal-kpi-card" style={{ borderLeft: '3px solid #00f5d4' }}>
                        <div className="kpi-label">Tiền Bán Hàng Lũy Kế 2026</div>
                        <div className="kpi-value highlight-cyan">{fmt(client.annualRevenue || 1500000000)}</div>
                        <div className="kpi-subtext">Doanh thu bán phở thực tế qua quét mã VietQR và quầy thu ngân</div>
                      </div>

                      <div className="portal-kpi-card" style={{ borderLeft: '3px solid #FFA100' }}>
                        <div className="kpi-label">Thuế Dự Kiến Phải Đóng</div>
                        <div className="kpi-value highlight-amber">{fmt(client.estimatedTax || 67500000)}</div>
                        <div className="kpi-subtext">Chị Hương đã tính trọn gói theo thuế suất {client.taxRate || '4.5%'} (TT152)</div>
                      </div>

                      <div className="portal-kpi-card" style={{ borderLeft: '3px solid #4ade80' }}>
                        <div className="kpi-label">Tiền Con Gửi &amp; Tiền Riêng (ĐÃ TÁCH MIỄN THUẾ)</div>
                        <div className="kpi-value highlight-green">{fmt(client.excludedFlow || 250000000)}</div>
                        <div className="kpi-subtext" style={{ color: '#4ade80' }}>
                          Đã tách riêng theo Điều 4 TT152 • Cục Thuế KHÔNG tính thuế khoản này
                        </div>
                      </div>

                      <div className="portal-kpi-card" style={{ borderLeft: '3px solid #38bdf8' }}>
                        <div className="kpi-label">Hóa Đơn Máy Tính Tiền (NĐ 70)</div>
                        <div className="kpi-value highlight-blue">{client.invoicesIssued || 156} hóa đơn</div>
                        <div className="kpi-subtext">Đã truyền trực tiếp lên Cổng HĐĐT Cục Thuế • Đúng luật 100%</div>
                      </div>
                    </div>

                    {/* Decree 70/2025 Milestone Gauge */}
                    <div className="portal-nd70-box">
                      <div className="nd70-header">
                        <div>
                          <div className="nd70-badge">NGHỊ ĐỊNH 70/2025/NĐ-CP • HIỆU LỰC 01/06/2025</div>
                          <h3 className="nd70-title">Tiến Độ Ngưỡng Bắt Buộc Hóa Đơn Khởi Tạo Từ Máy Tính Tiền (1 Tỷ Đồng)</h3>
                        </div>
                        <div className="nd70-ratio-text">
                          <strong>{((client.annualRevenue / 1000000000) * 100).toFixed(1)}%</strong>
                          <span className="nd70-threshold-cap">/ 1.000.000.000đ</span>
                        </div>
                      </div>

                      <div className="nd70-progress-track">
                        <div 
                          className="nd70-progress-fill exceeded"
                          style={{ width: `${Math.min(100, (client.annualRevenue / 1000000000) * 100)}%` }}
                        />
                      </div>

                      <p className="nd70-desc">
                        <span className="text-red">
                          Doanh thu lũy kế đã vượt ngưỡng 1 tỷ đồng! Quán Phở Lan thuộc diện bắt buộc sử dụng Hóa đơn điện tử khởi tạo từ máy tính tiền có kết nối dữ liệu với Cơ quan Thuế. Chị Hương đã hoàn tất thủ tục đăng ký dải hóa đơn, cô Lan chỉ cần xuất bill bình thường khi khách ăn phở.
                        </span>
                      </p>
                    </div>

                    {/* Tax Quarters Table */}
                    <div className="portal-tax-table-card">
                      <h4 className="portal-tax-table-title">
                        <CheckCircleIcon size={16} color="#00f5d4" />
                        <span>Bảng Tổng Hợp Nghĩa Vụ Thuế Quý Đã Nộp &amp; Tạm Tính Năm 2026</span>
                      </h4>
                      <table className="portal-tax-table">
                        <thead>
                          <tr>
                            <th>Kỳ Kê Khai</th>
                            <th>Doanh Thu Bán Phở</th>
                            <th>Thuế GTGT (3%)</th>
                            <th>Thuế TNCN (1.5%)</th>
                            <th>Tổng Thuế Nộp</th>
                            <th>Trạng Thái Hồ Sơ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Quý 1/2026</strong></td>
                            <td>380.000.000đ</td>
                            <td>11.400.000đ</td>
                            <td>5.700.000đ</td>
                            <td style={{ color: '#00f5d4', fontWeight: 700 }}>17.100.000đ</td>
                            <td><span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Đã nộp Kho bạc ngày 15/04/2026</span></td>
                          </tr>
                          <tr>
                            <td><strong>Quý 2/2026</strong></td>
                            <td>410.000.000đ</td>
                            <td>12.300.000đ</td>
                            <td>6.150.000đ</td>
                            <td style={{ color: '#00f5d4', fontWeight: 700 }}>18.450.000đ</td>
                            <td><span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Đã nộp Kho bạc ngày 18/07/2026</span></td>
                          </tr>
                          <tr>
                            <td><strong>Quý 3/2026 (Hiện tại)</strong></td>
                            <td>390.000.000đ</td>
                            <td>11.700.000đ</td>
                            <td>5.850.000đ</td>
                            <td style={{ color: '#FFA100', fontWeight: 700 }}>17.550.000đ</td>
                            <td><span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>Chị Hương đang tổng hợp (Hạn 31/10)</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* TAB 2: BÓC TÁCH TIỀN RIÊNG (ĐIỀU 4 TT152) */}
                {activeTab === 'remittance' && (
                  <div className="portal-remittance-deep-card">
                    <div className="remittance-header-badge">
                      <ShieldIcon size={13} color="#4ade80" />
                      <span>QUY CHẾ MIỄN THUẾ ĐIỀU 4 THÔNG TƯ 152/2025/TT-BTC &amp; LUẬT THUẾ GTGT</span>
                    </div>
                    <h3 className="remittance-main-title">
                      Bảo Vệ Khoản Tiền Con Gái Gửi 250 Triệu Đồng Của Cô Lan Không Bị Đánh Thuế Oan
                    </h3>
                    <p className="remittance-main-desc">
                      Cô Lan hoàn toàn yên tâm: Toàn bộ dòng tiền 250.000.000đ do con gái (Lê Thu Trang) gửi về từ Tokyo qua ngân hàng đã được Chị Hương phân loại sang mã dòng tiền loại trừ <strong>RULE-EX-01</strong>. Cơ quan Thuế không có căn cứ pháp lý để tính 4.5% thuế bán phở lên khoản tiền thân nhân này.
                    </p>

                    <div className="remittance-evidence-box">
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>
                        CHI TIẾT CHỨNG TỪ ĐÃ LƯU TRỮ VÀO HỒ SƠ GIẢI TRÌNH THUẾ:
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Thời gian giao dịch:</span>
                        <span className="evidence-val">12/03/2026 10:15:32</span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Ngân hàng thụ hưởng:</span>
                        <span className="evidence-val">Vietcombank - Chi nhánh TP. Hồ Chí Minh</span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Số tiền nhận được:</span>
                        <span className="evidence-val green">+250.000.000 VNĐ</span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Người gửi kiều hối:</span>
                        <span className="evidence-val">Lê Thu Trang (Con gái - Chuyển từ Tokyo, Nhật Bản)</span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Nội dung chuyển khoản:</span>
                        <span className="evidence-val" style={{ color: '#fbbf24', fontStyle: 'italic' }}>
                          "gui me sua mai nha phuong 14 quan 3"
                        </span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Căn cứ pháp lý miễn trừ:</span>
                        <span className="evidence-val">Khoản 1 Điều 4 TT152/2025/TT-BTC (Thu nhập phi kinh doanh)</span>
                      </div>
                      <div className="evidence-row">
                        <span className="evidence-label">Trạng thái xác nhận của Chị Hương:</span>
                        <span className="evidence-val green">Đã đóng dấu hồ sơ bảo vệ • Miễn 100% Thuế GTGT &amp; TNCN (Tiết kiệm 11.250.000đ tiền thuế)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Cô có khoản tiền riêng, tiền bán đất hoặc con cái gửi thêm vào tài khoản?
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowContactModal(true)}
                        style={{
                          background: '#00f5d4',
                          color: '#05101a',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <PhoneIcon size={13} />
                        <span>Khai Báo Khoản Tiền Riêng Cho Chị Hương</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SỔ KẾ TOÁN THÔNG TƯ 152 */}
                {activeTab === 'books' && (
                  <div>
                    <div style={{ marginBottom: '18px' }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#fff' }}>
                        Bộ Sổ Kế Toán Thông Tư 152/2025/TT-BTC Đã Được Ký Duyệt
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                        Toàn bộ sổ sách đã được Đại lý thuế An Bình đối soát và ký số điện tử. Cô Lan có thể tải về file Excel chuẩn Bộ Tài Chính để lưu trữ nếu cần.
                      </p>
                    </div>

                    <div className="portal-books-container">
                      {/* Book 1: S2a-HKD */}
                      <div className="portal-book-item">
                        <div className="book-left-info">
                          <span className="book-badge-code">S2a-HKD</span>
                          <div>
                            <div className="book-title-txt">
                              Sổ chi tiết doanh thu bán hàng hóa, dịch vụ (Theo tỷ lệ % thuế)
                            </div>
                            <div className="book-status-txt">
                              Đã khóa dữ liệu • Áp dụng cho hộ kinh doanh nhóm 2 nộp thuế theo % doanh thu
                            </div>
                          </div>
                        </div>

                        <div className="book-actions-right">
                          <span className="verified-seal-tag">
                            <CheckCircleIcon size={14} color="#00f5d4" />
                            <span>Đã ký duyệt</span>
                          </span>
                          <button 
                            type="button" 
                            className="btn-download-excel"
                            onClick={() => alert('Đang tải tệp S2a-HKD định dạng Excel chuẩn Bộ Tài Chính...')}
                          >
                            <DownloadIcon size={13} />
                            <span>Tải Excel Mẫu BTC</span>
                          </button>
                        </div>
                      </div>

                      {/* Book 2: S2e-HKD */}
                      <div className="portal-book-item">
                        <div className="book-left-info">
                          <span className="book-badge-code">S2e-HKD</span>
                          <div>
                            <div className="book-title-txt">
                              Sổ chi tiết tiền mặt và tiền gửi ngân hàng (Tài khoản VietQR)
                            </div>
                            <div className="book-status-txt">
                              Theo dõi toàn bộ biến động tài khoản thanh toán quét mã MBBank và Vietcombank
                            </div>
                          </div>
                        </div>

                        <div className="book-actions-right">
                          <span className="verified-seal-tag">
                            <CheckCircleIcon size={14} color="#00f5d4" />
                            <span>Đã ký duyệt</span>
                          </span>
                          <button 
                            type="button" 
                            className="btn-download-excel"
                            onClick={() => alert('Đang tải tệp S2e-HKD định dạng Excel chuẩn Bộ Tài Chính...')}
                          >
                            <DownloadIcon size={13} />
                            <span>Tải Excel Mẫu BTC</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: HÓA ĐƠN & DÒNG TIỀN VIETQR (NGHỊ ĐỊNH 70) */}
                {activeTab === 'invoices' && (
                  <div>
                    <div style={{ marginBottom: '18px' }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#fff' }}>
                        Nhật Ký Khớp Nối Dòng Tiền VietQR &amp; Hóa Đơn Điện Tử Máy Tính Tiền
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                        Minh bạch 100% dòng tiền vào tài khoản ngân hàng. Từng giao dịch khách quét mã trả tiền phở được tự động đối soát với hóa đơn máy tính tiền truyền lên Cơ quan Thuế.
                      </p>
                    </div>

                    <div className="portal-feed-container">
                      <div className="portal-feed-item">
                        <span className="feed-time">05/09/2026 12:45</span>
                        <span className="feed-desc">
                          Khách quét mã VietQR MBBank: <strong>+350.000đ</strong> • Khớp HĐĐT MTT số #HD-00156
                        </span>
                        <span className="feed-badge matched">Đã truyền Cục Thuế</span>
                      </div>

                      <div className="portal-feed-item">
                        <span className="feed-time">04/09/2026 18:30</span>
                        <span className="feed-desc">
                          Khách quét mã VietQR Vietcombank: <strong>+820.000đ</strong> • Khớp HĐĐT MTT số #HD-00155
                        </span>
                        <span className="feed-badge matched">Đã truyền Cục Thuế</span>
                      </div>

                      <div className="portal-feed-item">
                        <span className="feed-time">03/09/2026 09:15</span>
                        <span className="feed-desc">
                          Tiền chuyển khoản cá nhân: <strong>+15.000.000đ</strong> • Phân loại Dòng tiền loại trừ (RULE-EX-01)
                        </span>
                        <span className="feed-badge excluded">Không tính thuế</span>
                      </div>

                      <div className="portal-feed-item">
                        <span className="feed-time">02/09/2026 20:10</span>
                        <span className="feed-desc">
                          Khách quét mã VietQR MBBank: <strong>+420.000đ</strong> • Khớp HĐĐT MTT số #HD-00154
                        </span>
                        <span className="feed-badge matched">Đã truyền Cục Thuế</span>
                      </div>
                    </div>
                  </div>
                )}

              </main>
            </div>

            {/* FLOATING SCROLL TO TOP BUTTON (Guarantees user can always return to top effortlessly) */}
            {showScrollTop && (
              <button 
                type="button" 
                className="portal-scroll-top-btn"
                onClick={handleScrollToTop}
                title="Cuộn lên đầu trang"
              >
                <ArrowUpIcon size={15} color="currentColor" />
                <span>Lên Đầu Trang</span>
              </button>
            )}

            {/* PORTAL FOOTER STRIP */}
            <footer className="portal-footer-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldIcon size={13} color="#00f5d4" />
                <span>Dữ liệu kế toán được bảo trợ bởi Đại lý thuế An Bình • Hệ thống A-Sổ tuân thủ Thông tư 152/2025/TT-BTC &amp; NĐ 70/2025</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowContactModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00f5d4',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Gửi câu hỏi cho Chị Hương
              </button>
            </footer>
          </>
        )}

      </div>

      {/* DIRECT INQUIRY SUB-MODAL */}
      {showContactModal && (
        <div className="portal-inquiry-modal-backdrop">
          <div className="portal-inquiry-modal glass-panel">
            <div className="inquiry-header">
              <h4>Gửi Yêu Cầu Cho Kế Toán Nguyễn Thị Hương</h4>
              <button type="button" onClick={() => setShowContactModal(false)}><CloseIcon size={14} /></button>
            </div>
            {inquirySent ? (
              <div className="inquiry-success-msg">
                <CheckCircleIcon size={24} color="#00f5d4" />
                <p>Yêu cầu của cô Lan đã được chuyển trực tiếp tới Zalo của Chị Hương. Chị Hương sẽ kiểm tra số liệu và gọi lại cho cô trong vòng 15 phút.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry}>
                <p className="inquiry-intro">Báo khoản tiền riêng mới nhận, tiền con gửi, hoặc thắc mắc về số thuế:</p>
                <textarea 
                  rows={4}
                  required
                  placeholder="Ví dụ: Hôm nay có khoản chuyển 20 triệu từ em trai gửi trả tiền mượn, đề nghị chị Hương chuyển sang dòng tiền riêng không tính thuế giúp cô..."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="inquiry-textarea"
                />
                <div className="inquiry-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowContactModal(false)}>Hủy</button>
                  <button type="submit" className="btn-submit">Gửi Tin Nhắn Cho Chị Hương</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );

  // Mount directly to document.body via React Portal to prevent any stacking context or z-index traps
  if (typeof document !== 'undefined') {
    return createPortal(portalContent, document.body);
  }

  return portalContent;
}
