import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import matter from "gray-matter";
import * as path from "node:path";

type Frontmatter = {
  name?: string;
  description?: string;
};

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

async function readFrontmatter(filePath: string): Promise<Frontmatter> {
  const content = await fs.readFile(filePath, "utf8");
  return matter(content).data as Frontmatter;
}

async function ensureExists(filePath: string, label: string): Promise<void> {
  try {
    await fs.access(filePath);
    logOk(`${label}: ${path.relative(ROOT_DIR, filePath)}`);
  } catch {
    fail(`Missing ${label}: ${filePath}`);
  }
}

function countLines(content: string): number {
  return content.split(/\r?\n/).length;
}

async function validateSkillMarkdown(skillDir: string, skillName: string): Promise<void> {
  const canonicalSkillPath = path.join(skillDir, "SKILL.md");
  const runtimeSkillPath = path.join(skillDir, "skill.md");

  await ensureExists(canonicalSkillPath, "canonical SKILL.md");
  await ensureExists(runtimeSkillPath, "runtime skill.md");

  const [canonicalContent, runtimeContent, canonicalFrontmatter, runtimeFrontmatter] = await Promise.all([
    fs.readFile(canonicalSkillPath, "utf8"),
    fs.readFile(runtimeSkillPath, "utf8"),
    readFrontmatter(canonicalSkillPath),
    readFrontmatter(runtimeSkillPath)
  ]);

  if (canonicalFrontmatter.name !== skillName) {
    fail(`SKILL.md frontmatter name="${canonicalFrontmatter.name}" does not match folder "${skillName}".`);
  }
  if (runtimeFrontmatter.name !== skillName) {
    fail(`skill.md frontmatter name="${runtimeFrontmatter.name}" does not match folder "${skillName}".`);
  }

  logOk(`SKILL.md lines: ${countLines(canonicalContent)}`);
  logOk(`skill.md lines: ${countLines(runtimeContent)}`);

  if (countLines(canonicalContent) > 500) {
    logWarn("SKILL.md is getting large; split more content into references/.");
  }

  const referenceLinks = [...canonicalContent.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]);
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
  await ensureExists(path.join(skillDir, "index.ts"), "runtime entry");
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
