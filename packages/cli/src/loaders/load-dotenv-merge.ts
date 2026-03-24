import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'dotenv'
import { env as processEnv } from 'node:process'

export interface LoadedEnvResult {
  /** Merged environment (starts from process.env, then dotenv overlays). */
  env: Record<string, string | undefined>
  /** Keys that appeared in at least one loaded file (for doctor `loaded-only`). */
  loadedKeys: Set<string>
}

function applyParsed(
  merged: Record<string, string | undefined>,
  loadedKeys: Set<string>,
  parsed: Record<string, string>,
) {
  for (const k of Object.keys(parsed)) {
    loadedKeys.add(k)
    merged[k] = parsed[k]
  }
}

/**
 * Merge `process.env` with dotenv file contents.
 * Order: each `--env-file` in order, then optional `<dir>/.env`, then `<dir>/.env.<nodeEnv>` (later overrides).
 */
export function mergeProcessEnvWithDotenvFiles(options: {
  cwd: string
  envFiles: string[]
  envDir?: string
  nodeEnv?: string
  nestPreset?: boolean
}): LoadedEnvResult {
  const merged: Record<string, string | undefined> = { ...processEnv }
  const loadedKeys = new Set<string>()

  for (const f of options.envFiles) {
    const abs = resolve(options.cwd, f)
    if (!existsSync(abs)) continue
    const parsed = parse(readFileSync(abs, 'utf8'))
    applyParsed(merged, loadedKeys, parsed)
  }

  let dir = options.envDir
  if (options.nestPreset && dir === undefined) dir = 'env'
  if (dir !== undefined) {
    const absDir = resolve(options.cwd, dir)
    const nenv = options.nodeEnv ?? (processEnv.NODE_ENV?.trim() || 'development')
    for (const name of ['.env', `.env.${nenv}`]) {
      const p = join(absDir, name)
      if (!existsSync(p)) continue
      const parsed = parse(readFileSync(p, 'utf8'))
      applyParsed(merged, loadedKeys, parsed)
    }
  }

  return { env: merged, loadedKeys }
}
