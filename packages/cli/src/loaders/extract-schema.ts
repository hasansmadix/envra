import type { EnvSchema } from '@envra/core'
import { getInternalSchema } from '@envra/core'
import type { FieldBuilder } from '@envra/core'

function isFieldBuilder(x: unknown): x is FieldBuilder<unknown> {
  return (
    !!x &&
    typeof x === 'object' &&
    'build' in x &&
    typeof (x as FieldBuilder<unknown>).build === 'function'
  )
}

export function extractSchemaFromModule(mod: Record<string, unknown>): EnvSchema | null {
  for (const key of ['default', 'env', 'envConfig'] as const) {
    const c = mod[key]
    const s = getInternalSchema(c)
    if (s) return s
  }

  for (const key of ['envraSchema', 'schema', 'environmentFields', 'envFields'] as const) {
    const map = mod[key]
    if (map && typeof map === 'object' && !Array.isArray(map)) {
      const entries = Object.entries(map as Record<string, unknown>)
      if (entries.length && entries.every(([, v]) => isFieldBuilder(v))) {
        return Object.fromEntries(
          entries.map(([k, v]) => [k, (v as FieldBuilder<unknown>).build()]),
        )
      }
    }
  }

  return null
}
