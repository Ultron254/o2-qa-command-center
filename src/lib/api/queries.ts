/**
 * Supabase query functions for TanStack Query integration.
 * These replace the hardcoded data in data.ts when connected to Supabase.
 * 
 * For now, these are stubs that will be activated once
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.
 */

import { supabase } from '../supabase';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchEnvironments() {
  const { data, error } = await supabase
    .from('environments')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function fetchTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function fetchTestSuites() {
  const { data, error } = await supabase
    .from('test_suites')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function fetchTestPlans() {
  const { data, error } = await supabase
    .from('test_plans')
    .select(`
      *,
      test_plan_suites(suite_id),
      test_plan_testers(tester_id)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchTestCases(filters?: {
  suiteId?: string;
  status?: string;
  priority?: string;
  type?: string;
  search?: string;
}) {
  let query = supabase
    .from('test_cases')
    .select(`
      *,
      test_steps(*)
    `)
    .order('display_id');

  if (filters?.suiteId) query = query.eq('suite_id', filters.suiteId);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.priority) query = query.eq('priority', filters.priority);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,display_id.ilike.%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchTestRuns() {
  const { data, error } = await supabase
    .from('test_runs')
    .select(`
      *,
      test_executions(
        *,
        execution_steps(*)
      )
    `)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchDefects(filters?: {
  severity?: string;
  status?: string;
  priority?: string;
  search?: string;
}) {
  let query = supabase
    .from('defects')
    .select(`
      *,
      defect_test_cases(test_case_id)
    `)
    .order('created_at', { ascending: false });

  if (filters?.severity) query = query.eq('severity', filters.severity);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.priority) query = query.eq('priority', filters.priority);
  if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,display_id.ilike.%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchActivityLog(limit = 20) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function createDefect(defect: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('defects')
    .insert(defect)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDefectById(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('defects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTestCase(testCase: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('test_cases')
    .insert(testCase)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTestRun(run: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('test_runs')
    .insert(run)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExecutionStep(
  executionId: string,
  stepNumber: number,
  updates: { status?: string; actual_result?: string }
) {
  const { data, error } = await supabase
    .from('execution_steps')
    .update(updates)
    .eq('execution_id', executionId)
    .eq('step_number', stepNumber)
    .select()
    .single();
  if (error) throw error;
  return data;
}
