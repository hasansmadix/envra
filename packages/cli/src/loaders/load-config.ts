import { createJiti } from 'jiti'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

export function loadConfigModule(configPath: string): Record<string, unknown> {
  const abs = resolve(cwd(), configPath)
  const jiti = createJiti(import.meta.url, { interopDefault: true })
  const mod = jiti(abs)
  return mod as Record<string, unknown>
}
