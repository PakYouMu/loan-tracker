// 1. 
// -- =================================================================
// -- 01_schema.sql - The Gold Standard (Fresh Installation)
// -- =================================================================
// -- This script defines the ideal final state of all tables.
// -- It should be run on a fresh database installation.
// -- =================================================================

// -- Create custom enum type for roles
// DO $$ BEGIN
//     CREATE TYPE app_role AS ENUM ('admin', 'member', 'viewer');
// EXCEPTION
//     WHEN duplicate_object THEN null;
// END $$;

//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'borrowers' 
//         AND column_name = 'fund_id'
//     ) THEN
//         ALTER TABLE public.borrowers 
//         ADD COLUMN fund_id uuid REFERENCES public.funds(id) ON DELETE CASCADE;
//     END IF;

//     -- =================================================================
//     -- LOANS TABLE MIGRATIONS
//     -- =================================================================
    
//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'loans' 
//         AND column_name = 'fund_id'
//     ) THEN
//         ALTER TABLE public.loans 
//         ADD COLUMN fund_id uuid REFERENCES public.funds(id) ON DELETE CASCADE;
//     END IF;

//     -- =================================================================
//     -- PAYMENTS TABLE MIGRATIONS
//     -- =================================================================


//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'payments' 
//         AND column_name = 'notes'
//     ) THEN
//         ALTER TABLE public.payments ADD COLUMN notes text;
//     END IF;

//     -- =================================================================
//     -- LEDGER TABLE MIGRATIONS
//     -- =================================================================
    
//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'ledger' 
//         AND column_name = 'fund_id'
//     ) THEN
//         ALTER TABLE public.ledger 
//         ADD COLUMN fund_id uuid REFERENCES public.funds(id) ON DELETE CASCADE;
//     END IF;

//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'ledger' 
//         AND column_name = 'transaction_date'
//     ) THEN
//         ALTER TABLE public.ledger 
//         ADD COLUMN transaction_date timestamptz DEFAULT now();
//     END IF;

//     -- =================================================================
//     -- AUDIT_LOGS TABLE MIGRATIONS
//     -- =================================================================
    
//     IF NOT EXISTS (
//         SELECT 1 FROM information_schema.columns 
//         WHERE table_schema = 'public' 
//         AND table_name = 'audit_logs' 
//         AND column_name = 'fund_id'
//     ) THEN
//         ALTER TABLE public.audit_logs 
//         ADD COLUMN fund_id uuid REFERENCES public.funds(id) ON DELETE CASCADE;
//     END IF;

// END $$;

// 3.
// -- =================================================================
// -- 03_logic.sql - Business Logic (Functions & Triggers)
// -- =================================================================
// -- Contains all business logic, functions, and triggers.
// -- Safe to run multiple times (uses CREATE OR REPLACE).
// -- =================================================================

// -- =================================================================
// -- FUNCTION: Handle New Loan Creation
// -- =================================================================
// -- CRITICAL FIX: Explicitly inserts fund_id into ledger
// CREATE OR REPLACE FUNCTION public.handle_new_loan()
// RETURNS TRIGGER AS $$
// BEGIN
//   INSERT INTO public.ledger (
//     amount, 
//     category, 
//     loan_id, 
//     notes, 
//     transaction_date, 
//     fund_id
//   )
//   VALUES (
//     -new.principal,
//     'LOAN_DISBURSEMENT', 
//     new.id,
//     'Disbursement for Loan ' || new.id,
//     new.start_date,
//     new.fund_id  -- CRITICAL: Explicitly pass fund_id
//   );
//   RETURN new;
// END;
// $$ LANGUAGE plpgsql SECURITY DEFINER;

// -- =================================================================
// -- OPERATIONAL TABLES POLICIES (Scoped by Fund Access)
// -- =================================================================
// CREATE POLICY "Fund Member Access Borrowers" 
// ON public.borrowers 
// FOR ALL 
// USING (public.has_fund_access(fund_id));

