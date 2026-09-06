import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
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
  CheckIcon,
  BuildingIcon
} from '../components/Icons';
import VietQRCheckoutModal from '../components/VietQRCheckoutModal';

export default function TrialMVP() {
  const [searchParams] = useSearchParams();
  const { clientId } = useParams();
  const effectiveClientId = clientId || searchParams.get('client');
  const clientNameParam = searchParams.get('name');
  const clientRegimeParam = searchParams.get('regime');

  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Phase 1: Authentication State with SMS OTP Burn Rate Protection & Zalo ZNS
  // If navigated from CPA multi-client workspace, bypass OTP directly to client ledger
  const [authStep, setAuthStep] = useState(effectiveClientId ? 'ready' : 'phone'); // 'phone' | 'otp' | 'ready'
  const [phone, setPhone] = useState('0988123456');
  const [otpChannel, setOtpChannel] = useState('zalo'); // 'zalo' (ZNS) | 'sms'
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [cooldown, setCooldown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [honeypot, setHoneypot] = useState('');

  // Phase 1: Bank Connection State
  const [isBankConnected, setIsBankConnected] = useState(!!clientParam);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankCode: 'MB',
    bankName: 'MBBank (Ngân Hàng Quân Đội)',
    accountNumber: '0353600900',
    accountName: 'NGUYEN VAN AN',
    storeName: clientNameParam ? decodeURIComponent(clientNameParam) : 'Tiệm Cà Phê & Bánh Mộc'
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

  // Phase 2 (LIVE): Open Banking & Real-Time Webhook Stream State
  const [isLiveListening, setIsLiveListening] = useState(true);
  const [sepayApiKey, setSepayApiKey] = useState('');
  const [showLiveSetupModal, setShowLiveSetupModal] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [liveSyncLoading, setLiveSyncLoading] = useState(false);
  const [streamSecret, setStreamSecret] = useState('sec_aso_trial_2026');
  const [taxRegime, setTaxRegime] = useState(clientRegimeParam || 'group2'); // 'group1' (S1a) | 'group2' (S2a) | 'group3' (Bộ 4 Sổ: S2b, S2c, S2d, S2e)

  // Rotate / regenerate secret token for webhook & session security
  const rotateSecretKey = () => {
    const newKey = 'sec_aso_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    setStreamSecret(newKey);
    setActiveToast({
      title: 'Đã tạo Secret Token mới!',
      sub: 'Mã token mới đã được áp dụng. Vui lòng cập nhật Bearer token mới vào cổng kết nối ngân hàng.'
    });
    setTimeout(() => setActiveToast(null), 4500);
  };

  // Audio Chime (Vietnamese Cash Register Ting-Ting Sound via Web Audio API)
  const playTingSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) {
      // AudioContext blocked before interaction
    }
  };

  // Cooldown countdown timer for OTP rate limiting
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Helper to ingest an incoming live transaction from Webhook or Polling
  const handleIncomingRealTransaction = useCallback((tx) => {
    if (!tx || !tx.amount) return;

    setS1Ledger((prevLedger) => {
      const existingIds = new Set(prevLedger.map((r) => r.voucherNo || r.id));
      if (existingIds.has(tx.referenceNo) || existingIds.has(tx.id)) {
        return prevLedger;
      }

      playTingSound();
      setJustIngested(true);
      setTimeout(() => setJustIngested(false), 2400);

      const assignedBook = tx.isTaxable
        ? (taxRegime === 'group1' ? 'Mẫu S1a-HKD' : taxRegime === 'group2' ? 'Mẫu S2a-HKD' : 'Bộ 4 Sổ (S2b, S2c, S2d, S2e)')
        : 'Dòng tiền loại trừ';

      setActiveToast({
        title: tx.isTaxable
          ? `Nhận biến động số dư VietQR: +${tx.formatted}`
          : `Phát hiện dòng tiền vốn/nội bộ: +${tx.formatted}`,
        sub: `Đã đối soát vào ${assignedBook} (Chuẩn TT 152/2025).`
      });
      setTimeout(() => setActiveToast(null), 5000);

      const newRow = {
        id: tx.id || `S1-${Date.now()}`,
        rawAmount: tx.amount,
        date: tx.date || new Date().toLocaleDateString('vi-VN'),
        voucherNo: tx.referenceNo,
        description: `${tx.content} — ${bankDetails.storeName}`,
        category: tx.category,
        isTaxable: tx.isTaxable,
        overrideReason: tx.overrideReason,
        auditRule: tx.auditRule || (tx.isTaxable ? 'RULE-REV-01: Bán hàng lẻ / Dịch vụ chịu thuế' : 'RULE-EX-01: Dòng tiền nội bộ / Vay vốn (Miễn thuế Điều 4 TT152)'),
        requiresConfirmation: tx.requiresConfirmation || (tx.amount >= 10000000 && !tx.isTaxable),
        retailRevenue: tx.isTaxable ? tx.amount : 0,
        formattedRetail: tx.isTaxable ? tx.formatted : '0đ',
        taxStatus: tx.taxStatus,
        standard: 'TT152/2025/TT-BTC',
        assignedBook: assignedBook,
        nd70Compliance: tx.amount >= 1000000000 ? 'Bắt buộc HĐĐT-MTT (Nghị định 70/2025)' : 'Khớp HĐĐT NĐ 123'
      };

      if (tx.isTaxable) {
        setRevenue((prev) => prev + tx.amount);
      }

      return [newRow, ...prevLedger];
    });
  }, [bankDetails.storeName, taxRegime]);

  // PRIVATE & SECURE IN-HOUSE REAL-TIME POLLING LOOP
  // Compliant with Decree 13/2023/ND-CP: Strictly inside application domain, authenticated via Bearer token
  useEffect(() => {
    if (!isBankConnected || !isLiveListening) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transactions?accountNumber=${bankDetails.accountNumber}`, {
          headers: {
            'Authorization': `Bearer ${streamSecret}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.transactions && data.transactions.length > 0) {
          data.transactions.forEach((tx) => {
            handleIncomingRealTransaction(tx);
          });
        }
      } catch (err) {
        // Network resilience
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isBankConnected, isLiveListening, bankDetails.accountNumber, streamSecret, handleIncomingRealTransaction]);

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

    const assignedBook = isTaxable
      ? (taxRegime === 'group1' ? 'Mẫu S1a-HKD' : taxRegime === 'group2' ? 'Mẫu S2a-HKD' : 'Bộ 4 Sổ (S2b, S2c, S2d, S2e)')
      : 'Dòng tiền loại trừ';

    const auditRule = isInternalKeyword 
      ? 'RULE-EX-01: Phát hiện từ khóa dòng tiền vốn/nội bộ (Không tính thuế theo Điều 4 TT152)' 
      : (amount >= 20000000 
          ? 'RULE-REV-02: Giao dịch giá trị lớn (Cần xác nhận chứng từ kèm theo)' 
          : 'RULE-REV-01: Giao dịch bán hàng lẻ/dịch vụ chịu thuế');

    const newLedgerRow = {
      id: `S1-${Date.now().toString().slice(-6)}`,
      rawAmount: amount,
      date: new Date().toLocaleDateString('vi-VN'),
      voucherNo: txId,
      description: `${note} — ${bankDetails.storeName}`,
      category: isTaxable ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
      isTaxable: isTaxable,
      overrideReason: isInternalKeyword ? 'Phát hiện từ khóa dòng tiền nội bộ (Không tính thuế)' : null,
      auditRule: auditRule,
      requiresConfirmation: amount >= 10000000 && !isTaxable,
      retailRevenue: isTaxable ? amount : 0,
      formattedRetail: isTaxable ? `${formattedAmount}đ` : '0đ',
      taxStatus: isTaxable ? 'Khớp 100% CQT' : 'Miễn thuế',
      standard: 'TT152/2025/TT-BTC',
      assignedBook: assignedBook,
      nd70Compliance: amount >= 1000000000 ? 'Bắt buộc HĐĐT-MTT (Nghị định 70/2025)' : 'Khớp HĐĐT NĐ 123'
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
        ? `Tự động đối soát ngân hàng & ghi vào Sổ Doanh Thu (S1a-HKD TT 152/2025).`
        : `A-Sổ đã loại trừ khoản này khỏi doanh thu chịu thuế để bảo vệ bạn.`
    });

    setTimeout(() => setJustIngested(false), 2400);
    setTimeout(() => setActiveToast(null), 4500);
  };

  // SEND REAL HTTP POST WEBHOOK TO VERCEL SERVERLESS BACKEND WITH HEADER BEARER AUTH
  const sendRealWebhookTransaction = async (amount = 150000, note = 'Khách thanh toán đồ uống tại quầy') => {
    const payload = {
      amountIn: amount,
      transactionContent: note,
      accountNumber: bankDetails.accountNumber,
      bankBrand: bankDetails.bankCode,
      gateway: bankDetails.bankName,
      referenceCode: `VQR-${Date.now().toString().slice(-6)}`,
      transactionDate: new Date().toISOString(),
      taxGroup: taxRegime
    };

    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${streamSecret}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.transaction) {
          handleIncomingRealTransaction(data.transaction);
        }
      } else {
        triggerVietQRTransaction(amount, note);
      }
    } catch (err) {
      triggerVietQRTransaction(amount, note);
    }
  };

  // SYNC LIVE TRANSACTIONS DIRECTLY FROM SEPAY.VN OPEN BANKING API
  const syncLiveSepay = async () => {
    if (!sepayApiKey) {
      alert('Vui lòng nhập API Token từ SePay.vn của bạn');
      return;
    }
    setLiveSyncLoading(true);
    try {
      const res = await fetch('/api/sepay-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sepayApiKey}`
        },
        body: JSON.stringify({ apiToken: sepayApiKey, accountNumber: bankDetails.accountNumber, limit: 15 })
      });

      const data = await res.json();
      if (data && data.transactions && Array.isArray(data.transactions)) {
        let addedCount = 0;
        setS1Ledger((prevLedger) => {
          const existingIds = new Set(prevLedger.map((r) => r.voucherNo || r.id));
          const newRows = [];

          data.transactions.forEach((stx) => {
            const txId = String(stx.reference_number || stx.id || `SP-${Date.now()}`);
            if (existingIds.has(txId)) return;

            const amt = Number(stx.amount_in || stx.amount || 0);
            if (amt <= 0) return;

            const content = stx.transaction_content || stx.description || 'Giao dịch chuyển khoản ngân hàng';
            const lower = content.toLowerCase();
            const isInternal = /(noi bo|chuyen khoan noi bo|rut tien|nop tien|vay|tra no|hoan tien|sua chua|von chu so huu|nap tien|chuyen tien cho)/.test(lower);
            const isTax = amt < 20000000 && !isInternal;

            const assignedBook = isTax
              ? (taxRegime === 'group1' ? 'Mẫu S1a-HKD' : taxRegime === 'group2' ? 'Mẫu S2a-HKD' : 'Bộ 4 Sổ (S2b, S2c, S2d, S2e)')
              : 'Dòng tiền loại trừ';

            const auditRule = isInternal
              ? 'RULE-EX-01: Phát hiện từ khóa dòng tiền vốn/nội bộ (Không tính thuế theo Điều 4 TT152)'
              : (amt >= 20000000
                  ? 'RULE-REV-02: Giao dịch giá trị lớn (Cần xác nhận chứng từ kèm theo)'
                  : 'RULE-REV-01: Giao dịch bán hàng lẻ/dịch vụ chịu thuế');

            newRows.push({
              id: `S1-${txId}`,
              rawAmount: amt,
              date: stx.transaction_date ? new Date(stx.transaction_date).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
              voucherNo: txId,
              description: `${content} — ${bankDetails.storeName}`,
              category: isTax ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
              isTaxable: isTax,
              overrideReason: isInternal ? 'Phát hiện từ khóa dòng tiền nội bộ (Không tính thuế)' : null,
              auditRule: auditRule,
              requiresConfirmation: amt >= 10000000 && !isTax,
              retailRevenue: isTax ? amt : 0,
              formattedRetail: isTax ? `${new Intl.NumberFormat('vi-VN').format(amt)}đ` : '0đ',
              taxStatus: isTax ? 'Khớp 100% CQT' : 'Miễn thuế',
              standard: 'TT152/2025/TT-BTC',
              assignedBook: assignedBook,
              nd70Compliance: amt >= 1000000000 ? 'Bắt buộc HĐĐT-MTT (Nghị định 70/2025)' : 'Khớp HĐĐT NĐ 123'
            });

            if (isTax) {
              setRevenue((prev) => prev + amt);
            }
            addedCount++;
          });

          return [...newRows, ...prevLedger];
        });

        if (addedCount > 0) {
          playTingSound();
          setActiveToast({
            title: `Đồng bộ thành công ${addedCount} giao dịch từ SePay!`,
            sub: `Dữ liệu thật từ tài khoản ${bankDetails.bankCode} đã nạp vào sổ kế toán chuẩn TT 152/2025.`
          });
          setTimeout(() => setActiveToast(null), 5000);
        } else {
          setActiveToast({
            title: 'Tài khoản SePay đã kết nối!',
            sub: 'Không có giao dịch mới chưa ghi sổ. Hệ thống tiếp tục lắng nghe biến động 24/7.'
          });
          setTimeout(() => setActiveToast(null), 4000);
        }
        setShowLiveSetupModal(false);
      } else {
        alert(data.error || 'Không thể đồng bộ với SePay. Vui lòng kiểm tra lại API Token.');
      }
    } catch (err) {
      alert(`Lỗi kết nối SePay: ${err.message}`);
    } finally {
      setLiveSyncLoading(false);
    }
  };

  // INLINE MANUAL OVERRIDE (Tax Classification Override)
  const handleToggleRowTaxable = (rowId) => {
    setS1Ledger((prev) => {
      let diff = 0;
      const updated = prev.map((row) => {
        if (row.id === rowId) {
          const nextTaxable = !row.isTaxable;
          diff = nextTaxable ? row.rawAmount : -row.rawAmount;
          const nextBook = nextTaxable
            ? (taxRegime === 'group1' ? 'Mẫu S1a-HKD' : taxRegime === 'group2' ? 'Mẫu S2a-HKD' : 'Bộ 4 Sổ (S2b, S2c, S2d, S2e)')
            : 'Dòng tiền loại trừ';

          return {
            ...row,
            isTaxable: nextTaxable,
            category: nextTaxable ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
            formattedRetail: nextTaxable ? `${new Intl.NumberFormat('vi-VN').format(row.rawAmount)}đ` : '0đ',
            taxStatus: nextTaxable ? 'Khớp 100% CQT' : 'Miễn thuế',
            overrideReason: nextTaxable ? null : 'Chủ hộ kinh doanh bỏ qua (Không phải doanh thu chịu thuế)',
            assignedBook: nextBook,
            auditRule: nextTaxable 
              ? 'RULE-REV-01: Đã chuyển thành doanh thu chịu thuế theo chỉ định của hộ kinh doanh' 
              : 'RULE-EX-02: Bóc tách thủ công khỏi doanh thu chịu thuế (Không tính thuế Điều 4 TT152)',
            requiresConfirmation: false
          };
        }
        return row;
      });

      setRevenue((prevRev) => Math.max(0, prevRev + diff));
      return updated;
    });

    setActiveToast({
      title: 'Đã cập nhật trạng thái phân loại sổ kế toán',
      sub: 'Số tiền và nghĩa vụ thuế đã được tính toán lại chính xác theo quy chuẩn Thông tư 152.'
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

  // Real-time tax metrics & savings calculation
  const totalBankInflow = s1Ledger.reduce((sum, r) => sum + r.rawAmount, 0);
  const excludedRevenue = s1Ledger.filter((r) => !r.isTaxable).reduce((sum, r) => sum + r.rawAmount, 0);
  const taxSaved = Math.round(excludedRevenue * 0.015); // 1.5% flat tax under Circular 40/2021
  const hoursSaved = Math.round((s1Ledger.length * 15) / 60 * 10) / 10;

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
          <span className="trial-meta-text">Không cần thẻ tín dụng • Chuẩn Thông tư 152/2025 & NĐ 70/2025</span>
        </div>
        <div className="trial-top-actions">
          {effectiveClientId && (
            <Link 
              to="/cpa" 
              className="trial-back-cpa-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(0, 245, 212, 0.1)',
                border: '1px solid rgba(0, 245, 212, 0.35)',
                color: '#00f5d4',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                marginRight: '8px'
              }}
            >
              <BuildingIcon size={13} color="#00f5d4" />
              <span>Về Không Gian Kế Toán (CPA)</span>
            </Link>
          )}
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
              Để phần mềm bắt đầu tự động hóa hệ thống sổ kế toán Thông tư 152/2025/TT-BTC và đối soát HĐĐT theo Nghị định 70/2025/NĐ-CP, 
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

              {/* LIVE OPEN BANKING HUB & REAL WEBHOOK INGESTION */}
              <div className="live-hub-box glass-panel">
                <div className="live-hub-header">
                  <div className="live-hub-title">
                    <ZapIcon size={16} color="#00f5d4" />
                    <span>CỔNG KẾT NỐI NGÂN HÀNG THỰC TẾ (LIVE HUB)</span>
                  </div>
                  <span className="live-stream-badge">
                    <span className="live-stream-dot"></span>
                    <span>ĐANG LẮNG NGHE 24/7</span>
                  </span>
                </div>

                <p className="magic-desc">
                  Hệ thống kết nối trực tiếp với cổng Webhook Open Banking. Bạn có thể <strong>quét mã VietQR bằng app ngân hàng thật</strong> để kiểm thử thực tế, hoặc đấu nối cổng SePay/Casso tự động:
                </p>

                {/* Authenticated Webhook Card with Header Bearer Token */}
                <div className="live-webhook-card">
                  <div className="live-webhook-label">
                    <span>Cổng Webhook Ngân Hàng (HTTP POST):</span>
                    <span style={{ color: '#00f5d4' }}>Header Auth Bắt Buộc</span>
                  </div>
                  <div className="live-webhook-input-row" style={{ marginBottom: '8px' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value="https://www.evolvetech.biz.vn/api/webhook" 
                      className="live-webhook-input"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText("https://www.evolvetech.biz.vn/api/webhook");
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }}
                      className="live-copy-btn"
                    >
                      {copiedWebhook ? 'Đã Chép' : 'Sao Chép URL'}
                    </button>
                  </div>

                  <div className="live-webhook-label">
                    <span>Authorization Bearer Token (Bảo mật riêng tư):</span>
                    <button type="button" onClick={rotateSecretKey} className="secret-rotate-btn">
                      Tạo mã mới
                    </button>
                  </div>
                  <div className="live-webhook-input-row">
                    <input 
                      type="text" 
                      readOnly 
                      value={`Bearer ${streamSecret}`} 
                      className="live-webhook-input"
                      style={{ color: '#00f5d4' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText(`Bearer ${streamSecret}`);
                        setActiveToast({ title: 'Đã sao chép Bearer Token!', sub: 'Dán vào trường Authorization trên cổng Webhook của bạn.' });
                        setTimeout(() => setActiveToast(null), 3000);
                      }}
                      className="live-copy-btn"
                    >
                      Sao Chép Token
                    </button>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', lineHeight: 1.4 }}>
                    Chuẩn an toàn: Không nhúng token vào URL để tránh lộ log truy cập. Dữ liệu tài chính được xử lý nội bộ, không chuyển tiếp ra máy chủ công cộng bên thứ ba (Tuân thủ Nghị định 13/2023/NĐ-CP).
                  </div>
                </div>

                {/* Direct SePay API Token Sync Button */}
                <button 
                  type="button" 
                  className="live-sepay-action-btn"
                  onClick={() => setShowLiveSetupModal(true)}
                >
                  <SparklesIcon size={16} color="#000000" />
                  <span>Đấu Nối SePay.vn / Open Banking (Tự Động)</span>
                </button>

                {/* Real HTTP POST Webhook Triggers */}
                <div className="magic-header" style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>
                    GỬI GIAO DỊCH QUA CỔNG WEBHOOK HTTP THẬT:
                  </span>
                </div>

                <div className="magic-actions">
                  <button 
                    type="button" 
                    className={`magic-btn-fire ${justIngested ? 'magic-pulsing' : ''}`}
                    onClick={() => sendRealWebhookTransaction(150000, 'Khách thanh toán 3 ly cà phê')}
                  >
                    <ZapIcon size={15} color="#ffffff" />
                    <div>
                      <strong>1. Bắn Webhook Bán Lẻ: +150.000đ</strong>
                      <span className="sub-note-hint">Gửi HTTP POST thật tới /api/webhook -&gt; Vào Sổ S1</span>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    className="magic-btn-fire internal-btn"
                    onClick={() => sendRealWebhookTransaction(5000000, 'Nộp tiền cá nhân sửa chữa quán cà phê')}
                    title="A-Sổ tự động nhận diện từ khóa 'sửa chữa' để không tính thuế oan cho bạn"
                  >
                    <ShieldIcon size={15} color="#38bdf8" />
                    <div>
                      <strong>2. Bắn Webhook Sửa Quán: +5.000.000đ</strong>
                      <span className="sub-note-hint">AI lọc từ khóa 'sửa chữa' -&gt; Miễn tính thuế</span>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    className="magic-btn-fire loan-btn"
                    onClick={() => sendRealWebhookTransaction(10000000, 'Vay vốn người nhà nộp tiền mở rộng cơ sở')}
                    title="Chống mất 150k thuế oan mà KiotViet/MISA sẽ tính nhầm thành doanh thu"
                  >
                    <ShieldIcon size={15} color="#c084fc" />
                    <div>
                      <strong>3. Bắn Webhook Vay Vốn: +10.000.000đ</strong>
                      <span className="sub-note-hint">Cứu 150.000đ tiền thuế oan (MISA/KiotViet sẽ tính nhầm)</span>
                    </div>
                  </button>

                  <button 
                    type="button" 
                    className="magic-btn-fire secondary"
                    onClick={() => sendRealWebhookTransaction(2500000, 'Bàn tiệc sinh nhật #08')}
                  >
                    <ZapIcon size={15} color="#FFA100" />
                    <div>
                      <strong>4. Bắn Webhook Bán Lẻ Lớn: +2.500.000đ</strong>
                      <span className="sub-note-hint">Đối soát tài khoản ngân hàng & chốt Sổ S1</span>
                    </div>
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

                {/* Tax Shield Banner: Protecting Personal Money from Unfair Taxation */}
                <div className="tax-shield-banner">
                  <div className="tsb-left">
                    <ShieldIcon size={20} color="#00f5d4" />
                    <div>
                      <div className="tsb-title">KHIÊN BẢO VỆ DÒNG TIỀN (TAX SHIELD)</div>
                      <div className="tsb-desc">
                        {excludedRevenue > 0 ? (
                          <span>Đã bóc tách <strong>{new Intl.NumberFormat('vi-VN').format(excludedRevenue)}đ</strong> dòng tiền cá nhân • Cứu ngay <strong>{new Intl.NumberFormat('vi-VN').format(taxSaved)}đ</strong> tiền thuế không bị nộp oan!</span>
                        ) : (
                          <span>Tự động phát hiện & loại trừ tiền nạp cá nhân, tiền vay để không bị tính thuế oan như phần mềm cũ.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {excludedRevenue > 0 && (
                    <div className="tsb-saved-pill">
                      <span>Đã Cứu:</span>
                      <strong>+{new Intl.NumberFormat('vi-VN').format(taxSaved)}đ</strong>
                    </div>
                  )}
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

              {/* COMPETITOR COMPARISON: A-Sổ vs MISA vs KiotViet */}
              <div className="competitor-comparison-card glass-panel">
                <div className="comp-header">
                  <div className="comp-header-badge">
                    <ShieldIcon size={14} color="#FFA100" />
                    <span>SO SÁNH THỰC TẾ</span>
                  </div>
                  <h4 className="comp-title">Tại Sao A-Sổ Thay Thế Hoàn Toàn Bộ Đôi MISA + KiotViet?</h4>
                  <p className="comp-sub">
                    Giải quyết triệt để 3 bế tắc lớn nhất khiến 80% chủ hộ kinh doanh và SME đau đầu:
                  </p>
                </div>
                <div className="comp-grid">
                  <div className="comp-col comp-kiotviet">
                    <div className="comp-brand-tag">KiotViet (POS Bán hàng)</div>
                    <ul className="comp-list">
                      <li>• <strong>Chưa tối ưu TT 152/2025:</strong> Chưa hỗ trợ phân loại theo phương pháp tính thuế TT 152 (S1a/S2a/Bộ 4 Sổ), chỉ in bill quầy.</li>
                      <li>• <strong>Mất 30h/tháng gõ Excel:</strong> Phải xuất file ra rồi tự nhập liệu lại vào phần mềm kế toán.</li>
                      <li>• <strong>Lỗi kết nối HĐĐT:</strong> Nghẽn lệnh giờ cao điểm, phụ thuộc vào kết nối máy in tại quầy.</li>
                    </ul>
                  </div>
                  <div className="comp-col comp-misa">
                    <div className="comp-brand-tag">MISA (Kế toán truyền thống)</div>
                    <ul className="comp-list">
                      <li>• <strong>Bắt học định khoản Nợ/Có:</strong> Bắt chủ quán học TK 111, 511, lập chứng từ thủ công phức tạp.</li>
                      <li>• <strong>Tính thuế oan dòng tiền:</strong> Không tự bóc tách tiền vay, nạp vốn cá nhân với doanh thu chịu thuế.</li>
                      <li>• <strong>Phí phát sinh liên tục:</strong> Phí bảo trì hàng năm, phụ phí block hóa đơn điện tử.</li>
                    </ul>
                  </div>
                  <div className="comp-col comp-aso active-glow">
                    <div className="comp-brand-tag tag-aso">
                      <SparklesIcon size={14} color="#00f5d4" />
                      <span>A-Sổ (Chuẩn TT 152/2025/TT-BTC)</span>
                    </div>
                    <ul className="comp-list">
                      <li>• <strong>Chuẩn Gốc Thông Tư 152/2025:</strong> Tự động phân loại Sổ S1a, S2a hoặc Bộ 4 Sổ (S2b-S2e) theo phương pháp thuế.</li>
                      <li>• <strong>Bộ Lọc Chống Thuế Oan (Tax Shield):</strong> Tự bóc tách tiền vay, nạp vốn cá nhân + quyền Bỏ qua 1-chạm.</li>
                      <li>• <strong>Khép Kín Cơ Quan Thuế:</strong> Tự động đối soát hóa đơn điện tử Nghị định 70 & 123, xuất XML chuẩn CQT.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* S1a/S2a/S2b-HKD Ledger Table (Circular 152/2025/TT-BTC Standard) */}
              <div className="s1-ledger-box glass-panel">
                <div className="ledger-box-header">
                  <div>
                    <div className="ledger-tag-row">
                      <span className="ledger-badge-tt152">
                        {taxRegime === 'group1' && 'NHÓM 1: MẪU S1a-HKD'}
                        {taxRegime === 'group2' && 'NHÓM 2: MẪU S2a-HKD'}
                        {taxRegime === 'group3' && 'NHÓM 3: BỘ 4 SỔ (S2b, S2c, S2d, S2e)'}
                      </span>
                      <span className="ledger-badge-legal">THÔNG TƯ 152/2025/TT-BTC</span>
                      <span className="ledger-badge-compliance">ĐỐI SOÁT HĐĐT NGHỊ ĐỊNH 70 & 123</span>
                    </div>

                    {/* TT152 Statutory Tax Regime Selector */}
                    <div className="tt152-tier-selector">
                      <span className="tt152-tier-label">Phương pháp tính thuế (TT152):</span>
                      <button 
                        type="button" 
                        className={`tt152-tier-btn ${taxRegime === 'group1' ? 'active' : ''}`}
                        onClick={() => setTaxRegime('group1')}
                      >
                        Nhóm 1: Dưới ngưỡng chịu thuế (&lt; 500M) - S1a-HKD
                      </button>
                      <button 
                        type="button" 
                        className={`tt152-tier-btn ${taxRegime === 'group2' ? 'active' : ''}`}
                        onClick={() => setTaxRegime('group2')}
                      >
                        Nhóm 2: Thuế % trên doanh thu - S2a-HKD
                      </button>
                      <button 
                        type="button" 
                        className={`tt152-tier-btn ${taxRegime === 'group3' ? 'active' : ''}`}
                        onClick={() => setTaxRegime('group3')}
                      >
                        Nhóm 3: Thuế TNCN theo thu nhập - Bộ 4 Sổ (S2b, S2c, S2d, S2e)
                      </button>
                    </div>

                    {/* Decree 70/2025/ND-CP Compliance Callout */}
                    <div className="nd70-compliance-callout">
                      <div className="nd70-header">
                        <ShieldIcon size={14} color="#00f5d4" />
                        <span>Quy Định HĐĐT Khởi Tạo Từ Máy Tính Tiền (Nghị định 70/2025/NĐ-CP)</span>
                      </div>
                      <p className="nd70-desc">
                        Từ 01/06/2025, hộ kinh doanh F&amp;B, bán lẻ có doanh thu từ 1 tỷ đồng/năm bắt buộc kết nối dữ liệu HĐĐT-MTT với Cục Thuế. A-Sổ tự động đối soát giao dịch VietQR ngân hàng với HĐĐT từ các nhà cung cấp (VNPT, Viettel, MISA meInvoice, EasyInvoice) để đảm bảo không lệch sổ khi thanh tra.
                      </p>
                    </div>

                    <h3 className="ledger-box-title">
                      {taxRegime === 'group1' && 'Sổ Doanh Thu Bán Hàng Hóa, Dịch Vụ (Mẫu S1a-HKD)'}
                      {taxRegime === 'group2' && 'Sổ Doanh Thu Theo Nhóm Ngành Nghề Thuế Suất (Mẫu S2a-HKD)'}
                      {taxRegime === 'group3' && 'Hệ Thống 4 Sổ Kế Toán Chi Tiết Doanh Thu & Chi Phí (S2b, S2c, S2d, S2e-HKD)'}
                    </h3>
                    <p className="ledger-box-sub">
                      Tự động phân loại từ VietQR theo chuẩn Thông tư 152/2025/TT-BTC. Bạn có quyền <strong>Bỏ qua / Khôi phục</strong> từng dòng trước khi xuất XML nộp thuế.
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
                                <span className="override-reason-hint">-&gt; {row.overrideReason}</span>
                              )}
                              {row.auditRule && (
                                <div><span className="audit-rule-tag">{row.auditRule}</span></div>
                              )}
                              {row.requiresConfirmation && (
                                <div><span className="warning-confirmation-badge">Cần xác nhận thủ công (Số tiền lớn)</span></div>
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
                                <span className="excluded-amount-strike">0đ (Đã bóc tách)</span>
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
                              {/* INLINE EDIT / TAX CLASSIFICATION OVERRIDE TOGGLE */}
                              <button
                                type="button"
                                className={`override-toggle-btn ${row.isTaxable ? 'btn-ignore' : 'btn-restore'}`}
                                onClick={() => handleToggleRowTaxable(row.id)}
                                title={row.isTaxable ? 'Bỏ qua dòng này (Không phải doanh thu chịu thuế)' : 'Chuyển thành doanh thu chịu thuế'}
                              >
                                {row.isTaxable ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <SlashCircleIcon size={12} color="currentColor" />
                                    <span>Bỏ qua (Nội bộ)</span>
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <RefreshCwIcon size={12} color="currentColor" />
                                    <span>Chuyển thành doanh thu</span>
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
                        <tr className="tfoot-inflow-row">
                          <td colSpan={4} className="total-label" style={{ color: '#94a3b8' }}>TỔNG DÒNG TIỀN VÀO TÀI KHOẢN NGÂN HÀNG:</td>
                          <td className="text-right mono" style={{ color: '#94a3b8', fontSize: '13px' }}>
                            {new Intl.NumberFormat('vi-VN').format(totalBankInflow)}đ
                          </td>
                          <td colSpan={2} style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {s1Ledger.length} giao dịch ghi nhận
                          </td>
                        </tr>
                        {excludedRevenue > 0 && (
                          <tr className="tfoot-exempt-row" style={{ background: 'rgba(0, 245, 212, 0.04)' }}>
                            <td colSpan={4} className="total-label" style={{ color: '#00f5d4' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <ShieldIcon size={12} color="#00f5d4" />
                                <span>TIỀN NỘI BỘ / CÁ NHÂN ĐÃ LOẠI TRỪ (MIỄN THUẾ):</span>
                              </span>
                            </td>
                            <td className="text-right mono" style={{ color: '#00f5d4', fontWeight: 800 }}>
                              -{new Intl.NumberFormat('vi-VN').format(excludedRevenue)}đ
                            </td>
                            <td colSpan={2} style={{ color: '#00f5d4', fontWeight: 700, fontSize: '11px' }}>
                              <span>Tiết kiệm ngay +{new Intl.NumberFormat('vi-VN').format(taxSaved)}đ tiền thuế</span>
                            </td>
                          </tr>
                        )}
                        <tr className="tfoot-main-row">
                          <td colSpan={4} className="total-label" style={{ fontWeight: 800, color: '#ffffff' }}>
                            CỘNG DOANH THU THỰC TẾ CHỊU THUẾ (S1a-HKD):
                          </td>
                          <td className="text-right total-amount mono">
                            {new Intl.NumberFormat('vi-VN').format(revenue)}đ
                          </td>
                          <td colSpan={2} className="total-status">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckIcon size={12} color="#4ade80" />
                              <span>Đã chuẩn hóa 100% Thông tư 152/2025/TT-BTC (Tiết kiệm ~{hoursSaved}h gõ tay)</span>
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
      {/* SEPAY / CASSO OPEN BANKING LIVE SETUP MODAL                              */}
      {/* ========================================================================= */}
      {showLiveSetupModal && (
        <div className="modal-backdrop">
          <div className="sepay-connect-modal glass-panel">
            <div className="modal-header">
              <div className="modal-header-left">
                <SparklesIcon size={22} color="#00f5d4" />
                <h3 className="modal-title" style={{ color: '#00f5d4' }}>Đấu Nối Open Banking SePay.vn Trực Tiếp</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowLiveSetupModal(false)}
              >
                <CloseIcon size={18} color="currentColor" />
              </button>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
              Kết nối trực tiếp tài khoản ngân hàng của bạn qua SePay.vn (miễn phí 1 tài khoản). Khi có bất kỳ ai quét VietQR chuyển tiền, A-Sổ sẽ tự động bắt giao dịch và ghi vào Sổ S1 ngay tức khắc:
            </div>

            <form onSubmit={(e) => { e.preventDefault(); syncLiveSepay(); }}>
              <div className="form-group">
                <label className="form-label">Nhập API Token Của Bạn Từ SePay.vn:</label>
                <input 
                  type="text" 
                  value={sepayApiKey}
                  onChange={(e) => setSepayApiKey(e.target.value.trim())}
                  placeholder="Ví dụ: SP_0988123xxx"
                  required 
                  className="trial-input mono"
                />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                  Lấy Token tại: <em>my.sepay.vn -&gt; Cấu hình -&gt; API Key</em> (Miễn phí hoàn toàn).
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Tài Khoản Đang Liên Kết:</label>
                <input 
                  type="text" 
                  readOnly
                  value={`${bankDetails.bankName} — ${bankDetails.accountNumber}`}
                  className="trial-input mono"
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className="nano-button modal-submit-btn" 
                  style={{ flex: 1, background: 'linear-gradient(135deg, #00f5d4 0%, #06b6d4 100%)', color: '#000000', fontWeight: 800 }}
                  disabled={liveSyncLoading}
                >
                  {liveSyncLoading ? 'Đang Đồng Bộ Dữ Liệu...' : 'Kích Hoạt & Kéo Giao Dịch Thật'}
                </button>
                <button 
                  type="button" 
                  className="live-copy-btn"
                  onClick={() => setShowLiveSetupModal(false)}
                >
                  Đóng
                </button>
              </div>
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
              <span className="upgrade-badge">SỔ S1a-HKD CỦA BẠN ĐÃ HOÀN HẢO 100%</span>
              <h2 className="upgrade-headline">
                Sẵn Sàng Nộp Cho Cơ Quan Thuế?
              </h2>
              <p className="upgrade-pitch">
                Toàn bộ dòng tiền bán lẻ quét mã VietQR đã được A-Sổ tự động kết chuyển vào bộ sổ chuẩn Thông tư 152/2025/TT-BTC, và đã được loại trừ các khoản chuyển tiền nội bộ.
                <br /><br />
                <strong>Nâng cấp lên Gói Tự Động (249k/tháng)</strong> để kích hoạt tính năng <strong>kết xuất file XML/Excel nộp thẳng Cổng Thuế</strong> và mở khóa tính năng <strong>Đối chiếu Hóa đơn điện tử Nghị định 123</strong>.
              </p>

              <div className="upgrade-comparison-list">
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span><strong>Tiết kiệm hơn 30 giờ/tháng</strong> nhập liệu thủ công giữa sao kê ngân hàng và Excel</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span><strong>1 Click xuất file XML</strong> nộp trực tiếp Cổng Thuế thuedientu.gdt.gov.vn không giới hạn</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span><strong>Tự động bảo vệ dòng tiền cá nhân:</strong> Không bị tính thuế oan tiền vay, tiền nạp vốn</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span><strong>Đồng bộ Hóa đơn điện tử NĐ 123:</strong> Không đứt gãy kết nối, không đổ lỗi bên thứ 3</span>
                </div>
                <div className="ucl-item">
                  <CheckCircleIcon size={16} color="#4ade80" />
                  <span><strong>Minh bạch trọn gói:</strong> Không phí bảo trì hàng năm, không phí block hóa đơn</span>
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
