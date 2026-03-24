import {
  defineEnv,
  type DefineEnvOptions,
  type EnvraResult,
  type FieldBuilder,
  type InferSchema,
} from '@envra/core'

/**
 * Schema object accepted by `defineNextEnv` / `defineNextPublicEnv`.
 * Uses `FieldBuilder<any>` so concrete builders like `FieldBuilder<string | undefined>`
 * stay assignable (avoids class variance issues with `FieldBuilder<unknown>`).
 */
export type NextEnvSchema = Record<string, FieldBuilder<any>>

export interface DefineNextEnvOptions<
  S extends NextEnvSchema,
  C extends NextEnvSchema,
> extends Pick<DefineEnvOptions, 'onValidationError'> {
  server: S
  client: C
  runtimeEnv: Record<string, string | undefined>
  profile?: string
}

export interface DefineNextPublicEnvOptions<C extends NextEnvSchema>
  extends Pick<DefineEnvOptions, 'onValidationError'> {
  client: C
  runtimeEnv: Record<string, string | undefined>
  profile?: string
}

function assertClientField(key: string, builder: FieldBuilder<any>): void {
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
  S extends NextEnvSchema,
  C extends NextEnvSchema,
>(
  opts: DefineNextEnvOptions<S, C>,
): EnvraResult<InferSchema<S> & InferSchema<C>> {
  for (const [key, builder] of Object.entries(opts.client)) {
    assertClientField(key, builder)
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

/**
 * Client-only Next.js env: same rules as the `client` block in `defineNextEnv`, without a server schema.
 * Safe to import from modules used by Client Components (no server secrets in this path).
 */
export function defineNextPublicEnv<C extends NextEnvSchema>(
  opts: DefineNextPublicEnvOptions<C>,
): EnvraResult<InferSchema<C>> {
  return defineNextEnv({
    server: {},
    client: opts.client,
    runtimeEnv: opts.runtimeEnv,
    profile: opts.profile,
    onValidationError: opts.onValidationError,
  }) as EnvraResult<InferSchema<C>>
}
