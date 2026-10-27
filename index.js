var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/features/chat-style/host.ts
var host_exports = {};
__export(host_exports, {
  apply: () => apply,
  inject: () => inject
});

// src/features/chat-style/host/catalog.ts
import { readdir as readdir2, readFile as readFile2 } from "node:fs/promises";
import { join as join2 } from "node:path";

// src/features/chat-style/host/skill-catalog.ts
import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
function resolveDshHome() {
  const configured = process.env.DSH_HOME?.trim();
  if (configured) return configured;
  return join(homedir(), ".dsh");
}
function resolveAgentsHome() {
  const configured = process.env.DSH_AGENTS_HOME?.trim();
  if (configured) return configured;
  return join(homedir(), ".agents");
}
var SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function parseFrontmatter(raw) {
  const firstLineEnd = raw.indexOf("\n");
  if (firstLineEnd < 0) return void 0;
  if (raw.slice(0, firstLineEnd).replace(/\r$/, "") !== "---") return void 0;
  const closing = raw.indexOf("\n---", firstLineEnd);
  if (closing < 0) return void 0;
  const lines = raw.slice(firstLineEnd + 1, closing).split("\n");
  const values = {};
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(name|description):\s*(.*)$/.exec(lines[index].replace(/\r$/, ""));
    if (!match) continue;
    const [, key, rest] = match;
    if (rest === ">" || rest === ">-" || rest === "|" || rest === "|-") {
      const block = [];
      while (index + 1 < lines.length && /^\s+.+/.test(lines[index + 1])) {
        index += 1;
        block.push(lines[index].trim());
      }
      values[key] = block.join(" ");
      continue;
    }
    values[key] = rest.replace(/^['"]|['"]$/g, "");
  }
  if (!values.name || !values.description) return void 0;
  return { name: values.name, description: values.description };
}
async function readSkillEntry(path, kind) {
  const file = kind === "directory" ? join(path, "SKILL.md") : path;
  try {
    const raw = await readFile(file, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed || !SKILL_NAME_PATTERN.test(parsed.name)) return void 0;
    return { name: parsed.name, description: parsed.description, path, kind };
  } catch (error) {
    console.error("[chat-style] \u8BFB\u53D6\u6280\u80FD\u6587\u4EF6\u5931\u8D25:", file, error);
    return void 0;
  }
}
async function scanRoot(root) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("[chat-style] \u8BFB\u53D6\u6280\u80FD\u6839\u76EE\u5F55\u5931\u8D25:", root, error);
    return [];
  }
  const skills = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const path = join(root, entry.name);
    let kind;
    if (entry.isDirectory()) kind = "directory";
    else if (entry.isFile() && entry.name.endsWith(".md")) kind = "file";
    else if (entry.isSymbolicLink()) {
      try {
        const info = await stat(path);
        if (info.isDirectory()) kind = "directory";
        else if (info.isFile() && entry.name.endsWith(".md")) kind = "file";
      } catch (error) {
        console.error("[chat-style] \u8DDF\u968F\u6280\u80FD\u7B26\u53F7\u94FE\u63A5\u5931\u8D25:", path, error);
        kind = void 0;
      }
    }
    if (!kind) continue;
    const skill = await readSkillEntry(path, kind);
    if (skill) skills.push(skill);
  }
  return skills;
}
async function listSkillEntries() {
  const roots = [join(resolveDshHome(), "skills"), join(resolveAgentsHome(), "skills")];
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const root of roots) {
    for (const skill of await scanRoot(root)) {
      if (seen.has(skill.name)) continue;
      seen.add(skill.name);
      result.push(skill);
    }
  }
  return result.sort((left, right) => left.name.localeCompare(right.name));
}

