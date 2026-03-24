import type { EnvSchema } from './types/schema'
import type { ValidationIssue } from './types/issues'
import { validateSchema } from './runtime/validate-schema'
import { recordToEnvSource } from './runtime/resolve-source'
import { closestKeys } from './utils/levenshtein'

export function allDeclaredKeys(schema: EnvSchema): Set<string> {
  const keys = new Set<string>()
  for (const [k, def] of Object.entries(schema)) {
    keys.add(k)
    for (const a of def.aliases) keys.add(a)
    for (const d of def.deprecatedEnvKeys ?? []) keys.add(d)
  }
  return keys
}

export function runDoctor(params: {
  schema: EnvSchema
  env: Record<string, string | undefined>
  profile: string
}): ValidationIssue[] {
  const { schema, env, profile } = params
  const source = recordToEnvSource(env)
  const issues: ValidationIssue[] = []

  const validated = validateSchema(schema, source, profile)
  issues.push(...validated.issues)

  const known = allDeclaredKeys(schema)
  const candidates = [...known]

  for (const legacy of collectDeprecatedEnvKeys(schema)) {
    const val = env[legacy.key]
    if (val !== undefined && String(val).trim() !== '') {
      issues.push({
        code: 'DEPRECATED_USED',
        key: legacy.key,
        message: legacy.message,
        expected: legacy.replaceWith,
      })
    }
  }

  for (const k of Object.keys(env)) {
    if (known.has(k)) continue
    const v = env[k]
    if (v === undefined || String(v).trim() === '') continue
    const suggestions = closestKeys(k, candidates, 2)
    issues.push({
      code: 'UNDECLARED_ENV',
      key: k,
      message: 'Undeclared environment variable is set',
      suggestion: suggestions.length ? `Did you mean ${suggestions.join(', ')}?` : undefined,
    })
  }

  return issues
}

function collectDeprecatedEnvKeys(
  schema: EnvSchema,
): Array<{ key: string; message: string; replaceWith: string }> {
  const out: Array<{ key: string; message: string; replaceWith: string }> = []
  for (const [canonical, def] of Object.entries(schema)) {
    for (const legacy of def.deprecatedEnvKeys ?? []) {
      out.push({
        key: legacy,
        message: def.deprecated ?? `Use ${canonical} instead`,
        replaceWith: canonical,
      })
    }
  }
  return out
}
