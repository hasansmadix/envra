export const REDACTED = '[REDACTED]'

export function maskIfSecret(secret: boolean, value: string | undefined): string | undefined {
  if (!secret) return value
  if (value === undefined) return undefined
  return REDACTED
}
