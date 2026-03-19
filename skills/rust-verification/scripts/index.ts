type Topic = "overview" | "proptest" | "loom" | "kani" | "verification-strategy";
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
  skill: "rust-verification";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = ["overview", "proptest", "loom", "kani", "verification-strategy"] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official verification docs reviewed on 2026-03-19.",
  "Proptest guidance is aligned with the Proptest Book and docs.rs API docs.",
  "Loom guidance is aligned with the latest docs.rs crate docs, including cfg(loom) and debugging workflow.",
  "Kani guidance is aligned with the official Kani book, usage docs, feature-support docs, and CI docs.",
  "As checked on 2026-03-19, Kani docs still describe concurrency as out of scope."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust verification", "verification tools", "proof harness", "property testing", "loom", "kani"],
  proptest: ["proptest", "property test", "property-based", "shrinking", "strategy", "strategies", "generator", "arbitrary input", "kiểm thử thuộc tính"],
  loom: ["loom", "interleaving", "concurrency test", "schedule exploration", "cfg loom", "deterministic concurrency", "đồng thời", "lịch thực thi"],
  kani: ["kani", "proof harness", "#[kani::proof]", "kani::any", "formal verification", "model checking", "symbolic input", "kiểm chứng", "xác minh"],
  "verification-strategy": [
    "which tool",
    "choose verification",
    "verification strategy",
    "what should i use",
    "unit test vs",
    "fuzz vs",
    "proptest vs",
    "loom vs",
    "kani vs",
    "nên dùng gì",
    "chọn tool nào"
  ]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Verification Map",
    summary:
      "Rust verification work usually splits into four layers: ordinary tests for known examples, proptest for structured invariant search, loom for concurrent interleavings, and Kani for bounded proofs of safety or correctness.",
    rules: [
      "Choose the tool from the failure model: input-space bugs, schedule bugs, or bounded proof obligations are different problems.",
      "Keep the verified unit small enough that the tool can actually explore it.",
      "Generated failures should become stable regression tests when practical.",
      "Use complementary verification layers instead of trying to make one tool replace all others.",
      "Treat assumptions, shrinking, and determinism as part of the engineering design."
    ],
    useWhen: [
      "You need a high-level map of Rust verification tools.",
      "You need to decide where proptest, loom, or Kani belongs in a codebase.",
      "You want a study plan for deeper verification work in Rust."
    ],
    avoidWhen: [
      "You only need ordinary unit testing advice with no special verification tooling.",
      "You are trying to skip bug-model analysis and pick tools from hype."
    ],
    pitfalls: [
      "Using property testing for concurrency bugs or Kani for large concurrent services.",
      "Assuming a successful run proves more than the harness actually asserts.",
      "Treating generated or model-checked failures as sufficient without readable regressions."
    ],
    practice: [
      "Take one Rust bug and classify it as regression, property, concurrency-interleaving, or proof work.",
      "Name one small component in your codebase that is a candidate for each verification layer.",
      "Write down what each tool would need to model explicitly before you run it."
    ],
    sources: [
      "https://altsysrq.github.io/proptest-book/",
      "https://docs.rs/loom/latest/loom/",
      "https://model-checking.github.io/kani/",
      "https://rust-fuzz.github.io/book/"
    ],
    related: ["proptest", "loom", "kani", "verification-strategy"]
  },
  proptest: {
    title: "Property Testing with Proptest",
    summary:
      "Proptest is strongest when you can express a stable invariant over structured inputs and want automatic shrinking to turn failures into minimal, debuggable cases.",
    rules: [
      "Design the property before the generator.",
      "Generate valid structured inputs directly rather than filtering most cases away.",
      "Keep shrunk failures human-readable and turn them into regression tests.",
      "Use reference-implementation comparisons or round-trip properties where they fit naturally.",
      "Keep example tests for important edge cases even when proptest exists."
    ],
    useWhen: [
      "You have a function or API with many structured valid inputs.",
      "You want automatic shrinking when invariants fail.",
      "You can state correctness as a property instead of only a list of examples."
    ],
    avoidWhen: [
      "The real bug model is concurrency scheduling or hostile byte-stream parsing.",
      "You cannot define a meaningful invariant and are only generating random data."
    ],
    pitfalls: [
      "Weak properties that only restate the implementation.",
      "Strategies that generate irrelevant or invalid data and then filter heavily.",
      "Failing cases that still shrink to something too large to understand."
    ],
    practice: [
      "Add a round-trip or ordering invariant to one API.",
      "Refactor one filtered generator into a direct structured strategy.",
      "Promote one minimized failure into an explicit regression test."
    ],
    sources: [
      "https://altsysrq.github.io/proptest-book/",
      "https://docs.rs/proptest/latest/proptest/",
      "https://altsysrq.github.io/proptest-book/proptest/tutorial/shrinking-basics.html",
      "https://altsysrq.github.io/proptest-book/proptest/tutorial/transforming-strategies.html"
    ],
    related: ["verification-strategy"]
  },
  loom: {
    title: "Concurrency Model Checking with Loom",
    summary:
      "Loom is for small deterministic concurrent models where schedule interleavings are the source of bugs and exhaustive exploration is worth the modeling cost.",
    rules: [
      "Use loom only for small synchronization cores, not whole apps.",
      "Swap primitives to loom types under `cfg(loom)` and remove other nondeterminism.",
      "Run loom tests in release mode as recommended by the docs.",
      "Reduce state-space first when tests explode combinatorially.",
      "Use checkpoints and logging only after the model is already small enough to explore."
    ],
    useWhen: [
      "You suspect bugs from scheduling, atomic ordering, or lock interactions.",
      "You can isolate a small concurrent component into a deterministic model.",
      "Ordinary tests miss rare interleavings."
    ],
    avoidWhen: [
      "The code depends heavily on real I/O, timers, or other uncontrolled nondeterminism.",
      "You are trying to model an entire service instead of a small core."
    ],
    pitfalls: [
      "Leaving ordinary `std` primitives in the modeled path.",
      "Huge state spaces caused by modeling too much behavior.",
      "Ignoring a failing loom schedule because it is rare in production."
    ],
    practice: [
      "Extract one lock or state-machine core and write a loom model for it.",
      "Replace one production primitive path with a `cfg(loom)` abstraction.",
      "Use a checkpoint to isolate a failing schedule."
    ],
    sources: [
      "https://docs.rs/loom/latest/loom/",
      "https://docs.rs/loom/latest/loom/#writing-tests",
      "https://docs.rs/loom/latest/loom/#debugging-failing-tests"
    ],
    related: ["verification-strategy", "kani"]
  },
  kani: {
    title: "Formal Verification with Kani",
    summary:
      "Kani is a bounded model checker for Rust that works best on small critical logic, explicit proof harnesses, and properties that can be expressed over symbolic inputs and explicit assumptions.",
    rules: [
      "Write focused proof harnesses with `#[kani::proof]` and explicit assertions.",
      "Use `kani::any()` and assumptions carefully so the search space is both meaningful and tractable.",
      "Expect to bound loops, recursion, and input sizes when needed.",
      "Read limitations and feature-support docs before trusting unsupported areas.",
      "Keep Kani in CI as a selective layer, not an unbounded everything-check."
    ],
    useWhen: [
      "You need stronger guarantees about small safety-critical or arithmetic-heavy logic.",
      "You are verifying unsafe or low-level code with explicit invariants.",
      "You can isolate a bounded state space and encode the property precisely."
    ],
    avoidWhen: [
      "The code is large, heavily async, or fundamentally concurrent.",
      "You cannot state the property as explicit assertions over a bounded model."
    ],
    pitfalls: [
      "Assumptions that hide the interesting bugs.",
      "Harnesses that try to prove too many unrelated things at once.",
      "Ignoring the current unsupported-feature and concurrency limits."
    ],
    practice: [
      "Write one small proof harness for a critical invariant.",
      "Translate one Kani counterexample into a normal regression test.",
      "Audit one harness and explain why each assumption exists."
    ],
    sources: [
      "https://model-checking.github.io/kani/",
      "https://model-checking.github.io/kani/usage.html",
      "https://model-checking.github.io/kani/reference/attributes.html",
      "https://model-checking.github.io/kani/tutorial-nondeterministic-variables.html",
      "https://model-checking.github.io/kani/limitations.html",
      "https://model-checking.github.io/kani/rust-feature-support.html",
      "https://model-checking.github.io/kani/install-github-ci.html"
    ],
    related: ["verification-strategy", "loom"]
  },
  "verification-strategy": {
    title: "Verification Strategy",
    summary:
      "The senior decision is not 'which verification tool is best', but 'which failure surface am I actually trying to cover' and which combination of tests gives leverage without wasting time.",
    rules: [
      "Use example tests for known cases, proptest for structured invariants, fuzzing for hostile boundary inputs, loom for interleavings, and Kani for bounded proofs.",
      "Keep each tool close to the smallest unit where it has leverage.",
      "Convert generated or proven counterexamples into readable regressions when possible.",
      "Roll expensive verification into CI selectively instead of running everything on every push.",
      "Do not collapse all reliability work into one giant test suite."
    ],
    useWhen: [
      "You need to choose between proptest, fuzzing, loom, and Kani.",
      "You are designing a layered verification plan for a Rust codebase.",
      "You want to audit whether verification effort matches real risk."
    ],
    avoidWhen: [
      "You already know the problem is specifically about one tool and one workflow.",
      "You are trying to justify a heavy verification layer for trivial code."
    ],
    pitfalls: [
      "Overusing a favorite tool for the wrong bug model.",
      "Losing readable regression tests because generated tests became the only coverage.",
      "Adding expensive CI checks without defining a stable subset."
    ],
    practice: [
      "Classify one bug from your repo into the right verification layer.",
      "Draft a CI matrix that separates fast regression checks from slower verification jobs.",
      "Name one component where loom is justified and one where it is not."
    ],
    sources: [
      "https://altsysrq.github.io/proptest-book/",
      "https://docs.rs/loom/latest/loom/",
      "https://model-checking.github.io/kani/",
      "https://rust-fuzz.github.io/book/"
    ],
    related: ["proptest", "loom", "kani"]
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
  const markers = [" vs ", " versus ", " thay vì ", " nên dùng", "what should i use", "which tool", "choose between"];
  return markers.some((marker) => haystack.includes(marker));
}

function mentionedVerificationToolCount(haystack: string): number {
  const toolKeywords = ["unit test", "regression test", "proptest", "fuzz", "loom", "kani"];
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
  if (isStrategyQuestion(haystack) || mentionedVerificationToolCount(haystack) >= 2) {
    const rest = inferred.filter((topic) => topic !== "overview" && topic !== "verification-strategy");
    const prioritized: Topic[] = ["verification-strategy", ...rest];
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
      "Proptest: structured inputs, invariants, and shrinking.",
      "Loom: small deterministic concurrent cores and schedule exploration.",
      "Kani: bounded proof harnesses for safety and correctness claims.",
      "Verification strategy: when to choose regression tests, proptest, fuzzing, loom, or Kani."
    ],
    depth
  );

  return [
    "## Rust Verification Map",
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
    skill: "rust-verification",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
