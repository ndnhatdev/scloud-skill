type Topic =
  | "overview"
  | "ownership"
  | "lifetimes"
  | "smart-pointers"
  | "traits"
  | "advanced-type-system"
  | "error-handling"
  | "async-vs-threads"
  | "concurrency"
  | "diagnostics"
  | "macros"
  | "systems-interop"
  | "cargo"
  | "testing"
  | "unsafe"
  | "api-design"
  | "syntax-idioms"
  | "performance"
  | "tooling-validation"
  | "community-lessons";

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
  skill: "rust-master";
  checked_on: "2026-03-19";
  selected_topics: Topic[];
  goal: Goal;
  depth: Depth;
  report: string;
  sources: string[];
};

const TOPIC_ORDER = [
  "overview",
  "ownership",
  "lifetimes",
  "smart-pointers",
  "traits",
  "advanced-type-system",
  "error-handling",
  "async-vs-threads",
  "concurrency",
  "diagnostics",
  "macros",
  "systems-interop",
  "syntax-idioms",
  "performance",
  "tooling-validation",
  "community-lessons",
  "cargo",
  "testing",
  "unsafe",
  "api-design"
] as const satisfies readonly Topic[];

const RESEARCH_BASELINE = [
  "Official docs checked on 2026-03-19.",
  "Rust 2024 edition page lists release version 1.85.0.",
  "Stable std pages reviewed for this skill showed std 1.94.0 with build date 2026-03-02.",
  "Guidance is intentionally biased toward official Rust sources and Rust project guidance.",
  "Community heuristics were cross-checked against current Tokio docs and Rust forum discussions reviewed on 2026-03-19."
] as const;

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  overview: ["rust", "overview", "roadmap", "study", "learn rust"],
  ownership: ["ownership", "borrow", "borrow checker", "move", "clone", "&str", "slice", "reference"],
  lifetimes: ["lifetime", "lifetimes", "'a", "borrowed output", "elision", "self-referential"],
  "smart-pointers": ["box", "rc", "arc", "weak", "cell", "refcell", "mutex", "rwlock", "oncelock", "oncecell"],
  traits: ["trait", "generic", "impl trait", "dyn trait", "object safe", "object-safe", "orphan", "coherence"],
  "advanced-type-system": ["associated type", "associated types", "gat", "gats", "generic associated type", "hrtb", "higher ranked", "for<'a>", "const generic", "const generics"],
  "error-handling": ["result", "option", "panic", "error", "unwrap", "expect", "recoverable"],
  "async-vs-threads": ["async", "await", "tokio", "future", "futures", "thread", "threads", "i/o", "io", "cpu-bound", "spawn_blocking"],
  concurrency: ["send", "sync", "channel", "mutex", "rwlock", "arc", "atomic", "race", "shared state"],
  diagnostics: ["compiler error", "diagnostic", "error code", "rustc explain", "cargo check", "borrow checker", "e0277", "e0308", "e0382", "e0499", "e0502", "e0507", "e0597", "e0599", "type mismatch", "type annotation"],
  macros: ["macro", "macros", "macro_rules", "proc macro", "proc-macro", "derive macro", "attribute macro", "tokenstream", "compile_error", "cargo expand"],
  "systems-interop": ["pin", "unpin", "pinned", "future::poll", "poll", "ffi", "extern c", "cstr", "cstring", "repr(c)", "repr(transparent)", "repr(packed)", "no_std", "embedded", "abi", "layout"],
  "syntax-idioms": ["idiom", "idiomatic", "syntax", "pattern", "patterns", "iterator", "iterators", "entry", "collect", "match", "if let", "let else", "newtype"],
  performance: ["performance", "optimize", "profiling", "profile", "benchmark", "criterion", "allocation", "binary size", "bloat", "build timings", "compile time", "latency", "throughput"],
  "tooling-validation": ["clippy", "rustfmt", "cargo fmt", "cargo fix", "rust-analyzer", "miri", "nextest", "coverage", "llvm-cov", "udeps", "deny", "semver", "msrv", "cargo expand", "cargo hack"],
  "community-lessons": ["community", "forum", "best practice", "anti-pattern", "senior", "real world", "practical", "heuristic", "classic mistake"],
  cargo: ["cargo", "feature", "features", "workspace", "workspaces", "module", "mod", "lib.rs", "main.rs", "crate"],
  testing: ["test", "tests", "integration test", "unit test", "cfg(test)", "doc test", "cargo test"],
  unsafe: ["unsafe", "ffi", "raw pointer", "ub", "soundness", "unsafe_op_in_unsafe_fn"],
  "api-design": ["api", "library", "crate design", "public api", "builder", "asref", "deref"]
};

