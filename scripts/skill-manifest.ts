import matter from "gray-matter";

export type RuntimeSkillManifest = {
  name: string;
  version: string;
  description?: string;
  entry?: string;
  env_requirements: string[];
  input_schema: Record<string, unknown>;
  body: string;
  rawContent: string;
};

function assertString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Frontmatter field "${fieldName}" phải là string không rỗng.`);
  }
}

function assertStringArray(value: unknown, fieldName: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Frontmatter field "${fieldName}" phải là mảng string không rỗng.`);
  }
}

function assertObject(value: unknown, fieldName: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Frontmatter field "${fieldName}" phải là object hợp lệ.`);
  }
}

export function extractRuntimeManifestBlock(markdownBody: string): string {
  const match = markdownBody.match(/```ya?ml\s+runtime-manifest\s*\r?\n([\s\S]*?)```/i);
  if (!match) {
    throw new Error('Không tìm thấy khối runtime manifest. Hãy thêm code fence dạng ```yaml runtime-manifest trong SKILL.md.');
  }

  return match[1].trim();
}

export function parseSkillFile(rawContent: string): RuntimeSkillManifest {
  const parsed = matter(rawContent);
  const frontmatter = parsed.data as Record<string, unknown>;

  assertString(frontmatter.name, "name");
  if (frontmatter.description !== undefined) {
    assertString(frontmatter.description, "description");
  }

  const runtimeYaml = extractRuntimeManifestBlock(parsed.content);
  const runtimeParsed = matter(`---\n${runtimeYaml}\n---`).data as Record<string, unknown>;

  assertString(runtimeParsed.version, "version");
  assertStringArray(runtimeParsed.env_requirements, "env_requirements");
  assertObject(runtimeParsed.input_schema, "input_schema");
  if (runtimeParsed.entry !== undefined) {
    assertString(runtimeParsed.entry, "entry");
  }

  return {
    name: frontmatter.name,
    version: runtimeParsed.version,
    description: frontmatter.description as string | undefined,
    entry: (runtimeParsed.entry as string | undefined) ?? "scripts/index.ts",
    env_requirements: runtimeParsed.env_requirements,
    input_schema: runtimeParsed.input_schema,
    body: parsed.content,
    rawContent
  };
}

export function countLines(content: string): number {
  return content.split(/\r?\n/).length;
}

export function getReferenceLinks(markdownBody: string): string[] {
  return [...markdownBody.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]);
}
