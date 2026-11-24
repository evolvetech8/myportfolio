'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
  SimulationResult,
  AffordabilitySolverResult,
} from './engine/types';
import { calculateSimulation } from './engine/cashflow';
import { solveAffordability } from './engine/solver';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  StepValidationResult,
  PropertyType,
  Region,
} from './schemas';
import { trackEvent } from './telemetry';

export interface ExtendedLoanInput extends LoanInput {
  propertyType?: PropertyType;
  region?: Region;
  purchasePrice?: number;
  illustrativeRate?: boolean;
  example?: boolean;
}

export const DEFAULT_LOAN_INPUT: ExtendedLoanInput = {
  propertyPrice: 2_500_000_000,
  purchasePrice: 2_500_000_000,
  downPayment: 500_000_000,
  loanAmount: 2_000_000_000,
  loanTermMonths: 240,
  repaymentMethod: 'EQUAL_PRINCIPAL',
  promoInterestRate: 7.0,
  promoPeriodMonths: 12,
  postPromoRate: 12.0,
  gracePeriodMonths: 0,
  propertyType: 'apartment',
  region: 'hcm',
};

export const DEFAULT_HOUSEHOLD_INPUT: HouseholdInput = {
  monthlyNetIncome: 55_000_000,
  essentialLivingExpenses: 30_000_000,
  existingDebtPayments: 0,
  liquidSavings: 700_000_000,
  plannedEmergencyReserveFloor: 90_000_000,
  recurringPropertyCosts: 0,
  transactionCosts: 0,
  initialSetupCosts: 0,
};

export const DEFAULT_STRESS_SCENARIO: StressScenarioInput = {
  rateShockPp: 0,
  incomeShockPercent: 0,
  incomeShockDurationMonths: 6,
  incomeShockStartMonth: 13,
  expenseShockPercent: 0,
};

export type ScenarioPresetKey =
  | 'BASE'
  | 'RATE_SHOCK_2PP'
  | 'RATE_SHOCK_4PP'
  | 'INCOME_SHOCK_3M'
  | 'INCOME_SHOCK_6M'
  | 'EXPENSE_SHOCK_10PCT'
  | 'EXTREME_STRESS'
  | 'CUSTOM';

const SESSION_STORAGE_KEY = 'depositguard_simulation_v1';

export interface SimulationContextType {
  // Inputs
  loan: ExtendedLoanInput;
  household: HouseholdInput;
  stress: StressScenarioInput;
  activePreset: ScenarioPresetKey;

  // Aliases for interface compatibility
  loanInput: ExtendedLoanInput;
  householdInput: HouseholdInput;
  stressScenario: StressScenarioInput;

  // Wizard Navigation
  currentStep: 1 | 2 | 3;
  setCurrentStep: (step: 1 | 2 | 3) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  isStepComplete: (step: 1 | 2 | 3) => boolean;

  // Real-time Validations
  step1Validation: StepValidationResult;
  step2Validation: StepValidationResult;
  step3Validation: StepValidationResult;

  // State Mutators
  updateLoan: (partial: Partial<ExtendedLoanInput>) => void;
  setLoanInput: (partial: Partial<ExtendedLoanInput>) => void;
  updateHousehold: (partial: Partial<HouseholdInput>) => void;
  setHouseholdInput: (partial: Partial<HouseholdInput>) => void;
  updateStress: (partial: Partial<StressScenarioInput>) => void;
  setStressScenario: (partial: Partial<StressScenarioInput>) => void;
  applyPreset: (preset: ScenarioPresetKey) => void;
  resetStressScenario: () => void;
  resetScenario: () => void;
  resetSimulation: () => void;
  loadGoldenFixture: () => void;

  // Corrective Levers
  applySafeLoanLever: () => void;
  applySafeEquityLever: () => void;

  // Engine Computed Outputs
  simulationResult: SimulationResult;
  activeResult: SimulationResult;
  baseResult: SimulationResult;
  solverResult: AffordabilitySolverResult;
  hasSimulated: boolean;
  isSimulated: boolean;
  setHasSimulated: (simulated: boolean) => void;

  // Derived Financial Ratios
  equityRatioPercent: number;
  loanToValuePercent: number;
  discretionarySurplusBeforeLoan: number;
  remainingCashAfterClosing: number;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [loan, setLoan] = useState<ExtendedLoanInput>(DEFAULT_LOAN_INPUT);
  const [household, setHousehold] = useState<HouseholdInput>(DEFAULT_HOUSEHOLD_INPUT);
  const [stress, setStress] = useState<StressScenarioInput>(DEFAULT_STRESS_SCENARIO);
  const [activePreset, setActivePreset] = useState<ScenarioPresetKey>('BASE');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [hasSimulated, setHasSimulated] = useState<boolean>(false);

