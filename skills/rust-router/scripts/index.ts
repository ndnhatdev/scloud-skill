type Topic = "overview" | "route-request" | "combine-skills";
type Goal = "route" | "review" | "debug" | "design" | "study-plan";
type Depth = "quick" | "standard" | "deep";
type TopicRequest = Topic | "all";
type RustSkill =
  | "rust-master"
  | "rust-ecosystem"
  | "rust-platforms"
  | "rust-specializations"
  | "rust-verification"
  | "rust-delivery";

type SkillInput = {
  topic?: TopicRequest | string;
  goal?: Goal | string;
  question?: string;
  constraints?: string;
  depth?: Depth | string;
};

type RustSkillCard = {
  summary: string;
  chooseWhen: string[];
  avoidWhen: string[];
  keywords: string[];
  anchors: string[];
};

type RankedSkill = {
  skill: RustSkill;
  score: number;
  anchorHits: number;
};

type SkillOutput = {
  skill: "rust-router";
  checked_on: "2026-03-20";
  topic: Topic;
  goal: Goal;
  depth: Depth;
  primary_skill: RustSkill;
  supporting_skills: RustSkill[];
  report: string;
  sources: string[];
};

const SKILL_ORDER = [
  "rust-master",
  "rust-ecosystem",
  "rust-platforms",
  "rust-specializations",
  "rust-verification",
  "rust-delivery"
] as const satisfies readonly RustSkill[];

const TOPIC_ORDER = ["overview", "route-request", "combine-skills"] as const satisfies readonly Topic[];

const ROUTING_PRIORITY: Record<RustSkill, number> = {
  "rust-master": 0,
  "rust-ecosystem": 2,
  "rust-platforms": 3,
  "rust-specializations": 5,
  "rust-verification": 4,
  "rust-delivery": 3
};

const SKILLS: Record<RustSkill, RustSkillCard> = {
  "rust-master": {
    summary: "Core Rust language, diagnostics, unsafe, performance, macros, and general code review.",
    chooseWhen: [
      "The request is mostly about ownership, borrowing, lifetimes, traits, diagnostics, or unsafe.",
      "No other Rust domain skill clearly dominates.",
      "A domain-specific request still hinges on core language review, diagnostics, or performance reasoning."
    ],
    avoidWhen: [
      "A concrete crate stack, platform target, verification tool, or delivery workflow clearly defines the boundary."
    ],
    anchors: [],
    keywords: [
      "ownership",
      "borrowing",
      "lifetime",
      "lifetimes",
      "trait",
      "traits",
      "borrow checker",
      "compiler error",
      "e0277",
      "e0308",
      "unsafe",
      "pin",
      "ffi",
      "macro",
      "performance",
      "api design",
      "review rust code"
    ]
  },
  "rust-ecosystem": {
    summary: "Tokio, Serde, Axum, SQLx, Tracing, and async service-stack patterns.",
    chooseWhen: [
      "The request names Tokio, Axum, SQLx, Serde, or Tracing.",
      "The problem is an async service architecture or request-to-DB flow."
    ],
    avoidWhen: ["The hard boundary is wasm, embedded, verification, compiler internals, or release distribution."],
    anchors: ["tokio", "axum", "sqlx", "serde", "tracing", "tower", "hyper"],
    keywords: [
      "tokio",
      "axum",
      "sqlx",
      "serde",
      "tracing",
      "tower",
      "hyper",
      "spawn_blocking",
      "graceful shutdown",
      "handler",
      "pool",
      "migration"
    ]
  },
  "rust-platforms": {
    summary: "wasm, no_std, Embassy, firmware, probe-rs, and target-platform runtime constraints.",
    chooseWhen: [
      "The request names wasm, no_std, embedded, Embassy, or firmware workflows.",
      "The runtime environment or target platform is the main constraint."
    ],
    avoidWhen: ["The main problem is binary distribution or host release workflow."],
    anchors: ["wasm", "wasm32", "wasm-bindgen", "wasm-pack", "no_std", "embedded", "firmware", "embassy", "probe-rs", "defmt"],
    keywords: [
      "wasm",
      "wasm32",
      "wasm-bindgen",
      "wasm-pack",
      "no_std",
      "embedded",
      "firmware",
      "embassy",
      "probe-rs",
      "defmt",
      "interrupt",
      "pac",
      "hal"
    ]
  },
  "rust-specializations": {
    summary: "rustc internals, fuzzing, Rust for Linux, SIMD, and coverage-frontier mapping.",
    chooseWhen: [
      "The request is about rustc internals, cargo-fuzz, Rust for Linux, or low-level SIMD.",
      "The problem sits outside ordinary app, library, platform, verification, or delivery work."
    ],
    avoidWhen: ["The core issue is ordinary async services, wasm, delivery, or proptest or loom or Kani."],
    anchors: ["rustc", "mir", "cargo-fuzz", "cargo fuzz", "rust for linux", "kernel", "simd", "std::arch", "compiler internals"],
    keywords: [
      "rustc",
      "mir",
      "hir",
      "borrowck",
      "query system",
      "compiler internals",
      "cargo-fuzz",
      "cargo fuzz",
      "fuzzing",
      "rust for linux",
      "kernel",
      "driver",
      "simd",
      "intrinsic",
      "std::arch"
    ]
  },
  "rust-verification": {
    summary: "proptest, loom, Kani, and choosing verification layers.",
    chooseWhen: [
      "The request names proptest, loom, Kani, or asks which verification tool to use.",
      "The core problem is proving or systematically searching correctness."
    ],
    avoidWhen: ["The main workflow is fuzzing-only or release-only with no verification boundary."],
    anchors: ["proptest", "loom", "kani", "proof harness", "model checking", "property test", "property-based"],
    keywords: [
      "proptest",
      "loom",
      "kani",
      "verification",
      "property test",
      "property-based",
      "proof harness",
      "model checking",
      "shrinking"
    ]
  },
  "rust-delivery": {
    summary: "cross-compilation, target tooling, packaging, compatibility, and release automation.",
    chooseWhen: [
      "The request names cross, cargo-zigbuild, cargo-xwin, dist, musl, GNU, or release matrices.",
      "The main problem is shipping binaries or installers across targets."
    ],
    avoidWhen: ["The main boundary is runtime platform behavior rather than shipping host artifacts."],
    anchors: ["cross", "cargo-zigbuild", "cargo-xwin", "cargo xwin", "dist", "cargo-dist", "musl", "glibc", "msvc"],
    keywords: [
      "cross",
      "cargo-zigbuild",
      "cargo xwin",
      "cargo-xwin",
      "dist",
      "cargo-dist",
      "musl",
      "glibc",
      "msvc",
      "cross compilation",
      "release pipeline",
      "package",
      "packaging",
      "artifact",
      "artifacts",
      "ship",
      "shipping",
      "release artifact",
      "installer",
      "github release"
    ]
  }
};

