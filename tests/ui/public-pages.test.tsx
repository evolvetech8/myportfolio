/**
 * @vitest-environment jsdom
 */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DepositGuardHomePage from '@/app/page';
import CachTinhPage, { metadata as cachTinhMeta } from '@/app/cach-tinh/page';
import CauHoiThuongGapPage, { metadata as faqMeta } from '@/app/cau-hoi-thuong-gap/page';
import LienHePage, { metadata as lienHeMeta } from '@/app/lien-he/page';
import VeEvolveTechPage, { metadata as veEvolveTechMeta } from '@/app/ve-evolvetech/page';
import BaoMatPage, { metadata as baoMatMeta } from '@/app/bao-mat/page';
import DieuKhoanPage, { metadata as dieuKhoanMeta } from '@/app/dieu-khoan/page';
import BaoCaoMauPage, { metadata as baoCaoMauMeta } from '@/app/bao-cao-mau/page';
import GuidesPage from '@/app/huong-dan/page';
import { metadata as ketQuaMeta } from '@/app/ket-qua/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SimulationProvider } from '@/lib/depositguard/context';
import { clearTelemetryLog, getTelemetryLog } from '@/lib/depositguard/telemetry';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
}));

describe('Milestone 3 & 4: Public Pages, Trust Architecture, SEO & Privacy (EvolveTech Domain)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockPush.mockClear();
    clearTelemetryLog();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      if (root) root.unmount();
    });
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('1. Renders Homepage (/) with 2-Column Hero, Live Stress-Test Terminal, 5 Red Flags Checklist, 3 Family Case Studies, and Infographic Gallery', () => {
    act(() => {
      root.render(
        <SimulationProvider>
          <DepositGuardHomePage />
        </SimulationProvider>
      );
    });

    const text = container.textContent || '';
    expect(text).toContain('Đừng đặt cọc trước khi biết');
    expect(text).toContain('mình có đủ sức trả nợ.');
    expect(text).toContain('Tính thử với số của gia đình tôi');
    expect(text).toContain('DepositGuard Live Stress-Test Terminal v1.1');
    expect(text).toContain('DIỄN BIẾN DÒNG TIỀN 240 THÁNG');
    expect(text).toContain('Giai đoạn 01');
    expect(text).toContain('Tự kiểm tra 5');
    expect(text).toContain('Hồ sơ #1 • TP.HCM');
    expect(text).toContain('Hồ sơ #2 • Hà Nội');
    expect(text).toContain('Hồ sơ #3 • Chuẩn An Toàn');
    expect(text).toContain('6 Mô hình Trực quan Mọi Người Mua Nhà Cần Xem Trước Khi Đặt Cọc');
    expect(text).toMatch(/2\.000\.000\.000\s*₫/);
    expect(text).toMatch(/20\.000\.000\s*₫/);
    expect(text).toMatch(/27\.333\.333\s*₫/);
    expect(text).toContain('EvolveTech');
    expect(text).toContain('Archonic');
    expect(text).not.toContain('howdoi.id.vn');
    expect(text).not.toContain('Guaranteed safe');
    expect(text).not.toContain('Approved by bank');
  });

  it('2. Renders Sample Pre-Deposit Diagnostic Report (/bao-cao-mau) with 7 upfront cash items, 4 stress scenarios, and 5 bank questions', () => {
    act(() => {
      root.render(<BaoCaoMauPage />);
    });

    const text = container.textContent || '';
    expect(text).toContain('DG-2026-HCM-2800');
    expect(text).toContain('Phần 1. Bóc tách 7 khoản tiền mặt bắt buộc');
    expect(text).toContain('Phần 2. Ma trận Stress-Test 4 kịch bản');
    expect(text).toContain('5 Câu hỏi bắt buộc yêu cầu Tín dụng viên xác nhận bằng văn bản');
    expect(String(baoCaoMauMeta.title)).toContain('Hồ Sơ Chẩn Đoán');
  });

  it('3. Renders Guides Page (/huong-dan) with the 5 Authoritative PRD Homebuyer Guides and visual infographic previews', () => {
    act(() => {
      root.render(<GuidesPage />);
    });

    const text = container.textContent || '';
    expect(text).toContain('5 Cẩm Nang Sống Còn Trước Khi Xuống Tiền Đặt Cọc Mua Nhà');
    expect(text).toContain('Điều gì xảy ra với khoản vay mua nhà sau 12–24 tháng đầu ưu đãi?');
    expect(text).toContain('5 hạng mục tài chính sống còn phải kiểm tra trước khi xuống tiền đặt cọc');
  });

  it('4. Renders Methodology Page (/cach-tinh) with formulas, v1.1 model version, and Golden Fixture verification table', () => {
    act(() => {
      root.render(<CachTinhPage />);
    });

    const text = container.textContent || '';
    expect(text).toContain('Phương pháp tính & Giả định mô hình tài chính');
    expect(text).toContain('v1.1');
    expect(text).toContain('actual/365');
    expect(text).toContain('Tháng 13 (Hết ưu đãi)');
    expect(String(cachTinhMeta.title)).toContain('EvolveTech DepositGuard');
  });

  it('5. Renders FAQ Page (/cau-hoi-thuong-gap) and tracks anonymized faq_accordion_opened telemetry', () => {
    act(() => {
      root.render(<CauHoiThuongGapPage />);
    });

    const text = container.textContent || '';
    expect(text).toContain('Câu hỏi thường gặp (FAQ)');

    const buttons = Array.from(container.querySelectorAll('button'));
    const annuityBtn = buttons.find((b) =>
      b.textContent?.includes('Nên chọn trả gốc đều (dư nợ giảm dần) hay trả góp đều hàng tháng')
    );
    expect(annuityBtn).toBeDefined();

    act(() => {
      annuityBtn!.click();
    });

    const log = getTelemetryLog();
    expect(log.some((e) => e.event === 'faq_accordion_opened')).toBe(true);
    expect(String(faqMeta.title)).toContain('EvolveTech DepositGuard');
  });

  it('6. Renders Contact Page (/lien-he), validates email/message, and submits zero-PII telemetry', () => {
    act(() => {
      root.render(<LienHePage />);
    });

    expect(container.textContent).toContain('Liên hệ & Báo lỗi phép tính');

    const form = container.querySelector('form')!;
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Vui lòng nhập địa chỉ email hợp lệ');
    expect(container.textContent).toContain('Vui lòng nhập nội dung chi tiết');

    const emailInput = container.querySelector('#contact-email') as HTMLInputElement;
    const msgInput = container.querySelector('#contact-message') as HTMLTextAreaElement;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;

    act(() => {
      nativeInputValueSetter?.call(emailInput, 'test@evolvetech.biz.vn');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));

      nativeTextAreaValueSetter?.call(
        msgInput,
        'Tôi muốn đối chiếu bảng tính lãi suất thả nổi tháng 13.'
      );
      msgInput.dispatchEvent(new Event('input', { bubbles: true }));
      msgInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Đã ghi nhận phản hồi của bạn!');

    const log = getTelemetryLog();
    const feedbackEvents = log.filter((e) => e.event === 'feedback_submitted');
    expect(feedbackEvents.length).toBe(1);
    const serialized = JSON.stringify(feedbackEvents[0]);
    expect(serialized).not.toContain('test@evolvetech.biz.vn');
    expect(serialized).not.toContain('Tôi muốn đối chiếu');
    expect(String(lienHeMeta.title)).toContain('EvolveTech DepositGuard');
  });

  it('7. Renders About (/ve-evolvetech), Privacy (/bao-mat), Terms (/dieu-khoan), Navbar & Footer, and enforces SEO rules', () => {
    act(() => {
      root.render(<VeEvolveTechPage />);
    });
    expect(container.textContent).toContain('Về EvolveTech & Nguyên tắc độc lập của DepositGuard');
    expect(String(veEvolveTechMeta.title)).toContain('Về EvolveTech');

    act(() => {
      root.render(<BaoMatPage />);
    });
    expect(container.textContent).toContain('Chính sách bảo mật & Quyền riêng tư');
    expect(container.textContent).toContain('91/2025/QH15');
    expect(String(baoMatMeta.title)).toContain('EvolveTech DepositGuard');

    act(() => {
      root.render(<DieuKhoanPage />);
    });
    expect(container.textContent).toContain('Điều khoản sử dụng & Giới hạn trách nhiệm');
    expect(String(dieuKhoanMeta.title)).toContain('EvolveTech DepositGuard');

    act(() => {
      root.render(
        <>
          <Navbar />
          <Footer />
        </>
      );
    });
    expect(container.textContent).toContain('Vận hành bởi Archonic.');
    expect(container.textContent).not.toContain('Frank');

    const robotsMeta = ketQuaMeta.robots as Record<string, any>;
    expect(robotsMeta.index).toBe(false);
    expect(robotsMeta.follow).toBe(false);

    const robotsConfig = robots();
    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    expect(rules.disallow).toContain('/ket-qua');
    expect(robotsConfig.sitemap).toBe('https://www.evolvetech.biz.vn/sitemap.xml');

    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((entry) => entry.url);
    expect(urls).toContain('https://www.evolvetech.biz.vn');
    expect(urls).toContain('https://www.evolvetech.biz.vn/kiem-tra-mua-nha');
    expect(urls).toContain('https://www.evolvetech.biz.vn/bao-cao-mau');
    expect(urls).toContain('https://www.evolvetech.biz.vn/huong-dan/cu-nhay-lai-suat-thang-13-va-25');
    expect(urls).not.toContain('https://www.evolvetech.biz.vn/ket-qua');
  });
});
