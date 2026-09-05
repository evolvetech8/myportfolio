-- ==============================================================================
-- ARCHONIC A-SỔ 14-DAY TRIAL MVP MIGRATION
-- Circular 88/2021/TT-BTC Automated S1-HKD Ledger & Open Banking Sync
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MERCHANTS (14-Day Free Trial Profiles)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    store_name VARCHAR(255) DEFAULT 'Cơ sở kinh doanh mới',
    bank_name VARCHAR(100),
    bank_code VARCHAR(50),
    account_number VARCHAR(50),
    account_name VARCHAR(255),
    trial_started_at TIMESTAMPTZ DEFAULT NOW(),
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    is_pro_upgraded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRANSACTIONS (Raw Open Banking / Webhook Ingestion)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    reference_no VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    bank_brand VARCHAR(50),
    gateway VARCHAR(50) DEFAULT 'vietqr_sepay', -- 'casso' | 'sepay' | 'vietqr_mock'
    content TEXT,
    sender_account VARCHAR(100),
    transaction_time TIMESTAMPTZ DEFAULT NOW(),
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. S1-HKD LEDGER (Circular 88/2021/TT-BTC Mandatory Revenue Book)
CREATE TABLE IF NOT EXISTS public.ledger_s1_hkd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    voucher_date DATE NOT NULL DEFAULT CURRENT_DATE,
    voucher_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'retail_sales', -- 'Bán lẻ'
    retail_revenue NUMERIC(15, 2) DEFAULT 0,
    services_revenue NUMERIC(15, 2) DEFAULT 0,
    other_revenue NUMERIC(15, 2) DEFAULT 0,
    tax_reconciliation_status VARCHAR(50) DEFAULT 'MATCHED_100',
    circular_standard VARCHAR(50) DEFAULT 'TT88/2021/TT-BTC',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTOMATED CATEGORIZATION DATABASE TRIGGER (< 20M VND -> S1-HKD Retail Sales)
CREATE OR REPLACE FUNCTION public.fn_auto_categorize_s1_ledger()
RETURNS TRIGGER AS $$
DECLARE
    v_voucher_num VARCHAR(50);
BEGIN
    -- Format official voucher number: VQR-<ref_prefix>
    v_voucher_num := 'VQR-' || COALESCE(SUBSTRING(NEW.reference_no FROM 1 FOR 8), TO_CHAR(NOW(), 'YYMMDDHH24MI'));

    -- Automatic categorization rule:
    -- Incoming transfer under 20,000,000 VND is categorized as retail goods sale (Bán lẻ)
    IF NEW.amount < 20000000 THEN
        INSERT INTO public.ledger_s1_hkd (
            merchant_id,
            transaction_id,
            voucher_date,
            voucher_number,
            description,
            category,
            retail_revenue,
            services_revenue,
            other_revenue,
            tax_reconciliation_status,
            circular_standard
        ) VALUES (
            NEW.merchant_id,
            NEW.id,
            CURRENT_DATE,
            v_voucher_num,
            COALESCE(NEW.content, 'Doanh thu bán lẻ quét mã VietQR tự động ghi sổ'),
            'retail_sales',
            NEW.amount,
            0,
            0,
            'MATCHED_100',
            'TT88/2021/TT-BTC'
        );
    ELSE
        -- Over 20M transfers require merchant manual review (anti-money-laundering / invoice threshold)
        INSERT INTO public.ledger_s1_hkd (
            merchant_id,
            transaction_id,
            voucher_date,
            voucher_number,
            description,
            category,
            retail_revenue,
            services_revenue,
            other_revenue,
            tax_reconciliation_status,
            circular_standard
        ) VALUES (
            NEW.merchant_id,
            NEW.id,
            CURRENT_DATE,
            v_voucher_num,
            COALESCE(NEW.content, 'Giao dịch trên 20 triệu - Cần đính kèm HĐĐT Nghị định 123'),
            'high_value_review',
            NEW.amount,
            0,
            0,
            'PENDING_INVOICE_ND123',
            'TT88/2021/TT-BTC'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_categorize_s1 ON public.transactions;
CREATE TRIGGER trg_auto_categorize_s1
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.fn_auto_categorize_s1_ledger();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_s1_hkd ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants view own profile"
    ON public.merchants FOR SELECT
    USING (auth.uid() = id OR auth.jwt() ->> 'phone' = phone);

CREATE POLICY "Merchants view own transactions"
    ON public.transactions FOR SELECT
    USING (merchant_id = auth.uid());

CREATE POLICY "Merchants view own S1 ledger"
    ON public.ledger_s1_hkd FOR SELECT
    USING (merchant_id = auth.uid());

-- 6. ENABLE SUPABASE REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions, public.ledger_s1_hkd;
