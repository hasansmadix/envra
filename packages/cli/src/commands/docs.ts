import type { EnvSchema } from '@envra/core'
import { generateEnvironmentMd } from '@envra/core'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

export function runDocs(schema: EnvSchema, outFile: string): void {
  const abs = resolve(cwd(), outFile)
  const content = generateEnvironmentMd(schema)
  writeFileSync(abs, content, 'utf8')
  console.log(`Wrote ${abs}`)
}
