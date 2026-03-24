import type { EnvSchema } from '@envra/core'
import { generateEnvExample } from '@envra/core'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

export function runSync(schema: EnvSchema, outFile: string): void {
  const abs = resolve(cwd(), outFile)
  const content = generateEnvExample(schema)
  writeFileSync(abs, content, 'utf8')
  console.log(`Wrote ${abs}`)
}
