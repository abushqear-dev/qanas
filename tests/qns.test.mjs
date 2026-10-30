// Tests for scripts/qns.mjs. Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, '..', 'scripts', 'qns.mjs');
const fixture = path.join(here, 'fixtures', 'good-run');
process.env.QNS_TODAY = '2026-10-30';
const { runCheck, writeBlock, placeholders, personalDataHits } = await import(pathToFileURL(script).href);

const RUN = '2026-10-30-test-run';
const passed = { date: '2026-10-30', by: 'user' };

// Builds <tmp>/qanas/<RUN> from the fixture, with the gates given.
function makeRun(gates = {}, type = 'market') {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'qns-'));
  const dir = path.join(base, 'qanas', RUN);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(path.join(fixture, 'run'))) fs.copyFileSync(path.join(fixture, 'run', f), path.join(dir, f));
  const state = { run: RUN, type, target: 't', stage: 0, gates: { brief: null, needs: null, idea: null, vision: null, ...gates }, picked: null, handoff: null };
  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify(state));
  return { base, dir };
}

function edit(dir, file, from, to) {
  const p = path.join(dir, file);
  const before = fs.readFileSync(p, 'utf8');
  assert.ok(before.includes(from), `fixture ${file} should contain: ${from}`);
  fs.writeFileSync(p, before.replace(from, to));
}

function cli(base, ...args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: base, encoding: 'utf8', env: { ...process.env, QNS_ROOT: base } });
}

test('the good fixture passes every stage check', () => {
  const { dir } = makeRun({ brief: passed, needs: passed, idea: passed });
  for (const stage of ['brief', 'research', 'ideas', 'vision']) {
    const r = runCheck(dir, stage);
    assert.deepEqual(r.errors, [], `${stage}: ${r.errors.join(' | ')}`);
  }
});

test('research: wrong opportunity arithmetic is an error', () => {
  const { dir } = makeRun();
  edit(dir, '01-value-report.md', '| 8 | 3 | 13 |', '| 8 | 3 | 12 |');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('Opportunity is 12')));
});

test('research: a concentrated need cannot be Medium confidence', () => {
  const { dir } = makeRun();
  edit(dir, '01-value-report.md', '| concentrated | Low (hypothesis) |', '| concentrated | Medium |');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('capped at Low')));
});

test('research: recurring needs two first-hand domains', () => {
  const { dir } = makeRun();
  edit(dir, 'sources.md', '| workaround | first-hand | Gig', '| workaround | relayed | Gig');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('NEED-1: recurring needs first-hand')));
});

test('research: citing an unknown signal is an error', () => {
  const { dir } = makeRun();
  edit(dir, '01-value-report.md', '- **Evidence:** S-1, S-2, S-3', '- **Evidence:** S-1, S-2, S-3, S-9');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('S-9')));
});

test('research: a source without an access date is an error', () => {
  const { dir } = makeRun();
  edit(dir, 'sources.md', 'gigs.example.org | 2026-10-30', 'gigs.example.org | yesterday');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('S-2 has no ISO access date')));
});

test('research: stale pricing is a warning', () => {
  const { dir } = makeRun();
  edit(dir, 'sources.md', 'alpha.example.net | 2026-10-30', 'alpha.example.net | 2026-05-01');
  assert.ok(runCheck(dir, 'research').warnings.some((w) => w.includes('S-3 is stale')));
});

test('research: an individual run needs the personal-data line and no contact data', () => {
  const { dir } = makeRun({}, 'individual');
  edit(dir, '00-brief.md', 'Research type:** Market', 'Research type:** Individual');
  fs.appendFileSync(path.join(dir, '00-brief.md'), '\n## Framing\n- Identity: x\n');
  edit(dir, 'sources.md', 'Gig asking for help', 'Gig by jane.doe@mail.example.com asking for help');
  const errors = runCheck(dir, 'research').errors;
  assert.ok(errors.some((e) => e.includes('Contains personal data')));
  assert.ok(errors.some((e) => e.includes('private contact data')));
});

test('ideas: totals, evidence and floors are checked', () => {
  const { dir } = makeRun({ brief: passed, needs: passed });
  edit(dir, '02-ideas.md', '| 4 | 3 | 5 | 4 | 4 | 20 | 11 |', '| 4 | 1 | 5 | 4 | 4 | 20 | 11 |');
  const errors = runCheck(dir, 'ideas').errors;
  assert.ok(errors.some((e) => e.includes('axes add up to 18')));
  assert.ok(errors.some((e) => e.includes('Evidence is 11')));
  assert.ok(errors.some((e) => e.includes('below a floor')));
});

