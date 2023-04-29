const pipeDfs = (stack, parent) => {
    const current = stack.pop();
    if (current) {
        parent.unshift(current);
        pipeDfs(stack, current.type === 'apply' ? current.args : []);
    }
};
const pipeArgs = (expr) => {
    const [first, ...rest] = expr.args;
    if (!first)
        throw new TypeError(`Invalid number of arguments for |> []`);
    if (rest.every((x) => x.type === 'apply')) {
        rest.unshift(first);
        pipeDfs(rest, (expr.args = []));
    }
    else
        throw new TypeError(`Following arguments of|> [] must be -> []`);
};
export const parseApply = (expr, cursor, transform = (expression) => expression) => {
    if (cursor[0] !== '[')
        return { expr, rest: cursor };
    cursor = cursor.slice(1);
    const expression = {
        type: 'apply',
        operator: expr,
        args: [],
    };
    while (cursor[0] !== ']') {
        const arg = parseExpression(cursor, transform);
        expression.args.push(arg.expr);
        cursor = arg.rest;
        if (cursor[0] === ';')
            cursor = cursor.slice(1);
        else if (cursor[0] !== ']')
            throw new SyntaxError(`Unexpected token - Expected ';' or ']'" but got "${cursor[0]}"`);
    }
    transform(expression);
    return parseApply(expression, cursor.slice(1), transform);
};
export const parseExpression = (cursor, transform = (expression) => expression) => {
    let match, expr;
    if ((match = /^"([^"]*)"/.exec(cursor)))
        expr = {
            type: 'value',
            value: match[1],
            class: 'string',
        };
    else if ((match = /^-?\d*\.{0,1}\d+\b/.exec(cursor)))
        expr = {
            type: 'value',
            value: Number(match[0]),
            class: 'number',
        };
    else if ((match = /^[^\s\[\];"]+/.exec(cursor)))
        expr = { type: 'word', name: match[0], args: [] };
    else {
        const snapshot = ' ' + cursor.split('];')[0].split(']')[0].trim();
        throw new SyntaxError(`Unexpect syntax: "${snapshot}"`);
    }
    return parseApply(expr, cursor.slice(match[0].length), transform);
};
/**
 *
 * @param program
 * @returns
 * @example
 * parse("1")
 * // { type: "value", value: 1, class: "number" }
 * parse("->[]")
 * // { type: 'apply', operator: { type: 'word', name: '->', args: [] }, args: [] }
 */
export const parse = (program) => {
    const result = parseExpression(program, (expression) => {
        if (expression.type === 'apply' && expression.operator.type === 'word')
            if (expression.operator.name === '|>')
                pipeArgs(expression);
    });
    if (result.rest.length > 0)
        throw new SyntaxError('Unexpected text after program');
    return result.expr;
};
