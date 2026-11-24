'use client';

import React, { useState } from 'react';
import { Download, Table, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';
import { trackEvent } from '@/lib/depositguard/telemetry';

type ViewMode = '24_MONTHS' | 'YEARLY' | 'ALL';

export default function ScheduleTable() {
  const { simulationResult, loan } = useSimulation();
  const [viewMode, setViewMode] = useState<ViewMode>('24_MONTHS');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 24;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
    if (mode === 'ALL') {
      trackEvent('schedule_table_expanded', { view_mode: 'full' });
    }
  };

  // CSV Export with UTF-8 BOM (\uFEFF)
  const handleExportCSV = () => {
    const headers = [
      'Tháng',
      'Dư nợ đầu kỳ (VND)',
      'Tiền gốc (VND)',
      'Tiền lãi (VND)',
      'Tổng trả nợ (VND)',
      'Thu nhập ròng (VND)',
      'Chi phí sinh hoạt (VND)',
      'Dòng tiền tự do (VND)',
      'Số dư quỹ dự phòng (VND)',
      'Lãi suất (%/năm)',
      'Trạng thái thâm hụt',
    ];

    const rows = simulationResult.schedule.map((item) => [
      item.month,
      item.beginningBalance,
      item.principalPayment,
      item.interestPayment,
      item.totalDebtService,
      item.netIncome,
      item.essentialExpenses,
      item.operatingCashFlow,
      item.reserveBalance,
      item.interestRate,
      item.isDeficit ? 'Thâm hụt' : 'An toàn',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DepositGuard_Lich_Tra_No_${loan.loanTermMonths}Thang.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Compute table rows based on view mode
  const getRenderRows = () => {
    if (viewMode === '24_MONTHS') {
      return simulationResult.schedule.slice(0, 24);
    }

    if (viewMode === 'YEARLY') {
      const yearlyRows: typeof simulationResult.schedule = [];
      const totalMonths = simulationResult.schedule.length;
      const totalYears = Math.ceil(totalMonths / 12);

      for (let y = 1; y <= totalYears; y++) {
        const startIdx = (y - 1) * 12;
        const endIdx = Math.min(y * 12, totalMonths);
        const chunk = simulationResult.schedule.slice(startIdx, endIdx);
        if (chunk.length === 0) continue;

        const totalPrincipal = chunk.reduce((sum, item) => sum + item.principalPayment, 0);
        const totalInterest = chunk.reduce((sum, item) => sum + item.interestPayment, 0);
        const totalDebt = chunk.reduce((sum, item) => sum + item.totalDebtService, 0);
        const totalNetIncome = chunk.reduce((sum, item) => sum + item.netIncome, 0);
        const totalExpenses = chunk.reduce((sum, item) => sum + item.essentialExpenses, 0);
        const totalCashFlow = chunk.reduce((sum, item) => sum + item.operatingCashFlow, 0);
        const lastItem = chunk[chunk.length - 1];
        const hasDeficit = chunk.some((item) => item.isDeficit);

        yearlyRows.push({
          month: y, // represents Year index
          beginningBalance: chunk[0].beginningBalance,
          principalPayment: totalPrincipal,
          interestPayment: totalInterest,
          totalDebtService: totalDebt,
          endingBalance: lastItem.endingBalance,
          interestRate: chunk[0].interestRate,
          isPromo: chunk.some((c) => c.isPromo),
          netIncome: totalNetIncome,
          essentialExpenses: totalExpenses,
          existingDebt: chunk[0].existingDebt * chunk.length,
          operatingCashFlow: totalCashFlow,
          reserveBalance: lastItem.reserveBalance,
          isDeficit: hasDeficit,
          dtiRatio: totalNetIncome > 0 ? totalDebt / totalNetIncome : null,
        });
      }
      return yearlyRows;
    }

    // ALL (Paginated)
    const start = (currentPage - 1) * pageSize;
    return simulationResult.schedule.slice(start, start + pageSize);
  };

  const renderRows = getRenderRows();
  const totalPages = Math.ceil(simulationResult.schedule.length / pageSize);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-0.5">
            <Table className="w-4 h-4" /> Bảng Lịch Trả Nợ & Dòng Tiền Chi Tiết
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Theo dõi chi tiết từng tháng hoặc từng năm
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap items-center gap-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleViewModeChange('24_MONTHS')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === '24_MONTHS'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24 tháng đầu
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('YEARLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'YEARLY'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tóm tắt theo năm
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'ALL'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toàn bộ ({simulationResult.schedule.length}T)
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" /> Tải file Excel/CSV
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Scroll Indicator */}
      <p className="text-[11px] text-slate-400 sm:hidden flex items-center gap-1">
        <span>← Vuốt ngang để xem đủ 7 cột thông số →</span>
      </p>

      {/* Accessible Responsive Semantic HTML Table */}
      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 rounded-2xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <caption className="sr-only">
            Lịch trả nợ và dòng tiền chi tiết cho khoản vay {loan.loanAmount} VND
          </caption>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3 px-3.5 sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#e2e8f0]">
                {viewMode === 'YEARLY' ? 'Năm' : 'Tháng'}
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Dư nợ đầu kỳ
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Tiền gốc
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Tiền lãi
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Tổng trả nợ
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Dòng tiền tự do
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-right">
                Số dư quỹ đệm
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {renderRows.map((item) => {
              const isCliffMonth = viewMode !== 'YEARLY' && item.month === loan.promoPeriodMonths + 1;
              const hasDeficit = item.isDeficit;

              return (
                <tr
                  key={item.month}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    hasDeficit
                      ? 'bg-rose-50/70 hover:bg-rose-100/60 font-semibold'
                      : isCliffMonth
                      ? 'bg-amber-50/60 hover:bg-amber-100/50'
                      : ''
                  }`}
                >
                  <th
                    scope="row"
                    className={`py-2.5 px-3.5 whitespace-nowrap sticky left-0 z-10 shadow-[1px_0_0_0_#e2e8f0] font-bold ${
                      hasDeficit
                        ? 'bg-rose-50 text-rose-950'
                        : isCliffMonth
                        ? 'bg-amber-50 text-amber-950'
                        : 'bg-white text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{viewMode === 'YEARLY' ? `Năm ${item.month}` : `Tháng ${item.month}`}</span>
                      {isCliffMonth && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Hết ưu đãi
                        </span>
                      )}
                      {hasDeficit && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <AlertCircle className="w-2.5 h-2.5" /> Âm
                        </span>
                      )}
                    </div>
                  </th>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap text-slate-600">
                    {formatVND(item.beginningBalance)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap text-slate-900 font-semibold">
                    {formatVND(item.principalPayment)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap text-amber-700 font-semibold">
                    {formatVND(item.interestPayment)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap text-slate-900 font-bold">
                    {formatVND(item.totalDebtService)}
                  </td>
                  <td
                    className={`py-2.5 px-3.5 text-right whitespace-nowrap font-bold ${
                      item.operatingCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.operatingCashFlow >= 0 ? '+' : ''}
                    {formatVND(item.operatingCashFlow)}
                  </td>
                  <td
                    className={`py-2.5 px-3.5 text-right whitespace-nowrap font-bold ${
                      item.reserveBalance >= 0 ? 'text-slate-800' : 'text-rose-600'
                    }`}
                  >
                    {formatVND(item.reserveBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination for ALL mode */}
      {viewMode === 'ALL' && totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 text-xs text-slate-600">
          <span>
            Trang {currentPage} / {totalPages} (Mỗi trang {pageSize} tháng)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