// src/features/chat-style/host/standard-rows.ts
var PLAN_MODE_SECTION = `You are in plan mode. Stay in plan mode until the user approves your plan through exit_plan_mode or switches the session mode. Imperative language to implement changes means plan the implementation, not execute it. A user's conversational agreement \u2014 including an answer confirming something you asked \u2014 approves nothing and does not end plan mode; fold the confirmed decision into the plan and submit it through exit_plan_mode.

Explore first. Use non-mutating reads, searches, static analysis, and checks to ground the plan in the actual repository. Do not edit or write files, change configuration, run formatters or code generation that rewrites tracked files, commit, or otherwise carry out the plan. Prefer existing functions and patterns over new machinery.

The tool catalog stays the same across modes for request-cache stability. These plan-mode rules override any later tool description or guidance that suggests using mutation tools; those tools remain listed to keep the tool catalog unchanged. Do not use todo_write to track this planning phase: it tracks implementation after an approved plan, while the plan itself belongs in exit_plan_mode.

Resolve discoverable facts by inspection. Use ask_user_question only for user-owned choices or material ambiguity that inspection cannot answer. Do not ask the user where code lives or how current behavior works when you can find out.

Make the plan decision-complete: state the goal and success criteria; group implementation changes by subsystem; identify public API, schema, and data-flow changes; cover edge cases, failure modes, tests, acceptance criteria, and explicit assumptions. Keep it concise enough to review but detailed enough that another engineer can implement it without making design decisions.

When ready, call exit_plan_mode with the complete plan markdown, starting with a # title. Make exit_plan_mode the only and final tool call in that assistant response: it presents the plan for approval, and implementation begins only in a later step after approval. Do not paste the final plan as a plain reply or ask "should I proceed?" through prose or ask_user_question. If review rejects it, incorporate the feedback and present again. If the review channel is unavailable or aborted, stay in plan mode and ask the user to switch modes manually; do not proceed with implementation.`;
var TERMINAL_ITEM = process.platform === "win32" ? {
  id: "tool-terminal",
  label: "\u7EC8\u7AEF\u547D\u4EE4",
  description: "Windows PowerShell \u547D\u4EE4\u6267\u884C\u5DE5\u5177\u3002",
  kind: "standard",
  rows: [{ id: "tool-pwsh", name: "@deepseek-ai/dsh-tool-pwsh" }]
} : {
  id: "tool-terminal",
  label: "\u7EC8\u7AEF\u547D\u4EE4",
  description: "Bash \u547D\u4EE4\u6267\u884C\u5DE5\u5177\u3002",
  kind: "standard",
  rows: [{ id: "tool-bash", name: "@deepseek-ai/dsh-tool-bash" }]
};
var STANDARD_PLUGIN_ITEMS = [
  {
    id: "agent-instructions",
    label: "\u9879\u76EE\u8BF4\u660E",
    description: "\u8BFB\u53D6\u5DE5\u4F5C\u533A\u7684 AGENTS.md \u7B49\u8BF4\u660E\u6587\u4EF6\u5E76\u6CE8\u5165\u4E0A\u4E0B\u6587\u3002",
    kind: "standard",
    rows: [
      {
        id: "agent-instructions",
        name: "@deepseek-ai/dsh-agent-instructions",
        config: { maxBytes: 65536 }
      }
    ]
  },
  {
    id: "time-context",
    label: "\u65F6\u95F4\u4E0A\u4E0B\u6587",
    description: "\u628A\u5F53\u524D\u65E5\u671F\u4E0E\u65F6\u95F4\u6CE8\u5165\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3002",
    kind: "standard",
    rows: [{ id: "time-context", name: "@deepseek-ai/dsh-time-context" }]
  },
  TERMINAL_ITEM,
  {
    id: "tool-fs",
    label: "\u6587\u4EF6\u8BFB\u5199",
    description: "\u8BFB\u53D6\u3001\u5199\u5165\u4E0E\u7F16\u8F91\u5DE5\u4F5C\u533A\u6587\u4EF6\u3002",
    kind: "standard",
    rows: [{ id: "tool-fs", name: "@deepseek-ai/dsh-tool-fs" }]
  },
  {
    id: "tool-fs-search",
    label: "\u6587\u4EF6\u68C0\u7D22",
    description: "\u6309\u6587\u4EF6\u540D\u4E0E\u5185\u5BB9\u641C\u7D22\u5DE5\u4F5C\u533A\u3002",
    kind: "standard",
    rows: [
      {
        id: "tool-fs-search",
        name: "@deepseek-ai/dsh-tool-fs-search",
        config: { sampleOverCapGlobResults: false }
      }
    ]
  },
  {
    id: "tool-jobs",
    label: "\u540E\u53F0\u4EFB\u52A1",
    description: "\u542F\u52A8\u3001\u67E5\u770B\u4E0E\u505C\u6B62\u540E\u53F0\u547D\u4EE4\u3002",
    kind: "standard",
    rows: [{ id: "tool-jobs", name: "@deepseek-ai/dsh-tool-jobs" }]
  },
  {
    id: "tool-schedule",
    label: "\u5B9A\u65F6\u4EFB\u52A1",
    description: "\u521B\u5EFA\u6309\u65F6\u95F4\u89E6\u53D1\u7684\u4EFB\u52A1\u3002",
    kind: "standard",
    rows: [{ id: "tool-schedule", name: "@deepseek-ai/dsh-tool-schedule" }]
  },
  {
    id: "tool-goal",
    label: "\u76EE\u6807",
    description: "\u8BBE\u5B9A\u4E0E\u8FFD\u8E2A\u591A\u8F6E\u4EFB\u52A1\u76EE\u6807\u3002",
    kind: "standard",
    rows: [
      { id: "command-goal", name: "@deepseek-ai/dsh-command-goal" },
      { id: "tool-goal", name: "@deepseek-ai/dsh-tool-goal" }
    ]
  },
  {
    id: "plan-mode",
    label: "\u8BA1\u5212\u6A21\u5F0F",
    description: "\u5148\u51FA\u8BA1\u5212\u3001\u7ECF\u786E\u8BA4\u540E\u518D\u6267\u884C\u7684\u534F\u4F5C\u6A21\u5F0F\u3002",
    kind: "standard",
    rows: [
      {
        id: "planning",
        name: "cordis:group",
        group: true,
        isolate: { planMode: true },
        config: [
          {
            id: "plan-mode",
            name: "@deepseek-ai/dsh-plan-mode",
            config: { section: PLAN_MODE_SECTION }
          }
        ]
      }
    ]
  },
  {
    id: "compaction",
    label: "\u4E0A\u4E0B\u6587\u538B\u7F29",
    description: "\u957F\u4F1A\u8BDD\u81EA\u52A8\u538B\u7F29\u4E0E\u5DE5\u5177\u7ED3\u679C\u88C1\u526A\u3002",
    kind: "standard",
    rows: [
      {
        id: "compaction",
        name: "cordis:group",
        group: true,
        isolate: { compaction: true, toolResultPruner: true },
        config: [
          { id: "compaction-basic", name: "@deepseek-ai/dsh-compaction-basic" },
          { id: "command-compact", name: "@deepseek-ai/dsh-command-compact" },
          {
            id: "tool-result-pruner",
            name: "@deepseek-ai/dsh-compaction-tool-result-pruner",
            config: { thresholdChars: 8192, headChars: 4096, tailChars: 1024 }
          }
        ]
      }
    ]
  },
  {
    id: "delegation",
    label: "\u5B50\u667A\u80FD\u4F53",
    description: "\u6D3E\u53D1\u5B50\u4EFB\u52A1\u3001\u5DE5\u4F5C\u6D41\u4E0E\u5E76\u884C\u6267\u884C\u3002",
    kind: "standard",
    rows: [
      {
        id: "delegation",
        name: "cordis:group",
        group: true,
        isolate: { workflowEngine: true },
        config: [
          { id: "tool-subagent-control", name: "@deepseek-ai/dsh-tool-subagent-control" },
          {
            id: "tool-subagent-list-agents",
            name: "@deepseek-ai/dsh-tool-subagent-control/list-agents"
          },
          {
            id: "tool-subagent",
            name: "@deepseek-ai/dsh-tool-subagent",
            config: { provider: "spawn", toolName: "subagent", modelSelectionSettings: true }
          },
          {
            id: "tool-subagent-fork",
            name: "@deepseek-ai/dsh-tool-subagent",
            config: { provider: "fork", toolName: "subagent_fork" }
          },
          {
            id: "workflow-ptc",
            name: "@deepseek-ai/dsh-workflow-ptc",
            config: { provider: "spawn" }
          },
          { id: "tool-workflow", name: "@deepseek-ai/dsh-tool-workflow" }
        ]
      }
    ]
  },
  {
    id: "tool-ask-user",
    label: "\u8BE2\u95EE\u7528\u6237",
    description: "\u9700\u8981\u51B3\u7B56\u65F6\u5411\u7528\u6237\u63D0\u95EE\u3002",
    kind: "standard",
    rows: [{ id: "tool-ask-user", name: "@deepseek-ai/dsh-tool-ask-user" }]
  },
  {
    id: "tool-todo",
    label: "\u5F85\u529E\u6E05\u5355",
    description: "\u5728\u957F\u4EFB\u52A1\u4E2D\u7EF4\u62A4\u5F85\u529E\u5217\u8868\u3002",
    kind: "standard",
    rows: [
      {
        id: "tool-todo",
        name: "@deepseek-ai/dsh-tool-todo",
        config: { allowParallelInProgress: true }
      }
    ]
  },
  {
    id: "tool-web",
    label: "\u7F51\u9875\u641C\u7D22",
    description: "\u641C\u7D22\u4E0E\u6293\u53D6\u7F51\u9875\u5185\u5BB9\u3002",
    kind: "standard",
    rows: [
      {
        id: "tool-web",
        name: "@deepseek-ai/dsh-tool-web",
        config: { fetch: true, searchTimeoutMs: 6e4 }
      }
    ]
  },
  {
    id: "present",
    label: "\u4EA4\u4ED8\u7269\u5C55\u793A",
    description: "\u628A\u7ED3\u679C\u4EE5\u6587\u4EF6\u6216\u9875\u9762\u5F62\u5F0F\u5C55\u793A\u7ED9\u7528\u6237\u3002",
    kind: "standard",
    rows: [{ id: "present", name: "@deepseek-ai/dsh-tool-present" }]
  }
];

