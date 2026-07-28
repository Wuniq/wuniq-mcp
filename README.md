# Wuniq MCP

<p align="center">
  <img src="assets/wuniq-icon.png" alt="Wuniq" width="128" height="128">
</p>

> **Wuniq is free. This MCP package requires the Wuniq desktop app, currently available for Windows and Linux. Download it only through the official, trusted links at [wuniq.com](https://www.wuniq.com). Do not use third-party mirrors.**

Wuniq is a knowledge engine for AI-assisted work. It stores decisions, constraints, intent, and human reasoning in `.wuniq` files beside your project files, so any MCP-compatible AI can read and maintain the knowledge exactly where the work lives.

Wuniq is local-first: no account, no cloud storage, and no telemetry.

## What this repository contains

This repository contains the small, open-source MCP launcher published as [`@wuniq/mcp`](https://www.npmjs.com/package/@wuniq/mcp), the manifest submitted to the [official MCP Registry](https://registry.modelcontextprotocol.io/?search=com.wuniq), and thin wrappers for Claude, Codex, Antigravity, and Gemini CLI that all start the same launcher.

The launcher has zero dependencies. It connects your MCP client to the MCP server included with the installed Wuniq desktop app:

```text
MCP-compatible AI or IDE
          |
          v
    npx @wuniq/mcp
          |
          v
Installed Wuniq desktop app
          |
          v
Local projects and .wuniq knowledge
```

The Wuniq Knowledge Engine itself is not contained in this repository and is not distributed through npm. The MIT license in this repository applies only to the launcher.

## Install and connect

1. Install the free Wuniq desktop app using an official download link from [wuniq.com](https://www.wuniq.com).
2. Add Wuniq from your IDE's MCP registry gallery, where supported, or configure it manually:

```json
{
  "mcpServers": {
    "wuniq": {
      "command": "npx",
      "args": ["-y", "@wuniq/mcp"]
    }
  }
}
```

Already have the app installed? You can also point your MCP configuration directly to the `wuniq-mcp` command placed on your PATH by the official Wuniq installation. Both methods connect to the same local engine.

Per-IDE instructions and current platform availability are maintained at [wuniq.com](https://www.wuniq.com).

## OpenCode

OpenCode uses a project-level `opencode.json` file. Add Wuniq under its `mcp` key, keeping any providers, permissions, or other MCP servers already present:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "wuniq": {
      "type": "local",
      "command": ["npx", "-y", "@wuniq/mcp"],
      "enabled": true,
      "timeout": 30000
    }
  }
}
```

Then add the Wuniq workflow to the project's `AGENTS.md` without removing any existing instructions:

```markdown
# Wuniq KE (Knowledge Engine)

At the start of every session, run `open list` using the Wuniq MCP tool. If it returns projects, `open` each one. If the list is empty, proceed normally — the user may open projects later from the Wuniq UI. Never assume the working directory is a Wuniq project; the working directory may be a container folder holding multiple projects. Only open paths that `open list` explicitly returns.

Before working on any code file, `read` its Wuniq sidecar for context. After changing code, run `sync`.
```

This route was validated on Windows with OpenCode Desktop 1.18.4, Wuniq 1.15.1, and `@wuniq/mcp` 1.0.1. MCP connection and the `open`, `read`, and `sync` calls worked correctly. Models vary in how reliably they act on `AGENTS.md` without prompting, so `open list` can always be requested explicitly.

See the full [Wuniq + OpenCode integration guide](https://www.wuniq.com/docs/integrations/opencode/) for verification, Linux instructions, Precise mode, and troubleshooting.

## Claude plugin

The repository root is also a Claude plugin. It does not contain a second MCP server: `.mcp.json` starts the published `@wuniq/mcp` launcher, which connects Claude to the MCP server inside the installed Wuniq app.

The plugin includes one compact skill that teaches Claude the safe Wuniq workflow: discover visible projects first, read their context before working, preserve confirmed decisions, and synchronize after changes. It does not pre-approve tools or elevate permissions.

Before marketplace submission, the plugin can be checked and loaded locally with Claude Code:

```text
claude plugin validate --strict .
claude --plugin-dir .
```

## Codex plugin

The same repository is also a Codex plugin. Its `.codex-plugin/plugin.json` reuses the same skill and `.mcp.json`; it starts `@wuniq/mcp` locally and does not create a hosted service or upload project data.

Add the public Wuniq marketplace from Codex:

```text
codex plugin marketplace add Wuniq/wuniq-mcp --ref main
```

Then open the **Plugins** directory in the ChatGPT desktop app, select the **Wuniq** marketplace, and install **Wuniq**. Start a new Codex session after installation so the skill and MCP server are loaded.

ChatGPT on the web cannot run this local `stdio` MCP server. Wuniq's full integration is therefore for local Codex clients: the ChatGPT desktop app, Codex CLI, and the Codex IDE extension.

## Antigravity plugin

The repository root is a native Antigravity plugin. Its `mcp_config.json` starts the published `@wuniq/mcp` launcher, while `skills/wuniq/SKILL.md` supplies the safe Wuniq workflow. It does not contain a second MCP server or upload project data.

Install it in Antigravity CLI from the public repository:

```text
agy plugin install https://github.com/Wuniq/wuniq-mcp
```

In Antigravity 2.0, Wuniq can also be configured as a custom MCP server with the same `npx -y @wuniq/mcp` command while its MCP Store listing is under review.

## Gemini CLI extension

The repository root is also a Gemini CLI extension. Its `gemini-extension.json` starts the same published `@wuniq/mcp` launcher, while `skills/wuniq/SKILL.md` supplies the safe Wuniq workflow as an Agent Skill. It does not contain a second MCP server or upload project data.

Install it directly from the public repository:

```text
gemini extensions install https://github.com/Wuniq/wuniq-mcp
```

Restart Gemini CLI after installation so the extension and its MCP tools are loaded.

Google has transitioned personal, Pro, and Ultra users from Gemini CLI to Antigravity CLI. The Gemini CLI extension remains available for supported Enterprise, Google Cloud, and API-based environments.

## Example prompts

- "Open the Wuniq projects visible to you and summarize the important context for this task."
- "Before changing the authentication module, read its Wuniq context and preserve the constraints already decided."
- "Record the decision we just made, implement the change, and run Wuniq sync when you finish."

## Troubleshooting

- **The Wuniq app is missing:** install it only from the official links at [wuniq.com](https://www.wuniq.com), then start a new Claude, Codex, Antigravity, or Gemini CLI session.
- **`open list` returns no projects:** open the intended project in the Wuniq desktop interface and ask your AI client to try again.
- **The launcher cannot start:** confirm that Node.js and `npx` are available, or use the direct per-client setup documented at [wuniq.com](https://www.wuniq.com).

## How the launcher works

The launcher passes the MCP client's standard input and output directly to the MCP server included with the installed app. If Wuniq is not installed, it exposes only a minimal MCP response explaining how to obtain the official app.

It does not configure IDEs, contain Wuniq product logic, upload project data, or provide a second Knowledge Engine.

## Security

Only install Wuniq through links published on [wuniq.com](https://www.wuniq.com). Do not use third-party mirrors or repackaged installers.

To report a security issue, use this repository's private vulnerability reporting instead of opening a public issue. See [SECURITY.md](SECURITY.md).

## Links

- [Wuniq website and official downloads](https://www.wuniq.com)
- [Official MCP Registry entry](https://registry.modelcontextprotocol.io/?search=com.wuniq)
- [`@wuniq/mcp` on npm](https://www.npmjs.com/package/@wuniq/mcp)

## License

The MCP launcher and the Claude, Codex, Antigravity, and Gemini CLI wrappers in this repository are licensed under the [MIT License](LICENSE). The Wuniq desktop app and Knowledge Engine are separate software and are not covered by this repository's license.
