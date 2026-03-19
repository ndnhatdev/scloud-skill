type Topic = "overview" | "compiler-tooling" | "fuzzing-reliability" | "kernel-drivers" | "simd-intrinsics" | "coverage-frontiers";
type Goal = "learn" | "choose" | "review" | "debug" | "design" | "study-plan";
type Depth = "quick" | "standard" | "deep";
type TopicRequest = Topic | "all";

type SkillInput = {
  topic?: TopicRequest | string;
  goal?: Goal | string;
  question?: string;
  constraints?: string;
  depth?: Depth | string;
};

type TopicCard = {
  title: string;
  summary: string;
  rules: string[];
  useWhen: string[];
  avoidWhen: string[];
  pitfalls: string[];
  practice: string[];
  sources: string[];
  related: Topic[];
};

type SkillOutput = {
  skill: "rust-specializations";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = ["overview", "compiler-tooling", "fuzzing-reliability", "kernel-drivers", "simd-intrinsics", "coverage-frontiers"] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official specialization docs reviewed on 2026-03-19.",
  "The std::simd page reviewed showed portable_simd as nightly-only experimental.",
  "Rust for Linux docs reviewed showed current policy, contact, and reference-driver resources.",
  "Coverage-frontier guidance was updated against official project docs for verification, distribution, GUI, and graphics ecosystems.",
  "Guidance is intentionally biased toward rustc-dev-guide, Rust Fuzz Book, Rust for Linux, standard-library docs, and official project docs for adjacent domains."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust specialization", "advanced rust areas", "deep rust", "compiler internals", "kernel rust", "simd"],
  "compiler-tooling": ["rustc", "compiler", "mir", "hir", "query", "queries", "rustc-dev-guide", "diagnostics internals", "compiler source"],
  "fuzzing-reliability": ["cargo fuzz", "fuzz", "fuzzing", "libfuzzer", "corpus", "sanitizer", "sanitizers", "coverage", "structure-aware"],
  "kernel-drivers": ["rust for linux", "kernel", "driver", "drivers", "linux kernel", "kernel crate", "out-of-tree module", "klint"],
  "simd-intrinsics": ["simd", "intrinsic", "intrinsics", "std::arch", "core::arch", "target_feature", "is_x86_feature_detected", "portable_simd", "vectorization"],
  "coverage-frontiers": [
    "what else",
    "what is missing",
    "missing areas",
    "remaining areas",
    "frontier",
    "future skill",
    "next skill",
    "coverage gap",
    "verification",
    "proptest",
    "loom",
    "kani",
    "cross compilation",
    "cargo dist",
    "cargo-dist",
    "gui",
    "tauri",
    "egui",
    "iced",
    "graphics",
    "wgpu",
    "bevy",
    "còn thiếu",
    "mảng nào nữa",
    "chưa đề cập"
  ]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Specializations Map",
    summary:
      "Beyond ordinary Rust usage, this repository now covers four major advanced verticals directly: compiler internals, fuzzing and sanitizers, kernel-driver work, and low-level SIMD or intrinsics. The next frontier domains are verification, distribution, GUI, and graphics or GPU work.",
    rules: [
      "Pick the specialization boundary first; these domains have different invariants, tools, and stability stories.",
      "Prefer primary docs because details in these areas change faster than ordinary Rust syntax.",
      "Treat unstable status and environment constraints as part of the answer, not footnotes.",
      "Keep the investigation anchored to the subsystem's own architecture instead of generic intuition.",
      "Use these verticals when ordinary language-level reasoning stops being enough."
    ],
    useWhen: [
      "You need a map of the major advanced Rust areas not covered by core language or backend-stack skills.",
      "You need to decide which specialization a problem belongs to.",
      "You want a study or review roadmap for deeper Rust work."
    ],
    avoidWhen: [
      "You only need normal Rust design, diagnostics, or platform-target advice.",
      "You are trying to use specialized tooling to hide a simpler bug."
    ],
    pitfalls: [
      "Applying ordinary app-development intuitions to compiler, kernel, or intrinsic-heavy code.",
      "Ignoring unstable status or environment support in answers.",
      "Thinking one deep skill covers all advanced Rust domains."
    ],
    practice: [
      "Take one advanced question and classify it as compiler, fuzzing, kernel, or SIMD work.",
      "Audit one project and name which specialization-level tools it actually needs.",
      "Choose one vertical and identify the primary docs before touching source code.",
      "List which adjacent frontier domains are still outside the current skill set."
    ],
    sources: [
      "https://rustc-dev-guide.rust-lang.org/overview.html",
      "https://rust-fuzz.github.io/book/",
      "https://rust-for-linux.com/",
      "https://doc.rust-lang.org/std/arch/index.html",
      "https://docs.rs/loom/latest/loom/",
      "https://opensource.axo.dev/cargo-dist/"
    ],
    related: ["compiler-tooling", "fuzzing-reliability", "kernel-drivers", "simd-intrinsics", "coverage-frontiers"]
  },
  "compiler-tooling": {
    title: "Compiler and Tooling Internals",
    summary:
      "Compiler work becomes much clearer once you stop treating rustc like a black box and instead reason in terms of lowering stages, MIR, queries, and diagnostics subsystems.",
    rules: [
      "Identify the right compiler layer before reasoning about a bug: parsing, HIR, MIR, borrow checking, or codegen.",
      "Use the query system and dev guide architecture rather than inferring behavior from directory names.",
      "Treat diagnostics and spans as part of the subsystem design, not an afterthought.",
      "MIR is often the most useful level for ownership, drop, and optimization reasoning.",
      "Stay within existing rustc abstractions when changing compiler behavior."
    ],
    useWhen: [
      "You are contributing to rustc or debugging a compiler-internal behavior.",
      "You need to understand MIR, queries, or diagnostics structure.",
      "You are building tooling that depends on compiler internals."
    ],
    avoidWhen: [
      "The issue is only an ordinary user-facing type error with no compiler internals involved.",
      "You are trying to guess compiler design without reading the dev guide."
    ],
    pitfalls: [
      "Debugging at the wrong lowering stage.",
      "Treating rustc as one pass instead of a query-driven system.",
      "Ignoring diagnostics quality while chasing correctness."
    ],
    practice: [
      "Take one compiler issue and decide whether HIR or MIR is the right lens.",
      "Trace one query-driven computation from request to result.",
      "Review one diagnostic-producing change and explain the span story."
    ],
    sources: [
      "https://rustc-dev-guide.rust-lang.org/overview.html",
      "https://rustc-dev-guide.rust-lang.org/compiler-src.html",
      "https://rustc-dev-guide.rust-lang.org/query.html",
      "https://rustc-dev-guide.rust-lang.org/mir/index.html",
      "https://rustc-dev-guide.rust-lang.org/diagnostics.html"
    ],
    related: ["fuzzing-reliability"]
  },
  "fuzzing-reliability": {
    title: "Fuzzing and Reliability",
    summary:
      "Rust fuzzing is effective when the harness reaches the true input boundary, corpus management is taken seriously, and sanitizers are treated as complementary instrumentation rather than magic.",
    rules: [
      "Use cargo-fuzz when you need coverage-guided exploration of risky input surfaces.",
      "Fuzz the real parser or execution boundary, not a helper that strips away the interesting state.",
      "Preserve crashes as regressions and minimize them as part of the workflow.",
      "Use structure-aware fuzzing when raw bytes hide too much of the reachable state space.",
      "Pair fuzzing with sanitizer support when the target and toolchain allow it."
    ],
    useWhen: [
      "You are hardening parsers, deserializers, protocol handlers, or unsafe boundaries.",
      "You are designing a reliability workflow that goes beyond ordinary tests.",
      "You are reviewing a cargo-fuzz setup or sanitizer-backed bug hunt."
    ],
    avoidWhen: [
      "The code under test has no meaningful input boundary or invariant to explore.",
      "You are pretending fuzzing replaces design review or ordinary tests."
    ],
    pitfalls: [
      "A fuzz target that never hits the real risky code.",
      "No corpus hygiene or crash preservation.",
      "Ignoring target support or nightly requirements for sanitizers."
    ],
    practice: [
      "Take one parser and decide where the true fuzz boundary begins.",
      "Add one minimized crash to a regression path after a fuzz finding.",
      "Review one stalled fuzz campaign and ask whether structure-aware generation is needed."
    ],
    sources: [
      "https://rust-fuzz.github.io/book/",
      "https://rust-fuzz.github.io/book/cargo-fuzz.html",
      "https://rust-fuzz.github.io/book/cargo-fuzz/guide.html",
      "https://rust-fuzz.github.io/book/cargo-fuzz/coverage.html",
      "https://rust-fuzz.github.io/book/cargo-fuzz/structure-aware-fuzzing.html",
      "https://doc.rust-lang.org/stable/unstable-book/compiler-flags/sanitizer.html"
    ],
    related: ["compiler-tooling", "simd-intrinsics"]
  },
  "kernel-drivers": {
    title: "Kernel and Driver Work",
    summary:
      "Rust in the Linux kernel is a specialized environment with its own policy, abstractions, and instability constraints; driver code lives under those constraints, not ordinary std-based assumptions.",
    rules: [
      "Use kernel-provided abstractions where possible instead of re-creating unsafe bindings ad hoc.",
      "Keep unstable or kernel-specific features localized and policy-aware.",
      "Respect subsystem context rules such as sleeping, locking, and object lifetime constraints.",
      "Read Rust for Linux policy and reference-driver material before inventing new abstraction layers.",
      "Treat driver ergonomics and safety wrappers as part of subsystem design, not just convenience."
    ],
    useWhen: [
      "You are studying or reviewing Rust for Linux code.",
      "You are designing driver abstractions or reading reference drivers.",
      "You need to understand how Rust fits kernel constraints."
    ],
    avoidWhen: [
      "You only need generic embedded or firmware guidance outside Linux.",
      "You are assuming std-like or user-space process behavior applies."
    ],
    pitfalls: [
      "Leaking unsafe details out of driver or kernel abstractions.",
      "Ignoring the project's unstable-feature and version policy.",
      "Forgetting that kernel context rules shape API design."
    ],
    practice: [
      "Read one reference driver and identify where safety is encoded in abstractions.",
      "Map one driver path against sleeping and locking constraints.",
      "List which parts of a kernel abstraction can evolve separately from driver code."
    ],
    sources: [
      "https://rust-for-linux.com/",
      "https://rust-for-linux.com/unstable-features",
      "https://rust-for-linux.com/asix-phy-driver",
      "https://rust-for-linux.com/contact",
      "https://rust-for-linux.com/klint"
    ],
    related: ["compiler-tooling", "simd-intrinsics"]
  },
  "simd-intrinsics": {
    title: "SIMD and Intrinsics",
    summary:
      "Low-level SIMD work in Rust is mostly about disciplined feature gating, runtime dispatch, and keeping architecture-specific code from spreading through the codebase.",
    rules: [
      "Measure first; intrinsics are not a substitute for better algorithms or data layout.",
      "Use `std::arch` for stable architecture-specific intrinsics.",
      "Use runtime feature detection or compile-time gating where CPU features are not fixed.",
      "Keep a correct scalar fallback unless deployment is tightly controlled.",
      "Acknowledge that `std::simd` portable SIMD remains nightly-only experimental as checked on 2026-03-19."
    ],
    useWhen: [
      "You are reviewing or designing low-level numeric or bit-manipulation hot paths.",
      "You need to choose between stable intrinsics and experimental portable SIMD.",
      "You are implementing architecture-specific fast paths."
    ],
    avoidWhen: [
      "The performance claim is speculative or unmeasured.",
      "You are using intrinsics where plain Rust already optimizes well enough."
    ],
    pitfalls: [
      "No feature gating or fallback path for unsupported CPUs.",
      "Assuming portable SIMD is stable when it is still experimental.",
      "Spreading architecture-specific code through high-level modules."
    ],
    practice: [
      "Take one hotspot and decide whether `std::arch` is justified after measurement.",
      "Sketch a runtime-dispatch path with a scalar fallback.",
      "Compare a stable intrinsic approach to nightly portable SIMD for the same kernel."
    ],
    sources: [
      "https://doc.rust-lang.org/std/arch/index.html",
      "https://doc.rust-lang.org/std/macro.is_x86_feature_detected.html",
      "https://doc.rust-lang.org/core/arch/index.html",
      "https://doc.rust-lang.org/beta/std/simd/struct.Simd.html"
    ],
    related: ["fuzzing-reliability", "kernel-drivers", "coverage-frontiers"]
  },
  "coverage-frontiers": {
    title: "Coverage and Frontier Domains",
    summary:
      "The current Rust skill set now covers language, backend ecosystem, platforms, compiler internals, fuzzing, kernel work, and SIMD. The remaining high-value frontier domains are verification, release and distribution, GUI, and graphics or GPU work.",
    rules: [
      "Create a new Rust skill only when the domain brings its own toolchain, testing loop, CI matrix, and operational failure modes.",
      "Keep crate-level advice inside existing skills when the real problem is still core Rust design.",
      "Verification deserves a separate lane when property tests, model checking, or concurrency-interleaving checks drive design decisions.",
      "Distribution deserves a separate lane when cross-compilation, packaging, signing, and release artifacts become first-class concerns.",
      "GUI and graphics should split only if the product genuinely depends on desktop UX or rendering architecture."
    ],
    useWhen: [
      "You need to know which Rust areas are already covered and which ones still deserve dedicated skills.",
      "You are planning the next Rust specialization to add to this repository.",
      "You need a roadmap for advanced Rust domains beyond the current four specialization topics."
    ],
    avoidWhen: [
      "You already know the question belongs to one concrete domain such as compiler work or fuzzing.",
      "You are trying to split a new skill only because one crate is popular."
    ],
    pitfalls: [
      "Creating a separate skill for a crate that does not change the engineering discipline.",
      "Mixing distribution or verification concerns into a language-only skill until the workflow becomes incoherent.",
      "Assuming GUI, graphics, or data domains matter before the product direction proves it."
    ],
    practice: [
      "Take one Rust project and decide whether its next skill split should be verification, distribution, GUI, or graphics.",
      "Audit a build and release workflow and decide whether it needs a dedicated delivery skill.",
      "List the tools that make verification different from normal tests in one codebase."
    ],
    sources: [
      "https://docs.rs/proptest/latest/proptest/",
      "https://docs.rs/loom/latest/loom/",
      "https://model-checking.github.io/kani/",
      "https://tauri.app/start/",
      "https://docs.rs/egui/latest/egui/",
      "https://bevyengine.org/learn/quick-start/introduction/",
      "https://sotrh.github.io/learn-wgpu/",
      "https://opensource.axo.dev/cargo-dist/"
    ],
    related: ["compiler-tooling", "fuzzing-reliability", "kernel-drivers", "simd-intrinsics"]
  }
};

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function parseGoal(value: string | undefined): Goal {
  switch (normalize(value)) {
    case "choose":
    case "review":
    case "debug":
    case "design":
    case "study-plan":
      return normalize(value) as Goal;
    case "learn":
    default:
      return "learn";
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

function rankTopics(text: string): Topic[] {
  const haystack = normalize(text);
  if (!haystack) {
    return [];
  }

  const scores = new Map<Topic, number>();
  for (const topic of TOPIC_ORDER) {
    let score = 0;
    for (const keyword of TOPIC_KEYWORDS[topic]) {
      if (keywordMatches(haystack, keyword)) {
        score += keyword.includes(" ") ? 2 : 1;
      }
    }
    if (score > 0) {
      scores.set(topic, score);
    }
  }

  return [...scores.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([topic]) => topic);
}

function resolveTopics(input: SkillInput): Topic[] {
  const normalizedTopic = normalize(input.topic);
  if (normalizedTopic === "all") {
    return TOPIC_ORDER.filter((topic) => topic !== "overview");
  }
  if (isTopic(normalizedTopic)) {
    return [normalizedTopic];
  }

  const inferred = rankTopics([input.topic, input.question, input.constraints].filter(Boolean).join(" "));
  const narrowed = inferred.filter((topic) => topic !== "overview");
  if (narrowed.length > 0) {
    return narrowed.slice(0, 2);
  }
  if (inferred.length > 0) {
    return inferred.slice(0, 1);
  }

  return ["overview"];
}

function bulletSection(title: string, items: readonly string[]): string {
  if (items.length === 0) {
    return "";
  }
  return [`### ${title}`, ...items.map((item) => `- ${item}`), ""].join("\n");
}

function buildOverviewSection(depth: Depth): string {
  const quickMatrix = takeItems(
    [
      "Compiler/tooling: rustc architecture, queries, MIR, diagnostics.",
      "Fuzzing/reliability: cargo-fuzz, coverage, structure-aware inputs, sanitizers.",
      "Kernel/drivers: Rust for Linux policies, abstractions, and context rules.",
      "SIMD/intrinsics: std::arch, target-feature gating, runtime dispatch, portable_simd status.",
      "Coverage/frontiers: what is already covered and whether verification, delivery, GUI, or graphics deserves the next split."
    ],
    depth
  );

  return [
    "## Rust Specializations Map",
    "",
    TOPICS.overview.summary,
    "",
    bulletSection("Research Baseline", RESEARCH_BASELINE),
    bulletSection("Core Rules", takeItems(TOPICS.overview.rules, depth)),
    bulletSection("Fast Matrix", quickMatrix)
  ]
    .filter(Boolean)
    .join("\n");
}

function buildTopicSection(topic: Topic, goal: Goal, depth: Depth): string {
  const card = TOPICS[topic];
  const parts: string[] = [`## ${card.title}`, "", card.summary, ""];

  switch (goal) {
    case "choose":
      parts.push(bulletSection("Decision Rules", takeItems(card.rules, depth)));
      parts.push(bulletSection("Choose This When", takeItems(card.useWhen, depth)));
      parts.push(bulletSection("Use Something Else When", takeItems(card.avoidWhen, depth)));
      parts.push(bulletSection("Common Mistakes", takeItems(card.pitfalls, depth)));
      break;
    case "debug":
      parts.push(bulletSection("Debug Checklist", takeItems([...card.rules, ...card.pitfalls], depth)));
      parts.push(bulletSection("Likely Failure Modes", takeItems(card.pitfalls, depth)));
      break;
    case "design":
      parts.push(bulletSection("Design Rules", takeItems(card.rules, depth)));
      parts.push(bulletSection("Use This Shape When", takeItems(card.useWhen, depth)));
      parts.push(bulletSection("Architecture Risks", takeItems(card.pitfalls, depth)));
      break;
    case "review":
      parts.push(bulletSection("Review Checklist", takeItems([...card.rules, ...card.useWhen], depth)));
      parts.push(bulletSection("Red Flags", takeItems(card.pitfalls, depth)));
      break;
    case "study-plan":
      parts.push(bulletSection("Study Sequence", takeItems(card.rules, depth)));
      parts.push(bulletSection("Practice Work", takeItems(card.practice, depth)));
      break;
    case "learn":
    default:
      parts.push(bulletSection("Key Rules", takeItems(card.rules, depth)));
      parts.push(bulletSection("Use When", takeItems(card.useWhen, depth)));
      parts.push(bulletSection("Avoid or Reconsider When", takeItems(card.avoidWhen, depth)));
      parts.push(bulletSection("Common Mistakes", takeItems(card.pitfalls, depth)));
      parts.push(bulletSection("Practice", takeItems(card.practice, depth)));
      break;
  }

  parts.push(bulletSection("Related Topics", card.related.map((item) => item)));
  return parts.filter(Boolean).join("\n");
}

function dedupe(items: readonly string[]): string[] {
  return [...new Set(items)];
}

function collectSources(topics: readonly Topic[]): string[] {
  const sources: string[] = [];
  for (const topic of topics) {
    sources.push(...TOPICS[topic].sources);
  }
  return dedupe(sources);
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

function buildReport(input: SkillInput, topics: Topic[], goal: Goal, depth: Depth): string {
  const sections: string[] = [];

  if (topics.includes("overview")) {
    sections.push(buildOverviewSection(depth));
  }

  for (const topic of topics) {
    if (topic === "overview") {
      continue;
    }
    sections.push(buildTopicSection(topic, goal, depth));
  }

  if (topics.length > 1 && !topics.includes("overview")) {
    sections.unshift(buildOverviewSection(depth));
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
  const selectedTopics = resolveTopics(input);
  const sources = collectSources(selectedTopics.includes("overview") ? selectedTopics : ["overview", ...selectedTopics]);

  return {
    skill: "rust-specializations",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
