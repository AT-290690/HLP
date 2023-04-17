export const unreachable = (arg) => {
    throw new Error(`${arg} should never be reached!`);
};
export const RUNES_NAMESPACE = ';;RUNES';
export const evaluate = (expr, env) => {
    switch (expr.type) {
        case 'value':
            return expr.value;
        case 'word':
            if (expr.name in env)
                return env[expr.name];
            else if (expr.name in env[RUNES_NAMESPACE])
                return env[RUNES_NAMESPACE][expr.name];
            else
                throw new ReferenceError(`Undefined variable: ${expr.name}`);
        case 'apply': {
            const tokens = env[RUNES_NAMESPACE];
            if (expr.operator.type === 'word' && expr.operator.name in tokens)
                return tokens[expr.operator.name](expr.args, env);
            const op = evaluate(expr.operator, env);
            if (typeof op !== 'function')
                throw new TypeError((expr.operator.type === 'word' ? expr.operator.name : 'void') +
                    ' is not a -> []');
            return op.apply(undefined, expr.args.map((arg) => evaluate(arg, env)));
        }
    }
};
export const runFromAST = (AST, env) => {
    return { result: evaluate(AST, env), env };
};
