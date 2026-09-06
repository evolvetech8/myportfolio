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
  ArrowRightIcon
} from './Icons';

export default function ClientReadOnlyPortal({ client, onClose, onOpenFullLedger }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'books' | 'invoices'
  const [copiedLink, setCopiedLink] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  if (!client) return null;

  const shareableUrl = `https://www.evolvetech.biz.vn/portal?client=${client.id}&token=cpa_view_${client.mst.replace(/[^0-9]/g, '')}`;

  const copyShareLink = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
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

  // Format currency helper
  const fmt = (num) => new Intl.NumberFormat('vi-VN').format(num) + 'đ';

  return (
    <div className="client-portal-overlay">
      <div className="client-portal-modal glass-panel">
        
        {/* CPA Firm Header Bar */}
        <div className="portal-cpa-banner">
          <div className="portal-cpa-identity">
            <div className="portal-cpa-badge">
              <LandmarkIcon size={14} color="#FFA100" />
              <span>ĐẠI LÝ THUẾ &amp; DỊCH VỤ KẾ TOÁN AN BÌNH</span>
            </div>
            <span className="portal-cpa-divider">•</span>
            <span className="portal-sub-tag">Cổng Tra Cứu Số Liệu Thuế Khách Hàng (Công nghệ A-Sổ)</span>
          </div>

          <div className="portal-header-actions">
            <button 
              type="button" 
              className="portal-share-btn"
              onClick={copyShareLink}
              title="Sao chép liên kết chỉ đọc gửi cho chủ hộ kinh doanh"
            >
              {copiedLink ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#4ade80' }}>
                  <CheckIcon size={13} color="#4ade80" />
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
              <LockIcon size={13} color="#38bdf8" />
              <span>Chế độ chỉ đọc bảo mật</span>
            </div>
            <button 
              type="button" 
              className="portal-open-ledger-btn"
              onClick={() => onOpenFullLedger(client)}
            >
              <span>Vào Làm Sổ Chi Tiết</span>
              <ArrowRightIcon size={12} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="portal-tabs-bar">
          <button 
            type="button" 
            className={`portal-tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Tổng Quan Thuế &amp; Doanh Thu
          </button>
          <button 
            type="button" 
            className={`portal-tab ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Sổ Sách TT 152/2025
          </button>
          <button 
            type="button" 
            className={`portal-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Đối Soát HĐĐT (NĐ 70 &amp; 123)
          </button>
        </div>

        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="portal-tab-content">
            {/* KPI Cards */}
            <div className="portal-kpi-grid">
              <div className="portal-kpi-card">
                <span className="portal-kpi-label">Tổng Dòng Tiền Vào (Ngân hàng &amp; Quầy)</span>
                <div className="portal-kpi-val">{fmt(client.totalBankInflow || client.revenue * 1.15)}</div>
                <span className="portal-kpi-sub">Bao gồm cả dòng tiền nội bộ &amp; vay vốn</span>
              </div>

              <div className="portal-kpi-card">
                <span className="portal-kpi-label">Dòng Tiền Bóc Tách (Miễn Thuế Đ.4 TT152)</span>
                <div className="portal-kpi-val kpi-green">{fmt(client.excludedFlow || client.revenue * 0.15)}</div>
                <span className="portal-kpi-sub">Đã bảo vệ không bị tính thuế oan</span>
              </div>

              <div className="portal-kpi-card">
                <span className="portal-kpi-label">Doanh Thu Kê Khai Chịu Thuế (Lũy Kế 2026)</span>
                <div className="portal-kpi-val kpi-amber">{fmt(client.revenue)}</div>
                <span className="portal-kpi-sub">Khớp 100% với Sổ Kế Toán Thông tư 152</span>
              </div>

              <div className="portal-kpi-card">
                <span className="portal-kpi-label">Thuế Ước Tính Phải Nộp (Quý 1/2026)</span>
                <div className="portal-kpi-val kpi-cyan">{fmt(client.estimatedTax || Math.round(client.revenue * 0.015))}</div>
                <span className="portal-kpi-sub">GTGT &amp; TNCN (Tỷ lệ {client.taxRate || '1.5%'})</span>
              </div>
            </div>

            {/* Decree 70 Progress Callout */}
            <div className="portal-nd70-bar glass-panel">
              <div className="portal-nd70-info">
                <div className="nd70-status-title">
                  <ShieldIcon size={16} color="#00f5d4" />
                  <span>Tiến Trình Ngưỡng HĐĐT-MTT (Nghị định 70/2025/NĐ-CP):</span>
                  <strong>{fmt(client.revenue)} / 1.000.000.000đ</strong>
                </div>
                <p className="nd70-note">
                  {client.revenue >= 1000000000
                    ? 'Cơ sở đã vượt ngưỡng 1 tỷ đồng. Đã kích hoạt bắt buộc HĐĐT khởi tạo từ máy tính tiền kết nối CQT.'
                    : `Cơ sở đạt ${(client.revenue / 10000000).toFixed(1)}% ngưỡng 1 tỷ đồng. Kế toán đang chủ động theo dõi để chuyển đổi kịp thời.`}
                </p>
              </div>
              <div className="nd70-progress-outer">
                <div 
                  className="nd70-progress-inner"
                  style={{ width: `${Math.min(100, (client.revenue / 1000000000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Recent Transaction Audit Feed */}
            <div className="portal-recent-box glass-panel">
              <div className="portal-recent-header">
                <h3>Giao Dịch Gần Đây Đã Được Kế Toán Đối Soát</h3>
                <span className="portal-audit-badge">
                  <CheckCircleIcon size={13} color="#4ade80" />
                  <span>Đã kiểm tra chứng từ</span>
                </span>
              </div>

              <div className="portal-table-wrap">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Thời Gian</th>
                      <th>Số Chứng Từ</th>
                      <th>Nội Dung Giao Dịch</th>
                      <th>Số Tiền</th>
                      <th>Phân Loại Sổ</th>
                      <th>Quy Tắc Thuế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(client.sampleTransactions || [
                      { time: 'Hôm nay 09:30', no: 'VQR-994201', desc: 'Khách thanh toán quét mã VietQR quầy', amount: 350000, book: client.taxRegime === 'group1' ? 'S1a-HKD' : client.taxRegime === 'group2' ? 'S2a-HKD' : 'S2b-HKD', rule: 'RULE-REV-01', isTax: true },
                      { time: 'Hôm nay 08:15', no: 'VQR-994182', desc: 'Khách chuyển khoản đồ uống bàn 4', amount: 120000, book: client.taxRegime === 'group1' ? 'S1a-HKD' : client.taxRegime === 'group2' ? 'S2a-HKD' : 'S2b-HKD', rule: 'RULE-REV-01', isTax: true },
                      { time: 'Hôm qua 16:40', no: 'VQR-993940', desc: 'Chuyen khoan noi bo nop tien quy', amount: 15000000, book: 'Dòng tiền loại trừ', rule: 'RULE-EX-01 (Miễn thuế Điều 4)', isTax: false },
                      { time: 'Hôm qua 14:10', no: 'VQR-993811', desc: 'Thanh toán đơn hàng ship mang về', amount: 480000, book: client.taxRegime === 'group1' ? 'S1a-HKD' : client.taxRegime === 'group2' ? 'S2a-HKD' : 'S2b-HKD', rule: 'RULE-REV-01', isTax: true }
                    ]).map((tx, idx) => (
                      <tr key={idx}>
                        <td>{tx.time}</td>
                        <td><code>{tx.no}</code></td>
                        <td>{tx.desc}</td>
                        <td style={{ fontWeight: 600, color: tx.isTax ? '#FFA100' : '#888' }}>
                          {fmt(tx.amount)}
                        </td>
                        <td>
                          <span className={`portal-book-pill ${tx.isTax ? 'pill-taxable' : 'pill-excluded'}`}>
                            {tx.book}
                          </span>
                        </td>
                        <td>
                          <span className="portal-rule-tag">{tx.rule}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact Accountant Action Banner */}
            <div className="portal-contact-cta glass-panel">
              <div>
                <h4>Có câu hỏi về số liệu hoặc cần gửi bổ sung hóa đơn?</h4>
                <p>Kế toán phụ trách hồ sơ của bạn: <strong>Nguyễn Thị Mai Anh (Đại lý thuế An Bình)</strong></p>
              </div>
              <button 
                type="button" 
                className="nano-button"
                onClick={() => setShowContactModal(true)}
              >
                Gửi Tin Nhắn / Hóa Đơn Cho Kế Toán
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKS */}
        {activeTab === 'books' && (
          <div className="portal-tab-content">
            <div className="portal-books-grid">
              {client.taxRegime === 'group1' && (
                <div className="portal-book-card glass-panel">
                  <div className="book-card-header">
                    <FileTextIcon size={20} color="#FFA100" />
                    <div>
                      <h4>Sổ Doanh Thu Bán Hàng Hóa, Dịch Vụ (Mẫu S1a-HKD)</h4>
                      <span>Chuẩn Thông tư 152/2025/TT-BTC • Dành cho HKD dưới ngưỡng chịu thuế</span>
                    </div>
                  </div>
                  <p className="book-desc">
                    Tập hợp toàn bộ doanh thu bán lẻ từ quầy, máy POS và mã VietQR. Đã đối soát 100% không trùng lặp dòng tiền.
                  </p>
                  <div className="book-card-footer">
                    <span className="book-ready-tag">Sẵn sàng xuất XML CQT</span>
                    <button type="button" className="book-download-btn">
                      <DownloadIcon size={14} color="currentColor" />
                      <span>Tải Bản Ký Số</span>
                    </button>
                  </div>
                </div>
              )}

              {client.taxRegime === 'group2' && (
                <div className="portal-book-card glass-panel">
                  <div className="book-card-header">
                    <FileTextIcon size={20} color="#FFA100" />
                    <div>
                      <h4>Sổ Chi Tiết Doanh Thu Theo Nhóm Ngành Nghề (Mẫu S2a-HKD)</h4>
                      <span>Chuẩn Thông tư 152/2025/TT-BTC • Kê khai thuế tỷ lệ % trên doanh thu</span>
                    </div>
                  </div>
                  <p className="book-desc">
                    Tự động phân bổ doanh thu theo đúng tỷ lệ tính thuế GTGT và thuế TNCN theo nhóm ngành nghề đã đăng ký.
                  </p>
                  <div className="book-card-footer">
                    <span className="book-ready-tag">Sẵn sàng nộp quý</span>
                    <button type="button" className="book-download-btn">
                      <DownloadIcon size={14} color="currentColor" />
                      <span>Tải Bản Ký Số</span>
                    </button>
                  </div>
                </div>
              )}

              {client.taxRegime === 'group3' && (
                <>
                  <div className="portal-book-card glass-panel">
                    <div className="book-card-header">
                      <FileTextIcon size={20} color="#FFA100" />
                      <div>
                        <h4>Sổ Doanh Thu Bán Hàng Hóa, Dịch Vụ (Mẫu S2b-HKD)</h4>
                        <span>Sổ số 1 trong Bộ 4 Sổ bắt buộc Thông tư 152/2025</span>
                      </div>
                    </div>
                    <p className="book-desc">Chi tiết doanh thu bán lẻ làm căn cứ tính thuế TNCN theo thu nhập.</p>
                    <div className="book-card-footer">
                      <span className="book-ready-tag">Khớp sao kê</span>
                      <button type="button" className="book-download-btn">
                        <DownloadIcon size={14} color="currentColor" />
                        <span>Tải Excel</span>
                      </button>
                    </div>
                  </div>

                  <div className="portal-book-card glass-panel">
                    <div className="book-card-header">
                      <FileTextIcon size={20} color="#38bdf8" />
                      <div>
                        <h4>Sổ Chi Tiết Doanh Thu Và Chi Phí (Mẫu S2c-HKD)</h4>
                        <span>Sổ số 2 trong Bộ 4 Sổ bắt buộc Thông tư 152/2025</span>
                      </div>
                    </div>
                    <p className="book-desc">Bóc tách chi phí hợp lý có hóa đơn đầu vào để khấu trừ thuế TNCN chính xác.</p>
                    <div className="book-card-footer">
                      <span className="book-ready-tag">Đã kiểm tra chứng từ</span>
                      <button type="button" className="book-download-btn">
                        <DownloadIcon size={14} color="currentColor" />
                        <span>Tải Excel</span>
                      </button>
                    </div>
                  </div>

                  <div className="portal-book-card glass-panel">
                    <div className="book-card-header">
                      <FileTextIcon size={20} color="#4ade80" />
                      <div>
                        <h4>Sổ Theo Dõi Vật Liệu, Dụng Cụ, Hàng Hóa (Mẫu S2d-HKD)</h4>
                        <span>Sổ số 3 trong Bộ 4 Sổ bắt buộc Thông tư 152/2025</span>
                      </div>
                    </div>
                    <p className="book-desc">Khớp nối tự động với hóa đơn điện tử đầu vào NĐ 70 &amp; NĐ 123.</p>
                    <div className="book-card-footer">
                      <span className="book-ready-tag">Khớp nhập - xuất</span>
                      <button type="button" className="book-download-btn">
                        <DownloadIcon size={14} color="currentColor" />
                        <span>Tải Excel</span>
                      </button>
                    </div>
                  </div>

                  <div className="portal-book-card glass-panel">
                    <div className="book-card-header">
                      <FileTextIcon size={20} color="#a855f7" />
                      <div>
                        <h4>Sổ Theo Dõi Tiền Mặt &amp; Tiền Gửi Ngân Hàng (Mẫu S2e-HKD)</h4>
                        <span>Sổ số 4 trong Bộ 4 Sổ bắt buộc Thông tư 152/2025</span>
                      </div>
                    </div>
                    <p className="book-desc">Theo dõi biến động tiền mặt tại quầy và tiền gửi ngân hàng theo từng ngày.</p>
                    <div className="book-card-footer">
                      <span className="book-ready-tag">Khớp 100% ngân hàng</span>
                      <button type="button" className="book-download-btn">
                        <DownloadIcon size={14} color="currentColor" />
                        <span>Tải Excel</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="portal-tab-content">
            <div className="portal-invoice-status-banner glass-panel">
              <ShieldIcon size={22} color="#00f5d4" />
              <div>
                <h4>Trạng Thái Đối Soát Hóa Đơn Điện Tử Cổng Thuế</h4>
                <p>
                  Dữ liệu hóa đơn đầu vào và đầu ra đã được kế toán đối soát chéo với Cổng thông tin Tổng cục Thuế theo chuẩn Nghị định 70/2025/NĐ-CP và Nghị định 123/2020/NĐ-CP.
                </p>
              </div>
            </div>

            <div className="portal-invoice-metrics">
              <div className="portal-inv-item">
                <span className="inv-num">100%</span>
                <span className="inv-label">Hóa Đơn Đầu Vào Hợp Lệ</span>
              </div>
              <div className="portal-inv-item">
                <span className="inv-num">0</span>
                <span className="inv-label">Hóa Đơn Nhà Cung Cấp Rủi Ro</span>
              </div>
              <div className="portal-inv-item">
                <span className="inv-num">Khớp</span>
                <span className="inv-label">Đối Soát Doanh Thu Máy Tính Tiền</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Accountant Modal */}
        {showContactModal && (
          <div className="portal-submodal-overlay">
            <div className="portal-submodal glass-panel">
              <div className="submodal-header">
                <h3>Gửi Tin Nhắn / Hóa Đơn Tới Kế Toán</h3>
                <button type="button" onClick={() => setShowContactModal(false)}>
                  <CloseIcon size={14} color="currentColor" />
                </button>
              </div>

              {inquirySent ? (
                <div className="submodal-success">
                  <CheckCircleIcon size={36} color="#4ade80" />
                  <h4>Đã gửi thành công!</h4>
                  <p>Kế toán viên phụ trách đã nhận được thông tin và sẽ phản hồi trong 15 phút.</p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="submodal-form">
                  <label>Nội dung nhắn gửi hoặc thông báo chứng từ:</label>
                  <textarea 
                    rows={4}
                    placeholder="Ví dụ: Đã gửi kèm 2 hóa đơn mua nguyên liệu cà phê ngày 05/09, nhờ kế toán kiểm tra..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    required
                  />
                  <div className="submodal-file-attach">
                    <span className="file-attach-label">Đính kèm ảnh chụp hóa đơn / chứng từ (nếu có):</span>
                    <input type="file" />
                  </div>
                  <div className="submodal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowContactModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="nano-button">
                      Gửi Cho Kế Toán
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
