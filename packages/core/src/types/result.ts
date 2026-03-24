import type { ValidationIssue } from './issues'
import type { FieldMeta } from '../metadata/field-meta'

export interface EnvraResult<TValues extends Record<string, unknown>> {
  values: Readonly<TValues>
  get: <K extends keyof TValues>(key: K) => TValues[K]
  has: <K extends keyof TValues>(key: K) => boolean
  meta: <K extends keyof TValues>(key: K) => FieldMeta
  issues?: ValidationIssue[] | undefined
  ok?: boolean | undefined
}
