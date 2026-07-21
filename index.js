#!/usr/bin/env node
'use strict';

// Wuniq MCP proxy — the npm doorway to the Wuniq desktop app.
// Spec and rationale: KnowledgeEngine docs/mcp-proxy.entity (Wuniq sidecar).
//
// Normal flow: spawn the `wuniq-mcp` alias of the installed app with stdio
// 'inherit', so the real MCP server inside the app receives the IDE's pipes
// directly. This process just waits and mirrors the child's exit code — the
// session is identical to a manually configured one.
//
// Failure flow (app not installed): speak the minimum of MCP over stdio and
// answer every request with the first-contact message, so the user's AI can
// guide the installation.
//
// Hard rule: no Wuniq logic here. This proxy owns exactly one boundary —
// "is the app installed?". Everything else belongs to the app's own MCP
// server, which auto-updates with the app (Microsoft Store / Snap Store).

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

const VERSION = require('./package.json').version;

const FIRST_CONTACT =
  'The free Wuniq desktop app is not installed on this machine. ' +
  'Install it from https://www.wuniq.com and this connection will work automatically. ' +
  'Please tell the user.';

function aliasCandidates() {
  if (process.platform === 'win32') {
    // Security: exclude the cwd from the unqualified-exe search (Windows
    // probes cwd before PATH) — a planted wuniq-mcp.exe inside an opened
    // repo must never shadow the real alias.
    if (process.env.NoDefaultCurrentDirectoryInExePath === undefined) {
      process.env.NoDefaultCurrentDirectoryInExePath = '1';
    }
    // PATH first (canonical), then the explicit alias location — corporate
    // environments sometimes strip WindowsApps from PATH.
    const cands = ['wuniq-mcp.exe'];
    if (process.env.LOCALAPPDATA) {
      cands.push(path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WindowsApps', 'wuniq-mcp.exe'));
    }
    return cands;
  }
  // Linux (snap): the wuniq-mcp app is exposed as `wuniq.wuniq-mcp` because
  // snap prefixes app names that differ from the snap name. /snap/bin is on PATH.
  return ['wuniq.wuniq-mcp', '/snap/bin/wuniq.wuniq-mcp'];
}

function launch(cands, i) {
  if (i >= cands.length) {
    notInstalledServer();
    return;
  }
  const child = spawn(cands[i], [], { stdio: 'inherit', windowsHide: true });
  let spawned = false;
  child.once('spawn', () => {
    spawned = true;
    for (const sig of ['SIGINT', 'SIGTERM']) {
      process.on(sig, () => child.kill(sig));
    }
  });
  child.once('error', () => {
    if (!spawned) launch(cands, i + 1);
    else process.exit(1);
  });
  child.once('exit', (code, signal) => {
    if (spawned) process.exit(signal ? 1 : (code ?? 1));
  });
}

// Minimal MCP server (stdio, newline-delimited JSON-RPC) for the
// app-not-installed case. The first reader is the user's AI: a good message
// turns the stumble into onboarding.
function notInstalledServer() {
  process.stderr.write('[wuniq-mcp-proxy] Wuniq app not found (alias "wuniq-mcp" missing) — serving install guidance.\n');

  const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
  const reply = (id, result) => send({ jsonrpc: '2.0', id, result });

  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  rl.on('line', (line) => {
    line = line.trim();
    if (!line) return;
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    const { id, method } = msg;
    const isNotification = id === undefined || id === null;

    if (method === 'initialize') {
      reply(id, {
        protocolVersion: (msg.params && msg.params.protocolVersion) || '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'wuniq-mcp-proxy', version: VERSION },
        instructions: FIRST_CONTACT,
      });
    } else if (method === 'tools/list') {
      reply(id, {
        tools: [{
          name: 'run',
          description: 'Wuniq command interface. NOTE: the free Wuniq desktop app is not installed on this machine — calls return installation guidance.',
          inputSchema: {
            type: 'object',
            properties: { command: { type: 'string', description: 'Command to execute.' } },
            required: ['command'],
          },
        }],
      });
    } else if (method === 'tools/call') {
      reply(id, { content: [{ type: 'text', text: FIRST_CONTACT }] });
    } else if (method === 'ping') {
      reply(id, {});
    } else if (method === 'resources/list') {
      reply(id, { resources: [] });
    } else if (method === 'prompts/list') {
      reply(id, { prompts: [] });
    } else if (!isNotification) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
    }
  });
  rl.on('close', () => process.exit(0));
}

launch(aliasCandidates(), 0);
