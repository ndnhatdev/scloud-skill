type Topic = "overview" | "tokio" | "serde" | "axum" | "sqlx" | "tracing";
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
  skill: "rust-ecosystem";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = ["overview", "tokio", "serde", "axum", "sqlx", "tracing"] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official crate documentation reviewed on 2026-03-19.",
  "Axum docs page reviewed showed axum 0.8.8.",
  "SQLx docs page reviewed showed sqlx 0.8.6.",
  "Guidance is intentionally biased toward official Tokio, Serde, Axum, SQLx, and Tracing documentation."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust backend", "ecosystem", "app stack", "service architecture", "web service"],
  tokio: ["tokio", "spawn", "spawn_blocking", "select", "channel", "channels", "shutdown", "cancellation", "runtime", "mpsc", "oneshot"],
  serde: ["serde", "serialize", "deserialize", "json", "yaml", "rename_all", "flatten", "untagged", "default", "skip_serializing_if"],
  axum: ["axum", "router", "extractor", "extractors", "state", "intoresponse", "handler", "middleware", "route", "with_state"],
  sqlx: ["sqlx", "database", "db", "query!", "query_as!", "migration", "migrations", "pool", "transaction", ".sqlx", "database_url"],
  tracing: ["tracing", "tracing-subscriber", "envfilter", "rust_log", "instrument", "span", "spans", "event", "subscriber", "layer"]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Ecosystem Map",
    summary:
      "Modern Rust backend work usually stabilizes when each crate owns a clear boundary: Tokio for runtime and coordination, Serde for wire shape, Axum for HTTP edges, SQLx for database access, and Tracing for observability.",
    rules: [
      "Keep language rules and compiler diagnostics in `rust-master`; keep crate-level architecture here.",
      "Push blocking or CPU-heavy work out of async hot paths.",
      "Treat payload shape, DB schema, HTTP boundary, and tracing fields as contracts, not implementation details.",
      "Prefer simple ownership and narrow boundaries before layering more middleware, wrappers, or macros.",
      "Review the interaction between crates, not just each crate in isolation."
    ],
    useWhen: [
      "You need a top-level map for a Rust web service stack.",
      "You need to decide which crate boundary owns a specific concern.",
      "You want a review checklist for a modern Rust backend."
    ],
    avoidWhen: [
      "You need core language, trait-system, lifetime, or compiler-error reasoning.",
      "You need ecosystem guidance for crates outside Tokio, Serde, Axum, SQLx, and Tracing."
    ],
    pitfalls: [
      "Letting HTTP, DB, and tracing details leak through every layer of the codebase.",
      "Using async or macros to hide architecture problems instead of fixing boundaries.",
      "Treating crate defaults as architecture decisions without checking the tradeoffs."
    ],
    practice: [
      "Trace one request through routing, state, DB, and tracing and mark each crate boundary.",
      "Audit one service and list where shutdown, DB pool lifecycle, and trace context are owned.",
      "Refactor one handler so HTTP extraction, business logic, and persistence are clearly separated."
    ],
    sources: [
      "https://tokio.rs/tokio/tutorial/channels",
      "https://docs.rs/axum/latest/axum/struct.Router.html",
      "https://docs.rs/sqlx/latest/sqlx/struct.Pool.html",
      "https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html"
    ],
    related: ["tokio", "axum", "sqlx", "tracing"]
  },
  tokio: {
    title: "Tokio Runtime and Coordination",
    summary:
      "Tokio design decisions usually come down to task ownership, blocking boundaries, shared-state contention, and how shutdown is coordinated.",
    rules: [
      "Use `tokio::spawn` for concurrent async work that is truly independent and `Send + 'static`.",
      "Use `spawn_blocking` for sync or CPU-heavy work that must not stall the executor.",
      "Prefer dedicated owner tasks plus channels for serialized resources such as clients or connections.",
      "Use `std::sync::Mutex` only for short, low-contention critical sections that end before `.await`.",
      "Use `tokio::sync::Mutex` only when the guard must live across `.await`.",
      "Plan graceful shutdown with cancellation plus waiting for tasks to finish."
    ],
    useWhen: [
      "You are designing async service orchestration, resource ownership, or shutdown.",
      "You are debugging non-`Send` tasks, runtime stalls, or channel-based coordination.",
      "You need to choose between shared state and message passing."
    ],
    avoidWhen: [
      "You are trying to hide CPU-heavy work inside ordinary async tasks.",
      "You are defaulting to async mutexes only because the code is async."
    ],
    pitfalls: [
      "Holding sync locks across `.await` and creating `!Send` futures.",
      "Using shared mutable state where a manager task and channels would be simpler.",
      "Spawning detached tasks without ownership, cancellation, or shutdown tracking."
    ],
    practice: [
      "Rewrite one shared client design into a dedicated owner task plus `mpsc` and `oneshot` channels.",
      "Take one blocking function in an async path and decide whether `spawn_blocking` or a different architecture is right.",
      "Draw a shutdown path that propagates cancellation and waits for work to finish."
    ],
    sources: [
      "https://tokio.rs/tokio/tutorial/spawning",
      "https://tokio.rs/tokio/tutorial/shared-state",
      "https://tokio.rs/tokio/tutorial/channels",
      "https://tokio.rs/tokio/topics/shutdown",
      "https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html",
      "https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html"
    ],
    related: ["axum", "sqlx", "tracing"]
  },
  serde: {
    title: "Serde Payload Modeling",
    summary:
      "Serde is best used as a precise wire-format tool: choose the payload shape first, then use derive attributes to match it with the least surprise.",
    rules: [
      "Prefer derive plus attributes before hand-written serializers or deserializers.",
      "Choose enum representation explicitly and document why it fits the API.",
      "Use `rename_all`, `rename`, `alias`, `default`, and `skip_serializing_if` as compatibility tools, not as camouflage for unclear contracts.",
      "Use `flatten` carefully; it changes payload boundaries and does not mix with `deny_unknown_fields`.",
      "Use dedicated wire types plus conversion when validation or compatibility logic gets dense."
    ],
    useWhen: [
      "You are modeling request or response bodies, config files, or event payloads.",
      "You are deciding between enum representations or compatibility attributes.",
      "You are reviewing a custom deserializer or conversion boundary."
    ],
    avoidWhen: [
      "You are cramming business validation into derive attributes that obscure the actual model.",
      "You are reaching for `untagged` without accepting weaker errors and extra parsing cost."
    ],
    pitfalls: [
      "Using `flatten` or defaults until the payload contract becomes impossible to reason about.",
      "Choosing `untagged` for convenience and getting poor diagnostics later.",
      "Letting internal Rust naming or layout dictate the public wire contract."
    ],
    practice: [
      "Compare externally tagged, internally tagged, adjacently tagged, and untagged enums for one API shape.",
      "Refactor one payload type into a dedicated wire type plus domain conversion.",
      "Audit one config or JSON type for unnecessary flattening or hidden defaults."
    ],
    sources: [
      "https://serde.rs/container-attrs.html",
      "https://serde.rs/field-attrs.html",
      "https://serde.rs/enum-representations.html",
      "https://serde.rs/custom-serialization.html"
    ],
    related: ["axum", "sqlx"]
  },
  axum: {
    title: "Axum HTTP Boundaries",
    summary:
      "Axum works best when handlers stay thin, state is explicit, extractors are ordered correctly, and HTTP-specific concerns stop at the boundary.",
    rules: [
      "Keep business logic outside handlers; handlers should mostly extract, call, and map results.",
      "Use one app state and derive substates with `FromRef` when modules need narrower access.",
      "Remember that body-consuming extractors must be last and the body cannot be consumed twice.",
      "Map domain errors into `IntoResponse` at the HTTP edge instead of leaking status codes through core services.",
      "Use layers or middleware for cross-cutting concerns like auth, timeouts, and request tracing."
    ],
    useWhen: [
      "You are designing handler signatures, router state, or response mapping.",
      "You are debugging extractor-order issues or nested-router state mismatches.",
      "You are reviewing whether HTTP concerns leak into business logic."
    ],
    avoidWhen: [
      "You are growing handlers into service objects with dozens of lines of orchestration and branching.",
      "You are using a router state type that exposes more than most handlers need."
    ],
    pitfalls: [
      "Putting body extractors before `State` or other non-body extractors.",
      "Combining routers with incompatible state assumptions.",
      "Holding shared mutable state across `.await` inside handlers and creating `!Send` futures."
    ],
    practice: [
      "Refactor one fat handler so extraction, service call, and response mapping are separate steps.",
      "Split one large app state into substates using `FromRef`.",
      "Audit one router tree and mark where middleware versus handler logic belongs."
    ],
    sources: [
      "https://docs.rs/axum/latest/axum/struct.Router.html",
      "https://docs.rs/axum/latest/axum/extract/index.html",
      "https://docs.rs/axum/latest/axum/extract/struct.State.html",
      "https://docs.rs/axum/latest/axum/response/trait.IntoResponse.html"
    ],
    related: ["tokio", "serde", "tracing", "sqlx"]
  },
  sqlx: {
    title: "SQLx Database Access",
    summary:
      "SQLx design quality mostly shows up in pool lifecycle, transaction scope, schema discipline, and whether query typing is enforced where it matters.",
    rules: [
      "Create one long-lived pool and share cheap clones rather than creating pools per request.",
      "Prefer `query!` or `query_as!` for static queries that benefit from compile-time checking.",
      "Keep transactions short and focused on one invariant boundary.",
      "Treat nullability as a Rust type choice, not a surprise to patch later.",
      "Keep migrations in version control and align tests, schema, and build-time SQL checking.",
      "Plan for `DATABASE_URL` or `.sqlx` offline data in build and CI."
    ],
    useWhen: [
      "You are designing repository boundaries, DB initialization, or migration workflow.",
      "You are debugging SQLx macro requirements or transaction shape.",
      "You are reviewing whether pool and query usage will scale under load."
    ],
    avoidWhen: [
      "You are treating a single connection in a mutex as an acceptable server architecture.",
      "You are writing wide transactions because the function is wide, not because the invariant is."
    ],
    pitfalls: [
      "Pool-per-request or drop-heavy pool lifecycle.",
      "Dynamic SQL everywhere, losing compile-time checking without a strong reason.",
      "Ignoring `NULL` semantics and then fighting `Option<T>` mismatches."
    ],
    practice: [
      "Take one repository method and decide whether `query!`, `query_as!`, or dynamic SQL is justified.",
      "Trace one shutdown path and make sure the pool is closed intentionally.",
      "Audit one migration flow and confirm CI can check queries without manual local setup."
    ],
    sources: [
      "https://docs.rs/sqlx/latest/sqlx/struct.Pool.html",
      "https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html",
      "https://docs.rs/sqlx/latest/sqlx/macro.query.html",
      "https://docs.rs/sqlx/latest/sqlx/macro.query_as.html",
      "https://docs.rs/sqlx/latest/sqlx/migrate/index.html"
    ],
    related: ["tokio", "axum", "serde"]
  },
  tracing: {
    title: "Tracing and Observability",
    summary:
      "Tracing pays off when spans and fields describe request and operation context cleanly, filters stay configurable, and instrumentation avoids noisy or sensitive payloads.",
    rules: [
      "Initialize one root subscriber early and make filtering configurable with `EnvFilter` or an equivalent strategy.",
      "Use spans for work with duration and events for point-in-time facts.",
      "Prefer structured fields to interpolated log strings.",
      "Use `#[instrument]` on request, job, and repository boundaries, but skip large, high-cardinality, or secret fields.",
      "Compose formatting, filtering, and export concerns through layers instead of one giant subscriber setup."
    ],
    useWhen: [
      "You are instrumenting a service for debugging or operations.",
      "You are deciding what fields belong on request or task spans.",
      "You are reviewing subscriber setup, filtering, or logging volume."
    ],
    avoidWhen: [
      "You are emitting giant debug dumps into every span by default.",
      "You are using tracing as a replacement for metrics or structured domain state."
    ],
    pitfalls: [
      "Recording sensitive or high-cardinality fields and making logs noisy or risky.",
      "Using `#[instrument]` everywhere without deciding what data matters.",
      "Treating filtering as an afterthought instead of an operational interface."
    ],
    practice: [
      "Instrument one request path with a request span and a few stable correlation fields.",
      "Review one `#[instrument]` use and decide what should be skipped or added as explicit fields.",
      "Compose two layers with different filters and explain why they are separate."
    ],
    sources: [
      "https://docs.rs/tracing/latest/tracing/attr.instrument.html",
      "https://docs.rs/tracing/latest/tracing/struct.Span.html",
      "https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html",
      "https://docs.rs/tracing-subscriber/latest/tracing_subscriber/layer/index.html",
      "https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/index.html"
    ],
    related: ["tokio", "axum", "sqlx"]
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
  if (inferred.length > 0) {
    return inferred.slice(0, 2);
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
      "Tokio: tasks, channels, shutdown, and blocking boundaries.",
      "Serde: wire shape, derive attributes, enum representation, compatibility.",
      "Axum: routers, extractors, state, HTTP boundary mapping.",
      "SQLx: pools, checked queries, transactions, migrations.",
      "Tracing: spans, fields, filters, layered subscribers."
    ],
    depth
  );

  return [
    "## Rust Ecosystem Map",
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
    skill: "rust-ecosystem",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
