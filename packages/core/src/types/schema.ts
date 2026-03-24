export type EnvVisibility = 'server' | 'client' | 'any'

export type ParseFn = (raw: string) => unknown

export interface EnvFieldDefinition {
  kind: string
  optional: boolean
  defaultValue?: unknown
  description?: string
  example?: string
  secret: boolean
  visibility: EnvVisibility
  deprecated?: string
  deprecatedEnvKeys?: string[]
  aliases: string[]
  requiredIn?: string[]
  onlyIn?: string[]
  transforms: Array<(value: unknown) => unknown>
  refinements: Array<{ fn: (value: unknown) => boolean; message: string }>
  parse: ParseFn
}

export type EnvSchema = Record<string, EnvFieldDefinition>
