import type { FieldBuilder } from './field-builder'
import type { InferSchema } from './types/infer'
import type { EnvraResult } from './types/result'
import { EnvValidationError } from './errors/env-error'
import type { EnvSource } from './runtime/resolve-source'
import { recordToEnvSource, processEnvSource } from './runtime/resolve-source'
import { validateSchema } from './runtime/validate-schema'
import { createEnvResult } from './runtime/create-result'

export interface DefineEnvOptions {
  source?: Record<string, string | undefined> | EnvSource
  profile?: string
  onValidationError?: 'throw' | 'collect'
}

export function defineEnv<TSchema extends Record<string, FieldBuilder<unknown>>>(
  schemaInput: TSchema,
  options?: DefineEnvOptions,
): EnvraResult<InferSchema<TSchema>> {
  const schema = Object.fromEntries(
    Object.entries(schemaInput).map(([k, b]) => [k, b.build()]),
  )

  let source: EnvSource
  if (!options?.source) source = processEnvSource()
  else if (typeof (options.source as EnvSource).get === 'function')
    source = options.source as EnvSource
  else source = recordToEnvSource(options.source as Record<string, string | undefined>)

  const profile =
    options?.profile ??
    source.get('NODE_ENV')?.trim() ??
    'development'

  const { values, issues } = validateSchema(schema, source, profile)

  if (issues.length > 0 && options?.onValidationError !== 'collect') {
    throw new EnvValidationError(issues)
  }

  return createEnvResult(schema, values as InferSchema<TSchema>, issues.length ? issues : undefined)
}
