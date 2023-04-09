import { Expression } from '.'
export const unreachable = (arg: never) => {
  throw new Error(`${arg} should never be reached!`)
}
export const evaluate = (expr: Expression, env: Expression) => {
  switch (expr.type) {
    case 'value':
      return expr.value
    case 'word':
      if (expr.name in env) return env[expr.name]
      else if (expr.name in env[';;runes']) return env[';;runes'][expr.name]
      else throw new ReferenceError(`Undefined variable: ${expr.name}`)
    case 'apply': {
      const tokens = env[';;runes']
      if (expr.operator.type === 'word' && expr.operator.name in tokens)
        return tokens[expr.operator.name](expr.args, env)
      const op = evaluate(expr.operator, env)
      if (typeof op !== 'function')
        throw new TypeError(expr.operator.name + ' is not a -> []')
      return op.apply(
        undefined,
        expr.args.map((arg) => evaluate(arg, env))
      )
    }
  }
}
export const runFromAST = (AST: Expression, env: Expression) => {
  return { result: evaluate(AST, env), env }
}
