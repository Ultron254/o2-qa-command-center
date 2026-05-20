/**
 * Notification integrations for Slack/Teams webhooks and email.
 * 
 * These are configured via environment variables:
 * - VITE_SLACK_WEBHOOK_URL: Slack incoming webhook URL
 * - VITE_TEAMS_WEBHOOK_URL: Microsoft Teams webhook URL
 * 
 * For production, notifications should go through Supabase Edge Functions
 * to avoid exposing webhook URLs in the frontend bundle.
 */

const SLACK_WEBHOOK = import.meta.env.VITE_SLACK_WEBHOOK_URL || '';
const TEAMS_WEBHOOK = import.meta.env.VITE_TEAMS_WEBHOOK_URL || '';

interface NotificationPayload {
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'critical';
  url?: string;
}

export async function sendSlackNotification(payload: NotificationPayload): Promise<boolean> {
  if (!SLACK_WEBHOOK) {
    console.warn('[Notifications] Slack webhook not configured');
    return false;
  }

  const color = payload.severity === 'critical' ? '#EF4444' : payload.severity === 'warning' ? '#EAB308' : '#22C55E';

  try {
    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [{
          color,
          title: payload.title,
          text: payload.message,
          footer: 'O2 QA Command Center',
          ts: Math.floor(Date.now() / 1000),
          ...(payload.url ? { title_link: payload.url } : {}),
        }],
      }),
    });
    return true;
  } catch (err) {
    console.error('[Notifications] Slack send failed:', err);
    return false;
  }
}

export async function sendTeamsNotification(payload: NotificationPayload): Promise<boolean> {
  if (!TEAMS_WEBHOOK) {
    console.warn('[Notifications] Teams webhook not configured');
    return false;
  }

  const themeColor = payload.severity === 'critical' ? 'EF4444' : payload.severity === 'warning' ? 'EAB308' : '22C55E';

  try {
    await fetch(TEAMS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor,
        summary: payload.title,
        sections: [{
          activityTitle: payload.title,
          activitySubtitle: 'O2 QA Command Center',
          text: payload.message,
        }],
        ...(payload.url ? {
          potentialAction: [{
            '@type': 'OpenUri',
            name: 'View in QA Center',
            targets: [{ os: 'default', uri: payload.url }],
          }],
        } : {}),
      }),
    });
    return true;
  } catch (err) {
    console.error('[Notifications] Teams send failed:', err);
    return false;
  }
}

export function notifyCriticalDefect(defectId: string, title: string) {
  const payload: NotificationPayload = {
    title: `Critical Defect: ${defectId}`,
    message: title,
    severity: 'critical',
  };
  sendSlackNotification(payload);
  sendTeamsNotification(payload);
}

export function notifyTestRunCompleted(runName: string, passRate: number) {
  const payload: NotificationPayload = {
    title: `Test Run Completed: ${runName}`,
    message: `Pass rate: ${passRate.toFixed(1)}%`,
    severity: passRate < 80 ? 'warning' : 'info',
  };
  sendSlackNotification(payload);
  sendTeamsNotification(payload);
}
