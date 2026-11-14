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
    var import_react31 = __toESM(require("react"), 1);

    // .build/styles.css
    var styles_default = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.\\!container{width:100%!important}.container{width:100%}@media (min-width:640px){.\\!container{max-width:640px!important}.container{max-width:640px}}@media (min-width:768px){.\\!container{max-width:768px!important}.container{max-width:768px}}@media (min-width:1024px){.\\!container{max-width:1024px!important}.container{max-width:1024px}}@media (min-width:1280px){.\\!container{max-width:1280px!important}.container{max-width:1280px}}@media (min-width:1536px){.\\!container{max-width:1536px!important}.container{max-width:1536px}}.visible{visibility:visible}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:0}.bottom-5{bottom:1.25rem}.left-1\\/2{left:50%}.right-5{right:1.25rem}.top-0{top:0}.top-1\\/2{top:50%}.top-5{top:1.25rem}.isolate{isolation:isolate}.z-10{z-index:10}.z-20{z-index:20}.z-\\[200\\]{z-index:200}.mx-1{margin-left:.25rem;margin-right:.25rem}.-ml-px{margin-left:-1px}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.ml-2{margin-left:.5rem}.ml-auto{margin-left:auto}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.box-border{box-sizing:border-box}.block{display:block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.hidden{display:none}.h-11{height:2.75rem}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-\\[18px\\]{height:18px}.h-full{height:100%}.max-h-72{max-height:18rem}.max-h-\\[320px\\]{max-height:320px}.w-11{width:2.75rem}.w-12{width:3rem}.w-3\\.5{width:.875rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-9{width:2.25rem}.w-full{width:100%}.w-px{width:1px}.min-w-0{min-width:0}.min-w-\\[32px\\]{min-width:32px}.min-w-\\[56px\\]{min-width:56px}.max-w-\\[70\\%\\]{max-width:70%}.max-w-full{max-width:100%}.max-w-none{max-width:none}.flex-1{flex:1 1 0%}.flex-none{flex:none}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x:-50%}.-translate-x-1\\/2,.translate-x-0\\.5{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-0\\.5{--tw-translate-x:0.125rem}.translate-x-\\[18px\\]{--tw-translate-x:18px}.translate-x-\\[18px\\],.translate-x-\\[20px\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-\\[20px\\]{--tw-translate-x:20px}.translate-x-\\[2px\\]{--tw-translate-x:2px}.transform,.translate-x-\\[2px\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-grab{cursor:grab}.cursor-grabbing{cursor:grabbing}.cursor-pointer{cursor:pointer}.cursor-zoom-in{cursor:zoom-in}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.resize{resize:both}.auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-0\\.5{gap:.125rem}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-2\\.5{gap:.625rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.25rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem*var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.self-end{align-self:flex-end}.self-stretch{align-self:stretch}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.whitespace-nowrap{white-space:nowrap}.break-all{word-break:break-all}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border{border-width:1px}.border-0{border-width:0}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}.border-solid{border-style:solid}.border-dashed{border-style:dashed}.border-brand{border-color:var(--dsw-alias-brand-primary)}.border-danger{border-color:var(--dsw-alias-state-error-primary)}.border-line4{border-color:var(--dsw-alias-border-l4)}.border-primary{border-color:var(--dsw-alias-label-primary)}.border-success{border-color:var(--dsw-alias-state-success-primary)}.bg-base{background-color:var(--dsw-alias-bg-base)}.bg-brand{background-color:var(--dsw-alias-brand-primary)}.bg-layer1{background-color:var(--dsw-alias-bg-layer-1)}.bg-layer2{background-color:var(--dsw-alias-bg-layer-2)}.bg-line2{background-color:var(--dsw-alias-border-l2)}.bg-line4{background-color:var(--dsw-alias-border-l4)}.bg-overlay{background-color:var(--dsw-alias-bg-overlay)}.bg-primary{background-color:var(--dsw-alias-label-primary)}.bg-transparent{background-color:transparent}.object-contain{-o-object-fit:contain;object-fit:contain}.p-0{padding:0}.p-4{padding:1rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-1\\.5{padding-left:.375rem;padding-right:.375rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-0{padding-top:0;padding-bottom:0}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-px{padding-top:1px;padding-bottom:1px}.pb-3{padding-bottom:.75rem}.pl-2{padding-left:.5rem}.pl-7{padding-left:1.75rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[15px\\]{font-size:15px}.text-\\[17px\\]{font-size:17px}.font-medium{font-weight:500}.font-semibold{font-weight:600}.lowercase{text-transform:lowercase}.leading-4{line-height:1rem}.leading-5{line-height:1.25rem}.leading-6{line-height:1.5rem}.leading-\\[14px\\]{line-height:14px}.leading-\\[16px\\]{line-height:16px}.leading-\\[18px\\]{line-height:18px}.leading-none{line-height:1}.text-\\[color\\:var\\(--dsw-alias-bg-base\\)\\]{color:var(--dsw-alias-bg-base)}.text-brand{color:var(--dsw-alias-brand-primary)}.text-danger{color:var(--dsw-alias-state-error-primary)}.text-primary{color:var(--dsw-alias-label-primary)}.text-secondary{color:var(--dsw-alias-label-secondary)}.text-success{color:var(--dsw-alias-state-success-primary)}.text-warn{color:var(--dsw-alias-state-warn-primary)}.underline{text-decoration-line:underline}.accent-brand{accent-color:var(--dsw-alias-brand-primary)}.opacity-40{opacity:.4}.opacity-60{opacity:.6}.opacity-90{opacity:.9}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.2\\)\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.2\\)\\]{--tw-shadow:0 1px 2px rgba(0,0,0,.2);--tw-shadow-colored:0 1px 2px var(--tw-shadow-color)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.ring{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring,.ring-1{box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-1{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.ring-black\\/5{--tw-ring-color:rgba(0,0,0,.05)}.blur{--tw-blur:blur(8px)}.blur,.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1)}.duration-150,.transition-transform{transition-duration:.15s}.duration-200{transition-duration:.2s}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}.\\[all-in-one\\:perf\\]{all-in-one:perf}.dsh-aio-root{color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}:where(.dsh-aio-root) :where(*,:before,:after){box-sizing:border-box;border-style:solid;border-width:0}:where(.dsh-aio-root) :where(h1,h2,h3,h4,h5,h6,p,ul,ol){margin:0;padding:0}:where(.dsh-aio-root) :where(ul,ol){list-style:none}:where(.dsh-aio-root) :where(textarea){resize:vertical}.aio-card-grid>*>*{height:100%}.dsh-aio-root .aio-card-grid{grid-template-columns:repeat(1,minmax(0,1fr))}@media (min-width:640px){.dsh-aio-root .aio-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}.dsh-aio-root .aio-switch{border-radius:9999px!important}.aio-card-grid,.aio-card-grid *{--dsw-corner-shape:initial;corner-shape:round}.aio-workspace-count:after{content:"\uFF08" attr(data-aio-workspace-count) "\uFF09";color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;margin-inline-start:1px}.placeholder\\:text-secondary::-moz-placeholder{color:var(--dsw-alias-label-secondary)}.placeholder\\:text-secondary::placeholder{color:var(--dsw-alias-label-secondary)}.hover\\:bg-layer2:hover{background-color:var(--dsw-alias-bg-layer-2)}.hover\\:text-danger:hover{color:var(--dsw-alias-state-error-primary)}.hover\\:text-primary:hover{color:var(--dsw-alias-label-primary)}.focus\\:border-brand:focus{border-color:var(--dsw-alias-brand-primary)}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:outline:focus-visible{outline-style:solid}.focus-visible\\:outline-2:focus-visible{outline-width:2px}.focus-visible\\:outline-offset-2:focus-visible{outline-offset:2px}.focus-visible\\:outline-brand:focus-visible{outline-color:var(--dsw-alias-brand-primary)}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus-visible\\:ring-brand:focus-visible{--tw-ring-color:var(--dsw-alias-brand-primary)}.focus-visible\\:ring-offset-1:focus-visible{--tw-ring-offset-width:1px}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px}.disabled\\:cursor-default:disabled{cursor:default}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}';

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

    // src/features/expand-process/locales.ts
    var expandProcessLocales = {
      zh: {
        // 开关标题
        title: "\u5C55\u5F00\u8FC7\u7A0B",
        // 开关用途说明：解释打开后会话里的哪些内容会展开
        description: "\u4F1A\u8BDD\u91CC\u7684\u300C\u601D\u8003\u300D\u4E0E\u300C\u8FD0\u884C\u547D\u4EE4\u300D\u9ED8\u8BA4\u5C55\u5F00\uFF0C\u65E0\u9700\u9010\u6761\u70B9\u5F00\u3002",
        // 展开范围标签
        modeLabel: "\u5C55\u5F00\u8303\u56F4",
        // 展开范围选项：所有对话轮次的过程都展开
        modeAll: "\u5168\u90E8\u5BF9\u8BDD",
        // 展开范围选项：只展开最新一轮对话的过程，该轮结束后保持展开
        modeLatest: "\u6700\u65B0\u5BF9\u8BDD",
        // 开关或范围写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002"
      },
      en: {
        // Switch title
        title: "Expand process",
        // Switch description explaining what expands when enabled
        description: "Keep reasoning and command rows expanded so they need no manual opening.",
        // Expansion scope label
        modeLabel: "Scope",
        // Scope option: expand process rows in every conversation turn
        modeAll: "All conversations",
        // Scope option: expand only the latest turn, which stays open after the turn ends
        modeLatest: "Latest conversation",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions."
      }
    };

    // src/features/expand-process/toggle.tsx
    var import_react = __toESM(require("react"), 1);

    // src/common/cn.ts
    function cn(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    // src/features/expand-process/expand-process.ts
    var EXPAND_PROCESS_STORAGE_KEY = "dsh-all-in-one:expand-process";
    var EXPAND_PROCESS_MODE_STORAGE_KEY = "dsh-all-in-one:expand-process-mode";
    function bootExpandProcess(keys) {
      const win = window;
      if (win["__DSH_ALL_IN_ONE_EXPAND_PROCESS__"]) return;
      win["__DSH_ALL_IN_ONE_EXPAND_PROCESS__"] = true;
      function readEnabled() {
        try {
          return window.localStorage.getItem(keys.enabledKey) === "1";
        } catch (error) {
          console.error("[expand-process] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
          return false;
        }
      }
      function readMode() {
        try {
          const stored = window.localStorage.getItem(keys.modeKey);
          return stored === "latest" || stored === "active" ? "latest" : "all";
        } catch (error) {
          console.error("[expand-process] \u8BFB\u53D6\u5C55\u5F00\u8303\u56F4\u5931\u8D25:", error);
          return "all";
        }
      }
      const enabled = readEnabled();
      win["__DSH_EXPAND_PROCESS_DEFER__"] = enabled && readMode() === "latest";
      if (enabled) {
        const style = document.createElement("style");
        style.id = "dsh-all-in-one-expand-process-style";
        style.textContent = [
          "[data-disclosure-header] [data-disclosure-row],",
          '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] {',
          "  color: var(--dsw-alias-label-primary, #0f1115);",
          "}",
          "[data-disclosure-header] + div,",
          '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] + div {',
          "  position: relative;",
          "  margin-left: 20px;",
          "}",
          "[data-disclosure-header] + div::before,",
          '[data-slot="tool.call.toolview"] [role="button"][aria-expanded] + div::before {',
          '  content: "";',
          "  position: absolute;",
          "  top: 17px;",
          "  bottom: 17px;",
          "  left: -12px;",
          "  width: 2px;",
          "  border-radius: 1px;",
          "  background: var(--dsw-alias-label-tertiary, #81858c);",
          "  opacity: 0.35;",
          "}",
          "[data-chat-flow] [data-chat-turn] {",
          "  content-visibility: auto;",
          "  contain-intrinsic-size: auto 480px;",
          "}"
        ].join("\n");
        (document.head || document.documentElement).appendChild(style);
      }
      win["__DSH_EXPAND_PROCESS_INITIAL__"] = function() {
        return enabled && readMode() === "all";
      };
      const binders = [];
      let observer = null;
      let scheduled = false;
      let timer = 0;
      let lastTurn = null;
      const REFRESH_DEBOUNCE_MS = 150;
      function latestTurn() {
        const nodes = document.querySelectorAll("[data-chat-turn]");
        if (!nodes.length) return null;
        let best = null;
        let bestValue = -Infinity;
        for (const node of nodes) {
          const raw = node.getAttribute("data-chat-turn") ?? "";
          const value = Number(raw);
          if (Number.isFinite(value) && value > bestValue) {
            bestValue = value;
            best = raw;
          }
        }
        return best ?? nodes[nodes.length - 1].getAttribute("data-chat-turn");
      }
      function refresh() {
        const turn = latestTurn();
        if (turn === lastTurn) return;
        lastTurn = turn;
        for (const update of [...binders]) update(turn);
      }
      function schedule() {
        if (scheduled) return;
        scheduled = true;
        timer = window.setTimeout(() => {
          timer = 0;
          scheduled = false;
          refresh();
        }, REFRESH_DEBOUNCE_MS);
      }
      function observe() {
        if (observer !== null || document.body === null) return;
        observer = new MutationObserver(schedule);
        observer.observe(document.body, { childList: true, subtree: true });
      }
      function unobserve() {
        if (observer === null) return;
        observer.disconnect();
        observer = null;
        lastTurn = null;
        if (timer !== 0) {
          window.clearTimeout(timer);
          timer = 0;
          scheduled = false;
        }
      }
      function bind(element, setExpanded, manual) {
        if (!enabled || readMode() !== "latest") return void 0;
        if (element === null || typeof element.closest !== "function") return void 0;
        const turnElement = element.closest("[data-chat-turn]");
        if (turnElement === null) return void 0;
        const turn = turnElement.getAttribute("data-chat-turn");
        const update = (latest) => {
          if (manual.current) return;
          setExpanded(turn !== null && turn === latest);
        };
        binders.push(update);
        observe();
        update(latestTurn());
        return () => {
          const index = binders.indexOf(update);
          if (index >= 0) binders.splice(index, 1);
          if (binders.length === 0) unobserve();
        };
      }
      win["__DSH_EXPAND_PROCESS_BIND__"] = bind;
      const RULES = {
        "@deepseek-ai/dsh-client-ui-tool": [
          [
            "const{expanded,toggle:toggleExpand}=useDisclosure();",
            'const __aioRow = (0, react.useRef)(null); const __aioManual = (0, react.useRef)(false); const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_INITIAL__()); const toggleExpand = () => { __aioManual.current = true; setExpanded((value) => !value); }; (0, react.useLayoutEffect)(() => typeof window.__DSH_EXPAND_PROCESS_BIND__ === "function" ? window.__DSH_EXPAND_PROCESS_BIND__(__aioRow.current, setExpanded, __aioManual) : undefined, []);'
          ],
          ['"data-tool":toolName,', 'ref:__aioRow,"data-tool":toolName,'],
          ['"data-sample":`bash`,', 'ref:__aioRow,"data-sample":`bash`,']
        ],
        "@deepseek-ai/dsh-client-ui-chat": [
          [
            "const{expanded,toggle}=useDisclosure();",
            'const __aioRow = (0, react.useRef)(null); const __aioManual = (0, react.useRef)(false); const [expanded, setExpanded] = (0, react.useState)(() => window.__DSH_EXPAND_PROCESS_INITIAL__()); const toggle = () => { __aioManual.current = true; setExpanded((value) => !value); }; (0, react.useLayoutEffect)(() => typeof window.__DSH_EXPAND_PROCESS_BIND__ === "function" ? window.__DSH_EXPAND_PROCESS_BIND__(__aioRow.current, setExpanded, __aioManual) : undefined, []);'
          ],
          ['"data-variant":`think`,', 'ref:__aioRow,"data-variant":`think`,'],
          [
            "return TIMING_POLICIES[collapseTiming][foldedReplies][mode]}",
            'return TIMING_POLICIES[window.__DSH_EXPAND_PROCESS_DEFER__ ? "next-input" : collapseTiming][foldedReplies][mode]}'
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
          for (const [previous, next] of rules) {
            if (output.indexOf(next) === -1) {
              console.warn("[expand-process] \u90E8\u5206\u89C4\u5219\u672A\u547D\u4E2D " + registration.id + "\uFF1A" + previous);
            }
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
    var EXPAND_PROCESS_SCRIPT = `(${bootExpandProcess.toString()})(${JSON.stringify({
      enabledKey: EXPAND_PROCESS_STORAGE_KEY,
      modeKey: EXPAND_PROCESS_MODE_STORAGE_KEY
    })});`;
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
    function readExpandProcessMode() {
      try {
        const stored = window.localStorage.getItem(EXPAND_PROCESS_MODE_STORAGE_KEY);
        return stored === "latest" || stored === "active" ? "latest" : "all";
      } catch (error) {
        console.error("[expand-process] \u8BFB\u53D6\u5C55\u5F00\u8303\u56F4\u5931\u8D25:", error);
        return "all";
      }
    }
    function writeExpandProcessMode(mode) {
      try {
        window.localStorage.setItem(EXPAND_PROCESS_MODE_STORAGE_KEY, mode);
        return true;
      } catch (error) {
        console.error("[expand-process] \u5199\u5165\u5C55\u5F00\u8303\u56F4\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/expand-process/toggle.tsx
    var MODE_OPTIONS = [
      { value: "all", labelKey: "modeAll" },
      { value: "latest", labelKey: "modeLatest" }
    ];
    function ExpandIcon() {
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
        /* @__PURE__ */ import_react.default.createElement("path", { d: "m7 9 5-5 5 5" }),
        /* @__PURE__ */ import_react.default.createElement("path", { d: "m7 15 5 5 5-5" })
      );
    }
    function ExpandProcessToggle({ t }) {
      const [enabled] = (0, import_react.useState)(readExpandProcessEnabled);
      const [mode] = (0, import_react.useState)(readExpandProcessMode);
      const [saveFailed, setSaveFailed] = (0, import_react.useState)(false);
      const save = (apply10) => {
        if (!apply10()) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        window.location.reload();
      };
      const handleToggle = () => save(() => writeExpandProcessEnabled(!enabled));
      const handleModeChange = (next) => {
        if (next === mode) return;
        save(() => writeExpandProcessMode(next));
      };
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex w-full flex-1 flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex w-full items-start gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react.default.createElement(ExpandIcon, null)), /* @__PURE__ */ import_react.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), enabled ? /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-2 pl-7", role: "radiogroup", "aria-label": t("modeLabel") }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, t("modeLabel")), MODE_OPTIONS.map((option) => {
        const checked = option.value === mode;
        return /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            key: option.value,
            type: "button",
            role: "radio",
            "aria-checked": checked,
            onClick: () => handleModeChange(option.value),
            className: cn(
              "rounded-md border px-1.5 py-0 text-[11px] leading-[16px] transition",
              checked ? "border-brand bg-base text-brand" : "border-line4 bg-layer1 text-secondary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
            )
          },
          t(option.labelKey)
        );
      })) : null), saveFailed ? /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/expand-process/index.tsx
    var expandProcessFeature = {
      id: "expand-process",
      group: "conversation",
      order: 10,
      reloadsPage: true,
      switch: ExpandProcessToggle,
      locales: expandProcessLocales
    };
    var expand_process_default = expandProcessFeature;

    // src/features/image-preview/lightbox-zoom.ts
    var MIN_ZOOM = 0.02;
    var MAX_ZOOM = 16;
    var STEP_FACTOR = 1.25;
    var STAGE_PADDING = 32;
    function clampZoom(zoom) {
      if (!Number.isFinite(zoom)) return 1;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
    }
    function fitView(metrics) {
      if (metrics.naturalWidth <= 0 || metrics.naturalHeight <= 0) {
        return { zoom: 1, offsetX: 0, offsetY: 0 };
      }
      const availableWidth = Math.max(1, metrics.stageWidth - STAGE_PADDING * 2);
      const availableHeight = Math.max(1, metrics.stageHeight - STAGE_PADDING * 2);
      const scale = Math.min(availableWidth / metrics.naturalWidth, availableHeight / metrics.naturalHeight);
      return { zoom: clampZoom(Math.min(1, scale)), offsetX: 0, offsetY: 0 };
    }
    function zoomAt(view, anchor, targetZoom) {
      const zoom = clampZoom(targetZoom);
      const ratio = zoom / view.zoom;
      return {
        zoom,
        offsetX: anchor.x + (view.offsetX - anchor.x) * ratio,
        offsetY: anchor.y + (view.offsetY - anchor.y) * ratio
      };
    }
    function zoomBy(view, factor) {
      return zoomAt(view, { x: 0, y: 0 }, view.zoom * factor);
    }
    function zoomIn(view) {
      return zoomBy(view, STEP_FACTOR);
    }
    function zoomOut(view) {
      return zoomBy(view, 1 / STEP_FACTOR);
    }
    function panBy(view, deltaX, deltaY) {
      return { zoom: view.zoom, offsetX: view.offsetX + deltaX, offsetY: view.offsetY + deltaY };
    }
    function actualSizeView() {
      return { zoom: 1, offsetX: 0, offsetY: 0 };
    }
    function zoomPercent(view) {
      return Math.round(view.zoom * 100);
    }

    // src/features/image-preview/lightbox.ts
    var LIGHTBOX_ATTRIBUTE = "data-dsh-image-zoom";
    var LIGHTBOX_SELECTOR = `[${LIGHTBOX_ATTRIBUTE}]`;
    var OVERLAY_CLASS = "fixed inset-0 z-[200] box-border outline-none";
    var BACKDROP_CLASS = "absolute inset-0 box-border bg-overlay opacity-90";
    var STAGE_CLASS = "relative box-border flex h-full w-full items-center justify-center overflow-hidden";
    var IMAGE_CLASS = "absolute left-1/2 top-1/2 max-w-none cursor-grab select-none rounded-lg border border-solid border-line4 bg-base shadow-xl transition-opacity duration-150";
    var IMAGE_DRAGGING_CLASS = "cursor-grabbing";
    var FOCUS_CLASS = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
    var CLOSE_CLASS = `absolute right-5 top-5 z-20 box-border flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-solid border-line4 bg-layer1 text-primary shadow-xl transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`;
    var TOOLBAR_CLASS = "absolute bottom-5 left-1/2 z-20 box-border flex -translate-x-1/2 items-center gap-1 rounded-full border border-solid border-line4 bg-layer1 px-2 py-1.5 shadow-xl";
    var TOOL_BUTTON_CLASS = `flex h-8 min-w-[32px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent px-2 text-[13px] leading-none text-primary transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`;
    var TOOL_BUTTON_MUTED_CLASS = "opacity-40";
    var PERCENT_CLASS = `min-w-[56px] cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-center text-[13px] leading-none text-primary transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`;
    var SEPARATOR_CLASS = "mx-1 h-5 w-px bg-line4";
    var STATUS_CLASS = "absolute max-w-[70%] text-center text-[13px] text-secondary";
    var DRAG_THRESHOLD = 3;
    var activeDispose;
    function closeImagePreview() {
      if (activeDispose === void 0) return;
      const dispose = activeDispose;
      activeDispose = void 0;
      dispose();
    }
    function createButton(className, label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.setAttribute("aria-label", label);
      button.title = label;
      return button;
    }
    function createCloseIcon() {
      const namespace = "http://www.w3.org/2000/svg";
      const icon = document.createElementNS(namespace, "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("width", "22");
      icon.setAttribute("height", "22");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      icon.setAttribute("stroke-width", "2");
      icon.setAttribute("stroke-linecap", "round");
      icon.setAttribute("aria-hidden", "true");
      for (const [x1, y1, x2, y2] of [
        ["6", "6", "18", "18"],
        ["18", "6", "6", "18"]
      ]) {
        const line = document.createElementNS(namespace, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        icon.appendChild(line);
      }
      return icon;
    }
    function openImagePreview(source, alt, labels) {
      closeImagePreview();
      const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
      let view = { zoom: 1, offsetX: 0, offsetY: 0 };
      let metrics = { naturalWidth: 0, naturalHeight: 0, stageWidth: 0, stageHeight: 0 };
      const overlay = document.createElement("div");
      overlay.setAttribute(LIGHTBOX_ATTRIBUTE, "");
      overlay.className = OVERLAY_CLASS;
      overlay.tabIndex = -1;
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", labels.dialog);
      const backdrop = document.createElement("div");
      backdrop.className = BACKDROP_CLASS;
      backdrop.setAttribute("aria-hidden", "true");
      overlay.appendChild(backdrop);
      const stage = document.createElement("div");
      stage.className = STAGE_CLASS;
      overlay.appendChild(stage);
      const image = document.createElement("img");
      image.className = IMAGE_CLASS;
      image.alt = alt;
      image.draggable = false;
      image.style.opacity = "0";
      stage.appendChild(image);
      const status = document.createElement("span");
      status.className = STATUS_CLASS;
      status.textContent = labels.loadFailed;
      status.style.display = "none";
      stage.appendChild(status);
      const closeButton = createButton(CLOSE_CLASS, labels.close);
      closeButton.appendChild(createCloseIcon());
      stage.appendChild(closeButton);
      const toolbar = document.createElement("div");
      toolbar.className = TOOLBAR_CLASS;
      stage.appendChild(toolbar);
      const zoomOutButton = createButton(TOOL_BUTTON_CLASS, labels.zoomOut);
      zoomOutButton.textContent = "\u2212";
      toolbar.appendChild(zoomOutButton);
      const percentButton = createButton(PERCENT_CLASS, labels.fit);
      percentButton.textContent = "100%";
      toolbar.appendChild(percentButton);
      const zoomInButton = createButton(TOOL_BUTTON_CLASS, labels.zoomIn);
      zoomInButton.textContent = "+";
      toolbar.appendChild(zoomInButton);
      const separator = document.createElement("span");
      separator.className = SEPARATOR_CLASS;
      separator.setAttribute("aria-hidden", "true");
      toolbar.appendChild(separator);
      const actualButton = createButton(TOOL_BUTTON_CLASS, labels.actual);
      actualButton.textContent = "1:1";
      toolbar.appendChild(actualButton);
      const fitButton = createButton(TOOL_BUTTON_CLASS, labels.fit);
      fitButton.textContent = labels.fit;
      toolbar.appendChild(fitButton);
      function applyView() {
        image.style.transform = `translate(-50%, -50%) translate(${String(view.offsetX)}px, ${String(view.offsetY)}px) scale(${String(view.zoom)})`;
        percentButton.textContent = `${String(zoomPercent(view))}%`;
        zoomOutButton.classList.toggle(TOOL_BUTTON_MUTED_CLASS, view.zoom <= MIN_ZOOM * 1.001);
        zoomInButton.classList.toggle(TOOL_BUTTON_MUTED_CLASS, view.zoom >= MAX_ZOOM * 0.999);
      }
      function resetToFit() {
        if (metrics.naturalWidth <= 0) return;
        view = fitView(metrics);
        applyView();
      }
      function measure() {
        metrics = {
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          stageWidth: stage.clientWidth,
          stageHeight: stage.clientHeight
        };
      }
      function render(next) {
        view = next;
        applyView();
      }
      const drag = {
        active: false,
        pointerId: -1,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        moved: false
      };
      function endDrag() {
        if (!drag.active) return;
        drag.active = false;
        image.classList.remove(IMAGE_DRAGGING_CLASS);
      }
      function handlePointerMove(event) {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;
        if (!drag.moved && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) return;
        drag.moved = true;
        render(panBy({ zoom: view.zoom, offsetX: drag.originX, offsetY: drag.originY }, deltaX, deltaY));
      }
      function handleImagePointerDown(event) {
        if (event.button !== 0) return;
        if (!(event.target instanceof HTMLImageElement)) return;
        event.preventDefault();
        event.stopPropagation();
        drag.active = true;
        drag.pointerId = event.pointerId;
        drag.startX = event.clientX;
        drag.startY = event.clientY;
        drag.originX = view.offsetX;
        drag.originY = view.offsetY;
        drag.moved = false;
        image.classList.add(IMAGE_DRAGGING_CLASS);
      }
      function handleWheel(event) {
        if (metrics.naturalWidth <= 0) return;
        event.preventDefault();
        event.stopPropagation();
        const rect = stage.getBoundingClientRect();
        const anchor = {
          x: event.clientX - (rect.left + rect.width / 2),
          y: event.clientY - (rect.top + rect.height / 2)
        };
        const factor = Math.exp(-event.deltaY * 15e-4);
        render(zoomAt(view, anchor, view.zoom * factor));
      }
      function handleDoubleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (metrics.naturalWidth <= 0) return;
        const fit = fitView(metrics);
        const atFit = Math.abs(view.zoom - fit.zoom) < 1e-3 && Math.abs(view.offsetX) < 1 && Math.abs(view.offsetY) < 1;
        render(atFit ? actualSizeView() : fit);
      }
      function handleKeydown(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeImagePreview();
          return;
        }
        if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          render(zoomIn(view));
          return;
        }
        if (event.key === "-" || event.key === "_") {
          event.preventDefault();
          render(zoomOut(view));
          return;
        }
        if (event.key === "0") {
          event.preventDefault();
          resetToFit();
          return;
        }
        if (event.key === "1") {
          event.preventDefault();
          render(actualSizeView());
        }
      }
      function handleResize() {
        const atFit = Math.abs(view.zoom - fitView(metrics).zoom) < 1e-3 && Math.abs(view.offsetX) < 1 && Math.abs(view.offsetY) < 1;
        measure();
        if (atFit) resetToFit();
      }
      function handleLoad() {
        image.style.opacity = "1";
        measure();
        resetToFit();
      }
      function handleError() {
        image.style.display = "none";
        status.style.display = "block";
        toolbar.style.display = "none";
        console.warn("[image-preview] \u653E\u5927\u56FE\u8BFB\u53D6\u5931\u8D25:", source);
      }
      overlay.addEventListener("click", () => closeImagePreview());
      toolbar.addEventListener("click", (event) => event.stopPropagation());
      stage.addEventListener("pointerdown", handleImagePointerDown);
      stage.addEventListener("dblclick", handleDoubleClick);
      stage.addEventListener("wheel", handleWheel, { passive: false });
      image.addEventListener("click", (event) => event.stopPropagation());
      image.addEventListener("load", handleLoad);
      image.addEventListener("error", handleError);
      closeButton.addEventListener("click", () => closeImagePreview());
      closeButton.addEventListener("pointerdown", (event) => event.stopPropagation());
      zoomInButton.addEventListener("click", () => render(zoomIn(view)));
      zoomOutButton.addEventListener("click", () => render(zoomOut(view)));
      percentButton.addEventListener("click", resetToFit);
      fitButton.addEventListener("click", resetToFit);
      actualButton.addEventListener("click", () => render(actualSizeView()));
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
      window.addEventListener("keydown", handleKeydown, true);
      window.addEventListener("resize", handleResize);
      document.body.appendChild(overlay);
      image.src = source;
      if (image.complete && image.naturalWidth > 0) handleLoad();
      overlay.focus();
      applyView();
      activeDispose = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", endDrag);
        window.removeEventListener("pointercancel", endDrag);
        window.removeEventListener("keydown", handleKeydown, true);
        window.removeEventListener("resize", handleResize);
        overlay.remove();
        previouslyFocused?.focus();
      };
    }

    // src/features/image-preview/conversation.ts
    var CONTAINER_SELECTORS = [
      '[data-conversation-region="chat"]',
      "[data-conversation-scroll]",
      '[data-slot="main.conversation"]'
    ];
    var CONVERSATION_SELECTOR = CONTAINER_SELECTORS.join(", ");
    var CHAT_FLOW_SELECTOR = "[data-chat-flow]";
    function isChatFlowRegion(element) {
      return element?.closest(CHAT_FLOW_SELECTOR) != null;
    }
    function findConversationContainer() {
      for (const selector of CONTAINER_SELECTORS) {
        const element = document.querySelector(selector);
        if (element !== null) return element;
      }
      return void 0;
    }

    // src/features/image-preview/image-click-zoom.ts
    var MIN_IMAGE_SIZE = 44;
    function findImage(target) {
      if (target instanceof HTMLImageElement) return target;
      const nested = target.closest("img");
      if (nested !== null) return nested;
      return target.closest("button")?.querySelector("img") ?? void 0;
    }
    function resolveClickedImage(target) {
      if (!(target instanceof Element)) return void 0;
      const image = findImage(target);
      if (image === void 0) return void 0;
      if (image.closest(LIGHTBOX_SELECTOR) !== null) return void 0;
      if (image.closest(CONVERSATION_SELECTOR) === null) return void 0;
      const source = image.currentSrc || image.src;
      if (source === "") return void 0;
      if (image.clientWidth < MIN_IMAGE_SIZE || image.clientHeight < MIN_IMAGE_SIZE) return void 0;
      if (image.naturalWidth < MIN_IMAGE_SIZE || image.naturalHeight < MIN_IMAGE_SIZE) return void 0;
      return image;
    }
    function installImageClickZoom(labels) {
      function handleClick(event) {
        const image = resolveClickedImage(event.target);
        if (image === void 0) return;
        event.preventDefault();
        event.stopPropagation();
        openImagePreview(image.currentSrc || image.src, image.alt, labels);
      }
      document.addEventListener("click", handleClick, true);
      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    }

    // src/features/image-preview/continuity.ts
    var FLOW_ITEM_SELECTOR = "[data-chat-flow-kind]";
    var FLOW_KIND_ATTRIBUTE = "data-chat-flow-kind";
    var FLOW_TURN_ATTRIBUTE = "data-chat-turn";
    var FLOW_KIND_TOOL_CALL = "tool-call";
    var hostRenderedPaths = /* @__PURE__ */ new Map();
    function registerHostRenderedImage(key, anchor) {
      hostRenderedPaths.set(key, anchor);
    }
    function hostRenderedAnchor(key) {
      const anchor = hostRenderedPaths.get(key);
      if (anchor === void 0) return void 0;
      if (anchor.isConnected) return anchor;
      hostRenderedPaths.delete(key);
      return void 0;
    }
    function isContinuous(a, b) {
      const flowA = a.closest(FLOW_ITEM_SELECTOR);
      const flowB = b.closest(FLOW_ITEM_SELECTOR);
      if (flowA === null || flowB === null) return false;
      if (flowA === flowB) return true;
      if (flowA.parentElement === null || flowA.parentElement !== flowB.parentElement) return false;
      if (flowA.getAttribute(FLOW_TURN_ATTRIBUTE) !== flowB.getAttribute(FLOW_TURN_ATTRIBUTE)) {
        return false;
      }
      const siblings = Array.from(flowA.parentElement.children);
      const indexA = siblings.indexOf(flowA);
      const indexB = siblings.indexOf(flowB);
      if (indexA < 0 || indexB < 0) return false;
      const start = Math.min(indexA, indexB);
      const end = Math.max(indexA, indexB);
      for (let index = start; index <= end; index += 1) {
        if (siblings[index].getAttribute(FLOW_KIND_ATTRIBUTE) !== FLOW_KIND_TOOL_CALL) return false;
      }
      return true;
    }

    // src/features/image-preview/preview.ts
    var PREVIEW_ATTRIBUTE = "data-dsh-image-preview";
    var WRAPPER_CLASS = "mt-2 flex flex-col items-start gap-2";
    var IMAGE_CLASS2 = "block max-h-[320px] max-w-full cursor-zoom-in rounded-lg border border-solid border-line4 bg-base object-contain";
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
    var warnedDecodeFailures = /* @__PURE__ */ new Set();
    var MAX_DECODE_WARNINGS = 100;
    var HOST_MESSAGE_ROW_SELECTOR = "[data-chat-anchor-key]";
    var TOOL_CALL_SELECTOR = "[data-tool]";
    var PRIVATE_ALIASES = ["/tmp", "/var", "/etc"];
    function canonicalPathKey(path) {
      for (const alias of PRIVATE_ALIASES) {
        if (path === alias || path.startsWith(`${alias}/`)) return `/private${path}`;
      }
      return path;
    }
    function previewScope(anchor) {
      return anchor.closest(TOOL_CALL_SELECTOR) ?? anchor.closest(HOST_MESSAGE_ROW_SELECTOR) ?? anchor;
    }
    function hasHostImage(anchor) {
      for (const image of previewScope(anchor).querySelectorAll("img")) {
        if (!isOwnPreviewNode(image)) return true;
      }
      return false;
    }
    function dedupeByCanonicalPath(paths) {
      const seen = /* @__PURE__ */ new Set();
      const unique = [];
      for (const path of paths) {
        const key = canonicalPathKey(path);
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(path);
      }
      return unique;
    }
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
        if (!warnedDecodeFailures.has(withoutPunctuation)) {
          if (warnedDecodeFailures.size >= MAX_DECODE_WARNINGS) warnedDecodeFailures.clear();
          warnedDecodeFailures.add(withoutPunctuation);
          console.warn("[image-preview] \u8DEF\u5F84\u4E0D\u662F\u5408\u6CD5 URI \u7F16\u7801\uFF0C\u6309\u539F\u6837\u4F7F\u7528:", withoutPunctuation, error);
        }
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
    function previewAnchor(block) {
      return block.closest(TOOL_CALL_SELECTOR) ?? block;
    }
    var previewOwners = /* @__PURE__ */ new Map();
    function releasePreviewOwnership(wrapper) {
      for (const [key, owner] of previewOwners) {
        if (owner === wrapper) previewOwners.delete(key);
      }
    }
    function dropContinuousPreview(key, hostAnchor) {
      const wrapper = previewOwners.get(key);
      if (wrapper === void 0) return;
      if (!wrapper.isConnected) {
        previewOwners.delete(key);
        return;
      }
      if (!isContinuous(wrapper, hostAnchor)) return;
      releasePreviewOwnership(wrapper);
      wrapper.remove();
    }
    function syncBlockPreviews(anchor, paths) {
      const existing = anchor.nextElementSibling;
      const wrapper = existing instanceof HTMLElement && existing.hasAttribute(PREVIEW_ATTRIBUTE) ? existing : void 0;
      const hostImage = hasHostImage(anchor);
      const hostImageAnchor = anchor.closest(TOOL_CALL_SELECTOR);
      if (hostImage && hostImageAnchor !== null) {
        for (const path of paths) {
          const key2 = canonicalPathKey(path);
          registerHostRenderedImage(key2, hostImageAnchor);
          dropContinuousPreview(key2, hostImageAnchor);
        }
      }
      const candidates = hostImage ? [] : dedupeByCanonicalPath(paths.filter((path) => !failedPaths.has(canonicalPathKey(path))));
      const usablePaths = candidates.filter((path) => {
        const key2 = canonicalPathKey(path);
        const hostAnchor = hostRenderedAnchor(key2);
        if (hostAnchor !== void 0 && isContinuous(anchor, hostAnchor)) return false;
        const owner = previewOwners.get(key2);
        if (owner === void 0 || owner === wrapper) return true;
        if (owner.isConnected) return false;
        previewOwners.delete(key2);
        return true;
      });
      const key = usablePaths.map(canonicalPathKey).sort().join("\n");
      if (wrapper !== void 0) {
        if (wrapper.dataset.previewKey === key) return;
        releasePreviewOwnership(wrapper);
        wrapper.remove();
      } else if (usablePaths.length === 0 && renderedBlockKeys.get(anchor) === key) {
        return;
      }
      const parent = anchor.parentElement;
      if (usablePaths.length === 0 || parent === null) {
        renderedBlockKeys.set(anchor, key);
        return;
      }
      const container = document.createElement("div");
      container.setAttribute(PREVIEW_ATTRIBUTE, "");
      container.dataset.previewKey = key;
      container.className = WRAPPER_CLASS;
      for (const path of usablePaths) {
        container.appendChild(createPreviewImage(path, container));
        previewOwners.set(canonicalPathKey(path), container);
      }
      applyDisclosureState(anchor, container);
      anchor.insertAdjacentElement("afterend", container);
    }
    function disclosureRoot(anchor) {
      const header = anchor.closest("[data-disclosure-header]") ?? anchor.querySelector("[data-disclosure-header]");
      return header?.parentElement ?? void 0;
    }
    function applyDisclosureState(anchor, container) {
      const root = disclosureRoot(anchor);
      container.style.display = root !== void 0 && !root.hasAttribute("data-open") ? "none" : "";
    }
    function syncDisclosurePreviews(root) {
      const collapsed = !root.hasAttribute("data-open");
      const toolCall = root.parentElement?.closest(TOOL_CALL_SELECTOR) ?? root.querySelector(TOOL_CALL_SELECTOR);
      const wrappers = /* @__PURE__ */ new Set();
      const anchored = toolCall?.nextElementSibling;
      if (anchored instanceof HTMLElement && anchored.hasAttribute(PREVIEW_ATTRIBUTE)) {
        wrappers.add(anchored);
      }
      for (const wrapper of root.querySelectorAll(`[${PREVIEW_ATTRIBUTE}]`)) {
        wrappers.add(wrapper);
      }
      for (const wrapper of wrappers) {
        if (collapsed) wrapper.style.display = "none";
        else wrapper.style.display = wrapper.childElementCount === 0 ? "none" : "";
      }
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
      image.className = IMAGE_CLASS2;
      image.addEventListener("error", () => {
        rememberFailedPath(path);
        image.remove();
        if (container.childElementCount === 0) container.style.display = "none";
      });
      return image;
    }
    function rememberFailedPath(path) {
      const key = canonicalPathKey(path);
      if (failedPaths.has(key)) return;
      if (failedPaths.size >= MAX_FAILED_PATHS) failedPaths.clear();
      failedPaths.add(key);
      console.warn("[image-preview] \u56FE\u7247\u8BFB\u53D6\u5931\u8D25\uFF0C\u5DF2\u505C\u6B62\u9884\u89C8:", path);
    }
    function isOwnPreviewNode(node) {
      const element = node instanceof HTMLElement ? node : node.parentElement;
      return element?.closest(`[${PREVIEW_ATTRIBUTE}]`) != null;
    }
    function disposePreviews() {
      closeImagePreview();
      previewOwners.clear();
      for (const element of document.querySelectorAll(`[${PREVIEW_ATTRIBUTE}]`)) element.remove();
    }

    // src/features/image-preview/observer.ts
    var MAX_NODES_PER_FRAME = 40;
    var MAX_PENDING_NODES = 4e3;
    var RELOCATE_INTERVAL_MS = 1500;
    function scanSubtree(root) {
      const scope = isChatFlowRegion(root) ? root : root.querySelector(CHAT_FLOW_SELECTOR);
      if (scope === null) return;
      const grouped = /* @__PURE__ */ new Map();
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node instanceof Element && isOwnPreviewNode(node)) return NodeFilter.FILTER_REJECT;
          return node.nodeType === Node.TEXT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      });
      for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const text = node;
        const paths = collectImagePaths(text.data);
        if (paths.length === 0) continue;
        const block = closestBlock(text.parentElement);
        if (block === void 0) continue;
        const anchor = previewAnchor(block);
        const known = grouped.get(anchor);
        if (known === void 0) {
          grouped.set(anchor, paths);
          continue;
        }
        for (const path of paths) {
          if (!known.includes(path)) known.push(path);
        }
      }
      for (const [anchor, paths] of grouped) syncBlockPreviews(anchor, paths);
    }
    function installImagePreviewObserver() {
      let container = findConversationContainer();
      const pending3 = /* @__PURE__ */ new Set();
      let frame = 0;
      let disposed = false;
      function flush() {
        if (container === void 0 || !container.isConnected) {
          pending3.clear();
          return;
        }
        const nodes = Array.from(pending3).slice(0, MAX_NODES_PER_FRAME);
        for (const node of nodes) pending3.delete(node);
        const blocks = /* @__PURE__ */ new Set();
        let rescanContainer = false;
        for (const node of nodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentElement;
            if (parent === null || !container.contains(parent) || isOwnPreviewNode(node)) continue;
            const block = closestBlock(parent);
            if (block !== void 0) blocks.add(previewAnchor(block));
            continue;
          }
          if (!(node instanceof Element) || isOwnPreviewNode(node)) continue;
          if (container.contains(node)) {
            const block = closestBlock(node);
            if (block !== void 0) {
              blocks.add(previewAnchor(block));
            }
            continue;
          }
          if (node.contains(container)) rescanContainer = true;
        }
        if (rescanContainer) {
          const chatFlow = container.querySelector(CHAT_FLOW_SELECTOR) ?? container;
          enqueueTree(chatFlow);
          schedule();
          return;
        }
        for (const block of blocks) scanSubtree(block);
      }
      function schedule() {
        if (disposed || frame !== 0) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          flush();
          if (pending3.size > 0) schedule();
        });
      }
      function trimPending() {
        if (pending3.size <= MAX_PENDING_NODES) return;
        let overflow = pending3.size - MAX_PENDING_NODES;
        for (const node of pending3) {
          if (overflow <= 0) break;
          pending3.delete(node);
          overflow -= 1;
        }
      }
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type === "attributes") {
            if (record.target instanceof Element) syncDisclosurePreviews(record.target);
            continue;
          }
          if (record.type === "characterData") {
            pending3.add(record.target);
            continue;
          }
          for (const node of record.addedNodes) pending3.add(node);
        }
        trimPending();
        schedule();
      });
      function enqueueTree(element) {
        if (element.children.length === 0) {
          pending3.add(element);
          return;
        }
        for (const child of element.children) pending3.add(child);
      }
      function attach() {
        if (container === void 0) return;
        observer.observe(container, {
          childList: true,
          characterData: true,
          subtree: true,
          // 折叠行的展开状态写在根节点的 data-open 上，只盯这一个属性
          attributes: true,
          attributeFilter: ["data-open"]
        });
        const chatFlow = container.querySelector(CHAT_FLOW_SELECTOR) ?? container;
        enqueueTree(chatFlow);
        schedule();
      }
      if (container !== void 0) attach();
      const relocateTimer = window.setInterval(() => {
        if (container !== void 0 && container.isConnected) return;
        observer.disconnect();
        container = findConversationContainer();
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
    function apply(ctx, t) {
      if (!readImagePreviewEnabled()) return;
      const labels = {
        dialog: t("lightboxDialog"),
        close: t("lightboxClose"),
        zoomIn: t("zoomIn"),
        zoomOut: t("zoomOut"),
        fit: t("fitWindow"),
        actual: t("actualSize"),
        loadFailed: t("loadFailed")
      };
      ctx.effect(() => installImagePreviewObserver(), "image-preview: observer");
      ctx.effect(() => installImageClickZoom(labels), "image-preview: zoom");
    }

    // src/features/image-preview/locales.ts
    var imagePreviewLocales = {
      zh: {
        // 开关标题
        title: "\u4F1A\u8BDD\u56FE\u7247\u9884\u89C8",
        // 开关用途说明：解释打开后会话里的哪些内容会出现预览，并点明只读
        description: "\u672C\u5730\u56FE\u7247\u5730\u5740\u4E0B\u65B9\u76F4\u63A5\u663E\u793A\u9884\u89C8\uFF0C\u70B9\u5F00\u540E\u53EF\u7F29\u653E\u770B\u6E05\u7EC6\u8282\uFF0C\u53EA\u8BFB\u53D6\u6587\u4EF6\uFF0C\u4E0D\u6539\u52A8\u4EFB\u4F55\u5185\u5BB9\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 放大层的无障碍名称，读屏软件据此说明当前是图片查看对话框
        lightboxDialog: "\u67E5\u770B\u56FE\u7247",
        // 放大层右上角关闭按钮的名称
        lightboxClose: "\u5173\u95ED",
        // 放大层工具栏的放大按钮名称
        zoomIn: "\u653E\u5927",
        // 放大层工具栏的缩小按钮名称
        zoomOut: "\u7F29\u5C0F",
        // 放大层工具栏的「适应窗口」按钮名称，点击后整图收进窗口
        fitWindow: "\u9002\u5E94\u7A97\u53E3",
        // 放大层工具栏的「原始大小」按钮名称，点击后按 1:1 像素显示
        actualSize: "\u539F\u59CB\u5927\u5C0F",
        // 放大层的图片读取失败提示
        loadFailed: "\u56FE\u7247\u8BFB\u53D6\u5931\u8D25"
      },
      en: {
        // Switch title
        title: "Inline image preview",
        // Switch description explaining what gets previewed, that images zoom, and that files stay untouched
        description: "Show previews under local image paths. Click to zoom into details; files are only read, never changed.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions.",
        // Accessible name of the zoom layer dialog
        lightboxDialog: "Image preview",
        // Name of the close button in the top-right corner of the zoom layer
        lightboxClose: "Close",
        // Name of the zoom-in button in the zoom layer toolbar
        zoomIn: "Zoom in",
        // Name of the zoom-out button in the zoom layer toolbar
        zoomOut: "Zoom out",
        // Name of the fit-to-window button in the zoom layer toolbar
        fitWindow: "Fit",
        // Name of the actual-size button in the zoom layer toolbar
        actualSize: "Actual size",
        // Shown when the image cannot be loaded in the zoom layer
        loadFailed: "Could not load the image"
      }
    };

    // src/features/image-preview/toggle.tsx
    var import_react2 = __toESM(require("react"), 1);
    function ImageIcon() {
      return /* @__PURE__ */ import_react2.default.createElement(
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
        /* @__PURE__ */ import_react2.default.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
        /* @__PURE__ */ import_react2.default.createElement("circle", { cx: "8.5", cy: "9.5", r: "1.5" }),
        /* @__PURE__ */ import_react2.default.createElement("path", { d: "m4 17 5-5 4 4 3-3 4 4" })
      );
    }
    function ImagePreviewToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react2.useState)(readImagePreviewEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react2.useState)(false);
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
      return /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react2.default.createElement(ImageIcon, null)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react2.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react2.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/image-preview/index.tsx
    var imagePreviewFeature = {
      id: "image-preview",
      group: "conversation",
      order: 20,
      reloadsPage: true,
      switch: ImagePreviewToggle,
      client: { apply },
      locales: imagePreviewLocales
    };
    var image_preview_default = imagePreviewFeature;

    // src/features/clear-session/client.tsx
    var import_react5 = __toESM(require("react"), 1);

    // src/features/clear-session/clear-tooltip.ts
    var TOOLTIP_CLASS = "aio-clear-session-tooltip";
    var STYLE_ID = "aio-clear-session-tooltip-style";
    var SHOW_DELAY_MS = 500;
    var GAP_PX = 8;
    var EDGE_PX = 12;
    var STYLE_TEXT = `
    .${TOOLTIP_CLASS} {
      display: none;
      position: fixed;
      z-index: 1100;
      width: max-content;
      max-width: min(50vw, calc(100vw - 24px));
      box-sizing: border-box;
      padding: 3px 7px;
      border-radius: var(--dsw-radius-sm, 6px);
      background: var(--dsw-alias-tooltip-bg, #1f2329);
      color: var(--dsw-alias-tooltip-label, #ffffff);
      font-size: 13px;
      line-height: 20px;
      white-space: pre-line;
      overflow-wrap: break-word;
      pointer-events: none;
      animation: aio-clear-session-tooltip-in 150ms ease;
    }
    @keyframes aio-clear-session-tooltip-in {
      from { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .${TOOLTIP_CLASS} { animation: none; }
    }
    `;
    var bubble = null;
    function ensureStyle() {
      if (document.getElementById(STYLE_ID) !== null) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = STYLE_TEXT;
      document.head.appendChild(style);
    }
    function ensureBubble() {
      if (bubble !== null && bubble.isConnected) return bubble;
      const created = document.createElement("span");
      created.className = TOOLTIP_CLASS;
      created.setAttribute("role", "tooltip");
      document.body.appendChild(created);
      bubble = created;
      return created;
    }
    function place(element, anchor) {
      const rect = anchor.getBoundingClientRect();
      const width = element.offsetWidth;
      const half = width / 2;
      const center = Math.min(
        Math.max(rect.left + rect.width / 2, EDGE_PX + half),
        window.innerWidth - EDGE_PX - half
      );
      const above = rect.top - GAP_PX >= element.offsetHeight;
      element.style.left = `${center}px`;
      element.style.top = `${above ? rect.top - GAP_PX : rect.bottom + GAP_PX}px`;
      element.style.transform = above ? "translate(-50%, -100%)" : "translate(-50%, 0)";
    }
    function attachTooltip(anchor, readLabel) {
      ensureStyle();
      let timer = null;
      const hide = () => {
        if (timer !== null) {
          window.clearTimeout(timer);
          timer = null;
        }
        if (bubble !== null) bubble.style.display = "none";
      };
      const reveal = () => {
        timer = null;
        const label = readLabel();
        if (label.length === 0) return;
        const element = ensureBubble();
        element.textContent = label;
        element.style.display = "block";
        place(element, anchor);
      };
      const schedule = () => {
        hide();
        timer = window.setTimeout(reveal, SHOW_DELAY_MS);
      };
      anchor.addEventListener("pointerenter", schedule);
      anchor.addEventListener("pointerleave", hide);
      anchor.addEventListener("focus", schedule);
      anchor.addEventListener("blur", hide);
      anchor.addEventListener("pointerdown", hide);
      return () => {
        hide();
        anchor.removeEventListener("pointerenter", schedule);
        anchor.removeEventListener("pointerleave", hide);
        anchor.removeEventListener("focus", schedule);
        anchor.removeEventListener("blur", hide);
        anchor.removeEventListener("pointerdown", hide);
        if (bubble !== null) {
          bubble.remove();
          bubble = null;
        }
      };
    }

    // src/features/clear-session/clear-button.ts
    var BUTTON_ATTRIBUTE = "data-aio-clear-session";
    var STYLE_ID2 = "aio-clear-session-style";
    var BUTTON_CLASS = "aio-clear-session";
    var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    var STYLE_TEXT2 = `
    .${BUTTON_CLASS} {
      display: grid;
      place-items: center;
      flex: none;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      corner-shape: round;
      background: var(--dsw-specific-selector, var(--dsw-alias-bg-layer-2));
      color: var(--dsw-alias-label-primary, currentColor);
      cursor: pointer;
    }
    @media (hover: hover) {
      .${BUTTON_CLASS}:hover:not(:disabled) {
        background: var(--dsw-alias-interactive-bg-hover-solid, var(--dsw-specific-selector));
      }
    }
    .${BUTTON_CLASS} svg {
      display: block;
    }
    `;
    function createClearIcon() {
      const svg = document.createElementNS(SVG_NAMESPACE, "svg");
      svg.setAttribute("width", "14");
      svg.setAttribute("height", "14");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.5");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("aria-hidden", "true");
      const ring = document.createElementNS(SVG_NAMESPACE, "path");
      ring.setAttribute("d", "M8 3.2a4.8 4.8 0 1 1-4.8 4.8");
      svg.appendChild(ring);
      const bar = document.createElementNS(SVG_NAMESPACE, "path");
      bar.setAttribute("d", "M5.9 8h4.2");
      svg.appendChild(bar);
      return svg;
    }
    function ensureStyle2() {
      if (document.getElementById(STYLE_ID2) !== null) return;
      const style = document.createElement("style");
      style.id = STYLE_ID2;
      style.textContent = STYLE_TEXT2;
      document.head.appendChild(style);
    }
    function findToolbars() {
      const toolbars = [];
      for (const input of document.querySelectorAll('input[type="file"]')) {
        const parent = input.parentElement;
        if (parent === null) continue;
        if (parent.querySelector("button") === null) continue;
        if (parent.querySelector(`[${BUTTON_ATTRIBUTE}]`) !== null) continue;
        toolbars.push(parent);
      }
      return toolbars;
    }
    function installClearButton(options) {
      ensureStyle2();
      const buttons = /* @__PURE__ */ new Set();
      const detachers = /* @__PURE__ */ new Map();
      let frame = 0;
      let scheduled = false;
      let disposed = false;
      const pruneButtons = () => {
        for (const button of buttons) {
          if (button.isConnected) continue;
          detachers.get(button)?.();
          detachers.delete(button);
          buttons.delete(button);
        }
      };
      const scan = () => {
        frame = 0;
        scheduled = false;
        if (disposed) return;
        pruneButtons();
        for (const toolbar of findToolbars()) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = BUTTON_CLASS;
          button.setAttribute(BUTTON_ATTRIBUTE, "");
          button.appendChild(createClearIcon());
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const target = options.readTarget();
            if (target === void 0) return;
            options.onRequest(target);
          });
          button.setAttribute("aria-label", options.label);
          detachers.set(button, attachTooltip(button, () => options.label));
          toolbar.insertBefore(button, toolbar.firstElementChild);
          buttons.add(button);
        }
      };
      const schedule = () => {
        if (scheduled || disposed) return;
        scheduled = true;
        frame = window.requestAnimationFrame(scan);
      };
      const observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
      schedule();
      return () => {
        disposed = true;
        observer.disconnect();
        if (frame !== 0) window.cancelAnimationFrame(frame);
        for (const button of buttons) {
          detachers.get(button)?.();
          button.remove();
        }
        detachers.clear();
        buttons.clear();
        document.getElementById(STYLE_ID2)?.remove();
      };
    }

    // src/features/clear-session/api.ts
    var ENDPOINT = "/dsh-all-in-one/sessions";
    var REQUEST_TIMEOUT_MS = 15e3;
    var CANCEL_ENDPOINT = "/dsh-all-in-one/session/cancel";
    var CANCEL_TIMEOUT_MS = 5e3;
    async function requestDeleteSession(sessionId) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
          signal: controller.signal
        });
        if (!response.ok) {
          if (response.status === 404) {
            console.info("[clear-session] \u65E7\u4F1A\u8BDD\u5DF2\u4E0D\u5B58\u5728\uFF0C\u6309\u5DF2\u6E05\u7A7A\u5904\u7406:", sessionId);
            return;
          }
          const text = await response.text();
          let message = `HTTP ${response.status}`;
          try {
            const parsed = JSON.parse(text);
            if (typeof parsed.error === "string") message = parsed.error;
            else console.error("[clear-session] \u5BBF\u4E3B\u8FD4\u56DE\u4E86\u975E\u9884\u671F\u9519\u8BEF\u4F53:", text);
          } catch (error) {
            console.error("[clear-session] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error, text);
          }
          throw new Error(message);
        }
        const payload = await response.json();
        if (payload.deleted !== true) throw new Error(payload.error ?? "\u5BBF\u4E3B\u672A\u786E\u8BA4\u5220\u9664");
      } catch (error) {
        console.error("[clear-session] \u8BF7\u6C42\u5BBF\u4E3B\u5220\u9664\u4F1A\u8BDD\u5931\u8D25:", sessionId, error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    async function requestCancelSession(sessionId) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), CANCEL_TIMEOUT_MS);
      try {
        const response = await fetch(new URL(CANCEL_ENDPOINT, window.location.origin).toString(), {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
          signal: controller.signal
        });
        if (response.status === 404) {
          console.info("[clear-session] \u4F1A\u8BDD\u672A\u5728\u8FD0\u884C\uFF0C\u65E0\u9700\u505C\u6B62:", sessionId);
          return;
        }
        if (!response.ok) {
          const text = await response.text();
          let message = `HTTP ${response.status}`;
          try {
            const parsed = JSON.parse(text);
            if (typeof parsed.error === "string") message = parsed.error;
            else console.error("[clear-session] \u505C\u6B62\u63A5\u53E3\u8FD4\u56DE\u4E86\u975E\u9884\u671F\u9519\u8BEF\u4F53:", text);
          } catch (error) {
            console.error("[clear-session] \u89E3\u6790\u505C\u6B62\u63A5\u53E3\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error, text);
          }
          throw new Error(message);
        }
      } catch (error) {
        console.error("[clear-session] \u8BF7\u6C42\u5BBF\u4E3B\u505C\u6B62\u4EFB\u52A1\u5931\u8D25:", sessionId, error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }

    // src/features/clear-session/clear-session.ts
    var DETACH_TIMEOUT_MS = 1500;
    var DETACH_POLL_MS = 50;
    var STOP_TIMEOUT_MS = 8e3;
    var STOP_POLL_MS = 100;
    function findCurrentSession(deps) {
      const state = deps.sessions.list.getSnapshot();
      const sessionId = state.ids.find((id) => (state.byId[id]?.retainedBy?.mainView ?? 0) > 0);
      if (sessionId === void 0) return void 0;
      const summary = state.byId[sessionId];
      const workspaceId = deps.uiWorkspace?.workspaces?.list.getSnapshot().items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId;
      return {
        sessionId,
        workspaceId,
        cwd: summary?.cwd,
        running: summary?.running === true
      };
    }
    async function prepareBlank(deps, target) {
      const create = async () => {
        if (typeof deps.sessions.create !== "function") return void 0;
        try {
          return await deps.sessions.create({
            ...target.workspaceId === void 0 ? {} : { workspaceId: target.workspaceId },
            ...target.cwd === void 0 ? {} : { cwd: target.cwd }
          });
        } catch (error) {
          console.error("[clear-session] \u65B0\u5EFA\u7A7A\u767D\u4F1A\u8BDD\u5931\u8D25:", error);
          throw error;
        }
      };
      if (target.workspaceId !== void 0 && typeof deps.uiWorkspace?.connectWorkspace === "function") {
        try {
          const reused = await deps.uiWorkspace.connectWorkspace(target.workspaceId);
          if (reused !== target.sessionId) return reused;
        } catch (error) {
          console.error("[clear-session] \u590D\u7528\u7A7A\u767D\u4F1A\u8BDD\u5931\u8D25\uFF0C\u6539\u7528\u65B0\u5EFA:", error);
        }
      }
      return await create();
    }
    async function waitDetached(sessions, sessionId) {
      const startedAt = Date.now();
      while (Date.now() - startedAt < DETACH_TIMEOUT_MS) {
        const summary = sessions.list.getSnapshot().byId[sessionId];
        if (summary === void 0 || (summary.retainedBy?.mainView ?? 0) === 0) return;
        await new Promise((resolve) => {
          window.setTimeout(resolve, DETACH_POLL_MS);
        });
      }
      console.warn("[clear-session] \u7B49\u5F85\u4E3B\u89C6\u56FE\u91CA\u653E\u65E7\u4F1A\u8BDD\u8D85\u65F6\uFF0C\u7EE7\u7EED\u5904\u7406:", sessionId);
    }
    async function waitStopped(sessions, sessionId, timeoutMessage) {
      const deadline = Date.now() + STOP_TIMEOUT_MS;
      while (Date.now() < deadline) {
        const summary = sessions.list.getSnapshot().byId[sessionId];
        if (summary === void 0 || summary.running !== true) return;
        await new Promise((resolve) => {
          window.setTimeout(resolve, STOP_POLL_MS);
        });
      }
      throw new Error(timeoutMessage);
    }
    async function stopRunningTurn(deps, target) {
      try {
        await requestCancelSession(target.sessionId);
      } catch (error) {
        console.warn("[clear-session] \u8BF7\u6C42\u505C\u6B62\u4EFB\u52A1\u5931\u8D25\uFF0C\u6539\u4E3A\u7B49\u5F85\u5B9E\u9645\u505C\u6B62:", target.sessionId, error);
      }
      await waitStopped(deps.sessions, target.sessionId, deps.stopTimeoutMessage);
    }
    async function clearSession(deps, target, action) {
      if (action === "delete" && target.running) await stopRunningTurn(deps, target);
      const nextId = await prepareBlank(deps, target);
      if (nextId !== void 0) deps.uiWorkspace?.openSession?.(nextId);
      else deps.uiWorkspace?.startSession?.(target.workspaceId);
      if (action === "keep") return nextId;
      await waitDetached(deps.sessions, target.sessionId);
      await requestDeleteSession(target.sessionId);
      deps.sessions.handleSessionRemoved?.(target.sessionId);
      return nextId;
    }

    // src/features/clear-session/ClearSessionDialog.tsx
    var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react4 = __toESM(require("react"), 1);

    // src/components/Button.tsx
    var import_react3 = __toESM(require("react"), 1);
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
      return /* @__PURE__ */ import_react3.default.createElement(
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

    // src/features/clear-session/ClearSessionDialog.tsx
    var useNoTarget = (() => null);
    function ClearSessionDialog({ t, useTarget, clear, settle }) {
      const [pending3, setPending] = (0, import_react4.useState)(null);
      const [error, setError] = (0, import_react4.useState)(null);
      const readTarget = useTarget ?? useNoTarget;
      const target = readTarget((value) => value);
      const targetKey = target?.sessionId ?? "";
      (0, import_react4.useEffect)(() => {
        setError(null);
      }, [targetKey]);
      if (target === null) return null;
      const busy = pending3 !== null;
      const close = () => {
        if (busy) return;
        setError(null);
        settle?.();
      };
      const run = async (action) => {
        if (busy) return;
        setPending(action);
        setError(null);
        try {
          await clear?.(target, action);
        } catch (failure) {
          console.error("[clear-session] \u5904\u7406\u5931\u8D25:", action, failure);
          setPending(null);
          setError(`${t("failed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
          return;
        }
        setPending(null);
        settle?.();
      };
      return /* @__PURE__ */ import_react4.default.createElement(
        import_dsh_client_ui_primitives.Modal,
        {
          open: true,
          onClose: close,
          closeLabel: t("cancel"),
          title: t("dialogTitle"),
          description: t("dialogMessage"),
          footer: /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex w-full items-center justify-between" }, /* @__PURE__ */ import_react4.default.createElement(Button, { variant: "outline", disabled: busy, onClick: close }, t("cancel")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react4.default.createElement(
            Button,
            {
              variant: "outline",
              "data-modal-autofocus": "",
              disabled: busy,
              onClick: () => void run("keep")
            },
            pending3 === "keep" ? t("processing") : t("keepAction")
          ), /* @__PURE__ */ import_react4.default.createElement(
            Button,
            {
              variant: "danger",
              disabled: busy,
              onClick: () => void run("delete")
            },
            pending3 === "delete" ? t("processing") : t("deleteAction")
          ))))
        },
        /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-3 text-[12px] leading-[18px] text-secondary" }, t("keepHint")),
        /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, t("deleteHint")),
        target.running ? /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-warn", role: "alert" }, t("runningHint")) : null,
        error !== null ? /* @__PURE__ */ import_react4.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-danger", role: "alert" }, error) : null
      );
    }

    // src/features/clear-session/dialog-store.ts
    var listeners = /* @__PURE__ */ new Set();
    var pending = null;
    function notify() {
      for (const listener of [...listeners]) {
        try {
          listener();
        } catch (error) {
          console.error("[clear-session] \u786E\u8BA4\u5F39\u7A97\u8BA2\u9605\u8005\u5904\u7406\u5931\u8D25:", error);
        }
      }
    }
    var clearSessionStore = {
      getSnapshot: () => pending,
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      request(target) {
        pending = target;
        notify();
      },
      settle() {
        if (pending === null) return;
        pending = null;
        notify();
      }
    };

    // src/features/clear-session/storage.ts
    var CLEAR_SESSION_STORAGE_KEY = "dsh-all-in-one:clear-session";
    function readClearSessionEnabled() {
      try {
        return window.localStorage.getItem(CLEAR_SESSION_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[clear-session] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }
    function writeClearSessionEnabled(enabled) {
      try {
        window.localStorage.setItem(CLEAR_SESSION_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[clear-session] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/clear-session/client.tsx
    var OVERLAY_SLOT = "shell.overlay";
    function apply2(ctx, t) {
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
        const runClear = async (target, action) => clearSession({ sessions, uiWorkspace, stopTimeoutMessage: t("stopTimeout") }, target, action);
        ctx.slots.inject(
          OVERLAY_SLOT,
          () => ctx.slots.register(
            {
              name: OVERLAY_SLOT,
              id: "clear-session-confirm",
              inject: () => ({
                hooks: { target: clearSessionStore },
                clear: runClear,
                settle: clearSessionStore.settle
              })
            },
            (props) => /* @__PURE__ */ import_react5.default.createElement(
              ClearSessionDialog,
              {
                ...props,
                t
              }
            )
          )
        );
        if (!readClearSessionEnabled()) return;
        ctx.effect(
          () => installClearButton({
            label: t("action"),
            readTarget: () => findCurrentSession({ sessions, uiWorkspace }),
            onRequest: (target) => clearSessionStore.request(target)
          }),
          "clear-session: input button"
        );
      });
    }

    // src/features/clear-session/locales.ts
    var clearSessionLocales = {
      zh: {
        // 开关标题
        title: "\u6E05\u7A7A\u4F1A\u8BDD",
        // 开关用途说明：点明入口位置与两个可选结果
        description: "\u8F93\u5165\u6846\u5DE6\u4FA7\u65B0\u589E\u6309\u94AE\uFF0C\u786E\u8BA4\u540E\u5728\u540C\u4E00\u5DE5\u4F5C\u533A\u6253\u5F00\u4E00\u6761\u7A7A\u767D\u5BF9\u8BDD\uFF0C\u53EF\u9009\u62E9\u4FDD\u7559\u8FD8\u662F\u5220\u9664\u5F53\u524D\u4F1A\u8BDD\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 输入框按钮的名称与悬停提示
        action: "\u5F00\u542F\u65B0\u4F1A\u8BDD",
        // 当前对话正在执行任务时的提示：按钮悬停与弹窗内都会显示，点明保留不停、删除先停
        runningHint: "\u5F53\u524D\u4F1A\u8BDD\u6B63\u5728\u6267\u884C\u4EFB\u52A1\uFF1A\u300C\u76F4\u63A5\u5F00\u542F\u300D\u8BA9\u5B83\u7EE7\u7EED\u5728\u540E\u53F0\u8FD0\u884C\uFF0C\u300C\u5220\u9664\u672C\u6B21\u4F1A\u8BDD\u300D\u4F1A\u5148\u505C\u6B62\u5B83\u3002",
        // 确认弹窗标题
        dialogTitle: "\u5F00\u542F\u65B0\u4F1A\u8BDD",
        // 确认弹窗说明：点明动作结果是换一条新对话
        dialogMessage: "\u5C06\u5728\u540C\u4E00\u5DE5\u4F5C\u533A\u6253\u5F00\u4E00\u6761\u65B0\u7684\u7A7A\u767D\u5BF9\u8BDD\u3002",
        // 「直接开启」按钮：开新对话，当前会话原样不动
        keepAction: "\u76F4\u63A5\u5F00\u542F",
        // 「直接开启」的含义说明
        keepHint: "\u5F53\u524D\u4F1A\u8BDD\u4FDD\u6301\u4E0D\u53D8\uFF0C\u4ECD\u7559\u5728\u4F1A\u8BDD\u5217\u8868\u91CC\u3002",
        // 「删除本次会话」按钮：开新对话，并删掉当前会话
        deleteAction: "\u5220\u9664\u672C\u6B21\u4F1A\u8BDD",
        // 「删除本次会话」的含义说明
        deleteHint: "\u5F53\u524D\u4F1A\u8BDD\u53CA\u5176\u672C\u5730\u8BB0\u5F55\u4F1A\u88AB\u6C38\u4E45\u5220\u9664\uFF0C\u65E0\u6CD5\u6062\u590D\u3002",
        // 弹窗取消按钮
        cancel: "\u53D6\u6D88",
        // 任一动作执行中，按钮显示的进行态文字
        processing: "\u5904\u7406\u4E2D\u2026",
        // 停止任务超时（等不到运行标记落下）时的提示
        stopTimeout: "\u4EFB\u52A1\u672A\u80FD\u53CA\u65F6\u505C\u6B62\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
        // 操作失败的提示前缀，后面拼接宿主返回的原因
        failed: "\u64CD\u4F5C\u5931\u8D25"
      },
      en: {
        // Switch title
        title: "Clear session",
        // Switch description: entry position and the two possible outcomes
        description: "Adds a button left of the composer. Confirming opens a blank conversation in the same workspace, keeping or deleting the current one.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check the browser storage permission.",
        // Composer button label and hover tooltip
        action: "Start a new session",
        // Shown both as the button tooltip and inside the dialog while the conversation works:
        // start-now leaves the turn running, delete-this-session stops it first
        runningHint: 'This session is still working: "Start now" leaves it running in the background, "Delete this session" stops it first.',
        // Dialog title
        dialogTitle: "Start a new session",
        // Dialog message: the action opens another conversation
        dialogMessage: "A new blank conversation opens in the same workspace.",
        // Start button: open a new conversation without touching the current one
        keepAction: "Start now",
        // What starting without deleting means
        keepHint: "The current session stays unchanged and remains in the session list.",
        // Delete button: open a new conversation and remove the current session
        deleteAction: "Delete this session",
        // What deleting the current session means
        deleteHint: "The current session and its local records are deleted permanently.",
        // Dialog cancel button
        cancel: "Cancel",
        // Text shown on the pressed button while the action runs
        processing: "Working\u2026",
        // Shown when the running turn does not settle within the stop timeout
        stopTimeout: "The task did not stop in time. Please try again.",
        // Failure prefix followed by the reason returned by the host
        failed: "Failed"
      }
    };

    // src/features/clear-session/toggle.tsx
    var import_react6 = __toESM(require("react"), 1);
    function ClearIcon() {
      return /* @__PURE__ */ import_react6.default.createElement(
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
        /* @__PURE__ */ import_react6.default.createElement("path", { d: "M12 4.8a7.2 7.2 0 1 1-7.2 7.2" }),
        /* @__PURE__ */ import_react6.default.createElement("path", { d: "M8.9 12h6.2" })
      );
    }
    function ClearSessionToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react6.useState)(readClearSessionEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react6.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeClearSessionEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react6.default.createElement(ClearIcon, null)), /* @__PURE__ */ import_react6.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react6.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react6.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react6.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react6.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/clear-session/index.tsx
    var clearSessionFeature = {
      id: "clear-session",
      group: "conversation",
      order: 30,
      reloadsPage: true,
      switch: ClearSessionToggle,
      client: { apply: apply2 },
      locales: clearSessionLocales
    };
    var clear_session_default = clearSessionFeature;

    // src/features/queue-edit/queue-edit.ts
    var DOCK_SELECTOR = "[data-queue-dock]";
    var SESSION_SELECTOR = "[data-conversation-session]";
    var PENDING_ROW_ATTRIBUTE = "data-submission-echo";
    var BUTTON_ATTRIBUTE2 = "data-aio-queue-edit";
    var HIDDEN_ATTRIBUTE = "data-aio-queue-edit-hidden";
    var HOST_ACTION_COUNT = 3;
    function findActions(row) {
      for (const child of row.children) {
        if (child instanceof HTMLElement && child.querySelector("button") !== null) return child;
      }
      return void 0;
    }
    function visibleRows(dock) {
      return [...dock.querySelectorAll("li")].filter((row) => !row.hasAttribute(PENDING_ROW_ATTRIBUTE));
    }
    function createButton2(hostEdit, label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = hostEdit.className;
      button.setAttribute(BUTTON_ATTRIBUTE2, "");
      button.setAttribute("aria-label", label);
      button.title = label;
      for (const child of hostEdit.childNodes) button.appendChild(child.cloneNode(true));
      return button;
    }
    function installQueueEdit(options) {
      const injected = /* @__PURE__ */ new Set();
      const hidden = /* @__PURE__ */ new Map();
      let frame = 0;
      let scheduled = false;
      let disposed = false;
      const prune = () => {
        for (const button of injected) {
          if (!button.isConnected) injected.delete(button);
        }
        for (const [button, display] of hidden) {
          if (button.isConnected) continue;
          button.style.display = display;
          button.removeAttribute(HIDDEN_ATTRIBUTE);
          hidden.delete(button);
        }
      };
      const injectRow = (dock, row) => {
        if (row.querySelector(`[${BUTTON_ATTRIBUTE2}]`) !== null) return;
        const actions = findActions(row);
        if (actions === void 0) return;
        const hostButtons = [...actions.querySelectorAll("button")].filter((button2) => !button2.hasAttribute(BUTTON_ATTRIBUTE2));
        if (hostButtons.length < HOST_ACTION_COUNT) return;
        const hostEdit = hostButtons[0];
        if (hostEdit === void 0) return;
        const button = createButton2(hostEdit, options.label);
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void recall(button, row, dock);
        });
        if (!hostEdit.hasAttribute(HIDDEN_ATTRIBUTE)) {
          const display = hostEdit.style.display;
          hostEdit.setAttribute(HIDDEN_ATTRIBUTE, display);
          hostEdit.style.display = "none";
          hidden.set(hostEdit, display);
        }
        actions.insertBefore(button, actions.firstChild);
        injected.add(button);
      };
      const recall = async (button, row, dock) => {
        if (button.disabled) return;
        const sessionId = dock.closest(SESSION_SELECTOR)?.getAttribute("data-conversation-session") ?? "";
        if (sessionId === "") {
          console.error("[queue-edit] \u65E0\u6CD5\u4ECE\u6392\u961F\u6761\u5B9A\u4F4D\u4F1A\u8BDD:", dock);
          return;
        }
        const index = visibleRows(dock).indexOf(row);
        if (index < 0) return;
        button.disabled = true;
        try {
          await options.run(sessionId, index);
        } catch (error) {
          console.error("[queue-edit] \u64A4\u56DE\u6392\u961F\u6D88\u606F\u65F6\u53D1\u751F\u672A\u5904\u7406\u7684\u9519\u8BEF:", error);
        } finally {
          if (button.isConnected) button.disabled = false;
        }
      };
      const scan = () => {
        frame = 0;
        scheduled = false;
        if (disposed) return;
        prune();
        for (const dock of document.querySelectorAll(DOCK_SELECTOR)) {
          for (const row of visibleRows(dock)) injectRow(dock, row);
        }
      };
      const schedule = () => {
        if (scheduled || disposed) return;
        scheduled = true;
        frame = window.requestAnimationFrame(scan);
      };
      const touchesDock = (record) => {
        if (record.target instanceof Element && record.target.closest(DOCK_SELECTOR) !== null) return true;
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(DOCK_SELECTOR) || node.querySelector(DOCK_SELECTOR) !== null) return true;
        }
        return false;
      };
      const observer = new MutationObserver((records) => {
        if (!records.some(touchesDock)) return;
        schedule();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      schedule();
      return () => {
        disposed = true;
        observer.disconnect();
        if (frame !== 0) window.cancelAnimationFrame(frame);
        for (const button of injected) button.remove();
        injected.clear();
        for (const [button, display] of hidden) {
          button.style.display = display;
          button.removeAttribute(HIDDEN_ATTRIBUTE);
        }
        hidden.clear();
      };
    }

    // src/features/queue-edit/recall.ts
    var IMAGE_EXTENSIONS = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif"
    };
    async function recallQueuedMessage(deps, sessionId, index) {
      const binding = deps.sessions.binding?.(sessionId);
      if (binding === void 0) return "failed";
      const conversation = resolveScopedConversation(deps, sessionId);
      if (conversation === void 0) {
        console.error("[queue-edit] \u53D6\u4E0D\u5230\u4F1A\u8BDD\u4F5C\u7528\u57DF\u91CC\u7684\u5BF9\u8BDD\u670D\u52A1\uFF0C\u65E0\u6CD5\u64A4\u56DE\u6392\u961F\u6D88\u606F:", sessionId);
        return "failed";
      }
      const item = readVisibleQueue(binding)[index];
      if (item === void 0) return "failed";
      const plan = readQueuePlan(item);
      if (plan === void 0) return "unsupported";
      let files;
      try {
        files = await readImageFiles(binding.session, plan.images);
      } catch (error) {
        console.error("[queue-edit] \u8BFB\u53D6\u6392\u961F\u6D88\u606F\u91CC\u7684\u56FE\u7247\u5931\u8D25:", error);
        return "failed";
      }
      const restored = restoreDraft(conversation, binding, sessionId, plan.text, files);
      if (restored !== "ready") return restored;
      try {
        await conversation.updateQueue(item.id, { kind: "remove" });
      } catch (error) {
        console.error("[queue-edit] \u64A4\u56DE\u6392\u961F\u6D88\u606F\u5931\u8D25:", error);
        return "failed";
      }
      return "applied";
    }
    function resolveScopedConversation(deps, sessionId) {
      const scope = deps.sessions.scope?.(sessionId);
      if (scope === void 0) return void 0;
      const conversation = scope.get("conversation");
      return typeof conversation === "object" && conversation !== null ? conversation : void 0;
    }
    function readVisibleQueue(binding) {
      const inbox = binding.session.projections.faceOf("inbox").getSnapshot();
      const rows = isInboxSnapshot(inbox) ? inbox["next-turn"] ?? [] : [];
      const inChat = new Set(binding.session.getSnapshot().pendingSubmissions.filter((submission) => submission.placement === "transcript").map((submission) => submission.requestId));
      return rows.filter((row) => {
        const source = row.source;
        return source?.kind !== "user" || source.rpcId === void 0 || !inChat.has(source.rpcId);
      });
    }
    function isInboxSnapshot(value) {
      return typeof value === "object" && value !== null && Array.isArray(value["next-turn"]);
    }
    function readQueuePlan(item) {
      let text = "";
      const images = [];
      for (const block of item.content) {
        if (block.type === "text") {
          text += block.text ?? "";
          continue;
        }
        if (block.type !== "image") return void 0;
        const attachment = asImageRef(block.attachment);
        if (attachment === void 0) return void 0;
        images.push(attachment);
      }
      return { text, images };
    }
    function asImageRef(value) {
      if (value === void 0 || value.mediaType === void 0) return void 0;
      if (value.bytes === void 0 || value.width === void 0 || value.height === void 0) return void 0;
      return value;
    }
    async function readImageFiles(session, images) {
      const files = [];
      for (const [index, attachment] of images.entries()) {
        const result = await session.readAttachment(attachment);
        if (!result.ok || result.value === void 0) {
          throw new Error(`readAttachment failed: ${result.error?.message ?? "unknown error"}`);
        }
        const resolved = result.value.attachment;
        const extension = IMAGE_EXTENSIONS[resolved.mediaType] ?? "png";
        const name = resolved.name ?? `image-${index + 1}.${extension}`;
        files.push(new File([Uint8Array.from(result.value.data)], name, { type: resolved.mediaType }));
      }
      return files;
    }
    function restoreDraft(conversation, binding, sessionId, text, files) {
      const input = conversation.input.for(binding.ctx);
      if (input.state.getSnapshot().phase !== "plain") return "busy";
      const current = input.state.getSnapshot().attachmentIds;
      for (const id of current) {
        if (!input.removeAttachment(id)) continue;
        conversation.releaseDraftAttachment(id);
      }
      input.setDraft(text);
      input.focus();
      if (files.length === 0) return "ready";
      const ordinary = binding.session.getSnapshot().subagent === null;
      let drafts;
      try {
        drafts = conversation.createDrafts(sessionId, files, ordinary);
      } catch (error) {
        console.error("[queue-edit] \u628A\u56FE\u7247\u767B\u8BB0\u4E3A\u8349\u7A3F\u9644\u4EF6\u5931\u8D25:", error);
        return "imageFailed";
      }
      if (input.addAttachments(drafts.map((draft) => draft.id))) return "ready";
      for (const draft of drafts) conversation.releaseDraftAttachment(draft.id);
      return "busy";
    }

    // src/features/queue-edit/storage.ts
    var QUEUE_EDIT_STORAGE_KEY = "dsh-all-in-one:queue-edit";
    function readQueueEditEnabled() {
      try {
        return window.localStorage.getItem(QUEUE_EDIT_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[queue-edit] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }
    function writeQueueEditEnabled(enabled) {
      try {
        window.localStorage.setItem(QUEUE_EDIT_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[queue-edit] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/queue-edit/client.tsx
    function noticeKeyOf(outcome) {
      switch (outcome) {
        case "applied":
          return void 0;
        case "unsupported":
          return { level: "info", key: "unsupported" };
        case "busy":
          return { level: "error", key: "unavailable" };
        case "imageFailed":
          return { level: "error", key: "imageFailed" };
        case "failed":
          return { level: "error", key: "failed" };
      }
    }
    function apply3(ctx, t) {
      if (!readQueueEditEnabled()) return;
      ctx.inject(["sessions", "conversation"], (scoped) => {
        const sessions = scoped.sessions;
        const conversation = scoped.conversation;
        if (sessions === void 0 || conversation === void 0) return;
        const notify4 = (sessionId, level, text) => {
          const binding = sessions.binding?.(sessionId);
          if (binding === void 0) return;
          try {
            conversation.input.for(binding.ctx).notify(level, text);
          } catch (error) {
            console.error("[queue-edit] \u5199\u5165\u8F93\u5165\u6846\u63D0\u793A\u5931\u8D25:", error);
          }
        };
        ctx.effect(
          () => installQueueEdit({
            label: t("recall"),
            run: async (sessionId, index) => {
              const outcome = await recallQueuedMessage({ sessions, conversation }, sessionId, index);
              const notice = noticeKeyOf(outcome);
              if (notice === void 0) return;
              notify4(sessionId, notice.level, t(notice.key));
            }
          }),
          "queue-edit: dock buttons"
        );
      });
    }

    // src/features/queue-edit/locales.ts
    var queueEditLocales = {
      zh: {
        // 开关标题
        title: "\u7F16\u8F91\u6392\u961F\u6D88\u606F",
        // 开关用途说明：解释点编辑会撤回排队并把内容放回输入框
        description: "\u6392\u961F\u4E2D\u7684\u6D88\u606F\u70B9\u7F16\u8F91\u5373\u64A4\u56DE\uFF0C\u6587\u5B57\u548C\u56FE\u7247\u56DE\u5230\u8F93\u5165\u6846\uFF0C\u6539\u5B8C\u76F4\u63A5\u91CD\u65B0\u53D1\u9001\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 排队条上编辑按钮的名称，同时作为悬停提示
        recall: "\u64A4\u56DE\u5E76\u7F16\u8F91",
        // 输入框正在发送时不允许改写草稿
        unavailable: "\u8F93\u5165\u6846\u6B63\u5728\u53D1\u9001\u6D88\u606F\uFF0C\u7A0D\u540E\u518D\u64A4\u56DE\u8FD9\u6761\u6392\u961F\u3002",
        // 含文件附件的排队消息无法回填：客户端没有读取这类附件的入口
        unsupported: "\u8FD9\u6761\u6392\u961F\u6D88\u606F\u5305\u542B\u6587\u4EF6\u9644\u4EF6\uFF0C\u65E0\u6CD5\u653E\u56DE\u8F93\u5165\u6846\uFF0C\u53EF\u6539\u7528\u5220\u9664\u540E\u91CD\u65B0\u6DFB\u52A0\u3002",
        // 宿主拒绝撤回或读取图片失败
        failed: "\u64A4\u56DE\u6392\u961F\u6D88\u606F\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
        // 排队已撤回但图片没能放回输入框
        imageFailed: "\u6D88\u606F\u5DF2\u64A4\u56DE\uFF0C\u4F46\u56FE\u7247\u6CA1\u80FD\u653E\u56DE\u8F93\u5165\u6846\uFF0C\u8BF7\u91CD\u65B0\u6DFB\u52A0\u3002"
      },
      en: {
        // Switch title
        title: "Edit queued messages",
        // Switch description explaining that editing recalls the queued message into the composer
        description: "Edit recalls a queued message: its text and images return to the composer so you can resend.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions.",
        // Name and hover hint of the edit button on a queued row
        recall: "Recall and edit",
        // The composer is busy sending, so the draft cannot be rewritten
        unavailable: "The composer is sending a message. Recall this queued item in a moment.",
        // Queued messages carrying file attachments cannot be restored: the client cannot read them back
        unsupported: "This queued message carries file attachments, so it cannot return to the composer. Remove it and attach the files again.",
        // The host refused the recall or the image bytes failed to load
        failed: "Could not recall the queued message. Try again.",
        // The queue item was recalled but its images did not make it back
        imageFailed: "The message was recalled, but its images did not return to the composer. Add them again."
      }
    };

    // src/features/queue-edit/toggle.tsx
    var import_react7 = __toESM(require("react"), 1);
    function QueueEditIcon() {
      return /* @__PURE__ */ import_react7.default.createElement(
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
        /* @__PURE__ */ import_react7.default.createElement("path", { d: "M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16v4Z" }),
        /* @__PURE__ */ import_react7.default.createElement("path", { d: "m14 6 4 4" })
      );
    }
    function QueueEditToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react7.useState)(readQueueEditEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react7.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeQueueEditEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react7.default.createElement(QueueEditIcon, null)), /* @__PURE__ */ import_react7.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react7.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react7.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react7.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react7.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/queue-edit/index.tsx
    var queueEditFeature = {
      id: "queue-edit",
      group: "conversation",
      order: 35,
      reloadsPage: true,
      switch: QueueEditToggle,
      client: { apply: apply3 },
      locales: queueEditLocales
    };
    var queue_edit_default = queueEditFeature;

    // src/features/auto-run/client.tsx
    var import_react9 = __toESM(require("react"), 1);

    // src/features/auto-run/AutoRunToggle.tsx
    var import_react8 = __toESM(require("react"), 1);

    // src/features/auto-run/api.ts
    var ENDPOINT2 = "/dsh-all-in-one/auto-run";
    var REQUEST_TIMEOUT_MS2 = 1e4;
    async function requestJson(search, init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS2);
      const url = new URL(ENDPOINT2, window.location.origin);
      for (const [key, value] of Object.entries(search)) {
        if (value !== void 0) url.searchParams.set(key, value);
      }
      try {
        const response = await fetch(url.toString(), {
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
            console.error("[auto-run] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[auto-run] \u8BF7\u6C42\u5168\u81EA\u52A8\u914D\u7F6E\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadAutoRunState(sessionId, workspaceId) {
      return requestJson({ sessionId, workspaceId });
    }
    function saveAutoRunState(sessionId, enabled, workspaceId) {
      return requestJson({}, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, enabled, workspaceId })
      });
    }
    function loadAutoRunSettings() {
      return requestJson({});
    }
    function saveAutoRunDefaultMode(defaultMode) {
      return requestJson({}, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ defaultMode })
      });
    }

    // src/features/auto-run/session-state.ts
    var enabledSessions = /* @__PURE__ */ new Set();
    var listeners2 = /* @__PURE__ */ new Set();
    var loadStarted = false;
    function notify2() {
      for (const listener of listeners2) listener();
    }
    function subscribe(listener) {
      listeners2.add(listener);
      return () => {
        listeners2.delete(listener);
      };
    }
    function ensureEnabledSessionsLoaded() {
      if (loadStarted) return;
      loadStarted = true;
      void loadAutoRunSettings().then((settings) => {
        enabledSessions.clear();
        for (const sessionId of settings.enabledSessions) enabledSessions.add(sessionId);
        notify2();
      }).catch((error) => {
        console.error("[auto-run] \u8BFB\u53D6\u5168\u81EA\u52A8\u4F1A\u8BDD\u5217\u8868\u5931\u8D25:", error);
        loadStarted = false;
      });
    }
    function setSessionEnabled(sessionId, enabled) {
      if (enabled) enabledSessions.add(sessionId);
      else enabledSessions.delete(sessionId);
      notify2();
    }
    function isEnabled(sessionId) {
      return enabledSessions.has(sessionId);
    }

    // src/features/auto-run/AutoRunToggle.tsx
    function AutoRunToggle({ sessionId, t, workspaceIdOf }) {
      const [enabled, setEnabled] = (0, import_react8.useState)(null);
      const [pending3, setPending] = (0, import_react8.useState)(false);
      const [failure, setFailure] = (0, import_react8.useState)(null);
      (0, import_react8.useEffect)(() => {
        if (sessionId === void 0) {
          setEnabled(null);
          setFailure(null);
          return;
        }
        let active = true;
        setEnabled(null);
        setFailure(null);
        const workspaceId = workspaceIdOf?.(sessionId);
        void loadAutoRunState(sessionId, workspaceId).then((state) => {
          if (!active) return;
          setEnabled(state.enabled);
          if (state.explicit || !state.enabled) return;
          void saveAutoRunState(sessionId, true, workspaceId).then((saved) => {
            if (!active) return;
            setSessionEnabled(sessionId, saved.enabled);
          }).catch((error) => {
            console.error("[auto-run] \u56FA\u5316\u9ED8\u8BA4\u5F00\u542F\u72B6\u6001\u5931\u8D25:", error);
          });
        }).catch((error) => {
          if (!active) return;
          console.error("[auto-run] \u8BFB\u53D6\u5168\u81EA\u52A8\u72B6\u6001\u5931\u8D25:", error);
          setFailure(error instanceof Error ? error.message : String(error));
        });
        return () => {
          active = false;
        };
      }, [sessionId, workspaceIdOf]);
      const hint = (() => {
        if (failure !== null) return `${t("toggleFailed")}\uFF1A${failure}`;
        if (sessionId === void 0) return t("unavailable");
        if (enabled === null) return t("loading");
        return enabled ? t("hintOn") : t("hintOff");
      })();
      const toggle = () => {
        if (sessionId === void 0 || enabled === null || pending3) return;
        const target = sessionId;
        const workspaceId = workspaceIdOf?.(target);
        const next = !enabled;
        setEnabled(next);
        setPending(true);
        setFailure(null);
        void saveAutoRunState(target, next, workspaceId).then((state) => {
          setEnabled(state.enabled);
          setSessionEnabled(target, state.enabled);
        }).catch((error) => {
          console.error("[auto-run] \u5199\u5165\u5168\u81EA\u52A8\u72B6\u6001\u5931\u8D25:", error);
          setEnabled(!next);
          setFailure(error instanceof Error ? error.message : String(error));
        }).finally(() => {
          setPending(false);
        });
      };
      const disabled = sessionId === void 0 || enabled === null || pending3;
      return (
        // 整行即一个开关：左侧固定功能名，右侧滑动轨道表达状态，避免文字长短变化挤动布局
        /* @__PURE__ */ import_react8.default.createElement(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": enabled === true,
            "aria-label": t("action"),
            title: hint,
            disabled,
            onClick: toggle,
            className: cn(
              "flex h-7 shrink-0 items-center gap-2 rounded-full border-0 bg-transparent px-2 text-[12px] font-medium leading-none transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              enabled === true ? "text-primary" : "text-secondary hover:text-primary",
              disabled ? "opacity-60" : ""
            )
          },
          /* @__PURE__ */ import_react8.default.createElement("span", null, t("action")),
          /* @__PURE__ */ import_react8.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "flex h-[18px] w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-out",
                enabled === true ? "bg-brand" : "bg-line2"
              )
            },
            /* @__PURE__ */ import_react8.default.createElement(
              "span",
              {
                className: cn(
                  "h-3.5 w-3.5 rounded-full bg-base ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
                  "transition-transform duration-200 ease-out",
                  enabled === true ? "translate-x-[20px]" : "translate-x-[2px]"
                )
              }
            )
          )
        )
      );
    }

    // src/features/auto-run/session-mark.ts
    var ROW_SELECTOR = '[data-row-key^="session:"]';
    var TITLE_SELECTOR = ':scope > [class*="_title"]';
    var MARK_ATTRIBUTE = "data-dsh-auto-run-mark";
    var MARK_WIDTH = 9;
    var MARK_HEIGHT = 16;
    var MARK_GAP = 2;
    var DEFAULT_ROW_GAP = 6;
    var RELOCATE_INTERVAL_MS2 = 1500;
    function createMark(rowGap) {
      const mark = document.createElement("span");
      mark.setAttribute(MARK_ATTRIBUTE, "");
      mark.setAttribute("aria-hidden", "true");
      mark.style.cssText = [
        "display:inline-flex",
        "flex:0 0 auto",
        "align-items:center",
        "justify-content:center",
        `width:${MARK_WIDTH}px`,
        `height:${MARK_HEIGHT}px`,
        `margin-left:${-(MARK_WIDTH + MARK_GAP)}px`,
        `margin-right:${MARK_GAP - rowGap}px`,
        // 与标题文字基线对齐：标识比文字高，向下压一点点即可贴着文字中线
        "vertical-align:-4px"
      ].join(";");
      mark.innerHTML = `<svg viewBox="0 0 10 18" width="${MARK_WIDTH}" height="${MARK_HEIGHT}" fill="#f0a020"><path d="M5.4 0 L1.6 10.6 H4 L2.8 18 L8.4 7.2 H5.6 Z"/></svg>`;
      return mark;
    }
    function alignMark(mark, title) {
      const realGap = title.getBoundingClientRect().left - mark.getBoundingClientRect().right;
      const delta = realGap - MARK_GAP;
      if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return;
      const marginLeft = Number.parseFloat(mark.style.marginLeft) || 0;
      const marginRight = Number.parseFloat(mark.style.marginRight) || 0;
      mark.style.marginLeft = `${marginLeft + delta}px`;
      mark.style.marginRight = `${marginRight - delta}px`;
    }
    var STATUS_SLOT_SELECTOR = ':scope > [class*="_slot"]';
    var STATUS_MARK_GAP = 2;
    var ROW_ATTRIBUTE = "data-dsh-auto-run-row";
    var STYLE_ID3 = "dsh-auto-run-mark-style";
    var DOT_SHIFT_VARIABLE = "--dsh-auto-run-dot-shift";
    function ensureStyle3() {
      if (document.getElementById(STYLE_ID3) !== null) return;
      const style = document.createElement("style");
      style.id = STYLE_ID3;
      style.textContent = `[${ROW_ATTRIBUTE}] > [class*="_slot"] > [data-state]{transform:translateX(var(${DOT_SHIFT_VARIABLE},0px))}`;
      document.head.appendChild(style);
    }
    function shiftStatusDot(row, mark) {
      const rowEl = row;
      const slot = row.querySelector(STATUS_SLOT_SELECTOR);
      if (slot === null) return;
      const dots = [...slot.children].filter((child) => {
        if (!(child instanceof Element)) return false;
        if (!child.hasAttribute("data-state")) return false;
        const rect = child.getBoundingClientRect();
        return rect.width > 2 && rect.height > 2;
      });
      if (dots.length === 0) return;
      const applied = Number.parseFloat(rowEl.style.getPropertyValue(DOT_SHIFT_VARIABLE)) || 0;
      const markLeft = mark.getBoundingClientRect().left;
      const dotsRight = Math.max(...dots.map((dot) => dot.getBoundingClientRect().right - applied));
      const overlap = markLeft - STATUS_MARK_GAP - dotsRight;
      const shift = Math.min(0, Math.round(overlap));
      ensureStyle3();
      if (rowEl.getAttribute(ROW_ATTRIBUTE) === null) rowEl.setAttribute(ROW_ATTRIBUTE, "");
      if (shift === 0) rowEl.style.removeProperty(DOT_SHIFT_VARIABLE);
      else rowEl.style.setProperty(DOT_SHIFT_VARIABLE, `${shift}px`);
    }
    function resetStatusDot(row) {
      const slot = row.querySelector(STATUS_SLOT_SELECTOR);
      if (slot === null) return;
      const rowEl = row;
      rowEl.removeAttribute(ROW_ATTRIBUTE);
      rowEl.style.removeProperty(DOT_SHIFT_VARIABLE);
    }
    function decorateRow(row) {
      const sessionId = (row.getAttribute("data-row-key") ?? "").slice("session:".length);
      if (sessionId === "") return;
      const title = row.querySelector(TITLE_SELECTOR);
      if (!(title instanceof HTMLElement)) return;
      const existing = row.querySelector(`[${MARK_ATTRIBUTE}]`);
      if (!isEnabled(sessionId)) {
        existing?.remove();
        resetStatusDot(row);
        return;
      }
      if (existing instanceof HTMLElement) {
        if (existing.nextElementSibling !== title) row.insertBefore(existing, title);
        shiftStatusDot(row, existing);
        return;
      }
      const rowGap = Number.parseFloat(window.getComputedStyle(row).columnGap);
      const mark = createMark(Number.isFinite(rowGap) ? rowGap : DEFAULT_ROW_GAP);
      row.insertBefore(mark, title);
      alignMark(mark, title);
      shiftStatusDot(row, mark);
    }
    function decorateAll() {
      for (const row of document.querySelectorAll(ROW_SELECTOR)) decorateRow(row);
    }
    function startSessionMarkDecorator() {
      ensureEnabledSessionsLoaded();
      let frame = 0;
      let disposed = false;
      const schedule = () => {
        if (disposed || frame !== 0) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          decorateAll();
        });
      };
      const unsubscribe = subscribe(schedule);
      const observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
      const relocateTimer = window.setInterval(schedule, RELOCATE_INTERVAL_MS2);
      schedule();
      return () => {
        disposed = true;
        observer.disconnect();
        unsubscribe();
        window.clearInterval(relocateTimer);
        if (frame !== 0) window.cancelAnimationFrame(frame);
        for (const mark of document.querySelectorAll(`[${MARK_ATTRIBUTE}]`)) mark.remove();
      };
    }

    // src/features/auto-run/storage.ts
    var AUTO_RUN_BUTTON_STORAGE_KEY = "dsh-all-in-one:auto-run";
    var DEFAULT_ENABLED = true;
    function readAutoRunButtonEnabled() {
      try {
        const stored = window.localStorage.getItem(AUTO_RUN_BUTTON_STORAGE_KEY);
        if (stored === null) return DEFAULT_ENABLED;
        return stored === "1";
      } catch (error) {
        console.error("[auto-run] \u8BFB\u53D6\u8BBE\u7F6E\u9875\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return DEFAULT_ENABLED;
      }
    }
    function writeAutoRunButtonEnabled(enabled) {
      try {
        window.localStorage.setItem(AUTO_RUN_BUTTON_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[auto-run] \u5199\u5165\u8BBE\u7F6E\u9875\u5F00\u5173\u72B6\u6001\u5931\u8D25:", error);
        return false;
      }
    }

    // src/features/auto-run/client.tsx
    var INPUT_RIGHT_SLOT = "conversation.input.right";
    function findWorkspaceId(uiWorkspace, sessionId) {
      try {
        const items = uiWorkspace.workspaces?.list.getSnapshot().items ?? [];
        for (const item of items) {
          if (item.sessionIds.includes(sessionId)) return item.workspaceId;
        }
        return void 0;
      } catch (error) {
        console.error("[auto-run] \u8BFB\u53D6\u4F1A\u8BDD\u6240\u5C5E\u5DE5\u4F5C\u7A7A\u95F4\u5931\u8D25:", error);
        return void 0;
      }
    }
    function apply4(ctx, t) {
      if (!readAutoRunButtonEnabled()) return;
      let workspaceLookup = () => void 0;
      ctx.inject(["uiWorkspace"], (scoped) => {
        const uiWorkspace = scoped.uiWorkspace;
        if (uiWorkspace === void 0) return;
        workspaceLookup = (sessionId) => findWorkspaceId(uiWorkspace, sessionId);
      });
      const workspaceIdOf = (sessionId) => workspaceLookup(sessionId);
      ctx.slots.inject(
        INPUT_RIGHT_SLOT,
        () => ctx.slots.register(
          {
            name: INPUT_RIGHT_SLOT,
            id: "auto-run-toggle",
            // 较小的 order 让它排在模型选择器与「回退」左侧，成为这一排的第一个控件
            order: -100
          },
          // sessionId 取宿主每次渲染传入的 standardProps：切换对话时插槽会重新渲染，
          // 组件随之读到新会话；若在注册时用 inject 固化，切换对话后按钮会继续改旧会话的开关
          (props) => /* @__PURE__ */ import_react9.default.createElement(
            AutoRunToggle,
            {
              ...props,
              t,
              workspaceIdOf
            }
          )
        )
      );
      ctx.effect(() => startSessionMarkDecorator(), "auto-run: session mark");
    }

    // src/features/auto-run/locales.ts
    var autoRunLocales = {
      zh: {
        // 设置页开关标题
        title: "\u5168\u81EA\u52A8\u6267\u884C",
        // 设置页开关用途说明：点明入口位置与会话级语义，控制在两行以内
        description: "\u8F93\u5165\u6846\u53F3\u4FA7\u65B0\u589E\u300C\u5168\u81EA\u52A8\u300D\u5F00\u5173\uFF1A\u6253\u5F00\u540E\u4E0D\u63D0\u95EE\u3001\u4E0D\u7B49\u786E\u8BA4\uFF0C\u6539\u5B8C\u81EA\u884C\u9A8C\u8BC1\u3002",
        // 设置页开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 默认值选项读取失败时的提示
        loadFailed: "\u8BFB\u53D6\u9ED8\u8BA4\u503C\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002",
        // 默认值选项组的无障碍名称（选项标签不显示，避免挤占窄卡片宽度）
        modeGroupLabel: "\u65B0\u5BF9\u8BDD\u9ED8\u8BA4\u72B6\u6001",
        // 默认值选项：新对话一律关闭全自动
        modeOff: "\u9ED8\u8BA4\u5173",
        // 默认值选项：新对话一律开启全自动
        modeOn: "\u9ED8\u8BA4\u5F00",
        // 默认值选项：新对话沿用最近一次的全自动状态
        modeLast: "\u4E0A\u4E00\u6B21",
        // 默认值选项：新对话沿用所属工作空间最近一次的状态
        modeWorkspace: "\u5DE5\u4F5C\u7A7A\u95F4",
        // 「默认关」的悬停说明
        modeOffHint: "\u65B0\u5BF9\u8BDD\u9ED8\u8BA4\u5173\u95ED\u5168\u81EA\u52A8",
        // 「默认开」的悬停说明
        modeOnHint: "\u65B0\u5BF9\u8BDD\u9ED8\u8BA4\u5F00\u542F\u5168\u81EA\u52A8",
        // 「上一次」的悬停说明
        modeLastHint: "\u65B0\u5BF9\u8BDD\u6CBF\u7528\u6700\u8FD1\u4E00\u6B21\u5207\u6362\u540E\u7684\u72B6\u6001",
        // 「工作空间」的悬停说明
        modeWorkspaceHint: "\u65B0\u5BF9\u8BDD\u6CBF\u7528\u6240\u5C5E\u5DE5\u4F5C\u7A7A\u95F4\u6700\u8FD1\u4E00\u6B21\u7684\u72B6\u6001",
        // 输入框按钮的名称与无障碍标签
        action: "\u5168\u81EA\u52A8",
        // 开启状态下的悬停提示：说明模型不会再来问
        hintOn: "\u5168\u81EA\u52A8\u5DF2\u5F00\u542F\uFF1A\u672C\u5BF9\u8BDD\u4E0D\u5411\u4F60\u63D0\u95EE\uFF0C\u4E5F\u4E0D\u5728\u7ED3\u5C3E\u7B49\u5F85\u4F60\u9009\u62E9",
        // 关闭状态下的悬停提示：说明打开后的效果
        hintOff: "\u70B9\u51FB\u5F00\u542F\u5168\u81EA\u52A8\uFF1A\u672C\u5BF9\u8BDD\u4E0D\u63D0\u95EE\u3001\u4E0D\u7B49\u5F85\u786E\u8BA4\uFF0C\u6539\u5B8C\u81EA\u884C\u9A8C\u8BC1",
        // 状态尚未从宿主读取回来时的悬停提示
        loading: "\u6B63\u5728\u8BFB\u53D6\u5168\u81EA\u52A8\u72B6\u6001\u2026",
        // 会话尚未创建、按钮无法切换时的悬停提示
        unavailable: "\u4F1A\u8BDD\u672A\u5C31\u7EEA\uFF0C\u6682\u65F6\u4E0D\u80FD\u5207\u6362",
        // 切换失败时的悬停提示前缀，后面拼接宿主返回的原因
        toggleFailed: "\u5207\u6362\u5168\u81EA\u52A8\u5931\u8D25"
      },
      en: {
        // Switch title
        title: "Full auto",
        // Switch description: entry position and per-conversation semantics, kept within two lines
        description: "Adds a Full auto switch in the composer: no questions, no waits, self-verified changes.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Saving the switch state failed. Check the browser storage permission.",
        // Shown when the default options cannot be read
        loadFailed: "Reading the default state failed. Reload the page and try again.",
        // Accessible name of the default state group (its label is hidden to save width)
        modeGroupLabel: "Default state for new conversations",
        // Default option: new conversations always start with full auto off
        modeOff: "Off",
        // Default option: new conversations always start with full auto on
        modeOn: "On",
        // Default option: new conversations reuse the most recent state
        modeLast: "Previous",
        // Default option: new conversations reuse their workspace's most recent state
        modeWorkspace: "Workspace",
        // Hover hint for the "Off" option
        modeOffHint: "New conversations start with full auto off",
        // Hover hint for the "On" option
        modeOnHint: "New conversations start with full auto on",
        // Hover hint for the "Previous" option
        modeLastHint: "New conversations reuse the most recently switched state",
        // Hover hint for the "Workspace" option
        modeWorkspaceHint: "New conversations reuse their workspace\u2019s most recent state",
        // Composer button label and accessible name
        action: "Full auto",
        // Tooltip while enabled: the model will not come back with questions
        hintOn: "Full auto is on: this conversation never asks you questions or waits for a choice",
        // Tooltip while disabled: effect of turning it on
        hintOff: "Turn on full auto: no questions, no confirmation waits, self-verified changes",
        // Tooltip while the host state is still loading
        loading: "Reading the full auto state\u2026",
        // Tooltip when no conversation exists yet
        unavailable: "The conversation is not ready; cannot switch yet",
        // Failure tooltip prefix followed by the host error message
        toggleFailed: "Switching full auto failed"
      }
    };

    // src/features/auto-run/toggle.tsx
    var import_react10 = __toESM(require("react"), 1);
    var MODE_OPTIONS2 = [
      { value: "off", labelKey: "modeOff", hintKey: "modeOffHint" },
      { value: "on", labelKey: "modeOn", hintKey: "modeOnHint" },
      { value: "last", labelKey: "modeLast", hintKey: "modeLastHint" },
      { value: "workspace", labelKey: "modeWorkspace", hintKey: "modeWorkspaceHint" }
    ];
    function AutoRunIcon() {
      return /* @__PURE__ */ import_react10.default.createElement("svg", { viewBox: "0 0 24 24", width: "14", height: "14", "aria-hidden": "true", fill: "currentColor" }, /* @__PURE__ */ import_react10.default.createElement("path", { d: "M13.6 2 4.8 13.4h5.5L10.2 22l8.9-11.6h-5.6z" }));
    }
    function AutoRunButtonToggle({ t }) {
      const [enabled] = (0, import_react10.useState)(readAutoRunButtonEnabled);
      const [mode, setMode] = (0, import_react10.useState)(null);
      const [pending3, setPending] = (0, import_react10.useState)(false);
      const [saveFailed, setSaveFailed] = (0, import_react10.useState)(false);
      const [loadFailed, setLoadFailed] = (0, import_react10.useState)(false);
      (0, import_react10.useEffect)(() => {
        let active = true;
        void loadAutoRunSettings().then((settings) => {
          if (active) setMode(settings.defaultMode);
        }).catch((error) => {
          console.error("[auto-run] \u8BFB\u53D6\u9ED8\u8BA4\u503C\u9009\u9879\u5931\u8D25:", error);
          if (active) setLoadFailed(true);
        });
        return () => {
          active = false;
        };
      }, []);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeAutoRunButtonEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        window.location.reload();
      };
      const handleModeChange = (next) => {
        if (next === mode || pending3) return;
        setPending(true);
        setSaveFailed(false);
        void saveAutoRunDefaultMode(next).then((settings) => {
          setMode(settings.defaultMode);
          setPending(false);
          window.location.reload();
        }).catch((error) => {
          console.error("[auto-run] \u4FDD\u5B58\u9ED8\u8BA4\u503C\u9009\u9879\u5931\u8D25:", error);
          setSaveFailed(true);
          setPending(false);
        });
      };
      return /* @__PURE__ */ import_react10.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "flex w-full flex-1 flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "flex w-full items-start gap-2" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react10.default.createElement(AutoRunIcon, null)), /* @__PURE__ */ import_react10.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react10.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react10.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react10.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), enabled && mode !== null ? /* @__PURE__ */ import_react10.default.createElement(
        "div",
        {
          className: "flex flex-wrap items-center gap-1 pl-2",
          role: "radiogroup",
          "aria-label": t("modeGroupLabel")
        },
        MODE_OPTIONS2.map((option) => {
          const checked = option.value === mode;
          return (
            // 每个选项一个单选按钮：点击后写入宿主并刷新页面
            /* @__PURE__ */ import_react10.default.createElement(
              "button",
              {
                key: option.value,
                type: "button",
                role: "radio",
                "aria-checked": checked,
                title: t(option.hintKey),
                disabled: pending3,
                onClick: () => handleModeChange(option.value),
                className: cn(
                  "shrink-0 whitespace-nowrap rounded-md border px-1 py-0 text-[11px] leading-[16px] transition",
                  checked ? "border-brand bg-base text-brand" : "border-line4 bg-layer1 text-secondary hover:text-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
                  pending3 ? "opacity-60" : ""
                )
              },
              t(option.labelKey)
            )
          );
        })
      ) : null), saveFailed ? /* @__PURE__ */ import_react10.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : loadFailed ? /* @__PURE__ */ import_react10.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("loadFailed")) : null);
    }

    // src/features/auto-run/index.tsx
    var autoRunFeature = {
      id: "auto-run",
      group: "conversation",
      order: 40,
      reloadsPage: true,
      switch: AutoRunButtonToggle,
      client: { apply: apply4 },
      locales: autoRunLocales
    };
    var auto_run_default = autoRunFeature;

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
    var STYLE_ID4 = "dsh-all-in-one-session-history";
    var WIDTH_HANDLE_SELECTOR = '[data-width-handle="left"]';
    var NAV_EDGE_GAP = 10;
    var STYLE_TEXT3 = `
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
      if (document.getElementById(STYLE_ID4) === null) {
        const style = document.createElement("style");
        style.id = STYLE_ID4;
        style.textContent = STYLE_TEXT3;
        document.head.appendChild(style);
      }
      let disposed = false;
      let nav = null;
      let slot = null;
      let handle = null;
      let frame = 0;
      let resizeObserver;
      const positionNav = () => {
        if (nav === null || slot === null || handle === null) return;
        const left = Math.round(
          handle.getBoundingClientRect().left - slot.getBoundingClientRect().left - nav.offsetWidth - NAV_EDGE_GAP
        );
        const target = `${Math.max(0, left)}px`;
        if (nav.style.getPropertyValue("left") === target) return;
        nav.style.setProperty("left", target, "important");
      };
      const schedule = () => {
        if (disposed || frame !== 0) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          positionNav();
        });
      };
      const track = () => {
        if (disposed) return;
        const nextNav = document.querySelector(NAV_SELECTOR);
        const nextSlot = nextNav instanceof HTMLElement ? nextNav.parentElement : null;
        const nextHandle = document.querySelector(WIDTH_HANDLE_SELECTOR);
        if (nextNav !== nav || nextSlot !== slot || nextHandle !== handle) {
          nav = nextNav instanceof HTMLElement ? nextNav : null;
          slot = nextSlot instanceof HTMLElement ? nextSlot : null;
          handle = nextHandle instanceof HTMLElement ? nextHandle : null;
          if (resizeObserver !== void 0) {
            resizeObserver.disconnect();
            if (slot !== null) resizeObserver.observe(slot);
            if (handle !== null && handle !== slot) resizeObserver.observe(handle);
          }
        }
        if (nav === null) return;
        if (!nav.hasAttribute(NAV_ATTRIBUTE)) nav.setAttribute(NAV_ATTRIBUTE, "");
        positionNav();
      };
      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(schedule);
      }
      track();
      window.addEventListener("resize", schedule);
      const timer = window.setInterval(track, 2e3);
      return () => {
        disposed = true;
        window.clearInterval(timer);
        window.removeEventListener("resize", schedule);
        resizeObserver?.disconnect();
        if (frame !== 0) window.cancelAnimationFrame(frame);
        for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
          element.removeAttribute(NAV_ATTRIBUTE);
          if (element instanceof HTMLElement) element.style.removeProperty("left");
        }
        document.getElementById(STYLE_ID4)?.remove();
      };
    }

    // src/features/session-history/client.tsx
    function apply5(ctx) {
      if (!readSessionHistoryEnabled()) return;
      ctx.effect(() => installTurnNav(), "session-history: turn-nav");
    }

    // src/features/session-history/locales.ts
    var sessionHistoryLocales = {
      zh: {
        title: "\u4F1A\u8BDD\u5386\u53F2\u5DE6\u4FA7",
        description: "\u8F6E\u6B21\u5BFC\u822A\u6761\u4ECE\u5BF9\u8BDD\u53F3\u4FA7\u79FB\u5230\u5DE6\u4FA7\uFF0C\u70B9\u51FB\u8DF3\u8F6C\u4FDD\u6301\u4E0D\u53D8\u3002",
        saveFailed: "\u5F00\u5173\u72B6\u6001\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u3002"
      },
      en: {
        title: "Turn history on the left",
        description: "Move the turn navigator to the left side; jump-on-click is unchanged.",
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
      return /* @__PURE__ */ import_react11.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react11.default.createElement(LayoutLeftIcon, null)), /* @__PURE__ */ import_react11.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react11.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react11.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react11.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react11.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/session-history/index.tsx
    var sessionHistoryFeature = {
      id: "session-history",
      group: "layout",
      order: 10,
      reloadsPage: true,
      switch: SessionHistoryToggle,
      client: { apply: apply5 },
      locales: sessionHistoryLocales
    };
    var session_history_default = sessionHistoryFeature;

    // src/features/sidebar-more/open-settings.ts
    var SETTINGS_LABELS = ["\u8BBE\u7F6E", "Settings"];
    var SECTION_LABEL = "All In One";
    var MAX_ATTEMPTS = 10;
    function findSettingsItem() {
      const items = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"]')).filter(
        (node) => node instanceof HTMLElement
      );
      const matched = items.find((item) => {
        const text = (item.textContent ?? "").trim();
        return SETTINGS_LABELS.some((label) => text.startsWith(label));
      });
      return matched ?? items[0] ?? null;
    }
    function clickSection(attempt) {
      const row = Array.from(document.querySelectorAll('[role="dialog"] nav button')).find(
        (node) => (node.textContent ?? "").trim() === SECTION_LABEL
      );
      if (row instanceof HTMLElement) {
        row.click();
        return;
      }
      if (attempt < MAX_ATTEMPTS) {
        window.requestAnimationFrame(() => clickSection(attempt + 1));
        return;
      }
      console.error("[sidebar-more] \u8BBE\u7F6E\u5BFC\u822A\u7F3A\u5C11 All In One \u5206\u533A\uFF0C\u65E0\u6CD5\u76F4\u8FBE\u5BF9\u5E94\u9875\u9762");
    }
    function openAllInOneSection() {
      const settingsItem = findSettingsItem();
      if (settingsItem === null) {
        console.error("[sidebar-more] \u627E\u4E0D\u5230\u5BBF\u4E3B\u300C\u8BBE\u7F6E\u300D\u83DC\u5355\u9879\uFF0C\u65E0\u6CD5\u6253\u5F00 All In One");
        return;
      }
      settingsItem.click();
      window.requestAnimationFrame(() => clickSection(1));
    }

    // src/features/sidebar-more/sidebar-more.ts
    var PANEL_LIST_SELECTOR = 'nav[class*="_panelList"]';
    var PANEL_ROW_SELECTOR = 'button[class*="_panelRow"]';
    var FOOTER_TRIGGER_SELECTOR = '[class*="_triggerRow"] button[aria-haspopup="menu"]';
    var MENU_TEMPLATE_SELECTOR = '[class*="_itemWrap"]';
    var MENU_LABEL_SELECTOR = '[class*="_itemLabel"]';
    var MENU_ICON_SELECTOR = '[class*="_itemIcon"]';
    var MENU_SHORTCUT_SELECTOR = '[class*="_shortcut"], [class*="_keys"]';
    var STYLE_ID5 = "dsh-all-in-one-sidebar-more";
    var INJECTED_ATTRIBUTE = "data-aio-sidebar-more-item";
    var SUPPRESS_ATTRIBUTE = "data-aio-sidebar-more-suppress";
    var SUBITEM_MAX_ATTEMPTS = 3;
    var SUPPRESS_RELEASE_MS = 300;
    var cachedTrigger = null;
    var cachedPanelList = null;
    var suppressTimer;
    var SVG_NAMESPACE2 = "http://www.w3.org/2000/svg";
    var ICON_SIZE = 16;
    var ICON_CELLS = [
      [2.5, 2.5],
      [9, 2.5],
      [2.5, 9],
      [9, 9]
    ];
    var STYLE_TEXT4 = [
      `${PANEL_LIST_SELECTOR} { display: none !important; }`,
      `html[${SUPPRESS_ATTRIBUTE}] [role="menu"] { visibility: hidden !important; }`
    ].join("\n");
    function createGridIcon() {
      const svg = document.createElementNS(SVG_NAMESPACE2, "svg");
      svg.setAttribute("width", String(ICON_SIZE));
      svg.setAttribute("height", String(ICON_SIZE));
      svg.setAttribute("viewBox", `0 0 ${ICON_SIZE} ${ICON_SIZE}`);
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.3");
      svg.setAttribute("aria-hidden", "true");
      for (const [x, y] of ICON_CELLS) {
        const rect = document.createElementNS(SVG_NAMESPACE2, "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", "4.5");
        rect.setAttribute("height", "4.5");
        rect.setAttribute("rx", "1.2");
        svg.appendChild(rect);
      }
      return svg;
    }
    function ensureStyle4() {
      if (document.getElementById(STYLE_ID5) !== null) return;
      const style = document.createElement("style");
      style.id = STYLE_ID5;
      style.textContent = STYLE_TEXT4;
      document.head.appendChild(style);
    }
    function findFooterTrigger() {
      if (cachedTrigger !== null && cachedTrigger.isConnected) return cachedTrigger;
      const trigger = document.querySelector(FOOTER_TRIGGER_SELECTOR);
      cachedTrigger = trigger instanceof HTMLElement ? trigger : null;
      return cachedTrigger;
    }
    function findPanelRows() {
      if (cachedPanelList === null || !cachedPanelList.isConnected) {
        const list = document.querySelector(PANEL_LIST_SELECTOR);
        cachedPanelList = list instanceof HTMLElement ? list : null;
      }
      if (cachedPanelList === null) return [];
      return Array.from(cachedPanelList.querySelectorAll(PANEL_ROW_SELECTOR));
    }
    function isMenuToggle(row) {
      return row.getAttribute("aria-expanded") !== null;
    }
    function closeFooterMenu() {
      const trigger = findFooterTrigger();
      if (trigger !== null && trigger.getAttribute("aria-expanded") === "true") {
        trigger.click();
        return;
      }
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    }
    function createMenuItem(template, options) {
      const wrap = template.cloneNode(true);
      wrap.setAttribute(INJECTED_ATTRIBUTE, "");
      for (const node of Array.from(wrap.querySelectorAll(MENU_SHORTCUT_SELECTOR))) node.remove();
      const label = wrap.querySelector(MENU_LABEL_SELECTOR);
      if (label !== null) label.textContent = options.label;
      const icon = wrap.querySelector(MENU_ICON_SELECTOR);
      if (icon !== null) {
        icon.replaceChildren();
        if (options.icon !== null) icon.appendChild(options.icon.cloneNode(true));
      }
      const button = wrap.querySelector("button");
      if (!(button instanceof HTMLElement)) {
        console.error("[sidebar-more] \u5BBF\u4E3B\u83DC\u5355\u9879\u6A21\u677F\u7F3A\u5C11\u6309\u94AE\uFF0C\u5165\u53E3\u4E0D\u53EF\u70B9\u51FB:", options.label);
        return wrap;
      }
      button.removeAttribute("aria-keyshortcuts");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (options.closeMenuFirst !== false) closeFooterMenu();
        window.requestAnimationFrame(options.onClick);
      });
      return wrap;
    }
    function openTopMoreItem(index) {
      const more = findPanelRows().find(isMenuToggle);
      if (more === void 0) {
        console.error("[sidebar-more] \u627E\u4E0D\u5230\u9876\u90E8\u300C\u66F4\u591A\u300D\u6309\u94AE\uFF0C\u65E0\u6CD5\u6253\u5F00\u7B2C", index + 1, "\u9879");
        return;
      }
      const before = new Set(document.querySelectorAll('[role="menu"]'));
      document.documentElement.setAttribute(SUPPRESS_ATTRIBUTE, "");
      try {
        more.click();
      } catch (error) {
        console.error("[sidebar-more] \u6253\u5F00\u9876\u90E8\u300C\u66F4\u591A\u300D\u5931\u8D25:", error);
        document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE);
        return;
      }
      clickNewMenuItem(before, index, 1);
    }
    function clickNewMenuItem(before, index, attempt) {
      const menu = Array.from(document.querySelectorAll('[role="menu"]')).find((node) => !before.has(node));
      const item = menu?.querySelectorAll('[role="menuitem"]')[index];
      if (item instanceof HTMLElement) {
        item.click();
        if (suppressTimer !== void 0) window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(() => {
          suppressTimer = void 0;
          document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE);
        }, SUPPRESS_RELEASE_MS);
        return;
      }
      if (attempt < SUBITEM_MAX_ATTEMPTS) {
        window.requestAnimationFrame(() => clickNewMenuItem(before, index, attempt + 1));
        return;
      }
      console.error("[sidebar-more] \u9876\u90E8\u300C\u66F4\u591A\u300D\u83DC\u5355\u7F3A\u5C11\u7B2C", index + 1, "\u9879");
      document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE);
    }
    function injectFooterItems(t) {
      const trigger = findFooterTrigger();
      if (trigger === null || trigger.getAttribute("aria-expanded") !== "true") return;
      const menu = document.querySelector('[role="menu"]');
      if (!(menu instanceof HTMLElement)) return;
      if (menu.querySelector(`[${INJECTED_ATTRIBUTE}]`) !== null) return;
      const template = menu.querySelector(MENU_TEMPLATE_SELECTOR);
      if (!(template instanceof HTMLElement)) {
        console.error("[sidebar-more] \u627E\u4E0D\u5230\u5BBF\u4E3B\u83DC\u5355\u9879\u7ED3\u6784\uFF0C\u8DF3\u8FC7\u83DC\u5355\u642C\u8FD0");
        return;
      }
      const viewport = menu.querySelector('[class*="_viewport"]') ?? menu;
      const hostItem = Array.from(viewport.querySelectorAll(MENU_TEMPLATE_SELECTOR)).filter((node) => !node.hasAttribute(INJECTED_ATTRIBUTE)).pop();
      viewport.insertBefore(
        createMenuItem(template, {
          label: t("menuEntry"),
          icon: createGridIcon(),
          closeMenuFirst: false,
          onClick: openAllInOneSection
        }),
        hostItem?.nextSibling ?? null
      );
      for (const row of findPanelRows().filter((item) => !isMenuToggle(item))) {
        viewport.appendChild(
          createMenuItem(template, {
            label: row.getAttribute("aria-label") ?? row.textContent?.trim() ?? "",
            icon: row.querySelector("svg"),
            onClick: () => row.click()
          })
        );
      }
      const subItems = [
        { label: t("browsePlugins"), index: 0 },
        { label: t("createPlugin"), index: 1 }
      ];
      for (const subItem of subItems) {
        viewport.appendChild(
          createMenuItem(template, {
            label: subItem.label,
            icon: null,
            onClick: () => openTopMoreItem(subItem.index)
          })
        );
      }
    }
    function installSidebarMore(t) {
      ensureStyle4();
      let disposed = false;
      let scheduled = false;
      let frame = 0;
      const scan = () => {
        frame = 0;
        scheduled = false;
        if (disposed) return;
        injectFooterItems(t);
      };
      const schedule = () => {
        if (scheduled || disposed) return;
        scheduled = true;
        frame = window.requestAnimationFrame(scan);
      };
      const observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
      schedule();
      return () => {
        disposed = true;
        observer.disconnect();
        if (frame !== 0) window.cancelAnimationFrame(frame);
        if (suppressTimer !== void 0) {
          window.clearTimeout(suppressTimer);
          suppressTimer = void 0;
        }
        cachedTrigger = null;
        cachedPanelList = null;
        document.getElementById(STYLE_ID5)?.remove();
        document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE);
      };
    }

    // src/features/sidebar-more/storage.ts
    var SIDEBAR_MORE_STORAGE_KEY = "dsh-all-in-one:sidebar-more";
    function readSidebarMoreEnabled() {
      try {
        return window.localStorage.getItem(SIDEBAR_MORE_STORAGE_KEY) === "1";
      } catch (error) {
        console.error("[sidebar-more] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:", SIDEBAR_MORE_STORAGE_KEY, error);
        return false;
      }
    }
    function writeSidebarMoreEnabled(enabled) {
      try {
        window.localStorage.setItem(SIDEBAR_MORE_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error("[sidebar-more] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:", SIDEBAR_MORE_STORAGE_KEY, error);
        return false;
      }
    }

    // src/features/sidebar-more/client.tsx
    function apply6(ctx, t) {
      if (!readSidebarMoreEnabled()) return;
      ctx.effect(() => installSidebarMore(t), "sidebar-more: footer menu");
    }

    // src/features/sidebar-more/locales.ts
    var sidebarMoreLocales = {
      zh: {
        // 开关标题
        title: "\u83DC\u5355\u6536\u8FDB\u66F4\u591A",
        // 开关用途说明：解释打开后侧边栏顶部的哪些入口会被搬进底部菜单
        description: "\u9876\u90E8\u63D2\u4EF6\u3001Skill / MCP \u4E0E\u81EA\u52A8\u5316\u4EFB\u52A1\u6536\u8FDB\u5DE6\u4E0B\u89D2\u300C\u66F4\u591A\u300D\u83DC\u5355\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 底部菜单里打开本插件设置页的入口
        menuEntry: "All In One",
        // 底部菜单里对宿主「更多」子项「浏览更多插件」的替代文案
        browsePlugins: "\u6D4F\u89C8\u66F4\u591A\u63D2\u4EF6",
        // 底部菜单里对宿主「更多」子项「创建你的插件」的替代文案
        createPlugin: "\u521B\u5EFA\u4F60\u7684\u63D2\u4EF6"
      },
      en: {
        // Switch title
        title: "Tuck menus into More",
        // Switch description explaining which sidebar entries move into the bottom menu
        description: "Move Plugins, Skill / MCP and Automation into the bottom-left More menu.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions.",
        // Entry that opens this plugin's settings page
        menuEntry: "All In One",
        // Replacement label for the host's "Browse more plugins" entry
        browsePlugins: "Browse more plugins",
        // Replacement label for the host's "Create your plugin" entry
        createPlugin: "Create your plugin"
      }
    };

    // src/features/sidebar-more/toggle.tsx
    var import_react12 = __toESM(require("react"), 1);
    function TuckMenuIcon() {
      return /* @__PURE__ */ import_react12.default.createElement(
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
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M4 6h12" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M4 11h12" }),
        /* @__PURE__ */ import_react12.default.createElement("path", { d: "M4 17h6" }),
        /* @__PURE__ */ import_react12.default.createElement("circle", { cx: "17", cy: "17", r: "1", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react12.default.createElement("circle", { cx: "20", cy: "17", r: "1", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react12.default.createElement("circle", { cx: "14", cy: "17", r: "1", fill: "currentColor", stroke: "none" })
      );
    }
    function SidebarMoreToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react12.useState)(readSidebarMoreEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react12.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeSidebarMoreEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react12.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react12.default.createElement(TuckMenuIcon, null)), /* @__PURE__ */ import_react12.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react12.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react12.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react12.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react12.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/sidebar-more/index.tsx
    var sidebarMoreFeature = {
      id: "sidebar-more",
      group: "layout",
      order: 20,
      reloadsPage: true,
      switch: SidebarMoreToggle,
      client: { apply: apply6 },
      locales: sidebarMoreLocales
    };
    var sidebar_more_default = sidebarMoreFeature;

    // src/features/workspace-session-count/storage.ts
    var WORKSPACE_SESSION_COUNT_STORAGE_KEY = "dsh-all-in-one:workspace-session-count";
    function readWorkspaceSessionCountEnabled() {
      try {
        return window.localStorage.getItem(WORKSPACE_SESSION_COUNT_STORAGE_KEY) === "1";
      } catch (error) {
        console.error(
          "[workspace-session-count] \u8BFB\u53D6\u5F00\u5173\u72B6\u6001\u5931\u8D25:",
          WORKSPACE_SESSION_COUNT_STORAGE_KEY,
          error
        );
        return false;
      }
    }
    function writeWorkspaceSessionCountEnabled(enabled) {
      try {
        window.localStorage.setItem(WORKSPACE_SESSION_COUNT_STORAGE_KEY, enabled ? "1" : "0");
        return true;
      } catch (error) {
        console.error(
          "[workspace-session-count] \u5199\u5165\u5F00\u5173\u72B6\u6001\u5931\u8D25:",
          WORKSPACE_SESSION_COUNT_STORAGE_KEY,
          error
        );
        return false;
      }
    }

    // src/features/workspace-session-count/workspace-count.ts
    var WORKSPACE_ROW_SELECTOR = '[data-row-key^="workspace:"]';
    var TITLE_SELECTOR2 = '[class*="_title"]';
    var COUNT_ATTRIBUTE = "data-aio-workspace-count";
    var COUNT_CLASS = "aio-workspace-count";
    function readWorkspaceId(row) {
      const key = row.getAttribute("data-row-key") ?? "";
      const workspaceId = key.slice("workspace:".length);
      return workspaceId === "" ? void 0 : workspaceId;
    }
    function buildCounts(workspaces, sessions) {
      const counts = /* @__PURE__ */ new Map();
      for (const workspace of workspaces) {
        let count = 0;
        for (const id of workspace.sessionIds) {
          const summary = sessions.byId[id];
          if (summary !== void 0 && summary.blank !== true) count += 1;
        }
        if (count > 0) counts.set(workspace.workspaceId, count);
      }
      return counts;
    }
    var titleCache = /* @__PURE__ */ new WeakMap();
    function titleOf(row) {
      const cached = titleCache.get(row);
      if (cached !== void 0 && (cached === null || cached.isConnected)) return cached;
      const title = row.querySelector(TITLE_SELECTOR2);
      titleCache.set(row, title);
      return title;
    }
    function applyCounts(counts) {
      const rows = document.querySelectorAll(WORKSPACE_ROW_SELECTOR);
      for (const row of rows) {
        const workspaceId = readWorkspaceId(row);
        if (workspaceId === void 0) continue;
        const title = titleOf(row);
        if (title === null) continue;
        const count = counts.get(workspaceId);
        const next = count === void 0 ? null : String(count);
        if (title.getAttribute(COUNT_ATTRIBUTE) === next) continue;
        if (next === null) {
          title.removeAttribute(COUNT_ATTRIBUTE);
          title.classList.remove(COUNT_CLASS);
        } else {
          title.setAttribute(COUNT_ATTRIBUTE, next);
          title.classList.add(COUNT_CLASS);
        }
      }
    }
    function clearCounts() {
      const titles = document.querySelectorAll(`[${COUNT_ATTRIBUTE}]`);
      for (const title of titles) {
        title.removeAttribute(COUNT_ATTRIBUTE);
        title.classList.remove(COUNT_CLASS);
      }
    }
    function installWorkspaceSessionCount(sessions, uiWorkspace) {
      let frame = 0;
      let disposed = false;
      let lastWorkspaces;
      let lastSessions;
      let lastCounts = /* @__PURE__ */ new Map();
      let lastApplied = /* @__PURE__ */ new Map();
      let rowsDirty = true;
      const sameCounts = (left, right) => {
        if (left.size !== right.size) return false;
        for (const [key, count] of left) {
          if (right.get(key) !== count) return false;
        }
        return true;
      };
      const render = () => {
        frame = 0;
        if (disposed) return;
        const workspaces = uiWorkspace.workspaces?.list.getSnapshot().items;
        if (workspaces === void 0) return;
        const sessionState = sessions.list.getSnapshot();
        if (workspaces !== lastWorkspaces || sessionState !== lastSessions) {
          lastCounts = buildCounts(workspaces, sessionState);
          lastWorkspaces = workspaces;
          lastSessions = sessionState;
        }
        if (!rowsDirty && sameCounts(lastCounts, lastApplied)) return;
        applyCounts(lastCounts);
        lastApplied = lastCounts;
        rowsDirty = false;
      };
      const schedule = () => {
        if (frame !== 0 || disposed) return;
        frame = window.requestAnimationFrame(render);
      };
      const touchesRows = (records) => {
        for (const record of records) {
          for (const node of [...record.addedNodes, ...record.removedNodes]) {
            if (!(node instanceof Element)) continue;
            if (node.matches(WORKSPACE_ROW_SELECTOR) || node.querySelector(WORKSPACE_ROW_SELECTOR) !== null) {
              return true;
            }
          }
        }
        return false;
      };
      const unsubscribeWorkspaces = uiWorkspace.workspaces?.list.subscribe?.(schedule);
      const unsubscribeSessions = sessions.list.subscribe?.(schedule);
      const observer = new MutationObserver((records) => {
        if (!touchesRows(records)) return;
        rowsDirty = true;
        schedule();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      schedule();
      return () => {
        disposed = true;
        unsubscribeWorkspaces?.();
        unsubscribeSessions?.();
        observer.disconnect();
        if (frame !== 0) window.cancelAnimationFrame(frame);
        clearCounts();
      };
    }

    // src/features/workspace-session-count/client.tsx
    function apply7(ctx, _t) {
      if (!readWorkspaceSessionCountEnabled()) return;
      ctx.inject(["sessions", "uiWorkspace"], (scoped) => {
        const sessions = scoped.sessions;
        const uiWorkspace = scoped.uiWorkspace;
        if (sessions === void 0 || uiWorkspace === void 0) return;
        ctx.effect(
          () => installWorkspaceSessionCount(sessions, uiWorkspace),
          "workspace-session-count: sidebar rows"
        );
      });
    }

    // src/features/workspace-session-count/locales.ts
    var workspaceSessionCountLocales = {
      zh: {
        // 开关标题
        title: "\u9879\u76EE\u4F1A\u8BDD\u6570",
        // 开关用途说明：解释项目名后会显示该项目自身的会话数量
        description: "\u4FA7\u8FB9\u680F\u9879\u76EE\u540D\u540E\u663E\u793A\u8BE5\u9879\u76EE\u81EA\u8EAB\u7684\u4F1A\u8BDD\u6570\u91CF\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002"
      },
      en: {
        // Switch title
        title: "Workspace session count",
        // Switch description explaining where the count appears and what it counts
        description: "Show each workspace\u2019s own session count after its name in the sidebar.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions."
      }
    };

    // src/features/workspace-session-count/toggle.tsx
    var import_react13 = __toESM(require("react"), 1);
    function FolderCountIcon() {
      return /* @__PURE__ */ import_react13.default.createElement(
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
        /* @__PURE__ */ import_react13.default.createElement("path", { d: "M3 7h6l2 2h10v11H3Z" }),
        /* @__PURE__ */ import_react13.default.createElement("circle", { cx: "16", cy: "16", r: "1", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react13.default.createElement("circle", { cx: "19", cy: "16", r: "1", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react13.default.createElement("circle", { cx: "13", cy: "16", r: "1", fill: "currentColor", stroke: "none" })
      );
    }
    function WorkspaceSessionCountToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react13.useState)(readWorkspaceSessionCountEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react13.useState)(false);
      const handleToggle = () => {
        const next = !enabled;
        if (!writeWorkspaceSessionCountEnabled(next)) {
          setSaveFailed(true);
          return;
        }
        setSaveFailed(false);
        setEnabled(next);
        window.location.reload();
      };
      return /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react13.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react13.default.createElement(FolderCountIcon, null)), /* @__PURE__ */ import_react13.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react13.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react13.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react13.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react13.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react13.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/workspace-session-count/index.tsx
    var workspaceSessionCountFeature = {
      id: "workspace-session-count",
      group: "layout",
      order: 30,
      reloadsPage: true,
      switch: WorkspaceSessionCountToggle,
      client: { apply: apply7 },
      locales: workspaceSessionCountLocales
    };
    var workspace_session_count_default = workspaceSessionCountFeature;

    // src/features/delete-session/client.tsx
    var import_react16 = __toESM(require("react"), 1);

    // src/features/delete-session/api.ts
    var ENDPOINT3 = "/dsh-all-in-one/sessions";
    var BATCH_ENDPOINT = "/dsh-all-in-one/sessions/batch";
    var REQUEST_TIMEOUT_MS3 = 15e3;
    var BATCH_TIMEOUT_MS = 12e4;
    async function postJson(path, body, timeoutMs) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(new URL(path, window.location.origin).toString(), {
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
        return await response.json();
      } catch (error) {
        console.error("[delete-session] \u8BF7\u6C42\u5BBF\u4E3B\u5931\u8D25:", path, error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    async function requestDeleteSession2(sessionId) {
      const body = { sessionId };
      const payload = await postJson(ENDPOINT3, body, REQUEST_TIMEOUT_MS3);
      if (payload.deleted !== true) throw new Error("\u5BBF\u4E3B\u672A\u786E\u8BA4\u5220\u9664");
    }
    async function requestDeleteSessions(sessionIds) {
      const body = { sessionIds };
      const payload = await postJson(BATCH_ENDPOINT, body, BATCH_TIMEOUT_MS);
      if (!Array.isArray(payload.deleted)) throw new Error("\u5BBF\u4E3B\u672A\u8FD4\u56DE\u5220\u9664\u7ED3\u679C");
      return {
        deleted: payload.deleted,
        failed: Array.isArray(payload.failed) ? payload.failed : []
      };
    }

    // src/features/delete-session/confirm-store.ts
    var listeners3 = /* @__PURE__ */ new Set();
    var pending2 = null;
    function notify3() {
      for (const listener of [...listeners3]) {
        try {
          listener();
        } catch (error) {
          console.error("[delete-session] \u786E\u8BA4\u5F39\u7A97\u8BA2\u9605\u8005\u5904\u7406\u5931\u8D25:", error);
        }
      }
    }
    var deleteConfirmStore = {
      getSnapshot: () => pending2,
      subscribe(listener) {
        listeners3.add(listener);
        return () => {
          listeners3.delete(listener);
        };
      },
      request(next) {
        pending2 = next;
        notify3();
      },
      settle() {
        if (pending2 === null) return;
        pending2 = null;
        notify3();
      }
    };

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
    var import_react14 = __toESM(require("react"), 1);
    var ENABLED_AT_INSTALL = readDeleteSessionEnabled();
    function TrashGlyph() {
      return /* @__PURE__ */ import_react14.default.createElement(
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
        /* @__PURE__ */ import_react14.default.createElement("path", { d: "M2.5 4.5h11" }),
        /* @__PURE__ */ import_react14.default.createElement("path", { d: "M6.5 2.75h3" }),
        /* @__PURE__ */ import_react14.default.createElement("path", { d: "M4 4.5 4.6 13h6.8L12 4.5" }),
        /* @__PURE__ */ import_react14.default.createElement("path", { d: "M6.6 6.8v3.6" }),
        /* @__PURE__ */ import_react14.default.createElement("path", { d: "M9.4 6.8v3.6" })
      );
    }
    function DeleteSessionButton({
      t,
      sessionId,
      displayTitle,
      resolveSession: resolveSession2,
      requestConfirm
    }) {
      if (!ENABLED_AT_INSTALL) return null;
      if (sessionId === void 0 || requestConfirm === void 0) return null;
      const state = resolveSession2?.(sessionId);
      if (state !== void 0 && state.running) return null;
      const handleClick = (event) => {
        event.stopPropagation();
        requestConfirm({ kind: "session", sessionId, title: displayTitle ?? sessionId });
      };
      return /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          type: "button",
          "aria-label": t("action"),
          title: t("action"),
          onClick: handleClick,
          className: "inline-flex h-4 w-4 flex-none cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-secondary transition hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        },
        /* @__PURE__ */ import_react14.default.createElement(TrashGlyph, null)
      );
    }

    // src/features/delete-session/DeleteSessionDialog.tsx
    var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react15 = __toESM(require("react"), 1);
    var useNoRequest = (() => null);
    function DeleteSessionDialog({
      t,
      useRequest,
      deleteSession,
      deleteWorkspaceSessions,
      settle
    }) {
      const [pending3, setPending] = (0, import_react15.useState)(false);
      const [error, setError] = (0, import_react15.useState)(null);
      const readRequest = useRequest ?? useNoRequest;
      const request5 = readRequest((value) => value);
      const requestKey = request5 === null ? "" : request5.kind === "session" ? request5.sessionId : request5.workspaceId;
      (0, import_react15.useEffect)(() => {
        setError(null);
      }, [requestKey]);
      if (request5 === null) return null;
      const isWorkspace = request5.kind === "workspace";
      const close = () => {
        if (pending3) return;
        setError(null);
        settle?.();
      };
      const confirm = async () => {
        if (pending3) return;
        setPending(true);
        setError(null);
        try {
          if (request5.kind === "workspace") {
            const report = await deleteWorkspaceSessions?.(request5.workspaceId, request5.sessionIds);
            if (report !== void 0 && report.failed.length > 0) {
              setPending(false);
              setError(t("deleteAllPartial").replace("{count}", String(report.failed.length)));
              return;
            }
          } else {
            await deleteSession?.(request5.sessionId);
          }
        } catch (failure) {
          console.error("[delete-session] \u5220\u9664\u4F1A\u8BDD\u5931\u8D25:", failure);
          setPending(false);
          setError(`${t("deleteFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
          return;
        }
        setPending(false);
        settle?.();
      };
      return /* @__PURE__ */ import_react15.default.createElement(
        import_dsh_client_ui_primitives2.Modal,
        {
          open: true,
          onClose: close,
          closeLabel: t("confirmCancel"),
          title: isWorkspace ? t("confirmAllTitle") : t("confirmTitle"),
          description: isWorkspace ? t("confirmAllTarget") : t("confirmTarget"),
          footer: /* @__PURE__ */ import_react15.default.createElement(import_react15.default.Fragment, null, /* @__PURE__ */ import_react15.default.createElement(Button, { variant: "outline", disabled: pending3, onClick: close }, t("confirmCancel")), /* @__PURE__ */ import_react15.default.createElement(
            Button,
            {
              variant: "danger",
              "data-modal-autofocus": "",
              disabled: pending3,
              onClick: () => void confirm()
            },
            pending3 ? t("deleting") : t("confirmDelete")
          ))
        },
        /* @__PURE__ */ import_react15.default.createElement("p", { className: "mt-1 text-[13px] font-medium leading-5 text-primary" }, request5.title),
        request5.kind === "workspace" ? /* @__PURE__ */ import_react15.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, t("confirmAllCount").replace("{count}", String(request5.sessionIds.length))) : null,
        /* @__PURE__ */ import_react15.default.createElement("p", { className: "mt-3 text-[12px] leading-[18px] text-secondary" }, isWorkspace ? t("confirmAllMessage") : t("confirmMessage")),
        error !== null ? /* @__PURE__ */ import_react15.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-danger", role: "alert" }, error) : null
      );
    }

    // src/features/delete-session/workspace-menu.ts
    var WORKSPACE_ROW_SELECTOR2 = '[data-row-key^="workspace:"]';
    var MENU_SELECTOR = '[role="menu"]';
    var MENU_ITEM_SELECTOR = '[class*="_itemWrap"]';
    var MENU_LABEL_SELECTOR2 = '[class*="_itemLabel"]';
    var MENU_ICON_SELECTOR2 = '[class*="_itemIcon"]';
    var SVG_NAMESPACE3 = "http://www.w3.org/2000/svg";
    var ICON_SIZE2 = 16;
    var DELETE_ALL_ICON_PATHS = [
      [
        "M448.609524 882.590476c-58.514286 0-112.152381-19.504762-156.038095-63.390476l-126.78",
        "0953-126.780952c-19.504762-19.504762-29.257143-43.885714-29.257143-73.142858s9.752381",
        "-53.638095 29.257143-73.142857l375.466667-375.466666c39.009524-39.009524 107.27619-39",
        ".009524 146.285714 0l209.676191 209.67619c39.009524 39.009524 39.009524 107.27619 0 1",
        "46.285714l-292.571429 292.571429c-43.885714 43.885714-102.4 63.390476-156.038095 63.3",
        "90476z m-121.904762-97.523809c68.266667 68.266667 175.542857 68.266667 243.809524 0l2",
        "92.571428-292.571429c19.504762-19.504762 19.504762-53.638095 0-78.019048l-209.67619-2",
        "09.67619c-19.504762-19.504762-53.638095-19.504762-78.019048 0l-375.466666 375.466667c",
        "-9.752381 9.752381-14.628571 24.380952-14.628572 39.009523s4.87619 29.257143 14.62857",
        "2 39.009524l126.780952 126.780953z"
      ].join(""),
      [
        "M244.345905 516.437333l34.474666-34.474666 317.244953 317.19619-34.523429 34.474667zM",
        "921.6 882.590476H453.485714c-14.628571 0-24.380952-9.752381-24.380952-24.380952s9.752",
        "381-24.380952 24.380952-24.380953h468.114286c14.628571 0 24.380952 9.752381 24.380952",
        " 24.380953s-9.752381 24.380952-24.380952 24.380952z"
      ].join("")
    ];
    var DELETE_WORKSPACE_LABELS = ["\u5220\u9664\u5DE5\u4F5C\u533A", "Delete workspace"];
    var INJECTED_ATTRIBUTE2 = "data-aio-delete-all-sessions";
    function readWorkspaceRow(row) {
      const key = row.getAttribute("data-row-key") ?? "";
      const workspaceId = key.slice("workspace:".length);
      if (workspaceId === "") return void 0;
      const title = (row.querySelector('[class*="_title"]')?.textContent ?? "").trim();
      return { workspaceId, title: title === "" ? workspaceId : title };
    }
    function collectDeletableSessions(sessions, uiWorkspace, workspaceId) {
      const workspace = uiWorkspace?.workspaces?.list.getSnapshot().items.find(
        (item) => item.workspaceId === workspaceId
      );
      if (workspace === void 0) return [];
      const state = sessions.list.getSnapshot();
      return workspace.sessionIds.filter((id) => state.byId[id]?.running !== true);
    }
    function closeMenu() {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    }
    function createDeleteAllIcon() {
      const svg = document.createElementNS(SVG_NAMESPACE3, "svg");
      svg.setAttribute("width", String(ICON_SIZE2));
      svg.setAttribute("height", String(ICON_SIZE2));
      svg.setAttribute("viewBox", "0 0 1082 1024");
      svg.setAttribute("fill", "currentColor");
      svg.setAttribute("aria-hidden", "true");
      for (const pathData of DELETE_ALL_ICON_PATHS) {
        const iconPath = document.createElementNS(SVG_NAMESPACE3, "path");
        iconPath.setAttribute("d", pathData);
        svg.appendChild(iconPath);
      }
      return svg;
    }
    function createMenuItem2(template, label, onSelect) {
      const wrap = template.cloneNode(true);
      wrap.setAttribute(INJECTED_ATTRIBUTE2, "");
      const labelNode = wrap.querySelector(MENU_LABEL_SELECTOR2);
      if (labelNode !== null) labelNode.textContent = label;
      const iconNode = wrap.querySelector(MENU_ICON_SELECTOR2) ?? wrap.querySelector("svg");
      if (iconNode === null) {
        console.error("[delete-session] \u5DE5\u4F5C\u533A\u83DC\u5355\u9879\u6A21\u677F\u7F3A\u5C11\u56FE\u6807\u8282\u70B9\uFF0C\u6CBF\u7528\u5BBF\u4E3B\u56FE\u6807:", label);
      } else {
        iconNode.replaceChildren(createDeleteAllIcon());
      }
      const button = wrap.querySelector("button");
      if (!(button instanceof HTMLElement)) {
        console.error("[delete-session] \u5DE5\u4F5C\u533A\u83DC\u5355\u9879\u6A21\u677F\u7F3A\u5C11\u6309\u94AE\uFF0C\u5165\u53E3\u4E0D\u53EF\u70B9\u51FB:", label);
        return wrap;
      }
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect();
      });
      return wrap;
    }
    function injectMenuItem(menu, target, sessions, uiWorkspace, t) {
      if (menu.querySelector(`[${INJECTED_ATTRIBUTE2}]`) !== null) return;
      const items = Array.from(menu.querySelectorAll(MENU_ITEM_SELECTOR));
      const deleteWorkspace = items.find(
        (item2) => DELETE_WORKSPACE_LABELS.includes((item2.textContent ?? "").trim())
      );
      if (deleteWorkspace === void 0) return;
      const sessionIds = collectDeletableSessions(sessions, uiWorkspace, target.workspaceId);
      if (sessionIds.length === 0) return;
      const item = createMenuItem2(deleteWorkspace, t("deleteAllAction"), () => {
        closeMenu();
        window.requestAnimationFrame(() => {
          deleteConfirmStore.request({
            kind: "workspace",
            workspaceId: target.workspaceId,
            title: target.title,
            sessionIds
          });
        });
      });
      deleteWorkspace.parentElement?.insertBefore(item, deleteWorkspace);
    }
    function installWorkspaceMenu(t, sessions, readUiWorkspace) {
      let pending3;
      let scheduled = false;
      let disposed = false;
      const onClick = (event) => {
        const node = event.target;
        if (!(node instanceof Element)) return;
        const row = node.closest(WORKSPACE_ROW_SELECTOR2);
        if (!(row instanceof HTMLElement)) return;
        const button = node.closest("button");
        if (button === null || row.querySelector("button") !== button) return;
        pending3 = readWorkspaceRow(row);
      };
      const scan = () => {
        scheduled = false;
        if (disposed || pending3 === void 0) return;
        const menu = document.querySelector(MENU_SELECTOR);
        if (!(menu instanceof HTMLElement)) return;
        if (readDeleteSessionEnabled()) {
          injectMenuItem(menu, pending3, sessions, readUiWorkspace(), t);
        }
        pending3 = void 0;
      };
      const schedule = () => {
        if (scheduled || disposed) return;
        scheduled = true;
        window.requestAnimationFrame(scan);
      };
      const observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
      document.addEventListener("click", onClick, true);
      return () => {
        disposed = true;
        observer.disconnect();
        document.removeEventListener("click", onClick, true);
      };
    }

    // src/features/delete-session/client.tsx
    var ROW_ACTION_SLOT = "sidebar.workspaces.session.row.action";
    var OVERLAY_SLOT2 = "shell.overlay";
    function resolveSession(sessions, sessionId) {
      const summary = sessions.list.getSnapshot().byId[sessionId];
      return {
        running: summary?.running === true,
        isCurrent: (summary?.retainedBy?.mainView ?? 0) > 0
      };
    }
    function findWorkspaceId2(uiWorkspace, sessionId) {
      const items = uiWorkspace?.workspaces?.list.getSnapshot().items ?? [];
      return items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId;
    }
    function pickNextSession(sessions, uiWorkspace, workspaceId, removedIds) {
      const state = sessions.list.getSnapshot();
      const workspaceState = uiWorkspace?.workspaces?.list.getSnapshot();
      const workspace = workspaceState?.items.find((item) => item.workspaceId === workspaceId);
      const memberIds = workspace?.sessionIds ?? state.ids;
      const archived = new Set(workspaceState?.archivedSessionIds ?? []);
      const candidates = memberIds.flatMap((id) => {
        const summary = state.byId[id];
        return removedIds.has(id) || summary === void 0 || archived.has(id) ? [] : [{ id, summary }];
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
    function apply8(ctx, t) {
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
          const workspaceId = findWorkspaceId2(uiWorkspace, sessionId);
          await requestDeleteSession2(sessionId);
          const stillCurrent = resolveSession(sessions, sessionId).isCurrent;
          sessions.handleSessionRemoved?.(sessionId);
          if (!wasCurrent || !stillCurrent) return;
          const next = pickNextSession(sessions, uiWorkspace, workspaceId, /* @__PURE__ */ new Set([sessionId]));
          if (next !== void 0) {
            uiWorkspace?.openSession?.(next);
            return;
          }
          uiWorkspace?.startSession?.(workspaceId);
        };
        const deleteWorkspaceSessions = async (workspaceId, sessionIds) => {
          const currentId = sessionIds.find((id) => resolveSession(sessions, id).isCurrent);
          const report = await requestDeleteSessions(sessionIds);
          const stillCurrent = currentId !== void 0 && report.deleted.includes(currentId) && resolveSession(sessions, currentId).isCurrent;
          for (const id of report.deleted) sessions.handleSessionRemoved?.(id);
          if (!stillCurrent) return report;
          const next = pickNextSession(sessions, uiWorkspace, workspaceId, new Set(report.deleted));
          if (next !== void 0) {
            uiWorkspace?.openSession?.(next);
            return report;
          }
          uiWorkspace?.startSession?.(workspaceId);
          return report;
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
            (props) => /* @__PURE__ */ import_react16.default.createElement(
              DeleteSessionButton,
              {
                ...props,
                t
              }
            )
          )
        );
        ctx.slots.inject(
          OVERLAY_SLOT2,
          () => ctx.slots.register(
            {
              name: OVERLAY_SLOT2,
              id: "delete-session-confirm",
              inject: () => ({
                hooks: { request: deleteConfirmStore },
                deleteSession,
                deleteWorkspaceSessions,
                settle: deleteConfirmStore.settle
              })
            },
            (props) => /* @__PURE__ */ import_react16.default.createElement(
              DeleteSessionDialog,
              {
                ...props,
                t
              }
            )
          )
        );
        if (readDeleteSessionEnabled()) {
          ctx.effect(
            () => installWorkspaceMenu(t, sessions, () => uiWorkspace),
            "delete-session: workspace menu"
          );
        }
      });
    }

    // src/features/delete-session/locales.ts
    var deleteSessionLocales = {
      zh: {
        // 开关标题
        title: "\u5220\u9664\u4F1A\u8BDD",
        // 开关用途说明：说明打开后会话行会出现删除入口、工作区菜单会出现批量删除入口，且删除前需要先在弹窗里确认
        description: "\u4F1A\u8BDD\u60AC\u505C\u64CD\u4F5C\u91CC\u65B0\u589E\u5220\u9664\u6309\u94AE\uFF0C\u5DE5\u4F5C\u533A\u300C\u66F4\u591A\u300D\u83DC\u5355\u53EF\u4E00\u952E\u5220\u9664\u5168\u90E8\u4F1A\u8BDD\uFF0C\u786E\u8BA4\u540E\u6E05\u9664\u672C\u5730\u8BB0\u5F55\u3002",
        // 开关状态写入失败时的提示
        saveFailed: "\u4FDD\u5B58\u5F00\u5173\u72B6\u6001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u5B58\u50A8\u6743\u9650\u3002",
        // 会话行删除按钮的可访问名称与悬停提示
        action: "\u5220\u9664\u4F1A\u8BDD",
        // 工作区「更多」菜单里的批量删除入口
        deleteAllAction: "\u5220\u9664\u6240\u6709\u4F1A\u8BDD",
        // 确认弹窗标题
        confirmTitle: "\u5220\u9664\u4F1A\u8BDD",
        // 确认弹窗的说明文字，指出弹窗里给出的是哪一条会话
        confirmTarget: "\u5373\u5C06\u5220\u9664\u4EE5\u4E0B\u4F1A\u8BDD\uFF1A",
        // 确认弹窗的删除范围说明
        confirmMessage: "\u5C06\u5220\u9664\u8BE5\u4F1A\u8BDD\u7684\u672C\u5730\u8BB0\u5F55\uFF1A\u5BF9\u8BDD\u6B63\u6587\u3001\u6807\u9898\u7F13\u5B58\u4E0E\u5217\u8868\u8BB0\u5F55\uFF0C\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\u3002",
        // 批量删除确认弹窗标题
        confirmAllTitle: "\u5220\u9664\u6240\u6709\u4F1A\u8BDD",
        // 批量删除确认弹窗的说明文字，指出弹窗里给出的是哪个工作区
        confirmAllTarget: "\u5373\u5C06\u5220\u9664\u4EE5\u4E0B\u5DE5\u4F5C\u533A\u4E2D\u7684\u4F1A\u8BDD\uFF1A",
        // 批量删除确认弹窗的会话数量说明，{count} 为条数
        confirmAllCount: "\u5171 {count} \u6761\u4F1A\u8BDD",
        // 批量删除的删除范围说明：说明跳过运行中的会话、包含归档会话且无法恢复
        confirmAllMessage: "\u5C06\u5220\u9664\u8BE5\u5DE5\u4F5C\u533A\u4E2D\u6240\u6709\u4E0D\u5728\u8FD0\u884C\u4E2D\u7684\u4F1A\u8BDD\uFF08\u542B\u5DF2\u5F52\u6863\u4F1A\u8BDD\uFF09\u7684\u672C\u5730\u8BB0\u5F55\uFF0C\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\uFF1B\u6B63\u5728\u6267\u884C\u4EFB\u52A1\u7684\u4F1A\u8BDD\u4F1A\u4FDD\u7559\u3002",
        // 确认弹窗的取消按钮
        confirmCancel: "\u53D6\u6D88",
        // 确认弹窗的确认按钮
        confirmDelete: "\u5220\u9664",
        // 删除进行中的按钮与状态文字
        deleting: "\u6B63\u5728\u5220\u9664",
        // 删除失败时的提示前缀，后面拼接宿主返回的原因
        deleteFailed: "\u5220\u9664\u4F1A\u8BDD\u5931\u8D25",
        // 批量删除部分失败时的提示，{count} 为失败条数
        deleteAllPartial: "\u6709 {count} \u6761\u4F1A\u8BDD\u5220\u9664\u5931\u8D25\uFF0C\u53EF\u5173\u95ED\u540E\u91CD\u65B0\u64CD\u4F5C\u3002"
      },
      en: {
        // Switch title
        title: "Delete sessions",
        // Switch description covering the row action, the bulk workspace entry, and the confirmation step
        description: "Adds a delete button to session hover actions and a delete-all entry to the workspace menu; a dialog confirms first.",
        // Shown when the switch state cannot be persisted
        saveFailed: "Could not save the switch state. Check browser storage permissions.",
        // Accessible name and hover hint of the row delete button
        action: "Delete session",
        // Bulk delete entry in the workspace More menu
        deleteAllAction: "Delete all sessions",
        // Confirmation dialog title
        confirmTitle: "Delete session",
        // Dialog line introducing the session being deleted
        confirmTarget: "About to delete:",
        // Dialog text describing what is removed
        confirmMessage: "This removes the session\u2019s local records: the conversation log, its title cache, and its list entry. It cannot be undone.",
        // Bulk confirmation dialog title
        confirmAllTitle: "Delete all sessions",
        // Dialog line introducing the workspace whose sessions are deleted
        confirmAllTarget: "About to delete sessions in:",
        // Session count line of the bulk dialog; {count} is the number of sessions
        confirmAllCount: "{count} sessions in total",
        // Bulk dialog text: running sessions are kept, archived ones included, irreversible
        confirmAllMessage: "This removes every non-running session in this workspace, including archived ones: conversation logs, title caches, and list entries. It cannot be undone; sessions with running work are kept.",
        // Cancel button of the confirmation dialog
        confirmCancel: "Cancel",
        // Confirming delete button
        confirmDelete: "Delete",
        // Button label and status text while deleting
        deleting: "Deleting",
        // Prefix for a failed delete, followed by the host's reason
        deleteFailed: "Could not delete the session",
        // Shown when part of a bulk delete failed; {count} is the number of failed sessions
        deleteAllPartial: "{count} sessions could not be deleted. Close and try again."
      }
    };

    // src/features/delete-session/toggle.tsx
    var import_react17 = __toESM(require("react"), 1);
    function TrashIcon() {
      return /* @__PURE__ */ import_react17.default.createElement(
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
        /* @__PURE__ */ import_react17.default.createElement("path", { d: "M4 7h16" }),
        /* @__PURE__ */ import_react17.default.createElement("path", { d: "M10 4h4" }),
        /* @__PURE__ */ import_react17.default.createElement("path", { d: "M9 7v11" }),
        /* @__PURE__ */ import_react17.default.createElement("path", { d: "M15 7v11" }),
        /* @__PURE__ */ import_react17.default.createElement("path", { d: "M6 7h12l-1 13H7L6 7Z" })
      );
    }
    function DeleteSessionToggle({ t }) {
      const [enabled, setEnabled] = (0, import_react17.useState)(readDeleteSessionEnabled);
      const [saveFailed, setSaveFailed] = (0, import_react17.useState)(false);
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
      return /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex h-full flex-col" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react17.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react17.default.createElement(TrashIcon, null)), /* @__PURE__ */ import_react17.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react17.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react17.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description"))), /* @__PURE__ */ import_react17.default.createElement(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled,
          "aria-label": t("title"),
          onClick: handleToggle,
          className: cn(
            "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
            enabled ? "bg-brand" : "bg-line2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          )
        },
        /* @__PURE__ */ import_react17.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-4 w-4 aio-switch bg-base shadow transition-transform",
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      )), saveFailed ? /* @__PURE__ */ import_react17.default.createElement("p", { className: "mt-0.5 text-[12px] leading-[16px] text-danger" }, t("saveFailed")) : null);
    }

    // src/features/delete-session/index.tsx
    var deleteSessionFeature = {
      id: "delete-session",
      group: "layout",
      order: 40,
      reloadsPage: true,
      switch: DeleteSessionToggle,
      client: { apply: apply8 },
      locales: deleteSessionLocales
    };
    var delete_session_default = deleteSessionFeature;

    // src/features/power-pack/client.tsx
    var client_exports = {};
    __export(client_exports, {
      apply: () => apply9
    });
    var import_react19 = __toESM(require("react"), 1);

    // src/features/power-pack/seat.tsx
    var import_react18 = __toESM(require("react"), 1);
    var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");
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
      const [open, setOpen] = (0, import_react18.useState)(false);
      const selected = options.find((option) => option.id === current);
      const canOpen = !disabled && options.length > 0;
      const items = options.map((option) => ({
        id: option.id,
        label: /* @__PURE__ */ import_react18.default.createElement("span", { className: "ufIuna_item" }, /* @__PURE__ */ import_react18.default.createElement("span", { className: "ufIuna_itemName" }, option.name), option.description ? (
          // 选项说明
          /* @__PURE__ */ import_react18.default.createElement("span", { className: "ufIuna_itemDesc" }, option.description)
        ) : null)
      }));
      return /* @__PURE__ */ import_react18.default.createElement(
        import_dsh_client_ui_primitives3.Menu,
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
            /* @__PURE__ */ import_react18.default.createElement(
              "button",
              {
                type: "button",
                className: "ufIuna_seat",
                "aria-haspopup": "menu",
                "aria-expanded": open && canOpen,
                disabled: !canOpen,
                onClick: () => setOpen((value) => !value)
              },
              /* @__PURE__ */ import_react18.default.createElement(import_dsh_client_ui_primitives3.IconAgentPresetOutlineRegular, { className: "ufIuna_seatIcon" }),
              /* @__PURE__ */ import_react18.default.createElement("span", { className: "ufIuna_seatLabel" }, selected === void 0 ? placeholder : selected.name),
              /* @__PURE__ */ import_react18.default.createElement(import_dsh_client_ui_primitives3.IconChevronDownOutlineRegular, { className: "ufIuna_chevron" })
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
      const actionsRef = (0, import_react18.useRef)({ load, applyStaged });
      actionsRef.current = { load, applyStaged };
      (0, import_react18.useEffect)(() => {
        void actionsRef.current.load();
        if (sessionId !== void 0) void actionsRef.current.applyStaged();
      }, [sessionId]);
      const modes = snapshot.modes.map((preset) => ({
        id: preset.id,
        name: presetName(preset, t),
        description: presetDescription(preset, t)
      }));
      const disabled = snapshot.status === "loading";
      return /* @__PURE__ */ import_react18.default.createElement("div", null, /* @__PURE__ */ import_react18.default.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react18.default.createElement(
        PresetDropdown,
        {
          current: snapshot.mode,
          options: modes,
          placeholder: t("modeLabel"),
          disabled,
          onPick: (id) => void selectMode(id)
        }
      ), snapshot.packsEnabled ? /* @__PURE__ */ import_react18.default.createElement(
        PresetDropdown,
        {
          current: snapshot.pack,
          options: snapshot.packs,
          placeholder: t("seatLabel"),
          disabled,
          onPick: (id) => void selectPack(id)
        }
      ) : null), snapshot.error ? /* @__PURE__ */ import_react18.default.createElement("p", { className: "mt-1 text-[12px] leading-4 text-danger", role: "alert" }, snapshot.error === "session already started" ? t("seatSessionStarted") : `${t("seatSelectFailed")}\uFF1A${snapshot.error}`) : null);
    }

    // src/features/power-pack/api.ts
    var ENDPOINT4 = "/dsh-all-in-one/power-packs";
    var REQUEST_TIMEOUT_MS4 = 2e4;
    async function request(init = {}) {
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
    function setPowerPackEnabled(enabled) {
      const body = { action: "setEnabled", enabled };
      return request({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
    }

    // src/features/power-pack/seat-store.ts
    var PRESET_ID_PREFIX = "power-pack-";
    function initialState() {
      return { status: "idle", modes: [], packs: [], mode: "", pack: "", packsEnabled: false, error: null };
    }
    function createSeatStore() {
      let snapshot = initialState();
      const listeners4 = /* @__PURE__ */ new Set();
      return {
        getSnapshot: () => snapshot,
        set(patch) {
          snapshot = { ...snapshot, ...patch };
          for (const listener of listeners4) listener();
        },
        subscribe(listener) {
          listeners4.add(listener);
          return () => {
            listeners4.delete(listener);
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
          let packsEnabled = false;
          try {
            const payload = await loadPowerPacks();
            packsEnabled = payload.enabled;
            packs = payload.enabled ? payload.packs.map(({ id, name, description }) => ({ id, name, description })) : [];
            defaultPackId = payload.enabled ? payload.defaultPackId : "";
            recent = payload.enabled ? payload.recentComposed[0] : void 0;
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
          const pack = packsEnabled ? staged ? staged.pack : fromSession.pack || fallbackPack : "";
          store.set({ status: "ready", modes, packs, mode, pack, packsEnabled, error: null });
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
    function apply9(ctx, t) {
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
            (props) => /* @__PURE__ */ import_react19.default.createElement(PowerPackSeat, { ...props, t })
          )
        );
      });
    }

    // src/features/power-pack/entry.tsx
    var import_react21 = __toESM(require("react"), 1);

    // src/components/CardChevron.tsx
    var import_react20 = __toESM(require("react"), 1);
    var CHEVRON_SIZE = 14;
    function CardChevron() {
      return /* @__PURE__ */ import_react20.default.createElement(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: CHEVRON_SIZE,
          height: CHEVRON_SIZE,
          "aria-hidden": "true",
          className: "shrink-0",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.6",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        /* @__PURE__ */ import_react20.default.createElement("path", { d: "M6 3.5 10.5 8 6 12.5" })
      );
    }

    // src/features/power-pack/entry.tsx
    function PowerPackIcon() {
      return /* @__PURE__ */ import_react21.default.createElement(
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
        /* @__PURE__ */ import_react21.default.createElement("path", { d: "M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" }),
        /* @__PURE__ */ import_react21.default.createElement("circle", { cx: "10", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react21.default.createElement("circle", { cx: "14", cy: "12", r: "1" }),
        /* @__PURE__ */ import_react21.default.createElement("circle", { cx: "18", cy: "12", r: "1" })
      );
    }
    function PowerPackEntry({ t, open }) {
      const [payload, setPayload] = (0, import_react21.useState)(null);
      const [error, setError] = (0, import_react21.useState)(null);
      const [saving, setSaving] = (0, import_react21.useState)(false);
      const translate = (0, import_react21.useRef)(t);
      translate.current = t;
      (0, import_react21.useEffect)(() => {
        let active = true;
        void loadPowerPacks().then((next) => {
          if (active) setPayload(next);
        }).catch((failure) => {
          if (!active) return;
          console.error("[power-pack] \u8BFB\u53D6\u6280\u80FD\u5305\u5F00\u5173\u72B6\u6001\u5931\u8D25:", failure);
          setError(translate.current("loadFailed"));
        });
        return () => {
          active = false;
        };
      }, []);
      const enabled = payload?.enabled === true;
      const hasPacks = (payload?.packs.length ?? 0) > 0;
      const needPacks = payload !== null && !hasPacks;
      const toggleDisabled = payload === null || saving || needPacks;
      const handleToggle = async () => {
        if (toggleDisabled) return;
        setSaving(true);
        setError(null);
        try {
          const next = await setPowerPackEnabled(!enabled);
          setPayload(next);
          window.location.reload();
        } catch (failure) {
          console.error("[power-pack] \u4FDD\u5B58\u6280\u80FD\u5305\u5F00\u5173\u5931\u8D25:", failure);
          setError(`${t("saveFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        } finally {
          setSaving(false);
        }
      };
      return (
        // 卡片容器：主体按钮、开关与设置按钮是并列的交互区，不能互相嵌套
        /* @__PURE__ */ import_react21.default.createElement("div", { className: "flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 transition hover:bg-layer2" }, /* @__PURE__ */ import_react21.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            className: "flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          /* @__PURE__ */ import_react21.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react21.default.createElement(PowerPackIcon, null)),
          /* @__PURE__ */ import_react21.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react21.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react21.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react21.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)
        ), /* @__PURE__ */ import_react21.default.createElement("div", { className: "flex shrink-0 flex-col items-center justify-between gap-1 self-stretch" }, /* @__PURE__ */ import_react21.default.createElement(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": enabled,
            "aria-label": needPacks ? t("needPacks") : t("title"),
            title: needPacks ? t("needPacks") : void 0,
            disabled: toggleDisabled,
            onClick: () => void handleToggle(),
            className: cn(
              "flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition",
              enabled ? "bg-brand" : "bg-line2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )
          },
          /* @__PURE__ */ import_react21.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        ), /* @__PURE__ */ import_react21.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            "aria-label": t("title"),
            title: t("title"),
            className: "flex shrink-0 items-center justify-center gap-0.5 self-end rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          t("settingsAction"),
          /* @__PURE__ */ import_react21.default.createElement(CardChevron, null)
        )))
      );
    }

    // src/features/power-pack/locales.ts
    var powerPackLocales = {
      zh: {
        // 网格入口标题
        title: "\u6280\u80FD\u5305",
        // 网格入口描述
        description: "\u6309\u4EFB\u52A1\u7EC4\u5408\u6280\u80FD\u3001\u63D2\u4EF6\u4E0E MCP\uFF0C\u65B0\u5EFA\u5BF9\u8BDD\u65F6\u9009\u7528\u3002",
        // 卡片右下角「设置」入口的文案
        settingsAction: "\u8BBE\u7F6E",
        // 没有任何技能包时开关被禁用，用它说明为什么打不开
        needPacks: "\u5148\u521B\u5EFA\u6280\u80FD\u5305\u624D\u80FD\u6253\u5F00",
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
        description: "Bundle skills, plugins and MCP servers per task, then pick one when starting a chat.",
        // Label of the "settings" entry at the card's bottom-right corner
        settingsAction: "Settings",
        // Shown on the disabled switch when no power pack exists yet
        needPacks: "Create a power pack first",
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
    var import_react25 = __toESM(require("react"), 1);

    // src/features/power-pack/PackEditor.tsx
    var import_react24 = __toESM(require("react"), 1);

    // src/shell/page-actions.ts
    var import_react22 = require("react");
    var PageActionsContext = (0, import_react22.createContext)(null);

    // src/features/power-pack/ResourceRuleField.tsx
    var import_react23 = __toESM(require("react"), 1);
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
      const [query, setQuery] = (0, import_react23.useState)("");
      const selected = (0, import_react23.useMemo)(() => new Set(rule.items), [rule.items]);
      const visibleOptions = (0, import_react23.useMemo)(() => {
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
      return /* @__PURE__ */ import_react23.default.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "flex flex-wrap items-center gap-3" }, title ? (
        // 分组标签
        /* @__PURE__ */ import_react23.default.createElement("span", { className: "text-[12px] font-semibold text-primary" }, title)
      ) : null, /* @__PURE__ */ import_react23.default.createElement("div", { className: "ml-auto flex items-center gap-2" }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "inline-flex", role: "group" }, MODE_ORDER.map((mode, index) => {
        const active = rule.mode === mode;
        return /* @__PURE__ */ import_react23.default.createElement(
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
      })), selected.size > 0 ? /* @__PURE__ */ import_react23.default.createElement("span", { className: "text-[11px] text-secondary" }, selected.size) : null)), rule.mode === "all" ? null : /* @__PURE__ */ import_react23.default.createElement("div", { className: "flex flex-col gap-2" }, searchPlaceholder ? /* @__PURE__ */ import_react23.default.createElement(
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
        /* @__PURE__ */ import_react23.default.createElement("p", { className: "py-2 text-[12px] text-secondary" }, emptyText)
      ) : /* @__PURE__ */ import_react23.default.createElement("ul", { className: "max-h-72 overflow-y-auto" }, visibleOptions.map((option) => {
        const checked = selected.has(option.id);
        return /* @__PURE__ */ import_react23.default.createElement("li", { key: option.id }, /* @__PURE__ */ import_react23.default.createElement(
          "label",
          {
            className: cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition",
              checked ? "bg-layer2" : "hover:bg-layer2"
            )
          },
          /* @__PURE__ */ import_react23.default.createElement(
            "input",
            {
              type: "checkbox",
              checked,
              onChange: () => toggle(option.id),
              className: "mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
            }
          ),
          /* @__PURE__ */ import_react23.default.createElement("span", { className: "min-w-0" }, /* @__PURE__ */ import_react23.default.createElement("span", { className: "flex flex-wrap items-center gap-1.5" }, /* @__PURE__ */ import_react23.default.createElement("span", { className: "text-[12px] font-medium text-primary" }, option.label), option.badge ? (
            // 条目来源标记，如「已安装插件」
            /* @__PURE__ */ import_react23.default.createElement("span", { className: "rounded border border-line4 px-1 py-px text-[10px] text-secondary" }, option.badge)
          ) : null), option.description ? (
            // 条目说明
            /* @__PURE__ */ import_react23.default.createElement("span", { className: "mt-0.5 block text-[12px] leading-[18px] text-secondary" }, option.description)
          ) : null, checked && option.warning ? (
            // 选中后才提示的风险，避免干扰普通浏览
            /* @__PURE__ */ import_react23.default.createElement("span", { className: "mt-0.5 block text-[12px] leading-[18px] text-warn" }, option.warning)
          ) : null)
        ));
      }))));
    }

    // src/features/power-pack/PackEditor.tsx
    var INPUT_CLASS = "w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    var GROUP_CLASS = "border-t border-line4 pt-4";
    function PackEditor({ initial, catalog, saving, error, onSave, t }) {
      const [draft, setDraft] = (0, import_react24.useState)(initial);
      const [localError, setLocalError] = (0, import_react24.useState)(null);
      const setPageActions = (0, import_react24.useContext)(PageActionsContext);
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
      const validate = (0, import_react24.useCallback)(() => {
        if (draft.name.trim() === "") return t("nameRequired");
        return void 0;
      }, [draft, t]);
      const handleSave = (0, import_react24.useCallback)(() => {
        const message = validate();
        if (message) {
          setLocalError(message);
          return;
        }
        setLocalError(null);
        onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() });
      }, [draft, onSave, validate]);
      const saveAction = (0, import_react24.useMemo)(
        () => /* @__PURE__ */ import_react24.default.createElement(Button, { variant: "outline", disabled: saving, onClick: handleSave }, saving ? t("saving") : t("save")),
        [handleSave, saving, t]
      );
      (0, import_react24.useEffect)(() => {
        if (!setPageActions) return;
        setPageActions(saveAction);
        return () => setPageActions(null);
      }, [saveAction, setPageActions]);
      return /* @__PURE__ */ import_react24.default.createElement("div", { className: "rounded-xl border border-line4 bg-layer1" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex flex-col gap-4 p-4" }, /* @__PURE__ */ import_react24.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("nameLabel")), /* @__PURE__ */ import_react24.default.createElement(
        "input",
        {
          value: draft.name,
          placeholder: t("namePlaceholder"),
          onChange: (event) => patch({ name: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react24.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("descriptionLabel")), /* @__PURE__ */ import_react24.default.createElement(
        "input",
        {
          value: draft.description,
          placeholder: t("descriptionPlaceholder"),
          onChange: (event) => patch({ description: event.target.value }),
          className: INPUT_CLASS
        }
      )), /* @__PURE__ */ import_react24.default.createElement("div", { className: GROUP_CLASS }, /* @__PURE__ */ import_react24.default.createElement(
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
      )), /* @__PURE__ */ import_react24.default.createElement("div", { className: GROUP_CLASS }, /* @__PURE__ */ import_react24.default.createElement(
        ResourceRuleField,
        {
          title: t("pluginsTitle"),
          rule: draft.plugins,
          options: pluginOptions,
          modeLabels,
          emptyText: t("noSkills"),
          onChange: (rule) => patchRule("plugins", rule)
        }
      ), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-[12px] leading-[18px] text-secondary" }, t("pluginsGlobalHint"))), /* @__PURE__ */ import_react24.default.createElement("div", { className: `flex flex-col gap-3 ${GROUP_CLASS}` }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-[12px] font-semibold text-primary" }, t("mcpTitle")), /* @__PURE__ */ import_react24.default.createElement(
        ResourceRuleField,
        {
          rule: draft.mcp,
          options: globalMcpOptions,
          modeLabels,
          emptyText: t("mcpEmpty"),
          onChange: (rule) => patchRule("mcp", rule)
        }
      ), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-[12px] leading-[18px] text-secondary" }, t("mcpGlobalHint"))), /* @__PURE__ */ import_react24.default.createElement("label", { className: `block ${GROUP_CLASS}` }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("systemPromptLabel")), /* @__PURE__ */ import_react24.default.createElement(
        "textarea",
        {
          value: draft.systemPrompt,
          placeholder: t("systemPromptPlaceholder"),
          onChange: (event) => patch({ systemPrompt: event.target.value }),
          rows: 15,
          className: INPUT_CLASS
        }
      )), localError ?? error ? /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-[12px] leading-[18px] text-danger", role: "alert" }, localError ?? error) : null));
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
      const [payload, setPayload] = (0, import_react25.useState)(null);
      const [editing, setEditing] = (0, import_react25.useState)(null);
      const [loading, setLoading] = (0, import_react25.useState)(true);
      const [saving, setSaving] = (0, import_react25.useState)(false);
      const [defaulting, setDefaulting] = (0, import_react25.useState)(false);
      const [error, setError] = (0, import_react25.useState)(null);
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
      (0, import_react25.useEffect)(() => {
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
      const handleSave = (0, import_react25.useCallback)(async (pack) => {
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
      const submitDraft = (0, import_react25.useCallback)((pack) => {
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
        return /* @__PURE__ */ import_react25.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react25.default.createElement("header", null, /* @__PURE__ */ import_react25.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("pageTitle")), /* @__PURE__ */ import_react25.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("pageDescription"))), /* @__PURE__ */ import_react25.default.createElement(
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
      return /* @__PURE__ */ import_react25.default.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ import_react25.default.createElement("header", { className: "flex flex-wrap items-start justify-between gap-3" }, /* @__PURE__ */ import_react25.default.createElement("div", null, /* @__PURE__ */ import_react25.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("pageTitle")), /* @__PURE__ */ import_react25.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("pageDescription"))), /* @__PURE__ */ import_react25.default.createElement(
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
      )), error ? /* @__PURE__ */ import_react25.default.createElement("p", { className: "rounded-lg border border-line4 bg-layer1 px-3 py-2 text-[12px] text-danger", role: "alert" }, error, /* @__PURE__ */ import_react25.default.createElement(
        "button",
        {
          type: "button",
          className: "ml-2 cursor-pointer border-0 bg-transparent p-0 text-[12px] underline",
          onClick: () => void reload()
        },
        t("retry")
      )) : null, loading ? (
        // 首次加载中的占位
        /* @__PURE__ */ import_react25.default.createElement("p", { className: "text-[12px] text-secondary" }, "\u2026")
      ) : (payload?.packs.length ?? 0) === 0 ? (
        // 尚未创建技能包时的空态
        /* @__PURE__ */ import_react25.default.createElement("p", { className: "rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary" }, t("empty"))
      ) : /* @__PURE__ */ import_react25.default.createElement("ul", { className: "flex flex-col gap-3" }, payload?.packs.map((pack) => /* @__PURE__ */ import_react25.default.createElement(
        "li",
        {
          key: pack.id,
          className: "rounded-xl border border-line4 bg-layer1 px-4 py-3"
        },
        /* @__PURE__ */ import_react25.default.createElement("div", { className: "flex flex-wrap items-start justify-between gap-2" }, /* @__PURE__ */ import_react25.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react25.default.createElement("h3", { className: "text-[13px] font-medium text-primary" }, pack.name), pack.description ? /* @__PURE__ */ import_react25.default.createElement("p", { className: "mt-1 text-[12px] leading-[18px] text-secondary" }, pack.description) : null, /* @__PURE__ */ import_react25.default.createElement("p", { className: "mt-1 text-[12px] text-secondary" }, t("skillsTitle"), ": ", modeLabel(pack.skills.mode, t), " \xB7 ", t("pluginsTitle"), ":", " ", modeLabel(pack.plugins.mode, t), " \xB7 ", t("mcpTitle"), ":", " ", modeLabel(pack.mcp.mode, t))), /* @__PURE__ */ import_react25.default.createElement("div", { className: "flex shrink-0 items-center gap-2" }, payload?.defaultPackId === pack.id ? (
          // 默认技能包标识：绿色描边与打钩，和可点击的「设为默认」按钮区分开
          /* @__PURE__ */ import_react25.default.createElement("span", { className: "inline-flex items-center gap-1 rounded-lg border border-success px-3 py-1.5 text-[12px] text-success" }, /* @__PURE__ */ import_react25.default.createElement(
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
            /* @__PURE__ */ import_react25.default.createElement("path", { d: "M20 6 9 17l-5-5" })
          ), t("defaultBadge"))
        ) : (
          // 设为默认按钮：新建会话时自动预选该技能包
          /* @__PURE__ */ import_react25.default.createElement(
            Button,
            {
              variant: "outline",
              disabled: defaulting,
              onClick: () => void handleSetDefault(pack.id)
            },
            t("setDefault")
          )
        ), /* @__PURE__ */ import_react25.default.createElement(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setError(null);
              setEditing(pack);
            }
          },
          t("edit")
        ), /* @__PURE__ */ import_react25.default.createElement(Button, { variant: "danger", onClick: () => void handleDelete(pack.id) }, t("delete"))))
      ))), payload ? /* @__PURE__ */ import_react25.default.createElement("p", { className: "text-[12px] text-secondary" }, t("storageHint"), ": ", /* @__PURE__ */ import_react25.default.createElement("code", { className: "break-all" }, payload.storagePath)) : null);
    }

    // src/features/power-pack/index.tsx
    var powerPackFeature = {
      id: "power-pack",
      group: "config",
      order: 10,
      entry: PowerPackEntry,
      page: PowerPackPage,
      client: client_exports,
      locales: powerPackLocales
    };
    var power_pack_default = powerPackFeature;

    // src/features/project-memory/entry.tsx
    var import_react26 = __toESM(require("react"), 1);

    // src/features/project-memory/api.ts
    var ENDPOINT5 = "/dsh-all-in-one/memory";
    var REQUEST_TIMEOUT_MS5 = 1e4;
    async function request2(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS5);
      try {
        const response = await fetch(new URL(ENDPOINT5, window.location.origin).toString(), {
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
      return /* @__PURE__ */ import_react26.default.createElement(
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
        /* @__PURE__ */ import_react26.default.createElement("path", { d: "M6 4h12v17l-6-4-6 4V4Z" }),
        /* @__PURE__ */ import_react26.default.createElement("path", { d: "M9.5 9h5" })
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
      const [payload, setPayload] = (0, import_react26.useState)(null);
      const [error, setError] = (0, import_react26.useState)(null);
      const [saving, setSaving] = (0, import_react26.useState)(false);
      const translate = (0, import_react26.useRef)(t);
      translate.current = t;
      (0, import_react26.useEffect)(() => {
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
        /* @__PURE__ */ import_react26.default.createElement("div", { className: "flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 transition hover:bg-layer2" }, /* @__PURE__ */ import_react26.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            className: "flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          /* @__PURE__ */ import_react26.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react26.default.createElement(MemoryIcon, null)),
          /* @__PURE__ */ import_react26.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react26.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react26.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react26.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)
        ), /* @__PURE__ */ import_react26.default.createElement("div", { className: "flex shrink-0 flex-col items-center justify-between gap-1 self-stretch" }, /* @__PURE__ */ import_react26.default.createElement(
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
          /* @__PURE__ */ import_react26.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        ), /* @__PURE__ */ import_react26.default.createElement(
          "button",
          {
            type: "button",
            onClick: open,
            "aria-label": t("pathTitle"),
            title: t("pathTitle"),
            className: "flex items-center justify-center gap-0.5 rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          },
          t("settingsAction"),
          /* @__PURE__ */ import_react26.default.createElement(CardChevron, null)
        )))
      );
    }

    // src/features/project-memory/locales.ts
    var projectMemoryLocales = {
      zh: {
        // 开关标题
        title: "\u9879\u76EE\u8BB0\u5FC6",
        // 开关用途说明：说明打开后记忆会写入文件，并在对话开始时进入上下文
        description: "\u8BB0\u4F4F\u9879\u76EE\u7EA6\u5B9A\u4E0E\u504F\u597D\uFF0C\u5199\u5165\u6587\u4EF6\u5E76\u5728\u540E\u7EED\u5BF9\u8BDD\u81EA\u52A8\u52A0\u8F7D\u3002",
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
        description: "Remembers project conventions and preferences in files loaded into later chats.",
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
    var import_react27 = __toESM(require("react"), 1);
    var INPUT_CLASS2 = "w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand";
    function isValidRoot(value) {
      const trimmed = value.trim();
      return trimmed === "" || trimmed === "~" || trimmed.startsWith("/") || trimmed.startsWith("~/");
    }
    function ProjectMemoryPage({ t }) {
      const [payload, setPayload] = (0, import_react27.useState)(null);
      const [draft, setDraft] = (0, import_react27.useState)("");
      const [loading, setLoading] = (0, import_react27.useState)(true);
      const [saving, setSaving] = (0, import_react27.useState)(false);
      const [error, setError] = (0, import_react27.useState)(null);
      const [saved, setSaved] = (0, import_react27.useState)(false);
      const setPageActions = (0, import_react27.useContext)(PageActionsContext);
      const draftRef = (0, import_react27.useRef)(draft);
      const savingRef = (0, import_react27.useRef)(saving);
      (0, import_react27.useEffect)(() => {
        draftRef.current = draft;
      }, [draft]);
      (0, import_react27.useEffect)(() => {
        savingRef.current = saving;
      }, [saving]);
      (0, import_react27.useEffect)(() => {
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
      const handleSave = (0, import_react27.useCallback)(async () => {
        if (savingRef.current) return;
        const trimmed = draftRef.current.trim();
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
      }, [t]);
      const saveAction = (0, import_react27.useMemo)(
        () => /* @__PURE__ */ import_react27.default.createElement(Button, { variant: "outline", disabled: loading || saving, onClick: () => void handleSave() }, saving ? t("saving") : t("save")),
        [handleSave, loading, saving, t]
      );
      (0, import_react27.useEffect)(() => {
        if (!setPageActions) return;
        setPageActions(saveAction);
        return () => setPageActions(null);
      }, [saveAction, setPageActions]);
      return /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("h2", { className: "text-[15px] font-semibold leading-6 text-primary" }, t("pathTitle")), /* @__PURE__ */ import_react27.default.createElement("p", { className: "mt-1.5 text-[12px] leading-[18px] text-secondary" }, t("pathHint")), /* @__PURE__ */ import_react27.default.createElement("section", { className: "mt-4 rounded-xl border border-line4 bg-layer1 p-4" }, /* @__PURE__ */ import_react27.default.createElement("label", { className: "block" }, /* @__PURE__ */ import_react27.default.createElement("span", { className: "mb-1 block text-[12px] font-semibold text-primary" }, t("pathLabel")), /* @__PURE__ */ import_react27.default.createElement(
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
      )), /* @__PURE__ */ import_react27.default.createElement("div", { className: "mt-2 flex items-center gap-2" }, /* @__PURE__ */ import_react27.default.createElement(
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
      ), saved ? /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-[12px] leading-[18px] text-secondary" }, t("saved")) : null), /* @__PURE__ */ import_react27.default.createElement("dl", { className: "mt-3 space-y-1 text-[12px] leading-[18px]" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react27.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("effectivePath")), /* @__PURE__ */ import_react27.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.effectiveRoot || "\u2014")), /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react27.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("defaultPath")), /* @__PURE__ */ import_react27.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.defaultRoot || "\u2014")), /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react27.default.createElement("dt", { className: "shrink-0 text-secondary" }, t("settingsFile")), /* @__PURE__ */ import_react27.default.createElement("dd", { className: "min-w-0 break-all text-primary" }, payload?.settingsPath || "\u2014"))), /* @__PURE__ */ import_react27.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-secondary" }, t("namingHint")), error !== null ? /* @__PURE__ */ import_react27.default.createElement("p", { className: "mt-2 text-[12px] leading-[18px] text-danger", role: "alert" }, error) : null));
    }

    // src/features/project-memory/index.tsx
    var projectMemoryFeature = {
      id: "project-memory",
      group: "config",
      order: 20,
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
        description: "\u8D85\u8FC7\u9608\u503C\u81EA\u52A8\u538B\u7F29\uFF0C\u907F\u514D\u8D8A\u804A\u8D8A\u6162\u3002",
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
        description: "Compact a session once it crosses the threshold, so long chats stay fast.",
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
    var import_react28 = __toESM(require("react"), 1);

    // src/features/auto-compact/api.ts
    var ENDPOINT6 = "/dsh-all-in-one/auto-compact";
    var REQUEST_TIMEOUT_MS6 = 1e4;
    async function request3(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS6);
      try {
        const response = await fetch(new URL(ENDPOINT6, window.location.origin).toString(), {
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
      return /* @__PURE__ */ import_react28.default.createElement("label", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react28.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, label), /* @__PURE__ */ import_react28.default.createElement(
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
      ), /* @__PURE__ */ import_react28.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, unit));
    }
    function CompactIcon() {
      return /* @__PURE__ */ import_react28.default.createElement(
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
        /* @__PURE__ */ import_react28.default.createElement("path", { d: "M4 9a8 8 0 0 1 13.7-4.3L20 7" }),
        /* @__PURE__ */ import_react28.default.createElement("path", { d: "M20 4v3.5h-3.5" }),
        /* @__PURE__ */ import_react28.default.createElement("path", { d: "M20 15a8 8 0 0 1-13.7 4.3L4 17" }),
        /* @__PURE__ */ import_react28.default.createElement("path", { d: "M4 20v-3.5h3.5" })
      );
    }
    function AutoCompactToggle({ t }) {
      const [settings, setSettings] = (0, import_react28.useState)(null);
      const [thresholdDraft, setThresholdDraft] = (0, import_react28.useState)("");
      const [retainDraft, setRetainDraft] = (0, import_react28.useState)("");
      const [error, setError] = (0, import_react28.useState)(null);
      const latestRequest = (0, import_react28.useRef)(0);
      (0, import_react28.useEffect)(() => {
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
        const request5 = latestRequest.current;
        setError(null);
        try {
          const next = await saveAutoCompactSettings(patch);
          if (latestRequest.current !== request5) return;
          setSettings(next);
          setThresholdDraft(String(next.thresholdPercent));
          setRetainDraft(String(next.retainPercent));
        } catch (failure) {
          if (latestRequest.current !== request5) return;
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
        // 卡片容器：文字区不参与交互，开关与阈值输入各自独立，不能互相嵌套；
        // 阈值输入单独占下面一行，避免挤在开关下方把整行卡片撑高
        /* @__PURE__ */ import_react28.default.createElement("div", { className: "flex w-full flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "flex w-full items-start gap-2" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "flex min-w-0 flex-1 items-start gap-2" }, /* @__PURE__ */ import_react28.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react28.default.createElement(CompactIcon, null)), /* @__PURE__ */ import_react28.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react28.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react28.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react28.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)), /* @__PURE__ */ import_react28.default.createElement(
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
          /* @__PURE__ */ import_react28.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )), enabled ? /* @__PURE__ */ import_react28.default.createElement("div", { className: "flex items-center gap-3 pl-7" }, /* @__PURE__ */ import_react28.default.createElement(
          PercentField,
          {
            label: t("thresholdLabel"),
            unit: t("thresholdUnit"),
            value: thresholdDraft,
            onChange: setThresholdDraft,
            onCommit: commitThreshold
          }
        ), /* @__PURE__ */ import_react28.default.createElement(
          PercentField,
          {
            label: t("retainLabel"),
            unit: t("thresholdUnit"),
            value: retainDraft,
            onChange: setRetainDraft,
            onCommit: commitRetain
          }
        )) : null)
      );
    }

    // src/features/auto-compact/index.tsx
    var autoCompactFeature = {
      id: "auto-compact",
      group: "config",
      order: 30,
      switch: AutoCompactToggle,
      locales: autoCompactLocales
    };
    var auto_compact_default = autoCompactFeature;

    // src/features/desktop-cookie/locales.ts
    var desktopCookieLocales = {
      zh: {
        // 开关标题
        title: "Cookie \u6E05\u7406",
        // 开关用途说明
        description: "\u542F\u52A8\u65F6\u6E05\u7406\u8FC7\u671F\u7684\u767B\u5F55 Cookie\uFF0C\u907F\u514D\u684C\u9762\u7248\u8BA4\u8BC1\u5931\u8D25\u3002",
        // 阈值输入框的标签
        thresholdLabel: "\u9608\u503C",
        // 保留条数输入框的标签
        retainLabel: "\u4FDD\u7559",
        // 输入框的单位
        unit: "\u6761",
        // 读取配置失败时的提示
        loadFailed: "\u8BFB\u53D6\u6E05\u7406\u8BBE\u7F6E\u5931\u8D25",
        // 保存配置失败时的提示
        saveFailed: "\u4FDD\u5B58\u6E05\u7406\u8BBE\u7F6E\u5931\u8D25",
        // 阈值超出 1-100 时的提示
        thresholdInvalid: "\u9608\u503C\u9700\u8981\u662F 1 \u5230 100 \u4E4B\u95F4\u7684\u6574\u6570",
        // 保留条数不小于阈值时的提示
        retainInvalid: "\u4FDD\u7559\u6761\u6570\u9700\u8981\u662F\u6574\u6570\uFF0C\u4E14\u5C0F\u4E8E\u9608\u503C"
      },
      en: {
        // Switch title
        title: "Cookie cleanup",
        // Switch description
        description: "Prune stale sign-in cookies at launch so the desktop app can authenticate.",
        // Label of the threshold input
        thresholdLabel: "Threshold",
        // Label of the retained-count input
        retainLabel: "Keep",
        // Unit shown after both inputs
        unit: "cookies",
        // Shown when the settings cannot be loaded
        loadFailed: "Could not load the cleanup settings",
        // Shown when the settings cannot be saved
        saveFailed: "Could not save the cleanup settings",
        // Shown when the threshold is outside 1-100
        thresholdInvalid: "The threshold must be an integer between 1 and 100",
        // Shown when the retained count is not below the threshold
        retainInvalid: "The retained count must be an integer below the threshold"
      }
    };

    // src/features/desktop-cookie/toggle.tsx
    var import_react29 = __toESM(require("react"), 1);

    // src/features/desktop-cookie/api.ts
    var ENDPOINT7 = "/dsh-all-in-one/desktop-cookie";
    var REQUEST_TIMEOUT_MS7 = 1e4;
    async function request4(init = {}) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS7);
      try {
        const response = await fetch(new URL(ENDPOINT7, window.location.origin).toString(), {
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
            console.error("[desktop-cookie] \u89E3\u6790\u9519\u8BEF\u54CD\u5E94\u5931\u8D25:", error);
          }
          throw new Error(message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("[desktop-cookie] \u8BF7\u6C42\u6E05\u7406\u8BBE\u7F6E\u5931\u8D25:", error);
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
    }
    function loadDesktopCookieSettings() {
      return request4();
    }
    function saveDesktopCookieSettings(update) {
      return request4({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(update)
      });
    }

    // src/features/desktop-cookie/toggle.tsx
    var MIN_THRESHOLD = 1;
    var MAX_THRESHOLD = 100;
    var MIN_RETAIN = 0;
    var INPUT_CLASS4 = "w-12 rounded-md border border-line4 bg-base px-1 py-0 text-[11px] text-primary outline-none focus:border-brand";
    function CountField({ label, unit, value, onChange, onCommit }) {
      return /* @__PURE__ */ import_react29.default.createElement("label", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react29.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, label), /* @__PURE__ */ import_react29.default.createElement(
        "input",
        {
          type: "number",
          inputMode: "numeric",
          min: MIN_RETAIN,
          max: MAX_THRESHOLD,
          step: 1,
          value,
          "aria-label": label,
          onChange: (event) => onChange(event.target.value),
          onBlur: onCommit,
          onKeyDown: (event) => {
            if (event.key === "Enter") onCommit();
          },
          className: INPUT_CLASS4
        }
      ), /* @__PURE__ */ import_react29.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, unit));
    }
    function CookieIcon() {
      return /* @__PURE__ */ import_react29.default.createElement(
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
        /* @__PURE__ */ import_react29.default.createElement("path", { d: "M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3.5 3.5 0 0 0 4 4 3.5 3.5 0 0 0 5 5Z" }),
        /* @__PURE__ */ import_react29.default.createElement("circle", { cx: "9", cy: "10", r: "0.9", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react29.default.createElement("circle", { cx: "12", cy: "15", r: "0.9", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ import_react29.default.createElement("circle", { cx: "7", cy: "15.5", r: "0.9", fill: "currentColor", stroke: "none" })
      );
    }
    function DesktopCookieToggle({ t }) {
      const [settings, setSettings] = (0, import_react29.useState)(null);
      const [thresholdDraft, setThresholdDraft] = (0, import_react29.useState)("");
      const [retainDraft, setRetainDraft] = (0, import_react29.useState)("");
      const [error, setError] = (0, import_react29.useState)(null);
      const latestRequest = (0, import_react29.useRef)(0);
      (0, import_react29.useEffect)(() => {
        let active = true;
        void loadDesktopCookieSettings().then((next) => {
          if (!active) return;
          setSettings(next);
          setThresholdDraft(String(next.threshold));
          setRetainDraft(String(next.retain));
        }).catch((failure) => {
          if (!active) return;
          console.error("[desktop-cookie] \u8BFB\u53D6\u6E05\u7406\u8BBE\u7F6E\u5931\u8D25:", failure);
          setError(`${t("loadFailed")}\uFF1A${failure instanceof Error ? failure.message : String(failure)}`);
        });
        return () => {
          active = false;
        };
      }, [t]);
      const persist = async (patch) => {
        latestRequest.current += 1;
        const request5 = latestRequest.current;
        setError(null);
        try {
          const next = await saveDesktopCookieSettings(patch);
          if (latestRequest.current !== request5) return;
          setSettings(next);
          setThresholdDraft(String(next.threshold));
          setRetainDraft(String(next.retain));
        } catch (failure) {
          if (latestRequest.current !== request5) return;
          console.error("[desktop-cookie] \u4FDD\u5B58\u6E05\u7406\u8BBE\u7F6E\u5931\u8D25:", failure);
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
        if (!Number.isInteger(parsed) || parsed < MIN_THRESHOLD || parsed > MAX_THRESHOLD) {
          setError(t("thresholdInvalid"));
          setThresholdDraft(String(settings.threshold));
          return;
        }
        if (parsed === settings.threshold) return;
        void persist({ threshold: parsed });
      };
      const commitRetain = () => {
        if (settings === null) return;
        const parsed = Number(retainDraft.trim());
        if (!Number.isInteger(parsed) || parsed < MIN_RETAIN || parsed >= settings.threshold) {
          setError(t("retainInvalid"));
          setRetainDraft(String(settings.retain));
          return;
        }
        if (parsed === settings.retain) return;
        void persist({ retain: parsed });
      };
      const enabled = settings?.enabled === true;
      return (
        // 卡片容器：文字区不参与交互，开关与输入框各自独立，不能互相嵌套；
        // 两个输入框单独占下面一行，避免挤在开关下方把整行卡片撑高
        /* @__PURE__ */ import_react29.default.createElement("div", { className: "flex w-full flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "flex w-full items-start gap-2" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "flex min-w-0 flex-1 items-start gap-2" }, /* @__PURE__ */ import_react29.default.createElement("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand" }, /* @__PURE__ */ import_react29.default.createElement(CookieIcon, null)), /* @__PURE__ */ import_react29.default.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react29.default.createElement("span", { className: "block text-[13px] font-medium leading-[16px] text-primary" }, t("title")), /* @__PURE__ */ import_react29.default.createElement("span", { className: "block text-[11px] leading-[14px] text-secondary" }, t("description")), error !== null ? /* @__PURE__ */ import_react29.default.createElement("span", { className: "block text-[12px] leading-[16px] text-danger", role: "alert" }, error) : null)), /* @__PURE__ */ import_react29.default.createElement(
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
          /* @__PURE__ */ import_react29.default.createElement(
            "span",
            {
              "aria-hidden": "true",
              className: cn(
                "h-4 w-4 aio-switch bg-base shadow transition-transform",
                enabled ? "translate-x-[18px]" : "translate-x-0.5"
              )
            }
          )
        )), enabled ? /* @__PURE__ */ import_react29.default.createElement("div", { className: "flex items-center gap-3 pl-7" }, /* @__PURE__ */ import_react29.default.createElement(
          CountField,
          {
            label: t("thresholdLabel"),
            unit: t("unit"),
            value: thresholdDraft,
            onChange: setThresholdDraft,
            onCommit: commitThreshold
          }
        ), /* @__PURE__ */ import_react29.default.createElement(
          CountField,
          {
            label: t("retainLabel"),
            unit: t("unit"),
            value: retainDraft,
            onChange: setRetainDraft,
            onCommit: commitRetain
          }
        )) : null)
      );
    }

    // src/features/desktop-cookie/index.tsx
    var desktopCookieFeature = {
      id: "desktop-cookie",
      group: "config",
      order: 40,
      switch: DesktopCookieToggle,
      locales: desktopCookieLocales
    };
    var desktop_cookie_default = desktopCookieFeature;

    // src/features/index.ts
    var featureList = [
      // 对话体验：一条对话内的阅读与操作
      expand_process_default,
      image_preview_default,
      clear_session_default,
      queue_edit_default,
      auto_run_default,
      // 界面布局：侧边栏、会话列表与导航结构
      session_history_default,
      sidebar_more_default,
      workspace_session_count_default,
      delete_session_default,
      // 配置与维护：带参数或配置页、在后台生效的功能
      power_pack_default,
      project_memory_default,
      auto_compact_default,
      desktop_cookie_default
    ];

    // src/shell/registry.ts
    var FEATURE_GROUP_ORDER = ["conversation", "layout", "config"];
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
    var import_react30 = __toESM(require("react"), 1);
    function BackGlyph() {
      return /* @__PURE__ */ import_react30.default.createElement(
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
        /* @__PURE__ */ import_react30.default.createElement("path", { d: "M9.5 3.5 5 8l4.5 4.5" })
      );
    }
    var FALLBACK_GROUP = "other";
    function groupFeatures(features) {
      const buckets = /* @__PURE__ */ new Map();
      for (const feature of features) {
        const group = feature.group !== void 0 && FEATURE_GROUP_ORDER.includes(feature.group) ? feature.group : FALLBACK_GROUP;
        const bucket = buckets.get(group);
        if (bucket) bucket.push(feature);
        else buckets.set(group, [feature]);
      }
      const sections = [];
      for (const group of [...FEATURE_GROUP_ORDER, FALLBACK_GROUP]) {
        const bucket = buckets.get(group);
        if (bucket !== void 0 && bucket.length > 0) sections.push({ group, features: bucket });
      }
      return sections;
    }
    function needsReloadHint(features) {
      return features.length > 0 && features.every((feature) => "switch" in feature && feature.reloadsPage === true);
    }
    function FeatureCard({ feature, t, open }) {
      const featureT = (0, import_react30.useMemo)(() => (key) => t(`${feature.id}.${key}`), [feature.id, t]);
      if ("switch" in feature) {
        const SwitchEntry = feature.switch;
        return /* @__PURE__ */ import_react30.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react30.default.createElement(SwitchEntry, { t: featureT }));
      }
      const Entry = feature.entry;
      return /* @__PURE__ */ import_react30.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react30.default.createElement(Entry, { t: featureT, open: () => open(feature.id) }));
    }
    function AllInOnePage({ t }) {
      const [activeId, setActiveId] = (0, import_react30.useState)(null);
      const [pageActions, setPageActions] = (0, import_react30.useState)(null);
      const active = activeId ? registry.find(activeId) : void 0;
      const activePage = active && "page" in active ? active : void 0;
      const featureTranslate = (0, import_react30.useCallback)(
        // 网格视图不会调用此函数，activePage 为空时直接返回 key 兜底
        (key) => activePage ? t(`${activePage.id}.${key}`) : key,
        [activePage, t]
      );
      if (activePage) {
        const ActivePage = activePage.page;
        return /* @__PURE__ */ import_react30.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react30.default.createElement(PageActionsContext.Provider, { value: setPageActions }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-line4 bg-base pb-3" }, /* @__PURE__ */ import_react30.default.createElement(Button, { variant: "outline", onClick: () => setActiveId(null) }, /* @__PURE__ */ import_react30.default.createElement(BackGlyph, null), t("shell.back")), pageActions ? /* @__PURE__ */ import_react30.default.createElement("div", { className: "flex items-center gap-2" }, pageActions) : null), /* @__PURE__ */ import_react30.default.createElement("div", { className: "mt-4" }, /* @__PURE__ */ import_react30.default.createElement(ActivePage, { t: featureTranslate }))));
      }
      return /* @__PURE__ */ import_react30.default.createElement("div", { className: "dsh-aio-root" }, /* @__PURE__ */ import_react30.default.createElement("header", null, /* @__PURE__ */ import_react30.default.createElement("h1", { className: "text-[17px] font-semibold leading-6 text-primary" }, t("shell.pageTitle")), /* @__PURE__ */ import_react30.default.createElement("p", { className: "mt-1.5 text-[13px] leading-5 text-secondary" }, t("shell.pageDescription"))), registry.list.length === 0 ? (
        // 尚未注册功能时的空态提示
        /* @__PURE__ */ import_react30.default.createElement("p", { className: "mt-5 rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary" }, t("shell.empty"))
      ) : (
        // 按分组逐块渲染：组标题说明这一块功能解决什么问题，组内仍是一张网格
        /* @__PURE__ */ import_react30.default.createElement("div", { className: "mt-4 space-y-4" }, groupFeatures(registry.list).map((section) => /* @__PURE__ */ import_react30.default.createElement("section", { key: section.group }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "mb-2 flex items-baseline gap-1" }, /* @__PURE__ */ import_react30.default.createElement("h2", { className: "text-[12px] font-medium text-secondary" }, t(`shell.group.${section.group}`)), needsReloadHint(section.features) ? /* @__PURE__ */ import_react30.default.createElement("span", { className: "text-[11px] leading-[16px] text-secondary" }, "\xB7 ", t("shell.groupReloadHint")) : null), /* @__PURE__ */ import_react30.default.createElement("div", { className: "aio-card-grid grid auto-rows-fr gap-2.5" }, section.features.map((feature) => /* @__PURE__ */ import_react30.default.createElement(
          FeatureCard,
          {
            key: feature.id,
            feature,
            t,
            open: (id) => setActiveId(id)
          }
        ))))))
      ));
    }

    // src/shell/settings-nav-icon.ts
    var NAV_ICON_MARKER = "data-dsh-all-in-one-nav-icon";
    var DIALOG_SELECTOR = '[role="dialog"]';
    var NAV_ROW_SELECTOR = "nav button";
    var SYNC_DEBOUNCE_MS = 200;
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
        let timer = 0;
        let dialog = null;
        const findDialog = () => {
          if (dialog !== null && dialog.isConnected) return dialog;
          dialog = document.querySelector(DIALOG_SELECTOR);
          return dialog;
        };
        const markRows = (root, wantedLabel) => {
          let matched = false;
          for (const row of root.querySelectorAll(NAV_ROW_SELECTOR)) {
            const own = isOwnNavRow(row.textContent, wantedLabel);
            if (own) matched = true;
            if (!own) {
              if (row.hasAttribute(NAV_ICON_MARKER)) row.removeAttribute(NAV_ICON_MARKER);
              continue;
            }
            if (!row.hasAttribute(NAV_ICON_MARKER)) row.setAttribute(NAV_ICON_MARKER, "");
          }
          return matched;
        };
        const sync = () => {
          timer = 0;
          if (disposed) return;
          const first = findDialog();
          if (first === null) return;
          const wantedLabel = t("shell.navTitle");
          if (markRows(first, wantedLabel)) return;
          const dialogs = document.querySelectorAll(DIALOG_SELECTOR);
          if (dialogs.length <= 1) return;
          for (const candidate of dialogs) {
            if (candidate === first) continue;
            if (!markRows(candidate, wantedLabel)) continue;
            dialog = candidate;
            return;
          }
        };
        const schedule = () => {
          if (timer !== 0 || disposed) return;
          timer = window.setTimeout(sync, SYNC_DEBOUNCE_MS);
        };
        const isRelevant = (records) => {
          const current = dialog !== null && dialog.isConnected ? dialog : null;
          for (const record of records) {
            if (current !== null && current.contains(record.target)) return true;
            for (const node of record.addedNodes) {
              if (!(node instanceof Element)) continue;
              if (node.matches(DIALOG_SELECTOR)) return true;
              const topLevel = node.parentElement === document.body;
              if (topLevel && node.querySelector(DIALOG_SELECTOR) !== null) return true;
              if (current !== null && node.contains(current)) return true;
            }
          }
          return false;
        };
        sync();
        const observer = new MutationObserver((records) => {
          if (isRelevant(records)) schedule();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => {
          disposed = true;
          observer.disconnect();
          if (timer !== 0) window.clearTimeout(timer);
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
        // 页面说明：区分开关与入口卡片，避免误以为每张卡片都能点进去
        "shell.pageDescription": "\u5F00\u5173\u5373\u65F6\u751F\u6548\uFF0C\u5E26\u300C\u8BBE\u7F6E\u300D\u7684\u5361\u7247\u8FDB\u5165\u914D\u7F6E\u9875\u3002",
        // 分组标题：改变对话阅读与操作行为的功能
        "shell.group.conversation": "\u5BF9\u8BDD\u4F53\u9A8C",
        // 分组标题：改变侧边栏、导航等界面结构的功能
        "shell.group.layout": "\u754C\u9762\u5E03\u5C40",
        // 分组标题：需要先配置再使用的功能
        "shell.group.config": "\u914D\u7F6E\u4E0E\u7EF4\u62A4",
        // 分组标题：未声明分组的兜底分组
        "shell.group.other": "\u5176\u4ED6",
        // 分组标题旁的整组提示：该组开关切换后页面会刷新
        "shell.groupReloadHint": "\u5207\u6362\u540E\u5237\u65B0\u751F\u6548",
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
        // Page description distinguishing switches from cards that open a page
        "shell.pageDescription": "Switches apply immediately; cards with Settings open a configuration page.",
        // Group heading: features that change how conversations are read and operated
        "shell.group.conversation": "Conversation",
        // Group heading: features that restructure the sidebar and navigation
        "shell.group.layout": "Layout",
        // Group heading: features that need configuration before use
        "shell.group.config": "Configuration & maintenance",
        // Group heading: fallback for features that declare no group
        "shell.group.other": "Other",
        // Group-level hint shown next to a heading when toggling any switch reloads the page
        "shell.groupReloadHint": "reloads the page on toggle",
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
        const SettingsSection = () => /* @__PURE__ */ import_react31.default.createElement(AllInOnePage, { t });
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
