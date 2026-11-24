/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  SimulationProvider,
  useSimulation,
  DEFAULT_LOAN_INPUT,
  DEFAULT_HOUSEHOLD_INPUT,
} from '@/lib/depositguard/context';
import WizardContainer from '@/components/depositguard/wizard/WizardContainer';

// Ensure React 19 act environment is active
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation router
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
  }),
}));

describe('Regression & End-to-End Wizard Flow Test Suite', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    window.scrollTo = vi.fn();

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

  // Harness to inspect context state during component execution
  function ContextHarness({ onContext }: { onContext: (ctx: ReturnType<typeof useSimulation>) => void }) {
    const ctx = useSimulation();
    onContext(ctx);
    return null;
  }

  it('renders WizardContainer with default state and enables the "Tiếp tục" button on Step 1', () => {
    let ctx!: ReturnType<typeof useSimulation>;

    act(() => {
      root.render(
        <SimulationProvider>
          <ContextHarness onContext={(c) => (ctx = c)} />
          <WizardContainer />
        </SimulationProvider>
      );
    });

    // 1. Verify context step and validation state
    expect(ctx.currentStep).toBe(1);
    expect(ctx.step1Validation.isValid).toBe(true);
    expect(Object.keys(ctx.step1Validation.errors).length).toBe(0);

    // 2. Verify no inline error message rendered
    const textContent = container.textContent || '';
    expect(textContent).not.toContain('Invalid input');
    expect(textContent).not.toContain('expected number, received undefined');

    // 3. Verify Next button is enabled and has active emerald styling
    const buttons = Array.from(container.querySelectorAll('button'));
    const nextBtn = buttons.find((b) => b.textContent?.includes('Tiếp tục sang bước 2'));
    expect(nextBtn).toBeDefined();
    expect(nextBtn!.disabled).toBe(false);
    expect(nextBtn!.className).toContain('bg-blue-700');
    expect(nextBtn!.className).not.toContain('cursor-not-allowed');
  });

  it('dynamically disables "Tiếp tục" button on invalid Step 1 input and re-enables when fixed', () => {
    let ctx!: ReturnType<typeof useSimulation>;

    act(() => {
      root.render(
        <SimulationProvider>
          <ContextHarness onContext={(c) => (ctx = c)} />
          <WizardContainer />
        </SimulationProvider>
      );
    });

    const getNextButton = () => {
      const buttons = Array.from(container.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.includes('Tiếp tục sang bước 2'));
    };

    expect(getNextButton()!.disabled).toBe(false);

    // Enter invalid state: down payment exceeds property price
    act(() => {
      ctx.updateLoan({
        propertyPrice: 2_500_000_000,
        downPayment: 3_000_000_000,
        loanAmount: 0,
      });
    });

    expect(ctx.step1Validation.isValid).toBe(false);
    expect(getNextButton()!.disabled).toBe(true);
    expect(getNextButton()!.className).toContain('cursor-not-allowed');
    expect(container.textContent).toContain('không được vượt quá giá mua nhà');

    // Restore to valid state
    act(() => {
      ctx.updateLoan({
        propertyPrice: 3_000_000_000,
        downPayment: 600_000_000,
        loanAmount: 2_400_000_000,
      });
    });

    expect(ctx.step1Validation.isValid).toBe(true);
    expect(getNextButton()!.disabled).toBe(false);
    expect(getNextButton()!.className).toContain('bg-blue-700');
  });

  it('completes the full 3-step wizard workflow via simulated user clicks on "Tiếp tục" to reach Results', () => {
    let ctx!: ReturnType<typeof useSimulation>;

    act(() => {
      root.render(
        <SimulationProvider>
          <ContextHarness onContext={(c) => (ctx = c)} />
          <WizardContainer />
        </SimulationProvider>
      );
    });

    // -------------------------------------------------------------------------
    // STEP 1: Property Profile
    // -------------------------------------------------------------------------
    expect(ctx.currentStep).toBe(1);
    expect(container.textContent).toContain('Bước 1 · Căn nhà');
    expect(container.textContent).toContain('Căn nhà dự kiến giá bao nhiêu?');

    const step1NextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Tiếp tục sang bước 2')
    );
    expect(step1NextBtn).toBeDefined();
    expect(step1NextBtn!.disabled).toBe(false);

    // Click "Tiếp tục sang bước 2"
    act(() => {
      step1NextBtn!.click();
    });

    // -------------------------------------------------------------------------
    // STEP 2: Household Profile
    // -------------------------------------------------------------------------
    expect(ctx.currentStep).toBe(2);
    expect(container.textContent).toContain('Bước 2 · Thu chi gia đình');
    expect(container.textContent).toContain('Mỗi tháng, cả nhà thực nhận bao nhiêu tiền?');
    expect(ctx.step2Validation.isValid).toBe(true);

    const step2NextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Tiếp tục sang bước 3')
    );
    expect(step2NextBtn).toBeDefined();
    expect(step2NextBtn!.disabled).toBe(false);

    // Click "Tiếp tục sang bước 3"
    act(() => {
      step2NextBtn!.click();
    });

    // -------------------------------------------------------------------------
    // STEP 3: Loan Parameters
    // -------------------------------------------------------------------------
    expect(ctx.currentStep).toBe(3);
    expect(container.textContent).toContain('Bước 3 · Khoản vay');
    expect(container.textContent).toContain('Thời hạn gói vay');
    expect(ctx.step3Validation.isValid).toBe(true);

    const step3SubmitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Xem kết quả phân tích rủi ro & Stress-test')
    );
    expect(step3SubmitBtn).toBeDefined();
    expect(step3SubmitBtn!.disabled).toBe(false);

    // Click submit button to finish wizard and navigate to /ket-qua
    act(() => {
      step3SubmitBtn!.click();
    });

    // -------------------------------------------------------------------------
    // RESULTS NAVIGATION & COMPLETION
    // -------------------------------------------------------------------------
    expect(ctx.hasSimulated).toBe(true);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ket-qua');
  });

  it('supports seamless backward and forward navigation across all steps with complete state retention', () => {
    let ctx!: ReturnType<typeof useSimulation>;

    act(() => {
      root.render(
        <SimulationProvider>
          <ContextHarness onContext={(c) => (ctx = c)} />
          <WizardContainer />
        </SimulationProvider>
      );
    });

    // Step 1: Customize property price
    act(() => {
      ctx.updateLoan({
        propertyPrice: 4_000_000_000,
        downPayment: 1_000_000_000,
        loanAmount: 3_000_000_000,
      });
    });

    // Advance to Step 2
    act(() => {
      const nextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tiếp tục sang bước 2')
      );
      nextBtn!.click();
    });
    expect(ctx.currentStep).toBe(2);

    // Step 2: Customize household income
    act(() => {
      ctx.updateHousehold({
        monthlyNetIncome: 70_000_000,
        essentialLivingExpenses: 35_000_000,
        liquidSavings: 1_200_000_000,
      });
    });

    // Advance to Step 3
    act(() => {
      const nextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tiếp tục sang bước 3')
      );
      nextBtn!.click();
    });
    expect(ctx.currentStep).toBe(3);

    // Step 3: Customize repayment method
    act(() => {
      ctx.updateLoan({ repaymentMethod: 'ANNUITY' });
    });

    // Navigate BACK: Step 3 -> Step 2
    act(() => {
      const backBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Quay lại')
      );
      backBtn!.click();
    });
    expect(ctx.currentStep).toBe(2);
    expect(ctx.household.monthlyNetIncome).toBe(70_000_000);
    expect(ctx.household.essentialLivingExpenses).toBe(35_000_000);
    expect(ctx.household.liquidSavings).toBe(1_200_000_000);

    // Navigate BACK: Step 2 -> Step 1
    act(() => {
      const backBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Quay lại')
      );
      backBtn!.click();
    });
    expect(ctx.currentStep).toBe(1);
    expect(ctx.loan.propertyPrice).toBe(4_000_000_000);
    expect(ctx.loan.downPayment).toBe(1_000_000_000);
    expect(ctx.loan.loanAmount).toBe(3_000_000_000);

    // Navigate FORWARD again: Step 1 -> Step 2 -> Step 3
    act(() => {
      const nextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tiếp tục sang bước 2')
      );
      nextBtn!.click();
    });
    expect(ctx.currentStep).toBe(2);

    act(() => {
      const nextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tiếp tục sang bước 3')
      );
      nextBtn!.click();
    });
    expect(ctx.currentStep).toBe(3);
    expect(ctx.loan.repaymentMethod).toBe('ANNUITY');
  });
});
