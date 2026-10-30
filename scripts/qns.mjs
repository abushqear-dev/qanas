#!/usr/bin/env node
// Qanas state and check tool. Owns qanas/<run>/state.json; checks the mechanical rules of each stage file.
// No dependencies. Usage: node qns.mjs <command> [args]. Run from the folder that holds qanas/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = ['market', 'company', 'individual'];
const GATES = ['brief', 'needs', 'idea', 'vision'];
const STAGE_AFTER_GATE = { brief: 1, needs: 2, idea: 3, vision: 3 };
const CHECK_FOR_GATE = { brief: 'brief', needs: 'research', idea: 'ideas', vision: 'vision' };
const LANES = ['complaints', 'demand', 'teardown', 'change', 'graveyard', 'hiring', 'customer-voice', 'staff-voice',
  'stated-priorities', 'footprint', 'peers-and-change', 'own-words', 'work-footprint', 'audience-voice', 'role-pains',
  'gap-fill', 'ideas-filter'];
const SIGNAL_TYPES = ['review', 'community', 'job-posting', 'freelance-gig', 'issue', 'pricing', 'changelog', 'roadmap',
  'help-page', 'documentation', 'trend', 'news', 'regulation', 'launch', 'post-mortem', 'report', 'filing', 'profile',
  'post', 'talk', 'repo', 'product-page'];
const CLASSES = ['missing', 'workaround', 'broken', 'support-billing', 'other'];
const VOICES = ['first-hand', 'relayed', 'vendor'];
const FEATURE_TYPES = ['pricing', 'help-page', 'documentation', 'changelog', 'roadmap', 'product-page'];
const SENTIMENT_TYPES = ['review', 'community', 'post'];
const HYPE = ['revolutionary', 'seamless', 'cutting-edge', 'powerful', 'game-changing', 'game changing', 'world-class', 'best-in-class'];
const FILTER_FIELDS = ['Free official option', 'Already solved', 'Feature, not product', 'Will anyone pay', 'Moat', 'Cold start', 'Channel', 'Why now'];

// ---------- small helpers ----------

function fail(msg, code = 1) {
  process.stderr.write(msg.endsWith('\n') ? msg : msg + '\n');
  process.exit(code);
}

function today() {
  if (process.env.QNS_TODAY) return process.env.QNS_TODAY;
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function monthIndex(ym) {
  const m = /^(\d{4})-(\d{2})/.exec(ym);
  return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

function root() {
  return path.resolve(process.env.QNS_ROOT || process.cwd());
}

function runsDir(base = root()) {
  return path.join(base, 'qanas');
}

function resolveRun(arg) {
  if (!arg) fail('Name a run: its folder name (e.g. 2026-10-30-de-invoicing) or path.');
  const candidates = [path.resolve(arg), path.join(runsDir(), arg)];
  for (const c of candidates) if (fs.existsSync(path.join(c, 'state.json'))) return c;
  fail(`No Qanas run found at "${arg}". Run "qns.mjs list" to see runs.`);
}

function loadState(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'state.json'), 'utf8'));
}

function saveState(dir, state) {
  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify(state, null, 2) + '\n');
}

function read(dir, file) {
  const p = path.join(dir, file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

// Splits markdown into { heading -> body } for headings of the given level.
function sections(md, level) {
  const out = {};
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'gm');
  const marks = [...md.matchAll(re)];
  marks.forEach((m, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].index : md.length;
    out[m[1].trim()] = md.slice(m.index + m[0].length, end);
  });
  return out;
}

function findSection(md, level, prefix) {
  const s = sections(md, level);
  const key = Object.keys(s).find((k) => k.toLowerCase().startsWith(prefix.toLowerCase()));
  return key === undefined ? null : s[key];
}

function cells(line) {
  const parts = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
  return parts.map((c) => c.trim());
}

// Parses the first markdown table whose header contains every name in `must`. Returns { header, rows } or null.
function table(md, must) {
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].trim().startsWith('|')) continue;
    const header = cells(lines[i]).map((h) => h.toLowerCase());
    if (!must.every((m) => header.some((h) => h.startsWith(m.toLowerCase())))) continue;
    if (!/^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
    const rows = [];
    for (let j = i + 2; j < lines.length && lines[j].trim().startsWith('|'); j++) {
      const c = cells(lines[j]);
      const row = {};
      header.forEach((h, k) => { row[h] = c[k] ?? ''; });
      rows.push(row);
    }
    return { header, rows };
  }
  return null;
}

function col(row, name) {
  const key = Object.keys(row).find((k) => k.startsWith(name.toLowerCase()));
  return key === undefined ? '' : row[key];
}