// CREATE POLICY "Fund Member Access Loans" 
// ON public.loans 
// FOR ALL 
// USING (public.has_fund_access(fund_id));

// CREATE POLICY "Fund Member Access Payments" 
// ON public.payments 
// FOR ALL 
// USING (public.has_fund_access(fund_id));

// CREATE POLICY "Fund Member Access Ledger" 
// ON public.ledger 
// FOR ALL 
// USING (public.has_fund_access(fund_id));

// CREATE POLICY "Fund Member Access Schedule" 
// ON public.payment_schedule 
// FOR ALL 
// USING (
//   EXISTS (
//     SELECT 1 FROM public.loans 
//     WHERE id = payment_schedule.loan_id 
//     AND public.has_fund_access(loans.fund_id)
//   )
// );

// CREATE POLICY "Fund Member Access Audit" 
// ON public.audit_logs 
// FOR ALL 
// USING (public.has_fund_access(fund_id));


// 6. 
// -- =================================================================
// -- 06_data_init.sql - Data Backfilling & Initialization
// -- =================================================================
// -- Handles initial data setup and backfills missing data.
// -- Safe to run multiple times (idempotent).
// -- =================================================================

// -- =================================================================
// -- STEP 1: Promote All Existing Users to Superuser
// -- =================================================================
// -- This ensures existing users maintain full access
// UPDATE public.profiles 
// SET role = 'superuser'
// WHERE role IS NULL OR role != 'superuser';

// -- =================================================================
// -- STEP 2: Create "General Fund" if Missing
// -- =================================================================
// DO $$
// DECLARE
//   v_owner_id uuid;
//   v_fund_id uuid;
// BEGIN
//   -- Get the first available user as the owner
//   SELECT id INTO v_owner_id FROM auth.users LIMIT 1;

// -- =================================================================
// -- STEP 6: Backfill Missing Transaction Dates in Ledger
// -- =================================================================
// -- Fix Loan Disbursements (use loan start_date)
// UPDATE public.ledger
// SET transaction_date = loans.start_date
// FROM public.loans
// WHERE ledger.loan_id = loans.id
//   AND ledger.category = 'LOAN_DISBURSEMENT'
//   AND ledger.transaction_date IS NULL;

// -- Funds Table
// CREATE INDEX IF NOT EXISTS idx_funds_owner_id 
// ON public.funds(owner_id);

// CREATE INDEX IF NOT EXISTS idx_payments_created_at 
// ON public.payments(created_at);

// CREATE INDEX IF NOT EXISTS idx_payments_payment_date 
// ON public.payments(payment_date);

// CREATE INDEX IF NOT EXISTS idx_payment_schedule_due_date 
// ON public.payment_schedule(due_date);

// CREATE INDEX IF NOT EXISTS idx_ledger_transaction_date 
// ON public.ledger(transaction_date);

// CREATE INDEX IF NOT EXISTS idx_ledger_created_at 
// ON public.ledger(created_at);

// CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
// ON public.audit_logs(created_at);

// -- =================================================================
// -- STATUS/CATEGORY INDEXES (For Filtering)
// -- =================================================================

// CREATE INDEX IF NOT EXISTS idx_payment_schedule_status 
// ON public.payment_schedule(status);

// CREATE INDEX IF NOT EXISTS idx_ledger_category 
// ON public.ledger(category);

// CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
// ON public.audit_logs(action);

// CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name 
// ON public.audit_logs(table_name);

// CREATE INDEX IF NOT EXISTS idx_loans_fund_active 
// ON public.loans(fund_id, deleted_at);

// CREATE INDEX IF NOT EXISTS idx_payments_fund_active 
// ON public.payments(fund_id, deleted_at);

// -- For ledger queries by fund and date
// CREATE INDEX IF NOT EXISTS idx_ledger_fund_date 
// ON public.ledger(fund_id, transaction_date);

// -- For payment schedule queries
// CREATE INDEX IF NOT EXISTS idx_payment_schedule_loan_status 
// ON public.payment_schedule(loan_id, status);