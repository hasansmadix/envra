import type { DoctorUndeclaredPolicy, EnvSchema } from '@envra/core'
import { runDoctor } from '@envra/core'

const hardCodes = new Set([
  'MISSING',
  'INVALID_TYPE',
  'INVALID_FORMAT',
  'REFINEMENT_FAILED',
  'DISALLOWED_IN_PROFILE',
  'CLIENT_SECRET_FORBIDDEN',
])

export function runDoctorCmd(
  schema: EnvSchema,
  profile: string,
  options: {
    env: Record<string, string | undefined>
    undeclared: DoctorUndeclaredPolicy
    loadedEnvKeys?: Set<string>
    json: boolean
  },
): number {
  const issues = runDoctor({
    schema,
    env: options.env,
    profile,
    undeclaredPolicy: options.undeclared,
    loadedEnvKeys: options.loadedEnvKeys,
  })

  if (!issues.length) {
    if (options.json) {
      console.log(JSON.stringify({ command: 'doctor' as const, profile, issues: [], hardIssueCount: 0 }, null, 2))
    } else {
      console.log('No issues found.')
    }
    return 0
  }

  const hard = issues.filter((i) => hardCodes.has(i.code))

  if (options.json) {
    const out = {
      command: 'doctor' as const,
      profile,
      issues,
      hardIssueCount: hard.length,
      warningCount: issues.length - hard.length,
    }
    console.log(JSON.stringify(out, null, 2))
  } else {
    for (const i of issues) {
      const icon = hardCodes.has(i.code) ? '✖' : '⚠'
      console.log(`${icon} ${i.key}: ${i.message}`)
      if (i.suggestion) console.log(`  ${i.suggestion}`)
      if (i.expected) console.log(`  use instead: ${i.expected}`)
    }
  }

  return hard.length ? 1 : 0
}
