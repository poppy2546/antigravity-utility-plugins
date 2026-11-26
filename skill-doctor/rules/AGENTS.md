# Skill Doctor Rule

Whenever you add, install, create, or edit a skill, plugin, rule, or `mcp_config.json` across Antigravity (`~/.gemini/`), Claude Code (`~/.claude/skills`, `.claude/skills`), Cursor (`~/.cursor/skills`, `.cursor/skills`), GitHub Copilot (`~/.copilot/skills`, `.github/skills`), or `.agents/skills`:
1. Run `node <path-to-skill-doctor>/scripts/fix.js` immediately after.
2. Fix anything listed under "Needs manual fix", then re-run until clean.
3. Never write skill or plugin files via PowerShell `Set-Content`/`Out-File`/`>` (adds UTF-8 BOM).
