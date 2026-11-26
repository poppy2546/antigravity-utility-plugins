#!/usr/bin/env node
// Stop hook: run fix.js each turn. Auto-fixes silently. If manual problems remain,
// ask the agent to continue once per conversation (loop guard), else stay quiet.
// Hook contract: JSON on stdin, JSON on stdout only.
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function reply(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.exit(0);
}

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch (_) {}

try {
  const r = spawnSync(process.execPath, [path.join(__dirname, 'fix.js')], { encoding: 'utf8' });
  if (r.status !== 1) reply({}); // 0 = clean/fixed, anything else = crash: stay quiet

  const id = String(input.conversationId || 'unknown').replace(/[^\w-]/g, '');
  const flag = path.join(os.tmpdir(), `skill-doctor-${id}.flag`);
  if (fs.existsSync(flag)) reply({}); // already nagged once this chat
  fs.writeFileSync(flag, '1');
  reply({
    decision: 'continue',
    reason: 'skill-doctor found plugin/skill problems that need a manual fix:\n' + r.stdout.trim(),
  });
} catch (_) {
  reply({});
}
