import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { countLines, getReferenceLinks, parseSkillFile } from "./skill-manifest";

const ROOT_DIR = process.cwd();
const SKILLS_DIR = path.join(ROOT_DIR, "skills");
const RELEASES_AGENT_DIR = path.join(ROOT_DIR, "releases", "agentskills");
const SKILL_CREATOR_DIR = path.join(ROOT_DIR, ".agents", "skills", "skill-creator");
const TSC_BIN = path.join(ROOT_DIR, "node_modules", ".bin", "tsc");
const TS_NODE_BIN = path.join(ROOT_DIR, "node_modules", ".bin", "ts-node");

function logStep(message: string): void {
  console.log(`\n[step] ${message}`);
}

function logOk(message: string): void {
  console.log(`[ok] ${message}`);
}

function logWarn(message: string): void {
  console.log(`[warn] ${message}`);
}

function fail(message: string): never {
  throw new Error(message);
}

function run(command: string, args: string[], label: string): void {
  logStep(label);

  try {
    const output = execFileSync(command, args, {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });

    if (output.trim() !== "") {
      process.stdout.write(output);
      if (!output.endsWith("\n")) {
        process.stdout.write("\n");
      }
    }
  } catch (error) {
    if (!(error instanceof Error) || !("stdout" in error) || !("stderr" in error)) {
      throw error;
    }

    const stdout = String(error.stdout ?? "");
    const stderr = String(error.stderr ?? "");
    if (stdout.trim() !== "") {
      process.stdout.write(stdout);
      if (!stdout.endsWith("\n")) {
        process.stdout.write("\n");
      }
    }
    if (stderr.trim() !== "") {
      process.stderr.write(stderr);
      if (!stderr.endsWith("\n")) {
        process.stderr.write("\n");
      }
    }

    fail(`${label} failed.`);
  }
}

async function ensureExists(filePath: string, label: string): Promise<void> {
  try {
    await fs.access(filePath);
    logOk(`${label}: ${path.relative(ROOT_DIR, filePath)}`);
  } catch {
    fail(`Missing ${label}: ${filePath}`);
  }
}

async function ensureMissing(filePath: string, label: string): Promise<void> {
  try {
    await fs.access(filePath);
    fail(`${label} should not exist anymore: ${path.relative(ROOT_DIR, filePath)}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      logOk(`${label}: not present`);
      return;
    }
    throw error;
  }
}

async function validateSkillMarkdown(skillDir: string, skillName: string): Promise<void> {
  const skillPath = path.join(skillDir, "SKILL.md");
  const legacySkillPath = path.join(skillDir, "skill.md");

  await ensureExists(skillPath, "SKILL.md");
  await ensureMissing(legacySkillPath, "legacy skill.md");

  const skillContent = await fs.readFile(skillPath, "utf8");
  const manifest = parseSkillFile(skillContent);
  const entryPath = manifest.entry ?? "scripts/index.ts";

  if (manifest.name !== skillName) {
    fail(`SKILL.md frontmatter name="${manifest.name}" does not match folder "${skillName}".`);
  }
  if (!entryPath.startsWith("scripts/")) {
    fail(`Runtime entry phải nằm trong scripts/. Hiện tại là "${entryPath}".`);
  }
  await ensureExists(path.join(skillDir, entryPath), `runtime entry ${entryPath}`);

  logOk(`SKILL.md lines: ${countLines(skillContent)}`);
  logOk(`runtime manifest version: ${manifest.version}`);

  if (countLines(skillContent) > 500) {
    logWarn("SKILL.md is getting large; split more content into references/.");
  }

  const referenceLinks = getReferenceLinks(manifest.body);
  for (const relativeLink of new Set(referenceLinks)) {
    await ensureExists(path.join(skillDir, relativeLink), `referenced file ${relativeLink}`);
  }
}

async function main(): Promise<void> {
  const skillName = process.argv[2];
  if (!skillName) {
    fail("Missing skill name. Usage: ts-node scripts/audit-skill.ts <skill-name>");
  }

  const skillDir = path.join(SKILLS_DIR, skillName);
  await ensureExists(skillDir, "skill directory");
  await ensureExists(path.join(SKILL_CREATOR_DIR, "scripts", "quick_validate.py"), "quick_validate.py");
  await ensureExists(path.join(SKILL_CREATOR_DIR, "scripts", "package_skill.py"), "package_skill.py");

  logStep(`audit ${skillName}`);
  await validateSkillMarkdown(skillDir, skillName);

  run("python3", [path.join(SKILL_CREATOR_DIR, "scripts", "quick_validate.py"), skillDir], "Validate AgentSkill format");
  run("python3", [path.join(SKILL_CREATOR_DIR, "scripts", "package_skill.py"), skillDir, RELEASES_AGENT_DIR], "Package AgentSkill archive");
  run(TSC_BIN, ["--noEmit"], "TypeScript typecheck");
  run(TS_NODE_BIN, ["scripts/packager.ts", skillName], "Package runtime skill");

  logStep("summary");
  logOk(`AgentSkill archive: ${path.relative(ROOT_DIR, path.join(RELEASES_AGENT_DIR, `${skillName}.skill`))}`);
  logOk(`Runtime archive: ${path.relative(ROOT_DIR, path.join(ROOT_DIR, "releases", `${skillName}-latest.tar.gz`))}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown audit failure.";
  console.error(`[error] ${message}`);
  process.exitCode = 1;
});
