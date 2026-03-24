import type { ValidationIssue } from '../types/issues'
import { REDACTED } from './mask-secret'

export function formatIssues(issues: ValidationIssue[]): string {
  return issues
    .map((issue) => {
      const received =
        issue.secret ? REDACTED : issue.received ?? 'undefined'

      return [
        `✖ ${issue.key}: ${issue.message}`,
        issue.expected ? `  expected: ${issue.expected}` : '',
        issue.received !== undefined || issue.secret ? `  received: ${received}` : '',
        issue.suggestion ? `  suggestion: ${issue.suggestion}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')
}
