import type { EnvFieldDefinition, EnvVisibility, ParseFn } from './types/schema'

function cloneDef(def: EnvFieldDefinition): EnvFieldDefinition {
  return {
    ...def,
    aliases: [...def.aliases],
    transforms: [...def.transforms],
    refinements: [...def.refinements],
    deprecatedEnvKeys: def.deprecatedEnvKeys ? [...def.deprecatedEnvKeys] : undefined,
    requiredIn: def.requiredIn ? [...def.requiredIn] : undefined,
    onlyIn: def.onlyIn ? [...def.onlyIn] : undefined,
  }
}

export class FieldBuilder<T> {
  private def: EnvFieldDefinition

  constructor(def: EnvFieldDefinition) {
    this.def = def
  }

  optional(): FieldBuilder<T | undefined> {
    return new FieldBuilder({ ...cloneDef(this.def), optional: true }) as FieldBuilder<T | undefined>
  }

  default(value: T): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), defaultValue: value })
  }

  describe(description: string): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), description })
  }

  example(example: string): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), example })
  }

  secret(): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), secret: true })
  }

  serverOnly(): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), visibility: 'server' as EnvVisibility })
  }

  client(): FieldBuilder<T> {
    return new FieldBuilder({ ...cloneDef(this.def), visibility: 'client' as EnvVisibility })
  }

  alias(name: string): FieldBuilder<T> {
    const d = cloneDef(this.def)
    return new FieldBuilder({ ...d, aliases: [...d.aliases, name] })
  }

  deprecated(message: string, legacyEnvKeys?: string[]): FieldBuilder<T> {
    const d = cloneDef(this.def)
    const keys = [...(d.deprecatedEnvKeys ?? []), ...(legacyEnvKeys ?? [])]
    return new FieldBuilder({
      ...d,
      deprecated: message,
      deprecatedEnvKeys: keys.length > 0 ? keys : undefined,
    })
  }

  requiredIn(profiles: string[]): FieldBuilder<T> {
    const d = cloneDef(this.def)
    return new FieldBuilder({ ...d, requiredIn: [...(d.requiredIn ?? []), ...profiles] })
  }

  onlyIn(profiles: string[]): FieldBuilder<T> {
    const d = cloneDef(this.def)
    return new FieldBuilder({ ...d, onlyIn: [...(d.onlyIn ?? []), ...profiles] })
  }

  transform<U>(fn: (value: T) => U): FieldBuilder<U> {
    const d = cloneDef(this.def)
    return new FieldBuilder({
      ...d,
      transforms: [...d.transforms, fn as (value: unknown) => unknown],
    }) as unknown as FieldBuilder<U>
  }

  refine(fn: (value: T) => boolean, message: string): FieldBuilder<T> {
    const d = cloneDef(this.def)
    return new FieldBuilder({
      ...d,
      refinements: [...d.refinements, { fn: fn as (value: unknown) => boolean, message }],
    })
  }

  build(): EnvFieldDefinition {
    return cloneDef(this.def)
  }
}

export function baseField(kind: string, parse: ParseFn): FieldBuilder<unknown> {
  return new FieldBuilder({
    kind,
    optional: false,
    secret: false,
    visibility: 'any',
    aliases: [],
    transforms: [],
    refinements: [],
    parse,
  })
}
