import type { EnvSchema } from '@envra/core'
import type { ValidationIssue } from '@envra/core'
import { recordToEnvSource, validateSchema } from '@envra/core'
import { env as processEnv } from 'node:process'

function issuesByKey(issues: ValidationIssue[]): Map<string, ValidationIssue[]> {
  const m = new Map<string, ValidationIssue[]>()
  for (const i of issues) {
    const list = m.get(i.key) ?? []
    list.push(i)
    m.set(i.key, list)
  }
  return m
}

export function runCheck(schema: EnvSchema, profile: string): number {
  const source = recordToEnvSource(processEnv as Record<string, string | undefined>)
  const { issues } = validateSchema(schema, source, profile)
  const byKey = issuesByKey(issues)

  for (const key of Object.keys(schema)) {
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
