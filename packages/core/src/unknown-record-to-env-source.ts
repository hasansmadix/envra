/**
 * Turn Nest / ConfigModule-style `Record<string, unknown>` into string values for `defineEnv` / `EnvSource`.
 * Avoids `String(object)` → `[object Object]`; omits functions.
 */
export function unknownRecordToEnvSource(record: Record<string, unknown>): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, unknownToEnvString(v)]),
  ) as Record<string, string | undefined>
}

function unknownToEnvString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return undefined
    }
  }
  if (typeof value === 'symbol') {
    return value.description !== undefined ? `Symbol(${value.description})` : 'Symbol()'
  }
  if (typeof value === 'function') {
    return undefined
  }
  return undefined
}
