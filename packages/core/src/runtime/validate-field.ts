import type { EnvFieldDefinition } from '../types/schema'
import type { ValidationIssue } from '../types/issues'
import { resolveRawValue } from './resolve-raw-value'
import type { EnvSource } from './resolve-source'

function isEffectiveRequired(def: EnvFieldDefinition, profile: string): boolean {
  if (def.defaultValue !== undefined) return false
  if (def.requiredIn?.includes(profile)) return true
  return !def.optional
}

export function validateField(params: {
  key: string
  def: EnvFieldDefinition
  source: EnvSource
  profile: string
}): { ok: true; value: unknown } | { ok: false; issues: ValidationIssue[] } {
  const { key, def, source, profile } = params
  const issues: ValidationIssue[] = []
  const rawRes = resolveRawValue(key, def, source)
  const raw = rawRes.value

  if (def.onlyIn?.length && !def.onlyIn.includes(profile)) {
    if (raw !== undefined && raw !== '') {
      issues.push({
        code: 'DISALLOWED_IN_PROFILE',
        key,
        message: `Variable is not allowed in profile "${profile}" (only allowed in: ${def.onlyIn.join(', ')})`,
        received: raw,
        secret: def.secret,
      })
      return { ok: false, issues }
    }
  }

  const required = isEffectiveRequired(def, profile)

  if (raw === undefined || raw === '') {
    if (def.defaultValue !== undefined) {
      let value: unknown = def.defaultValue
      for (const t of def.transforms) value = t(value)
      for (const { fn, message } of def.refinements) {
        if (!fn(value)) {
          issues.push({
            code: 'REFINEMENT_FAILED',
            key,
            message,
            secret: def.secret,
          })
          return { ok: false, issues }
        }
      }
      return { ok: true, value }
    }
    if (!required) {
      return { ok: true, value: undefined }
    }
    issues.push({
      code: 'MISSING',
      key,
      message: 'Required environment variable is missing',
      secret: def.secret,
    })
    return { ok: false, issues }
  }

  let parsed: unknown
  try {
    parsed = def.parse(raw)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid value'
    issues.push({
      code: 'INVALID_TYPE',
      key,
      message: msg,
      received: raw,
      secret: def.secret,
    })
    return { ok: false, issues }
  }

  let value: unknown = parsed
  try {
    for (const t of def.transforms) value = t(value)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Transform failed'
    issues.push({
      code: 'INVALID_FORMAT',
      key,
      message: msg,
      received: raw,
      secret: def.secret,
    })
    return { ok: false, issues }
  }

  for (const { fn, message } of def.refinements) {
    if (!fn(value)) {
      issues.push({
        code: 'REFINEMENT_FAILED',
        key,
        message,
        received: String(value),
        secret: def.secret,
      })
      return { ok: false, issues }
    }
  }

  return { ok: true, value }
}
