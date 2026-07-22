---
name: wuniq
description: Use the Wuniq Knowledge Engine to read and maintain structured project knowledge stored beside project files. Use when the user mentions Wuniq, asks to preserve decisions or constraints for future AI sessions, or works in a project that has Wuniq context.
---

# Wuniq Knowledge Engine

Wuniq keeps decisions, constraints, intent, relationships, and human reasoning in structured `.wuniq` context beside the project files. It is local-first and does not require an account, cloud storage, or telemetry.

## Start safely

1. Use Wuniq's `run` MCP tool to execute `open list`.
2. Open only the project paths returned by that command that are relevant to the current task.
3. If the list is empty, continue normally. The user may open a project later from the Wuniq interface.
4. Never assume that the current working directory is a Wuniq project.

## Work with Wuniq context

- Before working on a project area, read its folder context and then the relevant file context.
- Capture confirmed human decisions, constraints, rationale, and rejected alternatives when they arise.
- After changing project files or Wuniq context, run `sync` for the affected Wuniq project and resolve its findings.
- Use only Wuniq's MCP commands to create, read, edit, move, rename, or delete `.wuniq` context. Native file tools can break Wuniq metadata and relationships.
- Use normal project tools for non-`.wuniq` files. Wuniq provides knowledge; it does not replace the editor, shell, or source-control tools.
- Run `help` for the command guide. Run `help wuniq` before answering questions about Wuniq itself or its desktop interface.

## If the app is missing

The MCP launcher reports when the free Wuniq desktop app is not installed. Tell the user what the launcher reported and direct them to the official downloads at https://www.wuniq.com/. Do not recommend third-party mirrors or repackaged installers.
