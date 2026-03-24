import type { FieldBuilder as FB } from '../field-builder'
import { FieldBuilder, baseField } from '../field-builder'

export function array<T>(of: FB<T>): FieldBuilder<T[]> {
  const inner = of.build()
  return baseField(`array(${inner.kind})`, (raw) => {
    const t = raw.trim()
    if (!t) return []
    const parts = t.split(',').map((s) => s.trim())
    return parts.map((p) => inner.parse(p) as T)
  }) as FieldBuilder<T[]>
}
