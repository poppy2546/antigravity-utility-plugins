---
name: clean-folder-organization
description: "Use whenever writing, generating, creating, or saving any files, scripts, documents, or project assets."
---

# Clean Folder Organization Skill

This skill enforces strict workspace hygiene and file organization guidelines whenever writing or generating files.

## Core Rules

1. **Never Save Directly to Desktop or Root:**
   - Under no circumstances should files (`.bat`, `.ps1`, `.py`, `.js`, `.txt`, etc.) be saved directly on `Desktop/` or the root of the workspace.
   - Never clutter the user's desktop with loose script or utility files.

2. **Always Create and Use Dedicated Folders:**
   - If generating scripts or utilities for the user, create and place them inside a named folder (e.g., `~/Desktop/<ProjectOrToolName>/` or `~/Tools/<ToolName>/`).
   - If generating project code, create a dedicated subdirectory inside the active workspace (e.g., `<Workspace>/<Subfolder>/` or `~/Projects/<ProjectName>/`).
   - Standard directory conventions:
     - `scripts/`: automation, batch scripts, powershell scripts.
     - `src/`: source code and application logic.
     - `docs/`: documentation, guides, and notes.
     - `output/` or `dist/`: generated output files, reports, or artifacts.

3. **User Override:**
   - If the user explicitly asks to save to a specific path (including Desktop or the workspace root), follow the user's path.

4. **Tidy Maintenance:**
   - Keep related files grouped together logically.
   - If a folder already exists for the task, use it rather than creating fragmented directories.
   - Clean up temporary scratch files when no longer needed.
