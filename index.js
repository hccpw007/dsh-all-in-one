var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/features/power-pack/host.ts
var host_exports = {};
__export(host_exports, {
  apply: () => apply,
  inject: () => inject
});

// src/features/power-pack/host/skill-links.ts
import { mkdir, rm, symlink } from "node:fs/promises";
import { join as join2 } from "node:path";

// src/common/dsh-home.ts
import { homedir } from "node:os";
import { join } from "node:path";
function resolveDshHome() {
  const configured = process.env.DSH_HOME?.trim();
  if (configured) return configured;
  return join(homedir(), ".dsh");
}

// src/features/power-pack/host/skill-links.ts
function powerPacksRoot() {
  return join2(resolveDshHome(), "all-in-one", "power-packs");
}
function packSkillDir(packId) {
  return join2(powerPacksRoot(), packId, "skills");
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
async function syncPackSkillDir(packId, skills) {
  const dir = packSkillDir(packId);
  try {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    for (const skill of skills) {
      const target = join2(dir, `${skill.name}${skill.kind === "file" ? ".md" : ""}`);
      await symlink(skill.path, target, skill.kind === "directory" ? "dir" : "file");
    }
    return dir;
  } catch (error) {
    console.error("[power-pack] \u540C\u6B65\u6280\u80FD\u76EE\u5F55\u5931\u8D25:", dir, error);
    throw error;
  }
}
async function removePackSkillDir(packId) {
  const dir = join2(powerPacksRoot(), packId);
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (error) {
    console.error("[power-pack] \u5220\u9664\u6280\u80FD\u76EE\u5F55\u5931\u8D25:", dir, error);
  }
}

// src/features/power-pack/host/composition.ts
var PROMPT_ROW_NAME = "dsh-all-in-one/preset-pack";
var ISOLATE_ROW_NAME = "dsh-all-in-one/preset-isolate";
var SKILL_FILESYSTEM_ROW = "@deepseek-ai/dsh-skill-filesystem";
var TOOL_SKILL_ROW = "@deepseek-ai/dsh-tool-skill";
function buildPackRows(pack, isolate) {
  const rows = [];
  if (isolate !== void 0) {
    rows.push({ id: "power-pack-isolate", name: ISOLATE_ROW_NAME, config: isolate });
  }
  if (pack.systemPrompt.trim() !== "") {
    rows.push({
      id: "power-pack-prompt",
      name: PROMPT_ROW_NAME,
      config: { text: pack.systemPrompt }
    });
  }
  const skillConfig = pack.skills.mode === "all" ? { includeDefaultRoots: true } : { includeDefaultRoots: false, customSkillDirs: [packSkillDir(pack.id)] };
  rows.push({ id: "skill-filesystem", name: SKILL_FILESYSTEM_ROW, config: skillConfig });
  rows.push({ id: "tool-skill", name: TOOL_SKILL_ROW });
  return rows;
}

// src/features/power-pack/host/isolation.ts
function isDenied(rule, id) {
  const selected = rule.items.includes(id);
  switch (rule.mode) {
    case "include":
      return !selected;
    case "exclude":
      return selected;
    default:
      return false;
  }
}
function sectionPrefixes(packageName) {
  const short = packageName.replace(/^dsh-plugin-/, "").replace(/^dsh-/, "");
  return [...new Set([packageName, short].filter((item) => item !== "").map((item) => item.toLowerCase()))];
}
function deniedMcpServers(rule) {
  if (rule.mode !== "exclude") return [];
  const servers = rule.items.filter((id) => id.startsWith("mcp:") && id.length > 4).map((id) => id.slice(4));
  return [...new Set(servers)];
}
function planIsolation(pack, groups) {
  const denied = groups.filter(
    (group) => isDenied(group.id.startsWith("mcp:") ? pack.mcp : pack.plugins, group.id)
  );
  const denyTools = [
    ...new Set(denied.filter((group) => !group.id.startsWith("mcp:")).flatMap((group) => group.tools))
  ].sort((left, right) => left.localeCompare(right));
  const mcpServers = new Set(deniedMcpServers(pack.mcp));
  for (const group of denied) {
    if (!group.id.startsWith("mcp:")) continue;
    mcpServers.add(group.id.slice(4));
  }
  const denyMcpServers = [...mcpServers].sort((left, right) => left.localeCompare(right));
  const hideSections = /* @__PURE__ */ new Set();
  for (const group of denied) {
    if (!group.id.startsWith("pkg:")) continue;
    for (const prefix of sectionPrefixes(group.id.slice(4))) hideSections.add(prefix);
  }
  for (const server of denyMcpServers) hideSections.add(`mcp:${server}`.toLowerCase());
  if (denyTools.length === 0 && denyMcpServers.length === 0 && hideSections.size === 0) return void 0;
  return {
    denyTools,
    denyMcpServers,
    hideSections: [...hideSections].sort((left, right) => left.localeCompare(right)),
    // 被排除的已装插件会改写系统提示词，工具掩码之外还要丢弃它的注入
    strict: denied.some((group) => group.kind === "installed")
  };
}

// src/features/power-pack/host/standard-rows.ts
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

// src/features/power-pack/host/compose.ts
var SKILL_ROW_NAMES = /* @__PURE__ */ new Set([SKILL_FILESYSTEM_ROW, TOOL_SKILL_ROW]);
function collectKeys(rows) {
  const keys = { ids: /* @__PURE__ */ new Set(), names: /* @__PURE__ */ new Set() };
  for (const row of rows) {
    keys.ids.add(row.id);
    keys.names.add(row.name);
  }
  return keys;
}
var ITEM_KEYS = new Map(
  STANDARD_PLUGIN_ITEMS.map((item) => [item.id, collectKeys(item.rows)])
);
var ALL_KEYS = collectKeys(STANDARD_PLUGIN_ITEMS.flatMap((item) => item.rows));
function isStandardRow(row) {
  return ALL_KEYS.ids.has(row.id) || ALL_KEYS.names.has(row.name);
}
function isSelectedRow(row, selected) {
  for (const itemId of selected) {
    const keys = ITEM_KEYS.get(itemId);
    if (keys === void 0) continue;
    if (keys.ids.has(row.id) || keys.names.has(row.name)) return true;
  }
  return false;
}
function filterByPluginRule(rows, rule) {
  if (rule.mode === "all") return rows;
  const selected = new Set(rule.items);
  if (rule.mode === "include") {
    return rows.filter((row) => !isStandardRow(row) || isSelectedRow(row, selected));
  }
  return rows.filter((row) => !isStandardRow(row) || !isSelectedRow(row, selected));
}
function composePackRows(modeRows, pack, groups) {
  const base = modeRows.filter((row) => !SKILL_ROW_NAMES.has(row.name));
  const rows = filterByPluginRule(base, pack.plugins);
  const isolate = planIsolation(pack, groups);
  for (const row of buildPackRows(pack, isolate)) {
    if (rows.some((existing) => existing.id === row.id)) continue;
    rows.push(row);
  }
  return rows;
}

// src/features/power-pack/host/compose-state.ts
import { mkdir as mkdir3, readFile as readFile2, rename as rename2, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname2, join as join4 } from "node:path";

// src/features/power-pack/host/store.ts
import { mkdir as mkdir2, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join as join3 } from "node:path";
var RULE_MODES = ["all", "include", "exclude"];
var LEGACY_FILE_NAMES = ["skill-packs.json", "chat-styles.json"];
var PACK_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
function powerPacksFile() {
  return join3(resolveDshHome(), "all-in-one", "power-packs.json");
}
function isValidPackId(id) {
  return PACK_ID_PATTERN.test(id);
}
function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function normalizeRule(value) {
  if (typeof value !== "object" || value === null) return { mode: "all", items: [] };
  const candidate = value;
  const mode = RULE_MODES.find((item) => item === candidate.mode) ?? "all";
  return { mode, items: stringList(candidate.items) };
}
function normalizePack(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const candidate = value;
  const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  if (!PACK_ID_PATTERN.test(id) || name === "") return void 0;
  return {
    id,
    name,
    description: typeof candidate.description === "string" ? candidate.description : "",
    systemPrompt: typeof candidate.systemPrompt === "string" ? candidate.systemPrompt : "",
    skills: normalizeRule(candidate.skills),
    plugins: normalizeRule(candidate.plugins),
    mcp: normalizeRule(candidate.mcp)
  };
}
async function parsePackFile(file) {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed.packs) ? parsed.packs : parsed.styles;
    const packs = Array.isArray(list) ? list.map(normalizePack).filter((pack) => pack !== void 0) : [];
    const defaultPackId = typeof parsed.defaultPackId === "string" && packs.some((pack) => pack.id === parsed.defaultPackId) ? parsed.defaultPackId : "";
    return { version: 1, packs, defaultPackId };
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[power-pack] \u8BFB\u53D6\u6280\u80FD\u5305\u914D\u7F6E\u5931\u8D25:", file, error);
    }
    return void 0;
  }
}
async function readPacks() {
  const current = await parsePackFile(powerPacksFile());
  if (current !== void 0) return current;
  for (const name of LEGACY_FILE_NAMES) {
    const migrated = await parsePackFile(join3(resolveDshHome(), "all-in-one", name));
    if (migrated === void 0) continue;
    await writePacks(migrated);
    return migrated;
  }
  return { version: 1, packs: [], defaultPackId: "" };
}
async function writePacks(document) {
  const file = powerPacksFile();
  const temp = `${file}.tmp`;
  try {
    await mkdir2(dirname(file), { recursive: true });
    await writeFile(temp, `${JSON.stringify(document, null, 2)}
`, "utf8");
    await rename(temp, file);
  } catch (error) {
    console.error("[power-pack] \u5199\u5165\u6280\u80FD\u5305\u914D\u7F6E\u5931\u8D25:", file, error);
    throw error;
  }
}

