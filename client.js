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
    var import_react20 = __toESM(require("react"), 1);

    // .build/styles.css
    var styles_default = "*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.\\!container{width:100%!important}.container{width:100%}@media (min-width:640px){.\\!container{max-width:640px!important}.container{max-width:640px}}@media (min-width:768px){.\\!container{max-width:768px!important}.container{max-width:768px}}@media (min-width:1024px){.\\!container{max-width:1024px!important}.container{max-width:1024px}}@media (min-width:1280px){.\\!container{max-width:1280px!important}.container{max-width:1280px}}@media (min-width:1536px){.\\!container{max-width:1536px!important}.container{max-width:1536px}}.visible{visibility:visible}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:0}.top-0{top:0}.isolate{isolation:isolate}.z-10{z-index:10}.z-20{z-index:20}.z-\\[100\\]{z-index:100}.-ml-px{margin-left:-1px}.mb-1{margin-bottom:.25rem}.ml-2{margin-left:.5rem}.ml-auto{margin-left:auto}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-full{height:100%}.max-h-72{max-height:18rem}.max-h-\\[320px\\]{max-height:320px}.max-h-full{max-height:100%}.w-12{width:3rem}.w-3\\.5{width:.875rem}.w-4{width:1rem}.w-6{width:1.5rem}.w-9{width:2.25rem}.w-full{width:100%}.min-w-0{min-width:0}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.flex-none{flex:none}.shrink-0{flex-shrink:0}.translate-x-0\\.5{--tw-translate-x:0.125rem}.translate-x-0\\.5,.translate-x-\\[18px\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-\\[18px\\]{--tw-translate-x:18px}.cursor-pointer{cursor:pointer}.cursor-zoom-in{cursor:zoom-in}.auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.25rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem*var(--tw-space-y-reverse))}.self-stretch{align-self:stretch}.overflow-y-auto{overflow-y:auto}.break-all{word-break:break-all}.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border{border-width:1px}.border-0{border-width:0}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}.border-solid{border-style:solid}.border-dashed{border-style:dashed}.border-danger{border-color:var(--dsw-alias-state-error-primary)}.border-line4{border-color:var(--dsw-alias-border-l4)}.border-primary{border-color:var(--dsw-alias-label-primary)}.border-success{border-color:var(--dsw-alias-state-success-primary)}.bg-base{background-color:var(--dsw-alias-bg-base)}.bg-brand{background-color:var(--dsw-alias-brand-primary)}.bg-layer1{background-color:var(--dsw-alias-bg-layer-1)}.bg-layer2{background-color:var(--dsw-alias-bg-layer-2)}.bg-line2{background-color:var(--dsw-alias-border-l2)}.bg-overlay{background-color:var(--dsw-alias-bg-overlay)}.bg-primary{background-color:var(--dsw-alias-label-primary)}.bg-transparent{background-color:transparent}.object-contain{-o-object-fit:contain;object-fit:contain}.p-0{padding:0}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-0{padding-top:0;padding-bottom:0}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-px{padding-top:1px;padding-bottom:1px}.pb-3{padding-bottom:.75rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[15px\\]{font-size:15px}.text-\\[17px\\]{font-size:17px}.font-medium{font-weight:500}.font-semibold{font-weight:600}.lowercase{text-transform:lowercase}.leading-4{line-height:1rem}.leading-5{line-height:1.25rem}.leading-6{line-height:1.5rem}.leading-\\[16px\\]{line-height:16px}.leading-\\[18px\\]{line-height:18px}.text-\\[color\\:var\\(--dsw-alias-bg-base\\)\\]{color:var(--dsw-alias-bg-base)}.text-brand{color:var(--dsw-alias-brand-primary)}.text-danger{color:var(--dsw-alias-state-error-primary)}.text-primary{color:var(--dsw-alias-label-primary)}.text-secondary{color:var(--dsw-alias-label-secondary)}.text-success{color:var(--dsw-alias-state-success-primary)}.text-warn{color:var(--dsw-alias-state-warn-primary)}.underline{text-decoration-line:underline}.accent-brand{accent-color:var(--dsw-alias-brand-primary)}.opacity-80{opacity:.8}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dsh-aio-root{color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}:where(.dsh-aio-root) :where(*,:before,:after){box-sizing:border-box;border-style:solid;border-width:0}:where(.dsh-aio-root) :where(h1,h2,h3,h4,h5,h6,p,ul,ol){margin:0;padding:0}:where(.dsh-aio-root) :where(ul,ol){list-style:none}:where(.dsh-aio-root) :where(textarea){resize:vertical}.aio-card-grid>*>*{height:100%}.dsh-aio-root .aio-switch{border-radius:9999px!important}.placeholder\\:text-secondary::-moz-placeholder{color:var(--dsw-alias-label-secondary)}.placeholder\\:text-secondary::placeholder{color:var(--dsw-alias-label-secondary)}.hover\\:bg-layer2:hover{background-color:var(--dsw-alias-bg-layer-2)}.hover\\:text-danger:hover{color:var(--dsw-alias-state-error-primary)}.hover\\:text-primary:hover{color:var(--dsw-alias-label-primary)}.focus\\:border-brand:focus{border-color:var(--dsw-alias-brand-primary)}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus-visible\\:ring-brand:focus-visible{--tw-ring-color:var(--dsw-alias-brand-primary)}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px}.disabled\\:cursor-default:disabled{cursor:default}@media (min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}";

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

    // src/features/power-pack/client.tsx
    var client_exports = {};
    __export(client_exports, {
      apply: () => apply
    });
    var import_react2 = __toESM(require("react"), 1);

    // src/features/power-pack/seat.tsx
    var import_react = __toESM(require("react"), 1);
    var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    var BUILTIN_NAME_KEYS = {
      standard: "presetStandardName",
      ptc: "presetPtcName",
      minimal: "presetMinimalName",
      cordis: "presetCordisName"
    };
    var BUILTIN_DESCRIPTION_KEYS = {
      standard: "presetStandardDescription",
      ptc: "presetPtcDescription",
      minimal: "presetMinimalDescription",
      cordis: "presetCordisDescription"
    };
    function presetName(preset, t) {
      if (preset.name) return preset.name;
      const key = BUILTIN_NAME_KEYS[preset.id];
      return key === void 0 ? preset.id : t(key);
    }
    function presetDescription(preset, t) {
      if (preset.description) return preset.description;
      const key = BUILTIN_DESCRIPTION_KEYS[preset.id];
      return key === void 0 ? void 0 : t(key);
    }
    function PresetDropdown({ current, options, placeholder, disabled, onPick }) {
      const [open, setOpen] = (0, import_react.useState)(false);
      const selected = options.find((option) => option.id === current);
      const canOpen = !disabled && options.length > 0;
      const items = options.map((option) => ({
        id: option.id,
        label: /* @__PURE__ */ import_react.default.createElement("span", { className: "ufIuna_item" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "ufIuna_itemName" }, option.name), option.description ? (
          // 选项说明
          /* @__PURE__ */ import_react.default.createElement("span", { className: "ufIuna_itemDesc" }, option.description)
        ) : null)
      }));
      return /* @__PURE__ */ import_react.default.createElement(
        import_dsh_client_ui_primitives.Menu,
        {
          open: open && canOpen,
          onClose: () => setOpen(false),
          items,
          selectedId: current,
          onSelect: (id) => {
            setOpen(false);
            onPick(id);
          },
          align: "start",
          portal: true,
          className: "ufIuna_menuAnchor",
          anchor: (
            // 触发按钮的结构与类名同宿主预设选择器
            /* @__PURE__ */ import_react.default.createElement(
              "button",
              {
                type: "button",
                className: "ufIuna_seat",
                "aria-haspopup": "menu",
                "aria-expanded": open && canOpen,
                disabled: !canOpen,
                onClick: () => setOpen((value) => !value)
              },
              /* @__PURE__ */ import_react.default.createElement(import_dsh_client_ui_primitives.IconAgentPresetOutlineRegular, { className: "ufIuna_seatIcon" }),
              /* @__PURE__ */ import_react.default.createElement("span", { className: "ufIuna_seatLabel" }, selected === void 0 ? placeholder : selected.name),
              /* @__PURE__ */ import_react.default.createElement(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: "ufIuna_chevron" })
            )
          )
        }
      );
    }
    function PowerPackSeat({
      sessionId,
      usePowerPackSeat,
      load,
      selectMode,
      selectPack,
      applyStaged,
      t
    }) {
      const snapshot = usePowerPackSeat((state) => state);
      const actionsRef = (0, import_react.useRef)({ load, applyStaged });
      actionsRef.current = { load, applyStaged };
      (0, import_react.useEffect)(() => {
        void actionsRef.current.load();
        if (sessionId !== void 0) void actionsRef.current.applyStaged();
      }, [sessionId]);
      const modes = snapshot.modes.map((preset) => ({
        id: preset.id,
        name: presetName(preset, t),
        description: presetDescription(preset, t)
      }));
      const disabled = snapshot.status === "loading";
      return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react.default.createElement(
        PresetDropdown,
        {
          current: snapshot.mode,
          options: modes,
          placeholder: t("modeLabel"),
          disabled,
          onPick: (id) => void selectMode(id)
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        PresetDropdown,
        {
          current: snapshot.pack,
          options: snapshot.packs,
          placeholder: t("seatLabel"),
          disabled,
          onPick: (id) => void selectPack(id)
        }
      )), snapshot.error ? /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-1 text-[12px] leading-4 text-danger", role: "alert" }, snapshot.error === "session already started" ? t("seatSessionStarted") : `${t("seatSelectFailed")}\uFF1A${snapshot.error}`) : null);
    }

    // src/features/power-pack/api.ts
    var ENDPOINT = "/dsh-all-in-one/power-packs";
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
            console.error("[power-pack] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[power-pack] \u8BF7\u6C42\u6280\u80FD\u5305\u63A5\u53E3\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadPowerPacks() {
      return request();
    }
    function composePowerPack(pack, mode) {
      const body = { action: "compose", pack, mode };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    function savePowerPack(pack) {
      const body = { action: "save", pack };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    function deletePowerPack(id) {
      const body = { action: "delete", id };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    function setDefaultPowerPack(id) {
      const body = { action: "setDefault", id };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }

    // src/features/power-pack/seat-store.ts
    var PRESET_ID_PREFIX = "power-pack-";
    function initialState() {
      return { status: "idle", modes: [], packs: [], mode: "", pack: "", error: null };
    }
    function createSeatStore() {
      let snapshot = initialState();
      const listeners2 = /* @__PURE__ */ new Set();
      return {
        getSnapshot: () => snapshot,
        set(patch) {
          snapshot = { ...snapshot, ...patch };
          for (const listener of listeners2) listener();
        },
        subscribe(listener) {
          listeners2.add(listener);
          return () => {
            listeners2.delete(listener);
          };
        }
      };
    }
    function parsePresetId(presetId) {
      if (!presetId.startsWith(PRESET_ID_PREFIX)) return { mode: presetId, pack: "" };
      const body = presetId.slice(PRESET_ID_PREFIX.length);
      const separator = body.indexOf("@");
      if (separator < 0) return { mode: "", pack: body };
      return { mode: body.slice(separator + 1), pack: body.slice(0, separator) };
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
          let packs = [];
          let defaultPackId = "";
          let recent;
          try {
            const payload = await loadPowerPacks();
            packs = payload.packs.map(({ id, name, description }) => ({ id, name, description }));
            defaultPackId = payload.defaultPackId;
            recent = payload.recentComposed[0];
          } catch (error) {
            console.error("[power-pack] \u8BFB\u53D6\u6280\u80FD\u5305\u5217\u8868\u5931\u8D25:", error);
          }
          const modes = result.value.presets.filter(
            (preset) => preset.broken === void 0 && !preset.id.startsWith(PRESET_ID_PREFIX)
          );
          const fallbackMode = modes.find((preset) => preset.isDefault)?.id ?? modes[0]?.id ?? "";
          const fromSession = parsePresetId(sessionPreset(ctx, sessionId) ?? "");
          const sessionBlank = sessionId === void 0 || ctx.sessions?.list.getSnapshot().byId[sessionId]?.blank !== false;
          const fallbackPack = sessionBlank ? recent?.pack || defaultPackId : "";
          const recentMode = sessionBlank ? recent?.mode ?? "" : "";
          const mode = staged?.mode || fromSession.mode || recentMode || fallbackMode;
          const pack = staged ? staged.pack : fromSession.pack || fallbackPack;
          store.set({ status: "ready", modes, packs, mode, pack, error: null });
          if (staged === void 0 && fromSession.pack === "" && fallbackPack !== "" && mode !== "") {
            if (sessionId === void 0) staged = { mode, pack: fallbackPack };
            else await commit(sessionId, mode, fallbackPack);
          }
        } catch (error) {
          console.error("[power-pack] \u8BFB\u53D6\u6A21\u5F0F\u4E0E\u6280\u80FD\u5305\u5931\u8D25:", error);
          store.set({
            status: "error",
            error: error instanceof Error ? error.message : String(error)
          });
        }
      };
      const commit = async (sessionId, mode, pack) => {
        if (sessionId === void 0) {
          staged = { mode, pack };
          return;
        }
        const api = ctx.remote?.agentPresets;
        if (!api) {
          store.set({ error: "agentPresets remote unavailable" });
          staged = void 0;
          return;
        }
        const summary = ctx.sessions?.list.getSnapshot().byId[sessionId];
        if (summary && summary.blank === false) {
          store.set({ error: "session already started" });
          staged = void 0;
          return;
        }
        try {
          const presetId = pack === "" ? mode : (await composePowerPack(pack, mode)).presetId;
          const result = await api.select(sessionId, presetId);
          if (!result.ok) {
            store.set({ error: result.error?.message ?? "select failed" });
            staged = void 0;
            return;
          }
          staged = void 0;
          store.set({ error: null });
        } catch (error) {
          console.error("[power-pack] \u5E94\u7528\u6A21\u5F0F\u4E0E\u6280\u80FD\u5305\u5931\u8D25:", error);
          store.set({ error: error instanceof Error ? error.message : String(error) });
          staged = void 0;
        }
      };
      const selectMode = async (sessionId, modeId) => {
        if (busy) return;
        store.set({ mode: modeId, error: null });
        if (sessionId === void 0) {
          await commit(void 0, modeId, store.getSnapshot().pack);
          return;
        }
        busy = true;
        try {
          await commit(sessionId, modeId, store.getSnapshot().pack);
        } finally {
          busy = false;
        }
      };
      const selectPack = async (sessionId, packId) => {
        if (busy) return;
        const next = packId === store.getSnapshot().pack ? "" : packId;
        store.set({ pack: next, error: null });
        if (sessionId === void 0) {
          await commit(void 0, store.getSnapshot().mode, next);
          return;
        }
        busy = true;
        try {
          await commit(sessionId, store.getSnapshot().mode, next);
        } finally {
          busy = false;
        }
      };
      const applyStaged = async (sessionId) => {
        if (staged === void 0 || busy) return;
        busy = true;
        try {
          await commit(sessionId, staged.mode, staged.pack);
        } finally {
          busy = false;
        }
      };
      return { store, load, selectMode, selectPack, applyStaged };
    }

    // src/features/power-pack/client.tsx
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
                hooks: { powerPackSeat: controller.store },
                load: () => controller.load(sessionId),
                selectMode: (presetId) => controller.selectMode(sessionId, presetId),
                selectPack: (packId) => controller.selectPack(sessionId, packId),
                applyStaged: async () => {
                  if (sessionId !== void 0) await controller.applyStaged(sessionId);
                }
              })
            },
            (props) => /* @__PURE__ */ import_react2.default.createElement(PowerPackSeat, { ...props, t })
          )
        );
      });
    }

    // src/features/power-pack/entry.tsx
    var import_react3 = __toESM(require("react"), 1);
    function PowerPackIcon() {
      return /* @__PURE__ */ import_react3.default.createElement(
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
        /* @__PURE__ */ import_react3.default.createElement("path", { d: "M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "10", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "14", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react3.default.createElement("circle", { cx: "18", cy: "12", r: "1" })
      );
    }
    function PowerPackEntry({ t, open }) {
      return /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          type: "button",
          onClick: open,
          className: "flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react3.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react3.default.createElement(PowerPackIcon, null)),
        /* @__PURE__ */ import_react3.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react3.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description")))
      );
    }

    // src/features/power-pack/locales.ts
    var powerPackLocales = {
      zh: {
        // 网格入口标题
        title: "\u6280\u80FD\u5305",
        // 网格入口描述
        description: "\u4E3A\u4E0D\u540C\u4EFB\u52A1\u51C6\u5907\u4E0D\u540C\u7684\u6280\u80FD\u3001\u63D2\u4EF6\u4E0E MCP\uFF0C\u65B0\u5EFA\u5BF9\u8BDD\u65F6\u6309\u6280\u80FD\u5305\u9009\u62E9\u3002",
        // 功能页标题
        pageTitle: "\u6280\u80FD\u5305",
        // 功能页说明
        pageDescription: "\u6BCF\u4E2A\u6280\u80FD\u5305\u662F\u4E00\u5957\u53E0\u52A0\u5728\u6A21\u5F0F\u4E4B\u4E0A\u7684\u6280\u80FD\u4E0E\u5DE5\u5177\u914D\u7F6E\u3002\u4FDD\u5B58\u540E\u5728\u65B0\u5EFA\u4EFB\u52A1\u7684\u300C\u6280\u80FD\u5305\u300D\u4E0B\u62C9\u91CC\u9009\u62E9\uFF0C\u53EA\u5BF9\u9009\u62E9\u5B83\u7684\u4F1A\u8BDD\u751F\u6548\u3002",
        // 新建技能包按钮
        newPack: "\u65B0\u5EFA\u6280\u80FD\u5305",
        // 空态提示
        empty: "\u8FD8\u6CA1\u6709\u521B\u5EFA\u4EFB\u4F55\u6280\u80FD\u5305\u3002\u65B0\u5EFA\u4E00\u4E2A\u6280\u80FD\u5305\uFF0C\u52FE\u9009\u5B83\u9700\u8981\u7684\u6280\u80FD\u4E0E\u5DE5\u5177\u3002",
        // 编辑按钮
        edit: "\u7F16\u8F91",
        // 删除按钮
        delete: "\u5220\u9664",
        // 把技能包设为新建会话默认选择的按钮
        setDefault: "\u8BBE\u4E3A\u9ED8\u8BA4",
        // 已是默认技能包的标识
        defaultBadge: "\u9ED8\u8BA4",
        // 设置默认技能包失败提示
        setDefaultFailed: "\u8BBE\u7F6E\u9ED8\u8BA4\u5931\u8D25",
        // 保存按钮
        save: "\u4FDD\u5B58",
        // 保存中的按钮文案
        saving: "\u4FDD\u5B58\u4E2D\u2026",
        // 删除确认提示
        confirmDelete: "\u5220\u9664\u540E\u8BE5\u6280\u80FD\u5305\u4E0D\u518D\u51FA\u73B0\u5728\u65B0\u5EFA\u4EFB\u52A1\u7684\u4E0B\u62C9\u5217\u8868\u4E2D\uFF0C\u786E\u5B9A\u5220\u9664\uFF1F",
        // 加载失败提示
        loadFailed: "\u8BFB\u53D6\u6280\u80FD\u5305\u914D\u7F6E\u5931\u8D25",
        // 保存失败提示
        saveFailed: "\u4FDD\u5B58\u5931\u8D25",
        // 删除失败提示
        deleteFailed: "\u5220\u9664\u5931\u8D25",
        // 名称字段标签
        nameLabel: "\u6280\u80FD\u5305\u540D\u79F0",
        // 名称输入占位
        namePlaceholder: "\u4F8B\u5982\uFF1A\u4EE3\u7801\u5BA1\u67E5",
        // 描述字段标签
        descriptionLabel: "\u6280\u80FD\u5305\u63CF\u8FF0",
        // 描述输入占位
        descriptionPlaceholder: "\u4E00\u53E5\u8BDD\u8BF4\u660E\u8FD9\u4E2A\u6280\u80FD\u5305\u9002\u5408\u4EC0\u4E48\u4EFB\u52A1",
        // 提示词增强字段标签
        systemPromptLabel: "\u63D0\u793A\u8BCD\u589E\u5F3A",
        // 提示词增强占位
        systemPromptPlaceholder: "\u4F8B\u5982\uFF1A\u53EA\u5BA1\u67E5\u4EE3\u7801\uFF0C\u5148\u6307\u51FA\u6F5C\u5728\u7F3A\u9677\u4E0E\u6D4B\u8BD5\u7F3A\u53E3\uFF0C\u4FEE\u6539\u6587\u4EF6\u524D\u5148\u8BE2\u95EE\u3002",
        // 技能分组标签
        skillsTitle: "Skill \u6280\u80FD",
        // 插件分组标签
        pluginsTitle: "\u63D2\u4EF6\u4E0E\u5DE5\u5177",
        // MCP 分组标签
        mcpTitle: "MCP \u670D\u52A1\u5668",
        // 重试加载按钮
        retry: "\u91CD\u8BD5",
        // 三态模式：全部
        modeAll: "\u5168\u90E8",
        // 三态模式：仅应用
        modeInclude: "\u4EC5\u5E94\u7528",
        // 三态模式：仅排除
        modeExclude: "\u4EC5\u6392\u9664",
        // 搜索技能占位
        searchSkills: "\u641C\u7D22\u6280\u80FD",
        // 未找到技能
        noSkills: "\u6CA1\u6709\u5339\u914D\u7684\u6280\u80FD\u3002",
        // 已装插件标记
        installedBadge: "\u5DF2\u5B89\u88C5\u63D2\u4EF6",
        // 插件分组下的全局插件说明
        pluginsGlobalHint: "\u6807\u8BB0\u300C\u5DF2\u5B89\u88C5\u63D2\u4EF6\u300D\u7684\u6761\u76EE\u5728\u5BBF\u4E3B\u542F\u52A8\u65F6\u5C31\u5DF2\u52A0\u8F7D\uFF1A\u52FE\u9009\u8868\u793A\u4FDD\u7559\u5728\u4F1A\u8BDD\u91CC\uFF0C\u672A\u52FE\u9009\u8868\u793A\u5728\u8BE5\u6280\u80FD\u5305\u7684\u4F1A\u8BDD\u91CC\u5C4F\u853D\u5B83\u7684\u5DE5\u5177\u4E0E\u63D0\u793A\u8BCD\u6CE8\u5165\u3002",
        // 全局 MCP 组标记
        globalMcpBadge: "\u5168\u5C40 MCP",
        // 全局 MCP 的工具数量说明；{count} 由界面替换成实际个数
        globalMcpTools: "\u5DF2\u5728\u5BBF\u4E3B\u542F\u52A8\u65F6\u8FDE\u63A5\uFF0C\u5171 {count} \u4E2A\u5DE5\u5177\uFF1B\u52FE\u9009\u4FDD\u7559\u5728\u4F1A\u8BDD\u4E2D\uFF0C\u53D6\u6D88\u52FE\u9009\u6309\u4F1A\u8BDD\u5C4F\u853D\u3002",
        // 宿主没有已连接的全局 MCP 时的提示
        mcpEmpty: "\u5BBF\u4E3B\u5F53\u524D\u6CA1\u6709\u5DF2\u8FDE\u63A5\u7684 MCP \u670D\u52A1\u5668\u3002",
        // MCP 分组的说明：服务器在宿主配置文件里声明，此处只决定会话内是否屏蔽
        mcpGlobalHint: "MCP \u670D\u52A1\u5668\u5728\u5BBF\u4E3B\u7684\u914D\u7F6E\u6587\u4EF6\u91CC\u58F0\u660E\u3001\u542F\u52A8\u65F6\u8FDE\u63A5\uFF1A\u52FE\u9009\u8868\u793A\u4FDD\u7559\u5728\u4F1A\u8BDD\u91CC\uFF0C\u672A\u52FE\u9009\u8868\u793A\u5728\u8BE5\u6280\u80FD\u5305\u7684\u4F1A\u8BDD\u91CC\u5C4F\u853D\u5B83\u7684\u5DE5\u5177\u4E0E\u63D0\u793A\u8BCD\u6CE8\u5165\u3002",
        // 必填校验提示
        nameRequired: "\u8BF7\u586B\u5199\u6280\u80FD\u5305\u540D\u79F0\u3002",
        // 存储位置说明
        storageHint: "\u914D\u7F6E\u6587\u4EF6\u4F4D\u7F6E",
        // 新会话选择器的模式下拉占位文案
        modeLabel: "\u6A21\u5F0F",
        // 新会话选择器的技能包下拉占位文案
        seatLabel: "\u6280\u80FD\u5305",
        // 内置标准模式的显示名
        presetStandardName: "\u6807\u51C6\u6A21\u5F0F",
        // 内置 PTC 模式的显示名
        presetPtcName: "PTC \u6A21\u5F0F",
        // 内置极简模式的显示名
        presetMinimalName: "\u6781\u7B80\u6A21\u5F0F",
        // 内置创造模式的显示名
        presetCordisName: "\u521B\u9020\u6A21\u5F0F",
        // 内置标准模式的说明
        presetStandardDescription: "\u5904\u7406\u4EE3\u7801\u3001\u6587\u4EF6\u548C\u8D44\u6599\uFF0C\u9002\u5408\u5927\u591A\u6570\u4EFB\u52A1\u3002Agent \u4F1A\u6309\u9700\u4F7F\u7528\u68C0\u7D22\u3001\u7F16\u8F91\u548C\u7EC8\u7AEF\u7B49\u5DE5\u5177\u3002",
        // 内置 PTC 模式的说明
        presetPtcDescription: "\u5305\u542B\u6807\u51C6\u6A21\u5F0F\u7684\u6240\u6709\u80FD\u529B\uFF0C\u66F4\u9002\u5408\u6279\u91CF\u8C03\u7528\u5DE5\u5177\uFF0C\u5E76\u5BF9\u7ED3\u679C\u8FDB\u884C\u7B5B\u9009\u3001\u6574\u7406\u3001\u53BB\u91CD\u3001\u7EDF\u8BA1\u6216\u6C47\u603B\u7684\u4EFB\u52A1\u3002",
        // 内置极简模式的说明
        presetMinimalDescription: "Agent \u4F7F\u7528\u7EC8\u7AEF\u548C\u56FE\u7247\u8BFB\u53D6\u5DE5\u5177\uFF0C\u5E76\u652F\u6301\u4E0A\u4E0B\u6587\u538B\u7F29\uFF0C\u9002\u5408\u6D4B\u8BD5\u548C\u5BF9\u6BD4\u5176\u57FA\u7840\u8868\u73B0\u3002",
        // 内置创造模式的说明
        presetCordisDescription: "\u7528\u5BF9\u8BDD\u5B9A\u5236 DSH\uFF1A\u8BA9 Agent \u7F16\u5199\u63D2\u4EF6\uFF0C\u6DFB\u52A0\u65B0\u529F\u80FD\u6216\u754C\u9762\uFF1B\u4E5F\u80FD\u7EC4\u5408\u5DE5\u5177\u548C\u63D0\u793A\u8BCD\uFF0C\u521B\u5EFA\u81EA\u5DF1\u7684\u6A21\u5F0F\u3002",
        // 会话已开始后尝试切换技能包的提示
        seatSessionStarted: "\u4F1A\u8BDD\u5DF2\u5F00\u59CB\uFF0C\u65E0\u6CD5\u518D\u5207\u6362\u6280\u80FD\u5305\u3002\u8BF7\u5728\u65B0\u5EFA\u4EFB\u52A1\u65F6\u9009\u62E9\u3002",
        // 技能包切换失败的提示前缀
        seatSelectFailed: "\u5207\u6362\u5931\u8D25"
      },
      en: {
        // Grid entry title
        title: "Power packs",
        // Grid entry description
        description: "Prepare skills, plugins and MCP servers per task, then pick a power pack when starting a chat.",
        // Page title
        pageTitle: "Power packs",
        // Page description
        pageDescription: "Each power pack layers on top of the mode chosen for a new task. Pick it from the Power pack dropdown when starting a task; it only applies to sessions that choose it.",
        // New power pack button
        newPack: "New power pack",
        // Empty state
        empty: "No power packs yet. Create one and choose the skills and tools it needs.",
        // Edit button
        edit: "Edit",
        // Delete button
        delete: "Delete",
        // Button that makes a pack the default choice for new sessions
        setDefault: "Set as default",
        // Badge shown on the default pack
        defaultBadge: "Default",
        // Failure when setting the default pack
        setDefaultFailed: "Could not set default",
        // Save button
        save: "Save",
        // Save-in-progress label
        saving: "Saving\u2026",
        // Delete confirmation
        confirmDelete: "This power pack will no longer appear in the new-task dropdown. Delete it?",
        // Load failure
        loadFailed: "Could not load power packs",
        // Save failure
        saveFailed: "Could not save",
        // Delete failure
        deleteFailed: "Could not delete",
        // Name field label
        nameLabel: "Power pack name",
        // Name placeholder
        namePlaceholder: "e.g. Code review",
        // Description field label
        descriptionLabel: "Description",
        // Description placeholder
        descriptionPlaceholder: "One sentence about when to use this power pack",
        // Prompt enhancement label
        systemPromptLabel: "Prompt enhancement",
        // Prompt enhancement placeholder
        systemPromptPlaceholder: "e.g. Only review code. Point out defects and test gaps, ask before editing files.",
        // Skills group label
        skillsTitle: "Skills",
        // Plugins group label
        pluginsTitle: "Plugins and tools",
        // MCP group label
        mcpTitle: "MCP servers",
        // Retry loading button
        retry: "Retry",
        // Rule mode: all
        modeAll: "All",
        // Rule mode: include
        modeInclude: "Only selected",
        // Rule mode: exclude
        modeExclude: "All except selected",
        // Skill search placeholder
        searchSkills: "Search skills",
        // No matching skills
        noSkills: "No matching skills.",
        // Installed plugin badge
        installedBadge: "Installed plugin",
        // Global plugin hint under the plugin group
        pluginsGlobalHint: 'Entries marked "Installed plugin" load at host startup: checked keeps them in the session, unchecked masks their tools and prompt injection inside this power pack session.',
        // Global MCP group badge
        globalMcpBadge: "Global MCP",
        // Global MCP tool-count hint; {count} is replaced with the actual number
        globalMcpTools: "Connected at host startup with {count} tools; keep it checked to retain it in this session, clear it to mask it per session.",
        // Empty hint when the host has no connected global MCP server
        mcpEmpty: "The host has no connected MCP servers.",
        // MCP group hint: servers come from the host config file; this only masks them per session
        mcpGlobalHint: "MCP servers are declared in the host config file and connect at startup: checked keeps one in the session, unchecked masks its tools and prompt injection inside this power pack session.",
        // Required name message
        nameRequired: "Enter a power pack name.",
        // Storage location hint
        storageHint: "Config file",
        // Placeholder for the mode dropdown
        modeLabel: "Mode",
        // Placeholder for the power pack dropdown
        seatLabel: "Power pack",
        // Display name for the built-in Standard mode
        presetStandardName: "Standard mode",
        // Display name for the built-in PTC mode
        presetPtcName: "PTC mode",
        // Display name for the built-in Minimal mode
        presetMinimalName: "Minimal mode",
        // Display name for the built-in Creator mode
        presetCordisName: "Creator mode",
        // Description for the built-in Standard mode
        presetStandardDescription: "Work with code, files, and information. Suitable for most tasks, with search, editing, terminal commands, and other tools available as needed.",
        // Description for the built-in PTC mode
        presetPtcDescription: "Includes all Standard mode capabilities. Better suited to tasks that call tools in batches and then filter, organize, deduplicate, count, or summarize the results.",
        // Description for the built-in Minimal mode
        presetMinimalDescription: "The agent uses a terminal and image reading, with context compaction. Useful for testing and comparing its basic performance.",
        // Description for the built-in Creator mode
        presetCordisDescription: "Customize DSH through conversation. Let the agent write plugins that add features or UI, or combine tools and prompts to create your own mode.",
        // Shown when trying to switch a session that already started
        seatSessionStarted: "This session has started; a power pack can only be chosen for a new task.",
        // Prefix for a failed power pack switch
        seatSelectFailed: "Could not switch"
      }
    };

    // src/features/power-pack/page.tsx
    var import_react8 = __toESM(require("react"), 1);

    // src/components/Button.tsx
    var import_react4 = __toESM(require("react"), 1);

    // src/common/cn.ts
    function cn(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    // src/components/Button.tsx
    var VARIANT_CLASS = {
      // 构建关闭了 preflight，浏览器会给 button 加上原生边框与灰底，ghost 必须显式清掉
      ghost: "inline-flex items-center gap-1 rounded-lg border-0 bg-transparent px-2 py-1 text-secondary hover:bg-layer2 hover:text-primary",
      // line1、line2 在宿主浅色主题下几乎看不见，描边统一使用宿主最深的 line4；
      // 用 inline-flex 居中对齐，避免图标按钮的 svg 落在基线下方、与文字错位
      outline: "inline-flex items-center gap-1 rounded-lg border border-line4 bg-base px-3 py-1.5 text-primary hover:bg-layer2",
      // 失败色描边 + 失败色文字，和 outline 同尺寸，避免删除按钮在同行按钮中忽大忽小
      danger: "inline-flex items-center gap-1 rounded-lg border border-danger bg-base px-3 py-1.5 text-danger hover:bg-layer2"
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

    // src/features/power-pack/PackEditor.tsx
    var import_react7 = __toESM(require("react"), 1);

    // src/shell/page-actions.ts
    var import_react5 = require("react");
    var PageActionsContext = (0, import_react5.createContext)(null);

    // src/features/power-pack/ResourceRuleField.tsx
    var import_react6 = __toESM(require("react"), 1);
    var MODE_ORDER = ["all", "include", "exclude"];
    var SEARCH_CLASS = "w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    function ResourceRuleField({
      title,
      rule,
      options,
      modeLabels,
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
      return /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex flex-wrap items-center gap-3" }, title ? (
        // 分组标签
        /* @__PURE__ */ import_react6.default.createElement("span", { className: "text-[12px] font-semibold text-primary" }, title)
      ) : null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ml-auto flex items-center gap-2" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "inline-flex", role: "group" }, MODE_ORDER.map((mode, index) => {
        const active = rule.mode === mode;
        return /* @__PURE__ */ import_react6.default.createElement(
          "button",
          {
            key: mode,
            type: "button",
            "aria-pressed": active,
            onClick: () => onChange({ mode, items: rule.items }),
            className: cn(
              "border border-line4 px-2.5 py-1 text-[12px] leading-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              // 首尾各自圆角，中间按钮用负边距与前一格共享一条描边
              index === 0 ? "rounded-l-lg" : "-ml-px",
              index === MODE_ORDER.length - 1 ? "rounded-r-lg" : "",
              active ? (
                // 选中项抬高层级，让实底盖住相邻按钮的描边
                "relative z-10 border-primary bg-primary font-medium text-[color:var(--dsw-alias-bg-base)]"
              ) : "bg-base text-secondary hover:bg-layer2 hover:text-primary"
            )
          },
          modeLabels[mode]
        );
      })), selected.size > 0 ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "text-[11px] text-secondary" }, selected.size) : null)), rule.mode === "all" ? null : /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex flex-col gap-2" }, searchPlaceholder ? /* @__PURE__ */ import_react6.default.createElement(
        "input",
        {
          type: "search",
          value: query,
          placeholder: searchPlaceholder,
          onChange: (event) => setQuery(event.target.value),
          className: SEARCH_CLASS
        }
      ) : null, visibleOptions.length === 0 ? (
        // 没有可选项或搜索无结果时的提示
        /* @__PURE__ */ import_react6.default.createElement("p", { className: "py-2 text-[12px] text-secondary" }, emptyText)
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
            /* @__PURE__ */ import_react6.default.createElement("span", { className: "rounded border border-line4 px-1 py-px text-[10px] text-secondary" }, option.badge)
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

    // src/features/power-pack/PackEditor.tsx
    var INPUT_CLASS = "w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    var GROUP_CLASS = "border-t border-line4 pt-4";
    function PackEditor({ initial, catalog, saving, error, onSave, t }) {
      const [draft, setDraft] = (0, import_react7.useState)(initial);
      const [localError, setLocalError] = (0, import_react7.useState)(null);
      const setPageActions = (0, import_react7.useContext)(PageActionsContext);
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
        ...plugin2.kind === "installed" ? { badge: t("installedBadge") } : {}
      }));
      const globalMcpOptions = (catalog.globalGroups ?? []).filter((group) => group.kind === "global-mcp").map((group) => ({
        id: group.id,
        label: group.label,
        description: t("globalMcpTools").replace("{count}", String(group.tools.length)),
        badge: t("globalMcpBadge")
      }));
      const modeLabels = {
        all: t("modeAll"),
        include: t("modeInclude"),
        exclude: t("modeExclude")
      };
      const validate = (0, import_react7.useCallback)(() => {
        if (draft.name.trim() === "") return t("nameRequired");
        return void 0;
      }, [draft, t]);
      const handleSave = (0, import_react7.useCallback)(() => {
        const message = validate();
        if (message) {
          setLocalError(message);
          return;
        }
        setLocalError(null);
        onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() });
      }, [draft, onSave, validate]);
      const saveAction = (0, import_react7.useMemo)(
        () => /* @__PURE__ */ import_react7.default.createElement(Button, { variant: "outline", disabled: saving, onClick: handleSave }, saving ? t("saving") : t("save")),
        [handleSave, saving, t]
      );
      (0, import_react7.useEffect)(() => {
        if (!setPageActions) return;
        setPageActions(saveAction);
        return () => setPageActions(null);
      }, [saveAction, setPageActions]);
      return /* @__PURE__ */ import_react7.default.createElement("div", { className: "rounded-xl border border-line4 bg-layer1" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex flex-col gap-4 p-4" }, /* @__PURE__ */ import_react7.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("nameLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "input",
        {
          value: draft.name,
          placeholder: t("namePlaceholder"),
          onChange: (event) => patch({ name: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react7.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("descriptionLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "input",
        {
          value: draft.description,
          placeholder: t("descriptionPlaceholder"),
          onChange: (event) => patch({ description: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react7.default.createElement("div", { className: GROUP_CLASS }, /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          title: t("skillsTitle"),
          rule: draft.skills,
          options: skillOptions,
          modeLabels,
          emptyText: t("noSkills"),
          searchPlaceholder: t("searchSkills"),
          onChange: (rule) => patchRule("skills", rule)
        }
      )), /* @__PURE__ */ import_react7.default.createElement("div", { className: GROUP_CLASS }, /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          title: t("pluginsTitle"),
          rule: draft.plugins,
          options: pluginOptions,
          modeLabels,
          emptyText: t("noSkills"),
          onChange: (rule) => patchRule("plugins", rule)
        }
      ), /* @__PURE__ */ import_react7.default.createElement("p", { className: "text-[12px] leading-[18px] text-secondary" }, t("pluginsGlobalHint"))), /* @__PURE__ */ import_react7.default.createElement("div", { className: `flex flex-col gap-3 ${GROUP_CLASS}` }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "text-[12px] font-semibold text-primary" }, t("mcpTitle")), /* @__PURE__ */ import_react7.default.createElement(
        ResourceRuleField,
        {
          rule: draft.mcp,
          options: globalMcpOptions,
          modeLabels,
          emptyText: t("mcpEmpty"),
          onChange: (rule) => patchRule("mcp", rule)
        }
      ), /* @__PURE__ */ import_react7.default.createElement("p", { className: "text-[12px] leading-[18px] text-secondary" }, t("mcpGlobalHint"))), /* @__PURE__ */ import_react7.default.createElement("label", { className: `block ${GROUP_CLASS}` }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("systemPromptLabel")), /* @__PURE__ */ import_react7.default.createElement(
        "textarea",
        {
          value: draft.systemPrompt,
          placeholder: t("systemPromptPlaceholder"),
          onChange: (event) => patch({ systemPrompt: event.target.value }),
          rows: 15,
          className: INPUT_CLASS
        }
      )), localError ?? error ? /* @__PURE__ */ import_react7.default.createElement("p", { className: "text-[12px] leading-[18px] text-danger", role: "alert" }, localError ?? error) : null));
    }

    // src/features/power-pack/page.tsx
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
        mcp: { mode: "all", items: [] }
      };
    }
    function PowerPackPage({ t }) {
      const [payload, setPayload] = (0, import_react8.useState)(null);
      const [editing, setEditing] = (0, import_react8.useState)(null);
      const [loading, setLoading] = (0, import_react8.useState)(true);
      const [saving, setSaving] = (0, import_react8.useState)(false);
      const [defaulting, setDefaulting] = (0, import_react8.useState)(false);
      const [error, setError] = (0, import_react8.useState)(null);
      const reload = async () => {
        try {
          setPayload(await loadPowerPacks());
          setError(null);
        } catch (failure) {
          console.error("[power-pack] \u52A0\u8F7D\u6280\u80FD\u5305\u5931\u8D25:", failure);
          setError(`${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setLoading(false);
        }
      };
      (0, import_react8.useEffect)(() => {
        let active = true;
        void (async () => {
          try {
            const next = await loadPowerPacks();
            if (!active) return;
            setPayload(next);
          } catch (failure) {
            console.error("[power-pack] \u52A0\u8F7D\u6280\u80FD\u5305\u5931\u8D25:", failure);
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
      const handleSave = (0, import_react8.useCallback)(async (pack) => {
        setSaving(true);
        try {
          setPayload(await savePowerPack(pack));
          setEditing(null);
          setError(null);
        } catch (failure) {
          console.error("[power-pack] \u4FDD\u5B58\u6280\u80FD\u5305\u5931\u8D25:", failure);
          setError(`${t("saveFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setSaving(false);
        }
      }, [t]);
      const submitDraft = (0, import_react8.useCallback)((pack) => {
        void handleSave(pack);
      }, [handleSave]);
      const handleDelete = async (id) => {
        if (!window.confirm(t("confirmDelete"))) return;
        try {
          setPayload(await deletePowerPack(id));
          setError(null);
        } catch (failure) {
          console.error("[power-pack] \u5220\u9664\u6280\u80FD\u5305\u5931\u8D25:", failure);
          setError(
            `${t("deleteFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`
          );
        }
      };
      const handleSetDefault = async (id) => {
        setDefaulting(true);
        try {
          setPayload(await setDefaultPowerPack(id));
          setError(null);
        } catch (failure) {
          console.error("[power-pack] \u8BBE\u7F6E\u9ED8\u8BA4\u6280\u80FD\u5305\u5931\u8D25:", failure);
          setError(
            `${t("setDefaultFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`
          );
        } finally {
          setDefaulting(false);
        }
      };
      if (editing && payload) {
        return /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react8.default.createElement("header", null, /* @__PURE__ */ import_react8.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("pageTitle")), /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("pageDescription"))), /* @__PURE__ */ import_react8.default.createElement(
          PackEditor,
          {
            initial: editing,
            catalog: payload.catalog,
            saving,
            error,
            onSave: submitDraft,
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
            setError(null);
            setEditing(createDraft());
          }
        },
        t("newPack")
      )), error ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "rounded-lg border border-line4 bg-layer1 px-3 py-2 text-[12px] text-danger", role: "alert" }, error, /* @__PURE__ */ import_react8.default.createElement(
        "button",
        {
          type: "button",
          className: "ml-2 cursor-pointer border-0 bg-transparent p-0 text-[12px] underline",
          onClick: () => void reload()
        },
        t("retry")
      )) : null, loading ? (
        // 首次加载中的占位
        /* @__PURE__ */ import_react8.default.createElement("p", { className: "text-[12px] text-secondary" }, "\u2026")
      ) : (payload?.packs.length ?? 0) === 0 ? (
        // 尚未创建技能包时的空态
        /* @__PURE__ */ import_react8.default.createElement("p", { className: "rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary" }, t("empty"))
      ) : /* @__PURE__ */ import_react8.default.createElement("ul", { className: "flex flex-col gap-3" }, payload?.packs.map((pack) => /* @__PURE__ */ import_react8.default.createElement(
        "li",
        {
          key: pack.id,
          className: "rounded-xl border border-line4 bg-layer1 px-4 py-3"
        },
        /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex flex-wrap items-start justify-between gap-2" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react8.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, pack.name), pack.description ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, pack.description) : null, /* @__PURE__ */ import_react8.default.createElement("p", { className: "mt-1 text-[12px] text-secondary" }, t("skillsTitle"), ": ", modeLabel(pack.skills.mode, t), " \xB7 ", t("pluginsTitle"), ":", " ", modeLabel(pack.plugins.mode, t), " \xB7 ", t("mcpTitle"), ":", " ", modeLabel(pack.mcp.mode, t))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "flex shrink-0 items-center gap-2" }, payload?.defaultPackId === pack.id ? (
          // 默认技能包标识：绿色描边与打钩，和可点击的「设为默认」按钮区分开
          /* @__PURE__ */ import_react8.default.createElement("span", { className: "inline-flex items-center gap-1 rounded-lg border border-success px-3 py-1.5 text-[12px] text-success" }, /* @__PURE__ */ import_react8.default.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width: "12",
              height: "12",
              "aria-hidden": "true",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.4",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
            /* @__PURE__ */ import_react8.default.createElement("path", { d: "M20 6 9 17l-5-5" })
          ), t("defaultBadge"))
        ) : (
          // 设为默认按钮：新建会话时自动预选该技能包
          /* @__PURE__ */ import_react8.default.createElement(
            Button,
            {
              variant: "outline",
              disabled: defaulting,
              onClick: () => void handleSetDefault(pack.id)
            },
            t("setDefault")
          )
        ), /* @__PURE__ */ import_react8.default.createElement(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setError(null);
              setEditing(pack);
            }
          },
          t("edit")
        ), /* @__PURE__ */ import_react8.default.createElement(Button, { variant: "danger", onClick: () => void handleDelete(pack.id) }, t("delete"))))
      ))), payload ? /* @__PURE__ */ import_react8.default.createElement("p", { className: "text-[12px] text-secondary" }, t("storageHint"), ": ", /* @__PURE__ */ import_react8.default.createElement("code", { className: "break-all" }, payload.storagePath)) : null);
    }

    // src/features/power-pack/index.tsx
    var powerPackFeature = {
      id: "power-pack",
      order: 20,
      entry: PowerPackEntry,
      page: PowerPackPage,
      client: client_exports,
      locales: powerPackLocales
    };
    var power_pack_default = powerPackFeature;

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
    var import_react9 = __toESM(require("react"), 1);

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
      return /* @__PURE__ */ import_react9.default.createElement(
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
        /* @__PURE__ */ import_react9.default.createElement("path", { d: "m7 9 5-5 5 5" }),
        /* @__PURE__ */ import_react9.default.createElement("path", { d: "m7 15 5 5 5-5" })
      );
    }
    function ExpandProcessToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react9.useState)(readExpandProcessEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react9.useState)(false);
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
      return /* @__PURE__ */ import_react9.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react9.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react9.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react9.default.createElement(ExpandIcon, null)),
        /* @__PURE__ */ import_react9.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react9.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react9.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center aio-switch transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react9.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react9.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/expand-process/index.tsx
    var expandProcessFeature = {
      id: "expand-process",
      order: 10,
      switch: ExpandProcessToggle,
      locales: expandProcessLocales
    };
    var expand_process_default = expandProcessFeature;

    // src/features/image-preview/lightbox.ts
    var LIGHTBOX_ATTRIBUTE = "data-dsh-image-preview-lightbox";
    var LIGHTBOX_CLASS = "fixed inset-0 z-[100] flex items-center justify-center p-6";
    var BACKDROP_CLASS = "absolute inset-0 bg-overlay opacity-80";
    var LIGHTBOX_IMAGE_CLASS = "relative max-h-full max-w-full rounded-lg border border-solid border-line4 bg-base object-contain";
    var activeLayer;
    function closeImagePreview() {
      if (activeLayer === void 0) return;
      document.removeEventListener("keydown", handleKeydown);
      activeLayer.remove();
      activeLayer = void 0;
    }
    function handleKeydown(event) {
      if (event.key !== "Escape") return;
      closeImagePreview();
    }
    function openImagePreview(source, alt) {
      closeImagePreview();
      const layer = document.createElement("div");
      layer.setAttribute(LIGHTBOX_ATTRIBUTE, "");
      layer.className = LIGHTBOX_CLASS;
      layer.addEventListener("click", closeImagePreview);
      const backdrop = document.createElement("div");
      backdrop.className = BACKDROP_CLASS;
      layer.appendChild(backdrop);
      const image = document.createElement("img");
      image.src = source;
      image.alt = alt;
      image.className = LIGHTBOX_IMAGE_CLASS;
      image.addEventListener("click", (event) => event.stopPropagation());
      layer.appendChild(image);
      document.addEventListener("keydown", handleKeydown);
      document.body.appendChild(layer);
      activeLayer = layer;
    }

    // src/features/image-preview/preview.ts
    var PREVIEW_ATTRIBUTE = "data-dsh-image-preview";
    var WRAPPER_CLASS = "mt-2 flex flex-col items-start gap-2";
    var IMAGE_CLASS = "block max-h-[320px] max-w-full cursor-zoom-in rounded-lg border border-solid border-line4 bg-base object-contain";
    var IMAGE_ROUTE = "/dsh-all-in-one/image";
    var BLOCK_TAGS = /* @__PURE__ */ new Set([
      "ADDRESS",
      "ARTICLE",
      "ASIDE",
      "BLOCKQUOTE",
      "DD",
      "DETAILS",
      "DIV",
      "DL",
      "DT",
      "FIELDSET",
      "FIGCAPTION",
      "FIGURE",
      "FOOTER",
      "FORM",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "HEADER",
      "LI",
      "MAIN",
      "NAV",
      "OL",
      "P",
      "PRE",
      "SECTION",
      "SUMMARY",
      "UL"
    ]);
    var TABLE_TAGS = /* @__PURE__ */ new Set(["TABLE", "TBODY", "THEAD", "TFOOT", "TR", "TD", "TH"]);
    var IMAGE_EXTENSION_PATTERN = /\.(?:png|jpe?g|gif|webp|bmp|avif|svg|ico)$/i;
    var ATTACHMENT_ID_PATTERN = /^sha256:[0-9a-f]{64}$/;
    var ATTACHMENT_OBJECT_PATTERN = /(?:^|[\\/])attachments[\\/]v1[\\/]objects[\\/][0-9a-f]{2}[\\/][0-9a-f]{64}$/;
    var PATH_SPLIT_PATTERN = /[\s"'`<>|，。；：、！？（）【】《》,;]+/;
    var TRAILING_PUNCTUATION_PATTERN = /[.,;:!?)\]}>]+$/;
    var renderedBlockKeys = /* @__PURE__ */ new WeakMap();
    var failedPaths = /* @__PURE__ */ new Set();
    var MAX_FAILED_PATHS = 200;
    function collectImagePaths(text) {
      const paths = [];
      for (const raw of text.split(PATH_SPLIT_PATTERN)) {
        const candidate = normalizeCandidate(raw);
        if (candidate === void 0) continue;
        if (!paths.includes(candidate)) paths.push(candidate);
      }
      return paths;
    }
    function normalizeCandidate(raw) {
      if (raw === "") return void 0;
      const withoutScheme = raw.startsWith("file://") ? raw.slice("file://".length) : raw;
      const withoutPunctuation = withoutScheme.replace(TRAILING_PUNCTUATION_PATTERN, "");
      let decoded = withoutPunctuation;
      try {
        decoded = decodeURI(withoutPunctuation);
      } catch (error) {
        console.warn("[image-preview] \u8DEF\u5F84\u4E0D\u662F\u5408\u6CD5 URI \u7F16\u7801\uFF0C\u6309\u539F\u6837\u4F7F\u7528:", withoutPunctuation, error);
      }
      const isAbsolute = decoded.startsWith("/") || decoded.startsWith("~/") || /^[A-Za-z]:[\\/]/.test(decoded);
      if (!isAbsolute) return ATTACHMENT_ID_PATTERN.test(decoded) ? decoded : void 0;
      if (IMAGE_EXTENSION_PATTERN.test(decoded)) return decoded;
      return ATTACHMENT_OBJECT_PATTERN.test(decoded) ? decoded : void 0;
    }
    function closestBlock(element) {
      let current = element;
      while (current !== null) {
        if (current === document.body) return void 0;
        const tag = current.tagName;
        if (TABLE_TAGS.has(tag)) {
          current = current.parentElement;
          continue;
        }
        if (BLOCK_TAGS.has(tag)) return current;
        current = current.parentElement;
      }
      return void 0;
    }
    function syncBlockPreviews(block, paths) {
      const usablePaths = paths.filter((path) => !failedPaths.has(path));
      const key = usablePaths.join("\n");
      const existing = block.nextElementSibling;
      const wrapper = existing instanceof HTMLElement && existing.hasAttribute(PREVIEW_ATTRIBUTE) ? existing : void 0;
      if (wrapper !== void 0) {
        if (wrapper.dataset.previewKey === key) return;
        wrapper.remove();
      } else if (usablePaths.length === 0 && renderedBlockKeys.get(block) === key) {
        return;
      }
      const parent = block.parentElement;
      if (usablePaths.length === 0 || parent === null) {
        renderedBlockKeys.set(block, key);
        return;
      }
      const container = document.createElement("div");
      container.setAttribute(PREVIEW_ATTRIBUTE, "");
      container.dataset.previewKey = key;
      container.className = WRAPPER_CLASS;
      for (const path of usablePaths) container.appendChild(createPreviewImage(path, container));
      block.insertAdjacentElement("afterend", container);
    }
    function toImageUrl(source) {
      if (source.startsWith("sha256:")) {
        return `${IMAGE_ROUTE}?attachment=${encodeURIComponent(source)}`;
      }
      return `${IMAGE_ROUTE}?path=${encodeURIComponent(source)}`;
    }
    function createPreviewImage(path, container) {
      const image = document.createElement("img");
      image.src = toImageUrl(path);
      image.alt = path;
      image.loading = "lazy";
      image.decoding = "async";
      image.className = IMAGE_CLASS;
      image.addEventListener("click", () => openImagePreview(image.src, path));
      image.addEventListener("error", () => {
        rememberFailedPath(path);
        image.remove();
        if (container.childElementCount === 0) container.style.display = "none";
      });
      return image;
    }
    function rememberFailedPath(path) {
      if (failedPaths.has(path)) return;
      if (failedPaths.size >= MAX_FAILED_PATHS) failedPaths.clear();
      failedPaths.add(path);
      console.warn("[image-preview] \u56FE\u7247\u8BFB\u53D6\u5931\u8D25\uFF0C\u5DF2\u505C\u6B62\u9884\u89C8:", path);
    }
    function isOwnPreviewNode(node) {
      const element = node instanceof HTMLElement ? node : node.parentElement;
      return element?.closest(`[${PREVIEW_ATTRIBUTE}]`) != null;
    }
    function disposePreviews() {
      closeImagePreview();
      for (const element of document.querySelectorAll(`[${PREVIEW_ATTRIBUTE}]`)) element.remove();
    }

    // src/features/image-preview/observer.ts
    var CONTAINER_SELECTORS = [
      '[data-conversation-region="chat"]',
      "[data-conversation-scroll]",
      '[data-slot="main.conversation"]'
    ];
    var MAX_NODES_PER_FRAME = 40;
    var RELOCATE_INTERVAL_MS = 1500;
    function findContainer() {
      for (const selector of CONTAINER_SELECTORS) {
        const element = document.querySelector(selector);
        if (element !== null) return element;
      }
      return void 0;
    }
    function scanSubtree(root) {
      const grouped = /* @__PURE__ */ new Map();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        if (isOwnPreviewNode(node)) continue;
        const text = node;
        const paths = collectImagePaths(text.data);
        if (paths.length === 0) continue;
        const block = closestBlock(text.parentElement);
        if (block === void 0) continue;
        const known = grouped.get(block);
        if (known === void 0) {
          grouped.set(block, paths);
          continue;
        }
        for (const path of paths) {
          if (!known.includes(path)) known.push(path);
        }
      }
      for (const [block, paths] of grouped) syncBlockPreviews(block, paths);
    }
    function installImagePreviewObserver() {
      let container = findContainer();
      const pending2 = /* @__PURE__ */ new Set();
      let frame = 0;
      let disposed = false;
      function flush() {
        if (container === void 0 || !container.isConnected) return;
        const nodes = Array.from(pending2).slice(0, MAX_NODES_PER_FRAME);
        for (const node of nodes) pending2.delete(node);
        for (const node of nodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentElement;
            if (parent === null || !container.contains(parent) || isOwnPreviewNode(node)) continue;
            const block = closestBlock(parent);
            if (block !== void 0) scanSubtree(block);
            continue;
          }
          if (!(node instanceof Element) || isOwnPreviewNode(node)) continue;
          if (container.contains(node)) {
            scanSubtree(node);
            continue;
          }
          if (node.contains(container)) scanSubtree(container);
        }
      }
      function schedule() {
        if (disposed || frame !== 0) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          flush();
          if (pending2.size > 0) schedule();
        });
      }
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type === "characterData") {
            pending2.add(record.target);
            continue;
          }
          for (const node of record.addedNodes) pending2.add(node);
        }
        schedule();
      });
      function enqueueTree(element) {
        if (element.children.length === 0) {
          pending2.add(element);
          return;
        }
        for (const child of element.children) pending2.add(child);
      }
      function attach() {
        if (container === void 0) return;
        observer.observe(container, { childList: true, characterData: true, subtree: true });
        enqueueTree(container);
        schedule();
      }
      if (container !== void 0) attach();
      const relocateTimer = window.setInterval(() => {
        if (container !== void 0 && container.isConnected) return;
        observer.disconnect();
        container = findContainer();
        if (container === void 0) return;
        attach();
      }, RELOCATE_INTERVAL_MS);
      return () => {
        disposed = true;
        observer.disconnect();
        window.clearInterval(relocateTimer);
        if (frame !== 0) window.cancelAnimationFrame(frame);
        disposePreviews();
      };
    }

    // src/features/image-preview/storage.ts
    var IMAGE_PREVIEW_STORAGE_KEY = "dsh-all-in-one:image-preview";
    function readImagePreviewEnabled() {
      try {
        return window.localStorage.getItem(IMAGE_PREVIEW_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[image-preview] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }
    function writeImagePreviewEnabled(enabled) {
      try {
        window.localStorage.setItem(IMAGE_PREVIEW_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[image-preview] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/image-preview/client.tsx
    function apply2(ctx) {
      if (!readImagePreviewEnabled()) return;
      ctx.effect(() => installImagePreviewObserver(), "image-preview: observer");
    }

    // src/features/image-preview/locales.ts
    var imagePreviewLocales = {
      zh: {
        // 开关标题
        title: "\u4F1A\u8BDD\u56FE\u7247\u9884\u89C8",
        // 开关用途说明：解释打开后会话里的哪些内容会出现预览，并点明只读
        description: "\u4F1A\u8BDD\u91CC\u51FA\u73B0\u672C\u5730\u56FE\u7247\u5730\u5740\u65F6\uFF0C\u5728\u5730\u5740\u4E0B\u65B9\u76F4\u63A5\u663E\u793A\u9884\u89C8\uFF1B\u53EA\u8BFB\u53D6\u6587\u4EF6\uFF0C\u4E0D\u6539\u52A8\u4F1A\u8BDD\u4E0E\u6587\u4EF6\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002"
      },
      en: {
        // Switch title
        title: "Inline image preview",
        // Switch description explaining what gets previewed and that files stay untouched
        description: "Show a preview under local image paths in conversations. Files are only read, never changed.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions."
      }
    };

    // src/features/image-preview/toggle.tsx
    var import_react10 = __toESM(require("react"), 1);
    function ImageIcon() {
      return /* @__PURE__ */ import_react10.default.createElement(
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
        /* @__PURE__ */ import_react10.default.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
        /* @__PURE__ */ import_react10.default.createElement("circle", { cx: "8.5", cy: "9.5", r: "1.5" }),
        /* @__PURE__ */ import_react10.default.createElement("path", { d: "m4 17 5-5 4 4 3-3 4 4" })
      );
    }
    function ImagePreviewToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react10.useState)(readImagePreviewEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react10.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeImagePreviewEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react10.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react10.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react10.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react10.default.createElement(ImageIcon, null)),
        /* @__PURE__ */ import_react10.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react10.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react10.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center aio-switch transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react10.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react10.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/image-preview/index.tsx
    var imagePreviewFeature = {
      id: "image-preview",
      order: 15,
      switch: ImagePreviewToggle,
      client: { apply: apply2 },
      locales: imagePreviewLocales
    };
    var image_preview_default = imagePreviewFeature;

    // src/features/session-history/storage.ts
    var SESSION_HISTORY_STORAGE_KEY = "dsh-all-in-one:session-history";
    function readSessionHistoryEnabled() {
      try {
        return window.localStorage.getItem(SESSION_HISTORY_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[session-history] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", SESSION_HISTORY_STORAGE_KEY, error);
        return false;
      }
    }
    function writeSessionHistoryEnabled(enabled) {
      try {
        window.localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[session-history] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", SESSION_HISTORY_STORAGE_KEY, error);
        return false;
      }
    }

    // src/features/session-history/turn-nav.ts
    var NAV_SELECTOR = 'nav[aria-label="\u8F6E\u6B21\u5BFC\u822A"]';
    var NAV_ATTRIBUTE = "data-aio-turn-nav";
    var STYLE_ID = "dsh-all-in-one-session-history";
    var TICK_INTERVAL_MS = 1200;
    var WIDTH_HANDLE_SELECTOR = '[data-width-handle="left"]';
    var NAV_EDGE_GAP = 4;
    var STYLE_TEXT = `
    [${NAV_ATTRIBUTE}] {
      right: auto !important;
      display: block !important;
      overflow: visible !important;
    }
    [${NAV_ATTRIBUTE}] [class*="_preview"] {
      right: auto !important;
      left: calc(100% + 10px) !important;
    }
    `;
    function installTurnNav() {
      if (document.getElementById(STYLE_ID) === null) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = STYLE_TEXT;
        document.head.appendChild(style);
      }
      let disposed = false;
      function positionNav(nav) {
        const slot = nav.parentElement;
        const handle = document.querySelector(WIDTH_HANDLE_SELECTOR);
        if (slot === null || !(handle instanceof HTMLElement)) return;
        const left = Math.round(
          handle.getBoundingClientRect().left - slot.getBoundingClientRect().left - nav.offsetWidth - NAV_EDGE_GAP
        );
        nav.style.setProperty("left", `${Math.max(0, left)}px`, "important");
      }
      function tick() {
        if (disposed) return;
        const nav = document.querySelector(NAV_SELECTOR);
        if (!(nav instanceof HTMLElement)) return;
        if (!nav.hasAttribute(NAV_ATTRIBUTE)) nav.setAttribute(NAV_ATTRIBUTE, "");
        positionNav(nav);
      }
      tick();
      const timer = window.setInterval(tick, TICK_INTERVAL_MS);
      return () => {
        disposed = true;
        window.clearInterval(timer);
        for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
          element.removeAttribute(NAV_ATTRIBUTE);
          if (element instanceof HTMLElement) element.style.removeProperty("left");
        }
        document.getElementById(STYLE_ID)?.remove();
      };
    }

    // src/features/session-history/client.tsx
    function apply3(ctx) {
      if (!readSessionHistoryEnabled()) return;
      ctx.effect(() => installTurnNav(), "session-history: turn-nav");
    }

    // src/features/session-history/locales.ts
    var sessionHistoryLocales = {
      zh: {
        title: "\u4F1A\u8BDD\u5386\u53F2\u5DE6\u4FA7",
        description: "\u628A\u5BF9\u8BDD\u53F3\u4FA7\u7684\u8F6E\u6B21\u5BFC\u822A\u6761\u79FB\u5230\u5DE6\u4FA7\uFF0C\u70B9\u51FB\u8DF3\u8F6C\u4FDD\u6301\u4E0D\u53D8\u3002",
        saveFailed: "\u5F00\u5173\u72B6\u6001\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u3002"
      },
      en: {
        title: "Turn history on the left",
        description: "Move the turn navigator from the right side of the conversation to the left; jump-on-click is unchanged.",
        saveFailed: "Failed to save the switch state. Check browser storage."
      }
    };

    // src/features/session-history/toggle.tsx
    var import_react11 = __toESM(require("react"), 1);
    function LayoutLeftIcon() {
      return /* @__PURE__ */ import_react11.default.createElement(
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
        /* @__PURE__ */ import_react11.default.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
        /* @__PURE__ */ import_react11.default.createElement("path", { d: "M9 4v16" })
      );
    }
    function SessionHistoryToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react11.useState)(readSessionHistoryEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react11.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeSessionHistoryEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react11.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react11.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react11.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react11.default.createElement(LayoutLeftIcon, null)),
        /* @__PURE__ */ import_react11.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react11.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react11.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center aio-switch transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react11.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react11.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/session-history/index.tsx
    var sessionHistoryFeature = {
      id: "session-history",
      order: 16,
      switch: SessionHistoryToggle,
      client: { apply: apply3 },
      locales: sessionHistoryLocales
    };
    var session_history_default = sessionHistoryFeature;

    // src/features/delete-session/client.tsx
    var import_react14 = __toESM(require("react"), 1);

    // src/features/delete-session/api.ts
    var ENDPOINT2 = "/dsh-all-in-one/sessions";
    var REQUEST_TIMEOUT_MS2 = 15e3;
    async function requestDeleteSession(sessionId) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS2);
      const body = { sessionId };
      try {
        const response = await fetch(new URL(ENDPOINT2, window.location.origin).toString(), {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        if (!response.ok) {
          const text = await response.text();
          let message = `HTTP ${response.status}`;
          try {
            const parsed = JSON.parse(text);
            if (typeof parsed.error === "string") message = parsed.error;
            else console.error("[delete-session] \u5BBF\u4E3B\u8FD4\u56DE\u4E86\u975E\u9884\u671F\u9519\u8BEF\u4F53:", text);
          } catch (error) {
            console.error("[delete-session] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error, text);
          }
          throw new Error(message);
        }
        const payload = await response.json();
        if (payload.deleted !== true) throw new Error("\u5BBF\u4E3B\u672A\u786E\u8BA4\u5220\u9664");
      } catch (error) {
        console.error("[delete-session] \u8BF7\u6C42\u5220\u9664\u4F1A\u8BDD\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }

    // src/features/delete-session/confirm-store.ts
    var listeners = /* @__PURE__ */ new Set();
    var pending = null;
    function notify() {
      for (const listener of [...listeners]) {
        try {
          listener();
        } catch (error) {
          console.error("[delete-session] \u786E\u8BA4\u5F39\u7A97\u8BA2\u9605\u8005\u5904\u7406\u5931\u8D25:", error);
        }
      }
    }
    var deleteConfirmStore = {
      getSnapshot: () => pending,
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      request(next) {
        pending = next;
        notify();
      },
      settle() {
        if (pending === null) return;
        pending = null;
        notify();
      }
    };

    // src/features/delete-session/DeleteSessionButton.tsx
    var import_react12 = __toESM(require("react"), 1);

    // src/features/delete-session/delete-session.ts
    var DELETE_SESSION_STORAGE_KEY = "dsh-all-in-one:delete-session";
    function readDeleteSessionEnabled() {
      try {
        return window.localStorage.getItem(DELETE_SESSION_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[delete-session] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }
    function writeDeleteSessionEnabled(enabled) {
      try {
        window.localStorage.setItem(DELETE_SESSION_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[delete-session] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/delete-session/DeleteSessionButton.tsx
    function TrashGlyph() {
      return /* @__PURE__ */ import_react12.default.createElement(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: "14",
          height: "14",
          "aria-hidden": "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M2.5 4.5h11" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M6.5 2.75h3" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M4 4.5 4.6 13h6.8L12 4.5" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M6.6 6.8v3.6" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M9.4 6.8v3.6" })
      );
    }
    function DeleteSessionButton({
      t,
      sessionId,
      displayTitle,
      resolveSession: resolveSession2,
      requestConfirm
    }) {
      if (!readDeleteSessionEnabled()) return null;
      if (sessionId === void 0 || requestConfirm === void 0) return null;
      const state = resolveSession2?.(sessionId);
      if (state !== void 0 && state.running) return null;
      const handleClick = (event) => {
        event.stopPropagation();
        requestConfirm({ sessionId, title: displayTitle ?? sessionId });
      };
      return /* @__PURE__ */ import_react12.default.createElement(
        "button",
        {
          type: "button",
          "aria-label": t("action"),
          title: t("action"),
          onClick: handleClick,
          className: "inline-flex h-4 w-4 flex-none cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-secondary transition hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react12.default.createElement(TrashGlyph, null)
      );
    }

    // src/features/delete-session/DeleteSessionDialog.tsx
    var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react13 = __toESM(require("react"), 1);
    var useNoRequest = (() => null);
    function DeleteSessionDialog({
      t,
      useRequest,
      deleteSession,
      settle
    }) {
      const [pending2, setPending] = (0, import_react13.useState)(false);
      const [error, setError] = (0, import_react13.useState)(null);
      const readRequest = useRequest ?? useNoRequest;
      const request4 = readRequest((value) => value);
      const activeSessionId = request4?.sessionId;
      (0, import_react13.useEffect)(() => {
        setError(null);
      }, [activeSessionId]);
      if (request4 === null) return null;
      const close = () => {
        if (pending2) return;
        setError(null);
        settle?.();
      };
      const confirm = async () => {
        if (pending2) return;
        setPending(true);
        setError(null);
        try {
          await deleteSession?.(request4.sessionId);
        } catch (failure) {
          console.error("[delete-session] \u5220\u9664\u4F1A\u8BDD\u5931\u8D25:", failure);
          setPending(false);
          setError(failure instanceof Error ? failure.message : String(failure));
          return;
        }
        setPending(false);
        settle?.();
      };
      return /* @__PURE__ */ import_react13.default.createElement(
        import_dsh_client_ui_primitives2.Modal,
        {
          open: true,
          onClose: close,
          closeLabel: t("confirmCancel"),
          title: t("confirmTitle"),
          description: t("confirmTarget"),
          footer: /* @__PURE__ */ import_react13.default.createElement(import_react13.default.Fragment, null, /* @__PURE__ */ import_react13.default.createElement(Button, { variant: "outline", disabled: pending2, onClick: close }, t("confirmCancel")), /* @__PURE__ */ import_react13.default.createElement(
            Button,
            {
              variant: "danger",
              "data-modal-autofocus": "",
              disabled: pending2,
              onClick: () => void confirm()
            },
            pending2 ? t("deleting") : t("confirmDelete")
          ))
        },
        /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-1 text-[13px] font-medium leading-5 text-primary" }, request4.title),
        /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-3 text-[12px] leading-[18px] text-secondary" }, t("confirmMessage")),
        error !== null ? /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-danger", role: "alert" }, `${t("deleteFailed")}\uFF1A${error}`) : null
      );
    }

    // src/features/delete-session/client.tsx
    var ROW_ACTION_SLOT = "sidebar.workspaces.session.row.action";
    var OVERLAY_SLOT = "shell.overlay";
    function resolveSession(sessions, sessionId) {
      const summary = sessions.list.getSnapshot().byId[sessionId];
      return {
        running: summary?.running === true,
        isCurrent: (summary?.retainedBy?.mainView ?? 0) > 0
      };
    }
    function findWorkspaceId(uiWorkspace, sessionId) {
      const items = uiWorkspace?.workspaces?.list.getSnapshot().items ?? [];
      return items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId;
    }
    function pickNextSession(sessions, uiWorkspace, workspaceId, removedId) {
      const state = sessions.list.getSnapshot();
      const workspaceState = uiWorkspace?.workspaces?.list.getSnapshot();
      const workspace = workspaceState?.items.find((item) => item.workspaceId === workspaceId);
      const memberIds = workspace?.sessionIds ?? state.ids;
      const archived = new Set(workspaceState?.archivedSessionIds ?? []);
      const candidates = memberIds.flatMap((id) => {
        const summary = state.byId[id];
        return id === removedId || summary === void 0 || archived.has(id) ? [] : [{ id, summary }];
      });
      const running = candidates.filter((candidate) => candidate.summary.running === true);
      const pool = running.length > 0 ? running : candidates;
      let newest;
      for (const candidate of pool) {
        if (newest === void 0 || (candidate.summary.updatedAt ?? 0) > (newest.summary.updatedAt ?? 0)) {
          newest = candidate;
        }
      }
      return newest?.id;
    }
    function apply4(ctx, t) {
      ctx.inject(["sessions"], (scoped) => {
        const sessions = scoped.sessions;
        if (sessions === void 0) return;
        let uiWorkspace;
        scoped.inject(["uiWorkspace"], (withWorkspace) => {
          uiWorkspace = withWorkspace.uiWorkspace;
          return () => {
            uiWorkspace = void 0;
          };
        });
        const deleteSession = async (sessionId) => {
          const wasCurrent = resolveSession(sessions, sessionId).isCurrent;
          const workspaceId = findWorkspaceId(uiWorkspace, sessionId);
          await requestDeleteSession(sessionId);
          sessions.handleSessionRemoved?.(sessionId);
          if (!wasCurrent) return;
          const next = pickNextSession(sessions, uiWorkspace, workspaceId, sessionId);
          if (next !== void 0) {
            uiWorkspace?.openSession?.(next);
            return;
          }
          uiWorkspace?.startSession?.(workspaceId);
        };
        ctx.slots.inject(
          ROW_ACTION_SLOT,
          () => ctx.slots.register(
            {
              name: ROW_ACTION_SLOT,
              id: "delete-session",
              // 排在宿主的归档与置顶之后，不打乱宿主按钮原有顺序
              order: 300,
              inject: () => ({
                resolveSession: (sessionId) => resolveSession(sessions, sessionId),
                requestConfirm: deleteConfirmStore.request
              })
            },
            (props) => /* @__PURE__ */ import_react14.default.createElement(
              DeleteSessionButton,
              {
                ...props,
                t
              }
            )
          )
        );
        ctx.slots.inject(
          OVERLAY_SLOT,
          () => ctx.slots.register(
            {
              name: OVERLAY_SLOT,
              id: "delete-session-confirm",
              inject: () => ({
                hooks: { request: deleteConfirmStore },
                deleteSession,
                settle: deleteConfirmStore.settle
              })
            },
            (props) => /* @__PURE__ */ import_react14.default.createElement(
              DeleteSessionDialog,
              {
                ...props,
                t
              }
            )
          )
        );
      });
    }

    // src/features/delete-session/locales.ts
    var deleteSessionLocales = {
      zh: {
        // 开关标题
        title: "\u5220\u9664\u4F1A\u8BDD",
        // 开关用途说明：说明打开后会话行会出现删除入口，且删除前需要先在弹窗里确认
        description: "\u5728\u4F1A\u8BDD\u884C\u60AC\u505C\u64CD\u4F5C\u91CC\u589E\u52A0\u5220\u9664\u6309\u94AE\uFF0C\u786E\u8BA4\u540E\u5220\u9664\u8BE5\u4F1A\u8BDD\u7684\u672C\u5730\u8BB0\u5F55\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 会话行删除按钮的可访问名称与悬停提示
        action: "\u5220\u9664\u4F1A\u8BDD",
        // 确认弹窗标题
        confirmTitle: "\u5220\u9664\u4F1A\u8BDD",
        // 确认弹窗的说明文字，指出弹窗里给出的是哪一条会话
        confirmTarget: "\u5373\u5C06\u5220\u9664\u4EE5\u4E0B\u4F1A\u8BDD\uFF1A",
        // 确认弹窗的删除范围说明
        confirmMessage: "\u5C06\u5220\u9664\u8BE5\u4F1A\u8BDD\u7684\u672C\u5730\u8BB0\u5F55\uFF1A\u5BF9\u8BDD\u6B63\u6587\u3001\u6807\u9898\u7F13\u5B58\u4E0E\u5217\u8868\u8BB0\u5F55\uFF0C\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\u3002",
        // 确认弹窗的取消按钮
        confirmCancel: "\u53D6\u6D88",
        // 确认弹窗的确认按钮
        confirmDelete: "\u5220\u9664",
        // 删除进行中的按钮与状态文字
        deleting: "\u6B63\u5728\u5220\u9664",
        // 删除失败时的提示前缀，后面拼接宿主返回的原因
        deleteFailed: "\u5220\u9664\u4F1A\u8BDD\u5931\u8D25"
      },
      en: {
        // Switch title
        title: "Delete sessions",
        // Switch description covering the row action and the confirmation step
        description: "Adds a delete button to session hover actions; a dialog confirms before removing local records.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions.",
        // Accessible name and hover hint of the row delete button
        action: "Delete session",
        // Confirmation dialog title
        confirmTitle: "Delete session",
        // Dialog line introducing the session being deleted
        confirmTarget: "About to delete:",
        // Dialog text describing what is removed
        confirmMessage: "This removes the session\u2019s local records: the conversation log, its title cache, and its list entry. It cannot be undone.",
        // Cancel button of the confirmation dialog
        confirmCancel: "Cancel",
        // Confirming delete button
        confirmDelete: "Delete",
        // Button label and status text while deleting
        deleting: "Deleting",
        // Prefix for a failed delete, followed by the host's reason
        deleteFailed: "Could not delete the session"
      }
    };

    // src/features/delete-session/toggle.tsx
    var import_react15 = __toESM(require("react"), 1);
    function TrashIcon() {
      return /* @__PURE__ */ import_react15.default.createElement(
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
        /* @__PURE__ */ import_react15.default.createElement("path", { d: "M4 7h16" }),
        /* @__PURE__ */ import_react15.default.createElement("path", { d: "M10 4h4" }),
        /* @__PURE__ */ import_react15.default.createElement("path", { d: "M9 7v11" }),
        /* @__PURE__ */ import_react15.default.createElement("path", { d: "M15 7v11" }),
        /* @__PURE__ */ import_react15.default.createElement("path", { d: "M6 7h12l-1 13H7L6 7Z" })
      );
    }
    function DeleteSessionToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react15.useState)(readDeleteSessionEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react15.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeDeleteSessionEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react15.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react15.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react15.default.createElement(TrashIcon, null)),
        /* @__PURE__ */ import_react15.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react15.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react15.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center aio-switch transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react15.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react15.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/delete-session/index.tsx
    var deleteSessionFeature = {
      id: "delete-session",
      order: 20,
      switch: DeleteSessionToggle,
      client: { apply: apply4 },
      locales: deleteSessionLocales
    };
    var delete_session_default = deleteSessionFeature;

    // src/features/project-memory/entry.tsx
    var import_react16 = __toESM(require("react"), 1);

    // src/features/project-memory/api.ts
    var ENDPOINT3 = "/dsh-all-in-one/memory";
    var REQUEST_TIMEOUT_MS3 = 1e4;
    async function request2(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS3);
      try {
        const response = await fetch(new URL(ENDPOINT3, window.location.origin).toString(), {
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
            console.error("[project-memory] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[project-memory] \u8BF7\u6C42\u8BB0\u5FC6\u8BBE\u7F6E\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadMemorySettings() {
      return request2();
    }
    function saveMemorySettings(update) {
      return request2({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(update)
      });
    }

    // src/features/project-memory/entry.tsx
    function MemoryIcon() {
      return /* @__PURE__ */ import_react16.default.createElement(
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
        /* @__PURE__ */ import_react16.default.createElement("path", { d: "M6 4h12v17l-6-4-6 4V4Z" }),
        /* @__PURE__ */ import_react16.default.createElement("path", { d: "M9.5 9h5" })
      );
    }
    var EMPTY_PAYLOAD = {
      enabled: false,
      root: "",
      effectiveRoot: "",
      defaultRoot: "",
      settingsPath: ""
    };
    function ProjectMemoryEntry({ t, open }) {
      const [payload, setPayload] = (0, import_react16.useState)(null);
      const [error, setError] = (0, import_react16.useState)(null);
      const [saving, setSaving] = (0, import_react16.useState)(false);
      const translate = (0, import_react16.useRef)(t);
      translate.current = t;
      (0, import_react16.useEffect)(() => {
        let active = true;
        void loadMemorySettings().then((next) => {
          if (active) setPayload(next);
        }).catch((failure) => {
          if (!active) return;
          console.error("[project-memory] \u8BFB\u53D6\u8BBE\u7F6E\u5931\u8D25:", failure);
          setError(translate.current("loadFailed"));
          setPayload(EMPTY_PAYLOAD);
        });
        return () => {
          active = false;
        };
      }, []);
      const enabled = payload?.enabled === true;
      const handleToggle = async () => {
        if (payload === null || saving) return;
        setSaving(true);
        setError(null);
        try {
          const next = await saveMemorySettings({ enabled: !enabled });
          setPayload(next);
        } catch (failure) {
          console.error("[project-memory] \u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25:", failure);
          setError(`${t("saveFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setSaving(false);
        }
      };
      return (
        // 卡片容器：主体按钮、开关与设置按钮是并列的交互区，不能互相嵌套
        /* @__PURE__ */ import_react16.default.createElement("div", { className: "flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 transition hover:bg-layer2" }, /* @__PURE__ */ import_react16.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            className: "flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          /* @__PURE__ */ import_react16.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react16.default.createElement(MemoryIcon, null)),
          /* @__PURE__ */ import_react16.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react16.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react16.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react16.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)
        ), /* @__PURE__ */ import_react16.default.createElement("div", { className: "flex shrink-0 flex-col items-center justify-between gap-1 self-stretch" }, /* @__PURE__ */ import_react16.default.createElement(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": enabled,
            "aria-label": t("title"),
            disabled: payload === null || saving,
            onClick: () => void handleToggle(),
            className: cn(
              "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
              enabled ? "bg-brand" : "bg-line2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            )
          },
          /* @__PURE__ */ import_react16.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        ), /* @__PURE__ */ import_react16.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            "aria-label": t("pathTitle"),
            title: t("pathTitle"),
            className: "flex items-center justify-center rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          t("settingsAction")
        )))
      );
    }

    // src/features/project-memory/locales.ts
    var projectMemoryLocales = {
      zh: {
        // 开关标题
        title: "\u9879\u76EE\u8BB0\u5FC6",
        // 开关用途说明：说明打开后记忆会写入文件，并在对话开始时进入上下文
        description: "\u8BA9\u5BF9\u8BDD\u8BB0\u4F4F\u9879\u76EE\u7EA6\u5B9A\u4E0E\u504F\u597D\uFF0C\u8BB0\u5FC6\u5199\u5165\u6587\u4EF6\u5E76\u5728\u4E4B\u540E\u7684\u5BF9\u8BDD\u91CC\u81EA\u52A8\u5E26\u4E0A\u3002",
        // 读取设置失败时的提示，卡片仍显示为关闭
        loadFailed: "\u8BFB\u53D6\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BBF\u4E3B\u662F\u5426\u5DF2\u52A0\u8F7D\u672C\u63D2\u4EF6\u3002",
        // 保存开关状态失败时的提示
        saveFailed: "\u4FDD\u5B58\u5931\u8D25",
        // 卡片右下角的设置按钮，点击进入记忆路径页面
        settingsAction: "\u8BBE\u7F6E",
        // 记忆路径页面标题
        pathTitle: "\u8BB0\u5FC6\u8DEF\u5F84",
        // 路径输入框标签
        pathLabel: "\u8BB0\u5FC6\u6839\u76EE\u5F55",
        // 路径输入框占位提示
        pathPlaceholder: "~/.claude/projects",
        // 说明根目录的用途与默认值
        pathHint: "\u6BCF\u4E2A\u9879\u76EE\u5728\u6839\u76EE\u5F55\u4E0B\u6709\u4E00\u4E2A\u72EC\u7ACB\u5B50\u76EE\u5F55\uFF0C\u8BB0\u5FC6\u6587\u4EF6\u4E0E Claude Code \u5B8C\u5168\u4E00\u81F4\u3002\u586B ~/.claude/projects \u5373\u53EF\u4E0E Claude Code \u5171\u7528\u540C\u4E00\u5957\u8BB0\u5FC6\uFF1B\u7559\u7A7A\u4F7F\u7528\u63D2\u4EF6\u9ED8\u8BA4\u76EE\u5F55\u3002",
        // 当前实际使用的目录
        effectivePath: "\u5F53\u524D\u4F7F\u7528",
        // 默认目录标签
        defaultPath: "\u9ED8\u8BA4\u76EE\u5F55",
        // 设置文件的存放位置
        settingsFile: "\u8BBE\u7F6E\u6587\u4EF6",
        // 路径不合法时的提示
        pathInvalid: "\u8DEF\u5F84\u9700\u8981\u662F\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u6216\u4EE5 ~/ \u5F00\u5934\u3002",
        // 装饰性说明：记忆文件名规则
        namingHint: "\u8BB0\u5FC6\u540D\u53EA\u5141\u8BB8\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u4E0E\u8FDE\u5B57\u7B26\uFF0C\u4F8B\u5982 dsh-plugin-project\u3002",
        // 页面里的保存按钮
        save: "\u4FDD\u5B58",
        // 保存进行中的按钮文字
        saving: "\u4FDD\u5B58\u4E2D",
        // 恢复默认目录的按钮
        reset: "\u6062\u590D\u9ED8\u8BA4",
        // 保存成功后的提示
        saved: "\u5DF2\u4FDD\u5B58"
      },
      en: {
        // Switch title
        title: "Project memory",
        // Switch description: memories are written to files and injected into later conversations
        description: "Remembers project conventions and preferences in files that are loaded into later conversations.",
        // Shown when settings cannot be read
        loadFailed: "Could not read settings. Check that the host loaded this plugin.",
        // Shown when the switch state cannot be saved
        saveFailed: "Could not save",
        // Settings button at the card's bottom right; opens the memory path page
        settingsAction: "Settings",
        // Memory path page title
        pathTitle: "Memory path",
        // Label of the root path input
        pathLabel: "Memory root",
        // Placeholder of the root path input
        pathPlaceholder: "~/.claude/projects",
        // Explains the root directory and its default
        pathHint: "Each project gets its own subdirectory under the root, with the same files Claude Code uses. Point it at ~/.claude/projects to share one set of memories; leave empty to use the plugin default.",
        // Currently effective directory
        effectivePath: "In use",
        // Label of the default directory
        defaultPath: "Default",
        // Where the settings file lives
        settingsFile: "Settings file",
        // Shown for an unusable path
        pathInvalid: "The path must be absolute or start with ~/.",
        // Naming rule for memory files
        namingHint: "Memory names allow lowercase letters, digits and hyphens, e.g. dsh-plugin-project.",
        // Save button on the page
        save: "Save",
        // Button text while saving
        saving: "Saving",
        // Button that restores the default directory
        reset: "Use default",
        // Shown after the settings are saved
        saved: "Saved"
      }
    };

    // src/features/project-memory/page.tsx
    var import_react17 = __toESM(require("react"), 1);
    var INPUT_CLASS2 = "w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    function isValidRoot(value) {
      const trimmed = value.trim();
      return trimmed === "" || trimmed === "~" || trimmed.startsWith("/") || trimmed.startsWith("~/");
    }
    function ProjectMemoryPage({ t }) {
      const [payload, setPayload] = (0, import_react17.useState)(null);
      const [draft, setDraft] = (0, import_react17.useState)("");
      const [loading, setLoading] = (0, import_react17.useState)(true);
      const [saving, setSaving] = (0, import_react17.useState)(false);
      const [error, setError] = (0, import_react17.useState)(null);
      const [saved, setSaved] = (0, import_react17.useState)(false);
      const setPageActions = (0, import_react17.useContext)(PageActionsContext);
      (0, import_react17.useEffect)(() => {
        let active = true;
        void loadMemorySettings().then((next) => {
          if (!active) return;
          setPayload(next);
          setDraft(next.root);
        }).catch((failure) => {
          if (!active) return;
          console.error("[project-memory] \u8BFB\u53D6\u8BBE\u7F6E\u5931\u8D25:", failure);
          setError(`${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        }).finally(() => {
          if (active) setLoading(false);
        });
        return () => {
          active = false;
        };
      }, [t]);
      const handleSave = (0, import_react17.useCallback)(async () => {
        if (saving) return;
        const trimmed = draft.trim();
        if (!isValidRoot(trimmed)) {
          setError(t("pathInvalid"));
          setSaved(false);
          return;
        }
        setSaving(true);
        setError(null);
        setSaved(false);
        try {
          const next = await saveMemorySettings({ root: trimmed });
          setPayload(next);
          setDraft(next.root);
          setSaved(true);
        } catch (failure) {
          console.error("[project-memory] \u4FDD\u5B58\u8BB0\u5FC6\u8DEF\u5F84\u5931\u8D25:", failure);
          setError(failure instanceof Error ? failure.message : String(failure));
        } finally {
          setSaving(false);
        }
      }, [draft, saving, t]);
      const saveAction = (0, import_react17.useMemo)(
        () => /* @__PURE__ */ import_react17.default.createElement(Button, { variant: "outline", disabled: loading || saving, onClick: () => void handleSave() }, saving ? t("saving") : t("save")),
        [handleSave, loading, saving, t]
      );
      (0, import_react17.useEffect)(() => {
        if (!setPageActions) return;
        setPageActions(saveAction);
        return () => setPageActions(null);
      }, [saveAction, setPageActions]);
      return /* @__PURE__ */ import_react17.default.createElement("div", null, /* @__PURE__ */ import_react17.default.createElement("h2", { className: "text-[15px] font-semibold leading-6 text-primary" }, t("pathTitle")), /* @__PURE__ */ import_react17.default.createElement("p", { className: "mt-1.5 text-[12px] leading-[18px] text-secondary" }, t("pathHint")), /* @__PURE__ */ import_react17.default.createElement("section", { className: "mt-4 rounded-xl border border-line4 bg-layer1 p-4" }, /* @__PURE__ */ import_react17.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react17.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("pathLabel")), /* @__PURE__ */ import_react17.default.createElement(
        "input",
        {
          value: draft,
          placeholder: t("pathPlaceholder"),
          disabled: loading || saving,
          onChange: (event) => {
            setDraft(event.target.value);
            setSaved(false);
          },
          className: INPUT_CLASS2
        }
      )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "mt-2 flex items-center gap-2" }, /* @__PURE__ */ import_react17.default.createElement(
        Button,
        {
          variant: "ghost",
          disabled: loading || saving,
          onClick: () => {
            setDraft("");
            setSaved(false);
          }
        },
        t("reset")
      ), saved ? /* @__PURE__ */ import_react17.default.createElement("span", { className: "text-[12px] leading-[18px] text-secondary" }, t("saved")) : null), /* @__PURE__ */ import_react17.default.createElement("dl", { className: "mt-3 space-y-1 text-[12px] leading-[18px]" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react17.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("effectivePath")), /* @__PURE__ */ import_react17.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.effectiveRoot || "\u2014")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react17.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("defaultPath")), /* @__PURE__ */ import_react17.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.defaultRoot || "\u2014")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react17.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("settingsFile")), /* @__PURE__ */ import_react17.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.settingsPath || "\u2014"))), /* @__PURE__ */ import_react17.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-secondary" }, t("namingHint")), error !== null ? /* @__PURE__ */ import_react17.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-danger", role: "alert" }, error) : null));
    }

    // src/features/project-memory/index.tsx
    var projectMemoryFeature = {
      id: "project-memory",
      order: 30,
      entry: ProjectMemoryEntry,
      page: ProjectMemoryPage,
      locales: projectMemoryLocales
    };
    var project_memory_default = projectMemoryFeature;

    // src/features/auto-compact/locales.ts
    var autoCompactLocales = {
      zh: {
        // 开关标题
        title: "\u81EA\u52A8\u538B\u7F29\u4F1A\u8BDD",
        // 开关用途说明
        description: "\u81EA\u52A8\u538B\u7F29\u4F1A\u8BDD\uFF0C\u907F\u514D\u8D8A\u804A\u8D8A\u6162\u3002",
        // 阈值输入框的标签
        thresholdLabel: "\u9608\u503C",
        // 阈值输入框的单位
        thresholdUnit: "%",
        // 保留比例输入框的标签
        retainLabel: "\u4FDD\u7559",
        // 读取配置失败时的提示
        loadFailed: "\u8BFB\u53D6\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25",
        // 保存配置失败时的提示
        saveFailed: "\u4FDD\u5B58\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25",
        // 阈值超出 1-100 时的提示
        thresholdInvalid: "\u9608\u503C\u9700\u8981\u662F 1 \u5230 100 \u4E4B\u95F4\u7684\u6574\u6570",
        // 保留比例不低于阈值时的提示
        retainInvalid: "\u4FDD\u7559\u6BD4\u4F8B\u9700\u8981\u662F\u6574\u6570\uFF0C\u4E14\u5C0F\u4E8E\u9608\u503C"
      },
      en: {
        // Switch title
        title: "Auto-compact sessions",
        // Switch description
        description: "Compact sessions automatically so long chats stay fast.",
        // Label of the threshold input
        thresholdLabel: "Threshold",
        // Unit shown after the threshold input
        thresholdUnit: "%",
        // Label of the retained-context input
        retainLabel: "Keep",
        // Shown when the settings cannot be loaded
        loadFailed: "Could not load the auto-compact settings",
        // Shown when the settings cannot be saved
        saveFailed: "Could not save the auto-compact settings",
        // Shown when the threshold is outside 1-100
        thresholdInvalid: "The threshold must be an integer between 1 and 100",
        // Shown when the retained share is not below the threshold
        retainInvalid: "The retained share must be an integer below the threshold"
      }
    };

    // src/features/auto-compact/toggle.tsx
    var import_react18 = __toESM(require("react"), 1);

    // src/features/auto-compact/api.ts
    var ENDPOINT4 = "/dsh-all-in-one/auto-compact";
    var REQUEST_TIMEOUT_MS4 = 1e4;
    async function request3(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS4);
      try {
        const response = await fetch(new URL(ENDPOINT4, window.location.origin).toString(), {
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
            console.error("[auto-compact] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[auto-compact] \u8BF7\u6C42\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadAutoCompactSettings() {
      return request3();
    }
    function saveAutoCompactSettings(update) {
      return request3({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(update)
      });
    }

    // src/features/auto-compact/toggle.tsx
    var MIN_PERCENT = 1;
    var MAX_PERCENT = 100;
    var INPUT_CLASS3 = "w-12 rounded-md border border-line4 bg-base px-1 py-0 text-[11px] text-primary outline-none focus:border-brand";
    function PercentField({ label, unit, value, onChange, onCommit }) {
      return /* @__PURE__ */ import_react18.default.createElement("label", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react18.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, label), /* @__PURE__ */ import_react18.default.createElement(
        "input",
        {
          type: "number",
          inputMode: "numeric",
          min: MIN_PERCENT,
          max: MAX_PERCENT,
          step: 1,
          value,
          "aria-label": label,
          onChange: (event) => onChange(event.target.value),
          onBlur: onCommit,
          onKeyDown: (event) => {
            if (event.key === "Enter") onCommit();
          },
          className: INPUT_CLASS3
        }
      ), /* @__PURE__ */ import_react18.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, unit));
    }
    function CompactIcon() {
      return /* @__PURE__ */ import_react18.default.createElement(
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
        /* @__PURE__ */ import_react18.default.createElement("path", { d: "M4 9a8 8 0 0 1 13.7-4.3L20 7" }),
        /* @__PURE__ */ import_react18.default.createElement("path", { d: "M20 4v3.5h-3.5" }),
        /* @__PURE__ */ import_react18.default.createElement("path", { d: "M20 15a8 8 0 0 1-13.7 4.3L4 17" }),
        /* @__PURE__ */ import_react18.default.createElement("path", { d: "M4 20v-3.5h3.5" })
      );
    }
    function AutoCompactToggle({ t }) {
      const [settings, setSettings] = (0, import_react18.useState)(null);
      const [thresholdDraft, setThresholdDraft] = (0, import_react18.useState)("");
      const [retainDraft, setRetainDraft] = (0, import_react18.useState)("");
      const [error, setError] = (0, import_react18.useState)(null);
      const latestRequest = (0, import_react18.useRef)(0);
      (0, import_react18.useEffect)(() => {
        let active = true;
        void loadAutoCompactSettings().then((next) => {
          if (!active) return;
          setSettings(next);
          setThresholdDraft(String(next.thresholdPercent));
          setRetainDraft(String(next.retainPercent));
        }).catch((failure) => {
          if (!active) return;
          console.error("[auto-compact] \u8BFB\u53D6\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25:", failure);
          setError(`${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        });
        return () => {
          active = false;
        };
      }, [t]);
      const persist = async (patch) => {
        latestRequest.current += 1;
        const request4 = latestRequest.current;
        setError(null);
        try {
          const next = await saveAutoCompactSettings(patch);
          if (latestRequest.current !== request4) return;
          setSettings(next);
          setThresholdDraft(String(next.thresholdPercent));
          setRetainDraft(String(next.retainPercent));
        } catch (failure) {
          if (latestRequest.current !== request4) return;
          console.error("[auto-compact] \u4FDD\u5B58\u81EA\u52A8\u538B\u7F29\u8BBE\u7F6E\u5931\u8D25:", failure);
          setError(`${t("saveFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        }
      };
      const handleToggle = () => {
        if (settings === null) return;
        void persist({ enabled: !settings.enabled });
      };
      const commitThreshold = () => {
        if (settings === null) return;
        const parsed = Number(thresholdDraft.trim());
        if (!Number.isInteger(parsed) || parsed < MIN_PERCENT || parsed > MAX_PERCENT) {
          setError(t("thresholdInvalid"));
          setThresholdDraft(String(settings.thresholdPercent));
          return;
        }
        if (parsed === settings.thresholdPercent) return;
        void persist({ thresholdPercent: parsed });
      };
      const commitRetain = () => {
        if (settings === null) return;
        const parsed = Number(retainDraft.trim());
        if (!Number.isInteger(parsed) || parsed < MIN_PERCENT || parsed >= settings.thresholdPercent) {
          setError(t("retainInvalid"));
          setRetainDraft(String(settings.retainPercent));
          return;
        }
        if (parsed === settings.retainPercent) return;
        void persist({ retainPercent: parsed });
      };
      const enabled = settings?.enabled === true;
      return (
        // 卡片容器：主体按钮、开关与阈值输入是并列的交互区，不能互相嵌套
        /* @__PURE__ */ import_react18.default.createElement("div", { className: "flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 transition hover:bg-layer2" }, /* @__PURE__ */ import_react18.default.createElement(
          "button",
          {
            type: "button",
            "aria-label": t("title"),
            disabled: settings === null,
            onClick: handleToggle,
            className: "flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default"
          },
          /* @__PURE__ */ import_react18.default.createElement("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react18.default.createElement(CompactIcon, null)),
          /* @__PURE__ */ import_react18.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react18.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react18.default.createElement("span", { className: "block text-[12px] leading-[16px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react18.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)
        ), /* @__PURE__ */ import_react18.default.createElement("div", { className: "flex shrink-0 flex-col items-end justify-between gap-1 self-stretch" }, /* @__PURE__ */ import_react18.default.createElement(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": enabled,
            "aria-label": t("title"),
            disabled: settings === null,
            onClick: handleToggle,
            className: cn(
              "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
              enabled ? "bg-brand" : "bg-line2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-default"
            )
          },
          /* @__PURE__ */ import_react18.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        ), enabled ? /* @__PURE__ */ import_react18.default.createElement(import_react18.default.Fragment, null, /* @__PURE__ */ import_react18.default.createElement(
          PercentField,
          {
            label: t("thresholdLabel"),
            unit: t("thresholdUnit"),
            value: thresholdDraft,
            onChange: setThresholdDraft,
            onCommit: commitThreshold
          }
        ), /* @__PURE__ */ import_react18.default.createElement(
          PercentField,
          {
            label: t("retainLabel"),
            unit: t("thresholdUnit"),
            value: retainDraft,
            onChange: setRetainDraft,
            onCommit: commitRetain
          }
        )) : null))
      );
    }

    // src/features/auto-compact/index.tsx
    var autoCompactFeature = {
      id: "auto-compact",
      order: 40,
      switch: AutoCompactToggle,
      locales: autoCompactLocales
    };
    var auto_compact_default = autoCompactFeature;

    // src/features/index.ts
    var featureList = [
      expand_process_default,
      image_preview_default,
      session_history_default,
      delete_session_default,
      project_memory_default,
      power_pack_default,
      auto_compact_default
    ];

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
    var import_react19 = __toESM(require("react"), 1);
    function BackGlyph() {
      return /* @__PURE__ */ import_react19.default.createElement(
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
        /* @__PURE__ */ import_react19.default.createElement("path", { d: "M9.5 3.5 5 8l4.5 4.5" })
      );
    }
    function AllInOnePage({ t }) {
      const [activeId, setActiveId] = (0, import_react19.useState)(null);
      const [pageActions, setPageActions] = (0, import_react19.useState)(null);
      const active = activeId ? registry.find(activeId) : void 0;
      const activePage = active && "page" in active ? active : void 0;
      const featureTranslate = (0, import_react19.useCallback)(
        // 网格视图不会调用此函数，activePage 为空时直接返回 key 兜底
        (key) => activePage ? t(`${activePage.id}.${key}`) : key,
        [activePage, t]
      );
      if (activePage) {
        const ActivePage = activePage.page;
        return /* @__PURE__ */ import_react19.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react19.default.createElement(PageActionsContext.Provider, { value: setPageActions }, /* @__PURE__ */ import_react19.default.createElement("div", { className: "sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-line4 bg-base pb-3" }, /* @__PURE__ */ import_react19.default.createElement(Button, { variant: "outline", onClick: () => setActiveId(null) }, /* @__PURE__ */ import_react19.default.createElement(BackGlyph, null), t("shell.back")), pageActions ? /* @__PURE__ */ import_react19.default.createElement("div", { className: "flex items-center gap-2" }, pageActions) : null), /* @__PURE__ */ import_react19.default.createElement("div", { className: "mt-4" }, /* @__PURE__ */ import_react19.default.createElement(ActivePage, { t: featureTranslate }))));
      }
      return /* @__PURE__ */ import_react19.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react19.default.createElement("header", null, /* @__PURE__ */ import_react19.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("shell.pageTitle")), /* @__PURE__ */ import_react19.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("shell.pageDescription"))), registry.list.length === 0 ? (
        // 尚未注册功能时的空态提示
        /* @__PURE__ */ import_react19.default.createElement("p", { className: "mt-5 rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary" }, t("shell.empty"))
      ) : /* @__PURE__ */ import_react19.default.createElement("div", { className: "aio-card-grid mt-4 grid auto-rows-fr grid-cols-1 gap-2.5 sm:grid-cols-2" }, registry.list.map((feature) => {
        const featureT = (key) => t(`${feature.id}.${key}`);
        if ("switch" in feature) {
          const SwitchEntry = feature.switch;
          return /* @__PURE__ */ import_react19.default.createElement("div", { key: feature.id, className: "min-w-0" }, /* @__PURE__ */ import_react19.default.createElement(SwitchEntry, { t: featureT }));
        }
        const Entry = feature.entry;
        return /* @__PURE__ */ import_react19.default.createElement("div", { key: feature.id, className: "min-w-0" }, /* @__PURE__ */ import_react19.default.createElement(Entry, { t: featureT, open: () => setActiveId(feature.id) }));
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
        const SettingsSection = () => /* @__PURE__ */ import_react20.default.createElement(AllInOnePage, { t });
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
