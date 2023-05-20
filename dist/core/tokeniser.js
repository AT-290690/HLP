import { RUNES_NAMESPACE, evaluate } from './interpreter.js';
import Inventory from '../extensions/Inventory.js';
import { extensions } from '../extensions/extensions.js';
export const VOID = 0;
export const extract = (item, env) => item.type === 'value' ? item.value : evaluate(item, env);
const tokens = {
    ['+']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to +');
        const operands = args.map((a) => evaluate(a, env));
        if (operands.some((n) => typeof n !== 'number'))
            throw new TypeError('Invalid use of + [] (Not all args are numbers)');
        return operands.reduce((acc, x) => acc + x);
    },
    ['-']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to -');
        const operands = args.map((a) => evaluate(a, env));
        if (operands.some((n) => typeof n !== 'number'))
            throw new TypeError('Invalid use of - [] (Not all args are numbers)');
        // const [first, ...rest] = operands
        return operands.reduce((acc, x) => acc - x);
    },
    ['*']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to *');
        const operands = args.map((a) => evaluate(a, env));
        if (operands.some((n) => typeof n !== 'number'))
            throw new TypeError('Invalid use of * [] (Not all args are numbers)');
        return operands.reduce((acc, x) => acc * x);
    },
    ['/']: (args, env) => {
        if (args.length < 1)
            throw new RangeError('Invalid number of arguments to /');
        const operands = args.map((a) => evaluate(a, env));
        const isNumber = operands.some((n) => typeof n === 'number');
        if (!isNumber)
            throw new TypeError('Invalid use of / [] (Not all args are numbers)');
        const isZero = operands.includes(0);
        if (isZero)
            throw new RangeError('Invalid operation to / (devision by zero)');
        else
            return operands.reduce((acc, x) => (acc * 1) / x, 1);
    },
    ['%']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to %');
        const operands = args.map((a) => evaluate(a, env));
        if (operands.some((n) => typeof n !== 'number'))
            throw new TypeError('Invalid use of % [] (Not all args are numbers)');
        const [left, right] = operands;
        return left % right;
    },
    ['|']: (args, env) => {
        if (!args.length || args.length > 2)
            throw new RangeError('Invalid number of arguments to |');
        const rounder = args.length === 1 ? 0 : evaluate(args[1], env);
        const operand = evaluate(args[0], env);
        if (typeof operand !== 'number' || typeof rounder !== 'number')
            throw new TypeError('Invalid use of | [] (Not all args are numbers)');
        return +operand.toFixed(rounder);
    },
    ['+=']: (args, env) => {
        if (args.length > 2)
            throw new RangeError('Invalid number of arguments to +=');
        const [left, right] = args;
        const a = evaluate(left, env);
        const b = right ? evaluate(right, env) : 1;
        if (typeof a !== 'number' || typeof b !== 'number')
            throw new TypeError('Invalid use of += [] (Not all args are numbers)');
        for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
            if (left.type === 'word' &&
                Object.prototype.hasOwnProperty.call(scope, left.name)) {
                const value = a + b;
                scope[left.name] = value;
                return value;
            }
    },
    ['-=']: (args, env) => {
        if (args.length > 2)
            throw new RangeError('Invalid number of arguments to -=');
        const [left, right] = args;
        const a = evaluate(left, env);
        const b = right ? evaluate(right, env) : 1;
        if (typeof a !== 'number' || typeof b !== 'number')
            throw new TypeError('Invalid use of -= [] (Not all args are numbers)');
        for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
            if (left.type === 'word' &&
                Object.prototype.hasOwnProperty.call(scope, left.name)) {
                const value = a - b;
                scope[left.name] = value;
                return value;
            }
    },
    ['*=']: (args, env) => {
        if (args.length > 2)
            throw new RangeError('Invalid number of arguments to *=');
        const [left, right] = args;
        const a = evaluate(left, env);
        const b = right ? evaluate(right, env) : 1;
        if (typeof a !== 'number' || typeof b !== 'number')
            throw new TypeError('Invalid use of *= [] (Not all args are numbers)');
        for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
            if (left.type === 'word' &&
                Object.prototype.hasOwnProperty.call(scope, left.name)) {
                const value = a * b;
                scope[left.name] = value;
                return value;
            }
    },
    ['~']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to ~');
        const operands = args.map((a) => evaluate(a, env));
        if (operands.some((n) => typeof n !== 'string'))
            throw new TypeError('Invalid use of ~ [] (Not all args are strings)');
        const [first, ...rest] = operands;
        return rest.reduce((acc, x) => (acc += x), first);
    },
    ['?']: (args, env) => {
        if (args.length > 3 || args.length <= 1)
            throw new RangeError('Invalid number of arguments to ? []');
        if (!!evaluate(args[0], env))
            return evaluate(args[1], env);
        else if (args[2])
            return evaluate(args[2], env);
        else
            return 0;
    },
    ['!']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to !');
        return +!extract(args[0], env);
    },
    ['==']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to ==');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first === x);
    },
    ['!=']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to !=');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first !== x);
    },
    ['>']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to >');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first > x);
    },
    ['<']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to <');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first < x);
    },
    ['>=']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to >=');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first >= x);
    },
    ['<=']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to <=');
        const [first, ...rest] = args.map((a) => evaluate(a, env));
        return +rest.every((x) => first <= x);
    },
    ['&&']: (args, env) => {
        if (args.length === 0)
            throw new RangeError('Invalid number of arguments to &&');
        for (let i = 0; i < args.length - 1; ++i)
            if (!!evaluate(args[i], env))
                continue;
            else
                return evaluate(args[i], env);
        return evaluate(args[args.length - 1], env);
    },
    ['||']: (args, env) => {
        if (args.length === 0)
            throw new RangeError('Invalid number of arguments  to ||');
        for (let i = 0; i < args.length - 1; ++i)
            if (!!evaluate(args[i], env))
                return evaluate(args[i], env);
            else
                continue;
        return evaluate(args[args.length - 1], env);
    },
    [':']: (args, env) => {
        let value = VOID;
        args.forEach((arg) => (value = evaluate(arg, env)));
        return value;
    },
    ['void:']: (args, env) => {
        let value = VOID;
        args.forEach((arg) => (value = evaluate(arg, env)));
        return value;
    },
    ['===']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to ===');
        const [f, ...rest] = args.map((a) => evaluate(a, env));
        const first = Inventory.of(f);
        return +rest.every((x) => first.isEqual(Inventory.of(x)));
    },
    ['!==']: (args, env) => {
        if (args.length < 2)
            throw new RangeError('Invalid number of arguments to !==');
        const [f, ...rest] = args.map((a) => evaluate(a, env));
        const first = Inventory.of(f);
        return +rest.every((x) => !first.isEqual(Inventory.of(x)));
    },
    [':=']: (args, env) => {
        if (!args.length)
            throw new RangeError('Invalid number of arguments for := []');
        let name;
        for (let i = 0; i < args.length; ++i) {
            if (i % 2 === 0) {
                const word = args[i];
                if (word.type !== 'word')
                    throw new SyntaxError(`First argument of := [] must be word but got ${word.type ?? VOID}`);
                if (word.name.includes('.') || word.name.includes('-'))
                    throw new SyntaxError(`Invalid use of operation := [] [variable name must not contain . or -] but got ${word.name}`);
                if (word.name in tokens)
                    throw new SyntaxError(`${word.name} is a reserved word`);
                name = word.name;
            }
            else {
                const arg = args[i];
                if (arg.type === 'word' && arg.name in tokens)
                    throw new SyntaxError('To define new names of existing words Use aliases= instead');
                else
                    env[name] = evaluate(arg, env);
            }
        }
        return env[name];
    },
    ["'"]: (args, env) => {
        if (!args.length)
            throw new TypeError(`Invalid number of arguments for ' []`);
        let name = '';
        args.forEach((a) => {
            if (a.type !== 'word')
                throw new SyntaxError(`Invalid use of operation ' [] setting ${a.type === 'apply'
                    ? a.operator.type === 'word'
                        ? a.operator.name
                        : a
                    : a.value} (Arguments must be words)`);
            name = a.name;
            if (name.includes('.') || name.includes('-'))
                throw new SyntaxError(`Invalid use of operation ' [] (variable name must not contain . or -)`);
            env[name] = name;
        });
        return name;
    },
    ['=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for = []');
        if (args[0].type !== 'word')
            throw new TypeError('Argument for = [] must be words');
        const entityName = args[0].name;
        const value = evaluate(args[1], env);
        for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
            if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                scope[entityName] = value;
                return value;
            }
        throw new ReferenceError(`Tried setting an undefined variable: ${entityName} using = []`);
    },
    ['->']: (args, env) => {
        if (!args.length)
            throw new SyntaxError('-> [] need a body');
        const argNames = args.slice(0, args.length - 1).map((expr) => {
            if (expr.type !== 'word')
                throw new TypeError('Argument names of -> [] must be words');
            if (expr.name in tokens)
                throw new SyntaxError(`${expr.name} is a reserved word`);
            return expr.name;
        });
        const body = args[args.length - 1];
        return (...args) => {
            const localEnv = Object.create(env);
            for (let i = 0; i < args.length; ++i)
                localEnv[argNames[i]] = args[i];
            return evaluate(body, localEnv);
        };
    },
    ['=>']: (args, env) => {
        if (!args.length)
            throw new SyntaxError('=> [] need a body');
        const argNames = args.slice(0, args.length - 1).map((expr) => {
            if (expr.type !== 'word')
                throw new TypeError('Argument names of => [] must be words');
            if (expr.name in tokens)
                throw new SyntaxError(`${expr.name} is a reserved word`);
            return expr.name;
        });
        const body = args[args.length - 1];
        return (...args) => {
            if (argNames.length !== args.length)
                throw new TypeError('Invalid number of arguments for => []');
            const localEnv = Object.create(env);
            for (let i = 0; i < args.length; ++i)
                localEnv[argNames[i]] = args[i];
            return evaluate(body, localEnv);
        };
    },
    ['`']: (args, env) => {
        const value = evaluate(args[0], env);
        if (typeof value === 'string' || value == undefined)
            return Number(value);
        else if (typeof value === 'number')
            return value.toString();
        else
            throw new TypeError('Can only cast number or string at ` []');
    },
    ['|>']: (args, env) => evaluate(args[0], env),
    ['!throw']: (args, env) => {
        if (!evaluate(args[0], env))
            throw new Error(`${args[1] ? evaluate(args[1], env) : 'Uknown'} failed! []`);
    },
    ['?==']: (args, env) => {
        if (!args.length || args.length > 2)
            throw new RangeError('Invalid number of arguments for ?== []');
        const entity = evaluate(args[0], env);
        const type = evaluate(args[1], env);
        return +(entity.constructor.name === type.constructor.name);
    },
    ['assert:']: (args, env) => {
        if (args.length < 2 || args.length > 3)
            throw new RangeError('Invalid number of arguments for assert: []');
        if (!evaluate(args[0], env))
            throw new Error(`${args[2] ? evaluate(args[2], env) : ''} ${evaluate(args[1], env)}`);
    },
    ['*loop']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to * loop []');
        const n = evaluate(args[0], env);
        if (typeof n !== 'number')
            throw new TypeError('First argument of * loop [] must be a number');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of * loop [] must be an -> []');
        let out;
        for (let i = 0; i < n; ++i)
            out = callback(i);
        return out;
    },
    // for executing hlp code
    // it's empty here
    // gets re-assigned when
    // the core is initialised
    ['~*']: () => { },
    ['aliases=']: (args, env) => {
        if (!args.length)
            return 0;
        let name;
        for (let i = 0; i < args.length; ++i) {
            if (i % 2 === 0) {
                const word = args[i];
                if (word.type !== 'word')
                    throw new SyntaxError(`First argument of aliases= [] must be word but got ${word.type ?? VOID}`);
                if (word.name in tokens)
                    throw new SyntaxError(`${word.name} is a reserved word`);
                name = word.name;
            }
            else {
                const arg = args[i];
                if (arg.type === 'word') {
                    if (arg.name in tokens)
                        env[RUNES_NAMESPACE][name] = env[RUNES_NAMESPACE][arg.name];
                    else if (arg.name in env)
                        env[name] = env[arg.name];
                    else
                        throw new TypeError('Attempt to alias undefined function at aliases=[]');
                }
                else
                    throw new SyntaxError('aliases= can only be words at aliases=[]');
            }
        }
        return env[name];
    },
    ['void']: VOID,
    ...extensions,
};
export { tokens };