// src/features/power-pack/host/compose-state.ts
var STATE_VERSION = 1;
var MAX_RECENT = 24;
function composeStateFile() {
  return join4(resolveDshHome(), "all-in-one", "compose-state.json");
}
function normalizeSelection(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const candidate = value;
  const pack = typeof candidate.pack === "string" ? candidate.pack.trim() : "";
  const mode = typeof candidate.mode === "string" ? candidate.mode.trim() : "";
  if (!isValidPackId(pack) || mode === "") return void 0;
  return { pack, mode };
}
async function readComposeState() {
  const file = composeStateFile();
  try {
    const raw = await readFile2(file, "utf8");
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed.recent) ? parsed.recent : [];
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const item of list) {
      const selection = normalizeSelection(item);
      if (selection === void 0) continue;
      const key = `${selection.pack}@${selection.mode}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(selection);
    }
    return result;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[power-pack] \u8BFB\u53D6\u7EC4\u5408\u8BB0\u5F55\u5931\u8D25:", file, error);
    }
    return [];
  }
}
async function writeComposeState(recent) {
  const file = composeStateFile();
  const temp = `${file}.tmp`;
  const document = { version: STATE_VERSION, recent: recent.slice(0, MAX_RECENT) };
  try {
    await mkdir3(dirname2(file), { recursive: true });
    await writeFile2(temp, `${JSON.stringify(document, null, 2)}
`, "utf8");
    await rename2(temp, file);
  } catch (error) {
    console.error("[power-pack] \u5199\u5165\u7EC4\u5408\u8BB0\u5F55\u5931\u8D25:", file, error);
  }
}
async function rememberComposed(packId, modeId) {
  const recent = await readComposeState();
  const key = `${packId}@${modeId}`;
  const rest = recent.filter((item) => `${item.pack}@${item.mode}` !== key);
  await writeComposeState([{ pack: packId, mode: modeId }, ...rest]);
}
async function forgetComposedPack(packId) {
  const recent = await readComposeState();
  const kept = recent.filter((item) => item.pack !== packId);
  if (kept.length === recent.length) return;
  await writeComposeState(kept);
}

// src/features/power-pack/host/preset-source.ts
function readPresetRows(api, presetId) {
  const internals = api;
  const rows = internals.definitions?.get(presetId)?.config?.plugins;
  if (!Array.isArray(rows)) return void 0;
  return rows;
}

// src/features/power-pack/host/presets.ts
var PRESET_ID_PREFIX = "power-pack-";
var PRESET_ORDER = 200;
var PRESET_READ_ATTEMPTS = 12;
var PRESET_READ_INTERVAL_MS = 250;
var SHARED_STATE = Symbol.for("dsh-all-in-one.composed-presets");
function sharedComposed() {
  const holder = globalThis;
  const existing = holder[SHARED_STATE];
  if (existing !== void 0) return existing;
  const created = /* @__PURE__ */ new Map();
  holder[SHARED_STATE] = created;
  return created;
}
var composed = sharedComposed();
function composedPresetId(packId, modeId) {
  return `${PRESET_ID_PREFIX}${packId}@${modeId}`;
}
function isComposedPresetId(presetId) {
  return presetId.startsWith(PRESET_ID_PREFIX);
}
function splitComposedPresetId(presetId) {
  const body = presetId.slice(PRESET_ID_PREFIX.length);
  const separator = body.indexOf("@");
  if (separator < 0) return { packId: body, modeId: "" };
  return { packId: body.slice(0, separator), modeId: body.slice(separator + 1) };
}
function delay(ms) {
  return new Promise((resolve3) => {
    setTimeout(resolve3, ms);
  });
}
async function waitPresetRows(api, modeId) {
  for (let attempt = 0; attempt < PRESET_READ_ATTEMPTS; attempt += 1) {
    if (readPresetRows(api, modeId) !== void 0) return true;
    await delay(PRESET_READ_INTERVAL_MS);
  }
  return false;
}
async function disposeOne(preset) {
  composed.delete(preset.key);
  try {
    await preset.dispose();
  } catch (error) {
    console.error("[power-pack] \u6CE8\u9500\u7EC4\u5408\u9884\u8BBE\u5931\u8D25:", preset.id, error);
  }
}
function hasComposedPreset(presetId) {
  for (const preset of composed.values()) {
    if (preset.id === presetId) return true;
  }
  return false;
}
async function pendingComposedMeta() {
  const selections = await readComposeState();
  if (selections.length === 0) return /* @__PURE__ */ new Map();
  const document = await readPacks();
  const byId = new Map(document.packs.map((pack) => [pack.id, pack]));
  const result = /* @__PURE__ */ new Map();
  for (const selection of selections) {
    const pack = byId.get(selection.pack);
    if (pack === void 0) continue;
    const id = composedPresetId(selection.pack, selection.mode);
    if (hasComposedPreset(id)) continue;
    result.set(id, { name: pack.name, description: pack.description });
  }
  return result;
}
async function ensureComposedPreset(api, modeId, pack, groups) {
  const key = `${pack.id}@${modeId}`;
  const existing = composed.get(key);
  if (existing !== void 0) return existing.id;
  const modeRows = readPresetRows(api, modeId);
  if (modeRows === void 0) {
    throw new Error(`\u65E0\u6CD5\u8BFB\u53D6\u6A21\u5F0F ${modeId} \u7684\u7EC4\u5408\u884C`);
  }
  const id = composedPresetId(pack.id, modeId);
  if (readPresetRows(api, id) !== void 0) return id;
  const rows = composePackRows(modeRows, pack, groups);
  try {
    const dispose = await api.register({
      id,
      name: pack.name,
      description: pack.description,
      order: PRESET_ORDER,
      plugins: rows
    });
    composed.set(key, { key, id, dispose });
    return id;
  } catch (error) {
    if (readPresetRows(api, id) !== void 0) return id;
    throw error;
  }
}
async function invalidateComposedPreset(packId) {
  const prefix = `${packId}@`;
  for (const preset of [...composed.values()]) {
    if (!preset.key.startsWith(prefix)) continue;
    await disposeOne(preset);
  }
}
async function disposePackPresets() {
  for (const preset of [...composed.values()]) {
    await disposeOne(preset);
  }
}

// src/features/power-pack/host/context-error.ts
var INACTIVE_CODES = /* @__PURE__ */ new Set(["INACTIVE_EFFECT", "INACTIVE_CONTEXT"]);
function isInactiveContextError(error) {
  if (typeof error !== "object" || error === null) return false;
  const code = error.code;
  if (typeof code === "string" && INACTIVE_CODES.has(code)) return true;
  const message = error.message;
  return typeof message === "string" && message.includes("inactive context");
}

// src/features/power-pack/host/catalog.ts
import { readdir, readFile as readFile3 } from "node:fs/promises";
import { join as join5 } from "node:path";
var SELF_PACKAGE = "dsh-all-in-one";
async function collectProfilePlugins(dir, names) {
  const manifestPath = join5(dir, "package.json");
  try {
    const manifest = JSON.parse(await readFile3(manifestPath, "utf8"));
    const enabled = Array.isArray(manifest.dsh?.profile?.bundles) ? new Set(manifest.dsh.profile.bundles) : /* @__PURE__ */ new Set();
    for (const name of Object.keys(manifest.dependencies ?? {})) {
      if (name.startsWith("@deepseek-ai/") || name === SELF_PACKAGE) continue;
      if (enabled.has(name)) names.add(name);
    }
  } catch (error) {
    console.error("[power-pack] \u8BFB\u53D6 profile \u4F9D\u8D56\u5931\u8D25:", manifestPath, error);
  }
}
async function resolveProfileDirs(currentProfileDir2) {
  if (currentProfileDir2 !== void 0 && currentProfileDir2 !== "") return [currentProfileDir2];
  const profilesRoot = join5(resolveDshHome(), "profiles");
  try {
    const profiles = await readdir(profilesRoot, { withFileTypes: true });
    return profiles.filter((profile) => profile.isDirectory() && profile.name !== "node_modules").map((profile) => join5(profilesRoot, profile.name));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("[power-pack] \u8BFB\u53D6 profile \u76EE\u5F55\u5931\u8D25:", profilesRoot, error);
    return [];
  }
}
async function findInstalledPlugins(currentProfileDir2) {
  const names = /* @__PURE__ */ new Set();
  for (const dir of await resolveProfileDirs(currentProfileDir2)) {
    await collectProfilePlugins(dir, names);
  }
  return [...names].sort((left, right) => left.localeCompare(right));
}
async function listPluginCatalog(currentProfileDir2) {
  const installed = (await findInstalledPlugins(currentProfileDir2)).map(
    (packageName) => ({
      id: `pkg:${packageName}`,
      label: packageName,
      description: "\u5DF2\u5728 profile \u4E2D\u5168\u5C40\u52A0\u8F7D\u3002\u52FE\u9009\u8868\u793A\u4FDD\u7559\u5728\u6280\u80FD\u5305\u4F1A\u8BDD\u91CC\uFF0C\u53D6\u6D88\u52FE\u9009\u4F1A\u5C4F\u853D\u5B83\u7684\u5DE5\u5177\u4E0E\u63D0\u793A\u8BCD\u6CE8\u5165\u3002",
      kind: "installed",
      packageName
    })
  );
  return { standard: STANDARD_PLUGIN_ITEMS, installed };
}
async function listPluginItems(currentProfileDir2) {
  const { standard, installed } = await listPluginCatalog(currentProfileDir2);
  return [
    ...standard.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
    ...installed.map(({ id, label, description, kind }) => ({ id, label, description, kind }))
  ];
}

// src/features/power-pack/host/package-scan.ts
import { readFile as readFile4, readdir as readdir2 } from "node:fs/promises";
import { join as join6 } from "node:path";
var SCAN_MAX_FILES = 120;
var SCAN_MAX_BYTES = 4 * 1024 * 1024;
var SCAN_MAX_FILE_BYTES = 512 * 1024;
var SCAN_SUFFIXES = [".js", ".mjs", ".cjs"];
function toolPrefixes(packageName) {
  const short = packageName.replace(/^dsh-plugin-/, "").replace(/^dsh-/, "");
  const candidates = [packageName, short, short.replace(/-/g, "_"), short.replace(/_/g, "-")];
  return [...new Set(candidates.filter((item) => item !== ""))];
}
function hasPrefix(name, prefixes) {
  return prefixes.some(
    (prefix) => name === prefix || name.startsWith(`${prefix}_`) || name.startsWith(`${prefix}-`) || name.startsWith(`${prefix}.`)
  );
}
async function resolveScanRoots(dir, packageName) {
  const roots = /* @__PURE__ */ new Set([join6(dir, "lib"), join6(dir, "dist")]);
  try {
    const manifest = JSON.parse(await readFile4(join6(dir, "package.json"), "utf8"));
    if (typeof manifest.main === "string" && manifest.main !== "") {
      roots.add(join6(dir, manifest.main.replace(/\/[^/]+$/, "")));
    }
  } catch (error) {
    console.error("[power-pack] \u8BFB\u53D6\u63D2\u4EF6\u6E05\u5355\u5931\u8D25:", packageName, error);
  }
  const existing = [];
  for (const root of roots) {
    try {
      await readdir2(root);
      existing.push(root);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("[power-pack] \u8BFB\u53D6\u63D2\u4EF6\u4EA7\u7269\u76EE\u5F55\u5931\u8D25:", root, error);
      }
    }
  }
  return existing;
}
async function scanOwnedTools(roots, candidates) {
  if (roots.length === 0 || candidates.length === 0) return [];
  const owned = /* @__PURE__ */ new Set();
  let files = 0;
  let bytes = 0;
  for (const root of roots) {
    let entries;
    try {
      entries = await readdir2(root, { recursive: true, withFileTypes: true });
    } catch (error) {
      console.error("[power-pack] \u9012\u5F52\u8BFB\u53D6\u63D2\u4EF6\u4EA7\u7269\u5931\u8D25:", root, error);
      continue;
    }
    for (const entry of entries) {
      if (files >= SCAN_MAX_FILES || bytes >= SCAN_MAX_BYTES) break;
      if (!entry.isFile()) continue;
      if (!SCAN_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) continue;
      const file = join6(entry.parentPath ?? root, entry.name);
      try {
        const text = await readFile4(file, { encoding: "utf8" });
        files += 1;
        bytes += text.length;
        if (text.length > SCAN_MAX_FILE_BYTES) continue;
        for (const name of candidates) {
          if (!owned.has(name) && text.includes(name)) owned.add(name);
        }
      } catch (error) {
        console.error("[power-pack] \u8BFB\u53D6\u63D2\u4EF6\u4EA7\u7269\u5931\u8D25:", file, error);
      }
    }
  }
  return [...owned];
}
async function ownedTools(packageName, globalNames, profileDir) {
  const prefixes = toolPrefixes(packageName);
  const byPrefix = globalNames.filter((name) => hasPrefix(name, prefixes));
  const remaining = globalNames.filter((name) => !byPrefix.includes(name));
  const roots = [];
  for (const dir of await resolveProfileDirs(profileDir)) {
    roots.push(...await resolveScanRoots(join6(dir, "node_modules", packageName), packageName));
  }
  const scanned = await scanOwnedTools(roots, remaining);
  return [.../* @__PURE__ */ new Set([...byPrefix, ...scanned])].sort((left, right) => left.localeCompare(right));
}

// src/features/power-pack/host/global-catalog.ts
var MCP_TOOL_NAME = /^mcp__([A-Za-z0-9_-]{1,32})__/;
function collectGlobalToolNames(tools) {
  if (tools === void 0) return [];
  try {
    const schemas = tools.schemas();
    const names = /* @__PURE__ */ new Set();
    for (const schema of schemas) {
      if (typeof schema?.name === "string" && schema.name !== "") names.add(schema.name);
    }
    return [...names];
  } catch (error) {
    console.error("[power-pack] \u8BFB\u53D6\u5168\u5C40\u5DE5\u5177\u6E05\u5355\u5931\u8D25:", error);
    return [];
  }
}
async function listGlobalToolGroups(tools, profileDir) {
  const names = collectGlobalToolNames(tools);
  const mcpTools = /* @__PURE__ */ new Map();
  const localTools = [];
  for (const name of names) {
    const match = MCP_TOOL_NAME.exec(name);
    if (match) {
      const server = match[1];
      const list = mcpTools.get(server) ?? [];
      list.push(name);
      mcpTools.set(server, list);
    } else {
      localTools.push(name);
    }
  }
  const groups = [];
  for (const packageName of await findInstalledPlugins(profileDir)) {
    const owned = await ownedTools(packageName, localTools, profileDir);
    if (owned.length === 0) continue;
    groups.push({
      id: `pkg:${packageName}`,
      label: packageName,
      kind: "installed",
      tools: owned
    });
  }
  for (const [server, serverTools] of [...mcpTools].sort(([left], [right]) => left.localeCompare(right))) {
    groups.push({
      id: `mcp:${server}`,
      label: `MCP \xB7 ${server}`,
      kind: "global-mcp",
      tools: serverTools.sort((left, right) => left.localeCompare(right))
    });
  }
  return groups;
}

// src/features/power-pack/host/preset-lazy.ts
var GUARDED_METHODS = ["resolve", "acquireScope", "select", "mount"];
var PRESET_ARG_INDEX = {
  resolve: 0,
  acquireScope: 0,
  select: 1,
  mount: 1
};
var LIST_METHODS = ["remoteExportList", "list"];
var WRAPPED = Symbol.for("dsh-all-in-one.preset-lazy");
var rebuilding = /* @__PURE__ */ new Map();
async function rebuildOnce(deps, presetId) {
  const running = rebuilding.get(presetId);
  if (running !== void 0) return running;
  const task = (async () => {
    const { packId, modeId } = splitComposedPresetId(presetId);
    if (packId === "" || modeId === "") throw new Error(`\u7EC4\u5408\u9884\u8BBE ${presetId} \u7F3A\u5C11\u6280\u80FD\u5305\u6216\u6A21\u5F0F\u4FE1\u606F`);
    const { packs } = await readPacks();
    const pack = packs.find((item) => item.id === packId);
    if (pack === void 0) throw new Error(`\u6280\u80FD\u5305 ${packId} \u5DF2\u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u91CD\u5EFA\u7EC4\u5408\u9884\u8BBE ${presetId}`);
    if (!await waitPresetRows(deps.api, modeId)) {
      throw new Error(`\u6A21\u5F0F ${modeId} \u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u91CD\u5EFA\u7EC4\u5408\u9884\u8BBE ${presetId}`);
    }
    let groups = [];
    try {
      groups = await listGlobalToolGroups(deps.tools(), deps.profileDir);
    } catch (error) {
      if (!isInactiveContextError(error)) {
        console.error("[power-pack] \u91CD\u5EFA\u7EC4\u5408\u9884\u8BBE\u65F6\u679A\u4E3E\u5168\u5C40\u80FD\u529B\u5931\u8D25:", presetId, error);
      }
    }
    return ensureComposedPreset(deps.api, modeId, pack, groups);
  })();
  rebuilding.set(presetId, task);
  const release = () => {
    if (rebuilding.get(presetId) === task) rebuilding.delete(presetId);
  };
  task.then(release, release);
  return task;
}
function guardMethod(method, original, deps) {
  const wrapped = async function(...args) {
    const wanted = args[PRESET_ARG_INDEX[method]];
    if (typeof wanted === "string" && isComposedPresetId(wanted)) {
      try {
        await rebuildOnce(deps, wanted);
      } catch (error) {
        console.error("[power-pack] \u6309\u9700\u91CD\u5EFA\u7EC4\u5408\u9884\u8BBE\u5931\u8D25:", wanted, error);
      }
    }
    return original.apply(this, args);
  };
  wrapped[WRAPPED] = true;
  return wrapped;
}
function mergeRoster(result, meta) {
  if (result === null || typeof result !== "object") return result;
  const holder = result;
  if (!Array.isArray(holder.presets)) return result;
  const rows = holder.presets;
  const present = new Set(rows.map((row) => row?.id).filter((id) => typeof id === "string"));
  const missing = [];
  for (const [id, entry] of meta) {
    if (present.has(id)) continue;
    missing.push({ id, name: entry.name, description: entry.description, isDefault: false });
  }
  if (missing.length === 0) return result;
  return { ...holder, presets: [...rows, ...missing] };
}
function guardList(original) {
  const wrapped = async function(...args) {
    const result = await original.apply(this, args);
    try {
      return mergeRoster(result, await pendingComposedMeta());
    } catch (error) {
      console.error("[power-pack] \u8865\u9F50\u7EC4\u5408\u9884\u8BBE\u540D\u5355\u5931\u8D25:", error);
      return result;
    }
  };
  wrapped[WRAPPED] = true;
  return wrapped;
}
function attachMethod(api, method, wrapped) {
  const existing = Object.getOwnPropertyDescriptor(api, method);
  try {
    Object.defineProperty(api, method, {
      configurable: true,
      enumerable: existing?.enumerable ?? true,
      writable: true,
      value: wrapped
    });
    return true;
  } catch (error) {
    console.error("[power-pack] \u5B89\u88C5\u9884\u8BBE\u670D\u52A1\u5305\u88C5\u5931\u8D25:", method, error);
    return false;
  }
}
function installLazyPresets(deps) {
  for (const method of GUARDED_METHODS) {
    const current = deps.api[method];
    if (typeof current !== "function") {
      console.warn("[power-pack] \u5BBF\u4E3B\u9884\u8BBE\u670D\u52A1\u7F3A\u5C11\u65B9\u6CD5\uFF0C\u8DF3\u8FC7\u6309\u9700\u6CE8\u518C:", method);
      continue;
    }
    const existing2 = Object.getOwnPropertyDescriptor(deps.api, method);
    if (existing2?.value?.[WRAPPED] === true) continue;
    attachMethod(deps.api, method, guardMethod(method, current, deps));
  }
  const listMethod = LIST_METHODS.find((method) => typeof deps.api[method] === "function");
  if (listMethod === void 0) {
    console.warn("[power-pack] \u5BBF\u4E3B\u9884\u8BBE\u670D\u52A1\u7F3A\u5C11\u540D\u5355\u65B9\u6CD5\uFF0C\u4F1A\u8BDD\u6807\u9898\u65C1\u7684\u6280\u80FD\u5305\u540D\u4E0D\u4F1A\u8865\u9F50");
    return;
  }
  const existing = Object.getOwnPropertyDescriptor(deps.api, listMethod);
  if (existing?.value?.[WRAPPED] === true) return;
  attachMethod(deps.api, listMethod, guardList(deps.api[listMethod]));
}

// src/features/power-pack/host/prompt-overlay.ts
var SHARED_KEY = Symbol.for("dsh-all-in-one.prompt-isolation");
var CHECK_INTERVAL_MS = 3e3;
var MAX_CONSECUTIVE_REBUILDS = 20;
var SLOW_CHECK_INTERVAL_MS = 3e4;
var OVERLAY_INNER = Symbol.for("dsh-all-in-one.prompt-overlay.inner");
function isolationState() {
  const holder = globalThis;
  const existing = holder[SHARED_KEY];
  if (existing !== void 0) return existing;
  const created = { snapshots: /* @__PURE__ */ new WeakMap() };
  holder[SHARED_KEY] = created;
  return created;
}
function isAssembly(value) {
  return typeof value === "object" && value !== null && Array.isArray(value.sections);
}
function markAsWrapped(fn) {
  const target = fn;
  target._dshPurgeWrapped = true;
  target._dshPurgeSlot ??= { rewrite: () => void 0 };
}
function markOverlay(fn, inner) {
  ;
  fn[OVERLAY_INNER] = inner;
}
function unwrapOverlay(value) {
  let current = value;
  const seen = /* @__PURE__ */ new Set();
  while (seen.size < 32 && !seen.has(current)) {
    seen.add(current);
    const inner = current[OVERLAY_INNER];
    if (typeof inner !== "function") break;
    current = inner;
  }
  return current;
}
function installPromptOverlay(ctx) {
  const prompt = ctx.systemPrompt;
  if (prompt === void 0) return;
  ctx.effect(() => {
    let wrapped;
    let getter;
    let innerBase;
    let timer;
    let intervalMs = CHECK_INTERVAL_MS;
    let rebuildCount = 0;
    const rebuild = (next) => {
      const base = unwrapOverlay(next);
      if (innerBase === base && wrapped !== void 0) return;
      innerBase = base;
      const current = async (context) => {
        const result = await base.call(prompt, context);
        if (!isAssembly(result)) return result;
        const scope = context?.scope;
        if (typeof scope !== "object" || scope === null) return result;
        const { snapshots } = isolationState();
        const clean = snapshots.get(scope);
        if (clean === void 0) return result;
        snapshots.delete(scope);
        return { ...result, sections: clean };
      };
      markAsWrapped(current);
      markOverlay(current, base);
      wrapped = current;
    };
    getter = () => wrapped;
    const isInstalled = () => {
      if (getter === void 0) return false;
      const descriptor = Object.getOwnPropertyDescriptor(prompt, "assemble");
      return descriptor?.get === getter;
    };
    const attach = () => {
      Object.defineProperty(prompt, "assemble", {
        configurable: true,
        enumerable: true,
        get: getter,
        set: (nextValue) => {
          if (typeof nextValue === "function") rebuild(nextValue);
        }
      });
    };
    const sync = () => {
      if (isInstalled()) return;
      try {
        const current = prompt.assemble;
        if (typeof current !== "function") return;
        rebuild(current);
        attach();
        rebuildCount += 1;
        if (rebuildCount > MAX_CONSECUTIVE_REBUILDS && intervalMs !== SLOW_CHECK_INTERVAL_MS) {
          console.error(
            "[power-pack] \u63D0\u793A\u8BCD\u5305\u88C5\u88AB\u53CD\u590D\u66FF\u6362\uFF0C\u5DE1\u68C0\u964D\u9891\u5230",
            SLOW_CHECK_INTERVAL_MS,
            "ms"
          );
          intervalMs = SLOW_CHECK_INTERVAL_MS;
          startTimer(intervalMs);
        }
      } catch (error) {
        console.error("[power-pack] \u5B89\u88C5\u63D0\u793A\u8BCD\u5916\u5C42\u5305\u88C5\u5931\u8D25:", error);
      }
    };
    const startTimer = (interval) => {
      if (timer !== void 0) clearInterval(timer);
      timer = setInterval(sync, interval);
      if (typeof timer.unref === "function") timer.unref();
    };
    sync();
    startTimer(intervalMs);
    return () => {
      if (timer !== void 0) clearInterval(timer);
    };
  }, "power-pack: prompt overlay");
}

// src/common/http-route.ts
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
async function readJsonBody(request, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) return void 0;
    chunks.push(buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    console.error("[all-in-one] \u89E3\u6790\u8BF7\u6C42\u4F53\u5931\u8D25:", error);
    return void 0;
  }
}

// src/features/power-pack/host/skill-catalog.ts
import { readdir as readdir3, readFile as readFile5, stat } from "node:fs/promises";
import { homedir as homedir2 } from "node:os";
import { join as join7 } from "node:path";
function resolveAgentsHome() {
  const configured = process.env.DSH_AGENTS_HOME?.trim();
  if (configured) return configured;
  return join7(homedir2(), ".agents");
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
  const file = kind === "directory" ? join7(path, "SKILL.md") : path;
  try {
    const raw = await readFile5(file, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed || !SKILL_NAME_PATTERN.test(parsed.name)) return void 0;
    return { name: parsed.name, description: parsed.description, path, kind };
  } catch (error) {
    if (error.code === "ENOENT") return void 0;
    console.error("[power-pack] \u8BFB\u53D6\u6280\u80FD\u6587\u4EF6\u5931\u8D25:", file, error);
    return void 0;
  }
}
async function scanRoot(root) {
  let entries;
  try {
    entries = await readdir3(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("[power-pack] \u8BFB\u53D6\u6280\u80FD\u6839\u76EE\u5F55\u5931\u8D25:", root, error);
    return [];
  }
  const skills = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const path = join7(root, entry.name);
    let kind;
    if (entry.isDirectory()) kind = "directory";
    else if (entry.isFile() && entry.name.endsWith(".md")) kind = "file";
    else if (entry.isSymbolicLink()) {
      try {
        const info = await stat(path);
        if (info.isDirectory()) kind = "directory";
        else if (info.isFile() && entry.name.endsWith(".md")) kind = "file";
      } catch (error) {
        console.error("[power-pack] \u8DDF\u968F\u6280\u80FD\u7B26\u53F7\u94FE\u63A5\u5931\u8D25:", path, error);
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
  const roots = [join7(resolveDshHome(), "skills"), join7(resolveAgentsHome(), "skills")];
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

// src/features/power-pack/host/routes.ts
var ROUTE_PATH = "/dsh-all-in-one/power-packs";
var MAX_BODY_BYTES = 1024 * 1024;
async function buildPayload(host) {
  const document = await readPacks();
  const skills = await listSkillEntries();
  const plugins = await listPluginItems(host.profileDir);
  const globalGroups = await listGlobalToolGroups(host.tools, host.profileDir);
  const recentComposed = await readComposeState();
  return {
    packs: document.packs,
    defaultPackId: document.defaultPackId,
    recentComposed,
    catalog: {
      skills: skills.map(({ name, description }) => ({ name, description })),
      plugins,
      globalGroups
    },
    storagePath: powerPacksFile()
  };
}
async function syncSkills(pack, allSkills) {
  if (pack.skills.mode === "all") {
    await removePackSkillDir(pack.id);
    return;
  }
  await syncPackSkillDir(pack.id, selectSkills(pack.skills, allSkills));
}
async function savePack(pack, host) {
  const allSkills = await listSkillEntries();
  await syncSkills(pack, allSkills);
  const document = await readPacks();
  const index = document.packs.findIndex((item) => item.id === pack.id);
  if (index >= 0) document.packs[index] = pack;
  else document.packs.push(pack);
  await writePacks(document);
  return buildPayload(host);
}
async function deletePack(packId, host) {
  const document = await readPacks();
  document.packs = document.packs.filter((pack) => pack.id !== packId);
  if (document.defaultPackId === packId) document.defaultPackId = "";
  await writePacks(document);
  await removePackSkillDir(packId);
  return buildPayload(host);
}
async function setDefaultPack(packId, host) {
  const document = await readPacks();
  if (!document.packs.some((pack) => pack.id === packId)) throw new Error("\u6280\u80FD\u5305\u4E0D\u5B58\u5728");
  document.defaultPackId = packId;
  await writePacks(document);
  return buildPayload(host);
}
async function buildDiagnostics(host) {
  const document = await readPacks();
  const groups = await listGlobalToolGroups(host.tools, host.profileDir);
  return {
    globalTools: collectGlobalToolNames(host.tools),
    groups,
    packs: document.packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      plugins: pack.plugins,
      mcp: pack.mcp,
      isolate: planIsolation(pack, groups) ?? null
    }))
  };
}
var writeChain = Promise.resolve();
async function handleWrite(request, api, host) {
  if (request.action === "compose") {
    const document = await readPacks();
    const pack2 = document.packs.find((item) => item.id === request.pack);
    if (!pack2) throw new Error("\u6280\u80FD\u5305\u4E0D\u5B58\u5728");
    if (request.mode.trim() === "") throw new Error("\u672A\u6307\u5B9A\u6A21\u5F0F");
    const groups = await listGlobalToolGroups(host.tools, host.profileDir);
    const presetId = await ensureComposedPreset(api, request.mode, pack2, groups);
    await rememberComposed(pack2.id, request.mode);
    return { presetId };
  }
  if (request.action === "delete") {
    if (!isValidPackId(request.id)) throw new Error("\u6280\u80FD\u5305\u6807\u8BC6\u65E0\u6548");
    const payload2 = await deletePack(request.id, host);
    await invalidateComposedPreset(request.id);
    await forgetComposedPack(request.id);
    return payload2;
  }
  if (request.action === "setDefault") {
    if (!isValidPackId(request.id)) throw new Error("\u6280\u80FD\u5305\u6807\u8BC6\u65E0\u6548");
    return setDefaultPack(request.id, host);
  }
  const pack = normalizePack(request.pack);
  if (!pack) throw new Error("\u6280\u80FD\u5305\u5B9A\u4E49\u65E0\u6548");
  const payload = await savePack(pack, host);
  await invalidateComposedPreset(pack.id);
  return payload;
}
function installPowerPackRoutes(webServer, api, host) {
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
          if ((request.url ?? "").includes("/diagnose")) {
            sendJson(response, 200, await buildDiagnostics(host));
            return;
          }
          sendJson(response, 200, await buildPayload(host));
          return;
        }
        if (request.method === "POST") {
          const body = await readJsonBody(request, MAX_BODY_BYTES);
          if (!body || typeof body !== "object") {
            sendJson(response, 400, { error: "\u8BF7\u6C42\u4F53\u4E0D\u662F\u5408\u6CD5 JSON" });
            return;
          }
          const task = writeChain.then(
            () => handleWrite(body, api, host)
          );
          writeChain = task.catch((error) => {
            console.error("[power-pack] \u5199\u5165\u6280\u80FD\u5305\u5931\u8D25:", error);
          });
          sendJson(response, 200, await task);
          return;
        }
        response.writeHead(405, { allow: "GET, POST" });
        response.end();
      } catch (error) {
        console.error("[power-pack] \u5904\u7406\u6280\u80FD\u5305\u8BF7\u6C42\u5931\u8D25:", error);
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });
}

// src/features/power-pack/host.ts
var inject = ["agentPresets", "tools", "systemPrompt"];
function apply(ctx) {
  const api = ctx.agentPresets;
  if (!api) {
    console.error("[power-pack] \u672A\u53D6\u5F97 agentPresets \u670D\u52A1\uFF0C\u6280\u80FD\u5305\u7EC4\u5408\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  const profileDir = currentProfileDir(ctx);
  installPromptOverlay(ctx);
  ctx.effect(() => () => {
    void disposePackPresets();
  }, "power-pack: presets");
  installLazyPresets({ api, tools: () => ctx.tools, profileDir });
  ctx.inject(["webServer"], (host) => {
    host.effect(
      () => installPowerPackRoutes(resolveWebServer(host), api, { profileDir, tools: host.tools }),
      "power-pack: routes"
    );
  });
}
function currentProfileDir(ctx) {
  const dir = ctx.profileContext?.dir;
  return typeof dir === "string" && dir !== "" ? dir : void 0;
}
function resolveWebServer(ctx) {
  if (!ctx.webServer) throw new Error("power-pack: webServer \u670D\u52A1\u4E0D\u53EF\u7528");
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

// src/features/image-preview/host.ts
var host_exports3 = {};
__export(host_exports3, {
  apply: () => apply3,
  inject: () => inject3
});

// src/features/image-preview/host/routes.ts
import { readFile as readFile6, stat as stat2 } from "node:fs/promises";
import { homedir as homedir3 } from "node:os";
import { basename, dirname as dirname3, extname, isAbsolute, join as join8, resolve, sep } from "node:path";
var ROUTE_PATH2 = "/dsh-all-in-one/image";
var MAX_FILE_BYTES = 32 * 1024 * 1024;
var CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};
var ATTACHMENT_OBJECT_DIR = join8("attachments", "v1", "objects");
var ATTACHMENT_OBJECT_NAME = /^[0-9a-f]{64}$/;
var ATTACHMENT_SHARD_NAME = /^[0-9a-f]{2}$/;
var ATTACHMENT_ID_PATTERN = /^(?:sha256:)?([0-9a-f]{64})$/;
function isAttachmentObject(filePath) {
  const root = join8(resolveDshHome(), ATTACHMENT_OBJECT_DIR);
  const resolvedPath = resolve(filePath);
  if (!resolvedPath.startsWith(`${resolve(root)}${sep}`)) return false;
  if (!ATTACHMENT_OBJECT_NAME.test(basename(resolvedPath))) return false;
  return ATTACHMENT_SHARD_NAME.test(basename(dirname3(resolvedPath)));
}
function resolveAttachmentPath(attachmentId) {
  const matched = ATTACHMENT_ID_PATTERN.exec(attachmentId);
  if (matched === null) return void 0;
  const hash = matched[1];
  return join8(resolveDshHome(), ATTACHMENT_OBJECT_DIR, hash.slice(0, 2), hash);
}
function detectImageType(data) {
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (data.length >= 8 && data.subarray(0, 8).equals(PNG_SIGNATURE)) return "image/png";
  if (data.length >= 3 && data[0] === 255 && data[1] === 216 && data[2] === 255) {
    return "image/jpeg";
  }
  if (data.length >= 6) {
    const header = data.subarray(0, 6).toString("latin1");
    if (header === "GIF87a" || header === "GIF89a") return "image/gif";
  }
  if (data.length >= 12 && data.subarray(0, 4).toString("latin1") === "RIFF" && data.subarray(8, 12).toString("latin1") === "WEBP") {
    return "image/webp";
  }
  if (data.length >= 2 && data[0] === 66 && data[1] === 77) return "image/bmp";
  if (data.length >= 4 && data[0] === 0 && data[1] === 0 && data[2] === 1 && data[3] === 0) {
    return "image/x-icon";
  }
  if (data.length >= 12 && data.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = data.subarray(8, 12).toString("latin1");
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return void 0;
}
async function sendImage(request, response, filePath) {
  const extensionType = CONTENT_TYPES[extname(filePath).toLowerCase()];
  const attachmentObject = extensionType === void 0 && isAttachmentObject(filePath);
  if (extensionType === void 0 && !attachmentObject) {
    sendJson(response, 415, { error: "\u53EA\u5141\u8BB8\u8BFB\u53D6\u56FE\u7247\u6587\u4EF6" });
    return;
  }
  try {
    const info = await stat2(filePath);
    if (!info.isFile()) {
      sendJson(response, 404, { error: "\u4E0D\u662F\u6587\u4EF6" });
      return;
    }
    if (info.size > MAX_FILE_BYTES) {
      sendJson(response, 413, { error: "\u56FE\u7247\u4F53\u79EF\u8D85\u8FC7\u4E0A\u9650" });
      return;
    }
    const data = await readFile6(filePath);
    const contentType = extensionType ?? detectImageType(data);
    if (contentType === void 0) {
      sendJson(response, 415, { error: "\u6587\u4EF6\u5185\u5BB9\u4E0D\u662F\u53D7\u652F\u6301\u7684\u56FE\u7247" });
      return;
    }
    response.writeHead(200, {
      "content-type": contentType,
      "content-length": data.length,
      // 文件可能被同名覆盖或已被删除，禁止浏览器缓存，避免刷新后仍显示旧图
      "cache-control": "no-store, no-cache, must-revalidate",
      "x-content-type-options": "nosniff",
      // SVG 直接打开时可能带脚本，用 CSP 禁掉资源加载与脚本执行
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'"
    });
    response.end(request.method === "HEAD" ? void 0 : data);
  } catch (error) {
    console.warn("[image-preview] \u8BFB\u53D6\u56FE\u7247\u5931\u8D25:", filePath, error);
    if (response.headersSent) {
      response.end();
      return;
    }
    sendJson(response, 404, { error: "\u56FE\u7247\u4E0D\u5B58\u5728\u6216\u4E0D\u53EF\u8BFB" });
  }
}
function installImagePreviewRoutes(webServer) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PATH2,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: "\u53EA\u5141\u8BB8\u672C\u673A\u8BBF\u95EE" });
        return;
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { allow: "GET, HEAD" });
        response.end();
        return;
      }
      const url = new URL(request.url ?? ROUTE_PATH2, "http://localhost");
      const attachmentId = url.searchParams.get("attachment");
      if (attachmentId !== null) {
        const attachmentPath = resolveAttachmentPath(attachmentId);
        if (attachmentPath === void 0) {
          sendJson(response, 400, { error: "\u9644\u4EF6 ID \u683C\u5F0F\u4E0D\u6B63\u786E" });
          return;
        }
        await sendImage(request, response, attachmentPath);
        return;
      }
      const rawPath = url.searchParams.get("path");
      if (rawPath === null || rawPath === "") {
        sendJson(response, 400, { error: "\u7F3A\u5C11 path \u6216 attachment \u53C2\u6570" });
        return;
      }
      const filePath = rawPath.startsWith("~/") ? join8(homedir3(), rawPath.slice(2)) : rawPath;
      if (!isAbsolute(filePath)) {
        sendJson(response, 400, { error: "\u53EA\u63A5\u53D7\u7EDD\u5BF9\u8DEF\u5F84" });
        return;
      }
      await sendImage(request, response, filePath);
    }
  });
}

// src/features/image-preview/host.ts
var inject3 = ["webServer"];
function apply3(ctx) {
  const webServer = ctx.webServer;
  if (webServer === void 0) {
    console.error("[image-preview] \u672A\u53D6\u5F97 webServer \u670D\u52A1\uFF0C\u56FE\u7247\u9884\u89C8\u8DEF\u7531\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  ctx.effect(() => installImagePreviewRoutes(webServer), "image-preview: routes");
}

// src/features/delete-session/host.ts
var host_exports4 = {};
__export(host_exports4, {
  apply: () => apply4,
  inject: () => inject4
});

// src/features/delete-session/host/delete-session.ts
import { readdir as readdir4, rm as rm3, stat as stat4 } from "node:fs/promises";
import { join as join10 } from "node:path";

// src/features/delete-session/host/session-records.ts
import { readFile as readFile7, rename as rename3, rm as rm2, stat as stat3, unlink, writeFile as writeFile3 } from "node:fs/promises";
import { join as join9 } from "node:path";
var WORKSPACE_STORAGE_PATH = ["storages", "workspace.json"];
var GLOBAL_SESSION_LISTS = ["archivedSessionIds", "pinnedSessionIds"];
function isEnoent(error) {
  return error.code === "ENOENT";
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function dropId(value, sessionId) {
  if (!Array.isArray(value)) return { list: value, removed: false };
  const next = value.filter((item) => item !== sessionId);
  return { list: next, removed: next.length !== value.length };
}
async function forgetProjectionCache(dshHome, sessionId) {
  const dir = join9(dshHome, "storages", "session_projcache", "sessions");
  const plainId = sessionId.replace(/^session-/, "");
  const candidates = /* @__PURE__ */ new Set([`${sessionId}.json`, `${plainId}.json`]);
  let removed = 0;
  for (const name of candidates) {
    try {
      await unlink(join9(dir, name));
      removed += 1;
    } catch (error) {
      if (isEnoent(error)) continue;
      console.error("[delete-session] \u5220\u9664\u6295\u5F71\u7F13\u5B58\u5931\u8D25:", name, error);
      throw error;
    }
  }
  return removed;
}
async function forgetWorkspaceAccount(dshHome, sessionId) {
  const file = join9(dshHome, ...WORKSPACE_STORAGE_PATH);
  let before;
  try {
    before = await stat3(file);
  } catch (error) {
    if (isEnoent(error)) return 0;
    console.error("[delete-session] \u8BFB\u53D6\u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u72B6\u6001\u5931\u8D25:", error);
    throw error;
  }
  let document;
  try {
    document = JSON.parse(await readFile7(file, "utf8"));
  } catch (error) {
    console.error("[delete-session] \u89E3\u6790\u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u5931\u8D25:", file, error);
    return 0;
  }
  if (!isRecord(document)) {
    console.warn("[delete-session] \u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u7ED3\u6784\u4E0D\u662F\u5BF9\u8C61\uFF0C\u8DF3\u8FC7\u6E05\u7406:", file);
    return 0;
  }
  let removed = 0;
  const global = isRecord(document["global"]) ? document["global"] : void 0;
  if (global !== void 0) {
    for (const key of GLOBAL_SESSION_LISTS) {
      const result = dropId(global[key], sessionId);
      if (!result.removed) continue;
      global[key] = result.list;
      removed += 1;
    }
  }
  const tables = isRecord(document["tables"]) ? document["tables"] : void 0;
  const workspaces = tables !== void 0 && isRecord(tables["workspaces"]) ? tables["workspaces"] : void 0;
  if (workspaces !== void 0) {
    for (const record of Object.values(workspaces)) {
      if (!isRecord(record)) continue;
      const result = dropId(record["sessionIds"], sessionId);
      if (!result.removed) continue;
      record["sessionIds"] = result.list;
      removed += 1;
    }
  }
  if (removed === 0) return 0;
  const after = await stat3(file);
  if (after.mtimeMs !== before.mtimeMs || after.size !== before.size) {
    console.warn("[delete-session] \u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u521A\u88AB\u5BBF\u4E3B\u6539\u5199\uFF0C\u8DF3\u8FC7\u672C\u6B21\u6E05\u7406:", file);
    return 0;
  }
  const temporary = `${file}.${process.pid}.tmp`;
  try {
    await writeFile3(temporary, `${JSON.stringify(document, null, 2)}
`, {
      encoding: "utf8",
      mode: before.mode
    });
    await rename3(temporary, file);
  } catch (error) {
    console.error("[delete-session] \u5199\u56DE\u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u5931\u8D25:", file, error);
    await rm2(temporary, { force: true });
    return 0;
  }
  return removed;
}
async function forgetSessionRecords(dshHome, sessionId) {
  const cache3 = await forgetProjectionCache(dshHome, sessionId);
  const account = await forgetWorkspaceAccount(dshHome, sessionId);
  return cache3 + account;
}

// src/features/delete-session/host/delete-session.ts
var SESSION_ID_PATTERN = /^session-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function isValidSessionId(value) {
  return typeof value === "string" && SESSION_ID_PATTERN.test(value);
}
async function findSessionDirs(sessionId) {
  const root = join10(resolveDshHome(), "sessions");
  let projects;
  try {
    const entries = await readdir4(root, { withFileTypes: true });
    projects = entries.filter((entry) => entry.isDirectory()).map((entry) => join10(root, entry.name));
  } catch (error) {
    console.error("[delete-session] \u679A\u4E3E\u4F1A\u8BDD\u6839\u76EE\u5F55\u5931\u8D25:", error);
    throw error;
  }
  const found = [];
  for (const project of projects) {
    const candidate = join10(project, sessionId);
    try {
      const info = await stat4(candidate);
      if (info.isDirectory()) found.push(candidate);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      console.error("[delete-session] \u68C0\u67E5\u4F1A\u8BDD\u76EE\u5F55\u5931\u8D25:", candidate, error);
      throw error;
    }
  }
  return found;
}
async function deleteStoredSession(sessionId) {
  const dirs = await findSessionDirs(sessionId);
  for (const dir of dirs) {
    try {
      await rm3(dir, { recursive: true, force: true });
    } catch (error) {
      console.error("[delete-session] \u5220\u9664\u4F1A\u8BDD\u76EE\u5F55\u5931\u8D25:", dir, error);
      throw error;
    }
  }
  let records = 0;
  try {
    records = await forgetSessionRecords(resolveDshHome(), sessionId);
  } catch (error) {
    console.error("[delete-session] \u6E05\u7406\u4F1A\u8BDD\u6D3E\u751F\u8BB0\u5F55\u5931\u8D25:", sessionId, error);
  }
  if (dirs.length > 0) console.info("[delete-session] \u5DF2\u5220\u9664\u4F1A\u8BDD:", sessionId, dirs.length, records);
  return { directories: dirs.length, records };
}

// src/features/delete-session/host/routes.ts
var ROUTE_PATH3 = "/dsh-all-in-one/sessions";
var MAX_BODY_BYTES2 = 8 * 1024;
function readSessionId(body) {
  if (typeof body !== "object" || body === null) return void 0;
  const candidate = body.sessionId;
  return isValidSessionId(candidate) ? candidate : void 0;
}
function installDeleteSessionRoutes(webServer) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PATH3,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: "\u53EA\u5141\u8BB8\u672C\u673A\u8BBF\u95EE" });
        return;
      }
      try {
        if (request.method !== "POST") {
          response.writeHead(405, { allow: "POST" });
          response.end();
          return;
        }
        const body = await readJsonBody(request, MAX_BODY_BYTES2);
        const sessionId = readSessionId(body);
        if (sessionId === void 0) {
          sendJson(response, 400, { error: "\u4F1A\u8BDD\u6807\u8BC6\u4E0D\u5408\u6CD5" });
          return;
        }
        const report = await deleteStoredSession(sessionId);
        if (report.directories === 0 && report.records === 0) {
          sendJson(response, 404, { error: "\u4F1A\u8BDD\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664" });
          return;
        }
        sendJson(response, 200, { deleted: true });
      } catch (error) {
        console.error("[delete-session] \u5904\u7406\u5220\u9664\u8BF7\u6C42\u5931\u8D25:", error);
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });
}

// src/features/delete-session/host.ts
var inject4 = ["webServer"];
function apply4(ctx) {
  const webServer = ctx.webServer;
  if (webServer === void 0) {
    console.error("[delete-session] \u672A\u53D6\u5F97 webServer \u670D\u52A1\uFF0C\u5220\u9664\u4F1A\u8BDD\u63A5\u53E3\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  ctx.effect(() => installDeleteSessionRoutes(webServer), "delete-session: routes");
}

// src/features/project-memory/host.ts
var host_exports5 = {};
__export(host_exports5, {
  apply: () => apply5,
  inject: () => inject5
});

// src/features/project-memory/host/settings.ts
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname as dirname4, join as join11 } from "node:path";
var DEFAULT_SETTINGS = { enabled: false, root: "" };
var cache;
function memorySettingsFile() {
  return join11(resolveDshHome(), "all-in-one", "project-memory.json");
}
function normalizeSettings(value) {
  if (typeof value !== "object" || value === null) return { ...DEFAULT_SETTINGS };
  const candidate = value;
  return {
    enabled: candidate.enabled === true,
    root: typeof candidate.root === "string" ? candidate.root : ""
  };
}
function readMemorySettings() {
  const file = memorySettingsFile();
  try {
    const info = statSync(file);
    if (cache !== void 0 && cache.mtimeMs === info.mtimeMs && cache.size === info.size) {
      return cache.value;
    }
    const value = normalizeSettings(JSON.parse(readFileSync(file, "utf8")));
    cache = { mtimeMs: info.mtimeMs, size: info.size, value };
    return value;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u8BFB\u53D6\u8BB0\u5FC6\u8BBE\u7F6E\u5931\u8D25:", file, error);
    }
    return { ...DEFAULT_SETTINGS };
  }
}
function writeMemorySettings(next) {
  const file = memorySettingsFile();
  const temp = `${file}.tmp`;
  try {
    mkdirSync(dirname4(file), { recursive: true });
    writeFileSync(temp, `${JSON.stringify(next, null, 2)}
`, "utf8");
    renameSync(temp, file);
    cache = void 0;
  } catch (error) {
    console.error("[project-memory] \u5199\u5165\u8BB0\u5FC6\u8BBE\u7F6E\u5931\u8D25:", file, error);
    throw error;
  }
}

// src/features/project-memory/host/paths.ts
import { homedir as homedir4 } from "node:os";
import { isAbsolute as isAbsolute2, join as join12, resolve as resolve2 } from "node:path";
var MEMORY_INDEX_FILE = "MEMORY.md";
function defaultMemoryRoot() {
  return join12(resolveDshHome(), "all-in-one", "projects");
}
function resolveMemoryRoot(root) {
  const trimmed = root.trim();
  if (trimmed === "") return defaultMemoryRoot();
  const expanded = trimmed === "~" ? homedir4() : trimmed.startsWith("~/") ? join12(homedir4(), trimmed.slice(2)) : trimmed;
  return isAbsolute2(expanded) ? resolve2(expanded) : void 0;
}
function projectSlug(directory) {
  return resolve2(directory).replace(/[^A-Za-z0-9]/g, "-");
}
function projectMemoryDir(root, projectDirectory) {
  return join12(root, projectSlug(projectDirectory), "memory");
}

// src/features/project-memory/host/state.ts
function memoryEnabled() {
  const settings = readMemorySettings();
  if (!settings.enabled) return false;
  return resolveMemoryRoot(settings.root) !== void 0;
}
function effectiveMemoryRoot() {
  const settings = readMemorySettings();
  return resolveMemoryRoot(settings.root) ?? defaultMemoryRoot();
}
function memoryDirForSession(projectDirectory) {
  if (!memoryEnabled()) return void 0;
  return projectMemoryDir(effectiveMemoryRoot(), projectDirectory);
}

// src/features/project-memory/host/session-dir.ts
import { isAbsolute as isAbsolute3 } from "node:path";
function resolveSessionDirectory(agent) {
  const session = agent?.session;
  const recorded = session?.header?.cwd;
  return typeof recorded === "string" && isAbsolute3(recorded) ? recorded : void 0;
}

// src/features/project-memory/host/store.ts
import { mkdirSync as mkdirSync2, readdirSync, readFileSync as readFileSync2, renameSync as renameSync2, statSync as statSync2, unlinkSync, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join13 } from "node:path";
var MEMORY_TYPES = ["user", "feedback", "project", "reference"];
var MEMORY_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function isValidMemoryName(name) {
  return MEMORY_NAME_PATTERN.test(name) && name.length <= 64;
}
function ensureMemoryDir(dir) {
  mkdirSync2(dir, { recursive: true });
}
function readMemoryIndex(dir) {
  try {
    return readFileSync2(join13(dir, MEMORY_INDEX_FILE), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u8BFB\u53D6\u8BB0\u5FC6\u7D22\u5F15\u5931\u8D25:", dir, error);
    }
    return "";
  }
}
function writeMemoryIndex(dir, text) {
  const file = join13(dir, MEMORY_INDEX_FILE);
  const temp = `${file}.tmp`;
  try {
    writeFileSync2(temp, text, "utf8");
    renameSync2(temp, file);
  } catch (error) {
    console.error("[project-memory] \u5199\u5165\u8BB0\u5FC6\u7D22\u5F15\u5931\u8D25:", file, error);
    throw error;
  }
}
function listMemoryFiles(dir) {
  try {
    return readdirSync(dir).filter((file) => file.endsWith(".md") && file !== MEMORY_INDEX_FILE).sort();
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u5217\u51FA\u8BB0\u5FC6\u6587\u4EF6\u5931\u8D25:", dir, error);
    }
    return [];
  }
}
function parseMemoryFile(file, text) {
  const fallback = {
    name: file.replace(/\.md$/, ""),
    description: "",
    type: "project",
    content: text
  };
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (match === null) return fallback;
  const body = text.slice(match[0].length).replace(/^\r?\n/, "");
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  const type = MEMORY_TYPES.find((item) => item === fields["type"]) ?? "project";
  return {
    name: fields["name"] || fallback.name,
    description: fields["description"] ?? "",
    type,
    content: body
  };
}
function readMemories(dir) {
  const entries = [];
  for (const file of listMemoryFiles(dir)) {
    try {
      entries.push(parseMemoryFile(file, readFileSync2(join13(dir, file), "utf8")));
    } catch (error) {
      console.error("[project-memory] \u8BFB\u53D6\u8BB0\u5FC6\u6587\u4EF6\u5931\u8D25:", file, error);
    }
  }
  return entries;
}
function readMemory(dir, name) {
  if (!isValidMemoryName(name)) return void 0;
  const file = `${name}.md`;
  try {
    return parseMemoryFile(file, readFileSync2(join13(dir, file), "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u8BFB\u53D6\u8BB0\u5FC6\u5931\u8D25:", file, error);
    }
    return void 0;
  }
}
function indexLine(title, name, description) {
  return `- [${title}](${name}.md) \u2014 ${description}`;
}
function upsertIndexLine(index, name, description) {
  const pattern = new RegExp(`^- \\[([^\\]]*)\\]\\(${name}\\.md\\).*$`, "m");
  const existing = pattern.exec(index);
  if (existing !== null) {
    const title = existing[1] === "" ? name : existing[1];
    return index.replace(pattern, indexLine(title, name, description));
  }
  const trimmed = index.replace(/\s+$/, "");
  return `${trimmed === "" ? "" : `${trimmed}
`}${indexLine(name, name, description)}
`;
}
function removeIndexLine(index, name) {
  const pattern = new RegExp(`^- \\[[^\\]]*\\]\\(${name}\\.md\\).*\\r?\\n?`, "gm");
  return index.replace(pattern, "");
}
function preservedFrontmatter(dir, name) {
  const result = { before: [], after: [] };
  let text;
  try {
    text = readFileSync2(join13(dir, `${name}.md`), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u8BFB\u53D6\u5F85\u66F4\u65B0\u8BB0\u5FC6\u5931\u8D25:", name, error);
    }
    return result;
  }
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (match === null) return result;
  let insideMetadata = false;
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === "") continue;
    if (/^\s/.test(line)) {
      if (insideMetadata) {
        if (!/^\s+(type|modified):/.test(line)) result.after.push(line);
      } else {
        result.before.push(line);
      }
      continue;
    }
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    insideMetadata = key === "metadata";
    if (!insideMetadata && key !== "name" && key !== "description") result.before.push(line);
  }
  return result;
}
function writeMemory(dir, input) {
  if (!isValidMemoryName(input.name)) {
    throw new Error(`\u8BB0\u5FC6\u540D\u4E0D\u5408\u6CD5\uFF1A${input.name}\uFF08\u53EA\u5141\u8BB8\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u4E0E\u8FDE\u5B57\u7B26\uFF09`);
  }
  const description = input.description.trim();
  if (description === "") throw new Error("\u8BB0\u5FC6\u6458\u8981\u4E0D\u80FD\u4E3A\u7A7A");
  const type = input.type ?? "project";
  if (!MEMORY_TYPES.includes(type)) throw new Error(`\u8BB0\u5FC6\u7C7B\u578B\u4E0D\u5408\u6CD5\uFF1A${type}`);
  ensureMemoryDir(dir);
  const file = join13(dir, `${input.name}.md`);
  const preserved = preservedFrontmatter(dir, input.name);
  const text = [
    "---",
    `name: ${input.name}`,
    `description: ${description}`,
    ...preserved.before,
    "metadata:",
    `  type: ${type}`,
    `  modified: ${(/* @__PURE__ */ new Date()).toISOString()}`,
    ...preserved.after,
    "---",
    "",
    input.content.trim(),
    ""
  ].join("\n");
  try {
    writeFileSync2(`${file}.tmp`, text, "utf8");
    renameSync2(`${file}.tmp`, file);
  } catch (error) {
    console.error("[project-memory] \u5199\u5165\u8BB0\u5FC6\u5931\u8D25:", file, error);
    throw error;
  }
  writeMemoryIndex(dir, upsertIndexLine(readMemoryIndex(dir), input.name, description));
  return file;
}
function deleteMemory(dir, name) {
  if (!isValidMemoryName(name)) return false;
  const file = join13(dir, `${name}.md`);
  try {
    unlinkSync(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      writeMemoryIndex(dir, removeIndexLine(readMemoryIndex(dir), name));
      return false;
    }
    console.error("[project-memory] \u5220\u9664\u8BB0\u5FC6\u5931\u8D25:", file, error);
    throw error;
  }
  writeMemoryIndex(dir, removeIndexLine(readMemoryIndex(dir), name));
  return true;
}
function renderMemoryIndex(dir, index) {
  const parts = [
    "# \u9879\u76EE\u8BB0\u5FC6",
    "",
    `\u8BB0\u5FC6\u76EE\u5F55\uFF1A${dir}`,
    "\u672C\u9879\u76EE\u7684\u8BB0\u5FC6\u6309\u300C\u4E00\u6761\u4E00\u4E2A\u6587\u4EF6\u300D\u653E\u5728\u8BE5\u76EE\u5F55\uFF0C\u4E0B\u9762\u662F MEMORY.md \u7D22\u5F15\uFF1B\u6BCF\u4E00\u884C\u5BF9\u5E94\u4E00\u6761\u8BB0\u5FC6\u3002",
    "\u7D22\u5F15\u53EA\u7ED9\u6982\u8981\uFF0C\u9700\u8981\u67D0\u6761\u8BB0\u5FC6\u7684\u5168\u6587\u65F6\u7528 memory \u5DE5\u5177 action=read \u8BFB\u53D6\uFF08action=list \u53EF\u5217\u51FA\u5168\u90E8\uFF09\u3002",
    "\u8BB0\u5FC6\u662F\u672C\u9879\u76EE\u591A\u4E2A\u4F1A\u8BDD\u5171\u4EAB\u7684\u80CC\u666F\u4E8B\u5B9E\uFF0C\u4E0E\u5F53\u524D\u7528\u6237\u6307\u4EE4\u51B2\u7A81\u65F6\u4EE5\u7528\u6237\u6307\u4EE4\u4E3A\u51C6\uFF1B\u53D1\u73B0\u6709\u8BEF\u65F6\u66F4\u65B0\u6216\u5220\u9664\u5BF9\u5E94\u6761\u76EE\uFF0C\u4E0D\u8981\u7167\u642C\u3002",
    ""
  ];
  parts.push(index.trim() === "" ? "\uFF08\u5F53\u524D\u8FD8\u6CA1\u6709\u8BB0\u5FC6\u3002\uFF09" : index.trim());
  return parts.join("\n");
}
function memoryIndexFingerprint(dir) {
  try {
    const index = statSync2(join13(dir, MEMORY_INDEX_FILE));
    return `${dir}|${index.mtimeMs}|${index.size}`;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[project-memory] \u8BFB\u53D6\u8BB0\u5FC6\u7D22\u5F15\u72B6\u6001\u5931\u8D25:", dir, error);
    }
    return "";
  }
}

// src/features/project-memory/host/prompt.ts
var SECTION_NAME = "project-memory:index";
var SECTION_ORDER = 9500;
var caches = /* @__PURE__ */ new Map();
function memoryText(dir) {
  const fingerprint = memoryIndexFingerprint(dir);
  const cached = caches.get(dir);
  if (cached !== void 0 && cached.fingerprint === fingerprint) return cached.text;
  const text = renderMemoryIndex(dir, readMemoryIndex(dir));
  caches.set(dir, { fingerprint, text });
  return text;
}
function invalidateMemoryText(dir) {
  caches.delete(dir);
}
function textForAssembly(context) {
  try {
    const directory = resolveSessionDirectory(context.agent);
    if (directory === void 0) return "";
    const dir = memoryDirForSession(directory);
    if (dir === void 0) return "";
    return memoryText(dir);
  } catch (error) {
    console.error("[project-memory] \u6E32\u67D3\u8BB0\u5FC6\u5931\u8D25:", error);
    return "";
  }
}
function installMemoryPrompt(ctx) {
  const prompt = ctx.systemPrompt;
  if (prompt === void 0) {
    console.error("[project-memory] \u672A\u53D6\u5F97 systemPrompt \u670D\u52A1\uFF0C\u8BB0\u5FC6\u4E0D\u4F1A\u8FDB\u5165\u4E0A\u4E0B\u6587");
    return;
  }
  ctx.effect(
    () => prompt.section({
      name: SECTION_NAME,
      order: SECTION_ORDER,
      // 记忆是用户写入的原文，可能含 `{{...}}` 字样；不参与变量插值
      interpolate: false,
      text: textForAssembly
    }),
    "project-memory: prompt"
  );
}

// src/features/project-memory/host/routes.ts
var ROUTE_PATH4 = "/dsh-all-in-one/memory";
var MAX_BODY_BYTES3 = 8 * 1024;
function buildPayload2() {
  const settings = readMemorySettings();
  const resolved = resolveMemoryRoot(settings.root);
  const fallback = defaultMemoryRoot();
  return {
    ...settings,
    // 根目录填错时界面要能看出来，因此同时给出回退后的实际目录
    effectiveRoot: resolved ?? fallback,
    defaultRoot: fallback,
    settingsPath: memorySettingsFile()
  };
}
function readRequest(body) {
  if (typeof body !== "object" || body === null) return void 0;
  const candidate = body;
  const request = {};
  if (candidate.enabled !== void 0) {
    if (typeof candidate.enabled !== "boolean") return void 0;
    request.enabled = candidate.enabled;
  }
  if (candidate.root !== void 0) {
    if (typeof candidate.root !== "string") return void 0;
    if (candidate.root.trim() !== "" && resolveMemoryRoot(candidate.root) === void 0) {
      return void 0;
    }
    request.root = candidate.root.trim();
  }
  return request;
}
function installMemoryRoutes(webServer) {
  return webServer.register({
    kind: "exact",
    path: ROUTE_PATH4,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: "\u53EA\u5141\u8BB8\u672C\u673A\u8BBF\u95EE" });
        return;
      }
      try {
        if (request.method === "GET") {
          sendJson(response, 200, buildPayload2());
          return;
        }
        if (request.method === "POST") {
          const body = await readJsonBody(request, MAX_BODY_BYTES3);
          const update = readRequest(body);
          if (update === void 0) {
            sendJson(response, 400, { error: "\u8BBE\u7F6E\u5185\u5BB9\u4E0D\u5408\u6CD5" });
            return;
          }
          const current = readMemorySettings();
          writeMemorySettings({
            enabled: update.enabled ?? current.enabled,
            root: update.root ?? current.root
          });
          sendJson(response, 200, buildPayload2());
          return;
        }
        response.writeHead(405, { allow: "GET, POST" });
        response.end();
      } catch (error) {
        console.error("[project-memory] \u5904\u7406\u8BBE\u7F6E\u8BF7\u6C42\u5931\u8D25:", error);
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });
}

// src/features/project-memory/host/tool.ts
var MEMORY_TOOL_NAME = "memory";
var TOOL_DESCRIPTION = [
  "\u8BFB\u5199\u5F53\u524D\u9879\u76EE\u7684\u957F\u671F\u8BB0\u5FC6\u3002\u8BB0\u5FC6\u6309\u9879\u76EE\u9694\u79BB\uFF0C\u7531\u672C\u9879\u76EE\u7684\u591A\u4E2A\u4F1A\u8BDD\u5171\u4EAB\u3002",
  "\u7CFB\u7EDF\u63D0\u793A\u8BCD\u91CC\u5DF2\u5E26\u4E0A MEMORY.md \u7D22\u5F15\uFF08\u6BCF\u6761\u4E00\u884C\uFF09\u3002\u8981\u4E86\u89E3\u67D0\u6761\u8BB0\u5FC6\u7684\u5168\u6587\uFF0C\u7528 action=read \u6309\u540D\u8BFB\u53D6\uFF1B",
  "\u53EA\u5728\u7D22\u5F15\u6307\u51FA\u4E86\u76F8\u5173\u5185\u5BB9\u65F6\u624D\u8BFB\uFF0C\u4E0D\u8981\u4E00\u6B21\u6027\u628A\u6240\u6709\u8BB0\u5FC6\u8BFB\u8FDB\u6765\u3002",
  "\u5F53\u7528\u6237\u8981\u6C42\u300C\u8BB0\u4F4F\u300D\u67D0\u4E8B\u3001\u7EA0\u6B63\u4F60\u7684\u505A\u6CD5\u3001\u63D0\u51FA\u957F\u671F\u504F\u597D\uFF0C\u6216\u9879\u76EE\u4E2D\u5F62\u6210\u4E0D\u6613\u4ECE\u4EE3\u7801\u770B\u51FA\u7684\u7EA6\u5B9A\u4E0E\u51B3\u5B9A\u65F6\uFF0C\u7528 action=save \u5199\u5165\u4E00\u6761\u8BB0\u5FC6\u3002",
  "\u5199\u5165\u524D\u5148\u770B\u7D22\u5F15\uFF08\u9700\u8981\u65F6\u7528 action=list\uFF09\uFF1A\u540C\u4E00\u4E3B\u9898\u5E94\u66F4\u65B0\u539F\u6761\u76EE\uFF08\u540C\u540D\u5199\u5165\u5373\u8986\u76D6\uFF09\uFF0C\u4E0D\u8981\u91CD\u590D\u65B0\u5EFA\uFF1B\u6709\u8BEF\u6216\u5DF2\u8FC7\u671F\u7684\u6761\u76EE\u7528 action=delete \u5220\u9664\u3002"
].join("");
var PARAMETERS = {
  type: "object",
  properties: {
    action: {
      type: "string",
      enum: ["save", "list", "read", "delete"],
      description: "save \u5199\u5165\u6216\u8986\u76D6\u4E00\u6761\u8BB0\u5FC6\uFF1Blist \u5217\u51FA\u5168\u90E8\uFF1Bread \u8BFB\u53D6\u4E00\u6761\uFF1Bdelete \u5220\u9664\u4E00\u6761\u3002"
    },
    name: {
      type: "string",
      description: "\u8BB0\u5FC6\u540D\uFF0Ckebab-case\uFF08\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\uFF09\uFF0C\u540C\u65F6\u662F\u6587\u4EF6\u540D\u3002save/read/delete \u5FC5\u586B\u3002"
    },
    description: {
      type: "string",
      description: "\u4E00\u53E5\u8BDD\u6458\u8981\uFF0C\u7528\u4E8E\u7D22\u5F15\u4E0E\u540E\u7EED\u4F1A\u8BDD\u5224\u65AD\u76F8\u5173\u6027\u3002save \u5FC5\u586B\u3002"
    },
    type: {
      type: "string",
      enum: [...MEMORY_TYPES],
      description: "\u8BB0\u5FC6\u7C7B\u578B\uFF1Auser\uFF08\u7528\u6237\u662F\u8C01\u3001\u504F\u597D\uFF09\u3001feedback\uFF08\u5DE5\u4F5C\u65B9\u5F0F\u7684\u7EA0\u6B63\u4E0E\u786E\u8BA4\uFF09\u3001project\uFF08\u8FDB\u884C\u4E2D\u7684\u5DE5\u4F5C\u4E0E\u7EA6\u675F\uFF09\u3001reference\uFF08\u5916\u90E8\u8D44\u6E90\u6307\u9488\uFF09\u3002\u9ED8\u8BA4 project\u3002"
    },
    content: {
      type: "string",
      description: "\u8BB0\u5FC6\u6B63\u6587\u3002\u5199\u6E05\u4E8B\u5B9E\u672C\u8EAB\uFF1Bfeedback/project \u7C7B\u578B\u8FFD\u52A0\u300CWhy:\u300D\u4E0E\u300CHow to apply:\u300D\u4E24\u884C\u3002save \u5FC5\u586B\u3002"
    }
  },
  required: ["action"],
  additionalProperties: false
};
var OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    ok: { type: "boolean", description: "\u52A8\u4F5C\u662F\u5426\u6210\u529F\u3002" },
    message: { type: "string", description: "\u7ED9\u6A21\u578B\u7684\u7B80\u77ED\u7ED3\u679C\u8BF4\u660E\u3002" },
    directory: { type: "string", description: "\u672C\u6B21\u4F7F\u7528\u7684\u8BB0\u5FC6\u76EE\u5F55\u3002" },
    index: { type: "string", description: "\u7D22\u5F15\u6587\u4EF6\u7684\u5F53\u524D\u5185\u5BB9\u3002" },
    content: { type: "string", description: "read \u65F6\u4E3A\u8BB0\u5FC6\u5168\u6587\uFF0C\u5176\u4F59\u52A8\u4F5C\u4E3A\u7A7A\u4E32\u3002" }
  },
  required: ["ok", "message", "directory", "index", "content"],
  additionalProperties: false
};
function optionalText(value) {
  return typeof value === "string" ? value.trim() : "";
}
function runAction(args, dir) {
  const name = optionalText(args.name);
  const index = () => readMemoryIndex(dir);
  if (args.action === "list") {
    const entries = readMemories(dir);
    return {
      ok: true,
      message: entries.length === 0 ? "\u5F53\u524D\u9879\u76EE\u8FD8\u6CA1\u6709\u8BB0\u5FC6\u3002" : `\u5171 ${entries.length} \u6761\u8BB0\u5FC6\uFF1A${entries.map((entry) => `${entry.name}\uFF08${entry.type}\uFF09`).join("\u3001")}`,
      directory: dir,
      index: index(),
      content: ""
    };
  }
  if (!isValidMemoryName(name)) {
    return {
      ok: false,
      message: `\u8BB0\u5FC6\u540D\u4E0D\u5408\u6CD5\uFF1A${name === "" ? "\uFF08\u7A7A\uFF09" : name}\uFF0C\u53EA\u5141\u8BB8\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u4E0E\u8FDE\u5B57\u7B26\u3002`,
      directory: dir,
      index: index(),
      content: ""
    };
  }
  if (args.action === "read") {
    const entry = readMemory(dir, name);
    if (entry === void 0) {
      return { ok: false, message: `\u8BB0\u5FC6 ${name} \u4E0D\u5B58\u5728\u3002`, directory: dir, index: index(), content: "" };
    }
    return {
      ok: true,
      message: `\u5DF2\u8BFB\u53D6\u8BB0\u5FC6 ${name}\uFF08${entry.type}\uFF09\u3002`,
      directory: dir,
      index: index(),
      content: entry.content.trim()
    };
  }
  if (args.action === "delete") {
    const removed = deleteMemory(dir, name);
    return {
      ok: removed,
      message: removed ? `\u5DF2\u5220\u9664\u8BB0\u5FC6 ${name}\u3002` : `\u8BB0\u5FC6 ${name} \u4E0D\u5B58\u5728\uFF0C\u5DF2\u6E05\u7406\u7D22\u5F15\u3002`,
      directory: dir,
      index: index(),
      content: ""
    };
  }
  if (args.action === "save") {
    const description = optionalText(args.description);
    const content = optionalText(args.content);
    const type = optionalText(args.type);
    if (description === "" || content === "") {
      return {
        ok: false,
        message: "save \u9700\u8981\u540C\u65F6\u63D0\u4F9B description \u4E0E content\uFF1A\u524D\u8005\u662F\u4E00\u53E5\u8BDD\u6458\u8981\uFF0C\u540E\u8005\u662F\u8BB0\u5FC6\u6B63\u6587\u3002",
        directory: dir,
        index: index(),
        content: ""
      };
    }
    const savedType = MEMORY_TYPES.find((item) => item === type);
    const file = writeMemory(dir, { name, description, content, ...savedType ? { type: savedType } : {} });
    return {
      ok: true,
      message: `\u5DF2\u5199\u5165\u8BB0\u5FC6 ${name}\uFF08${savedType ?? "project"}\uFF09\uFF1A${file}`,
      directory: dir,
      index: index(),
      content: ""
    };
  }
  return {
    ok: false,
    message: `\u672A\u77E5\u52A8\u4F5C\uFF1A${args.action}`,
    directory: dir,
    index: index(),
    content: ""
  };
}
function createMemoryTool() {
  return {
    name: MEMORY_TOOL_NAME,
    description: TOOL_DESCRIPTION,
    parameters: PARAMETERS,
    output: {
      schema: OUTPUT_SCHEMA,
      render: (_args, value) => [
        { type: "text", text: `[project-memory] ${String(value["message"] ?? "")}` }
      ]
    },
    execute: async (rawArgs, exec) => {
      const args = rawArgs;
      const directory = resolveSessionDirectory(exec.agent);
      if (directory === void 0) {
        return {
          ok: false,
          message: "\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u65E0\u6CD5\u5B9A\u4F4D\u9879\u76EE\u8BB0\u5FC6\u3002",
          directory: "",
          index: "",
          content: ""
        };
      }
      const dir = memoryDirForSession(directory);
      if (dir === void 0) {
        return {
          ok: false,
          message: "\u9879\u76EE\u8BB0\u5FC6\u5DF2\u5173\u95ED\uFF1A\u8BF7\u5728\u300C\u8BBE\u7F6E \u2192 All In One \u2192 \u9879\u76EE\u8BB0\u5FC6\u300D\u91CC\u6253\u5F00\u5F00\u5173\u3002",
          directory: "",
          index: "",
          content: ""
        };
      }
      try {
        const result = runAction(args, dir);
        if (args.action === "save" || args.action === "delete") invalidateMemoryText(dir);
        return result;
      } catch (error) {
        console.error("[project-memory] \u8BB0\u5FC6\u5DE5\u5177\u6267\u884C\u5931\u8D25:", error);
        throw error;
      }
    }
  };
}
function installMemoryTool(ctx) {
  const tools = ctx.tools;
  if (tools?.register === void 0) {
    console.error("[project-memory] \u5BBF\u4E3B\u5DE5\u5177\u6CE8\u518C\u8868\u4E0D\u652F\u6301 register\uFF0C\u8BB0\u5FC6\u5DE5\u5177\u4E0D\u4F1A\u6302\u8F7D");
    return;
  }
  ctx.effect(() => {
    try {
      return tools.register?.(createMemoryTool()) ?? (() => void 0);
    } catch (error) {
      console.error("[project-memory] \u6CE8\u518C memory \u5DE5\u5177\u5931\u8D25:", error);
      return () => void 0;
    }
  }, "project-memory: tool");
}

// src/features/project-memory/host.ts
var inject5 = ["systemPrompt", "tools", "webServer"];
function apply5(ctx) {
  installMemoryPrompt(ctx);
  installMemoryTool(ctx);
  const webServer = ctx.webServer;
  if (webServer === void 0) {
    console.error("[project-memory] \u672A\u53D6\u5F97 webServer \u670D\u52A1\uFF0C\u8BBE\u7F6E\u63A5\u53E3\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  ctx.effect(() => installMemoryRoutes(webServer), "project-memory: routes");
}

// src/features/auto-compact/host.ts
var host_exports6 = {};
__export(host_exports6, {
  apply: () => apply6,
  inject: () => inject6
});

// src/features/auto-compact/host/settings.ts
import { mkdirSync as mkdirSync3, readFileSync as readFileSync3, renameSync as renameSync3, statSync as statSync3, writeFileSync as writeFileSync3 } from "node:fs";
import { dirname as dirname5, join as join14 } from "node:path";
var DEFAULT_SETTINGS2 = {
  enabled: false,
  thresholdPercent: 70,
  retainPercent: 20
};
var MIN_PERCENT = 1;
var MAX_PERCENT = 100;
var cache2;
function autoCompactSettingsFile() {
  return join14(resolveDshHome(), "all-in-one", "auto-compact.json");
}
function normalizePercent(value, fallback) {
  const parsed = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, Math.round(parsed)));
}
function clampRetain(retainPercent, thresholdPercent) {
  return Math.min(retainPercent, Math.max(MIN_PERCENT, thresholdPercent - 1));
}
function normalizeSettings2(value) {
  if (typeof value !== "object" || value === null) return { ...DEFAULT_SETTINGS2 };
  const candidate = value;
  const thresholdPercent = normalizePercent(candidate.thresholdPercent, DEFAULT_SETTINGS2.thresholdPercent);
  const retainPercent = normalizePercent(candidate.retainPercent, DEFAULT_SETTINGS2.retainPercent);
  return {
    enabled: candidate.enabled === true,
    thresholdPercent,
    retainPercent: clampRetain(retainPercent, thresholdPercent)
  };
}
function applyPatch(current, patch) {
  if (typeof patch !== "object" || patch === null) return { ...current };
  const candidate = patch;
  const thresholdPercent = candidate.thresholdPercent === void 0 ? current.thresholdPercent : normalizePercent(candidate.thresholdPercent, current.thresholdPercent);
  const retainPercent = candidate.retainPercent === void 0 ? current.retainPercent : normalizePercent(candidate.retainPercent, current.retainPercent);
  return {
    enabled: typeof candidate.enabled === "boolean" ? candidate.enabled : current.enabled,
    thresholdPercent,
    retainPercent: clampRetain(retainPercent, thresholdPercent)
  };
}
function readAutoCompactSettings() {
  const file = autoCompactSettingsFile();
  try {
    const info = statSync3(file);
    if (cache2 !== void 0 && cache2.mtimeMs === info.mtimeMs && cache2.size === info.size) {
      return cache2.value;
    }
    const value = normalizeSettings2(JSON.parse(readFileSync3(file, "utf8")));
    cache2 = { mtimeMs: info.mtimeMs, size: info.size, value };
    return value;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[auto-compact] \u8BFB\u53D6\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25:", file, error);
    }
    return { ...DEFAULT_SETTINGS2 };
  }
}
function writeSettings(next) {
  const file = autoCompactSettingsFile();
  const temp = `${file}.tmp`;
  try {
    mkdirSync3(dirname5(file), { recursive: true });
    writeFileSync3(temp, `${JSON.stringify(next, null, 2)}