// src/features/chat-style/host/catalog.ts
var SELF_PACKAGE = "dsh-all-in-one";
async function findInstalledPlugins() {
  const profilesRoot = join2(resolveDshHome(), "profiles");
  const names = /* @__PURE__ */ new Set();
  let profiles;
  try {
    profiles = await readdir2(profilesRoot, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("[chat-style] \u8BFB\u53D6 profile \u76EE\u5F55\u5931\u8D25:", profilesRoot, error);
    return [];
  }
  for (const profile of profiles) {
    if (!profile.isDirectory()) continue;
    const manifestPath = join2(profilesRoot, profile.name, "package.json");
    try {
      const manifest = JSON.parse(await readFile2(manifestPath, "utf8"));
      for (const name of Object.keys(manifest.dependencies ?? {})) {
        if (name.startsWith("dsh-plugin-") && name !== SELF_PACKAGE) names.add(name);
      }
    } catch (error) {
      console.error("[chat-style] \u8BFB\u53D6 profile \u4F9D\u8D56\u5931\u8D25:", manifestPath, error);
    }
    const modulesRoot = join2(profilesRoot, profile.name, "node_modules");
    try {
      const modules = await readdir2(modulesRoot, { withFileTypes: true });
      for (const entry of modules) {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
        if (entry.name.startsWith("dsh-plugin-") && entry.name !== SELF_PACKAGE) {
          names.add(entry.name);
        }
      }
    } catch (error) {
      console.error("[chat-style] \u8BFB\u53D6 profile \u63D2\u4EF6\u76EE\u5F55\u5931\u8D25:", modulesRoot, error);
    }
  }
  return [...names].sort((left, right) => left.localeCompare(right));
}
function installedRowId(packageName) {
  return `pkg-${packageName.replace(/[^A-Za-z0-9_-]/g, "-")}`;
}
async function listPluginCatalog() {
  const installed = (await findInstalledPlugins()).map((packageName) => ({
    id: `pkg:${packageName}`,
    label: packageName,
    description: "\u5DF2\u5B89\u88C5\u63D2\u4EF6\u3002\u82E5\u5B83\u5DF2\u5728 profile \u4E2D\u5168\u5C40\u52A0\u8F7D\uFF0C\u91CD\u590D\u6302\u8F7D\u53EF\u80FD\u51B2\u7A81\uFF0C\u8BF7\u8C28\u614E\u52FE\u9009\u3002",
    kind: "installed",
    packageName
  }));
  return { standard: STANDARD_PLUGIN_ITEMS, installed };
}
async function listPluginItems() {
  const { standard, installed } = await listPluginCatalog();
  return [
    ...standard.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
    ...installed.map(({ id, label, description, kind }) => ({ id, label, description, kind }))
  ];
}
function selectPluginRows(rule, installed) {
  const selected = new Set(rule.items);
  const rows = [];
  const push = (item) => {
    for (const row of item.rows) {
      if (rows.some((existing) => existing.id === row.id)) continue;
      rows.push(row);
    }
  };
  switch (rule.mode) {
    case "all":
      for (const item of STANDARD_PLUGIN_ITEMS) push(item);
      break;
    case "exclude":
      for (const item of STANDARD_PLUGIN_ITEMS) {
        if (!selected.has(item.id)) push(item);
      }
      break;
    case "include":
      for (const item of STANDARD_PLUGIN_ITEMS) {
        if (selected.has(item.id)) push(item);
      }
      for (const item of installed) {
        if (!selected.has(item.id)) continue;
        rows.push({ id: installedRowId(item.packageName), name: item.packageName });
      }
      break;
    default:
      break;
  }
  return rows;
}

// src/features/chat-style/host/skill-links.ts
import { mkdir, rm, symlink } from "node:fs/promises";
import { join as join3 } from "node:path";
function chatStylesRoot() {
  return join3(resolveDshHome(), "all-in-one", "chat-styles");
}
function styleSkillDir(styleId) {
  return join3(chatStylesRoot(), styleId, "skills");
}
function selectSkills(rule, all) {
  const selected = new Set(rule.items);
  switch (rule.mode) {
    case "all":
      return all;
    case "include":
      return all.filter((skill) => selected.has(skill.name));
    case "exclude":
      return all.filter((skill) => !selected.has(skill.name));
    default:
      return [];
  }
}
async function syncStyleSkillDir(styleId, skills) {
  const dir = styleSkillDir(styleId);
  try {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    for (const skill of skills) {
      const target = join3(dir, `${skill.name}${skill.kind === "file" ? ".md" : ""}`);
      await symlink(skill.path, target, skill.kind === "directory" ? "dir" : "file");
    }
    return dir;
  } catch (error) {
    console.error("[chat-style] \u540C\u6B65\u6280\u80FD\u76EE\u5F55\u5931\u8D25:", dir, error);
    throw error;
  }
}
async function removeStyleSkillDir(styleId) {
  const dir = join3(chatStylesRoot(), styleId);
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (error) {
    console.error("[chat-style] \u5220\u9664\u6280\u80FD\u76EE\u5F55\u5931\u8D25:", dir, error);
  }
}

// src/features/chat-style/host/composition.ts
var PROMPT_ROW_NAME = "dsh-all-in-one/preset-style";
var SKILL_FILESYSTEM_ROW = "@deepseek-ai/dsh-skill-filesystem";
var TOOL_SKILL_ROW = "@deepseek-ai/dsh-tool-skill";
var MCP_CLIENT_ROW = "@deepseek-ai/dsh-mcp-client";
function mcpRowConfig(server) {
  const base = { serverName: server.id };
  if (server.transport === "stdio") {
    return {
      ...base,
      transport: "stdio",
      command: server.command,
      args: server.args.filter((arg) => arg !== ""),
      ...Object.keys(server.env).length > 0 ? { env: server.env } : {}
    };
  }
  return {
    ...base,
    transport: "streamable-http",
    url: server.url,
    ...Object.keys(server.headers).length > 0 ? { headers: server.headers } : {}
  };
}
function selectMcpServers(style) {
  const selected = new Set(style.mcp.items);
  switch (style.mcp.mode) {
    case "all":
      return style.mcpServers;
    case "include":
      return style.mcpServers.filter((server) => selected.has(server.id));
    case "exclude":
      return style.mcpServers.filter((server) => !selected.has(server.id));
    default:
      return [];
  }
}
async function buildPresetRows(style) {
  const rows = [];
  if (style.systemPrompt.trim() !== "") {
    rows.push({
      id: "chat-style-prompt",
      name: PROMPT_ROW_NAME,
      config: { text: style.systemPrompt }
    });
  }
  const { installed } = await listPluginCatalog();
  rows.push(...selectPluginRows(style.plugins, installed));
  const skillConfig = style.skills.mode === "all" ? { includeDefaultRoots: true } : { includeDefaultRoots: false, customSkillDirs: [styleSkillDir(style.id)] };
  rows.push({ id: "skill-filesystem", name: SKILL_FILESYSTEM_ROW, config: skillConfig });
  rows.push({ id: "tool-skill", name: TOOL_SKILL_ROW });
  for (const server of selectMcpServers(style)) {
    rows.push({ id: `mcp-${server.id}`, name: MCP_CLIENT_ROW, config: mcpRowConfig(server) });
  }
  return rows;
}

// src/features/chat-style/host/presets.ts
var PRESET_ID_PREFIX = "style-";
var PRESET_ORDER_BASE = 200;
var disposers = /* @__PURE__ */ new Map();
async function unregisterStylePreset(styleId) {
  const dispose = disposers.get(styleId);
  if (!dispose) return;
  disposers.delete(styleId);
  try {
    await dispose();
  } catch (error) {
    console.error("[chat-style] \u6CE8\u9500\u9884\u8BBE\u5931\u8D25:", styleId, error);
  }
}
async function registerStylePreset(api, style, order) {
  await unregisterStylePreset(style.id);
  try {
    const plugins = await buildPresetRows(style);
    const dispose = await api.register({
      id: `${PRESET_ID_PREFIX}${style.id}`,
      name: style.name,
      description: style.description,
      order: PRESET_ORDER_BASE + order,
      plugins
    });
    disposers.set(style.id, dispose);
  } catch (error) {
    console.error("[chat-style] \u6CE8\u518C\u9884\u8BBE\u5931\u8D25:", style.id, error);
  }
}
async function registerAllStylePresets(api, styles) {
  for (const styleId of [...disposers.keys()]) await unregisterStylePreset(styleId);
  for (const [index, style] of styles.entries()) {
    await registerStylePreset(api, style, index);
  }
}
async function disposeStylePresets() {
  for (const styleId of [...disposers.keys()]) await unregisterStylePreset(styleId);
}

// src/features/chat-style/host/store.ts
import { mkdir as mkdir2, readFile as readFile3, rename, writeFile } from "node:fs/promises";
import { dirname, join as join4 } from "node:path";
var RULE_MODES = ["all", "include", "exclude"];
var STYLE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
function chatStylesFile() {
  return join4(resolveDshHome(), "all-in-one", "chat-styles.json");
}
function isValidStyleId(id) {
  return STYLE_ID_PATTERN.test(id);
}
function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function stringDict(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") result[key] = item;
  }
  return result;
}
function normalizeRule(value) {
  if (typeof value !== "object" || value === null) return { mode: "all", items: [] };
  const candidate = value;
  const mode = RULE_MODES.find((item) => item === candidate.mode) ?? "all";
  return { mode, items: stringList(candidate.items) };
}
function normalizeMcpServer(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const candidate = value;
  const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(id)) return void 0;
  const transport = candidate.transport === "streamable-http" ? "streamable-http" : "stdio";
  const command = typeof candidate.command === "string" ? candidate.command : "";
  const url = typeof candidate.url === "string" ? candidate.url : "";
  if (transport === "stdio" && command.trim() === "") return void 0;
  if (transport === "streamable-http" && url.trim() === "") return void 0;
  return {
    id,
    label: typeof candidate.label === "string" ? candidate.label : id,
    transport,
    command,
    args: stringList(candidate.args),
    env: stringDict(candidate.env),
    url,
    headers: stringDict(candidate.headers)
  };
}
function normalizeStyle(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const candidate = value;
  const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  if (!STYLE_ID_PATTERN.test(id) || name === "") return void 0;
  const seenServers = /* @__PURE__ */ new Set();
  const mcpServers = Array.isArray(candidate.mcpServers) ? candidate.mcpServers.map(normalizeMcpServer).filter((server) => {
    if (server === void 0 || seenServers.has(server.id)) return false;
    seenServers.add(server.id);
    return true;
  }) : [];
  return {
    id,
    name,
    description: typeof candidate.description === "string" ? candidate.description : "",
    systemPrompt: typeof candidate.systemPrompt === "string" ? candidate.systemPrompt : "",
    skills: normalizeRule(candidate.skills),
    plugins: normalizeRule(candidate.plugins),
    mcp: normalizeRule(candidate.mcp),
    mcpServers
  };
}
async function readStyles() {
  const file = chatStylesFile();
  try {
    const raw = await readFile3(file, "utf8");
    const parsed = JSON.parse(raw);
    const styles = Array.isArray(parsed.styles) ? parsed.styles.map(normalizeStyle).filter((style) => style !== void 0) : [];
    return { version: 1, styles };
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[chat-style] \u8BFB\u53D6\u98CE\u683C\u914D\u7F6E\u5931\u8D25:", file, error);
    }
    return { version: 1, styles: [] };
  }
}
async function writeStyles(document) {
  const file = chatStylesFile();
  const temp = `${file}.tmp`;
  try {
    await mkdir2(dirname(file), { recursive: true });
    await writeFile(temp, `${JSON.stringify(document, null, 2)}
`, "utf8");
    await rename(temp, file);
  } catch (error) {
    console.error("[chat-style] \u5199\u5165\u98CE\u683C\u914D\u7F6E\u5931\u8D25:", file, error);
    throw error;
  }
}

