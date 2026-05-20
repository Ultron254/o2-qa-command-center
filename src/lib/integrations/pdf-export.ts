/**
 * PDF Export utility for generating test reports.
 * Uses html2pdf.js to convert report DOM elements to PDF.
 */

export async function exportToPDF(element: HTMLElement, filename: string) {
  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
  };
  return html2pdf().set(opt).from(element).save();
}

export function generateTestRunReport(
  runName: string,
  stats: { total: number; pass: number; fail: number; blocked: number; skip: number },
  cases: { id: string; title: string; status: string }[]
): HTMLElement {
  const div = document.createElement('div');
  div.style.fontFamily = 'Inter, sans-serif';
  div.style.padding = '20px';
  div.style.color = '#111827';

  div.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 20px; font-weight: 700; color: #F97316;">O2 QA Command Center</h1>
      <h2 style="font-size: 16px; color: #4B5563; margin-top: 4px;">Test Run Report: ${runName}</h2>
      <p style="font-size: 12px; color: #9CA3AF;">Generated: ${new Date().toLocaleString()}</p>
    </div>
    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
      <div style="flex: 1; padding: 12px; border-radius: 8px; background: #F0FDF4; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #22C55E;">${stats.pass}</div>
        <div style="font-size: 11px; color: #4B5563;">Passed</div>
      </div>
      <div style="flex: 1; padding: 12px; border-radius: 8px; background: #FEF2F2; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #EF4444;">${stats.fail}</div>
        <div style="font-size: 11px; color: #4B5563;">Failed</div>
      </div>
      <div style="flex: 1; padding: 12px; border-radius: 8px; background: #FEFCE8; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #EAB308;">${stats.blocked}</div>
        <div style="font-size: 11px; color: #4B5563;">Blocked</div>
      </div>
      <div style="flex: 1; padding: 12px; border-radius: 8px; background: #F9FAFB; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #9CA3AF;">${stats.skip}</div>
        <div style="font-size: 11px; color: #4B5563;">Skipped</div>
      </div>
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr style="background: #F9FAFB;">
          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #E5E7EB;">ID</th>
          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #E5E7EB;">Title</th>
          <th style="padding: 8px; text-align: center; border-bottom: 2px solid #E5E7EB;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${cases.map(c => `
          <tr style="border-bottom: 1px solid #F3F4F6;">
            <td style="padding: 6px 8px; font-family: monospace; color: #F97316;">${c.id}</td>
            <td style="padding: 6px 8px;">${c.title}</td>
            <td style="padding: 6px 8px; text-align: center;">
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;
                background: ${c.status === 'pass' ? '#DCFCE7' : c.status === 'fail' ? '#FEE2E2' : c.status === 'blocked' ? '#FEF9C3' : '#F3F4F6'};
                color: ${c.status === 'pass' ? '#166534' : c.status === 'fail' ? '#991B1B' : c.status === 'blocked' ? '#854D0E' : '#6B7280'};">
                ${c.status.toUpperCase()}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  return div;
}