test('ideas: a missing filter answer and an unconfirmed need are errors', () => {
  const { dir } = makeRun({ brief: passed, needs: passed });
  edit(dir, '02-ideas.md', '  - **Moat:** none needed.\n', '');
  edit(dir, '02-ideas.md', '| NEED-1 | SaaS |', '| NEED-2 | SaaS |');
  const errors = runCheck(dir, 'ideas').errors;
  assert.ok(errors.some((e) => e.includes('"Moat" answer is missing')));
  assert.ok(errors.some((e) => e.includes('NEED-2, which was not confirmed')));
});

test('vision: needs exactly three capabilities and correct table stakes', () => {
  const { dir } = makeRun({ brief: passed, needs: passed, idea: passed });
  edit(dir, '03-vision.md', '3. See each invoice\'s status.\n', '3. See each invoice\'s status.\n4. Export.\n');
  edit(dir, '03-vision.md', '(https://forum.example.com/t/1, 2026-10-30) | no |', '(https://forum.example.com/t/1, 2026-10-30) | yes |');
  const errors = runCheck(dir, 'vision').errors;
  assert.ok(errors.some((e) => e.includes('exactly 3')));
  assert.ok(errors.some((e) => e.includes('Table stakes should be "no"')));
});

test('vision: S-n references, undated URLs and hype words are errors', () => {
  const { dir } = makeRun({ brief: passed, needs: passed, idea: passed });
  edit(dir, '03-vision.md', 'issue a compliant invoice in two minutes.', 'issue a compliant invoice in two minutes, a seamless experience (S-1). See https://x.example.com/docs.');
  const errors = runCheck(dir, 'vision').errors;
  assert.ok(errors.some((e) => e.includes('S-n references')));
  assert.ok(errors.some((e) => e.includes('https://x.example.com/docs has no ISO access date')));
  assert.ok(errors.some((e) => e.includes('seamless')));
});

test('placeholders are found, HTML tags are not', () => {
  assert.deepEqual(placeholders('a <product name> b <br> c <https://x.y>'), ['<product name>']);
});

test('personal data finder ignores dates and URLs', () => {
  assert.deepEqual(personalDataHits('On 2026-10-30, see https://a.example.com/u@x.com'), []);
  assert.equal(personalDataHits('call +966 55 123 4567').length, 1);
});

test('CLI: new, gate order, idea pick, handoff and reopen', () => {
  const { base, dir } = makeRun();
  let r = cli(base, 'gate', RUN, 'needs');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /"brief" gate is not passed/);
  assert.equal(cli(base, 'gate', RUN, 'brief').status, 0);
  assert.equal(cli(base, 'gate', RUN, 'needs').status, 0);
  r = cli(base, 'gate', RUN, 'idea');
  assert.match(r.stderr, /Name the picked idea/);
  assert.equal(cli(base, 'gate', RUN, 'idea', 'IDEA-1').status, 0);
  assert.equal(cli(base, 'gate', RUN, 'vision').status, 0);
  const product = path.join(base, 'product');
  r = cli(base, 'handoff', RUN, product);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(product, 'docs', 'input', 'vision.md')));
  assert.notEqual(cli(base, 'handoff', RUN, product).status, 0, 'second handoff without --force is refused');
  let state = JSON.parse(fs.readFileSync(path.join(dir, 'state.json'), 'utf8'));
  assert.equal(state.stage, 'done');
  assert.equal(state.picked, 'IDEA-1');
  assert.equal(state.handoff, 'product/docs/input/vision.md');
  assert.equal(cli(base, 'reopen', RUN, 'idea').status, 0);
  state = JSON.parse(fs.readFileSync(path.join(dir, 'state.json'), 'utf8'));
  assert.equal(state.gates.idea, null);
  assert.equal(state.gates.vision, null);
  assert.ok(state.gates.needs);
  assert.equal(state.stage, 2);

  r = cli(base, 'new', 'market', 'second-run', 'Some', 'target');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(base, 'qanas', '2026-10-30-second-run', 'state.json')));
});

test('CLI: gate is refused while the stage check fails', () => {
  const { base, dir } = makeRun({ brief: passed });
  edit(dir, '01-value-report.md', '| 8 | 3 | 13 |', '| 8 | 3 | 12 |');
  const r = cli(base, 'gate', RUN, 'needs');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /refused/);
});

