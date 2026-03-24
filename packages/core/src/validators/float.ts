import { FieldBuilder, baseField } from '../field-builder'

export function float(): FieldBuilder<number> {
  return baseField('float', (raw) => {
    const trimmed = raw.trim()
    if (trimmed === '') throw new Error('Expected number')
    const value = Number(trimmed)
    if (Number.isNaN(value)) throw new Error('Expected number')
    return value
  }) as FieldBuilder<number>
}