const TOPICS: Record<Topic, TopicCard> = {
  overview: {
    title: "Rust Master Map",
    summary:
      "Rust becomes predictable once you classify every problem in four layers: ownership model, representation choice, polymorphism boundary, and concurrency or runtime model.",
    rules: [
      "Model ownership before choosing data structures or concurrency primitives.",
      "Choose the smallest correct abstraction first: borrowed value, owned value, smart pointer, interior mutability, then unsafe.",
      "Prefer compile-time guarantees to runtime checks whenever the design can express them.",
      "Treat `clone()`, `RefCell<T>`, and `unsafe` as deliberate tradeoffs, not default fixes.",
      "When performance matters, classify the workload first: allocation-heavy, CPU-bound, latency-bound, or fan-out I/O-bound."
    ],
    useWhen: [
      "You need a top-level roadmap for studying or reviewing Rust code.",
      "You need a decision tree before selecting specific Rust features.",
      "You want a compact set of rules to guide design discussions."
    ],
    avoidWhen: [
      "You already know the exact subtopic and need a deeper focused answer.",
      "You need crate-specific ecosystem advice rather than language and standard-library guidance."
    ],
    pitfalls: [
      "Jumping straight to concurrency or async before modeling data ownership.",
      "Mixing single-thread and multi-thread tools in the same mental model.",
      "Treating compiler errors as obstacles instead of design feedback."
    ],
    practice: [
      "Read a function signature and classify which values are owned, borrowed, and shared.",
      "Rewrite one API from owned inputs to borrowed inputs and compare ergonomics.",
      "Trace one real bug to the layer where the design was wrong: ownership, representation, polymorphism, or runtime."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html",
      "https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html",
      "https://rust-lang.github.io/api-guidelines/checklist.html",
      "https://nnethercote.github.io/perf-book/introduction.html"
    ],
    related: ["ownership", "smart-pointers", "traits", "advanced-type-system", "concurrency", "diagnostics", "macros", "systems-interop", "syntax-idioms", "performance", "tooling-validation"]
  },
  ownership: {
    title: "Ownership and Borrowing",
    summary:
      "Ownership is the default memory and aliasing model. Borrowing is the normal way to share access without transferring ownership.",
    rules: [
      "Each value has one owner; moving a non-`Copy` value transfers that ownership.",
      "Use `&T` for shared reads and `&mut T` for exclusive mutation.",
      "Prefer borrowed inputs like `&str` or `&[T]` when the callee does not need to keep the data.",
      "Use `clone()` only when you truly need another owned copy and the cost is acceptable.",
      "Prefer slices and iterators to manual index-based borrowing."
    ],
    useWhen: [
      "You are deciding between owned and borrowed parameters.",
      "You are reading compiler errors about moves, borrows, or invalid references.",
      "You want APIs that avoid unnecessary allocation and copying."
    ],
    avoidWhen: [
      "You need shared ownership across threads; use `Arc<T>`-based designs instead.",
      "You only need a cheap copy of a `Copy` type and no ownership redesign is necessary."
    ],
    pitfalls: [
      "Adding `clone()` to silence E0382 without understanding the data flow.",
      "Returning references to temporary or local data.",
      "Combining mutable and immutable borrows in the same active scope."
    ],
    practice: [
      "Rewrite a `fn foo(s: String)` API into `fn foo(s: &str)` when storage is not required.",
      "Take a borrow-checker error and explain which owner is active at each line.",
      "Replace index-based substring code with slice-based code."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html",
      "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"
    ],
    related: ["lifetimes", "smart-pointers", "error-handling"]
  },
  lifetimes: {
    title: "Lifetimes",
    summary:
      "Lifetimes describe relationships between borrows. They do not extend how long values live.",
    rules: [
      "Use explicit lifetimes when the relationship between input and output borrows is not obvious.",
      "Rely on elision when signatures are simple and unambiguous.",
      "If the signature becomes hard to reason about, consider returning owned data instead.",
      "Prefer owned fields in long-lived structs unless zero-copy storage is a measured requirement.",
      "Avoid self-referential layouts unless you are deliberately working with pinning or advanced unsafe abstractions."
    ],
    useWhen: [
      "A function returns data borrowed from one or more inputs.",
      "You are designing parsers, views, or zero-copy structures.",
      "You are deciding whether to store references or owned values in a type."
    ],
    avoidWhen: [
      "A simple owned return type removes complexity at little cost.",
      "You only need temporary local borrows inside a function body."
    ],
    pitfalls: [
      "Believing lifetime annotations make values live longer.",
      "Trying to store references in application state where ownership is simpler.",
      "Forcing borrowed output when allocation would make the API clearer."
    ],
    practice: [
      "Explain why `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str` works and what it does not promise.",
      "Refactor one borrowed-field struct into an owned struct and compare ergonomics.",
      "Add explicit lifetime annotations to a failing signature, then remove them where elision is enough."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html"
    ],
    related: ["ownership", "async-vs-threads", "unsafe"]
  },
  "smart-pointers": {
    title: "Smart Pointers and Interior Mutability",
    summary:
      "Choose smart pointers by answering two questions: who owns the value, and where does mutation happen?",
    rules: [
      "Use `Box<T>` for heap indirection, recursive types, or owned trait objects.",
      "Use `Rc<T>` for shared ownership in single-threaded code only.",
      "Use `Arc<T>` for shared ownership across threads or async tasks; add synchronization only when mutation is needed.",
      "Prefer `Cell<T>` over `RefCell<T>` for simple value replacement of small types.",
      "Use `RefCell<T>` only for single-threaded runtime borrow checking.",
      "Use `Mutex<T>` for cross-thread exclusive mutation and `RwLock<T>` when reads dominate."
    ],
    useWhen: [
      "You need heap indirection or recursive layout.",
      "You need shared ownership within a graph, cache, or async service state.",
      "You need interior mutability and must choose the smallest correct tool."
    ],
    avoidWhen: [
      "A plain owned struct with ordinary borrowing already works.",
      "You are reaching for `Arc<Mutex<T>>` before proving shared mutable state is necessary."
    ],
    pitfalls: [
      "Using `Rc<T>` across threads or expecting `Arc<T>` alone to make inner data thread-safe.",
      "Holding a mutex or rwlock guard across `.await`.",
      "Creating strong-reference cycles instead of breaking them with `Weak<T>`."
    ],
    practice: [
      "Classify `Box<T>`, `Rc<T>`, `Arc<T>`, `Cell<T>`, `RefCell<T>`, `Mutex<T>`, and `RwLock<T>` by ownership and mutation model.",
      "Replace an overbuilt `Arc<Mutex<T>>` design with ownership transfer or message passing where possible.",
      "Draw a graph structure and mark where `Weak<T>` should break cycles."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch15-01-box.html",
      "https://doc.rust-lang.org/book/ch15-04-rc.html",
      "https://doc.rust-lang.org/book/ch15-05-interior-mutability.html",
      "https://doc.rust-lang.org/std/sync/struct.Arc.html",
      "https://doc.rust-lang.org/std/sync/struct.Mutex.html",
      "https://doc.rust-lang.org/std/sync/struct.RwLock.html",
      "https://doc.rust-lang.org/stable/std/cell/index.html"
    ],
    related: ["ownership", "concurrency", "traits"]
  },
  traits: {
    title: "Traits, Generics, impl Trait, and dyn Trait",
    summary:
      "Pick static dispatch by default. Use `dyn Trait` when you need heterogeneity or runtime-selected behavior.",
    rules: [
      "Use `T: Trait` or argument-position `impl Trait` for static dispatch and monomorphized code.",
      "Use return-position `impl Trait` to hide one concrete return type without boxing.",
      "Remember that every return branch of `-> impl Trait` must resolve to the same concrete type.",
      "Use `dyn Trait` for heterogeneous collections, runtime plugin boundaries, or when the caller should not know the concrete type set.",
      "If a trait may be used as a trait object, keep it dyn-compatible and avoid `Self`-typed returns unless guarded by `where Self: Sized`.",
      "Respect coherence and orphan rules when planning trait impls across crates."
    ],
    useWhen: [
      "You are designing trait-based APIs or comparing static and dynamic dispatch.",
      "You need to hide a complex iterator or closure return type.",
      "You are debugging object-safety or overlapping-impl issues."
    ],
    avoidWhen: [
      "A closed set of variants is better expressed as an enum.",
      "Dynamic dispatch adds flexibility you do not actually need."
    ],
    pitfalls: [
      "Using `dyn Trait` in hot paths without needing runtime polymorphism.",
      "Changing a public function parameter between generic form and argument `impl Trait` without considering call-site breakage.",
      "Assuming foreign-trait-on-foreign-type impls are allowed."
    ],
    practice: [
      "Rewrite one `Box<dyn Iterator<Item = T>>` return into `impl Iterator<Item = T>` and note the tradeoff.",
      "Take a trait and identify whether it is object-safe and why.",
      "Explain the orphan rule using a real two-crate example."
    ],
    sources: [
      "https://doc.rust-lang.org/reference/types/impl-trait.html",
      "https://doc.rust-lang.org/reference/items/implementations.html",
      "https://doc.rust-lang.org/book/ch18-02-trait-objects.html"
    ],
    related: ["smart-pointers", "advanced-type-system", "api-design", "cargo"]
  },
  "error-handling": {
    title: "Error Handling",
    summary:
      "Use the narrowest failure channel that matches reality: `Option` for absence, `Result` for recoverable failure, `panic!` for broken invariants.",
    rules: [
      "Use `Option<T>` when no value is a normal and expected outcome.",
      "Use `Result<T, E>` as the default boundary for recoverable failure.",
      "Reserve `panic!` for broken invariants, impossible states, tests, or examples.",
      "Use `?` to propagate errors and `From` conversions to simplify glue code.",
      "Prefer `expect()` with a clear invariant message over bare `unwrap()` when panic is intentional."
    ],
    useWhen: [
      "You are designing library or application error boundaries.",
      "You are deciding whether an API should recover or terminate.",
      "You need to replace verbose `match` nesting with clearer propagation."
    ],
    avoidWhen: [
      "You are tempted to use panic for ordinary invalid user input in a library API.",
      "You want to encode absence with magic values instead of types."
    ],
    pitfalls: [
      "Using `unwrap()` in production paths where failure is expected.",
      "Returning vague string errors where typed errors would preserve context.",
      "Collapsing distinct failure modes into `Option` when the caller needs diagnostics."
    ],
    practice: [
      "Convert one panic-based file-loading path into `Result<T, E>` propagation.",
      "Replace nested `match` code with `?` and small helper conversions.",
      "Audit one crate boundary and list which panics are true invariants versus bad API design."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html",
      "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html"
    ],
    related: ["api-design", "testing", "unsafe"]
  },
  "async-vs-threads": {
    title: "Async vs Threads",
    summary:
      "Async is for high-concurrency waiting. Threads are for CPU-bound parallel work and simpler blocking execution. Real systems often mix both.",
    rules: [
      "Use async for I/O-bound work with many waiting tasks.",
      "Use threads for CPU-bound parallelism or blocking operations that should not stall an executor.",
      "Combine async orchestration with worker threads or `spawn_blocking` style execution for heavy CPU work.",
      "Treat tasks as runtime-managed concurrency units and threads as OS-managed concurrency units.",
      "Classify the workload before choosing the runtime model."
    ],
    useWhen: [
      "You are choosing between a threaded design and an async runtime.",
      "You are debugging executor stalls, blocking calls, or too many threads.",
      "You are explaining why async and threads are complementary, not mutually exclusive."
    ],
    avoidWhen: [
      "You want a single hammer for both CPU-heavy and I/O-heavy workloads.",
      "You are keeping blocking code on the async executor without measurement."
    ],
    pitfalls: [
      "Calling blocking code directly on the async runtime.",
      "Using async for CPU-heavy work that would be simpler and faster on threads.",
      "Forgetting that async improves concurrency, not automatic parallel speedup."
    ],
    practice: [
      "Take a service and separate its I/O-bound and CPU-bound paths.",
      "Explain why a high-fan-out socket server tends to benefit from async.",
      "Explain why a video-encoding pipeline often needs worker threads even inside an async application."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch17-06-futures-tasks-threads.html",
      "https://doc.rust-lang.org/book/ch17-00-async-await.html"
    ],
    related: ["concurrency", "ownership", "lifetimes"]
  },
  concurrency: {
    title: "Concurrency and Shared State",
    summary:
      "Concurrency decisions in Rust mostly reduce to `Send`, `Sync`, ownership transfer, and the minimum synchronization primitive that preserves invariants.",
    rules: [
      "Use `Send` to reason about ownership moving across threads.",
      "Use `Sync` to reason about shared references across threads.",
      "Remember that `Rc<T>` and `RefCell<T>` are single-thread tools.",
      "Use `Arc<T>` for shared ownership, then layer `Mutex<T>`, `RwLock<T>`, or atomics only if mutation is necessary.",
      "Prefer ownership transfer or channels before shared mutable state when the problem allows it.",
      "Keep lock scopes short and encode invariants in the protected type, not in comments alone."
    ],
    useWhen: [
      "You are choosing between channels and shared state.",
      "You need to interpret `Send` or `Sync` compiler errors.",
      "You are selecting between `Mutex<T>`, `RwLock<T>`, and atomics."
    ],
    avoidWhen: [
      "You are forcing shared mutable state when message passing would simplify the model.",
      "You are using `RwLock<T>` without evidence that read-heavy contention is the problem."
    ],
    pitfalls: [
      "Expecting `Arc<T>` to make `RefCell<T>` thread-safe.",
      "Ignoring poisoning or lock-ordering issues.",
      "Choosing `RwLock<T>` without thinking about fairness or writer starvation."
    ],
    practice: [
      "Take one shared-state design and redraw it as ownership transfer through channels.",
      "Explain why `Rc<T>` is rejected across threads but `Arc<T>` compiles.",
      "List the invariant protected by each mutex in a real service."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html",
      "https://doc.rust-lang.org/std/sync/struct.Arc.html",
      "https://doc.rust-lang.org/std/sync/struct.Mutex.html",
      "https://doc.rust-lang.org/std/sync/struct.RwLock.html",
      "https://doc.rust-lang.org/stable/std/cell/index.html"
    ],
    related: ["async-vs-threads", "smart-pointers", "unsafe"]
  },
  diagnostics: {
    title: "Compiler Diagnostics and Type Errors",
    summary:
      "Senior Rust debugging starts by classifying compiler errors into families: ownership, lifetime, type mismatch, trait-bound, dyn compatibility, coherence, or `Send`/`Sync` constraints.",
    rules: [
      "Use `cargo check` for the fastest compile-error feedback loop, but remember some diagnostics only appear during code generation.",
      "Read the first hard error before touching cascaded follow-up errors.",
      "Capture the error code and use `rustc --explain CODE` when the message family is not obvious.",
      "Fix the boundary that is wrong: signature, ownership model, trait bound, or concurrency capture, not just the final symptom line.",
      "Treat compiler suggestions as candidate local repairs, not proof that `clone()`, boxing, or annotation is the right architectural fix."
    ],
    useWhen: [
      "You are debugging borrow-checker, type-system, trait-bound, or async `Send` errors.",
      "You need a repeatable workflow for reading Rust compiler diagnostics.",
      "You are reviewing a patch that silences compile errors in suspicious ways."
    ],
    avoidWhen: [
      "You are dealing with a runtime bug after the code already compiles cleanly.",
      "You want crate-specific semantics rather than compiler-diagnostic reasoning."
    ],
    pitfalls: [
      "Fixing the last error in a cascade instead of the first real cause.",
      "Adding clones, boxes, or explicit lifetimes everywhere without identifying the failing boundary.",
      "Ignoring method receiver type, trait imports, or captured future state when debugging `E0599` or non-`Send` futures."
    ],
    practice: [
      "Take one `E0308` mismatch and write down the expected and actual concrete types at the failing boundary.",
      "Take one borrow-checker error and redraw the scopes of immutable and mutable access.",
      "Use `rustc --explain` on one trait-bound or dyn-compatibility error and connect it back to the API design."
    ],
    sources: [
      "https://doc.rust-lang.org/error_codes/error-index.html",
      "https://doc.rust-lang.org/rustc/command-line-arguments.html#--explain-opt-code",
      "https://doc.rust-lang.org/cargo/commands/cargo-check.html",
      "https://doc.rust-lang.org/reference/trait-bounds.html",
      "https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility",
      "https://doc.rust-lang.org/rustc/json.html#diagnostics"
    ],
    related: ["ownership", "lifetimes", "traits", "advanced-type-system", "concurrency", "macros", "systems-interop", "tooling-validation"]
  },
  "syntax-idioms": {
    title: "Rust Syntax and Idioms",
    summary:
      "Idiomatic Rust is mostly about making ownership, control flow, and collection transforms obvious without hiding the cost model.",
    rules: [
      "Prefer signatures that make ownership obvious: borrowed inputs for read-only use, owned inputs for storage or transfer.",
      "Use `match`, `if let`, `while let`, and `let-else` to make state transitions and failure exits explicit.",
      "Prefer iterators when they directly express the transformation; prefer `for` loops when state or early exits are clearer.",
      "Use `HashMap::entry` and similar collection APIs instead of manual contains-plus-insert logic.",
      "Prefer enums, newtypes, and builders over bool flags or ambiguous strings in APIs.",
      "Do not force borrowed returns or iterator-heavy APIs when an owned `Vec<T>` or value type is clearer."
    ],
    useWhen: [
      "You are refactoring code that compiles but feels unidiomatic or overly verbose.",
      "You are deciding between loops and iterators, `match` and nested `if`, or raw values versus stronger domain types.",
      "You want review guidance on signatures, control flow, and collection usage."
    ],
    avoidWhen: [
      "You are optimizing for a measured hot path where a plainer imperative loop is both faster and clearer.",
      "You are adding abstraction only to look clever rather than to clarify ownership or behavior."
    ],
    pitfalls: [
      "Chaining combinators until the control flow is harder to reason about than a loop.",
      "Using generic conversion bounds everywhere and making call sites or errors worse.",
      "Returning borrowed or iterator-based outputs that leak temporary internals or lifetime complexity."
    ],
    practice: [
      "Refactor one `contains_key` plus `insert` branch into an `entry`-based update.",
      "Rewrite one nested `match` or `if` ladder using `let-else` or early returns.",
      "Take one API with a bool flag and redesign it using an enum or builder."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch06-02-match.html",
      "https://doc.rust-lang.org/book/ch13-02-iterators.html",
      "https://doc.rust-lang.org/std/iter/trait.Iterator.html",
      "https://doc.rust-lang.org/std/collections/hash_map/enum.Entry.html",
      "https://doc.rust-lang.org/std/borrow/enum.Cow.html"
    ],
    related: ["ownership", "traits", "api-design", "performance"]
  },
  performance: {
    title: "Performance and Profiling",
    summary:
      "Senior Rust performance work starts with measurement, workload classification, and algorithm or data-layout changes before micro-optimizing syntax.",
    rules: [
      "Measure in release mode before changing code for speed.",
      "Profile before optimizing; intuition is unreliable for hot spots.",
      "Look for algorithm, data-structure, allocation, and repeated-work wins before low-level tuning.",
      "Treat macro expansion, monomorphization, and feature sprawl as compile-time and binary-size costs.",
      "Optimize hot paths deliberately and keep cold-path code simple."
    ],
    useWhen: [
      "You are diagnosing slow code, large binaries, or long compile times.",
      "You need a rubric for deciding whether an optimization is real or speculative.",
      "You are reviewing a performance PR and need concrete red flags."
    ],
    avoidWhen: [
      "You are trying to optimize debug builds or benchmark with ad-hoc wall-clock prints.",
      "You are rewriting clear code without evidence that the path matters."
    ],
    pitfalls: [
      "Claiming iterator, async, or allocation costs are the bottleneck without profiling.",
      "Trading a tiny runtime win for large API, compile-time, or safety complexity.",
      "Using macro-heavy or generic-heavy designs that explode compile times or binary size."
    ],
    practice: [
      "Take one hot path and classify whether the bottleneck is CPU, allocation, I/O wait, or contention.",
      "Run a benchmark in release mode and compare an algorithmic change before any micro-optimization.",
      "Inspect one build for macro or monomorphization bloat before changing public APIs."
    ],
    sources: [
      "https://nnethercote.github.io/perf-book/introduction.html",
      "https://nnethercote.github.io/perf-book/general-tips.html",
      "https://nnethercote.github.io/perf-book/compile-times.html",
      "https://docs.rs/crate/criterion/latest",
      "https://github.com/RazrFalcon/cargo-bloat"
    ],
    related: ["tooling-validation", "syntax-idioms", "cargo", "async-vs-threads"]
  },
  "tooling-validation": {
    title: "Tooling and Validation",
    summary:
      "Rust code quality scales when validation moves from intuition to repeatable tool checks: linting, UB detection, feature-matrix checks, dependency hygiene, coverage, and release compatibility.",
    rules: [
      "Run `cargo fmt` and `cargo clippy` by default; tighten CI lints selectively and intentionally.",
      "Use `cargo fix` for machine-applicable compiler and edition migrations, then review the diff.",
      "Use `cargo expand` for macro debugging, `cargo miri test` for unsafe and aliasing risks, and `criterion` for benchmark evidence.",
      "Use `cargo nextest run`, `cargo llvm-cov`, `cargo deny`, `cargo udeps`, and `cargo hack` to harden large-project CI.",
      "Use `cargo msrv` and `cargo semver-checks` when maintaining a published library or compatibility promise."
    ],
    useWhen: [
      "You need to standardize Rust validation beyond `cargo test`.",
      "You are designing CI for a library, workspace, or safety-sensitive crate.",
      "You are debugging macro expansion, UB, flaky tests, or dependency graph issues."
    ],
    avoidWhen: [
      "You are adding every tool to a tiny crate with no release or maintenance surface.",
      "You are treating tool output as a substitute for design review."
    ],
    pitfalls: [
      "Relying on `cargo test` alone for unsafe or feature-rich crates.",
      "Turning on broad lint groups without a policy and drowning the team in low-value noise.",
      "Skipping semver, MSRV, or dependency-policy checks on published crates."
    ],
    practice: [
      "Write a minimal CI matrix that runs `fmt`, `clippy`, tests, and one deeper check relevant to the crate's risk.",
      "Use `cargo expand` on one macro-heavy function and explain the generated shape.",
      "Run Miri on one unsafe or pointer-heavy test and record what class of bug it can and cannot prove absent."
    ],
    sources: [
      "https://doc.rust-lang.org/book/appendix-04-useful-development-tools.html",
      "https://doc.rust-lang.org/cargo/commands/cargo-fix.html",
      "https://rust-lang.github.io/rust-clippy/stable/index.html",
      "https://github.com/rust-lang/miri",
      "https://nexte.st/",
      "https://github.com/dtolnay/cargo-expand",
      "https://github.com/taiki-e/cargo-llvm-cov",
      "https://github.com/EmbarkStudios/cargo-deny",
      "https://github.com/est31/cargo-udeps",
      "https://github.com/taiki-e/cargo-hack",
      "https://github.com/foresterre/cargo-msrv",
      "https://github.com/obi1kenobi/cargo-semver-checks"
    ],
    related: ["performance", "testing", "cargo", "unsafe", "macros"]
  },
  "community-lessons": {
    title: "Community Lessons and Senior Heuristics",
    summary:
      "The classic Rust lessons are usually about paying complexity only where it earns something real: do not fight ownership for aesthetics, do not over-shared-state async code, and do not optimize without evidence.",
    rules: [
      "Treat `clone()` as a costed tool, not a moral failure: harmless at ownership boundaries, suspicious in hot loops.",
      "If borrow checking gets ugly, redesign scope or ownership before adding `RefCell<T>` or long lifetime plumbing.",
      "Prefer message passing or dedicated owner tasks before defaulting to `Arc<Mutex<T>>` in async services.",
      "Use async mutexes only when the guard must live across `.await`; otherwise a sync mutex is often better even inside async code.",
      "Prefer enums for closed behavior sets and owned returns when iterator or borrow-heavy APIs stop being ergonomic."
    ],
    useWhen: [
      "You want pragmatic guidance on what experienced Rust engineers usually choose.",
      "You are reviewing code that technically works but feels over-engineered or fragile.",
      "You need anti-pattern radar drawn from repeated forum problems."
    ],
    avoidWhen: [
      "You need a formal language guarantee; use official docs for that.",
      "You are cargo-culting a forum heuristic into a different workload or architecture."
    ],
    pitfalls: [
      "Treating zero-copy as a goal when an owned boundary would simplify the whole design.",
      "Replacing simple ownership transfer with shared mutable state too early.",
      "Assuming `RwLock<T>` or async mutexes are faster without contention evidence."
    ],
    practice: [
      "Take one `Arc<Mutex<T>>` design and ask whether a dedicated worker task plus channel would simplify it.",
      "Review one API that returns borrowed views and ask whether an owned return would reduce lifetime surface.",
      "Label each clone in a real diff as boundary clone, convenience clone, or hot-path clone."
    ],
    sources: [
      "https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html",
      "https://users.rust-lang.org/t/std-mutex-vs-futures-mutex-vs-futures-lock-mutex-for-async/41710",
      "https://users.rust-lang.org/t/what-makes-async-mutex-more-expensive-than-sync-mutex/100806",
      "https://users.rust-lang.org/t/which-mutex-to-use-parking-lot-or-std-sync/85060",
      "https://users.rust-lang.org/t/solved-should-i-clone-to-avoid-borrow-check/23815",
      "https://users.rust-lang.org/t/why-use-clone/116632",
      "https://users.rust-lang.org/t/implementing-iterator-for-vec/71398",
      "https://users.rust-lang.org/t/return-an-iterator-from-struct-in-refcell/86580",
      "https://users.rust-lang.org/t/returning-an-iterator/24402",
      "https://users.rust-lang.org/t/performance-difference-between-iterator-and-for-loop/50254"
    ],
    related: ["syntax-idioms", "performance", "concurrency", "smart-pointers"]
  },
  "advanced-type-system": {
    title: "Advanced Type System",
    summary:
      "Associated types, GATs, HRTBs, and const generics are the right tools only when they encode a real invariant that simpler APIs cannot express cleanly.",
    rules: [
      "Prefer associated types when each implementation should choose one logical output type once.",
      "Use GATs when an associated type family must depend on a lifetime, type, or const parameter.",
      "Use `for<'a>` bounds when a callback or trait bound must work for any borrow lifetime, not one captured lifetime.",
      "Use const generics when a value is part of the type-level contract rather than ordinary runtime data.",
      "If the API becomes hard to explain, test whether owned values or simpler generic shapes would be clearer."
    ],
    useWhen: [
      "You are designing lending APIs, generic libraries, or type-level invariants.",
      "You are deciding between associated types and generic parameters.",
      "You are debugging advanced bound syntax such as GATs, HRTBs, or const generics."
    ],
    avoidWhen: [
      "A simpler owned API or ordinary generic parameter already expresses the need.",
      "You are adding advanced type features only for elegance rather than a concrete invariant."
    ],
    pitfalls: [
      "Using GATs where an owned iterator or value-returning API would be easier to use.",
      "Adding HRTBs without being able to explain why the bound must hold for any lifetime.",
      "Making public const-generic APIs harder to infer than the benefit justifies."
    ],
    practice: [
      "Compare an associated-type trait and a generic-parameter trait for the same abstraction.",
      "Refactor one borrowing iterator-style API and decide whether a GAT truly improves it.",
      "Take one fixed-size buffer API and justify whether a const generic belongs in the type."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch20-02-advanced-traits.html",
      "https://doc.rust-lang.org/reference/items/associated-items.html",
      "https://doc.rust-lang.org/reference/trait-bounds.html",
      "https://doc.rust-lang.org/reference/items/generics.html",
      "https://doc.rust-lang.org/nomicon/hrtb.html"
    ],
    related: ["traits", "diagnostics", "api-design", "lifetimes"]
  },
  macros: {
    title: "Macros and Metaprogramming",
    summary:
      "Rust macros should reduce syntax duplication or generate code ordinary Rust cannot express, without turning the expansion into an unreadable second language.",
    rules: [
      "Prefer functions, traits, and generics before reaching for macros.",
      "Use `macro_rules!` for local syntactic repetition and proc macros only when syntax-aware generation is truly required.",
      "Keep expansions simple enough that generated control flow and allocation behavior remain understandable.",
      "Treat proc macros as compile-time dependencies with real build-time and maintenance cost.",
      "Use precise spans and explicit compile errors rather than opaque panics when generation fails."
    ],
    useWhen: [
      "You are deciding between ordinary abstractions and metaprogramming.",
      "You are building derives, attribute macros, or reusable syntax shorthands.",
      "You are debugging surprising generated code with `cargo expand`."
    ],
    avoidWhen: [
      "A normal function, trait, or generic implementation already communicates the behavior clearly.",
      "The macro would hide non-obvious control flow or allocation costs."
    ],
    pitfalls: [
      "Using proc macros where `macro_rules!` or ordinary Rust would suffice.",
      "Shipping macros with poor error spans that make downstream diagnostics unreadable.",
      "Ignoring compile-time cost and expansion complexity in large codebases."
    ],
    practice: [
      "Replace one repetitive pattern with a helper function and compare it to a macro alternative.",
      "Inspect one derive-heavy call site with `cargo expand` and map it back to the source.",
      "Take one proc-macro idea and justify why syntax-aware generation is necessary."
    ],
    sources: [
      "https://doc.rust-lang.org/reference/macros.html",
      "https://doc.rust-lang.org/stable/reference/procedural-macros.html",
      "https://doc.rust-lang.org/book/ch20-05-macros.html"
    ],
    related: ["tooling-validation", "diagnostics", "performance", "api-design"]
  },
  "systems-interop": {
    title: "Pinning, FFI, Layout, and no_std",
    summary:
      "At Rust's systems boundary, correctness depends on invariants the compiler cannot infer for you: address stability, ABI agreement, layout assumptions, and runtime availability.",
    rules: [
      "Use pinning only for address-sensitive values such as self-referential machinery, intrusive structures, or low-level future implementations.",
      "Keep raw FFI surfaces narrow and wrap them in safe Rust APIs as soon as possible.",
      "Use `repr(C)` and `repr(transparent)` for real ABI or layout contracts, not folklore performance tuning.",
      "Treat `repr(packed)` and field references with extreme care; layout tricks easily become UB.",
      "Use `no_std` when the target lacks the standard runtime, and keep shared logic `std`-light even when the final binary uses `std`."
    ],
    useWhen: [
      "You are implementing lower-level async machinery, raw FFI, or platform-specific code.",
      "You are reviewing ABI, layout, or unsafe boundary assumptions.",
      "You are designing code meant to run in embedded, kernel, or otherwise `no_std` environments."
    ],
    avoidWhen: [
      "The problem is higher-level async orchestration rather than `Pin` or `Future::poll` internals.",
      "You are adding layout attributes or `no_std` constraints without a concrete platform need."
    ],
    pitfalls: [
      "Exposing pinning in public APIs when no address-sensitive invariant exists.",
      "Assuming Rust's default layout is stable for FFI or serialization.",
      "Claiming `no_std` support while quietly depending on `std` behavior or allocator assumptions."
    ],
    practice: [
      "Audit one FFI boundary and identify the exact unsafe contract for types, ownership, and lifetimes.",
      "Explain why `Future::poll` uses `Pin<&mut Self>` and when a type is effectively `Unpin`.",
      "Take one crate and list what would need to change to make its core logic `no_std`-friendly."
    ],
    sources: [
      "https://doc.rust-lang.org/std/pin/",
      "https://doc.rust-lang.org/std/future/trait.Future.html",
      "https://doc.rust-lang.org/nomicon/ffi.html",
      "https://doc.rust-lang.org/reference/type-layout.html",
      "https://doc.rust-lang.org/beta/std/ffi/struct.CString.html",
      "https://doc.rust-lang.org/std/ffi/struct.CStr.html",
      "https://docs.rust-embedded.org/book/intro/no-std.html"
    ],
    related: ["unsafe", "concurrency", "diagnostics", "performance"]
  },
  cargo: {
    title: "Cargo, Modules, and Workspace Structure",
    summary:
      "Cargo layout should make ownership boundaries and public API boundaries obvious. Features and workspace structure should reduce accidental complexity, not create it.",
    rules: [
      "Keep reusable logic in `lib.rs` and keep `main.rs` thin.",
      "Use modules to make privacy explicit; items are private by default and become public deliberately.",
      "Use workspaces when crates should share a `Cargo.lock`, `target`, and common commands.",
      "Keep features additive; enabling one feature should not silently disable behavior elsewhere.",
      "Avoid mutually exclusive features unless a crate split or runtime configuration is clearly worse.",
      "Inspect resolved features with `cargo tree -e features` when builds differ from expectation."
    ],
    useWhen: [
      "You are deciding project layout or refactoring a growing Rust codebase.",
      "You are designing Cargo features for optional functionality.",
      "You are deciding whether multiple crates should move into one workspace."
    ],
    avoidWhen: [
      "You are using features to hide existing public API in a minor release.",
      "You are piling unrelated responsibilities into one crate because the workspace design is not yet clear."
    ],
    pitfalls: [
      "Default features that are hard to disable safely across a dependency graph.",
      "Mutually exclusive features that force global coordination.",
      "Binary-only crates with important logic trapped in `main.rs`, making integration tests awkward."
    ],
    practice: [
      "Split one project into `lib.rs` plus a thin `main.rs` entrypoint.",
      "Audit one feature set and ask whether every feature is additive.",
      "Design a workspace layout for a CLI, core library, and integration-test support crate."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html",
      "https://doc.rust-lang.org/cargo/reference/workspaces.html",
      "https://doc.rust-lang.org/stable/cargo/reference/features.html"
    ],
    related: ["testing", "api-design", "traits", "tooling-validation", "performance"]
  },
  testing: {
    title: "Testing Strategy",
    summary:
      "Rust testing works best when unit tests protect private logic and integration tests protect public behavior.",
    rules: [
      "Use unit tests inside the source file for private implementation details.",
      "Use integration tests in `tests/` for public API behavior across modules.",
      "Keep binary crates thin and move logic into `lib.rs` so integration tests can exercise it.",
      "Use `#[cfg(test)]` only where tests live alongside source code.",
      "Treat tests as behavior specifications, not just regression nets."
    ],
    useWhen: [
      "You are deciding where a test should live.",
      "You are turning a binary-heavy crate into something integration-testable.",
      "You are designing a testing strategy for public APIs and internal helpers."
    ],
    avoidWhen: [
      "You are trying to test binary-only logic that should really be in a library crate.",
      "You are putting shared integration-test helpers in top-level files that Cargo will treat as separate crates."
    ],
    pitfalls: [
      "Testing only happy paths while assuming the type system catches all logic bugs.",
      "Leaving important logic in `main.rs` so integration tests cannot import it cleanly.",
      "Accidentally creating `tests/common.rs` as its own crate instead of a helper module."
    ],
    practice: [
      "Move reusable app logic from `main.rs` into `lib.rs` and add one integration test.",
      "Write one unit test for a private helper and one integration test for the public API using the same behavior.",
      "Create a `tests/common/mod.rs` helper module and reuse it across multiple integration tests."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch11-03-test-organization.html"
    ],
    related: ["cargo", "error-handling", "api-design", "tooling-validation"]
  },
  unsafe: {
    title: "Unsafe Rust",
    summary:
      "Unsafe Rust is for expressing invariants the compiler cannot prove, not for opting out of discipline.",
    rules: [
      "Unsafe does not disable the borrow checker or make invalid references okay.",
      "Keep unsafe blocks small and localize the invariant they rely on.",
      "Expose safe APIs around unsafe internals whenever possible.",
      "Document a `Safety` contract for every unsafe function, trait, and block that relies on caller guarantees.",
      "Prefer stable safe abstractions until profiling, FFI, raw pointers, layout control, or low-level primitives justify unsafe.",
      "In Rust 2024, put unsafe operations inside explicit `unsafe {}` blocks even inside unsafe functions."
    ],
    useWhen: [
      "You are working with FFI, raw pointers, pinned or self-referential machinery, or low-level concurrency primitives.",
      "You are reviewing soundness boundaries in a library.",
      "You are migrating code to Rust 2024 safety lint expectations."
    ],
    avoidWhen: [
      "You only need a redesign of ownership or data layout.",
      "You are using unsafe to bypass the borrow checker without a precise invariant."
    ],
    pitfalls: [
      "Large unsafe regions with undocumented assumptions.",
      "Leaking unsafe details through a supposedly safe public API.",
      "Forgetting that unsound code may still compile cleanly."
    ],
    practice: [
      "Take one unsafe block and write the exact invariant that makes it sound.",
      "Shrink one unsafe region by moving checks into safe code before the block.",
      "Enable `unsafe_op_in_unsafe_fn` and fix one crate by adding explicit unsafe blocks."
    ],
    sources: [
      "https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html",
      "https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-op-in-unsafe-fn.html",
      "https://doc.rust-lang.org/edition-guide/rust-2024/index.html"
    ],
    related: ["concurrency", "lifetimes", "systems-interop", "api-design"]
  },
  "api-design": {
    title: "Rust API Design",
    summary:
      "Library-quality Rust APIs lean on the type system, standard traits, clear ownership, and future-proof public boundaries.",
    rules: [
      "Implement common traits when their semantics are correct: `Clone`, `Debug`, `Eq`, `Ord`, `Hash`, `Default`, `Display`.",
      "Use standard conversion traits like `From`, `AsRef`, and `AsMut` instead of ad-hoc conversion methods where possible.",
      "Avoid boolean or ambiguous optional parameters that hide meaning; prefer newtypes, enums, or builders.",
      "Only smart pointers should implement `Deref` or `DerefMut`.",
      "Keep structs future-proof with private fields unless field-level stability is intentional.",
      "If a trait may be useful as a trait object, keep it object-safe.",
      "Expose intermediate results when it avoids duplicated work and unnecessary allocation."
    ],
    useWhen: [
      "You are designing a public crate API or reviewing one for idiomatic quality.",
      "You are choosing between builder patterns, direct constructors, and config types.",
      "You need library guidance beyond mere code compilation."
    ],
    avoidWhen: [
      "You are optimizing for a closed internal codebase where future-proof public surface is irrelevant.",
      "You are adding custom conventions where standard Rust traits already communicate intent."
    ],
    pitfalls: [
      "Public structs with many exposed fields that freeze the design too early.",
      "Ad-hoc conversion methods where `From` or `AsRef` would compose better.",
      "Using `Deref` to simulate inheritance or avoid explicit methods."
    ],
    practice: [
      "Review one public type and list which common traits should or should not be implemented.",
      "Replace a boolean parameter with an enum or builder and compare call-site clarity.",
      "Take one public struct and redesign it with private fields plus constructors."
    ],
    sources: [
      "https://rust-lang.github.io/api-guidelines/checklist.html",
      "https://doc.rust-lang.org/reference/items/implementations.html",
      "https://doc.rust-lang.org/reference/types/impl-trait.html"
    ],
    related: ["traits", "advanced-type-system", "cargo", "error-handling", "syntax-idioms", "community-lessons"]
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
      "`Box<T>`: single-owner heap indirection, recursive types, trait objects.",
      "`Rc<T>`: shared ownership in single-threaded code.",
      "`Arc<T>`: shared ownership across threads or async tasks.",
      "`RefCell<T>`: single-thread runtime borrow checking.",
      "`Mutex<T>`: cross-thread exclusive mutation.",
      "`RwLock<T>`: read-heavy shared state.",
      "`T: Trait` or argument `impl Trait`: static dispatch.",
      "Return `impl Trait`: hide one concrete return type without boxing.",
      "`dyn Trait`: dynamic dispatch for heterogeneous runtime behavior.",
      "`Option`: absence; `Result`: recoverable failure; `panic!`: broken invariant."
    ],
    depth
  );

  return [
    "## Rust Master Map",
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
      parts.push(bulletSection("API or Architecture Risks", takeItems(card.pitfalls, depth)));
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
    skill: "rust-master",
    checked_on: "2026-03-19",
    selected_topics: selectedTopics,
    goal,
    depth,
    report: buildReport(input, selectedTopics, goal, depth),
    sources
  };
}

export default run;
