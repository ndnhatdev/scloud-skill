import { build } from "esbuild";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as tar from "tar";
import { parseSkillFile, type RuntimeSkillManifest } from "./skill-manifest";

const ROOT_DIR = process.cwd();
const SKILLS_DIR = path.join(ROOT_DIR, "skills");
const RELEASES_DIR = path.join(ROOT_DIR, "releases");

function extractImportSpecifiers(sourceCode: string): string[] {
  const specifiers = new Set<string>();
  const importPattern =
    /\bimport\s+(?:[^"'`]+?\s+from\s+)?["'`]([^"'`]+)["'`]|\brequire\(\s*["'`]([^"'`]+)["'`]\s*\)|\bimport\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

  for (const match of sourceCode.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier) {
      specifiers.add(specifier);
    }
  }

  return [...specifiers];
}

function validateIsolation(skillName: string, sourceCode: string): void {
  const specifiers = extractImportSpecifiers(sourceCode);
  const relativeImports = specifiers.filter((specifier) => specifier.startsWith(".") || path.isAbsolute(specifier));

  if (relativeImports.length > 0) {
    throw new Error(
      `Skill "${skillName}" vi phạm Strict Isolation. Single-file tool không được import file cục bộ: ${relativeImports.join(", ")}`
    );
  }

  const fsImports = specifiers.filter((specifier) => specifier === "fs" || specifier.startsWith("node:fs") || specifier.startsWith("fs/"));

  if (fsImports.length > 0) {
    throw new Error(
      `Skill "${skillName}" vi phạm Stateless Execution. Không được import filesystem API trong skill runtime: ${fsImports.join(", ")}`
    );
  }
}

function validateStatelessBehavior(skillName: string, sourceCode: string): void {
  const forbiddenPatterns = [
    /\bwriteFileSync?\s*\(/,
    /\bappendFileSync?\s*\(/,
    /\bcreateWriteStream\s*\(/,
    /\bmkdirSync?\s*\(/,
    /\brmSync?\s*\(/,
    /\bunlinkSync?\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(sourceCode)) {
      throw new Error(
        `Skill "${skillName}" vi phạm Stateless Execution. Phát hiện thao tác ghi/xóa local filesystem trong source.`
      );
    }
  }
}

function validateEnvRequirements(skillName: string, manifest: RuntimeSkillManifest, sourceCode: string): void {
  const declared = new Set(manifest.env_requirements);
  const usedEnvNames = new Set<string>();

  for (const match of sourceCode.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
    usedEnvNames.add(match[1]);
  }

  const missingDeclarations = [...usedEnvNames].filter((envName) => !declared.has(envName));
  if (missingDeclarations.length > 0) {
    throw new Error(
      `Skill "${skillName}" đang dùng biến môi trường chưa khai báo trong env_requirements: ${missingDeclarations.join(", ")}`
    );
  }
}

async function ensureFileExists(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Không tìm thấy file bắt buộc: ${filePath}`);
  }
}

async function packageSkill(skillName: string): Promise<void> {
  const skillDir = path.join(SKILLS_DIR, skillName);
  const skillEntry = path.join(skillDir, "index.ts");
  const skillManifestPath = path.join(skillDir, "SKILL.md");

  await ensureFileExists(skillEntry);
  await ensureFileExists(skillManifestPath);

  const [sourceCode, rawManifest] = await Promise.all([
    fs.readFile(skillEntry, "utf8"),
    fs.readFile(skillManifestPath, "utf8")
  ]);

  const manifest = parseSkillFile(rawManifest);

  if (manifest.name !== skillName) {
    throw new Error(`Frontmatter name="${manifest.name}" không khớp thư mục skill="${skillName}".`);
  }

  if ((manifest.entry ?? "index.ts") !== "index.ts") {
    throw new Error(`Skill "${skillName}" phải dùng entry cố định là "index.ts" theo kiến trúc single-file tool.`);
  }

  validateIsolation(skillName, sourceCode);
  validateStatelessBehavior(skillName, sourceCode);
  validateEnvRequirements(skillName, manifest, sourceCode);

  await fs.mkdir(RELEASES_DIR, { recursive: true });

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `ai-skill-${skillName}-`));
  const bundledOutputPath = path.join(tempDir, "index.js");
  const copiedManifestPath = path.join(tempDir, "SKILL.md");
  const releaseFilePath = path.join(RELEASES_DIR, `${skillName}-latest.tar.gz`);

  try {
    // Build thành đúng 1 file JS duy nhất để skill có thể phát hành độc lập.
    await build({
      entryPoints: [skillEntry],
      outfile: bundledOutputPath,
      bundle: true,
      platform: "node",
      format: "cjs",
      target: ["node18"],
      minify: true,
      treeShaking: true,
      sourcemap: false,
      legalComments: "none",
      logLevel: "info"
    });

    await fs.copyFile(skillManifestPath, copiedManifestPath);

    // Đóng gói đúng 2 artifact: code đã bundle và canonical SKILL.md.
    await tar.create(
      {
        gzip: true,
        cwd: tempDir,
        file: releaseFilePath
      },
      ["index.js", "SKILL.md"]
    );

    console.log(`Packaged skill "${skillName}" thành công.`);
    console.log(`Manifest version: ${manifest.version}`);
    console.log(`Output: ${releaseFilePath}`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  const skillName = process.argv[2];

  if (!skillName) {
    throw new Error("Thiếu tên skill. Ví dụ: npx ts-node scripts/packager.ts get-weather");
  }

  await packageSkill(skillName);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
  console.error(`Packaging failed: ${message}`);
  process.exitCode = 1;
});
