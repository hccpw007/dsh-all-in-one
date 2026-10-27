// src/features/power-pack/host/isolate-entry.ts
import { appendFileSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// src/features/power-pack/host/prompt-overlay.ts
var SHARED_KEY = Symbol.for("dsh-all-in-one.prompt-isolation");
function isolationState() {
  const holder = globalThis;
  const existing = holder[SHARED_KEY];
  if (existing !== void 0) return existing;
  const created = { snapshots: /* @__PURE__ */ new WeakMap() };
  holder[SHARED_KEY] = created;
  return created;
}

// src/features/power-pack/host/isolate-entry.ts
var ASSEMBLE_EVENT = "system-prompt/assemble";
var inject = ["tools"];
var LOG_MAX_BYTES = 256 * 1024;
function writeDiagnostic(message) {
  try {
    const home = process.env.DSH_HOME?.trim() || join(homedir(), ".dsh");
    const dir = join(home, "all-in-one");
    mkdirSync(dir, { recursive: true });
    const file = join(dir, "isolate.log");
    try {
      if (statSync(file).size > LOG_MAX_BYTES) writeFileSync(file, "", "utf8");
    } catch {
    }
    appendFileSync(file, `${(/* @__PURE__ */ new Date()).toISOString()} ${message}
`, "utf8");
  } catch (error) {
    console.error("[power-pack] \u5199\u5165\u9694\u79BB\u65E5\u5FD7\u5931\u8D25:", error);
  }
}
function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function isAssembly(value) {
  return typeof value === "object" && value !== null && Array.isArray(value.sections);
}
function captureSnapshot(assembly) {
  try {
    return structuredClone({ sections: assembly.sections, contexts: assembly.contexts });
  } catch (error) {
    console.error("[power-pack] \u590D\u5236\u63D0\u793A\u8BCD\u88C5\u914D\u5931\u8D25:", error);
    return { sections: [...assembly.sections], contexts: [...assembly.contexts] };
  }
}
function hideByPrefix(sections, prefixes) {
  if (prefixes.length === 0) return sections;
  return sections.filter((section) => {
    const name = String(section?.name ?? "").toLowerCase();
    return !prefixes.some((prefix) => name.startsWith(prefix));
  });
}
function installToolIsolation(ctx, deny) {
  ctx.effect(() => {
    let lift;
    let applying = false;
    const apply2 = () => {
      if (applying) return;
      applying = true;
      try {
        if (lift !== void 0) {
          try {
            lift();
          } catch (error) {
            console.error("[power-pack] \u64A4\u9500\u5DE5\u5177\u63A9\u7801\u5931\u8D25:", error);
          }
          lift = void 0;
        }
        const existing = deny.filter((name) => {
          try {
            return ctx.tools.get(name) !== void 0;
          } catch (error) {
            console.error("[power-pack] \u8BFB\u53D6\u5168\u5C40\u5DE5\u5177\u5931\u8D25:", name, error);
            return false;
          }
        });
        if (existing.length === 0) return;
        try {
          lift = ctx.tools.restrict({ deny: existing });
        } catch (error) {
          console.error("[power-pack] \u5E94\u7528\u5DE5\u5177\u63A9\u7801\u5931\u8D25:", error);
          lift = void 0;
        }
      } finally {
        applying = false;
      }
    };
    apply2();
    const off = ctx.on("tools/change", apply2);
    return () => {
      off();
      if (lift === void 0) return;
      try {
        lift();
      } catch (error) {
        console.error("[power-pack] \u91CA\u653E\u5DE5\u5177\u63A9\u7801\u5931\u8D25:", error);
      }
      lift = void 0;
    };
  }, "power-pack: \u5DE5\u5177\u9694\u79BB");
}
function installPromptIsolation(ctx, strict, hidePrefixes) {
  let firstAssembly = false;
  ctx.effect(
    () => ctx.on(
      ASSEMBLE_EVENT,
      async (...args) => {
        const assembly = args[0];
        const context = args[1];
        const next = args[args.length - 1];
        if (!isAssembly(assembly)) return next;
        if (context?.scope === void 0) return next;
        const snapshot = captureSnapshot(assembly);
        if (!firstAssembly) {
          firstAssembly = true;
          writeDiagnostic(`prompt isolated: strict=${strict} hide=${hidePrefixes.join(",") || "(none)"}`);
        }
        if (strict && typeof context.scope === "object" && context.scope !== null) {
          isolationState().snapshots.set(context.scope, hideByPrefix(snapshot.sections, hidePrefixes));
        }
        let result = assembly;
        if (typeof next === "function") {
          try {
            result = await next();
          } catch (error) {
            console.error("[power-pack] \u63D0\u793A\u8BCD waterfall \u4E0B\u6E38\u5931\u8D25:", error);
            result = assembly;
          }
        }
        if (!isAssembly(result)) return result;
        if (strict) {
          return {
            ...result,
            sections: hideByPrefix(snapshot.sections, hidePrefixes),
            // 运行时上下文（工作目录等）由下游按当前会话补齐，不能回退成快照
            contexts: hideByPrefix(result.contexts, hidePrefixes)
          };
        }
        return { ...result, sections: hideByPrefix(result.sections, hidePrefixes) };
      },
      { prepend: true }
    ),
    "power-pack: \u63D0\u793A\u8BCD\u9694\u79BB"
  );
}
function apply(ctx, config = {}) {
  const deny = stringList(config.denyTools);
  const hide = stringList(config.hideSections).map((prefix) => prefix.toLowerCase());
  const strict = config.strict === true;
  writeDiagnostic(
    `apply deny=${deny.length} hide=${hide.join(",") || "(none)"} strict=${strict}`
  );
  if (deny.length > 0) installToolIsolation(ctx, deny);
  if (strict || hide.length > 0) installPromptIsolation(ctx, strict, hide);
}
export {
  apply,
  inject
};
