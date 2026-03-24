import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command, Option } from 'commander'
import type { DoctorUndeclaredPolicy } from '@envra/core'
import { loadConfigModule } from './loaders/load-config'
import { extractSchemaFromModule } from './loaders/extract-schema'
import { mergeProcessEnvWithDotenvFiles } from './loaders/load-dotenv-merge'
import { runCheck } from './commands/check'
import { runSync } from './commands/sync'
import { runDocs } from './commands/docs'
import { runDoctorCmd } from './commands/doctor'
import { env as processEnv } from 'node:process'
import { cwd } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as { version: string }

function resolveProfile(profile: string | undefined): string {
  return profile ?? processEnv.NODE_ENV?.trim() ?? 'development'
}

function loadSchema(config: string) {
  const mod = loadConfigModule(config)
  const schema = extractSchemaFromModule(mod)
  if (!schema) {
    console.error(
      'Could not find env schema. Export defineEnv() result as default or named `env`, or export field builders as `envraSchema` / `schema` / `environmentFields` / `envFields`.',
    )
    process.exit(2)
  }
  return schema
}

function collectEnvFile(value: string, previous: string[]) {
  return [...previous, value]
}

function buildMergedEnv(opts: {
  envFile: string[]
  envDir?: string
  nodeEnv?: string
  envPresetNest?: boolean
}) {
  return mergeProcessEnvWithDotenvFiles({
    cwd: cwd(),
    envFiles: opts.envFile,
    envDir: opts.envDir,
    nodeEnv: opts.nodeEnv,
    nestPreset: opts.envPresetNest,
  })
}

function envFileOption() {
  return new Option('--env-file <path>', 'Load a .env file (repeatable; later overrides earlier)').argParser(
    collectEnvFile,
  )
}

function sharedEnvOptions(cmd: Command) {
  return cmd
    .addOption(envFileOption().default([]))
    .addOption(new Option('--env-dir <dir>', 'Load <dir>/.env then <dir>/.env.<node-env>'))
    .addOption(
      new Option('--node-env <name>', 'Segment for .env.<name> (default: NODE_ENV or development)'),
    )
    .addOption(new Option('--env-preset <name>', 'Layout: nest → default --env-dir env').choices(['nest']))
}

const program = new Command()
program.name('envra').description('envra — typed environment tooling').version(pkg.version)

sharedEnvOptions(
  program
    .command('check')
    .description('Validate merged env against schema')
    .requiredOption('-c, --config <path>', 'Path to env config module (e.g. ./env.config.ts)')
    .option('-p, --profile <name>', 'Schema profile (defaults to NODE_ENV or development)')
    .option('--json', 'Print JSON result to stdout', false),
).action(
  (opts: {
    config: string
    profile?: string
    envFile: string[]
    envDir?: string
    nodeEnv?: string
    envPreset?: 'nest'
    json: boolean
  }) => {
    const schema = loadSchema(opts.config)
    const { env } = buildMergedEnv({
      envFile: opts.envFile ?? [],
      envDir: opts.envDir,
      nodeEnv: opts.nodeEnv,
      envPresetNest: opts.envPreset === 'nest',
    })
    const code = runCheck(schema, resolveProfile(opts.profile), env, opts.json)
    process.exit(code)
  },
)

program
  .command('sync')
  .description('Generate .env.example from schema')
  .requiredOption('-c, --config <path>', 'Path to env config module')
  .option('-o, --out <path>', 'Output file', '.env.example')
  .action((opts: { config: string; out: string }) => {
    const schema = loadSchema(opts.config)
    runSync(schema, opts.out)
  })

program
  .command('docs')
  .description('Generate ENVIRONMENT.md from schema')
  .requiredOption('-c, --config <path>', 'Path to env config module')
  .option('-o, --out <path>', 'Output file', 'ENVIRONMENT.md')
  .action((opts: { config: string; out: string }) => {
    const schema = loadSchema(opts.config)
    runDocs(schema, opts.out)
  })

sharedEnvOptions(
  program
    .command('doctor')
    .description('Hygiene: validation, undeclared vars, deprecations, typos')
    .requiredOption('-c, --config <path>', 'Path to env config module')
    .option('-p, --profile <name>', 'Schema profile (defaults to NODE_ENV or development)')
    .addOption(
      new Option('--undeclared <policy>', 'How to treat env keys outside the schema')
        .choices(['all', 'ignore-system', 'loaded-only'])
        .default('ignore-system'),
    )
    .option('--json', 'Print JSON result to stdout', false),
).action(
  (opts: {
    config: string
    profile?: string
    undeclared: DoctorUndeclaredPolicy
    envFile: string[]
    envDir?: string
    nodeEnv?: string
    envPreset?: 'nest'
    json: boolean
  }) => {
    const schema = loadSchema(opts.config)
    const { env, loadedKeys } = buildMergedEnv({
      envFile: opts.envFile ?? [],
      envDir: opts.envDir,
      nodeEnv: opts.nodeEnv,
      envPresetNest: opts.envPreset === 'nest',
    })
    const code = runDoctorCmd(schema, resolveProfile(opts.profile), {
      env,
      undeclared: opts.undeclared,
      loadedEnvKeys: opts.undeclared === 'loaded-only' ? loadedKeys : undefined,
      json: opts.json,
    })
    process.exit(code)
  },
)

program.parse()
