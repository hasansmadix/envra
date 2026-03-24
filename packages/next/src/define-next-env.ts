import { defineEnv, type DefineEnvOptions } from '@envra/core'
import type { FieldBuilder } from '@envra/core'
import type { InferSchema } from '@envra/core'
import type { EnvraResult } from '@envra/core'

export interface DefineNextEnvOptions<
  S extends Record<string, FieldBuilder<unknown>>,
  C extends Record<string, FieldBuilder<unknown>>,
> extends Pick<DefineEnvOptions, 'onValidationError'> {
  server: S
  client: C
  runtimeEnv: Record<string, string | undefined>
  profile?: string
}

function assertClientField(key: string, builder: FieldBuilder<unknown>): void {
  const def = builder.build()
  if (def.secret || def.visibility === 'server') {
    throw new Error(
      `[envra/next] Client env "${key}" cannot use .secret() or .serverOnly() — use server schema instead.`,
    )
  }
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(
      `[envra/next] Client env "${key}" must start with NEXT_PUBLIC_ (Next.js embeds only these in the client bundle).`,
    )
  }
}

export function defineNextEnv<
  S extends Record<string, FieldBuilder<unknown>>,
  C extends Record<string, FieldBuilder<unknown>>,
>(
  opts: DefineNextEnvOptions<S, C>,
): EnvraResult<InferSchema<S> & InferSchema<C>> {
  for (const [key, builder] of Object.entries(opts.client)) {
    assertClientField(key, builder as FieldBuilder<unknown>)
  }

  const merged = {
    ...opts.server,
    ...opts.client,
  } as Record<string, FieldBuilder<unknown>>

  return defineEnv(merged, {
    source: opts.runtimeEnv,
    profile: opts.profile,
    onValidationError: opts.onValidationError,
  }) as EnvraResult<InferSchema<S> & InferSchema<C>>
}
