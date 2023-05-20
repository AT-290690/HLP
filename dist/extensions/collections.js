import { evaluate } from '../core/interpreter.js';
import { VOID, extract } from '../core/tokeniser.js';
import Inventory from './Inventory.js';
const MAX_KEY = 10;
export const collections = {
    ['>>']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to >>');
        const collection = evaluate(args[0], env);
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of >> must be an -> []');
        return Inventory.iterate(collection, callback, 1);
    },
    ['<<']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to <<');
        const collection = evaluate(args[0], env);
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of << must be an -> []');
        return Inventory.iterate(collection, callback, -1);
    },
    ['>-']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to >-');
        const collection = evaluate(args[0], env);
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of >- must be an -> []');
        return Inventory.filtrate(collection, callback);
    },
    ['*>>']: (args, env) => {
        if (args.length < 2 || args.length > 3)
            throw new RangeError('Invalid number of arguments to *>>');
        const collection = evaluate(args[0], env);
        const callback = evaluate(args[1], env);
        const initial = args[2] ? evaluate(args[2], env) : collection;
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of *>> must be an -> []');
        return Inventory.fold(collection, callback, initial);
    },
    ['*<<']: (args, env) => {
        if (args.length < 2 || args.length > 3)
            throw new RangeError('Invalid number of arguments to *<<');
        const collection = evaluate(args[0], env);
        const callback = evaluate(args[1], env);
        const initial = args[2] ? evaluate(args[2], env) : collection;
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of *<< must be an -> []');
        return Inventory.fold(collection, callback, initial);
    },
    ['.:']: (args, env) => Inventory.from(args.map((item) => extract(item, env))),
    ['::']: (args, env) => {
        let tempKey = '';
        return args.reduce((acc, item, i) => {
            if (i % 2) {
                acc.set(tempKey, extract(item, env));
            }
            else {
                const key = extract(item, env);
                if (typeof key !== 'string') {
                    throw new SyntaxError(`Invalid use of operation :: [] (Only strings can be used as keys) setting ${key} `);
                }
                else if (key.length > MAX_KEY) {
                    throw new RangeError(`Key name "${key}" is too long. Max length is ${MAX_KEY} characters!`);
                }
                tempKey = key;
            }
            return acc;
        }, new Map());
    },
    ['::.?']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for .? []');
        const prop = [];
        for (let i = 1; i < args.length; ++i) {
            const arg = args[i];
            const p = extract(arg, env);
            if (p == undefined)
                throw new TypeError(`Void key for accesing :: ${args[0].type === 'word' ? args[0].name : '::[]'}`);
            prop.push(extract(arg, env).toString());
        }
        if (args[0].type === 'apply' || args[0].type === 'value') {
            const entity = evaluate(args[0], env);
            if (!(entity instanceof Map))
                throw new TypeError(`:: ${args[0]} is not an instance of :: at .? []`);
            return +entity.has(prop[0]);
        }
        else {
            const entityName = args[0].name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    if (!(scope[entityName] instanceof Map))
                        throw new TypeError(`:: ${entityName} is not an instance of :: at .? []`);
                    return +scope[entityName].has(prop[0]);
                }
        }
    },
    ['::.']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for . []');
        const prop = [];
        for (let i = 1; i < args.length; ++i) {
            const arg = args[i];
            const p = extract(arg, env);
            if (p == undefined)
                throw new TypeError(`Void key for accesing :: ${args[0].type === 'word' ? args[0].name : '::[]'}`);
            prop.push(extract(arg, env).toString());
        }
        if (args[0].type === 'apply' || args[0].type === 'value') {
            const entity = evaluate(args[0], env);
            if (!(entity instanceof Map))
                throw new TypeError(`:: ${args[0].type === 'apply' && args[0].operator.type === 'word'
                    ? args[0].operator.name
                    : args[0].type} is not an instance of :: at . []`);
            if (entity == undefined || !entity.has(prop[0]))
                throw new RangeError(`:: [${args[0].type === 'apply' && args[0].operator.type === 'word'
                    ? args[0].operator.name
                    : args[0].type}] doesnt have a . [${prop[0]}]`);
            const entityProperty = entity.get(prop[0]);
            if (typeof entityProperty === 'function') {
                const caller = entity;
                const fn = entityProperty;
                return fn.bind(caller);
            }
            else
                return entityProperty ?? VOID;
        }
        else {
            const entityName = args[0].name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    if (scope[entityName] == undefined ||
                        !(scope[entityName] instanceof Map))
                        throw new TypeError(`:: ${entityName} is not an instance of :: at . []`);
                    if (!scope[entityName].has(prop[0]))
                        throw new RangeError(`:: [${entityName ?? ''}] doesnt have a . [${prop[0]}]`);
                    const entityProperty = scope[entityName].get(prop[0]);
                    if (typeof entityProperty === 'function') {
                        const caller = scope[entityName];
                        const fn = entityProperty;
                        return fn.bind(caller);
                    }
                    else
                        return entityProperty ?? VOID;
                }
        }
    },
    ['::.=']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments for .= []');
        const main = args[0];
        const last = args[args.length - 1];
        const prop = [];
        for (let i = 1; i < args.length - 1; ++i) {
            const arg = args[i];
            const p = extract(arg, env);
            if (p == undefined)
                throw new TypeError(`Void key for accesing :: ${args[0].type === 'word' ? args[0].name : args[0]}`);
            prop.push(extract(arg, env).toString());
        }
        const value = evaluate(last, env);
        if (main.type === 'apply') {
            const entity = evaluate(main, env);
            if (entity == undefined || !(entity instanceof Map))
                throw new TypeError(`:: ${entity.type === 'word' ? entity.name : entity} is not an instance of :: at .= []`);
            entity.set(prop[0], value);
            return entity;
        }
        else if (main.type === 'word') {
            const entityName = main.name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    const entity = scope[entityName];
                    if (entity == undefined || !(entity instanceof Map))
                        throw new TypeError(`:: ${entityName} is not an instance of :: at .= []`);
                    entity.set(prop[0], value);
                    return entity;
                }
        }
    },
    ['::.!=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for :: .!=  []');
        const prop = [];
        const main = args[0];
        if (main.type === 'value') {
            if (main == undefined || !(main instanceof Map))
                throw new TypeError(`:: ${main} is not an instance of :: at :: .!=  []`);
            main.delete(prop[0]);
            return main;
        }
        for (let i = 1; i < args.length; ++i) {
            const arg = args[i];
            const p = extract(arg, env);
            if (p == undefined)
                throw new TypeError(`Void key for accesing :: ${main.type === 'word' ? main.name : '::[]'}`);
            prop.push(extract(arg, env).toString());
        }
        if (main.type === 'word') {
            const entityName = main.name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    let temp = scope[entityName];
                    if (temp == undefined || !(temp instanceof Map))
                        throw new TypeError(`:: ${entityName} is not an instance of :: at :: .!=  []`);
                    if (!temp.has(prop[0])) {
                        throw new TypeError(`:: "${prop[0]}" doesn't exist in :: at :: .!=  []`);
                    }
                    temp.delete(prop[0]);
                    return temp;
                }
        }
        if (main.type === 'apply') {
            const entity = evaluate(main, env);
            if (entity == undefined || !(entity instanceof Map))
                throw new TypeError(`:: ${entity} is not an instance of :: at :: .!=  []`);
            entity.delete(prop[0]);
            return entity;
        }
    },
    ['.:.']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of . must be an .: []');
        const index = evaluate(args[1], env);
        if (!Number.isInteger(index))
            throw new TypeError('Second argument of . must be a number');
        if ((index < 0 && !array.isInBounds(array.length + index)) ||
            (index >= 0 && !array.isInBounds(index)))
            throw new RangeError(`Index is out of bounds . [${index}] .: [${array.length}]`);
        return array.at(index);
    },
    ['.:.=']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .=');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of  .= must be an .: []');
        const index = evaluate(args[1], env);
        if (!Number.isInteger(index))
            throw new TypeError('Second argument of .= must be a number');
        if (!array.isInBounds(Math.abs(index)))
            throw new RangeError(`Index is out of bounds .= [${index}] .: [${array.length}]`);
        return array.set(index, evaluate(args[2], env));
    },
    ['...']: (args, env) => {
        if (!args.length)
            throw new RangeError('Invalid number of arguments to ... []');
        const [first, ...rest] = args;
        const toSpread = evaluate(first, env);
        if (!Inventory.isBrrr(toSpread))
            throw new SyntaxError('... can only be used on .: []');
        return toSpread.merge(...rest.map((item) => evaluate(item, env)));
    },
    ['.:filter']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: filter[]');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: filter[] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: filter[] must be an -> []');
        return array.filter(callback);
    },
    ['.:reduce>>']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .: [] reduce >> []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: reduce >> [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: reduce >> [] must be an -> []');
        return array.reduce(callback, evaluate(args[2], env));
    },
    ['.:reduce<<']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .: reduce << []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: reduce << [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: reduce << [] must be an -> []');
        return array.reduceRight(callback, evaluate(args[2], env));
    },
    ['.:map>>']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: map >> []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: map >> [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: map >> [] must be an -> []');
        const copy = new Inventory();
        for (let i = 0; i < array.length; ++i)
            copy.set(i, callback(array.get(i), i, array));
        return copy;
    },
    ['.:flatten']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: map >> []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: map >> [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: map >> [] must be an -> []');
        return array.flatten(callback);
    },
    ['.:map<<']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: map << []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: map << [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: map << [] must be an -> []');
        const copy = new Inventory();
        const len = array.length - 1;
        for (let i = len; i >= 0; --i)
            copy.set(len - i, callback(array.get(i), i, array));
        return copy;
    },
    ['.:quick_sort']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: quick_sort []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: quick_sort [] must be an .: []');
        const dir = evaluate(args[1], env);
        if (dir !== -1 && dir !== 1)
            throw new TypeError('Second argument of .: quick_sort [] must be either -1 or 1');
        return array.quickSort(dir);
    },
    ['.:merge_sort']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: merge_sort []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: merge_sort [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: merge_sort [] must be an -> []');
        return array.mergeSort(callback);
    },
    ['.:->::']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: -> :: []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: -> :: [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: -> :: [] must be an -> []');
        return array.group(callback);
    },
    ['.:->:.']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: -> :. []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: -> :. [] must be an .: []');
        return array.uniform();
    },
    ['.:rotate']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .: rotate []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: rotate [] must be an .: []');
        const n = evaluate(args[1], env);
        if (typeof n !== 'number' || n < 0)
            throw new TypeError('Second argument of .: rotate [] must be a positive number');
        const dir = evaluate(args[2], env);
        if (dir !== -1 && dir !== 1)
            throw new TypeError('Third argument of .: rotate [] must be either -1 or 1');
        return array.rotate(n, dir);
    },
    ['.:flat']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: flat []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: flat [] must be an .: []');
        const level = evaluate(args[1], env);
        if (typeof level !== 'number' || level < 0)
            throw new TypeError('Second argument of .: flat [] must be a positive number');
        return array.flat(level);
    },
    ['.:slice']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .: slice []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: slice [] must be an .: []');
        const n1 = evaluate(args[1], env);
        if (typeof n1 !== 'number')
            throw new TypeError('Second argument of .: slice [] must be a number');
        const n2 = evaluate(args[2], env);
        if (typeof n2 !== 'number')
            throw new TypeError('Third argument of .: slice [] must be a number');
        return array.slice(n1, n2);
    },
    ['.:find_index>>']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: find_index >> []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: find_index >> [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of.: find_index >> []  must be an -> []');
        return array.findIndex(callback);
    },
    ['.:find_index<<']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: find_index << []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: find_index << [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: find_index << [] must be an -> []');
        return array.findLastIndex(callback);
    },
    ['.:find>>']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: find >> []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: find >> [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: find >> [] must be an -> []');
        return array.find(callback);
    },
    ['.:find<<']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: find << []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: find << [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: find << [] must be an -> []');
        return array.findLast(callback);
    },
    ['.:every']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: every []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: every [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: every [] must be an -> []');
        return +array.every(callback);
    },
    ['.:some']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: some []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: some [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: some [] must be an -> []');
        return +array.some(callback);
    },
    ['.:<']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: < []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: < [] must be an .: []');
        return array.first;
    },
    ['.:>']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: > []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: > [] must be an .: []');
        return array.last;
    },
    ['.:is_in_bounds']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: is_in_bounds []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: is_in_bounds [] must be an .: []');
        const index = evaluate(args[1], env);
        return +array.isInBounds(Math.abs(index));
    },
    ['.:>=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: >= []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: >= must be an .: []');
        return array.append(evaluate(args[1], env));
    },
    ['.:add_at']: (args, env) => {
        if (args.length < 3)
            throw new RangeError('Invalid number of arguments to .: add_at []');
        const [first, second, ...rest] = args;
        const array = evaluate(first, env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: add_at must be an .: []');
        const index = evaluate(second, env);
        if (!Number.isInteger(index))
            throw new TypeError('Second argument of .: add_at [] must be integer number');
        if (index < 0)
            throw new RangeError('Second argument of .: add_at [] must be a positive integer');
        if (index > array.length)
            throw new RangeError('Second argument of .: add_at [] must be withing the bounds of .: []');
        return array.addAt(index, ...rest.map((item) => evaluate(item, env)));
    },
    ['.:remove_from']: (args, env) => {
        if (args.length !== 3)
            throw new RangeError('Invalid number of arguments to .: remove_from []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: remove_from [] must be an .: []');
        const index = evaluate(args[1], env);
        if (!Number.isInteger(index))
            throw new TypeError('Second argument of .: remove_from [] must be integer number');
        if (index < 0)
            throw new RangeError('Second argument of .: remove_from [] must be a positive integer');
        if (index > array.length)
            throw new RangeError('Second argument of .: remove_from [] must be withing the bounds of .: []');
        const amount = evaluate(args[2], env);
        if (!Number.isInteger(amount) || amount < 0)
            throw new TypeError('Third argument of .: remove_from [] must be a number >= 0');
        return array.removeFrom(index, amount);
    },
    ['.:<=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: <= []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: <= [] must be an .: []');
        return array.prepend(evaluate(args[1], env));
    },
    ['.:>!=']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: >!= []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: >!= [] must be an .: []');
        return array.head();
    },
    ['.:<!=']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: <!= []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: <!= [] must be an .: []');
        return array.tail();
    },
    ['.:>!=.']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: >!=. []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: >!=. [] must be an .: []');
        return array.cut();
    },
    ['.:<!=.']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: <!=. []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: <!=. [] must be an .: []');
        return array.chop();
    },
    ['::entries']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :: entries []');
        const map = evaluate(args[0], env);
        if (!(map.constructor.name === 'Map'))
            throw new TypeError('First argument of :: entries [] must be an :: []');
        return Inventory.from([...map.entries()].map(Inventory.from));
    },
    ['::keys']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :: keys []');
        const map = evaluate(args[0], env);
        if (!(map.constructor.name === 'Map'))
            throw new TypeError('First argument of :: keys [] must be an :: []');
        return Inventory._mapKeys(map);
    },
    ['::->.:']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :: -> .: []');
        const map = evaluate(args[0], env);
        if (!(map.constructor.name === 'Map'))
            throw new TypeError('First argument of :: -> .: [] must be an :: []');
        return Inventory._mapValues(map);
    },
    ['.:0|1']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: 0|1 []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: 0|1 must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: 0|1 be an -> []');
        return array.toBits(callback);
    },
    ['.:...']: (args, env) => {
        if (args.length > 2 || args.length < 1)
            throw new RangeError('Invalid number of arguments to .: ... []');
        const n = evaluate(args[0], env);
        if (typeof n !== 'number')
            throw new TypeError('Second argument of .: ... [] must be an number');
        return Inventory.range(n, evaluate(args[1], env));
    },
    ['.:0']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: 0 []');
        const n = evaluate(args[0], env);
        if (typeof n !== 'number')
            throw new TypeError('Second argument of .: 0 [] must be an number');
        return Inventory.ofSize(n);
    },
    ['.:from_string']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: from_string []');
        const string = evaluate(args[0], env);
        if (typeof string !== 'string')
            throw new TypeError('First argument of .: from_string [] must be a string');
        const separator = evaluate(args[1], env);
        if (typeof separator !== 'string')
            throw new TypeError('Second argument of .: from_string [] must be a string');
        return Inventory.from(string.split(separator));
    },
    ['.:to_string']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: to_string []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: to_string [] must be an .: []');
        const separator = evaluate(args[1], env);
        if (typeof separator !== 'string')
            throw new TypeError('Second argument of .: to_string [] must be a string');
        return array.join(separator);
    },
    ['.:chunks']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: chunks []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: chunks [] must be an .: []');
        const n = evaluate(args[1], env);
        if (typeof n !== 'number')
            throw new TypeError('Second argument of .: chunks [] must be an number');
        return array.partition(n);
    },
    ['.:chunks_if']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: chunks_if []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: chunks_if [] must be an .: []');
        const callback = evaluate(args[1], env);
        if (typeof callback !== 'function')
            throw new TypeError('Second argument of .: chunks_if [] must be an -> []');
        return array.partitionIf(callback);
    },
    ['.:zip']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to .: zip []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: zip [] must be an .: []');
        const other = evaluate(args[1], env);
        if (!Inventory.isBrrr(other))
            throw new TypeError('Second argument of .: zip [] must be an .: []');
        return array.zip(other);
    },
    ['.:unzip']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: unzip []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: unzip [] must be an .: []');
        return array.unzip();
    },
    ['.:~zip']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: ~ zip []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .:~zip [] must be an .: []');
        return array.zipVary();
    },
    ['.:cartesian_product']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: cartesian_product []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: cartesian_product [] must be an .: []');
        return array.cartesianProduct();
    },
    ['.:adjacent_difference>>']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_difference >> []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_difference >> [] must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_difference >> must be a -> []');
        return array.adjacentDifference(callback);
    },
    ['.:adjacent_difference<<']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_difference << []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_difference << must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_difference << must be a -> []');
        return array.adjacentDifferenceRight(callback);
    },
    ['.:adjacent_find>>']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_find >> []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_find >> must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_find >> must be a -> []');
        return array.adjacentFind(callback);
    },
    ['.:adjacent_find<<']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_find << []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_find << must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_find << must be a -> []');
        return array.adjacentFindLast(callback);
    },
    ['.:adjacent_find_index>>']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_find_index >> []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_find_index >> must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_find_index >> must be a -> []');
        return array.adjacentFindIndex(callback);
    },
    ['.:adjacent_find_index<<']: (args, env) => {
        if (args.length < 1 || args.length > 2)
            throw new RangeError('Invalid number of arguments to .: adjacent_find_index << []');
        const array = evaluate(args[0], env);
        if (!Inventory.isBrrr(array))
            throw new TypeError('First argument of .: adjacent_find_index << must be an .: []');
        const callback = args[1] ? evaluate(args[1], env) : undefined;
        if (callback != undefined && typeof callback !== 'function')
            throw new TypeError('Second argument of .: adjacent_find_index << must be a -> []');
        return array.adjacentFindLastIndex(callback);
    },
    ['.:matrix']: (args, env) => {
        if (args.length < 1)
            throw new RangeError('Invalid number of arguments to .: matrix []');
        const dimensions = args.map((arg) => evaluate(arg, env));
        if (dimensions.some((d) => !Number.isInteger(d)))
            throw new TypeError('Argument of .: matrix [] must be integers');
        return Inventory.matrix(...dimensions);
    },
    ['.:length']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to .: length []');
        const array = evaluate(args[0], env);
        if (!(array.constructor.name === 'Inventory'))
            throw new TypeError('First argument of .: length [] must be an .: []');
        return array.length;
    },
    ['::size']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :: size []');
        const map = evaluate(args[0], env);
        if (!(map.constructor.name === 'Map'))
            throw new TypeError('First argument of :: size [] must be an :: []');
        return map.size;
    },
    [':.']: (args, env) => {
        return args.reduce((acc, item) => {
            acc.add(extract(item, env));
            return acc;
        }, new Set());
    },
    [':..?']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for .? []');
        const item = extract(args[1], env);
        if (item == undefined)
            throw new TypeError(`Void item for accesing :. ${args[0].type === 'word' ? args[0].name : ':.[]'}`);
        if (args[0].type === 'apply' || args[0].type === 'value') {
            const entity = evaluate(args[0], env);
            if (!(entity instanceof Set))
                throw new TypeError(`:. ${args[0]} is not an instance of :. at .? []`);
            return +entity.has(item);
        }
        else {
            const entityName = args[0].name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    if (!(scope[entityName] instanceof Set))
                        throw new TypeError(`:. ${entityName} is not an instance of :. at .? []`);
                    return +scope[entityName].has(item);
                }
        }
    },
    [':..=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for .= []');
        const main = args[0];
        const item = extract(args[1], env);
        if (item == undefined)
            throw new TypeError(`Void item for accesing :. ${args[0].type === 'word' ? args[0].name : ':.[]'}`);
        if (main.type === 'apply') {
            const entity = evaluate(main, env);
            if (entity == undefined || !(entity instanceof Set))
                throw new TypeError(`:. ${entity.type === 'word' ? entity.name : entity} is not an instance of :. at .= []`);
            entity.add(item);
            return entity;
        }
        else if (main.type === 'word') {
            const entityName = main.name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    const entity = scope[entityName];
                    if (entity == undefined || !(entity instanceof Set))
                        throw new TypeError(`:. ${entityName} is not an instance of :: at .= []`);
                    entity.add(item);
                    return entity;
                }
        }
    },
    [':..!=']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments for .= []');
        const main = args[0];
        const item = extract(args[1], env);
        if (item == undefined)
            throw new TypeError(`Void item for accesing :. ${args[0].type === 'word' ? args[0].name : ':.[]'}`);
        if (main.type === 'apply') {
            const entity = evaluate(main, env);
            if (entity == undefined || !(entity instanceof Set))
                throw new TypeError(`:. ${entity.type === 'word' ? entity.name : entity} is not an instance of :. at .= []`);
            entity.delete(item);
            return entity;
        }
        else if (main.type === 'word') {
            const entityName = main.name;
            for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
                if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
                    const entity = scope[entityName];
                    if (entity == undefined || !(entity instanceof Set))
                        throw new TypeError(`:. ${entityName} is not an instance of :: at .= []`);
                    entity.delete(item);
                    return entity;
                }
        }
    },
    [':.size']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :. size []');
        const set = evaluate(args[0], env);
        if (!(set.constructor.name === 'Set'))
            throw new TypeError('First argument of :. size [] must be an :. []');
        return set.size;
    },
    [':.union']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to :. union []');
        const a = evaluate(args[0], env);
        if (!(a.constructor.name === 'Set'))
            throw new TypeError('First argument of :. union [] must be an :. []');
        const b = evaluate(args[1], env);
        if (!(b.constructor.name === 'Set'))
            throw new TypeError('Second argument of :. union [] must be an :. []');
        return Inventory._setUnion(a, b);
    },
    [':.xor']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to :. xor []');
        const a = evaluate(args[0], env);
        if (!(a.constructor.name === 'Set'))
            throw new TypeError('First argument of :. xor [] must be an :. []');
        const b = evaluate(args[1], env);
        if (!(b.constructor.name === 'Set'))
            throw new TypeError('Second argument of :. xor [] must be an :. []');
        return Inventory._setXor(a, b);
    },
    [':.intersection']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to :. intersection []');
        const a = evaluate(args[0], env);
        if (!(a.constructor.name === 'Set'))
            throw new TypeError('First argument of :. intersection [] must be an :. []');
        const b = evaluate(args[1], env);
        if (!(b.constructor.name === 'Set'))
            throw new TypeError('Second argument of :. intersection [] must be an :. []');
        return Inventory._setIntersection(a, b);
    },
    [':.difference']: (args, env) => {
        if (args.length !== 2)
            throw new RangeError('Invalid number of arguments to :. difference []');
        const a = evaluate(args[0], env);
        if (!(a.constructor.name === 'Set'))
            throw new TypeError('First argument of :. difference [] must be an :. []');
        const b = evaluate(args[1], env);
        if (!(b.constructor.name === 'Set'))
            throw new TypeError('Second argument of :. difference [] must be an :. []');
        return Inventory._setDifference(a, b);
    },
    [':.->.:']: (args, env) => {
        if (args.length !== 1)
            throw new RangeError('Invalid number of arguments to :. -> .: []');
        const set = evaluate(args[0], env);
        if (!(set.constructor.name === 'Set'))
            throw new TypeError('First argument of :. -> .: [] must be an :. []');
        return Inventory._setValues(set);
    },
};
