import { FieldBuilder } from '../field-builder'

export function secret<T>(inner: FieldBuilder<T>): FieldBuilder<T> {
  const def = inner.build()
  return new FieldBuilder<T>({ ...def, secret: true })
}
