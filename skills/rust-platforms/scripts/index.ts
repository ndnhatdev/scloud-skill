type Topic = "overview" | "wasm" | "embedded-no-std" | "embassy" | "firmware-stack";
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
  skill: "rust-platforms";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = ["overview", "wasm", "embedded-no-std", "embassy", "firmware-stack"] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official platform docs reviewed on 2026-03-19.",
  "embassy-executor docs reviewed showed embassy-executor 0.9.1.",
  "wasm-bindgen docs reviewed showed wasm-bindgen 0.2.114 on docs.rs.",
  "Guidance is intentionally biased toward official Rust Wasm, Embedded Rust, Embedonomicon, and Embassy documentation."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust platforms", "rust wasm", "embedded rust", "firmware", "platform constraints"],
  wasm: ["wasm", "webassembly", "wasm32", "wasm-bindgen", "wasm-pack", "web-sys", "js-sys", "browser", "node", "javascript interop"],
  "embedded-no-std": ["embedded", "no_std", "#![no_std]", "interrupt", "interrupts", "linker", "memory.x", "pac", "hal", "bsp", "critical section", "memory mapped"],
  embassy: ["embassy", "embassy-executor", "embassy-time", "embassy-sync", "spawner", "sendspawner", "spawntoken", "embassy task", "embassy main", "task ownership", "interrupt executor"],
  "firmware-stack": ["firmware stack", "board bring-up", "bringup", "flashing", "probe-rs", "firmware architecture", "hal pac bsp", "embedded async architecture"]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Platforms Map",
    summary:
      "Platform Rust work becomes predictable once you separate language rules from target constraints: WebAssembly host interop, no_std runtime absence, Embassy executor behavior, and whole-firmware structure.",
    rules: [
      "Choose the target environment first; platform constraints beat generic library assumptions.",
      "Keep portable logic separate from platform glue.",
      "Treat host interop, linker layout, and executor behavior as contracts, not implementation detail.",
      "Keep resource ownership explicit across interrupts, tasks, and platform boundaries.",
      "Review deployment and test workflow as part of the platform design."
    ],
    useWhen: [
      "You need a top-level map for Rust on wasm or embedded targets.",
      "You need to decide which platform layer owns a problem.",
      "You want a platform-focused review checklist."
    ],
    avoidWhen: [
      "You need only core language guidance with no target-specific behavior.",
      "You need backend crate guidance such as Axum or SQLx rather than platform constraints."
    ],
    pitfalls: [
      "Porting native assumptions directly into wasm or embedded code.",
      "Mixing platform bootstrap, domain logic, and unsafe hardware access in one layer.",
      "Treating flashing, testing, and target setup as somebody else's problem."
    ],
    practice: [
      "Classify one problem as wasm interop, embedded runtime, Embassy coordination, or full firmware architecture.",
      "Draw the boundary between portable logic and platform glue in one codebase.",
      "Audit one target for how it builds, tests, and deploys."
    ],
    sources: [
      "https://rustwasm.github.io/docs/book/reference/add-wasm-support-to-crate.html",
      "https://docs.rust-embedded.org/book/",
      "https://embassy.dev/book/"
    ],
    related: ["wasm", "embedded-no-std", "embassy", "firmware-stack"]
  },
  wasm: {
    title: "Rust Wasm",
    summary:
      "Rust on WebAssembly works best when the JS boundary is narrow, target-specific assumptions are explicit, and portability plus size are treated as first-class constraints.",
    rules: [
      "Target `wasm32-unknown-unknown` when using wasm-bindgen-style JS interop.",
      "Factor I/O and threading assumptions out of portable libraries.",
      "Use `cfg(target_arch = \"wasm32\")` and target-specific dependencies for wasm-only interop.",
      "Keep the exported JS boundary small and deliberate.",
      "Test on an actual wasm target, not only natively."
    ],
    useWhen: [
      "You are porting a crate or service component to wasm.",
      "You are designing JS interop or browser or Node testing.",
      "You are reviewing wasm portability or size work."
    ],
    avoidWhen: [
      "You are assuming native threads, sync I/O, or unrestricted std behavior.",
      "You are exposing too much internal Rust structure directly to JavaScript."
    ],
    pitfalls: [
      "Leaking native-only assumptions such as `std::fs` or direct thread spawning into wasm code paths.",
      "Spraying `#[wasm_bindgen]` through internal code instead of isolating the boundary.",
      "Skipping wasm-target tests and trusting native tests to imply portability."
    ],
    practice: [
      "Take one native crate and identify which APIs need to move behind target-specific boundaries for wasm.",
      "Audit one JS boundary for conversion shape, ownership, and supported exported types.",
      "Add one wasm-target test path to a crate that claims wasm support."
    ],
    sources: [
      "https://rustwasm.github.io/docs/book/reference/add-wasm-support-to-crate.html",
      "https://rustwasm.github.io/docs/wasm-bindgen/",
      "https://rustwasm.github.io/docs/wasm-bindgen/reference/rust-targets.html",
      "https://rustwasm.github.io/docs/wasm-bindgen/wasm-bindgen-test/index.html",
      "https://rustwasm.github.io/wasm-bindgen/reference/optimize-size.html",
      "https://docs.rs/wasm-bindgen/latest/wasm_bindgen/prelude/",
      "https://docs.rs/serde-wasm-bindgen"
    ],
    related: ["firmware-stack"]
  },
  "embedded-no-std": {
    title: "Embedded no_std",
    summary:
      "Embedded Rust design quality depends on embracing runtime absence, explicit memory layout, interrupt concurrency, and proper HAL or PAC boundaries.",
    rules: [
      "Treat `#![no_std]` as a platform contract, not a badge.",
      "Make target memory, startup, and linker assumptions explicit.",
      "Keep PAC, HAL, BSP, and application layers distinct.",
      "Model interrupts as concurrent actors when resources are shared.",
      "Use critical sections deliberately and keep them short."
    ],
    useWhen: [
      "You are designing firmware for microcontrollers or other bare-metal targets.",
      "You are reviewing interrupt safety, memory layout, or linker setup.",
      "You are deciding how much of a crate can stay platform-agnostic."
    ],
    avoidWhen: [
      "You are claiming `no_std` while depending on hidden `std` features or host-only workflow.",
      "You are scattering hardware details across domain logic."
    ],
    pitfalls: [
      "Hidden `std` dependencies in a supposedly `no_std` crate.",
      "Unsafe interrupt sharing or broad critical sections with no latency budget.",
      "Application logic tied directly to register-level details."
    ],
    practice: [
      "Draw the PAC, HAL, BSP, and application layers for one firmware project.",
      "Review one interrupt-shared resource and justify its synchronization primitive.",
      "Check one crate's dependency graph for `std` assumptions before calling it `no_std`."
    ],
    sources: [
      "https://docs.rust-embedded.org/book/",
      "https://docs.rust-embedded.org/book/intro/no-std.html",
      "https://docs.rust-embedded.org/book/peripherals/index.html",
      "https://docs.rust-embedded.org/book/start/interrupts.html",
      "https://docs.rust-embedded.org/book/concurrency/",
      "https://docs.rust-embedded.org/embedonomicon/",
      "https://docs.rust-embedded.org/embedonomicon/memory-layout.html"
    ],
    related: ["embassy", "firmware-stack"]
  },
  embassy: {
    title: "Embassy Async Embedded",
    summary:
      "Embassy works well when task spawning, executor rules, timer usage, and peripheral ownership are explicit rather than implied by the async syntax.",
    rules: [
      "Prefer the safe `main` and `task` macros before raw executor APIs.",
      "Do not block Embassy tasks; cooperative scheduling only works if tasks yield.",
      "Use `Spawner` in-executor and `SendSpawner` only when crossing thread boundaries with `Send` tasks.",
      "Treat task functions and spawn tokens as explicit lifecycle control, not hidden magic.",
      "Choose Embassy sync primitives by communication shape: queue, latest value, broadcast, or mutex."
    ],
    useWhen: [
      "You are designing async embedded firmware with Embassy.",
      "You are reviewing task topology, timers, channels, or interrupt-driven async behavior.",
      "You are debugging spawner or task-lifecycle confusion."
    ],
    avoidWhen: [
      "You are using async syntax to hide blocking hardware interactions or unclear ownership.",
      "You are reaching for raw executor APIs without needing lower-level control."
    ],
    pitfalls: [
      "Blocking tasks so the executor cannot regain control.",
      "Misusing `Spawner` where only `SendSpawner` makes sense or vice versa.",
      "Treating shared peripherals as if async removes ownership constraints."
    ],
    practice: [
      "Map one firmware design into tasks, shared resources, and wake-up events.",
      "Take one polling loop and redesign it with Embassy timers or event-driven primitives where appropriate.",
      "Review one use of `Channel`, `Signal`, or `Mutex` and justify it against the communication pattern."
    ],
    sources: [
      "https://embassy.dev/book/",
      "https://docs.rs/embassy-executor/latest/embassy_executor/struct.Spawner.html",
      "https://docs.embassy.dev/embassy-executor/git/std/attr.task.html",
      "https://docs.embassy.dev/embassy-executor/git/std/struct.SendSpawner.html",
      "https://docs.embassy.dev/embassy-executor/git/cortex-m/struct.SpawnToken.html",
      "https://docs.rs/embassy-time/latest/embassy_time/struct.Timer.html",
      "https://docs.rs/embassy-sync/latest/embassy_sync/"
    ],
    related: ["embedded-no-std", "firmware-stack"]
  },
  "firmware-stack": {
    title: "Firmware Stack Architecture",
    summary:
      "Firmware becomes maintainable when target setup, hardware ownership, async or interrupt model, and deployment workflow are explicit in the architecture from day one.",
    rules: [
      "Bootstrap target, memory layout, logging, and flashing workflow explicitly.",
      "Keep board and chip bring-up centralized instead of scattered across modules.",
      "Let long-lived tasks or drivers own peripherals rather than sharing them ad hoc.",
      "Separate platform glue from application behavior and protocol logic.",
      "Treat debug, flashing, panic, and test workflow as part of the system design."
    ],
    useWhen: [
      "You need a full-firmware architecture review or design, not one crate answer.",
      "You are combining no_std, HAL/PAC, Embassy, and board-specific setup.",
      "You need a maintainable bring-up and deployment shape."
    ],
    avoidWhen: [
      "You only need a narrow wasm or Embassy API answer.",
      "You are ignoring how the code is built, flashed, and debugged on real hardware."
    ],
    pitfalls: [
      "Implicit bootstrap order or undocumented chip-specific config.",
      "Peripherals shared everywhere with no clear owner.",
      "No repeatable flashing, logging, or integration-test story."
    ],
    practice: [
      "Write the bootstrap order for one board from reset to first useful task.",
      "Assign one owner for each peripheral in a firmware design and note every cross-task handoff.",
      "Document one flashing and debug path so a new engineer can reproduce it."
    ],
    sources: [
      "https://docs.rust-embedded.org/book/",
      "https://docs.rust-embedded.org/book/intro/no-std.html",
      "https://docs.rust-embedded.org/embedonomicon/memory-layout.html",
      "https://embassy.dev/book/"
    ],
    related: ["embedded-no-std", "embassy", "wasm"]
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
      "Wasm: target-specific interop, tests, and size constraints.",
      "Embedded no_std: runtime absence, interrupts, linker layout, HAL/PAC boundaries.",
      "Embassy: executor, tasks, timers, channels, and async embedded ownership.",
      "Firmware stack: bootstrap, logging, flashing, and whole-target architecture."
    ],
    depth
  );

  return [
    "## Rust Platforms Map",
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
    skill: "rust-platforms",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