const RESEARCH_BASELINE = [
  "Local skill boundaries reviewed on 2026-03-20.",
  "Routing is intentionally biased toward one primary skill and at most one supporting skill.",
  "rust-master is treated as the default support skill for language-level concerns inside another domain.",
  "Domain anchors now take precedence over generic core-Rust vocabulary when both appear in the same request."
] as const;

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function parseGoal(value: string | undefined): Goal {
  switch (normalize(value)) {
    case "review":
    case "debug":
    case "design":
    case "study-plan":
      return normalize(value) as Goal;
    case "route":
    default:
      return "route";
  }
}

function parseDepth(value: string | undefined): Depth {
  switch (normalize(value)) {
    case "quick":
    case "deep":
      return normalize(value) as Depth;
    case "standard":
    default:
      return "standard";
  }
}

function isTopic(value: string): value is Topic {
  return (TOPIC_ORDER as readonly string[]).includes(value);
}

function itemLimit(depth: Depth): number {
  switch (depth) {
    case "quick":
      return 3;
    case "deep":
      return Number.POSITIVE_INFINITY;
    case "standard":
    default:
      return 5;
  }
}

function takeItems(items: readonly string[], depth: Depth): string[] {
  const limit = itemLimit(depth);
  return limit === Number.POSITIVE_INFINITY ? [...items] : items.slice(0, limit);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatches(haystack: string, keyword: string): boolean {
  const normalizedKeyword = normalize(keyword);
  if (normalizedKeyword === "") {
    return false;
  }

  if (/[^a-z0-9_-]/.test(normalizedKeyword)) {
    return haystack.includes(normalizedKeyword);
  }

  const pattern = new RegExp(`(^|[^a-z0-9_])${escapeRegExp(normalizedKeyword)}([^a-z0-9_]|$)`);
  return pattern.test(haystack);
}

function scoreSkills(text: string): RankedSkill[] {
  const haystack = normalize(text);
  if (!haystack) {
    return [];
  }

  const scores: RankedSkill[] = [];
  let nonMasterAnchorDetected = false;

  for (const skill of SKILL_ORDER) {
    let score = 0;
    let anchorHits = 0;

    for (const anchor of SKILLS[skill].anchors) {
      if (keywordMatches(haystack, anchor)) {
        anchorHits += 1;
        score += 3;
      }
    }

    for (const keyword of SKILLS[skill].keywords) {
      if (keywordMatches(haystack, keyword)) {
        score += keyword.includes(" ") ? 2 : 1;
      }
    }

    if (skill !== "rust-master" && anchorHits > 0) {
      nonMasterAnchorDetected = true;
    }

    if (score > 0 || anchorHits > 0) {
      scores.push({ skill, score, anchorHits });
    }
  }

  if (nonMasterAnchorDetected) {
    const master = scores.find((entry) => entry.skill === "rust-master");
    if (master && master.score <= 4) {
      master.score = Math.max(0, master.score - 2);
    }
  }

  return scores.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (right.anchorHits !== left.anchorHits) {
      return right.anchorHits - left.anchorHits;
    }
    if (ROUTING_PRIORITY[right.skill] !== ROUTING_PRIORITY[left.skill]) {
      return ROUTING_PRIORITY[right.skill] - ROUTING_PRIORITY[left.skill];
    }
    return left.skill.localeCompare(right.skill);
  });
}

