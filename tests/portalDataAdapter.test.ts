import assert from "node:assert/strict";
import { adaptPortalOutput, generateCalendarFromScripts } from "../lib/portalDataAdapter";

const legacy = adaptPortalOutput({
  meta: { version: "1.0", generatedAt: "2026-06-18T00:00:00.000Z" },
  plan: { id: "Signals Pro" },
  contentIdeas: [
    { id: "idea_001", title: "Idea uno" },
    { id: "idea_002", title: "Idea dos" },
  ],
  hooksLibrary: { curiosidad: ["Hook uno", "Hook dos"] },
  guiones: [
    { id: "script_001", title: "Guion uno", ideaId: "idea_001", format: "Reel" },
    { id: "script_002", title: "Guion dos", ideaTitle: "Idea dos", format: "Historia" },
  ],
  calendario: [{ id: "calendar_legacy", day: 1, ideaId: "idea_001" }],
});

assert.equal(legacy.output.schemaVersion, "likeli-portal-v2");
assert.equal(legacy.output.portal.plan, "signals_pro");
assert.equal(legacy.output.modules.hooks.length, 2);
assert.equal(legacy.output.modules.scripts[0].linkedIdeaId, "idea_001");
assert.equal(legacy.output.modules.scripts[1].linkedIdeaId, "idea_002");
assert.equal(legacy.output.modules.calendar.length, 2);
assert.ok(legacy.output.modules.calendar.every((item) => item.scriptId));
assert.ok(legacy.output.modules.calendar.every((item) => new Date(`${item.date}T00:00:00`).getDay() !== 0));

const signals = adaptPortalOutput({
  schemaVersion: "likeli-portal-v2",
  portal: { plan: "base", createdAt: "2026-06-18" },
  modules: {
    ideas: [{ title: "Idea" }],
    scripts: [{ title: "No permitido", linkedIdeaId: "idea_001" }],
    calendar: [{ scriptId: "script_001", date: "2026-06-19" }],
    benchmarks: [{ title: "No permitido" }],
  },
});

assert.equal(signals.output.portal.plan, "signals");
assert.deepEqual(signals.output.modules.scripts, []);
assert.deepEqual(signals.output.modules.calendar, []);
assert.deepEqual(signals.output.modules.benchmarks, []);

const calendar = generateCalendarFromScripts({
  plan: "elite",
  createdAt: "2026-06-18",
  scripts: Array.from({ length: 16 }, (_, index) => ({
    id: `script_${String(index + 1).padStart(3, "0")}`,
    title: `Guion ${index + 1}`,
    linkedIdeaId: `idea_${String(index + 1).padStart(3, "0")}`,
    format: index % 4 === 0 ? "Historia" : "Reel",
  })),
});

assert.equal(calendar.length, 16);
assert.ok(calendar.every((item) => item.scriptId && item.linkedIdeaId));
assert.ok(calendar.every((item) => new Date(`${item.date}T00:00:00`).getDay() !== 0));

console.log("portalDataAdapter tests passed");
