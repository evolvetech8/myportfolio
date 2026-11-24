'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import ResultsHeader from './ResultsHeader';
import MetricCards from './MetricCards';
import WhatIfControls from './WhatIfControls';
import CorrectiveLevers from './CorrectiveLevers';
import AmortizationChart from './AmortizationChart';
import CashFlowChart from './CashFlowChart';
import ScheduleTable from './ScheduleTable';
import DisclaimerCard from './DisclaimerCard';

export default function ResultsDashboard({ waitlistOpen = false }: { waitlistOpen?: boolean } = {}) {
  const { hasSimulated, isSimulated, loan } = useSimulation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-xs text-slate-400 font-medium">Đang tải kết quả mô phỏng...</div>
      </div>
    );
  }

  const isReady = (hasSimulated || isSimulated) && loan && loan.propertyPrice > 0;

  // Direct access fallback guard: User opens /ket-qua without simulating
  if (!isReady) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60 shadow-2xs">
            <AlertCircle className="w-7 h-7 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Chưa Có Dữ Liệu Mô Phỏng
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn chưa nhập thông tin bất động sản và dòng tiền gia đình. Vui lòng hoàn thành 3 bước kiểm tra nhanh (100% ẩn danh, không cần tài khoản) để xem báo cáo rủi ro.
            </p>
          </div>
          <Link
            href="/kiem-tra-mua-nha"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm hover:bg-blue-800 transition shadow-md active:scale-[0.98]"
          >
            <span>Bắt đầu kiểm tra miễn phí</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Scenario Overview */}
        <ResultsHeader />

        {/* Top 6 Risk Metric Cards */}
        <MetricCards />

        {/* What-If Stress Testing Controls */}
        <WhatIfControls />

        {/* Synchronized Recharts (Amortization & Cash Flow Curve) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmortizationChart />
          <CashFlowChart />
        </div>

        {/* Corrective Levers & Reverse Solver Recommendations */}
        <CorrectiveLevers />

        {/* Beta Program CTA */}


        {/* Accessible Amortization Table */}
        <ScheduleTable />

        {/* Legal Disclaimer & Transparency Card */}
        <DisclaimerCard />
        <div className="print:hidden"><Link className="inline-block rounded-xl bg-blue-800 p-4 text-white" href="/ra-soat-ho-so-vay?source=results">{waitlistOpen ? 'Báo cho tôi khi mở gói rà soát 299.000đ' : 'Xem hai gói rà soát chuyên sâu'}</Link></div>
      </div>
    </div>
  );
}