function rankSkills(text: string): RustSkill[] {
  return scoreSkills(text).map((entry) => entry.skill);
}

function mentionsCoreRust(text: string): boolean {
  const coreKeywords = [
    "ownership",
    "borrow",
    "borrow-checker",
    "lifetime",
    "unsafe",
    "compiler error",
    "borrow checker",
    "performance",
    "trait",
    "atomic",
    "lock-free",
    "send",
    "sync"
  ];
  return coreKeywords.some((keyword) => keywordMatches(text, keyword));
}

function chooseSupportingSkills(primary: RustSkill, ranked: RustSkill[], text: string): RustSkill[] {
  const supports: RustSkill[] = [];
  const haystack = normalize(text);

  if (primary !== "rust-master" && mentionsCoreRust(haystack)) {
    supports.push("rust-master");
  }

  for (const candidate of ranked) {
    if (candidate === primary || candidate === "rust-master") {
      continue;
    }

    if (primary === "rust-ecosystem" && candidate === "rust-delivery") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-delivery" && candidate === "rust-ecosystem") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-platforms" && candidate === "rust-delivery") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-delivery" && candidate === "rust-platforms") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-specializations" && candidate === "rust-verification") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-verification" && candidate === "rust-specializations") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-verification" && candidate === "rust-ecosystem") {
      supports.push(candidate);
      break;
    }
    if (primary === "rust-ecosystem" && candidate === "rust-verification") {
      supports.push(candidate);
      break;
    }
  }

  return [...new Set(supports)].slice(0, 2);
}

function resolveTopic(input: SkillInput, supports: RustSkill[]): Topic {
  const normalizedTopic = normalize(input.topic);
  if (normalizedTopic === "all") {
    return "combine-skills";
  }
  if (isTopic(normalizedTopic)) {
    return normalizedTopic;
  }

  const combined = normalize([input.question, input.constraints].filter(Boolean).join(" "));
  const asksCombination = ["which skill", "which skills", "multiple skills", "combine", "kết hợp", "skill nào"].some((marker) =>
    combined.includes(marker)
  );

  if (supports.length > 0 || asksCombination) {
    return "combine-skills";
  }
  return "route-request";
}

function bulletSection(title: string, items: readonly string[]): string {
  if (items.length === 0) {
    return "";
  }
  return [`### ${title}`, ...items.map((item) => `- ${item}`), ""].join("\n");
}

function buildOverviewSection(depth: Depth): string {
  const quickMap = takeItems(
    [
      "rust-master: core language, diagnostics, unsafe, performance, API design.",
      "rust-ecosystem: Tokio, Serde, Axum, SQLx, Tracing, service-stack work.",
      "rust-platforms: wasm, no_std, Embassy, firmware, target tooling.",
      "rust-specializations: rustc internals, fuzzing, Rust for Linux, SIMD.",
      "rust-verification: proptest, loom, Kani, verification strategy.",
      "rust-delivery: cross-compilation, packaging, compatibility, release automation."
    ],
    depth
  );

  return [
    "## Rust Router Map",
    "",
    "Use one primary Rust skill by default. Add at most one supporting skill when the request truly crosses a second boundary.",
    "",
    bulletSection("Routing Baseline", RESEARCH_BASELINE),
    bulletSection("Skill Map", quickMap)
  ]
    .filter(Boolean)
    .join("\n");
}

function supportReason(primary: RustSkill, support: RustSkill): string {
  if (support === "rust-master") {
    return "Core language or review concerns still matter inside the primary domain.";
  }
  if (primary === "rust-ecosystem" && support === "rust-delivery") {
    return "The request spans service implementation and binary distribution workflow.";
  }
  if (primary === "rust-delivery" && support === "rust-ecosystem") {
    return "The release workflow is for a backend service stack, not a generic binary.";
  }
  if (primary === "rust-platforms" && support === "rust-delivery") {
    return "The request crosses a platform-specific runtime and a host-side shipping workflow.";
  }
  if (primary === "rust-delivery" && support === "rust-platforms") {
    return "The shipping plan depends on platform-specific runtime constraints.";
  }
  if (primary === "rust-specializations" && support === "rust-verification") {
    return "Specialized reliability work overlaps systematic verification concerns.";
  }
  if (primary === "rust-verification" && support === "rust-specializations") {
    return "The proof or test strategy overlaps a specialized subsystem such as fuzzing.";
  }
  if (primary === "rust-verification" && support === "rust-ecosystem") {
    return "Verification is happening inside a crate ecosystem boundary that still matters.";
  }
  if (primary === "rust-ecosystem" && support === "rust-verification") {
    return "The app-stack problem also depends on verification-tool choice.";
  }
  return "The request crosses a second meaningful skill boundary.";
}

