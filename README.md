# Antigravity Utility Plugins & Agent Skills

Two lightweight utilities for **Google Antigravity**, **Claude Code**, **Cursor**, and **GitHub Copilot**: workspace file organization and skill/plugin health checks.

## Included Tools

### 1. `clean-folder-organization`
Keeps AI-generated files organized and prevents desktop or workspace root clutter.
- Never saves scripts or loose files directly to `~/Desktop/` or the workspace root (unless the user explicitly requests a specific path).
- Organizes files into dedicated subdirectories (`scripts/`, `src/`, `docs/`, `output/`).

### 2. `skill-doctor`
Audits and auto-fixes broken skill/plugin configurations using Node.js (no external dependencies).
- Scans skills across:
  - **Antigravity:** `~/.gemini/config/plugins/`, `~/.gemini/skills/`
  - **Claude Code:** `~/.claude/skills/`, `<workspace>/.claude/skills/`
  - **Cursor:** `~/.cursor/skills/`, `<workspace>/.cursor/skills/`
  - **GitHub Copilot:** `~/.copilot/skills/`, `<workspace>/.github/skills/`
  - **Shared Agent Skills:** `~/.agents/skills/`, `<workspace>/.agents/skills/`
- Strips UTF-8 BOM from `.md`, `.json`, `.yml`, and `.yaml` files automatically.
- Generates a minimal `plugin.json` if missing (Antigravity plugins).
- Validates JSON syntax and the `name` field in `plugin.json`.
- Checks `SKILL.md` frontmatter (`name:` and `description:`).
- Validates `~/.gemini/config/hooks.json` and `mcp_config.json` (BOM + JSON syntax).

## Installation

### Google Antigravity (Full Plugins)
Copy both plugin folders into `~/.gemini/config/plugins/`:

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.gemini\config\plugins" | Out-Null
Copy-Item -Recurse .\clean-folder-organization "$env:USERPROFILE\.gemini\config\plugins\"
Copy-Item -Recurse .\skill-doctor "$env:USERPROFILE\.gemini\config\plugins\"
```

**macOS / Linux:**
```bash
mkdir -p ~/.gemini/config/plugins
cp -r ./clean-folder-organization ~/.gemini/config/plugins/
cp -r ./skill-doctor ~/.gemini/config/plugins/
```

### Claude Code / Cursor / GitHub Copilot (Standalone Skills)
Copy the `SKILL.md` folders (plus `skill-doctor/scripts/` into the `skill-doctor` skill folder) to your agent's global skills directory:

- **Claude Code:** `~/.claude/skills/` (or `.claude/skills/` in a project)
- **Cursor:** `~/.cursor/skills/` (or `.cursor/skills/` in a project)
- **GitHub Copilot:** `~/.copilot/skills/` (or `.github/skills/` in a project)

**macOS / Linux example (Claude Code):**
```bash
mkdir -p ~/.claude/skills
cp -r ./clean-folder-organization/skills/clean-folder-organization ~/.claude/skills/
cp -r ./skill-doctor/skills/skill-doctor ~/.claude/skills/
cp -r ./skill-doctor/scripts ~/.claude/skills/skill-doctor/
```

**Windows (PowerShell) example (Claude Code):**
```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item -Recurse .\clean-folder-organization\skills\clean-folder-organization "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse .\skill-doctor\skills\skill-doctor "$env:USERPROFILE\.claude\skills\"
Copy-Item -Recurse .\skill-doctor\scripts "$env:USERPROFILE\.claude\skills\skill-doctor\"
```

*(Replace `.claude` with `.cursor` or `.copilot` as needed.)*

Open a new chat/session for your agent to load the updated skills.

## Usage (`skill-doctor`)

Audit and auto-fix:
- **Antigravity (Windows PowerShell):**
  ```powershell
  node "$env:USERPROFILE\.gemini\config\plugins\skill-doctor\scripts\fix.js"
  ```
- **Antigravity (macOS / Linux):**
  ```bash
  node ~/.gemini/config/plugins/skill-doctor/scripts/fix.js
  ```
- **Claude Code / Cursor / Copilot:**
  ```bash
  node ~/.claude/skills/skill-doctor/scripts/fix.js
  ```

Report only (no file changes): append `--check` to the command.

*(Optional, Antigravity only)* To run automatically at the end of every turn, add `stop-hook.js` to `~/.gemini/config/hooks.json`:

```json
"skill-doctor": {
  "Stop": [
    {
      "type": "command",
      "command": "node <HOME>/.gemini/config/plugins/skill-doctor/scripts/stop-hook.js",
      "timeout": 30
    }
  ]
}
```

Replace `<HOME>` with your home directory path (e.g. `C:/Users/<username>` on Windows or `/Users/<username>` on macOS).
