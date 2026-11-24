'use client';

import React from 'react';
import { Landmark, ArrowRight, HelpCircle } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import DualNumberInput from '../common/DualNumberInput';
import WizardSummaryPreview from './WizardSummaryPreview';
import { formatMonthsToYears } from '@/lib/depositguard/formatters';

export default function Step3Loan() {
  const { loan, updateLoan, step3Validation } = useSimulation();

  const handleTermChange = (months: number) => {
    updateLoan({ loanTermMonths: months });
  };

  const handleMethodChange = (method: 'EQUAL_PRINCIPAL' | 'ANNUITY') => {
    updateLoan({ repaymentMethod: method });
  };

  const handlePromoRateChange = (rate: number) => {
    updateLoan({ promoInterestRate: rate });
  };

  const handlePromoPeriodChange = (months: number) => {
    updateLoan({ promoPeriodMonths: months });
  };

  const handlePostPromoRateChange = (rate: number) => {
    updateLoan({ postPromoRate: rate, illustrativeRate: false });
  };

  const handleGracePeriodChange = (months: number) => {
    updateLoan({ gracePeriodMonths: months });
  };

  const termPresets = [
    { label: '15 năm', value: 180 },
    { label: '20 năm', value: 240 },
    { label: '25 năm', value: 300 },
    { label: '30 năm', value: 360 },
  ];

  const promoRatePresets = [
    { label: '6,5%', value: 6.5 },
    { label: '7,0%', value: 7.0 },
    { label: '7,5%', value: 7.5 },
    { label: '8,0%', value: 8.0 },
  ];

  const promoPeriodPresets = [
    { label: '12 tháng (1 năm)', value: 12 },
    { label: '24 tháng (2 năm)', value: 24 },
    { label: '36 tháng (3 năm)', value: 36 },
  ];

  const postPromoPresets = [
    { label: '10,5%', value: 10.5 },
    { label: '11,5%', value: 11.5 },
    { label: '12,0%', value: 12.0 },
    { label: '13,0%', value: 13.0 },
  ];

  const gracePresets = [
    { label: 'Không ân hạn', value: 0 },
    { label: '12 tháng', value: 12 },
    { label: '24 tháng', value: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-1">
          <Landmark className="w-4 h-4" /> Bước 3 · Khoản vay
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Lựa chọn phương thức trả nợ & kịch bản lãi suất
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Mô phỏng chính xác sự khác biệt giữa dư nợ giảm dần và niên kim, kèm nguy cơ bật tăng lãi suất sau ưu đãi.
        </p>
      </div>

      {/* Repayment Method Selector */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between">
          <span>Phương thức trả nợ ngân hàng</span>
          <span className="text-slate-400 font-normal text-xs flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Quan trọng nhất
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Equal Principal */}
          <button
            type="button"
            onClick={() => handleMethodChange('EQUAL_PRINCIPAL')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              loan.repaymentMethod === 'EQUAL_PRINCIPAL'
                ? 'border-blue-700 bg-blue-50/60 ring-2 ring-blue-700/30 shadow-2xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-slate-900">Dư nợ giảm dần</span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full">
                Tiết kiệm lãi nhất
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tiền gốc cố định mỗi tháng, tiền lãi tính trên dư nợ thực tế giảm dần. Số tiền trả tháng đầu cao nhất và giảm dần về sau.
            </p>
          </button>

          {/* Annuity */}
          <button
            type="button"
            onClick={() => handleMethodChange('ANNUITY')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              loan.repaymentMethod === 'ANNUITY'
                ? 'border-blue-700 bg-blue-50/60 ring-2 ring-blue-700/30 shadow-2xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-slate-900">Trả góp đều (Niên kim)</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Ổn định dòng tiền
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tổng tiền trả (gốc + lãi) cố định hàng tháng trong suốt thời hạn ưu đãi. Dễ lập kế hoạch chi tiêu nhưng tổng lãi cao hơn.
            </p>
          </button>
        </div>
      </div>

      {/* Loan Term */}
      <DualNumberInput
        id="loanTermMonths"
        label="Thời hạn gói vay"
        value={loan.loanTermMonths}
        onChange={handleTermChange}
        unit="tháng"
        min={12}
        max={420}
        step={12}
        presets={termPresets}
        formatDisplay={(val) => `${val} tháng (${formatMonthsToYears(val)})`}
        error={step3Validation.errors.loanTermMonths}
        helperText="Các ngân hàng Việt Nam thường cho vay từ 15 đến 30 năm (180 - 360 tháng)."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Promotional Interest Rate */}
        <DualNumberInput
          id="promoInterestRate"
          label="Lãi suất ưu đãi ban đầu"
          value={loan.promoInterestRate}
          onChange={handlePromoRateChange}
          unit="%/năm"
          min={0}
          max={20}
          step={0.1}
          presets={promoRatePresets}
          error={step3Validation.errors.promoInterestRate}
          helperText="Lãi suất cố định trong gói khuyến mãi ngân hàng."
        />

        {/* Promo Period Months */}
        <DualNumberInput
          id="promoPeriodMonths"
          label="Thời gian áp dụng lãi suất ưu đãi"
          value={loan.promoPeriodMonths}
          onChange={handlePromoPeriodChange}
          unit="tháng"
          min={0}
          max={loan.loanTermMonths}
          step={6}
          presets={promoPeriodPresets}
          error={step3Validation.errors.promoPeriodMonths}
          helperText="Thường là 12 tháng (1 năm) hoặc 24 tháng (2 năm)."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Post-promo Floating Rate */}
        <DualNumberInput
          id="postPromoRate"
          label="Lãi suất thả nổi sau ưu đãi dự kiến"
          value={loan.postPromoRate}
          onChange={handlePostPromoRateChange}
          unit="%/năm"
          min={0}
          max={25}
          step={0.25}
          presets={postPromoPresets}
          error={step3Validation.errors.postPromoRate}
          warning={step3Validation.warnings.postPromoRate}
          helperText="Dùng mức ngân hàng đã cung cấp hoặc chọn số minh họa bên dưới."
        />

        <div className="self-center space-y-2"><button type="button" className="rounded-xl border px-4 py-3 text-blue-800" onClick={() => updateLoan({postPromoRate: 12, illustrativeRate: true})}>Tôi chưa biết · dùng mức minh họa 12%/năm</button>
          {loan.illustrativeRate && <p role="status">Đang dùng giả định 12%/năm. Hãy hỏi ngân hàng để thay bằng mức thực tế.</p>}</div>
        {/* Grace Period Months */}
        <DualNumberInput
          id="gracePeriodMonths"
          label="Thời gian ân hạn nợ gốc (nếu có)"
          value={loan.gracePeriodMonths || 0}
          onChange={handleGracePeriodChange}
          unit="tháng"
          min={0}
          max={Math.min(120, loan.loanTermMonths - 1)}
          step={6}
          presets={gracePresets}
          error={step3Validation.errors.gracePeriodMonths}
          helperText="Thời gian chỉ phải trả lãi, chưa phải trả tiền gốc (0 nếu không có)."
        />
      </div>

      {/* Live Mini Preview Box */}
      <WizardSummaryPreview />
    </div>
  );
}
