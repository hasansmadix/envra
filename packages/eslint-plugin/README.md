# @envra/eslint-plugin

ESLint plugin for [envra](https://github.com/hasansmadix/envra): discourage direct `process.env` usage outside your env definition files.

## Install

```bash
pnpm add -D @envra/eslint-plugin
# or
npm install -D @envra/eslint-plugin
```

Peer: `eslint` >= 8.57.

## Flat config (ESLint 9+)

```js
import { flatRecommended } from "@envra/eslint-plugin";

export default [
  ...flatRecommended,
  {
    rules: {
      "envra/no-process-env": [
        "error",
        { allowGlobs: ["**/env.config.ts", "**/env.ts"] },
      ],
    },
  },
];
```

## Documentation

[github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
