import type { Rule } from 'eslint'
import picomatch from 'picomatch'
import { relative } from 'node:path'

export interface NoProcessEnvOptions {
  allowGlobs?: string[]
}

type MemberNode = Rule.Node & {
  type: 'MemberExpression'
  object: Rule.Node
  property: Rule.Node
  computed: boolean
  parent?: Rule.Node
}

function isProcessEnvRef(node: Rule.Node): boolean {
  if (node.type !== 'MemberExpression') return false
  const m = node as MemberNode
  if (m.computed) return false
  if (m.object.type !== 'Identifier' || m.object.name !== 'process') return false
  return m.property.type === 'Identifier' && m.property.name === 'env'
}

function rootedInProcessEnv(node: Rule.Node): boolean {
  if (isProcessEnvRef(node)) return true
  if (node.type === 'MemberExpression') return rootedInProcessEnv((node as MemberNode).object)
  return false
}

function fileAllowed(filename: string, cwd: string, allowGlobs: string[]): boolean {
  if (!allowGlobs.length) return false
  const rel = relative(cwd, filename).split('\\').join('/')
  return allowGlobs.some((g) => {
    const isMatch = picomatch(g, { dot: true })
    return isMatch(rel) || isMatch(filename.split('\\').join('/'))
  })
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow process.env; use envra defineEnv result (env.values.*) instead',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowGlobs: {
            type: 'array',
            items: { type: 'string' },
            description: 'File path globs (picomatch) where process.env is allowed',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noProcessEnv:
        'Avoid process.env. Import your envra env module and use env.values.* or env.get(...).',
    },
  },
  create(context) {
    const opts = (context.options[0] as NoProcessEnvOptions | undefined) ?? {}
    const allowGlobs = opts.allowGlobs ?? []
    const cwd = context.cwd ?? process.cwd()
    const filename = context.filename

    function allowed(): boolean {
      if (!filename) return false
      return fileAllowed(filename, cwd, allowGlobs)
    }

    return {
      MemberExpression(node: MemberNode) {
        if (allowed()) return
        if (!rootedInProcessEnv(node)) return
        const parent = node.parent
        if (parent?.type === 'MemberExpression' && (parent as MemberNode).object === node) return
        context.report({ node, messageId: 'noProcessEnv' })
      },
    }
  },
}

export default rule