function placeholders(md) {
  // Template placeholders look like <some words>. HTML tags and autolinks are ignored.
  return [...md.matchAll(/<(?!\/?(?:br|b|i|em|strong|sup|sub|details|summary|a)\b)(?!https?:)[a-z][^<>\n]{2,}>/gi)].map((m) => m[0]);
}

function int(v) {
  const n = Number(String(v).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) && String(v).trim() !== '' ? n : null;
}

function bullets(body) {
  return body ? body.split(/\r?\n/).filter((l) => /^\s*[-*]\s+\S/.test(l)).length : 0;
}

function numbered(body) {
  return body ? body.split(/\r?\n/).filter((l) => /^\s*\d+\.\s+\S/.test(l)).length : 0;
}

// ---------- sources ----------

function parseSources(md) {
  const t = table(md || '', ['id', 'url']);
  return t ? t.rows.filter((r) => /^S-\d+$/.test(col(r, 'id'))) : [];
}

function checkSources(md, report) {
  const now = today();
  const rows = parseSources(md);
  if (!rows.length) report.error('sources.md: no signal table found (a header with ID and URL, rows S-1, S-2, ...).');
  const seen = new Set();
  for (const r of rows) {
    const id = col(r, 'id');
    if (seen.has(id)) report.error(`sources.md: ${id} is defined twice.`);
    seen.add(id);
    if (!/https?:\/\/\S+/.test(col(r, 'url'))) report.error(`sources.md: ${id} has no URL.`);
    const acc = col(r, 'accessed');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(acc)) report.error(`sources.md: ${id} has no ISO access date (YYYY-MM-DD).`);
    else if (acc > now) report.error(`sources.md: ${id} access date ${acc} is in the future.`);
    const content = col(r, 'content');
    if (content && !/^(\d{4}-\d{2}(-\d{2})?|live|unknown)$/.test(content)) report.error(`sources.md: ${id} content date "${content}" must be YYYY-MM, live or unknown.`);
    for (const [field, allowed] of [['lane', LANES], ['type', SIGNAL_TYPES], ['class', CLASSES], ['voice', VOICES]]) {
      const v = col(r, field);
      if (v && !allowed.includes(v)) report.warn(`sources.md: ${id} ${field} "${v}" is not one of: ${allowed.join(', ')}.`);
      if (!v && field !== 'lane') report.error(`sources.md: ${id} has no ${field}.`);
    }
  }
  return rows;
}

// Signals too old to carry a claim. Returns [{id, reason}].
function staleSignals(rows) {
  const now = today();
  const nowM = monthIndex(now);
  const out = [];
  for (const r of rows) {
    const type = col(r, 'type');
    const acc = col(r, 'accessed');
    const content = col(r, 'content');
    if (FEATURE_TYPES.includes(type) && /^\d{4}-\d{2}-\d{2}$/.test(acc) && daysBetween(acc, now) > 90) {
      out.push({ id: col(r, 'id'), reason: `${type} read ${acc}, more than 90 days ago` });
    } else if (FEATURE_TYPES.includes(type) && monthIndex(content) !== null && nowM - monthIndex(content) > 3) {
      out.push({ id: col(r, 'id'), reason: `${type} dated ${content}, more than 90 days old` });
    }
    if (SENTIMENT_TYPES.includes(type) && monthIndex(content) !== null && nowM - monthIndex(content) > 12) {
      out.push({ id: col(r, 'id'), reason: `${type} from ${content}, more than 12 months old` });
    }
  }
  return out;
}

function citedIds(md) {
  return new Set([...md.matchAll(/\bS-\d+\b/g)].map((m) => m[0]));
}

function personalDataHits(md) {
  const hits = [];
  const noUrls = md.replace(/https?:\/\/\S+/g, '');
  for (const m of noUrls.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)) hits.push(`email ${m[0]}`);
  for (const m of noUrls.matchAll(/(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?){2,}\d{3,4}\b/g)) {
    const digits = m[0].replace(/\D/g, '');
    if (digits.length >= 9 && !/^20\d{2}/.test(m[0].trim())) hits.push(`phone-like number ${m[0].trim()}`);
  }
  return hits;
}

// Need score for an idea: the need's opportunity band, +1 for High confidence, -1 for Low, clamped to 1-5.
function expectedNeedScore(opportunity, confidence) {
  let score = 1;
  if (opportunity >= 12) score = 4;
  else if (opportunity >= 8) score = 3;
  if (/^High/.test(confidence)) score += 1;
  if (/^Low/.test(confidence)) score -= 1;
  return Math.max(1, Math.min(5, score));
}

// ---------- stage checks ----------

