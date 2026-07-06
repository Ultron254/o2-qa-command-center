import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { qaFindings, qaServiceSummaries, qaAuditMeta } from '../src/lib/qa-findings.ts';
import { websiteFindings, websiteSummaries, websiteAuditMeta } from '../src/lib/website-findings.ts';

const here = dirname(fileURLToPath(import.meta.url));

const out = join(here, 'qa-findings.json');
writeFileSync(out, JSON.stringify({ qaAuditMeta, qaServiceSummaries, qaFindings }, null, 2));
console.log(`Wrote ${qaFindings.length} findings to ${out}`);

const webOut = join(here, 'website-findings.json');
writeFileSync(webOut, JSON.stringify({ websiteAuditMeta, websiteSummaries, websiteFindings }, null, 2));
console.log(`Wrote ${websiteFindings.length} website findings to ${webOut}`);
