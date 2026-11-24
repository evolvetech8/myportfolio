'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Calculator,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  Mail,
  Info,
  ArrowRight,
  FileCheck2,
  Lock,
  CheckCircle2,
  Newspaper,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/kiem-tra-mua-nha', label: 'Kiểm tra mua nhà', icon: Calculator },
  { href: '/bao-cao-mau', label: 'Hồ sơ mẫu', icon: FileCheck2 },
  { href: '/huong-dan', label: 'Cẩm nang', icon: Newspaper },
  { href: '/cach-tinh', label: 'Cách tính', icon: BookOpen },
  { href: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp', icon: HelpCircle },
  { href: '/ve-evolvetech', label: 'Về EvolveTech', icon: Info },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-2xs">
      {/* Top Institutional Verification Bar */}
      <div className="bg-[#0B1D30] text-slate-300 text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Archonic FinLab • Mô hình Toán học Tất định v1.1 (Sai số 0 VND)</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <span>Đã kiểm định qua 311+ kịch bản Stress-Test &amp; BigInt Oracle</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-300">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-blue-400" />
              <span>100% On-Device (Luật Bảo vệ DLCN 91/2025/QH15)</span>
            </span>
            <span className="text-slate-600">•</span>
            <Link href="/lien-he" className="hover:text-white transition-colors font-medium">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Brand Logo: EvolveTech / DepositGuard */}
          <Link href="/" className="flex items-center gap-2 group min-w-0">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1D30] to-blue-800 text-white items-center justify-center font-bold text-lg shadow-xs border border-blue-900/20 group-hover:from-blue-900 group-hover:to-blue-700 transition-all">
              <ShieldCheck className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0B1D30] group-hover:text-blue-800 transition-colors">
                  EvolveTech
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 rounded-full border border-blue-200">
                  DepositGuard
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 font-medium -mt-0.5">
                Thẩm định sức chịu đựng dòng tiền trước đặt cọc
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold transition-colors flex items-center gap-1.5 py-2 px-2.5 rounded-xl ${
                    isActive
                      ? 'text-blue-900 bg-blue-50 font-bold border border-blue-200/60'
                      : 'text-slate-600 hover:text-blue-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {!mobileMenuOpen && (
              <Link
                href="/kiem-tra-mua-nha"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                <span>Kiểm tra miễn phí</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-semibold min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200/70'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-semibold min-h-[44px] text-slate-700 hover:bg-slate-50 hover:text-blue-800"
            >
              <Mail className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Liên hệ &amp; Báo lỗi</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/kiem-tra-mua-nha"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-xs min-h-[46px]"
            >
              <span>Bắt đầu kiểm tra mua nhà (Ẩn danh 100%)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
              <Link href="/bao-mat" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-800">
                Chính sách bảo mật (Luật 91/2025/QH15)
              </Link>
              <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-800">
                App Store Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
