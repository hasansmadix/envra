import type { ValidationIssue } from '../types/issues'
import { formatIssues } from './format-issues'

export class EnvValidationError extends Error {
  readonly issues: ValidationIssue[]

  constructor(issues: ValidationIssue[]) {
    super(formatIssues(issues))
    this.name = 'EnvValidationError'
    this.issues = issues
  }
}
