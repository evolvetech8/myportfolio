import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  ShieldIcon, 
  QrCodeIcon, 
  LandmarkIcon, 
  FileTextIcon, 
  LockIcon, 
  DownloadIcon,
  CloseIcon
} from '../components/Icons';
import VietQRCheckoutModal from '../components/VietQRCheckoutModal';

export default function TrialMVP() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Phase 1: Authentication State
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'ready'
  const [phone, setPhone] = useState('0988123456');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);

  // Phase 1: Bank Connection State
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankCode: 'MB',
    bankName: 'MBBank (Ngân Hàng Quân Đội)',
    accountNumber: '0353600900',
    accountName: 'NGUYEN VAN AN',
    storeName: 'Tiệm Cà Phê & Bánh Mộc'
  });

  // Phase 2 & 3: Live Ingestion & Ledger State
  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [s1Ledger, setS1Ledger] = useState([]);
  const [justIngested, setJustIngested] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Phase 4: Upgrade Paywall Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const topBanks = [
    { code: 'MB', name: 'MBBank (Ngân Hàng Quân Đội)' },
    { code: 'VCB', name: 'Vietcombank (Ngoại Thương)' },
    { code: 'TCB', name: 'Techcombank (Kỹ Thương)' },
    { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)' },
    { code: 'ACB', name: 'ACB (Á Châu)' },
    { code: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)' },
    { code: 'TPB', name: 'TPBank (Tiên Phong)' },
    { code: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)' }
  ];

  // Helper to trigger the "Magic Trick" (real-time ingestion)
  const triggerVietQRTransaction = (amount = 150000, note = 'Khách thanh toán đồ uống tại quầy') => {
    const txId = `VQR-${Date.now().toString().slice(-6)}`;
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);

    const newTx = {
      id: txId,
      referenceNo: txId,
      amount: amount,
      formatted: `${formattedAmount}đ`,
      bankBrand: bankDetails.bankCode,
      content: note,
      time: 'Vừa xong',
      gateway: 'Napas 247 VietQR'
    };

    // Phase 3: Automated categorization trigger (< 20M VND -> Retail Sales S1-HKD)
    const isRetailAuto = amount < 20000000;
    const newLedgerRow = {
      id: `S1-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      voucherNo: txId,
      description: `${note} — ${bankDetails.storeName}`,
      category: isRetailAuto ? 'Bán lẻ' : 'Cần kiểm tra HĐĐT',
      retailRevenue: isRetailAuto ? amount : 0,
      formattedRetail: isRetailAuto ? `${formattedAmount}đ` : '0đ',
      taxStatus: isRetailAuto ? 'Khớp 100% CQT' : 'Cần HĐĐT NĐ123',
      standard: 'TT88/2021/TT-BTC'
    };

    // Update state synchronously to simulate real-time Supabase Realtime subscription
    setTransactions((prev) => [newTx, ...prev]);
    setS1Ledger((prev) => [newLedgerRow, ...prev]);
    setRevenue((prev) => prev + amount);

    // Audio / Visual Haptic Chime
    setJustIngested(true);
    setActiveToast({
      title: `⚡ Nhận biến động số dư VietQR: +${formattedAmount}đ!`,
      sub: `Tự động đối soát ngân hàng & ghi vào Sổ Doanh Thu (S1-HKD).`
    });

    setTimeout(() => setJustIngested(false), 2400);
    setTimeout(() => setActiveToast(null), 4500);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.trim().length >= 9) {
      setAuthStep('otp');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setAuthStep('ready');
  };

  const handleConnectBank = (e) => {
    e.preventDefault();
    setIsBankConnected(true);
    setShowBankModal(false);
  };

  const copyAccountNumber = () => {
    navigator.clipboard?.writeText(bankDetails.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Custom VietQR URL for merchant
  const customVietQrUrl = `https://img.vietqr.io/image/${bankDetails.bankCode}-${bankDetails.accountNumber}-compact2.png?amount=0&addInfo=${encodeURIComponent(`A-SO ${bankDetails.storeName}`)}&accountName=${encodeURIComponent(bankDetails.accountName)}`;

  return (
    <div className="trial-page">
      {/* Dynamic Ambient Background Glows */}
      <div className="trial-aurora-glow trial-glow-1" aria-hidden="true"></div>
      <div className="trial-aurora-glow trial-glow-2" aria-hidden="true"></div>

      {/* Floating Real-Time Toast Notification */}
      {activeToast && (
        <div className="trial-realtime-toast">
          <span className="toast-beacon"></span>
          <div className="toast-text">
            <strong className="toast-title">{activeToast.title}</strong>
            <span className="toast-sub">{activeToast.sub}</span>
          </div>
        </div>
      )}

      {/* Top Banner: Trial Context Bar */}
      <div className="trial-top-bar glass-panel">
        <div className="trial-badge-wrap">
          <SparklesIcon size={16} color="#FFA100" />
          <span className="trial-status-chip">14 NGÀY DÙNG THỬ MIỄN PHÍ</span>
          <span className="trial-divider">•</span>
          <span className="trial-meta-text">Không cần thẻ tín dụng • Chuẩn Thông tư 88 & NĐ 123</span>
        </div>
        <div className="trial-top-actions">
          <button 
            type="button" 
            className="trial-upgrade-top-btn"
            onClick={() => setShowUpgradeModal(true)}
          >
            <span>Nâng Cấp Bản Quyền Thuế</span>
          </button>
        </div>
      </div>

      <div className="trial-container">
        {/* ========================================================================= */}
        {/* PHASE 1: 60-SECOND ONBOARDING (PHONE AUTH ONLY)                           */}
        {/* ========================================================================= */}
        {authStep !== 'ready' && (
          <div className="trial-auth-wrapper">
            <div className="trial-auth-card glass-panel">
              <div className="auth-header">
                <div className="auth-icon-circle">
                  <LockIcon size={26} color="#FFA100" />
                </div>
                <h1 className="auth-title">
                  {authStep === 'phone' 
                    ? 'Bắt Đầu Dùng Thử A-Sổ Trong 60 Giây' 
                    : 'Nhập Mã Xác Thực OTP'}
                </h1>
                <p className="auth-desc">
                  {authStep === 'phone'
                    ? 'Chỉ cần Số Điện Thoại nhận mã OTP. Tuyệt đối không yêu cầu tạo mật khẩu phức tạp hay thông tin thẻ tín dụng.'
                    : `Mã OTP gồm 6 chữ số đã được gửi tới số điện thoại: ${phone}`}
                </p>
              </div>

              {authStep === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Số Điện Thoại / Zalo Của Bạn:</label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+84 (VN)</span>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0988 123 456"
                        required 
                        className="trial-input"
                      />
                    </div>
                  </div>
                  <button type="submit" className="nano-button auth-submit-btn">
                    <span>Nhận Mã OTP & Tiếp Tục ➔</span>
                  </button>
                  <span className="auth-foot-note">
                    🔒 Bảo mật chuẩn cấp ngân hàng. Không lưu dữ liệu trái phép.
                  </span>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Mã OTP (6 số):</label>
                    <div className="otp-boxes-row">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[idx] = e.target.value;
                            setOtp(newOtp);
                          }}
                          className="otp-digit-box"
                        />
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="nano-button auth-submit-btn">
                    <span>Xác Nhận & Vào Dashboard Ngay ➔</span>
                  </button>
                  <button 
                    type="button" 
                    className="auth-back-btn"
                    onClick={() => setAuthStep('phone')}
                  >
                    ← Đổi số điện thoại khác
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHASE 1 (CONT): THE "WELCOME" STATE (EMPTY DASHBOARD -> CONNECT BANK)     */}
        {/* ========================================================================= */}
        {authStep === 'ready' && !isBankConnected && (
          <div className="welcome-empty-state glass-panel">
            <div className="welcome-icon-box">
              <LandmarkIcon size={48} color="#FFA100" />
            </div>
            <span className="welcome-step-chip">BƯỚC 1 / 2: KHỞI TẠO DÒNG TIỀN</span>
            <h2 className="welcome-title">Chào Mừng Bạn Đến Với A-Sổ! 🚀</h2>
            <p className="welcome-desc">
              Để phần mềm bắt đầu tự động hóa 7 loại sổ kế toán Thông tư 88 và đối chiếu doanh thu thời gian thực, 
              hãy kết nối tài khoản ngân hàng nhận tiền quét mã VietQR tại quầy của bạn.
            </p>
            <div className="welcome-benefits-row">
              <div className="wb-item">
                <CheckCircleIcon size={16} color="#4ade80" />
                <span>Tự động tạo mã QR thu ngân chuẩn Napas 247</span>
              </div>
              <div className="wb-item">
                <CheckCircleIcon size={16} color="#4ade80" />
                <span>Không cần nhập số tiền hay đối soát sổ tay cuối ngày</span>
              </div>
              <div className="wb-item">
                <CheckCircleIcon size={16} color="#4ade80" />
                <span>Bảo mật chuẩn Open Banking chỉ đọc (Read-only)</span>
              </div>
            </div>
            <button 
              type="button" 
              className="nano-button welcome-cta-btn"
              onClick={() => setShowBankModal(true)}
            >
              <LandmarkIcon size={18} color="#ffffff" />
              <span>Kết Nối Tài Khoản Ngân Hàng Ngay</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHASE 2 & 3: THE "MAGIC TRICK" DASHBOARD & INSTANT S1-HKD LEDGER          */}
        {/* ========================================================================= */}
        {authStep === 'ready' && isBankConnected && (
          <div className="trial-dashboard-grid">
            {/* Left Column: VietQR Merchant Stand & The Magic Trick Ingestion Trigger */}
            <div className="trial-left-col">
              {/* Custom VietQR Generator Card */}
              <div className="merchant-qr-card glass-panel">
                <div className="qr-card-header">
                  <div className="qr-store-info">
                    <span className="qr-card-label">MÃ THU NGÂN VIETQR TỰ ĐỘNG</span>
                    <h3 className="qr-store-name">{bankDetails.storeName}</h3>
                  </div>
                  <span className="qr-live-pill">
                    <span className="qr-live-dot"></span>
                    <span>SẴN SÀNG NHẬN TIỀN</span>
                  </span>
                </div>

                <div className="qr-img-box">
                  <img 
                    src={customVietQrUrl} 
                    alt={`VietQR ${bankDetails.accountName}`}
                    className="merchant-vietqr-img"
                  />
                </div>

                <div className="qr-account-info-box">
                  <div className="acc-row">
                    <span className="acc-lbl">Ngân hàng:</span>
                    <strong className="acc-val">{bankDetails.bankName}</strong>
                  </div>
                  <div className="acc-row">
                    <span className="acc-lbl">Số tài khoản:</span>
                    <div className="acc-val-with-copy">
                      <strong className="acc-val mono">{bankDetails.accountNumber}</strong>
                      <button type="button" onClick={copyAccountNumber} className="copy-btn-mini">
                        {copiedAccount ? '✓ Đã chép' : 'Chép'}
                      </button>
                    </div>
                  </div>
                  <div className="acc-row">
                    <span className="acc-lbl">Chủ tài khoản:</span>
                    <strong className="acc-val">{bankDetails.accountName}</strong>
                  </div>
                </div>

                <div className="qr-card-actions">
                  <a 
                    href={customVietQrUrl} 
                    download="VietQR_Thu_Ngan_ASo.png" 
                    target="_blank" 
                    rel="noreferrer"
                    className="qr-download-btn"
                  >
                    <DownloadIcon size={14} color="currentColor" />
                    <span>Tải Mã QR In Để Bàn</span>
                  </a>
                  <button 
                    type="button" 
                    className="qr-edit-btn"
                    onClick={() => setShowBankModal(true)}
                  >
                    Đổi Tài Khoản
                  </button>
                </div>
              </div>

              {/* The "Magic Trick" Interactive Tester */}
              <div className="magic-trick-box glass-panel">
                <div className="magic-header">
                  <SparklesIcon size={18} color="#FFA100" />
                  <h4 className="magic-title">Trải Nghiệm Dòng Tiền Tự Động (The Magic Trick)</h4>
                </div>
                <p className="magic-desc">
                  Bấm nút bên dưới để mô phỏng một khách hàng quét mã VietQR tại quầy. Hệ thống sẽ bắt sự kiện qua Webhook, tự động phân loại và nhảy sổ kế toán ngay tức thì!
                </p>
                <div className="magic-actions">
                  <button 
                    type="button" 
                    className={`magic-btn-fire ${justIngested ? 'magic-pulsing' : ''}`}
                    onClick={() => triggerVietQRTransaction(150000, 'Khách thanh toán 3 ly cà phê')}
                  >
                    <span className="magic-btn-icon">⚡</span>
                    <span>Thử Quét VietQR: +150.000đ</span>
                  </button>
                  <button 
                    type="button" 
                    className="magic-btn-fire secondary"
                    onClick={() => triggerVietQRTransaction(2500000, 'Bàn tiệc sinh nhật #08')}
                  >
                    <span>Thử Quét: +2.500.000đ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Metrics, Traffic Light Tax Readiness, and Circular 88 S1-HKD Ledger */}
            <div className="trial-right-col">
              {/* Traffic Light Tax Readiness Widget */}
              <div className="traffic-readiness-widget glass-panel">
                <div className="trw-top">
                  <div className="trw-stat-col">
                    <span className="trw-label">Tổng Doanh Thu Tự Động Ghi Sổ:</span>
                    <div className="trw-revenue-val">
                      <span className={`rev-num ${justIngested ? 'rev-glow' : ''}`}>
                        {new Intl.NumberFormat('vi-VN').format(revenue)}
                      </span>
                      <span className="rev-unit">VND</span>
                    </div>
                  </div>
                  <div className="trw-status-badge">
                    <span className={`trw-light ${transactions.length > 0 ? 'light-green' : 'light-yellow'}`}></span>
                    <strong>{transactions.length > 0 ? '100% Khớp Dòng Tiền' : 'Đang Chờ Dữ Liệu'}</strong>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="trw-bar-container">
                  <div 
                    className="trw-bar-fill" 
                    style={{ width: transactions.length > 0 ? '100%' : '5%' }}
                  ></div>
                </div>

                <div className="trw-footer">
                  <div className="trw-footer-item">
                    <CheckCircleIcon size={14} color="#4ade80" />
                    <span>Bộ lọc tự động: Giao dịch &lt; 20 triệu VND phân loại thẳng vào Sổ S1 (Bán lẻ)</span>
                  </div>
                  <div className="trw-footer-item">
                    <ShieldIcon size={14} color="#FFA100" />
                    <span>Tiêu chuẩn pháp lý: Thông tư 88/2021/TT-BTC & Nghị định 123/2020/NĐ-CP</span>
                  </div>
                </div>
              </div>

              {/* S1-HKD Ledger Table (Circular 88 Standard) */}
              <div className="s1-ledger-box glass-panel">
                <div className="ledger-box-header">
                  <div>
                    <div className="ledger-tag-row">
                      <span className="ledger-badge-tt88">MẪU SỐ S1-HKD</span>
                      <span className="ledger-badge-legal">THÔNG TƯ 88/2021/TT-BTC</span>
                    </div>
                    <h3 className="ledger-box-title">Sổ Chi Tiết Doanh Thu Bán Hàng Hóa, Dịch Vụ</h3>
                    <p className="ledger-box-sub">Tự động đồng bộ từ biến động số dư VietQR 24/7 không cần gõ tay.</p>
                  </div>
                  
                  {/* PHASE 4: THE UPGRADE WALL TRIGGER */}
                  <button 
                    type="button" 
                    className="export-xml-trigger-btn"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    <FileTextIcon size={15} color="#ffffff" />
                    <span>Xuất XML Nộp Tổng Cục Thuế</span>
                  </button>
                </div>

                <div className="ledger-table-wrapper">
                  <table className="s1-ledger-table">
                    <thead>
                      <tr>
                        <th>Ngày Ghi Sổ</th>
                        <th>Số Hiệu Chứng Từ</th>
                        <th>Diễn Giải Nghiệp Vụ</th>
                        <th>Phân Loại</th>
                        <th className="text-right">Doanh Thu Bán Lẻ (đ)</th>
                        <th>Trạng Thái Đối Soát</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s1Ledger.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="empty-ledger-cell">
                            <span>⚡ Chưa có giao dịch nào. Bấm nút <strong>"Thử Quét VietQR"</strong> bên trái để xem sổ tự động ghi dữ liệu!</span>
                          </td>
                        </tr>
                      ) : (
                        s1Ledger.map((row, idx) => (
                          <tr key={row.id} className={idx === 0 && justIngested ? 'new-row-pulse' : ''}>
                            <td className="mono">{row.date}</td>
                            <td className="mono voucher-col">{row.voucherNo}</td>
                            <td className="desc-col">{row.description}</td>
                            <td><span className="category-pill">{row.category}</span></td>
                            <td className="text-right amount-cell mono">{row.formattedRetail}</td>
                            <td>
                              <span className="status-verified-pill">
                                ✓ {row.taxStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {s1Ledger.length > 0 && (
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="total-label">CỘNG DOANH THU THỰC TẾ (S1-HKD):</td>
                          <td className="text-right total-amount mono">
                            {new Intl.NumberFormat('vi-VN').format(revenue)}đ
                          </td>
                          <td className="total-status">✓ 100% Cân Đối</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BANK CONNECTION MODAL                                                     */}
      {/* ========================================================================= */}
      {showBankModal && (
        <div className="modal-backdrop">
          <div className="bank-connect-modal glass-panel">
            <div className="modal-header">
              <div className="modal-header-left">
                <LandmarkIcon size={22} color="#FFA100" />
                <h3 className="modal-title">Kết Nối Tài Khoản Nhận Tiền VietQR</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowBankModal(false)}
              >
                <CloseIcon size={18} color="currentColor" />
              </button>
            </div>

            <form onSubmit={handleConnectBank} className="bank-form">
              <div className="form-group">
                <label className="form-label">Tên Cơ Sở Kinh Doanh / Quán Của Bạn:</label>
                <input 
                  type="text" 
                  value={bankDetails.storeName}
                  onChange={(e) => setBankDetails({ ...bankDetails, storeName: e.target.value })}
                  placeholder="Ví dụ: Tiệm Bánh & Cà Phê Mộc"
                  required 
                  className="trial-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chọn Ngân Hàng Nhận Tiền:</label>
                <select 
                  value={bankDetails.bankCode}
                  onChange={(e) => {
                    const selected = topBanks.find(b => b.code === e.target.value);
                    setBankDetails({
                      ...bankDetails,
                      bankCode: e.target.value,
                      bankName: selected?.name || e.target.value
                    });
                  }}
                  className="trial-select"
                >
                  {topBanks.map((b) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Số Tài Khoản Ngân Hàng:</label>
                <input 
                  type="text" 
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\s+/g, '') })}
                  placeholder="0353600900"
                  required 
                  className="trial-input mono"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tên Chủ Tài Khoản (Không Dấu):</label>
                <input 
                  type="text" 
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value.toUpperCase() })}
                  placeholder="NGUYEN VAN AN"
                  required 
                  className="trial-input"
                />
              </div>

              <button type="submit" className="nano-button modal-submit-btn">
                <span>Tạo Mã VietQR & Kết Nối Sổ S1 Ngay ➔</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: THE UPGRADE PAYWALL MODAL                                        */}
      {/* ========================================================================= */}
      {showUpgradeModal && (
        <div className="modal-backdrop">
          <div className="upgrade-wall-modal glass-panel">
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setShowUpgradeModal(false)}
            >
              <CloseIcon size={18} color="currentColor" />
            </button>

            <div className="upgrade-modal-body">
              <div className="upgrade-celebrate-icon">
                <SparklesIcon size={40} color="#FFA100" />
              </div>
              <span className="upgrade-badge">SỔ S1-HKD CỦA BẠN ĐÃ HOÀN HẢO 100%</span>
              <h2 className="upgrade-headline">
                Sẵn Sàng Nộp Cho Cơ Quan Thuế?
              </h2>
              <p className="upgrade-pitch">
                Toàn bộ dòng tiền bán lẻ quét mã VietQR đã được A-Sổ tự động kết chuyển vào bộ sổ chuẩn Thông tư 88/2021/TT-BTC.
                <br /><br />
                <strong>Nâng cấp lên Gói Tự Động (249k/tháng)</strong> để kích hoạt tính năng <strong>kết xuất file XML/Excel nộp thẳng Cổng Thuế</strong> và mở khóa tính năng <strong>Đối chiếu Hóa đơn điện tử Nghị định 123</strong>.
              </p>

              <div className="upgrade-comparison-list">
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span>Xuất file XML chuẩn Cổng Thông Tin Tổng Cục Thuế không giới hạn</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span>Đồng bộ và đối chiếu tự động Hóa đơn điện tử NĐ 123</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span>Bảng cảnh báo rủi ro thuế 'Đèn Giao Thông' (Xanh / Vàng / Đỏ)</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span>Bảo hành số liệu và hỗ trợ giải trình thuế trực tiếp với chuyên viên</span>
                </div>
              </div>

              <div className="upgrade-actions">
                <button 
                  type="button" 
                  className="nano-button upgrade-act-btn"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setShowCheckoutModal(true);
                  }}
                >
                  <span>Nâng Cấp Gói Tự Động 249k/tháng (Quét VietQR) ➔</span>
                </button>
                <button 
                  type="button" 
                  className="continue-trial-btn"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Tiếp tục dùng thử 14 ngày miễn phí
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic VietQR Checkout Modal for instant Pro upgrade */}
      <VietQRCheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        selectedPlan="pro"
        billingCycle="annual"
        isTrial={false}
      />
    </div>
  );
}
