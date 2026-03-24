import type { EnvSchema } from './types/schema'
import { definitionToMeta } from './metadata/field-meta'

export function generateEnvExample(schema: EnvSchema): string {
  const lines: string[] = []
  for (const [key, def] of Object.entries(schema)) {
    if (def.description) lines.push(`# ${def.description}`)
    if (def.secret) {
      lines.push(`${key}=`)
    } else if (def.defaultValue !== undefined) {
      lines.push(`${key}=${String(def.defaultValue)}`)
    } else {
      lines.push(`${key}=`)
    }
    lines.push('')
  }
  return lines.join('\n').trimEnd() + '\n'
}

export function generateEnvironmentMd(schema: EnvSchema): string {
  const rows: string[] = []
  rows.push('# Environment Variables')
  rows.push('')
  rows.push(
    '| Name | Type | Required | Default | Secret | Visibility | Description |',
  )
  rows.push(
    '|------|------|----------|---------|--------|------------|-------------|',
  )
  for (const [key, def] of Object.entries(schema)) {
    const m = definitionToMeta(key, def)
    const req = m.required ? 'yes' : 'no'
    const defVal =
      m.defaultValue === undefined ? '-' : JSON.stringify(m.defaultValue)
    const desc = (m.description ?? '').replace(/\|/g, '\\|')
    rows.push(
      `| ${m.key} | ${m.type} | ${req} | ${defVal} | ${m.secret ? 'yes' : 'no'} | ${m.visibility} | ${desc} |`,
    )
  }
  rows.push('')
  return rows.join('\n')
}
