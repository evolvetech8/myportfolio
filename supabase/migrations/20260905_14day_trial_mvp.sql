-- ==============================================================================
-- ARCHONIC A-SỔ 14-DAY TRIAL MVP MIGRATION (V2 - COMPLIANCE PATCHED)
-- Circular 88/2021/TT-BTC Automated S1-HKD Ledger & Open Banking Sync
-- Patched: Manual Edit/Ignore Override & Internal Transfer Exclusion
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
    gateway VARCHAR(50) DEFAULT 'vietqr_sepay',
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
    category VARCHAR(50) DEFAULT 'retail_sales', -- 'retail_sales' | 'internal_transfer' | 'manual_excluded'
    is_taxable BOOLEAN DEFAULT TRUE,             -- Flag for tax compliance calculations
    override_reason TEXT,                        -- Merchant override justification
    retail_revenue NUMERIC(15, 2) DEFAULT 0,
    services_revenue NUMERIC(15, 2) DEFAULT 0,
    other_revenue NUMERIC(15, 2) DEFAULT 0,
    tax_reconciliation_status VARCHAR(50) DEFAULT 'MATCHED_100',
    circular_standard VARCHAR(50) DEFAULT 'TT88/2021/TT-BTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTOMATED CATEGORIZATION TRIGGER WITH SMART INTERNAL TRANSFER DETECTION
CREATE OR REPLACE FUNCTION public.fn_auto_categorize_s1_ledger()
RETURNS TRIGGER AS $$
DECLARE
    v_voucher_num VARCHAR(50);
    v_content_lower TEXT;
    v_is_internal BOOLEAN := FALSE;
BEGIN
    v_voucher_num := 'VQR-' || COALESCE(SUBSTRING(NEW.reference_no FROM 1 FOR 8), TO_CHAR(NOW(), 'YYMMDDHH24MI'));
    v_content_lower := LOWER(COALESCE(NEW.content, ''));

    -- Check for internal money transfers / non-sales keywords (e.g. personal deposit, repairs, loan)
    IF v_content_lower ~* '(noi bo|chuyen khoan noi bo|rut tien|nop tien|vay|tra no|hoan tien|sua chua|von chu so huu|nap tien|chuyen tien cho)' THEN
        v_is_internal := TRUE;
    END IF;

    -- If detected as internal transfer, DO NOT log as taxable retail revenue!
    IF v_is_internal THEN
        INSERT INTO public.ledger_s1_hkd (
            merchant_id,
            transaction_id,
            voucher_date,
            voucher_number,
            description,
            category,
            is_taxable,
            override_reason,
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
            '[DÒNG TIỀN NỘI BỘ - KHÔNG TÍNH THUẾ] ' || COALESCE(NEW.content, 'Chuyển tiền nội bộ'),
            'internal_transfer',
            FALSE,
            'Phát hiện từ khóa dòng tiền nội bộ (Không phải doanh thu bán lẻ)',
            0,
            0,
            0,
            'EXCLUDED_NON_TAXABLE',
            'TT88/2021/TT-BTC'
        );
    ELSIF NEW.amount < 20000000 THEN
        -- Retail sale under 20M VND
        INSERT INTO public.ledger_s1_hkd (
            merchant_id,
            transaction_id,
            voucher_date,
            voucher_number,
            description,
            category,
            is_taxable,
            override_reason,
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
            TRUE,
            NULL,
            NEW.amount,
            0,
            0,
            'MATCHED_100',
            'TT88/2021/TT-BTC'
        );
    ELSE
        -- Large transaction >= 20M VND requires invoice attachment
        INSERT INTO public.ledger_s1_hkd (
            merchant_id,
            transaction_id,
            voucher_date,
            voucher_number,
            description,
            category,
            is_taxable,
            override_reason,
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
            TRUE,
            'Giá trị giao dịch >= 20.000.000đ, cần kiểm tra HĐĐT',
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

-- 5. FUNCTION TO ALLOW MERCHANT INLINE MANUAL OVERRIDE
CREATE OR REPLACE FUNCTION public.fn_override_s1_entry(
    p_entry_id UUID,
    p_is_taxable BOOLEAN,
    p_category VARCHAR(50),
    p_reason TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ledger_s1_hkd
    SET 
        is_taxable = p_is_taxable,
        category = p_category,
        override_reason = p_reason,
        retail_revenue = CASE WHEN p_is_taxable THEN (SELECT amount FROM public.transactions WHERE id = transaction_id) ELSE 0 END,
        tax_reconciliation_status = CASE WHEN p_is_taxable THEN 'MATCHED_100' ELSE 'EXCLUDED_NON_TAXABLE' END,
        updated_at = NOW()
    WHERE id = p_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY & REALTIME
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

ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions, public.ledger_s1_hkd;
