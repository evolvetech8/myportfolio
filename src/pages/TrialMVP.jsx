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
  CloseIcon,
  MessageSquareIcon,
  SmartphoneIcon,
  ZapIcon,
  SlashCircleIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  CheckIcon
} from '../components/Icons';
import VietQRCheckoutModal from '../components/VietQRCheckoutModal';

export default function TrialMVP() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Phase 1: Authentication State with SMS OTP Burn Rate Protection & Zalo ZNS
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'ready'
  const [phone, setPhone] = useState('0988123456');
  const [otpChannel, setOtpChannel] = useState('zalo'); // 'zalo' (ZNS) | 'sms'
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [cooldown, setCooldown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [honeypot, setHoneypot] = useState('');

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

  // Phase 2 & 3: Live Ingestion & S1-HKD Ledger State with Manual Override
  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [s1Ledger, setS1Ledger] = useState([]);
  const [justIngested, setJustIngested] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Phase 4: Upgrade Paywall Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Cooldown countdown timer for OTP rate limiting
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

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

  // Helper to trigger the "Magic Trick" (real-time ingestion) with Smart Internal Detection
  const triggerVietQRTransaction = (amount = 150000, note = 'Khách thanh toán đồ uống tại quầy') => {
    const txId = `VQR-${Date.now().toString().slice(-6)}`;
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);

    // Smart keyword detection for internal transfers / non-sales money
    const lowerNote = note.toLowerCase();
    const isInternalKeyword = /(noi bo|chuyen khoan noi bo|rut tien|nop tien|vay|tra no|hoan tien|sua chua|von chu so huu|nap tien|chuyen tien cho)/.test(lowerNote);

    const isRetailAuto = amount < 20000000 && !isInternalKeyword;
    const isTaxable = isRetailAuto;

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

    const newLedgerRow = {
      id: `S1-${Date.now().toString().slice(-6)}`,
      rawAmount: amount,
      date: new Date().toLocaleDateString('vi-VN'),
      voucherNo: txId,
      description: `${note} — ${bankDetails.storeName}`,
      category: isTaxable ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
      isTaxable: isTaxable,
      overrideReason: isInternalKeyword ? 'Phát hiện từ khóa dòng tiền nội bộ (Không tính thuế)' : null,
      retailRevenue: isTaxable ? amount : 0,
      formattedRetail: isTaxable ? `${formattedAmount}đ` : '0đ',
      taxStatus: isTaxable ? 'Khớp 100% CQT' : 'Miễn thuế',
      standard: 'TT88/2021/TT-BTC'
    };

    // Update transactions & ledger
    setTransactions((prev) => [newTx, ...prev]);
    setS1Ledger((prev) => [newLedgerRow, ...prev]);
    
    // Only increase taxable revenue if row is taxable
    if (isTaxable) {
      setRevenue((prev) => prev + amount);
    }

    // Audio / Visual Haptic Feedback
    setJustIngested(true);
    setActiveToast({
      title: isTaxable
        ? `Nhận biến động số dư VietQR: +${formattedAmount}đ`
        : `Phát hiện dòng tiền nội bộ: +${formattedAmount}đ (Không tính thuế)`,
      sub: isTaxable
        ? `Tự động đối soát ngân hàng & ghi vào Sổ Doanh Thu (S1-HKD).`
        : `A-Sổ đã loại trừ khoản này khỏi doanh thu chịu thuế để bảo vệ bạn.`
    });

    setTimeout(() => setJustIngested(false), 2400);
    setTimeout(() => setActiveToast(null), 4500);
  };

  // INLINE MANUAL OVERRIDE (Vulnerability #1 Fix)
  const handleToggleRowTaxable = (rowId) => {
    setS1Ledger((prev) => {
      let diff = 0;
      const updated = prev.map((row) => {
        if (row.id === rowId) {
          const nextTaxable = !row.isTaxable;
          diff = nextTaxable ? row.rawAmount : -row.rawAmount;
          return {
            ...row,
            isTaxable: nextTaxable,
            category: nextTaxable ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
            formattedRetail: nextTaxable ? `${new Intl.NumberFormat('vi-VN').format(row.rawAmount)}đ` : '0đ',
            taxStatus: nextTaxable ? 'Khớp 100% CQT' : 'Miễn thuế',
            overrideReason: nextTaxable ? null : 'Chủ hộ kinh doanh bỏ qua (Không phải doanh thu chịu thuế)'
          };
        }
        return row;
      });

      setRevenue((prevRev) => Math.max(0, prevRev + diff));
      return updated;
    });

    setActiveToast({
      title: 'Đã cập nhật trạng thái phân loại sổ S1',
      sub: 'Số tiền thuế đã được tính toán lại chính xác theo lựa chọn của bạn.'
    });
    setTimeout(() => setActiveToast(null), 3500);
  };

  // OTP Request with Rate-Limiting & ZNS (Vulnerability #3 Fix)
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for automated bot submissions

    if (otpAttempts >= 3) {
      alert('Thông báo: Bạn đã yêu cầu gửi mã quá 3 lần trong phiên này. Vui lòng chờ 10 phút hoặc liên hệ hotline để bảo vệ OTP.');
      return;
    }

    if (cooldown > 0) {
      return;
    }

    if (phone.trim().length >= 9) {
      setOtpAttempts((prev) => prev + 1);
      setCooldown(60); // 60s cooldown
      setAuthStep('otp');
      setActiveToast({
        title: otpChannel === 'zalo' ? 'Đã gửi mã qua Zalo ZNS' : 'Đã gửi mã qua SMS',
        sub: `Mã OTP đã được gửi tới số: ${phone} (Kênh: ${otpChannel === 'zalo' ? 'Zalo ZNS bảo mật' : 'SMS Brandname'})`
      });
      setTimeout(() => setActiveToast(null), 4000);
    }
  };

  const handleResendOtp = () => {
    if (cooldown > 0) return;
    if (otpAttempts >= 3) {
      alert('Thông báo: Đã đạt giới hạn 3 lần gửi mã trong 10 phút.');
      return;
    }
    setOtpAttempts((prev) => prev + 1);
    setCooldown(60);
    setActiveToast({
      title: 'Đã gửi lại mã OTP mới',
      sub: `Kiểm tra thông báo trên ứng dụng Zalo hoặc tin nhắn SMS của bạn.`
    });
    setTimeout(() => setActiveToast(null), 3500);
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
        {/* PHASE 1: 60-SECOND ONBOARDING (WITH SMS BURN-RATE PROTECTION & ZALO ZNS)  */}
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
                    ? 'Đăng nhập bảo mật qua Số Điện Thoại. Tích hợp Zalo ZNS tiết kiệm chi phí và cơ chế chống bot spam.'
                    : `Mã xác thực gồm 6 chữ số đã được gửi tới số: ${phone}`}
                </p>
              </div>

              {authStep === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="auth-form">
                  {/* Honeypot field for anti-bot protection */}
                  <input 
                    type="text" 
                    name="contact_verification_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Zalo ZNS vs SMS Channel Selector */}
                  <div className="form-group">
                    <label className="form-label">Phương Thức Nhận Mã OTP:</label>
                    <div className="channel-selector-row">
                      <button 
                        type="button" 
                        className={`channel-pill-btn ${otpChannel === 'zalo' ? 'active' : ''}`}
                        onClick={() => setOtpChannel('zalo')}
                      >
                        <MessageSquareIcon size={18} color="#FFA100" />
                        <div className="channel-text">
                          <strong>Zalo ZNS</strong>
                          <span>Khuyên dùng • Nhanh 2s</span>
                        </div>
                      </button>
                      <button 
                        type="button" 
                        className={`channel-pill-btn ${otpChannel === 'sms' ? 'active' : ''}`}
                        onClick={() => setOtpChannel('sms')}
                      >
                        <SmartphoneIcon size={18} color="#FFA100" />
                        <div className="channel-text">
                          <strong>SMS Tin Nhắn</strong>
                          <span>Mạng viễn thông</span>
                        </div>
                      </button>
                    </div>
                  </div>

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

                  <button 
                    type="submit" 
                    className="nano-button auth-submit-btn"
                    disabled={cooldown > 0 || otpAttempts >= 3}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {cooldown > 0 
                        ? `Vui lòng chờ ${cooldown}s...` 
                        : otpAttempts >= 3 
                        ? 'Đã đạt giới hạn gửi mã' 
                        : <><span>Nhận Mã OTP & Tiếp Tục</span><ArrowRightIcon size={14} /></>}
                    </span>
                  </button>

                  <div className="rate-limit-badge-box">
                    <ShieldIcon size={13} color="#4ade80" />
                    <span>Bảo vệ chống spam: Giới hạn 3 lần/10 phút • Cooldown 60s</span>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="auth-form">
                  <div className="form-group">
                    <div className="otp-label-row">
                      <label className="form-label">Mã OTP (6 số):</label>
                      <span className="otp-channel-tag">
                        Qua {otpChannel === 'zalo' ? 'Zalo ZNS' : 'SMS'}
                      </span>
                    </div>
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span>Xác Nhận & Vào Dashboard Ngay</span>
                      <ArrowRightIcon size={14} />
                    </span>
                  </button>

                  <div className="otp-actions-row">
                    <button 
                      type="button" 
                      className="resend-otp-btn"
                      onClick={handleResendOtp}
                      disabled={cooldown > 0}
                    >
                      {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : 'Gửi lại mã OTP'}
                    </button>
                    <button 
                      type="button" 
                      className="auth-back-btn"
                      onClick={() => setAuthStep('phone')}
                    >
                      Đổi số điện thoại khác
                    </button>
                  </div>
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
            <h2 className="welcome-title">Chào Mừng Bạn Đến Với A-Sổ</h2>
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
                <span>Có quyền Bỏ qua / Chỉnh sửa các giao dịch nội bộ không phải doanh thu</span>
              </div>
              <div className="wb-item">
                <CheckCircleIcon size={16} color="#4ade80" />
                <span>Bảo mật chuẩn HMAC-SHA256 chống giả mạo dữ liệu</span>
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
                        {copiedAccount ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><CheckIcon size={10} color="currentColor" /> Đã chép</span> : 'Chép'}
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

              {/* The "Magic Trick" Interactive Tester with Multi-Scenario Simulation */}
              <div className="magic-trick-box glass-panel">
                <div className="magic-header">
                  <SparklesIcon size={18} color="#FFA100" />
                  <h4 className="magic-title">Mô Phỏng Dòng Tiền Thực Tế (The Magic Trick)</h4>
                </div>
                <p className="magic-desc">
                  Thử nghiệm cả kịch bản <strong>bán lẻ chịu thuế</strong> lẫn <strong>nộp tiền sửa quán / chuyển khoản nội bộ</strong> để chứng kiến A-Sổ thông minh bóc tách thuế:
                </p>
                <div className="magic-actions">
                  <button 
                    type="button" 
                    className={`magic-btn-fire ${justIngested ? 'magic-pulsing' : ''}`}
                    onClick={() => triggerVietQRTransaction(150000, 'Khách thanh toán 3 ly cà phê')}
                  >
                    <ZapIcon size={15} color="#ffffff" />
                    <span>1. Bán Lẻ: +150.000đ (Vào Sổ S1)</span>
                  </button>

                  <button 
                    type="button" 
                    className="magic-btn-fire internal-btn"
                    onClick={() => triggerVietQRTransaction(5000000, 'Nộp tiền cá nhân sửa chữa quán cà phê')}
                    title="A-Sổ tự động nhận diện từ khóa 'sửa chữa' để không tính thuế oan cho bạn"
                  >
                    <ShieldIcon size={15} color="#38bdf8" />
                    <span>2. Chuyển Nội Bộ: +5.000.000đ (Miễn Thuế)</span>
                  </button>

                  <button 
                    type="button" 
                    className="magic-btn-fire secondary"
                    onClick={() => triggerVietQRTransaction(2500000, 'Bàn tiệc sinh nhật #08')}
                  >
                    <ZapIcon size={15} color="#FFA100" />
                    <span>3. Bán Lẻ Lớn: +2.500.000đ</span>
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
                    <span className="trw-label">Doanh Thu Chịu Thuế (S1-HKD):</span>
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
                    <span>Bộ lọc thông minh: Phân loại tự động & cho phép <strong>Bỏ qua giao dịch nội bộ</strong> bằng 1 click</span>
                  </div>
                  <div className="trw-footer-item">
                    <ShieldIcon size={14} color="#FFA100" />
                    <span>Bảo mật: Xác thực chữ ký HMAC-SHA256 chống Webhook giả mạo</span>
                  </div>
                </div>
              </div>

              {/* S1-HKD Ledger Table (Circular 88 Standard with Inline Edit / Ignore Override) */}
              <div className="s1-ledger-box glass-panel">
                <div className="ledger-box-header">
                  <div>
                    <div className="ledger-tag-row">
                      <span className="ledger-badge-tt88">MẪU SỐ S1-HKD</span>
                      <span className="ledger-badge-legal">THÔNG TƯ 88/2021/TT-BTC</span>
                      <span className="ledger-badge-compliance">CÓ QUYỀN GHI ĐÈ THUẾ</span>
                    </div>
                    <h3 className="ledger-box-title">Sổ Chi Tiết Doanh Thu Bán Hàng Hóa, Dịch Vụ</h3>
                    <p className="ledger-box-sub">
                      Tự động phân loại từ VietQR. Bạn có toàn quyền <strong>Bỏ qua / Khôi phục</strong> từng dòng trước khi xuất XML nộp thuế.
                    </p>
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
                        <th>Số Chứng Từ</th>
                        <th>Diễn Giải Nghiệp Vụ</th>
                        <th>Phân Loại</th>
                        <th className="text-right">Doanh Thu Bán Lẻ</th>
                        <th>Trạng Thái Thuế</th>
                        <th className="text-center">Thao Tác (Override)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s1Ledger.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="empty-ledger-cell">
                            <span>Chưa có giao dịch nào. Bấm nút <strong>"Thử Quét VietQR"</strong> bên trái để xem sổ tự động ghi dữ liệu!</span>
                          </td>
                        </tr>
                      ) : (
                        s1Ledger.map((row, idx) => (
                          <tr 
                            key={row.id} 
                            className={`
                              ${idx === 0 && justIngested ? 'new-row-pulse' : ''} 
                              ${!row.isTaxable ? 'row-excluded' : ''}
                            `}
                          >
                            <td className="mono">{row.date}</td>
                            <td className="mono voucher-col">{row.voucherNo}</td>
                            <td className="desc-col">
                              <div>{row.description}</div>
                              {row.overrideReason && (
                                <span className="override-reason-hint">↳ {row.overrideReason}</span>
                              )}
                            </td>
                            <td>
                              <span className={`category-pill ${!row.isTaxable ? 'pill-gray' : ''}`}>
                                {row.category}
                              </span>
                            </td>
                            <td className="text-right amount-cell mono">
                              {row.isTaxable ? (
                                row.formattedRetail
                              ) : (
                                <span className="excluded-amount-strike">0đ (Đã bỏ qua)</span>
                              )}
                            </td>
                            <td>
                              <span className={`status-verified-pill ${!row.isTaxable ? 'pill-exempt' : ''}`}>
                                {row.isTaxable ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckIcon size={11} color="#4ade80" />
                                    <span>{row.taxStatus}</span>
                                  </span>
                                ) : (
                                  'Miễn tính thuế'
                                )}
                              </span>
                            </td>
                            <td className="text-center">
                              {/* VULNERABILITY #1 FIX: INLINE EDIT / IGNORE TOGGLE */}
                              <button
                                type="button"
                                className={`override-toggle-btn ${row.isTaxable ? 'btn-ignore' : 'btn-restore'}`}
                                onClick={() => handleToggleRowTaxable(row.id)}
                                title={row.isTaxable ? 'Bỏ qua dòng này (Không phải doanh thu chịu thuế)' : 'Khôi phục tính thuế cho dòng này'}
                              >
                                {row.isTaxable ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <SlashCircleIcon size={12} color="currentColor" />
                                    <span>Bỏ qua (Nội bộ)</span>
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <RefreshCwIcon size={12} color="currentColor" />
                                    <span>Khôi phục tính thuế</span>
                                  </span>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {s1Ledger.length > 0 && (
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="total-label">CỘNG DOANH THU THỰC TẾ CHỊU THUẾ:</td>
                          <td className="text-right total-amount mono">
                            {new Intl.NumberFormat('vi-VN').format(revenue)}đ
                          </td>
                          <td colSpan={2} className="total-status">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckIcon size={12} color="#4ade80" />
                              <span>{s1Ledger.filter(r => !r.isTaxable).length > 0 ? `Đã trừ ${s1Ledger.filter(r => !r.isTaxable).length} dòng nội bộ` : '100% Cân Đối Chuẩn TT88'}</span>
                            </span>
                          </td>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Tạo Mã VietQR & Kết Nối Sổ S1 Ngay</span>
                  <ArrowRightIcon size={14} />
                </span>
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
                Toàn bộ dòng tiền bán lẻ quét mã VietQR đã được A-Sổ tự động kết chuyển vào bộ sổ chuẩn Thông tư 88/2021/TT-BTC, và đã được loại trừ các khoản chuyển tiền nội bộ.
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span>Nâng Cấp Gói Tự Động 249k/tháng (Quét VietQR)</span>
                    <ArrowRightIcon size={14} />
                  </span>
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
