---
name: skill-doctor
description: "Audit and auto-fix Antigravity plugins and skills."
---

# skill-doctor

Run after every skill/plugin change. A UTF-8 BOM or missing `plugin.json` makes Antigravity silently skip the plugin.

## Steps

1. Run the fixer:
   - Windows (PowerShell):
     ```powershell
     node "$env:USERPROFILE\.gemini\config\plugins\skill-doctor\scripts\fix.js"
     ```
   - macOS / Linux:
     ```bash
     node ~/.gemini/config/plugins/skill-doctor/scripts/fix.js
     ```
   Use `--check` to report only.
2. Read output:
   - `BOM stripped` / `Created plugin.json`: already fixed.
   - `Needs manual fix`: edit those files (invalid JSON, missing `name:` or `description:` in frontmatter).
3. Re-run until it prints `No remaining problems.`
4. Tell the user to open a new chat so the plugin reloads.

## Rules when writing plugin files

- Never write plugin files with PowerShell `Set-Content`, `Out-File`, or `>`. They add a BOM. Use the file-write tool or `node fs.writeFileSync`.
- Every plugin dir needs `plugin.json` with `name`.
- Every skill needs `skills/<name>/SKILL.md` starting with `---`, `name:`, `description:`.
