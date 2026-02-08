-- Users table (PostgreSQL)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'company', 'admin', 'moderator', 'mentor')),
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trust Score History
CREATE TABLE IF NOT EXISTS trust_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Escrow Transactions
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(255) NOT NULL,
  student_id VARCHAR(255),
  internship_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'held', 'released', 'refunded', 'disputed')),
  payment_gateway_id VARCHAR(255),
  deposited_at TIMESTAMP,
  released_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(255) NOT NULL,
  company_id VARCHAR(255) NOT NULL,
  internship_id VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'under_review', 'resolved', 'escalated', 'closed')),
  resolution TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scam Reports
CREATE TABLE IF NOT EXISTS scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id VARCHAR(255) NOT NULL,
  company_id VARCHAR(255),
  internship_id VARCHAR(255),
  report_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'verified', 'false_positive', 'actioned')),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Tracking
CREATE TABLE IF NOT EXISTS payment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(255) NOT NULL,
  company_id VARCHAR(255) NOT NULL,
  internship_id VARCHAR(255) NOT NULL,
  expected_amount DECIMAL(10, 2) NOT NULL,
  expected_date DATE NOT NULL,
  actual_amount DECIMAL(10, 2),
  actual_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'on_time', 'delayed', 'unpaid', 'disputed')),
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_escrow_status ON escrow_transactions(status);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_scam_reports_status ON scam_reports(status);
CREATE INDEX idx_payment_tracking_status ON payment_tracking(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
