import type { FieldBuilder } from '../field-builder'

export type InferFromBuilder<B> = B extends FieldBuilder<infer T> ? T : never

export type InferSchema<S extends Record<string, FieldBuilder<unknown>>> = {
  [K in keyof S]: InferFromBuilder<S[K]>
}
