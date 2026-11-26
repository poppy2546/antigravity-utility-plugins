# Antigravity Utility Plugins

รวมปลั๊กอินช่วยจัดระเบียบไฟล์และดูแลสุขภาพปลั๊กอิน/สกิลสำหรับ Google Antigravity

## ปลั๊กอินในชุดนี้

### 1. `clean-folder-organization`
บังคับให้ AI จัดระเบียบไฟล์ที่สร้างใหม่ทั้งหมด ไม่วางไฟล์รก Desktop หรือ root ของโปรเจกต์
- ห้ามสร้างไฟล์ลง `~/Desktop/` โดยตรง
- จัดเก็บสคริปต์/เอกสาร/โค้ดลงโฟลเดอร์ย่อยที่ชัดเจน (`scripts/`, `src/`, `docs/`, `output/`)

### 2. `skill-doctor`
สแกนและซ่อมไฟล์ปลั๊กอิน/สกิลที่ config พังอัตโนมัติ (รันผ่าน Node.js)
- ลบ UTF-8 BOM ออกจากไฟล์ `.md`, `.json`, `.yml`, `.yaml` อัตโนมัติ
- สร้าง `plugin.json` พื้นฐานให้ปลั๊กอินที่ขาดไฟล์นี้
- ตรวจ JSON syntax และฟิลด์ `name` ของ `plugin.json`
- ตรวจ frontmatter (`name:`, `description:`) ของ `SKILL.md`
- ตรวจ `~/.gemini/config/hooks.json` และ `mcp_config.json` (BOM + JSON syntax)

## วิธีติดตั้ง

คัดลอกโฟลเดอร์ปลั๊กอินที่ต้องการไปวางใน `~/.gemini/config/plugins/`:

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

จากนั้นเปิดแชทใหม่เพื่อให้ Antigravity โหลดปลั๊กอิน

## การใช้งาน `skill-doctor`

ตรวจและซ่อมอัตโนมัติ:
- Windows (PowerShell):
  ```powershell
  node "$env:USERPROFILE\.gemini\config\plugins\skill-doctor\scripts\fix.js"
  ```
- macOS / Linux:
  ```bash
  node ~/.gemini/config/plugins/skill-doctor/scripts/fix.js
  ```

ตรวจอย่างเดียว (ไม่แก้ไขไฟล์) ให้เติม `--check` ต่อท้ายคำสั่ง

*(ทางเลือก)* หากต้องการให้ตรวจอัตโนมัติทุกครั้งที่จบเทิร์น ให้เพิ่ม `stop-hook.js` ลงใน `~/.gemini/config/hooks.json`:

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

แทนที่ `<HOME>` ด้วย path home ของเครื่องคุณ (เช่น `C:/Users/<username>` บน Windows หรือ `/Users/<username>` บน macOS)
