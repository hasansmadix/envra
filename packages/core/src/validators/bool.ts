import { FieldBuilder, baseField } from '../field-builder'

const truthy = new Set(['1', 'true', 'yes', 'on'])
const falsy = new Set(['0', 'false', 'no', 'off', ''])

export function bool(): FieldBuilder<boolean> {
  return baseField('bool', (raw) => {
    const n = raw.trim().toLowerCase()
    if (truthy.has(n)) return true
    if (falsy.has(n)) return false
    throw new Error('Expected boolean (true/false, 1/0, yes/no)')
  }) as FieldBuilder<boolean>
}