function makeReport() {
  const errors = [];
  const warnings = [];
  return { errors, warnings, error: (m) => errors.push(m), warn: (m) => warnings.push(m) };
}

const checks = {
  brief(dir, state, report) {
    const md = read(dir, '00-brief.md');
    if (!md) return report.error('00-brief.md is missing.');
    const type = /\*\*Research type:\*\*\s*(\w+)/i.exec(md)?.[1]?.toLowerCase();
    if (!TYPES.includes(type)) report.error('00-brief.md: "Research type" must be exactly one of Market, Company or Individual.');
    else if (type !== state.type) report.error(`00-brief.md says ${type} but state.json says ${state.type}.`);
    const target = /\*\*Target:\*\*\s*(.+)/i.exec(md)?.[1] ?? '';
    if (!target.trim() || placeholders(target).length) report.error('00-brief.md: "Target" is not filled in.');
    const head = md.split(/^## Comparable rule/m)[0].split(/^## Framing/m)[0];
    const ph = placeholders(head);
    if (ph.length) report.error(`00-brief.md: unfilled placeholders: ${ph.slice(0, 5).join(', ')}.`);
  },

  research(dir, state, report) {
    checks.brief(dir, state, report);
    const md = read(dir, '01-value-report.md');
    if (!md) return report.error('01-value-report.md is missing.');
    const srcMd = read(dir, 'sources.md');
    if (!srcMd) return report.error('sources.md is missing.');
    const rows = checkSources(srcMd, report);
    const known = new Set(rows.map((r) => col(r, 'id')));

    const verdict = /\*\*Verdict:\*\*\s*(.+)/.exec(md)?.[1] ?? '';
    if (!verdict.trim() || placeholders(verdict).length) report.error('01-value-report.md: the Verdict line is missing or not filled in.');
    if (state.type === 'individual' && !/^Contains personal data about /m.test(md)) {
      report.error('01-value-report.md: an Individual report must start with "Contains personal data about <name>, from public sources, for <purpose>."');
    }

    const brief = read(dir, '00-brief.md') || '';
    const comp = findSection(brief, 2, 'Comparable rule');
    if (!comp || !/Caught\s+\d+/i.test(comp)) report.error('00-brief.md: the "Comparable rule" section with "Caught <n>, shown <m>" is missing.');
    if (state.type !== 'market' && !findSection(brief, 2, 'Framing')) report.error('00-brief.md: the "Framing" section is missing.');

    const t = table(md, ['id', 'need', 'imp', 'sat', 'opportunity', 'frequency', 'confidence']);
    if (!t) return report.error('01-value-report.md: the Top needs table is missing or its header changed.');
    const needs = t.rows.filter((r) => /^NEED-\d+$/.test(col(r, 'id')));
    if (!needs.length) report.error('01-value-report.md: the Top needs table has no NEED rows.');
    const detail = sections(md, 3);
    for (const r of needs) {
      const id = col(r, 'id');
      const imp = int(col(r, 'imp'));
      const sat = int(col(r, 'sat'));
      const opp = int(col(r, 'opportunity'));
      if (imp === null || imp < 1 || imp > 10) report.error(`${id}: Importance must be 1-10.`);
      if (sat === null || sat < 1 || sat > 10) report.error(`${id}: Satisfaction must be 1-10.`);
      if (imp !== null && sat !== null && opp !== imp + Math.max(imp - sat, 0)) {
        report.error(`${id}: Opportunity is ${opp}, but ${imp} + max(${imp} - ${sat}, 0) = ${imp + Math.max(imp - sat, 0)}.`);
      }
      const freq = col(r, 'frequency').toLowerCase();
      if (!['recurring', 'concentrated'].includes(freq)) report.error(`${id}: Frequency must be recurring or concentrated (isolated clusters stay out of the table).`);
      const conf = col(r, 'confidence');
      if (!/^(High|Medium|Low)/.test(conf)) report.error(`${id}: Confidence must be High, Medium or Low.`);
      if (freq === 'concentrated' && /^(High|Medium)/.test(conf)) report.error(`${id}: a concentrated need is capped at Low confidence.`);
      const key = Object.keys(detail).find((k) => k.startsWith(id + ' ') || k === id);
      if (!key) { report.error(`${id}: no "### ${id} ..." section.`); continue; }
      const body = detail[key];
      const cites = [...citedIds(body)];
      if (!cites.length) report.error(`${id}: its section cites no S-n.`);
      if (/^Low/.test(conf) && !/hypothesis/i.test(body + col(r, 'need'))) report.error(`${id}: Low confidence, so its text must say "hypothesis".`);
      // Only dated (YYYY-MM) or live first-hand signals count toward domains; unknown-dated ones are supporting evidence.
      const firstHand = new Set(cites.map((c) => rows.find((s) => col(s, 'id') === c)).filter((s) => s && col(s, 'voice') === 'first-hand' && /^(\d{4}-\d{2}|live)/.test(col(s, 'content'))).map((s) => col(s, 'domain') || col(s, 'url')));
      if (freq === 'recurring' && firstHand.size < 2) report.error(`${id}: recurring needs first-hand signals from 2+ domains; its section cites ${firstHand.size}.`);
      if (/^(High|Medium)/.test(conf) && firstHand.size < 2) report.error(`${id}: ${conf.split(' ')[0]} confidence needs first-hand signals from 2+ domains.`);
    }
    for (const id of citedIds(md)) if (!known.has(id)) report.error(`01-value-report.md cites ${id}, which is not in sources.md.`);
    for (const s of staleSignals(rows)) if (citedIds(md).has(s.id)) report.warn(`${s.id} is stale (${s.reason}); refresh it or drop it from the needs.`);
    const ph = placeholders(md.replace(/^Confirmed for ideas:.*$/m, ''));
    if (ph.length) report.error(`01-value-report.md: unfilled placeholders: ${ph.slice(0, 5).join(', ')}.`);
    if (state.type === 'individual') for (const f of ['00-brief.md', '01-value-report.md', 'sources.md']) {
      for (const h of personalDataHits(read(dir, f) || '')) report.error(`${f}: possible private contact data (${h}). Remove it.`);
    }
  },

  ideas(dir, state, report) {
    if (!state.gates.needs) report.error('The needs gate is not passed yet.');
    const md = read(dir, '02-ideas.md');
    if (!md) return report.error('02-ideas.md is missing.');
    const vr = read(dir, '01-value-report.md') || '';
    const confirmed = new Set(/^Confirmed for ideas:(.*)$/m.exec(vr)?.[1]?.match(/NEED-\d+/g) ?? []);
    if (!confirmed.size) report.error('01-value-report.md: the "Confirmed for ideas" line lists no NEED ids.');
    const t = table(md, ['rank', 'id', 'idea', 'serves', 'need score', 'gap', 'build', 'reach', 'money', 'total', 'evidence']);
    if (!t) return report.error('02-ideas.md: the Ranking table is missing or its header changed.');
    const rows = t.rows.filter((r) => /^IDEA-\d+$/.test(col(r, 'id')));
    if (!rows.length) {
      if (/^No idea clears the floors\b/m.test(md)) report.warn('02-ideas.md: no idea clears the floors. The idea gate cannot pass; reopen the needs gate for more evidence.');
      else report.error('02-ideas.md: the Ranking table has no IDEA rows. If nothing clears the floors, say so on a line starting "No idea clears the floors".');
    }
    // Expected Need score per need: band of its opportunity, +1 High, -1 Low, clamped 1-5.
    const needTable = table(vr, ['id', 'need', 'opportunity', 'confidence']);
    const expectedNeed = {};
    for (const n of needTable ? needTable.rows : []) {
      const opp = int(col(n, 'opportunity'));
      if (opp === null) continue;
      expectedNeed[col(n, 'id')] = expectedNeedScore(opp, col(n, 'confidence'));
    }
    const detail = sections(md, 3);
    const seenIdeas = new Set();
    let lastTotal = Infinity;
    for (const r of rows) {
      const id = col(r, 'id');
      if (seenIdeas.has(id)) report.error(`${id} is defined twice in the ranking.`);
      seenIdeas.add(id);
      const v = Object.fromEntries(['need score', 'gap', 'build', 'reach', 'money', 'total', 'evidence'].map((k) => [k, int(col(r, k))]));
      for (const k of ['need score', 'gap', 'build', 'reach', 'money']) if (v[k] === null || v[k] < 1 || v[k] > 5) report.error(`${id}: ${k} must be 1-5.`);
      const sum = v['need score'] + v.gap + v.build + v.reach + v.money;
      if (v.total !== sum) report.error(`${id}: Total is ${v.total}, but the axes add up to ${sum}.`);
      const ev = v['need score'] + v.gap + v.money;
      if (v.evidence !== ev) report.error(`${id}: Evidence is ${v.evidence}, but Need score + Gap + Money = ${ev}.`);
      if (v['need score'] < 3 || v.gap < 2 || v.total < 15) report.error(`${id}: below a floor (Need score >= 3, Gap >= 2, total >= 15); move it to "Considered and killed".`);
      if (v.total > lastTotal) report.error(`${id}: the ranking is not sorted by total.`);
      lastTotal = v.total;
      const serves = col(r, 'serves').match(/NEED-\d+/g) ?? [];
      if (!serves.length) report.error(`${id}: "Serves" names no NEED.`);
      else {
        const exp = Math.max(...serves.map((n) => expectedNeed[n] ?? 0));
        if (exp && v['need score'] !== exp) report.error(`${id}: Need score is ${v['need score']}, but the formula (opportunity band, +1 High, -1 Low) gives ${exp} for ${serves.join('+')}. A waiver is not allowed; fix the score or reopen the needs gate.`);
      }
      for (const n of serves) if (!confirmed.has(n)) report.error(`${id}: serves ${n}, which was not confirmed for ideas.`);
      const key = Object.keys(detail).find((k) => k.startsWith(id + ' ') || k === id);
      if (!key) { report.error(`${id}: no "### ${id} ..." section.`); continue; }
      const body = detail[key];
      for (const f of FILTER_FIELDS) if (!new RegExp(`\\*\\*${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\*\\*\\s*\\S`).test(body)) report.error(`${id}: the "${f}" answer is missing.`);
      for (const f of ['The wedge', 'Who pays and how much', 'Riskiest assumption', 'Cheapest test']) {
        if (!body.includes(`**${f}`)) report.error(`${id}: "${f}" is missing.`);
      }
      if (!citedIds(body).size) report.error(`${id}: cites no S-n.`);
    }
    const killed = findSection(md, 2, 'Considered and killed');
    if (!bullets(killed)) report.error('02-ideas.md: the "Considered and killed" list is empty.');
    const known = new Set(parseSources(read(dir, 'sources.md') || '').map((r) => col(r, 'id')));
    for (const id of citedIds(md)) if (!known.has(id)) report.error(`02-ideas.md cites ${id}, which is not in sources.md.`);
    const ph = placeholders(md);
    if (ph.length) report.error(`02-ideas.md: unfilled placeholders: ${ph.slice(0, 5).join(', ')}.`);
  },

  vision(dir, state, report) {
    if (!state.gates.idea) report.error('The idea gate is not passed yet.');
    const md = read(dir, '03-vision.md');
    if (!md) return report.error('03-vision.md is missing.');
    for (const h of ['Who it is for', 'The problem', 'What it must do', 'Out of scope', 'Hard constraints', 'Suggested Itqan scale', 'Appendix A', 'Appendix B']) {
      const body = findSection(md, 2, h);
      if (!body || !body.trim()) report.error(`03-vision.md: "## ${h}" is missing or empty.`);
    }
    const must = findSection(md, 2, 'What it must do');
    if (must && numbered(must.split(/\*\*Later/)[0]) !== 3) report.error(`03-vision.md: "What it must do" must list exactly 3 numbered capabilities (found ${numbered(must.split(/\*\*Later/)[0])}).`);
    if (bullets(findSection(md, 2, 'Out of scope')) < 3) report.error('03-vision.md: "Out of scope" needs at least 3 bullets.');
    if (!/PER-\d+/.test(findSection(md, 2, 'Who it is for') || '')) report.error('03-vision.md: "Who it is for" has no PER-n.');
    if (!/JOB-\d+[^\n]*Outcome:/.test(findSection(md, 2, 'The problem') || '')) report.error('03-vision.md: "The problem" needs a JOB-n line with an Outcome.');
    const scale = findSection(md, 2, 'Suggested Itqan scale') || '';
    if (!/(Prototype|Demo|MVP|Full product)/.test(scale)) report.error('03-vision.md: the suggested scale must be Prototype, Demo, MVP or Full product.');
    if (!/Discovery/i.test(scale)) report.warn('03-vision.md: the scale section should say whether Itqan Discovery runs at that scale.');
    if (/\bS-\d+\b/.test(md)) report.error('03-vision.md: replace S-n references with URLs and access dates; the Vision must stand alone.');
    const now = today();
    for (const line of md.split(/\r?\n/)) {
      for (const m of line.matchAll(/https?:\/\/[^\s),|]+/g)) {
        const url = m[0].replace(/[.;:]+$/, '');
        const date = /\b(\d{4}-\d{2}-\d{2})\b/.exec(line)?.[1];
        if (!date) report.error(`03-vision.md: ${url} has no ISO access date (YYYY-MM-DD) on the same line.`);
        else if (date > now) report.error(`03-vision.md: ${url} has an access date in the future.`);
      }
    }
    const apx = findSection(md, 2, 'Appendix A') || '';
    const comps = table(apx, ['id', 'name', 'level', 'url', 'accessed']);
    const compRows = comps ? comps.rows.filter((r) => /^COMP-\d+$/.test(col(r, 'id'))) : [];
    if (!compRows.length) report.error('03-vision.md: Appendix A has no competitor table with COMP rows.');
    const seenComp = new Set();
    for (const r of compRows) {
      const cid = col(r, 'id');
      if (seenComp.has(cid)) report.error(`03-vision.md: ${cid} is defined twice in the competitor table.`);
      seenComp.add(cid);
      if (!['direct', 'indirect', 'adjacent', 'substitute'].includes(col(r, 'level').toLowerCase())) report.error(`03-vision.md: ${cid} level must be direct, indirect, adjacent or substitute.`);
    }
    const fm = table(apx, ['feature', 'kano']);
    if (!fm) report.error('03-vision.md: Appendix A has no feature matrix (Feature | Kano | COMP-... | Table stakes).');
    else {
      const compCols = fm.header.filter((h) => /^comp-\d+/.test(h));
      const stakesCol = fm.header.find((h) => h.startsWith('table stakes'));
      if (!compCols.length || !stakesCol) report.error('03-vision.md: the feature matrix needs COMP-n columns and a "Table stakes" column.');
      for (const r of fm.rows) {
        const feature = col(r, 'feature');
        if (!['must-be', 'performance', 'attractive'].includes(col(r, 'kano').toLowerCase())) report.error(`03-vision.md: feature "${feature}" Kano must be must-be, performance or attractive.`);
        let present = 0;
        for (const c of compCols) {
          const cell = r[c] || '';
          if (!/^(Strong|Adequate|Weak|Absent)\b/.test(cell)) report.error(`03-vision.md: feature "${feature}", ${c.toUpperCase()}: rating must be Strong, Adequate, Weak or Absent.`);
          if (!/https?:\/\//.test(cell) || !/\d{4}-\d{2}-\d{2}/.test(cell)) report.error(`03-vision.md: feature "${feature}", ${c.toUpperCase()}: the cell needs a URL and access date.`);
          if (!/^Absent\b/.test(cell)) present++;
        }
        if (compCols.length && stakesCol) {
          const expected = present / compCols.length >= 0.6 ? 'yes' : 'no';
          const got = (r[stakesCol] || '').toLowerCase().startsWith('yes') ? 'yes' : 'no';
          if (got !== expected) report.error(`03-vision.md: feature "${feature}" is present in ${present}/${compCols.length} competitors, so Table stakes should be "${expected}".`);
        }
      }
    }
    for (const w of HYPE) if (new RegExp(`\\b${w}\\b`, 'i').test(md)) report.error(`03-vision.md: remove the hype word "${w}".`);
    const ph = placeholders(md);
    if (ph.length) report.error(`03-vision.md: unfilled placeholders: ${ph.slice(0, 5).join(', ')}.`);
    if (state.type === 'individual') for (const h of personalDataHits(md)) report.error(`03-vision.md: possible private contact data (${h}).`);
  },
};

function runCheck(dir, stage) {
  const state = loadState(dir);
  const report = makeReport();
  checks[stage](dir, state, report);
  return report;
}

function printReport(name, report) {
  for (const e of report.errors) console.log(`ERROR  ${e}`);
  for (const w of report.warnings) console.log(`WARN   ${w}`);
  console.log(report.errors.length ? `${name}: ${report.errors.length} error(s), ${report.warnings.length} warning(s).` : `${name}: passed${report.warnings.length ? ` with ${report.warnings.length} warning(s)` : ''}.`);
}

// ---------- write gate (hooks) ----------

// Why writing `target` is not allowed now, or null when it is.
export function writeBlock(target) {
  const norm = target.replace(/\\/g, '/');
  const m = /^(.*\/qanas\/[^/]+)\/([^/]+)$/.exec(norm);
  if (!m) return null;
  const native = process.platform === 'win32' ? m[1].replace(/^\/([a-z])\//i, '$1:/') : m[1];
  const stateFile = path.join(native, 'state.json');
  if (!fs.existsSync(stateFile)) return null;
  const file = m[2];
  if (file === 'state.json') return 'Qanas: state.json is owned by qns.mjs. Use its commands (gate, reopen, handoff) instead of editing it.';
  let state;
  try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch { return null; }
  const g = state.gates || {};
  const rules = {
    '00-brief.md': { lockedBy: 'needs' },
    '01-value-report.md': { needs: 'brief', lockedBy: 'needs' },
    'sources.md': { needs: 'brief', lockedBy: 'idea' },
    '02-ideas.md': { needs: 'needs', lockedBy: 'idea' },
    '03-vision.md': { needs: 'idea', lockedBy: 'vision' },
  }[file];
  if (!rules) return null;
  if (rules.needs && !g[rules.needs]) return `Qanas: ${file} cannot be written before the "${rules.needs}" gate is passed. Finish the earlier stage first.`;
  if (g[rules.lockedBy]) return `Qanas: ${file} is locked because the "${rules.lockedBy}" gate is passed. If the user wants to change it, run "qns.mjs reopen <run> ${rules.lockedBy}" after they agree.`;
  return null;
}

function hookInput() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8')); } catch { process.exit(0); }
}

// ---------- commands ----------

const commands = {
  new(type, slug, ...targetWords) {
    const t = (type || '').toLowerCase();
    if (!TYPES.includes(t)) fail(`Type must be one of: ${TYPES.join(', ')}.`);
    if (!/^[a-z0-9]+(-[a-z0-9]+){0,5}$/.test(slug || '')) fail('Slug must be 1-6 lowercase words joined by hyphens.');
    const target = targetWords.join(' ').trim();
    if (!target) fail('Give the target, e.g. qns.mjs new market de-invoicing "B2B invoicing for freelancers in Germany".');
    const run = `${today()}-${slug}`;
    const dir = path.join(runsDir(), run);
    if (fs.existsSync(dir)) fail(`Run ${run} already exists.`);
    fs.mkdirSync(dir, { recursive: true });
    saveState(dir, { run, type: t, target, stage: 0, gates: { brief: null, needs: null, idea: null, vision: null }, picked: null, handoff: null, created: today() });
    console.log(dir);
  },

  list() {
    const base = runsDir();
    const runs = fs.existsSync(base) ? fs.readdirSync(base).filter((d) => fs.existsSync(path.join(base, d, 'state.json'))).sort() : [];
    if (!runs.length) return console.log('No Qanas runs here.');
    for (const r of runs) {
      const s = loadState(path.join(base, r));
      const names = ['brief', 'research', 'ideas', 'vision'];
      const where = s.stage === 'done' ? 'done' : `stage ${s.stage} (${names[s.stage]})`;
      console.log(`${r} | ${s.type} | ${where} | ${s.target}`);
    }
  },

  status(run) {
    if (!run) return commands.list();
    const dir = resolveRun(run);
    const s = loadState(dir);
    console.log(`Run: ${s.run}\nType: ${s.type}\nTarget: ${s.target}\nStage: ${s.stage}`);
    for (const g of GATES) console.log(`Gate ${g}: ${s.gates[g] ? `passed ${s.gates[g].date} by ${s.gates[g].by}` : 'open'}`);
    if (s.picked) console.log(`Picked: ${s.picked}`);
    if (s.handoff) console.log(`Handoff: ${s.handoff}`);
    for (const f of ['00-brief.md', '01-value-report.md', 'sources.md', '02-ideas.md', '03-vision.md']) console.log(`${fs.existsSync(path.join(dir, f)) ? '[x]' : '[ ]'} ${f}`);
  },

  check(run, stage) {
    const dir = resolveRun(run);
    if (!checks[stage]) fail(`Stage must be one of: ${Object.keys(checks).join(', ')}.`);
    const report = runCheck(dir, stage);
    printReport(stage, report);
    process.exit(report.errors.length ? 1 : 0);
  },

  // Records a gate the user passed in this session. The skill calls it only after the user's own message.
  gate(run, gate, ...rest) {
    const dir = resolveRun(run);
    if (!GATES.includes(gate)) fail(`Gate must be one of: ${GATES.join(', ')}.`);
    const s = loadState(dir);
    const idx = GATES.indexOf(gate);
    for (const prev of GATES.slice(0, idx)) if (!s.gates[prev]) fail(`The "${prev}" gate is not passed yet.`);
    const report = runCheck(dir, CHECK_FOR_GATE[gate]);
    if (report.errors.length) { printReport(CHECK_FOR_GATE[gate], report); fail(`Gate "${gate}" refused: fix the errors above first.`); }
    if (gate === 'idea') {
      const picked = rest.join(' ').match(/IDEA-\d+/g);
      if (!picked) fail('Name the picked idea(s): qns.mjs gate <run> idea IDEA-3 (or IDEA-3+IDEA-5).');
      const ideas = read(dir, '02-ideas.md') || '';
      if (!/\|\s*IDEA-\d+\s*\|/.test(ideas)) fail('The idea gate cannot pass: the Idea List has no ranked idea. Tell the user, and offer to reopen the needs gate (qns.mjs reopen <run> needs) to look for stronger evidence.');
      for (const p of picked) if (!new RegExp(`\\|\\s*${p}\\s*\\|`).test(ideas)) fail(`${p} is not in the ranking.`);
      s.picked = picked.join('+');
    }
    s.gates[gate] = { date: today(), by: 'user' };
    s.stage = STAGE_AFTER_GATE[gate];
    saveState(dir, s);
    console.log(`Gate "${gate}" passed. Stage is now ${s.stage}.${report.warnings.length ? ` (${report.warnings.length} warning(s) remain; run check to see them.)` : ''}`);
  },

  // Re-opens a gate and every later one, so the locked files can change. Only on the user's request.
  reopen(run, gate) {
    const dir = resolveRun(run);
    if (!GATES.includes(gate)) fail(`Gate must be one of: ${GATES.join(', ')}.`);
    const s = loadState(dir);
    const idx = GATES.indexOf(gate);
    for (const g of GATES.slice(idx)) s.gates[g] = null;
    if (idx <= GATES.indexOf('idea')) s.picked = null;
    s.handoff = null;
    s.stage = idx === 0 ? 0 : STAGE_AFTER_GATE[GATES[idx - 1]];
    saveState(dir, s);
    console.log(`Re-opened "${gate}" and later gates. Stage is now ${s.stage}.`);
  },

  // Copies the approved Vision to <product>/docs/input/vision.md.
  handoff(run, product, flag) {
    const dir = resolveRun(run);
    const s = loadState(dir);
    if (!s.gates.vision) fail('The vision gate is not passed yet.');
    if (!product) fail('Name the product folder: qns.mjs handoff <run> <product-folder>.');
    const dest = path.resolve(product, 'docs', 'input', 'vision.md');
    if (fs.existsSync(dest) && flag !== '--force') fail(`${dest} already exists. Show it to the user and, if they agree, re-run with --force.`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(dir, '03-vision.md'), dest);
    // realpath on both sides, so Windows short (8.3) and long forms of the same folder agree.
    s.handoff = path.relative(fs.realpathSync(root()), fs.realpathSync(dest)).split(path.sep).join('/');
    s.stage = 'done';
    saveState(dir, s);
    console.log(`Vision written to ${dest}. Open that folder and run /itqan:start.`);
  },

  // Lists cited signals that are too old to carry a claim, for qanas:refresh.
  stale(run) {
    const dir = resolveRun(run);
    const rows = parseSources(read(dir, 'sources.md') || '');
    const used = new Set([...['01-value-report.md', '02-ideas.md'].flatMap((f) => [...citedIds(read(dir, f) || '')])]);
    const stale = staleSignals(rows);
    if (!stale.length) return console.log('No stale signals.');
    for (const x of stale) console.log(`${x.id}${used.has(x.id) ? ' (cited)' : ''}: ${x.reason}`);
    const vision = read(dir, '03-vision.md') || '';
    const now = today();
    for (const m of vision.matchAll(/(https?:\/\/[^\s),|]+)[^\n]*?\b(\d{4}-\d{2}-\d{2})\b/g)) {
      if (daysBetween(m[2], now) > 90) console.log(`Vision: ${m[1]} read ${m[2]}, more than 90 days ago`);
    }
  },

  delete(run, flag) {
    const dir = resolveRun(run);
    if (flag !== '--yes') fail(`This deletes ${dir} and everything in it. Re-run with --yes after the user confirms.`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted ${dir}.`);
  },

  // PreToolUse hook for Write|Edit|MultiEdit. Exit 2 blocks the call and shows stderr to the model.
  'hook-gate'() {
    const input = hookInput();
    const target = input.tool_input?.file_path;
    if (!target) process.exit(0);
    const reason = writeBlock(path.resolve(input.cwd || root(), target));
    if (reason) fail(reason, 2);
    process.exit(0);
  },

  // SessionStart hook: stdout is added to the session context.
  'hook-session'() {
    const input = hookInput();
    const base = runsDir(path.resolve(input.cwd || root()));
    if (!fs.existsSync(base)) return;
    const open = fs.readdirSync(base).filter((d) => {
      try { return loadState(path.join(base, d)).stage !== 'done'; } catch { return false; }
    });
    if (open.length) console.log(`Qanas: ${open.length} unfinished run(s) here (${open.join(', ')}). Load the qanas:start skill before working on them.`);
  },
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, ...args] = process.argv.slice(2);
  if (!commands[cmd]) fail(`Unknown command "${cmd ?? ''}". Commands: ${Object.keys(commands).filter((c) => !c.startsWith('hook')).join(', ')}.`);
  commands[cmd](...args);
}

export { checks, runCheck, parseSources, staleSignals, table, placeholders, personalDataHits };
