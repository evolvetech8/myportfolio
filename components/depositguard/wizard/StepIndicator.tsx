'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  onSelectStep?: (step: 1 | 2 | 3) => void;
  isStepComplete: (step: 1 | 2 | 3) => boolean;
}

const STEPS = [
  { step: 1 as const, code: '01', title: 'Căn nhà', desc: 'Giá trị & Vốn tự có' },
  { step: 2 as const, code: '02', title: 'Thu chi gia đình', desc: 'Thu nhập & Quỹ đệm' },
  { step: 3 as const, code: '03', title: 'Khoản vay', desc: 'Lãi suất & Thời hạn' },
];

export default function StepIndicator({
  currentStep,
  onSelectStep,
  isStepComplete,
}: StepIndicatorProps) {
  const progressPercent = Math.round((currentStep / 3) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Unified Animated Progress Ledger Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
              0{currentStep} / 03
            </span>
            <span className="font-semibold text-slate-900">
              Bước {currentStep}/3: {STEPS[currentStep - 1].title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium hidden sm:inline">
              {STEPS[currentStep - 1].desc}
            </span>
            <span className="font-mono tabular-nums text-xs font-bold text-blue-800">
              {progressPercent}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/70 p-0.5">
          <div
            className="bg-gradient-to-r from-[#0B1D30] via-blue-800 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / Tablet Editorial Ledger Step Breadcrumb */}
      <div className="hidden sm:grid grid-cols-3 gap-3">
        {STEPS.map(({ step, code, title, desc }) => {
          const isCurrent = currentStep === step;
          const isDone = isStepComplete(step) && currentStep > step;
          const canClick = isStepComplete((step - 1) as 1 | 2) || step <= currentStep;

          return (
            <button
              key={step}
              type="button"
              disabled={!canClick || !onSelectStep}
              onClick={() => onSelectStep && canClick && onSelectStep(step)}
              className={`group relative overflow-hidden text-left p-3.5 rounded-2xl border transition-all duration-300 text-sm flex items-center gap-3 ${
                isCurrent
                  ? 'bg-[#0B1D30] text-white border-[#0B1D30] shadow-md ring-2 ring-blue-700/20'
                  : isDone
                  ? 'bg-white border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-65'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-mono tabular-nums font-bold text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : isCurrent
                    ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-400/30'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : code}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`font-bold truncate text-xs tracking-tight transition-colors duration-300 ${
                    isCurrent ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`text-[11px] truncate transition-colors duration-300 ${
                    isCurrent ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {desc}
                </p>
              </div>
              {/* Bottom Step Progress Hairline */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200/40">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    isCurrent
                      ? 'w-full bg-blue-400'
                      : isDone
                      ? 'w-full bg-blue-700'
                      : 'w-0 bg-transparent'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