// src/features/chat-style/host/routes.ts
var ROUTE_PATH = "/dsh-all-in-one/chat-styles";
var MAX_BODY_BYTES = 1024 * 1024;
var LOOPBACK_ADDRESSES = /* @__PURE__ */ new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
function isLocalRequest(request) {
  const address = request.socket.remoteAddress ?? "";
  return LOOPBACK_ADDRESSES.has(address);
}
function sendJson(response, status, body) {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(text)
  });
  response.end(text);
}
async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) return void 0;
    chunks.push(buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    console.error("[chat-style] \u89E3\u6790\u8BF7\u6C42\u4F53\u5931\u8D25:", error);
    return void 0;
  }
}
async function buildPayload() {
  const document = await readStyles();
  const skills = await listSkillEntries();
  const plugins = await listPluginItems();
  return {
    styles: document.styles,
    catalog: {
      skills: skills.map(({ name, description }) => ({ name, description })),
      plugins
    },
    storagePath: chatStylesFile()
  };
}
async function syncSkills(style, allSkills) {
  if (style.skills.mode === "all") {
    await removeStyleSkillDir(style.id);
    return;
  }
  await syncStyleSkillDir(style.id, selectSkills(style.skills, allSkills));
}
async function saveStyle(style) {
  const allSkills = await listSkillEntries();
  await syncSkills(style, allSkills);
  const document = await readStyles();
  const index = document.styles.findIndex((item) => item.id === style.id);
  if (index >= 0) document.styles[index] = style;
  else document.styles.push(style);
  await writeStyles(document);
  return buildPayload();
}
async function deleteStyle(styleId) {
  const document = await readStyles();
  document.styles = document.styles.filter((style) => style.id !== styleId);
  await writeStyles(document);
  await removeStyleSkillDir(styleId);
  return buildPayload();
}
var writeChain = Promise.resolve();
async function handleWrite(request, api) {
  if (request.action === "delete") {
    if (!isValidStyleId(request.id)) throw new Error("\u98CE\u683C\u6807\u8BC6\u65E0\u6548");
    const payload2 = await deleteStyle(request.id);
    await unregisterStylePreset(request.id);
    return payload2;
  }
  const style = normalizeStyle(request.style);
  if (!style) throw new Error("\u98CE\u683C\u5B9A\u4E49\u65E0\u6548");
  const payload = await saveStyle(style);
  const order = payload.styles.findIndex((item) => item.id === style.id);
  await registerStylePreset(api, style, Math.max(order, 0));
  return payload;
}
function installChatStyleRoutes(webServer, api) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: "\u53EA\u5141\u8BB8\u672C\u673A\u8BBF\u95EE" });
        return;
      }
      try {
        if (request.method === "GET") {
          sendJson(response, 200, await buildPayload());
          return;
        }
        if (request.method === "POST") {
          const body = await readJsonBody(request);
          if (!body || typeof body !== "object") {
            sendJson(response, 400, { error: "\u8BF7\u6C42\u4F53\u4E0D\u662F\u5408\u6CD5 JSON" });
            return;
          }
          const task = writeChain.then(
            () => handleWrite(body, api)
          );
          writeChain = task.catch((error) => {
            console.error("[chat-style] \u5199\u5165\u98CE\u683C\u5931\u8D25:", error);
          });
          sendJson(response, 200, await task);
          return;
        }
        response.writeHead(405, { allow: "GET, POST" });
        response.end();
      } catch (error) {
        console.error("[chat-style] \u5904\u7406\u98CE\u683C\u8BF7\u6C42\u5931\u8D25:", error);
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });
}

