/* 本文件由 build.ts 生成，请勿手工修改。 */
window.__ModuleLoader__.load({
  id: "dsh-all-in-one",
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
    "use strict";
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

    // src/entry.tsx
    var entry_exports = {};
    __export(entry_exports, {
      default: () => entry_default
    });
    module.exports = __toCommonJS(entry_exports);
    var import_react14 = __toESM(require("react"), 1);

    // .build/styles.css
    var styles_default = "*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.static{position:static}.absolute{position:absolute}.relative{position:relative}.left-0{left:0}.top-full{top:100%}.isolate{isolation:isolate}.z-50{z-index:50}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.ml-2{margin-left:.5rem}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-9{height:2.25rem}.max-h-72{max-height:18rem}.max-h-\\[360px\\]{max-height:360px}.min-h-7{min-height:1.75rem}.w-3\\.5{width:.875rem}.w-4{width:1rem}.w-72{width:18rem}.w-9{width:2.25rem}.w-full{width:100%}.min-w-0{min-width:0}.max-w-\\[180px\\]{max-width:180px}.max-w-\\[min\\(100\\%\\2c 240px\\)\\]{max-width:min(100%,240px)}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.translate-x-0\\.5{--tw-translate-x:0.125rem}.translate-x-0\\.5,.translate-x-\\[18px\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-\\[18px\\]{--tw-translate-x:18px}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.list-decimal{list-style-type:decimal}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-0\\.5{gap:.125rem}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.break-all{word-break:break-all}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-0{border-width:0}.border-b{border-bottom-width:1px}.border-dashed{border-style:dashed}.border-line1{border-color:var(--dsw-alias-border-l1)}.bg-base{background-color:var(--dsw-alias-bg-base)}.bg-brand{background-color:var(--dsw-alias-brand-primary)}.bg-layer1{background-color:var(--dsw-alias-bg-layer-1)}.bg-layer2{background-color:var(--dsw-alias-bg-layer-2)}.bg-line2{background-color:var(--dsw-alias-border-l2)}.bg-overlay{background-color:var(--dsw-alias-bg-overlay)}.bg-transparent{background-color:transparent}.p-1{padding:.25rem}.p-3{padding:.75rem}.p-4{padding:1rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-px{padding-top:1px;padding-bottom:1px}.pb-3{padding-bottom:.75rem}.pb-4{padding-bottom:1rem}.pl-4{padding-left:1rem}.pt-3{padding-top:.75rem}.text-left{text-align:left}.text-center{text-align:center}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[17px\\]{font-size:17px}.font-medium{font-weight:500}.font-semibold{font-weight:600}.leading-4{line-height:1rem}.leading-5{line-height:1.25rem}.leading-6{line-height:1.5rem}.leading-\\[18px\\]{line-height:18px}.text-brand{color:var(--dsw-alias-brand-primary)}.text-danger{color:var(--dsw-alias-state-error-primary)}.text-primary{color:var(--dsw-alias-label-primary)}.text-secondary{color:var(--dsw-alias-label-secondary)}.text-success{color:var(--dsw-alias-state-success-primary)}.text-warn{color:var(--dsw-alias-state-warn-primary)}.underline{text-decoration-line:underline}.accent-brand{accent-color:var(--dsw-alias-brand-primary)}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-lg{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dsh-aio-root{color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}.placeholder\\:text-secondary::-moz-placeholder{color:var(--dsw-alias-label-secondary)}.placeholder\\:text-secondary::placeholder{color:var(--dsw-alias-label-secondary)}.hover\\:border-line2:hover{border-color:var(--dsw-alias-border-l2)}.hover\\:bg-layer2:hover{background-color:var(--dsw-alias-bg-layer-2)}.hover\\:text-primary:hover{color:var(--dsw-alias-label-primary)}.focus\\:border-brand:focus{border-color:var(--dsw-alias-brand-primary)}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus-visible\\:ring-brand:focus-visible{--tw-ring-color:var(--dsw-alias-brand-primary)}@media (min-width:640px){.sm\\:col-span-2{grid-column:span 2/span 2}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}";

    // icon.svg
    var icon_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n  <rect width="64" height="64" rx="14" fill="#0F172A" />\n  <rect x="13" y="13" width="16" height="16" rx="4.5" fill="#38BDF8" />\n  <rect x="35" y="13" width="16" height="16" rx="4.5" fill="#7DD3FC" opacity="0.55" />\n  <rect x="13" y="35" width="16" height="16" rx="4.5" fill="#7DD3FC" opacity="0.55" />\n  <rect x="35" y="35" width="16" height="16" rx="4.5" fill="#38BDF8" opacity="0.85" />\n</svg>\n';

    // src/common/locale.ts
    function prefixFeatureLocales(featureId, locales) {
      const result = {};
      for (const [locale, dictionary] of Object.entries(locales)) {
        const prefixed = {};
        for (const [key, value] of Object.entries(dictionary)) {
          prefixed[`${featureId}.${key}`] = value;
        }
        result[locale] = prefixed;
      }
      return result;
    }
    function mergeDictionaries(...sources) {
      const result = {};
      for (const source of sources) {
        for (const [locale, dictionary] of Object.entries(source)) {
          result[locale] = { ...result[locale], ...dictionary };
        }
      }
      return result;
    }
    function collectFeatureLocales(features) {
      return mergeDictionaries(
        ...features.map((feature) => prefixFeatureLocales(feature.id, feature.locales))
      );
    }

    // src/features/chat-style/client.tsx
    var client_exports = {};
    __export(client_exports, {
      apply: () => apply
    });
    var import_react2 = __toESM(require("react"), 1);

    // src/features/chat-style/seat.tsx
    var import_react = __toESM(require("react"), 1);

    // src/common/cn.ts
    function cn(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    // src/features/chat-style/seat-store.ts
    function initialState() {
      return { status: "idle", options: [], current: "", error: null };
    }
    function createSeatStore() {
      let snapshot = initialState();
      const listeners = /* @__PURE__ */ new Set();
      return {
        getSnapshot: () => snapshot,
        set(patch) {
          snapshot = { ...snapshot, ...patch };
          for (const listener of listeners) listener();
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        }
      };
    }
    function isStylePreset(preset) {
      return preset.id.startsWith("style-");
    }
    function sessionPreset(ctx, sessionId) {
      if (sessionId === void 0) return void 0;
      const value = ctx.sessions?.list.getSnapshot().byId[sessionId]?.projectionValues?.agentPreset;
      return typeof value === "string" ? value : void 0;
    }
    function createSeatController(ctx) {
      const store = createSeatStore();
      let staged;
      let busy = false;
      const load = async (sessionId) => {
        const api = ctx.remote?.agentPresets;
        if (!api) {
          store.set({ status: "error", error: "agentPresets remote unavailable" });
          return;
        }
        if (store.getSnapshot().status === "loading") return;
        store.set({ status: "loading", error: null });
        try {
          const result = await api.list();
          if (!result.ok || !result.value) {
            store.set({ status: "error", error: result.error?.message ?? "list failed" });
            return;
          }
          const presets = result.value.presets.filter((preset) => preset.broken === void 0);
          const fallback = presets.find((preset) => preset.isDefault)?.id ?? presets[0]?.id ?? "";
          const current = staged ?? sessionPreset(ctx, sessionId) ?? fallback;
          store.set({ status: "ready", options: presets, current, error: null });
        } catch (error) {
          console.error("[chat-style] \u8BFB\u53D6 Agent \u9884\u8BBE\u5931\u8D25:", error);
          store.set({
            status: "error",
            error: error instanceof Error ? error.message : String(error)
          });
        }
      };
      const submit = async (sessionId, presetId) => {
        const api = ctx.remote?.agentPresets;
        if (!api) {
          store.set({ error: "agentPresets remote unavailable" });
          staged = void 0;
          return;
        }
        const summary = ctx.sessions?.list.getSnapshot().byId[sessionId];
        if (summary && summary.blank === false) {
          store.set({ error: "session already started", current: sessionPreset(ctx, sessionId) ?? "" });
          staged = void 0;
          return;
        }
        try {
          const result = await api.select(sessionId, presetId);
          if (!result.ok) {
            store.set({ error: result.error?.message ?? "select failed" });
            staged = void 0;
            return;
          }
          staged = void 0;
          store.set({ current: result.value ?? presetId, error: null });
        } catch (error) {
          console.error("[chat-style] \u5E94\u7528\u5BF9\u8BDD\u98CE\u683C\u5931\u8D25:", error);
          store.set({ error: error instanceof Error ? error.message : String(error) });
          staged = void 0;
        }
      };
      const select = async (sessionId, presetId) => {
        if (busy) return;
        staged = presetId;
        store.set({ current: presetId, error: null });
        if (sessionId === void 0) return;
        busy = true;
        try {
          await submit(sessionId, presetId);
        } finally {
          busy = false;
        }
      };
      const applyStaged = async (sessionId) => {
        if (staged === void 0 || busy) return;
        busy = true;
        try {
          await submit(sessionId, staged);
        } finally {
          busy = false;
        }
      };
      return { store, load, select, applyStaged };
    }

    // src/features/chat-style/seat.tsx
    var BUILTIN_NAME_KEYS = {
      standard: "presetStandardName",
      ptc: "presetPtcName",
      minimal: "presetMinimalName",
      cordis: "presetCordisName"
    };
    function SeatIcon() {
      return /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: "14",
          height: "14",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react.default.createElement("path", { d: "M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" }),
        /* @__PURE__ */ import_react.default.createElement("circle", { cx: "10", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react.default.createElement("circle", { cx: "14", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react.default.createElement("circle", { cx: "18", cy: "12", r: "1" })
      );
    }
    function ChevronIcon() {
      return /* @__PURE__ */ import_react.default.createElement(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: "12",
          height: "12",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.6",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react.default.createElement("path", { d: "m4 6 4 4 4-4" })
      );
    }
    function presetName(preset, t) {
      if (preset.name) return preset.name;
      const key = BUILTIN_NAME_KEYS[preset.id];
      return key === void 0 ? preset.id : t(key);
    }
    function presetDescription(preset) {
      return preset.description;
    }
    function ChatStyleSeat({
      sessionId,
      useChatStyleSeat,
      load,
      select,
      applyStaged,
      t
    }) {
      const snapshot = useChatStyleSeat((state) => state);
      const [open, setOpen] = (0, import_react.useState)(false);
      const rootRef = (0, import_react.useRef)(null);
      const actionsRef = (0, import_react.useRef)({ load, applyStaged });
      actionsRef.current = { load, applyStaged };
      (0, import_react.useEffect)(() => {
        void actionsRef.current.load();
        if (sessionId !== void 0) void actionsRef.current.applyStaged();
      }, [sessionId]);
      (0, import_react.useEffect)(() => {
        if (!open) return;
        const onPointerDown = (event) => {
          if (rootRef.current?.contains(event.target)) return;
          setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
      }, [open]);
      const styles = snapshot.options.filter(isStylePreset);
      const modes = snapshot.options.filter((preset) => !isStylePreset(preset));
      const current = snapshot.options.find((preset) => preset.id === snapshot.current);
      const label = current === void 0 ? snapshot.current : presetName(current, t);
      const pick = (id) => {
        setOpen(false);
        void select(id);
      };
      return /* @__PURE__ */ import_react.default.createElement("div", { ref: rootRef, className: "relative" }, /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          type: "button",
          "aria-haspopup": "menu",
          "aria-expanded": open,
          disabled: snapshot.status === "loading" || snapshot.options.length === 0,
          onClick: () => {
            const next = !open;
            setOpen(next);
            if (next) void load();
          },
          className: cn(
            "inline-flex min-h-7 max-w-[min(100%,240px)] items-center gap-1 rounded-lg border-0 bg-transparent px-2 text-[13px] font-medium text-primary",
            "hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            snapshot.options.length === 0 && "cursor-default text-secondary"
          )
        },
        /* @__PURE__ */ import_react.default.createElement(SeatIcon, null),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "max-w-[180px] truncate" }, label),
        /* @__PURE__ */ import_react.default.createElement(ChevronIcon, null)
      ), open ? /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          role: "menu",
          className: "absolute left-0 top-full z-50 mt-1 max-h-[360px] w-72 overflow-y-auto rounded-xl border border-line1 bg-overlay p-1 shadow-lg"
        },
        /* @__PURE__ */ import_react.default.createElement("p", { className: "px-2 py-1 text-[11px] text-secondary" }, t("styleGroup")),
        styles.length === 0 ? (
          // 尚未创建风格时的提示，引导去设置页创建
          /* @__PURE__ */ import_react.default.createElement("p", { className: "px-2 py-1.5 text-[12px] leading-4 text-secondary" }, t("seatNoStyles"))
        ) : styles.map((preset) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: preset.id,
            type: "button",
            role: "menuitemradio",
            "aria-checked": preset.id === snapshot.current,
            onClick: () => pick(preset.id),
            className: cn(
              "flex w-full flex-col items-start gap-0.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-left",
              preset.id === snapshot.current ? "bg-layer2" : "hover:bg-layer2"
            )
          },
          /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[13px] text-primary" }, presetName(preset, t)),
          presetDescription(preset) ? (
            // 风格说明
            /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[12px] leading-4 text-secondary" }, presetDescription(preset))
          ) : null
        )),
        modes.length > 0 ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-1 px-2 py-1 text-[11px] text-secondary" }, t("modeGroup")), modes.map((preset) => /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: preset.id,
            type: "button",
            role: "menuitemradio",
            "aria-checked": preset.id === snapshot.current,
            onClick: () => pick(preset.id),
            className: cn(
              "flex w-full flex-col items-start gap-0.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-left",
              preset.id === snapshot.current ? "bg-layer2" : "hover:bg-layer2"
            )
          },
          /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[13px] text-primary" }, presetName(preset, t)),
          presetDescription(preset) ? (
            // 模式说明
            /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[12px] leading-4 text-secondary" }, presetDescription(preset))
          ) : null
        ))) : null
      ) : null, snapshot.error ? /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-1 text-[12px] leading-4 text-danger", role: "alert" }, snapshot.error === "session already started" ? t("seatSessionStarted") : `${t("seatSelectFailed")}\uFF1A${snapshot.error}`) : null);
    }

    // src/features/chat-style/client.tsx
    function apply(ctx, t) {
      ctx.inject(["sessions", "remote", "remote.agentPresets"], (scoped) => {
        const controller = createSeatController(scoped);
        ctx.slots.inject(
          "conversation.hero.agentPreset",
          () => ctx.slots.register(
            {
              name: "conversation.hero.agentPreset",
              // 宿主内置选择器使用默认 priority 0；更低的值覆盖它
              priority: -10,
              inject: (sessionId) => ({
                hooks: { chatStyleSeat: controller.store },
                load: () => controller.load(sessionId),
                select: (presetId) => controller.select(sessionId, presetId),
                applyStaged: async () => {
                  if (sessionId !== void 0) await controller.applyStaged(sessionId);
                }
              })
            },
            (props) => /* @__PURE__ */ import_react2.default.createElement(ChatStyleSeat, { ...props, t })
          )
        );
      });
    }

    // src/features/chat-style/entry.tsx
    var import_react3 = __toESM(require("react"), 1);
    function ChatStyleIcon() {
      return /* @__PURE__ */ import_react3.default.createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: "18",
          height: "18",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react3.default.createElement("path", { d: "M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "10", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "14", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "18", cy: "12", r: "1" })
      );
    }
    function ChatStyleEntry({ t, open }) {
      return /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          type: "button",
          onClick: open,
          className: "flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react3.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand" }, /* @__PURE__ */ import_react3.default.createElement(ChatStyleIcon, null)),
        /* @__PURE__ */ import_react3.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "block text-[13px] font-medium leading-5 text-primary" }, t("title")), /* @__PURE__ */ import_react3.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("description")))
      );
    }

    // src/features/chat-style/locales.ts
    var chatStyleLocales = {
      zh: {
        // 网格入口标题
        title: "\u5BF9\u8BDD\u98CE\u683C",
        // 网格入口描述
        description: "\u4E3A\u4E0D\u540C\u4EFB\u52A1\u51C6\u5907\u4E0D\u540C\u7684\u6280\u80FD\u3001\u63D2\u4EF6\u4E0E MCP\uFF0C\u65B0\u5EFA\u5BF9\u8BDD\u65F6\u6309\u98CE\u683C\u9009\u62E9\u3002",
        // 功能页标题
        pageTitle: "\u5BF9\u8BDD\u98CE\u683C",
        // 功能页说明
        pageDescription: "\u6BCF\u4E2A\u98CE\u683C\u662F\u4E00\u5957\u72EC\u7ACB\u7684 Agent \u7EC4\u5408\u3002\u4FDD\u5B58\u540E\u4F1A\u51FA\u73B0\u5728\u65B0\u5EFA\u4EFB\u52A1\u7684\u9884\u8BBE\u9009\u62E9\u5668\u4E2D\uFF0C\u53EA\u5BF9\u9009\u62E9\u5B83\u7684\u4F1A\u8BDD\u751F\u6548\u3002",
        // 新建风格按钮
        newStyle: "\u65B0\u5EFA\u98CE\u683C",
        // 空态提示
        empty: "\u8FD8\u6CA1\u6709\u521B\u5EFA\u4EFB\u4F55\u98CE\u683C\u3002\u65B0\u5EFA\u4E00\u4E2A\u98CE\u683C\uFF0C\u52FE\u9009\u5B83\u9700\u8981\u7684\u6280\u80FD\u4E0E\u5DE5\u5177\u3002",
        // 编辑按钮
        edit: "\u7F16\u8F91",
        // 删除按钮
        delete: "\u5220\u9664",
        // 保存按钮
        save: "\u4FDD\u5B58",
        // 保存中的按钮文案
        saving: "\u4FDD\u5B58\u4E2D\u2026",
        // 取消按钮
        cancel: "\u53D6\u6D88",
        // MCP 服务器标识非法时的提示
        mcpIdInvalid: "\u6807\u8BC6\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u548C\u77ED\u6A2A\u7EBF\uFF0C\u957F\u5EA6 1\u201332\u3002",
        // MCP 服务器标识重复时的提示
        mcpIdDuplicate: "MCP \u670D\u52A1\u5668\u6807\u8BC6\u4E0D\u80FD\u91CD\u590D\u3002",
        // 删除确认提示
        confirmDelete: "\u5220\u9664\u540E\u8BE5\u98CE\u683C\u4E0D\u518D\u51FA\u73B0\u5728\u65B0\u5EFA\u4EFB\u52A1\u7684\u9884\u8BBE\u5217\u8868\u4E2D\uFF0C\u786E\u5B9A\u5220\u9664\uFF1F",
        // 加载失败提示
        loadFailed: "\u8BFB\u53D6\u98CE\u683C\u914D\u7F6E\u5931\u8D25",
        // 保存失败提示
        saveFailed: "\u4FDD\u5B58\u5931\u8D25",
        // 删除失败提示
        deleteFailed: "\u5220\u9664\u5931\u8D25",
        // 名称字段标签
        nameLabel: "\u98CE\u683C\u540D\u79F0",
        // 名称输入占位
        namePlaceholder: "\u4F8B\u5982\uFF1A\u4EE3\u7801\u5BA1\u67E5",
        // 描述字段标签
        descriptionLabel: "\u98CE\u683C\u63CF\u8FF0",
        // 描述输入占位
        descriptionPlaceholder: "\u4E00\u53E5\u8BDD\u8BF4\u660E\u8FD9\u4E2A\u98CE\u683C\u9002\u5408\u4EC0\u4E48\u4EFB\u52A1",
        // 系统提示词字段标签
        systemPromptLabel: "\u7CFB\u7EDF\u63D0\u793A\u8BCD",
        // 系统提示词说明
        systemPromptHint: "\u8FD9\u6BB5\u6587\u5B57\u4F1A\u8FFD\u52A0\u5230\u7CFB\u7EDF\u63D0\u793A\u8BCD\u672B\u5C3E\uFF0C\u7528\u6765\u7EA6\u5B9A\u8BE5\u98CE\u683C\u7684\u5DE5\u4F5C\u65B9\u5F0F\u3002",
        // 系统提示词占位
        systemPromptPlaceholder: "\u4F8B\u5982\uFF1A\u53EA\u5BA1\u67E5\u4EE3\u7801\uFF0C\u5148\u6307\u51FA\u6F5C\u5728\u7F3A\u9677\u4E0E\u6D4B\u8BD5\u7F3A\u53E3\uFF0C\u4FEE\u6539\u6587\u4EF6\u524D\u5148\u8BE2\u95EE\u3002",
        // 技能区块标题
        skillsTitle: "\u6280\u80FD",
        // 技能区块说明
        skillsHint: "\u53EA\u5BF9\u52FE\u9009\u7684\u6280\u80FD\u5F00\u653E\u52A0\u8F7D\uFF1B\u672A\u5217\u51FA\u7684\u6280\u80FD\u4E0D\u4F1A\u51FA\u73B0\u5728\u8BE5\u98CE\u683C\u7684\u6280\u80FD\u76EE\u5F55\u91CC\u3002",
        // 插件区块标题
        pluginsTitle: "\u63D2\u4EF6\u4E0E\u5DE5\u5177",
        // 插件区块说明
        pluginsHint: "\u4ECE\u96F6\u7EC4\u88C5 Agent\uFF1A\u4E0D\u52FE\u9009\u4EFB\u4F55\u9879\u65F6\uFF0C\u8BE5\u98CE\u683C\u53EA\u6709\u5BF9\u8BDD\u80FD\u529B\u3002",
        // MCP 区块标题
        mcpTitle: "MCP \u670D\u52A1\u5668",
        // MCP 区块说明
        mcpHint: "\u4E3A\u98CE\u683C\u914D\u7F6E\u5916\u90E8 MCP \u670D\u52A1\uFF1B\u6BCF\u4E2A\u670D\u52A1\u5668\u4F1A\u4F5C\u4E3A\u72EC\u7ACB\u7684\u5BA2\u6237\u7AEF\u884C\u6302\u8F7D\u3002",
        // MCP 服务器定义区块标题
        mcpServersTitle: "\u670D\u52A1\u5668\u5B9A\u4E49",
        // MCP 启用规则区块标题
        mcpRuleTitle: "\u542F\u7528\u7684\u670D\u52A1\u5668",
        // MCP 启用规则说明
        mcpRuleHint: "\u9009\u62E9\u8BE5\u98CE\u683C\u6302\u8F7D\u54EA\u4E9B\u5DF2\u5B9A\u4E49\u7684 MCP \u670D\u52A1\u5668\u3002",
        // 重试加载按钮
        retry: "\u91CD\u8BD5",
        // 三态模式：全部
        modeAll: "\u5168\u90E8",
        // 三态模式：仅引用
        modeInclude: "\u4EC5\u5F15\u7528",
        // 三态模式：仅排除
        modeExclude: "\u4EC5\u6392\u9664",
        // 全部模式的说明
        modeAllHint: "\u4F7F\u7528\u5168\u90E8\u53EF\u7528\u9879\uFF0C\u4E0D\u9700\u8981\u9010\u4E2A\u52FE\u9009\u3002",
        // 仅引用模式的说明
        modeIncludeHint: "\u53EA\u6709\u52FE\u9009\u7684\u9879\u4F1A\u88AB\u4F7F\u7528\u3002",
        // 仅排除模式的说明
        modeExcludeHint: "\u9664\u52FE\u9009\u9879\u5916\u5168\u90E8\u4F7F\u7528\u3002",
        // 搜索技能占位
        searchSkills: "\u641C\u7D22\u6280\u80FD",
        // 未找到技能
        noSkills: "\u6CA1\u6709\u5339\u914D\u7684\u6280\u80FD\u3002",
        // 已装插件标记
        installedBadge: "\u5DF2\u5B89\u88C5\u63D2\u4EF6",
        // 已装插件风险提示
        installedWarning: "\u5DF2\u5B89\u88C5\u63D2\u4EF6\u53EF\u80FD\u5DF2\u5728 profile \u4E2D\u5168\u5C40\u52A0\u8F7D\uFF0C\u91CD\u590D\u6302\u8F7D\u53EF\u80FD\u51B2\u7A81\uFF0C\u4EC5\u5728\u5FC5\u8981\u65F6\u52FE\u9009\u3002",
        // 添加 MCP 服务器按钮
        addMcp: "\u6DFB\u52A0 MCP \u670D\u52A1\u5668",
        // 尚未配置 MCP 时的提示
        mcpEmpty: "\u8FD8\u6CA1\u6709\u914D\u7F6E MCP \u670D\u52A1\u5668\u3002",
        // MCP 标识字段
        mcpIdLabel: "\u6807\u8BC6",
        // MCP 展示名字段
        mcpLabelLabel: "\u540D\u79F0",
        // MCP 传输方式字段
        mcpTransportLabel: "\u4F20\u8F93\u65B9\u5F0F",
        // stdio 传输选项
        mcpStdio: "\u547D\u4EE4\uFF08stdio\uFF09",
        // HTTP 传输选项
        mcpHttp: "HTTP",
        // MCP 启动命令字段
        mcpCommandLabel: "\u547D\u4EE4",
        // MCP 命令参数说明
        mcpArgsLabel: "\u53C2\u6570\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09",
        // MCP 环境变量说明
        mcpEnvLabel: "\u73AF\u5883\u53D8\u91CF\uFF08\u6BCF\u884C KEY=VALUE\uFF09",
        // MCP 地址字段
        mcpUrlLabel: "\u5730\u5740",
        // MCP 请求头说明
        mcpHeadersLabel: "\u8BF7\u6C42\u5934\uFF08\u6BCF\u884C KEY=VALUE\uFF09",
        // 移除 MCP 服务器按钮
        remove: "\u79FB\u9664",
        // 保存成功提示
        saved: "\u5DF2\u4FDD\u5B58\uFF0C\u65B0\u5EFA\u4EFB\u52A1\u65F6\u53EF\u5728\u9884\u8BBE\u5217\u8868\u4E2D\u9009\u62E9\u8BE5\u98CE\u683C\u3002",
        // 必填校验提示
        nameRequired: "\u8BF7\u586B\u5199\u98CE\u683C\u540D\u79F0\u3002",
        // 存储位置说明
        storageHint: "\u914D\u7F6E\u6587\u4EF6\u4F4D\u7F6E",
        // 预设选择提示
        presetHint: "\u98CE\u683C\u4EE5 Agent \u9884\u8BBE\u7684\u5F62\u5F0F\u6CE8\u518C\u3002\u65B0\u5EFA\u4EFB\u52A1\u65F6\u5728\u300C\u6807\u51C6\u6A21\u5F0F\u300D\u65C1\u7684\u9884\u8BBE\u9009\u62E9\u5668\u91CC\u9009\u62E9\u5B83\u3002",
        // 新会话选择器的风格分组标题
        styleGroup: "\u5BF9\u8BDD\u98CE\u683C",
        // 新会话选择器的模式分组标题
        modeGroup: "\u6A21\u5F0F",
        // 尚未创建任何风格时的提示
        seatNoStyles: "\u8FD8\u6CA1\u6709\u521B\u5EFA\u98CE\u683C\uFF0C\u53EF\u5728\u300C\u8BBE\u7F6E \u2192 All In One \u2192 \u5BF9\u8BDD\u98CE\u683C\u300D\u4E2D\u65B0\u5EFA\u3002",
        // 内置标准模式的显示名
        presetStandardName: "\u6807\u51C6\u6A21\u5F0F",
        // 内置 PTC 模式的显示名
        presetPtcName: "PTC \u6A21\u5F0F",
        // 内置极简模式的显示名
        presetMinimalName: "\u6781\u7B80\u6A21\u5F0F",
        // 内置创造模式的显示名
        presetCordisName: "\u521B\u9020\u6A21\u5F0F",
        // 会话已开始后尝试切换风格的提示
        seatSessionStarted: "\u4F1A\u8BDD\u5DF2\u5F00\u59CB\uFF0C\u65E0\u6CD5\u518D\u5207\u6362\u98CE\u683C\u3002\u8BF7\u5728\u65B0\u5EFA\u4EFB\u52A1\u65F6\u9009\u62E9\u3002",
        // 风格切换失败的提示前缀
        seatSelectFailed: "\u5207\u6362\u5931\u8D25"
      },
      en: {
        // Grid entry title
        title: "Chat styles",
        // Grid entry description
        description: "Prepare different skills, plugins and MCP servers per task, then pick a style when starting a chat.",
        // Page title
        pageTitle: "Chat styles",
        // Page description
        pageDescription: "Each style is a standalone agent composition. Once saved it appears in the preset picker for new tasks and only applies to sessions that choose it.",
        // New style button
        newStyle: "New style",
        // Empty state
        empty: "No styles yet. Create one and choose the skills and tools it needs.",
        // Edit button
        edit: "Edit",
        // Delete button
        delete: "Delete",
        // Save button
        save: "Save",
        // Save-in-progress label
        saving: "Saving\u2026",
        // Cancel button
        cancel: "Cancel",
        // Invalid MCP server id
        mcpIdInvalid: "ID may contain letters, digits, underscores and hyphens, 1\u201332 characters.",
        // Duplicate MCP server id
        mcpIdDuplicate: "MCP server IDs must be unique.",
        // Delete confirmation
        confirmDelete: "This style will no longer appear in the preset picker. Delete it?",
        // Load failure
        loadFailed: "Could not load styles",
        // Save failure
        saveFailed: "Could not save",
        // Delete failure
        deleteFailed: "Could not delete",
        // Name field label
        nameLabel: "Style name",
        // Name placeholder
        namePlaceholder: "e.g. Code review",
        // Description field label
        descriptionLabel: "Description",
        // Description placeholder
        descriptionPlaceholder: "One sentence about when to use this style",
        // System prompt label
        systemPromptLabel: "System prompt",
        // System prompt hint
        systemPromptHint: "Appended to the end of the system prompt to define how this style works.",
        // System prompt placeholder
        systemPromptPlaceholder: "e.g. Only review code. Point out defects and test gaps, ask before editing files.",
        // Skills section title
        skillsTitle: "Skills",
        // Skills section hint
        skillsHint: "Only selected skills can be loaded; unlisted ones are absent from this style.",
        // Plugins section title
        pluginsTitle: "Plugins and tools",
        // Plugins section hint
        pluginsHint: "Assemble the agent from scratch: with nothing selected the style can only chat.",
        // MCP section title
        mcpTitle: "MCP servers",
        // MCP section hint
        mcpHint: "Configure external MCP services; each server mounts as its own client row.",
        // MCP server definitions title
        mcpServersTitle: "Server definitions",
        // MCP enabled-servers rule title
        mcpRuleTitle: "Enabled servers",
        // MCP rule hint
        mcpRuleHint: "Choose which defined MCP servers this style mounts.",
        // Retry loading button
        retry: "Retry",
        // Rule mode: all
        modeAll: "All",
        // Rule mode: include
        modeInclude: "Only selected",
        // Rule mode: exclude
        modeExclude: "All except selected",
        // All mode hint
        modeAllHint: "Use everything available; no selection needed.",
        // Include mode hint
        modeIncludeHint: "Only the selected items are used.",
        // Exclude mode hint
        modeExcludeHint: "Everything except the selected items is used.",
        // Skill search placeholder
        searchSkills: "Search skills",
        // No matching skills
        noSkills: "No matching skills.",
        // Installed plugin badge
        installedBadge: "Installed plugin",
        // Installed plugin warning
        installedWarning: "Installed plugins may already load globally in the profile; mounting them again can conflict. Select only when needed.",
        // Add MCP server button
        addMcp: "Add MCP server",
        // Empty MCP hint
        mcpEmpty: "No MCP servers configured yet.",
        // MCP id field
        mcpIdLabel: "ID",
        // MCP label field
        mcpLabelLabel: "Name",
        // MCP transport field
        mcpTransportLabel: "Transport",
        // stdio option
        mcpStdio: "Command (stdio)",
        // HTTP option
        mcpHttp: "HTTP",
        // MCP command field
        mcpCommandLabel: "Command",
        // MCP args hint
        mcpArgsLabel: "Arguments (one per line)",
        // MCP env hint
        mcpEnvLabel: "Environment (KEY=VALUE per line)",
        // MCP URL field
        mcpUrlLabel: "URL",
        // MCP headers hint
        mcpHeadersLabel: "Headers (KEY=VALUE per line)",
        // Remove MCP server
        remove: "Remove",
        // Saved notice
        saved: "Saved. Pick this style from the preset list when starting a new task.",
        // Required name message
        nameRequired: "Enter a style name.",
        // Storage location hint
        storageHint: "Config file",
        // Preset picker hint
        presetHint: "Styles register as agent presets. Choose one in the preset picker next to Standard mode when starting a new task.",
        // Group heading for styles in the new-session picker
        styleGroup: "Chat styles",
        // Group heading for modes in the new-session picker
        modeGroup: "Modes",
        // Shown when no style has been created yet
        seatNoStyles: "No styles yet. Create one in Settings \u2192 All In One \u2192 Chat styles.",
        // Display name for the built-in Standard mode
        presetStandardName: "Standard mode",
        // Display name for the built-in PTC mode
        presetPtcName: "PTC mode",
        // Display name for the built-in Minimal mode
        presetMinimalName: "Minimal mode",
        // Display name for the built-in Creator mode
        presetCordisName: "Creator mode",
        // Shown when trying to switch a session that already started
        seatSessionStarted: "This session has started; a style can only be chosen for a new task.",
        // Prefix for a failed style switch
        seatSelectFailed: "Could not switch"
      }
    };

    // src/features/chat-style/page.tsx
    var import_react8 = __toESM(require("react"), 1);

    // src/components/Button.tsx
    var import_react4 = __toESM(require("react"), 1);
    var VARIANT_CLASS = {
      ghost: "flex items-center gap-1 rounded-lg px-2 py-1 text-secondary hover:bg-layer2 hover:text-primary",
      outline: "rounded-lg border border-line1 bg-base px-3 py-1.5 text-primary hover:bg-layer2"
    };
    function Button({ variant = "ghost", className, type = "button", ...rest }) {
      return /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type,
          className: cn(
            "text-[12px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            VARIANT_CLASS[variant],
            className
          ),
          ...rest
        }
      );
    }

    // src/features/chat-style/api.ts
    var ENDPOINT = "/dsh-all-in-one/chat-styles";
    var REQUEST_TIMEOUT_MS = 2e4;
    async function request(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
          credentials: "same-origin",
          cache: "no-store",
          ...init,
          signal: controller.signal
        });
        if (!response.ok) {
          const text = await response.text();
          let message = text;
          try {
            const parsed = JSON.parse(text);
            if (typeof parsed.error === "string") message = parsed.error;
          } catch (error) {
            console.error("[chat-style] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[chat-style] \u8BF7\u6C42\u98CE\u683C\u63A5\u53E3\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadChatStyles() {
      return request();
    }
    function saveChatStyle(style) {
      const body = { action: "save", style };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    function deleteChatStyle(id) {
      const body = { action: "delete", id };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }

    // src/features/chat-style/StyleEditor.tsx
    var import_react7 = __toESM(require("react"), 1);

    // src/features/chat-style/McpServerEditor.tsx
    var import_react5 = __toESM(require("react"), 1);
    var INPUT_CLASS = "w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    var SERVER_ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;
    function formatPairs(dict) {
      return Object.entries(dict).map(([key, value]) => `${key}=${value}`).join("\n");
    }
    function parsePairs(text) {
      const result = {};
      for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (trimmed === "") continue;
        const index = trimmed.indexOf("=");
        if (index <= 0) continue;
        result[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1);
      }
      return result;
    }
    function createServer(index) {
      return {
        id: `mcp-${index}`,
        label: `MCP ${index}`,
        transport: "stdio",
        command: "",
        args: [],
        env: {},
        url: "",
        headers: {}
      };
    }
    function McpServerEditor({ servers, onChange, t }) {
      const patch = (index, change) => {
        onChange(servers.map((server, current) => current === index ? { ...server, ...change } : server));
      };
      const add = () => {
        let index = servers.length + 1;
        while (servers.some((server) => server.id === `mcp-${index}`)) index += 1;
        onChange([...servers, createServer(index)]);
      };
      const remove = (index) => {
        onChange(servers.filter((_, current) => current !== index));
      };
      return /* @__PURE__ */ import_react5.default.createElement("section", { className: "rounded-xl border border-line1 bg-layer1" }, /* @__PURE__ */ import_react5.default.createElement("header", { className: "border-b border-line1 px-4 py-3" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("mcpServersTitle")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, t("mcpHint"))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex flex-col gap-3 p-4" }, servers.length === 0 ? (
        // 尚未配置任何服务器时的提示
        /* @__PURE__ */ import_react5.default.createElement("p", { className: "text-[12px] text-secondary" }, t("mcpEmpty"))
      ) : null, servers.map((server, index) => /* @__PURE__ */ import_react5.default.createElement("div", { key: `${server.id}-${index}`, className: "rounded-lg border border-line1 bg-base p-3" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "text-[12px] font-medium text-primary" }, server.label || server.id), /* @__PURE__ */ import_react5.default.createElement(Button, { variant: "ghost", onClick: () => remove(index) }, t("remove"))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpIdLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "input",
        {
          value: server.id,
          onChange: (event) => patch(index, { id: event.target.value.trim() }),
          className: INPUT_CLASS
        }
      ), SERVER_ID_PATTERN.test(server.id) ? null : (
        // 标识不合法时立即提示，保存按钮会拦截
        /* @__PURE__ */ import_react5.default.createElement("span", { className: "mt-1 block text-[12px] text-danger" }, t("mcpIdInvalid"))
      )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpLabelLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "input",
        {
          value: server.label,
          onChange: (event) => patch(index, { label: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpTransportLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "select",
        {
          value: server.transport,
          onChange: (event) => patch(index, {
            transport: event.target.value === "streamable-http" ? "streamable-http" : "stdio"
          }),
          className: INPUT_CLASS
        },
        /* @__PURE__ */ import_react5.default.createElement("option", { value: "stdio" }, t("mcpStdio")),
        /* @__PURE__ */ import_react5.default.createElement("option", { value: "streamable-http" }, t("mcpHttp"))
      ))), server.transport === "stdio" ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "mt-2 flex flex-col gap-2" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpCommandLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "input",
        {
          value: server.command,
          onChange: (event) => patch(index, { command: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpArgsLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "textarea",
        {
          value: server.args.join("\n"),
          onChange: (event) => patch(index, {
            args: event.target.value.split("\n").filter((arg) => arg.trim() !== "")
          }),
          rows: 3,
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpEnvLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "textarea",
        {
          value: formatPairs(server.env),
          onChange: (event) => patch(index, { env: parsePairs(event.target.value) }),
          rows: 3,
          className: INPUT_CLASS
        }
      ))) : /* @__PURE__ */ import_react5.default.createElement("div", { className: "mt-2 flex flex-col gap-2" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpUrlLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "input",
        {
          value: server.url,
          onChange: (event) => patch(index, { url: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react5.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("mcpHeadersLabel")), /* @__PURE__ */ import_react5.default.createElement(
        "textarea",
        {
          value: formatPairs(server.headers),
          onChange: (event) => patch(index, { headers: parsePairs(event.target.value) }),
          rows: 3,
          className: INPUT_CLASS
        }
      ))))), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement(Button, { variant: "outline", onClick: add }, t("addMcp")))));
    }
    function isValidServerId(id) {
      return SERVER_ID_PATTERN.test(id);
    }

    // src/features/chat-style/ResourceRuleField.tsx
    var import_react6 = __toESM(require("react"), 1);
    var MODE_ORDER = ["all", "include", "exclude"];
    function ResourceRuleField({
      title,
      hint,
      rule,
      options,
      modeLabels,
      modeHint,
      emptyText,
      searchPlaceholder,
      onChange
    }) {
      const [query, setQuery] = (0, import_react6.useState)("");
      const selected = (0, import_react6.useMemo)(() => new Set(rule.items), [rule.items]);
      const visibleOptions = (0, import_react6.useMemo)(() => {
        const keyword = query.trim().toLowerCase();
        if (keyword === "") return options;
        return options.filter(
          (option) => option.label.toLowerCase().includes(keyword) || (option.description ?? "").toLowerCase().includes(keyword)
        );
      }, [options, query]);
      const toggle = (id) => {
        const next = new Set(rule.items);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const ordered = options.filter((option) => next.has(option.id)).map((option) => option.id);
        const unknown = [...next].filter((item) => !options.some((option) => option.id === item));
        onChange({ mode: rule.mode, items: [...ordered, ...unknown] });
      };
      return /* @__PURE__ */ import_react6.default.createElement("section", { className: "rounded-xl border border-line1 bg-layer1" }, /* @__PURE__ */ import_react6.default.createElement("header", { className: "border-b border-line1 px-4 py-3" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ import_react6.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, title), /* @__PURE__ */ import_react6.default.createElement("span", { className: "text-[12px] text-secondary" }, selected.size > 0 ? selected.size : "")), /* @__PURE__ */ import_react6.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, hint)), /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex flex-wrap items-center gap-2 px-4 pt-3" }, MODE_ORDER.map((mode) => /* @__PURE__ */ import_react6.default.createElement(
        Button,
        {
          key: mode,
          variant: rule.mode === mode ? "outline" : "ghost",
          "aria-pressed": rule.mode === mode,
          onClick: () => onChange({ mode, items: rule.items })
        },
        modeLabels[mode]
      )), /* @__PURE__ */ import_react6.default.createElement("span", { className: "text-[12px] leading-[18px] text-secondary" }, modeHint)), rule.mode === "all" ? null : /* @__PURE__ */ import_react6.default.createElement("div", { className: "px-4 pb-4 pt-3" }, searchPlaceholder ? /* @__PURE__ */ import_react6.default.createElement(
        "input",
        {
          type: "search",
          value: query,
          placeholder: searchPlaceholder,
          onChange: (event) => setQuery(event.target.value),
          className: "mb-2 w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand"
        }
      ) : null, visibleOptions.length === 0 ? (
        // 没有可选项或搜索无结果时的提示
        /* @__PURE__ */ import_react6.default.createElement("p", { className: "py-3 text-[12px] text-secondary" }, emptyText)
      ) : /* @__PURE__ */ import_react6.default.createElement("ul", { className: "max-h-72 overflow-y-auto" }, visibleOptions.map((option) => {
        const checked = selected.has(option.id);
        return /* @__PURE__ */ import_react6.default.createElement("li", { key: option.id }, /* @__PURE__ */ import_react6.default.createElement(
          "label",
          {
            className: cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition",
              checked ? "bg-layer2" : "hover:bg-layer2"
            )
          },
          /* @__PURE__ */ import_react6.default.createElement(
            "input",
            {
              type: "checkbox",
              checked,
              onChange: () => toggle(option.id),
              className: "mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
            }
          ),
          /* @__PURE__ */ import_react6.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "flex flex-wrap items-center gap-1.5" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "text-[12px] font-medium text-primary" }, option.label), option.badge ? (
            // 条目来源标记，如「已安装插件」
            /* @__PURE__ */ import_react6.default.createElement("span", { className: "rounded border border-line1 px-1 py-px text-[10px] text-secondary" }, option.badge)
          ) : null), option.description ? (
            // 条目说明
            /* @__PURE__ */ import_react6.default.createElement("span", { className: "mt-0.5 block text-[12px] leading-[18px] text-secondary" }, option.description)
          ) : null, checked && option.warning ? (
            // 选中后才提示的风险，避免干扰普通浏览
            /* @__PURE__ */ import_react6.default.createElement("span", { className: "mt-0.5 block text-[12px] leading-[18px] text-warn" }, option.warning)
          ) : null)
        ));
      }))));
    }

    // src/features/chat-style/StyleEditor.tsx
    var INPUT_CLASS2 = "w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    function StyleEditor({ initial, catalog, saving, error, onSave, onCancel, t }) {
      const [draft, setDraft] = (0, import_react7.useState)(initial);
      const [localError, setLocalError] = (0, import_react7.useState)(null);
      const patch = (change) => {
        setDraft((current) => ({ ...current, ...change }));
      };
      const patchRule = (key, rule) => {
        setDraft((current) => ({ ...current, [key]: rule }));
      };
      const skillOptions = catalog.skills.map((skill) => ({
        id: skill.name,
        label: skill.name,
        description: skill.description
      }));
      const pluginOptions = catalog.plugins.map((plugin2) => ({
        id: plugin2.id,
        label: plugin2.label,
        description: plugin2.description,
        ...plugin2.kind === "installed" ? { badge: t("installedBadge") } : {},
        ...plugin2.kind === "installed" ? { warning: t("installedWarning") } : {}
      }));
      const validate = () => {
        if (draft.name.trim() === "") return t("nameRequired");
        const ids = /* @__PURE__ */ new Set();
        for (const server of draft.mcpServers) {
          if (!isValidServerId(server.id)) return t("mcpIdInvalid");
          if (ids.has(server.id)) return t("mcpIdDuplicate");
          ids.add(server.id);
        }
        return void 0;
      };
      const handleSave = () => {
        const message = validate();
        if (message) {
          setLocalError(message);
          return;
        }
        setLocalError(null);
        onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() });
      };
      return /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ import_react7.default.createElement("section", { className: "rounded-xl border border-line1 bg-layer1" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "border-b border-line1 px-4 py-3" }, /* @__PURE__ */ import_react7.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("title")), /* @__PURE__ */ import_react7.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, t("presetHint"))), /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex flex-col gap-3 p-4" }, /* @__PURE__ */ import_react7.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("nameLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "input",
        {
          value: draft.name,
          placeholder: t("namePlaceholder"),
          onChange: (event) => patch({ name: event.target.value }),
          className: INPUT_CLASS2
        }
      )), /* @__PURE__ */ import_react7.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("descriptionLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "input",
        {
          value: draft.description,
          placeholder: t("descriptionPlaceholder"),
          onChange: (event) => patch({ description: event.target.value }),
          className: INPUT_CLASS2
        }
      )), /* @__PURE__ */ import_react7.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] text-secondary" }, t("systemPromptLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "textarea",
        {
          value: draft.systemPrompt,
          placeholder: t("systemPromptPlaceholder"),
          onChange: (event) => patch({ systemPrompt: event.target.value }),
          rows: 5,
          className: INPUT_CLASS2
        }
      ), /* @__PURE__ */ import_react7.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("systemPromptHint"))))), /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          title: t("skillsTitle"),
          hint: t("skillsHint"),
          rule: draft.skills,
          options: skillOptions,
          modeLabels: { all: t("modeAll"), include: t("modeInclude"), exclude: t("modeExclude") },
          modeHint: draft.skills.mode === "all" ? t("modeAllHint") : draft.skills.mode === "include" ? t("modeIncludeHint") : t("modeExcludeHint"),
          emptyText: t("noSkills"),
          searchPlaceholder: t("searchSkills"),
          onChange: (rule) => patchRule("skills", rule)
        }
      ), /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          title: t("pluginsTitle"),
          hint: t("pluginsHint"),
          rule: draft.plugins,
          options: pluginOptions,
          modeLabels: { all: t("modeAll"), include: t("modeInclude"), exclude: t("modeExclude") },
          modeHint: draft.plugins.mode === "all" ? t("modeAllHint") : draft.plugins.mode === "include" ? t("modeIncludeHint") : t("modeExcludeHint"),
          emptyText: t("noSkills"),
          onChange: (rule) => patchRule("plugins", rule)
        }
      ), /* @__PURE__ */ import_react7.default.createElement(
        McpServerEditor,
        {
          servers: draft.mcpServers,
          onChange: (mcpServers) => patch({ mcpServers }),
          t
        }
      ), /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          title: t("mcpRuleTitle"),
          hint: t("mcpRuleHint"),
          rule: draft.mcp,
          options: draft.mcpServers.map((server) => ({
            id: server.id,
            label: server.label || server.id
          })),
          modeLabels: { all: t("modeAll"), include: t("modeInclude"), exclude: t("modeExclude") },
          modeHint: draft.mcp.mode === "all" ? t("modeAllHint") : draft.mcp.mode === "include" ? t("modeIncludeHint") : t("modeExcludeHint"),
          emptyText: t("mcpEmpty"),
          onChange: (rule) => patchRule("mcp", rule)
        }
      ), localError ?? error ? /* @__PURE__ */ import_react7.default.createElement("p", { className: "text-[12px] leading-[18px] text-danger", role: "alert" }, localError ?? error) : null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react7.default.createElement(Button, { variant: "outline", disabled: saving, onClick: handleSave }, saving ? t("saving") : t("save")), /* @__PURE__ */ import_react7.default.createElement(Button, { variant: "ghost", disabled: saving, onClick: onCancel }, t("cancel"))));
    }

    // src/features/chat-style/page.tsx
    function modeLabel(mode, t) {
      if (mode === "include") return t("modeInclude");
      if (mode === "exclude") return t("modeExclude");
      return t("modeAll");
    }
    function createDraft() {
      return {
        id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
        name: "",
        description: "",
        systemPrompt: "",
        skills: { mode: "all", items: [] },
        plugins: { mode: "all", items: [] },
        mcp: { mode: "all", items: [] },
        mcpServers: []
      };
    }
    function ChatStylePage({ t }) {
      const [payload, setPayload] = (0, import_react8.useState)(null);
      const [editing, setEditing] = (0, import_react8.useState)(null);
      const [loading, setLoading] = (0, import_react8.useState)(true);
      const [saving, setSaving] = (0, import_react8.useState)(false);
      const [error, setError] = (0, import_react8.useState)(null);
      const [notice, setNotice] = (0, import_react8.useState)(null);
      const reload = async () => {
        try {
          setPayload(await loadChatStyles());
          setError(null);
        } catch (failure) {
          console.error("[chat-style] \u52A0\u8F7D\u98CE\u683C\u5931\u8D25:", failure);
          setError(`${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setLoading(false);
        }
      };
      (0, import_react8.useEffect)(() => {
        let active = true;
        void (async () => {
          try {
            const next = await loadChatStyles();
            if (!active) return;
            setPayload(next);
          } catch (failure) {
            console.error("[chat-style] \u52A0\u8F7D\u98CE\u683C\u5931\u8D25:", failure);
            if (active) {
              setError(
                `${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`
              );
            }
          } finally {
            if (active) setLoading(false);
          }
        })();
        return () => {
          active = false;
        };
      }, [t]);
      const handleSave = async (style) => {
        setSaving(true);
        try {
          setPayload(await saveChatStyle(style));
          setEditing(null);
          setError(null);
          setNotice(t("saved"));
        } catch (failure) {
          console.error("[chat-style] \u4FDD\u5B58\u98CE\u683C\u5931\u8D25:", failure);
          setError(`${t("saveFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setSaving(false);
        }
      };
      const handleDelete = async (id) => {
        if (!window.confirm(t("confirmDelete"))) return;
        try {
          setPayload(await deleteChatStyle(id));
          setError(null);
          setNotice(null);
        } catch (failure) {
          console.error("[chat-style] \u5220\u9664\u98CE\u683C\u5931\u8D25:", failure);
          setError(
            `${t("deleteFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`
          );
        }
      };
      if (editing && payload) {
        return /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react8.default.createElement("header", null, /* @__PURE__ */ import_react8.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("pageTitle")), /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("pageDescription"))), /* @__PURE__ */ import_react8.default.createElement(
          StyleEditor,
          {
            initial: editing,
            catalog: payload.catalog,
            saving,
            error,
            onSave: (style) => void handleSave(style),
            onCancel: () => {
              setEditing(null);
              setError(null);
            },
            t
          }
        ));
      }
      return /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react8.default.createElement("header", { className: "flex flex-wrap items-start justify-between gap-3" }, /* @__PURE__ */ import_react8.default.createElement("div", null, /* @__PURE__ */ import_react8.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("pageTitle")), /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("pageDescription"))), /* @__PURE__ */ import_react8.default.createElement(
        Button,
        {
          variant: "outline",
          disabled: loading || !payload,
          onClick: () => {
            setNotice(null);
            setError(null);
            setEditing(createDraft());
          }
        },
        t("newStyle")
      )), notice ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "rounded-lg border border-line1 bg-layer1 px-3 py-2 text-[12px] text-success" }, notice) : null, error ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "rounded-lg border border-line1 bg-layer1 px-3 py-2 text-[12px] text-danger", role: "alert" }, error, /* @__PURE__ */ import_react8.default.createElement(
        "button",
        {
          type: "button",
          className: "ml-2 underline",
          onClick: () => void reload()
        },
        t("retry")
      )) : null, loading ? (
        // 首次加载中的占位
        /* @__PURE__ */ import_react8.default.createElement("p", { className: "text-[12px] text-secondary" }, "\u2026")
      ) : (payload?.styles.length ?? 0) === 0 ? (
        // 尚未创建风格时的空态
        /* @__PURE__ */ import_react8.default.createElement("p", { className: "rounded-xl border border-dashed border-line1 px-4 py-6 text-center text-[12px] text-secondary" }, t("empty"))
      ) : /* @__PURE__ */ import_react8.default.createElement("ul", { className: "flex flex-col gap-2" }, payload?.styles.map((style) => /* @__PURE__ */ import_react8.default.createElement(
        "li",
        {
          key: style.id,
          className: "rounded-xl border border-line1 bg-layer1 px-4 py-3"
        },
        /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex flex-wrap items-start justify-between gap-2" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react8.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, style.name), style.description ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, style.description) : null, /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1 text-[12px] text-secondary" }, t("skillsTitle"), ": ", modeLabel(style.skills.mode, t), " \xB7 ", t("pluginsTitle"), ":", " ", modeLabel(style.plugins.mode, t), " \xB7 ", t("mcpTitle"), ": ", style.mcpServers.length)), /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex shrink-0 items-center gap-2" }, /* @__PURE__ */ import_react8.default.createElement(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setNotice(null);
              setError(null);
              setEditing(style);
            }
          },
          t("edit")
        ), /* @__PURE__ */ import_react8.default.createElement(Button, { variant: "ghost", onClick: () => void handleDelete(style.id) }, t("delete"))))
      ))), payload ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "text-[12px] text-secondary" }, t("storageHint"), ": ", /* @__PURE__ */ import_react8.default.createElement("code", { className: "break-all" }, payload.storagePath)) : null);
    }

    // src/features/chat-style/index.tsx
    var chatStyleFeature = {
      id: "chat-style",
      order: 20,
      entry: ChatStyleEntry,
      page: ChatStylePage,
      client: client_exports,
      locales: chatStyleLocales
    };
    var chat_style_default = chatStyleFeature;

    // src/features/demo/entry.tsx
    var import_react9 = __toESM(require("react"), 1);
    function DemoIcon() {
      return /* @__PURE__ */ import_react9.default.createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: "18",
          height: "18",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react9.default.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react9.default.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react9.default.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react9.default.createElement("path", { d: "M14 17.5h7M17.5 14v7" })
      );
    }
    function DemoEntry({ t, open }) {
      return /* @__PURE__ */ import_react9.default.createElement(
        "button",
        {
          type: "button",
          onClick: open,
          className: "flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react9.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand" }, /* @__PURE__ */ import_react9.default.createElement(DemoIcon, null)),
        /* @__PURE__ */ import_react9.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "block text-[13px] font-medium leading-5 text-primary" }, t("title")), /* @__PURE__ */ import_react9.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("description")))
      );
    }

    // src/features/demo/locales.ts
    var demoLocales = {
      zh: {
        // 网格卡片标题
        title: "\u793A\u4F8B\u529F\u80FD",
        // 网格卡片描述
        description: "\u6F14\u793A\u72EC\u7ACB\u6587\u4EF6\u5939\u7684\u7ED3\u6784\u3001\u6CE8\u518C\u65B9\u5F0F\u4E0E\u9875\u9762\u6E32\u67D3\u3002",
        // 页面区块标题：说明功能页是独立渲染的
        sectionTitle: "\u72EC\u7ACB\u7684\u529F\u80FD\u9875\u9762",
        // 页面区块说明：功能只需关心自己的内容
        sectionDescription: "\u6BCF\u4E2A\u529F\u80FD\u90FD\u6709\u81EA\u5DF1\u7684\u6587\u4EF6\u5939\u548C\u9875\u9762\u7EC4\u4EF6\u3002\u5916\u58F3\u53EA\u8D1F\u8D23\u7F51\u683C\u3001\u5BFC\u822A\u548C\u6837\u5F0F\uFF0C\u9875\u9762\u53EA\u9700\u5173\u5FC3\u81EA\u5DF1\u7684\u5185\u5BB9\u3002",
        // 计数按钮文案，后接点击次数
        counterLabel: "\u70B9\u51FB\u8BA1\u6570",
        // 页面区块标题：新增功能的操作步骤
        stepsTitle: "\u65B0\u589E\u4E00\u4E2A\u529F\u80FD",
        // 步骤一：复制示例文件夹
        step1: "\u590D\u5236 src/features/demo/ \u4E3A src/features/<id>/",
        // 步骤二：修改功能定义与页面
        step2: "\u4FEE\u6539 id\uFF0C\u5E76\u5728 entry\u3001page\u3001locales \u4E2D\u5199\u5165\u672C\u529F\u80FD\u7684\u5185\u5BB9",
        // 步骤三：在 featureList 中登记
        step3: "\u5728 src/features/index.ts \u7684 featureList \u91CC\u8FFD\u52A0\u8BE5\u6587\u4EF6\u5939\u7684\u9ED8\u8BA4\u5BFC\u51FA",
        // 步骤四：构建并刷新页面
        step4: "\u8FD0\u884C npm run build \u5E76\u5237\u65B0\u9875\u9762\uFF0C\u5361\u7247\u81EA\u52A8\u51FA\u73B0\u5728\u7F51\u683C\u4E2D"
      },
      en: {
        // Grid card title
        title: "Demo feature",
        // Grid card description
        description: "Shows the folder structure, registration and page rendering of a feature.",
        // Section heading explaining that the page renders inside the shell
        sectionTitle: "Standalone feature page",
        // Section text explaining that features only own their content
        sectionDescription: "Each feature owns its folder and page component. The shell handles the grid, navigation and styling; the page only cares about its own content.",
        // Counter button label, followed by the click count
        counterLabel: "Clicks",
        // Section heading listing the steps to add a feature
        stepsTitle: "Add a new feature",
        // Step one: copy the demo folder
        step1: "Copy src/features/demo/ to src/features/<id>/",
        // Step two: edit the feature definition and page
        step2: "Change id, then write the feature content in entry, page and locales",
        // Step three: register in featureList
        step3: "Append the folder default export to featureList in src/features/index.ts",
        // Step four: build and refresh
        step4: "Run npm run build and refresh; the card appears in the grid"
      }
    };

    // src/features/demo/page.tsx
    var import_react11 = __toESM(require("react"), 1);

    // src/features/demo/Card.tsx
    var import_react10 = __toESM(require("react"), 1);
    function Card({ className, children }) {
      return /* @__PURE__ */ import_react10.default.createElement("div", { className: cn("rounded-xl border border-line1 bg-layer1", className) }, children);
    }

    // src/features/demo/page.tsx
    function DemoPage({ t }) {
      const [count, setCount] = (0, import_react11.useState)(0);
      return /* @__PURE__ */ import_react11.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react11.default.createElement("header", null, /* @__PURE__ */ import_react11.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("title")), /* @__PURE__ */ import_react11.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("description"))), /* @__PURE__ */ import_react11.default.createElement(Card, { className: "p-4" }, /* @__PURE__ */ import_react11.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("sectionTitle")), /* @__PURE__ */ import_react11.default.createElement("p", { className: "mt-1.5 text-[12px] leading-5 text-secondary" }, t("sectionDescription")), /* @__PURE__ */ import_react11.default.createElement(Button, { variant: "outline", className: "mt-3", onClick: () => setCount((value) => value + 1) }, t("counterLabel"), ": ", count)), /* @__PURE__ */ import_react11.default.createElement(Card, { className: "p-4" }, /* @__PURE__ */ import_react11.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("stepsTitle")), /* @__PURE__ */ import_react11.default.createElement("ol", { className: "mt-1.5 list-decimal pl-4 text-[12px] leading-6 text-secondary" }, /* @__PURE__ */ import_react11.default.createElement("li", null, t("step1")), /* @__PURE__ */ import_react11.default.createElement("li", null, t("step2")), /* @__PURE__ */ import_react11.default.createElement("li", null, t("step3")), /* @__PURE__ */ import_react11.default.createElement("li", null, t("step4")))));
    }

    // src/features/demo/index.tsx
    var demoFeature = {
      id: "demo",
      order: 100,
      entry: DemoEntry,
      page: DemoPage,
      locales: demoLocales
    };
    var demo_default = demoFeature;

    // src/features/expand-process/locales.ts
    var expandProcessLocales = {
      zh: {
        // 开关标题
        title: "\u5C55\u5F00\u8FC7\u7A0B",
        // 开关用途说明：解释打开后会话里的哪些内容默认展开
        description: "\u9ED8\u8BA4\u5C55\u5F00\u4F1A\u8BDD\u91CC\u7684\u300C\u601D\u8003\u300D\u4E0E\u300C\u8FD0\u884C\u547D\u4EE4\u300D\uFF0C\u65E0\u9700\u9010\u884C\u70B9\u5F00\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002"
      },
      en: {
        // Switch title
        title: "Expand process",
        // Switch description explaining what expands when enabled
        description: "Keep reasoning and command rows expanded in conversations instead of opening each one.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions."
      }
    };

    // src/features/expand-process/toggle.tsx
    var import_react12 = __toESM(require("react"), 1);

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
    function readExpandProcessEnabled() {
      try {
        return window.localStorage.getItem(EXPAND_PROCESS_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[expand-process] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }
    function writeExpandProcessEnabled(enabled) {
      try {
        window.localStorage.setItem(EXPAND_PROCESS_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[expand-process] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/expand-process/toggle.tsx
    function ExpandIcon() {
      return /* @__PURE__ */ import_react12.default.createElement(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: "18",
          height: "18",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "m7 9 5-5 5 5" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "m7 15 5 5 5-5" })
      );
    }
    function ExpandProcessToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react12.useState)(readExpandProcessEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react12.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeExpandProcessEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react12.default.createElement("div", null, /* @__PURE__ */ import_react12.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full items-center gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react12.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand" }, /* @__PURE__ */ import_react12.default.createElement(ExpandIcon, null)),
        /* @__PURE__ */ import_react12.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "block text-[13px] font-medium leading-5 text-primary" }, t("title")), /* @__PURE__ */ import_react12.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react12.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react12.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 rounded-full bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react12.default.createElement("p", { className: "mt-1.5 text-[12px] leading-[18px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/expand-process/index.tsx
    var expandProcessFeature = {
      id: "expand-process",
      order: 10,
      switch: ExpandProcessToggle,
      locales: expandProcessLocales
    };
    var expand_process_default = expandProcessFeature;

    // src/features/index.ts
    var featureList = [expand_process_default, chat_style_default, demo_default];

    // src/shell/registry.ts
    var DEFAULT_FEATURE_ORDER = 100;
    function isFeatureDefinition(value) {
      if (typeof value !== "object" || value === null) return false;
      const candidate = value;
      if (typeof candidate.id !== "string" || candidate.id === "") return false;
      if (typeof candidate.locales !== "object" || candidate.locales === null) return false;
      if (candidate.client !== void 0) {
        if (typeof candidate.client !== "object" || candidate.client === null) return false;
        if (typeof candidate.client.apply !== "function") return false;
      }
      const hasPage = typeof candidate.entry === "function" && typeof candidate.page === "function";
      const hasSwitch = typeof candidate.switch === "function";
      return hasPage || hasSwitch;
    }
    function createFeatureRegistry(list) {
      const seen = /* @__PURE__ */ new Set();
      const features = [];
      for (const item of list) {
        if (!isFeatureDefinition(item)) continue;
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        features.push(item);
      }
      features.sort((a, b) => (a.order ?? DEFAULT_FEATURE_ORDER) - (b.order ?? DEFAULT_FEATURE_ORDER));
      return {
        list: features,
        find(id) {
          return features.find((feature) => feature.id === id);
        }
      };
    }

    // src/features/registry.ts
    var registry = createFeatureRegistry(featureList);

    // src/shell/AllInOnePage.tsx
    var import_react13 = __toESM(require("react"), 1);
    function BackGlyph() {
      return /* @__PURE__ */ import_react13.default.createElement(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: "14",
          height: "14",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.6",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react13.default.createElement("path", { d: "M9.5 3.5 5 8l4.5 4.5" })
      );
    }
    function AllInOnePage({ t }) {
      const [activeId, setActiveId] = (0, import_react13.useState)(null);
      const active = activeId ? registry.find(activeId) : void 0;
      if (active && "page" in active) {
        const ActivePage = active.page;
        return /* @__PURE__ */ import_react13.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-2 border-b border-line1 pb-3" }, /* @__PURE__ */ import_react13.default.createElement(Button, { variant: "ghost", onClick: () => setActiveId(null) }, /* @__PURE__ */ import_react13.default.createElement(BackGlyph, null), t("shell.back"))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "mt-4" }, /* @__PURE__ */ import_react13.default.createElement(ActivePage, { t: (key) => t(`${active.id}.${key}`) })));
      }
      return /* @__PURE__ */ import_react13.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react13.default.createElement("header", null, /* @__PURE__ */ import_react13.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("shell.pageTitle")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("shell.pageDescription"))), registry.list.length === 0 ? (
        // 尚未注册功能时的空态提示
        /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-5 rounded-xl border border-dashed border-line1 px-4 py-6 text-center text-[12px] text-secondary" }, t("shell.empty"))
      ) : /* @__PURE__ */ import_react13.default.createElement("div", { className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" }, registry.list.map((feature) => {
        const featureT = (key) => t(`${feature.id}.${key}`);
        if ("switch" in feature) {
          const SwitchEntry = feature.switch;
          return /* @__PURE__ */ import_react13.default.createElement("div", { key: feature.id, className: "sm:col-span-2" }, /* @__PURE__ */ import_react13.default.createElement(SwitchEntry, { t: featureT }));
        }
        const Entry = feature.entry;
        return /* @__PURE__ */ import_react13.default.createElement(Entry, { key: feature.id, t: featureT, open: () => setActiveId(feature.id) });
      })));
    }

    // src/shell/settings-nav-icon.ts
    var NAV_ICON_MARKER = "data-dsh-all-in-one-nav-icon";
    var NAV_ROW_SELECTOR = '[role="dialog"] nav button';
    var NAV_ICON_SIZE = 16;
    function isOwnNavRow(rowText, wantedLabel) {
      const wanted = wantedLabel.trim();
      if (!wanted) return false;
      return (rowText ?? "").trim() === wanted;
    }
    function navIconCss(iconDataUrl) {
      return [
        `[${NAV_ICON_MARKER}] > svg { display: none; }`,
        `[${NAV_ICON_MARKER}]::before {`,
        `  content: '';`,
        `  flex: none;`,
        `  width: ${NAV_ICON_SIZE}px;`,
        `  height: ${NAV_ICON_SIZE}px;`,
        `  background-image: url("${iconDataUrl}");`,
        `  background-repeat: no-repeat;`,
        `  background-position: center;`,
        `  background-size: ${NAV_ICON_SIZE}px ${NAV_ICON_SIZE}px;`,
        `}`
      ].join("\n");
    }
    function installSettingsNavIcon(ctx, t, iconSvg) {
      if (typeof document === "undefined") return;
      ctx.effect(() => {
        const iconDataUrl = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;
        const style = document.createElement("style");
        style.setAttribute("data-dsh-plugin", "dsh-all-in-one-nav-icon");
        style.textContent = navIconCss(iconDataUrl);
        document.head.appendChild(style);
        let disposed = false;
        let scheduled = false;
        const sync = () => {
          scheduled = false;
          if (disposed) return;
          const wantedLabel = t("shell.navTitle");
          for (const row of document.querySelectorAll(NAV_ROW_SELECTOR)) {
            if (isOwnNavRow(row.textContent, wantedLabel)) {
              row.setAttribute(NAV_ICON_MARKER, "");
            } else {
              row.removeAttribute(NAV_ICON_MARKER);
            }
          }
        };
        const schedule = () => {
          if (scheduled || disposed) return;
          scheduled = true;
          queueMicrotask(sync);
        };
        sync();
        const observer = new MutationObserver(schedule);
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        return () => {
          disposed = true;
          observer.disconnect();
          for (const row of document.querySelectorAll(`[${NAV_ICON_MARKER}]`)) {
            row.removeAttribute(NAV_ICON_MARKER);
          }
          style.remove();
        };
      }, "dsh-all-in-one: settings nav icon");
    }

    // src/entry.tsx
    var LOCALE_NAMESPACE = "all-in-one";
    var SHELL_DICTIONARIES = {
      zh: {
        // 设置左侧导航项名称
        "shell.navTitle": "All In One",
        // 页面主标题
        "shell.pageTitle": "All In One",
        // 页面说明，解释这一页的用途
        "shell.pageDescription": "\u6240\u6709\u72EC\u7ACB\u7684\u5C0F\u5DE5\u5177\u90FD\u6536\u62E2\u5728\u8FD9\u91CC\uFF0C\u70B9\u51FB\u5361\u7247\u8FDB\u5165\u5BF9\u5E94\u7684\u529F\u80FD\u3002",
        // 尚未注册任何功能时的空态提示
        "shell.empty": "\u8FD8\u6CA1\u6709\u6CE8\u518C\u4EFB\u4F55\u529F\u80FD\uFF0C\u5728 src/features \u4E0B\u65B0\u5EFA\u6587\u4EF6\u5939\u5373\u53EF\u6DFB\u52A0\u3002",
        // 从功能页面返回功能网格的按钮文案
        "shell.back": "\u8FD4\u56DE"
      },
      en: {
        // Settings navigation entry label
        "shell.navTitle": "All In One",
        // Page heading
        "shell.pageTitle": "All In One",
        // Page description explaining the purpose of this section
        "shell.pageDescription": "Every standalone tool lives here. Pick a card to open it.",
        // Empty state shown when no feature is registered
        "shell.empty": "No features registered yet. Add a folder under src/features.",
        // Button that leaves a feature page and returns to the grid
        "shell.back": "Back"
      }
    };
    var LOCALE_DICTIONARIES = mergeDictionaries(
      SHELL_DICTIONARIES,
      collectFeatureLocales(registry.list)
    );
    var plugin = {
      inject: ["slots", "locale"],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement("style");
          style.setAttribute("data-dsh-plugin", "dsh-all-in-one");
          style.textContent = styles_default;
          document.head.appendChild(style);
          return () => style.remove();
        });
        ctx.effect(() => {
          const disposers = Object.entries(LOCALE_DICTIONARIES).map(
            ([locale, dictionary]) => ctx.locale.register(LOCALE_NAMESPACE, locale, dictionary)
          );
          return () => disposers.forEach((dispose) => dispose());
        });
        const t = ctx.locale.bind(LOCALE_NAMESPACE);
        installSettingsNavIcon(ctx, t, icon_default);
        const SettingsSection = () => /* @__PURE__ */ import_react14.default.createElement(AllInOnePage, { t });
        ctx.slots.inject(
          "settings.section",
          () => ctx.slots.register(
            {
              name: "settings.section",
              id: "all-in-one",
              order: 30,
              label: () => t("shell.navTitle")
            },
            SettingsSection
          )
        );
        for (const feature of registry.list) {
          try {
            feature.client?.apply(ctx, (key) => t(`${feature.id}.${key}`));
          } catch (error) {
            console.error("[all-in-one] \u5BA2\u6237\u7AEF\u6269\u5C55\u542F\u52A8\u5931\u8D25:", feature.id, error);
          }
        }
      }
    };
    var entry_default = plugin;

    return module.exports.default || module.exports;
  },
});
