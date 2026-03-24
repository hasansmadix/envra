import type { EnvSchema } from '../types/schema'
import type { ValidationIssue } from '../types/issues'
import type { EnvSource } from './resolve-source'
import { validateField } from './validate-field'

export interface ValidateSchemaResult {
  values: Record<string, unknown>
  issues: ValidationIssue[]
}

export function validateSchema(
  schema: EnvSchema,
  source: EnvSource,
  profile: string,
): ValidateSchemaResult {
  const values: Record<string, unknown> = {}
  const issues: ValidationIssue[] = []

  for (const [key, def] of Object.entries(schema)) {
    const outcome = validateField({ key, def, source, profile })
    if (outcome.ok) values[key] = outcome.value
    else issues.push(...outcome.issues)
  }

  return { values, issues }
}
