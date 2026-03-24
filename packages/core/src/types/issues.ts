export type ValidationIssueCode =
  | 'MISSING'
  | 'INVALID_TYPE'
  | 'INVALID_FORMAT'
  | 'REFINEMENT_FAILED'
  | 'DISALLOWED_IN_PROFILE'
  | 'DEPRECATED_USED'
  | 'UNDECLARED_ENV'
  | 'CLIENT_SECRET_FORBIDDEN'

export interface ValidationIssue {
  code: ValidationIssueCode
  key: string
  message: string
  received?: string | undefined
  expected?: string | undefined
  source?: string | undefined
  suggestion?: string | undefined
  secret?: boolean | undefined
}
