var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/features/expand-process/host.ts
var host_exports = {};
__export(host_exports, {
  apply: () => apply,
  inject: () => inject
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
var inject = ["webServer"];
function apply(ctx) {
  ctx.effect(
    () => ctx.on("webserver/index-inject", (table) => {
      table.unshift({ kind: "script", placement: "head", text: EXPAND_PROCESS_SCRIPT });
    })
  );
}

// src/features/host.ts
var featureHosts = [host_exports];

// src/index.ts
var inject2 = Array.from(new Set(featureHosts.flatMap((feature) => feature.inject ?? [])));
function apply2(ctx) {
  for (const feature of featureHosts) feature.apply(ctx);
}
export {
  apply2 as apply,
  inject2 as inject
};
