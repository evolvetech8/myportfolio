'use client';

import React from 'react';
import { Sliders, Zap, RotateCcw, Activity } from 'lucide-react';
import { useSimulation, ScenarioPresetKey } from '@/lib/depositguard/context';
import { trackEvent } from '@/lib/depositguard/telemetry';

export default function WhatIfControls() {
  const {
    stress,
    activePreset,
    applyPreset,
    updateStress,
    resetStressScenario,
    loan,
  } = useSimulation();

  const handleRateShock = (shockPp: number) => {
    updateStress({ rateShockPp: shockPp });
    trackEvent('whatif_rate_shock_toggled', { shock_pp: shockPp });
  };

  const handleIncomeShock = (shockPercent: number, durationMonths: number) => {
    updateStress({
      incomeShockPercent: shockPercent,
      incomeShockDurationMonths: durationMonths,
      incomeShockStartMonth: loan.promoPeriodMonths + 1,
    });
    trackEvent('whatif_income_shock_toggled', {
      shock_percent: shockPercent,
      duration_months: durationMonths,
    });
  };

  const handleExpenseShock = (shockPercent: number) => {
    updateStress({ expenseShockPercent: shockPercent });
  };

  const presets: { id: ScenarioPresetKey; label: string; desc: string }[] = [
    { id: 'BASE', label: 'Cơ sở', desc: 'Lãi suất thả nổi dự kiến ban đầu' },
    { id: 'RATE_SHOCK_2PP', label: 'Nếu lãi suất tăng thêm 2 điểm phần trăm', desc: `Từ ${loan.postPromoRate}% lên ${loan.postPromoRate + 2}%/năm sau ưu đãi` },
    { id: 'RATE_SHOCK_4PP', label: '+4% Lãi suất', desc: 'Kỳ chu kỳ thắt chặt tiền tệ mạnh' },
    { id: 'INCOME_SHOCK_3M', label: 'Nếu thu nhập giảm 20% trong 3 tháng', desc: 'Mất việc hoặc giảm lương tạm thời' },
    { id: 'INCOME_SHOCK_6M', label: '-20% Thu nhập (6T)', desc: 'Gián đoạn kinh doanh kéo dài' },
    { id: 'EXTREME_STRESS', label: 'Căng thẳng kép', desc: '+2% lãi + giảm thu nhập + tăng chi phí' },
  ];

  // Visual Stress Severity Intensity Meter (0..100%)
  const rateSeverity = Math.min(40, (stress.rateShockPp / 4) * 40);
  const incomeSeverity =
    stress.incomeShockPercent < 0
      ? Math.min(35, (stress.incomeShockDurationMonths / 6) * 35)
      : 0;
  const expenseSeverity = stress.expenseShockPercent > 0 ? 25 : 0;
  const totalSeverityPercent = Math.min(100, Math.round(rateSeverity + incomeSeverity + expenseSeverity));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-0.5">
            <Sliders className="w-4 h-4" /> Bảng Điều Khiển Căng Thẳng (What-If Controls)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kiểm tra sức bền dòng tiền trước các cú sốc bất ngờ
          </h2>
        </div>

        <button
          type="button"
          onClick={resetStressScenario}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Về số ban đầu
        </button>
      </div>

      {/* Institutional Deep Navy Live Stress Severity Bar */}
      <div className="bg-[#0B1D30] text-white rounded-2xl px-4 py-3.5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-300 block">
              CƯỜNG ĐỘ STRESS-TEST ĐANG ÁP DỤNG
            </span>
            <span className="text-slate-200 font-medium">
              {totalSeverityPercent === 0
                ? 'Kịch bản cơ sở (Chưa kích hoạt cú sốc vĩ mô)'
                : 'Đang mô phỏng biến động bất lợi lên dòng tiền 240 tháng'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:w-64">
          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                totalSeverityPercent === 0
                  ? 'bg-blue-500'
                  : totalSeverityPercent <= 45
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(6, totalSeverityPercent)}%` }}
            />
          </div>
          <span className="font-mono tabular-nums text-xs font-bold text-slate-200 w-10 text-right">
            {totalSeverityPercent}%
          </span>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-700 block">
          Chọn nhanh kịch bản thị trường mô phỏng:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#0B1D30] bg-[#0B1D30] text-white ring-2 ring-blue-700/25 shadow-sm font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono tabular-nums">{p.label}</span>
                  {isSelected && <Zap className="w-3 h-3 text-blue-400 shrink-0" />}
                </div>
                <p
                  className={`text-[10px] font-normal leading-tight line-clamp-2 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Stress Levers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Lever 1: Interest Rate Shock */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-3 transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc lãi suất thả nổi</span>
            <span className="font-mono tabular-nums text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full transition-all duration-300">
              +{stress.rateShockPp}% (Tổng: {(loan.postPromoRate + stress.rateShockPp).toFixed(1)}%)
            </span>
          </div>
          {/* Micro-progress bar */}
          <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (stress.rateShockPp / 4) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng chu kỳ ngân hàng nhà nước tăng trần lãi suất huy động khiến lãi suất thả nổi tăng vọt.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 2, 4].map((shock) => (
              <button
                key={shock}
                type="button"
                onClick={() => handleRateShock(shock)}
                className={`py-2 font-mono tabular-nums text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                  stress.rateShockPp === shock
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                +{shock}%
              </button>
            ))}
          </div>
        </div>

        {/* Lever 2: Income Shock */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-3 transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc thu nhập</span>
            <span
              className={`font-mono tabular-nums text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                stress.incomeShockPercent < 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stress.incomeShockPercent === 0
                ? 'Không giảm'
                : `${stress.incomeShockPercent}% (${stress.incomeShockDurationMonths}T)`}
            </span>
          </div>
          {/* Micro-progress bar */}
          <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  stress.incomeShockPercent < 0
                    ? Math.min(100, (stress.incomeShockDurationMonths / 6) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng trường hợp một thành viên mất việc hoặc giảm thưởng kinh doanh ngay khi hết ưu đãi lãi suất.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleIncomeShock(0, 0)}
              className={`py-2 font-mono tabular-nums text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                stress.incomeShockPercent === 0
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              0%
            </button>
            <button
              type="button"
              onClick={() => handleIncomeShock(-20, 3)}
              className={`py-2 font-mono tabular-nums text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                stress.incomeShockPercent === -20 && stress.incomeShockDurationMonths === 3
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              -20% (3T)
            </button>
            <button
              type="button"
              onClick={() => handleIncomeShock(-20, 6)}
              className={`py-2 font-mono tabular-nums text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                stress.incomeShockPercent === -20 && stress.incomeShockDurationMonths === 6
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              -20% (6T)
            </button>
          </div>
        </div>

        {/* Lever 3: Expense Shock */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-3 transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc chi phí sinh hoạt</span>
            <span
              className={`font-mono tabular-nums text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                stress.expenseShockPercent > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              +{stress.expenseShockPercent}%
            </span>
          </div>
          {/* Micro-progress bar */}
          <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stress.expenseShockPercent > 0 ? 100 : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng tác động lạm phát hoặc sinh thêm con nhỏ, chi phí y tế phát sinh ngoài dự kiến.
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleExpenseShock(0)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                stress.expenseShockPercent === 0
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Bình thường (0%)
            </button>
            <button
              type="button"
              onClick={() => handleExpenseShock(10)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                stress.expenseShockPercent === 10
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Lạm phát (+10%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
