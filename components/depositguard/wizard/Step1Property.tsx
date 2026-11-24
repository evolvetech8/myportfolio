'use client';

import React from 'react';
import { Home, Percent, Building2 } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import FormattedCurrencyInput from '../common/FormattedCurrencyInput';
import { formatCompactVND } from '@/lib/depositguard/formatters';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Căn hộ có sẵn', desc: 'Đã bàn giao, có sổ hồng' },
  { id: 'future_apartment', label: 'Căn hộ hình thành tương lai', desc: 'Thanh toán theo tiến độ' },
  { id: 'townhouse', label: 'Nhà phố / Nhà riêng', desc: 'Có sổ đỏ/sổ hồng riêng' },
  { id: 'land', label: 'Đất nền', desc: 'Đã có giấy chứng nhận' },
];

export default function Step1Property() {
  const {
    loan,
    updateLoan,
    step1Validation,
    equityRatioPercent,
    loanToValuePercent,
  } = useSimulation();

  const handlePriceChange = (price: number) => {
    updateLoan({ propertyPrice: price, purchasePrice: price });
  };

  const handleDownPaymentChange = (down: number) => {
    updateLoan({ downPayment: down });
  };

  const handleLoanAmountChange = (amt: number) => {
    updateLoan({ loanAmount: amt });
  };

  const pricePresets = [
    { label: '1,5 tỷ', value: 1_500_000_000 },
    { label: '2,0 tỷ', value: 2_000_000_000 },
    { label: '2,5 tỷ', value: 2_500_000_000 },
    { label: '3,5 tỷ', value: 3_500_000_000 },
    { label: '5,0 tỷ', value: 5_000_000_000 },
  ];

  const priceValue = loan.propertyPrice ?? loan.purchasePrice ?? 0;

  const downPaymentPresets = [
    {
      label: '20% (Tối thiểu)',
      value: Math.round(priceValue * 0.2),
    },
    {
      label: '30% (Khuyến nghị)',
      value: Math.round(priceValue * 0.3),
    },
    {
      label: '50% (An toàn)',
      value: Math.round(priceValue * 0.5),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-1">
          <Home className="w-4 h-4" /> Bước 1 · Căn nhà
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Thông tin ngôi nhà bạn dự định mua
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ước tính giá mua và nguồn vốn tự có để xác định số tiền cần vay ngân hàng.
        </p>
      </div>

      {/* Property Type Selection */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-blue-700" /> Loại hình bất động sản
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROPERTY_TYPES.map((t) => {
            const isSelected = loan.propertyType === t.id || (!loan.propertyType && t.id === 'apartment');
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateLoan({ propertyType: t.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50/60 ring-1 ring-blue-700/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-xs font-bold text-slate-800 leading-snug">{t.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purchase Price Input */}
      <FormattedCurrencyInput
        id="purchasePrice"
        label="Căn nhà dự kiến giá bao nhiêu?"
        value={priceValue}
        onChange={handlePriceChange}
        min={300_000_000}
        max={15_000_000_000}
        step={50_000_000}
        presets={pricePresets}
        error={step1Validation.errors.propertyPrice || step1Validation.errors.purchasePrice}
        helperText="Tổng giá trị giao dịch nhà hoặc căn hộ (bao gồm VAT nếu là căn hộ mới)."
      />

      {/* Down Payment Input */}
      <FormattedCurrencyInput
        id="downPayment"
        label="Trong số tiền tiết kiệm, anh/chị định dùng bao nhiêu để trả tiền mua nhà?"
        value={loan.downPayment}
        onChange={handleDownPaymentChange}
        min={0}
        max={priceValue}
        step={20_000_000}
        presets={downPaymentPresets}
        error={step1Validation.errors.downPayment}
        warning={step1Validation.warnings.downPayment}
        helperText="Số tiền bạn có sẵn để đặt cọc và trả đợt 1 mà không phải đi vay mượn thêm."
      />

      {/* Auto-Calculated Loan Amount & LTV Indicator Card */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số tiền dự kiến vay ngân hàng
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCompactVND(loan.loanAmount)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Tỷ lệ vay (LTV)</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {loanToValuePercent.toFixed(1)}%
              </span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Tỷ lệ vốn tự có</span>
              <span className="text-xs sm:text-sm font-bold text-blue-800">
                {equityRatioPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Visual LTV vs Equity Proportion Bar */}
        <div className="w-full bg-blue-700 h-2.5 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, equityRatioPercent))}%` }}
            title={`Vốn tự có: ${equityRatioPercent.toFixed(1)}%`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, loanToValuePercent))}%` }}
            title={`Vay ngân hàng: ${loanToValuePercent.toFixed(1)}%`}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            Vốn tự có ({equityRatioPercent.toFixed(0)}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Vay nợ ({loanToValuePercent.toFixed(0)}%)
          </span>
        </div>

        {loanToValuePercent > 80 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 font-medium">
            ⚠️ Tỷ lệ vay trên 80% thường yêu cầu thêm tài sản thế chấp bổ sung và lãi suất có thể cao hơn.
          </p>
        )}
      </div>
    </div>
  );
}
