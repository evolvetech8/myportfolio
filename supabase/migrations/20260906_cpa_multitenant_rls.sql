-- ==============================================================================
-- ARCHONIC A-SO: CPA MULTI-TENANT ENTERPRISE ISOLATION & RLS MIGRATION
-- Circular 152/2025/TT-BTC & Decree 70/2025/ND-CP Compliance
-- Enforcing strict tenant isolation: tenant_id / firm_id at Row Level Security
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FIRMS (Accounting Services / Tax Agents / Dai Ly Thue)
CREATE TABLE IF NOT EXISTS public.firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(20) NOT NULL UNIQUE,
    representative VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'starter' CHECK (plan_tier IN ('trial', 'starter', 'pro_studio', 'enterprise')),
    max_clients INTEGER DEFAULT 15,
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled')),
    subscription_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FIRM MEMBERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- Roles:
--   'firm_owner': full control, billing, add/remove staff, period locks, delete clients
--   'senior_accountant': manage assigned clients, override tax categories, lock accounting periods
--   'junior_accountant': view clients, import bank statements, match receipts, cannot lock periods or change tax regimes
CREATE TABLE IF NOT EXISTS public.firm_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'junior_accountant' CHECK (role IN ('firm_owner', 'senior_accountant', 'junior_accountant')),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (firm_id, user_id)
);

-- 3. HKD CLIENTS (Ho Kinh Doanh)
CREATE TABLE IF NOT EXISTS public.hkd_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    assigned_accountant_id UUID REFERENCES public.firm_members(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(20) NOT NULL,
    representative_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    industry_group VARCHAR(50) NOT NULL CHECK (industry_group IN ('fnb', 'retail', 'services', 'manufacturing')),
    statutory_regime VARCHAR(50) NOT NULL DEFAULT 'group2' CHECK (statutory_regime IN ('group1', 'group2', 'group3')),
    nd70_status VARCHAR(50) DEFAULT 'monitored' CHECK (nd70_status IN ('exempt', 'monitored', 'mandatory_active')),
    annual_revenue_ytd NUMERIC(15, 2) DEFAULT 0,
    estimated_tax_ytd NUMERIC(15, 2) DEFAULT 0,
    unreconciled_tx_count INTEGER DEFAULT 0,
    current_period_locked BOOLEAN DEFAULT FALSE,
    locked_through_quarter VARCHAR(10),
    status VARCHAR(50) DEFAULT 'current' CHECK (status IN ('current', 'needs_review', 'deadline_approaching')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (firm_id, tax_code)
);

-- 4. CLIENT BANK ACCOUNTS (Open Banking & VietQR Connections)
CREATE TABLE IF NOT EXISTS public.client_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.hkd_clients(id) ON DELETE CASCADE,
    bank_brand VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    connection_type VARCHAR(50) DEFAULT 'vietqr_webhook' CHECK (connection_type IN ('vietqr_webhook', 'open_banking_api', 'manual_csv')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (client_id, bank_brand, account_number)
);

-- 5. BANK TRANSACTIONS (Ingested via Webhook or CSV Fallback)
CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.hkd_clients(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES public.client_bank_accounts(id) ON DELETE SET NULL,
    reference_no VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_time TIMESTAMPTZ NOT NULL,
    description TEXT,
    sender_account VARCHAR(100),
    gateway VARCHAR(50) DEFAULT 'vietqr_webhook',
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (client_id, reference_no)
);

-- 6. STATUTORY LEDGER ENTRIES (TT152 S1a / S2a / S2b / S2c / S2d / S2e)
CREATE TABLE IF NOT EXISTS public.statutory_ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.hkd_clients(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.bank_transactions(id) ON DELETE SET NULL,
    voucher_date DATE NOT NULL,
    voucher_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    book_code VARCHAR(20) NOT NULL,
    category VARCHAR(50) DEFAULT 'retail_sales',
    is_taxable BOOLEAN DEFAULT TRUE,
    tax_group VARCHAR(50) DEFAULT 'group2',
    tax_rate NUMERIC(5, 2) DEFAULT 1.5,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    gross_revenue NUMERIC(15, 2) DEFAULT 0,
    deductible_expense NUMERIC(15, 2) DEFAULT 0,
    audit_rule VARCHAR(50) DEFAULT 'RULE-REV-01',
    is_manual_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    overridden_by_user_id UUID REFERENCES auth.users(id),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLIENT PORTAL ACCESS SESSIONS (Passwordless Phone OTP)
CREATE TABLE IF NOT EXISTS public.client_portal_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.hkd_clients(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    otp_expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    session_token VARCHAR(255),
    session_expires_at TIMESTAMPTZ,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. IMMUTABLE AUDIT LOG (Liability Defense for Accountants)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email VARCHAR(100),
    actor_role VARCHAR(50),
    client_id UUID REFERENCES public.hkd_clients(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    previous_data JSONB,
    new_data JSONB,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hkd_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statutory_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.fn_current_user_firm_ids()
RETURNS TABLE(firm_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT fm.firm_id 
    FROM public.firm_members fm 
    WHERE fm.user_id = auth.uid() 
      AND fm.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.fn_current_user_role(p_firm_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    SELECT fm.role INTO v_role
    FROM public.firm_members fm
    WHERE fm.firm_id = p_firm_id 
      AND fm.user_id = auth.uid() 
      AND fm.is_active = TRUE;
    RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Firm members can view own firm profile"
    ON public.firms FOR SELECT
    USING (id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));

CREATE POLICY "Firm owners can update firm profile"
    ON public.firms FOR UPDATE
    USING (public.fn_current_user_role(id) = 'firm_owner');

CREATE POLICY "Accountants can view their firm clients"
    ON public.hkd_clients FOR SELECT
    USING (firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));

CREATE POLICY "Accountants can create clients within their firm limit"
    ON public.hkd_clients FOR INSERT
    WITH CHECK (
        firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids())
        AND (SELECT COUNT(*) FROM public.hkd_clients c WHERE c.firm_id = hkd_clients.firm_id) < 
            (SELECT max_clients FROM public.firms f WHERE f.id = hkd_clients.firm_id)
    );

CREATE POLICY "Senior accountants and owners can update clients"
    ON public.hkd_clients FOR UPDATE
    USING (
        firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids())
        AND public.fn_current_user_role(firm_id) IN ('firm_owner', 'senior_accountant')
    );

CREATE POLICY "Only firm owners can delete clients"
    ON public.hkd_clients FOR DELETE
    USING (
        firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids())
        AND public.fn_current_user_role(firm_id) = 'firm_owner'
    );

CREATE POLICY "Accountants view own firm ledger entries"
    ON public.statutory_ledger_entries FOR SELECT
    USING (firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));

CREATE POLICY "Accountants insert ledger entries"
    ON public.statutory_ledger_entries FOR INSERT
    WITH CHECK (firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));

CREATE POLICY "Accountants update ledger entries (reject if locked)"
    ON public.statutory_ledger_entries FOR UPDATE
    USING (
        firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids())
        AND is_locked = FALSE
    );

CREATE POLICY "Firm members view own firm audit logs"
    ON public.audit_logs FOR SELECT
    USING (firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));

CREATE POLICY "Firm members insert audit records"
    ON public.audit_logs FOR INSERT
    WITH CHECK (firm_id IN (SELECT firm_id FROM public.fn_current_user_firm_ids()));
