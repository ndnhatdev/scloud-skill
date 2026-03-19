type Topic =
  | "overview"
  | "cross-compilation"
  | "target-tooling"
  | "packaging-release"
  | "binary-compatibility"
  | "delivery-strategy";
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
  skill: "rust-delivery";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = [
  "overview",
  "cross-compilation",
  "target-tooling",
  "packaging-release",
  "binary-compatibility",
  "delivery-strategy"
] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official delivery docs reviewed on 2026-03-19.",
  "rustup guidance was checked for the rule that rustup target add installs std but not the full linker or SDK toolchain.",
  "cross, cargo-zigbuild, and cargo-xwin guidance was checked against current upstream READMEs.",
  "dist guidance was checked against the current axodotdev docs, with the note that the tool is now branded as dist although cargo-dist remains common usage."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust delivery", "release pipeline", "cross compile rust", "ship rust binary", "cargo dist", "cross", "zigbuild"],
  "cross-compilation": [
    "rustup target add",
    "cross compilation",
    "cross compile",
    "cargo build --target",
    ".cargo/config",
    "build-std",
    "linker",
    "target triple",
    "cross-compilation"
  ],
  "target-tooling": [
    "cross",
    "cargo-zigbuild",
    "cargo xwin",
    "cargo-xwin",
    "qemu",
    "container engine",
    "glibc version",
    "x86_64-pc-windows-msvc",
    "podman"
  ],
  "packaging-release": [
    "dist",
    "cargo-dist",
    "release.yml",
    "github release",
    "installer",
    "release artifact",
    "package metadata dist",
    "profile.dist"
  ],
  "binary-compatibility": [
    "musl",
    "gnu",
    "glibc",
    "msvc",
    "static linking",
    "dynamic linking",
    "universal2",
    "portable binary",
    "compatibility"
  ],
  "delivery-strategy": [
    "which tool",
    "what should i use",
    "delivery strategy",
    "release strategy",
    "ci matrix",
    "ship binaries",
    "nên dùng gì",
    "chọn tool nào"
  ]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Delivery Map",
    summary:
      "Rust delivery work splits into target setup, target tooling, binary compatibility, packaging, and release automation. The senior decision is to choose the smallest delivery stack that can actually ship and support the targets you claim.",
    rules: [
      "Separate build success from shipping support.",
      "Choose tools from target and compatibility constraints, not from fashion.",
      "Keep repo-owned config for linkers, runners, targets, and release inputs.",
      "Use native runners when platform-native packaging or signing is the real bottleneck.",
      "Automate only after the target matrix is stable enough to deserve automation."
    ],
    useWhen: [
      "You need a high-level map of Rust delivery decisions.",
      "You are planning how a Rust project should ship binaries across platforms.",
      "You need to classify a build or release problem into the right delivery layer."
    ],
    avoidWhen: [
      "The question is only about ordinary Rust language behavior.",
      "The problem is wasm or embedded runtime behavior instead of shipping host binaries."
    ],
    pitfalls: [
      "Treating rustup target installation as a full cross-compilation solution.",
      "Over-automating release steps before target support is stable.",
      "Making compatibility promises that the team does not test."
    ],
    practice: [
      "List the targets your repo can truly support today.",
      "Map one release problem to target setup, tooling, compatibility, packaging, or strategy.",
      "Explain where native runners are still required in one delivery pipeline."
    ],
    sources: [
      "https://rust-lang.github.io/rustup/cross-compilation.html",
      "https://github.com/cross-rs/cross",
      "https://github.com/rust-cross/cargo-zigbuild",
      "https://github.com/rust-cross/cargo-xwin",
      "https://github.com/axodotdev/cargo-dist"
    ],
    related: ["cross-compilation", "target-tooling", "packaging-release", "binary-compatibility", "delivery-strategy"]
  },
  "cross-compilation": {
    title: "Cross Compilation Basics",
    summary:
      "The foundational delivery rule is that Rust target support is not the same thing as a full system toolchain. Linkers, SDKs, and target-specific config still have to exist somewhere explicit.",
    rules: [
      "Use `rustup target add` to install target std, then solve linker or SDK needs explicitly.",
      "Encode target config in `.cargo/config.toml` when possible.",
      "Keep custom targets and `build-std` as exceptions, not defaults.",
      "Prefer supported standard triples before inventing custom specs.",
      "Make CI reproduce the same cross path you expect locally."
    ],
    useWhen: [
      "You are setting up a new target triple or linker path.",
      "You need to understand why a cross build still fails after `rustup target add`.",
      "You are deciding whether `build-std` is actually necessary."
    ],
    avoidWhen: [
      "The real question is which higher-level tool to use once the target basics are already clear.",
      "The target is wasm or embedded firmware and runtime constraints dominate."
    ],
    pitfalls: [
      "Missing linker or SDK assumptions.",
      "Using `build-std` as a generic fix.",
      "Keeping target config only in shell snippets."
    ],
    practice: [
      "Move one ad hoc linker flag into `.cargo/config.toml`.",
      "Document one target triple and why its libc or ABI choice exists.",
      "Audit whether one custom-target use case truly needs nightly."
    ],
    sources: [
      "https://rust-lang.github.io/rustup/cross-compilation.html",
      "https://doc.rust-lang.org/cargo/reference/config.html#target",
      "https://doc.rust-lang.org/cargo/commands/cargo-build.html",
      "https://doc.rust-lang.org/cargo/reference/unstable.html#build-std"
    ],
    related: ["target-tooling", "binary-compatibility"]
  },
  "target-tooling": {
    title: "Target Tooling",
    summary:
      "Once the target basics are known, delivery becomes a tooling choice between native builds, containerized cross builds, Zig-based linking, and Windows MSVC cross tooling.",
    rules: [
      "Use native cargo first when it is already reproducible.",
      "Use `cross` when containerized target setup is the main win.",
      "Use `cargo-zigbuild` when Zig lowers Linux or Apple cross-linking pain or lets you target a lower glibc floor.",
      "Use `cargo-xwin` for Windows MSVC artifacts from non-Windows hosts.",
      "Remember that test behavior under emulation is not the same as native validation."
    ],
    useWhen: [
      "You need to choose between `cross`, `cargo-zigbuild`, `cargo-xwin`, or native builds.",
      "You are debugging toolchain friction across OS targets.",
      "You want to simplify release matrix setup for non-host targets."
    ],
    avoidWhen: [
      "You have not yet clarified the target triple, ABI, or linker needs.",
      "You are trying to avoid native validation where native packaging still matters."
    ],
    pitfalls: [
      "`cross test` treated like a drop-in replacement for native CI.",
      "`cargo-zigbuild` run without a target so it behaves like plain cargo.",
      "Windows release pipelines that never validate the produced artifacts."
    ],
    practice: [
      "Pick one target and justify why `cross` or `cargo-zigbuild` fits it better.",
      "Document where QEMU-backed tests are acceptable and where they are not.",
      "Cache one toolchain dependency path for CI instead of redownloading it every run."
    ],
    sources: [
      "https://github.com/cross-rs/cross",
      "https://github.com/rust-cross/cargo-zigbuild",
      "https://github.com/rust-cross/cargo-xwin"
    ],
    related: ["cross-compilation", "binary-compatibility", "delivery-strategy"]
  },
  "packaging-release": {
    title: "Packaging and Release Automation",
    summary:
      "Packaging is a distinct layer from compilation. `dist` is valuable when the project knows what it ships and wants generated CI, installers, and release artifacts instead of hand-maintaining them.",
    rules: [
      "Adopt `dist` only after target and artifact choices are stable enough to automate.",
      "Treat generated CI as owned source code, not opaque machinery.",
      "Keep tag format, changelog source, and installer choices explicit.",
      "Stabilize artifact names because users and automation will depend on them.",
      "Use packaging automation to reduce toil, not to hide unclear support policy."
    ],
    useWhen: [
      "You need repeatable release artifacts and generated CI.",
      "You are packaging installers or archives for multiple targets.",
      "You want to review whether a Rust app is ready for `dist`."
    ],
    avoidWhen: [
      "The build matrix is still changing every week.",
      "You only need to compile a binary locally with no distribution workflow."
    ],
    pitfalls: [
      "Auto-generating release workflows before the support matrix is settled.",
      "No clear source of truth for release notes or tags.",
      "Treating packaging as separate from compatibility promises."
    ],
    practice: [
      "Define one artifact matrix and installer set before touching automation.",
      "Review one generated release workflow and explain each job in plain language.",
      "Write down which release inputs are human-maintained and which are generated."
    ],
    sources: [
      "https://github.com/axodotdev/cargo-dist",
      "https://axodotdev.github.io/cargo-dist/book/",
      "https://axodotdev.github.io/cargo-dist/book/workspaces/simple-guide.html",
      "https://axodotdev.github.io/cargo-dist/book/reference/config.html"
    ],
    related: ["binary-compatibility", "delivery-strategy"]
  },
  "binary-compatibility": {
    title: "Binary Compatibility",
    summary:
      "Delivery quality depends on ABI and libc decisions as much as on build success. The crucial question is what machines your artifact should run on and what dependencies it can assume.",
    rules: [
      "Choose musl, GNU, or MSVC targets deliberately.",
      "State or enforce your glibc floor when shipping GNU binaries broadly.",
      "Prefer Windows MSVC for mainstream Windows support unless you have a reason otherwise.",
      "Do not assume static glibc is an ordinary supported path.",
      "Test portability claims on environments that match your support statement."
    ],
    useWhen: [
      "You need to choose musl vs GNU or MSVC vs GNU.",
      "You need to lower the glibc floor for Linux distribution.",
      "You are defining artifact compatibility promises."
    ],
    avoidWhen: [
      "The question is only about how to compile a target once on the host.",
      "The project is not yet ready to make support promises."
    ],
    pitfalls: [
      "Vague labels like 'Linux x64' with no libc story.",
      "Assuming static linking automatically improves support.",
      "Shipping binaries tested only on the build machine."
    ],
    practice: [
      "Document the libc or ABI story for one Linux and one Windows artifact.",
      "Choose whether one CLI should be musl or GNU and justify it.",
      "State one explicit support floor instead of a vague platform claim."
    ],
    sources: [
      "https://github.com/rust-cross/cargo-zigbuild",
      "https://github.com/rust-cross/cargo-xwin",
      "https://github.com/cross-rs/cross"
    ],
    related: ["cross-compilation", "target-tooling", "delivery-strategy"]
  },
  "delivery-strategy": {
    title: "Delivery Strategy",
    summary:
      "The senior decision is not only how to compile, but how to keep release targets, compatibility promises, and automation coherent over time without creating a CI maze.",
    rules: [
      "Start from the targets you can test and support.",
      "Prefer a small stable release matrix over an ambitious fragile one.",
      "Use native validation where platform-native behavior matters.",
      "Automate after the build and compatibility model is understood.",
      "Keep canonical local and CI commands aligned."
    ],
    useWhen: [
      "You need to choose a long-term release workflow for a Rust app.",
      "You are deciding how cross-compilation and packaging fit together.",
      "You want to review whether CI and release ownership are coherent."
    ],
    avoidWhen: [
      "The problem is just one linker failure or one missing SDK package.",
      "You are trying to maximize target count before validating one clean path."
    ],
    pitfalls: [
      "Huge release matrices with weak support ownership.",
      "Mixing convenience scripts and official release paths.",
      "Treating generated CI as if it never needs review."
    ],
    practice: [
      "Draft a release matrix with only the targets you can actually support.",
      "Map one current CI job to its true delivery purpose.",
      "Name where native runners are mandatory in one pipeline."
    ],
    sources: [
      "https://rust-lang.github.io/rustup/cross-compilation.html",
      "https://github.com/cross-rs/cross",
      "https://github.com/rust-cross/cargo-zigbuild",
      "https://github.com/rust-cross/cargo-xwin",
      "https://github.com/axodotdev/cargo-dist"
    ],
    related: ["target-tooling", "packaging-release", "binary-compatibility"]
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

function isStrategyQuestion(haystack: string): boolean {
  const markers = [" vs ", " versus ", " thay vì ", " nên dùng", "which tool", "what should i use", "choose between"];
  return markers.some((marker) => haystack.includes(marker));
}

function mentionedDeliveryToolCount(haystack: string): number {
  const toolKeywords = ["cargo build", "cross", "cargo-zigbuild", "cargo xwin", "cargo-xwin", "dist", "cargo-dist"];
  let count = 0;
  for (const keyword of toolKeywords) {
    if (keywordMatches(haystack, keyword)) {
      count += 1;
    }
  }
  return count;
}

function resolveTopics(input: SkillInput): Topic[] {
  const normalizedTopic = normalize(input.topic);
  if (normalizedTopic === "all") {
    return TOPIC_ORDER.filter((topic) => topic !== "overview");
  }
  if (isTopic(normalizedTopic)) {
    return [normalizedTopic];
  }

  const combined = [input.topic, input.question, input.constraints].filter(Boolean).join(" ");
  const haystack = normalize(combined);
  const inferred = rankTopics(combined);
  if (isStrategyQuestion(haystack) || mentionedDeliveryToolCount(haystack) >= 2) {
    const rest = inferred.filter((topic) => topic !== "overview" && topic !== "delivery-strategy");
    const prioritized: Topic[] = ["delivery-strategy", ...rest];
    return prioritized.slice(0, 2);
  }

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
      "Cross compilation: target triples, linkers, and Cargo target config.",
      "Target tooling: native cargo, cross, cargo-zigbuild, and cargo-xwin.",
      "Packaging and release: dist-generated artifacts, installers, and CI.",
      "Binary compatibility: musl vs GNU, MSVC, glibc floor, and portability.",
      "Delivery strategy: support matrix, release ownership, and CI rollout."
    ],
    depth
  );

  return [
    "## Rust Delivery Map",
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
    skill: "rust-delivery",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
