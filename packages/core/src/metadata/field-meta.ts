import type { EnvFieldDefinition } from '../types/schema'

export interface FieldMeta {
  key: string
  type: string
  required: boolean
  defaultValue?: unknown
  description?: string
  example?: string
  secret: boolean
  visibility: 'server' | 'client' | 'any'
  deprecated?: string
  aliases: string[]
}

export function definitionToMeta(key: string, def: EnvFieldDefinition): FieldMeta {
  const required = !def.optional && def.defaultValue === undefined

  return {
    key,
    type: def.kind,
    required,
    defaultValue: def.defaultValue,
    description: def.description,
    example: def.example,
    secret: def.secret,
    visibility: def.visibility,
    deprecated: def.deprecated,
    aliases: [...def.aliases],
  }
}
