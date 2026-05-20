-- O2 QA Command Center - Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  repository_url TEXT,
  live_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  icon TEXT DEFAULT 'Box',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ENVIRONMENTS
-- ============================================================
CREATE TABLE environments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'cloud' CHECK (type IN ('local', 'cloud')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TEAM MEMBERS (linked to Supabase Auth)
-- ============================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'tester' CHECK (role IN ('lead', 'tester', 'developer')),
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TEST SUITES
-- ============================================================
CREATE TABLE test_suites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  suite_type TEXT NOT NULL CHECK (suite_type IN (
    'smoke', 'unit', 'state', 'ui_rendering', 'ui_interactions',
    'api', 'integration', 'performance', 'security', 'data_pipeline', 'cross_browser'
  )),
  parent_id UUID REFERENCES test_suites(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  environment_id UUID REFERENCES environments(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TEST PLANS
-- ============================================================
CREATE TABLE test_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  environment_id UUID REFERENCES environments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
  last_run_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_plan_suites (
  plan_id UUID REFERENCES test_plans(id) ON DELETE CASCADE,
  suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, suite_id)
);

CREATE TABLE test_plan_testers (
  plan_id UUID REFERENCES test_plans(id) ON DELETE CASCADE,
  tester_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, tester_id)
);

-- ============================================================
-- TEST CASES
-- ============================================================
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'manual' CHECK (type IN ('manual', 'automated')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'not_run' CHECK (status IN ('pass', 'fail', 'blocked', 'skip', 'not_run', 'running')),
  suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
  automation_status TEXT NOT NULL DEFAULT 'manual' CHECK (automation_status IN ('automated', 'manual', 'planned')),
  preconditions TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  last_run_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  action TEXT NOT NULL,
  expected_result TEXT NOT NULL,
  UNIQUE(test_case_id, step_number)
);

-- ============================================================
-- TEST RUNS
-- ============================================================
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  plan_id UUID REFERENCES test_plans(id) ON DELETE SET NULL,
  suite_id UUID REFERENCES test_suites(id) ON DELETE SET NULL,
  tester_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration INTERVAL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'aborted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID REFERENCES test_runs(id) ON DELETE CASCADE,
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_run' CHECK (status IN ('pass', 'fail', 'blocked', 'skip', 'not_run', 'running')),
  actual_results TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(run_id, test_case_id)
);

CREATE TABLE execution_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES test_executions(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  status TEXT CHECK (status IN ('pass', 'fail', 'blocked', 'skip', 'not_run')),
  actual_result TEXT,
  UNIQUE(execution_id, step_number)
);

-- ============================================================
-- DEFECTS
-- ============================================================
CREATE TABLE defects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'verified', 'closed')),
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  environment TEXT,
  browser TEXT,
  assignee_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE defect_test_cases (
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  PRIMARY KEY (defect_id, test_case_id)
);

-- ============================================================
-- ACTIVITY LOG (auto-populated via triggers)
-- ============================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  item_id UUID,
  item_type TEXT CHECK (item_type IN ('test_case', 'test_run', 'defect', 'test_plan', 'test_suite', 'product', 'environment', 'team_member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ATTACHMENTS
-- ============================================================
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('defect', 'test_case', 'test_execution')),
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_test_cases_suite ON test_cases(suite_id);
CREATE INDEX idx_test_cases_status ON test_cases(status);
CREATE INDEX idx_test_cases_priority ON test_cases(priority);
CREATE INDEX idx_test_executions_run ON test_executions(run_id);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_severity ON defects(severity);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_item ON activity_log(item_id);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_environments_updated BEFORE UPDATE ON environments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_team_members_updated BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_test_suites_updated BEFORE UPDATE ON test_suites FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_test_plans_updated BEFORE UPDATE ON test_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_test_cases_updated BEFORE UPDATE ON test_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_defects_updated BEFORE UPDATE ON defects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (enable after setting up auth)
-- ============================================================
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_suites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_executions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
