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
    var import_react7 = __toESM(require("react"), 1);

    // .build/styles.css
    var styles_default = "*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.relative{position:relative}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-4{height:1rem}.h-5{height:1.25rem}.h-9{height:2.25rem}.w-4{width:1rem}.w-9{width:2.25rem}.w-full{width:100%}.min-w-0{min-width:0}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.translate-x-0\\.5{--tw-translate-x:0.125rem}.translate-x-0\\.5,.translate-x-\\[18px\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-\\[18px\\]{--tw-translate-x:18px}.list-decimal{list-style-type:decimal}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-center{justify-content:center}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-dashed{border-style:dashed}.border-line1{border-color:var(--dsw-alias-border-l1)}.bg-base{background-color:var(--dsw-alias-bg-base)}.bg-brand{background-color:var(--dsw-alias-brand-primary)}.bg-layer1{background-color:var(--dsw-alias-bg-layer-1)}.bg-line2{background-color:var(--dsw-alias-border-l2)}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-3\\.5{padding-top:.875rem;padding-bottom:.875rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pb-3{padding-bottom:.75rem}.pl-4{padding-left:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[17px\\]{font-size:17px}.font-medium{font-weight:500}.font-semibold{font-weight:600}.leading-5{line-height:1.25rem}.leading-6{line-height:1.5rem}.leading-\\[18px\\]{line-height:18px}.text-brand{color:var(--dsw-alias-brand-primary)}.text-danger{color:var(--dsw-alias-state-error-primary)}.text-primary{color:var(--dsw-alias-label-primary)}.text-secondary{color:var(--dsw-alias-label-secondary)}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline{outline-style:solid}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dsh-cf-root{color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}.hover\\:border-line2:hover{border-color:var(--dsw-alias-border-l2)}.hover\\:bg-layer2:hover{background-color:var(--dsw-alias-bg-layer-2)}.hover\\:text-primary:hover{color:var(--dsw-alias-label-primary)}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus-visible\\:ring-brand:focus-visible{--tw-ring-color:var(--dsw-alias-brand-primary)}@media (min-width:640px){.sm\\:col-span-2{grid-column:span 2/span 2}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}";

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

    // src/features/demo/entry.tsx
    var import_react = __toESM(require("react"), 1);
    function DemoIcon() {
      return /* @__PURE__ */ import_react.default.createElement(
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
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react.default.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "2" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: "M14 17.5h7M17.5 14v7" })
      );
    }
    function DemoEntry({ t, open }) {
      return /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          type: "button",
          onClick: open,
          className: "flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand" }, /* @__PURE__ */ import_react.default.createElement(DemoIcon, null)),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "block text-[13px] font-medium leading-5 text-primary" }, t("title")), /* @__PURE__ */ import_react.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("description")))
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
    var import_react4 = __toESM(require("react"), 1);

    // src/components/Button.tsx
    var import_react2 = __toESM(require("react"), 1);

    // src/common/cn.ts
    function cn(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    // src/components/Button.tsx
    var VARIANT_CLASS = {
      ghost: "flex items-center gap-1 rounded-lg px-2 py-1 text-secondary hover:bg-layer2 hover:text-primary",
      outline: "rounded-lg border border-line1 bg-base px-3 py-1.5 text-primary hover:bg-layer2"
    };
    function Button({ variant = "ghost", className, type = "button", ...rest }) {
      return /* @__PURE__ */ import_react2.default.createElement(
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

    // src/features/demo/Card.tsx
    var import_react3 = __toESM(require("react"), 1);
    function Card({ className, children }) {
      return /* @__PURE__ */ import_react3.default.createElement("div", { className: cn("rounded-xl border border-line1 bg-layer1", className) }, children);
    }

    // src/features/demo/page.tsx
    function DemoPage({ t }) {
      const [count, setCount] = (0, import_react4.useState)(0);
      return /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react4.default.createElement("header", null, /* @__PURE__ */ import_react4.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("title")), /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("description"))), /* @__PURE__ */ import_react4.default.createElement(Card, { className: "p-4" }, /* @__PURE__ */ import_react4.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("sectionTitle")), /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-1.5 text-[12px] leading-5 text-secondary" }, t("sectionDescription")), /* @__PURE__ */ import_react4.default.createElement(Button, { variant: "outline", className: "mt-3", onClick: () => setCount((value) => value + 1) }, t("counterLabel"), ": ", count)), /* @__PURE__ */ import_react4.default.createElement(Card, { className: "p-4" }, /* @__PURE__ */ import_react4.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, t("stepsTitle")), /* @__PURE__ */ import_react4.default.createElement("ol", { className: "mt-1.5 list-decimal pl-4 text-[12px] leading-6 text-secondary" }, /* @__PURE__ */ import_react4.default.createElement("li", null, t("step1")), /* @__PURE__ */ import_react4.default.createElement("li", null, t("step2")), /* @__PURE__ */ import_react4.default.createElement("li", null, t("step3")), /* @__PURE__ */ import_react4.default.createElement("li", null, t("step4")))));
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
    var import_react5 = __toESM(require("react"), 1);

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
      return /* @__PURE__ */ import_react5.default.createElement(
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
        /* @__PURE__ */ import_react5.default.createElement("path", { d: "m7 9 5-5 5 5" }),
        /* @__PURE__ */ import_react5.default.createElement("path", { d: "m7 15 5 5 5-5" })
      );
    }
    function ExpandProcessToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react5.useState)(readExpandProcessEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react5.useState)(false);
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
      return /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          onClick: handleToggle,
          className: "flex w-full items-center gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react5.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand" }, /* @__PURE__ */ import_react5.default.createElement(ExpandIcon, null)),
        /* @__PURE__ */ import_react5.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "block text-[13px] font-medium leading-5 text-primary" }, t("title")), /* @__PURE__ */ import_react5.default.createElement("span", { className: "mt-1 block text-[12px] leading-[18px] text-secondary" }, t("description"))),
        /* @__PURE__ */ import_react5.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition",
              enabled ? "bg-brand" : "bg-line2"
            )
          },
          /* @__PURE__ */ import_react5.default.createElement(
            "span",
            {
              className: cn(
                "h-4 w-4 rounded-full bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )
      ), saveFailed ? /* @__PURE__ */ import_react5.default.createElement("p", { className: "mt-1.5 text-[12px] leading-[18px] text-danger" }, t("saveFailed")) : null);
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
    var featureList = [expand_process_default, demo_default];

    // src/shell/registry.ts
    var DEFAULT_FEATURE_ORDER = 100;
    function isFeatureDefinition(value) {
      if (typeof value !== "object" || value === null) return false;
      const candidate = value;
      if (typeof candidate.id !== "string" || candidate.id === "") return false;
      if (typeof candidate.locales !== "object" || candidate.locales === null) return false;
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

    // src/shell/CustomFeaturesPage.tsx
    var import_react6 = __toESM(require("react"), 1);
    function BackGlyph() {
      return /* @__PURE__ */ import_react6.default.createElement(
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
        /* @__PURE__ */ import_react6.default.createElement("path", { d: "M9.5 3.5 5 8l4.5 4.5" })
      );
    }
    function CustomFeaturesPage({ t }) {
      const [activeId, setActiveId] = (0, import_react6.useState)(null);
      const active = activeId ? registry.find(activeId) : void 0;
      if (active && "page" in active) {
        const ActivePage = active.page;
        return /* @__PURE__ */ import_react6.default.createElement("div", { className: "dsh-cf-root" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex items-center gap-2 border-b border-line1 pb-3" }, /* @__PURE__ */ import_react6.default.createElement(Button, { variant: "ghost", onClick: () => setActiveId(null) }, /* @__PURE__ */ import_react6.default.createElement(BackGlyph, null), t("shell.back"))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "mt-4" }, /* @__PURE__ */ import_react6.default.createElement(ActivePage, { t: (key) => t(`${active.id}.${key}`) })));
      }
      return /* @__PURE__ */ import_react6.default.createElement("div", { className: "dsh-cf-root" }, /* @__PURE__ */ import_react6.default.createElement("header", null, /* @__PURE__ */ import_react6.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("shell.pageTitle")), /* @__PURE__ */ import_react6.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("shell.pageDescription"))), registry.list.length === 0 ? (
        // 尚未注册功能时的空态提示
        /* @__PURE__ */ import_react6.default.createElement("p", { className: "mt-5 rounded-xl border border-dashed border-line1 px-4 py-6 text-center text-[12px] text-secondary" }, t("shell.empty"))
      ) : /* @__PURE__ */ import_react6.default.createElement("div", { className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" }, registry.list.map((feature) => {
        const featureT = (key) => t(`${feature.id}.${key}`);
        if ("switch" in feature) {
          const SwitchEntry = feature.switch;
          return /* @__PURE__ */ import_react6.default.createElement("div", { key: feature.id, className: "sm:col-span-2" }, /* @__PURE__ */ import_react6.default.createElement(SwitchEntry, { t: featureT }));
        }
        const Entry = feature.entry;
        return /* @__PURE__ */ import_react6.default.createElement(Entry, { key: feature.id, t: featureT, open: () => setActiveId(feature.id) });
      })));
    }

    // src/entry.tsx
    var LOCALE_NAMESPACE = "custom-features";
    var SHELL_DICTIONARIES = {
      zh: {
        // 设置左侧导航项名称
        "shell.navTitle": "\u5B9A\u5236\u529F\u80FD",
        // 页面主标题
        "shell.pageTitle": "\u5B9A\u5236\u529F\u80FD",
        // 页面说明，解释这一页的用途
        "shell.pageDescription": "\u6240\u6709\u72EC\u7ACB\u7684\u5C0F\u5DE5\u5177\u90FD\u6536\u62E2\u5728\u8FD9\u91CC\uFF0C\u70B9\u51FB\u5361\u7247\u8FDB\u5165\u5BF9\u5E94\u7684\u529F\u80FD\u3002",
        // 尚未注册任何功能时的空态提示
        "shell.empty": "\u8FD8\u6CA1\u6709\u6CE8\u518C\u4EFB\u4F55\u529F\u80FD\uFF0C\u5728 src/features \u4E0B\u65B0\u5EFA\u6587\u4EF6\u5939\u5373\u53EF\u6DFB\u52A0\u3002",
        // 从功能页面返回功能网格的按钮文案
        "shell.back": "\u8FD4\u56DE"
      },
      en: {
        // Settings navigation entry label
        "shell.navTitle": "Custom Features",
        // Page heading
        "shell.pageTitle": "Custom Features",
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
          style.setAttribute("data-dsh-plugin", "custom-features");
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
        const SettingsSection = () => /* @__PURE__ */ import_react7.default.createElement(CustomFeaturesPage, { t });
        ctx.slots.inject(
          "settings.section",
          () => ctx.slots.register(
            {
              name: "settings.section",
              id: "custom-features",
              order: 30,
              label: () => t("shell.navTitle")
            },
            SettingsSection
          )
        );
      }
    };
    var entry_default = plugin;

    return module.exports.default || module.exports;
  },
});
