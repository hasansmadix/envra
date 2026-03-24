import type { EnvSchema } from '../types/schema'
import type { ValidationIssue } from '../types/issues'
import type { EnvraResult } from '../types/result'
import { definitionToMeta } from '../metadata/field-meta'
import { deepFreeze } from '../utils/deep-freeze'
import { attachInternalSchema } from '../internal-schema'

export function createEnvResult<TValues extends Record<string, unknown>>(
  schema: EnvSchema,
  values: TValues,
  issues?: ValidationIssue[],
): EnvraResult<TValues> {
  const frozen = deepFreeze({ ...values }) as TValues

  const result: EnvraResult<TValues> = {
    values: frozen,
    get(key) {
      return frozen[key]
    },
    has(key) {
      return key in frozen && frozen[key] !== undefined
    },
    meta(key) {
      const k = String(key)
      const def = schema[k]
      if (!def) throw new Error(`Unknown env key: ${k}`)
      return definitionToMeta(k, def)
    },
  }

  if (issues?.length) {
    result.issues = issues
    result.ok = false
  } else {
    result.ok = true
  }

  attachInternalSchema(result, schema)
  return result
}
