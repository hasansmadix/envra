import type { EnvSchema } from './types/schema'

export const envraInternalSchema = Symbol.for('envra.internal.schema')

export function attachInternalSchema<T extends object>(target: T, schema: EnvSchema): T {
  Object.defineProperty(target, envraInternalSchema, {
    value: schema,
    enumerable: false,
    writable: false,
    configurable: false,
  })
  return target
}

export function getInternalSchema(target: unknown): EnvSchema | undefined {
  if (target && typeof target === 'object' && envraInternalSchema in target)
    return (target as Record<symbol, EnvSchema>)[envraInternalSchema]
  return undefined
}
