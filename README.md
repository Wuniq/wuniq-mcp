# Wuniq MCP

<p align="center">
  <img src="assets/wuniq-icon.png" alt="Wuniq" width="128" height="128">
</p>

> **Wuniq is free. This MCP package requires the Wuniq desktop app. Download it only through the official, trusted links at [wuniq.com](https://www.wuniq.com). Do not use third-party mirrors.**

Wuniq is a knowledge engine for AI-assisted work. It stores decisions, constraints, intent, and human reasoning in `.wuniq` files beside your project files, so any MCP-compatible AI can read and maintain the knowledge exactly where the work lives.

Wuniq is local-first: no account, no cloud storage, and no telemetry.

## What this repository contains

This repository contains the small, open-source MCP launcher published as [`@wuniq/mcp`](https://www.npmjs.com/package/@wuniq/mcp), plus the manifest submitted to the [official MCP Registry](https://registry.modelcontextprotocol.io/?search=com.wuniq).

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

The MCP launcher in this repository is licensed under the [MIT License](LICENSE). The Wuniq desktop app and Knowledge Engine are separate software and are not covered by this repository's license.
