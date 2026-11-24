'use client';

import React, { useState, useEffect } from 'react';
import { formatNumberWithDots, formatCompactVND, parseVND } from '@/lib/depositguard/formatters';

export interface PresetOption {
  label: string;
  value: number;
}

export interface FormattedCurrencyInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: PresetOption[];
  error?: string;
  warning?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormattedCurrencyInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 20_000_000_000,
  step = 10_000_000,
  presets,
  error,
  warning,
  helperText,
  disabled = false,
  className = '',
}: FormattedCurrencyInputProps) {
  const [displayStr, setDisplayStr] = useState<string>(formatNumberWithDots(value));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync internal display when external value changes while not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayStr(formatNumberWithDots(value));
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseVND(raw);
    setDisplayStr(raw === '' ? '' : formatNumberWithDots(parsed));
    onChange(parsed);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setDisplayStr(formatNumberWithDots(num));
    onChange(num);
  };

  const clampedValue = Math.min(Math.max(value, min), max);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Compact Vietnamese Badge */}
      <div className="flex justify-between items-baseline gap-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-slate-800">
          {label}
        </label>
        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 shadow-2xs">
          {formatCompactVND(value).replace(' tr ₫',' triệu đồng').replace(' ₫',' đồng').replace(/(\d)\.(\d{1,2}) (?=tỷ|triệu)/,'$1,$2 ')}
        </span>
      </div>

      {helperText && <p className="text-[11px] text-slate-500 leading-tight">{helperText}</p>}

      {/* Formatted Text Input */}
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          value={displayStr}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setDisplayStr(formatNumberWithDots(value));
          }}
          onChange={handleInputChange}
          className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border font-semibold text-slate-900 bg-white text-base transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-600 bg-rose-50/20'
              : warning
              ? 'border-amber-400 focus:ring-amber-500/20 focus:border-amber-600 bg-amber-50/20'
              : 'border-slate-300 hover:border-slate-400 focus:ring-blue-600/20 focus:border-blue-700'
          }`}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none select-none">
          ₫
        </span>
      </div>

      {/* Range Slider */}
      <div className="pt-1.5 px-0.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          disabled={disabled}
          onChange={handleSliderChange}
          aria-label={label}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-medium">
          <span>{formatCompactVND(min)}</span>
          <span>{formatCompactVND(max)}</span>
        </div>
      </div>

      {/* Quick Preset Pills */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((p) => {
            const isSelected = value === p.value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setDisplayStr(formatNumberWithDots(p.value));
                  onChange(p.value);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline Feedback */}
      {error && <p className="text-xs text-rose-600 font-medium pt-0.5">✕ {error}</p>}
      {warning && !error && (
        <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-lg p-2 font-medium">
          ⚠️ {warning}
        </p>
      )}
    </div>
  );
}