// src/features/chat-style/host.ts
var inject = ["agentPresets"];
function apply(ctx) {
  const api = ctx.agentPresets;
  if (!api) {
    console.error("[chat-style] \u672A\u53D6\u5F97 agentPresets \u670D\u52A1\uFF0C\u98CE\u683C\u9884\u8BBE\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  ctx.effect(() => {
    let disposed = false;
    void (async () => {
      const document = await readStyles();
      if (disposed) return;
      await registerAllStylePresets(api, document.styles);
    })();
    return () => {
      disposed = true;
      void disposeStylePresets();
    };
  }, "chat-style: presets");
  ctx.inject(["webServer"], (host) => {
    host.effect(() => installChatStyleRoutes(resolveWebServer(host), api), "chat-style: routes");
  });
}
function resolveWebServer(ctx) {
  if (!ctx.webServer) throw new Error("chat-style: webServer \u670D\u52A1\u4E0D\u53EF\u7528");
  return ctx.webServer;
}

// src/features/expand-process/host.ts
var host_exports2 = {};
__export(host_exports2, {
  apply: () => apply2,
  inject: () => inject2
});

// src/features/expand-process/expand-process.ts
var EXPAND_PROCESS_STORAGE_KEY = "dsh-all-in-one:expand-process";
function bootExpandProcess(storageKey) {
  const win = window;
  if (win["__DSH_ALL_IN_ONE_EXPAND_PROCESS__"]) return;
  win["__DSH_ALL_IN_ONE_EXPAND_PROCESS__"] = true;
  win["__DSH_EXPAND_PROCESS_ENABLED__"] = function enabled() {
    try {
      return window.localStorage.getItem(storageKey) === "1";
    } catch (error) {
      console.error("[expand-process] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
      return false;
    }
  };
  const RULES = {
    "@deepseek-ai/dsh-client-ui-tool": [
      [
        "const { expanded, toggle: toggleExpand } = useDisclosure();",
        "const { toggle: toggleExpand } = useDisclosure(); const expanded = window.__DSH_EXPAND_PROCESS_ENABLED__();"
      ]
    ],
    "@deepseek-ai/dsh-client-ui-chat": [
      [
        "const { expanded, toggle } = useDisclosure();",
        "const { toggle } = useDisclosure(); const expanded = window.__DSH_EXPAND_PROCESS_ENABLED__();"
      ]
    ]
  };
  function patch(registration) {
    if (!registration || registration["__dshPatched"] || typeof registration.id !== "string") return;
    const rules = RULES[registration.id];
    if (!rules || typeof registration.factory !== "function") return;
    try {
      const src = Function.prototype.toString.call(registration.factory);
      let patched = true;
      for (const [, next] of rules) {
        if (src.indexOf(next) === -1) patched = false;
      }
      if (patched) {
        registration["__dshPatched"] = true;
        console.info("[expand-process] \u5DF2\u662F\u5F00\u5173\u7248\uFF0C\u8DF3\u8FC7 " + registration.id);
        return;
      }
      let output = src;
      for (const [previous, next] of rules) output = output.split(previous).join(next);
      if (output === src) {
        registration["__dshPatched"] = true;
        console.warn("[expand-process] \u89C4\u5219\u672A\u547D\u4E2D " + registration.id + "\uFF0CUI \u5B9E\u73B0\u53EF\u80FD\u5DF2\u53D8\u5316");
        return;
      }
      registration.factory = (0, eval)("(" + output + ")");
      registration["__dshPatched"] = true;
      console.info("[expand-process] \u5DF2\u63A5\u7BA1 " + registration.id);
    } catch (error) {
      console.warn("[expand-process] \u6539\u5199\u5931\u8D25 " + registration.id, error);
    }
  }
  function patchQueue(loader) {
    const queue = loader.pendingQueue;
    if (!queue || !queue.length) return;
    for (const registration of queue) patch(registration);
  }
  function wrapLoad(loader) {
    const load = loader.load;
    if (typeof load !== "function") return;
    if (load["__dshPatched"]) return;
    const wrapped = function(registration) {
      patch(registration);
      return load.call(this, registration);
    };
    wrapped["__dshPatched"] = true;
    loader.load = wrapped;
  }
  function wrap(loader) {
    if (!loader["__dshPatched"] && typeof loader.create === "function") {
      loader["__dshPatched"] = true;
      const create = loader.create;
      loader.create = function(options) {
        patchQueue(loader);
        const result = create.call(this, options);
        wrapLoad(loader);
        return result;
      };
    }
    wrapLoad(loader);
    return loader;
  }
  let currentLoader = win["__ModuleLoader__"];
  if (currentLoader) wrap(currentLoader);
  try {
    Object.defineProperty(window, "__ModuleLoader__", {
      configurable: true,
      enumerable: true,
      get() {
        return currentLoader;
      },
      set(value) {
        currentLoader = wrap(value);
      }
    });
  } catch (error) {
    console.warn("[expand-process] \u65E0\u6CD5\u6302\u8F7D\u6A21\u5757\u94A9\u5B50", error);
  }
}
var EXPAND_PROCESS_SCRIPT = `(${bootExpandProcess.toString()})(${JSON.stringify(EXPAND_PROCESS_STORAGE_KEY)});`;

// src/features/expand-process/host.ts
var inject2 = ["webServer"];
function apply2(ctx) {
  ctx.effect(
    () => ctx.on("webserver/index-inject", (table) => {
      table.unshift({ kind: "script", placement: "head", text: EXPAND_PROCESS_SCRIPT });
    })
  );
}

// src/features/host.ts
var featureHosts = [host_exports2, host_exports];

// src/index.ts
var inject3 = Array.from(new Set(featureHosts.flatMap((feature) => feature.inject ?? [])));
function apply3(ctx) {
  for (const feature of featureHosts) feature.apply(ctx);
}
export {
  apply3 as apply,
  inject3 as inject
};
