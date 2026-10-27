// src/preset-style.ts
var SECTION_NAME = "chat-style:custom-prompt";
var SECTION_ORDER = 10250;
var inject = ["systemPrompt"];
function apply(ctx, config = {}) {
  const text = typeof config.text === "string" ? config.text.trim() : "";
  if (text === "") return;
  ctx.effect(
    () => ctx.systemPrompt.section({ name: SECTION_NAME, order: SECTION_ORDER, text }),
    "chat-style: prompt section"
  );
}
export {
  apply,
  inject
};
