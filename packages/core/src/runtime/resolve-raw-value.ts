import type { EnvFieldDefinition } from '../types/schema'
import type { EnvSource } from './resolve-source'

export interface RawResolution {
  value: string | undefined
  resolvedFrom: 'primary' | 'alias'
  resolvedKey: string
}

function isEmpty(raw: string | undefined): boolean {
  return raw === undefined || raw.trim() === ''
}

export function resolveRawValue(
  key: string,
  def: EnvFieldDefinition,
  source: EnvSource,
): RawResolution {
  const primary = source.get(key)
  if (!isEmpty(primary)) {
    return { value: primary!.trim(), resolvedFrom: 'primary', resolvedKey: key }
  }
  for (const alias of def.aliases) {
    const v = source.get(alias)
    if (!isEmpty(v)) {
      return { value: v!.trim(), resolvedFrom: 'alias', resolvedKey: alias }
    }
  }
  return { value: undefined, resolvedFrom: 'primary', resolvedKey: key }
}