  // Hydrate from sessionStorage (tab-scoped memory) on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.loan) {
            const price = parsed.loan.propertyPrice ?? parsed.loan.purchasePrice ?? DEFAULT_LOAN_INPUT.propertyPrice;
            setLoan({ ...parsed.loan, propertyPrice: price, purchasePrice: price });
          }
          if (parsed.household) setHousehold(parsed.household);
          if (parsed.stress) setStress(parsed.stress);
          if (parsed.activePreset) setActivePreset(parsed.activePreset);
          if (typeof parsed.hasSimulated === 'boolean') setHasSimulated(parsed.hasSimulated);
        }
      }
    } catch {
      // Fallback silently if sessionStorage is unavailable or blocked
    }
  }, []);

  // Sync to sessionStorage on state updates
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ loan, household, stress, activePreset, hasSimulated })
        );
      }
    } catch {
      // Ignore quota errors
    }
  }, [loan, household, stress, activePreset, hasSimulated]);

  // Synchronous memoized calculation engine executions
  const simulationResult = useMemo(() => {
    return calculateSimulation(loan, household, stress);
  }, [loan, household, stress]);

  const baseResult = useMemo(() => {
    return calculateSimulation(loan, household, DEFAULT_STRESS_SCENARIO);
  }, [loan, household]);

  const solverResult = useMemo(() => {
    return solveAffordability(loan, household, stress);
  }, [loan, household, stress]);

  // Validations
  const step1Validation = useMemo(
    () =>
      validateStep1({
        ...loan,
        purchasePrice: loan.propertyPrice,
        propertyPrice: loan.propertyPrice,
      }),
    [loan]
  );
  const step2Validation = useMemo(
    () => validateStep2({ ...household, downPayment: loan.downPayment }),
    [household, loan.downPayment]
  );
  const step3Validation = useMemo(() => validateStep3(loan), [loan]);

  // Cross-field balanced update for loan
  const updateLoan = useCallback((partial: Partial<ExtendedLoanInput>) => {
    setLoan((prev) => {
      const price = partial.propertyPrice ?? partial.purchasePrice ?? prev.propertyPrice;
      const updated = {
        ...prev,
        ...partial,
        propertyPrice: price,
        purchasePrice: price,
      };
      if (
        (partial.propertyPrice !== undefined || partial.purchasePrice !== undefined) &&
        partial.loanAmount === undefined
      ) {
        updated.loanAmount = Math.max(0, updated.propertyPrice - updated.downPayment);
      } else if (partial.downPayment !== undefined && partial.loanAmount === undefined) {
        updated.loanAmount = Math.max(0, updated.propertyPrice - updated.downPayment);
      } else if (partial.loanAmount !== undefined && partial.downPayment === undefined) {
        updated.downPayment = Math.max(0, updated.propertyPrice - updated.loanAmount);
      }
      return updated;
    });
  }, []);

  const updateHousehold = useCallback((partial: Partial<HouseholdInput>) => {
    setHousehold((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateStress = useCallback((partial: Partial<StressScenarioInput>) => {
    setStress((prev) => ({ ...prev, ...partial }));
    setActivePreset('CUSTOM');
  }, []);

  const applyPreset = useCallback((preset: ScenarioPresetKey) => {
    setActivePreset(preset);
    switch (preset) {
      case 'BASE':
        setStress(DEFAULT_STRESS_SCENARIO);
        break;
      case 'RATE_SHOCK_2PP':
        setStress({ ...DEFAULT_STRESS_SCENARIO, rateShockPp: 2 });
        trackEvent('whatif_rate_shock_toggled', { shock_pp: 2 });
        break;
      case 'RATE_SHOCK_4PP':
        setStress({ ...DEFAULT_STRESS_SCENARIO, rateShockPp: 4 });
        trackEvent('whatif_rate_shock_toggled', { shock_pp: 4 });
        break;
      case 'INCOME_SHOCK_3M':
        setStress({
          ...DEFAULT_STRESS_SCENARIO,
          incomeShockPercent: -20,
          incomeShockDurationMonths: 3,
        });
        trackEvent('whatif_income_shock_toggled', { shock_percent: -20, duration_months: 3 });
        break;
      case 'INCOME_SHOCK_6M':
        setStress({
          ...DEFAULT_STRESS_SCENARIO,
          incomeShockPercent: -20,
          incomeShockDurationMonths: 6,
        });
        trackEvent('whatif_income_shock_toggled', { shock_percent: -20, duration_months: 6 });
        break;
      case 'EXPENSE_SHOCK_10PCT':
        setStress({ ...DEFAULT_STRESS_SCENARIO, expenseShockPercent: 10 });
        break;
      case 'EXTREME_STRESS':
        setStress({
          rateShockPp: 2,
          incomeShockPercent: -20,
          incomeShockDurationMonths: 3,
          incomeShockStartMonth: 13,
          expenseShockPercent: 10,
        });
        trackEvent('whatif_rate_shock_toggled', { shock_pp: 2 });
        break;
      case 'CUSTOM':
      default:
        break;
    }
  }, []);

  const resetStressScenario = useCallback(() => {
    setStress(DEFAULT_STRESS_SCENARIO);
    setActivePreset('BASE');
  }, []);

  const resetScenario = useCallback(() => {
    setLoan(DEFAULT_LOAN_INPUT);
    setHousehold(DEFAULT_HOUSEHOLD_INPUT);
    setStress(DEFAULT_STRESS_SCENARIO);
    setActivePreset('BASE');
    setCurrentStep(1);
    setHasSimulated(false);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {}
  }, []);

  const loadGoldenFixture = useCallback(() => {
    setHasSimulated(true);
    setLoan({ ...DEFAULT_LOAN_INPUT, example: true });
    setHousehold(DEFAULT_HOUSEHOLD_INPUT);
    setStress(DEFAULT_STRESS_SCENARIO);
    setActivePreset('BASE');
  }, []);

  const applySafeLoanLever = useCallback(() => {
    if (solverResult.maxSafeLoanAmount > 0) {
      updateLoan({ loanAmount: solverResult.maxSafeLoanAmount });
      trackEvent('corrective_lever_viewed', { lever_type: 'loan_reduction' });
    }
  }, [solverResult.maxSafeLoanAmount, updateLoan]);

  const applySafeEquityLever = useCallback(() => {
    if (solverResult.additionalEquityNeeded > 0) {
      updateLoan({ downPayment: loan.downPayment + solverResult.additionalEquityNeeded });
      trackEvent('corrective_lever_viewed', { lever_type: 'extra_down_payment' });
    }
  }, [solverResult.additionalEquityNeeded, loan.downPayment, updateLoan]);

  const goToNextStep = useCallback((): boolean => {
    if (currentStep === 1) {
      if (!step1Validation.isValid) return false;
      trackEvent('wizard_step_completed', { step: 1, step_name: 'property' });
      setCurrentStep(2);
      trackEvent('wizard_step_viewed', { step: 2, step_name: 'household' });
      return true;
    }
    if (currentStep === 2) {
      if (!step2Validation.isValid) return false;
      trackEvent('wizard_step_completed', { step: 2, step_name: 'household' });
      setCurrentStep(3);
      trackEvent('wizard_step_viewed', { step: 3, step_name: 'loan' });
      return true;
    }
    if (currentStep === 3) {
      if (!step3Validation.isValid) return false;
      trackEvent('wizard_step_completed', {
        step: 3,
        step_name: 'loan',
        repayment_method: loan.repaymentMethod,
      });
      setHasSimulated(true);
      trackEvent('simulation_calculated', {
        status: simulationResult.affordabilityStatus,
        has_deficit: simulationResult.firstNegativeCashFlowMonth !== null,
      });
      return true;
    }
    return true;
  }, [currentStep, step1Validation.isValid, step2Validation.isValid, step3Validation.isValid, loan.repaymentMethod, simulationResult]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = (currentStep - 1) as 1 | 2;
      setCurrentStep(prevStep);
      const stepName = prevStep === 1 ? 'property' : 'household';
      trackEvent('wizard_step_viewed', { step: prevStep, step_name: stepName });
    }
  }, [currentStep]);

  const isStepComplete = useCallback(
    (step: 1 | 2 | 3): boolean => {
      if (step === 1) return step1Validation.isValid;
      if (step === 2) return step2Validation.isValid;
      if (step === 3) return step3Validation.isValid;
      return false;
    },
    [step1Validation.isValid, step2Validation.isValid, step3Validation.isValid]
  );

  // Derived financial ratios
  const equityRatioPercent = loan.propertyPrice > 0 ? (loan.downPayment / loan.propertyPrice) * 100 : 0;
  const loanToValuePercent = loan.propertyPrice > 0 ? (loan.loanAmount / loan.propertyPrice) * 100 : 0;
  const discretionarySurplusBeforeLoan =
    household.monthlyNetIncome - household.essentialLivingExpenses - (household.existingDebtPayments || 0);
  const upfrontCosts = loan.downPayment + (household.transactionCosts || 0) + (household.initialSetupCosts || 0);
  const remainingCashAfterClosing = household.liquidSavings - upfrontCosts;

  return (
    <SimulationContext.Provider
      value={{
        loan,
        household,
        stress,
        activePreset,
        loanInput: loan,
        householdInput: household,
        stressScenario: stress,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        isStepComplete,
        step1Validation,
        step2Validation,
        step3Validation,
        updateLoan,
        setLoanInput: updateLoan,
        updateHousehold,
        setHouseholdInput: updateHousehold,
        updateStress,
        setStressScenario: updateStress,
        applyPreset,
        resetStressScenario,
        resetScenario,
        resetSimulation: resetScenario,
        loadGoldenFixture,
        applySafeLoanLever,
        applySafeEquityLever,
        simulationResult,
        activeResult: simulationResult,
        baseResult,
        solverResult,
        hasSimulated,
        isSimulated: hasSimulated,
        setHasSimulated,
        equityRatioPercent,
        loanToValuePercent,
        discretionarySurplusBeforeLoan,
        remainingCashAfterClosing,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
