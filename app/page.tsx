'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Lock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  FileCheck2,
  Cpu,
} from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';
import RiskBadge from '@/components/depositguard/common/RiskBadge';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';
import HeroLivePreview from '@/components/depositguard/common/HeroLivePreview';
import ScrollytellingTimeline from '@/components/depositguard/common/ScrollytellingTimeline';
import RedFlagsChecklist from '@/components/depositguard/common/RedFlagsChecklist';
import InfographicGallery from '@/components/depositguard/common/InfographicGallery';

export default function DepositGuardHomePage() {
  const router = useRouter();
  const { setHasSimulated, loadGoldenFixture, updateLoan, updateHousehold, resetStressScenario } = useSimulation();

  const handleLoadGoldenExample = () => {
    loadGoldenFixture();
    router.push('/ket-qua');
  };

  const handleLoadPersona = (persona: 'hcm' | 'hanoi' | 'danang') => {
    if (persona === 'hcm') {
      loadGoldenFixture();
    } else if (persona === 'hanoi') {
      updateLoan({
        propertyPrice: 4_200_000_000,
        purchasePrice: 4_200_000_000,
        downPayment: 1_400_000_000,
        loanAmount: 2_800_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7.5,
        promoPeriodMonths: 24,
        postPromoRate: 12.5,
        gracePeriodMonths: 24,
      });
      updateHousehold({
        monthlyNetIncome: 75_000_000,
        essentialLivingExpenses: 40_000_000,
        existingDebtPayments: 0,
        liquidSavings: 1_650_000_000,
        plannedEmergencyReserveFloor: 180_000_000,
      });
      resetStressScenario();
    } else {
      updateLoan({
        propertyPrice: 2_400_000_000,
        purchasePrice: 2_400_000_000,
        downPayment: 1_080_000_000,
        loanAmount: 1_320_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7.0,
        promoPeriodMonths: 12,
        postPromoRate: 11.5,
        gracePeriodMonths: 0,
      });
      updateHousehold({
        monthlyNetIncome: 48_000_000,
        essentialLivingExpenses: 22_000_000,
        existingDebtPayments: 0,
        liquidSavings: 1_350_000_000,
        plannedEmergencyReserveFloor: 132_000_000,
      });
      resetStressScenario();
    }
    setHasSimulated(true);
    router.push('/ket-qua');
  };

  return (
    <div className="pb-20">
      {/* =====================================================================
          00 / MONUMENTAL EDITORIAL HERO & LIVE STRESS-TEST TERMINAL
      ===================================================================== */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Monumental Editorial Manifesto */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-md bg-blue-50 text-slate-900 border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>00 / KIỂM ĐỊNH ẨN DANH 100% • KHÔNG CẦN SĐT HAY EMAIL</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.06]">
                Đừng đặt cọc trước khi biết{' '}
                <span className="text-blue-800">mình có đủ sức trả nợ.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Tại Việt Nam, <strong className="text-slate-900">100 – 300 triệu tiền đặt cọc</strong>{' '}
                có thể mất trắng hoặc đẩy gia đình vào thâm hụt ngay{' '}
                <strong className="text-slate-900">tháng thứ 13 / 25</strong> khi lãi suất ưu đãi
                6–7% khép lại và nhảy vọt lên 11–14%/năm. Hãy kiểm định sức chịu đựng của dòng tiền
                240 tháng trước khi đặt bút ký cọc.
              </p>

              {/* Editorial Callout Note (Left Hairline Border) */}
              <div className="pl-4 border-l-4 border-amber-500 py-1 space-y-1">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Vì sao không thể chỉ dùng bảng tính lãi vay ngân hàng thông thường?
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ngân hàng duyệt vay dựa trên tài sản thế chấp, nhưng{' '}
                  <strong className="text-slate-900">không tính hộ bạn</strong> xem sau khi lãi thả
                  nổi tăng +4–5% và trừ chi phí nuôi con, tài khoản gia đình còn lại bao nhiêu đồng
                  mỗi tháng.
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/kiem-tra-mua-nha"
                  className="px-7 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 min-h-[52px]"
                >
                  <span>Tính thử với số của gia đình tôi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button type="button"
                  onClick={handleLoadGoldenExample}
                  className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base border border-slate-300 transition-all flex items-center justify-center gap-2 min-h-[52px]"
                >
                  <FileCheck2 className="w-4 h-4 text-blue-700" />
                  <span>Xem một ví dụ điền sẵn</span>
                </button>
              </div>

              {/* 4-Column Architectural Hairline Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-b border-slate-200 py-4">
                <div className="pr-4 py-1">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums block">
                    311+
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Kịch bản kiểm định tự động
                  </span>
                </div>
                <div className="sm:px-4 py-1">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-800 tabular-nums block">
                    0 VND
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Sai số số học (BigInt Oracle)
                  </span>
                </div>
                <div className="sm:px-4 py-1">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums block">
                    100%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Chạy cục bộ trên trình duyệt
                  </span>
                </div>
                <div className="sm:pl-4 py-1">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-800 tabular-nums block">
                    0%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Hoa hồng ngân hàng/môi giới
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Stress-Test Terminal */}
            <div className="lg:col-span-6">
              <HeroLivePreview />
            </div>
          </div>

          <DisclaimerBanner />
        </div>
      </section>

      {/* =====================================================================
          01 / SCROLLYTELLING THEATER: 240-MONTH CASH-FLOW TRAJECTORY
      ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollytellingTimeline />
        </div>
      </section>

      {/* =====================================================================
          02 / INTERACTIVE 5 RED FLAGS EDITORIAL LEDGER
      ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RedFlagsChecklist />
        </div>
      </section>

      {/* =====================================================================
          03 / THREE REAL-WORLD VIETNAMESE FAMILY DOSSIERS (EDITORIAL LEDGER)
      ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Chapter 03 Editorial Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b border-slate-200">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-800 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
                  03 / HỒ SƠ THỰC TẾ TẠI VIỆT NAM
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  TIER-4 PERSONA BENCHMARK SUITE
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                3 Tình Huống Điển Hình Khi Gia Đình Việt Mua Nhà Trả Góp.
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col lg:items-end justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600 lg:text-right leading-relaxed">
                Bấm vào bất kỳ hồ sơ nào dưới đây để nạp ngay toàn bộ thông số vào bộ giải dòng tiền
                240 tháng và bảng điều khiển What-If.
              </p>
              <Link
                href="/bao-cao-mau"
                className="text-xs sm:text-sm font-extrabold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Xem bản Hồ sơ Chẩn đoán Mẫu đầy đủ →</span>
              </Link>
            </div>
          </div>

          {/* Asymmetric 12-Column Architectural Case-Study Ledger Rows */}
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {/* Dossier 01: HCM Young Couple */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-white">
                    Hồ sơ #1 • TP.HCM
                  </span>
                  <RiskBadge status="DEFICIT" size="sm" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  Vợ chồng trẻ mua căn hộ 2,5 – 2,8 tỷ (Vay 2,0 tỷ, ưu đãi 7% năm đầu)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Phát hiện từ DepositGuard:</strong> Năm đầu gia đình dư +5 triệu/tháng
                  nhưng ngay Tháng 13 khi lãi thả nổi lên 12%, dòng tiền âm{' '}
                  <strong className="text-rose-700 font-mono">-2,33 triệu/tháng</strong>. Cần giảm nợ
                  vay về 1,64 tỷ để an toàn.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Khoản vay / Kỳ hạn
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    2,00 tỷ ₫
                  </span>
                  <span className="text-[11px] text-slate-500 block">240 tháng (Gốc đều)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Thu nhập / Chi tiêu
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    55 tr / 30 tr ₫
                  </span>
                  <span className="text-[11px] text-slate-500 block">Thặng dư gốc 25 tr</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Tháng 1 → Tháng 13
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-rose-700 tabular-nums">
                    20,00 tr → 27,33 tr ₫
                  </span>
                  <span className="text-[11px] text-rose-700 font-semibold block">
                    Tăng +7,33 tr/tháng
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col justify-center lg:items-end">
                <button
                  type="button"
                  onClick={() => handleLoadPersona('hcm')}
                  className="w-full lg:w-auto px-5 py-3.5 rounded-xl bg-[#0B1D30] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Nạp Hồ sơ #1 vào Bảng kết quả</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier 02: Hanoi 24m Grace Period Cliff */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-white">
                    Hồ sơ #2 • Hà Nội (Ân hạn gốc 24T)
                  </span>
                  <RiskBadge status="DEFICIT" size="sm" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  Gia đình nâng cấp căn hộ 4,2 tỷ (Vay 2,8 tỷ, ân hạn gốc 24 tháng)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Phát hiện từ DepositGuard:</strong> 24 tháng đầu chỉ trả lãi 17,5 tr/tháng.
                  Nhưng tại <strong>Tháng 25</strong>, nợ gốc bị nén vào 216 tháng cộng lãi thả nổi
                  12,5% đẩy tiền trả lên{' '}
                  <strong className="text-rose-700 font-mono">42,13 tr/tháng</strong>!
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Khoản vay / Ân hạn
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    2,80 tỷ ₫
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold block">
                    Ân hạn gốc 24 tháng
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Thu nhập / Chi tiêu
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    75 tr / 40 tr ₫
                  </span>
                  <span className="text-[11px] text-slate-500 block">Thặng dư gốc 35 tr</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Tháng 1 → Tháng 25
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-rose-700 tabular-nums">
                    17,50 tr → 42,13 tr ₫
                  </span>
                  <span className="text-[11px] text-rose-700 font-semibold block">
                    Tăng +24,63 tr/tháng
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col justify-center lg:items-end">
                <button
                  type="button"
                  onClick={() => handleLoadPersona('hanoi')}
                  className="w-full lg:w-auto px-5 py-3.5 rounded-xl bg-[#0B1D30] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Nạp Hồ sơ #2 vào Bảng kết quả</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier 03: Safe Cushion Profile */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-blue-800 text-white">
                    Hồ sơ #3 • Chuẩn An Toàn (45% Vốn)
                  </span>
                  <RiskBadge status="SAFE" size="sm" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  Mua nhà 2,4 tỷ khi đã tích lũy 45% vốn tự có &amp; quỹ dự phòng 6 tháng
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Phát hiện từ DepositGuard:</strong> Ngay cả khi hết ưu đãi 7% và lên 11,5%
                  ở Tháng 13, nghĩa vụ trả nợ chỉ chiếm 36,5% thu nhập ròng; gia đình vẫn dư{' '}
                  <strong className="text-emerald-700 font-mono">+8,48 triệu/tháng</strong>.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Khoản vay / Kỳ hạn
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    1,32 tỷ ₫
                  </span>
                  <span className="text-[11px] text-slate-500 block">240 tháng (45% vốn)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Thu nhập / Chi tiêu
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    48 tr / 22 tr ₫
                  </span>
                  <span className="text-[11px] text-slate-500 block">Thặng dư gốc 26 tr</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Tháng 1 → Tháng 13
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-blue-800 tabular-nums">
                    13,20 tr → 17,52 tr ₫
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    Dư +8,48 tr/tháng
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col justify-center lg:items-end">
                <button
                  type="button"
                  onClick={() => handleLoadPersona('danang')}
                  className="w-full lg:w-auto px-5 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Nạp Hồ sơ #3 vào Bảng kết quả</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          04 / GOLDEN FIXTURE MATHEMATICAL AUDIT & WHAT CALCULATORS MISS
      ===================================================================== */}
      <section
        id="vi-du-mo-phong"
        className="py-16 sm:py-24 border-b border-slate-200 bg-[#0B1D30] text-white scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-slate-800">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-300 px-2.5 py-1 bg-blue-950 border border-blue-700 rounded-md">
                  04 / BẢNG ĐỐI CHIẾU TOÁN HỌC CHUẨN (GOLDEN FIXTURE MỤC 4.6 PRD)
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                Vì sao tháng đầu trả nợ rất nhẹ, nhưng tháng 13 lại hụt dòng tiền?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Giả định chuẩn: Gia đình mua căn hộ {formatCompactVND(2_500_000_000)}, vốn tự có{' '}
                {formatCompactVND(500_000_000)}, vay ngân hàng{' '}
                <strong className="font-mono text-white">{formatVND(2_000_000_000)}</strong> trong
                240 tháng (20 năm), trả gốc đều hàng tháng.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                type="button"
                onClick={handleLoadGoldenExample}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
              >
                <span>Mở kịch bản mẫu trên bảng kết quả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 12-Column Asymmetric Ledger Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 5 Cols: Transparent Input Assumptions */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-300">
                THÔNG SỐ ĐẦU VÀO MINH BẠCH
              </h3>
              <dl className="divide-y divide-slate-800 text-xs sm:text-sm border-t border-b border-slate-800">
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Giá mua căn hộ / Vốn tự có:</dt>
                  <dd className="font-mono font-bold text-white tabular-nums">
                    2,5 tỷ ₫ / 500 tr ₫
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Số tiền vay (240 tháng):</dt>
                  <dd className="font-mono font-bold text-white tabular-nums">
                    {formatVND(2_000_000_000)}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Lãi ưu đãi 12 tháng đầu:</dt>
                  <dd className="font-mono font-bold text-blue-300 tabular-nums">7,0% / năm</dd>
                </div>
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Lãi dự kiến từ tháng 13:</dt>
                  <dd className="font-mono font-bold text-amber-300 tabular-nums">12,0% / năm</dd>
                </div>
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Thu nhập ròng gia đình:</dt>
                  <dd className="font-mono font-bold text-white tabular-nums">
                    {formatVND(55_000_000)}/tháng
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-2">
                  <dt className="text-slate-400">Chi phí sinh hoạt thiết yếu:</dt>
                  <dd className="font-mono font-bold text-white tabular-nums">
                    {formatVND(30_000_000)}/tháng
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right 7 Cols: Chronological Ledger & Reverse Solver Verdict */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-300">
                DIỄN BIẾN NGHĨA VỤ TRẢ NỢ &amp; NHỮNG GÌ BẢNG TÍNH THƯỜNG BỎ SÓT
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-5 bg-[#060F1A] space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-blue-300 block">
                    Tháng 1 (Đang ưu đãi 7%)
                  </span>
                  <p className="font-mono text-xl font-extrabold text-white tabular-nums">
                    {formatVND(20_000_000)}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Gốc 8,33 tr + Lãi 11,67 tr. Sau chi tiêu thiết yếu (30 tr), gia đình còn dư{' '}
                    <strong className="text-emerald-400">+5,00 tr ₫/tháng</strong>.
                  </p>
                </div>

                <div className="p-5 bg-[#060F1A] space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-amber-300 block">
                    Tháng 13 (Hết ưu đãi → 12%)
                  </span>
                  <p className="font-mono text-xl font-extrabold text-amber-300 tabular-nums">
                    {formatVND(27_333_333)}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tăng vọt <strong>+{formatVND(7_333_333)}/tháng</strong> ngay khi hết ưu đãi. Dòng
                    tiền rơi vào vùng <strong className="text-rose-400">thiếu hụt (-2,33 tr ₫)</strong>.
                  </p>
                </div>

                <div className="p-5 bg-[#060F1A] space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-rose-400 block">
                    Khi lãi +2% hoặc giảm lương
                  </span>
                  <p className="text-xl font-extrabold text-rose-400">Tháng 13 âm nặng</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nếu lãi thả nổi lên 14% hoặc thu nhập giảm 20% trong 6 tháng, quỹ dự phòng bị bào
                    mòn nhanh từ <strong>Tháng 13</strong>.
                  </p>
                </div>
              </div>

              {/* Reverse Solver Action Strip */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-extrabold text-blue-300">
                    Đòn bẩy điều chỉnh từ bộ giải ngược (Reverse Affordability Solver):
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Giảm khoản vay về khoảng <strong className="font-mono text-white">1,64 tỷ ₫</strong>{' '}
                    (tăng vốn tự có hoặc chọn căn nhà giá mềm hơn) giúp dòng tiền tháng 13 không bị âm
                    ở mức lãi 12%/năm.
                  </p>
                </div>
                <Link
                  href="/kiem-tra-mua-nha"
                  className="shrink-0 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                >
                  Thử với số liệu của bạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          05 / INTERACTIVE VISUAL INFOGRAPHIC GALLERY
      ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InfographicGallery />
        </div>
      </section>

      {/* =====================================================================
          06 / 3-STEP VERIFICATION ARCHITECTURE & ARCHONIC TRUST LEDGER
      ===================================================================== */}
      <section className="pt-16 sm:pt-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Asymmetric 12-Col Split: Left 5 Cols Risk Taxonomy, Right 7 Cols 3-Step Ledger & Bank Offer Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 5 Columns: Non-Alarmist Risk Taxonomy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2.5">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-800 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md inline-block">
                  06 / PHÂN LOẠI RỦI RO &amp; CAM KẾT ĐỘC LẬP
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Không hù dọa, không hứa hẹn &ldquo;chắc chắn được duyệt&rdquo;.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  DepositGuard không bao giờ gắn nhãn <em>&ldquo;An toàn tuyệt đối&rdquo;</em> hay{' '}
                  <em>&ldquo;Ngân hàng đã duyệt&rdquo;</em>. Mọi cảnh báo đều truy xuất được tới từng
                  tháng cụ thể trong bảng dòng tiền 240 tháng:
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white px-4">
                <div className="py-4">
                  <RiskBadge status="SAFE" showDescription />
                </div>
                <div className="py-4">
                  <RiskBadge status="VULNERABLE" showDescription />
                </div>
                <div className="py-4">
                  <RiskBadge status="DEFICIT" showDescription />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <Link
                  href="/cach-tinh"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-800 hover:text-blue-900"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Xem chi tiết công thức toán học</span>
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/cau-hoi-thuong-gap"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-800"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Giải thích thuật ngữ vay mua nhà</span>
                </Link>
              </div>
            </div>

            {/* Right 7 Columns: 3-Step Verification Process & Archonic Trust Ledger */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  QUY TRÌNH THẨM ĐỊNH 3 BƯỚC MINH BẠCH
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Kiểm tra toàn diện trước khi đặt cọc trong 3 bước
                </h3>
              </div>

              {/* 1px Hairline Ledger for the 3 Steps */}
              <div className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white">
                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-3 font-mono text-xs font-extrabold uppercase tracking-wider text-blue-800">
                    BƯỚC 01 / TÀI SẢN
                  </div>
                  <div className="sm:col-span-9 space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900">
                      Mô tả căn nhà &amp; vốn tự có
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Nhập giá mua dự kiến, số tiền đặt cọc/vốn tự có, chi phí sang tên, quỹ bảo trì
                      2%, nội thất ban đầu và phí quản lý định kỳ hàng tháng.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-3 font-mono text-xs font-extrabold uppercase tracking-wider text-blue-800">
                    BƯỚC 02 / NGÂN SÁCH
                  </div>
                  <div className="sm:col-span-9 space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900">
                      Ngân sách &amp; quỹ dự phòng gia đình
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Khai báo thu nhập thực nhận (Net), chi phí sinh hoạt thiết yếu, các khoản trả
                      góp hiện hữu và ngưỡng quỹ dự phòng khẩn cấp không được phép chạm tới.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-3 font-mono text-xs font-extrabold uppercase tracking-wider text-blue-800">
                    BƯỚC 03 / STRESS-TEST
                  </div>
                  <div className="sm:col-span-9 space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900">
                      Gói vay &amp; kiểm tra kịch bản sốc
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      So sánh trả gốc đều (dư nợ giảm dần) và trả góp đều (niên kim), thời gian ưu
                      đãi, ân hạn nợ gốc và thử nghiệm cú sốc lãi suất +2%, +4% hoặc giảm 20% thu
                      nhập.
                    </p>
                  </div>
                </div>
              </div>

              {/* Archonic & EvolveTech Governance Ledger */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-white p-5 space-y-2">
                  <div className="font-mono text-[11px] font-extrabold uppercase text-blue-800">
                    01 / PRIVACY BY DESIGN
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Quyền riêng tư &amp; Xử lý trên thiết bị
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toàn bộ phép tính chạy trực tiếp trên trình duyệt của bạn. Thu nhập, tiết kiệm và
                    số tiền vay không bao giờ bị gửi về máy chủ.
                  </p>
                  <Link
                    href="/bao-mat"
                    className="inline-block text-xs font-bold text-blue-800 hover:underline pt-1"
                  >
                    Chính sách bảo mật (Luật 91/2025/QH15) →
                  </Link>
                </div>

                <div className="bg-white p-5 space-y-2">
                  <div className="font-mono text-[11px] font-extrabold uppercase text-blue-800">
                    02 / OPEN DIAGNOSTICS
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Không giấu cảnh báo sau tường phí
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cung cấp miễn phí đầy đủ 6 chỉ số rủi ro cốt lõi, kịch bản sốc lãi suất/thu nhập,
                    đòn bẩy điều chỉnh và bảng lịch trả nợ 240 tháng.
                  </p>
                  <Link
                    href="/ve-evolvetech"
                    className="inline-block text-xs font-bold text-blue-800 hover:underline pt-1"
                  >
                    Nguyên tắc vận hành EvolveTech →
                  </Link>
                </div>

                <div className="bg-white p-5 space-y-2">
                  <div className="font-mono text-[11px] font-extrabold uppercase text-blue-800">
                    03 / ARCHONIC AUDIT
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Độc lập &amp; Kiểm định bởi Archonic
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vận hành độc lập bởi Archonic (EvolveTech), không nhận hoa hồng ẩn từ ngân hàng
                    hay sàn môi giới. Đạt 311+ bài kiểm thử toán học.
                  </p>
                  <Link
                    href="/lien-he"
                    className="inline-block text-xs font-bold text-blue-800 hover:underline pt-1"
                  >
                    Góp ý hoặc báo cáo sai lệch →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
