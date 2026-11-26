---
name: skill-doctor
description: "Audit and auto-fix skills and plugins for Antigravity, Claude Code, Cursor, and GitHub Copilot."
---

# skill-doctor

Run after every skill or plugin change. A UTF-8 BOM, broken frontmatter, or missing `plugin.json` can cause agents to silently skip the skill or plugin.

## Scanned Locations

- **Antigravity:** `~/.gemini/config/plugins/`, `~/.gemini/skills/`
- **Claude Code:** `~/.claude/skills/`, `<workspace>/.claude/skills/`
- **Cursor:** `~/.cursor/skills/`, `<workspace>/.cursor/skills/`
- **GitHub Copilot:** `~/.copilot/skills/`, `<workspace>/.github/skills/`
- **Shared Agent Skills:** `~/.agents/skills/`, `<workspace>/.agents/skills/`

## Steps

1. Run `scripts/fix.js` from this skill's directory (or plugin directory):
   - Windows (PowerShell):
     ```powershell
     node <path-to-skill-doctor>\scripts\fix.js
     ```
   - macOS / Linux:
     ```bash
     node <path-to-skill-doctor>/scripts/fix.js
     ```
   Use `--check` to report only without modifying files.
2. Read output:
   - `BOM stripped` / `Created plugin.json`: already fixed.
   - `Needs manual fix`: edit those files (invalid JSON, missing `name:` or `description:` in frontmatter).
3. Re-run until it prints `No remaining problems.`
4. Start a new chat/session so the agent reloads the updated skills.

## Rules When Writing Skill & Plugin Files

- Never write skill or plugin files with PowerShell `Set-Content`, `Out-File`, or `>`. They add a UTF-8 BOM. Use a file-write tool or `node fs.writeFileSync`.
- Every skill needs `SKILL.md` starting with YAML frontmatter (`---`, `name:`, `description:`).
- For Antigravity plugins, every plugin directory also needs `plugin.json` with a `name` field.