function buildAlternativesSection(ranked: RustSkill[], primary: RustSkill, supports: RustSkill[], depth: Depth): string {
  const alternatives = ranked.filter((skill) => skill !== primary && !supports.includes(skill)).slice(0, itemLimit(depth));
  if (alternatives.length === 0) {
    return "";
  }

  return bulletSection(
    "Alternatives Considered",
    alternatives.map((skill) => `${skill}: ${SKILLS[skill].summary}`)
  );
}

function buildRouteSection(primary: RustSkill, supports: RustSkill[], ranked: RustSkill[], depth: Depth): string {
  const primaryCard = SKILLS[primary];
  const lines = [`Primary skill: ${primary}`, `Why: ${primaryCard.summary}`];

  if (supports.length > 0) {
    lines.push(`Supporting skills: ${supports.join(", ")}`);
  } else {
    lines.push("Supporting skills: none");
  }

  return [
    "## Routing Decision",
    "",
    ...lines.map((line) => `- ${line}`),
    "",
    bulletSection("Choose This Primary Skill When", takeItems(primaryCard.chooseWhen, depth)),
    bulletSection("Do Not Expand Further When", takeItems(primaryCard.avoidWhen, depth)),
    supports.length > 0
      ? bulletSection(
          "Why These Supporting Skills",
          supports.map((support) => `${support}: ${supportReason(primary, support)}`)
        )
      : "",
    buildAlternativesSection(ranked, primary, supports, depth)
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCompositionSection(primary: RustSkill, supports: RustSkill[], depth: Depth): string {
  if (supports.length === 0) {
    return "";
  }

  const rules = [
    `Load ${primary} first because it defines the main boundary.`,
    `Load ${supports.join(", ")} second only for the concerns that primary skill does not own.`,
    "Keep the combined set small and avoid pulling in unrelated Rust skills."
  ];

  return [
    "## Load Order",
    "",
    ...takeItems(rules, depth).map((rule) => `- ${rule}`),
    ""
  ].join("\n");
}

function buildContextSection(input: SkillInput): string {
  const notes: string[] = [];
  if (input.question && input.question.trim() !== "") {
    notes.push(`Question: ${input.question.trim()}`);
  }
  if (input.constraints && input.constraints.trim() !== "") {
    notes.push(`Constraints: ${input.constraints.trim()}`);
  }
  return notes.length === 0 ? "" : [`## Caller Context`, "", ...notes.map((item) => `- ${item}`), ""].join("\n");
}

function buildReport(input: SkillInput, topic: Topic, primary: RustSkill, supports: RustSkill[], ranked: RustSkill[], depth: Depth): string {
  const sections: string[] = [buildOverviewSection(depth), buildRouteSection(primary, supports, ranked, depth)];

  if (topic === "combine-skills" || supports.length > 0) {
    sections.push(buildCompositionSection(primary, supports, depth));
  }

  const context = buildContextSection(input);
  if (context) {
    sections.push(context);
  }

  return sections.filter(Boolean).join("\n\n");
}

export async function run(input: SkillInput = {}): Promise<SkillOutput> {
  const goal = parseGoal(input.goal);
  const depth = parseDepth(input.depth);
  const combined = [input.topic, input.question, input.constraints].filter(Boolean).join(" ");
  const ranked = rankSkills(combined);
  const primary_skill = ranked[0] ?? "rust-master";
  const supporting_skills = chooseSupportingSkills(primary_skill, ranked, combined);
  const topic = resolveTopic(input, supporting_skills);

  return {
    skill: "rust-router",
    checked_on: "2026-03-20",
    topic,
    goal,
    depth,
    primary_skill,
    supporting_skills,
    report: buildReport(input, topic, primary_skill, supporting_skills, ranked, depth),
    sources: [
      "skills/rust-master/SKILL.md",
      "skills/rust-ecosystem/SKILL.md",
      "skills/rust-platforms/SKILL.md",
      "skills/rust-specializations/SKILL.md",
      "skills/rust-verification/SKILL.md",
      "skills/rust-delivery/SKILL.md"
    ]
  };
}

export default run;
