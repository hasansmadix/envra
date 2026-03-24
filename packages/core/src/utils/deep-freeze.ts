export function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value
  if (Object.isFrozen(value)) return value
  Object.freeze(value)
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item)
    return value
  }
  for (const k of Object.keys(value)) {
    const v = (value as Record<string, unknown>)[k]
    if (v !== null && typeof v === 'object') deepFreeze(v)
  }
  return value
}