test('hook: blocks state.json, out-of-order and locked writes', () => {
  const { dir } = makeRun({ brief: passed });
  assert.match(writeBlock(path.join(dir, 'state.json')), /owned by qns.mjs/);
  assert.match(writeBlock(path.join(dir, '02-ideas.md')), /"needs" gate/);
  assert.equal(writeBlock(path.join(dir, '01-value-report.md')), null);
  assert.equal(writeBlock(path.join(os.tmpdir(), 'elsewhere.md')), null);
  const { dir: d2 } = makeRun({ brief: passed, needs: passed });
  assert.match(writeBlock(path.join(d2, '01-value-report.md')), /locked/);
  assert.equal(writeBlock(path.join(d2, '02-ideas.md')), null);
});

test('hook-gate CLI exits 2 with the reason', () => {
  const { base, dir } = makeRun();
  const r = spawnSync(process.execPath, [script, 'hook-gate'], { input: JSON.stringify({ cwd: base, tool_input: { file_path: path.join(dir, 'state.json') } }), encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /owned by qns.mjs/);
});

test('ideas: the Need score must follow the formula (no waivers)', () => {
  const { dir } = makeRun({ brief: passed, needs: passed });
  edit(dir, '02-ideas.md', '| SaaS | 4 | 3 | 5 | 4 | 4 | 20 | 11 |', '| SaaS | 5 | 3 | 5 | 4 | 4 | 21 | 12 |');
  assert.ok(runCheck(dir, 'ideas').errors.some((e) => e.includes('Need score is 5, but the formula')));
});

test('ideas: an empty ranking is allowed only with the "No idea clears the floors" line', () => {
  const { dir } = makeRun({ brief: passed, needs: passed });
  const p = path.join(dir, '02-ideas.md');
  const md = fs.readFileSync(p, 'utf8');
  const emptied = md.replace(/\| 1 \| IDEA-1 .*\n/, '').replace(/## Ideas[\s\S]*## Considered/, '## Ideas\n\n## Considered');
  fs.writeFileSync(p, emptied);
  assert.ok(runCheck(dir, 'ideas').errors.some((e) => e.includes('no IDEA rows')));
  fs.writeFileSync(p, emptied.replace('## Ranking', '## Ranking\n\nNo idea clears the floors. Every need is Low confidence.'));
  const r = runCheck(dir, 'ideas');
  assert.deepEqual(r.errors.filter((e) => e.includes('Ranking')), []);
  assert.ok(r.warnings.some((w) => w.includes('no idea clears the floors')));
});

test('CLI: the idea gate refuses when nothing is ranked', () => {
  const { base, dir } = makeRun({ brief: passed, needs: passed });
  const p = path.join(dir, '02-ideas.md');
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\| 1 \| IDEA-1 .*\n/, '').replace(/## Ideas[\s\S]*## Considered/, '## Ideas\n\n## Considered').replace('## Ranking', '## Ranking\n\nNo idea clears the floors.'));
  const r = cli(base, 'gate', RUN, 'idea', 'IDEA-1');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /no ranked idea/);
});

test('research: undated first-hand signals do not count as a domain', () => {
  const { dir } = makeRun();
  edit(dir, 'sources.md', 'freelance-gig | workaround | first-hand | Gig asking for help connecting an invoicing tool to the tax portal | n.a. | https://gigs.example.org/job/2 | gigs.example.org | 2026-10-30 | 2026-09', 'freelance-gig | workaround | first-hand | Gig asking for help connecting an invoicing tool to the tax portal | n.a. | https://gigs.example.org/job/2 | gigs.example.org | 2026-10-30 | unknown');
  assert.ok(runCheck(dir, 'research').errors.some((e) => e.includes('NEED-1: recurring needs first-hand')));
});

test('stale: a pricing page with an old content date is stale even if read today', () => {
  const { dir } = makeRun();
  edit(dir, 'sources.md', 'alpha.example.net | 2026-10-30 | live', 'alpha.example.net | 2026-10-30 | 2025-04');
  assert.ok(runCheck(dir, 'research').warnings.some((w) => w.includes('S-3 is stale')));
});

test('vision: a date before the URL on the same line is accepted; ISS-2 is not an S-n', () => {
  const { dir } = makeRun({ brief: passed, needs: passed, idea: passed });
  edit(dir, '03-vision.md', 'A reporting deadline is coming (https://alpha.example.net/pricing, 2026-10-30).', 'Accessed 2026-10-30, a reporting deadline is coming at https://alpha.example.net/pricing and ISS-2 applies.');
  assert.deepEqual(runCheck(dir, 'vision').errors, []);
});

test('vision: a competitor id defined twice is an error', () => {
  const { dir } = makeRun({ brief: passed, needs: passed, idea: passed });
  edit(dir, '03-vision.md', '| COMP-2 | Spreadsheet |', '| COMP-1 | Spreadsheet |');
  assert.ok(runCheck(dir, 'vision').errors.some((e) => e.includes('COMP-1 is defined twice')));
});
