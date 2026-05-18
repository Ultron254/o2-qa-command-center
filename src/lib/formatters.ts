// ============================================================
// O2 QA Command Center — Formatters & Utilities
// ============================================================

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

/**
 * Format a percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
}

/**
 * Generate a unique ID with prefix
 */
export function generateId(prefix: string): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${num}`;
}

/**
 * Get pass rate color class based on percentage
 */
export function getPassRateColor(rate: number): string {
  if (rate >= 90) return 'text-status-pass';
  if (rate >= 70) return 'text-status-blocked';
  return 'text-status-fail';
}

/**
 * Get pass rate background class
 */
export function getPassRateBgColor(rate: number): string {
  if (rate >= 90) return 'bg-status-pass/10';
  if (rate >= 70) return 'bg-status-blocked/10';
  return 'bg-status-fail/10';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Calculate pass rate from status counts
 */
export function calculatePassRate(
  passed: number,
  total: number
): number {
  if (total === 0) return 0;
  return (passed / total) * 100;
}
