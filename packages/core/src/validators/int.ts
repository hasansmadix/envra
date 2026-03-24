import { FieldBuilder, baseField } from '../field-builder'

export function int(): FieldBuilder<number> {
  return baseField('int', (raw) => {
    const trimmed = raw.trim()
    if (trimmed === '') throw new Error('Expected integer')
    const value = Number(trimmed)
    if (!Number.isInteger(value)) throw new Error('Expected integer')
    return value
  }) as FieldBuilder<number>
}
