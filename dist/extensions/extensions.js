import { evaluate } from '../core/interpreter.js';
import { VOID } from '../core/tokeniser.js';
import Inventory from './Inventory.js';
const TimeExtension = {
    time_: {
        set_timeout: (args, env) => setTimeout(evaluate(args[0], env), evaluate(args[1], env)),
        set_interval: (args, env) => setInterval(evaluate(args[0], env), evaluate(args[1], env)),
        set_animation: (args, env) => requestAnimationFrame(evaluate(args[0], env)),
    },
};
const UnitsExtension = {
    units_: {
        pixels: (args, env) => `${evaluate(args[0], env)}px`,
        percent: (args, env) => `${evaluate(args[0], env)}percent`,
        viewport_height: (args, env) => `${evaluate(args[0], env)}vh`,
        viewport_width: (args, env) => `${evaluate(args[0], env)}vw`,
        centimeters: (args, env) => `${evaluate(args[0], env)}cm`,
        millimeters: (args, env) => `${evaluate(args[0], env)}mm`,
        inches: (args, env) => `${evaluate(args[0], env)}in`,
        points: (args, env) => `${evaluate(args[0], env)}pt`,
        picas: (args, env) => `${evaluate(args[0], env)}pc`,
    },
};
const DomExtension = {
    dom_: {
        div: () => {
            return {};
        },
        set_attribute: () => {
            return {};
        },
        set_attributes: () => {
            return {};
        },
        get_attribute: () => {
            return {};
        },
        create_element: () => {
            return {};
        },
        remove: () => {
            return {};
        },
        detach: () => {
            return {};
        },
        insert: () => {
            return {};
        },
        append_to: () => {
            return {};
        },
        get_body: () => {
            return {};
        },
        set_value: () => {
            return {};
        },
        get_value: () => 1,
        get_element_by_id: () => {
            return {};
        },
        set_text_content: () => {
            return {};
        },
        set_style: () => {
            return {};
        },
        get_root: () => {
            return {};
        },
        event: () => {
            return {};
        },
        css_link: () => {
            return {};
        },
        load_bulma: () => {
            return {};
        },
        load_milligram: () => {
            return {};
        },
        container: () => {
            return {};
        },
        add_class: () => {
            return {};
        },
        clear: () => {
            return {};
        },
        add_to_box: () => {
            return {};
        },
        box: () => {
            return {};
        },
        click: () => {
            return {};
        },
    },
};
const StringExtension = {
    text_: {
        trim: (args, env) => evaluate(args[0], env).trim(),
        trim_start: (args, env) => evaluate(args[0], env).trimStart(),
        trim_end: (args, env) => evaluate(args[0], env).trimEnd(),
        to_upper_case: (args, env) => evaluate(args[0], env).toUpperCase(),
        to_lower_case: (args, env) => evaluate(args[0], env).toLowerCase(),
        make_regexp: (args, env) => new RegExp(evaluate(args[0], env)),
        match: (args, env) => {
            return evaluate(args[0], env).match(evaluate(args[1], env));
        },
        replace: (args, env) => evaluate(args[0], env).replace(evaluate(args[1], env)),
    },
};
const MathExtension = {
    math_: {
        factorial: (args, env) => Inventory._math_factorial(evaluate(args[0], env)),
        permutations: (args, env) => Inventory._math_factorial(evaluate(args[0], env), evaluate(args[1], env)),
        permutations_array: (args, env) => Inventory._math_permutations_array(evaluate(args[0], env)),
        lerp: (args, env) => {
            const start = evaluate(args[0], env);
            const end = evaluate(args[1], env);
            const amt = evaluate(args[2], env);
            return (1 - amt) * start + amt * end;
        },
        abs: (args, env) => Math.abs(evaluate(args[0], env)),
        mod: (args, env) => {
            const left = evaluate(args[0], env);
            const right = evaluate(args[1], env);
            return ((left % right) + right) % right;
        },
        clamp: (args, env) => {
            const num = evaluate(args[0], env);
            const min = evaluate(args[1], env);
            const max = evaluate(args[2], env);
            return Math.min(Math.max(num, min), max);
        },
        sqrt: (args, env) => Math.sqrt(evaluate(args[0], env)),
        add: (args, env) => evaluate(args[0], env) + evaluate(args[1], env),
        sub: (args, env) => evaluate(args[0], env) - evaluate(args[1], env),
        mult: (args, env) => evaluate(args[0], env) * evaluate(args[1], env),
        pow: (args, env) => evaluate(args[0], env) ** evaluate(args[1], env),
        pow2: (args, env) => evaluate(args[0], env) ** 2,
        divide: (args, env) => evaluate(args[0], env) / evaluate(args[1], env),
        sign: (args, env) => Math.sign(evaluate(args[0], env)),
        trunc: (args, env) => Math.trunc(evaluate(args[0], env)),
        exp: (args, env) => Math.exp(evaluate(args[0], env)),
        floor: (args, env) => Math.floor(evaluate(args[0], env)),
        round: (args, env) => Math.round(evaluate(args[0], env)),
        random: () => Math.random(),
        random_int: (args, env) => {
            const max = evaluate(args[0], env);
            const min = evaluate(args[1], env);
            if (!Number.isInteger(max) || !Number.isInteger(min))
                throw new TypeError('math_random_int arguments must both be integeres');
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        max: (args, env) => Math.max(...args.map((x) => evaluate(x, env))),
        min: (args, env) => Math.min(...args.map((x) => evaluate(x, env))),
        sin: (args, env) => Math.sin(evaluate(args[0], env)),
        cos: (args, env) => Math.cos(evaluate(args[0], env)),
        tan: (args, env) => Math.tan(evaluate(args[0], env)),
        tanh: (args, env) => Math.tanh(evaluate(args[0], env)),
        atan: (args, env) => Math.atan(evaluate(args[0], env)),
        atan2: (args, env) => Math.atan2(evaluate(args[0], env), evaluate(args[1], env)),
        acos: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.acos(N);
            return isNaN(n) ? VOID : n;
        },
        acosh: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.acosh(N);
            return isNaN(n) ? VOID : n;
        },
        asin: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.asin(N);
            return isNaN(n) ? VOID : n;
        },
        asinh: (args, env) => Math.asinh(evaluate(args[0], env)),
        atanh: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.atanh(N);
            return isNaN(n) ? VOID : n;
        },
        hypot: (args, env) => Math.hypot(evaluate(args[0], env), evaluate(args[1], env)),
        fround: (args, env) => Math.fround(evaluate(args[0], env)),
        log10: (args, env) => Math.log10(evaluate(args[0], env)),
        log2: (args, env) => Math.log2(evaluate(args[0], env)),
        log: (args, env) => Math.log(evaluate(args[0], env)),
        sum: (args, env) => evaluate(args[0], env).reduce((acc, item) => (acc += item), 0),
        negative: (args, env) => -evaluate(args[0], env),
        parse_int: (args, env) => parseInt(evaluate(args[0], env).toString(), evaluate(args[1], env)),
        number: (args, env) => Number(evaluate(args[0], env)),
        MIN_INT: Number.MIN_SAFE_INTEGER,
        MAX_INT: Number.MAX_SAFE_INTEGER,
        INFINITY: Number.POSITIVE_INFINITY,
        PI: Math.PI,
        E: Math.E,
        LN10: Math.LN10,
        LOG10E: Math.LOG10E,
        SQRT1_2: Math.SQRT1_2,
        SQRT2: Math.SQRT2,
    },
};
const BitExtension = {
    bit_: {
        make_bit: (args, env) => (evaluate(args[0], env) >>> 0).toString(2),
        and: (args, env) => evaluate(args[0], env) & evaluate(args[1], env),
        not: (args, env) => ~evaluate(args[0], env),
        or: (args, env) => evaluate(args[0], env) | evaluate(args[1], env),
        xor: (args, env) => evaluate(args[0], env) ^ evaluate(args[1], env),
        left_shift: (args, env) => evaluate(args[0], env) << evaluate(args[1], env),
        right_shift: (args, env) => evaluate(args[0], env) >> evaluate(args[1], env),
        un_right_shift: (args, env) => evaluate(args[0], env) >>> evaluate(args[1], env),
    },
};
const Extensions = {
    ...BitExtension,
    ...MathExtension,
    ...StringExtension,
    ...TimeExtension,
    ...DomExtension,
    ...UnitsExtension,
};
const extensions = {};
for (const ext in Extensions) {
    for (const sub in Extensions[ext]) {
        extensions[`${ext}${sub}`] = Extensions[ext][sub];
    }
}
export { extensions };
