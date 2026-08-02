# AI Code Referencer ⚡

A lightweight, super-fast VS Code extension to copy code snippets with relative file paths, line numbers, and selectable reference formats directly to your clipboard for **Claude Code**, **AGY CLI**, **Codex**, **Cursor**, **ChatGPT**, and other AI coding assistants.

## Quick Demo 🎬

![AI Code Referencer Demo](demo.mp4)

## Features 🚀



- **Instant Copying**: Highlight any code and press `Cmd+Alt+R` (`Ctrl+Alt+R` on Windows/Linux).

- **Multiple Output Formats**: Supports AGY, Claude Code, Codex, Markdown, and plain `path:line` output.
  - Default copy command uses your configured format.
  - Optional chooser command lets you pick the format at copy time.
  - AGY / Claude Code / Codex format example:
  ```text
  @app/features/chat/llm_provider/gemini_provider.py

  line 15:
  self.client = genai.Client(api_key=self.api_key)
  ```
- **Single Line & Range Support**: Handles single line selection or multi-line range selection (`line 15-20`).

## Configuration

Set the default format in VS Code settings:

`AGY Code Referencer -> Default Format`

Available values:

- `agy`
- `codex`
- `claude-code`
- `markdown`
- `plain`

If no default is configured, the extension uses a host-aware fallback.
That fallback is controlled by:

- `AGY Code Referencer -> Host Defaults`

Example:

```json
{
  "agyCodeReferencer.hostDefaults": {
    "cursor": "claude-code",
    "vscode": "agy",
    "windsurf": "codex",
    "codium": "agy"
  }
}
```

Notes:

- If a host name is not present in `hostDefaults`, the extension falls back to `agy`.
- The chooser command always lets you override the default manually.

If you want to choose manually each time, run:

`AGY: Copy Code Reference (Choose Format)`

Direct preset commands are also available:

- `AGY: Copy Code Reference (Claude Code)`
- `AGY: Copy Code Reference (Codex)`

---

## Keyboard Shortcuts ⌨️

| OS | Shortcut | Command |
|---|---|---|
| macOS | `Cmd` + `Option` + `R` | AGY: Copy Code Reference |
| macOS | `Cmd` + `Option` + `Shift` + `R` | AGY: Choose Format |
| Windows / Linux | `Ctrl` + `Alt` + `R` | AGY: Copy Code Reference |
| Windows / Linux | `Ctrl` + `Alt` + `Shift` + `R` | AGY: Choose Format |


---

## Support the Project ☕

If **AGY Code Referencer** saves you time and makes your workflow smoother, consider supporting the project! Your support keeps this extension 100% free and actively maintained.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/koushikdas)

Enjoy coding! 🎉
