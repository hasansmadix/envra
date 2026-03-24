import type { EnvSchema } from '@envra/core'
import { runDoctor } from '@envra/core'
import { env as processEnv } from 'node:process'

const hardCodes = new Set([
  'MISSING',
  'INVALID_TYPE',
  'INVALID_FORMAT',
  'REFINEMENT_FAILED',
  'DISALLOWED_IN_PROFILE',
  'CLIENT_SECRET_FORBIDDEN',
])

export function runDoctorCmd(schema: EnvSchema, profile: string): number {
  const issues = runDoctor({
    schema,
    env: processEnv as Record<string, string | undefined>,
    profile,
  })

  if (!issues.length) {
    console.log('No issues found.')
    return 0
  }

  for (const i of issues) {
    const icon = hardCodes.has(i.code) ? '✖' : '⚠'
    console.log(`${icon} ${i.key}: ${i.message}`)
    if (i.suggestion) console.log(`  ${i.suggestion}`)
    if (i.expected) console.log(`  use instead: ${i.expected}`)
  }

  const hard = issues.filter((i) => hardCodes.has(i.code))
  return hard.length ? 1 : 0
}
