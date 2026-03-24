export interface EnvSource {
  get(name: string): string | undefined
}

export function recordToEnvSource(record: Record<string, string | undefined>): EnvSource {
  return {
    get(name: string) {
      const v = record[name]
      return v === undefined ? undefined : String(v)
    },
  }
}

export function processEnvSource(): EnvSource {
  return recordToEnvSource(process.env as Record<string, string | undefined>)
}
