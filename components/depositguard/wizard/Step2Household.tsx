'use client';

import React from 'react';
import { Wallet, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import FormattedCurrencyInput from '../common/FormattedCurrencyInput';
import { formatCompactVND, formatVND } from '@/lib/depositguard/formatters';

export default function Step2Household() {
  const {
    loan,
    household,
    updateHousehold,
    step2Validation,
    discretionarySurplusBeforeLoan,
    remainingCashAfterClosing,
  } = useSimulation();

  const handleIncomeChange = (income: number) => {
    updateHousehold({ monthlyNetIncome: income });
  };

  const handleExpensesChange = (exp: number) => {
    updateHousehold({ essentialLivingExpenses: exp });
  };

  const handleDebtChange = (debt: number) => {
    updateHousehold({ existingDebtPayments: debt });
  };

  const handleSavingsChange = (savings: number) => {
    updateHousehold({ liquidSavings: savings });
  };

  const handleReserveFloorChange = (floor: number) => {
    updateHousehold({ plannedEmergencyReserveFloor: floor });
  };

  const incomePresets = [
    { label: '30 tr', value: 30_000_000 },
    { label: '45 tr', value: 45_000_000 },
    { label: '55 tr', value: 55_000_000 },
    { label: '70 tr', value: 70_000_000 },
    { label: '100 tr', value: 100_000_000 },
  ];

  const expensePresets = [
    { label: '15 tr', value: 15_000_000 },
    { label: '25 tr', value: 25_000_000 },
    { label: '30 tr', value: 30_000_000 },
    { label: '40 tr', value: 40_000_000 },
  ];

  const savingsPresets = [
    { label: '500 tr', value: 500_000_000 },
    { label: '700 tr', value: 700_000_000 },
    { label: '1,0 tỷ', value: 1_000_000_000 },
    { label: '1,5 tỷ', value: 1_500_000_000 },
  ];

  const reserveFloorPresets = [
    {
      label: '3 tháng chi phí',
      value: Math.round(household.essentialLivingExpenses * 3),
    },
    {
      label: '6 tháng chi phí (Khuyên dùng)',
      value: Math.round(household.essentialLivingExpenses * 6),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-1">
          <Wallet className="w-4 h-4" /> Bước 2 · Thu chi gia đình
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Thu nhập, chi tiêu và quỹ dự phòng gia đình
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Đánh giá năng lực trả nợ thực tế dựa trên dòng tiền ròng sau khi trừ sinh hoạt thiết yếu.
        </p>
      </div>

      {/* Warning if Savings < Down Payment */}
      {household.liquidSavings < loan.downPayment && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-amber-900">
              Tiền tiết kiệm hiện có thấp hơn tiền đặt cọc dự kiến
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Bạn dự kiến trả vốn tự có {formatCompactVND(loan.downPayment)} nhưng tiền tiết kiệm hiện có chỉ là {formatCompactVND(household.liquidSavings)}. Phần thiếu hụt {formatCompactVND(loan.downPayment - household.liquidSavings)} cần được tài trợ từ nguồn hỗ trợ của gia đình hoặc bán tài sản khác.
            </p>
          </div>
        </div>
      )}

      {/* Monthly Net Income */}
      <FormattedCurrencyInput
        id="monthlyNetIncome"
        label="Mỗi tháng, cả nhà thực nhận bao nhiêu tiền?"
        value={household.monthlyNetIncome}
        onChange={handleIncomeChange}
        min={5_000_000}
        max={300_000_000}
        step={5_000_000}
        presets={incomePresets}
        error={step2Validation.errors.monthlyNetIncome}
        warning={step2Validation.warnings.monthlyNetIncome}
        helperText="Tổng lương thực nhận (sau thuế, BHXH) và các nguồn thu nhập ổn định khác của các thành viên cùng trả nợ."
      />

      {/* Essential Living Expenses */}
      <FormattedCurrencyInput
        id="essentialLivingExpenses"
        label="Chi phí sinh hoạt thiết yếu hàng tháng"
        value={household.essentialLivingExpenses}
        onChange={handleExpensesChange}
        min={3_000_000}
        max={150_000_000}
        step={2_000_000}
        presets={expensePresets}
        error={step2Validation.errors.essentialLivingExpenses}
        helperText="Ăn uống, thuê nhà tạm thời, học phí cho con cái, điện nước, y tế tối thiểu (không thể cắt giảm)."
      />

      {/* Existing Debt Payments */}
      <FormattedCurrencyInput
        id="existingDebtPayments"
        label="Khoản trả nợ khác hàng tháng (nếu có)"
        value={household.existingDebtPayments || 0}
        onChange={handleDebtChange}
        min={0}
        max={100_000_000}
        step={1_000_000}
        error={step2Validation.errors.existingDebtPayments}
        helperText="Nợ mua xe máy/ô tô, vay tiêu dùng tín chấp, dư nợ thẻ tín dụng đang trả góp."
      />

      {/* Liquid Savings */}
      <FormattedCurrencyInput
        id="liquidSavings"
        label="Nhà mình hiện có tổng cộng bao nhiêu tiền mặt và tiết kiệm?"
        value={household.liquidSavings}
        onChange={handleSavingsChange}
        min={0}
        max={10_000_000_000}
        step={20_000_000}
        presets={savingsPresets}
        error={step2Validation.errors.liquidSavings}
        warning={step2Validation.warnings.liquidSavings}
        helperText="Toàn bộ tiền có thể chuyển đổi thành tiền mặt ngay để đặt cọc và làm quỹ đệm dự phòng khẩn cấp."
      />

      {/* Planned Emergency Reserve Floor */}
      <FormattedCurrencyInput
        id="plannedEmergencyReserveFloor"
        label="Mục tiêu Quỹ dự phòng khẩn cấp tối thiểu"
        value={household.plannedEmergencyReserveFloor || 0}
        onChange={handleReserveFloorChange}
        min={0}
        max={500_000_000}
        step={10_000_000}
        presets={reserveFloorPresets}
        error={step2Validation.errors.plannedEmergencyReserveFloor}
        helperText="Số tiền không được đụng vào để phòng ngừa mất việc, ốm đau (khuyến nghị 3-6 tháng chi phí)."
      />

      {/* Discretionary Cash Flow Summary Card */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Thặng dư khả dụng hàng tháng (Trước khi vay mua nhà)
          </span>
          <span
            className={`text-lg sm:text-xl font-extrabold ${
              discretionarySurplusBeforeLoan > 0 ? 'text-blue-800' : 'text-rose-600'
            }`}
          >
            {formatVND(discretionarySurplusBeforeLoan)} / tháng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-slate-500 block mb-1">Tiền mặt còn lại sau khi thanh toán cọc:</span>
            <span
              className={`font-bold text-sm ${
                remainingCashAfterClosing >= (household.plannedEmergencyReserveFloor || 0)
                  ? 'text-blue-800'
                  : 'text-amber-700'
              }`}
            >
              {formatCompactVND(remainingCashAfterClosing)}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-slate-500 block mb-1">Mục tiêu bảo vệ quỹ đệm tối thiểu:</span>
            <span className="font-bold text-sm text-slate-800">
              {formatCompactVND(household.plannedEmergencyReserveFloor || 0)}
            </span>
          </div>
        </div>

        {remainingCashAfterClosing < (household.plannedEmergencyReserveFloor || 0) && (
          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 font-medium">
            ⚠️ Tiền mặt còn lại sau khi trả vốn tự có ({formatCompactVND(remainingCashAfterClosing)}) thấp hơn mục tiêu quỹ dự phòng ({formatCompactVND(household.plannedEmergencyReserveFloor || 0)}). Bạn sẽ thiếu tấm đệm an toàn ngay khi dọn về nhà mới.
          </p>
        )}
      </div>
    </div>
  );
}
