import { FieldBuilder, baseField } from '../field-builder'

export function oneOf<const T extends readonly string[]>(values: T): FieldBuilder<T[number]> {
  const set = new Set(values)
  return baseField(`enum`, (raw) => {
    const t = raw.trim()
    if (!set.has(t as T[number])) {
      throw new Error(`Expected one of: ${values.join(', ')}`)
    }
    return t as T[number]
  }) as FieldBuilder<T[number]>
}
