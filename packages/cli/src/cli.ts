import { Command } from 'commander'
import { loadConfigModule } from './loaders/load-config'
import { extractSchemaFromModule } from './loaders/extract-schema'
import { runCheck } from './commands/check'
import { runSync } from './commands/sync'
import { runDocs } from './commands/docs'
import { runDoctorCmd } from './commands/doctor'
import { env as processEnv } from 'node:process'

function resolveProfile(profile: string | undefined): string {
  return (
    profile ??
    processEnv.NODE_ENV?.trim() ??
    'development'
  )
}

function loadSchema(config: string) {
  const mod = loadConfigModule(config)
  const schema = extractSchemaFromModule(mod)
  if (!schema) {
    console.error(
      'Could not find env schema. Export defineEnv() result as default or named `env`, or export `envraSchema` / `schema` as field builders.',
    )
    process.exit(2)
  }
  return schema
}

const program = new Command()
program.name('envra').description('envra — typed environment tooling').version('0.1.0')

program
  .command('check')
  .description('Validate current process.env against schema')
  .requiredOption('-c, --config <path>', 'Path to env config module (e.g. ./env.config.ts)')
  .option('-p, --profile <name>', 'Profile (defaults to NODE_ENV or development)')
  .action((opts: { config: string; profile?: string }) => {
    const schema = loadSchema(opts.config)
    const code = runCheck(schema, resolveProfile(opts.profile))
    process.exit(code)
  })

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

program
  .command('doctor')
  .description('Hygiene: validation, undeclared vars, deprecations, typos')
  .requiredOption('-c, --config <path>', 'Path to env config module')
  .option('-p, --profile <name>', 'Profile (defaults to NODE_ENV or development)')
  .action((opts: { config: string; profile?: string }) => {
    const schema = loadSchema(opts.config)
    const code = runDoctorCmd(schema, resolveProfile(opts.profile))
    process.exit(code)
  })

program.parse()
