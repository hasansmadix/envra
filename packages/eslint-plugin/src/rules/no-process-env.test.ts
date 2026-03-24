import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import rule from './no-process-env'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('no-process-env', () => {
  it('runs rule tester', () => {
    tester.run('no-process-env', rule, {
      valid: [
        { code: 'const x = env.values.API', filename: 'C:/proj/src/app.ts' },
        {
          code: 'const x = process.env.API',
          filename: 'C:/proj/env.config.ts',
          options: [{ allowGlobs: ['**/env.config.ts'] }],
        },
      ],
      invalid: [
        {
          code: 'const x = process.env.API',
          filename: 'C:/proj/src/app.ts',
          errors: [{ messageId: 'noProcessEnv' }],
        },
        {
          code: 'f(process.env)',
          filename: 'C:/proj/src/app.ts',
          errors: [{ messageId: 'noProcessEnv' }],
        },
      ],
    })
  })
})
