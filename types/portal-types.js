/**
 * @typedef {"signals" | "signals-pro" | "signals-elite"} PlanId
 * @typedef {"included" | "advanced" | "locked"} ModuleStatus
 *
 * @typedef {Object} ClientPortal
 * @property {string} clientName
 * @property {string} clientSlug
 * @property {string} businessType
 * @property {PlanId} activePlan
 * @property {string} accessKey
 * @property {string} lastUpdate
 * @property {string} nextUpdate
 * @property {"active" | "review" | "paused"} status
 * @property {Object | null} generatedOutput
 */

window.LikeliPortal = window.LikeliPortal || {};
