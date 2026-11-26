#!/usr/bin/env node
// skill-doctor: scan plugins/skills, auto-fix BOM + missing plugin.json, report the rest.
// Usage: node fix.js [--check]   (--check = report only, change nothing)
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHECK = process.argv.includes('--check');
const ROOTS = [
  path.join(os.homedir(), '.gemini', 'config', 'plugins'),
];
const SKILL_ROOTS = [path.join(os.homedir(), '.gemini', 'skills')];
const CONFIG_JSONS = [
  path.join(os.homedir(), '.gemini', 'config', 'hooks.json'),
  path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json'),
];
const TEXT_EXT = /\.(md|json|ya?ml)$/i;

const fixed = [];
const problems = [];

function stripBom(file) {
  const buf = fs.readFileSync(file);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    if (!CHECK) fs.writeFileSync(file, buf.slice(3));
    fixed.push(`${CHECK ? 'BOM found' : 'BOM stripped'}: ${file}`);
  }
}

function walk(dir, fn) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function checkJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    problems.push(`Invalid JSON: ${file} (${e.message})`);
    return null;
  }
}

function checkSkill(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return problems.push(`No frontmatter: ${file}`);
  if (!/^name:/m.test(m[1])) problems.push(`Frontmatter missing name: ${file}`);
  if (!/^description:/m.test(m[1])) problems.push(`Frontmatter missing description: ${file}`);
}

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const plugin of fs.readdirSync(root)) {
    const pdir = path.join(root, plugin);
    if (!fs.statSync(pdir).isDirectory()) continue;

    const pj = path.join(pdir, 'plugin.json');
    if (!fs.existsSync(pj)) {
      if (!CHECK) {
        const stub = { name: plugin, displayName: plugin, version: '1.0.0', description: `${plugin} plugin` };
        fs.writeFileSync(pj, JSON.stringify(stub, null, 2) + '\n');
      }
      fixed.push(`${CHECK ? 'Missing' : 'Created'} plugin.json: ${plugin}`);
    }

    walk(pdir, (f) => { if (TEXT_EXT.test(f)) stripBom(f); });

    if (fs.existsSync(pj)) {
      const data = checkJson(pj);
      if (data && (typeof data.name !== 'string' || !data.name.trim())) {
        problems.push(`Missing "name" in plugin.json: ${pj}`);
      }
    }
    const mcp = path.join(pdir, 'mcp_config.json');
    if (fs.existsSync(mcp)) checkJson(mcp);

    const sdir = path.join(pdir, 'skills');
    if (fs.existsSync(sdir)) {
      for (const s of fs.readdirSync(sdir)) {
        const sk = path.join(sdir, s, 'SKILL.md');
        if (fs.existsSync(sk)) checkSkill(sk);
      }
    }
  }
}

for (const root of SKILL_ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const s of fs.readdirSync(root)) {
    const sk = path.join(root, s, 'SKILL.md');
    if (fs.existsSync(sk)) { stripBom(sk); checkSkill(sk); }
  }
}

for (const f of CONFIG_JSONS) {
  if (fs.existsSync(f)) { stripBom(f); checkJson(f); }
}

console.log(fixed.length ? fixed.join('\n') : 'Nothing to fix.');
console.log(problems.length ? '\nNeeds manual fix:\n' + problems.join('\n') : '\nNo remaining problems.');
process.exit(problems.length ? 1 : 0);
