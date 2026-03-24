import type { EnvSchema } from '@envra/core'
import type { ValidationIssue } from '@envra/core'
import { recordToEnvSource, validateSchema } from '@envra/core'

function issuesByKey(issues: ValidationIssue[]): Map<string, ValidationIssue[]> {
  const m = new Map<string, ValidationIssue[]>()
  for (const i of issues) {
    const list = m.get(i.key) ?? []
    list.push(i)
    m.set(i.key, list)
  }
  return m
}

export function runCheck(
  schema: EnvSchema,
  profile: string,
  env: Record<string, string | undefined>,
  json: boolean,
): number {
  const source = recordToEnvSource(env)
  const { issues } = validateSchema(schema, source, profile)
  const byKey = issuesByKey(issues)

  const schemaKeys = Object.keys(schema)
  if (json) {
    const keyResults = schemaKeys.map((key) => {
      const list = byKey.get(key) ?? []
      return { key, ok: list.length === 0, issues: list }
    })
    const out = {
      command: 'check' as const,
      profile,
      issueCount: issues.length,
      keyResults,
    }
    console.log(JSON.stringify(out, null, 2))
    return issues.length ? 1 : 0
  }

  for (const key of schemaKeys) {
    const list = byKey.get(key) ?? []
    if (list.length) {
      console.error(`✖ ${key}`)
      for (const i of list) console.error(`  ${i.message}`)
    } else {
      console.log(`✔ ${key}`)
    }
  }

  if (issues.length) {
    console.error(`\n${issues.length} issue(s)`)
    return 1
  }
  return 0
}
