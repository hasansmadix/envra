import { FieldBuilder, baseField } from '../field-builder'

export function str(): FieldBuilder<string> {
  return baseField('string', (raw) => raw) as FieldBuilder<string>
}
