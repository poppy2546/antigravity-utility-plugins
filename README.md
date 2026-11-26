# Antigravity Utility Plugins

Two lightweight utility plugins for Google Antigravity: workspace file organization and plugin/skill health checks.

## Included Plugins

### 1. `clean-folder-organization`
Keeps AI-generated files organized and prevents desktop or workspace root clutter.
- Never saves scripts or loose files directly to `~/Desktop/` or the workspace root (unless the user explicitly requests a specific path).
- Organizes files into dedicated subdirectories (`scripts/`, `src/`, `docs/`, `output/`).

### 2. `skill-doctor`
Audits and auto-fixes broken plugin/skill configurations using Node.js (no external dependencies).
- Strips UTF-8 BOM from `.md`, `.json`, `.yml`, and `.yaml` files automatically.
- Generates a minimal `plugin.json` if missing.
- Validates JSON syntax and the `name` field in `plugin.json`.
- Checks `SKILL.md` frontmatter (`name:` and `description:`).
- Validates `~/.gemini/config/hooks.json` and `mcp_config.json` (BOM + JSON syntax).

## Installation

Copy the plugin folders into `~/.gemini/config/plugins/`:

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

Open a new chat for Antigravity to load the plugins.

## Usage (`skill-doctor`)

Audit and auto-fix:
- **Windows (PowerShell):**
  ```powershell
  node "$env:USERPROFILE\.gemini\config\plugins\skill-doctor\scripts\fix.js"
  ```
- **macOS / Linux:**
  ```bash
  node ~/.gemini/config/plugins/skill-doctor/scripts/fix.js
  ```

Report only (no file changes): append `--check` to the command.

*(Optional)* To run automatically at the end of every turn, add `stop-hook.js` to `~/.gemini/config/hooks.json`:

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
