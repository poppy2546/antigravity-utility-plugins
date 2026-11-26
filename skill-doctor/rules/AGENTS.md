# Skill Doctor Rule

Whenever you add, install, create, or edit a skill, plugin, rule, or `mcp_config.json` under `~/.gemini/config/plugins` or `~/.gemini/skills`:
1. Run `node "$env:USERPROFILE\.gemini\config\plugins\skill-doctor\scripts\fix.js"` (Windows PowerShell) or `node ~/.gemini/config/plugins/skill-doctor/scripts/fix.js` (macOS/Linux) immediately after.
2. Fix anything listed under "Needs manual fix", then re-run until clean.
3. Never write plugin files via PowerShell `Set-Content`/`Out-File`/`>` (adds UTF-8 BOM).