`, "utf8");
    renameSync3(temp, file);
    cache2 = void 0;
  } catch (error) {
    console.error("[auto-compact] \u5199\u5165\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25:", file, error);
    throw error;
  }
}
function updateAutoCompactSettings(patch) {
  const next = applyPatch(readAutoCompactSettings(), patch);
  writeSettings(next);
  return next;
}

// src/features/auto-compact/host/routes.ts
var ROUTE_PATH5 = "/dsh-all-in-one/auto-compact";
var MAX_BODY_BYTES4 = 4 * 1024;
function installAutoCompactRoutes(webServer) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PATH5,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: "\u53EA\u5141\u8BB8\u672C\u673A\u8BBF\u95EE" });
        return;
      }
      try {
        if (request.method === "GET") {
          sendJson(response, 200, readAutoCompactSettings());
          return;
        }
        if (request.method !== "POST") {
          response.writeHead(405, { allow: "GET, POST" });
          response.end();
          return;
        }
        const body = await readJsonBody(request, MAX_BODY_BYTES4);
        if (body === void 0) {
          sendJson(response, 400, { error: "\u8BF7\u6C42\u4F53\u4E0D\u662F\u5408\u6CD5 JSON" });
          return;
        }
        sendJson(response, 200, updateAutoCompactSettings(body));
      } catch (error) {
        console.error("[auto-compact] \u5904\u7406\u8BBE\u7F6E\u8BF7\u6C42\u5931\u8D25:", error);
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });
}

// src/features/auto-compact/host/region.ts
var MAX_FIXED_SHARE = 0.25;
function toolCallDelta(event) {
  if (event.type === "tool/result") return -1;
  if (event.type !== "assistant/message") return 0;
  const content = event.data?.message?.content ?? [];
  return content.filter((block) => block.type === "tool-call").length;
}
function balancedCuts(session, nodes) {
  const cuts = [true];
  let open = 0;
  for (const seq of nodes) {
    const event = session.eventAt(seq);
    open += event === void 0 ? 0 : toolCallDelta(event);
    if (open < 0) open = 0;
    cuts.push(open === 0);
  }
  return cuts;
}
function selectRange(session, priced, retainTokens) {
  const surfaceNodes = session.surface.nodes;
  if (priced.length !== surfaceNodes.length) {
    throw new Error(
      `[auto-compact] \u8868\u9762\u8BA1\u4EF7\u4E0E\u5F53\u524D\u8868\u9762\u4E0D\u4E00\u81F4\uFF1A${priced.length} \u4E2A\u8282\u70B9\u5BF9 ${surfaceNodes.length} \u4E2A\u8868\u9762\u8282\u70B9`
    );
  }
  if (surfaceNodes.length === 0) return null;
  const head = session.eventAt(surfaceNodes[0]);
  const firstIdx = head?.type === "system/message" ? 1 : 0;
  let accumulated = 0;
  let keepFromIdx = priced.length;
  for (let index = priced.length - 1; index >= 0; index -= 1) {
    accumulated += priced[index].tokens;
    keepFromIdx = index;
    if (accumulated >= retainTokens) break;
  }
  if (keepFromIdx <= firstIdx) return null;
  const cuts = balancedCuts(session, surfaceNodes);
  while (keepFromIdx > firstIdx && !cuts[keepFromIdx]) keepFromIdx -= 1;
  if (keepFromIdx <= firstIdx) return null;
  return { start: surfaceNodes[firstIdx], end: surfaceNodes[keepFromIdx - 1] };
}
async function compactOlderHistory(engine, measurement, agent, signal, contextWindow, retainPercent) {
  const session = agent.session;
  const targetTokens = Math.floor(contextWindow * retainPercent / 100);
  const fixedTokens = Math.max(0, measurement.totalTokens - measurement.surfaceTokens);
  const deductibleTokens = Math.min(fixedTokens, Math.round(targetTokens * MAX_FIXED_SHARE));
  const retainTokens = Math.max(0, targetTokens - deductibleTokens);
  const range = selectRange(session, measurement.nodes, retainTokens);
  if (range === null) return { kind: "skipped", reason: "\u6CA1\u6709\u53EF\u5B89\u5168\u538B\u7F29\u7684\u5386\u53F2" };
  await engine.compactRegion?.(range.start, range.end, agent, signal);
  return { kind: "compacted" };
}

// src/features/auto-compact/host/watcher.ts
var RETRY_COOLDOWN_MS = 3e4;
var SCOPE_MISS_TTL_MS = 3e4;
var serviceScopeCache = /* @__PURE__ */ new WeakMap();
function findServiceScope(agent, name) {
  const root = agent.ctx;
  const agentFiber = root?.fiber;
  if (root?.registry?.forEach === void 0 || agentFiber === void 0) return void 0;
  const cached = serviceScopeCache.get(agentFiber)?.get(name);
  if (cached !== void 0 && cached.expiresAt > Date.now()) return cached.scope;
  let found;
  root.registry.forEach((runtime) => {
    if (found !== void 0) return;
    for (const fiber of runtime.fibers ?? []) {
      if (fiber.ctx?.get?.(name) === void 0) continue;
      found = fiber.ctx;
      return;
    }
  });
  const entries = serviceScopeCache.get(agentFiber) ?? /* @__PURE__ */ new Map();
  entries.set(
    name,
    found === void 0 ? { expiresAt: Date.now() + SCOPE_MISS_TTL_MS } : { scope: found, expiresAt: Number.POSITIVE_INFINITY }
  );
  serviceScopeCache.set(agentFiber, entries);
  return found;
}
function readFromScope(scope, name) {
  if (scope === void 0) return void 0;
  try {
    return scope.get(name);
  } catch (error) {
    console.error(`[auto-compact] \u8BFB\u53D6\u670D\u52A1 ${name} \u5931\u8D25:`, error);
    return void 0;
  }
}
function readService(agent, name) {
  return readFromScope(agent.ctx, name) ?? readFromScope(findServiceScope(agent, name), name);
}
function readContextWindow(agent) {
  const projections = readService(agent, "sessionProjections");
  if (projections === void 0) return void 0;
  const values = projections.snapshot(agent.session, ["contextPressure"]).values;
  const pressure = values.contextPressure;
  const contextWindow = pressure?.contextWindow;
  if (contextWindow === void 0 || contextWindow <= 0) return void 0;
  return contextWindow;
}
function installAutoCompactWatcher(ctx) {
  const compacting = /* @__PURE__ */ new Set();
  const attemptedAt = /* @__PURE__ */ new Map();
  const warnedSessions = /* @__PURE__ */ new Set();
  const check = async (agent, signal) => {
    const settings = readAutoCompactSettings();
    if (!settings.enabled) return;
    const session = agent.session;
    if (compacting.has(session.id)) return;
    const contextWindow = readContextWindow(agent);
    if (contextWindow === void 0) return;
    const engine = readService(agent, "compaction");
    const meter = readService(agent, "tokenMeter");
    if (engine?.compactRegion === void 0 || meter === void 0) {
      if (!warnedSessions.has(session.id)) {
        warnedSessions.add(session.id);
        console.error("[auto-compact] \u5BBF\u4E3B\u672A\u63D0\u4F9B\u5206\u6BB5\u538B\u7F29\u80FD\u529B\uFF0C\u8DF3\u8FC7\u672C\u6B21\u68C0\u67E5");
      }
      return;
    }
    const measurement = meter.measure(session);
    if (measurement.totalTokens / contextWindow * 100 < settings.thresholdPercent) return;
    const lastAttempt = attemptedAt.get(session.id);
    if (lastAttempt !== void 0 && Date.now() - lastAttempt < RETRY_COOLDOWN_MS) return;
    compacting.add(session.id);
    attemptedAt.set(session.id, Date.now());
    try {
      const decision = await compactOlderHistory(
        engine,
        measurement,
        agent,
        signal,
        contextWindow,
        settings.retainPercent
      );
      if (decision.kind === "skipped") {
        console.error("[auto-compact] \u81EA\u52A8\u538B\u7F29\u5DF2\u8DF3\u8FC7:", decision.reason);
      }
    } catch (error) {
      console.error("[auto-compact] \u81EA\u52A8\u538B\u7F29\u5931\u8D25:", error);
    } finally {
      compacting.delete(session.id);
    }
  };
  const dispose = ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
    if (!signal.aborted) await check(agent, signal);
    return next();
  });
  return () => {
    dispose();
    compacting.clear();
    attemptedAt.clear();
    warnedSessions.clear();
  };
}

// src/features/auto-compact/host.ts
var inject6 = ["webServer"];
function apply6(ctx) {
  const webServer = ctx.webServer;
  if (webServer === void 0) {
    console.error("[auto-compact] \u672A\u53D6\u5F97 webServer \u670D\u52A1\uFF0C\u8BBE\u7F6E\u63A5\u53E3\u4E0D\u4F1A\u6CE8\u518C");
    return;
  }
  ctx.effect(() => installAutoCompactRoutes(webServer), "auto-compact: routes");
  ctx.effect(() => installAutoCompactWatcher(ctx), "auto-compact: watcher");
}

// src/features/host.ts
var featureHosts = [
  host_exports2,
  host_exports3,
  host_exports4,
  host_exports5,
  host_exports,
  host_exports6
];

// src/index.ts
var inject7 = Array.from(new Set(featureHosts.flatMap((feature) => feature.inject ?? [])));
function apply7(ctx) {
  for (const feature of featureHosts) feature.apply(ctx);
}
export {
  apply7 as apply,
  inject7 as inject
};
