import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SparklesIcon, CheckCircleIcon, ShieldIcon } from './Icons';

export default function TaxSavingsCalculator() {
  const { lang } = useLanguage();
  const [dailyOrders, setDailyOrders] = useState(60);
  const [monthlyInvoices, setMonthlyInvoices] = useState(80);

  const isEn = lang === 'en';

  // Dynamic calculations
  // Average manual data entry: 2 mins per order + 5 mins per invoice reconciliation
  const hoursSavedPerMonth = Math.round((dailyOrders * 30 * 2 + monthlyInvoices * 6) / 60);
  // Manual bookkeeping cost estimation vs A-Sổ
  const moneySavedPerMonth = Math.round(hoursSavedPerMonth * 65000 + 1800000);
  const formattedMoney = new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(moneySavedPerMonth);
  const daysSaved = Math.round(hoursSavedPerMonth / 8);

  return (
    <section className="calculator-section" id="calculator">
      <div className="calculator-inner glass-panel">
        <div className="calculator-header">
          <div className="calc-badge">
            <SparklesIcon size={16} color="#FFA100" />
            <span>{isEn ? 'ROI & EFFICIENCY CALCULATOR' : 'CÔNG CỤ TÍNH TOÁN HIỆU QUẢ KINH DOANH'}</span>
          </div>
          <h2 className="calc-title">
            {isEn
              ? 'Calculate Time & Cost Savings With A-Sổ'
              : 'Ước Tính Tiết Kiệm Thời Gian & Chi Phí Cùng A-Sổ'}
          </h2>
          <p className="calc-subtitle">
            {isEn
              ? 'Drag the sliders below to calculate how many hours and bookkeeping expenses A-Sổ frees up for your business every single month.'
              : 'Kéo thanh trượt để tính toán chính xác số giờ làm việc và chi phí kế toán mà A-Sổ giúp giải phóng cho cơ sở kinh doanh của bạn.'}
          </p>
        </div>

        <div className="calculator-grid">
          {/* Left Column: Interactive Sliders */}
          <div className="calc-sliders-col">
            <div className="calc-slider-box">
              <div className="slider-label-row">
                <span className="slider-label">
                  {isEn ? 'Daily retail orders / transactions:' : 'Số lượng giao dịch / đơn bán lẻ mỗi ngày:'}
                </span>
                <span className="slider-value-pill">
                  {dailyOrders} {isEn ? 'orders / day' : 'đơn / ngày'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={dailyOrders}
                onChange={(e) => setDailyOrders(Number(e.target.value))}
                className="calc-range-slider"
                aria-label="Daily orders slider"
              />
              <div className="slider-minmax">
                <span>{isEn ? '10 (Boutique)' : '10 đơn (Quán nhỏ)'}</span>
                <span>250</span>
                <span>{isEn ? '500+ (High Volume)' : '500 đơn (Chuỗi bận rộn)'}</span>
              </div>
            </div>

            <div className="calc-slider-box" style={{ marginTop: '24px' }}>
              <div className="slider-label-row">
                <span className="slider-label">
                  {isEn ? 'Monthly input/output e-invoices:' : 'Số hóa đơn điện tử đầu vào/ra mỗi tháng:'}
                </span>
                <span className="slider-value-pill">
                  {monthlyInvoices} {isEn ? 'invoices / mo' : 'hóa đơn / tháng'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="20"
                value={monthlyInvoices}
                onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                className="calc-range-slider"
                aria-label="Monthly invoices slider"
              />
              <div className="slider-minmax">
                <span>{isEn ? '10 Inv.' : '10 HĐ'}</span>
                <span>500</span>
                <span>{isEn ? '1,000+ (Large scale)' : '1.000 HĐ (Quy mô lớn)'}</span>
              </div>
            </div>

            <div className="calc-comparison-bar">
              <div className="comparison-item comp-manual">
                <span className="comp-title">{isEn ? 'Manual Spreadsheets & Ledgers' : 'Làm Sổ Tay / Nhập Liệu Thủ Công'}</span>
                <span className="comp-val">
                  {isEn ? `~${hoursSavedPerMonth} hours lost + Audit fines risk` : `Mất ~${hoursSavedPerMonth} giờ nhập số + Rủi ro phạt thuế`}
                </span>
              </div>
              <div className="comparison-item comp-aso">
                <span className="comp-title">{isEn ? 'With A-Sổ Automation' : 'Với A-Sổ Tự Động Hóa'}</span>
                <span className="comp-val">
                  {isEn ? '0 hours manual entry • Instant reconciliation' : '0 giờ nhập tay • Tự động đối chiếu tức thì'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Savings Counter Cards */}
          <div className="calc-results-col">
            <div className="calc-result-card glass-panel">
              <span className="result-label">{isEn ? 'Estimated Time Saved Monthly' : 'Thời Gian Tiết Kiệm Mỗi Tháng'}</span>
              <div className="result-main-val">
                <span className="result-num">{hoursSavedPerMonth}</span>
                <span className="result-unit">{isEn ? 'Hours / Month' : 'Giờ / Tháng'}</span>
              </div>
              <p className="result-desc">
                {isEn ? (
                  <>Equivalent to over <strong>{daysSaved} full work days</strong> liberated for customer service and revenue growth.</>
                ) : (
                  <>Tương đương hơn <strong>{daysSaved} ngày làm việc trọn vẹn</strong> dành cho việc chăm sóc khách hàng và tăng doanh thu.</>
                )}
              </p>
            </div>

            <div className="calc-result-card glass-panel highlight-card">
              <span className="result-label">{isEn ? 'Estimated Operational Savings' : 'Chi Phí Tiết Kiệm Mỗi Tháng'}</span>
              <div className="result-main-val">
                <span className="result-num highlight-money">~{formattedMoney}</span>
                <span className="result-unit">{isEn ? 'VND / Mo' : 'đ / Tháng'}</span>
              </div>
              <p className="result-desc">
                {isEn
                  ? 'Significantly cheaper than hiring external accounting services or maintaining cumbersome legacy software.'
                  : 'Tiết kiệm vượt trội so với chi phí thuê ngoài hoặc bảo trì các phần mềm kế toán truyền thống cồng kềnh.'}
              </p>
            </div>

            <div className="calc-metrics-mini-row">
              <div className="mini-metric">
                <span className="mini-val">100%</span>
                <span className="mini-lbl">{isEn ? 'Circular 88 7 Ledgers' : 'Chuẩn hóa 7 Sổ TT88'}</span>
              </div>
              <div className="mini-metric">
                <span className="mini-val">&lt; 1.2s</span>
                <span className="mini-lbl">{isEn ? 'Tax Portal Sync' : 'Tốc độ đối chiếu Thuế'}</span>
              </div>
              <div className="mini-metric">
                <span className="mini-val">0 đ</span>
                <span className="mini-lbl">{isEn ? 'Compliance Risk' : 'Rủi ro sai lệch'}</span>
              </div>
            </div>

            <a href="#pricing" className="nano-button calc-cta-btn">
              {isEn ? 'Start 14-Day Free Trial & Save Now' : 'Bắt Đầu Dùng Thử 14 Ngày & Tiết Kiệm Ngay'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
