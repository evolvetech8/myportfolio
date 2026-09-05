import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShoppingCartIcon, FileTextIcon, QrCodeIcon, LandmarkIcon, DownloadIcon, CheckCircleIcon, SparklesIcon, ShieldIcon } from './Icons';

export default function HeroCommandCenter() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'traffic' | 'ledgers'
  const [activeItem, setActiveItem] = useState(0);
  const [extraFeed, setExtraFeed] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(9650000);
  const [justSimulated, setJustSimulated] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState('S1');

  const initialFeed = [
    {
      id: 'item1',
      title: 'Bán lẻ tại quầy (Máy POS #04)',
      desc: 'Tự động kết chuyển vào Sổ Doanh thu (S1-HKD)',
      amount: '+1.450.000đ',
      tag: 'Đã vào sổ S1',
      time: 'Vừa xong',
      icon: <ShoppingCartIcon size={18} color="#FF8A00" />,
      iconBg: 'rgba(255, 109, 0, 0.14)',
      tagColor: '#FFA100',
      tagBg: 'rgba(255, 161, 0, 0.12)',
      borderAccent: 'rgba(255, 109, 0, 0.45)'
    },
    {
      id: 'item2',
      title: 'Hóa đơn điện tử đầu vào (#008491)',
      desc: 'Khớp mã Tổng cục Thuế (NĐ 123) → Ghi Sổ Hàng hóa (S2)',
      amount: 'Hợp lệ NĐ 123',
      tag: 'Khớp mã 100%',
      time: '4s trước',
      icon: <FileTextIcon size={18} color="#4ade80" />,
      iconBg: 'rgba(74, 222, 128, 0.14)',
      tagColor: '#4ade80',
      tagBg: 'rgba(74, 222, 128, 0.12)',
      borderAccent: 'rgba(74, 222, 128, 0.45)'
    },
    {
      id: 'item3',
      title: 'Khách thanh toán quét mã VietQR',
      desc: 'Tự động cân đối Sổ Tiền gửi ngân hàng (S5-HKD)',
      amount: '+8.200.000đ',
      tag: 'Đã khớp ngân hàng',
      time: '9s trước',
      icon: <QrCodeIcon size={18} color="#38bdf8" />,
      iconBg: 'rgba(56, 189, 248, 0.14)',
      tagColor: '#38bdf8',
      tagBg: 'rgba(56, 189, 248, 0.12)',
      borderAccent: 'rgba(56, 189, 248, 0.45)'
    },
    {
      id: 'item4',
      title: 'Đối soát sổ quỹ & tiền mặt cuối ngày',
      desc: 'Tự động cân bằng Sổ Tiền mặt (S4-HKD) & Chi phí (S3)',
      amount: 'Cân đối 100%',
      tag: 'Chuẩn TT88',
      time: '15s trước',
      icon: <LandmarkIcon size={18} color="#a78bfa" />,
      iconBg: 'rgba(167, 139, 250, 0.14)',
      tagColor: '#a78bfa',
      tagBg: 'rgba(167, 139, 250, 0.12)',
      borderAccent: 'rgba(167, 139, 250, 0.45)'
    }
  ];

  const allFeeds = [...extraFeed, ...initialFeed];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % allFeeds.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [allFeeds.length]);

  // Interactive Live Simulation Trigger
  const handleSimulateTransaction = () => {
    const randomAmount = Math.floor(Math.random() * 4 + 2) * 150000 + 250000;
    const formatted = new Intl.NumberFormat('vi-VN').format(randomAmount);
    
    const newTx = {
      id: `sim-${Date.now()}`,
      title: 'Khách quét VietQR tại quầy',
      desc: `A-Sổ ghi nhận giao dịch +${formatted}đ → Tự động chốt Sổ Doanh thu (S1) & Tiền gửi (S5)`,
      amount: `+${formatted}đ`,
      tag: 'VỪA VÀO SỔ TỰ ĐỘNG',
      time: 'Vừa xong',
      icon: <SparklesIcon size={18} color="#FFA100" />,
      iconBg: 'rgba(255, 161, 0, 0.25)',
      tagColor: '#4ade80',
      tagBg: 'rgba(74, 222, 128, 0.2)',
      borderAccent: '#FFA100',
      isNew: true
    };

    setExtraFeed((prev) => [newTx, ...prev.slice(0, 3)]);
    setTodayRevenue((prev) => prev + randomAmount);
    setJustSimulated(true);
    setActiveItem(0);
    setTimeout(() => setJustSimulated(false), 2500);
  };

  const ledgerDetails = {
    S1: { name: 'Sổ Doanh Thu (S1-HKD)', desc: 'Tự động tổng hợp 100% doanh thu POS & VietQR', status: 'Khớp 100%', code: 'Mẫu TT 88/2021/TT-BTC' },
    S2: { name: 'Sổ Vật Liệu & Hàng Hóa (S2-HKD)', desc: 'Tự động nhập kho từ hóa đơn điện tử NĐ 123', status: 'Không chênh lệch', code: 'Nhập - Xuất - Tồn chuẩn' },
    S3: { name: 'Sổ Chi Phí SXKD (S3-HKD)', desc: 'Bóc tách chi phí hợp lý, khấu trừ thuế chính xác', status: 'Đã hạch toán', code: 'Chứng từ hợp lệ' },
    S4: { name: 'Sổ Quỹ Tiền Mặt (S4-HKD)', desc: 'Theo dõi tiền mặt thu - chi tại quầy theo ca', status: 'Cân bằng quỹ', code: 'Khớp thực tế' },
    S5: { name: 'Sổ Tiền Gửi Ngân Hàng (S5-HKD)', desc: 'Tự đối soát biến động số dư VietQR 24/7', status: 'Khớp sao kê', code: 'Tự động hóa' },
    S6: { name: 'Sổ Thuế & Các Khoản Nộp NSNN (S6-HKD)', desc: 'Tính thuế GTGT & TNCN tự động theo quý', status: 'Sẵn sàng nộp', code: 'Đúng hạn 100%' },
    S7: { name: 'Sổ Tiền Lương & BHXH (S7-HKD)', desc: 'Quản lý bảng lương nhân sự quầy & chi nhánh', status: 'Đã kết xuất', code: 'Chuẩn biểu mẫu' }
  };

  return (
    <div className="hero-command-center glass-panel">
      {/* SaaS App Header */}
      <div className="hcc-header">
        <div className="hcc-dots">
          <span className="hcc-dot hcc-dot-red"></span>
          <span className="hcc-dot hcc-dot-yellow"></span>
          <span className="hcc-dot hcc-dot-green"></span>
        </div>
        <div className="hcc-title-wrap">
          <span className="hcc-app-badge">{t('mockup.windowTitle')}</span>
          <span className="hcc-store-context">{t('mockup.storeContext')}</span>
        </div>
        <div className="hcc-status">
          <span className="hcc-status-beacon"></span>
          <span>{t('mockup.status')}</span>
        </div>
      </div>

      {/* Interactive Mode Navigation Tabs inside App Shell */}
      <div className="hcc-tabs-bar">
        <button
          type="button"
          className={`hcc-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <span className="tab-icon">⚡</span>
          <span>Nhật Ký Tự Động ({allFeeds.length})</span>
        </button>
        <button
          type="button"
          className={`hcc-tab-btn ${activeTab === 'traffic' ? 'active' : ''}`}
          onClick={() => setActiveTab('traffic')}
        >
          <span className="tab-icon">🚦</span>
          <span>Cảnh Báo Đèn Giao Thông</span>
        </button>
        <button
          type="button"
          className={`hcc-tab-btn ${activeTab === 'ledgers' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledgers')}
        >
          <span className="tab-icon">📑</span>
          <span>7 Sổ Kế Toán TT88</span>
        </button>

        {/* Live Simulation Action Button */}
        <button
          type="button"
          className={`hcc-simulate-btn ${justSimulated ? 'simulated-pulse' : ''}`}
          onClick={handleSimulateTransaction}
          title="Bấm để tạo một giao dịch thử nghiệm và xem A-Sổ tự động ghi vào sổ sách"
        >
          <SparklesIcon size={14} color="#FFA100" />
          <span>{justSimulated ? '⚡ ĐÃ TỰ ĐỘNG GHI VÀO SỔ!' : '+ Thử Tạo 1 Giao Dịch VietQR'}</span>
        </button>
      </div>

      {/* TAB 1: Live Transactions Feed */}
      {activeTab === 'feed' && (
        <div className="hcc-body">
          {/* Left Column: Live Accounting & Activity Stream */}
          <div className="hcc-feed">
            <div className="hcc-feed-header">
              <div className="hcc-feed-header-left">
                <span className="hcc-feed-dot"></span>
                <span className="hcc-feed-heading">{t('mockup.feedHeader')}</span>
              </div>
              <span className="hcc-feed-badge-live">{t('mockup.feedLiveBadge')}</span>
            </div>

            <div className="hcc-feed-list">
              {allFeeds.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`hcc-feed-card ${idx === activeItem ? 'hcc-feed-card-active' : ''} ${item.isNew ? 'hcc-feed-card-new' : ''}`}
                  style={idx === activeItem ? { borderColor: item.borderAccent } : {}}
                >
                  <div className="hcc-card-icon" style={{ background: item.iconBg }}>
                    {item.icon}
                  </div>
                  <div className="hcc-card-content">
                    <div className="hcc-card-top-row">
                      <span className="hcc-card-title">{item.title}</span>
                      <span className="hcc-card-amount">{item.amount}</span>
                    </div>
                    <div className="hcc-card-bottom-row">
                      <span className="hcc-card-desc">{item.desc}</span>
                    </div>
                  </div>
                  <div className="hcc-card-meta">
                    <span 
                      className="hcc-status-pill"
                      style={{ color: item.tagColor, background: item.tagBg }}
                    >
                      {item.tag}
                    </span>
                    <span className="hcc-card-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Financial Health & Tax Audit Readiness */}
          <div className="hcc-metrics-widget">
            <div className="hcc-audit-card">
              <div className="hcc-revenue-counter-badge">
                <span className="revenue-lbl">Doanh thu hôm nay:</span>
                <span className="revenue-val">{new Intl.NumberFormat('vi-VN').format(todayRevenue)} đ</span>
              </div>
              <div className="hcc-audit-top">
                <span className="hcc-audit-score">100%</span>
                <div className="hcc-audit-badge-wrap">
                  <CheckCircleIcon size={15} color="#4ade80" />
                  <span>{t('mockup.complianceScore')}</span>
                </div>
              </div>
              <span className="hcc-audit-sub">{t('mockup.auditReady')}</span>
              
              <button 
                className="hcc-export-action-btn" 
                type="button"
                onClick={() => alert('Xuất thành công 7 Sổ Kế Toán (S1-S7) chuẩn file Excel/XML cho Cơ Quan Thuế!')}
              >
                <DownloadIcon size={14} color="#ffffff" />
                <span>{t('mockup.exportBtn')}</span>
              </button>
            </div>

            <div className="hcc-ledger-bars">
              <span className="hcc-ledger-section-title">{t('mockup.ledgerProgressTitle')}</span>
              
              <div className="hcc-bar-row">
                <div className="hcc-bar-labels">
                  <span>{t('mockup.ledger1')}</span>
                  <span className="hcc-bar-status-text">{t('mockup.ledger1Status')}</span>
                </div>
                <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
              </div>

              <div className="hcc-bar-row">
                <div className="hcc-bar-labels">
                  <span>{t('mockup.ledger2')}</span>
                  <span className="hcc-bar-status-text">{t('mockup.ledger2Status')}</span>
                </div>
                <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
              </div>

              <div className="hcc-bar-row">
                <div className="hcc-bar-labels">
                  <span>{t('mockup.ledger3')}</span>
                  <span className="hcc-bar-status-text">{t('mockup.ledger3Status')}</span>
                </div>
                <div className="hcc-progress-bar"><div className="hcc-progress-fill hcc-progress-accent" style={{ width: '100%' }}></div></div>
              </div>
            </div>

            <div className="hcc-security-note">
              <CheckCircleIcon size={14} color="#4ade80" />
              <span>{t('mockup.securityReassurance')}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Traffic Light Tax Warning Simulator */}
      {activeTab === 'traffic' && (
        <div className="hcc-traffic-tab-body">
          <div className="traffic-grid">
            <div className="traffic-card traffic-green">
              <div className="traffic-indicator">
                <span className="traffic-light-bulb bulb-green"></span>
                <span className="traffic-title">AN TOÀN (100% HỢP LỆ)</span>
              </div>
              <div className="traffic-stat">142 Hóa Đơn Khớp CQT</div>
              <p className="traffic-desc">
                Hóa đơn điện tử đầu vào & đầu ra đã xác thực trực tiếp với Tổng cục Thuế theo NĐ 123. Không có rủi ro hóa đơn bất hợp pháp.
              </p>
              <span className="traffic-badge">SẴN SÀNG QUYẾT TOÁN</span>
            </div>

            <div className="traffic-card traffic-yellow">
              <div className="traffic-indicator">
                <span className="traffic-light-bulb bulb-yellow"></span>
                <span className="traffic-title">CẦN LƯU Ý (LỆCH NHẸ)</span>
              </div>
              <div className="traffic-stat">1 Chênh Lệch Dòng Tiền</div>
              <p className="traffic-desc">
                Giao dịch VietQR +12.000đ ngoài giờ ca bán lẻ. A-Sổ tự động phát hiện và gợi ý bút toán điều chỉnh vào Sổ S4 & S5 trong 1 click.
              </p>
              <span className="traffic-badge" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}>
                TỰ ĐỘNG GỢI Ý CÂN ĐỐI
              </span>
            </div>

            <div className="traffic-card traffic-red">
              <div className="traffic-indicator">
                <span className="traffic-light-bulb bulb-red"></span>
                <span className="traffic-title">CẢNH BÁO RỦI RO CAO</span>
              </div>
              <div className="traffic-stat">0 Hóa Đơn Rủi Ro</div>
              <p className="traffic-desc">
                Hệ thống tự động rà soát danh sách đen doanh nghiệp bỏ trốn / ngừng hoạt động. Khóa ngay hóa đơn vi phạm trước khi kê khai thuế.
              </p>
              <span className="traffic-badge" style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.4)' }}>
                100% AN TOÀN TUYỆT ĐỐI
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 7 Sổ Kế Toán TT88 Explorer */}
      {activeTab === 'ledgers' && (
        <div className="hcc-ledgers-tab-body">
          <div className="ledgers-pill-selector">
            {Object.keys(ledgerDetails).map((k) => (
              <button
                key={k}
                type="button"
                className={`ledger-selector-btn ${selectedLedger === k ? 'active' : ''}`}
                onClick={() => setSelectedLedger(k)}
              >
                <strong>{k}</strong>
                <span>{k === 'S1' ? 'Doanh Thu' : k === 'S2' ? 'Hàng Hóa' : k === 'S3' ? 'Chi Phí' : k === 'S4' ? 'Tiền Mặt' : k === 'S5' ? 'Tiền Gửi' : k === 'S6' ? 'Thuế' : 'Lương'}</span>
              </button>
            ))}
          </div>

          <div className="ledger-preview-box glass-panel">
            <div className="ledger-preview-header">
              <div>
                <h4 className="ledger-preview-title">{ledgerDetails[selectedLedger].name}</h4>
                <p className="ledger-preview-desc">{ledgerDetails[selectedLedger].desc}</p>
              </div>
              <div className="ledger-preview-status">
                <span className="micro-status-tag">{ledgerDetails[selectedLedger].status}</span>
                <span className="ledger-code-tag">{ledgerDetails[selectedLedger].code}</span>
              </div>
            </div>

            {/* Sample Table Preview */}
            <div className="ledger-table-wrap">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Ngày/Tháng</th>
                    <th>Số Chứng Từ</th>
                    <th>Diễn Giải Nghiệp Vụ</th>
                    <th>Số Tiền (VND)</th>
                    <th>Trạng Thái Đối Chiếu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>05/09/2026</td>
                    <td>POS-0482</td>
                    <td>Doanh thu bán lẻ quầy thu ngân ca chiều</td>
                    <td className="amount-col">+1.450.000</td>
                    <td><span className="verified-pill">✓ Đã ghi sổ tự động</span></td>
                  </tr>
                  <tr>
                    <td>05/09/2026</td>
                    <td>VQR-9912</td>
                    <td>Thanh toán hóa đơn qua mã VietQR Techcombank</td>
                    <td className="amount-col">+8.200.000</td>
                    <td><span className="verified-pill">✓ Khớp số dư ngân hàng</span></td>
                  </tr>
                  <tr>
                    <td>04/09/2026</td>
                    <td>HĐĐT-008491</td>
                    <td>Nhập nguyên vật liệu làm bánh (Nghị định 123)</td>
                    <td className="amount-col">-3.120.000</td>
                    <td><span className="verified-pill">✓ Khớp mã Tổng cục Thuế</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
