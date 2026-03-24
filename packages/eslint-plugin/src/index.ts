import noProcessEnv from './rules/no-process-env'

const envraPlugin = {
  meta: {
    name: '@envra/eslint-plugin',
    version: '0.1.0',
  },
  rules: {
    'no-process-env': noProcessEnv,
  },
}

export const flatRecommended = [
  {
    name: 'envra/recommended',
    plugins: {
      envra: envraPlugin,
    },
    rules: {
      'envra/no-process-env': 'error',
    },
  },
]

export default envraPlugin
export { envraPlugin }
